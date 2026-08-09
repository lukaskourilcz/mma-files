"use client";

import { useState } from "react";
import { FighterCard } from "@/components/fighter/FighterCard";
import { EmptyState } from "@/components/ui/Feedback";
import { FilterChips } from "@/components/ui/FilterChips";
import { getDictionary } from "@/i18n";
import type { Fighter, Locale, Organization } from "@/lib/types";

type FighterFilter = "all" | Organization;

export function FighterDirectory({ fighters, locale }: { fighters: Fighter[]; locale: Locale }) {
  const dict = getDictionary(locale);
  const [filter, setFilter] = useState<FighterFilter>("all");
  const visible = filter === "all"
    ? fighters
    : fighters.filter((fighter) => fighter.organization === filter);
  const options = [
    { value: "all", label: dict.fighters.filterAll },
    { value: "ufc", label: dict.fighters.filterUfc },
    { value: "oktagon", label: dict.fighters.filterOktagon },
  ] as const;

  return (
    <>
      <div className="sticky top-[var(--layout-chrome-h-sm)] z-30 -mx-5 flex flex-wrap items-center justify-between gap-3 border-b border-rule-strong bg-paper px-5 py-3 md:static md:mx-0 md:border-b-0 md:px-0 md:py-0">
        <FilterChips
          label={dict.fighters.title}
          options={options}
          value={filter}
          onChange={setFilter}
        />
        <p aria-live="polite" className="font-mono text-[12px] tabular-nums text-text-meta">
          {dict.fighters.resultCount(visible.length)}
        </p>
      </div>

      {visible.length > 0 ? (
        <ul className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {visible.map((fighter) => (
            <li key={fighter.id} className="relative">
              <FighterCard fighter={fighter} locale={locale} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-8">
          <EmptyState>{dict.fighters.empty}</EmptyState>
        </div>
      )}
    </>
  );
}
