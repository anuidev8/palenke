import type { createSupabaseService } from "@/lib/supabase/service";

export type ScitaEvidenceFormat = "imagen" | "voz";

export const SCITA_EVIDENCE_BUCKET = "scita-evidence";
export const MAX_SCITA_IMAGE_BYTES = 4 * 1024 * 1024;
export const MAX_SCITA_AUDIO_BYTES = 2 * 1024 * 1024;

const ALLOWED_IMAGE_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const ALLOWED_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];
const ALLOWED_AUDIO_MIME_TYPES = new Set([
  "audio/webm",
  "audio/mpeg",
  "audio/mp4",
  "audio/ogg",
  "audio/x-m4a",
  "audio/wav",
]);
const ALLOWED_AUDIO_EXTENSIONS = [".webm", ".mp3", ".m4a", ".ogg", ".wav", ".aac"];

export type ScitaEvidenceMetadata = {
  evidence_bucket: string;
  evidence_path: string;
  evidence_mime_type: string;
  evidence_size_bytes: number;
  evidence_original_name: string;
};

export function isAllowedScitaImageFile(file: File): boolean {
  if (file.type && ALLOWED_IMAGE_MIME_TYPES.has(file.type)) {
    return true;
  }
  const lowerName = file.name.toLowerCase();
  return ALLOWED_IMAGE_EXTENSIONS.some((ext) => lowerName.endsWith(ext));
}

export function isAllowedScitaAudioFile(file: File): boolean {
  if (file.type && ALLOWED_AUDIO_MIME_TYPES.has(file.type)) {
    return true;
  }
  const lowerName = file.name.toLowerCase();
  return ALLOWED_AUDIO_EXTENSIONS.some((ext) => lowerName.endsWith(ext));
}

export function getScitaEvidenceMaxBytes(formato: ScitaEvidenceFormat): number | null {
  if (formato === "imagen") return MAX_SCITA_IMAGE_BYTES;
  if (formato === "voz") return MAX_SCITA_AUDIO_BYTES;
  return null;
}

export function validateScitaEvidenceFile(
  file: File,
  formato: ScitaEvidenceFormat,
): { ok: true } | { ok: false; error: string } {
  if (!(file instanceof File) || file.size === 0) {
    if (formato === "imagen") {
      return { ok: false, error: "Adjunta una imagen antes de enviar." };
    }
    return { ok: false, error: "Graba una nota de voz antes de enviar." };
  }

  if (formato === "imagen") {
    if (!isAllowedScitaImageFile(file)) {
      return { ok: false, error: "Solo se permiten imágenes JPG, PNG o WEBP." };
    }
    if (file.size > MAX_SCITA_IMAGE_BYTES) {
      return { ok: false, error: "La imagen supera el límite de 4 MB." };
    }
    return { ok: true };
  }

  if (formato === "voz") {
    if (!isAllowedScitaAudioFile(file)) {
      return { ok: false, error: "Solo se permiten notas de voz en formatos de audio compatibles." };
    }
    if (file.size > MAX_SCITA_AUDIO_BYTES) {
      return { ok: false, error: "La nota de voz supera el límite de 2 MB." };
    }
    return { ok: true };
  }

  return { ok: false, error: "Formato de evidencia no soportado." };
}

export function buildScitaEvidencePath(reportId: string, fileName: string): string {
  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `reports/${reportId}/${Date.now()}-${safeName}`;
}

export function resolveEvidenceContentType(fileName: string, contentType = ""): string {
  if (contentType) return contentType;
  const lowerName = fileName.toLowerCase();
  if (lowerName.endsWith(".png")) return "image/png";
  if (lowerName.endsWith(".webp")) return "image/webp";
  if (lowerName.endsWith(".jpg") || lowerName.endsWith(".jpeg")) return "image/jpeg";
  if (lowerName.endsWith(".mp3")) return "audio/mpeg";
  if (lowerName.endsWith(".m4a")) return "audio/mp4";
  if (lowerName.endsWith(".ogg")) return "audio/ogg";
  if (lowerName.endsWith(".wav")) return "audio/wav";
  if (lowerName.endsWith(".webm")) return "audio/webm";
  return "application/octet-stream";
}

export type ScitaEvidenceUploadIntent = {
  formato: ScitaEvidenceFormat;
  fileName: string;
  fileSize: number;
  contentType?: string;
};

export function validateScitaEvidenceUploadIntent(
  intent: ScitaEvidenceUploadIntent,
): { ok: true; mimeType: string } | { ok: false; error: string } {
  const mimeType = resolveEvidenceContentType(intent.fileName, intent.contentType ?? "");
  const pseudoFile = {
    name: intent.fileName,
    type: mimeType,
    size: intent.fileSize,
  } as File;

  if (intent.formato === "imagen" && !isAllowedScitaImageFile(pseudoFile)) {
    return { ok: false, error: "Solo se permiten imágenes JPG, PNG o WEBP." };
  }
  if (intent.formato === "voz" && !isAllowedScitaAudioFile(pseudoFile)) {
    return { ok: false, error: "Solo se permiten notas de voz en formatos de audio compatibles." };
  }

  const maxBytes = getScitaEvidenceMaxBytes(intent.formato);
  if (!maxBytes || intent.fileSize <= 0) {
    return { ok: false, error: "Archivo de evidencia inválido o ausente." };
  }
  if (intent.fileSize > maxBytes) {
    return {
      ok: false,
      error:
        intent.formato === "imagen"
          ? "La imagen supera el límite de 4 MB."
          : "La nota de voz supera el límite de 2 MB.",
    };
  }

  return { ok: true, mimeType };
}

export async function uploadScitaEvidence(
  supabase: ReturnType<typeof createSupabaseService>,
  reportId: string,
  file: File,
): Promise<ScitaEvidenceMetadata> {
  const evidencePath = buildScitaEvidencePath(reportId, file.name);
  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const contentType = resolveEvidenceContentType(file.name, file.type);

  const { error: uploadError } = await supabase.storage
    .from(SCITA_EVIDENCE_BUCKET)
    .upload(evidencePath, fileBuffer, {
      contentType,
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`No se pudo subir la evidencia: ${uploadError.message}`);
  }

  return {
    evidence_bucket: SCITA_EVIDENCE_BUCKET,
    evidence_path: evidencePath,
    evidence_mime_type: contentType,
    evidence_size_bytes: file.size,
    evidence_original_name: file.name,
  };
}
