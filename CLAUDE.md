# MMA Files — agent instructions

Public Czech fighting magazine. Next.js App Router + TypeScript + Tailwind v4.
No external services are required to run it.

## Always, in every session

**Invoke the `commit-discipline` skill before your first edit.** It is the
repository's commit and push contract: commit every self-contained unit of work,
never batch a whole session into one commit, and push the verified session
branch. Merge to `main` only when the task explicitly authorizes it. Do not wait
for the user to ask for a commit.

## Editorial guardrails (these are product requirements, not preferences)

- Czech is the only published locale: `LOCALES = ["cs"]`, `src/i18n/cs.ts` is
  the dictionary and the structural source of truth, and there is no other
  locale to switch to. Every article is written once, natively in Czech,
  upstream in quorum. Do not reintroduce an English locale, an English
  dictionary or a translation step.
- Never invent fight records, dates, quotes, injuries, statistics, or news
  claims. Missing data stays visibly missing — never backfilled with `0`,
  guesswork, or fake specificity.
- All seed content is fictional. It must stay labelled `isDemo: true`, carry a
  visible demo badge, and stay `noindex`.
- FightAIQ may deliver source-labelled odds, probabilities, model comparisons
  and experimental pick files. Every item must keep its capture time, model
  version and uncertainty. No affiliate links, bookmaker promotion, guaranteed
  outcomes, account automation or automatic bet placement.
- No AI-generated fighter imagery may be presented as photography, and no
  promotion logo or unlicensed photo may be used. Every new article delivery
  includes one rehosted, attributed allowlisted photo or a deterministic
  typographic fallback.
- Do not claim the publication is live, established, independent, or fully
  automated. Reader pages mention the publisher only in the fixed legal line.
- The style gate lives upstream: quorum's STYLEBOOK review runs over the Czech
  article before the package is ever delivered here. There is no
  `src/lib/style-guard.ts` in this repository and adding a second, divergent
  banned-phrase list would create two conflicting gates for the same copy.
- A delivered package may carry `localizations.cs.altHeadline`, the short Czech
  line the desk writes for a carousel cover. The reader pages use `title`; the
  consumer picks the fields it needs and ignores the rest, so a package with the
  field and one without both load. Do not render `altHeadline` as a headline on
  an article page — it is written for a square, not for a page of prose.

## Layout

- `src/content/` — fictional seed data used until a real delivery exists.
- `src/data/` — the verified fact dataset behind the "Víte, že…" belt. Real,
  checkable content, so it carries no `isDemo` and renders in demo and live mode
  alike. Append-only; `src/data/README.md` is the contract and
  `tests/facts.test.mjs` is the gate. The daily pick in `src/lib/daily-index.mjs`
  reads the lead article's date, never a clock — no `new Date()`, `Date.now()` or
  `Math.random()` may enter that path or the build stops being reproducible.
- `data/boardless/` — the only canonical write target for BoardlessAI article
  and FightAIQ delivery packages. `npm run consume:boardless` is the only path
  that writes it; nothing in this repository authors content.
- `src/lib/repository.ts` — the only sanctioned read path for content. Route
  files must not import `src/content/` directly.
- `src/i18n/` — the Czech UI dictionary. `Dictionary` is derived from `cs.ts`,
  so the published locale defines the structure rather than being checked
  against a locale nobody reads.
- `src/config/site.ts` — brand wording and indexing switches. `demoMode`
  defaults to **true** when `NEXT_PUBLIC_DEMO_MODE` is unset, so production must
  set `NEXT_PUBLIC_DEMO_MODE=false`; without it a delivery the reader cannot
  parse silently hands the magazine back to the seven fictional demo stories.

## Commands

```bash
npm run dev
npm run typecheck
npm run build
npm run test
npm run consume:boardless -- <package.json> [repository-root]
```
