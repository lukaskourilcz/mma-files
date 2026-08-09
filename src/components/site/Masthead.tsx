import Link from "next/link";
import { BrandLockup } from "@/components/site/BrandLockup";
import { MobileMenu } from "@/components/site/MobileMenu";
import { PrimaryNav } from "@/components/site/PrimaryNav";
import { WireTicker } from "@/components/site/WireTicker";
import { getPrimaryNavigation } from "@/config/navigation";
import { getDictionary } from "@/i18n";
import { routes } from "@/lib/paths";
import type { Locale } from "@/lib/types";

export function Masthead({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);

  const items = getPrimaryNavigation(locale, dict);

  return (
    <header>
      <a
        href="#main"
        className="label-mono sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:inline-flex focus:min-h-11 focus:items-center focus:bg-accent focus:px-4 focus:py-2.5 focus:text-text-inverse"
      >
        {dict.nav.skipToContent}
      </a>

      <WireTicker locale={locale} />

      <div className="sticky top-0 z-40 border-b border-rule-dark bg-chrome">
        <div className="grid h-[var(--layout-chrome-h-sm)] grid-cols-[44px_1fr_44px] items-center px-1 md:hidden">
          <MobileMenu
            locale={locale}
            items={items}
            primaryLabel={dict.nav.primary}
            menuLabel={dict.nav.menu}
            closeLabel={dict.nav.closeMenu}
          />
          <Link
            href={routes.home(locale)}
            className="inline-flex min-h-11 items-center justify-self-center"
          >
            <BrandLockup compact />
          </Link>
          <span aria-hidden="true" />
        </div>

        <div className="mx-auto hidden h-[var(--layout-chrome-h)] w-full max-w-[var(--layout-max)] grid-cols-[240px_minmax(0,1fr)] items-stretch gap-10 px-10 md:grid">
          <Link href={routes.home(locale)} className="flex items-center">
            <BrandLockup />
          </Link>
          <PrimaryNav items={items} label={dict.nav.primary} />
        </div>
      </div>
    </header>
  );
}
