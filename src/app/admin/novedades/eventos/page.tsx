import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { AdminLayout } from "@/components/mock/AdminLayout";
import { Callout } from "@/components/mock/ui";
import { requireAdmin } from "@/lib/admin-access";
import { listEvents } from "@/lib/content";
import { getFirstParam, type SearchParams, withRole } from "@/lib/viewer";
import { createEventAction, deleteEventAction } from "../actions";

export default async function AdminEventsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  noStore();
  const { role, searchParams: qs } = await requireAdmin(searchParams);
  const notice = getFirstParam(qs.notice);
  const error = getFirstParam(qs.error);
  const events = await listEvents({ includeInternal: true });

  return (
    <AdminLayout
      role={role}
      active="novedades"
      title="Agenda y eventos"
      intro="Eventos visibles en el calendario, la vista semanal/mensual y los listados públicos del sitio."
    >
      <div className="flex flex-wrap gap-3">
        <Link href={withRole("/admin/novedades", role)} className="button-secondary">
          Volver a noticias y agenda
        </Link>
      </div>

      {notice === "created" ? (
        <Callout tone="success" title="Evento creado">
          <p>El evento ya aparece en la agenda pública.</p>
        </Callout>
      ) : null}
      {notice === "deleted" ? (
        <Callout tone="success" title="Evento eliminado">
          <p>El evento fue retirado correctamente.</p>
        </Callout>
      ) : null}
      {error ? (
        <Callout tone="danger" title="No se pudo completar la acción">
          <p>{decodeURIComponent(error)}</p>
        </Callout>
      ) : null}

      <section className="surface-card space-y-5">
        <div>
          <p className="eyebrow mb-2">Crear evento</p>
          <h2 className="font-display text-3xl text-[color:var(--forest)]">Nuevo evento</h2>
        </div>
        <form action={createEventAction} className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-2 text-sm md:col-span-2">
            <span className="font-semibold text-[color:var(--forest)]">Título</span>
            <input name="title" required className="input-shell" placeholder="Nombre del evento" />
          </label>

          <label className="grid gap-2 text-sm md:col-span-2">
            <span className="font-semibold text-[color:var(--forest)]">Resumen</span>
            <textarea
              name="summary"
              required
              rows={3}
              className="textarea-shell"
              placeholder="Resumen para tarjetas y calendario"
            />
          </label>

          <label className="grid gap-2 text-sm md:col-span-2">
            <span className="font-semibold text-[color:var(--forest)]">Descripción</span>
            <textarea
              name="description"
              required
              rows={8}
              className="textarea-shell"
              placeholder="Detalle del evento, agenda y recursos"
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="font-semibold text-[color:var(--forest)]">Categoría</span>
            <input name="category" className="input-shell" defaultValue="Territorio" />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="font-semibold text-[color:var(--forest)]">Territorio</span>
            <input name="territory" className="input-shell" placeholder="Pacífico Sur, Chocó, etc." />
          </label>

          <label className="grid gap-2 text-sm md:col-span-2">
            <span className="font-semibold text-[color:var(--forest)]">Ubicación</span>
            <input name="location" required className="input-shell" placeholder="Ciudad, municipio o virtual" />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="font-semibold text-[color:var(--forest)]">Inicio</span>
            <input
              name="starts_at"
              type="datetime-local"
              required
              className="input-shell"
              defaultValue="2026-04-20T09:00"
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="font-semibold text-[color:var(--forest)]">Fin</span>
            <input name="ends_at" type="datetime-local" className="input-shell" />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="font-semibold text-[color:var(--forest)]">Enlace relacionado</span>
            <input name="resource_url" className="input-shell" placeholder="https://... o /ruta-interna" />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="font-semibold text-[color:var(--forest)]">Etiqueta del enlace</span>
            <input name="resource_label" className="input-shell" placeholder="Ver recursos" />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="font-semibold text-[color:var(--forest)]">Visibilidad</span>
            <select name="visibility" className="input-shell" defaultValue="public">
              <option value="public">public</option>
              <option value="internal">internal</option>
            </select>
          </label>

          <label className="inline-flex items-center gap-3 text-sm font-medium text-[color:var(--forest)] md:col-span-2">
            <input name="featured" type="checkbox" className="h-4 w-4 rounded border-[#d1ccc5]" />
            Destacar en la home
          </label>

          <div className="flex justify-end md:col-span-2">
            <button type="submit" className="button-primary">
              Crear evento
            </button>
          </div>
        </form>
      </section>

      <section className="surface-card space-y-5">
        <div>
          <p className="eyebrow mb-2">Gestionar agenda</p>
          <h2 className="font-display text-3xl text-[color:var(--forest)]">Eventos registrados</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[color:var(--border-soft)]">
                <th className="px-3 py-3 font-semibold">Evento</th>
                <th className="px-3 py-3 font-semibold">Categoría</th>
                <th className="px-3 py-3 font-semibold">Lugar</th>
                <th className="px-3 py-3 font-semibold">Inicio</th>
                <th className="px-3 py-3 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {events.map((item) => (
                <tr key={item.id} className="border-b border-[color:var(--border-soft)] last:border-0">
                  <td className="px-3 py-4">
                    <p className="font-semibold text-[color:var(--forest)]">{item.title}</p>
                    <p className="mt-1 text-xs text-[color:var(--muted)]">{item.summary}</p>
                  </td>
                  <td className="px-3 py-4">{item.category}</td>
                  <td className="px-3 py-4">{item.location}</td>
                  <td className="px-3 py-4">
                    {new Intl.DateTimeFormat("es-CO", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(new Date(item.startsAt))}
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex flex-wrap gap-2">
                      <Link href={withRole(`/admin/novedades/eventos/${item.id}/editar`, role)} className="button-ghost">
                        Editar
                      </Link>
                      <form action={deleteEventAction.bind(null, item.id)}>
                        <button type="submit" className="button-ghost text-[#d32f2f]">
                          Eliminar
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AdminLayout>
  );
}
