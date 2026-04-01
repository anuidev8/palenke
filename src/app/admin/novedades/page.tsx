import Link from "next/link";
import { CalendarDays, Newspaper, Radio } from "lucide-react";
import { AdminLayout } from "@/components/mock/ui";
import { requireAdmin } from "@/lib/admin-access";
import { listEvents, listInternalNews } from "@/lib/content";
import type { SearchParams } from "@/lib/viewer";
import { withRole } from "@/lib/viewer";

export default async function AdminNovedadesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { role } = await requireAdmin(searchParams);
  const [newsItems, events] = await Promise.all([
    listInternalNews({ includeInternal: true }),
    listEvents({ includeInternal: true }),
  ]);

  return (
    <AdminLayout
      role={role}
      active="novedades"
      title="Noticias y agenda"
      intro="Gestiona el bloque interno de Lo Último y la agenda pública de eventos. Entérate se alimenta automáticamente desde Renacientes / PCN."
    >
      <div className="grid gap-6 md:grid-cols-2">
        <article className="surface-card space-y-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#d8f3dc] text-[#2e7d32]">
              <Newspaper className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">
                Interno
              </p>
              <h2 className="font-display text-3xl text-[color:var(--forest)]">Lo Último</h2>
            </div>
          </div>
          <p className="text-sm leading-6 text-[color:var(--muted-strong)]">
            Noticias administradas desde el panel y publicadas en la home e incidencia.
          </p>
          <p className="text-4xl font-black text-[color:var(--forest)]">{newsItems.length}</p>
          <div className="flex flex-wrap gap-3">
            <Link href={withRole("/admin/novedades/noticias", role)} className="button-primary">
              Gestionar noticias
            </Link>
          </div>
        </article>

        <article className="surface-card space-y-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e3f2fd] text-[#1565c0]">
              <CalendarDays className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">
                Agenda
              </p>
              <h2 className="font-display text-3xl text-[color:var(--forest)]">Eventos</h2>
            </div>
          </div>
          <p className="text-sm leading-6 text-[color:var(--muted-strong)]">
            Eventos visibles en la home, la agenda completa y las fichas de detalle.
          </p>
          <p className="text-4xl font-black text-[color:var(--forest)]">{events.length}</p>
          <div className="flex flex-wrap gap-3">
            <Link href={withRole("/admin/novedades/eventos", role)} className="button-primary">
              Gestionar eventos
            </Link>
          </div>
        </article>
      </div>

      <section className="surface-card">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="eyebrow mb-2">Fuente externa</p>
            <h2 className="font-display text-3xl text-[color:var(--forest)]">Entérate</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[color:var(--muted-strong)]">
              El bloque Entérate consume automáticamente la categoría <code>Comunicados</code> de Renacientes
              usando la API pública de WordPress y se revalida periódicamente sin gestión manual.
            </p>
          </div>
          <a
            href="https://renacientes.net/category/comunicados/"
            target="_blank"
            rel="noopener noreferrer"
            className="button-secondary"
          >
            <Radio className="h-4 w-4" aria-hidden="true" />
            Ver fuente
          </a>
        </div>
      </section>
    </AdminLayout>
  );
}
