// Types for `daily-index.mjs`. The implementation stays plain ESM so the
// `node --test` suite can import it directly; this declaration lets the
// TypeScript app import the same file without `allowJs`.

/** Whole days from anchor to dateKey; both are YYYY-MM-DD calendar dates. */
export function daysBetween(anchor: string, dateKey: string): number;

/** Clamp a possibly-missing or pre-anchor date to the anchor. */
export function effectiveDateKey(anchor: string, dateKey: string | undefined): string;

/** Deterministic daily pick: 0-based index into the entries array. */
export function dailyIndex(anchor: string, dateKey: string, length: number): number;

/** How many entries have been revealed so far. */
export function revealedCount(anchor: string, dateKey: string, length: number): number;
