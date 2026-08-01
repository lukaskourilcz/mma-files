import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NewsletterModule } from "@/components/site/NewsletterModule";
import { PageHeader } from "@/components/ui/PageHeader";
import { ActionLink, Container, Kicker } from "@/components/ui/primitives";
import { getDictionary } from "@/i18n";
import { pageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/paths";
import { LOCALES, isLocale, type Locale } from "@/lib/types";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return pageMetadata({
    locale,
    path: routes.newsletter,
    title: dict.newsletter.pageTitle,
    description: dict.newsletter.pageDek,
    // No provider is wired up; there is nothing here worth a search result.
    indexable: false,
  });
}

export default async function NewsletterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);

  return (
    <>
      <PageHeader
        crumbs={[
          { href: routes.home(locale), label: dict.nav.home },
          { label: dict.newsletter.pageTitle },
        ]}
        title={dict.newsletter.pageTitle}
        dek={dict.newsletter.pageDek}
      />

      <Container className="py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <NewsletterModule copy={dict.newsletter} variant="panel" />
          </div>

          <div className="space-y-8 lg:col-span-5">
            <section aria-labelledby="what">
              <Kicker>{dict.newsletter.whatTitle}</Kicker>
              <ul className="mt-4 space-y-2.5">
                {dict.newsletter.whatList.map((item) => (
                  <li
                    key={item}
                    className="relative pl-4 text-[0.9375rem] leading-relaxed text-ink-muted"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-[0.68em] block h-[1px] w-2.5 bg-ember"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="when">
              <Kicker>{dict.newsletter.whenTitle}</Kicker>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-muted">
                {dict.newsletter.whenBody}
              </p>
            </section>

            <ActionLink href={routes.privacy(locale)}>{dict.footer.privacy}</ActionLink>
          </div>
        </div>
      </Container>
    </>
  );
}
