"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Download,
  Droplets,
  FileImage,
  FileText,
  Filter,
  HelpCircle,
  Mic,
  Search,
  Share2,
  TreePine,
  User,
  Waves,
  X,
  Zap,
} from "lucide-react";
import type { ScitaReport } from "@/lib/mock-reports-store";
import { loadClientScitaReports, mergeScitaReports } from "@/lib/scita-reports-client-storage";
import { AdminAlertsCharts } from "@/components/palenke/AdminAlertsCharts";
import { ScitaReportEvidencePreview } from "@/components/palenke/ScitaReportEvidencePreview";

// Map categories to labels, colors, and icons
const CATEGORIES = {
  hidrica: { label: "Amenaza hídrica", icon: Droplets, color: "#1565c0", bg: "#e3f2fd", border: "#90caf9" },
  deforestacion: { label: "Deforestación", icon: TreePine, color: "#2e7d32", bg: "#e8f5e9", border: "#a5d6a7" },
  mineria: { label: "Minería ilegal", icon: Zap, color: "#d32f2f", bg: "#ffebee", border: "#ef9a9a" },
  fauna: { label: "Fauna y flora", icon: Waves, color: "#00796b", bg: "#e0f2f1", border: "#80cbc4" },
  otro: { label: "Otro", icon: HelpCircle, color: "#5d4037", bg: "#efebe9", border: "#bcaaa4" },
} as const;

// Map formats to labels and icons
const FORMATS = {
  texto: { label: "Texto escrito", icon: FileText, color: "#455a64" },
  imagen: { label: "Imagen", icon: FileImage, color: "#7b1fa2" },
  voz: { label: "Nota de voz", icon: Mic, color: "#e65100" },
} as const;

// Map boards to labels and badges
const BOARDS = {
  gobierno: { label: "Gobierno propio", bg: "#fff3e0", text: "#e65100" },
  conservacion: { label: "Conservación", bg: "#e8f5e9", text: "#2e7d32" },
  titulacion: { label: "Titulación", bg: "#e3f2fd", text: "#1565c0" },
  proyectos: { label: "Proyectos", bg: "#f3e5f5", text: "#7b1fa2" },
} as const;

type DateRangeFilter = "all" | "7d" | "30d" | "90d";

interface AdminAlertsDashboardProps {
  initialReports: ScitaReport[];
  mergeClientSubmissions?: boolean;
}

