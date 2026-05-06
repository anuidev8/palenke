"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  ExternalLink,
  FileText,
  FolderKanban,
  Shield,
  TreePine,
} from "lucide-react";
import { ScitaPowerBiBoard, type ScitaModuleId } from "@/components/palenke/ScitaPowerBiBoard";

const MAIN_MODULES: {
  id: ScitaModuleId;
  title: string;
  description: string;
  lightBg: string;
  textColor: string;
  icon: typeof FileText;
}[] = [
  {
    id: "titulacion",
    title: "Titulación colectiva",
    description: "Consejos Comunitarios y territorios colectivos adjudicados.",
    lightBg: "bg-[#e3f2fd]",
    textColor: "text-[#1565c0]",
    icon: FileText,
  },
  {
    id: "gobierno",
    title: "Instrumentos de gobierno propio",
    description: "Reglamentos y planes de etnodesarrollo comunitarios.",
    lightBg: "bg-[#fff3cd]",
    textColor: "text-[#f57f17]",
    icon: Shield,
  },
  {
    id: "conservacion",
    title: "Áreas de conservación",
    description: "Figuras de protección, biodiversidad y cuencas.",
    lightBg: "bg-[#d8f3dc]",
    textColor: "text-[#2e7d32]",
    icon: TreePine,
  },
  {
    id: "proyectos",
    title: "Proyectos del PCN",
    description: "Inversión y seguimiento de obras en territorio.",
    lightBg: "bg-[#fddede]",
    textColor: "text-[#d32f2f]",
    icon: FolderKanban,
  },
];

export type ScitaWorkspacePlacement = "page" | "scrollMorph";

const morphEase = [0.22, 1, 0.36, 1] as const;
const morphDuration = 0.38;

type ScitaWorkspaceProps = {
  fieldReportHref: string;
  geoportalHref: string;
  showGeoportal: boolean;
  placement?: ScitaWorkspacePlacement;
  /** Dentro del runway SCITA con Framer Scroll: tras scroll, ocultar sidebar y dejar solo el tablero. */
  focusBoardOnly?: boolean;
  activeModuleId?: ScitaModuleId;
  onActiveModuleChange?: (id: ScitaModuleId) => void;
};

