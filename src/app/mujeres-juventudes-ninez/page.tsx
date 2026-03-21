import Link from "next/link";
import {
  CampaignCard,
  SectionHeader,
  SiteLayout,
  Callout,
} from "@/components/mock/ui";
import HeroSection from "@/components/palenke/HeroSection";
import DocumentCard from "@/components/palenke/DocumentCard";
import { getVisibleCampaigns, getVisibleMjnDocuments, mjnContext, mjnQuote, mjnStories } from "@/lib/mock-data";
import { getFirstParam, getViewerRole, type SearchParams, withRole } from "@/lib/viewer";
import { PiezasAutorizadasSection } from "@/components/PiezasAutorizadasSection";

export default async function MjnPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const role = getViewerRole(params);
  const tab = getFirstParam(params.tab) ?? "all";
  const documents = getVisibleMjnDocuments(role).filter((document) => {
    if (tab === "litigio") {
      return document.section === "Rutas de litigio estratégico";
    }

    if (tab === "pedagogico") {
      return document.section === "Material pedagógico/comunitario";
    }

    if (tab === "memorias") {
      return document.action === "video" || document.type === "Cartilla";
    }

    return true;
  });

  const campaigns = getVisibleCampaigns(role, "mjn");

  // Filter mjnStories just like the previous inline filter
  const visibleStories = mjnStories.filter((story) => {
    if (!story.publicationAuthorized) {
      return false;
    }
    if (story.visibility === "internal") {
      return role !== "public";
    }
    return true;
  });

  return (
    <SiteLayout role={role}>
      <HeroSection
        eyebrow="Agenda Estratégica"
        title={<>Mujeres, <br />Juventudes y Niñez</>}
        description="Espacio editorial para contexto político, materiales pedagógicos, memorias autorizadas y campañas activas de la agenda MJN."
        actions={
          <Link href={withRole("/biblioteca", role)} className="button-primary">
            Explorar Documentos
          </Link>
        }
      />

      <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div className="space-y-5">
          <SectionHeader
            eyebrow="Contexto"
            title="Texto político editable"
            description="Este bloque sintetiza la agenda, sus prioridades y su relación con el territorio."
          />
          {mjnContext.map((paragraph) => (
            <p key={paragraph} className="text-base leading-8 text-[color:var(--muted-strong)]">
              {paragraph}
            </p>
          ))}
        </div>
        <Callout tone="info" title="Cita destacada">
          <p className="font-display text-2xl leading-9 text-[color:var(--forest)]">{mjnQuote}</p>
        </Callout>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Documentos y materiales"
          title="Documentos vinculados a la agenda MJN"
          description="Se reutiliza el mismo componente de la Biblioteca Base y se filtra según etiquetas editoriales y enfoque de género."
        />
        <div className="mt-6 flex flex-wrap gap-3">
          {[
            { id: "all", label: "Todos" },
            { id: "litigio", label: "Rutas de litigio" },
            { id: "pedagogico", label: "Pedagógico" },
            { id: "memorias", label: "Memorias y relatos" },
          ].map((item) => (
            <Link
              key={item.id}
              href={withRole("/mujeres-juventudes-ninez", role, item.id === "all" ? undefined : { tab: item.id })}
              className={tab === item.id ? "button-primary" : "button-secondary"}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="mt-8 grid gap-5 xl:grid-cols-2">
          {documents.map((document) => (
            <DocumentCard 
              key={document.id} 
              title={document.title} 
              category={document.section} 
              date={document.year.toString()} 
              visibility={document.visibility === "public" ? "publico" : document.visibility === "internal" ? "interno" : "sensible"} 
              href={withRole(`/biblioteca/${document.slug}`, role)}
            />
          ))}
        </div>
        <div className="mt-6">
          <Link href={withRole("/biblioteca", role)} className="button-secondary">
            Ver todos en la Biblioteca →
          </Link>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <PiezasAutorizadasSection stories={visibleStories} />
      </div>

      {campaigns.length > 0 ? (
        <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Campañas"
            title="Campañas y contenidos destacados"
            description="Las campañas activas pueden mostrarse tanto en Home como en la agenda MJN, según su configuración."
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