export function AdminAlertsDashboard({
  initialReports,
  mergeClientSubmissions = true,
}: AdminAlertsDashboardProps) {
  const [reports, setReports] = useState<ScitaReport[]>(initialReports);
  const [selectedReport, setSelectedReport] = useState<ScitaReport | null>(null);

  useEffect(() => {
    if (!mergeClientSubmissions) {
      setReports(initialReports);
      return;
    }
    const clientReports = loadClientScitaReports();
    setReports(mergeScitaReports(initialReports, clientReports));
  }, [mergeClientSubmissions, initialReports]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("all");
  const [selectedFormatFilter, setSelectedFormatFilter] = useState<string>("all");
  const [selectedBoardFilter, setSelectedBoardFilter] = useState<string>("all");
  const [selectedDateFilter, setSelectedDateFilter] = useState<DateRangeFilter>("all");

  const filteredReports = useMemo(() => {
    const now = Date.now();
    const rangeMs: Record<Exclude<DateRangeFilter, "all">, number> = {
      "7d": 7 * 24 * 60 * 60 * 1000,
      "30d": 30 * 24 * 60 * 60 * 1000,
      "90d": 90 * 24 * 60 * 60 * 1000,
    };

    return reports.filter((report) => {
      const matchesSearch =
        report.descripcion.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (report.nombre && report.nombre.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (report.contacto && report.contacto.toLowerCase().includes(searchQuery.toLowerCase()));

      // Category filter
      const matchesCategory = selectedCategoryFilter === "all" || report.categoria === selectedCategoryFilter;

      // Format filter
      const matchesFormat = selectedFormatFilter === "all" || report.formato === selectedFormatFilter;

      // Dashboard source filter
      const matchesBoard =
        selectedBoardFilter === "all" ||
        (report.tablero_origen && report.tablero_origen === selectedBoardFilter);

      const matchesDate =
        selectedDateFilter === "all" ||
        now - new Date(report.created_at).getTime() <= rangeMs[selectedDateFilter];

      return matchesSearch && matchesCategory && matchesFormat && matchesBoard && matchesDate;
    });
  }, [reports, searchQuery, selectedCategoryFilter, selectedFormatFilter, selectedBoardFilter, selectedDateFilter]);

  // Premium metrics calculations (Looker Studio style)
  const stats = useMemo(() => {
    const total = filteredReports.length;
    if (total === 0) {
      return {
        total: 0,
        topCategory: "Ninguna",
        topFormat: "Ninguno",
        responseRate: 0,
        trendBadge: "0%",
        categoryCounts: { hidrica: 0, deforestacion: 0, mineria: 0, fauna: 0, otro: 0 },
        boardCounts: { gobierno: 0, conservacion: 0, titulacion: 0, proyectos: 0 },
        formatCounts: { texto: 0, imagen: 0, voz: 0 },
      };
    }

    const categoryCounts = { hidrica: 0, deforestacion: 0, mineria: 0, fauna: 0, otro: 0 };
    const boardCounts = { gobierno: 0, conservacion: 0, titulacion: 0, proyectos: 0 };
    const formatCounts = { texto: 0, imagen: 0, voz: 0 };
    let contactableCount = 0;
    let recentCount = 0;
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    filteredReports.forEach((r) => {
      // Category count
      if (r.categoria in categoryCounts) {
        categoryCounts[r.categoria as keyof typeof categoryCounts]++;
      }
      // Board count
      if (r.tablero_origen && r.tablero_origen in boardCounts) {
        boardCounts[r.tablero_origen as keyof typeof boardCounts]++;
      }
      if (r.formato in formatCounts) {
        formatCounts[r.formato as keyof typeof formatCounts]++;
      }
      if (r.contacto) {
        contactableCount++;
      }
      if (new Date(r.created_at).getTime() >= sevenDaysAgo) {
        recentCount++;
      }
    });

    // Top Category
    let maxCat = "Ninguna";
    let maxCatVal = -1;
    Object.entries(categoryCounts).forEach(([cat, count]) => {
      if (count > maxCatVal) {
        maxCatVal = count;
        maxCat = CATEGORIES[cat as keyof typeof CATEGORIES].label;
      }
    });

    let maxFormat = "Ninguno";
    let maxFormatVal = -1;
    Object.entries(formatCounts).forEach(([format, count]) => {
      if (count > maxFormatVal) {
        maxFormatVal = count;
        maxFormat = FORMATS[format as keyof typeof FORMATS].label;
      }
    });

    const responseRate = Math.min(98, Math.max(42, Math.round((contactableCount / total) * 100) + 18));
    const trendBadge = `+${Math.round((recentCount / total) * 100)}%`;

    return {
      total,
      topCategory: maxCat,
      topFormat: maxFormat,
      responseRate,
      trendBadge,
      categoryCounts,
      boardCounts,
      formatCounts,
    };
  }, [filteredReports]);

  const chartData = useMemo(() => {
    const categories = Object.entries(CATEGORIES).map(([key, cat]) => {
      const count = stats.categoryCounts[key as keyof typeof stats.categoryCounts] || 0;
      const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
      return {
        key,
        label: cat.label,
        count,
        pct,
        color: cat.color,
        icon: cat.icon,
      };
    });

    const boards = Object.entries(BOARDS).map(([key, board]) => {
      const count = stats.boardCounts[key as keyof typeof stats.boardCounts] || 0;
      const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
      return {
        key,
        label: board.label,
        count,
        pct,
        fill: board.text,
      };
    });

    return { categories, boards };
  }, [stats]);

  // Formatter for Dates
  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch {
      return isoString;
    }
  };

  // Reset filters helper
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategoryFilter("all");
    setSelectedFormatFilter("all");
    setSelectedBoardFilter("all");
    setSelectedDateFilter("all");
  };

  const handleExportCsv = () => {
    const header = ["fecha", "categoria", "formato", "descripcion", "nombre", "contacto", "tablero_origen"];
    const rows = filteredReports.map((report) =>
      [
        report.created_at,
        report.categoria,
        report.formato,
        report.descripcion.replace(/"/g, '""'),
        report.nombre ?? "",
        report.contacto ?? "",
        report.tablero_origen ?? "",
      ]
        .map((value) => `"${value}"`)
        .join(","),
    );
    const csv = [header.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `scita-alertas-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* ── Looker Studio Grid Layout: KPI Scorecard Cards ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Total Reports */}
        <div className="relative overflow-hidden rounded-[24px] border border-white/50 bg-[#0f2317] p-6 shadow-md transition hover:shadow-lg">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/[0.04] blur-xl" />
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-300/80">Total Alertas SCITA</p>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-display text-4xl font-extrabold text-white">{stats.total}</span>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">{stats.trendBadge} 7d</span>
          </div>
          <p className="mt-2 text-xs text-white/60">Reportes de campo recolectados</p>
        </div>

        {/* Card 2: Top Threat Category */}
        <div className="relative overflow-hidden rounded-[24px] border border-white/50 bg-white p-6 shadow-md transition hover:shadow-lg">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#2e7d32]/[0.05] blur-xl" />
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#2e7d32]">Amenaza Crítica</p>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e8f5e9] text-[#2e7d32]">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <span className="font-display text-xl font-bold text-[#1a1a1a] truncate" title={stats.topCategory}>
              {stats.topCategory}
            </span>
          </div>
          <p className="mt-2 text-xs text-[#7a756e]">Mayor frecuencia de reportes</p>
        </div>

        {/* Card 3: Primary reporting channel */}
        <div className="relative overflow-hidden rounded-[24px] border border-white/50 bg-white p-6 shadow-md transition hover:shadow-lg">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#1565c0]/[0.05] blur-xl" />
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1565c0]">Canal Principal</p>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e3f2fd] text-[#1565c0]">
              <FileText className="h-5 w-5" />
            </div>
            <span className="font-display text-xl font-bold text-[#1a1a1a] truncate" title={stats.topFormat}>
              {stats.topFormat}
            </span>
          </div>
          <p className="mt-2 text-xs text-[#7a756e]">Formato más usado por la comunidad</p>
        </div>

        {/* Card 4: Simulated operational response rate */}
        <div className="relative overflow-hidden rounded-[24px] border border-white/50 bg-white p-6 shadow-md transition hover:shadow-lg">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#7b1fa2]/[0.05] blur-xl" />
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#7b1fa2]">Tasa de Respuesta</p>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-display text-4xl font-extrabold text-[#7b1fa2]">{stats.responseRate}%</span>
            <span className="text-xs font-semibold text-[#7b1fa2] bg-[#f3e5f5] px-2 py-0.5 rounded-full">Operativo</span>
          </div>
          <p className="mt-2 text-xs text-[#7a756e]">Indicador simulado de seguimiento comunitario</p>
        </div>
      </div>

      <AdminAlertsCharts total={stats.total} categories={chartData.categories} boards={chartData.boards} />

      {/* ── Advanced Searching & Filtering ── */}
      <div className="rounded-[24px] border border-[#e8dfd3] bg-[#f8f5f2] p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-[#7a756e]" />
            <h4 className="text-sm font-bold text-[#1a1a1a] uppercase tracking-wider">Filtros de Búsqueda</h4>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#e8dfd3] bg-white px-3 py-1.5 text-xs font-semibold text-[#2e7d32] transition hover:bg-[#f0eae0]"
            >
              <Download className="h-3.5 w-3.5" />
              Exportar CSV
            </button>
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs font-semibold text-[#2e7d32] hover:underline"
            >
              Limpiar todos los filtros
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#bab4ac]" />
            <input
              type="text"
              placeholder="Buscar reporte, nombre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-[14px] border border-[#e8dfd3] bg-white pl-10 pr-4 py-2.5 text-sm text-[#1a1a1a] placeholder:text-[#bab4ac] focus:border-[#2e7d32] focus:outline-none"
            />
          </div>

          {/* Category filter dropdown */}
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="rounded-[14px] border border-[#e8dfd3] bg-white px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#2e7d32] focus:outline-none"
          >
            <option value="all">Todas las amenazas</option>
            {Object.entries(CATEGORIES).map(([key, cat]) => (
              <option key={key} value={key}>
                {cat.label}
              </option>
            ))}
          </select>

          {/* Format filter dropdown */}
          <select
            value={selectedFormatFilter}
            onChange={(e) => setSelectedFormatFilter(e.target.value)}
            className="rounded-[14px] border border-[#e8dfd3] bg-white px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#2e7d32] focus:outline-none"
          >
            <option value="all">Todos los formatos</option>
            {Object.entries(FORMATS).map(([key, mt]) => (
              <option key={key} value={key}>
                {mt.label}
              </option>
            ))}
          </select>

          {/* Board origin filter dropdown */}
          <select
            value={selectedBoardFilter}
            onChange={(e) => setSelectedBoardFilter(e.target.value)}
            className="rounded-[14px] border border-[#e8dfd3] bg-white px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#2e7d32] focus:outline-none"
          >
            <option value="all">Todos los tableros origen</option>
            {Object.entries(BOARDS).map(([key, board]) => (
              <option key={key} value={key}>
                {board.label}
              </option>
            ))}
          </select>

          <select
            value={selectedDateFilter}
            onChange={(e) => setSelectedDateFilter(e.target.value as DateRangeFilter)}
            className="rounded-[14px] border border-[#e8dfd3] bg-white px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#2e7d32] focus:outline-none"
          >
            <option value="all">Todo el historial</option>
            <option value="7d">Últimos 7 días</option>
            <option value="30d">Últimos 30 días</option>
            <option value="90d">Últimos 90 días</option>
          </select>
        </div>
      </div>

      {/* ── Table Grid log of reports ── */}
      <div className="overflow-hidden rounded-[28px] border border-[#e8dfd3] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm text-[#1a1a1a]">
            <thead>
              <tr className="border-b border-[#e8dfd3] bg-[#fdfcfb]">
                <th className="px-6 py-4 font-bold text-[#4a4540]">Fecha</th>
                <th className="px-6 py-4 font-bold text-[#4a4540]">Amenaza</th>
                <th className="px-6 py-4 font-bold text-[#4a4540]">Formato</th>
                <th className="px-6 py-4 font-bold text-[#4a4540] w-1/3">Descripción</th>
                <th className="px-6 py-4 font-bold text-[#4a4540]">Tablero Origen</th>
                <th className="px-6 py-4 font-bold text-[#4a4540]">Reportante</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8dfd3]/60">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#7a756e]">
                    No se encontraron reportes con los filtros activos.
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => {
                  const cat = CATEGORIES[report.categoria as keyof typeof CATEGORIES] || CATEGORIES.otro;
                  const format = FORMATS[report.formato as keyof typeof FORMATS] || FORMATS.texto;
                  const board = report.tablero_origen ? BOARDS[report.tablero_origen as keyof typeof BOARDS] : null;

                  const CatIcon = cat.icon;
                  const FormatIcon = format.icon;

                  return (
                    <tr
                      key={report.id}
                      onClick={() => setSelectedReport(report)}
                      className="cursor-pointer transition hover:bg-[#2e7d32]/[0.02]"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-[#7a756e] font-medium">
                        {formatDate(report.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 font-semibold" style={{ color: cat.color }}>
                          <CatIcon className="h-4 w-4" />
                          {cat.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-[#4a4540] text-xs">
                          <FormatIcon className="h-3.5 w-3.5 text-[#bab4ac]" />
                          {format.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="line-clamp-2 text-xs leading-relaxed text-[#4a4540] max-w-sm">
                          {report.descripcion}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {board ? (
                          <span
                            className="inline-block px-2.5 py-0.5 text-[11px] font-bold rounded-full"
                            style={{ backgroundColor: board.bg, color: board.text }}
                          >
                            {board.label}
                          </span>
                        ) : (
                          <span className="text-xs text-[#bab4ac]">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs">
                        {report.nombre ? (
                          <div className="flex items-center gap-1 text-[#3a3530] font-medium">
                            <User className="h-3.5 w-3.5 text-[#bab4ac]" />
                            {report.nombre}
                          </div>
                        ) : (
                          <span className="text-[#bab4ac] italic">Anónimo</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Slide-Over Glassmorphic Details Modal ── */}
      {selectedReport && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-end bg-black/45 backdrop-blur-sm p-4"
          onClick={() => setSelectedReport(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex h-full w-full max-w-md flex-col rounded-[32px] border border-white/50 bg-white/95 p-6 shadow-2xl backdrop-blur-md"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#e8dfd3]">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#7a756e]">Detalles de Alerta</p>
                <h3 className="font-display text-lg text-[#1a1a1a] mt-0.5">SCITA Reporte</h3>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f0eae0] text-[#4a4540] hover:bg-[#e8dfd3]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable details */}
            <div className="flex-1 overflow-y-auto py-6 space-y-6">
              {/* Category banner */}
              {(() => {
                const cat = CATEGORIES[selectedReport.categoria as keyof typeof CATEGORIES] || CATEGORIES.otro;
                const CatIcon = cat.icon;
                return (
                  <div className="rounded-2xl p-4 flex items-center gap-3" style={{ backgroundColor: cat.bg, border: `1px solid ${cat.border}` }}>
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-lg">
                      <CatIcon className="h-6 w-6" style={{ color: cat.color }} />
                    </div>
                    <div>
                      <p className="text-xs text-[#7a756e] font-semibold">Categoría Observada</p>
                      <h4 className="font-display font-bold" style={{ color: cat.color }}>{cat.label}</h4>
                    </div>
                  </div>
                );
              })()}

              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#7a756e]">Descripción Comunitaria</h4>
                <div className="rounded-2xl bg-[#fdfcfb] border border-[#e8dfd3] p-4 text-sm leading-relaxed text-[#1a1a1a]">
                  {selectedReport.descripcion}
                </div>
              </div>

              <ScitaReportEvidencePreview report={selectedReport} />

              {/* Grid Metadata */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-[#e8dfd3] p-3 text-left">
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#7a756e] mb-1">
                    <Calendar className="h-3 w-3 text-[#bab4ac]" />
                    Fecha Envío
                  </span>
                  <p className="text-xs font-semibold text-[#1a1a1a]">
                    {formatDate(selectedReport.created_at)}
                  </p>
                </div>

                <div className="rounded-xl border border-[#e8dfd3] p-3 text-left">
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#7a756e] mb-1">
                    <FileText className="h-3 w-3 text-[#bab4ac]" />
                    Formato
                  </span>
                  <p className="text-xs font-semibold text-[#1a1a1a]">
                    {FORMATS[selectedReport.formato as keyof typeof FORMATS]?.label || selectedReport.formato}
                  </p>
                </div>
              </div>

              {/* Source board details */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#7a756e]">Tablero de Origen</h4>
                {selectedReport.tablero_origen ? (
                  <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold" style={{ backgroundColor: BOARDS[selectedReport.tablero_origen as keyof typeof BOARDS]?.bg, color: BOARDS[selectedReport.tablero_origen as keyof typeof BOARDS]?.text }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: BOARDS[selectedReport.tablero_origen as keyof typeof BOARDS]?.text }} />
                    {BOARDS[selectedReport.tablero_origen as keyof typeof BOARDS]?.label}
                  </div>
                ) : (
                  <p className="text-xs text-[#bab4ac] italic">No asociado a ningún tablero de visualización.</p>
                )}
              </div>

              {/* Contact Information */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#7a756e]">Contacto de Seguimiento</h4>
                <div className="rounded-2xl border border-[#e8dfd3] p-4 space-y-3 bg-[#fdfcfb]">
                  <div className="flex items-center gap-2.5 text-xs">
                    <User className="h-4 w-4 text-[#bab4ac]" />
                    <div>
                      <span className="text-[#7a756e]">Nombre:</span>
                      <p className="font-semibold text-[#1a1a1a] mt-0.5">{selectedReport.nombre || "Anónimo"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs">
                    <Share2 className="h-4 w-4 text-[#bab4ac]" />
                    <div>
                      <span className="text-[#7a756e]">WhatsApp / Teléfono / Correo:</span>
                      <p className="font-semibold text-[#1a1a1a] mt-0.5">{selectedReport.contacto || "Ninguno aportado"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Footer */}
            <div className="border-t border-[#e8dfd3] pt-4 space-y-2.5">
              {selectedReport.contacto && (
                <a
                  href={`https://wa.me/${selectedReport.contacto.replace(/\s+/g, "").replace(/\+/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2e7d32] py-3 text-sm font-bold text-white transition hover:bg-[#1b5e20]"
                >
                  <Share2 className="h-4 w-4" />
                  Contactar vía WhatsApp
                </a>
              )}
              <button
                onClick={() => {
                  setSelectedReport(null);
                  alert("Alerta marcada como verificada en esta sesión.");
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#e8dfd3] bg-white py-3 text-sm font-bold text-[#4a4540] transition hover:bg-[#f0eae0]"
              >
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                Marcar como verificado
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
