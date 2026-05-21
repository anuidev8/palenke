"use client";

import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import GobiernoPropioMediaGallery from "@/components/palenke/GobiernoPropioMediaGallery";
import type {
  PalenkeGalleryMedia,
  PalenkeGalleryMediaKind,
} from "@/lib/palenke-gallery-media";
import {
  MEDIATECA_UBUNTU_CATEGORIES,
  type MediatecaUbuntuCategoryId,
} from "@/lib/mediateca-ubuntu-gallery-data";

const MEDIA_KIND_OPTIONS: Array<{
  id: "all" | PalenkeGalleryMediaKind;
  label: string;
}> = [
  { id: "all", label: "Todos" },
  { id: "image", label: "Imagen" },
  { id: "video", label: "Video" },
  { id: "audio", label: "Audio" },
];

export default function MediatecaUbuntuGallerySection({
  items,
}: {
  items: PalenkeGalleryMedia[];
}) {
  const [collectionOpen, setCollectionOpen] = useState(false);
  const [categoryId, setCategoryId] = useState<MediatecaUbuntuCategoryId>("todas");
  const [mediaKind, setMediaKind] = useState<"all" | PalenkeGalleryMediaKind>("all");

  const categoryFilteredItems = useMemo(() => {
    if (categoryId === "todas") return items;
    return items.filter((item) => item.categoryId === categoryId);
  }, [categoryId, items]);

  const mediaCounts = useMemo(
    () =>
      categoryFilteredItems.reduce(
        (acc, item) => {
          acc[item.kind] += 1;
          return acc;
        },
        { image: 0, video: 0, audio: 0 } as Record<PalenkeGalleryMediaKind, number>,
      ),
    [categoryFilteredItems],
  );

  const filteredItems = useMemo(() => {
    if (mediaKind === "all") return categoryFilteredItems;
    return categoryFilteredItems.filter((item) => item.kind === mediaKind);
  }, [categoryFilteredItems, mediaKind]);

  const showAllInGrid = categoryId === "todas";

  return (
    <>
      <div className="mb-8 flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <p className="eyebrow mb-3">Mediateca Ubuntu</p>
            <h2 className="font-display text-3xl text-[#1a1a1a] sm:text-4xl">
              Fotos, videos, audios y entrevistas del territorio
            </h2>
            <p className="mt-4 text-base leading-7 text-[#4a4540]">
              Colección audiovisual comunitaria organizada por consejos comunitarios — memoria viva
              de lo que hemos construido en el Palenke de Pensamiento.
            </p>
          </div>

          {!showAllInGrid && (
            <button
              type="button"
              onClick={() => setCollectionOpen(true)}
              className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-full border border-[#d9cfbe] bg-white px-5 py-2.5 text-sm font-semibold text-[#1a1a1a] transition hover:bg-[#f0eae0] sm:w-auto sm:justify-start"
              disabled={filteredItems.length === 0}
            >
              Ver toda la colección
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>

        <div
          className="flex flex-wrap gap-2"
          role="tablist"
          aria-label="Filtrar por colección"
        >
          {MEDIATECA_UBUNTU_CATEGORIES.map((category) => {
            const selected = categoryId === category.id;
            return (
              <button
                key={category.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setCategoryId(category.id)}
                className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition ${
                  selected
                    ? "bg-[#2e7d32] text-white shadow-sm"
                    : "border border-[#d9cfbe] bg-white text-[#4a4540] hover:bg-[#f7f3ed]"
                }`}
              >
                {category.label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#5a554d]">
            Filtrar por tipo de medio
          </p>
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filtrar por tipo de medio">
            {MEDIA_KIND_OPTIONS.map((option) => {
              const selected = mediaKind === option.id;
              const count =
                option.id === "all"
                  ? categoryFilteredItems.length
                  : mediaCounts[option.id];
              return (
                <button
                  key={option.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setMediaKind(option.id)}
                  className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition ${
                    selected
                      ? "bg-[#1a1a1a] text-white shadow-sm"
                      : "border border-[#d9cfbe] bg-white text-[#4a4540] hover:bg-[#f7f3ed]"
                  }`}
                >
                  {option.label} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <GobiernoPropioMediaGallery
        items={filteredItems}
        collectionOpen={collectionOpen}
        onCollectionOpenChange={setCollectionOpen}
        layoutGroupId="mediateca-ubuntu-gallery"
        layoutIdPrefix="mediateca"
        showAllPreview={showAllInGrid}
        cardVariant="image-overlay"
        collectionAriaLabel="Colección completa de Mediateca Ubuntu"
        collectionTitle="Mediateca Ubuntu — colección completa"
        collectionSubtitle={
          `${filteredItems.length} piezas` +
          (categoryId !== "todas"
            ? ` · ${MEDIATECA_UBUNTU_CATEGORIES.find((c) => c.id === categoryId)?.label ?? ""}`
            : "") +
          (mediaKind !== "all"
            ? ` · ${MEDIA_KIND_OPTIONS.find((option) => option.id === mediaKind)?.label ?? ""}`
            : "")
        }
      />
    </>
  );
}
