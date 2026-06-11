#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const dryRun = process.argv.includes("--dry-run");
const root = process.cwd();
const CATALOG_PATH = path.resolve(root, "data/seguridad-juridica-catalog.json");
const SCHEMA_PATH = path.resolve(root, "supabase/migrations/027_seguridad_juridica_document_catalog.sql");

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
    // ignore
  }
}

function isMissingColumnError(error) {
  const code = error?.code ? String(error.code) : "";
  const message = error?.message ? String(error.message) : "";
  return (
    code === "42703" ||
    code === "PGRST204" ||
    message.includes("column") ||
    message.includes("schema cache")
  );
}

function toRow(item) {
  return {
    title: item.title,
    slug: item.slug,
    instrument: "seguridad-juridica",
    council: item.council,
    summary: item.summary,
    author: item.author,
    theme: item.theme,
    subtheme: item.subtheme,
    spatial_coverage: item.spatial_coverage,
    language: item.language,
    status: item.status,
    rights: item.rights,
    related_collection: item.related_collection,
    submodule: item.submodule,
    document_type: item.document_type,
    format: item.format,
    visibility: item.visibility,
    storage_bucket: item.storage_bucket,
    storage_path: item.storage_path,
    published_on: item.published_on,
    delivery_date: item.delivery_date,
    keywords: item.keywords,
    territory: item.territory,
    priority_order: item.priority_order,
  };
}

function toLegacyRow(item) {
  return {
    title: item.title,
    instrument: "seguridad-juridica",
    council: item.council,
    summary: item.summary,
    document_type: item.document_type,
    visibility: item.visibility,
    storage_bucket: item.storage_bucket,
    storage_path: item.storage_path,
    published_on: item.published_on,
    territory: item.territory,
    priority_order: item.priority_order,
  };
}

await loadEnvLocal();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const databaseUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;

if (!dryRun && (!supabaseUrl || !serviceRoleKey)) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const catalog = JSON.parse(await fs.readFile(CATALOG_PATH, "utf8"));
const supabase = dryRun
  ? null
  : createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

async function applySchemaIfPossible() {
  if (!databaseUrl || dryRun) {
    console.log("Skipping SQL schema apply (DATABASE_URL not set or dry-run).");
    return;
  }

  let pg;
  try {
    pg = await import("pg");
  } catch {
    console.log("Skipping SQL schema apply (pg package unavailable).");
    return;
  }

  const sql = await fs.readFile(SCHEMA_PATH, "utf8");
  const client = new pg.default.Client({ connectionString: databaseUrl });
  await client.connect();
  try {
    await client.query(sql);
    console.log("Applied migration SQL via DATABASE_URL.");
  } finally {
    await client.end();
  }
}

async function upsertCatalog() {
  let ok = 0;
  let usedLegacy = false;

  for (const item of catalog) {
    const row = toRow(item);

    if (dryRun) {
      console.log(`[dry-run] upsert ${item.id} -> ${row.slug}`);
      ok += 1;
      continue;
    }

    let { error } = await supabase
      .from("documents")
      .upsert(row, { onConflict: "instrument,storage_path" });

    if (error && isMissingColumnError(error) && !usedLegacy) {
      usedLegacy = true;
      console.warn("Catalog columns missing; falling back to legacy document fields only.");
    }

    if (error && isMissingColumnError(error)) {
      const legacy = toLegacyRow(item);
      const fallback = await supabase
        .from("documents")
        .upsert(legacy, { onConflict: "instrument,storage_path" });
      error = fallback.error;
    }

    if (error) {
      console.error(`FAILED ${item.id}: ${error.message}`);
      continue;
    }

    ok += 1;
    console.log(`UPSERTED ${item.id} ${row.slug}`);
  }

  console.log(`\nCatalog sync complete: ${ok}/${catalog.length} documents.`);
}

await applySchemaIfPossible();
await upsertCatalog();
