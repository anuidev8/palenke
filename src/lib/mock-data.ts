export type ViewerRole = "public" | "internal" | "admin";
export type Visibility = "public" | "internal" | "sensitive";
export type StoryKind = "audio" | "video" | "testimony" | "photo";

export type DocumentRecord = {
  id: string;
  slug: string;
  title: string;
  section: string;
  type: string;
  description: string;
  territory: string;
  council: string;
  department: string;
  municipality: string;
  year: number;
  validity: string;
  visibility: Visibility;
  keywords: string[];
  genderFocus: boolean;
  mjnTags: string[];
  action: "file" | "external" | "video";
  fileLabel: string;
  fileSize?: string;
  url: string;
  /** URL to the official source page (Corte Constitucional, Senado, OIT, etc.) */
  sourceUrl?: string;
  riskFlag?: boolean;
};

export type StoryRecord = {
  id: string;
  kind: StoryKind;
  title: string;
  territory: string;
  community: string;
  contributor: string;
  year: number;
  description: string;
  duration?: string;
  tags: string[];
  visibility: Extract<Visibility, "public" | "internal">;
  publicationAuthorized: boolean;
  authorizationLabel: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  relatedIds: string[];
};

export type CampaignMaterial = {
  id: string;
  type: "Afiche" | "Cartilla" | "Video" | "Otro";
  title: string;
  action: "download" | "watch";
  url: string;
};

export type CampaignRecord = {
  id: string;
  slug: string;
  title: string;
  intro: string;
  body: string[];
  startDate: string;
  endDate?: string;
  visibility: Extract<Visibility, "public" | "internal">;
  active: boolean;
  placements: Array<"home" | "mjn" | "biblioteca" | "all">;
  materials: CampaignMaterial[];
};

export type DashboardRecord = {
  id: string;
  slug: string;
  title: string;
  description: string;
  topic: string;
  territory: string;
  period: string;
  audience: string;
  frequency: string;
  visibility: Extract<Visibility, "public" | "internal">;
  status: "Activo" | "En actualización" | "Desactivado temporalmente";
  embedUrl: string;
};

export type AccRecord = {
  id: string;
  name: string;
  nickname?: string;
  council: string;
  basin: string;
  municipalities: string;
  departments: string;
  hectares?: number;
  description: string;
  inGeoportal: boolean;
  geoportalLayer?: string;
  linkedDashboardId?: string;
  linkedDocumentIds: string[];
  linkedToMeta3030: boolean;
  visibility: Extract<Visibility, "public" | "internal">;
};

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Interno";
  organization: string;
  isPrimaryAdmin: boolean;
  active: boolean;
  mustChangePassword: boolean;
  lastLoginAt?: string; // ISO date string, undefined = never logged in
};

export const USER_LIMIT = 15;

export type ActivityRecord = {
  id: string;
  title: string;
  section: string;
  editedBy: string;
  editedAt: string;
  kind?: "content" | "user_created" | "user_deactivated" | "user_role_changed" | "password_reset";
};

export const librarySections = [
  "Norma vigente",
  "Memoria viva del territorio",
  "Gobierno Propio",
  "Planes de uso y manejo",
  "Planes de etnodesarrollo",
  "Rutas de litigio estratégico",
  "Producción técnica/política",
  "Material pedagógico/comunitario",
] as const;

export const territories = [
  "Cuenca del Naya",
  "Bajo Baudó",
  "Guapi",
  "Litoral Sanquianga",
] as const;

export const instrumentTypes = [
  "Reglamento interno",
  "Plan de manejo",
  "Plan de etnodesarrollo",
  "Ruta de litigio",
  "Cartilla",
  "Video",
  "Informe",
  "Pronunciamiento",
  "Estudio",
] as const;

