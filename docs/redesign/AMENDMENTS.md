# Owner amendments to the design handoff

Highest-precedence layer of the relaunch spec. Where this file disagrees with
`MMA-FILES-RELAUNCH-CODEX.md`, `design-tokens.css` comments,
`docs/redesign/CODEX-PROMPTS.md` or `docs/redesign/PROMPT-CODEX.md`, this file
wins. Full order: **AMENDMENTS.md → MMA-FILES-RELAUNCH-CODEX.md (+
design-tokens.css) → PROMPT-CODEX.md → CODEX-PROMPTS.md**.

## Amendment 1 — keep Anton, drop Barlow Condensed (owner, 2026-08-09)

The handoff's decision §1.1 (Barlow Condensed 700/800 as the display face) is
reversed. Concretely:

- Keep the existing Anton import in `src/app/[locale]/layout.tsx` exactly as
  it is (`latin` + `latin-ext`, `--font-anton`). Do **not** import
  Barlow_Condensed anywhere; no `--font-barlow-condensed` variable may exist
  in the tree.
- `design-tokens.css` is already amended: `--font-display` resolves to Anton,
  `--leading-display` is 1.16 (the Anton value proven against Czech carons in
  the current tree — the handoff's 0.94 was Barlow-specific and would clip
  diacritics on Anton), `--leading-display-tight` is 1.05 for guaranteed
  single lines.
- Anton has one weight. Wherever the spec says “`.display` 800” or
  “`.display` 700 / `.display-700`”, both render Anton 400; the hierarchy the
  two weights were meant to carry is carried by the size scale
  (`--text-d1`–`--text-d6`) alone. Keep both class names (`.display`,
  `.display-700`) so §7/§8 references stay traceable, with a comment noting
  they share one weight; `font-synthesis-weight: none` stays, so no faux bold.
- The wordmark and OG template (§11) are set in Anton 400, not
  “Barlow Condensed 800”. The wordmark still ships with text converted to
  outlines.
- If a tighter display leading visually clears Č Ř Š Ť Ž at a given size, it
  may be tightened there — but never below what keeps every caron unclipped.
  Czech diacritics outrank poster tightness.
