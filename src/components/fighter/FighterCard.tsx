import Link from "next/link";
import { TypographicCover } from "@/components/hero/TypographicCover";
import { PromotionBadge } from "@/components/ui/primitives";
import { getDictionary } from "@/i18n";
import { formatRecord } from "@/lib/format";
import { routes } from "@/lib/paths";
import { PROMOTION_ACCENT } from "@/lib/promotion";
import type { Fighter, Locale } from "@/lib/types";

/**
 * The portrait slot.
 *
 * `Fighter.image` is typed `never`: a photograph that is both accurate and
 * licensed for a magazine to publish is not something this desk can obtain,
 * and a generated likeness is not an option. So the honest state is a designed
 * one — the fighter's initials in Anton on chrome, seeded from their own slug
 * — rather than the hatched "photo pending" box that used to sit here
 * promising an image that never arrives.
 */
export function FighterPortrait({
  fighter,
  locale,
  className = "",
}: {
  fighter: Fighter;
  locale: Locale;
  className?: string;
}) {
  const dict = getDictionary(locale);
  return (
    <div className={`relative aspect-[4/5] overflow-hidden border border-rule-dark ${className}`}>
      {/* Division and promotion are stated once, outside the picture; the
        * cover itself is only the initials and the accent. */}
      <TypographicCover
        seed={`${fighter.organization}:${fighter.slug}`}
        headline={fighter.name}
        variant="monogram"
        label={fighter.name}
      />
      <PromotionBadge
        label={dict.organizationsShort[fighter.organization]}
        accent={PROMOTION_ACCENT[fighter.organization]}
        className="absolute bottom-3 left-3 z-10"
      />
    </div>
  );
}

/**
 * Directory and rail card. Same anatomy as the profile header: division
 * kicker, Anton name, mono record — and a record that is missing stays
 * missing rather than becoming a 0-0-0.
 */
export function FighterCard({
  fighter,
  locale,
}: {
  fighter: Fighter;
  locale: Locale;
}) {
  const dict = getDictionary(locale);

  return (
    <article className="group relative flex h-full flex-col border border-rule-strong bg-card">
      <FighterPortrait fighter={fighter} locale={locale} className="border-0" />

      <div className="flex flex-1 flex-col p-4">
        <span className="label-mono text-accent">{dict.divisions[fighter.division]}</span>
        <h3 className="display mt-2 text-[length:var(--text-d6)] leading-tight text-text">
          <Link
            href={routes.fighter(locale, fighter.organization, fighter.slug)}
            className="headline-link inline-flex min-h-11 items-center after:absolute after:inset-0"
          >
            {fighter.name}
          </Link>
        </h3>
        {fighter.record ? (
          <p className="mt-auto pt-3 font-mono text-[length:var(--text-mono-md)] tabular-nums text-text-meta">
            {formatRecord(fighter.record)}
          </p>
        ) : null}
      </div>
    </article>
  );
}
