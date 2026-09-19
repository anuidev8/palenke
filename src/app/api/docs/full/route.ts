import { docsFullDownloadFilename } from "@/lib/docs-shared";
import { buildDocsDocxBuffer } from "@/lib/docs-docx";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const buffer = await buildDocsDocxBuffer();

    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${docsFullDownloadFilename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("[api/docs/full] Failed to build docs docx", error);
    return new Response("Failed to generate documentation download.", {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}
