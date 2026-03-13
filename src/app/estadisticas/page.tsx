import Link from "next/link";
import {
  Callout,
  DashboardCard,
  EmptyState,
  SectionHeader,
  SiteLayout,
  SkeletonGrid,
} from "@/components/mock/ui";
import { getVisibleDashboards } from "@/lib/mock-data";
import { filterDashboards, getDashboardTopics } from "@/lib/mock-queries";
import { getFirstParam, getViewerRole, type SearchParams, withRole } from "@/lib/viewer";

export default async function EstadisticasPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const role = getViewerRole(params);
  const topic = getFirstParam(params.topic) ?? "";
  const territory = getFirstParam(params.territory) ?? "";
  const state = getFirstParam(params.state);
  const dashboards = getVisibleDashboards(role);
  const filtered = filterDashboards(dashboards, { topic, territory });
  const topics = getDashboardTopics(dashboards);

  return (
    <SiteLayout
      role={role}
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "Estadísticas y tableros" },
      ]}
    >
      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <SectionHeader
            eyebrow="Power BI"
            title="Estadísticas y tableros"
            description="Catálogo de tableros del equipo SIG de Hileros/PCN con filtros básicos por tema y territorio."
          />
          <Callout tone="info" title="Nota informativa">
            <p>
              Los tableros son generados por el equipo SIG de Hileros/PCN. Los filtros y mapas pertenecen a Power BI;
              esta plataforma solo los presenta.
            </p>
          </Callout>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="surface-card h-fit">
            <form action="/estadisticas" className="grid gap-5">
              {role !== "public" ? <input type="hidden" name="role" value={role} /> : null}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[color:var(--forest)]">Tema</label>
                <select name="topic" defaultValue={topic} className="input-shell">
                  <option value="">Todos</option>
                  {topics.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-[color:var(--forest)]">Territorio</label>
                <input
                  name="territory"
                  defaultValue={territory}
                  placeholder="Ej: Naya"
                  className="input-shell"
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <button type="submit" className="button-primary">
                  Filtrar
                </button>
                <Link href={withRole("/estadisticas", role)} className="button-ghost">
                  Limpiar
                </Link>
              </div>
            </form>
          </aside>

          <div className="space-y-5">
            {state === "loading" ? (
              <SkeletonGrid count={4} />
            ) : filtered.length > 0 ? (
              <div className="grid gap-5 xl:grid-cols-2">
                {filtered.map((dashboard) => (
                  <DashboardCard key={dashboard.id} dashboard={dashboard} role={role} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No hay tableros para esos filtros"
                description="Revisa el tema o el territorio, o limpia la búsqueda para volver al catálogo completo."
                action={
                  <Link href={withRole("/estadisticas", role)} className="button-primary">
                    Limpiar
                  </Link>
                }
              />
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

