import Image from "next/image";
import { SiteLayout } from "@/components/mock/ui";
import { SubmoduleOptionsColumn } from "@/components/palenke/SubmoduleOptionsColumn";
import { getViewerRole, type SearchParams } from "@/lib/viewer";

const instruments = [
  {
    id: "reglamentos",
    title: "Reglamentos internos",
    bullets: [
      "Organización normativa de la vida comunitaria",
      "Reglas de uso del territorio y convivencia",
    ],
    color: "#2e7d32",
    lightBg: "#d8f3dc",
    href: "/gobierno-propio/reglamentos",
  },
  {
    id: "planes-uso",
    title: "Planes de uso y manejo",
    bullets: [
      "Ordenamiento del territorio desde la visión comunitaria",
      "Definición de usos productivos, culturales y de conservación",
    ],
    color: "#1565c0",
    lightBg: "#e3f2fd",
    href: "/gobierno-propio/planes-uso",
  },
  {
    id: "etnodesarrollo",
    title: "Planes de etnodesarrollo",
    bullets: [
      "Planeación estratégica desde identidad y autonomía",
      "Proyección económica, social y cultural del territorio",
    ],
    color: "#f57f17",
    lightBg: "#fff3cd",
    href: "/gobierno-propio/etnodesarrollo",
  },
  {
    id: "conservacion",
    title: "Áreas bioculturales de conservación comunitaria con enfoque de pueblo negro",
    bullets: [
      "Declaratoria y gestión de zonas conservadas por las comunidades",
      "Integración de biodiversidad, cultura y espiritualidad",
    ],
    color: "#2e7d32",
    lightBg: "#d8f3dc",
    href: "/gobierno-propio/conservacion",
  },
  {
    id: "proteccion-hidrica",
    title: "Protección hídrica",
    bullets: [
      "Defensa de ecosistemas marinos y ecosistemas de agua dulce.",
      "Gestión comunitaria del agua como parte integral del territorio.",
    ],
    color: "#1565c0",
    lightBg: "#e3f2fd",
    href: "/gobierno-propio/proteccion-hidrica",
  },
];

const governmentFunctions = [
  "Fortalecer la capacidad de decisión de los Consejos Comunitarios",
  "Estructurar y difundir instrumentos de gobernanza territorial",
  "Acompañar la planificación comunitaria del territorio",
  "Consolidar la autoridad territorial afrodescendiente",
];

const alliedProcesses = [
  { acronym: "PCN", name: "Proceso de Comunidades Negras", accent: "#1a1a1a", bg: "#f0eae0" },
  { acronym: "HIL", name: "Corporación Agencia Afrocolombiana Hileros", accent: "#2e7d32", bg: "#d8f3dc" },
  { acronym: "CC", name: "Consejos Comunitarios", accent: "#1565c0", bg: "#e3f2fd" },
  { acronym: "PT", name: "Procesos territoriales articulados", accent: "#d32f2f", bg: "#fddede" },
  { acronym: "ONG", name: "Organizaciones aliadas nacionales", accent: "#f57f17", bg: "#fff3cd" },
  { acronym: "RED", name: "Redes internacionales de solidaridad", accent: "#1a1a1a", bg: "#f0eae0" },
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
      {/* ── Page title band ── */}
      <section className="border-b border-[#e8dfd3] bg-[#f0eae0] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow mb-3">2. GOBIERNO PROPIO</p>
          <h1 className="font-display text-5xl text-[#1a1a1a] sm:text-6xl">Gobierno propio</h1>
        </div>
      </section>

      {/* ── Main: left vertical menu | right content ── */}
      <section className="bg-white px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[360px_minmax(0,1fr)] lg:gap-14 xl:grid-cols-[400px_minmax(0,1fr)]">
            <aside className="self-start lg:sticky lg:top-24">
              <p className="eyebrow mb-5">Submódulos</p>
              <SubmoduleOptionsColumn items={instruments} role={role} />
            </aside>

            <div className="rounded-[30px] border border-[#e8dfd3] bg-[#fcfaf7] p-6 sm:p-8 lg:p-10">
              <div className="space-y-9">
                <section>
                  <h3 className="font-display text-3xl text-[#1a1a1a] sm:text-4xl">Definición</h3>
                  <p className="mt-4 text-base leading-8 text-[#4a4540]">
                    El Gobierno Propio es el conjunto de normas, decisiones y prácticas mediante las
                    cuales los Consejos Comunitarios ejercen autoridad sobre sus territorios colectivos.
                    Este espacio del Palenke organiza los instrumentos que materializan la autonomía
                    territorial.
                  </p>
                </section>

                <section className="border-t border-[#e8dfd3] pt-8">
                  <h3 className="font-display text-3xl text-[#1a1a1a] sm:text-4xl">Función</h3>
                  <ul className="mt-5 space-y-3">
                    {governmentFunctions.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-base leading-7 text-[#4a4540]">
                        <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2e7d32]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Aliados — horizontal logo strip ── */}
      <section className="border-t border-[#e8dfd3] bg-[#f8f5f2] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow mb-6 text-center">Aliados</p>

          <div className="flex flex-wrap items-stretch justify-center gap-4">
            {alliedProcesses.map((ally) => (
              <div
                key={ally.acronym}
                className="flex min-w-[125px] flex-col items-center justify-center gap-2 rounded-[16px] border border-dashed p-4 text-center"
                style={{ borderColor: ally.accent, background: ally.bg, maxWidth: 180 }}
              >
                <span
                  className="font-display text-xl font-bold"
                  style={{ color: ally.accent }}
                >
                  {ally.acronym}
                </span>
                <span className="text-[11px] leading-4 text-[#4a4540]">{ally.name}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <svg
              viewBox="0 0 420 90"
              aria-hidden="true"
              className="h-16 w-full max-w-[520px]"
              fill="none"
            >
              <path d="M12 12 L210 82 L408 12" stroke="#d9d0c3" strokeWidth="2" />
            </svg>
          </div>

          <div className="-mt-2 flex justify-center">
            <div className="rounded-full border border-[#d9d0c3] bg-white p-4">
              <Image src="/assets/logo.svg" alt="Logo Palenke" width={46} height={46} className="h-11 w-11" />
            </div>
          </div>

        </div>
      </section>
    </SiteLayout>
  );
}