export const documents: DocumentRecord[] = [
  {
    id: "doc-reglamento-naya",
    slug: "reglamento-interno-rio-naya-2021",
    title: "Reglamento interno del Consejo Comunitario del río Naya",
    section: "Gobierno Propio",
    type: "Reglamento interno",
    description:
      "Versión aprobada del reglamento interno con lineamientos de autoridad, manejo territorial y mecanismos de decisión comunitaria.",
    territory: "Cuenca del Naya",
    council: "Consejo Comunitario del río Naya",
    department: "Cauca",
    municipality: "López de Micay",
    year: 2021,
    validity: "Vigente",
    visibility: "public",
    keywords: ["gobierno propio", "Naya", "reglamento", "2021"],
    genderFocus: false,
    mjnTags: [],
    action: "file",
    fileLabel: "Descargar PDF",
    fileSize: "3.2 MB",
    url: "#",
  },
  {
    id: "doc-manglar-baudó",
    slug: "plan-uso-manejo-manglar-baudo-2023",
    title: "Plan de uso y manejo del manglar en Bajo Baudó",
    section: "Planes de uso y manejo",
    type: "Plan de manejo",
    description:
      "Herramienta comunitaria para acordar usos, restauración y vigilancia del manglar sin publicar coordenadas sensibles.",
    territory: "Bajo Baudó",
    council: "Consejo Comunitario del Bajo Baudó",
    department: "Chocó",
    municipality: "Bajo Baudó",
    year: 2023,
    validity: "En actualización",
    visibility: "internal",
    keywords: ["manglar", "Bajo Baudó", "manejo", "restauración"],
    genderFocus: false,
    mjnTags: [],
    action: "file",
    fileLabel: "Descargar PDF",
    fileSize: "5.8 MB",
    url: "#",
  },
  {
    id: "doc-etnodesarrollo-guapi",
    slug: "lineamientos-etnodesarrollo-guapi-2022",
    title: "Lineamientos de etnodesarrollo para consejos comunitarios de Guapi",
    section: "Planes de etnodesarrollo",
    type: "Plan de etnodesarrollo",
    description:
      "Síntesis operativa de prioridades económicas, educativas y organizativas con enfoque de fortalecimiento comunitario.",
    territory: "Guapi",
    council: "Proceso de Consejos Comunitarios de Guapi",
    department: "Cauca",
    municipality: "Guapi",
    year: 2022,
    validity: "Vigente",
    visibility: "public",
    keywords: ["etnodesarrollo", "Guapi", "planificación", "prioridades"],
    genderFocus: true,
    mjnTags: ["Juventudes", "MJN general"],
    action: "file",
    fileLabel: "Descargar PDF",
    fileSize: "2.9 MB",
    url: "#",
  },
  {
    id: "doc-ruta-defensoras",
    slug: "ruta-litigio-defensoras-territorio",
    title: "Ruta de litigio y protección para defensoras del territorio",
    section: "Rutas de litigio estratégico",
    type: "Ruta de litigio",
    description:
      "Documento de trabajo con pasos de acompañamiento jurídico y psicosocial para casos activos vinculados a lideresas y comunidades en riesgo.",
    territory: "Litoral Sanquianga",
    council: "Red de Consejos Comunitarios del Sanquianga",
    department: "Nariño",
    municipality: "Olaya Herrera",
    year: 2024,
    validity: "Vigente",
    visibility: "internal",
    keywords: ["litigio", "defensoras", "protección", "acompañamiento"],
    genderFocus: true,
    mjnTags: ["Mujeres"],
    action: "file",
    fileLabel: "Descargar PDF",
    fileSize: "1.6 MB",
    url: "#",
    riskFlag: true,
  },
  {
    id: "doc-cartilla-cuidado",
    slug: "cartilla-cuidado-colectivo-mujeres-jovenes",
    title: "Cartilla de cuidado colectivo para mujeres y jóvenes del territorio",
    section: "Material pedagógico/comunitario",
    type: "Cartilla",
    description:
      "Material pedagógico para talleres de cuidado, liderazgo y prevención de violencias con lenguaje comunitario y práctico.",
    territory: "Cuenca del Naya",
    council: "Consejo Comunitario del río Naya",
    department: "Cauca",
    municipality: "López de Micay",
    year: 2024,
    validity: "Vigente",
    visibility: "public",
    keywords: ["cartilla", "cuidado colectivo", "mujeres", "jóvenes"],
    genderFocus: true,
    mjnTags: ["Mujeres", "Juventudes"],
    action: "external",
    fileLabel: "Ver recurso",
    url: "https://example.com/cartilla-cuidado",
  },
  {
    id: "doc-video-memoria",
    slug: "memoria-audiovisual-juventudes-rio-naya",
    title: "Memoria audiovisual de juventudes del río Naya",
    section: "Material pedagógico/comunitario",
    type: "Video",
    description:
      "Pieza audiovisual autorizada para uso público sobre memoria, cuidado del río y procesos organizativos juveniles.",
    territory: "Cuenca del Naya",
    council: "Consejo Comunitario del río Naya",
    department: "Cauca",
    municipality: "López de Micay",
    year: 2023,
    validity: "Vigente",
    visibility: "public",
    keywords: ["video", "memoria", "juventudes", "Naya"],
    genderFocus: true,
    mjnTags: ["Juventudes", "Niñez"],
    action: "video",
    fileLabel: "Ver video",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: "doc-pronunciamiento-pcn-2024",
    slug: "pronunciamiento-pcn-derechos-etnicos-2024",
    title: "Pronunciamiento del Palenke/PCN sobre derechos étnicos y soberanía territorial",
    section: "Producción técnica/política",
    type: "Pronunciamiento",
    description:
      "Posición pública del proceso organizativo frente a las amenazas al territorio, los derechos colectivos y la autonomía de los pueblos negros en el Pacífico colombiano.",
    territory: "Guapi",
    council: "Palenke de Pensamiento / PCN",
    department: "Cauca",
    municipality: "Guapi",
    year: 2024,
    validity: "Vigente",
    visibility: "public",
    keywords: ["pronunciamiento", "derechos étnicos", "PCN", "Pacífico"],
    genderFocus: false,
    mjnTags: [],
    action: "file",
    fileLabel: "Descargar PDF",
    fileSize: "0.8 MB",
    url: "#",
  },
  {
    id: "doc-estudio-conflicto-naya-2023",
    slug: "estudio-conflicto-territorial-naya-2023",
    title: "Estudio sobre conflictos territoriales y gobernanza comunitaria en la cuenca del Naya",
    section: "Producción técnica/política",
    type: "Estudio",
    description:
      "Análisis técnico de uso interno sobre tensiones en el gobierno propio, presión extractiva y capacidades organizativas de los consejos comunitarios del río Naya.",
    territory: "Cuenca del Naya",
    council: "Consejo Comunitario del río Naya",
    department: "Cauca",
    municipality: "López de Micay",
    year: 2023,
    validity: "Vigente",
    visibility: "internal",
    keywords: ["estudio", "conflicto territorial", "Naya", "gobernanza"],
    genderFocus: false,
    mjnTags: [],
    action: "file",
    fileLabel: "Descargar PDF",
    fileSize: "4.1 MB",
    url: "#",
  },
  {
    id: "doc-sensible",
    slug: "inventario-zonas-riesgo-territorial",
    title: "Inventario interno de zonas de riesgo territorial",
    section: "Producción técnica/política",
    type: "Informe",
    description:
      "Documento reservado para coordinación con referencias sensibles sobre conflictos y alertas territoriales.",
    territory: "Bajo Baudó",
    council: "Consejo Comunitario del Bajo Baudó",
    department: "Chocó",
    municipality: "Bajo Baudó",
    year: 2025,
    validity: "Vigente",
    visibility: "sensitive",
    keywords: ["riesgo", "alertas", "territorio"],
    genderFocus: false,
    mjnTags: [],
    action: "file",
    fileLabel: "Descargar PDF",
    fileSize: "7.4 MB",
    url: "#",
    riskFlag: true,
  },

  // ── Norma vigente ─────────────────────────────────────────────────────────
  {
    id: "norma-ley70",
    slug: "ley-70-1993-comunidades-negras",
    title: "Ley 70 de 1993 — Comunidades Negras",
    section: "Norma vigente",
    type: "Ley",
    description:
      "Norma central que reconoce los derechos territoriales, la identidad, la participación y el desarrollo propio de las comunidades negras en Colombia.",
    territory: "Nacional",
    council: "Congreso de Colombia",
    department: "Nacional",
    municipality: "Bogotá",
    year: 1993,
    validity: "Vigente",
    visibility: "public",
    keywords: ["Ley 70", "comunidades negras", "territorio colectivo", "1993"],
    genderFocus: false,
    mjnTags: [],
    action: "external",
    fileLabel: "Ver en Senado",
    url: "http://www.secretariasenado.gov.co/senado/basedoc/ley_0070_1993.html",
    sourceUrl: "http://www.secretariasenado.gov.co/senado/basedoc/ley_0070_1993.html",
  },
  {
    id: "norma-convenio169",
    slug: "convenio-169-oit-pueblos-indigenas-tribales",
    title: "Convenio 169 OIT — Pueblos Indígenas y Tribales",
    section: "Norma vigente",
    type: "Instrumento internacional",
    description:
      "Convenio internacional que reconoce el derecho a territorio, consulta previa y autonomía de los pueblos indígenas y tribales, incorporado al derecho colombiano mediante Ley 21 de 1991.",
    territory: "Internacional",
    council: "Organización Internacional del Trabajo",
    department: "Internacional",
    municipality: "Ginebra",
    year: 1989,
    validity: "Vigente",
    visibility: "public",
    keywords: ["Convenio 169", "OIT", "consulta previa", "pueblos tribales"],
    genderFocus: false,
    mjnTags: [],
    action: "external",
    fileLabel: "Ver en OIT",
    url: "https://www.ilo.org/dyn/normlex/es/f?p=NORMLEXPUB:12100:0::NO::P12100_ILO_CODE:C169",
    sourceUrl: "https://www.ilo.org/dyn/normlex/es/f?p=NORMLEXPUB:12100:0::NO::P12100_ILO_CODE:C169",
  },
  {
    id: "norma-t622",
    slug: "sentencia-t622-2016-rio-atrato",
    title: "Sentencia T-622 de 2016 — Río Atrato como sujeto de derechos",
    section: "Norma vigente",
    type: "Jurisprudencia",
    description:
      "Decisión histórica de la Corte Constitucional que reconoció al Río Atrato como sujeto de derechos y ordenó medidas de protección de los territorios afrodescendientes.",
    territory: "Chocó",
    council: "Corte Constitucional de Colombia",
    department: "Chocó",
    municipality: "Quibdó",
    year: 2016,
    validity: "Vigente",
    visibility: "public",
    keywords: ["T-622", "Río Atrato", "sujeto de derechos", "2016"],
    genderFocus: false,
    mjnTags: [],
    action: "external",
    fileLabel: "Ver en Corte Constitucional",
    url: "https://www.corteconstitucional.gov.co/relatoria/2016/T-622-16.htm",
    sourceUrl: "https://www.corteconstitucional.gov.co/relatoria/2016/T-622-16.htm",
  },
  {
    id: "norma-decreto1745",
    slug: "decreto-1745-1995-territorios-colectivos",
    title: "Decreto 1745 de 1995 — Territorios colectivos y Consejos Comunitarios",
    section: "Norma vigente",
    type: "Decreto",
    description:
      "Reglamenta el Capítulo III de la Ley 70 de 1993 sobre el reconocimiento del derecho a la propiedad colectiva de las Comunidades Negras y sus Consejos Comunitarios.",
    territory: "Nacional",
    council: "Presidencia de la República",
    department: "Nacional",
    municipality: "Bogotá",
    year: 1995,
    validity: "Vigente",
    visibility: "public",
    keywords: ["Decreto 1745", "territorios colectivos", "Consejos Comunitarios", "1995"],
    genderFocus: false,
    mjnTags: [],
    action: "external",
    fileLabel: "Ver en Senado",
    url: "http://www.secretariasenado.gov.co/senado/basedoc/decreto_1745_1995.html",
    sourceUrl: "http://www.secretariasenado.gov.co/senado/basedoc/decreto_1745_1995.html",
  },
  {
    id: "norma-escazu",
    slug: "acuerdo-escazu-derechos-ambientales",
    title: "Acuerdo de Escazú — Acceso a la información ambiental",
    section: "Norma vigente",
    type: "Instrumento internacional",
    description:
      "Acuerdo regional de América Latina sobre acceso a la información, participación pública y justicia en asuntos ambientales, con protección especial para defensores ambientales.",
    territory: "Internacional",
    council: "CEPAL / Naciones Unidas",
    department: "Internacional",
    municipality: "Escazú",
    year: 2018,
    validity: "Vigente",
    visibility: "public",
    keywords: ["Escazú", "acceso información", "justicia ambiental", "defensores"],
    genderFocus: false,
    mjnTags: [],
    action: "external",
    fileLabel: "Ver en CEPAL",
    url: "https://repositorio.cepal.org/handle/11362/43559",
    sourceUrl: "https://repositorio.cepal.org/handle/11362/43559",
  },

  // ── Memoria viva del territorio ───────────────────────────────────────────
  {
    id: "memoria-biodiversidad-tumaco",
    slug: "biodiversidad-territorio-pacifico-sur-2023",
    title: "Biodiversidad y territorio en el Pacífico sur",
    section: "Memoria viva del territorio",
    type: "Investigación",
    description:
      "Investigación sobre la relación entre biodiversidad, territorio y comunidades negras en el Pacífico sur colombiano, con énfasis en los municipios de Tumaco y Francisco Pizarro.",
    territory: "Tumaco",
    council: "Proceso de Comunidades Negras / PCN",
    department: "Nariño",
    municipality: "Tumaco",
    year: 2023,
    validity: "Vigente",
    visibility: "public",
    keywords: ["biodiversidad", "Pacífico sur", "territorio", "investigación"],
    genderFocus: false,
    mjnTags: [],
    action: "file",
    fileLabel: "Descargar PDF",
    fileSize: "4.2 MB",
    url: "#",
  },
  {
    id: "memoria-cantos-mayoras",
    slug: "cantos-saberes-mayoras-atrato-2022",
    title: "Cantos y saberes de las mayoras del Atrato",
    section: "Memoria viva del territorio",
    type: "Cultural",
    description:
      "Sistematización de la tradición oral, cantos y saberes de las mayoras del Chocó como patrimonio vivo y memoria afrodescendiente del Atrato.",
    territory: "Chocó",
    council: "Organizaciones comunitarias del Atrato",
    department: "Chocó",
    municipality: "Quibdó",
    year: 2022,
    validity: "Vigente",
    visibility: "public",
    keywords: ["cantos", "mayoras", "Atrato", "tradición oral"],
    genderFocus: true,
    mjnTags: ["Mujeres"],
    action: "file",
    fileLabel: "Descargar PDF",
    fileSize: "3.1 MB",
    url: "#",
  },
];

