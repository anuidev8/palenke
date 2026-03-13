import Link from "next/link";
import {
  CampaignCard,
  EmptyState,
  FilterChip,
  SectionHeader,
  SiteLayout,
  SkeletonGrid,
} from "@/components/mock/ui";
import DocumentCard from "@/components/palenke/DocumentCard";
import { getGeneratedImage } from "@/lib/generate-image";
import { getVisibleCampaigns, getVisibleDocuments, instrumentTypes, librarySections, territories } from "@/lib/mock-data";
import { filterDocuments, getDocumentYears, type LibraryFilters } from "@/lib/mock-queries";
import { getFirstParam, getMultiParam, getViewerRole, type SearchParams, withRole } from "@/lib/viewer";

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
  const state = getFirstParam(params.state);
  const visibleDocuments = getVisibleDocuments(role).toSorted((a, b) => b.year - a.year);
  const featuredCampaigns = getVisibleCampaigns(role, "biblioteca");
  const results = filterDocuments(visibleDocuments, filters);
  const years = getDocumentYears(visibleDocuments);
  const activeFilters = buildActiveFilters(filters, role);

  const thumbUrl = await getGeneratedImage(
    "doc-thumbnail", 
    "A simple, flat minimalist icon-like abstract shape representing layers of territory: forest, river, and coastline. Geometric and organic blend. Colors: deep forest green on a warm sand background. No faces, no text, no realistic details. High contrast, serious and grounded tone."
  );

  return (
    <SiteLayout
      role={role}
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "Biblioteca Base" },
      ]}
    >
      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:hidden">
          <SectionHeader
            eyebrow="Biblioteca Base"
            title="Corpus documental del Palenke"
            description="Explora documentos públicos y, según el rol, también materiales internos autorizados."
          />
          <details className="surface-card">
            <summary className="text-sm font-semibold text-[color:var(--forest)]">Filtrar resultados</summary>
            <div className="mt-5">
              <FilterForm role={role} filters={filters} years={years} />
            </div>
          </details>
        </div>

        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          <aside className="hidden lg:block">
            <div className="surface-card sticky top-24">
              <FilterForm role={role} filters={filters} years={years} />
            </div>
          </aside>

          <div className="space-y-6">
            <div className="surface-card">
              <div className="flex flex-col gap-4 border-b border-[color:var(--border-soft)] pb-5 lg:flex-row lg:items-end lg:justify-between">
                <div className="space-y-3">
                  <SectionHeader
                    eyebrow="Biblioteca Base"
                    title="Resultados documentales"
                    description="Las fichas públicas e internas respetan el filtro automático por visibilidad."
                  />
                  <p className="text-sm text-[color:var(--muted)]">{results.length} documentos encontrados</p>
                </div>
                <div className="rounded-full bg-[color:var(--sand-strong)] px-4 py-2 text-sm text-[color:var(--forest)]">
                  Ordenar por: Más reciente
                </div>
              </div>

              {activeFilters.length > 0 ? (
                <div className="mt-5 flex flex-wrap gap-2">
                  {activeFilters.map((filter) => (
                    <FilterChip key={filter.label} label={filter.label} href={filter.href} />
                  ))}
                  <Link href={withRole("/biblioteca", role)} className="button-ghost">
                    Limpiar filtros
                  </Link>
                </div>
              ) : null}
            </div>

            {state === "loading" ? (
              <SkeletonGrid count={6} />
            ) : results.length > 0 ? (
              <>
                <div className="grid gap-5 xl:grid-cols-2">
                  {results.map((document) => (
                    <DocumentCard 
                      key={document.id} 
                      title={document.title} 
                      category={document.section} 
                      date={document.year.toString()} 
                      visibility={document.visibility === "public" ? "publico" : document.visibility === "internal" ? "interno" : "sensible"} 
                      thumbnailUrl={thumbUrl}
                      href={withRole(`/biblioteca/${document.slug}`, role)}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between rounded-[28px] border border-[color:var(--border-soft)] bg-white px-5 py-4 text-sm text-[color:var(--muted-strong)]">
                  <span>Paginación mockup</span>
                  <div className="flex items-center gap-2">
                    <button type="button" className="button-ghost">
                      ←
                    </button>
                    <span className="chip">1</span>
                    <button type="button" className="button-ghost">
                      →
                    </button>
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
        </div>
      </section>

      {featuredCampaigns.length > 0 ? (
        <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Contenidos destacados"
            title="Campañas vinculadas a la Biblioteca"
            description="Campañas activas con materiales directamente relacionados con el corpus documental."
          />
          <div className="mt-8 grid gap-6">
            {featuredCampaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} role={role} />
            ))}
          </div>
        </section>
      ) : null}
    </SiteLayout>
  );
}

