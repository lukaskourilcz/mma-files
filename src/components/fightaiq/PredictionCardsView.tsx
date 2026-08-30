import Link from "next/link";
import {
  PredictionBoard,
  PredictionBoardHeader,
  hasUsableModel,
} from "@/components/fightaiq/BoutRow";
import type { PredictionCard } from "@/lib/prediction-cards";
import type { PredictionCopy } from "@/lib/prediction-copy";
import { ORGANIZATIONS, type Organization } from "@/lib/types";

function provenanceStamp(value: string): string {
  return new Intl.DateTimeFormat("cs-CZ", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

/**
 * One line, not one line per bout.
 *
 * A board where no bout has a usable model has exactly one thing to say, and
 * saying it eleven times down a dark column told the reader nothing extra —
 * it just made the absence look like content.
 */
function CollapsedBoard({
  organization,
  card,
  copy,
  compact,
}: {
  organization: Organization;
  card?: PredictionCard;
  copy: PredictionCopy;
  /** The homepage says it short and links on; the full board says it in full. */
  compact: boolean;
}) {
  return (
    <section className="bg-chrome text-text-inverse">
      <PredictionBoardHeader
        organization={organization}
        label={copy.organizations[organization]}
        eventName={card?.eventName}
        eventStamp={card?.eventStamp}
      />
      <p className="mt-4 max-w-[68ch] text-[length:var(--text-sm)] leading-relaxed text-text-inverse-muted">
        {card ? (compact ? copy.boardNoModelShort : copy.boardNoModel) : copy.empty}
      </p>
      {compact && card ? (
        <Link
          href={copy.predictionsHref}
          className="label-mono mt-3 inline-flex min-h-11 items-center gap-2 text-accent-on-dark headline-link"
        >
          {copy.openBoard}
          <span aria-hidden="true">→</span>
        </Link>
      ) : null}
    </section>
  );
}

export function PredictionCardsView({
  cards,
  copy,
  compact = false,
}: {
  cards: PredictionCard[];
  copy: PredictionCopy;
  /** Homepage band: collapse harder and hand the reader on to the full board. */
  compact?: boolean;
}) {
  const byOrganization = new Map(cards.map((card) => [card.organization, card]));

  return (
    <div className="space-y-12 md:space-y-16">
      {ORGANIZATIONS.map((organization) => {
        const card = byOrganization.get(organization);
        /* The homepage band is a teaser: with nothing to predict it collapses
         * to a line and hands the reader to the full board. The full board
         * keeps its matchups either way — they are sourced facts, not model
         * output. */
        if (!card || (compact && !hasUsableModel(card.bouts))) {
          return (
            <CollapsedBoard
              key={organization}
              organization={organization}
              card={card}
              copy={copy}
              compact={compact}
            />
          );
        }
        return (
          <div key={organization}>
            <PredictionBoard
              organization={organization}
              eventName={card.eventName}
              eventStamp={card.eventStamp}
              bouts={card.bouts}
              copy={copy}
            />
            {card.provenance ? (
              <p className="label-mono border-t border-rule-dark pt-3 text-text-inverse-meta">
                {copy.earlyModel} · {copy.modelVersion} {card.provenance.version} · {copy.capturedPattern.replace("{stamp}", provenanceStamp(card.provenance.capturedAt))}
              </p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
