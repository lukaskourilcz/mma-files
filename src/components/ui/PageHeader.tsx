import Link from "next/link";
import { Container, Kicker } from "@/components/ui/primitives";
import type { ReactNode } from "react";

export interface Crumb {
  href?: string;
  label: string;
}

export function Breadcrumbs({ items, tone = "ink" }: { items: Crumb[]; tone?: "ink" | "paper" }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, i) => (
          <li key={`${item.label}-${i}`} className="flex items-center gap-2">
            {i > 0 ? (
              <span
                aria-hidden="true"
                className={tone === "paper" ? "text-muted" : "text-rule-strong"}
              >
                /
              </span>
            ) : null}
            {item.href ? (
              <Link
                href={item.href}
                className={`label-mono-sm hover:text-ember ${
                  tone === "paper" ? "text-paper-muted" : "text-ink-muted"
                }`}
              >
                {item.label}
              </Link>
            ) : (
              <span
                aria-current="page"
                className={`label-mono-sm ${tone === "paper" ? "text-white" : "text-ink"}`}
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

/** Standard page opening: breadcrumb, kicker, H1, dek. */
export function PageHeader({
  crumbs,
  kicker,
  title,
  dek,
  children,
}: {
  crumbs?: Crumb[];
  kicker?: string;
  title: string;
  dek?: string;
  children?: ReactNode;
}) {
  return (
    <div className="border-b border-rule-strong bg-white">
      <Container className="py-10 md:py-14">
        {crumbs ? (
          <div className="mb-6">
            <Breadcrumbs items={crumbs} />
          </div>
        ) : null}
        {kicker ? <Kicker>{kicker}</Kicker> : null}
        <h1 className="mt-3 max-w-3xl text-[2rem] leading-[1.08] tracking-[-0.04em] text-ink md:text-[2.75rem]">
          {title}
        </h1>
        {dek ? (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted md:text-lg">
            {dek}
          </p>
        ) : null}
        {children}
      </Container>
    </div>
  );
}
