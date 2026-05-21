"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ViewerRole } from "@/lib/mock-data";
import { withRole } from "@/lib/viewer";

const LINKS = [
  { label: "Memoria Afroterritorial", href: "/memoria-afroterritorial" },
  { label: "Mediateca Ubuntu", href: "/memoria-afroterritorial/mediateca-ubuntu" },
] as const;

export function MemoriaAfroterritorialSubnav({ role }: { role: ViewerRole }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Secciones de Memoria Afroterritorial"
      className="border-b border-[#e8dfd3] bg-white/90 backdrop-blur-sm"
    >
      <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
        {LINKS.map((link) => {
          const href = withRole(link.href, role);
          const active =
            link.href === "/memoria-afroterritorial/mediateca-ubuntu"
              ? pathname.includes("/mediateca-ubuntu")
              : pathname === "/memoria-afroterritorial";
          return (
            <Link
              key={link.href}
              href={href}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                active
                  ? "bg-[#1a1a1a] text-white shadow-sm"
                  : "border border-[#e8dfd3] bg-[#f7f3ed] text-[#4a4540] hover:bg-[#efe9df]"
              }`}
              aria-current={active ? "page" : undefined}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
