import Link from "next/link";
import { Callout, Field, SiteLayout, TextInput } from "@/components/mock/ui";
import { getFirstParam, getViewerRole, type SearchParams, withRole } from "@/lib/viewer";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const role = getViewerRole(params);
  const state = getFirstParam(params.state);
  const redirectTo = getFirstParam(params.redirect) ?? "/";
  const message = getFirstParam(params.message);

  const contextualMessage =
    message === "geoportal"
      ? "Debes iniciar sesión para acceder al geoportal."
      : redirectTo !== "/"
        ? "Este contenido es solo para miembros del Palenke/PCN. Inicia sesión para continuar."
        : "";

  return (
    <SiteLayout role={role} simplifiedHeader footerMinimal>
      <section className="mx-auto flex w-full max-w-xl flex-col gap-8 px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="eyebrow">Acceso interno</p>
          <h1 className="mt-4 font-display text-4xl text-[color:var(--forest)]">Iniciar sesión</h1>
        </div>

        <article className="surface-card space-y-6">
          {contextualMessage ? (
            <Callout tone="warning" title="Acceso requerido">
              <p>{contextualMessage}</p>
            </Callout>
          ) : null}

          <form className="grid gap-5">
            <Field label="Correo electrónico" required error={state === "error" ? "Correo o contraseña incorrectos." : undefined}>
              <TextInput type="email" defaultValue="maria@palenke.org" error={state === "error"} />
            </Field>

            <Field label="Contraseña" required>
              <TextInput type="password" defaultValue="••••••••••" error={state === "error"} />
            </Field>

            <Link href={withRole("/recuperar-contrasena", role)} className="text-sm text-[color:var(--gold-700)]">
              ¿Olvidaste tu contraseña?
            </Link>

            {state === "disabled" ? (
              <Callout tone="danger" title="Cuenta desactivada">
                <p>Tu cuenta ha sido desactivada. Contacta a la coordinación del Palenke.</p>
              </Callout>
            ) : null}

            <button type="button" className="button-primary justify-center" disabled={state === "loading"}>
              {state === "loading" ? "Entrando…" : "Iniciar sesión"}
            </button>

            <p className="text-sm leading-6 text-[color:var(--muted-strong)]">
              No se aceptan registros públicos. Las cuentas son gestionadas por la coordinación del Palenke.
            </p>

            <p className="text-xs leading-6 text-[color:var(--muted)]">
              Al iniciar sesión aceptas nuestra{" "}
              <Link href={withRole("/politica-de-datos", role)} className="underline">
                Política de tratamiento de datos
              </Link>
              .
            </p>
          </form>
        </article>

        <Callout tone="info" title="Accesos de demostración del mock">
          <p>Para recorrer el flujo sin backend, usa uno de estos accesos simulados:</p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href={withRole(redirectTo, "internal")} className="button-secondary">
              Entrar como Interno
            </Link>
            <Link href={withRole(redirectTo, "admin")} className="button-secondary">
              Entrar como Admin
            </Link>
          </div>
        </Callout>
      </section>
    </SiteLayout>
  );
}

