import { UserForm } from "@/components/mock/admin-forms";
import { AdminLayout } from "@/components/mock/ui";
import { requireAdmin } from "@/lib/admin-access";
import type { SearchParams } from "@/lib/viewer";

export default async function NuevoUsuarioPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { role } = await requireAdmin(searchParams);

  return (
    <AdminLayout
      role={role}
      active="usuarios"
      title="Nuevo usuario"
      intro="Formulario de creación de cuentas cerradas para usuarios Internos o Admin, con contraseña temporal."
    >
      <UserForm mode="new" />
    </AdminLayout>
  );
}

