"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Headphones, Image as ImageIcon, FileText, MapPin, CheckCircle, X, Users } from "lucide-react";

export type StoryKind = "audio" | "video" | "testimony" | "photo";

export interface StoryRecord {
  id: string;
  kind: StoryKind;
  title: string;
  territory: string;
  community: string;
  contributor: string;
  year: number;
  description: string;
  duration?: string;
  tags: string[];
  visibility: "public" | "internal" | "sensitive";
  publicationAuthorized: boolean;
  authorizationLabel: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  relatedIds?: string[];
}

interface PiezasAutorizadasSectionProps {
  stories: StoryRecord[];
}

const getTypeIcon = (kind: StoryKind) => {
  switch (kind) {
    case "video": return <Play className="w-4 h-4" />;
    case "audio": return <Headphones className="w-4 h-4" />;
    case "photo": return <ImageIcon className="w-4 h-4" />;
    case "testimony": return <FileText className="w-4 h-4" />;
  }
};

const getTypeLabel = (kind: StoryKind) => {
  switch (kind) {
    case "video": return "Video";
    case "audio": return "Audio";
    case "photo": return "Foto";
    case "testimony": return "Testimonio";
  }
};

export function PiezasAutorizadasSection({ stories }: PiezasAutorizadasSectionProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<StoryKind | "all">("all");
  const [territoryFilter, setTerritoryFilter] = useState<string>("Todos");

  const territories = useMemo(() => {
    const t = new Set(stories.map(s => s.territory));
    return ["Todos", ...Array.from(t)];
  }, [stories]);

  const filteredPieces = useMemo(() => {
    return stories.filter((p) => {
      const matchType = typeFilter === "all" || p.kind === typeFilter;
      const matchTerritory = territoryFilter === "Todos" || p.territory === territoryFilter;
      return matchType && matchTerritory;
    });
  }, [stories, typeFilter, territoryFilter]);

  const selectedPiece = stories.find(s => s.id === selectedId);

  return (
    <section className="w-full py-6">
      <div className="mb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-4 max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-[color:var(--forest)] leading-tight">
            Memoria viva de los territorios
          </h2>
          <p className="text-[color:var(--muted-strong)] text-lg leading-relaxed">
            Explora testimonios, audios y relatos documentales. Solo se muestran piezas con autorización de publicación explícita avalada por las comunidades.
          </p>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            {(["all", "video", "audio", "testimony", "photo"] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setTypeFilter(cat);
                  setSelectedId(null);
                }}
                className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-all duration-200 border ${
                  typeFilter === cat
                    ? "bg-[color:var(--forest)] text-white border-[color:var(--forest)]"
                    : "bg-white text-[color:var(--muted-strong)] border-[color:var(--border-strong)] hover:border-[color:var(--forest)]"
                }`}
              >
                {cat === "all" ? "Todos los tipos" : getTypeLabel(cat)}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-[color:var(--muted-strong)]">
              Territorio:
            </span>
            <select
              value={territoryFilter}
              onChange={(e) => {
                setTerritoryFilter(e.target.value);
                setSelectedId(null);
              }}
              className="text-sm border border-[color:var(--border-strong)] rounded-full px-4 py-1.5 bg-white text-[color:var(--forest)] outline-none focus:border-[color:var(--gold-500)] focus:ring-1 focus:ring-[color:var(--gold-500)]"
            >
              {territories.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
        <AnimatePresence>
          {filteredPieces.map((piece) => {
            const isSelected = selectedId === piece.id;

            return (
              <motion.div
                layout
                key={piece.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  layout: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                onClick={() => {
                  if (!isSelected) {
                    setSelectedId(piece.id);
                    // scroll to top of this element smoothly after a short delay
                    setTimeout(() => {
                      const el = document.getElementById(`piece-${piece.id}`);
                      if (el) {
                        const y = el.getBoundingClientRect().top + window.scrollY - 100;
                        window.scrollTo({ top: y, behavior: 'smooth' });
                      }
                    }, 100);
                  }
                }}
                id={`piece-${piece.id}`}
                className={`
                  bg-white border border-[color:var(--border-soft)] rounded-[24px] overflow-hidden shadow-[var(--shadow-card)]
                  transition-shadow duration-300 relative z-10
                  ${isSelected ? "col-span-1 md:col-span-2 xl:col-span-3 cursor-default" : "cursor-pointer hover:shadow-lg hover:border-[color:var(--border-strong)] group"}
                `}
                style={isSelected ? { zIndex: 20 } : {}}
              >
                {isSelected ? (
                  // EXPANDED STATE
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    transition={{ delay: 0.15, duration: 0.3 }}
                    className="flex flex-col"
                  >
                    {/* Header / Media Area */}
                    <div className="relative w-full bg-[#1A1814] flex-shrink-0 flex items-center justify-center overflow-hidden">
                      {piece.kind === "video" ? (
                        <div className="w-full aspect-video max-h-[600px] relative">
                          {piece.mediaUrl ? (
                            <iframe 
                              src={piece.mediaUrl} 
                              className="absolute inset-0 w-full h-full" 
                              allowFullScreen 
                              title={piece.title}
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 text-white gap-4">
                              <Play className="w-12 h-12 text-[color:var(--gold-500)]" />
                              <span className="text-sm font-medium">Video no disponible</span>
                            </div>
                          )}
                        </div>
                      ) : piece.kind === "audio" ? (
                        <div className="w-full py-16 px-8 md:px-16 bg-gradient-to-b from-[#1A3629] to-[#0D1F0A] flex items-center justify-center relative">
                           {/* decorative background element */}
                           <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[color:var(--gold-500)] to-transparent pointer-events-none" />
                           <div className="w-full max-w-2xl flex flex-col items-center gap-8 relative z-10">
                             <div className="w-20 h-20 rounded-full bg-[color:var(--gold-500)] text-[color:var(--forest)] flex items-center justify-center shadow-2xl">
                               <Headphones className="w-10 h-10" />
                             </div>
                             {piece.mediaUrl ? (
                               <audio controls src={piece.mediaUrl} className="w-full" />
                             ) : (
                               <span className="text-sm font-medium text-white/70">Audio no disponible</span>
                             )}
                           </div>
                        </div>
                      ) : piece.kind === "photo" ? (
                        <div className="w-full py-12 bg-black flex items-center justify-center">
                          <img 
                            src={piece.mediaUrl || piece.thumbnailUrl} 
                            alt={piece.title} 
                            className="max-h-[600px] max-w-full object-contain"
                          />
                        </div>
                      ) : (
                        // testimony
                        <div className="w-full h-[200px] bg-[#2F855A]/10 flex items-center justify-center">
                          <FileText className="w-16 h-16 text-[#2F855A] opacity-20" />
                        </div>
                      )}
                      
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedId(null); }}
                        className="absolute top-4 right-4 md:top-6 md:right-6 p-2 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-colors z-20"
                        aria-label="Cerrar reproductor"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Context Area */}
                    <div className="p-6 md:p-10 xl:px-16 flex flex-col xl:flex-row gap-10 xl:gap-16 bg-[color:var(--surface)]">
                      <div className="flex-1 space-y-6">
                        <div>
                          <div className="flex flex-wrap items-center gap-3 mb-4">
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-[color:var(--border-soft)] rounded-md text-[color:var(--muted-strong)] text-xs font-semibold uppercase tracking-wider shadow-sm">
                              {getTypeIcon(piece.kind)}
                              <span>{getTypeLabel(piece.kind)}</span>
                            </div>
                            <span className="text-sm font-medium text-[color:var(--muted-strong)]">{piece.year}</span>
                            {piece.duration && (
                              <>
                                <span className="text-[color:var(--border-strong)]">•</span>
                                <span className="text-sm font-medium text-[color:var(--muted-strong)]">{piece.duration}</span>
                              </>
                            )}
                          </div>
                          <h3 className="text-3xl md:text-4xl font-bold text-[color:var(--forest)] mb-4 leading-tight font-display">
                            {piece.title}
                          </h3>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm font-medium text-[color:var(--forest)] mb-6">
                            <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-[color:var(--border-soft)]">
                              <Users className="w-4 h-4 text-[color:var(--gold-700)]" /> 
                              {piece.contributor}
                            </span>
                            <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-[color:var(--border-soft)]">
                              <MapPin className="w-4 h-4 text-[color:var(--gold-700)]" /> 
                              {piece.territory} ({piece.community})
                            </span>
                          </div>
                          <p className="text-[color:var(--muted-strong)] text-[17px] leading-relaxed max-w-3xl">
                            {piece.description}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-2">
                          {piece.tags.map((tag) => (
                            <span key={tag} className="px-3 py-1.5 bg-[color:var(--page)] border border-[color:var(--border-strong)] rounded-full text-[color:var(--muted-strong)] text-xs font-semibold uppercase tracking-wider">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="w-full xl:w-[320px] flex-shrink-0">
                        <div className="p-6 bg-[#2F855A]/5 border border-[#2F855A]/20 rounded-[20px] flex flex-col gap-4">
                          <div className="flex items-start gap-3 text-[color:var(--success-strong)]">
                            <CheckCircle className="w-6 h-6 shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-bold text-[15px] leading-tight mb-1">Difusión Autorizada</h4>
                              <p className="text-xs text-[color:var(--success-strong)] opacity-80 font-medium">
                                {piece.authorizationLabel}
                              </p>
                            </div>
                          </div>
                          <div className="h-[1px] w-full bg-[#2F855A]/10" />
                          <p className="text-[13px] text-[color:var(--muted-strong)] leading-relaxed font-medium">
                            Esta pieza cuenta con autorización de difusión educativa y cultural. Se prohíbe estrictamente su uso comercial, modificación o apropiación indebida sin consentimiento previo de la comunidad.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Related Pieces (mini cards) */}
                    {(piece.relatedIds && piece.relatedIds.length > 0) && (
                      <div className="bg-white p-6 md:p-10 border-t border-[color:var(--border-soft)] rounded-b-[24px]">
                        <h4 className="text-[15px] font-bold uppercase tracking-widest text-[color:var(--gold-700)] mb-6">
                          Voces relacionadas
                        </h4>
                        <div className="flex overflow-x-auto pb-4 gap-4 snap-x hide-scrollbar">
                          {piece.relatedIds.map((relatedId) => {
                            const related = stories.find(s => s.id === relatedId);
                            if (!related) return null;
                            return (
                              <div 
                                key={related.id} 
                                className="min-w-[280px] max-w-[280px] p-4 border border-[color:var(--border-soft)] rounded-[16px] flex gap-4 items-center snap-start hover:bg-[color:var(--surface)] hover:border-[color:var(--border-strong)] cursor-pointer transition-all duration-200" 
                                onClick={(e) => { 
                                  e.stopPropagation(); 
                                  setSelectedId(related.id); 
                                  const el = document.getElementById(`piece-${related.id}`);
                                  if (el) {
                                    const y = el.getBoundingClientRect().top + window.scrollY - 100;
                                    window.scrollTo({ top: y, behavior: 'smooth' });
                                  }
                                }}
                              >
                                <div className="w-16 h-16 rounded-[12px] overflow-hidden flex-shrink-0 bg-[color:var(--page)] border border-[color:var(--border-soft)]">
                                  {related.thumbnailUrl ? (
                                    <img src={related.thumbnailUrl} alt={related.title} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      {getTypeIcon(related.kind)}
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-semibold text-[color:var(--muted)] mb-1">
                                    {getTypeIcon(related.kind)}
                                    <span>{getTypeLabel(related.kind)}</span>
                                  </div>
                                  <h5 className="font-bold text-sm text-[color:var(--forest)] truncate">{related.title}</h5>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  // DEFAULT STATE (Grid Card)
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    transition={{ delay: 0.1, duration: 0.2 }}
                    className="flex flex-col h-full"
                  >
                    <div className="relative w-full aspect-[16/10] overflow-hidden bg-[color:var(--page)] border-b border-[color:var(--border-soft)]">
                      {piece.thumbnailUrl ? (
                        <motion.img 
                          src={piece.thumbnailUrl} 
                          alt={piece.title} 
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.05 }}
                          transition={{ type: "spring", stiffness: 200, damping: 30 }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center opacity-30">
                          {getTypeIcon(piece.kind)}
                        </div>
                      )}
                      
                      {/* Inner dark gradient for text readability if we wanted text over image, but we put it below. Just a slight vignette. */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Type badge on image */}
                      <div className="absolute top-4 left-4 flex items-center gap-1.5 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-[8px] text-[color:var(--forest)] text-[10px] font-bold uppercase tracking-wider shadow-sm">
                        {getTypeIcon(piece.kind)}
                        <span>{getTypeLabel(piece.kind)}</span>
                      </div>

                      {/* Video/Audio play indicator overlay */}
                      {(piece.kind === "video" || piece.kind === "audio") && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm text-[color:var(--forest)] flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                            {piece.kind === "video" ? <Play className="w-5 h-5 ml-1" /> : <Headphones className="w-5 h-5" />}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6 flex flex-col flex-1 gap-3">
                      <div className="flex items-center gap-1.5 text-[color:var(--success-strong)] text-[10px] font-bold uppercase tracking-wider">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Difusión Autorizada</span>
                      </div>
                      
                      <div className="flex-1 mt-1">
                        <h3 className="text-[20px] font-bold text-[color:var(--forest)] line-clamp-2 mb-3 font-display leading-snug group-hover:text-[color:var(--gold-700)] transition-colors">
                          {piece.title}
                        </h3>
                        <p className="text-sm text-[color:var(--muted-strong)] flex items-center gap-1.5 font-medium">
                          <MapPin className="w-4 h-4 text-[color:var(--gold-700)] shrink-0" /> 
                          <span className="truncate">{piece.territory}</span>
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {filteredPieces.length === 0 && (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-center bg-[color:var(--page)] rounded-[24px] border border-[color:var(--border-soft)] border-dashed">
            <p className="text-[color:var(--muted-strong)] text-lg font-medium">
              No se encontraron piezas autorizadas con estos filtros.
            </p>
            <button 
              onClick={() => { setTypeFilter("all"); setTerritoryFilter("Todos"); }}
              className="mt-4 text-sm font-semibold text-[color:var(--gold-700)] hover:underline"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>
      
      {/* Hide scrollbar global style for this component */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </section>
  );
}
