import $ from 'jquery';
import { gsap } from 'gsap';
import { ribbonItems, stackGroups } from './content';

/**
 * Technical arsenal: an accessible tablist (WAI-ARIA pattern) driving a grid
 * of technology cells. jQuery handles the delegated tab events and DOM swaps;
 * GSAP staggers cell entrances.
 */
export function initStack(): void {
  const $tabs = $('[data-stack-tabs]');
  const $panel = $('[data-stack-panel]');
  if (!$tabs.length || !$panel.length) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  $tabs.html(
    stackGroups
      .map(
        (g, i) => `
        <button class="stack__tab" role="tab" type="button" id="stack-tab-${g.id}"
          aria-selected="${i === 0}" aria-controls="stack-panel-${g.id}" tabindex="${i === 0 ? 0 : -1}" data-group="${g.id}">
          <span>${g.label}</span><b>${String(g.items.length).padStart(2, '0')}</b>
        </button>`,
      )
      .join(''),
  );

  const render = (id: string) => {
    const g = stackGroups.find((x) => x.id === id) ?? stackGroups[0]!;
    $panel
      .attr({ role: 'tabpanel', id: `stack-panel-${g.id}`, 'aria-labelledby': `stack-tab-${g.id}` })
      .html(`
        <div class="stack__desc">
          <span class="label">${g.label}</span>
          <h3>${g.title}</h3>
          <p>${g.description}</p>
        </div>
        <ul class="stack__grid" aria-label="${g.label} technologies">
          ${g.items.map((it) => `<li class="stack__cell"><span>${it.name}</span><small>${it.note}</small></li>`).join('')}
        </ul>`);

    if (!reduced) {
      gsap.fromTo(
        $panel.find('.stack__cell').toArray(),
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.035, ease: 'power3.out', clearProps: 'transform' },
      );
    }
  };

  const select = (btn: HTMLElement, focus = false) => {
    $tabs.find('[role="tab"]').attr({ 'aria-selected': 'false', tabindex: '-1' });
    $(btn).attr({ 'aria-selected': 'true', tabindex: '0' });
    if (focus) btn.focus();
    render(btn.dataset.group ?? 'core');
  };

  $tabs.on('click', '[role="tab"]', function (this: HTMLElement) {
    select(this);
  });

  // Arrow-key navigation per the tabs pattern
  $tabs.on('keydown', '[role="tab"]', function (this: HTMLElement, e: JQuery.KeyDownEvent) {
    const tabs = $tabs.find<HTMLElement>('[role="tab"]').toArray();
    const i = tabs.indexOf(this);
    const map: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    let next: number | null = null;
    if (e.key in map) next = (i + (map[e.key] ?? 0) + tabs.length) % tabs.length;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = tabs.length - 1;
    if (next === null) return;
    e.preventDefault();
    select(tabs[next]!, true);
  });

  render('core');
  initRibbon(reduced);
}

/** Infinite technology ribbon driven by a single GSAP tween (transform only). */
function initRibbon(reduced: boolean): void {
  const track = document.querySelector<HTMLElement>('[data-ribbon-track]');
  if (!track) return;
  const html = ribbonItems.map((t) => `<span class="ribbon__item">${t}</span>`).join('');
  track.innerHTML = html + html; // duplicate for seamless loop
  if (reduced) return;

  const half = () => track.scrollWidth / 2;
  const tween = gsap.to(track, {
    x: () => -half(),
    duration: 40,
    ease: 'none',
    repeat: -1,
    modifiers: { x: (x) => `${parseFloat(x) % half()}px` },
  });

  // Pause when off-screen to save CPU
  new IntersectionObserver(([e]) => (e?.isIntersecting ? tween.play() : tween.pause())).observe(track);
}
