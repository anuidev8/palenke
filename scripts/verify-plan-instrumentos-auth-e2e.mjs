#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { createClient } from "@supabase/supabase-js";

const root = process.cwd();
const baseUrl = process.argv.find((arg) => arg.startsWith("--base-url="))?.split("=")[1] ?? "http://localhost:3000";

function stripQuotes(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  return value;
}

async function loadEnvLocal() {
  const envPath = path.resolve(root, ".env.local");
  const raw = await fs.readFile(envPath, "utf8");
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex <= 0) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = stripQuotes(trimmed.slice(eqIndex + 1).trim());
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function requireEnv(key) {
  const value = process.env[key]?.trim();
  if (!value) {
    throw new Error(`Missing required env var: ${key}`);
  }
  return value;
}

function toBase64Url(value) {
  return Buffer.from(value, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function toCookieChunks(key, value, chunkSize = 3180) {
  if (encodeURIComponent(value).length <= chunkSize) {
    return [{ name: key, value }];
  }

  const chunks = [];
  let remaining = value;
  let index = 0;
  while (remaining.length > 0) {
    const part = remaining.slice(0, chunkSize);
    chunks.push({ name: `${key}.${index}`, value: part });
    remaining = remaining.slice(chunkSize);
    index += 1;
  }
  return chunks;
}

function ensureOkResponse(status, expected, label, bodyText) {
  if (!expected.includes(status)) {
    throw new Error(`${label}: expected status ${expected.join("/")}, got ${status}. body=${bodyText}`);
  }
}

async function ensureAuthUser({
  serviceClient,
  email,
  password,
}) {
  const usersResult = await serviceClient.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });
  if (usersResult.error) {
    throw usersResult.error;
  }

  const existing = usersResult.data.users.find((item) => item.email === email);
  if (existing) {
    const updated = await serviceClient.auth.admin.updateUserById(existing.id, {
      password,
      email_confirm: true,
    });
    if (updated.error) {
      throw updated.error;
    }
    return existing.id;
  }

  const created = await serviceClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (created.error || !created.data.user) {
    throw created.error ?? new Error(`Unable to create auth user for ${email}`);
  }
  return created.data.user.id;
}

async function ensureRole({
  serviceClient,
  userId,
  email,
  role,
}) {
  const { error } = await serviceClient.from("users").upsert(
    {
      id: userId,
      email,
      role,
      active: true,
    },
    { onConflict: "id" },
  );
  if (error) {
    throw error;
  }
}

