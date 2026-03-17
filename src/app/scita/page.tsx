import Link from "next/link";
import { ArrowRight, ExternalLink, Layers } from "lucide-react";
import { SiteLayout } from "@/components/mock/ui";
import { getViewerRole, isInternal, type SearchParams, withRole } from "@/lib/viewer";

const capas = [
  {
    id: "acc",
    label: "Áreas de conservación comunitaria",
    abbr: "ACC",
    color: "#2e7d32",
    lightBg: "#d8f3dc",
    active: true,
  },
  {
    id: "hidrica",
    label: "Info hídrica",
    abbr: "Hídrica",
    color: "#1565c0",
    lightBg: "#e3f2fd",
    active: true,
  },
  {
    id: "fauna",
    label: "Fauna y flora",
    abbr: "Fauna",
    color: "#2e7d32",
    lightBg: "#d8f3dc",
    active: false,
  },
  {
    id: "cobertura",
    label: "Cobertura boscosa",
    abbr: "Bosque",
    color: "#1b5e20",
    lightBg: "#c8e6c9",
    active: false,
  },
  {
    id: "infraestructura",
    label: "Infraestructura comunitaria",
    abbr: "Infra",
    color: "#f57f17",
    lightBg: "#fff3cd",
    active: false,
  },
  {
    id: "alertas",
    label: "Alertas ambientales",
    abbr: "Alertas",
    color: "#d32f2f",
    lightBg: "#fddede",
    active: false,
  },
];

