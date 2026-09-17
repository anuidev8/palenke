import { notFound } from "next/navigation";
import { getLLMText, source } from "@/lib/source";

export const revalidate = false;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug?: string[] }> },
) {
  const { slug } = await params;
  // Supports both:
  // - /docs/accesos.md → /llms.mdx/docs/accesos (via rewrite)
  // - /llms.mdx/docs/accesos/content.md (legacy content.md segment)
  const normalizedSlug =
    slug?.at(-1) === "content.md" ? slug.slice(0, -1) : slug;
  const page = source.getPage(normalizedSlug);
  if (!page) notFound();

  return new Response(await getLLMText(page), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}

export function generateStaticParams() {
  return source.getPages().map((page) => ({
    slug: page.slugs,
  }));
}
