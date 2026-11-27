//! version : 0.1.0
//! license : MIT, authors : Bogdan BUCUR, candeliber.com
import { Data } from './data.js';
import { toIsoDate } from './holiday-stats.js';

var Util = {

    get: function (id) {
        return document.getElementById(id);
    },


    getDoubleDigitsFromValue: function (value) {

        value = value + '';
        if (value.length === 1) {
            value = '0' + value;
        }

        return value;
    },


    // Romanian singular vs. plural unit label ("1 oră" / "2 ore").
    pluralize: function (value, singular, plural) {
        return value === 1 ? singular : plural;
    }
};


var DateUtil = {


    parseHollidayDate: function (date_str) {

        var parts = date_str.split('/'),
            day   = Number(parts[0]),
            month = Number(parts[1]),
            year  = Number(parts[2]);

        return new Date(year, month - 1, day);
    },


    getNearestHolliday: function () {

        // hollidays_past never contains a future date, so it's skipped here - only
        // the current and next year's lists can hold the next upcoming holliday.
        var upcoming_hollidays = Data.hollidays.concat(Data.hollidays_future),
            nearest_holliday = DateUtil.getNearestUpcomingHolliday(upcoming_hollidays);

        return nearest_holliday;
    },


    getNearestUpcomingHolliday: function (hollidays) {

        var now = Date.now();

        var index = 0,
            total_hollidays = hollidays.length;
        for ( ; index < total_hollidays; index++) {

            var holliday = hollidays[index],
                holliday_date = DateUtil.parseHollidayDate(holliday.date);

            if (holliday_date.getTime() - now > 0) {
                return holliday;
            }
        }
    },


    // YYYY-MM-DD for `date` in *local* time. Never use toISOString() for this: it
    // converts to UTC, which is still "yesterday" for the first hours after midnight
    // in Romania.
    getLocalIsoDate: function (date) {

        return date.getFullYear() + '-' +
            Util.getDoubleDigitsFromValue(date.getMonth() + 1) + '-' +
            Util.getDoubleDigitsFromValue(date.getDate());
    },


    // "30 Noiembrie", same format as the holidays table's date column.
    formatHollidayDate: function (date_str) {

        var date = DateUtil.parseHollidayDate(date_str);

        return date.getDate() + ' ' + Data.localization.months[date.getMonth()];
    },


    getDayNameFromDate: function (date) {

        var day_index = DateUtil.parseHollidayDate(date).getDay(),
            day = Data.localization.days[day_index];

        return day;
    },


    isWeekend: function (date) {

        var day_index   = date.getDay(),
            is_saturday = (day_index === 6),
            is_sunday   = (day_index === 0);

        if (is_saturday || is_sunday) {
            return true;
        } else {
            return false;
        }
    },


    // The holiday falling on `date` (a plain Date, compared by calendar day), if any,
    // from this or next year's list - the only two lists that can ever contain "today".
    getHolliday: function (date) {

        var relevant_hollidays = Data.hollidays.concat(Data.hollidays_future),
            iso_date = DateUtil.getLocalIsoDate(date);

        return relevant_hollidays.find(function (holliday) {
            return toIsoDate(holliday.date) === iso_date;
        });
    },


    isFun: function (date) {
        return DateUtil.isWeekend(date) || !!DateUtil.getHolliday(date);
    }
};


var View = (function () {

    var body = document.body;

    var state_badge = Util.get('state_badge');

    var holliday_date = Util.get('holliday_date'),
        holliday_name = Util.get('holliday_name'),
        holliday_day  = Util.get('holliday_day');

    var countdown_days    = Util.get('countdown_days'),
        countdown_hours   = Util.get('countdown_hours'),
        countdown_minutes = Util.get('countdown_minutes'),
        countdown_seconds = Util.get('countdown_seconds');

    var countdown_days_label    = Util.get('countdown_days_label'),
        countdown_hours_label   = Util.get('countdown_hours_label'),
        countdown_minutes_label = Util.get('countdown_minutes_label'),
        countdown_seconds_label = Util.get('countdown_seconds_label');

    var hollidays_list_table = Util.get('days-list');

    return {
        body: body,
        state_badge: state_badge,
        holliday_date: holliday_date,
        holliday_name: holliday_name,
        holliday_day: holliday_day,
        countdown_days: countdown_days,
        countdown_hours: countdown_hours,
        countdown_minutes: countdown_minutes,
        countdown_seconds: countdown_seconds,
        countdown_days_label: countdown_days_label,
        countdown_hours_label: countdown_hours_label,
        countdown_minutes_label: countdown_minutes_label,
        countdown_seconds_label: countdown_seconds_label,
        hollidays_list_table: hollidays_list_table
    }
})();


