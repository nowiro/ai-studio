import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { EU_LANGUAGES } from '../../data/eu-languages';
import { CountryService } from '../../services/country.service';
import { LocalizationService } from '../../services/localization.service';
import { LanguageSwitcherComponent } from './language-switcher.component';

const TEST_ROUTES = [{ path: ':countryCode', children: [] }];

describe('LanguageSwitcherComponent', () => {
  let fixture: ComponentFixture<LanguageSwitcherComponent>;
  let component: LanguageSwitcherComponent;
  let countryService: CountryService;
  let localizationService: LocalizationService;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [LanguageSwitcherComponent],
      providers: [provideRouter(TEST_ROUTES)],
    }).compileComponents();

    fixture = TestBed.createComponent(LanguageSwitcherComponent);
    component = fixture.componentInstance;
    countryService = TestBed.inject(CountryService);
    localizationService = TestBed.inject(LocalizationService);
    fixture.detectChanges();
  });

  afterEach(() => localStorage.clear());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display selected language code in uppercase', () => {
    const button = fixture.nativeElement.querySelector('.selector-button');
    expect(button.textContent).toContain('PL');
  });

  it('should call countryService.selectLanguage() when selectLanguage() is called', () => {
    const spy = vi.spyOn(countryService, 'selectLanguage');
    const english = EU_LANGUAGES.find((l) => l.code === 'en')!;
    component.selectLanguage(english);
    expect(spy).toHaveBeenCalledWith(english);
  });

  it('should update displayed language after selection', () => {
    const german = EU_LANGUAGES.find((l) => l.code === 'de')!;
    countryService.selectLanguage(german);
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('.selector-button');
    expect(button.textContent).toContain('DE');
  });

  it('should have aria-label on trigger button', () => {
    const button = fixture.nativeElement.querySelector('.selector-button');
    expect(button.getAttribute('aria-label')).toBe('Wybierz język');
  });

  it('should lazy-load English UI copy after language selection', async () => {
    const english = EU_LANGUAGES.find((language) => language.code === 'en')!;

    component.selectLanguage(english);
    await vi.waitFor(() => {
      fixture.detectChanges();
      expect(localizationService.translate('languageSwitcher.ariaLabel')).toBe('Choose language');
    });
  });

  it('should lazy-load German UI copy after language selection', async () => {
    const german = EU_LANGUAGES.find((language) => language.code === 'de')!;

    component.selectLanguage(german);
    await vi.waitFor(() => {
      fixture.detectChanges();
      expect(localizationService.translate('languageSwitcher.ariaLabel')).toBe('Sprache auswählen');
    });
  });
});
