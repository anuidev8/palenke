export type LoUltimoPublication = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: string;
  category: string;
  location: string | null;
  coverImageUrl: string | null;
  galleryImageUrls: string[];
  externalUrl?: string | null;
  visibility: "public" | "internal";
  featured: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
};

const ASSET_BASE = "/assets/lo-ultimo";

function asset(slug: string, filename: string) {
  return `${ASSET_BASE}/${slug}/${filename}`;
}

function paragraphs(...parts: string[]) {
  return parts.join("\n\n");
}

const curatedLoUltimoPublications: LoUltimoPublication[] = [
  {
    id: "lo-ultimo-urt-2025",
    slug: "convenio-urt-hileros-caracterizacion-2025",
    title: "Convenio URT–Hileros: caracterización territorial y borrador de demanda",
    summary:
      "En 2025 se firmó un convenio entre la URT y la Agencia Afrocolombiana Hileros–PCN para avanzar en la caracterización de afectaciones territoriales y la construcción del borrador de demanda.",
    body: paragraphs(
      "En el año 2025, se firmó un convenio entre la Unidad de Restitución de Tierras (URT) y la Corporación Agencia Afrocolombiana Hileros – PCN, mediante el cual se avanzó en un proceso histórico de caracterización de afectaciones territoriales y en la construcción del borrador de demanda, fortaleciendo la memoria comunitaria, el gobierno propio y el rol de los Consejos Comunitarios.",
      "Este ejercicio permitió la participación directa de las comunidades; la cartografía social y territorial construida desde la voz de la gente; la resocialización del Decreto Ley 4635 de 2011; la construcción colectiva de insumos para la restitución de derechos territoriales; y la caracterización de las afectaciones territoriales con la elaboración del borrador de demanda.",
      "Seguimos reafirmando que la defensa del territorio se construye desde la comunidad, la memoria y la autonomía.",
      "Territorio | Gobierno Propio | Memoria Colectiva | Justicia Étnica",
    ),
    category: "Gobierno propio",
    location: "Colombia",
    coverImageUrl: asset("publicacion-urt", "image.png"),
    galleryImageUrls: [
      asset("publicacion-urt", "image.png"),
      asset("publicacion-urt", "image_2.jpg"),
      asset("publicacion-urt", "image3.png"),
    ],
    visibility: "public",
    featured: true,
    publishedAt: "2025-12-10T10:00:00-05:00",
    createdAt: "2025-12-10T10:00:00-05:00",
    updatedAt: "2025-12-10T10:00:00-05:00",
  },
  {
    id: "lo-ultimo-ilc-2025",
    slug: "pcn-fortalece-caminar-ilc-2025",
    title: "El PCN fortalece su caminar junto a la ILC",
    summary:
      "En 2025 el PCN ratificó y fortaleció su articulación con la International Land Coalition (ILC) para la defensa de la tierra y los derechos territoriales a nivel global.",
    body: paragraphs(
      "En el año 2025, el Proceso de Comunidades Negras – PCN ratificó y fortaleció su caminar junto a la International Land Coalition (ILC), una alianza clave para la defensa de la tierra y los derechos territoriales a nivel global.",
      "Esta articulación permitió la participación activa del pueblo afrodescendiente en el Foro Global de la Tierra, incluyendo la visita de campo, el Preforo Afrodescendiente y la Mesa Paralela, visibilizando avances en titulación colectiva, gobernanza territorial y justicia climática.",
      "De igual manera, se fortalecieron los lazos con la Coalición Nacional por la Tierra (CNT), integrada por más de 15 organizaciones multiétnicas e interinstitucionales, consolidando una agenda común por la tierra y el territorio.",
      "La tierra es vida, dignidad y futuro colectivo.",
    ),
    category: "Territorio",
    location: "Alianza ILC / Global",
    coverImageUrl: asset("publicacion-ilc", "image.png"),
    galleryImageUrls: [
      asset("publicacion-ilc", "image.png"),
      asset("publicacion-ilc", "imag2.png"),
      asset("publicacion-ilc", "image3.png"),
      asset("publicacion-ilc", "image4.png"),
      asset("publicacion-ilc", "image5.png"),
      asset("publicacion-ilc", "image6.png"),
      asset("publicacion-ilc", "image7.png"),
    ],
    visibility: "public",
    featured: true,
    publishedAt: "2025-11-18T10:00:00-05:00",
    createdAt: "2025-11-18T10:00:00-05:00",
    updatedAt: "2025-11-18T10:00:00-05:00",
  },
  {
    id: "lo-ultimo-onu-2025",
    slug: "caracterizacion-onu-genero-2024-2025",
    title: "Caracterización territorial y enfoque de género con apoyo de la ONU",
    summary:
      "Entre 2024 y 2025 el PCN, con la URT, el Fondo ONU y Hileros, desarrolló caracterización, fortalecimiento organizativo y enfoque de género en Valle, Antioquia y Nariño.",
    body: paragraphs(
      "Entre los años 2024 y 2025, el Proceso de Comunidades Negras – PCN, en articulación con los niveles de la Unidad de Restitución de Tierras, el Fondo ONU y la Corporación Agencia Afrocolombiana Hileros, desarrolló un ejercicio de caracterización, fortalecimiento organizativo y enfoque de género, orientado a la defensa de los derechos territoriales de las comunidades negras en los departamentos de Valle del Cauca, Antioquia y Nariño.",
      "Este proceso tuvo como resultados: 3 informes de caracterización; 3 rutas de litigio estratégico; y 3 rutas metodológicas desde el pensamiento étnico-territorial de las mujeres negras.",
      "Asimismo, 60 mujeres participaron en el Diplomado Escuela de Formación Política y Social, con enfoque étnico y de género, dirigido a mujeres pertenecientes a Consejos Comunitarios de Valle del Cauca, Antioquia y Nariño.",
      "Un proceso que fortalece el gobierno propio, la participación política de las mujeres negras y la restitución de los derechos territoriales.",
    ),
    category: "Gobierno propio",
    location: "Valle del Cauca, Antioquia y Nariño",
    coverImageUrl: asset("publicacion-onu", "image.png"),
    galleryImageUrls: [
      asset("publicacion-onu", "image.png"),
      asset("publicacion-onu", "image_2.png"),
    ],
    visibility: "public",
    featured: false,
    publishedAt: "2025-10-05T10:00:00-05:00",
    createdAt: "2025-10-05T10:00:00-05:00",
    updatedAt: "2025-10-05T10:00:00-05:00",
  },
  {
    id: "lo-ultimo-ttf-2025",
    slug: "alianza-turning-tides-facility-2025",
    title: "Alianza estratégica con Turning Tides Facility (TTF)",
    summary:
      "En 2025 el PCN consolidó una alianza con TTF orientada a la justicia territorial, la gobernanza comunitaria del agua y la protección de maritorios y ecosistemas acuáticos.",
    body: paragraphs(
      "Durante el año 2025, el PCN consolidó una nueva alianza estratégica con Turning Tides Facility (TTF), que es una iniciativa orientada a la justicia territorial, la gobernanza comunitaria del agua y la protección de maritorios y ecosistemas acuáticos.",
      "Esta alianza representa un avance estructural en la defensa de los derechos hídricos del Pueblo Negro en Colombia, fortaleciendo el litigio estratégico para la titulación colectiva de manglares, cuerpos de agua, playones y sabanas.",
      "El agua es vida, memoria y territorio.",
    ),
    category: "Protección hídrica",
    location: "Colombia",
    coverImageUrl: asset("publicacion-ttf", "image.png"),
    galleryImageUrls: [asset("publicacion-ttf", "image.png")],
    visibility: "public",
    featured: false,
    publishedAt: "2025-09-12T10:00:00-05:00",
    createdAt: "2025-09-12T10:00:00-05:00",
    updatedAt: "2025-09-12T10:00:00-05:00",
  },
  {
    id: "lo-ultimo-rri-2025",
    slug: "sistema-areas-conservacion-comunitaria-2018-2025",
    title: "Consolidación del Sistema de Áreas de Conservación Comunitaria",
    summary:
      "Desde 2018 hasta 2025 el PCN avanzó en la implementación del Sistema de ACC, fortaleciendo el Gobierno Propio y la defensa del territorio con más de 144.580 hectáreas de protección comunitaria.",
    body: paragraphs(
      "Desde el año 2018 y hasta el 2025, el Proceso de Comunidades Negras – PCN ha avanzado de manera sostenida en la implementación y consolidación del Sistema de Áreas de Conservación Comunitaria, con la orientación de los mayores y mayoras y la participación de los renacientes. Asimismo, este proceso ha contribuido al fortalecimiento del Gobierno Propio de los Consejos Comunitarios del Pueblo Negro, en coherencia con su apuesta histórica por la defensa del territorio, la vida y la autonomía.",
      "A lo largo del proceso, las comunidades desarrollaron diversos ejercicios e instrumentos propios de gestión territorial, con alcances y coberturas diferenciadas, de acuerdo con su naturaleza, objetivos y decisiones comunitarias. Entre estos se destacan:",
      "Áreas de Conservación Comunitaria: identificación, delimitación y mapeo de áreas priorizadas por las comunidades para la conservación y la protección de ecosistemas estratégicos desde la visión propia del Pueblo Negro.",
      "Reglamentos internos: construcción y fortalecimiento de normas propias que regulan el uso, manejo, control y protección del territorio colectivo, reafirmando la autonomía y el ejercicio del Gobierno Comunitario.",
      "Planes de uso y manejo: elaboración de planes orientados al aprovechamiento sostenible del territorio, la planificación comunitaria y la armonización entre conservación, vida comunitaria y actividades productivas propias.",
      "Instrumentos propios de gestión territorial: cartografía social y territorial, delimitaciones participativas y otras herramientas comunitarias que fortalecen la gobernanza territorial desde el conocimiento, la memoria y la autoridad propia.",
      "Estos ejercicios se realizaron sobre porciones territoriales diferenciadas; sumados entre todos generan una extensión de protección con herramientas comunitarias de 144.580 hectáreas, amparadas por la Ley 70 de 1993 y sus decretos reglamentarios.",
      "Conservar usando es defender la vida, el territorio y la autonomía.",
    ),
    category: "Territorio",
    location: "Colombia",
    coverImageUrl: asset("publicacion-rri", "image.png"),
    galleryImageUrls: [asset("publicacion-rri", "image.png")],
    visibility: "public",
    featured: false,
    publishedAt: "2025-08-20T10:00:00-05:00",
    createdAt: "2025-08-20T10:00:00-05:00",
    updatedAt: "2025-08-20T10:00:00-05:00",
  },
];

