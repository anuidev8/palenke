import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { EmptyState, SiteLayout } from "@/components/mock/ui";
import BibliotecaAiSearchPanel from "@/components/palenke/BibliotecaAiSearchPanel";
import BibliotecaDocGrid from "@/components/palenke/BibliotecaDocGrid";
import BibliotecaMemoriaGrid from "@/components/palenke/BibliotecaMemoriaGrid";
import BibliotecaCategoryNav from "@/components/palenke/BibliotecaCategoryNav";
import {
  getVisibleDocuments,
  librarySections,
  territories,
} from "@/lib/mock-data";
import { filterDocuments, getDocumentYears, type LibraryFilters } from "@/lib/mock-queries";
import { getFirstParam, getMultiParam, getViewerRole, type SearchParams, withRole } from "@/lib/viewer";

const PAGE_SIZE = 10;
const NORMATIVA_SECTION = "Normativa vigente";

const normativaTypeLabels: Array<{ type: string; label: string }> = [
  { type: "Constitución", label: "Base estructural · Constitución" },
  { type: "Ley", label: "Derechos colectivos · Leyes" },
  { type: "Decreto", label: "Desarrollo reglamentario · Decretos" },
  { type: "Jurisprudencia", label: "Sentencias estructurales · Jurisprudencia" },
  { type: "Instrumento internacional", label: "Marco global · Normativa internacional" },
  { type: "Política pública", label: "Incidencia institucional · Políticas públicas" },
  { type: "Instancia oficial", label: "Mecanismos oficiales · Instancias" },
];

function normalizeSectionLabel(section: string) {
  return section === "Norma vigente" ? NORMATIVA_SECTION : section;
}

function parseFilters(params: SearchParams): LibraryFilters {
  return {
    query: getFirstParam(params.q) ?? "",
    sections: getMultiParam(params.section).map(normalizeSectionLabel),
    territory: getFirstParam(params.territory) ?? "",
    type: getFirstParam(params.type) ?? "",
    year: getFirstParam(params.year) ?? "",
    genderOnly: getFirstParam(params.gender) === "1",
  };
}

