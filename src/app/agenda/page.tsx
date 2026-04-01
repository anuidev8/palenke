import Link from "next/link";
import { CalendarDays, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { SiteLayout } from "@/components/mock/ui";
import {
  formatDateTimeRange,
  formatMonthKey,
  getEventCategories,
  getEventLocations,
  getEventMonths,
  listEvents,
} from "@/lib/content";
import { getViewerRoleFromRequest } from "@/lib/viewer-server";
import { getFirstParam, type SearchParams, withRole } from "@/lib/viewer";

type AgendaView = "month" | "week";

function monthKeyFromDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function startOfMonth(monthKey: string) {
  const [year, month] = monthKey.split("-").map(Number);
  return new Date(year, month - 1, 1);
}

function addMonths(monthKey: string, delta: number) {
  const date = startOfMonth(monthKey);
  date.setMonth(date.getMonth() + delta);
  return monthKeyFromDate(date);
}

function toDateKey(value: string) {
  const date = new Date(value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function startOfWeek(date: Date) {
  const clone = new Date(date);
  const day = clone.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  clone.setDate(clone.getDate() + diff);
  clone.setHours(0, 0, 0, 0);
  return clone;
}

function renderMonthDays(monthKey: string) {
  const monthStart = startOfMonth(monthKey);
  const gridStart = startOfWeek(monthStart);
  return Array.from({ length: 35 }).map((_, index) => {
    const day = new Date(gridStart);
    day.setDate(gridStart.getDate() + index);
    return day;
  });
}

export default async function AgendaPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const role = await getViewerRoleFromRequest(params);
  const view = (getFirstParam(params.view) === "week" ? "week" : "month") as AgendaView;
  const q = getFirstParam(params.q) ?? "";
  const category = getFirstParam(params.category) ?? "";
  const location = getFirstParam(params.location) ?? "";
  const allEvents = await listEvents();
  const months = getEventMonths(allEvents);
  const selectedMonth = getFirstParam(params.month) ?? months[0] ?? monthKeyFromDate(new Date());
  const baseDate = startOfMonth(selectedMonth);
  const selectedWeek = getFirstParam(params.week) ?? toDateKey(startOfWeek(baseDate).toISOString());

  const filteredEvents = allEvents.filter((event) => {
    const matchesQuery =
      !q ||
      `${event.title} ${event.summary} ${event.description}`.toLowerCase().includes(q.toLowerCase());
    const matchesCategory = !category || event.category === category;
    const matchesLocation = !location || event.location === location;
    const matchesMonth = !selectedMonth || monthKeyFromDate(new Date(event.startsAt)) === selectedMonth;
    return matchesQuery && matchesCategory && matchesLocation && matchesMonth;
  });

  const byDate = new Map<string, typeof filteredEvents>();
  filteredEvents.forEach((event) => {
    const key = toDateKey(event.startsAt);
    byDate.set(key, [...(byDate.get(key) ?? []), event]);
  });

  const monthDays = renderMonthDays(selectedMonth);
  const weekStartDate = new Date(selectedWeek);
  const weekDays = Array.from({ length: 7 }).map((_, index) => {
    const day = new Date(weekStartDate);
    day.setDate(weekStartDate.getDate() + index);
    return day;
  });

  const categories = getEventCategories(allEvents);
  const locations = getEventLocations(allEvents);

  return (
    <SiteLayout
      role={role}
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "Agenda y eventos" },
      ]}
    >
      <section className="bg-[#0d1a2a] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[1.5px] text-[#90caf9]">
            Territorio y ambiente
          </p>
          <h1 className="font-display text-4xl text-white sm:text-5xl">Agenda y eventos</h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-white/70">
            Consulta el calendario mensual o semanal, revisa la agenda completa y filtra por
            categoría, fecha o ubicación.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <form action="/agenda" className="surface-card mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <input type="hidden" name="view" value={view} />

          <label className="grid gap-2 text-sm">
            <span className="font-semibold text-[color:var(--forest)]">Buscar</span>
            <input name="q" defaultValue={q} className="input-shell" placeholder="Título o palabra clave" />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="font-semibold text-[color:var(--forest)]">Mes</span>
            <select name="month" defaultValue={selectedMonth} className="input-shell">
              {months.map((month) => (
                <option key={month} value={month}>
                  {formatMonthKey(month)}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm">
            <span className="font-semibold text-[color:var(--forest)]">Categoría</span>
            <select name="category" defaultValue={category} className="input-shell">
              <option value="">Todas</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm">
            <span className="font-semibold text-[color:var(--forest)]">Ubicación</span>
            <select name="location" defaultValue={location} className="input-shell">
              <option value="">Todas</option>
              {locations.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <div className="flex items-end">
            <button type="submit" className="button-primary w-full">
              Aplicar filtros
            </button>
          </div>
        </form>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex rounded-full border border-[#d1ccc5] bg-white p-1">
            <Link
              href={withRole("/agenda", role, { month: selectedMonth, category, location, q, view: "month" })}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${view === "month" ? "bg-[#1565c0] text-white" : "text-[#4a4540]"}`}
            >
              Vista mensual
            </Link>
            <Link
              href={withRole("/agenda", role, { month: selectedMonth, category, location, q, view: "week", week: selectedWeek })}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${view === "week" ? "bg-[#1565c0] text-white" : "text-[#4a4540]"}`}
            >
              Vista semanal
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={withRole("/agenda", role, { month: addMonths(selectedMonth, -1), category, location, q, view })}
              className="button-secondary"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </Link>
            <p className="font-display text-2xl text-[#1a1a1a]">{formatMonthKey(selectedMonth)}</p>
            <Link
              href={withRole("/agenda", role, { month: addMonths(selectedMonth, 1), category, location, q, view })}
              className="button-secondary"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {view === "month" ? (
          <div className="surface-card overflow-hidden">
            <div className="grid grid-cols-7 border-b border-[color:var(--border-soft)]">
              {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((label) => (
                <div key={label} className="px-3 py-3 text-sm font-semibold text-[#7a756e]">
                  {label}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {monthDays.map((day) => {
                const dateKey = toDateKey(day.toISOString());
                const items = byDate.get(dateKey) ?? [];
                const isCurrentMonth = monthKeyFromDate(day) === selectedMonth;

                return (
                  <div
                    key={dateKey}
                    className={`min-h-[150px] border-b border-r border-[color:var(--border-soft)] p-3 ${isCurrentMonth ? "bg-white" : "bg-[#f8f5f2]"}`}
                  >
                    <p className={`text-sm font-semibold ${isCurrentMonth ? "text-[#1a1a1a]" : "text-[#b7b1aa]"}`}>
                      {day.getDate()}
                    </p>
                    <div className="mt-3 grid gap-2">
                      {items.slice(0, 2).map((event) => (
                        <Link
                          key={event.id}
                          href={withRole(`/agenda/${event.slug}`, role)}
                          className="rounded-2xl bg-[#e3f2fd] px-3 py-2 text-xs font-medium text-[#1565c0]"
                        >
                          {event.title}
                        </Link>
                      ))}
                      {items.length > 2 ? (
                        <p className="text-xs text-[#7a756e]">+{items.length - 2} más</p>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {weekDays.map((day) => {
              const dateKey = toDateKey(day.toISOString());
              const items = byDate.get(dateKey) ?? [];
              return (
                <article key={dateKey} className="surface-card">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-display text-2xl text-[#1a1a1a]">
                      {new Intl.DateTimeFormat("es-CO", { weekday: "long", day: "2-digit", month: "short" }).format(day)}
                    </p>
                    <CalendarDays className="h-5 w-5 text-[#1565c0]" aria-hidden="true" />
                  </div>
                  <div className="mt-5 grid gap-3">
                    {items.length ? (
                      items.map((event) => (
                        <Link
                          key={event.id}
                          href={withRole(`/agenda/${event.slug}`, role)}
                          className="rounded-[20px] border border-[#e3f2fd] bg-[#f8fbff] p-4 transition hover:border-[#1565c0]"
                        >
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1565c0]">
                            {event.category}
                          </p>
                          <h3 className="mt-2 font-display text-xl text-[#1a1a1a]">{event.title}</h3>
                          <p className="mt-2 text-sm text-[#4a4540]">{formatDateTimeRange(event.startsAt, event.endsAt)}</p>
                        </Link>
                      ))
                    ) : (
                      <p className="text-sm text-[#7a756e]">Sin eventos registrados.</p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="eyebrow mb-2">Listado</p>
            <h2 className="font-display text-3xl text-[#1a1a1a]">Todos los eventos</h2>
          </div>
          <p className="text-sm text-[#7a756e]">{filteredEvents.length} resultado(s)</p>
        </div>

        <div className="grid gap-4">
          {filteredEvents.map((event) => (
            <Link
              key={event.id}
              href={withRole(`/agenda/${event.slug}`, role)}
              className="surface-card transition hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)]"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#7a756e]">
                    <span className="rounded-full bg-[#e3f2fd] px-2.5 py-1 font-semibold text-[#1565c0]">
                      {event.category}
                    </span>
                    <span>{formatDateTimeRange(event.startsAt, event.endsAt)}</span>
                  </div>
                  <h3 className="mt-3 font-display text-2xl text-[#1a1a1a]">{event.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#4a4540]">{event.summary}</p>
                </div>
                <div className="space-y-2 text-sm text-[#7a756e]">
                  <p className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" aria-hidden="true" />
                    {event.location}
                  </p>
                  {event.territory ? <p>{event.territory}</p> : null}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
