export interface WeekSource {
  publishAt: string;
  slug?: string;
}

export interface IsoWeek<T extends WeekSource> {
  key: string;
  from: string;
  to: string;
  articles: T[];
}

export function isoWeekKey(value: string): string;
export function isoWeekBounds(key: string): { from: string; to: string };
export function bucketIsoWeeks<T extends WeekSource>(items: readonly T[], anchor: string): IsoWeek<T>[];
export function formatWeekRangeLabel(key: string, locale?: string): string;
