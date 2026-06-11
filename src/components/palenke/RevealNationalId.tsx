"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { revealNationalIdAction } from "@/app/admin/solicitudes/[id]/actions";
import { formatIdWithDots, maskNationalId } from "@/lib/access-requests";

type RevealNationalIdProps = {
  requestId: string;
  maskedId: string;
};

export function RevealNationalId({ requestId, maskedId }: RevealNationalIdProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [unmaskedId, setUnmaskedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleToggle() {
    if (isRevealed) {
      // If already unmasked, just hide it in UI (toggle mode in memory, no duplicate API calls)
      setIsRevealed(false);
      return;
    }

    if (unmaskedId) {
      // If we already fetched it previously, just toggle it open in UI
      setIsRevealed(true);
      return;
    }

    // Otherwise, fetch from Server Action
    setIsLoading(true);
    setError(null);

    try {
      const res = await revealNationalIdAction(requestId);
      if (res.success && res.nationalId) {
        setUnmaskedId(res.nationalId);
        setIsRevealed(true);
      } else {
        setError(res.error ?? "No se pudo revelar la cédula.");
      }
    } catch (err: any) {
      setError(err?.message ?? "Error inesperado al consultar los datos.");
    } finally {
      setIsLoading(false);
    }
  }

  const currentDisplay = isRevealed && unmaskedId ? unmaskedId : maskedId;
  const formattedDisplay = formatIdWithDots(currentDisplay);

  return (
    <div className="flex flex-col gap-1.5 w-full max-w-sm">
      <div className="flex items-center justify-between gap-3 p-2.5 px-3.5 bg-[color:var(--sand-light)] border border-[color:var(--sand-strong)] rounded-xl shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] hover:border-[color:var(--gold-light)] transition-all duration-300">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-[color:var(--muted)] select-none">
            Cédula de Ciudadanía
          </span>
          <span className="font-mono text-sm font-semibold tracking-wide text-[color:var(--forest)] selection:bg-[color:var(--gold-light)]/30">
            {formattedDisplay}
          </span>
        </div>

        <button
          onClick={handleToggle}
          disabled={isLoading}
          type="button"
          aria-label={isRevealed ? "Ocultar cédula" : "Revelar cédula con registro de auditoría"}
          className="relative flex items-center justify-center p-2 rounded-lg bg-white/80 hover:bg-white border border-[color:var(--sand-strong)] text-[color:var(--forest)] hover:text-[color:var(--gold-strong)] hover:shadow-sm disabled:opacity-50 transition-all duration-200 active:scale-95"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-[color:var(--gold-strong)]" />
          ) : isRevealed ? (
            <EyeOff className="w-4 h-4 transition-transform duration-200 hover:scale-105" />
          ) : (
            <Eye className="w-4 h-4 transition-transform duration-200 hover:scale-105" />
          )}
        </button>
      </div>

      {/* Audit/Consent Note */}
      <p className="text-[10px] text-[color:var(--muted)] leading-relaxed px-1 select-none">
        {isRevealed
          ? "✓ Cédula revelada. Esta acción ha sido registrada en el log de auditoría."
          : "Al revelar la cédula, se registrará una entrada en el historial de auditoría."}
      </p>

      {/* Error Callout */}
      {error && (
        <div className="flex items-start gap-1.5 p-2 px-2.5 bg-red-50 border border-red-100 rounded-lg text-[11px] text-red-600 animate-fadeIn">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <div className="flex-1 leading-normal">{error}</div>
        </div>
      )}
    </div>
  );
}
