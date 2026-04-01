import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminLayout, Callout, StatusPill } from "@/components/mock/ui";
import { requireAdmin } from "@/lib/admin-access";
import {
  getAccessRequestByIdWithMeta,
  type AccessRequestsDataMode,
} from "@/lib/access-requests";
import { getFirstParam, type SearchParams, withRole } from "@/lib/viewer";
import { approveRequest, rejectRequest } from "./actions";

function formatDate(date: string | null) {
  if (!date) return "—";
  return new Date(date).toLocaleString("es-CO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const modeCopy: Record<Exclude<AccessRequestsDataMode, "supabase">, { title: string; body: string }> = {
  mock_missing_service_config: {
    title: "Modo de contingencia",
    body: "Supabase service no está configurado en el servidor. Se muestra un registro de ejemplo para no bloquear la revisión de interfaz.",
  },
  mock_missing_table: {
    title: "Migraciones pendientes",
    body: "Las tablas remotas aún no están disponibles. Aplica `001_initial_schema.sql` y `002_seed_documents.sql` para operar con solicitudes reales.",
  },
  mock_query_error: {
    title: "Consulta no disponible",
    body: "No se pudo consultar la solicitud real y no se detectó una tabla faltante. Revisa conexión y permisos de servicio.",
  },
};

export default async function AdminSolicitudDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { id } = await params;
  const { role, searchParams: query } = await requireAdmin(searchParams);
  const { request, mode } = await getAccessRequestByIdWithMeta(id);
  const error = getFirstParam(query.error);
  const notice = getFirstParam(query.notice);

  if (!request) {
    notFound();
  }

  const approveAction = approveRequest.bind(null, request.id);
  const rejectAction = rejectRequest.bind(null, request.id);

  return (
    <AdminLayout
      role={role}
      active="solicitudes"
      title="Revisión de solicitud"
      intro="Valida la información enviada por la persona solicitante y decide aprobación o rechazo."
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href={withRole("/admin/solicitudes", role)} className="button-ghost">
          ← Volver a solicitudes
        </Link>
        <StatusPill
          label={
            request.status === "pending"
              ? "Pendiente"
              : request.status === "approved"
                ? "Aprobada"
                : "Rechazada"
          }
          tone={
            request.status === "pending"
              ? "warning"
              : request.status === "approved"
                ? "success"
                : "danger"
          }
        />
      </div>

      {error === "missing-reason" ? (
        <Callout tone="danger" title="Razón obligatoria">
          <p>Debes ingresar una razón para rechazar la solicitud.</p>
        </Callout>
      ) : null}

      {notice === "missing-config" ? (
        <Callout tone="warning" title="Configuración pendiente">
          <p>Faltan variables de entorno para ejecutar la acción contra Supabase.</p>
        </Callout>
      ) : null}

      {notice === "missing-table" ? (
        <Callout tone="warning" title="Migraciones pendientes">
          <p>
            Las tablas de Supabase aún no están disponibles en el proyecto remoto. Aplica las
            migraciones `001_initial_schema.sql` y `002_seed_documents.sql`.
          </p>
        </Callout>
      ) : null}

      {mode !== "supabase" &&
      !(
        (mode === "mock_missing_service_config" && notice === "missing-config") ||
        (mode === "mock_missing_table" && notice === "missing-table")
      ) ? (
        <Callout tone="warning" title={modeCopy[mode].title}>
          <p>{modeCopy[mode].body}</p>
        </Callout>
      ) : null}

      <section className="grid gap-4 rounded-3xl border border-[color:var(--border-soft)] bg-white p-6">
        <h2 className="font-display text-2xl text-[color:var(--forest)]">Datos de la solicitud</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <p>
            <strong>Nombre:</strong> {request.full_name}
          </p>
          <p>
            <strong>Cédula:</strong> {request.national_id}
          </p>
          <p>
            <strong>Email:</strong> {request.email}
          </p>
          <p>
            <strong>Comunidad / institución:</strong> {request.community}
          </p>
          <p>
            <strong>Instrumento:</strong> {request.instrument_slug}
          </p>
          <p>
            <strong>Nivel:</strong>{" "}
            {request.access_level === "coordination" ? "Coordinación" : "Administrativo"}
          </p>
          <p>
            <strong>Fecha de envío:</strong> {formatDate(request.created_at)}
          </p>
          <p>
            <strong>Última revisión:</strong> {formatDate(request.reviewed_at)}
          </p>
        </div>

        <div className="grid gap-2">
          <p className="text-sm font-semibold text-[color:var(--forest)]">Motivación</p>
          <p className="rounded-2xl bg-[color:var(--sand-strong)] p-4 text-sm leading-6 text-[color:var(--muted-strong)]">
            {request.motivation}
          </p>
        </div>

        <div className="grid gap-2">
          <p className="text-sm font-semibold text-[color:var(--forest)]">Afiliación PCN/Hileros</p>
          <p className="rounded-2xl bg-[color:var(--sand-strong)] p-4 text-sm leading-6 text-[color:var(--muted-strong)]">
            {request.pcn_affiliation || "No reportada"}
          </p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <form action={approveAction} className="surface-card grid gap-4">
          <h3 className="font-display text-xl text-[color:var(--forest)]">Aprobar solicitud</h3>
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-[color:var(--forest)]">
              Notas de aprobación (opcional)
            </span>
            <textarea name="notes" className="textarea-shell" rows={4} />
          </label>
          <button type="submit" className="button-primary justify-center">
            Aprobar
          </button>
        </form>

        <form action={rejectAction} className="surface-card grid gap-4">
          <h3 className="font-display text-xl text-[color:var(--forest)]">Rechazar solicitud</h3>
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-[color:var(--forest)]">
              Razón del rechazo<span className="ml-1 text-[color:var(--danger)]">*</span>
            </span>
            <textarea name="reason" className="textarea-shell" rows={4} required />
          </label>
          <button type="submit" className="button-secondary justify-center">
            Rechazar
          </button>
        </form>
      </section>
    </AdminLayout>
  );
}
