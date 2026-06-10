"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import {
  NORMATIVA_FEATURED_KEYWORDS,
  resolveNormativaSearchContext,
  suggestNormativaKeywords,
} from "@/lib/biblioteca-search";
import type { ViewerRole } from "@/lib/mock-data";
import { withRole } from "@/lib/viewer";

type BibliotecaSearchBarProps = {
  role: ViewerRole;
  query: string;
  sections: string[];
  territory: string;
  year: string;
  type: string;
  years: readonly string[];
  territories: readonly string[];
  showNormativaKeywords?: boolean;
};

export default function BibliotecaSearchBar({
  role,
  query,
  sections,
  territory,
  year,
  type,
  years,
  territories,
  showNormativaKeywords = false,
}: BibliotecaSearchBarProps) {
  const [draft, setDraft] = useState(query);
  const [isFocused, setIsFocused] = useState(false);

  const suggestions = useMemo(
    () => suggestNormativaKeywords(draft, 8),
    [draft],
  );

  const searchContext = useMemo(
    () => (query.trim() ? resolveNormativaSearchContext(query) : null),
    [query],
  );

  const visibleSuggestions = showNormativaKeywords && isFocused && draft.trim().length > 0
    ? suggestions
    : [];

  const clearHref = withRole(
    "/biblioteca",
    role,
    sections.length > 0 ? { section: sections } : undefined,
  );

  return (
    <div className="space-y-4">
      <form
        action="/biblioteca"
        className="flex flex-wrap items-end gap-3 rounded-[28px] border border-[#e8dfd3] bg-white px-5 py-4"
      >
        <div className="relative flex min-w-[220px] flex-1 flex-col gap-1.5">
          <label htmlFor="q" className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7a756e]">
            Buscar
          </label>
          <input
            id="q"
            name="q"
            type="search"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              window.setTimeout(() => setIsFocused(false), 120);
            }}
            placeholder={
              showNormativaKeywords
                ? "Buscar por palabra clave, decreto o tema…"
                : "Buscar por título o palabra clave…"
            }
            className="input-shell"
            list={showNormativaKeywords ? "biblioteca-keyword-suggestions" : undefined}
            autoComplete="off"
          />

          {showNormativaKeywords ? (
            <datalist id="biblioteca-keyword-suggestions">
              {NORMATIVA_FEATURED_KEYWORDS.map((keyword) => (
                <option key={keyword} value={keyword} />
              ))}
            </datalist>
          ) : null}

          {visibleSuggestions.length > 0 ? (
            <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-20 overflow-hidden rounded-[18px] border border-[#e8dfd3] bg-white shadow-[0_16px_40px_rgba(26,26,26,0.12)]">
              <p className="border-b border-[#f0eae0] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7a756e]">
                Palabras clave sugeridas
              </p>
              <ul className="max-h-56 overflow-y-auto py-1">
                {visibleSuggestions.map((keyword) => (
                  <li key={keyword}>
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-[#1a1a1a] transition hover:bg-[#f8f5f2]"
                      onMouseDown={(event) => {
                        event.preventDefault();
                        setDraft(keyword);
                      }}
                    >
                      <Search className="h-3.5 w-3.5 shrink-0 text-[#2e7d32]" aria-hidden="true" />
                      {keyword}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        {sections.map((section) => (
          <input key={section} type="hidden" name="section" value={section} />
        ))}
        {type ? <input type="hidden" name="type" value={type} /> : null}

        <div className="flex flex-col gap-1.5">
          <label htmlFor="f-territory" className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7a756e]">
            Territorio
          </label>
          <select id="f-territory" name="territory" defaultValue={territory} className="input-shell">
            <option value="">Todos</option>
            {territories.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="f-year" className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7a756e]">
            Año
          </label>
          <select id="f-year" name="year" defaultValue={year} className="input-shell">
            <option value="">Todos</option>
            {years.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="inline-flex h-[44px] items-center rounded-full bg-[#1a1a1a] px-5 text-sm font-semibold text-white transition hover:bg-[#2c2c2c]"
          >
            Buscar
          </button>
          <Link
            href={clearHref}
            className="inline-flex h-[44px] items-center rounded-full border border-[#e8dfd3] px-5 text-sm font-medium text-[#4a4540] transition hover:bg-[#f0eae0]"
          >
            Limpiar
          </Link>
        </div>
      </form>

      {showNormativaKeywords ? (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7a756e]">
              Palabras clave
            </span>
            {NORMATIVA_FEATURED_KEYWORDS.map((keyword) => (
              <Link
                key={keyword}
                href={withRole("/biblioteca", role, {
                  section: sections.length > 0 ? sections : "Normativa vigente",
                  q: keyword,
                })}
                className="inline-flex rounded-full border border-[#d8f3dc] bg-[#f4fbf5] px-3 py-1.5 text-xs font-medium text-[#1b5e20] transition hover:border-[#2e7d32] hover:bg-[#e8f5e9]"
              >
                {keyword}
              </Link>
            ))}
          </div>

          {searchContext && searchContext.matchedKeywords.length > 0 ? (
            <div className="rounded-[20px] border border-[#d8f3dc] bg-[#f4fbf5] px-4 py-3 text-sm text-[#2e4a31]">
              <p>
                Resultados vinculados con{" "}
                <strong>{searchContext.matchedKeywords.map((entry) => entry.keyword).join(", ")}</strong>
                {searchContext.relatedNorms.length > 0 ? (
                  <>
                    {" "}
                    y normas relacionadas: {searchContext.relatedNorms.slice(0, 4).join(" · ")}
                    {searchContext.relatedNorms.length > 4 ? "…" : ""}
                  </>
                ) : null}
              </p>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
