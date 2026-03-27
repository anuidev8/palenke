import { chromium } from "playwright";
import { mkdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BASE_URL = (process.env.BASE_URL || "https://palenke-two.vercel.app").replace(/\/$/, "");
const outDir = path.join(__dirname, "palenke-two-vercel");

/** @type {{ path: string; name: string; fullPage?: boolean }[]} */
const routes = [
  { path: "/", name: "inicio", fullPage: true },
  { path: "/noticias", name: "noticias", fullPage: true },
  { path: "/memoria-afroterritorial", name: "memoria-afroterritorial", fullPage: true },
  { path: "/biblioteca", name: "biblioteca", fullPage: true },
  { path: "/gobierno-propio", name: "gobierno-propio", fullPage: true },
  { path: "/scita", name: "scita", fullPage: true },
  { path: "/scita/formulario", name: "scita-formulario", fullPage: true },
  { path: "/incidencia", name: "incidencia", fullPage: true },
];

mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
});

const page = await context.newPage();

for (const route of routes) {
  const url = `${BASE_URL}${route.path}`;
  const file = path.join(outDir, `${route.name}.png`);
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForTimeout(1500);
    await page.screenshot({
      path: file,
      fullPage: route.fullPage !== false,
    });
    console.log(`OK ${url} -> ${file}`);
  } catch (e) {
    console.error(`FAIL ${url}:`, e instanceof Error ? e.message : e);
  }
}

await page.close();
await browser.close();
console.log(`\nDone. Screenshots in: ${outDir}`);
