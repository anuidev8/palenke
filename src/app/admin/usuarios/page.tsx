import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { TriangleAlert } from "lucide-react";
import { AdminLayout, Callout, StatusPill, TableCard, Toolbar } from "@/components/mock/ui";
import { formatLastLogin, organizations, users, USER_LIMIT } from "@/lib/mock-data";
import { requireAdmin } from "@/lib/admin-access";
import { getFirstParam, type SearchParams, withRole } from "@/lib/viewer";
import { createSupabaseService } from "@/lib/supabase/service";
import { hasSupabaseServiceConfig } from "@/lib/config";
import { deleteUserAction } from "./actions";

type AdminUserRow = {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Interno";
  organization: string;
  active: boolean;
  mustChangePassword: boolean;
  lastLoginAt: string | null;
};

function getFallbackName(email: string) {
  const localPart = email.split("@")[0] ?? "Usuario";
  return localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((token) => token.charAt(0).toUpperCase() + token.slice(1))
    .join(" ");
}

export default async function AdminUsuariosPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  noStore();
  const { role, searchParams: params } = await requireAdmin(searchParams);
  const query = (getFirstParam(params.q) ?? "").toLowerCase();
  const selectedRole = getFirstParam(params.userRole) ?? "";
  const selectedOrg = getFirstParam(params.org) ?? "";
  const notice = getFirstParam(params.notice);
  const error = getFirstParam(params.error);

  let usersData: AdminUserRow[] = [];
  let dbError = false;
  let usingMockData = false;

  if (hasSupabaseServiceConfig()) {
    try {
      const supabase = createSupabaseService();
      const { data, error: dbUsersError } = await supabase
        .from("users")
        .select("id, email, role, active, organization, last_login_at")
        .order("created_at", { ascending: false });

      if (dbUsersError) {
        dbError = true;
      } else {
        usersData = (data ?? [])
          .filter((item) => item.role === "admin" || item.role === "internal")
          .map((item) => ({
            id: item.id,
            email: item.email ?? "",
            name: getFallbackName(item.email ?? "usuario"),
            role: item.role === "admin" ? "Admin" : "Interno",
            organization: item.organization ?? "Sin organización",
            active: Boolean(item.active),
            // Placeholder until this flag is persisted in DB.
            mustChangePassword: false,
            lastLoginAt: item.last_login_at ?? null,
          }));
      }
    } catch {
      dbError = true;
    }
  } else {
    usingMockData = true;
    usersData = users as unknown as AdminUserRow[];
  }

  const filtered = usersData.filter((user) => {
    const matchesQuery = !query || `${user.name} ${user.email}`.toLowerCase().includes(query);
    const matchesRole = !selectedRole || user.role === selectedRole;
    const matchesOrg = !selectedOrg || user.organization === selectedOrg;
    return matchesQuery && matchesRole && matchesOrg;
  });

  const atLimit = usersData.length >= USER_LIMIT;
  const countLabel = `${usersData.length} / ${USER_LIMIT} cuentas`;
  const organizationOptions = usingMockData
    ? organizations
    : [...new Set(usersData.map((user) => user.organization))].filter(Boolean).sort();

  return (
    <AdminLayout
      role={role}
      active="usuarios"
      title="Gestión de usuarios"
      intro="Las cuentas son cerradas, no existe registro público. El MVP soporta un máximo de 15 usuarios."
    >
      {notice === "created" ? (
        <Callout tone="success" title="Usuario creado">
          <p>La cuenta se creó correctamente.</p>
        </Callout>
      ) : null}

      {notice === "deleted" ? (
        <Callout tone="success" title="Usuario eliminado">
          <p>La cuenta fue eliminada correctamente.</p>
        </Callout>
      ) : null}

      {error ? (
        <Callout tone="danger" title="No se pudo completar la acción">
          <p>{error === "missing-config" ? "Falta configuración de Supabase en el servidor." : decodeURIComponent(error)}</p>
        </Callout>
      ) : null}

      {usingMockData ? (
        <Callout tone="warning" title="Modo maqueta">
          <p>No se detectó configuración de servicio para Supabase. La tabla muestra datos de ejemplo.</p>
        </Callout>
      ) : null}

      {dbError ? (
        <Callout tone="danger" title="Error de conexión">
          <p>No se pudieron cargar usuarios desde Supabase.</p>
        </Callout>
      ) : null}

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
            {organizationOptions.map((org) => (
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
            {formatLastLogin(user.lastLoginAt ?? undefined)}
          </span>,
          <StatusPill key="status" label={user.active ? "Activa" : "Desactivada"} tone={user.active ? "success" : "danger"} />,
          <div key="actions" className="flex flex-wrap gap-2">
            <Link href={withRole(`/admin/usuarios/${user.id}/editar`, role)} className="button-ghost">
              Editar
            </Link>
            <form action={deleteUserAction.bind(null, user.id)}>
              <button type="submit" className="button-ghost text-[#d32f2f]">
                Eliminar
              </button>
            </form>
          </div>,
        ])}
      />
    </AdminLayout>
  );
}
