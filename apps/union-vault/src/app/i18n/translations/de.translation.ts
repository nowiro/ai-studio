import { defineTranslationResource } from '../i18n.types';

export default defineTranslationResource(
  'de',
  {
    languageSwitcher: {
      ariaLabel: 'Sprache auswählen',
      menuTitle: 'Sprache auswählen (24 EU-Sprachen)',
      selectedTooltip: 'Ausgewählte Sprache: {language}',
    },
    header: {
      brandAriaLabel: 'UnionVault.eu — Startseite',
      navigationAriaLabel: 'Hauptnavigation',
      mobileMenuAriaLabel: 'Navigationsmenü öffnen',
      mobileCountryLabel: 'Aktuelles Land',
      navContact: 'Kontakt',
      navBanks: 'Kreditangebote',
      navCurrencies: 'Wechselkurse',
      navRealEstate: 'Immobilien',
      navDiscover: 'Neue Bereiche',
    },
    footer: {
      rightsReserved: 'Alle Rechte vorbehalten.',
      lastUpdatedLabel: 'Zuletzt aktualisiert',
    },
    home: {
      heroSubtitle: 'Ihr vertrauenswürdiger Tresor für EU-Finanzdaten',
      heroDescription:
        'Eine paneuropäische Plattform mit Finanzdaten aus 27 Ländern der Europäischen Union. Vergleichen Sie Kreditangebote, verfolgen Sie Wechselkurse und analysieren Sie Immobilienpreise an einem Ort.',
      currentCountryLabel: 'Aktuelles Land',
      modulesTitle: 'Plattformmodule',
      modules: {
        statusAvailable: 'Verfügbar',
        banksTitle: 'Kreditangebote',
        banksDescription: 'Vergleichen Sie Hypotheken-, Konsumenten- und Firmenkredite von Banken in 27 EU-Ländern.',
        banksAction: 'Angebote vergleichen',
        currenciesTitle: 'Wechselkurse',
        currenciesDescription: 'Aktuelle europäische Wechselkurse, viermal täglich aktualisiert.',
        currenciesAction: 'Kurse ansehen',
        realEstateTitle: 'Immobilienpreise',
        realEstateDescription: 'Wohnungen, Häuser und Grundstücke aus 27 EU-Ländern auf Google Maps.',
        realEstateAction: 'Immobilien ansehen',
      },
      features: {
        languages: '24 EU-Sprachen',
        countries: '27 Länder',
        cadence: '4× täglich aktualisiert',
        compliance: 'GDPR / PSD2 / MiFID II',
        maps: 'Google Maps',
        sources: 'Offizielle Datenquellen',
      },
      info: {
        complianceTitle: 'Regulatorische Konformität',
        complianceDescription:
          'GDPR, PSD2, MiFID II, DAC7 und AI Act — die Produktentwicklung wird auf vollständige EU-Konformität ausgerichtet.',
        sourcesTitle: 'Vertrauenswürdige Datenquellen',
        sourcesDescription: 'Die Daten stammen von Zentralbanken, EBA, ESMA, EUR-Lex und der EZB.',
        aiTitle: 'Mit KI-Unterstützung entwickelt',
        aiDescription: 'Das Produkt wird in einem KI-gestützten Engineering-Workflow umgesetzt.',
      },
      exploreTitle: 'Neue Bereiche und Suchfunktionen',
      exploreDescription:
        'Wir haben 6 neue Bereiche ergänzt, die bei der Suche nach besseren Szenarien, Ländern und Investitionsrichtungen helfen.',
    },
    discover: {
      badge: 'Neu',
      title: 'UnionVault Hub für neue Bereiche',
      description:
        'Entdecken Sie Rechner, Alerts, Rankings, Vergleiche, Rechtsleitfäden und Investor-Tools. Jeder Bereich besitzt eine fokussierte Mini-Suche und fertige Szenarien.',
      searchLabel: 'In der aktiven Registerkarte suchen',
      stats: {
        tools: '18 Szenarien und Werkzeuge',
        countries: '27 EU-Länder',
        datasets: 'Gemeinsame Daten für Banken, Währungen und Immobilien',
      },
      tabs: {
        calculators: {
          label: 'Rechner',
          title: 'Rechner für Finanzentscheidungen',
          description: 'Schnelle Werkzeuge für Raten, Erwerbskosten und Renditeschätzungen in verschiedenen Ländern.',
          searchPlaceholder: 'Rechner suchen, z. B. Rate, ROI, Kaufkosten',
          emptyTitle: 'Keine Rechner für diese Suche',
          emptyDescription: 'Versuchen Sie eine kürzere Phrase oder eine andere Registerkarte.',
          cards: [
            {
              title: 'Kreditraten-Rechner',
              description: 'Vergleicht Monatsraten nach Land, Eigenkapitalquote und Zinsszenario.',
              metric: 'Szenarien für 10, 20 und 30 Jahre',
              actionLabel: 'Zu Banken',
            },
            {
              title: 'Kaufkosten-Rechner',
              description: 'Schätzt Notar, Steuern, lokale Gebühren und Gesamteintrittskosten pro Land.',
              metric: 'Transaktionskosten enthalten',
              actionLabel: 'Zu Immobilien',
            },
            {
              title: 'Währungsrechner',
              description: 'Berechnet Umtausch, Spread und die Wirkung von Wechselkursen auf Zahlungen.',
              metric: 'Mehrere Kursquellen',
              actionLabel: 'Zu Währungen',
            },
          ],
        },
        alerts: {
          label: 'Alerts',
          title: 'Alerts und proaktive Signale',
          description:
            'Szenarien für Nutzer, die auf Kursänderungen, neue Kreditangebote oder Preisrückgänge reagieren wollen.',
          searchPlaceholder: 'Alerts suchen, z. B. Kurs, Preis, Angebot',
          emptyTitle: 'Keine passenden Alerts',
          emptyDescription: 'Entfernen Sie einen Teil des Suchbegriffs und versuchen Sie es erneut.',
          cards: [
            {
              title: 'Wechselkurs-Alert',
              description: 'Löst aus, wenn ein Währungspaar den oberen oder unteren Zielwert erreicht.',
              metric: 'Obere und untere Schwellen',
              actionLabel: 'Zu Währungen',
            },
            {
              title: 'Alert für neue Kreditangebote',
              description: 'Beobachtet neue oder verbesserte Angebote nach Land und Produkttyp.',
              metric: 'Filter nach Land und Produkt',
              actionLabel: 'Zu Banken',
            },
            {
              title: 'Preisrückgangs-Alert',
              description: 'Hebt Immobilien hervor, die in eine attraktive Investitionszone fallen.',
              metric: 'Signale für ausgewählte Städte',
              actionLabel: 'Zu Immobilien',
            },
          ],
        },
        rankings: {
          label: 'Rankings',
          title: 'Rankings für Länder und Städte',
          description: 'Sortieren Sie Länder nach Finanzierungszugang, Investitionspotenzial und Lebenshaltungskosten.',
          searchPlaceholder: 'Ranking suchen, z. B. Land, Stadt, Investition',
          emptyTitle: 'Keine Rankings gefunden',
          emptyDescription: 'Kehren Sie zur Standardansicht zurück, um das gesamte Ranking zu sehen.',
          cards: [
            {
              title: 'Ranking der Kreditverfügbarkeit',
              description:
                'Verbindet Effektivzins, Eigenkapitalanforderung und Entscheidungszeit zu einem Länderscore.',
              metric: 'Länderscoring',
              actionLabel: 'Zu Banken',
            },
            {
              title: 'Ranking der Investitionsstädte',
              description: 'Vergleicht Nachfrage, Einstiegspreis und Mietrenditepotenzial für Städte.',
              metric: 'Top-Standorte in der EU',
              actionLabel: 'Zu Immobilien',
            },
            {
              title: 'Ranking der Währungsstabilität',
              description: 'Zeigt, wo Spreads und Volatilität für die Kapitalplanung am niedrigsten sind.',
              metric: '30-Tage-Volatilität',
              actionLabel: 'Zu Währungen',
            },
          ],
        },
        comparators: {
          label: 'Vergleiche',
          title: 'Vergleiche von Szenarien',
          description:
            'Vergleichen Sie Land mit Land, Bank mit Bank oder Stadt mit Stadt ohne manuelle Tabellenarbeit.',
          searchPlaceholder: 'Vergleich suchen, z. B. Bank vs Bank, Land vs Land',
          emptyTitle: 'Keine Vergleiche gefunden',
          emptyDescription: 'Versuchen Sie eine andere Suchphrase oder einen anderen Bereich.',
          cards: [
            {
              title: 'Land vs Land',
              description: 'Vergleicht Einstiegskosten, Finanzierung und Währungsrisiko für zwei Märkte.',
              metric: 'Seiten-an-Seite-Ansicht',
              actionLabel: 'Zur Startseite',
            },
            {
              title: 'Bank vs Bank',
              description: 'Hebt Unterschiede bei Effektivzins, Rate und Unterlagen in einer Ansicht hervor.',
              metric: 'Wichtige KPIs ausgerichtet',
              actionLabel: 'Zu Banken',
            },
            {
              title: 'Stadt vs Stadt',
              description: 'Vergleicht Immobilienpreise, Mietrendite und Wachstumspotenzial von Städten.',
              metric: 'Analyse lokaler Märkte',
              actionLabel: 'Zu Immobilien',
            },
          ],
        },
        lawsTaxes: {
          label: 'Recht & Steuern',
          title: 'Leitfaden für Recht und Steuern',
          description:
            'Praktische Checklisten für Erwerbsregeln, Steuern und lokale Pflichten in verschiedenen Ländern.',
          searchPlaceholder: 'Rechtsthema suchen, z. B. Steuer, Notar, Anmeldung',
          emptyTitle: 'Kein Rechtsleitfaden gefunden',
          emptyDescription: 'Versuchen Sie einen anderen Begriff für die gesuchte Pflicht oder Steuer.',
          cards: [
            {
              title: 'Eintrittskosten und Steuern',
              description: 'Erklärt Kaufsteuern, Notargebühren und Registrierungskosten je Zielland.',
              metric: 'Länder-Checkliste',
              actionLabel: 'Zu Kontakt',
            },
            {
              title: 'Pflichten des Eigentümers',
              description: 'Fasst Melde-, Vermietungs- und Berichtspflichten für Eigentümer zusammen.',
              metric: 'Ansicht für Residenten und Nicht-Residenten',
              actionLabel: 'Zu Immobilien',
            },
            {
              title: 'Kreditunterlagen-Karte',
              description: 'Skizziert Dokumente, Scoring und lokale Formalitäten der Finanzierung.',
              metric: 'Dokumentenpfad',
              actionLabel: 'Zu Banken',
            },
          ],
        },
        investorZone: {
          label: 'Investor Zone',
          title: 'Investor Zone',
          description: 'Fertige Ansichten für ROI, Länderrisiko, Kapitalstrategie und Market Timing.',
          searchPlaceholder: 'Investorenthema suchen, z. B. ROI, Yield, Risiko',
          emptyTitle: 'Keine Investorenszenarien gefunden',
          emptyDescription: 'Erweitern Sie die Suche oder wechseln Sie den Bereich.',
          cards: [
            {
              title: 'ROI-Heatmap',
              description: 'Schätzt Renditepotenzial für mehrere Immobilientypen und Marktprofile.',
              metric: 'ROI und Yield zusammen',
              actionLabel: 'Zu Immobilien',
            },
            {
              title: 'Länderrisiko-Score',
              description: 'Verbindet Währungsvolatilität, Finanzierungskosten und regulatorische Komplexität.',
              metric: 'Risikowert für Investoren',
              actionLabel: 'Zu Währungen',
            },
            {
              title: 'Kapital-Einstiegsszenarien',
              description: 'Unterstützt die Wahl zwischen Cash, Fremdkapital und Mischstrategie.',
              metric: '3 Finanzierungsmodelle',
              actionLabel: 'Zu Banken',
            },
          ],
        },
      },
    },
    errors: {
      notFoundBadge: 'Fehler 404',
      notFoundTitle: 'Diese Seite wurde nicht gefunden',
      notFoundDescription:
        'Die Adresse ist möglicherweise veraltet oder falsch eingegeben. Kehren Sie zur Startseite zurück oder öffnen Sie direkt die wichtigsten Module der Plattform.',
      serverErrorBadge: 'Fehler 500',
      serverErrorTitle: 'Auf unserer Seite ist ein Problem aufgetreten',
      serverErrorDescription:
        'Diese Ansicht konnte nicht korrekt vorbereitet werden. Bitte versuchen Sie es in Kürze erneut oder kontaktieren Sie uns, wenn das Problem weiterhin besteht.',
      homeAction: 'Zur Startseite',
      contactAction: 'Zum Kontakt',
      banksAction: 'Kreditangebote anzeigen',
      currenciesAction: 'Wechselkurse prüfen',
    },
    legal: {
      disclaimerTitle: 'Rechtlicher Hinweis',
      currencyInformationalDisclaimer:
        'Wechselkurse für den Markt {country} dienen nur zu Informationszwecken. Die Standardansicht zeigt einen Durchschnitt aus mehreren kostenlosen Datenquellen.',
      countryNoticePending:
        'Detaillierte regulatorische Hinweise für dieses Land werden schrittweise veröffentlicht und vor dem vollständigen Produktionsstart ergänzt.',
    },
  },
  'ready',
);
