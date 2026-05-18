import { defineTranslationResource } from '../i18n.types';

export default defineTranslationResource(
  'en',
  {
    languageSwitcher: {
      ariaLabel: 'Choose language',
      menuTitle: 'Choose language (24 EU languages)',
      selectedTooltip: 'Selected language: {language}',
    },
    header: {
      brandAriaLabel: 'UnionVault.eu — home page',
      navigationAriaLabel: 'Main navigation',
      mobileMenuAriaLabel: 'Open navigation menu',
      mobileCountryLabel: 'Current country',
      navContact: 'Contact',
      navBanks: 'Credit offers',
      navCurrencies: 'Exchange rates',
      navRealEstate: 'Real estate',
      navDiscover: 'New sections',
    },
    footer: {
      rightsReserved: 'All rights reserved.',
      lastUpdatedLabel: 'Last updated',
    },
    home: {
      heroSubtitle: 'Your trusted vault of EU financial data',
      heroDescription:
        'A pan-European platform aggregating financial data from 27 European Union countries. Compare credit offers, track exchange rates, and analyze real-estate prices in one place.',
      currentCountryLabel: 'Current country',
      modulesTitle: 'Platform modules',
      modules: {
        statusAvailable: 'Available',
        banksTitle: 'Credit offers',
        banksDescription: 'Compare mortgage, consumer, and business loans from banks across 27 EU countries.',
        banksAction: 'Compare offers',
        currenciesTitle: 'Exchange rates',
        currenciesDescription: 'Current European exchange rates updated four times per day.',
        currenciesAction: 'See rates',
        realEstateTitle: 'Real-estate prices',
        realEstateDescription: 'Apartments, houses, and land from 27 EU countries visualized on Google Maps.',
        realEstateAction: 'Browse properties',
      },
      features: {
        languages: '24 EU languages',
        countries: '27 countries',
        cadence: 'Updated 4× per day',
        compliance: 'GDPR / PSD2 / MiFID II',
        maps: 'Google Maps',
        sources: 'Official data sources',
      },
      info: {
        complianceTitle: 'Regulatory compliance',
        complianceDescription:
          'GDPR, PSD2, MiFID II, DAC7, and the AI Act — the product roadmap is aligned with EU regulatory requirements.',
        sourcesTitle: 'Trusted data sources',
        sourcesDescription: 'Data is sourced from central banks, EBA, ESMA, EUR-Lex, and the ECB.',
        aiTitle: 'Built with AI support',
        aiDescription: 'The product is delivered by an AI-assisted engineering workflow.',
      },
      exploreTitle: 'New sections and search tools',
      exploreDescription:
        'We added 6 new sections to help users discover stronger scenarios, countries, and investment directions faster.',
    },
    discover: {
      badge: 'New',
      title: 'UnionVault new sections hub',
      description:
        'Explore calculators, alerts, rankings, comparators, legal guides, and investor tools. Each section includes a focused mini-search and ready-to-use scenarios.',
      searchLabel: 'Search within the active tab',
      stats: {
        tools: '18 scenarios and tools',
        countries: '27 EU countries',
        datasets: 'Shared banking, currency, and real-estate data',
      },
      tabs: {
        calculators: {
          label: 'Calculators',
          title: 'Financial decision calculators',
          description:
            'Fast tools for estimating loan payments, acquisition costs, and investment returns across countries.',
          searchPlaceholder: 'Search calculators, e.g. mortgage, ROI, acquisition cost',
          emptyTitle: 'No calculators match this search',
          emptyDescription: 'Try a shorter phrase or switch to another tab.',
          cards: [
            {
              title: 'Mortgage payment calculator',
              description:
                'Compares monthly payments across countries, down-payment levels, and interest-rate assumptions.',
              metric: '10, 20, and 30-year scenarios',
              actionLabel: 'Open banks',
            },
            {
              title: 'Property acquisition cost calculator',
              description: 'Estimates notary fees, taxes, local charges, and total entry cost for a selected country.',
              metric: 'Transaction costs included',
              actionLabel: 'Open real estate',
            },
            {
              title: 'Currency impact calculator',
              description: 'Calculates FX conversion, spread, and payment sensitivity across exchange-rate scenarios.',
              metric: 'Multi-feed currency view',
              actionLabel: 'Open currencies',
            },
          ],
        },
        alerts: {
          label: 'Alerts',
          title: 'Alerts and proactive signals',
          description:
            'Scenarios for users who want to react to rate changes, new credit offers, or price drops in real estate.',
          searchPlaceholder: 'Search alerts, e.g. rate, property, offer',
          emptyTitle: 'No alerts match this filter',
          emptyDescription: 'Remove part of the search term and try again.',
          cards: [
            {
              title: 'Exchange-rate alert',
              description: 'Triggers when a selected FX pair reaches your upper or lower threshold.',
              metric: 'Upper and lower targets',
              actionLabel: 'Open currencies',
            },
            {
              title: 'New credit-offer alert',
              description: 'Tracks fresh or improved banking offers for the selected country and product type.',
              metric: 'Country and product filters',
              actionLabel: 'Open banks',
            },
            {
              title: 'Property price-drop alert',
              description: 'Highlights listings that move into an opportunity zone for investors.',
              metric: 'Signals for chosen cities',
              actionLabel: 'Open real estate',
            },
          ],
        },
        rankings: {
          label: 'Rankings',
          title: 'Country and city rankings',
          description: 'Sort countries by financing accessibility, investment attractiveness, and living costs.',
          searchPlaceholder: 'Search rankings, e.g. country, city, investment',
          emptyTitle: 'No rankings found',
          emptyDescription: 'Return to the default view to explore the full ranking set.',
          cards: [
            {
              title: 'Financing accessibility ranking',
              description: 'Combines APR, down-payment expectations, and decision time into one country score.',
              metric: 'Country-level scoring',
              actionLabel: 'Open banks',
            },
            {
              title: 'Investment city ranking',
              description: 'Compares demand, entry price, and rental-return potential for city markets.',
              metric: 'Top EU locations',
              actionLabel: 'Open real estate',
            },
            {
              title: 'Currency stability ranking',
              description: 'Shows where spreads and FX volatility are the lowest for capital planning.',
              metric: '30-day volatility view',
              actionLabel: 'Open currencies',
            },
          ],
        },
        comparators: {
          label: 'Comparators',
          title: 'Scenario comparators',
          description: 'Compare country vs country, bank vs bank, or city vs city without manual spreadsheet work.',
          searchPlaceholder: 'Search comparators, e.g. bank vs bank, country vs country',
          emptyTitle: 'No comparators found',
          emptyDescription: 'Try another phrase or explore a different tab.',
          cards: [
            {
              title: 'Country vs country',
              description: 'Compares entry costs, financing, and FX exposure for two selected markets.',
              metric: 'Side-by-side view',
              actionLabel: 'Open home',
            },
            {
              title: 'Bank vs bank',
              description: 'Highlights APR, monthly payment, and documentation differences in one view.',
              metric: 'Key KPIs aligned',
              actionLabel: 'Open banks',
            },
            {
              title: 'City vs city',
              description: 'Compares property prices, rental yield, and growth potential for urban markets.',
              metric: 'Local-market analysis',
              actionLabel: 'Open real estate',
            },
          ],
        },
        lawsTaxes: {
          label: 'Laws & taxes',
          title: 'Laws and taxes guide',
          description:
            'Practical checklists covering acquisition rules, taxes, and local obligations across countries.',
          searchPlaceholder: 'Search legal topics, e.g. tax, notary, registration',
          emptyTitle: 'No legal guide found',
          emptyDescription: 'Try another term for the tax or requirement you need.',
          cards: [
            {
              title: 'Entry costs and taxes',
              description: 'Explains purchase taxes, notary fees, and registration costs for target countries.',
              metric: 'Country checklist',
              actionLabel: 'Open contact',
            },
            {
              title: 'Owner obligations',
              description: 'Summarizes registration, tenancy, and reporting responsibilities for owners.',
              metric: 'Resident and non-resident view',
              actionLabel: 'Open real estate',
            },
            {
              title: 'Credit paperwork map',
              description: 'Outlines required documents, scoring logic, and local financing formalities.',
              metric: 'Document pathway',
              actionLabel: 'Open banks',
            },
          ],
        },
        investorZone: {
          label: 'Investor zone',
          title: 'Investor zone',
          description: 'Ready-made views for ROI, country risk, capital-entry strategy, and market timing.',
          searchPlaceholder: 'Search investor topics, e.g. ROI, yield, risk',
          emptyTitle: 'No investor scenarios found',
          emptyDescription: 'Widen the search or select another section.',
          cards: [
            {
              title: 'ROI heatmap',
              description: 'Estimates return potential for multiple property types and market profiles.',
              metric: 'ROI and yield together',
              actionLabel: 'Open real estate',
            },
            {
              title: 'Country risk score',
              description: 'Combines FX volatility, financing cost, and regulatory complexity into one view.',
              metric: 'Investor risk score',
              actionLabel: 'Open currencies',
            },
            {
              title: 'Capital-entry scenarios',
              description: 'Supports decisions between cash, debt, and blended financing strategies.',
              metric: '3 funding models',
              actionLabel: 'Open banks',
            },
          ],
        },
      },
    },
    errors: {
      notFoundBadge: 'Error 404',
      notFoundTitle: 'We could not find this page',
      notFoundDescription:
        'The address may be outdated or mistyped. Return to the home page or jump straight to the most important platform modules.',
      serverErrorBadge: 'Error 500',
      serverErrorTitle: 'Something went wrong on our side',
      serverErrorDescription:
        'We could not prepare this view correctly. Please try again shortly or contact us if the problem keeps happening.',
      homeAction: 'Back to home page',
      contactAction: 'Go to contact',
      banksAction: 'View credit offers',
      currenciesAction: 'Check exchange rates',
    },
    legal: {
      disclaimerTitle: 'Legal notice',
      currencyInformationalDisclaimer:
        'Exchange rates for the {country} market are provided for information only. The default view shows an average based on several free feeds.',
      countryNoticePending:
        'Detailed regulatory notices for this country are being published incrementally and will be completed before the full production launch.',
    },
  },
  'ready',
);
