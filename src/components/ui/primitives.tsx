import Link from "next/link";
import type { ReactNode } from "react";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[84rem] px-5 md:px-8 ${className}`}>
      {children}
    </div>
  );
}

type ChipTone = "default" | "ember" | "muted" | "dark" | "success" | "warning" | "danger";

const CHIP_TONE: Record<ChipTone, string> = {
  default: "border-rule-strong text-ink bg-white",
  ember: "border-ember/35 text-ember bg-ember-soft",
  muted: "border-rule-strong text-ink-muted bg-transparent",
  dark: "border-rule-dark-strong text-paper bg-graphite",
  success: "border-success/30 text-success bg-success/8",
  warning: "border-warning/30 text-warning bg-warning/8",
  danger: "border-danger/30 text-danger bg-danger/8",
};

/** Small mono label with a hairline box — the site's unit of metadata. */
export function Chip({
  children,
  tone = "default",
  className = "",
}: {
  children: ReactNode;
  tone?: ChipTone;
  className?: string;
}) {
  return (
    <span
      className={`label-mono-sm inline-flex items-center gap-1.5 rounded-[6px] border px-2 py-1 ${CHIP_TONE[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

/** Uppercase mono kicker with an ember tick. Used above headlines and sections. */
export function Kicker({
  children,
  tone = "ink",
  className = "",
}: {
  children: ReactNode;
  tone?: "ink" | "paper";
  className?: string;
}) {
  return (
    <span
      className={`label-mono inline-flex items-center gap-2 ${
        tone === "paper" ? "text-paper-muted" : "text-ink-muted"
      } ${className}`}
    >
      <span aria-hidden="true" className="block h-[2px] w-4 bg-ember" />
      {children}
    </span>
  );
}

export function SectionHeading({
  kicker,
  title,
  dek,
  action,
  tone = "ink",
}: {
  kicker?: string;
  title: string;
  dek?: string;
  action?: ReactNode;
  tone?: "ink" | "paper";
}) {
  return (
    <div
      className={`flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-end sm:justify-between ${
        tone === "paper" ? "border-rule-dark" : "border-rule-strong"
      }`}
    >
      <div className="max-w-2xl">
        {kicker ? <Kicker tone={tone}>{kicker}</Kicker> : null}
        <h2
          className={`mt-2.5 text-2xl md:text-[1.75rem] ${
            tone === "paper" ? "text-white" : "text-ink"
          }`}
        >
          {title}
        </h2>
        {dek ? (
          <p
            className={`mt-2 text-[0.9375rem] leading-relaxed ${
              tone === "paper" ? "text-paper-muted" : "text-ink-muted"
            }`}
          >
            {dek}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

/** Text link with the ember arrow the site uses for every onward action. */
export function ActionLink({
  href,
  children,
  tone = "ink",
  className = "",
}: {
  href: string;
  children: ReactNode;
  tone?: "ink" | "paper";
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`label-mono group inline-flex items-center gap-2 ${
        tone === "paper" ? "text-white" : "text-ink"
      } hover:text-ember ${className}`}
    >
      {children}
      <span
        aria-hidden="true"
        className="inline-block text-ember transition-transform duration-150 group-hover:translate-x-0.5"
      >
        →
      </span>
    </Link>
  );
}

/** Definition row used across the file panels: mono key, readable value. */
export function DataRow({
  label,
  children,
  tone = "ink",
}: {
  label: string;
  children: ReactNode;
  tone?: "ink" | "paper";
}) {
  return (
    <div
      className={`flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b py-2.5 last:border-b-0 ${
        tone === "paper" ? "border-rule-dark" : "border-rule"
      }`}
    >
      <dt
        className={`label-mono-sm ${
          tone === "paper" ? "text-paper-muted" : "text-ink-muted"
        }`}
      >
        {label}
      </dt>
      <dd
        className={`text-right text-sm font-medium ${
          tone === "paper" ? "text-white" : "text-ink"
        }`}
      >
        {children}
      </dd>
    </div>
  );
}

/** Explicit gap. Never a zero, never an em dash pretending to be data. */
export function MissingValue({ label }: { label: string }) {
  return (
    <span className="label-mono-sm inline-flex items-center gap-1.5 text-muted">
      <span aria-hidden="true" className="block h-[1px] w-3 bg-muted" />
      {label}
    </span>
  );
}
