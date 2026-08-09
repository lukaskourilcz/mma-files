# MMA Files — relaunch build spec (for Codex)

Target repo: `lukaskourilcz/mma-files` (Next.js 15 App Router, React 19, TypeScript strict, Tailwind CSS v4).
This document is the complete design handoff. Everything below is implementable against the current tree without new dependencies.

Reader-facing language is **Czech only**. Every string quoted in this document with `„…"` is final copy — use it verbatim, diacritics included. Any string you need that is not here, write in Czech.

---

## 0. Order of work

1. Fonts + `@theme` token block (§2, §3).
2. Retire the evidence system (§4). Do this before building components — half the component surface disappears.
3. Routes and nav (§5), dictionary (§6).
4. Primitives and components (§7).
5. Pages (§8).
6. Ad slots (§9), imagery (§10), brand assets (§11).
7. Accessibility pass (§12), acceptance checklist (§13).

---

## 1. Decisions taken, and where they differ from the original brief

| # | Decision | Why |
|---|---|---|
| 1 | **Display face is Barlow Condensed 700/800, not Anton.** | Anton ships one weight, so headline, kicker, section title and board figure would all sit at the same weight and the hierarchy would have to be carried by size alone. Barlow Condensed gives 700 for section headings and board data, 800 for headlines and the wordmark, keeps the condensed poster proportions, and covers Latin Extended. Loaded via `next/font/google` exactly like Anton was. |
| 2 | **The accent red is two tokens, not one.** | `oklch(0.52 0.22 27)` is 6.2:1 on `#F7F7F5` but only 2.9:1 on `#0B0B0C` — it fails AA as text on the chrome, and the brief puts red kickers on a black hero band. `--color-accent-on-dark: oklch(0.68 0.19 27)` is 5.8:1 on chrome. Same hue, same red; pick by background. |
| 3 | **The evidence system is removed.** | Per your answer: no `Složka NNN` file numbers, no source counts on cards, no `Ověřeno / Předběžné / Sporné / Nedostupné` field-state chips, no `Čísla` homepage module. `„Zdroje"` on the article page stays (it is in the brief), and honest empty states stay. |
| 4 | **`Čísla` / Datová redakce survives as a footer-only page.** | Removed from the primary nav; added as the last item of the footer `Redakce` column. Its route does not change, so no redirects. |
| 5 | **Tagline retired.** | „Zápas je zpráva. Složka je důkaz." comes out of the footer, the masthead, and `siteConfig.tagline`. The footer brand column takes a plain one-line Czech blurb instead. |
| 6 | **Lime (`--color-signal`) is gone.** | Replaced by the red everywhere it was load-bearing (ticker pip, hero plate, chips). No green or lime remains in the palette. |
| 7 | **Mockup content uses real fighter names and carries no demo badge.** | The `„Ukázkový obsah"` chip is still specified as a component (§7.14) because fictional placeholder content must carry it — it is simply not on any of these screens. |
| 8 | **Locale switcher and `LocaleSwitcher.tsx` are deleted.** | Czech only, and the file is dead weight the moment the switcher goes. |
| 9 | **No search field in v1.** | As briefed. Leave no placeholder for it in the masthead grid. |

---

## 2. Fonts

`src/app/[locale]/layout.tsx` — replace the Anton import:

```ts
import { Archivo, Barlow_Condensed, IBM_Plex_Mono } from "next/font/google";

const display = Barlow_Condensed({
  subsets: ["latin", "latin-ext"],   // latin-ext is required: Č Ř Š Ť Ž Ů Ě Á Í Ý Ú Ň Ď
  weight: ["700", "800"],
  variable: "--font-barlow-condensed",
  display: "swap",
  fallback: ["Arial Narrow", "sans-serif"],
});

const archivo = Archivo({
  subsets: ["latin", "latin-ext"],
  variable: "--font-archivo",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
  fallback: ["ui-monospace", "monospace"],
});
```

Apply `${display.variable} ${archivo.variable} ${plexMono.variable}` to `<html>` as today. Delete `--font-anton`.

**Rendering rules**

- `.display` — `font-family: var(--font-display); font-weight: 800; text-transform: uppercase; letter-spacing: 0.002em; line-height: var(--leading-display)` (0.94). Barlow Condensed's caron and acute marks clear the line above at 0.94; **do not go below 0.9**, and 0.9 only on guaranteed single lines. The old 1.16 was an Anton workaround and is no longer needed — it will look loose here.
- `.display-700` — same, weight 700. Section headings, board column headings, table headings.
- `.label-mono` — `font-family: var(--font-mono); font-size: var(--text-mono-xs); font-weight: 500; letter-spacing: var(--tracking-kicker); text-transform: uppercase; font-variant-numeric: tabular-nums`.
- Every date, time, record, probability, score and dimension is `--font-mono` with `font-variant-numeric: tabular-nums`. No exceptions — columns of numbers must align.
- Body copy is Archivo 400; `strong` is 600. Never synthesise weights (`font-synthesis-weight: none`, already in the base layer).

---

## 3. Tokens, scales, breakpoints

The full sheet ships as `design-tokens.css` alongside this file. Paste its `@theme` block into `src/app/globals.css`, replacing the current one, and keep the `@layer base` block below it (minus the retired rules in §4).

### Type scale (in tokens as `--text-*`)

| Token | Mobile 390 | Desktop 1440 | Use |
|---|---|---|---|
| `--text-d1` | 44 | 88 | Hero headline |
| `--text-d2` | 36 | 64 | Page title (section feed, Predikce, Výsledky, Bojovníci, 404) |
| `--text-d3` | 28 | 48 | Lead secondary headlines, article headline on mobile |
| `--text-d4` | 24 | 36 | Section heading |
| `--text-d5` | 28 | 28 | Board column heading (UFC / OKTAGON) |
| `--text-d6` | 22 | 22 | Card headline, bout-row fighter name |
| `--text-lg` … `--text-xs` | 20 / 18 / 17 / 15 / 13 | same | Dek, body, UI, caption |
| `--text-mono-lg` … `-xs` | 16 / 13 / 12 / 11 | same | Probabilities, data, timestamps, kickers |

Article headline is `--text-d2` on desktop, `--text-d3` on mobile. Kickers never drop below 11px.

### Spacing scale

