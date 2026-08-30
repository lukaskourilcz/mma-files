import type { ReactNode } from "react";

/**
 * The deterministic typographic cover.
 *
 * It replaces `HeroVisual`, which shipped four templates reading binding keys
 * (`leftRecord`, `metric1`, `winner`, …) that no delivered package has ever
 * carried, and which nothing imported. Rendering it would have drawn four
 * empty frames.
 *
 * This is one cover instead: oversized Anton on chrome, the red accent, and
 * the mono file stamp. It is never a photograph and never pretends to be one —
 * no stock imagery, no generated likeness, no promotion artwork.
 *
 * Deterministic means deterministic. The only variation comes from `seed`,
 * hashed below; there is no clock and no randomness anywhere in this file, so
 * the same story renders the same cover on every build.
 */

/** FNV-1a. Small, stable, and the same on every machine and every build. */
function hash(seed: string): number {
  let value = 0x811c9dc5;
  for (let index = 0; index < seed.length; index += 1) {
    value ^= seed.charCodeAt(index);
    value = Math.imul(value, 0x01000193) >>> 0;
  }
  return value;
}

/** Two initials from a name, or one where the name is a single word. */
export function monogram(name: string): string {
  return name
    .split(/\s+/u)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => [...part][0]?.toLocaleUpperCase("cs-CZ") ?? "")
    .join("");
}

/* Where the accent bar sits behind the type. Four positions, picked by seed. */
const ACCENT_CORNERS = [
  "left-0 top-0 h-full w-[38%]",
  "right-0 top-0 h-[42%] w-full",
  "bottom-0 left-0 h-[34%] w-[64%]",
  "right-0 top-0 h-full w-[26%]",
] as const;

function Ground({
  seed,
  label,
  className,
  children,
}: {
  seed: string;
  label: string;
  className: string;
  children: ReactNode;
}) {
  const corner = ACCENT_CORNERS[hash(`${seed}:corner`) % ACCENT_CORNERS.length]!;
  return (
    <span
      role="img"
      aria-label={label}
      className={`absolute inset-0 flex flex-col overflow-hidden bg-chrome text-text-inverse [container-type:size] ${className}`}
    >
      {/* A single wash of accent, placed by the seed. It is the artwork. */}
      <span
        aria-hidden="true"
        className={`absolute bg-accent opacity-[0.14] ${corner}`}
      />
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-accent" />
      <span
        aria-hidden="true"
        className="relative flex h-full flex-col justify-between p-[6cqmin]"
      >
        {children}
      </span>
    </span>
  );
}

export function TypographicCover({
  seed,
  headline,
  kicker,
  stamp,
  label,
  variant = "file",
  className = "",
}: {
  /** Stable content identity — a slug or id. Never a clock, never a random. */
  seed: string;
  /** The cover line: an altHeadline where the desk wrote one, else the title. */
  headline: string;
  kicker?: string;
  /** The mono file motif: `Složka 024`, a promotion, a division. */
  stamp?: string;
  /** What a screen reader hears in place of the composition. */
  label: string;
  /** `monogram` sets initials for a portrait slot; `file` sets the line. */
  variant?: "file" | "monogram";
  className?: string;
}) {
  const text = variant === "monogram" ? monogram(headline) : headline;
  /* Long Czech headlines get a smaller step so the cover never clips. */
  const size = variant === "monogram"
    ? "clamp(2rem, 34cqmin, 12rem)"
    : text.length > 60
      ? "clamp(1rem, 7.5cqmin, 3.5rem)"
      : text.length > 30
        ? "clamp(1.1rem, 9.5cqmin, 4.5rem)"
        : "clamp(1.25rem, 13cqmin, 6rem)";

  return (
    <Ground seed={seed} label={label} className={className}>
      <span className="flex items-start justify-between gap-[4cqmin]">
        {kicker ? (
          <span className="label-mono-sm text-accent-on-dark">{kicker}</span>
        ) : (
          <span />
        )}
        {stamp ? (
          <span className="label-mono-sm text-right text-text-inverse-meta">{stamp}</span>
        ) : null}
      </span>

      <span
        className="display block text-text-inverse"
        style={{ fontSize: size, lineHeight: variant === "monogram" ? 0.86 : 1.02 }}
      >
        {text}
      </span>

      <span
        aria-hidden="true"
        className={`block h-[2px] w-[18cqmin] bg-accent ${variant === "monogram" ? "self-end" : ""}`}
      />
    </Ground>
  );
}
