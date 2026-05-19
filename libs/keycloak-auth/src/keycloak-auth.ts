/**
 * Keycloak-backed implementation of the `AuthContext` contract.
 *
 * This lib ships **two providers** for the same `AUTH_CONTEXT` token:
 *
 * - {@link provideKeycloak} — wires a real Keycloak instance (peer dependency,
 *   `keycloak-js` must be installed by the consuming app). The integration is
 *   intentionally lazy: the adapter is loaded via dynamic import so apps that
 *   never enable Keycloak don't pay the ~80 KB bundle cost.
 * - {@link provideMockKeycloak} — drop-in for dev/CI/Storybook that exposes
 *   the same `AuthContext` shape backed by an in-memory role-switcher. This
 *   is what every app uses out of the box.
 *
 * The split keeps the public surface stable: a consumer always sees a
 * `Signal<string | null>` for `role()` regardless of which provider is
 * active. Switching from mock to real Keycloak is a one-line provider
 * change in the app's `main.ts`.
 *
 * Decision rationale: `docs/adr/0013-keycloak-auth-integration.md`.
 *
 * @packageDocumentation
 */
import { computed, inject, type Provider, signal, type Signal } from '@angular/core';

import { AUTH_CONTEXT, type AuthContext } from '@ai-studio/shared-app-shell';

/**
 * Configuration accepted by both the real and mock Keycloak providers. Mirrors
 * the {@link https://www.keycloak.org/securing-apps/javascript-adapter | keycloak-js}
 * init options but keeps only the fields we actually consume.
 */
export interface KeycloakConfig {
  /** Keycloak server URL, e.g. `https://auth.example.com`. */
  readonly url: string;
  /** Realm name, e.g. `ai-studio`. */
  readonly realm: string;
  /** OIDC client ID configured in the realm, e.g. `library-app`. */
  readonly clientId: string;
  /**
   * Initial role to surface for E2E/dev runs that don't actually contact a
   * Keycloak server. Real Keycloak ignores this; mock Keycloak uses it as
   * the seed role.
   */
  readonly initialRole?: string | null;
}

/**
 * Minimal interface the lazily-imported `keycloak-js` adapter must satisfy.
 * Kept narrow on purpose: the lib only consumes init + token-parse APIs, so
 * a future swap to OIDC client / openid-client / etc. needs to implement
 * only these methods.
 */
export interface KeycloakAdapter {
  init(options: { onLoad: 'login-required' | 'check-sso' }): Promise<boolean>;
  readonly tokenParsed?: { readonly realm_access?: { readonly roles?: readonly string[] } };
  login?(): Promise<void>;
  logout?(): Promise<void>;
  loadUserInfo?(): Promise<unknown>;
}

/**
 * Concrete `AuthContext` implementation backed by a `KeycloakAdapter` (real or
 * fake). Owns the `role` signal that downstream consumers (RoleAllow
 * directive, role guards, role badge) read.
 *
 * Public callers should prefer {@link provideKeycloak} or
 * {@link provideMockKeycloak}; the class is exported for testability and
 * direct `inject(KeycloakAuthService)` usage in mock-mode role switchers.
 */
export class KeycloakAuthService implements AuthContext {
  readonly #role = signal<string | null>(null);

