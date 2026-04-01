type EnvKey =
  | "NEXT_PUBLIC_SUPABASE_URL"
  | "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY"
  | "SUPABASE_SERVICE_ROLE_KEY"
  | "N8N_EMAIL_WEBHOOK_URL"
  | "ADMIN_EMAIL"
  | "COORDINATOR_EMAIL"
  | "NEXT_PUBLIC_APP_URL";

function normalizeAppUrl(value: string) {
  if (!value) {
    return "";
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  if (/^(localhost|127(?:\.\d{1,3}){3}|0\.0\.0\.0)(:\d+)?(\/.*)?$/i.test(value)) {
    return `http://${value}`;
  }

  return value;
}

const publicSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
const publicSupabasePublishableDefaultKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY?.trim() ?? "";
const publicAppUrl = normalizeAppUrl(process.env.NEXT_PUBLIC_APP_URL?.trim() ?? "");

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
    return publicSupabaseUrl || requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  },
  get supabasePublishableDefaultKey() {
    return (
      publicSupabasePublishableDefaultKey ||
      requireEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY")
    );
  },
  get supabaseServiceRoleKey() {
    return requireEnv("SUPABASE_SERVICE_ROLE_KEY");
  },
  get n8nEmailWebhookUrl() {
    return readEnv("N8N_EMAIL_WEBHOOK_URL");
  },
  get adminEmail() {
    return requireEnv("ADMIN_EMAIL");
  },
  get coordinatorEmail() {
    return requireEnv("COORDINATOR_EMAIL");
  },
  get appUrl() {
    return publicAppUrl || "http://localhost:3000";
  },
};

export function hasSupabasePublicConfig() {
  return Boolean(publicSupabaseUrl && publicSupabasePublishableDefaultKey);
}

export function hasSupabaseServiceConfig() {
  return Boolean(
    readEnv("NEXT_PUBLIC_SUPABASE_URL") &&
      readEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY") &&
      readEnv("SUPABASE_SERVICE_ROLE_KEY"),
  );
}

export function hasN8nEmailWebhookConfig() {
  return Boolean(readEnv("N8N_EMAIL_WEBHOOK_URL"));
}
