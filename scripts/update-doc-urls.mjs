/**
 * update-doc-urls.mjs
 * Rewrites mock-data.ts: replaces every spInternalUrl("...") call with the
 * corresponding local /documentos/... path, and flips action: "external" →
 * action: "file" for those entries.
 *
 * Run AFTER download-docs.mjs has successfully downloaded all PDFs:
 *   node scripts/update-doc-urls.mjs
 *
 * The script is idempotent — running it twice has no additional effect.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MOCK_DATA = path.join(__dirname, "..", "src", "lib", "mock-data.ts");

// ── Mapping: exact spInternalUrl() argument → local /documentos/ path ────────
// Keys must match the strings passed to spInternalUrl() in mock-data.ts exactly.
const URL_MAP = [
  // ── Reglamentos internos ────────────────────────────────────────────────────
  {
    remote: "REGLAMENTOS INTERNOS/CC DIEGO LUIS CORDOBA/REGLAMENTO INTERNO DIEGO LUIS CORDOBA 19.pdf",
    local: "/documentos/reglamentos-internos/reglamento-interno-diego-luis-cordoba.pdf",
  },
  {
    remote: "REGLAMENTOS INTERNOS/CC ESPERANZA VIVA/REGLAMENTO INTERNO-- CC ESPERANZA VIVA.pdf",
    local: "/documentos/reglamentos-internos/reglamento-interno-esperanza-viva.pdf",
  },
  {
    remote: "REGLAMENTOS INTERNOS/CC LLAVES DEL FUTURO/REGLAMENTO INTERNO - CC LLAVES DEL FUTURO.pdf",
    local: "/documentos/reglamentos-internos/reglamento-interno-llaves-del-futuro.pdf",
  },
  {
    remote: "REGLAMENTOS INTERNOS/CC MARTIN LUTHER KING/REGLAMENTO INTERNO MARTIN LUTHER KING (1).pdf",
    local: "/documentos/reglamentos-internos/reglamento-interno-martin-luther-king.pdf",
  },
  {
    remote: "REGLAMENTOS INTERNOS/CC MAYOR DE CAPITANIA/REGLAMENTO INTERNO - CAPITANIA.pdf",
    local: "/documentos/reglamentos-internos/reglamento-interno-mayor-capitania.pdf",
  },
  {
    remote: "REGLAMENTOS INTERNOS/CC NELSON MANDELA - GUAVIARE/REGLAMENTO INTERNO NELSON MANDELA.pdf",
    local: "/documentos/reglamentos-internos/reglamento-interno-nelson-mandela-guaviare.pdf",
  },
  {
    remote: "REGLAMENTOS INTERNOS/CC NELSON MANDELA - PIAMONTE/REGLAMENTO INTERNO - CC NELSON MANDELA.pdf",
    local: "/documentos/reglamentos-internos/reglamento-interno-nelson-mandela-piamonte.pdf",
  },
  {
    remote: "REGLAMENTOS INTERNOS/CC NUEVA ESPERANZA/REGLAMENTO INTERNO - CC NUEVA ESPERANZA.pdf",
    local: "/documentos/reglamentos-internos/reglamento-interno-nueva-esperanza.pdf",
  },
  {
    remote: "REGLAMENTOS INTERNOS/CC ORCONEPIAC/REGLAMENTO INTERNO - CC ORCONEPIAC.pdf",
    local: "/documentos/reglamentos-internos/reglamento-interno-orconepiac.pdf",
  },

  // ── Planes de etnodesarrollo ────────────────────────────────────────────────
  {
    remote: "PLAN DE ETNODESARROLLO/CC. DIEGO LUIS CORDOBA/PLAN ETNODESARROLLO DIEGO LUIS C%C3%93RDOBA 20241201.pdf",
    local: "/documentos/planes-etnodesarrollo/plan-etnodesarrollo-diego-luis-cordoba-2024.pdf",
  },
  {
    remote: "PLAN DE ETNODESARROLLO/CC. MARTIN LUTHER KING/PED MARTIN KUTHER KING.pdf",
    local: "/documentos/planes-etnodesarrollo/plan-etnodesarrollo-martin-luther-king.pdf",
  },
  {
    remote: "PLAN DE ETNODESARROLLO/CC. NELSON MANDELA/20241201 PLAN DE ETNODESARROLLO DE NELSON MANDELA.pdf",
    local: "/documentos/planes-etnodesarrollo/plan-etnodesarrollo-nelson-mandela-2024.pdf",
  },

  // ── PUMANE ──────────────────────────────────────────────────────────────────
  {
    remote: "PLAN DE USO Y MANEJO AMBIENTAL NEGRO - PUMANE/RENACIENTES DE LA DIASPORA AFRICANA/PUMANE FINAL_CCCN_RENACIENTES_DE_LA_DI%C3%81SPORA_AFRICANA.pdf",
    local: "/documentos/pumane/pumane-renacientes-diaspora-africana.pdf",
  },
  {
    remote: "PLAN DE USO Y MANEJO AMBIENTAL NEGRO - PUMANE/RENACIENTES DE LA DIASPORA AFRICANA/ANEXO 1 PUMANE GLOSARIO.pdf",
    local: "/documentos/pumane/pumane-anexo-1-glosario.pdf",
  },
  {
    remote: "PLAN DE USO Y MANEJO AMBIENTAL NEGRO - PUMANE/RENACIENTES DE LA DIASPORA AFRICANA/ANEXO 2 MEMORIA METODOL%C3%93GICA DETALLADA PUMANE.pdf",
    local: "/documentos/pumane/pumane-anexo-2-memoria-metodologica.pdf",
  },
  {
    remote: "PLAN DE USO Y MANEJO AMBIENTAL NEGRO - PUMANE/RENACIENTES DE LA DIASPORA AFRICANA/ANEXO 3 Especies de Flora y Fauna PUMANE CC Renacientes.pdf",
    local: "/documentos/pumane/pumane-anexo-3-flora-fauna.pdf",
  },
];

// ── Main ─────────────────────────────────────────────────────────────────────
let source = fs.readFileSync(MOCK_DATA, "utf8");
const original = source;

let urlsReplaced = 0;

// Step 1: Replace each spInternalUrl("...") with the local path string.
for (const { remote, local } of URL_MAP) {
  // Escape special regex chars in the remote key
  const escaped = remote.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`spInternalUrl\\("${escaped}"\\)`, "g");
  const before = source;
  source = source.replace(pattern, `"${local}"`);
  if (source !== before) {
    urlsReplaced++;
    console.log(`  ✅  ${remote.split("/").pop()}`);
  } else {
    console.log(`  ⚠️   Not found (already updated?): ${remote.split("/").pop()}`);
  }
}

// Step 2: Flip action: "external" → action: "file" for every object block that
// now contains a local /documentos/ URL.  The regex stays within an object
// boundary by refusing to cross a closing brace.
const actionFixed = [];
source = source.replace(
  /action:\s*"external"((?:[^}]|\n)*?)url:\s*"\/documentos\//g,
  (match, middle) => {
    actionFixed.push(match.split("\n")[0].trim());
    return `action: "file"${middle}url: "/documentos/`;
  }
);

// Step 3: Write back only if something changed.
if (source === original) {
  console.log("\n✨  mock-data.ts is already up to date — nothing to change.\n");
  process.exit(0);
}

fs.writeFileSync(MOCK_DATA, source, "utf8");

console.log(`
✅  mock-data.ts updated successfully
    • ${urlsReplaced} URL(s) switched from SharePoint → local /documentos/
    • ${actionFixed.length} action(s) flipped from "external" → "file"

💡  Verify the result:
      npx tsc --noEmit            # type-check
      npm run dev                 # preview locally
`);
