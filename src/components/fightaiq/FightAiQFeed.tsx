import Link from "next/link";
import type { FightAiQDelivery } from "@/lib/boardless";
import { getFighterById } from "@/lib/repository";
import { routes } from "@/lib/paths";
import type { Locale } from "@/lib/types";

const copy = {
  en: {
    eyebrow: "Delivered by FightAIQ",
    title: "Current fight forecasts",
    empty: "No eligible confirmed fight has a verified forecast yet. The page stays empty instead of showing a made-up prediction.",
    updated: "Snapshot updated",
    models: "Current predictions",
    model: "Model",
    warning: "These are time-stamped early model outputs, not a promise or personal betting advice. Raw prices and private FightAIQ research files are not published here.",
    early: "Early model",
    notAdvice: "Model output, not betting advice.",
  },
  cs: {
    eyebrow: "Data dodává FightAIQ",
    title: "Aktuální odhady zápasů",
    empty: "Žádný potvrzený zápas zatím nemá ověřený odhad. Stránka zůstává prázdná, místo aby ukazovala vymyšlenou predikci.",
    updated: "Data aktualizována",
    models: "Aktuální predikce",
    model: "Model",
    warning: "Jde o rané modelové výstupy s časem vytvoření, ne o slib ani osobní sázkové doporučení. Nezveřejňujeme zde surové kurzy ani interní výzkumné soubory FightAIQ.",
    early: "Raný model",
    notAdvice: "Výstup modelu, ne sázkové doporučení.",
  },
} as const;

function percent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
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
  const currentStats = snapshot.statsEntries.filter((entry) => entry.status === "active");
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

        <section className="mt-10" aria-labelledby="fightaiq-models">
          <h3 className="label-mono text-ink" id="fightaiq-models">{text.models} · {currentStats.length}</h3>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {currentStats.map((entry) => {
              const red = getFighterById(`fighter:${entry.fighterRefs[0].replace(":", "/")}`);
              const blue = getFighterById(`fighter:${entry.fighterRefs[1].replace(":", "/")}`);
              const name = (fighter: typeof red, fallback: string) => fighter
                ? <Link className="underline decoration-ember underline-offset-[3px]" href={routes.fighter(locale, fighter.organization, fighter.slug)}>{fighter.name}</Link>
                : fallback;
              return (
                <article className="border border-rule bg-paper p-4" key={entry.id}>
                  <div className="flex flex-wrap justify-between gap-3">
                    <h4 className="font-semibold text-ink">{name(red, entry.fighterRefs[0])} <span className="font-normal text-ink-meta">vs</span> {name(blue, entry.fighterRefs[1])}</h4>
                    <span className="label-mono-sm text-ink-meta">{entry.modelVersion}</span>
                  </div>
                  <dl className="mt-4 grid grid-cols-3 gap-3 text-sm">
                    <div><dt className="text-ink-meta">{locale === "cs" ? "Červený roh" : "Red corner"}</dt><dd className="mt-1 font-mono text-ink">{percent(entry.redWin)}</dd></div>
                    <div><dt className="text-ink-meta">{locale === "cs" ? "Modrý roh" : "Blue corner"}</dt><dd className="mt-1 font-mono text-ink">{percent(entry.blueWin)}</dd></div>
                    <div><dt className="text-ink-meta">{text.model}</dt><dd className="mt-1 font-mono text-ink">{entry.uncertainty.replaceAll("-", " ")}</dd></div>
                  </dl>
                  <p className="mt-3 text-xs text-ink-muted"><span className="font-semibold text-ink">{text.early}</span> · {text.notAdvice}</p>
                </article>
              );
            })}
            {currentStats.length === 0 ? <p className="text-sm text-ink-muted">{text.empty}</p> : null}
          </div>
        </section>
      </div>
    </section>
  );
}
