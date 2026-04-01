import Link from "next/link";
import { AdminLayout } from "@/components/mock/ui";
import { requireAdmin } from "@/lib/admin-access";
import { getFirstParam, type SearchParams, withRole } from "@/lib/viewer";
import { createUserAction } from "../actions";

export default async function NuevoUsuarioPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { role, searchParams: qs } = await requireAdmin(searchParams);
  const error = getFirstParam(qs.error);

  return (
    <AdminLayout
      role={role}
      active="usuarios"
      title="Nuevo usuario"
      intro="Formulario de creación de cuentas cerradas para usuarios Internos o Admin, con contraseña temporal."
    >
      {error ? (
        <div className="rounded-2xl border border-[#f4c7c3] bg-[#fff5f4] px-4 py-3 text-sm text-[#8a1f17]">
          {error === "missing-config"
            ? "Falta configuración de Supabase en el servidor."
            : decodeURIComponent(error)}
        </div>
      ) : null}

      <section className="surface-card grid gap-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-3xl text-[color:var(--forest)]">Crear cuenta</h2>
          <Link href={withRole("/admin/usuarios", role)} className="button-ghost">
            Volver
          </Link>
        </div>

        <form action={createUserAction} className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-2 text-sm">
            <span className="font-semibold text-[color:var(--forest)]">Nombre completo</span>
            <input name="name" required className="input-shell" />
          </label>
          <label className="grid gap-2 text-sm">
            <span className="font-semibold text-[color:var(--forest)]">Correo electrónico</span>
            <input name="email" type="email" required className="input-shell" />
          </label>
          <label className="grid gap-2 text-sm">
            <span className="font-semibold text-[color:var(--forest)]">Rol</span>
            <select name="role" className="input-shell" defaultValue="Interno">
              <option value="Interno">Interno</option>
              <option value="Admin">Admin</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm">
            <span className="font-semibold text-[color:var(--forest)]">Organización</span>
            <input name="organization" className="input-shell" />
          </label>
          <label className="grid gap-2 text-sm md:col-span-2">
            <span className="font-semibold text-[color:var(--forest)]">Contraseña temporal</span>
            <input
              name="password"
              type="password"
              required
              minLength={8}
              className="input-shell"
              placeholder="Mínimo 8 caracteres"
            />
          </label>

          <label className="inline-flex items-center gap-3 text-sm text-[color:var(--forest)] md:col-span-2">
            <input name="active" type="checkbox" defaultChecked className="h-4 w-4 rounded border-[#d1ccc5]" />
            Cuenta activa
          </label>
          <label className="inline-flex items-center gap-3 text-sm text-[color:var(--forest)] md:col-span-2">
            <input
              name="must_change_password"
              type="checkbox"
              defaultChecked
              className="h-4 w-4 rounded border-[#d1ccc5]"
            />
            Forzar cambio de contraseña en el próximo ingreso
          </label>

          <div className="md:col-span-2 flex justify-end gap-3">
            <Link href={withRole("/admin/usuarios", role)} className="button-ghost">
              Cancelar
            </Link>
            <button type="submit" className="button-primary">
              Crear usuario
            </button>
          </div>
        </form>
      </section>
    </AdminLayout>
  );
}

