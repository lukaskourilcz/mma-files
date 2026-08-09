# MMA Files relaunch — brainstorm and working plan

Date: 2026-08-09. Written after a full survey of this repository and of quorum
(BoardlessAI), which produces everything this site publishes.

This folder holds three documents:

1. `BRAINSTORM.md` (this file) — the current-state audit, the relaunch concept,
   the data plan with costs, and the launch checklist.
2. `PROMPT-CLAUDE-DESIGN.md` — a single self-contained prompt for Claude
   Design. Run it first. Save everything it produces (tokens, mockups,
   component specs) as the design handoff.
3. `PROMPT-CODEX.md` — the implementation prompt for Codex. Run it with the
   design handoff attached. It covers both repositories: this one and quorum.

Order matters: design first, implementation second. The Codex prompt contains
fallback design defaults, so implementation can proceed even if a detail is
missing from the handoff.

---

## 1. What exists today

- Next.js 15 App Router, React 19, TypeScript strict, Tailwind v4, Czech-only
  (`LOCALES = ["cs"]`). Fully static — every page prerenders; the only route
  handler is RSS.
- Nav (from `src/components/site/Masthead.tsx:16-32`): Nejnovější, UFC,
  Oktagon, Zápasový týden, Výsledky, Bojovníci, Čísla. The "Čísla" label
  points at `/cs/data-desk`, whose own heading says "Datová redakce" — the nav
  and the page already disagree.
- Homepage order (`src/app/[locale]/page.tsx`): "Víte, že…" facts belt → lead
  story hero → results board (the failing UFC/OKTAGON columns) → upcoming
  event cards → article feed → "Čísla" coverage-stats module → random roster →
  newsletter band.
- Content arrives only through `npm run consume:boardless` into
  `data/boardless/` (3 articles, 1 FightAIQ snapshot). `src/lib/repository.ts`
  is the only read path. Demo seed content is already invisible because
  delivered articles exist.
- Design: paper-white base, UFC red / Oktagon amber promotion colors, Anton +
  Archivo + IBM Plex Mono (all loaded with `latin-ext`, so Czech diacritics
  are safe), square corners. The interior pages still carry legacy "ember"
  tokens flagged as debt in `globals.css:39-52`.

## 2. Why the UFC and OKTAGON cards show nothing

This was assumed to be a FightAIQ configuration mistake. It is real and it is
two-sided. The exact chain, verified against the delivered snapshot
(`data/boardless/fightaiq.json`, 92 fighters / 3 events / 1,085 bouts / 0
stats entries):

Site side (this repo):

1. `src/lib/boardless.ts:462` drops every bout whose event ref contains
   `:event:history-` — 1,040 of 1,085 bouts. Every `completed` bout in the
   snapshot is a history bout, so `getCompletedEvents()` always returns `[]`
   and both "last card" columns render their empty state.
2. `src/lib/boardless.ts:410-411` derives event status. No delivered bout is
   ever `confirmed` or `weigh-in` (see upstream cause 4), so every event is
   stuck at `card-forming`.
3. `src/lib/repository.ts:220-224` then date-filters upcoming events; anything
   past-dated falls out.
4. OKTAGON is empty for a simpler reason: all 45 non-history bouts and all 3
   `events[]` entries in the snapshot are `org: "ufc"`. There is no Oktagon
   event in the file at all. The 270 Oktagon bouts present are all history.
   The `events[]` array is also dead code — `boardless.ts:463` short-circuits
   to the bout-derived path whenever any non-history bout exists.
5. Bonus data loss: 27 of 92 fighters never render because raw MediaWiki
   markup leaks into `division` (`"{{plainlist|"`, `"* Light Heavyweight"`),
   which `boardless.ts:291-294` rejects.

Upstream side (quorum):

1. The Cito bouts endpoint has returned zero rows on every run since its probe
   was added (`orchestrator/src/fightaiq/sources.ts:365-375`) — three of five
   daily reserved calls spent on nothing.
2. Cito covers UFC only. Oktagon has no API source at all; the official
   oktagonmma.com source is disabled with `termsVerdict: "unclear"`.
3. The Oktagon roster allowlist holds 12 fighters (a dead Wikipedia category
   used to return zero, and the curated replacement list is short).
