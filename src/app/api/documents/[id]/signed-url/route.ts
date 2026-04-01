import { NextResponse } from "next/server";
import {
  isAdminRole,
  isInternalRole,
  resolveViewerRoleRecord,
} from "@/lib/auth/permissions";
import { sendSignedUrlEmail } from "@/lib/email";
import { hasSupabaseServiceConfig } from "@/lib/config";
import {
  getEffectiveDocumentSource,
  isMissingPreferredSourceColumnError,
} from "@/lib/document-source";
import { findDocumentById } from "@/lib/mock-data";
import { createSupabaseServer } from "@/lib/supabase/server";
import { createSupabaseService } from "@/lib/supabase/service";

type DocumentVisibility = "public" | "internal" | "sensitive";

function isMissingTableError(error: unknown) {
  if (!error || typeof error !== "object") return false;
  const maybeCode = "code" in error ? String(error.code) : "";
  const maybeMessage = "message" in error ? String(error.message) : "";
  return maybeCode === "PGRST205" || maybeMessage.includes("schema cache");
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const requestUrl = new URL(request.url);
  const mode = requestUrl.searchParams.get("mode");
  const wantsRedirect = mode === "redirect";

  if (!hasSupabaseServiceConfig()) {
    return NextResponse.json(
      { error: "Missing Supabase service configuration." },
      { status: 503 },
    );
  }

  const supabase = createSupabaseService();
  let { data: document, error: documentError } = await supabase
    .from("documents")
    .select("id, instrument, visibility, preferred_source, storage_bucket, storage_path, external_url")
    .eq("id", id)
    .maybeSingle();

  if (documentError && isMissingPreferredSourceColumnError(documentError)) {
    const fallbackResult = await supabase
      .from("documents")
      .select("id, instrument, visibility, storage_bucket, storage_path, external_url")
      .eq("id", id)
      .maybeSingle();

    document = fallbackResult.data
      ? { ...fallbackResult.data, preferred_source: null }
      : fallbackResult.data;
    documentError = fallbackResult.error;
  }

  if (documentError && isMissingTableError(documentError)) {
    const mockDocument = findDocumentById(id);
    if (!mockDocument) {
      return NextResponse.json({ error: "Document not found." }, { status: 404 });
    }
    if (mockDocument.visibility === "sensitive") {
      return NextResponse.json(
        { error: "Sensitive document requires database-backed access controls." },
        { status: 503 },
      );
    }

    if (wantsRedirect) {
      return NextResponse.redirect(mockDocument.url);
    }
    return NextResponse.json({
      url: mockDocument.url,
      fallback: "mock_missing_table",
    });
  }

  if (documentError || !document) {
    return NextResponse.json({ error: "Document not found." }, { status: 404 });
  }

  const effectiveSource = getEffectiveDocumentSource(document);

  if (effectiveSource === "external" && document.external_url) {
    if (wantsRedirect) {
      return NextResponse.redirect(document.external_url);
    }
    return NextResponse.json({ url: document.external_url, external: true });
  }

  // Public documents — no auth required, served directly from Supabase Storage
  if (document.visibility === "public") {
    if (!document.storage_bucket || !document.storage_path) {
      return NextResponse.json({ error: "Document not yet available." }, { status: 404 });
    }
    const { data: signedData, error: signedError } = await supabase.storage
      .from(document.storage_bucket)
      .createSignedUrl(document.storage_path, 3600, { download: true });
    if (signedError || !signedData?.signedUrl) {
      return NextResponse.json({ error: "Failed to generate signed URL." }, { status: 500 });
    }
    if (wantsRedirect) return NextResponse.redirect(signedData.signedUrl);
    return NextResponse.json({ url: signedData.signedUrl, expires_in: 3600 });
  }

  const supabaseServer = await createSupabaseServer();
  const {
    data: { user },
  } = await supabaseServer.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

  if (visibility === "internal" && !isInternal) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (visibility === "sensitive" && !isInternal) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!isAdmin && visibility === "sensitive") {
    const requesterEmail = user.email ?? userRecord?.email ?? "";
    const { data: approvedRequest } = await supabase
      .from("access_requests")
      .select("id")
      .eq("email", requesterEmail)
      .eq("instrument_slug", document.instrument)
      .eq("status", "approved")
      .maybeSingle();

    if (!approvedRequest) {
      return NextResponse.json({ error: "Access request not approved." }, { status: 403 });
    }
  }

  if (!document.storage_bucket || !document.storage_path) {
    return NextResponse.json({ error: "Document storage path is missing." }, { status: 400 });
  }

  const expiresIn = visibility === "sensitive" ? 1800 : 3600;
  const { data: signedData, error: signedError } = await supabase.storage
    .from(document.storage_bucket)
    .createSignedUrl(document.storage_path, expiresIn, { download: true });

  if (signedError || !signedData?.signedUrl) {
    return NextResponse.json(
      { error: "Failed to generate signed URL." },
      { status: 500 },
    );
  }

  if (visibility === "sensitive") {
    const destinationEmail = user.email ?? userRecord?.email;
    if (!destinationEmail) {
      return NextResponse.json({ error: "User email is required." }, { status: 400 });
    }

    await sendSignedUrlEmail(destinationEmail, signedData.signedUrl, "30 minutos");
    return new NextResponse(null, { status: 204 });
  }

  if (wantsRedirect) {
    return NextResponse.redirect(signedData.signedUrl);
  }

  return NextResponse.json({
    url: signedData.signedUrl,
    expires_in: expiresIn,
  });
}
