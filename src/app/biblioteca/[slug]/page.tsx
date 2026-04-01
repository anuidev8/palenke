import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Callout, DetailList, SiteLayout, VisibilityBadge } from "@/components/mock/ui";
import { hasSupabaseServiceConfig } from "@/lib/config";
import { findDocumentBySlug } from "@/lib/mock-data";
import { getViewerRoleFromRequest } from "@/lib/viewer-server";
import { canOpenSiteVisibility, type SearchParams, withRole } from "@/lib/viewer";

export default async function DocumentoDetallePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const role = await getViewerRoleFromRequest(query);
  const document = findDocumentBySlug(slug);
  const supportsSignedDownloads = hasSupabaseServiceConfig();

  if (!document || document.visibility === "sensitive") {
    notFound();
  }

  if (!canOpenSiteVisibility(role, document.visibility)) {
    redirect(withRole("/acceso-restringido", role, { redirect: `/biblioteca/${slug}` }));
  }

  const usesSignedUrl = document.visibility !== "public" && supportsSignedDownloads;
  const downloadHref = usesSignedUrl
    ? `/api/documents/${document.id}/signed-url?mode=redirect`
    : document.url;

  return (
    <SiteLayout
      role={role}
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "Biblioteca Base", href: "/biblioteca" },
        { label: document.section, href: "/biblioteca" },
        { label: document.title },
      ]}
    >
      <section className="mx-auto grid w-full max-w-5xl gap-8 px-4 py-12 sm:px-6 lg:px-8">
        <div className="surface-card space-y-6">
          <VisibilityBadge visibility={document.visibility} />
          <div className="space-y-3">
            <h1 className="font-display text-4xl leading-tight text-[color:var(--forest)]">{document.title}</h1>
            <p className="text-base leading-7 text-[color:var(--muted-strong)]">{document.description}</p>
          </div>

          <DetailList
            items={[
              { label: "Sección", value: document.section },
              { label: "Tipo", value: document.type },
              { label: "Territorio", value: document.territory },
              { label: "Consejo", value: document.council },
              { label: "Municipio", value: document.municipality },
              { label: "Departamento", value: document.department },
              { label: "Año", value: document.year },
              { label: "Vigencia", value: document.validity },
              { label: "Enfoque de género", value: document.genderFocus ? "Sí" : "No" },
            ]}
          />

          <div className="space-y-4">
            <h2 className="font-display text-2xl text-[color:var(--forest)]">Descripción</h2>
            <p className="text-base leading-8 text-[color:var(--muted-strong)]">{document.description}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {document.keywords.map((keyword) => (
              <span key={keyword} className="chip">
                {keyword}
              </span>
            ))}
          </div>

          {document.action === "video" ? (
            <div className="space-y-4">
              <div className="overflow-hidden rounded-[28px] border border-[color:var(--border-soft)] bg-[color:var(--forest)]">
                <iframe
                  title={document.title}
                  src={document.url}
                  className="aspect-video w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <a href={document.url} className="button-secondary">
                Ver en YouTube/Vimeo
              </a>
            </div>
          ) : (
            <div className="space-y-3 border-t border-[color:var(--border-soft)] pt-6">
              <div className="flex flex-wrap items-center gap-3">
                <a href={downloadHref} {...(usesSignedUrl ? {} : { download: true })} className="button-primary">
                  {document.fileLabel}
                </a>
                {document.fileSize ? <span className="text-sm text-[color:var(--muted)]">Tamaño del archivo: {document.fileSize}</span> : null}
              </div>
            </div>
          )}

          {document.riskFlag ? (
            <Callout tone="warning" title="Contenido con manejo cuidadoso">
              <p>
                Este mock simula un documento con casos activos o personas en riesgo. En producción se recomienda
                mantenerlo como Interno o Sensible.
              </p>
            </Callout>
          ) : null}

          <div>
            <Link href={withRole("/biblioteca", role)} className="button-ghost">
              ← Volver a la Biblioteca
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
