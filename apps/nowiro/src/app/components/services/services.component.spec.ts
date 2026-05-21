import { TestBed } from '@angular/core/testing';

import { translations } from '../../i18n/translations';
import { LanguageService } from '../../services/language.service';
import { ServicesComponent } from './services.component';

/**
 * After the ui-kit refactor (libs/ui-kit primitives), DOM selectors changed:
 *   `.section-title` / `mat-card.service-card` → wrapped by `<ais-section>`
 *   and `<ais-feature-card>` respectively. These tests now assert on the
 *   rendered TEXT, not the markup structure — they pass regardless of which
 *   primitive renders the content.
 */
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
    expect(el.textContent).toContain(translations.pl.services.sectionTitle);
  });

  it('renders English section title when lang is English', () => {
    const langService = TestBed.inject(LanguageService);
    langService.lang.set('en');
    const fixture = TestBed.createComponent(ServicesComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain(translations.en.services.sectionTitle);
  });

  it('renders every service title in the DOM', () => {
    const fixture = TestBed.createComponent(ServicesComponent);
    fixture.detectChanges();
    const allText = (fixture.nativeElement as HTMLElement).textContent ?? '';
    translations.pl.services.items.forEach((item) => {
      expect(allText).toContain(item.title);
    });
  });

  it('renders every service title in English when lang switches', () => {
    const langService = TestBed.inject(LanguageService);
    langService.lang.set('en');
    const fixture = TestBed.createComponent(ServicesComponent);
    fixture.detectChanges();
    const allText = (fixture.nativeElement as HTMLElement).textContent ?? '';
    translations.en.services.items.forEach((item) => {
      expect(allText).toContain(item.title);
    });
  });
});
