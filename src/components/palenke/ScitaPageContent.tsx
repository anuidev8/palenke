"use client";

/**
 * SCITA scroll choreography (Framer):
 * 1) Hero runway (sticky inside its own track): SCITA title → description → hero scales down.
 * 2) Once the runway ends, the hero releases (no longer sticky) and scrolls away naturally.
 * 3) The dashboard panel lives in normal flow below — it never overlaps the hero
 *    and stays visible until the user scrolls past the whole section.
 */

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ScitaDashboardHero } from "@/components/palenke/ScitaDashboardHero";
import { ScitaDashboardPanel } from "@/components/palenke/ScitaDashboardPanel";
import { OrientationNetworkSection } from "@/components/palenke/OrientationNetworkSection";
import {
  SCITA_RUNWAY_SCROLL_CLASS,
  SCITA_TERRITORIAL_SURFACE_CLASS,
  ScitaMarketingBackdrop,
} from "@/components/palenke/scitaMarketingHero";

export function ScitaPageContent() {
  const heroRunwayRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRunwayRef,
    offset: ["start start", "end end"],
  });

  // Hero box morph — scoped to its own runway so it never fights the panel.
  const heroScale = useTransform(heroProgress, [0, 0.55, 1], [1, 0.9, 0.78]);
  const heroWidth = useTransform(heroProgress, [0, 0.55, 1], ["100vw", "92vw", "74vw"]);
  const heroRadius = useTransform(heroProgress, [0, 0.55, 1], [0, 22, 32]);
  const heroShadow = useTransform(
    heroProgress,
    [0, 0.55, 1],
    [
      "0 36px 80px rgba(2,10,7,0.45)",
      "0 22px 48px rgba(2,10,7,0.28)",
      "0 16px 38px rgba(2,10,7,0.22)",
    ],
  );

  return (
    <section
      id="scita"
      className={`relative isolate overflow-x-clip overflow-y-visible ${SCITA_TERRITORIAL_SURFACE_CLASS} ${SCITA_RUNWAY_SCROLL_CLASS} !border-b-0`}
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <ScitaMarketingBackdrop />
      </div>

      {/* Hero runway — sticky lives only inside this track, so it releases before the panel. */}
      <div ref={heroRunwayRef} className="relative h-[200svh]">
        <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden">
          <motion.div
            className="h-[100svh] overflow-hidden border border-white/18 bg-[#0a1610]"
            style={{
              scale: heroScale,
              width: heroWidth,
              borderRadius: heroRadius,
              boxShadow: heroShadow,
            }}
          >
            <ScitaDashboardHero
              variant="surface"
              className="h-full min-h-[100svh]"
              contentVariant="fill"
              contentFadeWithScroll={false}
              introProgress={heroProgress}
            />
          </motion.div>
        </div>
      </div>

      {/* Panel — normal flow, no scroll-driven opacity, stays visible until the section ends. */}
      <div className="relative z-10 mx-auto w-full max-w-[2240px] pb-10 sm:px-4 sm:pb-12 lg:px-5 lg:pb-16 xl:px-8">
        <ScitaDashboardPanel />
      </div>

      <OrientationNetworkSection variant="dark" introVariant="title-only" className="relative z-10" />
    </section>
  );
}
