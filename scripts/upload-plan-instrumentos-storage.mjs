#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const dryRun = process.argv.includes("--dry-run");
const verifyOnly = process.argv.includes("--verify");
const verifyDbOnly = process.argv.includes("--verify-db");
const root = process.cwd();

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
  dryRun || (!supabaseUrl || !serviceRoleKey)
    ? null
    : createClient(supabaseUrl, serviceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });

const fileMap = [
  {
    source: "docs/files/INF. INTERNA/REGLAMENTOS INTERNOS/CC MAYOR DE CAPITANIA/ACTA DE ACTUALIZACIÓN/Acta de validación C.C. Capitania.pdf",
    instrument: "reglamentos",
    council: "CC Mayor de Capitania",
    visibility: "internal",
    bucket: "docs-internal",
    storagePath: "reglamentos/cc-mayor-de-capitania/ACTAS DE ACTUALIZACIÓN/acta-validacion-cc-capitania.pdf",
    title: "Acta de validación - CC Mayor de Capitania",
  },
  {
    source: "docs/files/INF. INTERNA/REGLAMENTOS INTERNOS/CC LLAVES DEL FUTURO/ACTA VALIDACION/Acta de validación CC Llaves del futuro.pdf",
    instrument: "reglamentos",
    council: "CC Llaves del Futuro",
    visibility: "internal",
    bucket: "docs-internal",
    storagePath: "reglamentos/cc-llaves-del-futuro/ACTAS DE VALIDACIÓN/acta-validacion-cc-llaves-del-futuro.pdf",
    title: "Acta de validación - CC Llaves del Futuro",
  },
  {
    source: "docs/files/INF. INTERNA/REGLAMENTOS INTERNOS/CC MARTIN LUTHER KING/ACTA DE ACTUALIZACION/Acta Martin Luther King (1).pdf",
    instrument: "reglamentos",
    council: "CC Martin Luther King",
    visibility: "internal",
    bucket: "docs-internal",
    storagePath: "reglamentos/cc-martin-luther-king/ACTAS DE ACTUALIZACIÓN/acta-validacion-martin-luther-king.pdf",
    title: "Acta de validación - CC Martin Luther King",
  },
  {
    source: "docs/files/INF. INTERNA/REGLAMENTOS INTERNOS/CC NELSON MANDELA - GUAVIARE/ACTA DE ACTUALIZACIÓN/Acta de aprobación Nelson Mandela.pdf",
    instrument: "reglamentos",
    council: "CC Nelson Mandela - Guaviare",
    visibility: "internal",
    bucket: "docs-internal",
    storagePath: "reglamentos/cc-nelson-mandela-guaviare/ACTAS DE ACTUALIZACIÓN/acta-aprobacion-nelson-mandela-guaviare.pdf",
    title: "Acta de aprobación - CC Nelson Mandela (Guaviare)",
  },
  {
    source: "docs/files/INF. INTERNA/REGLAMENTOS INTERNOS/CC ORCONEPIAC/ACTA VALIDACION/Acta de validación C.C. Orconepiac.pdf",
    instrument: "reglamentos",
    council: "CC ORCONEPIAC",
    visibility: "internal",
    bucket: "docs-internal",
    storagePath: "reglamentos/cc-orconepiac/ACTAS DE VALIDACIÓN/acta-validacion-cc-orconepiac.pdf",
    title: "Acta de validación - CC ORCONEPIAC",
  },
  {
    source: "docs/files/INF. INTERNA/REGLAMENTOS INTERNOS/CC NUEVA ESPERANZA/ACTA VALIDACION/Acta de validación C.C. Nueva Esperanza.pdf",
    instrument: "reglamentos",
    council: "CC Nueva Esperanza",
    visibility: "internal",
    bucket: "docs-internal",
    storagePath: "reglamentos/cc-nueva-esperanza/ACTAS DE VALIDACIÓN/acta-validacion-cc-nueva-esperanza.pdf",
    title: "Acta de validación - CC Nueva Esperanza",
  },
  {
    source: "docs/files/INF. INTERNA/REGLAMENTOS INTERNOS/CC NELSON MANDELA - PIAMONTE/ACTA VALIDACION/Acta de validación C.C. Nelson Mandela.pdf",
    instrument: "reglamentos",
    council: "CC Nelson Mandela - Piamonte",
    visibility: "internal",
    bucket: "docs-internal",
    storagePath: "reglamentos/cc-nelson-mandela-piamonte/ACTAS DE VALIDACIÓN/acta-validacion-cc-nelson-mandela-piamonte.pdf",
    title: "Acta de validación - CC Nelson Mandela (Piamonte)",
  },
  {
    source: "docs/files/INF. INTERNA/REGLAMENTOS INTERNOS/CC ESPERANZA VIVA/ACTA VALIDACION/Acta de validación C.C. Esperanza Viva.pdf",
    instrument: "reglamentos",
    council: "CC Esperanza Viva",
    visibility: "internal",
    bucket: "docs-internal",
    storagePath: "reglamentos/cc-esperanza-viva/ACTAS DE VALIDACIÓN/acta-validacion-cc-esperanza-viva.pdf",
    title: "Acta de validación - CC Esperanza Viva",
  },
  {
    source: "docs/files/INF. INTERNA/REGLAMENTOS INTERNOS/CC DIEGO LUIS CORDOBA/ACTA DE ACTUALIZACION/Acta de aprobación  DIEGO LUIS CORDOBA.pdf",
    instrument: "reglamentos",
    council: "CC Diego Luis Cordoba",
    visibility: "internal",
    bucket: "docs-internal",
    storagePath: "reglamentos/cc-diego-luis-cordoba/ACTAS DE ACTUALIZACIÓN/acta-aprobacion-diego-luis-cordoba.pdf",
    title: "Acta de aprobación - CC Diego Luis Cordoba",
  },

  {
    source: "docs/files/INF. INTERNA/REGLAMENTOS INTERNOS/CC MAYOR DE CAPITANIA/REGLAMENTO INTERNO - CAPITANIA.pdf",
    instrument: "reglamentos",
    council: "CC Mayor de Capitania",
    visibility: "internal",
    bucket: "docs-internal",
    storagePath: "reglamentos/cc-mayor-de-capitania/reglamento-interno-capitania.pdf",
    title: "Reglamento Interno - CC Mayor de Capitania",
  },
  {
    source: "docs/files/INF. INTERNA/REGLAMENTOS INTERNOS/CC LLAVES DEL FUTURO/REGLAMENTO INTERNO - CC LLAVES DEL FUTURO.pdf",
    instrument: "reglamentos",
    council: "CC Llaves del Futuro",
    visibility: "internal",
    bucket: "docs-internal",
    storagePath: "reglamentos/cc-llaves-del-futuro/reglamento-interno-cc-llaves-del-futuro.pdf",
    title: "Reglamento Interno - CC Llaves del Futuro",
  },
  {
    source: "docs/files/INF. INTERNA/REGLAMENTOS INTERNOS/CC MARTIN LUTHER KING/REGLAMENTO INTERNO MARTIN LUTHER KING (1).pdf",
    instrument: "reglamentos",
    council: "CC Martin Luther King",
    visibility: "internal",
    bucket: "docs-internal",
    storagePath: "reglamentos/cc-martin-luther-king/reglamento-interno-martin-luther-king.pdf",
    title: "Reglamento Interno - CC Martin Luther King",
  },
  {
    source: "docs/files/INF. INTERNA/REGLAMENTOS INTERNOS/CC NELSON MANDELA - GUAVIARE/REGLAMENTO INTERNO NELSON MANDELA.pdf",
    instrument: "reglamentos",
    council: "CC Nelson Mandela - Guaviare",
    visibility: "internal",
    bucket: "docs-internal",
    storagePath: "reglamentos/cc-nelson-mandela-guaviare/reglamento-interno-nelson-mandela-guaviare.pdf",
    title: "Reglamento Interno - CC Nelson Mandela (Guaviare)",
  },
  {
    source: "docs/files/INF. INTERNA/REGLAMENTOS INTERNOS/CC ORCONEPIAC/REGLAMENTO INTERNO - CC ORCONEPIAC.pdf",
    instrument: "reglamentos",
    council: "CC ORCONEPIAC",
    visibility: "internal",
    bucket: "docs-internal",
    storagePath: "reglamentos/cc-orconepiac/reglamento-interno-cc-orconepiac.pdf",
    title: "Reglamento Interno - CC ORCONEPIAC",
  },
  {
    source: "docs/files/INF. INTERNA/REGLAMENTOS INTERNOS/CC NUEVA ESPERANZA/REGLAMENTO INTERNO -  CC NUEVA ESPERANZA.pdf",
    instrument: "reglamentos",
    council: "CC Nueva Esperanza",
    visibility: "internal",
    bucket: "docs-internal",
    storagePath: "reglamentos/cc-nueva-esperanza/reglamento-interno-cc-nueva-esperanza.pdf",
    title: "Reglamento Interno - CC Nueva Esperanza",
  },
  {
    source: "docs/files/INF. INTERNA/REGLAMENTOS INTERNOS/CC NELSON MANDELA - PIAMONTE/REGLAMENTO INTERNO - CC NELSON MANDELA.pdf",
    instrument: "reglamentos",
    council: "CC Nelson Mandela - Piamonte",
    visibility: "internal",
    bucket: "docs-internal",
    storagePath: "reglamentos/cc-nelson-mandela-piamonte/reglamento-interno-cc-nelson-mandela-piamonte.pdf",
    title: "Reglamento Interno - CC Nelson Mandela (Piamonte)",
  },
  {
    source: "docs/files/INF. INTERNA/REGLAMENTOS INTERNOS/CC ESPERANZA VIVA/REGLAMENTO INTERNO--  CC ESPERANZA VIVA.pdf",
    instrument: "reglamentos",
    council: "CC Esperanza Viva",
    visibility: "internal",
    bucket: "docs-internal",
    storagePath: "reglamentos/cc-esperanza-viva/reglamento-interno-cc-esperanza-viva.pdf",
    title: "Reglamento Interno - CC Esperanza Viva",
  },
  {
    source: "docs/files/INF. INTERNA/REGLAMENTOS INTERNOS/CC DIEGO LUIS CORDOBA/REGLAMENTO INTERNO DIEGO LUIS CORDOBA 19.pdf",
    instrument: "reglamentos",
    council: "CC Diego Luis Cordoba",
    visibility: "internal",
    bucket: "docs-internal",
    storagePath: "reglamentos/cc-diego-luis-cordoba/reglamento-interno-diego-luis-cordoba.pdf",
    title: "Reglamento Interno - CC Diego Luis Cordoba",
  },
  {
    source: "docs/files/INF. INTERNA/PLAN DE ETNODESARROLLO/CC. NELSON MANDELA/20241201 PLAN DE ETNODESARROLLO DE NELSON MANDELA.pdf",
    instrument: "etnodesarrollo",
    council: "CC Nelson Mandela",
    visibility: "internal",
    bucket: "docs-internal",
    storagePath: "etnodesarrollo/cc-nelson-mandela/plan-etnodesarrollo-nelson-mandela-20241201.pdf",
    title: "Plan de Etnodesarrollo - CC Nelson Mandela",
  },
  {
    source: "docs/files/INF. INTERNA/PLAN DE ETNODESARROLLO/CC. DIEGO LUIS CORDOBA/PLAN ETNODESARROLLO DIEGO LUIS CÓRDOBA 20241201.pdf",
    instrument: "etnodesarrollo",
    council: "CC Diego Luis Cordoba",
    visibility: "internal",
    bucket: "docs-internal",
    storagePath: "etnodesarrollo/cc-diego-luis-cordoba/plan-etnodesarrollo-diego-luis-cordoba-20241201.pdf",
    title: "Plan de Etnodesarrollo - CC Diego Luis Cordoba",
  },
  {
    source: "docs/files/INF. INTERNA/PLAN DE ETNODESARROLLO/CC. MARTIN LUTHER KING/PED MARTIN KUTHER KING.pdf",
    instrument: "etnodesarrollo",
    council: "CC Martin Luther King",
    visibility: "internal",
    bucket: "docs-internal",
    storagePath: "etnodesarrollo/cc-martin-luther-king/plan-etnodesarrollo-martin-luther-king.pdf",
    title: "Plan de Etnodesarrollo - CC Martin Luther King",
  },
  {
    source: "docs/files/INF. INTERNA/PLAN DE USO Y MANEJO AMBIENTAL NEGRO - PUMANE/RENACIENTES DE LA DIASPORA AFRICANA/PUMANE FINAL_CCCN_RENACIENTES_DE_LA_DIÁSPORA_AFRICANA.pdf",
    instrument: "planes-uso",
    council: "CC Renacientes de la Diáspora Africana",
    visibility: "sensitive",
    bucket: "docs-sensitive",
    storagePath: "planes-uso/cc-renacientes/pumane-final-cc-renacientes.pdf",
    title: "PUMANE Final - CC Renacientes",
  },
  {
    source: "docs/files/INF. INTERNA/PLAN DE USO Y MANEJO AMBIENTAL NEGRO - PUMANE/RENACIENTES DE LA DIASPORA AFRICANA/ANEXO 1 PUMANE GLOSARIO.pdf",
    instrument: "planes-uso",
    council: "CC Renacientes de la Diáspora Africana",
    visibility: "sensitive",
    bucket: "docs-sensitive",
    storagePath: "planes-uso/cc-renacientes/anexo-1-pumane-glosario.pdf",
    title: "Anexo 1 PUMANE - Glosario",
  },
  {
    source: "docs/files/INF. INTERNA/PLAN DE USO Y MANEJO AMBIENTAL NEGRO - PUMANE/RENACIENTES DE LA DIASPORA AFRICANA/ANEXO 2 MEMORIA METODOLÓGICA DETALLADA PUMANE.pdf",
    instrument: "planes-uso",
    council: "CC Renacientes de la Diáspora Africana",
    visibility: "sensitive",
    bucket: "docs-sensitive",
    storagePath: "planes-uso/cc-renacientes/anexo-2-memoria-metodologica-pumane.pdf",
    title: "Anexo 2 PUMANE - Memoria metodológica",
  },
  {
    source: "docs/files/INF. INTERNA/PLAN DE USO Y MANEJO AMBIENTAL NEGRO - PUMANE/RENACIENTES DE LA DIASPORA AFRICANA/ANEXO 3 Especies de Flora y Fauna PUMANE CC Renacientes.pdf",
    instrument: "planes-uso",
    council: "CC Renacientes de la Diáspora Africana",
    visibility: "sensitive",
    bucket: "docs-sensitive",
    storagePath: "planes-uso/cc-renacientes/anexo-3-especies-flora-fauna-pumane.pdf",
    title: "Anexo 3 PUMANE - Flora y fauna",
  },
];

