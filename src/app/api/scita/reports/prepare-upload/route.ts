import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { hasSupabaseServiceConfig } from "@/lib/config";
import {
  SCITA_EVIDENCE_BUCKET,
  buildScitaEvidencePath,
  validateScitaEvidenceUploadIntent,
  type ScitaEvidenceFormat,
  type ScitaEvidenceMetadata,
} from "@/lib/scita-evidence";
import { createSupabaseService } from "@/lib/supabase/service";

type PrepareUploadBody = {
  formato?: ScitaEvidenceFormat;
  fileName?: string;
  fileSize?: number;
  contentType?: string;
};

export async function POST(request: Request) {
  if (!hasSupabaseServiceConfig()) {
    return NextResponse.json({ error: "Missing Supabase service configuration." }, { status: 503 });
  }

  let body: PrepareUploadBody;
  try {
    body = (await request.json()) as PrepareUploadBody;
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  const formato = body.formato;
  const fileName = String(body.fileName ?? "").trim();
  const fileSize = Number(body.fileSize ?? 0);

  if (formato !== "imagen" && formato !== "voz") {
    return NextResponse.json({ error: "Formato de evidencia inválido." }, { status: 400 });
  }
  if (!fileName) {
    return NextResponse.json({ error: "Nombre de archivo inválido." }, { status: 400 });
  }

  const validation = validateScitaEvidenceUploadIntent({
    formato,
    fileName,
    fileSize,
    contentType: body.contentType,
  });
  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const reportId = randomUUID();
  const evidencePath = buildScitaEvidencePath(reportId, fileName);
  const evidence: ScitaEvidenceMetadata = {
    evidence_bucket: SCITA_EVIDENCE_BUCKET,
    evidence_path: evidencePath,
    evidence_mime_type: validation.mimeType,
    evidence_size_bytes: fileSize,
    evidence_original_name: fileName,
  };

  const supabase = createSupabaseService();
  const { data, error } = await supabase.storage
    .from(SCITA_EVIDENCE_BUCKET)
    .createSignedUploadUrl(evidencePath);

  if (error || !data?.signedUrl) {
    return NextResponse.json(
      { error: error?.message || "No se pudo preparar la subida de evidencia." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    reportId,
    signedUrl: data.signedUrl,
    token: data.token,
    evidence,
  });
}
