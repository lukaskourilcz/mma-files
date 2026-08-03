import { getDictionary } from "@/i18n";
import type { Article, Locale } from "@/lib/types";
import { PhotoSlot } from "@/components/media/PhotoSlot";
import { articleDek, articleTitle } from "@/lib/repository";

/**
 * Deterministic, typographic heroes built from the story's own data.
 *
 * These are not photographs and are never presented as photographs: no stock
 * imagery, no generated likenesses, no promotion artwork. Each template reads
 * `heroSpec.bindings`, which carry only locale-neutral values — every label
 * comes from the dictionary, so one binding set renders correctly in both
 * languages.
 *
 * The whole composition is exposed as a single labelled image, because reading
 * the individual cells out of order tells a screen-reader user nothing. The
 * same facts appear in the body and in "The file".
 */

type Bindings = Record<string, string | number | boolean>;

function str(bindings: Bindings, key: string): string | undefined {
  const value = bindings[key];
  if (typeof value === "string") return value.trim() || undefined;
  if (typeof value === "number") return String(value);
  return undefined;
}

function num(bindings: Bindings, key: string): number | undefined {
  const value = bindings[key];
  return typeof value === "number" ? value : undefined;
}

function lookup(map: Record<string, string>, key: string | undefined): string | undefined {
  return key ? map[key] : undefined;
}

function Gap() {
  return (
    <span aria-hidden="true" className="inline-block h-[1px] w-4 bg-rule-dark-strong align-middle" />
  );
}