function FilterForm({
  role,
  filters,
  years,
}: {
  role: "public" | "internal" | "admin";
  filters: LibraryFilters;
  years: string[];
}) {
  return (
    <form action="/biblioteca" className="grid gap-6">
      {role !== "public" ? <input type="hidden" name="role" value={role} /> : null}
      <div>
        <label className="mb-2 block text-sm font-semibold text-[color:var(--forest)]">Buscar</label>
        <input
          type="search"
          name="q"
          defaultValue={filters.query}
          placeholder="Buscar por título o palabra clave…"
          className="input-shell"
        />
      </div>

      <fieldset className="grid gap-3">
        <legend className="text-sm font-semibold text-[color:var(--forest)]">Sección</legend>
        {librarySections.map((section) => (
          <label key={section} className="flex items-center gap-3 text-sm text-[color:var(--muted-strong)]">
            <input type="checkbox" name="section" value={section} defaultChecked={filters.sections.includes(section)} />
            <span>{section}</span>
          </label>
        ))}
      </fieldset>

      <div className="grid gap-4">
        <div>
          <label className="mb-2 block text-sm font-semibold text-[color:var(--forest)]">Territorio</label>
          <select name="territory" defaultValue={filters.territory} className="input-shell">
            <option value="">Todos</option>
            {territories.map((territory) => (
              <option key={territory} value={territory}>
                {territory}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-[color:var(--forest)]">Tipo de instrumento</label>
          <select name="type" defaultValue={filters.type} className="input-shell">
            <option value="">Todos</option>
            {instrumentTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-[color:var(--forest)]">Año</label>
          <select name="year" defaultValue={filters.year} className="input-shell">
            <option value="">Todos</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      <label className="flex items-center gap-3 rounded-[20px] bg-[color:var(--sand-strong)] px-4 py-3 text-sm text-[color:var(--forest)]">
        <input type="checkbox" name="gender" value="1" defaultChecked={filters.genderOnly} />
        <span>Con enfoque de género</span>
      </label>

      <div className="flex flex-wrap gap-3">
        <button type="submit" className="button-primary">
          Buscar
        </button>
        <Link href={withRole("/biblioteca", role)} className="button-ghost">
          Limpiar filtros
        </Link>
      </div>
    </form>
  );
}

function buildActiveFilters(filters: LibraryFilters, role: "public" | "internal" | "admin") {
  const active: Array<{ label: string; href: string }> = [];

  if (filters.query) {
    active.push({
      label: filters.query,
      href: withRole("/biblioteca", role, buildFilters({ ...filters, query: "" })),
    });
  }

  for (const section of filters.sections) {
    active.push({
      label: section,
      href: withRole(
        "/biblioteca",
        role,
        buildFilters({
          ...filters,
          sections: filters.sections.filter((item) => item !== section),
        }),
      ),
    });
  }

  for (const key of ["territory", "type", "year"] as const) {
    if (filters[key]) {
      active.push({
        label: filters[key],
        href: withRole("/biblioteca", role, buildFilters({ ...filters, [key]: "" })),
      });
    }
  }

  if (filters.genderOnly) {
    active.push({
      label: "Con enfoque de género",
      href: withRole("/biblioteca", role, buildFilters({ ...filters, genderOnly: false })),
    });
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
