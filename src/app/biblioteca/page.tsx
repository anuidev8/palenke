import Link from "next/link";
import { ArrowLeft, ArrowRight, Layers } from "lucide-react";
import { EmptyState, SiteLayout } from "@/components/mock/ui";
import BibliotecaAiSearchPanel from "@/components/palenke/BibliotecaAiSearchPanel";
import BibliotecaDocGrid from "@/components/palenke/BibliotecaDocGrid";
import BibliotecaMemoriaGrid from "@/components/palenke/BibliotecaMemoriaGrid";
import {
  getVisibleDocuments,
  territories,
} from "@/lib/mock-data";
import { filterDocuments, getDocumentYears, type LibraryFilters } from "@/lib/mock-queries";
import { getFirstParam, getMultiParam, getViewerRole, type SearchParams, withRole } from "@/lib/viewer";

const PAGE_SIZE = 10;
const NORMATIVA_SECTION = "Normativa vigente";

const SECTION_META: Record<string, {
  color: string;
  lightBg: string;
  darkBg: string;
  tagLabel: string;
  tagNum: string;
  description: string;
  whatYouFind: string;
  categories: string[];
  related: { label: string; href: string };
}> = {
  "Normativa vigente": {
    color: "#2e7d32",
    lightBg: "#d8f3dc",
    darkBg: "#1a2a1a",
    tagLabel: "Memoria Afroterritorial",
    tagNum: "01",
    description:
      "Aquí encuentras el marco normativo nacional e internacional que protege los derechos del Pueblo Negro. Organizado por tipo de norma para facilitar la búsqueda y el litigio estratégico.",
    whatYouFind: "¿Qué encuentras aquí?",
    categories: [
      "Constitución Política y bloque de constitucionalidad",
      "Leyes nacionales — Ley 70, Ley 21 y afines",
      "Decretos reglamentarios y resoluciones",
      "Jurisprudencia étnica (Corte Constitucional, Consejo de Estado)",
      "Normativa internacional y convenios OIT",
    ],
    related: {
      label: "Memoria viva del territorio",
      href: "/biblioteca?section=Memoria+viva+del+territorio",
    },
  },
  "Memoria viva del territorio": {
    color: "#1565c0",
    lightBg: "#e3f2fd",
    darkBg: "#0d1a2a",
    tagLabel: "Memoria Afroterritorial",
    tagNum: "02",
    description:
      "Corpus documental de producción propia: investigaciones académicas, sistematizaciones comunitarias y expresiones culturales del Pacífico colombiano.",
    whatYouFind: "¿Qué encuentras aquí?",
    categories: [
      "Artículos y publicaciones académicas afrodescendientes",
      "Sistematizaciones de experiencias comunitarias",
      "Planes de manejo territorial y acuerdos colectivos",
      "Prácticas culturales, saberes ancestrales y oralidad",
      "Expresiones artísticas y patrimonio vivo del Pacífico",
    ],
    related: {
      label: "Normativa vigente",
      href: "/biblioteca?section=Normativa+vigente",
    },
  },
};

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
      {sectionActive && SECTION_META[sectionActive] ? (() => {
        const meta = SECTION_META[sectionActive];
        return (
          <>
            {/* ── Context ribbon: "Estás en…" ── */}
            <div style={{ background: meta.darkBg }} className="px-4 py-3 sm:px-6 lg:px-8">
              <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4">
                {/* Left: breadcrumb trail */}
                <div className="flex items-center gap-2 text-sm">
                  <Link
                    href="/memoria-afroterritorial"
                    className="flex items-center gap-1.5 text-white/60 transition hover:text-white"
                  >
                    <Layers className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Memoria Afroterritorial</span>
                  </Link>
                  <span className="text-white/30" aria-hidden="true">›</span>
                  <span className="font-semibold text-white">{sectionActive}</span>
                </div>
                {/* Right: related section shortcut */}
                <Link
                  href={meta.related.href}
                  className="hidden items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/80 transition hover:bg-white/20 sm:flex"
                >
                  <ArrowRight className="h-3 w-3" aria-hidden="true" />
                  {meta.related.label}
                </Link>
              </div>
            </div>

            {/* ── Rich section header ── */}
            <section className="border-b border-[#e8dfd3] bg-[#f8f5f2] px-4 py-8 sm:px-6 lg:px-8">
              <div className="mx-auto w-full max-w-7xl">
                {/* Module tag */}
                <div className="mb-4 flex items-center gap-3">
                  <span
                    className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.18em]"
                    style={{ background: meta.lightBg, color: meta.color }}
                  >
                    <span
                      className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white"
                      style={{ background: meta.color }}
                    >
                      {meta.tagNum}
                    </span>
                    {meta.tagLabel}
                  </span>
                </div>

                {/* H1 with accent bar + back button */}
                <div className="flex items-start gap-4">
                  <div
                    className="mt-1 h-12 w-1 shrink-0 rounded-full"
                    style={{ background: meta.color }}
                    aria-hidden="true"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <Link
                        href={withRole("/memoria-afroterritorial", role)}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#e8dfd3] bg-white shadow-sm transition hover:bg-[#f0eae0] hover:shadow"
                        aria-label="Volver a Memoria Afroterritorial"
                      >
                        <ArrowLeft className="h-4 w-4 text-[#1a1a1a]" aria-hidden="true" />
                      </Link>
                      <h1 className="font-display text-4xl text-[#1a1a1a] sm:text-5xl">
                        {sectionActive}
                      </h1>
                    </div>
                    <p className="mt-3 max-w-2xl text-base leading-7 text-[#4a4540]">
                      {meta.description}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </>
        );
      })() : (
        /* ── Default header (no section filter active) ── */
        <section className="border-b border-[#e8dfd3] bg-[#f8f5f2] px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">
            <div className="flex items-start gap-4">
              <div className="mt-1 h-12 w-1 shrink-0 rounded-full bg-[#2e7d32]" aria-hidden="true" />
              <div>
                <h1 className="font-display text-4xl text-[#1a1a1a]">Memoria Afroterritorial</h1>
                <p className="mt-2 max-w-2xl text-base text-[#4a4540]">
                  Corpus documental del Palenke — resoluciones, planes de manejo, acuerdos y materiales de base. Filtros por tipo, territorio y año.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

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
              <BibliotecaDocGrid docs={pageResults} role={role} />
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
