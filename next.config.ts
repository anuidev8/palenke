import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";
import { createMDX } from "fumadocs-mdx/next";

const projectRoot = dirname(fileURLToPath(import.meta.url));
const withMDX = createMDX();

const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : null;

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/docs": ["./content/docs/**/*", "./.source/**/*"],
    "/docs/[[...slug]]": ["./content/docs/**/*", "./.source/**/*"],
    "/llms-full.txt": ["./content/docs/**/*", "./.source/**/*"],
    "/llms.txt": ["./content/docs/**/*", "./.source/**/*"],
    "/llms.mdx/docs/[[...slug]]": ["./content/docs/**/*", "./.source/**/*"],
    "/api/docs/full": ["./content/docs/**/*", "./.source/**/*"],
  },
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
      // Exclude large workspace Word/video assets only — not App Router folders
      // (a blanket `./**/*.docx` previously stripped `src/app/docs-full.docx`).
      "./docs/**/*.docx",
      "./DOCUEMNTOS_HONONARIOS/**/*.docx",
      "./*.docx",
      "./public/**/*.mp4",
      "./media/**/*.mp4",
    ],
    "/admin/contenido-visual": ["./public/**/*"],
    "/api/**/*": ["./docs/**/*", "./public/**/*"],
  },
  serverExternalPackages: ["@google/genai"],
  images: {
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
  async rewrites() {
    return [
      {
        source: "/docs.md",
        destination: "/llms.mdx/docs",
      },
      {
        source: "/docs/:path*.md",
        destination: "/llms.mdx/docs/:path*",
      },
      // Old download URL used a .docx path that NFT tracing excluded in production.
      {
        source: "/docs-full.docx",
        destination: "/api/docs/full",
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
    };
    return config;
  },
};

export default withMDX(nextConfig);
