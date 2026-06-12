"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ScitaFieldReportForm } from "@/components/palenke/ScitaFieldReportForm";
import { normalizeViewerRole } from "@/lib/auth/permissions";
import { appendScitaEvidenceFields, uploadScitaEvidenceDirect } from "@/lib/scita-evidence-client";
import { parseScitaFieldReportFormData } from "@/lib/scita-report-form";
import { appendClientScitaReport } from "@/lib/scita-reports-client-storage";
import { withRole } from "@/lib/viewer";

type ScitaFieldReportFormClientProps = {
  persistMode: "live" | "mock";
  submitAction?: (formData: FormData) => Promise<void>;
  cancelHref: string;
  selectedCategory?: string;
  selectedMedia?: string;
  tableroOrigen?: string;
  role: string;
};

export function ScitaFieldReportFormClient({
  persistMode,
  submitAction,
  cancelHref,
  selectedCategory = "",
  selectedMedia = "",
  tableroOrigen = "",
  role,
}: ScitaFieldReportFormClientProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!(event.currentTarget instanceof HTMLFormElement)) {
      setError("Formulario inválido");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const parsed = parseScitaFieldReportFormData(formData);
    if (!parsed.ok) {
      setError(parsed.error);
      return;
    }

    const viewerRole = normalizeViewerRole(parsed.data.role || role);

    if (persistMode === "live" && submitAction) {
      startTransition(async () => {
        try {
          let submitFormData = formData;

          if (
            parsed.data.evidenceFile &&
            (parsed.data.formato === "imagen" || parsed.data.formato === "voz")
          ) {
            const uploaded = await uploadScitaEvidenceDirect(
              parsed.data.evidenceFile,
              parsed.data.formato,
            );
            submitFormData = appendScitaEvidenceFields(
              new FormData(event.currentTarget),
              uploaded.reportId,
              uploaded.evidence,
            );
          }

          await submitAction(submitFormData);
        } catch (err) {
          console.error("SCITA report server action failed:", err);
          setError(
            err instanceof Error
              ? err.message
              : "No se pudo enviar el reporte al servidor. Tu alerta quedó guardada en este navegador.",
          );
        }
      });
      return;
    }

    appendClientScitaReport({
      categoria: parsed.data.categoria,
      formato: parsed.data.formato,
      descripcion: parsed.data.descripcion,
      nombre: parsed.data.nombre,
      contacto: parsed.data.contacto,
      tablero_origen: parsed.data.tablero_origen,
    });

    startTransition(() => {
      router.push(withRole("/scita/formulario", viewerRole, { submitted: "1" }));
    });
  };

  return (
    <div className="w-full">
      {error ? (
        <p className="mb-4 rounded-[14px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      ) : null}
      <ScitaFieldReportForm
        onSubmit={handleSubmit}
        cancelHref={cancelHref}
        selectedCategory={selectedCategory}
        selectedMedia={selectedMedia}
        tableroOrigen={tableroOrigen}
        role={role}
      />
      {isPending ? (
        <p className="mt-3 text-center text-xs font-semibold text-white/80">Enviando reporte…</p>
      ) : null}
    </div>
  );
}
