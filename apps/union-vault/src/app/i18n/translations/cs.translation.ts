import { defineTranslationResource } from '../i18n.types';

export default defineTranslationResource(
  'cs',
  {
    languageSwitcher: {
      ariaLabel: 'Vyberte jazyk',
      menuTitle: 'Vyberte jazyk (24 jazyků EU)',
      selectedTooltip: 'Vybraný jazyk: {language}',
    },
    header: {
      brandAriaLabel: 'UnionVault.eu — domovská stránka',
      navigationAriaLabel: 'Hlavní navigace',
      mobileMenuAriaLabel: 'Otevřít navigační menu',
      mobileCountryLabel: 'Aktuální země',
      navContact: 'Kontakt',
      navBanks: 'Úvěrové nabídky',
      navCurrencies: 'Směnné kurzy',
      navRealEstate: 'Nemovitosti',
      navDiscover: 'Nové sekce',
    },
    footer: {
      rightsReserved: 'Všechna práva vyhrazena.',
      lastUpdatedLabel: 'Poslední aktualizace',
    },
    home: {
      heroSubtitle: 'Váš důvěryhodný zdroj finančních dat z EU',
      heroDescription:
        'Panevropská platforma agregující finanční data z 27 zemí Evropské unie. Porovnávejte úvěrové nabídky, sledujte směnné kurzy a analyzujte ceny nemovitostí — vše na jednom místě.',
      currentCountryLabel: 'Aktuální země',
      modulesTitle: 'Moduly platformy',
      modules: {
        statusAvailable: 'Dostupné',
        banksTitle: 'Úvěrové nabídky',
        banksDescription: 'Porovnání hypotečních, spotřebitelských a firemních úvěrů od bank ve 27 zemích EU.',
        banksAction: 'Porovnat nabídky',
        currenciesTitle: 'Směnné kurzy',
        currenciesDescription: 'Aktuální kurzy evropských měn aktualizované 4× denně.',
        currenciesAction: 'Zobrazit kurzy',
        realEstateTitle: 'Ceny nemovitostí',
        realEstateDescription: 'Byty, domy a pozemky z 27 zemí EU zobrazené na Google Maps.',
        realEstateAction: 'Procházet nemovitosti',
      },
      features: {
        languages: '24 jazyků EU',
        countries: '27 zemí',
        cadence: 'Aktualizace 4× denně',
        compliance: 'GDPR / PSD2 / MiFID II',
        maps: 'Google Maps',
        sources: 'Data z oficiálních zdrojů',
      },
      info: {
        complianceTitle: 'Soulad s regulacemi',
        complianceDescription:
          'GDPR, PSD2, MiFID II, DAC7 a AI Act — vývoj produktu je plánován v plném souladu s regulacemi EU.',
        sourcesTitle: 'Důvěryhodné zdroje dat',
        sourcesDescription: 'Data pocházejí od centrálních bank, EBA, ESMA, EUR-Lex a ECB.',
        aiTitle: 'Vytvářeno s podporou AI',
        aiDescription: 'Projekt vzniká za pomoci týmu AI agentů a inženýrství podporovaného automatizací.',
      },
      exploreTitle: 'Nové sekce a vyhledávací nástroje',
      exploreDescription:
        'Přidali jsme 6 nových sekcí, které pomáhají rychleji najít investiční směr, vhodnou zemi a nejlepší postup.',
    },
    discover: {
      badge: 'Novinka',
      title: 'Centrum nových sekcí UnionVault',
      description:
        'Procházejte kalkulačky, upozornění, žebříčky, srovnávače, právní průvodce a zónu investora. Každá sekce má vlastní mini vyhledávání a sadu hotových scénářů.',
      searchLabel: 'Hledat v aktivní záložce',
      stats: {
        tools: '18 scénářů a nástrojů',
        countries: '27 zemí EU',
        datasets: 'Sdílená data pro banky, měny a nemovitosti',
      },
      tabs: {
        calculators: {
          label: 'Kalkulačky',
          title: 'Kalkulačky pro finanční rozhodování',
          description:
            'Rychlé nástroje pro výpočet splátek, pořizovacích nákladů a návratnosti investic v různých zemích.',
          searchPlaceholder: 'Hledejte kalkulačku, např. splátka, ROI, pořizovací náklady',
          emptyTitle: 'Pro tento dotaz nejsou k dispozici žádné kalkulačky',
          emptyDescription: 'Zkuste kratší frázi nebo přejděte na jinou záložku.',
          cards: [
            {
              title: 'Kalkulačka splátky úvěru',
              description: 'Porovnává měsíční splátku podle země, vlastních prostředků a úrokové sazby.',
              metric: 'Scénáře na 10, 20 a 30 let',
              actionLabel: 'Přejít na banky',
            },
            {
              title: 'Kalkulačka nákladů na koupi nemovitosti',
              description: 'Odhaduje notáře, daně, místní poplatky a celkové vstupní náklady pro vybranou zemi.',
              metric: 'Včetně transakčních nákladů',
              actionLabel: 'Přejít na nemovitosti',
            },
            {
              title: 'Měnová kalkulačka',
              description: 'Počítá převod měn, spread a změnu nákladů splátky při různých kurzech.',
              metric: 'Více kurzových zdrojů',
              actionLabel: 'Přejít na měny',
            },
          ],
        },
        alerts: {
          label: 'Upozornění',
          title: 'Upozornění a automatická oznámení',
          description:
            'Scénáře pro uživatele, kteří chtějí reagovat na změnu kurzu, bankovní nabídky nebo ceny nemovitosti.',
          searchPlaceholder: 'Hledejte upozornění, např. kurz, cena, nabídka',
          emptyTitle: 'Žádná upozornění neodpovídají tomuto filtru',
          emptyDescription: 'Odstraňte část klíčových slov a zkuste to znovu.',
          cards: [
            {
              title: 'Upozornění na měnový kurz',
              description: 'Odešle signál, když vybraný měnový pár dosáhne zadané hranice.',
              metric: 'Horní a dolní limity',
              actionLabel: 'Přejít na měny',
            },
            {
              title: 'Upozornění na novou úvěrovou nabídku',
              description: 'Zachytí nové nebo vylepšené nabídky ve vybrané zemi a segmentu úvěrů.',
              metric: 'Filtry podle země a produktu',
              actionLabel: 'Přejít na banky',
            },
            {
              title: 'Upozornění na pokles ceny nemovitosti',
              description: 'Sleduje inzerci a upozorní, když se objeví zajímavá investiční příležitost.',
              metric: 'Signály pro vybraná města',
              actionLabel: 'Přejít na nemovitosti',
            },
          ],
        },
        rankings: {
          label: 'Žebříčky',
          title: 'Žebříčky zemí a měst',
          description: 'Řaďte země podle dostupnosti úvěrů, investičního potenciálu a životních nákladů.',
          searchPlaceholder: 'Hledejte žebříček, např. země, město, investice',
          emptyTitle: 'Pro tento dotaz nebyly nalezeny žádné žebříčky',
          emptyDescription: 'Vraťte se do výchozího zobrazení a zobrazte si celý přehled.',
          cards: [
            {
              title: 'Žebříček dostupnosti úvěrů',
              description:
                'Spojuje RPSN, požadované vlastní zdroje a dobu rozhodnutí do jednoho přehledného skóre země.',
              metric: 'Skóre podle zemí',
              actionLabel: 'Přejít na banky',
            },
            {
              title: 'Žebříček investičních měst',
              description: 'Porovnává poptávku, vstupní cenu a potenciální výnos z pronájmu.',
              metric: 'Top lokality v EU',
              actionLabel: 'Přejít na nemovitosti',
            },
            {
              title: 'Žebříček měnové stability',
              description: 'Ukazuje, kde jsou spread a kurzová volatilita pro investora nejnižší.',
              metric: '30denní ukazatel volatility',
              actionLabel: 'Přejít na měny',
            },
          ],
        },
        comparators: {
          label: 'Srovnávače',
          title: 'Srovnání scénářů',
          description: 'Porovnávejte zemi se zemí, banku s bankou nebo město s městem bez ručního přepisování dat.',
          searchPlaceholder: 'Hledejte srovnávač, např. banka vs banka, země vs země',
          emptyTitle: 'Pro tento výraz nebyla nalezena žádná srovnání',
          emptyDescription: 'Změňte dotaz nebo vyberte jinou záložku.',
          cards: [
            {
              title: 'Země vs země',
              description: 'Porovnává vstupní náklady, financování a měnové riziko pro dvě vybrané země.',
              metric: 'Zobrazení vedle sebe',
              actionLabel: 'Přejít na domovskou stránku',
            },
            {
              title: 'Banka vs banka',
              description: 'Ukazuje rozdíly v RPSN, splátkách a formálních požadavcích.',
              metric: 'Klíčové KPI na jedné ose',
              actionLabel: 'Přejít na banky',
            },
            {
              title: 'Město vs město',
              description: 'Porovnává ceny nemovitostí, výnosnost a tempo změny cen.',
              metric: 'Analýza místních trhů',
              actionLabel: 'Přejít na nemovitosti',
            },
          ],
        },
        lawsTaxes: {
          label: 'Pravidla a daně',
          title: 'Průvodce předpisy a daněmi',
          description: 'Praktické checklisty pro nákup nemovitosti, úvěry a místní povinnosti v různých zemích.',
          searchPlaceholder: 'Hledejte předpis nebo daň, např. daň, notář, registrace',
          emptyTitle: 'Průvodce jsme nenašli',
          emptyDescription: 'Zkuste jiný název daně nebo povinnosti.',
          cards: [
            {
              title: 'Vstupní náklady a daně',
              description: 'Popisuje daně z koupě, notářské poplatky a registrační náklady.',
              metric: 'Checklisty cílové země',
              actionLabel: 'Přejít na kontakt',
            },
            {
              title: 'Povinnosti vlastníka',
              description: 'Shrnuje registraci, hlášení pobytu, pronájem a základní formální požadavky.',
              metric: 'Verze pro rezidenty i nerezidenty',
              actionLabel: 'Přejít na nemovitosti',
            },
            {
              title: 'Úvěrové formality',
              description: 'Vysvětluje dokumenty, scoring a místní požadavky bank.',
              metric: 'Mapa dokumentů',
              actionLabel: 'Přejít na banky',
            },
          ],
        },
        investorZone: {
          label: 'Zóna investora',
          title: 'Zóna investora',
          description: 'Sada hotových nápadů pro analýzu ROI, rizika země a likvidity investice.',
          searchPlaceholder: 'Hledejte investiční téma, např. ROI, yield, riziko',
          emptyTitle: 'Žádné investiční scénáře',
          emptyDescription: 'Rozšiřte hledání nebo vyberte jinou datovou oblast.',
          cards: [
            {
              title: 'Mapa ROI',
              description: 'Odhaduje potenciální výnos pro různé trhy a typy nemovitostí.',
              metric: 'ROI a yield na jedné kartě',
              actionLabel: 'Přejít na nemovitosti',
            },
            {
              title: 'Hodnocení rizika země',
              description: 'Spojuje měnovou volatilitu, náklady financování a regulatorní prostředí.',
              metric: 'Skóre investičního rizika',
              actionLabel: 'Přejít na měny',
            },
            {
              title: 'Scénáře vstupu kapitálu',
              description: 'Pomáhá vybrat mezi hotovostí, úvěrem a kombinovanou strategií.',
              metric: '3 modely financování',
              actionLabel: 'Přejít na banky',
            },
          ],
        },
      },
    },
    errors: {
      notFoundBadge: 'Chyba 404',
      notFoundTitle: 'Tuto stránku jsme nenašli',
      notFoundDescription:
        'Adresa může být zastaralá nebo zadaná chybně. Vraťte se na domovskou stránku nebo přejděte rovnou do nejdůležitějších modulů platformy.',
      serverErrorBadge: 'Chyba 500',
      serverErrorTitle: 'Na naší straně došlo k problému',
      serverErrorDescription:
        'Toto zobrazení se nepodařilo správně připravit. Zkuste to za chvíli znovu nebo nás kontaktujte, pokud se problém opakuje.',
      homeAction: 'Zpět na domovskou stránku',
      contactAction: 'Přejít na kontakt',
      banksAction: 'Zobrazit úvěrové nabídky',
      currenciesAction: 'Zkontrolovat směnné kurzy',
    },
    legal: {
      disclaimerTitle: 'Právní informace',
      currencyInformationalDisclaimer:
        'Kurzy pro trh {country} mají pouze informativní charakter. Výchozí zobrazení ukazuje průměr z několika bezplatných datových zdrojů.',
      countryNoticePending:
        'Podrobné regulatorní informace pro tuto zemi zveřejňujeme postupně a budou doplněny před plným produkčním spuštěním.',
    },
  },
  'ready',
);
