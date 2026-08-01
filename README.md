# MMA Files

A bilingual (English / Czech) public fighting magazine covering UFC and Oktagon.
Every released story carries its sources, keeps unknowns visible, and shows
corrections on the page.

> The fight is the headline. The file is the proof.

MMA Files is the reader-facing editorial brand. It is powered by BoardlessAI, an
evidence-governed editorial engine, and reads its facts from the FightAIQ
evidence layer. This repository is the public website only — it holds no
credentials, no drafts and no private newsroom state.

**Everything currently in `src/content/` is fictional demo content.** The site
ships in demo mode: demo stories are badged, `robots.txt` refuses every crawler,
the sitemap is empty and the RSS feed carries no items. See
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
| `npm run build` | Production build; prerenders every route in both locales |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run check` | Typecheck then lint |

Stack: Next.js 15 (App Router), React 19, TypeScript in strict mode, Tailwind
CSS v4. No external service is required to run or build the site.

### Environment

All optional. Defaults are the safe ones.

| Variable | Default | Meaning |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | Origin for canonicals, `hreflang`, RSS and OG. **Set this before deploying.** |
| `NEXT_PUBLIC_DEMO_MODE` | `true` | Demo badges on, indexing forced off, RSS empty. |
| `NEXT_PUBLIC_ALLOW_INDEXING` | `false` | Master indexing switch. Ignored while `NEXT_PUBLIC_DEMO_MODE=true`. |

---

## Layout

```
src/
├── app/[locale]/          Every reader-facing route. The locale layout IS the
│                          root layout, so <html lang> is always correct.
├── components/            article/ event/ fighter/ hero/ site/ ui/ pages/
├── config/site.ts         Brand, engine attribution, indexing switches
├── content/               Seed data — replace this, not the components
├── i18n/                  en.ts is the structural source of truth; cs.ts is
│                          typed against it, so a missing key fails the build
├── lib/
│   ├── repository.ts      The only sanctioned read path for content
│   ├── markdown.tsx       Restricted Markdown → React (no raw HTML)
│   ├── types.ts           The content model
│   ├── format.ts          Dates, relative times, records, reading time
│   ├── metadata.ts        Canonical + hreflang + robots for a route
│   └── paths.ts           Route builders — never hand-write a URL
└── middleware.ts          Redirects unprefixed paths, negotiates the locale
```

Two rules keep this maintainable:

1. **Route and component code never imports `src/content/` directly.** It goes
   through `src/lib/repository.ts`. Swapping the seed arrays for a CMS is then a
   change in one file.
2. **URLs come from `src/lib/paths.ts`.** Canonicals, `hreflang` alternates and
   the sitemap all call the same builders, so they cannot drift apart.

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
  localizations: Record<"en" | "cs", ArticleLocale>;
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
}
```

Alongside `Article` the repository holds `Fighter`, `FightEvent` and
`SocialVariant`. Fighters carry a `fieldStates` map — one of `verified`,
`provisional`, `disputed` or `unavailable` per field — which is what drives the
visible-gaps behaviour throughout the UI.

### The publication gate

`isRenderable()` in [`src/lib/repository.ts`](src/lib/repository.ts) decides
what the public site will render. An article appears only when it:

- has `status: "published"`,
- exists in **both** locales with a non-empty title, dek and body,
- and carries **at least one** source.

An article that fails this is invisible rather than half-rendered. That is
deliberate: a one-language story or an unsourced claim is not a rendering bug,
it is content that is not ready.

---

## Adding a bilingual article

Add an entry to [`src/content/articles.ts`](src/content/articles.ts). Both
locales are required.

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
    en: { title: "…", dek: "…", body: "…" },
    cs: { title: "…", dek: "…", body: "…" },
  },
  sources: [ /* at least one — see below */ ],
  heroSpec: { template: "type-led-result", bindings: { /* … */ } },
  heroAlt: { en: "…", cs: "…" },
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

Four deterministic typographic templates: `tale-of-the-tape`,
`type-led-result`, `data-card` and `quote-led-preview`. They are generated from
the story's own data. There is no photography anywhere in this project, and no
generated likeness is presented as one.

`heroSpec.bindings` carry **locale-neutral values only** — names, numbers,
times, and keys like `methodKey` or `metric1`. Every label is looked up in the
dictionary, so one binding set renders correctly in both languages. `heroAlt`
supplies the alt text per locale and is required for accessibility.

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

## Replacing the demo data

The seed arrays in `src/content/` are the only thing that needs to change.

### Swapping in a CMS or the BoardlessAI delivery API

1. Keep `src/lib/repository.ts` as the single boundary. Replace the seed imports
   with your client.
2. Widen the return types to promises (`Promise<Article[]>` and so on) and
   `await` them in the route files. Every route is already an async server
   component, so the call sites change by one keyword.
3. Keep `isRenderable()` in the read path. It is the guard that stops a
   one-language or unsourced story from reaching a reader.
4. Drop `isDemo` from real records, or leave it unset — it defaults to falsy.
5. Set `NEXT_PUBLIC_DEMO_MODE=false` and, when you are ready to be indexed,
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

## Social treatments

Each approved story gets two design variants, A and B, each written in both
languages: four localised treatments. They are stored in
[`src/content/social.ts`](src/content/social.ts) and surfaced as counts on the
methodology page.

**Nothing is wired to a platform.** Captions are not rendered publicly.
Publishing is manual and requires a separate authorisation step with credentials
this repository does not hold. Do not add an Instagram or Threads integration
without explicit platform approval and a deliberate authorisation gate.

---

## What this site will not carry

These are product requirements, not preferences, and they are enforced in the
components as well as the copy:

- No odds, probabilities, forecasts, tips, picks, bookmaker links or affiliate
  gambling content. FightAIQ is in `data-only` mode and the Data Desk states
  this boundary on the page.
- No invented quotes, records, injuries, reactions or statistics.
- No AI-generated fighter imagery presented as photography.
- No promotion marks, event artwork or licensed photography without permission.
- No automatic publishing and no automatic social posting.

If a future story does cite a deterministic aggregate, it must carry a
`modelDisclosure`: the exact version, its input references, a plain-language
uncertainty statement and the responsible-play line. The
`ModelDisclosureBlock` component renders all four together — see
`forty-two-tracked-fields` in the seed data for a worked example.

---

## Accessibility and quality notes

- Semantic landmarks, a skip link, and a heading order that starts at one `h1`
  per page.
- Visible 2px focus rings on every interactive element.
- Hero visuals are exposed as a single labelled image (`role="img"` plus
  `aria-label` from `heroAlt`); the same facts appear in the body and in "The
  file", so nothing is only available visually.
- Relative times go through `Intl.RelativeTimeFormat`, which already knows Czech
  numeral agreement — no relative time string is hand-assembled.
- Counts shown to readers (Data Desk figures, evidence coverage) are computed
  from the repository, never asserted in copy.
- `prefers-reduced-motion` is respected globally.
- The locale switcher preserves the current route. Every route exists in both
  locales, so the alternate is always valid.

## Known issues

`npm audit` reports advisories in `postcss` and `sharp`, both transitive
build-time dependencies of Next.js 15.5. `npm audit fix --force` would downgrade
Next to v9 and is not the fix; they clear on a future Next release. No raster
image pipeline is used by this site.

## Licence

Private. All rights reserved.
