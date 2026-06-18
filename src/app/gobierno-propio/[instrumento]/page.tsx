import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, BookOpen, Droplets, FileText, Gavel, Heart, LayoutDashboard, Leaf, Scale, Lock, Shield, Users } from "lucide-react";
import { notFound } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import { SiteLayout } from "@/components/mock/ui";
import { hasSupabaseServiceConfig } from "@/lib/config";
import { listGrantedDocumentIdsForViewer } from "@/lib/document-access";
import { canDownloadDocument } from "@/lib/mock-data";
import {
  formatDocumentTerritory,
  formatDocumentYear,
  listInstrumentDocuments,
  type GobiernoPropioDocumentRow,
} from "@/lib/gobierno-propio-documents";
import {
  getSeguridadJuridicaDocumentBySlug,
  listSeguridadJuridicaDocuments,
  listSeguridadJuridicaSlugs,
} from "@/lib/seguridad-juridica-catalog";
import { createSupabaseService } from "@/lib/supabase/service";
import {
  getAccessValidationCopy,
  VERIFIED_ACCESS_COPY,
} from "@/lib/access-validation-copy";
import { getViewerRequestState } from "@/lib/viewer-server";
import { type SearchParams, withRole } from "@/lib/viewer";
import { SubmoduleOptionsColumn } from "@/components/palenke/SubmoduleOptionsColumn";
import { SeguridadJuridicaSearchBar } from "@/components/palenke/SeguridadJuridicaSearchBar";
import { SeguridadJuridicaFilterSummary } from "@/components/palenke/SeguridadJuridicaFilterSummary";
import {
  filterSeguridadJuridicaDocuments,
  getSeguridadJuridicaFacetOptions,
  getSeguridadJuridicaFrequentTopics,
  parseSeguridadJuridicaFilters,
  type SeguridadJuridicaFilterableDoc,
} from "@/lib/seguridad-juridica-filters";

// ─── Instrument catalogue ────────────────────────────────────────────────────

const PLACEHOLDER_PNG_IDS = new Set([
  "conservacion",
  "etnodesarrollo",
  "genero-familia",
  "planes-uso",
  "proteccion-hidrica",
  "reglamentos",
]);

function resolvePlaceholderImage(id: string) {
  if (PLACEHOLDER_PNG_IDS.has(id)) {
    return `/assets/placeholders/${id}.png`;
  }
  return `/assets/placeholders/${id}.svg`;
}