export const mjnStories: StoryRecord[] = [
  {
    id: "story-audio-manglar",
    kind: "audio",
    title: "Voces de cuidadoras del manglar",
    territory: "Bajo Baudó",
    community: "Consejo Comunitario del Bajo Baudó",
    contributor: "Colectivo de Mujeres Cuidadoras",
    year: 2024,
    description:
      "Testimonio sonoro sobre memoria ambiental y trabajo colectivo de mujeres cuidadoras del manglar.",
    duration: "12 min",
    tags: ["Cuidado colectivo", "Manglar", "Mujeres"],
    visibility: "public",
    publicationAuthorized: true,
    authorizationLabel: "Autorización comunitaria registrada · Acta MJN-014",
    mediaUrl: "https://www.w3schools.com/html/horse.mp3",
    thumbnailUrl: "/generated/doc-thumbnail.png",
    relatedIds: ["story-photo-guardianas-rio", "story-testimony-comadres-territorio", "story-video-escuela-naya"],
  },
  {
    id: "story-video-escuela-naya",
    kind: "video",
    title: "Escuela de liderazgos juveniles del río Naya",
    territory: "Cuenca del Naya",
    community: "Consejo Comunitario del río Naya",
    contributor: "Escuela Popular de Comunicación Juvenil",
    year: 2023,
    description:
      "Registro audiovisual de formación política, cuidado del río y comunicación comunitaria intergeneracional.",
    duration: "8 min",
    tags: ["Juventudes", "Formación política", "Memoria audiovisual"],
    visibility: "public",
    publicationAuthorized: true,
    authorizationLabel: "Autorización de vocerías y uso público · Formato MJN-021",
    mediaUrl: "https://www.youtube.com/embed/aqz-KE-bpKQ?rel=0",
    thumbnailUrl: "/generated/doc-thumbnail.png",
    relatedIds: ["story-audio-ninez-rio", "story-photo-juventudes-cocina", "story-testimony-jovenes-guapi"],
  },
  {
    id: "story-testimony-comadres-territorio",
    kind: "testimony",
    title: "Comadres que sostienen el territorio",
    territory: "Litoral Sanquianga",
    community: "Red de Consejos Comunitarios del Sanquianga",
    contributor: "Mesa de Mujeres del Sanquianga",
    year: 2022,
    description:
      "Relato editorial sobre prácticas de cuidado, liderazgo y organización para la protección colectiva del territorio.",
    tags: ["Testimonio", "Liderazgo", "Cuidado"],
    visibility: "public",
    publicationAuthorized: true,
    authorizationLabel: "Autorización para publicación editorial · Consentimiento informado",
    thumbnailUrl: "/generated/doc-thumbnail.png",
    relatedIds: ["story-audio-manglar", "story-photo-guardianas-rio", "story-testimony-lideresas-sanquianga"],
  },
  {
    id: "story-photo-guardianas-rio",
    kind: "photo",
    title: "Archivo fotográfico de guardianas del río",
    territory: "Guapi",
    community: "Proceso de Consejos Comunitarios de Guapi",
    contributor: "Archivo Comunitario de Guapi",
    year: 2024,
    description:
      "Selección curada de imágenes publicables sobre jornadas de cuidado del río y trabajo comunitario de mujeres.",
    tags: ["Foto", "Archivo comunitario", "Río"],
    visibility: "public",
    publicationAuthorized: true,
    authorizationLabel: "Autorización de imagen y publicación comunitaria · Carpeta 2024",
    thumbnailUrl: "/generated/doc-thumbnail.png",
    relatedIds: ["story-audio-manglar", "story-photo-juventudes-cocina", "story-video-escuela-naya"],
  },
  {
    id: "story-audio-ninez-rio",
    kind: "audio",
    title: "Niñez y cuidado del río",
    territory: "Cuenca del Naya",
    community: "Consejo Comunitario del río Naya",
    contributor: "Escuela radial comunitaria",
    year: 2025,
    description:
      "Audio de circulación interna con experiencias de niñas y niños sobre cuidado del agua y memoria familiar.",
    duration: "9 min",
    tags: ["Niñez", "Radio comunitaria", "Escuelas de río"],
    visibility: "internal",
    publicationAuthorized: true,
    authorizationLabel: "Autorización de uso interno para formación comunitaria",
    mediaUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    thumbnailUrl: "/generated/doc-thumbnail.png",
    relatedIds: ["story-video-escuela-naya", "story-testimony-jovenes-guapi", "story-photo-juventudes-cocina"],
  },
  {
    id: "story-video-cantos-guapi",
    kind: "video",
    title: "Cantos y memoria de mujeres en Guapi",
    territory: "Guapi",
    community: "Proceso de Consejos Comunitarios de Guapi",
    contributor: "Colectivo de Comunicadoras Populares",
    year: 2024,
    description:
      "Video comunitario sobre encuentros de canto, cocina y memoria como formas de cuidado colectivo.",
    duration: "11 min",
    tags: ["Mujeres", "Memoria audiovisual", "Cantos tradicionales"],
    visibility: "public",
    publicationAuthorized: true,
    authorizationLabel: "Autorización de publicación colectiva · Registro audiovisual MJN",
    mediaUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0",
    thumbnailUrl: "/generated/doc-thumbnail.png",
    relatedIds: ["story-testimony-lideresas-sanquianga", "story-photo-guardianas-rio", "story-audio-manglar"],
  },
  {
    id: "story-testimony-jovenes-guapi",
    kind: "testimony",
    title: "Jóvenes que organizan memoria viva",
    territory: "Guapi",
    community: "Proceso de Consejos Comunitarios de Guapi",
    contributor: "Semillero Juvenil de Memoria",
    year: 2025,
    description:
      "Testimonio sobre cómo las juventudes documentan procesos comunitarios sin exponer información sensible.",
    tags: ["Juventudes", "Memoria", "Comunicación comunitaria"],
    visibility: "public",
    publicationAuthorized: true,
    authorizationLabel: "Autorización individual y de comité de comunicaciones",
    thumbnailUrl: "/generated/doc-thumbnail.png",
    relatedIds: ["story-video-escuela-naya", "story-audio-ninez-rio", "story-photo-juventudes-cocina"],
  },
  {
    id: "story-photo-juventudes-cocina",
    kind: "photo",
    title: "Cocinas colectivas y juventudes",
    territory: "Litoral Sanquianga",
    community: "Red de Consejos Comunitarios del Sanquianga",
    contributor: "Archivo Comunitario de Juventudes",
    year: 2025,
    description:
      "Serie fotográfica de encuentros intergeneracionales en cocinas comunitarias y espacios de cuidado.",
    tags: ["Juventudes", "Foto", "Cuidado colectivo"],
    visibility: "public",
    publicationAuthorized: true,
    authorizationLabel: "Autorización de imagen vigente para galería pública",
    thumbnailUrl: "/generated/doc-thumbnail.png",
    relatedIds: ["story-video-escuela-naya", "story-testimony-jovenes-guapi", "story-photo-guardianas-rio"],
  },
  {
    id: "story-testimony-lideresas-sanquianga",
    kind: "testimony",
    title: "Lideresas y tejido de acompañamiento",
    territory: "Litoral Sanquianga",
    community: "Red de Consejos Comunitarios del Sanquianga",
    contributor: "Mesa de Acompañamiento Territorial",
    year: 2026,
    description:
      "Relato de acompañamiento entre lideresas para sostener procesos organizativos y rutas de cuidado.",
    tags: ["Mujeres", "Acompañamiento", "Organización"],
    visibility: "internal",
    publicationAuthorized: true,
    authorizationLabel: "Publicación de uso interno aprobada por comité de protección",
    thumbnailUrl: "/generated/doc-thumbnail.png",
    relatedIds: ["story-video-cantos-guapi", "story-testimony-comadres-territorio", "story-audio-manglar"],
  },
  {
    id: "story-photo-borrador",
    kind: "photo",
    title: "Borrador de registro no publicado",
    territory: "Bajo Baudó",
    community: "Consejo Comunitario del Bajo Baudó",
    contributor: "Equipo de documentación",
    year: 2026,
    description:
      "Material en revisión editorial y de autorización; no debe aparecer en la grilla pública.",
    tags: ["Borrador"],
    visibility: "internal",
    publicationAuthorized: false,
    authorizationLabel: "Sin autorización de publicación",
    thumbnailUrl: "/generated/doc-thumbnail.png",
    relatedIds: [],
  },
];

