import { notFound } from "next/navigation";
import { CampaignForm } from "@/components/mock/admin-forms";
import { AdminLayout } from "@/components/mock/ui";
import { requireAdmin } from "@/lib/admin-access";
import { campaigns } from "@/lib/mock-data";
import type { SearchParams } from "@/lib/viewer";

export default async function EditarCampanaPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { id } = await params;
  const { role } = await requireAdmin(searchParams);
  const campaign = campaigns.find((item) => item.id === id);

  if (!campaign) {
    notFound();
  }

  return (
    <AdminLayout
      role={role}
      active="campanas"
      title="Editar campaña"
      intro="Edición de campañas activas/inactivas con materiales y ubicación en Home, MJN o Biblioteca."
    >
      <CampaignForm mode="edit" campaign={campaign} />
    </AdminLayout>
  );
}

