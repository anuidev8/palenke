"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
} from "react";
import {
  AlertTriangle,
  BarChart3,
  ChevronDown,
  ChevronRight,
  Compass,
  FileBarChart,
  Filter,
  Info,
  Landmark,
  Layers,
  Map as MapIcon,
  Maximize2,
  Menu,
  Minimize2,
  PanelLeftClose,
  PanelLeftOpen,
  RefreshCw,
  RotateCcw,
  Scale,
  Search,
  X,
} from "lucide-react";

// ── Power BI embed configuration (replace embedUrl with the real report URL later) ──
const POWER_BI_CONFIG = {
  title: "Geovisor territorial — Pacífico colombiano",
  reportName: "Informe SCITA",
  // Placeholder Power BI embed URL — swap for the real report URL later.
  embedUrl:
    "https://app.powerbi.com/view?r=eyJrIjoiMDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMDAwIiwidCI6IjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMCJ9",
};

type IconType = ComponentType<{
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}>;

type SidebarItem = {
  id: string;
  label: string;
  badge?: string;
  icon?: IconType;
};

type SidebarGroupDef = {
  id: string;
  label: string;
  icon: IconType;
  defaultOpen?: boolean;
  items: SidebarItem[];
};

const SIDEBAR_GROUPS: SidebarGroupDef[] = [
  {
    id: "geovisor",
    label: "GeoVisor",
    icon: MapIcon,
    defaultOpen: true,
    items: [
      { id: "geo-mapa", label: "Mapa territorial" },
      { id: "geo-capas", label: "Capas activas", badge: "4" },
      { id: "geo-zonas", label: "Zonas de uso" },
    ],
  },
  {
    id: "alertas",
    label: "Gestión de Alertas",
    icon: AlertTriangle,
    items: [
      { id: "al-bandeja", label: "Bandeja de alertas", badge: "3" },
      { id: "al-historico", label: "Histórico" },
      { id: "al-mapa", label: "Mapa de alertas" },
    ],
  },
  {
    id: "demandas",
    label: "Demandas Territoriales",
    icon: Scale,
    items: [
      { id: "dt-vigentes", label: "Casos vigentes" },
      { id: "dt-archivo", label: "Archivo de demandas" },
    ],
  },
  {
    id: "gobernanza",
    label: "Gobernanza Territorial",
    icon: Landmark,
    items: [
      { id: "gob-consejos", label: "Consejos comunitarios" },
      { id: "gob-instrumentos", label: "Instrumentos" },
    ],
  },
  {
    id: "consultas",
    label: "Consultas y Reportes",
    icon: FileBarChart,
    items: [
      { id: "cr-consultas", label: "Consultas guardadas" },
      { id: "cr-reportes", label: "Reportes generados" },
      { id: "cr-export", label: "Exportar datos" },
    ],
  },
  {
    id: "stats",
    label: "Estadísticas",
    icon: BarChart3,
    items: [
      { id: "st-territorio", label: "Por territorio" },
      { id: "st-tendencias", label: "Tendencias" },
    ],
  },
];

type LayerChip = {
  id: string;
  label: string;
  color: string;
  active: boolean;
};

const INITIAL_LAYERS: LayerChip[] = [
  { id: "acc", label: "Áreas de conservación", color: "#2e7d32", active: true },
  { id: "hidrica", label: "Info hídrica", color: "#1565c0", active: true },
  { id: "fauna", label: "Fauna y flora", color: "#43a047", active: false },
  { id: "bosque", label: "Cobertura boscosa", color: "#1b5e20", active: true },
  { id: "infra", label: "Infraestructura", color: "#f57f17", active: false },
  { id: "alertas", label: "Alertas ambientales", color: "#d32f2f", active: false },
  { id: "uso", label: "Zonas de uso", color: "#a06e1f", active: false },
];

const TERRITORIES = [
  "Todos los territorios",
  "Consejo Comunitario Mayor del Atrato",
  "Consejo Comunitario La Plata Bahía Málaga",
  "Consejo Comunitario Yurumanguí",
  "Cuenca del río San Juan",
];

