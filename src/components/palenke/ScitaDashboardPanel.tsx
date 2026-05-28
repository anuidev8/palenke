"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Globe,
  Info,
  Lock,
  Maximize2,
  Minimize2,
} from "lucide-react";
import {
  ScitaDashboardGuideModal,
  ScitaDashboardGuideSummary,
} from "@/components/palenke/ScitaDashboardGuideModal";
import { SCITA_MARKETING_BANNER_SRC } from "@/components/palenke/scitaMarketingHero";
import type { ViewerRole } from "@/lib/mock-data";
import type { ScitaDashboardRecord } from "@/lib/scita-dashboards";
import { normalizeScitaBoardOrigin } from "@/lib/scita-report-form";
import { isInternal } from "@/lib/viewer";

export type ScitaDashboardId = ScitaDashboardRecord["moduleKey"];

const DEFAULT_POWERBI_FOOTER_PX = 56;

const SCITA_METHODOLOGICAL_NOTICE =
  "La Plataforma Palenque actúa únicamente como medio de visualización de información geográfica proveniente del geovisor técnico del proyecto. Los mapas presentados tienen carácter técnico y referencial, y no constituyen cartografía oficial ni delimitaciones jurídicas.";

function ScitaMethodologicalNoticeBody({
  variant,
}: {
  variant: "banner" | "footer";
}) {
  const labelClass =
    variant === "banner"
      ? "font-semibold text-amber-100"
      : "font-semibold text-[#5c4218]";
  const bodyClass =
    variant === "banner"
      ? "text-[15px] leading-relaxed text-white/92 sm:text-base"
      : "text-sm leading-relaxed text-[#3d3528] sm:text-[15px]";

  return (
    <p className={bodyClass}>
      <span className={labelClass}>Aviso metodológico: </span>
      {SCITA_METHODOLOGICAL_NOTICE}
    </p>
  );
}

export type ScitaDashboardPanelProps = {
  dashboards: ScitaDashboardRecord[];
  viewerRole: ViewerRole;
  isAuthenticated: boolean;
};

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

type BoardVisibilityTab = "public" | "internal";

