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
      className="label-mono flex items-center rounded-[6px] border border-rule-dark-strong"
      role="group"
      aria-label={switchLabel}
    >
      <span
        aria-current="true"
        className="bg-ember px-2.5 py-1.5 text-white first:rounded-l-[5px]"
      >
        {currentLabel}
      </span>
      <Link
        href={withLocale(pathname, other)}
        hrefLang={other}
        lang={other}
        className="px-2.5 py-1.5 text-paper-muted last:rounded-r-[5px] hover:bg-graphite hover:text-white"
      >
        {otherLabel}
      </Link>
    </div>
  );
}
