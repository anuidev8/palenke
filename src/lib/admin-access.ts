import { redirect } from "next/navigation";
import { getViewerRoleFromSession } from "@/lib/viewer-server";
import { getViewerRole, isAdmin, type SearchParams, withRole } from "@/lib/viewer";

export async function requireAdmin(searchParamsPromise: Promise<SearchParams>) {
  const searchParams = await searchParamsPromise;
  const roleFromSession = await getViewerRoleFromSession();
  const roleFromSearchParams = getViewerRole(searchParams);
  const role = roleFromSession !== "public" ? roleFromSession : roleFromSearchParams;

  if (!isAdmin(role)) {
    redirect(withRole("/", role, { notice: "admin-denied" }));
  }

  return { role, searchParams };
}
