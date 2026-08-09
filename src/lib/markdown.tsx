import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { getEventBySlug, getFighters } from "@/lib/repository";
import { routes } from "@/lib/paths";
import type { Locale } from "@/lib/types";

/**
 * A deliberately small Markdown subset, rendered to React nodes.
 *
 * Nothing here goes through `dangerouslySetInnerHTML`, so article bodies cannot
 * inject markup. Supported:
 *
 *   ## Heading            → h2
 *   ### Heading           → h3
 *   > Quoted line         → blockquote
 *   - Item                → unordered list
 *   **bold**              → strong
 *   [label](https://…)    → external link
 *   [[fighter:slug|Label]] → internal fighter link
 *   [[event:slug|Label]]   → internal event link
 *
 * An internal link whose target is not in the repository renders as plain text
 * rather than a dead link.
 */

const INLINE =
  /\[\[(fighter|event):([a-z0-9-]+)\|([^\]]+)\]\]|\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*/g;

function internalHref(
  kind: string,
  slug: string,
  locale: Locale,
): string | undefined {
  if (kind === "fighter") {
    const fighter = getFighters().find((f) => f.slug === slug);
    return fighter ? routes.fighter(locale, fighter.organization, fighter.slug) : undefined;
  }
  const event = getEventBySlug(slug);
  return event ? routes.event(locale, event.slug) : undefined;
}

function renderInline(text: string, locale: Locale, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let cursor = 0;
  let index = 0;

  INLINE.lastIndex = 0;
  let match = INLINE.exec(text);
  while (match !== null) {
    if (match.index > cursor) {
      nodes.push(text.slice(cursor, match.index));
    }

    const [full, internalKind, internalSlug, internalLabel, linkLabel, linkHref, bold] =
      match;
    const key = `${keyPrefix}-i${index}`;

    if (internalKind && internalSlug && internalLabel) {
      const href = internalHref(internalKind, internalSlug, locale);
      nodes.push(
        href ? (
          <Link key={key} href={href}>
            {internalLabel}
          </Link>
        ) : (
          internalLabel
        ),
      );
    } else if (linkLabel && linkHref) {
      if (linkHref.startsWith("/")) {
        const href = linkHref.startsWith(`/${locale}/`) ? linkHref : `/${locale}${linkHref}`;
        nodes.push(<Link key={key} href={href}>{linkLabel}</Link>);
      } else {
        nodes.push(
          <a key={key} href={linkHref} rel="noopener noreferrer nofollow" target="_blank">
            {linkLabel}
          </a>,
        );
      }
    } else if (bold) {
      nodes.push(<strong key={key}>{bold}</strong>);
    }

    cursor = match.index + full.length;
    index += 1;
    match = INLINE.exec(text);
  }

  if (cursor < text.length) nodes.push(text.slice(cursor));
  return nodes;
}

function renderBlock(block: string, locale: Locale, key: string): ReactNode {
  const lines = block.split("\n");
  const first = lines[0] ?? "";

  if (first.startsWith("### ")) {
    return <h3 key={key}>{renderInline(first.slice(4), locale, key)}</h3>;
  }

  if (first.startsWith("## ")) {
    return <h2 key={key}>{renderInline(first.slice(3), locale, key)}</h2>;
  }

  if (first.startsWith("> ")) {
    const quote = lines.map((l) => l.replace(/^>\s?/, "")).join(" ");
    return <blockquote key={key}>{renderInline(quote, locale, key)}</blockquote>;
  }

  if (first.startsWith("- ")) {
    return (
      <ul key={key}>
        {lines
          .filter((l) => l.startsWith("- "))
          .map((line, i) => (
            <li key={`${key}-li${i}`}>{renderInline(line.slice(2), locale, `${key}-li${i}`)}</li>
          ))}
      </ul>
    );
  }

  return <p key={key}>{renderInline(lines.join(" "), locale, key)}</p>;
}

/**
 * Remove the grounding markers BoardlessAI writes into an article body.
 *
 * A marker is how the desk proves a figure came from a record, and its release gate rejects
 * any line carrying a figure without one. It names a path inside that repository, so it is
 * not a citation a reader can follow: the first delivered article printed
 * "[source:state/mma/fighters/ufc:valentina-shevchenko.json]" in the middle of a sentence,
 * six times, in both languages. BoardlessAI no longer sends them, and this strips whatever
 * already shipped, since a delivered package is sealed by its hash and cannot be edited.
 */
function withoutSourceMarkers(body: string): string {
  return body
    .replace(/(?:\[\^source-\d+\]|\[source:[^\]]+\])/giu, "")
    .replace(/[ \t]+([.,;:!?])/gu, "$1")
    .replace(/[ \t]{2,}/gu, " ")
    .replace(/[ \t]+$/gmu, "");
}

export function Prose({
  body,
  locale,
  className,
  afterThirdBlock,
}: {
  body: string;
  locale: Locale;
  className?: string;
  afterThirdBlock?: ReactNode;
}) {
  const blocks = withoutSourceMarkers(body)
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);

  return (
    <div className={className ?? "prose-file"}>
      {blocks.map((block, i) => (
        <Fragment key={`b${i}`}>
          {renderBlock(block, locale, `b${i}-content`)}
          {i === 2 ? afterThirdBlock : null}
        </Fragment>
      ))}
    </div>
  );
}
