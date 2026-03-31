import type { ViewerRole } from "@/lib/mock-data";
import { hasSupabasePublicConfig, hasSupabaseServiceConfig } from "@/lib/config";
import { createSupabaseServer } from "@/lib/supabase/server";
import { createSupabaseService } from "@/lib/supabase/service";

export async function getViewerRoleFromSession(): Promise<ViewerRole> {
  if (!hasSupabasePublicConfig()) {
    return "public";
  }

  try {
    const supabase = await createSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return "public";
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
      return "public";
    }

    if (data.role === "admin" || data.role === "internal" || data.role === "public") {
      return data.role;
    }

    return "public";
  } catch (error) {
    console.error("Failed to resolve viewer role from session:", error);
    return "public";
  }
}
