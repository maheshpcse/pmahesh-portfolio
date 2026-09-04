import Offcanvas from 'bootstrap/js/dist/offcanvas';
import { gsap } from 'gsap';
import { projectGroups, projects, type Project, type ProjectGroup } from './content';
import { renderDiagram } from './diagram';
import { refreshIcons } from './icons';

const ICON_ARROW = '<i data-lucide="arrow-up-right" aria-hidden="true"></i>';
const ICON_PLUS = '<i data-lucide="plus" aria-hidden="true"></i>';
const ICON_GLOBE = '<i data-lucide="globe" aria-hidden="true"></i>';

const liveLink = (p: Project | ProjectGroup, cls = 'project__link project__link--live') =>
  p.live
    ? `<a class="${cls}" href="${p.live.url}" target="_blank" rel="noopener noreferrer" title="${p.live.host} · verified ${p.live.verified}">
        <span class="live-dot" aria-hidden="true"></span>${p.live.label} ${ICON_ARROW}
      </a>`
    : '';

const screenshot = (g: ProjectGroup, eager = false) => `
  <img
    src="${g.screenshot.srcSmall}"
    srcset="${g.screenshot.srcSmall} 800w, ${g.screenshot.src} 1600w"
    sizes="(min-width: 64em) 40vw, 100vw"
    width="${g.screenshot.width}" height="${g.screenshot.height}"
    alt="${g.screenshot.alt}"
    loading="${eager ? 'eager' : 'lazy'}" decoding="async" />`;

const pad = (n: number) => String(n).padStart(2, '0');
const chips = (items: string[]) => items.map((s) => `<li class="chip">${s}</li>`).join('');

function renderRow(p: Project, gi: number, pi: number): string {
  return `
    <article class="project" data-project="${p.slug}" tabindex="-1">
      <span class="project__index mono">${pad(gi + 1)}.${pi + 1}</span>
      <div class="project__body">
        <div class="project__title-wrap">
          <h4 class="project__title">${p.title}</h4>
          <span class="project__layer">${p.layer}</span>
        </div>
        <p class="label">${p.tagline}</p>
        <p class="project__desc">${p.description}</p>
        <ul class="project__stack" aria-label="Technology stack">${chips(p.stack.slice(0, 5))}</ul>
        <div class="project__actions">
          ${liveLink(p)}
          <button class="project__link project__link--case" type="button" data-case-open="${p.slug}" aria-haspopup="dialog" aria-controls="case-study">
            Case study ${ICON_PLUS}
          </button>
          <a class="project__link" href="${p.repo}" target="_blank" rel="noopener noreferrer">
            Repository ${ICON_ARROW}
          </a>
          <span class="project__status">${p.status.split(' · ')[0]}</span>
        </div>
      </div>
    </article>`;
}

function renderGroups(): string {
  return projectGroups
    .map(
      (g, gi) => `
      <section class="project-group" aria-labelledby="group-${g.slug}" data-group="${g.slug}">
        <header class="project-group__head">
          <span class="project-group__index mono">${pad(gi + 1)} / ${pad(projectGroups.length)}</span>
          <div class="project-group__intro">
            <p class="label">Project · <span class="label--accent">live</span></p>
            <h3 class="project-group__title" id="group-${g.slug}">${g.title}</h3>
            <p class="project-group__summary">${g.summary}</p>
            <div class="project-group__actions">
              <a class="btn btn--primary" href="${g.live.url}" target="_blank" rel="noopener noreferrer">
                <span>${g.live.label}</span> ${ICON_GLOBE}
              </a>
              <span class="project-group__host mono">${g.live.host} · <a href="${g.live.url}" target="_blank" rel="noopener noreferrer">${g.live.url.replace(/^https?:\/\//, '')}</a></span>
            </div>
          </div>
          <a class="project-group__shot" href="${g.live.url}" target="_blank" rel="noopener noreferrer" aria-label="Open ${g.title} live site">
            ${screenshot(g)}
          </a>
        </header>
        <div class="project-group__rows">
          ${g.projects.map((p, pi) => renderRow(p, gi, pi)).join('')}
        </div>
      </section>`,
    )
    .join('');
}

