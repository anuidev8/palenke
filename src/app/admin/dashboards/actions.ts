"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hasSupabaseServiceConfig } from "@/lib/config";
import {
  type ScitaDashboardModuleKey,
  scitaDashboardRecordToRowInput,
} from "@/lib/scita-dashboards";
import { logAdminActivity } from "@/lib/admin-activity";
import { createSupabaseService } from "@/lib/supabase/service";
import { getViewerRoleFromSession } from "@/lib/viewer-server";
import { isAdmin } from "@/lib/viewer";

function asText(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function asNumber(formData: FormData, key: string, fallback: number) {
  const value = Number(asText(formData, key));
  return Number.isFinite(value) ? value : fallback;
}

function parseDetailBullets(raw: string) {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function isModuleKey(value: string): value is ScitaDashboardModuleKey {
  return value === "gobierno" || value === "conservacion" || value === "titulacion";
}

function isVisibility(value: string): value is "public" | "internal" {
  return value === "public" || value === "internal";
}

function isStatus(value: string): value is "active" | "draft" | "disabled" {
  return value === "active" || value === "draft" || value === "disabled";
}

function parseDashboardForm(formData: FormData) {
  const moduleKey = asText(formData, "module_key");
  const title = asText(formData, "title");
  const shortLabel = asText(formData, "short_label");
  const description = asText(formData, "description");
  const detailDescription = asText(formData, "detail_description");
  const detailBullets = parseDetailBullets(asText(formData, "detail_bullets"));
  const iframeTitle = asText(formData, "iframe_title");
  const embedUrl = asText(formData, "embed_url");
  const visibility = asText(formData, "visibility");
  const status = asText(formData, "status");
  const iconSrc = asText(formData, "icon_src");

  if (!isModuleKey(moduleKey)) {
    throw new Error("El módulo del tablero no es válido.");
  }
  if (!title || !shortLabel || !description || !detailDescription) {
    throw new Error("Título, etiqueta corta y descripciones son obligatorios.");
  }
  if (!iframeTitle || !embedUrl) {
    throw new Error("Título del iframe y URL de embed son obligatorios.");
  }
  if (!embedUrl.startsWith("https://app.powerbi.com/")) {
    throw new Error("La URL de embed debe ser de Power BI (https://app.powerbi.com/).");
  }
  if (!isVisibility(visibility)) {
    throw new Error("La visibilidad no es válida.");
  }
  if (!isStatus(status)) {
    throw new Error("El estado no es válido.");
  }
  if (!iconSrc) {
    throw new Error("La ruta del ícono es obligatoria.");
  }

  return scitaDashboardRecordToRowInput({
    moduleKey,
    title,
    shortLabel,
    description,
    detailDescription,
    detailBullets,
    iframeTitle,
    embedUrl,
    embedWidth: asNumber(formData, "embed_width", 600),
    embedHeight: asNumber(formData, "embed_height", 373.5),
    footerCropPx: asNumber(formData, "footer_crop_px", 56),
    iconSrc,
    visibility,
    status,
    sortOrder: asNumber(formData, "sort_order", 0),
  });
}

async function assertAdmin() {
  const role = await getViewerRoleFromSession();
  if (!isAdmin(role)) {
    throw new Error("Unauthorized");
  }
}

function revalidateScitaDashboardPaths() {
  revalidatePath("/scita");
  revalidatePath("/admin/dashboards");
}

export async function createScitaDashboardAction(formData: FormData) {
  await assertAdmin();

  if (!hasSupabaseServiceConfig()) {
    redirect("/admin/dashboards/nuevo?error=missing-config");
  }

  try {
    const payload = parseDashboardForm(formData);
    const supabase = createSupabaseService();
    const { data, error } = await supabase
      .from("scita_dashboards")
      .insert(payload)
      .select("id")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    await logAdminActivity({
      kind: "content",
      title: payload.title,
      section: "Dashboards",
      entityType: "scita_dashboard",
      entityId: data.id,
    });

    revalidateScitaDashboardPaths();
    revalidatePath("/admin");
    redirect(`/admin/dashboards/${data.id}/editar?notice=saved`);
  } catch (error) {
    const message = encodeURIComponent(
      error instanceof Error ? error.message : "No se pudo crear el tablero.",
    );
    redirect(`/admin/dashboards/nuevo?error=${message}`);
  }
}

export async function updateScitaDashboardAction(id: string, formData: FormData) {
  await assertAdmin();

  if (!hasSupabaseServiceConfig()) {
    redirect(`/admin/dashboards/${id}/editar?error=missing-config`);
  }

  try {
    const payload = parseDashboardForm(formData);
    const supabase = createSupabaseService();
    const { error } = await supabase.from("scita_dashboards").update(payload).eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    await logAdminActivity({
      kind: "content",
      title: payload.title,
      section: "Dashboards",
      entityType: "scita_dashboard",
      entityId: id,
    });

    revalidateScitaDashboardPaths();
    revalidatePath("/admin");
    redirect(`/admin/dashboards/${id}/editar?notice=saved`);
  } catch (error) {
    const message = encodeURIComponent(
      error instanceof Error ? error.message : "No se pudo actualizar el tablero.",
    );
    redirect(`/admin/dashboards/${id}/editar?error=${message}`);
  }
}
