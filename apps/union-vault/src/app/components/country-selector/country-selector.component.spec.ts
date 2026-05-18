import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { EU_COUNTRIES } from '../../data/eu-countries';
import { CountryService } from '../../services/country.service';
import { CountrySelectorComponent } from './country-selector.component';

const TEST_ROUTES = [{ path: ':countryCode', children: [] }];

describe('CountrySelectorComponent', () => {
  let fixture: ComponentFixture<CountrySelectorComponent>;
  let component: CountrySelectorComponent;
  let countryService: CountryService;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [CountrySelectorComponent],
      providers: [provideRouter(TEST_ROUTES)],
    }).compileComponents();

    fixture = TestBed.createComponent(CountrySelectorComponent);
    component = fixture.componentInstance;
    countryService = TestBed.inject(CountryService);
    fixture.detectChanges();
  });

  afterEach(() => localStorage.clear());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display selected country flag and code', () => {
    const button = fixture.nativeElement.querySelector('.selector-button');
    expect(button.textContent).toContain('PL');
    const flagSpan = button.querySelector('.fi.fi-pl');
    expect(flagSpan).toBeTruthy();
  });

  it('should call countryService.selectCountry() when selectCountry() is called', () => {
    const spy = vi.spyOn(countryService, 'selectCountry');
    const germany = EU_COUNTRIES.find((c) => c.code === 'DE')!;
    component.selectCountry(germany);
    expect(spy).toHaveBeenCalledWith(germany);
  });

  it('should update displayed country after selection', () => {
    const italy = EU_COUNTRIES.find((c) => c.code === 'IT')!;
    countryService.selectCountry(italy);
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('.selector-button');
    expect(button.textContent).toContain('IT');
  });

  it('should have aria-label on trigger button', () => {
    const button = fixture.nativeElement.querySelector('.selector-button');
    expect(button.getAttribute('aria-label')).toBe('Wybierz kraj');
  });
});
