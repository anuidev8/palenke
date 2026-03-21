import fs from 'fs';
import path from 'path';
import { getGeminiClient } from "@/lib/gemini-client";

const IMAGE_MODEL = process.env.GEMINI_IMAGE_MODEL ?? "gemini-3.1-flash-image-preview";

export async function getGeneratedImage(promptId: string, promptText: string, aspectRatio: string = '1:1'): Promise<string> {
  const filename = `${promptId}.png`;
  const publicPath = path.join(process.cwd(), 'public', 'generated');
  const filePath = path.join(publicPath, filename);
  
  if (!fs.existsSync(publicPath)) {
    fs.mkdirSync(publicPath, { recursive: true });
  }

  if (fs.existsSync(filePath)) {
    return `/generated/${filename}`;
  }

  if (!process.env.GEMINI_API_KEY?.trim()) {
    return '';
  }

  try {
    console.log(`Generating image for ${promptId}...`);
    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
        model: IMAGE_MODEL,
        contents: `${promptText}\nAspect ratio: ${aspectRatio}.`,
    });

    const base64Image = extractInlineImageBytes(response);
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

function extractInlineImageBytes(response: unknown) {
  const candidates = (response as {
    candidates?: Array<{
      content?: {
        parts?: Array<{
          inlineData?: { data?: string };
        }>;
      };
    }>;
  }).candidates;

  for (const candidate of candidates ?? []) {
    for (const part of candidate.content?.parts ?? []) {
      const data = part.inlineData?.data;
      if (data) {
        return data;
      }
    }
  }

  return null;
}
