import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const projectRoot = dirname(fileURLToPath(import.meta.url));

const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : null;

const nextConfig: NextConfig = {
  // Prevent large source PDFs / media from being traced into serverless functions.
  // docs/files (~280MB) and public/videos are served from Supabase/CDN, not lambdas.
  outputFileTracingExcludes: {
    "/*": [
      "./docs/**/*",
      "./scripts/**/*",
      "./wireframes/**/*",
      "./images/**/*",
      "./DOCUEMNTOS_HONONARIOS/**/*",
      "./public/videos/**/*",
      "./public/generated/**/*",
      "./**/*.docx",
      "./**/*.mp4",
    ],
    "/admin/contenido-visual": ["./public/**/*"],
    "/api/**/*": ["./docs/**/*", "./public/**/*"],
  },
  serverExternalPackages: ["@google/genai"],
  images: {
    // Next.js 16: quality prop must be in this list (default is only [75])
    qualities: [75, 85, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "renacientes.net",
      },
      {
        protocol: "https",
        hostname: "www.renacientes.net",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      ...(supabaseHost
        ? [{ protocol: "https" as const, hostname: supabaseHost }]
        : [{ protocol: "https" as const, hostname: "*.supabase.co" }]),
    ],
  },
  turbopack: {
    root: projectRoot,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
    };
    return config;
  },
};

export default nextConfig;
