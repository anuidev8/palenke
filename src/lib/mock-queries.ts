import { searchDocuments } from "@/lib/biblioteca-search";
import type { DashboardRecord, DocumentRecord } from "@/lib/mock-data";

export type LibraryFilters = {
  query: string;
  sections: string[];
  territory: string;
  type: string;
  year: string;
  genderOnly: boolean;
  topics: string[];
};

export type DashboardFilters = {
  topic: string;
  territory: string;
};

export function filterDocuments(documents: DocumentRecord[], filters: LibraryFilters) {
  const filtered = documents.filter((document) => {
    const matchesSection =
      filters.sections.length === 0 || filters.sections.includes(document.section);

    const matchesTerritory = !filters.territory || document.territory === filters.territory;
    const matchesType = !filters.type || document.type === filters.type;
    const matchesYear = !filters.year || String(document.year) === filters.year;
    const matchesGender = !filters.genderOnly || document.genderFocus;

    const matchesTopics = !filters.topics || filters.topics.length === 0 || filters.topics.some((topic) => {
      const normalizedTopic = topic.toLowerCase();
      return (
        document.keywords.some((kw) => kw.toLowerCase() === normalizedTopic) ||
        document.title.toLowerCase().includes(normalizedTopic) ||
        document.description.toLowerCase().includes(normalizedTopic)
      );
    });

    return matchesSection && matchesTerritory && matchesType && matchesYear && matchesGender && matchesTopics;
  });

  if (!filters.query.trim()) {
    return filtered;
  }

  return searchDocuments(filtered, filters.query).map((result) => result.document);
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

