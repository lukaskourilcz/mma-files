import { ButtonLink, Container } from "@/components/ui/primitives";
import { getDictionary } from "@/i18n";
import { routes } from "@/lib/paths";
import { DEFAULT_LOCALE } from "@/lib/types";

export default function LocaleNotFound() {
  const dict = getDictionary(DEFAULT_LOCALE);
  return (
    <section className="flex min-h-[calc(100dvh-var(--layout-chrome-h-sm)-var(--layout-ticker-h))] items-center bg-chrome py-16 text-text-inverse md:min-h-[calc(100dvh-var(--layout-chrome-h)-var(--layout-ticker-h))]">
      <Container>
        <div className="max-w-xl">
          <p className="font-mono text-[12px] text-accent-on-dark">404</p>
          <h1 className="display mt-4 max-w-[12ch] text-[length:var(--text-d2)] text-text-inverse">
            {dict.notFound.title}
          </h1>
          <div className="mt-8">
            <ButtonLink href={routes.latest(DEFAULT_LOCALE)} variant="secondary" tone="chrome">
              {dict.notFound.back}
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
