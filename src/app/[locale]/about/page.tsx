import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { ActionLink, Container, Kicker } from "@/components/ui/primitives";
import { siteConfig } from "@/config/site";
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
    path: routes.about,
    title: dict.about.title,
    description: dict.about.dek,
  });
}

function RuleList({ items, tone }: { items: readonly string[]; tone: "ember" | "danger" }) {
  return (
    <ul className="mt-4 space-y-2.5">
      {items.map((item) => (
        <li key={item} className="relative pl-4 text-[0.9375rem] leading-relaxed text-ink-muted">
          <span
            aria-hidden="true"
            className={`absolute left-0 top-[0.68em] block h-[1px] w-2.5 ${
              tone === "ember" ? "bg-ember" : "bg-danger"
            }`}
          />
          {item}
        </li>
      ))}
    </ul>
  );
}

export default async function AboutPage({
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
          { label: dict.about.title },
        ]}
        kicker={siteConfig.tagline[locale]}
        title={dict.about.title}
        dek={dict.about.dek}
      />

      <Container className="py-12 md:py-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <section aria-labelledby="what">
              <Kicker>{dict.about.whatTitle}</Kicker>
              <div className="mt-4 space-y-4">
                {dict.about.whatBody.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 40)}
                    className="text-[1.0625rem] leading-relaxed text-graphite"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>

            <section aria-labelledby="covers" className="mt-12">
              <Kicker>{dict.about.coversTitle}</Kicker>
              <RuleList items={dict.about.coversList} tone="ember" />
            </section>

            <section aria-labelledby="not" className="mt-12">
              <Kicker>{dict.about.notTitle}</Kicker>
              <RuleList items={dict.about.notList} tone="danger" />
            </section>
          </div>

          <aside className="space-y-6 lg:col-span-5">
            <section
              aria-labelledby="status"
              className="rounded-[10px] border border-ember/30 bg-ember-soft p-5 md:p-6"
            >
              <h2 id="status" className="label-mono text-ember">
                {dict.about.statusTitle}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink">
                {dict.about.statusBody}
              </p>
            </section>

            <section aria-labelledby="engine" className="sheet-dark p-5 text-white md:p-6">
              <h2 id="engine" className="label-mono text-ember">
                {dict.about.engineTitle}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-paper">
                {dict.about.engineBody(siteConfig.engine.name)}
              </p>
              <p className="mt-4 border-t border-rule-dark pt-4 text-xs leading-relaxed text-muted">
                {dict.about.engineNote}
              </p>
              <div className="mt-5">
                <ActionLink href={routes.howItWorks(locale)} tone="paper">
                  {dict.footer.howItWorks}
                </ActionLink>
              </div>
            </section>

          </aside>
        </div>
      </Container>
    </>
  );
}
