import { SiteLayout } from "@/components/mock/ui";
import { InstrumentDashboardGrid } from "@/components/palenke/InstrumentDashboardGrid";
import { GovernmentFunctionsList } from "@/components/palenke/GovernmentFunctionsList";
import { OrientationNetworkSection } from "@/components/palenke/OrientationNetworkSection";
import GobiernoPropioGallerySection from "@/components/palenke/GobiernoPropioGallerySection";
import { GobiernoPropioHeroVideo } from "@/components/palenke/GobiernoPropioHeroVideo";
import { getVisibleGobiernoGalleryMedia } from "@/lib/gobierno-gallery-data";
import {
  GOBIERNO_PROPIO_HERO_VIDEO_DURATION,
  GOBIERNO_PROPIO_HERO_VIDEO_SRC,
} from "@/lib/gobierno-propio-assets";
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
  {
    id: "seguridad-juridica",
    title: "Seguridad jurídica de la tierra",
    bullets: [
      "Fortalecimiento organizativo, género, protección y saneamiento",
      "Titulación y ampliación de territorios colectivos",
    ],
    color: "#2e7d32", // Forest Green (Security/Land)
    lightBg: "#d8f3dc",
    href: "/gobierno-propio/seguridad-juridica",
    imageUrl: "/assets/placeholders/seguridad-juridica.png",
    fallbackImageUrl: "/assets/placeholders/seguridad-juridica.svg",
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

      {/* ── Galería audiovisual de Gobierno Propio ── */}
      <section className="border-t border-[#e8dfd3] bg-[#f7f3ed] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <GobiernoPropioGallerySection items={galleryMedia} />
        </div>
      </section>

      <OrientationNetworkSection />
    </SiteLayout>
  );
}