4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64 / 80 / 96 / 120, as `--space-1 … --space-30`. Nothing off the scale.

Vertical rhythm: **80px** between homepage sections on desktop (`--space-20`), **48px** on mobile (`--space-12`). Inside a section, heading → content is 24px; list-row padding is 16px vertical.

### Breakpoints

| Name | Width | What changes |
|---|---|---|
| base | 0–767 | Single column. Mobile masthead (hamburger + centred wordmark, 52px). Mobile ad variants. Boards stack. |
| `md` | 768 | Desktop masthead (64px, inline nav). Gutters go 20 → 40. Two-column lists. |
| `lg` | 1024 | Article right rail appears. Boards go side by side. Fighter grid 3 → 4 columns. |
| `xl` | 1280 | Lead package goes to the 7/5 split. |
| max | 1440 | Container caps at `--layout-max`; gutters hold at 40. |

Design widths: **1440** and **390**.

### Geometry

Square corners everywhere (`--radius: 0`). Hairlines are 1px `--color-rule` inside a well, `--color-rule-strong` between sections, `--color-rule-dark` inside a chrome block. The one thick line on the site is the **3px red underline** (`--border-underline`) used for hover and active states. No shadows, no gradients except the two image scrims in §10.

---

## 4. Retirement checklist (do this first)

**Delete these files**

- `src/components/site/CountUp.tsx`
- `src/components/site/LocaleSwitcher.tsx`
- `src/components/fighter/RandomRoster.tsx` (the rail becomes a static four-card rail, §7.12)

**Delete these exports**

- `HomeModules.tsx` → `DataDeskModule`, `DemoNotice` (the badge is reborn as `NoteChip`, §7.14), `DeskLinks`
- `primitives.tsx` → `MissingValue`, the `success` / `warning` / `danger` / `ember` chip tones, `Kicker`'s `tone` branch for lime
- `FighterCard.tsx` → `FieldStateChip`, `EvidenceCoverage`; strip `fieldStates` handling out of `TaleOfTheTape` and `FighterCard`
- `ArticleCard.tsx` → `FileNumber`, and the source-count footer element

**Delete these tokens** (`globals.css`)

`--color-signal`, `--color-verified`, `--color-provisional`, `--color-disputed`, `--color-gap`, `--color-ember`, `--color-ember-soft`, `--color-graphite`, `--color-muted`, `--color-rule-dark-strong`, `--color-success`, `--color-warning`, `--color-danger`, `--animate-rise`, `--animate-wipe`, `--animate-wipe-slow`, and the `.stripes` / `.grid-rules` component classes (replaced in §10).

**Delete these dictionary keys** (`src/i18n/cs.ts`)

`labels.file`, `labels.sourceCount`, `labels.confirmed`, `labels.unconfirmed`, `labels.noneUnconfirmed`, `fieldStates`, `home.markingTitle`, `home.markingNote`, `home.visibleGap`, `dataDesk.statesTitle`, `dataDesk.statesDek`, `dataDesk.stateHelp`, `meta.switchLabel`, `meta.switchShort`, `nav.localeSwitch`, `demo.bannerLabel`, `demo.bannerBody`, `demo.dataBadge`, `demo.dataNotice`.

**Keep** `fighter.fieldStates` in `src/lib/types.ts` and in the repository layer. The data contract with FightAIQ is unchanged; the site simply stops rendering the states. A field that is `unavailable` renders as **nothing at all** — the row is omitted, not shown as a gap.

**Keep** the `isDemo` flag and the publication gate `isRenderable()` exactly as they are.

---

## 5. Routes, nav, IA

### Primary nav — this order, these labels

`„Nejnovější"` · `„UFC"` · `„Oktagon"` · `„Predikce"` · `„Zápasový týden"` · `„Výsledky"` · `„Bojovníci"`

`src/lib/paths.ts` — add one builder, keep the rest:

```ts
predictions: (l: Locale) => `/${l}/predikce`,
```

New route: `src/app/[locale]/predikce/page.tsx` (§8.4).

`dataDesk` stays at `/[locale]/data-desk`, drops out of the nav, and is linked from the footer `Redakce` column as `„Čísla"`.

Active state: the item matching the current path, or a prefix of it (`/cs/ufc/…` activates `UFC`). Active = `--color-text` at weight 700 **plus** a 3px `--color-accent` underline flush to the bottom of the masthead. Hover on an inactive item = the same underline, no colour change on the label.

### Article organisation kicker

Kicker above an article headline is the organisation name set in our own type — `UFC` or `OKTAGON`, uppercase, `--font-mono`, 11–12px, `--tracking-kicker`, `--color-accent` on paper / `--color-accent-on-dark` on chrome. Never a logotype, never an image.

---

## 6. Dictionary additions (`src/i18n/cs.ts`)

Add these keys. Every value is final copy.

