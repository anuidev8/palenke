import { createSupabaseService } from "@/lib/supabase/service";
import { hasSupabaseServiceConfig } from "@/lib/config";

export type AccessLevel = "admin" | "coordination";
export type AccessRequestStatus = "pending" | "approved" | "rejected";

export type AccessRequestRecord = {
  id: string;
  full_name: string;
  national_id: string;
  email: string;
  community: string;
  motivation: string;
  pcn_affiliation: string | null;
  instrument_slug: string;
  document_id: string | null;
  document_title: string | null;
  access_level: AccessLevel;
  status: AccessRequestStatus;
  reviewer_notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
};

type AccessRequestFilters = {
  instrument_slug?: string;
  access_level?: AccessLevel;
  status?: AccessRequestStatus;
};

export type AccessRequestsDataMode =
  | "supabase"
  | "mock_missing_service_config"
  | "mock_missing_table"
  | "mock_query_error";

export type AccessRequestFilterOptions = {
  instruments: string[];
  accessLevels: AccessLevel[];
  statuses: AccessRequestStatus[];
};

const INSTRUMENT_LABELS: Record<string, string> = {
  reglamentos: "Reglamentos",
  "planes-uso": "Planes de uso",
  litigio: "Litigio",
  conservacion: "Conservación",
  etnodesarrollo: "Etnodesarrollo",
  "proteccion-hidrica": "Protección hídrica",
};

const mockAccessRequests: AccessRequestRecord[] = [
  {
    id: "mock-req-001",
    full_name: "Juana Rodríguez",
    national_id: "10203040",
    email: "juana@example.org",
    community: "CC Renacientes de la Diáspora Africana",
    motivation: "Apoyar documentación comunitaria para taller de formación interna.",
    pcn_affiliation: "Allied organization",
    instrument_slug: "planes-uso",
    document_id: "mock-doc-planes-uso-001",
    document_title: "PUMA - Consejo Comunitario Renacientes",
    access_level: "coordination",
    status: "pending",
    reviewer_notes: null,
    reviewed_by: null,
    reviewed_at: null,
    created_at: "2026-03-27T13:00:00.000Z",
  },
  {
    id: "mock-req-002",
    full_name: "Carlos Mosquera",
    national_id: "55667788",
    email: "carlos@example.org",
    community: "CC Martin Luther King",
    motivation: "Consulta de reglamento para proceso organizativo local.",
    pcn_affiliation: "Yes",
    instrument_slug: "reglamentos",
    document_id: "mock-doc-reglamentos-001",
    document_title: "Reglamento Interno - CC Martin Luther King",
    access_level: "admin",
    status: "pending",
    reviewer_notes: null,
    reviewed_by: null,
    reviewed_at: null,
    created_at: "2026-03-28T09:00:00.000Z",
  },
];

function isMissingTableError(error: unknown) {
  if (!error || typeof error !== "object") return false;
  const maybeCode = "code" in error ? String(error.code) : "";
  const maybeMessage = "message" in error ? String(error.message) : "";
  return maybeCode === "PGRST205" || maybeMessage.includes("schema cache");
}

function applyFilters(records: AccessRequestRecord[], filters: AccessRequestFilters) {
  return records.filter((record) => {
    if (filters.instrument_slug && record.instrument_slug !== filters.instrument_slug) {
      return false;
    }
    if (filters.access_level && record.access_level !== filters.access_level) {
      return false;
    }
    if (filters.status && record.status !== filters.status) {
      return false;
    }
    return true;
  });
}

