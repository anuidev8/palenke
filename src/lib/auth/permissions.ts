import type { ViewerRole, Visibility } from "@/lib/mock-data";

export type ViewerRoleRecord = {
  role?: string | null;
  active?: boolean | null;
};

export function normalizeViewerRole(value: unknown): ViewerRole {
  return value === "internal" || value === "admin" ? value : "public";
}

export function resolveViewerRoleRecord(record: ViewerRoleRecord | null | undefined): ViewerRole {
  if (!record || record.active === false) {
    return "public";
  }

  return normalizeViewerRole(record.role);
}

export function isInternalRole(role: ViewerRole) {
  return role === "internal" || role === "admin";
}

export function isAdminRole(role: ViewerRole) {
  return role === "admin";
}

export function canOpenVisibility(role: ViewerRole, visibility: Visibility) {
  if (visibility === "sensitive") {
    return false;
  }

  if (visibility === "internal") {
    return isInternalRole(role);
  }

  return true;
}

export function canDownloadVisibility(role: ViewerRole, visibility: Visibility) {
  if (visibility === "sensitive") {
    return false;
  }

  if (visibility === "internal") {
    return isInternalRole(role);
  }

  return true;
}
