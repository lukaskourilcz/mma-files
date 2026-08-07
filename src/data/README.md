# Datasets

`mma-facts.json` holds 50 verified MMA facts. `src/lib/facts.ts` reads it at
build time and `src/components/site/DidYouKnow.tsx` renders one of them on the
homepage. Nothing reads it at runtime.

The file follows `boardless-dataset/1`. The deterministic daily pick lives in
`src/lib/daily-index.mjs`; the schema is asserted by `tests/facts.test.mjs`.

This is not seed content. The facts are real and checkable, so they carry no
`isDemo` flag and they render in demo and live mode alike. They are also not a
delivery: `data/boardless/` stays the only write target for BoardlessAI
packages, and `src/lib/repository.ts` stays the only read path for articles.
This dataset is a separate, additive read surface and touches neither.

## Array order is the reveal order

`entries[0]` is the fact shown on `anchor`. Each following day advances one
index and wraps with a modulo, so the array length is the cycle length. The date
that drives the pick is the lead article's published date, not a clock — the
site is static and rebuilds when content lands, so a day without a new article
honestly keeps the previous fact.

## The file is append-only

Existing entries are never edited, reordered, or deleted. The one exception is a
factual error: correct the text and set `verified` to the date of the re-check.

New entries go at the end. The cycle simply gets longer — no schema change, no
code change, no test edit. The count assertion is a minimum (`>= 50`) for
exactly this reason.

## Who may append

BoardlessAI agents, through the same content-only GitHub App commit channel that
delivers articles. Never a runtime write, never a human-invoked side door.

An append commit touches only the dataset file and carries the standard delivery
attribution. Each new entry ships with its own receipt: `verified` records when
someone last checked it, `source` records where a human can check it again.
Upstream, quorum records the append in its content inventory. That recording is
quorum's job, not this repository's.

## Validation is the gate

`tests/facts.test.mjs` runs inside `npm run check`, so a malformed append fails
CI instead of shipping. It asserts unique `id` and `slug`, `category` membership
in the file's own `categories` map, the date and slug patterns, non-empty `cs`
and `en` text on every entry, and a `promotion` of `ufc`, `oktagon`, or `cross`.

The UI is Czech only, matching `LOCALES = ["cs"]`. Entries still carry `en` text
because the dataset is shared with the sibling magazine and the feeds; the
reader pages never render it.

## Never

- An entry without a `source` a human can check.
- An invented record, date, or statistic.
- A model-generated "fact" with no human-verifiable grounding.
- An `id` or `slug` reused after a removal.
