import Link from "next/link";
import { ScitaDashboardAdminForm } from "@/components/palenke/ScitaDashboardAdminForm";
import { AdminLayout } from "@/components/mock/AdminLayout";
import { Callout } from "@/components/mock/ui";
import { requireAdmin } from "@/lib/admin-access";
import { hasSupabaseServiceConfig } from "@/lib/config";
import { getFirstParam, type SearchParams, withRole } from "@/lib/viewer";

export default async function NuevoScitaDashboardPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { role, searchParams: qs } = await requireAdmin(searchParams);
  const error = getFirstParam(qs.error);

  return (
    <AdminLayout
      role={role}
      active="dashboards"
      title="Nuevo tablero SCITA"
      intro="Registra un tablero Power BI para el panel territorial en /scita. Usa visibilidad pública (P_) o interna (I_)."
    >
      <Link href={withRole("/admin/dashboards", role)} className="button-secondary">
        Volver al listado
      </Link>

      {!hasSupabaseServiceConfig() ? (
        <Callout tone="warning" title="Configuración incompleta">
          <p>Falta Supabase service para persistir tableros en base de datos.</p>
        </Callout>
      ) : null}

      {error ? (
        <Callout tone="danger" title="No se pudo guardar">
          <p>{decodeURIComponent(error)}</p>
        </Callout>
      ) : null}

      <ScitaDashboardAdminForm mode="new" />
    </AdminLayout>
  );
}
