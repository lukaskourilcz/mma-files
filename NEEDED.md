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
- [ ] Add `NEXT_PUBLIC_SITE_URL=https://mma-files.vercel.app` in Vercel Production.
- [ ] Keep `NEXT_PUBLIC_DEMO_MODE=true` until the first real package is visible.
  Set it to `false` and redeploy after that check.
- [ ] Keep `NEXT_PUBLIC_ALLOW_INDEXING=false` during the showcase review. Set it
  to `true` only after name/legal review and after every visible record is real or
  clearly marked as demo.
- [ ] Replace the placeholder corrections contact in `src/config/site.ts` with an
  inbox you monitor before inviting public readers.

## First article check

- [ ] Deliver one bilingual `article/1` package from BoardlessAI.
- [ ] Confirm the target commit changes only `data/boardless/articles.json` and
  passes GitHub Actions.
- [ ] Confirm the English and Czech routes show the same sourced story, the hero
  renders, citations are present and no fictional seed story appears beside it.

## First FightAIQ check

- [ ] Deliver one `fightaiq-delivery/1` package after at least one UFC or Oktagon
  fighter and event file has cleared the source checks.
- [ ] Confirm the target commit changes only `data/boardless/fightaiq.json` and
  passes GitHub Actions.
- [ ] Check Fighters, Events and Data Desk in both languages. Missing fields must
  stay visible as missing; captured prices must show their time and source.
- [ ] Keep BoardlessAI `FIGHTAIQ_ANALYSIS_ENABLED=false` until the separate model
  mode decision is signed. The public data delivery does not turn analysis on.

No model keys, source keys, GitHub App private key or admin credentials belong in
this repository or its Vercel environment.

## Verified in code

- On 2026-08-01, a clean-checkout rehearsal accepted one bilingual article and
  one FightAIQ snapshot, treated an identical article replay as a no-op, passed
  its tests and type-check, and built the English and Czech article, event,
  fighter and Data Desk routes from the delivered files.
- BoardlessAI refuses an MMA Files delivery-only run unless
  `MMA_FILES_LIVE_ENABLED=true`; a retry does not call a model.