export const campaigns: CampaignRecord[] = [
  {
    id: "camp-escuelas",
    slug: "escuelas-de-cuidado-territorial",
    title: "Escuelas de cuidado territorial",
    intro:
      "Serie de encuentros y materiales para fortalecer el autocuidado, la formación política y la prevención de violencias en comunidades negras.",
    body: [
      "La campaña articula encuentros locales, materiales pedagógicos y piezas de memoria para acompañar a lideresas, jóvenes y personas cuidadoras del territorio.",
      "En esta fase del MVP la plataforma solo publica materiales autorizados y fichas resumidas de campaña para facilitar el acceso sin comprometer la seguridad comunitaria.",
    ],
    startDate: "2025-09-12",
    visibility: "public",
    active: true,
    placements: ["home", "mjn", "biblioteca"],
    materials: [
      {
        id: "camp-escuelas-afiche",
        type: "Afiche",
        title: "Afiche de convocatoria",
        action: "download",
        url: "#",
      },
      {
        id: "camp-escuelas-cartilla",
        type: "Cartilla",
        title: "Cartilla base de cuidado",
        action: "download",
        url: "#",
      },
      {
        id: "camp-escuelas-video",
        type: "Video",
        title: "Video de apertura",
        action: "watch",
        url: "https://example.com/video-campana",
      },
    ],
  },
  {
    id: "camp-tejidos",
    slug: "tejidos-de-acompanamiento-seguro",
    title: "Tejidos de acompañamiento seguro",
    intro:
      "Campaña interna de circulación limitada para acompañar casos activos con materiales de apoyo y coordinación.",
    body: [
      "Esta campaña solo es visible para integrantes autenticados porque incluye orientaciones operativas de acompañamiento y rutas de articulación interna.",
      "El mockup la incluye para demostrar el comportamiento de visibilidad entre Home, MJN y el panel de gestión.",
    ],
    startDate: "2026-01-20",
    endDate: "2026-06-30",
    visibility: "internal",
    active: true,
    placements: ["home", "mjn"],
    materials: [
      {
        id: "camp-tejidos-guia",
        type: "Otro",
        title: "Guía interna de articulación",
        action: "download",
        url: "#",
      },
    ],
  },
  {
    id: "camp-inactiva",
    slug: "mapeo-de-memorias-del-litoral",
    title: "Mapeo de memorias del litoral",
    intro: "Campaña archivada para pruebas de visibilidad y estado.",
    body: ["No debería verse en Home ni en MJN porque está inactiva."],
    startDate: "2024-04-02",
    endDate: "2024-12-10",
    visibility: "public",
    active: false,
    placements: ["mjn"],
    materials: [],
  },
];

