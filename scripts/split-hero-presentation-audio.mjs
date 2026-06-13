#!/usr/bin/env node
/**
 * Splits «Somos la voz del territorio» (~3:05) into hero audio tracks per module.
 * Home: 00:00–01:00 · Memoria: 01:00–02:00 · Gobierno: 02:00–03:05
 *
 * Video files are not modified — each module plays its MP3 via useHeroAmbientAudio.
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
const DOWNLOADS_SOURCE =
  "/Users/usuario/Downloads/Somos la voz del territorio .mp3 (1).mpeg";
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

/** Segment boundaries on the full track (total ~3:05). */
const SEGMENTS = {
  home: { start: 0, duration: 60 },
  memoria: { start: 60, duration: 60 },
  gobierno: { start: 120, duration: 65 },
};

function parseArgs(argv) {
  const options = { source: null };
  for (let i = 2; i < argv.length; i += 1) {
    if (argv[i] === "--source" && argv[i + 1]) {
      options.source = argv[i + 1];
      i += 1;
    }
  }
  return options;
}

function resolveSource(explicit) {
  if (explicit && fs.existsSync(explicit)) return explicit;
  if (fs.existsSync(DOWNLOADS_SOURCE)) return DOWNLOADS_SOURCE;
  if (fs.existsSync(DESKTOP_SOURCE)) return DESKTOP_SOURCE;
  if (fs.existsSync(DEFAULT_SOURCE)) return DEFAULT_SOURCE;
  throw new Error(
    "Source audio not found. Pass --source or place the file in Downloads/Desktop.",
  );
}

function run(command, args) {
  const result = spawnSync(command, args, { stdio: "inherit" });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function extractSegment(source, output, { start, duration }) {
  run("ffmpeg", [
    "-y",
    "-i",
    source,
    "-ss",
    String(start),
    "-t",
    String(duration),
    "-c:a",
    "libmp3lame",
    "-q:a",
    "2",
    output,
  ]);
}

function main() {
  const { source: sourceArg } = parseArgs(process.argv);
  const source = resolveSource(sourceArg);

  fs.mkdirSync(path.dirname(HOME_AUDIO), { recursive: true });

  console.log(`Source: ${source}`);
  console.log(
    `Segments: home ${SEGMENTS.home.start}s–${SEGMENTS.home.start + SEGMENTS.home.duration}s, ` +
      `memoria ${SEGMENTS.memoria.start}s–${SEGMENTS.memoria.start + SEGMENTS.memoria.duration}s, ` +
      `gobierno ${SEGMENTS.gobierno.start}s–${SEGMENTS.gobierno.start + SEGMENTS.gobierno.duration}s`,
  );

  extractSegment(source, HOME_AUDIO, SEGMENTS.home);
  extractSegment(source, MEMORIA_AUDIO, SEGMENTS.memoria);
  extractSegment(source, GOBIERNO_AUDIO, SEGMENTS.gobierno);

  console.log(`Home audio: ${path.relative(ROOT, HOME_AUDIO)}`);
  console.log(`Memoria audio: ${path.relative(ROOT, MEMORIA_AUDIO)}`);
  console.log(`Gobierno audio: ${path.relative(ROOT, GOBIERNO_AUDIO)}`);
  console.log("Done. (Video files unchanged.)");
}

main();
