import Link from "next/link";
import { PhotoSlot } from "@/components/media/PhotoSlot";
import { DataRow } from "@/components/ui/primitives";
import { getDictionary } from "@/i18n";
import {
  ageFrom,
  formatHeight,
  formatRecord,
} from "@/lib/format";
import { routes } from "@/lib/paths";
import { PROMOTION_ACCENT } from "@/lib/promotion";
import type { Fighter, FighterField, Locale } from "@/lib/types";
import { FIGHTER_FIELDS } from "@/lib/types";

/**
 * Portrait slots never substitute a likeness. The labelled treatment is the
 * honest state until a licensed fighter image arrives in the delivery contract.
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

  return (
    <article className="group relative flex h-full flex-col border border-rule-strong bg-card">
      <div className="relative aspect-[4/5] overflow-hidden">
        <PhotoSlot
          locale={locale}
          note={dict.labels.photoSlots.portrait}
          sizes="(min-width: 1024px) 25vw, 50vw"
        />
        <span
          style={{ backgroundColor: accent }}
          className="absolute bottom-3 left-3 z-10 inline-flex px-2 py-[5px] font-mono text-[10px] font-semibold uppercase leading-none tracking-[0.16em] text-white"
        >
          {dict.organizationsShort[fighter.organization]}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="display text-[length:var(--text-d6)] leading-tight text-text underline decoration-transparent decoration-[3px] underline-offset-4 group-hover:decoration-accent">
          <Link
            href={routes.fighter(locale, fighter.organization, fighter.slug)}
            className="after:absolute after:inset-0"
          >
            {fighter.name}
          </Link>
        </h3>

        <p className="mt-1 text-[13px] text-text-muted">
          {dict.divisions[fighter.division]}
        </p>

        {fighter.record ? (
          <p className="mt-3 font-mono text-[13px] tabular-nums text-text">
            {formatRecord(fighter.record)}
          </p>
        ) : null}
      </div>
    </article>
  );
}

/** The tape omits fields that have no delivered value. */
export function TaleOfTheTape({
  fighter,
  locale,
}: {
  fighter: Fighter;
  locale: Locale;
}) {
  const dict = getDictionary(locale);

  const valueFor = (field: FighterField): React.ReactNode => {
    switch (field) {
      case "record":
        return fighter.record ? <span className="font-mono">{formatRecord(fighter.record)}</span> : null;
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
          const value = valueFor(field);
          if (value == null) return null;
          return (
            <DataRow key={field} label={dict.fighterFields[field]}>
              {value}
            </DataRow>
          );
        })}
      </dl>
    </section>
  );
}
