"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2, ZoomIn, ZoomOut } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type PdfDocumentViewerProps = {
  fileUrl: string;
  title: string;
};

export function PdfDocumentViewer({ fileUrl, title }: PdfDocumentViewerProps) {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);
  const [containerWidth, setContainerWidth] = useState(960);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const updateWidth = () => {
      const nextWidth = Math.min(window.innerWidth - 48, 1100);
      setContainerWidth(nextWidth);
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const onDocumentLoadSuccess = useCallback(({ numPages: nextNumPages }: { numPages: number }) => {
    setNumPages(nextNumPages);
    setPageNumber(1);
    setLoadError(null);
  }, []);

  const onDocumentLoadError = useCallback((error: Error) => {
    console.error("PDF preview load error:", error);
    setLoadError("No se pudo cargar la vista previa del documento.");
  }, []);

  const pageWidth = useMemo(() => Math.max(320, containerWidth * scale), [containerWidth, scale]);

  return (
    <div className="overflow-hidden rounded-[28px] border border-[#e8dfd3] bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e8dfd3] bg-[#fcfaf7] px-4 py-3 sm:px-6">
        <p className="text-sm font-semibold text-[#1a1a1a]">{title}</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setScale((current) => Math.max(0.75, current - 0.15))}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#e8dfd3] bg-white text-[#4a4540] transition hover:bg-[#f4f1ec]"
            aria-label="Alejar"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setScale((current) => Math.min(1.8, current + 0.15))}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#e8dfd3] bg-white text-[#4a4540] transition hover:bg-[#f4f1ec]"
            aria-label="Acercar"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            type="button"
            disabled={pageNumber <= 1}
            onClick={() => setPageNumber((current) => Math.max(1, current - 1))}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#e8dfd3] bg-white text-[#4a4540] transition hover:bg-[#f4f1ec] disabled:opacity-40"
            aria-label="Página anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="min-w-24 text-center text-sm font-medium text-[#4a4540]">
            {numPages > 0 ? `${pageNumber} / ${numPages}` : "—"}
          </span>
          <button
            type="button"
            disabled={pageNumber >= numPages}
            onClick={() => setPageNumber((current) => Math.min(numPages, current + 1))}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#e8dfd3] bg-white text-[#4a4540] transition hover:bg-[#f4f1ec] disabled:opacity-40"
            aria-label="Página siguiente"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex min-h-[70vh] items-start justify-center overflow-auto bg-[#f4f1ec] px-4 py-8">
        {loadError ? (
          <p className="rounded-2xl border border-[#f2d5cf] bg-[#fff4f1] px-5 py-4 text-sm font-medium text-[#8a3b2f]">
            {loadError}
          </p>
        ) : (
          <Document
            file={fileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-4 text-sm font-medium text-[#4a4540] shadow-sm">
                <Loader2 className="h-4 w-4 animate-spin" />
                Cargando documento...
              </div>
            }
          >
            <Page
              pageNumber={pageNumber}
              width={pageWidth}
              renderAnnotationLayer
              renderTextLayer
              className="shadow-lg"
            />
          </Document>
        )}
      </div>
    </div>
  );
}
