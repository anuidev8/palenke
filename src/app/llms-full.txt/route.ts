import { docsFullTextFilename } from "@/lib/docs-shared";
import { getLLMText, getOrderedPages } from "@/lib/source";

export const revalidate = false;

export async function GET() {
  const scanned = await Promise.all(getOrderedPages().map(getLLMText));
  const body = scanned.join("\n\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="${docsFullTextFilename}"`,
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
