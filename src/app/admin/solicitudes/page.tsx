import Link from "next/link";
import { AdminLayout, Callout, StatusPill, TableCard, Toolbar } from "@/components/mock/ui";
import { requireAdmin } from "@/lib/admin-access";
import {
  countPendingAccessRequests,
  listAccessRequestsWithMeta,
  type AccessLevel,
  type AccessRequestsDataMode,
  type AccessRequestStatus,
} from "@/lib/access-requests";
import { getFirstParam, type SearchParams, withRole } from "@/lib/viewer";

function formatDate(date: string) {
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
    body: "Supabase service no está configurado en el servidor. Se muestran solicitudes de ejemplo para no bloquear la revisión visual.",
  },
  mock_missing_table: {
    title: "Migraciones pendientes",
    body: "La tabla `public.access_requests` no existe en el proyecto remoto. Se muestran datos mock hasta aplicar `001_initial_schema.sql`.",
  },
  mock_query_error: {
    title: "Consulta no disponible",
    body: "No se pudo consultar solicitudes reales y no se detectó una tabla faltante. Revisa conexión y permisos de servicio.",
  },
};

export default async function AdminSolicitudesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { role, searchParams: params } = await requireAdmin(searchParams);

  const instrument = getFirstParam(params.instrument_slug) ?? "";
  const accessLevel = (getFirstParam(params.access_level) ?? "") as AccessLevel | "";
  const status = (getFirstParam(params.status) ?? "") as AccessRequestStatus | "";

  const [{ requests, mode }, pendingCount] = await Promise.all([
    listAccessRequestsWithMeta({
      instrument_slug: instrument || undefined,
      access_level: accessLevel || undefined,
      status: status || undefined,
    }),
    countPendingAccessRequests(),
  ]);

  return (
    <AdminLayout
      role={role}
      active="solicitudes"
      title="Solicitudes de acceso"
      intro="Revisión centralizada de solicitudes para instrumentos de Gobierno Propio. Usa filtros por instrumento, nivel y estado para priorizar decisiones."
      pendingSolicitudesCount={pendingCount}
    >
      <Toolbar
        actions={
          <div className="rounded-full bg-[color:var(--sand-strong)] px-4 py-2 text-sm font-medium text-[color:var(--forest)]">
            Pendientes: {pendingCount}
          </div>
        }
      >
        <form action="/admin/solicitudes" className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <input type="hidden" name="role" value={role} />
          <select name="instrument_slug" defaultValue={instrument} className="input-shell">
            <option value="">Instrumento</option>
            <option value="reglamentos">Reglamentos</option>
            <option value="planes-uso">Planes de uso</option>
            <option value="litigio">Litigio</option>
            <option value="conservacion">Conservación</option>
            <option value="etnodesarrollo">Etnodesarrollo</option>
            <option value="proteccion-hidrica">Protección hídrica</option>
          </select>

          <select name="access_level" defaultValue={accessLevel} className="input-shell">
            <option value="">Nivel</option>
            <option value="admin">Admin</option>
            <option value="coordination">Coordinación</option>
          </select>

          <select name="status" defaultValue={status} className="input-shell">
            <option value="">Estado</option>
            <option value="pending">Pendiente</option>
            <option value="approved">Aprobada</option>
            <option value="rejected">Rechazada</option>
          </select>

          <button type="submit" className="button-secondary">
            Filtrar
          </button>
        </form>
      </Toolbar>

      {mode !== "supabase" ? (
        <Callout tone="warning" title={modeCopy[mode].title}>
          <p>{modeCopy[mode].body}</p>
        </Callout>
      ) : null}

      <TableCard
        headers={[
          "Nombre",
          "Cédula",
          "Email",
          "Instrumento",
          "Nivel",
          "Fecha",
          "Estado",
          "Acciones",
        ]}
        columnWidths={[
          "min-w-[180px]",
          "min-w-[120px]",
          "min-w-[220px]",
          "min-w-[140px]",
          "min-w-[110px]",
          "min-w-[150px]",
          "min-w-[120px]",
          "w-24",
        ]}
        rows={requests.map((request) => [
          <span key="name" className="font-medium text-[color:var(--forest)]">
            {request.full_name}
          </span>,
          <span key="id">{request.national_id}</span>,
          <span key="email">{request.email}</span>,
          <span key="instrument" className="chip">
            {request.instrument_slug}
          </span>,
          <span key="level" className="chip">
            {request.access_level === "coordination" ? "Coordinación" : "Admin"}
          </span>,
          <span key="date">{formatDate(request.created_at)}</span>,
          <StatusPill
            key="status"
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
          />,
          <Link
            key="actions"
            href={withRole(`/admin/solicitudes/${request.id}`, role)}
            className="button-ghost"
          >
            Revisar
          </Link>,
        ])}
      />
    </AdminLayout>
  );
}
