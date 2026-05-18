import type { Routes, UrlMatcher, UrlSegment } from '@angular/router';

import { EU_COUNTRIES } from './data/eu-countries';

/**
 * Route segments used by `union-vault`. Defined `as const` (per the repo's
 * `as const` registry convention — see `.ai/rules/angular.md` §5 "Routing:
 * no magic strings") so components/templates import the same constants the
 * router consumes.
 */
export const UnionVaultPath = {
  Home: '',
  Contact: 'contact',
  Banks: 'banks',
  Currencies: 'currencies',
  RealEstate: 'real-estate',
  Discover: 'discover',
  PrivacyPolicy: 'privacy-policy',
  NotFound: 'not-found',
  ServerError: 'server-error',
  Wildcard: '**',
} as const;

/**
 * Type-safe navigation helpers — build `[routerLink]` arrays for each page.
 * Pass the country `routeCode` (e.g. `'pl'`, `'de'`) as the first argument.
 */
export const UnionVaultNav = {
  home: (country: string): readonly ['/', string] => ['/', country] as const,
  contact: (country: string): readonly ['/', string, 'contact'] => ['/', country, 'contact'] as const,
  banks: (country: string): readonly ['/', string, 'banks'] => ['/', country, 'banks'] as const,
  currencies: (country: string): readonly ['/', string, 'currencies'] => ['/', country, 'currencies'] as const,
  realEstate: (country: string): readonly ['/', string, 'real-estate'] => ['/', country, 'real-estate'] as const,
  discover: (country: string): readonly ['/', string, 'discover'] => ['/', country, 'discover'] as const,
  privacyPolicy: (country: string): readonly ['/', string, 'privacy-policy'] =>
    ['/', country, 'privacy-policy'] as const,
} as const;

const SUPPORTED_ROUTE_CODES = new Set(EU_COUNTRIES.map((country) => country.routeCode));

/**
 * Custom URL matcher that consumes the first segment when (and only when) it is one
 * of the 27 supported EU country codes. The matched segment is exposed to nested
 * routes as `:countryCode`. Unknown segments fall through to the redirect rule below.
 */
const countryRouteMatcher: UrlMatcher = (segments: UrlSegment[]) => {
  const [firstSegment] = segments;

  if (!firstSegment || !SUPPORTED_ROUTE_CODES.has(firstSegment.path)) {
    return null;
  }

  return {
    consumed: [firstSegment],
    posParams: {
      countryCode: firstSegment,
    },
  };
};

export const APP_ROUTES: Routes = [
  {
    matcher: countryRouteMatcher,
    children: [
      {
        path: UnionVaultPath.Home,
        loadComponent: async () => import('./pages/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: UnionVaultPath.Contact,
        loadComponent: async () => import('./pages/contact/contact.component').then((m) => m.ContactPageComponent),
      },
      {
        path: UnionVaultPath.Banks,
        loadComponent: async () => import('./pages/banks/banks.component').then((m) => m.BanksPageComponent),
      },
      {
        path: UnionVaultPath.Currencies,
        loadComponent: async () => import('./pages/currency/currency.component').then((m) => m.CurrencyPageComponent),
      },
      {
        path: UnionVaultPath.RealEstate,
        loadComponent: async () =>
          import('./pages/real-estate/real-estate.component').then((m) => m.RealEstatePageComponent),
      },
      {
        path: UnionVaultPath.Discover,
        loadComponent: async () => import('./pages/discover/discover.component').then((m) => m.DiscoverPageComponent),
      },
      {
        path: UnionVaultPath.PrivacyPolicy,
        loadComponent: async () =>
          import('./pages/privacy-policy/privacy-policy.component').then((m) => m.PrivacyPolicyPageComponent),
      },
      {
        path: UnionVaultPath.NotFound,
        loadComponent: async () =>
          import('./pages/error-state/error-state.component').then((m) => m.ErrorStatePageComponent),
        data: { variant: 'notFound' },
      },
      {
        path: UnionVaultPath.ServerError,
        loadComponent: async () =>
          import('./pages/error-state/error-state.component').then((m) => m.ErrorStatePageComponent),
        data: { variant: 'serverError' },
      },
      { path: UnionVaultPath.Wildcard, redirectTo: UnionVaultPath.NotFound },
    ],
  },
  { path: '', redirectTo: 'pl', pathMatch: 'full' },
  { path: UnionVaultPath.Wildcard, redirectTo: 'pl/not-found' },
];
