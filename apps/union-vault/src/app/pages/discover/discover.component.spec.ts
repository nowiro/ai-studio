import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { DiscoverPageComponent } from './discover.component';

const TEST_ROUTES = [{ path: ':countryCode', children: [] }];

describe('DiscoverPageComponent', () => {
  let fixture: ComponentFixture<DiscoverPageComponent>;
  let component: DiscoverPageComponent;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [DiscoverPageComponent],
      providers: [provideRouter(TEST_ROUTES)],
    }).compileComponents();

    fixture = TestBed.createComponent(DiscoverPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => localStorage.clear());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render 6 discover tabs', () => {
    const tabs = fixture.nativeElement.querySelectorAll('.discover-tab');
    expect(tabs.length).toBe(6);
  });

  it('should render cards for the active tab', () => {
    const cards = fixture.nativeElement.querySelectorAll('.discover-card');
    expect(cards.length).toBe(3);
  });

  it('should filter cards by search query', () => {
    // `currentTab` / `updateSearch` are `protected` (template-only); cast to a
    // narrow test-only API so we can call them from the spec without widening
    // the component's public surface.
    interface DiscoverTestApi {
      readonly currentTab: () => { readonly cards: readonly { readonly title: string }[] };
      readonly updateSearch: (query: string) => void;
    }
    const test = component as unknown as DiscoverTestApi;
    const firstWord = test.currentTab().cards[0].title.split(' ')[0];
    test.updateSearch(firstWord);
    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll('.discover-card');
    expect(cards.length).toBeGreaterThanOrEqual(1);
  });
});
