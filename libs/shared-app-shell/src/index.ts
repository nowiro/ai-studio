/**
 * Public API for the shared app-shell library — utilities and components
 * that are common across every app in this repo.
 *
 * @packageDocumentation
 */
export { bootstrapApp } from './bootstrap.js';
export { bootstrapAsElement } from './element-bootstrap.js';
export { NotFoundComponent } from './not-found.component.js';
export { formatPln } from './format-pln.js';
export { AUTH_CONTEXT, type AuthContext } from './auth-context.js';
export { RoleAllowDirective } from './role-allow.directive.js';
export { roleGuard, type RoleGuardRedirect } from './role-guard.js';
export { RoleBadgeComponent, type BadgeTone } from './role-badge.component.js';
export { MockLoginComponent, type MockLoginProfile } from './mock-login.component.js';
export { AnalyticsService, provideAnalytics, type AnalyticsEvent, type AnalyticsOptions } from './analytics.js';
export { MfeBus, type MfeEvent } from './mfe-bus.js';
export { RevealOnScrollDirective } from './reveal-on-scroll.directive.js';

// Keycloak primitives moved to `@ai-studio/keycloak-auth` (scope:auth).
// The lib is opt-in: apps that don't need real Keycloak install nothing extra.
