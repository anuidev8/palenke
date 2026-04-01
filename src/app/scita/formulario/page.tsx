import Link from "next/link";
import { AlertTriangle, CheckCircle2, Droplets, FileImage, Mic, MessageSquare, TreePine, Waves, Zap, HelpCircle, MapPin, X } from "lucide-react";
import { SiteLayout } from "@/components/mock/ui";
import { getViewerRoleFromRequest } from "@/lib/viewer-server";
import { type SearchParams, withRole } from "@/lib/viewer";

const categories = [
  {
    id: "hidrica",
    label: "Amenaza hídrica",
    sublabel: "Ríos, cuencas, contaminación",
    icon: Droplets,
    color: "#1565c0",
    bg: "#e3f2fd",
    border: "#1565c0",
  },
  {
    id: "deforestacion",
    label: "Deforestación",
    sublabel: "Tala, quema, pérdida de bosque",
    icon: TreePine,
    color: "#2e7d32",
    bg: "#d8f3dc",
    border: "#2e7d32",
  },
  {
    id: "mineria",
    label: "Minería ilegal",
    sublabel: "Retroexcavadoras, dragas, mercurio",
    icon: Zap,
    color: "#d32f2f",
    bg: "#fddede",
    border: "#d32f2f",
  },
  {
    id: "fauna",
    label: "Fauna y flora",
    sublabel: "Caza ilegal, especies en riesgo",
    icon: Waves,
    color: "#2e7d32",
    bg: "#c8e6c9",
    border: "#388e3c",
  },
  {
    id: "otro",
    label: "Otro",
    sublabel: "Amenaza no listada",
    icon: HelpCircle,
    color: "#7a756e",
    bg: "#f0eae0",
    border: "#bab4ac",
  },
];

const mediaTypes = [
  {
    id: "texto",
    label: "Texto",
    sublabel: "Escribe tu reporte",
    icon: MessageSquare,
  },
  {
    id: "imagen",
    label: "Imagen / Video",
    sublabel: "Adjunta una foto o video",
    icon: FileImage,
  },
  {
    id: "voz",
    label: "Nota de voz",
    sublabel: "Graba un mensaje de audio",
    icon: Mic,
  },
];

// Mock territory pins for the map
const mapPins = [
  { id: "naya", label: "Cuenca del Naya", x: "22%", y: "38%" },
  { id: "baudo", label: "Bajo Baudó", x: "48%", y: "28%" },
  { id: "guapi", label: "Guapi", x: "28%", y: "55%" },
  { id: "sanquianga", label: "Litoral Sanquianga", x: "18%", y: "65%" },
  { id: "tumaco", label: "Tumaco", x: "30%", y: "78%" },
];

