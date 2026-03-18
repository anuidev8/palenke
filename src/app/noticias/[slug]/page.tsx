import Link from "next/link";
import { BookOpen, BarChart2, ShieldCheck } from "lucide-react";
import { SiteLayout } from "@/components/mock/ui";
import { getViewerRole, type SearchParams, withRole } from "@/lib/viewer";
import { fallbackNewsArticle, findNewsArticleBySlug } from "@/lib/newsroom";

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

  const articulo = findNewsArticleBySlug(slug) ?? { ...fallbackNewsArticle, slug };

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
            <span className="inline-block rounded-full bg-[#1a1a1a] px-4 py-1.5 text-xs font-semibold text-white">
              {articulo.publisher}
            </span>
            <span className="inline-block rounded-full bg-[#f0eae0] px-4 py-1.5 text-xs font-semibold text-[#4a4540]">
              {articulo.fechaLarga}
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
