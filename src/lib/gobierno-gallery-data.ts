import type { ViewerRole } from "@/lib/mock-data";
import type { PalenkeGalleryMedia } from "@/lib/palenke-gallery-media";

/** Sections used when filtering Gobierno Propio contextual content */
export const GOBIERNO_GALLERY_SECTIONS = [
  "Gobierno Propio",
  "Reglamentos internos",
  "Planes de uso y manejo",
  "Planes de etnodesarrollo",
  "Rutas de litigio estratégico",
] as const;

export type GobiernoGallerySection = (typeof GOBIERNO_GALLERY_SECTIONS)[number];

export type GobiernoGalleryMediaKind = PalenkeGalleryMedia["kind"];

export type GobiernoGalleryMedia = PalenkeGalleryMedia & {
  section: GobiernoGallerySection;
};

export const gobiernoPropioGalleryMedia: GobiernoGalleryMedia[] = [
  {
    id: "gov-gal-generated-video-mayo-2026",
    title: "Memoria en movimiento — Gobierno propio territorio vivo",
    section: "Gobierno Propio",
    type: "Video",
    description:
      "Pieza generada desde la colección territorial del Palenke para visibilizar el gobierno propio como práctica cotidiana y memoria organizativa.",
    territory: "Pacífico",
    council: "Palenke de Pensamiento · PCN",
    year: 2026,
    kind: "video",
    posterUrl: "/assets/gobierno-propio/memoria-video-poster-2026.png",
    mediaUrl:
      "https://res.cloudinary.com/dnmjmjdsj/video/upload/v1778886165/image/Generated_Video_May_15_2026_-_6_01PM_yglziv.mp4",
    visibility: "public",
  },
  {
    id: "gov-gal-asamblea-planificacion",
    title: "Asamblea de planificación territorial — Gobierno propio en acción",
    section: "Gobierno Propio",
    type: "Fotografía comunitaria",
    description:
      "Registro audiovisual de una asamblea comunitaria para acuerdos de ordenamiento territorial y participación decisoria desde el consejo.",
    territory: "Chocó",
    council: "Consejo Comunitario del Bajo Baudó",
    year: 2024,
    kind: "image",
    posterUrl:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2000&auto=format&fit=crop",
    mediaUrl:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2400&auto=format&fit=crop",
    visibility: "public",
  },
  {
    id: "gov-gal-etnodesarrollo-taller",
    title: "Taller vivencial de etnodesarrollo juvenil",
    section: "Planes de etnodesarrollo",
    type: "Video",
    description:
      "Compilación autorizada sobre prioridades económicas, culturales y organizativas desde las juventudes en el proceso de consejos comunitarios.",
    territory: "Guapi",
    council: "Proceso de Consejos Comunitarios de Guapi",
    year: 2024,
    kind: "video",
    posterUrl:
      "https://images.unsplash.com/photo-1511632765486-a01980e01e18?q=80&w=2000&auto=format&fit=crop",
    mediaUrl: "https://www.youtube.com/embed/JDikxFJAgVM",
    visibility: "public",
  },
  {
    id: "gov-gal-manglar-comite",
    title: "Guardianas y guardianes del manglar — Vigilancia comunitaria",
    section: "Planes de uso y manejo",
    type: "Fotografía comunitaria",
    description:
      "Imagen del comité ambiental revisando zonas de uso y preservación sin exponer ubicaciones sensibles.",
    territory: "Bajo Baudó",
    council: "Consejo Comunitario del Bajo Baudó",
    year: 2023,
    kind: "image",
    posterUrl:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2000&auto=format&fit=crop",
    mediaUrl:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2400&auto=format&fit=crop",
    visibility: "public",
  },
  {
    id: "gov-gal-reglamento-foro",
    title: "Foro territorial sobre reglas de convivencia y autoridad propia",
    section: "Reglamentos internos",
    type: "Video",
    description:
      "Fragmento público sobre acuerdos de convivencia y el papel del reglamento interno como instrumento vivo del consejo.",
    territory: "Nariño",
    council: "ORCONEPIAC",
    year: 2024,
    kind: "video",
    posterUrl:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2000&auto=format&fit=crop",
    mediaUrl: "https://www.youtube.com/embed/ScMzIjxBSq4",
    visibility: "public",
  },
  {
    id: "gov-gal-litigio-encuentro",
    title: "Encuentro de defensorías comunitarias y rutas jurídicas",
    section: "Rutas de litigio estratégico",
    type: "Fotografía comunitaria",
    description:
      "Documentación visual autorizada sobre intercambio de experiencias jurídicas y autoprotección territorial.",
    territory: "Pacífico nariñense",
    council: "Red Territorial Afrodescendiente",
    year: 2024,
    kind: "image",
    posterUrl:
      "https://images.unsplash.com/photo-1573497491208-01bfcbfc2d91?q=80&w=2000&auto=format&fit=crop",
    mediaUrl:
      "https://images.unsplash.com/photo-1573497491208-01bfcbfc2d91?q=80&w=2400&auto=format&fit=crop",
    visibility: "internal",
  },
  {
    id: "gov-gal-cultivos-manejo",
    title: "Circularidad económica y manejo comunitario de suelos",
    section: "Planes de uso y manejo",
    type: "Fotografía comunitaria",
    description:
      "Registro de prácticas agrocomunitarias alineadas con acuerdos de uso y manejo sin divulgar sitios delicados.",
    territory: "Cauca",
    council: "Consejo Comunitario Mayor de Capitanía",
    year: 2024,
    kind: "image",
    posterUrl:
      "https://images.unsplash.com/photo-1500937386664-c80d66dffb33?q=80&w=2000&auto=format&fit=crop",
    mediaUrl:
      "https://images.unsplash.com/photo-1500937386664-c80d66dffb33?q=80&w=2400&auto=format&fit=crop",
    visibility: "internal",
  },
  {
    id: "gov-gal-memoria-oral",
    title: "Cabildo abierto sobre memoria y continuidad del gobierno propio",
    section: "Gobierno Propio",
    type: "Video",
    description:
      "Cabildo público donde mayores autoridades y consejas relatan líneas históricas de autonomía comunitaria (extracto autorizado).",
    territory: "Cuenca del Naya",
    council: "Consejo Comunitario del río Naya",
    year: 2023,
    kind: "video",
    posterUrl:
      "https://images.unsplash.com/photo-1511632765486-a01980e01e18?q=80&w=2000&auto=format&fit=crop",
    mediaUrl: "https://www.youtube.com/embed/Zi_XLOBDo_Y",
    visibility: "public",
  },
  {
    id: "gov-gal-ped-visita",
    title: "Territorios de vida — visitas de seguimiento al plan de etnodesarrollo",
    section: "Planes de etnodesarrollo",
    type: "Fotografía comunitaria",
    description:
      "Mesa territorial de seguimiento a metas comunitarias con enfoque de género y participación adolescente.",
    territory: "Chocó",
    council: "Consejo Comunitario Diego Luis Córdoba",
    year: 2024,
    kind: "image",
    posterUrl:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773f?q=80&w=2000&auto=format&fit=crop",
    mediaUrl:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773f?q=80&w=2400&auto=format&fit=crop",
    visibility: "internal",
  },
] as const;

export function getVisibleGobiernoGalleryMedia(_role: ViewerRole): GobiernoGalleryMedia[] {
  return gobiernoPropioGalleryMedia.filter((item) => {
    if (item.visibility === "sensitive") return false;
    return true;
  });
}
