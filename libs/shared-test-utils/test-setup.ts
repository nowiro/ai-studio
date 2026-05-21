/**
 * Vitest setup for shared-test-utils library tests.
 *
 * Provides jsdom + Angular TestBed environment matching the rest of the repo
 * (see `libs/shop-ui/test-setup.ts`).
 */
import '@angular/compiler';
import { getTestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';

getTestBed().initTestEnvironment(BrowserTestingModule, platformBrowserTesting(), {
  teardown: { destroyAfterEach: true },
});
