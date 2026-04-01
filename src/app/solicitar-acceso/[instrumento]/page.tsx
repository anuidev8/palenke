import Link from "next/link";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { notFound } from "next/navigation";
import { Callout, SiteLayout } from "@/components/mock/ui";
import { AccessRequestForm } from "@/components/palenke/AccessRequestForm";
import { getViewerRoleFromRequest } from "@/lib/viewer-server";
import { getFirstParam, type SearchParams, withRole } from "@/lib/viewer";

const instrumentRequestConfig = {
  reglamentos: {
    title: "Reglamentos internos",
    accessLevel: "admin",
  },
  "planes-uso": {
    title: "Planes de uso y manejo",
    accessLevel: "coordination",
  },
  litigio: {
    title: "Litigio estratégico",
    accessLevel: "admin",
  },
  conservacion: {
    title: "Áreas bioculturales de conservación comunitaria",
    accessLevel: "coordination",
  },
  etnodesarrollo: {
    title: "Etnodesarrollo",
    accessLevel: "admin",
  },
  "proteccion-hidrica": {
    title: "Protección hídrica",
    accessLevel: "admin",
  },
} as const;

type InstrumentSlug = keyof typeof instrumentRequestConfig;

export default async function SolicitarAccesoPage({
  params,
  searchParams,
}: {
  params: Promise<{ instrumento: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { instrumento } = await params;
  const sp = await searchParams;
  const role = await getViewerRoleFromRequest(sp);
  const documentId = getFirstParam(sp.documentId) ?? "";
  const documentTitle = getFirstParam(sp.documentTitle) ?? "";

  if (!(instrumento in instrumentRequestConfig)) {
    notFound();
  }

  const inst = instrumentRequestConfig[instrumento as InstrumentSlug];
  const isCoordination = inst.accessLevel === "coordination";

  return (
    <SiteLayout
      role={role}
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "Gobierno Propio", href: "/gobierno-propio" },
        { label: inst.title, href: `/gobierno-propio/${instrumento}` },
        { label: "Solicitar acceso" },
      ]}
    >
      <section className="bg-[#fcfaf7] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-4xl space-y-8">
          <div className="space-y-4">
            <Link
              href={withRole(`/gobierno-propio/${instrumento}`, role)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#4a4540] transition hover:text-[#1a1a1a]"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Volver al instrumento
            </Link>

            <div className="space-y-3">
              <p className="eyebrow">Solicitud de acceso</p>
              <h1 className="font-display text-4xl leading-tight text-[#1a1a1a] sm:text-5xl">
                {inst.title}
              </h1>
              <p className="max-w-3xl text-base leading-7 text-[#4a4540] sm:text-lg">
                Completa este formulario para solicitar acceso a un archivo específico del
                instrumento.
              </p>
            </div>
          </div>

          {isCoordination ? (
            <Callout tone="warning" title="Validación de coordinación">
              <p>
                Este instrumento requiere revisión especial por sensibilidad territorial. Incluye
                las medidas de protección de datos en tu solicitud.
              </p>
            </Callout>
          ) : (
            <Callout tone="info" title="Validación administrativa">
              <p>
                El equipo admin revisa la solicitud y responde por correo. Tiempo estimado: 1 día
                hábil.
              </p>
            </Callout>
          )}

          <div className="rounded-[24px] border border-[#e8dfd3] bg-[#fffaf2] p-4 sm:p-5">
            <p className="inline-flex items-center gap-2 text-sm text-[#6b5f53]">
              <ShieldAlert className="h-4 w-4" aria-hidden="true" />
              Tus datos se usan únicamente para validar y registrar la solicitud de acceso.
            </p>
          </div>

          {documentId && documentTitle ? (
            <AccessRequestForm
              instrumentSlug={instrumento}
              instrumentTitle={inst.title}
              documentId={documentId}
              documentTitle={documentTitle}
              accessLevel={inst.accessLevel}
            />
          ) : (
            <Callout tone="warning" title="Selecciona un documento">
              <p>
                Esta ruta ahora gestiona solicitudes por archivo. Vuelve al instrumento y elige el
                documento exacto que quieres solicitar.
              </p>
            </Callout>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
