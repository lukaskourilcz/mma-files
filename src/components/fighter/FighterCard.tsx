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

export function FighterCard({
  fighter,
  locale,
}: {
  fighter: Fighter;
  locale: Locale;
}) {
  const dict = getDictionary(locale);

  return (
    <article className="sheet sheet-hover flex h-full flex-col p-5">
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-2">
        <Chip tone="dark">{dict.organizationsShort[fighter.organization]}</Chip>
        <span className="label-mono-sm text-ink-muted">
          {dict.divisions[fighter.division]}
        </span>
      </div>

      <h3 className="mt-4 text-lg leading-tight tracking-[-0.025em] text-ink">
        <Link
          href={routes.fighter(locale, fighter.organization, fighter.slug)}
          className="headline-link after:absolute after:inset-0"
        >
          {fighter.name}
        </Link>
      </h3>

      {fighter.nickname ? (
        <p className="label-mono-sm mt-1.5 text-ember">“{fighter.nickname}”</p>
      ) : null}

      <p className="mt-3 text-sm text-ink-muted">
        {countryName(fighter.country, dict)}
      </p>

      <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1.5 pt-5">
        {fighter.record && fighter.fieldStates.record !== "unavailable" ? (
          <>
            <span className="font-mono text-sm font-medium text-ink">
              {formatRecord(fighter.record)}
            </span>
            {fighter.fieldStates.record && fighter.fieldStates.record !== "verified" ? (
              <FieldStateChip state={fighter.fieldStates.record} locale={locale} />
            ) : null}
          </>
        ) : (
          <MissingValue label={dict.fighters.recordUnavailable} />
        )}
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
