import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteLayout } from "@/components/mock/ui";
import { getViewerRole, type SearchParams, withRole } from "@/lib/viewer";
import { pcnNewsArticles } from "@/lib/newsroom";

export default async function IncidenciaPage({
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
        { label: "Incidencia" },
      ]}
    >
      {/* ── Header ── */}
      <section className="bg-[#1a2a1a] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* PCN color accent */}
          <div className="mb-6 flex h-1 w-48 overflow-hidden rounded-full" aria-hidden="true">
            <span className="flex-1 bg-[#2e7d32]" />
            <span className="flex-1 bg-[#fbc02d]" />
            <span className="flex-1 bg-[#d32f2f]" />
          </div>
          <p className="eyebrow mb-3 text-white/60">PCN — Proceso de Comunidades Negras</p>
          <h1 className="font-display text-4xl text-white sm:text-5xl">Incidencia</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/70">
            Pronunciamientos, acuerdos colectivos y acciones de incidencia política y territorial del
            Proceso de Comunidades Negras en defensa del territorio y los derechos étnicos.
          </p>
        </div>
      </section>

      {/* ── Articles grid ── */}
      <section className="mx-auto w-full max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2">
          {pcnNewsArticles.map((n) => (
            <article
              key={n.slug}
              className="surface-card flex flex-col gap-4 overflow-hidden"
              style={{ borderTopColor: n.categoriaColor, borderTopWidth: "3px" }}
            >
              {/* color header */}
              <div
                className="flex h-[120px] items-end rounded-[20px] p-4"
                style={{
                  background: `linear-gradient(135deg, ${n.categoriaColor}cc, ${n.categoriaColor}55)`,
                }}
              >
                <span className="rounded-full border border-white/25 bg-black/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white">
                  {n.categoria}
                </span>
              </div>

              {/* meta */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#7a756e]">
                <span className="rounded-full bg-[#1a1a1a] px-2.5 py-1 font-semibold text-white">
                  {n.publisher}
                </span>
                <span>{n.fecha}</span>
                <span>·</span>
                <span>{n.territorio}</span>
              </div>

              <h2 className="font-display text-xl text-[#1a1a1a]">{n.titulo}</h2>
              <p className="line-clamp-3 text-sm leading-6 text-[#4a4540]">{n.resumen}</p>

              <Link
                href={withRole(`/incidencia/${n.slug}`, role)}
                className="mt-auto inline-flex items-center gap-2 text-sm font-semibold"
                style={{ color: n.categoriaColor }}
              >
                Leer más
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
