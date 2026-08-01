import type { FightAiQDelivery } from "@/lib/boardless";
import type { Locale } from "@/lib/types";

const copy = {
  en: {
    eyebrow: "Delivered by FightAIQ",
    title: "Current odds and model files",
    empty: "No verified FightAIQ snapshot has been delivered yet. The page stays empty instead of showing made-up prices or forecasts.",
    updated: "Snapshot updated",
    odds: "Captured prices",
    models: "Model runs",
    comparisons: "Model and market comparisons",
    slips: "Experimental ten-fight files",
    bout: "Bout",
    capture: "Capture",
    prices: "Decimal prices",
    model: "Model",
    view: "Model view",
    market: "Market view",
    gap: "Difference",
    warning: "These are time-stamped research files, not a promise, a bookmaker feed or personal betting advice. Prices move. Check the source and your local rules before acting.",
  },
  cs: {
    eyebrow: "Data dodává FightAIQ",
    title: "Aktuální kurzy a modelové výstupy",
    empty: "FightAIQ zatím nedodal ověřený balíček. Stránka zůstává prázdná, místo aby ukazovala vymyšlené kurzy nebo odhady.",
    updated: "Data aktualizována",
    odds: "Zachycené kurzy",
    models: "Běhy modelu",
    comparisons: "Srovnání modelu s trhem",
    slips: "Experimentální složky deseti zápasů",
    bout: "Zápas",
    capture: "Záznam",
    prices: "Desetinné kurzy",
    model: "Model",
    view: "Pohled modelu",
    market: "Pohled trhu",
    gap: "Rozdíl",
    warning: "Jde o výzkumná data s časem pořízení, ne o slib, živý bookmaker feed ani osobní sázkové doporučení. Kurzy se mění. Před rozhodnutím ověřte zdroj i místní pravidla.",
  },
} as const;

function percent(value: number | null | undefined): string {
  return value === null || value === undefined ? "—" : `${(value * 100).toFixed(1)}%`;
}

function timestamp(value: string, locale: Locale): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat(locale === "cs" ? "cs-CZ" : "en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Prague",
  }).format(date);
}

