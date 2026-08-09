import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FighterCard } from "@/components/fighter/FighterCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { ActionLink, Chip, Container, SectionHeading } from "@/components/ui/primitives";
import { getDictionary } from "@/i18n";
import { pageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/paths";
import { getFightersByOrganization } from "@/lib/repository";
import { LOCALES, ORGANIZATIONS, isLocale, type Locale } from "@/lib/types";

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
    path: routes.fighters,
    title: dict.fighters.title,
    description: dict.fighters.dek,
  });
}

export default async function FightersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);

  const groups = ORGANIZATIONS.map((organization) => ({
    organization,
    fighters: getFightersByOrganization(organization),
  })).filter((group) => group.fighters.length > 0);

  const total = groups.reduce((n, g) => n + g.fighters.length, 0);
  const hasDemo = groups.some((g) => g.fighters.some((f) => f.isDemo));

  return (
    <>
      <PageHeader
        crumbs={[
          { href: routes.home(locale), label: dict.nav.home },
          { label: dict.fighters.title },
        ]}
        kicker={`${dict.dataDesk.fighterFiles} · ${total}`}
        title={dict.fighters.title}
        dek={dict.fighters.dek}
      />

      <Container className="py-10 md:py-14">
        {hasDemo ? (
          <div className="mb-8">
            <Chip tone="signal">{dict.demo.articleBadge}</Chip>
          </div>
        ) : null}

        {groups.length === 0 ? (
          <p className="sheet px-5 py-10 text-center text-sm text-ink-muted">
            {dict.fighters.empty}
          </p>
        ) : (
          <div className="space-y-14">
            {groups.map((group) => (
              <section
                key={group.organization}
                aria-labelledby={`fighters-${group.organization}`}
              >
                <SectionHeading
                  title={dict.organizations[group.organization]}
                  action={
                    <ActionLink href={routes.organization(locale, group.organization)}>
                      {dict.organizationPage.stories}
                    </ActionLink>
                  }
                />
                <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {group.fighters.map((fighter) => (
                    <li key={fighter.id} className="relative">
                      <FighterCard fighter={fighter} locale={locale} />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
