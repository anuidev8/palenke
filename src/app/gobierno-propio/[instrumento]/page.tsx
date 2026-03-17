import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, Download, Droplets, ExternalLink, FileText, Gavel, Leaf, Scale } from "lucide-react";
import { notFound } from "next/navigation";
import { SiteLayout } from "@/components/mock/ui";
import { getVisibleDocuments } from "@/lib/mock-data";
import { getViewerRole, type SearchParams, withRole } from "@/lib/viewer";

// ─── Instrument catalogue ────────────────────────────────────────────────────

const instrumentos = {
  reglamentos: {
    title: "Reglamentos internos",
    eyebrow: "Instrumento 01",
    icon: FileText,
    color: "#2e7d32",
    lightBg: "#d8f3dc",
    heroGradient: "linear-gradient(135deg, #1b5e20 0%, #2e7d32 60%, #388e3c 100%)",
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
    heroGradient: "linear-gradient(135deg, #0d47a1 0%, #1565c0 60%, #1976d2 100%)",
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
    heroGradient: "linear-gradient(135deg, #b71c1c 0%, #d32f2f 60%, #e53935 100%)",
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
    heroGradient: "linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #558b2f 100%)",
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
    heroGradient: "linear-gradient(135deg, #e65100 0%, #f57f17 60%, #fb8c00 100%)",
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
    heroGradient: "linear-gradient(135deg, #01579b 0%, #1565c0 60%, #0288d1 100%)",
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

  return (
    <SiteLayout
      role={role}
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "Gobierno Propio", href: "/gobierno-propio" },
        { label: inst.title },
      ]}
    >
      {/* ── Hero ── */}
      <section
        className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8"
        style={{ background: inst.heroGradient }}
      >
        {/* dot pattern */}
        <div className="absolute right-0 top-0 h-full w-1/2 opacity-[0.06]" aria-hidden="true">
          {Array.from({ length: 100 }).map((_, i) => (
            <span
              key={i}
              className="absolute h-1 w-1 rounded-full bg-white"
              style={{ left: `${(i % 10) * 10}%`, top: `${Math.floor(i / 10) * 10}%` }}
            />
          ))}
        </div>

        <div className="relative mx-auto max-w-7xl">
          <Link
            href={withRole("/gobierno-propio", role)}
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-white/70 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Gobierno Propio
          </Link>
          <div className="flex items-start gap-5">
            <div
              className="hidden shrink-0 items-center justify-center rounded-2xl p-3 sm:flex"
              style={{ background: "rgba(255,255,255,0.15)" }}
            >
              <Icon className="h-8 w-8 text-white" aria-hidden="true" />
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                {inst.eyebrow}
              </p>
              <h1 className="max-w-2xl font-display text-4xl leading-tight text-white sm:text-5xl">
                {inst.title}
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* ── Definición ── */}
      <section className="bg-white px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow mb-3">¿Qué es?</p>
            <h2 className="font-display text-3xl text-[#1a1a1a]">Definición</h2>
            <p className="mt-4 text-base leading-7 text-[#4a4540]">{inst.definition}</p>
            <p className="mt-4 text-base leading-7 text-[#4a4540]">{inst.context}</p>
          </div>

          <div>
            <p className="eyebrow mb-3">Puntos clave</p>
            <h2 className="font-display text-3xl text-[#1a1a1a]">Lo que cubre</h2>
            <ul className="mt-6 space-y-4">
              {inst.keyPoints.map((point, i) => (
                <li key={point} className="flex items-start gap-4">
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                    style={{ background: inst.lightBg, color: inst.color }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-0.5 text-sm leading-6 text-[#4a4540]">{point}</p>
                </li>
              ))}
            </ul>

            <Link
              href={withRole(`/biblioteca?section=${encodeURIComponent(inst.librarySection)}`, role)}
              className="mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition"
              style={{ background: inst.color }}
            >
              Ver documentos en biblioteca
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Documentos recientes ── */}
      <section className="bg-[#f8f5f2] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between gap-6">
            <div>
              <p className="eyebrow mb-2">Lo último</p>
              <h2 className="font-display text-3xl text-[#1a1a1a]">Documentos recientes</h2>
            </div>
            <Link
              href={withRole(`/biblioteca?section=${encodeURIComponent(inst.librarySection)}`, role)}
              className="hidden shrink-0 items-center gap-2 rounded-full border-2 px-5 py-2.5 text-sm font-semibold transition hover:opacity-80 sm:inline-flex"
              style={{ borderColor: inst.color, color: inst.color }}
            >
              Ver todos
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="overflow-hidden rounded-[28px] border border-[#e8dfd3]">
            <table className="w-full text-left text-sm">
              <thead>
                <tr style={{ background: inst.color }}>
                  {["Título", "Tipo", "Territorio", "Año", "Acciones"].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-white"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e8dfd3] bg-white">
                {displayDocs.map((doc) => (
                  <tr key={doc.id} className="align-top transition-colors hover:bg-[#f0eae0]">
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-[#1a1a1a]">{doc.title}</p>
                      <p className="mt-0.5 text-xs text-[#7a756e]">{doc.section}</p>
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-[#4a4540]">{doc.type}</td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-[#4a4540]">{doc.territory}</td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-[#4a4540]">{doc.year}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-col gap-1.5">
                        {doc.action === "file" ? (
                          <a
                            href={doc.url}
                            download
                            className="inline-flex items-center gap-1.5 rounded-full bg-[#2e7d32] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#1b5e20]"
                          >
                            <Download className="h-3 w-3" aria-hidden="true" />
                            Descargar
                          </a>
                        ) : null}
                        {doc.sourceUrl ? (
                          <a
                            href={doc.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-full border border-[#e8dfd3] bg-white px-3 py-1.5 text-xs font-semibold text-[#1a1a1a] transition hover:bg-[#f0eae0]"
                          >
                            <ExternalLink className="h-3 w-3" aria-hidden="true" />
                            Fuente oficial
                          </a>
                        ) : doc.action === "external" ? (
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-full border border-[#e8dfd3] bg-white px-3 py-1.5 text-xs font-semibold text-[#1a1a1a] transition hover:bg-[#f0eae0]"
                          >
                            <ExternalLink className="h-3 w-3" aria-hidden="true" />
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
      </section>

      {/* ── Navegación entre instrumentos ── */}
      <section className="border-t border-[#e8dfd3] bg-white px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href={withRole("/gobierno-propio", role)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#4a4540] transition hover:text-[#1a1a1a]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Volver a todos los instrumentos
          </Link>
          <Link
            href={withRole("/biblioteca", role)}
            className="inline-flex items-center gap-2 text-sm font-semibold transition"
            style={{ color: inst.color }}
          >
            Explorar biblioteca completa
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
