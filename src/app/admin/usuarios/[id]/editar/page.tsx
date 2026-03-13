import { notFound } from "next/navigation";
import { UserForm } from "@/components/mock/admin-forms";
import { AdminLayout } from "@/components/mock/ui";
import { requireAdmin } from "@/lib/admin-access";
import { users } from "@/lib/mock-data";
import type { SearchParams } from "@/lib/viewer";

export default async function EditarUsuarioPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { id } = await params;
  const { role } = await requireAdmin(searchParams);
  const user = users.find((item) => item.id === id);

  if (!user) {
    notFound();
  }

  return (
    <AdminLayout
      role={role}
      active="usuarios"
      title="Editar usuario"
      intro="Vista de edición con cambio de estado, rol y recuperación de contraseña."
    >
      <UserForm mode="edit" user={user} />
    </AdminLayout>
  );
}

