"use client";

import { Check, FileImage, MessageSquare, Mic } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  MAX_SCITA_AUDIO_BYTES,
  MAX_SCITA_IMAGE_BYTES,
  isAllowedScitaAudioFile,
  isAllowedScitaImageFile,
} from "@/lib/scita-evidence";

const mediaTypes = [
  { id: "texto", label: "Texto", icon: MessageSquare },
  { id: "imagen", label: "Imagen", icon: FileImage },
  { id: "voz", label: "Nota de voz", icon: Mic },
] as const;

type MediaId = (typeof mediaTypes)[number]["id"];

type ScitaReportMediaSectionProps = {
  initialMedia?: string;
};

function formatLimit(bytes: number): string {
  return `${Math.round(bytes / (1024 * 1024))} MB`;
}

export function ScitaReportMediaSection({ initialMedia = "" }: ScitaReportMediaSectionProps) {
  const validInitial = mediaTypes.some((mt) => mt.id === initialMedia) ? (initialMedia as MediaId) : "";
  const [selectedMedia, setSelectedMedia] = useState<MediaId | "">(validInitial);
  const [fileError, setFileError] = useState<string | null>(null);
  const [selectedImageName, setSelectedImageName] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);
  const [voiceReady, setVoiceReady] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const voiceInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    return () => {
      if (audioPreviewUrl) {
        URL.revokeObjectURL(audioPreviewUrl);
      }
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [audioPreviewUrl]);

  const resetVoiceState = () => {
    if (audioPreviewUrl) {
      URL.revokeObjectURL(audioPreviewUrl);
    }
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current = null;
    mediaRecorderRef.current = null;
    audioChunksRef.current = [];
    setAudioPreviewUrl(null);
    setVoiceReady(false);
    setRecording(false);
    if (voiceInputRef.current) {
      voiceInputRef.current.value = "";
    }
  };

  const assignFileToInput = (input: HTMLInputElement | null, file: File) => {
    if (!input) return;
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    input.files = dataTransfer.files;
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const file = event.target.files?.[0];
    if (!file) {
      setSelectedImageName(null);
      return;
    }
    if (!isAllowedScitaImageFile(file)) {
      setFileError("Solo se permiten imágenes JPG, PNG o WEBP.");
      event.target.value = "";
      setSelectedImageName(null);
      return;
    }
    if (file.size > MAX_SCITA_IMAGE_BYTES) {
      setFileError(`La imagen supera el límite de ${formatLimit(MAX_SCITA_IMAGE_BYTES)}.`);
      event.target.value = "";
      setSelectedImageName(null);
      return;
    }
    setSelectedImageName(file.name);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const startRecording = async () => {
    setFileError(null);
    resetVoiceState();

    if (!navigator.mediaDevices?.getUserMedia) {
      setFileError("Tu dispositivo no permite grabar audio desde el navegador.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const mimeType = recorder.mimeType || "audio/webm";
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        stream.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;

        if (blob.size > MAX_SCITA_AUDIO_BYTES) {
          setFileError(`La nota de voz supera el límite de ${formatLimit(MAX_SCITA_AUDIO_BYTES)}. Intenta una grabación más corta.`);
          return;
        }

        const extension = mimeType.includes("mp4") ? "m4a" : mimeType.includes("ogg") ? "ogg" : "webm";
        const file = new File([blob], `nota-voz-${Date.now()}.${extension}`, { type: mimeType });

        if (!isAllowedScitaAudioFile(file)) {
          setFileError("No se pudo preparar la nota de voz en un formato compatible.");
          return;
        }

        assignFileToInput(voiceInputRef.current, file);
        setAudioPreviewUrl(URL.createObjectURL(blob));
        setVoiceReady(true);
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setRecording(true);
    } catch {
      setFileError("No pudimos acceder al micrófono. Revisa los permisos del navegador.");
    }
  };

  return (
    <>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        {mediaTypes.map((mt) => {
          const Icon = mt.icon;
          const isSelected = selectedMedia === mt.id;
          return (
            <label key={mt.id} className="flex-1 cursor-pointer">
              <input
                type="radio"
                name="media"
                value={mt.id}
                checked={isSelected}
                onChange={() => {
                  setSelectedMedia(mt.id);
                  setFileError(null);
                  setSelectedImageName(null);
                  resetVoiceState();
                  if (imageInputRef.current) {
                    imageInputRef.current.value = "";
                  }
                }}
                className="peer sr-only"
                required
              />
              <div
                className={`relative flex items-center justify-center gap-2 rounded-[20px] border-2 px-4 py-4 transition-all duration-200 sm:gap-3 ${
                  isSelected
                    ? "scale-[1.02] border-[3px] border-[#2e7d32] bg-[#d8f3dc] shadow-[0_10px_28px_rgba(46,125,50,0.18)]"
                    : "border-[#e8dfd3] bg-white hover:border-[#d4c8b8] hover:bg-[#faf8f5]"
                }`}
                style={
                  isSelected
                    ? { boxShadow: "0 10px 28px rgba(46,125,50,0.18), 0 0 0 4px rgba(46,125,50,0.22)" }
                    : undefined
                }
              >
                {isSelected ? (
                  <span className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#2e7d32] shadow-sm">
                    <Check className="h-3 w-3 text-white" strokeWidth={3} aria-hidden="true" />
                  </span>
                ) : null}
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    isSelected ? "bg-white shadow-sm" : "bg-[#f0eae0]"
                  }`}
                >
                  <Icon className="h-5 w-5 text-[#1a1a1a]" aria-hidden="true" />
                </div>
                <p className={`text-sm font-semibold ${isSelected ? "text-[#1b5e20]" : "text-[#1a1a1a]"}`}>
                  {mt.label}
                </p>
              </div>
            </label>
          );
        })}
      </div>

      {selectedMedia ? (
        <div className="mt-5 space-y-3">
          {selectedMedia === "texto" ? (
            <textarea
              name="descripcion"
              rows={4}
              required
              placeholder="Cuéntanos qué está pasando… (ej: 'La quebrada lleva semanas con agua oscura y con olor raro')"
              className="w-full resize-vertical rounded-[14px] border border-[#e8dfd3] px-4 py-3 text-sm text-[#1a1a1a] placeholder:text-[#bab4ac] focus:border-[#2e7d32] focus:outline-none focus:ring-2 focus:ring-[#2e7d32]/20"
            />
          ) : null}

          {selectedMedia === "imagen" ? (
            <div className="flex items-center gap-3 rounded-[14px] border-2 border-dashed border-[#e8dfd3] px-5 py-5 text-center">
              <FileImage className="h-8 w-8 shrink-0 text-[#bab4ac]" aria-hidden="true" />
              <div className="text-left">
                <p className="text-sm font-semibold text-[#4a4540]">Adjuntar imagen</p>
                <p className="mt-0.5 text-xs text-[#7a756e]">
                  JPG, PNG, WEBP — máx. {formatLimit(MAX_SCITA_IMAGE_BYTES)}
                </p>
                {selectedImageName ? (
                  <p className="mt-1 text-xs font-medium text-[#2e7d32]">{selectedImageName}</p>
                ) : null}
              </div>
              <input
                ref={imageInputRef}
                type="file"
                name="archivo"
                accept="image/jpeg,image/png,image/webp"
                required
                onChange={handleImageChange}
                className="sr-only"
                id="archivo"
              />
              <label
                htmlFor="archivo"
                className="ml-auto cursor-pointer rounded-full border border-[#e8dfd3] bg-white px-4 py-2 text-xs font-semibold text-[#4a4540] transition hover:bg-[#f0eae0]"
              >
                Seleccionar
              </label>
            </div>
          ) : null}

          {selectedMedia === "voz" ? (
            <>
              <input ref={voiceInputRef} type="file" name="archivo" className="sr-only" required={voiceReady} />
              <div className="flex items-center gap-3 rounded-[14px] border border-[#e8dfd3] bg-[#f8f5f2] px-5 py-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#d32f2f]">
                  <Mic className="h-5 w-5 text-white" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#1a1a1a]">Nota de voz</p>
                  <p className="text-xs text-[#7a756e]">
                    {recording
                      ? "Grabando… presiona Detener cuando termines"
                      : voiceReady
                        ? "Grabación lista para enviar"
                        : `Presiona Grabar — máx. ${formatLimit(MAX_SCITA_AUDIO_BYTES)}`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={recording ? stopRecording : startRecording}
                  className={`rounded-full px-4 py-2 text-xs font-semibold text-white transition ${
                    recording || voiceReady
                      ? "bg-[#2e7d32] hover:bg-[#1b5e20]"
                      : "bg-[#d32f2f] hover:bg-[#b71c1c]"
                  }`}
                >
                  {recording ? "Detener" : voiceReady ? "Regrabar" : "Grabar"}
                </button>
              </div>
              {audioPreviewUrl ? (
                <audio controls src={audioPreviewUrl} className="w-full rounded-[14px]" preload="metadata">
                  Tu navegador no reproduce audio HTML5.
                </audio>
              ) : null}
            </>
          ) : null}

          {fileError ? (
            <p className="rounded-[12px] border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
              {fileError}
            </p>
          ) : null}
        </div>
      ) : (
        <p className="mt-5 rounded-[14px] border border-dashed border-[#e8dfd3] bg-[#faf8f5] px-4 py-3 text-center text-sm text-[#7a756e]">
          Elige un formato arriba para continuar.
        </p>
      )}
    </>
  );
}
