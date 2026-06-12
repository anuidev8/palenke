#!/usr/bin/env node
/**
 * Uploads one mediateca-ubuntu category folder to Supabase and merges gallery entries.
 *
 * Usage:
 *   node scripts/upload-mediateca-category.mjs areas-bioculturales-2024 --compress
 *   node scripts/upload-mediateca-category.mjs areas-bioculturales-2024 --source "/path/to/folder"
 *   node scripts/upload-mediateca-category.mjs areas-bioculturales-2024 --files IMG_8740.JPG,IMG_8791.JPG
 */

import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { createClient } from "@supabase/supabase-js";
import { MEDIATECA_CATEGORIES } from "./mediateca-categories.mjs";

function readArg(flag) {
  const index = process.argv.indexOf(flag);
  return index >= 0 ? process.argv[index + 1] : null;
}

const args = process.argv.slice(2).filter((arg, index, argv) => {
  if (arg.startsWith("--")) return false;
  const prev = argv[index - 1];
  return !(prev === "--source" || prev === "--files" || prev === "--desktop");
});

const compress = process.argv.includes("--compress");
const categoryId = args[0];
const sourceArg = readArg("--source");
const filesArg = readArg("--files");
const desktopBase = readArg("--desktop") ?? path.join(os.homedir(), "Desktop");

if (!categoryId) {
  console.error(
    "Usage: node scripts/upload-mediateca-category.mjs <category-id> [--compress] [--source <folder>] [--files a.jpg,b.jpg] [--desktop <base>]",
  );
  process.exit(1);
}

const root = process.cwd();
const galleryFile = path.join(root, "src", "lib", "mediateca-ubuntu-gallery-data.ts");
const BUCKET = "mediateca-ubuntu";

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const VIDEO_EXT = new Set([".mp4", ".mov", ".webm", ".m4v"]);

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

function kindFromExt(ext) {
  if (VIDEO_EXT.has(ext)) return "video";
  return "image";
}

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function getContentType(filename) {
  const ext = extOf(filename);
  const map = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".mp4": "video/mp4",
    ".mov": "video/quicktime",
    ".webm": "video/webm",
  };
  return map[ext] ?? "application/octet-stream";
}

function publicObjectUrl(supabaseUrl, storagePath) {
  const base = supabaseUrl.replace(/\/$/, "");
  const encoded = storagePath
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  return `${base}/storage/v1/object/public/${BUCKET}/${encoded}`;
}

const MONTHS_ES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

function categoryPlaceName(id) {
  const category = MEDIATECA_CATEGORIES.find((entry) => entry.id === id);
  return category?.label ?? "Mediateca Ubuntu";
}

function titleFromMetadata(filename, categoryId, kind, sequence) {
  const place = categoryPlaceName(categoryId);
  const dateMatch = filename.match(/(20\d{2})(\d{2})(\d{2})/);

  if (dateMatch) {
    const year = dateMatch[1];
    const month = MONTHS_ES[parseInt(dateMatch[2], 10) - 1];
    const day = parseInt(dateMatch[3], 10);
    if (kind === "video") {
      return `Video en ${place} — ${day} de ${month} de ${year}`;
    }
    return `Memoria territorial en ${place} — ${day} de ${month} de ${year}`;
  }

  if (kind === "video") return `Registro audiovisual en ${place}`;
  return `Fotografía comunitaria en ${place} · ${sequence}`;
}

function yearFromFilename(filename) {
  const match = filename.match(/(20\d{2})/);
  return match ? Number(match[1]) : 2024;
}

function mediaTypeLabel(filename, kind) {
  if (kind === "video") return "Video";
  return "Fotografía comunitaria";
}

function serializeEntry(item) {
  const lines = Object.entries(item).map(([key, value]) => {
    if (typeof value === "number") return `    ${key}: ${value},`;
    return `    ${key}: ${JSON.stringify(value)},`;
  });
  return `  {\n${lines.join("\n")}\n  }`;
}

const execFileAsync = promisify(execFile);

