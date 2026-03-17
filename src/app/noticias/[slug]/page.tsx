import Link from "next/link";
import { BookOpen, BarChart2, ShieldCheck } from "lucide-react";
import { SiteLayout } from "@/components/mock/ui";
import { getViewerRole, type SearchParams, withRole } from "@/lib/viewer";

// Mock article data keyed by slug
const articulos: Record<
  string,
  {
    slug: string;
    categoria: string;
    categoriaColor: string;
    categoriaBg: string;
    fecha: string;
    territorio: string;
    titulo: string;
    cuerpo: {
      intro: string;
      cita: string;
      citaAutor: string;
      cuerpo1: string;
      cuerpo2: string;
    };
    relacionados: Array<{
      href: string;
      icono: "doc" | "tablero" | "gobierno";
      titulo: string;
      modulo: string;
      flecha: string;
      flechaColor: string;
    }>;
  }
> = {
  "comunidades-del-pacifico-defienden-sus-rios": {
    slug: "comunidades-del-pacifico-defienden-sus-rios",
    categoria: "Pronunciamiento",
    categoriaColor: "#2e7d32",
    categoriaBg: "#d8f3dc",
    fecha: "12 de marzo de 2026",
    territorio: "Buenaventura, Valle del Cauca",
    titulo: "Comunidades del Pacífico defienden sus ríos ante amenazas extractivas",
    cuerpo: {
      intro:
        "Las comunidades negras del Pacífico colombiano se reunieron el pasado 10 de marzo en un encuentro territorial para analizar las amenazas a sus ríos por parte de proyectos extractivos. Más de 200 personas de 15 consejos comunitarios participaron en la jornada.",
      cita:
        "El agua no se negocia. Nuestros ríos son la vida del territorio y de las generaciones que vienen.",
      citaAutor: "Representante del Consejo Comunitario de Río Anchicayá",
      cuerpo1:
        "Durante el encuentro se presentaron informes sobre la calidad del agua y se documentaron casos de contaminación. Los consejos comunitarios acordaron una ruta de acción conjunta que incluye litigio estratégico y acciones de protección territorial.",
      cuerpo2:
        "El equipo del Palenke/PCN acompañó la jornada con registro audiovisual y apoyo técnico para la sistematización de la información ambiental comunitaria.",
    },
    relacionados: [
      {
        href: "/biblioteca?section=Litigio",
        icono: "doc",
        titulo: "Informe de calidad hídrica 2025",
        modulo: "Memoria Afroterritorial",
        flecha: "→ Memoria",
        flechaColor: "#2e7d32",
      },
      {
        href: "/gobierno-propio",
        icono: "gobierno",
        titulo: "Ruta de litigio estratégico — Río Anchicayá",
        modulo: "Gobierno propio",
        flecha: "→ Gobierno",
        flechaColor: "#d32f2f",
      },
      {
        href: "/estadisticas",
        icono: "tablero",
        titulo: "Tablero: Calidad hídrica por región",
        modulo: "Mirador de datos",
        flecha: "→ Mirador",
        flechaColor: "#f57f17",
      },
    ],
  },
};

// Fallback article for slugs without specific data
const fallbackArticulo = {
  slug: "",
  categoria: "Noticia",
  categoriaColor: "#1a1a1a",
  categoriaBg: "#f0eae0",
  fecha: "Marzo 2026",
  territorio: "Pacífico colombiano",
  titulo: "Actualización del proceso territorial",
  cuerpo: {
    intro:
      "El Proceso de Comunidades Negras continúa su trabajo de defensa territorial, documentando y acompañando a los Consejos Comunitarios del Pacífico colombiano.",
    cita:
      "El territorio es vida, y la vida del territorio es nuestra lucha.",
    citaAutor: "Proceso de Comunidades Negras, PCN",
    cuerpo1:
      "Las actividades de acompañamiento incluyen talleres de formación en derechos étnicos, apoyo técnico para la gestión territorial y documentación de casos de vulneración de derechos.",
    cuerpo2:
      "El equipo del Palenke/PCN continúa construyendo herramientas digitales para el fortalecimiento organizativo de las comunidades.",
  },
  relacionados: [
    {
      href: "/biblioteca",
      icono: "doc" as const,
      titulo: "Ver documentos relacionados",
      modulo: "Memoria Afroterritorial",
      flecha: "→ Memoria",
      flechaColor: "#2e7d32",
    },
    {
      href: "/gobierno-propio",
      icono: "gobierno" as const,
      titulo: "Instrumentos de Gobierno propio",
      modulo: "Gobierno propio",
      flecha: "→ Gobierno",
      flechaColor: "#d32f2f",
    },
  ],
};

