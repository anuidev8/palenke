"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  LayoutGroup,
  motion,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import Image from "next/image";
import { Headphones, X } from "lucide-react";
import type { PalenkeGalleryMedia } from "@/lib/palenke-gallery-media";

const PREVIEW_COUNT = 5;

/** Gallery cards: sharp photos without loading full 4K originals (see next/image `sizes`). */
const GALLERY_IMAGE_QUALITY = 85;
const HERO_CARD_IMAGE_SIZES = "(max-width: 1280px) 100vw, 1280px";
const COMPACT_CARD_IMAGE_SIZES =
  "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px";

const ACCENTS = ["#d48a1f", "#2e7d32", "#1a1a1a", "#1565c0"] as const;

const layoutSpring = { type: "spring", stiffness: 280, damping: 32 } as const;
const softEase = [0.22, 1, 0.36, 1] as const;

function isDirectVideoFileUrl(url: string) {
  const lower = url.toLowerCase().split(/[?#]/)[0] ?? url;
  if (/\.(mp4|webm|ogg|mov|m4v)$/i.test(lower)) return true;
  if (lower.includes("res.cloudinary.com") && lower.includes("/video/upload/")) return true;
  if (lower.includes("/storage/v1/object/public/") && /\.(mp4|webm|mov|m4v)$/i.test(lower)) {
    return true;
  }
  return false;
}

type ExpandSource = "preview" | "collection";

function layoutIdFor(source: ExpandSource, id: string, prefix: string) {
  return source === "preview" ? `${prefix}-p-${id}` : `${prefix}-c-${id}`;
}

function mediaKindLabel(kind: PalenkeGalleryMedia["kind"]) {
  if (kind === "video") return "Video";
  if (kind === "audio") return "Audio";
  return "Imagen";
}

function openActionLabel(kind: PalenkeGalleryMedia["kind"]) {
  if (kind === "video") return "Preview";
  if (kind === "audio") return "Escuchar";
  return "Ver";
}

function MediaPreview({
  item,
  className,
  priority,
  imageOverlay = false,
  sizes = COMPACT_CARD_IMAGE_SIZES,
}: {
  item: PalenkeGalleryMedia;
  className?: string;
  priority?: boolean;
  imageOverlay?: boolean;
  sizes?: string;
}) {
  const src = item.posterUrl || item.mediaUrl;
  const imageSrc = item.kind === "image" ? item.mediaUrl || src : src;
  const imageClassName = `object-cover object-center${
    imageOverlay ? " transition-transform duration-700 ease-out group-hover:scale-[1.03]" : ""
  }`;

  const isVideoThumb =
    item.kind === "video" && isDirectVideoFileUrl(item.mediaUrl || item.posterUrl);
  const useOptimizedImage =
    !isVideoThumb &&
    (imageSrc.includes("supabase.co/storage/") ||
      imageSrc.startsWith("/") ||
      imageSrc.includes("res.cloudinary.com"));

  return (
    <div
      className={`absolute inset-0 z-0 h-full w-full overflow-hidden ${className ?? ""}`}
      aria-hidden
    >
      {isVideoThumb ? (
        <video
          src={item.mediaUrl || item.posterUrl}
          className={`h-full w-full object-cover object-center${imageOverlay ? " transition-transform duration-700 ease-out group-hover:scale-[1.03]" : ""}`}
          muted
          playsInline
          preload="metadata"
        />
      ) : useOptimizedImage ? (
        <Image
          src={imageSrc}
          alt=""
          fill
          className={imageClassName}
          sizes={sizes}
          quality={GALLERY_IMAGE_QUALITY}
          priority={priority}
        />
      ) : (
        <Image
          src={imageSrc}
          alt=""
          fill
          className={imageClassName}
          sizes={sizes}
          quality={GALLERY_IMAGE_QUALITY}
          priority={priority}
        />
      )}
      {(item.kind === "video" || item.kind === "audio") && !imageOverlay && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#1a1a1a] shadow-md">
            {mediaKindLabel(item.kind)}
          </span>
        </div>
      )}
    </div>
  );
}

export type GalleryCardVariant = "dark-panel" | "image-overlay";

type GalleryCardProps = {
  item: PalenkeGalleryMedia;
  index: number;
  variant: "hero" | "compact";
  source: ExpandSource;
  /** When this id is active in detail view from same source, skip rendering (layout handoff). */
  hiddenForMorphId: string | null;
  onOpen: () => void;
  reduceMotion: boolean;
  layoutIdPrefix: string;
  cardVariant?: GalleryCardVariant;
};

function GalleryCard({
  item,
  index,
  variant,
  source,
  hiddenForMorphId,
  onOpen,
  reduceMotion,
  layoutIdPrefix,
  cardVariant = "dark-panel",
}: GalleryCardProps) {
  if (hiddenForMorphId === item.id) return null;

  const isHero = variant === "hero";
  const isOverlay = cardVariant === "image-overlay";
  const accent = ACCENTS[index % ACCENTS.length];
  const lid = reduceMotion ? undefined : layoutIdFor(source, item.id, layoutIdPrefix);

  const sizeClass = isOverlay
    ? isHero
      ? "min-h-[420px] sm:min-h-[500px]"
      : "min-h-[280px] sm:min-h-[320px]"
    : isHero
      ? "min-h-[480px] sm:min-h-[540px]"
      : "min-h-[300px] sm:min-h-[340px]";

  return (
    <motion.article
      layout={!reduceMotion}
      layoutId={lid}
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-24px" }}
      transition={{
        layout: reduceMotion ? { duration: 0 } : { ...layoutSpring },
        opacity: { duration: reduceMotion ? 0 : 0.4, delay: Math.min(index * 0.04, 0.2) },
        y: { duration: reduceMotion ? 0 : 0.45, ease: softEase },
      }}
      className={`group relative isolate flex w-full flex-col overflow-hidden rounded-[2rem] text-white will-change-transform [backface-visibility:hidden] ${
        isOverlay
          ? "bg-neutral-900 shadow-[0_12px_40px_rgba(0,0,0,0.14)] transition-shadow duration-500 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(0,0,0,0.22)]"
          : "bg-[#1f1f1f] shadow-[0_16px_48px_rgba(0,0,0,0.12)]"
      } ${sizeClass}`}
    >
      <MediaPreview
        item={item}
        priority={isHero && source === "preview"}
        imageOverlay={isOverlay}
        sizes={isHero ? HERO_CARD_IMAGE_SIZES : COMPACT_CARD_IMAGE_SIZES}
      />
      {isOverlay ? (
        <div
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(13,31,13,0.62) 22%, rgba(46,125,50,0.32) 42%, transparent 68%)",
          }}
        />
      ) : (
        <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-[#0d0d0d]/92 via-[#0d0d0d]/45 to-transparent" />
      )}

      {isOverlay ? (
        <div className="relative z-10 flex min-h-[inherit] flex-1 flex-col p-6 sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <span
              className="inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest shadow-sm"
              style={{
                backgroundColor: accent,
                color: accent === "#1a1a1a" ? "#fff" : "#1a1a1a",
              }}
            >
              {item.type}
            </span>
            <span className="inline-flex rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-md">
              {item.territory}
            </span>
          </div>

          {(item.kind === "video" || item.kind === "audio") && (
            <div className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center opacity-80 transition group-hover:opacity-100">
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/35 bg-black/45 shadow-lg backdrop-blur-md sm:h-14 sm:w-14">
                {item.kind === "audio" ? (
                  <Headphones className="h-6 w-6 text-white sm:h-7 sm:w-7" />
                ) : (
                  <span className="ml-1 h-0 w-0 border-y-[7px] border-l-[12px] border-y-transparent border-l-white sm:border-y-8 sm:border-l-[14px]" />
                )}
              </span>
            </div>
          )}

          <div className="mt-auto pt-10">
            <h3
              className={`font-display font-semibold leading-[1.12] tracking-tight text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.65)] ${
                isHero ? "text-3xl sm:text-4xl lg:text-5xl" : "text-xl sm:text-2xl"
              }`}
            >
              {item.title}
            </h3>
            <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-white/15 pt-4">
              <span className="text-[11px] font-medium uppercase tracking-widest text-white/60">
                {item.year} · {item.council}
              </span>
              <button
                type="button"
                onClick={onOpen}
                className="ml-auto inline-flex rounded-full border border-white/25 bg-black/45 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md transition hover:bg-black/60"
              >
                {openActionLabel(item.kind)}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`relative z-10 flex flex-1 flex-col justify-end ${isHero ? "p-6 md:p-10 lg:flex-row lg:gap-12" : "p-6"}`}
        >
          {isHero && (
            <div className="mb-10 hidden flex-1 flex-col justify-end lg:flex">
              <p className="max-w-xl text-lg leading-relaxed text-[#e8e4dc] line-clamp-4">
                {item.description}
              </p>
            </div>
          )}

          <div className={isHero ? "lg:flex lg:w-[44%] lg:flex-col lg:justify-end" : ""}>
            <div
              className={`flex flex-wrap items-start gap-2 ${isHero ? "relative mb-4 md:mb-6" : "absolute left-6 right-6 top-6"}`}
            >
              <span
                className="inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest"
                style={{
                  backgroundColor: accent,
                  color: accent === "#1a1a1a" ? "#fff" : "#1a1a1a",
                }}
              >
                {item.type}
              </span>
              <span className="inline-flex rounded-full border border-white/25 bg-black/35 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-md">
                {item.territory}
              </span>
            </div>

            <h3
              className={`font-display font-semibold tracking-tight text-white ${isHero ? "text-3xl sm:text-4xl lg:text-5xl" : "text-xl sm:text-2xl pr-8"}`}
            >
              {item.title}
            </h3>

            {!isHero && (
              <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-white/85">{item.description}</p>
            )}

            <div
              className={`mt-5 flex flex-wrap items-center gap-4 border-white/15 ${isHero ? "border-t border-white/15 pt-6" : "border-t pt-5"}`}
            >
              <span className="text-xs font-medium uppercase tracking-widest text-white/55">
                {item.year} · {item.council}
              </span>
              <button
                type="button"
                onClick={onOpen}
                className="ml-auto inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#111] transition hover:scale-[1.02] active:scale-[0.98]"
              >
                {openActionLabel(item.kind)}
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.article>
  );
}

