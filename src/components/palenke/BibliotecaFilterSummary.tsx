"use client";

import Link from "next/link";
import { X, RotateCcw } from "lucide-react";
import type { LibraryFilters } from "@/lib/mock-queries";
import { withRole } from "@/lib/viewer";
import type { ViewerRole } from "@/lib/mock-data";

type BibliotecaFilterSummaryProps = {
  role: ViewerRole;
  filters: LibraryFilters;
  totalCount: number;
  pageStart: number;
  pageEnd: number;
};

export default function BibliotecaFilterSummary({
  role,
  filters,
  totalCount,
  pageStart,
  pageEnd,
}: BibliotecaFilterSummaryProps) {
  // Check if any filter is active
  const hasQuery = Boolean(filters.query);
  const hasTerritory = Boolean(filters.territory);
  const hasYear = Boolean(filters.year);
  const hasType = Boolean(filters.type);
  const hasGender = filters.genderOnly;
  const hasTopics = filters.topics.length > 0;

  const isAnyFilterActive = hasQuery || hasTerritory || hasYear || hasType || hasGender || hasTopics;

  // Build the helper to construct URLs with updated filters
  function buildFilterHref(updatedFilters: Partial<LibraryFilters>) {
    const merged = { ...filters, ...updatedFilters };
    return withRole("/biblioteca", role, {
      q: merged.query || undefined,
      section: merged.sections.length > 0 ? merged.sections : undefined,
      territory: merged.territory || undefined,
      type: merged.type || undefined,
      year: merged.year || undefined,
      gender: merged.genderOnly ? "1" : undefined,
      topic: merged.topics.length > 0 ? merged.topics : undefined,
    });
  }

  // Define clear all href (preserves sections if any are active)
  const clearAllHref = withRole(
    "/biblioteca",
    role,
    filters.sections.length > 0 ? { section: filters.sections } : undefined
  );

  // Build the textual description of what filters are active
  const activeDescriptions: string[] = [];
  if (hasQuery) activeDescriptions.push(`Búsqueda: "${filters.query}"`);
  if (hasTerritory) activeDescriptions.push(`Territorio: ${filters.territory}`);
  if (hasYear) activeDescriptions.push(`Año: ${filters.year}`);
  if (hasType) activeDescriptions.push(`Tipo: ${filters.type}`);
  if (hasGender) activeDescriptions.push("Enfoque de género");
  if (hasTopics) {
    filters.topics.forEach((topic) => activeDescriptions.push(`Palabra clave: ${topic}`));
  }

  return (
    <div className="space-y-4" aria-live="polite" role="status">
      {/* Textual summary */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e8dfd3] pb-4">
        <div>
          <p className="text-sm text-[#4a4540]">
            {totalCount > 0 ? (
              <>
                Mostrando <strong className="font-semibold text-[#1a1a1a]">{pageStart + 1}–{pageEnd}</strong> de{" "}
                <strong className="font-semibold text-[#1a1a1a]">{totalCount}</strong> documento{totalCount !== 1 ? "s" : ""}
                {isAnyFilterActive ? (
                  <span className="text-[#7a756e]">
                    {" para "}
                    <span className="italic font-medium text-[#1a1a1a]">
                      {activeDescriptions.join(", ")}
                    </span>
                  </span>
                ) : null}
              </>
            ) : (
              <span className="text-[#d32f2f] font-medium">
                No se encontraron documentos para los criterios seleccionados
              </span>
            )}
          </p>
        </div>

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

      {/* Interactive Pills */}
      {isAnyFilterActive ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#7a756e] mr-1">
            Filtros activos:
          </span>

          {hasQuery ? (
            <Link
              href={buildFilterHref({ query: "" })}
              className="inline-flex items-center gap-1 rounded-full border border-[#e8dfd3] bg-white px-2.5 py-1 text-xs font-medium text-[#1a1a1a] transition hover:bg-[#fddede] hover:border-[#d32f2f] hover:text-[#d32f2f] group"
              title="Quitar búsqueda"
            >
              <span className="text-[#7a756e] group-hover:text-inherit">Búsqueda:</span>
              <span>"{filters.query}"</span>
              <X className="h-3 w-3 shrink-0 ml-0.5 text-[#7a756e] group-hover:text-inherit" />
            </Link>
          ) : null}

          {hasTerritory ? (
            <Link
              href={buildFilterHref({ territory: "" })}
              className="inline-flex items-center gap-1 rounded-full border border-[#e8dfd3] bg-white px-2.5 py-1 text-xs font-medium text-[#1a1a1a] transition hover:bg-[#fddede] hover:border-[#d32f2f] hover:text-[#d32f2f] group"
              title="Quitar filtro territorio"
            >
              <span className="text-[#7a756e] group-hover:text-inherit">Territorio:</span>
              <span>{filters.territory}</span>
              <X className="h-3 w-3 shrink-0 ml-0.5 text-[#7a756e] group-hover:text-inherit" />
            </Link>
          ) : null}

          {hasYear ? (
            <Link
              href={buildFilterHref({ year: "" })}
              className="inline-flex items-center gap-1 rounded-full border border-[#e8dfd3] bg-white px-2.5 py-1 text-xs font-medium text-[#1a1a1a] transition hover:bg-[#fddede] hover:border-[#d32f2f] hover:text-[#d32f2f] group"
              title="Quitar filtro año"
            >
              <span className="text-[#7a756e] group-hover:text-inherit">Año:</span>
              <span>{filters.year}</span>
              <X className="h-3 w-3 shrink-0 ml-0.5 text-[#7a756e] group-hover:text-inherit" />
            </Link>
          ) : null}

          {hasType ? (
            <Link
              href={buildFilterHref({ type: "" })}
              className="inline-flex items-center gap-1 rounded-full border border-[#e8dfd3] bg-white px-2.5 py-1 text-xs font-medium text-[#1a1a1a] transition hover:bg-[#fddede] hover:border-[#d32f2f] hover:text-[#d32f2f] group"
              title="Quitar filtro tipo"
            >
              <span className="text-[#7a756e] group-hover:text-inherit">Tipo:</span>
              <span>{filters.type}</span>
              <X className="h-3 w-3 shrink-0 ml-0.5 text-[#7a756e] group-hover:text-inherit" />
            </Link>
          ) : null}

          {hasGender ? (
            <Link
              href={buildFilterHref({ genderOnly: false })}
              className="inline-flex items-center gap-1 rounded-full border border-[#e8dfd3] bg-white px-2.5 py-1 text-xs font-medium text-[#1a1a1a] transition hover:bg-[#fddede] hover:border-[#d32f2f] hover:text-[#d32f2f] group"
              title="Quitar enfoque de género"
            >
              <span>Enfoque de género</span>
              <X className="h-3 w-3 shrink-0 ml-0.5 text-[#7a756e] group-hover:text-inherit" />
            </Link>
          ) : null}

          {hasTopics
            ? filters.topics.map((topic) => (
                <Link
                  key={topic}
                  href={buildFilterHref({
                    topics: filters.topics.filter((t) => t !== topic),
                  })}
                  className="inline-flex items-center gap-1 rounded-full border border-[#d8f3dc] bg-[#f4fbf5] px-2.5 py-1 text-xs font-medium text-[#1b5e20] transition hover:bg-[#fddede] hover:border-[#d32f2f] hover:text-[#d32f2f] group"
                  title={`Quitar palabra clave: ${topic}`}
                >
                  <span className="text-[#2e7d32]/70 group-hover:text-inherit">Tema:</span>
                  <span>{topic}</span>
                  <X className="h-3 w-3 shrink-0 ml-0.5 text-[#2e7d32] group-hover:text-inherit" />
                </Link>
              ))
            : null}
        </div>
      ) : null}
    </div>
  );
}
