"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import GobiernoPropioMediaGallery from "@/components/palenke/GobiernoPropioMediaGallery";
import type { GobiernoGalleryMedia } from "@/lib/gobierno-gallery-data";

export default function GobiernoPropioGallerySection({
  items,
}: {
  items: GobiernoGalleryMedia[];
}) {
  const [collectionOpen, setCollectionOpen] = useState(false);

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl">
          <p className="eyebrow mb-3">Galería audiovisual</p>
          <h2 className="font-display text-3xl text-[#1a1a1a] sm:text-4xl">
            Gobierno Propio en imágenes y video
          </h2>
          <p className="mt-4 text-base leading-7 text-[#4a4540]">
            Avances, encuentros territoriales y memoria viva sobre instrumentos del gobierno propio —
            sólo contenido autorizado tras consentimiento comunitario. En esta página se muestran las
            primeras piezas; el resto de la colección se abre en una vista ampliada a pantalla completa
            con transiciones suaves.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCollectionOpen(true)}
          className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-full border border-[#d9cfbe] bg-white px-5 py-2.5 text-sm font-semibold text-[#1a1a1a] transition hover:bg-[#f0eae0] sm:w-auto sm:justify-start"
          disabled={items.length === 0}
        >
          Ver toda la colección
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <GobiernoPropioMediaGallery
        items={items}
        collectionOpen={collectionOpen}
        onCollectionOpenChange={setCollectionOpen}
      />
    </>
  );
}
