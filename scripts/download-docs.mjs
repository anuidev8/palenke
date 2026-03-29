/**
 * download-docs.mjs
 * Downloads all internal documents from SharePoint and stores them locally.
 *
 * HOW TO GET YOUR AUTH COOKIES:
 *   1. Open Chrome and go to https://hileros-my.sharepoint.com
 *   2. Press F12 → Application → Cookies → hileros-my.sharepoint.com
 *   3. Copy the values of "FedAuth" and "rtFa"
 *   4. Run:
 *        FEDAUTH=<value> RTFA=<value> node scripts/download-docs.mjs
 */

import fs from "fs";
import https from "https";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..", "public", "documentos");

// ── Auth cookies from environment ──────────────────────────────────────────
const FEDAUTH = process.env.FEDAUTH;
const RTFA = process.env.RTFA;

if (!FEDAUTH || !RTFA) {
  console.error(`
❌  Missing SharePoint auth cookies.

Run with:
  FEDAUTH=<FedAuth cookie> RTFA=<rtFa cookie> node scripts/download-docs.mjs

How to get them:
  1. Open Chrome → https://hileros-my.sharepoint.com (already logged in)
  2. Press F12 → Application tab → Cookies → hileros-my.sharepoint.com
  3. Copy the value of "FedAuth" (starts with "77u/...")
  4. Copy the value of "rtFa"
`);
  process.exit(1);
}

const COOKIE = `FedAuth=${FEDAUTH}; rtFa=${RTFA}`;
const SP_HOST = "hileros-my.sharepoint.com";
const SP_BASE = "/personal/fconu_renacientes_org/Documents/ARCHIVO/2026/INFORMACION PAGINA WEB/INF. INTERNA";

// ── File manifest ───────────────────────────────────────────────────────────
const FILES = [
  // ── REGLAMENTOS INTERNOS ────────────────────────────────────────────────
  {
    remote: `${SP_BASE}/REGLAMENTOS INTERNOS/CC DIEGO LUIS CORDOBA/REGLAMENTO INTERNO DIEGO LUIS CORDOBA 19.pdf`,
    local: "reglamentos-internos/reglamento-interno-diego-luis-cordoba.pdf",
    label: "CC Diego Luis Córdoba",
  },
  {
    remote: `${SP_BASE}/REGLAMENTOS INTERNOS/CC ESPERANZA VIVA/REGLAMENTO INTERNO-- CC ESPERANZA VIVA.pdf`,
    local: "reglamentos-internos/reglamento-interno-esperanza-viva.pdf",
    label: "CC Esperanza Viva",
  },
  {
    remote: `${SP_BASE}/REGLAMENTOS INTERNOS/CC LLAVES DEL FUTURO/REGLAMENTO INTERNO - CC LLAVES DEL FUTURO.pdf`,
    local: "reglamentos-internos/reglamento-interno-llaves-del-futuro.pdf",
    label: "CC Llaves del Futuro",
  },
  {
    remote: `${SP_BASE}/REGLAMENTOS INTERNOS/CC MARTIN LUTHER KING/REGLAMENTO INTERNO MARTIN LUTHER KING (1).pdf`,
    local: "reglamentos-internos/reglamento-interno-martin-luther-king.pdf",
    label: "CC Martin Luther King",
  },
  {
    remote: `${SP_BASE}/REGLAMENTOS INTERNOS/CC MAYOR DE CAPITANIA/REGLAMENTO INTERNO - CAPITANIA.pdf`,
    local: "reglamentos-internos/reglamento-interno-mayor-capitania.pdf",
    label: "CC Mayor de Capitanía",
  },
  {
    remote: `${SP_BASE}/REGLAMENTOS INTERNOS/CC NELSON MANDELA - GUAVIARE/REGLAMENTO INTERNO NELSON MANDELA.pdf`,
    local: "reglamentos-internos/reglamento-interno-nelson-mandela-guaviare.pdf",
    label: "CC Nelson Mandela (Guaviare)",
  },
  {
    remote: `${SP_BASE}/REGLAMENTOS INTERNOS/CC NELSON MANDELA - PIAMONTE/REGLAMENTO INTERNO - CC NELSON MANDELA.pdf`,
    local: "reglamentos-internos/reglamento-interno-nelson-mandela-piamonte.pdf",
    label: "CC Nelson Mandela (Piamonte)",
  },
  {
    remote: `${SP_BASE}/REGLAMENTOS INTERNOS/CC NUEVA ESPERANZA/REGLAMENTO INTERNO - CC NUEVA ESPERANZA.pdf`,
    local: "reglamentos-internos/reglamento-interno-nueva-esperanza.pdf",
    label: "CC Nueva Esperanza",
  },
  {
    remote: `${SP_BASE}/REGLAMENTOS INTERNOS/CC ORCONEPIAC/REGLAMENTO INTERNO - CC ORCONEPIAC.pdf`,
    local: "reglamentos-internos/reglamento-interno-orconepiac.pdf",
    label: "CC ORCONEPIAC",
  },

  // ── PLANES DE ETNODESARROLLO ─────────────────────────────────────────────
  {
    remote: `${SP_BASE}/PLAN DE ETNODESARROLLO/CC. DIEGO LUIS CORDOBA/PLAN ETNODESARROLLO DIEGO LUIS CÓRDOBA 20241201.pdf`,
    local: "planes-etnodesarrollo/plan-etnodesarrollo-diego-luis-cordoba-2024.pdf",
    label: "Plan Etnodesarrollo Diego Luis Córdoba",
  },
  {
    remote: `${SP_BASE}/PLAN DE ETNODESARROLLO/CC. MARTIN LUTHER KING/PED MARTIN KUTHER KING.pdf`,
    local: "planes-etnodesarrollo/plan-etnodesarrollo-martin-luther-king.pdf",
    label: "Plan Etnodesarrollo Martin Luther King",
  },
  {
    remote: `${SP_BASE}/PLAN DE ETNODESARROLLO/CC. NELSON MANDELA/20241201 PLAN DE ETNODESARROLLO DE NELSON MANDELA.pdf`,
    local: "planes-etnodesarrollo/plan-etnodesarrollo-nelson-mandela-2024.pdf",
    label: "Plan Etnodesarrollo Nelson Mandela",
  },

  // ── PUMANE ───────────────────────────────────────────────────────────────
  {
    remote: `${SP_BASE}/PLAN DE USO Y MANEJO AMBIENTAL NEGRO - PUMANE/RENACIENTES DE LA DIASPORA AFRICANA/PUMANE FINAL_CCCN_RENACIENTES_DE_LA_DIÁSPORA_AFRICANA.pdf`,
    local: "pumane/pumane-renacientes-diaspora-africana.pdf",
    label: "PUMANE Renacientes de la Diáspora Africana",
  },
  {
    remote: `${SP_BASE}/PLAN DE USO Y MANEJO AMBIENTAL NEGRO - PUMANE/RENACIENTES DE LA DIASPORA AFRICANA/ANEXO 1 PUMANE GLOSARIO.pdf`,
    local: "pumane/pumane-anexo-1-glosario.pdf",
    label: "PUMANE Anexo 1 — Glosario",
  },
  {
    remote: `${SP_BASE}/PLAN DE USO Y MANEJO AMBIENTAL NEGRO - PUMANE/RENACIENTES DE LA DIASPORA AFRICANA/ANEXO 2 MEMORIA METODOLÓGICA DETALLADA PUMANE.pdf`,
    local: "pumane/pumane-anexo-2-memoria-metodologica.pdf",
    label: "PUMANE Anexo 2 — Memoria metodológica",
  },
  {
    remote: `${SP_BASE}/PLAN DE USO Y MANEJO AMBIENTAL NEGRO - PUMANE/RENACIENTES DE LA DIASPORA AFRICANA/ANEXO 3 Especies de Flora y Fauna PUMANE CC Renacientes.pdf`,
    local: "pumane/pumane-anexo-3-flora-fauna.pdf",
    label: "PUMANE Anexo 3 — Flora y Fauna",
  },
];

