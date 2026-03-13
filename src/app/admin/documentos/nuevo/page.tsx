import { DocumentForm } from "@/components/mock/admin-forms";
import { AdminLayout, Callout } from "@/components/mock/ui";
import { requireAdmin } from "@/lib/admin-access";
import type { SearchParams } from "@/lib/viewer";

export default async function NuevoDocumentoPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { role } = await requireAdmin(searchParams);

  return (
    <AdminLayout
      role={role}
      active="documentos"
      title="Nuevo documento"
      intro="Formulario completo para crear un registro de la Biblioteca con clasificación, archivo/enlace, visibilidad y vinculación MJN."
    >
      <Callout tone="danger" title="Validación inline">
        <p>Este mock muestra el estado de creación con un error inicial en campos obligatorios y una URL sin formato válido.</p>
      </Callout>
      <DocumentForm mode="new" />
    </AdminLayout>
  );
}

