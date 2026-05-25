"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Search, X } from "lucide-react";
import GobiernoPropioMediaGallery from "@/components/palenke/GobiernoPropioMediaGallery";
import type {
  PalenkeGalleryMedia,
  PalenkeGalleryMediaKind,
} from "@/lib/palenke-gallery-media";
import { MEDIATECA_UBUNTU_CATEGORIES } from "@/lib/mediateca-ubuntu-gallery-data";
import { runMediatecaGallerySearch } from "@/lib/ai-search";

const MEDIA_KIND_OPTIONS: Array<{
  id: "all" | PalenkeGalleryMediaKind;
  label: string;
}> = [
  { id: "all", label: "Todos" },
  { id: "image", label: "Imagen" },
  { id: "video", label: "Video" },
  { id: "audio", label: "Audio" },
];

const PAGE_SIZE = 9;

export default function MediatecaUbuntuGallerySection({
  items,
}: {
  items: PalenkeGalleryMedia[];
}) {
  const [collectionOpen, setCollectionOpen] = useState(false);
  const [mediaKind, setMediaKind] = useState<"all" | PalenkeGalleryMediaKind>("all");
  const [searchDraft, setSearchDraft] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { rankedItems: searchedItems, answer: searchAnswer } = useMemo(
    () => runMediatecaGallerySearch(items, searchQuery),
    [items, searchQuery],
  );

  const kindBaseItems = searchedItems;

  const mediaCounts = useMemo(
    () =>
      kindBaseItems.reduce(
        (acc, item) => {
          acc[item.kind] += 1;
          return acc;
        },
        { image: 0, video: 0, audio: 0 } as Record<PalenkeGalleryMediaKind, number>,
      ),
    [kindBaseItems],
  );

  const filteredItems = useMemo(() => {
    if (mediaKind === "all") return kindBaseItems;
    return kindBaseItems.filter((item) => item.kind === mediaKind);
  }, [kindBaseItems, mediaKind]);

  const totalCount = filteredItems.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pageStart = (safePage - 1) * PAGE_SIZE;
  const pageEnd = Math.min(pageStart + PAGE_SIZE, totalCount);
  const pageItems = filteredItems.slice(pageStart, pageEnd);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, mediaKind]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const submitSearch = () => {
    setSearchQuery(searchDraft.trim());
  };

  const clearSearch = () => {
    setSearchDraft("");
    setSearchQuery("");
  };

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
        </div>

        <p className="inline-flex w-fit rounded-full bg-[#2e7d32] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-sm">
          {MEDIATECA_UBUNTU_CATEGORIES[0].label}
        </p>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            submitSearch();
          }}
          className="rounded-[22px] border border-[#d9cfbe] bg-white p-4 shadow-[0_8px_22px_rgba(13,31,10,0.05)] sm:p-5"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative min-w-0 flex-1">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7a756e]"
                aria-hidden="true"
              />
              <input
                id="mediateca-search"
                type="search"
                value={searchDraft}
                onChange={(event) => setSearchDraft(event.target.value)}
                placeholder="Búsqueda inteligente"
                aria-label="Búsqueda inteligente"
                className="input-shell w-full pl-10"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-[#1a1a1a] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2c2c2c] sm:shrink-0"
            >
              Buscar
            </button>
            {searchQuery ? (
              <button
                type="button"
                onClick={clearSearch}
                className="inline-flex items-center justify-center gap-1.5 rounded-full border border-[#d9cfbe] px-4 py-2.5 text-sm font-medium text-[#4a4540] transition hover:bg-[#f7f3ed] sm:shrink-0"
              >
                <X className="h-4 w-4" aria-hidden="true" />
                Limpiar
              </button>
            ) : null}
          </div>
        </form>

        {searchAnswer ? (
          <div
            className="rounded-[20px] border border-[#d9cfbe] bg-[#f7f3ed] px-4 py-4 sm:px-5"
            role="status"
            aria-live="polite"
          >
            <p className="text-sm leading-6 text-[#4a4540]">{searchAnswer.summary}</p>
            {searchAnswer.keyPoints.length > 0 ? (
              <ul className="mt-3 space-y-1.5 text-sm text-[#5a554d]">
                {searchAnswer.keyPoints.map((point) => (
                  <li key={point} className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2e7d32]" />
                    {point}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}

        <div className="flex flex-col gap-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#5a554d]">
            Filtrar por tipo de medio
          </p>
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filtrar por tipo de medio">
            {MEDIA_KIND_OPTIONS.map((option) => {
              const selected = mediaKind === option.id;
              const count = option.id === "all" ? kindBaseItems.length : mediaCounts[option.id];
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

        {totalCount > 0 ? (
          <p className="text-sm text-[#7a756e]">
            Mostrando {pageStart + 1}–{pageEnd} de {totalCount} pieza{totalCount !== 1 ? "s" : ""}
            {searchQuery ? ` · consulta: “${searchQuery}”` : ""}
          </p>
        ) : null}
      </div>

      {pageItems.length > 0 ? (
        <>
          <GobiernoPropioMediaGallery
            items={pageItems}
            collectionOpen={collectionOpen}
            onCollectionOpenChange={setCollectionOpen}
            layoutGroupId="mediateca-ubuntu-gallery"
            layoutIdPrefix="mediateca"
            showAllPreview
            cardVariant="image-overlay"
            collectionAriaLabel="Colección completa de Mediateca Ubuntu"
            collectionTitle="Mediateca Ubuntu — colección completa"
            collectionSubtitle={
              `${filteredItems.length} piezas` +
              (mediaKind !== "all"
                ? ` · ${MEDIA_KIND_OPTIONS.find((option) => option.id === mediaKind)?.label ?? ""}`
                : "") +
              (searchQuery ? ` · “${searchQuery}”` : "")
            }
          />

          {totalPages > 1 ? (
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 px-1 text-sm text-[#7a756e]">
              <span>
                Página {safePage} de {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={safePage <= 1}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#d9cfbe] bg-white transition hover:bg-[#f0eae0] disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label="Página anterior"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                </button>
                <span className="inline-flex h-9 min-w-[36px] items-center justify-center rounded-full bg-[#1a1a1a] px-3 text-xs font-semibold text-white">
                  {safePage}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  disabled={safePage >= totalPages}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#d9cfbe] bg-white transition hover:bg-[#f0eae0] disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label="Página siguiente"
                >
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          ) : null}
        </>
      ) : (
        <div className="rounded-[24px] border border-[#e8dfd3] bg-white p-8 text-[#4a4540]">
          <p className="font-semibold text-[#1a1a1a]">No hay piezas con estos criterios</p>
          <p className="mt-2 text-sm leading-6">
            Prueba otra palabra en la búsqueda inteligente o cambia el tipo de medio.
          </p>
          {searchQuery || mediaKind !== "all" ? (
            <button
              type="button"
              onClick={() => {
                clearSearch();
                setMediaKind("all");
              }}
              className="mt-4 inline-flex rounded-full border border-[#d9cfbe] px-4 py-2 text-sm font-semibold text-[#1a1a1a] transition hover:bg-[#f7f3ed]"
            >
              Ver todas las piezas
            </button>
          ) : null}
        </div>
      )}
    </>
  );
}
