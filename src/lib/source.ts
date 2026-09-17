import { docs } from "collections/server";
import { flattenTree } from "fumadocs-core/page-tree";
import { loader } from "fumadocs-core/source";
import { lucideIconsPlugin } from "fumadocs-core/source/lucide-icons";
import { docsImageRoute, docsRoute } from "@/lib/docs-shared";

export const source = loader({
  baseUrl: docsRoute,
  source: docs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

export function getPageImage(page: (typeof source)["$inferPage"]) {
  const segments = [...page.slugs, "image.png"];
  return {
    segments,
    url: `${docsImageRoute}/${segments.join("/")}`,
  };
}

export function getPageMarkdownUrl(page: (typeof source)["$inferPage"]) {
  return {
    segments: page.slugs,
    url: `${page.url}.md`,
  };
}

/** Pages in sidebar / meta.json order for full-doc exports. */
export function getOrderedPages() {
  const byUrl = new Map(source.getPages().map((page) => [page.url, page]));
  const ordered = flattenTree(source.getPageTree().children)
    .map((item) => byUrl.get(item.url))
    .filter((page): page is (typeof source)["$inferPage"] => Boolean(page));

  if (ordered.length === byUrl.size) return ordered;

  const seen = new Set(ordered.map((page) => page.url));
  return [...ordered, ...source.getPages().filter((page) => !seen.has(page.url))];
}

export async function getLLMText(page: (typeof source)["$inferPage"]) {
  const processed = await page.data.getText("processed");

  return `# ${page.data.title} (${page.url})

${processed}`;
}