// ── Downloader ──────────────────────────────────────────────────────────────
function downloadFile(remotePath, localRelative) {
  return new Promise((resolve, reject) => {
    const encodedPath = remotePath
      .split("/")
      .map((seg) => encodeURIComponent(seg))
      .join("/");

    const options = {
      hostname: SP_HOST,
      path: encodedPath,
      method: "GET",
      headers: {
        Cookie: COOKIE,
        Accept: "application/octet-stream,*/*",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      },
    };

    const dest = path.join(ROOT, localRelative);
    fs.mkdirSync(path.dirname(dest), { recursive: true });

    const req = https.request(options, (res) => {
      // Follow redirects
      if (res.statusCode === 301 || res.statusCode === 302) {
        const redirectUrl = new URL(res.headers.location);
        const redirectOptions = {
          hostname: redirectUrl.hostname,
          path: redirectUrl.pathname + redirectUrl.search,
          method: "GET",
          headers: { Cookie: COOKIE, Accept: "application/octet-stream,*/*" },
        };
        https.request(redirectOptions, (res2) => {
          if (res2.statusCode !== 200) {
            return reject(new Error(`HTTP ${res2.statusCode} after redirect`));
          }
          const file = fs.createWriteStream(dest);
          res2.pipe(file);
          file.on("finish", () => { file.close(); resolve(dest); });
          file.on("error", reject);
        }).on("error", reject).end();
        return;
      }

      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} for ${remotePath}`));
      }

      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on("finish", () => { file.close(); resolve(dest); });
      file.on("error", reject);
    });

    req.on("error", reject);
    req.end();
  });
}

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n📂 Downloading ${FILES.length} documents to public/documentos/\n`);

  let ok = 0;
  let fail = 0;

  for (const file of FILES) {
    process.stdout.write(`  ⬇  ${file.label}... `);
    try {
      const dest = await downloadFile(file.remote, file.local);
      const size = (fs.statSync(dest).size / 1024).toFixed(0);
      console.log(`✅  (${size} KB)`);
      ok++;
    } catch (err) {
      console.log(`❌  ${err.message}`);
      fail++;
    }
  }

  console.log(`\n✅ ${ok} downloaded  ❌ ${fail} failed`);
  console.log(`\n📁 Files saved to: public/documentos/`);

  if (ok > 0) {
    console.log(`\n💡 Next step: Run  node scripts/update-doc-urls.mjs  to update mock-data.ts URLs to local paths.\n`);
  }
}

main();
