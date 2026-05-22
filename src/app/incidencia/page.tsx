import { LoUltimoImage } from "@/components/palenke/LoUltimoImage";
import { SocialPostEmbed } from "@/components/palenke/SocialPostEmbed";
import { XPostEmbed } from "@/components/palenke/XPostEmbed";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Search } from "lucide-react";
import { SiteLayout } from "@/components/mock/ui";
import { listLoUltimoNews } from "@/lib/content";
import { resolveSocialEmbed } from "@/lib/social-embed";
import { getViewerRoleFromRequest } from "@/lib/viewer-server";
import { getFirstParam, type SearchParams, withRole } from "@/lib/viewer";

const PAGE_SIZE = 8;

function buildIncidenciaPageHref(
  role: Awaited<ReturnType<typeof getViewerRoleFromRequest>>,
  page: number,
  query: string,
) {
  return withRole("/incidencia", role, {
    q: query || undefined,
    page: page > 1 ? page : undefined,
  });
}

export default async function IncidenciaPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const role = await getViewerRoleFromRequest(params);
  const allNewsItems = await listLoUltimoNews();

  const searchQuery = (getFirstParam(params.q) ?? "").trim();
  const normalizedQuery = searchQuery.toLowerCase();
  const pageParam = Number(getFirstParam(params.page) ?? "1");
  const requestedPage = Number.isFinite(pageParam) && pageParam > 0 ? Math.floor(pageParam) : 1;

  const filteredItems = normalizedQuery
    ? allNewsItems.filter((item) =>
        [item.title, item.summary, item.category, item.location ?? "", item.externalUrl ?? ""]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery),
      )
    : allNewsItems;

  const totalItems = filteredItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const currentPage = Math.min(requestedPage, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pageItems = filteredItems.slice(startIndex, startIndex + PAGE_SIZE);

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
          <p className="eyebrow mb-3 text-white/60">Incidencia política y territorial</p>
          <h1 className="font-display text-4xl text-white sm:text-5xl">Lo Último</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-white/70">
            Publicaciones del Palenke sobre alianzas, territorio, gobierno propio, protección hídrica
            y procesos de restitución. Cada entrada puede incluir relato completo, registro fotográfico
            o enlace directo.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <form method="get" className="surface-card mb-8 flex flex-col gap-4 border border-[#e8dfd3] sm:flex-row sm:items-center">
          <label htmlFor="incidencia-search" className="sr-only">
            Buscar en Lo Último
          </label>
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7a756e]" />
            <input
              id="incidencia-search"
              name="q"
              type="search"
              defaultValue={searchQuery}
              placeholder="Buscar por título, categoría, red o enlace"
              className="h-11 w-full rounded-xl border border-[#e8dfd3] bg-white pl-9 pr-3 text-sm text-[#1a1a1a] outline-none transition focus:border-[#2e7d32]"
            />
          </div>
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#2e7d32] px-5 text-sm font-semibold text-white transition hover:bg-[#1b5e20]"
          >
            Buscar
          </button>
          {searchQuery ? (
            <Link
              href={withRole("/incidencia", role)}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-[#e8dfd3] px-5 text-sm font-semibold text-[#4a4540] transition hover:bg-[#f8f5f2]"
            >
              Limpiar
            </Link>
          ) : null}
        </form>

        <div className="mb-6 text-sm text-[#7a756e]">
          Mostrando {totalItems === 0 ? 0 : startIndex + 1}–{Math.min(startIndex + PAGE_SIZE, totalItems)} de {totalItems} publicaciones
        </div>

        {pageItems.length === 0 ? (
          <div className="surface-card border border-[#e8dfd3] text-sm text-[#4a4540]">
            No encontramos publicaciones con ese filtro.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {pageItems.map((item) => {
              const href = withRole(`/incidencia/${item.slug}`, role);
              const socialEmbed = item.externalUrl ? resolveSocialEmbed(item.externalUrl) : null;
              const isSocialItem =
                socialEmbed?.provider === "instagram" ||
                socialEmbed?.provider === "facebook" ||
                socialEmbed?.provider === "x";
              const dateLabel = new Intl.DateTimeFormat("es-CO", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              }).format(new Date(item.publishedAt));

              return (
                <article
                  key={item.id}
                  className="surface-card group flex flex-col gap-4 overflow-hidden border-t-[3px] border-t-[#d32f2f] p-0"
                >
                  {item.coverImageUrl ? (
                    <div className="relative aspect-[16/10] w-full overflow-hidden">
                      <LoUltimoImage
                        src={item.coverImageUrl}
                        alt={`Portada: ${item.title}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 480px"
                        className="object-cover transition duration-500 group-hover:scale-[1.02]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/50 via-transparent to-transparent" />
                    </div>
                  ) : null}

                  <div
                    className={`flex flex-col ${isSocialItem ? "gap-3" : "gap-4"} px-6 pb-6 ${
                      item.coverImageUrl ? "pt-0" : "pt-6"
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#7a756e]">
                      <span className="rounded-full bg-[#fddede] px-2.5 py-1 font-semibold text-[#d32f2f]">
                        {item.category}
                      </span>
                      <span>{dateLabel}</span>
                      {item.location ? (
                        <>
                          <span>·</span>
                          <span>{item.location}</span>
                        </>
                      ) : null}
                    </div>
                    {!isSocialItem ? (
                      <>
                        <h2 className="font-display text-2xl leading-snug text-[#1a1a1a]">{item.title}</h2>
                        <p className="line-clamp-3 text-sm leading-6 text-[#4a4540]">{item.summary}</p>
                        {!item.coverImageUrl && item.externalUrl ? (
                          <p className="line-clamp-1 text-xs text-[#2e7d32]">{item.externalUrl}</p>
                        ) : null}
                      </>
                    ) : null}

                    {isSocialItem && item.externalUrl ? (
                      socialEmbed?.provider === "x" ? (
                        <XPostEmbed
                          url={item.externalUrl}
                          title={item.title}
                          description={item.summary}
                        />
                      ) : (
                        <SocialPostEmbed
                          url={item.externalUrl}
                          title={item.title}
                          description={item.summary}
                          inline
                        />
                      )
                    ) : (
                      <Link
                        href={href}
                        className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-[#d32f2f] transition hover:text-[#b71c1c]"
                      >
                        Leer publicación completa
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {totalPages > 1 ? (
          <nav className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between" aria-label="Paginación de Lo Último">
            <p className="text-sm text-[#7a756e]">
              Página {currentPage} de {totalPages}
            </p>
            <div className="flex items-center gap-2">
              {currentPage > 1 ? (
                <Link
                  href={buildIncidenciaPageHref(role, currentPage - 1, searchQuery)}
                  className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#e8dfd3] px-3 text-sm font-medium text-[#4a4540] transition hover:bg-[#f8f5f2]"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  Anterior
                </Link>
              ) : (
                <span className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#ece9e4] px-3 text-sm font-medium text-[#b0aaa2]">
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  Anterior
                </span>
              )}

              {currentPage < totalPages ? (
                <Link
                  href={buildIncidenciaPageHref(role, currentPage + 1, searchQuery)}
                  className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#e8dfd3] px-3 text-sm font-medium text-[#4a4540] transition hover:bg-[#f8f5f2]"
                >
                  Siguiente
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              ) : (
                <span className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#ece9e4] px-3 text-sm font-medium text-[#b0aaa2]">
                  Siguiente
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              )}
            </div>
          </nav>
        ) : null}
      </section>
    </SiteLayout>
  );
}
