"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hasSupabaseServiceConfig } from "@/lib/config";
import { logAdminActivity } from "@/lib/admin-activity";
import { createSupabaseService } from "@/lib/supabase/service";
import { getViewerRoleFromSession } from "@/lib/viewer-server";
import { isAdmin } from "@/lib/viewer";

function asText(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function asOptionalText(formData: FormData, key: string) {
  const value = asText(formData, key);
  return value || null;
}

function asBoolean(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function normalizeSlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function normalizeDateTime(value: string, fieldName: string) {
  if (!value) {
    throw new Error(`El campo ${fieldName} es obligatorio.`);
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`El campo ${fieldName} no tiene una fecha válida.`);
  }
  return date.toISOString();
}

function isValidVisibility(value: string): value is "public" | "internal" {
  return value === "public" || value === "internal";
}

async function assertAdmin() {
  const role = await getViewerRoleFromSession();
  if (!isAdmin(role)) {
    throw new Error("Unauthorized");
  }
}

function revalidateContentPaths() {
  revalidatePath("/");
  revalidatePath("/noticias");
  revalidatePath("/incidencia");
  revalidatePath("/agenda");
  revalidatePath("/admin");
  revalidatePath("/admin/novedades");
  revalidatePath("/admin/novedades/noticias");
  revalidatePath("/admin/novedades/eventos");
}

export async function createInternalNewsAction(formData: FormData) {
  await assertAdmin();

  if (!hasSupabaseServiceConfig()) {
    redirect("/admin/novedades/noticias?error=missing-config");
  }

  try {
    const title = asText(formData, "title");
    const summary = asText(formData, "summary");
    const body = asText(formData, "body");
    const category = asText(formData, "category") || "Actualización territorial";
    const location = asOptionalText(formData, "location");
    const coverImageUrl = asOptionalText(formData, "cover_image_url");
    const visibility = asText(formData, "visibility");
    const publishedAt = normalizeDateTime(asText(formData, "published_at"), "fecha de publicación");
    const featured = asBoolean(formData, "featured");

    if (!title || !summary || !body) {
      throw new Error("Título, resumen y cuerpo son obligatorios.");
    }
    if (!isValidVisibility(visibility)) {
      throw new Error("La visibilidad es inválida.");
    }

    const supabase = createSupabaseService();
    const slug = normalizeSlug(title);
    const { data: created, error } = await supabase
      .from("internal_news")
      .insert({
        slug,
        title,
        summary,
        body,
        category,
        location,
        cover_image_url: coverImageUrl,
        visibility,
        featured,
        published_at: publishedAt,
        updated_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (error) {
      throw new Error(`No se pudo crear la noticia: ${error.message}`);
    }

    await logAdminActivity({
      kind: "content",
      title,
      section: "Lo Último",
      entityType: "internal_news",
      entityId: created?.id,
    });

    revalidateContentPaths();
    redirect("/admin/novedades/noticias?notice=created");
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo crear la noticia.";
    redirect(`/admin/novedades/noticias?error=${encodeURIComponent(message)}`);
  }
}

export async function updateInternalNewsAction(id: string, formData: FormData) {
  await assertAdmin();

  if (!hasSupabaseServiceConfig()) {
    redirect(`/admin/novedades/noticias/${id}/editar?error=missing-config`);
  }

  try {
    const title = asText(formData, "title");
    const summary = asText(formData, "summary");
    const body = asText(formData, "body");
    const category = asText(formData, "category") || "Actualización territorial";
    const location = asOptionalText(formData, "location");
    const coverImageUrl = asOptionalText(formData, "cover_image_url");
    const visibility = asText(formData, "visibility");
    const publishedAt = normalizeDateTime(asText(formData, "published_at"), "fecha de publicación");
    const featured = asBoolean(formData, "featured");

    if (!title || !summary || !body) {
      throw new Error("Título, resumen y cuerpo son obligatorios.");
    }
    if (!isValidVisibility(visibility)) {
      throw new Error("La visibilidad es inválida.");
    }

    const supabase = createSupabaseService();
    const { error } = await supabase
      .from("internal_news")
      .update({
        slug: normalizeSlug(title),
        title,
        summary,
        body,
        category,
        location,
        cover_image_url: coverImageUrl,
        visibility,
        featured,
        published_at: publishedAt,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      throw new Error(`No se pudo actualizar la noticia: ${error.message}`);
    }

    await logAdminActivity({
      kind: "content",
      title,
      section: "Lo Último",
      entityType: "internal_news",
      entityId: id,
    });

    revalidateContentPaths();
    revalidatePath(`/admin/novedades/noticias/${id}/editar`);
    redirect(`/admin/novedades/noticias/${id}/editar?notice=saved`);
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo actualizar la noticia.";
    redirect(`/admin/novedades/noticias/${id}/editar?error=${encodeURIComponent(message)}`);
  }
}

export async function deleteInternalNewsAction(id: string) {
  await assertAdmin();

  if (!hasSupabaseServiceConfig()) {
    redirect("/admin/novedades/noticias?error=missing-config");
  }

  try {
    const supabase = createSupabaseService();
    const { error } = await supabase.from("internal_news").delete().eq("id", id);
    if (error) {
      throw new Error(`No se pudo eliminar la noticia: ${error.message}`);
    }

    revalidateContentPaths();
    redirect("/admin/novedades/noticias?notice=deleted");
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo eliminar la noticia.";
    redirect(`/admin/novedades/noticias?error=${encodeURIComponent(message)}`);
  }
}

export async function createEventAction(formData: FormData) {
  await assertAdmin();

  if (!hasSupabaseServiceConfig()) {
    redirect("/admin/novedades/eventos?error=missing-config");
  }

  try {
    const title = asText(formData, "title");
    const summary = asText(formData, "summary");
    const description = asText(formData, "description");
    const category = asText(formData, "category") || "Territorio";
    const location = asText(formData, "location");
    const territory = asOptionalText(formData, "territory");
    const resourceUrl = asOptionalText(formData, "resource_url");
    const resourceLabel = asOptionalText(formData, "resource_label");
    const visibility = asText(formData, "visibility");
    const startsAt = normalizeDateTime(asText(formData, "starts_at"), "inicio");
    const endsAtRaw = asText(formData, "ends_at");
    const endsAt = endsAtRaw ? normalizeDateTime(endsAtRaw, "fin") : null;
    const featured = asBoolean(formData, "featured");

    if (!title || !summary || !description || !location) {
      throw new Error("Título, resumen, descripción y ubicación son obligatorios.");
    }
    if (!isValidVisibility(visibility)) {
      throw new Error("La visibilidad es inválida.");
    }

    const supabase = createSupabaseService();
    const slug = normalizeSlug(title);
    const { data: created, error } = await supabase
      .from("events")
      .insert({
        slug,
        title,
        summary,
        description,
        category,
        location,
        territory,
        resource_url: resourceUrl,
        resource_label: resourceLabel,
        visibility,
        featured,
        starts_at: startsAt,
        ends_at: endsAt,
        updated_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (error) {
      throw new Error(`No se pudo crear el evento: ${error.message}`);
    }

    await logAdminActivity({
      kind: "content",
      title,
      section: "Agenda",
      entityType: "event",
      entityId: created?.id,
    });

    revalidateContentPaths();
    redirect("/admin/novedades/eventos?notice=created");
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo crear el evento.";
    redirect(`/admin/novedades/eventos?error=${encodeURIComponent(message)}`);
  }
}

export async function updateEventAction(id: string, formData: FormData) {
  await assertAdmin();

  if (!hasSupabaseServiceConfig()) {
    redirect(`/admin/novedades/eventos/${id}/editar?error=missing-config`);
  }

  try {
    const title = asText(formData, "title");
    const summary = asText(formData, "summary");
    const description = asText(formData, "description");
    const category = asText(formData, "category") || "Territorio";
    const location = asText(formData, "location");
    const territory = asOptionalText(formData, "territory");
    const resourceUrl = asOptionalText(formData, "resource_url");
    const resourceLabel = asOptionalText(formData, "resource_label");
    const visibility = asText(formData, "visibility");
    const startsAt = normalizeDateTime(asText(formData, "starts_at"), "inicio");
    const endsAtRaw = asText(formData, "ends_at");
    const endsAt = endsAtRaw ? normalizeDateTime(endsAtRaw, "fin") : null;
    const featured = asBoolean(formData, "featured");

    if (!title || !summary || !description || !location) {
      throw new Error("Título, resumen, descripción y ubicación son obligatorios.");
    }
    if (!isValidVisibility(visibility)) {
      throw new Error("La visibilidad es inválida.");
    }

    const supabase = createSupabaseService();
    const { error } = await supabase
      .from("events")
      .update({
        slug: normalizeSlug(title),
        title,
        summary,
        description,
        category,
        location,
        territory,
        resource_url: resourceUrl,
        resource_label: resourceLabel,
        visibility,
        featured,
        starts_at: startsAt,
        ends_at: endsAt,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      throw new Error(`No se pudo actualizar el evento: ${error.message}`);
    }

    await logAdminActivity({
      kind: "content",
      title,
      section: "Agenda",
      entityType: "event",
      entityId: id,
    });

    revalidateContentPaths();
    revalidatePath(`/admin/novedades/eventos/${id}/editar`);
    redirect(`/admin/novedades/eventos/${id}/editar?notice=saved`);
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo actualizar el evento.";
    redirect(`/admin/novedades/eventos/${id}/editar?error=${encodeURIComponent(message)}`);
  }
}

export async function deleteEventAction(id: string) {
  await assertAdmin();

  if (!hasSupabaseServiceConfig()) {
    redirect("/admin/novedades/eventos?error=missing-config");
  }

  try {
    const supabase = createSupabaseService();
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) {
      throw new Error(`No se pudo eliminar el evento: ${error.message}`);
    }

    revalidateContentPaths();
    redirect("/admin/novedades/eventos?notice=deleted");
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo eliminar el evento.";
    redirect(`/admin/novedades/eventos?error=${encodeURIComponent(message)}`);
  }
}
