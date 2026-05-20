/**
 * Unit tests — ProductCardSkeletonComponent.
 */
import { TestBed } from '@angular/core/testing';

import { describe, expect, it } from 'vitest';

import { ProductCardSkeletonComponent } from './product-card-skeleton.component.js';

describe('ProductCardSkeletonComponent', () => {
  it('renders the skeleton wrapper with aria-hidden so screen readers skip it', () => {
    TestBed.configureTestingModule({ imports: [ProductCardSkeletonComponent] });
    const fixture = TestBed.createComponent(ProductCardSkeletonComponent);
    fixture.detectChanges();
    const root = (fixture.nativeElement as HTMLElement).querySelector('[data-testid="product-card-skeleton"]')!;
    expect(root).toBeTruthy();
    expect(root.getAttribute('aria-hidden')).toBe('true');
  });

  it('renders pulse placeholders for image + text + price + cta', () => {
    TestBed.configureTestingModule({ imports: [ProductCardSkeletonComponent] });
    const fixture = TestBed.createComponent(ProductCardSkeletonComponent);
    fixture.detectChanges();
    const pulses = (fixture.nativeElement as HTMLElement).querySelectorAll('.animate-pulse');
    // image + 2 chip placeholders + 3 lines + price + cta = 8
    expect(pulses.length).toBeGreaterThanOrEqual(8);
  });
});
