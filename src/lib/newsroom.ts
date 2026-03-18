export type NewsRelatedLink = {
  href: string;
  icono: "doc" | "tablero" | "gobierno";
  titulo: string;
  modulo: string;
  flecha: string;
  flechaColor: string;
};

export type PcnNewsArticle = {
  slug: string;
  publisher: "PCN";
  categoria: string;
  categoriaColor: string;
  categoriaBg: string;
  fecha: string;
  fechaLarga: string;
  territorio: string;
  titulo: string;
  resumen: string;
  cuerpo: {
    intro: string;
    cita: string;
    citaAutor: string;
    cuerpo1: string;
    cuerpo2: string;
  };
  relacionados: NewsRelatedLink[];
};

export type TerritorialEvent = {
  fecha: string;
  tipo: string;
  titulo: string;
  lugar: string;
};

export const pcnNewsArticles: PcnNewsArticle[] = [
  {
    slug: "comunidades-del-pacifico-defienden-sus-rios",
    publisher: "PCN",
    categoria: "Pronunciamiento",
    categoriaColor: "#2e7d32",
    categoriaBg: "#d8f3dc",
    fecha: "12 mar 2026",
    fechaLarga: "12 de marzo de 2026",
    territorio: "Buenaventura, Valle del Cauca",
    titulo: "Comunidades del Pacífico defienden sus ríos ante amenazas extractivas",
    resumen:
      "Más de 200 personas de 15 consejos comunitarios se reunieron para analizar las amenazas a sus ríos por proyectos extractivos y acordaron una ruta de acción conjunta.",
    cuerpo: {
      intro:
        "Las comunidades negras del Pacífico colombiano se reunieron el pasado 10 de marzo en un encuentro territorial para analizar las amenazas a sus ríos por parte de proyectos extractivos. Más de 200 personas de 15 consejos comunitarios participaron en la jornada.",
      cita:
        "El agua no se negocia. Nuestros ríos son la vida del territorio y de las generaciones que vienen.",
      citaAutor: "Representante del Consejo Comunitario de Río Anchicayá",
      cuerpo1:
        "Durante el encuentro se presentaron informes sobre la calidad del agua y se documentaron casos de contaminación. Los consejos comunitarios acordaron una ruta de acción conjunta que incluye litigio estratégico y acciones de protección territorial.",
      cuerpo2:
        "El equipo del Palenke/PCN acompañó la jornada con registro audiovisual y apoyo técnico para la sistematización de la información ambiental comunitaria.",
    },
    relacionados: [
      {
        href: "/biblioteca?section=Litigio",
        icono: "doc",
        titulo: "Informe de calidad hídrica 2025",
        modulo: "Memoria Afroterritorial",
        flecha: "→ Memoria",
        flechaColor: "#2e7d32",
      },
      {
        href: "/gobierno-propio",
        icono: "gobierno",
        titulo: "Ruta de litigio estratégico — Río Anchicayá",
        modulo: "Gobierno propio",
        flecha: "→ Gobierno",
        flechaColor: "#d32f2f",
      },
      {
        href: "/estadisticas",
        icono: "tablero",
        titulo: "Tablero: Calidad hídrica por región",
        modulo: "Mirador de datos",
        flecha: "→ Mirador",
        flechaColor: "#f57f17",
      },
    ],
  },
  {
    slug: "acuerdo-colectivo-guapi",
    publisher: "PCN",
    categoria: "Acuerdo colectivo",
    categoriaColor: "#1565c0",
    categoriaBg: "#e3f2fd",
    fecha: "5 mar 2026",
    fechaLarga: "5 de marzo de 2026",
    territorio: "Guapi, Cauca",
    titulo: "Consejo Comunitario de Guapi firma acuerdo de conservación de manglares",
    resumen:
      "El acuerdo protege 3.200 hectáreas de manglar en la desembocadura del río Guapi, asegurando los derechos colectivos y la soberanía ambiental del territorio.",
    cuerpo: {
      intro:
        "El acuerdo protege 3.200 hectáreas de manglar en la desembocadura del río Guapi, asegurando los derechos colectivos y la soberanía ambiental del territorio.",
      cita:
        "Nuestro manglar es cuna de vida y barrera natural. Con este acuerdo, aseguramos que nuestras prácticas tradicionales sigan vivas.",
      citaAutor: "Lideresa del Consejo Comunitario de Guapi",
      cuerpo1:
        "Tras meses de diálogo y concertación, las autoridades tradicionales del Consejo Comunitario firmaron un acuerdo histórico que establece zonas de reserva exclusiva para la reproducción de especies nativas y regula las artes de pesca permitidas.",
      cuerpo2:
        "El equipo del Palenke/PCN acompañó el proceso mediante la caracterización socioecológica del área y la facilitación de talleres sobre ordenamiento ambiental propio, aportando herramientas técnicas para el fortalecimiento del gobierno territorial.",
    },
    relacionados: [
      {
        href: "/gobierno-propio",
        icono: "gobierno",
        titulo: "Instrumentos de Gobierno propio",
        modulo: "Gobierno propio",
        flecha: "→ Gobierno",
        flechaColor: "#d32f2f",
      },
    ],
  },
  {
    slug: "fallo-tutela-rio-anchicaya",
    publisher: "PCN",
    categoria: "Litigio estratégico",
    categoriaColor: "#d32f2f",
    categoriaBg: "#fddede",
    fecha: "28 feb 2026",
    fechaLarga: "28 de febrero de 2026",
    territorio: "Valle del Cauca",
    titulo: "Fallo favorable en tutela por contaminación del Río Anchicayá",
    resumen:
      "La Corte ordenó medidas cautelares para proteger el río Anchicayá después de que el equipo jurídico del PCN presentara evidencias de contaminación por actividades mineras.",
    cuerpo: {
      intro:
        "La Corte ordenó medidas cautelares para proteger el río Anchicayá después de que el equipo jurídico del PCN presentara evidencias de contaminación por actividades mineras.",
      cita:
        "La justicia reconoce hoy lo que nuestros mayores siempre han sabido: el río tiene derechos y nosotros somos sus guardianes.",
      citaAutor: "Equipo Jurídico del PCN",
      cuerpo1:
        "El fallo emitido por el tribunal superior ordena la suspensión inmediata de las actividades extractivas en la cuenca alta y exige a las entidades gubernamentales la formulación de un plan de recuperación ecológica en conjunto con las comunidades.",
      cuerpo2:
        "Esta decisión representa un hito en la defensa de los derechos bioculturales y establece un precedente importante para otras cuencas de la región Pacífica que enfrentan amenazas similares. El SCITA fue fundamental para documentar las afectaciones territoriales presentadas en el proceso.",
    },
    relacionados: [
      {
        href: "/gobierno-propio",
        icono: "gobierno",
        titulo: "Ruta de litigio estratégico — Río Anchicayá",
        modulo: "Gobierno propio",
        flecha: "→ Gobierno",
        flechaColor: "#d32f2f",
      },
    ],
  },
  {
    slug: "censo-comunitario-2025",
    publisher: "PCN",
    categoria: "Datos territoriales",
    categoriaColor: "#f57f17",
    categoriaBg: "#fff3cd",
    fecha: "14 feb 2026",
    fechaLarga: "14 de febrero de 2026",
    territorio: "Pacífico colombiano",
    titulo: "Publicación del Censo Comunitario del Pacífico 2025",
    resumen:
      "El SCITA publica los resultados del Censo Comunitario 2025, con datos demográficos actualizados de 48 Consejos Comunitarios del Pacífico Sur y Norte.",
    cuerpo: {
      intro:
        "El SCITA publica los resultados del Censo Comunitario 2025, con datos demográficos actualizados de 48 Consejos Comunitarios del Pacífico Sur y Norte.",
      cita:
        "Contarnos a nosotros mismos es el primer paso para gobernar nuestro territorio con autonomía y pertinencia.",
      citaAutor: "Coordinación SCITA / Equipo SIG",
      cuerpo1:
        "El censo comunitario 2025 es el resultado de un esfuerzo sin precedentes de recolección primaria de información desde el territorio, superando los vacíos históricos de los censos oficiales. Los datos revelan tendencias importantes en dinámicas poblacionales, medios de vida y acceso a servicios.",
      cuerpo2:
        "Toda la información ha sido consolidada en el Sistema de Información Geográfica y está disponible para consulta de las autoridades tradicionales a través de tableros interactivos, sirviendo como insumo técnico para la formulación de planes de etnodesarrollo.",
    },
    relacionados: [
      {
        href: "/estadisticas",
        icono: "tablero",
        titulo: "Tableros demográficos",
        modulo: "Mirador de datos",
        flecha: "→ Mirador",
        flechaColor: "#f57f17",
      },
    ],
  },
];