```ts
nav: {
  latest: "Nejnovější",
  ufc: "UFC",
  oktagon: "Oktagon",
  predictions: "Predikce",
  fightWeek: "Zápasový týden",
  results: "Výsledky",
  fighters: "Bojovníci",
  menu: "Menu",
  closeMenu: "Zavřít menu",
  skipToContent: "Přejít na obsah",
},

wire: { label: "Drát" },

ads: {
  placeholder: "Místo pro reklamu",
  slotLabel: (w: number, h: number) => `${w} × ${h}`,
},

home: {
  latestTitle: "Nejnovější",
  loadPreviousWeek: "Objevit předchozí týden",
  weekDivider: (from: string, to: string) => `Týden ${from}–${to}`, // → „Týden 3.–9. srpna"
  predictionsTitle: "Predikce",
  resultsTitle: "Výsledky",
  lastCard: "Poslední karta",
  nextCard: "Další karta",
  noArchivedCard: "Žádná odjetá karta v archivu",
  fightersTitle: "Bojovníci",
  emptyWeek: "V tomto týdnu nevyšel žádný text.",
},

didYouKnow: {
  kicker: "Víte, že…",
  verified: "ověřeno",
  source: "Zdroj",
  ariaLabel: "Ověřený fakt dne",
},

article: {
  byline: "Redakce MMA Files",
  sources: "Zdroje",
  related: "Související texty",
  moreFromSection: "Další z rubriky",
  correction: "Oprava",
  demoBadge: "Ukázkový obsah",
  photoCredit: (author: string, licence: string) => `Foto: ${author} · ${licence}`,
},

predictions: {
  title: "Predikce",
  intro:
    "Predikce vytváří náš vlastní model FightAIQ. Jsou experimentální: popisují, co model spočítal z dohledatelných dat, ne co se stane.",
  disclaimer: "Žádné sázkové doporučení. Predikce jsou experimentální.",
  earlyModel: "Raný model",
  modelVersion: "Verze modelu",
  captured: (stamp: string) => `zachyceno ${stamp}`, // → „zachyceno 8. 8. 2026, 06:01"
  noModel: "Model zatím neběžel",
  rounds: (n: number) => `${n} × 5:00`,
  oddsSource: "Kurz: agregovaný průměr trhu",
  tableHeadings: {
    bout: "Zápas",
    division: "Váha",
    rounds: "Kola",
    model: "Model",
  },
},

results: {
  title: "Výsledky",
  defeated: "por.",            // → „Procházka por. Hill · TKO, 2. kolo"
  round: (n: number) => `${n}. kolo`,
  empty: "Žádná odjetá karta v archivu",
  monthGroup: (month: string) => month, // „srpen 2026", lowercase Czech month + year
  expand: "Rozbalit kartu",
  collapse: "Sbalit kartu",
},

fighters: {
  title: "Bojovníci",
  filterAll: "Vše",
  filterUfc: "UFC",
  filterOktagon: "OKTAGON",
  empty: "Žádný bojovník neodpovídá filtru.",
},

newsletter: {
  title: "Zápasový týden v jednom e-mailu.",
  dek: "Jednou týdně, česky. Karty, výsledky a co k nim redakce vydala.",
  placeholder: "vas@email.cz",
  submit: "Odebírat",
},

footer: {
  blurb: "Zpravodajství o UFC a Oktagonu. Každý text má u sebe zdroje.",
  sections: "Rubriky",
  desk: "Redakce",
  follow: "Sledujte nás",
  about: "O MMA Files",
  howItWorks: "Jak to funguje",
  standards: "Redakční standardy",
  corrections: "Opravy",
  privacy: "Soukromí",
  newsletter: "Newsletter",
  numbers: "Čísla",
  rss: "RSS",
  legal: "© 2026 MMA Files · Vydává BoardlessAI",
},

notFound: {
  title: "Stránka nenalezena",
  back: "Zpět na Nejnovější",
},

states: {
  loading: "Načítáme…",
  loadingMore: "Načítáme předchozí týden…",
},
```

Nothing in the footer, the masthead or any body copy mentions AI, agents, engines or automation. `„Vydává BoardlessAI"` is a publisher line and is the only mention of the company.

---

## 7. Components

Every component below is square-cornered, uses tokens only, and has a visible focus ring: `outline: 2px solid currentColor; outline-offset: 3px` (on chrome: `--color-text-inverse`).

### 7.1 Wire ticker — `src/components/site/WireTicker.tsx`

- Full-bleed strip, height `--layout-ticker-h` (34px), `--color-chrome`, sits above the masthead and scrolls away with the page (not sticky).
- Left cap: label `„Drát"`, `--font-mono` 10px/`0.18em` uppercase, `--color-chrome` text on a `--color-accent` fill, 14px horizontal padding, full strip height. A 6px square live dot in `--color-chrome` on the fill, `--animate-livedot`.
- Items: `--font-mono` 11px, `--tracking-mono`, `--color-text-inverse-meta`, with the source tag in `--color-text-inverse` weight 600 before the text, separated by a 4px `--color-accent` square. Item padding 0 20px.
- Marquee: the item list is rendered twice, the second pass `aria-hidden`, animated with `--animate-ticker` (48s). Whole strip is `<aside aria-label="Drát">`.
- **Reduced motion:** animation off, container becomes `overflow-x: auto` with momentum scrolling. Already covered by the global block plus `@media (prefers-reduced-motion: reduce) { .ticker-track { animation: none; } .ticker-viewport { overflow-x: auto; } }`.
- Mobile: identical, one line, scrollable.

### 7.2 Masthead, desktop ≥768 — `src/components/site/Masthead.tsx`

- Sticky, `top: 0`, `z-40`, height `--layout-chrome-h` (64px), background `--color-chrome`, bottom hairline `--color-rule-dark`.
- Grid: `[wordmark] [nav] [spacer]` — wordmark left with 40px gutter, nav starting at 320px and running right, right edge free (no search, no language switcher).
- Wordmark: the mark (§11) at 26px cap height + `MMA FILES` in `.display` 800, 26px, `--leading-display-tight`, `--color-text-inverse`, letter-spacing 0.01em.
- Nav items: Archivo 700, 13px, uppercase, `0.09em`, `--color-text-inverse-muted`; 20px horizontal padding; full-height flex so the 3px underline sits on the masthead's bottom edge. Active/hover per §5. Each item is ≥44px tall by construction.
- Skip link `„Přejít na obsah"` — visually hidden until focused, then a `--color-accent` block top-left.

### 7.3 Masthead, mobile ≤768

- Height `--layout-chrome-h-sm` (52px), sticky, `--color-chrome`.
- Grid: hamburger left (44×44 hit area, three 18px × 2px `--color-text-inverse` bars, 5px apart), wordmark optically centred, right cell empty but reserved at 44px so the wordmark stays centred.
- **Sheet menu:** `position: fixed; inset: 0`, `--color-chrome`, `z-60`, opens from the hamburger. Header row repeats the wordmark and swaps the hamburger for a 44×44 close (two crossed 18px bars), labelled `„Zavřít menu"`.
  - Seven nav items stacked, `.display` 700, 36px, `--leading-display`, `--color-text-inverse`, 20px vertical padding each, hairline `--color-rule-dark` between.
  - Active item: label in `--color-accent-on-dark` **plus** a 3px × 28px `--color-accent` bar in the left gutter, vertically centred on the label.
  - Below the list, separated by 32px: the four social icons (§7.15) in a 24px-gap row.
  - Focus trap while open, `aria-expanded` on the trigger, `Esc` closes, body scroll locked, focus returns to the trigger.

### 7.4 Ad slot — `src/components/ads/AdSlot.tsx` (new)

```tsx
type AdSlotName =
  | "masthead-billboard" | "infeed-rectangle" | "article-top"
  | "article-mid" | "article-rail" | "footer-billboard";
```

