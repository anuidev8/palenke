"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  sendApprovalEmail,
  sendRejectionEmail,
  sendRequestedDocumentEmail,
} from "@/lib/email";
import { grantDocumentDownload } from "@/lib/document-access";
import {
  getEffectiveDocumentSource,
  isMissingPreferredSourceColumnError,
} from "@/lib/document-source";
import { getViewerRoleFromSession } from "@/lib/viewer-server";
import { isAdmin } from "@/lib/viewer";
import { config, hasSupabaseServiceConfig } from "@/lib/config";
import { createSupabaseServer } from "@/lib/supabase/server";
import { createSupabaseService } from "@/lib/supabase/service";

type ReviewStatus = "approved" | "rejected";

function asText(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function isMissingTableError(error: unknown) {
  if (!error || typeof error !== "object") return false;
  const maybeCode = "code" in error ? String(error.code) : "";
  const maybeMessage = "message" in error ? String(error.message) : "";
  return maybeCode === "PGRST205" || maybeMessage.includes("schema cache");
}

async function assertAdmin() {
  const role = await getViewerRoleFromSession();
  if (!isAdmin(role)) {
    throw new Error("Unauthorized");
  }
}

async function getReviewerId() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user?.id ?? null;
}

async function markRequestStatus(id: string, status: ReviewStatus, notes: string) {
  const reviewerId = await getReviewerId();
  const supabase = createSupabaseService();

  const { data, error } = await supabase
    .from("access_requests")
    .update({
      status,
      reviewer_notes: notes || null,
      reviewed_by: reviewerId,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Unable to update request status.");
  }

  return data;
}

async function getRequestById(id: string) {
  const supabase = createSupabaseService();
  const { data, error } = await supabase.from("access_requests").select("*").eq("id", id).single();

  if (error || !data) {
    throw new Error(error?.message ?? "Unable to load access request.");
  }

  return data;
}

async function ensureAccessUser(email: string) {
  const supabase = createSupabaseService();
  const normalizedEmail = email.trim().toLowerCase();
  const inviteRedirectTo = `${config.appUrl}/login`;

  const usersResult = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  const existing = usersResult.data.users.find((user) => user.email === normalizedEmail);

  let userId = existing?.id ?? null;
  if (!userId) {
    const inviteResult = await supabase.auth.admin.inviteUserByEmail(normalizedEmail, {
      redirectTo: inviteRedirectTo,
    });

    if (inviteResult.error) {
      throw new Error(inviteResult.error.message);
    }

    userId = inviteResult.data.user?.id ?? null;
  }

  if (!userId) {
    return null;
  }

  const { data: profile } = await supabase.from("users").select("role").eq("id", userId).maybeSingle();
  const nextRole = profile?.role === "admin" || profile?.role === "internal" ? profile.role : "public";

  const { error: profileError } = await supabase.from("users").upsert(
    {
      id: userId,
      email: normalizedEmail,
      role: nextRole,
      active: true,
    },
    { onConflict: "id" },
  );

  if (profileError) {
    throw new Error(profileError.message);
  }

  return userId;
}

async function provisionDocumentGrant(request: {
  request_id: string;
  email: string;
  document_id: string | null;
  document_title: string | null;
  instrument_slug: string;
}) {
  if (!request.document_id) {
    await sendApprovalEmail(
      request.email,
      request.instrument_slug,
      request.document_title ?? "Documento solicitado",
    );
    return;
  }

  const reviewerId = await getReviewerId();
  const userId = await ensureAccessUser(request.email);

  await grantDocumentDownload({
    documentId: request.document_id,
    email: request.email,
    userId,
    sourceRequestId: request.request_id,
    grantedBy: reviewerId,
  });

  await sendApprovalEmail(
    request.email,
    request.instrument_slug,
    request.document_title ?? "Documento solicitado",
  );
}

async function getRequestedDocumentDelivery(id: string) {
  const supabase = createSupabaseService();
  let { data: document, error } = await supabase
    .from("documents")
    .select("id,title,preferred_source,storage_bucket,storage_path,external_url")
    .eq("id", id)
    .maybeSingle();

  if (error && isMissingPreferredSourceColumnError(error)) {
    const fallback = await supabase
      .from("documents")
      .select("id,title,storage_bucket,storage_path,external_url")
      .eq("id", id)
      .maybeSingle();
    document = fallback.data ? { ...fallback.data, preferred_source: null } : fallback.data;
    error = fallback.error;
  }

  if (error || !document) {
    throw new Error(error?.message ?? "Unable to load requested document.");
  }

  const effectiveSource = getEffectiveDocumentSource(document);
  if (effectiveSource === "external" && document.external_url) {
    return {
      title: document.title ?? "Documento solicitado",
      url: document.external_url,
      expiryLabel: "según disponibilidad del enlace externo",
    };
  }

  if (!document.storage_bucket || !document.storage_path) {
    throw new Error("The requested document is not available in storage.");
  }

  const expiresIn = 1800;
  const { data: signedData, error: signedError } = await supabase.storage
    .from(document.storage_bucket)
    .createSignedUrl(document.storage_path, expiresIn, { download: true });

  if (signedError || !signedData?.signedUrl) {
    throw new Error(signedError?.message ?? "Failed to generate signed URL.");
  }

  return {
    title: document.title ?? "Documento solicitado",
    url: signedData.signedUrl,
    expiryLabel: "30 minutos",
  };
}

export async function approveRequest(id: string, formData: FormData) {
  await assertAdmin();
  if (!hasSupabaseServiceConfig()) {
    redirect(`/admin/solicitudes/${id}?notice=missing-config`);
  }
  try {
    const notes = asText(formData, "notes");
    const request = await markRequestStatus(id, "approved", notes);

    await provisionDocumentGrant({
      request_id: request.id,
      email: request.email,
      document_id: request.document_id ?? null,
      document_title: request.document_title ?? null,
      instrument_slug: request.instrument_slug,
    });

    revalidatePath("/admin/solicitudes");
    revalidatePath(`/admin/solicitudes/${id}`);
    redirect("/admin/solicitudes?notice=approved");
  } catch (error) {
    if (isMissingTableError(error)) {
      redirect(`/admin/solicitudes/${id}?notice=missing-table`);
    }
    throw error;
  }
}

export async function rejectRequest(id: string, formData: FormData) {
  await assertAdmin();
  if (!hasSupabaseServiceConfig()) {
    redirect(`/admin/solicitudes/${id}?notice=missing-config`);
  }

  const reason = asText(formData, "reason");
  if (!reason) {
    redirect(`/admin/solicitudes/${id}?error=missing-reason`);
  }

  try {
    const request = await markRequestStatus(id, "rejected", reason);
    await sendRejectionEmail(
      request.email,
      request.instrument_slug,
      request.document_title ?? "Documento solicitado",
      reason,
    );

    revalidatePath("/admin/solicitudes");
    revalidatePath(`/admin/solicitudes/${id}`);
    redirect("/admin/solicitudes?notice=rejected");
  } catch (error) {
    if (isMissingTableError(error)) {
      redirect(`/admin/solicitudes/${id}?notice=missing-table`);
    }
    throw error;
  }
}

export async function emailRequestedDocument(id: string) {
  await assertAdmin();
  if (!hasSupabaseServiceConfig()) {
    redirect(`/admin/solicitudes/${id}?notice=missing-config`);
  }

  try {
    const request = await getRequestById(id);

    if (!request.document_id) {
      redirect(`/admin/solicitudes/${id}?error=missing-document`);
    }

    const delivery = await getRequestedDocumentDelivery(request.document_id);
    const emailResult = await sendRequestedDocumentEmail(
      request.email,
      request.document_title ?? delivery.title,
      delivery.url,
      delivery.expiryLabel,
    );

    if (!emailResult.sent) {
      redirect(`/admin/solicitudes/${id}?error=document-email-failed`);
    }

    revalidatePath("/admin/solicitudes");
    revalidatePath(`/admin/solicitudes/${id}`);
    redirect(`/admin/solicitudes/${id}?notice=document-sent`);
  } catch (error) {
    if (isMissingTableError(error)) {
      redirect(`/admin/solicitudes/${id}?notice=missing-table`);
    }
    throw error;
  }
}
