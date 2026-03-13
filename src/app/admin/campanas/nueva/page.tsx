import { CampaignForm } from "@/components/mock/admin-forms";
import { AdminLayout } from "@/components/mock/ui";
import { requireAdmin } from "@/lib/admin-access";
import type { SearchParams } from "@/lib/viewer";

export default async function NuevaCampanaPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { role } = await requireAdmin(searchParams);

  return (
    <AdminLayout
      role={role}
      active="campanas"
      title="Nueva campaña"
      intro="Formulario para crear campañas con materiales descargables, fechas, ubicación en la plataforma y visibilidad."
    >
      <CampaignForm mode="new" />
    </AdminLayout>
  );
}

