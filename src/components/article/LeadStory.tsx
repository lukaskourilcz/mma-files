import Link from "next/link";
import { Countdown } from "@/components/event/Countdown";
import { PhotoSlot } from "@/components/media/PhotoSlot";
import {
  ButtonLink,
  Container,
  PromotionBadge,
} from "@/components/ui/primitives";
import { getDictionary } from "@/i18n";
import { formatDate, readingTimeMinutes } from "@/lib/format";
import { routes } from "@/lib/paths";
import { accentFor } from "@/lib/promotion";
import { getEventById } from "@/lib/repository";
import type { Article, Locale } from "@/lib/types";

/**
 * The lead file: the story on the left, one big 4:5 photograph on the right.
 *
 * The right column is a single link to the same story, so the whole image is
 * one target rather than a picture beside a link. Everything on the plate — the
 * fight, the division, the venue — is read off the event the story points at,
 * so a story with no card attached simply renders fewer lines.
 */
export function LeadStory({
  article,
  locale,
}: {
  article: Article;
  locale: Locale;
}) {
  const dict = getDictionary(locale);
  // Czech is the locale every article has; a card in a language the article was never
  // written in shows its Czech copy rather than an empty tile.
  const local = article.localizations[locale] ?? article.localizations.cs!;
  const minutes = readingTimeMinutes(local.body);
  const accent = accentFor(article.organization);

  const event = article.eventRef ? getEventById(article.eventRef) : undefined;
  const mainBout = event?.bouts.find((bout) => bout.billing === "main");
  const isFightWeek = article.format === "fight-week-preview";

  const stamp = [
    article.fileNumber
      ? `${dict.labels.file} ${String(article.fileNumber).padStart(3, "0")}`
      : null,
    formatDate(article.publishAt, locale, {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    }),
  ]
    .filter(Boolean)
    .join(" · ");

  const boutLine = [
    mainBout ? dict.divisions[mainBout.division] : null,
    mainBout ? `${mainBout.scheduledRounds} × 5:00` : null,
    event ? [event.venue, event.city].filter(Boolean).join(", ") : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <section
      aria-labelledby="lead-story"
      className="relative overflow-hidden border-b border-rule-strong"
      style={{
        background:
          "radial-gradient(1100px 520px at 8% -14%, color-mix(in oklch, var(--color-ufc) 10%, transparent), transparent 70%), var(--color-paper)",
      }}
    >
      <div aria-hidden="true" className="grid-rules pointer-events-none absolute inset-0" />

      <Container className="relative grid items-start gap-10 py-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14 lg:py-[52px] lg:pb-[60px]">
        <div className="animate-rise">
          <div className="flex flex-wrap items-center gap-3">
            {article.organization ? (
              <PromotionBadge
                label={dict.organizationsShort[article.organization]}
                accent={accent}
              />
            ) : null}
            {isFightWeek ? (
              <span className="label-mono-sm bg-signal px-2.5 py-1.5 font-semibold tracking-[0.18em] text-ink">
                {dict.home.fightWeekTag}
              </span>
            ) : null}
            <span aria-hidden="true" className="h-3.5 w-px bg-rule-strong" />
            <span className="label-mono-sm tracking-[0.18em] text-ink-meta">{stamp}</span>
          </div>

          <h1
            id="lead-story"
            // One value, not one per locale. The split existed because English capitals have
            // nothing above the cap height — but a Czech fighter's name does, in any locale, and
            // this desk writes in Czech now. Measured on the live page at 76px: the carons in
            // "TŘI ZÁVĚREČNOU" reach 83.6px from the baseline against a line box of exactly
            // 83.6px, so the marks sat on the row above with nothing between them. 1.24 leaves
            // about ten pixels of air at the largest step and scales with the clamp.
            className="display mt-5 max-w-[15ch] text-[40px] leading-[1.24] text-ink sm:text-[56px] lg:text-[76px]"
          >
            <Link href={routes.article(locale, article.slug)} className="headline-link">
              {local.title}
            </Link>
          </h1>

          <p className="mt-5 max-w-[56ch] text-[17px] leading-[1.55] text-ink-muted md:text-lg">
            {local.dek}
          </p>

          {/* Black blocks are punctuation. This is the only one above the fold. */}
          {article.heroLine ? (
            <p className="display mt-6 bg-ink px-6 py-[22px] text-[19px] leading-[1.12] text-paper md:text-[23px]">
              “{article.heroLine[locale]}”
            </p>
          ) : null}

          {event ? (
            <div className="mt-6">
              <Countdown
                startsAt={event.startsAt}
                labels={{
                  heading: dict.home.firstBell,
                  days: dict.countdown.days,
                  hrs: dict.countdown.hrs,
                  min: dict.countdown.min,
                  sec: dict.countdown.sec,
                }}
                fallback={formatDate(event.startsAt, locale)}
              />
            </div>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <ButtonLink href={routes.article(locale, article.slug)}>
              {dict.actions.readTheFile}
              <span aria-hidden="true">→</span>
            </ButtonLink>
            {event ? (
              <ButtonLink href={routes.event(locale, event.slug)} variant="outline">
                {dict.actions.fullCard}
              </ButtonLink>
            ) : null}
            <p className="label-mono-sm ml-1 flex items-center gap-[7px] tracking-[0.14em] text-ink-meta">
              <span aria-hidden="true" className="block h-[5px] w-[5px] bg-verified" />
              {minutes} {dict.labels.readingTime}
            </p>
          </div>
        </div>

        <Link
          href={routes.article(locale, article.slug)}
          aria-label={`${dict.actions.readTheFile}: ${local.title}`}
          className="group relative block animate-rise [animation-delay:100ms]"
        >
          <div className="relative aspect-[4/5] overflow-hidden border border-rule-strong">
            <PhotoSlot
              image={article.image}
              locale={locale}
              note={dict.labels.photoSlots.lead}
              sizes="(min-width: 1024px) 48vw, 100vw"
              priority
            />
            <span
              aria-hidden="true"
              style={{ backgroundColor: accent }}
              className="absolute left-0 top-0 z-10 h-1 w-full origin-left animate-wipe"
            />

            {/*
              The plate has to carry white and lime text over whatever is
              behind it — a dark walkout photograph or the pale placeholder —
              so the scrim reaches full ink before the type starts rather than
              fading out under it.
            */}
            <span
              className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-4 p-5 pt-16"
              style={{
                background:
                  "linear-gradient(180deg, transparent 0%, color-mix(in srgb, var(--color-ink) 60%, transparent) 40%, var(--color-ink) 100%)",
              }}
            >
              <span className="block min-w-0">
                <span className="label-mono-sm block tracking-[0.18em] text-signal">
                  {article.fileNumber
                    ? `${dict.labels.file} ${String(article.fileNumber).padStart(3, "0")} · `
                    : ""}
                  {dict.formats[article.format]}
                </span>
                {mainBout ? (
                  <span className="display mt-2 block text-[22px] leading-none text-white md:text-[26px]">
                    {mainBout.red.name} vs. {mainBout.blue.name}
                  </span>
                ) : null}
                {boutLine ? (
                  <span className="label-mono-sm mt-1.5 block text-paper-muted">
                    {boutLine}
                  </span>
                ) : null}
              </span>
              <span
                aria-hidden="true"
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center bg-signal text-[19px] font-extrabold text-ink transition-transform duration-150 group-hover:translate-x-0.5"
              >
                →
              </span>
            </span>
          </div>
        </Link>
      </Container>
    </section>
  );
}
