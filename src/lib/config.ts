type EnvKey =
  | "NEXT_PUBLIC_SUPABASE_URL"
  | "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY"
  | "SUPABASE_SERVICE_ROLE_KEY"
  | "RESEND_API_KEY"
  | "ADMIN_EMAIL"
  | "COORDINATOR_EMAIL"
  | "NEXT_PUBLIC_APP_URL";

function readEnv(key: EnvKey) {
  return process.env[key]?.trim() ?? "";
}

export function requireEnv(key: EnvKey) {
  const value = readEnv(key);
  if (!value) {
    throw new Error(`Missing required env var: ${key}`);
  }
  return value;
}

export const config = {
  get supabaseUrl() {
    return requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  },
  get supabasePublishableDefaultKey() {
    return requireEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY");
  },
  get supabaseServiceRoleKey() {
    return requireEnv("SUPABASE_SERVICE_ROLE_KEY");
  },
  get resendApiKey() {
    return requireEnv("RESEND_API_KEY");
  },
  get adminEmail() {
    return requireEnv("ADMIN_EMAIL");
  },
  get coordinatorEmail() {
    return requireEnv("COORDINATOR_EMAIL");
  },
  get appUrl() {
    return readEnv("NEXT_PUBLIC_APP_URL") || "http://localhost:3000";
  },
};

export function hasSupabasePublicConfig() {
  return Boolean(
    readEnv("NEXT_PUBLIC_SUPABASE_URL") &&
      readEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY"),
  );
}

export function hasSupabaseServiceConfig() {
  return Boolean(
    readEnv("NEXT_PUBLIC_SUPABASE_URL") &&
      readEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY") &&
      readEnv("SUPABASE_SERVICE_ROLE_KEY"),
  );
}

export function hasResendConfig() {
  return Boolean(readEnv("RESEND_API_KEY"));
}
