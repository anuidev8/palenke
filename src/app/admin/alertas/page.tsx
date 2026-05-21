import { unstable_noStore as noStore } from "next/cache";
import { AdminLayout } from "@/components/mock/AdminLayout";
import { requireAdmin } from "@/lib/admin-access";
import { hasSupabaseServiceConfig } from "@/lib/config";
import { createSupabaseService } from "@/lib/supabase/service";
import { getMockReports } from "@/lib/mock-reports-store";
import { mergeScitaReports } from "@/lib/scita-reports-client-storage";
import { AdminAlertsDashboard } from "@/components/palenke/AdminAlertsDashboard";
import type { SearchParams } from "@/lib/viewer";

export default async function AdminAlertsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  noStore();
  const { role } = await requireAdmin(searchParams);

  let reports = [];
  let isLive = false;

  if (hasSupabaseServiceConfig()) {
    try {
      const supabase = createSupabaseService();
      const { data, error } = await supabase
        .from("scita_reports")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading reports from Supabase:", error);
      } else if (data) {
        reports = data;
        isLive = true;
      }
    } catch (err) {
      console.error("Exception loading reports from Supabase:", err);
    }
  }

  // If Supabase wasn't used or failed, fall back to the server-side mock reports store (which includes user submissions!)
  if (!isLive) {
    reports = getMockReports();
  }

  reports = mergeScitaReports(reports, []);

  return (
    <AdminLayout
      role={role}
      active="alertas"
      title="Alertas Ambientales SCITA"
      intro="Dashboard de monitoreo y estadísticas en tiempo real de las alertas ambientales reportadas por los ciudadanos desde los tableros del módulo SCITA."
    >
      <AdminAlertsDashboard initialReports={reports} mergeClientSubmissions={!isLive} />
    </AdminLayout>
  );
}
