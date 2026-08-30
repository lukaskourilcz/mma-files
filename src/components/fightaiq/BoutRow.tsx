import type { PredictionCopy } from "@/lib/prediction-copy";
import type { Organization } from "@/lib/types";

export interface BoutModelLine {
  redWin: number;
  blueWin: number;
  version: string;
  capturedAt: string;
  /** Delivered uncertainty class. Rendered as words, never dropped. */
  uncertainty?: string;
}

export interface BoutOddsLine {
  value: string;
  capturedAt: string;
  /** Who priced it. Attribution is mandatory; there is never a bookmaker link. */
  source?: string;
}

export interface PredictionBout {
  id: string;
  redName: string;
  blueName: string;
  /** Delivered records. Absent when the dataset has none — never a 0-0-0. */
  redRecord?: string;
  blueRecord?: string;
  division: string;
  rounds?: number;
  model?: BoutModelLine;
  odds?: BoutOddsLine;
}

function captured(stamp: string): string {
  return new Intl.DateTimeFormat("cs-CZ", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(stamp));
}

/**
 * A model line is rendered only when it is complete and internally consistent:
 * two probabilities inside [0,1] that sum to one, a version, and a capture
 * time. Anything short of that is not a weaker prediction, it is not a
 * prediction.
 */
export function usableModel(model: BoutModelLine | undefined): model is BoutModelLine {
  return Boolean(
    model &&
      model.version.trim() &&
      model.capturedAt.trim() &&
      Number.isFinite(model.redWin) &&
      Number.isFinite(model.blueWin) &&
      model.redWin >= 0 &&
      model.redWin <= 1 &&
      model.blueWin >= 0 &&
      model.blueWin <= 1 &&
      Math.abs(model.redWin + model.blueWin - 1) < 0.000001,
  );
}

export function hasUsableModel(bouts: readonly PredictionBout[]): boolean {
  return bouts.some((bout) => usableModel(bout.model));
}

function fromPattern(pattern: string, key: string, value: string): string {
  return pattern.replace(`{${key}}`, value);
}

/** One corner of the matchup: name over record, mirrored across the axis. */
function Corner({
  name,
  record,
  percentage,
  leading,
  align,
}: {
  name: string;
  record?: string;
  percentage?: number;
  leading: boolean;
  align: "start" | "end";
}) {
  return (
    <div className={`min-w-0 ${align === "end" ? "text-right" : ""}`}>
      <p className="display text-[length:var(--text-d6)] leading-tight text-text-inverse">
        {name}
      </p>
      {record ? (
        <p className="label-mono mt-1.5 text-text-inverse-meta">{record}</p>
      ) : null}
      {percentage === undefined ? null : (
        <p
          className={`mt-2 font-mono text-[length:var(--text-d5)] leading-none tabular-nums ${
            leading ? "text-accent-on-dark" : "text-text-inverse-muted"
          }`}
        >
          {percentage} %
        </p>
      )}
    </div>
  );
}

/**
 * The matchup: two corners mirrored around the probability bar.
 *
 * Every provenance field the delivery carries stays on the row — model
 * version, capture time and the uncertainty class — because a probability
 * without them is a number pretending to be a forecast. Odds keep their
 * source attribution and never become a link.
 */
