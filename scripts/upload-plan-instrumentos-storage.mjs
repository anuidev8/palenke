#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const dryRun = process.argv.includes("--dry-run");
const verifyOnly = process.argv.includes("--verify");
const verifyDbOnly = process.argv.includes("--verify-db");
const root = process.cwd();

const MANAGED_SOURCE_ROOTS = {
  reglamentos: "docs/files/INF. INTERNA/REGLAMENTOS INTERNOS",
  etnodesarrollo: "docs/files/INF. INTERNA/PLAN DE ETNODESARROLLO",
  "planes-uso": "docs/files/INF. INTERNA/PLAN DE USO Y MANEJO AMBIENTAL NEGRO - PUMANE",
  conservacion: "docs/files/INF. INTERNA/AREAS DE CONSERVACIÓN COMUNITARIA",
};

const LEGACY_CONSERVACION_FALLBACK_PATHS = [
  "conservacion/cc-renacientes/pumane-final-cc-renacientes.pdf",
  "conservacion/cc-renacientes/anexo-1-pumane-glosario.pdf",
  "conservacion/cc-renacientes/anexo-2-memoria-metodologica-pumane.pdf",
  "conservacion/cc-renacientes/anexo-3-especies-flora-fauna-pumane.pdf",
];

const LEGACY_REGLAMENTOS_STALE_PATHS = [
  "reglamentos/cc-martin-luther-king/acta-validacion-martin-luther-king.pdf",
  "reglamentos/cc-esperanza-viva/acta-validacion-cc-esperanza-viva.pdf",
  "reglamentos/cc-llaves-del-futuro/acta-validacion-cc-llaves-del-futuro.pdf",
  "reglamentos/cc-mayor-de-capitania/acta-validacion-cc-capitania.pdf",
  "reglamentos/cc-nelson-mandela-guaviare/acta-aprobacion-nelson-mandela-guaviare.pdf",
  "reglamentos/cc-nelson-mandela-piamonte/acta-validacion-cc-nelson-mandela-piamonte.pdf",
  "reglamentos/cc-nueva-esperanza/acta-validacion-cc-nueva-esperanza.pdf",
  "reglamentos/cc-orconepiac/acta-validacion-cc-orconepiac.pdf",
  "reglamentos/cc-diego-luis-cordoba/acta-aprobacion-diego-luis-cordoba.pdf",
  "reglamentos/cc-martin-luther-king/acta-martin-luther-king.pdf",
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
  dryRun || (!supabaseUrl || !serviceRoleKey)
    ? null
    : createClient(supabaseUrl, serviceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });

const NORMALIZED_INSTRUMENT_MARKERS = [
  { marker: "REGLAMENTOS INTERNOS", instrument: "reglamentos" },
  { marker: "PLAN DE ETNODESARROLLO", instrument: "etnodesarrollo" },
  {
    marker: "PLAN DE USO Y MANEJO AMBIENTAL NEGRO - PUMANE",
    instrument: "planes-uso",
  },
  {
    marker: "AREAS DE CONSERVACION COMUNITARIA",
    instrument: "conservacion",
  },
];

function normalizeForMatch(value) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\\/g, "/")
    .toUpperCase();
}

function inferInstrumentFromSourcePath(sourcePath) {
  const normalized = normalizeForMatch(sourcePath);
  const matched = NORMALIZED_INSTRUMENT_MARKERS.find((item) =>
    normalized.includes(item.marker),
  );
  return matched?.instrument ?? null;
}

function validateSourceCategorization(rows) {
  for (const row of rows) {
    const inferredInstrument = inferInstrumentFromSourcePath(row.source);
    if (!inferredInstrument) {
      continue;
    }
    if (inferredInstrument !== row.instrument) {
      throw new Error(
        `Source/instrument mismatch for "${row.source}". Inferred="${inferredInstrument}", configured="${row.instrument}".`,
      );
    }
  }
}

function normalizeStoragePath(storagePath) {
  return storagePath
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function normalizeRows(rows) {
  return rows.map((row) => {
    const normalizedStoragePath = normalizeStoragePath(row.storagePath);
    return {
      ...row,
      storagePath: normalizedStoragePath,
    };
  });
}

async function countSourceFiles(dirPath) {
  const allowedExt = new Set([".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx"]);
  let total = 0;
  let pending = [dirPath];

  while (pending.length > 0) {
    const current = pending.pop();
    let entries;
    try {
      entries = await fs.readdir(current, { withFileTypes: true });
    } catch {
      continue;
    }

    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        pending.push(fullPath);
        continue;
      }
      if (!entry.isFile()) continue;
      const ext = path.extname(entry.name).toLowerCase();
      if (allowedExt.has(ext)) {
        total += 1;
      }
    }
  }

  return total;
}

