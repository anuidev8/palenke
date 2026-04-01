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
  imageUrl?: string;
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
  "Normativa vigente",
  "Memoria viva del territorio",
  "Gobierno Propio",
  "Planes de uso y manejo",
  "Planes de etnodesarrollo",
  "Rutas de litigio estratégico",
  "Producción técnica/política",
  "Material pedagógico/comunitario",
] as const;

export const territories = [
  "Nacional",
  "Internacional",
  "Chocó",
  "Cuenca del Naya",
  "Bajo Baudó",
  "Guapi",
  "Litoral Sanquianga",
  "Tumaco",
] as const;

export const instrumentTypes = [
  "Constitución",
  "Ley",
  "Decreto",
  "Jurisprudencia",
  "Instrumento internacional",
  "Política pública",
  "Instancia oficial",
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

type NormaDocSeed = {
  id: string;
  slug: string;
  title: string;
  type: string;
  description: string;
  territory?: string;
  council: string;
  department?: string;
  municipality?: string;
  year: number;
  validity?: string;
  keywords: string[];
  fileLabel?: string;
  url?: string;
  sourceUrl?: string;
  imageUrl?: string;
};

// ─── SharePoint internal documents URL helper ────────────────────────────────
// Builds a SharePoint OneDrive viewer URL for files under INF. INTERNA
const _SP_INTERNA =
  "https://hileros-my.sharepoint.com/personal/fconu_renacientes_org/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Ffconu%5Frenacientes%5Forg%2FDocuments%2FARCHIVO%2F2026%2FINFORMACION%20PAGINA%20WEB%2FINF%2E%20INTERNA%2F";

function spInternalUrl(relPath: string): string {
  return (
    _SP_INTERNA +
    relPath
      .split("/")
      .map((s) =>
        s
          .replace(/ /g, "%20")
          .replace(/\(/g, "%28")
          .replace(/\)/g, "%29")
          .replace(/Á/g, "%C3%81")
          .replace(/É/g, "%C3%89")
          .replace(/Ó/g, "%C3%93")
          .replace(/Ú/g, "%C3%9A")
          .replace(/á/g, "%C3%A1")
          .replace(/é/g, "%C3%A9")
          .replace(/ó/g, "%C3%B3")
          .replace(/í/g, "%C3%AD")
          .replace(/Í/g, "%C3%8D")
      )
      .join("%2F")
  );
}

const constitution1991Url =
  "https://www1.funcionpublica.gov.co/documents/418537/37742455/constitucion-politica-de-colombia-91.pdf/10e1ba89-82ef-4c36-543d-447d99a6a17d";
const senateLawUrl = (number: number, year: number) =>
  `http://www.secretariasenado.gov.co/senado/basedoc/ley_${String(number).padStart(4, "0")}_${year}.html`;
const senateDecreeUrl = (number: number, year: number) =>
  `http://www.secretariasenado.gov.co/senado/basedoc/decreto_${String(number).padStart(4, "0")}_${year}.html`;
const conpesHomeUrl = "https://www.dnp.gov.co/conpes";
const pnd2026Url = "https://www.dnp.gov.co/plan-nacional-desarrollo/pnd-2022-2026";
const afroAffairsUrl =
  "https://www.mininterior.gov.co/direccion-de-asuntos-para-comunidades-negras-afrocolombianas-raizales-y-palenqueras/";
const ley70LocalPdfUrl = "/docs/normativa/Ley_70_de_1993.pdf";
const decreto1396LocalPdfUrl = "/docs/normativa/Decreto_1396_de_2023.pdf";
const decreto129LocalPdfUrl = "/docs/normativa/Decreto_129_de_2024.pdf";

function createNormaDoc({
  territory = "Nacional",
  department,
  municipality,
  validity = "Vigente",
  fileLabel = "Ver recurso",
  url = "#",
  ...seed
}: NormaDocSeed): DocumentRecord {
  const isInternational = territory === "Internacional";

  return {
    section: "Normativa vigente",
    validity,
    visibility: "public",
    genderFocus: false,
    mjnTags: [],
    action: "external",
    territory,
    department: department ?? (isInternational ? "Internacional" : "Nacional"),
    municipality: municipality ?? (isInternational ? "Ginebra" : "Bogotá"),
    fileLabel,
    url,
    ...seed,
  };
}

const normaVigenteDocuments: DocumentRecord[] = [
  createNormaDoc({
    id: "norma-constitucion-1991",
    slug: "constitucion-politica-colombia-1991",
    title: "Constitución Política de 1991",
    type: "Constitución",
    description:
      "Base estructural del pluralismo, la diversidad étnica y cultural, la protección del patrimonio y el reconocimiento constitucional de los derechos colectivos.",
    council: "Asamblea Nacional Constituyente",
    year: 1991,
    keywords: ["Constitución Política", "1991", "pluralismo", "diversidad étnica"],
    fileLabel: "Ver PDF constitucional",
    url: constitution1991Url,
    sourceUrl: constitution1991Url,
  }),
  createNormaDoc({
    id: "norma-constitucion-articulo-1",
    slug: "constitucion-politica-articulo-1-estado-social-derecho",
    title: "Constitución Política de 1991 — Artículo 1",
    type: "Constitución",
    description:
      "Consagra a Colombia como Estado social de derecho, democrático, participativo y pluralista.",
    council: "Asamblea Nacional Constituyente",
    year: 1991,
    keywords: ["Artículo 1", "Estado social de derecho", "pluralismo", "Constitución Política"],
    fileLabel: "Ver PDF constitucional",
    url: constitution1991Url,
    sourceUrl: constitution1991Url,
  }),
  createNormaDoc({
    id: "norma-constitucion-articulo-7",
    slug: "constitucion-politica-articulo-7-diversidad-etnica-cultural",
    title: "Constitución Política de 1991 — Artículo 7",
    type: "Constitución",
    description:
      "Reconoce y protege la diversidad étnica y cultural de la Nación colombiana.",
    council: "Asamblea Nacional Constituyente",
    year: 1991,
    keywords: ["Artículo 7", "diversidad étnica", "diversidad cultural", "Constitución Política"],
    fileLabel: "Ver PDF constitucional",
    url: constitution1991Url,
    sourceUrl: constitution1991Url,
  }),
  createNormaDoc({
    id: "norma-constitucion-articulo-8",
    slug: "constitucion-politica-articulo-8-riqueza-cultural-natural",
    title: "Constitución Política de 1991 — Artículo 8",
    type: "Constitución",
    description:
      "Establece la obligación del Estado y de las personas de proteger las riquezas culturales y naturales de la Nación.",
    council: "Asamblea Nacional Constituyente",
    year: 1991,
    keywords: ["Artículo 8", "riqueza cultural", "riqueza natural", "Constitución Política"],
    fileLabel: "Ver PDF constitucional",
    url: constitution1991Url,
    sourceUrl: constitution1991Url,
  }),
  createNormaDoc({
    id: "norma-constitucion-articulo-63",
    slug: "constitucion-politica-articulo-63-tierras-comunales",
    title: "Constitución Política de 1991 — Artículo 63",
    type: "Constitución",
    description:
      "Protege la inalienabilidad, imprescriptibilidad e inembargabilidad de las tierras comunales y de otros bienes de uso público.",
    council: "Asamblea Nacional Constituyente",
    year: 1991,
    keywords: ["Artículo 63", "tierras comunales", "inalienabilidad", "Constitución Política"],
    fileLabel: "Ver PDF constitucional",
    url: constitution1991Url,
    sourceUrl: constitution1991Url,
  }),
  createNormaDoc({
    id: "norma-constitucion-articulo-70",
    slug: "constitucion-politica-articulo-70-cultura-fundamento-nacion",
    title: "Constitución Política de 1991 — Artículo 70",
    type: "Constitución",
    description:
      "Reconoce la cultura como fundamento de la nacionalidad y ordena promover el acceso en igualdad de oportunidades.",
    council: "Asamblea Nacional Constituyente",
    year: 1991,
    keywords: ["Artículo 70", "cultura", "fundamento de la nación", "Constitución Política"],
    fileLabel: "Ver PDF constitucional",
    url: constitution1991Url,
    sourceUrl: constitution1991Url,
  }),
  createNormaDoc({
    id: "norma-constitucion-articulo-72",
    slug: "constitucion-politica-articulo-72-patrimonio-cultural",
    title: "Constitución Política de 1991 — Artículo 72",
    type: "Constitución",
    description:
      "Declara el patrimonio cultural de la Nación bajo protección del Estado y regula su salvaguarda.",
    council: "Asamblea Nacional Constituyente",
    year: 1991,
    keywords: ["Artículo 72", "patrimonio cultural", "salvaguarda", "Constitución Política"],
    fileLabel: "Ver PDF constitucional",
    url: constitution1991Url,
    sourceUrl: constitution1991Url,
  }),
  createNormaDoc({
    id: "norma-constitucion-articulo-329",
    slug: "constitucion-politica-articulo-329-territorios-etnicos",
    title: "Constitución Política de 1991 — Artículo 329",
    type: "Constitución",
    description:
      "Regula territorios étnicos y sirve como referente comparado para la protección de autonomías territoriales de comunidades negras.",
    council: "Asamblea Nacional Constituyente",
    year: 1991,
    keywords: ["Artículo 329", "territorios étnicos", "autonomía territorial", "Constitución Política"],
    fileLabel: "Ver PDF constitucional",
    url: constitution1991Url,
    sourceUrl: constitution1991Url,
  }),
  createNormaDoc({
    id: "norma-constitucion-transitorio-55",
    slug: "constitucion-politica-articulo-transitorio-55",
    title: "Constitución Política de 1991 — Artículo Transitorio 55",
    type: "Constitución",
    description:
      "Mandato constitucional que dio origen al desarrollo legislativo de la Ley 70 de 1993 para comunidades negras.",
    council: "Asamblea Nacional Constituyente",
    year: 1991,
    keywords: ["Artículo Transitorio 55", "Ley 70", "comunidades negras", "Constitución Política"],
    fileLabel: "Ver PDF constitucional",
    url: constitution1991Url,
    sourceUrl: constitution1991Url,
  }),
  createNormaDoc({
    id: "norma-ley70",
    slug: "ley-70-1993-comunidades-negras",
    title: "Ley 70 de 1993 — Comunidades Negras",
    type: "Ley",
    description:
      "Norma central que reconoce los derechos territoriales, la identidad, la participación y el desarrollo propio de las comunidades negras en Colombia.",
    council: "Congreso de Colombia",
    year: 1993,
    keywords: ["Ley 70", "comunidades negras", "territorio colectivo", "1993"],
    fileLabel: "Descargar PDF",
    url: ley70LocalPdfUrl,
    sourceUrl: senateLawUrl(70, 1993),
  }),
  createNormaDoc({
    id: "norma-decreto-1396-2023",
    slug: "decreto-1396-2023",
    title: "Decreto 1396 de 2023",
    type: "Decreto",
    description:
      "Reglamenta el Capítulo V de la Ley 70 de 1993 y adopta mecanismos especiales para el fomento y desarrollo de actividades mineras en territorios colectivos afrodescendientes.",
    council: "Presidencia de la República",
    year: 2023,
    keywords: ["Decreto 1396", "minería", "Ley 70", "2023"],
    fileLabel: "Descargar PDF",
    url: decreto1396LocalPdfUrl,
    sourceUrl: senateDecreeUrl(1396, 2023),
  }),
  createNormaDoc({
    id: "norma-decreto-129-2024",
    slug: "decreto-129-2024",
    title: "Decreto 0129 de 2024",
    type: "Decreto",
    description:
      "Reglamenta los procedimientos de ampliación y saneamiento de tierras de comunidades negras y adopta mecanismos para la protección jurídica de territorios ocupados ancestral y tradicionalmente.",
    council: "Presidencia de la República",
    year: 2024,
    keywords: ["Decreto 0129", "ampliación", "saneamiento", "territorio"],
    fileLabel: "Descargar PDF",
    url: decreto129LocalPdfUrl,
    sourceUrl: senateDecreeUrl(129, 2024),
  }),
  createNormaDoc({
    id: "norma-ley21",
    slug: "ley-21-1991-convenio-169-oit",
    title: "Ley 21 de 1991 — Incorporación del Convenio 169 de la OIT",
    type: "Ley",
    description:
      "Incorpora al ordenamiento colombiano el Convenio 169 de la OIT sobre pueblos indígenas y tribales, incluyendo consulta previa, territorio y autonomía.",
    council: "Congreso de Colombia",
    year: 1991,
    keywords: ["Ley 21", "Convenio 169", "consulta previa", "autonomía"],
    fileLabel: "Ver en Senado",
    url: senateLawUrl(21, 1991),
    sourceUrl: senateLawUrl(21, 1991),
  }),
  createNormaDoc({
    id: "norma-ley99",
    slug: "ley-99-1993-sistema-nacional-ambiental",
    title: "Ley 99 de 1993 — Sistema Nacional Ambiental",
    type: "Ley",
    description:
      "Organiza el Sistema Nacional Ambiental y reconoce la participación de comunidades étnicas en la gestión y protección ambiental.",
    council: "Congreso de Colombia",
    year: 1993,
    keywords: ["Ley 99", "SINA", "participación ambiental", "normativa complementaria"],
    fileLabel: "Ver en Senado",
    url: senateLawUrl(99, 1993),
    sourceUrl: senateLawUrl(99, 1993),
  }),
  createNormaDoc({
    id: "norma-ley397",
    slug: "ley-397-1997-ley-general-cultura",
    title: "Ley 397 de 1997 — Ley General de Cultura",
    type: "Ley",
    description:
      "Define la política cultural del Estado y la protección del patrimonio cultural material e inmaterial.",
    council: "Congreso de Colombia",
    year: 1997,
    keywords: ["Ley 397", "cultura", "patrimonio cultural", "1997"],
    fileLabel: "Ver en Senado",
    url: senateLawUrl(397, 1997),
    sourceUrl: senateLawUrl(397, 1997),
  }),
  createNormaDoc({
    id: "norma-ley1448",
    slug: "ley-1448-2011-victimas-restitucion-tierras",
    title: "Ley 1448 de 2011 — Ley de Víctimas y Restitución de Tierras",
    type: "Ley",
    description:
      "Establece medidas de atención, asistencia y reparación integral a víctimas del conflicto armado, con desarrollos diferenciales para comunidades negras.",
    council: "Congreso de Colombia",
    year: 2011,
    keywords: ["Ley 1448", "víctimas", "restitución de tierras", "reparación"],
    fileLabel: "Ver en Senado",
    url: senateLawUrl(1448, 2011),
    sourceUrl: senateLawUrl(1448, 2011),
  }),
  createNormaDoc({
    id: "norma-ley1454",
    slug: "ley-1454-2011-ordenamiento-territorial",
    title: "Ley 1454 de 2011 — Ordenamiento Territorial",
    type: "Ley",
    description:
      "Fija principios de ordenamiento territorial y articulación entre entidades territoriales, relevante para la planeación y gobernanza étnica.",
    council: "Congreso de Colombia",
    year: 2011,
    keywords: ["Ley 1454", "ordenamiento territorial", "gobernanza", "normativa complementaria"],
    fileLabel: "Ver en Senado",
    url: senateLawUrl(1454, 2011),
    sourceUrl: senateLawUrl(1454, 2011),
  }),
  createNormaDoc({
    id: "norma-decreto1745",
    slug: "decreto-1745-1995-territorios-colectivos",
    title: "Decreto 1745 de 1995 — Territorios colectivos y Consejos Comunitarios",
    type: "Decreto",
    description:
      "Reglamenta el Capítulo III de la Ley 70 de 1993 sobre el reconocimiento del derecho a la propiedad colectiva de las Comunidades Negras y sus Consejos Comunitarios.",
    council: "Presidencia de la República",
    year: 1995,
    keywords: ["Decreto 1745", "territorios colectivos", "Consejos Comunitarios", "1995"],
    fileLabel: "Ver en Senado",
    url: senateDecreeUrl(1745, 1995),
    sourceUrl: senateDecreeUrl(1745, 1995),
  }),
  createNormaDoc({
    id: "norma-decreto2248",
    slug: "decreto-2248-1995-comision-consultiva-alto-nivel",
    title: "Decreto 2248 de 1995 — Comisión Consultiva de Alto Nivel",
    type: "Decreto",
    description:
      "Reglamentó la Comisión Consultiva de Alto Nivel para las Comunidades Negras, hoy de valor histórico dentro de la evolución institucional afrocolombiana.",
    council: "Presidencia de la República",
    year: 1995,
    validity: "Histórico",
    keywords: ["Decreto 2248", "Comisión Consultiva", "comunidades negras", "1995"],
    fileLabel: "Ver en Senado",
    url: senateDecreeUrl(2248, 1995),
    sourceUrl: senateDecreeUrl(2248, 1995),
  }),
  createNormaDoc({
    id: "norma-decreto3770",
    slug: "decreto-3770-2008-comision-consultiva-reglamentacion",
    title: "Decreto 3770 de 2008 — Reglamentación de la Comisión Consultiva",
    type: "Decreto",
    description:
      "Reglamentó la Comisión Consultiva de Alto Nivel y el registro de Consejos Comunitarios y organizaciones afrocolombianas; hoy funciona como antecedente normativo.",
    council: "Presidencia de la República",
    year: 2008,
    validity: "Histórico",
    keywords: ["Decreto 3770", "Comisión Consultiva", "Consejos Comunitarios", "registro"],
    fileLabel: "Ver en Senado",
    url: senateDecreeUrl(3770, 2008),
    sourceUrl: senateDecreeUrl(3770, 2008),
  }),
  createNormaDoc({
    id: "norma-decreto4635",
    slug: "decreto-4635-2011-victimas-comunidades-negras",
    title: "Decreto 4635 de 2011 — Víctimas para comunidades negras",
    type: "Decreto",
    description:
      "Dicta medidas de asistencia, atención, reparación integral y restitución de derechos territoriales para víctimas pertenecientes a comunidades negras.",
    council: "Presidencia de la República",
    year: 2011,
    keywords: ["Decreto 4635", "víctimas", "comunidades negras", "reparación integral"],
    fileLabel: "Ver en Senado",
    url: senateDecreeUrl(4635, 2011),
    sourceUrl: senateDecreeUrl(4635, 2011),
  }),
  createNormaDoc({
    id: "norma-decreto2163",
    slug: "decreto-2163-2012-comision-consultiva-tierras",
    title: "Decreto 2163 de 2012 — Comisión Consultiva de Alto Nivel",
    type: "Decreto",
    description:
      "Conforma y reglamenta la Comisión Consultiva de Alto Nivel de Comunidades Negras, Raizales y Palenqueras. Dejado sin efecto en parte por la Sentencia T-576 de 2014 de la Corte Constitucional.",
    council: "Presidencia de la República",
    year: 2012,
    keywords: ["Decreto 2163", "Comisión Consultiva", "comunidades negras", "raizales"],
    fileLabel: "Ver en Función Pública",
    url: "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=50073",
    sourceUrl: "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=50073",
  }),
  createNormaDoc({
    id: "norma-decreto2613",
    slug: "decreto-2613-2013-espacios-participacion",
    title: "Decreto 2613 de 2013 — Espacios de participación",
    type: "Decreto",
    description:
      "Fortalece la participación y la interlocución institucional con comunidades negras, afrocolombianas, raizales y palenqueras.",
    council: "Presidencia de la República",
    year: 2013,
    keywords: ["Decreto 2613", "participación", "interlocución", "comunidades negras"],
    fileLabel: "Ver en Senado",
    url: senateDecreeUrl(2613, 2013),
    sourceUrl: senateDecreeUrl(2613, 2013),
  }),
  createNormaDoc({
    id: "norma-decreto1953",
    slug: "decreto-1953-2014-regimen-especial-indigena",
    title: "Decreto 1953 de 2014 — Régimen especial indígena",
    type: "Decreto",
    description:
      "Desarrolla un régimen especial para pueblos indígenas y funciona como referente comparado útil para el fortalecimiento de autonomías étnicas.",
    council: "Presidencia de la República",
    year: 2014,
    keywords: ["Decreto 1953", "régimen especial indígena", "referente comparado", "autonomía"],
    fileLabel: "Ver en Senado",
    url: senateDecreeUrl(1953, 2014),
    sourceUrl: senateDecreeUrl(1953, 2014),
  }),
  createNormaDoc({
    id: "norma-decreto1384",
    slug: "decreto-1384-2023-areas-protegidas-etnicas",
    title: "Decreto 1384 de 2023 — Áreas protegidas de carácter étnico",
    type: "Decreto",
    description:
      "Reglamenta el capítulo ambiental de la Ley 70 de 1993 en relación con recursos naturales renovables y ambiente en territorios colectivos afrodescendientes.",
    council: "Presidencia de la República",
    year: 2023,
    keywords: ["Decreto 1384", "ambiente", "Ley 70", "conservación"],
    fileLabel: "Ver en Función Pública",
    url: "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=217070",
    sourceUrl: "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=217070",
  }),
  createNormaDoc({
    id: "norma-decreto2811",
    slug: "decreto-2811-1974-codigo-recursos-naturales",
    title: "Decreto 2811 de 1974 — Código de Recursos Naturales",
    type: "Decreto",
    description:
      "Código Nacional de Recursos Naturales Renovables y de Protección al Medio Ambiente, referente complementario para gobernanza ambiental.",
    council: "Presidencia de la República",
    year: 1974,
    keywords: ["Decreto 2811", "Código de Recursos Naturales", "ambiente", "normativa complementaria"],
    fileLabel: "Ver en Senado",
    url: senateDecreeUrl(2811, 1974),
    sourceUrl: senateDecreeUrl(2811, 1974),
  }),
  createNormaDoc({
    id: "norma-t422",
    slug: "sentencia-t422-1996-comunidades-negras-grupo-etnico",
    title: "Sentencia T-422 de 1996 — Reconocimiento de comunidades negras como grupo étnico",
    type: "Jurisprudencia",
    description:
      "Reconoció a las comunidades negras como grupo étnico sujeto de protección constitucional reforzada y de medidas de diferenciación positiva.",
    council: "Corte Constitucional de Colombia",
    year: 1996,
    keywords: ["T-422", "grupo étnico", "comunidades negras", "diferenciación positiva"],
    fileLabel: "Ver en Corte Constitucional",
    url: "https://www.corteconstitucional.gov.co/relatoria/1996/T-422-96.htm",
    sourceUrl: "https://www.corteconstitucional.gov.co/relatoria/1996/T-422-96.htm",
  }),
  createNormaDoc({
    id: "norma-su039",
    slug: "sentencia-su039-1997-consulta-previa",
    title: "Sentencia SU-039 de 1997 — Consulta previa",
    type: "Jurisprudencia",
    description:
      "Sentencia de unificación que consolidó la consulta previa como derecho fundamental y regla de participación para decisiones que afectan pueblos étnicos.",
    council: "Corte Constitucional de Colombia",
    year: 1997,
    keywords: ["SU-039", "consulta previa", "participación", "derecho fundamental"],
    fileLabel: "Ver en Corte Constitucional",
    url: "https://www.corteconstitucional.gov.co/relatoria/1997/su039-97.htm",
    sourceUrl: "https://www.corteconstitucional.gov.co/relatoria/1997/su039-97.htm",
  }),
  createNormaDoc({
    id: "norma-c169",
    slug: "sentencia-c169-2001-alcance-ley-70",
    title: "Sentencia C-169 de 2001 — Alcance de la Ley 70 y la consulta",
    type: "Jurisprudencia",
    description:
      "Precisó el alcance constitucional del Convenio 169 y desarrolló criterios sobre consulta previa y participación de comunidades étnicas.",
    council: "Corte Constitucional de Colombia",
    year: 2001,
    keywords: ["C-169", "Ley 70", "consulta previa", "Convenio 169"],
    fileLabel: "Ver en Corte Constitucional",
    url: "https://www.corteconstitucional.gov.co/relatoria/2001/c-169-01.htm",
    sourceUrl: "https://www.corteconstitucional.gov.co/relatoria/2001/c-169-01.htm",
  }),
  createNormaDoc({
    id: "norma-t955",
    slug: "sentencia-t955-2003-proteccion-territorio-colectivo",
    title: "Sentencia T-955 de 2003 — Protección del territorio colectivo",
    type: "Jurisprudencia",
    description:
      "Reforzó la protección del territorio colectivo afrodescendiente y de los Consejos Comunitarios frente a amenazas sobre su subsistencia e integridad.",
    territory: "Chocó",
    department: "Chocó",
    municipality: "Riosucio",
    council: "Corte Constitucional de Colombia",
    year: 2003,
    keywords: ["T-955", "territorio colectivo", "Cacarica", "Consejo Comunitario"],
    fileLabel: "Ver en Corte Constitucional",
    url: "https://www.corteconstitucional.gov.co/relatoria/2003/T-955-03.htm",
    sourceUrl: "https://www.corteconstitucional.gov.co/relatoria/2003/T-955-03.htm",
  }),
  createNormaDoc({
    id: "norma-c461",
    slug: "sentencia-c461-2008-consulta-previa-obligatoria",
    title: "Sentencia C-461 de 2008 — Consulta previa obligatoria",
    type: "Jurisprudencia",
    description:
      "Reiteró la obligatoriedad de la consulta previa para medidas legislativas o administrativas susceptibles de afectar directamente a pueblos étnicos.",
    council: "Corte Constitucional de Colombia",
    year: 2008,
    keywords: ["C-461", "consulta previa", "medidas legislativas", "afectación directa"],
    fileLabel: "Ver en Corte Constitucional",
    url: "https://www.corteconstitucional.gov.co/relatoria/2008/c-461-08.htm",
    sourceUrl: "https://www.corteconstitucional.gov.co/relatoria/2008/c-461-08.htm",
  }),
  createNormaDoc({
    id: "norma-auto005",
    slug: "auto-005-2009-proteccion-comunidades-negras-conflicto-armado",
    title: "Auto 005 de 2009 — Protección de comunidades negras en conflicto armado",
    type: "Jurisprudencia",
    description:
      "Ordenó medidas específicas de protección para comunidades negras afectadas desproporcionadamente por el conflicto armado y el desplazamiento forzado.",
    council: "Corte Constitucional de Colombia",
    year: 2009,
    keywords: ["Auto 005", "conflicto armado", "desplazamiento", "comunidades negras"],
    fileLabel: "Ver en Corte Constitucional",
    url: "https://www.corteconstitucional.gov.co/relatoria/autos/2009/a005-09.htm",
    sourceUrl: "https://www.corteconstitucional.gov.co/relatoria/autos/2009/a005-09.htm",
  }),
  createNormaDoc({
    id: "norma-t129",
    slug: "sentencia-t129-2011-consulta-previa-territorio",
    title: "Sentencia T-129 de 2011 — Consulta previa y territorio",
    type: "Jurisprudencia",
    description:
      "Desarrolló reglas sobre consulta previa, consentimiento libre e informado y protección del territorio frente a proyectos de alto impacto.",
    council: "Corte Constitucional de Colombia",
    year: 2011,
    keywords: ["T-129", "consulta previa", "consentimiento", "territorio"],
    fileLabel: "Ver en Corte Constitucional",
    url: "https://www.corteconstitucional.gov.co/relatoria/2011/t-129-11.htm",
    sourceUrl: "https://www.corteconstitucional.gov.co/relatoria/2011/t-129-11.htm",
  }),
  createNormaDoc({
    id: "norma-t376",
    slug: "sentencia-t376-2012-derechos-territoriales",
    title: "Sentencia T-376 de 2012 — Derechos territoriales",
    type: "Jurisprudencia",
    description:
      "Profundizó la protección de los derechos territoriales y de participación de comunidades afrodescendientes afectadas por decisiones sobre su espacio vital.",
    territory: "Nacional",
    department: "Bolívar",
    municipality: "Cartagena",
    council: "Corte Constitucional de Colombia",
    year: 2012,
    keywords: ["T-376", "derechos territoriales", "participación", "comunidades afrodescendientes"],
    fileLabel: "Ver en Corte Constitucional",
    url: "https://www.corteconstitucional.gov.co/relatoria/2012/t-376-12.htm",
    sourceUrl: "https://www.corteconstitucional.gov.co/relatoria/2012/t-376-12.htm",
  }),
  createNormaDoc({
    id: "norma-t622",
    slug: "sentencia-t622-2016-rio-atrato",
    title: "Sentencia T-622 de 2016 — Río Atrato como sujeto de derechos",
    type: "Jurisprudencia",
    description:
      "Decisión histórica de la Corte Constitucional que reconoció al Río Atrato como sujeto de derechos y ordenó medidas de protección de los territorios afrodescendientes.",
    territory: "Chocó",
    department: "Chocó",
    municipality: "Quibdó",
    council: "Corte Constitucional de Colombia",
    year: 2016,
    keywords: ["T-622", "Río Atrato", "sujeto de derechos", "2016"],
    fileLabel: "Ver en Corte Constitucional",
    url: "https://www.corteconstitucional.gov.co/relatoria/2016/T-622-16.htm",
    sourceUrl: "https://www.corteconstitucional.gov.co/relatoria/2016/T-622-16.htm",
  }),
  createNormaDoc({
    id: "norma-convenio169",
    slug: "convenio-169-oit-pueblos-indigenas-tribales",
    title: "Convenio 169 de la OIT — Pueblos Indígenas y Tribales",
    type: "Instrumento internacional",
    description:
      "Convenio internacional que reconoce el derecho a territorio, consulta previa y autonomía de pueblos indígenas y tribales, incorporado en Colombia por la Ley 21 de 1991.",
    territory: "Internacional",
    council: "Organización Internacional del Trabajo",
    municipality: "Ginebra",
    year: 1989,
    keywords: ["Convenio 169", "OIT", "consulta previa", "pueblos tribales"],
    fileLabel: "Ver en OIT",
    url: "https://www.ilo.org/dyn/normlex/es/f?p=NORMLEXPUB:12100:0::NO::P12100_ILO_CODE:C169",
    sourceUrl: "https://www.ilo.org/dyn/normlex/es/f?p=NORMLEXPUB:12100:0::NO::P12100_ILO_CODE:C169",
  }),
  createNormaDoc({
    id: "norma-declaracion-ddhh",
    slug: "declaracion-universal-derechos-humanos",
    title: "Declaración Universal de Derechos Humanos",
    type: "Instrumento internacional",
    description:
      "Instrumento fundacional del sistema internacional de derechos humanos, referente general para igualdad, dignidad y no discriminación.",
    territory: "Internacional",
    council: "Naciones Unidas",
    municipality: "Nueva York",
    year: 1948,
    keywords: ["DUDH", "derechos humanos", "igualdad", "no discriminación"],
    fileLabel: "Ver en ONU",
    url: "https://www.un.org/es/about-us/universal-declaration-of-human-rights",
  }),
  createNormaDoc({
    id: "norma-pidcp",
    slug: "pacto-internacional-derechos-civiles-politicos",
    title: "Pacto Internacional de Derechos Civiles y Políticos",
    type: "Instrumento internacional",
    description:
      "Pacto que protege libertades civiles, participación política y garantías frente a discriminación y arbitrariedad estatal.",
    territory: "Internacional",
    council: "Naciones Unidas / OHCHR",
    municipality: "Ginebra",
    year: 1966,
    keywords: ["PIDCP", "derechos civiles", "derechos políticos", "participación"],
    fileLabel: "Ver en OHCHR",
    url: "https://www.ohchr.org/en/instruments-mechanisms/instruments/international-covenant-civil-and-political-rights",
  }),
  createNormaDoc({
    id: "norma-pidesc",
    slug: "pacto-internacional-derechos-economicos-sociales-culturales",
    title: "Pacto Internacional de Derechos Económicos, Sociales y Culturales",
    type: "Instrumento internacional",
    description:
      "Reconoce derechos económicos, sociales y culturales, relevantes para territorio, cultura, educación y bienestar comunitario.",
    territory: "Internacional",
    council: "Naciones Unidas / OHCHR",
    municipality: "Ginebra",
    year: 1966,
    keywords: ["PIDESC", "derechos económicos", "derechos culturales", "territorio"],
    fileLabel: "Ver en OHCHR",
    url: "https://www.ohchr.org/en/instruments-mechanisms/instruments/international-covenant-economic-social-and-cultural-rights",
  }),
  createNormaDoc({
    id: "norma-cerd",
    slug: "convencion-internacional-contra-discriminacion-racial",
    title: "Convención Internacional contra la Discriminación Racial",
    type: "Instrumento internacional",
    description:
      "Obliga a prevenir, eliminar y sancionar la discriminación racial y respalda medidas especiales de protección para pueblos afrodescendientes.",
    territory: "Internacional",
    council: "Naciones Unidas / OHCHR",
    municipality: "Ginebra",
    year: 1965,
    keywords: ["discriminación racial", "CERD", "afrodescendientes", "igualdad"],
    fileLabel: "Ver en OHCHR",
    url: "https://www.ohchr.org/en/instruments-mechanisms/instruments/international-convention-elimination-all-forms-racial",
  }),
  createNormaDoc({
    id: "norma-durban",
    slug: "declaracion-programa-accion-durban-2001",
    title: "Declaración y Programa de Acción de Durban (2001)",
    type: "Instrumento internacional",
    description:
      "Documento internacional contra el racismo, la discriminación racial, la xenofobia y formas conexas de intolerancia.",
    territory: "Internacional",
    council: "Naciones Unidas / OHCHR",
    municipality: "Durban",
    year: 2001,
    keywords: ["Durban", "racismo", "discriminación racial", "afrodescendientes"],
    fileLabel: "Ver en OHCHR",
    url: "https://www.ohchr.org/en/conferences-summits/durban-review-conference/durban-declaration-and-programme-action",
  }),
  createNormaDoc({
    id: "norma-decenio-afro",
    slug: "decenio-internacional-afrodescendientes-2015-2024",
    title: "Decenio Internacional para los Afrodescendientes (ONU 2015-2024)",
    type: "Instrumento internacional",
    description:
      "Marco de Naciones Unidas para reconocimiento, justicia y desarrollo de personas afrodescendientes durante el periodo 2015-2024.",
    territory: "Internacional",
    council: "Naciones Unidas",
    municipality: "Nueva York",
    year: 2015,
    validity: "Histórico",
    keywords: ["decenio afrodescendientes", "ONU", "reconocimiento", "justicia"],
    fileLabel: "Ver en ONU",
    url: "https://www.un.org/en/observances/decade-people-african-descent",
  }),
  createNormaDoc({
    id: "norma-escazu",
    slug: "acuerdo-escazu-derechos-ambientales",
    title: "Acuerdo de Escazú — Acceso a la información ambiental",
    type: "Instrumento internacional",
    description:
      "Acuerdo regional de América Latina sobre acceso a la información, participación pública y justicia en asuntos ambientales, con protección especial para defensores ambientales.",
    territory: "Internacional",
    council: "CEPAL / Naciones Unidas",
    municipality: "Escazú",
    year: 2018,
    keywords: ["Escazú", "acceso información", "justicia ambiental", "defensores"],
    fileLabel: "Ver en CEPAL",
    url: "https://repositorio.cepal.org/handle/11362/43559",
    sourceUrl: "https://repositorio.cepal.org/handle/11362/43559",
  }),
  createNormaDoc({
    id: "norma-cdb",
    slug: "convenio-diversidad-biologica",
    title: "Convenio sobre Diversidad Biológica (CDB)",
    type: "Instrumento internacional",
    description:
      "Instrumento internacional clave para conservación, uso sostenible de la biodiversidad y participación justa en beneficios derivados de recursos genéticos.",
    territory: "Internacional",
    council: "Convenio sobre Diversidad Biológica",
    municipality: "Montreal",
    year: 1992,
    keywords: ["CDB", "diversidad biológica", "conservación", "territorio"],
    fileLabel: "Ver en CBD",
    url: "https://www.cbd.int/convention/",
  }),
  createNormaDoc({
    id: "norma-kunming-montreal",
    slug: "marco-global-biodiversidad-kunming-montreal",
    title: "Marco Global de Biodiversidad Kunming-Montreal",
    type: "Instrumento internacional",
    description:
      "Marco global adoptado para orientar metas de biodiversidad al 2030 y 2050, con énfasis en conservación, restauración y participación de pueblos indígenas y comunidades locales.",
    territory: "Internacional",
    council: "Convenio sobre Diversidad Biológica",
    municipality: "Montreal",
    year: 2022,
    keywords: ["Kunming-Montreal", "biodiversidad", "meta 30x30", "conservación"],
    fileLabel: "Ver en CBD",
    url: "https://www.cbd.int/gbf/",
  }),
  createNormaDoc({
    id: "norma-ramsar",
    slug: "convenio-ramsar-humedales",
    title: "Convenio Ramsar sobre Humedales",
    type: "Instrumento internacional",
    description:
      "Tratado internacional para la conservación y el uso racional de humedales de importancia ecológica y cultural.",
    territory: "Internacional",
    council: "Convención Ramsar",
    municipality: "Ramsar",
    year: 1971,
    keywords: ["Ramsar", "humedales", "conservación", "ecosistemas acuáticos"],
    fileLabel: "Ver en Ramsar",
    url: "https://www.ramsar.org/about/the-convention-on-wetlands",
  }),
  createNormaDoc({
    id: "norma-cmnucc",
    slug: "convencion-marco-cambio-climatico",
    title: "Convención Marco de Cambio Climático (CMNUCC)",
    type: "Instrumento internacional",
    description:
      "Tratado base del régimen climático internacional que orienta obligaciones estatales de mitigación, adaptación y cooperación.",
    territory: "Internacional",
    council: "Naciones Unidas / UNFCCC",
    municipality: "Bonn",
    year: 1992,
    keywords: ["CMNUCC", "cambio climático", "adaptación", "mitigación"],
    fileLabel: "Ver en UNFCCC",
    url: "https://unfccc.int/process-and-meetings/the-convention/what-is-the-united-nations-framework-convention-on-climate-change",
  }),
  createNormaDoc({
    id: "norma-acuerdo-paris",
    slug: "acuerdo-paris-cambio-climatico",
    title: "Acuerdo de París",
    type: "Instrumento internacional",
    description:
      "Acuerdo climático global para limitar el aumento de temperatura, fortalecer adaptación y apoyar una transición justa y resiliente.",
    territory: "Internacional",
    council: "Naciones Unidas / UNFCCC",
    municipality: "París",
    year: 2015,
    keywords: ["Acuerdo de París", "cambio climático", "adaptación", "justicia climática"],
    fileLabel: "Ver en UNFCCC",
    url: "https://unfccc.int/process-and-meetings/the-paris-agreement",
  }),
  createNormaDoc({
    id: "norma-conpes3660",
    slug: "conpes-3660-2010-politica-comunidades-afro",
    title: "CONPES 3660 de 2010 — Política para comunidades afro",
    type: "Política pública",
    description:
      "Documento de política pública orientado al fortalecimiento de acciones estatales para comunidades negras, afrocolombianas, raizales y palenqueras.",
    council: "Departamento Nacional de Planeación",
    year: 2010,
    keywords: ["CONPES 3660", "política pública", "comunidades afro", "DNP"],
    fileLabel: "Ver en DNP",
    url: conpesHomeUrl,
  }),
  createNormaDoc({
    id: "norma-conpes3491",
    slug: "conpes-3491-2007-politica-poblacion-afrocolombiana",
    title: "CONPES 3491 de 2007 — Política para población afrocolombiana",
    type: "Política pública",
    description:
      "Documento CONPES orientado a cerrar brechas y fortalecer acciones estatales dirigidas a la población afrocolombiana.",
    council: "Departamento Nacional de Planeación",
    year: 2007,
    keywords: ["CONPES 3491", "población afrocolombiana", "política pública", "DNP"],
    fileLabel: "Ver en DNP",
    url: conpesHomeUrl,
  }),
  createNormaDoc({
    id: "norma-pnd-2022-2026",
    slug: "plan-nacional-desarrollo-2022-2026-capitulos-etnicos",
    title: "Plan Nacional de Desarrollo 2022-2026 — Capítulos étnicos",
    type: "Política pública",
    description:
      "Plan Nacional de Desarrollo vigente al 17 de marzo de 2026, relevante por sus enfoques étnicos, de participación y ordenamiento territorial alrededor del agua.",
    council: "Departamento Nacional de Planeación / Congreso de Colombia",
    year: 2023,
    keywords: ["PND 2022-2026", "capítulos étnicos", "DNP", "ordenamiento territorial"],
    fileLabel: "Ver en DNP",
    url: pnd2026Url,
  }),
  createNormaDoc({
    id: "norma-comision-consultiva",
    slug: "comision-consultiva-alto-nivel-comunidades-negras",
    title: "Comisión Consultiva de Alto Nivel",
    type: "Instancia oficial",
    description:
      "Instancia oficial de interlocución entre el Estado y las comunidades negras, afrocolombianas, raizales y palenqueras para consulta y concertación.",
    council: "Ministerio del Interior",
    year: 1995,
    keywords: ["Comisión Consultiva de Alto Nivel", "interlocución", "comunidades negras", "concertación"],
    fileLabel: "Ver en MinInterior",
    url: afroAffairsUrl,
  }),
  createNormaDoc({
    id: "norma-espacio-consulta-previa",
    slug: "espacio-nacional-consulta-previa-comunidades-negras",
    title: "Espacio Nacional de Consulta Previa",
    type: "Instancia oficial",
    description:
      "Mecanismo oficial de concertación para procesos de consulta previa de medidas legislativas y administrativas que afectan a comunidades negras.",
    council: "Ministerio del Interior",
    year: 1991,
    keywords: ["Espacio Nacional de Consulta Previa", "consulta previa", "concertación", "medidas legislativas"],
    fileLabel: "Ver en MinInterior",
    url: afroAffairsUrl,
  }),
  createNormaDoc({
    id: "norma-comision-pedagogica",
    slug: "comision-pedagogica-nacional-comunidades-negras",
    title: "Comisión Pedagógica Nacional",
    type: "Instancia oficial",
    description:
      "Espacio institucional relevante para lineamientos pedagógicos, etnoeducación y fortalecimiento cultural de comunidades negras.",
    council: "Ministerio de Educación Nacional",
    year: 1993,
    keywords: ["Comisión Pedagógica Nacional", "etnoeducación", "cultura", "comunidades negras"],
    fileLabel: "Ver en MinEducación",
    url: "https://www.mineducacion.gov.co/portal/",
  }),
  createNormaDoc({
    id: "norma-mesa-tierras",
    slug: "mesa-de-tierras-comunidades-negras",
    title: "Mesa de Tierras",
    type: "Instancia oficial",
    description:
      "Espacio de diálogo y seguimiento para asuntos de tierras, territorio colectivo, titulación y defensa del derecho territorial afrodescendiente.",
    council: "Ministerio del Interior",
    year: 2012,
    keywords: ["Mesa de Tierras", "territorio colectivo", "titulación", "seguimiento"],
    fileLabel: "Ver en MinInterior",
    url: afroAffairsUrl,
  }),
];

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
    visibility: "internal",
    keywords: ["gobierno propio", "Naya", "reglamento", "2021"],
    genderFocus: false,
    mjnTags: [],
    action: "external",
    fileLabel: "Ver en SharePoint",
    fileSize: "3.2 MB",
    url: spInternalUrl("REGLAMENTOS INTERNOS/CC DIEGO LUIS CORDOBA/REGLAMENTO INTERNO DIEGO LUIS CORDOBA 19.pdf"),
  },

  // ── REGLAMENTOS INTERNOS (desde SharePoint — INF. INTERNA) ─────────────────

  {
    id: "doc-reglamento-diego-luis-cordoba",
    slug: "reglamento-interno-cc-diego-luis-cordoba",
    title: "Reglamento interno — CC Diego Luis Córdoba",
    section: "Reglamentos internos",
    type: "Reglamento interno",
    description:
      "Reglamento interno aprobado del Consejo Comunitario Diego Luis Córdoba con normas de convivencia, autoridad comunitaria, uso del territorio y mecanismos de resolución de conflictos.",
    territory: "Chocó",
    council: "Consejo Comunitario Diego Luis Córdoba",
    department: "Chocó",
    municipality: "Istmina",
    year: 2019,
    validity: "Vigente",
    visibility: "internal",
    keywords: ["reglamento interno", "Diego Luis Córdoba", "gobierno propio", "Chocó"],
    genderFocus: false,
    mjnTags: [],
    action: "external",
    fileLabel: "Ver reglamento",
    fileSize: "1.33 MB",
    url: spInternalUrl("REGLAMENTOS INTERNOS/CC DIEGO LUIS CORDOBA/REGLAMENTO INTERNO DIEGO LUIS CORDOBA 19.pdf"),
  },
  {
    id: "doc-reglamento-esperanza-viva",
    slug: "reglamento-interno-cc-esperanza-viva",
    title: "Reglamento interno — CC Esperanza Viva",
    section: "Reglamentos internos",
    type: "Reglamento interno",
    description:
      "Instrumento normativo interno del Consejo Comunitario Esperanza Viva que regula la vida comunitaria, el uso del territorio y la organización del gobierno propio.",
    territory: "Nacional",
    council: "Consejo Comunitario Esperanza Viva",
    department: "Nacional",
    municipality: "Nacional",
    year: 2024,
    validity: "Vigente",
    visibility: "internal",
    keywords: ["reglamento interno", "Esperanza Viva", "gobierno propio", "autonomía"],
    genderFocus: false,
    mjnTags: [],
    action: "external",
    fileLabel: "Ver reglamento",
    fileSize: "810 KB",
    url: spInternalUrl("REGLAMENTOS INTERNOS/CC ESPERANZA VIVA/REGLAMENTO INTERNO-- CC ESPERANZA VIVA.pdf"),
  },
  {
    id: "doc-reglamento-llaves-futuro",
    slug: "reglamento-interno-cc-llaves-del-futuro",
    title: "Reglamento interno — CC Llaves del Futuro",
    section: "Reglamentos internos",
    type: "Reglamento interno",
    description:
      "Normas internas del Consejo Comunitario Llaves del Futuro que establecen la estructura de gobierno, la participación comunitaria y la gestión del territorio colectivo.",
    territory: "Nacional",
    council: "Consejo Comunitario Llaves del Futuro",
    department: "Nacional",
    municipality: "Nacional",
    year: 2024,
    validity: "Vigente",
    visibility: "internal",
    keywords: ["reglamento interno", "Llaves del Futuro", "gobierno propio"],
    genderFocus: false,
    mjnTags: [],
    action: "external",
    fileLabel: "Ver reglamento",
    fileSize: "1.52 MB",
    url: spInternalUrl("REGLAMENTOS INTERNOS/CC LLAVES DEL FUTURO/REGLAMENTO INTERNO - CC LLAVES DEL FUTURO.pdf"),
  },
  {
    id: "doc-reglamento-martin-luther-king",
    slug: "reglamento-interno-cc-martin-luther-king",
    title: "Reglamento interno — CC Martin Luther King",
    section: "Reglamentos internos",
    type: "Reglamento interno",
    description:
      "Documento normativo del Consejo Comunitario Martin Luther King con los acuerdos colectivos de convivencia, organización y gobernanza territorial.",
    territory: "Nacional",
    council: "Consejo Comunitario Martin Luther King",
    department: "Nacional",
    municipality: "Nacional",
    year: 2024,
    validity: "Vigente",
    visibility: "internal",
    keywords: ["reglamento interno", "Martin Luther King", "gobierno propio"],
    genderFocus: false,
    mjnTags: [],
    action: "external",
    fileLabel: "Ver reglamento",
    fileSize: "495 KB",
    url: spInternalUrl("REGLAMENTOS INTERNOS/CC MARTIN LUTHER KING/REGLAMENTO INTERNO MARTIN LUTHER KING (1).pdf"),
  },
  {
    id: "doc-reglamento-mayor-capitania",
    slug: "reglamento-interno-cc-mayor-capitania",
    title: "Reglamento interno — CC Mayor de Capitanía",
    section: "Reglamentos internos",
    type: "Reglamento interno",
    description:
      "Reglamento interno del Consejo Comunitario Mayor de Capitanía que rige la vida organizativa, la autoridad propia y el uso del territorio colectivo afrodescendiente.",
    territory: "Cauca",
    council: "Consejo Comunitario Mayor de Capitanía",
    department: "Cauca",
    municipality: "Páez",
    year: 2024,
    validity: "Vigente",
    visibility: "internal",
    keywords: ["reglamento interno", "Capitanía", "gobierno propio", "Cauca"],
    genderFocus: false,
    mjnTags: [],
    action: "external",
    fileLabel: "Ver reglamento",
    fileSize: "451 KB",
    url: spInternalUrl("REGLAMENTOS INTERNOS/CC MAYOR DE CAPITANIA/REGLAMENTO INTERNO - CAPITANIA.pdf"),
  },
  {
    id: "doc-reglamento-nelson-mandela-guaviare",
    slug: "reglamento-interno-cc-nelson-mandela-guaviare",
    title: "Reglamento interno — CC Nelson Mandela (Guaviare)",
    section: "Reglamentos internos",
    type: "Reglamento interno",
    description:
      "Normas de gobierno propio del Consejo Comunitario Nelson Mandela en el departamento del Guaviare, con reglas de convivencia y manejo del territorio colectivo.",
    territory: "Guaviare",
    council: "Consejo Comunitario Nelson Mandela",
    department: "Guaviare",
    municipality: "San José del Guaviare",
    year: 2024,
    validity: "Vigente",
    visibility: "internal",
    keywords: ["reglamento interno", "Nelson Mandela", "Guaviare", "gobierno propio"],
    genderFocus: false,
    mjnTags: [],
    action: "external",
    fileLabel: "Ver reglamento",
    fileSize: "451 KB",
    url: spInternalUrl("REGLAMENTOS INTERNOS/CC NELSON MANDELA - GUAVIARE/REGLAMENTO INTERNO NELSON MANDELA.pdf"),
  },
  {
    id: "doc-reglamento-nelson-mandela-piamonte",
    slug: "reglamento-interno-cc-nelson-mandela-piamonte",
    title: "Reglamento interno — CC Nelson Mandela (Piamonte)",
    section: "Reglamentos internos",
    type: "Reglamento interno",
    description:
      "Reglamento interno del Consejo Comunitario Nelson Mandela en Piamonte, Cauca, que regula la autoridad comunitaria y el gobierno del territorio colectivo.",
    territory: "Cauca",
    council: "Consejo Comunitario Nelson Mandela",
    department: "Cauca",
    municipality: "Piamonte",
    year: 2024,
    validity: "Vigente",
    visibility: "internal",
    keywords: ["reglamento interno", "Nelson Mandela", "Piamonte", "gobierno propio"],
    genderFocus: false,
    mjnTags: [],
    action: "external",
    fileLabel: "Ver reglamento",
    fileSize: "699 KB",
    url: spInternalUrl("REGLAMENTOS INTERNOS/CC NELSON MANDELA - PIAMONTE/REGLAMENTO INTERNO - CC NELSON MANDELA.pdf"),
  },
  {
    id: "doc-reglamento-nueva-esperanza",
    slug: "reglamento-interno-cc-nueva-esperanza",
    title: "Reglamento interno — CC Nueva Esperanza",
    section: "Reglamentos internos",
    type: "Reglamento interno",
    description:
      "Instrumento de gobierno propio del Consejo Comunitario Nueva Esperanza con los acuerdos normativos sobre convivencia, organización y defensa territorial.",
    territory: "Nacional",
    council: "Consejo Comunitario Nueva Esperanza",
    department: "Nacional",
    municipality: "Nacional",
    year: 2024,
    validity: "Vigente",
    visibility: "internal",
    keywords: ["reglamento interno", "Nueva Esperanza", "gobierno propio"],
    genderFocus: false,
    mjnTags: [],
    action: "external",
    fileLabel: "Ver reglamento",
    fileSize: "868 KB",
    url: spInternalUrl("REGLAMENTOS INTERNOS/CC NUEVA ESPERANZA/REGLAMENTO INTERNO - CC NUEVA ESPERANZA.pdf"),
  },
  {
    id: "doc-reglamento-orconepiac",
    slug: "reglamento-interno-cc-orconepiac",
    title: "Reglamento interno — CC ORCONEPIAC",
    section: "Reglamentos internos",
    type: "Reglamento interno",
    description:
      "Normas internas del Consejo Comunitario ORCONEPIAC que establecen la estructura organizativa, los mecanismos de participación y las reglas de uso y gobierno del territorio.",
    territory: "Nariño",
    council: "ORCONEPIAC",
    department: "Nariño",
    municipality: "Nacional",
    year: 2024,
    validity: "Vigente",
    visibility: "internal",
    keywords: ["reglamento interno", "ORCONEPIAC", "gobierno propio", "Nariño"],
    genderFocus: false,
    mjnTags: [],
    action: "external",
    fileLabel: "Ver reglamento",
    fileSize: "757 KB",
    url: spInternalUrl("REGLAMENTOS INTERNOS/CC ORCONEPIAC/REGLAMENTO INTERNO - CC ORCONEPIAC.pdf"),
  },

  // ── PLANES DE ETNODESARROLLO (desde SharePoint — INF. INTERNA) ────────────

  {
    id: "doc-ped-diego-luis-cordoba",
    slug: "plan-etnodesarrollo-cc-diego-luis-cordoba-2024",
    title: "Plan de Etnodesarrollo — CC Diego Luis Córdoba (2024)",
    section: "Planes de etnodesarrollo",
    type: "Plan de etnodesarrollo",
    description:
      "Plan estratégico de etnodesarrollo del Consejo Comunitario Diego Luis Córdoba (2024) con proyección económica, social, cultural y ambiental del territorio colectivo desde la identidad afrodescendiente.",
    territory: "Chocó",
    council: "Consejo Comunitario Diego Luis Córdoba",
    department: "Chocó",
    municipality: "Istmina",
    year: 2024,
    validity: "Vigente",
    visibility: "internal",
    keywords: ["etnodesarrollo", "Diego Luis Córdoba", "planificación", "2024", "Chocó"],
    genderFocus: false,
    mjnTags: [],
    action: "external",
    fileLabel: "Ver plan",
    fileSize: "5.81 MB",
    url: spInternalUrl("PLAN DE ETNODESARROLLO/CC. DIEGO LUIS CORDOBA/PLAN ETNODESARROLLO DIEGO LUIS C%C3%93RDOBA 20241201.pdf"),
  },
  {
    id: "doc-ped-martin-luther-king",
    slug: "plan-etnodesarrollo-cc-martin-luther-king",
    title: "Plan de Etnodesarrollo — CC Martin Luther King",
    section: "Planes de etnodesarrollo",
    type: "Plan de etnodesarrollo",
    description:
      "Plan de etnodesarrollo del Consejo Comunitario Martin Luther King con lineamientos de autonomía territorial, desarrollo propio y fortalecimiento organizativo comunitario.",
    territory: "Nacional",
    council: "Consejo Comunitario Martin Luther King",
    department: "Nacional",
    municipality: "Nacional",
    year: 2024,
    validity: "Vigente",
    visibility: "internal",
    keywords: ["etnodesarrollo", "Martin Luther King", "planificación", "autonomía"],
    genderFocus: false,
    mjnTags: [],
    action: "external",
    fileLabel: "Ver plan",
    fileSize: "4.18 MB",
    url: spInternalUrl("PLAN DE ETNODESARROLLO/CC. MARTIN LUTHER KING/PED MARTIN KUTHER KING.pdf"),
  },
  {
    id: "doc-ped-nelson-mandela",
    slug: "plan-etnodesarrollo-cc-nelson-mandela-2024",
    title: "Plan de Etnodesarrollo — CC Nelson Mandela (2024)",
    section: "Planes de etnodesarrollo",
    type: "Plan de etnodesarrollo",
    description:
      "Plan de etnodesarrollo 2024 del Consejo Comunitario Nelson Mandela con estrategias de planeación propia, identidad cultural y proyección territorial a largo plazo.",
    territory: "Nacional",
    council: "Consejo Comunitario Nelson Mandela",
    department: "Nacional",
    municipality: "Nacional",
    year: 2024,
    validity: "Vigente",
    visibility: "internal",
    keywords: ["etnodesarrollo", "Nelson Mandela", "planificación", "2024"],
    genderFocus: false,
    mjnTags: [],
    action: "external",
    fileLabel: "Ver plan",
    fileSize: "7.59 MB",
    url: spInternalUrl("PLAN DE ETNODESARROLLO/CC. NELSON MANDELA/20241201 PLAN DE ETNODESARROLLO DE NELSON MANDELA.pdf"),
  },

  // ── PLAN DE USO Y MANEJO AMBIENTAL NEGRO — PUMANE ─────────────────────────

  {
    id: "doc-pumane-renacientes-diaspora",
    slug: "pumane-cc-renacientes-diaspora-africana",
    title: "PUMANE — CC Renacientes de la Diáspora Africana",
    section: "Planes de uso y manejo",
    type: "Plan de manejo",
    description:
      "Plan de Uso y Manejo Ambiental Negro (PUMANE) del Consejo Comunitario Renacientes de la Diáspora Africana, con zonificación territorial, manejo de recursos naturales y estrategias de conservación desde el conocimiento ancestral afrodescendiente.",
    territory: "Nacional",
    council: "Consejo Comunitario Renacientes de la Diáspora Africana",
    department: "Nacional",
    municipality: "Nacional",
    year: 2024,
    validity: "Vigente",
    visibility: "internal",
    keywords: ["PUMANE", "uso y manejo", "Renacientes", "diáspora africana", "conservación"],
    genderFocus: false,
    mjnTags: [],
    action: "external",
    fileLabel: "Ver PUMANE",
    fileSize: "4.25 MB",
    url: spInternalUrl("PLAN DE USO Y MANEJO AMBIENTAL NEGRO - PUMANE/RENACIENTES DE LA DIASPORA AFRICANA/PUMANE FINAL_CCCN_RENACIENTES_DE_LA_DI%C3%81SPORA_AFRICANA.pdf"),
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

  // ── Normativa vigente ─────────────────────────────────────────────────────
  ...normaVigenteDocuments,

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
    imageUrl: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=2000&auto=format&fit=crop",
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
    imageUrl: "https://images.unsplash.com/photo-1522079079633-87a17721867a?q=80&w=2000&auto=format&fit=crop",
  },

  {
    id: "memoria-balsa-chical",
    slug: "la-balsa-chical-y-marimba",
    title: "La balsa, el chical y la marimba",
    section: "Memoria viva del territorio",
    type: "Cultural",
    description: "Recorridos por el río Guapi al son de marimba, donde la música es el lenguaje de resistencia y memoria. Un relato sonoro sobre cómo la selva suena.",
    territory: "Guapi",
    council: "Consejos Comunitarios de Guapi",
    department: "Cauca",
    municipality: "Guapi",
    year: 2021,
    validity: "Vigente",
    visibility: "public",
    keywords: ["marimba", "río Guapi", "música", "resistencia"],
    genderFocus: false,
    mjnTags: [],
    action: "video",
    fileLabel: "Ver documental corto",
    url: "#",
    imageUrl: "https://images.unsplash.com/photo-1542385151-efd9000785a0?q=80&w=2000&auto=format&fit=crop",
  },
  {
    id: "memoria-medicina-tradicional",
    slug: "medicina-tradicional-parteras",
    title: "Saberes de partería y medicina tradicional del Pacífico",
    section: "Memoria viva del territorio",
    type: "Investigación",
    description: "Archivo oral de mujeres sabedoras y parteras del Chocó, quienes custodian los conocimientos botánicos y espirituales para cuidar la vida en el territorio.",
    territory: "Chocó",
    council: "Asociación de Parteras Unidas",
    department: "Chocó",
    municipality: "Quibdó",
    year: 2023,
    validity: "Vigente",
    visibility: "public",
    keywords: ["partería", "medicina tradicional", "mujeres", "saberes"],
    genderFocus: true,
    mjnTags: ["Mujeres"],
    action: "file",
    fileLabel: "Escuchar testimonios",
    url: "#",
    imageUrl: "https://images.unsplash.com/photo-1518557984649-7b161c230cfa?q=80&w=2000&auto=format&fit=crop",
  },
  {
    id: "memoria-alabados",
    slug: "alabados-rituales-funerarios",
    title: "Alabados y rituales de despedida",
    section: "Memoria viva del territorio",
    type: "Cultural",
    description: "Registro de los cantos de alabado, gualí y chigualo. Ritos funerarios afropacíficos que acompañan el viaje de los difuntos y sanan el dolor colectivo.",
    territory: "Litoral Sanquianga",
    council: "Red de Consejos Comunitarios del Sanquianga",
    department: "Nariño",
    municipality: "El Charco",
    year: 2022,
    validity: "Vigente",
    visibility: "public",
    keywords: ["alabados", "chigualo", "ritual funerario", "cantos"],
    genderFocus: false,
    mjnTags: [],
    action: "video",
    fileLabel: "Ver registro",
    url: "#",
    imageUrl: "https://images.unsplash.com/photo-1510250669299-715a133f6797?q=80&w=2000&auto=format&fit=crop",
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
];

