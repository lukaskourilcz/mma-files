import { getDictionary } from "@/i18n";
import type { Locale, Organization } from "@/lib/types";

export interface PredictionCopy {
  organizations: Record<Organization, string>;
  divisions: Record<string, string>;
  empty: string;
  earlyModel: string;
  modelVersion: string;
  noModel: string;
  oddsSource: string;
  capturedPattern: string;
  roundsPattern: string;
  tableHeadings: {
    bout: string;
    division: string;
    rounds: string;
    model: string;
  };
}

/** Only serialisable Czech labels cross into the lazy homepage island. */
export function getPredictionCopy(locale: Locale): PredictionCopy {
  const dict = getDictionary(locale);
  return {
    organizations: dict.organizationsShort,
    divisions: dict.divisions,
    empty: dict.events.empty,
    earlyModel: dict.predictions.earlyModel,
    modelVersion: dict.predictions.modelVersion,
    noModel: dict.predictions.noModel,
    oddsSource: dict.predictions.oddsSource,
    capturedPattern: dict.predictions.captured("{stamp}"),
    roundsPattern: dict.predictions.rounds(999).replace("999", "{rounds}"),
    tableHeadings: dict.predictions.tableHeadings,
  };
}
