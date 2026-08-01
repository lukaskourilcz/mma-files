# MMA Files — agent instructions

Public bilingual (EN/CS) fighting magazine. Next.js App Router + TypeScript +
Tailwind v4. No external services are required to run it.

## Always, in every session

**Invoke the `commit-discipline` skill before your first edit.** It is the
repository's commit and push contract: commit every self-contained unit of work,
never batch a whole session into one commit, and push to `main` when the session
is done. Do not wait for the user to ask for a commit.

## Editorial guardrails (these are product requirements, not preferences)

- Every public article needs **both** an English and a Czech version. Never ship
  a one-language story.
- Never invent fight records, dates, quotes, injuries, statistics, or news
  claims. Missing data stays visibly missing — never backfilled with `0`,
  guesswork, or fake specificity.
- All seed content is fictional. It must stay labelled `isDemo: true`, carry a
  visible demo badge, and stay `noindex`.
- No betting content: no odds, probabilities, tips, affiliate links, or
  bookmaker references. FightAIQ is in `data-only` mode.
- No AI-generated fighter imagery presented as photography, and no promotion
  logos or licensed photos. Heroes are typographic and deterministic.
- Do not claim the publication is live, established, independent, or fully
  automated. BoardlessAI wording is configurable in `src/config/site.ts`.
- Banned phrase lists for both desks live in `src/lib/style-guard.ts`. Run
  `npm run typecheck` — the guard is unit-checked at module load in dev.

## Layout

- `src/content/` — seed data (articles, fighters, events). Replace this, not the
  components, when a real feed arrives.
- `src/lib/repository.ts` — the only sanctioned read path for content. Route
  files must not import `src/content/` directly.
- `src/i18n/` — UI dictionaries. Both locales must stay complete; the type
  system enforces it.
- `src/config/site.ts` — brand, engine wording, indexing switches.

## Commands

```bash
npm run dev
npm run typecheck
npm run build
```
