import { TestBed } from '@angular/core/testing';

import { translations } from '../i18n/translations';
import { LanguageService } from './language.service';

describe('LanguageService', () => {
  let service: LanguageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LanguageService);
  });

  it('defaults to Polish', () => {
    expect(service.lang()).toBe('pl');
  });

  it('t() returns Polish translations by default', () => {
    expect(service.t()).toBe(translations.pl);
  });

  it('toggle() switches language to English', () => {
    service.toggle();
    expect(service.lang()).toBe('en');
  });

  it('toggle() twice returns to Polish', () => {
    service.toggle();
    service.toggle();
    expect(service.lang()).toBe('pl');
  });

  it('t() reactively returns English translations after toggle', () => {
    service.toggle();
    expect(service.t()).toBe(translations.en);
  });

  it('lang.set() allows direct language assignment', () => {
    service.lang.set('en');
    expect(service.lang()).toBe('en');
    expect(service.t().hero.ctaContact).toBe(translations.en.hero.ctaContact);
  });

  it('Polish and English translations have the same keys', () => {
    const plKeys = Object.keys(translations.pl);
    const enKeys = Object.keys(translations.en);
    expect(plKeys).toEqual(enKeys);
  });

  it('header translations differ between PL and EN', () => {
    expect(translations.pl.header.about).not.toBe(translations.en.header.about);
  });

  it('services items count is the same in both languages', () => {
    expect(translations.pl.services.items.length).toBe(translations.en.services.items.length);
  });

  it('experience items count is the same in both languages', () => {
    expect(translations.pl.experience.items.length).toBe(translations.en.experience.items.length);
  });
});
