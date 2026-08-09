import type { Organization } from "@/lib/types";

/** The complete public payload for one lazy article row; never body or sources. */
export interface WeekArticleCard {
  slug: string;
  title: string;
  dek: string;
  org: Organization | null;
  publishAt: string;
  thumbPath: string | null;
  thumbAlt: string | null;
  thumbCredit: string | null;
  thumbCreditUrl: string | null;
  isDemo: boolean;
}

export function isWeekArticleCard(value: unknown): value is WeekArticleCard {
  if (!value || typeof value !== "object") return false;
  const card = value as Partial<WeekArticleCard>;
  return typeof card.slug === "string"
    && typeof card.title === "string"
    && typeof card.dek === "string"
    && (card.org === "ufc" || card.org === "oktagon" || card.org === null)
    && typeof card.publishAt === "string"
    && (typeof card.thumbPath === "string" || card.thumbPath === null)
    && (typeof card.thumbAlt === "string" || card.thumbAlt === null)
    && (typeof card.thumbCredit === "string" || card.thumbCredit === null)
    && (typeof card.thumbCreditUrl === "string" || card.thumbCreditUrl === null)
    && typeof card.isDemo === "boolean";
}