function renderCase(p: Project, i: number): string {
  const block = (title: string, items: string[]) => `
    <div class="case-study__block">
      <span class="label">${title}</span>
      <ul class="case-study__list">${items.map((x) => `<li>${x}</li>`).join('')}</ul>
    </div>`;
  return `
    <h2 id="case-study-title" class="case-study__title">${p.title}</h2>
    <p class="lede">${p.tagline}</p>
    <figure class="case-study__figure">${renderDiagram(p.diagram, p.title)}</figure>
    <div class="case-study__block">
      <span class="label">Purpose</span>
      <p>${p.purpose}</p>
    </div>
    <dl class="case-study__kv">
      <div><dt class="label">Role</dt><dd>${p.role}</dd></div>
      <div><dt class="label">Layer</dt><dd>${p.layer} · ${p.language}</dd></div>
      <div><dt class="label">Deployment</dt><dd>${p.live ? `${p.live.host} · verified ${p.live.verified}` : 'Repository only'}</dd></div>
      <div><dt class="label">Index</dt><dd>${pad(i + 1)} of ${pad(projects.length)}</dd></div>
    </dl>
    <div class="case-study__block">
      <span class="label">Tech stack</span>
      <ul class="project__stack">${chips(p.stack)}</ul>
    </div>
    ${block('Architecture highlights', p.architecture)}
    ${block('Key features', p.features)}
    <div class="case-study__actions">
      ${p.live ? `<a class="btn btn--primary" href="${p.live.url}" target="_blank" rel="noopener noreferrer"><span>${p.live.label}</span> ${ICON_GLOBE}</a>` : ''}
      <a class="btn btn--ghost" href="${p.repo}" target="_blank" rel="noopener noreferrer">
        <span>Repository</span> ${ICON_ARROW}
      </a>
    </div>`;
}

export function initProjects(): void {
  const list = document.querySelector<HTMLElement>('[data-project-list]');
  const drawer = document.getElementById('case-study');
  const body = drawer?.querySelector<HTMLElement>('[data-case-body]');
  const index = drawer?.querySelector<HTMLElement>('[data-case-index]');
  if (!list || !drawer || !body || !index) return;

  list.innerHTML = renderGroups();
  refreshIcons(list);

  // Case-study drawer (Bootstrap Offcanvas handles focus trap, ESC, backdrop)
  const oc = Offcanvas.getOrCreateInstance(drawer);
  let opener: HTMLElement | null = null;

  list.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-case-open]');
    if (!btn) return;
    const i = projects.findIndex((p) => p.slug === btn.dataset.caseOpen);
    const p = projects[i];
    if (!p) return;
    body.innerHTML = renderCase(p, i);
    index.textContent = `${pad(i + 1)} — Case study`;
    refreshIcons(body);
    opener = btn;
    oc.show();
  });
  drawer.addEventListener('hidden.bs.offcanvas', () => opener?.focus());

  initPreviewPanel(list);
}

/**
 * Sticky preview panel (desktop): shows the architecture sketch of the row
 * under the pointer or keyboard focus. Anchored to the layout rather than the
 * cursor so it is deterministic across scroll libraries and viewports.
 */
function initPreviewPanel(list: HTMLElement): void {
  const panel = document.querySelector<HTMLElement>('[data-project-preview]');
  const figure = panel?.querySelector<HTMLElement>('[data-preview-figure]');
  const title = panel?.querySelector<HTMLElement>('[data-preview-title]');
  const meta = panel?.querySelector<HTMLElement>('[data-preview-meta]');
  if (!panel || !figure || !title || !meta) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cache = new Map<string, string>();
  let current = '';

  const groupOf = (slug: string) => projectGroups.find((g) => g.projects.some((p) => p.slug === slug));

  /** Frontend rows and group headers show the live home page; backend rows show the architecture sketch. */
  const show = (slug: string) => {
    if (slug === current) return;
    const group = projectGroups.find((g) => g.slug === slug) ?? groupOf(slug);
    const p = projects.find((x) => x.slug === slug);
    if (!group) return;
    current = slug;

    const useShot = !p || p.layer === 'Frontend';
    if (!cache.has(slug)) cache.set(slug, useShot ? screenshot(group, true) : renderDiagram(p!.diagram, p!.title));

    const swap = () => {
      figure.innerHTML = cache.get(slug)!;
      figure.classList.toggle('is-shot', useShot);
      title.textContent = p ? p.title : group.title;
      meta.textContent = p
        ? `${p.layer} · ${p.live ? `Live on ${p.live.host}` : p.language} · ${p.stack.slice(0, 3).join(' / ')}`
        : `Live on ${group.live.host} · ${group.live.url.replace(/^https?:\/\//, '')}`;
    };
    if (reduced) return swap();
    gsap
      .timeline()
      .to(panel.children, { autoAlpha: 0, y: 8, duration: 0.18, ease: 'power2.in', stagger: 0.02 })
      .add(swap)
      .to(panel.children, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power3.out', stagger: 0.04, clearProps: 'transform' });
  };

  const first = projectGroups[0];
  if (first) show(first.slug);

  const rowSlug = (t: EventTarget | null) => {
    const el = t as HTMLElement | null;
    return el?.closest<HTMLElement>('.project')?.dataset.project ?? el?.closest<HTMLElement>('.project-group__head')?.closest<HTMLElement>('[data-group]')?.dataset.group;
  };
  list.addEventListener('pointerover', (e) => {
    const s = rowSlug(e.target);
    if (s) show(s);
  });
  list.addEventListener('focusin', (e) => {
    const s = rowSlug(e.target);
    if (s) show(s);
  });
}
