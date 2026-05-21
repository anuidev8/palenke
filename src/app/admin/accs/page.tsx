import Link from "next/link";
import { AdminLayout } from "@/components/mock/AdminLayout";
import { TableCard, Toolbar, VisibilityBadge } from "@/components/mock/ui";
import { accs } from "@/lib/mock-data";
import { requireAdmin } from "@/lib/admin-access";
import { getFirstParam, type SearchParams, withRole } from "@/lib/viewer";

export default async function AdminAccsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { role, searchParams: params } = await requireAdmin(searchParams);
  const query = (getFirstParam(params.q) ?? "").toLowerCase();
  const territory = (getFirstParam(params.territory) ?? "").toLowerCase();

  const filtered = accs.filter((acc) => {
    const matchesQuery = !query || `${acc.name} ${acc.council}`.toLowerCase().includes(query);
    const matchesTerritory =
      !territory ||
      `${acc.basin} ${acc.municipalities} ${acc.departments}`.toLowerCase().includes(territory);

    return matchesQuery && matchesTerritory;
  });

  return (
    <AdminLayout
      role={role}
      active="accs"
      title="Áreas de Conservación Comunitaria (ACCs)"
      intro="El MVP incluye 2–3 ACCs priorizadas y solo almacena metadatos, nunca datos geográficos sensibles."
    >
      <Toolbar
        actions={
          <Link href={withRole("/admin/accs/nuevo", role)} className="button-primary">
            + Nueva ACC
          </Link>
        }
      >
        <form action="/admin/accs" className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <input name="q" defaultValue={getFirstParam(params.q)} placeholder="Buscar" className="input-shell" />
          <input
            name="territory"
            defaultValue={getFirstParam(params.territory)}
            placeholder="Filtro territorio"
            className="input-shell"
          />
          <button type="submit" className="button-secondary">
            Filtrar
          </button>
        </form>
      </Toolbar>

      <TableCard
        headers={["Nombre", "Consejo", "Visibilidad", "Geoportal", "⋮"]}
        rows={filtered.map((acc) => [
          <Link key="name" href={withRole(`/admin/accs/${acc.id}/editar`, role)} className="font-medium text-[color:var(--forest)] underline">
            {acc.name}
          </Link>,
          <span key="council">{acc.council}</span>,
          <VisibilityBadge key="visibility" visibility={acc.visibility} />,
          <span key="geoportal">{acc.inGeoportal ? "Sí" : "No"}</span>,
          <button key="actions" type="button" className="button-ghost">
            Editar
          </button>,
        ])}
      />
    </AdminLayout>
  );
}
