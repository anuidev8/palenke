import Link from "next/link";
import { ArrowRight, BookOpen, FileText, Newspaper } from "lucide-react";
import { SiteLayout } from "@/components/mock/ui";
import { getVisibleDocuments, librarySections } from "@/lib/mock-data";
import { getViewerRole, type SearchParams, withRole } from "@/lib/viewer";

export default async function MemoriaAfroterritorialPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const role = getViewerRole(params);
  const allDocs = getVisibleDocuments(role);
  const recentDocs = allDocs.toSorted((a, b) => b.year - a.year).slice(0, 4);

  return (
    <SiteLayout
      role={role}
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "Memoria Afroterritorial" },
      ]}
    >
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-[#2c3e2a]">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 20% 60%, rgba(251,192,45,0.15), transparent 50%), linear-gradient(135deg, rgba(26,26,26,0.88), rgba(44,62,42,0.78))",
          }}
        />
        {/* dot pattern */}
        <div className="absolute right-0 top-0 h-full w-1/2 opacity-[0.07]" aria-hidden="true">
          {Array.from({ length: 120 }).map((_, i) => (
            <span
              key={i}
              className="absolute h-1 w-1 rounded-full bg-white"
              style={{ left: `${(i % 10) * 10}%`, top: `${Math.floor(i / 10) * 10}%` }}
            />
          ))}
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <span className="mb-6 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
            Módulo
          </span>
          <h1 className="max-w-3xl font-display text-5xl leading-tight text-white sm:text-6xl">
            Memoria Afroterritorial
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/75 sm:text-lg">
            Repositorio de instrumentos jurídicos, documentos políticos y memorias territoriales
            del Proceso de Comunidades Negras en el Pacífico colombiano.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={withRole("/biblioteca", role)}
              className="inline-flex items-center gap-2 rounded-full bg-[#2e7d32] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1b5e20]"
            >
              Ver listado de documentos
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href={withRole("/noticias", role)}
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              Noticias y eventos
            </Link>
          </div>
        </div>
      </section>

      {/* ── Acerca de ── */}
      <section className="border-b border-[#e8dfd3] bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow mb-3">¿Qué es?</p>
            <h2 className="font-display text-3xl text-[#1a1a1a]">
              La memoria como instrumento político
            </h2>
            <p className="mt-4 text-base leading-7 text-[#4a4540]">
              La Memoria Afroterritorial reúne resoluciones, acuerdos, planes de manejo y archivos
              históricos que documentan la lucha por el territorio ancestral, la identidad cultural
              y los derechos colectivos de las comunidades afrocolombianas.
            </p>
            <p className="mt-3 text-base leading-7 text-[#4a4540]">
              Este archivo es una herramienta de defensa territorial: cada documento es evidencia
              de derechos, de procesos organizativos y de vida comunitaria.
            </p>
          </div>
          <div>
            <p className="eyebrow mb-3">Contenidos disponibles</p>
            <h2 className="font-display text-3xl text-[#1a1a1a]">
              Secciones del corpus documental
            </h2>
            <div className="mt-5 grid gap-3">
              {librarySections.slice(0, 6).map((section) => (
                <Link
                  key={section}
                  href={withRole(`/biblioteca?section=${encodeURIComponent(section)}`, role)}
                  className="flex items-center justify-between rounded-[20px] border border-[#e8dfd3] bg-[#f8f5f2] px-4 py-3 text-sm font-medium text-[#1a1a1a] transition hover:bg-[#f0eae0] hover:border-[#2e7d32]"
                >
                  <span>{section}</span>
                  <ArrowRight className="h-4 w-4 text-[#7a756e]" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature cards ── */}
      <section className="bg-[#f0eae0] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow mb-3">Accesos rápidos</p>
          <h2 className="font-display text-3xl text-[#1a1a1a]">Explora la memoria</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              {
                icon: FileText,
                color: "#2e7d32",
                lightBg: "#d8f3dc",
                title: "Listado de documentos",
                description: "Corpus completo con filtros por tipo, territorio y año.",
                href: "/biblioteca",
                cta: "Ir al listado",
              },
              {
                icon: Newspaper,
                color: "#1a1a1a",
                lightBg: "#f0eae0",
                title: "Noticias y eventos",
                description: "Actualizaciones recientes sobre procesos territoriales y organizativos.",
                href: "/noticias",
                cta: "Ver noticias",
              },
              {
                icon: BookOpen,
                color: "#d32f2f",
                lightBg: "#fddede",
                title: "Gobierno Propio",
                description: "Instrumentos de autonomía: reglamentos, litigio estratégico y conservación.",
                href: "/gobierno-propio",
                cta: "Ver instrumentos",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="surface-card flex h-full flex-col gap-5"
                  style={{ borderTopColor: item.color, borderTopWidth: "3px" }}
                >
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-2xl"
                    style={{ background: item.lightBg }}
                  >
                    <Icon className="h-6 w-6" style={{ color: item.color }} aria-hidden="true" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-display text-xl text-[#1a1a1a]">{item.title}</h3>
                    <p className="text-sm leading-6 text-[#4a4540]">{item.description}</p>
                  </div>
                  <Link
                    href={withRole(item.href, role)}
                    className="mt-auto inline-flex items-center gap-2 text-sm font-semibold"
                    style={{ color: item.color }}
                  >
                    {item.cta}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Recent documents ── */}
      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="eyebrow mb-2">Incorporaciones recientes</p>
            <h2 className="font-display text-3xl text-[#1a1a1a]">Documentos recientes</h2>
          </div>
          <Link
            href={withRole("/biblioteca", role)}
            className="hidden items-center gap-2 text-sm font-semibold text-[#2e7d32] transition hover:text-[#1b5e20] sm:inline-flex"
          >
            Ver todos
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-8 overflow-hidden rounded-[28px] border border-[#e8dfd3]">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-[#1a1a1a]">
                {["Título", "Tipo", "Territorio", "Año"].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-white"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8dfd3] bg-white">
              {recentDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-[#f0eae0] transition-colors">
                  <td className="px-5 py-3.5">
                    <Link
                      href={withRole(`/biblioteca/${doc.slug}`, role)}
                      className="font-medium text-[#1a1a1a] hover:text-[#2e7d32]"
                    >
                      {doc.title}
                    </Link>
                    <p className="mt-0.5 text-xs text-[#7a756e]">{doc.section}</p>
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-[#4a4540]">{doc.type}</td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-[#4a4540]">{doc.territory}</td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-[#4a4540]">{doc.year}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 sm:hidden">
          <Link
            href={withRole("/biblioteca", role)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#2e7d32] transition hover:text-[#1b5e20]"
          >
            Ver todos los documentos
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
