# MMA Files

MMA Files is a Czech magazine about UFC and Oktagon. It publishes sourced
articles, event and fighter records, results, and clearly labelled experimental
predictions. Unknown or disputed facts remain visible instead of being filled
with estimates.

This repository contains the public Next.js site. Editorial production and
source credentials live upstream in `lukaskourilcz/quorum`; this repository
accepts only validated delivery packages.

## Stack

- Next.js 15 App Router, React 19, and strict TypeScript
- Tailwind CSS v4
- Node.js 20.9 or newer
- Static production pages; no database or runtime CMS

## Local development

```bash
npm install
npm run dev
```

The local site is available at `http://localhost:3000`. Reader routes are Czech
and live under `/cs`.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run typecheck` | Run TypeScript without emitting files |
| `npm run lint` | Run ESLint |
| `npm run test` | Run delivery, dataset, route, and UI contract tests |
| `npm run check` | Run typecheck, lint, and tests |
| `npm run build` | Emit data chunks and create the production build |
| `npm run consume:boardless -- <package.json> [repo-root]` | Validate and consume one delivery package |

Run `npm run check` before every code commit. Run the production build before a
release.

## Environment

All variables are optional and default to the safe, non-indexed state.

| Variable | Default | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://mma-files.vercel.app` | Canonical origin for metadata, RSS, and the sitemap |
| `NEXT_PUBLIC_DEMO_MODE` | `true` | Shows demo labels and forces indexing off |
| `NEXT_PUBLIC_ALLOW_INDEXING` | `false` | Enables indexing only when demo mode is also off |

Use `NEXT_PUBLIC_DEMO_MODE=false npm run build` to rehearse the live-content
build. Production indexing remains an explicit owner decision.

## Content and delivery

Reader routes must load content through `src/lib/repository.ts`. They must not
import `src/content/` directly. The files in `src/content/` are fictional demo
fixtures and keep their `isDemo` marker and visible `Ukázkový obsah` label.

The upstream publisher sends three content-only package types:

- `article/1` updates `data/boardless/articles.json`;
- `fightaiq-delivery/2` updates `data/boardless/fightaiq.json`;
- `mma-ads/1` updates `data/boardless/ads.json` when advertising is approved.

Only `npm run consume:boardless` may write `data/boardless/`. The consumer
checks schema versions, provenance, canonical hashes, image metadata, prediction
disclosures, and the allowed target file. It never needs source, model, or
GitHub App secrets.

Fight data is never invented. A probability renders only with its model version
and capture timestamp. A bout without a model line says `Model zatím neběžel`.
Cancelled and postponed bouts do not appear as upcoming.

Generated public chunks live under `public/data/` and are rebuilt by
`npm run build`; do not edit them by hand.

## Project map

```text
src/app/[locale]/     Czech reader routes and metadata
src/components/       Reader UI grouped by surface
src/config/           Navigation and site settings
src/content/          Fictional, visibly labelled demo fixtures
src/data/             Verified static datasets
src/i18n/cs.ts        Final reader-facing Czech copy
src/lib/              Repository, delivery, formatting, and route helpers
data/boardless/       Validated upstream delivery stores
scripts/              Consumers and deterministic build emitters
tests/                Delivery and reader contracts
```

URLs come from `src/lib/paths.ts`. Styling tokens live in
`src/app/globals.css`. The current design handoff and amendments are under
`docs/redesign/`.

## Images, marks, and licensing

- Do not commit promotion logos, event artwork, or fighter photography without
  documented rights.
- A missing photograph renders a labelled placeholder; never substitute an
  unrelated stock image.
- Delivered photographs require attribution, licence metadata, and a source
  URL. The consumer rejects unapproved hosts and missing thumbnails.
- Brand assets in `public/brand/` are MMA Files project assets. Third-party
  marks remain the property of their owners.
- Anton, Archivo, and IBM Plex Mono are loaded under their upstream open-font
  licences. Keep notices when redistributing font files.

## Release checklist

1. Run `npm run check`.
2. Run `NEXT_PUBLIC_DEMO_MODE=false npm run build`.
3. Confirm demo labels, empty states, sources, and correction notes remain
   honest for the delivered data.
4. Confirm no secrets or unauthorized media entered the diff.
5. Push the verified session branch and merge it through the repository's
   normal review flow.

Owner-only production steps are tracked in [NEEDED.md](NEEDED.md).