function normalizeAccessRequest(raw: Record<string, unknown>): AccessRequestRecord {
  return {
    id: String(raw.id),
    full_name: String(raw.full_name ?? ""),
    national_id: String(raw.national_id ?? ""),
    email: String(raw.email ?? ""),
    community: String(raw.community ?? ""),
    motivation: String(raw.motivation ?? ""),
    pcn_affiliation: raw.pcn_affiliation ? String(raw.pcn_affiliation) : null,
    instrument_slug: String(raw.instrument_slug ?? ""),
    document_id: raw.document_id ? String(raw.document_id) : null,
    document_title: raw.document_title ? String(raw.document_title) : null,
    access_level: String(raw.access_level) === "coordination" ? "coordination" : "admin",
    status:
      String(raw.status) === "approved"
        ? "approved"
        : String(raw.status) === "rejected"
          ? "rejected"
          : "pending",
    reviewer_notes: raw.reviewer_notes ? String(raw.reviewer_notes) : null,
    reviewed_by: raw.reviewed_by ? String(raw.reviewed_by) : null,
    reviewed_at: raw.reviewed_at ? String(raw.reviewed_at) : null,
    created_at: String(raw.created_at ?? ""),
  };
}

function getMockAccessRequests(filters: AccessRequestFilters = {}) {
  return applyFilters(mockAccessRequests, filters).toSorted((a, b) =>
    a.created_at < b.created_at ? 1 : -1,
  );
}

function toSortedUnique<T extends string>(values: T[]) {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b, "es"));
}

function getFilterOptions(records: AccessRequestRecord[]): AccessRequestFilterOptions {
  const instruments = toSortedUnique(records.map((record) => record.instrument_slug));
  const accessLevels = toSortedUnique(records.map((record) => record.access_level)) as AccessLevel[];
  const statuses = toSortedUnique(records.map((record) => record.status)) as AccessRequestStatus[];

  return {
    instruments,
    accessLevels,
    statuses,
  };
}

export function formatInstrumentLabel(instrumentSlug: string) {
  return INSTRUMENT_LABELS[instrumentSlug] ?? instrumentSlug;
}

export function formatAccessLevelLabel(accessLevel: AccessLevel) {
  return accessLevel === "coordination" ? "Coordinación" : "Admin";
}

export function formatAccessRequestStatusLabel(status: AccessRequestStatus) {
  return status === "pending" ? "Pendiente" : status === "approved" ? "Aprobada" : "Rechazada";
}

export async function getAccessRequestFilterOptionsWithMeta() {
  if (!hasSupabaseServiceConfig()) {
    return {
      options: getFilterOptions(mockAccessRequests),
      mode: "mock_missing_service_config" as const,
    };
  }

  const supabase = createSupabaseService();
  const { data, error } = await supabase
    .from("access_requests")
    .select("instrument_slug, access_level, status");

  if (error || !data) {
    if (isMissingTableError(error)) {
      return {
        options: getFilterOptions(mockAccessRequests),
        mode: "mock_missing_table" as const,
      };
    }
    return {
      options: getFilterOptions(mockAccessRequests),
      mode: "mock_query_error" as const,
    };
  }

  const records = (data as Array<Record<string, unknown>>).map((raw, index) =>
    normalizeAccessRequest({
      id: `filter-${index}`,
      full_name: "",
      national_id: "",
      email: "",
      community: "",
      motivation: "",
      document_id: null,
      document_title: null,
      created_at: "",
      ...raw,
    }),
  );

  return {
    options: getFilterOptions(records),
    mode: "supabase" as const,
  };
}

export async function listAccessRequestsWithMeta(filters: AccessRequestFilters = {}) {
  if (!hasSupabaseServiceConfig()) {
    return {
      requests: getMockAccessRequests(filters),
      mode: "mock_missing_service_config" as const,
    };
  }

  const supabase = createSupabaseService();
  let query = supabase.from("access_requests").select("*").order("created_at", { ascending: false });

  if (filters.instrument_slug) {
    query = query.eq("instrument_slug", filters.instrument_slug);
  }
  if (filters.access_level) {
    query = query.eq("access_level", filters.access_level);
  }
  if (filters.status) {
    query = query.eq("status", filters.status);
  }

  const { data, error } = await query;
  if (error || !data) {
    if (isMissingTableError(error)) {
      return {
        requests: getMockAccessRequests(filters),
        mode: "mock_missing_table" as const,
      };
    }
    return { requests: [], mode: "mock_query_error" as const };
  }

  return {
    requests: data.map((row) => normalizeAccessRequest(row as Record<string, unknown>)),
    mode: "supabase" as const,
  };
}

