import { AdminLayout } from "@/components/mock/ui";
import { AdminVisualContentGenerator } from "@/components/mock/AdminVisualContentGenerator";
import { getViewerRole, type SearchParams } from "@/lib/viewer";
import { getVisualScreenOptions, getVisualTopicOptions } from "@/lib/visual-content/profiles";

export default async function AdminContenidoVisualPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const viewerRole = getViewerRole(params);
  // Temporary open access for this module in dev/testing.
  const role = "admin" as const;
  const topics = getVisualTopicOptions();
  const screens = getVisualScreenOptions();

  return (
    <AdminLayout
      role={role}
      active="contenido-visual"
      title="Generador de contenido visual"
      intro={`Genera imagenes, videos y paquetes de diseno alineados con la marca PCN, el tema seleccionado y la pantalla exacta donde se usaran.${viewerRole !== "admin" ? " Acceso temporal abierto para pruebas." : ""}`}
    >
      <AdminVisualContentGenerator role={role} topics={topics} screens={screens} />
    </AdminLayout>
  );
}
