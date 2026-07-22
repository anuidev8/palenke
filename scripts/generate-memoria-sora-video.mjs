/**
 * Generates one Sora clip for the Memoria Afroterritorial hero.
 *
 * Usage:
 *   OPENAI_API_KEY="..." node scripts/generate-memoria-sora-video.mjs
 *
 * Output:
 *   public/videos/memoria-afroterritorial-video-presentation.mp4
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUTPUT_PATH = path.join(ROOT, "public", "videos", "memoria-afroterritorial-video-presentation.mp4");

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error("Missing OPENAI_API_KEY environment variable.");
  process.exit(1);
}

const VIDEO_MODEL = process.env.OPENAI_VIDEO_MODEL ?? "sora-2";
const DEFAULT_SECONDS = process.env.OPENAI_VIDEO_SECONDS ?? "8";
const DEFAULT_SIZE = process.env.OPENAI_VIDEO_SIZE ?? "1280x720";
const POLL_INTERVAL_MS = 10000;

const HARD_RULES =
  "Strict constraints: only Afro-descendant Black people from the Colombian Pacific; " +
  "no white people; no logos; no brand marks; no readable text; no on-screen text; " +
  "no UI overlays; no watermarks; no front-facing identifiable faces; " +
  "photorealistic cinematic 16:9 documentary video, warm natural light.";

const PROMPT =
  "Create one single 8-second cinematic 16:9 documentary video for the website hero of Memoria Afroterritorial. " +
  "The video must feel like several meaningful moments flowing together in one continuous short film, not separate clips. " +
  "Topic: Afroterritorial Memory in the Colombian Pacific, a Black Afro-descendant community preserving living memory through oral history, community archive objects, territorial maps, drums, textiles, seeds, and intergenerational storytelling. " +
  "Visual rhythm: 0-2 seconds, slow camera glide inside a wooden community house where an elder Black Afro-Colombian woman shares oral history in profile with young Black community members; " +
  "2-4 seconds, soft close-up of Black hands carefully arranging old family photographs, seeds, shells, woven cloth, and a traditional drum on a rustic table, with notebooks present but no readable text; " +
  "4-6 seconds, community members gathered around a hand-drawn territorial map, seen mostly through hands, backs, profiles, and three-quarter angles, pointing to places of memory; " +
  "6-8 seconds, golden-hour shot of elders, women, men, and youth walking together from the community house toward a green territorial path, dignified and calm. " +
  "Mood: meaningful, intimate, dignified, collective, ancestral, living archive, territory as memory, not tourism, not folklore performance, not institutional advertising. " +
  HARD_RULES;

async function openAiFetch(pathname, options = {}) {
  const res = await fetch(`https://api.openai.com${pathname}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${detail}`);
  }

  return res;
}

async function createVideoJob() {
  const form = new FormData();
  form.set("model", VIDEO_MODEL);
  form.set("prompt", PROMPT);
  form.set("seconds", DEFAULT_SECONDS);
  form.set("size", DEFAULT_SIZE);

  const res = await openAiFetch("/v1/videos", {
    method: "POST",
    body: form,
  });
  return res.json();
}

async function waitForVideo(videoId) {
  for (;;) {
    const res = await openAiFetch(`/v1/videos/${videoId}`);
    const video = await res.json();
    const progress = typeof video.progress === "number" ? ` ${video.progress}%` : "";
    process.stdout.write(`\r${video.status}${progress}   `);

    if (video.status === "completed") {
      process.stdout.write("\n");
      return video;
    }

    if (["failed", "cancelled"].includes(video.status)) {
      throw new Error(`Video ${videoId} ended with status ${video.status}`);
    }

    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
  }
}

async function downloadVideo(videoId, outputPath) {
  const res = await openAiFetch(`/v1/videos/${videoId}/content`);
  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(outputPath, buffer);
}

async function generateVideo() {
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });

  console.log("\n--------------------------------------------");
  console.log("Generating one Sora video for Memoria Afroterritorial");
  console.log(`Model: ${VIDEO_MODEL}`);
  console.log(`Seconds: ${DEFAULT_SECONDS}`);
  console.log(`Size: ${DEFAULT_SIZE}`);
  console.log(`Output: ${path.relative(ROOT, OUTPUT_PATH)}`);

  const job = await createVideoJob();
  console.log(`Job created: ${job.id}`);
  await waitForVideo(job.id);
  await downloadVideo(job.id, OUTPUT_PATH);
  console.log(`Saved video to ${path.relative(ROOT, OUTPUT_PATH)}`);
}

async function main() {
  try {
    await generateVideo();
  } catch (error) {
    console.error(`Failed to generate video: ${error.message}`);
    process.exitCode = 1;
  }
}

main();
