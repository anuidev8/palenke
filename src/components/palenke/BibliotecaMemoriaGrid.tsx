"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlayCircle, Download, ArrowRight, Volume2, ChevronUp, X } from "lucide-react";
import Image from "next/image";
import type { DocumentRecord } from "@/lib/mock-data";

function getActionIcon(action: string) {
  if (action === "video") return PlayCircle;
  if (action === "file") return Download;
  return ArrowRight;
}

export default function BibliotecaMemoriaGrid({
  docs,
}: {
  docs: DocumentRecord[];
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <motion.div layout className="grid gap-6 items-start grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {docs.map((doc, i) => {
        // Organic masonry flow: some tall, some square, some wide-ish
        const isHero = i === 0;
        const isFeatured = i > 0 && i % 3 === 0;
        const isTall = i % 4 === 1;
        
        // Define varied heights for the masonry look
        const baseHeight = isHero ? "560px" : isFeatured ? "480px" : isTall ? "420px" : "340px";
        const ActionIcon = getActionIcon(doc.action);
        
        // Accent colors to simulate "vibrant portraits" or identity colors
        const accents = ["#d48a1f", "#2e7d32", "#1a1a1a", "#b65c2d"];
        const accentColor = accents[i % accents.length];
        
        const isExpanded = expandedId === doc.id;

        return (
          <motion.article
            layout
            key={doc.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
            className={`group relative flex flex-col overflow-hidden rounded-[2rem] bg-[#2a2a2a] text-white transition-shadow duration-500 will-change-transform [backface-visibility:hidden] ${
              isExpanded 
                ? "sm:col-span-2 lg:col-span-3 shadow-[0_30px_80px_rgba(0,0,0,0.4)] z-10" 
                : isHero 
                  ? "sm:col-span-2 lg:col-span-3 hover:-translate-y-2 hover:shadow-[0_24px_60px_rgba(0,0,0,0.15)] z-0"
                  : "hover:-translate-y-2 hover:shadow-[0_24px_60px_rgba(0,0,0,0.15)] z-0"
            }`}
            style={{
              minHeight: isExpanded ? "auto" : baseHeight,
            } as any}
          >
            {/* Image & Gradient Overlay */}
            {doc.imageUrl ? (
              <>
                <div className="absolute inset-0 z-0 h-full w-full">
                  <Image
                    src={doc.imageUrl}
                    alt={doc.title}
                    fill
                    className={`object-cover transition-transform duration-1000 ${isExpanded ? "scale-105" : "group-hover:scale-110"}`}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 100vw"
                  />
                </div>
                {/* Brand gradient overlay: soft green with a hint of earthy red (ONLY for Hero) */}
                <div className={`absolute inset-0 z-10 transition-all duration-700 ${
                  isExpanded 
                    ? (isHero ? "bg-[#0d1f0d]/90 backdrop-blur-md" : "bg-[#110e0c]/85 backdrop-blur-md")
                    : isHero
                      ? "bg-gradient-to-tr from-[#0d1f0d]/95 via-[#2e7d32]/60 to-[#b65c2d]/40 group-hover:via-[#2e7d32]/70 group-hover:to-[#b65c2d]/50"
                      : "bg-gradient-to-t from-[#110e0c]/90 via-[#110e0c]/40 to-transparent group-hover:from-[#110e0c]/95 group-hover:via-[#110e0c]/70"
                }`} />
              </>
            ) : (
              <div 
                className="absolute inset-0 z-0 bg-gradient-to-br from-[#1b5e20] to-[#8c3b28]" 
              />
            )}

            {/* Content Wrapper */}
            <motion.div layout="position" className={`relative z-20 flex h-full ${isExpanded || isHero ? "flex-col md:flex-row p-6 md:p-8 lg:p-10 gap-8" : "flex-col p-6 pt-12"}`}>
              
              {/* Left Side (or full card when collapsed) */}
              <motion.div layout="position" className={`flex flex-col ${isExpanded || isHero ? "md:w-1/3 lg:w-2/5 justify-end" : "flex-1 justify-end"}`}>
                
                {/* Top Badges */}
                <div className={`flex justify-between items-start gap-2 ${isExpanded || isHero ? "mb-6" : "absolute top-6 left-6 right-6"}`}>
                  <span 
                    className="inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest"
                    style={{ backgroundColor: accentColor, color: accentColor === '#1a1a1a' ? '#fff' : '#1a1a1a' }}
                  >
                    {doc.type}
                  </span>
                  {!isExpanded && (
                    <span className="inline-flex rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-md">
                      {doc.territory}
                    </span>
                  )}
                </div>

                <motion.h3 layout="position" className={`font-display leading-[1.1] tracking-[-0.02em] text-white ${isExpanded || isHero ? "text-4xl lg:text-6xl mb-4" : "text-3xl transition-all duration-500 group-hover:-translate-y-1"}`}>
                  {doc.title}
                </motion.h3>

                {/* Meta info shown under title when expanded */}
                {isExpanded && (
                  <motion.div layout="position" className="mt-6 space-y-2">
                    <p className="text-sm font-medium text-white/60 uppercase tracking-wider">{doc.year} · {doc.territory}</p>
                    <p className="text-sm text-[#e0dcd5]">{doc.council}</p>
                  </motion.div>
                )}
                
                
                {/* Excerpt area */}
                {!isExpanded && (
                  <div className={`mt-4 transition-all duration-500 ease-[0.22,1,0.36,1] ${isHero ? "opacity-100" : "grid grid-rows-[0fr] opacity-0 group-hover:grid-rows-[1fr] group-hover:opacity-100"}`}>
                    <div className="overflow-hidden">
                      <p className="text-[15px] leading-relaxed text-[#e0dcd5] pb-4 border-b border-white/20 line-clamp-3">
                        {doc.description}
                      </p>
                      
                      <div className="flex items-center gap-3 pt-4">
                         <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#1a1a1a] transition-transform hover:scale-110">
                           <Volume2 className="h-4 w-4" />
                         </button>
                         <div className="flex-1 h-1 rounded-full bg-white/20">
                           <div className="h-full w-1/3 rounded-full bg-white" />
                         </div>
                         <span className="text-xs text-white/60">0:15</span>
                      </div>
                    </div>
                  </div>
                )}


                {/* Footer Actions */}
                {!isExpanded && (
                  <div className="mt-5 flex items-center justify-between border-t border-white/20 pt-5 transition-all duration-500">
                    <span className="text-xs font-medium uppercase tracking-widest text-white/60">
                      {doc.year} · {doc.council}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setExpandedId(doc.id)}
                        className="inline-flex h-10 px-4 items-center justify-center rounded-full bg-black/40 border border-white/20 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md transition-colors hover:bg-black/60"
                      >
                        Ver más
                      </button>
                      <a
                        href={doc.url}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#1a1a1a] transition-transform hover:scale-110 shadow-lg shadow-black/20"
                        aria-label={doc.fileLabel}
                        onClick={(e) => e.stopPropagation()} // Prevent expand
                      >
                        <ActionIcon className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Right Side (Expanded Detail View OR Hero Preview) */}
              {isHero && !isExpanded ? (
                <div className="hidden md:flex flex-1 flex-col justify-end pb-5 items-end text-right">
                  <div className="max-w-md">
                     <p className="text-xl leading-relaxed text-[#e0dcd5] line-clamp-4">
                       {doc.description}
                     </p>
                  </div>
                </div>
              ) : null}

              {/* Right Side (Expanded Detail View) */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="flex-1 flex flex-col border-t md:border-t-0 md:border-l border-white/20 pt-6 md:pt-0 md:pl-8 lg:pl-10"
                  >
                    <div className="flex justify-between items-start mb-6">
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
                        onClick={() => setExpandedId(null)}
                        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-white/20"
                        aria-label="Cerrar detalles"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <p className="text-lg leading-relaxed text-[#e0dcd5] md:text-xl md:leading-relaxed">
                      {doc.description}
                    </p>

                    {/* Prominent Audio/Video / Action Embed Style */}
                    <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/50 mb-2">Recurso de Memoria</p>
                          <p className="text-white font-medium">{doc.fileLabel || "Explorar recurso"}</p>
                        </div>
                        
                        <a
                          href={doc.url}
                          className="group inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-bold text-[#1a1a1a] transition-all hover:scale-105"
                          style={{ color: accentColor === '#1a1a1a' ? '#000' : accentColor }}
                        >
                          <ActionIcon className="h-5 w-5 transition-transform group-hover:scale-110" />
                          <span>{doc.action === 'video' ? 'Reproducir Video' : doc.action === 'file' ? 'Descargar Archivo' : 'Abrir Enlace'}</span>
                        </a>
                      </div>
                      
                      {/* Fake Waveform for Media (just for the immersive feel) */}
                      {(doc.action === 'video' ||  doc.action === 'file') && (
                        <div className="mt-6 flex items-center gap-1.5 overflow-hidden">
                          {Array.from({ length: 60 }).map((_, i) => (
                            <div 
                              key={i} 
                              className="w-1.5 shrink-0 rounded-full bg-white/30" 
                              style={{ height: `${Math.max(4, Math.random() * 32)}px` }}
                            />
                          ))}
                        </div>
                )}
                    </div>

                    <div className="mt-auto pt-8 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setExpandedId(null)}
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
      })}
    </motion.div>
  );
}
