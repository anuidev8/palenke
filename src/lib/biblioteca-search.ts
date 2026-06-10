import MiniSearch from "minisearch";
import type { DocumentRecord } from "@/lib/mock-data";
import {
  NORMATIVA_FEATURED_KEYWORDS,
  NORMATIVA_KEYWORD_INDEX,
  type NormativaKeywordEntry,
} from "@/lib/normativa-keywords";

export { NORMATIVA_FEATURED_KEYWORDS };

export type NormativaSearchContext = {
  matchedKeywords: NormativaKeywordEntry[];
  relatedNorms: string[];
};

export type DocumentSearchResult = {
  document: DocumentRecord;
  score: number;
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

export function parseNormReference(reference: string) {
  const leyMatch = reference.match(/Ley\s+0*(\d+)/i);
  if (leyMatch) {
    return { kind: "ley" as const, number: leyMatch[1] };
  }

  const decreeMatch = reference.match(/Decreto\s+0*(\d+)/i);
  if (decreeMatch) {
    return { kind: "decreto" as const, number: decreeMatch[1] };
  }

  const sentenceMatch = reference.match(/(?:Sentencia\s+)?([TC]-\d+)/i);
  if (sentenceMatch) {
    return { kind: "sentencia" as const, number: sentenceMatch[1].toUpperCase() };
  }

  return null;
}

function documentMatchesNormReference(document: DocumentRecord, reference: string) {
  const parsed = parseNormReference(reference);
  if (!parsed) {
    return false;
  }

  const haystack = normalizeText(
    `${document.title} ${document.keywords.join(" ")} ${document.description}`,
  );

  if (parsed.kind === "ley") {
    return (
      haystack.includes(`ley ${parsed.number}`) ||
      haystack.includes(`ley ${parsed.number} de`)
    );
  }

  if (parsed.kind === "decreto") {
    return (
      haystack.includes(`decreto ${parsed.number}`) ||
      haystack.includes(`decreto 0${parsed.number}`)
    );
  }

  return haystack.includes(parsed.number.toLowerCase());
}

function buildDocumentSearchText(document: DocumentRecord) {
  return [
    document.title,
    document.description,
    document.keywords.join(" "),
    document.type,
    document.section,
    document.territory,
    String(document.year),
  ].join(" ");
}

let keywordMiniSearch: MiniSearch | null = null;

function getKeywordMiniSearch() {
  if (keywordMiniSearch) {
    return keywordMiniSearch;
  }

  keywordMiniSearch = new MiniSearch({
    fields: ["keyword", "topic", "norms"],
    storeFields: ["keyword", "primaryDecree", "relatedDecrees", "topic"],
    searchOptions: {
      fuzzy: 0.2,
      prefix: (term) => term.length > 3,
      boost: { keyword: 3, topic: 1.5, norms: 2 },
    },
  });

  keywordMiniSearch.addAll(
    NORMATIVA_KEYWORD_INDEX.map((entry, index) => ({
      id: index,
      keyword: entry.keyword,
      topic: entry.topic,
      norms: [entry.primaryDecree, ...entry.relatedDecrees].join(" "),
      primaryDecree: entry.primaryDecree,
      relatedDecrees: entry.relatedDecrees,
    })),
  );

  return keywordMiniSearch;
}

export function resolveNormativaSearchContext(query: string): NormativaSearchContext {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) {
    return { matchedKeywords: [], relatedNorms: [] };
  }

  const miniSearch = getKeywordMiniSearch();
  const keywordMatches = miniSearch.search(trimmedQuery, { combineWith: "AND" });
  const fuzzyMatches =
    keywordMatches.length > 0
      ? keywordMatches
      : miniSearch.search(trimmedQuery, { fuzzy: 0.2, prefix: true });

  const matchedKeywords = fuzzyMatches
    .slice(0, 5)
    .map((result) => NORMATIVA_KEYWORD_INDEX[Number(result.id)]);

  const relatedNorms = Array.from(
    new Set(
      matchedKeywords.flatMap((entry) => [entry.primaryDecree, ...entry.relatedDecrees]),
    ),
  );

  return { matchedKeywords, relatedNorms };
}