export const territorialEvents: TerritorialEvent[] = [
  {
    fecha: "20 mar 2026",
    tipo: "Asamblea",
    titulo: "Asamblea territorial de Consejos Comunitarios del Pacífico Sur",
    lugar: "Tumaco, Nariño",
  },
  {
    fecha: "18 mar 2026",
    tipo: "Taller",
    titulo: "Formación en herramientas SIG para equipos comunitarios",
    lugar: "Quibdó, Chocó",
  },
  {
    fecha: "15 mar 2026",
    tipo: "Litigio",
    titulo: "Audiencia pública — Ruta de litigio estratégico Río Anchicayá",
    lugar: "Bogotá D.C.",
  },
  {
    fecha: "10 mar 2026",
    tipo: "Cultural",
    titulo: "Lanzamiento del archivo audiovisual de memorias del Pacífico",
    lugar: "Cali, Valle del Cauca",
  },
  {
    fecha: "5 mar 2026",
    tipo: "Taller",
    titulo: "Taller de formación en derechos étnicos — Ley 70 de 1993",
    lugar: "Buenaventura, Valle del Cauca",
  },
  {
    fecha: "28 feb 2026",
    tipo: "Reunión",
    titulo: "Mesa de trabajo SCITA — actualización de capas SIG",
    lugar: "Virtual",
  },
];

