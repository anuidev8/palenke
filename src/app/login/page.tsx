import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";
import { Callout, SiteLayout } from "@/components/mock/ui";
import { hasSupabasePublicConfig } from "@/lib/config";
import { getViewerRoleFromRequest } from "@/lib/viewer-server";
import { getFirstParam, type SearchParams, withRole } from "@/lib/viewer";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const role = await getViewerRoleFromRequest(params);
  const state = getFirstParam(params.state);
  const redirectTo = getFirstParam(params.redirect) ?? "/studio";
  const message = getFirstParam(params.message);
  const supabaseReady = hasSupabasePublicConfig();

  const contextualMessage =
    message === "geoportal"
      ? "Debes iniciar sesión para acceder al geoportal."
      : message === "solicitudes"
        ? "Inicia sesión para revisar el historial de tus solicitudes y su estado."
      : redirectTo !== "/studio" && redirectTo !== "/"
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

          <LoginForm redirectTo={redirectTo} />

          <div className="grid gap-4">
            <Link href={withRole("/recuperar-contrasena", role)} className="text-sm text-[color:var(--gold-700)]">
              ¿Olvidaste tu contraseña?
            </Link>

            {state === "disabled" ? (
              <Callout tone="danger" title="Cuenta desactivada">
                <p>Tu cuenta ha sido desactivada. Contacta a la coordinación del Palenke.</p>
              </Callout>
            ) : null}
          </div>

          <p className="text-sm leading-6 text-[color:var(--muted-strong)]">
            No se aceptan registros públicos. Las cuentas son gestionadas por la coordinación del
            Palenke.
          </p>

          <p className="text-xs leading-6 text-[color:var(--muted)]">
            Al iniciar sesión aceptas nuestra{" "}
            <Link href={withRole("/politica-de-datos", role)} className="underline">
              Política de tratamiento de datos
            </Link>
            .
          </p>
        </article>

        {supabaseReady ? null : (
          <Callout tone="info" title="Accesos de demostración del mock">
            <p>Supabase no está configurado todavía. Puedes usar accesos simulados temporalmente:</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href={withRole(redirectTo, "internal")} className="button-secondary">
                Entrar como Interno
              </Link>
              <Link href={withRole(redirectTo, "admin")} className="button-secondary">
                Entrar como Admin
              </Link>
            </div>
          </Callout>
        )}
      </section>
    </SiteLayout>
  );
}
