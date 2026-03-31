import { createBrowserClient } from "@supabase/ssr";

export function createSupabaseBrowser() {
  // Use static NEXT_PUBLIC_* access in client bundles.
  // Dynamic env-key access can fail in browser runtime even when values are present.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY?.trim() ?? "";

  if (!supabaseUrl) {
    throw new Error("Missing required env var: NEXT_PUBLIC_SUPABASE_URL");
  }
  if (!publishableKey) {
    throw new Error(
      "Missing required env var: NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY",
    );
  }

  return createBrowserClient(supabaseUrl, publishableKey);
}
