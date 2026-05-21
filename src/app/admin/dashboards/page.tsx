import Link from "next/link";
import { AdminLayout } from "@/components/mock/AdminLayout";
import { Callout, StatusPill, TableCard, Toolbar, VisibilityBadge } from "@/components/mock/ui";
import { requireAdmin } from "@/lib/admin-access";
import { hasSupabaseServiceConfig } from "@/lib/config";
import { listAllScitaDashboardsAdmin, type ScitaDashboardRecord } from "@/lib/scita-dashboards";
import { getFirstParam, type SearchParams, withRole } from "@/lib/viewer";

export default async function AdminDashboardsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { role, searchParams: params } = await requireAdmin(searchParams);
  const query = (getFirstParam(params.q) ?? "").toLowerCase();
  const visibility = getFirstParam(params.visibility) ?? "";
  const moduleKey = getFirstParam(params.module) ?? "";

  let dashboards: ScitaDashboardRecord[] = [];
  let loadError: string | null = null;

  try {
    dashboards = await listAllScitaDashboardsAdmin();
  } catch (error) {
    loadError = error instanceof Error ? error.message : "No se pudieron cargar los tableros.";
  }

  const filtered = dashboards.filter((dashboard) => {
    const matchesQuery =
      !query ||
      `${dashboard.title} ${dashboard.shortLabel} ${dashboard.moduleKey}`
        .toLowerCase()
        .includes(query);
    const matchesVisibility = !visibility || dashboard.visibility === visibility;
    const matchesModule = !moduleKey || dashboard.moduleKey === moduleKey;
    return matchesQuery && matchesVisibility && matchesModule;
  });

  return (
    <AdminLayout
      role={role}
      active="dashboards"
      title="SCITA — Tableros Power BI"
      intro="Gestión de tableros embebidos en /scita: URLs públicas (P_) e internas (I_) visibles solo para usuarios internos o admin."
    >
      {!hasSupabaseServiceConfig() ? (
        <Callout tone="warning" title="Sin persistencia">
          <p>
            Configura Supabase service en el servidor para guardar tableros. Mientras tanto se usa el catálogo
            local de respaldo.
          </p>
        </Callout>
      ) : null}

      {loadError ? (
        <Callout tone="danger" title="Error al cargar">
          <p>{loadError}</p>
        </Callout>
      ) : null}

      <Toolbar
        actions={
          <Link href={withRole("/admin/dashboards/nuevo", role)} className="button-primary">
            + Nuevo tablero SCITA
          </Link>
        }
      >
        <form
          action="/admin/dashboards"
          className="grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)_auto]"
        >
          <input name="q" defaultValue={getFirstParam(params.q)} placeholder="Buscar" className="input-shell" />
          <select name="module" defaultValue={moduleKey} className="input-shell">
            <option value="">Módulo</option>
            <option value="gobierno">Gobierno propio</option>
            <option value="conservacion">Conservación</option>
            <option value="titulacion">Titulación</option>
          </select>
          <select name="visibility" defaultValue={visibility} className="input-shell">
            <option value="">Visibilidad</option>
            <option value="public">Público</option>
            <option value="internal">Interno</option>
          </select>
          <button type="submit" className="button-secondary w-full sm:w-auto">
            Filtrar
          </button>
        </form>
      </Toolbar>

      <TableCard
        headers={["Título", "Módulo", "Visibilidad", "Estado", "Orden", ""]}
        columnWidths={[
          "min-w-[180px]",
          "w-[140px]",
          "w-[150px]",
          "w-[110px]",
          "w-[72px]",
          "w-[100px]",
        ]}
        columnAlign={["left", "left", "center", "center", "center", "right"]}
        rows={filtered.map((dashboard) => [
          <Link
            key="title"
            href={withRole(`/admin/dashboards/${dashboard.id}/editar`, role)}
            className="font-medium text-[color:var(--forest)] underline decoration-[color:var(--gold-500)] underline-offset-2"
          >
            {dashboard.shortLabel}
          </Link>,
          <span key="module" className="capitalize text-[color:var(--forest)]">
            {dashboard.moduleKey}
          </span>,
          <div key="visibility" className="flex justify-center">
            <VisibilityBadge visibility={dashboard.visibility} />
          </div>,
          <div key="status" className="flex justify-center">
            <StatusPill
              label={dashboard.status}
              tone={
                dashboard.status === "active"
                  ? "success"
                  : dashboard.status === "draft"
                    ? "warning"
                    : "danger"
              }
            />
          </div>,
          <span key="sort" className="tabular-nums text-[color:var(--forest)]">
            {dashboard.sortOrder}
          </span>,
          <div key="actions" className="flex justify-end">
            <Link
              href={withRole(`/admin/dashboards/${dashboard.id}/editar`, role)}
              className="button-ghost"
            >
              Editar
            </Link>
          </div>,
        ])}
        footer={
          <p className="text-sm text-[color:var(--muted-strong)]">
            {filtered.length} tablero{filtered.length === 1 ? "" : "s"} · Los internos requieren sesión con rol
            interno o admin en /scita
          </p>
        }
      />
    </AdminLayout>
  );
}
