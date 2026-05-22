#!/usr/bin/env node
/**
 * Uploads mediateca assets to Supabase Storage and regenerates gallery data.
 *
 * Requires: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 *
 * Usage:
 *   node scripts/sync-mediateca-ubuntu-storage.mjs
 *   node scripts/sync-mediateca-ubuntu-storage.mjs --dry-run
 *   node scripts/sync-mediateca-ubuntu-storage.mjs --source "/Users/usuario/Desktop/images"
 */

import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const dryRun = process.argv.includes("--dry-run");
const sourceArgIndex = process.argv.indexOf("--source");
const customSource =
  sourceArgIndex >= 0 ? process.argv[sourceArgIndex + 1] : null;

const root = process.cwd();
const assetsRoot =
  customSource ?? path.join(root, "public", "assets", "mediateca-ubuntu");
const outFile = path.join(root, "src", "lib", "mediateca-ubuntu-gallery-data.ts");
const BUCKET = "mediateca-ubuntu";

const CATEGORIES = [
  { id: "all", label: "ALL", dir: "all", sourceDir: "ALL" },
  {
    id: "cc-los-cimarrones",
    label: "C.C. LOS CIMARRONES",
    dir: "cc-los-cimarrones",
    sourceDir: "C.C. LOS CIMARRONES",
  },
  {
    id: "cc-capitania",
    label: "C.C. CAPITANIA",
    dir: "cc-capitania",
    sourceDir: "C.C. CAPITANIA -20260512T195612Z-3-001/C.C. CAPITANIA",
  },
];

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const VIDEO_EXT = new Set([".mp4", ".mov", ".webm", ".m4v"]);
const AUDIO_EXT = new Set([".mp3", ".wav", ".m4a", ".aac", ".ogg"]);
const VIDEO_POSTER_FALLBACK = "/assets/gobierno-propio/memoria-video-poster-2026.png";
const AUDIO_POSTER_FALLBACK = "/assets/hero-cards/memoria-afroterritorial.png";

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
  if (AUDIO_EXT.has(ext)) return "audio";
  return "image";
}

function mediaTypeLabel(filename, kind) {
  const lower = filename.toLowerCase();
  if (lower.includes("entrevista") || lower.includes("interview")) return "Entrevista";
  if (kind === "video") return "Video";
  if (kind === "audio") return "Audio comunitario";
  return "Fotografía comunitaria";
}

function yearFromFilename(filename) {
  const match = filename.match(/(20\d{2})/);
  return match ? Number(match[1]) : 2024;
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

function categoryPlaceName(categoryId) {
  if (categoryId === "cc-los-cimarrones") return "C.C. Los Cimarrones";
  if (categoryId === "cc-capitania") return "C.C. Capitanía";
  return "colección general";
}

function titleFromMetadata(filename, category, kind, sequence) {
  const place = categoryPlaceName(category.id);
  const dateMatch = filename.match(/(20\d{2})(\d{2})(\d{2})/);

  if (dateMatch) {
    const year = dateMatch[1];
    const month = MONTHS_ES[parseInt(dateMatch[2], 10) - 1];
    const day = parseInt(dateMatch[3], 10);
    if (kind === "video") {
      return `Video en ${place} — ${day} de ${month} de ${year}`;
    }
    if (kind === "audio") {
      return `Audio en ${place} — ${day} de ${month} de ${year}`;
    }
    return `Memoria territorial en ${place} — ${day} de ${month} de ${year}`;
  }

  if (kind === "video") {
    return `Registro audiovisual en ${place}`;
  }
  if (kind === "audio") {
    return `Registro sonoro en ${place}`;
  }

  return `Fotografía comunitaria en ${place} · ${sequence}`;
}

function assignTitles(items) {
  const sequenceByCategory = {};
  const sorted = [...items].sort((a, b) => {
    const cat = a.category.id.localeCompare(b.category.id);
    if (cat !== 0) return cat;
    return a.filename.localeCompare(b.filename);
  });

  for (const item of sorted) {
    sequenceByCategory[item.category.id] = (sequenceByCategory[item.category.id] ?? 0) + 1;
    item.title = titleFromMetadata(
      item.filename,
      item.category,
      item.kind,
      sequenceByCategory[item.category.id],
    );
  }

  return sorted;
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
    ".m4v": "video/x-m4v",
    ".mp3": "audio/mpeg",
    ".wav": "audio/wav",
    ".m4a": "audio/mp4",
    ".aac": "audio/aac",
    ".ogg": "audio/ogg",
  };
  return map[ext] ?? "application/octet-stream";
}

function storagePathFor(categoryDir, filename) {
  return `${categoryDir}/${filename}`;
}

function publicObjectUrl(supabaseUrl, storagePath) {
  const base = supabaseUrl.replace(/\/$/, "");
  const encoded = storagePath
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  return `${base}/storage/v1/object/public/${BUCKET}/${encoded}`;
}

function localPublicUrl(categoryDir, filename) {
  return `/assets/mediateca-ubuntu/${categoryDir}/${encodeURIComponent(filename)}`;
}

