/**
 * Public API for the keycloak-auth library.
 *
 * Drop-in providers behind the existing `AUTH_CONTEXT` token from
 * `@ai-studio/shared-app-shell`. Replace `provideMockKeycloak()` with
 * `provideKeycloak({ url, realm, clientId })` to flip from dev/CI mock to
 * real Keycloak — no consumer code changes.
 *
 * @packageDocumentation
 */
export {
  KeycloakAuthService,
  type KeycloakAdapter,
  type KeycloakConfig,
  provideKeycloak,
  provideMockKeycloak,
  useMockKeycloakSwitcher,
} from './keycloak-auth.js';
