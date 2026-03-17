import Link from "next/link";
import { ArrowRight, BookOpen, Droplets, FileText, Gavel, Leaf, Scale } from "lucide-react";
import { SiteLayout } from "@/components/mock/ui";
import { getViewerRole, type SearchParams, withRole } from "@/lib/viewer";

const instruments = [
  {
    id: "reglamentos",
    title: "Reglamentos internos",
    description:
      "Normas y acuerdos comunitarios que rigen la vida colectiva, el uso del territorio y la convivencia en los Consejos Comunitarios.",
    icon: FileText,
    color: "#2e7d32",
    lightBg: "#d8f3dc",
    href: "/gobierno-propio/reglamentos",
  },
  {
    id: "planes-uso",
    title: "Planes de uso y manejo",
    description:
      "Instrumentos de planificación territorial que ordenan el uso sostenible de los recursos naturales en el Pacífico colombiano.",
    icon: BookOpen,
    color: "#1565c0",
    lightBg: "#e3f2fd",
    href: "/gobierno-propio/planes-uso",
  },
  {
    id: "litigio",
    title: "Litigio estratégico",
    description:
      "Expedientes, tutelas, acciones populares y demás mecanismos jurídicos para la defensa de derechos territoriales.",
    icon: Scale,
    color: "#d32f2f",
    lightBg: "#fddede",
    href: "/gobierno-propio/litigio",
  },
  {
    id: "conservacion",
    title: "Áreas bioculturales de conservación comunitaria",
    description:
      "Declaratoria y gestión de zonas conservadas por las comunidades, integrando biodiversidad, cultura y espiritualidad del Pueblo Negro.",
    icon: Leaf,
    color: "#2e7d32",
    lightBg: "#d8f3dc",
    href: "/gobierno-propio/conservacion",
  },
  {
    id: "etnodesarrollo",
    title: "Etnodesarrollo",
    description:
      "Propuestas y acuerdos de desarrollo desde la cosmovisión afroterritorial — economía propia, soberanía alimentaria.",
    icon: Gavel,
    color: "#f57f17",
    lightBg: "#fff3cd",
    href: "/gobierno-propio/etnodesarrollo",
  },
  {
    id: "proteccion-hidrica",
    title: "Protección hídrica",
    description:
      "Estrategias y resoluciones para la defensa de cuencas, ríos y fuentes de agua en territorios colectivos.",
    icon: Droplets,
    color: "#1565c0",
    lightBg: "#e3f2fd",
    href: "/gobierno-propio/proteccion-hidrica",
  },
];

const governmentFunctions = [
  "Fortalece la capacidad de decisión de los Consejos Comunitarios sobre sus territorios colectivos.",
  "Estructura y difunde instrumentos de gobernanza territorial para el uso, cuidado y defensa del territorio.",
  "Acompaña la planificación comunitaria con reglamentos, planes y rutas de acción territorial.",
  "Consolida la autoridad territorial afrodescendiente para incidencia política, jurídica y ambiental.",
];

const alliedProcesses = [
  {
    acronym: "PCN",
    name: "Proceso de Comunidades Negras",
    note: "Proceso articulador de gobierno propio y defensa territorial.",
    accent: "#1a1a1a",
    bg: "#f0eae0",
  },
  {
    acronym: "HIL",
    name: "Corporación Agencia Afrocolombiana Hileros",
    note: "Soporte técnico y articulación operativa del Palenke.",
    accent: "#2e7d32",
    bg: "#d8f3dc",
  },
  {
    acronym: "CC",
    name: "Consejos Comunitarios",
    note: "Autoridades territoriales y procesos organizativos del Pacífico.",
    accent: "#1565c0",
    bg: "#e3f2fd",
  },
  {
    acronym: "PT",
    name: "Procesos territoriales articulados",
    note: "Espacios comunitarios y redes aliadas en construcción de autonomía.",
    accent: "#d32f2f",
    bg: "#fddede",
  },
];