const instrumentos = {
  reglamentos: {
    title: "Reglamentos internos",
    eyebrow: "Instrumento 01",
    icon: FileText,
    color: "#2e7d32",
    lightBg: "#d8f3dc",
    imageUrl: resolvePlaceholderImage("reglamentos"),
    definition:
      "Un reglamento interno es el instrumento jurídico-político por medio del cual los Consejos Comunitarios establecen sus propias normas de convivencia, uso del territorio, toma de decisiones y resolución de conflictos internos. Es la expresión más concreta del gobierno propio y la autonomía étnico-territorial reconocida por la Ley 70 de 1993.",
    context:
      "Los reglamentos definen quiénes son miembros de la comunidad, cómo se eligen las Juntas de Consejo, qué usos se permiten sobre la tierra, cómo se cuida el agua y cómo se sanciona el incumplimiento de los acuerdos colectivos. Su elaboración es un proceso participativo de construcción normativa desde adentro.",
    keyPoints: [
      "Establece las normas de convivencia y uso del territorio",
      "Define la estructura de gobierno del Consejo Comunitario",
      "Mecanismos propios de resolución de conflictos",
      "Condiciones de pertenencia y participación comunitaria",
    ],
    librarySection: "Reglamentos",
    accessLevel: "admin",
  },
  "planes-uso": {
    title: "Planes de uso y manejo",
    eyebrow: "Instrumento 02",
    icon: BookOpen,
    color: "#1565c0",
    lightBg: "#e3f2fd",
    imageUrl: resolvePlaceholderImage("planes-uso"),
    definition:
      "Un Plan de Uso y Manejo (PUMA) es el instrumento de ordenamiento territorial afrodescendiente que establece las reglas y estrategias para el uso sostenible de los recursos naturales dentro del territorio colectivo. Es el plan de vida del territorio — articula conservación, producción y gobernanza.",
    context:
      "Los PUMA son elaborados participativamente por las comunidades con apoyo técnico y jurídico, e integran el conocimiento ancestral del Pueblo Negro con herramientas de planificación moderna. Definen zonas de conservación, áreas de producción, restricciones al extractivismo y estrategias de manejo de recursos hídricos, boscosos y de fauna.",
    keyPoints: [
      "Zonificación territorial para usos productivos y de conservación",
      "Estrategias de manejo de cuencas y bosques",
      "Restricciones al extractivismo y minería ilegal",
      "Articulación con planes de vida comunitarios",
    ],
    librarySection: "Planes de uso",
    accessLevel: "coordination",
  },
  litigio: {
    title: "Litigio estratégico",
    eyebrow: "Instrumento 03",
    icon: Scale,
    color: "#d32f2f",
    lightBg: "#fddede",
    imageUrl: resolvePlaceholderImage("reglamentos"),
    definition:
      "El litigio estratégico es el uso del sistema judicial como herramienta de defensa territorial y de derechos del Pueblo Negro. Incluye tutelas, acciones populares, derechos de petición y demandas ante instancias nacionales e internacionales para la protección de territorios colectivos, derechos a la consulta previa y garantías constitucionales.",
    context:
      "Casos emblemáticos como la Sentencia T-622 de 2016 que reconoció al Río Atrato como sujeto de derechos demuestran el poder del litigio estratégico para transformar el derecho ambiental y étnico colombiano. El Palenke acompaña a los Consejos Comunitarios en la construcción y seguimiento de estos procesos.",
    keyPoints: [
      "Tutelas para protección de derechos fundamentales y territoriales",
      "Acciones populares ante amenazas ambientales y extractivas",
      "Consulta previa libre e informada — Convenio 169 OIT",
      "Litigio climático y derechos de los ríos como sujetos",
    ],
    librarySection: "Litigio",
    accessLevel: "admin",
  },
  conservacion: {
    title: "Áreas bioculturales de conservación comunitaria",
    eyebrow: "Instrumento 04",
    icon: Leaf,
    color: "#2e7d32",
    lightBg: "#d8f3dc",
    imageUrl: resolvePlaceholderImage("conservacion"),
    definition:
      "Las Áreas Bioculturales de Conservación Comunitaria con Enfoque de Pueblo Negro (ABCC-PN) son figuras de conservación que las comunidades declaran sobre sus territorios para proteger ecosistemas estratégicos desde una perspectiva cultural y espiritual afrodescendiente. No son áreas protegidas del Estado — son figuras propias, de gobierno propio.",
    context:
      "Estas áreas integran biodiversidad, cultura, memoria y espiritualidad. Protegen ciénagas, selvas, ríos sagrados y lugares de significado ancestral del Pueblo Negro. Su declaratoria requiere acuerdo interno del Consejo Comunitario y se acompaña de un plan de manejo biocultural propio.",
    keyPoints: [
      "Figuras propias de conservación — no dependen del Estado",
      "Integran biodiversidad, cultura y espiritualidad",
      "Protegen ecosistemas estratégicos del Pacífico",
      "Requieren plan de manejo biocultural comunitario",
    ],
    librarySection: "Conservación",
    accessLevel: "coordination",
  },
  etnodesarrollo: {
    title: "Etnodesarrollo",
    eyebrow: "Instrumento 05",
    icon: Gavel,
    color: "#f57f17",
    lightBg: "#fff3cd",
    imageUrl: resolvePlaceholderImage("etnodesarrollo"),
    definition:
      "El etnodesarrollo es el derecho del Pueblo Negro a definir sus propios modelos de desarrollo desde su cosmovisión, cultura y prioridades colectivas — en contraposición a modelos extractivistas impuestos desde afuera. Comprende propuestas de economía propia, soberanía alimentaria y proyectos de vida territorial.",
    context:
      "Los instrumentos de etnodesarrollo recogen acuerdos, propuestas productivas y planes de vida que articulan la economía comunitaria con la conservación del territorio y la reproducción cultural del Pueblo Negro. Incluye iniciativas de pesca, agricultura tradicional, medicina ancestral y turismo comunitario.",
    keyPoints: [
      "Economía propia afroterritorial — alternativa al extractivismo",
      "Soberanía alimentaria y sistemas productivos ancestrales",
      "Turismo comunitario con enfoque cultural",
      "Articulación entre producción y conservación territorial",
    ],
    librarySection: "Etnodesarrollo",
    accessLevel: "admin",
  },
  "proteccion-hidrica": {
    title: "Protección hídrica",
    eyebrow: "Instrumento 06",
    icon: Droplets,
    color: "#1565c0",
    lightBg: "#e3f2fd",
    imageUrl: resolvePlaceholderImage("proteccion-hidrica"),
    definition:
      "La protección hídrica comprende los instrumentos jurídicos, normativos y comunitarios para la defensa de ríos, cuencas, ciénagas y fuentes de agua dentro de los territorios colectivos. El agua es sujeto de derechos y principio fundamental de la vida del Pueblo Negro del Pacífico colombiano.",
    context:
      "La minería ilegal, los cultivos de uso ilícito, la deforestación y el vertimiento de agroquímicos amenazan las cuencas del Pacífico. El Palenke desarrolla estrategias comunitarias de monitoreo, litigio y acción política para defender el agua como bien común y sagrado. La Sentencia T-622 (Río Atrato) es el hito jurídico más importante de esta lucha.",
    keyPoints: [
      "Resoluciones de protección de cuencas y fuentes de agua",
      "Monitoreo comunitario de calidad hídrica",
      "Litigio para defensa de ríos como sujetos de derechos",
      "Planes de manejo de cuencas en territorios colectivos",
    ],
    librarySection: "Protección hídrica",
    accessLevel: "admin",
  },
  "seguridad-juridica": {
    title: "Seguridad jurídica de la tierra",
    eyebrow: "Módulo especial",
    icon: Shield,
    color: "#2e7d32",
    lightBg: "#d8f3dc",
    imageUrl: resolvePlaceholderImage("seguridad-juridica"),
    definition:
      "En este módulo encontrarás información sobre fortalecimiento organizativo, género, protección y saneamiento, titulación y ampliación de territorios colectivos.",
    context:
      "Su propósito es aportar al gobierno propio, la autonomía comunitaria y la defensa integral del territorio, entendido como espacio de vida, memoria, cultura y permanencia del Pueblo Negro.\n\nAlgunos contenidos serán de acceso público y otros tendrán acceso restringido mediante usuario, contraseña o solicitud previa, para proteger la información sensible y la soberanía de datos de las comunidades.",
    keyPoints: [
      "Fortalecimiento organizativo y de capacidades",
      "Perspectiva de género en la gobernanza",
      "Protección, linderos y saneamiento territorial",
      "Titulación y ampliación de territorios colectivos",
    ],
    submodules: [
      {
        id: "fortalecimiento",
        title: "Fortalecimiento",
        bullets: [
          "Fortalecimiento organizativo y político",
          "Capacitación en gobernanza autónoma",
        ],
        color: "#2e7d32",
        lightBg: "#f1f8e9",
        href: "/gobierno-propio/seguridad-juridica?submodulo=fortalecimiento",
      },
      {
        id: "genero",
        title: "Género",
        bullets: [
          "Género e inclusión en la gobernanza de tierras",
          "Participación de mujeres y jóvenes",
        ],
        color: "#e65100",
        lightBg: "#fff3e0",
        href: "/gobierno-propio/seguridad-juridica?submodulo=genero",
      },
      {
        id: "proteccion",
        title: "Protección y saneamiento",
        bullets: [
          "Protección de linderos ancestrales",
          "Saneamiento físico y jurídico de tierras",
        ],
        color: "#00838f",
        lightBg: "#e0f7fa",
        href: "/gobierno-propio/seguridad-juridica?submodulo=proteccion",
      },
      {
        id: "titulacion",
        title: "Titulación y ampliación",
        bullets: [
          "Titulación colectiva de tierras",
          "Procesos de ampliación de territorios",
        ],
        color: "#1565c0",
        lightBg: "#e3f2fd",
        href: "/gobierno-propio/seguridad-juridica?submodulo=titulacion",
      },
    ],
    librarySection: "Seguridad jurídica de la tierra",
    accessLevel: "admin",
  },
  "genero-familia": {
    title: "Género, Generación y Familia",
    eyebrow: "Módulo Palenke",
    icon: Heart,
    color: "#7b1fa2",
    lightBg: "#f3e5f5",
    imageUrl: resolvePlaceholderImage("genero-familia"),
    definition:
      "El módulo de Género, Generación y Familia es un espacio del Palenke de Pensamiento orientado a reconocer y fortalecer las relaciones de cuidado, participación, respeto y dignidad que sostienen la vida comunitaria, organizativa y territorial del Pueblo Negro.",
    context:
      "Este módulo permite visibilizar el papel de las mujeres, las juventudes, las personas mayores, las familias y los liderazgos comunitarios en los procesos de gobierno propio, memoria, protección del territorio y construcción colectiva. A través de este espacio se reúnen reflexiones, herramientas y aprendizajes que aportan a relaciones más justas, corresponsables y libres de discriminación, promoviendo una mirada integral sobre el género, las generaciones y la familia como dimensiones fundamentales para cuidar la vida, fortalecer la organización y avanzar en procesos comunitarios más incluyentes.",
    keyPoints: [
      "Relaciones de cuidado y participación comunitaria",
      "Visibilización del rol de mujeres y jóvenes",
      "Liderazgos comunitarios y familiares",
      "Construcción de espacios libres de discriminación",
    ],
    librarySection: "Género, Generación y Familia",
    accessLevel: "admin",
  },
} as const;

