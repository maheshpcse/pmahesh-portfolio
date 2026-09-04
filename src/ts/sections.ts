import { capabilities, education, experience, GITHUB_USER, pinnedRepos, RESUME_PATH } from './content';
import { refreshIcons } from './icons';

/* ---------- Professional experience ---------- */
function durationLabel(start: string, end: string | null): string {
  const [sy, sm] = start.split('-').map(Number) as [number, number];
  const now = new Date();
  const [ey, em] = end ? (end.split('-').map(Number) as [number, number]) : [now.getFullYear(), now.getMonth() + 1];
  const months = (ey - sy) * 12 + (em - sm) + 1;
  const y = Math.floor(months / 12);
  const m = months % 12;
  return [y ? `${y} yr${y > 1 ? 's' : ''}` : '', m ? `${m} mo` : ''].filter(Boolean).join(' ');
}

export function renderExperience(): void {
  const root = document.querySelector<HTMLElement>('[data-experience]');
  if (!root) return;

  root.innerHTML = experience
    .map(
      (e, i) => `
      <article class="xp" data-reveal>
        <div class="xp__meta">
          <span class="xp__index">${e.index}</span>
          <span class="xp__period mono">${e.period}</span>
          <span class="xp__duration mono">${durationLabel(e.start, e.end)}${e.end ? '' : ' · present'}</span>
        </div>
        <div class="xp__main">
          <div class="xp__head">
            <h3 class="xp__role">${e.role}</h3>
            <p class="xp__company"><span>${e.company}</span><span class="mono">${e.location}</span></p>
          </div>
          <ul class="xp__stack" aria-label="Tech stack">${e.stack.map((s) => `<li class="chip">${s}</li>`).join('')}</ul>
          <div class="xp__body">
            <ul class="xp__points">
              ${e.points.map((p, j) => `<li ${j >= 4 ? 'data-more hidden' : ''}>${p}</li>`).join('')}
            </ul>
            ${
              e.points.length > 4
                ? `<button class="xp__toggle mono" type="button" aria-expanded="false" aria-controls="xp-points-${i}" data-xp-toggle>
                     Show all ${e.points.length} responsibilities <i data-lucide="plus" aria-hidden="true"></i>
                   </button>`
                : ''
            }
          </div>
        </div>
      </article>`,
    )
    .join('');
  root.querySelectorAll('.xp__points').forEach((ul, i) => ul.setAttribute('id', `xp-points-${i}`));
  refreshIcons(root);

  root.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-xp-toggle]');
    if (!btn) return;
    const open = btn.getAttribute('aria-expanded') === 'true';
    const list = document.getElementById(btn.getAttribute('aria-controls') ?? '');
    list?.querySelectorAll<HTMLElement>('[data-more]').forEach((li) => (li.hidden = open));
    btn.setAttribute('aria-expanded', String(!open));
    const total = list?.children.length ?? 0;
    btn.innerHTML = `${open ? `Show all ${total} responsibilities` : 'Show fewer'} <i data-lucide="${open ? 'plus' : 'minus'}" aria-hidden="true"></i>`;
    refreshIcons(btn);
  });
}

/* ---------- Education ---------- */
export function renderEducation(): void {
  const root = document.querySelector<HTMLElement>('[data-education]');
  if (!root) return;
  root.innerHTML = education
    .map(
      (ed) => `
      <article class="edu" data-reveal>
        <span class="edu__period mono">${ed.period}</span>
        <div>
          <h3 class="edu__degree">${ed.degree}</h3>
          <p class="edu__inst">${ed.institution} · ${ed.location}</p>
        </div>
        <span class="edu__detail mono">${ed.detail}</span>
      </article>`,
    )
    .join('');
}

