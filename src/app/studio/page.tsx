"use client";

import { useAuth } from "@/lib/auth/AuthContext";
import { SiteLayout, SectionHeader, EmptyState, DocumentCard } from "@/components/mock/ui";
import { FileText, User as UserIcon, Settings, Clock, LayoutDashboard, Compass } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getVisibleDocuments } from "@/lib/mock-data";

export default function StudioPage() {
  const { user, viewerRole, loading, signOut } = useAuth();
  const router = useRouter();
  const isAuthorizedMember = viewerRole === "internal" || viewerRole === "admin";
  const recentDocs = useMemo(() => getVisibleDocuments(viewerRole).slice(0, 3), [viewerRole]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?message=Acceso requerido");
      return;
    }

    if (!loading && user && !isAuthorizedMember) {
      router.push("/acceso-restringido");
    }
  }, [user, viewerRole, isAuthorizedMember, loading, router]);

  if (loading) {
    return (
      <SiteLayout role={viewerRole} simplifiedHeader>
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6">
          <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-[color:var(--sand-strong)] border-t-[color:var(--forest)]"></div>
          <p className="text-sm font-medium text-[color:var(--forest)] animate-pulse">Cargando tu estudio...</p>
        </div>
      </SiteLayout>
    );
  }

  if (!user || !isAuthorizedMember) return null;

  return (
    <SiteLayout role={viewerRole}>
      <div className="bg-[color:var(--sand-strong)] border-b border-[color:var(--border-soft)]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[color:var(--forest)] text-2xl font-bold text-white shadow-sm">
                {user.email?.[0].toUpperCase() ?? "U"}
              </div>
              <div>
                <h1 className="font-display text-3xl text-[color:var(--forest)]">¡Hola, {user.email?.split('@')[0]}!</h1>
                <p className="text-[color:var(--muted-strong)] mt-1">Miembro del Palenke • {user.email}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href="/studio/perfil" className="button-secondary bg-white">
                <Settings className="h-4 w-4" />
                <span>Configuración</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 grid gap-12 lg:grid-cols-[1fr_300px]">
        <div className="space-y-12">
          {/* Quick Actions */}
          <section>
            <SectionHeader title="Acciones rápidas" />
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Link href="/biblioteca" className="surface-card hover:border-[color:var(--gold-500)] transition-colors group flex flex-col items-center justify-center text-center p-6 gap-3">
                <div className="h-12 w-12 rounded-full bg-[color:var(--sand-strong)] flex items-center justify-center text-[color:var(--forest)] group-hover:bg-[color:var(--forest)] group-hover:text-white transition-colors">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-[color:var(--forest)]">Explorar Biblioteca</h3>
                  <p className="text-sm text-[color:var(--muted)] mt-1">Ver todos los documentos</p>
                </div>
              </Link>
              <Link href="/geoportal" className="surface-card hover:border-[color:var(--gold-500)] transition-colors group flex flex-col items-center justify-center text-center p-6 gap-3">
                <div className="h-12 w-12 rounded-full bg-[color:var(--sand-strong)] flex items-center justify-center text-[color:var(--forest)] group-hover:bg-[color:var(--forest)] group-hover:text-white transition-colors">
                  <Compass className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-[color:var(--forest)]">Abrir Geoportal</h3>
                  <p className="text-sm text-[color:var(--muted)] mt-1">Acceder a mapas y datos</p>
                </div>
              </Link>
              <Link href="/studio/actividad" className="surface-card hover:border-[color:var(--gold-500)] transition-colors group flex flex-col items-center justify-center text-center p-6 gap-3">
                <div className="h-12 w-12 rounded-full bg-[color:var(--sand-strong)] flex items-center justify-center text-[color:var(--forest)] group-hover:bg-[color:var(--forest)] group-hover:text-white transition-colors">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-[color:var(--forest)]">Tu Actividad</h3>
                  <p className="text-sm text-[color:var(--muted)] mt-1">Historial de accesos</p>
                </div>
              </Link>
            </div>
          </section>

          {/* Recent Activity */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <SectionHeader title="Documentos recientes" />
              <Link href="/biblioteca" className="text-sm font-medium text-[color:var(--gold-700)] hover:text-[color:var(--forest)] transition-colors">
                Ver todos
              </Link>
            </div>
            
            {recentDocs.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2">
                {recentDocs.map((doc) => (
                  <DocumentCard key={doc.id} document={doc} role={viewerRole} />
                ))}
              </div>
            ) : (
              <EmptyState 
                title="Aún no hay actividad" 
                description="Los documentos que veas o descargues aparecerán aquí para un acceso rápido."
                action={
                  <Link href="/biblioteca" className="button-primary mt-4">
                    Ir a la biblioteca
                  </Link>
                }
              />
            )}
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="surface-card p-6">
            <h3 className="font-semibold text-[color:var(--forest)] mb-4 flex items-center gap-2">
              <UserIcon className="h-5 w-5" />
              Tu Perfil
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-[color:var(--muted)] mb-1">Nombre completo</p>
                <p className="text-sm font-medium">{user.user_metadata?.full_name || 'Usuario del Palenke'}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-[color:var(--muted)] mb-1">Correo asociado</p>
                <p className="text-sm font-medium truncate">{user.email}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-[color:var(--muted)] mb-1">Rol de acceso</p>
                <p className="text-sm font-medium">{viewerRole === "admin" ? "Admin" : "Interno"}</p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-[color:var(--border-soft)]">
              <button onClick={() => signOut()} className="text-sm font-medium text-[color:var(--danger)] hover:underline flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4" />
                Cerrar sesión de forma segura
              </button>
            </div>
          </div>
        </aside>
      </div>
    </SiteLayout>
  );
}
