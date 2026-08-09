"use client";

import { FeedRowSkeleton } from "@/components/ui/Feedback";
import { getDictionary } from "@/i18n";
import type { Locale } from "@/lib/types";

export function WeekDivider({ label }: { label: string }) {
  return (
    <div className="relative my-8 flex items-center justify-center">
      <span aria-hidden="true" className="absolute inset-x-0 top-1/2 h-px bg-rule-strong" />
      <span className="relative bg-paper px-3 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-text-meta">
        {label}
      </span>
    </div>
  );
}

export function WeekPagination({
  locale,
  hasMore,
  loading,
  onLoad,
}: {
  locale: Locale;
  hasMore: boolean;
  loading: boolean;
  onLoad: () => void;
}) {
  const dict = getDictionary(locale);
  if (!hasMore) return null;
  return (
    <div className="mt-6">
      <button
        type="button"
        aria-busy={loading}
        disabled={loading}
        onClick={onLoad}
        className="flex h-14 w-full items-center justify-center border border-text bg-transparent px-5 text-[13px] font-extrabold uppercase tracking-[0.1em] text-text hover:bg-text hover:text-paper disabled:cursor-wait"
      >
        {loading ? dict.states.loadingMore : dict.home.loadPreviousWeek}
      </button>
      {loading ? (
        <div className="divide-y divide-rule">
          {Array.from({ length: 3 }, (_, index) => (
            <FeedRowSkeleton key={index} locale={locale} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