export const homeStrategicFunctionsIntro =
  "En este marco, el Palenke cumple tres funciones estratégicas:";

export const homeStrategicFunctions = [
  {
    title: "Producción de conocimiento propio",
    description:
      "Sistematiza saberes ancestrales, experiencias comunitarias e información territorial para fortalecer la toma de decisiones desde el gobierno propio.",
  },
  {
    title: "Cuidado territorial comunitario",
    description:
      "Acompaña procesos de monitoreo ambiental y territorial mediante el Sistema Comunitario de Información Territorial y Ambiental (SCITA) que incluye el sistema de información geográfica afrodescendiente SIG- A , fortaleciendo el gobierno comunitario sobre los territorios.",
  },
  {
    title: "Incidencia política",
    description:
      "Promueve el reconocimiento de las comunidades negras como autoridades territoriales y ambientales legítimas, participando en agendas nacionales e internacionales relacionadas con derechos territoriales, biodiversidad y justicia climática.",
  },
];

export const homeStrategicFunctionsClosing =
  "El Palenke no sustituye las estructuras organizativas del PCN ni de los Consejos Comunitarios. Por el contrario, funciona como un espacio de articulación estratégica que fortalece los procesos de gobierno propio y autonomía territorial del Pueblo Negro.";

export const homePoliticalOrientationIntro =
  "El Palenke de Pensamiento y Cuidadores del Territorio se orienta por los principios políticos y organizativos del Proceso de Comunidades Negras (PCN), construidos históricamente en la lucha del pueblo afrodescendiente por la dignidad, el territorio y la autodeterminación.";

