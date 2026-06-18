import { SiteLayout } from "@/components/mock/ui";
import { InstrumentDashboardGrid } from "@/components/palenke/InstrumentDashboardGrid";
import { GovernmentFunctionsList } from "@/components/palenke/GovernmentFunctionsList";
import { OrientationNetworkSection } from "@/components/palenke/OrientationNetworkSection";
import GobiernoPropioGallerySection from "@/components/palenke/GobiernoPropioGallerySection";
import { GobiernoPropioHeroVideo } from "@/components/palenke/GobiernoPropioHeroVideo";
import { getVisibleGobiernoGalleryMedia } from "@/lib/gobierno-gallery-data";
import {
  GOBIERNO_PROPIO_HERO_AUDIO_SRC,
  GOBIERNO_PROPIO_HERO_VIDEO_DURATION,
  GOBIERNO_PROPIO_HERO_VIDEO_SRC,
} from "@/lib/gobierno-propio-assets";
import Link from "next/link";
import { getViewerRoleFromRequest } from "@/lib/viewer-server";
import { type SearchParams, withRole } from "@/lib/viewer";

const instruments = [
  {
    id: "reglamentos",
    title: "Reglamentos internos",
    bullets: [
      "Organización normativa de la vida comunitaria",
      "Reglas de uso del territorio y convivencia",
    ],
    color: "#e65100", // Dark Orange (Action/Norms)
    lightBg: "#fff3e0",
    href: "/gobierno-propio/reglamentos",
    imageUrl: "/assets/placeholders/reglamentos.png",
    fallbackImageUrl: "/assets/placeholders/reglamentos.svg",
  },
  {
    id: "planes-uso",
    title: "Planes de uso y manejo",
    bullets: [
      "Ordenamiento del territorio desde la visión comunitaria",
      "Definición de usos productivos, culturales y de conservación",
    ],
    color: "#1565c0", // Deep Blue (Rivers/Management)
    lightBg: "#e3f2fd",
    href: "/gobierno-propio/planes-uso",
    imageUrl: "/assets/placeholders/planes-uso.png",
    fallbackImageUrl: "/assets/placeholders/planes-uso.svg",
  },
  {
    id: "etnodesarrollo",
    title: "Planes de etnodesarrollo",
    bullets: [
      "Planeación estratégica desde identidad y autonomía",
      "Proyección económica, social y cultural del territorio",
    ],
    color: "#f57f17", // Yellow/Gold (Growth/Culture)
    lightBg: "#fff3cd",
    href: "/gobierno-propio/etnodesarrollo",
    imageUrl: "/assets/placeholders/etnodesarrollo.png",
    fallbackImageUrl: "/assets/placeholders/etnodesarrollo.svg",
  },
  {
    id: "conservacion",
    title: "Áreas bioculturales de conservación comunitaria",
    bullets: [
      "Declaratoria y gestión de zonas conservadas",
      "Integración de biodiversidad, cultura y espiritualidad",
    ],
    color: "#2e7d32", // Forest Green (Nature/Conservation)
    lightBg: "#d8f3dc",
    href: "/gobierno-propio/conservacion",
    imageUrl: "/assets/placeholders/conservacion.png",
    fallbackImageUrl: "/assets/placeholders/conservacion.svg",
  },
  {
    id: "proteccion-hidrica",
    title: "Protección hídrica",
    bullets: [
      "Defensa de ecosistemas marinos y de agua dulce",
      "Gestión comunitaria del agua como parte del territorio",
    ],
    color: "#00838f", // Cyan/Teal (Water/Ocean)
    lightBg: "#e0f7fa",
    href: "/gobierno-propio/proteccion-hidrica",
    imageUrl: "/assets/placeholders/proteccion-hidrica.png",
    fallbackImageUrl: "/assets/placeholders/proteccion-hidrica.svg",
  },
];

