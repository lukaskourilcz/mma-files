"use client";

import { useEffect, useState } from "react";

/**
 * Counts up to `value` on mount, cubic ease-out over 1.1s.
 *
 * The initial state is the final value, so the server pass and a client with
 * JavaScript disabled both render the real figure — the animation only ever
 * subtracts from a number that is already correct. Readers who have asked for
 * reduced motion never see it move; the CSS block in `globals.css` cannot
 * govern a rAF loop, so the query is checked here too.
 */
export function CountUp({ value }: { value: number }) {
  const [shown, setShown] = useState(value);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const start = performance.now();

    const step = (now: number) => {
      const k = Math.min(1, (now - start) / 1100);
      setShown(Math.round(value * (1 - Math.pow(1 - k, 3))));
      if (k < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return <>{shown}</>;
}
