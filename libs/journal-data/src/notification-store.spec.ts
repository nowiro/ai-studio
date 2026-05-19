/**
 * Loads the Angular JIT compiler so the `@Injectable`-decorated
 * `NotificationStubStore` can be resolved by a bare `Injector.create(...)`
 * (journal-data has no Vitest setupFile, so the import lives here).
 */
import '@angular/compiler';
import { Injector } from '@angular/core';

import { beforeEach, describe, expect, it } from 'vitest';

import { NotificationStubStore, type ParentNotification } from './notification-store.js';

function makeStore(): NotificationStubStore {
  const injector = Injector.create({ providers: [NotificationStubStore] });
  return injector.get(NotificationStubStore);
}

function newGrade(overrides: Partial<Extract<ParentNotification, { kind: 'new_grade' }>> = {}): ParentNotification {
  return {
    kind: 'new_grade',
    studentId: 'student-1',
    subject: 'Matematyka',
    grade: 5,
    date: new Date('2026-05-15T10:00:00.000Z'),
    teacherName: 'Anna Kowalska',
    ...overrides,
  };
}

function absence(overrides: Partial<Extract<ParentNotification, { kind: 'absence' }>> = {}): ParentNotification {
  return {
    kind: 'absence',
    studentId: 'student-1',
    date: new Date('2026-05-15T08:00:00.000Z'),
    subject: 'Polski',
    teacherName: 'Jan Nowak',
    ...overrides,
  };
}

function lateArrival(
  overrides: Partial<Extract<ParentNotification, { kind: 'late_arrival' }>> = {},
): ParentNotification {
  return {
    kind: 'late_arrival',
    studentId: 'student-1',
    date: new Date('2026-05-16T08:10:00.000Z'),
    minutesLate: 10,
    ...overrides,
  };
}

function announcement(
  overrides: Partial<Extract<ParentNotification, { kind: 'announcement' }>> = {},
): ParentNotification {
  return {
    kind: 'announcement',
    classId: 'class-5a',
    title: 'Zebranie z rodzicami',
    body: 'Zapraszamy w czwartek o 17:00.',
    date: new Date('2026-05-20T17:00:00.000Z'),
    ...overrides,
  };
}

describe('NotificationStubStore', () => {
  let store: NotificationStubStore;

  beforeEach(() => {
    store = makeStore();
  });

  it('starts empty', () => {
    expect(store.notifications()).toEqual([]);
    expect(store.unreadCount()).toBe(0);
  });

  it('add() appends a single entry', () => {
    store.add(newGrade());
    expect(store.notifications()).toHaveLength(1);
  });

  it('add() accepts every discriminated kind', () => {
    store.add(newGrade());
    store.add(absence());
    store.add(lateArrival());
    store.add(announcement());
    expect(store.notifications()).toHaveLength(4);
    const kinds = store.notifications().map((n) => n.notification.kind);
    expect(kinds).toEqual(['new_grade', 'absence', 'late_arrival', 'announcement']);
  });

  it('add() generates a unique id per entry', () => {
    store.add(newGrade());
    store.add(newGrade());
    store.add(newGrade());
    const ids = store.notifications().map((n) => n.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toBeTruthy();
    }
  });

  it('add() seeds entries as unread with a createdAt timestamp', () => {
    const before = Date.now();
    store.add(newGrade());
    const after = Date.now();
    const entry = store.notifications()[0];
    expect(entry.read).toBe(false);
    expect(entry.createdAt).toBeInstanceOf(Date);
    expect(entry.createdAt.getTime()).toBeGreaterThanOrEqual(before);
    expect(entry.createdAt.getTime()).toBeLessThanOrEqual(after);
  });

  it('unreadCount() reflects the current unread total', () => {
    expect(store.unreadCount()).toBe(0);
    store.add(newGrade());
    store.add(absence());
    expect(store.unreadCount()).toBe(2);
    store.add(announcement());
    expect(store.unreadCount()).toBe(3);
  });

  it('markRead() flips the read flag for one id', () => {
    store.add(newGrade());
    store.add(absence());
    const firstId = store.notifications()[0].id;
    store.markRead(firstId);
    const updated = store.notifications();
    expect(updated[0].read).toBe(true);
    expect(updated[1].read).toBe(false);
    expect(store.unreadCount()).toBe(1);
  });

  it('markRead() ignores unknown ids', () => {
    store.add(newGrade());
    store.markRead('does-not-exist');
    expect(store.unreadCount()).toBe(1);
  });

  it('markAllRead() clears the unread count', () => {
    store.add(newGrade());
    store.add(absence());
    store.add(lateArrival());
    expect(store.unreadCount()).toBe(3);
    store.markAllRead();
    expect(store.unreadCount()).toBe(0);
    expect(store.notifications().every((n) => n.read)).toBe(true);
  });

  it('clear() empties the store and resets unreadCount', () => {
    store.add(newGrade());
    store.add(absence());
    store.clear();
    expect(store.notifications()).toEqual([]);
    expect(store.unreadCount()).toBe(0);
  });

  it('filterByStudent() scopes to one student across student-bound kinds', () => {
    store.add(newGrade({ studentId: 'student-1' }));
    store.add(absence({ studentId: 'student-1' }));
    store.add(lateArrival({ studentId: 'student-1' }));
    store.add(newGrade({ studentId: 'student-2' }));
    store.add(announcement()); // class-wide, no studentId

    const forStudent1 = store.filterByStudent('student-1');
    expect(forStudent1()).toHaveLength(3);

    const forStudent2 = store.filterByStudent('student-2');
    expect(forStudent2()).toHaveLength(1);

    const forGhost = store.filterByStudent('student-ghost');
    expect(forGhost()).toEqual([]);
  });

  it('filterByStudent() is reactive to subsequent add()s', () => {
    const view = store.filterByStudent('student-7');
    expect(view()).toEqual([]);
    store.add(newGrade({ studentId: 'student-7' }));
    expect(view()).toHaveLength(1);
    store.add(absence({ studentId: 'student-other' }));
    expect(view()).toHaveLength(1);
  });
});
