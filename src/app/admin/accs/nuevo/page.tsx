import { AccForm } from "@/components/mock/admin-forms";
import { AdminLayout } from "@/components/mock/AdminLayout";
import { requireAdmin } from "@/lib/admin-access";
import type { SearchParams } from "@/lib/viewer";

export default async function NuevaAccPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { role } = await requireAdmin(searchParams);

  return (
    <AdminLayout
      role={role}
      active="accs"
      title="Nueva ACC"
      intro="Formulario estructurado de ACC, sin campos para coordenadas ni almacenamiento de geometrías."
    >
      <AccForm mode="new" />
    </AdminLayout>
  );
}