export const dashboards: DashboardRecord[] = [
  {
    id: "dash-biodiversidad-naya",
    slug: "biodiversidad-cuenca-naya",
    title: "Monitoreo de biodiversidad en la cuenca del Naya",
    description:
      "Resume coberturas, ecosistemas estratégicos y alertas de transformación para apoyar decisiones comunitarias.",
    topic: "Biodiversidad",
    territory: "Cuenca del Naya",
    period: "2020-2025",
    audience: "Público general",
    frequency: "Mensual",
    visibility: "public",
    status: "Activo",
    embedUrl: "https://app.powerbi.com/reportEmbed?reportId=demo-biodiversidad-naya",
  },
  {
    id: "dash-justicia-climatica",
    slug: "justicia-climatica-litoral-pacifico",
    title: "Indicadores de justicia climática en el litoral Pacífico",
    description:
      "Agrupa información pública útil para incidencia, seguimiento territorial y conversación con aliados.",
    topic: "Justicia climática",
    territory: "Litoral Pacífico",
    period: "2021-2024",
    audience: "Público general",
    frequency: "Trimestral",
    visibility: "public",
    status: "Activo",
    embedUrl: "https://app.powerbi.com/reportEmbed?reportId=demo-justicia-climatica",
  },
  {
    id: "dash-acc-interno",
    slug: "seguimiento-acc-priorizadas",
    title: "Seguimiento a ACCs priorizadas",
    description:
      "Tablero interno para revisar avances, articulaciones y estado de fichas de ACC sin mostrar datos geográficos sensibles.",
    topic: "ACCs",
    territory: "Cuenca del Naya, Bajo Baudó",
    period: "2024-2026",
    audience: "Equipo Palenke/Hileros",
    frequency: "Mensual",
    visibility: "internal",
    status: "En actualización",
    embedUrl: "https://app.powerbi.com/reportEmbed?reportId=demo-acc-interno",
  },
];

