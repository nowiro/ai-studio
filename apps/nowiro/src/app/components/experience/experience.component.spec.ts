import { TestBed } from '@angular/core/testing';

import { translations } from '../../i18n/translations';
import { LanguageService } from '../../services/language.service';
import { ExperienceComponent } from './experience.component';

describe('ExperienceComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExperienceComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ExperienceComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders Polish section title by default', () => {
    const fixture = TestBed.createComponent(ExperienceComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.section-title')?.textContent?.trim()).toBe(translations.pl.experience.sectionTitle);
  });

  it('renders correct number of timeline cards', () => {
    const fixture = TestBed.createComponent(ExperienceComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    const cards = el.querySelectorAll('mat-card.timeline-card');
    expect(cards.length).toBe(translations.pl.experience.items.length);
  });

  it('renders all experience periods in DOM', () => {
    const fixture = TestBed.createComponent(ExperienceComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    const allText = el.textContent ?? '';
    translations.pl.experience.items.forEach((item) => {
      expect(allText).toContain(item.period);
    });
  });

  it('renders English section title when lang is English', () => {
    const langService = TestBed.inject(LanguageService);
    langService.lang.set('en');
    const fixture = TestBed.createComponent(ExperienceComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.section-title')?.textContent?.trim()).toBe(translations.en.experience.sectionTitle);
  });

  it('4 experience entries are defined in translations', () => {
    expect(translations.pl.experience.items.length).toBe(4);
    expect(translations.en.experience.items.length).toBe(4);
  });
});
