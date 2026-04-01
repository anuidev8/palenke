import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminLayout, Callout } from "@/components/mock/ui";
import { requireAdmin } from "@/lib/admin-access";
import { getFirstParam, type SearchParams, withRole } from "@/lib/viewer";
import { hasSupabaseServiceConfig } from "@/lib/config";
import { createSupabaseService } from "@/lib/supabase/service";
import { updateInternalNewsAction } from "../../../actions";

export default async function EditInternalNewsPage({
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
        title="Editar noticia"
        intro="La edición requiere configuración de Supabase service en el servidor."
      >
        <Callout tone="warning" title="Configuración incompleta">
          <p>Falta configuración de Supabase service para editar noticias.</p>
        </Callout>
      </AdminLayout>
    );
  }

  const supabase = createSupabaseService();
  const { data, error: fetchError } = await supabase.from("internal_news").select("*").eq("id", id).maybeSingle();

  if (fetchError) {
    return (
      <AdminLayout
        role={role}
        active="novedades"
        title="Editar noticia"
        intro="No se pudo cargar la noticia solicitada."
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
      title="Editar noticia"
      intro="Actualiza el contenido, la fecha de publicación y el estado destacado de Lo Último."
    >
      <div className="flex flex-wrap gap-3">
        <Link href={withRole("/admin/novedades/noticias", role)} className="button-secondary">
          Volver a noticias
        </Link>
      </div>

      {notice === "saved" ? (
        <Callout tone="success" title="Noticia actualizada">
          <p>Los cambios quedaron guardados correctamente.</p>
        </Callout>
      ) : null}
      {error ? (
        <Callout tone="danger" title="No se pudo guardar">
          <p>{decodeURIComponent(error)}</p>
        </Callout>
      ) : null}

      <section className="surface-card">
        <form action={updateInternalNewsAction.bind(null, id)} className="grid gap-5 md:grid-cols-2">
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
            <span className="font-semibold text-[color:var(--forest)]">Cuerpo</span>
            <textarea
              name="body"
              required
              rows={8}
              className="textarea-shell"
              defaultValue={String(data.body ?? "")}
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="font-semibold text-[color:var(--forest)]">Categoría</span>
            <input name="category" className="input-shell" defaultValue={String(data.category ?? "")} />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="font-semibold text-[color:var(--forest)]">Ubicación</span>
            <input name="location" className="input-shell" defaultValue={String(data.location ?? "")} />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="font-semibold text-[color:var(--forest)]">Fecha de publicación</span>
            <input
              name="published_at"
              type="datetime-local"
              required
              className="input-shell"
              defaultValue={String(data.published_at ?? "").slice(0, 16)}
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="font-semibold text-[color:var(--forest)]">Visibilidad</span>
            <select name="visibility" className="input-shell" defaultValue={String(data.visibility ?? "public")}>
              <option value="public">public</option>
              <option value="internal">internal</option>
            </select>
          </label>

          <label className="grid gap-2 text-sm md:col-span-2">
            <span className="font-semibold text-[color:var(--forest)]">Imagen de portada</span>
            <input
              name="cover_image_url"
              className="input-shell"
              defaultValue={String(data.cover_image_url ?? "")}
              placeholder="https://..."
            />
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
