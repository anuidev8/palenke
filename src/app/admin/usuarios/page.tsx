import Link from "next/link";
import { TriangleAlert } from "lucide-react";
import { AdminLayout, StatusPill, TableCard, Toolbar } from "@/components/mock/ui";
import { formatLastLogin, organizations, users, USER_LIMIT } from "@/lib/mock-data";
import { requireAdmin } from "@/lib/admin-access";
import { getFirstParam, type SearchParams, withRole } from "@/lib/viewer";

export default async function AdminUsuariosPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { role, searchParams: params } = await requireAdmin(searchParams);
  const query = (getFirstParam(params.q) ?? "").toLowerCase();
  const selectedRole = getFirstParam(params.userRole) ?? "";
  const selectedOrg = getFirstParam(params.org) ?? "";

  const filtered = users.filter((user) => {
    const matchesQuery = !query || `${user.name} ${user.email}`.toLowerCase().includes(query);
    const matchesRole = !selectedRole || user.role === selectedRole;
    const matchesOrg = !selectedOrg || user.organization === selectedOrg;
    return matchesQuery && matchesRole && matchesOrg;
  });

  const atLimit = users.length >= USER_LIMIT;
  const countLabel = `${users.length} / ${USER_LIMIT} cuentas`;

  return (
    <AdminLayout
      role={role}
      active="usuarios"
      title="Gestión de usuarios"
      intro="Las cuentas son cerradas, no existe registro público. El MVP soporta un máximo de 15 usuarios."
    >
      <Toolbar
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${
              atLimit
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-[color:var(--border-strong)] bg-[color:var(--sand-strong)] text-[color:var(--muted-strong)]"
            }`}>
              {countLabel}
            </span>
            {atLimit ? null : (
              <Link href={withRole("/admin/usuarios/nuevo", role)} className="button-primary">
                + Nuevo usuario
              </Link>
            )}
          </div>
        }
      >
        <form action="/admin/usuarios" className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <input type="hidden" name="role" value={role} />
          <input
            name="q"
            defaultValue={getFirstParam(params.q)}
            placeholder="Buscar nombre/correo"
            className="input-shell"
          />
          <select name="userRole" defaultValue={selectedRole} className="input-shell">
            <option value="">Rol</option>
            <option value="Admin">Admin</option>
            <option value="Interno">Interno</option>
          </select>
          <select name="org" defaultValue={selectedOrg} className="input-shell">
            <option value="">Organización</option>
            {organizations.map((org) => (
              <option key={org} value={org}>{org}</option>
            ))}
          </select>
          <button type="submit" className="button-secondary">
            Filtrar
          </button>
        </form>
      </Toolbar>

      <TableCard
        headers={["Nombre", "Organización", "Rol", "Último acceso", "Estado", "⋮"]}
        rows={filtered.map((user) => [
          <div key="name" className="flex flex-col gap-0.5">
            <Link
              href={withRole(`/admin/usuarios/${user.id}/editar`, role)}
              className="font-medium text-[color:var(--forest)] underline"
            >
              {user.name}
            </Link>
            <span className="text-xs text-[color:var(--muted)]">{user.email}</span>
            {user.mustChangePassword ? (
              <span className="mt-1 inline-flex w-fit items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 ring-1 ring-amber-200">
                <TriangleAlert className="h-3 w-3" aria-hidden="true" />
                <span>Cambio de contraseña pendiente</span>
              </span>
            ) : null}
          </div>,
          <span key="org" className="text-sm text-[color:var(--muted-strong)]">{user.organization}</span>,
          <span key="role" className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
            user.role === "Admin"
              ? "bg-[color:var(--forest)] text-[color:var(--sand)]"
              : "bg-[color:var(--sand-strong)] text-[color:var(--forest)]"
          }`}>{user.role}</span>,
          <span key="login" className="text-sm text-[color:var(--muted-strong)]">
            {formatLastLogin(user.lastLoginAt)}
          </span>,
          <StatusPill key="status" label={user.active ? "Activa" : "Desactivada"} tone={user.active ? "success" : "danger"} />,
          <Link key="edit" href={withRole(`/admin/usuarios/${user.id}/editar`, role)} className="button-ghost">
            Editar
          </Link>,
        ])}
      />
    </AdminLayout>
  );
}