export function suggestNormativaKeywords(partialQuery: string, limit = 8) {
  const trimmedQuery = partialQuery.trim();
  if (trimmedQuery.length < 2) {
    return NORMATIVA_FEATURED_KEYWORDS.slice(0, limit);
  }

  const miniSearch = getKeywordMiniSearch();
  const results = miniSearch.search(trimmedQuery, { fuzzy: 0.2, prefix: true });

  return results
    .slice(0, limit)
    .map((result) => NORMATIVA_KEYWORD_INDEX[Number(result.id)]?.keyword)
    .filter((keyword): keyword is string => Boolean(keyword));
}

function scoreDocument(
  document: DocumentRecord,
  query: string,
  context: NormativaSearchContext,
) {
  const normalizedQuery = normalizeText(query);
  const searchText = normalizeText(buildDocumentSearchText(document));
  const tokens = tokenize(query);

  if (tokens.length === 0 && normalizedQuery.length < 2) {
    return 0;
  }

  let score = 0;

  if (normalizedQuery && searchText.includes(normalizedQuery)) {
    score += 12;
  }

  if (normalizeText(document.title).includes(normalizedQuery)) {
    score += 10;
  }

  for (const token of tokens) {
    if (normalizeText(document.title).includes(token)) {
      score += 7;
    }
    if (document.keywords.some((keyword) => normalizeText(keyword).includes(token))) {
      score += 6;
    }
    if (normalizeText(document.description).includes(token)) {
      score += 2;
    }
  }

  for (const entry of context.matchedKeywords) {
    if (normalizeText(document.title).includes(normalizeText(entry.keyword))) {
      score += 8;
    }
    if (documentMatchesNormReference(document, entry.primaryDecree)) {
      score += 14;
    }
    for (const related of entry.relatedDecrees) {
      if (documentMatchesNormReference(document, related)) {
        const parsed = parseNormReference(related);
        const isPrimaryLawMatch =
          parsed?.kind === "ley" && document.type === "Ley" && documentMatchesNormReference(document, related);
        const isDecreeMatch = parsed?.kind === "decreto";

        if (isPrimaryLawMatch || isDecreeMatch) {
          score += 10;
        }
      }
    }
    if (normalizeText(document.description).includes(normalizeText(entry.topic))) {
      score += 4;
    }
  }

  for (const norm of context.relatedNorms) {
    const parsed = parseNormReference(norm);
    if (parsed?.kind === "decreto" && documentMatchesNormReference(document, norm)) {
      score += 9;
    }
    if (parsed?.kind === "ley" && document.type === "Ley" && documentMatchesNormReference(document, norm)) {
      score += 9;
    }
  }

  if (tokens.some((token) => token === String(document.year))) {
    score += 2;
  }

  return score;
}

export function searchDocuments(documents: DocumentRecord[], query: string): DocumentSearchResult[] {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) {
    return documents.map((document) => ({ document, score: 0 }));
  }

  const context = resolveNormativaSearchContext(trimmedQuery);
  const scored = documents.map((document) => ({
    document,
    score: scoreDocument(document, trimmedQuery, context),
  }));

  const ranked = scored.toSorted((left, right) => {
    if (right.score !== left.score) {
      return right.score - left.score;
    }
    return right.document.year - left.document.year;
  });

  const hasMatches = ranked.some((entry) => entry.score > 0);
  if (hasMatches) {
    return ranked.filter((entry) => entry.score > 0);
  }

  const documentMiniSearch = new MiniSearch({
    fields: ["title", "description", "keywords"],
    storeFields: ["documentId"],
    searchOptions: {
      fuzzy: 0.2,
      prefix: (term) => term.length > 3,
      boost: { title: 3, keywords: 2, description: 1 },
    },
  });

  documentMiniSearch.addAll(
    documents.map((document) => ({
      id: document.id,
      documentId: document.id,
      title: document.title,
      description: document.description,
      keywords: document.keywords.join(" "),
    })),
  );

  const fuzzyResults = documentMiniSearch.search(trimmedQuery, { fuzzy: 0.2, prefix: true });
  if (fuzzyResults.length === 0) {
    return [];
  }

  const scoreById = new Map(fuzzyResults.map((result) => [String(result.id), result.score]));
  return documents
    .filter((document) => scoreById.has(document.id))
    .map((document) => ({
      document,
      score: scoreById.get(document.id) ?? 0,
    }))
    .toSorted((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }
      return right.document.year - left.document.year;
    });
}

export function documentMatchesQuery(document: DocumentRecord, query: string) {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) {
    return true;
  }

  return searchDocuments([document], trimmedQuery).length > 0;
}
