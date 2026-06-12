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

export type SeguridadJuridicaFrequentTopic = {
  label: string;
  count: number;
  kind: "theme" | "topic";
};

type TopicPattern = {
  label: string;
  patterns: RegExp[];
};

const SEGURIDAD_JURIDICA_TOPIC_PATTERNS: TopicPattern[] = [
  { label: "Territorio ancestral", patterns: [/territorio ancestral/i] },
  { label: "Minería", patterns: [/miner[ií]a/i] },
  { label: "Ciénaga de La Zapatosa", patterns: [/ci[eé]naga/i, /zapatosa/i] },
  { label: "SIG", patterns: [/\bSIG\b/] },
  {
    label: "Soberanía alimentaria",
    patterns: [/soberan[ií]a alimentaria/i, /seguridad y soberan[ií]a alimentaria/i, /seguridad alimentaria/i],
  },
  { label: "Resguardos indígenas", patterns: [/resguardos ind[ií]genas/i] },
  { label: "Planificación territorial", patterns: [/planificaci[oó]n territorial/i] },
  { label: "Actividades extractivas", patterns: [/extractivas/i] },
  { label: "Producción agrícola", patterns: [/producci[oó]n agr[ií]cola/i] },
  { label: "Población afropesquera", patterns: [/afropesquera/i] },
  { label: "Información propia", patterns: [/informaci[oó]n propia/i] },
  { label: "Centros poblados", patterns: [/centros poblados/i] },
  { label: "Derechos colectivos", patterns: [/derechos colectivos/i] },
  {
    label: "Relaciones de género",
    patterns: [/relaciones de g[eé]nero/i, /diferencias construidas/i],
  },
  { label: "Titulación colectiva", patterns: [/titulaci[oó]n colectiva/i] },
  { label: "Conflictos socioterritoriales", patterns: [/conflictos socioterritoriales/i] },
  { label: "Cosmovisión del territorio", patterns: [/cosmovisi[oó]n/i] },
];

function getDocumentTopicText(doc: SeguridadJuridicaFilterableDoc) {
  const subtheme = doc.subtheme?.split("/")[0]?.trim() ?? "";
  return [doc.title, subtheme].filter(Boolean).join(" ");
}

function countByLabel(
  docs: SeguridadJuridicaFilterableDoc[],
  getLabels: (doc: SeguridadJuridicaFilterableDoc) => string[],
) {
  const counts = new Map<string, number>();

  for (const doc of docs) {
    const labels = new Set(getLabels(doc));
    for (const label of labels) {
      counts.set(label, (counts.get(label) ?? 0) + 1);
    }
  }

  return counts;
}

export function getSeguridadJuridicaFrequentTopics(
  docs: SeguridadJuridicaFilterableDoc[],
): SeguridadJuridicaFrequentTopic[] {
  const themeCounts = countByLabel(docs, (doc) => (doc.theme ? [doc.theme] : []));
  const topicCounts = countByLabel(docs, (doc) => {
    const text = getDocumentTopicText(doc);
    return SEGURIDAD_JURIDICA_TOPIC_PATTERNS.filter(({ patterns }) =>
      patterns.some((pattern) => pattern.test(text)),
    ).map(({ label }) => label);
  });

  const themes: SeguridadJuridicaFrequentTopic[] = [...themeCounts.entries()]
    .map(([label, count]) => ({ label, count, kind: "theme" as const }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, "es"));

  const topics: SeguridadJuridicaFrequentTopic[] = [...topicCounts.entries()]
    .map(([label, count]) => ({ label, count, kind: "topic" as const }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, "es"));

  return [...themes, ...topics];
}

export function getSeguridadJuridicaFrequentTopicLabels(
  topics: SeguridadJuridicaFrequentTopic[],
) {
  return topics.map((topic) => topic.label);
}
