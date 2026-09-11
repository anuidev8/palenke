import type { ViewerRole, Visibility } from "@/lib/mock-data";
import {
  canOpenVisibility,
  isAdminRole,
  isInternalRole,
  normalizeViewerRole,
} from "@/lib/auth/permissions";

export type SearchParams = Record<string, string | string[] | undefined>;

export function getFirstParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export function getMultiParam(value: string | string[] | undefined) {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

export function getViewerRole(searchParams: SearchParams | undefined): ViewerRole {
  return normalizeViewerRole(getFirstParam(searchParams?.role));
}

export function getViewerName(role: ViewerRole) {
  if (role === "admin") {
    return "María Torres";
  }

  if (role === "internal") {
    return "Equipo Palenke";
  }

  return "";
}

export function isInternal(role: ViewerRole) {
  return isInternalRole(role);
}

export function isAdmin(role: ViewerRole) {
  return isAdminRole(role);
}

export function canOpenSiteVisibility(role: ViewerRole, visibility: Visibility) {
  return canOpenVisibility(role, visibility);
}

type HrefValue = string | number | boolean | null | undefined;
type HrefParams = Record<string, HrefValue | HrefValue[]>;

export function withRole(path: string, role: ViewerRole, extra?: HrefParams) {
  const params = new URLSearchParams();

  for (const [key, rawValue] of Object.entries(extra ?? {})) {
    if (rawValue === undefined || rawValue === null || rawValue === "") {
      continue;
    }

    const values = Array.isArray(rawValue) ? rawValue : [rawValue];
    for (const value of values) {
      if (value === undefined || value === null || value === "") {
        continue;
      }

      params.append(key, String(value));
    }
  }

  const query = params.toString();
  return query ? `${path}?${query}` : path;
}

export function formatDateRange(startDate: string, endDate?: string) {
  const start = new Date(startDate);
  const startLabel = Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(start);

  if (!endDate) {
    return `${startLabel} - indefinido`;
  }

  const end = new Date(endDate);
  const endLabel = Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(end);

  return `${startLabel} - ${endLabel}`;
}

export function formatVisibility(visibility: Visibility) {
  if (visibility === "public") {
    return { icon: "public", label: "Público (no sensible)", className: "badge-public" } as const;
  }

  if (visibility === "internal") {
    return { icon: "internal", label: "Interno (restringido)", className: "badge-internal" } as const;
  }

  return { icon: "sensitive", label: "Sensible (máxima restricción)", className: "badge-sensitive" } as const;
}
