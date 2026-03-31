import Link from "next/link";
import { AlertTriangle, UserCircle } from "lucide-react";
import type { ViewerRole } from "@/lib/mock-data";
import { withRole } from "@/lib/viewer";

type CoordinationGatedUIProps = {
  instrumento: string;
  role: ViewerRole;
  requestHref: string;
};

export function CoordinationGatedUI({
  instrumento,
  role,
  requestHref,
}: CoordinationGatedUIProps) {
  return (
    <div className="relative overflow-hidden rounded-[32px] border border-[#f0d8b2] bg-[#fff8ee] p-8 text-center shadow-inner sm:p-16">
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#f59f3a]/15 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-2xl">
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full border border-[#f0d8b2] bg-white shadow-md">
          <AlertTriangle className="h-10 w-10 text-[#b45309]" aria-hidden="true" />
        </div>

        <h2 className="mb-5 font-display text-3xl text-[#1a1a1a] sm:text-4xl">
          Acceso con revisión de coordinación
        </h2>
        <p className="mb-10 px-4 text-lg leading-relaxed text-[#4a4540]">
          Este instrumento contiene información territorial sensible. Debes diligenciar una
          solicitud con medidas de protección de datos. La coordinación revisa cada caso antes de
          autorizar cualquier descarga.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href={requestHref}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#b45309] px-8 py-4 text-sm font-bold tracking-wide text-white transition hover:scale-105 hover:bg-[#92400e] sm:w-auto"
          >
            <UserCircle className="h-5 w-5" aria-hidden="true" />
            Solicitar acceso de coordinación
          </Link>
          <Link
            href={withRole("/login", role, { redirect: `/gobierno-propio/${instrumento}` })}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#f0d8b2] bg-white px-8 py-4 text-sm font-bold tracking-wide text-[#1a1a1a] transition hover:bg-[#fff8ee] sm:w-auto"
          >
            Ya tengo cuenta, iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
