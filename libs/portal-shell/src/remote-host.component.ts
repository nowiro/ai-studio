/**
 * Renders a single Web Component remote (`<ais-<slug>>`) inside the portal.
 *
 * The portal uses the **WC-based composition** strategy (see ADR-0009):
 * each remote is a Web Component bundle produced by
 * `pnpm nx run <slug>:build-element`. This host component:
 *
 *  1. Looks up the `RemoteEntry` for the requested slug via {@link findRemote}.
 *  2. Lazily injects `<script type="module" src="...">` for the WC bundle
 *     (idempotent — multiple navigations to the same remote inject the
 *     script only once).
 *  3. Renders the custom element via Angular's template; the WC's own
 *     bootstrap registers the tag and mounts the sub-app.
 *  4. Surfaces a friendly fallback if the bundle is missing
 *     (`Run pnpm nx run <slug>:build-element` instructions).
 *
 * Native Federation (proper MFE with DI hoisting + shared singletons) is a
 * future optimization tracked as Phase 3 follow-up in the consolidated plan.
 *
 * @packageDocumentation
 */
import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { findRemote, type RemoteEntry } from './portal-nav.js';

type LoadStatus = 'idle' | 'loading' | 'ready' | 'error';

@Component({
  selector: 'ais-portal-remote-host',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  host: { class: 'block min-h-full' },
  styles: [
    `
      :host {
        display: block;
        height: 100%;
      }
      .state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        padding: 4rem 1.5rem;
        text-align: center;
        min-height: 24rem;
      }
      .state__icon {
        width: 3.5rem;
        height: 3.5rem;
        border-radius: 9999px;
        display: grid;
        place-items: center;
        background: var(--mat-sys-primary-container);
        color: var(--mat-sys-on-primary-container);
      }
      .state__icon mat-icon {
        font-size: 1.75rem;
        width: 1.75rem;
        height: 1.75rem;
      }
      .state__title {
        font: var(--mat-sys-title-medium);
        margin: 0;
      }
      .state__hint {
        font: var(--mat-sys-body-medium);
        color: var(--mat-sys-on-surface-variant);
        margin: 0;
        max-width: 56ch;
      }
      .state__hint code {
        background: var(--mat-sys-surface-container-high);
        padding: 0.125rem 0.5rem;
        border-radius: 0.375rem;
        font-size: 0.875rem;
      }
      .remote-frame {
        background: var(--mat-sys-surface);
        border-radius: var(--mat-sys-corner-large);
        overflow: hidden;
        min-height: 32rem;
      }
    `,
  ],
  template: `
    @if (entry() === null) {
      <div
        class="state"
        data-testid="remote-unknown"
      >
        <span class="state__icon"><mat-icon>help_outline</mat-icon></span>
        <h2 class="state__title">Unknown remote: {{ slug() }}</h2>
        <p class="state__hint">
          Brak wpisu w portal-nav. Dodaj rekord do
          <code>libs/portal-shell/src/portal-nav.ts</code>
          i zbuduj bundle przez
          <code>pnpm nx run {{ slug() }}:build-element</code>
          .
        </p>
      </div>
    } @else {
      @switch (status()) {
        @case ('loading') {
          <div class="state">
            <mat-spinner diameter="48" />
            <p class="state__hint">
              Ładuję bundle
              <code>{{ entry()!.bundleDir }}/main.js</code>
              …
            </p>
          </div>
        }
        @case ('error') {
          <div
            class="state"
            data-testid="remote-error"
          >
            <span class="state__icon"><mat-icon>warning_amber</mat-icon></span>
            <h2 class="state__title">Bundle nie znaleziony</h2>
            <p class="state__hint">
              Zbuduj
              <code>{{ entry()!.label }}</code>
              jako Web Component:
              <br />
              <code>pnpm nx run {{ entry()!.slug }}:build-element</code>
              <br />
              następnie odśwież stronę portalu. Możesz też otworzyć aplikację w standalone na porcie
              <code>{{ entry()!.standalonePort }}</code>
              .
            </p>
            <a
              [href]="standaloneUrl()"
              matButton="filled"
              target="_blank"
              rel="noopener"
            >
              <mat-icon>open_in_new</mat-icon>
              Otwórz standalone
            </a>
          </div>
        }
        @case ('ready') {
          <div
            [attr.data-testid]="'remote-frame-' + slug()"
            [innerHTML]="elementHtml()"
            class="remote-frame"
          ></div>
        }
        @default {
          <div class="state">
            <mat-spinner diameter="32" />
          </div>
        }
      }
    }
  `,
})
export class RemoteHostComponent {
  private readonly document = inject(DOCUMENT);

  /** Bound from the route segment via withComponentInputBinding(). */
  readonly slug = input<string>('');

  protected readonly entry = computed<RemoteEntry | null>(() => findRemote(this.slug()));
  protected readonly status = signal<LoadStatus>('idle');

  protected readonly elementHtml = computed(() => {
    const e = this.entry();
    return e === null ? '' : `<${e.tag}></${e.tag}>`;
  });

  protected readonly standaloneUrl = computed(() => {
    const e = this.entry();
    return e === null ? '#' : `http://localhost:${e.standalonePort}`;
  });

  // ── Bundle loader ────────────────────────────────────────────────────────
  // Each entry's <script> tag is injected once (idempotent). On script error
  // we surface the "build the bundle" hint; on load we mark the remote ready.
  readonly #loaded = new Set<string>();

  constructor() {
    // Wired through Angular's effect() — re-runs whenever `slug()` changes
    // (route navigation) and resolves the bundle status. The EffectRef is
    // intentionally discarded; the effect lives for the component lifetime.
    effect(() => this.resolveRemote());
  }

  private resolveRemote(): void {
    const e = this.entry();
    if (e === null) {
      this.status.set('idle');
      return;
    }
    if (this.#loaded.has(e.slug)) {
      this.status.set('ready');
      return;
    }
    this.status.set('loading');
    const script = this.document.createElement('script');
    script.type = 'module';
    script.src = `/element-bundles/${e.bundleDir}/main.js`;
    script.dataset['portalRemote'] = e.slug;
    script.addEventListener('load', () => {
      this.#loaded.add(e.slug);
      this.status.set('ready');
    });
    script.addEventListener('error', () => {
      this.status.set('error');
    });
    this.document.head.append(script);
  }
}
