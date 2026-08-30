import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PredictionCardsView } from "../src/components/fightaiq/PredictionCardsView";
import { getPredictionCards } from "../src/components/fightaiq/PredictionBoards";
import { getPredictionCopy } from "../src/lib/prediction-copy";
import type { PredictionCard } from "../src/lib/prediction-cards";
import type { PredictionBout } from "../src/components/fightaiq/BoutRow";

const copy = getPredictionCopy("cs");

function render(cards: PredictionCard[], compact = false): string {
  return renderToStaticMarkup(createElement(PredictionCardsView, { cards, copy, compact }));
}

/**
 * The delivery carries no model line today, so the filled board is exercised
 * against a synthetic card rather than left untested until one arrives.
 */
const usableBout: PredictionBout = {
  id: "ufc:bout:synthetic-1",
  redName: "Islam Makhachev",
  blueName: "Ian Machado Garry",
  redRecord: "27-1-0",
  blueRecord: "16-1-0",
  division: "velterová váha",
  rounds: 5,
  model: {
    redWin: 0.68,
    blueWin: 0.32,
    version: "fightaiq-2026.08.1",
    capturedAt: "2026-08-08T06:01:41.482Z",
    uncertainty: "clear-lean",
  },
  odds: { value: "-210 / +175", capturedAt: "2026-08-08T06:00:00.000Z" },
};

const usableCard: PredictionCard = {
  organization: "ufc",
  eventName: "UFC 330: Makhachev vs. Machado Garry",
  eventStamp: "15. 8. 2026 · Xfinity Mobile Arena",
  provenance: { version: "fightaiq-2026.08.1", capturedAt: "2026-08-08T06:01:41.482Z" },
  bouts: [usableBout],
};

test("a usable model renders names, records, the bar and every provenance field", () => {
  const html = render([usableCard]);

  assert.ok(html.includes("Islam Makhachev"), "red corner name");
  assert.ok(html.includes("Ian Machado Garry"), "blue corner name");
  assert.ok(html.includes("27-1-0") && html.includes("16-1-0"), "delivered records");
  assert.ok(html.includes("68 %") && html.includes("32 %"), "both probabilities");
  assert.ok(html.includes("width:68%"), "the bar is drawn from the probability");

  assert.ok(html.includes(copy.earlyModel), "calibration label");
  assert.ok(html.includes("fightaiq-2026.08.1"), "model version");
  assert.ok(html.includes(copy.uncertainty["clear-lean"]!), "uncertainty in words");
  assert.ok(/zachyceno\s+8\.\s*8\.\s*2026/u.test(html), "capture time");

  assert.ok(html.includes(copy.oddsSource), "odds carry their source attribution");
  assert.ok(html.includes("-210 / +175"), "odds value");
  assert.doesNotMatch(html, /href="https?:\/\//u, "no bookmaker links leave the board");
  assert.ok(!html.includes(copy.boardNoModel), "a usable board never shows the empty line");
});

test("a model line missing its provenance is not rendered as a prediction", () => {
  const withoutVersion: PredictionCard = {
    ...usableCard,
    provenance: undefined,
    bouts: [{ ...usableBout, model: { ...usableBout.model!, version: "  " } }],
  };
  const html = render([withoutVersion]);
  assert.ok(!html.includes("68 %"), "probabilities need a version to be shown");
  assert.ok(html.includes(copy.boardNoModel), "the board collapses instead");
});

test("today's delivery says the model has not run once per board, not once per bout", () => {
  const cards = getPredictionCards("cs");
  assert.ok(cards.length > 0, "the delivery still produces boards");
  assert.ok(
    cards.every((card) => card.bouts.every((bout) => !bout.model)),
    "this test describes the current delivery: no bout carries a model line",
  );
  const bouts = cards.reduce((total, card) => total + card.bouts.length, 0);
  assert.ok(bouts > cards.length, "there are more bouts than boards to tell them apart");

  const board = render(cards);
  assert.equal(
    board.split(copy.boardNoModel).length - 1,
    cards.length,
    "the full board states the absence once per board",
  );
  assert.ok(
    cards.every((card) => card.bouts.every((bout) => board.includes(bout.redName))),
    "and keeps every sourced matchup — the bouts are facts, not model output",
  );

  const homepage = render(cards, true);
  assert.equal(
    homepage.split(copy.boardNoModelShort).length - 1,
    cards.length,
    "the homepage band collapses to one line per board",
  );
  assert.ok(homepage.includes(copy.openBoard), "and hands the reader to the full board");
  assert.ok(homepage.length < board.length, "the collapsed band is the shorter of the two");
});

test("board mastheads carry the event name and date", () => {
  const html = render(getPredictionCards("cs"));
  for (const card of getPredictionCards("cs")) {
    assert.ok(html.includes(card.eventName), `event name for ${card.organization}`);
    assert.ok(html.includes(card.eventStamp), `event stamp for ${card.organization}`);
  }
});
