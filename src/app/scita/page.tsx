import { SiteLayout } from "@/components/mock/ui";
import { ScitaPageContent } from "@/components/palenke/ScitaPageContent";
import { getViewerRoleFromRequest } from "@/lib/viewer-server";
import { type SearchParams } from "@/lib/viewer";

export default async function ScitaPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const role = await getViewerRoleFromRequest(params);

  return (
    <SiteLayout
      role={role}
      breadcrumbs={[{ label: "Inicio", href: "/" }, { label: "SCITA" }]}
    >
      <ScitaPageContent />
    </SiteLayout>
  );
}
