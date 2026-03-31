#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { createClient } from "@supabase/supabase-js";

const root = process.cwd();
const baseUrl = process.argv.find((arg) => arg.startsWith("--base-url="))?.split("=")[1] ?? "http://localhost:3000";

function stripQuotes(value) {
  if (
    (value.startsWith("\"") && value.endsWith("\"")) ||
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

async function createPendingRequest(serviceClient, {
  email,
  instrumentSlug,
  accessLevel,
  motivation,
}) {
  const { data, error } = await serviceClient
    .from("access_requests")
    .insert({
      full_name: "QA Plan Instrumentos Admin Actions",
      national_id: `${Math.floor(100000000 + Math.random() * 899999999)}`,
      email,
      community: "QA Community",
      motivation,
      instrument_slug: instrumentSlug,
      access_level: accessLevel,
      status: "pending",
      pcn_affiliation: "QA Affiliation",
      institution: accessLevel === "coordination" ? "QA Institution" : null,
      use_purpose: accessLevel === "coordination" ? "QA validation run" : null,
      data_protection: accessLevel === "coordination" ? "Acepto protocolo QA" : null,
    })
    .select("id")
    .single();

  if (error || !data?.id) {
    throw error ?? new Error("Unable to create pending access request row.");
  }

  return data.id;
}

function decodeEntities(input) {
  return input
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", "\"")
    .replaceAll("&#x27;", "'")
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function parseAttributes(raw) {
  const attrs = {};
  const attrPattern = /([^\s=]+)(?:=(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;
  let match = attrPattern.exec(raw);
  while (match) {
    const key = match[1];
    const value = match[2] ?? match[3] ?? match[4] ?? "";
    attrs[key] = decodeEntities(value);
    match = attrPattern.exec(raw);
  }
  return attrs;
}

function extractActionForms(html) {
  const forms = [];
  const formPattern = /<form\b([^>]*)>([\s\S]*?)<\/form>/gi;

  let match = formPattern.exec(html);
  while (match) {
    const attrs = parseAttributes(match[1]);
    const body = match[2];
    const lowerBody = body.toLowerCase();

    const type = lowerBody.includes('name="reason"')
      ? "reject"
      : lowerBody.includes('name="notes"')
        ? "approve"
        : null;

    if (!type) {
      match = formPattern.exec(html);
      continue;
    }

    const hiddenFields = [];
    const inputPattern = /<input\b([^>]*)>/gi;
    let inputMatch = inputPattern.exec(body);
    while (inputMatch) {
      const inputAttrs = parseAttributes(inputMatch[1]);
      const inputType = (inputAttrs.type ?? "").toLowerCase();
      if (inputType === "hidden" && inputAttrs.name) {
        hiddenFields.push([inputAttrs.name, inputAttrs.value ?? ""]);
      }
      inputMatch = inputPattern.exec(body);
    }

    forms.push({
      type,
      action: attrs.action ?? "",
      method: attrs.method ?? "",
      encType: attrs.enctype ?? attrs.encType ?? "",
      hiddenFields,
    });
    match = formPattern.exec(html);
  }

  return forms;
}

async function submitForm({
  form,
  pageUrl,
  cookieHeader,
  extraFields,
}) {
  const targetUrl = form.action ? new URL(form.action, pageUrl).toString() : pageUrl;
  const useMultipart = form.encType.toLowerCase().includes("multipart/form-data");
  const method = (form.method || "post").toUpperCase();
  const payload = useMultipart ? new FormData() : new URLSearchParams();

  for (const [key, value] of form.hiddenFields) {
    payload.append(key, value);
  }
  for (const [key, value] of Object.entries(extraFields)) {
    payload.append(key, value);
  }

  const headers = {
    Cookie: cookieHeader,
    Origin: new URL(pageUrl).origin,
    Referer: pageUrl,
    Accept: "text/html,application/xhtml+xml",
  };
  if (!useMultipart) {
    headers["Content-Type"] = "application/x-www-form-urlencoded";
  }

  const response = await fetch(targetUrl, {
    method,
    headers,
    body: useMultipart ? payload : payload.toString(),
    redirect: "manual",
  });

  const bodyText = await response.text();
  if (![200, 302, 303].includes(response.status)) {
    throw new Error(
      `Unexpected action response status ${response.status} for ${targetUrl}. body=${bodyText.slice(0, 350)}`,
    );
  }

  return {
    status: response.status,
    location: response.headers.get("location") ?? "",
    bodySample: bodyText.slice(0, 350),
  };
}

async function fetchDetailPage({
  requestId,
  cookieHeader,
}) {
  const detailUrl = `${baseUrl}/admin/solicitudes/${requestId}`;
  const response = await fetch(detailUrl, {
    method: "GET",
    headers: {
      Cookie: cookieHeader,
      Accept: "text/html,application/xhtml+xml",
    },
    redirect: "manual",
  });
  const html = await response.text();
  if (response.status !== 200) {
    throw new Error(`Failed to open admin detail page ${detailUrl}. status=${response.status}, body=${html.slice(0, 300)}`);
  }

  const forms = extractActionForms(html);
  const approveForm = forms.find((item) => item.type === "approve");
  const rejectForm = forms.find((item) => item.type === "reject");

  if (!approveForm || !rejectForm) {
    throw new Error(`Could not extract approve/reject forms from ${detailUrl}. forms_found=${forms.length}`);
  }

  return {
    detailUrl,
    approveForm,
    rejectForm,
  };
}

async function assertRequestStatus(serviceClient, {
  requestId,
  expectedStatus,
  expectedNote,
  responseDebug,
}) {
  const { data, error } = await serviceClient
    .from("access_requests")
    .select("status,reviewer_notes")
    .eq("id", requestId)
    .single();

  if (error || !data) {
    throw error ?? new Error(`Unable to fetch access_requests row ${requestId}`);
  }

  if (data.status !== expectedStatus) {
    throw new Error(
      `Expected status ${expectedStatus} for ${requestId}, got ${data.status}. ` +
      `response_status=${responseDebug?.status ?? "n/a"} response_location=${responseDebug?.location ?? ""} ` +
      `response_body_sample=${responseDebug?.bodySample ?? ""}`,
    );
  }

  const normalizedDbNote = String(data.reviewer_notes ?? "").trim();
  const normalizedExpected = String(expectedNote ?? "").trim();
  if (normalizedDbNote !== normalizedExpected) {
    throw new Error(
      `Expected reviewer_notes "${normalizedExpected}" for ${requestId}, got "${normalizedDbNote}"`,
    );
  }

  return data;
}

async function runChecks({
  serviceClient,
  adminCookieHeader,
  approveRequestId,
  rejectRequestId,
}) {
  const approveNote = "Aprobada por QA E2E automatizado";
  const rejectReason = "Rechazo QA E2E automatizado";

  const approvePage = await fetchDetailPage({
    requestId: approveRequestId,
    cookieHeader: adminCookieHeader,
  });
  const approveResult = await submitForm({
    form: approvePage.approveForm,
    pageUrl: approvePage.detailUrl,
    cookieHeader: adminCookieHeader,
    extraFields: {
      notes: approveNote,
    },
  });

  await assertRequestStatus(serviceClient, {
    requestId: approveRequestId,
    expectedStatus: "approved",
    expectedNote: approveNote,
    responseDebug: approveResult,
  });

  const rejectPage = await fetchDetailPage({
    requestId: rejectRequestId,
    cookieHeader: adminCookieHeader,
  });
  const rejectResult = await submitForm({
    form: rejectPage.rejectForm,
    pageUrl: rejectPage.detailUrl,
    cookieHeader: adminCookieHeader,
    extraFields: {
      reason: rejectReason,
    },
  });

  await assertRequestStatus(serviceClient, {
    requestId: rejectRequestId,
    expectedStatus: "rejected",
    expectedNote: rejectReason,
    responseDebug: rejectResult,
  });

  return {
    approve: {
      requestId: approveRequestId,
      status: approveResult.status,
      location: approveResult.location,
      bodySample: approveResult.status === 200 ? approveResult.bodySample : undefined,
    },
    reject: {
      requestId: rejectRequestId,
      status: rejectResult.status,
      location: rejectResult.location,
      bodySample: rejectResult.status === 200 ? rejectResult.bodySample : undefined,
    },
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

  const stamp = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
  const adminEmail = `qa.plan.instrumentos.admin.actions+${stamp}@example.org`;
  const adminPassword = "PlanInstr_Admin_Actions_QA_2026!";

  const adminUserId = await ensureAuthUser({
    serviceClient,
    email: adminEmail,
    password: adminPassword,
  });
  await ensureRole({
    serviceClient,
    userId: adminUserId,
    email: adminEmail,
    role: "admin",
  });

  const approveRequestId = await createPendingRequest(serviceClient, {
    email: `qa.plan.instrumentos.request.approve+${stamp}@example.org`,
    instrumentSlug: "reglamentos",
    accessLevel: "admin",
    motivation: "Validar flujo approve por Server Action.",
  });
  const rejectRequestId = await createPendingRequest(serviceClient, {
    email: `qa.plan.instrumentos.request.reject+${stamp}@example.org`,
    instrumentSlug: "reglamentos",
    accessLevel: "admin",
    motivation: "Validar flujo reject por Server Action.",
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

    const result = await runChecks({
      serviceClient,
      adminCookieHeader,
      approveRequestId,
      rejectRequestId,
    });

    console.log("admin actions e2e status summary:");
    console.log(JSON.stringify(result, null, 2));
    console.log("admin actions e2e result: PASS");
  } finally {
    devProcess.kill("SIGTERM");
  }
}

main().catch((error) => {
  console.error("admin actions e2e result: FAIL");
  console.error(error);
  process.exit(1);
});
