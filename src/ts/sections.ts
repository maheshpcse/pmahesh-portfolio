import { capabilities, experienceNote, GITHUB_USER, journey, pinnedRepos, RESUME_PATH } from './content';
import { refreshIcons } from './icons';

/* ---------- Experience journey ---------- */
export function renderJourney(): void {
  const root = document.querySelector<HTMLElement>('[data-journey]');
  const note = document.querySelector<HTMLElement>('[data-experience-note]');
  if (!root) return;

  root.innerHTML = journey
    .map(
      (j) => `
      <article class="journey__item" data-reveal>
        <div class="journey__meta">
          <span class="journey__index">${j.index}</span>
          <span class="journey__period">${j.evidence}</span>
        </div>
        <div class="journey__main">
          <h3 class="journey__role">${j.role}</h3>
          ${j.organisation ? `<p class="journey__org">${j.organisation}</p>` : ''}
          <p class="copy">${j.summary}</p>
          <ul class="journey__list">${j.points.map((p) => `<li>${p}</li>`).join('')}</ul>
        </div>
        <ul class="journey__tags" aria-label="Technologies">${j.stack.map((s) => `<li class="chip">${s}</li>`).join('')}</ul>
      </article>`,
    )
    .join('');

  if (note && journey.some((j) => !j.organisation)) note.textContent = experienceNote;
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
