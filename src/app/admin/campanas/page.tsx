import Link from "next/link";
import { Globe, Lock } from "lucide-react";
import { AdminLayout, StatusPill, TableCard } from "@/components/mock/ui";
import { campaigns } from "@/lib/mock-data";
import { requireAdmin } from "@/lib/admin-access";
import type { SearchParams } from "@/lib/viewer";
import { withRole } from "@/lib/viewer";

export default async function AdminCampanasPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { role } = await requireAdmin(searchParams);

  return (
    <AdminLayout
      role={role}
      active="campanas"
      title="Campañas y contenidos destacados"
      intro="Panel para activar o desactivar campañas que aparecen en Home y/o en la página Mujeres, Juventudes y Niñez."
    >
      <div className="flex justify-end">
        <Link href={withRole("/admin/campanas/nueva", role)} className="button-primary">
          + Nueva campaña
        </Link>
      </div>

      <TableCard
        headers={["Campaña", "Visibilidad", "Ubicación", "Estado", "⋮"]}
        rows={campaigns.map((campaign) => [
          <Link key="title" href={withRole(`/admin/campanas/${campaign.id}/editar`, role)} className="font-medium text-[color:var(--forest)] underline">
            {campaign.title}
          </Link>,
          <span key="visibility" className="inline-flex items-center gap-1.5">
            {campaign.visibility === "public" ? (
              <>
                <Globe className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Pública</span>
              </>
            ) : (
              <>
                <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Interna</span>
              </>
            )}
          </span>,
          <span key="placement">{campaign.placements.join(", ")}</span>,
          <StatusPill key="status" label={campaign.active ? "Activa" : "Inactiva"} tone={campaign.active ? "success" : "neutral"} />,
          <button key="actions" type="button" className="button-ghost">
            Editar
          </button>,
        ])}
      />
    </AdminLayout>
  );
}
