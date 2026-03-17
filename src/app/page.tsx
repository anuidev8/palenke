import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { Callout, PageBanner, SiteLayout } from "@/components/mock/ui";
import { homeIntro } from "@/lib/mock-data";
import { getViewerRole, isInternal, type SearchParams, withRole } from "@/lib/viewer";

// Mock news data
const noticias = [
  {
    slug: "comunidades-del-pacifico-defienden-sus-rios",
    categoria: "Pronunciamiento",
    fecha: "12 mar 2026",
    territorio: "Buenaventura, Valle del Cauca",
    titulo: "Comunidades del Pacífico defienden sus ríos ante amenazas extractivas",
    resumen:
      "Más de 200 personas de 15 consejos comunitarios se reunieron para analizar las amenazas a sus ríos por proyectos extractivos.",
    color: "#2e7d32",
  },
  {
    slug: "acuerdo-colectivo-guapi",
    categoria: "Acuerdo colectivo",
    fecha: "5 mar 2026",
    territorio: "Guapi, Cauca",
    titulo: "Consejo Comunitario de Guapi firma acuerdo de conservación de manglares",
    resumen:
      "El acuerdo protege 3.200 hectáreas de manglar en la desembocadura del río Guapi, asegurando los derechos colectivos del territorio.",
    color: "#1565c0",
  },
];

