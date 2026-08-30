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
  | "dark";

const CHIP_TONE: Record<ChipTone, string> = {
  default: "border-rule-strong text-text bg-card",
  ink: "border-text text-paper bg-text",
  signal: "border-accent text-paper bg-accent",
  muted: "border-rule-strong text-text-muted bg-transparent",
  dark: "border-rule-dark text-text-inverse bg-chrome",
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

/**
 * Solid promotion badge. The colour arrives as a fill, never as text.
 *
 * The fill is the promotion colour taken down a step: white on the amber at
 * full strength is 4.4:1, which is under the floor for a label this small.
 * Darkening clears 4.5:1 for both promotions and still reads as red and amber.
 */
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
      className={`inline-flex items-center px-2 py-[5px] font-mono text-[10px] font-semibold uppercase leading-none tracking-[0.16em] text-white ${className}`}
    >
      {label}
    </span>
  );
}

/** Uppercase mono kicker. Organisation identity stays typographic here. */
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
      className={`inline-flex font-mono text-[11px] font-medium uppercase tracking-[var(--tracking-kicker)] ${
        tone === "paper" ? "text-accent-on-dark" : "text-accent"
      } ${className}`}
    >
      {children}
    </span>
  );
}

/**
 * The site's only section masthead — homepage bands and interior pages alike.
 *
 * An Anton title sitting on the 3px accent rule, the section's own dek under
 * it, an optional mono note, and an optional action on the right.
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
  const onDark = tone === "paper";
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
      <div className="min-w-0">
        {kicker ? (
          <div className="mb-2.5">
            <Kicker tone={tone}>{kicker}</Kicker>
          </div>
        ) : null}
        <h2
          id={id}
          className={`display inline-block border-b-[3px] pb-2 text-[length:var(--text-d4)] ${
            onDark ? "border-accent-on-dark text-text-inverse" : "border-accent text-text"
          }`}
        >
          {title}
        </h2>
        {dek ? (
          <p
            className={`mt-3 max-w-[60ch] text-[length:var(--text-sm)] leading-relaxed ${
              onDark ? "text-text-inverse-muted" : "text-text-muted"
            }`}
          >
            {dek}
          </p>
        ) : null}
        {note ? (
          <p className={`label-mono mt-3 ${onDark ? "text-text-inverse-meta" : "text-text-meta"}`}>
            {note}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
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
      className={`inline-flex min-h-11 items-center gap-2 text-[12px] font-bold uppercase tracking-[0.12em] underline decoration-transparent decoration-[3px] underline-offset-4 hover:decoration-accent ${
        tone === "paper" ? "text-text-inverse-muted" : "text-text-muted"
      } ${className}`}
    >
      {children}
      <span
        aria-hidden="true"
        className="inline-block"
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
  variant = "primary",
  tone = "paper",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "solid" | "outline";
  tone?: "paper" | "chrome";
  className?: string;
}) {
  const primary = variant === "primary" || variant === "solid";
  const base =
    "inline-flex min-h-12 items-center justify-center gap-2.5 px-6 py-4 text-[13px] font-extrabold uppercase tracking-[0.1em] transition-colors";
  const styles =
    primary
      ? "bg-accent text-paper hover:bg-accent-press"
      : tone === "chrome"
        ? "border border-text-inverse text-text-inverse hover:bg-text-inverse hover:text-chrome"
        : "border border-text text-text hover:bg-text hover:text-paper";

  return (
    <Link href={href} className={`${base} ${styles} ${className}`}>
      {children}
    </Link>
  );
}

export function NoteChip({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex bg-note px-2 py-1 font-mono text-[10px] font-semibold uppercase leading-none tracking-[0.16em] text-note-ink ${className}`}
    >
      {children}
    </span>
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
          tone === "paper" ? "text-text-inverse-meta" : "text-text-meta"
        }`}
      >
        {label}
      </dt>
      <dd
        className={`text-right text-sm font-medium ${
          tone === "paper" ? "text-text-inverse" : "text-text"
        }`}
      >
        {children}
      </dd>
    </div>
  );
}
