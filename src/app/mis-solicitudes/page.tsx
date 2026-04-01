import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2, Clock3, FileClock, FileSearch, Mail, ShieldCheck, XCircle } from "lucide-react";
import { Callout, SiteLayout } from "@/components/mock/ui";
import {
  formatAccessRequestStatusLabel,
  formatInstrumentLabel,
  listAccessRequestsForEmailWithMeta,
  type AccessRequestsDataMode,
} from "@/lib/access-requests";
import { listGrantedDocumentIdsForViewer } from "@/lib/document-access";
import { getViewerSessionState } from "@/lib/viewer-server";
import { withRole } from "@/lib/viewer";

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString("es-CO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusMeta(status: "pending" | "approved" | "rejected") {
  if (status === "approved") {
    return {
      icon: CheckCircle2,
      tone: "text-[#1f6f3d] bg-[#eef8f1] border-[#cfe7d7]",
      title: "Aprobada",
      description: "La solicitud fue validada por el equipo.",
    } as const;
  }

  if (status === "rejected") {
    return {
      icon: XCircle,
      tone: "text-[#8a3b2f] bg-[#fff3f0] border-[#f2d5cf]",
      title: "Rechazada",
      description: "La solicitud no fue aprobada.",
    } as const;
  }

  return {
    icon: Clock3,
    tone: "text-[#9c5d00] bg-[#fff7e8] border-[#f0d8a8]",
    title: "En revisión",
    description: "Está pendiente de revisión por el equipo administrador.",
  } as const;
}

const modeCopy: Record<Exclude<AccessRequestsDataMode, "supabase">, { title: string; body: string }> = {
  mock_missing_service_config: {
    title: "Modo de contingencia",
    body: "El historial se muestra en modo de ejemplo mientras falta la configuración de servicio de Supabase.",
  },
  mock_missing_table: {
    title: "Migraciones pendientes",
    body: "Las tablas remotas todavía no están listas. El historial visible es de referencia.",
  },
  mock_query_error: {
    title: "Historial no disponible",
    body: "No fue posible consultar tus solicitudes en este momento. Intenta nuevamente más tarde.",
  },
};

