#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const dryRun = process.argv.includes("--dry-run");
const verifyOnly = process.argv.includes("--verify");
const root = process.cwd();

const SOURCE_DIR =
  process.env.SEGURIDAD_JURIDICA_SOURCE_DIR ??
  "/Users/usuario/Desktop/OneDrive_1_10-6-2026";

const CATALOG_PATH = path.resolve(root, "data/seguridad-juridica-catalog.json");

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
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch {
    // No-op if .env.local does not exist.
  }
}

await loadEnvLocal();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!dryRun && !verifyOnly && (!supabaseUrl || !serviceRoleKey)) {
  console.error(
    "Missing env vars. Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
  );
  process.exit(1);
}

const supabase =
  dryRun || !supabaseUrl || !serviceRoleKey
    ? null
    : createClient(supabaseUrl, serviceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });

const catalog = JSON.parse(await fs.readFile(CATALOG_PATH, "utf8"));

async function resolveSourceFile(sourceName) {
  const directPath = path.join(SOURCE_DIR, sourceName);
  try {
    await fs.access(directPath);
    return directPath;
  } catch {
    const entries = await fs.readdir(SOURCE_DIR);
    const normalizedTarget = sourceName.normalize("NFD").replace(/\p{Diacritic}/gu, "");
    const match = entries.find((entry) => {
      const normalizedEntry = entry.normalize("NFD").replace(/\p{Diacritic}/gu, "");
      return normalizedEntry === normalizedTarget;
    });
    if (match) {
      return path.join(SOURCE_DIR, match);
    }
    throw new Error(`Source file not found: ${sourceName}`);
  }
}

async function verifyStorage() {
  if (!supabase) {
    console.error("Supabase client unavailable.");
    process.exit(1);
  }

  let missing = 0;
  for (const item of catalog) {
    const folder = path.posix.dirname(item.storage_path);
    const fileName = path.posix.basename(item.storage_path);
    const { data, error } = await supabase.storage.from("docs-public").list(folder, {
      search: fileName,
    });
    const found = !error && data?.some((entry) => entry.name === fileName);
    if (!found) {
      missing += 1;
      console.log(`MISSING ${item.storage_path}`);
    } else {
      console.log(`OK ${item.storage_path}`);
    }
  }

  console.log(`\nVerify complete: ${catalog.length - missing}/${catalog.length} files present.`);
  process.exit(missing > 0 ? 1 : 0);
}

async function uploadAll() {
  let uploaded = 0;
  for (const item of catalog) {
    const sourcePath = await resolveSourceFile(item.source_file);
    const buffer = await fs.readFile(sourcePath);

    if (dryRun) {
      console.log(
        `[dry-run] ${item.source_file} -> docs-public/${item.storage_path} (${buffer.byteLength} bytes)`,
      );
      uploaded += 1;
      continue;
    }

    const { error } = await supabase.storage.from("docs-public").upload(item.storage_path, buffer, {
      contentType: "application/pdf",
      upsert: true,
    });

    if (error) {
      console.error(`FAILED ${item.storage_path}: ${error.message}`);
      continue;
    }

    uploaded += 1;
    console.log(`UPLOADED docs-public/${item.storage_path}`);
  }

  console.log(`\nUpload complete: ${uploaded}/${catalog.length} files.`);
}

if (verifyOnly) {
  await verifyStorage();
} else {
  await uploadAll();
}
