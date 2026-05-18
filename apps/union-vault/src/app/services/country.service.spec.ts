import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { DEFAULT_COUNTRY, EU_COUNTRIES } from '../data/eu-countries';
import { EU_LANGUAGES } from '../data/eu-languages';
import { CountryService } from './country.service';

const TEST_ROUTES = [{ path: ':countryCode', children: [] }];

describe('CountryService', () => {
  let service: CountryService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideRouter(TEST_ROUTES)] });
    service = TestBed.inject(CountryService);
  });

  afterEach(() => localStorage.clear());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should default to Poland as selected country', () => {
    expect(service.selectedCountry().code).toBe('PL');
  });

  it('should default to Polish as selected language', () => {
    expect(service.selectedLanguage().code).toBe('pl');
  });

  it('should expose all 27 EU countries', () => {
    expect(service.countries.length).toBe(27);
  });

  it('should expose all 24 EU languages', () => {
    expect(service.languages.length).toBe(24);
  });

  it('should update selected country signal on selectCountry()', () => {
    const germany = EU_COUNTRIES.find((c) => c.code === 'DE')!;
    service.selectCountry(germany);
    expect(service.selectedCountry().code).toBe('DE');
  });

  it('should persist selected country to localStorage on selectCountry()', () => {
    const france = EU_COUNTRIES.find((c) => c.code === 'FR')!;
    service.selectCountry(france);
    expect(localStorage.getItem('uv_country')).toBe('FR');
  });

  it('should update selected language signal on selectLanguage()', () => {
    const german = EU_LANGUAGES.find((l) => l.code === 'de')!;
    service.selectLanguage(german);
    expect(service.selectedLanguage().code).toBe('de');
  });

  it('should persist selected language to localStorage on selectLanguage()', () => {
    const english = EU_LANGUAGES.find((l) => l.code === 'en')!;
    service.selectLanguage(english);
    expect(localStorage.getItem('uv_language')).toBe('en');
  });

  it('should resolve country from valid route code', () => {
    const resolved = service.resolveCountryFromRoute('de');
    expect(resolved.code).toBe('DE');
  });

  it('should fallback to DEFAULT_COUNTRY for unknown route code', () => {
    const resolved = service.resolveCountryFromRoute('xx');
    expect(resolved.code).toBe(DEFAULT_COUNTRY.code);
  });

  it('should sync selected country from route code', () => {
    service.syncCountryFromRoute('de');
    expect(service.selectedCountry().code).toBe('DE');
    expect(localStorage.getItem('uv_country')).toBe('DE');
    expect(service.selectedLanguage().code).toBe('de');
  });

  it('should restore country from localStorage on init', () => {
    localStorage.setItem('uv_country', 'IT');
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [provideRouter(TEST_ROUTES)] });
    const freshService = TestBed.inject(CountryService);
    expect(freshService.selectedCountry().code).toBe('IT');
  });

  it('should restore language from localStorage on init', () => {
    localStorage.setItem('uv_language', 'fr');
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [provideRouter(TEST_ROUTES)] });
    const freshService = TestBed.inject(CountryService);
    expect(freshService.selectedLanguage().code).toBe('fr');
  });

  it('should default language to the selected country preference when changing country', () => {
    const germany = EU_COUNTRIES.find((c) => c.code === 'DE')!;
    service.selectCountry(germany);

    expect(service.selectedLanguage().code).toBe('de');
  });

  it('should persist language preferences per country', () => {
    const germany = EU_COUNTRIES.find((c) => c.code === 'DE')!;
    const english = EU_LANGUAGES.find((language) => language.code === 'en')!;

    service.selectCountry(germany);
    service.selectLanguage(english);
    service.selectCountry(DEFAULT_COUNTRY);
    service.selectCountry(germany);

    expect(service.selectedLanguage().code).toBe('en');
    expect(localStorage.getItem('uv_language_preferences')).toContain('"DE":"en"');
  });
});
