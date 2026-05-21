"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hasSupabaseServiceConfig } from "@/lib/config";
import { isAdmin } from "@/lib/viewer";
import { getViewerRoleFromSession } from "@/lib/viewer-server";
import { logAdminActivity, sectionForDocumentInstrument } from "@/lib/admin-activity";
import { createSupabaseService } from "@/lib/supabase/service";
import {
  getRutaMetodologicaStoragePath,
  getRutaMetodologicaTitleForInstrument,
  isRutaMetodologicaInstrument,
  type RutaMetodologicaInstrument,
} from "@/lib/rutas-metodologicas";

function asText(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

async function assertAdmin() {
  const role = await getViewerRoleFromSession();
  if (!isAdmin(role)) {
    throw new Error("Unauthorized");
  }
}

function getValidatedFile(formData: FormData) {
  const fileValue = formData.get("file");
  if (!(fileValue instanceof File)) {
    throw new Error("Debes seleccionar un archivo PDF.");
  }
  if (!fileValue.name) {
    throw new Error("El archivo seleccionado no es válido.");
  }
  if (!fileValue.type.includes("pdf")) {
    throw new Error("Solo se permiten archivos PDF.");
  }
  if (fileValue.size > 20 * 1024 * 1024) {
    throw new Error("El archivo supera el límite de 20 MB.");
  }
  return fileValue;
}

function getTargetInstrument(formData: FormData): RutaMetodologicaInstrument {
  const instrument = asText(formData, "instrument");
  if (!isRutaMetodologicaInstrument(instrument)) {
    throw new Error("Instrumento inválido.");
  }
  return instrument;
}

export async function uploadRutaMetodologica(formData: FormData) {
  await assertAdmin();

  if (!hasSupabaseServiceConfig()) {
    redirect("/admin/documentos/rutas-metodologicas?error=missing-config");
  }

  try {
    const instrument = getTargetInstrument(formData);
    const file = getValidatedFile(formData);
    const titleInput = asText(formData, "title");
    const title = titleInput || getRutaMetodologicaTitleForInstrument(instrument);
    const storageBucket = "docs-public";
    const storagePath = getRutaMetodologicaStoragePath(instrument);

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const supabase = createSupabaseService();

    const { error: uploadError } = await supabase.storage
      .from(storageBucket)
      .upload(storagePath, fileBuffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      throw new Error(`No se pudo subir el archivo: ${uploadError.message}`);
    }

    const { data: existingPublicDoc, error: existingDocError } = await supabase
      .from("documents")
      .select("id")
      .eq("instrument", instrument)
      .eq("visibility", "public")
      .limit(1)
      .maybeSingle();

    if (existingDocError) {
      throw new Error(`No se pudo verificar metadata existente: ${existingDocError.message}`);
    }

    if (existingPublicDoc?.id) {
      const { error: updateError } = await supabase
        .from("documents")
        .update({
          title,
          council: "Palenke PCN",
          visibility: "public",
          storage_bucket: storageBucket,
          storage_path: storagePath,
        })
        .eq("id", existingPublicDoc.id);

      if (updateError) {
        throw new Error(`No se pudo actualizar metadata en documentos: ${updateError.message}`);
      }
    } else {
      const { error: insertError } = await supabase.from("documents").insert({
        title,
        instrument,
        council: "Palenke PCN",
        visibility: "public",
        storage_bucket: storageBucket,
        storage_path: storagePath,
      });
      if (insertError) {
        throw new Error(`No se pudo crear metadata en documentos: ${insertError.message}`);
      }
    }

    await logAdminActivity({
      kind: "content",
      title,
      section: sectionForDocumentInstrument(instrument),
      entityType: "document",
      entityId: existingPublicDoc?.id,
    });

    revalidatePath("/admin/documentos");
    revalidatePath("/admin/documentos/rutas-metodologicas");
    revalidatePath(`/gobierno-propio/${instrument}`);
    redirect(`/admin/documentos/rutas-metodologicas?notice=uploaded&instrument=${instrument}`);
  } catch (error) {
    const encoded = encodeURIComponent(error instanceof Error ? error.message : "Error de carga");
    redirect(`/admin/documentos/rutas-metodologicas?error=${encoded}`);
  }
}
