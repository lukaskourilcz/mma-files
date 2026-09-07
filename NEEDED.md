# NEEDED — owner actions for MMA Files

Production audit: 2026-09-07. Repository checks passed; production environment
and browser acceptance still need verification. See docs/production-review-2026-09-07.md.

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
- [ ] Set `NEXT_PUBLIC_CORRECTIONS_EMAIL` to a monitored corrections address.
  Until configured, the corrections page links to the real repository issue form.
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
  budget. These FightAIQ approvals are separate from goViral: quorum Actions already
  had APIFY_TOKEN in the audited run; actor eligibility and account credit still matter.
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
