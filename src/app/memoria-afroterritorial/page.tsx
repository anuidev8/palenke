import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import { SiteLayout } from "@/components/mock/ui";
import { MemoriaAfroterritorialSubnav } from "@/components/palenke/MemoriaAfroterritorialSubnav";
import { MemoriaAfroterritorialHeroVideo } from "@/components/palenke/MemoriaAfroterritorialHeroVideo";
import {
  getVisibleMediatecaUbuntuGalleryMedia,
} from "@/lib/mediateca-ubuntu-gallery-data";
import {
  MEMORIA_AFROTERRITORIAL_HERO_AUDIO_SRC,
  MEMORIA_AFROTERRITORIAL_HERO_VIDEO_DURATION,
  MEMORIA_AFROTERRITORIAL_HERO_VIDEO_FALLBACK_SRC,
  MEMORIA_AFROTERRITORIAL_HERO_VIDEO_SRC,
  MEMORIA_NUESTRA_MEMORIA_IMAGE_URL,
} from "@/lib/memoria-afroterritorial-assets";
import { getViewerRoleFromRequest } from "@/lib/viewer-server";
import { type SearchParams, withRole } from "@/lib/viewer";

export default async function MemoriaAfroterritorialPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const role = await getViewerRoleFromRequest(params);
  const mediatecaPreviewImages = getVisibleMediatecaUbuntuGalleryMedia(role)
    .filter((item) => item.kind === "image")
    .toSorted((a, b) => b.year - a.year)
    .slice(0, 4);

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
          <MemoriaAfroterritorialHeroVideo
            label="Video de presentación"
            duration={MEMORIA_AFROTERRITORIAL_HERO_VIDEO_DURATION}
            tag="Memoria Afroterritorial"
            videoSrc={MEMORIA_AFROTERRITORIAL_HERO_VIDEO_SRC}
            fallbackVideoSrc={MEMORIA_AFROTERRITORIAL_HERO_VIDEO_FALLBACK_SRC}
            audioSrc={MEMORIA_AFROTERRITORIAL_HERO_AUDIO_SRC}
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

      <MemoriaAfroterritorialSubnav role={role} />

      {/* ── Definición + Función (left) | Imagen (right) ── */}
      <section className="relative overflow-hidden border-b border-[#e8dfd3] bg-[#F7F5F0] px-4 py-14 sm:px-6 lg:px-8">
        {/* Dribbble-style Afro Abstract Background Graphics */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {/* Topographic organic afro-territorial lines - GREEN */}
          <svg className="absolute -top-[5%] -right-[5%] w-[800px] h-[800px] text-[#2e7d32]/[0.04] rotate-[15deg]" viewBox="0 0 400 400" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" xmlns="http://www.w3.org/2000/svg">
            <path d="M 50 200 Q 100 100 200 200 T 350 200" />
            <path d="M 50 230 Q 100 130 200 230 T 350 230" />
            <path d="M 50 260 Q 100 160 200 260 T 350 260" />
            <path d="M 50 290 Q 100 190 200 290 T 350 290" />
            <path d="M 50 320 Q 100 220 200 320 T 350 320" />
            <circle cx="200" cy="200" r="100" strokeWidth="4" strokeDasharray="10 10" />
            <circle cx="200" cy="200" r="150" strokeWidth="3" />
          </svg>

          {/* Abstract solid shapes representing earth and roots - RED */}
          <svg className="absolute -bottom-10 -left-10 w-[500px] h-[500px] text-[#d32f2f]/[0.05]" fill="currentColor" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 200 L 200 200 L 200 100 Q 150 50 100 100 T 0 100 Z" />
            <circle cx="50" cy="150" r="20" fill="#F7F5F0" />
            <circle cx="150" cy="150" r="10" fill="#F7F5F0" />
          </svg>

          {/* Warm energetic glows (YELLOW & RED) */}
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-t from-[#fbc02d]/[0.08] to-transparent blur-[120px]" />
          <div className="absolute top-10 left-10 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-[#d32f2f]/[0.06] to-transparent blur-[100px]" />
          
          {/* Very faint tribal pattern mask */}
          <div className="absolute inset-0 opacity-[0.02] mix-blend-multiply" style={{ backgroundImage: "radial-gradient(#1a1a1a 2px, transparent 2px)", backgroundSize: "32px 32px" }} />
        </div>
        
        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-14">

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
                { text: "Cuidar como tesoro colectivo el conocimiento jurídico y político del Pueblo Negro.", color: "bg-[#2e7d32]" },
                { text: "Elevar las voces y saberes de nuestras comunidades, celebrando nuestra producción cultural.", color: "bg-[#fbc02d]" },
                { text: "Tejer lazos de identidad y pensamiento propio que conecten a las nuevas generaciones.", color: "bg-[#d32f2f]" },
                { text: "Ser faro e inspiración para la formación política y la defensa incansable de nuestros derechos.", color: "bg-[#2e7d32]" },
              ].map((item) => (
                <li key={item.text} className="flex items-start gap-3 text-sm leading-6 text-[#4a4540]">
                  <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${item.color}`} />
                  {item.text}
                </li>
              ))}
            </ul>
          </div>

          {/* Right — Imagen representativa (enlace a Biblioteca · Memoria viva) */}
          <Link
            href={withRole("/biblioteca", role, { section: "Memoria viva del territorio" })}
            className="group relative block min-h-[320px] overflow-hidden rounded-[28px] outline-none ring-offset-2 ring-offset-[#F7F5F0] transition hover:opacity-[0.98] focus-visible:ring-2 focus-visible:ring-[#2e7d32] lg:min-h-[400px]"
          >
            <Image
              src={MEMORIA_NUESTRA_MEMORIA_IMAGE_URL}
              alt=""
              fill
              className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              sizes="(max-width: 1024px) 100vw, 50vw"
              quality={85}
            />
            <div
              className="absolute inset-0 z-[1]"
              aria-hidden="true"
              style={{
                background:
                  "radial-gradient(ellipse at 20% 80%, rgba(46,125,50,0.45), transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(251,192,45,0.28), transparent 60%), radial-gradient(ellipse at 90% 90%, rgba(211,47,47,0.35), transparent 60%), linear-gradient(150deg, rgba(31,29,27,0.55) 0%, rgba(41,36,32,0.65) 60%, rgba(23,21,19,0.75) 100%)",
              }}
            />
            <svg
              className="absolute inset-0 z-[2] h-full w-full opacity-30"
              viewBox="0 0 600 400"
              preserveAspectRatio="xMidYMid slice"
              aria-hidden="true"
            >
              {/* Decorative Brand Color Circles */}
              <circle cx="180" cy="250" r="80" fill="#2e7d32" opacity="0.2" filter="blur(20px)" />
              <circle cx="420" cy="120" r="100" fill="#fbc02d" opacity="0.15" filter="blur(25px)" />
              <circle cx="480" cy="300" r="60" fill="#d32f2f" opacity="0.2" filter="blur(15px)" />
              
              {/* Connection paths */}
              <path
                d="M50,400 Q150,240 200,180 Q280,100 350,120 Q420,140 500,70"
                stroke="white" strokeWidth="2" fill="none" opacity="0.5" strokeDasharray="4 8"
              />
              <path
                d="M0,290 Q100,260 180,240 Q260,215 320,245 Q400,275 600,235"
                stroke="white" strokeWidth="1.5" fill="none" opacity="0.4"
              />
              
              {/* Nodes representing communities */}
              <circle cx="200" cy="180" r="4" fill="#2e7d32" stroke="white" strokeWidth="2" />
              <circle cx="350" cy="120" r="5" fill="#fbc02d" stroke="white" strokeWidth="2" />
              <circle cx="320" cy="245" r="4" fill="#d32f2f" stroke="white" strokeWidth="2" />
              <circle cx="500" cy="70" r="3" fill="#ffffff" opacity="0.8" />
            </svg>
            <div className="absolute bottom-6 left-6 right-6 z-[3]">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                Memoria viva del territorio
              </p>
              <p className="mt-1 font-display text-xl text-white">
                Conocimiento histórico, jurídico, cultural y ancestral
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* ── Normativa vigente ── */}
      <section className="bg-[#f8f5f2] px-4 py-14 sm:px-6 lg:px-8 border-b border-[#e8dfd3]">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-14">

          {/* Left — Normativa vigente card (Gradient Border) */}
          <div className="relative rounded-[28px] p-[2px] bg-gradient-to-br from-[#2e7d32] via-[#fbc02d] to-[#d32f2f] shadow-sm">
            <div className="flex h-full flex-col gap-6 rounded-[26px] bg-white p-8">
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
              href={withRole("/biblioteca", role, { section: "Normativa vigente" })}
              className="mt-auto inline-flex w-fit items-center gap-2 rounded-full bg-[#2e7d32] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#1b5e20]"
            >
              Explorar normativa vigente
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            </div>
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

     

      {/* ── Mediateca Ubuntu ── */}
      <section className="relative overflow-hidden border-t border-[#e8dfd3] bg-[#FAFAF7] px-4 py-14 sm:px-6 lg:px-8">
        <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
          {/* Rhythmic flowing ribbons with PCN Brand Colors */}
          <svg className="absolute top-1/2 left-0 w-full h-[600px] -translate-y-1/2 opacity-[0.035]" preserveAspectRatio="none" viewBox="0 0 1000 200" fill="none" strokeWidth="6" strokeLinecap="round" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,100 C150,200 350,0 500,100 C650,200 850,0 1000,100" stroke="#fbc02d" />
            <path d="M0,120 C150,220 350,20 500,120 C650,220 850,20 1000,120" stroke="#d32f2f" />
            <path d="M0,140 C150,240 350,40 500,140 C650,240 850,40 1000,140" stroke="#2e7d32" />
          </svg>
          
          {/* Soft multi-color glows */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-[#fbc02d]/[0.05] to-transparent blur-[140px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#d32f2f]/[0.03] to-transparent blur-[120px]" />
          
          {/* Extremely delicate dots matrix (less visible) */}
          <div className="absolute inset-0 opacity-[0.015] mix-blend-multiply" style={{ backgroundImage: "radial-gradient(#1a1a1a 1.5px, transparent 1.5px)", backgroundSize: "64px 64px" }} />
        </div>
        <div className="relative z-10 mx-auto grid max-w-7xl items-start gap-10 lg:grid-cols-2 lg:gap-14">

          {/* Left — Definición */}
          <div>
            <p className="eyebrow mb-3 text-[#2e7d32]">Memoria Afroterritorial</p>
            <h2 className="font-display text-3xl text-[#1a1a1a] sm:text-4xl">Mediateca Ubuntu</h2>
            <p className="mt-5 text-base leading-8 text-[#4a4540]">
              Archivo audiovisual comunitario con fotografías, videos, audios y entrevistas de nuestros
              procesos territoriales y encuentros del Palenke.
            </p>
          </div>

          {/* Right — Mediateca Ubuntu CTA card */}
          <Link
            href={withRole("/memoria-afroterritorial/mediateca-ubuntu", role)}
            className="group relative flex min-h-[320px] flex-col justify-end overflow-hidden rounded-[28px] p-8 outline-none ring-offset-2 ring-offset-[#FAFAF7] transition hover:opacity-[0.98] focus-visible:ring-2 focus-visible:ring-[#2e7d32] lg:min-h-[400px]"
          >
            {mediatecaPreviewImages.length > 0 ? (
              <div className="absolute inset-0 grid grid-cols-2 grid-rows-2" aria-hidden="true">
                {mediatecaPreviewImages.map((item) => (
                  <div key={item.id} className="relative overflow-hidden">
                    <Image
                      src={item.posterUrl}
                      alt=""
                      fill
                      sizes="(max-width: 1024px) 50vw, 400px"
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse at 80% 80%, rgba(211,47,47,0.35), transparent 60%), radial-gradient(ellipse at 20% 20%, rgba(251,192,45,0.25), transparent 60%), radial-gradient(ellipse at 25% 75%, rgba(46,125,50,0.4), transparent 60%), linear-gradient(150deg, #1c1a19 0%, #26211e 60%, #1a1614 100%)",
                }}
                aria-hidden="true"
              />
            )}
            <div
              className="absolute inset-0 bg-gradient-to-t from-[#1a1614]/95 via-[#1a1614]/55 to-[#1a1614]/25"
              aria-hidden="true"
            />
            <svg
              className="absolute inset-0 h-full w-full opacity-[0.12]"
              viewBox="0 0 400 300"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path d="M-50,150 Q100,250 200,100 T450,150" fill="none" stroke="#fbc02d" strokeWidth="4" />
              <path d="M-50,200 Q150,300 250,150 T450,200" fill="none" stroke="#d32f2f" strokeWidth="3" />
            </svg>
            <div className="relative z-10">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                Archivo audiovisual comunitario
              </p>
              <h3 className="mt-2 font-display text-2xl leading-tight text-white sm:text-3xl">
                Fotos, videos<br />y entrevistas
              </h3>
              <p className="mt-3 max-w-sm text-sm leading-6 text-white/75">
                Fotografías, videos y registros generales del Palenke — la misma galería que en
                Gobierno Propio.
              </p>
              <span className="mt-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white">
                Explorar Mediateca Ubuntu
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </div>
          </Link>
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
