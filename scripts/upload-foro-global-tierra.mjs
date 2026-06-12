#!/usr/bin/env node
/**
 * Uploads curated foro-global-tierra subcategory picks to Supabase.
 *
 * Usage:
 *   node scripts/upload-foro-global-tierra.mjs --compress
 */

import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { createClient } from "@supabase/supabase-js";
import {
  FORO_GLOBAL_TIERRA_PICKS,
  FORO_GLOBAL_TIERRA_SUBCATEGORIES,
} from "./foro-global-tierra-picks.mjs";

const compress = process.argv.includes("--compress");
const root = process.cwd();
const galleryFile = path.join(root, "src", "lib", "mediateca-ubuntu-gallery-data.ts");
const BUCKET = "mediateca-ubuntu";
const CATEGORY_ID = "foro-global-tierra";
const CATEGORY_DIR = "foro-global-tierra";
const CATEGORY_LABEL = "Foro Global de la Tierra";
const desktopBase = path.join(os.homedir(), "Desktop", "foro-global-tierra");

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
  return ext === ".png" ? "image/png" : "image/jpeg";
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
  return match ? Number(match[1]) : 2025;
}

function titleFromMetadata(subcategoryLabel, sequence) {
  return `Fotografía comunitaria en ${subcategoryLabel} · ${sequence}`;
}

function serializeEntry(item) {
  const lines = Object.entries(item).map(([key, value]) => {
    if (typeof value === "number") return `    ${key}: ${value},`;
    return `    ${key}: ${JSON.stringify(value)},`;
  });
  return `  {\n${lines.join("\n")}\n  }`;
}

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

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const newEntries = [];

for (const subcategory of FORO_GLOBAL_TIERRA_SUBCATEGORIES) {
  const picks = FORO_GLOBAL_TIERRA_PICKS[subcategory.id];
  const sourceDir = path.join(desktopBase, subcategory.sourceDir);
  let sequence = 0;

  for (const filename of picks) {
    const filePath = path.join(sourceDir, filename);
    try {
      await fs.access(filePath);
    } catch {
      console.error(`Missing file: ${filePath}`);
      process.exit(1);
    }

    sequence += 1;
    const storagePath = `${CATEGORY_DIR}/${subcategory.id}/${filename}`;
    const fileBuffer = compress ? await compressImage(filePath) : await fs.readFile(filePath);

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

    newEntries.push({
      id: `mediateca-${CATEGORY_ID}-${subcategory.id}-${slugify(filename)}`,
      title: titleFromMetadata(subcategory.label, sequence),
      section: "Mediateca Ubuntu",
      type: "Fotografía comunitaria",
      description: `Registro audiovisual de ${subcategory.label} — ${CATEGORY_LABEL}, memoria comunitaria del Palenke de Pensamiento.`,
      territory: CATEGORY_LABEL,
      council: "Palenke de Pensamiento · PCN",
      year: yearFromFilename(filename),
      kind: "image",
      posterUrl: mediaUrl,
      mediaUrl,
      visibility: "public",
      categoryId: CATEGORY_ID,
      subcategoryId: subcategory.id,
    });

    console.log(`Uploaded: ${storagePath}`);
  }
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
  const closeIndex = gallerySource.indexOf("] as const;", mediaStart);
  const currentBody = gallerySource.slice(gallerySource.indexOf("[", mediaStart) + 1, closeIndex).trim();
  const prefix = currentBody.length > 0 ? ",\n" : "\n";
  gallerySource =
    gallerySource.slice(0, closeIndex) + `${prefix}${block}` + gallerySource.slice(closeIndex);
}

await fs.writeFile(galleryFile, gallerySource, "utf8");
console.log(`Merged ${newEntries.length} foro-global-tierra entries into gallery data.`);
