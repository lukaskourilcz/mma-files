import { getDictionary } from "@/i18n";
import { routes } from "@/lib/paths";
import type { Locale, Organization } from "@/lib/types";

export interface PredictionCopy {
  organizations: Record<Organization, string>;
  divisions: Record<string, string>;
  empty: string;
  earlyModel: string;
  modelVersion: string;
  oddsSource: string;
  capturedPattern: string;
  roundsPattern: string;
  versus: string;
  uncertainty: Record<string, string>;
  boardNoModel: string;
  boardNoModelShort: string;
  openBoard: string;
  predictionsHref: string;
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
    oddsSource: dict.predictions.oddsSource,
    capturedPattern: dict.predictions.captured("{stamp}"),
    roundsPattern: dict.predictions.rounds(999).replace("999", "{rounds}"),
    versus: dict.predictions.versus,
    uncertainty: dict.predictions.uncertainty,
    boardNoModel: dict.predictions.boardNoModel,
    boardNoModelShort: dict.predictions.boardNoModelShort,
    openBoard: dict.predictions.openBoard,
    predictionsHref: routes.predictions(locale),
  };
}
