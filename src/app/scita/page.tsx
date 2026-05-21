import { SiteLayout } from "@/components/mock/ui";
import { ScitaPageContent } from "@/components/palenke/ScitaPageContent";
import { listScitaDashboardsForRole } from "@/lib/scita-dashboards";
import { getViewerRequestState } from "@/lib/viewer-server";
import { type SearchParams } from "@/lib/viewer";

export default async function ScitaPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const session = await getViewerRequestState(params);
  const dashboards = await listScitaDashboardsForRole(session.role);

  return (
    <SiteLayout
      role={session.role}
      breadcrumbs={[{ label: "Inicio", href: "/" }, { label: "SCITA" }]}
    >
      <ScitaPageContent
        dashboards={dashboards}
        viewerRole={session.role}
        isAuthenticated={session.isAuthenticated}
      />
    </SiteLayout>
  );
}
