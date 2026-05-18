import { defineTranslationResource } from '../i18n.types';

export default defineTranslationResource(
  'sv',
  {
    languageSwitcher: {
      ariaLabel: 'Välj språk',
      menuTitle: 'Välj språk (24 EU-språk)',
      selectedTooltip: 'Valt språk: {language}',
    },
    header: {
      brandAriaLabel: 'UnionVault.eu — startsida',
      navigationAriaLabel: 'Huvudnavigering',
      mobileMenuAriaLabel: 'Öppna navigeringsmenyn',
      mobileCountryLabel: 'Aktuellt land',
      navContact: 'Kontakt',
      navBanks: 'Låneerbjudanden',
      navCurrencies: 'Växelkurser',
      navRealEstate: 'Fastigheter',
      navDiscover: 'Nya sektioner',
    },
    footer: {
      rightsReserved: 'Alla rättigheter förbehållna.',
      lastUpdatedLabel: 'Senast uppdaterad',
    },
    home: {
      heroSubtitle: 'Din pålitliga källa till finansiell EU-data',
      heroDescription:
        'En paneuropeisk plattform som samlar finansiella data från 27 länder i Europeiska unionen. Jämför låneerbjudanden, följ växelkurser och analysera fastighetspriser på ett och samma ställe.',
      currentCountryLabel: 'Aktuellt land',
      modulesTitle: 'Plattformens moduler',
      modules: {
        statusAvailable: 'Tillgängligt',
        banksTitle: 'Låneerbjudanden',
        banksDescription: 'Jämför bolån, konsumtionslån och företagslån från banker i 27 EU-länder.',
        banksAction: 'Jämför erbjudanden',
        currenciesTitle: 'Växelkurser',
        currenciesDescription: 'Aktuella europeiska växelkurser som uppdateras 4 gånger per dag.',
        currenciesAction: 'Se kurser',
        realEstateTitle: 'Fastighetspriser',
        realEstateDescription: 'Lägenheter, hus och mark från 27 EU-länder visualiserade på Google Maps.',
        realEstateAction: 'Bläddra bland fastigheter',
      },
      features: {
        languages: '24 EU-språk',
        countries: '27 länder',
        cadence: 'Uppdateras 4× per dag',
        compliance: 'GDPR / PSD2 / MiFID II',
        maps: 'Google Maps',
        sources: 'Officiella datakällor',
      },
      info: {
        complianceTitle: 'Regelverksefterlevnad',
        complianceDescription:
          'GDPR, PSD2, MiFID II, DAC7 och AI Act — produktens utveckling är anpassad till EU:s regelkrav.',
        sourcesTitle: 'Betrodda datakällor',
        sourcesDescription: 'Data hämtas från centralbanker, EBA, ESMA, EUR-Lex och ECB.',
        aiTitle: 'Byggd med stöd av AI',
        aiDescription: 'Produkten tas fram inom ett AI-stött ingenjörsflöde.',
      },
      exploreTitle: 'Nya sektioner och sökverktyg',
      exploreDescription:
        'Vi har lagt till 6 nya sektioner som hjälper användare att snabbare hitta starkare scenarier, länder och investeringsinriktningar.',
    },
    discover: {
      badge: 'Nyhet',
      title: 'UnionVaults nav för nya sektioner',
      description:
        'Utforska kalkylatorer, aviseringar, rankingar, jämförelseverktyg, juridiska guider och investerarverktyg. Varje sektion innehåller en fokuserad minisökning och färdiga scenarier att använda direkt.',
      searchLabel: 'Sök i den aktiva fliken',
      stats: {
        tools: '18 scenarier och verktyg',
        countries: '27 EU-länder',
        datasets: 'Delad data för banker, valutor och fastigheter',
      },
      tabs: {
        calculators: {
          label: 'Kalkylatorer',
          title: 'Kalkylatorer för ekonomiska beslut',
          description:
            'Snabba verktyg för att uppskatta lånebetalningar, förvärvskostnader och investeringsavkastning i olika länder.',
          searchPlaceholder: 'Sök kalkylatorer, t.ex. amortering, ROI, köpkostnad',
          emptyTitle: 'Inga kalkylatorer matchar denna sökning',
          emptyDescription: 'Prova en kortare fras eller byt till en annan flik.',
          cards: [
            {
              title: 'Kalkylator för bolånebetalning',
              description: 'Jämför månadsbetalningar mellan länder, kontantinsatser och antaganden om räntor.',
              metric: 'Scenarier för 10, 20 och 30 år',
              actionLabel: 'Öppna banker',
            },
            {
              title: 'Kalkylator för fastighetsförvärv',
              description:
                'Beräknar notarieavgifter, skatter, lokala avgifter och total inträdeskostnad för ett valt land.',
              metric: 'Transaktionskostnader ingår',
              actionLabel: 'Öppna fastigheter',
            },
            {
              title: 'Valutakalkylator',
              description: 'Beräknar valutaväxling, spread och betalningskänslighet i olika växelkurscenarier.',
              metric: 'Valutavy från flera datakällor',
              actionLabel: 'Öppna valutor',
            },
          ],
        },
        alerts: {
          label: 'Aviseringar',
          title: 'Aviseringar och proaktiva signaler',
          description:
            'Scenarier för användare som vill reagera på kursförändringar, nya låneerbjudanden eller prisfall på fastigheter.',
          searchPlaceholder: 'Sök aviseringar, t.ex. kurs, pris, erbjudande',
          emptyTitle: 'Inga aviseringar matchar detta filter',
          emptyDescription: 'Ta bort en del av sökfrasen och försök igen.',
          cards: [
            {
              title: 'Avisering om växelkurs',
              description: 'Utlöses när ett valt valutapar når din övre eller nedre gräns.',
              metric: 'Övre och nedre mål',
              actionLabel: 'Öppna valutor',
            },
            {
              title: 'Avisering om nytt låneerbjudande',
              description: 'Bevakar nya eller förbättrade låneerbjudanden för valt land och produkttyp.',
              metric: 'Filter för land och produkt',
              actionLabel: 'Öppna banker',
            },
            {
              title: 'Avisering om fastighetsprisfall',
              description: 'Lyfter fram objekt som hamnar i en attraktiv investeringszon.',
              metric: 'Signaler för utvalda städer',
              actionLabel: 'Öppna fastigheter',
            },
          ],
        },
        rankings: {
          label: 'Rankingar',
          title: 'Rankingar för länder och städer',
          description:
            'Sortera länder efter tillgång till finansiering, investeringsattraktivitet och levnadskostnader.',
          searchPlaceholder: 'Sök rankingar, t.ex. land, stad, investering',
          emptyTitle: 'Inga rankingar hittades',
          emptyDescription: 'Återgå till standardvyn för att utforska hela rankingsättet.',
          cards: [
            {
              title: 'Ranking för finansieringstillgänglighet',
              description:
                'Kombinerar effektiv ränta, förväntad kontantinsats och beslutstid till ett samlat landsbetyg.',
              metric: 'Poäng på landsnivå',
              actionLabel: 'Öppna banker',
            },
            {
              title: 'Ranking för investeringsstäder',
              description: 'Jämför efterfrågan, inträdespris och potential för hyresavkastning på stadsmarknader.',
              metric: 'Toppdestinationer i EU',
              actionLabel: 'Öppna fastigheter',
            },
            {
              title: 'Ranking för valutastabilitet',
              description: 'Visar var spreadar och valutavolatilitet är lägst för kapitalplanering.',
              metric: '30-dagars vy över volatilitet',
              actionLabel: 'Öppna valutor',
            },
          ],
        },
        comparators: {
          label: 'Jämförelseverktyg',
          title: 'Jämförelseverktyg för scenarier',
          description: 'Jämför land mot land, bank mot bank eller stad mot stad utan manuellt kalkylarksarbete.',
          searchPlaceholder: 'Sök jämförelser, t.ex. bank mot bank, land mot land',
          emptyTitle: 'Inga jämförelser hittades',
          emptyDescription: 'Prova en annan fras eller utforska en annan flik.',
          cards: [
            {
              title: 'Land mot land',
              description: 'Jämför inträdeskostnader, finansiering och valutaexponering för två valda marknader.',
              metric: 'Vy sida vid sida',
              actionLabel: 'Öppna startsidan',
            },
            {
              title: 'Bank mot bank',
              description:
                'Lyfter fram skillnader i effektiv ränta, månadsbetalning och dokumentationskrav i en och samma vy.',
              metric: 'Viktiga KPI:er i linje',
              actionLabel: 'Öppna banker',
            },
            {
              title: 'Stad mot stad',
              description: 'Jämför fastighetspriser, hyresavkastning och tillväxtpotential på urbana marknader.',
              metric: 'Analys av lokala marknader',
              actionLabel: 'Öppna fastigheter',
            },
          ],
        },
        lawsTaxes: {
          label: 'Lagar och skatter',
          title: 'Guide till lagar och skatter',
          description: 'Praktiska checklistor för köpregler, skatter och lokala skyldigheter i olika länder.',
          searchPlaceholder: 'Sök juridiska ämnen, t.ex. skatt, notarie, registrering',
          emptyTitle: 'Ingen juridisk guide hittades',
          emptyDescription: 'Prova ett annat ord för skatten eller kravet du söker.',
          cards: [
            {
              title: 'Inträdeskostnader och skatter',
              description: 'Förklarar köpskatter, notarieavgifter och registreringskostnader för målländer.',
              metric: 'Checklista per land',
              actionLabel: 'Öppna kontakt',
            },
            {
              title: 'Ägarens skyldigheter',
              description: 'Sammanfattar registrerings-, uthyrnings- och rapporteringsskyldigheter för ägare.',
              metric: 'Vy för boende och icke-boende',
              actionLabel: 'Öppna fastigheter',
            },
            {
              title: 'Karta över kreditdokument',
              description: 'Beskriver nödvändiga dokument, bedömningslogik och lokala finansieringsformaliteter.',
              metric: 'Dokumentflöde',
              actionLabel: 'Öppna banker',
            },
          ],
        },
        investorZone: {
          label: 'Investerarzon',
          title: 'Investerarzon',
          description: 'Färdiga vyer för ROI, landsrisk, strategi för kapitalinträde och marknadstiming.',
          searchPlaceholder: 'Sök investerarämnen, t.ex. ROI, avkastning, risk',
          emptyTitle: 'Inga investerarscenarier hittades',
          emptyDescription: 'Bredda sökningen eller välj en annan sektion.',
          cards: [
            {
              title: 'ROI-värmekarta',
              description: 'Beräknar avkastningspotential för flera fastighetstyper och marknadsprofiler.',
              metric: 'ROI och avkastning tillsammans',
              actionLabel: 'Öppna fastigheter',
            },
            {
              title: 'Poäng för landsrisk',
              description:
                'Kombinerar valutavolatilitet, finansieringskostnad och regelverkskomplexitet i en och samma vy.',
              metric: 'Riskpoäng för investerare',
              actionLabel: 'Öppna valutor',
            },
            {
              title: 'Scenarier för kapitalinträde',
              description: 'Stödjer beslut mellan kontanter, skuld och blandade finansieringsstrategier.',
              metric: '3 finansieringsmodeller',
              actionLabel: 'Öppna banker',
            },
          ],
        },
      },
    },
    errors: {
      notFoundBadge: 'Fel 404',
      notFoundTitle: 'Vi kunde inte hitta den här sidan',
      notFoundDescription:
        'Adressen kan vara inaktuell eller felstavad. Gå tillbaka till startsidan eller hoppa direkt till plattformens viktigaste moduler.',
      serverErrorBadge: 'Fel 500',
      serverErrorTitle: 'Något gick fel på vår sida',
      serverErrorDescription:
        'Vi kunde inte förbereda den här vyn korrekt. Försök igen om en liten stund eller kontakta oss om problemet kvarstår.',
      homeAction: 'Tillbaka till startsidan',
      contactAction: 'Gå till kontakt',
      banksAction: 'Visa låneerbjudanden',
      currenciesAction: 'Kontrollera växelkurser',
    },
    legal: {
      disclaimerTitle: 'Juridisk information',
      currencyInformationalDisclaimer:
        'Växelkurser för marknaden {country} tillhandahålls endast i informationssyfte. Standardvyn visar ett genomsnitt baserat på flera kostnadsfria källor.',
      countryNoticePending:
        'Detaljerade regulatoriska meddelanden för detta land publiceras stegvis och kommer att vara kompletta före den fullständiga produktionslanseringen.',
    },
  },
  'ready',
);
