import { DashboardForm } from "@/components/mock/admin-forms";
import { AdminLayout } from "@/components/mock/ui";
import { requireAdmin } from "@/lib/admin-access";
import type { SearchParams } from "@/lib/viewer";

export default async function NuevoDashboardPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { role } = await requireAdmin(searchParams);

  return (
    <AdminLayout
      role={role}
      active="dashboards"
      title="Nuevo tablero"
      intro="Formulario para registrar un nuevo tablero Power BI con URL de embed, metadatos y visibilidad."
    >
      <DashboardForm mode="new" />
    </AdminLayout>
  );
}

