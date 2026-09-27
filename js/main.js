//! version : 0.1.0
//! license : MIT, authors : Bogdan BUCUR, candeliber.com
import { Data } from './data.js';
import { getDisplayHollidays } from './holiday-stats.js';

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


    // Whether `date` (a plain Date, compared by calendar day) is in this or next
    // year's holiday list - the only two lists that can ever contain "today".
    isHolliday: function (date) {

        var relevant_hollidays = Data.hollidays.concat(Data.hollidays_future);

        return relevant_hollidays.some(function (holliday) {
            var holliday_date = DateUtil.parseHollidayDate(holliday.date);
            return holliday_date.getFullYear() === date.getFullYear() &&
                holliday_date.getMonth() === date.getMonth() &&
                holliday_date.getDate() === date.getDate();
        });
    },


    isFun: function (date) {
        return DateUtil.isWeekend(date) || DateUtil.isHolliday(date);
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
        hollidays_list_table: hollidays_list_table
    }
})();


var ViewUtil = {

    /**
     * Toggles the work/fun theme (via body[data-state]) and the header badge
     * label, based on whether today is a weekend or holiday.
     */
    setStateBadge: function () {

        var is_fun = DateUtil.isFun(new Date());

        View.body.dataset.state = is_fun ? 'fun' : 'work';
        View.state_badge.innerHTML = is_fun ? Data.messages.fun_state : Data.messages.work_state;
    },


    /**
     * Sets the name and the date of the nearest holliday
     * inside the string "Următoarea zi liberă este pe data de (...)"
     */
    setNearestHolliday: function () {

        var holliday = DateUtil.getNearestHolliday(),
            day_name = DateUtil.getDayNameFromDate(holliday.date);

        ViewUtil.nearest_holliday = holliday;

        View.holliday_date.innerHTML = holliday.date;
        View.holliday_name.innerHTML = holliday.name;
        View.holliday_day.innerHTML  = day_name;
    },


    initCountdown: function () {

        var holliday = ViewUtil.nearest_holliday,
            holliday_date = DateUtil.parseHollidayDate(holliday.date);


        setInterval(function updateCountdown() {

            var current_date = new Date(),
                diff = Math.max(0, holliday_date.getTime() - current_date.getTime());

            var days    = Math.floor(diff / 86400000),
                hours   = Math.floor((diff % 86400000) / 3600000),
                minutes = Math.floor((diff % 3600000) / 60000),
                seconds = Math.floor((diff % 60000) / 1000);

            View.countdown_days.innerHTML    = Util.getDoubleDigitsFromValue(days);
            View.countdown_hours.innerHTML   = Util.getDoubleDigitsFromValue(hours);
            View.countdown_minutes.innerHTML = Util.getDoubleDigitsFromValue(minutes);
            View.countdown_seconds.innerHTML = Util.getDoubleDigitsFromValue(seconds);

            // Recomputed every tick (not just once) so the work/fun theme and
            // badge flip on their own right at midnight, without a page reload.
            ViewUtil.setStateBadge();

        }, 1000);
    },


    updateHollidaysList: function () {

        var nearest_holliday = DateUtil.getNearestHolliday(),
            hollidays_list_table = View.hollidays_list_table,
            tbody = hollidays_list_table.getElementsByTagName('tbody')[0],
            holliday_rows = tbody.getElementsByTagName('tr');

        // The table only ever renders the current year plus next year's Jan 1-2 (see
        // getDisplayHollidays), so the index lookup has to match that same subset,
        // not the separate hollidays_past/hollidays/hollidays_future arrays directly.
        var displayed_hollidays = getDisplayHollidays(Data);

        var nearest_holliday_index;
        displayed_hollidays.forEach(function (holliday, index) {
            if (holliday === nearest_holliday) {
                nearest_holliday_index = index;
            }
        });


        var index = 0,
            total_hollidays = holliday_rows.length,
            nearest_holliday_reached = false;
        for ( ; index < total_hollidays; index++) {

            var holliday_row = holliday_rows[index];

            if (nearest_holliday_reached) {
                var row_class = 'days-list__holliday--future';
            } else if (index === nearest_holliday_index) {
                var row_class = 'days-list__holliday--current';
                nearest_holliday_reached = true;
            } else {
                var row_class = 'days-list__holliday--past';
            }


            holliday_row.setAttribute('class', row_class);
        }
    }
}


ViewUtil.setStateBadge();
ViewUtil.setNearestHolliday();
ViewUtil.initCountdown();
ViewUtil.updateHollidaysList();



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
