import Link from "next/link";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import { SiteLayout } from "@/components/mock/ui";
import { VideoThumbnail } from "@/components/palenke/VideoThumbnail";
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
        { label: "Memoria Afroterritorial" },
      ]}
    >

      {/* ── 1) MEMORIA AFROTERRITORIAL + VIDEO DE PRESENTACIÓN ── */}
      <section className="bg-[#1a1a1a]">
        <div className="relative">
          <VideoThumbnail
            label="Video de presentación"
            duration="3:45"
            tag="Memoria Afroterritorial"
            style={{ minHeight: 480 }}
          />
          {/* Page title overlay at bottom-left */}
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-6 pb-8 pt-20 lg:px-10">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.22em] text-white/60">
              1. MEMORIA AFROTERRITORIAL
            </p>
            <h1 className="font-display text-3xl text-white sm:text-4xl lg:text-5xl">
              Memoria Afroterritorial
            </h1>
          </div>
        </div>
      </section>

      {/* ── Definición + Función (left) | Imagen (right) ── */}
      <section className="border-b border-[#e8dfd3] bg-white px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-14">

          {/* Left — Definición y Función */}
          <div>
            <h2 className="font-display text-3xl text-[#1a1a1a] sm:text-4xl">Nuestra Memoria</h2>
            <p className="mt-5 text-base leading-8 text-[#4a4540]">
              Nuestra memoria es el corazón que late en cada río, manglar y comunidad del Pacífico.
              Este espacio del Palenke es un refugio vivo donde resguardamos las voces de nuestras mayoras y mayores,
              nuestras luchas históricas y el conocimiento ancestral del Pueblo Negro. Aquí, la memoria se hace
              semilla para defender nuestro territorio, reafirmar nuestra identidad colectiva y mantener vivo nuestro legado.
            </p>
            <h3 className="mt-8 font-display text-2xl text-[#1a1a1a]">Nuestro Propósito</h3>
            <ul className="mt-6 space-y-3">
              {[
                "Cuidar como tesoro colectivo el conocimiento jurídico y político del Pueblo Negro.",
                "Elevar las voces y saberes de nuestras comunidades, celebrando nuestra producción cultural.",
                "Tejer lazos de identidad y pensamiento propio que conecten a las nuevas generaciones.",
                "Ser faro e inspiración para la formación política y la defensa incansable de nuestros derechos.",
              ].map((fn) => (
                <li key={fn} className="flex items-start gap-3 text-sm leading-6 text-[#4a4540]">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2e7d32]" />
                  {fn}
                </li>
              ))}
            </ul>
          </div>

          {/* Right — Imagen representativa */}
          <div
            className="relative min-h-[320px] overflow-hidden rounded-[28px] lg:min-h-[400px]"
            style={{
              background:
                "radial-gradient(ellipse at 30% 70%, rgba(46,125,50,0.75), transparent 55%), radial-gradient(ellipse at 80% 20%, rgba(27,94,32,0.5), transparent 50%), linear-gradient(150deg, #0d1f0d 0%, #2c3e2a 60%, #1a2a1a 100%)",
            }}
          >
            <svg
              className="absolute inset-0 h-full w-full opacity-20"
              viewBox="0 0 600 400"
              preserveAspectRatio="xMidYMid slice"
              aria-hidden="true"
            >
              <path
                d="M50,400 Q150,240 200,180 Q280,100 350,120 Q420,140 500,70"
                stroke="white" strokeWidth="3" fill="none" opacity="0.6"
              />
              <path
                d="M0,290 Q100,260 180,240 Q260,215 320,245 Q400,275 600,235"
                stroke="white" strokeWidth="1.5" fill="none" opacity="0.4"
              />
              <ellipse cx="180" cy="200" rx="65" ry="45" fill="#2e7d32" opacity="0.3" />
              <ellipse cx="390" cy="130" rx="85" ry="52" fill="#1b5e20" opacity="0.25" />
              <circle cx="170" cy="170" r="5" fill="white" opacity="0.8" />
              <circle cx="310" cy="115" r="5" fill="white" opacity="0.8" />
              <circle cx="460" cy="95" r="5" fill="white" opacity="0.8" />
            </svg>
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                Memoria viva del territorio
              </p>
              <p className="mt-1 font-display text-xl text-white">
                Conocimiento histórico, jurídico, cultural y ancestral
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Normativa vigente ── */}
      <section className="bg-[#f8f5f2] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-14">

          {/* Left — Normativa vigente card */}
          <div className="flex flex-col gap-6 rounded-[28px] border-2 border-[#2e7d32] bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2e7d32] text-sm font-bold text-white">
                01
              </span>
            </div>
            <h2 className="font-display text-3xl text-[#1a1a1a]">Normativa vigente</h2>
            <p className="text-base leading-7 text-[#4a4540]">
              Espacio que recopila y organiza el marco normativo nacional e internacional
              relacionado con los derechos del Pueblo Negro, afrocolombiano, raizal y palenquero.
            </p>
            <Link
              href={withRole("/biblioteca?section=Normativa+vigente", role)}
              className="mt-auto inline-flex w-fit items-center gap-2 rounded-full bg-[#2e7d32] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#1b5e20]"
            >
              Explorar normativa vigente
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          {/* Right — Definición y Función */}
          <div>
            <p className="eyebrow mb-2">Normativa vigente</p>
            <h3 className="font-display text-2xl text-[#1a1a1a] sm:text-3xl">El Marco de Nuestros Derechos</h3>
            <p className="mt-4 text-base leading-7 text-[#4a4540]">
              Aquí reunimos las leyes, decretos y sentencias que nuestras comunidades han conquistado
              con sudor y resistencia. Es la herramienta jurídica que ampara nuestro derecho fundamental
              a ser y existir en el territorio.
            </p>
            <h4 className="mt-7 font-display text-2xl text-[#1a1a1a]">Nuestra Herramienta de Defensa</h4>
            <ul className="mt-6 space-y-4">
              {[
                "Tener a mano las leyes y tratados que nos protegen como pueblo.",
                "Entregar a nuestros liderazgos las herramientas legales necesarias para proteger su territorio.",
                "Fortalecer la voz de la comunidad cuando exige respeto y justicia.",
                "Respaldar con argumentos firmes nuestra incidencia y defensa jurídica territorial.",
              ].map((fn) => (
                <li key={fn} className="flex items-start gap-3 text-base leading-7 text-[#4a4540]">
                  <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2e7d32]" />
                  {fn}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Memoria viva del territorio ── */}
      <section className="bg-white px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-start gap-10 lg:grid-cols-2 lg:gap-14">

          {/* Left — Definición y Función */}
          <div>
            <p className="eyebrow mb-3">Memoria viva del territorio</p>
            <h2 className="font-display text-3xl text-[#1a1a1a] sm:text-4xl">El Latir de Nuestra Cultura</h2>
            <p className="mt-5 text-base leading-8 text-[#4a4540]">
              Es el eco de nuestros alabaos, la fuerza de nuestros liderazgos y la sabiduría de nuestras abuelas.
              Aquí circula el pensamiento afrodescendiente, abrazando la academia, la cultura comunitaria y las
              expresiones vivas que hacen palpitar al territorio.
            </p>
            <h3 className="mt-8 font-display text-2xl text-[#1a1a1a]">Cómo Mantenemos Viva la Llama</h3>
            <ul className="mt-6 space-y-3">
              {[
                "Dar a conocer las investigaciones y el pensamiento propio nacido de nuestras entrañas.",
                "Recoger con amor las historias, luchas y experiencias de cada rincón del territorio.",
                "Celebrar nuestras prácticas culturales, saberes y el arte que nos define.",
                "Construir puentes vivos entre el conocimiento comunitario, la organización y la academia.",
              ].map((fn) => (
                <li key={fn} className="flex items-start gap-3 text-sm leading-6 text-[#4a4540]">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2e7d32]" />
                  {fn}
                </li>
              ))}
            </ul>
          </div>

          {/* Right — Memoria viva del territorio CTA card */}
          <div
            className="relative flex min-h-[320px] flex-col justify-end overflow-hidden rounded-[28px] p-8"
            style={{
              background:
                "radial-gradient(ellipse at 25% 75%, rgba(46,125,50,0.7), transparent 55%), linear-gradient(150deg, #1a2a1a 0%, #2c3e2a 60%, #0d1f0d 100%)",
            }}
          >
            {/* decorative dots */}
            <div className="absolute right-6 top-6 grid grid-cols-4 gap-2 opacity-25" aria-hidden="true">
              {Array.from({ length: 12 }).map((_, i) => (
                <span key={i} className="h-1.5 w-1.5 rounded-full bg-white" />
              ))}
            </div>
            <h3 className="font-display text-2xl leading-tight text-white sm:text-3xl">
              Memoria viva<br />del territorio
            </h3>
            <p className="mt-3 text-sm leading-6 text-white/70">
              Producción académica, cultural y comunitaria — saberes ancestrales, investigaciones
              propias y expresiones artísticas del Pacífico.
            </p>
            <Link
              href={withRole("/biblioteca?section=Memoria+viva+del+territorio", role)}
              className="mt-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              Explorar memoria viva
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 5. VENÍ TE CONTAMOS — eventos ── */}
      <section className="bg-[#2c3e2a] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-start justify-between gap-6">
            <div>
              <div className="mb-4">
                <span className="inline-flex items-center rounded-full border border-[#fbc02d]/35 bg-[#fbc02d]/15 px-4 py-2 text-sm font-bold uppercase tracking-[0.22em] text-[#fbc02d] sm:text-base">
                  Agenda y eventos
                </span>
              </div>
              <h2 className="font-display text-4xl leading-tight text-white sm:text-5xl">
                Vení, te contamos
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-6 text-white/65 sm:text-base sm:leading-7">
                Espacios académicos, normativos y culturales del Proceso de Comunidades Negras —
                conversatorios, formaciones y encuentros territoriales.
              </p>
            </div>
            <Link
              href={withRole("/agenda", role)}
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
                    href={withRole("/agenda", role)}
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
