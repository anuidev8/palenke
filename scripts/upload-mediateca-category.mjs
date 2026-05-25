#!/usr/bin/env node
/**
 * Uploads one mediateca-ubuntu category folder to Supabase and merges gallery entries.
 *
 * Usage:
 *   node scripts/upload-mediateca-category.mjs cc-diego-luis-cordoba
 */

import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const categoryId = process.argv[2];
if (!categoryId) {
  console.error("Usage: node scripts/upload-mediateca-category.mjs <category-id>");
  process.exit(1);
}

const root = process.cwd();
const syncScript = path.join(root, "scripts", "sync-mediateca-ubuntu-storage.mjs");
const galleryFile = path.join(root, "src", "lib", "mediateca-ubuntu-gallery-data.ts");
const assetsDir = path.join(root, "public", "assets", "mediateca-ubuntu", categoryId);
const BUCKET = "mediateca-ubuntu";

const CATEGORIES = [
  { id: "all", label: "ALL", dir: "all" },
  { id: "cc-los-cimarrones", label: "C.C. LOS CIMARRONES", dir: "cc-los-cimarrones" },
  { id: "cc-capitania", label: "C.C. CAPITANIA", dir: "cc-capitania" },
  {
    id: "cc-diego-luis-cordoba",
    label: "C.C. DIEGO LUIS CORDOBA",
    dir: "cc-diego-luis-cordoba",
  },
];

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
  if (id === "cc-los-cimarrones") return "C.C. Los Cimarrones";
  if (id === "cc-capitania") return "C.C. Capitanía";
  if (id === "cc-diego-luis-cordoba") return "C.C. Diego Luis Córdoba";
  return "colección general";
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

await loadEnvLocal();

const category = CATEGORIES.find((c) => c.id === categoryId);
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

let filenames;
try {
  filenames = (await fs.readdir(assetsDir)).filter((f) => !f.startsWith("."));
} catch {
  console.error(`Assets folder not found: ${assetsDir}`);
  process.exit(1);
}

const mediaFiles = filenames.filter((f) => {
  const ext = extOf(f);
  return IMAGE_EXT.has(ext) || VIDEO_EXT.has(ext);
});

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
  const fileBuffer = await fs.readFile(filePath);

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
  const posterUrl = kind === "video" ? mediaUrl : mediaUrl;

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
  const closeIndex = gallerySource.indexOf("\n] as const;", mediaStart);
  if (closeIndex < 0) {
    console.error("Could not find gallery array close in gallery file");
    process.exit(1);
  }
  gallerySource =
    gallerySource.slice(0, closeIndex) + `,\n${block}` + gallerySource.slice(closeIndex);
}

await fs.writeFile(galleryFile, gallerySource, "utf8");
console.log(`Merged ${newEntries.length} entries into ${path.relative(root, galleryFile)}`);
void syncScript;
