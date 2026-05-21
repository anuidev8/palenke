import Link from "next/link";
import Image from "next/image";
import fs from "fs";
import path from "path";
import { ArrowLeft, BookOpen, Droplets, FileText, Gavel, LayoutDashboard, Leaf, Scale, Lock } from "lucide-react";
import { notFound } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import { SiteLayout } from "@/components/mock/ui";
import { hasSupabaseServiceConfig } from "@/lib/config";
import { listGrantedDocumentIdsForViewer } from "@/lib/document-access";
import { canDownloadDocument } from "@/lib/mock-data";
import { createSupabaseService } from "@/lib/supabase/service";
import { getViewerRequestState } from "@/lib/viewer-server";
import { type SearchParams, withRole } from "@/lib/viewer";

// ─── Instrument catalogue ────────────────────────────────────────────────────

function resolvePlaceholderImage(id: string) {
  const pngFile = path.join(process.cwd(), "public", "assets", "placeholders", `${id}.png`);
  if (fs.existsSync(pngFile)) {
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
    return { mode: "not-mapped" as const, docs: [] as SupabaseInstrumentDoc[] };
  }

  if (!hasSupabaseServiceConfig()) {
    return { mode: "missing-config" as const, docs: [] as SupabaseInstrumentDoc[] };
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
    return { mode: "missing-table" as const, docs: [] as SupabaseInstrumentDoc[] };
  }

  if (error) {
    console.error(`Failed to load documents for instrumento=${instrumento}:`, error);
    return { mode: "query-error" as const, docs: [] as SupabaseInstrumentDoc[] };
  }

  return { mode: "supabase" as const, docs: (data ?? []) as SupabaseInstrumentDoc[] };
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

// ─── Page ────────────────────────────────────────────────────────────────────

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
  const { mode: dbMode, docs: dbDocs } = await listSupabaseInstrumentDocs(instrumentoKey);
  const usesSupabaseDocs = dbMode === "supabase";

  const baseSupabaseDbDoc = usesSupabaseDocs
    ? (dbDocs.find((d) => d.visibility === "public") ?? null)
    : null;
  const baseSupabaseDoc: DisplayDoc | null = baseSupabaseDbDoc
    ? toDisplayDocFromSupabase(baseSupabaseDbDoc, inst.librarySection)
    : null;

  const tableDbDocs = dbDocs.filter((d) => d.visibility !== "public");
  const displayDocs: DisplayDoc[] = usesSupabaseDocs
    ? tableDbDocs.map((doc) => toDisplayDocFromSupabase(doc, inst.librarySection))
    : [];
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
  const requestHref = withRole(`/solicitar-acceso/${instrumento}`, role);
  const canDownloadBaseSupabaseDoc = baseSupabaseDoc
    ? canDownloadDocument(role, baseSupabaseDoc.visibility)
    : false;
  const showScitaAreasBoard = SCITA_AREAS_BOARD_INSTRUMENTS.has(instrumentoKey);
  const scitaAreasHref = withRole("/scita?tablero=conservacion", role);

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
        {/* Immersive Background Image */}
        {inst.imageUrl && (
          <Image
            src={inst.imageUrl}
            alt={inst.title}
            fill
            className="object-cover"
            priority
          />
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
            Volver a instrumentos
          </Link>
          
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div
              className="hidden shrink-0 items-center justify-center rounded-[24px] p-5 shadow-2xl backdrop-blur-md border border-white/20 sm:flex"
              style={{ background: "rgba(255,255,255,0.15)" }}
            >
              <Icon className="h-10 w-10 text-white" aria-hidden="true" />
            </div>
            <div className="max-w-3xl">
              <p className="mb-3 text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-white/80">
                {inst.eyebrow}
              </p>
              <h1 className="font-display text-4xl leading-[1.1] text-white sm:text-5xl lg:text-6xl drop-shadow-lg">
                {inst.title}
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Content Area (Overlapping) ── */}
      <section className="relative z-20 -mt-20 bg-[#fcfaf7] rounded-t-[40px] px-4 pt-16 pb-14 sm:px-6 lg:px-8 border-b border-[#e8dfd3] shadow-[0_-12px_40px_rgba(0,0,0,0.1)]">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-[1fr_400px] gap-12 lg:gap-16 items-start">
            
            {/* Left: Definition & Context */}
            <div className="space-y-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#e8dfd3] shadow-sm mb-6">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: inst.color }} />
                  <span className="text-xs font-bold tracking-widest uppercase text-[#4a4540]">
                    Definición y propósito
                  </span>
                </div>
                
                <h2 className="font-display text-3xl sm:text-4xl text-[#1a1a1a] mb-6">¿Qué es este instrumento?</h2>
                <div className="prose prose-lg max-w-none text-[#4a4540]">
                  <p className="font-medium text-[#1a1a1a] text-xl leading-relaxed mb-6">{inst.definition}</p>
                  <p className="text-lg leading-relaxed">{inst.context}</p>
                </div>
              </div>

              {/* Base Document Box (Enhanced UI) */}
              <div className="mt-12 relative overflow-hidden rounded-[24px] border border-[#e8dfd3] bg-white p-8 shadow-sm transition-shadow hover:shadow-md group">
                <div 
                  className="absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-10 blur-3xl pointer-events-none transition-transform duration-700 group-hover:scale-150" 
                  style={{ background: inst.color }} 
                />
                
                <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center">
                  <div
                    className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[20px] shadow-inner border border-black/5"
                    style={{ background: inst.lightBg, color: inst.color }}
                  >
                    <FileText className="h-8 w-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-2xl text-[#1a1a1a] mb-2">Documento base metodológico</h3>
                    <p className="text-base text-[#4a4540] leading-relaxed">
                      {baseSupabaseDoc
                        ? "Documento de referencia cargado en la base de datos para este instrumento."
                        : "Guía general y estructura modelo (sin información específica de Consejos). Acceso público."}
                    </p>
                  </div>
                  <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:items-end">
                    {baseSupabaseDoc ? (
                      canDownloadBaseSupabaseDoc ? (
                        <LoadingDownloadButton
                          href={baseSupabaseDoc.url}
                          label="Descargar documento"
                          className="inline-flex shrink-0 items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold transition hover:opacity-90 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5"
                          style={{ background: inst.color }}
                        />
                      ) : (
                        <Link
                          href={requestHref}
                          className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#e8dfd3] bg-[#f8f5f2] px-7 py-3.5 text-sm font-bold text-[#1a1a1a] hover:bg-[#f0ebe4]"
                        >
                          Solicitar acceso
                        </Link>
                      )
                    ) : (
                      <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#e8dfd3] bg-[#f4f1ec] px-7 py-3.5 text-sm font-bold text-[#7a756e]">
                        Documento pendiente de carga
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {showScitaAreasBoard ? (
                <div className="relative mt-6 overflow-hidden rounded-[24px] border border-[#e8dfd3] bg-white p-8 shadow-sm transition-shadow hover:shadow-md group">
                  <div
                    className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-10 blur-3xl transition-transform duration-700 group-hover:scale-150"
                    style={{ background: inst.color }}
                  />
                  <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center">
                    <div
                      className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[20px] border border-black/5 shadow-inner"
                      style={{ background: inst.lightBg, color: inst.color }}
                    >
                      <LayoutDashboard className="h-8 w-8" aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                      <h3 className="mb-2 font-display text-2xl text-[#1a1a1a]">Tablero de áreas en SCITA</h3>
                      <p className="text-base leading-relaxed text-[#4a4540]">
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
            <div className="sticky top-24 bg-white rounded-[32px] p-8 sm:p-10 border border-[#e8dfd3] shadow-md">
              <p className="eyebrow text-[#4a4540] mb-4">ALCANCE</p>
              <h3 className="font-display text-2xl text-[#1a1a1a] mb-8">Lo que cubre este instrumento</h3>
              
              <ul className="space-y-6">
                {inst.keyPoints.map((point, i) => (
                  <li key={point} className="flex items-start gap-4">
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold shadow-sm"
                      style={{ background: inst.lightBg, color: inst.color }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="mt-1 text-[15px] leading-relaxed text-[#4a4540]">{point}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Documentos / Biblioteca ── */}
      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 border-b border-[#e8dfd3] pb-6">
            <div>
              {isPublic ? (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-[#b45309] mb-4 border border-orange-200">
                  <Lock className="w-3.5 h-3.5" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {accessLevel === "coordination" ? "Validación de coordinación" : "Validación administrativa"}
                  </span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e3f2fd] text-[#1565c0] mb-4">
                  <Lock className="w-3.5 h-3.5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Acceso verificado</span>
                </div>
              )}
              <h2 className="font-display text-3xl text-[#1a1a1a]">Archivo de documentos</h2>
              <p className="mt-2 text-[#4a4540] text-lg">
                Explora los instrumentos y herramientas de gobierno propio de los Consejos Comunitarios.
              </p>
            </div>
          </div>

          <DocumentTree 
            docs={displayDocs} 
            role={role} 
            isAuthenticated={isAuthenticated}
            grantedDocIds={grantedDocIds}
            color={inst.color} 
            instrumento={instrumento}
            instrumentTitle={inst.title}
            accessLevel={accessLevel}
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