export const homePoliticalOrientationLead =
  "Nuestra orientación política se fundamenta en cinco pilares:";

export const homePoliticalOrientationPillars = [
  {
    title: "Autonomía del Pueblo Negro",
    description:
      "Reconocemos el derecho de las comunidades negras a ejercer gobierno propio sobre sus territorios colectivos, de acuerdo con la Constitución Política de Colombia, la Ley 70 de 1993 y los instrumentos internacionales de derechos de los pueblos afrodescendientes.",
  },
  {
    title: "Defensa integral del territorio",
    description:
      "Entendemos el territorio como un espacio de vida que integra tierra, agua, ecosistemas,biodiversidad, cultura, memoria y espiritualidad. La defensa territorial implica proteger estos elementos frente a amenazas extractivas, ambientales y sociales.",
  },
  {
    title: "Gobernanza comunitaria",
    description:
      "Promovemos el fortalecimiento de los Consejos Comunitarios como autoridades legítimas de sus territorios, apoyando el fortalecimiento de herramientas propias de gobierno y la construcción de instrumentos legislativos para la gestión territorial.",
  },
  {
    title: "Justicia racial, ambiental y climática",
    description:
      "Reconocemos que los territorios afrodescendientes son fundamentales para la conservación de ecosistemas bioculturales estratégicos. Por ello impulsamos una agenda de justiciapolítica, climática y sociocultural que reconozca el papel histórico de las comunidades negras como guardianas de los territorios con incidencia de alto impacto.",
  },
  {
    title: "Conocimiento ancestral y diálogo de saberes",
    description:
      "Valoramos los saberes de mayoras y mayores como fundamento del pensamiento afrodescendiente, promoviendo su diálogo con herramientas técnicas, académicas y tecnológicas para fortalecer la autonomía territorial.",
  },
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
    // Sensitive docs are never shown
    if (document.visibility === "sensitive") return false;
    // Internal docs are shown to everyone — download is gated in the UI layer
    return true;
  });
}

/** Returns true if the viewer can freely access/download this document */
export function canDownloadDocument(role: ViewerRole, visibility: Visibility): boolean {
  if (visibility === "sensitive") return false;
  if (visibility === "internal") return role === "internal" || role === "admin";
  return true;
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

export function findDocumentById(id: string) {
  return documents.find((document) => document.id === id);
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
