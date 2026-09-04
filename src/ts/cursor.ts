import { gsap } from 'gsap';

/**
 * Custom cursor for fine pointers. Follows the mouse with a light lerp via
 * gsap.quickTo (transform-only, GPU friendly). Disabled for touch, coarse
 * pointers and reduced-motion users — the native cursor remains fully usable.
 */
export function initCursor(): void {
  const enabled =
    matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !matchMedia('(prefers-reduced-motion: reduce)').matches;
  const el = document.getElementById('cursor');
  if (!enabled || !el) return;

  const label = el.querySelector<HTMLElement>('[data-cursor-label]');
  document.body.classList.add('has-cursor');

  const xTo = gsap.quickTo(el, 'x', { duration: 0.28, ease: 'power3.out' });
  const yTo = gsap.quickTo(el, 'y', { duration: 0.28, ease: 'power3.out' });

  let shown = false;
  window.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType !== 'mouse') return;
      if (!shown) {
        gsap.set(el, { x: e.clientX, y: e.clientY });
        shown = true;
      }
      xTo(e.clientX);
      yTo(e.clientY);
    },
    { passive: true },
  );

  document.addEventListener('mouseleave', () => el.classList.add('is-hidden'));
  document.addEventListener('mouseenter', () => el.classList.remove('is-hidden'));

  // State via delegated hover; [data-cursor="view"] gets a labelled disc.
  document.addEventListener('pointerover', (e) => {
    const t = e.target as HTMLElement;
    const view = t.closest<HTMLElement>('[data-cursor]');
    if (view) {
      el.classList.add('is-view');
      el.classList.remove('is-link');
      if (label) label.textContent = view.dataset.cursor ?? 'View';
      return;
    }
    const link = t.closest('a, button, [role="tab"]');
    el.classList.toggle('is-link', !!link);
    el.classList.remove('is-view');
  });
}