/* ---------- Capabilities accordion ---------- */
export function renderCapabilities(): void {
  const root = document.querySelector<HTMLElement>('[data-capabilities]');
  if (!root) return;

  root.innerHTML = capabilities
    .map(
      (c, i) => `
      <li class="cap" data-reveal>
        <h3>
          <button class="cap__trigger" type="button" aria-expanded="${i === 0}" aria-controls="cap-panel-${i}" id="cap-trigger-${i}">
            <span class="cap__num">${String(i + 1).padStart(2, '0')}</span>
            <span class="cap__title">${c.title}</span>
            <span class="cap__icon" aria-hidden="true"><i data-lucide="plus"></i></span>
          </button>
        </h3>
        <div class="cap__panel" id="cap-panel-${i}" role="region" aria-labelledby="cap-trigger-${i}" ${i === 0 ? 'data-open' : ''}>
          <div>
            <div class="cap__content">
              <p>${c.body}</p>
              <ul class="cap__tags">${c.tags.map((t) => `<li class="chip">${t}</li>`).join('')}</ul>
            </div>
          </div>
        </div>
      </li>`,
    )
    .join('');
  refreshIcons(root);

  root.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('.cap__trigger');
    if (!btn) return;
    const open = btn.getAttribute('aria-expanded') === 'true';
    const panel = document.getElementById(btn.getAttribute('aria-controls') ?? '');
    btn.setAttribute('aria-expanded', String(!open));
    if (panel) {
      if (open) panel.removeAttribute('data-open');
      else panel.setAttribute('data-open', '');
    }
  });
}

/* ---------- GitHub panel ---------- */
export function renderGithub(): void {
  const pinned = document.querySelector<HTMLElement>('[data-gh-pinned]');
  if (pinned) {
    pinned.innerHTML = pinnedRepos
      .map(
        (r) => `
        <li>
          <a href="https://github.com/${GITHUB_USER}/${r.name}" target="_blank" rel="noopener noreferrer">
            <div><strong>${r.name}</strong><small>${r.description}</small></div>
            <span>${r.language}</span>
          </a>
        </li>`,
      )
      .join('');
  }

  // Live repo count — verified public data at runtime; static snapshot is the fallback.
  const repos = document.querySelector<HTMLElement>('[data-gh-repos]');
  const status = document.querySelector<HTMLElement>('[data-gh-status]');
  if (!repos || !status) return;

  const io = new IntersectionObserver(
    (entries, obs) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      obs.disconnect();
      fetch(`https://api.github.com/users/${GITHUB_USER}`, { headers: { Accept: 'application/vnd.github+json' } })
        .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
        .then((u: { public_repos?: number }) => {
          if (typeof u.public_repos === 'number') {
            repos.textContent = String(u.public_repos);
            status.textContent = 'live · api.github.com';
          }
        })
        .catch(() => {
          status.textContent = 'static snapshot';
        });
    },
    { rootMargin: '200px' },
  );
  io.observe(repos);
}

/* ---------- Résumé availability ---------- */
export function checkResume(): void {
  const links = document.querySelectorAll<HTMLAnchorElement>('[data-resume-link]');
  if (!links.length) return;

  fetch(RESUME_PATH, { method: 'HEAD' })
    .then((r) => {
      const ok = r.ok && (r.headers.get('content-type') ?? '').includes('pdf');
      if (ok) return;
      throw new Error('missing');
    })
    .catch(() => {
      links.forEach((a) => {
        a.setAttribute('aria-disabled', 'true');
        a.removeAttribute('href');
        a.removeAttribute('download');
        a.setAttribute('title', 'Résumé PDF not yet published');
        const text = a.querySelector('span:not(.mono)') ?? a.querySelector('span');
        if (text) text.innerHTML = `${text.textContent}<small class="resume-note">— soon</small>`;
      });
    });
}

/* ---------- Small utilities ---------- */
export function initClock(): void {
  const el = document.querySelector<HTMLElement>('[data-local-time]');
  if (!el) return;
  const fmt = new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' });
  const tick = () => {
    el.textContent = `${fmt.format(new Date())} IST`;
  };
  tick();
  setInterval(tick, 30_000);

  const year = document.querySelector<HTMLElement>('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());
}