- Renders a `<div role="complementary" aria-label="Reklama">` whose **height is reserved from the slot table (§9) before anything loads**. Reserve with `aspect-ratio` on a max-width box, or explicit `height` at each breakpoint — never `min-height: 0` plus content-driven growth. Zero CLS is a hard requirement.
- Empty state: `--color-well` background, 1px dashed `--color-rule-dashed` border, centred stack — `„Místo pro reklamu"` in `--font-mono` 12px uppercase `0.14em` `--color-text-meta`, and beneath it the dimensions in `--font-mono` 11px `--color-text-meta` (`970 × 250`).
- Filled state: the creative fills the box edge to edge, dashed border and labels removed, box dimensions unchanged.
- Slots that are desktop-only (`article-rail`) render nothing below `lg` — and reserve nothing.
- `article-rail` is `position: sticky; top: calc(var(--layout-chrome-h) + 24px)`.

### 7.5 Lead package — `src/components/article/LeadStory.tsx`

Desktop ≥1280: a full-width band on `--color-chrome`, inner grid `7fr 5fr`, 48px gap, 64px vertical padding.

- **Left:** full-bleed 3:2 image slot with a bottom scrim (§10). No text over the image.
- **Right, stacked:** kicker (`UFC` / `OKTAGON`, mono 12px, `--tracking-kicker`, `--color-accent-on-dark`) → headline `.display` 800 at `--text-d1`, `--color-text-inverse`, max 14 characters per line at the top step → dek Archivo 20px/1.5 `--color-text-inverse-muted`, max 46ch → timestamp mono 12px `--color-text-inverse-meta`.
- Below the grid, separated by a `--color-rule-dark` hairline and 32px: **two secondary headlines** side by side, each kicker + headline `.display` 700 at `--text-d3` + timestamp. Vertical hairline between them.
- 1024–1279: grid becomes `1fr 1fr`, headline steps to `--text-d2`.
- Mobile: image (3:2, full-bleed to the gutters) → kicker → headline at 44px → dek 17px → timestamp. Secondaries stack, hairline between, no vertical rule.
- The whole left image and the headline are one link target per story.

### 7.6 News list row (`Nejnovější`) — `src/components/article/ArticleRow.tsx` (new; replaces the card grid on the homepage)

- Row grid: `[thumb 160px] 20px [text 1fr] 24px [timestamp auto]` on desktop; `[thumb 96px] 12px [text]` with the timestamp wrapping under the headline on mobile.
- Thumb: 16:9, square corners, `--color-well` placeholder.
- Text: kicker (org, mono 11px, `--color-accent`) → headline Archivo 700 17px/1.3 `--color-text` (hover: 3px red underline, `text-underline-offset: 4px`).
- Timestamp: mono 12px `--color-text-meta`, right-aligned, tabular. Relative for < 24 h (`před 3 h`), absolute after (`8. 8. 2026`) — use `Intl.RelativeTimeFormat("cs")`, already in `format.ts`.
- Hairline `--color-rule` between rows; 16px vertical padding; whole row is a link, hover tints the row `--color-card`.
- 5–7 rows per week block.

### 7.7 Article card — `src/components/article/ArticleCard.tsx` (rewritten)

Two variants, both on `--color-card` with a 1px `--color-rule-strong` border:

- **`default`** — 16:9 image slot, then 16px padding: kicker, headline Archivo 700 at `--text-d6`, dek 15px/1.5 `--color-text-muted` clamped to 3 lines, timestamp mono 12px pinned to the bottom. Used in the section feed grid and in `Související texty`.
- **`compact`** — no image, no dek: kicker, headline 15px, timestamp. Used in the article rail's `„Další z rubriky"`.
- Hover: border goes `--color-text`, headline gains the 3px red underline. No lift, no shadow.

### 7.8 Week pagination

- Button: full container width, 56px tall, 1px `--color-text` border, transparent fill, label `„Objevit předchozí týden"` in Archivo 800, 13px, uppercase, `0.1em`. Hover: fill `--color-text`, label `--color-paper`. Focus ring as standard.
- Pressed → button enters a loading state: label swaps to `„Načítáme předchozí týden…"`, `aria-busy="true"`, and three skeleton rows (§7.17) render beneath it.
- Loaded → skeletons are replaced by a **week divider** followed by that week's rows. Divider: a 1px `--color-rule-strong` line with the label `„Týden 3.–9. srpna"` sitting on it, `--font-mono` 11px uppercase `0.16em` `--color-text-meta`, `--color-paper` padding either side of the label. The button re-renders below the appended block.
- When no earlier week exists, the button is removed (not disabled) and `„V tomto týdnu nevyšel žádný text."` is not shown — an absent button is the honest end of the list.

### 7.9 Predikce board / bout row — `src/components/fightaiq/BoutRow.tsx` (new)

The board is a table (`<table>`, real `<thead>`), one per organisation, on `--color-chrome`.

- Board header: organisation name in `.display` 700 at `--text-d5`, `--color-badge-ufc-on-dark` or `--color-badge-oktagon-on-dark`; event name and date to its right in mono 12px `--color-text-inverse-meta`; 3px underline in the same accent under the whole header row.
- Column headings: mono 11px uppercase `0.16em` `--color-text-inverse-meta` — `Zápas` / `Váha` / `Kola` / `Model`.
- **Row with a model line** (grid `1fr 160px 64px 280px`, 20px vertical padding, hairline `--color-rule-dark`):
  - Fighters: `Jméno` + `vs` + `Jméno`, Archivo 700 at `--text-d6`, `--color-text-inverse`; `vs` in mono 12px `--color-text-inverse-meta`.
  - Division, rounds: mono 13px `--color-text-inverse-muted`.
  - Model cell, two stacked lines — one per fighter: `[name 1fr] [bar 96px] [pct 48px]`. Percentage in `--font-mono` `--text-mono-lg` tabular, `--color-text-inverse`. Bar: 4px tall track `--color-rule-dark`, fill `--color-accent-on-dark` for the higher probability and `--color-text-inverse-meta` for the lower. Under the pair: `„Raný model" · v2.3.1 · „zachyceno 8. 8. 2026, 06:01"` in mono 11px `--color-text-inverse-meta`.
  - The bar is decorative: `aria-hidden`, with the number as the accessible value.
