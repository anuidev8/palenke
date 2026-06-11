"use client";

import Link from "next/link";
import { RotateCcw, X } from "lucide-react";
import type { ViewerRole } from "@/lib/mock-data";
import { withRole } from "@/lib/viewer";
import {
  getDocumentTypeFilterLabel,
  hasActiveSeguridadJuridicaFilters,
  type SeguridadJuridicaFilters,
} from "@/lib/seguridad-juridica-filters";

type SeguridadJuridicaFilterSummaryProps = {
  role: ViewerRole;
  instrumento: string;
  submodulo: string;
  filters: SeguridadJuridicaFilters;
  totalCount: number;
};

export function SeguridadJuridicaFilterSummary({
  role,
  instrumento,
  submodulo,
  filters,
  totalCount,
}: SeguridadJuridicaFilterSummaryProps) {
  const isAnyFilterActive = hasActiveSeguridadJuridicaFilters(filters);

  function buildFilterHref(updated: Partial<SeguridadJuridicaFilters>) {
    const merged = { ...filters, ...updated };
    return withRole(`/gobierno-propio/${instrumento}`, role, {
      submodulo,
      q: merged.query || undefined,
      year: merged.year || undefined,
      author: merged.author || undefined,
      council: merged.council || undefined,
      tipo: merged.documentType || undefined,
      theme: merged.theme || undefined,
    });
  }

  const clearAllHref = withRole(`/gobierno-propio/${instrumento}`, role, { submodulo });

  const activeDescriptions: string[] = [];
  if (filters.query) activeDescriptions.push(`Búsqueda: "${filters.query}"`);
  if (filters.year) activeDescriptions.push(`Año: ${filters.year}`);
  if (filters.theme) activeDescriptions.push(`Área: ${filters.theme}`);
  if (filters.author) activeDescriptions.push(`Autor: ${filters.author}`);
  if (filters.council) activeDescriptions.push(`Consejo: ${filters.council}`);
  if (filters.documentType) {
    activeDescriptions.push(`Tipo: ${getDocumentTypeFilterLabel(filters.documentType)}`);
  }

  return (
    <div className="space-y-4" aria-live="polite" role="status">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e8dfd3] pb-4">
        <p className="text-sm text-[#4a4540]">
          {totalCount > 0 ? (
            <>
              <strong className="font-semibold text-[#1a1a1a]">{totalCount}</strong> documento
              {totalCount !== 1 ? "s" : ""} encontrado{totalCount !== 1 ? "s" : ""}
              {isAnyFilterActive ? (
                <span className="text-[#7a756e]">
                  {" para "}
                  <span className="font-medium italic text-[#1a1a1a]">
                    {activeDescriptions.join(", ")}
                  </span>
                </span>
              ) : null}
            </>
          ) : (
            <span className="font-medium text-[#d32f2f]">
              No se encontraron documentos para los criterios seleccionados
            </span>
          )}
        </p>

        {isAnyFilterActive ? (
          <Link
            href={clearAllHref}
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-[#7a756e] transition hover:text-[#1a1a1a]"
          >
            <RotateCcw className="h-3 w-3" />
            Limpiar filtros
          </Link>
        ) : null}
      </div>

      {isAnyFilterActive ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#7a756e]">
            Filtros activos:
          </span>

          {filters.query ? (
            <FilterPill
              href={buildFilterHref({ query: "" })}
              label="Búsqueda"
              value={`"${filters.query}"`}
            />
          ) : null}
          {filters.year ? (
            <FilterPill href={buildFilterHref({ year: "" })} label="Año" value={filters.year} />
          ) : null}
          {filters.theme ? (
            <FilterPill href={buildFilterHref({ theme: "" })} label="Área" value={filters.theme} />
          ) : null}
          {filters.author ? (
            <FilterPill href={buildFilterHref({ author: "" })} label="Autor" value={filters.author} />
          ) : null}
          {filters.council ? (
            <FilterPill
              href={buildFilterHref({ council: "" })}
              label="Consejo"
              value={filters.council}
            />
          ) : null}
          {filters.documentType ? (
            <FilterPill
              href={buildFilterHref({ documentType: "" })}
              label="Tipo"
              value={getDocumentTypeFilterLabel(filters.documentType)}
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function FilterPill({
  href,
  label,
  value,
}: {
  href: string;
  label: string;
  value: string;
}) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-1 rounded-full border border-[#e8dfd3] bg-white px-2.5 py-1 text-xs font-medium text-[#1a1a1a] transition hover:border-[#d32f2f] hover:bg-[#fddede] hover:text-[#d32f2f]"
    >
      <span className="text-[#7a756e] group-hover:text-inherit">{label}:</span>
      <span>{value}</span>
      <X className="ml-0.5 h-3 w-3 shrink-0 text-[#7a756e] group-hover:text-inherit" />
    </Link>
  );
}
