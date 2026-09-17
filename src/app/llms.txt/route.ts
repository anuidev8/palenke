import { llms } from "fumadocs-core/source";
import { source } from "@/lib/source";

export const revalidate = false;

export function GET() {
  return new Response(llms(source).index(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