function Frame({
  children,
  label,
  className = "",
}: {
  children: React.ReactNode;
  label: string;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`grid-rules relative overflow-hidden rounded-[10px] border border-rule-dark bg-ink ${className}`}
    >
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-ember" />
      <div aria-hidden="true" className="flex h-full flex-col p-6 sm:p-8 md:p-10">
        {children}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function TapeColumn({
  name,
  record,
  rows,
  align,
}: {
  name: string;
  record?: string;
  rows: { label: string; value?: string }[];
  align: "left" | "right";
}) {
  const side = align === "right" ? "text-right items-end" : "text-left items-start";
  return (
    <div className={`flex flex-1 flex-col ${side}`}>
      <p className="text-xl font-bold leading-tight tracking-[-0.03em] text-white sm:text-2xl md:text-[1.75rem]">
        {name}
      </p>
      <p className="label-mono mt-1.5 text-ember">{record ?? <Gap />}</p>
      <dl className="mt-5 w-full space-y-1.5 sm:mt-7">
        {rows.map((row) => (
          <div
            key={row.label}
            className={`flex items-baseline gap-3 ${
              align === "right" ? "justify-end" : "justify-start"
            }`}
          >
            <dt className="label-mono-sm text-muted">{row.label}</dt>
            <dd className="font-mono text-sm text-paper">{row.value ?? <Gap />}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

export function HeroVisual({
  article,
  locale,
  className = "",
}: {
  article: Article;
  locale: Locale;
  className?: string;
}) {
  const dict = getDictionary(locale);
  const b = article.heroSpec.bindings;
  const label =
    article.heroAlt?.[locale] ?? articleTitle(article, locale);

  const fileTag = article.fileNumber
    ? `${dict.labels.file} ${String(article.fileNumber).padStart(3, "0")}`
    : dict.formats[article.format];

  if (article.image) {
    return (
      <figure className={`relative overflow-hidden rounded-[10px] border border-rule-strong bg-ink ${className}`}>
        <PhotoSlot image={article.image} locale={locale} sizes="(min-width: 1024px) 80vw, 100vw" priority />
      </figure>
    );
  }

  switch (article.heroSpec.template) {
    /* ---------------------------------------------------------------- tape */
    case "tale-of-the-tape": {
      const division = lookup(dict.divisions, str(b, "divisionKey"));
      const rowsFor = (prefix: "left" | "right") => [
        {
          label: dict.fighterFields.heightCm,
          value: num(b, `${prefix}HeightCm`)
            ? `${num(b, `${prefix}HeightCm`)} cm`
            : undefined,
        },
        {
          label: dict.fighterFields.reachCm,
          value: num(b, `${prefix}ReachCm`)
            ? `${num(b, `${prefix}ReachCm`)} cm`
            : undefined,
        },
        {
          label: dict.fighterFields.stance,
          value: lookup(dict.stances, str(b, `${prefix}Stance`)),
        },
      ];

      return (
        <Frame label={label} className={className}>
          <div className="flex items-center justify-between gap-4">
            <span className="label-mono text-ember">{fileTag}</span>
            <span className="label-mono-sm text-muted">{dict.fighters.tape}</span>
          </div>

          <div className="mt-8 flex flex-1 items-start gap-4 sm:gap-8">
            <TapeColumn
              name={str(b, "leftName") ?? "—"}
              record={str(b, "leftRecord")}
              rows={rowsFor("left")}
              align="left"
            />
            <div className="flex shrink-0 flex-col items-center self-stretch pt-2">
              <span className="label-mono-sm text-muted">vs</span>
              <span
                aria-hidden="true"
                className="mt-3 w-px flex-1 bg-rule-dark-strong"
              />
            </div>
            <TapeColumn
              name={str(b, "rightName") ?? "—"}
              record={str(b, "rightRecord")}
              rows={rowsFor("right")}
              align="right"
            />
          </div>

          {division ? (
            <p className="label-mono mt-8 border-t border-rule-dark pt-4 text-paper-muted">
              {division}
            </p>
          ) : null}
        </Frame>
      );
    }

    /* -------------------------------------------------------------- result */
    case "type-led-result": {
      const methodKey = str(b, "methodKey");
      const methodShort = lookup(dict.methodsShort, methodKey);
      const methodFull = lookup(dict.methods, methodKey);
      const round = num(b, "round");
      const time = str(b, "time");

      return (
        <Frame label={label} className={className}>
          <div className="flex items-center justify-between gap-4">
            <span className="label-mono text-ember">{fileTag}</span>
            <span className="label-mono-sm text-muted">{str(b, "eventName")}</span>
          </div>

          <div className="mt-7 flex flex-1 flex-col justify-center">
            <p className="text-[clamp(2.5rem,11vw,5.5rem)] font-bold uppercase leading-[0.86] tracking-[-0.05em] text-white">
              {methodShort ?? methodFull ?? "—"}
            </p>
            <p className="mt-5 max-w-xl text-lg font-medium leading-snug text-paper sm:text-xl">
              <span className="text-white">{str(b, "winner")}</span>{" "}
              <span className="label-mono align-middle text-ember">def.</span>{" "}
              <span className="text-paper-muted">{str(b, "loser")}</span>
            </p>
          </div>

          <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-t border-rule-dark pt-4">
            {methodFull ? (
              <div>
                <dt className="label-mono-sm text-muted">{dict.labels.method}</dt>
                <dd className="mt-1 font-mono text-sm text-white">{methodFull}</dd>
              </div>
            ) : null}
            {round ? (
              <div>
                <dt className="label-mono-sm text-muted">R</dt>
                <dd className="mt-1 font-mono text-sm text-white">{round}</dd>
              </div>
            ) : null}
            {time ? (
              <div>
                <dt className="label-mono-sm text-muted">T</dt>
                <dd className="mt-1 font-mono text-sm text-white">{time}</dd>
              </div>
            ) : null}
          </dl>
        </Frame>
      );
    }

    /* ----------------------------------------------------------- data card */
    case "data-card": {
      const metrics = [1, 2, 3]
        .map((i) => ({
          label: lookup(dict.heroMetrics, str(b, `metric${i}`)),
          value: str(b, `value${i}`),
        }))
        .filter((m): m is { label: string; value: string } =>
          Boolean(m.label && m.value !== undefined),
        );

      return (
        <Frame label={label} className={className}>
          <div className="flex items-center justify-between gap-4">
            <span className="label-mono text-ember">{fileTag}</span>
            <span className="label-mono-sm text-muted">{str(b, "eventName")}</span>
          </div>

          <dl className="mt-8 flex flex-1 flex-col justify-center gap-6 sm:flex-row sm:items-end sm:gap-10">
            {metrics.map((metric) => (
              <div key={metric.label} className="flex-1 border-t border-rule-dark pt-4">
                <dd className="text-[clamp(2.25rem,7vw,3.75rem)] font-bold leading-none tracking-[-0.05em] text-white">
                  {metric.value}
                </dd>
                <dt className="label-mono-sm mt-3 text-paper-muted">{metric.label}</dt>
              </div>
            ))}
          </dl>
        </Frame>
      );
    }

    /* --------------------------------------------------------------- quote */
    case "quote-led-preview":
    default: {
      const left = str(b, "leftName");
      const right = str(b, "rightName");
      const rounds = num(b, "rounds");

      return (
        <Frame label={label} className={className}>
          <div className="flex items-center justify-between gap-4">
            <span className="label-mono text-ember">{fileTag}</span>
            <span className="label-mono-sm text-muted">{str(b, "eventName")}</span>
          </div>

          <div className="mt-7 flex flex-1 flex-col justify-center">
            <span aria-hidden="true" className="mb-4 block h-[2px] w-10 bg-ember" />
            <p className="max-w-2xl text-xl font-medium leading-[1.32] tracking-[-0.02em] text-white sm:text-2xl md:text-[1.75rem]">
              {article.heroLine?.[locale] ?? articleDek(article, locale)}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-baseline gap-x-4 gap-y-2 border-t border-rule-dark pt-4">
            {left && right ? (
              <p className="label-mono text-paper">
                {left} <span className="text-ember">vs</span> {right}
              </p>
            ) : null}
            {rounds ? (
              <p className="label-mono-sm text-muted">{rounds} × 5:00</p>
            ) : null}
          </div>
        </Frame>
      );
    }
  }
}
