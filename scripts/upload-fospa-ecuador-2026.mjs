#!/usr/bin/env node
/**
 * Uploads FOSPA Ecuador 2026 subcategory media to Supabase Storage
 * and merges gallery entries into mediateca-ubuntu-gallery-data.ts.
 *
 * Usage:
 *   node scripts/upload-fospa-ecuador-2026.mjs --all --compress
 *   node scripts/upload-fospa-ecuador-2026.mjs --all --compress --only=prefospa
 *   node scripts/upload-fospa-ecuador-2026.mjs --all --compress --only=delegacion-colombia
 *
 * Source folders (default):
 *   ~/Desktop/fospa-ecuador-2026/{PreFOSPA,FOSPA Ecuador,...}
 *
 * --compress converts HEIC/JPEG/PNG → JPEG (max 1920px) and MOV/MP4 → H.264 MP4.
 */

import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { createClient } from "@supabase/supabase-js";
import {
  FOSPA_ECUADOR_2026_PICKS,
  FOSPA_ECUADOR_2026_SUBCATEGORIES,
} from "./fospa-ecuador-2026-picks.mjs";

const compress = process.argv.includes("--compress");
const uploadAll = process.argv.includes("--all");
const onlyArg = process.argv.find((arg) => arg.startsWith("--only="));
const onlyId = onlyArg ? onlyArg.slice("--only=".length) : null;

const root = process.cwd();
const galleryFile = path.join(root, "src", "lib", "mediateca-ubuntu-gallery-data.ts");
const BUCKET = "mediateca-ubuntu";
const CATEGORY_ID = "fospa-ecuador-2026";
const CATEGORY_DIR = "fospa-ecuador-2026";
const CATEGORY_LABEL = "FOSPA Ecuador 2026";
const desktopBase = path.join(os.homedir(), "Desktop", "fospa-ecuador-2026");

const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".heic"]);
const VIDEO_EXTS = new Set([".mp4", ".mov", ".webm", ".m4v"]);

const execFileAsync = promisify(execFile);

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

function extOf(filename) {
  return path.extname(filename).toLowerCase();
}

function basenameWithoutExt(filename) {
  return path.basename(filename, path.extname(filename));
}

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function mediaKind(filename) {
  const ext = extOf(filename);
  if (VIDEO_EXTS.has(ext)) return "video";
  return "image";
}

function publicObjectUrl(supabaseUrl, storagePath) {
  const base = supabaseUrl.replace(/\/$/, "");
  const encoded = storagePath
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  return `${base}/storage/v1/object/public/${BUCKET}/${encoded}`;
}

function yearFromFilename(filename) {
  const match = filename.match(/(20\d{2})/);
  return match ? Number(match[1]) : 2026;
}

function titleFromMetadata(subcategoryLabel, kind, sequence) {
  if (kind === "video") {
    return `Registro audiovisual en ${subcategoryLabel} · ${sequence}`;
  }
  return `Fotografía comunitaria en ${subcategoryLabel} · ${sequence}`;
}

function serializeEntry(item) {
  const lines = Object.entries(item).map(([key, value]) => {
    if (typeof value === "number") return `    ${key}: ${value},`;
    return `    ${key}: ${JSON.stringify(value)},`;
  });
  return `  {\n${lines.join("\n")}\n  }`;
}

/** Compress images (incl. HEIC) to JPEG max edge 1920 @ ~82 quality. */
async function compressImage(filePath) {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "mediateca-img-"));
  const outputPath = path.join(tempDir, "compressed.jpg");

  await execFileAsync("sips", [
    "-Z",
    "1920",
    filePath,
    "--out",
    outputPath,
    "--setProperty",
    "format",
    "jpeg",
    "--setProperty",
    "formatOptions",
    "82",
  ]);

  const buffer = await fs.readFile(outputPath);
  await fs.rm(tempDir, { recursive: true, force: true });
  return { buffer, storageFilename: `${basenameWithoutExt(filePath)}.jpg`, contentType: "image/jpeg" };
}

/** Compress video to H.264 MP4 (720p max, CRF 28). */
async function compressVideo(filePath) {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "mediateca-vid-"));
  const outputPath = path.join(tempDir, "compressed.mp4");

  await execFileAsync(
    "ffmpeg",
    [
      "-y",
      "-i",
      filePath,
      "-vf",
      "scale='min(1280,iw)':-2",
      "-c:v",
      "libx264",
      "-preset",
      "fast",
      "-crf",
      "28",
      "-c:a",
      "aac",
      "-b:a",
      "128k",
      "-movflags",
      "+faststart",
      outputPath,
    ],
    { maxBuffer: 20 * 1024 * 1024 },
  );

  const buffer = await fs.readFile(outputPath);
  await fs.rm(tempDir, { recursive: true, force: true });
  return { buffer, storageFilename: `${basenameWithoutExt(filePath)}.mp4`, contentType: "video/mp4" };
}

async function prepareUpload(filePath, kind) {
  if (!compress) {
    const filename = path.basename(filePath);
    const ext = extOf(filename);
    let contentType = "application/octet-stream";
    if (kind === "image") {
      contentType =
        ext === ".png"
          ? "image/png"
          : ext === ".webp"
            ? "image/webp"
            : ext === ".gif"
              ? "image/gif"
              : ext === ".heic"
                ? "image/heic"
                : "image/jpeg";
    } else {
      contentType =
        ext === ".mov" ? "video/quicktime" : ext === ".webm" ? "video/webm" : "video/mp4";
    }
    return {
      buffer: await fs.readFile(filePath),
      storageFilename: filename,
      contentType,
    };
  }

  if (kind === "image") return compressImage(filePath);
  return compressVideo(filePath);
}

