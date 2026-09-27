# candeliber.com

Sursa site-ului [Când e liber?](https://candeliber.com) — a live countdown to Romania's next
public holiday, a weekend/workday status message, and the full list of that year's holidays, plus
dedicated per-year pages (`/zile-libere-2025/`, `/zile-libere-2026/`, `/zile-libere-2027/`) for SEO.

No backend — it's a static, multi-page site built with [Vite](https://vitejs.dev).

## Getting started

```bash
npm install       # installs Vite + vite-plugin-pwa (devDependencies only)
npx vite           # dev server
npx vite build     # builds all four HTML entries into dist/
npx vite preview   # serves the dist/ build locally
npm test           # runs scripts/verify-holiday-stats.mjs
```

`dist/` is a build artifact (gitignored) — it's never hand-edited or committed; source changes go
into the `*.html` / `js/` / `css/` files and get rebuilt.

## How it works

- `js/data.js` holds all content: the current year, three years of holiday data
  (`hollidays_past` / `hollidays` / `hollidays_future`), background photos, and localized strings.
- `js/holiday-stats.js` has the pure date/stat helpers, shared between the Vite build (Node) and
  the browser.
- `vite-plugins/seo-content.js` and `vite-plugins/sitemap.js` generate SEO content (title, meta,
  JSON-LD, stats, table rows) and the sitemap from `js/data.js` at build time.
- `js/main.js` drives the live countdown and page behavior in the browser.

