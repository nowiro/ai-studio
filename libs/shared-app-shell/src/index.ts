/**
 * Public API for the shared app-shell library — utilities and components
 * that are common across every app in this repo.
 *
 * @packageDocumentation
 */
export { bootstrapApp } from './bootstrap.js';
export { NotFoundComponent } from './not-found.component.js';
export { formatPln } from './format-pln.js';
export { AUTH_CONTEXT, type AuthContext } from './auth-context.js';
export { RoleAllowDirective } from './role-allow.directive.js';
export { roleGuard, type RoleGuardRedirect } from './role-guard.js';
export { RoleBadgeComponent, type BadgeTone } from './role-badge.component.js';
export { MockLoginComponent, type MockLoginProfile } from './mock-login.component.js';
