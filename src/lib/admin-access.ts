import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { canAccessVisualContentAdmin } from "@/lib/admin-nav";
import { getViewerRequestState } from "@/lib/viewer-server";
import { isAdmin, type SearchParams, withRole } from "@/lib/viewer";

export async function requireAdmin(searchParamsPromise: Promise<SearchParams>) {
  const searchParams = await searchParamsPromise;
  const sessionState = await getViewerRequestState(searchParams);

  if (!isAdmin(sessionState.role)) {
    redirect(withRole("/", sessionState.role, { notice: "admin-denied" }));
  }

  return {
    role: sessionState.role,
    searchParams,
    email: sessionState.email,
  };
}

export async function requireVisualContentAdmin(searchParamsPromise: Promise<SearchParams>) {
  const result = await requireAdmin(searchParamsPromise);

  if (!canAccessVisualContentAdmin(result.email)) {
    redirect(withRole("/admin", result.role, { notice: "admin-section-denied" }));
  }

  return result;
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

export async function requireVisualContentAdminApiRequest() {
  const deniedResponse = await requireAdminApiRequest();
  if (deniedResponse) {
    return deniedResponse;
  }

  const sessionState = await getViewerRequestState();
  if (!canAccessVisualContentAdmin(sessionState.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return null;
}
