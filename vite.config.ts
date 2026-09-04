import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Relative base so the build works on GitHub Pages sub-paths and custom domains alike.
  base: './',
  plugins: [tailwindcss()],
  build: {
    target: 'es2022',
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (/node_modules\/(gsap|lenis)\//.test(id)) return 'motion';
          if (/node_modules\/(bootstrap|jquery|lucide|@popperjs)\//.test(id)) return 'ui';
          return undefined;
        },
      },
    },
  },
  server: { port: 5173, host: true },
});
