import { hasSupabaseServiceConfig } from "@/lib/config";
import { createSupabaseService } from "@/lib/supabase/service";

export type GobiernoPropioDocumentRow = {
  id: string;
  title: string;
  slug: string | null;
  instrument: string;
  council: string | null;
  summary: string | null;
  author: string | null;
  theme: string | null;
  subtheme: string | null;
  spatial_coverage: string | null;
  language: string | null;
  status: string | null;
  rights: string | null;
  related_collection: string | null;
  submodule: string | null;
  document_type: string | null;
  format: string | null;
  visibility: "public" | "internal" | "sensitive";
  storage_bucket: string | null;
  storage_path: string | null;
  published_on: string | null;
  delivery_date: string | null;
  keywords: string[] | null;
  territory: string | null;
  department: string | null;
  municipality: string | null;
  created_at: string;
  priority_order: number | null;
};

const DOCUMENT_SELECT =
  "id,title,slug,instrument,council,summary,author,theme,subtheme,spatial_coverage,language,status,rights,related_collection,submodule,document_type,format,visibility,storage_bucket,storage_path,published_on,delivery_date,keywords,territory,department,municipality,created_at,priority_order";

function isMissingColumnError(error: unknown) {
  if (!error || typeof error !== "object") return false;
  const maybeCode = "code" in error ? String(error.code) : "";
  const maybeMessage = "message" in error ? String(error.message) : "";
  return (
    maybeCode === "42703" ||
    maybeCode === "PGRST204" ||
    maybeMessage.includes("column") ||
    maybeMessage.includes("schema cache")
  );
}

const LEGACY_DOCUMENT_SELECT =
  "id,title,instrument,council,summary,document_type,visibility,storage_bucket,storage_path,published_on,territory,department,municipality,created_at,priority_order";

function mapLegacyRow(row: Record<string, unknown>): GobiernoPropioDocumentRow {
  const title = String(row.title ?? "");
  return {
    id: String(row.id),
    title,
    slug: title
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, ""),
    instrument: String(row.instrument),
    council: (row.council as string | null) ?? null,
    summary: (row.summary as string | null) ?? null,
    author: null,
    theme: null,
    subtheme: null,
    spatial_coverage: null,
    language: "es",
    status: null,
    rights: null,
    related_collection: null,
    submodule: null,
    document_type: (row.document_type as string | null) ?? null,
    format: "PDF",
    visibility: row.visibility as GobiernoPropioDocumentRow["visibility"],
    storage_bucket: (row.storage_bucket as string | null) ?? null,
    storage_path: (row.storage_path as string | null) ?? null,
    published_on: (row.published_on as string | null) ?? null,
    delivery_date: null,
    keywords: [],
    territory: (row.territory as string | null) ?? null,
    department: (row.department as string | null) ?? null,
    municipality: (row.municipality as string | null) ?? null,
    created_at: String(row.created_at),
    priority_order: (row.priority_order as number | null) ?? null,
  };
}

export function formatDocumentYear(doc: Pick<GobiernoPropioDocumentRow, "published_on" | "created_at">) {
  const yearPattern = /^(\d{4})/;
  if (doc.published_on) {
    const match = doc.published_on.match(yearPattern);
    if (match) return match[1];
  }
  if (doc.created_at) {
    const match = doc.created_at.match(yearPattern);
    if (match) return match[1];
  }
  return String(new Date().getUTCFullYear());
}

export function formatDocumentTerritory(doc: Pick<GobiernoPropioDocumentRow, "territory" | "municipality" | "department" | "council" | "spatial_coverage">) {
  if (doc.spatial_coverage) return doc.spatial_coverage;
  if (doc.municipality && doc.department) {
    return `Municipio de ${doc.municipality}, Departamento del ${doc.department}`;
  }
  return doc.territory ?? doc.council ?? "Consejo comunitario";
}

export async function listInstrumentDocuments(instrument: string) {
  if (!hasSupabaseServiceConfig()) {
    return { mode: "missing-config" as const, docs: [] as GobiernoPropioDocumentRow[] };
  }

  const supabase = createSupabaseService();
  let { data, error } = await supabase
    .from("documents")
    .select(DOCUMENT_SELECT)
    .eq("instrument", instrument)
    .order("priority_order", { ascending: true, nullsFirst: false })
    .order("published_on", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error && isMissingColumnError(error)) {
    const fallback = await supabase
      .from("documents")
      .select(LEGACY_DOCUMENT_SELECT)
      .eq("instrument", instrument)
      .order("priority_order", { ascending: true, nullsFirst: false })
      .order("published_on", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false });
    data = (fallback.data ?? []).map((row) => mapLegacyRow(row as Record<string, unknown>)) as never;
    error = fallback.error;
  }

  if (error) {
    console.error(`Failed to load documents for instrument=${instrument}:`, error);
    return { mode: "query-error" as const, docs: [] as GobiernoPropioDocumentRow[] };
  }

  return { mode: "supabase" as const, docs: (data ?? []) as GobiernoPropioDocumentRow[] };
}

export async function getInstrumentDocumentBySlug(instrument: string, slug: string) {
  if (!hasSupabaseServiceConfig()) {
    return null;
  }

  const supabase = createSupabaseService();
  let { data, error } = await supabase
    .from("documents")
    .select(DOCUMENT_SELECT)
    .eq("instrument", instrument)
    .eq("slug", slug)
    .maybeSingle();

  if (error && isMissingColumnError(error)) {
    const { data: fallbackRows, error: fallbackError } = await supabase
      .from("documents")
      .select(LEGACY_DOCUMENT_SELECT)
      .eq("instrument", instrument);

    if (fallbackError || !fallbackRows) {
      return null;
    }

    const mapped = fallbackRows.map((row) => mapLegacyRow(row as Record<string, unknown>));
    return mapped.find((doc) => doc.slug === slug) ?? null;
  }

  if (error || !data) {
    return null;
  }

  return data as GobiernoPropioDocumentRow;
}

export async function listInstrumentDocumentSlugs(instrument: string) {
  const { docs } = await listInstrumentDocuments(instrument);
  return docs
    .filter((doc) => doc.slug)
    .map((doc) => ({ slug: doc.slug as string }));
}
