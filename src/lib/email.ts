import { config, hasN8nEmailWebhookConfig } from "@/lib/config";
import {
  adminNotificationHtml,
  approvalEmailHtml,
  coordinatorAlertHtml,
  rejectionEmailHtml,
  requestedDocumentEmailHtml,
  signedUrlEmailHtml,
  type AccessRequestEmailData,
} from "@/lib/email-templates";

function readRecipientEnv(key: "ADMIN_EMAIL" | "COORDINATOR_EMAIL") {
  return process.env[key]?.trim() ?? "";
}

function htmlToText(html: string) {
  return html
    .replace(/<a[^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/gi, (_match, href: string, label: string) => {
      const plainLabel = String(label).replace(/<[^>]+>/g, "").trim();
      return plainLabel ? `${plainLabel}: ${href}` : href;
    })
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/h[1-6]>/gi, "\n\n")
    .replace(/<li>/gi, "- ")
    .replace(/<\/li>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function sendViaN8n(params: { to: string; subject: string; html: string }) {
  if (!hasN8nEmailWebhookConfig()) {
    return {
      sent: false as const,
      reason: "missing_n8n_config" as const,
      detail: "Define N8N_EMAIL_WEBHOOK_URL en el entorno del servidor.",
    };
  }

  try {
    const response = await fetch(config.n8nEmailWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: params.to,
        subject: params.subject,
        messages: htmlToText(params.html),
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      const detail = await response.text();
      return {
        sent: false as const,
        reason: "send_failed" as const,
        detail: detail || `n8n respondió con estado ${response.status}.`,
      };
    }

    return { sent: true as const };
  } catch (error) {
    const detail = error instanceof Error ? error.message : "No fue posible conectar con n8n.";
    return { sent: false as const, reason: "send_failed" as const, detail };
  }
}

async function safeSend(params: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!hasN8nEmailWebhookConfig()) {
    return {
      sent: false,
      reason: "missing_email_config",
      detail: "Define N8N_EMAIL_WEBHOOK_URL en el entorno del servidor.",
    };
  }

  return sendViaN8n(params);
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

export async function sendApprovalEmail(email: string, instrument: string, documentTitle: string) {
  return safeSend({
    to: email,
    subject: `Solicitud aprobada — ${instrument}`,
    html: approvalEmailHtml(instrument, documentTitle),
  });
}

export async function sendRejectionEmail(
  email: string,
  instrument: string,
  documentTitle: string,
  reason: string,
) {
  return safeSend({
    to: email,
    subject: `Solicitud rechazada — ${instrument}`,
    html: rejectionEmailHtml(instrument, documentTitle, reason),
  });
}

export async function sendSignedUrlEmail(email: string, signedUrl: string, expiry: string) {
  return safeSend({
    to: email,
    subject: "Enlace temporal de descarga",
    html: signedUrlEmailHtml(signedUrl, expiry),
  });
}

export async function sendRequestedDocumentEmail(
  email: string,
  documentTitle: string,
  signedUrl: string,
  expiry: string,
) {
  return safeSend({
    to: email,
    subject: `Documento solicitado — ${documentTitle}`,
    html: requestedDocumentEmailHtml(documentTitle, signedUrl, expiry),
  });
}