export default async function BibliotecaPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const role = getViewerRole(params);
  const filters = parseFilters(params);
  const initialSearchQuery = getFirstParam(params.aiq) ?? "";
  const page = Math.max(1, Number(getFirstParam(params.page) ?? "1"));

  const visibleDocuments = getVisibleDocuments(role).toSorted((a, b) => b.year - a.year);
  const results = filterDocuments(visibleDocuments, filters);
  const years = getDocumentYears(visibleDocuments);
  const docsForSectionContext =
    filters.sections.length > 0
      ? visibleDocuments.filter((document) => filters.sections.includes(document.section))
      : visibleDocuments;
  const types = Array.from(new Set(docsForSectionContext.map((document) => document.type))).toSorted();

  const totalCount = results.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pageEnd = Math.min(pageStart + PAGE_SIZE, totalCount);
  const pageResults = results.slice(pageStart, pageEnd);

  const activeFilters = buildActiveFilters(filters, role);

  const sectionActive = filters.sections[0] ?? "";
  const typeChips =
    sectionActive === NORMATIVA_SECTION
      ? normativaTypeLabels.filter(({ type }) => types.includes(type))
      : types.map((type) => ({ type, label: type }));

  return (
    <SiteLayout
      role={role}
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "Memoria Afroterritorial", href: "/memoria-afroterritorial" },
        ...(sectionActive ? [{ label: sectionActive }] : []),
      ]}
      floatingPanel={
        <BibliotecaAiSearchPanel
          role={role}
          documents={results}
          initialQuery={initialSearchQuery}
          activeFilters={activeFilters}
          clearFiltersHref={withRole("/biblioteca", role)}
          showInlineSummary={false}
        />
      }
    >
      {/* ── Page header ── */}
      <section className="border-b border-[#e8dfd3] bg-[#f8f5f2] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <div className="flex items-start gap-4">
            {/* Green left-border accent */}
            <div className="mt-1 h-12 w-1 shrink-0 rounded-full bg-[#2e7d32]" aria-hidden="true" />
            <div>
              <h1 className="font-display text-4xl text-[#1a1a1a]">
                {sectionActive || "Memoria Afroterritorial"}
              </h1>
              <p className="mt-2 max-w-2xl text-base text-[#4a4540]">
                {sectionActive === "Normativa vigente"
                  ? "Módulo legislativo del Palenke — Constitución, leyes, decretos, jurisprudencia, normativa internacional y políticas públicas organizadas para navegación temática."
                  : "Corpus documental del Palenke — resoluciones, planes de manejo, acuerdos y materiales de base. Filtros por tipo, territorio y año."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl px-4 pb-44 pt-8 sm:px-6 lg:px-8">
        <BibliotecaCategoryNav
          sections={[
            {
              label: "Toda la biblioteca",
              href: withRole("/biblioteca", role, buildFilters({ ...filters, sections: [], type: "" })),
              isActive: filters.sections.length === 0,
            },
            ...librarySections.map((section) => ({
              label: section,
              href: withRole("/biblioteca", role, buildFilters({ ...filters, sections: [section], type: "" })),
              isActive: sectionActive === section,
            })),
          ]}
          types={
            typeChips.length > 1
              ? [
                  {
                    type: "",
                    label: sectionActive ? `Todas en ${sectionActive}` : "Todos los tipos",
                    href: withRole("/biblioteca", role, buildFilters({ ...filters, type: "" })),
                    isActive: !filters.type,
                  },
                  ...typeChips.map((chip) => ({
                    type: chip.type,
                    label: chip.label,
                    href: withRole("/biblioteca", role, buildFilters({ ...filters, type: chip.type })),
                    isActive: filters.type === chip.type,
                  })),
                ]
              : []
          }
        />
        
        {/* ── Filter bar ── */}
        <form
          action="/biblioteca"
          className="mb-6 flex flex-wrap items-end gap-3 rounded-[28px] border border-[#e8dfd3] bg-white px-5 py-4"
        >
          {role !== "public" ? <input type="hidden" name="role" value={role} /> : null}

          <div className="flex min-w-[220px] flex-1 flex-col gap-1.5">
            <label htmlFor="q" className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7a756e]">
              Buscar
            </label>
            <input
              id="q"
              name="q"
              type="search"
              defaultValue={filters.query}
              placeholder="Buscar por título o palabra clave…"
              className="input-shell"
            />
          </div>

          {filters.sections.map((section) => (
            <input key={section} type="hidden" name="section" value={section} />
          ))}
          {filters.type ? <input type="hidden" name="type" value={filters.type} /> : null}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="f-territory" className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7a756e]">
              Territorio
            </label>
            <select id="f-territory" name="territory" defaultValue={filters.territory} className="input-shell">
              <option value="">Todos</option>
              {territories.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="f-year" className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7a756e]">
              Año
            </label>
            <select id="f-year" name="year" defaultValue={filters.year} className="input-shell">
              <option value="">Todos</option>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="inline-flex h-[44px] items-center rounded-full bg-[#1a1a1a] px-5 text-sm font-semibold text-white transition hover:bg-[#2c2c2c]"
            >
              Buscar
            </button>
            <Link
              href={withRole("/biblioteca", role)}
              className="inline-flex h-[44px] items-center rounded-full border border-[#e8dfd3] px-5 text-sm font-medium text-[#4a4540] transition hover:bg-[#f0eae0]"
            >
              Limpiar
            </Link>
          </div>
        </form>

        {/* ── Result count ── */}
        {results.length > 0 ? (
          <p className="mb-4 text-sm text-[#7a756e]">
            Mostrando {pageStart + 1}–{pageEnd} de {totalCount} documento{totalCount !== 1 ? "s" : ""}
          </p>
        ) : null}

        {/* ── Document grid ── */}
        {pageResults.length > 0 ? (
          <>
            {sectionActive === "Memoria viva del territorio" ? (
              <BibliotecaMemoriaGrid docs={pageResults} />
            ) : (
              <BibliotecaDocGrid docs={pageResults} />
            )}

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-between px-1 text-sm text-[#7a756e]">
              <span>
                Página {currentPage} de {totalPages}
              </span>
              <div className="flex items-center gap-2">
                {currentPage > 1 ? (
                  <Link
                    href={withRole("/biblioteca", role, {
                      ...buildFilters(filters),
                      page: String(currentPage - 1),
                    })}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#e8dfd3] transition hover:bg-[#f0eae0]"
                    aria-label="Página anterior"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                ) : (
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#e8dfd3] opacity-30">
                    <ArrowLeft className="h-4 w-4" />
                  </span>
                )}

                <span className="inline-flex h-8 min-w-[32px] items-center justify-center rounded-full bg-[#1a1a1a] px-2 text-xs font-semibold text-white">
                  {currentPage}
                </span>

                {currentPage < totalPages ? (
                  <Link
                    href={withRole("/biblioteca", role, {
                      ...buildFilters(filters),
                      page: String(currentPage + 1),
                    })}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#e8dfd3] transition hover:bg-[#f0eae0]"
                    aria-label="Página siguiente"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#e8dfd3] opacity-30">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </div>
            </div>
          </>
        ) : (
          <EmptyState
            title="No encontramos documentos"
            description="No hay coincidencias con los filtros seleccionados. Ajusta la búsqueda o limpia los filtros activos."
            action={
              <Link href={withRole("/biblioteca", role)} className="button-primary">
                Limpiar filtros
              </Link>
            }
          />
        )}
      </div>
    </SiteLayout>
  );
}

function buildActiveFilters(filters: LibraryFilters, role: "public" | "internal" | "admin") {
  const active: Array<{ label: string; href: string }> = [];
  if (filters.query) {
    active.push({ label: filters.query, href: withRole("/biblioteca", role, buildFilters({ ...filters, query: "" })) });
  }
  for (const section of filters.sections) {
    active.push({ label: section, href: withRole("/biblioteca", role, buildFilters({ ...filters, sections: filters.sections.filter((s) => s !== section) })) });
  }
  for (const key of ["territory", "type", "year"] as const) {
    if (filters[key]) {
      active.push({ label: filters[key], href: withRole("/biblioteca", role, buildFilters({ ...filters, [key]: "" })) });
    }
  }
  if (filters.genderOnly) {
    active.push({ label: "Con enfoque de género", href: withRole("/biblioteca", role, buildFilters({ ...filters, genderOnly: false })) });
  }
  return active;
}

function buildFilters(filters: LibraryFilters) {
  return {
    q: filters.query || undefined,
    section: filters.sections.length > 0 ? filters.sections : undefined,
    territory: filters.territory || undefined,
    type: filters.type || undefined,
    year: filters.year || undefined,
    gender: filters.genderOnly ? "1" : undefined,
  };
}
