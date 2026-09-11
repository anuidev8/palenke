import type { Visibility } from "@/lib/mock-data";

/**
 * Clasificación de información territorial-digital (Palenke).
 * Fuente de verdad para bucket, TTL de signed URL y controles por sensibilidad.
 */

export type SensitivityTier = "non_sensitive" | "restricted" | "sensitive";

export type DocumentStorageBucket = "docs-public" | "docs-internal" | "docs-sensitive";

export type ClassificationProfile = {
  visibility: Visibility;
  /** Etiqueta corta en español */
  label: string;
  /** Agrupación sensible / no sensible */
  sensitivity: SensitivityTier;
  /** ¿Es información sensible? (interno + sensible = restringida; solo `sensitive` es máxima) */
  isSensitive: boolean;
  description: string;
  storageBucket: DocumentStorageBucket;
  /** Segundos de vida de una signed URL */
  signedUrlTtlSeconds: number;
  /** Quién puede abrir en UI sin grant especial */
  openRoles: ReadonlyArray<"public" | "internal" | "admin">;
  /** Controles mínimos de seguridad */
  controls: ReadonlyArray<string>;
  examples: ReadonlyArray<string>;
};

export const CLASSIFICATION_BY_VISIBILITY: Record<Visibility, ClassificationProfile> = {
  public: {
    visibility: "public",
    label: "Público (no sensible)",
    sensitivity: "non_sensitive",
    isSensitive: false,
    description:
      "Contenido abierto a cualquiera. Prioriza integridad y disponibilidad, no secreto.",
    storageBucket: "docs-public",
    signedUrlTtlSeconds: 3600,
    openRoles: ["public", "internal", "admin"],
    controls: [
      "HTTPS y cabeceras de seguridad",
      "Sin datos personales identificables en captions/nombres de archivo",
      "Rate limit en formularios públicos",
    ],
    examples: [
      "Mediateca Ubuntu / registro FOSPA",
      "Normativa vigente pública",
      "Home y páginas institucionales",
      "Vista externa de tableros SCITA",
    ],
  },
  internal: {
    visibility: "internal",
    label: "Interno (restringido)",
    sensitivity: "restricted",
    isSensitive: true,
    description:
      "Solo equipo Palenke o usuarios autenticados autorizados. No indexar en web pública.",
    storageBucket: "docs-internal",
    signedUrlTtlSeconds: 3600,
    openRoles: ["internal", "admin"],
    controls: [
      "Sesión válida (rol internal o admin)",
      "Bucket privado + RLS",
      "Signed URL; sin listado anónimo",
    ],
    examples: [
      "Reglamentos internos de consejos",
      "Planes de etnodesarrollo",
      "Dashboards internos con más detalle",
    ],
  },
  sensitive: {
    visibility: "sensitive",
    label: "Sensible (máxima restricción)",
    sensitivity: "sensitive",
    isSensitive: true,
    description:
      "Alto riesgo si se filtra (territorial, jurídico, comunitario o personal). Acceso mínimo.",
    storageBucket: "docs-sensitive",
    signedUrlTtlSeconds: 1800,
    openRoles: ["admin"],
    controls: [
      "Admin o grant / solicitud aprobada",
      "Signed URL corta (30 min)",
      "No aparecer en listados públicos ni Home",
      "Trazabilidad de descarga cuando aplique",
    ],
    examples: [
      "PUMANE y anexos de planes de uso",
      "Material de litigio o riesgo comunitario",
      "Datos territoriales de detalle alto",
      "Secretos de entorno (claves API) — nunca en Storage público",
    ],
  },
};

export const DOCUMENT_STORAGE_BUCKETS: ReadonlyArray<DocumentStorageBucket> = [
  "docs-public",
  "docs-internal",
  "docs-sensitive",
];

export function isVisibility(value: unknown): value is Visibility {
  return value === "public" || value === "internal" || value === "sensitive";
}

export function isDocumentStorageBucket(value: unknown): value is DocumentStorageBucket {
  return (
    value === "docs-public" || value === "docs-internal" || value === "docs-sensitive"
  );
}

export function getClassification(visibility: Visibility): ClassificationProfile {
  return CLASSIFICATION_BY_VISIBILITY[visibility];
}

export function defaultBucketForVisibility(visibility: Visibility): DocumentStorageBucket {
  return CLASSIFICATION_BY_VISIBILITY[visibility].storageBucket;
}

export function signedUrlTtlForVisibility(visibility: Visibility): number {
  return CLASSIFICATION_BY_VISIBILITY[visibility].signedUrlTtlSeconds;
}

/**
 * Regla editorial: si hay duda, clasificar como sensitive.
 */
export function suggestVisibility(input: {
  isPublicWebOk: boolean;
  needsLogin: boolean;
  leakWouldHarmCommunityOrLegal: boolean;
}): Visibility {
  if (input.leakWouldHarmCommunityOrLegal) {
    return "sensitive";
  }
  if (input.needsLogin || !input.isPublicWebOk) {
    return "internal";
  }
  return "public";
}

/**
 * Alinea bucket con visibilidad. Si el bucket enviado no corresponde, se corrige.
 */
export function resolveDocumentStorageBucket(
  visibility: Visibility,
  requestedBucket: string | null | undefined,
): DocumentStorageBucket {
  const expected = defaultBucketForVisibility(visibility);
  if (!requestedBucket) {
    return expected;
  }
  if (!isDocumentStorageBucket(requestedBucket)) {
    return expected;
  }
  if (requestedBucket !== expected) {
    return expected;
  }
  return requestedBucket;
}

export function formatClassificationLabel(visibility: Visibility): string {
  return CLASSIFICATION_BY_VISIBILITY[visibility].label;
}

export function classificationDecisionGuide(): string {
  return [
    "1. ¿Cualquiera en internet puede verlo? → Público (no sensible)",
    "2. ¿Solo equipo / usuarios con login? → Interno (restringido)",
    "3. ¿Una filtración dañaría personas, territorio o posición jurídica? → Sensible",
    "4. ¿Duda? → Sensible hasta revisión",
  ].join("\n");
}
