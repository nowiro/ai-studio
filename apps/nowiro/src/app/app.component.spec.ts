import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { LocalizationApi } from '@ai-studio/shared-i18n';

import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { LanguageService } from './services/language.service';

// AppComponent renders the footer's <ais-language-switcher> (injects LocalizationApi).
// Stub the facade — live Transloco is wired in app.config, not in this unit test.
const LOCALIZATION_API_STUB = {
  currentLang: signal('pl'),
  availableLangs: signal(['pl', 'en']),
  setLang: () => undefined,
  translate: (key: string) => key,
} as unknown as LocalizationApi;

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter(appRoutes), { provide: LocalizationApi, useValue: LOCALIZATION_API_STUB }],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('document.documentElement.lang is set to pl after detectChanges', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(document.documentElement.lang).toBe('pl');
  });

  it('document.documentElement.lang updates when language changes', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const service = TestBed.inject(LanguageService);
    service.lang.set('en');
    fixture.detectChanges();
    expect(document.documentElement.lang).toBe('en');
  });
});
