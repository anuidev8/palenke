import type { ScitaReport } from "@/lib/mock-reports-store";

export const SCITA_REPORTS_STORAGE_KEY = "palenke-scita-reports-v1";

function isBrowser() {
  return typeof window !== "undefined";
}

export function loadClientScitaReports(): ScitaReport[] {
  if (!isBrowser()) return [];

  try {
    const raw = window.localStorage.getItem(SCITA_REPORTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is ScitaReport =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as ScitaReport).id === "string" &&
        typeof (item as ScitaReport).descripcion === "string" &&
        typeof (item as ScitaReport).created_at === "string",
    );
  } catch {
    return [];
  }
}

export function appendClientScitaReport(
  report: Omit<ScitaReport, "id" | "created_at">,
): ScitaReport {
  const newReport: ScitaReport = {
    ...report,
    id: `local-report-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    created_at: new Date().toISOString(),
  };

  if (!isBrowser()) return newReport;

  const existing = loadClientScitaReports();
  window.localStorage.setItem(
    SCITA_REPORTS_STORAGE_KEY,
    JSON.stringify([newReport, ...existing]),
  );
  return newReport;
}

function reportContentKey(report: ScitaReport): string {
  const createdMinute = report.created_at.slice(0, 16);
  return [
    report.descripcion.trim().toLowerCase(),
    report.categoria,
    report.formato,
    report.tablero_origen ?? "",
    (report.nombre ?? "").trim().toLowerCase(),
    (report.contacto ?? "").trim().toLowerCase(),
    createdMinute,
  ].join("|");
}

export function mergeScitaReports(base: ScitaReport[], extra: ScitaReport[]): ScitaReport[] {
  const seenIds = new Set<string>();
  const seenContent = new Set<string>();
  const merged: ScitaReport[] = [];

  // Prefer server/DB rows when the same alert was also saved in localStorage.
  for (const report of [...base, ...extra]) {
    if (seenIds.has(report.id)) continue;

    const contentKey = reportContentKey(report);
    if (seenContent.has(contentKey)) continue;

    seenIds.add(report.id);
    seenContent.add(contentKey);
    merged.push(report);
  }

  return merged.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}