export const accs: AccRecord[] = [
  {
    id: "acc-naya",
    name: "ACC Manglares y esteros del Naya",
    nickname: "ACC Naya",
    council: "Consejo Comunitario del río Naya",
    basin: "Cuenca del Naya",
    municipalities: "López de Micay",
    departments: "Cauca",
    hectares: 12450,
    description:
      "Área priorizada por su relación entre manglar, bosque húmedo y pesca artesanal, articulada al gobierno propio.",
    inGeoportal: true,
    geoportalLayer: "ACC_Naya_Priorizada",
    linkedDashboardId: "dash-biodiversidad-naya",
    linkedDocumentIds: ["doc-reglamento-naya", "doc-etnodesarrollo-guapi"],
    linkedToMeta3030: true,
    visibility: "public",
  },
  {
    id: "acc-baudo",
    name: "ACC Bosques de transición del Bajo Baudó",
    council: "Consejo Comunitario del Bajo Baudó",
    basin: "Bajo Baudó",
    municipalities: "Bajo Baudó",
    departments: "Chocó",
    hectares: 9320,
    description:
      "Ficha interna priorizada para seguimiento técnico con énfasis en restauración y acuerdos de manejo.",
    inGeoportal: true,
    geoportalLayer: "ACC_Baudo_Seguimiento",
    linkedDashboardId: "dash-acc-interno",
    linkedDocumentIds: ["doc-manglar-baudó"],
    linkedToMeta3030: true,
    visibility: "internal",
  },
  {
    id: "acc-sanquianga",
    name: "ACC Corredor comunitario Sanquianga",
    council: "Red de Consejos Comunitarios del Sanquianga",
    basin: "Litoral Sanquianga",
    municipalities: "Olaya Herrera, Mosquera",
    departments: "Nariño",
    description:
      "Ficha pública de referencia para explicar vínculos entre conservación, pesca y justicia climática.",
    inGeoportal: false,
    linkedDocumentIds: ["doc-cartilla-cuidado"],
    linkedToMeta3030: false,
    visibility: "public",
  },
];

