import { computed, Injectable, type Signal, signal } from '@angular/core';

/**
 * Parent-facing notification stub.
 *
 * Discriminated union covering the four event kinds the parent persona cares
 * about. No real push is dispatched — the store only mirrors what would have
 * been sent so the UI can render an inbox / unread badge.
 */
export type ParentNotification =
  | {
      readonly kind: 'new_grade';
      readonly studentId: string;
      readonly subject: string;
      readonly grade: number;
      readonly date: Date;
      readonly teacherName: string;
    }
  | {
      readonly kind: 'absence';
      readonly studentId: string;
      readonly date: Date;
      readonly subject: string;
      readonly teacherName: string;
    }
  | {
      readonly kind: 'late_arrival';
      readonly studentId: string;
      readonly date: Date;
      readonly minutesLate: number;
    }
  | {
      readonly kind: 'announcement';
      readonly classId: string;
      readonly title: string;
      readonly body: string;
      readonly date: Date;
    };

/** Stored notification with bookkeeping metadata (id, read flag, createdAt). */
export interface NotificationWithMeta {
  readonly id: string;
  readonly notification: ParentNotification;
  read: boolean;
  readonly createdAt: Date;
}

/**
 * In-memory stub store for parent notifications.
 *
 * Signal-only API (no RxJS). The store is the single source of truth for the
 * parent inbox UI; nothing is persisted across page reloads.
 */
@Injectable({ providedIn: 'root' })
export class NotificationStubStore {
  private readonly items = signal<NotificationWithMeta[]>([]);

  /** Read-only view of the full inbox, newest-first not enforced here. */
  readonly notifications: Signal<readonly NotificationWithMeta[]> = this.items.asReadonly();

  /** Reactive count of unread notifications. */
  readonly unreadCount: Signal<number> = computed(() => this.items().filter((n) => !n.read).length);

  /** Append a notification with an auto-generated id, current timestamp, and `read=false`. */
  add(notification: ParentNotification): void {
    const entry: NotificationWithMeta = {
      id: crypto.randomUUID(),
      notification,
      read: false,
      createdAt: new Date(),
    };
    this.items.update((current) => [...current, entry]);
  }

  /** Flip the `read` flag on one notification (no-op if id is unknown). */
  markRead(id: string): void {
    this.items.update((current) => current.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  /** Flip every notification to `read = true`. */
  markAllRead(): void {
    this.items.update((current) => current.map((n) => (n.read ? n : { ...n, read: true })));
  }

  /** Drop every notification — used by tests and the parent "clear inbox" action. */
  clear(): void {
    this.items.set([]);
  }

  /**
   * Returns a `computed` signal scoped to a single student id. Covers the three
   * student-bound kinds (`new_grade`, `absence`, `late_arrival`); class-wide
   * `announcement` notifications are excluded because they aren't tied to a
   * specific student.
   */
  filterByStudent(studentId: string): Signal<readonly NotificationWithMeta[]> {
    return computed(() =>
      this.items().filter((n) => {
        const kind = n.notification.kind;
        return (
          (kind === 'new_grade' || kind === 'absence' || kind === 'late_arrival') &&
          n.notification.studentId === studentId
        );
      }),
    );
  }
}
