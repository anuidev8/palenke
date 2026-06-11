type AccessRequestEmailData = {
  id: string;
  full_name: string;
  email: string;
  community: string;
  motivation: string;
  instrument_slug: string;
  document_title: string;
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
    <p><strong>Documento:</strong> ${escapeHtml(request.document_title)}</p>
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
    <p><strong>Documento:</strong> ${escapeHtml(request.document_title)}</p>
    <p><strong>Nombre:</strong> ${escapeHtml(request.full_name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(request.email)}</p>
    <p><strong>Comunidad / institución:</strong> ${escapeHtml(request.community)}</p>
    <p><strong>Motivo:</strong> ${escapeHtml(request.motivation)}</p>
    <p><a href="${escapeHtml(appUrl)}/admin/solicitudes/${escapeHtml(request.id)}">Revisar solicitud</a></p>
  `;
}

export function approvalEmailHtml(instrument: string, documentTitle: string) {
  return `
    <h2>Solicitud aprobada</h2>
    <p>Tu solicitud para el instrumento <strong>${escapeHtml(instrument)}</strong> fue aprobada.</p>
    <p><strong>Documento habilitado:</strong> ${escapeHtml(documentTitle)}</p>
    <p>Puedes iniciar sesión en la plataforma para descargar este archivo.</p>
  `;
}

export function rejectionEmailHtml(instrument: string, documentTitle: string, reason: string) {
  return `
    <h2>Solicitud no aprobada</h2>
    <p>Tu solicitud para el instrumento <strong>${escapeHtml(instrument)}</strong> fue rechazada.</p>
    <p><strong>Documento solicitado:</strong> ${escapeHtml(documentTitle)}</p>
    <p><strong>Razón:</strong> ${escapeHtml(reason)}</p>
  `;
}

export function signedUrlEmailHtml(signedUrl: string, expiry: string) {
  return `
    <h2>Enlace temporal de descarga</h2>
    <p>Este enlace estará disponible por ${escapeHtml(expiry)}.</p>
    <p><a href="${escapeHtml(signedUrl)}">Descargar documento</a></p>
    <div style="margin-top: 25px; padding: 15px; border-left: 4px solid #c29d38; background-color: #fdfaf4; font-size: 11px; color: #4e4a42; line-height: 1.5;">
      <strong>⚠️ Compromiso de Confidencialidad y Uso Territorial</strong><br/>
      Estás descargando un documento de propiedad colectiva de las comunidades negras. Al hacer uso de este archivo, te comprometes a:
      <ul style="margin: 5px 0; padding-left: 15px;">
        <li>Usar el material únicamente para fines formativos, de gestión comunitaria o de defensa legal de los territorios colectivos.</li>
        <li><strong>No distribuir, publicar en redes sociales ni compartir</strong> este archivo con personas externas a las comunidades sin autorización escrita de la Coordinación General de Palenke o del Consejo Comunitario de origen.</li>
        <li>Evitar el uso comercial, académico extractivo o corporativo de la información ambiental y tradicional contenida en este instrumento.</li>
      </ul>
      Este documento cuenta con trazabilidad de acceso digital. El uso inadecuado o la distribución indebida de este material atenta contra el principio de cuidado colectivo y la seguridad territorial de nuestras comunidades.
    </div>
  `;
}

export function requestedDocumentEmailHtml(
  documentTitle: string,
  signedUrl: string,
  expiry: string,
) {
  return `
    <h2>Documento solicitado</h2>
    <p>Te compartimos el enlace temporal para el documento <strong>${escapeHtml(documentTitle)}</strong>.</p>
    <p>Este enlace estará disponible por ${escapeHtml(expiry)}.</p>
    <p><a href="${escapeHtml(signedUrl)}">Descargar documento</a></p>
    <div style="margin-top: 25px; padding: 15px; border-left: 4px solid #c29d38; background-color: #fdfaf4; font-size: 11px; color: #4e4a42; line-height: 1.5;">
      <strong>⚠️ Compromiso de Confidencialidad y Uso Territorial</strong><br/>
      Estás descargando un documento de propiedad colectiva de las comunidades negras. Al hacer uso de este archivo, te comprometes a:
      <ul style="margin: 5px 0; padding-left: 15px;">
        <li>Usar el material únicamente para fines formativos, de gestión comunitaria o de defensa legal de los territorios colectivos.</li>
        <li><strong>No distribuir, publicar en redes sociales ni compartir</strong> este archivo con personas externas a las comunidades sin autorización escrita de la Coordinación General de Palenke o del Consejo Comunitario de origen.</li>
        <li>Evitar el uso comercial, académico extractivo o corporativo de la información ambiental y tradicional contenida en este instrumento.</li>
      </ul>
      Este documento cuenta con trazabilidad de acceso digital. El uso inadecuado o la distribución indebida de este material atenta contra el principio de cuidado colectivo y la seguridad territorial de nuestras comunidades.
    </div>
  `;
}

export type { AccessRequestEmailData };
