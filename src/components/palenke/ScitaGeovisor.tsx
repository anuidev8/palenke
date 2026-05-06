"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  BarChart3,
  Compass,
  LayoutGrid,
  Map as MapIcon,
  Maximize2,
  Menu,
  Minimize2,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import {
  ScitaPowerBiBoard,
  type ScitaModuleId,
} from "@/components/palenke/ScitaPowerBiBoard";
import {
  MAP_LAYER_OPTIONS,
  ScitaTerritorialMapCanvas,
  type MapLayerId,
} from "@/components/palenke/ScitaTerritorialMapCanvas";

/** Thematic boards — alineado a lineamientos biblioteca / SIG del MVP (propuesta fases). */
const POWER_BI_MODULES: { id: ScitaModuleId; label: string; hint: string }[] = [
  {
    id: "titulacion",
    label: "Titulación colectiva",
    hint: "Seguimiento a titulación y territorios colectivos",
  },
  {
    id: "gobierno",
    label: "Instrumentos de gobierno propio",
    hint: "Reglamentos, planes de vida y etnodesarrollo",
  },
  {
    id: "conservacion",
    label: "Áreas de conservación",
    hint: "Figuras de conservación y acuerdos comunitarios",
  },
  {
    id: "proyectos",
    label: "Proyectos del PCN",
    hint: "Inversión y ejecución en territorio",
  },
];

interface ScitaGeovisorProps {
  fullScreenLabel?: string;
}

