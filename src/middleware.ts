import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isAdminRole, resolveViewerRoleRecord } from "@/lib/auth/permissions";
import { config as envConfig, hasSupabasePublicConfig, hasSupabaseServiceConfig } from "@/lib/config";
import { createSupabaseService } from "@/lib/supabase/service";

function unauthorizedApi() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function middleware(request: NextRequest) {
  if (!hasSupabasePublicConfig()) {
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(envConfig.supabaseUrl, envConfig.supabasePublishableDefaultKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdminApiRoute = request.nextUrl.pathname.startsWith("/api/admin/");
  if (!user) {
    if (isAdminApiRoute) {
      return unauthorizedApi();
    }

    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  let roleRecord: { role?: string | null; active?: boolean | null } | null = null;

  if (hasSupabaseServiceConfig()) {
    const service = createSupabaseService();
    const roleLookup = await service
      .from("users")
      .select("role, active")
      .eq("id", user.id)
      .maybeSingle();
    roleRecord = roleLookup.data as { role?: string | null; active?: boolean | null } | null;
  } else {
    const roleLookup = await supabase
      .from("users")
      .select("role, active")
      .eq("id", user.id)
      .maybeSingle();
    roleRecord = roleLookup.data as { role?: string | null; active?: boolean | null } | null;
  }

  const isAdmin = isAdminRole(resolveViewerRoleRecord(roleRecord));
  if (!isAdmin) {
    if (isAdminApiRoute) {
      return unauthorizedApi();
    }
    const deniedUrl = new URL("/acceso-restringido", request.url);
    deniedUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(deniedUrl);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
