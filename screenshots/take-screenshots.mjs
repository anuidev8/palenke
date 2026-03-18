import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const outDir = '/Users/usuario/Documents/me/clients/palenke/screenshots';
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });

const page = await context.newPage();
await page.goto('http://localhost:3000/', { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(1000);

// Scroll down just enough to reveal the sticky header
await page.evaluate(() => window.scrollBy(0, 200));
await page.waitForTimeout(800);

await page.screenshot({
  path: `${outDir}/inicio-header.png`,
  fullPage: false, // viewport only so header is visible
});

await page.close();
await browser.close();
console.log('✓ inicio-header.png saved');
