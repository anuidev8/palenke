"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import type { ViewerRole } from "@/lib/mock-data";
import { isInternal, withRole } from "@/lib/viewer";
import { useAuth } from "@/lib/auth/AuthContext";
import { LogOut, LayoutDashboard } from "lucide-react";

function getRoleLabel(role: ViewerRole) {
  if (role === "admin") {
    return "Admin";
  }

  if (role === "internal") {
    return "Interno";
  }

  return "Público";
}

function getUserDisplayName(user: NonNullable<ReturnType<typeof useAuth>["user"]>) {
  const metadata = user.user_metadata as Record<string, unknown> | undefined;
  const candidates = [
    metadata?.full_name,
    metadata?.name,
    metadata?.display_name,
    metadata?.user_name,
  ];

  for (const value of candidates) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  const emailName = user.email?.split("@")[0]?.replace(/[._-]+/g, " ") ?? "";
  if (!emailName) {
    return "Usuario";
  }

  return emailName.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function SiteHeader({
  role,
  simplified = false,
  transparentAtTop = false,
}: {
  role: ViewerRole;
  simplified?: boolean;
  transparentAtTop?: boolean;
}) {
  const [scrolled, setScrolled] = useState(false);
  const { user, viewerRole, loading, signOut } = useAuth();
  const effectiveRole = user ? viewerRole : role;
  const userDisplayName = user ? getUserDisplayName(user) : "";

  useEffect(() => {
    if (!transparentAtTop) return;

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial state

    return () => window.removeEventListener("scroll", handleScroll);
  }, [transparentAtTop]);

  const navItems: Array<{ label: string; href: string }> = [
    { label: "Inicio", href: "/" },
    { label: "Memoria Afroterritorial", href: "/memoria-afroterritorial" },
    { label: "Gobierno Propio", href: "/gobierno-propio" },
    { label: "SCITA", href: "/scita" },
  ];

  if (isInternal(effectiveRole)) {
    navItems.push({ label: "Geoportal", href: "/geoportal" });
  }

  // Calculate classes based on scroll state
  const isTransparent = transparentAtTop && !scrolled;
  
  const headerClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
    isTransparent 
      ? "bg-transparent border-transparent -translate-y-full opacity-0 pointer-events-none" 
      : "bg-[#f8f5f2] border-b border-[#e8dfd3] translate-y-0 opacity-100 pointer-events-auto shadow-sm"
  }`;

  return (
    <header className={headerClasses}>
      <div className="mx-auto flex h-[84px] w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* PCN Logo */}
        <Link href={withRole("/", effectiveRole)} className="flex shrink-0 items-center gap-3">
          <Image
            src="/brands/PALENKE.svg"
            alt="Logo Palenke / PCN"
            width={96}
            height={192}
            priority
            className="h-14 w-auto shrink-0 object-contain"
          />
          <span>
            <span className="block font-display text-[20px] leading-none text-[#1a1a1a]">Palenke</span>
            <span className="mt-0.5 block text-[11px] font-medium uppercase tracking-[2px] text-[#7a756e]">
              Pensamiento
            </span>
          </span>
        </Link>

        {simplified ? null : (
          <>
            {/* Desktop navigation */}
            <nav
              aria-label="Navegación principal"
              className="hidden items-center gap-5 lg:flex"
            >
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={withRole(item.href, effectiveRole)}
                  className="text-sm font-medium text-[#4a4540] transition-colors hover:text-[#1a1a1a]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Desktop User Menu / Role badge */}
            <div className="hidden items-center gap-3 lg:flex">
              {loading ? (
                <div className="h-9 w-24 animate-pulse rounded-full bg-[color:var(--sand-strong)]" />
              ) : user ? (
                <>
                  <div className="flex items-center gap-3 rounded-full border border-[color:var(--border-strong)] bg-white px-3 py-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[color:var(--forest)] text-xs font-bold text-white">
                      {userDisplayName[0]?.toUpperCase() ?? "U"}
                    </div>
                    <div className="min-w-0">
                      <p className="max-w-[160px] truncate text-sm font-semibold text-[color:var(--forest)]">
                        {userDisplayName}
                      </p>
                      <p className="max-w-[160px] truncate text-xs text-[color:var(--muted)]">
                        {user.email} · {getRoleLabel(viewerRole)}
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/studio"
                    className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border-strong)] bg-white px-4 py-2 text-sm font-medium text-[color:var(--forest)] transition-colors hover:bg-[color:var(--sand-strong)]"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Mi Estudio</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => signOut()}
                    className="inline-flex items-center gap-2 rounded-full border border-[color:rgb(248_213_213_/_0.6)] bg-white px-4 py-2 text-sm font-medium text-[color:var(--danger)] transition-colors hover:bg-[color:rgb(248_213_213_/_0.25)]"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Cerrar sesión</span>
                  </button>
                </>
              ) : isInternal(effectiveRole) ? (
                <span className="rounded-full bg-[#fff3cd] px-3 py-1.5 text-xs font-semibold text-[#1a1a1a]">
                  Rol: {getRoleLabel(effectiveRole)}
                </span>
              ) : (
                <Link href="/login" className="text-sm font-medium text-[color:var(--forest)] hover:text-black">
                  Iniciar sesión
                </Link>
              )}
            </div>

            {/* Mobile menu */}
            <details className="group lg:hidden">
              <summary className="list-none rounded-full border border-[#e8dfd3] bg-white px-4 py-2 text-sm font-medium text-[#1a1a1a]">
                Menú
              </summary>
              <div className="absolute left-4 right-4 top-[79px] z-50 rounded-3xl border border-[#e8dfd3] bg-white p-4 shadow-[var(--shadow-card)]">
                <div className="grid gap-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={withRole(item.href, effectiveRole)}
                      className="rounded-2xl px-4 py-3 text-sm font-medium text-[#1a1a1a] hover:bg-[#f0eae0]"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
                {loading ? (
                  <div className="mt-4 border-t border-[#e8dfd3] pt-4">
                    <div className="h-10 w-full animate-pulse rounded-2xl bg-[color:var(--sand-strong)]" />
                  </div>
                ) : user ? (
                  <div className="mt-4 border-t border-[#e8dfd3] pt-4 grid gap-1">
                    <div className="px-4 py-2 mb-2 bg-[color:var(--sand-strong)] rounded-xl">
                      <p className="text-sm font-semibold text-[color:var(--forest)] truncate">{userDisplayName}</p>
                      <p className="text-xs text-[color:var(--muted)] truncate">{user.email}</p>
                      <p className="mt-1 text-xs text-[color:var(--muted)]">{getRoleLabel(viewerRole)}</p>
                    </div>
                    <Link
                      href="/studio"
                      className="flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium text-[#1a1a1a] hover:bg-[#f0eae0]"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Mi Estudio
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="flex w-full items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium text-[color:var(--danger)] hover:bg-[color:rgb(248_213_213_/_0.25)] text-left mt-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Cerrar sesión
                    </button>
                  </div>
                ) : isInternal(effectiveRole) ? (
                  <div className="mt-4 border-t border-[#e8dfd3] pt-4">
                    <span className="rounded-full bg-[#fff3cd] px-3 py-1.5 text-xs font-semibold text-[#1a1a1a]">
                      Rol: {getRoleLabel(effectiveRole)}
                    </span>
                  </div>
                ) : (
                  <div className="mt-4 border-t border-[#e8dfd3] pt-4">
                    <Link
                      href="/login"
                      className="block rounded-2xl bg-[color:var(--forest)] px-4 py-3 text-center text-sm font-medium text-[color:var(--sand)]"
                    >
                      Iniciar sesión
                    </Link>
                  </div>
                )}
              </div>
            </details>
          </>
        )}
      </div>
    </header>
  );
}
