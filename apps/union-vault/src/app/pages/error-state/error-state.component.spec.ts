import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';

import { ErrorStatePageComponent } from './error-state.component';

function createActivatedRoute(variant: 'notFound' | 'serverError') {
  return {
    snapshot: {
      data: { variant },
    },
  };
}

describe('ErrorStatePageComponent', () => {
  let fixture: ComponentFixture<ErrorStatePageComponent>;

  async function configure(variant: 'notFound' | 'serverError') {
    await TestBed.configureTestingModule({
      imports: [ErrorStatePageComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: createActivatedRoute(variant),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorStatePageComponent);
    fixture.detectChanges();
  }

  it('should render 404 content by default', async () => {
    await configure('notFound');

    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('h1')?.textContent).toContain('Nie znaleźliśmy');
    expect(host.textContent).toContain('Błąd 404');
  });

  it('should render 500 content when route data requests serverError', async () => {
    await configure('serverError');

    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('h1')?.textContent).toContain('problem');
    expect(host.textContent).toContain('Błąd 500');
  });

  it('should expose quick links for home, contact, banks and currencies', async () => {
    await configure('notFound');

    const links = Array.from(fixture.nativeElement.querySelectorAll('a') as NodeListOf<HTMLAnchorElement>).map((link) =>
      link.getAttribute('href'),
    );

    expect(links).toEqual(['/pl', '/pl/contact', '/pl/banks', '/pl/currencies']);
  });
});
