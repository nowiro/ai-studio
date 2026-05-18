import { TestBed } from '@angular/core/testing';

import { translations } from '../../i18n/translations';
import { LanguageService } from '../../services/language.service';
import { ServicesComponent } from './services.component';

describe('ServicesComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicesComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ServicesComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders Polish section title by default', () => {
    const fixture = TestBed.createComponent(ServicesComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.section-title')?.textContent?.trim()).toBe(translations.pl.services.sectionTitle);
  });

  it('renders correct number of service cards', () => {
    const fixture = TestBed.createComponent(ServicesComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    const cards = el.querySelectorAll('mat-card.service-card');
    expect(cards.length).toBe(translations.pl.services.items.length);
  });

  it('renders English section title when lang is English', () => {
    const langService = TestBed.inject(LanguageService);
    langService.lang.set('en');
    const fixture = TestBed.createComponent(ServicesComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.section-title')?.textContent?.trim()).toBe(translations.en.services.sectionTitle);
  });

  it('renders same number of cards in English', () => {
    const langService = TestBed.inject(LanguageService);
    langService.lang.set('en');
    const fixture = TestBed.createComponent(ServicesComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    const cards = el.querySelectorAll('mat-card.service-card');
    expect(cards.length).toBe(translations.en.services.items.length);
  });

  it('service titles are rendered in the DOM', () => {
    const fixture = TestBed.createComponent(ServicesComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    const allText = el.textContent ?? '';
    translations.pl.services.items.forEach((item) => {
      expect(allText).toContain(item.title);
    });
  });
});
