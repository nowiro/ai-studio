import { defineTranslationResource } from '../i18n.types';

export default defineTranslationResource(
  'lt',
  {
    languageSwitcher: {
      ariaLabel: 'Pasirinkite kalbą',
      menuTitle: 'Pasirinkite kalbą (24 ES kalbos)',
      selectedTooltip: 'Pasirinkta kalba: {language}',
    },
    header: {
      brandAriaLabel: 'UnionVault.eu — pradžios puslapis',
      navigationAriaLabel: 'Pagrindinė navigacija',
      mobileMenuAriaLabel: 'Atverti navigacijos meniu',
      mobileCountryLabel: 'Dabartinė šalis',
      navContact: 'Kontaktai',
      navBanks: 'Kredito pasiūlymai',
      navCurrencies: 'Valiutų kursai',
      navRealEstate: 'Nekilnojamasis turtas',
      navDiscover: 'Nauji skyriai',
    },
    footer: {
      rightsReserved: 'Visos teisės saugomos.',
      lastUpdatedLabel: 'Paskutinį kartą atnaujinta',
    },
    home: {
      heroSubtitle: 'Jūsų patikimas ES finansinių duomenų centras',
      heroDescription:
        'Visos Europos platforma, agreguojanti finansinius duomenis iš 27 Europos Sąjungos šalių. Palyginkite kredito pasiūlymus, sekite valiutų kursus ir analizuokite nekilnojamojo turto kainas — viskas vienoje vietoje.',
      currentCountryLabel: 'Dabartinė šalis',
      modulesTitle: 'Platformos moduliai',
      modules: {
        statusAvailable: 'Prieinama',
        banksTitle: 'Kredito pasiūlymai',
        banksDescription: 'Palyginkite būsto, vartojimo ir verslo paskolas iš bankų 27 ES šalyse.',
        banksAction: 'Palyginti pasiūlymus',
        currenciesTitle: 'Valiutų kursai',
        currenciesDescription: 'Aktualūs Europos valiutų kursai, atnaujinami 4 kartus per dieną.',
        currenciesAction: 'Peržiūrėti kursus',
        realEstateTitle: 'Nekilnojamojo turto kainos',
        realEstateDescription: 'Butai, namai ir sklypai iš 27 ES šalių, vizualizuoti Google Maps žemėlapiuose.',
        realEstateAction: 'Naršyti objektus',
      },
      features: {
        languages: '24 ES kalbos',
        countries: '27 šalys',
        cadence: 'Atnaujinama 4× per dieną',
        compliance: 'GDPR / PSD2 / MiFID II',
        maps: 'Google Maps',
        sources: 'Oficialūs duomenų šaltiniai',
      },
      info: {
        complianceTitle: 'Atitiktis reglamentams',
        complianceDescription:
          'GDPR, PSD2, MiFID II, DAC7 ir AI Act — produkto plėtra planuojama taip, kad atitiktų ES reglamentavimo reikalavimus.',
        sourcesTitle: 'Patikimi duomenų šaltiniai',
        sourcesDescription: 'Duomenys gaunami iš centrinių bankų, EBA, ESMA, EUR-Lex ir ECB.',
        aiTitle: 'Kuriama pasitelkiant DI',
        aiDescription: 'Projektą įgyvendina DI agentų komanda ir automatizacija paremta inžinerinė praktika.',
      },
      exploreTitle: 'Nauji skyriai ir paieškos įrankiai',
      exploreDescription:
        'Pridėjome 6 naujus skyrius, kurie padeda greičiau atrasti geriausią investavimo kryptį, šalį ir veiksmų scenarijų.',
    },
    discover: {
      badge: 'Naujiena',
      title: 'UnionVault naujų skyrių centras',
      description:
        'Naršykite skaičiuokles, įspėjimus, reitingus, palyginimus, teisines gaires ir investuotojo zoną. Kiekvienas skyrius turi savo mini paiešką ir paruoštus scenarijus.',
      searchLabel: 'Ieškoti aktyvioje kortelėje',
      stats: {
        tools: '18 scenarijų ir įrankių',
        countries: '27 ES šalys',
        datasets: 'Bendri bankų, valiutų ir nekilnojamojo turto duomenys',
      },
      tabs: {
        calculators: {
          label: 'Skaičiuoklės',
          title: 'Finansinių sprendimų skaičiuoklės',
          description:
            'Greiti įrankiai įmokoms, įsigijimo kaštams ir investicijų grąžai apskaičiuoti skirtingose šalyse.',
          searchPlaceholder: 'Ieškokite skaičiuoklės, pvz. įmoka, ROI, įsigijimo kaina',
          emptyTitle: 'Pagal šią užklausą skaičiuoklių nerasta',
          emptyDescription: 'Pabandykite trumpesnę frazę arba pereikite į kitą kortelę.',
          cards: [
            {
              title: 'Paskolos įmokos skaičiuoklė',
              description: 'Lygina mėnesio įmoką pagal šalį, pradinį įnašą ir palūkanų normą.',
              metric: '10, 20 ir 30 metų scenarijai',
              actionLabel: 'Eiti į bankus',
            },
            {
              title: 'Nekilnojamojo turto įsigijimo kaštų skaičiuoklė',
              description:
                'Įvertina notaro išlaidas, mokesčius, vietinius rinkliavas ir bendrą įėjimo kainą pasirinktoje šalyje.',
              metric: 'Įtraukti sandorio kaštai',
              actionLabel: 'Eiti į nekilnojamąjį turtą',
            },
            {
              title: 'Valiutos poveikio skaičiuoklė',
              description:
                'Apskaičiuoja valiutos konvertavimą, skirtumą ir įmokos pokytį pagal skirtingus kursų scenarijus.',
              metric: 'Keli valiutų kursų šaltiniai',
              actionLabel: 'Eiti į valiutas',
            },
          ],
        },
        alerts: {
          label: 'Įspėjimai',
          title: 'Įspėjimai ir automatiniai signalai',
          description:
            'Scenarijai naudotojams, kurie nori greitai reaguoti į kurso pokyčius, naujus kredito pasiūlymus ar nekilnojamojo turto kainų kritimą.',
          searchPlaceholder: 'Ieškokite įspėjimo, pvz. kursas, kaina, pasiūlymas',
          emptyTitle: 'Pagal šį filtrą įspėjimų nerasta',
          emptyDescription: 'Pašalinkite dalį raktinių žodžių ir bandykite dar kartą.',
          cards: [
            {
              title: 'Valiutos kurso įspėjimas',
              description: 'Siunčia signalą, kai pasirinkta valiutų pora pasiekia nurodytą ribą.',
              metric: 'Viršutinės ir apatinės ribos',
              actionLabel: 'Eiti į valiutas',
            },
            {
              title: 'Naujo kredito pasiūlymo įspėjimas',
              description: 'Fiksuoja naujus arba pagerintus pasiūlymus pasirinktoje šalyje ir kredito segmente.',
              metric: 'Filtrai pagal šalį ir produktą',
              actionLabel: 'Eiti į bankus',
            },
            {
              title: 'Nekilnojamojo turto kainos kritimo įspėjimas',
              description: 'Stebi skelbimus ir parodo, kada atsiranda investicinė galimybė.',
              metric: 'Signalai pasirinktams miestams',
              actionLabel: 'Eiti į nekilnojamąjį turtą',
            },
          ],
        },
        rankings: {
          label: 'Reitingai',
          title: 'Šalių ir miestų reitingai',
          description: 'Rikiuokite šalis pagal finansavimo prieinamumą, investicinį potencialą ir pragyvenimo kaštus.',
          searchPlaceholder: 'Ieškokite reitingo, pvz. šalis, miestas, investicija',
          emptyTitle: 'Pagal šią užklausą reitingų nerasta',
          emptyDescription: 'Grįžkite į bendrą vaizdą, kad pamatytumėte visą sąrašą.',
          cards: [
            {
              title: 'Finansavimo prieinamumo reitingas',
              description:
                'Sujungia BVKKMN, reikalaujamą pradinį įnašą ir sprendimo laiką į vieną aiškų šalies įvertinimą.',
              metric: 'Šalies lygio vertinimas',
              actionLabel: 'Eiti į bankus',
            },
            {
              title: 'Investicinių miestų reitingas',
              description: 'Lygina paklausą, įėjimo kainą ir galimą nuomos grąžą skirtinguose miestuose.',
              metric: 'Geriausios ES lokacijos',
              actionLabel: 'Eiti į nekilnojamąjį turtą',
            },
            {
              title: 'Valiutų stabilumo reitingas',
              description: 'Parodo, kur valiutų skirtumas ir kurso svyravimai investuotojui yra mažiausi.',
              metric: '30 d. svyravimo rodiklis',
              actionLabel: 'Eiti į valiutas',
            },
          ],
        },
        comparators: {
          label: 'Palyginimai',
          title: 'Scenarijų palyginimai',
          description: 'Lyginkite šalį su šalimi, banką su banku arba miestą su miestu be rankinio duomenų perkėlimo.',
          searchPlaceholder: 'Ieškokite palyginimo, pvz. bankas vs bankas, šalis vs šalis',
          emptyTitle: 'Pagal šią frazę palyginimų nerasta',
          emptyDescription: 'Pakeiskite užklausą arba pasirinkite kitą kortelę.',
          cards: [
            {
              title: 'Šalis prieš šalį',
              description:
                'Palygina įėjimo kaštus, finansavimą ir valiutų kursų poveikį dviejose pasirinktose rinkose.',
              metric: 'Vaizdas greta',
              actionLabel: 'Eiti į pradžios puslapį',
            },
            {
              title: 'Bankas prieš banką',
              description: 'Viename vaizde parodo BVKKMN, įmokų ir formalių reikalavimų skirtumus.',
              metric: 'Svarbiausi KPI vienoje ašyje',
              actionLabel: 'Eiti į bankus',
            },
            {
              title: 'Miestas prieš miestą',
              description: 'Lygina nekilnojamojo turto kainas, pajamingumą ir kainų pokyčių tempą.',
              metric: 'Vietinių rinkų analizė',
              actionLabel: 'Eiti į nekilnojamąjį turtą',
            },
          ],
        },
        lawsTaxes: {
          label: 'Teisė ir mokesčiai',
          title: 'Teisės ir mokesčių gidas',
          description:
            'Praktiniai kontroliniai sąrašai apie nekilnojamojo turto įsigijimą, kreditus ir vietines prievoles skirtingose šalyse.',
          searchPlaceholder: 'Ieškokite taisyklės ar mokesčio, pvz. notaras, mokestis, registracija',
          emptyTitle: 'Gido rasti nepavyko',
          emptyDescription: 'Patikrinkite kitą mokesčio ar prievolės pavadinimą.',
          cards: [
            {
              title: 'Įėjimo kaštai ir mokesčiai',
              description: 'Paaiškina pirkimo mokesčius, notaro įkainius ir registracijos išlaidas.',
              metric: 'Tikslinės šalies kontroliniai sąrašai',
              actionLabel: 'Eiti į kontaktus',
            },
            {
              title: 'Savininko prievolės',
              description: 'Apibendrina deklaravimo, registracijos, nuomos ir pagrindinius formalius reikalavimus.',
              metric: 'Versija rezidentams ir nerezidentams',
              actionLabel: 'Eiti į nekilnojamąjį turtą',
            },
            {
              title: 'Kredito formalumai',
              description: 'Paaiškina dokumentus, vertinimo logiką ir vietinius bankų reikalavimus.',
              metric: 'Dokumentų žemėlapis',
              actionLabel: 'Eiti į bankus',
            },
          ],
        },
        investorZone: {
          label: 'Investuotojo zona',
          title: 'Investuotojo zona',
          description: 'Paruošti scenarijai ROI, šalies rizikai ir investicijos likvidumui vertinti.',
          searchPlaceholder: 'Ieškokite investavimo temos, pvz. ROI, pajamingumas, rizika',
          emptyTitle: 'Investicinių scenarijų nerasta',
          emptyDescription: 'Išplėskite paiešką arba pasirinkite kitą duomenų sritį.',
          cards: [
            {
              title: 'ROI žemėlapis',
              description: 'Įvertina galimą grąžą skirtingose rinkose ir pagal skirtingus nekilnojamojo turto tipus.',
              metric: 'ROI ir pajamingumas vienoje kortelėje',
              actionLabel: 'Eiti į nekilnojamąjį turtą',
            },
            {
              title: 'Šalies rizikos įvertinimas',
              description: 'Sujungia valiutų svyravimus, finansavimo kaštus ir reguliacinę aplinką.',
              metric: 'Investuotojo rizikos balas',
              actionLabel: 'Eiti į valiutas',
            },
            {
              title: 'Kapitalo įėjimo scenarijai',
              description: 'Padeda pasirinkti tarp nuosavų lėšų, kredito ir mišrios strategijos.',
              metric: '3 finansavimo modeliai',
              actionLabel: 'Eiti į bankus',
            },
          ],
        },
      },
    },
    errors: {
      notFoundBadge: 'Klaida 404',
      notFoundTitle: 'Šio puslapio rasti nepavyko',
      notFoundDescription:
        'Adresas gali būti pasenęs arba įvestas su klaida. Grįžkite į pradžios puslapį arba iškart atverkite svarbiausius platformos modulius.',
      serverErrorBadge: 'Klaida 500',
      serverErrorTitle: 'Mūsų pusėje įvyko problema',
      serverErrorDescription:
        'Šio vaizdo nepavyko tinkamai paruošti. Pabandykite dar kartą po akimirkos arba susisiekite su mumis, jei problema kartojasi.',
      homeAction: 'Grįžti į pradžios puslapį',
      contactAction: 'Eiti į kontaktus',
      banksAction: 'Peržiūrėti kredito pasiūlymus',
      currenciesAction: 'Tikrinti valiutų kursus',
    },
    legal: {
      disclaimerTitle: 'Teisinis pranešimas',
      currencyInformationalDisclaimer:
        'Valiutų kursai {country} rinkai pateikiami tik informaciniais tikslais. Numatytoje peržiūroje rodoma kelių nemokamų šaltinių vidutinė reikšmė.',
      countryNoticePending:
        'Išsamūs šios šalies reguliaciniai pranešimai skelbiami etapais ir bus užbaigti prieš pilną produkto paleidimą produkcinėje aplinkoje.',
    },
  },
  'ready',
);
