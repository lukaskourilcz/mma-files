# Prompt for Codex — implement the MMA Files relaunch

Attach the Claude Design handoff (tokens, mockups, component specs) and give
Codex everything below the line as one prompt.

---

You are implementing the full relaunch of **MMA Files**, a Czech-only MMA
magazine, across two repositories you have locally:

- `mma-files` — the public Next.js site (Next 15 App Router, React 19, TS
  strict, Tailwind v4, fully static, `node --test` suite).
- `quorum` — BoardlessAI, the system that produces every article, dataset and
  FightAIQ snapshot the site publishes (pnpm workspace: `orchestrator/`,
  `site/`, `studio/`).

Read both repositories' `CLAUDE.md` files first and treat them as binding.
The design handoff attached to this prompt is the visual source of truth;
where it is silent, use the defaults in §A2 below.

## Non-negotiable contracts (violating any of these is a failed run)

1. **Czech is the only published locale.** Every reader-facing string lives in
   `mma-files/src/i18n/cs.ts`. No English locale, no translation step. All new
   UI copy in Czech with correct diacritics.
2. **Never invent facts.** No fight records, dates, quotes, statistics, odds
   or probabilities that did not arrive in a delivered package. Missing data
   renders as an explicit Czech empty state, never as `0` or a guess.
3. **Truth gates stay.** Demo seed content keeps `isDemo`, its badge and
   `noindex`. Prediction lines keep capture time, model version and
   uncertainty labels. No affiliate links, bookmaker promotion, guaranteed
   outcomes or bet automation. No AI-generated fighter imagery presented as
   photography; no promotion logos or unlicensed photos; every image keeps
   its license attribution.
4. **Delivery boundary stays.** `data/boardless/` is written only by
   `npm run consume:boardless` (extended, not bypassed). Nothing in mma-files
   authors content. `src/lib/repository.ts` remains the only content read
   path — route files never import `src/content/` directly.
5. **Never weaken guards** — budget, patch, security, evidence, stage,
   finance, content-quality or release guards and their tests, in either
   repo. The `.github/workflows/cycle.yml` path allowlists get *narrower
   additions*, never loosened patterns.
6. **No secrets in git.** Anything needing money, an account or a credential
   goes to `quorum/state/INBOX.md` as `HUMAN_APPROVAL` and stops there.
7. **Reproducible builds.** No `new Date()`, `Date.now()` or `Math.random()`
   in any content-selection path (the existing rule for
   `src/lib/daily-index.mjs` now extends to the week-window logic).
8. **Commit discipline.** Small conventional commits per coherent unit
   (`feat(...)`, `fix(...)`, `docs(...)`); typecheck before committing code;
   frequent pushes. In quorum, read the latest `state/decisions/*.md` before
   implementing (golden rule 1) — note the 2026-08-08 mag-desk VETO stopped
   *editorial* FightAIQ work over repetitive coverage; this engineering
   program is owner-directed and does not resume that editorial loop.
9. Write prose (docs, commit bodies, UI copy) plainly. quorum mirrors a
   `stop-slop` skill at `.agents/skills/stop-slop/` — apply it to everything
   you write.

---

## Workstream A — mma-files: the new site

### A1. Information architecture

- New nav order: **Nejnovější · UFC · Oktagon · Predikce · Zápasový týden ·
  Výsledky · Bojovníci.** Nav data currently lives inline at
  `src/components/site/Masthead.tsx:16-32` with labels from
  `src/i18n/cs.ts:19-33` and routes from `src/lib/paths.ts` — extract a
  single nav config so masthead, mobile sheet and footer render one list.
