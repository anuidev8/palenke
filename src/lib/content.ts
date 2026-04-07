import { hasSupabaseServiceConfig } from "@/lib/config";
import {
  getEffectiveDocumentSource,
  isMissingPreferredSourceColumnError,
} from "@/lib/document-source";
import type { DocumentRecord, Visibility, ViewerRole } from "@/lib/mock-data";
import { canDownloadDocument } from "@/lib/mock-data";
import { pcnNewsArticles } from "@/lib/newsroom";
import { createSupabaseService } from "@/lib/supabase/service";

export type ExternalNewsItem = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  url: string;
  imageUrl: string | null;
  publishedAt: string;
  sourceLabel: string;
};

export type InternalNewsItem = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: string;
  category: string;
  location: string | null;
  coverImageUrl: string | null;
  visibility: "public" | "internal";
  featured: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
};

export type EventItem = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  category: string;
  location: string;
  territory: string | null;
  resourceUrl: string | null;
  resourceLabel: string | null;
  visibility: "public" | "internal";
  featured: boolean;
  startsAt: string;
  endsAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type ContentDocumentRow = {
  id: string;
  title: string;
  instrument: string;
  council: string | null;
  visibility: Visibility;
  storage_bucket: string | null;
  storage_path: string | null;
  summary: string | null;
  published_on: string | null;
  external_url: string | null;
  document_type: string | null;
  priority_order: number | null;
  featured: boolean | null;
  source_label: string | null;
  territory: string | null;
  department: string | null;
  municipality: string | null;
  preferred_source: "storage" | "external" | null;
  created_at: string;
};

const EXTERNAL_NEWS_CATEGORY_ID = 27;
const EXTERNAL_NEWS_REVALIDATE_SECONDS = 60 * 15;
const externalNewsFallbackImages = [
  "/assets/hero-cards/incidencia.png",
  "/assets/hero-cards/memoria-afroterritorial.png",
  "/assets/hero-cards/scita.png",
  "/assets/hero-cards/gobierno-propio.png",
];
const externalNewsFallback: ExternalNewsItem[] = pcnNewsArticles.slice(0, 4).map((article, index) => ({
  id: index + 1,
  slug: article.slug,
  title: article.titulo,
  excerpt: article.resumen,
  url: `https://renacientes.net/comunicados/${article.slug}/`,
  imageUrl: externalNewsFallbackImages[index % externalNewsFallbackImages.length],
  publishedAt: `2026-03-${String(28 - index).padStart(2, "0")}T10:00:00-05:00`,
  sourceLabel: "Renacientes / PCN",
}));

const internalNewsFallback: InternalNewsItem[] = [
  {
    id: "fallback-news-1",
    slug: "mision-territorial-guaviare-marzo-2026",
    title: "Misión territorial en Guaviare para fortalecer el gobierno propio",
    summary:
      "El equipo del Palenke acompañó una agenda de trabajo con consejos comunitarios para revisar prioridades de protección territorial y rutas organizativas.",
    body:
      "Durante la jornada se consolidaron acuerdos de seguimiento para reglamentos internos, protección hídrica y articulación con procesos de memoria comunitaria. La visita permitió actualizar necesidades de documentación, agenda de formación y coordinación interterritorial para el segundo trimestre del año.",
    category: "Territorio",
    location: "Guaviare",
    coverImageUrl: null,
    visibility: "public",
    featured: true,
    publishedAt: "2026-03-26T10:00:00-05:00",
    createdAt: "2026-03-26T10:00:00-05:00",
    updatedAt: "2026-03-26T10:00:00-05:00",
  },
  {
    id: "fallback-news-2",
    slug: "encuentro-consejos-comunitarios-ovejas",
    title: "Encuentro con consejos comunitarios de la cuenca del río Ovejas",
    summary:
      "Se realizó una jornada de coordinación para priorizar rutas jurídicas, agenda ambiental y circulación de documentos de apoyo para liderazgos locales.",
    body:
      "La reunión permitió definir una agenda inmediata de acompañamiento técnico y político, con énfasis en alertas territoriales, seguimiento a normativa reciente y preparación de próximos encuentros comunitarios.",
    category: "Gobierno propio",
    location: "Suárez, Cauca",
    coverImageUrl: null,
    visibility: "public",
    featured: false,
    publishedAt: "2026-03-21T15:30:00-05:00",
    createdAt: "2026-03-21T15:30:00-05:00",
    updatedAt: "2026-03-21T15:30:00-05:00",
  },
];

