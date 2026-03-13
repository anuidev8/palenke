"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { Expand, FileText, PlayCircle, Quote, Search, X } from "lucide-react";
import { runBibliotecaAiSearch, type BibliotecaAiAnswer } from "@/lib/ai-search";
import type { DocumentRecord, ViewerRole } from "@/lib/mock-data";
import { withRole } from "@/lib/viewer";

type ActiveFilter = {
  label: string;
  href: string;
};

type FoundTypeSummary = {
  kind: "video" | "document";
  label: string;
  count: number;
};

type FoundItem = {
  id: string;
  kind: "video" | "document";
  type: string;
  title: string;
  section: string;
  year: number;
  href: string;
};

const HISTORY_STORAGE_KEY = "palenke-biblioteca-search-history-v3";

const visibilityLabel = {
  public: "Público",
  internal: "Uso interno",
  sensitive: "Sensible",
} as const;

function readStoredHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) {
      return [] as string[];
    }

    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === "string").slice(0, 5);
    }
  } catch {
    // Ignore local storage parse errors.
  }

  return [] as string[];
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getHighlightTokens(query: string) {
  return query
    .trim()
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 2);
}

function HighlightText({ text, query }: { text: string; query: string }) {
  const tokens = getHighlightTokens(query);

  if (tokens.length === 0) {
    return <>{text}</>;
  }

  const pattern = new RegExp(`(${tokens.map(escapeRegex).join("|")})`, "gi");
  const parts = text.split(pattern);

  return (
    <>
      {parts.map((part, index) => {
        const isMatch = tokens.some((token) => token.toLowerCase() === part.toLowerCase());

        if (!isMatch) {
          return <span key={`${part}-${index}`}>{part}</span>;
        }

        return (
          <mark
            key={`${part}-${index}`}
            className="rounded-sm bg-[color:var(--search-surface-strong)] px-0.5 text-[color:var(--forest)]"
          >
            {part}
          </mark>
        );
      })}
    </>
  );
}

function getContentKind(type: string): "video" | "document" {
  return type.toLowerCase().includes("video") ? "video" : "document";
}

function buildFoundTypeSummary(documents: DocumentRecord[]) {
  let video = 0;
  let document = 0;

  for (const item of documents) {
    if (getContentKind(item.type) === "video") {
      video += 1;
    } else {
      document += 1;
    }
  }

  const summary: FoundTypeSummary[] = [];
  if (video > 0) {
    summary.push({ kind: "video", label: "Videos", count: video });
  }
  if (document > 0) {
    summary.push({ kind: "document", label: "Documentos", count: document });
  }

  return summary;
}

function ActiveFilterChips({
  activeFilters,
  clearFiltersHref,
}: {
  activeFilters: ActiveFilter[];
  clearFiltersHref: string;
}) {
  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Filtros activos">
      {activeFilters.map((filter) => (
        <Link
          key={`${filter.label}-${filter.href}`}
          href={filter.href}
          className="chip transition hover:border-[color:var(--search-accent-strong)]"
        >
          <span>{filter.label}</span>
          <span aria-hidden="true">×</span>
        </Link>
      ))}
      <Link href={clearFiltersHref} className="button-ghost">
        Limpiar filtros
      </Link>
    </div>
  );
}

