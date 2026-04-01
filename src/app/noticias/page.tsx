import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { SiteLayout } from "@/components/mock/ui";
import { getExternalEnterateNews, listEvents } from "@/lib/content";
import { getViewerRoleFromRequest } from "@/lib/viewer-server";
import { type SearchParams, withRole } from "@/lib/viewer";

export default async function NoticiasPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const role = await getViewerRoleFromRequest(params);
  const [externalNews, events] = await Promise.all([
    getExternalEnterateNews(6),
    listEvents({ limit: 6, upcomingOnly: false }),
  ]);

  return (
    <SiteLayout
      role={role}
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "Noticias y eventos" },
      ]}
    >
      <section className="bg-[#2c3e2a] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[1.5px] text-[#fbc02d]">
            Memoria Afroterritorial
          </p>
          <h1 className="font-display text-4xl text-white sm:text-5xl">Noticias y eventos</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-white/70">
            Noticias publicadas por PCN y agenda territorial del Palenke para seguimiento político,
            organizativo y comunitario.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="eyebrow mb-2">Noticias publicadas por PCN</p>
            <h2 className="mb-8 font-display text-3xl text-[#1a1a1a]">Entérate</h2>

            <div className="grid gap-6">
              {externalNews.map((item) => (
                <article
                  key={item.id}
                  className="surface-card flex flex-col gap-4 overflow-hidden"
                  style={{ borderTopColor: "#2e7d32", borderTopWidth: "3px" }}
                >
                  <div
                    className="flex h-[160px] items-end rounded-[20px] bg-cover bg-center p-4"
                    style={{
                      backgroundImage: item.imageUrl
                        ? `linear-gradient(180deg, rgba(26,26,26,0.1), rgba(26,26,26,0.7)), url("${item.imageUrl}")`
                        : "linear-gradient(135deg, rgba(46,125,50,0.92), rgba(21,101,192,0.75))",
                    }}
                  >
                    <span
                      className="rounded-full px-3 py-1 text-xs font-semibold text-white"
                      style={{ background: "rgba(0,0,0,0.3)" }}
                    >
                      Fuente externa
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[#7a756e]">
                    <span className="rounded-full bg-[#1a1a1a] px-2.5 py-1 font-semibold text-white">
                      {item.sourceLabel}
                    </span>
                    <span>·</span>
                    <span>{new Intl.DateTimeFormat("es-CO", { dateStyle: "medium" }).format(new Date(item.publishedAt))}</span>
                  </div>

                  <h3 className="font-display text-xl text-[#1a1a1a]">{item.title}</h3>
                  <p className="text-sm leading-6 text-[#4a4540]">{item.excerpt}</p>

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-[#2e7d32] transition hover:text-[#1b5e20]"
                  >
                    Leer más
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                </article>
              ))}
            </div>
          </div>

          <div>
            <p className="eyebrow mb-2">Agenda territorial del proceso</p>
            <h2 className="mb-8 font-display text-3xl text-[#1a1a1a]">Lo último</h2>

            <div className="overflow-hidden rounded-[28px] border border-[#e8dfd3]">
              {events.map((ev) => (
                <Link
                  key={ev.id}
                  href={withRole(`/agenda/${ev.slug}`, role)}
                  className="flex items-start gap-4 border-b border-[#e8dfd3] px-5 py-4 transition-colors hover:bg-[#f8f5f2] last:border-0"
                >
                  <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-xl bg-[#f0eae0]">
                    <Calendar className="h-4 w-4 text-[#7a756e]" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-[#7a756e]">
                      <span className="font-semibold text-[#1a1a1a]">{ev.category}</span>
                      {" · "}
                      {new Intl.DateTimeFormat("es-CO", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }).format(new Date(ev.startsAt))}
                    </p>
                    <p className="mt-1 text-sm font-medium leading-5 text-[#1a1a1a]">
                      {ev.title}
                    </p>
                    <p className="mt-0.5 text-xs text-[#7a756e]">{ev.location}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
