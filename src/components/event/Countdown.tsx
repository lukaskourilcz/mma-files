"use client";

import { useEffect, useState } from "react";

export interface CountdownLabels {
  heading: string;
  days: string;
  hrs: string;
  min: string;
  sec: string;
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/**
 * Live to the second against the card's own `startsAt`.
 *
 * The server pass and the first client render both show `fallback` — the
 * formatted date — because a clock rendered on the server is stale before it
 * reaches the reader and would mismatch on hydration. The ticking numerals
 * appear once the effect has run. Numerals are zero-padded by hand rather than
 * through `Intl`, so the four boxes never change width.
 */
export function Countdown({
  startsAt,
  labels,
  fallback,
}: {
  startsAt: string;
  labels: CountdownLabels;
  fallback: string;
}) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const target = new Date(startsAt).getTime();

  if (now === null || target - now <= 0) {
    return (
      <p className="flex items-center gap-3.5 border border-rule-strong bg-card px-4 py-3.5">
        <span className="label-mono-sm font-semibold text-ink-muted">
          {labels.heading}
        </span>
        <span className="label-mono-sm ml-auto text-ink">{fallback}</span>
      </p>
    );
  }

  let diff = target - now;
  const d = Math.floor(diff / 86_400_000);
  diff -= d * 86_400_000;
  const h = Math.floor(diff / 3_600_000);
  diff -= h * 3_600_000;
  const m = Math.floor(diff / 60_000);
  diff -= m * 60_000;
  const s = Math.floor(diff / 1000);

  const cells = [
    { value: pad(d), label: labels.days, lit: false },
    { value: pad(h), label: labels.hrs, lit: false },
    { value: pad(m), label: labels.min, lit: false },
    { value: pad(s), label: labels.sec, lit: true },
  ];

  return (
    <div className="flex items-center gap-3.5 border border-rule-strong bg-card px-4 py-3.5">
      <span className="label-mono-sm font-semibold text-ink-muted">
        {labels.heading}
      </span>
      <ul className="ml-auto flex gap-1.5">
        {cells.map((cell) => (
          <li
            key={cell.label}
            className={`min-w-[50px] px-1.5 py-[7px] text-center ${
              cell.lit ? "bg-signal" : "border border-rule"
            }`}
          >
            <p className="font-mono text-[21px] font-semibold leading-none text-ink">
              {cell.value}
            </p>
            <p
              className={`mt-1.5 font-mono text-[9px] uppercase tracking-[0.16em] ${
                cell.lit ? "text-ink" : "text-ink-meta"
              }`}
            >
              {cell.label}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
