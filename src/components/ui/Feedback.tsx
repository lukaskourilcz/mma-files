import { getDictionary } from "@/i18n";
import type { Locale } from "@/lib/types";

function SkeletonBlock({ className }: { className: string }) {
  return <span className={`block animate-skeleton bg-well ${className}`} />;
}

export function FeedRowSkeleton({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  return (
    <div aria-busy="true" className="py-4">
      <span className="sr-only">{dict.states.loading}</span>
      <div
        aria-hidden="true"
        className="grid grid-cols-[96px_minmax(0,1fr)] gap-3 md:grid-cols-[160px_minmax(0,1fr)_64px] md:gap-5"
      >
        <SkeletonBlock className="aspect-video w-24 md:h-[90px] md:w-40" />
        <div className="space-y-3 py-1">
          <SkeletonBlock className="h-3.5 w-3/5" />
          <SkeletonBlock className="h-2.5 w-9/10" />
        </div>
        <SkeletonBlock className="hidden h-3 w-16 md:block" />
      </div>
    </div>
  );
}

export function BoardSkeleton({ locale, tone = "paper" }: { locale: Locale; tone?: "paper" | "chrome" }) {
  const dict = getDictionary(locale);
  const fill = tone === "chrome" ? "bg-chrome-raised" : "bg-well";
  return (
    <div aria-busy="true">
      <span className="sr-only">{dict.states.loading}</span>
      <div aria-hidden="true" className="space-y-5">
        <span className={`block h-6 w-[180px] animate-skeleton ${fill}`} />
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="grid grid-cols-[1fr_96px_48px] gap-4">
            <span className={`h-3 animate-skeleton ${fill}`} />
            <span className={`h-3 animate-skeleton ${fill}`} />
            <span className={`h-3 animate-skeleton ${fill}`} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function EmptyState({ children, className = "" }: { children: string; className?: string }) {
  return (
    <p
      className={`border border-dashed border-rule-dashed px-8 py-8 text-center font-mono text-[12px] font-medium uppercase tracking-[0.14em] text-text-meta ${className}`}
    >
      {children}
    </p>
  );
}
