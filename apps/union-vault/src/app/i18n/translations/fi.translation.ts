import { defineTranslationResource } from '../i18n.types';

export default defineTranslationResource(
  'fi',
  {
    languageSwitcher: {
      ariaLabel: 'Valitse kieli',
      menuTitle: 'Valitse kieli (24 EU-kieltä)',
      selectedTooltip: 'Valittu kieli: {language}',
    },
    header: {
      brandAriaLabel: 'UnionVault.eu — etusivu',
      navigationAriaLabel: 'Päänavigaatio',
      mobileMenuAriaLabel: 'Avaa navigointivalikko',
      mobileCountryLabel: 'Nykyinen maa',
      navContact: 'Yhteystiedot',
      navBanks: 'Luottotarjoukset',
      navCurrencies: 'Valuuttakurssit',
      navRealEstate: 'Kiinteistöt',
      navDiscover: 'Uudet osiot',
    },
    footer: {
      rightsReserved: 'Kaikki oikeudet pidätetään.',
      lastUpdatedLabel: 'Viimeksi päivitetty',
    },
    home: {
      heroSubtitle: 'Luotettava EU:n taloustiedon keskuksesi',
      heroDescription:
        'Paneurooppalainen alusta, joka kokoaa yhteen taloustietoa 27 Euroopan unionin maasta. Vertaa luottotarjouksia, seuraa valuuttakursseja ja analysoi kiinteistöjen hintoja — kaikki yhdessä paikassa.',
      currentCountryLabel: 'Nykyinen maa',
      modulesTitle: 'Alustan moduulit',
      modules: {
        statusAvailable: 'Saatavilla',
        banksTitle: 'Luottotarjoukset',
        banksDescription: 'Vertaile asunto-, kulutus- ja yrityslainoja 27 EU-maan pankeista.',
        banksAction: 'Vertaa tarjouksia',
        currenciesTitle: 'Valuuttakurssit',
        currenciesDescription: 'Ajantasaiset eurooppalaiset valuuttakurssit, päivitetään neljä kertaa päivässä.',
        currenciesAction: 'Katso kurssit',
        realEstateTitle: 'Kiinteistöjen hinnat',
        realEstateDescription: 'Asunnot, talot ja tontit 27 EU-maasta visualisoituna Google Mapsissa.',
        realEstateAction: 'Selaa kohteita',
      },
      features: {
        languages: '24 EU-kieltä',
        countries: '27 maata',
        cadence: 'Päivitys 4×/päivä',
        compliance: 'GDPR / PSD2 / MiFID II',
        maps: 'Google Maps',
        sources: 'Viralliset tietolähteet',
      },
      info: {
        complianceTitle: 'Sääntelyn mukaisuus',
        complianceDescription:
          'GDPR, PSD2, MiFID II, DAC7 ja AI Act — tuotteen kehitys suunnitellaan EU-sääntelyn täyttä noudattamista varten.',
        sourcesTitle: 'Luotetut tietolähteet',
        sourcesDescription: 'Tiedot tulevat keskuspankeilta, EBA:lta, ESMA:lta, EUR-Lexistä ja EKP:ltä.',
        aiTitle: 'Rakennettu tekoälyn tuella',
        aiDescription:
          'Projektia toteutetaan tekoälyagenttien ja automaatiota hyödyntävän ohjelmistokehityksen voimin.',
      },
      exploreTitle: 'Uudet osiot ja hakutyökalut',
      exploreDescription:
        'Lisäsimme 6 uutta osiota, jotka auttavat löytämään nopeammin sopivan sijoitussuunnan, maan ja parhaan toimintaskenaarion.',
    },
    discover: {
      badge: 'Uutta',
      title: 'UnionVaultin uusien osioiden keskus',
      description:
        'Tutustu laskureihin, hälytyksiin, rankingeihin, vertailuihin, oikeudellisiin oppaisiin ja sijoittajan työkaluihin. Jokaisessa osiossa on oma minihaku ja valmiita skenaarioita.',
      searchLabel: 'Hae aktiiviselta välilehdeltä',
      stats: {
        tools: '18 skenaariota ja työkalua',
        countries: '27 EU-maata',
        datasets: 'Yhteiset tiedot pankeista, valuutoista ja kiinteistöistä',
      },
      tabs: {
        calculators: {
          label: 'Laskurit',
          title: 'Taloudellisten päätösten laskurit',
          description:
            'Nopeat työkalut lainanhoitoerien, hankintakulujen ja sijoitusten kannattavuuden laskemiseen eri maissa.',
          searchPlaceholder: 'Hae laskuria, esim. lainaerä, ROI, ostokustannus',
          emptyTitle: 'Tälle haulle ei löytynyt laskureita',
          emptyDescription: 'Kokeile lyhyempää hakua tai siirry toiseen välilehteen.',
          cards: [
            {
              title: 'Lainan kuukausierälaskuri',
              description: 'Vertailee kuukausieriä maan, omarahoitusosuuden ja korkotason mukaan.',
              metric: '10, 20 ja 30 vuoden skenaariot',
              actionLabel: 'Siirry pankkeihin',
            },
            {
              title: 'Kiinteistön ostokustannuslaskuri',
              description: 'Arvioi notaarikulut, verot, paikalliset maksut ja kokonaiskustannuksen valitussa maassa.',
              metric: 'Sisältää transaktiokulut',
              actionLabel: 'Siirry kiinteistöihin',
            },
            {
              title: 'Valuuttalaskuri',
              description: 'Laskee valuutanvaihdon, spreadin ja lainaerän kustannuksen muutoksen eri kursseilla.',
              metric: 'Useita kurssisyötteitä',
              actionLabel: 'Siirry valuuttoihin',
            },
          ],
        },
        alerts: {
          label: 'Hälytykset',
          title: 'Hälytykset ja automaattiset ilmoitukset',
          description:
            'Skenaarioita käyttäjille, jotka haluavat reagoida kurssin, pankkitarjouksen tai kiinteistön hinnan muutoksiin.',
          searchPlaceholder: 'Hae hälytystä, esim. kurssi, hinta, tarjous',
          emptyTitle: 'Suodatinta vastaavia hälytyksiä ei löytynyt',
          emptyDescription: 'Poista osa avainsanoista ja yritä uudelleen.',
          cards: [
            {
              title: 'Valuuttakurssihälytys',
              description: 'Lähettää signaalin, kun valittu valuuttapari saavuttaa määritetyn raja-arvon.',
              metric: 'Ylä- ja alarajat',
              actionLabel: 'Siirry valuuttoihin',
            },
            {
              title: 'Uuden luottotarjouksen hälytys',
              description: 'Havaitsee uudet tai parannetut tarjoukset valitussa maassa ja luottosegmentissä.',
              metric: 'Suodattimet maan ja tuotteen mukaan',
              actionLabel: 'Siirry pankkeihin',
            },
            {
              title: 'Kiinteistön hinnanlaskuhälytys',
              description: 'Seuraa ilmoituksia ja kertoo, kun tarjolle tulee kiinnostava sijoitusmahdollisuus.',
              metric: 'Signaalit valituille kaupungeille',
              actionLabel: 'Siirry kiinteistöihin',
            },
          ],
        },
        rankings: {
          label: 'Rankingit',
          title: 'Maiden ja kaupunkien rankingit',
          description: 'Järjestä maat luoton saatavuuden, sijoituspotentiaalin ja elinkustannusten mukaan.',
          searchPlaceholder: 'Hae rankingia, esim. maa, kaupunki, sijoitus',
          emptyTitle: 'Tälle haulle ei löytynyt rankingeja',
          emptyDescription: 'Palaa yleisnäkymään nähdäksesi koko vertailun.',
          cards: [
            {
              title: 'Luoton saatavuuden ranking',
              description:
                'Yhdistää todellisen vuosikoron, vaaditun omarahoitusosuuden ja päätösajan yhdeksi selkeäksi maapisteytykseksi.',
              metric: 'Pisteytys maittain',
              actionLabel: 'Siirry pankkeihin',
            },
            {
              title: 'Sijoituskaupunkien ranking',
              description: 'Vertailee kysyntää, aloitushintaa ja vuokratuoton potentiaalia.',
              metric: 'EU:n huippusijainnit',
              actionLabel: 'Siirry kiinteistöihin',
            },
            {
              title: 'Valuuttavakauden ranking',
              description: 'Näyttää, missä spread ja kurssivaihtelu ovat sijoittajan kannalta alhaisimmat.',
              metric: '30 päivän volatiliteettimittari',
              actionLabel: 'Siirry valuuttoihin',
            },
          ],
        },
        comparators: {
          label: 'Vertailut',
          title: 'Skenaariovertailut',
          description:
            'Vertaa maata maahan, pankkia pankkiin tai kaupunkia kaupunkiin ilman manuaalista tietojen kopiointia.',
          searchPlaceholder: 'Hae vertailua, esim. pankki vs pankki, maa vs maa',
          emptyTitle: 'Tälle haulle ei löytynyt vertailuja',
          emptyDescription: 'Muuta hakua tai valitse toinen välilehti.',
          cards: [
            {
              title: 'Maa vs maa',
              description: 'Vertaa aloituskustannuksia, luottoa ja valuuttakursseja kahden valitun maan välillä.',
              metric: 'Rinnakkainen näkymä',
              actionLabel: 'Siirry etusivulle',
            },
            {
              title: 'Pankki vs pankki',
              description: 'Näyttää erot todellisessa vuosikorossa, kuukausierissä ja muodollisissa vaatimuksissa.',
              metric: 'Keskeiset KPI:t yhdessä näkymässä',
              actionLabel: 'Siirry pankkeihin',
            },
            {
              title: 'Kaupunki vs kaupunki',
              description: 'Vertailee kiinteistöjen hintoja, tuottoa ja hintojen muutosvauhtia.',
              metric: 'Paikallisten markkinoiden analyysi',
              actionLabel: 'Siirry kiinteistöihin',
            },
          ],
        },
        lawsTaxes: {
          label: 'Säännökset ja verot',
          title: 'Opas säännöksiin ja veroihin',
          description:
            'Käytännön tarkistuslistat kiinteistön ostoon, luottoihin ja paikallisiin velvoitteisiin eri maissa.',
          searchPlaceholder: 'Hae säädöstä tai veroa, esim. varainsiirtovero, notaari, rekisteröinti',
          emptyTitle: 'Opasta ei löytynyt',
          emptyDescription: 'Kokeile toista veron tai velvoitteen nimeä.',
          cards: [
            {
              title: 'Aloituskustannukset ja verot',
              description: 'Kuvaa ostoverot, notaarimaksut ja rekisteröintikulut.',
              metric: 'Kohdemaan tarkistuslistat',
              actionLabel: 'Siirry yhteystietoihin',
            },
            {
              title: 'Omistajan velvollisuudet',
              description: 'Tiivistää ilmoitukset, rekisteröinnin, vuokrauksen ja keskeiset muodolliset vaatimukset.',
              metric: 'Versio residentille ja ei-residentille',
              actionLabel: 'Siirry kiinteistöihin',
            },
            {
              title: 'Luoton hakemisen formaliteetit',
              description: 'Selittää dokumentit, pisteytyksen ja pankkien paikalliset vaatimukset.',
              metric: 'Dokumenttikartta',
              actionLabel: 'Siirry pankkeihin',
            },
          ],
        },
        investorZone: {
          label: 'Sijoittajan alue',
          title: 'Sijoittajan alue',
          description: 'Valmiit näkymät ROI:n, maariskin ja sijoituksen likviditeetin analysointiin.',
          searchPlaceholder: 'Hae sijoitusaihetta, esim. ROI, yield, riski',
          emptyTitle: 'Sijoitusskenaarioita ei löytynyt',
          emptyDescription: 'Laajenna hakua tai valitse toinen tietoalue.',
          cards: [
            {
              title: 'ROI-kartta',
              description: 'Arvioi tuottopotentiaalia eri markkinoilla ja eri kiinteistötyypeissä.',
              metric: 'ROI ja yield samalla kortilla',
              actionLabel: 'Siirry kiinteistöihin',
            },
            {
              title: 'Maariskin arvio',
              description: 'Yhdistää valuuttavaihtelun, rahoituskulut ja sääntely-ympäristön.',
              metric: 'Sijoittajan riskipisteytys',
              actionLabel: 'Siirry valuuttoihin',
            },
            {
              title: 'Pääoman sijoittamisen skenaariot',
              description: 'Auttaa valitsemaan käteisen, luoton ja yhdistelmästrategian välillä.',
              metric: '3 rahoitusmallia',
              actionLabel: 'Siirry pankkeihin',
            },
          ],
        },
      },
    },
    errors: {
      notFoundBadge: 'Virhe 404',
      notFoundTitle: 'Tätä sivua ei löytynyt',
      notFoundDescription:
        'Osoite voi olla vanhentunut tai kirjoitettu väärin. Palaa etusivulle tai siirry suoraan alustan tärkeimpiin moduuleihin.',
      serverErrorBadge: 'Virhe 500',
      serverErrorTitle: 'Puolellamme tapahtui ongelma',
      serverErrorDescription:
        'Näkymää ei voitu valmistella oikein. Yritä hetken kuluttua uudelleen tai ota meihin yhteyttä, jos ongelma toistuu.',
      homeAction: 'Palaa etusivulle',
      contactAction: 'Siirry yhteystietoihin',
      banksAction: 'Katso luottotarjoukset',
      currenciesAction: 'Tarkista valuuttakurssit',
    },
    legal: {
      disclaimerTitle: 'Oikeudellinen huomautus',
      currencyInformationalDisclaimer:
        'Markkinan {country} valuuttakurssit ovat vain informatiivisia. Oletusnäkymä näyttää useiden ilmaisten tietosyötteiden keskiarvon.',
      countryNoticePending:
        'Tämän maan yksityiskohtaisia sääntelyhuomautuksia julkaistaan vaiheittain, ja ne täydennetään ennen täyttä tuotantokäyttöönottoa.',
    },
  },
  'ready',
);
