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
    <div className={`mx-auto w-full max-w-[90rem] px-5 md:px-10 ${className}`}>
      {children}
    </div>
  );
}

type ChipTone =
  | "default"
  | "ink"
  | "signal"
  | "muted"
  | "dark"
  | "ember"
  | "success"
  | "warning"
  | "danger";

const CHIP_TONE: Record<ChipTone, string> = {
  default: "border-rule-strong text-ink bg-white",
  ink: "border-ink text-white bg-ink",
  // Lime is a fill only; the text on it is always ink.
  signal: "border-signal text-ink bg-signal",
  muted: "border-rule-strong text-ink-muted bg-transparent",
  dark: "border-rule-dark text-paper bg-ink",
  ember: "border-ink text-white bg-ink",
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
      className={`label-mono-sm inline-flex items-center gap-1.5 border px-2 py-1 font-semibold ${CHIP_TONE[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

/** Solid promotion badge. The colour arrives as a fill, never as text. */
export function PromotionBadge({
  label,
  accent,
  className = "",
}: {
  label: string;
  accent: string;
  className?: string;
}) {
  return (
    <span
      style={{ backgroundColor: accent }}
      className={`inline-flex items-center px-2.5 py-1.5 text-[11px] font-extrabold uppercase leading-none tracking-[0.16em] text-white ${className}`}
    >
      {label}
    </span>
  );
}

/** Uppercase mono kicker with an ink tick. Used above headlines and sections. */
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
        tone === "paper" ? "text-paper-meta" : "text-ink-meta"
      } ${className}`}
    >
      <span
        aria-hidden="true"
        className={`block h-[2px] w-4 ${tone === "paper" ? "bg-paper-meta" : "bg-ink"}`}
      />
      {children}
    </span>
  );
}

/**
 * Section rule: an Anton title, an optional mono note beside it, and an
 * optional action on the right. `dek` sits under the title for the interior
 * pages, which have not been redesigned yet.
 */
export function SectionHeading({
  id,
  kicker,
  title,
  note,
  dek,
  action,
  tone = "ink",
}: {
  id?: string;
  kicker?: string;
  title: string;
  note?: string;
  dek?: string;
  action?: ReactNode;
  tone?: "ink" | "paper";
}) {
  return (
    <div
      className={`flex flex-col gap-3 border-b pb-3.5 sm:flex-row sm:items-end sm:justify-between sm:gap-6 ${
        tone === "paper" ? "border-rule-dark" : "border-rule-strong"
      }`}
    >
      <div className="min-w-0">
        {kicker ? <Kicker tone={tone}>{kicker}</Kicker> : null}
        <div className="flex flex-wrap items-baseline gap-x-3.5 gap-y-1.5">
          <h2
            id={id}
            className={`display text-[26px] leading-none md:text-[30px] ${
              tone === "paper" ? "text-white" : "text-ink"
            } ${kicker ? "mt-2.5" : ""}`}
          >
            {title}
          </h2>
          {note ? (
            <span
              className={`label-mono-sm ${
                tone === "paper" ? "text-paper-meta" : "text-ink-meta"
              }`}
            >
              {note}
            </span>
          ) : null}
        </div>
        {dek ? (
          <p
            className={`mt-2 max-w-2xl text-[0.9375rem] leading-relaxed ${
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

/** Text link with the arrow the site uses for every onward action. */
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
      className={`group inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.12em] ${
        tone === "paper" ? "text-paper-muted hover:text-white" : "text-ink-muted hover:text-ink"
      } ${className}`}
    >
      {children}
      <span
        aria-hidden="true"
        className="inline-block transition-transform duration-150 group-hover:translate-x-0.5"
      >
        →
      </span>
    </Link>
  );
}

/** Solid or outlined call to action. The hero uses one of each. */
export function ButtonLink({
  href,
  children,
  variant = "solid",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "solid" | "outline";
  className?: string;
}) {
  const base =
    "inline-flex items-center gap-2.5 text-[13px] uppercase tracking-[0.12em] transition-colors";
  const styles =
    variant === "solid"
      ? "bg-ink px-6 py-4 font-extrabold text-white hover:bg-ufc"
      : "border border-ink px-[1.375rem] py-[0.875rem] font-bold text-ink hover:bg-ink hover:text-white";

  return (
    <Link href={href} className={`${base} ${styles} ${className}`}>
      {children}
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
          tone === "paper" ? "text-paper-meta" : "text-ink-meta"
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
    <span className="label-mono-sm inline-flex items-center gap-1.5 text-gap">
      <span aria-hidden="true" className="block h-px w-3 bg-gap" />
      {label}
    </span>
  );
}
