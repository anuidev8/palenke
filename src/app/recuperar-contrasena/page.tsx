import Link from "next/link";
import { Callout, Field, SiteLayout, TextInput } from "@/components/mock/ui";
import { getViewerRoleFromRequest } from "@/lib/viewer-server";
import { getFirstParam, type SearchParams, withRole } from "@/lib/viewer";

export default async function RecuperarContrasenaPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const role = await getViewerRoleFromRequest(params);
  const state = getFirstParam(params.state);

  return (
    <SiteLayout role={role} simplifiedHeader footerMinimal>
      <section className="mx-auto flex w-full max-w-xl flex-col gap-8 px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="eyebrow">Recuperación</p>
          <h1 className="mt-4 font-display text-4xl text-[color:var(--forest)]">Restablecer contraseña</h1>
        </div>

        <article className="surface-card space-y-6">
          <Field label="Correo electrónico" required>
            <TextInput type="email" defaultValue="maria@palenke.org" />
          </Field>

          <button type="button" className="button-primary justify-center">
            Enviar instrucciones
          </button>

          {state === "success" ? (
            <Callout tone="success" title="Correo enviado">
              <p>Te enviamos un correo con instrucciones para restablecer tu contraseña.</p>
            </Callout>
          ) : null}

          <Link href={withRole("/login", role)} className="button-ghost">
            ← Volver al inicio de sesión
          </Link>
        </article>
      </section>
    </SiteLayout>
  );
}
