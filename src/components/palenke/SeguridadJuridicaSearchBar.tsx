"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, Filter, Search, X } from "lucide-react";
import type { ViewerRole } from "@/lib/mock-data";
import { withRole } from "@/lib/viewer";
import {
  SEGURIDAD_JURIDICA_FEATURED_KEYWORDS,
  getDocumentTypeFilterLabel,
  type SeguridadJuridicaFacetOptions,
  type SeguridadJuridicaFilters,
} from "@/lib/seguridad-juridica-filters";

type SeguridadJuridicaSearchBarProps = {
  role: ViewerRole;
  instrumento: string;
  submodulo: string;
  accentColor: string;
  filters: SeguridadJuridicaFilters;
  facets: SeguridadJuridicaFacetOptions;
};

export function SeguridadJuridicaSearchBar({
  role,
  instrumento,
  submodulo,
  accentColor,
  filters,
  facets,
}: SeguridadJuridicaSearchBarProps) {
  const router = useRouter();
  const [draftQuery, setDraftQuery] = useState(filters.query);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [draftYear, setDraftYear] = useState(filters.year);
  const [draftAuthor, setDraftAuthor] = useState(filters.author);
  const [draftCouncil, setDraftCouncil] = useState(filters.council);
  const [draftType, setDraftType] = useState(filters.documentType);
  const [draftTheme, setDraftTheme] = useState(filters.theme);

  useEffect(() => {
    setDraftQuery(filters.query);
  }, [filters.query]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileDrawerOpen(false);
      }
    }
    if (mobileDrawerOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileDrawerOpen]);

  const suggestions = useMemo(() => {
    const query = draftQuery.trim().toLowerCase();
    if (query.length < 2) return [];
    return SEGURIDAD_JURIDICA_FEATURED_KEYWORDS.filter((keyword) =>
      keyword.toLowerCase().includes(query),
    ).slice(0, 6);
  }, [draftQuery]);

  const activeFiltersCount = [
    Boolean(filters.year),
    Boolean(filters.author),
    Boolean(filters.council),
    Boolean(filters.documentType),
    Boolean(filters.theme),
  ].filter(Boolean).length;

  const isAnyFilterActive =
    Boolean(filters.query) ||
    Boolean(filters.year) ||
    Boolean(filters.author) ||
    Boolean(filters.council) ||
    Boolean(filters.documentType) ||
    Boolean(filters.theme);

  function applyFilters(next: Partial<SeguridadJuridicaFilters>) {
    const merged = { ...filters, ...next };
    const href = withRole(`/gobierno-propio/${instrumento}`, role, {
      submodulo,
      q: merged.query || undefined,
      year: merged.year || undefined,
      author: merged.author || undefined,
      council: merged.council || undefined,
      tipo: merged.documentType || undefined,
      theme: merged.theme || undefined,
    });
    router.push(href, { scroll: false });
  }

  function handleSearchSubmit(event: React.FormEvent) {
    event.preventDefault();
    applyFilters({ query: draftQuery });
  }

  const clearHref = withRole(`/gobierno-propio/${instrumento}`, role, { submodulo });

  const selectClassName =
    "input-shell w-full cursor-pointer rounded-full border border-[#e8dfd3] bg-white px-4 py-3 text-sm font-medium text-[#1a1a1a] transition focus:border-[color:var(--sj-accent)] focus:ring-4 focus:ring-[color:var(--sj-accent-soft)]";

  return (
    <div
      className="space-y-6"
      style={
        {
          "--sj-accent": accentColor,
          "--sj-accent-soft": `${accentColor}14`,
        } as React.CSSProperties
      }
    >
      <form onSubmit={handleSearchSubmit} className="relative">
        <label htmlFor="seguridad-juridica-search" className="sr-only">
          Buscar documentos de Seguridad jurídica
        </label>
        <div
          className="relative flex w-full items-center rounded-full border border-[#e8dfd3] bg-white p-1.5 pl-6 pr-2 shadow-sm transition-all duration-300 focus-within:ring-2"
          style={{ borderColor: undefined }}
        >
          <Search className="mr-3 h-5 w-5 shrink-0 text-[#7a756e]" aria-hidden="true" />
          <input
            id="seguridad-juridica-search"
            type="search"
            value={draftQuery}
            onChange={(event) => setDraftQuery(event.target.value)}
            placeholder="Buscar por título, autor, consejo, ID o tema abordado…"
            className="w-full bg-transparent py-2.5 text-base text-[#1a1a1a] outline-none placeholder:text-[#7a756e]"
            autoComplete="off"
          />
          <div className="flex items-center gap-2">
            {draftQuery ? (
              <button
                type="button"
                onClick={() => {
                  setDraftQuery("");
                  applyFilters({ query: "" });
                }}
                className="rounded-full p-2 text-[#7a756e] transition hover:bg-[#f0eae0] hover:text-[#1a1a1a]"
                aria-label="Borrar búsqueda"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
            <button
              type="submit"
              className="rounded-full px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 active:scale-95"
              style={{ backgroundColor: accentColor }}
            >
              Buscar
            </button>
          </div>
        </div>

        {suggestions.length > 0 ? (
          <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 overflow-hidden rounded-[24px] border border-[#e8dfd3] bg-white shadow-[0_16px_40px_rgba(26,26,26,0.12)]">
            <p className="border-b border-[#f0eae0] bg-[#fafaf8] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-[#7a756e]">
              Temas frecuentes
            </p>
            <ul className="max-h-64 overflow-y-auto py-1">
              {suggestions.map((keyword) => (
                <li key={keyword}>
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 px-5 py-3 text-left text-sm text-[#1a1a1a] transition hover:bg-[#f8f5f2]"
                    onMouseDown={(event) => {
                      event.preventDefault();
                      setDraftQuery(keyword);
                      applyFilters({ query: keyword });
                    }}
                  >
                    <Search className="h-4 w-4 shrink-0" style={{ color: accentColor }} aria-hidden="true" />
                    <span>{keyword}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </form>

      <div className="hidden flex-wrap items-end gap-4 md:flex">
        <FacetSelect
          id="sj-year"
          label="Año"
          value={filters.year}
          placeholder="Todos los años"
          options={facets.years}
          onChange={(value) => applyFilters({ year: value })}
          className={selectClassName}
        />
        <FacetSelect
          id="sj-theme"
          label="Área temática"
          value={filters.theme}
          placeholder="Todas las áreas"
          options={facets.themes}
          onChange={(value) => applyFilters({ theme: value })}
          className={selectClassName}
        />
        <FacetSelect
          id="sj-author"
          label="Autoría"
          value={filters.author}
          placeholder="Todos los autores"
          options={facets.authors}
          onChange={(value) => applyFilters({ author: value })}
          className={`${selectClassName} min-w-[220px]`}
        />
        <FacetSelect
          id="sj-council"
          label="Consejo comunitario"
          value={filters.council}
          placeholder="Todos los consejos"
          options={facets.councils}
          onChange={(value) => applyFilters({ council: value })}
          className={`${selectClassName} min-w-[260px]`}
        />
        <FacetSelect
          id="sj-type"
          label="Tipo de documento"
          value={filters.documentType}
          placeholder="Todos los tipos"
          options={facets.documentTypes}
          getOptionLabel={getDocumentTypeFilterLabel}
          onChange={(value) => applyFilters({ documentType: value })}
          className={`${selectClassName} min-w-[200px]`}
        />
      </div>

      <div className="flex items-center gap-2 md:hidden">
        <button
          type="button"
          onClick={() => {
            setDraftYear(filters.year);
            setDraftAuthor(filters.author);
            setDraftCouncil(filters.council);
            setDraftType(filters.documentType);
            setDraftTheme(filters.theme);
            setMobileDrawerOpen(true);
          }}
          className="inline-flex flex-1 items-center justify-center gap-2.5 rounded-full border border-[#e8dfd3] bg-white px-5 py-3.5 text-sm font-bold text-[#1a1a1a] shadow-sm transition hover:bg-[#f8f5f2] active:scale-95"
        >
          <Filter className="h-4 w-4" style={{ color: accentColor }} />
          <span>Filtrar</span>
          {activeFiltersCount > 0 ? (
            <span
              className="flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-extrabold text-white"
              style={{ backgroundColor: accentColor }}
            >
              {activeFiltersCount}
            </span>
          ) : null}
        </button>
        {isAnyFilterActive ? (
          <Link
            href={clearHref}
            className="inline-flex h-[48px] items-center justify-center rounded-full bg-[#fddede] px-5 text-xs font-bold text-[#d32f2f] transition hover:bg-[#fccacb] active:scale-95"
          >
            Limpiar
          </Link>
        ) : null}
      </div>

      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#7a756e]">
          Temas frecuentes
        </span>
        <div className="flex flex-wrap gap-2">
          {SEGURIDAD_JURIDICA_FEATURED_KEYWORDS.map((keyword) => {
            const isSelected = filters.query.toLowerCase() === keyword.toLowerCase();
            return (
              <button
                key={keyword}
                type="button"
                onClick={() => applyFilters({ query: isSelected ? "" : keyword })}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-semibold transition active:scale-95 ${
                  isSelected
                    ? "border-transparent text-white shadow-sm"
                    : "border-[#e8dfd3] bg-[#fcfaf7] text-[#4a4540] hover:border-[#d1ccc5] hover:bg-[#f4f1ec]"
                }`}
                style={
                  isSelected
                    ? { backgroundColor: accentColor, borderColor: accentColor }
                    : undefined
                }
              >
                {isSelected ? <Check className="h-3 w-3 shrink-0" /> : null}
                <span>{keyword}</span>
              </button>
            );
          })}
        </div>
      </div>

      {mobileDrawerOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-md sm:items-center"
          onClick={() => setMobileDrawerOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="sj-filter-title"
        >
          <div
            className="relative mx-auto flex max-h-[90vh] w-full max-w-lg flex-col rounded-t-[32px] bg-white p-6 shadow-2xl sm:rounded-[32px]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between border-b border-[#e8dfd3] pb-4">
              <div>
                <h3 id="sj-filter-title" className="font-display text-2xl text-[#1a1a1a]">
                  Filtrar documentos
                </h3>
                <p className="mt-1 text-xs text-[#7a756e]">
                  Refina por autor, consejo, año o tipo de documento
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="rounded-full p-2.5 text-[#7a756e] transition hover:bg-[#f0eae0] hover:text-[#1a1a1a]"
                aria-label="Cerrar filtros"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto pb-24 pr-1">
              <FacetSelect
                id="sj-m-year"
                label="Año"
                value={draftYear}
                placeholder="Todos los años"
                options={facets.years}
                onChange={setDraftYear}
                className={selectClassName}
              />
              <FacetSelect
                id="sj-m-theme"
                label="Área temática"
                value={draftTheme}
                placeholder="Todas las áreas"
                options={facets.themes}
                onChange={setDraftTheme}
                className={selectClassName}
              />
              <FacetSelect
                id="sj-m-author"
                label="Autoría"
                value={draftAuthor}
                placeholder="Todos los autores"
                options={facets.authors}
                onChange={setDraftAuthor}
                className={selectClassName}
              />
              <FacetSelect
                id="sj-m-council"
                label="Consejo comunitario"
                value={draftCouncil}
                placeholder="Todos los consejos"
                options={facets.councils}
                onChange={setDraftCouncil}
                className={selectClassName}
              />
              <FacetSelect
                id="sj-m-type"
                label="Tipo de documento"
                value={draftType}
                placeholder="Todos los tipos"
                options={facets.documentTypes}
                getOptionLabel={getDocumentTypeFilterLabel}
                onChange={setDraftType}
                className={selectClassName}
              />
            </div>

            <div className="absolute bottom-0 left-0 right-0 flex gap-4 rounded-b-[32px] border-t border-[#e8dfd3] bg-[#f8f5f2] p-5">
              <button
                type="button"
                onClick={() => {
                  setDraftYear("");
                  setDraftAuthor("");
                  setDraftCouncil("");
                  setDraftType("");
                  setDraftTheme("");
                }}
                className="inline-flex h-[48px] flex-1 items-center justify-center rounded-full border border-[#e8dfd3] bg-white px-6 text-sm font-bold text-[#4a4540] shadow-sm transition hover:bg-[#f0eae0] active:scale-95"
              >
                Restablecer
              </button>
              <button
                type="button"
                onClick={() => {
                  applyFilters({
                    year: draftYear,
                    author: draftAuthor,
                    council: draftCouncil,
                    documentType: draftType,
                    theme: draftTheme,
                  });
                  setMobileDrawerOpen(false);
                }}
                className="inline-flex h-[48px] flex-1 items-center justify-center rounded-full px-6 text-sm font-bold text-white shadow-md transition hover:opacity-90 active:scale-95"
                style={{ backgroundColor: accentColor }}
              >
                Aplicar filtros
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function FacetSelect({
  id,
  label,
  value,
  placeholder,
  options,
  onChange,
  className,
  getOptionLabel,
}: {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  options: string[];
  onChange: (value: string) => void;
  className: string;
  getOptionLabel?: (value: string) => string;
}) {
  return (
    <div className="flex min-w-[150px] flex-1 flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-bold uppercase tracking-[0.16em] text-[#7a756e]">
        {label}
      </label>
      <select id={id} value={value} onChange={(event) => onChange(event.target.value)} className={className}>
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {getOptionLabel ? getOptionLabel(option) : option}
          </option>
        ))}
      </select>
    </div>
  );
}
