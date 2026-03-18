"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Download, ExternalLink, FileText, Lock } from "lucide-react";
import type { DocumentRecord } from "@/lib/mock-data";

interface ExpandableDocTableProps {
  docs: DocumentRecord[];
}

export function ExpandableDocTable({ docs }: ExpandableDocTableProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  function toggle(id: string) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="overflow-hidden rounded-[28px] border border-[#e8dfd3] bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] divide-y divide-[#e8dfd3] text-left text-sm">
          <thead>
            <tr className="bg-[#1a1a1a]">
              {["Título", "Tipo", "Territorio", "Año", "Etiquetas", "Acción"].map((h) => (
                <th
                  key={h}
                  className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-white"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e8dfd3]">
            {docs.map((doc, i) => {
              const isOpen = openId === doc.id;
              return (
                <>
                  {/* ── Main row ── */}
                  <motion.tr
                    key={doc.id}
                    layout="position"
                    onClick={() => toggle(doc.id)}
                    className={`cursor-pointer align-top transition-colors ${
                      isOpen
                        ? "bg-[#f0eae0]"
                        : i % 2 === 0
                        ? "bg-white hover:bg-[#f8f5f2]"
                        : "bg-[#fafaf8] hover:bg-[#f0eae0]"
                    }`}
                    aria-expanded={isOpen}
                  >
                    {/* Título */}
                    <td className="max-w-[260px] px-5 py-4">
                      <div className="flex items-start gap-2">
                        {doc.visibility !== "public" ? (
                          <Lock
                            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#7a756e]"
                            aria-label="Acceso restringido"
                          />
                        ) : null}
                        <span className="line-clamp-2 font-medium text-[#1a1a1a]">{doc.title}</span>
                        <motion.span
                          className="ml-auto mt-0.5 shrink-0 text-[#7a756e]"
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ type: "spring", stiffness: 400, damping: 28 }}
                        >
                          <ChevronDown className="h-4 w-4" aria-hidden="true" />
                        </motion.span>
                      </div>
                      <p className="mt-1 text-xs text-[#7a756e]">{doc.section}</p>
                    </td>

                    {/* Tipo */}
                    <td className="whitespace-nowrap px-5 py-4 text-[#4a4540]">{doc.type}</td>

                    {/* Territorio */}
                    <td className="whitespace-nowrap px-5 py-4 text-[#4a4540]">{doc.territory}</td>

                    {/* Año */}
                    <td className="whitespace-nowrap px-5 py-4 text-[#4a4540]">{doc.year}</td>

                    {/* Etiquetas */}
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1">
                        {doc.keywords.slice(0, 2).map((kw) => (
                          <span
                            key={kw}
                            className="inline-flex items-center rounded-full border border-[#e8dfd3] bg-white px-2 py-0.5 text-[10px] font-medium text-[#4a4540]"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Acción — collapsed hint */}
                    <td className="whitespace-nowrap px-5 py-4 text-xs text-[#7a756e]">
                      {doc.visibility === "sensitive" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fddede] px-3 py-1.5 text-xs font-semibold text-[#d32f2f]">
                          <Lock className="h-3 w-3" aria-hidden="true" />
                          Restringido
                        </span>
                      ) : (
                        <span className="text-[#7a756e]">
                          {isOpen ? "Cerrar ↑" : "Ver recursos ↓"}
                        </span>
                      )}
                    </td>
                  </motion.tr>

                  {/* ── Expanded row ── */}
                  <tr key={`${doc.id}-expanded`} className="bg-[#f0eae0]">
                    <td colSpan={6} className="px-0 py-0">
                      <AnimatePresence initial={false}>
                        {isOpen && doc.visibility !== "sensitive" && (
                          <motion.div
                            key="expand"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-start sm:gap-8">
                              {/* Description */}
                              <div className="flex-1">
                                <div className="mb-2 flex items-center gap-2">
                                  <FileText
                                    className="h-4 w-4 text-[#2e7d32]"
                                    aria-hidden="true"
                                  />
                                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#4a4540]">
                                    Descripción
                                  </span>
                                </div>
                                <p className="text-sm leading-6 text-[#1a1a1a]">
                                  {doc.description}
                                </p>
                                {doc.riskFlag ? (
                                  <p className="mt-2 rounded-lg bg-[#fff3cd] px-3 py-2 text-xs font-medium text-[#f57f17]">
                                    ⚠ Este documento contiene información sensible sobre situaciones de riesgo territorial.
                                  </p>
                                ) : null}
                              </div>

                              {/* Actions */}
                              <div className="flex shrink-0 flex-col gap-2 sm:items-end">
                                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#4a4540]">
                                  Recursos
                                </span>
                                {doc.action === "file" ? (
                                  <a
                                    href={doc.url}
                                    download
                                    onClick={(e) => e.stopPropagation()}
                                    className="inline-flex items-center gap-1.5 rounded-full bg-[#2e7d32] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#1b5e20]"
                                  >
                                    <Download className="h-3.5 w-3.5" aria-hidden="true" />
                                    Descargar PDF
                                    {doc.fileSize ? (
                                      <span className="ml-1 opacity-70">{doc.fileSize}</span>
                                    ) : null}
                                  </a>
                                ) : null}

                                {doc.sourceUrl ? (
                                  <a
                                    href={doc.sourceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="inline-flex items-center gap-1.5 rounded-full border border-[#1a1a1a] bg-white px-4 py-2 text-xs font-semibold text-[#1a1a1a] transition hover:bg-[#f0eae0]"
                                  >
                                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                                    Fuente oficial
                                  </a>
                                ) : doc.action === "external" ? (
                                  <a
                                    href={doc.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="inline-flex items-center gap-1.5 rounded-full border border-[#1a1a1a] bg-white px-4 py-2 text-xs font-semibold text-[#1a1a1a] transition hover:bg-[#f0eae0]"
                                  >
                                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                                    {doc.fileLabel}
                                  </a>
                                ) : null}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </td>
                  </tr>
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
