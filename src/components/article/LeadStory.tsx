import Link from "next/link";
import { HeroVisual } from "@/components/hero/HeroVisual";
import { Chip, Container } from "@/components/ui/primitives";
import { getDictionary } from "@/i18n";
import { formatDate, readingTimeMinutes } from "@/lib/format";
import { routes } from "@/lib/paths";
import type { Article, Locale } from "@/lib/types";

/** The one dominant story: a dark feature band with the file's own hero. */
export function LeadStory({
  article,
  locale,
}: {
  article: Article;
  locale: Locale;
}) {
  const dict = getDictionary(locale);
  const local = article.localizations[locale];
  const minutes = readingTimeMinutes(local.body);

  return (
    <section className="bg-ink text-white" aria-labelledby="lead-story">
      <Container className="py-10 md:py-16">
        <div className="grid items-center gap-8 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-6 lg:col-span-5">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="label-mono inline-flex items-center gap-2 text-ember">
                <span aria-hidden="true" className="block h-[2px] w-4 bg-ember" />
                {dict.home.leadKicker}
              </span>
              <Chip tone="dark">{dict.formats[article.format]}</Chip>
              {article.organization ? (
                <Chip tone="dark">
                  {dict.organizationsShort[article.organization]}
                </Chip>
              ) : null}
            </div>

            <h1
              id="lead-story"
              className="mt-5 text-[2rem] leading-[1.05] tracking-[-0.04em] text-white sm:text-[2.5rem] lg:text-[3rem]"
            >
              <Link
                href={routes.article(locale, article.slug)}
                className="headline-link"
              >
                {local.title}
              </Link>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-paper-muted md:text-lg">
              {local.dek}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-rule-dark pt-5">
              <Link
                href={routes.article(locale, article.slug)}
                className="label-mono group inline-flex items-center gap-2 rounded-[6px] bg-ember px-4 py-2.5 text-white hover:bg-ember/90"
              >
                {dict.actions.readTheFile}
                <span
                  aria-hidden="true"
                  className="transition-transform duration-150 group-hover:translate-x-0.5"
                >
                  →
                </span>
              </Link>
              <time
                dateTime={article.publishAt}
                className="label-mono-sm text-paper-muted"
              >
                {formatDate(article.publishAt, locale)}
              </time>
              <span className="label-mono-sm text-muted">
                {minutes} {dict.labels.readingTime}
              </span>
            </div>
          </div>

          <div className="md:col-span-6 lg:col-span-7">
            <HeroVisual
              article={article}
              locale={locale}
              className="aspect-[4/3] sm:aspect-[16/10]"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
