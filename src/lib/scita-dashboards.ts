import { hasSupabaseServiceConfig } from "@/lib/config";
import type { ViewerRole } from "@/lib/mock-data";
import { isInternalRole } from "@/lib/auth/permissions";
import { createSupabaseService } from "@/lib/supabase/service";

export type ScitaDashboardModuleKey = "gobierno" | "conservacion" | "titulacion";

export type ScitaDashboardRecord = {
  id: string;
  moduleKey: ScitaDashboardModuleKey;
  title: string;
  shortLabel: string;
  description: string;
  detailDescription: string;
  detailBullets: string[];
  iframeTitle: string;
  embedUrl: string;
  embedWidth: number;
  embedHeight: number;
  footerCropPx: number;
  iconSrc: string;
  visibility: "public" | "internal";
  status: "active" | "draft" | "disabled";
  sortOrder: number;
};

const DEFAULT_EMBED_WIDTH = 600;
const DEFAULT_EMBED_HEIGHT = 373.5;
const DEFAULT_POWERBI_FOOTER_PX = 56;

const SCITA_DASHBOARD_FALLBACK: ScitaDashboardRecord[] = [
  {
    id: "fallback-gobierno-public",
    moduleKey: "gobierno",
    title: "Instrumentos de Gobierno Propio",
    shortLabel: "Gobierno propio",
    description: "Reglamentos, normas internas y planes de etnodesarrollo comunitario.",
    detailDescription:
      "Este tablero consolida la información de reglamentos comunitarios, planes de uso y planes de etnodesarrollo para identificar avances, brechas y prioridades de gobernanza. Permite comparar territorios, fortalecer la toma de decisiones internas y sustentar procesos organizativos con evidencia territorial para escenarios de planificación anual y rendición comunitaria.",
    detailBullets: [
      "Cobertura: consejos comunitarios, instrumento vigente, estado de adopción y nivel de actualización.",
      "Lectura principal: qué territorios tienen avances normativos robustos y cuáles requieren acompañamiento técnico o jurídico.",
      "Cruce sugerido: relacionar instrumentos con conflictos de uso del suelo, presión extractiva y alertas territoriales.",
      "Uso político: preparar reuniones con autoridades, asambleas y mesas interinstitucionales con evidencia consolidada.",
    ],
    iframeTitle: "P_Instrumentos de Gobierno Propio",
    embedUrl:
      "https://app.powerbi.com/view?r=eyJrIjoiZjljZDMxZjMtMjNhNS00ZGMzLTgwMTYtY2E5YzM4ZGNhNjE5IiwidCI6ImNlODUzNmFiLWYzOTktNGZiYS04MWQ1LTgwZDc0ZWVlOTk5ZCIsImMiOjR9",
    embedWidth: DEFAULT_EMBED_WIDTH,
    embedHeight: DEFAULT_EMBED_HEIGHT,
    footerCropPx: DEFAULT_POWERBI_FOOTER_PX,
    iconSrc: "/assets/scita/icons/icon-gobierno.png",
    visibility: "public",
    status: "active",
    sortOrder: 10,
  },
  {
    id: "fallback-gobierno-internal",
    moduleKey: "gobierno",
    title: "Instrumentos de Gobierno Propio (interno)",
    shortLabel: "Gobierno propio",
    description: "Vista ampliada para equipo Palenke: reglamentos, normas y etnodesarrollo con mayor detalle.",
    detailDescription:
      "Tablero interno con indicadores y cruces no expuestos en la versión pública. Uso exclusivo para acompañamiento técnico, coordinación territorial y preparación de incidencia con consejos comunitarios.",
    detailBullets: [
      "Acceso restringido a usuarios internos y administradores.",
      "Incluye desagregaciones y filtros adicionales respecto al tablero público.",
      "No compartir capturas ni enlaces fuera del equipo autorizado.",
    ],
    iframeTitle: "I_Instrumentos de Gobierno Propio",
    embedUrl:
      "https://app.powerbi.com/view?r=eyJrIjoiZTNmNmZjMzAtMTJhOS00YTEzLTljYTAtYjIxNGY0YjRhZGY4IiwidCI6ImNlODUzNmFiLWYzOTktNGZiYS04MWQ1LTgwZDc0ZWVlOTk5ZCIsImMiOjR9",
    embedWidth: DEFAULT_EMBED_WIDTH,
    embedHeight: DEFAULT_EMBED_HEIGHT,
    footerCropPx: DEFAULT_POWERBI_FOOTER_PX,
    iconSrc: "/assets/scita/icons/icon-gobierno.png",
    visibility: "internal",
    status: "active",
    sortOrder: 11,
  },
  {
    id: "fallback-conservacion-public",
    moduleKey: "conservacion",
    title: "Áreas de Conservación Comunitaria",
    shortLabel: "Conservación",
    description: "Figuras de protección, biodiversidad y seguimiento territorial de ecosistemas.",
    detailDescription:
      "Este módulo muestra el estado de las áreas de conservación comunitaria, la distribución de ecosistemas estratégicos y señales de presión ambiental en el territorio. Su lectura facilita priorizar acciones de protección, monitoreo y control comunitario sobre bosques, cuencas y zonas de alta importancia biocultural en ventanas de seguimiento mensual y trimestral.",
    detailBullets: [
      "Cobertura: áreas bioculturales, cuencas priorizadas, cobertura boscosa y puntos críticos de presión.",
      "Lectura principal: identificar dónde se concentra la amenaza y qué zonas mantienen mayor resiliencia ecológica.",
      "Cruce sugerido: contrastar cambios de cobertura con reportes de campo y eventos climáticos recientes.",
      "Uso operativo: priorizar brigadas comunitarias, rutas de verificación y medidas de restauración temprana.",
    ],
    iframeTitle: "P_Áreas de Conservación Comunitaria",
    embedUrl:
      "https://app.powerbi.com/view?r=eyJrIjoiNTk3NmZlYmMtN2U2NS00NTFkLWEzOTEtZjAzNTg0ZTZhNjU2IiwidCI6ImNlODUzNmFiLWYzOTktNGZiYS04MWQ1LTgwZDc0ZWVlOTk5ZCIsImMiOjR9",
    embedWidth: DEFAULT_EMBED_WIDTH,
    embedHeight: DEFAULT_EMBED_HEIGHT,
    footerCropPx: DEFAULT_POWERBI_FOOTER_PX,
    iconSrc: "/assets/scita/icons/icon-conservacion.png",
    visibility: "public",
    status: "active",
    sortOrder: 20,
  },
  {
    id: "fallback-conservacion-internal",
    moduleKey: "conservacion",
    title: "Áreas de Conservación Comunitaria (interno)",
    shortLabel: "Conservación",
    description:
      "Vista ampliada para equipo Palenke: presión ambiental, cuencas y figuras de protección con mayor detalle.",
    detailDescription:
      "Tablero interno con indicadores y cruces no expuestos en la versión pública. Uso exclusivo para acompañamiento técnico, monitoreo comunitario y priorización de brigadas territoriales.",
    detailBullets: [
      "Acceso restringido a usuarios internos y administradores.",
      "Incluye desagregaciones adicionales respecto al tablero público.",
      "Si el embed no carga, actualiza la URL I_ en /admin/dashboards.",
    ],
    iframeTitle: "I_Áreas de Conservación Comunitaria",
    embedUrl:
      "https://app.powerbi.com/view?r=eyJrIjoiNTk3NmZlYmMtN2U2NS00NTFkLWEzOTEtZjAzNTg0ZTZhNjU2IiwidCI6ImNlODUzNmFiLWYzOTktNGZiYS04MWQ1LTgwZDc0ZWVlOTk5ZCIsImMiOjR9",
    embedWidth: DEFAULT_EMBED_WIDTH,
    embedHeight: DEFAULT_EMBED_HEIGHT,
    footerCropPx: DEFAULT_POWERBI_FOOTER_PX,
    iconSrc: "/assets/scita/icons/icon-conservacion.png",
    visibility: "internal",
    status: "active",
    sortOrder: 21,
  },
  {
    id: "fallback-titulacion-public",
    moduleKey: "titulacion",
    title: "Titulación Colectiva De Comunidades Negras",
    shortLabel: "Titulación colectiva",
    description: "Consejos comunitarios y territorios colectivos en trámite y adjudicación.",
    detailDescription:
      "Este tablero presenta el comportamiento de procesos de titulación colectiva por consejo comunitario y por estado del trámite, visibilizando avances y rezagos. Sirve para orientar incidencia jurídica y política, respaldar gestiones institucionales y dar seguimiento a la garantía efectiva de derechos territoriales en ciclos de gestión ante entidades públicas.",
    detailBullets: [
      "Cobertura: expedientes por territorio, fase del trámite, tiempos acumulados y estado administrativo.",
      "Lectura principal: detectar cuellos de botella en procesos de adjudicación y formalización colectiva.",
      "Cruce sugerido: comparar avance de titulación con presión territorial y conflictividad local.",
      "Uso estratégico: sustentar acciones de incidencia, seguimiento legal y priorización de casos urgentes.",
    ],
    iframeTitle: "P_Titulación Colectiva De Comunidades Negras",
    embedUrl:
      "https://app.powerbi.com/view?r=eyJrIjoiZjZlYzMzZDctNDcwMy00Zjc5LTg1ZjUtODRjYTYzZGZkZGE4IiwidCI6ImNlODUzNmFiLWYzOTktNGZiYS04MWQ1LTgwZDc0ZWVlOTk5ZCIsImMiOjR9",
    embedWidth: DEFAULT_EMBED_WIDTH,
    embedHeight: DEFAULT_EMBED_HEIGHT,
    footerCropPx: DEFAULT_POWERBI_FOOTER_PX,
    iconSrc: "/assets/scita/icons/icon-titulacion.png",
    visibility: "public",
    status: "active",
    sortOrder: 30,
  },
  {
    id: "fallback-titulacion-internal",
    moduleKey: "titulacion",
    title: "Titulación Colectiva De Comunidades Negras (interno)",
    shortLabel: "Titulación colectiva",
    description: "Seguimiento detallado de trámites y expedientes para uso del equipo técnico.",
    detailDescription:
      "Tablero interno para análisis de rezagos, tiempos de gestión y priorización de casos con información no publicada en la versión abierta.",
    detailBullets: [
      "Acceso restringido a usuarios internos y administradores.",
      "Útil para mesas técnicas y seguimiento jurídico con entidades.",
      "No difundir fuera de canales autorizados del equipo.",
    ],
    iframeTitle: "I_Titulación Colectiva De Comunidades Negras",
    embedUrl:
      "https://app.powerbi.com/view?r=eyJrIjoiZGQ5NTRjNmEtMjlhYi00YzAyLWFiZDgtMWZkZTE4MDFjNDcxIiwidCI6ImNlODUzNmFiLWYzOTktNGZiYS04MWQ1LTgwZDc0ZWVlOTk5ZCIsImMiOjR9",
    embedWidth: DEFAULT_EMBED_WIDTH,
    embedHeight: DEFAULT_EMBED_HEIGHT,
    footerCropPx: DEFAULT_POWERBI_FOOTER_PX,
    iconSrc: "/assets/scita/icons/icon-titulacion.png",
    visibility: "internal",
    status: "active",
    sortOrder: 31,
  },
];

