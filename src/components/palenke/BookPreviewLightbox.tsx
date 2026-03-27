"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Expand, X } from "lucide-react";

type BookPreviewLightboxProps = {
  src: string;
  alt: string;
  label?: string;
};

export function BookPreviewLightbox({
  src,
  alt,
  label = "Ver vista previa",
}: BookPreviewLightboxProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#1b5e20] underline-offset-4 transition hover:underline"
      >
        {label}
        <Expand className="h-3.5 w-3.5" aria-hidden="true" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/65 p-4 sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="relative w-full max-w-3xl rounded-2xl bg-white p-3 shadow-2xl sm:p-4"
              initial={{ opacity: 0, scale: 0.92, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#e7e7e7] bg-white text-[#3a3a3a] transition hover:bg-[#f6f6f6]"
                aria-label="Cerrar vista previa"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>

              <div className="relative mx-auto aspect-[1/2] w-full max-w-[520px] overflow-hidden rounded-xl border border-[#eeeeee] bg-[#f9f7f2]">
                <Image
                  src={src}
                  alt={alt}
                  fill
                  sizes="(max-width: 768px) 90vw, 520px"
                  className="object-contain"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
