/**
 * Builds the home hero presentation MP4 from a folder of still images
 * with Ken Burns zoom in/out and smooth slide transitions (~10s loop).
 *
 * Usage:
 *   node scripts/generate-home-hero-video.mjs
 *   node scripts/generate-home-hero-video.mjs --source "/path/to/images"
 *   node scripts/generate-home-hero-video.mjs --duration 10
 *
 * Output:
 *   public/videos/home-hero-presentacion.mp4
 *   public/assets/home-hero-slider/comunidad-*.jpg (synced copies)
 */

import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const DEFAULT_SOURCE = "/Users/usuario/Desktop/images";
const OUTPUT_VIDEO = path.join(ROOT, "public/videos/home-hero-presentacion.mp4");
const ASSETS_DIR = path.join(ROOT, "public/assets/home-hero-slider");

const WIDTH = 1920;
const HEIGHT = 1080;
const FPS = 30;
const TARGET_DURATION = 10;
const FADE_DURATION = 0.4;
const TRANSITION = "smoothleft";
const ZOOM_AMOUNT = 0.1;
const CRF = 18;

function parseArgs(argv) {
  const args = { source: DEFAULT_SOURCE, duration: TARGET_DURATION };
  for (let i = 2; i < argv.length; i += 1) {
    if (argv[i] === "--source" && argv[i + 1]) {
      args.source = argv[i + 1];
      i += 1;
    } else if (argv[i] === "--duration" && argv[i + 1]) {
      args.duration = Number(argv[i + 1]);
      i += 1;
    }
  }
  return args;
}

function listImages(sourceDir) {
  return fs
    .readdirSync(sourceDir)
    .filter((name) => /\.(jpe?g|png|webp)$/i.test(name))
    .sort((a, b) => a.localeCompare(b, "es", { numeric: true }))
    .map((name) => path.join(sourceDir, name));
}

function syncAssetCopies(images) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });

  const existing = fs.readdirSync(ASSETS_DIR).filter((name) => name.startsWith("comunidad-"));
  for (const name of existing) {
    fs.unlinkSync(path.join(ASSETS_DIR, name));
  }

  images.forEach((imagePath, index) => {
    const ext = path.extname(imagePath).toLowerCase() || ".jpg";
    const target = path.join(ASSETS_DIR, `comunidad-${String(index + 1).padStart(2, "0")}${ext}`);
    fs.copyFileSync(imagePath, target);
  });
}

function getTimings(imageCount, targetDuration) {
  const slideDuration = (targetDuration + (imageCount - 1) * FADE_DURATION) / imageCount;
  const totalDuration = imageCount * slideDuration - (imageCount - 1) * FADE_DURATION;
  const frames = Math.max(2, Math.round(slideDuration * FPS));
  return { slideDuration, totalDuration, frames };
}

function buildSlideFilter(index, frames) {
  const upscaleW = Math.round(WIDTH * 1.35);
  const upscaleH = Math.round(HEIGHT * 1.35);
  const zoomIn = index % 2 === 0;
  const startZoom = zoomIn ? 1 : 1 + ZOOM_AMOUNT;
  const endZoom = zoomIn ? 1 + ZOOM_AMOUNT : 1;
  const zoomExpr = `${startZoom}+(${endZoom}-${startZoom})*on/${frames}`;

  return `[${index}:v]scale=${upscaleW}:${upscaleH}:force_original_aspect_ratio=increase:flags=lanczos,crop=${upscaleW}:${upscaleH},unsharp=5:5:0.55:5:5:0.0,zoompan=z='${zoomExpr}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frames}:s=${WIDTH}x${HEIGHT}:fps=${FPS},format=yuv420p[v${index}]`;
}

function buildFilterComplex(imageCount, timings) {
  const parts = Array.from({ length: imageCount }, (_, index) => buildSlideFilter(index, timings.frames));

  let previous = "v0";
  for (let index = 1; index < imageCount; index += 1) {
    const offset = index * (timings.slideDuration - FADE_DURATION);
    const output = index === imageCount - 1 ? "outv" : `xf${index}`;
    parts.push(
      `[${previous}][v${index}]xfade=transition=${TRANSITION}:duration=${FADE_DURATION}:offset=${offset}[${output}]`,
    );
    previous = output;
  }

  return parts.join(";");
}

function generateVideo(images, targetDuration) {
  const timings = getTimings(images.length, targetDuration);
  const filter = buildFilterComplex(images.length, timings);

  fs.mkdirSync(path.dirname(OUTPUT_VIDEO), { recursive: true });

  const inputArgs = images.flatMap((imagePath) => [
    "-loop",
    "1",
    "-t",
    String(timings.slideDuration),
    "-i",
    imagePath,
  ]);

  const ffmpegArgs = [
    "-y",
    ...inputArgs,
    "-filter_complex",
    filter,
    "-map",
    "[outv]",
    "-an",
    "-c:v",
    "libx264",
    "-preset",
    "slow",
    "-crf",
    String(CRF),
    "-movflags",
    "+faststart",
    "-pix_fmt",
    "yuv420p",
    "-t",
    String(timings.totalDuration),
    OUTPUT_VIDEO,
  ];

  console.log(
    `Generating ${path.relative(ROOT, OUTPUT_VIDEO)} (${timings.totalDuration.toFixed(1)}s, ${images.length} slides, zoom + ${TRANSITION})...`,
  );
  const result = spawnSync("ffmpeg", ffmpegArgs, { stdio: "inherit" });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function main() {
  const { source, duration } = parseArgs(process.argv);

  if (!fs.existsSync(source)) {
    console.error(`Source folder not found: ${source}`);
    process.exit(1);
  }

  const images = listImages(source);
  if (images.length < 2) {
    console.error("Need at least 2 images to build a slideshow.");
    process.exit(1);
  }

  console.log(`Using ${images.length} images from ${source}`);
  syncAssetCopies(images);
  generateVideo(images, duration);
  console.log("Done.");
}

main();
