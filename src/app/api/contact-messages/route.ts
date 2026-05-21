import { NextResponse } from "next/server";
import { ContactMessageSchema } from "@/lib/schemas/contact-message";
import { hasSupabaseServiceConfig } from "@/lib/config";
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

  const parsed = ContactMessageSchema.safeParse(body);
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
      warning:
        "Supabase service env vars are missing. Message was validated but not persisted.",
    });
  }

  const supabase = createSupabaseService();
  const { data, error } = await supabase
    .from("contact_messages")
    .insert({
      full_name: input.full_name,
      phone: input.phone,
      email: input.email.trim().toLowerCase(),
      message: input.message,
    })
    .select("id")
    .single();

  if (error || !data) {
    if (isMissingTableError(error)) {
      return NextResponse.json({
        success: true,
        mode: "stub_missing_table",
        id: crypto.randomUUID(),
        warning:
          "La tabla contact_messages aún no existe. Aplica la migración 023_contact_messages.sql.",
      });
    }
    return NextResponse.json(
      {
        error: "Could not persist contact message.",
        details: error?.message ?? "unknown_error",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
    mode: "supabase",
    id: data.id,
  });
}
