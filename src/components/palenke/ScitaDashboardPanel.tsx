"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, ChevronDown, ChevronRight, ExternalLink, Maximize2, Minimize2 } from "lucide-react";
import { SCITA_MARKETING_BANNER_SRC } from "@/components/palenke/scitaMarketingHero";

export type ScitaDashboardId = "gobierno" | "conservacion" | "titulacion";

type DashboardConfig = {
  id: ScitaDashboardId;
  title: string;
  shortLabel: string;
  description: string;
  detailDescription: string;
  detailBullets: string[];
  embedUrl: string;
  iframeTitle: string;
  embedWidth: number;
  embedHeight: number;
  footerCropPx?: number;
  iconSrc: string;
};

const DEFAULT_EMBED_WIDTH = 600;
const DEFAULT_EMBED_HEIGHT = 373.5;
const DEFAULT_POWERBI_FOOTER_PX = 56;

const DASHBOARDS: DashboardConfig[] = [
  {
    id: "gobierno",
    title: "Instrumentos de Gobierno Propio",
    shortLabel: "Gobierno propio",
    description: "Reglamentos, normas internas y planes de etnodesarrollo comunitario.",
    detailDescription:
      "Este tablero consolida la información de reglamentos comunitarios, planes de uso y planes de etnodesarrollo para identificar avances, brechas y prioridades de gobernanza. Permite comparar territorios, fortalecer la toma de decisiones internas y sustentar procesos organizativos con evidencia territorial para escenarios de planificación anual y rendición comunitaria.",
    detailBullets: [
      "Cobertura: consejos comunitarios, instrumento vigente, estado de adopción y nivel de actualización.",
      "Lectura principal: qué territorios tienen avances normativos robustos y cuáles requieren acompañamiento técnico o jurídico.",
      "Cruce sugerido: relacionar instrumentos con conflictos de uso del suelo, presión extractiva y alertas territoriales.",
      "Uso político: preparar reuniones con autoridades, asambleas y mesas interinstitucionales con evidencia consolidada.",
    ],
    iframeTitle: "P_Instrumentos de Gobierno Propio",
    embedUrl:
      "https://app.powerbi.com/view?r=eyJrIjoiZjljZDMxZjMtMjNhNS00ZGMzLTgwMTYtY2E5YzM4ZGNhNjE5IiwidCI6ImNlODUzNmFiLWYzOTktNGZiYS04MWQ1LTgwZDc0ZWVlOTk5ZCIsImMiOjR9",
    embedWidth: DEFAULT_EMBED_WIDTH,
    embedHeight: DEFAULT_EMBED_HEIGHT,
    footerCropPx: DEFAULT_POWERBI_FOOTER_PX,
    iconSrc: "/assets/scita/icons/icon-gobierno.png",
  },
  {
    id: "conservacion",
    title: "Áreas de Conservación Comunitaria",
    shortLabel: "Conservación",
    description: "Figuras de protección, biodiversidad y seguimiento territorial de ecosistemas.",
    detailDescription:
      "Este módulo muestra el estado de las áreas de conservación comunitaria, la distribución de ecosistemas estratégicos y señales de presión ambiental en el territorio. Su lectura facilita priorizar acciones de protección, monitoreo y control comunitario sobre bosques, cuencas y zonas de alta importancia biocultural en ventanas de seguimiento mensual y trimestral.",
    detailBullets: [
      "Cobertura: áreas bioculturales, cuencas priorizadas, cobertura boscosa y puntos críticos de presión.",
      "Lectura principal: identificar dónde se concentra la amenaza y qué zonas mantienen mayor resiliencia ecológica.",
      "Cruce sugerido: contrastar cambios de cobertura con reportes de campo y eventos climáticos recientes.",
      "Uso operativo: priorizar brigadas comunitarias, rutas de verificación y medidas de restauración temprana.",
    ],
    iframeTitle: "P_Áreas de Conservación Comunitaria",
    embedUrl:
      "https://app.powerbi.com/view?r=eyJrIjoiNTk3NmZlYmMtN2U2NS00NTFkLWEzOTEtZjAzNTg0ZTZhNjU2IiwidCI6ImNlODUzNmFiLWYzOTktNGZiYS04MWQ1LTgwZDc0ZWVlOTk5ZCIsImMiOjR9",
    embedWidth: DEFAULT_EMBED_WIDTH,
    embedHeight: DEFAULT_EMBED_HEIGHT,
    footerCropPx: DEFAULT_POWERBI_FOOTER_PX,
    iconSrc: "/assets/scita/icons/icon-conservacion.png",
  },
  {
    id: "titulacion",
    title: "Titulación Colectiva De Comunidades Negras",
    shortLabel: "Titulación colectiva",
    description: "Consejos comunitarios y territorios colectivos en trámite y adjudicación.",
    detailDescription:
      "Este tablero presenta el comportamiento de procesos de titulación colectiva por consejo comunitario y por estado del trámite, visibilizando avances y rezagos. Sirve para orientar incidencia jurídica y política, respaldar gestiones institucionales y dar seguimiento a la garantía efectiva de derechos territoriales en ciclos de gestión ante entidades públicas.",
    detailBullets: [
      "Cobertura: expedientes por territorio, fase del trámite, tiempos acumulados y estado administrativo.",
      "Lectura principal: detectar cuellos de botella en procesos de adjudicación y formalización colectiva.",
      "Cruce sugerido: comparar avance de titulación con presión territorial y conflictividad local.",
      "Uso estratégico: sustentar acciones de incidencia, seguimiento legal y priorización de casos urgentes.",
    ],
    iframeTitle: "P_Titulación Colectiva De Comunidades Negras",
    embedUrl:
      "https://app.powerbi.com/view?r=eyJrIjoiZjZlYzMzZDctNDcwMy00Zjc5LTg1ZjUtODRjYTYzZGZkZGE4IiwidCI6ImNlODUzNmFiLWYzOTktNGZiYS04MWQ1LTgwZDc0ZWVlOTk5ZCIsImMiOjR9",
    embedWidth: DEFAULT_EMBED_WIDTH,
    embedHeight: DEFAULT_EMBED_HEIGHT,
    footerCropPx: DEFAULT_POWERBI_FOOTER_PX,
    iconSrc: "/assets/scita/icons/icon-titulacion.png",
  },
];

