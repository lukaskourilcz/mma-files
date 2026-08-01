import Link from "next/link";
import { Chip, DataRow, Kicker } from "@/components/ui/primitives";
import { getDictionary } from "@/i18n";
import { formatDate, formatStamp } from "@/lib/format";
import { routes } from "@/lib/paths";
import { getEventById, resolveFighters } from "@/lib/repository";
import type {
  Article,
  Correction,
  Locale,
  ModelDisclosure,
  Source,
} from "@/lib/types";

/* -------------------------------------------------------------------------- */
/* Sources                                                                    */
/* -------------------------------------------------------------------------- */

function SourceItem({ source, locale }: { source: Source; locale: Locale }) {
  const dict = getDictionary(locale);
  const isInternal = source.kind === "internal";
  const heading = source.title ?? source.ref ?? "";

  return (
    <li className="border-t border-rule py-4 first:border-t-0 first:pt-0">
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-2">
        <Chip tone={isInternal ? "muted" : "default"}>
          {isInternal ? dict.labels.internal : dict.labels.external}
        </Chip>
        {source.classification ? (
          <Chip tone={source.classification === "primary" ? "ember" : "muted"}>
            {source.classification === "primary"
              ? dict.labels.primary
              : dict.labels.secondary}
          </Chip>
        ) : null}
        {source.retrievedAt ? (
          <span className="label-mono-sm text-muted">
            {dict.labels.retrieved} {formatStamp(source.retrievedAt)}
          </span>
        ) : null}
      </div>

      <p
        className={`mt-2.5 text-[0.9375rem] leading-snug text-ink ${
          isInternal && !source.title ? "font-mono text-[0.8125rem] break-all" : "font-medium"
        }`}
      >
        {source.url ? (
          <a
            href={source.url}
            rel="noopener noreferrer"
            target="_blank"
            className="underline decoration-ember decoration-[1.5px] underline-offset-[3px] hover:bg-ember-soft"
          >
            {heading}
          </a>
        ) : (
          heading
        )}
      </p>

      {source.publisher || (!source.url && source.kind === "external") ? (
        <p className="mt-1.5 flex flex-wrap items-center gap-x-2 text-xs text-ink-muted">
          {source.publisher ? <span>{source.publisher}</span> : null}
          {!source.url && source.kind === "external" ? (
            <>
              {source.publisher ? (
                <span aria-hidden="true" className="h-3 w-px bg-rule-strong" />
              ) : null}
              <span className="text-muted">{dict.labels.noLink}</span>
            </>
          ) : null}
        </p>
      ) : null}

      {source.ref && source.title ? (
        <p className="mt-1.5 break-all font-mono text-[0.6875rem] text-muted">
          {source.ref}
        </p>
      ) : null}

      {source.supports && source.supports.length > 0 ? (
        <p className="mt-2.5 text-xs leading-relaxed text-ink-muted">
          <span className="label-mono-sm text-muted">{dict.labels.supports}</span>{" "}
          {source.supports.join(" · ")}
        </p>
      ) : null}
    </li>
  );
}

export function SourceList({
  sources,
  locale,
  title,
}: {
  sources: Source[];
  locale: Locale;
  title?: string;
}) {
  const dict = getDictionary(locale);
  if (sources.length === 0) return null;

  return (
    <section aria-labelledby="sources" className="sheet p-5 md:p-6">
      <h2 id="sources" className="label-mono flex items-center gap-2 text-ink">
        <span aria-hidden="true" className="block h-[2px] w-4 bg-ember" />
        {title ?? dict.labels.sources}
        <span className="text-muted">({sources.length})</span>
      </h2>
      <ol className="mt-5">
        {sources.map((source, i) => (
          <SourceItem key={`${source.ref ?? source.title ?? "s"}-${i}`} source={source} locale={locale} />
        ))}
      </ol>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* The file                                                                   */
/* -------------------------------------------------------------------------- */

function BulletList({ items, tone }: { items: string[]; tone: "ember" | "muted" }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="relative pl-4 text-sm leading-relaxed text-ink-muted">
          <span
            aria-hidden="true"
            className={`absolute left-0 top-[0.6em] block h-[1px] w-2.5 ${
              tone === "ember" ? "bg-ember" : "bg-muted"
            }`}
          />
          {item}
        </li>
      ))}
    </ul>
  );
}

