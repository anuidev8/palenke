#!/usr/bin/env node
/**
 * Replaces one mediateca category: clears storage + gallery entries, uploads curated picks.
 *
 * Usage:
 *   node scripts/replace-mediateca-category.mjs instrumento-gobierno-propio --compress
 */

import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { createClient } from "@supabase/supabase-js";
import { MEDIATECA_CATEGORIES } from "./mediateca-categories.mjs";
import { CATEGORY_PICKS } from "./mediateca-category-picks.mjs";

const args = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
const compress = process.argv.includes("--compress");
const categoryId = args[0];

if (!categoryId) {
  console.error("Usage: node scripts/replace-mediateca-category.mjs <category-id> [--compress]");
  process.exit(1);
}

const root = process.cwd();
const galleryFile = path.join(root, "src", "lib", "mediateca-ubuntu-gallery-data.ts");
const BUCKET = "mediateca-ubuntu";
const desktopBase = path.join(os.homedir(), "Desktop");
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

function storageFilename(filename) {
  return filename
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/°/g, "")
    .replace(/\s+/g, "-");
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

function titleFromMetadata(label, sequence) {
  return `Fotografía comunitaria en ${label} · ${sequence}`;
}

function yearFromFilename(filename) {
  const match = filename.match(/(20\d{2})/);
  return match ? Number(match[1]) : 2024;
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

async function listAllObjects(supabase, prefix) {
  const objects = [];
  let offset = 0;
  while (true) {
    const { data, error } = await supabase.storage.from(BUCKET).list(prefix, {
      limit: 1000,
      offset,
      sortBy: { column: "name", order: "asc" },
    });
    if (error) throw error;
    if (!data?.length) break;
    for (const entry of data) {
      const entryPath = `${prefix}/${entry.name}`;
      if (entry.id == null) {
        objects.push(...(await listAllObjects(supabase, entryPath)));
      } else {
        objects.push(entryPath);
      }
    }
    if (data.length < 1000) break;
    offset += 1000;
  }
  return objects;
}

function removeCategoryEntries(source, id) {
  const marker = "export const mediatecaUbuntuGalleryMedia";
  const mediaStart = source.indexOf(marker);
  const openIndex = source.indexOf("[", mediaStart);
  const closeIndex = source.indexOf("] as const;", mediaStart);
  if (openIndex < 0 || closeIndex < 0) {
    throw new Error("Could not find mediatecaUbuntuGalleryMedia array bounds");
  }

  const header = source.slice(0, openIndex + 1);
  const footer = source.slice(closeIndex);
  const body = source.slice(openIndex + 1, closeIndex);

  const keptBlocks = body
    .split(/\n  \{\n/)
    .slice(1)
    .filter((block) => !block.includes(`categoryId: ${JSON.stringify(id)},`))
    .map((block) => `  {\n${block.trimEnd().replace(/,\s*$/, "")}`);

  const nextBody = keptBlocks.length > 0 ? `\n${keptBlocks.join(",\n")}\n` : "\n";
  return `${header}${nextBody}${footer}`;
}

await loadEnvLocal();

const category = MEDIATECA_CATEGORIES.find((entry) => entry.id === categoryId);
const picks = CATEGORY_PICKS[categoryId];
if (!category || !picks) {
  console.error(`Unknown category or picks: ${categoryId}`);
  process.exit(1);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const sourceDir = path.join(desktopBase, category.sourceDir);
const existingObjects = await listAllObjects(supabase, category.dir);
if (existingObjects.length > 0) {
  for (let i = 0; i < existingObjects.length; i += 100) {
    const batch = existingObjects.slice(i, i + 100);
    const { error } = await supabase.storage.from(BUCKET).remove(batch);
    if (error) throw error;
  }
  console.log(`Removed ${existingObjects.length} storage objects from ${category.dir}/`);
}

let gallerySource = await fs.readFile(galleryFile, "utf8");
gallerySource = removeCategoryEntries(gallerySource, categoryId);
await fs.writeFile(galleryFile, gallerySource, "utf8");
console.log(`Removed gallery entries for ${categoryId}`);

const newEntries = [];
let sequence = 0;

for (const filename of picks) {
  const filePath = path.join(sourceDir, filename);
  await fs.access(filePath);
  sequence += 1;
  const storageName = storageFilename(filename);
  const storagePath = `${category.dir}/${storageName}`;
  const fileBuffer = compress ? await compressImage(filePath) : await fs.readFile(filePath);

  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(storagePath, fileBuffer, {
    contentType: getContentType(storageName),
    upsert: true,
  });
  if (uploadError) throw uploadError;

  const mediaUrl = publicObjectUrl(supabaseUrl, storagePath);
  newEntries.push({
    id: `mediateca-${category.id}-${slugify(filename)}`,
    title: titleFromMetadata(category.label, sequence),
    section: "Mediateca Ubuntu",
    type: "Fotografía comunitaria",
    description: `Registro audiovisual de la colección ${category.label} — memoria comunitaria del Palenke de Pensamiento.`,
    territory: category.label,
    council: "Palenke de Pensamiento · PCN",
    year: yearFromFilename(filename),
    kind: "image",
    posterUrl: mediaUrl,
    mediaUrl,
    visibility: "public",
    categoryId: category.id,
  });
  console.log(`Uploaded: ${storagePath}`);
}

gallerySource = await fs.readFile(galleryFile, "utf8");
for (const entry of newEntries) {
  const block = serializeEntry(entry);
  const marker = "export const mediatecaUbuntuGalleryMedia";
  const mediaStart = gallerySource.indexOf(marker);
  const closeIndex = gallerySource.indexOf("] as const;", mediaStart);
  const openIndex = gallerySource.indexOf("[", mediaStart);
  const currentBody = gallerySource.slice(openIndex + 1, closeIndex).trim();
  const prefix = currentBody.length > 0 ? ",\n" : "\n";
  gallerySource =
    gallerySource.slice(0, closeIndex) + `${prefix}${block}` + gallerySource.slice(closeIndex);
}
await fs.writeFile(galleryFile, gallerySource, "utf8");
console.log(`Added ${newEntries.length} entries for ${categoryId}.`);
