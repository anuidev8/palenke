import Link from "next/link";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { EmptyState, SiteLayout } from "@/components/mock/ui";
import { getVisibleDashboards } from "@/lib/mock-data";
import { filterDashboards, getDashboardTopics } from "@/lib/mock-queries";
import { getViewerRoleFromRequest } from "@/lib/viewer-server";
import { getFirstParam, isInternal, type SearchParams, withRole } from "@/lib/viewer";

export default async function EstadisticasPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const role = await getViewerRoleFromRequest(params);
  const topic = getFirstParam(params.topic) ?? "";
  const territory = getFirstParam(params.territory) ?? "";
  const dashboards = getVisibleDashboards(role);
  const filtered = filterDashboards(dashboards, { topic, territory });
  const topics = getDashboardTopics(dashboards);

  const gradients = [
    "linear-gradient(135deg,#1565c0,#0d47a1)",
    "linear-gradient(135deg,#2e7d32,#1b5e20)",
    "linear-gradient(135deg,#f57f17,#e65100)",
    "linear-gradient(135deg,#6a1b9a,#4a148c)",
    "linear-gradient(135deg,#00695c,#004d40)",
    "linear-gradient(135deg,#c62828,#b71c1c)",
  ];

  return (
    <SiteLayout role={role}>
      {/* ── Dark hero header ── */}
      <section className="relative overflow-hidden bg-[#1a1a1a]">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 30% 60%, rgba(46,125,50,0.25), transparent 50%), radial-gradient(circle at 80% 20%, rgba(251,192,45,0.12), transparent 40%)",
          }}
        />
        <div className="relative mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <Link
            href={withRole("/", role)}
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-white/60 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Inicio
          </Link>
          <span className="eyebrow mb-4 block text-[#fbc02d]">Datos del territorio</span>
          <h1 className="font-display text-4xl text-white sm:text-5xl lg:text-[56px]">
            Mirador de datos del territorio
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/65">
            Catálogo de tableros del equipo de la Corporación Agencia Afrocolombiana Hileros/PCN. Explora indicadores territoriales,
            sociales y ambientales con filtros por tema y territorio.
          </p>

          {/* Filter bar */}
          <form
            action="/estadisticas"
            className="mt-8 flex flex-wrap items-end gap-3"
          >
            <div className="flex flex-col gap-1.5">
              <label htmlFor="f-topic" className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
                Tema
              </label>
              <select
                id="f-topic"
                name="topic"
                defaultValue={topic}
                className="h-[40px] rounded-full border border-white/20 bg-white/10 px-4 text-sm text-white focus:border-[#fbc02d] focus:outline-none"
              >
                <option value="" className="bg-[#1a1a1a]">Todos los temas</option>
                {topics.map((t) => (
                  <option key={t} value={t} className="bg-[#1a1a1a]">{t}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="f-territory" className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
                Territorio
              </label>
              <input
                id="f-territory"
                name="territory"
                defaultValue={territory}
                placeholder="Ej: Naya"
                className="h-[40px] rounded-full border border-white/20 bg-white/10 px-4 text-sm text-white placeholder-white/40 focus:border-[#fbc02d] focus:outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="inline-flex h-[40px] items-center rounded-full bg-[#2e7d32] px-5 text-sm font-semibold text-white transition hover:bg-[#1b5e20]"
              >
                Filtrar
              </button>
              <Link
                href={withRole("/estadisticas", role)}
                className="inline-flex h-[40px] items-center rounded-full border border-white/20 px-5 text-sm font-medium text-white/70 transition hover:bg-white/10"
              >
                Limpiar
              </Link>
            </div>
          </form>
        </div>
      </section>

      {/* ── Card grid ── */}
      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Back + result count */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-[#7a756e]">
            {filtered.length > 0
              ? `Mostrando ${filtered.length} tablero${filtered.length !== 1 ? "s" : ""}`
              : "Sin resultados"}
          </p>
          {isInternal(role) ? (
            <Link
              href={withRole("/geoportal", role)}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2e7d32] transition hover:text-[#1b5e20]"
            >
              Ir al Geoportal
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          ) : null}
        </div>

        {filtered.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((dashboard, i) => (
              <article key={dashboard.id} className="surface-card flex h-full flex-col gap-0 overflow-hidden p-0">
                {/* Gradient thumbnail */}
                <div
                  className="flex min-h-[120px] items-end p-4"
                  style={{ background: gradients[i % gradients.length] }}
                >
                  <div className="flex flex-wrap gap-1.5">
                    <span className="rounded-full border border-white/25 bg-black/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
                      {dashboard.topic}
                    </span>
                    <span className="rounded-full border border-white/25 bg-black/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
                      {dashboard.territory}
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-4 p-5">
                  <div className="space-y-2">
                    <h3 className="font-display text-xl leading-tight text-[#1a1a1a]">
                      {dashboard.title}
                    </h3>
                    <p className="line-clamp-3 text-sm leading-6 text-[#4a4540]">
                      {dashboard.description}
                    </p>
                  </div>
                  <p className="text-xs text-[#7a756e]">Período: {dashboard.period}</p>
                  <div className="mt-auto">
                    <Link
                      href={withRole(`/estadisticas/${dashboard.slug}`, role)}
                      className="inline-flex items-center gap-2 rounded-full bg-[#2e7d32] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1b5e20]"
                    >
                      Ver tablero
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No hay tableros para esos filtros"
            description="Revisa el tema o el territorio, o limpia la búsqueda para volver al catálogo completo."
            action={
              <Link href={withRole("/estadisticas", role)} className="button-primary">
                Limpiar filtros
              </Link>
            }
          />
        )}
      </section>
    </SiteLayout>
  );
}
