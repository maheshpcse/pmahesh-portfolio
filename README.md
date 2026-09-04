# Mahesh Pachapalam — Portfolio

Personal portfolio of **Mahesh Pachapalam**, Senior Full Stack JavaScript / TypeScript Engineer (Hyderabad, IN).

Built deliberately without a frontend framework: semantic HTML, a token-driven CSS design system, and modular TypeScript. Dual dark / light theme, GSAP motion, accessible Bootstrap behaviours, and a small, purposeful dependency list.

## Stack

| Concern | Choice | Why |
| --- | --- | --- |
| Markup / styles | HTML5, modern CSS (custom properties, `clamp()`, `color-mix`, cascade layers) | Design system lives in `src/css/variables.css` |
| Logic | TypeScript (strict) bundled by Vite | Modular, typed, tree-shaken |
| Layout utilities | Tailwind CSS v4 (utilities only, no preflight) | Rapid responsive composition without fighting the base layer |
| Interactive components | Bootstrap 5 JS only — `Offcanvas` | Focus trap, ESC, backdrop and ARIA for the mobile menu and case-study drawer; styled by the design system, no Bootstrap CSS |
| DOM helpers | jQuery 4 | Delegated events and DOM swaps in the stack explorer only |
| Motion | GSAP 3 (ScrollTrigger, SplitText), Lenis | Intro sequence, masked reveals, scroll triggers, smooth scrolling |
| Icons | Lucide | Tree-shaken to the handful of icons used |

Boundaries are explicit: Tailwind = layout utilities, Bootstrap = behaviour of two overlays, jQuery = one module, custom CSS = everything visual.

## Structure

```
.
├── index.html                 # single page, semantic sections
├── public/
│   ├── assets/icons/          # favicon + touch icon (SVG)
│   ├── assets/images/         # Open Graph card
│   ├── assets/resume/         # place the résumé PDF here (see README inside)
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── css/
│   │   ├── main.css           # layer order + imports
│   │   ├── variables.css      # design tokens (dark + light)
│   │   ├── typography.css
│   │   ├── layout.css
│   │   ├── components.css
│   │   ├── animations.css
│   │   └── responsive.css
│   └── ts/
│       ├── main.ts            # boot sequence
│       ├── content.ts         # single source of truth for all copy/data
│       ├── animations.ts      # preloader, hero, scroll reveals, magnetic
│       ├── navigation.ts      # header, active section, anchors, offcanvas
│       ├── projects.ts        # project rows, hover preview, case-study drawer
│       ├── stack.ts           # tech explorer (tabs) + ribbon
│       ├── sections.ts        # experience, capabilities, GitHub, résumé, clock
│       ├── diagram.ts         # inline SVG architecture sketches
│       ├── cursor.ts          # custom cursor (fine pointers only)
│       ├── theme.ts           # dark / light toggle + persistence
│       └── icons.ts
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build to dist/
npm run preview    # serve dist/
```

## Content and accuracy

All professional facts come from the public GitHub profile (`github.com/maheshpcse`) and its profile README. Nothing is invented:

- **Experience** is presented as domain chapters. Employer names and dates are *not* shown because the résumé PDF was unavailable at build time; fill `organisation` in `src/ts/content.ts` once verified.
- **Projects** are the four most complete public repositories. No live URLs are claimed — none are verified.
- **GitHub stats** show a static snapshot and upgrade to the live public-repo count at runtime when `api.github.com` is reachable.
- **Résumé** links target `public/assets/resume/Mahesh-FullStack-JavaScript-Developer-6.9yrs.pdf` and disable themselves with a "coming soon" label while the file is absent.

Update the canonical URL in `index.html`, `public/robots.txt` and `public/sitemap.xml` if the site is deployed somewhere other than `https://maheshpcse.github.io/pmahesh-portfolio/`.

## Accessibility and performance

- Semantic landmarks, logical heading order, skip link, visible focus rings, 44px+ touch targets.
- WAI-ARIA tabs pattern for the stack explorer; disclosure pattern for capabilities; Bootstrap Offcanvas for dialog semantics.
- `prefers-reduced-motion` disables the intro sequence, smooth scroll, parallax, marquee and custom cursor; all content is visible without JavaScript.
- Custom cursor and hover previews only on `(hover: hover) and (pointer: fine)`.
- Transform/opacity-only animation, passive listeners, `IntersectionObserver` for reveals and lazy GitHub fetch, minimal font weights with `display=swap`, deferred module scripts, vendor chunks split (`motion`, `ui`).

## Deploy

The build is relative-path (`base: './'`), so `dist/` can be served from GitHub Pages, Netlify, Vercel, S3 or any static host without changes.

## License

MIT — code only. Personal content, résumé and identity remain the property of Mahesh Pachapalam.
