import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { ScitaFieldReportFormClient } from "@/components/palenke/ScitaFieldReportFormClient";
import { SiteLayout } from "@/components/mock/ui";
import { hasSupabaseServiceConfig } from "@/lib/config";
import { getViewerRoleFromRequest } from "@/lib/viewer-server";
import { type SearchParams, withRole } from "@/lib/viewer";
import { submitScitaFieldReportAction } from "./actions";

export default async function FormularioAmbientalPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const role = await getViewerRoleFromRequest(params);
  const submitted = params.submitted === "1";

  // Pre-selected values from query (for mockup state)
  const selectedCategory = Array.isArray(params.categoria) ? params.categoria[0] : (params.categoria ?? "");
  const selectedMedia = Array.isArray(params.media) ? params.media[0] : (params.media ?? "");
  const selectedTablero = Array.isArray(params.tablero) ? params.tablero[0] : (params.tablero ?? "");
  const persistMode = hasSupabaseServiceConfig() ? "live" : "mock";

  return (
    <SiteLayout
      role={role}
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "SCITA", href: "/scita" },
        { label: "Enviar información ambiental" },
      ]}
    >
      {/* Map-tinted backdrop */}
      <div
        className="relative min-h-screen bg-[#0d1f0d]"
      >
        {/* subtle grid */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.05]" aria-hidden="true">
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={`v${i}`} className="absolute top-0 h-full w-px bg-white" style={{ left: `${i * 8.5}%` }} />
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={`h${i}`} className="absolute left-0 h-px w-full bg-white" style={{ top: `${i * 13}%` }} />
          ))}
        </div>

        <div className="relative z-10 mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-start px-4 py-12 sm:px-6">
          {submitted ? (
            /* ── Success state ── */
            <div className="w-full overflow-hidden rounded-[32px] bg-white shadow-[0_24px_64px_rgba(0,0,0,0.35)]">
              <div className="px-8 py-14 text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#d8f3dc]">
                  <CheckCircle2 className="h-10 w-10 text-[#2e7d32]" aria-hidden="true" />
                </div>
                <h2 className="font-display text-3xl text-[#1a1a1a]">
                  Gracias por tu aporte desde el territorio
                </h2>
                <p className="mt-4 text-base leading-7 text-[#4a4540]">
                  Tu información fue recibida y será revisada por el equipo del Palenke / PCN.
                  Si dejaste un contacto, nos comunicaremos contigo.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Link
                    href={withRole("/scita", role)}
                    className="inline-flex items-center gap-2 rounded-full bg-[#2e7d32] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1b5e20]"
                  >
                    Volver al mapa
                  </Link>
                  <Link
                    href={withRole("/scita/formulario", role)}
                    className="inline-flex items-center gap-2 rounded-full border-2 border-[#2e7d32] px-6 py-3 text-sm font-semibold text-[#2e7d32] transition hover:bg-[#d8f3dc]"
                  >
                    Enviar otro reporte
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <ScitaFieldReportFormClient
              persistMode={persistMode}
              submitAction={persistMode === "live" ? submitScitaFieldReportAction : undefined}
              cancelHref={withRole("/scita", role)}
              selectedCategory={selectedCategory}
              selectedMedia={selectedMedia}
              tableroOrigen={selectedTablero}
              role={role}
            />
          )}
        </div>
      </div>
    </SiteLayout>
  );
}
