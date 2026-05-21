import { notFound } from "next/navigation";
import { AccForm } from "@/components/mock/admin-forms";
import { AdminLayout } from "@/components/mock/AdminLayout";
import { requireAdmin } from "@/lib/admin-access";
import { accs } from "@/lib/mock-data";
import type { SearchParams } from "@/lib/viewer";

export default async function EditarAccPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { id } = await params;
  const { role } = await requireAdmin(searchParams);
  const acc = accs.find((item) => item.id === id);

  if (!acc) {
    notFound();
  }

  return (
    <AdminLayout
      role={role}
      active="accs"
      title="Editar ACC"
      intro="Edición de fichas de conservación comunitaria con enlaces al geoportal y dashboards ya registrados."
    >
      <AccForm mode="edit" acc={acc} />
    </AdminLayout>
  );
}