- **Row without a model line:** the whole model cell is the single line `„Model zatím neběžel"` in mono 12px `--color-text-inverse-meta`, italic off, no bar, no zero. Never render 50/50.
- **Odds**, where present: a third line in the model cell — `„Kurz: agregovaný průměr trhu"` + value + `„zachyceno …"`, mono 11px. No bookmaker names, no logos, no outbound links.
- Mobile: the table becomes stacked blocks — fighters on one line, `váha · kola` in mono beneath, then the two probability rows full width. Column headings are dropped (they read as labels in the stacked form).

### 7.10 Výsledky board (homepage) — `src/components/event/ResultsBoard.tsx` (rewritten)

Two equal columns on `--color-card`, 40px gap, stacked on mobile.

- Column header: organisation in `.display` 700 `--text-d5` (`--color-badge-ufc` / `--color-badge-oktagon`), 3px underline in the same colour, event name + date on the right in mono 12px `--color-text-meta`.
- `„Poslední karta"`: three result lines. Each is one row — winner in Archivo 700 17px, then `„por."` in mono 12px `--color-text-meta`, then the loser in Archivo 400 17px `--color-text-muted`, then a middle dot and the method in mono 13px `--color-text`: `Procházka por. Hill · TKO, 2. kolo`. A draw or no contest sets both names at 400 and reads `Jméno vs Jméno · Bez výsledku`.
- `„Další karta"`: event name, date, and a countdown — four mono numerals with `Dny / Hod / Min / Sek` labels beneath in mono 10px. Server renders the static date; the clock starts after hydration (keep the existing `Countdown.tsx` behaviour).
- **Empty column:** 1px dashed `--color-rule-dashed` box, 120px min height, centred `„Žádná odjetá karta v archivu"` in mono 12px uppercase `--color-text-meta`. The next-card block still renders beneath it if one exists.

### 7.11 `„Víte, že…"` belt — `src/components/site/DidYouKnow.tsx`

- Full-bleed band, `--color-accent` fill, 24px vertical padding, `--color-paper` text. This is the only saturated band on the page.
- Inner grid: `„Víte, že…"` in `.display` 700 22px, then the fact in Archivo 500 17px/1.5 (max 72ch), then a right-aligned block: `„ověřeno"` + date in mono 11px, and the source line in mono 11px underneath at 80% opacity.
- The `„ověřeno"` mark is a 5px square in `--color-paper` before the word — not an icon, not a checkmark glyph.
- Mobile: stacks; the verified line moves under the fact.
- Contrast: `--color-paper` on `--color-accent` is 7.3:1.

### 7.12 Fighter card — `src/components/fighter/FighterCard.tsx` (rewritten)

- 4:5 portrait placeholder (§10) on top, `--color-card` body below, 1px `--color-rule-strong` border.
- Organisation badge sits on the portrait, bottom-left, 12px inset: solid `--color-badge-ufc` / `--color-badge-oktagon` fill, white label, mono 10px uppercase `0.16em`, 8px × 5px padding.
- Body, 16px padding: name in `.display` 700 at `--text-d6` (`--color-text`), division in Archivo 400 13px `--color-text-muted`, record in `--font-mono` 13px tabular `--color-text` on its own line (`12–2–0`, en dashes).
- No record on file → the record line is omitted entirely.
- Homepage rail: four cards in a row on desktop, 2×2 on mobile. Bojovníci page: 4 columns at `lg`, 3 at `md`, 2 at base.

### 7.13 Buttons, chips, badges

| Element | Spec |
|---|---|
| Primary button | `--color-accent` fill, `--color-paper` label, Archivo 800 13px uppercase `0.1em`, 16px × 24px padding, min height 48px. Hover `--color-accent-press`. |
| Secondary button | 1px `--color-text` border, transparent, `--color-text` label. Hover inverts to `--color-text` fill. On chrome: 1px `--color-text-inverse`, inverts to `--color-text-inverse` fill with `--color-chrome` label. |
| Filter chip | 1px `--color-rule-strong` border, `--color-card`, Archivo 700 12px uppercase `0.1em`, 10px × 16px padding, min height 44px. **Selected:** `--color-text` fill, `--color-paper` label, no border. `role="radio"` inside a `role="radiogroup"`, arrow-key navigable. |
| Organisation badge | Solid `--color-badge-*`, white label, mono 10px uppercase `0.16em`, 5px × 8px. Text only — never a logotype. |
| Kicker | mono 11–12px uppercase `--tracking-kicker`, `--color-accent` on light / `--color-accent-on-dark` on chrome. No tick, no bullet. |

### 7.14 `„Ukázkový obsah"` chip

Inline chip: `--color-note` fill, `--color-note-ink` label, mono 10px uppercase `0.16em`, 4px × 8px padding, square. Sits immediately after the kicker on an article header and after the headline in a list row. Only fictional placeholder content carries it; real reporting never does. None of the mockup screens use it.

### 7.15 Correction notice — `„Oprava"`

Block above the article body, below the hero image:

- 1px `--color-correction-rule` border, `--color-correction` fill, 20px padding.
- Row one: `„Oprava"` in `.display` 700 18px + the correction date in mono 12px `--color-text-meta`.
- Row two: the correction text in Archivo 400 15px/1.6 `--color-text`.
- Multiple corrections stack newest-first inside one block, hairline between.
- Never restyles or hides the original text.

### 7.16 Footer — `src/components/site/SiteFooter.tsx`

`--color-chrome`, 64px top padding, 40px bottom. Four columns on desktop (`5fr 2fr 3fr 2fr`), stacked on mobile with 40px gaps.

1. **Brand:** mark + `MMA FILES` in `.display` 800 26px `--color-text-inverse`; below it the blurb `„Zpravodajství o UFC a Oktagonu. Každý text má u sebe zdroje."` in Archivo 400 15px `--color-text-inverse-muted`, max 40ch.
2. **`„Rubriky"`:** the seven nav items.
3. **`„Redakce"`:** `O MMA Files`, `Jak to funguje`, `Redakční standardy`, `Opravy`, `Soukromí`, `Newsletter`, `Čísla`.
4. **`„Sledujte nás"`:** a row of four 24px icons — Facebook, Instagram, Threads, X — **rendered as `<span aria-hidden="true">` with no `href`**, `--color-text-inverse-muted`, 20px gap. Under them, a working `RSS` text link. Use the official brand glyphs as inline SVG paths in `src/components/site/SocialIcons.tsx`; do not redraw them by hand and do not tint them.
   Column headings are mono 11px uppercase `0.16em` `--color-text-inverse-meta`; links are Archivo 400 15px `--color-text-inverse-muted`, hover `--color-text-inverse` with a 1px underline. Link rows are 40px tall for touch.
