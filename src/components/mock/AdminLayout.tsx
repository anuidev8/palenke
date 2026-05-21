import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getVisibleAdminNavItems } from "@/lib/admin-nav";
import type { ViewerRole } from "@/lib/mock-data";
import { getViewerSessionState } from "@/lib/viewer-server";
import { getViewerName, withRole } from "@/lib/viewer";

export type AdminLayoutActive =
  | "inicio"
  | "solicitudes"
  | "documentos"
  | "novedades"
  | "dashboards"
  | "accs"
  | "usuarios"
  | "campanas"
  | "contenido-visual"
  | "alertas";

type AdminLayoutProps = {
  role: ViewerRole;
  active: AdminLayoutActive;
  title: string;
  intro?: string;
  pendingSolicitudesCount?: number;
  children: ReactNode;
};

export async function AdminLayout({
  role,
  active,
  title,
  intro,
  pendingSolicitudesCount,
  children,
}: AdminLayoutProps) {
  const sessionState = await getViewerSessionState();
  const allNavItems = [
    { id: "inicio", label: "Inicio", href: "/admin" },
    { id: "solicitudes", label: "Solicitudes", href: "/admin/solicitudes" },
    { id: "documentos", label: "Biblioteca", href: "/admin/documentos" },
    { id: "novedades", label: "Noticias y agenda", href: "/admin/novedades" },
    { id: "dashboards", label: "Dashboards", href: "/admin/dashboards" },
    { id: "accs", label: "ACCs", href: "/admin/accs" },
    { id: "usuarios", label: "Usuarios", href: "/admin/usuarios" },
    { id: "campanas", label: "Campañas", href: "/admin/campanas" },
    { id: "contenido-visual", label: "Contenido visual IA", href: "/admin/contenido-visual" },
    { id: "alertas", label: "Alertas SCITA", href: "/admin/alertas" },
  ] as const;
  const navItems = getVisibleAdminNavItems(allNavItems, sessionState.email);

  return (
    <div className="min-h-screen bg-[color:var(--page)] text-[color:var(--forest)]">
      <header className="border-b border-[color:var(--border-soft)] bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[min(100%,90rem)] flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-4 sm:px-6 lg:px-8">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--muted)]">Panel admin</p>
            <h1 className="font-display text-2xl leading-tight text-[color:var(--forest)] sm:text-3xl">{title}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="rounded-full border border-[color:var(--border-strong)] bg-white px-4 py-2 text-sm font-medium text-[color:var(--forest)]">
              {getViewerName(role)}
            </span>
            <Link href={withRole("/", role)} className="button-secondary whitespace-nowrap">
              <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Volver al sitio</span>
            </Link>
            <Link href="/" className="button-ghost whitespace-nowrap">
              Cerrar sesión
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-[min(100%,90rem)] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(200px,220px)_minmax(0,1fr)] lg:gap-8 lg:px-8 lg:py-8">
        <aside className="surface-card h-fit p-3 sm:p-4">
          <details className="lg:hidden">
            <summary className="list-none text-sm font-semibold text-[color:var(--forest)]">Secciones del panel</summary>
            <nav aria-label="Panel de administración" className="mt-4 grid gap-2.5">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={withRole(item.href, role)}
                  aria-current={active === item.id ? "page" : undefined}
                  className={`rounded-2xl px-4 py-2.5 text-sm font-medium leading-snug ${
                    active === item.id ? "bg-[color:var(--forest)] text-[color:var(--sand)]" : "bg-[color:var(--sand-strong)] text-[color:var(--forest)]"
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    <span>{item.label}</span>
                    {item.id === "solicitudes" && pendingSolicitudesCount ? (
                      <span className="rounded-full bg-[color:var(--danger)] px-2 py-0.5 text-xs font-semibold text-white">
                        {pendingSolicitudesCount}
                      </span>
                    ) : null}
                  </span>
                </Link>
              ))}
            </nav>
          </details>

          <nav aria-label="Panel de administración" className="hidden gap-2.5 lg:grid">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={withRole(item.href, role)}
                aria-current={active === item.id ? "page" : undefined}
                className={`rounded-2xl px-4 py-2.5 text-sm font-medium leading-snug transition ${
                  active === item.id
                    ? "bg-[color:var(--forest)] text-[color:var(--sand)]"
                    : "bg-[color:var(--sand-strong)] text-[color:var(--forest)] hover:bg-[color:var(--gold-100)]"
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  <span>{item.label}</span>
                  {item.id === "solicitudes" && pendingSolicitudesCount ? (
                    <span className="rounded-full bg-[color:var(--danger)] px-2 py-0.5 text-xs font-semibold text-white">
                      {pendingSolicitudesCount}
                    </span>
                  ) : null}
                </span>
              </Link>
            ))}
          </nav>
        </aside>

        <div className="min-w-0 space-y-5">
          {intro ? (
            <p className="text-sm leading-6 text-[color:var(--muted-strong)] sm:text-base sm:leading-7">
              {intro}
            </p>
          ) : null}
          {children}
        </div>
      </div>
    </div>
  );
}
