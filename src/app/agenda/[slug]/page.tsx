import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import { notFound } from "next/navigation";
import { SiteLayout } from "@/components/mock/ui";
import { formatDateTimeRange, getEventBySlug } from "@/lib/content";
import { getViewerRole, type SearchParams, withRole } from "@/lib/viewer";

export default async function EventDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { slug } = await params;
  const qp = await searchParams;
  const role = getViewerRole(qp);
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  return (
    <SiteLayout
      role={role}
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "Agenda", href: "/agenda" },
        { label: event.title },
      ]}
    >
      <section className="bg-[#f8fbff] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-5 flex flex-wrap gap-2">
            <span className="rounded-full bg-[#e3f2fd] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#1565c0]">
              {event.category}
            </span>
            <span className="rounded-full bg-[#1a1a1a] px-4 py-1.5 text-xs font-semibold text-white">
              Agenda pública
            </span>
          </div>
          <h1 className="font-display text-4xl leading-tight text-[#1a1a1a] sm:text-5xl">
            {event.title}
          </h1>
          <p className="mt-5 text-lg leading-8 text-[#4a4540]">{event.summary}</p>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-4xl gap-8 lg:grid-cols-[0.75fr_1.25fr]">
          <aside className="surface-card h-fit">
            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7a756e]">
                  Fecha y hora
                </p>
                <p className="mt-2 inline-flex items-start gap-2 text-sm leading-6 text-[#1a1a1a]">
                  <CalendarDays className="mt-0.5 h-4 w-4 text-[#1565c0]" aria-hidden="true" />
                  {formatDateTimeRange(event.startsAt, event.endsAt)}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7a756e]">
                  Ubicación
                </p>
                <p className="mt-2 inline-flex items-start gap-2 text-sm leading-6 text-[#1a1a1a]">
                  <MapPin className="mt-0.5 h-4 w-4 text-[#1565c0]" aria-hidden="true" />
                  {event.location}
                </p>
              </div>

              {event.territory ? (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7a756e]">
                    Territorio
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#1a1a1a]">{event.territory}</p>
                </div>
              ) : null}

              {event.resourceUrl ? (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7a756e]">
                    Recurso relacionado
                  </p>
                  <a
                    href={event.resourceUrl}
                    className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-[#1565c0]"
                  >
                    {event.resourceLabel ?? "Abrir recurso"}
                  </a>
                </div>
              ) : null}
            </div>
          </aside>

          <article className="surface-card">
            <div className="prose prose-lg max-w-none">
              {event.description.split(/\n{2,}/).map((paragraph) => (
                <p key={paragraph} className="text-base leading-8 text-[#4a4540]">
                  {paragraph}
                </p>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-4xl flex-wrap gap-3">
          <Link href={withRole("/agenda", role)} className="button-secondary">
            ← Volver a agenda
          </Link>
          <Link href={withRole("/noticias", role)} className="button-ghost">
            Ir a noticias y eventos →
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
