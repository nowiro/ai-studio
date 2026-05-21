import { TestBed } from '@angular/core/testing';

import { translations } from '../../i18n/translations';
import { LanguageService } from '../../services/language.service';
import { AboutComponent } from './about.component';

/**
 * After the ui-kit refactor (libs/ui-kit primitives), DOM selectors changed:
 *   `.section-title` / `mat-card.stat-card` → wrapped by `<ais-section>` and
 *   `<ais-stat-tile>` respectively. Tests now assert on rendered TEXT.
 */
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
    expect((fixture.nativeElement as HTMLElement).textContent).toContain(translations.pl.about.sectionTitle);
  });

  it('renders English section title when lang is English', () => {
    const langService = TestBed.inject(LanguageService);
    langService.lang.set('en');
    const fixture = TestBed.createComponent(AboutComponent);
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain(translations.en.about.sectionTitle);
  });

  it('stat card values are present in the DOM', () => {
    const fixture = TestBed.createComponent(AboutComponent);
    fixture.detectChanges();
    const allText = (fixture.nativeElement as HTMLElement).textContent ?? '';
    translations.pl.about.stats.forEach((stat) => {
      expect(allText).toContain(stat.value);
    });
  });
});
