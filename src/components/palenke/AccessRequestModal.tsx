"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldAlert } from "lucide-react";
import { AccessRequestForm } from "./AccessRequestForm";

type AccessRequestModalProps = {
  isOpen: boolean;
  onClose: () => void;
  instrumentSlug: string;
  instrumentTitle: string;
  documentId: string;
  documentTitle: string;
  accessLevel: "admin" | "coordination";
};

export function AccessRequestModal({
  isOpen,
  onClose,
  instrumentSlug,
  instrumentTitle,
  documentId,
  documentTitle,
  accessLevel,
}: AccessRequestModalProps) {
  const isCoordination = accessLevel === "coordination";

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-[32px] bg-[#fcfaf7] shadow-2xl"
          >
            {/* Header */}
            <div className="flex shrink-0 items-start justify-between border-b border-[#e8dfd3] bg-white px-6 py-5 sm:px-8 sm:py-6">
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-widest text-[#7a756e]">
                  Solicitud de acceso
                </p>
                <h2 className="font-display text-2xl sm:text-3xl text-[#1a1a1a]">
                  {instrumentTitle}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="rounded-full bg-[#f4f1ec] p-2 text-[#7a756e] transition-colors hover:bg-[#e8dfd3] hover:text-[#1a1a1a]"
                aria-label="Cerrar modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="overflow-y-auto px-6 py-6 sm:px-8">
              <div className="mx-auto max-w-2xl space-y-6">
                <p className="text-base leading-relaxed text-[#4a4540]">
                  Cuéntanos quién eres y para qué necesitas este documento. Tu solicitud quedará en revisión
                  y el equipo de Palenke te responderá por correo una vez tome una decisión.
                </p>

                <div className="rounded-2xl border border-[#e8dfd3] bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7a756e]">
                    Archivo
                  </p>
                  <p className="mt-2 text-base font-semibold text-[#1a1a1a]">{documentTitle}</p>
                </div>

                {isCoordination ? (
                  <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
                    <h4 className="font-bold text-orange-900 mb-1">Revisión especial de coordinación</h4>
                    <p className="text-sm text-orange-800">
                      Este documento requiere una validación adicional por sensibilidad territorial. Después de
                      enviarlo, deberás esperar la revisión del equipo antes de recibir acceso o el enlace de entrega.
                    </p>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
                    <h4 className="font-bold text-blue-900 mb-1">Revisión administrativa</h4>
                    <p className="text-sm text-blue-800">
                      El equipo administrador revisará tu solicitud y te avisará por correo cuando sea aprobada,
                      rechazada o cuando el documento haya sido enviado. Tiempo estimado: 1 día hábil.
                    </p>
                  </div>
                )}

                <div className="rounded-[20px] border border-[#d8e7d5] bg-[#f5fbf3] p-4">
                  <p className="text-sm font-semibold text-[#234b1f]">Qué pasa después</p>
                  <ul className="mt-2 grid gap-2 text-sm leading-6 text-[#476243]">
                    <li>1. Registramos tu solicitud con el documento exacto que elegiste.</li>
                    <li>2. El equipo de Palenke revisa la información y valida el acceso.</li>
                    <li>3. Te escribimos al correo con la decisión y los siguientes pasos.</li>
                  </ul>
                </div>

                <div className="rounded-[20px] border border-[#e8dfd3] bg-[#fffaf2] p-4">
                  <p className="inline-flex items-start gap-2 text-sm text-[#6b5f53]">
                    <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
                    <span>Tus datos se usan únicamente para validar y registrar la solicitud de acceso.</span>
                  </p>
                </div>

                <AccessRequestForm
                  instrumentSlug={instrumentSlug}
                  instrumentTitle={instrumentTitle}
                  documentId={documentId}
                  documentTitle={documentTitle}
                  accessLevel={accessLevel}
                />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