function isMissingTableError(error: unknown) {
  if (!error || typeof error !== "object") {
    return false;
  }

  const code = "code" in error ? String(error.code) : "";
  const message = "message" in error ? String(error.message) : "";
  return code === "42P01" || message.toLowerCase().includes("does not exist");
}

function parseDetailBullets(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value) as unknown;
      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item).trim()).filter(Boolean);
      }
    } catch {
      return value
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
    }
  }

  return [];
}

function mapScitaDashboardRow(row: Record<string, unknown>): ScitaDashboardRecord {
  const moduleKey = String(row.module_key ?? "gobierno");
  const visibility = row.visibility === "internal" ? "internal" : "public";
  const status =
    row.status === "draft" || row.status === "disabled" ? row.status : "active";

  return {
    id: String(row.id),
    moduleKey:
      moduleKey === "conservacion" || moduleKey === "titulacion" ? moduleKey : "gobierno",
    title: String(row.title ?? ""),
    shortLabel: String(row.short_label ?? ""),
    description: String(row.description ?? ""),
    detailDescription: String(row.detail_description ?? ""),
    detailBullets: parseDetailBullets(row.detail_bullets),
    iframeTitle: String(row.iframe_title ?? ""),
    embedUrl: String(row.embed_url ?? ""),
    embedWidth: Number(row.embed_width ?? DEFAULT_EMBED_WIDTH),
    embedHeight: Number(row.embed_height ?? DEFAULT_EMBED_HEIGHT),
    footerCropPx: Number(row.footer_crop_px ?? DEFAULT_POWERBI_FOOTER_PX),
    iconSrc: String(row.icon_src ?? ""),
    visibility,
    status,
    sortOrder: Number(row.sort_order ?? 0),
  };
}