- Bottom band: separated by a `--color-rule-dark` hairline and 24px, `„© 2026 MMA Files · Vydává BoardlessAI"` in mono 11px `--color-text-inverse-meta`. Nothing else on that line.

### 7.17 Skeletons

- Fill `--color-well` (light surfaces) or `--color-chrome-raised` (chrome), `--animate-skeleton`, square.
- **Feed row skeleton:** 160×90 thumb block + two text bars (60% width at 14px tall, 90% at 10px) + a 64px timestamp bar.
- **Board skeleton:** header bar 180×24, then four rows of `[1fr bar] [96px bar] [48px bar]`.
- Container carries `aria-busy="true"` and a visually hidden `„Načítáme…"`. Skeletons are `aria-hidden`. Reduced motion: static fill, no pulse.

### 7.18 Empty states

One pattern: dashed 1px `--color-rule-dashed` box, 32px padding, centred single line in mono 12px uppercase `0.14em` `--color-text-meta`. No illustration, no button unless there is a real destination.

- No completed card: `„Žádná odjetá karta v archivu"`
- No articles in a week: `„V tomto týdnu nevyšel žádný text."`
- No model line: handled inline in the bout row (§7.9), never as a box.
- No fighters match the filter: `„Žádný bojovník neodpovídá filtru."`

---

## 8. Pages

All widths below are the 1440 desktop design unless stated. Container `--layout-max` with `--layout-gutter-lg` gutters; mobile is 390 with `--layout-gutter`.

### 8.1 Homepage — `src/app/[locale]/page.tsx`

Top to bottom:

