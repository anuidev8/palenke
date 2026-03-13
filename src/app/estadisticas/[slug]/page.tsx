import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Callout, SiteLayout, VisibilityBadge } from "@/components/mock/ui";
import { findDashboardBySlug } from "@/lib/mock-data";
import { canOpenSiteVisibility, getFirstParam, getViewerRole, type SearchParams, withRole } from "@/lib/viewer";

export default async function DashboardDetallePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const role = getViewerRole(query);
  const iframeState = getFirstParam(query.iframe);
  const dashboard = findDashboardBySlug(slug);

  if (!dashboard) {
    notFound();
  }

  if (!canOpenSiteVisibility(role, dashboard.visibility)) {
    redirect(withRole("/acceso-restringido", role, { redirect: `/estadisticas/${slug}` }));
  }

  return (
    <SiteLayout
      role={role}
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "Estadísticas y tableros", href: "/estadisticas" },
        { label: dashboard.title },
      ]}
    >
      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <article className="surface-card space-y-8">
          <div className="space-y-4">
            <VisibilityBadge visibility={dashboard.visibility} />
            <div className="space-y-3">
              <h1 className="font-display text-4xl text-[color:var(--forest)]">{dashboard.title}</h1>
              <p className="text-base leading-7 text-[color:var(--muted-strong)]">{dashboard.description}</p>
              <p className="text-sm text-[color:var(--muted)]">
                {dashboard.topic} · {dashboard.territory} · {dashboard.period}
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-[32px] border border-[color:var(--border-soft)] bg-[color:var(--forest)]">
            {iframeState === "loading" ? (
              <div className="flex min-h-[600px] items-center justify-center text-center text-[color:var(--sand)]">
                <div className="space-y-3">
                  <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-[color:var(--gold-300)]" />
                  <p className="text-sm uppercase tracking-[0.18em]">Cargando tablero…</p>
                </div>
              </div>
            ) : iframeState === "timeout" ? (
              <div className="flex min-h-[600px] items-center justify-center px-8 text-center text-[color:var(--sand)]">
                <div className="max-w-lg space-y-3">
                  <p className="font-display text-3xl">El tablero no está disponible en este momento</p>
                  <p className="text-sm leading-7 text-[color:rgb(245_237_214_/_0.78)]">
                    Simulación del estado de error después de 8 segundos sin respuesta del iframe.
                  </p>
                </div>
              </div>
            ) : (
              <iframe
                title={dashboard.title}
                src={dashboard.embedUrl}
                className="min-h-[600px] w-full bg-white"
              />
            )}
          </div>

          <Callout tone="info" title="Nota informativa">
            <p>
              Los filtros, mapas y datos de este tablero son gestionados por el equipo SIG de Hileros/PCN. Esta
              plataforma solo lo muestra.
            </p>
          </Callout>

          <div>
            <Link href={withRole("/estadisticas", role)} className="button-ghost">
              ← Volver a Estadísticas
            </Link>
          </div>
        </article>
      </section>
    </SiteLayout>
  );
}