const eventsFallback: EventItem[] = [
  {
    id: "fallback-event-1",
    slug: "asamblea-territorial-pacifico-sur-2026",
    title: "Asamblea territorial de Consejos Comunitarios del Pacífico Sur",
    summary:
      "Espacio de coordinación política, balance organizativo y definición de prioridades ambientales para el siguiente ciclo territorial.",
    description:
      "La asamblea reunirá delegaciones de consejos comunitarios para revisar agenda política, defensa del territorio, normas recientes y articulación con procesos de memoria y monitoreo ambiental.",
    category: "Asamblea",
    location: "Tumaco, Nariño",
    territory: "Pacífico Sur",
    resourceUrl: "/incidencia",
    resourceLabel: "Ver Lo Último",
    visibility: "public",
    featured: true,
    startsAt: "2026-04-20T09:00:00-05:00",
    endsAt: "2026-04-20T17:00:00-05:00",
    createdAt: "2026-03-31T10:00:00-05:00",
    updatedAt: "2026-03-31T10:00:00-05:00",
  },
  {
    id: "fallback-event-2",
    slug: "formacion-sig-comunitario-quibdo-2026",
    title: "Formación en herramientas SIG para equipos comunitarios",
    summary:
      "Sesión de trabajo para fortalecer el uso comunitario de cartografía, monitoreo y análisis territorial.",
    description:
      "La formación abordará captura de datos, lectura de capas territoriales y uso de insumos cartográficos para defensa ambiental y toma de decisiones comunitarias.",
    category: "Taller",
    location: "Quibdó, Chocó",
    territory: "Chocó",
    resourceUrl: "/geoportal",
    resourceLabel: "Abrir geoportal",
    visibility: "public",
    featured: true,
    startsAt: "2026-04-18T08:30:00-05:00",
    endsAt: "2026-04-18T13:00:00-05:00",
    createdAt: "2026-03-31T10:00:00-05:00",
    updatedAt: "2026-03-31T10:00:00-05:00",
  },
  {
    id: "fallback-event-3",
    slug: "audiencia-proteccion-rio-anchicaya-2026",
    title: "Audiencia pública sobre protección hídrica del río Anchicayá",
    summary:
      "Audiencia de seguimiento a compromisos institucionales y comunitarios para la defensa del río y sus cuencas.",
    description:
      "La jornada combinará balance jurídico, presentación de evidencia territorial y revisión de acuerdos de acción para protección hídrica y vigilancia comunitaria.",
    category: "Protección hídrica",
    location: "Bogotá D.C.",
    territory: "Valle del Cauca",
    resourceUrl: null,
    resourceLabel: null,
    visibility: "public",
    featured: false,
    startsAt: "2026-04-15T14:00:00-05:00",
    endsAt: "2026-04-15T17:00:00-05:00",
    createdAt: "2026-03-31T10:00:00-05:00",
    updatedAt: "2026-03-31T10:00:00-05:00",
  },
];

function isMissingTableError(error: unknown) {
  if (!error || typeof error !== "object") return false;
  const maybeCode = "code" in error ? String(error.code) : "";
  const maybeMessage = "message" in error ? String(error.message) : "";
  return maybeCode === "PGRST205" || maybeMessage.includes("schema cache");
}

