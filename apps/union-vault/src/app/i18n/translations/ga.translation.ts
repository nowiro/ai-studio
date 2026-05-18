import { defineTranslationResource } from '../i18n.types';

export default defineTranslationResource(
  'ga',
  {
    languageSwitcher: {
      ariaLabel: 'Roghnaigh teanga',
      menuTitle: 'Roghnaigh teanga (24 theanga AE)',
      selectedTooltip: 'Teanga roghnaithe: {language}',
    },
    header: {
      brandAriaLabel: 'UnionVault.eu — leathanach baile',
      navigationAriaLabel: 'Príomhnascleanúint',
      mobileMenuAriaLabel: 'Oscail an roghchlár nascleanúna',
      mobileCountryLabel: 'Tír reatha',
      navContact: 'Teagmháil',
      navBanks: 'Tairiscintí creidmheasa',
      navCurrencies: 'Rátaí malairte',
      navRealEstate: 'Eastát réadach',
      navDiscover: 'Rannóga nua',
    },
    footer: {
      rightsReserved: 'Gach ceart ar cosaint.',
      lastUpdatedLabel: 'Nuashonraithe go deireanach',
    },
    home: {
      heroSubtitle: 'Do stór iontaofa de shonraí airgeadais an AE',
      heroDescription:
        'Ardán uile-Eorpach a chomhiomlánaíonn sonraí airgeadais ó 27 dtír san Aontas Eorpach. Déan comparáid idir tairiscintí creidmheasa, lean rátaí malairte, agus déan anailís ar phraghsanna eastáit réadaigh — ar fad in aon áit amháin.',
      currentCountryLabel: 'Tír reatha',
      modulesTitle: 'Modúil an ardáin',
      modules: {
        statusAvailable: 'Ar fáil',
        banksTitle: 'Tairiscintí creidmheasa',
        banksDescription: 'Déan comparáid idir iasachtaí morgáiste, tomhaltais agus gnó ó bhainc i 27 dtír den AE.',
        banksAction: 'Déan comparáid idir tairiscintí',
        currenciesTitle: 'Rátaí malairte',
        currenciesDescription: 'Rátaí malairte reatha Eorpacha, nuashonraithe 4 huaire sa lá.',
        currenciesAction: 'Féach ar na rátaí',
        realEstateTitle: 'Praghsanna eastáit réadaigh',
        realEstateDescription: 'Árasáin, tithe agus talamh ó 27 dtír den AE léirithe ar Google Maps.',
        realEstateAction: 'Brabhsáil réadmhaoin',
      },
      features: {
        languages: '24 theanga AE',
        countries: '27 tír',
        cadence: 'Nuashonraithe 4× sa lá',
        compliance: 'GDPR / PSD2 / MiFID II',
        maps: 'Google Maps',
        sources: 'Sonraí ó fhoinsí oifigiúla',
      },
      info: {
        complianceTitle: 'Comhlíonadh rialála',
        complianceDescription:
          'GDPR, PSD2, MiFID II, DAC7 agus an tAcht um Intleacht Shaorga — tá forbairt an táirge ailínithe le comhlíonadh iomlán rialacháin an AE.',
        sourcesTitle: 'Foinsí sonraí iontaofa',
        sourcesDescription: 'Tagann na sonraí ó bhainc cheannais, ón EBA, ón ESMA, ó EUR-Lex agus ón ECB.',
        aiTitle: 'Tógtha le tacaíocht AI',
        aiDescription: 'Tá an táirge á sheachadadh trí shreabhadh oibre innealtóireachta le cúnamh AI.',
      },
      exploreTitle: 'Rannóga nua agus uirlisí cuardaigh',
      exploreDescription:
        'Chuireamar 6 rannóg nua leis chun cabhrú le húsáideoirí cásanna níos fearr, tíortha agus treonna infheistíochta a aimsiú níos tapúla.',
    },
    discover: {
      badge: 'Nua',
      title: 'Mol rannóg nua UnionVault',
      description:
        'Déan iniúchadh ar áireamháin, foláirimh, ranguithe, comparadóirí, treoracha dlí agus uirlisí d’infheisteoirí. Tá mionchuardach dírithe agus cásanna réidh le húsáid i ngach rannóg.',
      searchLabel: 'Cuardaigh laistigh den chluaisín gníomhach',
      stats: {
        tools: '18 gcás agus uirlis',
        countries: '27 dtír den AE',
        datasets: 'Sonraí comhroinnte do bhaincéireacht, airgeadra agus eastát réadach',
      },
      tabs: {
        calculators: {
          label: 'Áireamháin',
          title: 'Áireamháin do chinntí airgeadais',
          description:
            'Uirlisí gasta chun íocaíochtaí iasachta, costais cheannaigh agus torthaí infheistíochta a mheas thar thíortha éagsúla.',
          searchPlaceholder: 'Cuardaigh áireamháin, m.sh. morgáiste, ROI, costas ceannaigh',
          emptyTitle: 'Ní oireann aon áireamhán don chuardach seo',
          emptyDescription: 'Bain triail as frása níos giorra nó aistrigh go cluaisín eile.',
          cards: [
            {
              title: 'Áireamhán íocaíochta morgáiste',
              description:
                'Déanann sé comparáid idir íocaíochtaí míosúla de réir tíre, leibhéal éarlais agus toimhdí ráta úis.',
              metric: 'Cásanna 10, 20 agus 30 bliain',
              actionLabel: 'Oscail bainc',
            },
            {
              title: 'Áireamhán chostas ceannaigh maoine',
              description:
                'Measann sé táillí nótaire, cánacha, muirir áitiúla agus an costas iontrála iomlán don tír roghnaithe.',
              metric: 'Costais idirbhirt san áireamh',
              actionLabel: 'Oscail eastát réadach',
            },
            {
              title: 'Áireamhán tionchair airgeadra',
              description:
                'Ríomhann sé tiontú FX, an scaipeadh agus íogaireacht íocaíochta thar chásanna éagsúla rátaí malairte.',
              metric: 'Amharc ilfhoinse airgeadra',
              actionLabel: 'Oscail airgeadraí',
            },
          ],
        },
        alerts: {
          label: 'Foláirimh',
          title: 'Foláirimh agus comharthaí réamhghníomhacha',
          description:
            'Cásanna d’úsáideoirí ar mian leo freagairt d’athruithe rátaí, do thairiscintí nua creidmheasa nó do laghduithe praghais ar eastát réadach.',
          searchPlaceholder: 'Cuardaigh foláirimh, m.sh. ráta, maoin, tairiscint',
          emptyTitle: 'Ní oireann aon fholáireamh don scagaire seo',
          emptyDescription: 'Bain cuid den téarma cuardaigh agus bain triail eile as.',
          cards: [
            {
              title: 'Foláireamh ráta malairte',
              description:
                'Gníomhaíonn sé nuair a shroicheann péire FX roghnaithe do thairseach uachtarach nó íochtarach.',
              metric: 'Spriocanna uachtaracha agus íochtaracha',
              actionLabel: 'Oscail airgeadraí',
            },
            {
              title: 'Foláireamh tairisceana nua creidmheasa',
              description:
                'Rianaíonn sé tairiscintí baincéireachta nua nó feabhsaithe don tír agus don chineál táirge roghnaithe.',
              metric: 'Scagairí de réir tíre agus táirge',
              actionLabel: 'Oscail bainc',
            },
            {
              title: 'Foláireamh titime praghais maoine',
              description: 'Aibhsíonn sé liostaí a thagann isteach i gcrios deise d’infheisteoirí.',
              metric: 'Comharthaí do chathracha roghnaithe',
              actionLabel: 'Oscail eastát réadach',
            },
          ],
        },
        rankings: {
          label: 'Ranguithe',
          title: 'Ranguithe tíortha agus cathracha',
          description:
            'Sórtáil tíortha de réir inrochtaineachta maoinithe, tarraingteacht infheistíochta agus costas maireachtála.',
          searchPlaceholder: 'Cuardaigh ranguithe, m.sh. tír, cathair, infheistíocht',
          emptyTitle: 'Níor aimsíodh aon rangú',
          emptyDescription: 'Fill ar an amharc réamhshocraithe chun an tsraith iomlán ranguithe a fheiceáil.',
          cards: [
            {
              title: 'Rangú inrochtaineachta maoinithe',
              description: 'Comhcheanglaíonn sé APR, ionchais éarlaise agus am cinnidh i scór tíre amháin.',
              metric: 'Scóráil ar leibhéal tíre',
              actionLabel: 'Oscail bainc',
            },
            {
              title: 'Rangú cathracha infheistíochta',
              description:
                'Déanann sé comparáid idir éileamh, praghas iontrála agus acmhainn toraidh chíosa i margaí cathrach.',
              metric: 'Barrshuímh an AE',
              actionLabel: 'Oscail eastát réadach',
            },
            {
              title: 'Rangú cobhsaíochta airgeadra',
              description: 'Léiríonn sé cá bhfuil na scaipthe agus luaineacht FX is ísle do phleanáil caipitil.',
              metric: 'Amharc luaineachta 30 lá',
              actionLabel: 'Oscail airgeadraí',
            },
          ],
        },
        comparators: {
          label: 'Comparadóirí',
          title: 'Comparadóirí cásanna',
          description:
            'Déan comparáid idir tír agus tír, banc agus banc, nó cathair agus cathair gan obair scarbhileoige láimhe.',
          searchPlaceholder: 'Cuardaigh comparadóirí, m.sh. banc vs banc, tír vs tír',
          emptyTitle: 'Níor aimsíodh aon chomparadóir',
          emptyDescription: 'Bain triail as frása eile nó déan iniúchadh ar chluaisín eile.',
          cards: [
            {
              title: 'Tír vs tír',
              description:
                'Déanann sé comparáid idir costais iontrála, maoiniú agus nochtadh FX do dhá mhargadh roghnaithe.',
              metric: 'Amharc taobh le taobh',
              actionLabel: 'Oscail an baile',
            },
            {
              title: 'Banc vs banc',
              description: 'Aibhsíonn sé difríochtaí in APR, íocaíocht mhíosúil agus doiciméadú in aon amharc amháin.',
              metric: 'Príomh-KPIanna ailínithe',
              actionLabel: 'Oscail bainc',
            },
            {
              title: 'Cathair vs cathair',
              description:
                'Déanann sé comparáid idir praghsanna maoine, toradh cíosa agus acmhainn fáis i margaí uirbeacha.',
              metric: 'Anailís ar mhargadh áitiúil',
              actionLabel: 'Oscail eastát réadach',
            },
          ],
        },
        lawsTaxes: {
          label: 'Dlíthe agus cánacha',
          title: 'Treoir maidir le dlíthe agus cánacha',
          description:
            'Seicliostaí praiticiúla a chlúdaíonn rialacha ceannaigh, cánacha agus oibleagáidí áitiúla ar fud tíortha éagsúla.',
          searchPlaceholder: 'Cuardaigh topaicí dlí, m.sh. cáin, nótaire, clárú',
          emptyTitle: 'Níor aimsíodh aon treoir dlí',
          emptyDescription: 'Bain triail as téarma eile don cháin nó don riachtanas atá uait.',
          cards: [
            {
              title: 'Costais iontrála agus cánacha',
              description: 'Míníonn sé cánacha ceannaigh, táillí nótaire agus costais chlárúcháin do thíortha sprice.',
              metric: 'Seicliosta tíre',
              actionLabel: 'Oscail teagmháil',
            },
            {
              title: 'Oibleagáidí úinéara',
              description: 'Déanann sé achoimre ar fhreagrachtaí clárúcháin, tionóntachta agus tuairiscithe d’úinéirí.',
              metric: 'Amharc do chónaitheoirí agus do neamhchónaitheoirí',
              actionLabel: 'Oscail eastát réadach',
            },
            {
              title: 'Léarscáil páipéarachais creidmheasa',
              description:
                'Leagann sé amach na doiciméid riachtanacha, an loighic scórála agus foirmiúlachtaí maoinithe áitiúla.',
              metric: 'Bealach doiciméad',
              actionLabel: 'Oscail bainc',
            },
          ],
        },
        investorZone: {
          label: 'Crios infheisteora',
          title: 'Crios infheisteora',
          description:
            'Amhairc réamhdhéanta do ROI, riosca tíre, straitéis iontrála caipitil agus uainiú an mhargaidh.',
          searchPlaceholder: 'Cuardaigh topaicí infheisteora, m.sh. ROI, toradh, riosca',
          emptyTitle: 'Níor aimsíodh aon chás infheisteora',
          emptyDescription: 'Leathnaigh an cuardach nó roghnaigh rannóg eile.',
          cards: [
            {
              title: 'Léarscáil teasa ROI',
              description: 'Measann sé an acmhainn toraidh do chineálacha éagsúla maoine agus do phróifílí margaidh.',
              metric: 'ROI agus toradh le chéile',
              actionLabel: 'Oscail eastát réadach',
            },
            {
              title: 'Scór riosca tíre',
              description:
                'Comhcheanglaíonn sé luaineacht FX, costas maoinithe agus castacht rialála in aon amharc amháin.',
              metric: 'Scór riosca infheisteora',
              actionLabel: 'Oscail airgeadraí',
            },
            {
              title: 'Cásanna iontrála caipitil',
              description: 'Tacaíonn sé le cinntí idir airgead tirim, fiachas agus straitéisí maoinithe measctha.',
              metric: '3 mhúnla maoinithe',
              actionLabel: 'Oscail bainc',
            },
          ],
        },
      },
    },
    errors: {
      notFoundBadge: 'Earráid 404',
      notFoundTitle: 'Níor aimsíomar an leathanach seo',
      notFoundDescription:
        'D’fhéadfadh an seoladh a bheith as dáta nó iontráilte go mícheart. Fill ar an leathanach baile nó téigh díreach chuig na modúil is tábhachtaí ar an ardán.',
      serverErrorBadge: 'Earráid 500',
      serverErrorTitle: 'Tharla fadhb ar ár taobh',
      serverErrorDescription:
        'Níorbh fhéidir linn an t-amharc seo a ullmhú i gceart. Bain triail eile as gan mhoill nó déan teagmháil linn má leanann an fhadhb ar aghaidh.',
      homeAction: 'Ar ais go dtí an leathanach baile',
      contactAction: 'Téigh chuig teagmháil',
      banksAction: 'Féach ar thairiscintí creidmheasa',
      currenciesAction: 'Seiceáil rátaí malairte',
    },
    legal: {
      disclaimerTitle: 'Fógra dlí',
      currencyInformationalDisclaimer:
        'Cuirtear rátaí malairte do mhargadh {country} ar fáil chun críocha eolais amháin. Taispeánann an t-amharc réamhshocraithe meán bunaithe ar roinnt fothaí saor in aisce.',
      countryNoticePending:
        'Tá fógraí mionsonraithe rialála don tír seo á bhfoilsiú de réir a chéile agus cuirfear i gcrích iad roimh sheoladh iomlán an táirgthe.',
    },
  },
  'ready',
);