function SearchInsights({
  role,
  query,
  answer,
  foundTypeSummary,
  foundItems,
  prefersReducedMotion,
  softTransition,
}: {
  role: ViewerRole;
  query: string;
  answer: BibliotecaAiAnswer;
  foundTypeSummary: FoundTypeSummary[];
  foundItems: FoundItem[];
  prefersReducedMotion: boolean | null;
  softTransition: { duration: number; ease?: "easeOut" };
}) {
  return (
    <motion.section
      key={`result-${query}`}
      role="region"
      aria-labelledby="search-summary-title"
      className="space-y-5 rounded-[28px] border border-[color:var(--search-border)] bg-white/95 p-5 shadow-[var(--shadow-card)]"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={softTransition}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {foundTypeSummary.map((summary, index) => (
          <motion.div
            key={summary.kind}
            className="rounded-[22px] border border-[color:var(--search-border)] bg-[color:var(--surface)] p-4"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...softTransition, delay: prefersReducedMotion ? 0 : index * 0.05 }}
          >
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">
              {summary.kind === "video" ? (
                <PlayCircle className="h-4 w-4 text-[color:var(--search-accent)]" aria-hidden="true" />
              ) : (
                <FileText className="h-4 w-4 text-[color:var(--search-accent)]" aria-hidden="true" />
              )}
              {summary.label}
            </div>
            <p className="mt-2 font-display text-4xl text-[color:var(--forest)]">{summary.count}</p>
          </motion.div>
        ))}
      </div>

      {foundItems.length > 0 ? (
        <div className="rounded-[22px] border border-[color:var(--search-border)] bg-[color:rgb(236_245_248_/_0.82)] p-4">
          <h3 className="text-sm font-semibold text-[color:var(--forest)]">Elementos encontrados</h3>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {foundItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...softTransition, delay: prefersReducedMotion ? 0 : 0.03 * index }}
              >
                <Link
                  href={item.href}
                  className="block rounded-[18px] border border-[color:var(--search-border)] bg-white px-3 py-3 hover:border-[color:var(--search-accent-strong)]"
                >
                  <p className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">
                    {item.kind === "video" ? (
                      <PlayCircle className="h-3.5 w-3.5 text-[color:var(--search-accent)]" aria-hidden="true" />
                    ) : (
                      <FileText className="h-3.5 w-3.5 text-[color:var(--search-accent)]" aria-hidden="true" />
                    )}
                    {item.type} · {item.year}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[color:var(--forest)]">{item.title}</p>
                  <p className="mt-1 text-xs text-[color:var(--muted)]">{item.section}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1.12fr_0.88fr]">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--search-border-strong)] bg-[color:var(--search-surface-strong)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--forest)]">
            <Search className="h-3.5 w-3.5 text-[color:var(--search-accent)]" aria-hidden="true" />
            Resultado de búsqueda
          </div>
          <div>
            <h3 id="search-summary-title" className="font-display text-2xl text-[color:var(--forest)]">
              Lectura rápida para: “{query}”
            </h3>
            <p className="mt-2 text-sm leading-6 text-[color:var(--muted-strong)]">{answer.summary}</p>
          </div>
          <ul className="space-y-3">
            {answer.keyPoints.map((point, index) => {
              const citation = answer.citations[index];
              const href = citation ? withRole(`/biblioteca/${citation.slug}`, role) : null;

              return (
                <li
                  key={`${point}-${index}`}
                  className="rounded-[20px] border border-[color:var(--search-border)] bg-[color:var(--surface)] p-3"
                >
                  <p className="text-sm leading-6 text-[color:var(--forest)]">{point}</p>
                  {href ? (
                    <Link
                      href={href}
                      className="mt-2 inline-flex items-center text-xs font-semibold text-[color:var(--search-accent)] hover:text-[color:var(--search-accent-strong)]"
                    >
                      Abrir documento relacionado
                    </Link>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="flex items-center gap-2 text-sm font-semibold text-[color:var(--forest)]">
            <Quote className="h-4 w-4 text-[color:var(--search-accent)]" aria-hidden="true" />
            Citas destacadas
          </h4>
          <ul className="space-y-3">
            {answer.citations.map((citation) => (
              <li
                key={citation.documentId}
                className="rounded-[20px] border border-[color:var(--search-border)] bg-[color:rgb(236_245_248_/_0.84)] p-3"
              >
                <p className="text-xs text-[color:var(--muted)]">
                  {citation.section} · {citation.territory} · {citation.year} · {visibilityLabel[citation.visibility]}
                </p>
                <blockquote className="mt-2 text-sm leading-6 text-[color:var(--forest)]">
                  <HighlightText text={citation.quote} query={query} />
                </blockquote>
                <Link
                  href={withRole(`/biblioteca/${citation.slug}`, role)}
                  className="mt-2 inline-flex items-center text-xs font-semibold text-[color:var(--search-accent)] hover:text-[color:var(--search-accent-strong)]"
                >
                  Ver fuente
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.section>
  );
}

function SearchLoadingSkeleton({
  prefersReducedMotion,
  softTransition,
}: {
  prefersReducedMotion: boolean | null;
  softTransition: { duration: number; ease?: "easeOut" };
}) {
  return (
    <motion.section
      key="search-loading"
      role="status"
      aria-live="polite"
      className="space-y-4 rounded-[28px] border border-[color:var(--search-border)] bg-white/95 p-5 shadow-[var(--shadow-card)]"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={softTransition}
    >
      <span className="sr-only">Buscando contenido</span>
      <p className="text-sm font-semibold text-[color:var(--search-accent)]">Buscando coincidencias…</p>

      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={`summary-${index}`}
            className="h-[94px] animate-pulse rounded-[20px] border border-[color:var(--search-border)] bg-[color:rgb(236_245_248_/_0.7)]"
          />
        ))}
      </div>

      <div className="space-y-3 rounded-[22px] border border-[color:var(--search-border)] bg-[color:rgb(236_245_248_/_0.62)] p-4">
        <div className="h-4 w-44 animate-pulse rounded bg-[color:var(--search-border-strong)]" />
        <div className="grid gap-3 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`result-${index}`}
              className="space-y-2 rounded-[16px] border border-[color:var(--search-border)] bg-white p-3"
            >
              <div className="h-3 w-24 animate-pulse rounded bg-[color:var(--search-border)]" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-[color:var(--search-border-strong)]" />
              <div className="h-3 w-2/3 animate-pulse rounded bg-[color:var(--search-border)]" />
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

export default function BibliotecaAiSearchPanel({
  role,
  documents,
  initialQuery = "",
  activeFilters,
  clearFiltersHref,
  showInlineSummary = true,
  showDock = true,
  startOpen = false,
}: {
  role: ViewerRole;
  documents: DocumentRecord[];
  initialQuery?: string;
  activeFilters: ActiveFilter[];
  clearFiltersHref: string;
  showInlineSummary?: boolean;
  showDock?: boolean;
  startOpen?: boolean;
}) {
  const prefersReducedMotion = useReducedMotion();
  const startsOpen = startOpen || initialQuery.trim().length > 0;
  const [searchDraft, setSearchDraft] = useState(initialQuery);
  const [submittedQuery, setSubmittedQuery] = useState(initialQuery.trim());
  const [history, setHistory] = useState<string[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(startsOpen);
  const [isExpandedReady, setIsExpandedReady] = useState(!startsOpen);
  const [isSearching, setIsSearching] = useState(false);

  const query = submittedQuery;
  const { rankedDocuments, answer } = useMemo(
    () => runBibliotecaAiSearch(documents, query),
    [documents, query],
  );

  const foundTypeSummary = useMemo(() => buildFoundTypeSummary(rankedDocuments), [rankedDocuments]);

  const foundItems = useMemo<FoundItem[]>(
    () =>
      rankedDocuments.slice(0, 6).map((document) => ({
        id: document.id,
        kind: getContentKind(document.type),
        type: document.type,
        title: document.title,
        section: document.section,
        year: document.year,
        href: withRole(`/biblioteca/${document.slug}`, role),
      })),
    [rankedDocuments, role],
  );

  const softTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.33, ease: "easeOut" as const };

  const openSearch = useCallback(() => {
    setHistory(readStoredHistory());
    setIsSearchOpen(true);
    setIsExpandedReady(false);
  }, []);

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
    setIsExpandedReady(false);
    setIsSearching(false);
  }, []);

  const applySubmittedQuery = (nextQuery: string) => {
    setSubmittedQuery(nextQuery);
    setIsSearching(nextQuery.length > 0);
  };

  const submitSearch = () => {
    const nextQuery = searchDraft.trim();
    applySubmittedQuery(nextQuery);
    if (!isSearchOpen) {
      openSearch();
      return;
    }
    setIsExpandedReady(true);
  };

  useEffect(() => {
    if (!isSearchOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeSearch();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [closeSearch, isSearchOpen]);

  useEffect(() => {
    if (submittedQuery.length < 2) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setHistory((current) => {
        const next = [submittedQuery, ...current.filter((item) => item !== submittedQuery)].slice(0, 5);
        try {
          localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(next));
        } catch {
          // Ignore local storage errors.
        }

        return next;
      });
    }, 320);

    return () => window.clearTimeout(timeoutId);
  }, [submittedQuery]);

  useEffect(() => {
    if (!isSearching || !isExpandedReady || submittedQuery.length === 0) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setIsSearching(false);
    }, 820);

    return () => window.clearTimeout(timeoutId);
  }, [isExpandedReady, isSearching, submittedQuery]);

  const recentHistory = useMemo(
    () => history.filter((item) => item !== submittedQuery).slice(0, 4),
    [history, submittedQuery],
  );

  return (
    <LayoutGroup id="biblioteca-search-experience">
      {showInlineSummary ? (
        <section className="rounded-[22px] border border-[color:var(--search-border)] bg-[color:rgb(236_245_248_/_0.68)] p-4 shadow-[0_8px_22px_rgba(13,31,10,0.06)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl leading-tight text-[color:var(--forest)]">Resultados documentales</h2>
              <p className="mt-1 text-sm text-[color:var(--muted)]" role="status" aria-live="polite">
                {rankedDocuments.length} documento{rankedDocuments.length === 1 ? "" : "s"} encontrados
              </p>
            </div>
            <button
              type="button"
              onClick={openSearch}
              className="inline-flex items-center gap-2 rounded-full border border-[color:var(--search-border-strong)] bg-white px-4 py-2 text-sm font-medium text-[color:var(--forest)] hover:border-[color:var(--search-accent-strong)]"
            >
              <Search className="h-4 w-4 text-[color:var(--search-accent)]" aria-hidden="true" />
              Abrir búsqueda
            </button>
          </div>

          <p className="mt-3 text-sm text-[color:var(--muted-strong)]">
            {query ? `Consulta activa: “${query}”` : "Escribe en el buscador inferior para expandir a pantalla completa."}
          </p>

          <div className="mt-3">
            <ActiveFilterChips activeFilters={activeFilters} clearFiltersHref={clearFiltersHref} />
          </div>
        </section>
      ) : null}

      <AnimatePresence>
        {isSearchOpen ? (
          <motion.div
            className="fixed inset-0 z-[70] bg-[color:rgb(236_245_248_/_0.86)] p-2 sm:p-4"
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
            transition={softTransition}
          >
            <motion.section
              role="region"
              aria-label="Búsqueda en Biblioteca"
              className="mx-auto flex h-full w-full max-w-7xl flex-col overflow-hidden rounded-[30px] border border-[color:var(--search-border)] bg-[color:rgb(240_247_250_/_0.98)] shadow-[0_28px_90px_rgba(8,43,58,0.28)]"
              variants={{
                closed: prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20, scale: 0.99 },
                open: { opacity: 1, y: 0, scale: 1 },
              }}
              initial="closed"
              animate="open"
              exit="closed"
              transition={softTransition}
              onAnimationComplete={(definition) => {
                if (definition === "open") {
                  setIsExpandedReady(true);
                }
              }}
            >
              <header className="flex items-center justify-between border-b border-[color:var(--search-border)] px-5 py-4 sm:px-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--search-accent)]">Búsqueda</p>
                  <h3 className="font-display text-2xl text-[color:var(--forest)]">Búsqueda en Biblioteca</h3>
                </div>
                <button
                  type="button"
                  onClick={closeSearch}
                  className="inline-flex items-center gap-2 rounded-full border border-[color:var(--search-border-strong)] bg-white px-4 py-2 text-sm text-[color:var(--forest)] hover:border-[color:var(--search-accent-strong)]"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                  Cerrar
                </button>
              </header>

              <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
                <motion.form
                  layoutId="search-shell"
                  onSubmit={(event) => {
                    event.preventDefault();
                    submitSearch();
                  }}
                  className="rounded-[24px] border border-[color:var(--search-border)] bg-white/92 p-4 sm:p-5"
                >
                  <label
                    htmlFor="search-modal-input"
                    className="mb-2 flex items-center gap-2 text-sm font-semibold text-[color:var(--forest)]"
                  >
                    <Search className="h-4 w-4 text-[color:var(--search-accent)]" aria-hidden="true" />
                    Buscar en Biblioteca
                  </label>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <input
                      id="search-modal-input"
                      type="search"
                      value={searchDraft}
                      autoFocus
                      onChange={(event) => setSearchDraft(event.target.value)}
                      placeholder="Escribe y descubre documentos, videos y pistas clave…"
                      className="input-shell focus:border-[color:var(--search-accent-strong)] focus:shadow-[0_0_0_4px_var(--search-ring)]"
                      aria-describedby="search-modal-hint"
                    />
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center rounded-full border border-[color:var(--search-border-strong)] bg-[color:var(--search-accent)] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[color:var(--search-accent-strong)] sm:shrink-0"
                    >
                      Buscar
                    </button>
                    {query ? (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchDraft("");
                          applySubmittedQuery("");
                        }}
                        className="button-ghost sm:shrink-0"
                      >
                        Limpiar
                      </button>
                    ) : null}
                  </div>
                  <p id="search-modal-hint" className="mt-2 text-xs text-[color:var(--muted)]">
                    La búsqueda se realiza en esta misma página y muestra resultados al finalizar la expansión.
                  </p>

                  {recentHistory.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {recentHistory.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => {
                            setSearchDraft(item);
                            applySubmittedQuery(item);
                            setIsExpandedReady(true);
                          }}
                          className="chip cursor-pointer hover:border-[color:var(--search-accent-strong)]"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </motion.form>

                <ActiveFilterChips activeFilters={activeFilters} clearFiltersHref={clearFiltersHref} />

                {!isExpandedReady ? (
                  <motion.div
                    key="expanding"
                    className="rounded-[24px] border border-[color:var(--search-border)] bg-white/90 p-6 text-sm text-[color:var(--muted-strong)]"
                    initial={prefersReducedMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={softTransition}
                  >
                    Expandiendo búsqueda…
                  </motion.div>
                ) : isSearching ? (
                  <SearchLoadingSkeleton prefersReducedMotion={prefersReducedMotion} softTransition={softTransition} />
                ) : query && answer ? (
                  <SearchInsights
                    role={role}
                    query={query}
                    answer={answer}
                    foundTypeSummary={foundTypeSummary}
                    foundItems={foundItems}
                    prefersReducedMotion={prefersReducedMotion}
                    softTransition={softTransition}
                  />
                ) : (
                  <div className="rounded-[24px] border border-[color:var(--search-border)] bg-white/90 p-6 text-sm text-[color:var(--muted-strong)]">
                    Escribe una consulta para mostrar contenido encontrado en esta vista.
                  </div>
                )}
              </div>
            </motion.section>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {showDock ? (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50">
          <div className="pointer-events-auto mx-auto w-full max-w-2xl px-3 pb-3 sm:px-6">
            <motion.form
              layoutId="search-shell"
              onSubmit={(event) => {
                event.preventDefault();
                submitSearch();
              }}
              role="search"
              aria-label="Búsqueda en Biblioteca"
              className="rounded-[16px] border border-[color:var(--search-border-strong)] bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(225,239,244,0.96))] px-2 py-2 shadow-[0_-8px_22px_rgba(8,43,58,0.16)] backdrop-blur"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={softTransition}
            >
              <div className="flex items-center gap-2 rounded-[12px] border border-[color:var(--search-border)] bg-white px-3 py-2 focus-within:border-[color:var(--search-accent-strong)] focus-within:shadow-[0_0_0_4px_var(--search-ring)]">
                <Search className="h-4 w-4 shrink-0 text-[color:var(--search-accent)]" aria-hidden="true" />
                <input
                  id="search-dock-input"
                  type="search"
                  value={searchDraft}
                  onChange={(event) => {
                    const value = event.target.value;
                    setSearchDraft(value);
                    if (!isSearchOpen && value.trim().length > 0) {
                      openSearch();
                    }
                  }}
                  placeholder="Buscar en Biblioteca…"
                  className="w-full bg-transparent text-sm text-[color:var(--forest)] outline-none placeholder:text-[color:var(--muted)]"
                />
                <button
                  type="submit"
                  aria-label="Buscar"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[color:var(--search-border-strong)] text-[color:var(--forest)] hover:border-[color:var(--search-accent-strong)]"
                >
                  <Search className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={openSearch}
                  aria-label="Expandir búsqueda"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[color:var(--search-border-strong)] text-[color:var(--forest)] hover:border-[color:var(--search-accent-strong)]"
                >
                  <Expand className="h-4 w-4" aria-hidden="true" />
                </button>
                {query ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchDraft("");
                      applySubmittedQuery("");
                    }}
                    aria-label="Limpiar búsqueda"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[color:var(--search-border-strong)] text-[color:var(--forest)] hover:border-[color:var(--search-accent-strong)]"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                ) : null}
              </div>
            </motion.form>
          </div>
        </div>
      ) : null}
    </LayoutGroup>
  );
}
