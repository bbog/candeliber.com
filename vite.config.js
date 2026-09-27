import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { Data } from './js/data.js';
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
        zileLibere2027: resolve(root, 'zile-libere-2027/index.html'),
        notFound: resolve(root, '404.html')
      }
    }
  },
  plugins: [
    seoContent(),
    // The current year's page canonicalizes to home (see vite-plugins/seo-content.js),
    // so it's excluded here - the sitemap should list only self-canonical URLs.
    sitemap(['/', `/zile-libere-${Data.currentYear - 1}/`, `/zile-libere-${Data.currentYear + 1}/`]),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: '.',
      filename: 'sw.js',
      injectRegister: false,
      manifest: false
    })
  ]
});