type DetailOverlayProps = {
  item: PalenkeGalleryMedia;
  source: ExpandSource;
  onClose: () => void;
  reduceMotion: boolean;
  layoutIdPrefix: string;
};

function DetailOverlay({
  item,
  source,
  onClose,
  reduceMotion,
  layoutIdPrefix,
}: DetailOverlayProps) {
  const lid = reduceMotion ? undefined : layoutIdFor(source, item.id, layoutIdPrefix);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby={`gov-gallery-detail-${item.id}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.28 }}
      className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-6 md:p-10"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-[#050505]/76 backdrop-blur-md" />

      <motion.article
        layout={!reduceMotion}
        layoutId={lid}
        transition={reduceMotion ? { duration: 0 } : { layout: layoutSpring }}
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 flex max-h-[calc(100dvh-24px)] w-full max-w-5xl flex-col overflow-hidden rounded-[28px] bg-[#141414] shadow-[0_36px_100px_rgba(0,0,0,0.55)]"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-[2] inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-md transition hover:bg-black/75"
          aria-label="Cerrar"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="relative aspect-video w-full shrink-0 bg-black sm:aspect-[16/9]">
          {item.kind === "image" ? (
            <Image
              src={item.mediaUrl}
              alt={item.title}
              fill
              className="object-contain"
              sizes="(max-width: 1280px) 100vw, 1280px"
              quality={90}
              priority
            />
          ) : item.kind === "audio" ? (
            <div className="absolute inset-0">
              <Image
                src={item.posterUrl || "/assets/hero-cards/memoria-afroterritorial.png"}
                alt=""
                fill
                className="object-cover opacity-45"
                sizes="(max-width: 1280px) 100vw, 1280px"
                quality={85}
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/65 to-black/45" />
              <div className="relative z-10 flex h-full flex-col items-center justify-center gap-5 px-6 text-center">
                <span className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-white/25 bg-black/35 backdrop-blur-sm">
                  <Headphones className="h-8 w-8 text-white" />
                </span>
                <p className="max-w-xl text-sm font-medium uppercase tracking-[0.2em] text-white/75">
                  Reproductor de audio
                </p>
                <audio controls preload="metadata" className="w-full max-w-2xl" src={item.mediaUrl}>
                  Tu navegador no reproduce audio HTML5.
                </audio>
              </div>
            </div>
          ) : isDirectVideoFileUrl(item.mediaUrl) ? (
            <video
              className="absolute inset-0 h-full w-full bg-black object-contain"
              controls
              playsInline
              preload="metadata"
              poster={item.posterUrl}
              src={item.mediaUrl}
            >
              Tu navegador no reproduce video HTML5.
            </video>
          ) : (
            <iframe
              title={item.title}
              src={item.mediaUrl}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />
          )}
        </div>

        <div className="flex max-h-[40vh] flex-col gap-3 overflow-y-auto p-6 sm:p-8">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white/85">
              {item.section}
            </span>
            <span className="rounded-full border border-white/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/65">
              {item.territory}
            </span>
          </div>
          <h2
            id={`gov-gallery-detail-${item.id}`}
            className="font-display text-2xl leading-tight tracking-tight text-white sm:text-3xl"
          >
            {item.title}
          </h2>
          <p className="text-base leading-relaxed text-[#d5d1c9]">{item.description}</p>
          <p className="text-sm text-white/50">
            {item.year} · {item.council}
          </p>
        </div>
      </motion.article>
    </motion.div>
  );
}

type CollectionOverlayProps = {
  items: PalenkeGalleryMedia[];
  activeMorphId: string | null;
  onClose: () => void;
  onOpenItem: (id: string) => void;
  reduceMotion: boolean;
  layoutIdPrefix: string;
  ariaLabel: string;
  title: string;
  subtitle?: string;
  cardVariant?: GalleryCardVariant;
  collectionGridLg?: 2 | 3;
};

function CollectionOverlay({
  items,
  activeMorphId,
  onClose,
  onOpenItem,
  reduceMotion,
  layoutIdPrefix,
  ariaLabel,
  title,
  subtitle,
  cardVariant = "dark-panel",
  collectionGridLg = 3,
}: CollectionOverlayProps) {
  const gridColsLgClass = collectionGridLg === 2 ? "lg:grid-cols-2" : "lg:grid-cols-3";

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.35 }}
      className="fixed inset-0 z-[120]"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-[#eae6dd]/95 backdrop-blur-md" />
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, scale: 0.97, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={
          reduceMotion
            ? { opacity: 0 }
            : { opacity: 0, scale: 0.98, y: 8 }
        }
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 0.55, ease: softEase }
        }
        className="relative z-10 flex h-full flex-col px-4 py-8 sm:px-6 lg:px-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-8 flex w-full max-w-7xl shrink-0 items-start justify-between gap-4 border-b border-[#dcd4c8] pb-6">
          <div>
            <p className="eyebrow mb-2">Galería audiovisual</p>
            <h3 className="font-display text-2xl text-[#1a1a1a] sm:text-3xl">{title}</h3>
            <p className="mt-2 max-w-xl text-[#5a554d]">
              {subtitle ?? `${items.length} piezas en esta colección`}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#cfc7ba] bg-white text-[#1a1a1a] transition hover:bg-[#f3efe7]"
            aria-label="Cerrar galería"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div
          className={`mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-6 overflow-y-auto pb-16 sm:grid-cols-2 ${gridColsLgClass}`}
        >
          {items.map((item, i) => (
            <GalleryCard
              key={item.id}
              item={item}
              index={i}
              variant="compact"
              source="collection"
              hiddenForMorphId={activeMorphId === item.id ? item.id : null}
              reduceMotion={reduceMotion}
              onOpen={() => onOpenItem(item.id)}
              layoutIdPrefix={layoutIdPrefix}
              cardVariant={cardVariant}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function GobiernoPropioMediaGallery({
  items,
  collectionOpen,
  onCollectionOpenChange,
  layoutGroupId = "gov-propio-gallery",
  layoutIdPrefix = "gov",
  collectionAriaLabel = "Colección completa de Gobierno Propio",
  collectionTitle = "Toda la colección",
  collectionSubtitle,
  showAllPreview = false,
  cardVariant = "dark-panel",
  previewColumnsLg = 3,
  collectionGridLg = 3,
}: {
  items: PalenkeGalleryMedia[];
  collectionOpen: boolean;
  onCollectionOpenChange: (next: boolean) => void;
  layoutGroupId?: string;
  layoutIdPrefix?: string;
  collectionAriaLabel?: string;
  collectionTitle?: string;
  collectionSubtitle?: string;
  /** When true, render every item in the page grid (no 5-item preview cap). */
  showAllPreview?: boolean;
  cardVariant?: GalleryCardVariant;
  /** Large-screen column count for the preview masonry (excluding hero card). */
  previewColumnsLg?: 2 | 3;
  /** Large-screen column count for the full collection overlay grid. */
  collectionGridLg?: 2 | 3;
}) {
  const reduceMotion = useReducedMotion();
  const [detailId, setDetailId] = useState<string | null>(null);
  const [detailSource, setDetailSource] = useState<ExpandSource | null>(null);

  const previewItems = useMemo(
    () => (showAllPreview ? items : items.slice(0, PREVIEW_COUNT)),
    [items, showAllPreview],
  );

  const heroItem = previewItems[0];
  const masonryPreview = previewItems.slice(1);

  const detailItem =
    detailId != null ? items.find((doc) => doc.id === detailId) ?? null : null;

  const closeDetail = useCallback(() => {
    setDetailId(null);
    setDetailSource(null);
  }, []);

  const closeCollection = useCallback(
    () => onCollectionOpenChange(false),
    [onCollectionOpenChange],
  );

  const openDetailFromPreview = useCallback((id: string) => {
    setDetailSource("preview");
    setDetailId(id);
  }, []);

  const openDetailFromCollection = useCallback((id: string) => {
    setDetailSource("collection");
    setDetailId(id);
  }, []);

  useEffect(() => {
    const needsLock = !!detailItem || collectionOpen;
    if (!needsLock) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [detailItem, collectionOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (detailId) {
        closeDetail();
        return;
      }
      if (collectionOpen) closeCollection();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [detailId, collectionOpen, closeDetail, closeCollection]);

  if (items.length === 0) {
    return (
      <div className="rounded-[24px] border border-[#e8dfd3] bg-white p-8 text-[#4a4540]">
        No hay piezas disponibles para la galería en este momento.
      </div>
    );
  }

  const previewMorphHidden =
    detailSource === "preview" ? detailId : null;
  const collectionMorphHidden =
    detailSource === "collection" ? detailId : null;
  const previewColsLgClass = previewColumnsLg === 2 ? "lg:columns-2" : "lg:columns-3";

  return (
    <LayoutGroup id={layoutGroupId}>
      <motion.div layout className="flex flex-col gap-6">
        {heroItem && previewMorphHidden !== heroItem.id && (
          <GalleryCard
            item={heroItem}
            index={0}
            variant="hero"
            source="preview"
            hiddenForMorphId={null}
            reduceMotion={!!reduceMotion}
            onOpen={() => openDetailFromPreview(heroItem.id)}
            layoutIdPrefix={layoutIdPrefix}
            cardVariant={cardVariant}
          />
        )}

        {masonryPreview.length > 0 && (
          <motion.div
            layout
            className={`columns-1 gap-6 [column-fill:balance] sm:columns-2 ${previewColsLgClass}`}
          >
            {masonryPreview.map((doc, i) =>
              previewMorphHidden === doc.id ? null : (
                <motion.div
                  key={doc.id}
                  layout
                  className="mb-6 inline-block w-full break-inside-avoid align-top"
                  transition={{
                    layout: reduceMotion ? { duration: 0 } : { duration: 0.48, ease: softEase },
                  }}
                >
                  <GalleryCard
                    item={doc}
                    index={i + 1}
                    variant="compact"
                    source="preview"
                    hiddenForMorphId={null}
                    reduceMotion={!!reduceMotion}
                    onOpen={() => openDetailFromPreview(doc.id)}
                    layoutIdPrefix={layoutIdPrefix}
                    cardVariant={cardVariant}
                  />
                </motion.div>
              ),
            )}
          </motion.div>
        )}
      </motion.div>

      <AnimatePresence>
        {collectionOpen && (
          <CollectionOverlay
            items={items}
            activeMorphId={collectionMorphHidden}
            onClose={closeCollection}
            onOpenItem={(id) => openDetailFromCollection(id)}
            reduceMotion={!!reduceMotion}
            layoutIdPrefix={layoutIdPrefix}
            ariaLabel={collectionAriaLabel}
            title={collectionTitle}
            subtitle={collectionSubtitle}
            cardVariant={cardVariant}
            collectionGridLg={collectionGridLg}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {detailItem && detailSource && (
          <DetailOverlay
            key={detailItem.id + detailSource}
            item={detailItem}
            source={detailSource}
            onClose={closeDetail}
            reduceMotion={!!reduceMotion}
            layoutIdPrefix={layoutIdPrefix}
          />
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
}
