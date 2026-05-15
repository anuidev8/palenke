"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import {
  SCITA_HERO_VIDEO_SRC,
  SCITA_MARKETING_BANNER_SRC,
  ScitaMarketingHero,
} from "@/components/palenke/scitaMarketingHero";

type ScitaDashboardHeroProps = {
  variant?: "section" | "surface";
  className?: string;
  contentVariant?: "fill" | "page";
  contentFadeWithScroll?: boolean;
  introProgress?: MotionValue<number>;
};

function ScitaHeroAbstractOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[2]" aria-hidden>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(46,125,50,0.34),transparent_42%),radial-gradient(circle_at_82%_24%,rgba(251,192,45,0.28),transparent_44%),radial-gradient(circle_at_52%_78%,rgba(46,125,50,0.24),transparent_52%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(118deg,rgba(11,33,20,0.5),rgba(251,192,45,0.08)_45%,rgba(46,125,50,0.18)_100%)]" />

      <svg
        className="absolute -left-24 -top-36 h-[680px] w-[680px] text-white/10"
        fill="currentColor"
        viewBox="0 0 200 200"
      >
        <path d="M 0 100 A 100 100 0 0 1 200 100" />
        <circle cx="100" cy="100" r="40" fill="#0a1610" />
        <circle cx="100" cy="100" r="15" />
        <path d="M 10 100 L 190 100" stroke="#0a1610" strokeWidth="4" />
      </svg>

      <svg
        className="absolute -bottom-[12%] -right-[10%] h-[520px] w-[520px] text-[#d32f2f]/20"
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        viewBox="0 0 200 200"
      >
        <polyline points="0,200 40,200 40,160 80,160 80,120 120,120 120,80 160,80 160,40 200,40" />
        <polyline points="0,160 40,160 40,120 80,120 80,80 120,80 120,40 160,40 160,0" />
      </svg>

      <div className="absolute right-[22%] top-[14%] h-[420px] w-[420px] rounded-full bg-gradient-to-br from-[#2e7d32]/20 to-transparent blur-[140px]" />
      <div className="absolute bottom-[6%] left-[22%] h-[320px] w-[320px] rounded-full bg-gradient-to-t from-[#fbc02d]/20 to-transparent blur-[110px]" />
      <div className="absolute left-[48%] top-[40%] h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-[100px]" />
    </div>
  );
}

/**
 * Introducción al SCITA: vídeo de portada + copy encima.
 * `section`: bloque completo para página.
 * `surface`: versión embebida para morph/scroll.
 */
export function ScitaDashboardHero({
  variant = "section",
  className,
  contentVariant,
  contentFadeWithScroll,
  introProgress,
}: ScitaDashboardHeroProps = {}) {
  const isSection = variant === "section";
  const resolvedContentVariant = contentVariant ?? (isSection ? "page" : "fill");
  const shouldFadeWithScroll = contentFadeWithScroll ?? isSection;
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end center"],
  });
  const baseProgress = introProgress ?? scrollYProgress;
  const fadingOpacity = useTransform(baseProgress, [0, 1], [1, 0]);
  // Three clean phases (no overlap): Title -> Description -> Dashboard handoff.
  const introOpacity = useTransform(baseProgress, [0, 0.1, 0.14], [1, 1, 0]);
  const introY = useTransform(baseProgress, [0, 0.14], [0, -24]);
  const introScale = useTransform(baseProgress, [0, 0.14], [1, 0.96]);
  const scrollHintOpacity = useTransform(baseProgress, [0, 0.06, 0.12], [0.75, 1, 0]);
  const contentReveal = useTransform(baseProgress, [0.16, 0.28], [0, 1]);
  const contentScale = useTransform(baseProgress, [0.2, 0.5], [1.08, 0.94]);
  const contentY = useTransform(baseProgress, [0.2, 0.5], [0, -14]);
  const mergedContentOpacity = useTransform(
    [contentReveal, fadingOpacity],
    (values) => {
      const reveal = Number(values[0]);
      const fade = Number(values[1]);
      return reveal * (shouldFadeWithScroll ? fade : 1);
    },
  );

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      if (mq.matches) {
        video.pause();
      } else {
        void video.play().catch(() => {});
      }
    };

    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return (
    <section
      ref={sectionRef}
      className={[
        "relative overflow-hidden bg-[#0a1610]",
        isSection
          ? "min-h-[min(56vh,_680px)] border-b border-emerald-950/40"
          : "h-full min-h-full",
        className ?? "",
      ].join(" ")}
      aria-labelledby="scita-hero-heading"
    >
      <video
        ref={videoRef}
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover object-center"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster={SCITA_MARKETING_BANNER_SRC}
        aria-hidden
      >
        <source src={SCITA_HERO_VIDEO_SRC} type="video/mp4" />
      </video>
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-br from-black/72 via-[#07130f]/82 to-black/60"
        aria-hidden
      />
      <ScitaHeroAbstractOverlay />

      <motion.div
        className="pointer-events-none absolute inset-0 z-[12] flex items-center justify-center px-6 text-center"
        style={{ opacity: introOpacity, y: introY, scale: introScale }}
      >
        <h1 className="font-display text-[clamp(3.2rem,17vw,11rem)] font-semibold uppercase tracking-[0.03em] text-white drop-shadow-[0_8px_28px_rgba(0,0,0,0.55)]">
          SCIATA
        </h1>
      </motion.div>

      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-6 z-[12] flex justify-center"
        style={{ opacity: scrollHintOpacity }}
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-black/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm">
          Desliza para explorar
        </span>
      </motion.div>

      <motion.div
        className="relative z-10"
        style={{ opacity: mergedContentOpacity, scale: contentScale, y: contentY }}
        initial={{ filter: "blur(8px)" }}
        animate={{ filter: "blur(0px)" }}
        transition={{ duration: 0.82, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
      >
        <ScitaMarketingHero variant={resolvedContentVariant} />
      </motion.div>
    </section>
  );
}
