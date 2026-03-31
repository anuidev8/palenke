import { NextResponse } from "next/server";
import { sendAdminNotification, sendCoordinatorAlert } from "@/lib/email";
import { hasSupabaseServiceConfig } from "@/lib/config";
import { AccessRequestSchema } from "@/lib/schemas/access-request";
import { createSupabaseService } from "@/lib/supabase/service";

function isMissingTableError(error: unknown) {
  if (!error || typeof error !== "object") return false;
  const maybeCode = "code" in error ? String(error.code) : "";
  const maybeMessage = "message" in error ? String(error.message) : "";
  return maybeCode === "PGRST205" || maybeMessage.includes("schema cache");
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const parsed = AccessRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation failed.",
        issues: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const input = parsed.data;

  if (!hasSupabaseServiceConfig()) {
    return NextResponse.json({
      success: true,
      mode: "stub",
      id: crypto.randomUUID(),
      received_at: new Date().toISOString(),
      request: {
        ...input,
        status: "pending",
      },
      warning:
        "Supabase service env vars are missing. Request was validated but not persisted.",
    });
  }

  const supabase = createSupabaseService();
  const { data, error } = await supabase
    .from("access_requests")
    .insert({
      ...input,
      status: "pending",
    })
    .select(
      "id, full_name, email, community, motivation, instrument_slug, access_level, institution, use_purpose, data_protection",
    )
    .single();

  if (error || !data) {
    if (isMissingTableError(error)) {
      return NextResponse.json({
        success: true,
        mode: "stub_missing_table",
        id: crypto.randomUUID(),
        warning:
          "Supabase tables are not ready yet. Request was validated but persisted in fallback mode.",
      });
    }
    return NextResponse.json(
      {
        error: "Could not persist access request.",
        details: error?.message ?? "unknown_error",
      },
      { status: 500 },
    );
  }

  if (data.access_level === "coordination") {
    await sendCoordinatorAlert({
      id: data.id,
      full_name: data.full_name,
      email: data.email,
      community: data.community,
      motivation: data.motivation,
      instrument_slug: data.instrument_slug,
      access_level: data.access_level,
      institution: data.institution,
      use_purpose: data.use_purpose,
      data_protection: data.data_protection,
    });
  } else {
    await sendAdminNotification({
      id: data.id,
      full_name: data.full_name,
      email: data.email,
      community: data.community,
      motivation: data.motivation,
      instrument_slug: data.instrument_slug,
      access_level: data.access_level,
      institution: data.institution,
      use_purpose: data.use_purpose,
      data_protection: data.data_protection,
    });
  }

  return NextResponse.json({
    success: true,
    mode: "supabase",
    id: data.id,
  });
}
