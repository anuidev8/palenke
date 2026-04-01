import { NextResponse } from "next/server";
import { sendAdminNotification, sendCoordinatorAlert } from "@/lib/email";
import { hasSupabaseServiceConfig } from "@/lib/config";
import { AccessRequestSchema } from "@/lib/schemas/access-request";
import { createSupabaseService } from "@/lib/supabase/service";

const PLANES_USO_SLUG = "planes-uso";
const ACCESS_REQUEST_WEBHOOK_URL =
  "https://n8n-production-bbef9.up.railway.app/webhook/21f21a8b-f0e4-4f77-b15e-71a71746fa17";

function isMissingTableError(error: unknown) {
  if (!error || typeof error !== "object") return false;
  const maybeCode = "code" in error ? String(error.code) : "";
  const maybeMessage = "message" in error ? String(error.message) : "";
  return maybeCode === "PGRST205" || maybeMessage.includes("schema cache");
}

function buildUserWebhookSubject(fullName: string) {
  return `Recibimos tu solicitud de acceso — Planes de uso y manejo (${fullName})`;
}

function buildUserWebhookMessage(input: {
  full_name: string;
  community: string;
  motivation: string;
}) {
  return [
    `Hola ${input.full_name},`,
    "",
    "Tu solicitud de acceso al instrumento Planes de uso y manejo fue recibida correctamente por el equipo de Palenke.",
    "",
    "Resumen de la solicitud:",
    `- Consejo comunitario / institución: ${input.community}`,
    `- Motivo: ${input.motivation}`,
    "",
    "Nuestro equipo realizará la validación correspondiente y te responderá por este mismo correo en el menor tiempo posible (referencia: 1 día hábil).",
    "",
    "Gracias por contribuir al uso responsable de información territorial sensible.",
    "",
    "Palenke",
  ]
    .filter(Boolean)
    .join("\n");
}

async function sendUserWebhookIfNeeded(input: {
  instrument_slug: string;
  full_name: string;
  email: string;
  community: string;
  motivation: string;
}) {
  if (input.instrument_slug !== PLANES_USO_SLUG) {
    return;
  }

  const payload = {
    email: input.email,
    subject: buildUserWebhookSubject(input.full_name),
    messages: buildUserWebhookMessage(input),
  };

  try {
    const response = await fetch(ACCESS_REQUEST_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error("Access request webhook failed:", response.status, response.statusText);
    }
  } catch (error) {
    console.error("Access request webhook error:", error);
  }
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
    await sendUserWebhookIfNeeded(input);
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
    .select("id, full_name, email, community, motivation, instrument_slug, access_level")
    .single();

  if (error || !data) {
    if (isMissingTableError(error)) {
      await sendUserWebhookIfNeeded(input);
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
    });
  }

  await sendUserWebhookIfNeeded({
    instrument_slug: data.instrument_slug,
    full_name: data.full_name,
    email: data.email,
    community: data.community,
    motivation: data.motivation,
  });

  return NextResponse.json({
    success: true,
    mode: "supabase",
    id: data.id,
  });
}
