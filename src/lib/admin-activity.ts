import { hasSupabaseServiceConfig } from "@/lib/config";
import { createSupabaseService } from "@/lib/supabase/service";
import { getViewerSessionState } from "@/lib/viewer-server";

export type AdminActivityKind =
  | "content"
  | "user_created"
  | "user_deactivated"
  | "user_role_changed"
  | "password_reset"
  | "access_review";

export type AdminActivityRecord = {
  id: string;
  title: string;
  section: string;
  editedBy: string;
  editedAt: string;
  kind: AdminActivityKind;
};

export type LogAdminActivityInput = {
  kind: AdminActivityKind;
  title: string;
  section: string;
  entityType?: string;
  entityId?: string;
  actorUserId?: string | null;
  actorDisplayName?: string;
  occurredAt?: string;
};

const INSTRUMENT_SECTIONS: Record<string, string> = {
  "normativa-vigente": "Biblioteca",
  conservacion: "ACCs",
  litigio: "Biblioteca",
  "planes-uso": "Biblioteca",
  etnodesarrollo: "Biblioteca",
  "proteccion-hidrica": "Biblioteca",
  reglamentos: "Gobierno propio",
  "memoria-viva": "Biblioteca",
};

function isMissingTableError(error: unknown) {
  if (!error || typeof error !== "object") return false;
  const maybeCode = "code" in error ? String(error.code) : "";
  const maybeMessage = "message" in error ? String(error.message) : "";
  return maybeCode === "PGRST205" || maybeMessage.includes("schema cache");
}

export function displayNameFromEmail(email: string) {
  const localPart = email.split("@")[0] ?? "Usuario";
  return localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((token) => token.charAt(0).toUpperCase() + token.slice(1))
    .join(" ");
}

export function sectionForDocumentInstrument(instrument: string) {
  return INSTRUMENT_SECTIONS[instrument] ?? "Biblioteca";
}

export function formatActivityDate(iso: string) {
  return new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

function mapRow(row: {
  id: string;
  kind: string;
  title: string;
  section: string;
  actor_display_name: string;
  occurred_at: string;
}): AdminActivityRecord {
  return {
    id: row.id,
    title: row.title,
    section: row.section,
    editedBy: row.actor_display_name,
    editedAt: formatActivityDate(row.occurred_at),
    kind: row.kind as AdminActivityKind,
  };
}

export async function resolveAdminActor(
  supabase: ReturnType<typeof createSupabaseService>,
  override?: { userId?: string | null; displayName?: string },
) {
  if (override?.displayName) {
    return {
      userId: override.userId ?? null,
      displayName: override.displayName,
    };
  }

  const session = await getViewerSessionState();
  if (!session.userId) {
    return { userId: null, displayName: "Sistema" };
  }

  const { data } = await supabase.from("users").select("email").eq("id", session.userId).maybeSingle();
  const email = data?.email ?? session.email ?? "admin";
  return {
    userId: session.userId,
    displayName: displayNameFromEmail(email),
  };
}

export async function logAdminActivity(input: LogAdminActivityInput) {
  if (!hasSupabaseServiceConfig()) {
    return;
  }

  try {
    const supabase = createSupabaseService();
    const actor = await resolveAdminActor(supabase, {
      userId: input.actorUserId,
      displayName: input.actorDisplayName,
    });

    const { error } = await supabase.from("admin_activity_log").insert({
      kind: input.kind,
      title: input.title,
      section: input.section,
      actor_user_id: actor.userId,
      actor_display_name: actor.displayName,
      entity_type: input.entityType ?? null,
      entity_id: input.entityId ?? null,
      occurred_at: input.occurredAt ?? new Date().toISOString(),
    });

    if (error && !isMissingTableError(error)) {
      console.error("logAdminActivity failed:", error.message);
    }
  } catch (error) {
    console.error("logAdminActivity exception:", error);
  }
}

export async function listRecentAdminActivity(limit = 12): Promise<AdminActivityRecord[]> {
  if (!hasSupabaseServiceConfig()) {
    return [];
  }

  try {
    const supabase = createSupabaseService();
    const { data, error } = await supabase
      .from("admin_activity_log")
      .select("id, kind, title, section, actor_display_name, occurred_at")
      .order("occurred_at", { ascending: false })
      .limit(limit);

    if (error) {
      if (isMissingTableError(error)) {
        return [];
      }
      console.error("listRecentAdminActivity failed:", error.message);
      return [];
    }

    return (data ?? []).map((row) =>
      mapRow(row as {
        id: string;
        kind: string;
        title: string;
        section: string;
        actor_display_name: string;
        occurred_at: string;
      }),
    );
  } catch (error) {
    console.error("listRecentAdminActivity exception:", error);
    return [];
  }
}