export const organizations = [
  "Coordinación Palenke",
  "Equipo SIG Hileros",
  "Comité MJN",
  "Equipo técnico",
] as const;

export const users: UserRecord[] = [
  {
    id: "user-maria",
    name: "María Torres",
    email: "maria@palenke.org",
    role: "Admin",
    organization: "Coordinación Palenke",
    isPrimaryAdmin: true,
    active: true,
    mustChangePassword: false,
    lastLoginAt: "2026-03-10T14:32:00Z",
  },
  {
    id: "user-carlos",
    name: "Carlos Riascos",
    email: "carlos@hileros.org",
    role: "Interno",
    organization: "Equipo SIG Hileros",
    isPrimaryAdmin: false,
    active: true,
    mustChangePassword: false,
    lastLoginAt: "2026-03-09T09:15:00Z",
  },
  {
    id: "user-ana",
    name: "Ana Perea",
    email: "ana@pcn.org",
    role: "Interno",
    organization: "Comité MJN",
    isPrimaryAdmin: false,
    active: false,
    mustChangePassword: false,
    lastLoginAt: "2026-02-12T11:00:00Z",
  },
  {
    id: "user-luz",
    name: "Luz Angulo",
    email: "luz@palenke.org",
    role: "Admin",
    organization: "Equipo técnico",
    isPrimaryAdmin: false,
    active: true,
    mustChangePassword: true,
    lastLoginAt: undefined, // never logged in
  },
];

export const recentActivity: ActivityRecord[] = [
  {
    id: "act-1",
    title: "Ruta de litigio y protección para defensoras del territorio",
    section: "Biblioteca",
    editedBy: "María Torres",
    editedAt: "10 Mar 2026",
    kind: "content",
  },
  {
    id: "act-user-1",
    title: "Luz Angulo — cuenta creada",
    section: "Usuarios",
    editedBy: "María Torres",
    editedAt: "09 Mar 2026",
    kind: "user_created",
  },
  {
    id: "act-2",
    title: "Seguimiento a ACCs priorizadas",
    section: "Dashboards",
    editedBy: "Luz Angulo",
    editedAt: "08 Mar 2026",
    kind: "content",
  },
  {
    id: "act-user-2",
    title: "Ana Perea — cuenta desactivada",
    section: "Usuarios",
    editedBy: "María Torres",
    editedAt: "07 Mar 2026",
    kind: "user_deactivated",
  },
  {
    id: "act-3",
    title: "ACC Bosques de transición del Bajo Baudó",
    section: "ACCs",
    editedBy: "Carlos Riascos",
    editedAt: "06 Mar 2026",
    kind: "content",
  },
  {
    id: "act-user-3",
    title: "Carlos Riascos — contraseña restablecida",
    section: "Usuarios",
    editedBy: "María Torres",
    editedAt: "04 Mar 2026",
    kind: "password_reset",
  },
  {
    id: "act-4",
    title: "Escuelas de cuidado territorial",
    section: "Campañas",
    editedBy: "Ana Perea",
    editedAt: "03 Mar 2026",
    kind: "content",
  },
  {
    id: "act-5",
    title: "Cartilla de cuidado colectivo para mujeres y jóvenes del territorio",
    section: "Biblioteca",
    editedBy: "María Torres",
    editedAt: "01 Mar 2026",
    kind: "content",
  },
];

