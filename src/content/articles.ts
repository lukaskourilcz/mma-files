import type { Article } from "@/lib/types";

/**
 * DEMO DATA — every story below is fictional and is badged as such in the UI.
 *
 * Two rules were applied while writing this set, and they should hold for any
 * replacement demo content:
 *
 *  1. No invented quotation is attributed to anybody. The `quote-led-preview`
 *     hero therefore renders an unattributed editorial line, never a fabricated
 *     one from a fighter or a promoter.
 *  2. Demo external sources carry a source *type* and no URL, because there is
 *     no real document behind them. They render with an explicit "no public
 *     link" state rather than a link to nowhere.
 *
 * Body text uses the restricted Markdown subset in `src/lib/markdown.tsx`,
 * including `[[fighter:slug|Label]]` and `[[event:slug|Label]]` for internal
 * links.
 */
export const articles: Article[] = [
  /* ---------------------------------------------------------------- FILE 024 */
  {
    id: "article:2026-08-01-alderton-rahal",
    slug: "alderton-vs-rahal-fight-week",
    status: "published",
    format: "fight-week-preview",
    fileNumber: 24,
    organization: "ufc",
    eventRef: "event:ufc/ufc-fight-night-alderton-rahal",
    fighterRefs: ["fighter:ufc/reece-alderton", "fighter:ufc/nadia-ferreiro"],
    publishAt: "2026-08-01T08:00:00+02:00",
    localizations: {
      en: {
        title: "Alderton gets five rounds for the first time, against Rahal",
        dek: "The lightweight headlines in Las Vegas on 8 August. Four bouts are confirmed; a fifth has been referred to but never named.",
        body: `Reece Alderton headlines for the first time on 8 August, meeting Idris Rahal over five rounds at the Silverline Pavilion in Las Vegas.

It is the first booking of his career scheduled past three rounds. [[fighter:reece-alderton|Alderton]] is 14-3, and eleven of those wins have reached the third round. None of his seventeen professional fights has gone beyond it. Against Rahal that record cuts both ways: he has spent more time in deep water than most lightweights at his level, and he has never had to stay in it for twenty-five minutes.

## What the card actually holds

Four bouts are on file for 8 August. [[fighter:nadia-ferreiro|Nadia Ferreiro]] takes the co-main event against Wren Delacroix at women's flyweight — her third appearance on the roster and her first above the preliminary card.

The promotion referred to a fifth bout in its 29 July listing without naming either fighter. Until a name is attached, it is not part of this card as far as this file is concerned.

## The reach question

Ferreiro's reach is the one number the evidence layer will not settle. Two registries carry different figures, neither traced to a measurement taken by the promotion, so her file shows the field as unavailable instead of choosing between them. It is a small gap. It is also the kind that quietly becomes a fact once somebody fills it in.

## What is settled

The main event is five rounds at lightweight. The co-main is three at women's flyweight. Both were confirmed in the same 29 July listing, and neither the venue nor the date has moved since the card was announced.

What is not settled: the fifth bout, the order of the preliminary card, and whether Rahal makes the walk as a lightweight at all. He has fought twice at welterweight in the last eighteen months, and the weight on the bout agreement is the only evidence either way.

[[event:ufc-fight-night-alderton-rahal|The full card file]] carries the confirmed bouts, the source behind each one, and the fields still open.`,
      },
      cs: {
        title: "Alderton jde poprvé na pět kol. Soupeřem je Rahal",
        dek: "Lehká váha povede 8. srpna kartu v Las Vegas. Potvrzené jsou čtyři zápasy, o pátém organizace mluvila, ale nepojmenovala ho.",
        body: `Reece Alderton povede 8. srpna poprvé kartu. V Silverline Pavilion v Las Vegas ho čeká Idris Rahal na pět kol.

Je to první zápas jeho kariéry nasazený na víc než tři kola. [[fighter:reece-alderton|Alderton]] má bilanci 14-3 a jedenáct výher mu došlo do třetího kola. Ani jeden ze sedmnácti profesionálních zápasů nešel dál. Proti Rahalovi to hraje na obě strany: v hluboké vodě strávil víc času než většina lehkých vah na jeho úrovni a zároveň v ní nikdy nemusel zůstat pětadvacet minut.

## Co karta opravdu obsahuje

Na 8. srpna jsou v záznamu čtyři zápasy. Hlavní předzápas obstará [[fighter:nadia-ferreiro|Nadia Ferreiro]] proti Wren Delacroix v ženské muší váze. Je to její třetí zápas na soupisce a první mimo předzápasy.

Organizace ve výpisu z 29. července zmínila pátý zápas, ale nepojmenovala ani jednoho z bojovníků. Dokud u něj nebude jméno, do téhle karty nepatří.

## Otázka rozpětí paží

Rozpětí paží Ferreiro je jediné číslo, které důkazní vrstva neuzavře. Dva registry uvádějí různé hodnoty a ani jedna nevychází z měření provedeného organizací. Ve složce proto pole zůstává nedostupné, místo aby se mezi nimi vybíralo. Je to malá mezera. Zrovna z takové se ale potichu stává fakt, jakmile ji někdo doplní.

## Co je hotové

Hlavní zápas je na pět kol v lehké váze. Hlavní předzápas na tři kola v ženské muší. Obojí potvrdil stejný výpis z 29. července a místo ani datum se od oznámení karty nezměnily.

Hotové není tohle: pátý zápas, pořadí předzápasů a jestli Rahal vůbec půjde do klece jako lehká váha. Za posledních osmnáct měsíců nastoupil dvakrát ve velterové a jediným důkazem v jednu nebo druhou stranu je váha ve smlouvě.

[[event:ufc-fight-night-alderton-rahal|Složka celé karty]] obsahuje potvrzené zápasy, zdroj ke každému z nich a pole, která zůstávají otevřená.`,
      },
    },
    confirmed: {
      en: [
        "Five-round main event at lightweight on 8 August, Silverline Pavilion, Las Vegas",
        "Ferreiro vs. Delacroix confirmed as the co-main event at women's flyweight",
        "Four bouts listed in the promotion's release of 29 July",
      ],
      cs: [
        "Hlavní zápas na pět kol v lehké váze 8. srpna, Silverline Pavilion, Las Vegas",
        "Ferreiro vs. Delacroix potvrzené jako hlavní předzápas v ženské muší váze",
        "Čtyři zápasy ve výpisu organizace z 29. července",
      ],
    },
    unconfirmed: {
      en: [
        "A fifth bout referred to on 29 July, with neither fighter named",
        "The order of the preliminary card",
        "Nadia Ferreiro's reach — two registries disagree and neither is primary",
      ],
      cs: [
        "Pátý zápas zmíněný 29. července, ani jeden bojovník nepojmenovaný",
        "Pořadí předzápasů",
        "Rozpětí paží Nadii Ferreiro — dva registry se neshodnou a ani jeden není primární",
      ],
    },
    sources: [
      {
        kind: "external",
        title: "Card listing issued 29 July",
        publisher: "Promotion media release (demo)",
        classification: "primary",
        retrievedAt: "2026-07-29T14:40:00Z",
        supports: ["Main event booking", "Co-main booking", "Venue and date", "Reference to an unnamed fifth bout"],
      },
      {
        kind: "internal",
        ref: "fightaiq:event/ufc/ufc-fight-night-alderton-rahal@5",
        classification: "primary",
        retrievedAt: "2026-07-31T05:50:00Z",
        supports: ["Card order", "Scheduled rounds", "Weight classes"],
      },
      {
        kind: "internal",
        ref: "fightaiq:fighter/ufc/reece-alderton@11",
        classification: "primary",
        retrievedAt: "2026-07-30T06:12:00Z",
        supports: ["Record", "Rounds reached across seventeen professional fights"],
      },
      {
        kind: "internal",
        ref: "fightaiq:fighter/ufc/nadia-ferreiro@6",
        classification: "primary",
        retrievedAt: "2026-07-30T06:12:00Z",
        supports: ["Record", "Unavailable reach field"],
      },
    ],
    heroSpec: {
      template: "quote-led-preview",
      bindings: {
        leftName: "Reece Alderton",
        rightName: "Idris Rahal",
        eventName: "UFC Fight Night",
        rounds: 5,
      },
    },
    heroLine: {
      en: "Seventeen professional fights. Not one of them has gone past the third round.",
      cs: "Sedmnáct profesionálních zápasů. Ani jeden nešel za třetí kolo.",
    },
    heroAlt: {
      en: "Editorial card for the 8 August main event: Reece Alderton against Idris Rahal, five rounds. Seventeen professional fights, none past the third round.",
      cs: "Redakční karta k hlavnímu zápasu 8. srpna: Reece Alderton proti Idrisi Rahalovi na pět kol. Sedmnáct profesionálních zápasů, ani jeden za třetím kolem.",
    },
    packageHash: "9f21c0ad",
    relatedSlugs: ["nadia-ferreiro-file", "twenty-eight-tracked-fields"],
    isDemo: true,
  },

  /* ---------------------------------------------------------------- FILE 023 */
  {
    id: "article:2026-07-31-oktagon-91-title",
    slug: "hruska-gets-oktagon-91-title-shot",
    status: "published",
    format: "desk-notes",
    fileNumber: 23,
    organization: "oktagon",
    eventRef: "event:oktagon/oktagon-91",
    fighterRefs: ["fighter:oktagon/stepan-hruska", "fighter:oktagon/adam-bezak"],
    publishAt: "2026-07-31T18:00:00+02:00",
    localizations: {
      en: {
        title: "Hruška gets the Oktagon 91 title shot four days after Ostrava",
        dek: "Three bouts are confirmed for Prague on 22 August. The preliminary card does not exist yet, and this file says so.",
        body: `Štěpán Hruška fights Marek Zvolánek for the welterweight title at Oktagon 91 in Prague on 22 August, four days after he knocked out Milan Ostrý in Ostrava.

Four days is a short turnaround for a title booking, and it is worth being precise about what that means. The knockout was on 25 July. The announcement carrying both names and the championship status was issued on 29 July. [[fighter:stepan-hruska|Hruška]] had not fought at Oktagon 91's venue before, and the promotion has not said whether the bout was contingent on the Ostrava result.

## Three bouts, not a card

Oktagon 91 has three confirmed bouts. The main event is five rounds for the title. [[fighter:adam-bezak|Adam Bezák]] meets Ivan Halás at lightweight in the co-main. Petra Sládková and Nela Bergerová are on at women's strawweight.

That is the whole card as of this file. There is no preliminary card yet — not a thin one, not a provisional one. It has not been announced, so [[event:oktagon-91|the event file]] shows three bouts and a note.

## The one number that is not clean

Bezák's professional record is marked disputed on his file, and it will stay that way until somebody produces a primary document. Two registries disagree about whether a regional bout from early in his career counts. One says 8-1, the other 9-1.

The desk did not average them, did not pick the higher one, and did not quietly use the number that reads better in a sentence. His file shows the conflict, and this story does not use a record figure for him at all.

## What comes next

Nothing on this booking is due to change before fight week. If the preliminary card is announced, [[event:oktagon-91|the event file]] updates and this story gets an update note rather than a silent edit.`,
      },
      cs: {
        title: "Hruška má titulovou šanci na Oktagonu 91, čtyři dny po Ostravě",
        dek: "Na 22. srpna jsou v Praze potvrzené tři zápasy. Předzápasy zatím neexistují a tahle složka to říká nahlas.",
        body: `Štěpán Hruška se 22. srpna na Oktagonu 91 v Praze utká s Markem Zvolánkem o titul ve velterové váze. Čtyři dny předtím knockoutoval v Ostravě Milana Ostrého.

Čtyři dny jsou na titulové vyjednávání krátká doba a stojí za to říct přesně, co to znamená. Knockout padl 25. července. Oznámení, které obsahovalo obě jména i titulový status, přišlo 29. července. [[fighter:stepan-hruska|Hruška]] v hale, kde se Oktagon 91 pojede, ještě nenastoupil, a organizace neřekla, jestli byl zápas podmíněný výsledkem z Ostravy.

## Tři zápasy, ne karta

Oktagon 91 má tři potvrzené zápasy. Hlavní je na pět kol o titul. [[fighter:adam-bezak|Adam Bezák]] jde v hlavním předzápase proti Ivanu Halásovi v lehké váze. Petra Sládková a Nela Bergerová nastoupí v ženské slámové.

Tím karta k dnešnímu dni končí. Předzápasy zatím nejsou — ani tenké, ani předběžné. Nebyly oznámené, takže [[event:oktagon-91|složka turnaje]] ukazuje tři zápasy a poznámku.

## Jedno číslo, které čisté není

Bezákova profesionální bilance je ve složce označená jako sporná a zůstane tak, dokud někdo nepředloží primární dokument. Dva registry se neshodnou, jestli se počítá regionální zápas z počátku jeho kariéry. Jeden uvádí 8-1, druhý 9-1.

Redakce je neprůměrovala, nevybrala si vyšší číslo a potichu nepoužila to, které se do věty hodí líp. Ve složce je vidět rozpor a tenhle text u něj žádnou bilanci nepoužívá.

## Co bude dál

Do zápasového týdne se na téhle domluvě nemá nic měnit. Jestli organizace oznámí předzápasy, aktualizuje se [[event:oktagon-91|složka turnaje]] a tenhle text dostane poznámku o doplnění, ne tichou úpravu.`,
      },
    },
    confirmed: {
      en: [
        "Zvolánek vs. Hruška for the welterweight title, five rounds, 22 August, Vltava Arena, Prague",
        "Bezák vs. Halás confirmed as the co-main event",
        "Sládková vs. Bergerová confirmed at women's strawweight",
      ],
      cs: [
        "Zvolánek vs. Hruška o titul ve velterové váze, pět kol, 22. srpna, Vltava Arena, Praha",
        "Bezák vs. Halás potvrzení jako hlavní předzápas",
        "Sládková vs. Bergerová potvrzené v ženské slámové váze",
      ],
    },
    unconfirmed: {
      en: [
        "The entire preliminary card — nothing has been announced",
        "Whether the title booking was contingent on the Oktagon 90 result",
        "Adam Bezák's professional record, which two registries report differently",
      ],
      cs: [
        "Celé předzápasy — nic nebylo oznámeno",
        "Jestli byla titulová domluva podmíněná výsledkem z Oktagonu 90",
        "Profesionální bilance Adama Bezáka, kterou dva registry uvádějí různě",
      ],
    },
    sources: [
      {
        kind: "external",
        title: "Title bout announcement, 29 July",
        publisher: "Promotion media release (demo)",
        classification: "primary",
        retrievedAt: "2026-07-29T16:10:00Z",
        supports: ["Main event booking", "Championship status", "Date and venue"],
      },
      {
        kind: "internal",
        ref: "fightaiq:event/oktagon/oktagon-91@3",
        classification: "primary",
        retrievedAt: "2026-07-31T05:50:00Z",
        supports: ["Three confirmed bouts", "Absence of a preliminary card"],
      },
      {
        kind: "internal",
        ref: "fightaiq:disagreement/oktagon/adam-bezak/record@2",
        classification: "secondary",
        retrievedAt: "2026-07-31T05:51:00Z",
        supports: ["Recorded conflict between two registries on the professional record"],
      },
    ],
    heroSpec: {
      template: "data-card",
      bindings: {
        metric1: "bouts-confirmed",
        value1: 3,
        metric2: "title-fights",
        value2: 1,
        metric3: "days-turnaround",
        value3: 4,
        eventName: "Oktagon 91",
      },
    },
    heroAlt: {
      en: "Data card for Oktagon 91: three bouts confirmed, one title fight, four days between the Ostrava knockout and the booking.",
      cs: "Datová karta k Oktagonu 91: tři potvrzené zápasy, jeden titulový, čtyři dny mezi ostravským knockoutem a domluvou.",
    },
    packageHash: "3b8e47f1",
    relatedSlugs: ["stepan-hruska-file", "oktagon-90-weigh-in"],
    isDemo: true,
  },

  /* ---------------------------------------------------------------- FILE 022 */
  {
    id: "article:2026-07-24-oktagon-90-weigh-in",
    slug: "oktagon-90-weigh-in",
    status: "published",
    format: "weigh-in-report",
    fileNumber: 22,
    organization: "oktagon",
    eventRef: "event:oktagon/oktagon-90",
    fighterRefs: ["fighter:oktagon/stepan-hruska", "fighter:oktagon/adam-bezak"],
    publishAt: "2026-07-24T14:00:00+02:00",
    localizations: {
      en: {
        title: "All eight make weight for Oktagon 90",
        dek: "Nobody used the extra hour in Ostrava. The main event is on at welterweight as booked.",
        body: `All eight fighters on the Oktagon 90 card made weight in Ostrava on Friday morning, and no bout needed a catchweight agreement.

[[fighter:stepan-hruska|Štěpán Hruška]] and Milan Ostrý both cleared the welterweight limit at the first attempt for Saturday's five-round main event. So did [[fighter:adam-bezak|Adam Bezák]] and Radek Ptáček at lightweight in the co-main.

## The numbers on the sheet

Eight fighters were scheduled. Eight stepped on the scale within the official window. None returned for a second attempt, and none requested the additional hour the rules allow.

That is a clean sheet, and it is worth saying plainly because it is not the usual outcome. It is also the whole of what the weigh-in tells us. A fighter who makes weight comfortably and a fighter who scrapes it look identical on a result sheet, and this file does not have the rehydration figures that would separate them.

## What the sheet does not say

The promotion published confirmations, not the individual figures. So this report can say that everybody made the limit and cannot say by how much. Where a story would normally reach for a weight in kilograms, this one stops.

## Saturday

The card runs four bouts, with [[event:oktagon-90|the full order in the event file]]. The main event is five rounds; everything below it is three.`,
      },
      cs: {
        title: "Na Oktagonu 90 splnili limit všichni",
        dek: "Hodinu navíc v Ostravě nepotřeboval nikdo. Hlavní zápas jde ve velterové váze tak, jak byl domluvený.",
        body: `Všech osm bojovníků karty Oktagonu 90 splnilo v pátek dopoledne v Ostravě limit a žádný zápas nemusel přejít na smluvní váhu.

[[fighter:stepan-hruska|Štěpán Hruška]] i Milan Ostrý se do velterového limitu vešli hned napoprvé před sobotním hlavním zápasem na pět kol. Stejně tak [[fighter:adam-bezak|Adam Bezák]] a Radek Ptáček v lehké váze v hlavním předzápase.

## Co je na papíře

Osm bojovníků bylo nasazených. Osm se během oficiálního okna postavilo na váhu. Nikdo se nevracel na druhý pokus a nikdo si neřekl o hodinu navíc, kterou pravidla umožňují.

Je to čistý papír a stojí za to to říct nahlas, protože obvyklé to není. Zároveň je to všechno, co se z vážení dá vyčíst. Bojovník, který limit splnil s rezervou, a bojovník, který ho seškrábl, vypadají na výsledkovém listu stejně, a tahle složka nemá čísla o doplnění vody, která by je odlišila.

## Co na papíře není

Organizace zveřejnila potvrzení, ne jednotlivé hodnoty. Tenhle report proto může říct, že limit splnili všichni, a nemůže říct s jakou rezervou. Tam, kde by běžný text sáhl po čísle v kilogramech, tenhle končí.

## Sobota

Karta má čtyři zápasy a [[event:oktagon-90|celé pořadí je ve složce turnaje]]. Hlavní zápas je na pět kol, všechno pod ním na tři.`,
      },
    },
    confirmed: {
      en: [
        "Eight of eight fighters made weight inside the official window",
        "No catchweight agreement was needed on any bout",
        "The main event proceeds at welterweight over five rounds",
      ],
      cs: [
        "Osm z osmi bojovníků splnilo limit v oficiálním okně",
        "U žádného zápasu nebyla potřeba smluvní váha",
        "Hlavní zápas jde ve velterové váze na pět kol",
      ],
    },
    unconfirmed: {
      en: [
        "Individual weights — the promotion published confirmations only",
        "Rehydration figures, which are not collected for this promotion",
      ],
      cs: [
        "Jednotlivé hodnoty — organizace zveřejnila jen potvrzení",
        "Čísla o doplnění vody, která se u téhle organizace nesbírají",
      ],
    },
    sources: [
      {
        kind: "external",
        title: "Oktagon 90 weigh-in confirmation sheet",
        publisher: "Promotion media release (demo)",
        classification: "primary",
        retrievedAt: "2026-07-24T10:15:00Z",
        supports: ["All eight fighters made weight", "No catchweight agreements"],
      },
      {
        kind: "internal",
        ref: "fightaiq:event/oktagon/oktagon-90@9",
        classification: "primary",
        retrievedAt: "2026-07-26T08:05:00Z",
        supports: ["Card order", "Scheduled rounds", "Weight classes"],
      },
    ],
    heroSpec: {
      template: "data-card",
      bindings: {
        metric1: "fighters-weighed",
        value1: 8,
        metric2: "made-weight",
        value2: 8,
        metric3: "missed-weight",
        value3: 0,
        eventName: "Oktagon 90",
      },
    },
    heroAlt: {
      en: "Data card for the Oktagon 90 weigh-in: eight fighters weighed, eight made weight, none missed.",
      cs: "Datová karta k vážení na Oktagon 90: osm bojovníků na váze, osm splnilo limit, nikdo neselhal.",
    },
    packageHash: "c47a1e93",
    relatedSlugs: ["hruska-gets-oktagon-91-title-shot", "stepan-hruska-file"],
    isDemo: true,
  },

  /* ---------------------------------------------------------------- FILE 020 */
  {
    id: "article:2026-07-28-hruska-profile",
    slug: "stepan-hruska-file",
    status: "published",
    format: "fighter-profile",
    fileNumber: 20,
    organization: "oktagon",
    fighterRefs: ["fighter:oktagon/stepan-hruska"],
    eventRef: "event:oktagon/oktagon-90",
    publishAt: "2026-07-28T10:00:00+02:00",
    localizations: {
      en: {
        title: "The file on Štěpán Hruška",
        dek: "Twelve wins, six stoppages, and a consistent pattern in when they arrive.",
        body: `Štěpán Hruška has stopped six opponents in twelve wins. Five of those six stoppages came after he had already lost the opening round on at least one judge's card.

That is the single most useful thing in his file, and it is the reason the [[event:oktagon-91|Oktagon 91]] title booking is more interesting than a four-day turnaround usually is.

## The shape of it

[[fighter:stepan-hruska|Hruška]] is a pressure fighter with an orthodox stance, 183 centimetres and a 191-centimetre reach. He walks opponents down and throws a right hand over the top of a jab. Nothing about that is unusual.

What is unusual is the timing. He is behind in the first round more often than not, and he is a different fighter from the middle of the second onward. On 25 July in Ostrava he lost the opening five minutes to Milan Ostrý and finished the fight with a head kick at 4:31 of the second.

## What the record does not settle

Six stoppages in twelve wins is a rate, not a plan. The evidence layer holds his results, methods, rounds and times; it does not hold round-by-round strike counts for this promotion, so this file cannot say whether the second-round shift is a conditioning gap in his opponents or a deliberate opening pattern from him.

It is worth naming that gap rather than writing around it. A profile that explains the mechanism without the data to support it is guessing in a confident voice.

## Against Zvolánek

The title fight is five rounds. Hruška has been past the third round twice. Whether the pattern that has worked for him over three rounds survives being stretched to five is the question the booking asks, and there is nothing in his file that answers it yet.`,
      },
      cs: {
        title: "Složka: Štěpán Hruška",
        dek: "Dvanáct výher, šest ukončení a jasný vzorec v tom, kdy přicházejí.",
        body: `Štěpán Hruška ukončil ve dvanácti výhrách šest soupeřů. Pět z těch šesti ukončení přišlo poté, co mu aspoň jeden sudí zapsal první kolo jako prohrané.

Je to nejužitečnější údaj v jeho složce a taky důvod, proč je titulová domluva na [[event:oktagon-91|Oktagon 91]] zajímavější, než čtyřdenní vyjednávání obvykle bývá.

## Jak to vypadá

[[fighter:stepan-hruska|Hruška]] je tlakový bojovník v ortodoxním postoji, 183 centimetrů, rozpětí paží 191. Soupeře prochází dopředu a hází pravou přes direkt. Nic z toho není nezvyklé.

Nezvyklé je načasování. První kolo prohrává častěji, než ne, a od poloviny druhého je to jiný bojovník. 25. července v Ostravě prohrál úvodních pět minut s Milanem Ostrým a zápas ukončil kopem na hlavu ve 4:31 druhého kola.

## Co bilance neuzavře

Šest ukončení ve dvanácti výhrách je poměr, ne plán. Důkazní vrstva drží jeho výsledky, způsoby ukončení, kola i časy; nemá ale u téhle organizace počty úderů po kolech, takže složka neumí říct, jestli je zlom ve druhém kole díra v kondici soupeřů, nebo jeho záměrné otevírání.

Stojí za to tuhle mezeru pojmenovat, ne ji obejít. Profil, který vysvětluje mechanismus bez dat, jenom sebejistě hádá.

## Proti Zvolánkovi

Titulový zápas je na pět kol. Hruška byl za třetím kolem dvakrát. Jestli vzorec, který mu fungoval na tři kola, vydrží roztažený na pět, je právě ta otázka, kterou domluva klade. Ve složce na ni zatím odpověď není.`,
      },
    },
    confirmed: {
      en: [
        "12-2 professional record, six stoppages",
        "Knockout of Milan Ostrý by head kick, round 2, 4:31, Oktagon 90",
        "Booked against Marek Zvolánek for the welterweight title at Oktagon 91",
      ],
      cs: [
        "Profesionální bilance 12-2, šest ukončení",
        "Knockout Milana Ostrého kopem na hlavu, 2. kolo, 4:31, Oktagon 90",
        "Nasmlouvaný zápas proti Marku Zvolánkovi o titul velterové váhy na Oktagonu 91",
      ],
    },
    unconfirmed: {
      en: [
        "Round-by-round strike counts, which are not collected for this promotion",
        "Whether the second-round pattern reflects his opponents' conditioning or his own opening plan",
      ],
      cs: [
        "Počty úderů po kolech, které se u téhle organizace nesbírají",
        "Jestli je vzorec druhého kola daný kondicí soupeřů, nebo jeho vlastním otevíráním",
      ],
    },
    sources: [
      {
        kind: "internal",
        ref: "fightaiq:fighter/oktagon/stepan-hruska@14",
        classification: "primary",
        retrievedAt: "2026-07-31T05:50:00Z",
        supports: ["Record", "Stoppage count", "Height", "Reach", "Stance"],
      },
      {
        kind: "external",
        title: "Oktagon 90 official result sheet",
        publisher: "Promotion media release (demo)",
        classification: "primary",
        retrievedAt: "2026-07-26T08:05:00Z",
        supports: ["Knockout method", "Round and time"],
      },
      {
        kind: "external",
        title: "Title bout announcement, 29 July",
        publisher: "Promotion media release (demo)",
        classification: "primary",
        retrievedAt: "2026-07-29T16:10:00Z",
        supports: ["Oktagon 91 booking", "Championship status"],
      },
    ],
    heroSpec: {
      template: "tale-of-the-tape",
      bindings: {
        leftName: "Štěpán Hruška",
        leftRecord: "12-2-0",
        leftHeightCm: 183,
        leftReachCm: 191,
        leftStance: "orthodox",
        rightName: "Marek Zvolánek",
        rightRecord: "",
        divisionKey: "welterweight",
      },
    },
    heroAlt: {
      en: "Tale-of-the-tape card for Štěpán Hruška: 12-2-0, 183 centimetres, 191-centimetre reach, orthodox, welterweight.",
      cs: "Karta s parametry Štěpána Hrušky: 12-2-0, 183 centimetrů, rozpětí paží 191, ortodoxní postoj, velterová váha.",
    },
    packageHash: "a10f4b77",
    relatedSlugs: ["hruska-gets-oktagon-91-title-shot", "oktagon-90-weigh-in"],
    isDemo: true,
  },

  /* ---------------------------------------------------------------- FILE 019 */
  {
    id: "article:2026-07-22-coverage-audit",
    slug: "twenty-eight-tracked-fields",
    status: "published",
    format: "data-story",
    fileNumber: 19,
    fighterRefs: [],
    publishAt: "2026-07-22T10:00:00+02:00",
    localizations: {
      en: {
        title: "Twenty-eight tracked fields, five that are not settled",
        dek: "A pass over every fighter file on this site: what is verified, what rests on one source, what is in conflict, and what is simply absent.",
        body: `Four fighter files are published here. Each one tracks seven fields — record, stance, height, reach, date of birth, team and division — which makes twenty-eight field slots in total.

Twenty-three are verified. Three are provisional. One is disputed. One is not available at all.

## What each state means

A field is **verified** when two independent sources agree on it. It is **provisional** when only one source carries it: usable, flagged, not settled. It is **disputed** when sources conflict and no primary document has resolved them. It is **unavailable** when nothing sufficient exists, and in that case the field is left empty rather than filled.

The distinction matters most in the last two cases, because they are the ones a normal publishing workflow smooths over. A disputed record becomes whichever number the writer saw first. An unavailable reach becomes a number from a database that copied it from another database.

## The five

The three provisional fields are Reece Alderton's team, and Adam Bezák's stance and reach. Each rests on a single source.

The one disputed field is Bezák's professional record: two registries differ on whether an early regional bout counts, and neither has been resolved against a primary document.

The one unavailable field is Nadia Ferreiro's reach. Two registries carry different figures and neither is traced to a measurement taken by a promotion. Rather than publish one of them, her file publishes nothing, and every story that mentions her works without it.

## What this is not

These are counts of coverage, not a measure of anybody's ability, and nothing here is a forecast. The aggregate is deterministic: the same four files produce the same twenty-eight figures every time, and the version below identifies exactly which pass produced them.

Five unsettled fields out of twenty-eight is a small number in a small set. It is published because the alternative — showing twenty-eight clean fields and quietly rounding the awkward five — is how a file stops being a file.`,
      },
      cs: {
        title: "Osmadvacet sledovaných polí, pět z nich neuzavřených",
        dek: "Průchod všemi složkami bojovníků na tomhle webu: co je ověřené, co stojí na jediném zdroji, co je v rozporu a co prostě chybí.",
        body: `Publikované jsou tu čtyři složky bojovníků. Každá sleduje sedm polí — bilanci, postoj, výšku, rozpětí paží, datum narození, tým a váhu — což dohromady dělá osmadvacet míst.

Třiadvacet je ověřených. Tři jsou předběžná. Jedno je sporné. Jedno není dostupné vůbec.

## Co jednotlivé stavy znamenají

Pole je **ověřené**, když se na něm shodnou dva nezávislé zdroje. **Předběžné** je, když ho nese jediný zdroj: použitelné, označené, neuzavřené. **Sporné** je, když si zdroje odporují a rozpor nerozhodl žádný primární dokument. **Nedostupné** je, když nic dostatečného neexistuje — a v tom případě pole zůstane prázdné, nedoplní se.

Nejvíc záleží na posledních dvou případech, protože právě ty běžný publikační postup zahladí. Ze sporné bilance se stane číslo, které pisatel viděl jako první. Z nedostupného rozpětí paží se stane hodnota z databáze, která ji opsala z jiné databáze.

## Těch pět

Tři předběžná pole jsou tým Reece Aldertona a postoj a rozpětí paží Adama Bezáka. Každé stojí na jediném zdroji.

Jedno sporné pole je Bezákova profesionální bilance: dva registry se liší v tom, jestli se počítá raný regionální zápas, a rozpor nerozhodl žádný primární dokument.

Jedno nedostupné pole je rozpětí paží Nadii Ferreiro. Dva registry u ní uvádějí různé hodnoty a ani jedna nevychází z měření provedeného organizací. Místo aby složka vydala jednu z nich, nevydává nic, a každý text, který se o ní zmiňuje, se bez toho čísla obejde.

## Co tohle není

Jsou to počty pokrytí, ne měřítko něčích schopností, a nic z toho není předpověď. Souhrn je deterministický: stejné čtyři složky vydají pokaždé stejných osmadvacet čísel a verze níž přesně určuje, který průchod je vyrobil.

Pět neuzavřených polí z osmadvaceti je v malém vzorku malé číslo. Vydáváme ho proto, že ta druhá možnost — ukázat osmadvacet čistých polí a těch pět nepohodlných potichu zaokrouhlit — je přesně to, čím složka přestává být složkou.`,
      },
    },
    modelDisclosure: {
      version: "fightaiq-coverage@2026.07.3",
      inputs: [
        "fightaiq:fighter/ufc/reece-alderton@11",
        "fightaiq:fighter/ufc/nadia-ferreiro@6",
        "fightaiq:fighter/oktagon/stepan-hruska@14",
        "fightaiq:fighter/oktagon/adam-bezak@9",
      ],
      uncertainty: {
        en: "Descriptive counts over four files. The set is small enough that a single new file moves every proportion, so no rate here should be read as a general property of the sport or of any promotion.",
        cs: "Popisné počty přes čtyři složky. Vzorek je tak malý, že jedna nová složka pohne každým poměrem, takže žádný z těch podílů nečtěte jako obecnou vlastnost sportu ani organizace.",
      },
    },
    confirmed: {
      en: [
        "28 tracked field slots across four published fighter files",
        "23 verified, three provisional, one disputed, one unavailable",
        "Aggregate is deterministic and versioned",
      ],
      cs: [
        "28 sledovaných polí napříč čtyřmi publikovanými složkami bojovníků",
        "23 ověřených, tři předběžná, jedno sporné, jedno nedostupné",
        "Souhrn je deterministický a má verzi",
      ],
    },
    sources: [
      {
        kind: "internal",
        ref: "fightaiq:coverage/fighters@2026.07.3",
        classification: "primary",
        retrievedAt: "2026-07-22T05:00:00Z",
        supports: ["Field counts", "State distribution"],
      },
      {
        kind: "internal",
        ref: "fightaiq:disagreement/oktagon/adam-bezak/record@2",
        classification: "primary",
        retrievedAt: "2026-07-22T05:00:00Z",
        supports: ["The one disputed field"],
      },
      {
        kind: "internal",
        ref: "fightaiq:fighter/ufc/nadia-ferreiro@6",
        classification: "secondary",
        retrievedAt: "2026-07-22T05:00:00Z",
        supports: ["Unavailable reach field"],
      },
    ],
    modelVersion: "fightaiq-coverage@2026.07.3",
    heroSpec: {
      template: "data-card",
      bindings: {
        metric1: "fields-tracked",
        value1: 28,
        metric2: "fields-verified",
        value2: 23,
        metric3: "fields-open",
        value3: 5,
      },
    },
    heroAlt: {
      en: "Data card: 28 tracked fields, 23 verified, five not settled.",
      cs: "Datová karta: 28 sledovaných polí, 23 ověřených, pět neuzavřených.",
    },
    packageHash: "e6c9d204",
    relatedSlugs: ["nadia-ferreiro-file", "why-a-slot-gets-killed"],
    isDemo: true,
  },

  /* ---------------------------------------------------------------- FILE 018 */
  {
    id: "article:2026-07-15-ferreiro-profile",
    slug: "nadia-ferreiro-file",
    status: "published",
    format: "fighter-profile",
    fileNumber: 18,
    organization: "ufc",
    fighterRefs: ["fighter:ufc/nadia-ferreiro"],
    publishAt: "2026-07-15T10:00:00+02:00",
    localizations: {
      en: {
        title: "The file on Nadia Ferreiro",
        dek: "Nine wins, four of them inside a round, and one field the evidence layer will not fill.",
        body: `Nadia Ferreiro has finished four of her nine wins inside the first round. She fights on 8 August in the co-main event, her first bout above the preliminary card.

[[fighter:nadia-ferreiro|Ferreiro]] came to the sport from kickboxing and still fights like it at range: left straight down the middle from southpaw, then a step off to the open side rather than a follow-up combination. Four of her finishes have come inside five minutes; none of them came off a takedown.

## The part that is missing

Her reach is not published on this site. Two registries carry different figures for it, neither is traced to a measurement taken by a promotion, and the evidence layer will not choose between them.

Reach is not a decorative field for a striker who fights at range against opponents she is usually taller than. It is a number a preview would reach for. This one does not have it, and the gap is on the page rather than behind it.

## What is on the record

Nine wins, two losses. One hundred and sixty-eight centimetres. Southpaw. Born 2 November 1997, verified against two sources. Fighting out of Clube Atlântico Faro.

The four first-round finishes are the clearest pattern in the file. What the file cannot support is the sentence that usually follows — that she fades if a fight goes long. Two of her nine wins went to a decision, and two decisions is not enough to say anything about how she holds up.

## Against Delacroix

Three rounds at women's flyweight. [[event:ufc-fight-night-alderton-rahal|The card file]] has the confirmed bouts; the preliminary order is still open.`,
      },
      cs: {
        title: "Složka: Nadia Ferreiro",
        dek: "Devět výher, čtyři z nich do konce prvního kola, a jedno pole, které důkazní vrstva nedoplní.",
        body: `Nadia Ferreiro ukončila čtyři z devíti výher do konce prvního kola. 8. srpna nastupuje v hlavním předzápase, poprvé mimo předzápasovou část karty.

[[fighter:nadia-ferreiro|Ferreiro]] přišla do sportu z kickboxu a na distanc to je pořád vidět: levý direkt středem ze southpaw postoje a hned úkrok na otevřenou stranu místo navazující kombinace. Čtyři ukončení má do pěti minut a ani jedno nepřišlo po poražení.

## Co ve složce chybí

Rozpětí paží na tomhle webu nezveřejňujeme. Dva registry u ní uvádějí různé hodnoty, ani jedna nevychází z měření provedeného organizací, a důkazní vrstva mezi nimi nevybírá.

U bojovnice, která pracuje na distanc a bývá vyšší než soupeřky, není rozpětí paží ozdobné pole. Je to číslo, po kterém pozvánka na turnaj běžně sáhne. Tahle ho nemá a mezera je na stránce, ne za ní.

## Co v záznamu je

Devět výher, dvě prohry. Sto šedesát osm centimetrů. Southpaw. Narozena 2. listopadu 1997, ověřeno proti dvěma zdrojům. Připravuje se v Clube Atlântico Faro.

Čtyři ukončení v prvním kole jsou ve složce nejzřetelnější vzorec. Co složka podložit neumí, je věta, která obvykle následuje — že v delším zápase vyhasíná. Dvě z devíti výher došly na body a dvě rozhodnutí nestačí na to, aby se dalo cokoli říct o tom, jak vydrží.

## Proti Delacroix

Tři kola v ženské muší váze. [[event:ufc-fight-night-alderton-rahal|Složka karty]] obsahuje potvrzené zápasy; pořadí předzápasů je zatím otevřené.`,
      },
    },
    confirmed: {
      en: [
        "9-2 professional record, four first-round finishes",
        "Southpaw, 168 centimetres, born 2 November 1997",
        "Booked against Wren Delacroix in the 8 August co-main event",
      ],
      cs: [
        "Profesionální bilance 9-2, čtyři ukončení v prvním kole",
        "Southpaw, 168 centimetrů, narozena 2. listopadu 1997",
        "Nasmlouvaný zápas proti Wren Delacroix v hlavním předzápase 8. srpna",
      ],
    },
    unconfirmed: {
      en: [
        "Reach — two registries disagree and neither is primary",
        "How she performs in a long fight; only two of her wins have gone to a decision",
      ],
      cs: [
        "Rozpětí paží — dva registry se neshodnou a ani jeden není primární",
        "Jak si vede v dlouhém zápase; na body došly jen dvě její výhry",
      ],
    },
    sources: [
      {
        kind: "internal",
        ref: "fightaiq:fighter/ufc/nadia-ferreiro@6",
        classification: "primary",
        retrievedAt: "2026-07-30T06:12:00Z",
        supports: ["Record", "Finish distribution", "Height", "Stance", "Date of birth"],
      },
      {
        kind: "external",
        title: "Card listing issued 29 July",
        publisher: "Promotion media release (demo)",
        classification: "primary",
        retrievedAt: "2026-07-29T14:40:00Z",
        supports: ["Co-main event booking"],
      },
    ],
    heroSpec: {
      template: "tale-of-the-tape",
      bindings: {
        leftName: "Nadia Ferreiro",
        leftRecord: "9-2-0",
        leftHeightCm: 168,
        leftStance: "southpaw",
        rightName: "Wren Delacroix",
        rightRecord: "",
        divisionKey: "womens-flyweight",
      },
    },
    heroAlt: {
      en: "Tale-of-the-tape card for Nadia Ferreiro: 9-2-0, 168 centimetres, southpaw, women's flyweight. The reach field is marked not available.",
      cs: "Karta s parametry Nadii Ferreiro: 9-2-0, 168 centimetrů, southpaw, ženská muší váha. Pole s rozpětím paží je označené jako nedostupné.",
    },
    packageHash: "77bd1a5e",
    relatedSlugs: ["alderton-vs-rahal-fight-week", "twenty-eight-tracked-fields"],
    isDemo: true,
  },

  /* ---------------------------------------------------------------- FILE 017 */
  {
    id: "article:2026-07-11-killed-slot",
    slug: "why-a-slot-gets-killed",
    status: "published",
    format: "desk-notes",
    fileNumber: 17,
    fighterRefs: [],
    publishAt: "2026-07-11T18:00:00+02:00",
    localizations: {
      en: {
        title: "What happens when a story slot is killed",
        dek: "Two slots are planned each day. On 9 July both were dropped, and this note is the reason.",
        body: `Two story slots are planned for each Prague day, one produced in the morning and one in the evening. On 9 July both were killed before any of the writing started.

Neither had enough behind it, and that is the whole explanation. It is written down here because a magazine that only ever shows what it published is describing half of its own editorial judgement.

## What the two slots were

The morning slot was a fight-week piece on a card whose main event had been reported by one outlet and not confirmed by the promotion. One outlet is a lead, not a booking. Running it would have meant either attributing a booking to a source that had not made one, or writing four hundred words around the fact that we did not know.

The evening slot was a data story on stoppage timing across a set of files that turned out to hold eleven usable results. Eleven results will produce a chart. The chart would have been wrong in the specific way charts are wrong when the sample is too small to carry the sentence written underneath it.

## Why this gets published

The daily rhythm is a production constraint, not an editorial promise. Two slots a day is the ceiling, never the quota. A slot with nothing behind it is dropped and the reason is recorded, which is a cheaper failure than a story that reads fine and cannot be defended.

Roughly the same discipline decides what a file shows. When a field is not evidenced, it stays visibly empty — the same instinct, one layer down.

## What happened instead

Nothing was published on 9 July. The next file went out on the morning of the eleventh, and both killed slots stay in the record with their reasons attached.`,
      },
      cs: {
        title: "Co se stane, když se zabije slot",
        dek: "Na každý den jsou naplánované dva sloty. 9. července padly oba a tahle poznámka je důvod.",
        body: `Na každý pražský den jsou naplánované dva sloty, jeden se vyrábí ráno a jeden večer. 9. července padly oba dřív, než se začalo psát.

Ani jeden neměl dost za sebou a to je celé vysvětlení. Píšeme to sem proto, že magazín, který ukazuje jen to, co vydal, popisuje polovinu vlastního redakčního uvažování.

## O čem ty dva sloty měly být

Ranní slot měl být pozvánkou na turnaj, jehož hlavní zápas nahlásilo jedno médium a organizace ho nepotvrdila. Jedno médium je stopa, ne domluvený zápas. Vydat ho by znamenalo buď připsat domluvu zdroji, který ji neudělal, nebo napsat čtyři sta slov okolo toho, že to nevíme.

Večerní slot měl být datovým rozborem časů ukončení v sadě složek, ve které nakonec bylo jedenáct použitelných výsledků. Z jedenácti výsledků graf vznikne. A byl by špatně přesně tím způsobem, jakým jsou grafy špatně, když je vzorek moc malý na větu, která je pod nimi.

## Proč to vydáváme

Denní rytmus je výrobní omezení, ne redakční slib. Dva sloty denně jsou strop, ne kvóta. Slot, za kterým nic nestojí, padá a důvod se zapíše. Je to levnější selhání než text, který se dobře čte a nedá se obhájit.

Zhruba stejná úvaha rozhoduje o tom, co ukáže složka. Když pole není doložené, zůstane viditelně prázdné — stejný instinkt o patro níž.

## Co se stalo místo toho

9. července nevyšlo nic. Další složka šla ven jedenáctého ráno a oba zabité sloty zůstávají v záznamu i s důvody.`,
      },
    },
    confirmed: {
      en: [
        "Both 9 July slots were killed before production began",
        "Nothing was published on 9 July",
        "Kill reasons are recorded against each slot",
      ],
      cs: [
        "Oba sloty na 9. července padly ještě před výrobou",
        "9. července nevyšlo nic",
        "Důvody zabití jsou zapsané u obou slotů",
      ],
    },
    sources: [
      {
        kind: "internal",
        ref: "fightaiq:slate/2026-07-09@1",
        classification: "primary",
        retrievedAt: "2026-07-11T05:00:00Z",
        supports: ["Both slots killed", "Recorded kill reasons"],
      },
    ],
    heroSpec: {
      template: "quote-led-preview",
      bindings: {
        leftName: "Slot 1",
        rightName: "Slot 2",
        eventName: "09 July",
        rounds: 0,
      },
    },
    heroLine: {
      en: "Two slots planned. Two slots killed. Nothing published that day.",
      cs: "Dva sloty naplánované. Dva sloty zabité. Ten den nevyšlo nic.",
    },
    heroAlt: {
      en: "Editorial card: both story slots for 9 July marked killed, nothing published that day.",
      cs: "Redakční karta: oba sloty na 9. července označené jako zabité, ten den nevyšlo nic.",
    },
    packageHash: "1c53f8ba",
    relatedSlugs: ["twenty-eight-tracked-fields", "stepan-hruska-file"],
    isDemo: true,
  },
];
