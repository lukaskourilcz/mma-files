/**
 * English dictionary. This file is the structural source of truth: `cs.ts` is
 * typed against it, so a missing Czech key is a compile error.
 */
export const en = {
  meta: {
    localeName: "English",
    localeShort: "EN",
    switchLabel: "Česky",
    switchShort: "ČESKY",
    htmlLang: "en",
    dateLocale: "en-GB",
  },

  nav: {
    primary: "Sections",
    latest: "Latest",
    ufc: "UFC",
    oktagon: "Oktagon",
    fightWeek: "Fight Week",
    fighters: "Fighters",
    dataDesk: "Data Desk",
    results: "Results",
    events: "Events",
    skipToContent: "Skip to content",
    localeSwitch: "Switch language",
    home: "Home",
  },

  actions: {
    readTheFile: "Read the file",
    readMore: "Read the file",
    allStories: "All stories",
    exploreFighters: "Explore fighter files",
    howChecked: "See how stories are checked",
    viewEvent: "Open the event file",
    viewFighter: "Open the fighter file",
    viewResults: "See results",
    subscribe: "Subscribe",
    backHome: "Back to the front page",
  },

  labels: {
    file: "File",
    updated: "Updated",
    published: "Published",
    readingTime: "min read",
    sources: "Sources",
    theFile: "The file",
    relatedStories: "Related stories",
    byline: "By",
    demo: "Demo story",
    demoShort: "Demo",
    demoData: "Demo data",
    sourceChecked: "Source checked",
    correction: "Correction",
    method: "Method",
    update: "Update",
    titleFight: "Title fight",
    format: "Format",
    promotion: "Promotion",
    event: "Event",
    fighters: "Fighters",
    confirmed: "What is confirmed",
    unconfirmed: "What is not confirmed",
    noneUnconfirmed: "Nothing material is outstanding on this story.",
    primary: "Primary",
    secondary: "Secondary",
    internal: "Internal evidence",
    external: "External source",
    retrieved: "Retrieved",
    supports: "Cited for",
    noLink: "No public link — demo evidence file",
    methodology: "How this story was made",
    methodologyBody:
      "Sourced by the FightAIQ evidence layer, drafted and reviewed on the English and Czech desks, and released by a human editor.",
  },

  formats: {
    "fight-week-preview": "Fight-week preview",
    "post-event-recap": "Post-event recap",
    "fighter-profile": "Fighter profile",
    "data-story": "Data story",
    "weigh-in-report": "Weigh-in report",
    "desk-notes": "Desk notes",
  },

  organizations: {
    ufc: "UFC",
    oktagon: "Oktagon MMA",
  },

  organizationsShort: {
    ufc: "UFC",
    oktagon: "Oktagon",
  },

  divisions: {
    strawweight: "Strawweight",
    flyweight: "Flyweight",
    bantamweight: "Bantamweight",
    featherweight: "Featherweight",
    lightweight: "Lightweight",
    welterweight: "Welterweight",
    middleweight: "Middleweight",
    "light-heavyweight": "Light heavyweight",
    heavyweight: "Heavyweight",
    "womens-strawweight": "Women's strawweight",
    "womens-flyweight": "Women's flyweight",
    "womens-bantamweight": "Women's bantamweight",
    catchweight: "Catchweight",
  },

  methods: {
    ko: "Knockout",
    tko: "Technical knockout",
    submission: "Submission",
    "decision-unanimous": "Unanimous decision",
    "decision-split": "Split decision",
    "decision-majority": "Majority decision",
    draw: "Draw",
    "no-contest": "No contest",
  },

  methodsShort: {
    ko: "KO",
    tko: "TKO",
    submission: "SUB",
    "decision-unanimous": "UD",
    "decision-split": "SD",
    "decision-majority": "MD",
    draw: "DRAW",
    "no-contest": "NC",
  },

  /** Finish detail keys used by `BoutResult.finish`. */
  finishes: {
    "head-kick": "head kick",
    punches: "punches",
    "rear-naked-choke": "rear-naked choke",
    "accidental-foul": "accidental foul",
  },

  /**
   * Metric keys referenced by `data-card` hero bindings. Bindings carry only
   * locale-neutral values; the label always comes from here.
   */
  heroMetrics: {
    "bouts-confirmed": "Bouts confirmed",
    "title-fights": "Title fights",
    "days-turnaround": "Days from result to booking",
    "fighters-weighed": "Fighters weighed",
    "made-weight": "Made weight",
    "missed-weight": "Missed weight",
    "fields-tracked": "Tracked fields",
    "fields-verified": "Verified",
    "fields-open": "Not settled",
  },

  billing: {
    main: "Main event",
    "co-main": "Co-main event",
    "main-card": "Main card",
    prelim: "Preliminary card",
  },

  eventStatus: {
    announced: "Announced",
    "card-forming": "Card forming",
    confirmed: "Card confirmed",
    completed: "Completed",
  },

  fieldStates: {
    verified: "Verified",
    provisional: "Provisional",
    disputed: "Disputed",
    unavailable: "Not available",
  },

  fighterFields: {
    record: "Record",
    stance: "Stance",
    heightCm: "Height",
    reachCm: "Reach",
    dateOfBirth: "Age",
    team: "Team",
    division: "Division",
  },

  stances: {
    orthodox: "Orthodox",
    southpaw: "Southpaw",
    switch: "Switch",
  },

  countries: {
    GB: "United Kingdom",
    PT: "Portugal",
    CZ: "Czechia",
    SK: "Slovakia",
    PL: "Poland",
    US: "United States",
    DE: "Germany",
    BR: "Brazil",
    AE: "United Arab Emirates",
  },

  home: {
    leadKicker: "Lead file",
    latestTitle: "Latest files",
    latestDek: "Everything the desks have released, newest first.",
    fightWeekTitle: "Fight week",
    fightWeekDek: "What is booked next across UFC and Oktagon.",
    dataTitle: "The data behind the story",
    dataDek: "Every file starts in the evidence layer, not in a draft.",
    transparencyTitle: "Every story starts with a file",
    transparencyDek:
      "Four rules the desks apply before anything reaches this page.",
    noLead: "No story has been released yet. The next file appears here.",
    noStories: "No stories have been released yet.",
  },

  transparency: [
    {
      title: "Facts are sourced",
      body: "Every factual claim carries a reference. A slot with thin evidence is killed, not filled.",
    },
    {
      title: "Both languages are checked",
      body: "The Czech version is written as Czech, not translated from English, and both are reviewed before release.",
    },
    {
      title: "Missing information stays visible",
      body: "An unknown record, time or booking is shown as unknown. It is never replaced by a zero or a guess.",
    },
    {
      title: "Corrections remain visible",
      body: "When a story is amended, the change and its date stay on the page.",
    },
  ],

  latest: {
    title: "Latest",
    dek: "Every released file, newest first.",
    empty: "No stories have been released yet.",
  },

  organizationPage: {
    dek: "Reporting and evidence files from this promotion, newest first.",
    empty: "No stories from this promotion have been released yet.",
    upcoming: "Booked next",
    stories: "Stories",
  },

  fightWeek: {
    title: "Fight week",
    dek: "Booked cards across UFC and Oktagon, with what is settled and what is not.",
    upcoming: "Booked next",
    recent: "Most recent card",
    noUpcoming:
      "No card is currently booked in the demo data. The most recent completed event is shown instead.",
    empty: "No events are on file yet.",
    cardStatus: "Card status",
    countdownPast: "Completed",
  },

  results: {
    title: "Results",
    dek: "Completed cards, in fight order, with method and time where the record supports it.",
    empty: "No completed events are on file yet.",
    noResult: "Result not on file",
  },

  fighters: {
    title: "Fighters",
    dek: "Sourced fighter files. Fields that are not evidenced stay empty.",
    empty: "No fighter files have been published yet.",
    tape: "Tale of the tape",
    style: "How they win",
    coverage: "Evidence coverage",
    relatedStories: "Files mentioning this fighter",
    noRelated: "No released story references this fighter yet.",
    recordUnavailable: "Record not on file",
    upcomingBout: "Booked next",
  },

  events: {
    title: "Events",
    dek: "Event files for UFC and Oktagon.",
    empty: "No event files have been published yet.",
    card: "The card",
    coverage: "Files from this event",
    noCoverage: "No released story covers this event yet.",
    when: "When",
    where: "Where",
    localTime: "Local time",
    noBouts: "No bouts have been confirmed on this card yet.",
    boutsPending: "The rest of the card is not confirmed.",
    /** Rendered as `More on the card: 2` — the number trails the label so no
     *  locale has to inflect the noun to agree with it. */
    moreOnCard: "More on the card:",
  },

  dataDesk: {
    title: "Data Desk",
    dek: "What the evidence layer holds, and what it deliberately does not.",
    coverageTitle: "Current coverage",
    coverageDek:
      "Counts below are read from the files this site actually holds — not from a marketing figure.",
    fighterFiles: "Fighter files",
    eventFiles: "Event files",
    sourceRefs: "Source references",
    fieldsTracked: "Evidence-tracked fields",
    boundaryTitle: "What the Data Desk does not publish",
    boundaryLead:
      "FightAIQ is in data-only mode. This magazine therefore carries none of the following:",
    boundaries: [
      "No fight probabilities, model forecasts or projected outcomes.",
      "No odds, price comparisons or closing-line figures.",
      "No betting tips, picks, parlays or “best bets”.",
      "No bookmaker links, affiliate links or gambling promotion.",
    ],
    boundaryFooter:
      "If a future story does cite a deterministic aggregate, it carries the exact version, its inputs and a plain uncertainty statement on the page.",
    statesTitle: "How a field is marked",
    statesDek:
      "Fighter and event fields carry one of four states. Nothing is filled in to look complete.",
    stateHelp: {
      verified: "Two independent sources agree.",
      provisional: "One source only. Usable, flagged, not settled.",
      disputed: "Sources conflict. The conflict is recorded, not averaged away.",
      unavailable: "Not evidenced. Shown as a gap.",
    },
    modelTitle: "Model disclosure",
    modelVersion: "Version",
    modelInputs: "Inputs",
    modelUncertainty: "Uncertainty",
    responsiblePlay:
      "Descriptive figures only. Nothing on this page is a forecast, a price or a recommendation to stake money.",
  },

  howItWorks: {
    title: "How it works",
    dek: "From a sourced fact to a released file, in seven steps.",
    pipelineTitle: "The path a story takes",
    steps: [
      { title: "Verified fight data and sources", body: "Fighter records, cards and bookings enter the evidence layer with their references and retrieval times." },
      { title: "FightAIQ evidence files", body: "Facts are held per field with a review state. Conflicts are recorded rather than resolved silently." },
      { title: "MMA Files editorial meeting", body: "At most two story slots are planned per Prague day. A slot without evidence is killed." },
      { title: "English and Czech editorial desks", body: "The English draft is reported first. The Czech version is written as Czech, not translated." },
      { title: "Source, language and quality review", body: "Claims are matched back to references, and both languages are checked for clarity and originality." },
      { title: "Human-approved publication", body: "An editor releases the story. Nothing publishes automatically." },
      { title: "Reader feedback and measured social performance", body: "Social treatments are prepared, posted manually, and measured after 48 hours and seven days." },
    ],
    cadenceTitle: "Daily cadence",
    cadenceDek: "Prague time. A slot is never filled just to keep the rhythm.",
    cadence: [
      { time: "09:00", body: "Story meeting: both slots are assigned or killed." },
      { time: "10:00", body: "Morning story production." },
      { time: "18:00", body: "Evening story production." },
      { time: "20:00", body: "Desk review, social drafts, owner feedback, notes for tomorrow." },
    ],
    rolesTitle: "Inside the engine",
    rolesDek:
      "Named responsibilities inside the editorial engine. They are functions with approval gates, not personalities.",
    roles: [
      { name: "CANVAS", body: "Editor-in-chief. Assigns a story slot or kills it." },
      { name: "JAB", body: "English MMA reporting desk." },
      { name: "Czech desk", body: "Rewrites for a Czech reader as native Czech, never a literal translation." },
      { name: "QUILL", body: "Checks clarity, originality and whether each claim is actually supported." },
      { name: "REACH", body: "Prepares the bilingual social drafts." },
      { name: "SPLIT", body: "Measures social experiments, carefully and without over-reading small samples." },
      { name: "AUDIT", body: "Checks evidence, safety and release quality." },
      { name: "FightAIQ", body: "The source and data layer: fighter files, event cards, deterministic analysis." },
    ],
    humanTitle: "What stays with a person",
    humanBody:
      "Final permissions, publication, budgets, accounts and corrections are the owner's responsibility. There is no automatic publishing and no automatic social posting.",
    socialTitle: "Social treatments",
    socialBody: (treatments: number, stories: number) =>
      `${treatments} localised treatments prepared across ${stories} stories — two design variants per story, each in both languages. None has been posted. Publishing is manual and needs a separate authorisation step.`,
    killTitle: "When a slot is killed",
    killBody:
      "If the evidence is missing, thin, already reported or unreliable, the slot is dropped and the reason is recorded. Nothing is written to fill space.",
  },

  about: {
    title: "About MMA Files",
    dek: "A source-first newsroom for UFC and Oktagon, in English and Czech.",
    whatTitle: "What this is",
    whatBody: [
      "MMA Files reports on UFC and Oktagon. Fight-week previews, post-event recaps, weigh-in reports, fighter profiles, data stories and desk notes — each one published in English and Czech, each one traceable to the evidence it was built from.",
      "The magazine is built on an evidence-governed editorial engine and the FightAIQ evidence layer. Stories are drafted and reviewed inside that system; a person decides what is released.",
    ],
    coversTitle: "What it covers",
    coversList: [
      "UFC and Oktagon MMA",
      "Fight-week previews and post-event recaps",
      "Weigh-in reports and fighter profiles",
      "Data stories and desk notes",
      "The Czech and Central European scene alongside the global card",
    ],
    notTitle: "What it does not do",
    notList: [
      "No betting tips, odds, bookmaker links or affiliate gambling content",
      "No invented quotes, records, injuries, reactions or statistics",
      "No anonymous certainty and no unnamed observers",
      "No AI-generated fighter imagery presented as photography",
      "No promotion marks, event artwork or licensed photography used without permission",
    ],
    statusTitle: "Current status",
    statusBody:
      "This is a launch-ready site, not an established publication. Everything currently on it is clearly-labelled demo content and is excluded from search indexes. Real reporting appears here once the sourced feed and the approved publishing workflow are connected.",
    engineTitle: "The engine behind it",
    engineBody: (engine: string) =>
      `${engine} is an evidence-governed operating system run by a bounded council of software agents with human approval gates. It plans the story slots, holds the evidence, drafts and reviews both languages, and stops at the release gate. MMA Files is the reader-facing publication; ${engine} is the infrastructure underneath it.`,
    engineNote:
      "Publication, permissions, budgets and corrections stay with a person. Nothing on this site publishes itself.",
  },

  standards: {
    title: "Editorial standards",
    dek: "The rules the desks work to, stated plainly.",
    sections: [
      {
        title: "Sourcing",
        body: [
          "Every factual claim in a released story carries a reference. References are visible on the page, not held privately.",
          "A record, date of birth, reach, height, stance or division needs two independent, agreeing sources before it is used in analysis. A single source stays marked provisional.",
          "Where sources conflict, the conflict is recorded and shown. It is not averaged into a middle number.",
        ],
      },
      {
        title: "Two languages, one standard",
        body: [
          "No story is published in one language only.",
          "The Czech version is written for a Czech reader — natural word order, correct declension of names, and the vocabulary the sport actually uses in Czech. It is not a translation of the English sentence structure.",
          "Uncertainty is stated openly in both languages.",
        ],
      },
      {
        title: "Quotes and attribution",
        body: [
          "Quotes are short, attributed close to the words, and surrounded by reported context.",
          "No quote is invented, reconstructed, tidied up or attributed to an unnamed observer.",
        ],
      },
      {
        title: "Missing information",
        body: [
          "An unknown value is published as unknown. It is never shown as zero, estimated, or filled with plausible-sounding specificity.",
          "If a booking, result, time or method is not confirmed, the story says so.",
        ],
      },
      {
        title: "No betting content",
        body: [
          "No odds, probabilities, tips, picks or bookmaker links appear anywhere on this site.",
          "The evidence layer is in data-only mode. If a future story cites a deterministic aggregate, it carries the exact version, its inputs and a plain uncertainty statement.",
        ],
      },
      {
        title: "Images",
        body: [
          "Story visuals are typographic and generated from the story's own data. They are not photographs and are not presented as photographs.",
          "Promotion marks, event artwork and licensed photography are not used without permission.",
          "Every visual carries descriptive alt text.",
        ],
      },
    ],
  },

  corrections: {
    title: "Corrections",
    dek: "What we change, and how you can see it.",
    policyTitle: "Policy",
    policyBody: [
      "When a released story is wrong, it is corrected on the page and the correction stays visible with its date. Stories are not quietly rewritten.",
      "A substantive change is labelled a correction. A non-substantive addition — a confirmed booking, an added result — is labelled an update.",
      "If a story cannot be supported by its evidence after publication, it is withdrawn and the withdrawal is recorded rather than deleted.",
    ],
    logTitle: "Correction log",
    logDek: "Every amendment released so far, newest first.",
    logEmpty: "No corrections have been issued.",
    reportTitle: "Report an error",
    reportBody:
      "Send the story URL and the specific claim you believe is wrong. Include a source if you have one.",
  },

  privacy: {
    title: "Privacy",
    dek: "What this site collects, in short.",
    sections: [
      {
        title: "Analytics",
        body: [
          "This build ships without an analytics provider, advertising network or third-party tracker. No cookies are set for measurement.",
        ],
      },
      {
        title: "Newsletter",
        body: [
          "The newsletter form on this site is not connected to an email service. Nothing you type into it is transmitted or stored. It is present so the layout can be reviewed before a provider is chosen.",
        ],
      },
      {
        title: "Server logs",
        body: [
          "A host serving this site will keep standard request logs. Their retention is set by whichever host is used at launch, and this page will be updated with the specifics before real reporting is published.",
        ],
      },
      {
        title: "Contact",
        body: [
          "Correction requests and privacy questions can be sent to the address on the corrections page.",
        ],
      },
    ],
  },

  newsletter: {
    title: "The week's fights, without the noise.",
    dek: "One concise briefing for UFC and Oktagon.",
    placeholder: "you@example.com",
    localeQuestion: "Which language?",
    submit: "Subscribe",
    notWired:
      "Not connected. This form is a layout preview — no email service is wired up, and nothing you type is sent or stored.",
    pageTitle: "Newsletter",
    pageDek: "One briefing a week. English or Czech, your choice.",
    whatTitle: "What arrives",
    whatList: [
      "The cards booked for the coming week, with what is settled and what is not",
      "Every file released since the last briefing",
      "Corrections issued in the last seven days",
    ],
    whenTitle: "When",
    whenBody:
      "Once a week. No second send, no partner mail, no promotional inserts.",
  },

  footer: {
    about: "About MMA Files",
    howItWorks: "How it works",
    standards: "Editorial standards",
    corrections: "Corrections",
    privacy: "Privacy",
    sections: "Sections",
    theDesk: "The desk",
    follow: "Follow",
    instagram: "Instagram",
    threads: "Threads",
    socialPending: "Accounts not live yet",
    rss: "RSS",
    transparency:
      "MMA Files publishes in English and Czech. Every released story carries its sources, keeps unknowns visible, and shows corrections on the page. No betting content, no invented quotes, no automatic publishing.",
    poweredBy: (engine: string, descriptor: string) =>
      `MMA Files is powered by ${engine} — ${descriptor}.`,
    rights: "All rights reserved.",
  },

  demo: {
    bannerLabel: "Demo build",
    bannerBody:
      "Sample content. Fighters, events, results and quotes on this site are fictional and are excluded from search indexes.",
    articleBadge: "Demo story",
    articleNotice:
      "This is a demo story built from fictional data. It is not reporting, and it is excluded from search indexes.",
    dataBadge: "Demo data",
    dataNotice:
      "Fictional demo record. No real fighter, result or booking is described here.",
  },

  notFound: {
    title: "No file here",
    body: "That page does not exist, or it has not been released. The front page will have the latest.",
  },

  /**
   * Relative times come from `Intl.RelativeTimeFormat`, which already knows
   * Czech numeral agreement. Only labels that Intl does not cover live here.
   */
  time: {
    weighInDay: "Weigh-in day",
    fightNight: "Fight night",
  },
};

export type Dictionary = typeof en;
