#!/usr/bin/env node
/**
 * Splits «Somos la voz del territorio» into hero audio tracks (~35s).
 * Home: muxes audio into home-hero-presentacion.mp4 (video + audio merged).
 * Memoria / Gobierno: keeps separate MP3 files for independent playback.
 *
 * Usage:
 *   node scripts/split-hero-presentation-audio.mjs
 *   node scripts/split-hero-presentation-audio.mjs --source "/path/to/audio.mpeg"
 */

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const DEFAULT_SOURCE = path.join(
  ROOT,
  "public/assets/Somos la voz del territorio .mp3.mpeg",
);
const DESKTOP_SOURCE =
  "/Users/usuario/Desktop/Somos la voz del territorio .mp3 (1).mpeg";

const HOME_AUDIO = path.join(ROOT, "public/audio/somos-la-voz-home.mp3");
const MEMORIA_AUDIO = path.join(
  ROOT,
  "public/audio/somos-la-voz-memoria-afroterritorial.mp3",
);
const GOBIERNO_AUDIO = path.join(
  ROOT,
  "public/audio/somos-la-voz-gobierno-propio.mp3",
);
const HOME_VIDEO_SILENT = path.join(
  ROOT,
  "public/videos/home-hero-presentacion-silent.mp4",
);
const HOME_VIDEO_OUT = path.join(ROOT, "public/videos/home-hero-presentacion.mp4");

/** Natural song section break before GANCHO (Memoria = intro/verso, Gobierno = gancho/outro). */
const DEFAULT_SPLIT_AT = 101.053;
const CLIP_SECONDS = 35;

function parseArgs(argv) {
  const options = { source: null, splitAt: DEFAULT_SPLIT_AT, clipSeconds: CLIP_SECONDS };
  for (let i = 2; i < argv.length; i += 1) {
    if (argv[i] === "--source" && argv[i + 1]) {
      options.source = argv[i + 1];
      i += 1;
    } else if (argv[i] === "--split-at" && argv[i + 1]) {
      options.splitAt = Number(argv[i + 1]);
      i += 1;
    } else if (argv[i] === "--clip-seconds" && argv[i + 1]) {
      options.clipSeconds = Number(argv[i + 1]);
      i += 1;
    }
  }
  return options;
}

function resolveSource(explicit) {
  if (explicit && fs.existsSync(explicit)) return explicit;
  if (fs.existsSync(DESKTOP_SOURCE)) return DESKTOP_SOURCE;
  if (fs.existsSync(DEFAULT_SOURCE)) return DEFAULT_SOURCE;
  throw new Error(
    "Source audio not found. Pass --source or place the file on Desktop.",
  );
}

function run(command, args) {
  const result = spawnSync(command, args, { stdio: "inherit" });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function main() {
  const { source: sourceArg, splitAt, clipSeconds } = parseArgs(process.argv);
  const source = resolveSource(sourceArg);

  fs.mkdirSync(path.dirname(HOME_AUDIO), { recursive: true });

  console.log(`Source: ${source}`);
  console.log(`Split at ${splitAt.toFixed(2)}s, clip length ${clipSeconds}s`);

  run("ffmpeg", [
    "-y",
    "-i",
    source,
    "-t",
    String(clipSeconds),
    "-c:a",
    "libmp3lame",
    "-q:a",
    "2",
    HOME_AUDIO,
  ]);

  run("ffmpeg", [
    "-y",
    "-i",
    source,
    "-t",
    String(clipSeconds),
    "-c:a",
    "libmp3lame",
    "-q:a",
    "2",
    MEMORIA_AUDIO,
  ]);

  run("ffmpeg", [
    "-y",
    "-i",
    source,
    "-ss",
    String(splitAt),
    "-t",
    String(clipSeconds),
    "-c:a",
    "libmp3lame",
    "-q:a",
    "2",
    GOBIERNO_AUDIO,
  ]);

  if (!fs.existsSync(HOME_VIDEO_SILENT) && fs.existsSync(HOME_VIDEO_OUT)) {
    fs.copyFileSync(HOME_VIDEO_OUT, HOME_VIDEO_SILENT);
    console.log(`Saved silent home video: ${path.relative(ROOT, HOME_VIDEO_SILENT)}`);
  }

  if (fs.existsSync(HOME_VIDEO_SILENT)) {
    run("ffmpeg", [
      "-y",
      "-stream_loop",
      "-1",
      "-i",
      HOME_VIDEO_SILENT,
      "-i",
      HOME_AUDIO,
      "-map",
      "0:v:0",
      "-map",
      "1:a:0",
      "-c:v",
      "libx264",
      "-preset",
      "fast",
      "-crf",
      "18",
      "-pix_fmt",
      "yuv420p",
      "-c:a",
      "aac",
      "-b:a",
      "128k",
      "-t",
      String(clipSeconds),
      "-movflags",
      "+faststart",
      `${HOME_VIDEO_OUT}.tmp.mp4`,
    ]);
    fs.renameSync(`${HOME_VIDEO_OUT}.tmp.mp4`, HOME_VIDEO_OUT);
    console.log(`Home video (merged): ${path.relative(ROOT, HOME_VIDEO_OUT)}`);
  } else {
    console.warn("Skip home mux: home-hero-presentacion-silent.mp4 not found.");
  }

  console.log(`Home audio: ${path.relative(ROOT, HOME_AUDIO)}`);
  console.log(`Memoria audio: ${path.relative(ROOT, MEMORIA_AUDIO)}`);
  console.log(`Gobierno audio: ${path.relative(ROOT, GOBIERNO_AUDIO)}`);
  console.log("Done.");
}

main();
