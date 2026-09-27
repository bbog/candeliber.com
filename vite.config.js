import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { seoContent } from './vite-plugins/seo-content.js';
import { sitemap } from './vite-plugins/sitemap.js';

const root = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        zileLibere2025: resolve(root, 'zile-libere-2025/index.html'),
        zileLibere2026: resolve(root, 'zile-libere-2026/index.html'),
        zileLibere2027: resolve(root, 'zile-libere-2027/index.html')
      }
    }
  },
  plugins: [
    seoContent(),
    sitemap(['/', '/zile-libere-2025/', '/zile-libere-2026/', '/zile-libere-2027/']),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: '.',
      filename: 'sw.js',
      injectRegister: false,
      manifest: false
    })
  ]
});
