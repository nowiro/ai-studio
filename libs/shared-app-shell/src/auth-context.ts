import { InjectionToken, type Signal } from '@angular/core';

/**
 * Minimal contract every demo app's auth/session service implements so the
 * generic role-allow directive and role-guard can read the current role.
 *
 * Each app provides its concrete service via DI:
 *
 * ```ts
 * { provide: AUTH_CONTEXT, useExisting: AuthService }  // library
 * { provide: AUTH_CONTEXT, useExisting: SessionService } // school-journal
 * ```
 *
 * The `role()` signal returns the active role as a string (e.g. `'reader'`,
 * `'teacher'`, `'librarian'`) or `null` when nobody is signed in.
 */
export interface AuthContext {
  readonly role: Signal<string | null>;
}

/** DI token used by `RoleAllowDirective` + `roleGuard()`. */
export const AUTH_CONTEXT = new InjectionToken<AuthContext>('ais.AuthContext');
