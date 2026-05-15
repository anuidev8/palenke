"use client";

/**
 * Layout SCITA con morph por scroll (Framer):
 * 1) Hero de video en pantalla completa.
 * 2) Al bajar, el hero se reduce a caja central con detalles.
 * 3) Aparece el panel principal de tableros.
 */

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ScitaDashboardHero } from "@/components/palenke/ScitaDashboardHero";
import { ScitaDashboardPanel } from "@/components/palenke/ScitaDashboardPanel";
import {
  SCITA_RUNWAY_SCROLL_CLASS,
  SCITA_TERRITORIAL_SURFACE_CLASS,
  ScitaMarketingBackdrop,
} from "@/components/palenke/scitaMarketingHero";

export function ScitaPageContent() {
  const runwayRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: runwayRef,
    offset: ["start start", "end end"],
  });

  const heroScale = useTransform(scrollYProgress, [0, 0.26, 0.5], [1, 0.82, 0.62]);
  const heroWidth = useTransform(scrollYProgress, [0, 0.26, 0.5], ["100vw", "86vw", "64vw"]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, -24]);
  const heroRadius = useTransform(scrollYProgress, [0, 0.3, 0.5], [0, 24, 30]);
  const heroShadow = useTransform(
    scrollYProgress,
    [0, 0.44, 0.54],
    [
      "0 36px 80px rgba(2,10,7,0.45)",
      "0 18px 42px rgba(2,10,7,0.18)",
      "0 0 0 rgba(2,10,7,0)",
    ],
  );
  // Keep the SCITA hero visible behind the dashboard handoff; the panel sits above it.
  const stickyOpacity = useTransform(scrollYProgress, [0, 1], [1, 1]);

  const panelOpacity = useTransform(scrollYProgress, [0.54, 0.66], [0, 1]);
  const panelY = useTransform(scrollYProgress, [0.54, 0.66], [120, 0]);
  const panelScale = useTransform(scrollYProgress, [0.54, 0.66], [0.975, 1]);

  return (
    <section
      id="scita"
      ref={runwayRef}
      className={`relative isolate min-h-[235svh] overflow-x-clip overflow-y-visible ${SCITA_TERRITORIAL_SURFACE_CLASS} ${SCITA_RUNWAY_SCROLL_CLASS} !border-b-0`}
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <ScitaMarketingBackdrop />
      </div>

      <div className="sticky top-0 z-0 h-[100svh] overflow-hidden">
        <motion.div
          className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
          style={{ opacity: stickyOpacity }}
        >
          <motion.div
            className="h-[100svh] overflow-hidden border border-white/18 bg-[#0a1610]"
            style={{ y: heroY, scale: heroScale, width: heroWidth, borderRadius: heroRadius, boxShadow: heroShadow }}
          >
            <ScitaDashboardHero
              variant="surface"
              className="h-full min-h-[100svh]"
              contentVariant="fill"
              contentFadeWithScroll={false}
              introProgress={scrollYProgress}
            />
          </motion.div>
        </motion.div>
      </div>

      <div className="relative z-[90] mx-auto w-full max-w-[1920px] px-2 pb-10 sm:px-4 sm:pb-12 lg:px-6 lg:pb-16">
        <motion.div style={{ opacity: panelOpacity, y: panelY, scale: panelScale }} className="relative z-[100] mt-[88svh]">
          <ScitaDashboardPanel />
        </motion.div>
      </div>
    </section>
  );
}
