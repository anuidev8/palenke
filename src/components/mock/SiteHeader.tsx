"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import type { ViewerRole } from "@/lib/mock-data";
import { isInternal, withRole } from "@/lib/viewer";

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

  if (isInternal(role)) {
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
      <div className="mx-auto flex h-[73px] w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* PCN Logo */}
        <Link href={withRole("/", role)} className="flex shrink-0 items-center gap-3">
          <Image
            src="/brands/PALENKE.jpeg"
            alt="Logo Palenke / PCN"
            width={40}
            height={40}
            priority
            className="h-10 w-10 shrink-0"
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
                  href={withRole(item.href, role)}
                  className="text-sm font-medium text-[#4a4540] transition-colors hover:text-[#1a1a1a]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Role badge (no global search) */}
            <div className="hidden items-center gap-3 lg:flex">
              {isInternal(role) ? (
                <span className="rounded-full bg-[#fff3cd] px-3 py-1.5 text-xs font-semibold text-[#1a1a1a]">
                  Rol: {role === "admin" ? "Admin" : "Interno"}
                </span>
              ) : null}
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
                      href={withRole(item.href, role)}
                      className="rounded-2xl px-4 py-3 text-sm font-medium text-[#1a1a1a] hover:bg-[#f0eae0]"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
                {isInternal(role) ? (
                  <div className="mt-4 border-t border-[#e8dfd3] pt-4">
                    <span className="rounded-full bg-[#fff3cd] px-3 py-1.5 text-xs font-semibold text-[#1a1a1a]">
                      Rol: {role === "admin" ? "Admin" : "Interno"}
                    </span>
                  </div>
                ) : null}
              </div>
            </details>
          </>
        )}
      </div>
    </header>
  );
}
