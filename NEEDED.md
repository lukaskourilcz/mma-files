# NEEDED — owner setup for MMA Files

Code and the content-only delivery boundary are complete. These are the remaining
account or editorial decisions that cannot be made inside the repository.

## Before the first delivery

- [ ] In the GitHub App installation already used for Caught Up, add
  `lukaskourilcz/mma-files` and keep the permission limited to repository Contents
  read/write. BoardlessAI reuses `DELIVERY_APP_ID` and
  `DELIVERY_APP_PRIVATE_KEY`; do not add those secrets to this repository.
- [ ] Confirm Vercel Production is connected to `lukaskourilcz/mma-files`, branch
  `main`, with automatic Git deployments enabled.
- [ ] Add `NEXT_PUBLIC_SITE_URL=https://mma-files.vercel.app` in Vercel Production so the intended origin is explicit. The code now safely falls back to this production URL if the variable is missing.
- [ ] Keep `NEXT_PUBLIC_DEMO_MODE=true` until the first real package is visible.
  Set it to `false` and redeploy after that check.
- [ ] Keep `NEXT_PUBLIC_ALLOW_INDEXING=false` during the showcase review. Set it
  to `true` only after name/legal review and after every visible record is real or
  clearly marked as demo.
- [ ] Replace the placeholder corrections contact in `src/config/site.ts` with an
  inbox you monitor before inviting public readers.

## First article check

- [ ] Deliver one Czech `article/1` package from BoardlessAI.
- [ ] Confirm the target commit changes only `data/boardless/articles.json` and
  passes GitHub Actions.
- [ ] Confirm the Czech article route shows the sourced story, the hero renders,
  citations are present and no fictional seed story appears beside it.

## First FightAIQ check

- [ ] Set BoardlessAI `FIGHTAIQ_ANALYSIS_ENABLED=true`; owner decision D8 now
  authorizes guarded predictions.
- [ ] Run BoardlessAI `mma-intake`, then `mma-analysis`, and deliver one
  `fightaiq-delivery/2` package after at least one fighter card and bout have cleared
  their source checks.
- [ ] Confirm the target commit changes only `data/boardless/fightaiq.json` and
  passes GitHub Actions.
- [ ] Check Fighters, Upcoming Fights and Data Desk. Missing fields
  must stay visible as missing; raw prices must not appear in the delivered snapshot.
- [ ] Cancel or postpone one fixture bout in a rehearsal package and confirm it leaves
  every upcoming view without losing its status history.
- [ ] If a prediction is eligible, confirm both fighter names link to their profiles
  and the card shows “Early model” plus “Model output, not betting advice.” A run with
  no eligible confirmed bout should render no invented forecast.

No model keys, source keys, GitHub App private key or admin credentials belong in
this repository or its Vercel environment.

## Verified in code

- On 2026-08-01, a clean-checkout rehearsal accepted one article and one
  FightAIQ snapshot, treated an identical article replay as a no-op, passed its
  tests and type-check, and built the article, event, fighter and Data Desk
  routes from the delivered files.
- BoardlessAI refuses an MMA Files delivery-only run unless
  `MMA_FILES_LIVE_ENABLED=true`; a retry does not call a model.
- The "Víte, že…" belt ships complete and needs no owner action: the 50 facts
  are committed, the daily pick is deterministic from the lead article's date,
  and later facts append through the existing delivery channel
  (`src/data/README.md`).
