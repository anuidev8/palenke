#!/usr/bin/env node
/**
 * Delete all Supabase auth users except the emails in KEEP_EMAILS.
 * Usage: node scripts/prune-users-except.mjs [--dry-run]
 */

import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const KEEP_EMAILS = new Set(
  ["devanuidev@gmail.com", "angelarrieta34@gmail.com"].map((e) => e.toLowerCase()),
);

const root = process.cwd();
const dryRun = process.argv.includes("--dry-run");

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

async function listAllAuthUsers(serviceClient) {
  const users = [];
  let page = 1;
  const perPage = 1000;

  while (true) {
    const { data, error } = await serviceClient.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    const batch = data.users ?? [];
    users.push(...batch);
    if (batch.length < perPage) break;
    page += 1;
  }

  return users;
}

async function main() {
  await loadEnvLocal();
  const supabaseUrl = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
  const serviceClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const all = await listAllAuthUsers(serviceClient);
  const toDelete = all.filter((u) => !KEEP_EMAILS.has((u.email ?? "").toLowerCase()));
  const toKeep = all.filter((u) => KEEP_EMAILS.has((u.email ?? "").toLowerCase()));

  console.log(`Total auth users: ${all.length}`);
  console.log(`Keeping (${toKeep.length}):`);
  for (const u of toKeep) {
    console.log(`  - ${u.email} (${u.id})`);
  }
  console.log(`Deleting (${toDelete.length}):`);
  for (const u of toDelete) {
    console.log(`  - ${u.email ?? "(no email)"} (${u.id})`);
  }

  if (dryRun) {
    console.log("\nDry run — no users deleted.");
    return;
  }

  if (toDelete.length === 0) {
    console.log("\nNothing to delete.");
    return;
  }

  async function clearUserReferences(userId) {
    const tables = [
      { table: "access_requests", column: "reviewed_by" },
      { table: "document_download_grants", column: "granted_by" },
      { table: "admin_activity_log", column: "actor_user_id" },
    ];
    for (const { table, column } of tables) {
      const { error } = await serviceClient.from(table).update({ [column]: null }).eq(column, userId);
      if (error && !error.message.includes("does not exist")) {
        throw new Error(`${table}.${column}: ${error.message}`);
      }
    }
    await serviceClient.from("document_download_grants").delete().eq("user_id", userId);
  }

  let deleted = 0;
  let failed = 0;
  for (const u of toDelete) {
    if (!dryRun) {
      await clearUserReferences(u.id);
    }
    const { error } = await serviceClient.auth.admin.deleteUser(u.id);
    if (error) {
      console.error(`FAILED ${u.email}: ${error.message}`);
      failed += 1;
    } else {
      deleted += 1;
    }
  }

  console.log(`\nDone. Deleted: ${deleted}, failed: ${failed}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
