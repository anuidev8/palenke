import Link from "next/link";
import { AdminLayout, StatusPill, TableCard, Toolbar, VisibilityBadge } from "@/components/mock/ui";
import { dashboards } from "@/lib/mock-data";
import { requireAdmin } from "@/lib/admin-access";
import { getFirstParam, type SearchParams, withRole } from "@/lib/viewer";

export default async function AdminDashboardsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { role, searchParams: params } = await requireAdmin(searchParams);
  const query = (getFirstParam(params.q) ?? "").toLowerCase();
  const topic = getFirstParam(params.topic) ?? "";
  const visibility = getFirstParam(params.visibility) ?? "";

  const filtered = dashboards.filter((dashboard) => {
    const matchesQuery =
      !query || `${dashboard.title} ${dashboard.description}`.toLowerCase().includes(query);
    const matchesTopic = !topic || dashboard.topic === topic;
    const matchesVisibility = !visibility || dashboard.visibility === visibility;

    return matchesQuery && matchesTopic && matchesVisibility;
  });

  return (
    <AdminLayout
      role={role}
      active="dashboards"
      title="Estadísticas — Tableros Power BI"
      intro="Registro administrativo de tableros embebidos, con filtros por tema y visibilidad."
    >
      <Toolbar
        actions={
          <Link href={withRole("/admin/dashboards/nuevo", role)} className="button-primary">
            + Nuevo tablero
          </Link>
        }
      >
        <form action="/admin/dashboards" className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <input name="q" defaultValue={getFirstParam(params.q)} placeholder="Buscar" className="input-shell" />
          <select name="topic" defaultValue={topic} className="input-shell">
            <option value="">Tema</option>
            {Array.from(new Set(dashboards.map((dashboard) => dashboard.topic))).map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select name="visibility" defaultValue={visibility} className="input-shell">
            <option value="">Visibilidad</option>
            <option value="public">Público</option>
            <option value="internal">Interno</option>
          </select>
          <button type="submit" className="button-secondary">
            Filtrar
          </button>
        </form>
      </Toolbar>

      <TableCard
        headers={["Título", "Tema", "Territorio", "Visibilidad", "Estado", "⋮"]}
        rows={filtered.map((dashboard) => [
          <Link key="title" href={withRole(`/admin/dashboards/${dashboard.id}/editar`, role)} className="font-medium text-[color:var(--forest)] underline">
            {dashboard.title}
          </Link>,
          <span key="topic">{dashboard.topic}</span>,
          <span key="territory">{dashboard.territory}</span>,
          <VisibilityBadge key="visibility" visibility={dashboard.visibility} />,
          <StatusPill
            key="status"
            label={dashboard.status}
            tone={dashboard.status === "Activo" ? "success" : dashboard.status === "En actualización" ? "warning" : "danger"}
          />,
          <button key="actions" type="button" className="button-ghost">
            Editar
          </button>,
        ])}
        footer={<p className="text-sm text-[color:var(--muted-strong)]">Paginación</p>}
      />
    </AdminLayout>
  );
}
