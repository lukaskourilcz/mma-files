import { PredictionBoard } from "@/components/fightaiq/BoutRow";
import { EmptyState } from "@/components/ui/Feedback";
import type { PredictionCard } from "@/lib/prediction-cards";
import type { PredictionCopy } from "@/lib/prediction-copy";
import { ORGANIZATIONS } from "@/lib/types";

function provenanceStamp(value: string): string {
  return new Intl.DateTimeFormat("cs-CZ", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function PredictionCardsView({
  cards,
  copy,
}: {
  cards: PredictionCard[];
  copy: PredictionCopy;
}) {
  const byOrganization = new Map(cards.map((card) => [card.organization, card]));

  return (
    <div className="space-y-16">
      {ORGANIZATIONS.map((organization) => {
        const card = byOrganization.get(organization);
        if (!card) {
          const accent = organization === "ufc"
            ? "var(--color-badge-ufc-on-dark)"
            : "var(--color-badge-oktagon-on-dark)";
          return (
            <section key={organization} className="bg-chrome text-text-inverse">
              <header className="border-b-[3px] pb-3" style={{ borderColor: accent }}>
                <h2 className="display text-[length:var(--text-d5)]" style={{ color: accent }}>
                  {copy.organizations[organization]}
                </h2>
              </header>
              <EmptyState className="mt-5 border-rule-dark text-text-inverse-meta">
                {copy.empty}
              </EmptyState>
            </section>
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
              <p className="border-t border-rule-dark pt-3 font-mono text-[11px] text-text-inverse-meta">
                {copy.earlyModel} · {copy.modelVersion} {card.provenance.version} · {copy.capturedPattern.replace("{stamp}", provenanceStamp(card.provenance.capturedAt))}
              </p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
