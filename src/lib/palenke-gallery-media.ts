import type { Visibility } from "@/lib/mock-data";

export type PalenkeGalleryMediaKind = "image" | "video" | "audio";

export type PalenkeGalleryMedia = {
  id: string;
  title: string;
  section: string;
  type: string;
  description: string;
  territory: string;
  council: string;
  year: number;
  kind: PalenkeGalleryMediaKind;
  posterUrl: string;
  /** Image URL when kind is image; direct media file/embed URL when kind is video or audio */
  mediaUrl: string;
  visibility: Visibility;
  /** Optional category slug for client-side filtering (e.g. mediateca folders) */
  categoryId?: string;
  /** Optional subcategory slug within a parent category (e.g. foro-global-tierra) */
  subcategoryId?: string;
  /** When true, modal playback is forced silent with volume controls hidden. */
  playbackMuted?: boolean;
};
