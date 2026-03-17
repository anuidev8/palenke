import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Search } from "lucide-react";
import { Callout, PageBanner, SiteLayout } from "@/components/mock/ui";
import { homeIntro } from "@/lib/mock-data";
import { getViewerRole, isInternal, type SearchParams, withRole } from "@/lib/viewer";
import { HeroCards } from "@/components/home/HeroCards";
import { getHomePcnNews, getLatestTerritorialEvents } from "@/lib/newsroom";

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

        <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col px-4 pb-6 pt-6 sm:px-6 sm:pb-8 sm:pt-8 lg:px-8 lg:pb-10 lg:pt-8">
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

                  {/* Video Tag Label */}
                  <div className="absolute bottom-5 left-5 rounded-full border border-white/20 bg-black/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-md">
                    Video de presentación
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Video Cards (Inicio, Memoria, Gobierno, SCITA) */}
          <div className="mt-auto pt-2">
            <HeroCards role={role} />
          </div>
        </div>
      </section>

      {/* ── ¿Quiénes somos? ── */}
      <section className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-20">
        {/* Left: accent bar + heading + PCN dots */}
        <div className="flex gap-5">
          <div className="w-1 shrink-0 rounded-full bg-[#2e7d32]" aria-hidden="true" />
          <div>
            <h2 className="font-display text-4xl leading-tight text-[#1a1a1a] sm:text-5xl">
              ¿Quiénes somos?
            </h2>
            <div className="mt-4 flex items-center gap-2" aria-hidden="true">
              <span className="h-3 w-3 rounded-full bg-[#2e7d32]" />
              <span className="h-3 w-3 rounded-full bg-[#d32f2f]" />
              <span className="h-3 w-3 rounded-full bg-[#fbc02d]" />
            </div>
          </div>
        </div>
        {/* Right: paragraphs */}
        <div className="space-y-5">
          {homeIntro.map((paragraph) => (
            <p key={paragraph} className="text-base leading-8 text-[#4a4540]">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      {/* ── Tres funciones estratégicas ── */}
      <section className="bg-[#1a1a1a] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#fbc02d]">
              Marco de acción
            </p>
            <h2 className="font-display text-3xl text-white sm:text-4xl">
              Tres funciones estratégicas
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-white/65">
              El Palenke cumple tres roles complementarios para fortalecer la autonomía y la
              defensa integral del Pueblo Negro.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                num: "01",
                title: "Producción de conocimiento propio",
                body: "Sistematiza saberes ancestrales, experiencias comunitarias e información territorial para fortalecer la toma de decisiones desde el gobierno propio.",
                accent: "#2e7d32",
                bg: "#d8f3dc",
              },
              {
                num: "02",
                title: "Cuidado territorial comunitario",
                body: "Acompaña procesos de monitoreo ambiental y territorial mediante el Sistema Comunitario de Información Territorial y Ambiental (SCITA), que incluye el SIG-A, fortaleciendo el gobierno comunitario sobre los territorios.",
                accent: "#fbc02d",
                bg: "#fff3cd",
              },
              {
                num: "03",
                title: "Incidencia política",
                body: "Promueve el reconocimiento de las comunidades negras como autoridades territoriales y ambientales legítimas, participando en agendas nacionales e internacionales relacionadas con derechos territoriales, biodiversidad y justicia climática.",
                accent: "#d32f2f",
                bg: "#fddede",
              },
            ].map((fn) => (
              <article
                key={fn.num}
                className="flex flex-col gap-5 rounded-[24px] border border-white/10 bg-white/5 p-7 backdrop-blur-sm"
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-bold"
                  style={{ background: fn.bg, color: fn.accent }}
                >
                  {fn.num}
                </div>
                <div>
                  <h3 className="font-display text-xl text-white">{fn.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/65">{fn.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Video + Nuestro quehacer político ── */}
      <section className="bg-[#f0eae0] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Video placeholder */}
          <div className="relative flex min-h-[300px] items-center justify-center overflow-hidden rounded-[28px] bg-[#1a2a1a]">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, rgba(26,26,26,0.92) 0%, rgba(44,62,42,0.85) 100%)",
              }}
            />
            <button
              type="button"
              aria-label="Reproducir video de presentación"
              className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-[#2e7d32] shadow-[0_0_0_8px_rgba(46,125,50,0.25)] transition hover:bg-[#1b5e20]"
            >
              <svg
                viewBox="0 0 24 24"
                fill="white"
                className="h-7 w-7 translate-x-0.5"
                aria-hidden="true"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
            <div className="absolute bottom-4 left-4 rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
              Video de presentación
            </div>
          </div>

          {/* Quehacer político card */}
          <div className="flex flex-col gap-5 rounded-[28px] border border-[#e8dfd3] bg-white p-8">
            {/* multi-stripe top accent */}
            <div className="flex h-1 overflow-hidden rounded-full" aria-hidden="true">
              <span className="flex-1 bg-[#2e7d32]" />
              <span className="flex-1 bg-[#d32f2f]" />
              <span className="flex-1 bg-[#fbc02d]" />
            </div>
            <h2 className="font-display text-3xl text-[#1a1a1a]">Nuestro quehacer político</h2>
            <p className="text-base leading-7 text-[#4a4540]">
              Defendemos el territorio ancestral, fortalecemos el gobierno propio y construimos
              autonomía comunitaria desde los principios de identidad, territorio y participación.
            </p>
            <Link
              href={withRole("/gobierno-propio", role)}
              className="mt-auto inline-flex w-fit items-center gap-2 rounded-full bg-[#2e7d32] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1b5e20]"
            >
              Ver más
            </Link>
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
                tag: "SCITA",
                title: "Área de conservación comunitaria",
                description:
                  "Capas de datos sobre las ACC, cobertura boscosa y alertas territoriales del equipo SIG.",
                href: "/scita",
                cta: "Ver en SCITA",
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
                tag: "SCITA",
                title: "SIG Afrodescendiente",
                description:
                  "Sistema de información geográfica territorial — geoportal y tableros de datos del Pacífico colombiano.",
                href: isInternal(role) ? "/geoportal" : "/scita",
                cta: "Abrir SIG",
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

      {/* ── Nuestra orientación política — 5 pilares ── */}
      <section className="bg-[#f0eae0] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="eyebrow mb-2">Principios organizativos del PCN</p>
              <h2 className="font-display text-3xl text-[#1a1a1a] sm:text-4xl">
                Nuestra orientación política
              </h2>
              <p className="mt-3 max-w-2xl text-base leading-7 text-[#4a4540]">
                El Palenke se orienta por los principios políticos y organizativos del Proceso de
                Comunidades Negras, construidos históricamente en la lucha del pueblo
                afrodescendiente por la dignidad, el territorio y la autodeterminación.
              </p>
            </div>
            <div className="flex h-1 w-48 shrink-0 overflow-hidden rounded-full lg:self-auto" aria-hidden="true">
              <span className="flex-1 bg-[#1a1a1a]" />
              <span className="flex-1 bg-[#2e7d32]" />
              <span className="flex-1 bg-[#d32f2f]" />
              <span className="flex-1 bg-[#fbc02d]" />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {[
              {
                num: "I",
                title: "Autonomía del Pueblo Negro",
                body: "Reconocemos el derecho de las comunidades negras a ejercer gobierno propio sobre sus territorios colectivos, de acuerdo con la Constitución Política, la Ley 70 de 1993 y los instrumentos internacionales de derechos de los pueblos afrodescendientes.",
                color: "#1a1a1a",
                bg: "#f0eae0",
                border: "#1a1a1a",
              },
              {
                num: "II",
                title: "Defensa integral del territorio",
                body: "Entendemos el territorio como un espacio de vida que integra tierra, agua, ecosistemas, biodiversidad, cultura, memoria y espiritualidad. La defensa territorial implica proteger estos elementos frente a amenazas extractivas, ambientales y sociales.",
                color: "#2e7d32",
                bg: "#d8f3dc",
                border: "#2e7d32",
              },
              {
                num: "III",
                title: "Gobernanza comunitaria",
                body: "Promovemos el fortalecimiento de los Consejos Comunitarios como autoridades legítimas de sus territorios, apoyando la construcción de instrumentos propios de gobierno y herramientas legislativas para la gestión territorial.",
                color: "#1565c0",
                bg: "#e3f2fd",
                border: "#1565c0",
              },
              {
                num: "IV",
                title: "Justicia racial, ambiental y climática",
                body: "Reconocemos que los territorios afrodescendientes son fundamentales para la conservación de ecosistemas bioculturales estratégicos. Impulsamos una agenda de justicia política, climática y sociocultural que reconozca el papel histórico de las comunidades negras.",
                color: "#d32f2f",
                bg: "#fddede",
                border: "#d32f2f",
              },
              {
                num: "V",
                title: "Conocimiento ancestral y diálogo de saberes",
                body: "Valoramos los saberes de mayoras y mayores como fundamento del pensamiento afrodescendiente, promoviendo su diálogo con herramientas técnicas, académicas y tecnológicas para fortalecer la autonomía territorial.",
                color: "#f57f17",
                bg: "#fff3cd",
                border: "#f57f17",
              },
            ].map((pillar) => (
              <article
                key={pillar.num}
                className="flex flex-col gap-4 rounded-[24px] border-t-4 bg-white p-6 shadow-sm"
                style={{ borderTopColor: pillar.border }}
              >
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold"
                  style={{ background: pillar.bg, color: pillar.color }}
                >
                  {pillar.num}
                </div>
                <h3 className="font-display text-lg leading-snug text-[#1a1a1a]">{pillar.title}</h3>
                <p className="text-sm leading-6 text-[#4a4540]">{pillar.body}</p>
              </article>
            ))}
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
