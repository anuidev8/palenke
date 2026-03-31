import { createClient } from "@supabase/supabase-js";
import { config } from "@/lib/config";

export function createSupabaseService() {
  return createClient(config.supabaseUrl, config.supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
