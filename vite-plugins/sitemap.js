import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const SITE_URL = 'https://candeliber.com';

// Overwrites the copy of public/sitemap.xml already in dist/ once the build is
// done, so lastmod always reflects the actual build date instead of going stale.
export function sitemap(urls) {
    return {
        name: 'candeliber-sitemap',
        closeBundle() {
            const lastmod = new Date().toISOString().slice(0, 10);
            const urlEntries = urls
                .map((path) => `  <url>\n    <loc>${SITE_URL}${path}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`)
                .join('\n');

            const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
                `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>\n`;

            writeFileSync(resolve('dist/sitemap.xml'), xml);
        }
    };
}
