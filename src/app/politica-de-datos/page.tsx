import { SectionHeader, SiteLayout } from "@/components/mock/ui";
import { policyItems } from "@/lib/mock-data";
import { getViewerRoleFromRequest } from "@/lib/viewer-server";
import { type SearchParams } from "@/lib/viewer";

export default async function PoliticaDeDatosPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const role = await getViewerRoleFromRequest(params);

  return (
    <SiteLayout
      role={role}
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "Política de tratamiento de datos" },
      ]}
    >
      <section className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <article className="surface-card space-y-8">
          <SectionHeader
            eyebrow="Legal"
            title="Política de tratamiento de datos personales"
            description="Contenido mínimo sugerido para el MVP según el blueprint."
          />
          <ul className="grid gap-4 text-base leading-8 text-[color:var(--muted-strong)]">
            {policyItems.map((item) => (
              <li key={item} className="rounded-[22px] bg-white px-5 py-4">
                {item}
              </li>
            ))}
          </ul>
        </article>
      </section>
    </SiteLayout>
  );
}
