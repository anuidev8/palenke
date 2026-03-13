import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getGeneratedImage(promptId: string, promptText: string, aspectRatio: string = '1:1'): Promise<string> {
  const filename = `${promptId}.png`;
  const publicPath = path.join(process.cwd(), 'public', 'generated');
  const filePath = path.join(publicPath, filename);
  
  if (!fs.existsSync(publicPath)) {
    fs.mkdirSync(publicPath, { recursive: true });
  }

  // Check cache
  if (fs.existsSync(filePath)) {
    return `/generated/${filename}`;
  }

  try {
    console.log(`Generating image for ${promptId}...`);
    // imagen-4.0-generate-001 is the typical image generation model.
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: promptText,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/png',
            aspectRatio: aspectRatio
        }
    });

    const base64Image = response.generatedImages?.[0]?.image?.imageBytes;
    if (!base64Image) {
      throw new Error("No image generated in response");
    }
    fs.writeFileSync(filePath, Buffer.from(base64Image, 'base64'));
    return `/generated/${filename}`;
  } catch (error) {
    console.error('Error generating image:', error);
    return '';
  }
}
