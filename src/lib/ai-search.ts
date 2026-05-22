import type { DocumentRecord } from "@/lib/mock-data";
import type { PalenkeGalleryMedia } from "@/lib/palenke-gallery-media";

export type BibliotecaAiCitation = {
  documentId: string;
  title: string;
  slug: string;
  section: string;
  territory: string;
  year: number;
  visibility: DocumentRecord["visibility"];
  quote: string;
};

export type BibliotecaAiAnswer = {
  summary: string;
  keyPoints: string[];
  citations: BibliotecaAiCitation[];
};

const STOP_WORDS = new Set([
  "a",
  "al",
  "con",
  "de",
  "del",
  "el",
  "en",
  "la",
  "las",
  "los",
  "para",
  "por",
  "que",
  "se",
  "un",
  "una",
  "y",
]);

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

function tokenize(value: string) {
  return normalizeText(value)
    .split(/[^a-z0-9]+/g)
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token));
}

function countTokenHits(tokens: string[], text: string) {
  const normalized = normalizeText(text);
  let hits = 0;

  for (const token of tokens) {
    if (normalized.includes(token)) {
      hits += 1;
    }
  }

  return hits;
}

function buildQuote(description: string, tokens: string[]) {
  const normalized = normalizeText(description);
  const matchedToken = tokens.find((token) => normalized.includes(token));

  if (!matchedToken) {
    return description.length > 160 ? `${description.slice(0, 160).trim()}…` : description;
  }

  const index = normalized.indexOf(matchedToken);
  const start = Math.max(0, index - 45);
  const end = Math.min(description.length, index + 115);
  const prefix = start > 0 ? "…" : "";
  const suffix = end < description.length ? "…" : "";

  return `${prefix}${description.slice(start, end).trim()}${suffix}`;
}

function scoreDocuments(documents: DocumentRecord[], query: string) {
  const tokens = tokenize(query);
  const scored = documents.map((document) => {
    if (tokens.length === 0) {
      return { document, score: 0 };
    }

    const titleHits = countTokenHits(tokens, document.title);
    const keywordHits = countTokenHits(tokens, document.keywords.join(" "));
    const sectionHits = countTokenHits(tokens, document.section);
    const territoryHits = countTokenHits(tokens, document.territory);
    const typeHits = countTokenHits(tokens, document.type);
    const descriptionHits = countTokenHits(tokens, document.description);

    let score =
      titleHits * 7 +
      keywordHits * 6 +
      sectionHits * 4 +
      territoryHits * 4 +
      typeHits * 3 +
      descriptionHits * 2;

    if (tokens.some((token) => token === String(document.year))) {
      score += 2;
    }

    if (
      document.genderFocus &&
      tokens.some((token) => ["genero", "mujer", "mujeres", "juventud", "ninez", "nina"].includes(token))
    ) {
      score += 2;
    }

    return { document, score };
  });

  const ranked = scored.toSorted((left, right) => {
    if (right.score !== left.score) {
      return right.score - left.score;
    }

    return right.document.year - left.document.year;
  });

  return { ranked, tokens };
}

export function runBibliotecaAiSearch(documents: DocumentRecord[], query: string) {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) {
    return {
      rankedDocuments: documents,
      answer: null as BibliotecaAiAnswer | null,
    };
  }

  const { ranked, tokens } = scoreDocuments(documents, trimmedQuery);
  const matchedDocuments = ranked.filter((item) => item.score > 0);
  const rankedDocuments = (matchedDocuments.length > 0 ? ranked : ranked.toSorted((a, b) => b.document.year - a.document.year)).map(
    (item) => item.document,
  );

  const topDocuments = (matchedDocuments.length > 0 ? matchedDocuments : ranked).slice(0, 3);
  const citations: BibliotecaAiCitation[] = topDocuments.map(({ document }) => ({
    documentId: document.id,
    title: document.title,
    slug: document.slug,
    section: document.section,
    territory: document.territory,
    year: document.year,
    visibility: document.visibility,
    quote: buildQuote(document.description, tokens),
  }));

  const summary =
    matchedDocuments.length > 0
      ? `Encontré ${matchedDocuments.length} documento${matchedDocuments.length === 1 ? "" : "s"} relacionados con “${trimmedQuery}”. Priorizo sección, territorio y palabras clave.`
      : `No encontré coincidencias directas para “${trimmedQuery}”. Te muestro los documentos más recientes dentro de los filtros actuales.`;

  const keyPoints = topDocuments.map(({ document }) => {
    return `${document.section} · ${document.territory} (${document.year}): ${document.title}`;
  });

  return {
    rankedDocuments,
    answer: {
      summary,
      keyPoints,
      citations,
    },
  };
}

export type MediatecaGalleryAiAnswer = {
  summary: string;
  keyPoints: string[];
};

function mediaKindSearchLabel(kind: PalenkeGalleryMedia["kind"]) {
  if (kind === "video") return "video";
  if (kind === "audio") return "audio";
  return "imagen fotografia";
}

function scoreGalleryMedia(items: PalenkeGalleryMedia[], query: string) {
  const tokens = tokenize(query);
  const scored = items.map((item) => {
    if (tokens.length === 0) {
      return { item, score: 0 };
    }

    const titleHits = countTokenHits(tokens, item.title);
    const typeHits = countTokenHits(tokens, item.type);
    const sectionHits = countTokenHits(tokens, item.section);
    const territoryHits = countTokenHits(tokens, item.territory);
    const councilHits = countTokenHits(tokens, item.council);
    const descriptionHits = countTokenHits(tokens, item.description);
    const kindHits = countTokenHits(tokens, mediaKindSearchLabel(item.kind));

    let score =
      titleHits * 7 +
      typeHits * 5 +
      sectionHits * 4 +
      territoryHits * 4 +
      councilHits * 3 +
      kindHits * 3 +
      descriptionHits * 2;

    if (tokens.some((token) => token === String(item.year))) {
      score += 2;
    }

    return { item, score };
  });

  const ranked = scored.toSorted((left, right) => {
    if (right.score !== left.score) {
      return right.score - left.score;
    }
    return right.item.year - left.item.year;
  });

  return { ranked, tokens };
}

export function runMediatecaGallerySearch(items: PalenkeGalleryMedia[], query: string) {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) {
    return {
      rankedItems: items,
      answer: null as MediatecaGalleryAiAnswer | null,
    };
  }

  const { ranked } = scoreGalleryMedia(items, trimmedQuery);
  const matchedItems = ranked.filter((entry) => entry.score > 0);
  const rankedItems = ranked.map((entry) => entry.item);

  const topItems = (matchedItems.length > 0 ? matchedItems : ranked).slice(0, 3);
  const summary =
    matchedItems.length > 0
      ? `Encontré ${matchedItems.length} pieza${matchedItems.length === 1 ? "" : "s"} relacionada${matchedItems.length === 1 ? "" : "s"} con “${trimmedQuery}”. Priorizo tipo, territorio y descripción.`
      : `No encontré coincidencias directas para “${trimmedQuery}”. Te muestro las piezas más recientes de la mediateca.`;

  const keyPoints = topItems.map(
    ({ item }) => `${item.type} · ${item.territory} (${item.year})`,
  );

  return {
    rankedItems,
    answer: {
      summary,
      keyPoints,
    },
  };
}