async function collectAssets() {
  const items = [];
  const usingDesktopLayout = customSource != null;

  for (const category of CATEGORIES) {
    const dir = usingDesktopLayout
      ? path.join(assetsRoot, category.sourceDir)
      : path.join(assetsRoot, category.dir);

    let entries;
    try {
      entries = await fs.readdir(dir);
    } catch {
      continue;
    }

    for (const filename of entries) {
      if (filename.startsWith(".")) continue;
      if (filename.toLowerCase().includes("copia") && category.id === "cc-capitania") {
        continue;
      }
      const ext = extOf(filename);
      if (!IMAGE_EXT.has(ext) && !VIDEO_EXT.has(ext) && !AUDIO_EXT.has(ext)) continue;

      const filePath = path.join(dir, filename);
      const stat = await fs.stat(filePath);
      if (!stat.isFile()) continue;

      const kind = kindFromExt(ext);
      const storagePath = storagePathFor(category.dir, filename);

      items.push({
        category,
        filename,
        filePath,
        storagePath,
        kind,
        type: mediaTypeLabel(filename, kind),
        year: yearFromFilename(filename),
        localUrl: localPublicUrl(category.dir, filename),
      });
    }
  }

  return items;
}

function buildGalleryEntry(item, urls) {
  const id = `mediateca-${item.category.id}-${slugify(item.filename)}`;
  const posterUrl =
    item.kind === "video"
      ? urls.mediaUrl.includes("supabase.co") || urls.mediaUrl.startsWith("/")
        ? urls.mediaUrl
        : (urls.posterUrl ?? VIDEO_POSTER_FALLBACK)
      : item.kind === "audio"
        ? AUDIO_POSTER_FALLBACK
      : urls.mediaUrl;

  return {
    id,
    title: item.title,
    section: "Mediateca Ubuntu",
    type: item.type,
    description: `Registro audiovisual de la colección ${item.category.label} — memoria comunitaria del Palenke de Pensamiento.`,
    territory: item.category.label,
    council: "Palenke de Pensamiento · PCN",
    year: item.year,
    kind: item.kind,
    posterUrl,
    mediaUrl: urls.mediaUrl,
    visibility: "public",
    categoryId: item.category.id,
  };
}

function serializeTs(items) {
  const body = items
    .map((item) => {
      const lines = Object.entries(item).map(([key, value]) => {
        if (typeof value === "number") return `    ${key}: ${value},`;
        return `    ${key}: ${JSON.stringify(value)},`;
      });
      return `  {\n${lines.join("\n")}\n  }`;
    })
    .join(",\n");

  return `import type { PalenkeGalleryMedia } from "@/lib/palenke-gallery-media";
import type { ViewerRole } from "@/lib/mock-data";

export const MEDIATECA_UBUNTU_CATEGORIES = [
  { id: "todas", label: "Todas las categorías" },
] as const;

export type MediatecaUbuntuCategoryId = (typeof MEDIATECA_UBUNTU_CATEGORIES)[number]["id"];

export const mediatecaUbuntuGalleryMedia: PalenkeGalleryMedia[] = [
${body}
] as const;

export function getVisibleMediatecaUbuntuGalleryMedia(
  _role: ViewerRole,
  categoryId?: MediatecaUbuntuCategoryId,
): PalenkeGalleryMedia[] {
  return mediatecaUbuntuGalleryMedia.filter((item) => {
    if (item.visibility === "sensitive") return false;
    if (categoryId && categoryId !== "todas" && item.categoryId !== categoryId) return false;
    return true;
  });
}
`;
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

const supabase =
  supabaseUrl && serviceRoleKey && !dryRun
    ? createClient(supabaseUrl, serviceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      })
    : null;

const localItems = assignTitles(await collectAssets());

if (localItems.length === 0) {
  console.error(`No mediateca assets found under ${assetsRoot}`);
  process.exit(1);
}

console.log(`Found ${localItems.length} mediateca assets in ${assetsRoot}.`);

const galleryItems = [];

for (const item of localItems) {
  let mediaUrl = item.localUrl;
  let posterUrl = item.localUrl;

  if (supabase) {
    await ensureBucket(supabase);
    const fileBuffer = await fs.readFile(item.filePath);

    if (dryRun) {
      console.log(`[dry-run] Would upload ${BUCKET}/${item.storagePath}`);
    } else {
      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(item.storagePath, fileBuffer, {
          contentType: getContentType(item.filename),
          upsert: true,
        });

      if (uploadError) {
        console.warn(
          `Supabase upload failed for ${item.filename}, using local URL:`,
          uploadError.message,
        );
      } else {
        mediaUrl = publicObjectUrl(supabaseUrl, item.storagePath);
        posterUrl = mediaUrl;
        console.log(`Uploaded: ${item.storagePath}`);
      }
    }
  } else if (dryRun) {
    console.log(`[dry-run] Would upload ${BUCKET}/${item.storagePath}`);
  }

  galleryItems.push(buildGalleryEntry(item, { mediaUrl, posterUrl }));
}

await fs.writeFile(outFile, serializeTs(galleryItems), "utf8");
console.log(`Wrote ${galleryItems.length} entries to ${path.relative(root, outFile)}`);

if (!supabase && !dryRun) {
  console.log(
    "Supabase credentials not found — gallery uses local /public URLs. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local and re-run.",
  );
}
