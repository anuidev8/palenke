"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Download, ExternalLink, Lock, PlayCircle, ChevronDown, ChevronUp } from "lucide-react";
import type { DocumentRecord, ViewerRole } from "@/lib/mock-data";
import { canDownloadDocument } from "@/lib/mock-data";

const typeMeta: Record<
  string,
  {
    eyebrow: string;
    accent: string;
    soft: string;
  }
> = {
  Constitución: { eyebrow: "Base estructural", accent: "#d48a1f", soft: "#fff0c8" },
  Ley: { eyebrow: "Derechos colectivos", accent: "#2e7d32", soft: "#dff3e0" },
  Decreto: { eyebrow: "Desarrollo reglamentario", accent: "#1565c0", soft: "#e4f1fd" },
  Jurisprudencia: { eyebrow: "Sentencias estructurales", accent: "#b65c2d", soft: "#fde9df" },
  "Instrumento internacional": { eyebrow: "Marco global", accent: "#00796b", soft: "#def5f1" },
  "Política pública": { eyebrow: "Incidencia institucional", accent: "#6d4c41", soft: "#efe3dc" },
  "Instancia oficial": { eyebrow: "Mecanismos oficiales", accent: "#7b6d1f", soft: "#f7f0cf" },
  "Reglamento interno": { eyebrow: "Normas internas", accent: "#2e7d32", soft: "#dff3e0" },
  "Plan de manejo": { eyebrow: "Ordenamiento territorial", accent: "#1565c0", soft: "#e4f1fd" },
  "Plan de etnodesarrollo": { eyebrow: "Planeación propia", accent: "#f57f17", soft: "#fff1d8" },
  "Ruta de litigio": { eyebrow: "Defensa judicial", accent: "#d32f2f", soft: "#fde2e2" },
  Cartilla: { eyebrow: "Material comunitario", accent: "#795548", soft: "#efe6e1" },
  Video: { eyebrow: "Archivo audiovisual", accent: "#6a1b9a", soft: "#f0e1f8" },
  Pronunciamiento: { eyebrow: "Posición política", accent: "#2e7d32", soft: "#dff3e0" },
  Estudio: { eyebrow: "Análisis técnico", accent: "#455a64", soft: "#ebf0f2" },
  Informe: { eyebrow: "Seguimiento", accent: "#546e7a", soft: "#edf1f3" },
  Investigación: { eyebrow: "Memoria viva", accent: "#00897b", soft: "#dff5f0" },
  Cultural: { eyebrow: "Patrimonio vivo", accent: "#ad7c15", soft: "#fff2d6" },
};

function getCardMeta(doc: DocumentRecord) {
  return typeMeta[doc.type] ?? {
    eyebrow: doc.section,
    accent: "#7a756e",
    soft: "#f3efea",
  };
}

function getDocumentAction(doc: DocumentRecord) {
  if (doc.action === "video") {
    return {
      href: doc.url,
      label: doc.fileLabel || "Ver video",
      icon: PlayCircle,
      external: true,
    };
  }

  if (doc.action === "file") {
    return {
      href: doc.url,
      label: doc.fileLabel || "Descargar archivo",
      icon: Download,
      external: false,
    };
  }

  return {
    href: doc.url,
    label: doc.fileLabel || "Abrir recurso",
    icon: ArrowRight,
    external: doc.url.startsWith("http"),
  };
}

