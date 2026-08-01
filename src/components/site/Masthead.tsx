import Link from "next/link";
import { LocaleSwitcher } from "@/components/site/LocaleSwitcher";
import { PrimaryNav, type NavItem } from "@/components/site/PrimaryNav";
import { Container } from "@/components/ui/primitives";
import { demoMode, siteConfig } from "@/config/site";
import { getDictionary, otherLocale } from "@/i18n";
import { routes } from "@/lib/paths";
import type { Locale } from "@/lib/types";

export function Masthead({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const alternate = otherLocale(locale);
  const alternateDict = getDictionary(alternate);

  const items: NavItem[] = [
    { href: routes.latest(locale), label: dict.nav.latest },
    { href: routes.organization(locale, "ufc"), label: dict.nav.ufc },
    { href: routes.organization(locale, "oktagon"), label: dict.nav.oktagon },
    { href: routes.organization(locale, "ksw"), label: dict.nav.ksw },
    { href: routes.fightWeek(locale), label: dict.nav.fightWeek },
    { href: routes.fighters(locale), label: dict.nav.fighters },
    { href: routes.dataDesk(locale), label: dict.nav.dataDesk },
  ];

  return (
    <header>
      <a
        href="#main"
        className="label-mono sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-[6px] focus:bg-ember focus:px-4 focus:py-2.5 focus:text-white"
      >
        {dict.nav.skipToContent}
      </a>

      {demoMode ? (
        <div className="border-b border-ember/30 bg-ember-soft">
          <Container className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2">
            <span className="label-mono-sm rounded-[4px] bg-ember px-1.5 py-0.5 text-white">
              {dict.demo.bannerLabel}
            </span>
            <p className="text-xs leading-relaxed text-ink-muted">
              {dict.demo.bannerBody}
            </p>
          </Container>
        </div>
      ) : null}

      <div className="bg-ink text-white">
        <Container className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 py-5 md:py-7">
          <div>
            <span aria-hidden="true" className="mb-2.5 block h-[3px] w-9 bg-ember" />
            <Link
              href={routes.home(locale)}
              className="block text-[1.75rem] font-bold leading-none tracking-[-0.045em] text-white md:text-[2.25rem]"
            >
              {siteConfig.wordmark}
            </Link>
            <p className="label-mono-sm mt-2.5 text-paper-muted">
              {siteConfig.utilityLine[locale]}
            </p>
          </div>

          <LocaleSwitcher
            locale={locale}
            other={alternate}
            currentLabel={dict.meta.localeShort}
            otherLabel={alternateDict.meta.localeShort}
            switchLabel={dict.nav.localeSwitch}
          />
        </Container>
      </div>

      <div className="sticky top-0 z-40 border-b border-rule-strong bg-paper/95 backdrop-blur-sm">
        <Container>
          <PrimaryNav items={items} label={dict.nav.primary} />
        </Container>
      </div>
    </header>
  );
}
