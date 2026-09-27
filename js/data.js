export const Data = {

    // The year hollidays/hollidays_past/hollidays_future below are built for. Update
    // this as part of the annual "Update <year>" commit: hollidays_past becomes what
    // hollidays used to be, hollidays becomes what hollidays_future used to be, and
    // hollidays_future gets replaced with the new next year's full list.
    currentYear: 2026,

    hollidays_past: [
        {
            name: 'Anul Nou',
            date: '01/01/2025'
        },
        {
            name: 'Anul Nou',
            date: '02/01/2025'
        },
        {
            name: 'Bobotează',
            date: '06/01/2025'
        },
        {
            name: 'Sfântul Ioan Botezătorul',
            date: '07/01/2025'
        },
        {
            name: 'Ziua Unirii Principatelor Române',
            date: '24/01/2025'
        },
        {
            name: 'Vinerea Mare',
            date: '18/04/2025'
        },
        {
            name: 'Paștele',
            date: '20/04/2025'
        },
        {
            name: 'Paștele',
            date: '21/04/2025'
        },
        {
            name: 'Ziua Muncii',
            date: '01/05/2025'
        },
        {
            name: 'Ziua Copilului',
            date: '01/06/2025'
        },
        {
            name: 'Rusalii',
            date: '08/06/2025'
        },
        {
            name: 'Rusalii',
            date: '09/06/2025'
        },
        {
            name: 'Adormirea Maicii Domnului',
            date: '15/08/2025'
        },
        {
            name: 'Sfântul Andrei',
            date: '30/11/2025'
        },
        {
            name: 'Ziua Națională a României',
            date: '01/12/2025'
        },
        {
            name: 'Crăciunul',
            date: '25/12/2025'
        },
        {
            name: 'Crăciunul',
            date: '26/12/2025'
        }
    ],

    hollidays: [
        {
            name: 'Anul Nou',
            date: '01/01/2026'
        },
        {
            name: 'Anul Nou',
            date: '02/01/2026'
        },
        {
            name: 'Bobotează',
            date: '06/01/2026'
        },
        {
            name: 'Sfântul Ioan Botezătorul',
            date: '07/01/2026'
        },
        {
            name: 'Ziua Unirii Principatelor Române',
            date: '24/01/2026'
        },
        {
            name: 'Vinerea Mare',
            date: '10/04/2026'
        },
        {
            name: 'Paștele',
            date: '12/04/2026'
        },
        {
            name: 'Paștele',
            date: '13/04/2026'
        },
        {
            name: 'Ziua Muncii',
            date: '01/05/2026'
        },
        {
            name: 'Rusalii',
            date: '31/05/2026'
        },
        {
            name: 'Rusalii / Ziua Copilului',
            date: '01/06/2026'
        },
        {
            name: 'Adormirea Maicii Domnului',
            date: '15/08/2026'
        },
        {
            name: 'Sfântul Andrei',
            date: '30/11/2026'
        },
        {
            name: 'Ziua Națională a României',
            date: '01/12/2026'
        },
        {
            name: 'Crăciunul',
            date: '25/12/2026'
        },
        {
            name: 'Crăciunul',
            date: '26/12/2026'
        }
    ],

    hollidays_future: [
        {
            name: 'Anul Nou',
            date: '01/01/2027'
        },
        {
            name: 'Anul Nou',
            date: '02/01/2027'
        },
        {
            name: 'Bobotează',
            date: '06/01/2027'
        },
        {
            name: 'Sfântul Ioan Botezătorul',
            date: '07/01/2027'
        },
        {
            name: 'Ziua Unirii Principatelor Române',
            date: '24/01/2027'
        },
        {
            name: 'Vinerea Mare',
            date: '30/04/2027'
        },
        {
            name: 'Ziua Muncii',
            date: '01/05/2027'
        },
        {
            name: 'Paștele',
            date: '02/05/2027'
        },
        {
            name: 'Paștele',
            date: '03/05/2027'
        },
        {
            name: 'Ziua Copilului',
            date: '01/06/2027'
        },
        {
            name: 'Rusalii',
            date: '20/06/2027'
        },
        {
            name: 'Rusalii',
            date: '21/06/2027'
        },
        {
            name: 'Adormirea Maicii Domnului',
            date: '15/08/2027'
        },
        {
            name: 'Sfântul Andrei',
            date: '30/11/2027'
        },
        {
            name: 'Ziua Națională a României',
            date: '01/12/2027'
        },
        {
            name: 'Crăciunul',
            date: '25/12/2027'
        },
        {
            name: 'Crăciunul',
            date: '26/12/2027'
        }
    ],

    localization: {
        days: ['duminică', 'luni', 'marți', 'miercuri', 'joi', 'vineri', 'sâmbătă'],
        months: [
            'Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie',
            'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'
        ]
    },

    // The two labels shown in the header badge, driven by ViewUtil.setStateBadge's
    // isFun check (weekend or today is a holiday).
    messages: {
        work_state: 'azi e zi de muncă',
        fun_state: 'azi e liber'
    }
};