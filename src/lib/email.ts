import { Resend } from "resend";
import { config, hasResendConfig } from "@/lib/config";
import {
  adminNotificationHtml,
  approvalEmailHtml,
  coordinatorAlertHtml,
  rejectionEmailHtml,
  signedUrlEmailHtml,
  type AccessRequestEmailData,
} from "@/lib/email-templates";

function getResendClient() {
  if (!hasResendConfig()) {
    return null;
  }
  return new Resend(config.resendApiKey);
}

function readRecipientEnv(key: "ADMIN_EMAIL" | "COORDINATOR_EMAIL") {
  return process.env[key]?.trim() ?? "";
}

async function safeSend(params: {
  to: string;
  subject: string;
  html: string;
}) {
  const resend = getResendClient();
  if (!resend) {
    return { sent: false as const, reason: "missing_resend_config" as const };
  }

  try {
    await resend.emails.send({
      from: "Palenke <no-reply@palenke.org>",
      to: params.to,
      subject: params.subject,
      html: params.html,
    });
    return { sent: true as const };
  } catch (error) {
    console.error("Email send failed:", error);
    return { sent: false as const, reason: "send_failed" as const };
  }
}

export async function sendAdminNotification(request: AccessRequestEmailData) {
  const recipient = readRecipientEnv("ADMIN_EMAIL");
  if (!recipient) {
    return { sent: false as const, reason: "missing_recipient_config" as const };
  }

  return safeSend({
    to: recipient,
    subject: `Nueva solicitud de acceso — ${request.instrument_slug}`,
    html: adminNotificationHtml(request, config.appUrl),
  });
}

export async function sendCoordinatorAlert(request: AccessRequestEmailData) {
  const recipient = readRecipientEnv("COORDINATOR_EMAIL");
  if (!recipient) {
    return { sent: false as const, reason: "missing_recipient_config" as const };
  }

  return safeSend({
    to: recipient,
    subject: `[COORDINACIÓN] Solicitud de acceso — ${request.instrument_slug}`,
    html: coordinatorAlertHtml(request, config.appUrl),
  });
}

export async function sendApprovalEmail(email: string, instrument: string) {
  return safeSend({
    to: email,
    subject: `Solicitud aprobada — ${instrument}`,
    html: approvalEmailHtml(instrument),
  });
}

export async function sendRejectionEmail(email: string, instrument: string, reason: string) {
  return safeSend({
    to: email,
    subject: `Solicitud rechazada — ${instrument}`,
    html: rejectionEmailHtml(instrument, reason),
  });
}

export async function sendSignedUrlEmail(email: string, signedUrl: string, expiry: string) {
  return safeSend({
    to: email,
    subject: "Enlace temporal de descarga",
    html: signedUrlEmailHtml(signedUrl, expiry),
  });
}
