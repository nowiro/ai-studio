import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { LanguageService } from './services/language.service';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter(appRoutes)],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('document.documentElement.lang is set to pl after detectChanges', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(document.documentElement.lang).toBe('pl');
  });

  it('document.documentElement.lang updates when language changes', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const service = TestBed.inject(LanguageService);
    service.lang.set('en');
    fixture.detectChanges();
    expect(document.documentElement.lang).toBe('en');
  });
});
