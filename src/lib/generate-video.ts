import fs from 'fs';
import path from 'path';
import { getGeminiApiKey, getGeminiClient } from "@/lib/gemini-client";

const VIDEO_MODEL = process.env.GEMINI_VIDEO_MODEL ?? "veo-3.1-generate-preview";

export async function getGeneratedVideo(promptId: string, promptText: string): Promise<string> {
  const filename = `${promptId}.mp4`;
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
    console.log(`Generating video for ${promptId}... This might take a few minutes.`);
    const ai = getGeminiClient();
    const op = await ai.models.generateVideos({
      model: VIDEO_MODEL,
      prompt: promptText
    });

    let currentOp = op;
    // Poll the operation until it's done
    while (!currentOp.done) {
      await new Promise(r => setTimeout(r, 10000));
      currentOp = await ai.operations.getVideosOperation({ operation: currentOp });
    }

    const uri = currentOp.response?.generatedVideos?.[0]?.video?.uri;
    if (!uri) {
      throw new Error("No video URI returned");
    }

    // Download the video
    console.log(`Downloading video for ${promptId}...`);
    const res = await fetch(uri, { 
        headers: { 
            'x-goog-api-key': getGeminiApiKey()
        } 
    });
    
    if (!res.ok) {
        throw new Error(`Failed to download video: ${res.status} ${res.statusText}`);
    }

    const buffer = await res.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(buffer));
    
    console.log(`Video saved to ${filePath}`);
    return `/generated/${filename}`;
  } catch (error) {
    console.error('Error generating video:', error);
    return '';
  }
}
