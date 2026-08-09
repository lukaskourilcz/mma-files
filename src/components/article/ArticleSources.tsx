import { getDictionary } from "@/i18n";
import type { Locale, Source } from "@/lib/types";

function publicLabel(source: Source): string {
  if (source.publisher && source.title) return `${source.publisher} · ${source.title}`;
  return source.title ?? source.publisher ?? source.url ?? "";
}

export function ArticleSources({ sources, locale }: { sources: Source[]; locale: Locale }) {
  const dict = getDictionary(locale);
  if (sources.length === 0) return null;
  return (
    <section aria-labelledby="article-sources" className="mt-14 border-t border-rule-strong pt-8">
      <h2 id="article-sources" className="display text-[length:var(--text-d4)] text-text">
        {dict.article.sources}
      </h2>
      <ol className="mt-6 space-y-4">
        {sources.map((source, index) => (
          <li
            key={`${source.url ?? source.ref ?? "source"}-${index}`}
            className="grid grid-cols-[28px_minmax(0,1fr)] gap-3 border-b border-rule pb-4 last:border-b-0"
          >
            <span className="font-mono text-[12px] tabular-nums text-text-meta">
              {String(index + 1).padStart(2, "0")}
            </span>
            {source.url ? (
              <a
                href={source.url}
                target="_blank"
                rel="nofollow noopener"
                className="break-words text-[15px] text-text underline decoration-accent underline-offset-4 hover:decoration-2"
              >
                {publicLabel(source)}
              </a>
            ) : (
              <span>
                <span className="block text-[15px] text-text">{source.title ?? source.ref}</span>
                <span className="mt-1 block font-mono text-[12px] text-text-meta">
                  {source.kind === "internal" ? dict.labels.internal : dict.labels.external}
                </span>
              </span>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
