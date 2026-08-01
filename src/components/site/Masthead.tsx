import Link from "next/link";
import { LocaleSwitcher } from "@/components/site/LocaleSwitcher";
import { PrimaryNav, type NavItem } from "@/components/site/PrimaryNav";
import { WireTicker } from "@/components/site/WireTicker";
import { demoMode, siteConfig } from "@/config/site";
import { getDictionary, otherLocale } from "@/i18n";
import { routes } from "@/lib/paths";
import { PROMOTION_ACCENT } from "@/lib/promotion";
import type { Locale } from "@/lib/types";

export function Masthead({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const alternate = otherLocale(locale);
  const alternateDict = getDictionary(alternate);

  const items: NavItem[] = [
    { href: routes.latest(locale), label: dict.nav.latest },
    {
      href: routes.organization(locale, "ufc"),
      label: dict.nav.ufc,
      accent: PROMOTION_ACCENT.ufc,
    },
    {
      href: routes.organization(locale, "oktagon"),
      label: dict.nav.oktagon,
      accent: PROMOTION_ACCENT.oktagon,
    },
    { href: routes.fightWeek(locale), label: dict.nav.fightWeek },
    { href: routes.results(locale), label: dict.nav.results },
    { href: routes.fighters(locale), label: dict.nav.fighters },
    { href: routes.dataDesk(locale), label: dict.nav.numbers },
  ];

  return (
    <header>
      <a
        href="#main"
        className="label-mono sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:bg-ink focus:px-4 focus:py-2.5 focus:text-paper"
      >
        {dict.nav.skipToContent}
      </a>

      <WireTicker locale={locale} />

      <div className="sticky top-0 z-40 border-b border-rule-strong bg-paper/95 backdrop-blur-[10px]">
        <div className="mx-auto flex h-[68px] w-full max-w-[90rem] items-center gap-5 px-5 md:gap-9 md:px-10">
          <Link
            href={routes.home(locale)}
            className="flex shrink-0 items-center gap-[11px]"
          >
            <span
              aria-hidden="true"
              className="block h-[30px] w-[5px] -skew-x-12 bg-ink"
            />
            <span className="display text-[22px] leading-none text-ink md:text-[27px]">
              {siteConfig.wordmark}
            </span>
          </Link>

          <PrimaryNav items={items} label={dict.nav.primary} />

          <div className="ml-auto flex shrink-0 items-center gap-3.5">
            {demoMode ? (
              <span className="label-mono-sm hidden text-ink-meta lg:inline">
                {dict.demo.bannerLabel}
              </span>
            ) : null}
            <LocaleSwitcher
              locale={locale}
              other={alternate}
              currentLabel={dict.meta.localeShort}
              otherLabel={alternateDict.meta.localeShort}
              switchLabel={dict.nav.localeSwitch}
            />
          </div>
        </div>
      </div>

      {demoMode ? (
        <p className="border-b border-rule-strong bg-card px-5 py-2 text-center text-xs leading-relaxed text-ink-muted md:px-10">
          <span className="label-mono-sm mr-2.5 bg-signal px-1.5 py-0.5 text-ink">
            {dict.demo.bannerLabel}
          </span>
          {dict.demo.bannerBody}
        </p>
      ) : null}
    </header>
  );
}
