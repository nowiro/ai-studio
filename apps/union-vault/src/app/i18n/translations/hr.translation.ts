import { defineTranslationResource } from '../i18n.types';

export default defineTranslationResource(
  'hr',
  {
    languageSwitcher: {
      ariaLabel: 'Odaberite jezik',
      menuTitle: 'Odaberite jezik (24 jezika EU-a)',
      selectedTooltip: 'Odabrani jezik: {language}',
    },
    header: {
      brandAriaLabel: 'UnionVault.eu — početna stranica',
      navigationAriaLabel: 'Glavna navigacija',
      mobileMenuAriaLabel: 'Otvori navigacijski izbornik',
      mobileCountryLabel: 'Trenutačna država',
      navContact: 'Kontakt',
      navBanks: 'Kreditne ponude',
      navCurrencies: 'Tečajevi valuta',
      navRealEstate: 'Nekretnine',
      navDiscover: 'Novi odjeljci',
    },
    footer: {
      rightsReserved: 'Sva prava pridržana.',
      lastUpdatedLabel: 'Zadnje ažuriranje',
    },
    home: {
      heroSubtitle: 'Vaš pouzdani izvor financijskih podataka EU-a',
      heroDescription:
        'Paneuropska platforma koja objedinjuje financijske podatke iz 27 država Europske unije. Usporedite kreditne ponude, pratite tečajeve valuta i analizirajte cijene nekretnina — sve na jednom mjestu.',
      currentCountryLabel: 'Trenutačna država',
      modulesTitle: 'Moduli platforme',
      modules: {
        statusAvailable: 'Dostupno',
        banksTitle: 'Kreditne ponude',
        banksDescription: 'Usporedite stambene, potrošačke i poslovne kredite banaka iz 27 država EU-a.',
        banksAction: 'Usporedi ponude',
        currenciesTitle: 'Tečajevi valuta',
        currenciesDescription: 'Aktualni europski tečajevi valuta, ažurirani 4 puta dnevno.',
        currenciesAction: 'Pogledaj tečajeve',
        realEstateTitle: 'Cijene nekretnina',
        realEstateDescription: 'Stanovi, kuće i zemljišta iz 27 država EU-a prikazani na Google kartama.',
        realEstateAction: 'Pregledaj nekretnine',
      },
      features: {
        languages: '24 jezika EU-a',
        countries: '27 država',
        cadence: 'Ažuriranje 4× dnevno',
        compliance: 'GDPR / PSD2 / MiFID II',
        maps: 'Google Maps',
        sources: 'Podaci iz službenih izvora',
      },
      info: {
        complianceTitle: 'Usklađenost s propisima',
        complianceDescription:
          'GDPR, PSD2, MiFID II, DAC7 i AI Act — razvoj proizvoda usklađen je sa zahtjevima regulatornog okvira EU-a.',
        sourcesTitle: 'Pouzdani izvori podataka',
        sourcesDescription: 'Podaci dolaze od središnjih banaka, EBA-e, ESMA-e, EUR-Lexa i ECB-a.',
        aiTitle: 'Izgrađeno uz podršku AI-ja',
        aiDescription: 'Proizvod se razvija kroz inženjerski proces uz podršku umjetne inteligencije.',
      },
      exploreTitle: 'Novi odjeljci i alati za pretraživanje',
      exploreDescription:
        'Dodali smo 6 novih odjeljaka kako bismo korisnicima pomogli da brže otkriju bolje scenarije, države i investicijske smjerove.',
    },
    discover: {
      badge: 'Novo',
      title: 'Središte novih odjeljaka UnionVaulta',
      description:
        'Istražite kalkulatore, upozorenja, rang-liste, usporednike, pravne vodiče i alate za investitore. Svaki odjeljak uključuje fokusirano mini-pretraživanje i gotove scenarije.',
      searchLabel: 'Pretraži unutar aktivne kartice',
      stats: {
        tools: '18 scenarija i alata',
        countries: '27 država EU-a',
        datasets: 'Zajednički podaci za bankarstvo, valute i nekretnine',
      },
      tabs: {
        calculators: {
          label: 'Kalkulatori',
          title: 'Kalkulatori za financijske odluke',
          description: 'Brzi alati za procjenu rata kredita, troškova kupnje i povrata ulaganja u različitim državama.',
          searchPlaceholder: 'Pretraži kalkulatore, npr. hipoteka, ROI, trošak kupnje',
          emptyTitle: 'Nijedan kalkulator ne odgovara ovom pretraživanju',
          emptyDescription: 'Pokušajte s kraćim pojmom ili prijeđite na drugu karticu.',
          cards: [
            {
              title: 'Kalkulator rate stambenog kredita',
              description: 'Uspoređuje mjesečne rate prema državi, visini učešća i pretpostavkama kamatne stope.',
              metric: 'Scenariji za 10, 20 i 30 godina',
              actionLabel: 'Otvori banke',
            },
            {
              title: 'Kalkulator troška kupnje nekretnine',
              description:
                'Procjenjuje javnobilježničke naknade, poreze, lokalne pristojbe i ukupni ulazni trošak za odabranu državu.',
              metric: 'Uključeni transakcijski troškovi',
              actionLabel: 'Otvori nekretnine',
            },
            {
              title: 'Kalkulator valutnog učinka',
              description:
                'Izračunava konverziju valuta, spread i osjetljivost plaćanja kroz različite scenarije tečaja.',
              metric: 'Prikaz valuta iz više izvora',
              actionLabel: 'Otvori valute',
            },
          ],
        },
        alerts: {
          label: 'Upozorenja',
          title: 'Upozorenja i proaktivni signali',
          description:
            'Scenariji za korisnike koji žele reagirati na promjene tečaja, nove kreditne ponude ili pad cijena nekretnina.',
          searchPlaceholder: 'Pretraži upozorenja, npr. tečaj, nekretnina, ponuda',
          emptyTitle: 'Nijedno upozorenje ne odgovara ovom filtru',
          emptyDescription: 'Uklonite dio pojma za pretraživanje i pokušajte ponovno.',
          cards: [
            {
              title: 'Upozorenje na tečaj valute',
              description: 'Aktivira se kada odabrani valutni par dosegne gornji ili donji prag koji ste postavili.',
              metric: 'Gornji i donji ciljevi',
              actionLabel: 'Otvori valute',
            },
            {
              title: 'Upozorenje na novu kreditnu ponudu',
              description: 'Prati nove ili poboljšane bankovne ponude za odabranu državu i vrstu proizvoda.',
              metric: 'Filtri po državi i proizvodu',
              actionLabel: 'Otvori banke',
            },
            {
              title: 'Upozorenje na pad cijene nekretnine',
              description: 'Ističe oglase koji ulaze u zonu prilike za investitore.',
              metric: 'Signali za odabrane gradove',
              actionLabel: 'Otvori nekretnine',
            },
          ],
        },
        rankings: {
          label: 'Rang-liste',
          title: 'Rang-liste država i gradova',
          description:
            'Poredajte države prema dostupnosti financiranja, investicijskoj privlačnosti i troškovima života.',
          searchPlaceholder: 'Pretraži rang-liste, npr. država, grad, investicija',
          emptyTitle: 'Nije pronađena nijedna rang-lista',
          emptyDescription: 'Vratite se na zadani prikaz kako biste istražili puni skup rang-lista.',
          cards: [
            {
              title: 'Rang-lista dostupnosti financiranja',
              description:
                'Objedinjuje EKS, očekivano učešće i vrijeme donošenja odluke u jedinstveni rezultat za svaku državu.',
              metric: 'Bodovanje na razini države',
              actionLabel: 'Otvori banke',
            },
            {
              title: 'Rang-lista investicijskih gradova',
              description: 'Uspoređuje potražnju, ulaznu cijenu i potencijal prinosa od najma na gradskim tržištima.',
              metric: 'Najbolje lokacije u EU-u',
              actionLabel: 'Otvori nekretnine',
            },
            {
              title: 'Rang-lista valutne stabilnosti',
              description: 'Pokazuje gdje su spreadovi i volatilnost valuta najniži za planiranje kapitala.',
              metric: 'Prikaz volatilnosti za 30 dana',
              actionLabel: 'Otvori valute',
            },
          ],
        },
        comparators: {
          label: 'Usporednici',
          title: 'Usporednici scenarija',
          description: 'Usporedite državu s državom, banku s bankom ili grad s gradom bez ručnog rada u tablicama.',
          searchPlaceholder: 'Pretraži usporednike, npr. banka vs banka, država vs država',
          emptyTitle: 'Nijedan usporednik nije pronađen',
          emptyDescription: 'Pokušajte s drugim izrazom ili istražite drugu karticu.',
          cards: [
            {
              title: 'Država vs država',
              description: 'Uspoređuje ulazne troškove, financiranje i valutnu izloženost za dva odabrana tržišta.',
              metric: 'Prikaz jedan uz drugi',
              actionLabel: 'Otvori početnu',
            },
            {
              title: 'Banka vs banka',
              description: 'Ističe razlike u EKS-u, mjesečnoj rati i dokumentaciji u jednom prikazu.',
              metric: 'Ključni KPI-jevi usklađeni',
              actionLabel: 'Otvori banke',
            },
            {
              title: 'Grad vs grad',
              description: 'Uspoređuje cijene nekretnina, prinos od najma i potencijal rasta na urbanim tržištima.',
              metric: 'Analiza lokalnog tržišta',
              actionLabel: 'Otvori nekretnine',
            },
          ],
        },
        lawsTaxes: {
          label: 'Zakoni i porezi',
          title: 'Vodič kroz zakone i poreze',
          description:
            'Praktični kontrolni popisi koji obuhvaćaju pravila kupnje, poreze i lokalne obveze u različitim državama.',
          searchPlaceholder: 'Pretraži pravne teme, npr. porez, bilježnik, registracija',
          emptyTitle: 'Nije pronađen nijedan pravni vodič',
          emptyDescription: 'Pokušajte s drugim pojmom za porez ili obvezu koja vam je potrebna.',
          cards: [
            {
              title: 'Ulazni troškovi i porezi',
              description:
                'Objašnjava poreze na kupnju, javnobilježničke naknade i troškove registracije za ciljane države.',
              metric: 'Kontrolni popis po državi',
              actionLabel: 'Otvori kontakt',
            },
            {
              title: 'Obveze vlasnika',
              description: 'Sažima obveze registracije, najma i izvještavanja za vlasnike nekretnina.',
              metric: 'Prikaz za rezidente i nerezidente',
              actionLabel: 'Otvori nekretnine',
            },
            {
              title: 'Karta kreditne dokumentacije',
              description: 'Prikazuje potrebne dokumente, logiku bodovanja i lokalne formalnosti financiranja.',
              metric: 'Putanja kroz dokumente',
              actionLabel: 'Otvori banke',
            },
          ],
        },
        investorZone: {
          label: 'Zona za investitore',
          title: 'Zona za investitore',
          description: 'Gotovi prikazi za ROI, rizik države, strategiju ulaska kapitala i pravodobnost tržišta.',
          searchPlaceholder: 'Pretraži teme za investitore, npr. ROI, prinos, rizik',
          emptyTitle: 'Nije pronađen nijedan investicijski scenarij',
          emptyDescription: 'Proširite pretraživanje ili odaberite drugi odjeljak.',
          cards: [
            {
              title: 'ROI toplinska karta',
              description: 'Procjenjuje potencijal povrata za više vrsta nekretnina i tržišnih profila.',
              metric: 'ROI i prinos zajedno',
              actionLabel: 'Otvori nekretnine',
            },
            {
              title: 'Ocjena rizika države',
              description:
                'Objedinjuje valutnu volatilnost, trošak financiranja i regulatornu složenost u jedan prikaz.',
              metric: 'Ocjena rizika za investitore',
              actionLabel: 'Otvori valute',
            },
            {
              title: 'Scenariji ulaska kapitala',
              description: 'Pomaže pri odabiru između gotovine, duga i kombiniranih strategija financiranja.',
              metric: '3 modela financiranja',
              actionLabel: 'Otvori banke',
            },
          ],
        },
      },
    },
    errors: {
      notFoundBadge: 'Pogreška 404',
      notFoundTitle: 'Nismo mogli pronaći ovu stranicu',
      notFoundDescription:
        'Adresa je možda zastarjela ili pogrešno upisana. Vratite se na početnu stranicu ili prijeđite izravno na najvažnije module platforme.',
      serverErrorBadge: 'Pogreška 500',
      serverErrorTitle: 'Došlo je do problema na našoj strani',
      serverErrorDescription:
        'Nismo mogli ispravno pripremiti ovaj prikaz. Pokušajte ponovno uskoro ili nas kontaktirajte ako se problem nastavi.',
      homeAction: 'Natrag na početnu stranicu',
      contactAction: 'Idi na kontakt',
      banksAction: 'Pogledaj kreditne ponude',
      currenciesAction: 'Provjeri tečajeve valuta',
    },
    legal: {
      disclaimerTitle: 'Pravna napomena',
      currencyInformationalDisclaimer:
        'Tečajevi za tržište {country} služe isključivo u informativne svrhe. Zadani prikaz pokazuje prosjek temeljen na nekoliko besplatnih izvora podataka.',
      countryNoticePending:
        'Detaljne regulatorne napomene za ovu državu objavljuju se postupno i bit će dovršene prije punog produkcijskog lansiranja.',
    },
  },
  'ready',
);
