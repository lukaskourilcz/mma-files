/**
 * The deterministic daily pick, as dependency-free ESM.
 *
 * This is the canonical implementation. The app imports it through the typed
 * re-export in `daily.ts`; the `node --test` suite imports it directly, because
 * those tests are plain `.mjs` and cannot load TypeScript. One implementation,
 * two consumers — never a second copy that can drift.
 *
 * The site is static and rebuilds when an article lands, not on a clock, so the
 * date driving the pick is the lead article's published date. A day without a
 * new article honestly keeps the previous fact, and the same content always
 * builds the same HTML.
 */

/**
 * Whole days from anchor to dateKey; both are YYYY-MM-DD calendar dates.
 * @param {string} anchor
 * @param {string} dateKey
 * @returns {number}
 */
export function daysBetween(anchor, dateKey) {
  /** @param {string} value @returns {number} */
  const parse = (value) => {
    const [y, m, d] = value.split("-").map(Number);
    if (y === undefined || m === undefined || d === undefined) {
      throw new Error(`invalid date key: ${value}`);
    }
    return Date.UTC(y, m - 1, d);
  };
  return Math.round((parse(dateKey) - parse(anchor)) / 86_400_000);
}

/**
 * Clamp a possibly-missing or pre-anchor date to the anchor. ISO strings
 * compare lexically.
 * @param {string} anchor
 * @param {string | undefined} dateKey
 * @returns {string}
 */
export function effectiveDateKey(anchor, dateKey) {
  return dateKey !== undefined && dateKey >= anchor ? dateKey : anchor;
}

/**
 * Deterministic daily pick: 0-based index into the entries array.
 * @param {string} anchor
 * @param {string} dateKey
 * @param {number} length
 * @returns {number}
 */
export function dailyIndex(anchor, dateKey, length) {
  if (length <= 0) throw new Error("dailyIndex requires a non-empty dataset");
  const n = daysBetween(anchor, dateKey);
  return ((n % length) + length) % length;
}

/**
 * How many entries have been revealed so far.
 * @param {string} anchor
 * @param {string} dateKey
 * @param {number} length
 * @returns {number}
 */
export function revealedCount(anchor, dateKey, length) {
  if (length <= 0) throw new Error("revealedCount requires a non-empty dataset");
  return Math.max(1, Math.min(length, daysBetween(anchor, dateKey) + 1));
}
