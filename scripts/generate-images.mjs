import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

// Load env vars if using dotenv (optional if running with --env-file)
import 'dotenv/config';

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("Missing GEMINI_API_KEY environment variable.");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

const instruments = [
  {
    id: "reglamentos",
    prompt: "A symbolic abstract illustration of a community circle, warm earthy tones, people gathering around a central fire, geometric patterns, flat vector style, afro-colombian vibe",
  },
  {
    id: "planes-uso",
    prompt: "A beautiful aerial view of a lush tropical river winding through a dense green forest, traditional wooden canoes, vibrant nature, afro-colombian pacific coast landscape, stylized illustration",
  },
  {
    id: "etnodesarrollo",
    prompt: "A vibrant illustration of afro-colombian farmers working together in a fertile field, holding traditional tools, crops growing under a bright sun, symbolizing community development and cultural wealth",
  },
  {
    id: "conservacion",
    prompt: "A mystical and dense mangrove forest at twilight, bioluminescent water, a person holding a lantern respecting nature, deep spiritual connection with biodiversity, afro-colombian pacific coast",
  },
  {
    id: "proteccion-hidrica",
    prompt: "A stunning underwater view of a clean river connecting to the ocean, fish swimming, water roots, crystal clear blue tones, symbolizing pure water protection and life",
  },
];

async function generateAll() {
  const outDir = path.join(process.cwd(), 'public', 'assets', 'placeholders');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  for (const item of instruments) {
    console.log(`\nGenerating image for: ${item.id}`);
    console.log(`Prompt: ${item.prompt}`);
    
    try {
      const response = await ai.models.generateImages({
          model: 'imagen-3.0-generate-001',
          prompt: item.prompt,
          config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: '16:9',
          },
      });

      if (response.generatedImages && response.generatedImages.length > 0) {
        const base64Image = response.generatedImages[0].image.imageBytes;
        const buffer = Buffer.from(base64Image, 'base64');
        const filepath = path.join(outDir, `${item.id}.jpg`);
        fs.writeFileSync(filepath, buffer);
        console.log(`✅ Saved to ${filepath}`);
      } else {
        console.warn(`⚠️ No image generated for ${item.id}`);
      }
    } catch (error) {
      console.error(`❌ Failed to generate image for ${item.id}:`, error.message);
    }
  }
}

generateAll();