function replaceEntities(value: string) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#8217;/g, "'")
    .replace(/&#8211;/g, "–")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&hellip;/g, "...")
    .replace(/&#038;/g, "&");
}

function stripHtml(html: string) {
  return replaceEntities(html)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function firstNonEmptyString(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }
  return null;
}

function extractFirstContentImage(html: string) {
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match?.[1] ? String(match[1]) : null;
}

function normalizeExternalImageUrl(value: unknown) {
  if (typeof value !== "string") return null;
  const raw = value.trim();
  if (!raw) return null;

  const withProtocol = raw.startsWith("//") ? `https:${raw}` : raw;
  const candidate = replaceEntities(withProtocol);

  try {
    const normalized = new URL(candidate, "https://renacientes.net");
    return normalized.toString();
  } catch {
    return null;
  }
}

function extractOgImageFromYoastHead(yoastHead: unknown) {
  if (typeof yoastHead !== "string" || !yoastHead) return null;
  const match = yoastHead.match(
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
  );
  return match?.[1] ? String(match[1]) : null;
}

function resolveExternalNewsImageUrl(item: Record<string, unknown>) {
  const embedded = asRecord(item._embedded);
  const mediaEntry = Array.isArray(embedded?.["wp:featuredmedia"])
    ? asRecord(embedded?.["wp:featuredmedia"]?.[0])
    : null;
  const mediaDetails = asRecord(mediaEntry?.media_details);
  const mediaSizes = asRecord(mediaDetails?.sizes);
  const yoastHeadJson = asRecord(item.yoast_head_json);
  const yoastImage = Array.isArray(yoastHeadJson?.og_image)
    ? asRecord(yoastHeadJson?.og_image?.[0])
    : null;
  const content = asRecord(item.content);
  const imageCandidate = firstNonEmptyString(
    mediaEntry?.source_url,
    asRecord(mediaSizes?.["et-pb-post-main-image-fullwidth"])?.source_url,
    asRecord(mediaSizes?.["et-pb-post-main-image"])?.source_url,
    asRecord(mediaSizes?.large)?.source_url,
    asRecord(mediaSizes?.full)?.source_url,
    yoastImage?.url,
    extractOgImageFromYoastHead(item.yoast_head),
    extractFirstContentImage(String(content?.rendered ?? "")),
  );

  return normalizeExternalImageUrl(imageCandidate);
}

function resolveExternalNewsTitle(item: Record<string, unknown>) {
  const title = stripHtml(String((item.title as { rendered?: string })?.rendered ?? ""));
  if (title) return title;

  const yoastHeadJson = asRecord(item.yoast_head_json);
  const yoastTitle = replaceEntities(String(yoastHeadJson?.title ?? ""))
    .replace(/\s+/g, " ")
    .trim();
  const yoastPrefix = yoastTitle
    .replace(/^[\s\-–—:]+/, "")
    .split(/\s[-–—]\s/)[0]
    ?.trim();
  if (
    yoastPrefix &&
    !/^proceso de comunidades negras en colombia$/i.test(yoastPrefix)
  ) {
    return yoastPrefix;
  }

  const slug = typeof item.slug === "string" ? item.slug.trim() : "";
  if (!slug) return "Sin título";
  return slug
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/(^\w|\s\w)/g, (match) => match.toUpperCase());
}

async function fetchExternalMediaImageMap(mediaIds: number[]) {
  if (!mediaIds.length) return new Map<number, string>();

  try {
    const response = await fetch(
      `https://renacientes.net/wp-json/wp/v2/media?include=${mediaIds.join(",")}&per_page=${Math.min(
        mediaIds.length,
        100,
      )}`,
      {
        next: { revalidate: EXTERNAL_NEWS_REVALIDATE_SECONDS },
      },
    );
    if (!response.ok) return new Map<number, string>();

    const rows = (await response.json()) as Array<Record<string, unknown>>;
    const imageByMediaId = new Map<number, string>();

    for (const row of rows) {
      const id = Number(row.id);
      if (!Number.isFinite(id)) continue;

      const details = asRecord(row.media_details);
      const sizes = asRecord(details?.sizes);
      const image = normalizeExternalImageUrl(
        firstNonEmptyString(
          row.source_url,
          asRecord(sizes?.["et-pb-post-main-image-fullwidth"])?.source_url,
          asRecord(sizes?.["et-pb-post-main-image"])?.source_url,
          asRecord(sizes?.large)?.source_url,
          asRecord(sizes?.full)?.source_url,
        ),
      );

      if (image) {
        imageByMediaId.set(id, image);
      }
    }

    return imageByMediaId;
  } catch {
    return new Map<number, string>();
  }
}

function formatSpanishDate(value: string, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...options,
  }).format(new Date(value));
}

function startOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

