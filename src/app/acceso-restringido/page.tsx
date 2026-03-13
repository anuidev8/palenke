import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";
import { SiteLayout } from "@/components/mock/ui";
import { getFirstParam, getViewerRole, type SearchParams, withRole } from "@/lib/viewer";

export default async function AccesoRestringidoPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const role = getViewerRole(params);
  const redirectTo = getFirstParam(params.redirect) ?? "/";

  return (
    <SiteLayout role={role}>
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-20 text-center sm:px-6 lg:px-8">
        <article className="surface-card space-y-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[color:var(--sand-strong)]">
            <Lock className="h-9 w-9 text-[color:var(--forest)]" aria-hidden="true" />
          </div>
          <div className="space-y-3">
            <h1 className="font-display text-4xl text-[color:var(--forest)]">Contenido restringido</h1>
            <p className="text-base leading-8 text-[color:var(--muted-strong)]">
              Este contenido es solo para miembros del Palenke/PCN.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href={`/login?redirect=${encodeURIComponent(redirectTo)}`} className="button-primary">
              Iniciar sesión
            </Link>
            <Link href={withRole("/", role)} className="button-secondary">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span>Volver al inicio</span>
            </Link>
          </div>
        </article>
      </section>
    </SiteLayout>
  );
}