export function ScitaGeovisor({
  fullScreenLabel = "Expandir vista",
}: ScitaGeovisorProps) {
  /** Vista principal: mapa (croquis) o tableros Power BI por tema. */
  const [surface, setSurface] = useState<"map" | "powerbi">("map");
  const [moduleId, setModuleId] = useState<ScitaModuleId>("titulacion");
  const [activeMapLayers, setActiveMapLayers] = useState<MapLayerId[]>([
    "acc",
    "forest",
    "water",
  ]);

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const enterFullScreen = useCallback(async () => {
    setIsFullScreen(true);
    setSidebarOpen(false);
    if (typeof document !== "undefined" && containerRef.current) {
      try {
        if (document.fullscreenEnabled && !document.fullscreenElement) {
          await containerRef.current.requestFullscreen();
        }
      } catch {
        // Fallback: CSS full-viewport mode.
      }
    }
  }, []);

  const exitFullScreen = useCallback(async () => {
    setIsFullScreen(false);
    if (typeof document !== "undefined" && document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const onChange = () => {
      if (!document.fullscreenElement) setIsFullScreen(false);
    };
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onResize = () => {
      if (window.innerWidth >= 1024) setMobileSidebarOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const containerClass = isFullScreen
    ? "fixed inset-0 z-[80] flex h-screen w-screen flex-col bg-white"
    : "relative flex h-[min(820px,88vh)] min-h-[560px] w-full max-w-none flex-col overflow-hidden border-y border-[#e8dfd3] bg-white shadow-sm sm:min-h-[620px]";

  const headline =
    surface === "map"
      ? "GeoVisor territorial (vista parcial curada)"
      : `Tableros — ${POWER_BI_MODULES.find((m) => m.id === moduleId)?.label ?? ""}`;

  return (
    <section className={isFullScreen ? "" : "w-full max-w-none px-0 py-3 sm:py-4"}>
      <div ref={containerRef} className={containerClass}>
        {mobileSidebarOpen ? (
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setMobileSidebarOpen(false)}
            className="absolute inset-0 z-30 bg-black/40 lg:hidden"
          />
        ) : null}

        <div className="flex min-h-0 flex-1">
          <aside
            className={[
              "z-40 flex w-[min(100vw-3rem,18rem)] shrink-0 flex-col border-r border-[#e8dfd3] bg-white sm:w-72",
              "transition-[width,transform] duration-200",
              sidebarOpen ? "lg:w-72" : "lg:w-0 lg:overflow-hidden lg:border-r-0",
              "absolute inset-y-0 left-0 lg:static",
              mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
            ].join(" ")}
          >
            <div className="flex items-center justify-between gap-2 border-b border-[#e8dfd3] px-4 py-3">
              <div className="flex min-w-0 items-center gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#d8f3dc]">
                  <Compass className="h-4 w-4 text-[#2e7d32]" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7a756e]">
                    SCITA
                  </p>
                  <p className="truncate text-sm font-semibold text-[#1a1a1a]">GeoVisor</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(false)}
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[#7a756e] hover:bg-[#f1ece4] lg:hidden"
                aria-label="Cerrar panel"
              >
                <span className="text-lg leading-none">×</span>
              </button>
            </div>

            <div className="border-b border-[#e8dfd3] px-3 py-3">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#7a756e]">
                Elige una vista
              </p>
              <div className="grid grid-cols-2 gap-1.5 rounded-xl bg-[#f8f5f2] p-1">
                <button
                  type="button"
                  onClick={() => {
                    setSurface("map");
                    setMobileSidebarOpen(false);
                  }}
                  className={[
                    "flex items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-[11px] font-semibold transition",
                    surface === "map"
                      ? "bg-white text-[#1b5e20] shadow-sm"
                      : "text-[#4a4540] hover:bg-white/70",
                  ].join(" ")}
                >
                  <MapIcon className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  Mapa
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSurface("powerbi");
                    setMobileSidebarOpen(false);
                  }}
                  className={[
                    "flex items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-[11px] font-semibold transition",
                    surface === "powerbi"
                      ? "bg-white text-[#1b5e20] shadow-sm"
                      : "text-[#4a4540] hover:bg-white/70",
                  ].join(" ")}
                >
                  <LayoutGrid className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  Tableros
                </button>
              </div>
            </div>

            <nav className="flex-1 overflow-y-auto px-2 py-2" aria-label="Módulos">
              {surface === "powerbi" ? (
                <ul className="space-y-0.5">
                  {POWER_BI_MODULES.map((m) => {
                    const active = moduleId === m.id;
                    return (
                      <li key={m.id}>
                        <button
                          type="button"
                          onClick={() => {
                            setModuleId(m.id);
                            setMobileSidebarOpen(false);
                          }}
                          className={[
                            "flex w-full flex-col gap-0.5 rounded-lg px-2.5 py-2 text-left text-[12px] transition",
                            active
                              ? "bg-[#d8f3dc] font-semibold text-[#1b5e20]"
                              : "text-[#4a4540] hover:bg-[#f1ece4]",
                          ].join(" ")}
                          aria-current={active ? "true" : undefined}
                        >
                          <span className="flex items-center gap-2">
                            <BarChart3
                              className={[
                                "h-4 w-4 shrink-0",
                                active ? "text-[#2e7d32]" : "text-[#7a756e]",
                              ].join(" ")}
                              aria-hidden
                            />
                            <span className="flex-1 leading-snug">{m.label}</span>
                          </span>
                          <span className="pl-6 text-[10px] font-normal leading-tight text-[#7a756e]">
                            {m.hint}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="space-y-3 px-2 py-2">
                  <div className="rounded-lg border border-[#e8dfd3] bg-[#f8f5f2] px-3 py-2.5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#7a756e]">
                      Capas de información (prioritarias)
                    </p>
                    <p className="mt-1 text-[10px] leading-relaxed text-[#7a756e]">
                      Vista parcial del SCITA. El catálogo completo y herramientas avanzadas están
                      en el geoportal SIG.
                    </p>
                  </div>

                  <ul className="space-y-1">
                    {MAP_LAYER_OPTIONS.map((layer) => {
                      const active = activeMapLayers.includes(layer.id);
                      return (
                        <li key={layer.id}>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMapLayers((prev) =>
                                prev.includes(layer.id)
                                  ? prev.filter((id) => id !== layer.id)
                                  : [...prev, layer.id]
                              );
                            }}
                            className={[
                              "flex w-full items-start gap-2 rounded-lg px-2.5 py-2 text-left transition",
                              active
                                ? "bg-[#d8f3dc] text-[#1b5e20]"
                                : "bg-white text-[#4a4540] hover:bg-[#f1ece4]",
                            ].join(" ")}
                            aria-pressed={active}
                          >
                            <span
                              className={[
                                "mt-0.5 inline-flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded border text-[10px] font-bold",
                                active
                                  ? "border-[#1b5e20] bg-[#1b5e20] text-white"
                                  : "border-[#cfc7bb] bg-white text-transparent",
                              ].join(" ")}
                              aria-hidden
                            >
                              ✓
                            </span>
                            <span className="min-w-0">
                              <span className="block text-[11px] font-semibold leading-snug">{layer.label}</span>
                              <span className="block text-[10px] leading-tight text-[#7a756e]">{layer.hint}</span>
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </nav>

            <div className="border-t border-[#e8dfd3] px-4 py-3">
              <p className="text-[10px] leading-4 text-[#7a756e]">
                MVP — estadísticas embebidas (Power BI) y geovisor como integración (
                <span className="font-semibold text-[#4a4540]">propuesta operativa Palenke</span>
                ).
              </p>
            </div>
          </aside>

          <div className="flex min-w-0 flex-1 flex-col bg-[#f8f5f2]">
            <header className="flex items-center gap-2 border-b border-[#e8dfd3] bg-white px-3 py-2.5 sm:px-4">
              <button
                type="button"
                onClick={() => setSidebarOpen((v) => !v)}
                className="hidden h-9 w-9 items-center justify-center rounded-lg text-[#4a4540] hover:bg-[#f1ece4] lg:inline-flex"
                aria-label={sidebarOpen ? "Ocultar panel" : "Mostrar panel"}
              >
                {sidebarOpen ? (
                  <PanelLeftClose className="h-4.5 w-4.5" aria-hidden />
                ) : (
                  <PanelLeftOpen className="h-4.5 w-4.5" aria-hidden />
                )}
              </button>

              <button
                type="button"
                onClick={() => setMobileSidebarOpen(true)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[#4a4540] hover:bg-[#f1ece4] lg:hidden"
                aria-label="Abrir panel"
              >
                <Menu className="h-4.5 w-4.5" aria-hidden />
              </button>

              <div className="flex min-w-0 flex-1 items-center gap-2">
                <Compass className="h-4 w-4 shrink-0 text-[#2e7d32]" aria-hidden />
                <div className="min-w-0">
                  <p className="truncate text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7a756e]">
                    SCITA · {surface === "map" ? "GeoVisor" : "Estadísticas y tableros"}
                  </p>
                  <p className="truncate text-sm font-semibold text-[#1a1a1a]">{headline}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={isFullScreen ? exitFullScreen : enterFullScreen}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#2e7d32] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#1b5e20]"
              >
                {isFullScreen ? (
                  <>
                    <Minimize2 className="h-3.5 w-3.5" aria-hidden />
                    <span className="hidden sm:inline">Salir pantalla completa</span>
                    <span className="sm:hidden">Salir</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="h-3.5 w-3.5" aria-hidden />
                    <span className="hidden sm:inline">{fullScreenLabel}</span>
                    <span className="sm:hidden">Expandir</span>
                  </>
                )}
              </button>
            </header>

            <div className="relative min-h-0 flex-1 overflow-hidden bg-[#f1ece4]">
              {surface === "map" ? (
                <ScitaTerritorialMapCanvas isFullScreen={isFullScreen} activeLayers={activeMapLayers} />
              ) : (
                <div className="h-full min-h-0 overflow-auto p-3 sm:p-4">
                  <ScitaPowerBiBoard moduleId={moduleId} density="compact" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
