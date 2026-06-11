#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const dryRun = process.argv.includes("--dry-run");
const verifyOnly = process.argv.includes("--verify");
const root = process.cwd();

const SOURCE_ROOT =
  process.env.RUTAS_METODOLOGICAS_SOURCE_DIR ??
  path.resolve(root, "docs/files/INF PUBLICA/RUTAS METODOLOGICAS");

const ITEMS = [
  {
    instrument: "reglamentos",
    sourceDir: "REGLAMEMNTOS INTERNOS",
    sourceFile: "RUTA METODOLOGICA -REGLAMENTO INTERNO - GENERAL.pdf",
    title: "Documento Base Metodológico - Reglamentos Internos",
    storageFileName: "ruta-metodologica-reglamentos.pdf",
  },
  {
    instrument: "planes-uso",
    sourceDir: "PLAN DE USO Y MANEJO AMBIENTAL",
    sourceFile: "PLAN DE USO Y MANEJO AMBIENTAL - GENERAL.pdf",
    title: "Documento Base Metodológico - Planes de Uso y Manejo",
    storageFileName: "ruta-metodologica-planes-uso.pdf",
  },
  {
    instrument: "etnodesarrollo",
    sourceDir: "PLAN DE ETNODESARROLLO",
    sourceFile: "RUTA METODOLÓGICA GENERAL PARA LA FORMULACIÓN DEL PLAN DE ETNODESARROLLO.pdf",
    title: "Documento Base Metodológico - Etnodesarrollo",
    storageFileName: "ruta-metodologica-etnodesarrollo.pdf",
  },
  {
    instrument: "conservacion",
    sourceDir: "AREAS DE CONSERVACIÓN COMUNITARIA",
    sourceFile:
      "RUTA METODOLÓGICA ÁREAS DE CONSERVACIÓN COMUNITARIAS CON ENFOQUE DE PUEBLO NEGRO.pdf",
    title: "Presentación ABCC-PN - Áreas Bioculturales de Conservación Comunitaria",
    storageFileName: "ruta-metodologica-conservacion.pdf",
  },
];

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
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch {
    // No-op if .env.local does not exist.
  }
}

await loadEnvLocal();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!dryRun && !verifyOnly && (!supabaseUrl || !serviceRoleKey)) {
  console.error(
    "Missing env vars. Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
  );
  process.exit(1);
}

const supabase =
  dryRun || !supabaseUrl || !serviceRoleKey
    ? null
    : createClient(supabaseUrl, serviceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });

function normalizeName(value) {
  return value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

async function resolveSourceFile(item) {
  const folderPath = path.join(SOURCE_ROOT, item.sourceDir);
  const directPath = path.join(folderPath, item.sourceFile);
  try {
    await fs.access(directPath);
    return directPath;
  } catch {
    const entries = await fs.readdir(folderPath);
    const normalizedTarget = normalizeName(item.sourceFile);
    const match = entries.find((entry) => normalizeName(entry) === normalizedTarget);
    if (match) {
      return path.join(folderPath, match);
    }
    throw new Error(`Source file not found for ${item.instrument}: ${item.sourceFile}`);
  }
}

function getStoragePath(item) {
  return `${item.instrument}/${item.storageFileName}`;
}

async function upsertDocumentMetadata(item, storagePath) {
  const { data: existing, error: existingError } = await supabase
    .from("documents")
    .select("id")
    .eq("instrument", item.instrument)
    .eq("visibility", "public")
    .limit(1)
    .maybeSingle();

  if (existingError) {
    throw new Error(`Failed to read metadata for ${item.instrument}: ${existingError.message}`);
  }

  const payload = {
    title: item.title,
    instrument: item.instrument,
    council: "Palenke PCN",
    visibility: "public",
    storage_bucket: "docs-public",
    storage_path: storagePath,
  };

  if (existing?.id) {
    const { error } = await supabase.from("documents").update(payload).eq("id", existing.id);
    if (error) {
      throw new Error(`Failed to update metadata for ${item.instrument}: ${error.message}`);
    }
    return "updated";
  }

  const { error } = await supabase.from("documents").insert(payload);
  if (error) {
    throw new Error(`Failed to insert metadata for ${item.instrument}: ${error.message}`);
  }
  return "inserted";
}

async function verifyAll() {
  if (!supabase) {
    console.error("Supabase client unavailable.");
    process.exit(1);
  }

  let missing = 0;
  for (const item of ITEMS) {
    const storagePath = getStoragePath(item);
    const folder = path.posix.dirname(storagePath);
    const fileName = path.posix.basename(storagePath);

    const { data: storageData, error: storageError } = await supabase.storage
      .from("docs-public")
      .list(folder, { search: fileName });
    const storageFound =
      !storageError && storageData?.some((entry) => entry.name === fileName);

    const { data: dbData, error: dbError } = await supabase
      .from("documents")
      .select("id,title,storage_path")
      .eq("instrument", item.instrument)
      .eq("visibility", "public")
      .maybeSingle();

    const ok = storageFound && !dbError && dbData?.storage_path === storagePath;
    if (!ok) {
      missing += 1;
      console.log(`MISSING ${item.instrument}`);
      if (!storageFound) console.log(`  storage: docs-public/${storagePath}`);
      if (dbError || !dbData) console.log(`  db: no public row`);
      if (dbData && dbData.storage_path !== storagePath) {
        console.log(`  db path mismatch: ${dbData.storage_path}`);
      }
    } else {
      console.log(`OK ${item.instrument} -> ${dbData.title}`);
    }
  }

  console.log(`\nVerify complete: ${ITEMS.length - missing}/${ITEMS.length} instruments ready.`);
  process.exit(missing > 0 ? 1 : 0);
}

async function syncAll() {
  let uploaded = 0;
  for (const item of ITEMS) {
    const sourcePath = await resolveSourceFile(item);
    const buffer = await fs.readFile(sourcePath);
    const storagePath = getStoragePath(item);

    if (dryRun) {
      console.log(
        `[dry-run] ${sourcePath} -> docs-public/${storagePath} (${buffer.byteLength} bytes)`,
      );
      uploaded += 1;
      continue;
    }

    const { error: uploadError } = await supabase.storage
      .from("docs-public")
      .upload(storagePath, buffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      console.error(`FAILED upload ${storagePath}: ${uploadError.message}`);
      continue;
    }

    const metadataAction = await upsertDocumentMetadata(item, storagePath);
    uploaded += 1;
    console.log(`SYNCED ${item.instrument} (${metadataAction}) -> docs-public/${storagePath}`);
  }

  console.log(`\nSync complete: ${uploaded}/${ITEMS.length} rutas metodológicas.`);
}

if (verifyOnly) {
  await verifyAll();
} else {
  await syncAll();
}
