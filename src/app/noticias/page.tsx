import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { SiteLayout } from "@/components/mock/ui";
import { getViewerRole, type SearchParams, withRole } from "@/lib/viewer";
import { pcnNewsArticles, territorialEvents } from "@/lib/newsroom";

export default async function NoticiasPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const role = getViewerRole(params);

  return (
    <SiteLayout
      role={role}
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "Memoria Afrodescendiente", href: "/memoria-afroterritorial" },
        { label: "Noticias y eventos" },
      ]}
    >
      {/* ── Page header ── */}
      <section className="bg-[#2c3e2a] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[1.5px] text-[#fbc02d]">
            Memoria Afrodescendiente
          </p>
          <h1 className="font-display text-4xl text-white sm:text-5xl">Noticias y eventos</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-white/70">
            Noticias publicadas por PCN y agenda territorial del Palenke para seguimiento político,
            organizativo y comunitario.
          </p>
        </div>
      </section>

      {/* ── Main content: Entérate + Lo último ── */}
      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">

          {/* ── Entérate — news cards ── */}
          <div>
            <p className="eyebrow mb-2">Noticias publicadas por PCN</p>
            <h2 className="mb-8 font-display text-3xl text-[#1a1a1a]">Entérate</h2>

            <div className="grid gap-6">
              {pcnNewsArticles.map((n) => (
                <article
                  key={n.slug}
                  className="surface-card flex flex-col gap-4 overflow-hidden"
                  style={{ borderTopColor: n.categoriaColor, borderTopWidth: "3px" }}
                >
                  {/* thumbnail */}
                  <div
                    className="flex h-[160px] items-end rounded-[20px] p-4"
                    style={{
                      background: `linear-gradient(135deg, ${n.categoriaColor}cc, ${n.categoriaColor}55)`,
                    }}
                  >
                    <span
                      className="rounded-full px-3 py-1 text-xs font-semibold text-white"
                      style={{ background: "rgba(0,0,0,0.3)" }}
                    >
                      {n.categoria}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[#7a756e]">
                    <span className="rounded-full bg-[#1a1a1a] px-2.5 py-1 font-semibold text-white">
                      {n.publisher}
                    </span>
                    <span
                      className="rounded-full px-2.5 py-1 text-xs font-semibold"
                      style={{ background: n.categoriaBg, color: n.categoriaColor }}
                    >
                      {n.categoria}
                    </span>
                    <span>·</span>
                    <span>{n.fecha}</span>
                    <span>·</span>
                    <span>{n.territorio}</span>
                  </div>

                  <h3 className="font-display text-xl text-[#1a1a1a]">{n.titulo}</h3>
                  <p className="text-sm leading-6 text-[#4a4540]">{n.resumen}</p>

                  <Link
                    href={withRole(`/noticias/${n.slug}`, role)}
                    className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-[#2e7d32] transition hover:text-[#1b5e20]"
                  >
                    Leer más
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </article>
              ))}
            </div>
          </div>

          {/* ── Lo último — events list ── */}
          <div>
            <p className="eyebrow mb-2">Agenda territorial del proceso</p>
            <h2 className="mb-8 font-display text-3xl text-[#1a1a1a]">Lo último</h2>

            <div className="overflow-hidden rounded-[28px] border border-[#e8dfd3]">
              {territorialEvents.map((ev, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 border-b border-[#e8dfd3] px-5 py-4 last:border-0 hover:bg-[#f8f5f2] transition-colors"
                >
                  <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-xl bg-[#f0eae0]">
                    <Calendar className="h-4 w-4 text-[#7a756e]" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-[#7a756e]">
                      <span className="font-semibold text-[#1a1a1a]">{ev.tipo}</span>
                      {" · "}
                      {ev.fecha}
                    </p>
                    <p className="mt-1 text-sm font-medium leading-5 text-[#1a1a1a]">
                      {ev.titulo}
                    </p>
                    <p className="mt-0.5 text-xs text-[#7a756e]">{ev.lugar}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Back nav ── */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-3">
          <Link
            href={withRole("/", role)}
            className="inline-flex items-center gap-2 rounded-full border-2 border-[#e8dfd3] px-5 py-2.5 text-sm font-semibold text-[#1a1a1a] transition hover:bg-[#f0eae0]"
          >
            ← Volver al Inicio
          </Link>
          <Link
            href={withRole("/memoria-afroterritorial", role)}
            className="inline-flex items-center gap-2 rounded-full border-2 border-[#2e7d32] px-5 py-2.5 text-sm font-semibold text-[#2e7d32] transition hover:bg-[#d8f3dc]"
          >
            ← Memoria Afrodescendiente
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
