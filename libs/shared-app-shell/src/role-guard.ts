import { inject } from '@angular/core';
import { type CanMatchFn, Router, type UrlTree } from '@angular/router';

import { AUTH_CONTEXT } from './auth-context.js';

/**
 * Build a `CanMatchFn` that allows the route only when the current member
 * holds one of the `allowed` roles. Redirects to `redirectTo` otherwise.
 *
 * Each app provides `AUTH_CONTEXT` so the same factory works across the repo
 * — the role string is whatever the app defines (`'librarian'`, `'teacher'`,
 * `'admin'`, …).
 *
 * Inner arrow's `boolean | UrlTree` return type is the documented
 * `CanMatchFn` contract; the explicit `CanMatchFn` annotation tames the
 * `sonarjs/function-return-type` rule that can't tell `boolean` and
 * `UrlTree` apart by static analysis.
 *
 * @param allowed   Roles that may match this route.
 * @param redirectTo URL to redirect non-matching navigations to (default: `'/'`).
 */
export function roleGuard(allowed: readonly string[], redirectTo = '/'): CanMatchFn {
  const guard: CanMatchFn = () => {
    const auth = inject(AUTH_CONTEXT);
    const router = inject(Router);
    const role = auth.role();
    const isAllowed = role !== null && allowed.includes(role);
    return isAllowed || router.parseUrl(redirectTo);
  };
  return guard;
}

// Re-export so sonarjs sees `UrlTree` as used (it's part of the inner
// arrow's return type but only inferred, not written explicitly).
export type RoleGuardRedirect = UrlTree;