export default async function ScitaPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const role = getViewerRole(params);

  return (
    <SiteLayout
      role={role}
      breadcrumbs={[{ label: "Inicio", href: "/" }, { label: "SCITA" }]}
    >
      {/* ── Page header ── */}
      <section className="border-b border-[#e8dfd3] bg-[#1a1a1a] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[1.5px] text-[#fbc02d]">
            Sistema de Control e Información Territorial Ambiental
          </p>
          <h1 className="font-display text-4xl text-white sm:text-5xl">SCITA</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-white/70">
            Plataforma de datos geoespaciales y territoriales del Proceso de Comunidades Negras.
            Visualiza capas, consulta tableros y envía información ambiental desde el campo.
          </p>
        </div>
      </section>

      {/* ── Map / geovisor placeholder ── */}
      <section className="relative overflow-hidden bg-[#1a2a1a]" style={{ minHeight: 440 }}>
        {/* fake map texture */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 30% 50%, rgba(46,125,50,0.45), transparent 55%), radial-gradient(ellipse at 75% 30%, rgba(27,94,32,0.35), transparent 50%), linear-gradient(160deg, #0d1f0d 0%, #152a15 60%, #1a2a1a 100%)",
          }}
        />

        {/* grid lines (map feel) */}
        <div className="absolute inset-0 opacity-[0.07]" aria-hidden="true">
          {Array.from({ length: 10 }).map((_, i) => (
            <span
              key={`v-${i}`}
              className="absolute top-0 h-full w-px bg-white"
              style={{ left: `${i * 10 + 5}%` }}
            />
          ))}
          {Array.from({ length: 7 }).map((_, i) => (
            <span
              key={`h-${i}`}
              className="absolute left-0 h-px w-full bg-white"
              style={{ top: `${i * 14 + 7}%` }}
            />
          ))}
        </div>

        {/* polygon shapes simulating ACC */}
        <svg
          className="absolute inset-0 h-full w-full opacity-30"
          viewBox="0 0 800 440"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <polygon points="120,80 260,60 310,140 230,200 150,180" fill="#2e7d32" opacity="0.6" />
          <polygon points="350,100 480,80 520,160 440,200 370,170" fill="#1565c0" opacity="0.5" />
          <polygon points="550,200 680,170 700,280 620,310 540,280" fill="#2e7d32" opacity="0.5" />
          <polygon points="180,280 300,260 340,340 250,370 170,340" fill="#1b5e20" opacity="0.45" />
          {/* pins */}
          <circle cx="190" cy="130" r="7" fill="white" opacity="0.9" />
          <circle cx="420" cy="140" r="7" fill="white" opacity="0.9" />
          <circle cx="610" cy="245" r="7" fill="white" opacity="0.9" />
          <circle cx="260" cy="310" r="7" fill="white" opacity="0.9" />
        </svg>

        {/* legend */}
        <div className="absolute bottom-5 left-5 rounded-[16px] bg-black/60 p-4 backdrop-blur-sm">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
            Leyenda
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-white/80">
              <span className="h-2.5 w-5 rounded-sm bg-[#2e7d32]" />
              Área de conservación
            </div>
            <div className="flex items-center gap-2 text-xs text-white/80">
              <span className="h-2.5 w-5 rounded-sm bg-[#1565c0]" />
              Info hídrica
            </div>
            <div className="flex items-center gap-2 text-xs text-white/80">
              <span className="h-2 w-2 rounded-full bg-white" />
              Punto de monitoreo
            </div>
          </div>
        </div>

        {/* map label */}
        <div className="absolute right-5 top-5 rounded-full bg-black/50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white/70 backdrop-blur-sm">
          Mapa territorial — Pacífico colombiano
        </div>

        {/* open full screen link */}
        {isInternal(role) ? (
          <div className="absolute bottom-5 right-5">
            <Link
              href={withRole("/geoportal", role)}
              className="inline-flex items-center gap-2 rounded-full bg-[#2e7d32] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#1b5e20]"
            >
              Abrir SIG en pantalla completa
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        ) : null}
      </section>

      {/* ── Capas de información ── */}
      <section className="bg-[#f8f5f2] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-center gap-3">
            <Layers className="h-5 w-5 text-[#2e7d32]" aria-hidden="true" />
            <h2 className="font-display text-2xl text-[#1a1a1a]">Capas de información</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {capas.map((capa) => (
              <div
                key={capa.id}
                className="flex items-center gap-4 rounded-[20px] border bg-white px-4 py-4 transition hover:shadow-sm"
                style={{
                  borderColor: capa.active ? capa.color : "#e8dfd3",
                  borderLeftWidth: capa.active ? "3px" : "1px",
                }}
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold"
                  style={{ background: capa.lightBg, color: capa.color }}
                >
                  {capa.abbr.slice(0, 3)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#1a1a1a]">{capa.label}</p>
                  <p className="mt-0.5 text-xs text-[#7a756e]">
                    {capa.active ? "Activa" : "Disponible"}
                  </p>
                </div>
                {/* toggle pill */}
                <div
                  className="h-5 w-9 rounded-full transition-colors"
                  style={{ background: capa.active ? capa.color : "#e8dfd3" }}
                  aria-hidden="true"
                >
                  <div
                    className="mt-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform"
                    style={{
                      transform: capa.active ? "translateX(18px)" : "translateX(2px)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Abrir SIG + Ver tableros ── */}
      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Abrir SIG card */}
          {isInternal(role) ? (
            <div className="rounded-[28px] border border-[#e8dfd3] bg-[#f0eae0] p-8">
              <p className="eyebrow mb-3">Equipo SIG</p>
              <h2 className="font-display text-2xl text-[#1a1a1a]">Abrir geoportal interno</h2>
              <p className="mt-3 text-sm leading-6 text-[#4a4540]">
                Accede al sistema de información geográfica del equipo Hileros/PCN — gestiona
                capas, cartografía y análisis espacial del territorio.
              </p>
              <Link
                href={withRole("/geoportal", role)}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#1a1a1a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#333]"
              >
                Ir al Geoportal
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          ) : (
            <div className="rounded-[28px] border border-[#e8dfd3] bg-[#f0eae0] p-8">
              <p className="eyebrow mb-3">Datos del territorio</p>
              <h2 className="font-display text-2xl text-[#1a1a1a]">¿Qué es el SCITA?</h2>
              <p className="mt-3 text-sm leading-6 text-[#4a4540]">
                El Sistema de Control e Información Territorial Ambiental centraliza la producción
                de datos del equipo SIG de Hileros/PCN para respaldar la toma de decisiones en
                los Consejos Comunitarios.
              </p>
            </div>
          )}

          {/* Ver tableros card */}
          <div className="rounded-[28px] border border-[#e8dfd3] bg-white p-8">
            <p className="eyebrow mb-3">Mirador de datos</p>
            <h2 className="font-display text-2xl text-[#1a1a1a]">Ver tableros territoriales</h2>
            <p className="mt-3 text-sm leading-6 text-[#4a4540]">
              Catálogo de tableros Power BI con indicadores sobre agua, territorio, cobertura
              boscosa y demografía de los Consejos Comunitarios del Pacífico colombiano.
            </p>
            <Link
              href={withRole("/estadisticas", role)}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#2e7d32] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1b5e20]"
            >
              Ver tableros
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Envía información ambiental CTA ── */}
      <section className="bg-[#1b5e20] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl text-white sm:text-3xl">
              Envía información ambiental desde el territorio
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">
              Tu aporte desde el territorio es valioso. Comparte observaciones sobre agua,
              bosques, fauna o alertas ambientales con el equipo del Palenke/PCN.
            </p>
          </div>
          <Link
            href={withRole("/scita/formulario", role)}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#1b5e20] transition hover:bg-white/90"
          >
            Enviar información
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
