import { MarkdownDocx, Packer } from "markdown-docx";
import { appName } from "@/lib/docs-shared";
import { getOrderedPages } from "@/lib/source";

/** Strip Fumadocs heading anchors like `[#slug]` from processed markdown. */
function cleanMarkdown(markdown: string) {
  return markdown
    .replace(/\[#[\wÀ-ÿ-]+\]/gi, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function buildFullDocsMarkdown() {
  const pages = getOrderedPages();
  const sections = await Promise.all(
    pages.map(async (page, index) => {
      const processed = cleanMarkdown(await page.data.getText("processed"));
      const body = processed.startsWith("# ")
        ? processed
        : `# ${page.data.title}\n\n${processed}`;

      return index === 0 ? body : `---\n\n${body}`;
    }),
  );

  return `# ${appName}\n\nDocumentación técnica completa exportada desde /docs.\n\n${sections.join("\n\n")}`;
}

export async function buildDocsDocxBuffer() {
  const markdown = await buildFullDocsMarkdown();
  const converter = new MarkdownDocx(markdown);
  const document = await converter.toDocument({
    title: appName,
    creator: "Palenke",
    description: "Documentación técnica completa de Palenke",
  });

  return Packer.toBuffer(document);
}
