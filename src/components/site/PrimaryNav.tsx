"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/config/navigation";

/**
 * The section rail. Desktop and mobile are the same row; below the container
 * width it scrolls horizontally rather than collapsing into a hamburger that
 * hides the paper's structure.
 *
 * `min-w-0` plus `overflow-x-auto` matter: without them the rail refuses to
 * shrink and pushes the locale switcher off the right edge under 1440px.
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
        const accent = item.accent ?? "var(--color-accent)";

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            style={{ "--nav-accent": accent } as React.CSSProperties}
            className={`group relative flex shrink-0 items-center whitespace-nowrap px-3.5 text-[12px] font-bold uppercase tracking-[0.11em] transition-colors hover:text-[var(--nav-accent)] ${
              active ? "text-ink" : "text-ink-muted"
            }`}
          >
            {item.label}
            <span
              aria-hidden="true"
              style={active ? { backgroundColor: accent } : undefined}
              className={`absolute inset-x-0 bottom-0 h-[2px] ${
                active ? "" : "bg-transparent group-hover:bg-[var(--nav-accent)]"
              }`}
            />
          </Link>
        );
      })}
    </nav>
  );
}
