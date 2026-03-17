import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { SiteLayout } from "@/components/mock/ui";
import { getViewerRole, type SearchParams, withRole } from "@/lib/viewer";

const noticias = [
  {
    slug: "comunidades-del-pacifico-defienden-sus-rios",
    categoria: "Pronunciamiento",
    categoriaColor: "#2e7d32",
    categoriaBg: "#d8f3dc",
    fecha: "12 mar 2026",
    territorio: "Buenaventura, Valle del Cauca",
    titulo: "Comunidades del Pacífico defienden sus ríos ante amenazas extractivas",
    resumen:
      "Más de 200 personas de 15 consejos comunitarios se reunieron para analizar las amenazas a sus ríos por proyectos extractivos y acordaron una ruta de acción conjunta.",
  },
  {
    slug: "acuerdo-colectivo-guapi",
    categoria: "Acuerdo colectivo",
    categoriaColor: "#1565c0",
    categoriaBg: "#e3f2fd",
    fecha: "5 mar 2026",
    territorio: "Guapi, Cauca",
    titulo: "Consejo Comunitario de Guapi firma acuerdo de conservación de manglares",
    resumen:
      "El acuerdo protege 3.200 hectáreas de manglar en la desembocadura del río Guapi, asegurando los derechos colectivos y la soberanía ambiental del territorio.",
  },
  {
    slug: "fallo-tutela-rio-anchicaya",
    categoria: "Litigio estratégico",
    categoriaColor: "#d32f2f",
    categoriaBg: "#fddede",
    fecha: "28 feb 2026",
    territorio: "Valle del Cauca",
    titulo: "Fallo favorable en tutela por contaminación del Río Anchicayá",
    resumen:
      "La Corte ordenó medidas cautelares para proteger el río Anchicayá después de que el equipo jurídico del PCN presentara evidencias de contaminación por actividades mineras.",
  },
  {
    slug: "censo-comunitario-2025",
    categoria: "Datos territoriales",
    categoriaColor: "#f57f17",
    categoriaBg: "#fff3cd",
    fecha: "14 feb 2026",
    territorio: "Pacífico colombiano",
    titulo: "Publicación del Censo Comunitario del Pacífico 2025",
    resumen:
      "El SCITA publica los resultados del Censo Comunitario 2025, con datos demográficos actualizados de 48 Consejos Comunitarios del Pacífico Sur y Norte.",
  },
];

const eventos = [
  {
    fecha: "20 mar 2026",
    tipo: "Asamblea",
    titulo: "Asamblea territorial de Consejos Comunitarios del Pacífico Sur",
    lugar: "Tumaco, Nariño",
  },
  {
    fecha: "18 mar 2026",
    tipo: "Taller",
    titulo: "Formación en herramientas SIG para equipos comunitarios",
    lugar: "Quibdó, Chocó",
  },
  {
    fecha: "15 mar 2026",
    tipo: "Litigio",
    titulo: "Audiencia pública — Ruta de litigio estratégico Río Anchicayá",
    lugar: "Bogotá D.C.",
  },
  {
    fecha: "10 mar 2026",
    tipo: "Cultural",
    titulo: "Lanzamiento del archivo audiovisual de memorias del Pacífico",
    lugar: "Cali, Valle del Cauca",
  },
  {
    fecha: "5 mar 2026",
    tipo: "Taller",
    titulo: "Taller de formación en derechos étnicos — Ley 70 de 1993",
    lugar: "Buenaventura, Valle del Cauca",
  },
  {
    fecha: "28 feb 2026",
    tipo: "Reunión",
    titulo: "Mesa de trabajo SCITA — actualización de capas SIG",
    lugar: "Virtual",
  },
];