- **Remove „Čísla"**: drop the nav item and the homepage `DataDeskModule`
  (`src/components/site/HomeModules.tsx:23-108`). Create `/cs/predictions`
  (label „Predikce") as the FightAIQ surface; permanently redirect
  `/cs/data-desk` to it (`next.config.ts` `redirects()`). Fold the
  evidence-state legend and betting-boundary explainer from the old page into
  the Predikce page footer and `/cs/editorial-standards`. Route segments stay
  English; labels Czech.
- Remove the `LocaleSwitcher` (renders CZ→CZ, `Masthead.tsx:68-74`) and its
  dictionary entries.

### A2. Design system

Apply the design handoff's `design-tokens.css` into the Tailwind v4 `@theme`
block in `src/app/globals.css`, replacing the current tokens. If the handoff
is missing a value, defaults: chrome `#0B0B0C`, paper `#F7F7F5`, accent = the
existing `--color-ufc` red `oklch(0.52 0.22 27)`, Oktagon badge amber
`oklch(0.56 0.17 55)`, retire `--color-signal` lime and delete the legacy
ember/graphite aliases (`globals.css:39-52`) after migrating the interior
pages that still use them. Fonts stay Anton/Archivo/IBM Plex Mono via
`next/font` with `latin-ext` (`src/app/[locale]/layout.tsx:15-36`) unless the
handoff swapped the display face. Square corners; single theme; WCAG AA
verified for every new color pair (automate: a small contrast test over the
token file is welcome). Update `src/app/[locale]/articles/[slug]/opengraph-image.tsx`,
which hardcodes the retired orange `#FF5A00` palette, to the new tokens; add
a site-level default OG image from the handoff's template; ship the favicon
and `icon.svg`/`apple-icon` from the handoff (today `public/` has no favicon
at all).

### A3. Homepage rebuild

New order (components in `src/app/[locale]/page.tsx`): wire ticker → masthead
→ `masthead-billboard` ad → lead package (hero + two secondary headlines) →
Nejnovější week feed → Predikce board → Výsledky board → `infeed-rectangle`
ad → „Víte, že…" belt (keep `DidYouKnow` and the deterministic daily pick
untouched) → Bojovníci rail → newsletter band → `footer-billboard` ad →
footer. Replace `RandomRoster` (client, `Math.random`) with a deterministic
server-rendered rail: the fighters appearing on the next announced card per
organization, falling back to highest-rated fighter files. Keep server
components the default; client islands only where interaction demands
(hamburger sheet, week loader, countdown, newsletter form).

### A4. Nejnovější week windows („Objevit předchozí týden")

- Windows are ISO calendar weeks (Mon–Sun) of `publishAt`, anchored on the
  **lead article's date** — never the clock (contract 7).
- At build time, emit one static JSON chunk per non-empty week —
  `public/data/weeks/<YYYY>-W<ww>.json` (article-card metadata only: slug,
  title, dek, org, publishAt, thumb path) plus `public/data/weeks/index.json`
  listing weeks newest-first. Generate them from the repository layer inside
  a `prebuild` step or a route-handler pair with `generateStaticParams` —
  either way the output is static files.
