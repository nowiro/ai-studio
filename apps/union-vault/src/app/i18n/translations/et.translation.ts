import { defineTranslationResource } from '../i18n.types';

export default defineTranslationResource(
  'et',
  {
    languageSwitcher: {
      ariaLabel: 'Vali keel',
      menuTitle: 'Vali keel (24 ELi keelt)',
      selectedTooltip: 'Valitud keel: {language}',
    },
    header: {
      brandAriaLabel: 'UnionVault.eu — avaleht',
      navigationAriaLabel: 'Põhinavigeerimine',
      mobileMenuAriaLabel: 'Ava navigeerimismenüü',
      mobileCountryLabel: 'Praegune riik',
      navContact: 'Kontakt',
      navBanks: 'Laenupakkumised',
      navCurrencies: 'Valuutakursid',
      navRealEstate: 'Kinnisvara',
      navDiscover: 'Uued jaotised',
    },
    footer: {
      rightsReserved: 'Kõik õigused kaitstud.',
      lastUpdatedLabel: 'Viimati uuendatud',
    },
    home: {
      heroSubtitle: 'Sinu usaldusväärne ELi finantsandmete keskus',
      heroDescription:
        'Üleeuroopaline platvorm, mis koondab finantsandmeid 27 Euroopa Liidu riigist. Võrdle laenupakkumisi, jälgi valuutakursse ja analüüsi kinnisvarahindu — kõik ühes kohas.',
      currentCountryLabel: 'Praegune riik',
      modulesTitle: 'Platvormi moodulid',
      modules: {
        statusAvailable: 'Saadaval',
        banksTitle: 'Laenupakkumised',
        banksDescription: 'Võrdle eluaseme-, tarbimis- ja ärilaene pankadest 27 ELi riigis.',
        banksAction: 'Võrdle pakkumisi',
        currenciesTitle: 'Valuutakursid',
        currenciesDescription: 'Ajakohased Euroopa valuutakursid, mida uuendatakse 4 korda päevas.',
        currenciesAction: 'Vaata kursse',
        realEstateTitle: 'Kinnisvarahinnad',
        realEstateDescription: 'Korterid, majad ja maaüksused 27 ELi riigist Google Mapsi kaardivaates.',
        realEstateAction: 'Sirvi kinnisvara',
      },
      features: {
        languages: '24 ELi keelt',
        countries: '27 riiki',
        cadence: 'Uuendus 4× päevas',
        compliance: 'GDPR / PSD2 / MiFID II',
        maps: 'Google Maps',
        sources: 'Ametlikud andmeallikad',
      },
      info: {
        complianceTitle: 'Vastavus nõuetele',
        complianceDescription:
          'GDPR, PSD2, MiFID II, DAC7 ja AI Act — toote arendus on kavandatud täielikus kooskõlas ELi regulatsioonidega.',
        sourcesTitle: 'Usaldusväärsed andmeallikad',
        sourcesDescription: 'Andmed pärinevad keskpankadelt, EBA-lt, ESMA-lt, EUR-Lexist ja EKP-lt.',
        aiTitle: 'Loodud tehisaru toel',
        aiDescription: 'Projekti arendab tehisaru agentidest koosnev meeskond ja automatiseeritud inseneeria.',
      },
      exploreTitle: 'Uued jaotised ja otsingud',
      exploreDescription:
        'Lisasime 6 uut jaotist, mis aitavad kiiremini leida investeerimissuunda, riiki ja parimat tegutsemisstsenaariumi.',
    },
    discover: {
      badge: 'Uus',
      title: 'UnionVaulti uute jaotiste keskus',
      description:
        'Avasta kalkulaatorid, teavitused, edetabelid, võrdlustööriistad, õigusjuhendid ja investoriala. Igal jaotisel on oma miniotsing ja valmis stsenaariumid.',
      searchLabel: 'Otsi aktiivselt vahekaardilt',
      stats: {
        tools: '18 stsenaariumi ja tööriista',
        countries: '27 ELi riiki',
        datasets: 'Pankade, valuutade ja kinnisvara ühised andmed',
      },
      tabs: {
        calculators: {
          label: 'Kalkulaatorid',
          title: 'Finantsotsuste kalkulaatorid',
          description: 'Kiired tööriistad maksete, ostukulude ja investeeringu tasuvuse arvutamiseks eri riikides.',
          searchPlaceholder: 'Otsi kalkulaatorit, nt kuumakse, ROI, ostukulu',
          emptyTitle: 'Selle päringu jaoks kalkulaatoreid ei leitud',
          emptyDescription: 'Proovi lühemat fraasi või liigu teisele vahekaardile.',
          cards: [
            {
              title: 'Laenumakse kalkulaator',
              description: 'Võrdleb kuumakseid riigi, sissemakse suuruse ja intressimäära järgi.',
              metric: '10, 20 ja 30 aasta stsenaariumid',
              actionLabel: 'Ava pangad',
            },
            {
              title: 'Kinnisvara ostukulu kalkulaator',
              description: 'Hindab notari-, maksu-, kohalikke tasusid ja sisenemiskulu valitud riigi jaoks.',
              metric: 'Tehingukulud on arvesse võetud',
              actionLabel: 'Ava kinnisvara',
            },
            {
              title: 'Valuutakalkulaator',
              description: 'Arvutab ümbervahetuse, spreadi ja kuumakse maksumuse muutuse eri kursside korral.',
              metric: 'Mitu kursiallikat',
              actionLabel: 'Ava valuutad',
            },
          ],
        },
        alerts: {
          label: 'Teavitused',
          title: 'Teavitused ja automaatsed märguanded',
          description:
            'Stsenaariumid kasutajatele, kes soovivad reageerida kursi, pangapakkumise või kinnisvarahinna muutusele.',
          searchPlaceholder: 'Otsi teavitust, nt kurss, hind, pakkumine',
          emptyTitle: 'Filtrile vastavaid teavitusi ei leitud',
          emptyDescription: 'Eemalda osa märksõnadest ja proovi uuesti.',
          cards: [
            {
              title: 'Valuutakursi teavitus',
              description: 'Saadab märguande, kui valitud valuutapaar jõuab määratud piirini.',
              metric: 'Ülemised ja alumised piirid',
              actionLabel: 'Ava valuutad',
            },
            {
              title: 'Uue laenupakkumise teavitus',
              description: 'Tuvastab uued või parandatud pakkumised valitud riigis ja laenusegmendis.',
              metric: 'Filtrid riigi ja toote järgi',
              actionLabel: 'Ava pangad',
            },
            {
              title: 'Kinnisvarahinna languse teavitus',
              description: 'Jälgib kuulutusi ja annab märku, kui tekib investeerimisvõimalus.',
              metric: 'Märguanded valitud linnade jaoks',
              actionLabel: 'Ava kinnisvara',
            },
          ],
        },
        rankings: {
          label: 'Edetabelid',
          title: 'Riikide ja linnade edetabelid',
          description: 'Järjesta riike laenu kättesaadavuse, investeerimispotentsiaali ja elukalliduse järgi.',
          searchPlaceholder: 'Otsi edetabelit, nt riik, linn, investeering',
          emptyTitle: 'Selle päringu jaoks edetabeleid ei leitud',
          emptyDescription: 'Täieliku ülevaate nägemiseks naase üldvaatesse.',
          cards: [
            {
              title: 'Laenu kättesaadavuse edetabel',
              description:
                'Ühendab krediidi kulukuse määra, nõutava sissemakse ja otsuse aja üheks selgeks riigiskooriks.',
              metric: 'Riigipõhine skoor',
              actionLabel: 'Ava pangad',
            },
            {
              title: 'Investeerimislinnade edetabel',
              description: 'Võrdleb nõudlust, sisenemishinda ja võimalikku üüritootlust.',
              metric: 'ELi parimad asukohad',
              actionLabel: 'Ava kinnisvara',
            },
            {
              title: 'Valuutastabiilsuse edetabel',
              description: 'Näitab, kus spread ja kursikõikumine on investori jaoks kõige väiksemad.',
              metric: '30 päeva volatiilsuse näitaja',
              actionLabel: 'Ava valuutad',
            },
          ],
        },
        comparators: {
          label: 'Võrdlustööriistad',
          title: 'Stsenaariumide võrdlejad',
          description: 'Võrdle riiki riigiga, panka pangaga või linna linnaga ilma andmeid käsitsi ümber kirjutamata.',
          searchPlaceholder: 'Otsi võrdlust, nt pank vs pank, riik vs riik',
          emptyTitle: 'Selle fraasi jaoks võrdlusi ei leitud',
          emptyDescription: 'Muuda päringut või vali teine vahekaart.',
          cards: [
            {
              title: 'Riik vs riik',
              description: 'Võrdleb kahe valitud riigi sisenemiskulusid, laenutingimusi ja valuutakurssi.',
              metric: 'Kõrvuti vaade',
              actionLabel: 'Ava avaleht',
            },
            {
              title: 'Pank vs pank',
              description: 'Näitab erinevusi krediidi kulukuse määras, kuumaksetes ja formaalsetes nõuetes.',
              metric: 'Olulised KPI-d ühel teljel',
              actionLabel: 'Ava pangad',
            },
            {
              title: 'Linn vs linn',
              description: 'Võrdleb kinnisvarahindu, tootlust ja hinnamuutuste tempot.',
              metric: 'Kohalike turgude analüüs',
              actionLabel: 'Ava kinnisvara',
            },
          ],
        },
        lawsTaxes: {
          label: 'Seadused ja maksud',
          title: 'Seaduste ja maksude juhend',
          description:
            'Praktilised kontrollnimekirjad kinnisvara ostu, laenude ja kohalike kohustuste jaoks eri riikides.',
          searchPlaceholder: 'Otsi reeglit või maksu, nt ostumaks, notar, registreerimine',
          emptyTitle: 'Juhendit ei leitud',
          emptyDescription: 'Proovi mõnda muud maksu või kohustuse nimetust.',
          cards: [
            {
              title: 'Sisenemiskulud ja maksud',
              description: 'Kirjeldab ostumakse, notaritasusid ja registreerimiskulusid.',
              metric: 'Sihtkoha riigi kontrollnimekirjad',
              actionLabel: 'Ava kontakt',
            },
            {
              title: 'Omaniku kohustused',
              description: 'Võtab kokku registreerimise, elukoha registreerimise, üürimise ja põhilised vorminõuded.',
              metric: 'Versioon residentidele ja mitteresidentidele',
              actionLabel: 'Ava kinnisvara',
            },
            {
              title: 'Laenu vormistus',
              description: 'Selgitab dokumente, hindamist ja pankade kohalikke nõudeid.',
              metric: 'Dokumentide kaart',
              actionLabel: 'Ava pangad',
            },
          ],
        },
        investorZone: {
          label: 'Investori ala',
          title: 'Investori ala',
          description: 'Valmis ideed ROI, riigiriski ja investeeringu likviidsuse analüüsimiseks.',
          searchPlaceholder: 'Otsi investeerimisteemat, nt ROI, yield, risk',
          emptyTitle: 'Investeerimisstsenaariume ei leitud',
          emptyDescription: 'Laienda otsingut või vali mõni muu andmevaldkond.',
          cards: [
            {
              title: 'ROI kaart',
              description: 'Hindab võimalikku tootlust eri turgude ja kinnisvaratüüpide puhul.',
              metric: 'ROI ja yield ühel kaardil',
              actionLabel: 'Ava kinnisvara',
            },
            {
              title: 'Riigiriski hinnang',
              description: 'Ühendab valuutavolatiilsuse, finantseerimiskulud ja regulatiivse keskkonna.',
              metric: 'Investori riskiskoor',
              actionLabel: 'Ava valuutad',
            },
            {
              title: 'Kapitali sisenemise stsenaariumid',
              description: 'Aitab valida sularaha, laenu ja kombineeritud strateegia vahel.',
              metric: '3 finantseerimismudelit',
              actionLabel: 'Ava pangad',
            },
          ],
        },
      },
    },
    errors: {
      notFoundBadge: 'Viga 404',
      notFoundTitle: 'Me ei leidnud seda lehte',
      notFoundDescription:
        'Aadress võib olla aegunud või sisestatud veaga. Mine tagasi avalehele või ava platvormi olulisemad moodulid.',
      serverErrorBadge: 'Viga 500',
      serverErrorTitle: 'Meie poolel tekkis probleem',
      serverErrorDescription:
        'Vaadet ei õnnestunud korrektselt ette valmistada. Proovi mõne hetke pärast uuesti või võta meiega ühendust, kui probleem kordub.',
      homeAction: 'Tagasi avalehele',
      contactAction: 'Ava kontakt',
      banksAction: 'Vaata laenupakkumisi',
      currenciesAction: 'Vaata valuutakursse',
    },
    legal: {
      disclaimerTitle: 'Juriidiline teave',
      currencyInformationalDisclaimer:
        'Turu {country} valuutakursid on esitatud ainult informatiivsel eesmärgil. Vaikimisi vaade näitab mitme tasuta andmeallika keskmist.',
      countryNoticePending:
        'Selle riigi üksikasjalikud regulatiivsed märkused avaldatakse etapiviisiliselt ja täiendatakse enne täielikku tootmiskäivitust.',
    },
  },
  'ready',
);
