import catalog from "../../data/seguridad-juridica-catalog.json";
import { hasSupabaseServiceConfig } from "@/lib/config";
import { createSupabaseService } from "@/lib/supabase/service";
import type { GobiernoPropioDocumentRow } from "@/lib/gobierno-propio-documents";

export type SeguridadJuridicaCatalogItem = (typeof catalog)[number];

const catalogBySlug = new Map(catalog.map((item) => [item.slug, item]));
const catalogByStoragePath = new Map(catalog.map((item) => [item.storage_path, item]));

export function getSeguridadJuridicaCatalog() {
  return catalog;
}

export function getSeguridadJuridicaCatalogBySlug(slug: string) {
  return catalogBySlug.get(slug) ?? null;
}

function mapCatalogToRow(
  item: SeguridadJuridicaCatalogItem,
  db?: { id: string; created_at?: string | null },
): GobiernoPropioDocumentRow {
  return {
    id: db?.id ?? item.id,
    title: item.title,
    slug: item.slug,
    instrument: "seguridad-juridica",
    council: item.council,
    summary: item.summary,
    author: item.author,
    theme: item.theme,
    subtheme: item.subtheme,
    spatial_coverage: item.spatial_coverage,
    language: item.language,
    status: item.status,
    rights: item.rights,
    related_collection: item.related_collection,
    submodule: item.submodule,
    document_type: item.document_type,
    format: item.format,
    visibility: item.visibility as GobiernoPropioDocumentRow["visibility"],
    storage_bucket: item.storage_bucket,
    storage_path: item.storage_path,
    published_on: item.published_on,
    delivery_date: item.delivery_date,
    keywords: item.keywords,
    territory: item.territory,
    department: null,
    municipality: null,
    created_at: db?.created_at ?? item.published_on ?? new Date().toISOString(),
    priority_order: item.priority_order,
  };
}

async function fetchDbRowsByStoragePath() {
  if (!hasSupabaseServiceConfig()) {
    return new Map<string, { id: string; created_at: string }>();
  }

  const supabase = createSupabaseService();
  const { data, error } = await supabase
    .from("documents")
    .select("id, storage_path, created_at")
    .eq("instrument", "seguridad-juridica");

  if (error || !data) {
    return new Map<string, { id: string; created_at: string }>();
  }

  return new Map(
    data
      .filter((row) => row.storage_path)
      .map((row) => [row.storage_path as string, { id: row.id, created_at: row.created_at }]),
  );
}

export async function listSeguridadJuridicaDocuments() {
  const dbByPath = await fetchDbRowsByStoragePath();
  const docs = catalog.map((item) => mapCatalogToRow(item, dbByPath.get(item.storage_path)));
  return {
    mode: hasSupabaseServiceConfig() ? ("supabase" as const) : ("missing-config" as const),
    docs,
  };
}

export async function getSeguridadJuridicaDocumentBySlug(slug: string) {
  const item = getSeguridadJuridicaCatalogBySlug(slug);
  if (!item) return null;

  const dbByPath = await fetchDbRowsByStoragePath();
  return mapCatalogToRow(item, dbByPath.get(item.storage_path));
}

export function listSeguridadJuridicaSlugs() {
  return catalog.map((item) => ({ slug: item.slug }));
}
