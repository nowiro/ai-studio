/**
 * Unit tests — EmptyResultsComponent.
 *
 * Smoke + emit assertions. Signal-input re-renders are exercised via E2E
 * (the jsdom + vitest combo here does not propagate `componentRef.setInput`
 * to the view reliably).
 */
import type { ComponentRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { describe, expect, it, vi } from 'vitest';

import { EmptyResultsComponent } from './empty-results.component.js';

describe('EmptyResultsComponent', () => {
  function setup(): {
    root: HTMLElement;
    component: EmptyResultsComponent;
    componentRef: ComponentRef<EmptyResultsComponent>;
  } {
    TestBed.configureTestingModule({
      imports: [EmptyResultsComponent],
      providers: [provideRouter([])],
    });
    const fixture = TestBed.createComponent(EmptyResultsComponent);
    fixture.detectChanges();
    return {
      root: fixture.nativeElement as HTMLElement,
      component: fixture.componentInstance,
      componentRef: fixture.componentRef,
    };
  }

  it('renders the default title and a polite live region', () => {
    const { root } = setup();
    const title = root.querySelector('h2')!;
    expect(title.textContent).toContain('Brak wyników');
    const wrapper = root.querySelector('[data-testid="empty-results"]')!;
    expect(wrapper.getAttribute('role')).toBe('status');
    expect(wrapper.getAttribute('aria-live')).toBe('polite');
  });

  it('renders the default subtitle copy', () => {
    const { root } = setup();
    const subtitle = root.querySelector('p')!;
    expect(subtitle.textContent).toContain('Spróbuj');
  });

  it('emits clear() when the inline button is clicked (no router link)', () => {
    const { component, root } = setup();
    const spy = vi.fn();
    component.clear.subscribe(spy);
    const button = root.querySelector<HTMLButtonElement>('[data-testid="empty-results-clear-action"]')!;
    button.click();
    expect(spy).toHaveBeenCalled();
  });
});
