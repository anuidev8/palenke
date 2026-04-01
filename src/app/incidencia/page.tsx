import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteLayout } from "@/components/mock/ui";
import { listInternalNews } from "@/lib/content";
import { getViewerRoleFromRequest } from "@/lib/viewer-server";
import { type SearchParams, withRole } from "@/lib/viewer";

export default async function IncidenciaPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const role = await getViewerRoleFromRequest(params);
  const newsItems = await listInternalNews();

  return (
    <SiteLayout
      role={role}
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "Incidencia" },
      ]}
    >
      <section className="bg-[#1a2a1a] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 flex h-1 w-48 overflow-hidden rounded-full" aria-hidden="true">
            <span className="flex-1 bg-[#2e7d32]" />
            <span className="flex-1 bg-[#fbc02d]" />
            <span className="flex-1 bg-[#d32f2f]" />
          </div>
          <p className="eyebrow mb-3 text-white/60">Actualizaciones internas</p>
          <h1 className="font-display text-4xl text-white sm:text-5xl">Lo Último</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-white/70">
            Publicaciones administradas desde Palenke para dar seguimiento a acciones territoriales,
            visitas, encuentros y agenda política reciente.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          {newsItems.map((item) => (
            <article
              key={item.id}
              className="surface-card flex flex-col gap-4 overflow-hidden border-t-[3px] border-t-[#d32f2f]"
            >
              <div className="flex items-center gap-2 text-xs text-[#7a756e]">
                <span className="rounded-full bg-[#fddede] px-2.5 py-1 font-semibold text-[#d32f2f]">
                  {item.category}
                </span>
                <span>{new Intl.DateTimeFormat("es-CO", { dateStyle: "medium" }).format(new Date(item.publishedAt))}</span>
                {item.location ? (
                  <>
                    <span>·</span>
                    <span>{item.location}</span>
                  </>
                ) : null}
              </div>
              <h2 className="font-display text-2xl text-[#1a1a1a]">{item.title}</h2>
              <p className="text-sm leading-6 text-[#4a4540]">{item.summary}</p>
              <Link
                href={withRole(`/incidencia/${item.slug}`, role)}
                className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-[#d32f2f]"
              >
                Leer detalle
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