type InstrumentoSlug = keyof typeof instrumentos;

const SCITA_AREAS_BOARD_INSTRUMENTS = new Set<InstrumentoSlug>(["conservacion", "proteccion-hidrica"]);
type AccessLevel = "admin" | "coordination";
type DocumentVisibility = "public" | "internal" | "sensitive";

type SupabaseInstrumentDoc = {
  id: string;
  title: string;
  instrument: string;
  council: string | null;
  visibility: DocumentVisibility;
  storage_path: string | null;
  published_on: string | null;
  territory: string | null;
  department: string | null;
  municipality: string | null;
  created_at: string;
};

import { DocumentTree, type DisplayDoc } from "@/components/palenke/DocumentTree";
import { LoadingDownloadButton } from "@/components/palenke/LoadingDownloadButton";

const dbInstrumentMap: Partial<Record<InstrumentoSlug, string>> = {
  reglamentos: "reglamentos",
  "planes-uso": "planes-uso",
  etnodesarrollo: "etnodesarrollo",
  conservacion: "conservacion",
  "genero-familia": "genero-familia",
  "seguridad-juridica": "seguridad-juridica",
};

function isMissingTableError(error: unknown) {
  if (!error || typeof error !== "object") return false;
  const maybeCode = "code" in error ? String(error.code) : "";
  const maybeMessage = "message" in error ? String(error.message) : "";
  return maybeCode === "PGRST205" || maybeMessage.includes("schema cache");
}

