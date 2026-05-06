"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BarChart3, Filter, LineChart, Map, Table2 } from "lucide-react";

export type ScitaModuleId = "titulacion" | "gobierno" | "conservacion" | "proyectos";

const boardVariants = {
  initial: { opacity: 0, x: 28 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

const transition = { duration: 0.38, ease: [0.22, 1, 0.36, 1] as const };

type BoardConfig = {
  title: string;
  kpi1: { label: string; value: string; unit: string; barPct: number; barClass: string };
  kpi2: { label: string; value: string; unit: string; dotsClass: string };
  chartTitle: string;
  barHeights: number[];
  barGradient: string;
  tableTitle: string;
  rows: { a: string; b: string; bClass: string }[];
};

const BOARDS: Record<ScitaModuleId, BoardConfig> = {
  titulacion: {
    title: "Titulación colectiva",
    kpi1: {
      label: "Área titulada acumulada",
      value: "5.8M",
      unit: "ha",
      barPct: 72,
      barClass: "bg-[#1565c0]",
    },
    kpi2: {
      label: "Consejos comunitarios",
      value: "184",
      unit: "registrados",
      dotsClass: "bg-[#1565c0]",
    },
    chartTitle: "Avance de titulación por región (ejemplo)",
    barHeights: [55, 78, 62, 90, 68, 85, 74],
    barGradient: "bg-gradient-to-t from-[#1565c0] to-[#64b5f6]",
    tableTitle: "Territorios y estado",
    rows: [
      { a: "CC Alto San Juan", b: "Titulado", bClass: "text-[#1565c0]" },
      { a: "Resguardo Naya", b: "En trámite", bClass: "text-[#ca8a04]" },
      { a: "Solicitud conjunta", b: "Revisión", bClass: "text-[#605e5c]" },
    ],
  },
  gobierno: {
    title: "Instrumentos de gobierno propio",
    kpi1: {
      label: "Reglamentos aprobados",
      value: "56",
      unit: "instrumentos",
      barPct: 61,
      barClass: "bg-[#f57f17]",
    },
    kpi2: {
      label: "Planes de etnodesarrollo",
      value: "23",
      unit: "vigentes",
      dotsClass: "bg-[#f57f17]",
    },
    chartTitle: "Implementación por consejo (ejemplo)",
    barHeights: [42, 58, 75, 65, 88, 52, 70],
    barGradient: "bg-gradient-to-t from-[#e65100] to-[#ffb74d]",
    tableTitle: "Instrumentos y seguimiento",
    rows: [
      { a: "Reglamento interno", b: "Publicado", bClass: "text-[#f57f17]" },
      { a: "Plan de vida", b: "Actualización", bClass: "text-[#ca8a04]" },
      { a: "Acuerdo de asamblea", b: "Borrador", bClass: "text-[#605e5c]" },
    ],
  },
  conservacion: {
    title: "Áreas de conservación",
    kpi1: {
      label: "Superficie en conservación",
      value: "2.1M",
      unit: "ha",
      barPct: 68,
      barClass: "bg-[#107c10]",
    },
    kpi2: {
      label: "Figuras y acuerdos",
      value: "94",
      unit: "activos",
      dotsClass: "bg-[#107c10]",
    },
    chartTitle: "Cobertura ecosistémica (ejemplo)",
    barHeights: [52, 78, 61, 88, 55, 92, 70],
    barGradient: "bg-gradient-to-t from-[#107c10] to-[#4ade80]",
    tableTitle: "Áreas y categorías",
    rows: [
      { a: "Reserva Alto San Juan", b: "Nacional", bClass: "text-[#107c10]" },
      { a: "Distrito de uso", b: "Comunitario", bClass: "text-[#2e7d32]" },
      { a: "Corredor", b: "En evaluación", bClass: "text-[#605e5c]" },
    ],
  },
  proyectos: {
    title: "Proyectos del PCN",
    kpi1: {
      label: "Inversión ejecutada",
      value: "128",
      unit: "MM COP",
      barPct: 77,
      barClass: "bg-[#c62828]",
    },
    kpi2: {
      label: "Obras en territorio",
      value: "67",
      unit: "activas",
      dotsClass: "bg-[#c62828]",
    },
    chartTitle: "Ejecución física por proyecto (ejemplo)",
    barHeights: [48, 70, 85, 60, 92, 55, 80],
    barGradient: "bg-gradient-to-t from-[#b71c1c] to-[#ef5350]",
    tableTitle: "Proyectos y avance",
    rows: [
      { a: "Infraestructura vial", b: "En obra", bClass: "text-[#c62828]" },
      { a: "Sistemas de agua", b: "Entregado", bClass: "text-[#2e7d32]" },
      { a: "Centro comunitario", b: "Licitación", bClass: "text-[#ca8a04]" },
    ],
  },
};

function KpiTiles({ cfg }: { cfg: BoardConfig }) {
  return (
    <>
      <div className="min-w-0 rounded-xl border border-black/[0.08] bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="h-2.5 w-36 rounded-full bg-[#edebe9]" aria-hidden />
          <BarChart3 className="h-4 w-4 text-[#107c10]" aria-hidden />
        </div>
        <div className="flex items-baseline gap-2">
          <div className="h-11 w-24 rounded-md bg-[#f3f2f1]" aria-hidden />
          <div className="h-4 w-10 rounded-full bg-[#edebe9]" aria-hidden />
        </div>
        <div className="mt-4 h-2 w-full rounded-full bg-[#edebe9] overflow-hidden">
          <div className={`h-full rounded-full ${cfg.kpi1.barClass}`} style={{ width: `${cfg.kpi1.barPct}%` }} />
        </div>
        <div className="mt-3 h-2 w-64 rounded-full bg-[#edebe9]" aria-hidden />
      </div>

      <div className="min-w-0 rounded-xl border border-black/[0.08] bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="h-2.5 w-32 rounded-full bg-[#edebe9]" aria-hidden />
          <Table2 className="h-4 w-4 text-[#0078d4]" aria-hidden />
        </div>
        <div className="flex items-baseline gap-2">
          <div className="h-11 w-20 rounded-md bg-[#f3f2f1]" aria-hidden />
          <div className="h-4 w-16 rounded-full bg-[#edebe9]" aria-hidden />
        </div>
        <div className="mt-4 flex -space-x-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-8 w-8 rounded-full border-2 border-white ${cfg.kpi2.dotsClass} flex items-center justify-center text-[10px] text-white font-bold`}
            >
              {i}
            </div>
          ))}
          <div className="h-8 w-8 rounded-full border-2 border-white bg-[#edebe9] flex items-center justify-center text-[10px] font-bold text-[#605e5c]">
            +
          </div>
        </div>
      </div>
    </>
  );
}

function ChartAndTable({ cfg }: { cfg: BoardConfig }) {
  return (
    <>
      <div className="lg:col-span-8 rounded-xl border border-black/[0.08] bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="h-2.5 w-52 rounded-full bg-[#edebe9]" aria-hidden />
          <LineChart className="h-4 w-4 text-[#107c10]" aria-hidden />
        </div>
        <div className="flex h-40 items-stretch gap-2 px-1 sm:gap-3">
          {cfg.barHeights.map((h, i) => (
            <div key={i} className="flex min-h-0 min-w-0 flex-1 flex-col items-center justify-end gap-2">
              <div
                className={`w-full max-w-[40px] rounded-t-md ${cfg.barGradient}`}
                style={{ height: `${Math.max(12, Math.round((h / 100) * 140))}px` }}
                aria-hidden
              />
              <div className="h-1.5 w-3 rounded-full bg-[#d2d0ce]" aria-hidden />
            </div>
          ))}
        </div>
      </div>

      <div className="lg:col-span-4 rounded-xl border border-black/[0.08] bg-white p-0 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-[#edebe9] flex items-center justify-between">
          <div className="h-2.5 w-28 rounded-full bg-[#edebe9]" aria-hidden />
          <div className="h-2 w-10 rounded-full bg-[#f3f2f1]" aria-hidden />
        </div>
        <div className="grid gap-2 p-4" aria-hidden>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="grid grid-cols-2 gap-3 rounded-md border border-[#f3f2f1] p-2.5">
              <div className="h-2 rounded-full bg-[#edebe9]" />
              <div className="h-2 rounded-full bg-[#f3f2f1]" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export type ScitaPowerBiBoardDensity = "default" | "compact";

export function ScitaPowerBiBoard({
  moduleId,
  density = "default",
  /** Sin marco, sin rejilla ni sombra — p. ej. SCITA página junto al sidebar. */
  frameless = false,
}: {
  moduleId: ScitaModuleId;
  density?: ScitaPowerBiBoardDensity;
  frameless?: boolean;
}) {
  const cfg = BOARDS[moduleId] ?? BOARDS.titulacion;
  const compact = density === "compact";

  const shellClass = frameless
    ? `relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-none border-0 bg-transparent shadow-none ${
        compact ? "min-h-[280px] sm:min-h-[340px]" : "min-h-[480px]"
      }`
    : `relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[28px] border border-white/10 bg-transparent shadow-2xl ${
        compact ? "min-h-[280px] sm:min-h-[340px]" : "min-h-[480px]"
      }`;

  return (
    <div className={shellClass}>
      {!frameless ?
        (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0 opacity-100"
            style={{
              backgroundImage: `
            radial-gradient(ellipse at 20% 25%, rgba(74, 222, 128, 0.22), transparent 55%),
            radial-gradient(ellipse at 75% 70%, rgba(21, 101, 192, 0.18), transparent 52%),
            linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)
          `,
              backgroundSize: "auto, auto, 34px 34px, 34px 34px",
            }}
          />
        )
      : null}
      <div
        className={`relative z-10 flex items-center justify-between gap-3 px-4 bg-[#2d2d2d] border-b border-black/20 ${
          compact ? "py-2" : "py-2.5"
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="shrink-0 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide bg-[#f2c811] text-[#1a1a1a]">
            Ejemplo
          </span>
          <div className="h-3 w-44 rounded-full bg-white/20" aria-hidden />
        </div>
        <div className="hidden sm:flex items-center gap-2 text-white/70 flex-wrap justify-end">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/90">
            <span className="h-1.5 w-1.5 rounded-full bg-[#f2c811] animate-pulse" />
            Módulo en vista
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] font-medium">
            <Filter className="h-3.5 w-3.5" aria-hidden />
            Filtros
          </span>
          <span className="text-[11px] text-white/45">Visual mock</span>
        </div>
      </div>

      <div
        className={`relative z-10 min-h-0 flex-1 overflow-y-auto ${
          compact ? "p-2 sm:p-3" : "p-4 sm:p-5"
        }`}
      >
        <div className="pointer-events-none absolute inset-x-0 bottom-4 z-0 flex justify-center" aria-hidden>
          <div className="rounded-3xl border border-[#f2c811]/30 bg-black/10 p-5 shadow-2xl">
            <svg viewBox="0 0 120 120" className="h-28 w-28 sm:h-36 sm:w-36">
              <rect x="18" y="42" width="20" height="52" rx="4" fill="#f2c811" />
              <rect x="42" y="28" width="20" height="66" rx="4" fill="#f5d44a" />
              <rect x="66" y="16" width="20" height="78" rx="4" fill="#f8e381" />
              <ellipse cx="52" cy="97" rx="42" ry="8" fill="#00000022" />
            </svg>
          </div>
        </div>
        <div className="mb-3 rounded-xl border border-white/10 bg-black/20 p-3 sm:p-4" aria-hidden>
          <div className="mb-3 flex items-center justify-between">
            <div className="h-2.5 w-28 rounded-full bg-white/25" />
            <Map className="h-4 w-4 text-white/70" />
          </div>
          <svg viewBox="0 0 560 130" className="h-[86px] w-full text-white/50">
            <path d="M32 94 L124 48 L184 78 L258 36 L322 68 L392 42 L520 80 L468 116 L380 106 L294 120 L206 110 L116 118 Z" fill="currentColor" opacity="0.24" />
            <path d="M42 86 L102 70 L172 84 L246 58 L330 74 L428 60 L510 88" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeDasharray="6 7" />
            <circle cx="174" cy="82" r="4.5" fill="#4ade80" />
            <circle cx="330" cy="74" r="4.5" fill="#60a5fa" />
            <circle cx="428" cy="60" r="4.5" fill="#facc15" />
          </svg>
        </div>
        <div className={`grid lg:grid-cols-12 ${compact ? "gap-2 sm:gap-3" : "gap-4"}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${moduleId}-kpis`}
              variants={boardVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={transition}
              className={`lg:col-span-12 lg:row-start-1 grid sm:grid-cols-2 ${compact ? "gap-2 sm:gap-3" : "gap-4"}`}
            >
              <KpiTiles cfg={cfg} />
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${moduleId}-bottom`}
              variants={boardVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={transition}
              className={`lg:col-span-12 lg:row-start-2 grid lg:grid-cols-12 ${compact ? "gap-2 sm:gap-3" : "gap-4"}`}
            >
              <ChartAndTable cfg={cfg} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div
        className={`relative z-10 shrink-0 border-t border-black/[0.08] bg-[#edebe9] px-4 text-center ${
          compact ? "py-2" : "py-3"
        }`}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#605e5c]">
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-sm bg-[#f2c811]" aria-hidden />
            <span className="h-2 w-2 rounded-sm bg-[#107c10]" aria-hidden />
            <span className="h-2 w-2 rounded-sm bg-[#0078d4]" aria-hidden />
            Power BI visual board
          </span>
        </p>
      </div>
    </div>
  );
}
