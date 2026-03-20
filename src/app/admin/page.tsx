import Link from "next/link";
import { FileText, Key, RefreshCw, UserPlus, UserX, type LucideIcon } from "lucide-react";
import { AdminLayout, MetricCard } from "@/components/mock/ui";
import { adminQuickStats, recentActivity } from "@/lib/mock-data";
import { requireAdmin } from "@/lib/admin-access";
import type { SearchParams } from "@/lib/viewer";
import { withRole } from "@/lib/viewer";

export default async function AdminHomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { role } = await requireAdmin(searchParams);

  return (
    <AdminLayout
      role={role}
      active="inicio"
      title="Panel de gestión"
      intro="Vista general del estado del sistema y accesos directos a Biblioteca, Dashboards, ACCs, Usuarios, Campañas y contenido visual IA."
    >
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {adminQuickStats.map((stat) => (
          <MetricCard key={stat.label} label={stat.label} value={stat.value} />
        ))}
      </div>

      <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <article className="surface-card space-y-4">
          <h2 className="font-display text-3xl text-[color:var(--forest)]">Accesos directos</h2>
          <div className="grid gap-3">
            <Link href={withRole("/admin/documentos/nuevo", role)} className="button-secondary">
              + Nuevo documento
            </Link>
            <Link href={withRole("/admin/dashboards/nuevo", role)} className="button-secondary">
              + Nuevo dashboard
            </Link>
            <Link href={withRole("/admin/accs/nuevo", role)} className="button-secondary">
              + Nueva ACC
            </Link>
            <Link href={withRole("/admin/campanas/nueva", role)} className="button-secondary">
              + Nueva campaña
            </Link>
            <Link href={withRole("/admin/contenido-visual", role)} className="button-secondary">
              + Generar contenido visual
            </Link>
          </div>
        </article>

        <article className="surface-card space-y-4">
          <h2 className="font-display text-3xl text-[color:var(--forest)]">Actividad reciente</h2>
          <div className="grid gap-3">
            {recentActivity.map((activity) => {
              const kindMeta: Record<string, { Icon: LucideIcon; color: string }> = {
                content: { Icon: FileText, color: "text-[color:var(--forest)]" },
                user_created: { Icon: UserPlus, color: "text-emerald-700" },
                user_deactivated: { Icon: UserX, color: "text-red-600" },
                user_role_changed: { Icon: RefreshCw, color: "text-amber-700" },
                password_reset: { Icon: Key, color: "text-sky-700" },
              };
              const meta = kindMeta[activity.kind ?? "content"] ?? kindMeta.content;
              return (
                <div key={activity.id} className="rounded-[22px] border border-[color:var(--border-soft)] bg-white px-4 py-4">
                  <div className="flex items-start gap-3">
                    <meta.Icon className={`mt-0.5 h-4 w-4 ${meta.color}`} aria-hidden="true" />
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-semibold ${meta.color}`}>{activity.title}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">{activity.section}</p>
                      <p className="mt-2 text-sm text-[color:var(--muted-strong)]">
                        {activity.editedBy} · {activity.editedAt}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </article>
      </section>
    </AdminLayout>
  );
}
