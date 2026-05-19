import { inject, Injectable, NgZone, OnDestroy } from '@angular/core';

import { Observable, share, Subject } from 'rxjs';

/**
 * Typed event published by an app and consumed by the portal / dashboard.
 *
 * Discriminated union — adding a new event type is a single new entry here.
 */
export type MfeEvent =
  | { type: 'cart:updated'; appId: string; itemCount: number; totalGrosze: number }
  | { type: 'cart:cleared'; appId: string }
  | { type: 'auth:login'; appId: string; role: 'reader' | 'librarian' | 'teacher' | 'parent' | 'student' | 'admin' }
  | { type: 'auth:logout'; appId: string }
  | { type: 'order:placed'; appId: string; orderId: string; totalGrosze: number };

/**
 * Cross-MFE event bus over `BroadcastChannel('ais-mfe')`.
 *
 * - Publishes typed events from any embedded app.
 * - Subscribers (portal shell, dashboard) get them inside Angular zone.
 * - Falls back to `window.postMessage` when BroadcastChannel is unavailable
 *   (older Safari) — same-origin only by design.
 *
 * Wire-up in `main.ts`:
 *
 * ```typescript
 * import { provideMfeBus } from '@ai-studio/shared-app-shell';
 *
 * bootstrapApplication(AppComponent, {
 *   providers: [provideMfeBus({ appId: 'bookstore' })],
 * });
 * ```
 */
@Injectable({ providedIn: 'root' })
export class MfeBus implements OnDestroy {
  private static readonly CHANNEL_NAME = 'ais-mfe';

  private readonly zone = inject(NgZone);
  private readonly channel: BroadcastChannel | null;
  private readonly subject = new Subject<MfeEvent>();
  private readonly handler = (ev: MessageEvent<MfeEvent>) => {
    if (!ev?.data || typeof ev.data !== 'object' || !('type' in ev.data)) return;
    this.zone.run(() => this.subject.next(ev.data));
  };

  /** Hot, multicast stream of every event published to the bus. */
  readonly events$: Observable<MfeEvent> = this.subject.asObservable().pipe(share());

  constructor() {
    this.channel = supportsBroadcastChannel() ? new BroadcastChannel(MfeBus.CHANNEL_NAME) : null;
    if (this.channel) {
      this.channel.addEventListener('message', this.handler);
    } else if (typeof window !== 'undefined') {
      window.addEventListener('message', (e: MessageEvent) => {
        if (e.origin !== window.origin) return;
        this.handler(e as MessageEvent<MfeEvent>);
      });
    }
  }

  /** Publish a typed event to every other tab/iframe on the same origin. */
  publish(event: MfeEvent): void {
    if (this.channel) {
      this.channel.postMessage(event);
    } else if (typeof window !== 'undefined') {
      window.postMessage(event, window.origin);
    }
    // Also surface to local subscribers so a tile sees its own publish.
    this.subject.next(event);
  }

  ngOnDestroy(): void {
    this.channel?.removeEventListener('message', this.handler);
    this.channel?.close();
    this.subject.complete();
  }
}

function supportsBroadcastChannel(): boolean {
  return typeof BroadcastChannel !== 'undefined';
}
