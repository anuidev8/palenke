import Link from "next/link";
import { ArrowRight, ExternalLink, Layers } from "lucide-react";
import { SiteLayout } from "@/components/mock/ui";
import { ScitaLayerToggles } from "@/components/palenke/ScitaLayerToggles";
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
  {
    id: "uso",
    label: "Zonas de uso del territorio",
    abbr: "Uso",
    color: "#f57f17",
    lightBg: "#fff3cd",
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
          <h1 className="font-display text-4xl text-white sm:text-5xl">SCITA</h1>
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

      {/* ── Video explicativo ── */}
      <section className="bg-[#1a1a1a] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
          {/* Video thumbnail mockup */}
          <div
            className="relative overflow-hidden rounded-[28px]"
            style={{ aspectRatio: "16/9" }}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at 30% 60%, rgba(46,125,50,0.55), transparent 55%), radial-gradient(ellipse at 75% 25%, rgba(21,101,192,0.35), transparent 50%), linear-gradient(155deg, #0d1f0d 0%, #152a35 60%, #0d1a1a 100%)",
              }}
            />
            {/* map-like grid lines */}
            <div className="absolute inset-0 opacity-[0.06]" aria-hidden="true">
              {Array.from({ length: 8 }).map((_, i) => (
                <span
                  key={`v-${i}`}
                  className="absolute top-0 h-full w-px bg-white"
                  style={{ left: `${i * 12.5 + 6}%` }}
                />
              ))}
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={`h-${i}`}
                  className="absolute left-0 h-px w-full bg-white"
                  style={{ top: `${i * 20 + 10}%` }}
                />
              ))}
            </div>
            {/* SVG polygons */}
            <svg
              className="absolute inset-0 h-full w-full opacity-25"
              viewBox="0 0 640 360"
              preserveAspectRatio="xMidYMid slice"
              aria-hidden="true"
            >
              <polygon
                points="80,60 200,40 240,120 170,160 90,140"
                fill="#2e7d32"
                opacity="0.6"
              />
              <polygon
                points="300,80 420,60 450,150 370,180 290,145"
                fill="#1565c0"
                opacity="0.45"
              />
              <circle cx="140" cy="100" r="5" fill="white" opacity="0.9" />
              <circle cx="355" cy="115" r="5" fill="white" opacity="0.9" />
            </svg>
            {/* Play button */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/40 bg-white/10 backdrop-blur-sm">
                <svg
                  viewBox="0 0 24 24"
                  className="h-7 w-7 translate-x-0.5 fill-white"
                  aria-hidden="true"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/55">
                ¿Qué es el SCITA?
              </span>
            </div>
            {/* Duration */}
            <div className="absolute bottom-3 right-3 rounded-md bg-black/70 px-2 py-1 text-xs font-semibold text-white">
              2:18
            </div>
          </div>

          {/* Text */}
          <div>
            <h2 className="font-display text-3xl text-white sm:text-4xl">
              ¿Qué hace el SCITA?
            </h2>
            <p className="mt-4 text-base leading-7 text-white/70">
              El SCITA es la infraestructura de información territorial del Palenke. Integra
              datos geoespaciales, alertas ambientales y monitoreo comunitario en una sola
              plataforma — para que las comunidades produzcan, gestionen y protejan información
              sobre su propio territorio.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Generar información territorial propia para la toma de decisiones.",
                "Monitorear ecosistemas, cobertura boscosa y dinámicas territoriales.",
                "Identificar amenazas ambientales y territoriales desde el campo.",
                "Fortalecer el control comunitario del territorio con soberanía de información.",
                "Articular información para incidencia política a nivel nacional e internacional.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-white/65">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2e7d32]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Capas de información ── */}
      <section className="bg-[#f8f5f2] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-center gap-3">
            <Layers className="h-5 w-5 text-[#2e7d32]" aria-hidden="true" />
            <h2 className="font-display text-2xl text-[#1a1a1a]">Capas de información</h2>
          </div>

          <ScitaLayerToggles initialLayers={capas} />
        </div>
      </section>

      {/* ── Abrir SIG + Ver tableros ── */}
      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className={`grid gap-6 ${isInternal(role) ? "md:grid-cols-2" : ""}`}>
          {/* SIG-A card (internal only) */}
          {isInternal(role) ? (
            <div className="rounded-[28px] border border-[#e8dfd3] bg-[#f0eae0] p-8">
              <p className="eyebrow mb-3">SIG Afrodescendiente · SIG-A</p>
              <h2 className="font-display text-2xl text-[#1a1a1a]">Enlace al SIG Afrodescendiente</h2>
              <p className="mt-3 text-sm leading-6 text-[#4a4540]">
                Accede al visor geográfico comunitario del equipo Corporación Agencia Afrocolombiana
                Hileros/PCN — consulta mapas, capas territoriales y análisis espacial con soberanía
                de información afrodescendiente.
              </p>
              <Link
                href={withRole("/geoportal", role)}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#1a1a1a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#333]"
              >
                Abrir SIG-A
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          ) : null}

          {/* Ver tableros card */}
          <div className="rounded-[28px] border border-[#e8dfd3] bg-white p-8">
            <div className="mb-3 flex items-center gap-2">
              <p className="eyebrow">Mirador de datos · Power BI</p>
              {/* Read-only badge for public */}
              {!isInternal(role) ? (
                <span className="rounded-full bg-[#f0eae0] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#7a756e]">
                  Solo lectura
                </span>
              ) : null}
            </div>
            <h2 className="font-display text-2xl text-[#1a1a1a]">Tableros territoriales</h2>
            <p className="mt-3 text-sm leading-6 text-[#4a4540]">
              Indicadores sobre agua, territorio, cobertura boscosa y demografía de los Consejos
              Comunitarios del Pacífico colombiano.
            </p>
            {!isInternal(role) ? (
              <p className="mt-2 text-xs leading-5 text-[#7a756e]">
                Vista pública — solo métricas. Los botones de filtro y descarga están disponibles
                para el equipo interno.
              </p>
            ) : null}
            {/* Mock Power BI preview tiles */}
            <div className="mt-5 grid grid-cols-2 gap-2">
              {[
                { label: "Cobertura boscosa", val: "68%", color: "#2e7d32", bg: "#d8f3dc" },
                { label: "Alertas activas", val: "12", color: "#d32f2f", bg: "#fddede" },
                { label: "ACCs declaradas", val: "7", color: "#1565c0", bg: "#e3f2fd" },
                { label: "Cuencas monitoreadas", val: "23", color: "#f57f17", bg: "#fff3cd" },
              ].map((m) => (
                <div
                  key={m.label}
                  className="rounded-[16px] p-3"
                  style={{ background: m.bg }}
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: m.color }}>
                    {m.label}
                  </p>
                  <p className="mt-1 font-display text-2xl" style={{ color: m.color }}>
                    {m.val}
                  </p>
                </div>
              ))}
            </div>
            <Link
              href={withRole("/estadisticas", role)}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#1a1a1a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#333]"
            >
              Ver todos los tableros
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
              El Sistema de Monitoreo Comunitario registra alertas territoriales, hace seguimiento
              a amenazas extractivas y ambientales, y centraliza los reportes de campo de los
              Consejos Comunitarios. Tu aporte es soberanía de información.
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
