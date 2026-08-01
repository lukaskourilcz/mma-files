"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { withLocale } from "@/lib/paths";
import type { Locale } from "@/lib/types";

/**
 * Keeps the reader on the page they are reading. Every route on this site
 * exists in both locales, so the alternate target is always valid.
 */
export function LocaleSwitcher({
  locale,
  other,
  currentLabel,
  otherLabel,
  switchLabel,
}: {
  locale: Locale;
  other: Locale;
  currentLabel: string;
  otherLabel: string;
  switchLabel: string;
}) {
  const pathname = usePathname() ?? `/${locale}`;

  return (
    <div
      className="flex shrink-0 items-center border border-rule-strong font-mono text-[10px] font-semibold uppercase tracking-[0.14em]"
      role="group"
      aria-label={switchLabel}
    >
      <span aria-current="true" className="bg-ink px-2.5 py-1.5 text-paper">
        {currentLabel}
      </span>
      <Link
        href={withLocale(pathname, other)}
        hrefLang={other}
        lang={other}
        className="px-2.5 py-1.5 text-ink-muted hover:bg-ink hover:text-paper"
      >
        {otherLabel}
      </Link>
    </div>
  );
}
