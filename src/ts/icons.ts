import { createIcons, ArrowDownRight, ArrowUpRight, Download, FileText, Globe, Minus, Plus, X } from 'lucide';

// Only the icons actually used are bundled (tree-shaken).
const icons = { ArrowDownRight, ArrowUpRight, Download, FileText, Globe, Minus, Plus, X };

/** Replace `<i data-lucide>` placeholders within `root` with inline SVGs. */
export function refreshIcons(root: HTMLElement | Document = document): void {
  createIcons({
    icons,
    attrs: { 'stroke-width': '1.75', width: '16', height: '16' },
    nameAttr: 'data-lucide',
    root,
  });
}
