import Link from "next/link";
import { BrandLockup } from "@/components/site/BrandLockup";
import { SocialIcons } from "@/components/site/SocialIcons";
import { Container } from "@/components/ui/primitives";
import { getPrimaryNavigation } from "@/config/navigation";
import { getDictionary } from "@/i18n";
import { routes } from "@/lib/paths";
import type { Locale } from "@/lib/types";

function FooterLink({ href, children }: { href: string; children: string }) {
  return (
    <li>
      <Link
        href={href}
        className="flex min-h-11 items-center text-[15px] text-text-inverse-muted underline decoration-transparent decoration-1 underline-offset-4 hover:text-text-inverse hover:decoration-current"
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
    <footer className="mt-20 bg-chrome text-text-inverse">
      <Container className="pb-10 pt-16">
        <div className="grid gap-10 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-5">
            <Link href={routes.home(locale)} className="inline-flex min-h-11 items-center">
              <BrandLockup />
            </Link>
            <p className="mt-4 max-w-[40ch] text-[15px] leading-relaxed text-text-inverse-muted">
              {dict.footer.blurb}
            </p>
          </div>

          <nav className="md:col-span-2" aria-labelledby="footer-sections">
            <h2
              id="footer-sections"
              className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-text-inverse-meta"
            >
              {dict.footer.sections}
            </h2>
            <ul className="mt-2">
              {sections.map((item) => (
                <FooterLink key={item.href} href={item.href}>
                  {item.label}
                </FooterLink>
              ))}
            </ul>
          </nav>

          <nav className="md:col-span-3" aria-labelledby="footer-desk">
            <h2
              id="footer-desk"
              className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-text-inverse-meta"
            >
              {dict.footer.desk}
            </h2>
            <ul className="mt-2">
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
            <h2 className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-text-inverse-meta">
              {dict.footer.follow}
            </h2>
            <div className="mt-5">
              <SocialIcons />
            </div>
            <Link
              href={routes.rss(locale)}
              className="mt-4 flex min-h-11 items-center text-[15px] text-text-inverse-muted underline decoration-transparent decoration-1 underline-offset-4 hover:text-text-inverse hover:decoration-current"
            >
              {dict.footer.rss}
            </Link>
          </div>
        </div>

        <div className="mt-10 border-t border-rule-dark pt-6">
          <p className="font-mono text-[11px] tracking-[var(--tracking-mono)] text-text-inverse-meta">
            {dict.footer.legal}
          </p>
        </div>
      </Container>
    </footer>
  );
}
