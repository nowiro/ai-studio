import { defineTranslationResource } from '../i18n.types';

export default defineTranslationResource(
  'hu',
  {
    languageSwitcher: {
      ariaLabel: 'Nyelv kiválasztása',
      menuTitle: 'Nyelv kiválasztása (24 uniós nyelv)',
      selectedTooltip: 'Kiválasztott nyelv: {language}',
    },
    header: {
      brandAriaLabel: 'UnionVault.eu — kezdőlap',
      navigationAriaLabel: 'Fő navigáció',
      mobileMenuAriaLabel: 'Navigációs menü megnyitása',
      mobileCountryLabel: 'Aktuális ország',
      navContact: 'Kapcsolat',
      navBanks: 'Hitelajánlatok',
      navCurrencies: 'Árfolyamok',
      navRealEstate: 'Ingatlanok',
      navDiscover: 'Új szekciók',
    },
    footer: {
      rightsReserved: 'Minden jog fenntartva.',
      lastUpdatedLabel: 'Utolsó frissítés',
    },
    home: {
      heroSubtitle: 'Az EU pénzügyi adatainak megbízható központja',
      heroDescription:
        'Páneurópai platform, amely az Európai Unió 27 országának pénzügyi adatait gyűjti egybe. Hasonlítsa össze a hitelajánlatokat, kövesse az árfolyamokat és elemezze az ingatlanárakat egy helyen.',
      currentCountryLabel: 'Aktuális ország',
      modulesTitle: 'A platform moduljai',
      modules: {
        statusAvailable: 'Elérhető',
        banksTitle: 'Hitelajánlatok',
        banksDescription: 'Jelzálog-, fogyasztási és üzleti hitelek összehasonlítása 27 uniós ország bankjaiból.',
        banksAction: 'Ajánlatok összehasonlítása',
        currenciesTitle: 'Árfolyamok',
        currenciesDescription: 'Aktuális európai árfolyamok, naponta négyszer frissítve.',
        currenciesAction: 'Árfolyamok megtekintése',
        realEstateTitle: 'Ingatlanárak',
        realEstateDescription: 'Lakások, házak és telkek 27 uniós országból, Google Térképen megjelenítve.',
        realEstateAction: 'Ingatlanok böngészése',
      },
      features: {
        languages: '24 uniós nyelv',
        countries: '27 ország',
        cadence: 'Napi 4× frissítés',
        compliance: 'GDPR / PSD2 / MiFID II',
        maps: 'Google Maps',
        sources: 'Hivatalos adatforrások',
      },
      info: {
        complianceTitle: 'Szabályozási megfelelés',
        complianceDescription:
          'GDPR, PSD2, MiFID II, DAC7 és AI Act — a termék fejlesztése az uniós szabályozási követelményekhez igazodik.',
        sourcesTitle: 'Megbízható adatforrások',
        sourcesDescription:
          'Az adatok központi bankoktól, az EBA-tól, az ESMA-tól, az EUR-Lexből és az EKB-tól származnak.',
        aiTitle: 'AI-támogatással készül',
        aiDescription: 'A terméket AI-val támogatott mérnöki munkafolyamat fejleszti.',
      },
      exploreTitle: 'Új szekciók és keresők',
      exploreDescription:
        '6 új szekciót adtunk hozzá, hogy gyorsabban megtalálja a jobb forgatókönyveket, országokat és befektetési irányokat.',
    },
    discover: {
      badge: 'Új',
      title: 'A UnionVault új szekcióinak központja',
      description:
        'Fedezzen fel kalkulátorokat, riasztásokat, rangsorokat, összehasonlítókat, jogi útmutatókat és befektetői eszközöket. Minden szekció saját mini keresőt és kész forgatókönyveket kínál.',
      searchLabel: 'Keresés az aktív fülön',
      stats: {
        tools: '18 forgatókönyv és eszköz',
        countries: '27 uniós ország',
        datasets: 'Közös banki, deviza- és ingatlanadatok',
      },
      tabs: {
        calculators: {
          label: 'Kalkulátorok',
          title: 'Pénzügyi döntési kalkulátorok',
          description:
            'Gyors eszközök törlesztőrészletek, vételi költségek és befektetési megtérülés becsléséhez országok között.',
          searchPlaceholder: 'Kalkulátor keresése, pl. jelzálog, ROI, vételi költség',
          emptyTitle: 'Nincs a kereséshez illő kalkulátor',
          emptyDescription: 'Próbáljon rövidebb kifejezést, vagy váltson másik fülre.',
          cards: [
            {
              title: 'Jelzáloghitel-törlesztő kalkulátor',
              description: 'Összeveti a havi részleteket ország, önerő és kamatfeltételezés szerint.',
              metric: '10, 20 és 30 éves forgatókönyvek',
              actionLabel: 'Bankok megnyitása',
            },
            {
              title: 'Ingatlanvásárlási költségkalkulátor',
              description:
                'Becsli a közjegyzői díjat, adókat, helyi illetékeket és a teljes belépési költséget a választott országban.',
              metric: 'Tranzakciós költségekkel együtt',
              actionLabel: 'Ingatlanok megnyitása',
            },
            {
              title: 'Devizahatás-kalkulátor',
              description:
                'Kiszámítja az átváltást, a spreadet és a fizetési érzékenységet különböző árfolyamhelyzetekben.',
              metric: 'Többforrású devizanézet',
              actionLabel: 'Devizák megnyitása',
            },
          ],
        },
        alerts: {
          label: 'Riasztások',
          title: 'Riasztások és proaktív jelzések',
          description:
            'Forgatókönyvek azoknak, akik árfolyamváltozásra, új hitelajánlatra vagy ingatlan-árcsökkenésre szeretnének reagálni.',
          searchPlaceholder: 'Riasztás keresése, pl. árfolyam, ingatlan, ajánlat',
          emptyTitle: 'Nincs a szűrőhöz illő riasztás',
          emptyDescription: 'Távolítsa el a keresőkifejezés egy részét, és próbálja újra.',
          cards: [
            {
              title: 'Árfolyamriasztás',
              description: 'Jelez, amikor a kiválasztott devizapár eléri a megadott felső vagy alsó küszöböt.',
              metric: 'Felső és alsó célértékek',
              actionLabel: 'Devizák megnyitása',
            },
            {
              title: 'Új hitelajánlat riasztás',
              description:
                'Figyeli az új vagy javított banki ajánlatokat a kiválasztott ország és terméktípus szerint.',
              metric: 'Ország- és termékszűrők',
              actionLabel: 'Bankok megnyitása',
            },
            {
              title: 'Ingatlan-árcsökkenés riasztás',
              description: 'Kiemeli azokat a hirdetéseket, amelyek a befektetők számára kedvező zónába kerülnek.',
              metric: 'Jelzések kiválasztott városokra',
              actionLabel: 'Ingatlanok megnyitása',
            },
          ],
        },
        rankings: {
          label: 'Rangsorok',
          title: 'Ország- és városrangsorok',
          description:
            'Rendezze az országokat a finanszírozás elérhetősége, a befektetési vonzerő és a megélhetési költség szerint.',
          searchPlaceholder: 'Rangsor keresése, pl. ország, város, befektetés',
          emptyTitle: 'Nincs találat a rangsorok között',
          emptyDescription: 'Térjen vissza az alapnézethez a teljes rangsor megtekintéséhez.',
          cards: [
            {
              title: 'Finanszírozási elérhetőségi rangsor',
              description: 'A THM-et, az önerőelvárást és a döntési időt egyetlen országpontszámban egyesíti.',
              metric: 'Országszintű pontozás',
              actionLabel: 'Bankok megnyitása',
            },
            {
              title: 'Befektetői városrangsor',
              description:
                'Összehasonlítja a keresletet, a belépési árat és a bérleti hozam lehetőségét a városi piacokon.',
              metric: 'Az EU legjobb helyszínei',
              actionLabel: 'Ingatlanok megnyitása',
            },
            {
              title: 'Devizastabilitási rangsor',
              description: 'Megmutatja, hol a legalacsonyabb a spread és az árfolyamingadozás a tőketervezéshez.',
              metric: '30 napos volatilitási nézet',
              actionLabel: 'Devizák megnyitása',
            },
          ],
        },
        comparators: {
          label: 'Összehasonlítók',
          title: 'Forgatókönyv-összehasonlítók',
          description:
            'Hasonlítson össze országot országgal, bankot bankkal vagy várost várossal kézi táblázatkezelés nélkül.',
          searchPlaceholder: 'Összehasonlító keresése, pl. bank vs bank, ország vs ország',
          emptyTitle: 'Nem található összehasonlító',
          emptyDescription: 'Próbáljon másik kifejezést, vagy nézzen meg egy másik fület.',
          cards: [
            {
              title: 'Ország vs ország',
              description:
                'Összeveti a belépési költségeket, a finanszírozást és a devizakitettséget két kiválasztott piacon.',
              metric: 'Egymás melletti nézet',
              actionLabel: 'Kezdőlap megnyitása',
            },
            {
              title: 'Bank vs bank',
              description: 'Egy nézetben emeli ki a THM, a havi részlet és a dokumentáció közti különbségeket.',
              metric: 'Összehangolt kulcs KPI-ok',
              actionLabel: 'Bankok megnyitása',
            },
            {
              title: 'Város vs város',
              description:
                'Összehasonlítja a lakásárakat, a bérleti hozamot és a növekedési potenciált a városi piacokon.',
              metric: 'Helyi piaci elemzés',
              actionLabel: 'Ingatlanok megnyitása',
            },
          ],
        },
        lawsTaxes: {
          label: 'Jog és adók',
          title: 'Jogi és adózási útmutató',
          description:
            'Gyakorlati ellenőrzőlisták a vásárlási szabályokról, adókról és helyi kötelezettségekről különböző országokban.',
          searchPlaceholder: 'Jogi téma keresése, pl. adó, közjegyző, regisztráció',
          emptyTitle: 'Nem található jogi útmutató',
          emptyDescription: 'Próbáljon másik kifejezést a keresett adóra vagy előírásra.',
          cards: [
            {
              title: 'Belépési költségek és adók',
              description:
                'Bemutatja a vételi adókat, közjegyzői díjakat és regisztrációs költségeket a célországokban.',
              metric: 'Országonkénti ellenőrzőlista',
              actionLabel: 'Kapcsolat megnyitása',
            },
            {
              title: 'Tulajdonosi kötelezettségek',
              description:
                'Összefoglalja a regisztrációs, bérbeadási és jelentési kötelezettségeket a tulajdonosok számára.',
              metric: 'Rezidens és nem rezidens nézet',
              actionLabel: 'Ingatlanok megnyitása',
            },
            {
              title: 'Hitelügyintézési térkép',
              description:
                'Felvázolja a szükséges dokumentumokat, a scoring logikát és a helyi finanszírozási formalitásokat.',
              metric: 'Dokumentumútvonal',
              actionLabel: 'Bankok megnyitása',
            },
          ],
        },
        investorZone: {
          label: 'Befektetői zóna',
          title: 'Befektetői zóna',
          description: 'Kész nézetek ROI-hoz, országkockázathoz, tőkebelépési stratégiához és piaci időzítéshez.',
          searchPlaceholder: 'Befektetői téma keresése, pl. ROI, hozam, kockázat',
          emptyTitle: 'Nincs befektetői forgatókönyv',
          emptyDescription: 'Bővítse a keresést, vagy válasszon másik szekciót.',
          cards: [
            {
              title: 'ROI hőtérkép',
              description: 'Becsli a megtérülési potenciált több ingatlantípus és piaci profil esetén.',
              metric: 'ROI és hozam együtt',
              actionLabel: 'Ingatlanok megnyitása',
            },
            {
              title: 'Országkockázati pontszám',
              description:
                'Egy nézetben egyesíti a devizaingadozást, a finanszírozási költséget és a szabályozási összetettséget.',
              metric: 'Befektetői kockázati pontszám',
              actionLabel: 'Devizák megnyitása',
            },
            {
              title: 'Tőkebelépési forgatókönyvek',
              description: 'Segít dönteni a készpénzes, hiteles és vegyes finanszírozási stratégiák között.',
              metric: '3 finanszírozási modell',
              actionLabel: 'Bankok megnyitása',
            },
          ],
        },
      },
    },
    errors: {
      notFoundBadge: '404-es hiba',
      notFoundTitle: 'Az oldal nem található',
      notFoundDescription:
        'Lehet, hogy a cím elavult vagy hibásan lett megadva. Térjen vissza a kezdőlapra, vagy nyissa meg közvetlenül a platform legfontosabb moduljait.',
      serverErrorBadge: '500-as hiba',
      serverErrorTitle: 'Hiba történt a mi oldalunkon',
      serverErrorDescription:
        'Nem sikerült megfelelően előkészíteni ezt a nézetet. Próbálja meg újra hamarosan, vagy lépjen kapcsolatba velünk, ha a probléma továbbra is fennáll.',
      homeAction: 'Vissza a kezdőlapra',
      contactAction: 'Kapcsolat megnyitása',
      banksAction: 'Hitelajánlatok megtekintése',
      currenciesAction: 'Árfolyamok ellenőrzése',
    },
    legal: {
      disclaimerTitle: 'Jogi tájékoztató',
      currencyInformationalDisclaimer:
        'A {country} piac árfolyamai kizárólag tájékoztató jellegűek. Az alapnézet több ingyenes adatfolyam átlagát mutatja.',
      countryNoticePending:
        'Az országra vonatkozó részletes szabályozási tájékoztatók fokozatosan jelennek meg, és a teljes éles indulás előtt válnak teljessé.',
    },
  },
  'ready',
);
