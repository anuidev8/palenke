#!/usr/bin/env node
/**
 * Uploads documentation / launch explainer videos to a public Supabase bucket.
 *
 * Requires: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 *
 * Usage:
 *   node scripts/upload-docs-video.mjs \
 *     --file videos/seguridad-clasificacion/renders/seguridad-clasificacion_2026-09-11_16-03-33.mp4 \
 *     --path videos/seguridad-clasificacion.mp4
 */

import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const BUCKET = "memoria-afroterritorial";

function stripQuotes(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  return value;
}

function parseArgs(argv) {
  const options = { file: "", storagePath: "" };
  for (let i = 2; i < argv.length; i += 1) {
    if (argv[i] === "--file" && argv[i + 1]) {
      options.file = argv[i + 1];
      i += 1;
    } else if (argv[i] === "--path" && argv[i + 1]) {
      options.storagePath = argv[i + 1];
      i += 1;
    }
  }
  return options;
}

async function loadEnvLocal() {
  const envPath = path.resolve(process.cwd(), ".env.local");
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

function publicObjectUrl(supabaseUrl, storagePath) {
  const base = supabaseUrl.replace(/\/$/, "");
  const encoded = storagePath
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  return `${base}/storage/v1/object/public/${BUCKET}/${encoded}`;
}

async function ensureBucket(supabase) {
  const { data: existing, error: listError } = await supabase.storage.listBuckets();
  if (listError) throw listError;

  if (existing?.some((bucket) => bucket.name === BUCKET)) return;

  const { error: createError } = await supabase.storage.createBucket(BUCKET, {
    public: true,
  });
  if (createError) throw createError;
  console.log(`Created bucket: ${BUCKET}`);
}

const { file, storagePath } = parseArgs(process.argv);

if (!file || !storagePath) {
  console.error("Usage: node scripts/upload-docs-video.mjs --file <local.mp4> --path <storage/path.mp4>");
  process.exit(1);
}

const absoluteFile = path.isAbsolute(file) ? file : path.resolve(process.cwd(), file);

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

await ensureBucket(supabase);

const fileBuffer = await fs.readFile(absoluteFile);
const { error: uploadError } = await supabase.storage.from(BUCKET).upload(storagePath, fileBuffer, {
  contentType: "video/mp4",
  upsert: true,
});

if (uploadError) {
  console.error("Upload failed:", uploadError.message);
  process.exit(1);
}

const url = publicObjectUrl(supabaseUrl, storagePath);
console.log(`Uploaded: ${BUCKET}/${storagePath}`);
console.log(`Public URL: ${url}`);
