import { siteConfig } from "@/config/site";

export function BrandLockup({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-[11px] text-text-inverse">
      <span
        aria-hidden="true"
        className={`${compact ? "h-[22px]" : "h-[26px]"} block w-[5px] -skew-x-12 bg-accent-on-dark`}
      />
      <span
        className={`${compact ? "text-[21px]" : "text-[26px]"} display whitespace-nowrap leading-[var(--leading-display-tight)] tracking-[0.01em]`}
      >
        {siteConfig.wordmark}
      </span>
    </span>
  );
}