export async function listAccessRequests(filters: AccessRequestFilters = {}) {
  const result = await listAccessRequestsWithMeta(filters);
  return result.requests;
}

export async function getAccessRequestByIdWithMeta(id: string) {
  if (!hasSupabaseServiceConfig()) {
    return {
      request: mockAccessRequests.find((record) => record.id === id) ?? null,
      mode: "mock_missing_service_config" as const,
    };
  }

  const supabase = createSupabaseService();
  const { data, error } = await supabase.from("access_requests").select("*").eq("id", id).maybeSingle();

  if (error || !data) {
    if (isMissingTableError(error)) {
      return {
        request: mockAccessRequests.find((record) => record.id === id) ?? null,
        mode: "mock_missing_table" as const,
      };
    }
    return { request: null, mode: "mock_query_error" as const };
  }

  return {
    request: normalizeAccessRequest(data as Record<string, unknown>),
    mode: "supabase" as const,
  };
}

export async function getAccessRequestById(id: string) {
  const result = await getAccessRequestByIdWithMeta(id);
  return result.request;
}

export async function listAccessRequestsForEmailWithMeta(email: string) {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail) {
    return {
      requests: [] as AccessRequestRecord[],
      mode: "mock_query_error" as const,
    };
  }

  if (!hasSupabaseServiceConfig()) {
    return {
      requests: mockAccessRequests
        .filter((record) => record.email.toLowerCase() === normalizedEmail)
        .toSorted((a, b) => (a.created_at < b.created_at ? 1 : -1)),
      mode: "mock_missing_service_config" as const,
    };
  }

  const supabase = createSupabaseService();
  const { data, error } = await supabase
    .from("access_requests")
    .select("*")
    .eq("email", normalizedEmail)
    .order("created_at", { ascending: false });

  if (error || !data) {
    if (isMissingTableError(error)) {
      return {
        requests: mockAccessRequests
          .filter((record) => record.email.toLowerCase() === normalizedEmail)
          .toSorted((a, b) => (a.created_at < b.created_at ? 1 : -1)),
        mode: "mock_missing_table" as const,
      };
    }

    return {
      requests: [] as AccessRequestRecord[],
      mode: "mock_query_error" as const,
    };
  }

  return {
    requests: data.map((row) => normalizeAccessRequest(row as Record<string, unknown>)),
    mode: "supabase" as const,
  };
}

export async function countPendingAccessRequests() {
  if (!hasSupabaseServiceConfig()) {
    return mockAccessRequests.filter((record) => record.status === "pending").length;
  }

  const supabase = createSupabaseService();
  const { count } = await supabase
    .from("access_requests")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending");

  if (count === null) {
    return mockAccessRequests.filter((record) => record.status === "pending").length;
  }

  return count ?? 0;
}

export function maskNationalId(id: string | null | undefined): string {
  if (!id) return "";
  const cleaned = id.trim();
  if (cleaned.length === 0) return "";
  const len = cleaned.length;
  if (len <= 4) {
    return cleaned[0] + "*".repeat(len - 1);
  }
  const visibleCount = Math.max(1, Math.floor(len * 0.4));
  const maskedCount = len - visibleCount;
  return cleaned.slice(0, visibleCount) + "*".repeat(maskedCount);
}

export function formatIdWithDots(id: string | null | undefined): string {
  if (!id) return "";
  const cleaned = id.trim();
  if (cleaned.length === 0) return "";
  const chars = cleaned.split("");
  const result: string[] = [];
  let count = 0;
  for (let i = chars.length - 1; i >= 0; i--) {
    if (count > 0 && count % 3 === 0) {
      result.unshift(".");
    }
    result.unshift(chars[i]);
    count++;
  }
  return result.join("");
}