export default async function MisSolicitudesPage() {
  const sessionState = await getViewerSessionState();

  if (!sessionState.isAuthenticated || !sessionState.email) {
    redirect("/login?redirect=/mis-solicitudes&message=solicitudes");
  }

  const { requests, mode } = await listAccessRequestsForEmailWithMeta(sessionState.email);
  const grantedDocIds = Array.from(
    await listGrantedDocumentIdsForViewer({
      documentIds: requests.flatMap((request) => (request.document_id ? [request.document_id] : [])),
      userId: sessionState.userId,
      email: sessionState.email,
    }),
  );
  const grantedDocIdSet = new Set(grantedDocIds);

  return (
    <SiteLayout
      role={sessionState.role}
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "Mis solicitudes" },
      ]}
    >
      <section className="bg-[#fcfaf7] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl space-y-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <p className="eyebrow">Seguimiento personal</p>
              <h1 className="font-display text-4xl leading-tight text-[#1a1a1a] sm:text-5xl">
                Mis solicitudes
              </h1>
              <p className="max-w-3xl text-base leading-7 text-[#4a4540] sm:text-lg">
                Aquí puedes revisar el estado de tus solicitudes, saber si siguen en revisión y
                confirmar cuándo un documento ya quedó habilitado para tu cuenta.
              </p>
            </div>

            <div className="rounded-[28px] border border-[#e8dfd3] bg-white px-6 py-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7a756e]">
                Correo asociado
              </p>
              <p className="mt-2 text-base font-semibold text-[#1a1a1a]">{sessionState.email}</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[28px] border border-[#f0d8a8] bg-[#fff7e8] p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-white p-3 text-[#9c5d00] shadow-sm">
                  <FileClock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#9c5d00]">Pendientes</p>
                  <p className="text-2xl font-display text-[#1a1a1a]">
                    {requests.filter((request) => request.status === "pending").length}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-[#cfe7d7] bg-[#eef8f1] p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-white p-3 text-[#1f6f3d] shadow-sm">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1f6f3d]">Con acceso habilitado</p>
                  <p className="text-2xl font-display text-[#1a1a1a]">{grantedDocIds.length}</p>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-[#d7dbe5] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-[#f4f6fb] p-3 text-[#51607a] shadow-sm">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#51607a]">Total registradas</p>
                  <p className="text-2xl font-display text-[#1a1a1a]">{requests.length}</p>
                </div>
              </div>
            </div>
          </div>

          {mode !== "supabase" ? (
            <Callout tone="warning" title={modeCopy[mode].title}>
              <p>{modeCopy[mode].body}</p>
            </Callout>
          ) : null}

          <div className="rounded-[32px] border border-[#d8e7d5] bg-[#f5fbf3] p-6 shadow-sm">
            <p className="text-sm font-semibold text-[#234b1f]">Cómo leer este historial</p>
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-[#476243]">
              <li>Si una solicitud aparece como pendiente, todavía está esperando revisión del equipo.</li>
              <li>Si aparece aprobada, significa que el documento ya fue validado para entrega o acceso.</li>
              <li>Si ya tienes acceso activo, puedes volver al instrumento correspondiente para descargar el archivo.</li>
            </ul>
          </div>

          {requests.length === 0 ? (
            <div className="rounded-[32px] border border-dashed border-[#d7dbe5] bg-white px-6 py-16 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f4f6fb] text-[#51607a]">
                <FileSearch className="h-7 w-7" />
              </div>
              <h2 className="mt-6 font-display text-3xl text-[#1a1a1a]">Todavía no tienes solicitudes</h2>
              <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-[#4a4540]">
                Cuando solicites acceso a un documento, aquí podrás revisar el estado, la fecha de
                envío y cualquier observación relacionada con la revisión.
              </p>
              <Link
                href={withRole("/gobierno-propio", sessionState.role)}
                className="mt-8 inline-flex items-center justify-center rounded-[14px] bg-[#1a1a1a] px-6 py-3 text-sm font-bold text-white transition hover:bg-black"
              >
                Explorar documentos
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {requests.map((request) => {
                const statusMeta = getStatusMeta(request.status);
                const StatusIcon = statusMeta.icon;
                const hasGrant = Boolean(request.document_id && grantedDocIdSet.has(request.document_id));

                return (
                  <article
                    key={request.id}
                    className="overflow-hidden rounded-[32px] border border-[#e8dfd3] bg-white shadow-sm"
                  >
                    <div className="border-b border-[#e8dfd3] bg-[#fcfaf7] px-6 py-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="space-y-2">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7a756e]">
                            {formatInstrumentLabel(request.instrument_slug)}
                          </p>
                          <h2 className="font-display text-2xl leading-tight text-[#1a1a1a]">
                            {request.document_title ?? "Documento solicitado"}
                          </h2>
                        </div>
                        <span
                          className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold ${statusMeta.tone}`}
                        >
                          <StatusIcon className="h-4 w-4" />
                          {formatAccessRequestStatusLabel(request.status)}
                        </span>
                      </div>
                    </div>

                    <div className="grid gap-5 px-6 py-6">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl bg-[#fcfaf7] p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7a756e]">
                            Estado
                          </p>
                          <p className="mt-2 text-sm leading-6 text-[#4a4540]">{statusMeta.description}</p>
                        </div>
                        <div className="rounded-2xl bg-[#fcfaf7] p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7a756e]">
                            Fecha de envío
                          </p>
                          <p className="mt-2 text-sm leading-6 text-[#4a4540]">{formatDate(request.created_at)}</p>
                        </div>
                      </div>

                      <div className="rounded-2xl bg-[#fcfaf7] p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7a756e]">
                          Motivo registrado
                        </p>
                        <p className="mt-2 text-sm leading-6 text-[#4a4540]">{request.motivation}</p>
                      </div>

                      {request.reviewer_notes ? (
                        <div className="rounded-2xl border border-[#e8dfd3] bg-white p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7a756e]">
                            Observación del equipo
                          </p>
                          <p className="mt-2 text-sm leading-6 text-[#4a4540]">{request.reviewer_notes}</p>
                        </div>
                      ) : null}

                      <div className="flex flex-wrap items-center gap-3">
                        {hasGrant ? (
                          <span className="inline-flex items-center gap-2 rounded-full bg-[#eef8f1] px-4 py-2 text-sm font-semibold text-[#1f6f3d]">
                            <ShieldCheck className="h-4 w-4" />
                            Acceso activo para este documento
                          </span>
                        ) : null}

                        <Link
                          href={withRole(`/gobierno-propio/${request.instrument_slug}`, sessionState.role)}
                          className="inline-flex items-center justify-center rounded-[14px] border border-[#e8dfd3] px-4 py-2 text-sm font-semibold text-[#1a1a1a] transition hover:bg-[#f8f5f2]"
                        >
                          Ver instrumento
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
