type AccessRequestEmailData = {
  id: string;
  full_name: string;
  email: string;
  community: string;
  motivation: string;
  instrument_slug: string;
  access_level: "admin" | "coordination";
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function adminNotificationHtml(request: AccessRequestEmailData, appUrl: string) {
  return `
    <h2>Nueva solicitud de acceso</h2>
    <p><strong>Instrumento:</strong> ${escapeHtml(request.instrument_slug)}</p>
    <p><strong>Nombre:</strong> ${escapeHtml(request.full_name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(request.email)}</p>
    <p><strong>Comunidad / institución:</strong> ${escapeHtml(request.community)}</p>
    <p><strong>Nivel:</strong> ${escapeHtml(request.access_level)}</p>
    <p><strong>Motivo:</strong> ${escapeHtml(request.motivation)}</p>
    <p><a href="${escapeHtml(appUrl)}/admin/solicitudes/${escapeHtml(request.id)}">Revisar solicitud</a></p>
  `;
}

export function coordinatorAlertHtml(request: AccessRequestEmailData, appUrl: string) {
  return `
    <h2>Solicitud de coordinación requerida</h2>
    <p><strong>Instrumento:</strong> ${escapeHtml(request.instrument_slug)}</p>
    <p><strong>Nombre:</strong> ${escapeHtml(request.full_name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(request.email)}</p>
    <p><strong>Comunidad / institución:</strong> ${escapeHtml(request.community)}</p>
    <p><strong>Motivo:</strong> ${escapeHtml(request.motivation)}</p>
    <p><a href="${escapeHtml(appUrl)}/admin/solicitudes/${escapeHtml(request.id)}">Revisar solicitud</a></p>
  `;
}

export function approvalEmailHtml(instrument: string) {
  return `
    <h2>Solicitud aprobada</h2>
    <p>Tu solicitud para el instrumento <strong>${escapeHtml(instrument)}</strong> fue aprobada.</p>
    <p>Puedes iniciar sesión en la plataforma para consultar los documentos habilitados.</p>
  `;
}

export function rejectionEmailHtml(instrument: string, reason: string) {
  return `
    <h2>Solicitud no aprobada</h2>
    <p>Tu solicitud para el instrumento <strong>${escapeHtml(instrument)}</strong> fue rechazada.</p>
    <p><strong>Razón:</strong> ${escapeHtml(reason)}</p>
  `;
}

export function signedUrlEmailHtml(signedUrl: string, expiry: string) {
  return `
    <h2>Enlace temporal de descarga</h2>
    <p>Este enlace estará disponible por ${escapeHtml(expiry)}.</p>
    <p><a href="${escapeHtml(signedUrl)}">Descargar documento</a></p>
  `;
}

export type { AccessRequestEmailData };
