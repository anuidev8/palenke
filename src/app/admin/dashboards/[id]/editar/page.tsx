import Link from "next/link";
import { notFound } from "next/navigation";
import { ScitaDashboardAdminForm } from "@/components/palenke/ScitaDashboardAdminForm";
import { AdminLayout } from "@/components/mock/AdminLayout";
import { Callout } from "@/components/mock/ui";
import { requireAdmin } from "@/lib/admin-access";
import { hasSupabaseServiceConfig } from "@/lib/config";
import { getScitaDashboardByIdAdmin } from "@/lib/scita-dashboards";
import { getFirstParam, type SearchParams, withRole } from "@/lib/viewer";

export default async function EditarScitaDashboardPage({
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
        active="dashboards"
        title="Editar tablero SCITA"
        intro="La edición requiere configuración de Supabase service en el servidor."
      >
        <Callout tone="warning" title="Configuración incompleta">
          <p>Falta configuración de Supabase service para editar tableros.</p>
        </Callout>
      </AdminLayout>
    );
  }

  const dashboard = await getScitaDashboardByIdAdmin(id);

  if (!dashboard) {
    notFound();
  }

  return (
    <AdminLayout
      role={role}
      active="dashboards"
      title="Editar tablero SCITA"
      intro="Actualiza metadatos, URL de embed y visibilidad. Los cambios se reflejan de inmediato en /scita según el rol del visitante."
    >
      <Link href={withRole("/admin/dashboards", role)} className="button-secondary">
        Volver al listado
      </Link>

      {notice === "saved" ? (
        <Callout tone="success" title="Tablero actualizado">
          <p>Los cambios quedaron guardados correctamente.</p>
        </Callout>
      ) : null}
      {error ? (
        <Callout tone="danger" title="No se pudo guardar">
          <p>{decodeURIComponent(error)}</p>
        </Callout>
      ) : null}

      <ScitaDashboardAdminForm mode="edit" dashboard={dashboard} />
    </AdminLayout>
  );
}