function addConservationRows(rows) {
  const sourceRows = rows.filter((item) => item.instrument === "planes-uso");
  return sourceRows.map((item) => ({
    ...item,
    instrument: "conservacion",
    storagePath: item.storagePath.replace(/^planes-uso\//, "conservacion/"),
    title: `${item.title} (Conservación)`,
  }));
}

function toUniqueRows(rows) {
  const map = new Map();
  for (const row of rows) {
    map.set(`${row.bucket}/${row.storagePath}`, row);
  }
  return [...map.values()];
}

const allRows = toUniqueRows([...fileMap, ...addConservationRows(fileMap)]);
let documentsTableAvailable = true;

async function ensureDocumentRow(entry) {
  if (!supabase) {
    return { inserted: false };
  }
  if (!documentsTableAvailable) {
    return { inserted: false };
  }

  const { data: existing, error: existingError } = await supabase
    .from("documents")
    .select("id")
    .eq("instrument", entry.instrument)
    .eq("storage_path", entry.storagePath)
    .maybeSingle();

  if (existingError) {
    throw existingError;
  }

  if (existing) {
    return { inserted: false };
  }

  const { error: insertError } = await supabase.from("documents").insert({
    title: entry.title,
    instrument: entry.instrument,
    council: entry.council,
    visibility: entry.visibility,
    storage_bucket: entry.bucket,
    storage_path: entry.storagePath,
  });

  if (insertError) {
    throw insertError;
  }

  return { inserted: true };
}

async function ensureBucket(bucketName) {
  if (!supabase) return;

  const { data: existing, error: listError } = await supabase.storage.listBuckets();
  if (listError) {
    throw listError;
  }

  const hasBucket = existing?.some((bucket) => bucket.name === bucketName);
  if (hasBucket) {
    return;
  }

  const { error: createError } = await supabase.storage.createBucket(bucketName, {
    public: false,
  });
  if (createError) {
    throw createError;
  }
  console.log(`Created bucket: ${bucketName}`);
}

async function fileExists(bucket, storagePath) {
  if (!supabase) {
    throw new Error("Supabase client unavailable.");
  }
  const folder = path.posix.dirname(storagePath);
  const fileName = path.posix.basename(storagePath);
  const { data, error } = await supabase.storage.from(bucket).list(folder === "." ? "" : folder, {
    limit: 1000,
    search: fileName,
    sortBy: { column: "name", order: "asc" },
  });
  if (error) throw error;
  return (data ?? []).some((item) => item.name === fileName);
}

async function runVerify() {
  if (!supabase) {
    throw new Error(
      "Missing env vars. Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  const byBucket = new Map();
  for (const row of allRows) {
    const list = byBucket.get(row.bucket) ?? [];
    list.push(row.storagePath);
    byBucket.set(row.bucket, list);
  }

  for (const [bucket, storagePaths] of byBucket.entries()) {
    const uniquePaths = [...new Set(storagePaths)].sort();
    let found = 0;
    const missing = [];

    for (const storagePath of uniquePaths) {
      try {
        const exists = await fileExists(bucket, storagePath);
        if (exists) {
          found += 1;
        } else {
          missing.push(storagePath);
        }
      } catch (error) {
        missing.push(storagePath);
        console.error(`Error checking ${bucket}/${storagePath}`, error);
      }
    }

    console.log(`${bucket}: ${found}/${uniquePaths.length} expected file(s)`);
    if (missing.length > 0) {
      console.log("  Missing:");
      for (const storagePath of missing) {
        console.log(`  - ${storagePath}`);
      }
    }
  }
}

async function runVerifyDb() {
  if (!supabase) {
    throw new Error(
      "Missing env vars. Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  const expectedByInstrument = allRows.reduce((acc, row) => {
    acc[row.instrument] = (acc[row.instrument] ?? 0) + 1;
    return acc;
  }, {});

  const { data, error } = await supabase.from("documents").select("id, instrument, storage_path");
  if (error) {
    throw error;
  }

  const remoteByInstrument = {};
  const remoteKeys = new Set();
  const sampleIdByInstrument = {};
  for (const row of data ?? []) {
    const id = String(row.id ?? "");
    const instrument = String(row.instrument ?? "");
    const storagePath = String(row.storage_path ?? "");
    if (!id || !instrument || !storagePath) continue;
    remoteByInstrument[instrument] = (remoteByInstrument[instrument] ?? 0) + 1;
    remoteKeys.add(`${instrument}::${storagePath}`);
    if (!sampleIdByInstrument[instrument]) {
      sampleIdByInstrument[instrument] = id;
    }
  }

  console.log("documents by instrument (remote vs expected, managed by upload script):");
  const managedInstruments = Object.keys(expectedByInstrument).sort();
  for (const instrument of managedInstruments) {
    const remoteCount = remoteByInstrument[instrument] ?? 0;
    const expectedCount = expectedByInstrument[instrument] ?? 0;
    const sampleId = sampleIdByInstrument[instrument];
    console.log(
      `- ${instrument}: ${remoteCount}/${expectedCount}${sampleId ? ` (sample id: ${sampleId})` : ""}`,
    );
  }

  const extraInstruments = Object.keys(remoteByInstrument)
    .filter((instrument) => !expectedByInstrument[instrument])
    .sort();
  if (extraInstruments.length > 0) {
    console.log("additional remote instruments (outside upload script scope):");
    for (const instrument of extraInstruments) {
      console.log(`- ${instrument}: ${remoteByInstrument[instrument]}`);
    }
  }

  const missing = allRows
    .filter((row) => !remoteKeys.has(`${row.instrument}::${row.storagePath}`))
    .map((row) => `${row.instrument}::${row.storagePath}`);

  if (missing.length === 0) {
    console.log("documents metadata check: all expected rows are present.");
    return;
  }

  console.log("documents metadata check: missing rows detected:");
  for (const key of missing) {
    console.log(`- ${key}`);
  }
}

async function run() {
  if (verifyOnly) {
    await runVerify();
    return;
  }
  if (verifyDbOnly) {
    await runVerifyDb();
    return;
  }

  console.log(`Starting upload sync (${dryRun ? "dry-run" : "apply"})...`);
  let uploadedCount = 0;
  let insertedCount = 0;

  if (!dryRun) {
    await ensureBucket("docs-internal");
    await ensureBucket("docs-sensitive");

    // Detect whether migrations are already applied on remote DB.
    const { error: docsProbeError } = await supabase
      .from("documents")
      .select("id")
      .limit(1);

    if (docsProbeError) {
      documentsTableAvailable = false;
      console.warn(
        "Warning: public.documents table is not available yet. Files will upload, but metadata rows will be skipped.",
      );
    }
  }

  for (const entry of allRows) {
    const sourcePath = path.resolve(root, entry.source);
    const label = `${entry.bucket}/${entry.storagePath}`;

    console.log(`- ${label}`);
    if (dryRun) {
      continue;
    }

    if (!supabase) {
      throw new Error(
        "Supabase client is not available. Configure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
      );
    }

    const fileBuffer = await fs.readFile(sourcePath);
    const { error: uploadError } = await supabase.storage
      .from(entry.bucket)
      .upload(entry.storagePath, fileBuffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      throw uploadError;
    }
    uploadedCount += 1;

    try {
      const result = await ensureDocumentRow(entry);
      if (result.inserted) {
        insertedCount += 1;
      }
    } catch (error) {
      // Continue uploading files even if metadata insertion fails per row.
      console.warn(`Warning: failed to insert metadata for ${entry.storagePath}.`, error);
    }
  }

  console.log(
    `Done. Uploaded: ${uploadedCount}. Inserted document rows: ${insertedCount}.`,
  );
  if (!documentsTableAvailable) {
    console.log(
      "Action required: apply Supabase migrations (001_initial_schema.sql and 002_seed_documents.sql) to enable documents metadata.",
    );
  }
}

run().catch((error) => {
  console.error("Upload sync failed:", error);
  process.exit(1);
});
