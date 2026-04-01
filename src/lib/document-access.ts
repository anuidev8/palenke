import { hasSupabaseServiceConfig } from "@/lib/config";
import { createSupabaseService } from "@/lib/supabase/service";

type GrantRow = {
  id: string;
  user_id: string | null;
  email: string;
  document_id: string;
  expires_at: string | null;
  revoked_at: string | null;
};

function isGrantActive(grant: Pick<GrantRow, "expires_at" | "revoked_at">) {
  if (grant.revoked_at) {
    return false;
  }

  if (!grant.expires_at) {
    return true;
  }

  return new Date(grant.expires_at).getTime() > Date.now();
}

async function listActiveGrantRows(params: {
  documentIds?: string[];
  documentId?: string;
  userId?: string | null;
  email?: string | null;
}) {
  if (!hasSupabaseServiceConfig()) {
    return [] as GrantRow[];
  }

  const normalizedEmail = params.email?.trim().toLowerCase() ?? "";
  if (!params.userId && !normalizedEmail) {
    return [] as GrantRow[];
  }
  if (!params.documentId && !params.documentIds?.length) {
    return [] as GrantRow[];
  }

  const supabase = createSupabaseService();
  const rows: GrantRow[] = [];

  const runQuery = async (field: "user_id" | "email", value: string) => {
    let query = supabase
      .from("document_download_grants")
      .select("id,user_id,email,document_id,expires_at,revoked_at")
      .is("revoked_at", null)
      .eq(field, value);

    if (params.documentId) {
      query = query.eq("document_id", params.documentId);
    } else if (params.documentIds?.length) {
      query = query.in("document_id", params.documentIds);
    }

    const { data, error } = await query;
    if (!error && data) {
      rows.push(...(data as GrantRow[]));
    }
  };

  if (params.userId) {
    await runQuery("user_id", params.userId);
  }
  if (normalizedEmail) {
    await runQuery("email", normalizedEmail);
  }

  return rows.filter((row) => isGrantActive(row));
}

export async function hasDocumentDownloadGrant(params: {
  documentId: string;
  userId?: string | null;
  email?: string | null;
}) {
  const rows = await listActiveGrantRows(params);
  return rows.length > 0;
}

export async function listGrantedDocumentIdsForViewer(params: {
  documentIds: string[];
  userId?: string | null;
  email?: string | null;
}) {
  const rows = await listActiveGrantRows(params);
  return new Set(rows.map((row) => row.document_id));
}

export async function grantDocumentDownload(params: {
  documentId: string;
  email: string;
  userId?: string | null;
  sourceRequestId?: string | null;
  grantedBy?: string | null;
}) {
  if (!hasSupabaseServiceConfig()) {
    return null;
  }

  const supabase = createSupabaseService();
  const normalizedEmail = params.email.trim().toLowerCase();

  let activeGrant: { id: string; user_id: string | null } | undefined;

  if (params.userId) {
    const { data, error } = await supabase
      .from("document_download_grants")
      .select("id,user_id")
      .eq("document_id", params.documentId)
      .eq("user_id", params.userId)
      .is("revoked_at", null)
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) {
      throw new Error(error.message);
    }

    activeGrant = data?.[0] as { id: string; user_id: string | null } | undefined;
  }

  if (!activeGrant) {
    const { data, error } = await supabase
      .from("document_download_grants")
      .select("id,user_id")
      .eq("document_id", params.documentId)
      .eq("email", normalizedEmail)
      .is("revoked_at", null)
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) {
      throw new Error(error.message);
    }

    activeGrant = data?.[0] as { id: string; user_id: string | null } | undefined;
  }

  const payload = {
    user_id: params.userId ?? activeGrant?.user_id ?? null,
    email: normalizedEmail,
    document_id: params.documentId,
    source_request_id: params.sourceRequestId ?? null,
    granted_by: params.grantedBy ?? null,
    granted_at: new Date().toISOString(),
    revoked_at: null,
    expires_at: null,
  };

  if (activeGrant?.id) {
    const { data, error } = await supabase
      .from("document_download_grants")
      .update(payload)
      .eq("id", activeGrant.id)
      .select("id")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  const { data, error } = await supabase
    .from("document_download_grants")
    .insert(payload)
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