async function compressImage(filePath) {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "mediateca-"));
  const outputPath = path.join(tempDir, `compressed${extOf(filePath) || ".jpg"}`);

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
  return buffer;
}

await loadEnvLocal();

const category = MEDIATECA_CATEGORIES.find((c) => c.id === categoryId);
if (!category) {
  console.error(`Unknown category: ${categoryId}`);
  process.exit(1);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const assetsDir = sourceArg ?? path.join(desktopBase, category.sourceDir);

let filenames;
try {
  filenames = (await fs.readdir(assetsDir)).filter((f) => !f.startsWith("."));
} catch {
  console.error(`Source folder not found: ${assetsDir}`);
  process.exit(1);
}

const pickedFiles = filesArg
  ? filesArg
      .split(",")
      .map((name) => name.trim())
      .filter(Boolean)
  : null;

const mediaFiles = filenames.filter((f) => {
  if (pickedFiles && !pickedFiles.includes(f)) return false;
  const ext = extOf(f);
  return IMAGE_EXT.has(ext) || VIDEO_EXT.has(ext);
});

console.log(`Reading from: ${assetsDir}`);

if (mediaFiles.length === 0) {
  console.error(`No images/videos in ${assetsDir}`);
  process.exit(1);
}

mediaFiles.sort((a, b) => a.localeCompare(b));

const newEntries = [];
let sequence = 0;

for (const filename of mediaFiles) {
  const ext = extOf(filename);
  const kind = kindFromExt(ext);
  sequence += 1;
  const storagePath = `${category.dir}/${filename}`;
  const filePath = path.join(assetsDir, filename);
  const fileBuffer =
    compress && kind === "image" ? await compressImage(filePath) : await fs.readFile(filePath);

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, fileBuffer, {
      contentType: getContentType(filename),
      upsert: true,
    });

  if (uploadError) {
    console.error(`Upload failed for ${filename}:`, uploadError.message);
    process.exit(1);
  }

  const mediaUrl = publicObjectUrl(supabaseUrl, storagePath);
  const posterUrl = mediaUrl;

  newEntries.push({
    id: `mediateca-${category.id}-${slugify(filename)}`,
    title: titleFromMetadata(filename, category.id, kind, sequence),
    section: "Mediateca Ubuntu",
    type: mediaTypeLabel(filename, kind),
    description: `Registro audiovisual de la colección ${category.label} — memoria comunitaria del Palenke de Pensamiento.`,
    territory: category.label,
    council: "Palenke de Pensamiento · PCN",
    year: yearFromFilename(filename),
    kind,
    posterUrl,
    mediaUrl,
    visibility: "public",
    categoryId: category.id,
  });

  console.log(`Uploaded: ${storagePath}`);
}

let gallerySource = await fs.readFile(galleryFile, "utf8");

for (const entry of newEntries) {
  if (gallerySource.includes(`id: ${JSON.stringify(entry.id)},`)) {
    console.log(`Skipping existing entry: ${entry.id}`);
    continue;
  }
  const block = serializeEntry(entry);
  const marker = "export const mediatecaUbuntuGalleryMedia";
  const mediaStart = gallerySource.indexOf(marker);
  if (mediaStart < 0) {
    console.error("Could not find mediatecaUbuntuGalleryMedia in gallery file");
    process.exit(1);
  }
  const openIndex = gallerySource.indexOf("[", mediaStart);
  const closeIndex = gallerySource.indexOf("] as const;", mediaStart);
  if (openIndex < 0 || closeIndex < 0) {
    console.error("Could not find gallery array in gallery file");
    process.exit(1);
  }

  const currentBody = gallerySource.slice(openIndex + 1, closeIndex).trim();
  const prefix = currentBody.length > 0 ? ",\n" : "\n";
  gallerySource =
    gallerySource.slice(0, closeIndex) + `${prefix}${block}` + gallerySource.slice(closeIndex);
}

await fs.writeFile(galleryFile, gallerySource, "utf8");
console.log(`Merged ${newEntries.length} entries into ${path.relative(root, galleryFile)}`);
