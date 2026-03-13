import { redirect } from "next/navigation";
import { getViewerRole, isAdmin, type SearchParams, withRole } from "@/lib/viewer";

export async function requireAdmin(searchParamsPromise: Promise<SearchParams>) {
  const searchParams = await searchParamsPromise;
  const role = getViewerRole(searchParams);

  if (!isAdmin(role)) {
    redirect(withRole("/", role, { notice: "admin-denied" }));
  }

  return { role, searchParams };
}