export default function BibliotecaDocGrid({
  docs,
  role = "public",
}: {
  docs: DocumentRecord[];
  role?: ViewerRole;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <motion.div
      layout
      className="grid gap-4 items-start md:grid-cols-2 xl:grid-cols-3"
      style={{ contentVisibility: "auto" }}
    >
      {docs.map((doc, index) => {
        const meta = getCardMeta(doc);
        const action = getDocumentAction(doc);
        const ActionIcon = action.icon;
        const isFeatured = index % 6 === 0;
        const isExpanded = expandedId === doc.id;
        const isGated = !canDownloadDocument(role, doc.visibility);

        return (
          <motion.article
            layout
            key={doc.id}
            initial={{ borderRadius: 30 }}
            className={`group relative overflow-hidden border border-[#ebe4db] p-5 transition-shadow duration-300 hover:shadow-[0_24px_60px_rgba(0,0,0,0.08)] ${isExpanded ? "md:col-span-2 xl:col-span-3" : ""}`}
            style={{ backgroundColor: isFeatured ? meta.soft : "white" }}
          >
            <div
              aria-hidden="true"
              className="absolute right-2 top-2 h-24 w-24 rounded-full blur-3xl transition duration-300 group-hover:scale-125 pointer-events-none"
              style={{ background: `${meta.accent}22` }}
            />

            <motion.div layout="position" className={`relative flex h-full min-h-[280px] ${isExpanded ? "flex-col md:flex-row md:gap-8 xl:gap-12" : "flex-col"}`}>
              
              {/* Left Column (or top on mobile) */}
              <motion.div layout="position" className={`flex flex-col ${isExpanded ? "md:w-1/3 xl:w-1/4" : "flex-1"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    <span
                      className="rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]"
                      style={{ backgroundColor: "rgba(255,255,255,0.78)", color: meta.accent }}
                    >
                      {doc.type}
                    </span>
                    {doc.visibility !== "public" ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-[#e8dfd3] bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7a756e]">
                        <Lock className="h-3 w-3" aria-hidden="true" />
                        Interno
                      </span>
                    ) : null}
                  </div>

                  {!isExpanded && (
                    <span className="rounded-full border border-[#ece5dc] bg-white/88 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#4a4540]">
                      {doc.territory}
                    </span>
                  )}
                </div>

                <motion.p layout="position" className="mt-4 text-xs leading-5 text-[#7a756e]">
                  {doc.year} · {doc.council}
                </motion.p>

                <motion.h3
                  layout="position"
                  className={`mt-4 font-display text-[1.85rem] leading-[1.08] tracking-[-0.03em] text-[#1a1a1a] ${isExpanded ? "text-4xl" : "line-clamp-3"}`}
                >
                  {doc.title}
                </motion.h3>

                {!isExpanded && (
                  <motion.p layout="position" className="mt-4 text-[15px] leading-7 text-[#4a4540] line-clamp-3">
                    {doc.description}
                  </motion.p>
                )}

                {/* Footer in non-expanded mode */}
                {!isExpanded && (
                  <div className="mt-auto pt-6 flex flex-col gap-4">
                    <div className="flex flex-wrap gap-2">
                      {doc.keywords.slice(0, 3).map((keyword) => (
                        <span
                          key={keyword}
                          className="rounded-full border border-[#ece5dc] bg-white/88 px-3 py-1 text-xs font-medium text-[#4a4540]"
                        >
                          {keyword}
                        </span>
                      ))}
                      {doc.keywords.length > 3 && (
                        <span className="rounded-full border border-[#ece5dc] bg-white/88 px-3 py-1 text-xs font-medium text-[#4a4540]">
                          +{doc.keywords.length - 3}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-end justify-between gap-3 border-t border-[#ebe4db] pt-4">
                      <div>
                        <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: meta.accent }}>
                          {meta.eyebrow}
                        </p>
                        {isGated ? (
                          <a
                            href={`/login?redirect=/biblioteca&message=internal`}
                            className="inline-flex items-center gap-2 text-base font-semibold transition hover:gap-3 text-[#7a756e]"
                          >
                            <Lock className="h-4 w-4" aria-hidden="true" />
                            Iniciar sesión para acceder
                          </a>
                        ) : (
                          <a
                            href={action.href}
                            {...(action.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                            className="inline-flex items-center gap-2 text-base font-semibold transition hover:gap-3"
                            style={{ color: meta.accent }}
                          >
                            {action.label}
                            <ActionIcon className="h-4 w-4" aria-hidden="true" />
                          </a>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => setExpandedId(doc.id)}
                        className="inline-flex shrink-0 items-center justify-center h-10 w-10 rounded-full border border-[#e8dfd3] bg-white/92 text-[#4a4540] transition hover:bg-[#f6f0e8] hover:scale-105 active:scale-95"
                        aria-expanded={false}
                        aria-label="Expandir tarjeta"
                      >
                        <ChevronDown className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Right Column (only visible when expanded) */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col flex-1 mt-6 md:mt-0 pt-6 md:pt-0 border-t md:border-t-0 md:border-l border-[#ebe4db] md:pl-8 xl:pl-12"
                  >
                    <p className="text-[17px] leading-relaxed text-[#4a4540]">
                      {doc.description}
                    </p>

                    <div className="mt-8 flex flex-wrap gap-2">
                      {doc.keywords.map((keyword) => (
                        <span
                          key={keyword}
                          className="rounded-full border border-[#ece5dc] bg-white/88 px-3 py-1 text-xs font-medium text-[#4a4540]"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>

                    <div className="mt-8 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl bg-black/5 px-5 py-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7a756e]">
                          Categoría
                        </p>
                        <p className="mt-1 text-base font-medium text-[#1a1a1a]">{meta.eyebrow}</p>
                      </div>
                      <div className="rounded-2xl bg-black/5 px-5 py-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7a756e]">
                          Ubicación
                        </p>
                        <p className="mt-1 text-base font-medium text-[#1a1a1a]">
                          {doc.department} · {doc.municipality}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-black/5 px-5 py-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7a756e]">
                          Territorio
                        </p>
                        <p className="mt-1 text-base font-medium text-[#1a1a1a]">
                          {doc.territory}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-black/5 px-5 py-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7a756e]">
                          Acción principal
                        </p>
                        <div className="mt-1">
                          {isGated ? (
                            <a
                              href={`/login?redirect=/biblioteca&message=internal`}
                              className="inline-flex items-center gap-2 text-base font-semibold text-[#7a756e] transition hover:gap-3"
                            >
                              <Lock className="h-4 w-4" aria-hidden="true" />
                              Iniciar sesión para acceder
                            </a>
                          ) : (
                            <a
                              href={action.href}
                              {...(action.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                              className="inline-flex items-center gap-2 text-base font-semibold transition hover:gap-3"
                              style={{ color: meta.accent }}
                            >
                              {action.label}
                              <ActionIcon className="h-4 w-4" aria-hidden="true" />
                            </a>
                          )}
                        </div>
                      </div>
                      {doc.sourceUrl && doc.sourceUrl !== action.href ? (
                        <div className="rounded-2xl bg-black/5 px-5 py-4">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7a756e]">
                            Fuente oficial
                          </p>
                          <div className="mt-1">
                            <a
                              href={doc.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-base font-semibold text-[#1565c0] transition hover:gap-3"
                            >
                              Abrir fuente oficial
                              <ExternalLink className="h-4 w-4" aria-hidden="true" />
                            </a>
                          </div>
                        </div>
                      ) : null}
                    </div>

                    <div className="mt-auto pt-8 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setExpandedId(null)}
                        className="inline-flex items-center gap-2 rounded-full border border-[#e8dfd3] bg-white px-5 py-2.5 text-sm font-semibold text-[#4a4540] transition hover:bg-[#f6f0e8] hover:scale-105 active:scale-95 shadow-sm"
                        aria-expanded={true}
                        aria-label="Contraer tarjeta"
                      >
                        Cerrar detalle
                        <ChevronUp className="h-4 w-4" aria-hidden="true" />
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
