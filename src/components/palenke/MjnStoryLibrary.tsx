"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Camera, Headphones, MapPin, PlayCircle, Quote, ShieldCheck, Tags, Users, X } from "lucide-react";
import type { StoryKind, StoryRecord } from "@/lib/mock-data";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const INITIAL_VISIBLE_STORIES = 6;
const STORY_INCREMENT = 4;

const KIND_META: Record<StoryKind, { label: string; icon: LucideIcon }> = {
  audio: { label: "Audio", icon: Headphones },
  video: { label: "Video", icon: PlayCircle },
  testimony: { label: "Testimonio", icon: Quote },
  photo: { label: "Foto", icon: Camera },
};

type KindFilter = StoryKind | "all";

export default function MjnStoryLibrary({ stories }: { stories: StoryRecord[] }) {
  const shouldReduceMotion = useReducedMotion();
  const [territoryFilter, setTerritoryFilter] = useState("all");
  const [kindFilter, setKindFilter] = useState<KindFilter>("all");
  const [tagFilter, setTagFilter] = useState("all");
  const [visibleStoriesCount, setVisibleStoriesCount] = useState(INITIAL_VISIBLE_STORIES);
  const [activeStoryId, setActiveStoryId] = useState<string | null>(null);

  const territories = useMemo(
    () => Array.from(new Set(stories.map((story) => story.territory))).toSorted((a, b) => a.localeCompare(b)),
    [stories],
  );

  const tags = useMemo(
    () => Array.from(new Set(stories.flatMap((story) => story.tags))).toSorted((a, b) => a.localeCompare(b)),
    [stories],
  );

  const storiesById = useMemo(() => new Map(stories.map((story) => [story.id, story])), [stories]);

  const filteredStories = useMemo(() => {
    return stories.filter((story) => {
      if (territoryFilter !== "all" && story.territory !== territoryFilter) {
        return false;
      }
      if (kindFilter !== "all" && story.kind !== kindFilter) {
        return false;
      }
      if (tagFilter !== "all" && !story.tags.includes(tagFilter)) {
        return false;
      }
      return true;
    });
  }, [stories, territoryFilter, kindFilter, tagFilter]);

  const visibleStories = filteredStories.slice(0, visibleStoriesCount);
  const hasMoreStories = filteredStories.length > visibleStoriesCount;
  const hasActiveFilters = territoryFilter !== "all" || kindFilter !== "all" || tagFilter !== "all";
  const activeStory = activeStoryId ? storiesById.get(activeStoryId) ?? null : null;
  const activeStoryInFilter = activeStory
    ? filteredStories.some((story) => story.id === activeStory.id)
    : false;
  const overlayStory = activeStoryInFilter ? activeStory : null;

  const relatedStories = useMemo(() => {
    if (!activeStory) {
      return [];
    }

    const linkedStories = activeStory.relatedIds
      .map((relatedId) => storiesById.get(relatedId))
      .filter((story): story is StoryRecord => Boolean(story) && story!.id !== activeStory.id);

    const fallbackStories = stories.filter(
      (story) => story.id !== activeStory.id && !activeStory.relatedIds.includes(story.id),
    );

    const uniqueStories = new Map<string, StoryRecord>();
    for (const story of [...linkedStories, ...fallbackStories]) {
      if (!uniqueStories.has(story.id)) {
        uniqueStories.set(story.id, story);
      }
    }

    return Array.from(uniqueStories.values()).slice(0, 4);
  }, [activeStory, stories, storiesById]);

  useEffect(() => {
    if (!overlayStory) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveStoryId(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [overlayStory]);

  const animationDuration = shouldReduceMotion ? 0 : 0.35;

  return (
    <div className="mt-8 space-y-6">
      <div className="rounded-[28px] border border-[color:var(--border-soft)] bg-white/80 p-5 backdrop-blur">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="grid gap-4 md:grid-cols-3">
            <label className="grid gap-2 text-sm font-medium text-[color:var(--forest)]">
              <span>Territorio</span>
              <select
                value={territoryFilter}
                onChange={(event) => {
                  setTerritoryFilter(event.target.value);
                  setVisibleStoriesCount(INITIAL_VISIBLE_STORIES);
                  setActiveStoryId(null);
                }}
                className="input-shell"
              >
                <option value="all">Todos</option>
                {territories.map((territory) => (
                  <option key={territory} value={territory}>
                    {territory}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm font-medium text-[color:var(--forest)]">
              <span>Tipo de pieza</span>
              <select
                value={kindFilter}
                onChange={(event) => {
                  setKindFilter(event.target.value as KindFilter);
                  setVisibleStoriesCount(INITIAL_VISIBLE_STORIES);
                  setActiveStoryId(null);
                }}
                className="input-shell"
              >
                <option value="all">Todos</option>
                {Object.entries(KIND_META).map(([kind, meta]) => (
                  <option key={kind} value={kind}>
                    {meta.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm font-medium text-[color:var(--forest)]">
              <span>Etiqueta</span>
              <select
                value={tagFilter}
                onChange={(event) => {
                  setTagFilter(event.target.value);
                  setVisibleStoriesCount(INITIAL_VISIBLE_STORIES);
                  setActiveStoryId(null);
                }}
                className="input-shell"
              >
                <option value="all">Todas</option>
                {tags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {hasActiveFilters ? (
            <button
              type="button"
              className="button-ghost h-fit w-fit"
              onClick={() => {
                setTerritoryFilter("all");
                setKindFilter("all");
                setTagFilter("all");
                setVisibleStoriesCount(INITIAL_VISIBLE_STORIES);
                setActiveStoryId(null);
              }}
            >
              Limpiar filtros
            </button>
          ) : null}
        </div>
      </div>

      {filteredStories.length === 0 ? (
        <div className="surface-card text-center">
          <h3 className="font-display text-2xl text-[color:var(--forest)]">No hay piezas con esos filtros</h3>
          <p className="mt-2 text-sm text-[color:var(--muted-strong)]">
            Ajusta territorio, tipo o etiqueta para revisar más contenidos autorizados.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {visibleStories.map((story, index) => {
              const meta = KIND_META[story.kind];
              const Icon = meta.icon;

              return (
                <motion.button
                  key={story.id}
                  type="button"
                  onClick={() => setActiveStoryId(story.id)}
                  aria-label={`Abrir pieza: ${story.title}`}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
                  whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: animationDuration, ease: EASE, delay: index * 0.03 }}
                  whileHover={shouldReduceMotion ? {} : { y: -3 }}
                  className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-[color:var(--border-soft)] bg-[color:var(--surface)] text-left shadow-[0_16px_40px_rgba(13,31,10,0.08)]"
                >
                  <div className="relative h-44 border-b border-[color:var(--border-soft)]">
                    {story.thumbnailUrl ? (
                      <img src={story.thumbnailUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full bg-[color:var(--sand-strong)]" />
                    )}
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,31,10,0.06),rgba(13,31,10,0.58))]" />
                    <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-black/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[color:var(--sand)]">
                      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                      {meta.label}
                    </span>
                    <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full border border-white/25 bg-black/20 px-3 py-1 text-[11px] font-semibold text-[color:var(--sand)]">
                      <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                      Autorizada
                    </span>
                    <p className="absolute bottom-4 left-4 right-4 text-xs font-medium text-[color:var(--sand)]/95">
                      {story.community}
                    </p>
                  </div>

                  <div className="flex h-full flex-col gap-3 p-5">
                    <h3 className="font-display text-xl leading-snug text-[color:var(--forest)]">{story.title}</h3>
                    <p className="text-sm text-[color:var(--muted-strong)]">
                      {meta.label} · {story.territory}
                    </p>
                    <p className="text-sm leading-6 text-[color:var(--muted-strong)]">{story.description}</p>
                    <div className="mt-auto flex items-center justify-between gap-3 border-t border-[color:var(--border-soft)] pt-4 text-xs text-[color:var(--muted)]">
                      <span>{story.year}</span>
                      <span>{story.duration ?? "Sin duración registrada"}</span>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {hasMoreStories ? (
              <button
                type="button"
                className="button-secondary"
                onClick={() => setVisibleStoriesCount((previous) => previous + STORY_INCREMENT)}
              >
                Ver más piezas
              </button>
            ) : null}
            <p className="text-sm text-[color:var(--muted-strong)]">
              Esta biblioteca se actualiza de forma continua con nuevas piezas autorizadas.
            </p>
          </div>
        </>
      )}

      <AnimatePresence>
        {overlayStory ? (
          <motion.div
            className="fixed inset-0 z-50 bg-[color:rgb(13_31_10_/_0.62)] px-4 py-6 sm:px-8 sm:py-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: animationDuration, ease: EASE }}
            onClick={() => setActiveStoryId(null)}
          >
            <div className="mx-auto flex h-full max-w-6xl items-end sm:items-center">
              <motion.article
                role="dialog"
                aria-modal="true"
                aria-label={`Detalle de pieza: ${overlayStory.title}`}
                onClick={(event) => event.stopPropagation()}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 28, scale: 0.98 }}
                animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.99 }}
                transition={{ duration: animationDuration, ease: EASE }}
                className="relative max-h-full w-full overflow-y-auto rounded-[30px] border border-[color:var(--border-soft)] bg-[color:var(--surface)] shadow-[0_35px_80px_rgba(13,31,10,0.35)]"
              >
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[color:var(--border-soft)] bg-[color:rgb(255_249_236_/_0.94)] px-5 py-4 backdrop-blur">
                  <p className="text-sm font-medium text-[color:var(--muted-strong)]">
                    {KIND_META[overlayStory.kind].label} · {overlayStory.territory}
                  </p>
                  <button
                    type="button"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--border-strong)] bg-white text-[color:var(--forest)]"
                    onClick={() => setActiveStoryId(null)}
                    aria-label="Cerrar detalle"
                  >
                    <X className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>

                <div className="grid gap-8 p-5 lg:grid-cols-[1.08fr_0.92fr] lg:p-8">
                  <section className="space-y-4">
                    <h3 className="font-display text-3xl leading-tight text-[color:var(--forest)]">{overlayStory.title}</h3>
                    <StoryMedia story={overlayStory} />
                    {overlayStory.duration ? <span className="chip">{overlayStory.duration}</span> : null}
                  </section>

                  <aside className="space-y-5">
                    <p className="text-sm leading-7 text-[color:var(--muted-strong)]">{overlayStory.description}</p>

                    <dl className="grid gap-3 rounded-[24px] border border-[color:var(--border-soft)] bg-white p-4 text-sm">
                      <div className="flex items-start gap-2 text-[color:var(--forest)]">
                        <MapPin className="mt-0.5 h-4 w-4" aria-hidden="true" />
                        <div>
                          <dt className="font-semibold">Territorio y comunidad</dt>
                          <dd className="text-[color:var(--muted-strong)]">
                            {overlayStory.territory} · {overlayStory.community}
                          </dd>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 text-[color:var(--forest)]">
                        <Users className="mt-0.5 h-4 w-4" aria-hidden="true" />
                        <div>
                          <dt className="font-semibold">Persona / colectivo</dt>
                          <dd className="text-[color:var(--muted-strong)]">{overlayStory.contributor}</dd>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 text-[color:var(--forest)]">
                        <Tags className="mt-0.5 h-4 w-4" aria-hidden="true" />
                        <div>
                          <dt className="font-semibold">Etiquetas</dt>
                          <dd className="mt-1 flex flex-wrap gap-2">
                            {overlayStory.tags.map((tag) => (
                              <span key={tag} className="chip">
                                {tag}
                              </span>
                            ))}
                          </dd>
                        </div>
                      </div>
                    </dl>

                    <div className="rounded-[24px] border border-[color:var(--border-soft)] bg-[color:var(--sand)] p-4 text-sm text-[color:var(--muted-strong)]">
                      <p className="inline-flex items-center gap-2 font-semibold text-[color:var(--forest)]">
                        <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                        Autorización de publicación
                      </p>
                      <p className="mt-2">{overlayStory.authorizationLabel}</p>
                    </div>
                  </aside>
                </div>

                <div className="border-t border-[color:var(--border-soft)] px-5 py-6 lg:px-8">
                  <h4 className="font-display text-2xl text-[color:var(--forest)]">Piezas relacionadas</h4>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {relatedStories.map((story) => {
                      const icon = KIND_META[story.kind].icon;
                      const Icon = icon;
                      return (
                        <button
                          key={story.id}
                          type="button"
                          onClick={() => setActiveStoryId(story.id)}
                          className="overflow-hidden rounded-[18px] border border-[color:var(--border-soft)] bg-white text-left"
                        >
                          <div className="h-24 border-b border-[color:var(--border-soft)]">
                            {story.thumbnailUrl ? (
                              <img src={story.thumbnailUrl} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <div className="h-full w-full bg-[color:var(--sand-strong)]" />
                            )}
                          </div>
                          <div className="grid gap-1 p-3">
                            <p className="line-clamp-2 text-sm font-semibold text-[color:var(--forest)]">{story.title}</p>
                            <p className="inline-flex items-center gap-1 text-xs text-[color:var(--muted)]">
                              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                              {KIND_META[story.kind].label}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.article>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function StoryMedia({ story }: { story: StoryRecord }) {
  if (story.kind === "video") {
    if (story.mediaUrl && isYoutubeEmbed(story.mediaUrl)) {
      return (
        <div className="overflow-hidden rounded-[24px] border border-[color:var(--border-soft)] bg-[color:var(--forest)]">
          <iframe
            src={story.mediaUrl}
            title={story.title}
            className="aspect-video w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      );
    }

    if (story.mediaUrl) {
      return (
        <video
          controls
          preload="metadata"
          className="aspect-video w-full rounded-[24px] border border-[color:var(--border-soft)] bg-black"
          poster={story.thumbnailUrl}
        >
          <source src={story.mediaUrl} />
        </video>
      );
    }

    return <UnavailableMedia kind="video" />;
  }

  if (story.kind === "audio") {
    return (
      <div className="rounded-[24px] border border-[color:var(--border-soft)] bg-white p-5">
        <p className="mb-3 text-sm font-semibold text-[color:var(--forest)]">Reproductor de audio</p>
        {story.mediaUrl ? (
          <audio controls preload="metadata" className="w-full">
            <source src={story.mediaUrl} />
          </audio>
        ) : (
          <UnavailableMedia kind="audio" />
        )}
      </div>
    );
  }

  if (story.kind === "photo") {
    return (
      <div className="overflow-hidden rounded-[24px] border border-[color:var(--border-soft)]">
        <img
          src={story.thumbnailUrl ?? "/generated/doc-thumbnail.png"}
          alt={`Fotografía: ${story.title}`}
          className="aspect-video w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className="rounded-[24px] border border-[color:var(--border-soft)] bg-white p-6">
      <p className="text-sm leading-7 text-[color:var(--muted-strong)]">
        {story.description}
      </p>
    </div>
  );
}

function UnavailableMedia({ kind }: { kind: "audio" | "video" }) {
  return (
    <div className="rounded-[18px] border border-dashed border-[color:var(--border-strong)] bg-[color:var(--sand)] p-4 text-sm text-[color:var(--muted-strong)]">
      Reproductor de {kind} disponible en la próxima actualización autorizada.
    </div>
  );
}

function isYoutubeEmbed(url: string) {
  return url.includes("youtube.com") || url.includes("youtu.be");
}
