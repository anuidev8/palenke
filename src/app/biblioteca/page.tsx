import Link from "next/link";
import { ArrowLeft, ArrowRight, FileText, Lock } from "lucide-react";
import { EmptyState, SiteLayout } from "@/components/mock/ui";
import BibliotecaAiSearchPanel from "@/components/palenke/BibliotecaAiSearchPanel";
import {
  getVisibleDocuments,
  librarySections,
  territories,
} from "@/lib/mock-data";
import { filterDocuments, getDocumentYears, type LibraryFilters } from "@/lib/mock-queries";
import { getFirstParam, getMultiParam, getViewerRole, type SearchParams, withRole } from "@/lib/viewer";

const PAGE_SIZE = 10;

function parseFilters(params: SearchParams): LibraryFilters {
  return {
    query: getFirstParam(params.q) ?? "",
    sections: getMultiParam(params.section),
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

  const totalCount = results.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pageEnd = Math.min(pageStart + PAGE_SIZE, totalCount);
  const pageResults = results.slice(pageStart, pageEnd);

  const activeFilters = buildActiveFilters(filters, role);

  const sectionActive = filters.sections[0] ?? "";

  return (
    <SiteLayout
      role={role}
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "Memoria Afroterritorial", href: "/biblioteca" },
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
                Corpus documental del Palenke — resoluciones, planes de manejo, acuerdos y
                materiales de base. Filtros por tipo, territorio y año.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl px-4 pb-44 pt-8 sm:px-6 lg:px-8">
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

          <div className="flex flex-col gap-1.5">
            <label htmlFor="f-section" className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7a756e]">
              Sección
            </label>
            <select id="f-section" name="section" defaultValue={filters.sections[0] ?? ""} className="input-shell">
              <option value="">Todas</option>
              {librarySections.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

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

        {/* ── Document table ── */}
        {pageResults.length > 0 ? (
          <>
            <div className="overflow-hidden rounded-[28px] border border-[#e8dfd3] bg-white">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] divide-y divide-[#e8dfd3] text-left text-sm">
                  <thead>
                    <tr className="bg-[#1a1a1a]">
                      {["Título", "Tipo", "Territorio", "Año", "Etiquetas", "Acción"].map((h) => (
                        <th
                          key={h}
                          className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-white"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e8dfd3]">
                    {pageResults.map((doc, i) => (
                      <tr
                        key={doc.id}
                        className={`align-top transition-colors hover:bg-[#f0eae0] ${
                          i % 2 === 0 ? "bg-white" : "bg-[#fafaf8]"
                        }`}
                      >
                        {/* Título */}
                        <td className="max-w-[260px] px-5 py-4">
                          <div className="flex items-start gap-2">
                            {doc.visibility !== "public" ? (
                              <Lock
                                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#7a756e]"
                                aria-label="Acceso restringido"
                              />
                            ) : null}
                            <span className="line-clamp-2 font-medium text-[#1a1a1a]">
                              {doc.title}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-[#7a756e]">{doc.section}</p>
                        </td>

                        {/* Tipo */}
                        <td className="whitespace-nowrap px-5 py-4 text-[#4a4540]">{doc.type}</td>

                        {/* Territorio */}
                        <td className="whitespace-nowrap px-5 py-4 text-[#4a4540]">
                          {doc.territory}
                        </td>

                        {/* Año */}
                        <td className="whitespace-nowrap px-5 py-4 text-[#4a4540]">{doc.year}</td>

                        {/* Etiquetas */}
                        <td className="px-5 py-4">
                          <div className="flex flex-wrap gap-1">
                            {doc.keywords.slice(0, 2).map((kw) => (
                              <span
                                key={kw}
                                className="inline-flex items-center rounded-full border border-[#e8dfd3] bg-white px-2 py-0.5 text-[10px] font-medium text-[#4a4540]"
                              >
                                {kw}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Acción */}
                        <td className="whitespace-nowrap px-5 py-4">
                          {doc.visibility === "sensitive" ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fddede] px-3 py-1.5 text-xs font-semibold text-[#d32f2f]">
                              <Lock className="h-3 w-3" aria-hidden="true" />
                              Restringido
                            </span>
                          ) : (
                            <Link
                              href={withRole(`/biblioteca/${doc.slug}`, role)}
                              className="inline-flex items-center gap-1.5 rounded-full bg-[#2e7d32] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#1b5e20]"
                            >
                              <FileText className="h-3 w-3" aria-hidden="true" />
                              Ver PDF
                            </Link>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between border-t border-[#e8dfd3] px-5 py-4 text-sm text-[#7a756e]">
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
