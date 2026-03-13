import { redirect } from "next/navigation";
import { ExternalLink, Map } from "lucide-react";
import { Callout, SiteLayout } from "@/components/mock/ui";
import { geoportalCopy } from "@/lib/mock-data";
import { getViewerRole, isInternal, type SearchParams } from "@/lib/viewer";

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
        { label: "Geoportal" },
      ]}
    >
      <section className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-16 text-center sm:px-6 lg:px-8">
        <article className="surface-card space-y-6">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[color:var(--sand-strong)]">
            <Map className="h-10 w-10 text-[color:var(--forest)]" aria-hidden="true" />
          </div>
          <div className="space-y-3">
            <h1 className="font-display text-4xl text-[color:var(--forest)]">{geoportalCopy.title}</h1>
            <p className="text-base leading-8 text-[color:var(--muted-strong)]">{geoportalCopy.description}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {geoportalCopy.layers.map((layer) => (
              <span key={layer} className="chip">
                {layer}
              </span>
            ))}
          </div>
          <div>
            <a href={geoportalCopy.url} target="_blank" rel="noreferrer" className="button-primary">
              <Map className="h-4 w-4" aria-hidden="true" />
              <span>Abrir Geoportal</span>
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
          <Callout tone="info" title="Administración externa">
            <p>
              El geoportal es administrado por el equipo SIG de Hileros/PCN y puede requerir autenticación propia.
            </p>
          </Callout>
        </article>
      </section>
    </SiteLayout>
  );
}
