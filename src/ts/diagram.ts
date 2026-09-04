import type { Diagram, DiagramNode } from './content';

const W = 400;
const H = 300;
const NODE_W = 92;
const NODE_H = 30;

const kindClass: Record<NonNullable<DiagramNode['kind']>, string> = {
  client: 'client',
  service: 'service',
  data: 'data',
  infra: 'infra',
};

function esc(s: string): string {
  return s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] ?? c);
}

/**
 * Renders a small architecture sketch as inline SVG. Used for hover previews
 * and case-study figures in place of screenshots, which do not exist for
 * these backend/frontend repositories.
 */
export function renderDiagram(d: Diagram, title: string): string {
  const pos = new Map(d.nodes.map((n) => [n.id, { x: (n.x / 100) * W, y: (n.y / 100) * H }]));

  const edges = d.edges
    .map(([a, b]) => {
      const p = pos.get(a);
      const q = pos.get(b);
      if (!p || !q) return '';
      const mx = (p.x + q.x) / 2;
      return `<path class="dg-edge" d="M${p.x} ${p.y} C ${mx} ${p.y}, ${mx} ${q.y}, ${q.x} ${q.y}" />`;
    })
    .join('');

  const nodes = d.nodes
    .map((n) => {
      const p = pos.get(n.id)!;
      const cls = kindClass[n.kind ?? 'service'];
      return `<g class="dg-node dg-node--${cls}" transform="translate(${p.x - NODE_W / 2} ${p.y - NODE_H / 2})">
        <rect width="${NODE_W}" height="${NODE_H}" rx="4" />
        <text x="${NODE_W / 2}" y="${NODE_H / 2 + 3.5}" text-anchor="middle">${esc(n.label)}</text>
      </g>`;
    })
    .join('');

  return `<svg class="dg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Architecture sketch: ${esc(title)}" preserveAspectRatio="xMidYMid meet">
    <defs>
      <pattern id="dg-grid" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M20 0H0V20" fill="none" class="dg-grid" />
      </pattern>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#dg-grid)" />
    <g class="dg-edges">${edges}</g>
    <g class="dg-nodes">${nodes}</g>
    <text class="dg-title" x="12" y="${H - 12}">${esc(title.toUpperCase())}</text>
  </svg>`;
}
