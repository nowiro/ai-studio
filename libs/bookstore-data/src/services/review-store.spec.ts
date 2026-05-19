import { TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { BookstoreReviewStore } from './review-store';

describe('BookstoreReviewStore', () => {
  let store: BookstoreReviewStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(BookstoreReviewStore);
    store.clear();
  });

  it('starts empty', () => {
    expect(store.reviews()).toEqual([]);
    expect(store.aggregateFor('any')).toEqual({ count: 0, average: 0 });
  });

  it('adds a review and returns a generated id', () => {
    const id = store.add({ bookId: 'b-1', user: 'Anna', stars: 5, text: 'Świetna!' });
    expect(id).toBeTruthy();
    expect(store.reviews()).toHaveLength(1);
  });

  it('filters reviews per book', () => {
    store.add({ bookId: 'b-1', user: 'Anna', stars: 5, text: '' });
    store.add({ bookId: 'b-2', user: 'Jan', stars: 3, text: '' });
    expect(store.reviewsFor('b-1')).toHaveLength(1);
    expect(store.reviewsFor('b-2')).toHaveLength(1);
    expect(store.reviewsFor('b-3')).toHaveLength(0);
  });

  it('aggregates stars with average rounded to 1 decimal', () => {
    store.add({ bookId: 'b-1', user: 'a', stars: 5, text: '' });
    store.add({ bookId: 'b-1', user: 'b', stars: 4, text: '' });
    store.add({ bookId: 'b-1', user: 'c', stars: 3, text: '' });
    expect(store.aggregateFor('b-1')).toEqual({ count: 3, average: 4 });
  });

  it('rounds averages to 1 decimal', () => {
    store.add({ bookId: 'b-1', user: 'a', stars: 5, text: '' });
    store.add({ bookId: 'b-1', user: 'b', stars: 4, text: '' });
    expect(store.aggregateFor('b-1').average).toBe(4.5);
  });

  it('hydrates from an external list (storage rehydration)', () => {
    store.hydrate([
      { id: 'r-1', bookId: 'b-1', user: 'Anna', stars: 5, text: '', createdAt: '2026-01-01T00:00:00.000Z' },
    ]);
    expect(store.reviews()).toHaveLength(1);
    expect(store.aggregateFor('b-1')).toEqual({ count: 1, average: 5 });
  });
});
