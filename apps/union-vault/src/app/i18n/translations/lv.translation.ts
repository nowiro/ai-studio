import { defineTranslationResource } from '../i18n.types';

export default defineTranslationResource(
  'lv',
  {
    languageSwitcher: {
      ariaLabel: 'Izvēlieties valodu',
      menuTitle: 'Izvēlieties valodu (24 ES valodas)',
      selectedTooltip: 'Izvēlētā valoda: {language}',
    },
    header: {
      brandAriaLabel: 'UnionVault.eu — sākumlapa',
      navigationAriaLabel: 'Galvenā navigācija',
      mobileMenuAriaLabel: 'Atvērt navigācijas izvēlni',
      mobileCountryLabel: 'Pašreizējā valsts',
      navContact: 'Kontakti',
      navBanks: 'Kredītu piedāvājumi',
      navCurrencies: 'Valūtu kursi',
      navRealEstate: 'Nekustamais īpašums',
      navDiscover: 'Jaunās sadaļas',
    },
    footer: {
      rightsReserved: 'Visas tiesības aizsargātas.',
      lastUpdatedLabel: 'Pēdējoreiz atjaunināts',
    },
    home: {
      heroSubtitle: 'Jūsu uzticamais ES finanšu datu centrs',
      heroDescription:
        'Visas Eiropas platforma, kas apkopo finanšu datus no 27 Eiropas Savienības valstīm. Salīdziniet kredītu piedāvājumus, sekojiet valūtu kursiem un analizējiet nekustamā īpašuma cenas — viss vienuviet.',
      currentCountryLabel: 'Pašreizējā valsts',
      modulesTitle: 'Platformas moduļi',
      modules: {
        statusAvailable: 'Pieejams',
        banksTitle: 'Kredītu piedāvājumi',
        banksDescription: 'Salīdziniet mājokļa, patēriņa un biznesa kredītus no bankām 27 ES valstīs.',
        banksAction: 'Salīdzināt piedāvājumus',
        currenciesTitle: 'Valūtu kursi',
        currenciesDescription: 'Aktuālie Eiropas valūtu kursi, atjaunināti 4 reizes dienā.',
        currenciesAction: 'Skatīt kursus',
        realEstateTitle: 'Nekustamā īpašuma cenas',
        realEstateDescription: 'Dzīvokļi, mājas un zemesgabali no 27 ES valstīm, attēloti Google Maps kartēs.',
        realEstateAction: 'Pārlūkot īpašumus',
      },
      features: {
        languages: '24 ES valodas',
        countries: '27 valstis',
        cadence: 'Atjaunināts 4× dienā',
        compliance: 'GDPR / PSD2 / MiFID II',
        maps: 'Google Maps',
        sources: 'Oficiāli datu avoti',
      },
      info: {
        complianceTitle: 'Atbilstība regulējumam',
        complianceDescription:
          'GDPR, PSD2, MiFID II, DAC7 un AI Act — produkta attīstība tiek plānota atbilstoši ES regulatīvajām prasībām.',
        sourcesTitle: 'Uzticami datu avoti',
        sourcesDescription: 'Dati tiek iegūti no centrālajām bankām, EBA, ESMA, EUR-Lex un ECB.',
        aiTitle: 'Veidots ar MI atbalstu',
        aiDescription: 'Projektu īsteno MI aģentu komanda un uz automatizāciju balstīta inženierijas pieeja.',
      },
      exploreTitle: 'Jaunās sadaļas un meklēšanas rīki',
      exploreDescription:
        'Esam pievienojuši 6 jaunas sadaļas, kas palīdz ātrāk atrast piemērotāko investīciju virzienu, valsti un rīcības scenāriju.',
    },
    discover: {
      badge: 'Jaunums',
      title: 'UnionVault jauno sadaļu centrs',
      description:
        'Izpētiet kalkulatorus, brīdinājumus, reitingus, salīdzinājumus, juridiskos ceļvežus un investora zonu. Katrai sadaļai ir sava mini meklēšana un gatavi scenāriji.',
      searchLabel: 'Meklēt aktīvajā cilnē',
      stats: {
        tools: '18 scenāriji un rīki',
        countries: '27 ES valstis',
        datasets: 'Kopīgi banku, valūtu un nekustamā īpašuma dati',
      },
      tabs: {
        calculators: {
          label: 'Kalkulatori',
          title: 'Finanšu lēmumu kalkulatori',
          description: 'Ātri rīki maksājumu, iegādes izmaksu un investīciju atdeves aprēķināšanai dažādās valstīs.',
          searchPlaceholder: 'Meklējiet kalkulatoru, piem. maksājums, ROI, iegādes izmaksas',
          emptyTitle: 'Šim vaicājumam kalkulatori netika atrasti',
          emptyDescription: 'Pamēģiniet īsāku frāzi vai atveriet citu cilni.',
          cards: [
            {
              title: 'Kredīta maksājuma kalkulators',
              description: 'Salīdzina ikmēneša maksājumu pēc valsts, pirmās iemaksas un procentu likmes.',
              metric: '10, 20 un 30 gadu scenāriji',
              actionLabel: 'Doties uz bankām',
            },
            {
              title: 'Nekustamā īpašuma iegādes izmaksu kalkulators',
              description:
                'Aprēķina notāra izmaksas, nodokļus, vietējās nodevas un kopējās ieejas izmaksas izvēlētajā valstī.',
              metric: 'Iekļautas darījuma izmaksas',
              actionLabel: 'Doties uz nekustamo īpašumu',
            },
            {
              title: 'Valūtas ietekmes kalkulators',
              description: 'Aprēķina valūtas maiņu, starpību un maksājuma izmaiņas dažādos kursa scenārijos.',
              metric: 'Vairāki kursu datu avoti',
              actionLabel: 'Doties uz valūtām',
            },
          ],
        },
        alerts: {
          label: 'Brīdinājumi',
          title: 'Brīdinājumi un automātiski signāli',
          description:
            'Scenāriji lietotājiem, kuri vēlas reaģēt uz kursu izmaiņām, jauniem kredītu piedāvājumiem vai nekustamā īpašuma cenu kritumu.',
          searchPlaceholder: 'Meklējiet brīdinājumu, piem. kurss, cena, piedāvājums',
          emptyTitle: 'Šim filtram atbilstoši brīdinājumi netika atrasti',
          emptyDescription: 'Noņemiet daļu atslēgvārdu un mēģiniet vēlreiz.',
          cards: [
            {
              title: 'Valūtas kursa brīdinājums',
              description: 'Nosūta signālu, kad izvēlētais valūtu pāris sasniedz norādīto slieksni.',
              metric: 'Augšējie un apakšējie sliekšņi',
              actionLabel: 'Doties uz valūtām',
            },
            {
              title: 'Jauna kredīta piedāvājuma brīdinājums',
              description: 'Uztver jaunus vai uzlabotus piedāvājumus izvēlētajā valstī un kredīta segmentā.',
              metric: 'Filtri pēc valsts un produkta',
              actionLabel: 'Doties uz bankām',
            },
            {
              title: 'Nekustamā īpašuma cenas krituma brīdinājums',
              description: 'Uzrauga sludinājumus un parāda, kad parādās investīciju iespēja.',
              metric: 'Signāli izvēlētajām pilsētām',
              actionLabel: 'Doties uz nekustamo īpašumu',
            },
          ],
        },
        rankings: {
          label: 'Reitingi',
          title: 'Valstu un pilsētu reitingi',
          description: 'Kārtojiet valstis pēc finansējuma pieejamības, investīciju potenciāla un dzīves dārdzības.',
          searchPlaceholder: 'Meklējiet reitingu, piem. valsts, pilsēta, investīcija',
          emptyTitle: 'Šim vaicājumam reitingi netika atrasti',
          emptyDescription: 'Atgriezieties pie noklusējuma skata, lai redzētu pilnu sarakstu.',
          cards: [
            {
              title: 'Finansējuma pieejamības reitings',
              description:
                'Apvieno GPL, prasīto pirmo iemaksu un lēmuma pieņemšanas laiku vienā skaidrā valsts vērtējumā.',
              metric: 'Valsts līmeņa vērtējums',
              actionLabel: 'Doties uz bankām',
            },
            {
              title: 'Investīciju pilsētu reitings',
              description: 'Salīdzina pieprasījumu, ieejas cenu un iespējamo īres atdevi dažādās pilsētās.',
              metric: 'Labākās ES lokācijas',
              actionLabel: 'Doties uz nekustamo īpašumu',
            },
            {
              title: 'Valūtu stabilitātes reitings',
              description: 'Parāda, kur valūtu starpība un svārstīgums investoram ir viszemākais.',
              metric: '30 dienu svārstīguma rādītājs',
              actionLabel: 'Doties uz valūtām',
            },
          ],
        },
        comparators: {
          label: 'Salīdzinājumi',
          title: 'Scenāriju salīdzinājumi',
          description:
            'Salīdziniet valsti ar valsti, banku ar banku vai pilsētu ar pilsētu bez manuālas datu pārrakstīšanas.',
          searchPlaceholder: 'Meklējiet salīdzinājumu, piem. banka vs banka, valsts vs valsts',
          emptyTitle: 'Šai frāzei salīdzinājumi netika atrasti',
          emptyDescription: 'Mainiet vaicājumu vai izvēlieties citu cilni.',
          cards: [
            {
              title: 'Valsts pret valsti',
              description: 'Salīdzina ieejas izmaksas, finansējumu un valūtu kursa ietekmi divos izvēlētos tirgos.',
              metric: 'Skats blakus',
              actionLabel: 'Doties uz sākumlapu',
            },
            {
              title: 'Banka pret banku',
              description: 'Vienā skatā parāda GPL, maksājumu un formālo prasību atšķirības.',
              metric: 'Svarīgākie KPI vienuviet',
              actionLabel: 'Doties uz bankām',
            },
            {
              title: 'Pilsēta pret pilsētu',
              description: 'Salīdzina nekustamā īpašuma cenas, ienesīgumu un cenu pārmaiņu tempu.',
              metric: 'Vietējo tirgu analīze',
              actionLabel: 'Doties uz nekustamo īpašumu',
            },
          ],
        },
        lawsTaxes: {
          label: 'Likumi un nodokļi',
          title: 'Likumu un nodokļu ceļvedis',
          description:
            'Praktiski kontrolsaraksti nekustamā īpašuma iegādei, kredītiem un vietējiem pienākumiem dažādās valstīs.',
          searchPlaceholder: 'Meklējiet noteikumu vai nodokli, piem. notārs, nodoklis, reģistrācija',
          emptyTitle: 'Ceļvedi neizdevās atrast',
          emptyDescription: 'Pārbaudiet citu nodokļa vai pienākuma nosaukumu.',
          cards: [
            {
              title: 'Ieejas izmaksas un nodokļi',
              description: 'Skaidro pirkuma nodokļus, notāra izmaksas un reģistrācijas izdevumus.',
              metric: 'Mērķa valsts kontrolsaraksti',
              actionLabel: 'Doties uz kontaktiem',
            },
            {
              title: 'Īpašnieka pienākumi',
              description: 'Apkopo deklarēšanas, reģistrācijas, izīrēšanas un pamatprasības īpašniekiem.',
              metric: 'Versija rezidentiem un nerezidentiem',
              actionLabel: 'Doties uz nekustamo īpašumu',
            },
            {
              title: 'Kredīta formalitātes',
              description: 'Izskaidro dokumentus, vērtēšanas loģiku un vietējās banku prasības.',
              metric: 'Dokumentu karte',
              actionLabel: 'Doties uz bankām',
            },
          ],
        },
        investorZone: {
          label: 'Investora zona',
          title: 'Investora zona',
          description: 'Gatavi scenāriji ROI, valsts riska un investīcijas likviditātes izvērtēšanai.',
          searchPlaceholder: 'Meklējiet investīciju tēmu, piem. ROI, ienesīgums, risks',
          emptyTitle: 'Investīciju scenāriji netika atrasti',
          emptyDescription: 'Paplašiniet meklēšanu vai izvēlieties citu datu jomu.',
          cards: [
            {
              title: 'ROI karte',
              description: 'Novērtē iespējamo atdevi dažādos tirgos un dažādiem nekustamā īpašuma veidiem.',
              metric: 'ROI un ienesīgums vienā kartītē',
              actionLabel: 'Doties uz nekustamo īpašumu',
            },
            {
              title: 'Valsts riska novērtējums',
              description: 'Apvieno valūtu svārstīgumu, finansējuma izmaksas un regulatīvo vidi.',
              metric: 'Investora riska rādītājs',
              actionLabel: 'Doties uz valūtām',
            },
            {
              title: 'Kapitāla ieejas scenāriji',
              description: 'Palīdz izvēlēties starp pašu līdzekļiem, kredītu un jaukto stratēģiju.',
              metric: '3 finansējuma modeļi',
              actionLabel: 'Doties uz bankām',
            },
          ],
        },
      },
    },
    errors: {
      notFoundBadge: 'Kļūda 404',
      notFoundTitle: 'Šo lapu neizdevās atrast',
      notFoundDescription:
        'Adrese var būt novecojusi vai ievadīta ar kļūdu. Atgriezieties sākumlapā vai uzreiz atveriet svarīgākos platformas moduļus.',
      serverErrorBadge: 'Kļūda 500',
      serverErrorTitle: 'Mūsu pusē radās problēma',
      serverErrorDescription:
        'Šo skatu neizdevās korekti sagatavot. Lūdzu, mēģiniet vēlreiz pēc brīža vai sazinieties ar mums, ja problēma atkārtojas.',
      homeAction: 'Atgriezties sākumlapā',
      contactAction: 'Doties uz kontaktiem',
      banksAction: 'Skatīt kredītu piedāvājumus',
      currenciesAction: 'Pārbaudīt valūtu kursus',
    },
    legal: {
      disclaimerTitle: 'Juridisks paziņojums',
      currencyInformationalDisclaimer:
        'Valūtu kursi {country} tirgum ir sniegti tikai informatīviem nolūkiem. Noklusējuma skatā redzama vairāku bezmaksas avotu vidējā vērtība.',
      countryNoticePending:
        'Detalizēti regulatīvie paziņojumi šai valstij tiek publicēti pakāpeniski un tiks pabeigti pirms pilnas produkta palaišanas ražošanas vidē.',
    },
  },
  'ready',
);
