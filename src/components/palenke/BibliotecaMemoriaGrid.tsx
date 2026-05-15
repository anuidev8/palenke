"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { PlayCircle, Download, ArrowRight, Volume2, ChevronUp, X } from "lucide-react";
import Image from "next/image";
import type { DocumentRecord } from "@/lib/mock-data";

const ACCENTS = ["#d48a1f", "#2e7d32", "#1a1a1a", "#b65c2d"] as const;

const MASONRY_SIZES = ["tall", "short", "medium", "medium", "tall", "compact"] as const;
type MasonrySize = (typeof MASONRY_SIZES)[number] | "hero";

const SIZE_MIN_HEIGHT: Record<MasonrySize, string> = {
  hero: "min-h-[520px] sm:min-h-[580px]",
  tall: "min-h-[460px]",
  medium: "min-h-[340px]",
  short: "min-h-[280px]",
  compact: "min-h-[240px]",
};

function getActionIcon(action: string) {
  if (action === "video") return PlayCircle;
  if (action === "file") return Download;
  return ArrowRight;
}

function getMasonrySize(index: number): MasonrySize {
  return MASONRY_SIZES[index % MASONRY_SIZES.length];
}

type MemoriaCardProps = {
  doc: DocumentRecord;
  index: number;
  variant: MasonrySize;
  isExpanded: boolean;
  onExpand: () => void;
  onCollapse: () => void;
};

