import Link from "next/link";
import { Lock, UserCircle } from "lucide-react";
import type { ViewerRole } from "@/lib/mock-data";
import { withRole } from "@/lib/viewer";

type AdminGatedUIProps = {
  instrumento: string;
  role: ViewerRole;
  requestHref: string;
};

export function AdminGatedUI({ instrumento, role, requestHref }: AdminGatedUIProps) {
  return (
    <div className="relative overflow-hidden rounded-[32px] border border-[#e8dfd3] bg-[#f8f5f2] p-8 text-center shadow-inner sm:p-16">
      <div className="relative z-10 mx-auto max-w-2xl">
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full border border-[#e8dfd3] bg-white shadow-md">
          <Lock className="h-10 w-10 text-[#1a1a1a]" aria-hidden="true" />
        </div>

        <h2 className="mb-5 font-display text-3xl text-[#1a1a1a] sm:text-4xl">
          Acceso con validación administrativa
        </h2>
        <p className="mb-10 px-4 text-lg leading-relaxed text-[#4a4540]">
          Para acceder a estos documentos debes enviar una solicitud. El equipo admin revisa la
          información y te notificará por correo cuando apruebe o rechace tu acceso.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href={requestHref}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1a1a1a] px-8 py-4 text-sm font-bold tracking-wide text-white transition hover:scale-105 hover:bg-black sm:w-auto"
          >
            <UserCircle className="h-5 w-5" aria-hidden="true" />
            Solicitar acceso
          </Link>
          <Link
            href={withRole("/login", role, { redirect: `/gobierno-propio/${instrumento}` })}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#e8dfd3] bg-white px-8 py-4 text-sm font-bold tracking-wide text-[#1a1a1a] transition hover:bg-[#f8f5f2] sm:w-auto"
          >
            Ya tengo cuenta, iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
