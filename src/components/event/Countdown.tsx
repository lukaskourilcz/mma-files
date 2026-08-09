"use client";

import { useEffect, useState } from "react";

export interface CountdownLabels {
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
      <p className="border border-rule bg-paper px-4 py-5 text-center font-mono text-[13px] tabular-nums text-text">
        {fallback}
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
    { value: pad(d), label: labels.days },
    { value: pad(h), label: labels.hrs },
    { value: pad(m), label: labels.min },
    { value: pad(s), label: labels.sec },
  ];

  return (
    <div className="border border-rule bg-paper px-3 py-4">
      <ul className="grid grid-cols-4 divide-x divide-rule">
        {cells.map((cell) => (
          <li
            key={cell.label}
            className="min-w-0 px-1 text-center"
          >
            <p className="font-mono text-[24px] font-semibold leading-none tabular-nums text-text md:text-[28px]">
              {cell.value}
            </p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-text-meta">
              {cell.label}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
