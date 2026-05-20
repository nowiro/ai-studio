/**
 * Vitest setup for `libs/charts` — loads the Angular JIT compiler so
 * partial-compiled libraries resolve their `ngDeclareFactory` calls and
 * initialises the `TestBed` environment using Angular 21's consolidated
 * `@angular/platform-browser/testing` module.
 */
import '@angular/compiler';
import { getTestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';

getTestBed().initTestEnvironment(BrowserTestingModule, platformBrowserTesting(), {
  teardown: { destroyAfterEach: true },
});
