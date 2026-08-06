# MMA Files — agent instructions

Public Czech fighting magazine. Next.js App Router + TypeScript + Tailwind v4.
No external services are required to run it.

## Always, in every session

**Invoke the `commit-discipline` skill before your first edit.** It is the
repository's commit and push contract: commit every self-contained unit of work,
never batch a whole session into one commit, and push to `main` when the session
is done. Do not wait for the user to ask for a commit.

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
  automated. BoardlessAI wording is configurable in `src/config/site.ts`.
- The style gate lives upstream: quorum's STYLEBOOK review runs over the Czech
  article before the package is ever delivered here. There is no
  `src/lib/style-guard.ts` in this repository and adding a second, divergent
  banned-phrase list would put two desks in disagreement about the same copy.

## Layout

- `src/content/` — fictional seed data used until a real delivery exists.
- `data/boardless/` — the only canonical write target for BoardlessAI article
  and FightAIQ delivery packages. `npm run consume:boardless` is the only path
  that writes it; nothing in this repository authors content.
- `src/lib/repository.ts` — the only sanctioned read path for content. Route
  files must not import `src/content/` directly.
- `src/i18n/` — the Czech UI dictionary. `Dictionary` is derived from `cs.ts`,
  so the published locale defines the structure rather than being checked
  against a locale nobody reads.
- `src/config/site.ts` — brand, engine wording, indexing switches. `demoMode`
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
