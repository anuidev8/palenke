"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hasSupabaseServiceConfig } from "@/lib/config";
import {
  getEffectiveDocumentSource,
  isDocumentSourcePreference,
  isMissingPreferredSourceColumnError,
  isStaticPublicDocumentPath,
  normalizeStoragePath,
} from "@/lib/document-source";
import { logAdminActivity, sectionForDocumentInstrument } from "@/lib/admin-activity";
import { createSupabaseService } from "@/lib/supabase/service";
import { getViewerRoleFromSession } from "@/lib/viewer-server";
import { isAdmin } from "@/lib/viewer";

const MAX_FILE_SIZE = 20 * 1024 * 1024;

function asText(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function asOptionalText(formData: FormData, key: string) {
  const value = asText(formData, key);
  return value || null;
}

function isValidVisibility(value: string): value is "public" | "internal" | "sensitive" {
  return value === "public" || value === "internal" || value === "sensitive";
}

async function assertAdmin() {
  const role = await getViewerRoleFromSession();
  if (!isAdmin(role)) {
    throw new Error("Unauthorized");
  }
}

function getOptionalDocumentFile(formData: FormData) {
  const fileValue = formData.get("file");
  if (!(fileValue instanceof File)) {
    return null;
  }
  if (!fileValue.name || fileValue.size === 0) {
    return null;
  }
  const lowerName = fileValue.name.toLowerCase();
  const isPdf = fileValue.type.includes("pdf") || lowerName.endsWith(".pdf");
  const isDoc = fileValue.type.includes("msword") || lowerName.endsWith(".doc");
  const isDocx =
    fileValue.type.includes("wordprocessingml.document") || lowerName.endsWith(".docx");

  if (!isPdf && !isDoc && !isDocx) {
    throw new Error("Solo se permiten archivos PDF, DOC o DOCX.");
  }
  if (fileValue.size > MAX_FILE_SIZE) {
    throw new Error("El archivo supera el límite de 20 MB.");
  }
  return fileValue;
}

function getFileContentType(file: File) {
  if (file.type) return file.type;
  const lowerName = file.name.toLowerCase();
  if (lowerName.endsWith(".docx")) {
    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  }
  if (lowerName.endsWith(".doc")) {
    return "application/msword";
  }
  return "application/pdf";
}

function rethrowIfRedirectError(error: unknown) {
  if (
    error &&
    typeof error === "object" &&
    "digest" in error &&
    typeof error.digest === "string" &&
    error.digest.startsWith("NEXT_REDIRECT")
  ) {
    throw error;
  }
}

export async function createDocumentAction(formData: FormData) {
  await assertAdmin();

  if (!hasSupabaseServiceConfig()) {
    redirect("/admin/documentos/nuevo?error=missing-config");
  }

  try {
    const tab = asText(formData, "tab") === "normativa" ? "normativa" : "instrumentos";
    const title = asText(formData, "title");
    const instrument = asText(formData, "instrument");
    const visibility = asText(formData, "visibility");
    const council = asOptionalText(formData, "council");
    const summary = asOptionalText(formData, "summary");
    const publishedOn = asOptionalText(formData, "published_on");
    const externalUrl = asOptionalText(formData, "external_url");
    const documentType = asOptionalText(formData, "document_type");
    const sourceLabel = asOptionalText(formData, "source_label");
    const territory = asOptionalText(formData, "territory");
    const department = asOptionalText(formData, "department");
    const municipality = asOptionalText(formData, "municipality");
    const preferredSourceRaw = asOptionalText(formData, "preferred_source");
    const priorityOrderRaw = asText(formData, "priority_order");
    const featured = formData.get("featured") === "on";
    const storageBucketRaw = asOptionalText(formData, "storage_bucket");
    const storagePathRaw = asText(formData, "storage_path");
    const file = getOptionalDocumentFile(formData);
    const priorityOrder = priorityOrderRaw ? Number(priorityOrderRaw) : 0;

    if (!title) {
      throw new Error("El título es obligatorio.");
    }
    if (!instrument) {
      throw new Error("El instrumento es obligatorio.");
    }
    if (!isValidVisibility(visibility)) {
      throw new Error("La visibilidad es inválida.");
    }
    if (preferredSourceRaw && !isDocumentSourcePreference(preferredSourceRaw)) {
      throw new Error("La fuente principal es inválida.");
    }
    if (!storagePathRaw && !externalUrl) {
      throw new Error("Debes indicar una ruta de archivo o un enlace externo.");
    }
    if (Number.isNaN(priorityOrder)) {
      throw new Error("La prioridad debe ser numérica.");
    }

    const isStaticPublicPath = isStaticPublicDocumentPath(storagePathRaw);
    const storagePath = storagePathRaw
      ? isStaticPublicPath
        ? storagePathRaw
        : normalizeStoragePath(storagePathRaw.replace(/^\/+/, ""))
      : null;
    const storageBucket = !storagePath
      ? null
      : isStaticPublicPath
        ? null
        : storageBucketRaw;
    const preferredSource =
      preferredSourceRaw ??
      getEffectiveDocumentSource({
        storage_bucket: storageBucket,
        storage_path: storagePath,
        external_url: externalUrl,
      });

    if (file && !storagePath) {
      throw new Error("Si vas a subir un archivo debes indicar una ruta de storage.");
    }

    if (preferredSource === "storage" && !storagePath) {
      throw new Error("Si seleccionas archivo Storage debes indicar una ruta.");
    }

    if (preferredSource === "external" && !externalUrl) {
      throw new Error("Si seleccionas enlace externo debes indicar la URL oficial.");
    }

    if (storagePath && !isStaticPublicPath && !storageBucket) {
      throw new Error("Para rutas de Storage debes indicar un bucket.");
    }

    if (storagePath && isStaticPublicPath && file) {
      throw new Error(
        "No puedes subir archivo cuando la ruta es pública local (/docs/...). Usa una ruta de bucket o deja el archivo vacío.",
      );
    }

    const supabase = createSupabaseService();

    if (file) {
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      const { error: uploadError } = await supabase.storage
        .from(storageBucket as string)
        .upload(storagePath as string, fileBuffer, {
          contentType: getFileContentType(file),
          upsert: true,
        });

      if (uploadError) {
        throw new Error(`No se pudo subir el archivo: ${uploadError.message}`);
      }
    }

    let { data: inserted, error: insertError } = await supabase
      .from("documents")
      .insert({
        title,
        instrument,
        council,
        summary,
        published_on: publishedOn,
        external_url: externalUrl,
        document_type: documentType,
        priority_order: priorityOrder,
        featured,
        source_label: sourceLabel,
        territory,
        department,
        municipality,
        preferred_source: preferredSource,
        visibility,
        storage_bucket: storageBucket,
        storage_path: storagePath,
      })
      .select("id")
      .single();

    if (insertError && isMissingPreferredSourceColumnError(insertError)) {
      const fallbackInsert = await supabase
        .from("documents")
        .insert({
          title,
          instrument,
          council,
          summary,
          published_on: publishedOn,
          external_url: externalUrl,
          document_type: documentType,
          priority_order: priorityOrder,
          featured,
          source_label: sourceLabel,
          territory,
          department,
          municipality,
          visibility,
          storage_bucket: storageBucket,
          storage_path: storagePath,
        })
        .select("id")
        .single();

      inserted = fallbackInsert.data;
      insertError = fallbackInsert.error;
    }

    if (insertError || !inserted?.id) {
      throw new Error(`No se pudo crear el documento: ${insertError?.message ?? "insert failed"}`);
    }

    await logAdminActivity({
      kind: "content",
      title,
      section: sectionForDocumentInstrument(instrument),
      entityType: "document",
      entityId: inserted.id,
    });

    revalidatePath("/admin/documentos");
    revalidatePath("/admin/documentos/nuevo");
    revalidatePath(`/admin/documentos/${inserted.id}/editar`);
    revalidatePath(`/gobierno-propio/${instrument}`);
    revalidatePath("/biblioteca");

    redirect(`/admin/documentos/${inserted.id}/editar?tab=${tab}&notice=saved`);
  } catch (error) {
    rethrowIfRedirectError(error);
    const message = error instanceof Error ? error.message : "Error al crear documento.";
    const tab = asText(formData, "tab") === "normativa" ? "normativa" : "instrumentos";
    redirect(`/admin/documentos/nuevo?tab=${tab}&error=${encodeURIComponent(message)}`);
  }
}
