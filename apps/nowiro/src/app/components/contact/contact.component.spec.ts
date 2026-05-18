import { TestBed } from '@angular/core/testing';

import { translations } from '../../i18n/translations';
import { LanguageService } from '../../services/language.service';
import { ContactComponent } from './contact.component';

describe('ContactComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ContactComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders Polish section title by default', () => {
    const fixture = TestBed.createComponent(ContactComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.section-title')?.textContent?.trim()).toBe(translations.pl.contact.sectionTitle);
  });

  it('renders English section title when lang is English', () => {
    const langService = TestBed.inject(LanguageService);
    langService.lang.set('en');
    const fixture = TestBed.createComponent(ContactComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.section-title')?.textContent?.trim()).toBe(translations.en.contact.sectionTitle);
  });

  it('displays company NIP number', () => {
    const fixture = TestBed.createComponent(ContactComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    // Normalize all whitespace variants (including non-breaking spaces) before asserting
    const normalized = (el.textContent ?? '').replace(/[\u00a0\u202f\s]+/g, ' ');
    expect(normalized).toContain('554 258 35 84');
  });

  it('displays company REGON number', () => {
    const fixture = TestBed.createComponent(ContactComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('340824232');
  });

  it('displays company address', () => {
    const fixture = TestBed.createComponent(ContactComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Wrocław');
  });

  it('renders contact-item elements', () => {
    const fixture = TestBed.createComponent(ContactComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    const items = el.querySelectorAll('.contact-item');
    expect(items.length).toBeGreaterThan(0);
  });
});
