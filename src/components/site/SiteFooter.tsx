import Link from "next/link";
import { Container } from "@/components/ui/primitives";
import { getPrimaryNavigation } from "@/config/navigation";
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
  const sections = getPrimaryNavigation(locale, dict);

  return (
    <footer className="mt-20 bg-ink text-white">
      {/* Both promotions, split down the middle. */}
      <div
        aria-hidden="true"
        className="h-1"
        style={{
          background:
            "linear-gradient(90deg, var(--color-badge-ufc) 0 50%, var(--color-badge-oktagon) 50% 100%)",
        }}
      />
      <Container className="py-12 md:py-14">
        <div className="grid gap-10 border-b border-rule-dark pb-9 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-5">
            <div className="flex items-center gap-[11px]">
              <span
                aria-hidden="true"
                className="block h-[30px] w-[5px] -skew-x-12 bg-signal"
              />
              <span className="display text-[27px] leading-none text-paper">
                {siteConfig.wordmark}
              </span>
            </div>
            <p className="mt-4 max-w-[38ch] text-sm leading-relaxed text-paper-meta">
              {dict.footer.blurb}
            </p>
          </div>

          <nav className="md:col-span-2" aria-labelledby="footer-sections">
            <h2
              id="footer-sections"
              className="label-mono-sm font-semibold text-paper-meta"
            >
              {dict.footer.sections}
            </h2>
            <ul className="mt-3.5 space-y-2.5">
              {sections.map((item) => (
                <FooterLink key={item.href} href={item.href}>
                  {item.label}
                </FooterLink>
              ))}
            </ul>
          </nav>

          <nav className="md:col-span-3" aria-labelledby="footer-desk">
            <h2 id="footer-desk" className="label-mono-sm font-semibold text-paper-meta">
              {dict.footer.desk}
            </h2>
            <ul className="mt-3.5 space-y-2.5">
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
                {dict.footer.newsletter}
              </FooterLink>
              <FooterLink href={routes.dataDesk(locale)}>{dict.footer.numbers}</FooterLink>
            </ul>
          </nav>

          <div className="md:col-span-2">
            <h2 className="label-mono-sm font-semibold text-paper-meta">
              {dict.footer.follow}
            </h2>
            <ul className="mt-3.5 space-y-2.5">
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
                  <span className="text-sm text-paper-meta">{dict.footer.instagram}</span>
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
                  <span className="text-sm text-paper-meta">{dict.footer.threads}</span>
                )}
              </li>
              <li>
                <a
                  href={routes.rss(locale)}
                  className="text-sm text-paper-muted hover:text-white"
                >
                  {dict.footer.rss}
                </a>
              </li>
              <li className="label-mono-sm pt-1 text-paper-meta">
                {dict.footer.socialPending}
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-7">
          <p className="label-mono-sm text-paper-meta">{dict.footer.legal}</p>
        </div>
      </Container>
    </footer>
  );
}
