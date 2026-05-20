/**
 * Unit tests — EmptyResultsComponent.
 */
import type { ComponentRef } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { EmptyResultsComponent } from './empty-results.component.js';

describe('EmptyResultsComponent', () => {
  let fixture: ComponentFixture<EmptyResultsComponent>;
  let component: EmptyResultsComponent;
  let componentRef: ComponentRef<EmptyResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyResultsComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(EmptyResultsComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    fixture.detectChanges();
  });

  it('renders the default title and subtitle', () => {
    const title = (fixture.nativeElement as HTMLElement).querySelector('h2') as HTMLElement;
    expect(title.textContent).toContain('Brak wyników');
    const subtitle = (fixture.nativeElement as HTMLElement).querySelector('p') as HTMLElement;
    expect(subtitle.textContent).toContain('Spróbuj');
  });

  it('echoes the query in the subtitle when provided', () => {
    componentRef.setInput('query', 'zimowe opony');
    fixture.detectChanges();
    const subtitle = (fixture.nativeElement as HTMLElement).querySelector('p') as HTMLElement;
    expect(subtitle.textContent).toContain('zimowe opony');
  });

  it('honours a custom subtitle override', () => {
    componentRef.setInput('subtitle', 'Nothing matched');
    fixture.detectChanges();
    const subtitle = (fixture.nativeElement as HTMLElement).querySelector('p') as HTMLElement;
    expect(subtitle.textContent).toContain('Nothing matched');
  });

  it('renders a router-link CTA when clearFiltersLink is provided', () => {
    componentRef.setInput('clearFiltersLink', ['/catalogue']);
    fixture.detectChanges();
    const link = (fixture.nativeElement as HTMLElement).querySelector('[data-testid="empty-results-clear"]');
    expect(link).toBeTruthy();
  });

  it('emits clear() when the button (no router link) is clicked', () => {
    const spy = vi.fn();
    component.clear.subscribe(spy);
    const button = (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>(
      '[data-testid="empty-results-clear-action"]',
    )!;
    button.click();
    expect(spy).toHaveBeenCalled();
  });
});
