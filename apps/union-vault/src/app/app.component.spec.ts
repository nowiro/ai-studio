import { registerLocaleData } from '@angular/common';
import localePl from '@angular/common/locales/pl';
import { LOCALE_ID } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { APP_VERSION } from '../version';
import { AppComponent } from './app.component';
import { CountryService } from './services/country.service';

const TEST_ROUTES = [{ path: ':countryCode', children: [] }];

registerLocaleData(localePl);

describe('AppComponent (shell)', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let router: Router;
  let countryService: CountryService;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter(TEST_ROUTES), { provide: LOCALE_ID, useValue: 'pl' }],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    countryService = TestBed.inject(CountryService);
    fixture.detectChanges();
  });

  afterEach(() => localStorage.clear());

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should render header component', () => {
    const header = fixture.nativeElement.querySelector('ais-header');
    expect(header).toBeTruthy();
  });

  it('should render router outlet', () => {
    const outlet = fixture.nativeElement.querySelector('router-outlet');
    expect(outlet).toBeTruthy();
  });

  it('should render footer', () => {
    const footer = fixture.nativeElement.querySelector('.app-footer');
    expect(footer).toBeTruthy();
  });

  it('should display copyright with current year in footer', () => {
    const footer = fixture.nativeElement.querySelector('.app-footer');
    expect(footer.textContent).toContain(new Date().getFullYear().toString());
  });

  it('should display UnionVault.eu in footer', () => {
    const footer = fixture.nativeElement.querySelector('.app-footer');
    expect(footer.textContent).toContain('UnionVault.eu');
  });

  it('should display last updated date in footer', () => {
    const footerUpdate = fixture.nativeElement.querySelector('.footer-update');
    expect(footerUpdate).toBeTruthy();
    expect(footerUpdate.textContent).toContain(new Date().getFullYear().toString());
  });

  it('should display app version in footer', () => {
    const footerVersion = fixture.nativeElement.querySelector('.footer-version');
    expect(footerVersion).toBeTruthy();
    expect(footerVersion.textContent).toContain(`v${APP_VERSION}`);
  });

  it('should sync selected country from the current route', async () => {
    await router.navigateByUrl('/de');
    fixture.detectChanges();

    expect(countryService.selectedCountry().code).toBe('DE');
  });
});