async function listMediaFilenames(sourceDir) {
  const entries = await fs.readdir(sourceDir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => {
      const ext = extOf(name);
      return IMAGE_EXTS.has(ext) || VIDEO_EXTS.has(ext);
    })
    .filter((name) => !name.startsWith("."))
    .sort((a, b) => a.localeCompare(b, "es"));
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

let subcategories = FOSPA_ECUADOR_2026_SUBCATEGORIES;
if (onlyId) {
  subcategories = subcategories.filter((item) => item.id === onlyId);
  if (subcategories.length === 0) {
    console.error(`Unknown --only=${onlyId}. Valid: ${FOSPA_ECUADOR_2026_SUBCATEGORIES.map((s) => s.id).join(", ")}`);
    process.exit(1);
  }
}

const newEntries = [];

for (const subcategory of subcategories) {
  const sourceDir = path.join(desktopBase, subcategory.sourceDir);
  let filenames = FOSPA_ECUADOR_2026_PICKS[subcategory.id] ?? [];

  if (uploadAll || filenames.length === 0) {
    try {
      filenames = await listMediaFilenames(sourceDir);
    } catch {
      console.warn(`Skipping missing folder: ${sourceDir}`);
      continue;
    }
    if (filenames.length === 0) {
      console.warn(`No media in ${sourceDir} — skipping.`);
      continue;
    }
    console.log(
      `\n${subcategory.label}: ${filenames.length} file(s)${compress ? " (compressing)" : ""}`,
    );
  }

  let sequence = 0;

  for (const filename of filenames) {
    const filePath = path.join(sourceDir, filename);
    try {
      await fs.access(filePath);
    } catch {
      console.warn(`  Skipping missing file: ${filename}`);
      continue;
    }

    sequence += 1;
    const kind = mediaKind(filename);
    const started = Date.now();
    process.stdout.write(`  [${sequence}/${filenames.length}] ${filename} … `);

    let prepared;
    try {
      prepared = await prepareUpload(filePath, kind);
    } catch (error) {
      console.error(`\nCompress/prepare failed for ${filename}:`, error.message ?? error);
      process.exit(1);
    }

    const storagePath = `${CATEGORY_DIR}/${subcategory.id}/${prepared.storageFilename}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, prepared.buffer, {
        contentType: prepared.contentType,
        upsert: true,
      });

    if (uploadError) {
      console.error(`\nUpload failed for ${filename}:`, uploadError.message);
      process.exit(1);
    }

    const mediaUrl = publicObjectUrl(supabaseUrl, storagePath);
    const kb = Math.round(prepared.buffer.length / 1024);
    console.log(`ok (${kb} KB, ${((Date.now() - started) / 1000).toFixed(1)}s) → ${prepared.storageFilename}`);

    newEntries.push({
      id: `mediateca-${CATEGORY_ID}-${subcategory.id}-${slugify(prepared.storageFilename)}`,
      title: titleFromMetadata(subcategory.label, kind, sequence),
      section: "Mediateca Ubuntu",
      type: kind === "video" ? "Video" : "Fotografía comunitaria",
      description: `Registro audiovisual de ${subcategory.label} — ${CATEGORY_LABEL}, memoria comunitaria del Palenke de Pensamiento.`,
      territory: CATEGORY_LABEL,
      council: "Palenke de Pensamiento · PCN",
      year: yearFromFilename(filename),
      kind,
      posterUrl: kind === "image" ? mediaUrl : "",
      mediaUrl,
      visibility: "public",
      categoryId: CATEGORY_ID,
      subcategoryId: subcategory.id,
    });
  }
}

if (newEntries.length === 0) {
  console.error(
    "\nNo files uploaded. PreFOSPA / FOSPA Ecuador folders are still missing on Desktop.",
  );
  console.error(`Looked under: ${desktopBase}`);
  process.exit(1);
}

let gallerySource = await fs.readFile(galleryFile, "utf8");
let merged = 0;

for (const entry of newEntries) {
  if (gallerySource.includes(`id: ${JSON.stringify(entry.id)},`)) {
    console.log(`Skipping existing entry: ${entry.id}`);
    continue;
  }
  const block = serializeEntry(entry);
  const marker = "export const mediatecaUbuntuGalleryMedia";
  const mediaStart = gallerySource.indexOf(marker);
  const closeIndex = gallerySource.indexOf("] as const;", mediaStart);
  const currentBody = gallerySource.slice(gallerySource.indexOf("[", mediaStart) + 1, closeIndex).trim();
  const prefix = currentBody.length > 0 ? ",\n" : "\n";
  gallerySource =
    gallerySource.slice(0, closeIndex) + `${prefix}${block}` + gallerySource.slice(closeIndex);
  merged += 1;
}

await fs.writeFile(galleryFile, gallerySource, "utf8");
console.log(
  `\nMerged ${merged} fospa-ecuador-2026 entries into gallery data (${newEntries.length} uploaded).`,
);
