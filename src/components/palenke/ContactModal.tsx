"use client";

import { useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Mail, X } from "lucide-react";
import { ContactForm } from "./ContactForm";

type ContactModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

function PcnStripe({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`flex h-1.5 w-full ${className}`}>
      <span className="flex-1 bg-white/90" />
      <span className="flex-1 bg-[#2e7d32]" />
      <span className="flex-1 bg-[#d32f2f]" />
      <span className="flex-1 bg-[#fbc02d]" />
    </div>
  );
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const reduceMotion = useReducedMotion();

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

  const panelTransition = reduceMotion
    ? { duration: 0.01 }
    : { type: "spring" as const, damping: 32, stiffness: 360, mass: 0.85 };

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-5 lg:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="presentation"
        >
          <motion.button
            type="button"
            aria-label="Cerrar formulario de contacto"
            className="absolute inset-0 bg-[#1a1a1a]/75 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.22 }}
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-modal-title"
            className="relative flex max-h-[min(94dvh,780px)] w-full max-w-4xl flex-col overflow-hidden rounded-t-[28px] bg-white shadow-[0_40px_100px_rgba(0,0,0,0.45)] sm:rounded-[28px]"
            initial={
              reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.88, y: 24 }
            }
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 16 }}
            transition={panelTransition}
            style={{ transformOrigin: "center center" }}
          >
            <PcnStripe />

            <div className="relative shrink-0 overflow-hidden bg-[#1a1a1a] px-5 py-5 sm:px-8 sm:py-6">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#2e7d32]/35 via-transparent to-[#d32f2f]/25"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full bg-[#fbc02d]/20 blur-3xl"
              />

              <div className="relative flex items-start justify-between gap-4">
                <div className="flex min-w-0 flex-1 items-start gap-4 sm:gap-5">
                  <div className="shrink-0 rounded-2xl border border-white/15 bg-white/10 p-2.5 sm:p-3">
                    <Image
                      src="/brands/palenkelogo-light.svg"
                      alt="Palenke"
                      width={56}
                      height={112}
                      className="h-14 w-auto object-contain sm:h-16"
                      priority
                    />
                  </div>
                  <div className="min-w-0 pt-0.5">
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#fbc02d]">
                      Contacto
                    </p>
                    <h2
                      id="contact-modal-title"
                      className="mt-1 font-display text-2xl leading-tight text-white sm:text-3xl"
                    >
                      Escríbenos
                    </h2>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-white/75">
                      Déjanos tu nombre, medio de contacto y comentario. El equipo de Palenke te
                      responderá por correo.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="shrink-0 rounded-full border border-white/20 bg-white/10 p-2 text-white transition-colors hover:border-[#fbc02d]/60 hover:bg-white/20"
                  aria-label="Cerrar"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
              <aside className="hidden shrink-0 flex-col justify-between border-r border-[#e8dfd3] bg-gradient-to-b from-[#e8f5e9] via-white to-[#fff8e1] px-6 py-6 lg:flex lg:w-[280px] xl:w-[300px]">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#2e7d32] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                    <span className="h-2 w-2 rounded-full bg-[#fbc02d]" aria-hidden="true" />
                    Palenke PCN
                  </div>
                  <p className="text-sm leading-6 text-[#1a1a1a]/85">
                    Plataforma de Gobierno propio del Proceso de Comunidades Negras.
                  </p>
                  <ul className="space-y-2 text-xs font-semibold uppercase tracking-wide text-[#4a4540]">
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-6 rounded-full bg-[#2e7d32]" aria-hidden="true" />
                      Territorio
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-6 rounded-full bg-[#d32f2f]" aria-hidden="true" />
                      Memoria
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-6 rounded-full bg-[#fbc02d]" aria-hidden="true" />
                      Cuidado
                    </li>
                  </ul>
                </div>

                <div className="mt-8 rounded-[20px] border-2 border-[#fbc02d]/50 bg-white p-4 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#2e7d32]">
                    Correo directo
                  </p>
                  <a
                    href="mailto:datos@palenke.org"
                    className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-[#1a1a1a] underline-offset-2 hover:text-[#2e7d32] hover:underline"
                  >
                    <Mail className="h-4 w-4 text-[#d32f2f]" aria-hidden="true" />
                    datos@palenke.org
                  </a>
                </div>
              </aside>

              <div className="min-h-0 flex-1 overflow-y-auto bg-white px-5 py-5 sm:px-8 sm:py-7">
                <div className="mb-5 flex items-start gap-3 rounded-[18px] border-l-4 border-[#2e7d32] bg-[#e8f5e9] px-4 py-3 text-sm text-[#1b5e20] lg:hidden">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#d32f2f]" aria-hidden="true" />
                  <span>
                    También puedes escribir a{" "}
                    <a
                      href="mailto:datos@palenke.org"
                      className="font-semibold text-[#2e7d32] underline-offset-2 hover:underline"
                    >
                      datos@palenke.org
                    </a>
                  </span>
                </div>

                <ContactForm />
              </div>
            </div>

            <PcnStripe />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
