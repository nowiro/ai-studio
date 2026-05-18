import { defineTranslationResource } from '../i18n.types';

export default defineTranslationResource(
  'mt',
  {
    languageSwitcher: {
      ariaLabel: 'Agħżel il-lingwa',
      menuTitle: 'Agħżel il-lingwa (24 lingwa tal-UE)',
      selectedTooltip: 'Lingwa magħżula: {language}',
    },
    header: {
      brandAriaLabel: 'UnionVault.eu — paġna ewlenija',
      navigationAriaLabel: 'Navigazzjoni prinċipali',
      mobileMenuAriaLabel: 'Iftaħ il-menu tan-navigazzjoni',
      mobileCountryLabel: 'Pajjiż attwali',
      navContact: 'Kuntatt',
      navBanks: "Offerti ta' kreditu",
      navCurrencies: 'Rati tal-kambju',
      navRealEstate: 'Proprjetà immobbli',
      navDiscover: 'Sezzjonijiet ġodda',
    },
    footer: {
      rightsReserved: 'Id-drittijiet kollha riżervati.',
      lastUpdatedLabel: 'Aġġornat l-aħħar',
    },
    home: {
      heroSubtitle: 'Iċ-ċentru affidabbli tiegħek għad-data finanzjarja tal-UE',
      heroDescription:
        "Pjattaforma pan-Ewropea li tiġbor data finanzjarja minn 27 pajjiż tal-Unjoni Ewropea. Qabbel offerti ta' kreditu, segwi r-rati tal-kambju u analizza l-prezzijiet tal-proprjetà — kollox f'post wieħed.",
      currentCountryLabel: 'Pajjiż attwali',
      modulesTitle: 'Moduli tal-pjattaforma',
      modules: {
        statusAvailable: 'Disponibbli',
        banksTitle: "Offerti ta' kreditu",
        banksDescription: "Qabbel self ipotekarju, personali u għan-negozju minn banek f'27 pajjiż tal-UE.",
        banksAction: 'Qabbel l-offerti',
        currenciesTitle: 'Rati tal-kambju',
        currenciesDescription: "Rati tal-kambju Ewropej aġġornati erba' darbiet kuljum.",
        currenciesAction: 'Ara r-rati',
        realEstateTitle: 'Prezzijiet tal-proprjetà',
        realEstateDescription: 'Appartamenti, djar u art minn 27 pajjiż tal-UE viżwalizzati fuq Google Maps.',
        realEstateAction: 'Skopri l-proprjetajiet',
      },
      features: {
        languages: '24 lingwa tal-UE',
        countries: '27 pajjiż',
        cadence: 'Aġġornat 4× kuljum',
        compliance: 'GDPR / PSD2 / MiFID II',
        maps: 'Google Maps',
        sources: 'Sorsi uffiċjali tad-data',
      },
      info: {
        complianceTitle: 'Konformità regolatorja',
        complianceDescription:
          'GDPR, PSD2, MiFID II, DAC7 u l-AI Act — il-pjan tal-prodott huwa allinjat mar-rekwiżiti regolatorji tal-UE.',
        sourcesTitle: 'Sorsi tad-data affidabbli',
        sourcesDescription: 'Id-data ġejja minn banek ċentrali, l-EBA, l-ESMA, EUR-Lex u l-BĊE.',
        aiTitle: 'Mibnija bl-appoġġ tal-IA',
        aiDescription: "Il-prodott qed jiġi żviluppat permezz ta' fluss ta' ħidma ta' inġinerija assistit mill-IA.",
      },
      exploreTitle: "Sezzjonijiet ġodda u għodod ta' tfittxija",
      exploreDescription:
        "Żidna 6 sezzjonijiet ġodda biex ngħinu lill-utenti jsibu aktar malajr xenarji aħjar, pajjiżi u direzzjonijiet ta' investiment.",
    },
    discover: {
      badge: 'Ġdid',
      title: "Ċentru tas-sezzjonijiet ġodda ta' UnionVault",
      description:
        'Esplora kalkolaturi, allerti, klassifiki, komparaturi, gwidi legali u għodod għall-investituri. Kull sezzjoni tinkludi mini-tfittxija mmirata u xenarji lesti għall-użu.',
      searchLabel: 'Fittex fit-tab attiv',
      stats: {
        tools: '18-il xenarju u għodda',
        countries: '27 pajjiż tal-UE',
        datasets: 'Data kondiviża għall-banek, il-muniti u l-proprjetà',
      },
      tabs: {
        calculators: {
          label: 'Kalkolaturi',
          title: 'Kalkolaturi għal deċiżjonijiet finanzjarji',
          description:
            'Għodod veloċi biex tikkalkula l-pagamenti tas-self, l-ispejjeż tax-xiri u r-rendimenti tal-investiment bejn pajjiż u ieħor.',
          searchPlaceholder: 'Fittex kalkolaturi, eż. rata, ROI, spiża tax-xiri',
          emptyTitle: "L-ebda kalkolatur ma jaqbel ma' din it-tfittxija",
          emptyDescription: 'Ipprova frażi iqsar jew aqleb għal tab ieħor.',
          cards: [
            {
              title: 'Kalkolatur tar-rata tas-self',
              description:
                "Jqabbel il-pagamenti mensili bejn pajjiżi, livelli ta' ħlas bil-quddiem u suppożizzjonijiet dwar ir-rati tal-imgħax.",
              metric: "Xenarji ta' 10, 20 u 30 sena",
              actionLabel: 'Mur fil-banek',
            },
            {
              title: "Kalkolatur tal-ispiża tax-xiri ta' proprjetà",
              description:
                'Jistma l-ispejjeż tan-nutar, it-taxxi, il-ħlasijiet lokali u l-ispiża totali tad-dħul għal pajjiż magħżul.',
              metric: 'L-ispejjeż tat-tranżazzjoni inklużi',
              actionLabel: 'Mur fil-proprjetà',
            },
            {
              title: 'Kalkolatur tal-impatt tal-munita',
              description:
                "Jikkalkula l-konverżjoni tal-munita, l-ispredd u s-sensittività tal-pagamenti f'xenarji differenti tar-rata tal-kambju.",
              metric: "Veduta b'diversi sorsi ta' rati",
              actionLabel: 'Mur fil-muniti',
            },
          ],
        },
        alerts: {
          label: 'Allerti',
          title: 'Allerti u sinjali proattivi',
          description:
            "Xenarji għal utenti li jridu jirreaġixxu għal bidliet fir-rati, offerti ġodda ta' kreditu jew tnaqqis fil-prezzijiet tal-proprjetà.",
          searchPlaceholder: 'Fittex allerti, eż. rata, prezz, offerta',
          emptyTitle: "L-ebda allert ma jaqbel ma' dan il-filtru",
          emptyDescription: "Neħħi parti mit-terminu tat-tfittxija u erġa' pprova.",
          cards: [
            {
              title: 'Allert tar-rata tal-kambju',
              description: "Jattiva ruħu meta par ta' muniti jilħaq il-limitu ta' fuq jew t'isfel tiegħek.",
              metric: "Miri ta' fuq u ta' isfel",
              actionLabel: 'Mur fil-muniti',
            },
            {
              title: "Allert għal offerta ġdida ta' kreditu",
              description: "Jsegwi offerti bankarji ġodda jew imtejba għall-pajjiż u t-tip ta' prodott magħżul.",
              metric: 'Filtri skont il-pajjiż u l-prodott',
              actionLabel: 'Mur fil-banek',
            },
            {
              title: "Allert ta' tnaqqis fil-prezz tal-proprjetà",
              description: "Jenfasizza listings li jidħlu f'żona ta' opportunità għall-investituri.",
              metric: 'Sinjali għal bliet magħżula',
              actionLabel: 'Mur fil-proprjetà',
            },
          ],
        },
        rankings: {
          label: 'Klassifiki',
          title: "Klassifiki ta' pajjiżi u bliet",
          description:
            'Ordna l-pajjiżi skont l-aċċess għall-finanzjament, l-attrattiva għall-investiment u l-għoli tal-ħajja.',
          searchPlaceholder: 'Fittex klassifiki, eż. pajjiż, belt, investiment',
          emptyTitle: 'Ma nstabet l-ebda klassifika',
          emptyDescription: "Erġa' lura għall-veduta awtomatika biex tesplora l-klassifika kollha.",
          cards: [
            {
              title: 'Klassifika tal-aċċess għall-kreditu',
              description:
                "Tgħaqqad l-APR, ir-rekwiżiti tal-ħlas bil-quddiem u l-ħin tad-deċiżjoni f'punteġġ wieħed għal kull pajjiż.",
              metric: 'Punteġġ fil-livell tal-pajjiż',
              actionLabel: 'Mur fil-banek',
            },
            {
              title: 'Klassifika tal-bliet għall-investiment',
              description:
                'Tqabbel id-domanda, il-prezz tad-dħul u l-potenzjal tar-rendiment mill-kera fis-swieq urbani.',
              metric: 'L-aqwa postijiet fl-UE',
              actionLabel: 'Mur fil-proprjetà',
            },
            {
              title: 'Klassifika tal-istabbiltà tal-munita',
              description:
                'Turi fejn l-ispredds u l-volatilità tal-kambju huma l-aktar baxxi għall-ippjanar tal-kapital.',
              metric: 'Veduta tal-volatilità fuq 30 jum',
              actionLabel: 'Mur fil-muniti',
            },
          ],
        },
        comparators: {
          label: 'Komparaturi',
          title: "Komparaturi ta' xenarji",
          description:
            "Qabbel pajjiż ma' pajjiż, bank ma' bank jew belt ma' belt mingħajr xogħol manwali fuq spreadsheets.",
          searchPlaceholder: 'Fittex komparaturi, eż. bank vs bank, pajjiż vs pajjiż',
          emptyTitle: 'Ma nstab l-ebda komparatur',
          emptyDescription: 'Ipprova frażi oħra jew esplora tab differenti.',
          cards: [
            {
              title: 'Pajjiż vs pajjiż',
              description:
                'Jqabbel l-ispejjeż tad-dħul, il-finanzjament u l-esponiment għall-munita għal żewġ swieq magħżula.',
              metric: "Veduta ġenb ma' ġenb",
              actionLabel: 'Mur fil-paġna ewlenija',
            },
            {
              title: 'Bank vs bank',
              description: "Jenfasizza d-differenzi fl-APR, il-pagament mensili u d-dokumentazzjoni f'veduta waħda.",
              metric: 'KPIs ewlenin allinjati',
              actionLabel: 'Mur fil-banek',
            },
            {
              title: 'Belt vs belt',
              description:
                "Jqabbel il-prezzijiet tal-proprjetà, ir-rendiment mill-kera u l-potenzjal ta' tkabbir fis-swieq urbani.",
              metric: 'Analiżi tas-suq lokali',
              actionLabel: 'Mur fil-proprjetà',
            },
          ],
        },
        lawsTaxes: {
          label: 'Liġijiet u taxxi',
          title: 'Gwida għal-liġijiet u t-taxxi',
          description: 'Checklists prattiċi li jkopru r-regoli tax-xiri, it-taxxi u l-obbligi lokali bejn il-pajjiżi.',
          searchPlaceholder: 'Fittex suġġetti legali, eż. taxxa, nutar, reġistrazzjoni',
          emptyTitle: 'Ma nstabet l-ebda gwida legali',
          emptyDescription: 'Ipprova terminu ieħor għat-taxxa jew għar-rekwiżit li għandek bżonn.',
          cards: [
            {
              title: 'Spejjeż tad-dħul u taxxi',
              description:
                'Tispjega t-taxxi tax-xiri, l-ispejjeż tan-nutar u l-ispejjeż tar-reġistrazzjoni għall-pajjiżi fil-mira.',
              metric: 'Checklist skont il-pajjiż',
              actionLabel: 'Mur fil-kuntatt',
            },
            {
              title: 'Obbligi tas-sid',
              description:
                "Tiġbor fil-qosor ir-reġistrazzjoni, il-kera u r-responsabbiltajiet ta' rappurtar għas-sidien.",
              metric: 'Veduta għal residenti u mhux residenti',
              actionLabel: 'Mur fil-proprjetà',
            },
            {
              title: 'Formalitajiet tal-kreditu',
              description:
                'Tispjega d-dokumenti meħtieġa, il-loġika tal-punteġġ u l-formalitajiet lokali tal-finanzjament.',
              metric: 'Mappa tad-dokumenti',
              actionLabel: 'Mur fil-banek',
            },
          ],
        },
        investorZone: {
          label: 'Żona tal-investitur',
          title: 'Żona tal-investitur',
          description:
            'Veduti lesti għall-ROI, ir-riskju tal-pajjiż, l-istrateġija tad-dħul tal-kapital u t-timing tas-suq.',
          searchPlaceholder: 'Fittex temi għall-investituri, eż. ROI, yield, riskju',
          emptyTitle: 'Ma nstabu l-ebda xenarji għall-investituri',
          emptyDescription: "Wessa' t-tfittxija jew agħżel sezzjoni oħra.",
          cards: [
            {
              title: 'Mappa tas-sħana tal-ROI',
              description: "Tistma l-potenzjal tar-rendiment għal diversi tipi ta' proprjetà u profili tas-suq.",
              metric: 'ROI u yield flimkien',
              actionLabel: 'Mur fil-proprjetà',
            },
            {
              title: 'Punteġġ tar-riskju tal-pajjiż',
              description:
                "Jgħaqqad il-volatilità tal-munita, l-ispiża tal-finanzjament u l-kumplessità regolatorja f'veduta waħda.",
              metric: 'Punteġġ tar-riskju għall-investitur',
              actionLabel: 'Mur fil-muniti',
            },
            {
              title: "Xenarji ta' dħul tal-kapital",
              description:
                "Jgħin fit-teħid ta' deċiżjonijiet bejn flus kontanti, dejn u strateġiji ta' finanzjament imħallta.",
              metric: "3 mudelli ta' finanzjament",
              actionLabel: 'Mur fil-banek',
            },
          ],
        },
      },
    },
    errors: {
      notFoundBadge: 'Żball 404',
      notFoundTitle: 'Ma stajniex insibu din il-paġna',
      notFoundDescription:
        "L-indirizz jista' jkun skadut jew miktub ħażin. Erġa' lura għall-paġna ewlenija jew mur direttament lejn il-moduli ewlenin tal-pjattaforma.",
      serverErrorBadge: 'Żball 500',
      serverErrorTitle: 'Xi ħaġa marret ħażin min-naħa tagħna',
      serverErrorDescription:
        "Ma stajniex nippreparaw din il-veduta kif suppost. Jekk jogħġbok erġa' pprova dalwaqt jew ikkuntattjana jekk il-problema tkompli sseħħ.",
      homeAction: 'Lura għall-paġna ewlenija',
      contactAction: 'Mur fil-kuntatt',
      banksAction: "Ara l-offerti ta' kreditu",
      currenciesAction: 'Iċċekkja r-rati tal-kambju',
    },
    legal: {
      disclaimerTitle: 'Avviż legali',
      currencyInformationalDisclaimer:
        "Ir-rati tal-kambju għas-suq ta' {country} huma pprovduti għal skopijiet informattivi biss. Il-veduta awtomatika turi medja bbażata fuq diversi sorsi b'xejn.",
      countryNoticePending:
        'Avviżi regolatorji dettaljati għal dan il-pajjiż qed jiġu ppubblikati gradwalment u se jitlestew qabel it-tnedija sħiħa fil-produzzjoni.',
    },
  },
  'ready',
);
