import Offcanvas from 'bootstrap/js/dist/offcanvas';
import { gsap } from 'gsap';
import { projectGroups, projects, type Project } from './content';
import { renderDiagram } from './diagram';
import { refreshIcons } from './icons';

const ICON_ARROW = '<i data-lucide="arrow-up-right" aria-hidden="true"></i>';
const ICON_PLUS = '<i data-lucide="plus" aria-hidden="true"></i>';

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
      <section class="project-group" aria-labelledby="group-${g.slug}">
        <header class="project-group__head">
          <span class="project-group__index mono">${pad(gi + 1)} / ${pad(projectGroups.length)}</span>
          <div>
            <p class="label">Project</p>
            <h3 class="project-group__title" id="group-${g.slug}">${g.title}</h3>
            <p class="project-group__summary">${g.summary}</p>
          </div>
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
      <div><dt class="label">Status</dt><dd>${p.status}</dd></div>
      <div><dt class="label">Index</dt><dd>${pad(i + 1)} of ${pad(projects.length)}</dd></div>
    </dl>
    <div class="case-study__block">
      <span class="label">Tech stack</span>
      <ul class="project__stack">${chips(p.stack)}</ul>
    </div>
    ${block('Architecture highlights', p.architecture)}
    ${block('Key features', p.features)}
    <div class="case-study__actions">
      <a class="btn btn--primary" href="${p.repo}" target="_blank" rel="noopener noreferrer">
        <span>Open repository</span> ${ICON_ARROW}
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

  const show = (slug: string) => {
    if (slug === current) return;
    const p = projects.find((x) => x.slug === slug);
    if (!p) return;
    current = slug;
    if (!cache.has(slug)) cache.set(slug, renderDiagram(p.diagram, p.title));

    const swap = () => {
      figure.innerHTML = cache.get(slug)!;
      title.textContent = p.title;
      meta.textContent = `${p.layer} · ${p.language} · ${p.stack.slice(0, 3).join(' / ')}`;
    };
    if (reduced) return swap();
    gsap
      .timeline()
      .to(panel.children, { autoAlpha: 0, y: 8, duration: 0.18, ease: 'power2.in', stagger: 0.02 })
      .add(swap)
      .to(panel.children, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power3.out', stagger: 0.04, clearProps: 'transform' });
  };

  const first = projects[0];
  if (first) show(first.slug);

  const rowSlug = (t: EventTarget | null) => (t as HTMLElement | null)?.closest<HTMLElement>('.project')?.dataset.project;
  list.addEventListener('pointerover', (e) => {
    const s = rowSlug(e.target);
    if (s) show(s);
  });
  list.addEventListener('focusin', (e) => {
    const s = rowSlug(e.target);
    if (s) show(s);
  });
}
