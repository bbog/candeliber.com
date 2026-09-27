// Pure date/stat helpers with no DOM or moment dependency, so they can run both
// at build time (Node, via vite.config.js) and in the verification script.

function parseDMY(dateStr) {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(Date.UTC(year, month - 1, day));
}

export function getYear(dateStr) {
    return Number(dateStr.split('/')[2]);
}

export function toIsoDate(dateStr) {
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
}

export function getDayIndex(dateStr) {
    return parseDMY(dateStr).getUTCDay();
}

// Data.hollidays_past/hollidays/hollidays_future each hold exactly one full year
// (previous/current/next - see js/data.js), so picking the right one for a given
// year is a straight lookup rather than a chronological-order/position assumption.
export function getYearHollidays(data, year) {
    if (year === data.currentYear - 1) {
        return data.hollidays_past;
    }
    if (year === data.currentYear + 1) {
        return data.hollidays_future;
    }
    return data.hollidays;
}

// The home page shows the current year's full list plus next year's Jan 1-2, so the
// countdown/table stay useful across the New Year's transition without pulling in
// a whole extra year's worth of rows.
export function getDisplayHollidays(data) {
    const nextJanFirstTwo = data.hollidays_future.filter((holliday) => {
        const [day, month] = holliday.date.split('/').map(Number);
        return month === 1 && day <= 2;
    });
    return [...data.hollidays, ...nextJanFirstTwo];
}

export function formatHollidayDate(dateStr, months, days) {
    const [day, month] = dateStr.split('/').map(Number);
    const dayName = days[getDayIndex(dateStr)];
    return `${day} ${months[month - 1]} (${dayName})`;
}

export function computeYearStats(yearHollidays, year) {
    const weekdayCount = yearHollidays.filter((holliday) => {
        const day = parseDMY(holliday.date).getUTCDay();
        return day !== 0 && day !== 6;
    }).length;

    const holidayDates = new Set(yearHollidays.map((holliday) => holliday.date));
    const isHolliday = (date) => {
        const dd = String(date.getUTCDate()).padStart(2, '0');
        const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
        return holidayDates.has(`${dd}/${mm}/${date.getUTCFullYear()}`);
    };

    // A "long weekend" is a Sat/Sun pair where the Friday right before it, or the
    // Monday right after it, is also a holiday. Only that immediate neighbour
    // counts, so e.g. 30 Nov (Mon) and 1 Dec (Tue) being holidays back to back
    // does not merge into one 4-day run - each weekend is judged on its own.
    let longWeekends = 0;
    const dayMs = 24 * 60 * 60 * 1000;
    for (let t = Date.UTC(year, 0, 1); t <= Date.UTC(year, 11, 31); t += dayMs) {
        const date = new Date(t);
        if (date.getUTCDay() === 6) {
            const friday = new Date(t - dayMs);
            const monday = new Date(t + 2 * dayMs);
            if (isHolliday(friday) || isHolliday(monday)) {
                longWeekends++;
            }
        }
    }

    return {
        year,
        total: yearHollidays.length,
        weekdayCount,
        longWeekends
    };
}
