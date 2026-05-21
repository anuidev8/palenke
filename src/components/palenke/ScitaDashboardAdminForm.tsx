import type { ScitaDashboardRecord } from "@/lib/scita-dashboards";
import {
  createScitaDashboardAction,
  updateScitaDashboardAction,
} from "@/app/admin/dashboards/actions";

const MODULE_OPTIONS = [
  { value: "gobierno", label: "Gobierno propio" },
  { value: "conservacion", label: "Conservación" },
  { value: "titulacion", label: "Titulación colectiva" },
] as const;

const ICON_OPTIONS = [
  "/assets/scita/icons/icon-gobierno.png",
  "/assets/scita/icons/icon-conservacion.png",
  "/assets/scita/icons/icon-titulacion.png",
];

type ScitaDashboardAdminFormProps = {
  mode: "new" | "edit";
  dashboard?: ScitaDashboardRecord;
};

export function ScitaDashboardAdminForm({ mode, dashboard }: ScitaDashboardAdminFormProps) {
  const action =
    mode === "new"
      ? createScitaDashboardAction
      : updateScitaDashboardAction.bind(null, dashboard?.id ?? "");

  return (
    <section className="surface-card">
      <form action={action} className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm">
          <span className="font-semibold text-[color:var(--forest)]">Módulo</span>
          <select
            name="module_key"
            required
            className="input-shell"
            defaultValue={dashboard?.moduleKey ?? "gobierno"}
          >
            {MODULE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm">
          <span className="font-semibold text-[color:var(--forest)]">Visibilidad</span>
          <select
            name="visibility"
            required
            className="input-shell"
            defaultValue={dashboard?.visibility ?? "public"}
          >
            <option value="public">Público</option>
            <option value="internal">Interno (requiere sesión interna/admin)</option>
          </select>
        </label>

        <label className="grid gap-2 text-sm md:col-span-2">
          <span className="font-semibold text-[color:var(--forest)]">Título</span>
          <input name="title" required className="input-shell" defaultValue={dashboard?.title ?? ""} />
        </label>

        <label className="grid gap-2 text-sm md:col-span-2">
          <span className="font-semibold text-[color:var(--forest)]">Etiqueta corta (menú)</span>
          <input
            name="short_label"
            required
            className="input-shell"
            defaultValue={dashboard?.shortLabel ?? ""}
          />
        </label>

        <label className="grid gap-2 text-sm md:col-span-2">
          <span className="font-semibold text-[color:var(--forest)]">Descripción (menú)</span>
          <textarea
            name="description"
            required
            rows={2}
            className="textarea-shell"
            defaultValue={dashboard?.description ?? ""}
          />
        </label>

        <label className="grid gap-2 text-sm md:col-span-2">
          <span className="font-semibold text-[color:var(--forest)]">Descripción extendida (banner)</span>
          <textarea
            name="detail_description"
            required
            rows={4}
            className="textarea-shell"
            defaultValue={dashboard?.detailDescription ?? ""}
          />
        </label>

        <label className="grid gap-2 text-sm md:col-span-2">
          <span className="font-semibold text-[color:var(--forest)]">Viñetas del banner (una por línea)</span>
          <textarea
            name="detail_bullets"
            rows={5}
            className="textarea-shell"
            defaultValue={dashboard?.detailBullets.join("\n") ?? ""}
          />
        </label>

        <label className="grid gap-2 text-sm">
          <span className="font-semibold text-[color:var(--forest)]">Título del iframe (accesibilidad)</span>
          <input
            name="iframe_title"
            required
            className="input-shell"
            defaultValue={dashboard?.iframeTitle ?? ""}
            placeholder="P_… o I_…"
          />
        </label>

        <label className="grid gap-2 text-sm">
          <span className="font-semibold text-[color:var(--forest)]">Estado</span>
          <select name="status" className="input-shell" defaultValue={dashboard?.status ?? "active"}>
            <option value="active">Activo</option>
            <option value="draft">Borrador</option>
            <option value="disabled">Desactivado</option>
          </select>
        </label>

        <label className="grid gap-2 text-sm md:col-span-2">
          <span className="font-semibold text-[color:var(--forest)]">URL embed Power BI</span>
          <input
            name="embed_url"
            type="url"
            required
            className="input-shell"
            defaultValue={dashboard?.embedUrl ?? "https://app.powerbi.com/view?r="}
          />
        </label>

        <label className="grid gap-2 text-sm">
          <span className="font-semibold text-[color:var(--forest)]">Ancho embed (px)</span>
          <input
            name="embed_width"
            type="number"
            step="0.1"
            className="input-shell"
            defaultValue={dashboard?.embedWidth ?? 600}
          />
        </label>

        <label className="grid gap-2 text-sm">
          <span className="font-semibold text-[color:var(--forest)]">Alto embed (px)</span>
          <input
            name="embed_height"
            type="number"
            step="0.1"
            className="input-shell"
            defaultValue={dashboard?.embedHeight ?? 373.5}
          />
        </label>

        <label className="grid gap-2 text-sm">
          <span className="font-semibold text-[color:var(--forest)]">Recorte pie Power BI (px)</span>
          <input
            name="footer_crop_px"
            type="number"
            className="input-shell"
            defaultValue={dashboard?.footerCropPx ?? 56}
          />
        </label>

        <label className="grid gap-2 text-sm">
          <span className="font-semibold text-[color:var(--forest)]">Orden en menú</span>
          <input
            name="sort_order"
            type="number"
            className="input-shell"
            defaultValue={dashboard?.sortOrder ?? 0}
          />
        </label>

        <label className="grid gap-2 text-sm md:col-span-2">
          <span className="font-semibold text-[color:var(--forest)]">Ícono</span>
          <select name="icon_src" className="input-shell" defaultValue={dashboard?.iconSrc ?? ICON_OPTIONS[0]}>
            {ICON_OPTIONS.map((icon) => (
              <option key={icon} value={icon}>
                {icon}
              </option>
            ))}
          </select>
        </label>

        {dashboard?.embedUrl ? (
          <div className="md:col-span-2">
            <details className="rounded-[20px] border border-[color:var(--border-soft)] bg-white px-4 py-3">
              <summary className="cursor-pointer text-sm font-semibold text-[color:var(--forest)]">
                Previsualizar embed
              </summary>
              <div className="mt-4 overflow-hidden rounded-xl border border-[color:var(--border-soft)]">
                <iframe
                  title={dashboard.iframeTitle}
                  src={dashboard.embedUrl}
                  className="min-h-[320px] w-full bg-[#0b0b0b]"
                />
              </div>
            </details>
          </div>
        ) : null}

        <div className="flex justify-end md:col-span-2">
          <button type="submit" className="button-primary">
            {mode === "new" ? "Crear tablero" : "Guardar cambios"}
          </button>
        </div>
      </form>
    </section>
  );
}
