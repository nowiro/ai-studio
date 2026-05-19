/**
 * Vitest setup — loads the Angular JIT compiler so partial-compiled
 * libraries (`@angular/common`, `@angular/forms`) resolve their
 * `ngDeclareFactory` calls in a non-Angular bundler runtime.
 */
import '@angular/compiler';
