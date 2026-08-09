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

function StoryKicker({ article, locale }: { article: Article; locale: Locale }) {
  const dict = getDictionary(locale);
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Kicker tone="paper">
        {article.organization
          ? dict.organizationsShort[article.organization]
          : dict.labels.desk}
      </Kicker>
      {article.isDemo ? <NoteChip>{dict.article.demoBadge}</NoteChip> : null}
    </div>
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
  const local = copy(article, locale);
  const secondaries = secondary.filter((story) => story.slug !== article.slug).slice(0, 2);

  return (
    <section aria-labelledby="lead-story" className="bg-chrome text-text-inverse">
      <Container className="py-12 md:py-16">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 xl:grid-cols-[7fr_5fr]">
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
            {article.image ? (
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-2/5"
                style={{
                  background:
                    "linear-gradient(180deg, transparent 0%, color-mix(in srgb, var(--color-chrome) 65%, transparent) 55%, var(--color-chrome) 100%)",
                }}
              />
            ) : null}
          </Link>

          <div className="flex flex-col justify-center">
            <StoryKicker article={article} locale={locale} />
            <h1
              id="lead-story"
              className="display mt-4 max-w-[14ch] text-[length:var(--text-d1)] text-text-inverse lg:text-[length:var(--text-d2)] xl:text-[length:var(--text-d1)]"
            >
              <Link
                href={routes.article(locale, article.slug)}
                className="underline decoration-transparent decoration-[3px] underline-offset-4 hover:decoration-accent-on-dark"
              >
                {local.title}
              </Link>
            </h1>
            <p className="mt-5 max-w-[46ch] text-[17px] leading-[1.5] text-text-inverse-muted md:text-[20px]">
              {local.dek}
            </p>
            <time
              dateTime={article.publishAt}
              className="mt-6 font-mono text-[12px] tabular-nums text-text-inverse-meta"
            >
              {formatDate(article.publishAt, locale)}
            </time>
          </div>
        </div>

        {secondaries.length > 0 ? (
          <div className="mt-8 grid border-t border-rule-dark pt-8 md:grid-cols-2">
            {secondaries.map((story, index) => {
              const storyCopy = copy(story, locale);
              return (
                <article
                  key={story.id}
                  className={`py-5 first:pt-0 last:pb-0 md:py-0 ${
                    index === 1 ? "border-t border-rule-dark md:border-l md:border-t-0 md:pl-8" : "md:pr-8"
                  }`}
                >
                  <StoryKicker article={story} locale={locale} />
                  <h2 className="display mt-3 text-[length:var(--text-d3)] text-text-inverse">
                    <Link
                      href={routes.article(locale, story.slug)}
                      className="underline decoration-transparent decoration-[3px] underline-offset-4 hover:decoration-accent-on-dark"
                    >
                      {storyCopy.title}
                    </Link>
                  </h2>
                  <time
                    dateTime={story.publishAt}
                    className="mt-4 block font-mono text-[12px] tabular-nums text-text-inverse-meta"
                  >
                    {formatDate(story.publishAt, locale)}
                  </time>
                </article>
              );
            })}
          </div>
        ) : null}
      </Container>
    </section>
  );
}
