import { defineTranslationResource } from '../i18n.types';

export default defineTranslationResource(
  'nl',
  {
    languageSwitcher: {
      ariaLabel: 'Kies taal',
      menuTitle: 'Kies taal (24 EU-talen)',
      selectedTooltip: 'Geselecteerde taal: {language}',
    },
    header: {
      brandAriaLabel: 'UnionVault.eu — homepage',
      navigationAriaLabel: 'Hoofdnavigatie',
      mobileMenuAriaLabel: 'Navigatiemenu openen',
      mobileCountryLabel: 'Huidig land',
      navContact: 'Contact',
      navBanks: 'Kredietaanbiedingen',
      navCurrencies: 'Wisselkoersen',
      navRealEstate: 'Vastgoed',
      navDiscover: 'Nieuwe secties',
    },
    footer: {
      rightsReserved: 'Alle rechten voorbehouden.',
      lastUpdatedLabel: 'Laatst bijgewerkt',
    },
    home: {
      heroSubtitle: 'Uw vertrouwde hub voor financiële data uit de EU',
      heroDescription:
        'Een pan-Europees platform dat financiële data uit 27 landen van de Europese Unie bundelt. Vergelijk kredietaanbiedingen, volg wisselkoersen en analyseer vastgoedprijzen — alles op één plek.',
      currentCountryLabel: 'Huidig land',
      modulesTitle: 'Platformmodules',
      modules: {
        statusAvailable: 'Beschikbaar',
        banksTitle: 'Kredietaanbiedingen',
        banksDescription: 'Vergelijk hypotheek-, consumptie- en zakelijke leningen van banken in 27 EU-landen.',
        banksAction: 'Vergelijk aanbiedingen',
        currenciesTitle: 'Wisselkoersen',
        currenciesDescription: 'Actuele Europese wisselkoersen, vier keer per dag bijgewerkt.',
        currenciesAction: 'Bekijk koersen',
        realEstateTitle: 'Vastgoedprijzen',
        realEstateDescription: 'Appartementen, huizen en grond uit 27 EU-landen gevisualiseerd op Google Maps.',
        realEstateAction: 'Bekijk vastgoed',
      },
      features: {
        languages: '24 EU-talen',
        countries: '27 landen',
        cadence: '4× per dag bijgewerkt',
        compliance: 'GDPR / PSD2 / MiFID II',
        maps: 'Google Maps',
        sources: 'Officiële databronnen',
      },
      info: {
        complianceTitle: 'Naleving van regelgeving',
        complianceDescription:
          'GDPR, PSD2, MiFID II, DAC7 en de AI Act — de productroadmap is afgestemd op de regelgevingsvereisten van de EU.',
        sourcesTitle: 'Betrouwbare databronnen',
        sourcesDescription: 'Data is afkomstig van centrale banken, de EBA, ESMA, EUR-Lex en de ECB.',
        aiTitle: 'Gebouwd met AI-ondersteuning',
        aiDescription: 'Het product wordt ontwikkeld via een door AI ondersteunde engineeringworkflow.',
      },
      exploreTitle: 'Nieuwe secties en zoektools',
      exploreDescription:
        "We hebben 6 nieuwe secties toegevoegd om gebruikers sneller betere scenario's, landen en investeringsrichtingen te laten ontdekken.",
    },
    discover: {
      badge: 'Nieuw',
      title: 'Hub voor nieuwe secties van UnionVault',
      description:
        "Verken rekenhulpen, meldingen, ranglijsten, vergelijkers, juridische gidsen en investeerdershulpmiddelen. Elke sectie bevat een gerichte minizoekfunctie en direct bruikbare scenario's.",
      searchLabel: 'Zoek binnen het actieve tabblad',
      stats: {
        tools: "18 scenario's en tools",
        countries: '27 EU-landen',
        datasets: 'Gedeelde data voor banken, valuta en vastgoed',
      },
      tabs: {
        calculators: {
          label: 'Rekenhulpen',
          title: 'Rekenhulpen voor financiële beslissingen',
          description: 'Snelle tools om leninglasten, aankoopkosten en investeringsrendementen per land te berekenen.',
          searchPlaceholder: 'Zoek rekenhulpen, bijv. hypotheek, ROI, aankoopkosten',
          emptyTitle: 'Geen rekenhulpen gevonden voor deze zoekopdracht',
          emptyDescription: 'Probeer een kortere zoekterm of kies een ander tabblad.',
          cards: [
            {
              title: 'Hypotheeklasten-calculator',
              description: 'Vergelijkt maandlasten per land, hoogte van de aanbetaling en aannames over rentetarieven.',
              metric: "Scenario's van 10, 20 en 30 jaar",
              actionLabel: 'Ga naar banken',
            },
            {
              title: 'Calculator voor aankoopkosten van vastgoed',
              description:
                'Berekent notariskosten, belastingen, lokale heffingen en totale instapkosten voor een gekozen land.',
              metric: 'Transactiekosten inbegrepen',
              actionLabel: 'Ga naar vastgoed',
            },
            {
              title: 'Valuta-impactcalculator',
              description:
                "Bereken valutaconversie, spread en gevoeligheid van betalingen in verschillende wisselkoersscenario's.",
              metric: 'Overzicht met meerdere koersbronnen',
              actionLabel: 'Ga naar valuta',
            },
          ],
        },
        alerts: {
          label: 'Meldingen',
          title: 'Meldingen en proactieve signalen',
          description:
            "Scenario's voor gebruikers die willen reageren op koerswijzigingen, nieuwe kredietaanbiedingen of prijsdalingen in vastgoed.",
          searchPlaceholder: 'Zoek meldingen, bijv. koers, woning, aanbod',
          emptyTitle: 'Geen meldingen gevonden voor dit filter',
          emptyDescription: 'Verwijder een deel van de zoekterm en probeer opnieuw.',
          cards: [
            {
              title: 'Melding voor wisselkoers',
              description: 'Wordt geactiveerd wanneer een geselecteerd valutapaar uw boven- of ondergrens bereikt.',
              metric: 'Boven- en ondergrenzen',
              actionLabel: 'Ga naar valuta',
            },
            {
              title: 'Melding voor nieuw kredietaanbod',
              description: 'Volgt nieuwe of verbeterde bancaire aanbiedingen voor het gekozen land en producttype.',
              metric: 'Filters op land en product',
              actionLabel: 'Ga naar banken',
            },
            {
              title: 'Melding bij prijsdaling van vastgoed',
              description: 'Markeert vermeldingen die in een interessante zone voor investeerders terechtkomen.',
              metric: 'Signalen voor geselecteerde steden',
              actionLabel: 'Ga naar vastgoed',
            },
          ],
        },
        rankings: {
          label: 'Ranglijsten',
          title: 'Ranglijsten van landen en steden',
          description:
            'Sorteer landen op toegankelijkheid van financiering, aantrekkelijkheid voor investeringen en kosten van levensonderhoud.',
          searchPlaceholder: 'Zoek ranglijsten, bijv. land, stad, investering',
          emptyTitle: 'Geen ranglijsten gevonden',
          emptyDescription: 'Ga terug naar de standaardweergave om de volledige ranglijst te bekijken.',
          cards: [
            {
              title: 'Ranglijst van financieringstoegankelijkheid',
              description:
                'Combineert JKP, verwachte aanbetaling en doorlooptijd van de beslissing in één score per land.',
              metric: 'Scoring op landniveau',
              actionLabel: 'Ga naar banken',
            },
            {
              title: 'Ranglijst van investeringssteden',
              description: 'Vergelijkt vraag, instapprijs en potentieel huurrendement voor stedelijke markten.',
              metric: 'Toplocaties in de EU',
              actionLabel: 'Ga naar vastgoed',
            },
            {
              title: 'Ranglijst van valutastabiliteit',
              description:
                'Laat zien waar spreads en volatiliteit van wisselkoersen het laagst zijn voor kapitaalplanning.',
              metric: '30-daagse volatiliteitsweergave',
              actionLabel: 'Ga naar valuta',
            },
          ],
        },
        comparators: {
          label: 'Vergelijkers',
          title: "Vergelijkers van scenario's",
          description: 'Vergelijk land met land, bank met bank of stad met stad zonder handmatig spreadsheetwerk.',
          searchPlaceholder: 'Zoek vergelijkers, bijv. bank vs bank, land vs land',
          emptyTitle: 'Geen vergelijkers gevonden',
          emptyDescription: 'Probeer een andere zoekterm of bekijk een ander tabblad.',
          cards: [
            {
              title: 'Land vs land',
              description:
                'Vergelijkt instapkosten, financiering en valutablootstelling voor twee geselecteerde markten.',
              metric: 'Zij-aan-zijweergave',
              actionLabel: 'Ga naar home',
            },
            {
              title: 'Bank vs bank',
              description: 'Benadrukt verschillen in JKP, maandlasten en documentatie in één overzicht.',
              metric: "Belangrijkste KPI's uitgelijnd",
              actionLabel: 'Ga naar banken',
            },
            {
              title: 'Stad vs stad',
              description: 'Vergelijkt vastgoedprijzen, huurrendement en groeipotentieel voor stedelijke markten.',
              metric: 'Analyse van lokale markten',
              actionLabel: 'Ga naar vastgoed',
            },
          ],
        },
        lawsTaxes: {
          label: 'Wetgeving en belastingen',
          title: 'Gids voor wetgeving en belastingen',
          description:
            'Praktische checklists over aankoopregels, belastingen en lokale verplichtingen in verschillende landen.',
          searchPlaceholder: 'Zoek juridische onderwerpen, bijv. belasting, notaris, registratie',
          emptyTitle: 'Geen juridische gids gevonden',
          emptyDescription: 'Probeer een andere term voor de belasting of verplichting die u zoekt.',
          cards: [
            {
              title: 'Instapkosten en belastingen',
              description: 'Licht aankoopbelastingen, notariskosten en registratiekosten per doelland toe.',
              metric: 'Checklist per land',
              actionLabel: 'Ga naar contact',
            },
            {
              title: 'Verplichtingen van eigenaren',
              description: 'Vat registratie-, verhuur- en rapportageverplichtingen voor eigenaren samen.',
              metric: 'Weergave voor ingezetenen en niet-ingezetenen',
              actionLabel: 'Ga naar vastgoed',
            },
            {
              title: 'Overzicht van kredietdocumentatie',
              description: 'Geeft inzicht in vereiste documenten, scorelogica en lokale financieringsformaliteiten.',
              metric: 'Documentenroute',
              actionLabel: 'Ga naar banken',
            },
          ],
        },
        investorZone: {
          label: 'Investeerderszone',
          title: 'Investeerderszone',
          description: 'Kant-en-klare weergaven voor ROI, landenrisico, strategie voor kapitaalinstap en markt-timing.',
          searchPlaceholder: "Zoek beleggingsthema's, bijv. ROI, yield, risico",
          emptyTitle: "Geen investeerdersscenario's gevonden",
          emptyDescription: 'Breid de zoekopdracht uit of kies een andere sectie.',
          cards: [
            {
              title: 'ROI-heatmap',
              description: 'Schat het rendements-potentieel voor meerdere vastgoedtypes en marktprofielen.',
              metric: 'ROI en yield samen',
              actionLabel: 'Ga naar vastgoed',
            },
            {
              title: 'Risicoscore per land',
              description:
                'Combineert valutavolatiliteit, financieringskosten en regelgevingscomplexiteit in één overzicht.',
              metric: 'Risicoscore voor investeerders',
              actionLabel: 'Ga naar valuta',
            },
            {
              title: "Scenario's voor kapitaalinstap",
              description: 'Ondersteunt keuzes tussen cash, schuld en gemengde financieringsstrategieën.',
              metric: '3 financieringsmodellen',
              actionLabel: 'Ga naar banken',
            },
          ],
        },
      },
    },
    errors: {
      notFoundBadge: 'Fout 404',
      notFoundTitle: 'We konden deze pagina niet vinden',
      notFoundDescription:
        'Het adres kan verouderd zijn of verkeerd zijn ingevoerd. Ga terug naar de homepage of ga direct naar de belangrijkste platformmodules.',
      serverErrorBadge: 'Fout 500',
      serverErrorTitle: 'Er is iets misgegaan aan onze kant',
      serverErrorDescription:
        'We konden deze weergave niet correct opbouwen. Probeer het zo meteen opnieuw of neem contact met ons op als het probleem blijft terugkomen.',
      homeAction: 'Terug naar homepage',
      contactAction: 'Ga naar contact',
      banksAction: 'Bekijk kredietaanbiedingen',
      currenciesAction: 'Bekijk wisselkoersen',
    },
    legal: {
      disclaimerTitle: 'Juridische kennisgeving',
      currencyInformationalDisclaimer:
        'Wisselkoersen voor de markt van {country} dienen uitsluitend ter informatie. De standaardweergave toont een gemiddelde op basis van meerdere gratis databronnen.',
      countryNoticePending:
        'Gedetailleerde regelgevingsmeldingen voor dit land worden stapsgewijs gepubliceerd en vóór de volledige productielancering aangevuld.',
    },
  },
  'ready',
);
