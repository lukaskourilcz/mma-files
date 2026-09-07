# Production review · 7 September 2026

Status: repository fixes are tested; a production launch is not yet verified.
Tracked by #22 and PR #23. The shared producer review lives in
[quorum](https://github.com/lukaskourilcz/quorum/blob/claude/production-audit-2026-09-07/docs/production-review-2026-09-07.md).

## Implemented

- Empty ad placements promote DNESKAi at https://caughtup-ai.vercel.app. The real text fits the compact 90px placement; responsive slots retain their dimensions and hide the article rail below desktop.
- Delivered ad images use contain, so content is not cropped. Asset paths exclude traversal and destinations require HTTPS without embedded credentials.
- Removed the fictitious corrections mailbox. A configured NEXT_PUBLIC_CORRECTIONS_EMAIL becomes a mail link; otherwise readers can use the repository's real report form.
- Existing consumer remains the only writer of Boardless packages. Provider keys stay in quorum.

## Verification and release checklist

- [x] TypeScript and lint.
- [x] All 68 existing tests, including package ingestion and theme token checks.
- [x] Production build with NEXT_PUBLIC_DEMO_MODE=false (before contact-only change); final build also required in PR CI.
- [ ] Confirm the Vercel production branch/main and domain, then deploy the final commit.
- [ ] Confirm demo mode is false in the deployed environment. Do not enable indexing before real content and rights review.
- [ ] Set a monitored corrections email if email intake is preferred.
- [ ] Receive a new article from quorum, replay the same package, and verify article/image/attribution and the admin receipt.
- [ ] At 360, 390, 768, 1024 and 1440px, verify home, article, event, fighter and corrections routes; no horizontal page overflow, clipped headline, cropped banner or overlapping sticky elements. Check 200% zoom, keyboard focus and menu dismissal.

The local preview service forwarded Vite flags to Next.js and could not start this architecture. Responsive browser acceptance is therefore unverified; successful builds and token tests do not replace it. Vercel returned no accessible teams, so remote environment values were not inspected.

## Mobbin findings

[Ghost news theme](https://mobbin.com/screens/756cbee5-cff7-4fe2-9b56-0c6d4e5a6baf) offers a strong lead story, secondary cards and a compact featured column. Preserve that hierarchy on desktop, reduce to two columns on tablet and one reading column on mobile. Prefer source/date metadata and clear UFC/Oktagon navigation over additional decorative panels. Existing article navigation and correction disclosure should remain.

[Perplexity Discover](https://mobbin.com/screens/423c2053-3a7f-4e84-ac8a-0723f1790a45) places date and source count close to each headline. Apply the evidence treatment to MMA news, while keeping FightAIQ predictions separately labelled with capture time/model version. Do not imply that a source count proves a claim.
