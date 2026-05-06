import { SiteLayout } from "@/components/mock/ui";
import { PageIntroOverlay } from "@/components/global/PageIntroOverlay";
import { ScitaPageContent } from "@/components/palenke/ScitaPageContent";
import { getViewerRoleFromRequest } from "@/lib/viewer-server";
import { isInternal, type SearchParams, withRole } from "@/lib/viewer";

export default async function ScitaPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const role = await getViewerRoleFromRequest(params);

  return (
    <PageIntroOverlay
      sessionStorageKey="palenke-scita-intro-seen"
      title="SCITA"
      subtitle="Sistema de Información Territorial"
      revealDurationSec={3}
      titleSinkDurationSec={0.65}
      overlayFadeDurationSec={0.85}
      backdropFadeInSec={0.45}
    >
      <SiteLayout
        role={role}
        breadcrumbs={[{ label: "Inicio", href: "/" }, { label: "SCITA" }]}
      >
        <ScitaPageContent
          fieldReportHref={withRole("/scita/formulario", role)}
          geoportalHref={withRole("/geoportal", role)}
          showGeoportal={isInternal(role)}
        />
      </SiteLayout>
    </PageIntroOverlay>
  );
}