async function ensureApprovedAccessRequest({
  serviceClient,
  email,
  instrumentSlug,
}) {
  const { data: existing, error: queryError } = await serviceClient
    .from("access_requests")
    .select("id")
    .eq("email", email)
    .eq("instrument_slug", instrumentSlug)
    .eq("status", "approved")
    .limit(1)
    .maybeSingle();

  if (queryError) {
    throw queryError;
  }
  if (existing?.id) {
    return existing.id;
  }

  const { data: inserted, error: insertError } = await serviceClient
    .from("access_requests")
    .insert({
      full_name: "QA Plan Instrumentos Internal",
      national_id: "900100200",
      email,
      community: "QA Community",
      motivation: "Validacion E2E signed-url internal document.",
      instrument_slug: instrumentSlug,
      access_level: "admin",
      status: "approved",
      reviewer_notes: "Aprobada para validacion tecnica.",
      reviewed_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (insertError || !inserted?.id) {
    throw insertError ?? new Error("Unable to create approved access_request row.");
  }
  return inserted.id;
}

async function signInAndBuildCookieHeader({
  supabaseUrl,
  anonKey,
  email,
  password,
}) {
  const anonClient = createClient(supabaseUrl, anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });

  const { data, error } = await anonClient.auth.signInWithPassword({
    email,
    password,
  });
  if (error || !data?.session) {
    throw error ?? new Error(`Unable to sign in as ${email}`);
  }

  const projectRef = new URL(supabaseUrl).hostname.split(".")[0];
  const cookieKey = `sb-${projectRef}-auth-token`;
  const rawSession = JSON.stringify(data.session);
  const encodedSession = `base64-${toBase64Url(rawSession)}`;
  const chunks = toCookieChunks(cookieKey, encodedSession);

  return chunks.map(({ name, value }) => `${name}=${encodeURIComponent(value)}`).join("; ");
}

async function getSampleDocumentIds(serviceClient) {
  const { data, error } = await serviceClient
    .from("documents")
    .select("id,instrument,visibility")
    .in("instrument", ["reglamentos", "planes-uso"])
    .order("created_at", { ascending: true });

  if (error || !data?.length) {
    throw error ?? new Error("No document rows available for e2e check.");
  }

  const internal = data.find((row) => row.instrument === "reglamentos" && row.visibility === "internal");
  const sensitive = data.find((row) => row.instrument === "planes-uso" && row.visibility === "sensitive");
  if (!internal?.id || !sensitive?.id) {
    throw new Error("Missing sample document IDs for reglamentos/internal or planes-uso/sensitive.");
  }

  return { internalId: internal.id, sensitiveId: sensitive.id };
}

function waitForServerReady(url, timeoutMs = 45000) {
  const started = Date.now();

  return new Promise((resolve, reject) => {
    const timer = setInterval(async () => {
      if (Date.now() - started > timeoutMs) {
        clearInterval(timer);
        reject(new Error(`Timed out waiting for dev server at ${url}`));
        return;
      }

      try {
        const response = await fetch(url, {
          method: "GET",
          redirect: "manual",
        });
        if (response.status >= 200) {
          clearInterval(timer);
          resolve();
        }
      } catch {
        // continue polling
      }
    }, 1000);
  });
}

async function runHttpChecks({
  baseUrl: resolvedBaseUrl,
  internalDocId,
  sensitiveDocId,
  internalCookieHeader,
  adminCookieHeader,
}) {
  const unauthResponse = await fetch(
    `${resolvedBaseUrl}/api/documents/${internalDocId}/signed-url?mode=redirect`,
    {
      method: "GET",
      redirect: "manual",
    },
  );
  const unauthText = await unauthResponse.text();
  ensureOkResponse(unauthResponse.status, [401], "unauth_internal", unauthText);

  const internalResponse = await fetch(
    `${resolvedBaseUrl}/api/documents/${internalDocId}/signed-url`,
    {
      method: "GET",
      headers: {
        Cookie: internalCookieHeader,
      },
      redirect: "manual",
    },
  );
  const internalText = await internalResponse.text();
  ensureOkResponse(internalResponse.status, [200], "internal_approved_request", internalText);
  const internalJson = JSON.parse(internalText);
  if (!internalJson.url || typeof internalJson.url !== "string") {
    throw new Error("internal_approved_request: missing signed url payload.");
  }

  const internalSensitiveResponse = await fetch(
    `${resolvedBaseUrl}/api/documents/${sensitiveDocId}/signed-url?mode=redirect`,
    {
      method: "GET",
      headers: {
        Cookie: internalCookieHeader,
      },
      redirect: "manual",
    },
  );
  const internalSensitiveText = await internalSensitiveResponse.text();
  ensureOkResponse(internalSensitiveResponse.status, [403], "internal_sensitive_forbidden", internalSensitiveText);

  const adminSensitiveResponse = await fetch(
    `${resolvedBaseUrl}/api/documents/${sensitiveDocId}/signed-url`,
    {
      method: "GET",
      headers: {
        Cookie: adminCookieHeader,
      },
      redirect: "manual",
    },
  );
  const adminSensitiveText = await adminSensitiveResponse.text();
  ensureOkResponse(adminSensitiveResponse.status, [204], "admin_sensitive_delivery", adminSensitiveText);

  return {
    unauth_internal: unauthResponse.status,
    internal_approved_request: internalResponse.status,
    internal_sensitive_forbidden: internalSensitiveResponse.status,
    admin_sensitive_delivery: adminSensitiveResponse.status,
  };
}

async function main() {
  await loadEnvLocal();

  const supabaseUrl = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const anonKey = requireEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY");
  const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");

  const serviceClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const ts = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const internalEmail = `qa.plan.instrumentos.internal+${ts}@example.org`;
  const adminEmail = `qa.plan.instrumentos.admin+${ts}@example.org`;
  const internalPassword = "PlanInstr_Internal_QA_2026!";
  const adminPassword = "PlanInstr_Admin_QA_2026!";

  const internalUserId = await ensureAuthUser({
    serviceClient,
    email: internalEmail,
    password: internalPassword,
  });
  const adminUserId = await ensureAuthUser({
    serviceClient,
    email: adminEmail,
    password: adminPassword,
  });

  await ensureRole({
    serviceClient,
    userId: internalUserId,
    email: internalEmail,
    role: "internal",
  });
  await ensureRole({
    serviceClient,
    userId: adminUserId,
    email: adminEmail,
    role: "admin",
  });

  await ensureApprovedAccessRequest({
    serviceClient,
    email: internalEmail,
    instrumentSlug: "reglamentos",
  });

  const { internalId, sensitiveId } = await getSampleDocumentIds(serviceClient);

  const internalCookieHeader = await signInAndBuildCookieHeader({
    supabaseUrl,
    anonKey,
    email: internalEmail,
    password: internalPassword,
  });
  const adminCookieHeader = await signInAndBuildCookieHeader({
    supabaseUrl,
    anonKey,
    email: adminEmail,
    password: adminPassword,
  });

  const devProcess = spawn("npm", ["run", "dev"], {
    cwd: root,
    stdio: "ignore",
  });

  try {
    await waitForServerReady(baseUrl, 45000);
    const statuses = await runHttpChecks({
      baseUrl,
      internalDocId: internalId,
      sensitiveDocId: sensitiveId,
      internalCookieHeader,
      adminCookieHeader,
    });

    console.log("auth e2e status summary:");
    console.log(JSON.stringify(statuses, null, 2));
    console.log("auth e2e result: PASS");
  } finally {
    devProcess.kill("SIGTERM");
  }
}

main().catch((error) => {
  console.error("auth e2e result: FAIL");
  console.error(error);
  process.exit(1);
});
