import type { ScitaReport } from "@/lib/mock-reports-store";
import {
  SCITA_EVIDENCE_BUCKET,
  validateScitaEvidenceFile,
  type ScitaEvidenceMetadata,
} from "@/lib/scita-evidence";

export type ScitaReportCategory = ScitaReport["categoria"];
export type ScitaReportFormat = ScitaReport["formato"];
export type ScitaBoardOrigin = NonNullable<ScitaReport["tablero_origen"]>;

const CATEGORIES: ScitaReportCategory[] = ["hidrica", "deforestacion", "mineria", "fauna", "otro"];
const FORMATS: ScitaReportFormat[] = ["texto", "imagen", "voz"];
const BOARDS: ScitaBoardOrigin[] = ["gobierno", "conservacion", "titulacion", "proyectos"];

export const SCITA_BOARD_OPTIONS: { id: ScitaBoardOrigin; label: string }[] = [
  { id: "gobierno", label: "Gobierno propio" },
  { id: "conservacion", label: "Conservación" },
  { id: "titulacion", label: "Titulación" },
  { id: "proyectos", label: "Proyectos" },
];

export function normalizeScitaBoardOrigin(value: string | null | undefined): ScitaBoardOrigin | "" {
  if (!value) return "";
  return BOARDS.includes(value as ScitaBoardOrigin) ? (value as ScitaBoardOrigin) : "";
}

export type ParsedScitaFieldReport = {
  categoria: ScitaReportCategory;
  formato: ScitaReportFormat;
  descripcion: string;
  nombre: string | null;
  contacto: string | null;
  tablero_origen: ScitaBoardOrigin | null;
  role: string;
  reportId: string | null;
  evidenceFile: File | null;
  evidenceMetadata: ScitaEvidenceMetadata | null;
};

function asText(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function asOptionalText(formData: FormData, key: string): string | null {
  const value = asText(formData, key);
  return value || null;
}

function getEvidenceFile(formData: FormData): File | null {
  const archivo = formData.get("archivo");
  if (!(archivo instanceof File) || archivo.size === 0) {
    return null;
  }
  return archivo;
}

function getPreUploadedEvidence(formData: FormData): ScitaEvidenceMetadata | null {
  const evidencePath = asText(formData, "evidence_path");
  if (!evidencePath) return null;

  const evidenceSize = Number(asText(formData, "evidence_size_bytes"));
  const evidenceOriginalName = asText(formData, "evidence_original_name");
  const evidenceMimeType = asText(formData, "evidence_mime_type");

  if (!evidenceOriginalName || !evidenceMimeType || !Number.isFinite(evidenceSize) || evidenceSize <= 0) {
    return null;
  }

  return {
    evidence_bucket: asText(formData, "evidence_bucket") || SCITA_EVIDENCE_BUCKET,
    evidence_path: evidencePath,
    evidence_mime_type: evidenceMimeType,
    evidence_size_bytes: evidenceSize,
    evidence_original_name: evidenceOriginalName,
  };
}

export function parseScitaFieldReportFormData(
  formData: FormData,
): { ok: true; data: ParsedScitaFieldReport } | { ok: false; error: string } {
  const role = asText(formData, "role");
  const categoria = asText(formData, "categoria");
  const formato = asText(formData, "media");
  const descripcion = asText(formData, "descripcion");
  const nombre = asOptionalText(formData, "nombre");
  const contacto = asOptionalText(formData, "contacto");
  const tableroOrigen = asOptionalText(formData, "tablero_origen");
  const reportId = asOptionalText(formData, "report_id");

  if (!categoria || !CATEGORIES.includes(categoria as ScitaReportCategory)) {
    return { ok: false, error: "Categoría de alerta inválida o ausente." };
  }
  if (!formato || !FORMATS.includes(formato as ScitaReportFormat)) {
    return { ok: false, error: "Formato de reporte inválido o ausente." };
  }

  const reportFormat = formato as ScitaReportFormat;
  let resolvedDescripcion = descripcion;
  let evidenceFile: File | null = null;
  let evidenceMetadata: ScitaEvidenceMetadata | null = null;

  if (reportFormat === "texto" && !descripcion) {
    return { ok: false, error: "Escribe tu reporte antes de enviar." };
  }

  if (reportFormat === "imagen" || reportFormat === "voz") {
    evidenceMetadata = getPreUploadedEvidence(formData);

    if (evidenceMetadata) {
      resolvedDescripcion =
        descripcion ||
        (reportFormat === "imagen"
          ? `Imagen adjunta: ${evidenceMetadata.evidence_original_name}`
          : "Nota de voz registrada");
    } else {
      evidenceFile = getEvidenceFile(formData);
      const evidenceValidation = validateScitaEvidenceFile(evidenceFile ?? new File([], ""), reportFormat);
      if (!evidenceValidation.ok) {
        return evidenceValidation;
      }
      resolvedDescripcion =
        descripcion ||
        (reportFormat === "imagen"
          ? `Imagen adjunta: ${evidenceFile?.name ?? "evidencia"}`
          : "Nota de voz registrada");
    }
  }

  const tablero_origen =
    tableroOrigen && BOARDS.includes(tableroOrigen as ScitaBoardOrigin)
      ? (tableroOrigen as ScitaBoardOrigin)
      : null;

  return {
    ok: true,
    data: {
      role,
      categoria: categoria as ScitaReportCategory,
      formato: reportFormat,
      descripcion: resolvedDescripcion,
      nombre,
      contacto,
      tablero_origen,
      reportId,
      evidenceFile,
      evidenceMetadata,
    },
  };
}