export function TheFile({ article, locale }: { article: Article; locale: Locale }) {
  const dict = getDictionary(locale);
  const event = article.eventRef ? getEventById(article.eventRef) : undefined;
  const fighters = resolveFighters(article.fighterRefs);
  const confirmed = article.confirmed?.[locale] ?? [];
  const unconfirmed = article.unconfirmed?.[locale] ?? [];

  return (
    <section aria-labelledby="the-file" className="sheet p-5 md:p-6">
      <h2 id="the-file" className="label-mono flex items-center gap-2 text-ink">
        <span aria-hidden="true" className="block h-[2px] w-4 bg-ember" />
        {dict.labels.theFile}
      </h2>

      <dl className="mt-4">
        <DataRow label={dict.labels.format}>{dict.formats[article.format]}</DataRow>
        {article.organization ? (
          <DataRow label={dict.labels.promotion}>
            <Link
              href={routes.organization(locale, article.organization)}
              className="underline decoration-ember decoration-[1.5px] underline-offset-[3px]"
            >
              {dict.organizations[article.organization]}
            </Link>
          </DataRow>
        ) : null}
        {event ? (
          <DataRow label={dict.labels.event}>
            <Link
              href={routes.event(locale, event.slug)}
              className="underline decoration-ember decoration-[1.5px] underline-offset-[3px]"
            >
              {event.name}
            </Link>
          </DataRow>
        ) : null}
        {fighters.length > 0 ? (
          <DataRow label={dict.labels.fighters}>
            <span className="flex flex-wrap justify-end gap-x-2 gap-y-1">
              {fighters.map((fighter, i) => (
                <span key={fighter.id}>
                  <Link
                    href={routes.fighter(locale, fighter.organization, fighter.slug)}
                    className="underline decoration-ember decoration-[1.5px] underline-offset-[3px]"
                  >
                    {fighter.name}
                  </Link>
                  {i < fighters.length - 1 ? "," : ""}
                </span>
              ))}
            </span>
          </DataRow>
        ) : null}
        {article.packageHash ? (
          <DataRow label="hash">
            <span className="font-mono text-xs text-ink-muted">
              {article.packageHash}
            </span>
          </DataRow>
        ) : null}
      </dl>

      {confirmed.length > 0 ? (
        <div className="mt-6">
          <h3 className="label-mono-sm text-ink">{dict.labels.confirmed}</h3>
          <div className="mt-3">
            <BulletList items={confirmed} tone="ember" />
          </div>
        </div>
      ) : null}

      <div className="mt-6">
        <h3 className="label-mono-sm text-ink">{dict.labels.unconfirmed}</h3>
        <div className="mt-3">
          {unconfirmed.length > 0 ? (
            <BulletList items={unconfirmed} tone="muted" />
          ) : (
            <p className="text-sm leading-relaxed text-ink-muted">
              {dict.labels.noneUnconfirmed}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Corrections                                                                */
/* -------------------------------------------------------------------------- */

export function CorrectionHistory({
  corrections,
  locale,
}: {
  corrections: Correction[];
  locale: Locale;
}) {
  const dict = getDictionary(locale);
  if (corrections.length === 0) return null;

  return (
    <section
      aria-labelledby="corrections"
      className="rounded-[10px] border border-warning/30 bg-warning/8 p-5 md:p-6"
    >
      <h2 id="corrections" className="label-mono text-warning">
        {dict.footer.corrections}
      </h2>
      <ol className="mt-4 space-y-4">
        {corrections.map((correction) => (
          <li key={correction.at} className="border-t border-warning/20 pt-4 first:border-t-0 first:pt-0">
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <Chip tone="warning">
                {correction.kind === "correction"
                  ? dict.labels.correction
                  : dict.labels.update}
              </Chip>
              <time dateTime={correction.at} className="label-mono-sm text-ink-muted">
                {formatDate(correction.at, locale)}
              </time>
            </div>
            <p className="mt-2.5 text-sm leading-relaxed text-ink">
              {correction.note[locale]}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Model disclosure                                                           */
/* -------------------------------------------------------------------------- */

export function ModelDisclosureBlock({
  disclosure,
  locale,
}: {
  disclosure: ModelDisclosure;
  locale: Locale;
}) {
  const dict = getDictionary(locale);

  return (
    <section aria-labelledby="model-disclosure" className="sheet-dark p-5 text-white md:p-6">
      <h2 id="model-disclosure" className="label-mono flex items-center gap-2 text-ember">
        <span aria-hidden="true" className="block h-[2px] w-4 bg-ember" />
        {dict.dataDesk.modelTitle}
      </h2>

      <dl className="mt-4">
        <DataRow label={dict.dataDesk.modelVersion} tone="paper">
          <span className="font-mono text-xs">{disclosure.version}</span>
        </DataRow>
        <DataRow label={dict.dataDesk.modelInputs} tone="paper">
          <span className="font-mono text-[0.6875rem] leading-relaxed text-paper-muted">
            {disclosure.inputs.length}
          </span>
        </DataRow>
      </dl>

      <ul className="mt-3 space-y-1">
        {disclosure.inputs.map((input) => (
          <li key={input} className="break-all font-mono text-[0.6875rem] text-muted">
            {input}
          </li>
        ))}
      </ul>

      <div className="mt-5 border-t border-rule-dark pt-4">
        <h3 className="label-mono-sm text-paper-muted">
          {dict.dataDesk.modelUncertainty}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-paper">
          {disclosure.uncertainty[locale]}
        </p>
      </div>

      <p className="mt-4 border-t border-rule-dark pt-4 text-xs leading-relaxed text-muted">
        {dict.dataDesk.responsiblePlay}
      </p>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Methodology disclosure                                                     */
/* -------------------------------------------------------------------------- */

export function MethodologyNote({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);

  return (
    <aside className="rounded-[10px] border border-rule bg-white p-5">
      <Kicker>{dict.labels.methodology}</Kicker>
      <p className="mt-3 text-sm leading-relaxed text-ink-muted">
        {dict.labels.methodologyBody}
      </p>
      <Link
        href={routes.howItWorks(locale)}
        className="label-mono mt-3 inline-flex items-center gap-2 text-ink hover:text-ember"
      >
        {dict.actions.howChecked}
        <span aria-hidden="true" className="text-ember">
          →
        </span>
      </Link>
    </aside>
  );
}
