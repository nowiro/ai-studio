/**
 * Unit tests — ShopHeroComponent.
 */
import type { ComponentRef } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { beforeEach, describe, expect, it } from 'vitest';

import { ShopHeroComponent } from './shop-hero.component.js';

describe('ShopHeroComponent', () => {
  let fixture: ComponentFixture<ShopHeroComponent>;
  let componentRef: ComponentRef<ShopHeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopHeroComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(ShopHeroComponent);
    componentRef = fixture.componentRef;
    componentRef.setInput('title', 'Witamy w sklepie');
    fixture.detectChanges();
  });

  it('renders the title in an h1', () => {
    const h1 = (fixture.nativeElement as HTMLElement).querySelector('h1') as HTMLElement;
    expect(h1.textContent?.trim()).toBe('Witamy w sklepie');
  });

  it('renders the CTA when label + link are provided', () => {
    componentRef.setInput('ctaLabel', 'Zobacz katalog');
    componentRef.setInput('ctaLink', ['/catalogue']);
    fixture.detectChanges();
    const cta = (fixture.nativeElement as HTMLElement).querySelector('[data-testid="shop-hero-cta"]')!;
    expect(cta).toBeTruthy();
    expect(cta.textContent).toContain('Zobacz katalog');
  });

  it('skips the CTA when either label or link is missing', () => {
    componentRef.setInput('ctaLabel', 'Zobacz katalog');
    fixture.detectChanges();
    const cta = (fixture.nativeElement as HTMLElement).querySelector('[data-testid="shop-hero-cta"]');
    expect(cta).toBeNull();
  });
});
