import { redirect } from "next/navigation";

// Dashboard detail pages are not part of the current scope.
// Redirect all /estadisticas/[slug] routes to the tableros overview.
export default function DashboardDetallePage() {
  redirect("/estadisticas");
}
