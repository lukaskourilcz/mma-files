import Link from "next/link";
import { Container, Kicker } from "@/components/ui/primitives";
import type { ReactNode } from "react";

export interface Crumb {
  href?: string;
  label: string;
}

export function Breadcrumbs({ items, tone = "ink" }: { items: Crumb[]; tone?: "ink" | "paper" }) {
  const onDark = tone === "paper";
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, i) => (
          <li key={`${item.label}-${i}`} className="flex items-center gap-2">
            {i > 0 ? (
              <span
                aria-hidden="true"
                className={onDark ? "text-text-inverse-meta" : "text-rule-strong"}
              >
                /
              </span>
            ) : null}
            {item.href ? (
              <Link
                href={item.href}
                className={`label-mono-sm ${
                  onDark
                    ? "text-text-inverse-muted hover:text-accent-on-dark"
                    : "text-text-muted hover:text-accent"
                }`}
              >
                {item.label}
              </Link>
            ) : (
              <span
                aria-current="page"
                className={`label-mono-sm ${onDark ? "text-text-inverse" : "text-text"}`}
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/**
 * The site's only page opening: breadcrumb, kicker, Anton H1, dek, accent rule.
 *
 * Every interior route uses this. The `accent` prop exists so the promotion
 * pages can colour the rule with their own badge fill; everything else takes
 * the house red.
 */
export function PageHeader({
  crumbs,
  kicker,
  title,
  dek,
  accent = "var(--color-accent)",
  children,
}: {
  crumbs?: Crumb[];
  kicker?: string;
  title: string;
  dek?: string;
  accent?: string;
  children?: ReactNode;
}) {
  return (
    <header className="bg-paper">
      <Container className="pt-10 md:pt-14">
        {crumbs ? (
          <div className="mb-6">
            <Breadcrumbs items={crumbs} />
          </div>
        ) : null}
        {kicker ? (
          <div className="mb-2.5">
            <Kicker>{kicker}</Kicker>
          </div>
        ) : null}
        <h1 className="display text-[length:var(--text-d2)] text-text">{title}</h1>
        {dek ? (
          <p className="mt-4 max-w-[68ch] text-[length:var(--text-base)] leading-relaxed text-text-muted">
            {dek}
          </p>
        ) : null}
        <span className="mt-7 block h-[3px] w-full" style={{ backgroundColor: accent }} />
        {children}
      </Container>
    </header>
  );
}
