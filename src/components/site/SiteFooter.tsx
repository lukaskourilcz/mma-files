import Link from "next/link";
import { Container } from "@/components/ui/primitives";
import { siteConfig } from "@/config/site";
import { getDictionary } from "@/i18n";
import { routes } from "@/lib/paths";
import type { Locale } from "@/lib/types";

function FooterLink({ href, children }: { href: string; children: string }) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm text-paper-muted transition-colors hover:text-white"
      >
        {children}
      </Link>
    </li>
  );
}

export function SiteFooter({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t-2 border-ember bg-ink text-white">
      <Container className="py-14 md:py-16">
        <div className="grid gap-10 border-b border-rule-dark pb-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-4">
            <span aria-hidden="true" className="mb-3 block h-[3px] w-9 bg-ember" />
            <p className="text-[1.5rem] font-bold leading-none tracking-[-0.045em]">
              {siteConfig.wordmark}
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-paper-muted">
              {siteConfig.tagline[locale]}
            </p>
          </div>

          <nav className="md:col-span-3" aria-labelledby="footer-sections">
            <h2 id="footer-sections" className="label-mono text-muted">
              {dict.footer.sections}
            </h2>
            <ul className="mt-4 space-y-2.5">
              <FooterLink href={routes.latest(locale)}>{dict.nav.latest}</FooterLink>
              <FooterLink href={routes.fightWeek(locale)}>
                {dict.nav.fightWeek}
              </FooterLink>
              <FooterLink href={routes.results(locale)}>{dict.nav.results}</FooterLink>
              <FooterLink href={routes.events(locale)}>{dict.nav.events}</FooterLink>
              <FooterLink href={routes.fighters(locale)}>{dict.nav.fighters}</FooterLink>
              <FooterLink href={routes.dataDesk(locale)}>{dict.nav.dataDesk}</FooterLink>
            </ul>
          </nav>

          <nav className="md:col-span-3" aria-labelledby="footer-desk">
            <h2 id="footer-desk" className="label-mono text-muted">
              {dict.footer.theDesk}
            </h2>
            <ul className="mt-4 space-y-2.5">
              <FooterLink href={routes.about(locale)}>{dict.footer.about}</FooterLink>
              <FooterLink href={routes.howItWorks(locale)}>
                {dict.footer.howItWorks}
              </FooterLink>
              <FooterLink href={routes.standards(locale)}>
                {dict.footer.standards}
              </FooterLink>
              <FooterLink href={routes.corrections(locale)}>
                {dict.footer.corrections}
              </FooterLink>
              <FooterLink href={routes.privacy(locale)}>{dict.footer.privacy}</FooterLink>
              <FooterLink href={routes.newsletter(locale)}>
                {dict.newsletter.pageTitle}
              </FooterLink>
            </ul>
          </nav>

          <div className="md:col-span-2">
            <h2 className="label-mono text-muted">{dict.footer.follow}</h2>
            <ul className="mt-4 space-y-2.5">
              <li>
                {siteConfig.social.instagram ? (
                  <a
                    href={siteConfig.social.instagram}
                    rel="noopener noreferrer me"
                    className="text-sm text-paper-muted hover:text-white"
                  >
                    {dict.footer.instagram}
                  </a>
                ) : (
                  <span className="text-sm text-muted">{dict.footer.instagram}</span>
                )}
              </li>
              <li>
                {siteConfig.social.threads ? (
                  <a
                    href={siteConfig.social.threads}
                    rel="noopener noreferrer me"
                    className="text-sm text-paper-muted hover:text-white"
                  >
                    {dict.footer.threads}
                  </a>
                ) : (
                  <span className="text-sm text-muted">{dict.footer.threads}</span>
                )}
              </li>
              <li className="label-mono-sm pt-1 text-muted">
                {dict.footer.socialPending}
              </li>
              <li className="pt-1">
                <a
                  href={routes.rss(locale)}
                  className="text-sm text-paper-muted hover:text-white"
                >
                  {dict.footer.rss}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="grid gap-8 pt-10 md:grid-cols-12">
          <p className="max-w-2xl text-sm leading-relaxed text-paper-muted md:col-span-7">
            {dict.footer.transparency}
          </p>
          <div className="md:col-span-5 md:text-right">
            <p className="label-mono text-paper-muted">
              {dict.footer.poweredBy(
                siteConfig.engine.name,
                siteConfig.engine.descriptor[locale],
              )}
            </p>
            <p className="label-mono-sm mt-3 text-muted">
              © {year} {siteConfig.name}. {dict.footer.rights}
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
