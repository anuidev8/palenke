import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download, FileText } from "lucide-react";
import { SiteLayout, VisibilityBadge } from "@/components/mock/ui";
import { LoadingDownloadButton } from "@/components/palenke/LoadingDownloadButton";
import { PdfDocumentViewerShell } from "@/components/palenke/PdfDocumentViewerShell";
import { hasSupabaseServiceConfig } from "@/lib/config";
import { canDownloadDocument } from "@/lib/mock-data";
import {
  formatDocumentTerritory,
  formatDocumentYear,
  getInstrumentDocumentBySlug,
} from "@/lib/gobierno-propio-documents";
import {
  getSeguridadJuridicaDocumentBySlug,
  listSeguridadJuridicaSlugs,
} from "@/lib/seguridad-juridica-catalog";
import { createSupabaseService } from "@/lib/supabase/service";
import { getViewerRequestState } from "@/lib/viewer-server";
import { type SearchParams, withRole } from "@/lib/viewer";

const INSTRUMENT_LABELS: Record<string, string> = {
  "seguridad-juridica": "Seguridad jurídica de la tierra",
};

const SUBMODULE_LABELS: Record<string, string> = {
  fortalecimiento: "Fortalecimiento",
  genero: "Género",
  proteccion: "Protección y saneamiento",
  titulacion: "Titulación y ampliación",
};

type PageProps = {
  params: Promise<{ instrumento: string; slug: string }>;
  searchParams: Promise<SearchParams>;
};

function getPreviewUrl(documentId: string) {
  if (!hasSupabaseServiceConfig()) {
    return null;
  }

  return `/api/documents/${documentId}/preview`;
}

export async function generateStaticParams() {
  return listSeguridadJuridicaSlugs().map(({ slug }) => ({
    instrumento: "seguridad-juridica",
    slug,
  }));
}

async function resolveDocument(instrumento: string, slug: string) {
  if (instrumento === "seguridad-juridica") {
    return getSeguridadJuridicaDocumentBySlug(slug);
  }
  return getInstrumentDocumentBySlug(instrumento, slug);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { instrumento, slug } = await params;
  const document = await resolveDocument(instrumento, slug);

  if (!document) {
    return {
      title: "Documento no encontrado | Palenke",
    };
  }

  const description =
    document.summary ??
    `Documento de ${INSTRUMENT_LABELS[instrumento] ?? instrumento} disponible en Palenke.`;
  const keywords = document.keywords ?? [];
  const canonicalPath = `/gobierno-propio/${instrumento}/${slug}`;

  return {
    title: `${document.title} | Palenke`,
    description,
    keywords,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: document.title,
      description,
      type: "article",
      locale: document.language ?? "es_CO",
      url: canonicalPath,
      tags: keywords,
    },
    twitter: {
      card: "summary_large_image",
      title: document.title,
      description,
    },
    other: {
      ...(document.author ? { author: document.author } : {}),
      ...(document.theme ? { "document:theme": document.theme } : {}),
      ...(document.subtheme ? { "document:subtheme": document.subtheme } : {}),
      ...(document.council ? { "document:council": document.council } : {}),
      ...(document.spatial_coverage ? { "document:spatial_coverage": document.spatial_coverage } : {}),
      ...(document.related_collection ? { "document:related_collection": document.related_collection } : {}),
    },
  };
}

