import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminLayout } from "@/components/mock/AdminLayout";
import { Callout } from "@/components/mock/ui";
import { requireAdmin } from "@/lib/admin-access";
import { getFirstParam, type SearchParams, withRole } from "@/lib/viewer";
import { hasSupabaseServiceConfig } from "@/lib/config";
import { createSupabaseService } from "@/lib/supabase/service";
import { updateEventAction } from "../../../actions";

export default async function EditEventPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { id } = await params;
  const { role, searchParams: qs } = await requireAdmin(searchParams);
  const notice = getFirstParam(qs.notice);
  const error = getFirstParam(qs.error);

  if (!hasSupabaseServiceConfig()) {
    return (
      <AdminLayout
        role={role}
        active="novedades"
        title="Editar evento"
        intro="La edición requiere configuración de Supabase service en el servidor."
      >
        <Callout tone="warning" title="Configuración incompleta">
          <p>Falta configuración de Supabase service para editar eventos.</p>
        </Callout>
      </AdminLayout>
    );
  }

  const supabase = createSupabaseService();
  const { data, error: fetchError } = await supabase.from("events").select("*").eq("id", id).maybeSingle();

  if (fetchError) {
    return (
      <AdminLayout
        role={role}
        active="novedades"
        title="Editar evento"
        intro="No se pudo cargar el evento solicitado."
      >
        <Callout tone="danger" title="Error al cargar">
          <p>{fetchError.message}</p>
        </Callout>
      </AdminLayout>
    );
  }

  if (!data) {
    notFound();
  }

  return (
    <AdminLayout
      role={role}
      active="novedades"
      title="Editar evento"
      intro="Actualiza fechas, descripción, recursos y visibilidad del evento en agenda."
    >
      <div className="flex flex-wrap gap-3">
        <Link href={withRole("/admin/novedades/eventos", role)} className="button-secondary">
          Volver a eventos
        </Link>
      </div>

      {notice === "saved" ? (
        <Callout tone="success" title="Evento actualizado">
          <p>Los cambios quedaron guardados correctamente.</p>
        </Callout>
      ) : null}
      {error ? (
        <Callout tone="danger" title="No se pudo guardar">
          <p>{decodeURIComponent(error)}</p>
        </Callout>
      ) : null}

      <section className="surface-card">
        <form action={updateEventAction.bind(null, id)} className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-2 text-sm md:col-span-2">
            <span className="font-semibold text-[color:var(--forest)]">Título</span>
            <input name="title" required className="input-shell" defaultValue={String(data.title ?? "")} />
          </label>

          <label className="grid gap-2 text-sm md:col-span-2">
            <span className="font-semibold text-[color:var(--forest)]">Resumen</span>
            <textarea
              name="summary"
              required
              rows={3}
              className="textarea-shell"
              defaultValue={String(data.summary ?? "")}
            />
          </label>

          <label className="grid gap-2 text-sm md:col-span-2">
            <span className="font-semibold text-[color:var(--forest)]">Descripción</span>
            <textarea
              name="description"
              required
              rows={8}
              className="textarea-shell"
              defaultValue={String(data.description ?? "")}
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="font-semibold text-[color:var(--forest)]">Categoría</span>
            <input name="category" className="input-shell" defaultValue={String(data.category ?? "")} />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="font-semibold text-[color:var(--forest)]">Territorio</span>
            <input name="territory" className="input-shell" defaultValue={String(data.territory ?? "")} />
          </label>

          <label className="grid gap-2 text-sm md:col-span-2">
            <span className="font-semibold text-[color:var(--forest)]">Ubicación</span>
            <input name="location" required className="input-shell" defaultValue={String(data.location ?? "")} />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="font-semibold text-[color:var(--forest)]">Inicio</span>
            <input
              name="starts_at"
              type="datetime-local"
              required
              className="input-shell"
              defaultValue={String(data.starts_at ?? "").slice(0, 16)}
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="font-semibold text-[color:var(--forest)]">Fin</span>
            <input
              name="ends_at"
              type="datetime-local"
              className="input-shell"
              defaultValue={String(data.ends_at ?? "").slice(0, 16)}
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="font-semibold text-[color:var(--forest)]">Enlace relacionado</span>
            <input name="resource_url" className="input-shell" defaultValue={String(data.resource_url ?? "")} />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="font-semibold text-[color:var(--forest)]">Etiqueta del enlace</span>
            <input name="resource_label" className="input-shell" defaultValue={String(data.resource_label ?? "")} />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="font-semibold text-[color:var(--forest)]">Visibilidad</span>
            <select name="visibility" className="input-shell" defaultValue={String(data.visibility ?? "public")}>
              <option value="public">public</option>
              <option value="internal">internal</option>
            </select>
          </label>

          <label className="inline-flex items-center gap-3 text-sm font-medium text-[color:var(--forest)] md:col-span-2">
            <input
              name="featured"
              type="checkbox"
              className="h-4 w-4 rounded border-[#d1ccc5]"
              defaultChecked={Boolean(data.featured)}
            />
            Destacar en la home
          </label>

          <div className="flex justify-end md:col-span-2">
            <button type="submit" className="button-primary">
              Guardar cambios
            </button>
          </div>
        </form>
      </section>
    </AdminLayout>
  );
}
