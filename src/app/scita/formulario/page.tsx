import Link from "next/link";
import { AlertTriangle, CheckCircle2, X } from "lucide-react";
import { SiteLayout } from "@/components/mock/ui";
import { getViewerRole, isInternal, type SearchParams, withRole } from "@/lib/viewer";
import { redirect } from "next/navigation";

export default async function FormularioAmbientalPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const role = getViewerRole(params);

  // Redirect public visitors — form is for internal users only
  if (!isInternal(role)) {
    redirect(withRole("/scita", role));
  }

  const submitted = params.submitted === "1";

  return (
    <SiteLayout
      role={role}
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "SCITA", href: "/scita" },
        { label: "Enviar información ambiental" },
      ]}
    >
      {/* SCITA map-like backdrop */}
      <div
        className="relative min-h-screen"
        style={{
          background:
            "linear-gradient(160deg, #c8e6c9 0%, #a5d6a7 50%, #81c784 100%)",
        }}
      >
        <div className="absolute inset-0 opacity-20" aria-hidden="true">
          <span className="absolute left-4 top-3 rounded-md bg-black/60 px-3 py-1.5 text-xs font-medium text-white">
            SCITA — Mapa de fondo
          </span>
        </div>

        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-16 sm:px-6">
          {submitted ? (
            /* ── Success state ── */
            <div className="w-full max-w-lg overflow-hidden rounded-[32px] bg-white shadow-[0_24px_64px_rgba(0,0,0,0.18)]">
              <div className="px-8 py-12 text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#d8f3dc]">
                  <CheckCircle2 className="h-10 w-10 text-[#2e7d32]" aria-hidden="true" />
                </div>
                <h2 className="font-display text-3xl text-[#1a1a1a]">
                  Gracias por tu aporte desde el territorio
                </h2>
                <p className="mt-4 text-base leading-7 text-[#4a4540]">
                  Tu información será revisada por el equipo del Palenke/PCN.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Link
                    href={withRole("/scita", role)}
                    className="inline-flex items-center gap-2 rounded-full bg-[#2e7d32] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1b5e20]"
                  >
                    Volver al mapa
                  </Link>
                  <Link
                    href={withRole("/memoria-afroterritorial", role)}
                    className="inline-flex items-center gap-2 rounded-full border-2 border-[#2e7d32] px-6 py-3 text-sm font-semibold text-[#2e7d32] transition hover:bg-[#d8f3dc]"
                  >
                    Ver Memoria Afroterritorial
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            /* ── Form ── */
            <div className="w-full max-w-lg overflow-hidden rounded-[32px] bg-white shadow-[0_24px_64px_rgba(0,0,0,0.18)]">
              {/* Modal header */}
              <div className="flex items-start justify-between bg-[#2e7d32] px-8 py-6">
                <div>
                  <h1 className="font-display text-2xl text-white">
                    Envía información ambiental
                  </h1>
                  <p className="mt-1 text-sm text-white/80">
                    Tu aporte desde el territorio es valioso
                  </p>
                </div>
                <Link
                  href={withRole("/scita", role)}
                  className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30"
                  aria-label="Cerrar formulario"
                >
                  <X className="h-4 w-4" />
                </Link>
              </div>

              <form
                action={`${withRole("/scita/formulario", role)}?submitted=1`}
                method="GET"
                className="px-8 py-8"
              >
                {/* Tipo de observación */}
                <div className="mb-5">
                  <label
                    htmlFor="tipo"
                    className="mb-2 block text-sm font-semibold text-[#1a1a1a]"
                  >
                    Tipo de observación <span className="text-[#d32f2f]">*</span>
                  </label>
                  <select
                    id="tipo"
                    name="tipo"
                    required
                    className="w-full rounded-[14px] border border-[#e8dfd3] bg-white px-4 py-3 text-sm text-[#4a4540] focus:border-[#2e7d32] focus:outline-none focus:ring-2 focus:ring-[#2e7d32]/20"
                  >
                    <option value="">Selecciona una opción...</option>
                    <option>Agua / fuentes hídricas</option>
                    <option>Bosques / cobertura</option>
                    <option>Fauna y flora</option>
                    <option>Infraestructura</option>
                    <option>Otro</option>
                  </select>
                </div>

                {/* Descripción */}
                <div className="mb-5">
                  <label
                    htmlFor="descripcion"
                    className="mb-2 block text-sm font-semibold text-[#1a1a1a]"
                  >
                    Descripción <span className="text-[#d32f2f]">*</span>
                  </label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    rows={4}
                    required
                    placeholder="Cuéntanos qué está pasando (ej. 'La quebrada que aquí aparece con agua está seca desde hace meses')"
                    className="w-full resize-vertical rounded-[14px] border border-[#e8dfd3] px-4 py-3 text-sm text-[#1a1a1a] placeholder:text-[#bab4ac] focus:border-[#2e7d32] focus:outline-none focus:ring-2 focus:ring-[#2e7d32]/20"
                  />
                </div>

                {/* Referencia al lugar */}
                <div className="mb-5">
                  <label
                    htmlFor="lugar"
                    className="mb-2 block text-sm font-semibold text-[#1a1a1a]"
                  >
                    Referencia al lugar <span className="text-[#d32f2f]">*</span>
                  </label>
                  <input
                    id="lugar"
                    name="lugar"
                    type="text"
                    required
                    placeholder="Ej. Quebrada La Honda, vereda El Firme"
                    className="w-full rounded-[14px] border border-[#e8dfd3] px-4 py-3 text-sm text-[#1a1a1a] placeholder:text-[#bab4ac] focus:border-[#2e7d32] focus:outline-none focus:ring-2 focus:ring-[#2e7d32]/20"
                  />
                  <p className="mt-2 text-xs text-[#7a756e]">
                    En fases futuras se podrá marcar directamente en el mapa.
                  </p>
                </div>

                <div className="my-6 border-t border-dashed border-[#e8dfd3]" />
                <p className="mb-5 text-xs text-[#7a756e]">
                  Opcional — para que podamos contactarte
                </p>

                {/* Nombre */}
                <div className="mb-4">
                  <label
                    htmlFor="nombre"
                    className="mb-2 block text-sm font-semibold text-[#1a1a1a]"
                  >
                    Nombre{" "}
                    <span className="font-normal text-[#7a756e]">(opcional)</span>
                  </label>
                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    placeholder="Tu nombre"
                    className="w-full rounded-[14px] border border-[#e8dfd3] px-4 py-3 text-sm text-[#1a1a1a] placeholder:text-[#bab4ac] focus:border-[#2e7d32] focus:outline-none focus:ring-2 focus:ring-[#2e7d32]/20"
                  />
                </div>

                {/* Contacto */}
                <div className="mb-8">
                  <label
                    htmlFor="contacto"
                    className="mb-2 block text-sm font-semibold text-[#1a1a1a]"
                  >
                    Medio de contacto{" "}
                    <span className="font-normal text-[#7a756e]">(opcional)</span>
                  </label>
                  <input
                    id="contacto"
                    name="contacto"
                    type="text"
                    placeholder="Teléfono, WhatsApp o correo"
                    className="w-full rounded-[14px] border border-[#e8dfd3] px-4 py-3 text-sm text-[#1a1a1a] placeholder:text-[#bab4ac] focus:border-[#2e7d32] focus:outline-none focus:ring-2 focus:ring-[#2e7d32]/20"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 rounded-[14px] bg-[#2e7d32] py-3.5 text-sm font-bold text-white transition hover:bg-[#1b5e20]"
                  >
                    Enviar información
                  </button>
                  <Link
                    href={withRole("/scita", role)}
                    className="rounded-[14px] border border-[#e8dfd3] px-5 py-3.5 text-sm text-[#7a756e] transition hover:bg-[#f8f5f2]"
                  >
                    Cancelar
                  </Link>
                </div>
              </form>
            </div>
          )}

          {/* Privacy notice */}
          <div className="mt-6 flex max-w-lg items-start gap-3 rounded-[20px] bg-[#fff3cd] px-5 py-4">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#f57f17]" aria-hidden="true" />
            <p className="text-xs leading-5 text-[#7a4f00]">
              Los datos enviados son gestionados por el equipo interno del Palenke/PCN y no se
              comparten con terceros.
            </p>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
