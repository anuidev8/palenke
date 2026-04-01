import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { notFound } from "next/navigation";
import { AdminLayout, Callout } from "@/components/mock/ui";
import { requireAdmin } from "@/lib/admin-access";
import { getFirstParam, type SearchParams, withRole } from "@/lib/viewer";
import { hasSupabaseServiceConfig } from "@/lib/config";
import { createSupabaseService } from "@/lib/supabase/service";
import { updateDocumentAction } from "./actions";

type EditableDocument = {
  id: string;
  title: string;
  instrument: string;
  council: string | null;
  summary: string | null;
  published_on: string | null;
  external_url: string | null;
  document_type: string | null;
  priority_order: number | null;
  featured: boolean | null;
  source_label: string | null;
  visibility: "public" | "internal" | "sensitive";
  storage_bucket: string | null;
  storage_path: string | null;
  created_at: string;
};

const INSTRUMENT_OPTIONS = [
  "reglamentos",
  "planes-uso",
  "etnodesarrollo",
  "conservacion",
  "normativa-vigente",
  "litigio",
  "proteccion-hidrica",
];

export default async function EditarDocumentoPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<SearchParams>;
}) {
  noStore();
  const { id } = await params;
  const { role, searchParams: qs } = await requireAdmin(searchParams);
  const notice = getFirstParam(qs.notice);
  const error = getFirstParam(qs.error);

  if (!hasSupabaseServiceConfig()) {
    return (
      <AdminLayout
        role={role}
        active="documentos"
        title="Editar documento"
        intro="Edición directa de metadata, enlace oficial y reemplazo opcional de archivo para documentos en Supabase."
      >
        <Callout tone="warning" title="Configuración incompleta">
          <p>Falta configuración de Supabase service en el servidor para editar documentos.</p>
        </Callout>
      </AdminLayout>
    );
  }

  const supabase = createSupabaseService();
  const { data, error: fetchError } = await supabase
    .from("documents")
    .select("id,title,instrument,council,summary,published_on,external_url,document_type,priority_order,featured,source_label,visibility,storage_bucket,storage_path,created_at")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) {
    return (
      <AdminLayout
        role={role}
        active="documentos"
        title="Editar documento"
        intro="Edición directa de metadata, enlace oficial y reemplazo opcional de archivo para documentos en Supabase."
      >
        <Callout tone="danger" title="No se pudo cargar el documento">
          <p>{fetchError.message}</p>
        </Callout>
      </AdminLayout>
    );
  }

  const document = data as EditableDocument | null;
  if (!document) {
    notFound();
  }

  const canReplaceStorageFile = Boolean(
    document.storage_bucket && document.storage_path && !document.storage_path.startsWith("/"),
  );
  const formAction = updateDocumentAction.bind(null, document.id);

  return (
    <AdminLayout
      role={role}
      active="documentos"
      title="Editar documento"
      intro="Edita metadata, prioridad, enlace oficial y reemplaza el archivo cuando exista ruta en Supabase Storage."
    >
      <div className="mb-4 flex flex-wrap gap-3">
        <Link href={withRole("/admin/documentos", role)} className="button-secondary">
          Volver a documentos
        </Link>
      </div>

      {notice === "saved" ? (
        <Callout tone="success" title="Documento actualizado">
          <p>Los cambios quedaron guardados correctamente.</p>
        </Callout>
      ) : null}

      {error ? (
        <Callout tone="danger" title="No se pudo guardar">
          <p>{decodeURIComponent(error)}</p>
        </Callout>
      ) : null}

      <section className="surface-card space-y-5">
        <form action={formAction} className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-2 text-sm md:col-span-2">
            <span className="font-semibold text-[color:var(--forest)]">Título</span>
            <input
              name="title"
              required
              defaultValue={document.title}
              className="input-shell"
              placeholder="Título del documento"
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="font-semibold text-[color:var(--forest)]">Instrumento</span>
            <select name="instrument" required defaultValue={document.instrument} className="input-shell">
              {[...new Set([document.instrument, ...INSTRUMENT_OPTIONS])].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm">
            <span className="font-semibold text-[color:var(--forest)]">Visibilidad</span>
            <select name="visibility" required defaultValue={document.visibility} className="input-shell">
              <option value="public">public</option>
              <option value="internal">internal</option>
              <option value="sensitive">sensitive</option>
            </select>
          </label>

          <label className="grid gap-2 text-sm md:col-span-2">
            <span className="font-semibold text-[color:var(--forest)]">Consejo comunitario</span>
            <input
              name="council"
              defaultValue={document.council ?? ""}
              className="input-shell"
              placeholder="Opcional"
            />
          </label>

          <label className="grid gap-2 text-sm md:col-span-2">
            <span className="font-semibold text-[color:var(--forest)]">Resumen</span>
            <textarea
              name="summary"
              rows={3}
              className="textarea-shell"
              defaultValue={document.summary ?? ""}
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="font-semibold text-[color:var(--forest)]">Fecha del documento</span>
            <input
              name="published_on"
              type="date"
              className="input-shell"
              defaultValue={document.published_on ?? ""}
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="font-semibold text-[color:var(--forest)]">Tipo de documento</span>
            <input
              name="document_type"
              className="input-shell"
              defaultValue={document.document_type ?? ""}
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="font-semibold text-[color:var(--forest)]">Prioridad</span>
            <input
              name="priority_order"
              type="number"
              min="0"
              step="1"
              className="input-shell"
              defaultValue={String(document.priority_order ?? 0)}
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="font-semibold text-[color:var(--forest)]">Etiqueta del botón</span>
            <input
              name="source_label"
              className="input-shell"
              defaultValue={document.source_label ?? ""}
            />
          </label>

          <label className="grid gap-2 text-sm md:col-span-2">
            <span className="font-semibold text-[color:var(--forest)]">Enlace externo oficial</span>
            <input
              name="external_url"
              className="input-shell"
              defaultValue={document.external_url ?? ""}
              placeholder="https://..."
            />
          </label>

          <div className="grid gap-2 text-sm">
            <span className="font-semibold text-[color:var(--forest)]">Bucket</span>
            <input readOnly value={document.storage_bucket ?? "—"} className="input-shell bg-[#f8f5f2]" />
          </div>

          <div className="grid gap-2 text-sm">
            <span className="font-semibold text-[color:var(--forest)]">Ruta storage</span>
            <input readOnly value={document.storage_path ?? "—"} className="input-shell bg-[#f8f5f2]" />
          </div>

          <label className="grid gap-2 text-sm md:col-span-2">
            <span className="font-semibold text-[color:var(--forest)]">
              Reemplazar archivo (opcional)
            </span>
            <input
              name="file"
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="input-shell"
              disabled={!canReplaceStorageFile}
            />
            <span className="text-xs text-[color:var(--muted)]">
              {canReplaceStorageFile
                ? "Si cargas un archivo, se reemplaza el actual en la misma ruta (máx. 20 MB)."
                : "Este documento no tiene una ruta editable en Supabase Storage desde este formulario."}
            </span>
          </label>

          <label className="inline-flex items-center gap-3 text-sm font-medium text-[color:var(--forest)] md:col-span-2">
            <input
              name="featured"
              type="checkbox"
              className="h-4 w-4 rounded border-[#d1ccc5]"
              defaultChecked={Boolean(document.featured)}
            />
            Destacar en listados priorizados
          </label>

          <div className="md:col-span-2 flex justify-end gap-3">
            <Link href={withRole("/admin/documentos", role)} className="button-ghost">
              Cancelar
            </Link>
            <button type="submit" className="button-primary">
              Guardar cambios
            </button>
          </div>
        </form>
      </section>
    </AdminLayout>
  );
}
