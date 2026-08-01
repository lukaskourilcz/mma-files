import type { FightEvent } from "@/lib/types";

/**
 * DEMO DATA — every event, venue, bout and result below is fictional.
 *
 * Venues are invented so nothing here can be mistaken for a real announcement.
 * Cards are deliberately uneven: one is fully confirmed, one is still forming,
 * one has nothing but a main event booked. That last case is the point — an
 * unbuilt card renders as an unbuilt card rather than being padded out.
 *
 * Dates are anchored to the 2026-08-01 seed date. When these fall into the
 * past, replace the file rather than editing dates in place — see README,
 * "Replacing the demo data".
 */
export const events: FightEvent[] = [
  {
    id: "event:ufc/ufc-fight-night-alderton-rahal",
    slug: "ufc-fight-night-alderton-rahal",
    organization: "ufc",
    name: "UFC Fight Night: Alderton vs. Rahal",
    startsAt: "2026-08-08T19:00:00-07:00",
    timeZone: "America/Los_Angeles",
    venue: "Silverline Pavilion",
    city: "Las Vegas",
    country: "US",
    status: "confirmed",
    bouts: [
      {
        id: "bout:ufc-fn-ar/1",
        division: "lightweight",
        red: { name: "Reece Alderton", fighterRef: "fighter:ufc/reece-alderton" },
        blue: { name: "Idris Rahal" },
        scheduledRounds: 5,
        billing: "main",
      },
      {
        id: "bout:ufc-fn-ar/2",
        division: "womens-flyweight",
        red: { name: "Nadia Ferreiro", fighterRef: "fighter:ufc/nadia-ferreiro" },
        blue: { name: "Wren Delacroix" },
        scheduledRounds: 3,
        billing: "co-main",
      },
      {
        id: "bout:ufc-fn-ar/3",
        division: "middleweight",
        red: { name: "Tobias Vance" },
        blue: { name: "Emeka Duru" },
        scheduledRounds: 3,
        billing: "main-card",
      },
      {
        id: "bout:ufc-fn-ar/4",
        division: "bantamweight",
        red: { name: "Sol Marchetti" },
        blue: { name: "Kai Renner" },
        scheduledRounds: 3,
        billing: "prelim",
      },
    ],
    localizations: {
      en: {
        summary:
          "Reece Alderton's first main event, opposite Idris Rahal over five rounds in Las Vegas. Nadia Ferreiro takes the co-main.",
        note: "Four bouts are on file. The promotion has referred to a fifth without naming it, so it is not listed here.",
      },
      cs: {
        summary:
          "První hlavní zápas Reece Aldertona, proti Idrisi Rahalovi na pět kol v Las Vegas. Hlavní předzápas obstará Nadia Ferreiro.",
        note: "V záznamu jsou čtyři zápasy. Organizace mluvila o pátém, ale nepojmenovala ho, takže tady uvedený není.",
      },
    },
    sources: [
      {
        kind: "internal",
        ref: "fightaiq:event/ufc/ufc-fight-night-alderton-rahal@5",
        classification: "primary",
        retrievedAt: "2026-07-31T05:50:00Z",
        supports: ["Card order", "Weight classes", "Scheduled rounds"],
      },
      {
        kind: "external",
        title: "Card listing issued 29 July",
        publisher: "Promotion media release (demo)",
        classification: "primary",
        retrievedAt: "2026-07-29T14:40:00Z",
        supports: ["Venue", "Date", "Main and co-main bookings"],
      },
    ],
    isDemo: true,
  },

  {
    id: "event:oktagon/oktagon-91",
    slug: "oktagon-91",
    organization: "oktagon",
    name: "Oktagon 91",
    startsAt: "2026-08-22T19:00:00+02:00",
    timeZone: "Europe/Prague",
    venue: "Vltava Arena",
    city: "Praha",
    country: "CZ",
    status: "card-forming",
    bouts: [
      {
        id: "bout:oktagon-91/1",
        division: "welterweight",
        red: { name: "Štěpán Hruška", fighterRef: "fighter:oktagon/stepan-hruska" },
        blue: { name: "Marek Zvolánek" },
        scheduledRounds: 5,
        titleFight: true,
        billing: "main",
      },
      {
        id: "bout:oktagon-91/2",
        division: "lightweight",
        red: { name: "Adam Bezák", fighterRef: "fighter:oktagon/adam-bezak" },
        blue: { name: "Ivan Halás" },
        scheduledRounds: 3,
        billing: "co-main",
      },
      {
        id: "bout:oktagon-91/3",
        division: "womens-strawweight",
        red: { name: "Petra Sládková" },
        blue: { name: "Nela Bergerová" },
        scheduledRounds: 3,
        billing: "main-card",
      },
    ],
    localizations: {
      en: {
        summary:
          "A welterweight title fight in Prague: champion Marek Zvolánek against Štěpán Hruška, four weeks after Hruška's knockout in Ostrava.",
        note: "Three bouts are confirmed. The preliminary card has not been announced.",
      },
      cs: {
        summary:
          "Titulový zápas velterové váhy v Praze: šampion Marek Zvolánek proti Štěpánu Hruškovi, čtyři týdny po Hruškově knockoutu v Ostravě.",
        note: "Potvrzené jsou tři zápasy. Předzápasy organizace zatím neoznámila.",
      },
    },
    sources: [
      {
        kind: "internal",
        ref: "fightaiq:event/oktagon/oktagon-91@3",
        classification: "primary",
        retrievedAt: "2026-07-31T05:50:00Z",
        supports: ["Confirmed bouts", "Title status", "Venue"],
      },
      {
        kind: "external",
        title: "Title bout announcement, 29 July",
        publisher: "Promotion media release (demo)",
        classification: "primary",
        retrievedAt: "2026-07-29T16:10:00Z",
        supports: ["Main event booking", "Championship status"],
      },
    ],
    isDemo: true,
  },

  {
    id: "event:ksw/ksw-108",
    slug: "ksw-108",
    organization: "ksw",
    name: "KSW 108",
    startsAt: "2026-09-05T20:00:00+02:00",
    timeZone: "Europe/Warsaw",
    venue: "Hala Powiśle",
    city: "Warszawa",
    country: "PL",
    status: "announced",
    bouts: [
      {
        id: "bout:ksw-108/1",
        division: "light-heavyweight",
        red: { name: "Kacper Wiśniewski", fighterRef: "fighter:ksw/kacper-wisniewski" },
        blue: { name: "Dawid Sroka" },
        scheduledRounds: 5,
        billing: "main",
      },
    ],
    localizations: {
      en: {
        summary:
          "Kacper Wiśniewski against Dawid Sroka at light heavyweight, seven weeks after Wiśniewski's decision win in Gdańsk.",
        note: "Only the main event is booked. Nothing else on this card has been announced, so nothing else is listed.",
      },
      cs: {
        summary:
          "Kacper Wiśniewski proti Dawidu Srokovi v polotěžké váze, sedm týdnů po Wiśniewského výhře na body v Gdaňsku.",
        note: "Nasmlouvaný je jen hlavní zápas. Nic dalšího organizace neoznámila, takže tu nic dalšího není.",
      },
    },
    sources: [
      {
        kind: "internal",
        ref: "fightaiq:event/ksw/ksw-108@2",
        classification: "primary",
        retrievedAt: "2026-07-31T05:50:00Z",
        supports: ["Main event booking", "Date", "Venue"],
      },
    ],
    isDemo: true,
  },

  {
    id: "event:oktagon/oktagon-90",
    slug: "oktagon-90",
    organization: "oktagon",
    name: "Oktagon 90",
    startsAt: "2026-07-25T19:00:00+02:00",
    timeZone: "Europe/Prague",
    venue: "Hala Bělský les",
    city: "Ostrava",
    country: "CZ",
    status: "completed",
    bouts: [
      {
        id: "bout:oktagon-90/1",
        division: "welterweight",
        red: { name: "Štěpán Hruška", fighterRef: "fighter:oktagon/stepan-hruska" },
        blue: { name: "Milan Ostrý" },
        scheduledRounds: 5,
        billing: "main",
        result: {
          winnerRef: "fighter:oktagon/stepan-hruska",
          method: "ko",
          finish: "head-kick",
          round: 2,
          time: "4:31",
        },
      },
      {
        id: "bout:oktagon-90/2",
        division: "lightweight",
        red: { name: "Adam Bezák", fighterRef: "fighter:oktagon/adam-bezak" },
        blue: { name: "Radek Ptáček" },
        scheduledRounds: 3,
        billing: "co-main",
        result: {
          winnerRef: "fighter:oktagon/adam-bezak",
          method: "decision-split",
        },
      },
      {
        id: "bout:oktagon-90/3",
        division: "womens-strawweight",
        red: { name: "Nela Bergerová" },
        blue: { name: "Klára Vondrová" },
        scheduledRounds: 3,
        billing: "main-card",
        result: { method: "decision-unanimous" },
      },
      {
        id: "bout:oktagon-90/4",
        division: "featherweight",
        red: { name: "Vít Marounek" },
        blue: { name: "Jonáš Kadlec" },
        scheduledRounds: 3,
        billing: "prelim",
        result: { method: "no-contest", finish: "accidental-foul", round: 1, time: "2:47" },
      },
    ],
    localizations: {
      en: {
        summary:
          "Štěpán Hruška knocked out Milan Ostrý with a head kick in the second round in Ostrava. The preliminary featherweight bout was ruled a no contest after an accidental foul.",
      },
      cs: {
        summary:
          "Štěpán Hruška v Ostravě knockoutoval Milana Ostrého kopem na hlavu ve druhém kole. Předzápas pérové váhy skončil bez výsledku po nechtěném faulu.",
      },
    },
    sources: [
      {
        kind: "internal",
        ref: "fightaiq:event/oktagon/oktagon-90@9",
        classification: "primary",
        retrievedAt: "2026-07-26T08:05:00Z",
        supports: ["Results", "Methods", "Rounds and times"],
      },
      {
        kind: "external",
        title: "Oktagon 90 official result sheet",
        publisher: "Promotion media release (demo)",
        classification: "primary",
        retrievedAt: "2026-07-26T08:05:00Z",
        supports: ["Main event result", "No contest ruling"],
      },
    ],
    isDemo: true,
  },

  {
    id: "event:ksw/ksw-107",
    slug: "ksw-107",
    organization: "ksw",
    name: "KSW 107",
    startsAt: "2026-07-18T20:00:00+02:00",
    timeZone: "Europe/Warsaw",
    venue: "Hala Motława",
    city: "Gdańsk",
    country: "PL",
    status: "completed",
    bouts: [
      {
        id: "bout:ksw-107/1",
        division: "heavyweight",
        red: { name: "Borys Łempicki", fighterRef: "fighter:ksw/borys-lempicki" },
        blue: { name: "Otto Brandt" },
        scheduledRounds: 5,
        billing: "main",
        result: {
          winnerRef: "fighter:ksw/borys-lempicki",
          method: "tko",
          finish: "punches",
          round: 3,
          time: "2:14",
        },
      },
      {
        id: "bout:ksw-107/2",
        division: "light-heavyweight",
        red: { name: "Kacper Wiśniewski", fighterRef: "fighter:ksw/kacper-wisniewski" },
        blue: { name: "Aleksy Nowotny" },
        scheduledRounds: 3,
        billing: "co-main",
        result: {
          winnerRef: "fighter:ksw/kacper-wisniewski",
          method: "decision-unanimous",
        },
      },
      {
        id: "bout:ksw-107/3",
        division: "welterweight",
        red: { name: "Roman Piotrowski" },
        blue: { name: "Lars Ferber" },
        scheduledRounds: 3,
        billing: "main-card",
        result: { method: "draw" },
      },
      {
        id: "bout:ksw-107/4",
        division: "womens-strawweight",
        red: { name: "Zofia Kruk" },
        blue: { name: "Iga Malec" },
        scheduledRounds: 3,
        billing: "prelim",
        result: {
          method: "submission",
          finish: "rear-naked-choke",
          round: 1,
          time: "3:58",
        },
      },
    ],
    localizations: {
      en: {
        summary:
          "Borys Łempicki stopped Otto Brandt in the third round in Gdańsk. Kacper Wiśniewski took a unanimous decision in the co-main event.",
      },
      cs: {
        summary:
          "Borys Łempicki ukončil v Gdaňsku Otto Brandta ve třetím kole. Kacper Wiśniewski vyhrál hlavní předzápas jednomyslně na body.",
      },
    },
    sources: [
      {
        kind: "internal",
        ref: "fightaiq:event/ksw/ksw-107@11",
        classification: "primary",
        retrievedAt: "2026-07-19T07:20:00Z",
        supports: ["Results", "Methods", "Rounds and times"],
      },
      {
        kind: "external",
        title: "KSW 107 official result sheet",
        publisher: "Promotion media release (demo)",
        classification: "primary",
        retrievedAt: "2026-07-19T07:20:00Z",
        supports: ["Main event stoppage", "Co-main scorecards"],
      },
    ],
    isDemo: true,
  },
];