export function BoutRow({ bout, copy }: { bout: PredictionBout; copy: PredictionCopy }) {
  const model = usableModel(bout.model) ? bout.model : undefined;
  const redPercent = model ? Math.round(model.redWin * 100) : undefined;
  const bluePercent = model ? 100 - Math.round(model.redWin * 100) : undefined;
  const redLeads = model ? model.redWin >= model.blueWin : false;
  const uncertainty = model?.uncertainty
    ? copy.uncertainty[model.uncertainty] ?? model.uncertainty.replaceAll("-", " ")
    : undefined;

  return (
    <li className="border-b border-rule-dark py-6 last:border-b-0">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="label-mono text-text-inverse-muted">{bout.division}</span>
        {bout.rounds ? (
          <>
            <span aria-hidden="true" className="h-3 w-px bg-rule-dark" />
            <span className="label-mono tabular-nums text-text-inverse-meta">
              {fromPattern(copy.roundsPattern, "rounds", String(bout.rounds))}
            </span>
          </>
        ) : null}
      </div>

      <div className="mt-3 grid max-w-4xl grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-start gap-x-4 sm:gap-x-8">
        <Corner
          name={bout.redName}
          record={bout.redRecord}
          percentage={redPercent}
          leading={redLeads}
          align="start"
        />
        <span className="label-mono self-center text-text-inverse-meta">
          {copy.versus}
        </span>
        <Corner
          name={bout.blueName}
          record={bout.blueRecord}
          percentage={bluePercent}
          leading={!redLeads}
          align="end"
        />
      </div>

      {model ? (
        <>
          <div
            role="img"
            aria-label={`${bout.redName} ${redPercent} % — ${bout.blueName} ${bluePercent} %`}
            className="mt-4 flex h-1.5 w-full max-w-4xl overflow-hidden bg-rule-dark"
          >
            <span
              className={redLeads ? "bg-accent-on-dark" : "bg-text-inverse-meta"}
              style={{ width: `${redPercent}%` }}
            />
            <span
              className={redLeads ? "bg-text-inverse-meta" : "bg-accent-on-dark"}
              style={{ width: `${bluePercent}%` }}
            />
          </div>

          <p className="label-mono mt-3 leading-relaxed text-text-inverse-meta">
            {copy.earlyModel} · {copy.modelVersion} {model.version}
            {uncertainty ? ` · ${uncertainty}` : ""} ·{" "}
            {fromPattern(copy.capturedPattern, "stamp", captured(model.capturedAt))}
          </p>
          {bout.odds ? (
            <p className="label-mono mt-1.5 leading-relaxed text-text-inverse-meta">
              {bout.odds.source ?? copy.oddsSource} · {bout.odds.value} ·{" "}
              {fromPattern(copy.capturedPattern, "stamp", captured(bout.odds.capturedAt))}
            </p>
          ) : null}
        </>
      ) : null}
    </li>
  );
}

function organizationAccent(organization: Organization): string {
  return organization === "ufc"
    ? "var(--color-badge-ufc-on-dark)"
    : "var(--color-badge-oktagon-on-dark)";
}

/** Promotion chip, event name and date — the masthead of one board. */
export function PredictionBoardHeader({
  organization,
  label,
  eventName,
  eventStamp,
}: {
  organization: Organization;
  label: string;
  eventName?: string;
  eventStamp?: string;
}) {
  const accent = organizationAccent(organization);
  return (
    <header
      className="flex flex-col gap-2 border-b-[3px] pb-3 md:flex-row md:items-end md:justify-between md:gap-6"
      style={{ borderColor: accent }}
    >
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span
          className="label-mono px-2 py-1 font-semibold text-chrome"
          style={{ backgroundColor: accent }}
        >
          {label}
        </span>
        {eventName ? (
          <h3 className="display text-[length:var(--text-d5)] text-text-inverse">{eventName}</h3>
        ) : null}
      </div>
      {eventStamp ? (
        <p className="label-mono tabular-nums text-text-inverse-meta">{eventStamp}</p>
      ) : null}
    </header>
  );
}

/**
 * A board of matchups.
 *
 * The bouts are sourced facts and stand on their own, so they render whether
 * or not a model has run. When none has, the board says so once in its own
 * masthead — the old table repeated "Model zatím neběžel" down every row and
 * turned one absence into eleven.
 */
export function PredictionBoard({
  organization,
  eventName,
  eventStamp,
  bouts,
  copy,
}: {
  organization: Organization;
  eventName: string;
  eventStamp: string;
  bouts: PredictionBout[];
  copy: PredictionCopy;
}) {
  return (
    <section className="bg-chrome text-text-inverse">
      <PredictionBoardHeader
        organization={organization}
        label={copy.organizations[organization]}
        eventName={eventName}
        eventStamp={eventStamp}
      />
      {hasUsableModel(bouts) ? null : (
        <p className="mt-4 max-w-[68ch] text-[length:var(--text-sm)] leading-relaxed text-text-inverse-muted">
          {copy.boardNoModel}
        </p>
      )}
      <ul className="mt-2">
        {bouts.map((bout) => (
          <BoutRow key={bout.id} bout={bout} copy={copy} />
        ))}
      </ul>
    </section>
  );
}