const iconMap = {
  doc: BookOpen,
  tablero: BarChart2,
  gobierno: ShieldCheck,
};

const iconBgMap: Record<string, string> = {
  doc: "#d8f3dc",
  tablero: "#fff3cd",
  gobierno: "#fddede",
};

const iconColorMap: Record<string, string> = {
  doc: "#2e7d32",
  tablero: "#f57f17",
  gobierno: "#d32f2f",
};

export default async function DetalleNoticiaPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { slug } = await params;
  const qp = await searchParams;
  const role = getViewerRole(qp);

  const articulo = articulos[slug] ?? { ...fallbackArticulo, slug };

  return (
    <SiteLayout
      role={role}
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "Noticias y eventos", href: "/noticias" },
        { label: articulo.titulo },
      ]}
    >
      {/* ── Article header ── */}
      <section className="px-4 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-5 flex flex-wrap gap-2">
            <span
              className="inline-block rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.5px] text-white"
              style={{ background: articulo.categoriaColor }}
            >
              {articulo.categoria}
            </span>
            <span className="inline-block rounded-full bg-[#f0eae0] px-4 py-1.5 text-xs font-semibold text-[#4a4540]">
              {articulo.fecha}
            </span>
            <span className="inline-block rounded-full bg-[#f0eae0] px-4 py-1.5 text-xs font-semibold text-[#4a4540]">
              {articulo.territorio}
            </span>
          </div>
          <h1 className="font-display text-4xl leading-tight text-[#1a1a1a] sm:text-5xl">
            {articulo.titulo}
          </h1>
        </div>
      </section>

      {/* ── Featured image ── */}
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div
            className="flex h-[360px] items-end rounded-[24px] p-6 sm:h-[400px]"
            style={{
              background: `linear-gradient(135deg, #2c3e2a 0%, #1a1a1a 100%)`,
            }}
          >
            <span className="rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-xs uppercase tracking-[0.16em] text-white/60">
              Imagen destacada del evento / noticia
            </span>
          </div>
          <p className="mt-2 text-xs text-[#7a756e]">
            Foto: Equipo PCN — Comunidad de Río Anchicayá, marzo 2026
          </p>
        </div>
      </section>

      {/* ── Article body ── */}
      <section className="px-4 pb-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="prose prose-lg max-w-none">
            <p className="text-lg leading-8 text-[#4a4540]">{articulo.cuerpo.intro}</p>

            <blockquote className="my-8 rounded-r-[16px] border-l-4 border-[#2e7d32] bg-[#d8f3dc] py-5 pl-6 pr-4">
              <p className="text-lg font-bold leading-7 text-[#1a1a1a]">
                &ldquo;{articulo.cuerpo.cita}&rdquo;
              </p>
              <cite className="mt-2 block text-sm not-italic text-[#7a756e]">
                — {articulo.cuerpo.citaAutor}
              </cite>
            </blockquote>

            <p className="text-base leading-8 text-[#4a4540]">{articulo.cuerpo.cuerpo1}</p>
            <p className="mt-5 text-base leading-8 text-[#4a4540]">{articulo.cuerpo.cuerpo2}</p>
          </div>

          {/* Mini photo gallery */}
          <div className="mt-10 grid grid-cols-3 gap-3">
            {["Foto 1", "Foto 2", "Foto 3"].map((label, i) => (
              <div
                key={i}
                className="flex h-[160px] items-center justify-center rounded-[20px] text-xs text-[#7a756e]"
                style={{
                  background: i === 0 ? "#d8f3dc" : i === 1 ? "#c8e6c9" : "#a5d6a7",
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Related links ── */}
      <section className="bg-[#f0eae0] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 font-display text-2xl text-[#1a1a1a]">
            Explora más sobre esto
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {articulo.relacionados.map((rel, i) => {
              const Icon = iconMap[rel.icono];
              return (
                <Link
                  key={i}
                  href={withRole(rel.href, role)}
                  className="flex items-start gap-4 rounded-[20px] border border-[#e8dfd3] bg-white p-5 transition hover:border-[#2e7d32] hover:shadow-sm"
                >
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px]"
                    style={{ background: iconBgMap[rel.icono] }}
                  >
                    <Icon
                      className="h-5 w-5"
                      style={{ color: iconColorMap[rel.icono] }}
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1a1a1a]">{rel.titulo}</p>
                    <p className="mt-1 text-xs text-[#7a756e]">
                      {rel.modulo}{" "}
                      <span className="font-semibold" style={{ color: rel.flechaColor }}>
                        {rel.flecha}
                      </span>
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Back navigation ── */}
      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
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
              ← Volver a Memoria Afroterritorial
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
