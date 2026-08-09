"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BrandLockup } from "@/components/site/BrandLockup";
import { SocialIcons } from "@/components/site/SocialIcons";
import type { NavItem } from "@/config/navigation";
import type { Locale } from "@/lib/types";
import { routes } from "@/lib/paths";

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface MobileMenuProps {
  locale: Locale;
  items: NavItem[];
  primaryLabel: string;
  menuLabel: string;
  closeLabel: string;
}

export function MobileMenu({
  locale,
  items,
  primaryLabel,
  menuLabel,
  closeLabel,
}: MobileMenuProps) {
  const pathname = usePathname() ?? "";
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const closeAtDesktop = () => {
      if (desktop.matches) setOpen(false);
    };
    desktop.addEventListener("change", closeAtDesktop);
    return () => desktop.removeEventListener("change", closeAtDesktop);
  }, []);

  useEffect(() => {
    if (!open) {
      if (wasOpenRef.current) {
        window.requestAnimationFrame(() => triggerRef.current?.focus());
      }
      wasOpenRef.current = false;
      return;
    }

    wasOpenRef.current = true;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.requestAnimationFrame(() => {
      sheetRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    });

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }

      if (event.key !== "Tab" || !sheetRef.current) return;
      const focusable = Array.from(
        sheetRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      );
      if (focusable.length === 0) return;

      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label={menuLabel}
        aria-expanded={open}
        aria-controls="mobile-menu-sheet"
        onClick={() => setOpen(true)}
        className="inline-flex h-11 w-11 items-center justify-center text-text-inverse"
      >
        <span aria-hidden="true" className="flex flex-col gap-[5px]">
          <span className="block h-0.5 w-[18px] bg-current" />
          <span className="block h-0.5 w-[18px] bg-current" />
          <span className="block h-0.5 w-[18px] bg-current" />
        </span>
      </button>

      {open ? (
        <div
          ref={sheetRef}
          id="mobile-menu-sheet"
          role="dialog"
          aria-modal="true"
          aria-label={menuLabel}
          className="fixed inset-0 z-[60] min-h-dvh overflow-y-auto bg-chrome text-text-inverse"
        >
          <div className="grid h-[var(--layout-chrome-h-sm)] grid-cols-[44px_1fr_44px] items-center border-b border-rule-dark px-1">
            <button
              type="button"
              aria-label={closeLabel}
              onClick={() => setOpen(false)}
              className="relative inline-flex h-11 w-11 items-center justify-center text-text-inverse"
            >
              <span aria-hidden="true" className="relative block h-[18px] w-[18px]">
                <span className="absolute left-0 top-2 block h-0.5 w-[18px] rotate-45 bg-current" />
                <span className="absolute left-0 top-2 block h-0.5 w-[18px] -rotate-45 bg-current" />
              </span>
            </button>
            <Link
              href={routes.home(locale)}
              onClick={() => setOpen(false)}
              className="inline-flex min-h-11 items-center justify-self-center"
            >
              <BrandLockup compact />
            </Link>
            <span aria-hidden="true" />
          </div>

          <nav aria-label={primaryLabel} className="px-5">
            <ul>
              {items.map((item) => {
                const active =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.href} className="border-b border-rule-dark">
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setOpen(false)}
                      className={`relative flex min-h-[76px] items-center py-5 pl-5 pr-2 display text-[36px] leading-[var(--leading-display)] ${
                        active ? "text-accent-on-dark" : "text-text-inverse"
                      }`}
                    >
                      {active ? (
                        <span
                          aria-hidden="true"
                          className="absolute left-0 top-1/2 h-7 w-[3px] -translate-y-1/2 bg-accent"
                        />
                      ) : null}
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="px-5 pb-10 pt-8">
            <SocialIcons gap="gap-6" />
          </div>
        </div>
      ) : null}
    </>
  );
}
