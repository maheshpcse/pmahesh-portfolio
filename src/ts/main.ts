import '../css/main.css';

import { initScrollAnimations, initSmoothScroll, motionAllowed, runIntro } from './animations';
import { initCursor } from './cursor';
import { refreshIcons } from './icons';
import { initNavigation } from './navigation';
import { initProjects } from './projects';
import { checkResume, initClock, renderCapabilities, renderGithub, renderJourney } from './sections';
import { initStack } from './stack';
import { initTheme } from './theme';

const html = document.documentElement;
html.classList.add('js');
if (motionAllowed) html.classList.add('motion');

function boot(): void {
  initTheme();

  // Content first so ScrollTrigger measures the final layout.
  renderJourney();
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
