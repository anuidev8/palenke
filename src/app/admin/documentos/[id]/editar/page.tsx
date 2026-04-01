import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { notFound } from "next/navigation";
import { AdminLayout, Callout } from "@/components/mock/ui";
import { requireAdmin } from "@/lib/admin-access";
import { getFirstParam, type SearchParams, withRole } from "@/lib/viewer";
import { hasSupabaseServiceConfig } from "@/lib/config";
import {
  getEffectiveDocumentSource,
  isMissingPreferredSourceColumnError,
} from "@/lib/document-source";
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
  territory: string | null;
  department: string | null;
  municipality: string | null;
  visibility: "public" | "internal" | "sensitive";
  preferred_source: "storage" | "external" | null;
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
  const requestedTab = getFirstParam(qs.tab);

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
  let { data, error: fetchError } = await supabase
    .from("documents")
    .select("id,title,instrument,council,summary,published_on,external_url,document_type,priority_order,featured,source_label,territory,department,municipality,visibility,preferred_source,storage_bucket,storage_path,created_at")
    .eq("id", id)
    .maybeSingle();

  if (fetchError && isMissingPreferredSourceColumnError(fetchError)) {
    const fallbackResult = await supabase
      .from("documents")
      .select("id,title,instrument,council,summary,published_on,external_url,document_type,priority_order,featured,source_label,territory,department,municipality,visibility,storage_bucket,storage_path,created_at")
      .eq("id", id)
      .maybeSingle();

    data = fallbackResult.data
      ? { ...fallbackResult.data, preferred_source: null }
      : fallbackResult.data;
    fetchError = fallbackResult.error;
  }

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
  const tab = requestedTab === "normativa" || document.instrument === "normativa-vigente" ? "normativa" : "instrumentos";
  const isNormativa = document.instrument === "normativa-vigente";
  const effectiveSource = getEffectiveDocumentSource(document) ?? "storage";
  const formAction = updateDocumentAction.bind(null, document.id);

  return (
    <AdminLayout
      role={role}
      active="documentos"
      title="Editar documento"
      intro="Edita metadata, prioridad y la fuente principal del documento. Puedes conservar bucket/path y enlace externo al mismo tiempo, y decidir cuál usa la app."
    >
      <div className="mb-4 flex flex-wrap gap-3">
        <Link href={withRole("/admin/documentos", role, { tab })} className="button-secondary">
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
          <input type="hidden" name="tab" value={tab} />
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

          {isNormativa ? (
            <>
              <input type="hidden" name="instrument" value="normativa-vigente" />
              <div className="grid gap-2 text-sm">
                <span className="font-semibold text-[color:var(--forest)]">Sección</span>
                <input readOnly value="normativa-vigente" className="input-shell bg-[#f8f5f2]" />
              </div>
            </>
          ) : (
            <label className="grid gap-2 text-sm">
              <span className="font-semibold text-[color:var(--forest)]">Instrumento</span>
              <select name="instrument" required defaultValue={document.instrument} className="input-shell">
                {[...new Set([document.instrument, ...INSTRUMENT_OPTIONS.filter((value) => value !== "normativa-vigente")])].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>
          )}

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

          <fieldset className="grid gap-3 text-sm md:col-span-2">
            <legend className="font-semibold text-[color:var(--forest)]">Fuente principal</legend>
            <div className="flex flex-wrap gap-3">
              <label className="inline-flex items-center gap-2 rounded-2xl border border-[#e8dfd3] bg-white px-4 py-3">
                <input
                  type="radio"
                  name="preferred_source"
                  value="storage"
                  defaultChecked={effectiveSource === "storage"}
                />
                <span>PDF / archivo en Storage</span>
              </label>
              <label className="inline-flex items-center gap-2 rounded-2xl border border-[#e8dfd3] bg-white px-4 py-3">
                <input
                  type="radio"
                  name="preferred_source"
                  value="external"
                  defaultChecked={effectiveSource === "external"}
                />
                <span>Enlace externo oficial</span>
              </label>
            </div>
            <span className="text-xs text-[color:var(--muted)]">
              La opción elegida define qué abre la biblioteca cuando el documento tenga tanto archivo como URL externa.
            </span>
          </fieldset>

          <label className="grid gap-2 text-sm md:col-span-2">
            <span className="font-semibold text-[color:var(--forest)]">Enlace externo oficial</span>
            <input
              name="external_url"
              className="input-shell"
              defaultValue={document.external_url ?? ""}
              placeholder="https://..."
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="font-semibold text-[color:var(--forest)]">Territorio</span>
            <input
              name="territory"
              className="input-shell"
              defaultValue={document.territory ?? ""}
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="font-semibold text-[color:var(--forest)]">Departamento / Estado</span>
            <input
              name="department"
              className="input-shell"
              defaultValue={document.department ?? ""}
            />
          </label>

          <label className="grid gap-2 text-sm md:col-span-2">
            <span className="font-semibold text-[color:var(--forest)]">Municipio / Ciudad</span>
            <input
              name="municipality"
              className="input-shell"
              defaultValue={document.municipality ?? ""}
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="font-semibold text-[color:var(--forest)]">Bucket</span>
            <select
              name="storage_bucket"
              defaultValue={document.storage_bucket ?? ""}
              className="input-shell"
            >
              <option value="docs-internal">docs-internal</option>
              <option value="docs-sensitive">docs-sensitive</option>
              <option value="docs-public">docs-public</option>
              <option value="">(sin bucket para ruta pública local)</option>
            </select>
          </label>

          <label className="grid gap-2 text-sm">
            <span className="font-semibold text-[color:var(--forest)]">Ruta storage</span>
            <input
              name="storage_path"
              defaultValue={document.storage_path ?? ""}
              className="input-shell"
              placeholder="reglamentos/cc-x/archivo.pdf  ó  /docs/archivo.pdf"
            />
          </label>

          <label className="grid gap-2 text-sm md:col-span-2">
            <span className="font-semibold text-[color:var(--forest)]">
              Reemplazar / subir archivo (opcional)
            </span>
            <input
              name="file"
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="input-shell"
            />
            <span className="text-xs text-[color:var(--muted)]">
              Si cargas un archivo, se sube con `upsert` al bucket y la ruta indicados arriba (máx. 20 MB). No se permiten cargas cuando la ruta sea local `/docs/...`.
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
            <Link href={withRole("/admin/documentos", role, { tab })} className="button-ghost">
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
