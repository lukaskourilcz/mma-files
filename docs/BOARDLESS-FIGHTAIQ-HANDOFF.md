# BoardlessAI FightAIQ delivery handoff

MMA Files accepts `fightaiq-delivery/2` in `data/boardless/fightaiq.json`. The package
contains `fighter-card/1`, `bout/1`, optional `event-card/1`, current
`fightaiq-stats/1`, and no raw odds or private model research files.

The consumer rejects a stale package, wrong organization, missing fighter provenance,
a confirmed bout with fewer than two sources, a prediction without the `early-model`
label, or a bad canonical hash. It never needs model, source or GitHub App secrets.

Reader behavior:

- fighter/event records have no fictional fallback;
- cancelled and postponed canonical bouts do not appear as upcoming;
- every linked fighter name opens its profile when a renderable card exists;
- profiles show sourced fields, history, deterministic career totals, Glicko-2 and
  honest unavailable states; and
- active predictions show “Early model” and “Model output, not betting advice.”

The complete source, job and manual-run map lives in BoardlessAI
`docs/FIGHTAIQ-HANDOFF.md`.
