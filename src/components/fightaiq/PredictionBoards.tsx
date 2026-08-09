import { PredictionCardsView } from "@/components/fightaiq/PredictionCardsView";
import { getFightAiQPredictionDelivery } from "@/lib/boardless";
import {
  predictionCardsFromSurface,
  type PredictionCard,
} from "@/lib/prediction-cards";
import { getPredictionCopy } from "@/lib/prediction-copy";
import type { Locale } from "@/lib/types";

export type { PredictionCard } from "@/lib/prediction-cards";

export function getPredictionCards(locale: Locale, limit?: number): PredictionCard[] {
  return predictionCardsFromSurface(
    getFightAiQPredictionDelivery(),
    getPredictionCopy(locale).divisions,
    limit,
  );
}

/** Full server-rendered board for the canonical Predikce page. */
export function PredictionBoardList({
  locale,
  limit,
}: {
  locale: Locale;
  limit?: number;
}) {
  return (
    <PredictionCardsView
      cards={getPredictionCards(locale, limit)}
      copy={getPredictionCopy(locale)}
    />
  );
}