export default async function GobiernoPropioPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const role = await getViewerRoleFromRequest(params);
  const galleryMedia = getVisibleGobiernoGalleryMedia(role).toSorted((a, b) => b.year - a.year);

  return (
    <SiteLayout
      role={role}
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "Gobierno Propio" },
      ]}
    >
      {/* ── 1) GOBIERNO PROPIO + VIDEO DE PRESENTACIÓN (mismo layout que Memoria) ── */}
      <section className="bg-[#1a1a1a]">
        <div className="relative">
          <GobiernoPropioHeroVideo
            label="Video de presentación"
            duration={GOBIERNO_PROPIO_HERO_VIDEO_DURATION}
            tag="Gobierno Propio"
            videoSrc={GOBIERNO_PROPIO_HERO_VIDEO_SRC}
            audioSrc={GOBIERNO_PROPIO_HERO_AUDIO_SRC}
            style={{ minHeight: 480 }}
          />
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-6 pb-8 pt-20 lg:px-10">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.22em] text-white/60">
              1. GOBIERNO PROPIO
            </p>
            <h1 className="font-display text-3xl text-white sm:text-4xl lg:text-5xl">
              Gobierno propio
            </h1>
          </div>
        </div>
      </section>

      {/* ── Definición + impacto (left) | tarjeta funciones (right) ── */}
      <section className="relative overflow-hidden border-b border-[#e8dfd3] bg-[#EAE6DD] px-4 py-14 sm:px-6 lg:px-8">
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <svg className="absolute -top-40 -left-20 w-[800px] h-[800px] text-[#2e7d32]/[0.03]" fill="currentColor" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path d="M 0 100 A 100 100 0 0 1 200 100" />
            <circle cx="100" cy="100" r="40" fill="#EAE6DD" />
            <circle cx="100" cy="100" r="15" />
            <path d="M 10 100 L 190 100" stroke="#EAE6DD" strokeWidth="4" />
          </svg>
          <svg className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] text-[#d32f2f]/[0.025]" fill="none" stroke="currentColor" strokeWidth="6" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <polyline points="0,200 40,200 40,160 80,160 80,120 120,120 120,80 160,80 160,40 200,40" />
            <polyline points="0,160 40,160 40,120 80,120 80,80 120,80 120,40 160,40 160,0" />
          </svg>
          <div className="absolute top-[20%] right-[30%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#2e7d32]/[0.05] to-transparent blur-[140px]" />
          <div className="absolute bottom-0 left-[20%] w-[400px] h-[400px] rounded-full bg-gradient-to-t from-[#fbc02d]/[0.05] to-transparent blur-[100px]" />
        </div>

        <div className="relative z-10 mx-auto grid max-w-7xl items-start gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e8dfd3] bg-white px-4 py-1.5 shadow-sm">
              <div className="h-2 w-2 rounded-full bg-[#2e7d32]" />
              <span className="text-sm font-semibold uppercase tracking-wide text-[#2e7d32]">
                Módulo Palenke
              </span>
            </div>
            <h2 className="font-display text-3xl text-[#1a1a1a] sm:text-4xl">
              Autonomía territorial comunitaria
            </h2>
            <p className="text-base leading-8 text-[#4a4540] sm:text-lg">
              El <span className="font-semibold text-[#2e7d32]">Gobierno Propio</span> es el
              conjunto de normas, decisiones y prácticas mediante las cuales los Consejos
              Comunitarios ejercen autoridad sobre sus territorios colectivos.
            </p>
            <p className="text-base leading-8 text-[#4a4540]">
              Este espacio del Palenke organiza los instrumentos que materializan la autonomía
              territorial afrodescendiente.
            </p>
          </div>

          <div className="rounded-[32px] border border-[#e8dfd3] bg-white p-8 shadow-sm sm:p-10">
            <p className="eyebrow mb-6 text-sm tracking-widest text-[#2e7d32]">NUESTRO IMPACTO</p>
            <h3 className="mb-6 font-display text-2xl leading-snug text-[#1a1a1a]">
              El poder de nuestro gobierno
            </h3>
            <GovernmentFunctionsList />
          </div>
        </div>
      </section>

      {/* ── Dashboard Grid Section (Row 2) ── */}
      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center sm:text-left">
            <h2 className="font-display text-3xl sm:text-4xl text-[#1a1a1a]">
              Instrumentos de gobierno propio
            </h2>
            <p className="mt-4 text-[#4a4540] text-lg max-w-3xl">
              Explora las herramientas que construimos para garantizar la vida, la cultura y la defensa de nuestra autonomía territorial.
            </p>
          </div>
          
          <InstrumentDashboardGrid instruments={instruments} role={role} />
        </div>
      </section>

      {/* ── 4) CTA SEGURIDAD JURÍDICA DE LA TIERRA ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1b431c] via-[#245226] to-[#0f2a10] py-20 px-4 sm:px-6 lg:px-8 text-white border-y border-[#123013]">
        {/* Glowing gradients & Organic lines */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#3c853e]/20 to-transparent blur-[120px]" />
          <div className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[400px] rounded-full bg-gradient-to-t from-[#2e7d32]/30 to-transparent blur-[100px]" />
          
          {/* Topographic Lines Overlay */}
          <svg 
            className="absolute right-[5%] bottom-[5%] w-[450px] h-[450px] opacity-[0.06] rotate-12 text-[#8ce08e]" 
            viewBox="0 0 100 100" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5"
          >
            <path d="M 0 50 Q 25 30 50 50 T 100 50" />
            <path d="M 0 60 Q 25 40 50 60 T 100 60" />
            <path d="M 0 70 Q 25 50 50 70 T 100 70" />
            <circle cx="50" cy="50" r="20" strokeDasharray="3 3" />
          </svg>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 backdrop-blur-md">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8ce08e] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#8ce08e]"></span>
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-[#8ce08e]">
                  Módulo Especial Destacado
                </span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight">
                Seguridad jurídica <br />de la tierra y el territorio
              </h2>
              <p className="text-lg text-white/80 leading-relaxed max-w-2xl">
                La protección jurídica de los territorios colectivos es el pilar del gobierno propio, la autonomía comunitaria y la defensa integral del espacio de vida, memoria y cultura del Pueblo Negro.
              </p>
              <p className="text-base text-white/70 max-w-xl">
                Accede a documentos especializados sobre linderos ancestrales, titulación colectiva, equidad de género en gobernanza, y fortalecimiento organizativo con control de acceso soberano de datos.
              </p>
              
              <div className="pt-4">
                <Link
                  href={withRole("/gobierno-propio/seguridad-juridica", role)}
                  className="group inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-base font-bold text-[#1b431c] shadow-lg transition-all duration-300 hover:bg-[#ebf5ec] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#1b431c]/20"
                >
                  <span>Ingresar al módulo de Seguridad Jurídica</span>
                  <svg 
                    className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor" 
                    strokeWidth="2.5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Right Panel / Preview Feature Cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/20">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#8ce08e]/20 text-[#8ce08e]">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="mb-2 font-display text-lg font-semibold text-white">Fortalecimiento</h3>
                <p className="text-sm text-white/70 leading-relaxed">Capacitación organizativa y política en gobernanza autónoma territorial.</p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/20">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#8ce08e]/20 text-[#8ce08e]">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="mb-2 font-display text-lg font-semibold text-white">Género e Inclusión</h3>
                <p className="text-sm text-white/70 leading-relaxed">Participación activa de mujeres y jóvenes en decisiones de tierras.</p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/20">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#8ce08e]/20 text-[#8ce08e]">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="mb-2 font-display text-lg font-semibold text-white">Protección y Saneamiento</h3>
                <p className="text-sm text-white/70 leading-relaxed">Defensa de linderos ancestrales y saneamiento físico-jurídico.</p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/20">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#8ce08e]/20 text-[#8ce08e]">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="mb-2 font-display text-lg font-semibold text-white">Titulación y Ampliación</h3>
                <p className="text-sm text-white/70 leading-relaxed">Titulación colectiva del territorio y ampliación de límites ancestrales.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5) CTA GÉNERO, GENERACIÓN Y FAMILIA ── */}
      <section className="relative overflow-hidden border-y border-[#e8dfd3] bg-gradient-to-br from-[#faf7f3] via-[#f8f5f2] to-[#f5f2ed] py-20 px-4 sm:px-6 lg:px-8 text-[#1a1a1a]">
        {/* Warm organic shapes — inspired by memoria-afroterritorial */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {/* Subtle warm glows */}
          <div className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-[#fbc02d]/[0.08] to-transparent blur-[120px]" />
          <div className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[400px] rounded-full bg-gradient-to-tr from-[#d32f2f]/[0.05] to-transparent blur-[100px]" />

          {/* Organic topographic lines */}
          <svg
            className="absolute right-[5%] top-[10%] w-[450px] h-[450px] opacity-[0.06] rotate-12 text-[#2e7d32]"
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M 20 50 Q 40 20 60 50 T 100 50" />
            <path d="M 20 60 Q 40 30 60 60 T 100 60" />
            <path d="M 20 70 Q 40 40 60 70 T 100 70" />
            <circle cx="50" cy="50" r="25" strokeDasharray="3 3" />
          </svg>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#e8dfd3] bg-white px-4 py-1.5 shadow-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d32f2f] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#d32f2f]"></span>
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-[#d32f2f]">
                  Módulo Palenke
                </span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight text-[#1a1a1a]">
                Género, Generación <br />y Familia
              </h2>
              <p className="text-lg text-[#4a4540] leading-relaxed max-w-2xl">
                El módulo de Género, Generación y Familia es un espacio del Palenke de Pensamiento orientado a reconocer y fortalecer las relaciones de cuidado, participación, respeto y dignidad que sostienen la vida comunitaria, organizativa y territorial del Pueblo Negro.
              </p>
              <p className="text-base text-[#666556] max-w-xl">
                Visibiliza el papel de las mujeres, las juventudes, las personas mayores, las familias y los liderazgos comunitarios en los procesos de gobierno propio, memoria, protección del territorio y construcción colectiva.
              </p>

              <div className="pt-4">
                <Link
                  href={withRole("/gobierno-propio/genero-familia", role)}
                  className="group inline-flex items-center gap-3 rounded-full bg-[#2e7d32] px-8 py-4 text-base font-bold text-white shadow-lg transition-all duration-300 hover:bg-[#1b5e20] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#2e7d32]/30"
                >
                  <span>Ingresar al módulo de Género, Generación y Familia</span>
                  <svg
                    className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Right Panel / Preview Feature Cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-3xl border border-[#e8dfd3] bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#d8d0c5]">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#2e7d32]/10 text-[#2e7d32]">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="mb-2 font-display text-lg font-semibold text-[#1a1a1a]">Relaciones de Cuidado</h3>
                <p className="text-sm text-[#666556] leading-relaxed">Participación y dignidad en la vida comunitaria y territorial.</p>
              </div>

              <div className="rounded-3xl border border-[#e8dfd3] bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#d8d0c5]">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#d32f2f]/10 text-[#d32f2f]">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="mb-2 font-display text-lg font-semibold text-[#1a1a1a]">Visibilización</h3>
                <p className="text-sm text-[#666556] leading-relaxed">Rol de mujeres, jóvenes y liderazgos comunitarios.</p>
              </div>

              <div className="rounded-3xl border border-[#e8dfd3] bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#d8d0c5]">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#fbc02d]/10 text-[#fbc02d]">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="mb-2 font-display text-lg font-semibold text-[#1a1a1a]">Territorio y Memoria</h3>
                <p className="text-sm text-[#666556] leading-relaxed">Protección comunitaria y construcción colectiva.</p>
              </div>

              <div className="rounded-3xl border border-[#e8dfd3] bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#d8d0c5]">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#2e7d32]/10 text-[#2e7d32]">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m7 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="mb-2 font-display text-lg font-semibold text-[#1a1a1a]">Espacios Inclusivos</h3>
                <p className="text-sm text-[#666556] leading-relaxed">Construcción libre de discriminación y corresponsabilidad.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Galería audiovisual de Gobierno Propio ── */}
     {/*  <section className="border-t border-[#e8dfd3] bg-[#f7f3ed] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <GobiernoPropioGallerySection items={galleryMedia} />
        </div>
      </section> */}

      <OrientationNetworkSection />
    </SiteLayout>
  );
}
