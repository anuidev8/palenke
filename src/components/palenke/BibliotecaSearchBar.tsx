"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, X, Layers, Filter, Check } from "lucide-react";
import {
  NORMATIVA_FEATURED_KEYWORDS,
  resolveNormativaSearchContext,
  suggestNormativaKeywords,
} from "@/lib/biblioteca-search";
import type { ViewerRole } from "@/lib/mock-data";
import { instrumentTypes } from "@/lib/mock-data";
import { withRole } from "@/lib/viewer";

type BibliotecaSearchBarProps = {
  role: ViewerRole;
  query: string;
  sections: string[];
  territory: string;
  year: string;
  type: string;
  years: readonly string[];
  territories: readonly string[];
  showNormativaKeywords?: boolean;
  topics: string[];
};

export default function BibliotecaSearchBar({
  role,
  query,
  sections,
  territory,
  year,
  type,
  years,
  territories,
  showNormativaKeywords = false,
  topics,
}: BibliotecaSearchBarProps) {
  const router = useRouter();

  // Local draft state for search text to support typing without instant reloads on keystroke
  const [draftQuery, setDraftQuery] = useState(query);
  const [isFocused, setIsFocused] = useState(false);

  // Sync draft query when prop changes (e.g. if filter summary clears it)
  useEffect(() => {
    setDraftQuery(query);
  }, [query]);

  // Mobile drawer state
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Local draft states inside the mobile drawer so selections don't update URL until "Aplicar" is clicked
  const [draftTerritory, setDraftTerritory] = useState(territory);
  const [draftYear, setDraftYear] = useState(year);
  const [draftType, setDraftType] = useState(type);
  const [draftTopics, setDraftTopics] = useState<string[]>(topics);

  // Close drawer on ESC key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMobileDrawerOpen(false);
      }
    }
    if (mobileDrawerOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileDrawerOpen]);

  // Suggestions for search input
  const suggestions = useMemo(
    () => suggestNormativaKeywords(draftQuery, 8),
    [draftQuery],
  );

  const searchContext = useMemo(
    () => (query.trim() ? resolveNormativaSearchContext(query) : null),
    [query],
  );

  const visibleSuggestions = showNormativaKeywords && isFocused && draftQuery.trim().length > 0
    ? suggestions
    : [];

  // Count active filters (except query and sections) for the mobile badge
  const activeFiltersCount = [
    Boolean(territory),
    Boolean(year),
    Boolean(type),
    topics.length > 0,
  ].filter(Boolean).length;

  const isAnyFilterActive =
    Boolean(query) ||
    Boolean(territory) ||
    Boolean(year) ||
    Boolean(type) ||
    topics.length > 0;

  // Master update function to apply filter transitions client-side
  function applyFilters({
    newQuery,
    newTerritory,
    newYear,
    newType,
    newTopics,
  }: {
    newQuery?: string;
    newTerritory?: string;
    newYear?: string;
    newType?: string;
    newTopics?: string[];
  }) {
    const nextParams = {
      section: sections.length > 0 ? sections : undefined,
      q: newQuery !== undefined ? newQuery : query || undefined,
      territory: newTerritory !== undefined ? newTerritory : territory || undefined,
      year: newYear !== undefined ? newYear : year || undefined,
      type: newType !== undefined ? newType : type || undefined,
      topic: newTopics !== undefined ? newTopics : topics.length > 0 ? topics : undefined,
    };

    const href = withRole("/biblioteca", role, nextParams);
    router.push(href, { scroll: false });
  }

  // Handle single keyword chip toggle
  function toggleTopic(keyword: string) {
    const isSelected = topics.includes(keyword);
    const nextTopics = isSelected
      ? topics.filter((t) => t !== keyword)
      : [...topics, keyword];

    applyFilters({ newTopics: nextTopics });
  }

  // Handle search submit (attached button / enter key)
  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    applyFilters({ newQuery: draftQuery });
  }

  // Clear all filters completely (retains section context if any)
  const clearHref = withRole(
    "/biblioteca",
    role,
    sections.length > 0 ? { section: sections } : undefined,
  );

  return (
    <div className="space-y-6">
      {/* ── Visual Dominance: Wide Top Search Input Form ── */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className="flex flex-col gap-2">
          <label htmlFor="library-search-input" className="sr-only">
            Buscar en la biblioteca
          </label>
          <div className="relative flex w-full items-center rounded-full border border-[#e8dfd3] bg-white p-1.5 pl-6 pr-2 shadow-sm transition-all duration-300 focus-within:border-[#2e7d32] focus-within:ring-2 focus-within:ring-[#2e7d32]/20">
            <Search className="h-5 w-5 shrink-0 text-[#7a756e] mr-3" aria-hidden="true" />
            <input
              id="library-search-input"
              type="search"
              value={draftQuery}
              onChange={(e) => setDraftQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => {
                // Short timeout to allow clicking suggestions before overlay vanishes
                window.setTimeout(() => setIsFocused(false), 180);
              }}
              placeholder={
                showNormativaKeywords
                  ? "Buscar por nombre de la norma, número o tema (ej. 'Ley 70', 'titulación colectiva')…"
                  : "Buscar por título, palabra clave o tema ancestral…"
              }
              className="w-full bg-transparent py-2.5 text-base text-[#1a1a1a] outline-none placeholder:text-[#7a756e]"
              autoComplete="off"
            />
            <div className="flex items-center gap-2">
              {draftQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setDraftQuery("");
                    applyFilters({ newQuery: "" });
                  }}
                  className="rounded-full p-2 text-[#7a756e] hover:bg-[#f0eae0] hover:text-[#1a1a1a] transition"
                  aria-label="Borrar búsqueda"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <button
                type="submit"
                className="rounded-full bg-[#2e7d32] hover:bg-[#1b5e20] text-white px-6 py-2.5 text-sm font-semibold transition shadow-sm hover:shadow active:scale-95"
              >
                Buscar
              </button>
            </div>
          </div>
        </div>

        {/* Suggestion popover with premium design */}
        {visibleSuggestions.length > 0 && (
          <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 overflow-hidden rounded-[24px] border border-[#e8dfd3] bg-white shadow-[0_16px_40px_rgba(26,26,26,0.12)]">
            <p className="border-b border-[#f0eae0] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-[#7a756e] bg-[#fafaf8]">
              Sugerencias de búsqueda
            </p>
            <ul className="max-h-64 overflow-y-auto py-1">
              {visibleSuggestions.map((keyword) => (
                <li key={keyword}>
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 px-5 py-3 text-left text-sm text-[#1a1a1a] transition hover:bg-[#f8f5f2]"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setDraftQuery(keyword);
                      applyFilters({ newQuery: keyword });
                    }}
                  >
                    <Search className="h-4 w-4 shrink-0 text-[#2e7d32]" aria-hidden="true" />
                    <span>{keyword}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </form>

      {/* ── Desktop Facets layout (Horizontal row) ── */}
      <div className="hidden md:flex flex-wrap items-center gap-4">
        {/* Territory facet */}
        <div className="flex flex-col gap-1.5 min-w-[200px]">
          <label htmlFor="f-territory" className="text-xs font-bold uppercase tracking-[0.16em] text-[#7a756e]">
            Territorio
          </label>
          <select
            id="f-territory"
            value={territory}
            onChange={(e) => applyFilters({ newTerritory: e.target.value })}
            className="input-shell bg-white py-3 px-4 rounded-full border border-[#e8dfd3] focus:border-[#2e7d32] focus:ring-4 focus:ring-[#2e7d32]/5 text-sm font-medium text-[#1a1a1a] transition cursor-pointer"
          >
            <option value="">Todos los territorios</option>
            {territories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* Year facet */}
        <div className="flex flex-col gap-1.5 min-w-[150px]">
          <label htmlFor="f-year" className="text-xs font-bold uppercase tracking-[0.16em] text-[#7a756e]">
            Año
          </label>
          <select
            id="f-year"
            value={year}
            onChange={(e) => applyFilters({ newYear: e.target.value })}
            className="input-shell bg-white py-3 px-4 rounded-full border border-[#e8dfd3] focus:border-[#2e7d32] focus:ring-4 focus:ring-[#2e7d32]/5 text-sm font-medium text-[#1a1a1a] transition cursor-pointer"
          >
            <option value="">Todos los años</option>
            {years.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* Type facet (Tipo de norma) */}
        <div className="flex flex-col gap-1.5 min-w-[220px]">
          <label htmlFor="f-type" className="text-xs font-bold uppercase tracking-[0.16em] text-[#7a756e]">
            Tipo de norma
          </label>
          <select
            id="f-type"
            value={type}
            onChange={(e) => applyFilters({ newType: e.target.value })}
            className="input-shell bg-white py-3 px-4 rounded-full border border-[#e8dfd3] focus:border-[#2e7d32] focus:ring-4 focus:ring-[#2e7d32]/5 text-sm font-medium text-[#1a1a1a] transition cursor-pointer"
          >
            <option value="">Todos los tipos</option>
            {instrumentTypes.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Mobile Filter trigger button ── */}
      <div className="flex md:hidden items-center gap-2">
        <button
          type="button"
          onClick={() => {
            // Set up draft variables with latest parent state when drawer opens
            setDraftTerritory(territory);
            setDraftYear(year);
            setDraftType(type);
            setDraftTopics(topics);
            setMobileDrawerOpen(true);
          }}
          className="flex-1 inline-flex items-center justify-center gap-2.5 rounded-full border border-[#e8dfd3] bg-white px-5 py-3.5 text-sm font-bold text-[#1a1a1a] shadow-sm transition hover:bg-[#f8f5f2] active:scale-95"
        >
          <Filter className="h-4 w-4 text-[#2e7d32]" />
          <span>Filtrar</span>
          {activeFiltersCount > 0 ? (
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#2e7d32] px-1.5 text-[10px] font-extrabold text-white">
              {activeFiltersCount}
            </span>
          ) : null}
        </button>
        {isAnyFilterActive && (
          <Link
            href={clearHref}
            className="inline-flex h-[48px] items-center justify-center rounded-full bg-[#fddede] hover:bg-[#fccacb] text-xs font-bold text-[#d32f2f] px-5 transition active:scale-95"
          >
            Limpiar
          </Link>
        )}
      </div>

      {/* ── Stateful multi-select topic chips (Palabras clave) ── */}
      {showNormativaKeywords && (
        <div className="space-y-3">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#7a756e]">
              Palabras clave populares
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {NORMATIVA_FEATURED_KEYWORDS.map((keyword) => {
                const isSelected = topics.includes(keyword);
                return (
                  <button
                    key={keyword}
                    type="button"
                    onClick={() => toggleTopic(keyword)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-semibold transition active:scale-95 ${
                      isSelected
                        ? "border-[#2e7d32] bg-[#2e7d32] text-white shadow-sm"
                        : "border-[#d8f3dc] bg-[#f4fbf5] text-[#1b5e20] hover:border-[#2e7d32] hover:bg-[#e8f5e9]"
                    }`}
                  >
                    {isSelected && <Check className="h-3 w-3 shrink-0 text-white" />}
                    <span>{keyword}</span>
                    {isSelected && (
                      <span
                        className="p-0.5 rounded-full hover:bg-white/20 ml-0.5"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTopic(keyword);
                        }}
                        aria-label={`Desactivar filtro ${keyword}`}
                      >
                        <X className="h-3 w-3 shrink-0" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {searchContext && searchContext.matchedKeywords.length > 0 && (
            <div className="rounded-[20px] border border-[#d8f3dc] bg-[#f4fbf5] px-5 py-4 text-sm text-[#2e4a31] shadow-sm animate-fade-in">
              <p className="leading-relaxed">
                Resultados vinculados con{" "}
                <strong className="font-semibold">
                  {searchContext.matchedKeywords.map((entry) => entry.keyword).join(", ")}
                </strong>
                {searchContext.relatedNorms.length > 0 && (
                  <>
                    {" "}
                    y normas relacionadas:{" "}
                    <span className="font-medium text-[#1b5e20]">
                      {searchContext.relatedNorms.slice(0, 4).join(" · ")}
                    </span>
                    {searchContext.relatedNorms.length > 4 ? "…" : ""}
                  </>
                )}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Mobile Filter Bottom-Sheet / Drawer Overlay ── */}
      {mobileDrawerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black/50 backdrop-blur-md transition-opacity duration-300"
          onClick={() => setMobileDrawerOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="drawer-title"
        >
          <div
            className="relative w-full max-h-[90vh] rounded-t-[32px] sm:rounded-[32px] bg-white p-6 shadow-2xl transition-transform duration-300 max-w-lg mx-auto flex flex-col animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#e8dfd3] pb-4 mb-6">
              <div>
                <h3 id="drawer-title" className="font-display text-2xl text-[#1a1a1a]">
                  Filtrar documentos
                </h3>
                <p className="text-xs text-[#7a756e] mt-1">
                  Aplica múltiples filtros para precisar los resultados
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="rounded-full p-2.5 text-[#7a756e] hover:bg-[#f0eae0] hover:text-[#1a1a1a] transition"
                aria-label="Cerrar filtros"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable contents */}
            <div className="space-y-6 overflow-y-auto pr-1 pb-24 flex-1">
              {/* Territory option */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="m-territory" className="text-xs font-bold uppercase tracking-[0.16em] text-[#7a756e]">
                  Territorio
                </label>
                <select
                  id="m-territory"
                  value={draftTerritory}
                  onChange={(e) => setDraftTerritory(e.target.value)}
                  className="input-shell bg-white py-3.5 px-4 rounded-full border border-[#e8dfd3] focus:border-[#2e7d32] text-sm font-medium text-[#1a1a1a] cursor-pointer"
                >
                  <option value="">Todos los territorios</option>
                  {territories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year option */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="m-year" className="text-xs font-bold uppercase tracking-[0.16em] text-[#7a756e]">
                  Año
                </label>
                <select
                  id="m-year"
                  value={draftYear}
                  onChange={(e) => setDraftYear(e.target.value)}
                  className="input-shell bg-white py-3.5 px-4 rounded-full border border-[#e8dfd3] focus:border-[#2e7d32] text-sm font-medium text-[#1a1a1a] cursor-pointer"
                >
                  <option value="">Todos los años</option>
                  {years.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              {/* Document Type (Tipo de norma) */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="m-type" className="text-xs font-bold uppercase tracking-[0.16em] text-[#7a756e]">
                  Tipo de norma
                </label>
                <select
                  id="m-type"
                  value={draftType}
                  onChange={(e) => setDraftType(e.target.value)}
                  className="input-shell bg-white py-3.5 px-4 rounded-full border border-[#e8dfd3] focus:border-[#2e7d32] text-sm font-medium text-[#1a1a1a] cursor-pointer"
                >
                  <option value="">Todos los tipos</option>
                  {instrumentTypes.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              {/* Keyword chips inside mobile panel */}
              {showNormativaKeywords && (
                <div className="space-y-2.5">
                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#7a756e]">
                    Palabras clave
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {NORMATIVA_FEATURED_KEYWORDS.map((keyword) => {
                      const isSelected = draftTopics.includes(keyword);
                      return (
                        <button
                          key={keyword}
                          type="button"
                          onClick={() => {
                            setDraftTopics((prev) =>
                              prev.includes(keyword)
                                ? prev.filter((t) => t !== keyword)
                                : [...prev, keyword]
                            );
                          }}
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-semibold transition active:scale-95 ${
                            isSelected
                              ? "border-[#2e7d32] bg-[#2e7d32] text-white shadow-sm"
                              : "border-[#d8f3dc] bg-[#f4fbf5] text-[#1b5e20]"
                          }`}
                        >
                          {isSelected && <Check className="h-3 w-3" />}
                          <span>{keyword}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Sticky Bottom Actions inside Drawer */}
            <div className="absolute bottom-0 left-0 right-0 bg-[#f8f5f2] border-t border-[#e8dfd3] p-5 flex gap-4 rounded-b-[32px] justify-between z-10">
              <button
                type="button"
                onClick={() => {
                  setDraftTerritory("");
                  setDraftYear("");
                  setDraftType("");
                  setDraftTopics([]);
                }}
                className="inline-flex h-[48px] items-center justify-center rounded-full border border-[#e8dfd3] bg-white px-6 text-sm font-bold text-[#4a4540] transition hover:bg-[#f0eae0] active:scale-95 flex-1 shadow-sm"
              >
                Restablecer
              </button>
              <button
                type="button"
                onClick={() => {
                  applyFilters({
                    newTerritory: draftTerritory,
                    newYear: draftYear,
                    newType: draftType,
                    newTopics: draftTopics,
                  });
                  setMobileDrawerOpen(false);
                }}
                className="inline-flex h-[48px] items-center justify-center rounded-full bg-[#2e7d32] hover:bg-[#1b5e20] text-white px-6 text-sm font-bold transition active:scale-95 flex-1 shadow-md"
              >
                Aplicar filtros
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
