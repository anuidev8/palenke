import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiteLayout } from "@/components/mock/ui";
import { ScitaGeovisor } from "@/components/palenke/ScitaGeovisor";
import { getViewerRoleFromRequest } from "@/lib/viewer-server";
import { isInternal, type SearchParams, withRole } from "@/lib/viewer";

export default async function GeoportalPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const role = await getViewerRoleFromRequest(params);

  if (!isInternal(role)) {
    redirect(`/login?redirect=/geoportal&message=geoportal`);
  }

  return (
    <SiteLayout
      role={role}
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "SCITA", href: "/estadisticas" },
        { label: "GeoVisor" },
      ]}
    >
      <div className="flex min-h-[calc(100vh-8rem)] flex-col">
        <ScitaGeovisor />

        <div className="w-full px-4 pb-8 pt-4 sm:px-6 lg:px-8">
          <Link
            href={withRole("/estadisticas", role)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#4a4540] transition hover:text-[#1a1a1a]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Volver a SCITA</span>
          </Link>
        </div>
      </div>
    </SiteLayout>
  );
}
