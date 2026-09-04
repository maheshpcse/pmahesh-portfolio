import '../css/main.css';

import { initScrollAnimations, initSmoothScroll, motionAllowed, runIntro } from './animations';
import { initCursor } from './cursor';
import { refreshIcons } from './icons';
import { initNavigation } from './navigation';
import { initProjects } from './projects';
import { checkResume, initClock, renderCapabilities, renderEducation, renderExperience, renderGithub } from './sections';
import { initStack } from './stack';
import { initTheme } from './theme';

const html = document.documentElement;
html.classList.add('js');

// Always start at the top on load/refresh (scrollRestoration is set to manual
// in the inline head script); the intro sequence assumes a top-of-page start.
window.scrollTo(0, 0);
window.addEventListener('pageshow', () => window.scrollTo(0, 0), { once: true });
if (location.hash) history.replaceState(null, '', location.pathname + location.search);
if (motionAllowed) html.classList.add('motion');

function boot(): void {
  initTheme();

  // Content first so ScrollTrigger measures the final layout.
  renderExperience();
  renderEducation();
  initProjects();
  initStack();
  renderCapabilities();
  renderGithub();
  refreshIcons();
  checkResume();
  initClock();

  const lenis = initSmoothScroll();
  initNavigation({ lenis });
  initCursor();

  runIntro(() => {
    initScrollAnimations();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
