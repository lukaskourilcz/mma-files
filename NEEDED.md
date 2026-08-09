# NEEDED — owner actions for MMA Files

The relaunch code and delivery boundary are complete. This file lists only
account, rights, and editorial decisions that cannot be made in the repository.

## Production launch

- [ ] Confirm Vercel Production deploys `lukaskourilcz/mma-files` from `main`
  and has automatic Git deployments enabled.
- [ ] Set `NEXT_PUBLIC_SITE_URL=https://mma-files.vercel.app` explicitly in
  Vercel Production.
- [ ] Set `NEXT_PUBLIC_DEMO_MODE=false` and redeploy. The production build has
  already passed locally with this value.
- [ ] Keep `NEXT_PUBLIC_ALLOW_INDEXING=false` through the public review. Set it
  to `true` only after the name, legal copy, records, and licensed media are
  approved.
- [ ] Replace `corrections@example.invalid` in `src/config/site.ts` with a
  monitored corrections address.
- [ ] Confirm the GitHub App installation used for delivery includes
  `lukaskourilcz/mma-files` with repository Contents read/write only. Keep its
  credentials upstream; no secret belongs in this repository or in Vercel.

## Editorial and rights decisions

- [ ] Decide whether to merge or discard
  `claude/article-image-selection-61rs70`. It is intentionally preserved and
  remains two commits ahead of `main`.
- [ ] Replace any remaining placeholder photography only with files whose
  source, credit, and licence are recorded.
- [ ] Review the real Czech articles and the publisher/name wording before
  enabling indexing.

## FightAIQ and source approvals

- [ ] Resolve the upstream INBOX approvals for the proposed Apify sources and
  budget. Until then, Apify remains a $0 no-op.
- [ ] Review the first eligible prediction before publication. A valid line
  must include both probabilities, model version, and capture timestamp; a
  card without one continues to show `Model zatím neběžel`.

## Completed and verified

- [x] Three sourced Czech `article/1` packages are present in
  `data/boardless/articles.json`.
- [x] The 2026-08-08 `fightaiq-delivery/2` snapshot is present: 92 fighter
  cards, 3 events, and 1,085 bouts. It contains no prediction entries and the
  reader surfaces show honest no-model states.
- [x] The consumer limits delivery writes to `data/boardless/`, verifies hashes
  and provenance, and rejects stale or malformed packages.
- [x] Cancelled and postponed bouts are excluded from upcoming views without
  erasing status history.
- [x] Raw prices, bookmaker fields, model research files, and credentials are
  absent from the public delivery stores.
- [x] The 50-entry `Víte, že…` dataset uses deterministic, clock-free selection
  and needs no owner action.