function scitaDashboardKey(dashboard: Pick<ScitaDashboardRecord, "moduleKey" | "visibility">) {
  return `${dashboard.moduleKey}:${dashboard.visibility}`;
}

function sortScitaDashboards(dashboards: ScitaDashboardRecord[]) {
  return dashboards.toSorted(
    (a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title, "es"),
  );
}

/** Fills missing module+visibility slots from fallback when DB seed is incomplete. */
function mergeActiveScitaDashboards(
  fromDb: ScitaDashboardRecord[],
  role: ViewerRole,
): ScitaDashboardRecord[] {
  const includeInternal = isInternalRole(role);
  const fallbackActive = filterScitaDashboardsForRole(SCITA_DASHBOARD_FALLBACK, role);
  const byKey = new Map<string, ScitaDashboardRecord>();

  for (const row of fromDb) {
    if (row.status !== "active") continue;
    if (!includeInternal && row.visibility === "internal") continue;
    byKey.set(scitaDashboardKey(row), row);
  }

  for (const row of fallbackActive) {
    const key = scitaDashboardKey(row);
    if (!byKey.has(key)) {
      byKey.set(key, row);
    }
  }

  return sortScitaDashboards(Array.from(byKey.values()));
}

function mergeScitaDashboardCatalogAdmin(fromDb: ScitaDashboardRecord[]) {
  const byKey = new Map<string, ScitaDashboardRecord>();

  for (const row of fromDb) {
    byKey.set(scitaDashboardKey(row), row);
  }

  for (const row of SCITA_DASHBOARD_FALLBACK) {
    const key = scitaDashboardKey(row);
    if (!byKey.has(key)) {
      byKey.set(key, row);
    }
  }

  return sortScitaDashboards(Array.from(byKey.values()));
}