const FORO_GLOBAL_BASE_PUBLISHED_AT = Date.parse("2025-06-20T23:00:00-05:00");

const foroGlobalEarthForumLinks: Array<[platform: string, title: string, url: string]> = [
  ["Instagram", "Foro global de la tierra que se realizara del 12 al 20 de junio 2025", "https://www.instagram.com/reel/DKiPwpxvRwO/?igsh=d3JpYjFsMWx0bnBo"],
  ["Instagram", "De el palenke kurualao se hace la invitación a seguir el foro global de la tierra", "https://www.instagram.com/reel/DKkZ6S7JIn2/?igsh=a3FsdjRnNmRrZjln"],
  ["Instagram", "Por primera vez la agenda afrodescendiente es eje estructurante del foro global de la tierra 2025", "https://www.instagram.com/reel/DKsPqYFpjRQ/?igsh=MWxiMjQxdTlyNDg0dA=="],
  ["Instagram", "Panel ”mujeres negras y  la tierra”", "https://www.instagram.com/p/DKxJqMbJNPW/?igsh=MTh3Njd5cXd0bjIwZQ=="],
  ["Instagram", "Rumbo al foro global de la tierra", "https://www.instagram.com/p/DK2ESrSMezG/?igsh=cmw4aTI3ZGJybGY0"],
  ["Instagram", "Compartiendo el panel “las mujeres negras y la tierra”", "https://www.instagram.com/p/DK4rxyyM-Fq/?igsh=MWVsb2thb3h4MTExeg=="],
  ["Instagram", "Armonización dinámica de conexión entre el continente africano y americano", "https://www.instagram.com/reel/DK5I1eypR25/?igsh=MW9vc29idTZ0dXV2NA=="],
  ["Instagram", "Visita de campo consejo comunitario  afro  mujeres del Patía", "https://www.instagram.com/p/DK5d7wxpKeP/?igsh=bTVhbXZtaWF4anB6"],
  ["Instagram", "Panel pre foro: tierra memoria y justicia un legado afrodescendiente", "https://www.instagram.com/reel/DK6wTKzOLMg/?igsh=MWloenNxbzljMGN1dg=="],
  ["Instagram", "Presenciamos pre foro: tierra memoria justicia un legado afrodescendiente", "https://www.instagram.com/p/DK76-vgphkm/?img_index=5&igsh=NTZ3MWJkY285cDlr"],
  ["Instagram", "Con el corazón en la tierra y la mirada en el futuro", "https://www.instagram.com/p/DK97JkwsAOy/?igsh=MThkbmQ4bnZnZ3Jzbw=="],
  ["Instagram", "Palabras de bienvenida de nuestros oradores y oradoras", "https://www.instagram.com/p/DK9_3yKOJGa/?igsh=MWRyb3ltbHVnd3lneg=="],
  ["Instagram", "Este 17 a las 11:30am acompáñanos en la mesa paralela", "https://www.instagram.com/p/DK-Q6Ftv6NS/?igsh=NHlzcjF0ZnV6MHpk"],
  ["Instagram", "Panel mesa paralela", "https://www.instagram.com/reel/DLAnJPuxJZz/?igsh=a251YnlscnlyYTNq"],
  ["Instagram", "La tierra es la posesión más sagrada de un pueblo", "https://www.instagram.com/reel/DLD9aNtv9Tj/?igsh=MWJreWM0dGx6ZjlxZg=="],
  ["Instagram", "Avanzando en los compromisos de tenencia de la tierra para la acción climática", "https://www.instagram.com/reel/DLH9uDkx7Vj/?igsh=MXc4cWlibGdsZ3ZmNw=="],
  ["Instagram", "Recorrido por el proceso del consejo comunitario de mujeres afro del Patía", "https://www.instagram.com/reel/DLafjTuB9rK/?igsh=MWZybWZmbXdrYzF6dg=="],
  ["X", "Invita a seguir caminado juntos por la defensa de la tierra y los derechos de la niñez negra", "https://x.com/renacientes/status/1930749320208252982"],
  ["X", "Agenda  logística", "https://x.com/renacientes/status/1930303649235804448"],
  ["X", "Agenda afrodescendiente con identidad política propia", "https://x.com/renacientes/status/1930303644517191849"],
  ["X", "Desde el palenke kurrulao se hace la invitación al foro global de la tierra", "https://x.com/renacientes/status/1931053059888803962"],
  ["X", "El pueblo negro afrocolombiano rizal y palenquero alzan su voz por la justicia territorial y el derecho a la tierra", "https://x.com/renacientes/status/1932163929201066100"],
  ["X", "Panel las mujeres negras y la tierra", "https://x.com/renacientes/status/1932845641668952345"],
  ["X", "Armonización y dinámica de conexión entre continente americano y africano", "https://x.com/renacientes/status/1933970280805716289"],
  ["X", "Un legado afrodescendiente, un espacio que reúne voces", "https://x.com/renacientes/status/1934198048516653380"],
  ["X", "Inicio de foro global de la tierra", "https://x.com/renacientes/status/1934198044422979739"],
  ["X", "Defiende territorio, siembran vida y fortalecen comunidad", "https://x.com/renacientes/status/1938658345432555879"],
  ["Facebook", "Agenda logística", "https://www.facebook.com/share/p/1AoQwLyF1x/"],
  ["Facebook", "Invita a seguir caminado juntos por la defensa de la tierra y los derechos de la niñez negra", "https://www.facebook.com/share/v/176JwnHn5M/"],
  ["Facebook", "Desde el palenke kurrulao se hace la invitación al foro global de la tierra", "https://www.facebook.com/share/v/1AwsAnYYh5/"],
  ["Facebook", "El pueblo negro afrocolombiano rizal y palenquero alzan su voz por la justicia territorial y el derecho a la tierra", "https://www.facebook.com/share/v/16hWpFUxj3/"],
  ["Facebook", "Las mujeres negras y la tierra", "https://www.facebook.com/share/p/1NqMhtWx8T/"],
  ["Facebook", "Rumbo al foro global de la tierra", "https://www.facebook.com/share/p/1EShVKpUMf/"],
  ["Facebook", "Compartiendo el panel “las mujeres negras y la tierra”", "https://www.facebook.com/share/p/1BxPE9b4yp/"],
  ["Facebook", "Armonización y dinámica de conexión entre continente americano y africano", "https://www.facebook.com/PCNcolombia/videos/697913156182459/"],
  ["Facebook", "Recorrido por el proceso del consejo comunitario de mujeres afro del Patía", "https://www.facebook.com/share/p/1QHpuYDqj2/"],
  ["Facebook", "Panel pre foro: tierra memoria y justicia un legado afrodescendiente", "https://www.facebook.com/share/p/1AzqL2hHKq/"],
  ["Facebook", "Presenciamos pre foro: tierra memoria y justicia un legado afrodescendiente", "https://www.facebook.com/share/p/19cAhfGYyw/"],
  ["Facebook", "Palabras de moderador", "https://www.facebook.com/share/v/1B2hV9p3ds/"],
  ["Facebook", "Con el corazón en la tierra y la mirada en el futuro", "https://www.facebook.com/share/p/1DrhkabUxT/"],
  ["Facebook", "Este 17 a las 11:30am acompáñanos en la mesa paralela", "https://www.facebook.com/share/p/14GvtpuQHkt/"],
  ["Facebook", "Este 17 a las 11:30am acompáñanos en la mesa paralela", "https://www.facebook.com/share/p/1ZiocU5Mx3/"],
  ["Facebook", "Recorrido por el proceso del consejo comunitario de mujeres afro del Patía", "https://www.facebook.com/share/p/1AP5CcLdio/"],
  ["Facebook", "El territorio es la vida, y la vida no se vende, se ama y se defiende.", "https://www.facebook.com/share/v/16FYRYY9gm/"],
  ["Facebook", "La Voz de la comunidad.", "https://www.facebook.com/share/r/16gj7bgQZB/"],
  ["Facebook", "Visita de campo consejo comunitario  afro  mujeres del Patía", "https://www.facebook.com/share/v/1CGLLiCnp4/"],
];

