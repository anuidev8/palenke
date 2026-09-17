import { Download } from "lucide-react";
import {
  docsFullDocxRoute,
  docsFullDownloadFilename,
} from "@/lib/docs-shared";

export function DocsDownloadAllButton() {
  return (
    <a
      href={docsFullDocxRoute}
      download={docsFullDownloadFilename}
      className="inline-flex items-center gap-2 rounded-md border border-fd-border bg-fd-secondary px-2.5 py-1.5 text-sm font-medium text-fd-secondary-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground [&_svg]:size-3.5 [&_svg]:text-fd-muted-foreground"
    >
      <Download aria-hidden />
      Descargar toda la documentación (.docx)
    </a>
  );
}
