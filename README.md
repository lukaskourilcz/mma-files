# MMA Files

A Czech public fighting magazine covering UFC and Oktagon. Every released story
carries its sources, keeps unknowns visible, and shows corrections on the page.
Czech is the only published locale: each article is written once, natively in
Czech, upstream in quorum. There is no English locale, no English dictionary
and no translation step.

> The fight is the headline. The file is the proof.

MMA Files is the reader-facing editorial brand. It is powered by BoardlessAI, an
evidence-governed editorial engine, and reads its facts from the FightAIQ
evidence layer. This repository is the public website only — it holds no
credentials, no drafts and no private newsroom state.

**Everything in `src/content/` is fictional demo content.** Articles use those
fixtures only until the first real article delivery. Fighter and event pages do not
fall back to fictional records: they stay empty until a valid FightAIQ package arrives.
The site ships in demo mode: demo
stories are badged, `robots.txt` refuses every crawler, the sitemap is empty and
the RSS feed carries no items. See
[Indexing and demo mode](#indexing-and-demo-mode).

---

## Running it

```bash
npm install
npm run dev
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server on `http://localhost:3000` |
| `npm run build` | Production build; prerenders every route |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run test` | Content-delivery boundary, dataset and daily-pick tests |
| `npm run check` | Typecheck, lint and delivery tests |
| `npm run consume:boardless -- <package.json> [repository-root]` | Validate and store one BoardlessAI package |

Stack: Next.js 15 (App Router), React 19, TypeScript in strict mode, Tailwind
CSS v4. No external service is required to run or build the site.

### Environment

All optional. Defaults are the safe ones.

| Variable | Default | Meaning |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://mma-files.vercel.app` | Origin for canonicals, `hreflang`, RSS and OG. Set it to `http://localhost:3000` only when local absolute URLs are needed. |
| `NEXT_PUBLIC_DEMO_MODE` | `true` | Demo badges on, indexing forced off, RSS empty. |
| `NEXT_PUBLIC_ALLOW_INDEXING` | `false` | Master indexing switch. Ignored while `NEXT_PUBLIC_DEMO_MODE=true`. |

The repository itself needs no model or source API secrets. BoardlessAI keeps
those credentials. Vercel only needs these public build settings.

---

## Layout

```
src/
├── app/[locale]/          Every reader-facing route. The locale layout IS the
│                          root layout, so <html lang> is always correct.
├── components/            article/ event/ fighter/ hero/ media/ site/ ui/ pages/
├── config/site.ts         Brand, engine attribution, indexing switches
├── content/               Fictional seed data used only until delivery exists
├── data/                  Verified fact dataset for the "Víte, že…" belt, plus
│                          its append contract in README.md
├── i18n/                  cs.ts is the dictionary and the structural source of
│                          truth; Dictionary is derived from it, so the one
│                          published locale defines the shape
├── lib/
│   ├── repository.ts      The only sanctioned read path for content
│   ├── markdown.tsx       Restricted Markdown → React (no raw HTML)
│   ├── types.ts           The content model
│   ├── format.ts          Dates, relative times, records, reading time
│   ├── metadata.ts        Canonical + hreflang + robots for a route
│   ├── paths.ts           Route builders — never hand-write a URL
│   ├── promotion.ts       Per-promotion accents, exhaustive over the union
│   ├── daily-index.mjs    The deterministic daily pick, plain ESM so the
│   │                      node --test suite can import it (.d.mts types it)
│   ├── daily.ts           Typed re-export of the above, plus dataset types
│   └── facts.ts           Reads src/data/mma-facts.json once at build time
└── middleware.ts          Redirects unprefixed paths to /cs; a leftover /en
                           path is stripped, not prefixed
data/boardless/             Hash-checked article and FightAIQ delivery stores
scripts/                    Content-only BoardlessAI consumer
```

Two rules keep this maintainable:

1. **Route and component code never imports `src/content/` directly.** It goes
   through `src/lib/repository.ts`. Swapping the seed arrays for a CMS is then a
   change in one file.
2. **URLs come from `src/lib/paths.ts`.** Canonicals, `hreflang` alternates and
   the sitemap all call the same builders, so they cannot drift apart.

---

## Design system

Everything visual is declared in the `@theme` block of `src/app/globals.css`.
Change it there; no component hard-codes a colour except through a token.

**Type.** Three families, loaded via `next/font/google` in the locale layout.
`--font-display` is Anton — headlines, section titles, fighter names, methods
and the big figures, always uppercase at a line height of 0.9–1.05, applied via
the `.display` class. `--font-sans` is Archivo for deks, body, nav and buttons.
`--font-mono` is IBM Plex Mono for every date, time, record, count and tag,
uppercase with wide tracking via `.label-mono` / `.label-mono-sm`.

**Colour.** `paper` / `card` / `ink` are the surfaces. `ufc` and `oktagon` are
promotion accents; `signal` is the lime. Four evidence colours — `verified`,
`provisional`, `disputed`, `gap` — drive the state bars and the disputed
record.

Three rules the components follow, and any new component must:

- **Lime is never text.** It is a fill, and the text on it is `ink`.
- **Promotion colour is never small text.** It is a card's top rule, a section
  rule, or a badge fill. Display headings at 24px and up may use it directly;
  `PromotionBadge` darkens the fill one step so white on it clears 4.5:1.
- **Black blocks are punctuation.** The wire, the hero pull-quote and the
  footer. Nothing else.

Small mono metadata is `ink-meta` (`#6B6B66`, 4.6:1 on white — do not lighten
it); on the black footer the floor is `paper-meta`. Every border is square —
there are no radius tokens.

**Motion** lives in the same file as `--animate-*` tokens and is covered by the
global `prefers-reduced-motion` block. The count-up in `CountUp.tsx` checks the
media query in JavaScript too, because a rAF loop is not a CSS animation.

---

## Content model

Defined in [`src/lib/types.ts`](src/lib/types.ts). The `Article`, `ArticleLocale`
and `Source` shapes are the contract with the BoardlessAI editorial engine.
Everything this website adds on top is **optional** and marked `[site]` in the
source, so an untouched engine payload still typechecks.

```ts
interface Article {
  id: string;
  slug: string;
  status: "draft" | "blocked" | "published" | "killed";
  format:
    | "fight-week-preview" | "post-event-recap" | "fighter-profile"
    | "data-story" | "weigh-in-report" | "desk-notes";
  localizations: Partial<Record<Locale, ArticleLocale>>;  // Locale = "cs"
  organization?: "ufc" | "oktagon";
  fighterRefs: string[];
  eventRef?: string;
  sources: Source[];
  publishAt: string;          // ISO 8601
  updatedAt?: string;
  heroSpec: { template: HeroTemplate; bindings: Record<string, string | number | boolean> };
  modelVersion?: string;
  packageHash?: string;

  // [site] additions, all optional
  isDemo?: boolean;
  fileNumber?: number;
  heroLine?: Record<Locale, string>;
  heroAlt?: Record<Locale, string>;
  confirmed?: Record<Locale, string[]>;
  unconfirmed?: Record<Locale, string[]>;
  corrections?: Correction[];
  modelDisclosure?: ModelDisclosure;
  relatedSlugs?: string[];
  image?: StoryImage;
}
```

`StoryImage` is `{ src, alt: Record<Locale, string>, credit, focalPoint? }`. It
is optional on both `Article` and `Fighter`, so an untouched engine payload
still typechecks — but every field inside it is required. A file with no
photograph renders a labelled placeholder, never an empty box and never a stock
substitute.

Alongside `Article` the repository holds `Fighter`, `FightEvent` and
`SocialVariant`. Fighters carry a `fieldStates` map — one of `verified`,
`provisional`, `disputed` or `unavailable` per field — which is what drives the
visible-gaps behaviour throughout the UI.

### The publication gate

`isRenderable()` in [`src/lib/repository.ts`](src/lib/repository.ts) decides
what the public site will render. An article appears only when it:

- has `status: "published"`,
- has a Czech version with a non-empty title, dek and body,
- and carries **at least one** source.

An article that fails this is invisible rather than half-rendered. That is
deliberate: a story without Czech text or an unsourced claim is not a rendering
bug, it is content that is not ready.

---

## Adding an article

Add an entry to [`src/content/articles.ts`](src/content/articles.ts). Czech is
the only published locale; the `en` key survives only on two legacy packages and
is never required.

```ts
{
  id: "article:2026-09-06-oktagon-92-recap",
  slug: "oktagon-92-recap",
  status: "published",
  format: "post-event-recap",
  fileNumber: 25,
  organization: "oktagon",
  eventRef: "event:oktagon/oktagon-92",
  fighterRefs: ["fighter:oktagon/stepan-hruska"],
  publishAt: "2026-09-06T09:00:00+02:00",
  localizations: {
    cs: { title: "…", dek: "…", body: "…" },
  },
  sources: [ /* at least one — see below */ ],
  heroSpec: { template: "type-led-result", bindings: { /* … */ } },
  heroAlt: { cs: "…" },
}
```

**The Czech version is written as Czech, not translated.** Natural word order,
correct declension of names, and the vocabulary the sport actually uses here.
The house style for both desks — including the banned-phrase lists — lives in
the newsroom stylebook, not in this repository.

### Body syntax

Bodies use a small Markdown subset rendered to React nodes by
[`src/lib/markdown.tsx`](src/lib/markdown.tsx). Nothing goes through
`dangerouslySetInnerHTML`, so article text cannot inject markup.

| Syntax | Result |
| --- | --- |
| `## Heading` / `### Heading` | `h2` / `h3` |
| `- item` | Unordered list |
| `> quoted line` | Pull quote |
| `**bold**` | `strong` |
| `[label](https://…)` | External link (`nofollow`, new tab) |
| `[[fighter:slug\|Label]]` | Internal link to the fighter page |
| `[[event:slug\|Label]]` | Internal link to the event page |

An internal link whose target is not in the repository renders as plain text —
never a dead link.

### Hero visuals

The front page is image-led: the lead file renders one 4:5 photograph, file
cards render 16:9, and roster cards render 4:5 portraits. Where no photograph
exists the slot says so and states what belongs there — see `StoryImage` above
and `src/components/media/PhotoSlot.tsx`.

The article page still uses the four deterministic typographic templates:
`tale-of-the-tape`, `type-led-result`, `data-card` and `quote-led-preview`,
generated from the story's own data. No AI-generated likeness is presented as a
photograph, and no promotion mark, event artwork or licensed image is used
without permission.

`heroSpec.bindings` carry **locale-neutral values only** — names, numbers,
times, and keys like `methodKey` or `metric1`. Every label is looked up in the
dictionary, so one binding set renders correctly. `heroAlt` supplies the alt
text and is required for accessibility.

---

## Adding sources

Every factual claim in a released story needs a reference, and the reference is
shown on the page.

```ts
// Internal: a FightAIQ evidence reference
{
  kind: "internal",
  ref: "fightaiq:fighter/oktagon/stepan-hruska@14",
  classification: "primary",
  retrievedAt: "2026-09-06T05:10:00Z",
  supports: ["Record", "Stance"],
}

// External: a real document, with a link
{
  kind: "external",
  title: "Oktagon 92 official result sheet",
  publisher: "Oktagon MMA",
  url: "https://…",
  classification: "primary",
  retrievedAt: "2026-09-06T05:10:00Z",
  supports: ["Main event result", "Round and time"],
}
```

`supports` is the list of claims the source is being cited for; it renders under
the entry as "Cited for …". A source without a `url` renders with an explicit
"no public link" state rather than a link to nowhere.

### Missing data

If a value is not evidenced, **leave the field out** and mark it `unavailable`
in `fieldStates`. It will render as a visible gap. Do not substitute `0`, an
estimate, or a plausible-sounding number — the entire evidence UI exists to make
that impossible to do quietly.

---

## BoardlessAI delivery

BoardlessAI sends two package types through a repository-scoped GitHub App:

- `article/1` — one sourced, published article with a complete Czech version,
  plus exactly one rehosted, attributed image and thumbnail. English is legacy:
  only two old packages carry it and it is never required;
- `fightaiq-delivery/2` — canonical UFC/Oktagon fighter cards, status-tracked bouts,
  event projections and current Stats predictions. Raw prices and private research
  files never cross the delivery boundary.

The consumer validates organization scope, fighter provenance, two-source confirmed
bouts, the early-model label, immutable article slots, stale snapshots and the
canonical SHA-256 before it writes. It can
change only `data/boardless/articles.json` or `data/boardless/fightaiq.json`.
The delivery workflow runs this repository's tests, typecheck and production
build before pushing the content commit to `main`; Vercel then deploys that commit.

Application code, settings, social accounts and private newsroom state are outside
the delivery boundary. Replaying the same package is a no-op. A changed package for
an occupied date/slot or an older FightAIQ snapshot fails closed.

## Replacing the demo data manually

Manual replacement is still possible, but normal production uses `data/boardless/`.

### Swapping in a different CMS

1. Keep `src/lib/repository.ts` as the single boundary. Replace the delivery imports
   with your client.
2. Widen the return types to promises (`Promise<Article[]>` and so on) and
   `await` them in the route files. Every route is already an async server
   component, so the call sites change by one keyword.
3. Keep `isRenderable()` in the read path. It is the guard that stops a
   one-language or unsourced story from reaching a reader.
4. Drop `isDemo` from real records, or leave it unset — it defaults to falsy.
5. Set `NEXT_PUBLIC_DEMO_MODE=false` after the first real package and, when you are ready to be indexed,
   `NEXT_PUBLIC_ALLOW_INDEXING=true`.
6. Add `revalidate` or on-demand revalidation to the routes if the source is
   remote. They are fully static today.

### Constraints the demo data deliberately observes

Keep these if you replace the fixtures with different demo content:

- **No invented quotations.** No demo story attributes words to anybody. The
  `quote-led-preview` hero therefore uses `heroLine`, an editorial pull line
  written by the desk, rather than a fabricated quote.
- **No fabricated source URLs.** Demo external sources carry a source *type*
  (`"Promotion media release (demo)"`) and no link, because there is no document
  behind them. Attaching a real publisher's name to an invented citation would
  be a fabricated attribution.
- **Fictional venues and fighters.** No demo record describes a real person,
  gym, card or result.
- **No demo photography.** The seed records carry no `image`, so every photo
  slot renders its placeholder. Do not fill them with stock images.
- **`isDemo: true` on every seed record.** This drives the badges and the
  indexing exclusions.

### Anchored dates

Demo dates are anchored to a seed date of **2026-08-01**. Fight-week and results
pages read them dynamically, and both degrade gracefully once the dates fall
into the past — fight week falls back to the most recent completed card. When
that happens, replace the fixtures rather than editing dates in place.

---

## Indexing and demo mode

Two switches, in [`src/config/site.ts`](src/config/site.ts). Demo mode forces
indexing off regardless of the other flag, so sample reporting cannot reach a
search engine by accident.

While `NEXT_PUBLIC_DEMO_MODE=true` (the default):

| Surface | Behaviour |
| --- | --- |
| `robots.txt` | `Disallow: /` for every user agent |
| `sitemap.xml` | Empty |
| `/[locale]/rss.xml` | Valid channel, zero items |
| Every page | `noindex, nofollow` |
| Demo articles | `Demo story` badge and an on-page notice |
| Demo fighters and events | `Demo data` badge and an on-page notice |
| `NewsArticle` JSON-LD | **Not emitted** — marking fictional content up as news would be a lie told to a machine |

Once real content is in place and `NEXT_PUBLIC_ALLOW_INDEXING=true`, these stay
`noindex`:

- **Any record still carrying `isDemo: true`**, individually, even if the rest
  of the site is live. The per-page check is independent of the global switch.
- **`/[locale]/newsletter`**, until an email provider is actually connected.
  Right now the form submits nowhere and stores nothing, and the page says so.

Organization-level JSON-LD (`NewsMediaOrganization`, with `publishingPrinciples`
and `correctionsPolicy` pointing at the real pages) is emitted always, because
it is true regardless of what content is loaded.

---

## The "Víte, že…" belt

A slim belt above the lead story carries one verified MMA fact a day, from
[`src/data/mma-facts.json`](src/data/mma-facts.json). It is a Server Component:
no client JavaScript, no request, no runtime cost.

The pick is deterministic. `daysBetween(anchor, dateKey) % length` in
`src/lib/daily-index.mjs` turns a date into an index, and the date is the lead
article's published day — not a clock, because the site is static and rebuilds
when content lands. The same content therefore always builds the same page, and
a day without a new article honestly keeps the previous fact.

These facts are real and checkable, so they carry no `isDemo` flag and render in
demo and live mode alike. Each entry holds its own receipt: `verified` is the
date somebody last checked it, `source` is where a reader could check it again.

The file is append-only and arrives through the same delivery channel as
articles. [`src/data/README.md`](src/data/README.md) is the contract and
`tests/facts.test.mjs` is the gate; the count assertion is a minimum, so an
append needs no test edit.

---

## Social treatments

Each approved story gets two design variants, A and B, each written in both
languages: four localised treatments. They are stored in
[`src/content/social.ts`](src/content/social.ts) and surfaced as counts on the
methodology page.

**Nothing in this repository is wired to a platform.** Captions are not rendered
publicly. BoardlessAI owns the separate Instagram and Threads connectors, health
counters, credentials and global stop switch; this public site never receives
those credentials.

---

## What this site will not carry

These are product requirements, not preferences, and they are enforced in the
components as well as the copy:

- FightAIQ deliveries include sourced fighter cards, canonical bouts and early-model
  probability descriptors. Raw odds, model-versus-market comparisons and experimental
  pick files remain private in BoardlessAI. The site has no bookmaker promotion,
  affiliate links, account automation or automatic bet placement.
- No invented quotes, records, injuries, reactions or statistics.
- No AI-generated fighter imagery presented as photography.
- No promotion marks, event artwork or licensed photography without permission.
- Czech articles that clear BoardlessAI's release gates are delivered as
  content-only Git commits and deploy automatically. Social posting remains outside
  this repository and cannot start until BoardlessAI's signed activation gates pass.

If a future story does cite a deterministic aggregate, it must carry a
`modelDisclosure`: the exact version, its input references, a plain-language
uncertainty statement and the responsible-play line. The
`ModelDisclosureBlock` component renders all four together — see
`forty-two-tracked-fields` in the seed data for a worked example.

---

## Accessibility and quality notes

- Semantic landmarks, a skip link, and a heading order that starts at one `h1`
  per page.
- Visible 2px ink focus rings on every interactive element.
- Hero visuals are exposed as a single labelled image (`role="img"` plus
  `aria-label` from `heroAlt`); the same facts appear in the body and in "The
  file", so nothing is only available visually.
- Promotion colour is a fill, a card rule or a section rule — never small text.
  Badge fills are darkened one step so white on them clears 4.5:1 for both
  promotions. The lime signal colour is never a text colour.
- The wire ticker duplicates its item list so the marquee can loop seamlessly;
  the second pass is `aria-hidden`, and the whole strip is a labelled `aside`.
- The countdown renders the static date on the server pass and starts ticking
  after hydration, so the markup matches and no clock arrives stale.
- Relative times go through `Intl.RelativeTimeFormat`, which already knows Czech
  numeral agreement — no relative time string is hand-assembled.
- Counts shown to readers (Data Desk figures, evidence coverage) are computed
  from the repository, never asserted in copy.
- `prefers-reduced-motion` is respected globally.
- The locale switcher preserves the current route. Every route exists in both
  locales, so the alternate is always valid.

## Known issues

Next 15.5 still requests older PostCSS and Sharp ranges, so `package.json`
overrides them to the audited fixed versions. The BoardlessAI consumer uses
Sharp only while validating and rehosting delivered WebP images; reader requests
do not process remote images.

## Licence

Private. All rights reserved.
