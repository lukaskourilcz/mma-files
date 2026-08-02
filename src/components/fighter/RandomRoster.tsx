"use client";

import { useEffect, useState } from "react";
import { FighterCard } from "@/components/fighter/FighterCard";
import type { Fighter, Locale } from "@/lib/types";

/** How many files the homepage shows. The rest live behind the roster link. */
export const ROSTER_PICKS = 4;

/**
 * Four files from the roster, redrawn on every visit.
 *
 * The homepage used to render every card the repository holds — 339 of them — which made the
 * page enormous and buried the sections under it. Four is a sample; the link beside the
 * heading is how a reader reaches the rest.
 *
 * The server renders the first four of the pool so the markup is deterministic and hydration
 * matches, then the draw happens after mount. That is what makes the picks differ per visit
 * on a page that is generated once at build time.
 */
export function RandomRoster({ pool, locale }: { pool: Fighter[]; locale: Locale }) {
  const [picks, setPicks] = useState<Fighter[]>(() => pool.slice(0, ROSTER_PICKS));

  useEffect(() => {
    const shuffled = [...pool];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const swap = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[swap]] = [shuffled[swap]!, shuffled[index]!];
    }
    setPicks(shuffled.slice(0, ROSTER_PICKS));
  }, [pool]);

  return (
    <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {picks.map((fighter) => (
        <li key={fighter.id} className="relative">
          <FighterCard fighter={fighter} locale={locale} />
        </li>
      ))}
    </ul>
  );
}