async function printSourceCoverageDashboard() {
  console.log("source coverage by instrument (local files vs sync map):");

  const mappedByInstrument = {};
  for (const row of allRows) {
    mappedByInstrument[row.instrument] = (mappedByInstrument[row.instrument] ?? 0) + 1;
  }

  const instruments = Object.keys(MANAGED_SOURCE_ROOTS).sort();
  for (const instrument of instruments) {
    const rootDir = MANAGED_SOURCE_ROOTS[instrument];
    const absoluteRoot = path.resolve(root, rootDir);
    const localFileCount = await countSourceFiles(absoluteRoot);
    const mappedCount = mappedByInstrument[instrument] ?? 0;
    console.log(`- ${instrument}: local=${localFileCount} mapped=${mappedCount} root=${rootDir}`);
  }
}

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
  {
    source: "docs/files/INF. INTERNA/AREAS DE CONSERVACIÓN COMUNITARIA/CC - Cimarrones/22082025 Áreas de Conservación CC CIMARRONES 2025.pdf",
    instrument: "conservacion",
    council: "CC - Cimarrones",
    visibility: "internal",
    bucket: "docs-internal",
    storagePath: "conservacion/cc-cimarrones/22082025-areas-de-conservacion-cc-cimarrones-2025.pdf",
    title: "CC - Cimarrones",
  },
  {
    source: "docs/files/INF. INTERNA/AREAS DE CONSERVACIÓN COMUNITARIA/CC - Cimarrones/ANEXOS CIMARRONES.pdf",
    instrument: "conservacion",
    council: "CC - Cimarrones",
    visibility: "internal",
    bucket: "docs-internal",
    storagePath: "conservacion/cc-cimarrones/anexos-cimarrones.pdf",
    title: "CC - Cimarrones - Anexos",
  },
  {
    source: "docs/files/INF. INTERNA/AREAS DE CONSERVACIÓN COMUNITARIA/CC - Despertad Patianos/Componente Ambiental/InformeAmbiental_CC_DespertadPatianos.pdf",
    instrument: "conservacion",
    council: "CC - Despertad Patianos",
    visibility: "internal",
    bucket: "docs-internal",
    storagePath:
      "conservacion/cc-despertad-patianos/componente-ambiental/informeambiental-cc-despertadpatianos.pdf",
    title: "CC - Despertad Patianos - Componente Ambiental",
  },
  {
    source: "docs/files/INF. INTERNA/AREAS DE CONSERVACIÓN COMUNITARIA/CC - Despertad Patianos/Componente Catastral/C. TOPOGRAFICO - SISTEMA DE AREAS DE CONSERVACION COMUNITARIA II.pdf",
    instrument: "conservacion",
    council: "CC - Despertad Patianos",
    visibility: "internal",
    bucket: "docs-internal",
    storagePath:
      "conservacion/cc-despertad-patianos/componente-catastral/c-topografico-sistema-de-areas-de-conservacion-comunitaria-ii.pdf",
    title: "CC - Despertad Patianos - Componente Catastral",
  },
  {
    source: "docs/files/INF. INTERNA/AREAS DE CONSERVACIÓN COMUNITARIA/CC - Despertad Patianos/Componente Social/CC. Despertar Patiano.pdf",
    instrument: "conservacion",
    council: "CC - Despertad Patianos",
    visibility: "internal",
    bucket: "docs-internal",
    storagePath: "conservacion/cc-despertad-patianos/componente-social/cc-despertar-patiano.pdf",
    title: "CC - Despertad Patianos - Componente Social",
  },
  {
    source: "docs/files/INF. INTERNA/AREAS DE CONSERVACIÓN COMUNITARIA/CC - Diego Luis Córdoba/Componente Ambiental/INF. AMBIENTAL - CC - DIEGO LUIS CORDOBA.pdf",
    instrument: "conservacion",
    council: "CC - Diego Luis Córdoba",
    visibility: "internal",
    bucket: "docs-internal",
    storagePath:
      "conservacion/cc-diego-luis-cordoba/componente-ambiental/inf-ambiental-cc-diego-luis-cordoba.pdf",
    title: "CC - Diego Luis Córdoba - Componente Ambiental",
  },
  {
    source: "docs/files/INF. INTERNA/AREAS DE CONSERVACIÓN COMUNITARIA/CC - Diego Luis Córdoba/Componente Catastral/CC DIEGO LUIS CORDOBA - TERRITORIO ANCESTRAL.pdf",
    instrument: "conservacion",
    council: "CC - Diego Luis Córdoba",
    visibility: "internal",
    bucket: "docs-internal",
    storagePath:
      "conservacion/cc-diego-luis-cordoba/componente-catastral/cc-diego-luis-cordoba-territorio-ancestral.pdf",
    title: "CC - Diego Luis Córdoba - Componente Catastral (Territorio Ancestral)",
  },
  {
    source: "docs/files/INF. INTERNA/AREAS DE CONSERVACIÓN COMUNITARIA/CC - Diego Luis Córdoba/Componente Catastral/CC_ DIEGO LUIS CORDOBA - ZONIFICACION.pdf",
    instrument: "conservacion",
    council: "CC - Diego Luis Córdoba",
    visibility: "internal",
    bucket: "docs-internal",
    storagePath:
      "conservacion/cc-diego-luis-cordoba/componente-catastral/cc-diego-luis-cordoba-zonificacion.pdf",
    title: "CC - Diego Luis Córdoba - Componente Catastral (Zonificación)",
  },
  {
    source: "docs/files/INF. INTERNA/AREAS DE CONSERVACIÓN COMUNITARIA/CC - Diego Luis Córdoba/Componente Catastral/INF GEOGRAFICO - Areas de Conservacion I.pdf",
    instrument: "conservacion",
    council: "CC - Diego Luis Córdoba",
    visibility: "internal",
    bucket: "docs-internal",
    storagePath:
      "conservacion/cc-diego-luis-cordoba/componente-catastral/inf-geografico-areas-de-conservacion-i.pdf",
    title: "CC - Diego Luis Córdoba - Componente Catastral (Geográfico)",
  },
  {
    source: "docs/files/INF. INTERNA/AREAS DE CONSERVACIÓN COMUNITARIA/CC - Diego Luis Córdoba/Componente Social/INF SOCIAL - Areas de Conservacion I.pdf",
    instrument: "conservacion",
    council: "CC - Diego Luis Córdoba",
    visibility: "internal",
    bucket: "docs-internal",
    storagePath: "conservacion/cc-diego-luis-cordoba/componente-social/inf-social-areas-de-conservacion-i.pdf",
    title: "CC - Diego Luis Córdoba - Componente Social",
  },
  {
    source: "docs/files/INF. INTERNA/AREAS DE CONSERVACIÓN COMUNITARIA/CC - Las Acacias/Componente Ambiental/INFORME AMBIENTAL.pdf",
    instrument: "conservacion",
    council: "CC - Las Acacias",
    visibility: "internal",
    bucket: "docs-internal",
    storagePath: "conservacion/cc-las-acacias/componente-ambiental/informe-ambiental.pdf",
    title: "CC - Las Acacias - Componente Ambiental",
  },
  {
    source: "docs/files/INF. INTERNA/AREAS DE CONSERVACIÓN COMUNITARIA/CC - Las Acacias/Componente Catastral/CC LAS ACACIAS - ZONIFICAVION.pdf",
    instrument: "conservacion",
    council: "CC - Las Acacias",
    visibility: "internal",
    bucket: "docs-internal",
    storagePath: "conservacion/cc-las-acacias/componente-catastral/cc-las-acacias-zonificavion.pdf",
    title: "CC - Las Acacias - Componente Catastral (Zonificación)",
  },
  {
    source: "docs/files/INF. INTERNA/AREAS DE CONSERVACIÓN COMUNITARIA/CC - Las Acacias/Componente Catastral/CC LAS ACACIAS- TERRITORIO ANCESTRAL.pdf",
    instrument: "conservacion",
    council: "CC - Las Acacias",
    visibility: "internal",
    bucket: "docs-internal",
    storagePath:
      "conservacion/cc-las-acacias/componente-catastral/cc-las-acacias-territorio-ancestral.pdf",
    title: "CC - Las Acacias - Componente Catastral (Territorio Ancestral)",
  },
  {
    source: "docs/files/INF. INTERNA/AREAS DE CONSERVACIÓN COMUNITARIA/CC - Las Acacias/Componente Catastral/INF GEOGRAFICO - Areas de Conservacion I.pdf",
    instrument: "conservacion",
    council: "CC - Las Acacias",
    visibility: "internal",
    bucket: "docs-internal",
    storagePath: "conservacion/cc-las-acacias/componente-catastral/inf-geografico-areas-de-conservacion-i.pdf",
    title: "CC - Las Acacias - Componente Catastral (Geográfico)",
  },
  {
    source: "docs/files/INF. INTERNA/AREAS DE CONSERVACIÓN COMUNITARIA/CC - Las Acacias/Componente Social/INF SOCIAL - Areas de Conservacion I.pdf",
    instrument: "conservacion",
    council: "CC - Las Acacias",
    visibility: "internal",
    bucket: "docs-internal",
    storagePath: "conservacion/cc-las-acacias/componente-social/inf-social-areas-de-conservacion-i.pdf",
    title: "CC - Las Acacias - Componente Social",
  },
  {
    source: "docs/files/INF. INTERNA/AREAS DE CONSERVACIÓN COMUNITARIA/CC - Los Dos Ríos de Corregimientos y Veredas de Cantagallo/2208025 Áreas de Conservación 2025 Los Dos Ríos.pdf",
    instrument: "conservacion",
    council: "CC - Los Dos Ríos de Corregimientos y Veredas de Cantagallo",
    visibility: "internal",
    bucket: "docs-internal",
    storagePath:
      "conservacion/cc-los-dos-rios-de-corregimientos-y-veredas-de-cantagallo/2208025-areas-de-conservacion-2025-los-dos-rios.pdf",
    title: "CC - Los Dos Ríos de Corregimientos y Veredas de Cantagallo",
  },
  {
    source: "docs/files/INF. INTERNA/AREAS DE CONSERVACIÓN COMUNITARIA/CC - Martin Luther King/Componente Ambiental/InformeAmbiental_MLK.pdf",
    instrument: "conservacion",
    council: "CC - Martin Luther King",
    visibility: "internal",
    bucket: "docs-internal",
    storagePath: "conservacion/cc-martin-luther-king/componente-ambiental/informeambiental-mlk.pdf",
    title: "CC - Martin Luther King - Componente Ambiental",
  },
  {
    source: "docs/files/INF. INTERNA/AREAS DE CONSERVACIÓN COMUNITARIA/CC - Martin Luther King/Componente Catastral/C. TOPOGRAFICO - SISTEMA DE AREAS DE CONSERVACION COMUNITARIA II.pdf",
    instrument: "conservacion",
    council: "CC - Martin Luther King",
    visibility: "internal",
    bucket: "docs-internal",
    storagePath:
      "conservacion/cc-martin-luther-king/componente-catastral/c-topografico-sistema-de-areas-de-conservacion-comunitaria-ii.pdf",
    title: "CC - Martin Luther King - Componente Catastral",
  },
  {
    source: "docs/files/INF. INTERNA/AREAS DE CONSERVACIÓN COMUNITARIA/CC - Martin Luther King/Componente Social/CC. Martin Luther King.pdf",
    instrument: "conservacion",
    council: "CC - Martin Luther King",
    visibility: "internal",
    bucket: "docs-internal",
    storagePath: "conservacion/cc-martin-luther-king/componente-social/cc-martin-luther-king.pdf",
    title: "CC - Martin Luther King - Componente Social",
  },
  {
    source: "docs/files/INF. INTERNA/AREAS DE CONSERVACIÓN COMUNITARIA/CC - Mayor de la Capitanía Afrodescendiente de Páez/22082025 Áreas_Conservación_CC_Capitanía 1.pdf",
    instrument: "conservacion",
    council: "CC - Mayor de la Capitanía Afrodescendiente de Páez",
    visibility: "internal",
    bucket: "docs-internal",
    storagePath:
      "conservacion/cc-mayor-de-la-capitania-afrodescendiente-de-paez/22082025-areas-conservacion-cc-capitania-1.pdf",
    title: "CC - Mayor de la Capitanía Afrodescendiente de Páez",
  },
  {
    source: "docs/files/INF. INTERNA/AREAS DE CONSERVACIÓN COMUNITARIA/CC - Mujeres Afro del Patía California/Componente Ambiental/InformeAmbiental_CC_Afromujeres.pdf",
    instrument: "conservacion",
    council: "CC - Mujeres Afro del Patía California",
    visibility: "internal",
    bucket: "docs-internal",
    storagePath:
      "conservacion/cc-mujeres-afro-del-patia-california/componente-ambiental/informeambiental-cc-afromujeres.pdf",
    title: "CC - Mujeres Afro del Patía California - Componente Ambiental",
  },
  {
    source: "docs/files/INF. INTERNA/AREAS DE CONSERVACIÓN COMUNITARIA/CC - Mujeres Afro del Patía California/Componente Catastral/C. TOPOGRAFICO - SISTEMA DE AREAS DE CONSERVACION COMUNITARIA II.pdf",
    instrument: "conservacion",
    council: "CC - Mujeres Afro del Patía California",
    visibility: "internal",
    bucket: "docs-internal",
    storagePath:
      "conservacion/cc-mujeres-afro-del-patia-california/componente-catastral/c-topografico-sistema-de-areas-de-conservacion-comunitaria-ii.pdf",
    title: "CC - Mujeres Afro del Patía California - Componente Catastral",
  },
  {
    source: "docs/files/INF. INTERNA/AREAS DE CONSERVACIÓN COMUNITARIA/CC - Mujeres Afro del Patía California/Componente Social/CC. AfroMujeres del Patía.pdf",
    instrument: "conservacion",
    council: "CC - Mujeres Afro del Patía California",
    visibility: "internal",
    bucket: "docs-internal",
    storagePath:
      "conservacion/cc-mujeres-afro-del-patia-california/componente-social/cc-afromujeres-del-patia.pdf",
    title: "CC - Mujeres Afro del Patía California - Componente Social",
  },
  {
    source: "docs/files/INF. INTERNA/AREAS DE CONSERVACIÓN COMUNITARIA/CC - Nelson Mandela/Componente Ambiental/CC - NELSON MANDELA - INF. AMBIENTAL.pdf",
    instrument: "conservacion",
    council: "CC - Nelson Mandela",
    visibility: "internal",
    bucket: "docs-internal",
    storagePath: "conservacion/cc-nelson-mandela/componente-ambiental/cc-nelson-mandela-inf-ambiental.pdf",
    title: "CC - Nelson Mandela - Componente Ambiental",
  },
  {
    source: "docs/files/INF. INTERNA/AREAS DE CONSERVACIÓN COMUNITARIA/CC - Nelson Mandela/Componente Catastral/CC - NELSON MANDELA - INF. AMBIENTAL.pdf",
    instrument: "conservacion",
    council: "CC - Nelson Mandela",
    visibility: "internal",
    bucket: "docs-internal",
    storagePath: "conservacion/cc-nelson-mandela/componente-catastral/cc-nelson-mandela-inf-ambiental.pdf",
    title: "CC - Nelson Mandela - Componente Catastral (Informe Ambiental)",
  },
  {
    source: "docs/files/INF. INTERNA/AREAS DE CONSERVACIÓN COMUNITARIA/CC - Nelson Mandela/Componente Catastral/CC - NELSON MANDELA - TERRITORIO ANCESTRAL.pdf",
    instrument: "conservacion",
    council: "CC - Nelson Mandela",
    visibility: "internal",
    bucket: "docs-internal",
    storagePath:
      "conservacion/cc-nelson-mandela/componente-catastral/cc-nelson-mandela-territorio-ancestral.pdf",
    title: "CC - Nelson Mandela - Componente Catastral (Territorio Ancestral)",
  },
  {
    source: "docs/files/INF. INTERNA/AREAS DE CONSERVACIÓN COMUNITARIA/CC - Nelson Mandela/Componente Catastral/INF GEOGRAFICO - Areas de Conservacion I.pdf",
    instrument: "conservacion",
    council: "CC - Nelson Mandela",
    visibility: "internal",
    bucket: "docs-internal",
    storagePath: "conservacion/cc-nelson-mandela/componente-catastral/inf-geografico-areas-de-conservacion-i.pdf",
    title: "CC - Nelson Mandela - Componente Catastral (Geográfico)",
  },
  {
    source: "docs/files/INF. INTERNA/AREAS DE CONSERVACIÓN COMUNITARIA/CC - Nelson Mandela/Componente Social/INF SOCIAL - Areas de Conservacion I.pdf",
    instrument: "conservacion",
    council: "CC - Nelson Mandela",
    visibility: "internal",
    bucket: "docs-internal",
    storagePath: "conservacion/cc-nelson-mandela/componente-social/inf-social-areas-de-conservacion-i.pdf",
    title: "CC - Nelson Mandela - Componente Social",
  },
  {
    source: "docs/files/INF. INTERNA/AREAS DE CONSERVACIÓN COMUNITARIA/CC - Raíces/13082025 Áreas_Conservación_CC_Raíces.pdf",
    instrument: "conservacion",
    council: "CC - Raices",
    visibility: "internal",
    bucket: "docs-internal",
    storagePath: "conservacion/cc-raices/13082025-areas-conservacion-cc-raices.pdf",
    title: "CC - Raices",
  },
  {
    source: "docs/files/INF. INTERNA/AREAS DE CONSERVACIÓN COMUNITARIA/CC - Renacientes de la Diáspora Africana →/Componente Ambiental/InformeAmbiental_CC_Renacientes_Chaguani.pdf",
    instrument: "conservacion",
    council: "CC - Renacientes de la Diáspora Africana",
    visibility: "internal",
    bucket: "docs-internal",
    storagePath:
      "conservacion/cc-renacientes-de-la-diaspora-africana/componente-ambiental/informeambiental-cc-renacientes-chaguani.pdf",
    title: "CC - Renacientes de la Diáspora Africana - Componente Ambiental",
  },
  {
    source: "docs/files/INF. INTERNA/AREAS DE CONSERVACIÓN COMUNITARIA/CC - Renacientes de la Diáspora Africana →/Componente Catastral/C. TOPOGRAFICO - SISTEMA DE AREAS DE CONSERVACION COMUNITARIA II.pdf",
    instrument: "conservacion",
    council: "CC - Renacientes de la Diáspora Africana",
    visibility: "internal",
    bucket: "docs-internal",
    storagePath:
      "conservacion/cc-renacientes-de-la-diaspora-africana/componente-catastral/c-topografico-sistema-de-areas-de-conservacion-comunitaria-ii.pdf",
    title: "CC - Renacientes de la Diáspora Africana - Componente Catastral",
  },
  {
    source: "docs/files/INF. INTERNA/AREAS DE CONSERVACIÓN COMUNITARIA/CC - Renacientes de la Diáspora Africana →/Componente Social/CC. RENACIENTES DE LA DIÁSPORA AFRICANA.pdf",
    instrument: "conservacion",
    council: "CC - Renacientes de la Diáspora Africana",
    visibility: "internal",
    bucket: "docs-internal",
    storagePath:
      "conservacion/cc-renacientes-de-la-diaspora-africana/componente-social/cc-renacientes-de-la-diaspora-africana.pdf",
    title: "CC - Renacientes de la Diáspora Africana - Componente Social",
  },
  {
    source: "docs/files/INF. INTERNA/AREAS DE CONSERVACIÓN COMUNITARIA/CC - Villa del Río/Componente Ambiental/INF. AMBIENTAL - CC VILLA DEL RIO.pdf",
    instrument: "conservacion",
    council: "CC - Villa del Río",
    visibility: "internal",
    bucket: "docs-internal",
    storagePath: "conservacion/cc-villa-del-rio/componente-ambiental/inf-ambiental-cc-villa-del-rio.pdf",
    title: "CC - Villa del Río - Componente Ambiental",
  },
  {
    source: "docs/files/INF. INTERNA/AREAS DE CONSERVACIÓN COMUNITARIA/CC - Villa del Río/Componente Catastral/CC. VILLA DEL RIO - TERRITORIO ANCESTRAL.pdf",
    instrument: "conservacion",
    council: "CC - Villa del Río",
    visibility: "internal",
    bucket: "docs-internal",
    storagePath:
      "conservacion/cc-villa-del-rio/componente-catastral/cc-villa-del-rio-territorio-ancestral.pdf",
    title: "CC - Villa del Río - Componente Catastral (Territorio Ancestral)",
  },
  {
    source: "docs/files/INF. INTERNA/AREAS DE CONSERVACIÓN COMUNITARIA/CC - Villa del Río/Componente Catastral/CC. VILLA DEL RIO - ZONIFICACION.pdf",
    instrument: "conservacion",
    council: "CC - Villa del Río",
    visibility: "internal",
    bucket: "docs-internal",
    storagePath: "conservacion/cc-villa-del-rio/componente-catastral/cc-villa-del-rio-zonificacion.pdf",
    title: "CC - Villa del Río - Componente Catastral (Zonificación)",
  },
  {
    source: "docs/files/INF. INTERNA/AREAS DE CONSERVACIÓN COMUNITARIA/CC - Villa del Río/Componente Catastral/INF GEOGRAFICO - Areas de Conservacion I.pdf",
    instrument: "conservacion",
    council: "CC - Villa del Río",
    visibility: "internal",
    bucket: "docs-internal",
    storagePath: "conservacion/cc-villa-del-rio/componente-catastral/inf-geografico-areas-de-conservacion-i.pdf",
    title: "CC - Villa del Río - Componente Catastral (Geográfico)",
  },
  {
    source: "docs/files/INF. INTERNA/AREAS DE CONSERVACIÓN COMUNITARIA/CC - Villa del Río/Componente Social/INF SOCIAL - Areas de Conservacion I.pdf",
    instrument: "conservacion",
    council: "CC - Villa del Río",
    visibility: "internal",
    bucket: "docs-internal",
    storagePath: "conservacion/cc-villa-del-rio/componente-social/inf-social-areas-de-conservacion-i.pdf",
    title: "CC - Villa del Río - Componente Social",
  },
];

