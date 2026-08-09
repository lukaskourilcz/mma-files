import type { Organization } from "@/lib/types";

/**
 * Promotion accent colours.
 *
 * A promotion colour is a fill, a card's top rule, the section rule under a
 * promotion heading, or a nav underline on hover. It is never body text — at
 * these values neither clears 4.5:1 on paper. The record is exhaustive over
 * `Organization`, so adding a promotion is a compile error until it has a
 * colour.
 */
export const PROMOTION_ACCENT: Record<Organization, string> = {
  ufc: "var(--color-badge-ufc)",
  oktagon: "var(--color-badge-oktagon)",
};

/** Desk-authored files carry no promotion, so they take the ink accent. */
export function accentFor(organization?: Organization): string {
  return organization ? PROMOTION_ACCENT[organization] : "var(--color-accent)";
}
