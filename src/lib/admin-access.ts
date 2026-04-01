import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { getViewerRequestState } from "@/lib/viewer-server";
import { isAdmin, type SearchParams, withRole } from "@/lib/viewer";

export async function requireAdmin(searchParamsPromise: Promise<SearchParams>) {
  const searchParams = await searchParamsPromise;
  const { role } = await getViewerRequestState(searchParams);

  if (!isAdmin(role)) {
    redirect(withRole("/", role, { notice: "admin-denied" }));
  }

  return { role, searchParams };
}

export async function requireAdminApiRequest() {
  const sessionState = await getViewerRequestState();

  if (!sessionState.isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isAdmin(sessionState.role)) {
    return NextResponse.json({ error: "Admin permissions are required." }, { status: 403 });
  }

  return null;
}
