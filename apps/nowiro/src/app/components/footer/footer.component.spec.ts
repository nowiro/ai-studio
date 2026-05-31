import { type Signal, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { LocalizationApi } from '@ai-studio/shared-i18n';

import { translations } from '../../i18n/translations';
import { LanguageService } from '../../services/language.service';
import { FooterComponent } from './footer.component';

// Footer renders <ais-language-switcher>, which injects LocalizationApi. Stub the
// facade so the unit test needs no live Transloco wiring (provided in app.config).
const LOCALIZATION_API_STUB = {
  currentLang: signal('pl'),
  availableLangs: signal(['pl', 'en']),
  setLang: () => undefined,
  translate: (key: string) => key,
} as unknown as LocalizationApi;

interface FooterInternals {
  currentYear: Signal<number>;
}

function intern(component: FooterComponent): FooterInternals {
  return component as unknown as FooterInternals;
}

describe('FooterComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent],
      providers: [{ provide: LocalizationApi, useValue: LOCALIZATION_API_STUB }],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(FooterComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders Polish tagline by default', () => {
    const fixture = TestBed.createComponent(FooterComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.footer-tagline')?.textContent?.trim()).toBe(translations.pl.footer.tagline);
  });

  it('renders English tagline when lang is English', () => {
    const langService = TestBed.inject(LanguageService);
    langService.lang.set('en');
    const fixture = TestBed.createComponent(FooterComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.footer-tagline')?.textContent?.trim()).toBe(translations.en.footer.tagline);
  });

  it('currentYear equals the actual current year', () => {
    const fixture = TestBed.createComponent(FooterComponent);
    expect(intern(fixture.componentInstance).currentYear()).toBe(new Date().getFullYear());
  });

  it('displays the current year in the DOM', () => {
    const fixture = TestBed.createComponent(FooterComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain(String(new Date().getFullYear()));
  });

  it('displays NIP number in the footer', () => {
    const fixture = TestBed.createComponent(FooterComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('554 258 35 84');
  });
});
