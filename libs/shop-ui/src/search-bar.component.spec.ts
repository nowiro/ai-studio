/**
 * Unit tests — SearchBarComponent.
 */
import type { ComponentRef } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SearchBarComponent } from './search-bar.component.js';

describe('SearchBarComponent', () => {
  let fixture: ComponentFixture<SearchBarComponent>;
  let component: SearchBarComponent;
  let componentRef: ComponentRef<SearchBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchBarComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    fixture.detectChanges();
  });

  it('renders the default placeholder', () => {
    const label = (fixture.nativeElement as HTMLElement).querySelector('mat-label')!;
    expect(label.textContent).toContain('Szukaj produktów');
  });

  it('emits submit with the trimmed query on form submit', () => {
    const spy = vi.fn();
    component.querySubmit.subscribe(spy);
    (component as unknown as { query: { setValue: (v: string) => void } }).query.setValue('  zimowe  ');
    (fixture.nativeElement as HTMLElement).querySelector('form')!.dispatchEvent(new Event('submit'));
    expect(spy).toHaveBeenCalledWith('zimowe');
  });

  it('does not emit submit when the query is empty', () => {
    const spy = vi.fn();
    component.querySubmit.subscribe(spy);
    (fixture.nativeElement as HTMLElement).querySelector('form')!.dispatchEvent(new Event('submit'));
    expect(spy).not.toHaveBeenCalled();
  });

  it('clears the input and emits empty string when the clear button is clicked', () => {
    const spy = vi.fn();
    component.querySubmit.subscribe(spy);
    const queryControl = (component as unknown as { query: { setValue: (v: string) => void; value: string } }).query;
    queryControl.setValue('foo');
    fixture.detectChanges();
    const clear = (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>(
      '[data-testid="search-clear"]',
    );
    expect(clear).toBeTruthy();
    clear?.click();
    expect(spy).toHaveBeenCalledWith('');
    expect(queryControl.value).toBe('');
  });

  it('honours a custom placeholder input', () => {
    componentRef.setInput('placeholder', 'Znajdź książkę');
    fixture.detectChanges();
    const label = (fixture.nativeElement as HTMLElement).querySelector('mat-label')!;
    expect(label.textContent).toContain('Znajdź książkę');
  });
});
