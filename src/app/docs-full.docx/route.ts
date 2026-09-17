import { docsFullDownloadFilename } from "@/lib/docs-shared";
import { buildDocsDocxBuffer } from "@/lib/docs-docx";

export const revalidate = false;

export async function GET() {
  const buffer = await buildDocsDocxBuffer();

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="${docsFullDownloadFilename}"`,
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
