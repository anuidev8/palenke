#!/usr/bin/env node
/**
 * Uploads Memoria Afroterritorial hero video + ambient audio to Supabase Storage.
 *
 * Requires: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 *
 * Usage:
 *   node scripts/upload-memoria-hero-media.mjs
 *   node scripts/upload-memoria-hero-media.mjs --video "/path/to/video.mp4" --audio "/path/to/audio.mp3"
 */

import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const BUCKET = "memoria-afroterritorial";
const VIDEO_STORAGE_PATH = "presentation-hero/presentacion-hero.mp4";
const AUDIO_STORAGE_PATH = "presentation-hero/humano-ambient.mp3";
const DEFAULT_VIDEO = "/Users/usuario/Desktop/Generated Video May 21, 2026 - 10_58PM.mp4";
const DEFAULT_AUDIO = "/Users/usuario/Desktop/HUMANO (1).mp3";
const OUT_FILE = path.join(process.cwd(), "src", "lib", "memoria-afroterritorial-assets.ts");
const HERO_DURATION = "0:08";

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
  const options = { video: DEFAULT_VIDEO, audio: DEFAULT_AUDIO };
  for (let i = 2; i < argv.length; i += 1) {
    if (argv[i] === "--video" && argv[i + 1]) {
      options.video = argv[i + 1];
      i += 1;
    } else if (argv[i] === "--audio" && argv[i + 1]) {
      options.audio = argv[i + 1];
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

async function uploadFile(supabase, storagePath, sourcePath, contentType) {
  const fileBuffer = await fs.readFile(sourcePath);
  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(storagePath, fileBuffer, {
    contentType,
    upsert: true,
  });
  if (uploadError) throw uploadError;
  console.log(`Uploaded: ${BUCKET}/${storagePath}`);
}

const { video: videoSource, audio: audioSource } = parseArgs(process.argv);

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
await uploadFile(supabase, VIDEO_STORAGE_PATH, videoSource, "video/mp4");
await uploadFile(supabase, AUDIO_STORAGE_PATH, audioSource, "audio/mpeg");

const videoUrl = publicObjectUrl(supabaseUrl, VIDEO_STORAGE_PATH);
const audioUrl = publicObjectUrl(supabaseUrl, AUDIO_STORAGE_PATH);

const ts = `/** Supabase Storage URLs for Memoria Afroterritorial page assets. */
export const MEMORIA_NUESTRA_MEMORIA_IMAGE_URL =
  "https://xtbdgwlwxslcpyholwuz.supabase.co/storage/v1/object/public/memoria-afroterritorial/nuestra-memoria/IMG_7018.JPG";

/** Hero presentation video for /memoria-afroterritorial. */
export const MEMORIA_AFROTERRITORIAL_HERO_VIDEO_SRC = ${JSON.stringify(videoUrl)};

/** Ambient audio track paired with the hero video. */
export const MEMORIA_AFROTERRITORIAL_HERO_AUDIO_SRC = ${JSON.stringify(audioUrl)};

export const MEMORIA_AFROTERRITORIAL_HERO_VIDEO_DURATION = ${JSON.stringify(HERO_DURATION)};
`;

await fs.writeFile(OUT_FILE, ts, "utf8");
console.log(videoUrl);
console.log(audioUrl);
console.log(`Wrote ${OUT_FILE}`);
