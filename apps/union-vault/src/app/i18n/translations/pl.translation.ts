import { defineTranslationResource } from '../i18n.types';

export default defineTranslationResource(
  'pl',
  {
    languageSwitcher: {
      ariaLabel: 'Wybierz język',
      menuTitle: 'Wybierz język (24 języki UE)',
      selectedTooltip: 'Wybrany język: {language}',
    },
    header: {
      brandAriaLabel: 'UnionVault.eu — strona główna',
      navigationAriaLabel: 'Nawigacja główna',
      mobileMenuAriaLabel: 'Otwórz menu nawigacji',
      mobileCountryLabel: 'Aktualny kraj',
      navContact: 'Kontakt',
      navBanks: 'Oferty kredytowe',
      navCurrencies: 'Kursy walut',
      navRealEstate: 'Nieruchomości',
      navDiscover: 'Nowe działy',
    },
    footer: {
      rightsReserved: 'Wszelkie prawa zastrzeżone.',
      lastUpdatedLabel: 'Ostatnia aktualizacja',
    },
    home: {
      heroSubtitle: 'Twoje zaufane centrum danych finansowych UE',
      heroDescription:
        'Paneuropejska platforma agregująca dane finansowe z 27 krajów Unii Europejskiej. Porównuj oferty kredytowe, śledź kursy walut i analizuj ceny nieruchomości — wszystko w jednym miejscu.',
      currentCountryLabel: 'Aktualny kraj',
      modulesTitle: 'Moduły platformy',
      modules: {
        statusAvailable: 'Dostępne',
        banksTitle: 'Oferty kredytowe',
        banksDescription: 'Porównanie kredytów hipotecznych, konsumpcyjnych i firmowych z banków w 27 krajach UE.',
        banksAction: 'Porównaj oferty',
        currenciesTitle: 'Kursy walut',
        currenciesDescription: 'Aktualne kursy wymiany walut europejskich, aktualizowane 4 razy dziennie.',
        currenciesAction: 'Zobacz kursy',
        realEstateTitle: 'Ceny nieruchomości',
        realEstateDescription: 'Mieszkania, domy i grunty z 27 krajów UE wizualizowane na mapach Google.',
        realEstateAction: 'Przeglądaj nieruchomości',
      },
      features: {
        languages: '24 języki UE',
        countries: '27 krajów',
        cadence: 'Aktualizacja 4×/dzień',
        compliance: 'GDPR / PSD2 / MiFID II',
        maps: 'Google Maps',
        sources: 'Dane z oficjalnych źródeł',
      },
      info: {
        complianceTitle: 'Zgodność regulacyjna',
        complianceDescription:
          'GDPR, PSD2, MiFID II, DAC7 i AI Act — rozwój produktu jest planowany pod pełną zgodność z regulacjami UE.',
        sourcesTitle: 'Zaufane źródła danych',
        sourcesDescription: 'Dane pochodzą z banków centralnych, EBA, ESMA, EUR-Lex i ECB.',
        aiTitle: 'Budowana przez AI',
        aiDescription: 'Projekt realizowany przez zespół agentów AI i inżynierię wspieraną automatyzacją.',
      },
      exploreTitle: 'Nowe działy i wyszukiwarki',
      exploreDescription:
        'Dodaliśmy 6 nowych sekcji, które pomagają szybciej znaleźć kierunek inwestycji, kraj i najlepszy scenariusz działania.',
    },
    discover: {
      badge: 'Nowość',
      title: 'Centrum nowych działów UnionVault',
      description:
        'Przeglądaj kalkulatory, alerty, rankingi, porównywarki, przewodniki prawne i strefę inwestora. Każdy dział ma własną mini-wyszukiwarkę i zestaw gotowych scenariuszy.',
      searchLabel: 'Szukaj w aktywnej zakładce',
      stats: {
        tools: '18 scenariuszy i narzędzi',
        countries: '27 krajów UE',
        datasets: 'Wspólne dane dla banków, walut i nieruchomości',
      },
      tabs: {
        calculators: {
          label: 'Kalkulatory',
          title: 'Kalkulatory decyzji finansowych',
          description: 'Szybkie narzędzia do liczenia rat, kosztów zakupu i opłacalności inwestycji w różnych krajach.',
          searchPlaceholder: 'Szukaj kalkulatora, np. rata, ROI, koszt zakupu',
          emptyTitle: 'Brak kalkulatorów dla tego zapytania',
          emptyDescription: 'Spróbuj krótszej frazy lub przejdź do innej zakładki.',
          cards: [
            {
              title: 'Kalkulator raty kredytu',
              description: 'Porównuje ratę w zależności od kraju, wkładu własnego i stopy oprocentowania.',
              metric: 'Scenariusze 10, 20 i 30 lat',
              actionLabel: 'Przejdź do banków',
            },
            {
              title: 'Kalkulator kosztu zakupu nieruchomości',
              description: 'Szacuje notariusza, podatki, opłaty lokalne i koszt wejścia dla wybranego kraju.',
              metric: 'Uwzględnia koszty transakcyjne',
              actionLabel: 'Przejdź do nieruchomości',
            },
            {
              title: 'Kalkulator walutowy',
              description: 'Liczy przewalutowanie, spread i zmianę kosztu raty przy różnych kursach.',
              metric: 'Wiele feedów kursowych',
              actionLabel: 'Przejdź do walut',
            },
          ],
        },
        alerts: {
          label: 'Alerty',
          title: 'Alerty i automatyczne powiadomienia',
          description:
            'Scenariusze dla użytkowników, którzy chcą reagować na zmianę kursu, oferty bankowej albo ceny nieruchomości.',
          searchPlaceholder: 'Szukaj alertu, np. kurs, cena, oferta',
          emptyTitle: 'Brak alertów pasujących do filtra',
          emptyDescription: 'Usuń część słów kluczowych i spróbuj ponownie.',
          cards: [
            {
              title: 'Alert kursu waluty',
              description: 'Wysyła sygnał, gdy kurs wybranej pary osiągnie wskazany próg.',
              metric: 'Progi górne i dolne',
              actionLabel: 'Przejdź do walut',
            },
            {
              title: 'Alert nowej oferty kredytowej',
              description: 'Wyłapuje nowe lub poprawione oferty w wybranym kraju i segmencie kredytu.',
              metric: 'Filtry po kraju i produkcie',
              actionLabel: 'Przejdź do banków',
            },
            {
              title: 'Alert spadku ceny nieruchomości',
              description: 'Monitoruje listingi i podpowiada, kiedy pojawia się okazja inwestycyjna.',
              metric: 'Sygnały dla wybranych miast',
              actionLabel: 'Przejdź do nieruchomości',
            },
          ],
        },
        rankings: {
          label: 'Rankingi',
          title: 'Rankingi krajów i miast',
          description: 'Porządkuj kraje według dostępności kredytu, potencjału inwestycyjnego i kosztu życia.',
          searchPlaceholder: 'Szukaj rankingu, np. kraj, miasto, inwestycja',
          emptyTitle: 'Brak rankingów dla tego zapytania',
          emptyDescription: 'Wróć do ogólnego widoku, aby zobaczyć pełne zestawienie.',
          cards: [
            {
              title: 'Ranking dostępności kredytu',
              description: 'Łączy RRSO, wymagany wkład i czas decyzji w jeden czytelny scoring kraju.',
              metric: 'Scoring per kraj',
              actionLabel: 'Przejdź do banków',
            },
            {
              title: 'Ranking miast inwestycyjnych',
              description: 'Zestawia popyt, cenę wejścia i potencjalną stopę zwrotu z najmu.',
              metric: 'Top lokalizacje UE',
              actionLabel: 'Przejdź do nieruchomości',
            },
            {
              title: 'Ranking stabilności walutowej',
              description: 'Pokazuje, gdzie spread i zmienność kursów są najniższe dla inwestora.',
              metric: 'Miernik zmienności 30D',
              actionLabel: 'Przejdź do walut',
            },
          ],
        },
        comparators: {
          label: 'Porównywarki',
          title: 'Porównywarki scenariuszy',
          description:
            'Zestawiaj kraj z krajem, bank z bankiem lub miasto z miastem bez ręcznego przepisywania danych.',
          searchPlaceholder: 'Szukaj porównywarki, np. bank vs bank, kraj vs kraj',
          emptyTitle: 'Brak porównań dla tej frazy',
          emptyDescription: 'Zmień zapytanie albo wybierz inną zakładkę.',
          cards: [
            {
              title: 'Kraj vs kraj',
              description: 'Porównuje koszty wejścia, kredyt i kurs walut dla dwóch wybranych państw.',
              metric: 'Widok side-by-side',
              actionLabel: 'Przejdź do strony głównej',
            },
            {
              title: 'Bank vs bank',
              description: 'Pokazuje różnice w RRSO, ratach i wymaganiach formalnych.',
              metric: 'Kluczowe KPI na jednej osi',
              actionLabel: 'Przejdź do banków',
            },
            {
              title: 'Miasto vs miasto',
              description: 'Zestawia ceny nieruchomości, rentowność i tempo zmian cen.',
              metric: 'Analiza lokalnych rynków',
              actionLabel: 'Przejdź do nieruchomości',
            },
          ],
        },
        lawsTaxes: {
          label: 'Przepisy i podatki',
          title: 'Przewodnik po przepisach i podatkach',
          description:
            'Praktyczne checklisty dla zakupu nieruchomości, kredytów i obowiązków lokalnych w różnych krajach.',
          searchPlaceholder: 'Szukaj przepisu lub podatku, np. PCC, notariusz, meldunek',
          emptyTitle: 'Nie znaleźliśmy przewodnika',
          emptyDescription: 'Sprawdź inną nazwę podatku albo obowiązku.',
          cards: [
            {
              title: 'Koszty wejścia i podatki',
              description: 'Opisuje podatki od zakupu, opłaty notarialne i koszty rejestracji.',
              metric: 'Checklisty kraju docelowego',
              actionLabel: 'Przejdź do kontaktu',
            },
            {
              title: 'Obowiązki właściciela',
              description: 'Podsumowuje zgłoszenia, meldunek, najem i podstawowe wymogi formalne.',
              metric: 'Wersja dla rezydenta i nierezydenta',
              actionLabel: 'Przejdź do nieruchomości',
            },
            {
              title: 'Formalności kredytowe',
              description: 'Wyjaśnia dokumenty, scoring i lokalne wymagania banków.',
              metric: 'Mapa dokumentów',
              actionLabel: 'Przejdź do banków',
            },
          ],
        },
        investorZone: {
          label: 'Strefa inwestora',
          title: 'Strefa inwestora',
          description: 'Zestaw gotowych pomysłów do analizy ROI, ryzyka kraju i płynności inwestycji.',
          searchPlaceholder: 'Szukaj tematu inwestycyjnego, np. ROI, yield, ryzyko',
          emptyTitle: 'Brak scenariuszy inwestycyjnych',
          emptyDescription: 'Rozszerz wyszukiwanie lub wybierz inny obszar danych.',
          cards: [
            {
              title: 'Mapa ROI',
              description: 'Szacuje potencjalną stopę zwrotu dla różnych rynków i typów nieruchomości.',
              metric: 'ROI i yield na jednej karcie',
              actionLabel: 'Przejdź do nieruchomości',
            },
            {
              title: 'Ocena ryzyka kraju',
              description: 'Łączy zmienność walutową, koszty finansowania i otoczenie regulacyjne.',
              metric: 'Scoring ryzyka inwestora',
              actionLabel: 'Przejdź do walut',
            },
            {
              title: 'Scenariusze wejścia kapitału',
              description: 'Pomaga wybrać między gotówką, kredytem i strategią mieszaną.',
              metric: '3 modele finansowania',
              actionLabel: 'Przejdź do banków',
            },
          ],
        },
      },
    },
    errors: {
      notFoundBadge: 'Błąd 404',
      notFoundTitle: 'Nie znaleźliśmy tej strony',
      notFoundDescription:
        'Adres może być nieaktualny albo wpisany z błędem. Wróć do strony głównej lub przejdź do najważniejszych modułów platformy.',
      serverErrorBadge: 'Błąd 500',
      serverErrorTitle: 'Wystąpił problem po naszej stronie',
      serverErrorDescription:
        'Nie udało się poprawnie przygotować widoku. Spróbuj ponownie za chwilę albo skontaktuj się z nami, jeśli problem się powtarza.',
      homeAction: 'Wróć na stronę główną',
      contactAction: 'Przejdź do kontaktu',
      banksAction: 'Zobacz oferty kredytowe',
      currenciesAction: 'Sprawdź kursy walut',
    },
    legal: {
      disclaimerTitle: 'Informacja prawna',
      currencyInformationalDisclaimer:
        'Kursy dla rynku {country} mają charakter informacyjny. Domyślny widok pokazuje średnią z kilku darmowych feedów.',
      countryNoticePending:
        'Szczegółowe zastrzeżenia regulacyjne dla tego kraju są publikowane etapami i zostaną uzupełnione przed pełnym uruchomieniem produkcyjnym.',
    },
  },
  'ready',
);