export function filterScitaDashboardsForRole(
  dashboards: ScitaDashboardRecord[],
  role: ViewerRole,
) {
  const includeInternal = isInternalRole(role);

  return sortScitaDashboards(
    dashboards
      .filter((dashboard) => dashboard.status === "active")
      .filter((dashboard) => includeInternal || dashboard.visibility === "public"),
  );
}

export async function listScitaDashboardsForRole(role: ViewerRole) {
  const includeInternal = isInternalRole(role);

  if (!hasSupabaseServiceConfig()) {
    return filterScitaDashboardsForRole(SCITA_DASHBOARD_FALLBACK, role);
  }

  try {
    const supabase = createSupabaseService();
    let query = supabase
      .from("scita_dashboards")
      .select("*")
      .eq("status", "active")
      .order("sort_order", { ascending: true });

    if (!includeInternal) {
      query = query.eq("visibility", "public");
    }

    const { data, error } = await query;

    if (error && isMissingTableError(error)) {
      return filterScitaDashboardsForRole(SCITA_DASHBOARD_FALLBACK, role);
    }
    if (error) {
      throw error;
    }

    const mapped = ((data ?? []) as Array<Record<string, unknown>>).map(mapScitaDashboardRow);
    if (mapped.length === 0) {
      return filterScitaDashboardsForRole(SCITA_DASHBOARD_FALLBACK, role);
    }

    return mergeActiveScitaDashboards(mapped, role);
  } catch (error) {
    console.error("Failed to load SCITA dashboards:", error);
    return filterScitaDashboardsForRole(SCITA_DASHBOARD_FALLBACK, role);
  }
}

export async function listAllScitaDashboardsAdmin() {
  if (!hasSupabaseServiceConfig()) {
    return SCITA_DASHBOARD_FALLBACK;
  }

  const supabase = createSupabaseService();
  const { data, error } = await supabase
    .from("scita_dashboards")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error && isMissingTableError(error)) {
    return SCITA_DASHBOARD_FALLBACK;
  }
  if (error) {
    throw error;
  }

  const mapped = ((data ?? []) as Array<Record<string, unknown>>).map(mapScitaDashboardRow);
  return mergeScitaDashboardCatalogAdmin(mapped);
}

export async function getScitaDashboardByIdAdmin(id: string) {
  if (!hasSupabaseServiceConfig()) {
    return SCITA_DASHBOARD_FALLBACK.find((item) => item.id === id) ?? null;
  }

  const supabase = createSupabaseService();
  const { data, error } = await supabase.from("scita_dashboards").select("*").eq("id", id).maybeSingle();

  if (error && isMissingTableError(error)) {
    return SCITA_DASHBOARD_FALLBACK.find((item) => item.id === id) ?? null;
  }
  if (error) {
    throw error;
  }

  return data ? mapScitaDashboardRow(data as Record<string, unknown>) : null;
}

export function scitaDashboardRecordToRowInput(record: {
  moduleKey: ScitaDashboardModuleKey;
  title: string;
  shortLabel: string;
  description: string;
  detailDescription: string;
  detailBullets: string[];
  iframeTitle: string;
  embedUrl: string;
  embedWidth: number;
  embedHeight: number;
  footerCropPx: number;
  iconSrc: string;
  visibility: "public" | "internal";
  status: "active" | "draft" | "disabled";
  sortOrder: number;
}) {
  return {
    module_key: record.moduleKey,
    title: record.title,
    short_label: record.shortLabel,
    description: record.description,
    detail_description: record.detailDescription,
    detail_bullets: record.detailBullets,
    iframe_title: record.iframeTitle,
    embed_url: record.embedUrl,
    embed_width: record.embedWidth,
    embed_height: record.embedHeight,
    footer_crop_px: record.footerCropPx,
    icon_src: record.iconSrc,
    visibility: record.visibility,
    status: record.status,
    sort_order: record.sortOrder,
    updated_at: new Date().toISOString(),
  };
}
