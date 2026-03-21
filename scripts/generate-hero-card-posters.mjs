/**
 * Generates still poster images for home hero module cards (Memoria, Gobierno, SCITA, Incidencia)
 * using Gemini native image (default: gemini-3.1-flash-image-preview).
 *
 * Requires GEMINI_API_KEY in the environment, or in `.env` / `.env.local` (same as Next.js).
 *
 * Usage:
 *   node scripts/generate-hero-card-posters.mjs
 *   node scripts/generate-hero-card-posters.mjs --only memoria-afroterritorial
 *
 * Output: public/assets/hero-cards/<id>.png
 */

import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function parseEnvFile(text, { override } = { override: false }) {
  for (const line of text.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq === -1) continue;
    const key = t.slice(0, eq).trim();
    let val = t.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!key) continue;
    if (override || process.env[key] === undefined) process.env[key] = val;
  }
}

function loadDotEnv() {
  const root = process.cwd();
  const envPath = path.join(root, ".env");
  const localPath = path.join(root, ".env.local");
  if (fs.existsSync(envPath)) {
    parseEnvFile(fs.readFileSync(envPath, "utf8"), { override: false });
  }
  if (fs.existsSync(localPath)) {
    parseEnvFile(fs.readFileSync(localPath, "utf8"), { override: true });
  }
}

loadDotEnv();

const MODEL =
  process.env.GEMINI_IMAGE_MODEL ?? "gemini-3.1-flash-image-preview";
const ASPECT_RATIO = "16:9";

/** Shared visual language: matches dark card UI (gradient overlay on site handles legibility). */
const STYLE_CORE = [
  "Ultra-minimal cinematic photograph, low-key lighting, deep shadows, muted earthy palette (charcoal, deep green, indigo, warm dusk orange).",
  "Moody atmospheric haze or mist, high contrast, single strong focal subject, lots of negative space.",
  "One dignified Afro-descendant adult figure, small in the frame or in silhouette, anonymous (no recognizable face required), respectful and non-folklorized.",
  "Colombian Pacific / river-territory emotional tone without literal maps or text.",
  "No text, no logos, no watermarks, no UI mockups.",
  "Photorealistic, editorial quality, suitable as a video poster / card background.",
].join(" ");

const HERO_POSTERS = [
  {
    id: "memoria-afroterritorial",
    prompt: [
      STYLE_CORE,
      "Theme: collective memory and territorial archive.",
      "Scene: a lone person stands still before a vast misty mountain ridge at blue hour, holding nothing visible, posture of contemplation; memory as landscape.",
    ].join(" "),
  },
  {
    id: "gobierno-propio",
    prompt: [
      STYLE_CORE,
      "Theme: self-governance and community autonomy.",
      "Scene: wide savanna-like clearing at twilight, one person beneath a solitary tree, small against the sky, grounded and calm; governance as rooted presence.",
    ].join(" "),
  },
  {
    id: "scita",
    prompt: [
      STYLE_CORE,
      "Theme: territorial and environmental information, reading the land.",
      "Scene: horizon at last light over dark rolling hills, one figure seen from behind at the ridge line, looking toward the distance; data as careful observation, no screens or gadgets.",
    ].join(" "),
  },
  {
    id: "incidencia",
    prompt: [
      STYLE_CORE,
      "Theme: political voice and emerging action.",
      "Scene: extreme low angle, one person kneeling close to dark soil, hands near the earth as if planting or testifying, a single subtle green sprout visible; hope without sentimentality.",
    ].join(" "),
  },
];

function extractInlineImageBytes(response) {
  const candidates = response?.candidates ?? [];
  for (const candidate of candidates) {
    for (const part of candidate.content?.parts ?? []) {
      const data = part.inlineData?.data;
      if (data) return data;
    }
  }
  return null;
}

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("Missing GEMINI_API_KEY (set in env or .env).");
    process.exit(1);
  }

  const onlyArg = process.argv.find((a) => a.startsWith("--only="));
  const only = onlyArg?.split("=")[1];

  const outDir = path.join(process.cwd(), "public", "assets", "hero-cards");
  fs.mkdirSync(outDir, { recursive: true });

  const ai = new GoogleGenAI({ apiKey });
  const items = only
    ? HERO_POSTERS.filter((x) => x.id === only)
    : HERO_POSTERS;

  if (only && items.length === 0) {
    console.error(`Unknown id "${only}". Valid: ${HERO_POSTERS.map((x) => x.id).join(", ")}`);
    process.exit(1);
  }

  for (const item of items) {
    console.log(`\n→ ${item.id} (${MODEL})`);
    try {
      const response = await ai.models.generateContent({
        model: MODEL,
        contents: `${item.prompt}\nAspect ratio: ${ASPECT_RATIO}.`,
      });
      const b64 = extractInlineImageBytes(response);
      if (!b64) {
        console.error(`  No image bytes in response for ${item.id}`);
        continue;
      }
      const filepath = path.join(outDir, `${item.id}.png`);
      fs.writeFileSync(filepath, Buffer.from(b64, "base64"));
      console.log(`  Saved ${filepath}`);
    } catch (e) {
      console.error(`  Error: ${e?.message ?? e}`);
    }
  }

  console.log("\nDone. Point HeroCards `poster` to /assets/hero-cards/<id>.png");
}

main();
