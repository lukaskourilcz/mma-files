"use client";

import { useRef, useState } from "react";
import { ArticleRow } from "@/components/article/ArticleRow";
import { WeekDivider, WeekPagination } from "@/components/article/WeekPagination";
import { getDictionary } from "@/i18n";
import type { Locale, Organization } from "@/lib/types";
import { isWeekArticleCard, type WeekArticleCard } from "@/lib/week-chunks";
import { formatWeekRangeLabel } from "@/lib/week-windows.mjs";

interface LoadedWeek {
  key: string;
  articles: WeekArticleCard[];
}

export interface WeekHistoryProps {
  locale: Locale;
  initialWeekKey: string;
  availableWeekKeys: string[];
  referenceTime: string;
  organization?: Organization;
  blockLimit: number;
}

async function json(url: string): Promise<unknown> {
  const response = await fetch(url, { cache: "force-cache" });
  if (!response.ok) throw new Error(`week fetch failed: ${response.status}`);
  return response.json();
}

export function WeekHistory({
  locale,
  initialWeekKey,
  availableWeekKeys,
  referenceTime,
  organization,
  blockLimit,
}: WeekHistoryProps) {
  const dict = getDictionary(locale);
  const indexRef = useRef<string[] | null>(null);
  const [loaded, setLoaded] = useState<LoadedWeek[]>([]);
  const [cursor, setCursor] = useState(0);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const knownKeys = indexRef.current ?? availableWeekKeys;
  const hasMore = cursor < knownKeys.length - 1;

  async function loadPrevious(): Promise<void> {
    if (loading || !hasMore) return;
    setLoading(true);
    setFailed(false);

    try {
      let orderedKeys = indexRef.current;
      if (!orderedKeys) {
        const index = await json("/data/weeks/index.json");
        if (!Array.isArray(index) || !index.every((key) => typeof key === "string")) {
          throw new Error("invalid week index");
        }
        const available = new Set(availableWeekKeys);
        orderedKeys = index.filter((key) => available.has(key));
        if (orderedKeys[0] !== initialWeekKey) throw new Error("week index does not match server window");
        indexRef.current = orderedKeys;
      }

      let nextCursor = cursor;
      while (nextCursor < orderedKeys.length - 1) {
        nextCursor += 1;
        const key = orderedKeys[nextCursor];
        if (!key) break;
        const payload = await json(`/data/weeks/${encodeURIComponent(key)}.json`);
        if (!Array.isArray(payload) || !payload.every(isWeekArticleCard)) {
          throw new Error(`invalid week chunk: ${key}`);
        }
        const articles = payload
          .filter((article) => !organization || article.org === organization)
          .slice(0, blockLimit);
        if (articles.length === 0) continue;
        setLoaded((weeks) => [...weeks, { key, articles }]);
        break;
      }
      setCursor(nextCursor);
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }

  const exhausted = loaded.length > 0 && !hasMore;

  return (
    <div>
      {loaded.map((week) => (
        <section key={week.key} aria-label={formatWeekRangeLabel(week.key, "cs-CZ")}>
          <WeekDivider label={formatWeekRangeLabel(week.key, "cs-CZ")} />
          <ol>
            {week.articles.map((article) => (
              <ArticleRow
                key={article.slug}
                article={article}
                locale={locale}
                referenceTime={referenceTime}
              />
            ))}
          </ol>
        </section>
      ))}
      <WeekPagination
        locale={locale}
        hasMore={hasMore}
        loading={loading}
        onLoad={() => void loadPrevious()}
      />
      {failed ? (
        <p role="alert" className="mt-4 font-mono text-[12px] text-accent">
          {dict.states.loadPreviousFailed}
        </p>
      ) : null}
      {exhausted ? (
        <p aria-live="polite" className="mt-6 text-center font-mono text-[12px] text-text-meta">
          {dict.home.endOfFeed}
        </p>
      ) : null}
    </div>
  );
}
