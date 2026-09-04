import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

const MASKED_LINES = '[data-hero-line] > span, .hero__statement > span > span, [data-contact-line] > span';

export const motionAllowed = !matchMedia('(prefers-reduced-motion: reduce)').matches;
const isDesktop = () => matchMedia('(min-width: 64em)').matches;

/* ---------- Smooth scroll ---------- */
export function initSmoothScroll(): Lenis | null {
  // Lenis only where it adds value: fine pointers with motion allowed.
  if (!motionAllowed || !matchMedia('(hover: hover) and (pointer: fine)').matches) return null;

  const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.95, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

/* ---------- Preloader → hero sequence ---------- */
export function runIntro(onDone: () => void): void {
  const pre = document.getElementById('preloader');
  const body = document.body;
  if (!pre) return onDone();

  // Wrap hero lines for masked reveals (done before measuring anything)
  wrapLines('[data-hero-line]');
  wrapLines('.hero__statement > span');
  wrapLines('[data-contact-line]');

  const finish = () => {
    pre.classList.add('is-done');
    body.classList.remove('is-locked');
    onDone();
  };

  if (!motionAllowed) {
    // Reduced motion: no sequence, everything visible immediately.
    document.documentElement.classList.remove('motion');
    return finish();
  }

  body.classList.add('is-locked');
  gsap.set(MASKED_LINES, { yPercent: 110 });
  const count = pre.querySelector<HTMLElement>('[data-preloader-count]');
  const bar = pre.querySelector<HTMLElement>('[data-preloader-bar]');
  const name = pre.querySelector<HTMLElement>('[data-preloader-name]');
  const counter = { v: 0 };

  const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' }, onComplete: finish });
  tl.to(name, { autoAlpha: 1, duration: 0.5 }, 0)
    .to(bar, { scaleX: 1, duration: 1.1 }, 0.1)
    .to(
      counter,
      {
        v: 100,
        duration: 1.1,
        ease: 'power2.out',
        onUpdate: () => {
          if (count) count.textContent = String(Math.round(counter.v)).padStart(3, '0');
        },
      },
      0.1,
    )
    .to(pre, { yPercent: -100, duration: 0.8, ease: 'power4.inOut' }, 1.35)
    .add(heroReveal(), 1.55);
}

function heroReveal(): gsap.core.Timeline {
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
  tl.to('[data-hero-line] > span', { yPercent: 0, duration: 1.2, stagger: 0.12 }, 0)
    .to('[data-hero-role]', { autoAlpha: 1, duration: 0.6 }, 0.5)
    .to('.hero__statement > span > span', { yPercent: 0, duration: 1, stagger: 0.09 }, 0.55)
    .to('.hero [data-reveal]', { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08, clearProps: 'transform' }, 0.8);
  return tl;
}

/** Wrap the text of each matching element in a <span> for translateY masking. */
function wrapLines(selector: string): void {
  document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
    if (el.querySelector(':scope > span')) return;
    const span = document.createElement('span');
    span.textContent = el.textContent;
    el.textContent = '';
    el.appendChild(span);
  });
}

/* ---------- Scroll-driven reveals ---------- */
export function initScrollAnimations(): void {
  if (!motionAllowed) return;

  // Generic fade-up reveals (skip hero — handled by the intro sequence)
  gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
    if (el.closest('.hero')) return;
    gsap.to(el, {
      autoAlpha: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out',
      clearProps: 'transform',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });

  // Word-masked headings
  document.querySelectorAll<HTMLElement>('[data-split-words]').forEach((el) => {
    const split = SplitText.create(el, { type: 'words', mask: 'words', wordsClass: 'split-word' });
    gsap.set(el, { visibility: 'visible' });
    gsap.from(split.words, {
      yPercent: 110,
      duration: 0.9,
      stagger: 0.04,
      ease: 'power4.out',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    });
  });

  // Contact statement lines
  gsap.to('[data-contact-line] > span', {
    yPercent: 0,
    duration: 1.1,
    stagger: 0.1,
    ease: 'power4.out',
    scrollTrigger: { trigger: '.contact__title', start: 'top 80%', once: true },
  });

  // Counters
  document.querySelectorAll<HTMLElement>('[data-counter]').forEach((el) => {
    const target = Number(el.dataset.counter ?? 0);
    const suffix = el.dataset.suffix ?? '';
    const obj = { v: 0 };
    gsap.to(obj, {
      v: target,
      duration: 1.4,
      ease: 'power2.out',
      onUpdate: () => {
        el.textContent = `${Math.round(obj.v)}${suffix}`;
      },
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });

  // Hero glow: subtle pointer parallax (desktop) + scroll drift
  const glow = document.querySelector<HTMLElement>('[data-hero-glow]');
  if (glow && isDesktop()) {
    const xTo = gsap.quickTo(glow, 'x', { duration: 1.2, ease: 'power2.out' });
    const yTo = gsap.quickTo(glow, 'y', { duration: 1.2, ease: 'power2.out' });
    window.addEventListener(
      'pointermove',
      (e) => {
        xTo((e.clientX / innerWidth - 0.5) * 120);
        yTo((e.clientY / innerHeight - 0.5) * 120);
      },
      { passive: true },
    );
  }
  gsap.to('.hero__name', {
    yPercent: 12,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
  });

  initMagnetic();
}

/* ---------- Magnetic buttons (desktop only) ---------- */
function initMagnetic(): void {
  if (!isDesktop() || !matchMedia('(hover: hover)').matches) return;
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * 0.25);
      yTo((e.clientY - (r.top + r.height / 2)) * 0.35);
    });
    el.addEventListener('pointerleave', () => {
      xTo(0);
      yTo(0);
    });
  });
}