function toUniqueRows(rows) {
  const map = new Map();
  for (const row of rows) {
    map.set(`${row.bucket}/${row.storagePath}`, row);
  }
  return [...map.values()];
}

const allRows = toUniqueRows(normalizeRows(fileMap));
validateSourceCategorization(allRows);
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

async function cleanupLegacyConservacionFallbackRows() {
  if (!supabase || !documentsTableAvailable) {
    return { deleted: 0 };
  }

  const { data: staleRows, error: listError } = await supabase
    .from("documents")
    .select("id")
    .eq("instrument", "conservacion")
    .in("storage_path", LEGACY_CONSERVACION_FALLBACK_PATHS);

  if (listError) {
    throw listError;
  }

  if (!staleRows || staleRows.length === 0) {
    return { deleted: 0 };
  }

  const ids = staleRows.map((row) => row.id).filter(Boolean);
  if (ids.length === 0) {
    return { deleted: 0 };
  }

  const { error: deleteError } = await supabase
    .from("documents")
    .delete()
    .in("id", ids);

  if (deleteError) {
    throw deleteError;
  }

  return { deleted: ids.length };
}

async function cleanupLegacyReglamentosStaleRows() {
  if (!supabase || !documentsTableAvailable) {
    return { deleted: 0 };
  }

  const { data: staleRows, error: listError } = await supabase
    .from("documents")
    .select("id")
    .eq("instrument", "reglamentos")
    .in("storage_path", LEGACY_REGLAMENTOS_STALE_PATHS);

  if (listError) {
    throw listError;
  }

  if (!staleRows || staleRows.length === 0) {
    return { deleted: 0 };
  }

  const ids = staleRows.map((row) => row.id).filter(Boolean);
  if (ids.length === 0) {
    return { deleted: 0 };
  }

  const { error: deleteError } = await supabase
    .from("documents")
    .delete()
    .in("id", ids);

  if (deleteError) {
    throw deleteError;
  }

  return { deleted: ids.length };
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

  await printSourceCoverageDashboard();

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

  await printSourceCoverageDashboard();

  const expectedByInstrument = Object.keys(MANAGED_SOURCE_ROOTS).reduce((acc, instrument) => {
    acc[instrument] = 0;
    return acc;
  }, {});
  const expectedPathSetsByInstrument = Object.keys(MANAGED_SOURCE_ROOTS).reduce((acc, instrument) => {
    acc[instrument] = new Set();
    return acc;
  }, {});

  allRows.forEach((row) => {
    expectedByInstrument[row.instrument] = (expectedByInstrument[row.instrument] ?? 0) + 1;
    expectedPathSetsByInstrument[row.instrument].add(row.storagePath);
  });

  const { data, error } = await supabase
    .from("documents")
    .select("id, instrument, visibility, storage_bucket, storage_path");
  if (error) {
    throw error;
  }

  const remoteByInstrument = {};
  const remoteManagedByInstrument = {};
  const unexpectedPrivateByInstrument = {};
  const unexpectedPrivatePathsByInstrument = {};
  const remoteKeys = new Set();
  const sampleIdByInstrument = {};
  const sampleManagedIdByInstrument = {};
  const sampleUnexpectedPrivatePathByInstrument = {};
  let legacyConservacionFallbackRows = 0;
  for (const row of data ?? []) {
    const id = String(row.id ?? "");
    const instrument = String(row.instrument ?? "");
    const visibility = String(row.visibility ?? "");
    const storageBucket = String(row.storage_bucket ?? "");
    const storagePath = String(row.storage_path ?? "");
    if (!id || !instrument) continue;
    remoteByInstrument[instrument] = (remoteByInstrument[instrument] ?? 0) + 1;
    if (storagePath) {
      remoteKeys.add(`${instrument}::${storagePath}`);
    }
    if (!sampleIdByInstrument[instrument]) {
      sampleIdByInstrument[instrument] = id;
    }
    if (instrument in expectedPathSetsByInstrument) {
      const expectedSet = expectedPathSetsByInstrument[instrument];
      const isExpectedManagedPath = storagePath && expectedSet.has(storagePath);
      if (isExpectedManagedPath) {
        remoteManagedByInstrument[instrument] = (remoteManagedByInstrument[instrument] ?? 0) + 1;
        if (!sampleManagedIdByInstrument[instrument]) {
          sampleManagedIdByInstrument[instrument] = id;
        }
      } else if (
        storageBucket &&
        ["docs-internal", "docs-sensitive"].includes(storageBucket) &&
        visibility !== "public"
      ) {
        unexpectedPrivateByInstrument[instrument] =
          (unexpectedPrivateByInstrument[instrument] ?? 0) + 1;
        const currentList = unexpectedPrivatePathsByInstrument[instrument] ?? [];
        if (storagePath && !currentList.includes(storagePath)) {
          currentList.push(storagePath);
        }
        unexpectedPrivatePathsByInstrument[instrument] = currentList;
        if (!sampleUnexpectedPrivatePathByInstrument[instrument]) {
          sampleUnexpectedPrivatePathByInstrument[instrument] = storagePath || "(null)";
        }
      }
    }

    if (
      instrument === "conservacion" &&
      storageBucket === "docs-sensitive" &&
      visibility === "sensitive" &&
      LEGACY_CONSERVACION_FALLBACK_PATHS.includes(storagePath)
    ) {
      legacyConservacionFallbackRows += 1;
    }
  }

  console.log("documents by instrument (managed private paths only, remote vs expected):");
  const managedInstruments = Object.keys(expectedByInstrument).sort();
  for (const instrument of managedInstruments) {
    const remoteCount = remoteManagedByInstrument[instrument] ?? 0;
    const expectedCount = expectedByInstrument[instrument] ?? 0;
    const sampleId = sampleManagedIdByInstrument[instrument] ?? sampleIdByInstrument[instrument];
    const unexpectedPrivateCount = unexpectedPrivateByInstrument[instrument] ?? 0;
    const unexpectedPrivateSamplePath = sampleUnexpectedPrivatePathByInstrument[instrument];
    console.log(
      `- ${instrument}: ${remoteCount}/${expectedCount}${
        remoteCount > 0 && sampleId ? ` (sample id: ${sampleId})` : ""
      }`,
    );
    if (unexpectedPrivateCount > 0) {
      console.log(
        `  unexpected private rows for ${instrument}: ${unexpectedPrivateCount}${
          unexpectedPrivateSamplePath ? ` (sample path: ${unexpectedPrivateSamplePath})` : ""
        }`,
      );
      const unexpectedPaths = unexpectedPrivatePathsByInstrument[instrument] ?? [];
      if (unexpectedPaths.length > 0) {
        const toPrint = unexpectedPaths.slice(0, 20);
        for (const path of toPrint) {
          console.log(`    - ${path}`);
        }
        if (unexpectedPaths.length > toPrint.length) {
          console.log(`    ... and ${unexpectedPaths.length - toPrint.length} more`);
        }
      }
    }
  }

  const extraInstruments = Object.keys(remoteByInstrument)
    .filter((instrument) => !(instrument in expectedByInstrument))
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
  } else {
    console.log("documents metadata check: missing rows detected:");
    for (const key of missing) {
      console.log(`- ${key}`);
    }
  }

  if (legacyConservacionFallbackRows > 0) {
    console.log(
      `legacy conservacion fallback rows detected: ${legacyConservacionFallbackRows} (should be 0 after cleanup)`,
    );
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
  await printSourceCoverageDashboard();
  let uploadedCount = 0;
  let insertedCount = 0;
  let cleanedLegacyRows = 0;
  let cleanedLegacyReglamentosRows = 0;

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
    } else {
      const cleanup = await cleanupLegacyConservacionFallbackRows();
      cleanedLegacyRows = cleanup.deleted;
      if (cleanedLegacyRows > 0) {
        console.log(`Removed legacy conservacion fallback rows: ${cleanedLegacyRows}.`);
      }

      const cleanupReglamentos = await cleanupLegacyReglamentosStaleRows();
      cleanedLegacyReglamentosRows = cleanupReglamentos.deleted;
      if (cleanedLegacyReglamentosRows > 0) {
        console.log(`Removed legacy reglamentos stale rows: ${cleanedLegacyReglamentosRows}.`);
      }
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
  if (cleanedLegacyRows > 0) {
    console.log(
      "Legacy mirrored conservacion metadata has been removed. Conservacion now reflects only direct source files.",
    );
  }
  if (cleanedLegacyReglamentosRows > 0) {
    console.log(
      "Legacy reglamentos metadata rows have been removed. Reglamentos now reflects normalized ACTAS path keys only.",
    );
  }
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
