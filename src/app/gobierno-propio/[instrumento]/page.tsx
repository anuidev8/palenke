import Link from "next/link";
import Image from "next/image";
import fs from "fs";
import path from "path";
import { ArrowLeft, ArrowRight, BookOpen, Download, Droplets, ExternalLink, FileText, Gavel, Leaf, Scale, Lock, UserCircle } from "lucide-react";
import { notFound } from "next/navigation";
import { SiteLayout } from "@/components/mock/ui";
import { getVisibleDocuments } from "@/lib/mock-data";
import { getViewerRole, type SearchParams, withRole } from "@/lib/viewer";

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
  },
} as const;

type InstrumentoSlug = keyof typeof instrumentos;

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function InstrumentoPage({
  params,
  searchParams,
}: {
  params: Promise<{ instrumento: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { instrumento } = await params;
  const sp = await searchParams;
  const role = getViewerRole(sp);

  if (!(instrumento in instrumentos)) notFound();
  const inst = instrumentos[instrumento as InstrumentoSlug];
  const Icon = inst.icon;

  const allDocs = getVisibleDocuments(role);
  const relatedDocs = allDocs
    .filter((d) => d.section.toLowerCase().includes(inst.librarySection.toLowerCase()))
    .slice(0, 4);
  const fallbackDocs = allDocs.toSorted((a, b) => b.year - a.year).slice(0, 4);
  const displayDocs = relatedDocs.length > 0 ? relatedDocs : fallbackDocs;

  const isPublic = role === "public";

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
                
                <div className="relative z-10 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                  <div 
                    className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[20px] shadow-inner border border-black/5"
                    style={{ background: inst.lightBg, color: inst.color }}
                  >
                    <FileText className="h-8 w-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-2xl text-[#1a1a1a] mb-2">Documento base metodológico</h3>
                    <p className="text-base text-[#4a4540] leading-relaxed">
                      Guía general y estructura modelo (sin información específica de Consejos). Acceso público.
                    </p>
                  </div>
                  <a 
                    href="#" 
                    className="inline-flex shrink-0 items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold transition hover:opacity-90 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5"
                    style={{ background: inst.color }}
                  >
                    <Download className="h-4 w-4" />
                    Descargar PDF
                  </a>
                </div>
              </div>
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

      {/* ── Documentos restringidos / Biblioteca ── */}
      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          
          {isPublic ? (
            /* Gated UI for Public Users */
            <div className="relative overflow-hidden rounded-[32px] border border-[#e8dfd3] bg-[#f8f5f2] p-8 sm:p-16 text-center shadow-inner">
              <div className="mx-auto max-w-2xl relative z-10">
                <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-md border border-[#e8dfd3]">
                  <Lock className="h-10 w-10 text-[#1a1a1a]" aria-hidden="true" />
                </div>
                <h2 className="font-display text-3xl sm:text-4xl text-[#1a1a1a] mb-5">
                  Acceso restringido a la biblioteca
                </h2>
                <p className="text-lg text-[#4a4540] mb-10 leading-relaxed px-4">
                  Para acceder a los instrumentos y documentos específicos de los Consejos Comunitarios, debes iniciar sesión. 
                  El acceso es validado manualmente para usuarios públicos y otorgado automáticamente para colaboradores con correo institucional.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href="/login"
                    className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-[#1a1a1a] px-8 py-4 text-sm font-bold tracking-wide text-white transition hover:bg-black hover:scale-105"
                  >
                    <UserCircle className="h-5 w-5" />
                    Iniciar sesión / Registrarse
                  </Link>
                  <Link
                    href="/"
                    className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border-2 border-[#e8dfd3] bg-white px-8 py-4 text-sm font-bold tracking-wide text-[#1a1a1a] transition hover:bg-[#f8f5f2]"
                  >
                    Saber más sobre accesos
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            /* Unlocked UI for Logged-in Users */
            <div>
              <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 border-b border-[#e8dfd3] pb-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e3f2fd] text-[#1565c0] mb-4">
                    <Lock className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold uppercase tracking-wider">Acceso verificado</span>
                  </div>
                  <h2 className="font-display text-3xl text-[#1a1a1a]">Documentos recientes</h2>
                  <p className="mt-2 text-[#4a4540] text-lg">Mostrando documentos internos relacionados a este instrumento.</p>
                </div>
                <Link
                  href={withRole(`/biblioteca?section=${encodeURIComponent(inst.librarySection)}`, role)}
                  className="shrink-0 inline-flex items-center justify-center gap-2 rounded-full border-2 px-6 py-3 text-sm font-bold transition hover:opacity-80"
                  style={{ borderColor: inst.color, color: inst.color }}
                >
                  Ver todos en biblioteca
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>

              <div className="overflow-hidden rounded-[24px] border border-[#e8dfd3] shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr style={{ background: inst.color }}>
                      {["Título", "Tipo", "Territorio", "Año", "Acciones"].map((h) => (
                        <th
                          key={h}
                          className="px-6 py-4 text-xs font-bold uppercase tracking-[0.14em] text-white"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e8dfd3] bg-white">
                    {displayDocs.map((doc) => (
                      <tr key={doc.id} className="align-top transition-colors hover:bg-[#fcfaf7]">
                        <td className="px-6 py-5">
                          <p className="font-bold text-[#1a1a1a] text-base">{doc.title}</p>
                          <p className="mt-1.5 text-xs font-medium text-[#7a756e] uppercase tracking-wider">{doc.section}</p>
                        </td>
                        <td className="whitespace-nowrap px-6 py-5 text-[#4a4540] text-base">{doc.type}</td>
                        <td className="whitespace-nowrap px-6 py-5 text-[#4a4540] text-base">{doc.territory}</td>
                        <td className="whitespace-nowrap px-6 py-5 text-[#4a4540] font-medium text-base">{doc.year}</td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col gap-2">
                            {doc.action === "file" ? (
                              <a
                                href={doc.url}
                                download
                                className="inline-flex w-max items-center gap-2 rounded-full bg-[#1a1a1a] px-4 py-2 text-xs font-bold text-white transition hover:bg-black"
                              >
                                <Download className="h-3.5 w-3.5" aria-hidden="true" />
                                Descargar
                              </a>
                            ) : null}
                            {doc.sourceUrl ? (
                              <a
                                href={doc.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex w-max items-center gap-2 rounded-full border border-[#e8dfd3] bg-white px-4 py-2 text-xs font-bold text-[#1a1a1a] transition hover:bg-[#f8f5f2]"
                              >
                                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                                Fuente oficial
                              </a>
                            ) : doc.action === "external" ? (
                              <a
                                href={doc.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex w-max items-center gap-2 rounded-full border border-[#e8dfd3] bg-white px-4 py-2 text-xs font-bold text-[#1a1a1a] transition hover:bg-[#f8f5f2]"
                              >
                                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                                {doc.fileLabel}
                              </a>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

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
