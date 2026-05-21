import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteLayout } from "@/components/mock/ui";
import { LoUltimoPublicationGallery } from "@/components/palenke/LoUltimoPublicationGallery";
import { getInternalNewsBySlug } from "@/lib/content";
import { getViewerRoleFromRequest } from "@/lib/viewer-server";
import { type SearchParams, withRole } from "@/lib/viewer";

export default async function IncidenciaDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { slug } = await params;
  const qp = await searchParams;
  const role = await getViewerRoleFromRequest(qp);
  const item = await getInternalNewsBySlug(slug);

  if (!item) {
    notFound();
  }

  const galleryImages =
    item.galleryImageUrls?.length
      ? item.galleryImageUrls
      : item.coverImageUrl
        ? [item.coverImageUrl]
        : [];

  return (
    <SiteLayout
      role={role}
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "Incidencia", href: "/incidencia" },
        { label: item.title },
      ]}
    >
      <section className="bg-[#fcfaf7] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-5 flex flex-wrap gap-2">
            <span className="rounded-full bg-[#fddede] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#d32f2f]">
              {item.category}
            </span>
            <span className="rounded-full bg-[#1a1a1a] px-4 py-1.5 text-xs font-semibold text-white">
              Lo Último
            </span>
            <span className="rounded-full bg-[#f0eae0] px-4 py-1.5 text-xs font-semibold text-[#4a4540]">
              {new Intl.DateTimeFormat("es-CO", { dateStyle: "full", timeStyle: "short" }).format(
                new Date(item.publishedAt),
              )}
            </span>
            {item.location ? (
              <span className="rounded-full bg-[#f0eae0] px-4 py-1.5 text-xs font-semibold text-[#4a4540]">
                {item.location}
              </span>
            ) : null}
          </div>
          <h1 className="font-display text-4xl leading-tight text-[#1a1a1a] sm:text-5xl">
            {item.title}
          </h1>
          <p className="mt-5 text-lg leading-8 text-[#4a4540]">{item.summary}</p>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {galleryImages.length > 0 ? (
            <LoUltimoPublicationGallery images={galleryImages} title={item.title} />
          ) : null}

          <article className="surface-card">
            <div className="prose prose-lg max-w-none">
              {item.body.split(/\n{2,}/).map((paragraph) => (
                <p key={paragraph} className="text-base leading-8 text-[#4a4540]">
                  {paragraph}
                </p>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-4xl flex-wrap gap-3">
          <Link href={withRole("/incidencia", role)} className="button-secondary">
            ← Volver a Lo Último
          </Link>
          <Link href={withRole("/agenda", role)} className="button-ghost">
            Ver agenda →
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
