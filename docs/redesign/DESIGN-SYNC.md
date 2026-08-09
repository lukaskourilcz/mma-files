repo: lukaskourilcz/mma-files
branch: main

## Last sync
date: 2026-08-09T14:36:32Z

### Updated in this project
- Read the current design system, chrome, home modules and Czech dictionary as the baseline for the relaunch.
- Wrote `design-tokens.css` — the full replacement token sheet (dark chrome / light wells, one red accent at two lightnesses).
- Wrote `MMA-FILES-RELAUNCH-CODEX.md` — the complete build spec: fonts, scales, retirements, routes, Czech strings, components, seven pages, ad slots, brand assets, a11y.
- Visual mockups not produced this turn; the spec is the deliverable.

## Screen map
| Spec section | Repo files it was written against |
| --- | --- |
| §2 Fonts | `src/app/[locale]/layout.tsx` |
| §3 Tokens & scales | `src/app/globals.css` |
| §4 Retirements | `src/components/site/HomeModules.tsx`, `src/components/site/CountUp.tsx`, `src/components/site/LocaleSwitcher.tsx`, `src/components/fighter/RandomRoster.tsx`, `src/components/ui/primitives.tsx`, `src/components/fighter/FighterCard.tsx`, `src/components/article/ArticleCard.tsx` |
| §5 Routes & nav | `src/lib/paths.ts`, `src/components/site/PrimaryNav.tsx`, `src/components/site/Masthead.tsx` |
| §6 Dictionary | `src/i18n/cs.ts`, `src/config/site.ts` |
| §7.1 Ticker | `src/components/site/WireTicker.tsx` |
| §7.2–7.3 Masthead | `src/components/site/Masthead.tsx`, `src/components/site/PrimaryNav.tsx` |
| §7.5 Lead package | `src/components/article/LeadStory.tsx` |
| §7.6–7.7 Rows & cards | `src/components/article/ArticleCard.tsx` |
| §7.9 Bout row | `src/components/fightaiq/FightAiQFeed.tsx` |
| §7.10 Výsledky board | `src/components/event/ResultsBoard.tsx`, `src/components/event/Countdown.tsx` |
| §7.11 Víte, že… belt | `src/components/site/DidYouKnow.tsx`, `src/lib/facts.ts` |
| §7.12 Fighter card | `src/components/fighter/FighterCard.tsx` |
| §7.16 Footer | `src/components/site/SiteFooter.tsx` |
| §8.1 Homepage | `src/app/[locale]/page.tsx` |
| §8.2 Section feed | `src/app/[locale]/latest/page.tsx`, `src/components/pages/OrganizationPage.tsx` |
| §8.3 Article | `src/app/[locale]/articles/[slug]/page.tsx` |
| §8.4 Predikce (new route) | `src/components/fightaiq/FightAiQFeed.tsx`, `data/boardless/fightaiq.json` |
| §8.5 Výsledky | `src/app/[locale]/results/page.tsx` |
| §8.6 Bojovníci | `src/app/[locale]/fighters/page.tsx` |
| §8.7 404 | `src/app/[locale]/not-found.tsx` |
| §10 Imagery | `src/components/media/PhotoSlot.tsx`, `src/lib/types.ts` |
| §11.3 OG template | `src/app/[locale]/articles/[slug]/opengraph-image.tsx` |
