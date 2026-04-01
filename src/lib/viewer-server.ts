import type { ViewerRole } from "@/lib/mock-data";
import { hasSupabasePublicConfig, hasSupabaseServiceConfig } from "@/lib/config";
import { createSupabaseServer } from "@/lib/supabase/server";
import { createSupabaseService } from "@/lib/supabase/service";

export type ViewerSessionState = {
  role: ViewerRole;
  isAuthenticated: boolean;
};

export async function getViewerSessionState(): Promise<ViewerSessionState> {
  if (!hasSupabasePublicConfig()) {
    return {
      role: "public",
      isAuthenticated: false,
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

    if (!data || data.active === false) {
      return {
        role: "public",
        isAuthenticated: true,
      };
    }

    if (data.role === "admin" || data.role === "internal" || data.role === "public") {
      return {
        role: data.role,
        isAuthenticated: true,
      };
    }

    return {
      role: "public",
      isAuthenticated: true,
    };
  } catch (error) {
    console.error("Failed to resolve viewer session state:", error);
    return {
      role: "public",
      isAuthenticated: false,
    };
  }
}

export async function getViewerRoleFromSession(): Promise<ViewerRole> {
  const sessionState = await getViewerSessionState();
  return sessionState.role;
}
