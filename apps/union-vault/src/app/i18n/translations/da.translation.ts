import { defineTranslationResource } from '../i18n.types';

export default defineTranslationResource(
  'da',
  {
    languageSwitcher: {
      ariaLabel: 'Vælg sprog',
      menuTitle: 'Vælg sprog (24 EU-sprog)',
      selectedTooltip: 'Valgt sprog: {language}',
    },
    header: {
      brandAriaLabel: 'UnionVault.eu — forside',
      navigationAriaLabel: 'Hovednavigation',
      mobileMenuAriaLabel: 'Åbn navigationsmenu',
      mobileCountryLabel: 'Aktuelt land',
      navContact: 'Kontakt',
      navBanks: 'Kredittilbud',
      navCurrencies: 'Valutakurser',
      navRealEstate: 'Ejendomme',
      navDiscover: 'Nye sektioner',
    },
    footer: {
      rightsReserved: 'Alle rettigheder forbeholdes.',
      lastUpdatedLabel: 'Sidst opdateret',
    },
    home: {
      heroSubtitle: 'Dit betroede center for EU-finansdata',
      heroDescription:
        'En paneuropæisk platform, der samler finansdata fra 27 EU-lande. Sammenlign kredittilbud, følg valutakurser og analysér ejendomspriser ét sted.',
      currentCountryLabel: 'Aktuelt land',
      modulesTitle: 'Platformens moduler',
      modules: {
        statusAvailable: 'Tilgængelig',
        banksTitle: 'Kredittilbud',
        banksDescription: 'Sammenlign boliglån, forbrugslån og erhvervslån fra banker i 27 EU-lande.',
        banksAction: 'Sammenlign tilbud',
        currenciesTitle: 'Valutakurser',
        currenciesDescription: 'Aktuelle europæiske valutakurser, opdateret 4 gange dagligt.',
        currenciesAction: 'Se kurser',
        realEstateTitle: 'Ejendomspriser',
        realEstateDescription: 'Lejligheder, huse og grunde fra 27 EU-lande vist på Google Maps.',
        realEstateAction: 'Se ejendomme',
      },
      features: {
        languages: '24 EU-sprog',
        countries: '27 lande',
        cadence: 'Opdateret 4× dagligt',
        compliance: 'GDPR / PSD2 / MiFID II',
        maps: 'Google Maps',
        sources: 'Officielle datakilder',
      },
      info: {
        complianceTitle: 'Regulatorisk overholdelse',
        complianceDescription:
          'GDPR, PSD2, MiFID II, DAC7 og AI Act — produktudviklingen planlægges med fuld EU-overholdelse.',
        sourcesTitle: 'Pålidelige datakilder',
        sourcesDescription: 'Data kommer fra centralbanker, EBA, ESMA, EUR-Lex og ECB.',
        aiTitle: 'Bygget med AI-støtte',
        aiDescription: 'Produktet udvikles med AI-assisteret engineering og automatisering.',
      },
      exploreTitle: 'Nye sektioner og søgeværktøjer',
      exploreDescription:
        'Vi har tilføjet 6 nye sektioner, der hjælper brugere med hurtigere at finde bedre scenarier, lande og investeringsretninger.',
    },
    discover: {
      badge: 'Ny',
      title: 'UnionVaults hub for nye sektioner',
      description:
        'Udforsk regnemaskiner, alarmer, ranglister, sammenligninger, juridiske guider og investorværktøjer. Hver sektion har en fokuseret minisøgning og færdige scenarier.',
      searchLabel: 'Søg i den aktive fane',
      stats: {
        tools: '18 scenarier og værktøjer',
        countries: '27 EU-lande',
        datasets: 'Fælles data for banker, valutaer og ejendomme',
      },
      tabs: {
        calculators: {
          label: 'Beregnere',
          title: 'Beregnere til finansielle beslutninger',
          description:
            'Hurtige værktøjer til at beregne ydelser, købsomkostninger og investeringsafkast på tværs af lande.',
          searchPlaceholder: 'Søg efter beregner, fx ydelse, ROI, købsomkostning',
          emptyTitle: 'Ingen beregnere matcher søgningen',
          emptyDescription: 'Prøv en kortere formulering eller skift til en anden fane.',
          cards: [
            {
              title: 'Låneydelsesberegner',
              description: 'Sammenligner månedlige ydelser efter land, egenbetaling og rentescenarie.',
              metric: 'Scenarier for 10, 20 og 30 år',
              actionLabel: 'Gå til banker',
            },
            {
              title: 'Beregner for købsomkostninger',
              description:
                'Estimerer notar, skatter, lokale gebyrer og samlede indgangsomkostninger for et valgt land.',
              metric: 'Transaktionsomkostninger medregnet',
              actionLabel: 'Gå til ejendomme',
            },
            {
              title: 'Valutaberegner',
              description: 'Beregner veksling, spread og betalingspåvirkning ved forskellige valutakurser.',
              metric: 'Flere kursfeeds',
              actionLabel: 'Gå til valutaer',
            },
          ],
        },
        alerts: {
          label: 'Alarmer',
          title: 'Alarmer og proaktive signaler',
          description:
            'Scenarier for brugere, der vil reagere på kursændringer, nye kredittilbud eller prisfald på ejendomme.',
          searchPlaceholder: 'Søg efter alarm, fx kurs, pris, tilbud',
          emptyTitle: 'Ingen alarmer matcher filteret',
          emptyDescription: 'Fjern en del af søgetermen og prøv igen.',
          cards: [
            {
              title: 'Alarm for valutakurs',
              description: 'Udløses, når et valgt valutapar når din øvre eller nedre grænse.',
              metric: 'Øvre og nedre tærskler',
              actionLabel: 'Gå til valutaer',
            },
            {
              title: 'Alarm for nyt kredittilbud',
              description: 'Overvåger nye eller forbedrede banktilbud efter land og produkttype.',
              metric: 'Filtre efter land og produkt',
              actionLabel: 'Gå til banker',
            },
            {
              title: 'Alarm for prisfald på ejendom',
              description: 'Fremhæver boliger, der falder ind i en attraktiv investeringszone.',
              metric: 'Signaler for udvalgte byer',
              actionLabel: 'Gå til ejendomme',
            },
          ],
        },
        rankings: {
          label: 'Ranglister',
          title: 'Ranglister for lande og byer',
          description: 'Sorter lande efter adgang til finansiering, investeringspotentiale og leveomkostninger.',
          searchPlaceholder: 'Søg efter rangliste, fx land, by, investering',
          emptyTitle: 'Ingen ranglister fundet',
          emptyDescription: 'Gå tilbage til standardvisningen for at se hele ranglisten.',
          cards: [
            {
              title: 'Rangliste for kreditadgang',
              description: 'Samler ÅOP, krav til egenbetaling og svartid i én samlet landescore.',
              metric: 'Landescore',
              actionLabel: 'Gå til banker',
            },
            {
              title: 'Rangliste for investeringsbyer',
              description: 'Sammenligner efterspørgsel, indgangspris og potentiale for lejeafkast i byer.',
              metric: 'Topplaceringer i EU',
              actionLabel: 'Gå til ejendomme',
            },
            {
              title: 'Rangliste for valutastabilitet',
              description: 'Viser, hvor spreads og kursudsving er lavest ved kapitalplanlægning.',
              metric: '30-dages volatilitet',
              actionLabel: 'Gå til valutaer',
            },
          ],
        },
        comparators: {
          label: 'Sammenligninger',
          title: 'Sammenligning af scenarier',
          description: 'Sammenlign land mod land, bank mod bank eller by mod by uden manuelle regneark.',
          searchPlaceholder: 'Søg efter sammenligning, fx bank vs bank, land vs land',
          emptyTitle: 'Ingen sammenligninger fundet',
          emptyDescription: 'Prøv en anden søgefrase eller vælg en anden fane.',
          cards: [
            {
              title: 'Land vs land',
              description: 'Sammenligner indgangsomkostninger, finansiering og valutarisiko på to markeder.',
              metric: 'Side om side-visning',
              actionLabel: 'Gå til forsiden',
            },
            {
              title: 'Bank vs bank',
              description: 'Fremhæver forskelle i ÅOP, ydelse og dokumentkrav i én visning.',
              metric: 'Vigtige KPI’er samlet',
              actionLabel: 'Gå til banker',
            },
            {
              title: 'By vs by',
              description: 'Sammenligner ejendomspriser, lejeafkast og vækstpotentiale for bymarkeder.',
              metric: 'Analyse af lokale markeder',
              actionLabel: 'Gå til ejendomme',
            },
          ],
        },
        lawsTaxes: {
          label: 'Jura og skat',
          title: 'Guide til jura og skat',
          description: 'Praktiske tjeklister for købsregler, skatter og lokale forpligtelser i forskellige lande.',
          searchPlaceholder: 'Søg juridisk emne, fx skat, notar, registrering',
          emptyTitle: 'Ingen juridisk guide fundet',
          emptyDescription: 'Prøv et andet ord for den pligt eller skat, du søger.',
          cards: [
            {
              title: 'Indgangsomkostninger og skatter',
              description: 'Forklarer købsskatter, notargebyrer og registreringsomkostninger pr. målland.',
              metric: 'Tjekliste pr. land',
              actionLabel: 'Gå til kontakt',
            },
            {
              title: 'Ejerens forpligtelser',
              description: 'Opsummerer registrering, udlejning og indberetningspligter for ejere.',
              metric: 'Visning for beboere og ikke-beboere',
              actionLabel: 'Gå til ejendomme',
            },
            {
              title: 'Kort over kreditdokumenter',
              description: 'Skitserer dokumenter, scoring og lokale finansieringskrav.',
              metric: 'Dokumentforløb',
              actionLabel: 'Gå til banker',
            },
          ],
        },
        investorZone: {
          label: 'Investorzone',
          title: 'Investorzone',
          description: 'Færdige visninger til ROI, landsrisiko, kapitalstrategi og market timing.',
          searchPlaceholder: 'Søg investeringsemne, fx ROI, yield, risiko',
          emptyTitle: 'Ingen investorscenarier fundet',
          emptyDescription: 'Udvid søgningen eller vælg en anden sektion.',
          cards: [
            {
              title: 'ROI-varmekort',
              description: 'Estimerer afkastpotentiale for flere ejendomstyper og markedsprofiler.',
              metric: 'ROI og yield samlet',
              actionLabel: 'Gå til ejendomme',
            },
            {
              title: 'Landsrisikoscore',
              description: 'Kombinerer valutavolatilitet, finansieringsomkostning og regulatorisk kompleksitet.',
              metric: 'Risikoscore for investorer',
              actionLabel: 'Gå til valutaer',
            },
            {
              title: 'Scenarier for kapitalindgang',
              description: 'Hjælper med at vælge mellem kontantkøb, gæld og en blandet strategi.',
              metric: '3 finansieringsmodeller',
              actionLabel: 'Gå til banker',
            },
          ],
        },
      },
    },
    errors: {
      notFoundBadge: 'Fejl 404',
      notFoundTitle: 'Vi kunne ikke finde siden',
      notFoundDescription:
        'Adressen kan være forældet eller tastet forkert. Gå tilbage til forsiden eller direkte til platformens vigtigste moduler.',
      serverErrorBadge: 'Fejl 500',
      serverErrorTitle: 'Noget gik galt hos os',
      serverErrorDescription:
        'Vi kunne ikke klargøre denne visning korrekt. Prøv igen om lidt, eller kontakt os, hvis problemet fortsætter.',
      homeAction: 'Tilbage til forsiden',
      contactAction: 'Gå til kontakt',
      banksAction: 'Se kredittilbud',
      currenciesAction: 'Tjek valutakurser',
    },
    legal: {
      disclaimerTitle: 'Juridisk information',
      currencyInformationalDisclaimer:
        'Kurser for markedet {country} er kun til informationsformål. Standardvisningen viser et gennemsnit baseret på flere gratis feeds.',
      countryNoticePending:
        'Detaljerede regulatoriske oplysninger for dette land offentliggøres løbende og bliver færdiggjort før den fulde produktionslancering.',
    },
  },
  'ready',
);