const panelEase = [0.22, 1, 0.36, 1] as const;
const panelSpring = { type: "spring" as const, stiffness: 380, damping: 32 };

/**
 * Publish-to-web URL params (limited — many only work on reportEmbed + SDK).
 * @see https://learn.microsoft.com/en-us/power-bi/collaborate-share/service-publish-to-web
 * @see https://learn.microsoft.com/en-us/javascript/api/overview/powerbi/configure-report-settings
 */
function buildChromelessEmbedUrl(baseUrl: string) {
  const url = new URL(baseUrl);
  url.searchParams.set("chromeless", "1");
  url.searchParams.set("navContentPaneEnabled", "false");
  url.searchParams.set("filterPaneEnabled", "false");
  url.searchParams.set("actionBarEnabled", "false");
  return url.toString();
}

function DashboardMenuCard({
  dashboard,
  selected,
  onSelect,
}: {
  dashboard: DashboardConfig;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.button
      type="button"
      layout
      layoutId={`scita-dash-card-${dashboard.id}`}
      onClick={onSelect}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={panelSpring}
      aria-pressed={selected}
      className={`group w-full rounded-2xl border px-2.5 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0c1a12] sm:px-3 sm:py-3.5 md:px-3 md:py-3.5 ${
        selected
          ? "border-amber-300/80 bg-white/12 shadow-[inset_0_0_0_1px_rgba(251,191,36,0.35)]"
          : "border-white/10 bg-black/20 hover:border-white/30 hover:bg-white/[0.07]"
      }`}
    >
      <div className="flex items-center gap-3 sm:gap-3.5">
        <motion.div
          layout
          className={`relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-[#f5f0e6] transition-colors ${
            selected
              ? "border-amber-300/90 shadow-[0_0_0_2px_rgba(251,191,36,0.35)]"
              : "border-white/25 group-hover:border-emerald-300/50"
          }`}
        >
          <Image src={dashboard.iconSrc} alt="" width={48} height={48} className="h-12 w-12 object-contain" aria-hidden />
        </motion.div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-semibold leading-tight text-white sm:text-lg">{dashboard.shortLabel}</p>
          <p className="mt-1 line-clamp-2 text-sm leading-snug text-white/75 sm:text-[15px] sm:leading-snug">{dashboard.description}</p>
        </div>
        <ChevronRight
          className={`h-5 w-5 shrink-0 transition-colors ${selected ? "text-amber-300" : "text-white/45 group-hover:text-white/80"}`}
          aria-hidden
        />
      </div>
    </motion.button>
  );
}

