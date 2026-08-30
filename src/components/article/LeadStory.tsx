import Link from "next/link";
import { PhotoSlot } from "@/components/media/PhotoSlot";
import { Container, Kicker, NoteChip } from "@/components/ui/primitives";
import { getDictionary } from "@/i18n";
import { formatDate } from "@/lib/format";
import { routes } from "@/lib/paths";
import type { Article, Locale } from "@/lib/types";

function copy(article: Article, locale: Locale) {
  return article.localizations[locale] ?? article.localizations.cs!;
}

/**
 * Display type only goes over a photograph. Deterministic `svg` artwork is a
 * data illustration, and a headline across it reads as a caption on a chart,
 * so those days get the designed side-by-side band instead.
 */
function isCoverPhoto(article: Article): boolean {
  return Boolean(article.image) && article.image?.origin !== "svg";
}

function StoryKicker({
  article,
  locale,
  lead = false,
}: {
  article: Article;
  locale: Locale;
  lead?: boolean;
}) {
  const dict = getDictionary(locale);
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Kicker tone="paper">
        {article.organization
          ? dict.organizationsShort[article.organization]
          : dict.labels.desk}
      </Kicker>
      {lead ? (
        <>
          <span aria-hidden="true" className="h-3 w-px bg-rule-dark" />
          <span className="label-mono text-text-inverse-meta">{dict.home.leadKicker}</span>
        </>
      ) : null}
      {article.isDemo ? <NoteChip>{dict.article.demoBadge}</NoteChip> : null}
    </div>
  );
}

/** Kicker, headline, dek and date — identical copy for both lead treatments. */
function LeadCopy({ article, locale }: { article: Article; locale: Locale }) {
  const local = copy(article, locale);
  return (
    <>
      <StoryKicker article={article} locale={locale} lead />
      <h1
        id="lead-story"
        className="display mt-4 max-w-[16ch] text-[length:var(--text-d1)] text-text-inverse"
      >
        <Link
          href={routes.article(locale, article.slug)}
          className="headline-link"
        >
          {local.title}
        </Link>
      </h1>
      <p className="mt-5 max-w-[46ch] text-[length:var(--text-base)] leading-[1.5] text-text-inverse-muted md:text-[length:var(--text-lg)]">
        {local.dek}
      </p>
      <time
        dateTime={article.publishAt}
        className="label-mono mt-6 block text-text-inverse-meta"
      >
        {formatDate(article.publishAt, locale)}
      </time>
    </>
  );
}

export function LeadStory({
  article,
  locale,
  secondary = [],
}: {
  article: Article;
  locale: Locale;
  secondary?: Article[];
}) {
  const dict = getDictionary(locale);
  const secondaries = secondary.filter((story) => story.slug !== article.slug).slice(0, 2);
  const cover = isCoverPhoto(article);

  return (
    <section aria-labelledby="lead-story" className="bg-chrome text-text-inverse">
      {cover ? (
        /* Poster cover. One grid cell holds both layers, so at lg+ the copy
         * sits on the photograph's lower edge; below lg the two stack and no
         * text is ever cramped over a phone-sized crop. */
        <div className="lg:grid lg:grid-cols-1 lg:grid-rows-1">
          <Link
            href={routes.article(locale, article.slug)}
            className="relative block aspect-[4/3] overflow-hidden bg-chrome-raised sm:aspect-[16/9] lg:aspect-auto lg:min-h-[34rem] lg:[grid-area:1/1]"
          >
            <PhotoSlot
              image={article.image}
              locale={locale}
              note={dict.labels.photoSlots.lead}
              sizes="100vw"
              priority
              tone="chrome"
              creditMode="overlay"
            />
          </Link>

          <div className="relative lg:z-10 lg:self-end lg:[grid-area:1/1]">
            {/* The scrim is painted behind the copy rather than at a fixed
             * height on the photo, so however tall a Czech headline runs it
             * always lands on ≥88% chrome — 4.8:1 against the brightest
             * photograph we could be sent, before the ramp goes solid. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 hidden lg:block"
              style={{
                background:
                  "linear-gradient(180deg, transparent 0%, color-mix(in srgb, var(--color-chrome) 88%, transparent) 26%, var(--color-chrome) 78%)",
              }}
            />
            <Container className="relative py-10 lg:pb-14 lg:pt-28">
              <LeadCopy article={article} locale={locale} />
            </Container>
          </div>
        </div>
      ) : (
        /* No photograph, or deterministic artwork: a designed band, never an
         * overlay. */
        <Container className="py-12 md:py-16">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12 xl:grid-cols-[7fr_5fr]">
            <Link
              href={routes.article(locale, article.slug)}
              className="relative block aspect-[3/2] overflow-hidden bg-chrome-raised"
            >
              <PhotoSlot
                image={article.image}
                locale={locale}
                note={dict.labels.photoSlots.lead}
                sizes="(min-width: 1280px) 58vw, (min-width: 1024px) 50vw, 100vw"
                priority
                tone="chrome"
                creditMode="overlay"
              />
            </Link>
            <div>
              <LeadCopy article={article} locale={locale} />
            </div>
          </div>
        </Container>
      )}

      {secondaries.length > 0 ? (
        <Container className="pb-12 md:pb-16">
          <div className="grid border-t border-rule-dark pt-8 md:grid-cols-2">
            {secondaries.map((story, index) => {
              const storyCopy = copy(story, locale);
              const thumbnail = story.image?.thumbnailSrc ?? story.image?.src;
              return (
                <article
                  key={story.id}
                  className={`py-6 first:pt-0 last:pb-0 md:py-0 ${
                    index === 1
                      ? "border-t border-rule-dark md:border-l md:border-t-0 md:pl-8"
                      : "md:pr-8"
                  }`}
                >
                  <div className="flex gap-4">
                    {thumbnail ? (
                      <Link
                        href={routes.article(locale, story.slug)}
                        className="relative block aspect-video w-28 shrink-0 overflow-hidden bg-chrome-raised sm:w-36"
                      >
                        <PhotoSlot
                          image={story.image}
                          locale={locale}
                          note={dict.labels.photoSlots.story}
                          sizes="(min-width: 640px) 144px, 112px"
                          useThumbnail
                          tone="chrome"
                        />
                      </Link>
                    ) : null}
                    <div className="min-w-0">
                      <StoryKicker article={story} locale={locale} />
                      <h2 className="display mt-2.5 text-[length:var(--text-d5)] text-text-inverse">
                        <Link
                          href={routes.article(locale, story.slug)}
                          className="headline-link"
                        >
                          {storyCopy.title}
                        </Link>
                      </h2>
                      <time
                        dateTime={story.publishAt}
                        className="label-mono mt-3 block text-text-inverse-meta"
                      >
                        {formatDate(story.publishAt, locale)}
                      </time>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </Container>
      ) : null}
    </section>
  );
}
