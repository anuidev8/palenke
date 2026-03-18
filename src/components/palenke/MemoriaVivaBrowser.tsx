"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, ExternalLink, MapPin, X } from "lucide-react";

interface MemoriaCard {
  category: string;
  categoryColor: string;
  categoryBg: string;
  title: string;
  territory: string;
  year: string;
  gradientFrom: string;
  gradientTo: string;
  pdfUrl?: string | null;
  sourceUrl?: string | null;
  /** Optional long description shown when expanded */
  description?: string;
}

interface MemoriaVivaBrowserProps {
  cards: MemoriaCard[];
}

export function MemoriaVivaBrowser({ cards }: MemoriaVivaBrowserProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  function toggle(title: string) {
    setExpanded((prev) => (prev === title ? null : title));
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((item, i) => {
        const isOpen = expanded === item.title;

        return (
          <motion.article
            key={item.title}
            layout
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.4, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col overflow-hidden rounded-[20px] border border-[#e8dfd3] bg-white"
            style={{
              boxShadow: isOpen
                ? `0 0 0 2px ${item.categoryColor}55, 0 16px 40px -8px ${item.categoryColor}22`
                : undefined,
            }}
          >
            {/* Thumbnail with hover overlay */}
            <motion.div
              className="relative h-36 w-full cursor-pointer overflow-hidden"
              style={{
                background: `linear-gradient(150deg, ${item.gradientFrom}, ${item.gradientTo})`,
              }}
              onClick={() => toggle(item.title)}
              whileHover="hovered"
            >
              {/* Dim overlay on hover */}
              <motion.div
                className="absolute inset-0"
                style={{ background: "rgba(0,0,0,0)" }}
                variants={{ hovered: { background: "rgba(0,0,0,0.35)" } }}
                transition={{ duration: 0.25 }}
              />

              {/* "Ver más" label — fades in on hover */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                variants={{ hovered: { opacity: 1 } }}
                transition={{ duration: 0.2 }}
              >
                <span className="rounded-full border border-white/50 bg-white/15 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                  {isOpen ? "Cerrar" : "Ver más"}
                </span>
              </motion.div>

              {/* Category badge */}
              <div
                className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em]"
                style={{ background: item.categoryBg, color: item.categoryColor }}
              >
                {item.category}
              </div>

              {/* Close button when open */}
              <AnimatePresence>
                {isOpen && (
                  <motion.button
                    type="button"
                    aria-label="Cerrar"
                    className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm"
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    transition={{ duration: 0.15 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpanded(null);
                    }}
                  >
                    <X className="h-3.5 w-3.5" aria-hidden="true" />
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Content */}
            <div className="flex flex-1 flex-col gap-3 p-4">
              <h3
                className="cursor-pointer font-display text-base leading-snug text-[#1a1a1a] transition hover:text-[#2e7d32]"
                onClick={() => toggle(item.title)}
              >
                {item.title}
              </h3>

              <div className="flex items-center gap-3 text-xs text-[#7a756e]">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" aria-hidden="true" />
                  {item.territory}
                </span>
                <span>{item.year}</span>
              </div>

              {/* Expandable description */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="desc"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    {item.description ? (
                      <p className="text-sm leading-6 text-[#4a4540]">{item.description}</p>
                    ) : (
                      <p className="text-sm italic leading-6 text-[#7a756e]">
                        Descripción no disponible todavía.
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Actions */}
              <div className="mt-auto flex flex-wrap gap-2">
                {item.pdfUrl ? (
                  <a
                    href={item.pdfUrl}
                    download
                    className="inline-flex items-center gap-1 rounded-full bg-[#1a1a1a] px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-[#333]"
                  >
                    <Download className="h-3 w-3" aria-hidden="true" />
                    Descargar
                  </a>
                ) : null}
                {item.sourceUrl ? (
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-full border border-[#e8dfd3] px-3 py-1.5 text-[11px] font-semibold text-[#4a4540] transition hover:bg-[#f0eae0]"
                  >
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    Fuente
                  </a>
                ) : null}
              </div>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}