export const fallbackNewsArticle: PcnNewsArticle = {
  slug: "",
  publisher: "PCN",
  categoria: "Noticia",
  categoriaColor: "#1a1a1a",
  categoriaBg: "#f0eae0",
  fecha: "Mar 2026",
  fechaLarga: "Marzo 2026",
  territorio: "Pacífico colombiano",
  titulo: "Actualización del proceso territorial",
  resumen:
    "El Proceso de Comunidades Negras continúa su trabajo de defensa territorial, documentando y acompañando a los Consejos Comunitarios del Pacífico colombiano.",
  cuerpo: {
    intro:
      "El Proceso de Comunidades Negras continúa su trabajo de defensa territorial, documentando y acompañando a los Consejos Comunitarios del Pacífico colombiano.",
    cita: "El territorio es vida, y la vida del territorio es nuestra lucha.",
    citaAutor: "Proceso de Comunidades Negras, PCN",
    cuerpo1:
      "Las actividades de acompañamiento incluyen talleres de formación en derechos étnicos, apoyo técnico para la gestión territorial y documentación de casos de vulneración de derechos.",
    cuerpo2:
      "El equipo del Palenke/PCN continúa construyendo herramientas digitales para el fortalecimiento organizativo de las comunidades.",
  },
  relacionados: [
    {
      href: "/biblioteca",
      icono: "doc",
      titulo: "Ver documentos relacionados",
      modulo: "Memoria Afroterritorial",
      flecha: "→ Memoria",
      flechaColor: "#2e7d32",
    },
    {
      href: "/gobierno-propio",
      icono: "gobierno",
      titulo: "Instrumentos de Gobierno propio",
      modulo: "Gobierno propio",
      flecha: "→ Gobierno",
      flechaColor: "#d32f2f",
    },
  ],
};

export function getHomePcnNews(limit = 2) {
  return pcnNewsArticles.slice(0, limit);
}

export function getLatestTerritorialEvents(limit = 4) {
  return territorialEvents.slice(0, limit);
}

export function findNewsArticleBySlug(slug: string) {
  return pcnNewsArticles.find((article) => article.slug === slug);
}
