import { NextResponse } from "next/server";
import { requireAdminApiRequest } from "@/lib/admin-access";
import { hasSupabaseServiceConfig } from "@/lib/config";
import { SCITA_EVIDENCE_BUCKET } from "@/lib/scita-evidence";
import { createSupabaseService } from "@/lib/supabase/service";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const deniedResponse = await requireAdminApiRequest();
  if (deniedResponse) {
    return deniedResponse;
  }

  if (!hasSupabaseServiceConfig()) {
    return NextResponse.json({ error: "Missing Supabase service configuration." }, { status: 503 });
  }

  const { id } = await context.params;
  const supabase = createSupabaseService();
  const { data: report, error } = await supabase
    .from("scita_reports")
    .select("id, evidence_bucket, evidence_path, evidence_mime_type, evidence_original_name")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!report?.evidence_path) {
    return NextResponse.json({ error: "Este reporte no tiene evidencia adjunta." }, { status: 404 });
  }

  const bucket = report.evidence_bucket || SCITA_EVIDENCE_BUCKET;
  const { data: signedData, error: signedError } = await supabase.storage
    .from(bucket)
    .createSignedUrl(report.evidence_path, 3600);

  if (signedError || !signedData?.signedUrl) {
    return NextResponse.json(
      { error: signedError?.message || "No se pudo generar el enlace de evidencia." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    url: signedData.signedUrl,
    mimeType: report.evidence_mime_type,
    fileName: report.evidence_original_name,
  });
}
