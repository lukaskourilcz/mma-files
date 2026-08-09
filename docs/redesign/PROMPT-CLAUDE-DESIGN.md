# Prompt for Claude Design — MMA Files relaunch

Copy everything below the line into Claude Design as one prompt.

---

Design the complete visual relaunch of **MMA Files** (mmafiles), a Czech
online MMA magazine covering exactly three things: the UFC, the OKTAGON MMA
organization, and fight predictions produced by an in-house model called
FightAIQ. It is a real, founder-led publication with a small editorial
operation and serious sourcing discipline. It must look and feel like a
professional fight-sports magazine — not a tech demo, not a blog.

**Every string a reader sees is Czech.** The site has no other language. I
give you the exact Czech strings below; use them verbatim. Write any
additional microcopy you need in Czech too (correct diacritics — the fonts
must cover Latin Extended).

## Layout brief

Model the page grammar on a modern championship-boxing magazine site: dark
editorial chrome, one oversized lead story, dense news lists with thumbnails
and timestamps, a data module treated with the gravity of official rankings,
an event schedule rail, and a heavy black footer. Do not imitate any existing
publication's logo, name, exact colors or imagery — the structure is the
reference, the identity is ours.

### Global chrome

- **Wire ticker** (very top): a slim single-line ticker of short headlines,
  label „Drát" — dark background, mono type, subtle motion (must respect
  `prefers-reduced-motion`).
- **Masthead**, sticky, near-black: wordmark left, primary nav center/right.
  Nav items in order: „Nejnovější", „UFC", „Oktagon", „Predikce", „Zápasový
  týden", „Výsledky", „Bojovníci". Active item gets a red underline or red
  text. No search field in v1. No language switcher (Czech only).
- **Mobile masthead** (≤ 768px): slim sticky bar — hamburger left, wordmark
  centered. The hamburger opens a full-height sheet listing the seven nav
  items in large display type with a red active marker. Below the sheet nav:
  the four social icons. Ticker stays, one line, scrollable.
- **Footer**, near-black: brand column with wordmark and a one-line Czech
  blurb; „Rubriky" link column (the seven nav items); „Redakce" link column
  (O MMA Files, Jak to funguje, Redakční standardy, Opravy, Soukromí,
  Newsletter); „Sledujte nás" row with **four icons: Facebook, Instagram,
  Threads, X — rendered as icons without links for now** (plus an RSS link
  that does work); bottom band with „© 2026 MMA Files · Vydává BoardlessAI"
  in small muted type. Nothing in the footer mentions AI, agents, engines or
  automation.

### Ad slots (design them as first-class components)

Empty labelled containers until real campaigns exist. Placeholder text:
**„Místo pro reklamu"** plus the slot dimensions in small mono type, hairline
dashed border, muted background. Each slot must reserve its exact height in
the layout (zero layout shift when a real image replaces the placeholder).

| Slot | Desktop | Mobile | Placement |
|---|---|---|---|
| masthead-billboard | 970×250 (728×90 variant) | 320×100 | under masthead, homepage + section pages |
| infeed-rectangle | 300×250 | 300×250 | inside the news feed after the 4th item |
| article-top | 728×90 | 320×100 | between article header and body |
| article-mid | 728×90 | 300×250 | mid-article |
| article-rail | 300×600, sticky | — | article right rail, desktop only |
| footer-billboard | 970×250 | 320×100 | above the footer, homepage |

### Pages to design (desktop 1440px and mobile 390px for each)

