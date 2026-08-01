import Link from "next/link";
import { Container, Kicker } from "@/components/ui/primitives";
import { getDictionary } from "@/i18n";
import { routes } from "@/lib/paths";
import { DEFAULT_LOCALE } from "@/lib/types";

/**
 * `notFound()` unwinds past the route segment, so the locale param is not
 * available here. The default locale is used and both languages are offered.
 */
export default function LocaleNotFound() {
  const dict = getDictionary(DEFAULT_LOCALE);
  const cs = getDictionary("cs");

  return (
    <Container className="py-20 md:py-28">
      <div className="max-w-xl">
        <Kicker>404</Kicker>
        <h1 className="mt-4 text-[2rem] leading-[1.08] tracking-[-0.04em] text-ink md:text-[2.75rem]">
          {dict.notFound.title}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-ink-muted">
          {dict.notFound.body}
        </p>
        <p className="mt-3 text-base leading-relaxed text-muted" lang="cs">
          {cs.notFound.body}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={routes.home("en")}
            className="label-mono rounded-[6px] bg-ink px-4 py-2.5 text-white hover:bg-graphite"
          >
            {dict.actions.backHome}
          </Link>
          <Link
            href={routes.home("cs")}
            lang="cs"
            className="label-mono rounded-[6px] border border-rule-strong px-4 py-2.5 text-ink hover:border-ink"
          >
            {cs.actions.backHome}
          </Link>
        </div>
      </div>
    </Container>
  );
}
