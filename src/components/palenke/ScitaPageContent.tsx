"use client";

/**
 * Layout SCITA en dos secciones:
 * 1) Hero de marketing.
 * 2) Workspace en bloque separado (fuera del hero).
 */

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ScitaDashboardHero } from "@/components/palenke/ScitaDashboardHero";
import { SCITA_TERRITORIAL_SURFACE_CLASS, ScitaMarketingBackdrop } from "@/components/palenke/scitaMarketingHero";
import type { ScitaModuleId } from "@/components/palenke/ScitaPowerBiBoard";
import { ScitaWorkspace } from "@/components/palenke/ScitaWorkspace";

type ScitaPageContentProps = {
  fieldReportHref: string;
  geoportalHref: string;
  showGeoportal: boolean;
};

export function ScitaPageContent({ fieldReportHref, geoportalHref, showGeoportal }: ScitaPageContentProps) {
  const [activeModuleId, setActiveModuleId] = useState<ScitaModuleId>("titulacion");
  const workspaceSectionRef = useRef<HTMLElement>(null);

  return (
    <>
      <ScitaDashboardHero />
      <section
        ref={workspaceSectionRef}
        className={`relative px-3 py-8 sm:px-5 sm:py-12 lg:px-8 lg:py-16 ${SCITA_TERRITORIAL_SURFACE_CLASS} !border-b-0`}
      >
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <ScitaMarketingBackdrop />
        </div>
        <motion.div
          className="relative z-10 mx-auto w-full max-w-[1920px] overflow-visible"
          initial={{ opacity: 0, y: 36, scale: 0.985 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.7 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <ScitaWorkspace
            placement="page"
            fieldReportHref={fieldReportHref}
            geoportalHref={geoportalHref}
            showGeoportal={showGeoportal}
            activeModuleId={activeModuleId}
            onActiveModuleChange={setActiveModuleId}
          />
        </motion.div>
      </section>
    </>
  );
}
