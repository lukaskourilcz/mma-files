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
];
