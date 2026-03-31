import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { config } from "@/lib/config";

export async function createSupabaseServer() {
  const cookieStore = await cookies();

  return createServerClient(config.supabaseUrl, config.supabasePublishableDefaultKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // No-op in contexts where response cookies cannot be mutated.
        }
      },
    },
  });
}
