type Theme = 'dark' | 'light';

const STORAGE_KEY = 'mp-theme';
const root = document.documentElement;

function current(): Theme {
  return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
}

function apply(theme: Theme, persist: boolean): void {
  root.setAttribute('data-theme', theme);
  if (persist) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* storage unavailable — theme still applies for this session */
    }
  }
  const toggle = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');
  const label = document.querySelector<HTMLElement>('[data-theme-label]');
  if (toggle) {
    toggle.setAttribute('aria-pressed', String(theme === 'light'));
    toggle.setAttribute('aria-label', `Switch to ${theme === 'light' ? 'dark' : 'light'} theme`);
  }
  if (label) label.textContent = theme === 'light' ? 'Light' : 'Dark';
}

export function initTheme(): void {
  apply(current(), false);

  document.querySelector('[data-theme-toggle]')?.addEventListener('click', () => {
    apply(current() === 'light' ? 'dark' : 'light', true);
  });

  // Follow OS changes only while the user has not chosen explicitly.
  const mq = matchMedia('(prefers-color-scheme: light)');
  mq.addEventListener('change', (e) => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    if (!stored) apply(e.matches ? 'light' : 'dark', false);
  });

  // Enable colour transitions only after first paint so the initial theme
  // doesn't animate in.
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('theme-ready')));
}
