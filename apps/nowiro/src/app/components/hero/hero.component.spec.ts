import { TestBed } from '@angular/core/testing';

import { translations } from '../../i18n/translations';
import { LanguageService } from '../../services/language.service';
import { HeroComponent } from './hero.component';

describe('HeroComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(HeroComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders Polish hero tag by default', () => {
    const fixture = TestBed.createComponent(HeroComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.hero-tag')?.textContent?.trim()).toBe(translations.pl.hero.tag);
  });

  it('renders Polish highlight text', () => {
    const fixture = TestBed.createComponent(HeroComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.highlight')?.textContent?.trim()).toBe(translations.pl.hero.titleHighlight);
  });

  it('renders English hero tag when lang is set to English', () => {
    const langService = TestBed.inject(LanguageService);
    langService.lang.set('en');
    const fixture = TestBed.createComponent(HeroComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.hero-tag')?.textContent?.trim()).toBe(translations.en.hero.tag);
  });

  it('renders two CTA buttons', () => {
    const fixture = TestBed.createComponent(HeroComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    const buttons = el.querySelectorAll('.hero-actions button');
    expect(buttons.length).toBe(2);
  });

  it('CTA buttons contain Polish labels by default', () => {
    const fixture = TestBed.createComponent(HeroComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    const actionsText = el.querySelector('.hero-actions')?.textContent ?? '';
    expect(actionsText).toContain(translations.pl.hero.ctaContact);
    expect(actionsText).toContain(translations.pl.hero.ctaServices);
  });
});