1. Wire ticker (34px).
2. Masthead (64px, sticky).
3. `masthead-billboard` ad — 970×250 desktop, 320×100 mobile. 32px above, 32px below, centred.
4. **Lead package** (§7.5) — chrome band, full-bleed.
5. **`„Nejnovější"`** — section heading `.display` 700 `--text-d4` with a 3px `--color-accent` underline on the heading only (not the full width); 5–7 rows (§7.6); the `„Objevit předchozí týden"` button (§7.8).
6. **Predikce board** (§7.9) — chrome band, full-bleed, 64px padding. Heading `„Predikce"` + the standing disclaimer `„Žádné sázkové doporučení. Predikce jsou experimentální."` in mono 11px `--color-text-inverse-meta` directly under it. Shows the next card for each organisation, capped at four bouts each, with a secondary button `Otevřít Predikce` at the bottom.
7. **Výsledky board** (§7.10) — paper, two columns.
8. `infeed-rectangle` ad, 300×250 — placed **inside** the `Nejnovější` list after the 4th row on both breakpoints (not here in source order; it belongs to step 5's list). Rows continue after it.
9. **`„Víte, že…"` belt** (§7.11) — full-bleed red band.
10. **`„Bojovníci"` rail** — heading + four fighter cards (§7.12).
11. **Newsletter band** — `--color-card`, 64px padding, two columns: headline `„Zápasový týden v jednom e-mailu."` in `.display` 700 `--text-d4` + dek on the left; on the right, one email field (48px tall, 1px `--color-rule-strong`, focus border `--color-text`) and the `„Odebírat"` primary button. Stacks on mobile, button full width.
12. `footer-billboard` ad — 970×250 desktop, 320×100 mobile.
13. Footer.

Mobile order is identical. Lead image is full-bleed to the gutters; the Predikce board keeps its chrome band and uses the stacked bout layout.

### 8.2 Section feed — `„Nejnovější"`, `UFC`, `Oktagon`

One template, `src/components/pages/OrganizationPage.tsx` + `latest/page.tsx`.

- Ticker → masthead → `masthead-billboard`.
- Page header: title in `.display` 800 `--text-d2`; for an organisation page, the name is the title and a one-line Czech dek sits under it in Archivo 17px `--color-text-muted`. A 3px underline in `--color-accent` (Nejnovější) or the organisation badge colour (UFC / Oktagon) runs under the header, full container width.
- Article list: the same rows as the homepage (§7.6), 12 per week block, `infeed-rectangle` after the 4th, then the `„Objevit předchozí týden"` button and week dividers.
- `footer-billboard` → footer.
- Mobile: identical, rows in the compact layout.

### 8.3 Article page — `src/app/[locale]/articles/[slug]/page.tsx`

Desktop grid: `[body 1fr] 64px [rail 300px]`, container-wide, body capped at `--layout-measure` (≈68 characters at 18px).

1. Header block on `--color-paper`: kicker (org) → headline `.display` 800 `--text-d2` → dek Archivo 20px/1.5 `--color-text-muted`, max 60ch → meta line in mono 12px `--color-text-meta`: date · `„Redakce MMA Files"`.
2. `article-top` ad — 728×90 desktop, 320×100 mobile.
3. Hero image, 16:9, full body-column width, with a **visible credit line directly beneath it**: mono 11px `--color-text-meta`, format `Foto: Jméno Autora · CC BY 4.0`. The credit is a sibling of the image, never an overlay, and is never omitted.
4. Correction notice (§7.15), when present.
5. Body: Archivo 400 18px/1.65 `--color-text`; `h2` `.display` 700 28px with 48px top margin; `h3` Archivo 700 20px; lists with a 6px red square marker; blockquote with a 2px `--color-accent` left rule and 20px padding, Archivo 500 20px. Links `--color-accent` with a 1px underline; hover thickens to 2px.
6. `article-mid` ad — 728×90 desktop, 300×250 mobile — after roughly the third body block.
7. **`„Zdroje"`** — heading `.display` 700 `--text-d4` with a top hairline, then a numbered list: index in mono 12px `--color-text-meta`, publisher + title in Archivo 15px, external links carrying `rel="nofollow noopener"` and `target="_blank"`. A source with no public link renders its type in mono 12px `--color-text-meta` instead of a link.
8. **`„Související texty"`** — three `default` article cards from the same organisation, 3-up grid.
9. **Right rail (≥1024 only):** `article-rail` ad (300×600, sticky) then `„Další z rubriky"` — heading in mono 11px uppercase, then five `compact` cards. Below `lg` the rail is dropped entirely (the ad does not reflow into the body).

Mobile: single column, headline `--text-d3`, body 17px/1.65, hero image full-bleed to the gutters with the credit inside the gutters.

**`Link` colours:** define `a` and `a:hover` globally — `--color-accent` / `--color-accent-press` on light surfaces, `--color-accent-on-dark` / `--color-text-inverse` on chrome.

### 8.4 Predikce — `src/app/[locale]/predikce/page.tsx` (new)

Treated like an official rankings page: dense, quiet, all data.

1. Page header on `--color-chrome`, 64px padding: title `„Predikce"` in `.display` 800 `--text-d2` `--color-text-inverse`; intro paragraph `„Predikce vytváří náš vlastní model FightAIQ. Jsou experimentální: popisují, co model spočítal z dohledatelných dat, ne co se stane."` in Archivo 17px/1.6 `--color-text-inverse-muted`, max 68ch.
2. **Standing disclaimer**, immediately under the intro and repeated at the foot of the page: `„Žádné sázkové doporučení. Predikce jsou experimentální."` — mono 12px uppercase `0.12em`, `--color-accent-on-dark`, with a 1px `--color-rule-dark` box around it, 12px padding. It must be visible without scrolling on both breakpoints.
3. One board per organisation (§7.9), stacked with 64px between, each headed by the next card's name, date, venue.
4. Model provenance strip at the foot of each board: `„Raný model"` · `Verze modelu v2.3.1` · `„zachyceno 8. 8. 2026, 06:01"` in mono 11px `--color-text-inverse-meta`.
5. Footer. No ad slots on this page — a rankings surface stays clean.

Data comes from `data/boardless/fightaiq.json`. Bouts with no probability object render `„Model zatím neběžel"`. **Never synthesise a number, never render 50/50 as a default, never show a model line without its version and capture timestamp.**

### 8.5 Výsledky — `src/app/[locale]/results/page.tsx`

- Page header: `„Výsledky"` `.display` 800 `--text-d2`, red 3px underline full width.
- Completed cards in reverse chronological order, **grouped by month**. Month heading: `.display` 700 `--text-d4`, lowercase Czech month + year (`srpen 2026`), sticky under the masthead with a `--color-paper` background and a bottom hairline.
- Each card is a `<details>` element:
  - Summary row (56px, hairline below): organisation badge, event name in Archivo 700 17px, city + date in mono 12px `--color-text-meta` on the right, and a chevron built from a 10px rotated square border — no icon font. `aria-expanded` handled natively; labels `„Rozbalit kartu"` / `„Sbalit kartu"` on the summary's `aria-label`.
  - Open: the full bout list, one row per bout — billing in mono 11px `--color-text-meta` (56px column), the result line in the homepage board's format, method and timing right-aligned in mono 13px.
- Empty archive: the standard dashed box with `„Žádná odjetá karta v archivu"`.
- Ads: `masthead-billboard` under the masthead only.

### 8.6 Bojovníci — `src/app/[locale]/fighters/page.tsx`

- Page header `„Bojovníci"` + a one-line dek.
- Filter chips (§7.13) directly under the header, left-aligned, 8px gap: `Vše` / `UFC` / `OKTAGON`. Client-side filter, no dropdown, no URL change required (if you do add one, use `?org=`). The chip row is sticky under the masthead on mobile.
- Grid of fighter cards (§7.12): 4 columns ≥1024, 3 at 768, 2 at 390, 20px gap.
- Result count in mono 12px `--color-text-meta` to the right of the chips (`24 bojovníků`).
- Empty: `„Žádný bojovník neodpovídá filtru."`

### 8.7 404 — `src/app/[locale]/not-found.tsx`

- `--color-chrome`, full viewport height minus the chrome, centred left-aligned block in the container.
- `„Stránka nenalezena"` in `.display` 800 at `--text-d2`, `--color-text-inverse`, max 12 characters per line.
- Under it, a secondary button on chrome: `„Zpět na Nejnovější"` → `/cs/latest`.
- Ticker, masthead and footer all render normally. No ads.

---

## 9. Ad slots

| Slot | Desktop | Mobile | Placement |
|---|---|---|---|
| `masthead-billboard` | 970×250 (728×90 variant) | 320×100 | Under the masthead — homepage and section pages |
| `infeed-rectangle` | 300×250 | 300×250 | Inside the news feed, after the 4th item |
| `article-top` | 728×90 | 320×100 | Between the article header and the body |
| `article-mid` | 728×90 | 300×250 | Mid-article |
| `article-rail` | 300×600, sticky | — | Article right rail, desktop only |
| `footer-billboard` | 970×250 | 320×100 | Above the footer, homepage |

Rules: the box reserves its exact height at every breakpoint before load; the 728×90 variant of `masthead-billboard` is a build-time prop, not a runtime fallback; a slot with no campaign renders the labelled placeholder, never `display: none`; slots are centred in the container with 32px clearance above and below.

---

## 10. Imagery

No real fighter photographs, no promotion logotypes, no broadcaster marks, no AI-generated people presented as photographs. Organisation names are always set in our own type.

**Placeholder** (`src/components/media/PhotoSlot.tsx`, rewritten):

- Duotone geometric block: `--color-well` ground with a 135° repeating stripe at `--color-rule` — `repeating-linear-gradient(135deg, var(--color-rule) 0 1px, transparent 1px 12px)` — and one centred octagon motif built as a CSS `clip-path` polygon (regular octagon, 40% of the shorter side, filled `--color-rule-strong` at 60% opacity). No SVG illustration, no silhouette drawing.
- Centred label in mono 11px uppercase `0.14em` `--color-text-meta` saying what belongs in the slot: `Hlavní fotka — 3:2`, `Fotka k textu — 16:9`, `Portrét — 4:5`.
- On chrome surfaces the same construction uses `--color-chrome-raised` / `--color-rule-dark` / `--color-text-inverse-meta`.

**Every image component takes a credit slot.** `StoryImage.credit` is required whenever `src` is present. The credit renders:

- Article hero → visible line **beneath** the image (§8.3).
- Card and row thumbnails → no visible credit; the credit travels in the `alt`-adjacent `figcaption` only where a `<figure>` exists. If a licence requires visible attribution on thumbnails, the card grows a 16px credit strip — it must not overlay the image.
- Lead package image → 12px inset bottom-right, mono 10px `--color-text-inverse-muted` over the scrim.

**Scrims.** Two only: the lead image bottom scrim `linear-gradient(180deg, transparent 0%, color-mix(in srgb, var(--color-chrome) 65%, transparent) 55%, var(--color-chrome) 100%)`, and the fighter-card portrait badge scrim, the same gradient over the bottom 40%. Any text over an image sits on one of these and must still clear 4.5:1 against the darkest scrim stop.

---

## 11. Brand assets

### 11.1 Wordmark — `public/brand/mma-files-wordmark.svg`

The existing skewed-bar mark, evolved: two bars instead of one, the second half-height, reading as a corner of the cage rather than a generic slash.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 60" role="img" aria-label="MMA Files">
  <rect x="0" y="6" width="7" height="48" transform="skewX(-12)" fill="#0B0B0C"/>
  <rect x="13" y="26" width="7" height="28" transform="skewX(-12)" fill="oklch(0.52 0.22 27)"/>
  <text x="42" y="49" font-family="Barlow Condensed" font-weight="800" font-size="54"
        letter-spacing="0.5" fill="#0B0B0C">MMA FILES</text>
</svg>
```

- On chrome, swap the black bar and the lettering to `#F7F7F5` and the red bar to `oklch(0.68 0.19 27)`.
- **Convert the `<text>` to outlines before shipping** so the mark never depends on a webfont. Keep the live-text version in the repo for editing.
- Clear space: the width of one bar (7px at this scale) on every side. Minimum width 120px; below that use the mark alone.

### 11.2 Avatar / favicon — `public/brand/mark.svg`, `src/app/icon.svg`

Square, edge to edge, no padding beyond what is specified:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="MMA Files">
  <rect width="64" height="64" fill="#0B0B0C"/>
  <rect x="18" y="10" width="8" height="44" transform="skewX(-12)" fill="#F7F7F5"/>
  <rect x="33" y="28" width="8" height="26" transform="skewX(-12)" fill="oklch(0.68 0.19 27)"/>
</svg>
```

Export 32, 180 (apple-touch) and 512. At 32px the two bars still read; do not add letters at that size.

### 11.3 Default OG template — 1200×630

Implement as `src/app/[locale]/opengraph-image.tsx` (and reuse for the per-article route, which already exists).

- Ground `--color-chrome`. A 6px `--color-accent` bar flush along the **top** edge.
- 64px padding. Wordmark top-left at 34px cap height, in the inverse colourway.
- Headline: `.display` 800, 76px, `--leading-display`, `--color-text-inverse`, max three lines, bottom-aligned to 190px from the bottom.
- Kicker above the headline: organisation in mono 22px uppercase `0.14em` `--color-accent-on-dark`.
- Bottom strip: a 1px `--color-rule-dark` rule at 120px from the bottom, and beneath it `mmafiles.cz` on the left and the date on the right, both mono 22px `--color-text-inverse-meta`.
- No image, no photo, no logo lockups. The default (non-article) card uses the blurb in place of the headline at 48px.

---

## 12. Accessibility

- **AA everywhere.** Verified pairs: text on paper 18.3:1 · muted on paper 7.4:1 · meta on white 4.6:1 · inverse on chrome 16.6:1 · inverse-meta on chrome 4.9:1 · accent on paper 6.2:1 · accent-on-dark on chrome 5.8:1 · white on badge-ufc 6.9:1 · white on badge-oktagon 5.6:1 · paper on accent 7.3:1 · note-ink on note 7.9:1. Do not lighten `--color-text-meta` or `--color-text-inverse-meta` — they are at the floor.
- Text over images always sits on a scrim (§10) and is checked against the darkest scrim stop.
- Focus is always visible: `outline: 2px solid currentColor; outline-offset: 3px`, never removed, never `outline: none` with a substitute that only works on hover.
- Every interactive target is ≥44×44, including footer links, filter chips, nav items and the ticker's tap area.
- One `<h1>` per page; headings descend without skipping. Landmarks: `header`, `nav[aria-label]`, `main#main`, `aside[aria-label]`, `footer`.
- Skip link `„Přejít na obsah"` is the first focusable element.
- All motion — ticker, live dot, skeleton pulse — is inside the global `prefers-reduced-motion` block, and the ticker degrades to a scrollable strip rather than freezing mid-marquee.
- The mobile sheet traps focus, closes on `Esc`, restores focus to the hamburger, and locks body scroll.
- Probability bars are `aria-hidden`; the number is the accessible value. The countdown announces politely, not assertively.
- Social icons carry no link and no accessible name (`aria-hidden="true"`) until real accounts exist — an unlabelled link to nowhere is worse than a graphic.

---

## 13. Acceptance checklist

- [ ] No lime, green or orange remains in the compiled CSS; `--color-signal` is gone.
- [ ] Every rendered date, record, probability and timestamp is IBM Plex Mono with tabular numerals.
- [ ] Every ad slot reserves its exact height at 1440 and 390 before load; CLS from ads is 0.
- [ ] No page shows a model probability without a version and a capture timestamp.
- [ ] `„Model zatím neběžel"` appears wherever a bout has no model line; no 50/50 defaults exist anywhere in the codebase.
- [ ] `„Žádné sázkové doporučení. Predikce jsou experimentální."` is visible without scrolling on `/cs/predikce` at both breakpoints.
- [ ] No bookmaker name, logo or outbound betting link exists in the tree.
- [ ] Every image component renders a credit when an image is present; the article hero credit is visible.
- [ ] No promotion logotype, broadcaster mark or photograph of a real person ships in `public/`.
- [ ] The footer says `„© 2026 MMA Files · Vydává BoardlessAI"` and mentions no AI, agent, engine or automation anywhere.
- [ ] No English string reaches a reader; no language switcher exists.
- [ ] `prefers-reduced-motion: reduce` stops the ticker, the live dot and the skeleton pulse.
- [ ] Keyboard-only pass: skip link → nav → lead → feed → button → boards → footer, with a visible ring at every stop, and the mobile sheet opens, traps, and closes on `Esc`.
- [ ] `npm run check` passes.
