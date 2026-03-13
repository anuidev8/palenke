"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import BibliotecaAiSearchPanel from "@/components/palenke/BibliotecaAiSearchPanel";
import type { DocumentRecord, ViewerRole } from "@/lib/mock-data";
import { withRole } from "@/lib/viewer";

function resolveRole(rawRole: string | null): ViewerRole {
  if (rawRole === "internal" || rawRole === "admin") {
    return rawRole;
  }

  return "public";
}

export default function GlobalBibliotecaSearchDock({
  documents,
}: {
  documents: DocumentRecord[];
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isScrolled, setIsScrolled] = useState(false);
  const [openSignal, setOpenSignal] = useState(0);
  const isHome = pathname === "/";

  const role = resolveRole(searchParams.get("role"));
  const initialQuery = searchParams.get("aiq") ?? "";
  const visibleDocuments = useMemo(() => {
    if (role === "public") {
      return documents.filter((item) => item.visibility === "public");
    }

    return documents;
  }, [documents, role]);

  useEffect(() => {
    if (!isHome) {
      return;
    }

    const onScroll = () => {
      setIsScrolled(window.scrollY > 120);
    };

    const onOpenFromHero = () => {
      setOpenSignal((current) => current + 1);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("palenke-search-open", onOpenFromHero as EventListener);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("palenke-search-open", onOpenFromHero as EventListener);
    };
  }, [isHome]);

  // Only render this global dock on home landing.
  if (!isHome) {
    return null;
  }

  return (
    <BibliotecaAiSearchPanel
      key={`home-search-${openSignal}`}
      role={role}
      documents={visibleDocuments}
      initialQuery={initialQuery}
      activeFilters={[]}
      clearFiltersHref={withRole("/biblioteca", role)}
      showInlineSummary={false}
      showDock={isScrolled}
      startOpen={openSignal > 0 || initialQuery.trim().length > 0}
    />
  );
}
