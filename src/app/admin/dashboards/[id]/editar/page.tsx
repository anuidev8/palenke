import { notFound } from "next/navigation";
import { DashboardForm } from "@/components/mock/admin-forms";
import { AdminLayout } from "@/components/mock/ui";
import { requireAdmin } from "@/lib/admin-access";
import { dashboards } from "@/lib/mock-data";
import type { SearchParams } from "@/lib/viewer";

export default async function EditarDashboardPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { id } = await params;
  const { role } = await requireAdmin(searchParams);
  const dashboard = dashboards.find((item) => item.id === id);

  if (!dashboard) {
    notFound();
  }

  return (
    <AdminLayout
      role={role}
      active="dashboards"
      title="Editar tablero"
      intro="El mock mantiene la previsualización del embed y permite probar estados de visibilidad y actualización."
    >
      <DashboardForm mode="edit" dashboard={dashboard} />
    </AdminLayout>
  );
}

