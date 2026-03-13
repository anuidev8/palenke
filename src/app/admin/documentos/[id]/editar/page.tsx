import { notFound } from "next/navigation";
import { DocumentForm } from "@/components/mock/admin-forms";
import { AdminLayout, Callout } from "@/components/mock/ui";
import { documents } from "@/lib/mock-data";
import { requireAdmin } from "@/lib/admin-access";
import type { SearchParams } from "@/lib/viewer";

export default async function EditarDocumentoPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { id } = await params;
  const { role } = await requireAdmin(searchParams);
  const document = documents.find((item) => item.id === id);

  if (!document) {
    notFound();
  }

  return (
    <AdminLayout
      role={role}
      active="documentos"
      title="Editar documento"
      intro="Vista de edición con advertencias de visibilidad pública y sensibilidad territorial cuando corresponde."
    >
      <Callout tone="success" title="Documento guardado exitosamente.">
        <p>Banner de éxito posterior a guardado, con redirección al listado después de 2 segundos.</p>
      </Callout>
      <DocumentForm mode="edit" document={document} />
    </AdminLayout>
  );
}

