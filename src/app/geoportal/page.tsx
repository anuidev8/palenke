import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Map, TriangleAlert } from "lucide-react";
import { SiteLayout } from "@/components/mock/ui";
import { geoportalCopy } from "@/lib/mock-data";
import { getViewerRole, isInternal, type SearchParams, withRole } from "@/lib/viewer";

export default async function GeoportalPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const role = getViewerRole(params);

  if (!isInternal(role)) {
    redirect(`/login?redirect=/geoportal&message=geoportal`);
  }

  return (
    <SiteLayout
      role={role}
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "SCITA", href: "/estadisticas" },
        { label: "Geoportal interno" },
      ]}
    >
      <section className="mx-auto flex w-full max-w-2xl flex-col items-center gap-8 px-4 py-16 text-center sm:px-6 lg:px-8">
        {/* Card */}
        <article className="surface-card w-full space-y-6">
          {/* Green icon circle */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#d8f3dc]">
            <Map className="h-9 w-9 text-[#2e7d32]" aria-hidden="true" />
          </div>

          <div className="space-y-3">
            <h1 className="font-display text-4xl text-[#1a1a1a]">{geoportalCopy.title}</h1>
            <p className="text-base leading-7 text-[#4a4540]">{geoportalCopy.description}</p>
          </div>

          {/* Available layers */}
          <div className="flex flex-wrap justify-center gap-2">
            {geoportalCopy.layers.map((layer) => (
              <span key={layer} className="chip">
                {layer}
              </span>
            ))}
          </div>

          {/* Primary CTA */}
          <a
            href={geoportalCopy.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#2e7d32] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#1b5e20]"
          >
            <span>Ir al Geoportal</span>
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>

          {/* Yellow warning banner */}
          <div
            role="note"
            className="flex items-start gap-3 rounded-[20px] bg-[#fff3cd] px-5 py-4 text-left text-sm text-[#1a1a1a]"
          >
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-[#fbc02d]" aria-hidden="true" />
            <p>
              <span className="font-semibold">Aviso: </span>
              Este enlace abre un sistema externo en nueva pestaña. El geoportal es administrado por
              el equipo SIG de Hileros/PCN y puede requerir autenticación propia.
            </p>
          </div>
        </article>

        {/* Back link */}
        <Link
          href={withRole("/estadisticas", role)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#4a4540] transition hover:text-[#1a1a1a]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Volver a SCITA</span>
        </Link>
      </section>
    </SiteLayout>
  );
}
