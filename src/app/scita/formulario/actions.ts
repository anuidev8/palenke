"use server";

import { randomUUID } from "crypto";
import { redirect } from "next/navigation";
import { normalizeViewerRole } from "@/lib/auth/permissions";
import { hasSupabaseServiceConfig } from "@/lib/config";
import { addMockReport } from "@/lib/mock-reports-store";
import { uploadScitaEvidence } from "@/lib/scita-evidence";
import { parseScitaFieldReportFormData } from "@/lib/scita-report-form";
import { createSupabaseService } from "@/lib/supabase/service";
import { withRole } from "@/lib/viewer";

export async function submitScitaFieldReportAction(formData: FormData) {
  const parsed = parseScitaFieldReportFormData(formData);
  if (!parsed.ok) {
    throw new Error(parsed.error);
  }

  const {
    categoria,
    formato,
    descripcion,
    nombre,
    contacto,
    tablero_origen,
    role,
    reportId: providedReportId,
    evidenceFile,
    evidenceMetadata,
  } = parsed.data;
  const viewerRole = normalizeViewerRole(role);
  const reportId = providedReportId || randomUUID();

  if (hasSupabaseServiceConfig()) {
    try {
      const supabase = createSupabaseService();
      let evidenceFields = evidenceMetadata ?? {};

      if (!evidenceMetadata && evidenceFile) {
        evidenceFields = await uploadScitaEvidence(supabase, reportId, evidenceFile);
      }

      const { error } = await supabase.from("scita_reports").insert({
        id: reportId,
        categoria,
        formato,
        descripcion,
        nombre,
        contacto,
        tablero_origen,
        ...evidenceFields,
      });

      if (error) {
        console.error("Supabase report insertion failed, falling back to mock store:", error.message);
        addMockReport({
          categoria,
          formato,
          descripcion,
          nombre,
          contacto,
          tablero_origen,
        });
      }
    } catch (err) {
      console.error("Supabase report submission failed, falling back to mock store:", err);
      addMockReport({
        categoria,
        formato,
        descripcion,
        nombre,
        contacto,
        tablero_origen,
      });
    }
  } else {
    addMockReport({
      categoria,
      formato,
      descripcion,
      nombre,
      contacto,
      tablero_origen,
    });
  }

  redirect(withRole("/scita/formulario", viewerRole, { submitted: "1" }));
}
