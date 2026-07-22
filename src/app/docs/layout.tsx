import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { docsBaseOptions } from "@/lib/docs-layout.shared";
import { source } from "@/lib/source";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DocsLayout tree={source.getPageTree()} {...docsBaseOptions()}>
      {children}
    </DocsLayout>
  );
}
