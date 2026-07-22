#!/usr/bin/env node
/**
 * Capture public MVP screenshots for the evidence pack.
 * Usage: node scripts/capture_mvp_screenshots.mjs
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "../docs/final-formats/evidences/screenshots");
const BASE = process.env.MVP_URL || "https://dev-palenke-two.vercel.app";

const SHOTS = [
  { file: "01-home-plataforma.png", path: "/" },
  { file: "02-biblioteca-buscador.png", path: "/biblioteca" },
  { file: "03-mjn.png", path: "/mujeres-juventudes-ninez" },
  { file: "04-estadisticas-powerbi.png", path: "/estadisticas" },
  { file: "05-geoportal-acceso.png", path: "/geoportal" },
  { file: "06-gobierno-propio-accs.png", path: "/gobierno-propio" },
  { file: "07-incidencia.png", path: "/incidencia" },
  { file: "08-login-roles.png", path: "/login" },
];

mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
});

for (const shot of SHOTS) {
  const url = `${BASE}${shot.path}`;
  process.stdout.write(`Capturing ${shot.file} … `);
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForTimeout(1500);
    await page.screenshot({
      path: join(OUT, shot.file),
      fullPage: false,
    });
    console.log("ok");
  } catch (err) {
    console.log(`FAIL: ${err.message}`);
  }
}

await browser.close();
console.log(`Done. Files in ${OUT}`);
