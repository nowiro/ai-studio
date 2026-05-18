import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { translations } from '../../i18n/translations';
import { LanguageService } from '../../services/language.service';
import { HeaderComponent } from './header.component';

interface HeaderInternals {
  scrolled: () => boolean;
  mobileMenuOpen: () => boolean;
  toggleMobileMenu: () => void;
  scrollTo: (fragment: string) => void;
}

function intern(component: HeaderComponent): HeaderInternals {
  return component as unknown as HeaderInternals;
}

describe('HeaderComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('scrolled signal starts as false', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    expect(intern(fixture.componentInstance).scrolled()).toBe(false);
  });

  it('mobileMenuOpen signal starts as false', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    expect(intern(fixture.componentInstance).mobileMenuOpen()).toBe(false);
  });

  it('toggleMobileMenu opens the menu', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    intern(fixture.componentInstance).toggleMobileMenu();
    expect(intern(fixture.componentInstance).mobileMenuOpen()).toBe(true);
  });

  it('toggleMobileMenu called twice closes the menu', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    intern(fixture.componentInstance).toggleMobileMenu();
    intern(fixture.componentInstance).toggleMobileMenu();
    expect(intern(fixture.componentInstance).mobileMenuOpen()).toBe(false);
  });

  it('language toggle shows EN label and GB flag when lang is Polish', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    const label = el.querySelector('ais-language-toggle .ais-language-toggle__label');
    const flag = el.querySelector('ais-language-toggle img');
    expect(label?.textContent?.trim()).toBe('EN');
    expect(flag?.getAttribute('src')).toContain('gb.svg');
  });

  it('language toggle shows PL label and PL flag when lang is English', () => {
    const langService = TestBed.inject(LanguageService);
    langService.lang.set('en');
    const fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    const label = el.querySelector('ais-language-toggle .ais-language-toggle__label');
    const flag = el.querySelector('ais-language-toggle img');
    expect(label?.textContent?.trim()).toBe('PL');
    expect(flag?.getAttribute('src')).toContain('pl.svg');
  });

  it('renders Polish nav labels when lang is Polish', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    const navText = el.querySelector('.desktop-nav')?.textContent ?? '';
    expect(navText).toContain(translations.pl.header.about);
    expect(navText).toContain(translations.pl.header.services);
  });

  it('renders English nav labels when lang is English', () => {
    const langService = TestBed.inject(LanguageService);
    langService.lang.set('en');
    const fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    const navText = el.querySelector('.desktop-nav')?.textContent ?? '';
    expect(navText).toContain(translations.en.header.about);
  });

  it('scrollTo closes mobile menu', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    intern(fixture.componentInstance).toggleMobileMenu();
    expect(intern(fixture.componentInstance).mobileMenuOpen()).toBe(true);
    intern(fixture.componentInstance).scrollTo('about');
    expect(intern(fixture.componentInstance).mobileMenuOpen()).toBe(false);
  });
});
