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
    <nav aria-label={label} className="-mx-5 md:mx-0">
      <ul className="flex snap-x items-stretch gap-0 overflow-x-auto px-5 md:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <li key={item.href} className="snap-start">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`label-mono relative flex h-11 items-center whitespace-nowrap px-3.5 first:pl-0 md:first:pl-3.5 ${
                  active ? "text-ink" : "text-ink-muted hover:text-ink"
                }`}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-3.5 bottom-0 h-[2px] first:left-0 ${
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
