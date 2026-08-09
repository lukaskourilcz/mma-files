# FightAIQ delivery handoff

MMA Files accepts `fightaiq-delivery/2` in `data/boardless/fightaiq.json`. The package
contains `fighter-card/1`, `bout/1`, optional `event-card/1`, current
`fightaiq-stats/1`, and no raw odds or private model research files.

The consumer rejects a stale package, wrong organization, missing fighter provenance,
a confirmed bout with fewer than two sources, a prediction without the `early-model`
label, or a bad canonical hash. It never needs model, source or GitHub App secrets.

The 2026-08-08 snapshot currently contains 92 fighter cards, 3 events, 1,085
bouts and no prediction entries. That is a valid delivery: the prediction
surfaces render `Model zatím neběžel` rather than synthesizing a forecast.

Reader behavior:

- fighter/event records have no fictional fallback;
- cancelled and postponed canonical bouts do not appear as upcoming;
- every linked fighter name opens its profile when a renderable card exists;
- profiles show sourced fields, history, deterministic career totals, Glicko-2
  and honest unavailable states;
- the Predikce page and homepage board use the same disclosed data;
- a prediction renders only with probabilities, model version and capture
  timestamp; and
- every prediction carries `Raný model` and the standing Czech disclaimer
  `Žádné sázkové doporučení. Predikce jsou experimentální.`

The complete source, job and manual-run map lives upstream in quorum at
`docs/FIGHTAIQ-HANDOFF.md`. Apify-backed collection remains disabled at $0 until
the owner resolves its INBOX approvals.
