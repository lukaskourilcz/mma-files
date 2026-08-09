import type { Dictionary } from "@/i18n";
import { routes } from "@/lib/paths";
import type { Locale } from "@/lib/types";

export interface NavItem {
  href: string;
  label: string;
}

/** The one ordered section list used by every reader-facing navigation. */
export function getPrimaryNavigation(
  locale: Locale,
  dict: Dictionary,
): NavItem[] {
  return [
    { href: routes.latest(locale), label: dict.nav.latest },
    { href: routes.organization(locale, "ufc"), label: dict.nav.ufc },
    { href: routes.organization(locale, "oktagon"), label: dict.nav.oktagon },
    { href: routes.predictions(locale), label: dict.nav.predictions },
    { href: routes.fightWeek(locale), label: dict.nav.fightWeek },
    { href: routes.results(locale), label: dict.nav.results },
    { href: routes.fighters(locale), label: dict.nav.fighters },
  ];
}
