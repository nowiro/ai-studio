# 0013 — Keycloak auth integration

- Status: accepted (2026-05-19, after /clarify)
- Date: 2026-05-18
- Decision-makers: orchestrator, architect
- Consulted: frontend-developer, code-reviewer
- Informed: library + school-journal + portal maintainers

## Context and problem statement

Two apps currently demo role-based access: `library` (reader /
librarian) and `school-journal` (multi-role multi-context). Both ship
a mock `SessionService` / `AuthService` implementing the
`AuthContext` interface from `libs/shared-app-shell/src/auth-context.ts`.

We want to make Keycloak a **drop-in replacement** for the mock,
without:

- Forcing every app to install `keycloak-js` (it's ~80 KB even when
  unused).
- Breaking the existing `AUTH_CONTEXT` consumers (role-allow directive,
  role guard, role badge, mock-login dropdown).
- Requiring a running Keycloak server during local development or CI.

Which adapter, where does the code live, and how does the swap work?

## Decision drivers

- **Same token** — consumers (`RoleAllowDirective`, `roleGuard`,
  `RoleBadgeComponent`) read `AUTH_CONTEXT`. Switching auth backends
  must not touch them.
- **Opt-in** — apps that don't need Keycloak pay zero bundle cost.
- **Dev-mode default** — `pnpm start:<app>` keeps the mock provider so
  no developer needs Keycloak running locally to iterate.
- **E2E friendliness** — the same `provideMockKeycloak()` works in
  Playwright without a network round-trip.
- **Standard adapter** — pick a maintained library, not a hand-rolled
  OIDC client.

## Considered options

1. **`keycloak-js` (peer dependency) + thin Angular service** — load
   the official adapter via dynamic import; wrap it in a service that
   implements `AuthContext`.
2. **`keycloak-angular`** — community Angular wrapper. Adds opinions
   on guards, interceptors, decorators.
3. **`angular-oauth2-oidc`** — generic OIDC client that works against
   any conforming IdP (Keycloak, Auth0, Okta, …).
4. **Hand-rolled OIDC** — implement the Authorization Code + PKCE
   flow ourselves.

## Decision outcome

Chosen option **1 — `keycloak-js` as a peer dependency, wrapped in our
own service**.

The integration ships as two providers behind the same `AUTH_CONTEXT`
token:

- `provideKeycloak({ url, realm, clientId })` — real Keycloak. The
  `keycloak-js` adapter is dynamic-imported on first call, so apps
  that never opt in pay zero cost. Consuming apps must `pnpm add
keycloak-js` to enable the real path.
- `provideMockKeycloak({ initialRole })` — in-memory role switcher
  with the same `AuthContext` shape. The default in dev / E2E /
  Storybook. Switchable at runtime via `useMockKeycloakSwitcher()`.

Both providers live in `libs/shared-app-shell` for the placeholder
phase, then migrate to a dedicated `libs/keycloak-auth`
(`scope:auth`, `type:data-access`) in Phase 4 of the consolidated
roadmap. The Phase 4 extraction is purely about scope discipline —
the file moves, the API doesn't.

### Consequences

- ➕ Apps switch from mock to real Keycloak with one line:
  `provideMockKeycloak({ initialRole: 'reader' })` → `provideKeycloak({
url, realm, clientId })`. No consumer code changes.
- ➕ `keycloak-js` is a peer dependency, not a hard dep. Apps that
  don't need it (pong-game, tetris-game, individual-wizard, …)
  install nothing extra.
- ➕ The mock provider is the contract-tested default. Real Keycloak
  is opt-in per app.
- ➕ Tests run against `provideMockKeycloak()` — no need for a CI
  Keycloak container in the standard pipeline.
- ➖ The peer-dep pattern means a runtime "module not found" error if
  a consumer calls `provideKeycloak()` without installing
  `keycloak-js`. We catch this at provider construction and throw a
  clear message.
- ➖ `keycloak-js` ships its own promise polyfills. We accept the
  bundle-size penalty for the opt-in path.

## Pros and cons of the options

### Option 1 — `keycloak-js` + thin service (chosen)

- ➕ Official adapter; mainline.
- ➕ Peer-dep gives apps the opt-in cost model.
- ➕ Mock provider is trivial to maintain.
- ➖ Hand-roll route guards / HTTP interceptors per app (not heavy —
  the existing `roleGuard()` already covers most cases).

### Option 2 — `keycloak-angular`

- ➕ Out-of-the-box guards, interceptors, decorators.
- ➖ Heavier API surface that we don't all need.
- ➖ Couples us to the community wrapper's release cadence.
- ➖ Adds another layer between our `AuthContext` and `keycloak-js`.

### Option 3 — `angular-oauth2-oidc`

- ➕ IdP-agnostic.
- ➖ We don't need IdP portability today. YAGNI.
- ➖ Spec-driven boilerplate (discovery doc, key rotation, silent
  refresh) that `keycloak-js` handles internally.

### Option 4 — Hand-rolled OIDC

- ➕ Zero deps.
- ➖ Security-sensitive code we'd own.
- ➖ Feature parity (silent refresh, logout propagation, role parsing)
  takes weeks.

## Dev-mode default

Every app ships `provideMockKeycloak({ initialRole: 'reader' })` (or
the role appropriate for that app) in its standalone `main.ts`. To
flip to real Keycloak in production:

```ts
import { provideKeycloak } from '@ai-studio/keycloak-auth';

bootstrapApp(AppComponent, {
  providers: [
    // Replace this line:
    // ...provideMockKeycloak({ initialRole: 'reader' }),
    provideKeycloak({
      url: 'https://auth.example.com',
      realm: 'ai-studio',
      clientId: 'library-app',
    }),
  ],
});
```

Wiring is also gateable via an env flag — `KEYCLOAK_ENABLED=true pnpm
start:library` swaps the provider at build time using an
`environment.<flag>.ts` file. The env-driven path is the Phase 4 P4.4
deliverable.

## E2E + docker-compose

Phase 4 P4.5 lands a `docker-compose.yml` fragment that spins up an
ephemeral Keycloak with:

- One realm: `ai-studio`.
- One client per app (initial: `library-app`).
- Two test users: `reader.demo` / `librarian.demo` with their
  respective realm roles.

The E2E (`apps/library-e2e/src/keycloak.spec.ts`) runs only when
`KEYCLOAK_ENABLED=true` is set — CI gates this behind a `keycloak`
job that boots the compose fragment on demand.

## Implementation plan

PR-sized bullets, mirroring Phase 4 of the consolidated roadmap.

- [x] Add `KeycloakAuthService` + `provideKeycloak()` +
      `provideMockKeycloak()` + `useMockKeycloakSwitcher()` — landed
      initially in `libs/shared-app-shell` as a placeholder.
- [x] Extract into `libs/keycloak-auth` (`scope:auth`,
      `type:data-access`) — file moved, public API now lives at
      `@ai-studio/keycloak-auth`.
- [ ] Wire opt-in into `apps/library` first (env-flag gated).
- [ ] docker-compose Keycloak + two test users.
- [ ] Per-app `technical.md` "Authentication" section gains a
      "Keycloak" subsection.
- [ ] E2E smoke test (library only).

## References

- placeholder: libs/shared-app-shell/src/keycloak-auth.ts
- contract: libs/shared-app-shell/src/auth-context.ts
- rules: .ai/rules/security.md
- upstream: <https://www.keycloak.org/securing-apps/javascript-adapter>
- considered alt: <https://github.com/mauriciovigolo/keycloak-angular>
- considered alt: <https://github.com/manfredsteyer/angular-oauth2-oidc>
