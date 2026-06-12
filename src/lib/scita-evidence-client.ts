import type { ScitaEvidenceFormat, ScitaEvidenceMetadata } from "@/lib/scita-evidence";
import { resolveEvidenceContentType } from "@/lib/scita-evidence";

type PrepareUploadResponse = {
  reportId: string;
  signedUrl: string;
  token: string;
  evidence: ScitaEvidenceMetadata;
  error?: string;
};

export async function uploadScitaEvidenceDirect(
  file: File,
  formato: ScitaEvidenceFormat,
): Promise<{ reportId: string; evidence: ScitaEvidenceMetadata }> {
  const prepareResponse = await fetch("/api/scita/reports/prepare-upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      formato,
      fileName: file.name,
      fileSize: file.size,
      contentType: file.type,
    }),
  });

  const prepared = (await prepareResponse.json()) as PrepareUploadResponse;
  if (!prepareResponse.ok) {
    throw new Error(prepared.error || "No se pudo preparar la subida de evidencia.");
  }

  const contentType = resolveEvidenceContentType(file.name, file.type);
  const uploadResponse = await fetch(prepared.signedUrl, {
    method: "PUT",
    headers: {
      "Content-Type": contentType,
    },
    body: file,
  });

  if (!uploadResponse.ok) {
    throw new Error("No se pudo subir la evidencia. Intenta de nuevo.");
  }

  return {
    reportId: prepared.reportId,
    evidence: prepared.evidence,
  };
}

export function appendScitaEvidenceFields(
  formData: FormData,
  reportId: string,
  evidence: ScitaEvidenceMetadata,
): FormData {
  formData.delete("archivo");
  formData.set("report_id", reportId);
  formData.set("evidence_bucket", evidence.evidence_bucket);
  formData.set("evidence_path", evidence.evidence_path);
  formData.set("evidence_mime_type", evidence.evidence_mime_type);
  formData.set("evidence_size_bytes", String(evidence.evidence_size_bytes));
  formData.set("evidence_original_name", evidence.evidence_original_name);
  return formData;
}
