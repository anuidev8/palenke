#!/usr/bin/env node
/**
 * Removes all objects from the mediateca-ubuntu Supabase bucket.
 *
 * Usage:
 *   node scripts/clean-mediateca-ubuntu-storage.mjs
 *   node scripts/clean-mediateca-ubuntu-storage.mjs --dry-run
 */

import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const dryRun = process.argv.includes("--dry-run");
const root = process.cwd();
const BUCKET = "mediateca-ubuntu";

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
  try {
    const raw = await fs.readFile(envPath, "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIndex = trimmed.indexOf("=");
      if (eqIndex <= 0) continue;
      const key = trimmed.slice(0, eqIndex).trim();
      const value = stripQuotes(trimmed.slice(eqIndex + 1).trim());
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // optional
  }
}

async function listAllObjects(supabase, prefix = "") {
  const objects = [];
  let offset = 0;
  const limit = 1000;

  while (true) {
    const { data, error } = await supabase.storage.from(BUCKET).list(prefix, {
      limit,
      offset,
      sortBy: { column: "name", order: "asc" },
    });
    if (error) throw error;
    if (!data?.length) break;

    for (const entry of data) {
      const entryPath = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.id == null) {
        objects.push(...(await listAllObjects(supabase, entryPath)));
      } else {
        objects.push(entryPath);
      }
    }

    if (data.length < limit) break;
    offset += limit;
  }

  return objects;
}

await loadEnvLocal();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const objects = await listAllObjects(supabase);
console.log(`Found ${objects.length} objects in ${BUCKET}.`);

if (objects.length === 0) {
  console.log("Bucket is already empty.");
  process.exit(0);
}

if (dryRun) {
  for (const objectPath of objects) {
    console.log(`[dry-run] Would delete ${objectPath}`);
  }
  process.exit(0);
}

const batchSize = 100;
for (let i = 0; i < objects.length; i += batchSize) {
  const batch = objects.slice(i, i + batchSize);
  const { error } = await supabase.storage.from(BUCKET).remove(batch);
  if (error) {
    console.error("Delete failed:", error.message);
    process.exit(1);
  }
  console.log(`Deleted ${batch.length} objects (${Math.min(i + batchSize, objects.length)}/${objects.length})`);
}

console.log(`Cleaned ${objects.length} objects from ${BUCKET}.`);