const CATEGORIES = [
  "Todas las categorías",
  "Ambiental",
  "Cultural",
  "Hidrográfico",
  "Productivo",
];

type FeaturePreview = {
  id: string;
  name: string;
  type: string;
  area: string;
  council: string;
  updated: string;
};

const FEATURE_SAMPLE: FeaturePreview[] = [
  {
    id: "feat-acc-01",
    name: "ACC Cabeceras del Yurumanguí",
    type: "Área de conservación comunitaria",
    area: "12.430 ha",
    council: "CC Yurumanguí",
    updated: "2026-04-22",
  },
  {
    id: "feat-acc-02",
    name: "Reserva hídrica Río Munguidó",
    type: "Reserva hídrica",
    area: "3.880 ha",
    council: "CC Mayor del Atrato",
    updated: "2026-03-14",
  },
];

interface ScitaGeovisorProps {
  fullScreenLabel?: string;
}

export function ScitaGeovisor({
  fullScreenLabel = "Expandir vista",
}: ScitaGeovisorProps) {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(SIDEBAR_GROUPS.map((g) => [g.id, Boolean(g.defaultOpen)])),
  );
  const [activeItemId, setActiveItemId] = useState<string>("geo-mapa");
  const [layers, setLayers] = useState<LayerChip[]>(INITIAL_LAYERS);
  const [territory, setTerritory] = useState(TERRITORIES[0]);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [search, setSearch] = useState("");

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [activeFeature, setActiveFeature] = useState<FeaturePreview | null>(
    FEATURE_SAMPLE[0],
  );

  const containerRef = useRef<HTMLDivElement>(null);

  const activeLayers = useMemo(() => layers.filter((l) => l.active), [layers]);

  const toggleGroup = useCallback((id: string) => {
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const toggleLayer = useCallback((id: string) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, active: !l.active } : l)),
    );
  }, []);

  const resetFilters = useCallback(() => {
    setLayers(INITIAL_LAYERS);
    setTerritory(TERRITORIES[0]);
    setCategory(CATEGORIES[0]);
    setSearch("");
  }, []);

  const refreshReport = useCallback(() => {
    setIframeKey((k) => k + 1);
  }, []);

  const enterFullScreen = useCallback(async () => {
    setIsFullScreen(true);
    setSidebarOpen(false);
    if (typeof document !== "undefined" && containerRef.current) {
      try {
        if (document.fullscreenEnabled && !document.fullscreenElement) {
          await containerRef.current.requestFullscreen();
        }
      } catch {
        // Fallback: CSS full-viewport mode already handles this.
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

  // Sync with browser fullscreen exit (Esc key).
  useEffect(() => {
    if (typeof document === "undefined") return;
    const onChange = () => {
      if (!document.fullscreenElement) {
        setIsFullScreen(false);
      }
    };
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  // Close mobile drawer on resize to desktop.
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
    : "relative flex h-[760px] max-h-[85vh] flex-col overflow-hidden rounded-[24px] border border-[#e8dfd3] bg-white shadow-sm";

  return (
    <section
      className={isFullScreen ? "" : "mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8"}
    >
      <div ref={containerRef} className={containerClass}>
        {/* ── Mobile drawer overlay ── */}
        {mobileSidebarOpen ? (
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setMobileSidebarOpen(false)}
            className="absolute inset-0 z-30 bg-black/40 lg:hidden"
          />
        ) : null}

        <div className="flex min-h-0 flex-1">
          {/* ── Sidebar ── */}
          <Sidebar
            isDesktopOpen={sidebarOpen}
            isMobileOpen={mobileSidebarOpen}
            onCloseMobile={() => setMobileSidebarOpen(false)}
            openGroups={openGroups}
            toggleGroup={toggleGroup}
            activeItemId={activeItemId}
            onSelectItem={(id) => {
              setActiveItemId(id);
              setMobileSidebarOpen(false);
            }}
            search={search}
            onSearch={setSearch}
          />

          {/* ── Main area ── */}
          <div className="flex min-w-0 flex-1 flex-col bg-[#f8f5f2]">
            {/* Toolbar */}
            <header className="flex items-center gap-2 border-b border-[#e8dfd3] bg-white px-3 py-2.5 sm:px-4">
              {/* Sidebar toggle (desktop) */}
              <button
                type="button"
                onClick={() => setSidebarOpen((v) => !v)}
                className="hidden h-9 w-9 items-center justify-center rounded-lg text-[#4a4540] hover:bg-[#f1ece4] lg:inline-flex"
                aria-label={sidebarOpen ? "Ocultar panel" : "Mostrar panel"}
              >
                {sidebarOpen ? (
                  <PanelLeftClose className="h-4.5 w-4.5" aria-hidden="true" />
                ) : (
                  <PanelLeftOpen className="h-4.5 w-4.5" aria-hidden="true" />
                )}
              </button>

              {/* Mobile menu toggle */}
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(true)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[#4a4540] hover:bg-[#f1ece4] lg:hidden"
                aria-label="Abrir panel de navegación"
              >
                <Menu className="h-4.5 w-4.5" aria-hidden="true" />
              </button>

              {/* Breadcrumb / title */}
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <Compass className="h-4 w-4 shrink-0 text-[#2e7d32]" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="truncate text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7a756e]">
                    SCITA · GeoVisor
                  </p>
                  <p className="truncate text-sm font-semibold text-[#1a1a1a]">
                    {POWER_BI_CONFIG.title}
                  </p>
                </div>
              </div>

              {/* Quick actions */}
              <div className="flex items-center gap-1.5">
                <ToolbarButton
                  icon={RefreshCw}
                  label="Refrescar vista"
                  onClick={refreshReport}
                />
                <ToolbarButton
                  icon={RotateCcw}
                  label="Restablecer filtros"
                  onClick={resetFilters}
                />
                <button
                  type="button"
                  onClick={isFullScreen ? exitFullScreen : enterFullScreen}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#2e7d32] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#1b5e20]"
                >
                  {isFullScreen ? (
                    <>
                      <Minimize2 className="h-3.5 w-3.5" aria-hidden="true" />
                      <span className="hidden sm:inline">Salir pantalla completa</span>
                      <span className="sm:hidden">Salir</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
                      <span className="hidden sm:inline">{fullScreenLabel}</span>
                      <span className="sm:hidden">Expandir</span>
                    </>
                  )}
                </button>
              </div>
            </header>

            {/* Filter / control bar */}
            <div className="flex flex-wrap items-center gap-2 border-b border-[#e8dfd3] bg-white px-3 py-2.5 sm:px-4">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7a756e]">
                <Filter className="h-3.5 w-3.5" aria-hidden="true" />
                Filtros
              </div>

              <FilterSelect
                label="Territorio"
                value={territory}
                onChange={setTerritory}
                options={TERRITORIES}
              />
              <FilterSelect
                label="Categoría"
                value={category}
                onChange={setCategory}
                options={CATEGORIES}
              />

              <div className="ml-auto flex flex-wrap items-center gap-1.5">
                {layers.map((layer) => (
                  <button
                    key={layer.id}
                    type="button"
                    onClick={() => toggleLayer(layer.id)}
                    className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition"
                    style={{
                      borderColor: layer.active ? layer.color : "#e8dfd3",
                      background: layer.active ? `${layer.color}14` : "white",
                      color: layer.active ? layer.color : "#7a756e",
                    }}
                    aria-pressed={layer.active}
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{
                        background: layer.active ? layer.color : "#cfc7bb",
                      }}
                      aria-hidden="true"
                    />
                    {layer.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Power BI iframe area */}
            <div className="relative min-h-0 flex-1 bg-[#f1ece4]">
              <iframe
                key={iframeKey}
                title={POWER_BI_CONFIG.reportName}
                src={POWER_BI_CONFIG.embedUrl}
                allowFullScreen
                className="h-full w-full border-0"
              />

              {/* Floating active layers indicator */}
              <div className="pointer-events-none absolute left-4 top-4 z-10 max-w-[260px] rounded-2xl border border-[#e8dfd3] bg-white/95 p-3 shadow-md backdrop-blur-sm">
                <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#7a756e]">
                  <Layers className="h-3 w-3" aria-hidden="true" />
                  Capas activas
                  <span className="ml-auto rounded-full bg-[#2e7d32] px-1.5 py-0.5 text-[10px] text-white">
                    {activeLayers.length}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {activeLayers.length === 0 ? (
                    <p className="text-[11px] text-[#7a756e]">Sin capas activas</p>
                  ) : (
                    activeLayers.map((l) => (
                      <span
                        key={l.id}
                        className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                        style={{ background: `${l.color}1a`, color: l.color }}
                      >
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ background: l.color }}
                          aria-hidden="true"
                        />
                        {l.label}
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Floating feature info card */}
              {activeFeature ? (
                <div className="absolute right-4 top-4 z-10 w-[280px] rounded-2xl border border-[#e8dfd3] bg-white p-4 shadow-lg">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#d8f3dc]">
                        <Info className="h-3.5 w-3.5 text-[#2e7d32]" aria-hidden="true" />
                      </span>
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7a756e]">
                        Selección
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveFeature(null)}
                      aria-label="Cerrar"
                      className="rounded-md p-1 text-[#7a756e] hover:bg-[#f1ece4]"
                    >
                      <X className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                  <p className="text-sm font-semibold text-[#1a1a1a]">
                    {activeFeature.name}
                  </p>
                  <p className="mt-0.5 text-[11px] text-[#7a756e]">{activeFeature.type}</p>
                  <dl className="mt-3 space-y-1.5 text-[11px]">
                    <DataRow label="Área" value={activeFeature.area} />
                    <DataRow label="Consejo" value={activeFeature.council} />
                    <DataRow label="Actualizado" value={activeFeature.updated} />
                  </dl>
                  {FEATURE_SAMPLE.length > 1 ? (
                    <div className="mt-3 flex gap-1">
                      {FEATURE_SAMPLE.map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => setActiveFeature(f)}
                          className="h-1.5 flex-1 rounded-full transition"
                          style={{
                            background:
                              f.id === activeFeature.id ? "#2e7d32" : "#e8dfd3",
                          }}
                          aria-label={`Ver ${f.name}`}
                        />
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setActiveFeature(FEATURE_SAMPLE[0])}
                  className="absolute right-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full border border-[#e8dfd3] bg-white px-3 py-1.5 text-[11px] font-semibold text-[#4a4540] shadow-sm hover:bg-[#f1ece4]"
                >
                  <Info className="h-3.5 w-3.5" aria-hidden="true" />
                  Mostrar selección
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Sidebar({
  isDesktopOpen,
  isMobileOpen,
  onCloseMobile,
  openGroups,
  toggleGroup,
  activeItemId,
  onSelectItem,
  search,
  onSearch,
}: {
  isDesktopOpen: boolean;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  openGroups: Record<string, boolean>;
  toggleGroup: (id: string) => void;
  activeItemId: string;
  onSelectItem: (id: string) => void;
  search: string;
  onSearch: (value: string) => void;
}) {
  return (
    <aside
      className={[
        "z-40 flex w-72 shrink-0 flex-col border-r border-[#e8dfd3] bg-white",
        // Desktop: animated width collapse
        "transition-[width,transform] duration-200",
        isDesktopOpen ? "lg:w-72" : "lg:w-0 lg:overflow-hidden lg:border-r-0",
        // Mobile: drawer
        "absolute inset-y-0 left-0 lg:static",
        isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
      ].join(" ")}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-[#e8dfd3] px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#d8f3dc]">
            <MapIcon className="h-4 w-4 text-[#2e7d32]" aria-hidden="true" />
          </span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7a756e]">
              SCITA
            </p>
            <p className="text-sm font-semibold text-[#1a1a1a]">GeoVisor</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onCloseMobile}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#7a756e] hover:bg-[#f1ece4] lg:hidden"
          aria-label="Cerrar"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {/* Search */}
      <div className="border-b border-[#e8dfd3] px-3 py-3">
        <label className="flex items-center gap-2 rounded-lg border border-[#e8dfd3] bg-[#f8f5f2] px-2.5 py-1.5 focus-within:border-[#2e7d32]">
          <Search className="h-3.5 w-3.5 text-[#7a756e]" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Buscar en el geovisor"
            className="w-full bg-transparent text-xs text-[#1a1a1a] placeholder:text-[#a39a8d] focus:outline-none"
          />
        </label>
      </div>

      {/* Groups */}
      <nav className="flex-1 overflow-y-auto px-2 py-2">
        {SIDEBAR_GROUPS.map((group) => {
          const Icon = group.icon;
          const open = openGroups[group.id];
          const filteredItems = search
            ? group.items.filter((it) =>
                it.label.toLowerCase().includes(search.toLowerCase()),
              )
            : group.items;
          if (search && filteredItems.length === 0) return null;
          return (
            <div key={group.id} className="mb-1">
              <button
                type="button"
                onClick={() => toggleGroup(group.id)}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[12px] font-semibold text-[#1a1a1a] hover:bg-[#f1ece4]"
                aria-expanded={open}
              >
                <Icon className="h-4 w-4 text-[#2e7d32]" aria-hidden="true" />
                <span className="flex-1 truncate">{group.label}</span>
                {open || search ? (
                  <ChevronDown className="h-3.5 w-3.5 text-[#7a756e]" aria-hidden="true" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5 text-[#7a756e]" aria-hidden="true" />
                )}
              </button>
              {open || search ? (
                <ul className="mt-0.5 space-y-0.5 pl-4">
                  {filteredItems.map((item) => {
                    const isActive = item.id === activeItemId;
                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => onSelectItem(item.id)}
                          className={[
                            "flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-[12px] transition",
                            isActive
                              ? "bg-[#d8f3dc] font-semibold text-[#1b5e20]"
                              : "text-[#4a4540] hover:bg-[#f1ece4]",
                          ].join(" ")}
                          aria-current={isActive ? "page" : undefined}
                        >
                          <span
                            className={[
                              "h-1.5 w-1.5 rounded-full",
                              isActive ? "bg-[#2e7d32]" : "bg-[#cfc7bb]",
                            ].join(" ")}
                            aria-hidden="true"
                          />
                          <span className="flex-1 truncate">{item.label}</span>
                          {item.badge ? (
                            <span
                              className={[
                                "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                                isActive
                                  ? "bg-[#2e7d32] text-white"
                                  : "bg-[#f1ece4] text-[#4a4540]",
                              ].join(" ")}
                            >
                              {item.badge}
                            </span>
                          ) : null}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </div>
          );
        })}
      </nav>

      {/* Footer hint */}
      <div className="border-t border-[#e8dfd3] px-4 py-3">
        <p className="text-[10px] leading-4 text-[#7a756e]">
          Información territorial soberana — Palenke Afrocolombiano
        </p>
      </div>
    </aside>
  );
}

function ToolbarButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: IconType;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#e8dfd3] bg-white px-2.5 text-xs font-semibold text-[#4a4540] transition hover:bg-[#f1ece4]"
      title={label}
      aria-label={label}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      <span className="hidden md:inline">{label}</span>
    </button>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="inline-flex items-center gap-1.5 rounded-lg border border-[#e8dfd3] bg-white px-2 py-1 text-[11px] text-[#4a4540]">
      <span className="font-semibold uppercase tracking-[0.1em] text-[#7a756e]">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="max-w-[180px] truncate bg-transparent text-[12px] font-semibold text-[#1a1a1a] focus:outline-none"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="font-semibold uppercase tracking-[0.1em] text-[#7a756e]">{label}</dt>
      <dd className="text-right font-semibold text-[#1a1a1a]">{value}</dd>
    </div>
  );
}
