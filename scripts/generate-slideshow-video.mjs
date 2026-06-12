/**
 * Builds an MP4 slideshow from a folder of still images with Ken Burns zoom
 * and smooth slide transitions (FFmpeg xfade + zoompan).
 *
 * Usage:
 *   node scripts/generate-slideshow-video.mjs \
 *     --source "/path/to/images" \
 *     --output public/videos/my-video.mp4 \
 *     --duration 12
 *
 * Optional:
 *   --assets-dir public/assets/my-slider
 *   --assets-prefix slide
 */

import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const WIDTH = 1920;
const HEIGHT = 1080;
const FPS = 30;
const FADE_DURATION = 0.4;
const TRANSITION = "smoothleft";
const ZOOM_AMOUNT = 0.1;
const CRF = 18;

function parseArgs(argv) {
  const args = {
    source: null,
    output: null,
    duration: 12,
    assetsDir: null,
    assetsPrefix: "slide",
  };

  for (let i = 2; i < argv.length; i += 1) {
    if (argv[i] === "--source" && argv[i + 1]) {
      args.source = argv[i + 1];
      i += 1;
    } else if (argv[i] === "--output" && argv[i + 1]) {
      args.output = argv[i + 1];
      i += 1;
    } else if (argv[i] === "--duration" && argv[i + 1]) {
      args.duration = Number(argv[i + 1]);
      i += 1;
    } else if (argv[i] === "--assets-dir" && argv[i + 1]) {
      args.assetsDir = argv[i + 1];
      i += 1;
    } else if (argv[i] === "--assets-prefix" && argv[i + 1]) {
      args.assetsPrefix = argv[i + 1];
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

function syncAssetCopies(images, assetsDir, assetsPrefix) {
  fs.mkdirSync(assetsDir, { recursive: true });

  for (const name of fs.readdirSync(assetsDir)) {
    if (name.startsWith(`${assetsPrefix}-`)) {
      fs.unlinkSync(path.join(assetsDir, name));
    }
  }

  images.forEach((imagePath, index) => {
    const ext = path.extname(imagePath).toLowerCase() || ".jpg";
    const target = path.join(assetsDir, `${assetsPrefix}-${String(index + 1).padStart(2, "0")}${ext}`);
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

function generateVideo(images, targetDuration, outputVideo) {
  const timings = getTimings(images.length, targetDuration);
  const filter = buildFilterComplex(images.length, timings);

  fs.mkdirSync(path.dirname(outputVideo), { recursive: true });

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
    outputVideo,
  ];

  console.log(
    `Generating ${path.relative(ROOT, outputVideo)} (${timings.totalDuration.toFixed(1)}s, ${images.length} slides, zoom + ${TRANSITION})...`,
  );
  const result = spawnSync("ffmpeg", ffmpegArgs, { stdio: "inherit" });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function main() {
  const args = parseArgs(process.argv);

  if (!args.source || !args.output) {
    console.error(
      "Usage: node scripts/generate-slideshow-video.mjs --source <dir> --output <mp4> [--duration 12]",
    );
    process.exit(1);
  }

  const source = path.resolve(args.source);
  const outputVideo = path.isAbsolute(args.output)
    ? args.output
    : path.join(ROOT, args.output);

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

  if (args.assetsDir) {
    const assetsDir = path.isAbsolute(args.assetsDir)
      ? args.assetsDir
      : path.join(ROOT, args.assetsDir);
    syncAssetCopies(images, assetsDir, args.assetsPrefix);
    console.log(`Synced assets to ${path.relative(ROOT, assetsDir)}`);
  }

  generateVideo(images, args.duration, outputVideo);
  console.log("Done.");
}

main();