export default async function GobiernoPropioPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const role = getViewerRole(params);

  return (
    <SiteLayout
      role={role}
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "Gobierno Propio" },
      ]}
    >
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-[#f0eae0] px-4 py-16 sm:px-6 lg:px-8">
        {/* PCN dots pattern */}
        <div className="absolute right-8 top-8 grid grid-cols-6 gap-3 opacity-20" aria-hidden="true">
          {Array.from({ length: 24 }).map((_, i) => {
            const colors = ["#1a1a1a", "#2e7d32", "#d32f2f", "#fbc02d"];
            return (
              <span
                key={i}
                className="h-2 w-2 rounded-full"
                style={{ background: colors[i % 4] }}
              />
            );
          })}
        </div>

        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="eyebrow mb-4">Módulo</p>
            <h1 className="font-display text-5xl text-[#1a1a1a] sm:text-6xl">Gobierno propio</h1>
            <p className="mt-5 text-lg leading-8 text-[#4a4540]">
              Instrumentos jurídicos, normativos y de planificación que materializan la autonomía
              territorial del Proceso de Comunidades Negras.
            </p>
          </div>
        </div>
      </section>

      {/* ── Info row ── */}
      <section className="border-b border-[#e8dfd3] bg-white px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl text-[#1a1a1a]">¿Qué es el gobierno propio?</h2>
            <p className="mt-3 text-base leading-7 text-[#4a4540]">
              El Gobierno Propio es el conjunto de normas, decisiones y prácticas mediante las cuales
              los Consejos Comunitarios ejercen autoridad sobre sus territorios colectivos. Este espacio
              del Palenke organiza los instrumentos que materializan la autonomía territorial.
            </p>
            <p className="mt-3 rounded-[20px] bg-[#f8f5f2] px-4 py-3 text-sm leading-6 text-[#4a4540]">
              Base legal: Ley 70 de 1993, Convenio 169 de la OIT y Constitución Política de Colombia.
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl text-[#1a1a1a]">¿Qué hace?</h2>
            <ul className="mt-3 space-y-3">
              {governmentFunctions.map((item) => (
                <li key={item} className="flex items-start gap-3 text-base leading-7 text-[#4a4540]">
                  <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2e7d32]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Instruments grid ── */}
      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="eyebrow mb-3">Corpus documental</p>
          <h2 className="font-display text-3xl text-[#1a1a1a] sm:text-4xl">
            Instrumentos de Gobierno propio
          </h2>
          <p className="mt-3 max-w-2xl text-base text-[#4a4540]">
            Accede a los documentos organizados por área de trabajo. Cada sección contiene los
            instrumentos vigentes y el historial de acuerdos del PCN.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {instruments.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.id}
                className="surface-card group flex h-full flex-col gap-5 overflow-hidden transition hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)]"
                style={{ borderTopColor: item.color, borderTopWidth: "3px" }}
              >
                {/* Icon square */}
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl"
                  style={{ background: item.lightBg }}
                >
                  <Icon className="h-6 w-6" style={{ color: item.color }} aria-hidden="true" />
                </div>

                <div className="flex flex-1 flex-col gap-3">
                  <h3 className="font-display text-2xl text-[#1a1a1a]">{item.title}</h3>
                  <p className="text-sm leading-6 text-[#4a4540]">{item.description}</p>
                </div>

                <Link
                  href={withRole(item.href, role)}
                  className="mt-auto inline-flex items-center gap-2 text-sm font-semibold transition"
                  style={{ color: item.color }}
                >
                  Ver instrumento
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      {/* ── Allies band ── */}
      <section className="bg-white px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 max-w-2xl">
            <p className="eyebrow mb-3">Aliados y procesos articulados</p>
            <h2 className="font-display text-3xl text-[#1a1a1a] sm:text-4xl">
              Con aliados y procesos articulados con el PCN
            </h2>
            <p className="mt-3 text-base leading-7 text-[#4a4540]">
              Franja de logos de referencia para las organizaciones y procesos que sostienen,
              acompañan y usan los instrumentos de Gobierno propio.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {alliedProcesses.map((ally) => (
              <article
                key={ally.name}
                className="rounded-[24px] border border-[#e8dfd3] bg-[#f8f5f2] p-5"
              >
                <div
                  className="flex h-20 items-center justify-center rounded-[20px] border border-dashed text-lg font-semibold tracking-[0.16em]"
                  style={{ borderColor: ally.accent, background: ally.bg, color: ally.accent }}
                >
                  {ally.acronym}
                </div>
                <h3 className="mt-4 font-display text-xl text-[#1a1a1a]">{ally.name}</h3>
                <p className="mt-2 text-sm leading-6 text-[#4a4540]">{ally.note}</p>
              </article>
            ))}
          </div>

          <p className="mt-6 text-xs uppercase tracking-[0.14em] text-[#7a756e]">
            Logotipos de referencia mientras se incorporan los artes finales entregados por cada aliado.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
