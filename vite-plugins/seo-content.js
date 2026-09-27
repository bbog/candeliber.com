import { readFileSync } from 'node:fs';
import { Data } from '../js/data.js';
import { computeYearStats, formatHollidayDate, getDisplayHollidays, getYear, getYearHollidays, toIsoDate } from '../js/holiday-stats.js';

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
function buildTableRows(hollidays, { baseYear, suffixOtherYears }) {
    return hollidays.map((holliday) => {
        const year = getYear(holliday.date);
        const name = suffixOtherYears && year !== baseYear ? `${holliday.name} ${year}` : holliday.name;
        const dateLabel = formatHollidayDate(holliday.date, Data.localization.months, Data.localization.days);
        return `<tr><td>${dateLabel}</td><td>${name}</td></tr>`;
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
                itemListElement: yearHollidays.map((holliday, index) => ({
                    '@type': 'ListItem',
                    position: index + 1,
                    item: {
                        '@type': 'Event',
                        name: holliday.name,
                        startDate: toIsoDate(holliday.date),
                        endDate: toIsoDate(holliday.date),
                        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
                        eventStatus: 'https://schema.org/EventScheduled',
                        location: {
                            '@type': 'Country',
                            name: 'România'
                        }
                    }
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
// Canonical strategy (owner's call): every page's <link rel=canonical> points at
// the home page, since home carries the full current-year content and the
// per-year pages are near-duplicates meant to funnel ranking signal to it rather
// than compete with it. og:url still reflects each page's own real address.
export function seoContent() {
    return {
        name: 'candeliber-seo-content',
        transformIndexHtml: {
            order: 'pre',
            handler(html, ctx) {
                const pageYear = yearFromPath(ctx.path);
                const isYearPage = pageYear !== null;
                const year = isYearPage ? pageYear : Data.currentYear;

                const canonicalUrl = `${SITE_URL}/`;
                const ogUrl = isYearPage ? `${SITE_URL}/zile-libere-${year}/` : `${SITE_URL}/`;

                const title = `Zile libere ${year} – Când e următoarea zi liberă? | Când e liber?`;
                const ogTitle = `Zile libere ${year} – Când avem liber?`;
                const description = `Câte zile libere sunt în ${year} în România? Vezi câte mai sunt ` +
                    `până la următoarea sărbătoare legală, câte cad în weekend și lista completă a ` +
                    `zilelor libere din ${year}.`;
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
                    .replaceAll('__OG_URL__', ogUrl)
                    .replaceAll('__HEADING__', heading)
                    .replaceAll('__STATS__', buildStatsSentence(yearHollidays, year))
                    .replaceAll('__TABLE_ROWS__', tableRows)
                    .replaceAll('__YEAR_LINKS__', yearLinks)
                    .replaceAll('__JSON_LD__', buildJsonLd(yearHollidays, year, ogUrl))
                    .replaceAll('__VERSION__', pkg.version);
            }
        }
    };
}
