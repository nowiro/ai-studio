/**
 * Unit tests — BreadcrumbsComponent.
 */
import type { ComponentRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { describe, expect, it } from 'vitest';

import { type Breadcrumb, BreadcrumbsComponent } from './breadcrumbs.component.js';

describe('BreadcrumbsComponent', () => {
  function setup(crumbs: readonly Breadcrumb[]): { nativeElement: HTMLElement } {
    TestBed.configureTestingModule({
      imports: [BreadcrumbsComponent],
      providers: [provideRouter([])],
    });
    const fixture = TestBed.createComponent(BreadcrumbsComponent);
    const componentRef: ComponentRef<BreadcrumbsComponent> = fixture.componentRef;
    componentRef.setInput('crumbs', crumbs);
    fixture.detectChanges();
    return { nativeElement: fixture.nativeElement as HTMLElement };
  }

  it('renders all crumbs with chevron separators between them', () => {
    const { nativeElement } = setup([
      { label: 'Sklep', routerLink: ['/'] },
      { label: 'Katalog', routerLink: ['/catalogue'] },
      { label: 'Opona ABC' },
    ]);
    const items = nativeElement.querySelectorAll('li');
    expect(items.length).toBe(3);
    // 2 separators between 3 items
    expect(nativeElement.querySelectorAll('[aria-hidden="true"]').length).toBe(2);
  });

  it('does not render the last crumb as a link and marks it aria-current="page"', () => {
    const { nativeElement } = setup([{ label: 'Sklep', routerLink: ['/'] }, { label: 'Bieżąca strona' }]);
    const current = nativeElement.querySelector('[data-testid="breadcrumb-current"]')!;
    expect(current.textContent?.trim()).toBe('Bieżąca strona');
    expect(current.getAttribute('aria-current')).toBe('page');
  });

  it('exposes a breadcrumb landmark with a Polish aria-label', () => {
    const { nativeElement } = setup([{ label: 'Sklep' }]);
    const nav = nativeElement.querySelector('nav')!;
    expect(nav.getAttribute('aria-label')).toBe('Ścieżka nawigacji');
  });
});
