import Link from "next/link";
import { CountUp } from "@/components/site/CountUp";
import { ActionLink, Container, SectionHeading } from "@/components/ui/primitives";
import { getDictionary } from "@/i18n";
import { routes } from "@/lib/paths";
import { getCoverageStats } from "@/lib/repository";
import type { FieldState, Locale } from "@/lib/types";

const STATE_FILL: Record<FieldState, string> = {
  verified: "var(--color-verified)",
  provisional: "var(--color-provisional)",
  disputed: "var(--color-disputed)",
  unavailable: "var(--color-gap)",
};

const STATES: FieldState[] = ["verified", "provisional", "disputed", "unavailable"];

/**
 * The numbers. Every figure is read from `getCoverageStats()` — a count of the
 * documents this repository actually holds, never a forecast, never a price
 * and never a hard-coded marketing figure.
 */
export function DataDeskModule({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const stats = getCoverageStats();

  const figures = [
    { label: dict.dataDesk.fighterFiles, value: stats.fighterFiles },
    { label: dict.dataDesk.eventFiles, value: stats.eventFiles },
    { label: dict.dataDesk.sourceRefs, value: stats.sourceRefs },
    { label: dict.dataDesk.fieldsTracked, value: stats.fieldsTracked },
  ];

  const unsettled = stats.fieldsTracked - stats.byState.verified;

  return (
    <section aria-labelledby="numbers" className="border-b border-rule-strong">
      <Container className="py-12 md:py-14">
        <SectionHeading
          id="numbers"
          title={dict.home.numbersTitle}
          note={dict.home.numbersDek}
          action={
            <ActionLink href={routes.dataDesk(locale)}>
              {dict.nav.dataDesk}
            </ActionLink>
          }
        />

        <div className="mt-6 grid items-start gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-12">
          <dl className="grid grid-cols-2 gap-px border border-rule-strong bg-rule-strong md:grid-cols-4">
            {figures.map((figure) => (
              <div key={figure.label} className="bg-card px-5 pb-5 pt-6">
                <dd className="display text-[44px] leading-[0.9] text-ink md:text-[62px]">
                  <CountUp value={figure.value} />
                </dd>
                <dt className="label-mono-sm mt-3 tracking-[0.16em] text-ink-muted">
                  {figure.label}
                </dt>
              </div>
            ))}
          </dl>

          <div>
            <h3 className="label-mono-sm inline-flex bg-signal px-2.5 py-[5px] font-semibold tracking-[0.18em] text-ink">
              {dict.home.markingTitle}
            </h3>

            <ul className="mt-4 flex flex-col gap-3">
              {STATES.map((state) => {
                const count = stats.byState[state];
                const pct = stats.fieldsTracked
                  ? (count / stats.fieldsTracked) * 100
                  : 0;

                return (
                  <li key={state}>
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="label-mono-sm tracking-[0.14em] text-ink-muted">
                        {dict.fieldStates[state]}
                      </span>
                      <span className="font-mono text-sm font-semibold text-ink">
                        {count}
                      </span>
                    </div>
                    <div className="mt-[7px] h-1.5 overflow-hidden bg-rule">
                      <div
                        className="h-full origin-left animate-wipe-slow"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: STATE_FILL[state],
                        }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>

            <p className="mt-5 text-[13px] leading-relaxed text-ink-muted">
              {dict.home.markingNote(unsettled, stats.fieldsTracked)}
            </p>
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
    <p className="flex flex-wrap items-center gap-x-3 gap-y-1.5 border border-rule-strong bg-card px-4 py-3">
      <span className="label-mono-sm bg-signal px-1.5 py-0.5 font-semibold text-ink">
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
          className="label-mono-sm text-ink-muted underline decoration-rule-strong underline-offset-[3px] hover:text-ink hover:decoration-ink"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
