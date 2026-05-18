import { defineTranslationResource } from '../i18n.types';

export default defineTranslationResource(
  'ro',
  {
    languageSwitcher: {
      ariaLabel: 'Selectează limba',
      menuTitle: 'Selectează limba (24 de limbi UE)',
      selectedTooltip: 'Limba selectată: {language}',
    },
    header: {
      brandAriaLabel: 'UnionVault.eu — pagina principală',
      navigationAriaLabel: 'Navigare principală',
      mobileMenuAriaLabel: 'Deschide meniul de navigare',
      mobileCountryLabel: 'Țara curentă',
      navContact: 'Contact',
      navBanks: 'Oferte de credit',
      navCurrencies: 'Cursuri de schimb',
      navRealEstate: 'Imobiliare',
      navDiscover: 'Secțiuni noi',
    },
    footer: {
      rightsReserved: 'Toate drepturile rezervate.',
      lastUpdatedLabel: 'Ultima actualizare',
    },
    home: {
      heroSubtitle: 'Centrul tău de încredere pentru date financiare din UE',
      heroDescription:
        'O platformă paneuropeană care agregă date financiare din 27 de țări ale Uniunii Europene. Compară oferte de credit, urmărește cursurile de schimb și analizează prețurile imobiliare — toate într-un singur loc.',
      currentCountryLabel: 'Țara curentă',
      modulesTitle: 'Modulele platformei',
      modules: {
        statusAvailable: 'Disponibil',
        banksTitle: 'Oferte de credit',
        banksDescription: 'Compară credite ipotecare, de consum și pentru companii oferite de bănci din 27 de țări UE.',
        banksAction: 'Compară ofertele',
        currenciesTitle: 'Cursuri de schimb',
        currenciesDescription: 'Cursuri de schimb europene actualizate de 4 ori pe zi.',
        currenciesAction: 'Vezi cursurile',
        realEstateTitle: 'Prețuri imobiliare',
        realEstateDescription: 'Apartamente, case și terenuri din 27 de țări UE vizualizate pe Google Maps.',
        realEstateAction: 'Explorează proprietățile',
      },
      features: {
        languages: '24 de limbi UE',
        countries: '27 de țări',
        cadence: 'Actualizare de 4×/zi',
        compliance: 'GDPR / PSD2 / MiFID II',
        maps: 'Google Maps',
        sources: 'Date din surse oficiale',
      },
      info: {
        complianceTitle: 'Conformitate de reglementare',
        complianceDescription:
          'GDPR, PSD2, MiFID II, DAC7 și AI Act — dezvoltarea produsului este planificată pentru conformitate deplină cu reglementările UE.',
        sourcesTitle: 'Surse de date de încredere',
        sourcesDescription: 'Datele provin de la bănci centrale, EBA, ESMA, EUR-Lex și BCE.',
        aiTitle: 'Dezvoltat cu ajutorul AI',
        aiDescription: 'Proiect realizat de o echipă de agenți AI și prin inginerie susținută de automatizare.',
      },
      exploreTitle: 'Secțiuni noi și instrumente de căutare',
      exploreDescription:
        'Am adăugat 6 secțiuni noi care te ajută să găsești mai rapid direcția potrivită de investiție, țara și cel mai bun scenariu de acțiune.',
    },
    discover: {
      badge: 'Nou',
      title: 'Centrul noilor secțiuni UnionVault',
      description:
        'Explorează calculatoare, alerte, clasamente, comparatoare, ghiduri juridice și zona investitorului. Fiecare secțiune are propriul mini-motor de căutare și un set de scenarii gata de folosit.',
      searchLabel: 'Caută în fila activă',
      stats: {
        tools: '18 scenarii și instrumente',
        countries: '27 de țări UE',
        datasets: 'Date comune pentru bănci, valute și imobiliare',
      },
      tabs: {
        calculators: {
          label: 'Calculatoare',
          title: 'Calculatoare pentru decizii financiare',
          description:
            'Instrumente rapide pentru calculul ratelor, costurilor de achiziție și rentabilității investițiilor în diferite țări.',
          searchPlaceholder: 'Caută un calculator, ex. rată, ROI, cost de achiziție',
          emptyTitle: 'Nu există calculatoare pentru această căutare',
          emptyDescription: 'Încearcă o expresie mai scurtă sau schimbă fila.',
          cards: [
            {
              title: 'Calculator pentru rata creditului',
              description: 'Compară rata în funcție de țară, avans și nivelul dobânzii.',
              metric: 'Scenarii pe 10, 20 și 30 de ani',
              actionLabel: 'Mergi la bănci',
            },
            {
              title: 'Calculator pentru costul achiziției imobiliare',
              description:
                'Estimează notariatul, taxele, costurile locale și costul total de intrare pentru țara selectată.',
              metric: 'Include costurile tranzacției',
              actionLabel: 'Mergi la imobiliare',
            },
            {
              title: 'Calculator valutar',
              description:
                'Calculează conversia valutară, spread-ul și variația costului ratei în funcție de diferite scenarii de curs.',
              metric: 'Mai multe surse de curs',
              actionLabel: 'Mergi la valute',
            },
          ],
        },
        alerts: {
          label: 'Alerte',
          title: 'Alerte și notificări automate',
          description:
            'Scenarii pentru utilizatorii care vor să reacționeze la schimbări de curs, oferte bancare sau prețuri imobiliare.',
          searchPlaceholder: 'Caută o alertă, ex. curs, preț, ofertă',
          emptyTitle: 'Nu există alerte care să corespundă filtrului',
          emptyDescription: 'Elimină o parte dintre cuvintele-cheie și încearcă din nou.',
          cards: [
            {
              title: 'Alertă de curs valutar',
              description: 'Trimite un semnal atunci când cursul perechii selectate atinge pragul stabilit.',
              metric: 'Praguri superioare și inferioare',
              actionLabel: 'Mergi la valute',
            },
            {
              title: 'Alertă pentru ofertă nouă de credit',
              description: 'Detectează oferte noi sau îmbunătățite în țara și segmentul de credit selectate.',
              metric: 'Filtre după țară și produs',
              actionLabel: 'Mergi la bănci',
            },
            {
              title: 'Alertă de scădere a prețului proprietății',
              description: 'Monitorizează anunțurile și îți spune când apare o oportunitate de investiție.',
              metric: 'Semnale pentru orașele selectate',
              actionLabel: 'Mergi la imobiliare',
            },
          ],
        },
        rankings: {
          label: 'Clasamente',
          title: 'Clasamente ale țărilor și orașelor',
          description: 'Ordonează țările după accesibilitatea creditului, potențialul investițional și costul vieții.',
          searchPlaceholder: 'Caută un clasament, ex. țară, oraș, investiție',
          emptyTitle: 'Nu există clasamente pentru această căutare',
          emptyDescription: 'Revino la vizualizarea generală pentru a vedea clasamentul complet.',
          cards: [
            {
              title: 'Clasamentul accesibilității creditului',
              description: 'Combină DAE, avansul necesar și timpul de decizie într-un singur scor clar pe țară.',
              metric: 'Scor pe țară',
              actionLabel: 'Mergi la bănci',
            },
            {
              title: 'Clasamentul orașelor pentru investiții',
              description: 'Compară cererea, prețul de intrare și potențialul randamentului din chirii.',
              metric: 'Top locații din UE',
              actionLabel: 'Mergi la imobiliare',
            },
            {
              title: 'Clasamentul stabilității valutare',
              description: 'Arată unde spread-ul și volatilitatea cursului sunt cele mai mici pentru investitor.',
              metric: 'Indicator de volatilitate 30D',
              actionLabel: 'Mergi la valute',
            },
          ],
        },
        comparators: {
          label: 'Comparatoare',
          title: 'Comparatoare de scenarii',
          description: 'Compară țară cu țară, bancă cu bancă sau oraș cu oraș fără să copiezi manual datele.',
          searchPlaceholder: 'Caută un comparator, ex. bancă vs bancă, țară vs țară',
          emptyTitle: 'Nu există comparații pentru această expresie',
          emptyDescription: 'Schimbă căutarea sau alege altă filă.',
          cards: [
            {
              title: 'Țară vs țară',
              description: 'Compară costurile de intrare, creditul și cursurile valutare pentru două țări selectate.',
              metric: 'Vizualizare side-by-side',
              actionLabel: 'Mergi la pagina principală',
            },
            {
              title: 'Bancă vs bancă',
              description: 'Arată diferențele de DAE, rate și cerințe formale.',
              metric: 'Principalii KPI într-o singură vizualizare',
              actionLabel: 'Mergi la bănci',
            },
            {
              title: 'Oraș vs oraș',
              description: 'Compară prețurile imobiliare, rentabilitatea și ritmul de evoluție al prețurilor.',
              metric: 'Analiza piețelor locale',
              actionLabel: 'Mergi la imobiliare',
            },
          ],
        },
        lawsTaxes: {
          label: 'Legi și taxe',
          title: 'Ghid pentru legi și taxe',
          description:
            'Liste practice de verificare pentru cumpărarea de proprietăți, credite și obligații locale în diferite țări.',
          searchPlaceholder: 'Caută o lege sau o taxă, ex. taxă, notar, înregistrare',
          emptyTitle: 'Nu am găsit ghidul',
          emptyDescription: 'Verifică o altă denumire pentru taxă sau obligație.',
          cards: [
            {
              title: 'Costuri de intrare și taxe',
              description: 'Explică taxele de achiziție, cheltuielile notariale și costurile de înregistrare.',
              metric: 'Liste de verificare pe țara de destinație',
              actionLabel: 'Mergi la contact',
            },
            {
              title: 'Obligațiile proprietarului',
              description: 'Rezumat al notificărilor, înregistrării, închirierii și principalelor cerințe formale.',
              metric: 'Versiune pentru rezidenți și nerezidenți',
              actionLabel: 'Mergi la imobiliare',
            },
            {
              title: 'Formalități pentru credit',
              description: 'Explică documentele, scoringul și cerințele locale ale băncilor.',
              metric: 'Hartă a documentelor',
              actionLabel: 'Mergi la bănci',
            },
          ],
        },
        investorZone: {
          label: 'Zona investitorului',
          title: 'Zona investitorului',
          description:
            'Un set de idei gata de folosit pentru analiza ROI, riscului de țară și lichidității investiției.',
          searchPlaceholder: 'Caută un subiect de investiții, ex. ROI, yield, risc',
          emptyTitle: 'Nu există scenarii de investiții',
          emptyDescription: 'Extinde căutarea sau alege o altă zonă de date.',
          cards: [
            {
              title: 'Hartă ROI',
              description: 'Estimează rata potențială de rentabilitate pentru diferite piețe și tipuri de proprietăți.',
              metric: 'ROI și yield pe același card',
              actionLabel: 'Mergi la imobiliare',
            },
            {
              title: 'Evaluarea riscului de țară',
              description: 'Combină volatilitatea valutară, costurile de finanțare și cadrul de reglementare.',
              metric: 'Scor de risc pentru investitor',
              actionLabel: 'Mergi la valute',
            },
            {
              title: 'Scenarii de intrare a capitalului',
              description: 'Te ajută să alegi între numerar, credit și o strategie mixtă.',
              metric: '3 modele de finanțare',
              actionLabel: 'Mergi la bănci',
            },
          ],
        },
      },
    },
    errors: {
      notFoundBadge: 'Eroare 404',
      notFoundTitle: 'Nu am găsit această pagină',
      notFoundDescription:
        'Adresa poate fi învechită sau introdusă greșit. Revino la pagina principală sau mergi direct la cele mai importante module ale platformei.',
      serverErrorBadge: 'Eroare 500',
      serverErrorTitle: 'A apărut o problemă de partea noastră',
      serverErrorDescription:
        'Nu am putut pregăti corect această pagină. Încearcă din nou peste puțin timp sau contactează-ne dacă problema persistă.',
      homeAction: 'Înapoi la pagina principală',
      contactAction: 'Mergi la contact',
      banksAction: 'Vezi ofertele de credit',
      currenciesAction: 'Verifică cursurile de schimb',
    },
    legal: {
      disclaimerTitle: 'Informații juridice',
      currencyInformationalDisclaimer:
        'Cursurile pentru piața {country} au caracter informativ. Vizualizarea implicită arată media mai multor surse gratuite.',
      countryNoticePending:
        'Avertizările de reglementare detaliate pentru această țară sunt publicate treptat și vor fi completate înainte de lansarea completă în producție.',
    },
  },
  'ready',
);
