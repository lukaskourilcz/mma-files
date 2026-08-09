import { FighterCard } from "@/components/fighter/FighterCard";
import { getFightAiQPredictionDelivery } from "@/lib/boardless";
import { getEvents, getFightersByOrganization } from "@/lib/repository";
import { ORGANIZATIONS, type Fighter, type Locale, type Organization } from "@/lib/types";

function ranked(organization: Organization): Fighter[] {
  return getFightersByOrganization(organization).sort((left, right) => {
    const rating = (right.fightFile?.rating.rating ?? Number.NEGATIVE_INFINITY)
      - (left.fightFile?.rating.rating ?? Number.NEGATIVE_INFINITY);
    return rating || left.name.localeCompare(right.name, "cs");
  });
}

/** Two sourced card fighters per promotion, then rating-backed fallbacks. */
export function getHomepageFighters(): Fighter[] {
  const snapshot = getFightAiQPredictionDelivery();
  const anchor = snapshot.generatedAt;
  const events = getEvents();
  const selected: Fighter[] = [];
  const seen = new Set<string>();

  for (const organization of ORGANIZATIONS) {
    const next = events.find((event) =>
      event.organization === organization
      && event.status !== "completed"
      && (!anchor || event.startsAt >= anchor),
    );
    const ids = next
      ? [...new Set(next.bouts.flatMap((bout) => [bout.red.fighterRef, bout.blue.fighterRef]))]
      : [];
    const candidates = [
      ...ids.flatMap((id) => ranked(organization).filter((fighter) => fighter.id === id)),
      ...ranked(organization),
    ];
    for (const fighter of candidates) {
      if (seen.has(fighter.id)) continue;
      selected.push(fighter);
      seen.add(fighter.id);
      if (selected.filter((item) => item.organization === organization).length === 2) break;
    }
  }

  return selected.slice(0, 4);
}

export function FighterRail({ locale }: { locale: Locale }) {
  const fighters = getHomepageFighters();
  return (
    <ul className="mt-7 grid grid-cols-2 gap-5 lg:grid-cols-4">
      {fighters.map((fighter) => (
        <li key={fighter.id} className="relative">
          <FighterCard fighter={fighter} locale={locale} />
        </li>
      ))}
    </ul>
  );
}
