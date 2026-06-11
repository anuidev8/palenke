"use client";

import dynamic from "next/dynamic";

const PdfDocumentViewer = dynamic(
  () => import("@/components/palenke/PdfDocumentViewer").then((mod) => mod.PdfDocumentViewer),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[70vh] items-center justify-center rounded-[28px] border border-[#e8dfd3] bg-[#fcfaf7] text-sm font-medium text-[#4a4540]">
        Preparando visor del documento...
      </div>
    ),
  },
);

export function PdfDocumentViewerShell({
  fileUrl,
  title,
}: {
  fileUrl: string;
  title: string;
}) {
  return <PdfDocumentViewer fileUrl={fileUrl} title={title} />;
}
