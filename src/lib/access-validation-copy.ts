export type AccessValidationLevel = "admin" | "coordination";

type AccessValidationCopy = {
  badgeLabel: string;
  badgeHint: string;
  sectionDescription: string;
  calloutTitle: string;
  calloutBody: string;
  modalTitle: string;
  modalBody: string;
};

export const ACCESS_VALIDATION_COPY: Record<AccessValidationLevel, AccessValidationCopy> = {
  admin: {
    badgeLabel: "Acceso sujeto a revisión",
    badgeHint:
      "Algunos documentos están protegidos para cuidar información sensible del territorio. Puedes explorarlos y solicitar acceso; el equipo de Palenke revisará tu solicitud.",
    sectionDescription:
      "Consulta las herramientas de gobierno propio de los Consejos Comunitarios. Los archivos con candado requieren solicitud y aprobación antes de descargarse.",
    calloutTitle: "Revisión del equipo de Palenke",
    calloutBody:
      "El equipo administrativo revisará tu solicitud y te responderá por correo con la aprobación, el rechazo o el enlace del documento. Tiempo estimado: 1 día hábil.",
    modalTitle: "Revisión del equipo de Palenke",
    modalBody:
      "El equipo administrativo revisará tu solicitud y te avisará por correo cuando sea aprobada, rechazada o cuando el documento haya sido enviado. Tiempo estimado: 1 día hábil.",
  },
  coordination: {
    badgeLabel: "Revisión por coordinación",
    badgeHint:
      "Este instrumento incluye información especialmente sensible del territorio. Cada solicitud pasa por una revisión adicional del equipo de coordinación antes de compartirse.",
    sectionDescription:
      "Explora las herramientas de gobierno propio. Los archivos protegidos requieren solicitud y una revisión especial por sensibilidad territorial.",
    calloutTitle: "Revisión de coordinación territorial",
    calloutBody:
      "Por la sensibilidad de la información, tu solicitud será evaluada por el equipo de coordinación. Incluye en tu mensaje cómo protegerás los datos. Te responderemos por correo una vez se tome la decisión.",
    modalTitle: "Revisión de coordinación territorial",
    modalBody:
      "Este documento requiere una validación adicional por sensibilidad territorial. Después de enviarlo, deberás esperar la revisión del equipo antes de recibir acceso o el enlace de entrega.",
  },
};

export const VERIFIED_ACCESS_COPY = {
  badgeLabel: "Acceso verificado",
  badgeHint:
    "Has iniciado sesión. Los documentos ya aprobados para tu cuenta aparecen disponibles; el resto puede solicitarse desde aquí.",
  sectionDescription:
    "Consulta y descarga las herramientas de gobierno propio de los Consejos Comunitarios disponibles para tu perfil.",
};

export function getAccessValidationCopy(accessLevel: AccessValidationLevel) {
  return ACCESS_VALIDATION_COPY[accessLevel];
}
