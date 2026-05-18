import { defineTranslationResource } from '../i18n.types';

export default defineTranslationResource(
  'sk',
  {
    languageSwitcher: {
      ariaLabel: 'Vybrať jazyk',
      menuTitle: 'Vybrať jazyk (24 jazykov EÚ)',
      selectedTooltip: 'Vybraný jazyk: {language}',
    },
    header: {
      brandAriaLabel: 'UnionVault.eu — domovská stránka',
      navigationAriaLabel: 'Hlavná navigácia',
      mobileMenuAriaLabel: 'Otvoriť navigačné menu',
      mobileCountryLabel: 'Aktuálna krajina',
      navContact: 'Kontakt',
      navBanks: 'Ponuky úverov',
      navCurrencies: 'Výmenné kurzy',
      navRealEstate: 'Nehnuteľnosti',
      navDiscover: 'Nové sekcie',
    },
    footer: {
      rightsReserved: 'Všetky práva vyhradené.',
      lastUpdatedLabel: 'Naposledy aktualizované',
    },
    home: {
      heroSubtitle: 'Váš spoľahlivý zdroj finančných údajov z EÚ',
      heroDescription:
        'Paneurópska platforma zhromažďujúca finančné údaje z 27 krajín Európskej únie. Porovnávajte ponuky úverov, sledujte výmenné kurzy a analyzujte ceny nehnuteľností na jednom mieste.',
      currentCountryLabel: 'Aktuálna krajina',
      modulesTitle: 'Moduly platformy',
      modules: {
        statusAvailable: 'Dostupné',
        banksTitle: 'Ponuky úverov',
        banksDescription: 'Porovnávajte hypotekárne, spotrebiteľské a podnikateľské úvery z bánk v 27 krajinách EÚ.',
        banksAction: 'Porovnať ponuky',
        currenciesTitle: 'Výmenné kurzy',
        currenciesDescription: 'Aktuálne európske výmenné kurzy, aktualizované 4-krát denne.',
        currenciesAction: 'Zobraziť kurzy',
        realEstateTitle: 'Ceny nehnuteľností',
        realEstateDescription: 'Byty, domy a pozemky z 27 krajín EÚ zobrazené na mapách Google.',
        realEstateAction: 'Prehliadať nehnuteľnosti',
      },
      features: {
        languages: '24 jazykov EÚ',
        countries: '27 krajín',
        cadence: 'Aktualizácia 4× denne',
        compliance: 'GDPR / PSD2 / MiFID II',
        maps: 'Google Maps',
        sources: 'Údaje z oficiálnych zdrojov',
      },
      info: {
        complianceTitle: 'Súlad s reguláciami',
        complianceDescription:
          'GDPR, PSD2, MiFID II, DAC7 a akt o AI — vývoj produktu je plánovaný v súlade s požiadavkami regulácií EÚ.',
        sourcesTitle: 'Dôveryhodné zdroje údajov',
        sourcesDescription: 'Údaje pochádzajú z centrálnych bánk, EBA, ESMA, EUR-Lexu a ECB.',
        aiTitle: 'Vytvárané s podporou AI',
        aiDescription: 'Produkt vzniká v rámci inžinierskeho procesu podporovaného umelou inteligenciou.',
      },
      exploreTitle: 'Nové sekcie a vyhľadávacie nástroje',
      exploreDescription:
        'Pridali sme 6 nových sekcií, ktoré používateľom pomáhajú rýchlejšie objaviť vhodnejšie scenáre, krajiny a investičné smery.',
    },
    discover: {
      badge: 'Novinka',
      title: 'Centrum nových sekcií UnionVault',
      description:
        'Preskúmajte kalkulačky, upozornenia, rebríčky, porovnávače, právne príručky a nástroje pre investorov. Každá sekcia obsahuje cielené mini vyhľadávanie a pripravené scenáre na okamžité použitie.',
      searchLabel: 'Hľadať v aktívnej karte',
      stats: {
        tools: '18 scenárov a nástrojov',
        countries: '27 krajín EÚ',
        datasets: 'Spoločné dáta pre banky, meny a nehnuteľnosti',
      },
      tabs: {
        calculators: {
          label: 'Kalkulačky',
          title: 'Kalkulačky pre finančné rozhodnutia',
          description: 'Rýchle nástroje na odhad splátok, nákladov na kúpu a výnosov z investícií v rôznych krajinách.',
          searchPlaceholder: 'Hľadať kalkulačky, napr. splátka, ROI, náklady na kúpu',
          emptyTitle: 'Žiadne kalkulačky nezodpovedajú tomuto vyhľadávaniu',
          emptyDescription: 'Skúste kratší výraz alebo prejdite na inú kartu.',
          cards: [
            {
              title: 'Kalkulačka splátky hypotéky',
              description: 'Porovnáva mesačné splátky podľa krajiny, výšky akontácie a predpokladanej úrokovej sadzby.',
              metric: 'Scenáre na 10, 20 a 30 rokov',
              actionLabel: 'Prejsť na banky',
            },
            {
              title: 'Kalkulačka nákladov na kúpu nehnuteľnosti',
              description:
                'Odhaduje notárske poplatky, dane, miestne poplatky a celkové vstupné náklady pre vybranú krajinu.',
              metric: 'Vrátane transakčných nákladov',
              actionLabel: 'Prejsť na nehnuteľnosti',
            },
            {
              title: 'Menová kalkulačka',
              description: 'Vypočíta konverziu meny, spread a citlivosť platieb pri rôznych scenároch výmenného kurzu.',
              metric: 'Viaczdrojový pohľad na kurzy',
              actionLabel: 'Prejsť na meny',
            },
          ],
        },
        alerts: {
          label: 'Upozornenia',
          title: 'Upozornenia a proaktívne signály',
          description:
            'Scenáre pre používateľov, ktorí chcú reagovať na zmeny kurzov, nové ponuky úverov alebo pokles cien nehnuteľností.',
          searchPlaceholder: 'Hľadať upozornenia, napr. kurz, cena, ponuka',
          emptyTitle: 'Tomuto filtru nezodpovedajú žiadne upozornenia',
          emptyDescription: 'Odstráňte časť vyhľadávacieho výrazu a skúste to znova.',
          cards: [
            {
              title: 'Upozornenie na výmenný kurz',
              description: 'Spustí sa, keď vybraný menový pár dosiahne vašu hornú alebo dolnú hranicu.',
              metric: 'Horné a dolné hranice',
              actionLabel: 'Prejsť na meny',
            },
            {
              title: 'Upozornenie na novú ponuku úveru',
              description: 'Sleduje nové alebo vylepšené bankové ponuky pre vybranú krajinu a typ produktu.',
              metric: 'Filtre podľa krajiny a produktu',
              actionLabel: 'Prejsť na banky',
            },
            {
              title: 'Upozornenie na pokles ceny nehnuteľnosti',
              description: 'Zvýrazňuje ponuky, ktoré sa dostanú do investične zaujímavej zóny.',
              metric: 'Signály pre vybrané mestá',
              actionLabel: 'Prejsť na nehnuteľnosti',
            },
          ],
        },
        rankings: {
          label: 'Rebríčky',
          title: 'Rebríčky krajín a miest',
          description: 'Trieďte krajiny podľa dostupnosti financovania, investičnej atraktivity a životných nákladov.',
          searchPlaceholder: 'Hľadať rebríčky, napr. krajina, mesto, investícia',
          emptyTitle: 'Nenašli sa žiadne rebríčky',
          emptyDescription: 'Vráťte sa na predvolené zobrazenie a prezrite si celý rebríček.',
          cards: [
            {
              title: 'Rebríček dostupnosti financovania',
              description: 'Spája RPMN, očakávanú akontáciu a čas rozhodnutia do jedného skóre krajiny.',
              metric: 'Hodnotenie na úrovni krajiny',
              actionLabel: 'Prejsť na banky',
            },
            {
              title: 'Rebríček investičných miest',
              description: 'Porovnáva dopyt, vstupnú cenu a potenciál výnosu z prenájmu na mestských trhoch.',
              metric: 'Top lokality v EÚ',
              actionLabel: 'Prejsť na nehnuteľnosti',
            },
            {
              title: 'Rebríček stability mien',
              description: 'Ukazuje, kde sú spready a volatilita mien najnižšie z pohľadu plánovania kapitálu.',
              metric: '30-dňový pohľad na volatilitu',
              actionLabel: 'Prejsť na meny',
            },
          ],
        },
        comparators: {
          label: 'Porovnávače',
          title: 'Porovnávače scenárov',
          description:
            'Porovnávajte krajinu s krajinou, banku s bankou alebo mesto s mestom bez ručnej práce v tabuľkách.',
          searchPlaceholder: 'Hľadať porovnávače, napr. banka vs banka, krajina vs krajina',
          emptyTitle: 'Nenašli sa žiadne porovnávače',
          emptyDescription: 'Skúste inú frázu alebo preskúmajte inú kartu.',
          cards: [
            {
              title: 'Krajina vs krajina',
              description: 'Porovnáva vstupné náklady, financovanie a menové riziko pre dva vybrané trhy.',
              metric: 'Zobrazenie vedľa seba',
              actionLabel: 'Prejsť na domovskú stránku',
            },
            {
              title: 'Banka vs banka',
              description: 'Na jednom mieste zvýrazňuje rozdiely v RPMN, mesačnej splátke a požadovaných dokumentoch.',
              metric: 'Kľúčové KPI zoradené spolu',
              actionLabel: 'Prejsť na banky',
            },
            {
              title: 'Mesto vs mesto',
              description: 'Porovnáva ceny nehnuteľností, výnos z prenájmu a rastový potenciál mestských trhov.',
              metric: 'Analýza lokálnych trhov',
              actionLabel: 'Prejsť na nehnuteľnosti',
            },
          ],
        },
        lawsTaxes: {
          label: 'Právo a dane',
          title: 'Sprievodca právom a daňami',
          description:
            'Praktické kontrolné zoznamy o pravidlách kúpy, daniach a miestnych povinnostiach v rôznych krajinách.',
          searchPlaceholder: 'Hľadať právne témy, napr. daň, notár, registrácia',
          emptyTitle: 'Nenašiel sa žiadny právny sprievodca',
          emptyDescription: 'Skúste iný výraz pre daň alebo požiadavku, ktorú hľadáte.',
          cards: [
            {
              title: 'Vstupné náklady a dane',
              description: 'Vysvetľuje dane pri kúpe, notárske poplatky a registračné náklady v cieľových krajinách.',
              metric: 'Kontrolný zoznam podľa krajiny',
              actionLabel: 'Prejsť na kontakt',
            },
            {
              title: 'Povinnosti vlastníka',
              description: 'Zhrňuje registračné, nájomné a oznamovacie povinnosti vlastníkov.',
              metric: 'Pohľad pre rezidentov aj nerezidentov',
              actionLabel: 'Prejsť na nehnuteľnosti',
            },
            {
              title: 'Mapa úverovej dokumentácie',
              description: 'Načrtáva požadované dokumenty, logiku scoringu a miestne formality financovania.',
              metric: 'Cesta dokumentov',
              actionLabel: 'Prejsť na banky',
            },
          ],
        },
        investorZone: {
          label: 'Investorská zóna',
          title: 'Investorská zóna',
          description: 'Pripravené pohľady na ROI, riziko krajiny, stratégiu vstupu kapitálu a načasovanie trhu.',
          searchPlaceholder: 'Hľadať investorské témy, napr. ROI, výnos, riziko',
          emptyTitle: 'Nenašli sa žiadne investorské scenáre',
          emptyDescription: 'Rozšírte vyhľadávanie alebo vyberte inú sekciu.',
          cards: [
            {
              title: 'Mapa ROI',
              description: 'Odhaduje potenciál výnosu pre viacero typov nehnuteľností a profilov trhu.',
              metric: 'ROI a výnos spolu',
              actionLabel: 'Prejsť na nehnuteľnosti',
            },
            {
              title: 'Skóre rizika krajiny',
              description: 'Spája volatilitu mien, náklady financovania a regulačnú zložitosť do jedného pohľadu.',
              metric: 'Investorské skóre rizika',
              actionLabel: 'Prejsť na meny',
            },
            {
              title: 'Scenáre vstupu kapitálu',
              description: 'Pomáha rozhodnúť sa medzi hotovosťou, dlhom a kombinovanými stratégiami financovania.',
              metric: '3 modely financovania',
              actionLabel: 'Prejsť na banky',
            },
          ],
        },
      },
    },
    errors: {
      notFoundBadge: 'Chyba 404',
      notFoundTitle: 'Túto stránku sa nepodarilo nájsť',
      notFoundDescription:
        'Adresa môže byť zastaraná alebo zadaná nesprávne. Vráťte sa na domovskú stránku alebo prejdite priamo na najdôležitejšie moduly platformy.',
      serverErrorBadge: 'Chyba 500',
      serverErrorTitle: 'Na našej strane sa vyskytol problém',
      serverErrorDescription:
        'Toto zobrazenie sa nepodarilo správne pripraviť. Skúste to znova o chvíľu alebo nás kontaktujte, ak problém pretrváva.',
      homeAction: 'Späť na domovskú stránku',
      contactAction: 'Prejsť na kontakt',
      banksAction: 'Zobraziť ponuky úverov',
      currenciesAction: 'Skontrolovať výmenné kurzy',
    },
    legal: {
      disclaimerTitle: 'Právne upozornenie',
      currencyInformationalDisclaimer:
        'Výmenné kurzy pre trh {country} sú poskytované len na informačné účely. Predvolené zobrazenie ukazuje priemer založený na viacerých bezplatných zdrojoch.',
      countryNoticePending:
        'Podrobné regulačné upozornenia pre túto krajinu sa zverejňujú postupne a budú doplnené pred úplným spustením produkcie.',
    },
  },
  'ready',
);
