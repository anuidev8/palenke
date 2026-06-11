import type { SearchParams } from "@/lib/viewer";
import { getFirstParam } from "@/lib/viewer";
import type { DisplayDoc } from "@/components/palenke/DocumentTree";

export type SeguridadJuridicaFilters = {
  query: string;
  year: string;
  author: string;
  council: string;
  documentType: string;
  theme: string;
};

export type SeguridadJuridicaFilterableDoc = DisplayDoc & {
  submodule?: string;
  previewHref?: string;
  author?: string;
  theme?: string;
  summary?: string;
  catalogId?: string;
  format?: string;
  keywords?: string[];
  subtheme?: string;
};

export type SeguridadJuridicaFacetOptions = {
  years: string[];
  authors: string[];
  councils: string[];
  documentTypes: string[];
  themes: string[];
};

export function parseSeguridadJuridicaFilters(params: SearchParams): SeguridadJuridicaFilters {
  return {
    query: getFirstParam(params.q) ?? "",
    year: getFirstParam(params.year) ?? "",
    author: getFirstParam(params.author) ?? "",
    council: getFirstParam(params.council) ?? "",
    documentType: getFirstParam(params.tipo) ?? "",
    theme: getFirstParam(params.theme) ?? "",
  };
}

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function matchesQuery(doc: SeguridadJuridicaFilterableDoc, query: string) {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) return true;

  const haystack = [
    doc.catalogId,
    doc.title,
    doc.author,
    doc.council,
    doc.territory,
    doc.summary,
    doc.subtheme,
    doc.theme,
    doc.type,
    doc.format,
    ...(doc.keywords ?? []),
  ]
    .filter(Boolean)
    .map((value) => normalizeText(String(value)));

  return haystack.some((value) => value.includes(normalizedQuery));
}

export function filterSeguridadJuridicaDocuments(
  docs: SeguridadJuridicaFilterableDoc[],
  filters: SeguridadJuridicaFilters,
) {
  return docs.filter((doc) => {
    if (filters.query && !matchesQuery(doc, filters.query)) return false;
    if (filters.year && doc.year !== filters.year) return false;
    if (filters.author && doc.author !== filters.author) return false;
    if (filters.council && doc.council !== filters.council) return false;
    if (filters.documentType && doc.type !== filters.documentType) return false;
    if (filters.theme && doc.theme !== filters.theme) return false;
    return true;
  });
}

function uniqueSorted(values: Array<string | undefined | null>) {
  return [...new Set(values.filter(Boolean) as string[])].sort((a, b) =>
    a.localeCompare(b, "es"),
  );
}

export function getSeguridadJuridicaFacetOptions(
  docs: SeguridadJuridicaFilterableDoc[],
): SeguridadJuridicaFacetOptions {
  return {
    years: uniqueSorted(docs.map((doc) => doc.year)).sort((a, b) => Number(b) - Number(a)),
    authors: uniqueSorted(docs.map((doc) => doc.author)),
    councils: uniqueSorted(docs.map((doc) => doc.council)),
    documentTypes: uniqueSorted(docs.map((doc) => doc.type)),
    themes: uniqueSorted(docs.map((doc) => doc.theme)),
  };
}

export function getDocumentTypeFilterLabel(type: string) {
  const normalized = normalizeText(type);
  if (normalized === "poster") {
    return "Material gráfico";
  }
  return type;
}

export function hasActiveSeguridadJuridicaFilters(filters: SeguridadJuridicaFilters) {
  return Boolean(
    filters.query ||
      filters.year ||
      filters.author ||
      filters.council ||
      filters.documentType ||
      filters.theme,
  );
}

export const SEGURIDAD_JURIDICA_FEATURED_KEYWORDS = [
  "Titulación",
  "Fortalecimiento",
  "Protección",
  "Género",
  "Consejo Comunitario",
  "Diplomado",
  "territorio ancestral",
  "SIG",
  "ciénaga",
] as const;
