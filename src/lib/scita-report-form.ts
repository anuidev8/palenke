import type { ScitaReport } from "@/lib/mock-reports-store";

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
};

function asText(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function asOptionalText(formData: FormData, key: string): string | null {
  const value = asText(formData, key);
  return value || null;
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

  if (!categoria || !CATEGORIES.includes(categoria as ScitaReportCategory)) {
    return { ok: false, error: "Categoría de alerta inválida o ausente." };
  }
  if (!formato || !FORMATS.includes(formato as ScitaReportFormat)) {
    return { ok: false, error: "Formato de reporte inválido o ausente." };
  }
  if (!descripcion) {
    return { ok: false, error: "La descripción es obligatoria." };
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
      formato: formato as ScitaReportFormat,
      descripcion,
      nombre,
      contacto,
      tablero_origen,
    },
  };
}