/**
 * Wrapper + iframe pattern for publish-to-web embeds.
 * Internal letterboxing must also be fixed in Power BI Desktop:
 * View → Page view → Fit to width | Format → Canvas → Page size.
 * @see https://community.powerbi.com/t5/Power-Query/White-space-in-embedded-iframe/td-p/613836
 */
function PowerBiBoardLoader() {
  return (
    <motion.div
      key="scita-board-loader"
      className="absolute inset-0 z-10 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#070f0c] via-[#0c1a12] to-[#0a1610]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.55, ease: panelEase } }}
      transition={{ duration: 0.35, ease: panelEase }}
      aria-live="polite"
      aria-busy="true"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage: "radial-gradient(rgba(74,222,128,0.45) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <motion.div
        className="relative flex flex-col items-center"
        initial={{ opacity: 0, y: 18, scale: 0.94, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="relative flex h-24 w-24 items-center justify-center sm:h-28 sm:w-28"
          animate={{ scale: [1, 1.06, 1], opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full bg-emerald-400/15 blur-xl"
            animate={{ scale: [1, 1.18, 1], opacity: [0.45, 0.75, 0.45] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
          <Image
            src="/brands/palenkelogo-light.svg"
            alt="Palenke"
            width={112}
            height={112}
            className="relative h-full w-full object-contain drop-shadow-[0_4px_24px_rgba(74,222,128,0.35)]"
            priority
          />
        </motion.div>

        <motion.span
          aria-hidden
          className="mt-8 block h-px w-[min(12rem,38vw)] origin-center bg-gradient-to-r from-transparent via-[#4ade80]/60 to-transparent"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.95, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: "center center" }}
        />

        <motion.p
          className="mt-5 font-sans text-xs font-semibold uppercase tracking-[0.28em] text-emerald-200/85 sm:text-[13px]"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          Cargando tablero…
        </motion.p>

        <div className="mt-4 flex items-center gap-1.5" aria-hidden>
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-emerald-300/85"
              animate={{ opacity: [0.25, 1, 0.25], y: [0, -2, 0] }}
              transition={{ duration: 1.05, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

function PowerBiEmbedFrame({
  title,
  src,
  embedHeight,
  footerCropPx = DEFAULT_POWERBI_FOOTER_PX,
}: {
  title: string;
  src: string;
  embedHeight: number;
  footerCropPx?: number;
}) {
  const [loaded, setLoaded] = useState(false);
  // Publish-to-web keeps a bottom bar; crop it using known pixel height from the original embed size.
  const rawCropBottom = footerCropPx / embedHeight;
  const safeCropBottom = Math.min(Math.max(rawCropBottom, 0), 0.35);

  return (
    <motion.div
      className="absolute inset-0 h-full w-full overflow-hidden bg-[#0b0b0b]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.32, ease: panelEase }}
    >
      <motion.div
        className="absolute inset-0 h-full w-full"
        initial={false}
        animate={{
          opacity: loaded ? 1 : 0,
          scale: loaded ? 1 : 1.015,
          filter: loaded ? "blur(0px)" : "blur(6px)",
        }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <iframe
          title={title}
          src={buildChromelessEmbedUrl(src)}
          onLoad={() => setLoaded(true)}
          className="absolute left-0 top-0 block w-full border-0"
          style={{ height: `${100 + safeCropBottom * 100}%` }}
          allowFullScreen
          loading="lazy"
        />
      </motion.div>

      <AnimatePresence initial={false}>
        {loaded ? null : <PowerBiBoardLoader />}
      </AnimatePresence>
    </motion.div>
  );
}

function hrefWithCurrentSearch(path: string, search: string) {
  return search ? `${path}?${search}` : path;
}

export function ScitaDashboardPanel() {
  const searchParams = useSearchParams();
  const searchString = searchParams.toString();

  const [activeId, setActiveId] = useState<ScitaDashboardId>("gobierno");
  const [showBannerDetails, setShowBannerDetails] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [surfaceHeight, setSurfaceHeight] = useState<number | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const active = DASHBOARDS.find((d) => d.id === activeId) ?? DASHBOARDS[0];
  const reportAspectRatio = active.embedWidth / active.embedHeight;

  const toggleExpanded = useCallback(async () => {
    if (!boardRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await boardRef.current.requestFullscreen();
        setExpanded(true);
      } else {
        await document.exitFullscreen();
        setExpanded(false);
      }
    } catch {
      setExpanded((v) => !v);
    }
  }, []);

  useEffect(() => {
    const onFullscreenChange = () => {
      setExpanded(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  useEffect(() => {
    if (expanded) return;

    const element = surfaceRef.current;
    if (!element || typeof window === "undefined") return;

    const updateSurfaceHeight = () => {
      const width = element.getBoundingClientRect().width;
      if (!width) return;

      const viewportOffset = window.innerWidth >= 1024 ? 132 : 220;
      const viewportCap = Math.max(240, window.innerHeight - viewportOffset);
      const nextHeight = Math.round(Math.min(width / reportAspectRatio, viewportCap));

      setSurfaceHeight((current) => (current === nextHeight ? current : nextHeight));
    };

    updateSurfaceHeight();

    const observer =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(updateSurfaceHeight) : null;

    observer?.observe(element);
    window.addEventListener("resize", updateSurfaceHeight);

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", updateSurfaceHeight);
    };
  }, [expanded, reportAspectRatio]);

  return (
    <motion.div
      layout
      ref={boardRef}
      className={`relative z-[1] flex w-full max-w-full isolate ${
        expanded
          ? "fixed inset-0 z-[90] h-dvh min-h-0 flex-col overflow-x-hidden overflow-y-auto overscroll-y-contain rounded-none border-0 bg-[#051008]"
          : "flex flex-col overflow-x-clip overflow-y-visible rounded-[28px] border border-[#1f3b2d]/40 bg-[#f5f4ed] shadow-[0_28px_64px_rgba(4,16,11,0.35)] md:flex-row"
      }`}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: panelEase }}
    >
      {!expanded ? (
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          aria-hidden
          style={{
            backgroundImage: `
              radial-gradient(circle at 8% 10%, rgba(46,125,50,0.18), transparent 35%),
              radial-gradient(circle at 90% 85%, rgba(251,192,45,0.14), transparent 40%)
            `,
          }}
        />
      ) : null}

      <motion.aside
        layout
        transition={panelSpring}
        className={`relative flex min-h-0 min-w-0 shrink-0 flex-col border-[#d7d0bf] ${
          expanded
            ? "absolute inset-y-0 left-0 z-30 w-[min(88vw,340px)] max-w-[88vw] border-r bg-[#09160f]/95 text-white backdrop-blur-xl sm:max-w-none sm:w-[360px]"
            : "w-full min-h-0 border-b bg-gradient-to-b from-[#0e251a] via-[#091b13] to-[#07140f] text-white md:w-[332px] md:shrink-0 md:border-b-0 md:border-r lg:w-[360px] xl:w-[388px] 2xl:w-[412px]"
        }`}
        aria-label="Menú de tableros"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.13]"
          aria-hidden
          style={{
            backgroundImage: `
              radial-gradient(circle at 14% 12%, rgba(74,222,128,0.25), transparent 34%),
              radial-gradient(circle at 86% 70%, rgba(251,192,45,0.2), transparent 36%),
              linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: "auto, auto, 42px 42px, 42px 42px",
          }}
        />

        <motion.div
          layout
          className="relative z-10 flex min-h-0 flex-1 flex-col gap-3 px-2 py-3 sm:gap-3.5 sm:px-2.5 sm:py-3.5 md:max-h-[92dvh] md:overflow-y-auto md:overscroll-y-contain md:px-2.5 md:py-4 lg:gap-4"
        >
          <motion.div layout="position">
            <p className="text-xs font-bold uppercase tracking-[0.17em] text-emerald-200/85 sm:text-[13px]">Módulos principales</p>
            <h2 className="mt-1 font-display text-[clamp(1.35rem,3.5vw,1.85rem)] font-semibold leading-tight text-white sm:text-[1.75rem] md:text-[29px]">
              SCITA
            </h2>
            <p className="mt-1 max-w-[32ch] text-sm leading-relaxed text-white/75 sm:text-[15px] md:max-w-none">
              Selecciona un módulo para abrir su tablero territorial en vista ampliada.
            </p>
          </motion.div>

          <nav className="grid shrink-0 gap-2.5 sm:gap-3">
            {DASHBOARDS.map((dashboard) => (
              <DashboardMenuCard
                key={dashboard.id}
                dashboard={dashboard}
                selected={dashboard.id === activeId}
                onSelect={() => setActiveId(dashboard.id)}
              />
            ))}
          </nav>

          <div className="min-h-2 flex-1 shrink-0" aria-hidden />

          <div className="flex shrink-0 flex-col gap-2.5 sm:gap-3">
            <Link
              href={hrefWithCurrentSearch("/scita/formulario", searchString)}
              className="group flex flex-col gap-3 rounded-2xl border-2 border-[#8b4a2f]/60 bg-gradient-to-br from-[#c4713d] to-[#9a4a2c] p-3 shadow-lg transition hover:border-[#fbc02d]/40 hover:shadow-xl sm:p-3.5"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20">
                  <AlertTriangle className="h-5 w-5 text-white" aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-[15px] font-bold leading-snug text-white sm:text-lg">Crear reporte de alerta</h3>
                  <p className="mt-1 text-sm leading-snug text-white/90 sm:text-[15px]">Registra amenazas o novedades desde el territorio.</p>
                </div>
              </div>
              <span className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white/95 px-3 py-2.5 text-sm font-bold text-[#7a3b24] transition group-hover:bg-white sm:text-base">
                Ir al formulario
                <ExternalLink className="h-4 w-4 shrink-0" aria-hidden />
              </span>
            </Link>

            <Link
              href={hrefWithCurrentSearch("/geoportal", searchString)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-3 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/18 sm:px-4 sm:py-3 sm:text-[15px]"
            >
              Abrir SIG completo
              <ExternalLink className="h-4 w-4 shrink-0" aria-hidden />
            </Link>
          </div>

          <div className="shrink-0 border-t border-white/10 pt-3 text-center">
            <p className="font-display text-xs font-semibold uppercase tracking-[0.38em] text-white/45 sm:text-[13px]">ISI</p>
          </div>
        </motion.div>
      </motion.aside>

      <motion.div layout className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-x-clip overflow-y-visible">

        {!expanded ? (
          <div className="px-4 pt-4 sm:px-6">
            <motion.div
              key={active.id}
              layout
              className="relative flex min-h-[168px] items-center overflow-hidden rounded-2xl border border-[#d8d1bc] bg-[#0e251a] bg-cover bg-center px-5 py-10 sm:min-h-[220px] sm:px-8 sm:py-12 lg:min-h-[260px] lg:py-14"
              style={{ backgroundImage: `url(${encodeURI(SCITA_MARKETING_BANNER_SRC)})` }}
            >
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/35 via-black/10 to-black/25"
                aria-hidden
              />
              <div className="relative z-10 w-full max-w-[980px]">
                <button
                  type="button"
                  onClick={() => setShowBannerDetails((value) => !value)}
                  aria-expanded={showBannerDetails}
                  aria-controls={`scita-banner-details-${active.id}`}
                  className="inline-flex items-center gap-3 rounded-full border border-white/35 bg-black/30 px-4 py-2 text-left text-white backdrop-blur-sm transition hover:bg-black/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e251a]"
                >
                  <span className="font-display text-[clamp(1.2rem,2.1vw,1.8rem)] font-semibold uppercase leading-tight tracking-[0.04em] drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
                    {active.title}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 transition-transform ${showBannerDetails ? "rotate-180" : "rotate-0"}`}
                    aria-hidden
                  />
                </button>

                <AnimatePresence initial={false}>
                  {showBannerDetails ? (
                    <motion.div
                      id={`scita-banner-details-${active.id}`}
                      key={`scita-banner-details-${active.id}`}
                      initial={{ height: 0, opacity: 0, y: -8 }}
                      animate={{ height: "auto", opacity: 1, y: 0 }}
                      exit={{ height: 0, opacity: 0, y: -8 }}
                      transition={{ duration: 0.28, ease: panelEase }}
                      className="overflow-hidden"
                    >
                      <p className="mt-3 max-w-[92ch] rounded-xl border border-white/25 bg-black/35 px-4 py-3 text-[15px] leading-relaxed text-white/92 backdrop-blur-sm sm:text-base">
                        {active.detailDescription}
                      </p>
                      <div className="mt-3 max-w-[92ch] rounded-xl border border-white/20 bg-black/28 px-4 py-3 backdrop-blur-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-200/85 sm:text-[13px]">
                          Detalle del tablero (mock)
                        </p>
                        <ul className="mt-2 space-y-1.5 text-[15px] leading-relaxed text-white/90 sm:text-base">
                          {active.detailBullets.map((item) => (
                            <li key={item} className="flex items-start gap-2">
                              <span className="mt-[0.42rem] h-1.5 w-1.5 shrink-0 rounded-full bg-lime-300" aria-hidden />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        ) : null}

        <div className={`relative flex min-h-0 min-w-0 flex-1 flex-col ${expanded ? "min-h-0 overflow-x-clip overflow-y-auto overscroll-y-contain" : "overflow-x-clip overflow-y-visible"} ${expanded ? "px-2 pb-2 pt-2 sm:px-3 sm:pb-3" : "px-4 pb-4 pt-4 sm:px-6 sm:pb-6"}`}>
          <motion.button
            type="button"
            onClick={toggleExpanded}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            transition={panelSpring}
            className={`absolute right-6 top-4 z-20 inline-flex h-9 w-9 items-center justify-center rounded-xl border shadow-sm transition sm:right-8 ${
              expanded
                ? "border-white/20 bg-black/50 text-white hover:bg-black/70"
                : "border-[#d6d0be] bg-white/95 text-[#244334] hover:bg-[#f4f1e6]"
            }`}
            aria-label={expanded ? "Salir de pantalla completa" : "Pantalla completa del tablero"}
          >
            {expanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </motion.button>
          <motion.div
            layout
            ref={surfaceRef}
            className={`relative min-h-0 min-w-0 overflow-hidden rounded-2xl border bg-[#0b0b0b] ${
              expanded
                ? "flex-1 border-white/12 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]"
                : "w-full border-[#d8d1bc] shadow-[0_18px_36px_rgba(3,10,8,0.22)]"
            }`}
            style={
              expanded
                ? undefined
                : {
                    aspectRatio: `${active.embedWidth} / ${active.embedHeight}`,
                    height: surfaceHeight ? `${surfaceHeight}px` : undefined,
                  }
            }
          >
            <AnimatePresence mode="wait">
              <PowerBiEmbedFrame
                key={active.id}
                title={active.iframeTitle}
                src={active.embedUrl}
                embedHeight={active.embedHeight}
                footerCropPx={active.footerCropPx}
              />
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
