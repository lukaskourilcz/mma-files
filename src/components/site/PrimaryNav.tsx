"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/config/navigation";

/**
 * Desktop section rail. It stays one line and can scroll at narrower desktop
 * widths; mobile uses the full-height sheet menu.
 */
export function PrimaryNav({ items, label }: { items: NavItem[]; label: string }) {
  const pathname = usePathname() ?? "";

  return (
    <nav
      aria-label={label}
      className="-mx-1 flex min-w-0 flex-1 items-stretch self-stretch overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {items.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`group relative flex min-h-11 shrink-0 items-center whitespace-nowrap px-5 text-[13px] font-bold uppercase tracking-[0.09em] ${
              active ? "text-text-inverse" : "text-text-inverse-muted"
            }`}
          >
            {item.label}
            <span
              aria-hidden="true"
              className={`absolute inset-x-5 bottom-0 h-[3px] ${
                active ? "bg-accent" : "bg-transparent group-hover:bg-accent"
              }`}
            />
          </Link>
        );
      })}
    </nav>
  );
}
