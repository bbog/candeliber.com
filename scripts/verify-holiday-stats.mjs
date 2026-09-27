import { Data } from '../js/data.js';
import { computeYearStats, getYearHollidays } from '../js/holiday-stats.js';

// Known-correct values, worked out by hand (2026) or cross-checked against
// officeholidays.com + a Meeus Julian Orthodox Easter computation (2027) against
// Codul muncii art. 139. Add a year here once its numbers have been checked.
const expected = {
    2025: { total: 17, weekdayCount: 13, longWeekends: 7 },
    2026: { total: 16, weekdayCount: 11, longWeekends: 6 },
    2027: { total: 17, weekdayCount: 9, longWeekends: 3 }
};

let failed = false;

// Romanian uses comma-below ș/ț/Ș/Ț (U+0219/U+021B/U+0218/U+021A), not the
// cedilla ş/ţ/Ş/Ţ (U+015F/U+0163/U+015E/U+0162) that some fonts/keyboards produce
// instead - catch any that sneak back into the holiday names.
const cedillaPattern = /[şţŞŢ]/;
for (const holliday of [...Data.hollidays_past, ...Data.hollidays, ...Data.hollidays_future]) {
    if (cedillaPattern.test(holliday.name)) {
        failed = true;
        console.error(`FAIL: "${holliday.name}" (${holliday.date}) uses a cedilla ş/ţ/Ş/Ţ letter - use comma-below ș/ț/Ș/Ț instead`);
    }
}

for (const [yearStr, expectedStats] of Object.entries(expected)) {
    const year = Number(yearStr);
    const stats = computeYearStats(getYearHollidays(Data, year), year);
    console.log(`${year}: total=${stats.total} weekdayCount=${stats.weekdayCount} longWeekends=${stats.longWeekends}`);

    for (const [key, value] of Object.entries(expectedStats)) {
        if (stats[key] !== value) {
            failed = true;
            console.error(`FAIL: ${year} ${key} expected ${value}, got ${stats[key]}`);
        }
    }
}

if (Data.currentYear !== 2026 && !expected[Data.currentYear]) {
    console.warn(`No hand-verified expectation for Data.currentYear (${Data.currentYear}) yet.`);
}

process.exit(failed ? 1 : 0);
