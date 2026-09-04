import Offcanvas from 'bootstrap/js/dist/offcanvas';
import { gsap } from 'gsap';
import { projects, type Project } from './content';
import { renderDiagram } from './diagram';
import { refreshIcons } from './icons';

const ICON_ARROW = '<i data-lucide="arrow-up-right" aria-hidden="true"></i>';
const ICON_PLUS = '<i data-lucide="plus" aria-hidden="true"></i>';

function chips(items: string[]): string {
  return items.map((s) => `<li class="chip">${s}</li>`).join('');
}

function renderRow(p: Project, i: number): string {
  const n = String(i + 1).padStart(2, '0');
  return `
    <article class="project" data-project="${p.slug}" data-cursor="View">
      <span class="project__index">${n} / ${String(projects.length).padStart(2, '0')}</span>
      <div class="project__title-wrap">
        <h3 class="project__title">${p.title}</h3>
        <p class="label">${p.tagline}</p>
        <p class="project__desc">${p.description}</p>
        <div class="project__actions">
          <button class="project__link project__link--case" type="button" data-case-open="${p.slug}" aria-haspopup="dialog" aria-controls="case-study">
            Case study ${ICON_PLUS}
          </button>
          <a class="project__link" href="${p.repo}" target="_blank" rel="noopener noreferrer">
            Repository ${ICON_ARROW}
          </a>
        </div>
      </div>
      <div class="project__meta">
        <ul class="project__stack" aria-label="Technology stack">${chips(p.stack.slice(0, 5))}</ul>
        <span class="project__status">${p.status.split(' · ')[0]}</span>
      </div>
    </article>`;
}

function renderCase(p: Project, i: number): string {
  const kv = `
    <dl class="case-study__kv">
      <div><dt class="label">Role</dt><dd>${p.role}</dd></div>
      <div><dt class="label">Primary language</dt><dd>${p.language}</dd></div>
      <div><dt class="label">Status</dt><dd>${p.status}</dd></div>
      <div><dt class="label">Index</dt><dd>${String(i + 1).padStart(2, '0')} of ${String(projects.length).padStart(2, '0')}</dd></div>
    </dl>`;
  const block = (title: string, items: string[]) => `
    <div class="case-study__block">
      <span class="label">${title}</span>
      <ul>${items.map((x) => `<li>${x}</li>`).join('')}</ul>
    </div>`;
  return `
    <h2 id="case-study-title" class="case-study__title">${p.title}</h2>
    <p class="lede">${p.tagline}</p>
    <figure class="case-study__figure">${renderDiagram(p.diagram, p.title)}</figure>
    <div class="case-study__block">
      <span class="label">Purpose</span>
      <p>${p.purpose}</p>
    </div>
    ${kv}
    <div class="case-study__block">
      <span class="label">Tech stack</span>
      <ul class="project__stack" style="display:flex;flex-wrap:wrap;gap:var(--space-2)">${chips(p.stack)}</ul>
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

  list.innerHTML = projects.map(renderRow).join('');
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
    index.textContent = `${String(i + 1).padStart(2, '0')} — Case study`;
    refreshIcons(body);
    opener = btn;
    oc.show();
  });
  drawer.addEventListener('hidden.bs.offcanvas', () => opener?.focus());

  initPreview(list);
}

/** Cursor-following architecture preview on desktop hover. */
function initPreview(list: HTMLElement): void {
  const preview = document.querySelector<HTMLElement>('[data-project-preview]');
  const inner = preview?.querySelector<HTMLElement>('[data-project-preview-inner]');
  const fine = matchMedia('(hover: hover) and (pointer: fine) and (min-width: 64em)').matches;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!preview || !inner || !fine || reduced) return;

  const cache = new Map<string, string>();
  const xTo = gsap.quickTo(preview, 'x', { duration: 0.5, ease: 'power3.out' });
  const yTo = gsap.quickTo(preview, 'y', { duration: 0.5, ease: 'power3.out' });
  const rotTo = gsap.quickTo(preview, 'rotation', { duration: 0.6, ease: 'power3.out' });
  let lastX = 0;

  const show = (slug: string) => {
    const p = projects.find((x) => x.slug === slug);
    if (!p) return;
    if (!cache.has(slug)) cache.set(slug, renderDiagram(p.diagram, p.title));
    inner.innerHTML = cache.get(slug)!;
    gsap.to(preview, { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'power3.out', overwrite: true });
  };
  const hide = () => gsap.to(preview, { autoAlpha: 0, scale: 0.92, duration: 0.3, ease: 'power3.in', overwrite: true });

  list.addEventListener('pointerover', (e) => {
    const row = (e.target as HTMLElement).closest<HTMLElement>('.project');
    if (row?.dataset.project) show(row.dataset.project);
  });
  list.addEventListener('pointerleave', hide);
  list.addEventListener(
    'pointermove',
    (e) => {
      xTo(e.clientX + 40);
      yTo(e.clientY);
      rotTo(gsap.utils.clamp(-6, 6, (e.clientX - lastX) * 0.4));
      lastX = e.clientX;
    },
    { passive: true },
  );
  gsap.set(preview, { autoAlpha: 0, scale: 0.92 });
}
