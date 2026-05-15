"use client";

import {
  Globe,
  MapPin,
  ShieldAlert,
  Trees,
  Users,
  type LucideIcon,
} from "lucide-react";
import { motion, useTransform, type MotionValue } from "framer-motion";

/** Fondo territorial compartido: lo aplica el padre (p. ej. ScitaPageContent, ScitaDashboardHero). */
export const SCITA_TERRITORIAL_SURFACE_CLASS =
  "border-b border-emerald-950/50 bg-gradient-to-b from-[#070f0c] via-[#0c1a12] to-[#0a1610]";

/** Runway bajo el bloque fijo (scroll) — mismo tono que el degradado inferior del hero. */
export const SCITA_RUNWAY_SCROLL_CLASS =
  "bg-gradient-to-b from-[#0a1610] via-[#0c1a12] to-[#080f0d]";

/** Bullets para “¿Qué hace el SCITA?” — compartidas entre modo sección y capa pegajosa */
export function getScitaMarketingBullets() {
  return [
    "Generar información territorial propia para la toma de decisiones.",
    "Monitorear ecosistemas, cobertura boscosa y dinámicas territoriales.",
    "Identificar amenazas ambientales y territoriales desde el campo.",
    "Fortalecer el control comunitario del territorio con soberanía de información.",
    "Articular información para incidencia política a nivel nacional e internacional.",
  ];
}

type ScitaPillar = {
  copy: string;
  icon: LucideIcon;
};

function getScitaMarketingPillars(): ScitaPillar[] {
  return [
    { copy: "Generar información territorial propia para la toma de decisiones.", icon: MapPin },
    { copy: "Monitorear ecosistemas, cobertura boscosa y dinámicas territoriales.", icon: Trees },
    { copy: "Identificar amenazas ambientales y territoriales desde el campo.", icon: ShieldAlert },
    { copy: "Fortalecer el control comunitario del territorio con soberanía de información.", icon: Users },
    { copy: "Articular información para incidencia política a nivel nacional e internacional.", icon: Globe },
  ];
}

/** Vídeo de portada del hero SCITA (Cloudinary). */
export const SCITA_HERO_VIDEO_SRC =
  "https://res.cloudinary.com/dnmjmjdsj/video/upload/v1778803146/image/Generated_Video_May_14_2026_-_6_57PM_xz8vo5.mp4";

/** Imagen de portada compartida con el panel SCITA (tablero). */
export const SCITA_MARKETING_BANNER_SRC =
  "/assets/scita/ChatGPT Image May 14, 2026 at 04_23_53 PM.png";

/** Fondo decorativo (sin pointer-events). */
export function ScitaMarketingBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <div className="absolute -left-[25%] -top-[30%] h-[min(90vw,720px)] w-[min(90vw,720px)] rounded-full bg-[#1b5e20]/35 blur-[100px]" />
      <div className="absolute -right-[20%] top-[10%] h-[min(85vw,640px)] w-[min(85vw,640px)] rounded-full bg-[#2e7d32]/25 blur-[110px]" />
      <div className="absolute bottom-[-20%] left-[30%] h-[500px] w-[500px] rounded-full bg-emerald-500/15 blur-[130px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(74,222,128,0.08),transparent_55%)]" />
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      <svg className="absolute -left-24 top-1/4 h-[420px] w-[420px] rotate-[-8deg] text-[#4ade80]/[0.14]" viewBox="0 0 400 400" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round">
        <path d="M 40 200 Q 120 80 200 200 T 360 200" />
        <path d="M 40 240 Q 120 120 200 240 T 360 240" />
        <path d="M 40 280 Q 120 160 200 280 T 360 280" />
        <circle cx="200" cy="200" r="120" strokeWidth="3" strokeDasharray="14 18" opacity="0.8" />
        <circle cx="200" cy="200" r="180" strokeWidth="2" opacity="0.6" />
      </svg>

      <svg className="absolute -right-16 bottom-0 h-[380px] w-[380px] text-[#86efac]/[0.12]" viewBox="0 0 300 300" fill="currentColor">
        <path opacity="0.5" d="M280 20 L260 120 L180 80 L140 160 L60 100 L20 200 L100 280 L220 260 L280 20Z" />
        <path opacity="0.35" d="M240 200 L200 240 L160 200 L200 140 Z" />
      </svg>

      <svg className="absolute left-[8%] top-[12%] h-32 w-32 text-white/[0.06]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M10 50 L50 15 L90 50 L50 85 Z" />
        <circle cx="50" cy="50" r="28" strokeDasharray="4 6" />
      </svg>
      <svg className="absolute right-[12%] bottom-[18%] h-40 w-40 text-[#bbf7d0]/[0.08]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M20 80 L35 25 L80 40 L55 90 Z" />
        <path d="M50 10 L65 45 L95 55 L70 85 L30 75 Z" opacity="0.7" />
      </svg>
    </div>
  );
}

