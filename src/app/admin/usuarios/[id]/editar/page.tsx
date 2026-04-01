import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminLayout } from "@/components/mock/ui";
import { requireAdmin } from "@/lib/admin-access";
import { hasSupabaseServiceConfig } from "@/lib/config";
import { createSupabaseService } from "@/lib/supabase/service";
import { getFirstParam, type SearchParams, withRole } from "@/lib/viewer";
import { updateUserAction } from "../../actions";

export default async function EditarUsuarioPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { id } = await params;
  const { role, searchParams: qs } = await requireAdmin(searchParams);
  const notice = getFirstParam(qs.notice);
  const error = getFirstParam(qs.error);

  if (!hasSupabaseServiceConfig()) {
    return (
      <AdminLayout
        role={role}
        active="usuarios"
        title="Editar usuario"
        intro="Se requiere configuración de Supabase service para gestionar cuentas reales."
      >
        <div className="rounded-2xl border border-[#f4c7c3] bg-[#fff5f4] px-4 py-3 text-sm text-[#8a1f17]">
          Falta configuración de Supabase en el servidor.
        </div>
        <Link href={withRole("/admin/usuarios", role)} className="button-ghost w-fit">
          Volver a usuarios
        </Link>
      </AdminLayout>
    );
  }

  const supabase = createSupabaseService();
  const { data: dbUser, error: userError } = await supabase
    .from("users")
    .select("id, email, role, active, organization, last_login_at")
    .eq("id", id)
    .maybeSingle();

  if (userError || !dbUser) {
    notFound();
  }

  const authUser = await supabase.auth.admin.getUserById(id);
  const metadata = authUser.data.user?.user_metadata ?? {};
  const name = String(metadata.name ?? dbUser.email.split("@")[0] ?? "Usuario");
  const mustChangePassword = Boolean(metadata.must_change_password ?? false);
  const formAction = updateUserAction.bind(null, id);

  return (
    <AdminLayout
      role={role}
      active="usuarios"
      title="Editar usuario"
      intro="Vista de edición con cambio de estado, rol y recuperación de contraseña."
    >
      {notice === "saved" ? (
        <div className="rounded-2xl border border-[#c6ebcf] bg-[#f3fff6] px-4 py-3 text-sm text-[#1f6a33]">
          Cambios guardados correctamente.
        </div>
      ) : null}
      {error ? (
        <div className="rounded-2xl border border-[#f4c7c3] bg-[#fff5f4] px-4 py-3 text-sm text-[#8a1f17]">
          {error === "missing-config"
            ? "Falta configuración de Supabase en el servidor."
            : decodeURIComponent(error)}
        </div>
      ) : null}

      <section className="surface-card grid gap-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-3xl text-[color:var(--forest)]">Actualizar cuenta</h2>
          <Link href={withRole("/admin/usuarios", role)} className="button-ghost">
            Volver
          </Link>
        </div>

        <form action={formAction} className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-2 text-sm">
            <span className="font-semibold text-[color:var(--forest)]">Nombre completo</span>
            <input name="name" required className="input-shell" defaultValue={name} />
          </label>
          <label className="grid gap-2 text-sm">
            <span className="font-semibold text-[color:var(--forest)]">Correo electrónico</span>
            <input name="email" type="email" required className="input-shell" defaultValue={dbUser.email} />
          </label>
          <label className="grid gap-2 text-sm">
            <span className="font-semibold text-[color:var(--forest)]">Rol</span>
            <select
              name="role"
              className="input-shell"
              defaultValue={dbUser.role === "admin" ? "Admin" : "Interno"}
            >
              <option value="Interno">Interno</option>
              <option value="Admin">Admin</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm">
            <span className="font-semibold text-[color:var(--forest)]">Organización</span>
            <input
              name="organization"
              className="input-shell"
              defaultValue={dbUser.organization ?? ""}
            />
          </label>
          <label className="grid gap-2 text-sm md:col-span-2">
            <span className="font-semibold text-[color:var(--forest)]">Nueva contraseña (opcional)</span>
            <input
              name="new_password"
              type="password"
              minLength={8}
              className="input-shell"
              placeholder="Dejar vacío para mantener la actual"
            />
          </label>

          <label className="inline-flex items-center gap-3 text-sm text-[color:var(--forest)] md:col-span-2">
            <input
              name="active"
              type="checkbox"
              defaultChecked={Boolean(dbUser.active)}
              className="h-4 w-4 rounded border-[#d1ccc5]"
            />
            Cuenta activa
          </label>
          <label className="inline-flex items-center gap-3 text-sm text-[color:var(--forest)] md:col-span-2">
            <input
              name="must_change_password"
              type="checkbox"
              defaultChecked={mustChangePassword}
              className="h-4 w-4 rounded border-[#d1ccc5]"
            />
            Forzar cambio de contraseña en el próximo ingreso
          </label>

          <p className="text-xs text-[color:var(--muted)] md:col-span-2">
            Último acceso:{" "}
            {dbUser.last_login_at
              ? new Date(dbUser.last_login_at).toLocaleString("es-CO")
              : "sin registros"}
          </p>

          <div className="md:col-span-2 flex justify-end gap-3">
            <Link href={withRole("/admin/usuarios", role)} className="button-ghost">
              Cancelar
            </Link>
            <button type="submit" className="button-primary">
              Guardar cambios
            </button>
          </div>
        </form>
      </section>
    </AdminLayout>
  );
}

