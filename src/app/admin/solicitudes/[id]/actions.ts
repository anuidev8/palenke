"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sendApprovalEmail, sendRejectionEmail, sendSignedUrlEmail } from "@/lib/email";
import { getViewerRoleFromSession } from "@/lib/viewer-server";
import { isAdmin } from "@/lib/viewer";
import { hasSupabaseServiceConfig } from "@/lib/config";
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

async function provisionInternalUser(email: string) {
  const supabase = createSupabaseService();

  const usersResult = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  const existing = usersResult.data.users.find((user) => user.email === email);

  let userId = existing?.id ?? null;
  if (!userId) {
    const inviteResult = await supabase.auth.admin.inviteUserByEmail(email);
    userId = inviteResult.data.user?.id ?? null;
  }

  if (!userId) {
    return;
  }

  await supabase.from("users").upsert(
    {
      id: userId,
      email,
      role: "internal",
      active: true,
    },
    { onConflict: "id" },
  );
}

async function sendCoordinationDelivery(request: {
  email: string;
  instrument_slug: string;
}) {
  const supabase = createSupabaseService();
  const { data: document } = await supabase
    .from("documents")
    .select("storage_bucket, storage_path")
    .eq("instrument", request.instrument_slug)
    .eq("visibility", "sensitive")
    .not("storage_path", "is", null)
    .limit(1)
    .maybeSingle();

  const bucket = document?.storage_bucket;
  const storagePath = document?.storage_path;

  if (!bucket || !storagePath) {
    await sendApprovalEmail(request.email, request.instrument_slug);
    return;
  }

  const { data: signedUrlData } = await supabase.storage
    .from(bucket)
    .createSignedUrl(storagePath, 1800);

  if (!signedUrlData?.signedUrl) {
    await sendApprovalEmail(request.email, request.instrument_slug);
    return;
  }

  await sendSignedUrlEmail(request.email, signedUrlData.signedUrl, "30 minutos");
}

export async function approveRequest(id: string, formData: FormData) {
  await assertAdmin();
  if (!hasSupabaseServiceConfig()) {
    redirect(`/admin/solicitudes/${id}?notice=missing-config`);
  }
  try {
    const notes = asText(formData, "notes");
    const request = await markRequestStatus(id, "approved", notes);

    if (request.access_level === "admin") {
      await provisionInternalUser(request.email);
      await sendApprovalEmail(request.email, request.instrument_slug);
    } else {
      await sendCoordinationDelivery({
        email: request.email,
        instrument_slug: request.instrument_slug,
      });
    }

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
    await sendRejectionEmail(request.email, request.instrument_slug, reason);

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
