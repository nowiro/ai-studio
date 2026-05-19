/**
 * Vitest setup — loads the Angular JIT compiler so that partial-compiled
 * libraries (`@angular/common`, `@angular/forms`) can still resolve their
 * `ngDeclareFactory` calls in a non-Angular bundler runtime.
 */
import '@angular/compiler';
