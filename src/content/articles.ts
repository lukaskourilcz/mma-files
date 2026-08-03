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
      cs: [
        "Hlavní zápas na pět kol v lehké váze 8. srpna, Silverline Pavilion, Las Vegas",
        "Ferreiro vs. Delacroix potvrzené jako hlavní předzápas v ženské muší váze",
        "Čtyři zápasy ve výpisu organizace z 29. července",
      ],
    },
    unconfirmed: {
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
      cs: "Sedmnáct profesionálních zápasů. Ani jeden nešel za třetí kolo.",
    },
    heroAlt: {
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
      cs: [
        "Zvolánek vs. Hruška o titul ve velterové váze, pět kol, 22. srpna, Vltava Arena, Praha",
        "Bezák vs. Halás potvrzení jako hlavní předzápas",
        "Sládková vs. Bergerová potvrzené v ženské slámové váze",
      ],
    },
    unconfirmed: {
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
      cs: [
        "Osm z osmi bojovníků splnilo limit v oficiálním okně",
        "U žádného zápasu nebyla potřeba smluvní váha",
        "Hlavní zápas jde ve velterové váze na pět kol",
      ],
    },
    unconfirmed: {
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
      cs: [
        "Profesionální bilance 12-2, šest ukončení",
        "Knockout Milana Ostrého kopem na hlavu, 2. kolo, 4:31, Oktagon 90",
        "Nasmlouvaný zápas proti Marku Zvolánkovi o titul velterové váhy na Oktagonu 91",
      ],
    },
    unconfirmed: {
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
        cs: "Popisné počty přes čtyři složky. Vzorek je tak malý, že jedna nová složka pohne každým poměrem, takže žádný z těch podílů nečtěte jako obecnou vlastnost sportu ani organizace.",
      },
    },
    confirmed: {
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
      cs: [
        "Profesionální bilance 9-2, čtyři ukončení v prvním kole",
        "Southpaw, 168 centimetrů, narozena 2. listopadu 1997",
        "Nasmlouvaný zápas proti Wren Delacroix v hlavním předzápase 8. srpna",
      ],
    },
    unconfirmed: {
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
      cs: "Dva sloty naplánované. Dva sloty zabité. Ten den nevyšlo nic.",
    },
    heroAlt: {
      cs: "Redakční karta: oba sloty na 9. července označené jako zabité, ten den nevyšlo nic.",
    },
    packageHash: "1c53f8ba",
    relatedSlugs: ["twenty-eight-tracked-fields", "stepan-hruska-file"],
    isDemo: true,
  },
];
