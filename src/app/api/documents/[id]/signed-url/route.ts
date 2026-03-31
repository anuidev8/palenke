import { NextResponse } from "next/server";
import { sendSignedUrlEmail } from "@/lib/email";
import { hasSupabaseServiceConfig } from "@/lib/config";
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
  const { data: document, error: documentError } = await supabase
    .from("documents")
    .select("id, instrument, visibility, storage_bucket, storage_path")
    .eq("id", id)
    .maybeSingle();

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

  // Public documents — no auth required, served directly from Supabase Storage
  if (document.visibility === "public") {
    if (!document.storage_bucket || !document.storage_path) {
      return NextResponse.json({ error: "Document not yet available." }, { status: 404 });
    }
    const { data: signedData, error: signedError } = await supabase.storage
      .from(document.storage_bucket)
      .createSignedUrl(document.storage_path, 3600);
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
  const role = userRecord?.role;
  const isActive = userRecord?.active !== false;
  const isAdmin = role === "admin" && isActive;
  const isInternal = (role === "internal" || role === "admin") && isActive;

  if (visibility === "internal" && !isInternal) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (visibility === "sensitive" && !isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!isAdmin && (visibility === "internal" || visibility === "sensitive")) {
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
    .createSignedUrl(document.storage_path, expiresIn);

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
