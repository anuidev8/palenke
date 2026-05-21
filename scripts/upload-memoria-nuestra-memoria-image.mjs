#!/usr/bin/env node
/**
 * Uploads the Nuestra Memoria hero image to Supabase Storage.
 *
 * Requires: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 *
 * Usage:
 *   node scripts/upload-memoria-nuestra-memoria-image.mjs
 */

import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const BUCKET = "memoria-afroterritorial";
const STORAGE_PATH = "nuestra-memoria/IMG_7018.JPG";
const SOURCE = path.join(process.cwd(), "images", "IMG_7018.JPG");
const OUT_FILE = path.join(process.cwd(), "src", "lib", "memoria-afroterritorial-assets.ts");

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

const fileBuffer = await fs.readFile(SOURCE);

const { error: uploadError } = await supabase.storage
  .from(BUCKET)
  .upload(STORAGE_PATH, fileBuffer, {
    contentType: "image/jpeg",
    upsert: true,
  });

if (uploadError) {
  console.error("Upload failed:", uploadError.message);
  process.exit(1);
}

const imageUrl = publicObjectUrl(supabaseUrl, STORAGE_PATH);
console.log(`Uploaded: ${BUCKET}/${STORAGE_PATH}`);
console.log(imageUrl);

const ts = `/** Supabase Storage URLs for Memoria Afroterritorial page assets. */
export const MEMORIA_NUESTRA_MEMORIA_IMAGE_URL =
  ${JSON.stringify(imageUrl)};
`;

await fs.writeFile(OUT_FILE, ts, "utf8");
console.log(`Wrote ${OUT_FILE}`);