export default async function FormularioAmbientalPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const role = await getViewerRoleFromRequest(params);
  const submitted = params.submitted === "1";

  // Pre-selected values from query (for mockup state)
  const selectedCategory = params.categoria ?? "";
  const selectedMedia = params.media ?? "";
  const selectedPin = params.pin ?? "";

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
            <form
              action={`${withRole("/scita/formulario", role)}?submitted=1`}
              method="GET"
              className="w-full"
            >
              {/* ── Header card ── */}
              <div className="mb-4 overflow-hidden rounded-[28px] bg-[#2e7d32]">
                <div className="flex items-start justify-between px-7 py-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                      SCITA · Monitoreo comunitario
                    </p>
                    <h1 className="mt-1 font-display text-2xl text-white sm:text-3xl">
                      Envía información ambiental
                    </h1>
                    <p className="mt-1 text-sm text-white/75">
                      Tu aporte desde el territorio es soberanía de información
                    </p>
                  </div>
                  <Link
                    href={withRole("/scita", role)}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30"
                    aria-label="Cerrar formulario"
                  >
                    <X className="h-4 w-4" />
                  </Link>
                </div>
                {/* Progress steps */}
                <div className="flex border-t border-white/15">
                  {["Categoría", "Formato", "Detalles"].map((step, i) => (
                    <div
                      key={step}
                      className="flex flex-1 flex-col items-center gap-1 py-3 text-center"
                    >
                      <span
                        className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold"
                        style={{
                          background: "rgba(255,255,255,0.2)",
                          color: "white",
                        }}
                      >
                        {i + 1}
                      </span>
                      <span className="hidden text-[10px] font-semibold uppercase tracking-[0.12em] text-white/70 sm:block">
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── STEP 1 — Categoría ── */}
              <div className="mb-4 overflow-hidden rounded-[28px] bg-white p-7 shadow-sm">
                <p className="eyebrow mb-1">Paso 1</p>
                <h2 className="font-display text-xl text-[#1a1a1a]">
                  ¿Qué tipo de amenaza observaste?
                </h2>
                <p className="mt-1 text-sm text-[#7a756e]">Selecciona la categoría que mejor describe lo que viste.</p>

                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <label
                        key={cat.id}
                        className="relative cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="categoria"
                          value={cat.id}
                          defaultChecked={isSelected}
                          className="peer sr-only"
                          required
                        />
                        <div
                          className="flex flex-col gap-2 rounded-[20px] border-2 p-4 transition peer-checked:shadow-md"
                          style={{
                            borderColor: isSelected ? cat.border : "#e8dfd3",
                            background: isSelected ? cat.bg : "white",
                          }}
                        >
                          <div
                            className="flex h-10 w-10 items-center justify-center rounded-xl"
                            style={{ background: cat.bg }}
                          >
                            <Icon className="h-5 w-5" style={{ color: cat.color }} aria-hidden="true" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[#1a1a1a]">{cat.label}</p>
                            <p className="mt-0.5 text-[11px] leading-4 text-[#7a756e]">{cat.sublabel}</p>
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* ── STEP 2 — Formato / Tipo de medio ── */}
              <div className="mb-4 overflow-hidden rounded-[28px] bg-white p-7 shadow-sm">
                <p className="eyebrow mb-1">Paso 2</p>
                <h2 className="font-display text-xl text-[#1a1a1a]">
                  ¿Cómo quieres enviar la información?
                </h2>
                <p className="mt-1 text-sm text-[#7a756e]">Elige el formato que más te resulte fácil desde el campo.</p>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  {mediaTypes.map((mt) => {
                    const Icon = mt.icon;
                    const isSelected = selectedMedia === mt.id;
                    return (
                      <label key={mt.id} className="flex-1 cursor-pointer">
                        <input
                          type="radio"
                          name="media"
                          value={mt.id}
                          defaultChecked={isSelected}
                          className="peer sr-only"
                          required
                        />
                        <div
                          className="flex items-center gap-3 rounded-[20px] border-2 p-4 transition peer-checked:border-[#2e7d32] peer-checked:bg-[#d8f3dc] peer-checked:shadow-sm"
                          style={{ borderColor: isSelected ? "#2e7d32" : "#e8dfd3" }}
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f0eae0]">
                            <Icon className="h-5 w-5 text-[#1a1a1a]" aria-hidden="true" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[#1a1a1a]">{mt.label}</p>
                            <p className="text-[11px] text-[#7a756e]">{mt.sublabel}</p>
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>

                {/* Conditional content area based on media type */}
                <div className="mt-5">
                  {/* Text input — always shown as default, hidden for image/voice mockup */}
                  <textarea
                    name="descripcion"
                    rows={4}
                    placeholder="Cuéntanos qué está pasando… (ej: 'La quebrada lleva semanas con agua oscura y con olor raro')"
                    className="w-full resize-vertical rounded-[14px] border border-[#e8dfd3] px-4 py-3 text-sm text-[#1a1a1a] placeholder:text-[#bab4ac] focus:border-[#2e7d32] focus:outline-none focus:ring-2 focus:ring-[#2e7d32]/20"
                  />
                  {/* Image upload mockup */}
                  <div className="mt-3 flex items-center gap-3 rounded-[14px] border-2 border-dashed border-[#e8dfd3] px-5 py-5 text-center">
                    <FileImage className="h-8 w-8 shrink-0 text-[#bab4ac]" aria-hidden="true" />
                    <div className="text-left">
                      <p className="text-sm font-semibold text-[#4a4540]">Adjuntar imagen o video</p>
                      <p className="mt-0.5 text-xs text-[#7a756e]">JPG, PNG, MP4 — máx. 20 MB</p>
                    </div>
                    <input type="file" name="archivo" accept="image/*,video/*" className="sr-only" id="archivo" />
                    <label
                      htmlFor="archivo"
                      className="ml-auto cursor-pointer rounded-full border border-[#e8dfd3] bg-white px-4 py-2 text-xs font-semibold text-[#4a4540] transition hover:bg-[#f0eae0]"
                    >
                      Seleccionar
                    </label>
                  </div>
                  {/* Voice note mockup */}
                  <div className="mt-3 flex items-center gap-3 rounded-[14px] border border-[#e8dfd3] bg-[#f8f5f2] px-5 py-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#d32f2f]">
                      <Mic className="h-5 w-5 text-white" aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[#1a1a1a]">Nota de voz</p>
                      <p className="text-xs text-[#7a756e]">Presiona para grabar desde tu dispositivo</p>
                    </div>
                    <button
                      type="button"
                      className="rounded-full bg-[#d32f2f] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#b71c1c]"
                    >
                      Grabar
                    </button>
                  </div>
                </div>
              </div>

              {/* ── STEP 3 — Detalles de contacto ── */}
              <div className="mb-4 overflow-hidden rounded-[28px] bg-white p-7 shadow-sm">
                <p className="eyebrow mb-1">Paso 3 · Opcional</p>
                <h2 className="font-display text-xl text-[#1a1a1a]">
                  ¿Cómo podemos contactarte?
                </h2>
                <p className="mt-1 text-sm text-[#7a756e]">Si quieres que el equipo del Palenke te dé seguimiento al reporte.</p>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="nombre" className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
                      Nombre <span className="font-normal text-[#7a756e]">(opcional)</span>
                    </label>
                    <input
                      id="nombre"
                      name="nombre"
                      type="text"
                      placeholder="Tu nombre"
                      className="w-full rounded-[14px] border border-[#e8dfd3] px-4 py-3 text-sm text-[#1a1a1a] placeholder:text-[#bab4ac] focus:border-[#2e7d32] focus:outline-none focus:ring-2 focus:ring-[#2e7d32]/20"
                    />
                  </div>
                  <div>
                    <label htmlFor="contacto" className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
                      WhatsApp / teléfono <span className="font-normal text-[#7a756e]">(opcional)</span>
                    </label>
                    <input
                      id="contacto"
                      name="contacto"
                      type="tel"
                      placeholder="+57 300 000 0000"
                      className="w-full rounded-[14px] border border-[#e8dfd3] px-4 py-3 text-sm text-[#1a1a1a] placeholder:text-[#bab4ac] focus:border-[#2e7d32] focus:outline-none focus:ring-2 focus:ring-[#2e7d32]/20"
                    />
                  </div>
                </div>
              </div>

              {/* ── Submit ── */}
              <div className="overflow-hidden rounded-[28px] bg-[#2e7d32] p-7">
                <p className="text-sm leading-6 text-white/80">
                  Al enviar, tu información queda registrada en el sistema de monitoreo comunitario del SCITA.
                  Solo el equipo interno del Palenke / PCN tiene acceso.
                </p>
                <div className="mt-5 flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 rounded-[14px] bg-white py-3.5 text-sm font-bold text-[#2e7d32] transition hover:bg-[#f0eae0]"
                  >
                    Enviar reporte
                  </button>
                  <Link
                    href={withRole("/scita", role)}
                    className="rounded-[14px] border border-white/30 px-5 py-3.5 text-sm font-semibold text-white/80 transition hover:bg-white/10"
                  >
                    Cancelar
                  </Link>
                </div>
              </div>
            </form>
          )}

          {/* Privacy notice */}
          <div className="mt-5 flex max-w-2xl items-start gap-3 rounded-[20px] bg-[#fff3cd] px-5 py-4">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#f57f17]" aria-hidden="true" />
            <p className="text-xs leading-5 text-[#7a4f00]">
              Los datos enviados son gestionados exclusivamente por el equipo interno del Palenke / PCN
              y no se comparten con terceros. Tu participación puede ser anónima.
            </p>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