  /** Active realm role, or `null` when nobody is signed in. */
  readonly role: Signal<string | null> = computed(() => this.#role());

  constructor(initialRole: string | null = null) {
    this.#role.set(initialRole);
  }

  /**
   * Replace the signed-in role. Called by `provideKeycloak()` after a
   * successful Keycloak init, or by `provideMockKeycloak()`'s `switchRole()`
   * helper exposed via DI.
   */
  setRole(role: string | null): void {
    this.#role.set(role);
  }
}

/**
 * Wire a **real Keycloak instance** behind the `AUTH_CONTEXT` token.
 *
 * The `keycloak-js` adapter is loaded via dynamic import on first use, so
 * apps that never call `provideKeycloak()` pay zero bundle cost. The consuming
 * app must install `keycloak-js` as a runtime dependency:
 *
 * ```bash
 * pnpm add keycloak-js --filter=apps/library
 * ```
 *
 * ## Usage
 *
 * ```ts
 * import { provideKeycloak } from '@ai-studio/keycloak-auth';
 *
 * bootstrapApp(AppComponent, {
 *   providers: [
 *     provideKeycloak({
 *       url: 'https://auth.example.com',
 *       realm: 'ai-studio',
 *       clientId: 'library-app',
 *     }),
 *   ],
 * });
 * ```
 *
 * @param config Keycloak server + realm + client.
 * @returns Provider wiring `AUTH_CONTEXT` to a `KeycloakAuthService`.
 */
export function provideKeycloak(config: KeycloakConfig): Provider {
  return {
    provide: AUTH_CONTEXT,
    useFactory: (): AuthContext => {
      const service = new KeycloakAuthService(config.initialRole ?? null);

      // Dynamic import keeps `keycloak-js` out of bundles that never call
      // provideKeycloak(). The promise chain intentionally swallows network
      // errors and falls back to the initial role — production deployments
      // should wrap this in a route guard that blocks the app until the
      // session resolves.
      void (async (): Promise<void> => {
        try {
          const kc = await loadKeycloakAdapter(config);
          await kc.init({ onLoad: 'check-sso' });
          const roles = kc.tokenParsed?.realm_access?.roles ?? [];
          service.setRole(roles[0] ?? null);
        } catch {
          // Adapter unavailable or init failed — keep the initial role.
          service.setRole(config.initialRole ?? null);
        }
      })();

      return service;
    },
  };
}

/**
 * Mock provider — same shape as {@link provideKeycloak}, no network calls.
 *
 * Use this in dev (`pnpm start:<app>`), CI, and any test that exercises a
 * role-gated path without a real Keycloak server. The role can be flipped at
 * runtime via {@link useMockKeycloakSwitcher}.
 *
 * @param config Optional config — only `initialRole` is honoured.
 * @returns Providers wiring `AUTH_CONTEXT` to a mock `KeycloakAuthService`.
 */
export function provideMockKeycloak(config: Partial<KeycloakConfig> = {}): Provider[] {
  const service = new KeycloakAuthService(config.initialRole ?? null);
  return [
    { provide: KeycloakAuthService, useValue: service },
    { provide: AUTH_CONTEXT, useValue: service },
  ];
}

/**
 * Inject helper for components that want to flip the mock role from a
 * "log in as…" dropdown. Returns a `setRole()` callback bound to the
 * provided mock service.
 *
 * @example
 * ```ts
 * const switchRole = useMockKeycloakSwitcher();
 * switchRole('librarian');
 * ```
 *
 * @returns A function taking the new role (or `null` to log out).
 */
export function useMockKeycloakSwitcher(): (role: string | null) => void {
  const service = inject(KeycloakAuthService);
  return (role: string | null) => service.setRole(role);
}

/**
 * Lazy loader for the `keycloak-js` adapter. Isolated so unit tests can
 * stub it without bringing in the real library.
 */
async function loadKeycloakAdapter(config: KeycloakConfig): Promise<KeycloakAdapter> {
  interface KeycloakModule {
    readonly default: new (cfg: { url: string; realm: string; clientId: string }) => KeycloakAdapter;
  }
  const moduleSpecifier = 'keycloak-js';
  const module = (await import(/* @vite-ignore */ moduleSpecifier).catch(() => {
    throw new Error(
      'provideKeycloak: keycloak-js is not installed. Run `pnpm add keycloak-js` in the consuming app, ' +
        'or use provideMockKeycloak() for dev / E2E.',
    );
  })) as KeycloakModule;
  return new module.default({ url: config.url, realm: config.realm, clientId: config.clientId });
}