const foroGlobalEarthForumPublications: LoUltimoPublication[] = foroGlobalEarthForumLinks.map(
  ([platform, title, url], index) => {
    const publishedAt = new Date(FORO_GLOBAL_BASE_PUBLISHED_AT - index * 60 * 60 * 1000)
      .toISOString();
    const slug = `foro-global-tierra-2025-${String(index + 1).padStart(2, "0")}`;

    return {
      id: `lo-ultimo-fgt-2025-${String(index + 1).padStart(2, "0")}`,
      slug,
      title,
      summary: `Registro de publicación del Foro Global de la Tierra 2025 en ${platform}.`,
      body: "Enlace externo registrado en METRICA FORO GLOBAL DE LA TIERRA.docx.",
      category: "Foro Global de la Tierra",
      location: platform,
      coverImageUrl: null,
      galleryImageUrls: [],
      externalUrl: url,
      visibility: "public",
      featured: false,
      publishedAt,
      createdAt: publishedAt,
      updatedAt: publishedAt,
    };
  },
);

export const loUltimoPublications: LoUltimoPublication[] = [
  ...curatedLoUltimoPublications,
  ...foroGlobalEarthForumPublications,
];

export function getLoUltimoPublications(limit?: number) {
  const items = loUltimoPublications.slice();
  return typeof limit === "number" ? items.slice(0, limit) : items;
}

export function getLoUltimoPublicationBySlug(slug: string) {
  return loUltimoPublications.find((item) => item.slug === slug) ?? null;
}

export function toInternalNewsItem(item: LoUltimoPublication) {
  const { galleryImageUrls, ...rest } = item;
  void galleryImageUrls;
  return rest;
}