- The feed server-renders the newest window (SEO), then a small client
  island fetches earlier chunks on demand: button „Objevit předchozí týden"
  → append previous week under a divider („Týden 3.–9. srpna" — Czech date
  formatting via `Intl` with explicit `cs-CZ` locale and UTC, not the
  machine clock) → button moves down; disappears when `index.json` is
  exhausted with a terminal line („To je zatím vše."). Empty weeks are
  skipped via the index. Section pages UFC/Oktagon use the same mechanism
  filtered by organization.
- Tests: week bucketing is pure and unit-tested across month/year boundaries;
  a test asserts the chunk emitter contains no clock reads (mirror the
  existing `tests/facts.test.mjs` determinism style).

### A5. Categories

- The site prefers an explicit `organization` field on a delivered article
  package and falls back to the existing ref-prefix derivation
  (`src/lib/boardless.ts:152-155`), so the three sealed packages keep
  working. Surface the org everywhere the design shows a kicker/badge.
  `getArticlesByOrganization` (`src/lib/repository.ts:108`) already exists —
  wire it to the UFC/Oktagon feeds. Extend
  `scripts/consume-boardless-package.mjs` validation: accept the new optional
  field, enum `ufc|oktagon`, reject anything else (see Workstream B for the
  producer side).

### A6. Ad system

- `src/data/ad-slots.json` — the slot spec (single source of truth, shared
  with quorum's admin):

  | id | desktop WxH | mobile WxH | pages |
  |---|---|---|---|
  | masthead-billboard | 970×250 (728×90 variant) | 320×100 | home, sections |
  | infeed-rectangle | 300×250 | 300×250 | home, section feeds |
  | article-top | 728×90 | 320×100 | article |
  | article-mid | 728×90 | 300×250 | article |
  | article-rail | 300×600 | — | article (desktop) |
  | footer-billboard | 970×250 | 320×100 | home |

- `data/boardless/ads.json` — the runtime manifest, delivered like everything
  else in `data/boardless/` (see B4): `{ schemaVersion: "mma-ads/1",
  updatedAt, slots: { [id]: { enabled, image: { src, width, height } | null,
  alt, href: string | null } } }`. Until the first delivery the file may be
  absent — the site treats absent/disabled/imageless slots identically.
- `AdSlot` server component: reserves the exact slot height per breakpoint
  (zero CLS), renders the placeholder from the design handoff („Místo pro
  reklamu" + dimensions in mono) when empty, the image (plain `next/image`,
  `loading="lazy"`, no tracking) when filled, wrapped in a link only when
  `href` is set. `aria-label="Reklama"` on filled slots. A contract test
  validates `ads.json` against `ad-slots.json` (unknown slot ids, wrong
  dimensions ⇒ fail).

### A7. Predikce page + FightAIQ rendering (with C, which fixes the data)

- Build `/cs/predictions` per the design: per-organization next card as bout
  rows; model lines only where `statsEntries`/`bout.prediction` exist —
  p(win) both corners in mono, thin bar, „Raný model", model version, capture
  timestamp; otherwise „Model zatím neběžel." Standing disclaimer: „Žádné
  sázkové doporučení. Predikce jsou experimentální." Odds render with source
  label and capture time. Reuse/replace `FightAiQFeed`
  (`src/components/fightaiq/FightAiQFeed.tsx`) to match.
- The Predikce board on the homepage is a trimmed version of the same
  components. FightAIQ data loads from its own lazily-fetched static JSON
  (see A9) so the 6.5 MB snapshot never blocks a page.

### A8. „Regular magazine" pass

Remove the AI-theater while staying honest (do not claim a big human
newsroom, independence, or establishment — `src/config/site.ts` guardrails
stand):

1. Footer: replace the `footer.poweredBy` engine sentence
   (`SiteFooter.tsx:151-156`, `cs.ts:595`) with a quiet publisher line:
   „© 2026 MMA Files · Vydává BoardlessAI." Make `engine.descriptor`
   rendering optional in `site.ts`.
2. `/cs/about` (`cs.ts:424-457`): rewrite as a founder-led magazine — who
   makes it (its founder and a small editorial operation with in-house data
   tooling), what it covers, its sourcing/corrections discipline. Drop
   „ohraničená rada softwarových agentů".
3. `/cs/how-it-works` (`cs.ts:379-423`): rewrite around the editorial
   process — sourcing, two-source verification, corrections, how predictions
   are made and labelled. Delete the eight internal role names (CANVAS, JAB,
   QUILL, REACH, SPLIT, AUDIT…).
4. Article sidebar methodology note (`cs.ts:94`): rewrite — it still
   describes an English+Czech two-desk process that no longer exists.
5. `<meta name="boardless-content-hash">` (`page.tsx:47`,
   `articles/[slug]/page.tsx:125`): **first** check quorum's release
   verification (`pnpm release:verify`, wired at `cycle.yml:1249-1272`) for a
   dependency on this tag. If it reads the tag, keep the tag and note it in
   your report; if not, remove it from reader HTML.
6. Footer „Sledovat" → „Sledujte nás": four inline SVG icons — Facebook,
   Instagram, Threads, X — as non-link `<span aria-hidden>` glyphs with a
   Czech visually-hidden note („připravujeme"), plus the working RSS link.
   Use icon paths from a permissively-licensed set (e.g. Simple Icons, CC0)
   inlined into the repo; no icon font, no CDN.
7. Delete `src/lib/daily.ts`'s leaked sibling dataset names if the type union
   is wider than this repo needs (`"ai-facts" | "ai-lessons"`).
8. Keep `src/lib/markdown.tsx`'s grounding-marker stripping — that is a
   correctness layer, not theater.

### A9. Performance, SEO, a11y (the bar for every page)

- Static-first: every route keeps `generateStaticParams`; no
  `dynamic = "force-dynamic"` anywhere public. Lazy data: week chunks
  (A4), a slimmed FightAIQ JSON split per surface (emit
  `public/data/fightaiq/{predictions,results,fighters}.json` at build from
  the big snapshot instead of importing 6.5 MB into every consumer), ads
  manifest. Client islands import their data with `fetch` on interaction/
  visibility, not in the initial bundle.
- Code-split below-fold homepage modules (`next/dynamic`); keep the reading
  path zero-JS. `next/image` for every image with honest `sizes` (the
  existing `PhotoSlot` pattern); hero `priority`; everything else lazy.
  Content-visibility on long lists. Ticker and countdown must not trigger
  layout (transform/opacity only), and all motion respects
  `prefers-reduced-motion` (pattern already in `globals.css:152-165`).
- Budgets, verified with a production build in your report: LCP < 2.5 s on a
  mid-range phone profile, CLS ≈ 0 (ad slots and images always reserve
  space), first-load JS of the homepage under ~120 kB gzipped.
- SEO: metadata via the existing `pageMetadata` helper for the new routes;
  `NewsArticle` JSON-LD stays; sitemap/robots/RSS keep their
  `allowIndexing` gates; RSS gains the new Predikce page link in channel
  metadata only if trivial. Redirect map covers every removed/renamed route
  (`/cs/data-desk` → `/cs/predictions`).
- A11y: skip link stays; sheet menu focus-trapped with Escape close; AA
  contrast; focus-visible styles from the handoff; `aria-current="page"` on
  active nav; Czech `lang` already set.
- Tests to add (extend the `node --test` suite): nav config completeness
  (routes exist for every nav item), week bucketing determinism, ads
  contract, dictionary shape (every new key present — leverage
  `Dictionary = typeof cs`), consume-script validation of the new
  `organization` field and `mma-ads/1`, and a smoke render of each new page
  via `next build`. Keep `tests/facts.test.mjs` and
  `tests/delivery.test.mjs` green and unmodified in intent.

---

## Workstream B — quorum: category tags + ads delivery (producer side)

### B1. `organization` on the article package

- Schema: add optional `organization: z.enum(["ufc", "oktagon"]).optional()`
  to `ArticlePackageSchema` (`orchestrator/src/contracts/mma-files.ts:65-89`).
  Precedents to follow: the additive-optional pattern of `altHeadline`
  (schemas are `looseObject`, so sealed packages round-trip and re-hash
  identically — verify with the existing hash tests), and the org enum
  already at `orchestrator/src/contracts/boardless-dataset.ts:39-41`.
- Assignment: the desk sets it at write time. `EditorialSlateSchema`
  (`orchestrator/src/contracts/mma-files.ts:125`) gains the target
  organization per slot (CANVAS chooses it when assigning); the article
  pipeline (`orchestrator/src/mma-files/pipeline.ts:163-183`, where the
  package object is assembled) writes it through, with a deterministic
  fallback derived from `eventRef ?? fighterRefs[0]` prefix — the same
  derivation the site uses, so the two can never disagree. Reject a package
  whose explicit org contradicts its ref prefixes.
- Update `state/ventures/mma-files/STYLEBOOK.md` with one desk rule: every
  article names its organization; a cross-promotion story is filed under the
  organization it leads with.
- Tests: composer/validator round-trip with and without the field; the
  three sealed packages still validate and hash.

### B2. FightAIQ end-to-end review (do this as a written review first,
then fix)

Reproduce and confirm the diagnosis, then fix in this order:

1. **Site-side event derivation** (mma-files `src/lib/boardless.ts:351-465`):
   completed cards must come from result-carrying bouts of recent events, not
   be erased by the blanket `:event:history-` filter (`:462`); make the
   `events[]` array authoritative when present instead of dead
   (`:463`); keep `card-forming`/`confirmed` semantics but stop requiring a
   status no source can produce (see B3.2). Fix the division normalizer
   (`:291-294`) to strip MediaWiki artifacts (`{{plainlist|`, leading `*`,
   doubled divisions) instead of dropping 27 of 92 fighters — and push the
   same cleanup upstream into intake so the next snapshot is clean at the
   source.
2. **Upstream store** (`orchestrator/src/fightaiq/`): retire the dead Cito
   bouts probe (`sources.ts:365-375` documents `rowCount: 0` on every run —
   stop spending 3 of 5 daily calls there); make the Wikipedia events
   fallback (`wikipedia-events.ts`) actually produce **Oktagon** events into
   `state/mma/events/` (today the store has a `ufc/` subdirectory only —
   find out why the "2026 in Oktagon MMA" parse yields nothing and fix it);
   grow the Oktagon roster allowlist (`config/mma-roster.json`, 12 names)
   from delivered event cards.
3. **Write the review** to `quorum/docs/fightaiq-review.md`: data flow
   diagram, per-source health, the corroboration ledger, model-run status,
   cost per source, and a ranked improvement list with effort estimates.
   This document is the deliverable the owner reads.

### B3. Apify + odds as new sources

Gate everything on the INBOX approvals — `APIFY-ACCOUNT-001` and the new
`APIFY-MMA-SOURCES-001` in `quorum/state/INBOX.md`. Until the owner resolves
them and `APIFY_TOKEN` exists, every new path must be a $0 no-op that reports
itself in one plain sentence, exactly like the GoVIRAL pattern.

1. **Wire Apify actors through the existing module**
   (`orchestrator/src/sources/apify.ts` — keep all four quota layers; add an
   `mma` ledger beside `goviral/source-quota/apify.json` and a $3.00/month
   MMA share cap so the two programs split the $5 free credit predictably).
   Add pinned entries to `config/mma-sources.json` following its schema:
   candidates — UFCStats scraper (`automation-lab/ufcstats-scraper`-class),
   the free ESPN MMA actor, a Cheerio-class run over Tapology promotion pages
   for Oktagon events/cards/results, Sherdog profiles for roster growth.
   **Each entry records a `termsVerdict` before its first run** (the registry
   already refused oktagonmma.com on unclear terms — same discipline), plus
   pricing shape and an evidence URL, mirroring `config/goviral-sources.json`.
2. **Odds as corroboration**: an Odds API snapshot listing a bout is an
   independent second source for that bout's existence. Feed captured odds
   events into bout `sourceRefs` so the two-independent-sources rule
   (`orchestrator/src/fightaiq/intake.ts:85-92`, mirrored in the consume
   script at `:225`) becomes satisfiable and bouts can legitimately reach
   `confirmed`. Never let one provider count twice.
3. Budget notes: The Odds API free plan (500 credits/month) is live — keep
   its quota file authoritative. Do not add any source that requires cash.
   Log expected credit burn per source in the review doc.

### B4. Banner delivery path

- New delivery kind `banner` for target mma-files in
  `.github/workflows/cycle.yml` beside `article|fightaiq|dataset`
  (`cycle.yml:1173-1181`), allowlist exactly:
  `^((data/boardless/ads\.json)|(public/ads/[a-z0-9-]+-\d+x\d+\.webp))$`.
- Producer: `orchestrator/src/mma-files/banners.ts` — takes the staged
  contract (below), validates every file hash, composes the `mma-ads/1`
  manifest, and hands it to the same delivery machinery as articles
  (`orchestrator/src/mma-files/publish.ts:12` gains the kind). Model the
  staged contract on `state/ventures/marketingshark/banner/contract.json`:
  `state/ventures/mma-files/banners/contract.json` with `files[] {path,
  sha256, bytes}`, `payloadHash`, `status: staged|delivered`, `receiptRef`.
- Consumer: extend `scripts/consume-boardless-package.mjs` with the
  `mma-ads/1` branch — validate slot ids and exact dimensions against
  `src/data/ad-slots.json`, sharp-verify each image's real pixel size, write
  atomically.

### B5. Admin rework (quorum `site/`)

The venture admin already exists (`site/src/app/admin/`, tabs declared in
`config/ventures.json:288-292`, panel
`site/src/components/admin/mma-files-admin-panel.tsx`, reader
`site/src/lib/admin-mma-files.ts`, auth via the existing session gate in
`site/src/proxy.ts` — reuse it, do not invent new auth).

1. **Restructure the MMA Files panel to mirror the new site**: tabs
   `articles | predictions | banners | calendar | social-lab`. Articles tab
   groups by week window and shows each package's organization badge +
   category placement (Nejnovější + UFC/Oktagon), flagging any package
   missing an explicit `organization`. Predictions tab surfaces FightAIQ
   health: per-source freshness/quota, event and bout counts per org,
   corroboration status, last snapshot age — the operator view of B2/B3.
2. **Banners tab**: lists the six slots from the shared spec (read
   `mma-files/src/data/ad-slots.json` — decide and document the sharing
   mechanism: vendored copy checked by a drift test is acceptable, follow the
   repo's existing mirrored-skills precedent). Per slot: current creative
   (served through a new read route beside
   `admin/api/mma-files/media/route.ts`), enabled toggle, and **upload →
   crop → stage**: client-side crop UI locked to the slot's exact aspect
   (canvas-based, no new heavy dependency without checking the repo's
   dependency posture), server route re-encodes with `sharp` (already a
   dependency) to the slot's exact pixel dimensions as webp, writes the
   staged payload + updated `contract.json` under
   `state/ventures/mma-files/banners/`, and shows the staged-vs-delivered
   diff. A „Doručit" action triggers the delivery-only workflow path the
   same way existing deliveries run; until the owner runs it, nothing
   reaches the site.
3. Keep every admin write within the admin API auth pattern
   (`site/src/lib/admin-request-auth.ts`); note `site/next.config.ts:26-45`
   traces `../config` and `../state` for `/admin` — new filesystem reads must
   stay under those roots.

---

## Workstream C — cleanup sweep (both repos, after everything lands)

1. **Stale markdown**: rewrite `mma-files/README.md` (509 lines of internal
   design prose — replace with ≤ ~150 lines a human contributor needs: what
   it is, stack, commands, content-delivery model, env vars, licensing rules;
   no self-justifying essays, no interface dumps); refresh `mma-files/NEEDED.md`
   (its "First FightAIQ check" list predates the 2026-08-08 delivery);
   update `docs/BOARDLESS-FIGHTAIQ-HANDOFF.md` to match what actually
   renders; sweep every other `.md` in both repos for claims the relaunch
   invalidated (nav lists, module names, screenshots, route names). quorum's
   `docs/NEEDED.md` gets finished items ticked and new owner items appended
   in its exact marker format.
2. **Branches** (verify merge state yourself before deleting): in mma-files
   delete `claude/magazine-widgets-datasets-pee5df`,
   `claude/orchestration-overhaul-r4cxa4` and `dev` (0 ahead of main as of
   2026-08-09) — but **keep `claude/article-image-selection-61rs70`**, which
   is unmerged and waiting on an owner decision. Reconcile the
   `commit-discipline` skill (`.claude/skills/commit-discipline/SKILL.md`)
   with reality: work now happens on session branches, not `dev` — update
   sections 4–5 accordingly. quorum has only `main`.
3. **PRs**: none were open in either repo on 2026-08-09 — re-check and close
   anything that appeared and went stale since.
4. **AI-tell check** (public site only — repo internals like `CLAUDE.md` and
   skills stay): grep the built HTML for `BoardlessAI` beyond the publisher
   line, agent role names, „agentů", „engine", `boardless-content-hash` (per
   A8.5), and confirm `/cs/about` + `/cs/how-it-works` read like a magazine.
5. Note for the owner (do not do it yourself): production still needs
   `NEXT_PUBLIC_DEMO_MODE=false` on Vercel, and indexing stays off until the
   owner flips it.

## Acceptance — run these and report the output

- mma-files: `npm run check` (typecheck + lint + test) and `npm run build`
  with `NEXT_PUBLIC_DEMO_MODE=false`; confirm every route in the new nav
  renders; confirm `/cs/data-desk` redirects; confirm the ads placeholders
  render at exact reserved sizes; confirm the week loader works with JS
  disabled (first window server-rendered) and enabled (previous weeks
  append).
- quorum: `pnpm test` (architecture drift test included) and
  `pnpm -C site typecheck && pnpm -C site build`; the composer round-trip
  tests for `organization` and `mma-ads/1`; a dry `pnpm mma:delivery -- next
  --kind fightaiq` still validates.
- Both: no guard, allowlist or test weakened; no secret committed; git log
  shows small conventional commits; both repos pushed.

## Final report (structure it exactly like this)

1. What shipped, by workstream, with commit ranges.
2. The FightAIQ review summary + link to `quorum/docs/fightaiq-review.md`.
3. Deviations from the design handoff and why.
4. The owner action list (env vars, INBOX approvals, branch decision,
   indexing flip) — nothing in it that code could have done instead.
5. Performance numbers from the production build (route sizes, LCP estimate,
   largest JSON chunks).