export function FightAiQFeed({ snapshot, locale }: { snapshot: FightAiQDelivery; locale: Locale }) {
  const text = copy[locale];
  if (!snapshot.generatedAt) {
    return (
      <section className="border-b border-rule bg-card py-10 md:py-12" aria-labelledby="fightaiq-feed">
        <div className="mx-auto w-full max-w-[90rem] px-5 md:px-10">
          <p className="label-mono-sm text-ink-meta">{text.eyebrow}</p>
          <h2 className="display mt-2 text-3xl text-ink" id="fightaiq-feed">{text.title}</h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink-muted">{text.empty}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="border-b border-rule bg-card py-10 md:py-14" aria-labelledby="fightaiq-feed">
      <div className="mx-auto w-full max-w-[90rem] px-5 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="label-mono-sm text-ink-meta">{text.eyebrow}</p>
            <h2 className="display mt-2 text-3xl text-ink md:text-4xl" id="fightaiq-feed">{text.title}</h2>
          </div>
          <p className="label-mono-sm text-ink-meta">{text.updated}: {timestamp(snapshot.generatedAt, locale)}</p>
        </div>

        <p className="mt-6 max-w-4xl border-l-2 border-signal pl-4 text-sm leading-relaxed text-ink-muted">{text.warning}</p>

        <div className="mt-10 grid gap-8 xl:grid-cols-2">
          <section aria-labelledby="fightaiq-odds">
            <h3 className="label-mono text-ink" id="fightaiq-odds">{text.odds} · {snapshot.odds.length}</h3>
            {snapshot.odds.length ? (
              <div className="mt-4 overflow-x-auto border border-rule bg-paper">
                <table className="w-full min-w-[38rem] border-collapse text-left text-sm">
                  <thead className="border-b border-rule-strong bg-ink text-paper">
                    <tr>
                      <th className="px-4 py-3 font-mono text-xs uppercase tracking-[0.08em]">{text.bout}</th>
                      <th className="px-4 py-3 font-mono text-xs uppercase tracking-[0.08em]">{text.capture}</th>
                      <th className="px-4 py-3 font-mono text-xs uppercase tracking-[0.08em]">{text.prices}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {snapshot.odds.map((item) => (
                      <tr className="border-b border-rule last:border-0" key={`${item.boutRef}-${item.phase}-${item.source}`}>
                        <td className="px-4 py-3 font-medium text-ink">{item.boutRef}</td>
                        <td className="px-4 py-3 text-ink-muted">{item.phase.toUpperCase()} · {item.source}<br />{timestamp(item.capturedAt, locale)}</td>
                        <td className="px-4 py-3 font-mono text-xs text-ink">{item.prices.map((price) => `${price.pick}: ${price.decimal.toFixed(2)}`).join(" · ")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <p className="mt-4 text-sm text-ink-muted">{text.empty}</p>}
          </section>

          <section aria-labelledby="fightaiq-models">
            <h3 className="label-mono text-ink" id="fightaiq-models">{text.models} · {snapshot.modelRuns.length}</h3>
            <div className="mt-4 space-y-3">
              {snapshot.modelRuns.flatMap((run) => run.bouts.map((bout) => (
                <article className="border border-rule bg-paper p-4" key={`${run.modelVersion}-${bout.boutRef}`}>
                  <div className="flex flex-wrap justify-between gap-3">
                    <h4 className="font-semibold text-ink">{bout.boutRef}</h4>
                    <span className="label-mono-sm text-ink-meta">{run.modelVersion}</span>
                  </div>
                  <dl className="mt-4 grid grid-cols-3 gap-3 text-sm">
                    <div><dt className="text-ink-meta">{text.view}</dt><dd className="mt-1 font-mono text-ink">{percent(bout.probabilities.redWin)}</dd></div>
                    <div><dt className="text-ink-meta">{text.market}</dt><dd className="mt-1 font-mono text-ink">{percent(bout.probabilities.marketRedWin)}</dd></div>
                    <div><dt className="text-ink-meta">{text.model}</dt><dd className="mt-1 font-mono text-ink">{bout.probabilities.uncertainty.replaceAll("-", " ")}</dd></div>
                  </dl>
                </article>
              )))}
              {snapshot.modelRuns.length === 0 ? <p className="text-sm text-ink-muted">{text.empty}</p> : null}
            </div>
          </section>
        </div>

        {snapshot.edgeReports.length ? (
          <section className="mt-10" aria-labelledby="fightaiq-comparisons">
            <h3 className="label-mono text-ink" id="fightaiq-comparisons">{text.comparisons}</h3>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {snapshot.edgeReports.flatMap((report) => report.bouts.map((bout) => (
                <article className="sheet p-5" key={`${report.modelRunRef}-${bout.boutRef}`}>
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <h4 className="font-semibold text-ink">{bout.boutRef}</h4>
                    <span className="font-mono text-sm text-ink-muted">{text.gap}: {percent(bout.divergence)}</span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-ink-muted">{bout.recommendation}</p>
                </article>
              )))}
            </div>
          </section>
        ) : null}

        {snapshot.slips.length ? (
          <section className="mt-10 border border-danger/25 bg-danger/6 p-5" aria-labelledby="fightaiq-slips">
            <h3 className="label-mono text-danger" id="fightaiq-slips">{text.slips}</h3>
            {snapshot.slips.map((slip) => (
              <div className="mt-4" key={slip.generatedAt}>
                <p className="text-sm font-medium text-ink">{slip.expectedLossLine}</p>
                <p className="mt-2 text-sm text-ink-muted">{slip.stakeGuidance}</p>
              </div>
            ))}
          </section>
        ) : null}
      </div>
    </section>
  );
}
