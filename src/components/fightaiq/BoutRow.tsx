import type { PredictionCopy } from "@/lib/prediction-copy";
import type { Organization } from "@/lib/types";

export interface BoutModelLine {
  redWin: number;
  blueWin: number;
  version: string;
  capturedAt: string;
}

export interface BoutOddsLine {
  value: string;
  capturedAt: string;
}

export interface PredictionBout {
  id: string;
  redName: string;
  blueName: string;
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

function usableModel(model: BoutModelLine | undefined): model is BoutModelLine {
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

function ProbabilityLine({
  name,
  probability,
  higher,
}: {
  name: string;
  probability: number;
  higher: boolean;
}) {
  const percentage = Math.round(probability * 100);
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_96px_48px] items-center gap-3">
      <span className="truncate text-[12px] text-text-inverse-muted">{name}</span>
      <span aria-hidden="true" className="h-1 bg-rule-dark">
        <span
          className={`block h-full ${higher ? "bg-accent-on-dark" : "bg-text-inverse-meta"}`}
          style={{ width: `${percentage}%` }}
        />
      </span>
      <span className="text-right font-mono text-[length:var(--text-mono-lg)] tabular-nums text-text-inverse">
        {percentage} %
      </span>
    </div>
  );
}

function fromPattern(pattern: string, key: string, value: string): string {
  return pattern.replace(`{${key}}`, value);
}

export function BoutRow({ bout, copy }: { bout: PredictionBout; copy: PredictionCopy }) {
  const model = usableModel(bout.model) ? bout.model : undefined;
  return (
    <tr className="block border-b border-rule-dark py-5 last:border-b-0 md:table-row md:py-0">
      <td className="block pb-2 md:py-5 md:pr-5">
        <div className="flex flex-wrap items-baseline gap-2 text-[length:var(--text-d6)] font-bold text-text-inverse">
          <span>{bout.redName}</span>
          <span className="font-mono text-[12px] font-normal text-text-inverse-meta">vs</span>
          <span>{bout.blueName}</span>
        </div>
      </td>
      <td className="inline font-mono text-[13px] text-text-inverse-muted md:table-cell md:w-40 md:py-5 md:pr-5">
        {bout.division}
        <span className="mx-2 md:hidden">·</span>
      </td>
      <td className="inline font-mono text-[13px] tabular-nums text-text-inverse-muted md:table-cell md:w-16 md:py-5 md:pr-5">
        {bout.rounds ? fromPattern(copy.roundsPattern, "rounds", String(bout.rounds)) : "—"}
      </td>
      <td className="block pt-4 md:table-cell md:w-[280px] md:py-5">
        {model ? (
          <div className="space-y-2">
            <ProbabilityLine
              name={bout.redName}
              probability={model.redWin}
              higher={model.redWin >= model.blueWin}
            />
            <ProbabilityLine
              name={bout.blueName}
              probability={model.blueWin}
              higher={model.blueWin > model.redWin}
            />
            <p className="font-mono text-[11px] leading-relaxed text-text-inverse-meta">
              {copy.earlyModel} · {model.version} · {fromPattern(copy.capturedPattern, "stamp", captured(model.capturedAt))}
            </p>
            {bout.odds ? (
              <p className="font-mono text-[11px] leading-relaxed text-text-inverse-meta">
                {copy.oddsSource} · {bout.odds.value} · {fromPattern(copy.capturedPattern, "stamp", captured(bout.odds.capturedAt))}
              </p>
            ) : null}
          </div>
        ) : (
          <p className="font-mono text-[12px] text-text-inverse-meta">
            {copy.noModel}
          </p>
        )}
      </td>
    </tr>
  );
}

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
  const accent =
    organization === "ufc"
      ? "var(--color-badge-ufc-on-dark)"
      : "var(--color-badge-oktagon-on-dark)";
  return (
    <section className="bg-chrome text-text-inverse">
      <header
        className="flex flex-col gap-2 border-b-[3px] pb-3 md:flex-row md:items-end md:justify-between"
        style={{ borderColor: accent }}
      >
        <h2 className="display text-[length:var(--text-d5)]" style={{ color: accent }}>
          {copy.organizations[organization]}
        </h2>
        <p className="font-mono text-[12px] tabular-nums text-text-inverse-meta">
          {eventName} · {eventStamp}
        </p>
      </header>
      <table className="block w-full md:table md:table-fixed">
        <colgroup>
          <col />
          <col className="w-40" />
          <col className="w-16" />
          <col className="w-[280px]" />
        </colgroup>
        <thead className="hidden md:table-header-group">
          <tr className="border-b border-rule-dark text-left font-mono text-[11px] uppercase tracking-[0.16em] text-text-inverse-meta">
            <th className="py-3 pr-5 font-medium">{copy.tableHeadings.bout}</th>
            <th className="py-3 pr-5 font-medium">{copy.tableHeadings.division}</th>
            <th className="py-3 pr-5 font-medium">{copy.tableHeadings.rounds}</th>
            <th className="py-3 font-medium">{copy.tableHeadings.model}</th>
          </tr>
        </thead>
        <tbody className="block md:table-row-group">
          {bouts.map((bout) => (
            <BoutRow key={bout.id} bout={bout} copy={copy} />
          ))}
        </tbody>
      </table>
    </section>
  );
}
