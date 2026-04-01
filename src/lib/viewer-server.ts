import { cache } from "react";
import type { ViewerRole } from "@/lib/mock-data";
import { resolveViewerRoleRecord } from "@/lib/auth/permissions";
import { hasSupabasePublicConfig, hasSupabaseServiceConfig } from "@/lib/config";
import { createSupabaseServer } from "@/lib/supabase/server";
import { createSupabaseService } from "@/lib/supabase/service";
import { getViewerRole, type SearchParams } from "@/lib/viewer";

export type ViewerSessionState = {
  role: ViewerRole;
  isAuthenticated: boolean;
  isActive: boolean;
  userId: string | null;
  email: string | null;
};

export const getViewerSessionState = cache(async (): Promise<ViewerSessionState> => {
  if (!hasSupabasePublicConfig()) {
    return {
      role: "public",
      isAuthenticated: false,
      isActive: false,
      userId: null,
      email: null,
    };
  }

  try {
    const supabase = await createSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        role: "public",
        isAuthenticated: false,
        isActive: false,
        userId: null,
        email: null,
      };
    }

    let data: { role?: string | null; active?: boolean | null } | null = null;

    if (hasSupabaseServiceConfig()) {
      const service = createSupabaseService();
      const roleLookup = await service
        .from("users")
        .select("role, active")
        .eq("id", user.id)
        .maybeSingle();
      data = roleLookup.data as { role?: string | null; active?: boolean | null } | null;
    } else {
      const roleLookup = await supabase
        .from("users")
        .select("role, active")
        .eq("id", user.id)
        .maybeSingle();
      data = roleLookup.data as { role?: string | null; active?: boolean | null } | null;
    }

    return {
      role: resolveViewerRoleRecord(data),
      isAuthenticated: true,
      isActive: data?.active !== false,
      userId: user.id,
      email: user.email ?? null,
    };
  } catch (error) {
    console.error("Failed to resolve viewer session state:", error);
    return {
      role: "public",
      isAuthenticated: false,
      isActive: false,
      userId: null,
      email: null,
    };
  }
});

export async function getViewerRequestState(
  searchParams?: SearchParams,
): Promise<ViewerSessionState> {
  if (!hasSupabasePublicConfig()) {
    const role = getViewerRole(searchParams);
    return {
      role,
      isAuthenticated: role !== "public",
      isActive: role !== "public",
      userId: null,
      email: null,
    };
  }

  return getViewerSessionState();
}

export async function getViewerRoleFromSession(): Promise<ViewerRole> {
  const sessionState = await getViewerSessionState();
  return sessionState.role;
}

export async function getViewerRoleFromRequest(searchParams?: SearchParams): Promise<ViewerRole> {
  const sessionState = await getViewerRequestState(searchParams);
  return sessionState.role;
}
