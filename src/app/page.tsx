import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageIntroOverlay } from "@/components/global/PageIntroOverlay";
import { Callout, PageBanner, SiteLayout } from "@/components/mock/ui";
import {
  homeIntro,
  homePoliticalOrientationIntro,
  homePoliticalOrientationLead,
  homePoliticalOrientationPillars,
  homeStrategicFunctions,
  homeStrategicFunctionsClosing,
  homeStrategicFunctionsIntro,
} from "@/lib/mock-data";
import { getViewerRoleFromRequest } from "@/lib/viewer-server";
import { isInternal, type SearchParams, withRole } from "@/lib/viewer";
import {
  HomePoliticalOrientationAccordion,
  HomeWhoWeAreAccordion,
} from "@/components/home/HomeInfoAccordions";
import { getExternalEnterateNews, listLoUltimoNews } from "@/lib/content";
import { LoUltimoListRow } from "@/components/palenke/LoUltimoListRow";
import { HomeVideoGallery } from "@/components/home/HomeVideoGallery";
import { HomeHeroSection } from "@/components/home/HomeHeroSection";
import { InstagramSlider } from "@/components/home/InstagramSlider";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const role = await getViewerRoleFromRequest(params);
  const notice = params.notice;
  const [noticias, baseNews] = await Promise.all([
    getExternalEnterateNews(3),
    listLoUltimoNews(),
  ]);
  const curatedNews = baseNews.slice(0, 3);
  const instagramNews = baseNews.filter((n) => n.externalUrl?.includes("instagram.com")).slice(0, 4);
  const ultimasNoticias = [...curatedNews, ...instagramNews];

  return (
    <PageIntroOverlay
      sessionStorageKey="palenke-home-intro-seen"
      title="Palenke"
      subtitle="Pensamiento y Territorio"
      revealDurationSec={3}
      titleSinkDurationSec={0.65}
      overlayFadeDurationSec={0.85}
      backdropFadeInSec={0.45}
      overlayClassName="overflow-hidden bg-[#141210] before:pointer-events-none before:absolute before:inset-0 before:content-[''] before:bg-[radial-gradient(ellipse_100%_70%_at_0%_15%,rgba(211,47,47,0.38),transparent_52%),radial-gradient(ellipse_90%_60%_at_100%_10%,rgba(251,192,45,0.28),transparent_48%),radial-gradient(ellipse_110%_85%_at_50%_100%,rgba(46,125,50,0.35),transparent_55%)]"
      subtitleClassName="mt-6 max-w-md text-xs font-semibold uppercase tracking-[0.28em] text-[#fbc02d]/80 sm:text-sm"
      accentLineClassName="mt-8 h-1 w-[min(14rem,55vw)] rounded-full bg-[linear-gradient(90deg,#2e7d32_0%,#2e7d32_33.33%,#fbc02d_33.33%,#fbc02d_66.66%,#d32f2f_66.66%,#d32f2f_100%)] shadow-[0_0_24px_rgba(251,192,45,0.25)]"
      dotGridBackgroundImage="radial-gradient(rgba(211,47,47,0.1) 1px, transparent 1px), radial-gradient(rgba(251,192,45,0.09) 1px, transparent 1px), radial-gradient(rgba(46,125,50,0.1) 1px, transparent 1px)"
      dotGridOpacity={0.22}
    >
      <SiteLayout
        role={role}
        transparentHeaderAtTop={true}
        banner={
          notice === "admin-denied" ? (
            <PageBanner>
              <Callout tone="warning" title="Acceso denegado">
                <p>El panel administrativo está reservado para cuentas con rol Admin.</p>
              </Callout>
            </PageBanner>
          ) : null
        }
      >
      <HomeHeroSection role={role} />

      {/* ── ¿Quiénes somos? ── */}
      <section
        id="quienes-somos"
        className="relative overflow-hidden bg-[#F2EFE9] px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
      >
        {/* Dribbble-style Afro Abstract Background Graphics */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {/* Large Abstract Mudcloth/Geometric Shapes */}
          <svg className="absolute -top-32 -left-32 w-[600px] h-[600px] text-[#2e7d32]/5 rotate-12" fill="currentColor" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path d="M100,0 L200,100 L100,200 L0,100 Z" />
            <circle cx="100" cy="100" r="50" fill="#F2EFE9" />
            <circle cx="100" cy="100" r="20" />
            <path d="M40,40 L160,160 M40,160 L160,40" stroke="#F2EFE9" strokeWidth="8" />
          </svg>
          
          {/* Graphic Rhythmic Stepped Lines */}
          <svg className="absolute top-1/2 -right-20 w-[400px] h-[400px] text-[#d32f2f]/5 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <polyline points="20,100 60,60 100,100 140,60 180,100" />
            <polyline points="20,140 60,100 100,140 140,100 180,140" />
            <polyline points="20,180 60,140 100,180 140,140 180,180" />
            <circle cx="100" cy="100" r="12" fill="currentColor" />
          </svg>

          {/* Yellow vibrant accent blob */}
          <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] rounded-full bg-gradient-to-t from-[#fbc02d]/10 to-transparent blur-[120px]" />
          
          {/* Subtle repeating grid texture to reduce "white space" feel */}
          <div className="absolute inset-0 opacity-[0.04] mix-blend-multiply"
               style={{ backgroundImage: "radial-gradient(#1a1a1a 2px, transparent 2px)", backgroundSize: "32px 32px" }} />
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col gap-10 rounded-[32px] border border-[#e8dfd3] bg-white/70 p-8 shadow-sm backdrop-blur-xl sm:p-12">
          {/* Top: accent bar + heading + PCN dots */}
          <div className="flex gap-6">
            <div className="w-1.5 shrink-0 rounded-full bg-gradient-to-b from-[#2e7d32] via-[#fbc02d] to-[#d32f2f]" aria-hidden="true" />
            <div className="flex flex-col justify-start w-full">
              <p className="eyebrow mb-3 text-[#2e7d32]">Nuestra esencia</p>
              <h2 className="font-display text-4xl leading-tight text-[#1a1a1a] sm:text-5xl lg:text-6xl">
                Quiénes somos
              </h2>
              <div className="mt-8 flex items-center gap-3" aria-hidden="true">
                <span className="h-3.5 w-3.5 rounded-full bg-[#2e7d32] shadow-sm" />
                <span className="h-3.5 w-3.5 rounded-full bg-[#d32f2f] shadow-sm" />
                <span className="h-3.5 w-3.5 rounded-full bg-[#fbc02d] shadow-sm" />
              </div>
            </div>
          </div>
          {/* Bottom: paragraphs */}
          <div className="relative w-full">
            <HomeWhoWeAreAccordion
              introParagraphs={homeIntro}
              strategicFunctionsIntro={homeStrategicFunctionsIntro}
              strategicFunctions={homeStrategicFunctions}
              strategicFunctionsClosing={homeStrategicFunctionsClosing}
            />
          </div>
        </div>
      </section>

      {/* ── Video + Nuestra orientación política ── */}
      <section className="bg-[#f0eae0] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-7xl items-start gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Video Gallery */}
          <HomeVideoGallery />

          {/* Orientación política card */}
          <div className="flex flex-col gap-5 rounded-[28px] border border-[#e8dfd3] bg-white p-8">
            {/* multi-stripe top accent */}
            <div className="flex h-1 overflow-hidden rounded-full" aria-hidden="true">
              <span className="flex-1 bg-[#2e7d32]" />
              <span className="flex-1 bg-[#d32f2f]" />
              <span className="flex-1 bg-[#fbc02d]" />
            </div>
            <h2 className="font-display text-3xl text-[#1a1a1a]">NUESTRA ORIENTACIÓN POLÍTICA</h2>
            <HomePoliticalOrientationAccordion
              intro={homePoliticalOrientationIntro}
              lead={homePoliticalOrientationLead}
              pillars={homePoliticalOrientationPillars}
            />
          </div>
        </div>
      </section>

      {/* ── Accesos rápidos ── */}
      <section className="bg-[#f0eae0] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <p className="eyebrow mb-3">Nuestro quehacer</p>
          <h2 className="font-display text-3xl text-[#1a1a1a] sm:text-4xl">Accesos rápidos</h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-[#4a4540]">
            Explora los módulos de la plataforma según el área de trabajo.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                color: "#2e7d32",
                lightBg: "#d8f3dc",
                tag: "Gobierno propio",
                title: "Áreas bioculturales de conservación comunitaria",
                description:
                  "Territorios colectivos con enfoque de pueblo negro: cartografía, acuerdos comunitarios y estrategias de conservación biocultural.",
                href: "/gobierno-propio/conservacion",
                cta: "Explorar áreas",
              },
              {
                color: "#1565c0",
                lightBg: "#e3f2fd",
                tag: "Gobierno propio",
                title: "Protección hídrica",
                description:
                  "Instrumentos, resoluciones y rutas de litigio para la defensa de cuencas y fuentes de agua.",
                href: "/gobierno-propio/proteccion-hidrica",
                cta: "Ver instrumentos",
              },
              {
                color: "#d32f2f",
                lightBg: "#fddede",
                tag: "SCITA",
                title: "SIG-A",
                description:
                  "Sistema de información geográfica afrodescendiente — geoportal y tableros de datos territoriales del Pacífico colombiano.",
                href: "/geoportal",
                cta: "Abrir SIG-A",
              },
            ].map((item) => (
              <article
                key={item.title}
                className="surface-card flex h-full flex-col gap-5 overflow-hidden"
              >
                <div className="h-1.5 w-full rounded-full" style={{ background: item.color }} />
                <span
                  className="inline-block rounded-full px-3 py-1 text-xs font-semibold"
                  style={{ background: item.lightBg, color: item.color }}
                >
                  {item.tag}
                </span>
                <div className="space-y-3">
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
            ))}
          </div>

          {isInternal(role) ? (
            <div className="mt-6 rounded-[28px] border border-[#e8dfd3] bg-[#fff3cd] px-6 py-4 text-sm text-[#1a1a1a]">
              <span className="font-semibold">Acceso interno disponible: </span>
              <Link
                href={withRole("/geoportal", role)}
                className="font-semibold text-[#2e7d32] underline hover:text-[#1b5e20]"
              >
                Geoportal del equipo SIG →
              </Link>
            </div>
          ) : null}
        </div>
      </section>

      {/* ── Entérate + Lo último ── */}
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
                    <span>{new Intl.DateTimeFormat("es-CO", { dateStyle: "medium" }).format(new Date(n.publishedAt))}</span>
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

              <div className="bg-[#fcfbfa] p-5 border-t border-[#e8dfd3]">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7a756e] mb-4 px-1">
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

      {/* ── Quote / PCN identity block ── */}
      <section className="relative overflow-hidden bg-[#1a1a1a] px-4 py-16 sm:px-6 lg:px-8">
        <div className="absolute left-0 top-0 h-full w-2" aria-hidden="true">
          <span className="block h-1/4 bg-[#1a1a1a]" />
          <span className="block h-1/4 bg-[#2e7d32]" />
          <span className="block h-1/4 bg-[#d32f2f]" />
          <span className="block h-1/4 bg-[#fbc02d]" />
        </div>
        <div className="mx-auto max-w-3xl pl-8">
          <p className="font-display text-2xl italic leading-relaxed text-white sm:text-3xl">
            &ldquo;El territorio es la vida y la vida no se vende, se ama y se defiende.&rdquo;
          </p>
          <p className="mt-4 text-sm text-white/50">— Mayoras y jóvenes del Palenque Alto Cauca, PCN</p>
        </div>
      </section>
      </SiteLayout>
    </PageIntroOverlay>
  );
}