1. **Homepage**, top to bottom: ticker → masthead → masthead-billboard ad →
   **lead package** (one oversized hero article: full-bleed image, red
   uppercase kicker with the organization name, display headline, dek,
   timestamp; flanked or followed by two secondary headlines) → **Nejnovější**
   (dense list: thumbnail left, kicker + headline + timestamp right; 5–7
   items; at the end one wide button „Objevit předchozí týden" — pressing it
   appends the previous week's articles, so design the button plus a loaded
   state with a week-divider label like „Týden 3.–9. srpna") → **Predikce
   board** (see below) → **Výsledky board**: two columns side by side, one
   „UFC", one „OKTAGON", each showing the last completed card (event name,
   date, 3 main results with winner marked by method — e.g. „Procházka por.
   Hill · TKO, 2. kolo") and the next announced card with a countdown; design
   an honest empty state „Žádná odjetá karta v archivu" for a column with no
   data → infeed-rectangle ad → **„Víte, že…" belt** (one verified fact per
   day: fact text, source line, small „ověřeno" mark — design as a distinct
   colored band) → **Bojovníci rail** (4 fighter cards: portrait placeholder,
   name, division, record, org badge) → **newsletter band** (headline, one
   email field, one button „Odebírat") → footer-billboard ad → footer.
2. **Section feed** („Nejnovější" full page; UFC and Oktagon are the same
   template with an org header): section title in display type, article list,
   the same week-pagination button, ad slots.
3. **Article page**: kicker (org), display headline, dek, meta line (date,
   „Redakce MMA Files"), article-top ad, hero image **with a visible photo
   credit/license line**, body (clean reading measure ~65–75 characters,
   generous line height), article-mid ad, sources block („Zdroje" — numbered
   external links), related articles (3 cards from the same organization),
   desktop right rail: article-rail ad + „Další z rubriky" list. Include a
   design for the correction notice block („Oprava") and for the demo badge
   („Ukázkový obsah" — a small amber chip; fictional placeholder content
   carries it, real reporting never does).
4. **Predikce page** (the FightAIQ surface — treat it like an official
   rankings page): intro line explaining in Czech that predictions come from
   the in-house FightAIQ model and are experimental; then per organization
   the next card as a table of bouts. Each bout row: both fighters, division,
   scheduled rounds, and — when a model line exists — win probabilities as
   mono numerals with a thin horizontal bar, the label „Raný model", the
   model version, and the capture timestamp („zachyceno 8. 8. 2026, 06:01").
   When no model line exists the row says „Model zatím neběžel" — never
   invented numbers. Odds, where shown, carry their bookmaker-agnostic source
   label and capture time. A visible standing disclaimer: „Žádné sázkové
   doporučení. Predikce jsou experimentální." No bookmaker logos, no
   affiliate anything.
5. **Výsledky page**: chronological completed cards grouped by month, each
   collapsible to its full bout list.
6. **Bojovníci page**: filterable grid of fighter cards (filter chips: Vše /
   UFC / OKTAGON — chips, not dropdowns).
7. **404**: display-type „Stránka nenalezena", link „Zpět na Nejnovější".

### States to include

Loading skeletons for feed and boards; empty states (no articles in a week,
no completed card, model not run); the demo badge; the correction notice.

## Visual system (my defaults — refine, then commit to one system)

- **Dark chrome / light wells**: near-black `#0B0B0C` for ticker, masthead,
  hero band, Predikce board and footer; warm paper `#F7F7F5` for reading
  surfaces; white cards.
- **One accent**: MMA Files red — start from `oklch(0.52 0.22 27)` (a deep
  blood red) and tune for AA contrast on both black and paper. Red is for
  kickers, active nav, live markers, primary buttons. **Oktagon amber**
  `oklch(0.56 0.17 55)` survives only as that organization's badge color
  (UFC's badge is the red). Retire any lime/green accent.
- **Type**: display **Anton** (uppercase headlines, tight leading), text
  **Archivo**, data **IBM Plex Mono** (odds, records, timestamps, tabular
  numerals). All three support Czech diacritics and are already licensed via
  Google Fonts. If Anton's single weight limits the hierarchy, substitute
  **Barlow Condensed 700/800** for display and say so in the handoff.
- **Geometry**: square corners everywhere, hairline rules (`1px`), high
  density in lists, generous space around display type. Red 3px underline as
  the hover/active idiom. Uppercase letterspaced kickers (11–12px).
- Design tokens as CSS custom properties; name them semantically
  (`--color-chrome`, `--color-paper`, `--color-accent`, `--color-badge-ufc`,
  `--color-badge-oktagon`, text/muted/rule scales, spacing scale, type
  scale). Single theme — the mix of dark chrome and light wells IS the
  identity; no separate light/dark modes.
- **Accessibility**: WCAG AA minimum everywhere, including red-on-black and
  text over images (use scrims). Visible focus rings. Touch targets ≥ 44px.
  All motion behind `prefers-reduced-motion`.

## Imagery rules (hard constraints)

- Use abstract placeholders (duotone blocks, silhouettes, geometric octagon
  motifs) — **never** real fighter photographs, promotion logos (no UFC or
  OKTAGON logotypes — set their names in our own type), broadcaster marks, or
  AI-generated people presented as photos. Production photos come with
  license attribution, so every image component includes a credit line slot.

## Deliverables

1. `design-tokens.css` — the full custom-property sheet.
2. High-fidelity mockups of all seven pages, desktop 1440 and mobile 390.
3. Component sheet: masthead (+ mobile sheet menu), ticker, ad slots (empty +
   filled), article card variants, lead package, bout row with and without
   model line, boards, fact belt, fighter card, buttons/chips/badges, footer,
   demo badge, correction notice, skeletons and empty states.
4. Logo refresh: „MMA FILES" wordmark (SVG), a square avatar/favicon mark,
   and a 1200×630 default social-share (OG) template.
5. A short handoff note: type scale, spacing scale, breakpoints, and any
   place you deviated from my defaults and why.
