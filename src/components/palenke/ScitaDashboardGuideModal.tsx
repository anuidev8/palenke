"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Headphones, HelpCircle, X } from "lucide-react";

export const SCITA_DASHBOARD_GUIDE_VIDEO_SRC =
  "https://res.cloudinary.com/dnmjmjdsj/video/upload/v1779299099/Screen_Recording_2026-05-20_at_12.37.31_PM_jtrmmf.mp4";

type ScitaDashboardGuideModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function ScitaDashboardGuideModal({ isOpen, onClose }: ScitaDashboardGuideModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="presentation"
        >
          <motion.button
            type="button"
            aria-label="Cerrar guía"
            className="absolute inset-0 bg-black/65 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="scita-guide-title"
            className="relative flex max-h-[min(92dvh,720px)] w-full max-w-md flex-col overflow-hidden rounded-t-[28px] border border-white/10 bg-[#121f18] shadow-[0_32px_80px_rgba(0,0,0,0.55)] sm:max-w-2xl sm:rounded-[28px]"
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-5 sm:px-6"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              <motion.div
                className="flex min-w-0 items-start gap-3"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 }}
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/8 text-[#e8c98a]">
                  <HelpCircle className="h-5 w-5" aria-hidden />
                </span>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.12 }}>
                  <h2 id="scita-guide-title" className="font-display text-xl font-semibold text-white sm:text-[1.35rem]">
                    ¿Cómo usar los tableros?
                  </h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/65">
                    Video tutorial para navegar los módulos y leer la información territorial.
                  </p>
                </motion.div>
              </motion.div>
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 rounded-full border border-white/15 bg-white/8 p-2 text-white/70 transition hover:bg-white/14 hover:text-white"
                aria-label="Cerrar"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </motion.div>

            <div className="flex-1 overflow-y-auto overscroll-y-contain px-5 py-4 sm:px-6 sm:py-5">
              <motion.div
                className="overflow-hidden rounded-2xl border border-white/10 bg-black/40"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.28 }}
              >
                <video
                  className="aspect-video w-full bg-black object-contain"
                  controls
                  playsInline
                  preload="metadata"
                  src={SCITA_DASHBOARD_GUIDE_VIDEO_SRC}
                  title="Tutorial: cómo usar los tableros SCITA"
                >
                  Tu navegador no admite la reproducción de video. Puedes{" "}
                  <a
                    href={SCITA_DASHBOARD_GUIDE_VIDEO_SRC}
                    className="text-[#e8c98a] underline underline-offset-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    abrir el tutorial en una nueva pestaña
                  </a>
                  .
                </video>
              </motion.div>
            </div>

            <div className="border-t border-white/10 px-5 py-4 sm:px-6 sm:py-5">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#e8c98a] px-5 py-3.5 text-sm font-bold text-[#1a2418] transition hover:bg-[#f0d49a]"
              >
                Entendido
                <ChevronRight className="h-4 w-4" aria-hidden />
              </button>

              <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-3.5 py-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/8 text-[#e8c98a]">
                  <Headphones className="h-4 w-4" aria-hidden />
                </span>
                <motion.div className="min-w-0 text-sm">
                  <p className="text-white/55">¿Necesitas ayuda?</p>
                  <a
                    href="mailto:contacto@palenke.org"
                    className="font-semibold text-[#e8c98a] underline-offset-2 hover:underline"
                  >
                    Contáctanos
                  </a>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

type ScitaDashboardGuideSummaryProps = {
  onOpenGuide: () => void;
};

export function ScitaDashboardGuideSummary({ onOpenGuide }: ScitaDashboardGuideSummaryProps) {
  return (
    <section
      className="flex w-full shrink-0 flex-col rounded-2xl border border-[#e8c98a]/25 bg-gradient-to-b from-black/30 to-black/15 p-3.5 sm:p-4"
      aria-labelledby="scita-guide-summary-heading"
    >
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#e8c98a]/30 bg-[#e8c98a]/10 text-[#e8c98a]">
          <HelpCircle className="h-4 w-4" aria-hidden />
        </span>
        <div className="min-w-0">
          <h3 id="scita-guide-summary-heading" className="text-sm font-semibold text-white">
            ¿Cómo usar los tableros?
          </h3>
        </div>
      </div>

      <button
        type="button"
        onClick={onOpenGuide}
        className="mt-4 inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-full border border-[#e8c98a]/40 bg-[#e8c98a] px-4 py-2.5 text-sm font-bold text-[#1a2418] transition hover:bg-[#f0d49a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0c1a12]"
      >
        Ver video tutorial
        <ChevronRight className="h-4 w-4" aria-hidden />
      </button>
    </section>
  );
}
