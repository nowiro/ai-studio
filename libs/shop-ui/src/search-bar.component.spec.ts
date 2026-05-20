/**
 * Unit tests — SearchBarComponent.
 *
 * Smoke + behaviour tests that don't require signal-input re-render (which
 * needs special handling under our jsdom + vitest setup). Coverage of
 * `placeholder` input changes is deferred to E2E or a future TestBed shim.
 */
import { TestBed } from '@angular/core/testing';

import { describe, expect, it, vi } from 'vitest';

import { SearchBarComponent } from './search-bar.component.js';

describe('SearchBarComponent', () => {
  function setup(): {
    component: SearchBarComponent;
    root: HTMLElement;
    query: { setValue: (v: string) => void; value: string };
    detectChanges: () => void;
  } {
    TestBed.configureTestingModule({ imports: [SearchBarComponent] });
    const fixture = TestBed.createComponent(SearchBarComponent);
    fixture.detectChanges();
    return {
      component: fixture.componentInstance,
      root: fixture.nativeElement as HTMLElement,
      query: (fixture.componentInstance as unknown as { query: { setValue: (v: string) => void; value: string } })
        .query,
      detectChanges: () => fixture.detectChanges(),
    };
  }

  it('renders the default placeholder', () => {
    const { root } = setup();
    const label = root.querySelector('mat-label')!;
    expect(label.textContent).toContain('Szukaj produktów');
  });

  it('emits querySubmit with the trimmed query on onSubmit()', () => {
    const { component, query } = setup();
    const spy = vi.fn();
    component.querySubmit.subscribe(spy);
    query.setValue('  zimowe  ');
    (component as unknown as { onSubmit: () => void }).onSubmit();
    expect(spy).toHaveBeenCalledWith('zimowe');
  });

  it('does not emit querySubmit when the query is empty', () => {
    const { component } = setup();
    const spy = vi.fn();
    component.querySubmit.subscribe(spy);
    (component as unknown as { onSubmit: () => void }).onSubmit();
    expect(spy).not.toHaveBeenCalled();
  });

  it('clears the input and emits empty string on clear()', () => {
    const { component, query } = setup();
    const spy = vi.fn();
    component.querySubmit.subscribe(spy);
    query.setValue('foo');
    (component as unknown as { clear: () => void }).clear();
    expect(spy).toHaveBeenCalledWith('');
    expect(query.value).toBe('');
  });
});