export default async function NoticiasPage({
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
        { label: "Memoria Afroterritorial", href: "/memoria-afroterritorial" },
        { label: "Noticias y eventos" },
      ]}
    >
      {/* ── Page header ── */}
      <section className="bg-[#2c3e2a] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[1.5px] text-[#fbc02d]">
            Memoria Afroterritorial
          </p>
          <h1 className="font-display text-4xl text-white sm:text-5xl">Noticias y eventos</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-white/70">
            Actualizaciones recientes del Proceso de Comunidades Negras — pronunciamientos,
            acuerdos, litigios y agenda territorial.
          </p>
        </div>
      </section>

      {/* ── Main content: Entérate + Lo último ── */}
      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">

          {/* ── Entérate — news cards ── */}
          <div>
            <p className="eyebrow mb-2">Pronunciamientos y noticias</p>
            <h2 className="mb-8 font-display text-3xl text-[#1a1a1a]">Entérate</h2>

            <div className="grid gap-6">
              {noticias.map((n) => (
                <article
                  key={n.slug}
                  className="surface-card flex flex-col gap-4 overflow-hidden"
                  style={{ borderTopColor: n.categoriaColor, borderTopWidth: "3px" }}
                >
                  {/* thumbnail */}
                  <div
                    className="flex h-[160px] items-end rounded-[20px] p-4"
                    style={{
                      background: `linear-gradient(135deg, ${n.categoriaColor}cc, ${n.categoriaColor}55)`,
                    }}
                  >
                    <span
                      className="rounded-full px-3 py-1 text-xs font-semibold text-white"
                      style={{ background: "rgba(0,0,0,0.3)" }}
                    >
                      {n.categoria}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[#7a756e]">
                    <span
                      className="rounded-full px-2.5 py-1 text-xs font-semibold"
                      style={{ background: n.categoriaBg, color: n.categoriaColor }}
                    >
                      {n.categoria}
                    </span>
                    <span>·</span>
                    <span>{n.fecha}</span>
                    <span>·</span>
                    <span>{n.territorio}</span>
                  </div>

                  <h3 className="font-display text-xl text-[#1a1a1a]">{n.titulo}</h3>
                  <p className="text-sm leading-6 text-[#4a4540]">{n.resumen}</p>

                  <Link
                    href={withRole(`/noticias/${n.slug}`, role)}
                    className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-[#2e7d32] transition hover:text-[#1b5e20]"
                  >
                    Leer más
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </article>
              ))}
            </div>
          </div>

          {/* ── Lo último — events list ── */}
          <div>
            <p className="eyebrow mb-2">Agenda territorial</p>
            <h2 className="mb-8 font-display text-3xl text-[#1a1a1a]">Lo último</h2>

            <div className="overflow-hidden rounded-[28px] border border-[#e8dfd3]">
              {eventos.map((ev, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 border-b border-[#e8dfd3] px-5 py-4 last:border-0 hover:bg-[#f8f5f2] transition-colors"
                >
                  <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-xl bg-[#f0eae0]">
                    <Calendar className="h-4 w-4 text-[#7a756e]" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-[#7a756e]">
                      <span className="font-semibold text-[#1a1a1a]">{ev.tipo}</span>
                      {" · "}
                      {ev.fecha}
                    </p>
                    <p className="mt-1 text-sm font-medium leading-5 text-[#1a1a1a]">
                      {ev.titulo}
                    </p>
                    <p className="mt-0.5 text-xs text-[#7a756e]">{ev.lugar}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Back nav ── */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-3">
          <Link
            href={withRole("/", role)}
            className="inline-flex items-center gap-2 rounded-full border-2 border-[#e8dfd3] px-5 py-2.5 text-sm font-semibold text-[#1a1a1a] transition hover:bg-[#f0eae0]"
          >
            ← Volver al Inicio
          </Link>
          <Link
            href={withRole("/memoria-afroterritorial", role)}
            className="inline-flex items-center gap-2 rounded-full border-2 border-[#2e7d32] px-5 py-2.5 text-sm font-semibold text-[#2e7d32] transition hover:bg-[#d8f3dc]"
          >
            ← Memoria Afroterritorial
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
