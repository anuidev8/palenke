import Link from "next/link";
import { CampaignCard, Callout, PageBanner, SectionHeader, SiteLayout } from "@/components/mock/ui";
import HeroSection from "@/components/palenke/HeroSection";
import OpenSearchHeroButton from "@/components/palenke/OpenSearchHeroButton";
import { getGeneratedImage } from "@/lib/generate-image";
import { getVisibleCampaigns, homeIntro } from "@/lib/mock-data";
import { getFirstParam, getViewerRole, type SearchParams, withRole } from "@/lib/viewer";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const role = getViewerRole(params);
  const campaigns = getVisibleCampaigns(role, "home");
  const notice = getFirstParam(params.notice);

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
      <HeroSection
        eyebrow="Portal de Conocimiento"
        title={<>Soberanía, <br /> Memoria y Cuidado.</>}
        description="Espacio digital para organizar, custodiar y comunicar el trabajo político, técnico y comunitario del Palenke y el PCN."
        generatedImageUrl={await getGeneratedImage("hero-landing-v2", "A breathtaking, stylized vector-art illustration of the Colombian Pacific landscape. Featuring sweeping, elegant curves of a dark river weaving through lush, abstract emerald green mangrove forests and tropical foliage. Warm golden hour sunlight illuminating the scene with a soft, ethereal glow. A sense of deep ancestral connection, sovereignty, and care for the territory. Deep forest greens, rich earthy browns, terracotta, and warm gold. Modern, highly detailed, institutional graphic art style, perfect for a high-end website hero background. No people, no text, expansive and majestic.", "16:9")}
        actions={
          <>
            <OpenSearchHeroButton />
            <Link href={withRole("/mujeres-juventudes-ninez", role)} className="button-secondary">
              Ver agenda MJN
            </Link>
            {role === "admin" ? (
              <Link href={withRole("/admin", role)} className="button-secondary">
                Ir al Panel
              </Link>
            ) : null}
          </>
        }
      />

      <section className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8 lg:py-18">
        <div className="surface-card bg-[color:var(--forest)] text-[color:var(--sand)]">
          <p className="eyebrow text-[color:var(--gold-300)]">Quiénes somos</p>
          <h2 className="mt-4 font-display text-4xl">Presentación institucional</h2>
          <p className="mt-5 text-sm uppercase tracking-[0.2em] text-[color:rgb(245_237_214_/_0.54)]">
            Palenke de Pensamiento y Cuidadores del Territorio / PCN
          </p>
          <Link
            href={withRole("/biblioteca", role, { section: "Gobierno Propio" })}
            className="button-secondary mt-8 inline-flex"
          >
            Abrir Gobierno Propio
          </Link>
        </div>
        <div className="space-y-5">
          {homeIntro.map((paragraph) => (
            <p key={paragraph} className="text-base leading-8 text-[color:var(--muted-strong)]">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Módulos principales"
          title="Accesos rápidos"
          description="La portada conduce a la Biblioteca Base (incluido Gobierno Propio), la agenda de Mujeres, Juventudes y Niñez, las estadísticas y el acceso interno al geoportal."
        />
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: "Biblioteca Base",
              description: "Corpus documental con filtros por sección, territorio, tipo y enfoque de género.",
              href: "/biblioteca",
              label: "Explorar →",
            },
            {
              title: "Mujeres, Juventudes y Niñez",
              description: "Agenda política, campañas, memorias y materiales destacados.",
              href: "/mujeres-juventudes-ninez",
              label: "Explorar →",
            },
            {
              title: "Estadísticas y tableros",
              description: "Catálogo de tableros Power BI públicos e internos según el rol.",
              href: "/estadisticas",
              label: "Ver datos →",
            },
            {
              title: "Geoportal",
              description: isInternal(role)
                ? "Acceso al geoportal del equipo SIG de Hileros/PCN."
                : "Visible únicamente después de iniciar sesión.",
              href: isInternal(role) ? "/geoportal" : "/login",
              query: isInternal(role) ? undefined : { redirect: "/geoportal", message: "geoportal" },
              label: isInternal(role) ? "Abrir →" : "Iniciar sesión",
            },
          ].map((item) => (
            <article key={item.title} className="surface-card flex h-full flex-col gap-5">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[color:var(--sand-strong)] text-2xl">
                ◼
              </span>
              <div className="space-y-3">
                <h3 className="font-display text-2xl text-[color:var(--forest)]">{item.title}</h3>
                <p className="text-sm leading-6 text-[color:var(--muted-strong)]">{item.description}</p>
              </div>
              <Link href={withRole(item.href, role, item.query)} className="button-secondary mt-auto">
                {item.label}
              </Link>
            </article>
          ))}
        </div>
      </section>

      {campaigns.length > 0 ? (
        <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Contenido destacado"
            title="Campañas y contenidos prioritarios"
            description="Solo aparecen campañas activas y autorizadas para la visibilidad del rol actual."
          />
          <div className="mt-8 grid gap-6">
            {campaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} role={role} />
            ))}
          </div>
        </section>
      ) : null}
    </SiteLayout>
  );
}

function isInternal(role: "public" | "internal" | "admin") {
  return role === "internal" || role === "admin";
}
