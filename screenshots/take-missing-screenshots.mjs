import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const outDir = '/Users/usuario/Documents/me/clients/palenke/screenshots';
mkdirSync(outDir, { recursive: true });

const BASE = 'http://localhost:3000';

const pages = [
  // Linked from inicio
  { url: `${BASE}/noticias`,                file: 'noticias.png' },
  { url: `${BASE}/geoportal?role=internal`, file: 'geoportal.png' },
  // Linked from scita
  { url: `${BASE}/estadisticas`,            file: 'estadisticas.png' },
  { url: `${BASE}/scita/formulario`,        file: 'scita-formulario.png' },
  // Linked from memoria-afroterritorial
  { url: `${BASE}/biblioteca`,              file: 'biblioteca.png' },
  // Linked from nav (all main pages)
  { url: `${BASE}/politica-de-datos`,       file: 'politica-de-datos.png' },
  { url: `${BASE}/accesibilidad`,           file: 'accesibilidad.png' },
];

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });

for (const { url, file } of pages) {
  const page = await context.newPage();
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${outDir}/${file}`, fullPage: true });
    console.log(`✓ ${file}`);
  } catch (err) {
    console.error(`✗ ${file}: ${err.message}`);
  } finally {
    await page.close();
  }
}

await browser.close();