const ultimosEventos = [
  {
    fecha: "20 mar 2026",
    tipo: "Reunión",
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
    tipo: "Evento cultural",
    titulo: "Lanzamiento del archivo audiovisual de memorias del Pacífico",
    lugar: "Cali, Valle del Cauca",
  },
];

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const role = getViewerRole(params);
  const notice = params.notice;

  return (
    <SiteLayout
      role={role}
      banner={
        notice === "admin-denied" ? (
          <PageBanner>
            <Callout tone="warning" title="Acceso denegado">
              <p>El panel administrativo está reservado para cuentas con rol Admin.</p>
            </Callout>
          </PageBanner>
        ) : null
      }
    >
      {/* ── Hero ── */}
      <section className="relative overflow-hidden" style={{ background: "#2c3e2a" }}>
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 70% 50%, rgba(46,125,50,0.35), transparent 55%), linear-gradient(135deg, rgba(26,26,26,0.92), rgba(44,62,42,0.80))",
          }}
        />
        {/* decorative dots */}
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-10" aria-hidden="true">
          {Array.from({ length: 80 }).map((_, i) => (
            <span
              key={i}
              className="absolute h-1 w-1 rounded-full bg-white"
              style={{ left: `${(i % 8) * 12.5}%`, top: `${Math.floor(i / 8) * 12.5}%` }}
            />
          ))}
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <span className="mb-6 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
            Proceso de Comunidades Negras
          </span>
          <h1 className="max-w-3xl font-display text-5xl leading-tight text-white sm:text-6xl lg:text-[72px]">
            Nuestras Raíces,
            <br />
            Nuestro Territorio
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-white/75 sm:text-lg">
            Espacio digital para organizar, custodiar y comunicar el trabajo político, técnico y
            comunitario del Palenke y el PCN.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={withRole("/gobierno-propio", role)}
              className="inline-flex items-center gap-2 rounded-full bg-[#2e7d32] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1b5e20]"
            >
              Conoce Nuestra Lucha
            </Link>
            <Link
              href={withRole("/memoria-afroterritorial", role)}
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              Ver presentación
            </Link>
          </div>
        </div>
      </section>

      {/* ── ¿Quiénes somos? ── */}
      <section className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-20">
        {/* Left: accent bar + heading + PCN dots */}
        <div className="flex gap-5">
          <div className="w-1 shrink-0 rounded-full bg-[#2e7d32]" aria-hidden="true" />
          <div>
            <h2 className="font-display text-4xl leading-tight text-[#1a1a1a] sm:text-5xl">
              ¿Quiénes somos?
            </h2>
            <div className="mt-4 flex items-center gap-2" aria-hidden="true">
              <span className="h-3 w-3 rounded-full bg-[#2e7d32]" />
              <span className="h-3 w-3 rounded-full bg-[#d32f2f]" />
              <span className="h-3 w-3 rounded-full bg-[#fbc02d]" />
            </div>
          </div>
        </div>
        {/* Right: paragraphs */}
        <div className="space-y-5">
          {homeIntro.map((paragraph) => (
            <p key={paragraph} className="text-base leading-8 text-[#4a4540]">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      {/* ── Video + Nuestro quehacer político ── */}
      <section className="bg-[#f0eae0] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Video placeholder */}
          <div className="relative flex min-h-[300px] items-center justify-center overflow-hidden rounded-[28px] bg-[#1a2a1a]">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, rgba(26,26,26,0.92) 0%, rgba(44,62,42,0.85) 100%)",
              }}
            />
            <button
              type="button"
              aria-label="Reproducir video de presentación"
              className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-[#2e7d32] shadow-[0_0_0_8px_rgba(46,125,50,0.25)] transition hover:bg-[#1b5e20]"
            >
              <svg
                viewBox="0 0 24 24"
                fill="white"
                className="h-7 w-7 translate-x-0.5"
                aria-hidden="true"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
            <div className="absolute bottom-4 left-4 rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
              Video de presentación
            </div>
          </div>

          {/* Quehacer político card */}
          <div className="flex flex-col gap-5 rounded-[28px] border border-[#e8dfd3] bg-white p-8">
            {/* multi-stripe top accent */}
            <div className="flex h-1 overflow-hidden rounded-full" aria-hidden="true">
              <span className="flex-1 bg-[#2e7d32]" />
              <span className="flex-1 bg-[#d32f2f]" />
              <span className="flex-1 bg-[#fbc02d]" />
            </div>
            <h2 className="font-display text-3xl text-[#1a1a1a]">Nuestro quehacer político</h2>
            <p className="text-base leading-7 text-[#4a4540]">
              Defendemos el territorio ancestral, fortalecemos el gobierno propio y construimos
              autonomía comunitaria desde los principios de identidad, territorio y participación.
            </p>
            <Link
              href={withRole("/gobierno-propio", role)}
              className="mt-auto inline-flex w-fit items-center gap-2 rounded-full bg-[#2e7d32] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1b5e20]"
            >
              Ver más
            </Link>
          </div>
        </div>
      </section>

      {/* ── Accesos rápidos ── */}
      <section className="bg-[#f0eae0] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <p className="eyebrow mb-3">Nuestro quehacer</p>
          <h2 className="font-display text-3xl text-[#1a1a1a] sm:text-4xl">Accesos rápidos</h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-[#4a4540]">
            Explora los módulos de la plataforma según el área de trabajo.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                color: "#2e7d32",
                lightBg: "#d8f3dc",
                tag: "SCITA",
                title: "Área de conservación comunitaria",
                description:
                  "Capas de datos sobre las ACC, cobertura boscosa y alertas territoriales del equipo SIG.",
                href: "/scita",
                cta: "Ver en SCITA",
              },
              {
                color: "#1565c0",
                lightBg: "#e3f2fd",
                tag: "Gobierno propio",
                title: "Protección hídrica",
                description:
                  "Instrumentos, resoluciones y rutas de litigio para la defensa de cuencas y fuentes de agua.",
                href: "/gobierno-propio",
                cta: "Ver instrumentos",
              },
              {
                color: "#d32f2f",
                lightBg: "#fddede",
                tag: "SCITA",
                title: "SIG Afrodescendiente",
                description:
                  "Sistema de información geográfica territorial — geoportal y tableros de datos del Pacífico colombiano.",
                href: isInternal(role) ? "/geoportal" : "/scita",
                cta: "Abrir SIG",
              },
            ].map((item) => (
              <article
                key={item.title}
                className="surface-card flex h-full flex-col gap-5 overflow-hidden"
              >
                <div className="h-1.5 w-full rounded-full" style={{ background: item.color }} />
                <span
                  className="inline-block rounded-full px-3 py-1 text-xs font-semibold"
                  style={{ background: item.lightBg, color: item.color }}
                >
                  {item.tag}
                </span>
                <div className="space-y-3">
                  <h3 className="font-display text-xl text-[#1a1a1a]">{item.title}</h3>
                  <p className="text-sm leading-6 text-[#4a4540]">{item.description}</p>
                </div>
                <Link
                  href={withRole(item.href, role)}
                  className="mt-auto inline-flex items-center gap-2 text-sm font-semibold"
                  style={{ color: item.color }}
                >
                  {item.cta}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>

          {isInternal(role) ? (
            <div className="mt-6 rounded-[28px] border border-[#e8dfd3] bg-[#fff3cd] px-6 py-4 text-sm text-[#1a1a1a]">
              <span className="font-semibold">Acceso interno disponible: </span>
              <Link
                href={withRole("/geoportal", role)}
                className="font-semibold text-[#2e7d32] underline hover:text-[#1b5e20]"
              >
                Geoportal del equipo SIG →
              </Link>
            </div>
          ) : null}
        </div>
      </section>

      {/* ── Entérate + Lo último ── */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">

          {/* Entérate — news cards */}
          <div>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="eyebrow mb-2">Noticias</p>
                <h2 className="font-display text-3xl text-[#1a1a1a]">Entérate</h2>
              </div>
              <Link
                href={withRole("/noticias", role)}
                className="hidden items-center gap-2 text-sm font-semibold text-[#2e7d32] transition hover:text-[#1b5e20] sm:inline-flex"
              >
                Ver todas
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="grid gap-5">
              {noticias.map((n) => (
                <article
                  key={n.slug}
                  className="surface-card flex flex-col gap-4"
                  style={{ borderTopColor: n.color, borderTopWidth: "3px" }}
                >
                  {/* placeholder image */}
                  <div
                    className="flex h-[140px] items-end rounded-[20px] p-4"
                    style={{
                      background: `linear-gradient(135deg, ${n.color}cc, ${n.color}66)`,
                    }}
                  >
                    <span className="rounded-full border border-white/25 bg-black/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white">
                      {n.categoria}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#7a756e]">
                    <span>{n.fecha}</span>
                    <span>·</span>
                    <span>{n.territorio}</span>
                  </div>
                  <h3 className="font-display text-xl text-[#1a1a1a]">{n.titulo}</h3>
                  <p className="line-clamp-2 text-sm leading-6 text-[#4a4540]">{n.resumen}</p>
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

          {/* Lo último — events list */}
          <div>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="eyebrow mb-2">Agenda</p>
                <h2 className="font-display text-3xl text-[#1a1a1a]">Lo último</h2>
              </div>
              <Link
                href={withRole("/noticias", role)}
                className="hidden items-center gap-2 text-sm font-semibold text-[#2e7d32] transition hover:text-[#1b5e20] sm:inline-flex"
              >
                Ver todo
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="divide-y divide-[#e8dfd3] rounded-[28px] border border-[#e8dfd3] bg-white overflow-hidden">
              {ultimosEventos.map((ev, i) => (
                <div key={i} className="flex items-start gap-4 px-5 py-4 transition hover:bg-[#f8f5f2]">
                  <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-xl bg-[#f0eae0]">
                    <Calendar className="h-4 w-4 text-[#7a756e]" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-[#7a756e]">
                      {ev.fecha} · <span className="font-semibold text-[#1a1a1a]">{ev.tipo}</span>
                    </p>
                    <p className="mt-1 text-sm font-medium leading-5 text-[#1a1a1a]">{ev.titulo}</p>
                    <p className="mt-0.5 text-xs text-[#7a756e]">{ev.lugar}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 sm:hidden">
              <Link
                href={withRole("/noticias", role)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#2e7d32] transition hover:text-[#1b5e20]"
              >
                Ver toda la agenda
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Quote / PCN identity block ── */}
      <section className="relative overflow-hidden bg-[#1a1a1a] px-4 py-16 sm:px-6 lg:px-8">
        <div className="absolute left-0 top-0 h-full w-2" aria-hidden="true">
          <span className="block h-1/4 bg-[#1a1a1a]" />
          <span className="block h-1/4 bg-[#2e7d32]" />
          <span className="block h-1/4 bg-[#d32f2f]" />
          <span className="block h-1/4 bg-[#fbc02d]" />
        </div>
        <div className="mx-auto max-w-3xl pl-8">
          <p className="font-display text-2xl italic leading-relaxed text-white sm:text-3xl">
            &ldquo;El territorio no es solo tierra, es memoria, identidad y futuro.&rdquo;
          </p>
          <p className="mt-4 text-sm text-white/50">— Proceso de Comunidades Negras, PCN</p>
        </div>
      </section>
    </SiteLayout>
  );
}
