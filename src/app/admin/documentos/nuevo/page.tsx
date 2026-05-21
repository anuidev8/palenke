import Link from "next/link";
import { AdminLayout } from "@/components/mock/AdminLayout";
import { Callout } from "@/components/mock/ui";
import { requireAdmin } from "@/lib/admin-access";
import { getFirstParam, type SearchParams, withRole } from "@/lib/viewer";
import { createDocumentAction } from "./actions";

const INSTRUMENT_OPTIONS = [
  "reglamentos",
  "planes-uso",
  "etnodesarrollo",
  "conservacion",
  "normativa-vigente",
  "litigio",
  "proteccion-hidrica",
];

export default async function NuevoDocumentoPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { role, searchParams: qs } = await requireAdmin(searchParams);
  const error = getFirstParam(qs.error);
  const requestedTab = getFirstParam(qs.tab);
  const tab = requestedTab === "normativa" ? "normativa" : "instrumentos";
  const isNormativa = tab === "normativa";
  const instrumentOptions = isNormativa
    ? ["normativa-vigente"]
    : INSTRUMENT_OPTIONS.filter((value) => value !== "normativa-vigente");

  return (
    <AdminLayout
      role={role}
      active="documentos"
      title="Nuevo documento"
      intro="Crea un documento real en `public.documents`, con soporte para archivo subido, ruta local pública o enlace externo oficial."
    >
      <div className="mb-4 flex flex-wrap gap-3">
        <Link href={withRole("/admin/documentos", role, { tab })} className="button-secondary">
          Volver a documentos
        </Link>
      </div>

      {error ? (
        <Callout tone="danger" title="No se pudo crear">
          <p>{decodeURIComponent(error)}</p>
        </Callout>
      ) : null}

      <section className="surface-card space-y-5">
        <form action={createDocumentAction} className="grid gap-5 md:grid-cols-2">
          <input type="hidden" name="tab" value={tab} />
          <label className="grid gap-2 text-sm md:col-span-2">
            <span className="font-semibold text-[color:var(--forest)]">Título</span>
            <input name="title" required className="input-shell" placeholder="Título del documento" />
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
              <select name="instrument" required defaultValue="" className="input-shell">
                <option value="" disabled>
                  Selecciona
                </option>
                {instrumentOptions.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>
          )}

          <label className="grid gap-2 text-sm">
            <span className="font-semibold text-[color:var(--forest)]">Visibilidad</span>
            <select name="visibility" required defaultValue={isNormativa ? "public" : "internal"} className="input-shell">
              <option value="public">public</option>
              <option value="internal">internal</option>
              <option value="sensitive">sensitive</option>
            </select>
          </label>

          <label className="grid gap-2 text-sm md:col-span-2">
            <span className="font-semibold text-[color:var(--forest)]">Consejo comunitario</span>
            <input name="council" className="input-shell" placeholder="Opcional" />
          </label>

          <label className="grid gap-2 text-sm md:col-span-2">
            <span className="font-semibold text-[color:var(--forest)]">Resumen</span>
            <textarea
              name="summary"
              rows={3}
              className="textarea-shell"
              placeholder="Resumen breve para cards o listados"
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="font-semibold text-[color:var(--forest)]">Fecha del documento</span>
            <input name="published_on" type="date" className="input-shell" />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="font-semibold text-[color:var(--forest)]">Tipo de documento</span>
            <input name="document_type" className="input-shell" placeholder="Ley, Decreto, Sentencia..." />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="font-semibold text-[color:var(--forest)]">Prioridad</span>
            <input
              name="priority_order"
              type="number"
              min="0"
              step="1"
              defaultValue="0"
              className="input-shell"
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="font-semibold text-[color:var(--forest)]">Etiqueta del botón</span>
            <input name="source_label" className="input-shell" placeholder="Descargar PDF, Función Pública..." />
          </label>

          <fieldset className="grid gap-3 text-sm md:col-span-2">
            <legend className="font-semibold text-[color:var(--forest)]">Fuente principal</legend>
            <div className="flex flex-wrap gap-3">
              <label className="inline-flex items-center gap-2 rounded-2xl border border-[#e8dfd3] bg-white px-4 py-3">
                <input type="radio" name="preferred_source" value="storage" defaultChecked />
                <span>PDF / archivo en Storage</span>
              </label>
              <label className="inline-flex items-center gap-2 rounded-2xl border border-[#e8dfd3] bg-white px-4 py-3">
                <input type="radio" name="preferred_source" value="external" />
                <span>Enlace externo oficial</span>
              </label>
            </div>
            <span className="text-xs text-[color:var(--muted)]">
              La opción elegida define qué abre la biblioteca cuando guardes tanto archivo como URL externa.
            </span>
          </fieldset>

          <label className="grid gap-2 text-sm md:col-span-2">
            <span className="font-semibold text-[color:var(--forest)]">Enlace externo oficial</span>
            <input
              name="external_url"
              className="input-shell"
              placeholder="https://www.funcionpublica.gov.co/..."
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="font-semibold text-[color:var(--forest)]">Territorio</span>
            <input name="territory" className="input-shell" placeholder="Nacional, Internacional..." />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="font-semibold text-[color:var(--forest)]">Departamento / Estado</span>
            <input name="department" className="input-shell" placeholder="Bogotá D.C., Quebec..." />
          </label>

          <label className="grid gap-2 text-sm md:col-span-2">
            <span className="font-semibold text-[color:var(--forest)]">Municipio / Ciudad</span>
            <input name="municipality" className="input-shell" placeholder="Bogotá, Montreal..." />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="font-semibold text-[color:var(--forest)]">Bucket</span>
            <select name="storage_bucket" defaultValue="docs-internal" className="input-shell">
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
              className="input-shell"
              placeholder="reglamentos/cc-x/archivo.pdf  ó  /docs/archivo.pdf"
            />
          </label>

          <label className="grid gap-2 text-sm md:col-span-2">
            <span className="font-semibold text-[color:var(--forest)]">Archivo (opcional)</span>
            <input name="file" type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="input-shell" />
            <span className="text-xs text-[color:var(--muted)]">
              Si cargas un archivo, se sube con `upsert` a la ruta indicada (máx. 20 MB). Para rutas
              locales `/docs/...` no se permite carga desde este formulario, pero sí puedes guardar metadata y enlace oficial.
            </span>
          </label>

          <label className="inline-flex items-center gap-3 text-sm font-medium text-[color:var(--forest)] md:col-span-2">
            <input name="featured" type="checkbox" className="h-4 w-4 rounded border-[#d1ccc5]" />
            Destacar en listados priorizados
          </label>

          <div className="md:col-span-2 flex justify-end gap-3">
            <Link href={withRole("/admin/documentos", role, { tab })} className="button-ghost">
              Cancelar
            </Link>
            <button type="submit" className="button-primary">
              {isNormativa ? "Crear norma vigente" : "Crear documento"}
            </button>
          </div>
        </form>
      </section>
    </AdminLayout>
  );
}
