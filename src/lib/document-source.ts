export type DocumentSourcePreference = "storage" | "external";

type DocumentSourceInput = {
  preferred_source?: string | null;
  storage_bucket?: string | null;
  storage_path?: string | null;
  external_url?: string | null;
};

export function isDocumentSourcePreference(
  value: string | null | undefined,
): value is DocumentSourcePreference {
  return value === "storage" || value === "external";
}

export function normalizeStoragePath(storagePath: string) {
  return storagePath
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function isStaticPublicDocumentPath(storagePath: string | null | undefined) {
  return Boolean(storagePath?.startsWith("/"));
}

export function getEffectiveDocumentSource(
  input: DocumentSourceInput,
): DocumentSourcePreference | null {
  const preferred = isDocumentSourcePreference(input.preferred_source)
    ? input.preferred_source
    : null;
  const hasStorage = Boolean(input.storage_path);
  const hasExternal = Boolean(input.external_url);

  if (preferred === "storage" && hasStorage) {
    return "storage";
  }

  if (preferred === "external" && hasExternal) {
    return "external";
  }

  if (hasStorage) {
    return "storage";
  }

  if (hasExternal) {
    return "external";
  }

  return null;
}

export function canUploadToBucketStorage(input: DocumentSourceInput) {
  return Boolean(
    input.storage_bucket &&
      input.storage_path &&
      !isStaticPublicDocumentPath(input.storage_path),
  );
}

export function isMissingPreferredSourceColumnError(error: unknown) {
  if (!error || typeof error !== "object") return false;

  const maybeMessage = "message" in error ? String(error.message) : "";
  const maybeDetails = "details" in error ? String(error.details) : "";
  const maybeHint = "hint" in error ? String(error.hint) : "";

  return [maybeMessage, maybeDetails, maybeHint].some((value) =>
    value.toLowerCase().includes("preferred_source"),
  );
}
