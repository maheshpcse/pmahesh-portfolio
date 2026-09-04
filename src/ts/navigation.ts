import Offcanvas from 'bootstrap/js/dist/offcanvas';
import type Lenis from 'lenis';

interface NavOptions {
  lenis: Lenis | null;
}

/**
 * Header behaviour: hide on scroll-down / show on scroll-up, scrolled state,
 * scroll progress bar, active-section highlighting and smooth anchor jumps
 * routed through Lenis when it is active.
 */
export function initNavigation({ lenis }: NavOptions): void {
  const header = document.getElementById('site-header');
  const progress = document.querySelector<HTMLElement>('[data-scroll-progress]');
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-nav-link]'));
  const sections = links
    .map((a) => document.querySelector<HTMLElement>(a.getAttribute('href') ?? ''))
    .filter((s): s is HTMLElement => s !== null);

  if (!header) return;

  // Bootstrap Offcanvas instances (mobile menu + case-study drawer).
  document.querySelectorAll<HTMLElement>('.offcanvas').forEach((el) => {
    Offcanvas.getOrCreateInstance(el);
    el.addEventListener('show.bs.offcanvas', () => lenis?.stop());
    el.addEventListener('hidden.bs.offcanvas', () => lenis?.start());
  });

  // Scroll state
  let lastY = window.scrollY;
  let ticking = false;
  const update = () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    header.classList.toggle('is-scrolled', y > 24);
    header.classList.toggle('is-hidden', y > lastY && y > 240 && !document.body.classList.contains('is-locked'));
    if (progress) progress.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
    lastY = y;
    ticking = false;
  };
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
  update();

  // Active section
  if ('IntersectionObserver' in window && sections.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = `#${entry.target.id}`;
          links.forEach((a) => {
            if (a.getAttribute('href') !== id) return;
            a.classList.toggle('is-active', entry.isIntersecting);
            if (entry.isIntersecting) a.setAttribute('aria-current', 'location');
            else a.removeAttribute('aria-current');
          });
        });
      },
      { rootMargin: '-40% 0px -55% 0px' },
    );
    sections.forEach((s) => io.observe(s));
  }

  // Anchor navigation
  document.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (!id || id === '#') return;
    const target = document.querySelector<HTMLElement>(id);
    if (!target) return;
    e.preventDefault();

    const offset = id === '#top' ? 0 : -16;
    if (lenis) {
      lenis.scrollTo(target, { offset, duration: 1.4 });
    } else {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    history.pushState(null, '', id);
    // Move focus for keyboard / screen-reader users without scrolling twice.
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });
}
