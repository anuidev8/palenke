#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

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
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // ignore
  }
}

await loadEnvLocal();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "❌ Missing environment variables: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const bucket = "docs-public";
const fileName = "informe_auditoria_genero_hileros_2026.pdf";
const storagePath = `genero-familia/${fileName}`;

// Try multiple possible locations for the PDF
const possiblePaths = [
  path.resolve(root, "Informe Final Auditoria Genero Hileros_Reforzado.pdf"),
  path.resolve("/Users/usuario/Downloads/Informe Final Auditoria Genero Hileros_Reforzado.pdf"),
  path.resolve("/private/tmp/Informe Final Auditoria Genero Hileros_Reforzado.pdf"),
];

let pdfPath = null;
for (const p of possiblePaths) {
  try {
    await fs.access(p);
    pdfPath = p;
    break;
  } catch {
    // continue
  }
}

if (!pdfPath) {
  console.error("❌ PDF file not found in expected locations:");
  console.error(possiblePaths.join("\n"));
  console.error("\n📄 Please save the PDF to one of these locations:");
  console.error(`   - ${possiblePaths[0]} (project root)`);
  console.error(`   - ${possiblePaths[1]} (Downloads)`);
  process.exit(1);
}

console.log(`📄 Found PDF at: ${pdfPath}`);

try {
  // Read PDF
  console.log(`📤 Reading file...`);
  const fileContent = await fs.readFile(pdfPath);

  // Upload to Supabase Storage
  console.log(`📤 Uploading ${fileName} to Supabase Storage (${bucket}/${storagePath})...`);

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(storagePath, fileContent, {
      contentType: "application/pdf",
      upsert: true,
    });

  if (uploadError) {
    console.error(`❌ Upload error:`, uploadError.message);
    process.exit(1);
  }

  console.log(`✅ File uploaded successfully`);

  // Insert document metadata into database
  console.log(`📝 Adding document entry to database...`);

  const documentRow = {
    title:
      "Informe Final de Auditoría de Género - Corporación Agencia Afrocolombiana Hileros",
    instrument: "genero-familia",
    council: "Corporación Agencia Afrocolombiana Hileros",
    summary:
      "Auditoría de género con diagnóstico ampliado, marco normativo, ruta priorizada y presupuesto referencial para institucionalización del enfoque de género",
    document_type: "Auditoría",
    visibility: "internal",
    storage_bucket: bucket,
    storage_path: storagePath,
    published_on: "2026-04-18",
    territory: "Palenke de Pensamiento",
    priority_order: 1,
  };

  const { data: insertData, error: insertError } = await supabase
    .from("documents")
    .upsert([documentRow], { onConflict: "instrument,storage_path" })
    .select();

  if (insertError) {
    console.error(`❌ Database error:`, insertError.message);
    process.exit(1);
  }

  console.log(`✅ Document entry created in database`);
  console.log(`\n📊 Document Details:`);
  console.log(`   Title: ${documentRow.title}`);
  console.log(`   Instrument: ${documentRow.instrument}`);
  console.log(`   Visibility: ${documentRow.visibility}`);
  console.log(`   Storage: ${bucket}/${storagePath}`);
  console.log(`   Type: ${documentRow.document_type}`);
  console.log(`   Territory: ${documentRow.territory}`);
  console.log(
    `\n🎉 Document successfully uploaded! It will appear on /gobierno-propio/genero-familia`
  );
} catch (error) {
  console.error(`❌ Unexpected error:`, error.message);
  process.exit(1);
}
