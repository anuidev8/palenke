import { SiteLayout } from "@/components/mock/ui";
import { MemoriaAfroterritorialSubnav } from "@/components/palenke/MemoriaAfroterritorialSubnav";
import MediatecaUbuntuGallerySection from "@/components/palenke/MediatecaUbuntuGallerySection";
import { getVisibleMediatecaUbuntuGalleryMedia } from "@/lib/mediateca-ubuntu-gallery-data";
import { getViewerRoleFromRequest } from "@/lib/viewer-server";
import { type SearchParams } from "@/lib/viewer";

export default async function MediatecaUbuntuPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const role = await getViewerRoleFromRequest(params);
  const galleryMedia = getVisibleMediatecaUbuntuGalleryMedia(role).toSorted(
    (a, b) => b.year - a.year,
  );

  return (
    <SiteLayout
      role={role}
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "Memoria Afroterritorial", href: "/memoria-afroterritorial" },
        { label: "Mediateca Ubuntu" },
      ]}
    >
      <MemoriaAfroterritorialSubnav role={role} />

      <section className="relative overflow-hidden border-b border-[#e8dfd3] bg-[#F7F5F0] px-4 py-14 sm:px-6 lg:px-8">
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="absolute top-[20%] right-[20%] h-[420px] w-[420px] rounded-full bg-gradient-to-br from-[#2e7d32]/[0.06] to-transparent blur-[120px]" />
          <div className="absolute bottom-0 left-[10%] h-[360px] w-[360px] rounded-full bg-gradient-to-t from-[#fbc02d]/[0.07] to-transparent blur-[100px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl">
          <p className="eyebrow mb-3 text-[#2e7d32]">Memoria Afroterritorial</p>
          <h1 className="font-display text-4xl text-[#1a1a1a] sm:text-5xl lg:text-6xl">
            Mediateca Ubuntu
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[#4a4540]">
            La Mediateca Ubuntu es el archivo vivo de memoria audiovisual del Palenke, encargado de
            custodiar fotografías, videos, audios, entrevistas y relatos comunitarios que documentan
            los procesos territoriales, organizativos y espirituales del pueblo negro. Su función es
            preservar la memoria colectiva, fortalecer la formación política y garantizar que la voz,
            la imagen y el conocimiento de la comunidad circulen con dignidad, consentimiento y
            autonomía.
          </p>
        </div>
      </section>

      <section className="border-t border-[#e8dfd3] bg-[#f7f3ed] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <MediatecaUbuntuGallerySection items={galleryMedia} />
        </div>
      </section>
    </SiteLayout>
  );
}
