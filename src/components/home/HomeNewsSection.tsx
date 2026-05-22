import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getExternalEnterateNews, listLoUltimoNews } from "@/lib/content";
import type { ViewerRole } from "@/lib/mock-data";
import { withRole } from "@/lib/viewer";
import { LoUltimoListRow } from "@/components/palenke/LoUltimoListRow";
import { InstagramSlider } from "@/components/home/InstagramSlider";

export async function HomeNewsSection({ role }: { role: ViewerRole }) {
  const [noticias, baseNews] = await Promise.all([
    getExternalEnterateNews(3),
    listLoUltimoNews(),
  ]);
  const curatedNews = baseNews.slice(0, 3);
  const instagramNews = baseNews.filter((n) => n.externalUrl?.includes("instagram.com")).slice(0, 4);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="eyebrow mb-2">Noticias publicadas por PCN</p>
              <h2 className="font-display text-3xl text-[#1a1a1a]">Entérate</h2>
            </div>
            <Link
              href={withRole("/noticias", role)}
              className="hidden items-center gap-2 text-sm font-semibold text-[#2e7d32] transition hover:text-[#1b5e20] sm:inline-flex"
            >
              Ver todas
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid gap-5">
            {noticias.slice(0, 2).map((n, index) => (
              <article
                key={n.id}
                className="surface-card flex flex-col gap-4"
                style={{ borderTopColor: "#2e7d32", borderTopWidth: "3px" }}
              >
                <div className="relative flex h-[140px] items-end overflow-hidden rounded-[20px] p-4">
                  {n.imageUrl ? (
                    <Image
                      src={n.imageUrl}
                      alt={`Imagen de portada: ${n.title}`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      unoptimized
                      priority={index === 0}
                      loading={index === 0 ? "eager" : "lazy"}
                      className="object-cover"
                    />
                  ) : (
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(46,125,50,0.92), rgba(21,101,192,0.75))",
                      }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a]/20 to-[#1a1a1a]/70" />
                  <span className="relative z-10 rounded-full border border-white/25 bg-black/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white">
                    Fuente externa
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-[#7a756e]">
                  <span className="rounded-full bg-[#1a1a1a] px-2.5 py-1 font-semibold text-white">
                    {n.sourceLabel}
                  </span>
                  <span>
                    {new Intl.DateTimeFormat("es-CO", { dateStyle: "medium" }).format(
                      new Date(n.publishedAt),
                    )}
                  </span>
                </div>
                <h3 className="font-display text-xl text-[#1a1a1a]">{n.title}</h3>
                <p className="line-clamp-2 text-sm leading-6 text-[#4a4540]">{n.excerpt}</p>
                <a
                  href={n.url}
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
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="eyebrow mb-2">Incidencia política y territorial</p>
              <h2 className="font-display text-3xl text-[#1a1a1a]">Lo último</h2>
            </div>
            <Link
              href={withRole("/incidencia", role)}
              className="hidden items-center gap-2 text-sm font-semibold text-[#2e7d32] transition hover:text-[#1b5e20] sm:inline-flex"
            >
              Ver todo
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="divide-y divide-[#e8dfd3] overflow-hidden rounded-[28px] border border-[#e8dfd3] bg-white shadow-[0_12px_40px_rgba(26,26,26,0.04)]">
            {curatedNews.map((n) => {
              const href = withRole(`/incidencia/${n.slug}`, role);
              return <LoUltimoListRow key={n.id} item={n} href={href} />;
            })}

            <div className="border-t border-[#e8dfd3] bg-[#fcfbfa] p-5">
              <p className="mb-4 px-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#7a756e]">
                En Instagram
              </p>
              <InstagramSlider items={instagramNews} />
            </div>
          </div>

          <div className="mt-4 sm:hidden">
            <Link
              href={withRole("/incidencia", role)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#2e7d32] transition hover:text-[#1b5e20]"
            >
              Ver toda la incidencia
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomeNewsSectionSkeleton() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8" aria-hidden="true">
      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-5">
          <div className="h-8 w-52 animate-pulse rounded bg-[#ede8df]" />
          <div className="grid gap-5">
            {Array.from({ length: 2 }).map((_, idx) => (
              <div key={idx} className="space-y-4 rounded-[24px] border border-[#e8dfd3] bg-white p-4">
                <div className="h-[140px] animate-pulse rounded-[16px] bg-[#efeae1]" />
                <div className="h-4 w-40 animate-pulse rounded bg-[#efeae1]" />
                <div className="h-6 w-11/12 animate-pulse rounded bg-[#efeae1]" />
                <div className="h-4 w-full animate-pulse rounded bg-[#efeae1]" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="h-8 w-44 animate-pulse rounded bg-[#ede8df]" />
          <div className="space-y-3 rounded-[24px] border border-[#e8dfd3] bg-white p-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="h-16 animate-pulse rounded bg-[#efeae1]" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