function formatDocTerritory(doc: SupabaseInstrumentDoc) {
  if (doc.municipality && doc.department) {
    return `Municipio de ${doc.municipality}, Departamento del ${doc.department}`;
  }
  return doc.territory ?? doc.council ?? "Consejo comunitario";
}

function formatDocYear(doc: SupabaseInstrumentDoc) {
  const yearPattern = /^(\d{4})/;

  if (doc.published_on) {
    const match = doc.published_on.match(yearPattern);
    if (match) return match[1];
  }

  if (doc.created_at) {
    const match = doc.created_at.match(yearPattern);
    if (match) return match[1];
  }

  const parsedYear = new Date(doc.created_at).getUTCFullYear();
  if (Number.isNaN(parsedYear)) {
    return String(new Date().getUTCFullYear());
  }
  return String(parsedYear);
}

async function listSupabaseInstrumentDocs(instrumento: InstrumentoSlug) {
  const mapped = dbInstrumentMap[instrumento];
  if (!mapped) {
    return { mode: "not-mapped" as const, docs: [] as SupabaseInstrumentDoc[], catalogDocs: [] as GobiernoPropioDocumentRow[] };
  }

  if (instrumento === "seguridad-juridica") {
    const catalogResult = await listSeguridadJuridicaDocuments();
    return {
      mode: catalogResult.mode,
      docs: [] as SupabaseInstrumentDoc[],
      catalogDocs: catalogResult.docs,
    };
  }

  if (!hasSupabaseServiceConfig()) {
    return { mode: "missing-config" as const, docs: [] as SupabaseInstrumentDoc[], catalogDocs: [] as GobiernoPropioDocumentRow[] };
  }

  const supabase = createSupabaseService();
  const { data, error } = await supabase
    .from("documents")
    .select(
      "id,title,instrument,council,visibility,storage_path,published_on,territory,department,municipality,created_at",
    )
    .eq("instrument", mapped)
    .order("published_on", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error && isMissingTableError(error)) {
    return { mode: "missing-table" as const, docs: [] as SupabaseInstrumentDoc[], catalogDocs: [] as GobiernoPropioDocumentRow[] };
  }

  if (error) {
    console.error(`Failed to load documents for instrumento=${instrumento}:`, error);
    return { mode: "query-error" as const, docs: [] as SupabaseInstrumentDoc[], catalogDocs: [] as GobiernoPropioDocumentRow[] };
  }

  return { mode: "supabase" as const, docs: (data ?? []) as SupabaseInstrumentDoc[], catalogDocs: [] as GobiernoPropioDocumentRow[] };
}

function toDisplayDocFromCatalog(
  doc: GobiernoPropioDocumentRow,
  section: string,
  instrumento: string,
): SeguridadJuridicaFilterableDoc {
  const hasDirectPublicPath = doc.visibility === "public" && Boolean(doc.storage_path?.startsWith("/"));
  const usesSignedUrl = !hasDirectPublicPath;
  const slug = doc.slug ?? doc.id;
  const catalogId = slug.match(/^(\d+)/)?.[1] ?? doc.id;

  return {
    id: doc.id,
    title: doc.title,
    section,
    type: doc.document_type ?? "Documento",
    council: doc.council ?? undefined,
    territory: formatDocumentTerritory(doc),
    year: formatDocumentYear(doc),
    visibility: doc.visibility,
    action: "file",
    fileLabel: "Descargar",
    url: hasDirectPublicPath
      ? (doc.storage_path as string)
      : `/api/documents/${doc.id}/signed-url?mode=redirect`,
    usesSignedUrl,
    storagePath: doc.storage_path,
    submodule: doc.submodule ?? undefined,
    previewHref: `/gobierno-propio/${instrumento}/${slug}`,
    author: doc.author ?? undefined,
    theme: doc.theme ?? undefined,
    summary: doc.summary ?? undefined,
    catalogId,
    format: doc.format ?? undefined,
    keywords: doc.keywords ?? undefined,
    subtheme: doc.subtheme ?? undefined,
  };
}

