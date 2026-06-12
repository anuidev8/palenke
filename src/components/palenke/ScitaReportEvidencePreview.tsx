"use client";

import { useEffect, useState } from "react";
import type { ScitaReport } from "@/lib/mock-reports-store";

type EvidenceResponse = {
  url: string;
  mimeType?: string | null;
  fileName?: string | null;
};

export function ScitaReportEvidencePreview({ report }: { report: ScitaReport }) {
  const [evidence, setEvidence] = useState<EvidenceResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!report.evidence_path) {
      setEvidence(null);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`/api/scita/reports/${report.id}/evidence`)
      .then(async (response) => {
        const payload = (await response.json()) as EvidenceResponse & { error?: string };
        if (!response.ok) {
          throw new Error(payload.error || "No se pudo cargar la evidencia.");
        }
        if (!cancelled) {
          setEvidence(payload);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setEvidence(null);
          setError(err instanceof Error ? err.message : "No se pudo cargar la evidencia.");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [report.id, report.evidence_path]);

  if (!report.evidence_path) {
    return null;
  }

  const mimeType = evidence?.mimeType || report.evidence_mime_type || "";
  const fileName = evidence?.fileName || report.evidence_original_name || "evidencia";

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-bold uppercase tracking-wider text-[#7a756e]">Evidencia adjunta</h4>
      <div className="rounded-2xl border border-[#e8dfd3] bg-[#fdfcfb] p-4">
        {loading ? <p className="text-xs text-[#7a756e]">Cargando evidencia…</p> : null}
        {error ? <p className="text-xs text-red-700">{error}</p> : null}
        {!loading && !error && evidence?.url ? (
          <>
            {mimeType.startsWith("image/") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={evidence.url}
                alt={fileName}
                className="max-h-72 w-full rounded-xl object-contain"
              />
            ) : null}
            {mimeType.startsWith("audio/") ? (
              <audio controls src={evidence.url} className="w-full" preload="metadata">
                Tu navegador no reproduce audio HTML5.
              </audio>
            ) : null}
            <p className="mt-2 text-xs text-[#7a756e]">{fileName}</p>
            <a
              href={evidence.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex text-xs font-semibold text-[#2e7d32] hover:underline"
            >
              Abrir evidencia
            </a>
          </>
        ) : null}
      </div>
    </div>
  );
}