export default async function GobiernoPropioDocumentPage({ params, searchParams }: PageProps) {
  const { instrumento, slug } = await params;
  const sp = await searchParams;
  const sessionState = await getViewerRequestState(sp);
  const role = sessionState.role;
  const document = await resolveDocument(instrumento, slug);

  if (!document || document.visibility === "sensitive") {
    notFound();
  }

  const canDownload = canDownloadDocument(role, document.visibility);
  const previewUrl = canDownload ? getPreviewUrl(document.id) : null;
  const downloadHref = `/api/documents/${document.id}/signed-url?mode=redirect`;
  const instrumentLabel = INSTRUMENT_LABELS[instrumento] ?? instrumento;
  const submoduleLabel = document.submodule ? SUBMODULE_LABELS[document.submodule] : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DigitalDocument",
    name: document.title,
    description: document.summary,
    author: document.author
      ? {
          "@type": "Person",
          name: document.author,
        }
      : undefined,
    datePublished: document.published_on ?? document.created_at,
    inLanguage: document.language ?? "es",
    keywords: (document.keywords ?? []).join(", "),
    spatialCoverage: document.spatial_coverage ?? document.territory,
    publisher: {
      "@type": "Organization",
      name: document.council ?? "Palenke PCN",
    },
    isAccessibleForFree: document.visibility === "public",
    encodingFormat: document.format ?? "application/pdf",
  };

  return (
    <SiteLayout
      role={role}
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "Gobierno Propio", href: "/gobierno-propio" },
        {
          label: instrumentLabel,
          href: withRole(`/gobierno-propio/${instrumento}`, role),
        },
        { label: document.title },
      ]}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href={withRole(
            document.submodule
              ? `/gobierno-propio/${instrumento}?submodulo=${document.submodule}`
              : `/gobierno-propio/${instrumento}`,
            role,
          )}
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#4a4540] transition hover:text-[#1a1a1a]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Volver al archivo de documentos
        </Link>

        <div className="mb-8 rounded-[32px] border border-[#e8dfd3] bg-white p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <VisibilityBadge visibility={document.visibility} />
                {submoduleLabel ? (
                  <span className="rounded-full bg-[#f4f1ec] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#5a5550]">
                    {submoduleLabel}
                  </span>
                ) : null}
                {document.document_type ? (
                  <span className="rounded-full bg-[#e3f2fd] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#1565c0]">
                    {document.document_type}
                  </span>
                ) : null}
              </div>

              <div>
                <h1 className="font-display text-3xl leading-tight text-[#1a1a1a] sm:text-4xl">
                  {document.title}
                </h1>
                {document.summary ? (
                  <p className="mt-4 max-w-3xl text-lg leading-relaxed text-[#5a5045]">
                    {document.summary}
                  </p>
                ) : null}
              </div>

              <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {document.author ? (
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-wider text-[#8a8074]">Autoría</dt>
                    <dd className="mt-1 text-sm font-medium text-[#1a1a1a]">{document.author}</dd>
                  </div>
                ) : null}
                {document.council ? (
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-wider text-[#8a8074]">Consejo</dt>
                    <dd className="mt-1 text-sm font-medium text-[#1a1a1a]">{document.council}</dd>
                  </div>
                ) : null}
                <div>
                  <dt className="text-xs font-bold uppercase tracking-wider text-[#8a8074]">Territorio</dt>
                  <dd className="mt-1 text-sm font-medium text-[#1a1a1a]">
                    {formatDocumentTerritory(document)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase tracking-wider text-[#8a8074]">Año</dt>
                  <dd className="mt-1 text-sm font-medium text-[#1a1a1a]">
                    {formatDocumentYear(document)}
                  </dd>
                </div>
                {document.theme ? (
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-wider text-[#8a8074]">Línea temática</dt>
                    <dd className="mt-1 text-sm font-medium text-[#1a1a1a]">{document.theme}</dd>
                  </div>
                ) : null}
                {document.subtheme ? (
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-wider text-[#8a8074]">Subtema</dt>
                    <dd className="mt-1 text-sm font-medium text-[#1a1a1a]">{document.subtheme}</dd>
                  </div>
                ) : null}
                {document.related_collection ? (
                  <div className="sm:col-span-2 lg:col-span-3">
                    <dt className="text-xs font-bold uppercase tracking-wider text-[#8a8074]">Colección</dt>
                    <dd className="mt-1 text-sm font-medium text-[#1a1a1a]">{document.related_collection}</dd>
                  </div>
                ) : null}
              </dl>

              {(document.keywords?.length ?? 0) > 0 ? (
                <div className="flex flex-wrap gap-2 pt-2">
                  {document.keywords?.map((keyword) => (
                    <span key={keyword} className="chip">
                      {keyword}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            {canDownload ? (
              <LoadingDownloadButton
                href={downloadHref}
                label="Descargar PDF"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:opacity-90 hover:shadow-lg"
                style={{ background: "#2e7d32" }}
              />
            ) : (
              <div className="rounded-2xl border border-[#f2d5cf] bg-[#fff4f1] px-5 py-4 text-sm font-medium text-[#8a3b2f]">
                Este documento requiere acceso verificado para descarga y vista completa.
              </div>
            )}
          </div>
        </div>

        {canDownload && previewUrl ? (
          <PdfDocumentViewerShell fileUrl={previewUrl} title={document.title} />
        ) : (
          <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-[28px] border border-dashed border-[#e8dfd3] bg-[#fcfaf7] px-6 py-16 text-center">
            <FileText className="mb-4 h-10 w-10 text-[#a39f98]" />
            <p className="text-lg font-semibold text-[#1a1a1a]">Vista previa no disponible</p>
            <p className="mt-2 max-w-lg text-sm text-[#5a5045]">
              Solicita acceso para consultar el documento completo desde el archivo de documentos.
            </p>
            <Link
              href={withRole(`/gobierno-propio/${instrumento}`, role)}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#1a1a1a] px-6 py-3 text-sm font-bold text-white transition hover:bg-black"
            >
              <Download className="h-4 w-4" />
              Ir al archivo
            </Link>
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
