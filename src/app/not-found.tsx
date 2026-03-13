import Link from "next/link";
import { SiteLayout } from "@/components/mock/ui";

export default function NotFound() {
  return (
    <SiteLayout role="public">
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-20 text-center sm:px-6 lg:px-8">
        <article className="surface-card space-y-6">
          <p className="eyebrow">404</p>
          <h1 className="font-display text-5xl text-[color:var(--forest)]">Esta página no existe</h1>
          <p className="text-base leading-8 text-[color:var(--muted-strong)]">
            Es posible que el enlace haya cambiado o que el contenido ya no esté disponible.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/" className="button-primary">
              ← Volver al inicio
            </Link>
            <Link href="/biblioteca" className="button-secondary">
              Ir a la Biblioteca
            </Link>
          </div>
        </article>
      </section>
    </SiteLayout>
  );
}

