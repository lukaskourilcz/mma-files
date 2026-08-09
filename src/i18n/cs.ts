/**
 * The Czech dictionary, and the only one. Written as Czech rather than translated: word order,
 * declension and the vocabulary the sport actually uses here.
 *
 * It used to be typed against an English dictionary that served no page, so the structure of the
 * one published locale was defined by a file nobody read and every key had to be written twice.
 * This file is the structure now; `Dictionary` is derived from it.
 */
export const cs = {
  meta: {
    localeName: "Čeština",
    localeShort: "CZ",
    htmlLang: "cs",
    dateLocale: "cs-CZ",
  },

  nav: {
    primary: "Rubriky",
    latest: "Nejnovější",
    ufc: "UFC",
    oktagon: "Oktagon",
    predictions: "Predikce",
    fightWeek: "Zápasový týden",
    results: "Výsledky",
    fighters: "Bojovníci",
    menu: "Menu",
    closeMenu: "Zavřít menu",
    dataDesk: "Datová redakce",
    numbers: "Čísla",
    events: "Turnaje",
    skipToContent: "Přejít na obsah",
    home: "Úvod",
  },

  actions: {
    readTheFile: "Otevřít složku",
    readMore: "Otevřít složku",
    allStories: "Všechny texty",
    allResults: "Všechny výsledky",
    allFighters: "Všichni bojovníci",
    openTheCard: "Otevřít kartu",
    fullCard: "Celá karta",
    exploreFighters: "Projít složky bojovníků",
    howChecked: "Jak texty kontrolujeme",
    viewEvent: "Otevřít složku turnaje",
    viewFighter: "Otevřít složku bojovníka",
    viewResults: "Zobrazit výsledky",
    openPredictions: "Otevřít Predikce",
    subscribe: "Odebírat",
    backHome: "Zpět na titulní stranu",
  },

  labels: {
    updated: "Aktualizováno",
    published: "Publikováno",
    readingTime: "min čtení",
    sources: "Zdroje",
    photoPending: "Fotografie zatím není",
    desk: "Redakce",
    photoSlots: {
      lead: "Hlavní fotka — 3:2",
      story: "Fotka k textu — 16:9",
      portrait: "Portrét — 4:5",
    },
    theFile: "Složka k textu",
    relatedStories: "Související texty",
    byline: "Autor",
    demo: "Ukázkový text",
    demoShort: "Ukázka",
    demoData: "Ukázková data",
    sourceChecked: "Zdroje ověřeny",
    correction: "Oprava",
    method: "Způsob",
    update: "Doplnění",
    titleFight: "Titulový zápas",
    format: "Formát",
    promotion: "Organizace",
    event: "Turnaj",
    fighters: "Bojovníci",
    primary: "Primární",
    secondary: "Sekundární",
    internal: "Interní důkaz",
    external: "Externí zdroj",
    retrieved: "Staženo",
    supports: "Doloženo pro",
    noLink: "Bez veřejného odkazu — ukázková důkazní složka",
    methodology: "Jak text vznikl",
    methodologyBody:
      "Text vychází z uvedených zdrojů. Redakce zkontrolovala fakta, sporné údaje nechala viditelné a před vydáním ověřila české znění.",
  },

  article: {
    byline: "Redakce MMA Files",
    sources: "Zdroje",
    related: "Související texty",
    moreFromSection: "Další z rubriky",
    correction: "Oprava",
    demoBadge: "Ukázkový obsah",
    photoCredit: (author: string, licence: string) =>
      `Foto: ${author} · ${licence}`,
  },

  formats: {
    "fight-week-preview": "Pozvánka na turnaj",
    "post-event-recap": "Report z turnaje",
    "fighter-profile": "Profil bojovníka",
    "data-story": "Datový rozbor",
    "weigh-in-report": "Report z vážení",
    "desk-notes": "Poznámky redakce",
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
    strawweight: "slámová váha",
    flyweight: "muší váha",
    bantamweight: "bantamová váha",
    featherweight: "pérová váha",
    lightweight: "lehká váha",
    welterweight: "velterová váha",
    middleweight: "střední váha",
    "light-heavyweight": "polotěžká váha",
    heavyweight: "těžká váha",
    "womens-strawweight": "ženská slámová váha",
    "womens-flyweight": "ženská muší váha",
    "womens-bantamweight": "ženská bantamová váha",
    catchweight: "smluvní váha",
  },

  methods: {
    ko: "Knockout",
    tko: "Technický knockout",
    submission: "Submise",
    "decision-unanimous": "Jednomyslné rozhodnutí",
    "decision-split": "Nejednotné rozhodnutí",
    "decision-majority": "Většinové rozhodnutí",
    draw: "Remíza",
    "no-contest": "Bez výsledku",
  },

  methodsShort: {
    ko: "KO",
    tko: "TKO",
    submission: "SUB",
    "decision-unanimous": "Jednomyslně",
    "decision-split": "Nejednotně",
    "decision-majority": "Většinově",
    draw: "Remíza",
    "no-contest": "Bez výsledku",
  },

  finishes: {
    "head-kick": "kop na hlavu",
    punches: "údery",
    "rear-naked-choke": "škrcení zezadu",
    "accidental-foul": "nechtěný faul",
  },

  heroMetrics: {
    "bouts-confirmed": "Potvrzených zápasů",
    "title-fights": "Titulových zápasů",
    "days-turnaround": "Dní od výsledku k domluvě",
    "fighters-weighed": "Bojovníků na váze",
    "made-weight": "Splnilo limit",
    "missed-weight": "Nesplnilo limit",
    "fields-tracked": "Sledovaných polí",
    "fields-verified": "Ověřených",
    "fields-open": "Neuzavřených",
  },

  billing: {
    main: "Hlavní zápas",
    "co-main": "Hlavní předzápas",
    "main-card": "Hlavní karta",
    prelim: "Předzápasy",
  },

  billingShort: {
    main: "Hlavní",
    "co-main": "Předzápas",
    "main-card": "Karta",
    prelim: "Prelim",
  },

  eventStatus: {
    announced: "Oznámeno",
    "card-forming": "Karta se skládá",
    confirmed: "Karta potvrzena",
    completed: "Proběhlo",
  },

  fighterFields: {
    record: "Bilance",
    stance: "Postoj",
    heightCm: "Výška",
    reachCm: "Rozpětí paží",
    dateOfBirth: "Věk",
    team: "Tým",
    division: "Váha",
  },

  stances: {
    orthodox: "Ortodoxní",
    southpaw: "Southpaw",
    switch: "Střídavý",
  },

  countries: {
    GB: "Spojené království",
    PT: "Portugalsko",
    CZ: "Česko",
    SK: "Slovensko",
    PL: "Polsko",
    US: "Spojené státy",
    DE: "Německo",
    BR: "Brazílie",
    AE: "Spojené arabské emiráty",
  },

  home: {
    leadKicker: "Hlavní složka",
    fightWeekTag: "Zápasový týden",
    firstBell: "První gong",
    latestTitle: "Nejnovější",
    latestDek: "Všechno, co redakce vydala",
    loadPreviousWeek: "Objevit předchozí týden",
    weekDivider: (from: string, to: string) => `Týden ${from}–${to}`,
    endOfFeed: "To je zatím vše.",
    predictionsTitle: "Predikce",
    fightWeekTitle: "Co je dál",
    fightWeekDek: "Co je nasmlouvané a co je zatím jen věta",
    resultsTitle: "Výsledky",
    resultsDek: "Každý způsob ukončení tak, jak je na oficiálním listu",
    numbersTitle: "Čísla",
    numbersDek: "Spočítané ze složek. Nikdy předpověď, nikdy kurz.",
    rosterTitle: "Soupiska",
    rosterDek: (files: number) =>
      `${files} ${files === 1 ? "složka" : files < 5 ? "složky" : "složek"}. U každého pole je uvedeno, odkud pochází.`,
    noCompletedCard: (promotion: string) =>
      `Žádná odjetá karta ${promotion} v záznamu není`,
    noCompletedCardBody:
      "Tenhle sloupec se naplní ve chvíli, kdy tu vyjde odjetá karta. Do té doby zůstane prázdný, místo aby ho vyplnila karta, kterou redakce nemá podloženou.",
    lastCard: "Poslední karta",
    nextCard: "Další karta",
    noArchivedCard: "Žádná odjetá karta v archivu",
    fightersTitle: "Bojovníci",
    emptyWeek: "V tomto týdnu nevyšel žádný text.",
    noCardCompleted: "Žádná odjetá karta",
    dataTitle: "Data za textem",
    dataDek: "Každá složka začíná v důkazní vrstvě, ne v konceptu.",
    noLead: "Zatím nevyšel žádný text. Další složka se objeví tady.",
    noStories: "Zatím nevyšel žádný text.",
  },

  didYouKnow: {
    kicker: "Víte, že…",
    verified: "ověřeno",
    source: "Zdroj",
    ariaLabel: "Ověřený fakt dne",
  },

  countdown: {
    days: "Dny",
    hrs: "Hod",
    min: "Min",
    sec: "Sek",
  },

  wire: {
    label: "Drát",
    booked: "Nasmlouváno",
    open: "Otevřené",
  },

  ads: {
    placeholder: "Místo pro reklamu",
    slotLabel: (w: number, h: number) => `${w} × ${h}`,
  },

  latest: {
    title: "Nejnovější",
    dek: "Všechny vydané složky, od nejnovějších.",
    empty: "Zatím nevyšel žádný text.",
  },

  organizationPage: {
    dek: "Zpravodajství a důkazní složky této organizace, od nejnovějších.",
    empty: "Z této organizace zatím nevyšel žádný text.",
    upcoming: "Nasmlouváno",
    stories: "Texty",
  },

  fightWeek: {
    title: "Zápasový týden",
    dek: "Nasmlouvané karty v UFC a Oktagonu — co je hotové a co ne.",
    upcoming: "Nasmlouváno",
    recent: "Poslední karta",
    noUpcoming:
      "V ukázkových datech teď není nasmlouvaná žádná karta. Místo ní ukazujeme poslední odjetý turnaj.",
    empty: "Zatím nemáme složku k žádnému turnaji.",
    cardStatus: "Stav karty",
    countdownPast: "Proběhlo",
  },

  results: {
    defeated: "por.",
    versus: "vs",
    title: "Výsledky",
    dek: "Odjeté karty po pořadí zápasů, se způsobem a časem ukončení tam, kde to záznam dovoluje.",
    round: (n: number) => `${n}. kolo`,
    empty: "Žádná odjetá karta v archivu",
    monthGroup: (month: string) => month,
    expand: "Rozbalit kartu",
    collapse: "Sbalit kartu",
    noResult: "Bez výsledku",
  },

  fighters: {
    title: "Bojovníci",
    dek: "Složky bojovníků se zdroji. Co není doložené, zůstává prázdné.",
    filterAll: "Vše",
    filterUfc: "UFC",
    filterOktagon: "OKTAGON",
    resultCount: (count: number) =>
      `${count} ${count === 1 ? "bojovník" : count > 1 && count < 5 ? "bojovníci" : "bojovníků"}`,
    empty: "Žádný bojovník neodpovídá filtru.",
    tape: "Porovnání parametrů",
    style: "Jak vyhrává",
    coverage: "Pokrytí zdroji",
    relatedStories: "Texty, kde se objevuje",
    noRelated: "K této složce se zatím neváže žádný vydaný text.",
    recordUnavailable: "Bilance není v záznamu",
    upcomingBout: "Nasmlouvaný zápas",
  },

  events: {
    title: "Turnaje",
    dek: "Složky turnajů UFC a Oktagonu.",
    empty: "Zatím nevyšla žádná složka turnaje.",
    card: "Karta",
    coverage: "Texty k tomuto turnaji",
    noCoverage: "K tomuto turnaji zatím nevyšel žádný text.",
    when: "Kdy",
    where: "Kde",
    localTime: "Místní čas",
    noBouts: "Na této kartě zatím není potvrzený žádný zápas.",
    boutsPending: "Zbytek karty potvrzený není.",
    moreOnCard: "Dál na kartě:",
  },

  dataDesk: {
    title: "Datová redakce",
    dek: "Co důkazní vrstva obsahuje — a co v ní záměrně není.",
    coverageTitle: "Aktuální pokrytí",
    coverageDek:
      "Čísla níž se čtou z toho, co tenhle web opravdu obsahuje. Nejde o marketingový údaj.",
    fighterFiles: "Složky bojovníků",
    eventFiles: "Složky turnajů",
    sourceRefs: "Odkazy na zdroje",
    fieldsTracked: "Sledovaná pole",
    boundaryTitle: "Jak číst sázková data",
    boundaryLead:
      "FightAIQ může dodat kurzy s časem pořízení a verzované výstupy modelu. Čtyři omezení zůstávají pevná:",
    boundaries: [
      "U každého kurzu je čas a způsob pořízení; nejde o živou nabídku.",
      "U každé pravděpodobnosti je verze modelu a viditelná nejistota.",
      "Rozdíl mezi modelem a trhem je výsledek výzkumu, ne zaručená výhoda.",
      "Web neobsahuje odkazy na sázkové kanceláře, affiliate odkazy ani nástroje pro podávání sázek.",
    ],
    boundaryFooter:
      "Pokud text cituje deterministický výstup, přímo na stránce uvádí přesnou verzi modelu, vstupy a srozumitelně popsanou nejistotu.",
    modelTitle: "Popis modelu",
    modelVersion: "Verze",
    modelInputs: "Vstupy",
    modelUncertainty: "Nejistota",
    responsiblePlay:
      "Jde o výzkumná data. Nic na této stránce není slib ani osobní doporučení vsadit peníze.",
  },

  predictions: {
    title: "Predikce",
    intro:
      "Predikce vytváří náš vlastní model FightAIQ. Jsou experimentální: popisují, co model spočítal z dohledatelných dat, ne co se stane.",
    disclaimer: "Žádné sázkové doporučení. Predikce jsou experimentální.",
    earlyModel: "Raný model",
    modelVersion: "Verze modelu",
    captured: (stamp: string) => `zachyceno ${stamp}`,
    noModel: "Model zatím neběžel",
    rounds: (n: number) => `${n} × 5:00`,
    oddsSource: "Kurz: agregovaný průměr trhu",
    tableHeadings: {
      bout: "Zápas",
      division: "Váha",
      rounds: "Kola",
      model: "Model",
    },
  },

  howItWorks: {
    title: "Jak to funguje",
    dek: "Jak redakce ověřuje podklady, připravuje text a opravuje chyby.",
    pipelineTitle: "Cesta textu",
    steps: [
      { title: "Výběr tématu", body: "Redakce vybírá událost, která má pro českého čtenáře význam a zároveň k ní existují dohledatelné podklady." },
      { title: "Sběr zdrojů", body: "Karta turnaje, bilance, výsledky a další fakta se ukládají spolu s odkazem a časem získání." },
      { title: "Ověření", body: "Citlivé údaje se porovnávají nejméně ve dvou nezávislých zdrojích. Rozpor se přizná, neskrývá." },
      { title: "Český text", body: "Článek vzniká přímo pro českého čtenáře. Nejasnosti se popisují jako nejasnosti a chybějící údaj se nedoplňuje odhadem." },
      { title: "Redakční kontrola", body: "Před vydáním se kontrolují tvrzení, odkazy, jazyk, práva k fotografiím i jasné označení ukázkového obsahu." },
      { title: "Vydání a opravy", body: "U vydaného textu zůstávají zdroje. Podstatná oprava dostane datum a popis přímo na stránce." },
    ],
    cadenceTitle: "Kontrolní body",
    cadenceDek: "Text nevychází jen proto, aby se zaplnilo místo.",
    cadence: [
      { time: "01", body: "Máme veřejné a dostatečně silné zdroje." },
      { time: "02", body: "Každé důležité tvrzení lze dohledat." },
      { time: "03", body: "Fotografie má známý původ a povolené užití." },
      { time: "04", body: "Nejistota, oprava i ukázkový obsah jsou jasně označené." },
    ],
    rolesTitle: "Redakční zásady",
    rolesDek: "Čtyři pravidla, která platí pro každou rubriku.",
    roles: [
      { name: "Dohledatelnost", body: "Čtenář se ze stránky dostane ke zdroji, na kterém tvrzení stojí." },
      { name: "Přiznaná mezera", body: "Neznámý údaj zůstane neznámý. Nulu, odhad ani jistotu si nevymýšlíme." },
      { name: "Oddělený model", body: "Predikce má verzi a čas výpočtu a nikdy se nevydává za sázkové doporučení." },
      { name: "Viditelná oprava", body: "Významnou chybu neopravujeme potichu; změna zůstane u článku." },
    ],
    humanTitle: "Co zůstává na člověku",
    humanBody:
      "Zakladatel rozhoduje o směru magazínu, rozpočtech, právech k obsahu a citlivých opravách. Vydání musí projít nastavenými kontrolami.",
    socialTitle: "Varianty pro sítě",
    socialBody: (treatments: number, stories: number) =>
      `Připraveno ${treatments} variant k ${stories} textům. Žádná zveřejněná není; účty ani plán publikace zatím neběží.`,
    killTitle: "Když se slot zabije",
    killBody:
      "Když podklad chybí, je tenký, už byl jinde nebo je nespolehlivý, slot padá a důvod se zapíše. Nic se nepíše jen proto, aby bylo místo zaplněné.",
  },

  about: {
    title: "O MMA Files",
    dek: "Český magazín o UFC a Oktagonu, který ukazuje své zdroje.",
    whatTitle: "Co to je",
    whatBody: [
      "MMA Files je český magazín zakladatele Lukáše Kouřila a malé redakce. Píše o UFC, Oktagonu a bojovnících, kteří zajímají české publikum.",
      "Vedle článků vede vlastní datové složky zápasů, turnajů a bojovníků. Každý text má na stránce zdroje a neověřený nebo chybějící údaj zůstává přiznaný.",
    ],
    coversTitle: "Co pokrýváme",
    coversList: [
      "UFC a Oktagon MMA",
      "Pozvánky na turnaje a reporty po akci",
      "Reporty z vážení a profily bojovníků",
      "Datové rozbory a poznámky redakce",
      "Českou a středoevropskou scénu vedle světových karet",
    ],
    notTitle: "Co neděláme",
    notList: [
      "Žádné sázkové tipy, kurzy, odkazy na sázkovky ani affiliate obsah k hazardu",
      "Žádné vymyšlené citace, bilance, zranění, reakce ani statistiky",
      "Žádnou anonymní jistotu a žádné nejmenované pozorovatele",
      "Žádné uměle vytvořené obrázky bojovníků vydávané za fotografie",
      "Žádná loga organizací, grafiky turnajů ani licencované fotografie bez svolení",
    ],
    statusTitle: "Aktuální stav",
    statusBody:
      "Magazín je před veřejným spuštěním. Doručené články a datové složky už web umí zobrazit; ukázkové texty zůstávají označené a vyhledávání zůstane vypnuté do závěrečné kontroly.",
    engineTitle: "Jak pracujeme",
    engineBody:
      "Redakce kombinuje běžnou novinářskou práci s vlastními nástroji pro evidenci zdrojů a zápasových dat. Článek se nevydá bez českého textu a alespoň jednoho veřejného zdroje.",
    engineNote:
      "O směru magazínu, právech k obsahu a podstatných opravách rozhoduje zakladatel.",
  },

  standards: {
    title: "Redakční standardy",
    dek: "Pravidla, podle kterých redakce pracuje, napsaná bez obcházení.",
    sections: [
      {
        title: "Zdroje",
        body: [
          "Každé faktické tvrzení ve vydaném textu má odkaz. Odkazy jsou vidět na stránce, nedržíme je stranou.",
          "Bilance, datum narození, rozpětí paží, výška, postoj i váha potřebují dva nezávislé a shodující se zdroje, než se s nimi dál pracuje. Jediný zdroj zůstává označený jako předběžný.",
          "Když si zdroje odporují, rozpor zapíšeme a ukážeme. Neprůměrujeme ho do čísla někde uprostřed.",
        ],
      },
      {
        title: "Čeština pro českého čtenáře",
        body: [
          "Každý text vzniká česky a pro českého čtenáře.",
          "Používáme přirozený slovosled, správné skloňování jmen a slovník, který se u nás v tomhle sportu opravdu používá.",
          "Nejistotu píšeme otevřeně a stejným pravidlem pro všechny rubriky.",
        ],
      },
      {
        title: "Citace a jejich původ",
        body: [
          "Citace jsou krátké, zdroj je hned u nich a kolem nich stojí ověřený kontext.",
          "Žádnou citaci si nevymýšlíme, nerekonstruujeme, neuhlazujeme ani nepřipisujeme nejmenovanému pozorovateli.",
        ],
      },
      {
        title: "Chybějící informace",
        body: [
          "Neznámý údaj vyjde jako neznámý. Nikdy ho neukážeme jako nulu, odhad ani jako věrohodně znějící detail.",
          "Když zápas, výsledek, čas nebo způsob ukončení potvrzený není, text to řekne.",
        ],
      },
      {
        title: "Sázková data mají pevné hranice",
        body: [
          "Kurzy a modelové výstupy uvádějí čas pořízení, zdroj, verzi a srozumitelně popsanou nejistotu.",
          "Web nemá affiliate odkazy, propagaci sázkových kanceláří, zaručené výsledky, práci se sázkovým účtem ani nástroje pro podávání sázek.",
        ],
      },
      {
        title: "Obrazový doprovod",
        body: [
          "Vizuály k textům jsou typografické a vznikají z dat daného textu. Nejsou to fotografie a nevydáváme je za fotografie.",
          "Loga organizací, grafiky turnajů a licencované fotografie nepoužíváme bez svolení.",
          "Každý vizuál má popisný alternativní text.",
        ],
      },
    ],
  },

  corrections: {
    title: "Opravy",
    dek: "Co měníme a jak si to můžete ověřit.",
    policyTitle: "Postup",
    policyBody: [
      "Když je vydaný text špatně, opravíme ho přímo na stránce a oprava tam zůstane i s datem. Texty potichu nepřepisujeme.",
      "Věcnou změnu označíme jako opravu. Nevěcné doplnění — potvrzený zápas, dopsaný výsledek — označíme jako doplnění.",
      "Když text po vydání nejde podložit vlastními důkazy, stáhneme ho a stažení zapíšeme. Nemažeme ho.",
    ],
    logTitle: "Přehled oprav",
    logDek: "Všechny dosud vydané úpravy, od nejnovějších.",
    logEmpty: "Zatím jsme nevydali žádnou opravu.",
    reportTitle: "Nahlásit chybu",
    reportBody:
      "Pošlete odkaz na text a konkrétní tvrzení, které považujete za chybné. Pokud máte zdroj, přiložte ho.",
  },

  privacy: {
    title: "Soukromí",
    dek: "Co tenhle web sbírá, krátce.",
    sections: [
      {
        title: "Analytika",
        body: [
          "Tahle verze webu běží bez analytického nástroje, reklamní sítě i sledovacích skriptů třetích stran. Pro měření se nenastavují žádné cookies.",
        ],
      },
      {
        title: "Newsletter",
        body: [
          "Formulář na odběr není napojený na žádnou e-mailovou službu. Nic, co do něj napíšete, se neodesílá ani neukládá. Je tu proto, aby šlo posoudit rozvržení stránky dřív, než se poskytovatel vybere.",
        ],
      },
      {
        title: "Serverové logy",
        body: [
          "Hosting, na kterém web poběží, si povede běžné logy požadavků. Jejich uchovávání určuje ten konkrétní hosting a tahle stránka se doplní o přesné údaje dřív, než tu vyjde skutečné zpravodajství.",
        ],
      },
      {
        title: "Kontakt",
        body: [
          "Žádosti o opravu a dotazy k soukromí posílejte na adresu uvedenou na stránce s opravami.",
        ],
      },
    ],
  },

  newsletter: {
    title: "Zápasový týden v jednom e-mailu.",
    dek: "Jednou týdně, česky. Karty, výsledky a co k nim redakce vydala.",
    placeholder: "vas@email.cz",
    localeQuestion: "Jazyk newsletteru",
    submit: "Odebírat",
    notWired:
      "Nepřipojeno. Tenhle formulář je jen ukázka rozvržení — žádná e-mailová služba za ním neběží a nic z toho, co napíšete, se neodesílá ani neukládá.",
    pageTitle: "Newsletter",
    pageDek: "Jeden přehled týdně, vždy česky.",
    whatTitle: "Co v něm přijde",
    whatList: [
      "Karty nasmlouvané na nadcházející týden a u nich, co je hotové a co ne",
      "Všechny složky vydané od minulého přehledu",
      "Opravy vydané za posledních sedm dní",
    ],
    whenTitle: "Kdy",
    whenBody:
      "Jednou týdně. Žádné druhé rozeslání, žádná partnerská pošta, žádné reklamní vsuvky.",
  },

  footer: {
    blurb: "Zpravodajství o UFC a Oktagonu. Každý text má u sebe zdroje.",
    sections: "Rubriky",
    desk: "Redakce",
    follow: "Sledujte nás",
    about: "O MMA Files",
    howItWorks: "Jak to funguje",
    standards: "Redakční standardy",
    corrections: "Opravy",
    privacy: "Soukromí",
    theDesk: "Redakce",
    newsletter: "Newsletter",
    numbers: "Čísla",
    instagram: "Instagram",
    threads: "Threads",
    socialPending: "Účty zatím neběží",
    rss: "RSS",
    legal: "© 2026 MMA Files · Vydává BoardlessAI",
    transparency:
      "MMA Files vychází česky. Každý text má u sebe zdroje, nechává neznámé údaje vidět a opravy ukazuje přímo na stránce. Sázková data jsou časově označená a jasně oddělená od doporučení.",
    rights: "Všechna práva vyhrazena.",
  },

  demo: {
    articleBadge: "Ukázkový obsah",
    articleNotice:
      "Tohle je ukázkový text postavený na smyšlených datech. Není to zpravodajství a stránka je vyloučená z vyhledávačů.",
  },

  notFound: {
    title: "Stránka nenalezena",
    back: "Zpět na Nejnovější",
    body: "Taková stránka neexistuje, nebo zatím nevyšla. Nejnovější věci najdete na titulní straně.",
  },

  states: {
    loading: "Načítáme…",
    loadingMore: "Načítáme předchozí týden…",
    loadPreviousFailed: "Předchozí týden se nepodařilo načíst.",
  },

  time: {
    weighInDay: "Den vážení",
    fightNight: "Zápasový večer",
  },
};

export type Dictionary = typeof cs;
