import Link from "next/link";
import {
  ActionLink,
  Container,
  Kicker,
  SectionHeading,
} from "@/components/ui/primitives";
import { siteConfig } from "@/config/site";
import { getDictionary } from "@/i18n";
import { routes } from "@/lib/paths";
import { getCoverageStats } from "@/lib/repository";
import type { FieldState, Locale } from "@/lib/types";

/** Four rules the desks apply before anything reaches a page. */
export function TransparencyBlock({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);

  return (
    <section aria-labelledby="transparency" className="py-14 md:py-20">
      <Container>
        <div className="max-w-2xl">
          <Kicker>{dict.labels.sourceChecked}</Kicker>
          <h2
            id="transparency"
            className="mt-3 text-[1.75rem] leading-[1.1] tracking-[-0.035em] text-ink md:text-[2.25rem]"
          >
            {dict.home.transparencyTitle}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-ink-muted">
            {dict.home.transparencyDek}
          </p>
        </div>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {dict.transparency.map((item, i) => (
            <li key={item.title} className="sheet flex flex-col p-5">
              <span className="label-mono-sm text-ember">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-base leading-snug tracking-[-0.02em] text-ink">
                {item.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-muted">
                {item.body}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-8">
          <ActionLink href={routes.standards(locale)}>
            {dict.footer.standards}
          </ActionLink>
        </div>
      </Container>
    </section>
  );
}

/** FightAIQ coverage, read from the repository — counts, never predictions. */
export function DataDeskModule({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const stats = getCoverageStats();

  const figures = [
    { label: dict.dataDesk.fighterFiles, value: stats.fighterFiles },
    { label: dict.dataDesk.eventFiles, value: stats.eventFiles },
    { label: dict.dataDesk.sourceRefs, value: stats.sourceRefs },
    { label: dict.dataDesk.fieldsTracked, value: stats.fieldsTracked },
  ];

  const states: FieldState[] = ["verified", "provisional", "disputed", "unavailable"];

  return (
    <section
      aria-labelledby="data-desk"
      className="grid-rules border-y border-rule-dark bg-ink py-14 text-white md:py-20"
    >
      <Container>
        <SectionHeading
          kicker={siteConfig.dataLayer.name}
          title={dict.home.dataTitle}
          dek={dict.home.dataDek}
          tone="paper"
          action={
            <ActionLink href={routes.dataDesk(locale)} tone="paper">
              {dict.actions.howChecked}
            </ActionLink>
          }
        />

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-8 lg:col-span-7 lg:grid-cols-4">
            {figures.map((figure) => (
              <div key={figure.label} className="border-t border-rule-dark pt-4">
                <dd className="text-[2.25rem] font-bold leading-none tracking-[-0.045em] text-white md:text-[2.75rem]">
                  {figure.value}
                </dd>
                <dt className="label-mono-sm mt-3 text-paper-muted">{figure.label}</dt>
              </div>
            ))}
          </dl>

          <div className="lg:col-span-5">
            <h3 className="label-mono text-ember">{dict.dataDesk.statesTitle}</h3>
            <ul className="mt-4 space-y-0">
              {states.map((state) => (
                <li
                  key={state}
                  className="flex items-baseline justify-between gap-4 border-b border-rule-dark py-2.5 last:border-b-0"
                >
                  <span className="label-mono-sm text-paper-muted">
                    {dict.fieldStates[state]}
                  </span>
                  <span className="font-mono text-sm text-white">
                    {stats.byState[state]}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm leading-relaxed text-muted">
              {dict.dataDesk.responsiblePlay}
            </p>
            <div className="mt-5">
              <ActionLink href={routes.fighters(locale)} tone="paper">
                {dict.actions.exploreFighters}
              </ActionLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

/** Visible notice on demo-derived pages. */
export function DemoNotice({
  locale,
  variant = "article",
}: {
  locale: Locale;
  variant?: "article" | "data";
}) {
  const dict = getDictionary(locale);

  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-1.5 rounded-[10px] border border-ember/30 bg-ember-soft px-4 py-3">
      <span className="label-mono-sm rounded-[4px] bg-ember px-1.5 py-0.5 text-white">
        {variant === "article" ? dict.demo.articleBadge : dict.demo.dataBadge}
      </span>
      <span className="text-xs leading-relaxed text-ink-muted">
        {variant === "article" ? dict.demo.articleNotice : dict.demo.dataNotice}
      </span>
    </p>
  );
}

/** Cross-links every page carries, so nothing is a dead end. */
export function DeskLinks({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const links = [
    { href: routes.howItWorks(locale), label: dict.footer.howItWorks },
    { href: routes.standards(locale), label: dict.footer.standards },
    { href: routes.corrections(locale), label: dict.footer.corrections },
    { href: routes.about(locale), label: dict.footer.about },
  ];

  return (
    <nav aria-label={dict.footer.theDesk} className="flex flex-wrap gap-x-5 gap-y-2">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="label-mono-sm text-ink-muted underline decoration-rule-strong underline-offset-[3px] hover:text-ink hover:decoration-ember"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
