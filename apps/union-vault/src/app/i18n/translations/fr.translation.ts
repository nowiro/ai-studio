import { defineTranslationResource } from '../i18n.types';

export default defineTranslationResource(
  'fr',
  {
    languageSwitcher: {
      ariaLabel: 'Choisir la langue',
      menuTitle: 'Choisir la langue (24 langues de l’UE)',
      selectedTooltip: 'Langue sélectionnée : {language}',
    },
    header: {
      brandAriaLabel: 'UnionVault.eu — page d’accueil',
      navigationAriaLabel: 'Navigation principale',
      mobileMenuAriaLabel: 'Ouvrir le menu de navigation',
      mobileCountryLabel: 'Pays actuel',
      navContact: 'Contact',
      navBanks: 'Offres de crédit',
      navCurrencies: 'Taux de change',
      navRealEstate: 'Immobilier',
      navDiscover: 'Nouvelles rubriques',
    },
    footer: {
      rightsReserved: 'Tous droits réservés.',
      lastUpdatedLabel: 'Dernière mise à jour',
    },
    home: {
      heroSubtitle: 'Votre référence de confiance pour les données financières de l’UE',
      heroDescription:
        'Une plateforme paneuropéenne qui agrège des données financières issues de 27 pays de l’Union européenne. Comparez les offres de crédit, suivez les taux de change et analysez les prix de l’immobilier — le tout au même endroit.',
      currentCountryLabel: 'Pays actuel',
      modulesTitle: 'Modules de la plateforme',
      modules: {
        statusAvailable: 'Disponible',
        banksTitle: 'Offres de crédit',
        banksDescription:
          'Comparez les prêts hypothécaires, à la consommation et professionnels proposés par des banques de 27 pays de l’UE.',
        banksAction: 'Comparer les offres',
        currenciesTitle: 'Taux de change',
        currenciesDescription: 'Taux de change européens actualisés quatre fois par jour.',
        currenciesAction: 'Voir les taux',
        realEstateTitle: 'Prix de l’immobilier',
        realEstateDescription: 'Appartements, maisons et terrains de 27 pays de l’UE visualisés sur Google Maps.',
        realEstateAction: 'Parcourir les biens',
      },
      features: {
        languages: '24 langues de l’UE',
        countries: '27 pays',
        cadence: 'Mise à jour 4×/jour',
        compliance: 'GDPR / PSD2 / MiFID II',
        maps: 'Google Maps',
        sources: 'Données de sources officielles',
      },
      info: {
        complianceTitle: 'Conformité réglementaire',
        complianceDescription:
          'GDPR, PSD2, MiFID II, DAC7 et AI Act — le développement du produit est pensé pour une conformité complète aux réglementations de l’UE.',
        sourcesTitle: 'Sources de données fiables',
        sourcesDescription:
          'Les données proviennent des banques centrales, de l’EBA, de l’ESMA, d’EUR-Lex et de la BCE.',
        aiTitle: 'Conçu avec l’appui de l’IA',
        aiDescription: 'Le projet est mené par des agents d’IA et une ingénierie soutenue par l’automatisation.',
      },
      exploreTitle: 'Nouvelles rubriques et outils de recherche',
      exploreDescription:
        'Nous avons ajouté 6 nouvelles sections pour aider à trouver plus vite la bonne direction d’investissement, le bon pays et le meilleur scénario d’action.',
    },
    discover: {
      badge: 'Nouveau',
      title: 'Centre des nouvelles rubriques UnionVault',
      description:
        'Parcourez calculateurs, alertes, classements, comparateurs, guides juridiques et espace investisseur. Chaque rubrique dispose de sa propre mini-recherche et de scénarios prêts à l’emploi.',
      searchLabel: 'Rechercher dans l’onglet actif',
      stats: {
        tools: '18 scénarios et outils',
        countries: '27 pays de l’UE',
        datasets: 'Données communes pour les banques, les devises et l’immobilier',
      },
      tabs: {
        calculators: {
          label: 'Calculateurs',
          title: 'Calculateurs de décision financière',
          description:
            'Des outils rapides pour calculer les mensualités, les coûts d’acquisition et la rentabilité des investissements selon les pays.',
          searchPlaceholder: 'Rechercher un calculateur, ex. mensualité, ROI, coût d’achat',
          emptyTitle: 'Aucun calculateur pour cette recherche',
          emptyDescription: 'Essayez une formule plus courte ou passez à un autre onglet.',
          cards: [
            {
              title: 'Calculateur de mensualité de crédit',
              description: 'Compare la mensualité selon le pays, l’apport personnel et le taux d’intérêt.',
              metric: 'Scénarios sur 10, 20 et 30 ans',
              actionLabel: 'Aller vers les banques',
            },
            {
              title: 'Calculateur de coût d’acquisition immobilière',
              description:
                'Estime les frais de notaire, les taxes, les frais locaux et le coût d’entrée pour le pays choisi.',
              metric: 'Inclut les frais de transaction',
              actionLabel: 'Aller vers l’immobilier',
            },
            {
              title: 'Calculateur de change',
              description:
                'Calcule la conversion, le spread et l’évolution du coût de la mensualité selon différents taux.',
              metric: 'Plusieurs flux de taux',
              actionLabel: 'Aller vers les devises',
            },
          ],
        },
        alerts: {
          label: 'Alertes',
          title: 'Alertes et notifications automatiques',
          description:
            'Des scénarios pour les utilisateurs qui veulent réagir à l’évolution d’un taux, d’une offre bancaire ou du prix d’un bien immobilier.',
          searchPlaceholder: 'Rechercher une alerte, ex. taux, prix, offre',
          emptyTitle: 'Aucune alerte ne correspond au filtre',
          emptyDescription: 'Supprimez une partie des mots-clés et réessayez.',
          cards: [
            {
              title: 'Alerte de taux de change',
              description: 'Envoie un signal lorsque la paire de devises choisie atteint le seuil défini.',
              metric: 'Seuils hauts et bas',
              actionLabel: 'Aller vers les devises',
            },
            {
              title: 'Alerte de nouvelle offre de crédit',
              description:
                'Repère les offres nouvelles ou améliorées dans le pays et le segment de crédit sélectionnés.',
              metric: 'Filtres par pays et par produit',
              actionLabel: 'Aller vers les banques',
            },
            {
              title: 'Alerte de baisse de prix immobilier',
              description: 'Surveille les annonces et signale lorsqu’une opportunité d’investissement apparaît.',
              metric: 'Signaux pour les villes sélectionnées',
              actionLabel: 'Aller vers l’immobilier',
            },
          ],
        },
        rankings: {
          label: 'Classements',
          title: 'Classements des pays et des villes',
          description:
            'Classez les pays selon l’accessibilité du crédit, le potentiel d’investissement et le coût de la vie.',
          searchPlaceholder: 'Rechercher un classement, ex. pays, ville, investissement',
          emptyTitle: 'Aucun classement pour cette recherche',
          emptyDescription: 'Revenez à la vue générale pour voir l’ensemble du classement.',
          cards: [
            {
              title: 'Classement de l’accessibilité au crédit',
              description: 'Combine le TAEG, l’apport demandé et le délai de décision en un score pays lisible.',
              metric: 'Score par pays',
              actionLabel: 'Aller vers les banques',
            },
            {
              title: 'Classement des villes d’investissement',
              description: 'Compare la demande, le prix d’entrée et le potentiel de rendement locatif.',
              metric: 'Top localisations de l’UE',
              actionLabel: 'Aller vers l’immobilier',
            },
            {
              title: 'Classement de la stabilité des devises',
              description: 'Montre où le spread et la volatilité des taux sont les plus faibles pour l’investisseur.',
              metric: 'Indicateur de volatilité sur 30 jours',
              actionLabel: 'Aller vers les devises',
            },
          ],
        },
        comparators: {
          label: 'Comparateurs',
          title: 'Comparateurs de scénarios',
          description:
            'Comparez pays contre pays, banque contre banque ou ville contre ville sans ressaisie manuelle des données.',
          searchPlaceholder: 'Rechercher un comparateur, ex. banque vs banque, pays vs pays',
          emptyTitle: 'Aucune comparaison pour cette recherche',
          emptyDescription: 'Modifiez la requête ou choisissez un autre onglet.',
          cards: [
            {
              title: 'Pays vs pays',
              description: 'Compare les coûts d’entrée, le crédit et les taux de change pour deux pays sélectionnés.',
              metric: 'Vue côte à côte',
              actionLabel: 'Aller à l’accueil',
            },
            {
              title: 'Banque vs banque',
              description: 'Met en évidence les différences de TAEG, de mensualité et d’exigences formelles.',
              metric: 'KPI clés sur une seule vue',
              actionLabel: 'Aller vers les banques',
            },
            {
              title: 'Ville vs ville',
              description: 'Compare les prix de l’immobilier, la rentabilité et le rythme d’évolution des prix.',
              metric: 'Analyse des marchés locaux',
              actionLabel: 'Aller vers l’immobilier',
            },
          ],
        },
        lawsTaxes: {
          label: 'Règles et taxes',
          title: 'Guide des règles et de la fiscalité',
          description:
            'Des checklists pratiques pour l’achat immobilier, les crédits et les obligations locales selon les pays.',
          searchPlaceholder: 'Rechercher une règle ou une taxe, ex. taxe, notaire, enregistrement',
          emptyTitle: 'Aucun guide trouvé',
          emptyDescription: 'Essayez un autre nom de taxe ou d’obligation.',
          cards: [
            {
              title: 'Coûts d’entrée et taxes',
              description: 'Présente les taxes à l’achat, les frais de notaire et les coûts d’enregistrement.',
              metric: 'Checklists par pays ciblé',
              actionLabel: 'Aller vers le contact',
            },
            {
              title: 'Obligations du propriétaire',
              description: 'Résume les déclarations, l’enregistrement, la location et les principales formalités.',
              metric: 'Version résident et non-résident',
              actionLabel: 'Aller vers l’immobilier',
            },
            {
              title: 'Formalités de crédit',
              description: 'Explique les documents, le scoring et les exigences locales des banques.',
              metric: 'Carte des documents',
              actionLabel: 'Aller vers les banques',
            },
          ],
        },
        investorZone: {
          label: 'Espace investisseur',
          title: 'Espace investisseur',
          description:
            'Un ensemble d’idées prêtes à l’analyse du ROI, du risque pays et de la liquidité de l’investissement.',
          searchPlaceholder: 'Rechercher un sujet d’investissement, ex. ROI, rendement, risque',
          emptyTitle: 'Aucun scénario d’investissement',
          emptyDescription: 'Élargissez la recherche ou choisissez un autre périmètre de données.',
          cards: [
            {
              title: 'Carte du ROI',
              description: 'Estime le potentiel de rendement selon les marchés et les types de biens.',
              metric: 'ROI et rendement sur une même carte',
              actionLabel: 'Aller vers l’immobilier',
            },
            {
              title: 'Évaluation du risque pays',
              description:
                'Combine la volatilité des devises, les coûts de financement et l’environnement réglementaire.',
              metric: 'Score de risque investisseur',
              actionLabel: 'Aller vers les devises',
            },
            {
              title: 'Scénarios d’entrée de capital',
              description: 'Aide à choisir entre financement en fonds propres, crédit et stratégie mixte.',
              metric: '3 modèles de financement',
              actionLabel: 'Aller vers les banques',
            },
          ],
        },
      },
    },
    errors: {
      notFoundBadge: 'Erreur 404',
      notFoundTitle: 'Nous n’avons pas trouvé cette page',
      notFoundDescription:
        'L’adresse est peut-être obsolète ou mal saisie. Revenez à la page d’accueil ou accédez directement aux principaux modules de la plateforme.',
      serverErrorBadge: 'Erreur 500',
      serverErrorTitle: 'Un problème est survenu de notre côté',
      serverErrorDescription:
        'Nous n’avons pas pu préparer cette vue correctement. Réessayez dans un instant ou contactez-nous si le problème persiste.',
      homeAction: 'Retour à l’accueil',
      contactAction: 'Aller vers le contact',
      banksAction: 'Voir les offres de crédit',
      currenciesAction: 'Consulter les taux de change',
    },
    legal: {
      disclaimerTitle: 'Information juridique',
      currencyInformationalDisclaimer:
        'Les taux du marché {country} sont fournis à titre informatif. La vue par défaut affiche une moyenne issue de plusieurs flux gratuits.',
      countryNoticePending:
        'Les mentions réglementaires détaillées pour ce pays sont publiées par étapes et seront complétées avant le lancement complet en production.',
    },
  },
  'ready',
);
