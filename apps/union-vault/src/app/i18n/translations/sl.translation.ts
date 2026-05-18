import { defineTranslationResource } from '../i18n.types';

export default defineTranslationResource(
  'sl',
  {
    languageSwitcher: {
      ariaLabel: 'Izberi jezik',
      menuTitle: 'Izberi jezik (24 jezikov EU)',
      selectedTooltip: 'Izbrani jezik: {language}',
    },
    header: {
      brandAriaLabel: 'UnionVault.eu — domača stran',
      navigationAriaLabel: 'Glavna navigacija',
      mobileMenuAriaLabel: 'Odpri navigacijski meni',
      mobileCountryLabel: 'Trenutna država',
      navContact: 'Kontakt',
      navBanks: 'Kreditne ponudbe',
      navCurrencies: 'Menjalni tečaji',
      navRealEstate: 'Nepremičnine',
      navDiscover: 'Novi razdelki',
    },
    footer: {
      rightsReserved: 'Vse pravice pridržane.',
      lastUpdatedLabel: 'Zadnja posodobitev',
    },
    home: {
      heroSubtitle: 'Vaš zanesljiv vir finančnih podatkov EU',
      heroDescription:
        'Panevropska platforma, ki združuje finančne podatke iz 27 držav Evropske unije. Primerjajte kreditne ponudbe, spremljajte menjalne tečaje in analizirajte cene nepremičnin na enem mestu.',
      currentCountryLabel: 'Trenutna država',
      modulesTitle: 'Moduli platforme',
      modules: {
        statusAvailable: 'Na voljo',
        banksTitle: 'Kreditne ponudbe',
        banksDescription: 'Primerjajte hipotekarne, potrošniške in poslovne kredite bank iz 27 držav EU.',
        banksAction: 'Primerjaj ponudbe',
        currenciesTitle: 'Menjalni tečaji',
        currenciesDescription: 'Aktualni evropski menjalni tečaji, posodobljeni štirikrat dnevno.',
        currenciesAction: 'Poglej tečaje',
        realEstateTitle: 'Cene nepremičnin',
        realEstateDescription: 'Stanovanja, hiše in zemljišča iz 27 držav EU, prikazana na Google Zemljevidih.',
        realEstateAction: 'Prebrskaj nepremičnine',
      },
      features: {
        languages: '24 jezikov EU',
        countries: '27 držav',
        cadence: 'Posodobljeno 4× dnevno',
        compliance: 'GDPR / PSD2 / MiFID II',
        maps: 'Google Maps',
        sources: 'Uradni viri podatkov',
      },
      info: {
        complianceTitle: 'Regulativna skladnost',
        complianceDescription:
          'GDPR, PSD2, MiFID II, DAC7 in akt o umetni inteligenci — razvoj izdelka je usklajen z regulativnimi zahtevami EU.',
        sourcesTitle: 'Zanesljivi viri podatkov',
        sourcesDescription: 'Podatki izvirajo iz centralnih bank, EBA, ESMA, EUR-Lexa in ECB.',
        aiTitle: 'Razvito s podporo UI',
        aiDescription: 'Izdelek nastaja v okviru inženirskega procesa, podprtega z umetno inteligenco.',
      },
      exploreTitle: 'Novi razdelki in iskalna orodja',
      exploreDescription:
        'Dodali smo 6 novih razdelkov, ki uporabnikom pomagajo hitreje odkriti primernejše scenarije, države in naložbene smeri.',
    },
    discover: {
      badge: 'Novo',
      title: 'Središče novih razdelkov UnionVault',
      description:
        'Raziščite kalkulatorje, opozorila, lestvice, primerjalnike, pravne vodiče in orodja za vlagatelje. Vsak razdelek vključuje ciljno mini iskanje in scenarije, pripravljene za takojšnjo uporabo.',
      searchLabel: 'Išči znotraj aktivnega zavihka',
      stats: {
        tools: '18 scenarijev in orodij',
        countries: '27 držav EU',
        datasets: 'Skupni podatki za banke, valute in nepremičnine',
      },
      tabs: {
        calculators: {
          label: 'Kalkulatorji',
          title: 'Kalkulatorji za finančne odločitve',
          description: 'Hitra orodja za oceno obrokov, stroškov nakupa in donosnosti naložb v različnih državah.',
          searchPlaceholder: 'Išči kalkulatorje, npr. obrok, ROI, strošek nakupa',
          emptyTitle: 'Noben kalkulator ne ustreza temu iskanju',
          emptyDescription: 'Poskusite s krajšim izrazom ali preklopite na drug zavihek.',
          cards: [
            {
              title: 'Kalkulator hipotekarnega obroka',
              description: 'Primerja mesečne obroke glede na državo, višino pologa in predpostavljeno obrestno mero.',
              metric: 'Scenariji za 10, 20 in 30 let',
              actionLabel: 'Odpri banke',
            },
            {
              title: 'Kalkulator stroškov nakupa nepremičnine',
              description:
                'Oceni notarske stroške, davke, lokalne dajatve in skupni vstopni strošek za izbrano državo.',
              metric: 'Vključeni transakcijski stroški',
              actionLabel: 'Odpri nepremičnine',
            },
            {
              title: 'Valutni kalkulator',
              description:
                'Izračuna menjavo valut, razpon in občutljivost plačil pri različnih scenarijih menjalnih tečajev.',
              metric: 'Pogled na tečaje iz več virov',
              actionLabel: 'Odpri valute',
            },
          ],
        },
        alerts: {
          label: 'Opozorila',
          title: 'Opozorila in proaktivni signali',
          description:
            'Scenariji za uporabnike, ki želijo pravočasno reagirati na spremembe tečajev, nove kreditne ponudbe ali padce cen nepremičnin.',
          searchPlaceholder: 'Išči opozorila, npr. tečaj, cena, ponudba',
          emptyTitle: 'Temu filtru ne ustreza nobeno opozorilo',
          emptyDescription: 'Odstranite del iskalnega izraza in poskusite znova.',
          cards: [
            {
              title: 'Opozorilo na menjalni tečaj',
              description: 'Sproži se, ko izbrani valutni par doseže vaš zgornji ali spodnji prag.',
              metric: 'Zgornji in spodnji cilji',
              actionLabel: 'Odpri valute',
            },
            {
              title: 'Opozorilo na novo kreditno ponudbo',
              description: 'Spremlja nove ali izboljšane bančne ponudbe za izbrano državo in vrsto produkta.',
              metric: 'Filtri po državi in produktu',
              actionLabel: 'Odpri banke',
            },
            {
              title: 'Opozorilo na padec cene nepremičnine',
              description: 'Izpostavi oglase, ki preidejo v zanimivo naložbeno območje.',
              metric: 'Signali za izbrana mesta',
              actionLabel: 'Odpri nepremičnine',
            },
          ],
        },
        rankings: {
          label: 'Lestvice',
          title: 'Lestvice držav in mest',
          description:
            'Razvrstite države glede na dostopnost financiranja, naložbeno privlačnost in življenjske stroške.',
          searchPlaceholder: 'Išči lestvice, npr. država, mesto, naložba',
          emptyTitle: 'Ni najdenih lestvic',
          emptyDescription: 'Vrnite se na privzeti pogled in preglejte celoten nabor lestvic.',
          cards: [
            {
              title: 'Lestvica dostopnosti financiranja',
              description: 'Združuje efektivno obrestno mero, pričakovani polog in čas odločitve v eno oceno države.',
              metric: 'Ocena na ravni države',
              actionLabel: 'Odpri banke',
            },
            {
              title: 'Lestvica naložbenih mest',
              description: 'Primerja povpraševanje, vstopno ceno in potencial donosa iz najema na mestnih trgih.',
              metric: 'Najboljše lokacije v EU',
              actionLabel: 'Odpri nepremičnine',
            },
            {
              title: 'Lestvica stabilnosti valut',
              description: 'Pokaže, kje sta razpon in valutna volatilnost najnižja za načrtovanje kapitala.',
              metric: '30-dnevni pogled na volatilnost',
              actionLabel: 'Odpri valute',
            },
          ],
        },
        comparators: {
          label: 'Primerjalniki',
          title: 'Primerjalniki scenarijev',
          description:
            'Primerjajte državo z državo, banko z banko ali mesto z mestom brez ročnega dela v preglednicah.',
          searchPlaceholder: 'Išči primerjalnike, npr. banka proti banki, država proti državi',
          emptyTitle: 'Ni najdenih primerjalnikov',
          emptyDescription: 'Poskusite z drugo frazo ali raziščite drug zavihek.',
          cards: [
            {
              title: 'Država proti državi',
              description: 'Primerja vstopne stroške, financiranje in valutno izpostavljenost za dva izbrana trga.',
              metric: 'Pogled drug ob drugem',
              actionLabel: 'Odpri domačo stran',
            },
            {
              title: 'Banka proti banki',
              description:
                'Na enem mestu izpostavi razlike v efektivni obrestni meri, mesečnem obroku in zahtevani dokumentaciji.',
              metric: 'Ključni KPI usklajeni',
              actionLabel: 'Odpri banke',
            },
            {
              title: 'Mesto proti mestu',
              description: 'Primerja cene nepremičnin, donos iz najema in potencial rasti na urbanih trgih.',
              metric: 'Analiza lokalnih trgov',
              actionLabel: 'Odpri nepremičnine',
            },
          ],
        },
        lawsTaxes: {
          label: 'Pravo in davki',
          title: 'Vodnik po pravu in davkih',
          description:
            'Praktični kontrolni seznami o pravilih nakupa, davkih in lokalnih obveznostih v različnih državah.',
          searchPlaceholder: 'Išči pravne teme, npr. davek, notar, registracija',
          emptyTitle: 'Ni najdenega pravnega vodiča',
          emptyDescription: 'Poskusite z drugim izrazom za davek ali zahtevo, ki jo iščete.',
          cards: [
            {
              title: 'Vstopni stroški in davki',
              description: 'Pojasnjuje davke ob nakupu, notarske stroške in stroške registracije v ciljnih državah.',
              metric: 'Kontrolni seznam po državah',
              actionLabel: 'Odpri kontakt',
            },
            {
              title: 'Obveznosti lastnika',
              description: 'Povzema registracijske, najemne in poročevalske obveznosti lastnikov.',
              metric: 'Pogled za rezidente in nerezidente',
              actionLabel: 'Odpri nepremičnine',
            },
            {
              title: 'Zemljevid kreditne dokumentacije',
              description: 'Oriše zahtevane dokumente, logiko ocenjevanja in lokalne formalnosti financiranja.',
              metric: 'Pot dokumentov',
              actionLabel: 'Odpri banke',
            },
          ],
        },
        investorZone: {
          label: 'Cona za vlagatelje',
          title: 'Cona za vlagatelje',
          description: 'Pripravljeni pogledi za ROI, tveganje države, strategijo vstopa kapitala in čas vstopa na trg.',
          searchPlaceholder: 'Išči teme za vlagatelje, npr. ROI, donos, tveganje',
          emptyTitle: 'Ni najdenih scenarijev za vlagatelje',
          emptyDescription: 'Razširite iskanje ali izberite drug razdelek.',
          cards: [
            {
              title: 'Toplotni zemljevid ROI',
              description: 'Oceni potencial donosa za več vrst nepremičnin in tržnih profilov.',
              metric: 'ROI in donos skupaj',
              actionLabel: 'Odpri nepremičnine',
            },
            {
              title: 'Ocena tveganja države',
              description:
                'Združuje valutno volatilnost, stroške financiranja in regulativno zahtevnost v enem pogledu.',
              metric: 'Ocena tveganja za vlagatelje',
              actionLabel: 'Odpri valute',
            },
            {
              title: 'Scenariji vstopa kapitala',
              description: 'Pomaga pri odločitvi med gotovino, dolgom in kombiniranimi strategijami financiranja.',
              metric: '3 modeli financiranja',
              actionLabel: 'Odpri banke',
            },
          ],
        },
      },
    },
    errors: {
      notFoundBadge: 'Napaka 404',
      notFoundTitle: 'Te strani nismo našli',
      notFoundDescription:
        'Naslov je morda zastarel ali napačno vnesen. Vrnite se na domačo stran ali skočite neposredno na najpomembnejše module platforme.',
      serverErrorBadge: 'Napaka 500',
      serverErrorTitle: 'Na naši strani je prišlo do težave',
      serverErrorDescription:
        'Tega pogleda ni bilo mogoče pravilno pripraviti. Poskusite znova čez nekaj trenutkov ali nas kontaktirajte, če se težava ponavlja.',
      homeAction: 'Nazaj na domačo stran',
      contactAction: 'Pojdi na kontakt',
      banksAction: 'Poglej kreditne ponudbe',
      currenciesAction: 'Preveri menjalne tečaje',
    },
    legal: {
      disclaimerTitle: 'Pravno obvestilo',
      currencyInformationalDisclaimer:
        'Menjalni tečaji za trg {country} so na voljo zgolj v informativne namene. Privzeti pogled prikazuje povprečje na podlagi več brezplačnih virov.',
      countryNoticePending:
        'Podrobna regulativna obvestila za to državo objavljamo postopoma in bodo dopolnjena pred polnim produkcijskim zagonom.',
    },
  },
  'ready',
);
