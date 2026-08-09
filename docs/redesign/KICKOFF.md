# Kickoff prompt for Codex

Paste everything below the line into Codex as the opening prompt. It assumes
both repositories are checked out side by side.

---

You are implementing the full MMA Files relaunch across two repositories:
**lukaskourilcz/mma-files** (the Czech MMA magazine site) and
**lukaskourilcz/quorum** (BoardlessAI, which produces everything the site
publishes). The program is already cut into GitHub issues. Your job is to work
them one by one, in order, until both repos are done.

## Setup

Check out branch `claude/mma-files-redesign-2sacl9` in **both** repos — it
exists in both, and every spec lives on the mma-files copy. Then read, in this
order:

1. `mma-files/CLAUDE.md` and `quorum/CLAUDE.md` — binding rules for each repo.
2. `mma-files/docs/redesign/AMENDMENTS.md` — owner amendments, the
   **highest-precedence** spec layer. Amendment 1: **keep Anton** — no
   superseded display-face reference may exist anywhere in the tree.
3. `mma-files/MMA-FILES-RELAUNCH-CODEX.md` + `mma-files/design-tokens.css` —
   the design truth (tokens already amended for Anton).
4. `mma-files/docs/redesign/PROMPT-CODEX.md` — the engineering spec: the
   non-negotiable contracts and workstreams A–C (quorum-side work included).
5. `mma-files/docs/redesign/BRAINSTORM.md` §2 — the verified diagnosis of why
   the UFC/OKTAGON boards are empty.
6. `mma-files/docs/redesign/CODEX-PROMPTS.md` — per-step build notes for the
   site issues.

Precedence when documents disagree: **AMENDMENTS → design handoff
(MMA-FILES-RELAUNCH-CODEX.md + design-tokens.css) → PROMPT-CODEX.md →
CODEX-PROMPTS.md.** Three conflicts are already resolved for you: Anton stays
(Amendment 1); the new route is `/cs/predikce`; `/cs/data-desk` stays as a
footer-only page with **no redirect**.

## How to work

The execution order lives in the tracker:
**mma-files issue #13 — „MMA Files relaunch — tracker"**. It sequences
mma-files #1–#12 (M1–M12) and quorum #95–#100 (Q1–Q6) across four phases.

For each issue, strictly one at a time:

1. Read the issue and the spec sections it cites. Implement it completely in
   the repo it belongs to.
2. Run the issue's **Accept** commands and make them pass.
3. Commit as you go — small conventional commits per coherent unit
   (`feat(...)`, `fix(...)`, `refactor(...)`, `docs(...)`), typecheck before
   each code commit, never one batch commit for a whole issue with multiple
   units.
4. Push the working branch (`claude/mma-files-redesign-2sacl9`) after each
   issue — push branches freely and often.
5. Close the issue with a short completion comment: commit range, acceptance
   output summary, any deviation and why. Tick its box in tracker #13.

**Do not touch `main` in either repo until every issue in both repos is
closed.** Then run the final gate from the tracker — mma-files
`npm run check` + `npm run build` with `NEXT_PUBLIC_DEMO_MODE=false`; quorum
`pnpm test` + `pnpm -C site typecheck && pnpm -C site build` — and only when
everything is green: merge the branch into `main` in **both** repos, push
`main`, delete the merged working branches. Keep
`claude/article-image-selection-61rs70` in mma-files — it is unmerged and
waiting on an owner decision.

## Non-negotiables (full list in PROMPT-CODEX.md — these are the ones people
break)

- Czech is the only reader-facing language; the §6 dictionary strings are
  final copy, verbatim.
- Never invent fight data. No probability without model version + capture
  timestamp; no 50/50 defaults; „Model zatím neběžel" where no model line
  exists; honest empty states everywhere.
- Never weaken a guard, gate, test or workflow allowlist in either repo;
  `cycle.yml` allowlists get narrow additions only.
- `data/boardless/` is written only by `npm run consume:boardless`; nothing in
  mma-files authors content.
- Apify work is a $0 no-op until the owner resolves the INBOX approvals; no
  secrets in git, ever.
- Reproducible builds: no `new Date()`, `Date.now()` or `Math.random()` in any
  content-selection path (week windows included).
- Demo/fictional content keeps `isDemo` and the „Ukázkový obsah" chip; the
  built site mentions no AI, agents, engines or automation — the only company
  mention is „© 2026 MMA Files · Vydává BoardlessAI".

Finish with the final report structure from PROMPT-CODEX.md as the tracker's
closing comment: what shipped per issue with commit ranges, the FightAIQ
review summary, deviations, the owner action list, and production build
numbers.