var ViewUtil = {

    /**
     * Toggles the work/fun theme and background scene (via body[data-state]) and
     * the header badge label, based on whether today is a weekend or holiday.
     */
    setStateBadge: function () {

        var today = new Date(),
            today_holliday = DateUtil.getHolliday(today),
            is_fun = DateUtil.isWeekend(today) || !!today_holliday,
            label;

        if (today_holliday) {
            label = Data.messages.holliday_state.replace('{name}', today_holliday.name);
        } else if (is_fun) {
            label = Data.messages.weekend_state;
        } else {
            label = Data.messages.work_state;
        }

        View.body.dataset.state = is_fun ? 'fun' : 'work';
        View.state_badge.textContent = label;
    },


    /**
     * Sets the name and the date of the nearest holliday
     * inside the string "Următoarea zi liberă este pe data de (...)"
     */
    setNearestHolliday: function () {

        var holliday = DateUtil.getNearestHolliday(),
            day_name = DateUtil.getDayNameFromDate(holliday.date);

        ViewUtil.nearest_holliday = holliday;

        View.holliday_date.innerHTML = DateUtil.formatHollidayDate(holliday.date);
        View.holliday_name.innerHTML = holliday.name;
        View.holliday_day.innerHTML  = day_name;
    },


    initCountdown: function () {

        var current_day = DateUtil.getLocalIsoDate(new Date());

        // Ticks every second on purpose (it makes the holiday feel closer).
        function updateCountdown() {

            var current_date = new Date(),
                today = DateUtil.getLocalIsoDate(current_date);

            // At midnight the day's state can change (work <-> fun), and if the
            // countdown just hit a holiday the next one becomes the target, so
            // everything date-dependent is refreshed then, without a page reload.
            if (today !== current_day) {
                current_day = today;
                ViewUtil.setStateBadge();
                ViewUtil.setNearestHolliday();
                ViewUtil.updateHollidaysList();
            }

            var holliday_date = DateUtil.parseHollidayDate(ViewUtil.nearest_holliday.date),
                diff = Math.max(0, holliday_date.getTime() - current_date.getTime());

            var days    = Math.floor(diff / 86400000),
                hours   = Math.floor((diff % 86400000) / 3600000),
                minutes = Math.floor((diff % 3600000) / 60000),
                seconds = Math.floor((diff % 60000) / 1000);

            View.countdown_days.textContent    = days;
            View.countdown_hours.textContent   = Util.getDoubleDigitsFromValue(hours);
            View.countdown_minutes.textContent = Util.getDoubleDigitsFromValue(minutes);
            View.countdown_seconds.textContent = Util.getDoubleDigitsFromValue(seconds);

            View.countdown_days_label.textContent    = Util.pluralize(days, 'zi', 'zile');
            View.countdown_hours_label.textContent   = Util.pluralize(hours, 'oră', 'ore');
            View.countdown_minutes_label.textContent = Util.pluralize(minutes, 'minut', 'minute');
            View.countdown_seconds_label.textContent = Util.pluralize(seconds, 'secundă', 'secunde');
        }

        updateCountdown();
        setInterval(updateCountdown, 1000);
    },


    /**
     * Marks each holiday row in the table as past, future, or highlighted (the
     * next holiday, tagged "Urmează", and today's holiday, if any, tagged "Azi").
     * Rows are matched by their build-time data-date (ISO), not by position, since
     * month separator rows sit between them. Each month separator takes the past
     * look when the first holiday under it is past.
     */
    updateHollidaysList: function () {

        var today = DateUtil.getLocalIsoDate(new Date()),
            next_date = toIsoDate(ViewUtil.nearest_holliday.date),
            holliday_rows = View.hollidays_list_table.querySelectorAll('tr.days-list__holliday');

        holliday_rows.forEach(function (holliday_row) {

            var date = holliday_row.dataset.date,
                is_past = date < today,
                is_today = date === today,
                is_next = date === next_date,
                name_cell = holliday_row.querySelector('.days-list__name-cell'),
                old_tag = name_cell.querySelector('.tag'),
                month_row = holliday_row.previousElementSibling;

            holliday_row.classList.toggle('days-list__holliday--past', is_past);
            holliday_row.classList.toggle('days-list__holliday--current', is_today || is_next);

            if (month_row && month_row.classList.contains('days-list__month')) {
                month_row.classList.toggle('days-list__month--past', is_past);
            }

            if (old_tag) {
                old_tag.remove();
            }

            if (is_today || is_next) {
                var tag = document.createElement('span');
                tag.className = 'tag';
                tag.textContent = is_today ? 'Azi' : 'Urmează';
                name_cell.appendChild(tag);
            }
        });
    }
}


ViewUtil.setStateBadge();
ViewUtil.setNearestHolliday();
ViewUtil.updateHollidaysList();
ViewUtil.initCountdown();



// Register the service worker for offline access
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').then(function(registration) {
    // Registration was successful
    console.log('ServiceWorker registration successful with scope: ', registration.scope);
  }).catch(function(err) {
    // registration failed :(
    console.log('ServiceWorker registration failed: ', err);
  });
}