export function formatDateTimeRange(start: string, end?: string | null) {
  const startDate = new Date(start);
  const startLabel = new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(startDate);

  if (!end) {
    return startLabel;
  }

  const endDate = new Date(end);
  const sameDay = startDate.toDateString() === endDate.toDateString();

  if (sameDay) {
    const endTime = new Intl.DateTimeFormat("es-CO", {
      hour: "numeric",
      minute: "2-digit",
    }).format(endDate);
    return `${startLabel} - ${endTime}`;
  }

  const endLabel = new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(endDate);

  return `${startLabel} - ${endLabel}`;
}

function mapInternalNewsRow(row: Record<string, unknown>): InternalNewsItem {
  return {
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title),
    summary: String(row.summary ?? ""),
    body: String(row.body ?? ""),
    category: String(row.category ?? "Actualización territorial"),
    location: row.location ? String(row.location) : null,
    coverImageUrl: row.cover_image_url ? String(row.cover_image_url) : null,
    visibility: row.visibility === "internal" ? "internal" : "public",
    featured: Boolean(row.featured),
    publishedAt: String(row.published_at),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

function mapEventRow(row: Record<string, unknown>): EventItem {
  return {
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title),
    summary: String(row.summary ?? ""),
    description: String(row.description ?? ""),
    category: String(row.category ?? "Territorio"),
    location: String(row.location ?? ""),
    territory: row.territory ? String(row.territory) : null,
    resourceUrl: row.resource_url ? String(row.resource_url) : null,
    resourceLabel: row.resource_label ? String(row.resource_label) : null,
    visibility: row.visibility === "internal" ? "internal" : "public",
    featured: Boolean(row.featured),
    startsAt: String(row.starts_at),
    endsAt: row.ends_at ? String(row.ends_at) : null,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

function inferDocumentType(row: ContentDocumentRow) {
  if (row.document_type) return row.document_type;
  const title = row.title.toLowerCase();
  if (title.startsWith("ley")) return "Ley";
  if (title.startsWith("decreto")) return "Decreto";
  if (title.startsWith("sentencia")) return "Jurisprudencia";
  return "Documento";
}

function resolveDocumentUrl(row: ContentDocumentRow) {
  const effectiveSource = getEffectiveDocumentSource(row);

  if (effectiveSource === "external" && row.external_url) {
    return {
      action: "external" as const,
      url: row.external_url,
      fileLabel: row.instrument === "normativa-vigente" ? "Ver reglamento" : row.source_label ?? "Abrir fuente",
    };
  }

  if (row.storage_path?.startsWith("/")) {
    return {
      action: "file" as const,
      url: row.storage_path,
      fileLabel: row.instrument === "normativa-vigente" ? "Ver reglamento" : "Abrir documento",
    };
  }

  if (effectiveSource === "storage" && (row.storage_bucket || row.storage_path)) {
    return {
      action: "file" as const,
      url: `/api/documents/${row.id}/signed-url?mode=redirect`,
      fileLabel: row.instrument === "normativa-vigente" ? "Ver reglamento" : "Descargar archivo",
    };
  }

  if (row.external_url) {
    return {
      action: "external" as const,
      url: row.external_url,
      fileLabel: row.instrument === "normativa-vigente" ? "Ver reglamento" : row.source_label ?? "Abrir fuente",
    };
  }

  return { action: "external" as const, url: "#", fileLabel: "Abrir recurso" };
}

function documentKeywords(row: ContentDocumentRow) {
  const year = row.published_on ? new Date(row.published_on).getFullYear() : new Date(row.created_at).getFullYear();
  const words = row.title
    .replace(/[—,:]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 3)
    .slice(0, 4);
  return Array.from(new Set([inferDocumentType(row), String(year), ...words]));
}

function mapDocumentToRecord(row: ContentDocumentRow): DocumentRecord {
  const actionMeta = resolveDocumentUrl(row);
  const publishedYear = row.published_on
    ? new Date(row.published_on).getFullYear()
    : new Date(row.created_at).getFullYear();

  return {
    id: row.id,
    slug: row.title
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, ""),
    title: row.title,
    section: "Normativa vigente",
    type: inferDocumentType(row),
    description: row.summary ?? "Documento normativo disponible para consulta y seguimiento.",
    territory: row.territory ?? "",
    council: row.council ?? "Fuente oficial",
    department: row.department ?? "",
    municipality: row.municipality ?? "",
    year: publishedYear,
    validity: "Vigente",
    visibility: row.visibility,
    keywords: documentKeywords(row),
    genderFocus: false,
    mjnTags: [],
    action: actionMeta.action,
    fileLabel: actionMeta.fileLabel,
    url: actionMeta.url,
    imageUrl: undefined,
    riskFlag: false,
    sourceUrl: row.external_url ?? undefined,
  };
}

export async function getExternalEnterateNews(limit = 4): Promise<ExternalNewsItem[]> {
  try {
    const response = await fetch(
      `https://renacientes.net/wp-json/wp/v2/posts?categories=${EXTERNAL_NEWS_CATEGORY_ID}&per_page=${Math.min(limit, 6)}&_embed=wp:featuredmedia&orderby=date&order=desc`,
      {
        next: { revalidate: EXTERNAL_NEWS_REVALIDATE_SECONDS },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to load external news (${response.status})`);
    }

    const payload = (await response.json()) as Array<Record<string, unknown>>;
    const sliced = payload.slice(0, limit);
    const mapped = sliced.map((item) => {
      const featuredMediaId = Number(item.featured_media);
      return {
        id: Number(item.id),
        slug: String(item.slug),
        title: resolveExternalNewsTitle(item),
        excerpt: stripHtml(String((item.excerpt as { rendered?: string })?.rendered ?? "")),
        url: String(item.link ?? ""),
        imageUrl: resolveExternalNewsImageUrl(item),
        featuredMediaId: Number.isFinite(featuredMediaId) && featuredMediaId > 0 ? featuredMediaId : null,
        publishedAt: String(item.date ?? new Date().toISOString()),
        sourceLabel: "Renacientes / PCN",
      };
    });

    const unresolvedMediaIds = Array.from(
      new Set(
        mapped
          .filter((item) => !item.imageUrl && item.featuredMediaId !== null)
          .map((item) => item.featuredMediaId as number),
      ),
    );

    const mediaImageMap = await fetchExternalMediaImageMap(unresolvedMediaIds);
    return mapped.map((item) => ({
      id: item.id,
      slug: item.slug,
      title: item.title,
      excerpt: item.excerpt,
      url: item.url,
      imageUrl:
        item.imageUrl ??
        (item.featuredMediaId !== null ? mediaImageMap.get(item.featuredMediaId) ?? null : null),
      publishedAt: item.publishedAt,
      sourceLabel: item.sourceLabel,
    }));
  } catch (error) {
    console.error("Failed to fetch external Renacientes news:", error);
    return externalNewsFallback.slice(0, limit);
  }
}

export async function listInternalNews(options?: {
  limit?: number;
  includeInternal?: boolean;
}): Promise<InternalNewsItem[]> {
  const includeInternal = options?.includeInternal ?? false;

  if (!hasSupabaseServiceConfig()) {
    return internalNewsFallback
      .filter((item) => includeInternal || item.visibility === "public")
      .slice(0, options?.limit ?? internalNewsFallback.length);
  }

  try {
    const supabase = createSupabaseService();
    let query = supabase
      .from("internal_news")
      .select("*")
      .order("published_at", { ascending: false });

    if (!includeInternal) {
      query = query.eq("visibility", "public");
    }
    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;
    if (error && isMissingTableError(error)) {
      return internalNewsFallback.slice(0, options?.limit ?? internalNewsFallback.length);
    }
    if (error) throw error;

    return ((data ?? []) as Array<Record<string, unknown>>).map(mapInternalNewsRow);
  } catch (error) {
    console.error("Failed to load internal news:", error);
    return internalNewsFallback.slice(0, options?.limit ?? internalNewsFallback.length);
  }
}

export async function getInternalNewsBySlug(slug: string, includeInternal = false) {
  const items = await listInternalNews({ includeInternal });
  return items.find((item) => item.slug === slug) ?? null;
}

export async function listEvents(options?: {
  limit?: number;
  includeInternal?: boolean;
  upcomingOnly?: boolean;
}): Promise<EventItem[]> {
  const includeInternal = options?.includeInternal ?? false;

  if (!hasSupabaseServiceConfig()) {
    let fallback = eventsFallback.slice();
    if (options?.upcomingOnly) {
      const today = startOfToday();
      fallback = fallback.filter((event) => new Date(event.startsAt) >= today);
    }
    fallback.sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
    if (!includeInternal) {
      fallback = fallback.filter((item) => item.visibility === "public");
    }
    return fallback.slice(0, options?.limit ?? fallback.length);
  }

  try {
    const supabase = createSupabaseService();
    let query = supabase.from("events").select("*").order("starts_at", { ascending: true });

    if (!includeInternal) {
      query = query.eq("visibility", "public");
    }
    if (options?.upcomingOnly) {
      query = query.gte("starts_at", startOfToday().toISOString());
    }
    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;
    if (error && isMissingTableError(error)) {
      return eventsFallback.slice(0, options?.limit ?? eventsFallback.length);
    }
    if (error) throw error;

    return ((data ?? []) as Array<Record<string, unknown>>).map(mapEventRow);
  } catch (error) {
    console.error("Failed to load events:", error);
    return eventsFallback.slice(0, options?.limit ?? eventsFallback.length);
  }
}

export async function getEventBySlug(slug: string, includeInternal = false) {
  const items = await listEvents({ includeInternal });
  return items.find((item) => item.slug === slug) ?? null;
}

export async function getAgendaPreview(limit = 3) {
  const items = await listEvents({ limit, upcomingOnly: true });
  return items.slice(0, limit);
}

export async function getNormativaDocumentRecords() {
  if (!hasSupabaseServiceConfig()) {
    console.error("Normativa vigente requires Supabase service configuration.");
    return [];
  }

  try {
    const supabase = createSupabaseService();
    let { data, error } = await supabase
      .from("documents")
      .select(
        "id,title,instrument,council,visibility,storage_bucket,storage_path,summary,published_on,external_url,document_type,priority_order,featured,source_label,territory,department,municipality,preferred_source,created_at",
      )
      .eq("instrument", "normativa-vigente");

    if (error && isMissingPreferredSourceColumnError(error)) {
      const fallbackResult = await supabase
        .from("documents")
        .select(
          "id,title,instrument,council,visibility,storage_bucket,storage_path,summary,published_on,external_url,document_type,priority_order,featured,source_label,territory,department,municipality,created_at",
        )
        .eq("instrument", "normativa-vigente");

      data = (fallbackResult.data ?? []).map((row) => ({
        ...row,
        preferred_source: null,
      }));
      error = fallbackResult.error;
    }

    if (error && isMissingTableError(error)) {
      console.error("Normativa vigente requires the documents migration to be applied.");
      return [];
    }
    if (error) throw error;

    const rows = (data ?? []) as ContentDocumentRow[];
    return rows
      .sort((a, b) => {
        const orderDiff = (a.priority_order ?? 0) - (b.priority_order ?? 0);
        if (orderDiff !== 0) return orderDiff;
        const aTime = new Date(a.published_on ?? a.created_at).getTime();
        const bTime = new Date(b.published_on ?? b.created_at).getTime();
        return bTime - aTime;
      })
      .map(mapDocumentToRecord);
  } catch (error) {
    console.error("Failed to load normative documents:", error);
    return [];
  }
}

export function getVisibleNormativaDocumentsForRole(role: ViewerRole, docs: DocumentRecord[]) {
  return docs.filter((doc) => canDownloadDocument(role, doc.visibility) || doc.visibility !== "sensitive");
}

export function getEventCategories(events: EventItem[]) {
  return Array.from(new Set(events.map((event) => event.category))).sort((a, b) => a.localeCompare(b, "es"));
}

export function getEventLocations(events: EventItem[]) {
  return Array.from(new Set(events.map((event) => event.location))).sort((a, b) => a.localeCompare(b, "es"));
}

export function getEventMonths(events: EventItem[]) {
  return Array.from(
    new Set(
      events.map((event) => {
        const date = new Date(event.startsAt);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      }),
    ),
  ).sort();
}

export function formatMonthKey(monthKey: string) {
  const [year, month] = monthKey.split("-").map(Number);
  return new Intl.DateTimeFormat("es-CO", {
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1, 1));
}

export function formatShortDate(value: string) {
  return formatSpanishDate(value);
}
