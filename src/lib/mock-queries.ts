import type { DashboardRecord, DocumentRecord } from "@/lib/mock-data";

export type LibraryFilters = {
  query: string;
  sections: string[];
  territory: string;
  type: string;
  year: string;
  genderOnly: boolean;
};

export type DashboardFilters = {
  topic: string;
  territory: string;
};

export function filterDocuments(documents: DocumentRecord[], filters: LibraryFilters) {
  return documents.filter((document) => {
    const matchesQuery =
      !filters.query ||
      `${document.title} ${document.description} ${document.keywords.join(" ")}`
        .toLowerCase()
        .includes(filters.query.toLowerCase());

    const matchesSection =
      filters.sections.length === 0 || filters.sections.includes(document.section);

    const matchesTerritory = !filters.territory || document.territory === filters.territory;
    const matchesType = !filters.type || document.type === filters.type;
    const matchesYear = !filters.year || String(document.year) === filters.year;
    const matchesGender = !filters.genderOnly || document.genderFocus;

    return (
      matchesQuery &&
      matchesSection &&
      matchesTerritory &&
      matchesType &&
      matchesYear &&
      matchesGender
    );
  });
}

export function filterDashboards(dashboards: DashboardRecord[], filters: DashboardFilters) {
  return dashboards.filter((dashboard) => {
    const matchesTopic = !filters.topic || dashboard.topic === filters.topic;
    const matchesTerritory =
      !filters.territory || dashboard.territory.toLowerCase().includes(filters.territory.toLowerCase());

    return matchesTopic && matchesTerritory;
  });
}

export function getDocumentYears(documents: DocumentRecord[]) {
  return Array.from(new Set(documents.map((document) => String(document.year)))).toSorted((a, b) =>
    Number(b) - Number(a),
  );
}

export function getDashboardTopics(dashboards: DashboardRecord[]) {
  return Array.from(new Set(dashboards.map((dashboard) => dashboard.topic))).toSorted();
}

