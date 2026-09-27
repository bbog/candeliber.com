import { readFileSync } from 'node:fs';
import { Data } from '../js/data.js';
import { computeYearStats, getDayIndex, getDisplayHollidays, getYear, getYearHollidays, toIsoDate } from '../js/holiday-stats.js';

const SITE_URL = 'https://candeliber.com';
const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url)));

function buildStatsSentence(yearHollidays, year) {
    const { total, weekdayCount, longWeekends } = computeYearStats(yearHollidays, year);
    return `În total, în ${year} sunt <strong>${total}</strong> zile libere, dintre care ` +
        `<strong>${weekdayCount}</strong> pică în cursul săptămânii. Numărul weekend-urilor ` +
        `prelungite (weekend-uri în care ziua de vineri de dinainte sau ziua de luni de după ` +
        `sunt libere) este de <strong>${longWeekends}</strong>.`;
}

// Home shows the current year plus next year's Jan 1-2 (see getDisplayHollidays), so
// those trailing rows get the year appended to their name to stay visually distinct,
// same as the site has always done by hand ("Anul Nou 2027").
//
// Each row's leading dot is accent-colored for a "bonus" weekday holiday and muted
// gray when the holiday already falls on a weekend, per the redesign's row markers.
function buildTableRows(hollidays, { baseYear, suffixOtherYears }) {
    return hollidays.map((holliday) => {
        const year = getYear(holliday.date);
        const name = suffixOtherYears && year !== baseYear ? `${holliday.name} ${year}` : holliday.name;
        const [day, month] = holliday.date.split('/').map(Number);
        const dayIndex = getDayIndex(holliday.date);
        const dayName = Data.localization.days[dayIndex];
        const isWeekendDay = dayIndex === 0 || dayIndex === 6;
        const dotClass = isWeekendDay ? 'dot--muted' : 'dot--accent';
        return `<tr>` +
            `<td><span class="dot ${dotClass}"></span></td>` +
            `<td class="days-list__date-cell">${day} ${Data.localization.months[month - 1]} <span class="days-list__weekday">(${dayName})</span></td>` +
            `<td>${name}</td>` +
            `</tr>`;
    }).join('\n        ');
}

function buildJsonLd(yearHollidays, year, pageUrl) {
    return JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'WebSite',
                name: 'Când e liber?',
                url: `${SITE_URL}/`,
                inLanguage: 'ro'
            },
            {
                '@type': 'ItemList',
                name: `Zilele libere din ${year} în România`,
                url: pageUrl,
                // Plain ListItems, not Event: Google's Event rich results need a specific
                // Place with an address, which doesn't fit a country-wide public holiday,
                // so an Event wrapper here would be valid but pointless markup.
                itemListElement: yearHollidays.map((holliday, index) => ({
                    '@type': 'ListItem',
                    position: index + 1,
                    name: holliday.name,
                    description: toIsoDate(holliday.date)
                }))
            }
        ]
    });
}

function yearFromPath(path) {
    const match = path.match(/zile-libere-(\d{4})/);
    return match ? Number(match[1]) : null;
}

// data.js always carries exactly three full years (previous, current, next), so
// those are the only year pages that ever exist to link between. Each page links
// to the other two, never to itself.
function buildYearLinks(currentYear, ownYear) {
    const links = [currentYear - 1, currentYear, currentYear + 1]
        .filter((year) => year !== ownYear)
        .map((year) => `<a href="/zile-libere-${year}/">${year}</a>`);
    return `Vezi și ${links.join(' sau ')}.`;
}

// Generates the title/description/stats sentence/table/JSON-LD for a given HTML
// entry from js/data.js at build time, so index.html and the per-year pages can
// never drift out of sync with the holiday list the way the hand-typed stats did.
//
// Canonical strategy (owner's call): the *current* year's page canonicalizes to
// home, since its content is the same as home's - but the previous and next year's
// pages are genuinely distinct content, so they canonicalize to themselves and stay
// in the sitemap (see vite-plugins/sitemap.js, which excludes the current-year page
// for the same reason). This is derived from Data.currentYear, not hardcoded, so it
// flips automatically the moment the annual update bumps currentYear.
export function seoContent() {
    return {
        name: 'candeliber-seo-content',
        transformIndexHtml: {
            order: 'pre',
            handler(html, ctx) {
                const pageYear = yearFromPath(ctx.path);
                const isYearPage = pageYear !== null;
                const year = isYearPage ? pageYear : Data.currentYear;
                const isCurrentYearPage = isYearPage && year === Data.currentYear;

                const ogUrl = isYearPage ? `${SITE_URL}/zile-libere-${year}/` : `${SITE_URL}/`;
                const canonicalUrl = isCurrentYearPage ? `${SITE_URL}/` : ogUrl;

                const title = `Zile libere ${year} – Când e următoarea zi liberă? | Când e liber?`;
                const ogTitle = `Zile libere ${year} – Când avem liber?`;
                const description = `Câte zile libere sunt în ${year} în România? Vezi câte mai sunt ` +
                    `până la următoarea sărbătoare legală, câte cad în weekend și lista completă a ` +
                    `zilelor libere din ${year}.`;
                const h1 = `Zile libere ${year} în România`;
                const heading = `Lista completă a zilelor libere din ${year}`;

                const yearHollidays = getYearHollidays(Data, year);
                const displayHollidays = isYearPage ? yearHollidays : getDisplayHollidays(Data);
                const tableRows = buildTableRows(displayHollidays, { baseYear: year, suffixOtherYears: !isYearPage });
                const yearLinks = buildYearLinks(Data.currentYear, year);

                return html
                    .replaceAll('__TITLE__', title)
                    .replaceAll('__OG_TITLE__', ogTitle)
                    .replaceAll('__DESCRIPTION__', description)
                    .replaceAll('__CANONICAL_URL__', canonicalUrl)
                    .replaceAll('__OG_URL__', canonicalUrl)
                    .replaceAll('__H1__', h1)
                    .replaceAll('__HEADING__', heading)
                    .replaceAll('__STATS__', buildStatsSentence(yearHollidays, year))
                    .replaceAll('__TABLE_ROWS__', tableRows)
                    .replaceAll('__YEAR_LINKS__', yearLinks)
                    .replaceAll('__JSON_LD__', buildJsonLd(yearHollidays, year, canonicalUrl))
                    .replaceAll('__VERSION__', pkg.version);
            }
        }
    };
}
