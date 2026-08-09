import { getDictionary } from "@/i18n";
import { formatDate } from "@/lib/format";
import type { Correction, Locale } from "@/lib/types";

export function CorrectionNotice({ corrections, locale }: { corrections: Correction[]; locale: Locale }) {
  const dict = getDictionary(locale);
  if (corrections.length === 0) return null;
  const newestFirst = [...corrections].sort((left, right) => right.at.localeCompare(left.at));
  return (
    <section aria-label={dict.article.correction} className="border border-correction-rule bg-correction p-5">
      <ol>
        {newestFirst.map((correction, index) => (
          <li key={`${correction.at}:${index}`} className="border-t border-correction-rule pt-4 first:border-t-0 first:pt-0">
            <div className="flex flex-wrap items-baseline gap-3">
              <h2 className="display text-[18px] text-text">
                {correction.kind === "correction" ? dict.article.correction : dict.labels.update}
              </h2>
              <time dateTime={correction.at} className="font-mono text-[12px] tabular-nums text-text-meta">
                {formatDate(correction.at, locale)}
              </time>
            </div>
            <p className="mt-2 text-[15px] leading-[1.6] text-text">
              {correction.note[locale] ?? correction.note.cs}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
