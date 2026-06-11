import { NextResponse } from "next/server";
import {
  isAdminRole,
  isInternalRole,
  resolveViewerRoleRecord,
} from "@/lib/auth/permissions";
import { hasDocumentDownloadGrant } from "@/lib/document-access";
import { hasSupabaseServiceConfig } from "@/lib/config";
import {
  getEffectiveDocumentSource,
  isMissingPreferredSourceColumnError,
} from "@/lib/document-source";
import { createSupabaseServer } from "@/lib/supabase/server";
import { createSupabaseService } from "@/lib/supabase/service";

type DocumentVisibility = "public" | "internal" | "sensitive";

async function canAccessDocument(
  document: {
    id: string;
    visibility: string;
  },
  supabase: ReturnType<typeof createSupabaseService>,
) {
  if (document.visibility === "public") {
    return true;
  }

  const supabaseServer = await createSupabaseServer();
  const {
    data: { user },
  } = await supabaseServer.auth.getUser();

  if (!user) {
    return false;
  }

  const { data: userRecord } = await supabase
    .from("users")
    .select("role, active, email")
    .eq("id", user.id)
    .maybeSingle();

  const visibility = document.visibility as DocumentVisibility;
  const role = resolveViewerRoleRecord(userRecord);
  const isAdmin = isAdminRole(role);
  const isInternal = isInternalRole(role);
  const requesterEmail = (user.email ?? userRecord?.email ?? "").trim().toLowerCase();
  const hasGrant = await hasDocumentDownloadGrant({
    documentId: document.id,
    userId: user.id,
    email: requesterEmail,
  });

  let hasApprovedRequest = false;
  if (!isAdmin && requesterEmail) {
    const { data: approvedRequest } = await supabase
      .from("access_requests")
      .select("id")
      .eq("email", requesterEmail)
      .eq("document_id", document.id)
      .eq("status", "approved")
      .maybeSingle();

    hasApprovedRequest = Boolean(approvedRequest);
  }

  const hasScopedAccess = hasGrant || hasApprovedRequest;

  if (visibility === "internal" && !isInternal && !hasScopedAccess) {
    return false;
  }

  if (visibility === "sensitive" && !isAdmin && !hasScopedAccess) {
    return false;
  }

  return true;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  if (!hasSupabaseServiceConfig()) {
    return NextResponse.json(
      { error: "Missing Supabase service configuration." },
      { status: 503 },
    );
  }

  const supabase = createSupabaseService();
  let { data: document, error: documentError } = await supabase
    .from("documents")
    .select("id, visibility, preferred_source, storage_bucket, storage_path, external_url")
    .eq("id", id)
    .maybeSingle();

  if (documentError && isMissingPreferredSourceColumnError(documentError)) {
    const fallbackResult = await supabase
      .from("documents")
      .select("id, visibility, storage_bucket, storage_path, external_url")
      .eq("id", id)
      .maybeSingle();

    document = fallbackResult.data
      ? { ...fallbackResult.data, preferred_source: null }
      : fallbackResult.data;
    documentError = fallbackResult.error;
  }

  if (documentError || !document) {
    return NextResponse.json({ error: "Document not found." }, { status: 404 });
  }

  const effectiveSource = getEffectiveDocumentSource(document);

  if (effectiveSource === "external" && document.external_url) {
    const externalResponse = await fetch(document.external_url);
    if (!externalResponse.ok) {
      return NextResponse.json({ error: "Failed to load external document." }, { status: 502 });
    }

    const body = await externalResponse.arrayBuffer();
    return new NextResponse(body, {
      headers: {
        "Content-Type": externalResponse.headers.get("content-type") ?? "application/pdf",
        "Content-Disposition": "inline",
        "Cache-Control": "private, max-age=3600",
      },
    });
  }

  const allowed = await canAccessDocument(document, supabase);
  if (!allowed) {
    return NextResponse.json({ error: "Forbidden" }, { status: document.visibility === "public" ? 404 : 403 });
  }

  if (!document.storage_bucket || !document.storage_path) {
    return NextResponse.json({ error: "Document not yet available." }, { status: 404 });
  }

  const { data: fileData, error: downloadError } = await supabase.storage
    .from(document.storage_bucket)
    .download(document.storage_path);

  if (downloadError || !fileData) {
    return NextResponse.json({ error: "Failed to load document preview." }, { status: 500 });
  }

  const buffer = await fileData.arrayBuffer();

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline",
      "Cache-Control": "private, max-age=3600",
    },
  });
}