/** Hero SCITA: copy sobre vídeo / portada (el medio vive en el `<section>` del padre). */
function ScitaHeroBannerCopyStatic({
  pillars,
  headingId = "scita-hero-heading",
}: {
  pillars: readonly ScitaPillar[];
  headingId?: string;
}) {
  return (
    <div className="relative mx-auto w-full max-w-[1120px] text-center">
      <h2
        id={headingId}
        className="font-display text-[clamp(2.5rem,5.4vw,4.6rem)] leading-[1.04] text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.55)]"
      >
        ¿Qué hace el SCITA?
      </h2>
      <p className="mx-auto mt-6 max-w-[68ch] font-sans text-[1.2rem] leading-[1.75rem] text-white/95 sm:mt-7 sm:text-[1.4rem] sm:leading-[2.1rem] lg:text-[1.5rem] lg:leading-[2.3rem]">
        El SCITA es la infraestructura de información territorial del Palenke. Integra datos geoespaciales, alertas
        ambientales y monitoreo comunitario en una sola plataforma — para que las comunidades produzcan, gestionen y
        protejan información sobre su propio territorio.
      </p>
      <div className="mx-auto mt-9 grid max-w-[1240px] grid-cols-1 gap-2 rounded-2xl border border-white/10 bg-black/28 p-3 backdrop-blur-sm sm:grid-cols-2 sm:p-4 lg:mt-12 lg:grid-cols-5 lg:gap-0">
        {pillars.map((pillar, index) => {
          const Icon = pillar.icon;
          return (
            <div
              key={pillar.copy}
              className={`group relative rounded-xl p-4 text-center lg:min-h-[216px] lg:rounded-none lg:px-5 lg:py-5 ${
                index > 0 ? "lg:border-l lg:border-white/12" : ""
              }`}
            >
              <Icon className="mx-auto h-8 w-8 text-lime-300 drop-shadow-[0_0_8px_rgba(190,242,100,0.25)]" aria-hidden />
              <p className="mt-3 font-sans text-[1.1rem] leading-[1.65rem] text-white/90 sm:text-[1.15rem] sm:leading-[1.7rem]">
                {pillar.copy}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ScitaHeroBannerCopyWithScroll({
  pillars,
  headingId = "scita-hero-heading",
  introScrollProgress,
}: {
  pillars: readonly ScitaPillar[];
  headingId?: string;
  introScrollProgress: MotionValue<number>;
}) {
  const headlineOpacity = useTransform(introScrollProgress, [0.28, 0.34, 0.46, 0.56], [1, 1, 0, 0]);
  const headlineY = useTransform(introScrollProgress, [0.34, 0.54], [0, -20]);
  const pillarsOpacity = useTransform(introScrollProgress, [0.32, 0.42, 0.52], [0.86, 1, 1]);
  const pillarsY = useTransform(introScrollProgress, [0.34, 0.52], [14, 0]);

  return (
    <div className="relative mx-auto w-full max-w-[1120px] text-center">
      <motion.div className="will-change-[transform,opacity]" style={{ opacity: headlineOpacity, y: headlineY }}>
        <h2
          id={headingId}
          className="font-display text-[clamp(2.5rem,5.4vw,4.6rem)] leading-[1.04] text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.55)]"
        >
          ¿Qué hace el SCITA?
        </h2>
        <p className="mx-auto mt-6 max-w-[68ch] font-sans text-[1.2rem] leading-[1.75rem] text-white/95 sm:mt-7 sm:text-[1.4rem] sm:leading-[2.1rem] lg:text-[1.5rem] lg:leading-[2.3rem]">
          El SCITA es la infraestructura de información territorial del Palenke. Integra datos geoespaciales, alertas
          ambientales y monitoreo comunitario en una sola plataforma — para que las comunidades produzcan, gestionen y
          protejan información sobre su propio territorio.
        </p>
      </motion.div>

      <motion.div className="will-change-[transform,opacity]" style={{ opacity: pillarsOpacity, y: pillarsY }}>
        <div className="mx-auto mt-9 grid max-w-[1240px] grid-cols-1 gap-2 rounded-2xl border border-white/10 bg-black/28 p-3 backdrop-blur-sm sm:grid-cols-2 sm:p-4 lg:mt-12 lg:grid-cols-5 lg:gap-0">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.copy}
                className={`group relative rounded-xl p-4 text-center lg:min-h-[216px] lg:rounded-none lg:px-5 lg:py-5 ${
                  index > 0 ? "lg:border-l lg:border-white/12" : ""
                }`}
              >
                <Icon className="mx-auto h-8 w-8 text-lime-300 drop-shadow-[0_0_8px_rgba(190,242,100,0.25)]" aria-hidden />
                <p className="mt-3 font-sans text-[1.1rem] leading-[1.65rem] text-white/90 sm:text-[1.15rem] sm:leading-[1.7rem]">
                  {pillar.copy}
                </p>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

function ScitaHeroBannerCopy({
  pillars,
  headingId = "scita-hero-heading",
  introScrollProgress,
}: {
  pillars: readonly ScitaPillar[];
  headingId?: string;
  introScrollProgress?: MotionValue<number>;
}) {
  if (introScrollProgress) {
    return (
      <ScitaHeroBannerCopyWithScroll
        pillars={pillars}
        headingId={headingId}
        introScrollProgress={introScrollProgress}
      />
    );
  }
  return <ScitaHeroBannerCopyStatic pillars={pillars} headingId={headingId} />;
}

/**
 * Contenido del hero SCITA. En `page`, el vídeo y el velado van en el `<section>` (ScitaDashboardHero).
 */
type ScitaMarketingHeroProps = {
  /** `fill`: ocupa la ventana pegajosa (useScroll). `page`: bloque hero en página completa (p. ej. reduced motion). */
  variant: "fill" | "page";
  /** Progreso de scroll del runway (0–1): atenúa título + párrafo y acentúa la parrilla de pilares. */
  introScrollProgress?: MotionValue<number>;
};

export function ScitaMarketingHero({ variant, introScrollProgress }: ScitaMarketingHeroProps) {
  const pillars = getScitaMarketingPillars();

  const inner = <ScitaHeroBannerCopy pillars={pillars} introScrollProgress={introScrollProgress} />;

  const paddedPage = (
    <div className="relative z-10 mx-auto w-full max-w-[1800px] px-4 py-7 sm:px-7 sm:py-8 lg:px-10 lg:py-9">
      {inner}
    </div>
  );

  const paddedFill = (
    <div className="relative z-10 mx-auto flex min-h-full w-full max-w-[1800px] flex-col justify-center px-4 py-8 sm:px-7 sm:py-10 lg:px-10 lg:py-12">
      {inner}
    </div>
  );

  return (
    <div className="relative flex h-full min-h-0 w-full flex-col">{variant === "page" ? paddedPage : paddedFill}</div>
  );
}
