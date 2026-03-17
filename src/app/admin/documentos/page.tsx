import Link from "next/link";
import { AdminLayout, TableCard, Toolbar, VisibilityBadge } from "@/components/mock/ui";
import { documents, librarySections, territories } from "@/lib/mock-data";
import { requireAdmin } from "@/lib/admin-access";
import { getFirstParam, type SearchParams, withRole } from "@/lib/viewer";

export default async function AdminDocumentosPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { role, searchParams: params } = await requireAdmin(searchParams);
  const query = (getFirstParam(params.q) ?? "").toLowerCase();
  const section = getFirstParam(params.section) ?? "";
  const visibility = getFirstParam(params.visibility) ?? "";
  const territory = getFirstParam(params.territory) ?? "";

  const filtered = documents.filter((document) => {
    const matchesQuery =
      !query || `${document.title} ${document.description}`.toLowerCase().includes(query);
    const matchesSection = !section || document.section === section;
    const matchesVisibility = !visibility || document.visibility === visibility;
    const matchesTerritory = !territory || document.territory === territory;

    return matchesQuery && matchesSection && matchesVisibility && matchesTerritory;
  });

  return (
    <AdminLayout
      role={role}
      active="documentos"
      title="Biblioteca Base — Documentos"
      intro="Listado total de documentos, incluidos registros Sensibles que nunca se publican en la interfaz web."
    >
      <Toolbar
        actions={
          <Link href={withRole("/admin/documentos/nuevo", role)} className="button-primary">
            + Nuevo doc
          </Link>
        }
      >
        <form action="/admin/documentos" className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <input type="hidden" name="role" value={role} />
          <input
            name="q"
            defaultValue={getFirstParam(params.q)}
            placeholder="Buscar"
            className="input-shell"
          />
          <select name="section" defaultValue={section} className="input-shell">
            <option value="">Sección</option>
            {librarySections.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select name="visibility" defaultValue={visibility} className="input-shell">
            <option value="">Visibilidad</option>
            <option value="public">Público</option>
            <option value="internal">Interno</option>
            <option value="sensitive">Sensible</option>
          </select>
          <select name="territory" defaultValue={territory} className="input-shell">
            <option value="">Territorio</option>
            {territories.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <button type="submit" className="button-secondary">
            Filtrar
          </button>
        </form>
      </Toolbar>

      <TableCard
        headers={["□", "Título", "Sección", "Territorio", "Año", "Visibilidad", "Última edición", "⋮"]}
        columnWidths={["w-10", "min-w-[220px]", "min-w-[120px]", "min-w-[100px]", "w-16", "min-w-[110px]", "min-w-[130px]", "w-20"]}
        rows={filtered.map((document) => [
          <input key="checkbox" type="checkbox" />,
          <Link key="title" href={withRole(`/admin/documentos/${document.id}/editar`, role)} className="font-medium text-[color:var(--forest)] underline">
            {document.title}
          </Link>,
          <span key="section" className="chip">
            {document.section}
          </span>,
          <span key="territory">{document.territory}</span>,
          <span key="year">{document.year}</span>,
          <VisibilityBadge key="visibility" visibility={document.visibility} />,
          <span key="edited">10 Mar 2026 · María Torres</span>,
          <button key="actions" type="button" className="button-ghost">
            Editar
          </button>,
        ])}
        footer={
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-[color:var(--muted-strong)]">Paginación: &lt; 1 2 3 &gt;</p>
            <div className="rounded-full bg-[color:var(--forest)] px-4 py-2 text-sm text-[color:var(--sand)]">
              3 documentos seleccionados · Cambiar visibilidad · Archivar
            </div>
          </div>
        }
      />
    </AdminLayout>
  );
}
