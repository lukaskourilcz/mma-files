# Codex prompts — MMA Files relaunch

Run in order. Each assumes `MMA-FILES-RELAUNCH-CODEX.md` and `design-tokens.css` are in the repo root.

---

## Prompt 1 — Fonts and tokens

Read `MMA-FILES-RELAUNCH-CODEX.md` §1–§3 and `design-tokens.css`. Replace the `@theme` block in `src/app/globals.css` with the one from `design-tokens.css`, keeping the `@layer base` block below it. Keep the existing Anton import in `src/app/[locale]/layout.tsx` with `subsets: ["latin","latin-ext"]` and the `--font-anton` variable; keep Archivo and IBM Plex Mono. Add the `.display`, `.display-700` and `.label-mono` component classes per §2. Both display classes use Anton 400. Run `npm run check`.

---

## Prompt 2 — Retire the evidence system

Follow `MMA-FILES-RELAUNCH-CODEX.md` §4 exactly: delete the listed files, exports, tokens and dictionary keys. Keep `fighter.fieldStates` in `src/lib/types.ts` and the repository layer — only stop rendering it; a field with no value is omitted, not shown as a gap. Keep `isDemo` and `isRenderable()`. Fix every resulting type error rather than stubbing anything out. Run `npm run check`.

---

## Prompt 3 — Routes, nav, dictionary

Follow `MMA-FILES-RELAUNCH-CODEX.md` §5 and §6. Add `predictions: (l) => `/${l}/predikce`` to `src/lib/paths.ts` and create `src/app/[locale]/predikce/page.tsx` as a stub. Set the primary nav to exactly: Nejnovější, UFC, Oktagon, Predikce, Zápasový týden, Výsledky, Bojovníci. Remove Čísla from the nav and add it to the footer Redakce column; leave its route at `/data-desk`. Delete the locale switcher and `siteConfig.tagline`. Add every key in §6 to `src/i18n/cs.ts` verbatim — these are final Czech strings, do not reword them.

---

## Prompt 4 — Chrome

Build `MMA-FILES-RELAUNCH-CODEX.md` §7.1, §7.2, §7.3 and §7.16: wire ticker, desktop masthead, mobile masthead with the full-height sheet menu, and the footer. The sheet must trap focus, close on Esc, restore focus to the hamburger and lock body scroll. Social icons are `aria-hidden` spans with no href; only RSS links. The footer bottom band reads „© 2026 MMA Files · Vydává BoardlessAI" and nothing on the site mentions AI, agents, engines or automation.

---

## Prompt 5 — Ad slots and imagery

Build `src/components/ads/AdSlot.tsx` per `MMA-FILES-RELAUNCH-CODEX.md` §7.4 and §9, and rewrite `src/components/media/PhotoSlot.tsx` per §10. Every slot reserves its exact height at 1440 and 390 before load — verify CLS from ads is 0. `article-rail` renders nothing below `lg` and reserves nothing. Placeholders read „Místo pro reklamu" plus the dimensions in mono type.

---

## Prompt 6 — Components

Build the rest of `MMA-FILES-RELAUNCH-CODEX.md` §7: lead package, news row, article card (default + compact), week pagination with its loaded state and week divider, Predikce bout row, Výsledky board, „Víte, že…" belt, fighter card, buttons/chips/badges, „Ukázkový obsah" chip, correction notice, skeletons, empty states. Square corners, hairlines, 3px red underline as the only hover/active idiom, tabular mono for every number.

---

## Prompt 7 — Pages

Build `MMA-FILES-RELAUNCH-CODEX.md` §8: homepage, section feed (Nejnovější / UFC / Oktagon on one template), article page, Predikce, Výsledky, Bojovníci, 404 — desktop 1440 and mobile 390. Then work the §13 acceptance checklist item by item and report which ones fail. Hard rules: no probability without a model version and capture timestamp, no 50/50 defaults, „Model zatím neběžel" wherever a bout has no model line, and the betting disclaimer visible without scrolling on `/cs/predikce`.
