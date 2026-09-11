/**
 * FOSPA Ecuador 2026 — parent category + source folders (meeting Sep 3, 2026).
 *
 * Expected Desktop layout (names match Karen's actual folders):
 *   ~/Desktop/fospa-ecuador-2026/
 *     PreFOSPA/
 *     FOSPA Ecuador/
 *     EVENTO - AUTOGESTIONADO - FOSPA ECUADOR/
 *     DELEGACION COLOMBIA/
 *
 * Leave picks empty to upload every image/video in each folder (`--all`).
 * Or list filenames to upload a curated subset (Foro Global style).
 */
export const FOSPA_ECUADOR_2026_SUBCATEGORIES = [
  { id: "prefospa", label: "PreFOSPA", sourceDir: "PreFOSPA" },
  { id: "fospa-ecuador", label: "FOSPA Ecuador", sourceDir: "FOSPA Ecuador" },
  {
    id: "evento-autogestionado",
    label: "Evento autogestionado",
    // Current Desktop dump from OneDrive (Sep 11); rename back when Karen restores the full folder.
    sourceDir: "OneDrive_1_9-11-2026",
  },
  {
    id: "delegacion-colombia",
    label: "Delegación Colombia",
    sourceDir: "DELEGACION COLOMBIA",
  },
];

/** Optional curated filenames per subcategory. Empty = use --all folder scan. */
export const FOSPA_ECUADOR_2026_PICKS = {
  prefospa: [],
  "fospa-ecuador": [],
  "evento-autogestionado": [],
  "delegacion-colombia": [],
};