function ScitaBoardVisibilityTabs({
  activeTab,
  publicCount,
  internalCount,
  onChange,
}: {
  activeTab: BoardVisibilityTab;
  publicCount: number;
  internalCount: number;
  onChange: (tab: BoardVisibilityTab) => void;
}) {
  const tabs: { id: BoardVisibilityTab; label: string; count: number; Icon: typeof Globe }[] = [
    { id: "public", label: "Públicos", count: publicCount, Icon: Globe },
    { id: "internal", label: "Internos", count: internalCount, Icon: Lock },
  ];

  return (
    <div
      role="tablist"
      aria-label="Tipo de tableros"
      className="grid grid-cols-2 gap-1 rounded-xl border border-white/10 bg-black/25 p-1"
    >
      {tabs.map(({ id, label, count, Icon }) => {
        const selected = activeTab === id;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(id)}
            className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/80 ${
              selected
                ? id === "public"
                  ? "bg-sky-500/25 text-sky-100 shadow-[inset_0_0_0_1px_rgba(125,211,252,0.35)]"
                  : "bg-amber-500/25 text-amber-100 shadow-[inset_0_0_0_1px_rgba(251,191,36,0.35)]"
                : "text-white/55 hover:bg-white/8 hover:text-white/85"
            }`}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
            <span>{label}</span>
            <span className="tabular-nums opacity-75">({count})</span>
          </button>
        );
      })}
    </div>
  );
}

function ScitaSessionAccessTag({ viewerIsInternal }: { viewerIsInternal: boolean }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${
        viewerIsInternal
          ? "border-amber-300/45 bg-amber-400/15 text-amber-100"
          : "border-sky-300/40 bg-sky-400/15 text-sky-100"
      }`}
    >
      {viewerIsInternal ? <Lock className="h-3 w-3" aria-hidden /> : <Globe className="h-3 w-3" aria-hidden />}
      {viewerIsInternal ? "Interno" : "Público"}
    </span>
  );
}

function DashboardMenuCard({
  dashboard,
  selected,
  onSelect,
}: {
  dashboard: ScitaDashboardRecord;
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
          <p className="mt-1 line-clamp-2 text-sm leading-snug text-white/75 sm:text-[15px] sm:leading-snug">
            {dashboard.description}
          </p>
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
  fillContainer = false,
}: {
  title: string;
  src: string;
  embedHeight: number;
  footerCropPx?: number;
  /** Fullscreen / expanded: 100% sizing so the embed repaints after layout changes. */
  fillContainer?: boolean;
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
          className="absolute left-0 top-0 block h-full w-full border-0"
          style={
            fillContainer
              ? undefined
              : { height: `${100 + safeCropBottom * 100}%`, width: "100%" }
          }
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

export function ScitaDashboardPanel({
  dashboards,
  viewerRole,
  isAuthenticated,
}: ScitaDashboardPanelProps) {
  const searchParams = useSearchParams();
  const searchString = searchParams.toString();
  const tableroParam = searchParams.get("tablero");

  const viewerIsInternal = isInternal(viewerRole);

  const publicBoards = useMemo(
    () => dashboards.filter((dashboard) => dashboard.visibility === "public"),
    [dashboards],
  );
  const internalBoards = useMemo(
    () => dashboards.filter((dashboard) => dashboard.visibility === "internal"),
    [dashboards],
  );
  const showVisibilityTabs = viewerIsInternal && internalBoards.length > 0;

  const [visibilityTab, setVisibilityTab] = useState<BoardVisibilityTab>("public");
  const [activeId, setActiveId] = useState(() => dashboards[0]?.id ?? "");
  const [showBannerDetails, setShowBannerDetails] = useState(false);
  const [showMethodologicalNotice, setShowMethodologicalNotice] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [isNativeFullscreen, setIsNativeFullscreen] = useState(false);
  const [cssExpanded, setCssExpanded] = useState(false);
  const [surfaceHeight, setSurfaceHeight] = useState<number | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const appliedTableroParam = useRef(false);
  const isExpanded = expanded || cssExpanded;

  const visibleBoards = showVisibilityTabs
    ? visibilityTab === "public"
      ? publicBoards
      : internalBoards
    : dashboards;

  const handleVisibilityTabChange = useCallback(
    (tab: BoardVisibilityTab) => {
      setVisibilityTab(tab);
      const list = tab === "public" ? publicBoards : internalBoards;
      if (!list.length) return;

      const current = dashboards.find((dashboard) => dashboard.id === activeId);
      const sameModule = current
        ? list.find((dashboard) => dashboard.moduleKey === current.moduleKey)
        : undefined;
      setActiveId(sameModule?.id ?? list[0].id);
    },
    [activeId, dashboards, internalBoards, publicBoards],
  );

  useEffect(() => {
    if (!dashboards.length) {
      setActiveId("");
      return;
    }
    if (!visibleBoards.length) {
      const fallback = visibilityTab === "internal" ? publicBoards : internalBoards;
      if (fallback[0]) {
        setVisibilityTab(fallback[0].visibility);
        setActiveId(fallback[0].id);
      }
      return;
    }
    if (!visibleBoards.some((dashboard) => dashboard.id === activeId)) {
      setActiveId(visibleBoards[0].id);
    }
  }, [activeId, dashboards, internalBoards, publicBoards, visibilityTab, visibleBoards]);

  useEffect(() => {
    if (!showVisibilityTabs) return;
    const current = dashboards.find((dashboard) => dashboard.id === activeId);
    if (current?.visibility === "public" || current?.visibility === "internal") {
      setVisibilityTab(current.visibility);
    }
  }, [activeId, dashboards, showVisibilityTabs]);

  useEffect(() => {
    if (appliedTableroParam.current || !dashboards.length) return;
    const moduleKey = normalizeScitaBoardOrigin(tableroParam);
    if (!moduleKey) return;

    const preferred =
      (viewerIsInternal
        ? dashboards.find((dashboard) => dashboard.moduleKey === moduleKey && dashboard.visibility === "internal")
        : undefined) ??
      dashboards.find((dashboard) => dashboard.moduleKey === moduleKey && dashboard.visibility === "public") ??
      dashboards.find((dashboard) => dashboard.moduleKey === moduleKey);

    if (!preferred) return;

    appliedTableroParam.current = true;
    setActiveId(preferred.id);
    setVisibilityTab(preferred.visibility);
  }, [dashboards, tableroParam, viewerIsInternal]);

  const active = dashboards.find((d) => d.id === activeId) ?? dashboards[0];
  const fieldReportUrl = useMemo(() => {
    const params = new URLSearchParams(searchString);
    if (active) {
      params.set("tablero", active.moduleKey);
    }
    return `/scita/formulario?${params.toString()}`;
  }, [searchString, active]);
  const reportAspectRatio = active ? active.embedWidth / active.embedHeight : 600 / 373.5;

  const toggleExpanded = useCallback(async () => {
    if (!boardRef.current) return;

    if (cssExpanded) {
      setCssExpanded(false);
      return;
    }

    if (document.fullscreenElement === boardRef.current) {
      try {
        await document.exitFullscreen();
      } catch {
        setIsNativeFullscreen(false);
        setExpanded(false);
      }
      return;
    }

    try {
      await boardRef.current.requestFullscreen();
      setIsNativeFullscreen(true);
      setExpanded(true);
    } catch {
      setIsNativeFullscreen(false);
      setExpanded(false);
      setCssExpanded(true);
    }
  }, [cssExpanded]);

  useEffect(() => {
    const onFullscreenChange = () => {
      const native = document.fullscreenElement === boardRef.current;
      setIsNativeFullscreen(native);
      if (native) {
        setCssExpanded(false);
        setExpanded(true);
      } else if (!cssExpanded) {
        setExpanded(false);
      }
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, [cssExpanded]);

  useEffect(() => {
    const element = surfaceRef.current;
    if (!element || typeof window === "undefined" || isExpanded) return;

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
  }, [isExpanded, reportAspectRatio]);

  useEffect(() => {
    setShowMethodologicalNotice(false);
  }, [activeId]);

  useEffect(() => {
    if (!isExpanded || typeof window === "undefined") return;
    let frame2 = 0;
    const frame1 = requestAnimationFrame(() => {
      frame2 = requestAnimationFrame(() => {
        window.dispatchEvent(new Event("resize"));
      });
    });
    return () => {
      cancelAnimationFrame(frame1);
      cancelAnimationFrame(frame2);
    };
  }, [isExpanded, activeId]);

  if (!active) {
    return (
      <div className="rounded-[28px] border border-[#d8d1bc] bg-[#f5f4ed] px-6 py-12 text-center">
        <p className="font-display text-xl text-[#244334]">No hay tableros disponibles</p>
        <p className="mt-2 text-sm text-[#3d5248]">
          {viewerIsInternal
            ? "Revisa el estado de los tableros en el panel de administración."
            : "Los tableros internos requieren una sesión con perfil interno o administrador."}
        </p>
      </div>
    );
  }

  return (
    <motion.div
      layout={!isExpanded}
      layoutRoot={isExpanded}
      ref={boardRef}
      className={`relative z-[1] flex w-full max-w-full isolate ${
        isExpanded
          ? isNativeFullscreen
            ? "scita-board-fullscreen flex h-full min-h-0 w-full max-w-full flex-row overflow-hidden rounded-none border-0 bg-[#051008]"
            : "fixed inset-0 z-[90] flex h-dvh min-h-0 w-full flex-row overflow-hidden rounded-none border-0 bg-[#051008]"
          : "flex flex-col overflow-x-clip overflow-y-visible rounded-[28px] border border-[#1f3b2d]/40 bg-[#f5f4ed] shadow-[0_28px_64px_rgba(4,16,11,0.35)] md:flex-row md:items-stretch"
      }`}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: panelEase }}
    >
      {!isExpanded ? (
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
          isExpanded
            ? "z-30 h-full w-[min(88vw,340px)] max-w-[88vw] shrink-0 border-r bg-[#09160f]/95 text-white backdrop-blur-xl sm:max-w-none sm:w-[360px]"
            : "flex w-full min-h-0 flex-col border-b bg-gradient-to-b from-[#0e251a] via-[#091b13] to-[#07140f] text-white md:w-[332px] md:shrink-0 md:overflow-hidden md:border-b-0 md:border-r lg:w-[360px] xl:w-[388px] 2xl:w-[412px]"
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

        <motion.div layout className="relative z-10 flex min-h-0 w-full flex-1 flex-col">
          <div className="flex min-h-0 flex-1 flex-col gap-3.5 overflow-y-auto overscroll-y-contain px-3.5 pt-4 sm:gap-4 sm:px-4 sm:pt-5 lg:gap-4">
          <motion.div layout="position" className="shrink-0 space-y-1.5">
            <motion.div className="flex flex-wrap items-start justify-between gap-2 gap-y-1.5">
              <h2 className="font-display text-[clamp(1.25rem,3.2vw,1.65rem)] font-semibold leading-tight text-white">
                Tableros territoriales
              </h2>
              <ScitaSessionAccessTag viewerIsInternal={viewerIsInternal} />
            </motion.div>
            <p className="text-sm text-white/60">Elige un módulo para abrir su vista.</p>
            <p className="text-xs leading-relaxed text-white/55">
              {viewerIsInternal ? (
                <>
                  Sesión {isAuthenticated ? "activa" : "simulada"} · rol{" "}
                  <span className="font-semibold text-emerald-200/90">{viewerRole}</span>
                  {showVisibilityTabs
                    ? " · usa las pestañas para alternar tableros públicos e internos"
                    : " · ves tableros públicos e internos"}
                </>
              ) : isAuthenticated ? (
                <>Inicia sesión con perfil interno para ver tableros restringidos.</>
              ) : (
                <>Solo tableros públicos. Inicia sesión como equipo para ver versiones internas.</>
              )}
            </p>

            {showVisibilityTabs ? (
              <ScitaBoardVisibilityTabs
                activeTab={visibilityTab}
                publicCount={publicBoards.length}
                internalCount={internalBoards.length}
                onChange={handleVisibilityTabChange}
              />
            ) : null}
          </motion.div>

          <nav
            className="grid shrink-0 gap-2.5 sm:gap-3"
            aria-label={showVisibilityTabs ? `Módulos ${visibilityTab === "public" ? "públicos" : "internos"}` : "Módulos"}
            role={showVisibilityTabs ? "tabpanel" : undefined}
          >
            {visibleBoards.map((dashboard) => (
              <DashboardMenuCard
                key={dashboard.id}
                dashboard={dashboard}
                selected={dashboard.id === activeId}
                onSelect={() => setActiveId(dashboard.id)}
              />
            ))}
          </nav>
          </div>

          <div
            className="flex shrink-0 flex-col gap-2.5 border-t border-white/10 bg-[#091b13] px-3.5 pb-4 pt-3 sm:gap-3 sm:px-4 sm:pb-5"
            aria-label="Acciones y ayuda"
          >
            <Link
              href={fieldReportUrl}
              className="group flex flex-col gap-3 rounded-2xl border-2 border-[#8b4a2f]/60 bg-gradient-to-br from-[#c4713d] to-[#9a4a2c] p-3 shadow-lg transition hover:border-[#fbc02d]/40 hover:shadow-xl sm:p-3.5"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20">
                  <AlertTriangle className="h-5 w-5 text-white" aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-[15px] font-bold leading-snug text-white sm:text-lg">
                    Crear reporte de alerta
                  </h3>
                  <p className="mt-1 text-sm leading-snug text-white/90 sm:text-[15px]">
                    Registra amenazas o novedades desde el territorio.
                  </p>
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

            <ScitaDashboardGuideSummary onOpenGuide={() => setGuideOpen(true)} />
          </div>
        </motion.div>
      </motion.aside>

      <motion.div
        layout={!isExpanded}
        className={`relative flex min-h-0 min-w-0 flex-1 flex-col overflow-x-clip ${
          isExpanded ? "h-full min-h-0 overflow-hidden" : "overflow-y-visible"
        }`}
      >

        {!isExpanded ? (
          <div className="px-5 pt-5 sm:px-7 sm:pt-6">
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
                <div className="flex flex-wrap items-center gap-2">
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

                  <button
                    type="button"
                    onClick={() => setShowMethodologicalNotice((value) => !value)}
                    aria-expanded={showMethodologicalNotice}
                    aria-controls={`scita-methodological-notice-${active.id}`}
                    aria-label={
                      showMethodologicalNotice
                        ? "Ocultar aviso metodológico"
                        : "Ver aviso metodológico"
                    }
                    title="Aviso metodológico"
                    className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border backdrop-blur-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/90 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e251a] sm:h-12 sm:w-12 ${
                      showMethodologicalNotice
                        ? "border-amber-200/70 bg-[#f0d49a] text-[#3d2e12] shadow-[0_0_0_2px_rgba(251,191,36,0.35)]"
                        : "border-amber-300/55 bg-[#e8c98a]/95 text-[#3d2e12] hover:bg-[#f0d49a]"
                    }`}
                  >
                    <Info className="h-5 w-5" aria-hidden />
                  </button>
                </div>

                <AnimatePresence initial={false}>
                  {showMethodologicalNotice ? (
                    <motion.div
                      id={`scita-methodological-notice-${active.id}`}
                      key={`scita-methodological-notice-${active.id}`}
                      initial={{ height: 0, opacity: 0, y: -8 }}
                      animate={{ height: "auto", opacity: 1, y: 0 }}
                      exit={{ height: 0, opacity: 0, y: -8 }}
                      transition={{ duration: 0.28, ease: panelEase }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 max-w-[92ch] rounded-xl border border-amber-300/35 bg-black/40 px-4 py-3 backdrop-blur-sm">
                        <ScitaMethodologicalNoticeBody variant="banner" />
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>

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
                        <ul className="space-y-1.5 text-[15px] leading-relaxed text-white/90 sm:text-base">
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

        <motion.div
          className={`relative flex min-h-0 min-w-0 flex-1 flex-col ${
            isExpanded
              ? "h-full min-h-0 overflow-hidden px-2 pb-2 pt-2 sm:px-3 sm:pb-3"
              : "overflow-x-clip overflow-y-visible px-5 pb-5 pt-3 sm:px-7 sm:pb-7 sm:pt-4"
          }`}
        >
          <motion.button
            type="button"
            onClick={toggleExpanded}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            transition={panelSpring}
            className={`absolute right-6 top-4 z-20 inline-flex h-9 w-9 items-center justify-center rounded-xl border shadow-sm transition sm:right-8 ${
              isExpanded
                ? "border-white/20 bg-black/50 text-white hover:bg-black/70"
                : "border-[#d6d0be] bg-white/95 text-[#244334] hover:bg-[#f4f1e6]"
            }`}
            aria-label={isExpanded ? "Salir de pantalla completa" : "Pantalla completa del tablero"}
          >
            {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </motion.button>
          <motion.div
            layout={!isExpanded}
            ref={surfaceRef}
            className={`relative min-h-0 min-w-0 overflow-hidden rounded-2xl border bg-[#0b0b0b] ${
              isExpanded
                ? "h-full min-h-[280px] flex-1 border-white/12 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]"
                : "w-full border-[#d8d1bc] shadow-[0_18px_36px_rgba(3,10,8,0.22)]"
            }`}
            style={
              isExpanded
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
                fillContainer={isExpanded}
              />
            </AnimatePresence>
          </motion.div>

          {!isExpanded ? (
            <motion.aside
              layout
              role="note"
              aria-label="Aviso metodológico"
              className="mt-3 flex shrink-0 items-start gap-3 rounded-2xl border border-[#e8c98a]/55 bg-gradient-to-br from-[#faf4e6] to-[#f3e6c8] px-4 py-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] sm:gap-3.5 sm:px-5 sm:py-4"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#c9a24d]/45 bg-[#e8c98a] text-[#3d2e12] sm:h-10 sm:w-10">
                <Info className="h-4 w-4 sm:h-[1.125rem] sm:w-[1.125rem]" aria-hidden />
              </span>
              <div className="min-w-0">
                <ScitaMethodologicalNoticeBody variant="footer" />
              </div>
            </motion.aside>
          ) : null}
        </motion.div>
      </motion.div>

      <ScitaDashboardGuideModal isOpen={guideOpen} onClose={() => setGuideOpen(false)} />
    </motion.div>
  );
}
