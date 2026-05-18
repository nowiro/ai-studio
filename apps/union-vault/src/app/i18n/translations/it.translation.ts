import { defineTranslationResource } from '../i18n.types';

export default defineTranslationResource(
  'it',
  {
    languageSwitcher: {
      ariaLabel: 'Scegli lingua',
      menuTitle: 'Scegli lingua (24 lingue UE)',
      selectedTooltip: 'Lingua selezionata: {language}',
    },
    header: {
      brandAriaLabel: 'UnionVault.eu — pagina iniziale',
      navigationAriaLabel: 'Navigazione principale',
      mobileMenuAriaLabel: 'Apri il menu di navigazione',
      mobileCountryLabel: 'Paese attuale',
      navContact: 'Contatti',
      navBanks: 'Offerte di credito',
      navCurrencies: 'Tassi di cambio',
      navRealEstate: 'Immobili',
      navDiscover: 'Nuove sezioni',
    },
    footer: {
      rightsReserved: 'Tutti i diritti riservati.',
      lastUpdatedLabel: 'Ultimo aggiornamento',
    },
    home: {
      heroSubtitle: 'Il tuo hub affidabile dei dati finanziari UE',
      heroDescription:
        'Una piattaforma paneuropea che aggrega dati finanziari da 27 paesi dell’Unione Europea. Confronta offerte di credito, segui i tassi di cambio e analizza i prezzi immobiliari in un unico posto.',
      currentCountryLabel: 'Paese attuale',
      modulesTitle: 'Moduli della piattaforma',
      modules: {
        statusAvailable: 'Disponibile',
        banksTitle: 'Offerte di credito',
        banksDescription: 'Confronta mutui, prestiti al consumo e prestiti aziendali di banche in 27 paesi UE.',
        banksAction: 'Confronta offerte',
        currenciesTitle: 'Tassi di cambio',
        currenciesDescription: 'Tassi di cambio europei aggiornati 4 volte al giorno.',
        currenciesAction: 'Vedi i tassi',
        realEstateTitle: 'Prezzi immobiliari',
        realEstateDescription: 'Appartamenti, case e terreni di 27 paesi UE visualizzati su Google Maps.',
        realEstateAction: 'Sfoglia immobili',
      },
      features: {
        languages: '24 lingue UE',
        countries: '27 paesi',
        cadence: 'Aggiornato 4× al giorno',
        compliance: 'GDPR / PSD2 / MiFID II',
        maps: 'Google Maps',
        sources: 'Dati da fonti ufficiali',
      },
      info: {
        complianceTitle: 'Conformità normativa',
        complianceDescription:
          'GDPR, PSD2, MiFID II, DAC7 e AI Act — lo sviluppo del prodotto segue i requisiti normativi dell’UE.',
        sourcesTitle: 'Fonti dati affidabili',
        sourcesDescription: 'I dati provengono da banche centrali, EBA, ESMA, EUR-Lex e BCE.',
        aiTitle: 'Sviluppato con l’AI',
        aiDescription: 'Il prodotto è realizzato con un workflow di engineering supportato dall’AI.',
      },
      exploreTitle: 'Nuove sezioni e strumenti di ricerca',
      exploreDescription:
        'Abbiamo aggiunto 6 nuove sezioni per aiutare gli utenti a trovare più in fretta scenari, paesi e direzioni di investimento migliori.',
    },
    discover: {
      badge: 'Novità',
      title: 'Hub delle nuove sezioni UnionVault',
      description:
        'Esplora calcolatori, avvisi, classifiche, comparatori, guide legali e strumenti per investitori. Ogni sezione include una mini ricerca mirata e scenari pronti all’uso.',
      searchLabel: 'Cerca nella scheda attiva',
      stats: {
        tools: '18 scenari e strumenti',
        countries: '27 paesi UE',
        datasets: 'Dati condivisi per banche, valute e immobili',
      },
      tabs: {
        calculators: {
          label: 'Calcolatori',
          title: 'Calcolatori per decisioni finanziarie',
          description:
            'Strumenti rapidi per stimare rate, costi di acquisto e rendimenti degli investimenti tra diversi paesi.',
          searchPlaceholder: 'Cerca un calcolatore, es. mutuo, ROI, costo di acquisto',
          emptyTitle: 'Nessun calcolatore corrisponde alla ricerca',
          emptyDescription: 'Prova una frase più breve o passa a un’altra scheda.',
          cards: [
            {
              title: 'Calcolatore rata del mutuo',
              description: 'Confronta la rata mensile in base a paese, anticipo e ipotesi di tasso.',
              metric: 'Scenari a 10, 20 e 30 anni',
              actionLabel: 'Apri banche',
            },
            {
              title: 'Calcolatore costo di acquisto immobile',
              description: 'Stima notaio, imposte, oneri locali e costo totale di ingresso per il paese selezionato.',
              metric: 'Costi di transazione inclusi',
              actionLabel: 'Apri immobili',
            },
            {
              title: 'Calcolatore impatto valutario',
              description: 'Calcola conversione FX, spread e sensibilità dei pagamenti in diversi scenari di cambio.',
              metric: 'Vista valute da più feed',
              actionLabel: 'Apri valute',
            },
          ],
        },
        alerts: {
          label: 'Avvisi',
          title: 'Avvisi e segnali proattivi',
          description:
            'Scenari per utenti che vogliono reagire a cambi di tasso, nuove offerte di credito o ribassi dei prezzi immobiliari.',
          searchPlaceholder: 'Cerca un avviso, es. tasso, immobile, offerta',
          emptyTitle: 'Nessun avviso corrisponde al filtro',
          emptyDescription: 'Rimuovi parte del termine di ricerca e riprova.',
          cards: [
            {
              title: 'Avviso tasso di cambio',
              description:
                'Si attiva quando una coppia valutaria selezionata raggiunge la soglia superiore o inferiore.',
              metric: 'Target superiori e inferiori',
              actionLabel: 'Apri valute',
            },
            {
              title: 'Avviso nuova offerta di credito',
              description:
                'Monitora offerte bancarie nuove o migliorate per il paese e il tipo di prodotto selezionati.',
              metric: 'Filtri per paese e prodotto',
              actionLabel: 'Apri banche',
            },
            {
              title: 'Avviso ribasso prezzo immobile',
              description: 'Evidenzia gli annunci che entrano in una zona di opportunità per gli investitori.',
              metric: 'Segnali per città selezionate',
              actionLabel: 'Apri immobili',
            },
          ],
        },
        rankings: {
          label: 'Classifiche',
          title: 'Classifiche di paesi e città',
          description:
            'Ordina i paesi per accessibilità al credito, attrattività dell’investimento e costo della vita.',
          searchPlaceholder: 'Cerca una classifica, es. paese, città, investimento',
          emptyTitle: 'Nessuna classifica trovata',
          emptyDescription: 'Torna alla vista predefinita per esplorare l’intera classifica.',
          cards: [
            {
              title: 'Classifica accessibilità del credito',
              description: 'Combina TAEG, anticipo richiesto e tempo di decisione in un unico punteggio paese.',
              metric: 'Punteggio a livello paese',
              actionLabel: 'Apri banche',
            },
            {
              title: 'Classifica città per investimento',
              description:
                'Confronta domanda, prezzo di ingresso e potenziale rendimento da locazione nei mercati urbani.',
              metric: 'Top località UE',
              actionLabel: 'Apri immobili',
            },
            {
              title: 'Classifica stabilità valutaria',
              description: 'Mostra dove spread e volatilità FX sono più bassi per la pianificazione del capitale.',
              metric: 'Vista volatilità 30 giorni',
              actionLabel: 'Apri valute',
            },
          ],
        },
        comparators: {
          label: 'Comparatori',
          title: 'Comparatori di scenari',
          description:
            'Confronta paese con paese, banca con banca o città con città senza lavoro manuale in fogli di calcolo.',
          searchPlaceholder: 'Cerca un comparatore, es. banca vs banca, paese vs paese',
          emptyTitle: 'Nessun comparatore trovato',
          emptyDescription: 'Prova un’altra frase o esplora un’altra scheda.',
          cards: [
            {
              title: 'Paese vs paese',
              description:
                'Confronta costi di ingresso, finanziamento ed esposizione valutaria per due mercati selezionati.',
              metric: 'Vista affiancata',
              actionLabel: 'Apri home',
            },
            {
              title: 'Banca vs banca',
              description: 'Evidenzia differenze di TAEG, rata mensile e documentazione in un’unica vista.',
              metric: 'KPI chiave allineati',
              actionLabel: 'Apri banche',
            },
            {
              title: 'Città vs città',
              description:
                'Confronta prezzi immobiliari, rendimento da locazione e potenziale di crescita dei mercati urbani.',
              metric: 'Analisi del mercato locale',
              actionLabel: 'Apri immobili',
            },
          ],
        },
        lawsTaxes: {
          label: 'Norme e tasse',
          title: 'Guida a norme e tasse',
          description: 'Checklist pratiche su regole di acquisto, imposte e obblighi locali nei diversi paesi.',
          searchPlaceholder: 'Cerca un tema legale, es. tassa, notaio, registrazione',
          emptyTitle: 'Nessuna guida legale trovata',
          emptyDescription: 'Prova un altro termine per la tassa o il requisito che cerchi.',
          cards: [
            {
              title: 'Costi di ingresso e tasse',
              description: 'Spiega imposte di acquisto, spese notarili e costi di registrazione per i paesi target.',
              metric: 'Checklist per paese',
              actionLabel: 'Apri contatti',
            },
            {
              title: 'Obblighi del proprietario',
              description: 'Riassume obblighi di registrazione, locazione e rendicontazione per i proprietari.',
              metric: 'Vista per residenti e non residenti',
              actionLabel: 'Apri immobili',
            },
            {
              title: 'Mappa pratiche di credito',
              description: 'Illustra documenti richiesti, logica di scoring e formalità locali del finanziamento.',
              metric: 'Percorso documentale',
              actionLabel: 'Apri banche',
            },
          ],
        },
        investorZone: {
          label: 'Area investitori',
          title: 'Area investitori',
          description: 'Viste pronte per ROI, rischio paese, strategia di ingresso del capitale e market timing.',
          searchPlaceholder: 'Cerca un tema investitore, es. ROI, rendimento, rischio',
          emptyTitle: 'Nessuno scenario investitore trovato',
          emptyDescription: 'Allarga la ricerca o seleziona un’altra sezione.',
          cards: [
            {
              title: 'Heatmap ROI',
              description: 'Stima il potenziale di rendimento per più tipi di immobili e profili di mercato.',
              metric: 'ROI e rendimento insieme',
              actionLabel: 'Apri immobili',
            },
            {
              title: 'Punteggio rischio paese',
              description: 'Combina volatilità FX, costo del finanziamento e complessità normativa in un’unica vista.',
              metric: 'Punteggio rischio investitore',
              actionLabel: 'Apri valute',
            },
            {
              title: 'Scenari di ingresso del capitale',
              description: 'Supporta la scelta tra strategie di finanziamento in contanti, a debito o miste.',
              metric: '3 modelli di finanziamento',
              actionLabel: 'Apri banche',
            },
          ],
        },
      },
    },
    errors: {
      notFoundBadge: 'Errore 404',
      notFoundTitle: 'Non abbiamo trovato questa pagina',
      notFoundDescription:
        'L’indirizzo potrebbe essere obsoleto o digitato male. Torna alla home page o vai subito ai moduli principali della piattaforma.',
      serverErrorBadge: 'Errore 500',
      serverErrorTitle: 'Si è verificato un problema da parte nostra',
      serverErrorDescription:
        'Non siamo riusciti a preparare correttamente questa vista. Riprova tra poco o contattaci se il problema continua.',
      homeAction: 'Torna alla home page',
      contactAction: 'Vai ai contatti',
      banksAction: 'Vedi offerte di credito',
      currenciesAction: 'Controlla i tassi di cambio',
    },
    legal: {
      disclaimerTitle: 'Informativa legale',
      currencyInformationalDisclaimer:
        'I tassi di cambio per il mercato {country} sono forniti solo a scopo informativo. La vista predefinita mostra una media basata su più feed gratuiti.',
      countryNoticePending:
        'Le note normative dettagliate per questo paese vengono pubblicate gradualmente e saranno completate prima del lancio completo in produzione.',
    },
  },
  'ready',
);
