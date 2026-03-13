import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { MediaPlaceholder, SiteLayout, VisibilityBadge } from "@/components/mock/ui";
import { findCampaignBySlug } from "@/lib/mock-data";
import { canOpenSiteVisibility, formatDateRange, getViewerRole, type SearchParams, withRole } from "@/lib/viewer";

export default async function CampaniaDetallePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const role = getViewerRole(query);
  const campaign = findCampaignBySlug(slug);

  if (!campaign || !campaign.active) {
    notFound();
  }

  if (!canOpenSiteVisibility(role, campaign.visibility)) {
    redirect(withRole("/acceso-restringido", role, { redirect: `/mujeres-juventudes-ninez/campanas/${slug}` }));
  }

  return (
    <SiteLayout
      role={role}
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "Mujeres, Juventudes y Niñez", href: "/mujeres-juventudes-ninez" },
        { label: campaign.title },
      ]}
    >
      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <MediaPlaceholder label="Portada de campaña 16:9" className="min-h-[320px]" />

          <article className="surface-card space-y-6">
            <VisibilityBadge visibility={campaign.visibility} />
            <div className="space-y-3">
              <h1 className="font-display text-4xl text-[color:var(--forest)]">{campaign.title}</h1>
              <p className="text-sm text-[color:var(--muted)]">
                Fechas: {formatDateRange(campaign.startDate, campaign.endDate)}
              </p>
              <p className="text-base leading-8 text-[color:var(--muted-strong)]">{campaign.intro}</p>
            </div>

            <div className="space-y-4">
              {campaign.body.map((paragraph) => (
                <p key={paragraph} className="text-base leading-8 text-[color:var(--muted-strong)]">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="space-y-4 rounded-[28px] border border-[color:var(--border-soft)] bg-white p-6">
              <h2 className="font-display text-2xl text-[color:var(--forest)]">Materiales de la campaña</h2>
              <div className="grid gap-3">
                {campaign.materials.map((material) => (
                  <div
                    key={material.id}
                    className="flex flex-col gap-3 rounded-[22px] border border-[color:var(--border-soft)] px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">{material.type}</p>
                      <p className="mt-1 text-sm font-semibold text-[color:var(--forest)]">{material.title}</p>
                    </div>
                    <a href={material.url} className="button-secondary">
                      {material.action === "download" ? (
                        "Descargar"
                      ) : (
                        <>
                          <span>Ver</span>
                          <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </>
                      )}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Link href={withRole("/mujeres-juventudes-ninez", role)} className="button-ghost">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                <span>Volver a Mujeres, Juventudes y Niñez</span>
              </Link>
            </div>
          </article>
        </div>
      </section>
    </SiteLayout>
  );
}
