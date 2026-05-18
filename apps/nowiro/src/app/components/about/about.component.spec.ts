import { TestBed } from '@angular/core/testing';

import { translations } from '../../i18n/translations';
import { LanguageService } from '../../services/language.service';
import { AboutComponent } from './about.component';

describe('AboutComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(AboutComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders Polish section title by default', () => {
    const fixture = TestBed.createComponent(AboutComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.section-title')?.textContent?.trim()).toBe(translations.pl.about.sectionTitle);
  });

  it('renders English section title when lang is English', () => {
    const langService = TestBed.inject(LanguageService);
    langService.lang.set('en');
    const fixture = TestBed.createComponent(AboutComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.section-title')?.textContent?.trim()).toBe(translations.en.about.sectionTitle);
  });

  it('renders correct number of stat cards', () => {
    const fixture = TestBed.createComponent(AboutComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    const statCards = el.querySelectorAll('mat-card.stat-card');
    expect(statCards.length).toBe(translations.pl.about.stats.length);
  });

  it('stat card values are present in the DOM', () => {
    const fixture = TestBed.createComponent(AboutComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    const allText = el.textContent ?? '';
    translations.pl.about.stats.forEach((stat) => {
      expect(allText).toContain(stat.value);
    });
  });
});
