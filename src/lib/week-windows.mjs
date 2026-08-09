const DAY_MS = 86_400_000;
const WEEK_KEY = /^(\d{4})-W(\d{2})$/u;

function calendarDayUtc(value) {
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) throw new Error(`invalid ISO date: ${value}`);
  const date = new Date(timestamp);
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

/** Return the ISO calendar week key for an ISO timestamp. */
export function isoWeekKey(value) {
  const date = new Date(calendarDayUtc(value));
  const weekday = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - weekday);
  const isoYear = date.getUTCFullYear();
  const yearStart = Date.UTC(isoYear, 0, 1);
  const week = Math.ceil(((date.getTime() - yearStart) / DAY_MS + 1) / 7);
  return `${isoYear}-W${String(week).padStart(2, "0")}`;
}

/** UTC Monday and Sunday timestamps for an ISO week key. */
export function isoWeekBounds(key) {
  const match = WEEK_KEY.exec(key);
  if (!match) throw new Error(`invalid ISO week key: ${key}`);
  const year = Number(match[1]);
  const week = Number(match[2]);
  if (week < 1 || week > 53) throw new Error(`invalid ISO week key: ${key}`);

  const januaryFourth = new Date(Date.UTC(year, 0, 4));
  const weekday = januaryFourth.getUTCDay() || 7;
  const firstMonday = januaryFourth.getTime() - (weekday - 1) * DAY_MS;
  const from = firstMonday + (week - 1) * 7 * DAY_MS;
  return {
    from: new Date(from).toISOString(),
    to: new Date(from + 6 * DAY_MS).toISOString(),
  };
}

/**
 * Pure, newest-first ISO-week bucketing anchored on published content.
 * Items after the anchor are excluded, so a malformed future item cannot move
 * a static feed beyond the lead article that triggered the build.
 */
export function bucketIsoWeeks(items, anchor) {
  const anchorTimestamp = Date.parse(anchor);
  if (!Number.isFinite(anchorTimestamp)) throw new Error(`invalid anchor date: ${anchor}`);
  const buckets = new Map();

  for (const item of items) {
    const timestamp = Date.parse(item.publishAt);
    if (!Number.isFinite(timestamp)) throw new Error(`invalid publishAt: ${item.publishAt}`);
    if (timestamp > anchorTimestamp) continue;
    const key = isoWeekKey(item.publishAt);
    const bucket = buckets.get(key) ?? [];
    bucket.push(item);
    buckets.set(key, bucket);
  }

  return [...buckets.entries()]
    .sort(([left], [right]) => Date.parse(isoWeekBounds(right).from) - Date.parse(isoWeekBounds(left).from))
    .map(([key, articles]) => ({
      key,
      ...isoWeekBounds(key),
      articles: [...articles].sort((left, right) => {
        const dateOrder = Date.parse(right.publishAt) - Date.parse(left.publishAt);
        return dateOrder || String(left.slug ?? "").localeCompare(String(right.slug ?? ""), "cs");
      }),
    }));
}

/** Czech week-divider label, always formatted in UTC. */
export function formatWeekRangeLabel(key, locale = "cs-CZ") {
  const { from, to } = isoWeekBounds(key);
  const start = new Date(from);
  const end = new Date(to);
  const sameMonth = start.getUTCFullYear() === end.getUTCFullYear()
    && start.getUTCMonth() === end.getUTCMonth();
  const sameYear = start.getUTCFullYear() === end.getUTCFullYear();
  const format = (date, options) => new Intl.DateTimeFormat(locale, {
    ...options,
    timeZone: "UTC",
  }).format(date);

  if (sameMonth) {
    return `Týden ${format(start, { day: "numeric" })}–${format(end, { day: "numeric", month: "long" })}`;
  }
  if (sameYear) {
    return `Týden ${format(start, { day: "numeric", month: "long" })}–${format(end, { day: "numeric", month: "long" })}`;
  }
  return `Týden ${format(start, { day: "numeric", month: "long", year: "numeric" })}–${format(end, { day: "numeric", month: "long", year: "numeric" })}`;
}
