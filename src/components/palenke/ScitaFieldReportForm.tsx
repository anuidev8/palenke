import Link from "next/link";
import { AlertTriangle, LayoutDashboard, X } from "lucide-react";
import { ScitaReportCategorySection } from "@/components/palenke/ScitaReportCategorySection";
import { ScitaReportMediaSection } from "@/components/palenke/ScitaReportMediaSection";
import { normalizeScitaBoardOrigin, SCITA_BOARD_OPTIONS } from "@/lib/scita-report-form";

type ScitaFieldReportFormProps = {
  formAction?: any;
  cancelHref?: string;
  onCancel?: () => void;
  selectedCategory?: string;
  selectedMedia?: string;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  tableroOrigen?: string;
  role?: string;
};

export function ScitaFieldReportForm({
  formAction,
  cancelHref,
  onCancel,
  selectedCategory = "",
  selectedMedia = "",
  onSubmit,
  tableroOrigen = "",
  role = "",
}: ScitaFieldReportFormProps) {
  const preselectedBoard = normalizeScitaBoardOrigin(tableroOrigen);
  const preselectedBoardLabel = SCITA_BOARD_OPTIONS.find((board) => board.id === preselectedBoard)?.label;

  return (
    <form
      action={formAction}
      method={typeof formAction === "string" ? "GET" : undefined}
      onSubmit={onSubmit}
      className="w-full"
    >
      <input type="hidden" name="role" value={role} />
      <div className="mb-4 overflow-hidden rounded-[28px] bg-[#2e7d32]">
        <div className="flex items-start justify-between px-7 py-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">SCITA · Monitoreo comunitario</p>
            <h1 className="mt-1 font-display text-2xl text-white sm:text-3xl">Envía información ambiental</h1>
            <p className="mt-1 text-sm text-white/75">Tu aporte desde el territorio es soberanía de información</p>
          </div>
          {onCancel ? (
            <button
              type="button"
              onClick={onCancel}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30"
              aria-label="Cerrar formulario"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <Link
              href={cancelHref ?? "/scita"}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30"
              aria-label="Cerrar formulario"
            >
              <X className="h-4 w-4" />
            </Link>
          )}
        </div>
        <div className="flex border-t border-white/15">
          {["Categoría", "Formato", "Detalles"].map((step, i) => (
            <div key={step} className="flex flex-1 flex-col items-center gap-1 py-3 text-center">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-[11px] font-bold text-white">{i + 1}</span>
              <span className="hidden text-[10px] font-semibold uppercase tracking-[0.12em] text-white/70 sm:block">{step}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4 overflow-hidden rounded-[28px] bg-white p-7 shadow-sm">
        <p className="eyebrow mb-1">Paso 1</p>
        <h2 className="font-display text-xl text-[#1a1a1a]">¿Qué tipo de amenaza observaste?</h2>
        <p className="mt-1 text-sm text-[#7a756e]">Selecciona la categoría que mejor describe lo que viste.</p>
        <ScitaReportCategorySection initialCategory={selectedCategory} />
      </div>

      <div className="mb-4 overflow-hidden rounded-[28px] bg-white p-7 shadow-sm">
        <p className="eyebrow mb-1">Paso 2</p>
        <h2 className="font-display text-xl text-[#1a1a1a]">¿Cómo quieres enviar la información?</h2>
        <p className="mt-1 text-sm text-[#7a756e]">Elige el formato que más te resulte fácil desde el campo.</p>
        <ScitaReportMediaSection initialMedia={selectedMedia} />
      </div>

      <div className="mb-4 overflow-hidden rounded-[28px] bg-white p-7 shadow-sm">
        <p className="eyebrow mb-1">Paso 3 · Opcional</p>
        <h2 className="font-display text-xl text-[#1a1a1a]">Contexto y contacto</h2>
        <p className="mt-1 text-sm text-[#7a756e]">
          Puedes indicar el tablero SCITA relacionado y, si quieres, un medio para dar seguimiento.
        </p>

        <div className="mt-5">
          <label htmlFor="tablero_origen" className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#1a1a1a]">
            <LayoutDashboard className="h-4 w-4 text-[#7a756e]" aria-hidden="true" />
            Tablero SCITA relacionado
            <span className="font-normal text-[#7a756e]">(opcional)</span>
          </label>
          {preselectedBoardLabel ? (
            <p className="mb-2 rounded-[12px] border border-[#c8e6c9] bg-[#e8f5e9] px-3 py-2 text-xs text-[#2e7d32]">
              Detectamos el tablero <strong>{preselectedBoardLabel}</strong> desde el enlace. Puedes cambiarlo o dejarlo sin especificar.
            </p>
          ) : null}
          <select
            id="tablero_origen"
            name="tablero_origen"
            defaultValue={preselectedBoard}
            className="w-full rounded-[14px] border border-[#e8dfd3] bg-white px-4 py-3 text-sm text-[#1a1a1a] focus:border-[#2e7d32] focus:outline-none focus:ring-2 focus:ring-[#2e7d32]/20"
          >
            <option value="">No especificado</option>
            {SCITA_BOARD_OPTIONS.map((board) => (
              <option key={board.id} value={board.id}>
                {board.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="nombre" className="mb-2 block text-sm font-semibold text-[#1a1a1a]">Nombre <span className="font-normal text-[#7a756e]">(opcional)</span></label>
            <input id="nombre" name="nombre" type="text" placeholder="Tu nombre" className="w-full rounded-[14px] border border-[#e8dfd3] px-4 py-3 text-sm text-[#1a1a1a] placeholder:text-[#bab4ac] focus:border-[#2e7d32] focus:outline-none focus:ring-2 focus:ring-[#2e7d32]/20" />
          </div>
          <div>
            <label htmlFor="contacto" className="mb-2 block text-sm font-semibold text-[#1a1a1a]">WhatsApp / teléfono <span className="font-normal text-[#7a756e]">(opcional)</span></label>
            <input id="contacto" name="contacto" type="tel" placeholder="+57 300 000 0000" className="w-full rounded-[14px] border border-[#e8dfd3] px-4 py-3 text-sm text-[#1a1a1a] placeholder:text-[#bab4ac] focus:border-[#2e7d32] focus:outline-none focus:ring-2 focus:ring-[#2e7d32]/20" />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-[28px] bg-[#2e7d32] p-7">
        <p className="text-sm leading-6 text-white/80">
          Al enviar, tu información queda registrada en el sistema de monitoreo comunitario del SCITA.
          Solo el equipo interno del Palenke / PCN tiene acceso.
        </p>
        <div className="mt-5 flex gap-3">
          <button type="submit" className="flex-1 rounded-[14px] bg-white py-3.5 text-sm font-bold text-[#2e7d32] transition hover:bg-[#f0eae0]">
            Enviar reporte
          </button>
          {onCancel ? (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-[14px] border border-white/30 px-5 py-3.5 text-sm font-semibold text-white/80 transition hover:bg-white/10"
            >
              Cancelar
            </button>
          ) : (
            <Link href={cancelHref ?? "/scita"} className="rounded-[14px] border border-white/30 px-5 py-3.5 text-sm font-semibold text-white/80 transition hover:bg-white/10">
              Cancelar
            </Link>
          )}
        </div>
      </div>

      <div className="mt-5 flex max-w-2xl items-start gap-3 rounded-[20px] bg-[#fff3cd] px-5 py-4">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#f57f17]" aria-hidden="true" />
        <p className="text-xs leading-5 text-[#7a4f00]">
          Los datos enviados son gestionados exclusivamente por el equipo interno del Palenke / PCN
          y no se comparten con terceros. Tu participación puede ser anónima.
        </p>
      </div>
    </form>
  );
}
