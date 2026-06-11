export type DocumentTypeVisualVariant = "pdf" | "slides";

export type DocumentTypeVisual = {
  variant: DocumentTypeVisualVariant;
  badge: string;
  footerLabel: string | null;
};

function normalizeDocumentType(type: string) {
  return type
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

export function getDocumentTypeVisual(type: string | null | undefined): DocumentTypeVisual {
  const normalized = normalizeDocumentType(type ?? "");

  if (normalized === "diapositivas" || normalized === "presentacion" || normalized === "presentación") {
    return {
      variant: "slides",
      badge: "PDF",
      footerLabel: "Diapositivas",
    };
  }

  if (normalized === "poster") {
    return {
      variant: "pdf",
      badge: "PDF",
      footerLabel: null,
    };
  }

  if (!type?.trim()) {
    return {
      variant: "pdf",
      badge: "PDF",
      footerLabel: null,
    };
  }

  return {
    variant: "pdf",
    badge: "PDF",
    footerLabel: type.trim(),
  };
}
