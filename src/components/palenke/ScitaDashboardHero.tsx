"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  SCITA_TERRITORIAL_SURFACE_CLASS,
  ScitaMarketingBackdrop,
  ScitaMarketingHero,
} from "@/components/palenke/scitaMarketingHero";

/**
 * Introducción al SCITA (reduced motion y demás flujos sin pin).
 * Una sola superficie territorial: fondo y backdrop viven aquí, no en el hero de contenido.
 */
export function ScitaDashboardHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["end end", "end center"],
  });
  const contentOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className={`relative min-h-[60vh] overflow-hidden ${SCITA_TERRITORIAL_SURFACE_CLASS} !border-b-0`}
      aria-labelledby="scita-hero-heading"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <ScitaMarketingBackdrop />
      </div>
      <motion.div style={{ opacity: contentOpacity }}>
        <ScitaMarketingHero variant="page" filterSvgId="scita-hero-blur-static" />
      </motion.div>
    </section>
  );
}
