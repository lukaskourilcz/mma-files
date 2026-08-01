import type { Fighter } from "@/lib/types";

/**
 * DEMO DATA — every fighter below is fictional.
 *
 * No record, date, gym, nickname or biographical detail here describes a real
 * person. The set exists so the layout, the evidence-state UI and both language
 * desks can be reviewed before a sourced feed is connected. Each entry carries
 * `isDemo: true`, which badges it in the UI and keeps it out of search indexes.
 *
 * `fieldStates` deliberately covers all four evidence states, including fields
 * that are simply absent — those render as a visible gap, never as a zero.
 */
export const fighters: Fighter[] = [
  {
    id: "fighter:ufc/reece-alderton",
    slug: "reece-alderton",
    organization: "ufc",
    name: "Reece Alderton",
    nickname: "The Ledger",
    division: "lightweight",
    country: "GB",
    team: "Northgate MMA",
    record: { wins: 14, losses: 3, draws: 0 },
    stance: "orthodox",
    heightCm: 178,
    reachCm: 188,
    dateOfBirth: "1996-03-14",
    localizations: {
      en: {
        summary:
          "A lightweight who wins on volume and position rather than on one shot. Alderton has fought out of Northgate MMA since turning professional and headlines for the first time on 8 August.",
        styleNote:
          "Long, high-rate jab into low kicks; takes the back when an opponent turns. Eleven of his fourteen wins have gone past the second round.",
      },
      cs: {
        summary:
          "Lehká váha, která vyhrává objemem práce a pozicí, ne jednou ranou. Alderton se od začátku profesionální kariéry připravuje v Northgate MMA a 8. srpna jde poprvé do hlavního zápasu.",
        styleNote:
          "Dlouhý a hodně používaný direkt, na něj kopy na nohy; když se soupeř otočí, bere mu záda. Jedenáct ze čtrnácti výher má po druhém kole.",
      },
    },
    fieldStates: {
      record: "verified",
      stance: "verified",
      heightCm: "verified",
      reachCm: "verified",
      dateOfBirth: "verified",
      team: "provisional",
      division: "verified",
    },
    sources: [
      {
        kind: "internal",
        ref: "fightaiq:fighter/ufc/reece-alderton@11",
        classification: "primary",
        retrievedAt: "2026-07-30T06:12:00Z",
        supports: ["Record", "Height", "Reach", "Stance", "Date of birth"],
      },
      {
        kind: "external",
        title: "Bout agreement listing for the 8 August card",
        publisher: "Promotion media release (demo)",
        classification: "primary",
        retrievedAt: "2026-07-29T14:40:00Z",
        supports: ["Weight class", "Booking"],
      },
    ],
    isDemo: true,
  },

  {
    id: "fighter:ufc/nadia-ferreiro",
    slug: "nadia-ferreiro",
    organization: "ufc",
    name: "Nadia Ferreiro",
    division: "womens-flyweight",
    country: "PT",
    team: "Clube Atlântico Faro",
    record: { wins: 9, losses: 2, draws: 0 },
    stance: "southpaw",
    heightCm: 168,
    // reachCm is deliberately absent: no agreeing source exists for it.
    dateOfBirth: "1997-11-02",
    localizations: {
      en: {
        summary:
          "Portugal's first flyweight on the roster. Ferreiro came up through kickboxing and has finished four of her nine wins inside a round.",
        styleNote:
          "Left straight down the middle, then a step-off to the open side. Her takedown defence is the field on this card that the evidence layer has the least on.",
      },
      cs: {
        summary:
          "První Portugalka v muší váze na soupisce. Ferreiro vyrostla v kickboxu a čtyři z devíti výher ukončila do konce prvního kola.",
        styleNote:
          "Levý direkt středem a hned úkrok na otevřenou stranu. Obrana proti porazům je u ní pole, ke kterému má důkazní vrstva nejmíň podkladů.",
      },
    },
    fieldStates: {
      record: "verified",
      stance: "verified",
      heightCm: "verified",
      reachCm: "unavailable",
      dateOfBirth: "verified",
      team: "verified",
      division: "verified",
    },
    sources: [
      {
        kind: "internal",
        ref: "fightaiq:fighter/ufc/nadia-ferreiro@6",
        classification: "primary",
        retrievedAt: "2026-07-30T06:12:00Z",
        supports: ["Record", "Height", "Stance", "Date of birth"],
      },
    ],
    isDemo: true,
  },

  {
    id: "fighter:oktagon/stepan-hruska",
    slug: "stepan-hruska",
    organization: "oktagon",
    name: "Štěpán Hruška",
    nickname: "Kovář",
    division: "welterweight",
    country: "CZ",
    team: "Vysočany Fight Lab",
    record: { wins: 12, losses: 2, draws: 0 },
    stance: "orthodox",
    heightCm: 183,
    reachCm: 191,
    dateOfBirth: "1994-06-21",
    localizations: {
      en: {
        summary:
          "The welterweight who knocked out Milan Ostrý in Ostrava on 25 July and was given a title shot four days later. Hruška has trained at Vysočany Fight Lab for his whole professional career.",
        styleNote:
          "Pressure and a right hand over the top. He has stopped six opponents; five of those came after he had already lost the opening round on at least one card.",
      },
      cs: {
        summary:
          "Velterová váha, která 25. července v Ostravě knockoutovala Milana Ostrého a o čtyři dny později dostala titulovou šanci. Hruška trénuje celou profesionální kariéru ve Vysočany Fight Labu.",
        styleNote:
          "Tlak dopředu a pravá ruka přes obranu. Ukončil šest soupeřů; pět z toho po kole, které mu aspoň jeden sudí zapsal jako prohrané.",
      },
    },
    fieldStates: {
      record: "verified",
      stance: "verified",
      heightCm: "verified",
      reachCm: "verified",
      dateOfBirth: "verified",
      team: "verified",
      division: "verified",
    },
    sources: [
      {
        kind: "internal",
        ref: "fightaiq:fighter/oktagon/stepan-hruska@14",
        classification: "primary",
        retrievedAt: "2026-07-31T05:50:00Z",
        supports: ["Record", "Height", "Reach", "Stance", "Date of birth", "Team"],
      },
      {
        kind: "external",
        title: "Oktagon 90 official result sheet",
        publisher: "Promotion media release (demo)",
        classification: "primary",
        retrievedAt: "2026-07-26T08:05:00Z",
        supports: ["Knockout result", "Round and time"],
      },
    ],
    isDemo: true,
  },

  {
    id: "fighter:oktagon/adam-bezak",
    slug: "adam-bezak",
    organization: "oktagon",
    name: "Adam Bezák",
    division: "lightweight",
    country: "SK",
    team: "Dunaj Combat",
    record: { wins: 8, losses: 1, draws: 0 },
    stance: "orthodox",
    heightCm: 175,
    reachCm: 180,
    dateOfBirth: "1999-01-30",
    localizations: {
      en: {
        summary:
          "A 27-year-old Slovak lightweight who has won his last four. Two source registries disagree about whether an early regional bout counts toward his professional record, so the number on this page is marked disputed rather than picked.",
        styleNote:
          "Chain wrestling from the fence, then ground-and-pound rather than a submission hunt. He has never been stopped.",
      },
      cs: {
        summary:
          "Sedmadvacetiletý slovenský lehkotonážník, který vyhrál poslední čtyři zápasy. Dva registry se neshodnou, jestli se jeden raný regionální zápas počítá do profesionální bilance, takže číslo na téhle stránce je označené jako sporné, ne vybrané.",
        styleNote:
          "Opakované poražení u klece a potom práce v zemi, ne hon za submisí. Sám ukončený nikdy nebyl.",
      },
    },
    fieldStates: {
      record: "disputed",
      stance: "provisional",
      heightCm: "verified",
      reachCm: "provisional",
      dateOfBirth: "verified",
      team: "verified",
      division: "verified",
    },
    sources: [
      {
        kind: "internal",
        ref: "fightaiq:fighter/oktagon/adam-bezak@9",
        classification: "primary",
        retrievedAt: "2026-07-31T05:50:00Z",
        supports: ["Height", "Date of birth", "Team"],
      },
      {
        kind: "internal",
        ref: "fightaiq:disagreement/oktagon/adam-bezak/record@2",
        classification: "secondary",
        retrievedAt: "2026-07-31T05:51:00Z",
        supports: ["Recorded conflict on professional record"],
      },
    ],
    isDemo: true,
  },

  {
    id: "fighter:ksw/kacper-wisniewski",
    slug: "kacper-wisniewski",
    organization: "ksw",
    name: "Kacper Wiśniewski",
    nickname: "Igła",
    division: "light-heavyweight",
    country: "PL",
    team: "Wisła Combat Club",
    record: { wins: 12, losses: 4, draws: 1 },
    stance: "southpaw",
    heightCm: 190,
    reachCm: 198,
    dateOfBirth: "1993-09-08",
    localizations: {
      en: {
        summary:
          "Took a unanimous decision over Aleksy Nowotny in the KSW 107 co-main event and headlines KSW 108 on 5 September. His listed height comes from a single source and is marked provisional.",
        styleNote:
          "Southpaw at range, front kick to the body, and a guard he is content to fight off his back from. Only one of his last six has ended early.",
      },
      cs: {
        summary:
          "V hlavním předzápase KSW 107 porazil Aleksyho Nowotného jednomyslně na body a 5. září jde do hlavního zápasu KSW 108. Uváděná výška vychází z jediného zdroje, proto je označená jako předběžná.",
        styleNote:
          "Southpaw na distanc, přední kop na tělo a garda, ze které se mu na zádech pracuje dobře. Z posledních šesti zápasů skončil předčasně jen jeden.",
      },
    },
    fieldStates: {
      record: "verified",
      stance: "verified",
      heightCm: "provisional",
      reachCm: "verified",
      dateOfBirth: "verified",
      team: "verified",
      division: "verified",
    },
    sources: [
      {
        kind: "internal",
        ref: "fightaiq:fighter/ksw/kacper-wisniewski@12",
        classification: "primary",
        retrievedAt: "2026-07-30T06:12:00Z",
        supports: ["Record", "Reach", "Stance", "Date of birth"],
      },
      {
        kind: "external",
        title: "KSW 107 official result sheet",
        publisher: "Promotion media release (demo)",
        classification: "primary",
        retrievedAt: "2026-07-19T07:20:00Z",
        supports: ["Co-main event result"],
      },
    ],
    isDemo: true,
  },

  {
    id: "fighter:ksw/borys-lempicki",
    slug: "borys-lempicki",
    organization: "ksw",
    name: "Borys Łempicki",
    division: "heavyweight",
    country: "PL",
    team: "Gdańsk Iron House",
    record: { wins: 11, losses: 5, draws: 0, noContests: 1 },
    stance: "orthodox",
    heightCm: 196,
    reachCm: 203,
    // dateOfBirth is deliberately absent: sources disagree by two years, and no
    // primary document has been obtained, so no age is published.
    localizations: {
      en: {
        summary:
          "Stopped Otto Brandt in the third round of the KSW 107 main event in Gdańsk on 18 July. No date of birth is published for him here — two registries differ by two years and neither is primary.",
        styleNote:
          "A slow first round and a much better third. All but one of his eleven wins have come in the second round or later.",
      },
      cs: {
        summary:
          "V hlavním zápase KSW 107 v Gdaňsku 18. července ukončil ve třetím kole Otto Brandta. Datum narození u něj neuvádíme — dva registry se liší o dva roky a ani jeden není primární.",
        styleNote:
          "Pomalé první kolo a výrazně lepší třetí. Deset z jedenácti výher má z druhého kola nebo později.",
      },
    },
    fieldStates: {
      record: "verified",
      stance: "verified",
      heightCm: "verified",
      reachCm: "verified",
      dateOfBirth: "unavailable",
      team: "verified",
      division: "verified",
    },
    sources: [
      {
        kind: "internal",
        ref: "fightaiq:fighter/ksw/borys-lempicki@8",
        classification: "primary",
        retrievedAt: "2026-07-30T06:12:00Z",
        supports: ["Record", "Height", "Reach", "Stance"],
      },
      {
        kind: "external",
        title: "KSW 107 official result sheet",
        publisher: "Promotion media release (demo)",
        classification: "primary",
        retrievedAt: "2026-07-19T07:20:00Z",
        supports: ["Main event result", "Round and time"],
      },
    ],
    isDemo: true,
  },
];
