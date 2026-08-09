"use client";

import { useEffect, useState } from "react";
import { PredictionCardsView } from "@/components/fightaiq/PredictionCardsView";
import {
  isPredictionSurface,
  predictionCardsFromSurface,
  type PredictionCard,
} from "@/lib/prediction-cards";
import type { PredictionCopy } from "@/lib/prediction-copy";

export interface HomepagePredictionsLoadedProps {
  limit: number;
  copy: PredictionCopy;
  loadingLabel: string;
}

export function HomepagePredictionsLoaded({
  limit,
  copy,
  loadingLabel,
}: HomepagePredictionsLoadedProps) {
  const [status, setStatus] = useState<"loading" | "ready" | "failed">("loading");
  const [cards, setCards] = useState<PredictionCard[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    void (async () => {
      try {
        const response = await fetch("/data/fightaiq/predictions.json", {
          cache: "force-cache",
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`prediction surface: ${response.status}`);
        const payload: unknown = await response.json();
        if (!isPredictionSurface(payload)) throw new Error("invalid prediction surface");
        setCards(predictionCardsFromSurface(payload, copy.divisions, limit));
        setStatus("ready");
      } catch {
        if (!controller.signal.aborted) setStatus("failed");
      }
    })();
    return () => controller.abort();
  }, [copy.divisions, limit]);

  return status === "ready" || status === "failed" ? (
    <PredictionCardsView cards={cards} copy={copy} />
  ) : (
    <p role="status" className="font-mono text-[12px] text-text-inverse-meta">
      {loadingLabel}
    </p>
  );
}