export function ScitaWorkspace({
  fieldReportHref,
  geoportalHref,
  showGeoportal,
  placement = "page",
  focusBoardOnly = false,
  activeModuleId: controlledModuleId,
  onActiveModuleChange,
}: ScitaWorkspaceProps) {
  const [internalModuleId, setInternalModuleId] = useState<ScitaModuleId>("titulacion");
  const activeModuleId = controlledModuleId ?? internalModuleId;
  const setActiveModuleId = onActiveModuleChange ?? setInternalModuleId;

  const isMorph = placement === "scrollMorph";
  const boardFocus = isMorph && focusBoardOnly;
  const onDarkSurface = placement === "page";

  const rootCls = isMorph
    ? "flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-[#f8f5f2] lg:flex-row"
    : "flex min-h-[calc(100vh-4rem)] flex-col bg-transparent lg:flex-row";

  const sidebarHeaderCls = `border-b px-6 py-8 sm:px-8 sm:py-10 ${
    onDarkSurface ? "border-white/10" : "border-[#e8dfd3]"
  }`;
  const sidebarScrollCls = "flex-1 overflow-y-auto p-6 sm:p-8";

  const boardShellCls =
    boardFocus ?
      "relative flex min-h-0 flex-1 flex-col bg-[#1a1a1a] p-2 sm:p-4 lg:h-full lg:min-h-0 lg:w-full"
    : isMorph ?
      "relative flex min-h-0 flex-1 flex-col bg-[#1a1a1a] p-4 sm:p-6 lg:h-full lg:min-h-0 lg:w-[60%] xl:w-[65%]"
    : "relative flex min-h-[800px] w-full flex-col bg-transparent p-4 sm:p-6 lg:min-h-0 lg:w-[60%] xl:w-[65%]";

  const renderSidebarInner = () => {
    /** Vista página (superficie oscura): alineado al mock lateral — solo módulos + alerta + SIG. */
    if (onDarkSurface) {
      return (
        <div className="flex flex-1 flex-col overflow-y-auto p-6 sm:p-8">
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="font-display text-xl font-semibold tracking-tight text-white md:text-2xl">Módulos principales</h2>
              <p className="mt-1 text-sm text-white/65">Selecciona un tema para resaltar capas relacionadas en el mapa.</p>
            </div>

            <nav aria-label="Módulos SCITA" className="flex flex-col gap-4">
              {MAIN_MODULES.map((mod) => {
                const Icon = mod.icon;
                const selected = mod.id === activeModuleId;
                return (
                  <motion.button
                    key={mod.id}
                    type="button"
                    layout
                    onClick={() => setActiveModuleId(mod.id)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    transition={{ type: "spring", stiffness: 480, damping: 28 }}
                    className={`group relative flex items-start gap-3 rounded-2xl border p-4 text-left shadow-sm transition-colors ${
                      selected
                        ? "border-amber-400/70 bg-white/12 ring-1 ring-amber-400/45"
                        : "border-white/15 bg-black/15 hover:border-emerald-400/35 hover:bg-black/25"
                    }`}
                    aria-pressed={selected}
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        selected ? "bg-white/20" : mod.lightBg
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${selected ? "text-white" : mod.textColor}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display text-lg font-bold leading-snug text-white">{mod.title}</h3>
                      <p className="mt-1 text-sm leading-snug text-white/65">{mod.description}</p>
                    </div>
                    <ChevronRight className={`mt-1 h-5 w-5 shrink-0 ${selected ? "text-amber-200" : "text-white/35"}`} aria-hidden />
                  </motion.button>
                );
              })}
            </nav>

            <Link
              href={fieldReportHref}
              className="group flex flex-col gap-3 rounded-2xl border-2 border-[#8b4a2f]/60 bg-gradient-to-br from-[#c4713d] to-[#9a4a2c] p-4 shadow-lg transition hover:border-[#fbc02d]/40 hover:shadow-xl"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20">
                  <AlertTriangle className="h-5 w-5 text-white" aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-lg font-bold text-white">Crear reporte de alerta</h3>
                  <p className="mt-1 text-sm text-white/90">Registra amenazas o novedades desde el territorio.</p>
                </div>
              </div>
              <span className="inline-flex items-center justify-center gap-2 rounded-full bg-white/95 px-4 py-2.5 text-sm font-bold text-[#7a3b24] transition group-hover:bg-white">
                Ir al formulario
                <ExternalLink className="h-4 w-4 shrink-0" />
              </span>
            </Link>

            {showGeoportal ?
              <Link
                href={geoportalHref}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-4 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/18"
              >
                Abrir SIG completo
                <ExternalLink className="h-4 w-4 shrink-0" />
              </Link>
            : null}
          </div>
        </div>
      );
    }

    return (
      <>
        <div className={sidebarHeaderCls}>
          <span className="mb-4 inline-block rounded-full bg-[#e8dfd3] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#4a4540]">
            Sistema de Información Territorial
          </span>
          <h1 className="font-display text-4xl text-[#1a1a1a] sm:text-5xl">SCITA</h1>
          <p className="mt-4 text-base leading-relaxed text-[#4a4540]">
            El SCITA es la infraestructura de información territorial del Palenke. Selecciona un módulo para explorar sus
            datos geoespaciales y analíticas.
          </p>
        </div>

        <div className={sidebarScrollCls}>
          <h2 className="font-display mb-5 text-xl text-[#1a1a1a]">Módulos principales</h2>
          <div className="grid grid-cols-1 gap-4">
            {MAIN_MODULES.map((mod) => {
              const Icon = mod.icon;
              const selected = mod.id === activeModuleId;
              return (
                <motion.button
                  key={mod.id}
                  type="button"
                  layout
                  onClick={() => setActiveModuleId(mod.id)}
                  whileTap={{ scale: 0.99 }}
                  transition={{ type: "spring", stiffness: 520, damping: 32 }}
                  className={`group relative flex items-start gap-4 rounded-2xl border p-5 text-left transition-colors ${
                    selected
                      ? "border-[#1a1a1a] bg-[#1a1a1a] shadow-md"
                      : "border-[#e8dfd3] bg-white hover:border-[#d0c5b5] hover:bg-[#faf9f8]"
                  }`}
                  aria-pressed={selected}
                >
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                      selected ? "bg-white/10" : mod.lightBg
                    }`}
                  >
                    <Icon className={`h-6 w-6 ${selected ? "text-white" : mod.textColor}`} />
                  </div>
                  <div className="flex-1 pr-6">
                    <h3 className={`font-display text-lg ${selected ? "text-white" : "text-[#1a1a1a]"}`}>{mod.title}</h3>
                    <p className={`mt-1 text-sm leading-snug ${selected ? "text-white/70" : "text-[#736d65]"}`}>{mod.description}</p>
                  </div>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100">
                    <ChevronRight className={`h-5 w-5 ${selected ? "text-white" : "text-[#a39a8c]"}`} />
                  </div>
                </motion.button>
              );
            })}
          </div>

          <div className="mt-8 grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2">
            <div className="flex h-full min-w-0 flex-col justify-between gap-4 rounded-2xl border border-[#e8dfd3] bg-[#f8f5f2] p-4 shadow-sm sm:p-5">
              <div>
                <h3 className="font-display text-sm leading-snug text-[#1a1a1a] sm:text-base">Enviar información de campo</h3>
                <p className="mt-2 text-xs leading-relaxed text-[#4a4540] sm:text-sm">
                  Registra alertas territoriales o amenazas desde tu comunidad.
                </p>
              </div>
              <Link
                href={fieldReportHref}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1b5e20] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#2e7d32] sm:w-fit sm:justify-start sm:text-sm"
              >
                Crear reporte
                <ArrowRight className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
              </Link>
            </div>

            <div className="relative flex h-full min-w-0 flex-col justify-between gap-4 overflow-hidden rounded-2xl border border-[#4ade80]/35 bg-[#2e7d32] p-4 shadow-md sm:p-5">
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
              <div className="relative z-10">
                <h3 className="font-display text-sm leading-snug text-white sm:text-base">Interactúa con el territorio</h3>
                <p className="mt-2 text-xs text-white/85 sm:text-sm">
                  Abre el visor en pantalla completa para explorar datos avanzados y herramientas de medición.
                </p>
              </div>
              <div className="relative z-10">
                {showGeoportal ? (
                  <Link
                    href={geoportalHref}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-bold text-[#1b5e20] transition hover:bg-white/90 sm:w-fit sm:justify-start sm:text-sm"
                  >
                    <span className="truncate">Abrir SIG completo</span>
                    <ExternalLink className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
                  </Link>
                ) : (
                  <div className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-black/25 px-4 py-2.5 text-xs font-bold text-white/60 sm:w-fit sm:justify-start sm:text-sm">
                    Acceso restringido
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const sidebarMorph = (
    <AnimatePresence initial={false}>
      {!boardFocus && (
        <motion.aside
          key="scita-pin-sidebar"
          layout
          className="flex min-h-0 w-full shrink-0 flex-col overflow-hidden border-[#e8dfd3] bg-white lg:flex-[0_0_40%] lg:max-w-[40%] lg:border-r xl:flex-[0_0_35%] xl:max-w-[35%]"
          initial={false}
          exit={{ opacity: 0 }}
          transition={{ duration: morphDuration, ease: morphEase }}
        >
          {renderSidebarInner()}
        </motion.aside>
      )}
    </AnimatePresence>
  );

  const sidebarPage = (
    <div
      className={`flex w-full flex-col border-r lg:w-[40%] xl:w-[35%] ${
        onDarkSurface ? "border-white/10 bg-black/20 backdrop-blur-md" : "border-[#e8dfd3] bg-transparent"
      }`}
    >
      {renderSidebarInner()}
    </div>
  );

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.985, y: 22 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.985, y: 22 }}
      transition={{ duration: morphDuration, ease: morphEase }}
      className={rootCls}
    >
      {placement === "scrollMorph" ? sidebarMorph : sidebarPage}

      <motion.div layout transition={{ duration: morphDuration * 0.85, ease: morphEase }} className={boardShellCls}>
        <ScitaPowerBiBoard
          moduleId={activeModuleId}
          density={boardFocus ? "compact" : "default"}
          frameless={onDarkSurface}
        />
      </motion.div>
    </motion.div>
  );
}