function toDisplayDocFromSupabase(doc: SupabaseInstrumentDoc, section: string): DisplayDoc {
  const hasDirectPublicPath = doc.visibility === "public" && Boolean(doc.storage_path?.startsWith("/"));
  const usesSignedUrl = !hasDirectPublicPath;

  return {
    id: doc.id,
    title: doc.title,
    section,
    type: "Documento",
    territory: formatDocTerritory(doc),
    year: formatDocYear(doc),
    visibility: doc.visibility,
    action: "file",
    fileLabel: "Descargar",
    url: hasDirectPublicPath
      ? (doc.storage_path as string)
      : `/api/documents/${doc.id}/signed-url?mode=redirect`,
    usesSignedUrl,
    storagePath: doc.storage_path,
  };
}

const SEGURIDAD_JURIDICA_DEFAULT_SUBMODULE = "fortalecimiento";

export default async function InstrumentoPage({
  params,
  searchParams,
}: {
  params: Promise<{ instrumento: string }>;
  searchParams: Promise<SearchParams>;
}) {
  noStore();
  const { instrumento } = await params;
  const sp = await searchParams;
  const sessionState = await getViewerRequestState(sp);
  const role = sessionState.role;
  const isAuthenticated = sessionState.isAuthenticated;

  if (!(instrumento in instrumentos)) notFound();
  const instrumentoKey = instrumento as InstrumentoSlug;

  const inst = instrumentos[instrumentoKey];
  const Icon = inst.icon;
  const { mode: dbMode, docs: dbDocs, catalogDocs } = await listSupabaseInstrumentDocs(instrumentoKey);
  const usesSupabaseDocs = dbMode === "supabase";

  const baseSupabaseDbDoc = usesSupabaseDocs
    ? (dbDocs.find((d) => d.visibility === "public") ?? null)
    : null;
  const baseSupabaseDoc: DisplayDoc | null = baseSupabaseDbDoc
    ? toDisplayDocFromSupabase(baseSupabaseDbDoc, inst.librarySection)
    : null;

  const tableDbDocs = dbDocs.filter((d) => d.visibility !== "public");
  let displayDocs: (DisplayDoc & { submodule?: string; previewHref?: string })[] = usesSupabaseDocs
    ? tableDbDocs.map((doc) => toDisplayDocFromSupabase(doc, inst.librarySection))
    : [];

  const activeSubmodule =
    instrumentoKey === "seguridad-juridica"
      ? typeof sp.submodulo === "string"
        ? sp.submodulo
        : SEGURIDAD_JURIDICA_DEFAULT_SUBMODULE
      : typeof sp.submodulo === "string"
        ? sp.submodulo
        : undefined;

  const seguridadJuridicaFilters =
    instrumentoKey === "seguridad-juridica" ? parseSeguridadJuridicaFilters(sp) : null;

  if (instrumentoKey === "seguridad-juridica" && catalogDocs.length > 0) {
    displayDocs = catalogDocs.map((doc) =>
      toDisplayDocFromCatalog(doc, inst.librarySection, instrumentoKey),
    );
  }

  const seguridadJuridicaSubmoduleDocs =
    instrumentoKey === "seguridad-juridica" && activeSubmodule
      ? (displayDocs as SeguridadJuridicaFilterableDoc[]).filter(
          (doc) => doc.submodule === activeSubmodule,
        )
      : (displayDocs as SeguridadJuridicaFilterableDoc[]);

  const seguridadJuridicaFacetOptions =
    instrumentoKey === "seguridad-juridica"
      ? getSeguridadJuridicaFacetOptions(seguridadJuridicaSubmoduleDocs)
      : null;

  const seguridadJuridicaFrequentTopics =
    instrumentoKey === "seguridad-juridica"
      ? getSeguridadJuridicaFrequentTopics(seguridadJuridicaSubmoduleDocs)
      : [];

  const filteredDisplayDocs =
    instrumentoKey === "seguridad-juridica" && seguridadJuridicaFilters
      ? filterSeguridadJuridicaDocuments(seguridadJuridicaSubmoduleDocs, seguridadJuridicaFilters)
      : displayDocs;

  const grantedDocIds = sessionState.isAuthenticated
    ? Array.from(
        await listGrantedDocumentIdsForViewer({
          documentIds: displayDocs.map((doc) => doc.id),
          userId: sessionState.userId,
          email: sessionState.email,
        }),
      )
    : [];

  const isPublic = role === "public";
  const accessLevel = inst.accessLevel as AccessLevel;
  const validationCopy = getAccessValidationCopy(accessLevel);
  const requestHref = withRole(`/solicitar-acceso/${instrumento}`, role);
  const canDownloadBaseSupabaseDoc = baseSupabaseDoc
    ? canDownloadDocument(role, baseSupabaseDoc.visibility)
    : false;
  const showScitaAreasBoard = SCITA_AREAS_BOARD_INSTRUMENTS.has(instrumentoKey);
  const scitaAreasHref = withRole("/scita?tablero=conservacion", role);
  const hasSubmodules = "submodules" in inst;

  return (
    <SiteLayout
      role={role}
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "Gobierno Propio", href: "/gobierno-propio" },
        { label: inst.title },
      ]}
    >
      {/* ── Hero with Background Image ── */}
      <section className="relative w-full h-[55vh] min-h-[500px] flex items-end pb-32 bg-[#1a1a1a]">
        {/* Immersive Background Image or Video */}
        {instrumentoKey === "seguridad-juridica" || instrumentoKey === "genero-familia" ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover opacity-85"
          >
            <source
              src={
                instrumentoKey === "genero-familia"
                  ? "/videos/genero-familia-hero.mp4"
                  : "/videos/justicia-libertad.mp4"
              }
              type="video/mp4"
            />
          </video>
        ) : (
          inst.imageUrl && (
            <Image
              src={inst.imageUrl}
              alt={inst.title}
              fill
              className="object-cover"
              priority
            />
          )
        )}
        
        {/* Gradient Overlays for Readability and Mood */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/70 to-[#1a1a1a]/20" />
        <div 
          className="absolute inset-0 mix-blend-multiply opacity-50" 
          style={{ backgroundColor: inst.color }} 
        />

        {/* Hero Content */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href={withRole("/gobierno-propio", role)}
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-white/80 transition hover:text-white bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {instrumentoKey === "genero-familia" ? "Volver a Gobierno Propio" : "Volver a instrumentos"}
          </Link>
          
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div
              className="hidden shrink-0 items-center justify-center rounded-[24px] p-5 shadow-2xl backdrop-blur-md border border-white/20 sm:flex"
              style={{ background: "rgba(255,255,255,0.15)" }}
            >
              <Icon className="h-10 w-10 text-white" aria-hidden="true" />
            </div>
            <div className="max-w-3xl">
              {instrumentoKey !== "genero-familia" && (
                <p className="mb-3 text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-white/80">
                  {inst.eyebrow}
                </p>
              )}
              <h1 className="font-display text-4xl leading-[1.1] text-white sm:text-5xl lg:text-6xl drop-shadow-lg">
                {inst.title}
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Content Area (Overlapping) ── */}
      <section className="relative z-20 -mt-20 bg-[#fcfaf7] rounded-t-[40px] px-4 pt-16 pb-14 sm:px-6 lg:px-8 border-b border-[#e8dfd3] shadow-[0_-12px_40px_rgba(0,0,0,0.1)] overflow-hidden">
        {/* Dribbble-style Afro Abstract Background Graphics */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {/* Topographic organic afro-territorial lines - using dynamic instrument brand color */}
          <svg 
            className="absolute -top-[10%] -right-[5%] w-[800px] h-[800px] rotate-[15deg] transition-all duration-1000" 
            style={{ color: `${inst.color}` }}
            opacity="0.04"
            viewBox="0 0 400 400" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="5" 
            strokeLinecap="round" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M 50 200 Q 100 100 200 200 T 350 200" />
            <path d="M 50 230 Q 100 130 200 230 T 350 230" />
            <path d="M 50 260 Q 100 160 200 260 T 350 260" />
            <path d="M 50 290 Q 100 190 200 290 T 350 290" />
            <path d="M 50 320 Q 100 220 200 320 T 350 320" />
            <circle cx="200" cy="200" r="100" strokeWidth="3" strokeDasharray="8 8" />
            <circle cx="200" cy="200" r="140" strokeWidth="2" />
          </svg>

          {/* Abstract solid shapes representing earth and roots */}
          <svg 
            className="absolute -bottom-12 -left-12 w-[480px] h-[480px]" 
            style={{ color: `${inst.color}` }}
            opacity="0.03"
            fill="currentColor" 
            viewBox="0 0 200 200" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 200 L 200 200 L 200 100 Q 150 50 100 100 T 0 100 Z" />
            <circle cx="50" cy="150" r="20" fill="#fcfaf7" />
            <circle cx="150" cy="150" r="10" fill="#fcfaf7" />
          </svg>

          {/* Warm energetic glows based on instrument color */}
          <div 
            className="absolute bottom-0 right-1/3 w-[500px] h-[500px] rounded-full blur-[130px] opacity-25" 
            style={{ background: `radial-gradient(circle, ${inst.color} 0%, transparent 70%)` }}
          />
          <div 
            className="absolute top-10 left-12 w-[350px] h-[350px] rounded-full blur-[110px] opacity-15" 
            style={{ background: `radial-gradient(circle, ${inst.color} 0%, transparent 70%)` }}
          />
          
          {/* Very faint tribal pattern mask */}
          <div className="absolute inset-0 opacity-[0.015] mix-blend-multiply" style={{ backgroundImage: "radial-gradient(#1a1a1a 2px, transparent 2px)", backgroundSize: "32px 32px" }} />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className={hasSubmodules ? "w-full" : "grid lg:grid-cols-[1fr_420px] gap-12 lg:gap-16 items-start"}>
            
            {/* Left: Definition & Context */}
            <div className={hasSubmodules ? "space-y-10 w-full" : "space-y-10"}>
              <div>
                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-[#e8dfd3] shadow-[0_2px_8px_rgba(0,0,0,0.02)] mb-6 transition-all duration-300 hover:border-[#d6c7b9]">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: inst.color }}></span>
                    <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: inst.color }}></span>
                  </span>
                  <span className="text-xs font-bold tracking-widest uppercase text-[#5a5550]">
                    Definición y propósito
                  </span>
                </div>
                
                {instrumentoKey !== "seguridad-juridica" ? (
                  <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#1a1a1a] mb-6 tracking-tight">
                    ¿Qué es este instrumento?
                  </h2>
                ) : null}
                <div className="prose prose-lg max-w-none text-[#4a4540]">
                  <p className="font-medium text-[#1a1a1a] text-xl lg:text-2xl leading-relaxed mb-6 border-l-4 pl-4" style={{ borderColor: inst.color }}>
                    {inst.definition}
                  </p>
                  <p className="text-lg leading-relaxed text-[#5a5550]">{inst.context}</p>
                </div>
              </div>

              {"submodules" in inst ? (
                <div
                  className={`pt-8 border-t border-[#e8dfd3]/60 w-full relative${
                    instrumentoKey === "seguridad-juridica" ? " hidden lg:block" : ""
                  }`}
                >
                  <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#f4f1ec] border border-[#e8dfd3] mb-5">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: inst.color }} />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#5a5550]">SUBMÓDULOS</span>
                  </div>
                  <h3 className="font-display text-2xl text-[#1a1a1a] mb-6 font-semibold tracking-tight">Líneas de trabajo</h3>
                  <SubmoduleOptionsColumn
                    items={inst.submodules as any}
                    role={role}
                    layout="horizontal"
                    mode="filter"
                    activeId={activeSubmodule}
                    filterBasePath={`/gobierno-propio/${instrumentoKey}`}
                  />
                </div>
              ) : null}

              {showScitaAreasBoard ? (
                <div 
                  className="relative mt-6 overflow-hidden rounded-[28px] border bg-white p-8 lg:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-500 hover:shadow-[0_15px_40px_rgba(0,0,0,0.05)] hover:-translate-y-1 group"
                  style={{ borderColor: `${inst.color}25` }}
                >
                  <div
                    className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-10 blur-3xl transition-transform duration-1000 group-hover:scale-150"
                    style={{ background: inst.color }}
                  />
                  <div className="relative z-10 flex flex-col gap-8 sm:flex-row sm:items-center">
                    <div
                      className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[22px] border border-black/5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] transition-transform duration-500 group-hover:-rotate-3"
                      style={{ background: `linear-gradient(135deg, ${inst.lightBg}, ${inst.lightBg}aa)`, color: inst.color }}
                    >
                      <LayoutDashboard className="h-8 w-8" aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#8a8074] mb-1 block">Monitoreo Territorial</span>
                      <h3 className="mb-2 font-display text-2xl text-[#1a1a1a] font-semibold">Tablero de áreas en SCITA</h3>
                      <p className="text-base leading-relaxed text-[#5a5045]">
                        Visualiza el estado de las áreas de conservación comunitaria, ecosistemas estratégicos y
                        señales de presión ambiental en el territorio.
                      </p>
                    </div>
                    <Link
                      href={scitaAreasHref}
                      className="inline-flex shrink-0 items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:opacity-90 hover:shadow-lg"
                      style={{ background: inst.color }}
                    >
                      <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
                      Explorar tablero de áreas
                    </Link>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Right: Key points & actions (Sticky Sidebar) */}
            {!hasSubmodules ? (
              <div className="sticky top-24 bg-white/90 backdrop-blur-md rounded-[36px] p-8 sm:p-10 border border-[#e8dfd3] shadow-[0_12px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition-all duration-500">
                <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#f4f1ec] border border-[#e8dfd3] mb-5">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: inst.color }} />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#5a5550]">ALCANCE</span>
                </div>
                <h3 className="font-display text-3xl text-[#1a1a1a] mb-8 font-semibold tracking-tight">Lo que cubre</h3>
                
                <ul className="space-y-6">
                  {inst.keyPoints.map((point, i) => (
                    <li key={point} className="flex items-start gap-4 group/point">
                      <span
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold shadow-sm transition-transform duration-300 group-hover/point:scale-110"
                        style={{ background: `linear-gradient(135deg, ${inst.lightBg}, ${inst.lightBg}aa)`, color: inst.color }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="mt-1 text-[15px] leading-relaxed text-[#4a4540] transition-colors duration-200 group-hover/point:text-black">{point}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* ── Documentos / Biblioteca ── */}
      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {instrumentoKey !== "seguridad-juridica" ? (
            <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 border-b border-[#e8dfd3] pb-6">
              <div>

                <h2 className="font-display text-3xl text-[#1a1a1a]">Archivo de documentos</h2>
                <p className="mt-2 text-lg text-[#4a4540]">
                  {isPublic ? validationCopy.sectionDescription : VERIFIED_ACCESS_COPY.sectionDescription}
                </p>
              </div>
            </div>
          ) : null}

          {baseSupabaseDoc && canDownloadBaseSupabaseDoc ? (
            <div
              className="mb-10 overflow-hidden rounded-[28px] border bg-[#fcfaf7] p-6 sm:p-8"
              style={{ borderColor: `${inst.color}30` }}
            >
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] border border-black/5"
                    style={{ background: `linear-gradient(135deg, ${inst.lightBg}, ${inst.lightBg}aa)`, color: inst.color }}
                  >
                    <FileText className="h-7 w-7" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-[#8a8074]">
                      Documento público
                    </p>
                    <h3 className="font-display text-xl text-[#1a1a1a] sm:text-2xl">{baseSupabaseDoc.title}</h3>
                    <p className="mt-2 text-sm text-[#5a5045]">
                      Presentación metodológica general del instrumento. Disponible para descarga sin acceso restringido.
                    </p>
                  </div>
                </div>
                <LoadingDownloadButton
                  href={baseSupabaseDoc.url}
                  label="Descargar presentación"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:opacity-90 hover:shadow-lg"
                  style={{ background: inst.color }}
                />
              </div>
            </div>
          ) : null}

          {instrumentoKey === "seguridad-juridica" && seguridadJuridicaFilters && seguridadJuridicaFacetOptions ? (
            <div className="mb-8 space-y-6 rounded-[32px] border border-[#e8dfd3] bg-[#fcfaf7] p-6 shadow-sm sm:p-8">
              <SeguridadJuridicaSearchBar
                role={role}
                instrumento={instrumentoKey}
                submodulo={activeSubmodule ?? SEGURIDAD_JURIDICA_DEFAULT_SUBMODULE}
                accentColor={inst.color}
                filters={seguridadJuridicaFilters}
                facets={seguridadJuridicaFacetOptions}
                frequentTopics={seguridadJuridicaFrequentTopics}
              />
              <SeguridadJuridicaFilterSummary
                role={role}
                instrumento={instrumentoKey}
                submodulo={activeSubmodule ?? SEGURIDAD_JURIDICA_DEFAULT_SUBMODULE}
                filters={seguridadJuridicaFilters}
                totalCount={filteredDisplayDocs.length}
              />
            </div>
          ) : null}

          <DocumentTree 
            docs={filteredDisplayDocs} 
            role={role} 
            isAuthenticated={isAuthenticated}
            grantedDocIds={grantedDocIds}
            color={inst.color} 
            instrumento={instrumento}
            instrumentTitle={inst.title}
            accessLevel={accessLevel}
            submodules={"submodules" in inst ? (inst.submodules as any) : undefined}
            initialSubmodule={activeSubmodule}
            requireSubmoduleFilter={instrumentoKey === "seguridad-juridica"}
            hideSearch={instrumentoKey === "seguridad-juridica"}
          />

          {dbMode === "query-error" ? (
            <p className="mt-4 text-sm text-[#9c5d00]">
              No se pudo consultar la base de datos para este instrumento.
            </p>
          ) : null}

        </div>
      </section>

      {/* ── Navegación entre instrumentos ── */}
      <section className="border-t border-[#e8dfd3] bg-[#fcfaf7] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href={withRole("/gobierno-propio", role)}
            className="inline-flex items-center gap-2 text-sm font-bold text-[#4a4540] transition hover:text-[#1a1a1a]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Volver a instrumentos de gobierno propio
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