function MemoriaCard({
  doc,
  index,
  variant,
  isExpanded,
  onExpand,
  onCollapse,
}: MemoriaCardProps) {
  const isHero = variant === "hero";
  const ActionIcon = getActionIcon(doc.action);
  const accentColor = ACCENTS[index % ACCENTS.length];

  const cardStyle: CSSProperties = isExpanded ? {} : { minHeight: undefined };

  return (
    <motion.article
      layout
      layoutId={`memoria-card-${doc.id}`}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.04, 0.28), ease: [0.22, 1, 0.36, 1] }}
      className={`group relative flex w-full flex-col overflow-hidden rounded-[2rem] bg-[#2a2a2a] text-white transition-shadow duration-500 will-change-transform [backface-visibility:hidden] ${
        isExpanded
          ? "shadow-[0_30px_80px_rgba(0,0,0,0.4)]"
          : "hover:-translate-y-1.5 hover:shadow-[0_24px_60px_rgba(0,0,0,0.18)]"
      } ${!isExpanded && !isHero ? SIZE_MIN_HEIGHT[variant] : ""} ${!isExpanded && isHero ? SIZE_MIN_HEIGHT.hero : ""}`}
      style={cardStyle}
    >
      {doc.imageUrl ? (
        <>
          <div className="absolute inset-0 z-0 h-full w-full">
            <Image
              src={doc.imageUrl}
              alt={doc.title}
              fill
              className={`object-cover transition-transform duration-1000 ${isExpanded ? "scale-105" : "group-hover:scale-110"}`}
              sizes={
                isHero
                  ? "(max-width: 768px) 100vw, 1200px"
                  : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              }
            />
          </div>
          <div
            className={`absolute inset-0 z-10 transition-all duration-700 ${
              isExpanded
                ? isHero
                  ? "bg-[#0d1f0d]/90 backdrop-blur-md"
                  : "bg-[#110e0c]/85 backdrop-blur-md"
                : isHero
                  ? "bg-gradient-to-tr from-[#0d1f0d]/95 via-[#2e7d32]/60 to-[#b65c2d]/40 group-hover:via-[#2e7d32]/70 group-hover:to-[#b65c2d]/50"
                  : "bg-gradient-to-t from-[#110e0c]/92 via-[#110e0c]/45 to-[#110e0c]/10 group-hover:from-[#110e0c]/95 group-hover:via-[#110e0c]/65"
            }`}
          />
        </>
      ) : (
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#1b5e20] to-[#8c3b28]" />
      )}

      <motion.div
        layout="position"
        className={`relative z-20 flex h-full ${
          isExpanded || isHero ? "flex-col gap-8 p-6 md:flex-row md:p-8 lg:p-10" : "flex-col p-6 pt-12"
        }`}
      >
        <motion.div
          layout="position"
          className={`flex flex-col ${
            isExpanded || isHero ? "justify-end md:w-1/3 lg:w-2/5" : "flex-1 justify-end"
          }`}
        >
          <div
            className={`flex items-start justify-between gap-2 ${
              isExpanded || isHero ? "mb-6" : "absolute left-6 right-6 top-6"
            }`}
          >
            <span
              className="inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest"
              style={{
                backgroundColor: accentColor,
                color: accentColor === "#1a1a1a" ? "#fff" : "#1a1a1a",
              }}
            >
              {doc.type}
            </span>
            {!isExpanded && (
              <span className="inline-flex rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-md">
                {doc.territory}
              </span>
            )}
          </div>

          <motion.h3
            layout="position"
            className={`font-display leading-[1.1] tracking-[-0.02em] text-white ${
              isExpanded || isHero
                ? "mb-4 text-4xl lg:text-6xl"
                : "text-2xl sm:text-3xl transition-all duration-500 group-hover:-translate-y-1"
            }`}
          >
            {doc.title}
          </motion.h3>

          {isExpanded && (
            <motion.div layout="position" className="mt-6 space-y-2">
              <p className="text-sm font-medium uppercase tracking-wider text-white/60">
                {doc.year} · {doc.territory}
              </p>
              <p className="text-sm text-[#e0dcd5]">{doc.council}</p>
            </motion.div>
          )}

          {!isExpanded && (
            <div
              className={`mt-4 transition-all duration-500 ease-[0.22,1,0.36,1] ${
                isHero
                  ? "opacity-100"
                  : "grid grid-rows-[0fr] opacity-0 group-hover:grid-rows-[1fr] group-hover:opacity-100"
              }`}
            >
              <div className="overflow-hidden">
                <p className="line-clamp-3 border-b border-white/20 pb-4 text-[15px] leading-relaxed text-[#e0dcd5]">
                  {doc.description}
                </p>

                {isHero && (
                  <div className="flex items-center gap-3 pt-4">
                    <button
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#1a1a1a] transition-transform hover:scale-110"
                    >
                      <Volume2 className="h-4 w-4" />
                    </button>
                    <div className="h-1 flex-1 rounded-full bg-white/20">
                      <div className="h-full w-1/3 rounded-full bg-white" />
                    </div>
                    <span className="text-xs text-white/60">0:15</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {!isExpanded && (
            <div className="mt-5 flex items-center justify-between border-t border-white/20 pt-5">
              <span className="text-xs font-medium uppercase tracking-widest text-white/60">
                {doc.year} · {doc.council}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onExpand}
                  className="inline-flex h-10 items-center justify-center rounded-full border border-white/20 bg-black/40 px-4 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md transition-colors hover:bg-black/60"
                >
                  Ver más
                </button>
                <a
                  href={doc.url}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#1a1a1a] shadow-lg shadow-black/20 transition-transform hover:scale-110"
                  aria-label={doc.fileLabel}
                  onClick={(e) => e.stopPropagation()}
                >
                  <ActionIcon className="h-4 w-4" />
                </a>
              </div>
            </div>
          )}
        </motion.div>

        {isHero && !isExpanded && (
          <div className="hidden flex-1 flex-col items-end justify-end pb-5 text-right md:flex">
            <p className="max-w-md text-xl leading-relaxed text-[#e0dcd5] line-clamp-4">{doc.description}</p>
          </div>
        )}

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-1 flex-col border-t border-white/20 pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0 lg:pl-10"
            >
              <div className="mb-6 flex items-start justify-between">
                <div className="flex flex-wrap gap-2">
                  {doc.keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-md"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={onCollapse}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-white/20"
                  aria-label="Cerrar detalles"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className="text-lg leading-relaxed text-[#e0dcd5] md:text-xl">{doc.description}</p>

              <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <motion.div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                  <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-white/50">
                      Recurso de Memoria
                    </p>
                    <p className="font-medium text-white">{doc.fileLabel || "Explorar recurso"}</p>
                  </div>

                  <a
                    href={doc.url}
                    className="group inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-bold transition-all hover:scale-105"
                    style={{ color: accentColor === "#1a1a1a" ? "#000" : accentColor }}
                  >
                    <ActionIcon className="h-5 w-5 transition-transform group-hover:scale-110" />
                    <span>
                      {doc.action === "video"
                        ? "Reproducir Video"
                        : doc.action === "file"
                          ? "Descargar Archivo"
                          : "Abrir Enlace"}
                    </span>
                  </a>
                </motion.div>

                {(doc.action === "video" || doc.action === "file") && (
                  <div className="mt-6 flex items-center gap-1.5 overflow-hidden">
                    {Array.from({ length: 60 }).map((_, wi) => (
                      <div
                        key={wi}
                        className="w-1.5 shrink-0 rounded-full bg-white/30"
                        style={{ height: `${Math.max(4, ((wi * 17) % 32) + 4)}px` }}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-auto flex justify-end pt-8">
                <button
                  type="button"
                  onClick={onCollapse}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Contraer panel
                  <ChevronUp className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.article>
  );
}

export default function BibliotecaMemoriaGrid({ docs }: { docs: DocumentRecord[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { hero, masonryDocs } = useMemo(() => {
    if (docs.length === 0) return { hero: null, masonryDocs: [] as DocumentRecord[] };
    return { hero: docs[0], masonryDocs: docs.slice(1) };
  }, [docs]);

  const expandedDoc = expandedId ? docs.find((d) => d.id === expandedId) : null;
  const expandedIndex = expandedDoc ? docs.findIndex((d) => d.id === expandedId) : -1;

  return (
    <LayoutGroup id="biblioteca-memoria">
      <motion.div layout className="flex flex-col gap-6">
        {hero && expandedId !== hero.id && (
          <MemoriaCard
            doc={hero}
            index={0}
            variant="hero"
            isExpanded={false}
            onExpand={() => setExpandedId(hero.id)}
            onCollapse={() => setExpandedId(null)}
          />
        )}

        <AnimatePresence mode="popLayout">
          {expandedDoc && (
            <motion.div
              key={`expanded-${expandedDoc.id}`}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
            >
              <MemoriaCard
                doc={expandedDoc}
                index={Math.max(expandedIndex, 0)}
                variant={expandedIndex <= 0 ? "hero" : getMasonrySize(expandedIndex - 1)}
                isExpanded
                onExpand={() => setExpandedId(expandedDoc.id)}
                onCollapse={() => setExpandedId(null)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {masonryDocs.length > 0 && (
          <motion.div
            layout
            className="columns-1 [column-fill:balance] sm:columns-2 lg:columns-3"
            style={{ columnGap: "1.25rem" }}
          >
            {masonryDocs.map((doc, i) => {
              if (expandedId === doc.id) return null;

              return (
                <motion.div
                  key={doc.id}
                  layout
                  className="mb-6 inline-block w-full break-inside-avoid align-top"
                  transition={{ layout: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
                >
                  <MemoriaCard
                    doc={doc}
                    index={i + 1}
                    variant={getMasonrySize(i)}
                    isExpanded={false}
                    onExpand={() => setExpandedId(doc.id)}
                    onCollapse={() => setExpandedId(null)}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        )}

      </motion.div>
    </LayoutGroup>
  );
}