export const homeIntro = [
  "El Palenke de Pensamiento y Cuidadores del Territorio es un espacio político, organizativo y de producción de conocimiento impulsado por el Proceso de Comunidades Negras (PCN) y articulado operativamente a través de la Corporación Agencia Afrocolombiana Hileros.",
  "Su propósito es fortalecer la autonomía territorial, el gobierno propio y la defensa integral de la vida en los territorios del Pueblo Negro, afrocolombiano, raizal y palenquero en Colombia.",
  "El Palenke surge como una apuesta colectiva para articular pensamiento, cuidado territorial y acción política, combinando saberes ancestrales, conocimiento comunitario y herramientas técnicas para proteger los territorios y garantizar la continuidad histórica de los pueblos afrodescendientes.",
  "Este espacio se construye desde la experiencia organizativa del PCN, movimiento social que desde 1993 articula organizaciones, consejos comunitarios y procesos territoriales en defensa de los derechos colectivos, la dignidad y la autonomía del Pueblo Negro.",
  "El Palenke no sustituye las estructuras organizativas del PCN ni de los Consejos Comunitarios. Por el contrario, funciona como un espacio de articulación estratégica que fortalece los procesos de gobierno propio y autonomía territorial del Pueblo Negro.",
];

export const mjnContext = [
  "La agenda de Mujeres, Juventudes y Niñez reúne documentos, materiales pedagógicos, campañas y piezas de memoria que fortalecen el liderazgo comunitario y el cuidado del territorio.",
  "El bloque editorial debe poder actualizarse desde el panel administrativo, permitiendo contextualizar prioridades políticas, procesos organizativos y llamados públicos a la acción.",
  "Las piezas de memoria solo aparecen cuando existe autorización y cuando su publicación no compromete la seguridad de las personas involucradas.",
];

export const mjnQuote =
  "La memoria, el cuidado y la organización también son infraestructura política del territorio.";

const DEFAULT_GEOPORTAL_URL = "https://example.com/geoportal";

function resolveGeoportalUrl() {
  const candidate = process.env.NEXT_PUBLIC_GEOPORTAL_URL?.trim();

  if (!candidate) {
    return DEFAULT_GEOPORTAL_URL;
  }

  try {
    const parsed = new URL(candidate);
    if (parsed.protocol === "https:" || parsed.protocol === "http:") {
      return parsed.toString();
    }
  } catch {
    // Fallback to default when env value is not a valid URL.
  }

  return DEFAULT_GEOPORTAL_URL;
}

export const geoportalCopy = {
  title: "Geoportal territorial - Hileros/PCN",
  description:
    "Acceso controlado al geoportal administrado por el equipo SIG. El MVP no almacena datos espaciales dentro de la plataforma: solo orienta y enlaza al sistema fuente.",
  layers: ["ACCs priorizadas", "Maritorios", "Ecosistemas estratégicos", "Asentamientos generales"],
  url: resolveGeoportalUrl(),
};

export const policyItems = [
  "Responsable del tratamiento: Palenke de Pensamiento y Cuidadores del Territorio / PCN.",
  "Datos recopilados: nombre, correo electrónico y metadatos mínimos para gestionar cuentas autenticadas.",
  "Finalidad: habilitar el acceso a contenidos internos y la administración de la plataforma.",
  "Derechos del titular: acceso, corrección, actualización y supresión de datos personales.",
  "Canal de contacto: datos@palenke.org para solicitudes relacionadas con tratamiento y privacidad.",
  "Fecha de vigencia de este mockup: 11 de marzo de 2026.",
];

export const adminQuickStats = [
  { label: "Documentos", value: documents.length.toString() },
  { label: "Dashboards", value: dashboards.length.toString() },
  { label: "ACCs", value: accs.length.toString() },
  { label: "Usuarios", value: `${users.length} / ${USER_LIMIT}` },
];

export function getVisibleDocuments(role: ViewerRole) {
  return documents.filter((document) => {
    if (document.visibility === "sensitive") {
      return false;
    }
    if (document.visibility === "internal") {
      return role !== "public";
    }
    return true;
  });
}

export function getVisibleDashboards(role: ViewerRole) {
  return dashboards.filter((dashboard) => {
    if (dashboard.visibility === "internal") {
      return role !== "public";
    }
    return true;
  });
}

export function getVisibleCampaigns(
  role: ViewerRole,
  placement: "home" | "mjn" | "biblioteca",
) {
  return campaigns.filter((campaign) => {
    if (!campaign.active) {
      return false;
    }
    const matchesPlacement =
      campaign.placements.includes(placement) || campaign.placements.includes("all");

    if (!matchesPlacement) {
      return false;
    }
    if (campaign.visibility === "internal") {
      return role !== "public";
    }
    return true;
  });
}

export function getVisibleMjnDocuments(role: ViewerRole) {
  return getVisibleDocuments(role).filter(
    (document) => document.genderFocus || document.mjnTags.length > 0,
  );
}

export function getVisibleMjnStories(role: ViewerRole) {
  return mjnStories.filter((story) => {
    if (!story.publicationAuthorized) {
      return false;
    }
    if (story.visibility === "internal") {
      return role !== "public";
    }
    return true;
  });
}

export function findDocumentBySlug(slug: string) {
  return documents.find((document) => document.slug === slug);
}

export function findDashboardBySlug(slug: string) {
  return dashboards.find((dashboard) => dashboard.slug === slug);
}

export function findCampaignBySlug(slug: string) {
  return campaigns.find((campaign) => campaign.slug === slug);
}

export function findAccById(id: string) {
  return accs.find((acc) => acc.id === id);
}

export function findUserById(id: string) {
  return users.find((user) => user.id === id);
}

export function formatLastLogin(lastLoginAt: string | undefined): string {
  if (!lastLoginAt) return "Nunca";
  const date = new Date(lastLoginAt);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Hoy";
  if (diffDays === 1) return "Ayer";
  if (diffDays < 7) return `Hace ${diffDays} días`;
  return Intl.DateTimeFormat("es-CO", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}
