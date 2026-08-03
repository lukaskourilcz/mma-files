import Link from "next/link";
import { Chip, DataRow, MissingValue } from "@/components/ui/primitives";
import { getDictionary } from "@/i18n";
import {
  ageFrom,
  countryName,
  formatHeight,
  formatRecord,
} from "@/lib/format";
import { routes } from "@/lib/paths";
import { PROMOTION_ACCENT } from "@/lib/promotion";
import type { FieldState, Fighter, FighterField, Locale } from "@/lib/types";
import { FIGHTER_FIELDS } from "@/lib/types";

const STATE_TONE: Record<FieldState, "success" | "warning" | "danger" | "muted"> = {
  verified: "success",
  provisional: "warning",
  disputed: "danger",
  unavailable: "muted",
};

export function FieldStateChip({
  state,
  locale,
}: {
  state: FieldState;
  locale: Locale;
}) {
  const dict = getDictionary(locale);
  return <Chip tone={STATE_TONE[state]}>{dict.fieldStates[state]}</Chip>;
}

/**
 * A roster card: the name in display type, the record underneath, and nothing else.
 *
 * There is no portrait. A fighter photograph that is both accurate and licensed for a magazine
 * to publish is not something this desk can obtain — the free photo sources return whatever
 * matches a name string, and an unlicensed press image is not an option — so the card carries
 * what the files actually support. A named slot holding a placeholder is a promise the venture
 * cannot keep; a card of verified data is one it can.
 *
 * A disputed record renders as the word, in the disputed colour, never as one of the two numbers
 * the registries disagree about.
 */
export function FighterCard({
  fighter,
  locale,
}: {
  fighter: Fighter;
  locale: Locale;
}) {
  const dict = getDictionary(locale);
  const accent = PROMOTION_ACCENT[fighter.organization];
  const recordState = fighter.fieldStates.record ?? "unavailable";

  return (
    <article className="sheet sheet-hover flex h-full flex-col">
      <div className="border-b border-rule px-4 py-3">
        <span
          style={{ backgroundColor: `color-mix(in oklch, ${accent} 88%, black)` }}
          className="label-mono-sm inline-block px-2 py-1 font-semibold tracking-[0.14em] text-white"
        >
          {dict.organizationsShort[fighter.organization]}
        </span>
      </div>

      <div className="px-4 pb-4 pt-3.5">
        <h3 className="display text-[22px] leading-tight text-ink md:text-[26px]">
          <Link
            href={routes.fighter(locale, fighter.organization, fighter.slug)}
            className="headline-link after:absolute after:inset-0"
          >
            {fighter.name}
          </Link>
        </h3>

        <p className="mt-2 font-mono text-sm font-semibold">
          {recordState === "disputed" ? (
            <span className="text-disputed">{dict.fieldStates.disputed}</span>
          ) : fighter.record && recordState !== "unavailable" ? (
            <span className="text-ink">{formatRecord(fighter.record)}</span>
          ) : (
            <MissingValue label={dict.fighters.recordUnavailable} />
          )}
        </p>

        <p className="label-mono-sm mt-1.5 tracking-[0.13em] text-ink-meta">
          {dict.divisions[fighter.division]}
          {fighter.country ? <> ·{" "}<abbr title={countryName(fighter.country, dict)} className="no-underline">{fighter.country}</abbr></> : null}
        </p>
      </div>
    </article>
  );
}

/** The tape, with every field carrying the evidence state it actually has. */
export function TaleOfTheTape({
  fighter,
  locale,
}: {
  fighter: Fighter;
  locale: Locale;
}) {
  const dict = getDictionary(locale);

  const valueFor = (field: FighterField): React.ReactNode => {
    const state = fighter.fieldStates[field] ?? "unavailable";
    if (state === "unavailable") {
      return <MissingValue label={dict.fieldStates.unavailable} />;
    }

    switch (field) {
      case "record":
        return fighter.record ? (
          <span className="font-mono">{formatRecord(fighter.record)}</span>
        ) : (
          <MissingValue label={dict.fieldStates.unavailable} />
        );
      case "stance":
        return fighter.stance ? dict.stances[fighter.stance] : null;
      case "heightCm":
        return fighter.heightCm ? formatHeight(fighter.heightCm, locale) : null;
      case "reachCm":
        return fighter.reachCm ? `${fighter.reachCm} cm` : null;
      case "dateOfBirth":
        return fighter.dateOfBirth ? ageFrom(fighter.dateOfBirth) : null;
      case "team":
        return fighter.team ?? null;
      case "division":
        return dict.divisions[fighter.division];
    }
  };

  return (
    <section aria-labelledby="tape" className="sheet p-5 md:p-6">
      <h2 id="tape" className="label-mono flex items-center gap-2 text-ink">
        <span aria-hidden="true" className="block h-[2px] w-4 bg-ember" />
        {dict.fighters.tape}
      </h2>

      <dl className="mt-4">
        {FIGHTER_FIELDS.map((field) => {
          const state = fighter.fieldStates[field] ?? "unavailable";
          return (
            <DataRow key={field} label={dict.fighterFields[field]}>
              <span className="inline-flex flex-wrap items-center justify-end gap-2">
                {valueFor(field) ?? (
                  <MissingValue label={dict.fieldStates.unavailable} />
                )}
                {state !== "verified" ? (
                  <FieldStateChip state={state} locale={locale} />
                ) : null}
              </span>
            </DataRow>
          );
        })}
      </dl>
    </section>
  );
}

/** A per-file summary of how well evidenced it is. */
export function EvidenceCoverage({
  fighter,
  locale,
}: {
  fighter: Fighter;
  locale: Locale;
}) {
  const dict = getDictionary(locale);
  const counts = FIGHTER_FIELDS.reduce<Record<FieldState, number>>(
    (acc, field) => {
      const state = fighter.fieldStates[field] ?? "unavailable";
      acc[state] += 1;
      return acc;
    },
    { verified: 0, provisional: 0, disputed: 0, unavailable: 0 },
  );

  const states: FieldState[] = ["verified", "provisional", "disputed", "unavailable"];

  return (
    <section aria-labelledby="coverage" className="sheet p-5">
      <h2 id="coverage" className="label-mono text-ink">
        {dict.fighters.coverage}
      </h2>
      <ul className="mt-4 space-y-2.5">
        {states
          .filter((state) => counts[state] > 0)
          .map((state) => (
            <li key={state} className="flex items-center justify-between gap-3">
              <FieldStateChip state={state} locale={locale} />
              <span className="font-mono text-sm text-ink">
                {counts[state]}/{FIGHTER_FIELDS.length}
              </span>
            </li>
          ))}
      </ul>
    </section>
  );
}
