import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("Missing GEMINI_API_KEY environment variable.");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });
const VIDEO_MODEL = process.env.GEMINI_VIDEO_MODEL ?? "veo-3.1-generate-preview";

const scenes = [
  {
    id: "scene-01",
    prompt: "Cinematic, slow-motion medium shot of a proud Afro-descendant community assembly in the Colombian Pacific. A woman leader in her 40s is speaking passionately, other members are listening respectfully. Wooden community hall, beautiful warm light, natural colors, realistic 4k, no white people, only Afro people."
  },
  {
    id: "scene-02",
    prompt: "Cinematic medium close-up of a young Afro-descendant woman and an elder man looking at a hand-drawn map of their collective lands near a river. Soft daylight, lush green jungle background. Slow camera glide, realistic 4k, no white people, only Afro people."
  },
  {
    id: "scene-03",
    prompt: "Cinematic wide shot of a traditional wooden canoe navigating through a lush mangrove forest on the Pacific coast of Colombia. A young Afro-descendant guardian standing proudly in the canoe. Warm tropical light, clean water. Cinematic camera motion, 4k, no white people, only Afro people."
  },
  {
    id: "scene-04",
    prompt: "Cinematic tracking shot of a group of Afro-Colombian community representatives walking with dignity along a riverbank in their ancestral territory under golden afternoon sun. Determined and hopeful expressions. Realistic 4k, no white people, only Afro people."
  }
];

async function generateAll() {
  const assetsDir = path.join(process.cwd(), 'media', 'gobierno-propio-hero-slideshow', 'assets');
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }

  for (const item of scenes) {
    const filename = `${item.id}.mp4`;
    const filePath = path.join(assetsDir, filename);
    
    console.log(`\n--------------------------------------------`);
    console.log(`Generating video for: ${item.id}`);
    console.log(`Prompt: ${item.prompt}`);
    console.log(`Model: ${VIDEO_MODEL}`);
    
    try {
      let operation = await ai.models.generateVideos({
        model: VIDEO_MODEL,
        prompt: item.prompt,
        config: {
          numberOfVideos: 1,
          aspectRatio: "16:9"
        },
      });

      console.log(`Operation created. Polling for results...`);
      while (!operation.done) {
        await new Promise(r => setTimeout(r, 10000));
        operation = await ai.operations.getVideosOperation({ operation });
        process.stdout.write(".");
      }
      console.log(`\nOperation finished!`);

      const videoUrl = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (!videoUrl) {
        throw new Error("No video URI returned by Veo.");
      }

      console.log(`Downloading video from: ${videoUrl}`);
      const res = await fetch(videoUrl, { 
        headers: { 
          'x-goog-api-key': apiKey
        } 
      });
      
      if (!res.ok) {
        throw new Error(`Failed to download video: ${res.status} ${res.statusText}`);
      }

      const buffer = await res.arrayBuffer();
      fs.writeFileSync(filePath, Buffer.from(buffer));
      console.log(`✅ Saved scene to ${filePath}`);
    } catch (error) {
      console.error(`❌ Failed to generate video for ${item.id}:`, error.message);
    }
  }
}

generateAll();
