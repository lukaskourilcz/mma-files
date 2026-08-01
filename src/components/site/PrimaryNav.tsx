"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export interface NavItem {
  href: string;
  label: string;
}

/**
 * Desktop: an inline rule of sections. Mobile: the same rule, scrolled
 * horizontally — an editorial app's section rail, not a hamburger that hides
 * the paper's structure.
 */
export function PrimaryNav({ items, label }: { items: NavItem[]; label: string }) {
  const pathname = usePathname() ?? "";

  return (
    // Each link is the first child of its own `li`, so a Tailwind `first:`
    // variant would hit every item. Padding is uniform instead, and the rail is
    // offset so the first label lines up with the container edge in both
    // layouts: mobile 6px + 14px = the container's 20px gutter; desktop cancels
    // the link's own 14px.
    <nav aria-label={label} className="-mx-5 md:-ml-3.5 md:mr-0">
      <ul className="flex snap-x items-stretch overflow-x-auto px-1.5 md:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <li key={item.href} className="snap-start">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`label-mono relative flex h-11 items-center whitespace-nowrap px-3.5 ${
                  active ? "text-ink" : "text-ink-muted hover:text-ink"
                }`}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-3.5 bottom-0 h-[2px] ${
                    active ? "bg-ember" : "bg-transparent"
                  }`}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
