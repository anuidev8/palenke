import Link from "next/link";
import { ArrowRight, Calendar, Download, ExternalLink, MapPin } from "lucide-react";
import { SiteLayout } from "@/components/mock/ui";
import { getViewerRole, type SearchParams, withRole } from "@/lib/viewer";

export default async function MemoriaAfroterritorialPage({
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
        { label: "Memoria Afrodescendiente" },
      ]}
    >
      {/* ── Hero — video thumbnail + ¿Qué es? ── */}
      <section className="relative overflow-hidden bg-[#1a1a1a]">
        <div className="mx-auto grid max-w-7xl lg:grid-cols-2">
          {/* Left — video thumbnail mockup */}
          <div
            className="relative flex items-center justify-center overflow-hidden"
            style={{ minHeight: 420 }}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at 35% 65%, rgba(46,125,50,0.6), transparent 55%), radial-gradient(ellipse at 80% 20%, rgba(27,94,32,0.4), transparent 50%), linear-gradient(160deg, #0d1f0d 0%, #1a2a1a 100%)",
              }}
            />
            {/* dot texture */}
            <div className="absolute inset-0 opacity-[0.06]" aria-hidden="true">
              {Array.from({ length: 80 }).map((_, i) => (
                <span
                  key={i}
                  className="absolute h-1 w-1 rounded-full bg-white"
                  style={{
                    left: `${(i % 10) * 10 + 5}%`,
                    top: `${Math.floor(i / 10) * 10 + 5}%`,
                  }}
                />
              ))}
            </div>
            {/* SVG territory lines */}
            <svg
              className="absolute inset-0 h-full w-full opacity-[0.18]"
              viewBox="0 0 600 420"
              preserveAspectRatio="xMidYMid slice"
              aria-hidden="true"
            >
              <path
                d="M30,420 Q130,280 190,220 Q270,140 340,160 Q430,180 520,100"
                stroke="white"
                strokeWidth="2.5"
                fill="none"
              />
              <path
                d="M0,310 Q100,280 190,270 Q290,255 360,290 Q440,330 600,290"
                stroke="white"
                strokeWidth="1.5"
                fill="none"
              />
              <ellipse cx="200" cy="220" rx="70" ry="48" fill="#2e7d32" opacity="0.35" />
              <ellipse cx="430" cy="150" rx="90" ry="55" fill="#1b5e20" opacity="0.28" />
            </svg>

            {/* Play button */}
            <div className="relative z-10 flex flex-col items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-white/40 bg-white/10 backdrop-blur-sm">
                <svg
                  viewBox="0 0 24 24"
                  className="h-8 w-8 translate-x-0.5 fill-white"
                  aria-hidden="true"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                Video de presentación
              </span>
            </div>

            {/* Duration badge */}
            <div className="absolute bottom-4 right-4 rounded-md bg-black/70 px-2 py-1 text-xs font-semibold text-white">
              3:45
            </div>
            {/* Module tag */}
            <div className="absolute left-4 top-4 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-white/70 backdrop-blur-sm">
              Módulo
            </div>
          </div>

          {/* Right — ¿Qué es? */}
          <div className="flex flex-col justify-center px-8 py-14 lg:px-12 lg:py-16">
            <span className="mb-4 inline-flex w-fit rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
              Memoria Afrodescendiente
            </span>
            <h1 className="max-w-lg font-display text-4xl leading-tight text-white sm:text-5xl">
              La memoria como instrumento político
            </h1>
            <p className="mt-5 max-w-md text-base leading-7 text-white/75">
              Espacio del Palenke donde se resguarda y activa el conocimiento histórico, jurídico,
              cultural y ancestral del Pueblo Negro — base para la defensa de derechos, la
              identidad colectiva y la toma de decisiones.
            </p>
            {/* Funciones del módulo */}
            <ul className="mt-6 space-y-2.5">
              {[
                "Preservar y organizar el conocimiento jurídico y político del Pueblo Negro.",
                "Visibilizar la producción académica, cultural y comunitaria afrodescendiente.",
                "Fortalecer la identidad, la memoria histórica y el pensamiento propio.",
                "Servir como base para la formación política y la incidencia.",
              ].map((fn) => (
                <li key={fn} className="flex items-start gap-3 text-sm leading-6 text-white/70">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2e7d32]" />
                  {fn}
                </li>
              ))}
            </ul>
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
        </div>
      </section>

      {/* ── Imagen representativa + Dos sub-módulos ── */}
      <section className="border-b border-[#e8dfd3] bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
          {/* Imagen representativa */}
          <div
            className="relative overflow-hidden rounded-[28px]"
            style={{ minHeight: 340 }}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at 30% 70%, rgba(46,125,50,0.75), transparent 55%), radial-gradient(ellipse at 80% 20%, rgba(27,94,32,0.5), transparent 50%), linear-gradient(150deg, #0d1f0d 0%, #2c3e2a 60%, #1a2a1a 100%)",
              }}
            />
            <svg
              className="absolute inset-0 h-full w-full opacity-20"
              viewBox="0 0 600 340"
              preserveAspectRatio="xMidYMid slice"
              aria-hidden="true"
            >
              <path
                d="M50,340 Q150,200 200,150 Q280,80 350,100 Q420,120 500,60"
                stroke="white"
                strokeWidth="3"
                fill="none"
                opacity="0.6"
              />
              <path
                d="M0,250 Q100,220 180,200 Q260,180 320,210 Q400,240 600,200"
                stroke="white"
                strokeWidth="1.5"
                fill="none"
                opacity="0.4"
              />
              <ellipse cx="180" cy="180" rx="65" ry="45" fill="#2e7d32" opacity="0.3" />
              <ellipse cx="390" cy="115" rx="85" ry="52" fill="#1b5e20" opacity="0.25" />
              <circle cx="170" cy="150" r="5" fill="white" opacity="0.8" />
              <circle cx="310" cy="100" r="5" fill="white" opacity="0.8" />
              <circle cx="460" cy="85" r="5" fill="white" opacity="0.8" />
            </svg>
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                Pacífico colombiano
              </p>
              <p className="mt-1 font-display text-xl text-white">
                Territorios colectivos del Pueblo Negro
              </p>
            </div>
          </div>

          {/* Sub-módulos */}
          <div>
            <p className="eyebrow mb-3">Dos sub-módulos</p>
            <div className="mt-2 grid gap-5">
              {/* Sub-módulo 1 */}
              <div className="rounded-[20px] border border-[#2e7d32] bg-[#f8f5f2] p-5">
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2e7d32] text-xs font-bold text-white">
                    01
                  </span>
                  <h3 className="font-display text-xl text-[#1a1a1a]">Norma vigente</h3>
                </div>
                <p className="text-sm leading-6 text-[#4a4540]">
                  Centraliza leyes, decretos, jurisprudencia y tratados relacionados con los
                  derechos del Pueblo Negro — base para litigio estratégico e incidencia.
                </p>
                <Link
                  href={withRole("/biblioteca?section=Norma+vigente", role)}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#2e7d32] hover:text-[#1b5e20]"
                >
                  Explorar normativa
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
              {/* Sub-módulo 2 */}
              <div className="rounded-[20px] border border-[#e8dfd3] bg-[#f8f5f2] p-5">
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1a1a1a] text-xs font-bold text-white">
                    02
                  </span>
                  <h3 className="font-display text-xl text-[#1a1a1a]">Memoria viva del territorio</h3>
                </div>
                <p className="text-sm leading-6 text-[#4a4540]">
                  Producción académica, cultural y comunitaria afrodescendiente — saberes
                  ancestrales, experiencias territoriales y expresiones artísticas del Pacífico.
                </p>
                <Link
                  href={withRole("/biblioteca?section=Memoria+viva", role)}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#1a1a1a] hover:text-[#4a4540]"
                >
                  Explorar memorias
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Memoria viva del territorio — Sub-módulo 02 ── */}
      <section className="bg-white px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-start justify-between gap-6">
            <div>
              <p className="eyebrow mb-2">Sub-módulo 02</p>
              <h2 className="font-display text-3xl text-[#1a1a1a]">Memoria viva del territorio</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#4a4540]">
                Producción académica, cultural y comunitaria — saberes ancestrales, expresiones
                artísticas, investigaciones propias y relatos del Pacífico colombiano.
              </p>
            </div>
            <Link
              href={withRole("/biblioteca?section=Memoria+viva", role)}
              className="hidden shrink-0 items-center gap-2 rounded-full border-2 border-[#1a1a1a] px-5 py-2.5 text-sm font-semibold text-[#1a1a1a] transition hover:bg-[#f0eae0] sm:inline-flex"
            >
              Ver todo el acervo
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                category: "Investigación",
                categoryColor: "#1565c0",
                categoryBg: "#e3f2fd",
                title: "Biodiversidad y territorio en el Pacífico sur",
                territory: "Tumaco",
                year: "2023",
                gradientFrom: "#1b5e20",
                gradientTo: "#0d1f0d",
                pdfUrl: "#",
                sourceUrl: null,
              },
              {
                category: "Cultural",
                categoryColor: "#d32f2f",
                categoryBg: "#fddede",
                title: "Cantos y saberes de las mayoras del Atrato",
                territory: "Chocó",
                year: "2022",
                gradientFrom: "#2c3e2a",
                gradientTo: "#1a2a1a",
                pdfUrl: "#",
                sourceUrl: null,
              },
              {
                category: "Comunitario",
                categoryColor: "#2e7d32",
                categoryBg: "#d8f3dc",
                title: "Plan de vida del Consejo Comunitario Alto Mira",
                territory: "Nariño",
                year: "2023",
                gradientFrom: "#1a2a4a",
                gradientTo: "#0d1a2a",
                pdfUrl: "#",
                sourceUrl: null,
              },
              {
                category: "Académico",
                categoryColor: "#f57f17",
                categoryBg: "#fff3cd",
                title: "Espiritualidad y resistencia territorial afrodescendiente",
                territory: "Cauca",
                year: "2021",
                gradientFrom: "#3e2a0d",
                gradientTo: "#1a1408",
                pdfUrl: "#",
                sourceUrl: "https://revistas.unal.edu.co",
              },
            ].map((item) => (
              <article
                key={item.title}
                className="group flex flex-col overflow-hidden rounded-[20px] border border-[#e8dfd3] bg-white transition hover:shadow-sm"
              >
                {/* Thumbnail */}
                <div
                  className="relative h-36 w-full"
                  style={{
                    background: `linear-gradient(150deg, ${item.gradientFrom}, ${item.gradientTo})`,
                  }}
                >
                  <div
                    className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em]"
                    style={{ background: item.categoryBg, color: item.categoryColor }}
                  >
                    {item.category}
                  </div>
                </div>
                {/* Content */}
                <div className="flex flex-1 flex-col gap-3 p-4">
                  <h3 className="font-display text-base leading-snug text-[#1a1a1a]">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-[#7a756e]">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" aria-hidden="true" />
                      {item.territory}
                    </span>
                    <span>{item.year}</span>
                  </div>
                  {/* Actions: Descargar PDF + Fuente */}
                  <div className="mt-auto flex flex-wrap gap-2">
                    {item.pdfUrl ? (
                      <a
                        href={item.pdfUrl}
                        download
                        className="inline-flex items-center gap-1 rounded-full bg-[#1a1a1a] px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-[#333]"
                      >
                        <Download className="h-3 w-3" aria-hidden="true" />
                        Descargar
                      </a>
                    ) : null}
                    {item.sourceUrl ? (
                      <a
                        href={item.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-full border border-[#e8dfd3] px-3 py-1.5 text-[11px] font-semibold text-[#4a4540] transition hover:bg-[#f0eae0]"
                      >
                        <ExternalLink className="h-3 w-3" aria-hidden="true" />
                        Fuente
                      </a>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Vení te contamos — eventos ── */}
      <section className="bg-[#2c3e2a] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-start justify-between gap-6">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#fbc02d]">
                Agenda y eventos
              </p>
              <h2 className="font-display text-3xl text-white">Vení, te contamos</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-white/65">
                Espacios académicos, normativos y culturales del Proceso de Comunidades Negras —
                conversatorios, formaciones y encuentros territoriales.
              </p>
            </div>
            <Link
              href={withRole("/noticias", role)}
              className="hidden shrink-0 items-center gap-2 rounded-full border border-white/25 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 sm:inline-flex"
            >
              Ver todos los eventos
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[
              {
                type: "Conversatorio",
                typeColor: "#fbc02d",
                date: "28 Mar 2026",
                title: "Ley 70 y sus desarrollos normativos recientes",
                location: "Buenaventura",
                description:
                  "Análisis de los últimos decretos reglamentarios y su impacto en los territorios colectivos del Pacífico sur.",
              },
              {
                type: "Formación",
                typeColor: "#a5d6a7",
                date: "10 Abr 2026",
                title: "Escuela de liderazgos territoriales PCN",
                location: "Tumaco",
                description:
                  "Módulo de gobierno propio y derecho mayor para delegados de Consejos Comunitarios del Pacífico nariñense.",
              },
              {
                type: "Encuentro",
                typeColor: "#ef9a9a",
                date: "22 Abr 2026",
                title: "Memorias del Atrato: saberes y territorio",
                location: "Quibdó",
                description:
                  "Encuentro intercultural de mayoras y jóvenes del Chocó para la transmisión de conocimientos ancestrales y ambientales.",
              },
              {
                type: "Académico",
                typeColor: "#90caf9",
                date: "15 May 2026",
                title: "Jurisprudencia étnica y cambio climático",
                location: "En línea",
                description:
                  "Seminario sobre litigio climático y los derechos de los ríos como sujetos de derechos — caso Atrato.",
              },
              {
                type: "Cultural",
                typeColor: "#ce93d8",
                date: "30 May 2026",
                title: "Festival de tradición oral del Pacífico",
                location: "Cali",
                description:
                  "Celebración de la oralidad afropacífica: cuentos, rezos, alabaos y cantos del litoral como patrimonio vivo.",
              },
              {
                type: "Comunitario",
                typeColor: "#a5d6a7",
                date: "12 Jun 2026",
                title: "Asamblea de Consejos Comunitarios Palenke",
                location: "Buenaventura",
                description:
                  "Espacio de planificación y toma de decisiones colectivas de los Consejos adscritos al Palenke del Pacífico.",
              },
            ].map((ev) => (
              <article
                key={ev.title}
                className="flex flex-col gap-4 rounded-[20px] border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition hover:bg-white/8"
              >
                <div className="flex items-center justify-between gap-3">
                  <span
                    className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em]"
                    style={{ background: `${ev.typeColor}22`, color: ev.typeColor }}
                  >
                    {ev.type}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-white/50">
                    <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                    {ev.date}
                  </span>
                </div>
                <div>
                  <h3 className="font-display text-base leading-snug text-white">{ev.title}</h3>
                  <p className="mt-2 text-xs leading-5 text-white/60">{ev.description}</p>
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs text-white/45">
                    <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                    {ev.location}
                  </span>
                  <Link
                    href={withRole("/noticias", role)}
                    className="text-xs font-semibold text-white/70 transition hover:text-white"
                  >
                    Ver más →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

    </SiteLayout>
  );
}
