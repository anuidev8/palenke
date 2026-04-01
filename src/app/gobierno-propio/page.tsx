import Image from "next/image";
import { SiteLayout } from "@/components/mock/ui";
import { InstrumentDashboardGrid } from "@/components/palenke/InstrumentDashboardGrid";
import { GovernmentFunctionsList } from "@/components/palenke/GovernmentFunctionsList";
import { BookPreviewLightbox } from "@/components/palenke/BookPreviewLightbox";
import { getViewerRoleFromRequest } from "@/lib/viewer-server";
import { type SearchParams } from "@/lib/viewer";

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

const EN_ALIANZA = [
  { name: "RRI", src: "/brands/RRI.png" },
  { name: "TTF", src: "/brands/TTF.png" },
  { name: "ILC", src: "/brands/ILC.png" },
];

export default async function GobiernoPropioPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const role = await getViewerRoleFromRequest(params);

  return (
    <SiteLayout
      role={role}
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "Gobierno Propio" },
      ]}
    >
      {/* ── Dashboard Top Section (Row 1) ── */}
      <section className="relative overflow-hidden bg-[#EAE6DD] px-4 py-16 sm:px-6 lg:px-8 border-b border-[#e8dfd3]">
        {/* Dribbble-style Afro Abstract Background Graphics */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {/* Large dynamic circle & arch representing community and leadership */}
          <svg className="absolute -top-40 -left-20 w-[800px] h-[800px] text-[#2e7d32]/[0.03]" fill="currentColor" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path d="M 0 100 A 100 100 0 0 1 200 100" />
            <circle cx="100" cy="100" r="40" fill="#EAE6DD" />
            <circle cx="100" cy="100" r="15" />
            <path d="M 10 100 L 190 100" stroke="#EAE6DD" strokeWidth="4" />
          </svg>

          {/* Stepped ancestral patterns */}
          <svg className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] text-[#d32f2f]/[0.025]" fill="none" stroke="currentColor" strokeWidth="6" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <polyline points="0,200 40,200 40,160 80,160 80,120 120,120 120,80 160,80 160,40 200,40" />
            <polyline points="0,160 40,160 40,120 80,120 80,80 120,80 120,40 160,40 160,0" />
          </svg>

          {/* Deep green rich blur overlay for PCN aesthetic */}
          <div className="absolute top-[20%] right-[30%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#2e7d32]/[0.05] to-transparent blur-[140px]" />
          <div className="absolute bottom-0 left-[20%] w-[400px] h-[400px] rounded-full bg-gradient-to-t from-[#fbc02d]/[0.05] to-transparent blur-[100px]" />
        </div>
        
        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start justify-between">
            {/* Left Column: Title & Intro */}
            <div className="flex-1 max-w-2xl space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#e8dfd3] shadow-sm">
                <div className="h-2 w-2 rounded-full bg-[#2e7d32]" />
                <span className="text-sm font-semibold tracking-wide text-[#2e7d32] uppercase">
                  Módulo Palenke
                </span>
              </div>
              
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#1a1a1a] tracking-tight leading-[1.1]">
                Gobierno propio
              </h1>
              
              <p className="text-xl sm:text-2xl leading-relaxed text-[#1a1a1a] font-display font-medium">
                El <span className="text-[#2e7d32]">Gobierno Propio</span> es el conjunto de normas, decisiones y prácticas mediante las cuales los Consejos Comunitarios ejercen autoridad sobre sus territorios colectivos.
              </p>
              
              <p className="text-lg text-[#4a4540] leading-relaxed">
                Este espacio del Palenke organiza los instrumentos que materializan la autonomía territorial afrodescendiente.
              </p>
            </div>
            
            {/* Right Column: Key Highlights / Impact */}
            <div className="w-full lg:w-[460px] shrink-0">
              <div className="bg-white rounded-[32px] p-8 sm:p-10 border border-[#e8dfd3] shadow-sm relative overflow-hidden">
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#d8f3dc]/20 blur-3xl pointer-events-none" />
                <div className="relative z-10">
                  <p className="eyebrow text-[#2e7d32] mb-6 tracking-widest text-sm">
                    NUESTRO IMPACTO
                  </p>
                  <h3 className="font-display text-2xl text-[#1a1a1a] mb-6 leading-snug">
                    El poder de nuestro gobierno
                  </h3>
                  <GovernmentFunctionsList />
                </div>
              </div>
            </div>
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

      {/* ── Aliados ── */}
      <section className="border-t border-[#e8dfd3] bg-[#FDFBF7] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7a6f63]">
              Red de orientación y apoyo
            </p>
            <h2 className="mt-3 font-display text-3xl text-[#1a1a1a] sm:text-4xl">
              Construcción colectiva del Gobierno Propio
            </h2>
            <p className="mt-3 text-base leading-relaxed text-[#4a4540]">
              Visibilizamos la organización orientadora y las alianzas que fortalecen este proceso comunitario.
            </p>
          </div>

          <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
            {/* Card 1: Orientado por */}
            <article className="flex flex-col overflow-hidden rounded-2xl border border-[#c8e6c9] bg-[#E8F5E9] p-8 sm:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-shadow hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#2E7D32]">
                Orientado por
              </h3>
              <p className="mt-2 text-sm font-medium text-[#3f5343]">
                Proceso de Comunidades Negras (PCN)
              </p>

              <div className="mt-6 flex flex-1 flex-col items-center">
                <div className="w-full max-w-[320px] rounded-xl border border-[#d6e6d6] bg-white p-3 shadow-sm">
                  <div className="relative aspect-[9/4] overflow-hidden rounded-lg border border-[#efefef] bg-[#f8f5f0]">
                    <Image
                      src="/assets/logo.svg"
                      alt="Logo de Proceso de Comunidades Negras (PCN)"
                      fill
                      sizes="(max-width: 640px) 280px, 320px"
                      className="object-contain"
                    />
                  </div>
                </div>

                <div className="mt-6 flex w-full max-w-md flex-col">
                  <h4 className="text-xl font-semibold leading-tight text-[#1a1a1a]">Proceso de Comunidades Negras (PCN)</h4>
                  <div className="mt-5 h-px w-full bg-gradient-to-r from-[#2e7d32]/40 to-transparent" />
                  <div className="mt-4">
                    <BookPreviewLightbox
                      src="/assets/logo.svg"
                      alt="Logo de Proceso de Comunidades Negras (PCN)"
                    />
                  </div>
                </div>
              </div>
            </article>

            {/* Card 2: En alianza con */}
            <article className="flex flex-col overflow-hidden rounded-2xl border border-[#e0e0e0] bg-white p-8 sm:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-shadow hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
              <h3 className="text-center text-sm font-bold uppercase tracking-[0.2em] text-[#1565C0]">
                En alianza con
              </h3>
              <p className="mt-2 text-center text-sm text-[#4a4540]">
                Organizaciones aliadas que acompañan el fortalecimiento del proceso territorial.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                {EN_ALIANZA.map((brand) => (
                  <div
                    key={brand.name}
                    className="group flex h-24 w-36 items-center justify-center rounded-xl border border-[#ececec] bg-[#fcfcfc] px-4 py-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#d8d8d8] hover:bg-white"
                  >
                    <Image
                      src={brand.src}
                      alt={`Logo de ${brand.name}`}
                      width={120}
                      height={70}
                      className="max-h-full w-auto object-contain opacity-90 transition-all duration-300 group-hover:opacity-100"
                    />
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
