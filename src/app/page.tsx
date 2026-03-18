import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, ChevronDown, Search } from "lucide-react";
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
import { getViewerRole, isInternal, type SearchParams, withRole } from "@/lib/viewer";
import { HeroCards } from "@/components/home/HeroCards";
import {
  HomePoliticalOrientationAccordion,
  HomeWhoWeAreAccordion,
} from "@/components/home/HomeInfoAccordions";
import { getHomePcnNews, getLatestTerritorialEvents } from "@/lib/newsroom";
import { ExpandableVideo } from "@/components/home/ExpandableVideo";
import { HomeVideoGallery } from "@/components/home/HomeVideoGallery";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const role = getViewerRole(params);
  const notice = params.notice;
  const noticias = getHomePcnNews(2);
  const ultimosEventos = getLatestTerritorialEvents(4);

  return (
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
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-[#1a2a1a]">
        {/* Main Background Image/Video */}
        <div className="absolute inset-0 z-0">
          {/* Background Moving Video */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover opacity-30 mix-blend-screen"
          >
            <source src="/hero-bg.mp4" type="video/mp4" />
          </video>
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, rgba(26,26,26,0.95) 0%, rgba(44,62,42,0.85) 100%)",
            }}
          />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[90vh] w-full max-w-7xl flex-col px-4 pb-6 pt-6 sm:px-6 sm:pb-8 sm:pt-8 lg:px-8 lg:pb-10 lg:pt-8">
          {/* Masthead row */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <Link href={withRole("/", role)} className="flex items-center gap-3">
              <Image
                src="/assets/logo.svg"
                alt="Logo Palenke / PCN"
                width={56}
                height={56}
                priority
                className="h-12 w-12 shrink-0 sm:h-14 sm:w-14"
              />
              <span className="min-w-0">
                <span className="block font-display text-xl leading-none text-white sm:text-2xl">
                  Palenke
                </span>
                <span className="mt-1 block text-[11px] font-medium uppercase tracking-[0.24em] text-white/60 sm:text-xs">
                  Pensamiento y Territorio
                </span>
              </span>
            </Link>

            <form
              action="/biblioteca"
              className="flex w-full items-center gap-3 rounded-full border border-white/15 bg-black/20 px-4 py-2.5 backdrop-blur-md transition focus-within:border-white/35 focus-within:bg-black/30 sm:max-w-sm lg:max-w-md"
            >
              {role !== "public" ? <input type="hidden" name="role" value={role} /> : null}
              <Search className="h-4 w-4 shrink-0 text-white/60" aria-hidden="true" />
              <label htmlFor="hero-search" className="sr-only">
                Buscar en la biblioteca
              </label>
              <input
                id="hero-search"
                name="q"
                type="search"
                placeholder="Buscar en la biblioteca..."
                className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-white/45 focus:outline-none"
              />
              <button
                type="submit"
                className="inline-flex shrink-0 items-center rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#1a1a1a] transition hover:bg-[#f0eae0]"
              >
                Buscar
              </button>
            </form>
          </div>

          {/* Top content: Two columns (Text + Presentation Video) */}
          <div className="flex flex-1 items-center py-8 sm:py-10 lg:py-12">
            <div className="grid w-full gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center xl:gap-14">
              {/* Left: Text & CTAs */}
              <div className="flex flex-col items-start text-left">
                {/* 3-color line highlight */}
                <div className="mb-8 flex h-1 w-48 overflow-hidden rounded-full" aria-hidden="true">
                  <span className="flex-1 bg-[#2e7d32]" />
                  <span className="flex-1 bg-[#fbc02d]" />
                  <span className="flex-1 bg-[#d32f2f]" />
                </div>

                <h1 className="font-display text-5xl leading-[0.95] text-white sm:text-6xl lg:text-[72px]">
                  Nuestras Raíces,<br />Nuestro Territorio
                </h1>
                <p className="mt-6 max-w-xl text-base leading-7 text-white/75 sm:text-lg">
                  Espacio digital para organizar, custodiar y comunicar el trabajo político,
                  técnico y comunitario del Palenke y el PCN.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    href={withRole("/gobierno-propio", role)}
                    className="inline-flex items-center gap-2 rounded-full bg-[#2e7d32] px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-green-900/20 transition hover:bg-[#1b5e20]"
                  >
                    Conoce Nuestra Lucha
                  </Link>
                </div>
              </div>

              {/* Right: Presentation Video Container */}
              <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
                <ExpandableVideo videoId="hero" fullSrc="/hero-bg.mp4">
                  <div className="group relative aspect-video overflow-hidden rounded-[28px] border border-white/10 bg-[#1a1a1a] shadow-2xl shadow-black/50 transition-transform duration-300 hover:scale-[1.02]">
                    {/* Simulated Presentation Video Background */}
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 h-full w-full object-cover opacity-70 transition-opacity duration-300 group-hover:opacity-100"
                    >
                      <source src="https://cdn.pixabay.com/video/2019/11/10/28906-372990424_tiny.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/10" />

                    {/* Play Icon Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#2e7d32] shadow-[0_0_0_8px_rgba(46,125,50,0.25)] transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#1b5e20]">
                        <svg viewBox="0 0 24 24" fill="white" className="h-7 w-7 translate-x-0.5" aria-hidden="true">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>

                    {/* Video Tag Label */}
                    <div className="absolute bottom-5 left-5 rounded-full border border-white/20 bg-black/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-md z-10">
                      Video de presentación
                    </div>
                  </div>
                </ExpandableVideo>
              </div>
            </div>
          </div>

          {/* Video Cards (Inicio, Memoria, Gobierno, SCITA) */}
          <div className="mt-auto pt-2">
            <HeroCards role={role} />
          </div>
        </div>

        <a
          href="#quienes-somos"
          aria-label="Hay más contenido. Desplazarse a la siguiente sección"
          className="absolute bottom-3 right-1 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/35 bg-black/45 text-white shadow-lg backdrop-blur-md transition hover:bg-black/65 motion-reduce:transition-none sm:bottom-4 sm:right-2 lg:bottom-5 lg:right-3"
        >
          <ChevronDown className="h-5 w-5 animate-bounce motion-reduce:animate-none" aria-hidden="true" />
        </a>
      </section>

      {/* ── ¿Quiénes somos? ── */}
      <section
        id="quienes-somos"
        className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-20"
      >
        {/* Left: accent bar + heading + PCN dots */}
        <div className="flex gap-5">
          <div className="w-1 shrink-0 rounded-full bg-[#2e7d32]" aria-hidden="true" />
          <div>
            <h2 className="font-display text-4xl leading-tight text-[#1a1a1a] sm:text-5xl">
              QUIÉNES SOMOS
            </h2>
            <div className="mt-4 flex items-center gap-2" aria-hidden="true">
              <span className="h-3 w-3 rounded-full bg-[#2e7d32]" />
              <span className="h-3 w-3 rounded-full bg-[#d32f2f]" />
              <span className="h-3 w-3 rounded-full bg-[#fbc02d]" />
            </div>
          </div>
        </div>
        {/* Right: paragraphs */}
        <HomeWhoWeAreAccordion
          introParagraphs={homeIntro}
          strategicFunctionsIntro={homeStrategicFunctionsIntro}
          strategicFunctions={homeStrategicFunctions}
          strategicFunctionsClosing={homeStrategicFunctionsClosing}
        />
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
                tag: "Memoria Afroterritorial",
                title: "Memoria viva del territorio",
                description:
                  "Explora relatos, archivos y contenidos culturales que preservan la historia comunitaria.",
                href: "/biblioteca?section=Memoria+viva+del+territorio",
                cta: "Ver memoria",
              },
              {
                color: "#1565c0",
                lightBg: "#e3f2fd",
                tag: "Gobierno propio",
                title: "Protección hídrica",
                description:
                  "Instrumentos, resoluciones y rutas de litigio para la defensa de cuencas y fuentes de agua.",
                href: "/gobierno-propio",
                cta: "Ver instrumentos",
              },
              {
                color: "#d32f2f",
                lightBg: "#fddede",
                tag: isInternal(role) ? "SCITA" : "Memoria Afroterritorial",
                title: isInternal(role) ? "SIG Afrodescendiente" : "Archivo comunitario",
                description: isInternal(role)
                  ? "Sistema de información geográfica territorial — geoportal y tableros de datos del Pacífico colombiano."
                  : "Documentos, voces y registros para fortalecer la memoria y el cuidado del territorio.",
                href: isInternal(role)
                  ? "/geoportal"
                  : "/biblioteca?section=Memoria+viva+del+territorio",
                cta: isInternal(role) ? "Abrir SIG" : "Explorar archivo",
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

          {/* Entérate — news cards */}
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
              {noticias.map((n) => (
                <article
                  key={n.slug}
                  className="surface-card flex flex-col gap-4"
                  style={{ borderTopColor: n.categoriaColor, borderTopWidth: "3px" }}
                >
                  {/* placeholder image */}
                  <div
                    className="flex h-[140px] items-end rounded-[20px] p-4"
                    style={{
                      background: `linear-gradient(135deg, ${n.categoriaColor}cc, ${n.categoriaColor}66)`,
                    }}
                  >
                    <span className="rounded-full border border-white/25 bg-black/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white">
                      {n.categoria}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#7a756e]">
                    <span className="rounded-full bg-[#1a1a1a] px-2.5 py-1 font-semibold text-white">
                      {n.publisher}
                    </span>
                    <span>{n.fecha}</span>
                    <span>·</span>
                    <span>{n.territorio}</span>
                  </div>
                  <h3 className="font-display text-xl text-[#1a1a1a]">{n.titulo}</h3>
                  <p className="line-clamp-2 text-sm leading-6 text-[#4a4540]">{n.resumen}</p>
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

          {/* Lo último — events list */}
          <div>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="eyebrow mb-2">Agenda territorial del proceso</p>
                <h2 className="font-display text-3xl text-[#1a1a1a]">Lo último</h2>
              </div>
              <Link
                href={withRole("/noticias", role)}
                className="hidden items-center gap-2 text-sm font-semibold text-[#2e7d32] transition hover:text-[#1b5e20] sm:inline-flex"
              >
                Ver todo
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="divide-y divide-[#e8dfd3] rounded-[28px] border border-[#e8dfd3] bg-white overflow-hidden">
              {ultimosEventos.map((ev, i) => (
                <div key={i} className="flex items-start gap-4 px-5 py-4 transition hover:bg-[#f8f5f2]">
                  <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-xl bg-[#f0eae0]">
                    <Calendar className="h-4 w-4 text-[#7a756e]" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-[#7a756e]">
                      {ev.fecha} · <span className="font-semibold text-[#1a1a1a]">{ev.tipo}</span>
                    </p>
                    <p className="mt-1 text-sm font-medium leading-5 text-[#1a1a1a]">{ev.titulo}</p>
                    <p className="mt-0.5 text-xs text-[#7a756e]">{ev.lugar}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 sm:hidden">
              <Link
                href={withRole("/noticias", role)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#2e7d32] transition hover:text-[#1b5e20]"
              >
                Ver toda la agenda
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
            &ldquo;El territorio no es solo tierra, es memoria, identidad y futuro.&rdquo;
          </p>
          <p className="mt-4 text-sm text-white/50">— Proceso de Comunidades Negras, PCN</p>
        </div>
      </section>
    </SiteLayout>
  );
}
