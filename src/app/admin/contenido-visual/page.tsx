import { AdminLayout } from "@/components/mock/ui";
import { AdminVisualContentGenerator } from "@/components/mock/AdminVisualContentGenerator";
import { requireAdmin } from "@/lib/admin-access";
import type { SearchParams } from "@/lib/viewer";
import { getVisualScreenOptions, getVisualTopicOptions } from "@/lib/visual-content/profiles";

export default async function AdminContenidoVisualPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { role } = await requireAdmin(searchParams);
  const topics = getVisualTopicOptions();
  const screens = getVisualScreenOptions();

  return (
    <AdminLayout
      role={role}
      active="contenido-visual"
      title="Generador de contenido visual"
      intro="Genera imagenes, videos y paquetes de diseno alineados con la marca PCN, el tema seleccionado y la pantalla exacta donde se usaran."
    >
      <AdminVisualContentGenerator topics={topics} screens={screens} />
    </AdminLayout>
  );
}