4. The two-independent-sources rule for a `confirmed` bout can never fire:
   every bout in the snapshot carries a single Wikipedia source ref, and
   `scripts/consume-boardless-package.mjs:225` enforces the rule on this side
   too. One provider means permanent `announced`.
5. `statsEntries` is empty because no model run has completed; the odds key
   (`THE_ODDS_API_KEY`) only recently went live (493 of 500 monthly credits
   remain as of 2026-08-08).

Conclusion: the fix is more independent sources upstream (see §5) plus a
site-side event/results derivation rewrite — not a one-line config change.

## 3. The relaunch concept

Layout pattern: ringmagazine.com (The Ring's January 2025 relaunch). We copy
the layout grammar — dark chrome, oversized lead package, dense wire-style
"latest" list, a data module (their rankings ↔ our predictions), an event
schedule rail, black footer with social row — with our own palette, type and
name. No Ring assets, colors, or wording. (Note: this environment's network
policy blocked fetching ringmagazine.com directly; the pattern description in
the design prompt is written from its known relaunch structure, stated as our
own spec rather than a pixel reference.)

### Information architecture

Nav (order): **Nejnovější · UFC · Oktagon · Predikce · Zápasový týden ·
Výsledky · Bojovníci**

- "Čísla" leaves the nav and the homepage. `/cs/data-desk` redirects to the
  new Predikce page; its evidence-state and betting-boundary explainers fold
  into Predikce and the editorial-standards page.
- **Predikce** is new: the FightAIQ surface promoted from a buried module to a
  pillar, since the magazine's identity is UFC + Oktagon + fight predictions.
- Route segments stay English (`/cs/latest`, `/cs/predictions`, …) to match
  the existing URL scheme; labels are Czech.

### Categories and the article feed

- Every delivered article lands in **Nejnovější** and in exactly one of
  **UFC** or **Oktagon**. Upstream gets an explicit `organization` field on
  the article package (quorum's desk assigns it at write time); the site
  prefers the explicit field and falls back to the derivation that already
  exists in `src/lib/boardless.ts:152-155` (the `ufc:`/`oktagon:` ref prefix),
  so the three already-sealed packages need no migration.
- **Nejnovější shows one week at a time.** The window anchors on the lead
  article's publish date — never the clock, same reproducibility rule as the
  facts belt (`src/lib/daily-index.mjs`). At the bottom: one button, „Objevit
  předchozí týden", which loads the prior week's articles from a prebuilt
  static JSON chunk and re-renders the feed. Repeatable week by week until the
  archive is exhausted.

### Homepage (new order)

1. Wire ticker (kept, restyled).
2. Masthead with the new nav.
3. Ad slot: billboard.
4. Lead package: oversized hero article + two secondary headlines.
5. Nejnovější: dense list with thumbnails and timestamps (first week window).
6. Predikce board: upcoming cards for UFC and Oktagon with model lines where
   they exist — capture time, model version and uncertainty always visible.
7. Results board (the fixed UFC/OKTAGON columns).
8. Ad slot: in-feed rectangle.
9. "Víte, že…" facts belt (kept).
10. Bojovníci rail (deterministic selection from the next cards — replaces the
    random roster; no `Math.random`).
11. Newsletter band.
12. Ad slot: footer billboard. Footer with social icons.

### Ad system

Six named slots, IAB sizes, all rendering an empty labelled container („Místo
pro reklamu" — the Czech-only rule applies to placeholders too) until real
creatives exist:

| Slot id | Desktop | Mobile | Where |
|---|---|---|---|
| `masthead-billboard` | 970×250 (728×90 fallback) | 320×100 | Under masthead: homepage + section pages |
| `infeed-rectangle` | 300×250 | 300×250 | Inside the Nejnovější feed after the 4th card |
| `article-top` | 728×90 | 320×100 | Between article header and body |
| `article-mid` | 728×90 | 300×250 | Mid-article |
| `article-rail` | 300×600 sticky | — | Article right rail, desktop only |
| `footer-billboard` | 970×250 | 320×100 | Above the footer, homepage |

Slots reserve their height (zero CLS), read `data/boardless/ads.json`
(`schemaVersion: "mma-ads/1"`), and are controlled from the quorum admin: the
owner uploads an image there, crops it client-side to the slot's exact pixel
size, and the staged banner ships through a new `banner` delivery kind with
its own narrow path allowlist — same controlled-write pattern as articles and
datasets (the staged-payload precedent already exists in quorum at
`state/ventures/marketingshark/banner/contract.json`).

### Visual direction (default handed to Claude Design)

- Dark chrome (near-black masthead, hero band, footer — the existing
  `--color-ink #0b0b0c`), light reading wells (existing paper `#f7f7f5`).
- One brand accent: the existing UFC red (`oklch(0.52 0.22 27)`) promoted to
  "MMA Files red"; Oktagon amber demoted to a promotion badge color only; the
  lime "signal" accent retired.
- Type stays Anton (display) + Archivo (text) + IBM Plex Mono (data) — all
  already subset with `latin-ext`. Claude Design may swap Anton for Barlow
  Condensed 700/800 if one display weight proves limiting.
- Square corners, hairline rules, uppercase kickers, mono numerals for odds.
  Ranked cross-checked against the ui-ux-pro-max database ("Editorial Grid /
  Magazine" + "Bold Typography" entries) — dark-poster editorial with AA+
  contrast.

### Acting like a regular magazine

The site currently advertises its machinery. Public tells found in the audit,
all to be removed or rewritten (kept honest — we remove agent theater, we do
not add false claims of a big human newsroom):

1. Footer line "MMA Files pohání BoardlessAI — redakční systém řízený důkazy"
   → quiet publisher line only ("© 2026 MMA Files · Vydává BoardlessAI").
2. `/cs/about` "ohraničená rada softwarových agentů" → founder-led editorial
   project with in-house data tooling.
3. `/cs/how-it-works` lists eight internal agent role names (CANVAS, JAB,
   QUILL, REACH, SPLIT, AUDIT…) → describe the editorial process (sourcing,
   verification, corrections), not the org chart.
4. The methodology note on every article sidebar still describes an
   English+Czech two-desk workflow that no longer exists → rewrite.
5. `<meta name="boardless-content-hash">` ships in reader-facing HTML — check
   quorum's `release:verify` before touching (it may read this tag), then move
   it out of sight if safe.
6. The header LocaleSwitcher renders CZ→CZ, a no-op control → remove.
7. Footer "Sledovat": today two inert text spans and "Účty zatím neběží" →
   four icons (Facebook, Instagram, Threads, X), no links yet, plus RSS.
8. No favicon or logo file exists at all → design deliverable.

## 4. FightAIQ as a product pillar

- The Predikce page presents: next cards per organization, each bout with the
  model line where one exists (`p(win)` both corners, capture timestamp, model
  version, "raný model" uncertainty label), odds shown as data with source and
  capture time. Where no model run exists, the bout renders without invented
  numbers — the empty state says the model has not run, in Czech, plainly.
- Editorial guardrails stay hard: no affiliate links, no bookmaker promotion,
  no guaranteed outcomes, no bet automation. These are product requirements
  from CLAUDE.md, restated in both prompts.
- One structural insight worth building: an odds snapshot listing a bout is a
  second independent source for that bout's existence. Wiring The Odds API
  capture into bout corroboration unlocks the `confirmed` status that the
  two-source rule currently makes unreachable, which in turn unfreezes the
  event status derivation. Cheap, already-paid-for data doing double duty.

## 5. Data plan and what it costs

Current sources: Wikipedia/Wikidata (keyless), The Odds API (live, free plan,
500 credits/month, ~7 used), Cito UFC API (500/month free, bouts endpoint
dead), official Oktagon site (disabled, terms unclear).

Additions to evaluate, all behind quorum's existing Apify integration
(`orchestrator/src/sources/apify.ts` — already quota-guarded four ways, just
never provisioned; `APIFY-ACCOUNT-001` sits unresolved in `state/INBOX.md`):

| Source | What it adds | Actor / access | Est. monthly cost |
|---|---|---|---|
| UFCStats via Apify (e.g. `automation-lab/ufcstats-scraper`) | UFC results, per-fight stats — second independent UFC source | pay-per-use actor | ~$0.50–1.50 of credit |
| ESPN MMA (free actor exists) | UFC cards + results corroboration | free actor + compute | ~$0.30–0.60 of credit |
| Tapology promotion pages | **Oktagon events, full cards, results** (Tapology covers OKTAGON 92/93 today) + UFC | generic Cheerio/Web Scraper actor, compute only | ~$0.60–1.50 of credit |
| Sherdog fighter profiles | fighter records incl. Oktagon roster growth | community actor | ~$0.20–0.50 of credit |
| The Odds API (already live) | UFC odds + bout corroboration | direct API, free plan | $0 (within 500 credits) |
| Turnkey UFC APIs (`lemur/ufc-api` etc.) | structured everything, UFC only | ~$30 per 1,000 calls | 2 calls/day ≈ $1.80 of credit |

Platform facts: Apify Free plan = $5.00 usage credit/month, no card on file,
hard stop at the credit — overspend is impossible. Compute ≈ $0.25–0.40 per
compute unit depending on plan; a Cheerio-class scrape run costs roughly
$0.02–0.05.

**Bottom line: $0 cash per month.** A daily Oktagon+UFC refresh plus one paid
actor lands at ~$1.50–3.00 of the $5 free credit. Two cautions, both recorded
in quorum's owner queue:

1. The pending GoVIRAL social recipe was sized at ~$4.60/month of the same $5
   credit. Both programs cannot run at full planned cadence on one free
   account — the new `APIFY-MMA-SOURCES-001` INBOX item caps the MMA share at
   $3.00/month and notes the rebalance rule.
2. Terms discipline is source-by-source: oktagonmma.com was disabled over
   unclear terms, and Tapology/Sherdog/UFCStats get the same `termsVerdict`
   review before their first run. The INBOX item approves the scope; each
   pinned actor still records its verdict in `config/mma-sources.json`.

Upgrading Apify to a paid plan (~$29–39/month) would consume the entire $30
all-in operating cap and is explicitly not part of this plan.

## 6. Performance and code health (summary — full spec in PROMPT-CODEX)

Static-first stays. Week chunks and FightAIQ data load lazily from prebuilt
JSON; below-fold homepage modules code-split; `next/image` everywhere with
real `sizes`; fonts already self-hosted via `next/font`; ad slots reserve
height; hero image `priority`. Targets: LCP < 2.5s on mid-range mobile, CLS ≈
0, no client JS for reading surfaces beyond the few interactive islands.
Site-wide OG image (today only articles have one, and it hardcodes the retired
orange palette), sitemap/robots/RSS keep their indexing gates.

## 7. Cleanup sweep (end of implementation)

- Stale docs: root `README.md` (509 lines, reads like an internal design doc —
  rewrite ≤ ~150 lines for humans), root `NEEDED.md` (written before the
  2026-08-08 delivery), `docs/BOARDLESS-FIGHTAIQ-HANDOFF.md` (promises
  predictions that don't render).
- Branches: `claude/magazine-widgets-datasets-pee5df`,
  `claude/orchestration-overhaul-r4cxa4` and `dev` (0 ahead / 36 behind) —
  delete after verifying merged. **Keep** `claude/article-image-selection-61rs70`:
  it is unmerged and waiting on an owner decision (it carries the two
  corrected MMA hero images). Quorum has no stale branches.
- PRs: none open in either repo as of 2026-08-09 — verify again at sweep time.
- Verify no AI-theater strings remain (checklist in PROMPT-CODEX §E).

## 8. Launch checklist (owner)

- [ ] Run `PROMPT-CLAUDE-DESIGN.md` in Claude Design; save the handoff.
- [ ] Run `PROMPT-CODEX.md` in Codex with the handoff.
- [ ] Set `NEXT_PUBLIC_DEMO_MODE=false` on the mma-files Vercel project —
      without it the demo banner covers real reporting.
- [ ] Resolve `APIFY-MMA-SOURCES-001` (and the older `APIFY-ACCOUNT-001`) in
      quorum's `state/INBOX.md`; add `APIFY_TOKEN` to Actions secrets.
- [ ] Decide the indexing flip (`NEXT_PUBLIC_ALLOW_INDEXING`) once the
      redesigned site and real content are live.
- [ ] Merge or decline `claude/article-image-selection-61rs70` in mma-files.
- [ ] When real social accounts exist, replace the four dead footer icons with
      links (one line each in `src/config/site.ts`).
