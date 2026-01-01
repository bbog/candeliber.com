var Data = {

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
            name: 'Paştele',
            date: '12/04/2026'
        },
        {
            name: 'Paştele',
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
            name: 'Ziua Naţională a României',
            date: '01/12/2026'
        },
        {
            name: 'Crăciunul',
            date: '25/12/2026'
        },
        {
            name: 'Crăciunul',
            date: '26/12/2026'
        },
        {
            name: 'Anul Nou',
            date: '01/01/2027'
        },
        {
            name: 'Anul Nou',
            date: '02/01/2027'
        },
    ],

    photos: {

        working: [
            {
                path: 'people-coffee-notes-tea.jpg',
                source: 'https://www.pexels.com/photo/people-notes-meeting-team-7095/'
            },
            {
                path: 'people-coffee-tea-meeting.jpg',
                source: 'https://www.pexels.com/photo/people-meeting-workspace-team-7097/'
            },
            {
                path: 'person-apple-laptop-notebook.jpg',
                source: 'https://www.pexels.com/photo/person-apple-laptop-notebook-1171/'
            },
            {
                path: 'startup-photos.jpg',
                source: 'https://www.pexels.com/photo/working-woman-person-technology-7375/'
            },
            {
                path: 'office-notes-notepad-entrepreneur-38556.jpeg',
                source: 'https://www.pexels.com/photo/iphone-desk-office-pen-38556/'
            },
            {
                path: 'bow-tie-businessman-fashion-man.jpg',
                source: 'https://www.pexels.com/photo/bow-tie-businessman-fashion-man-1702/'
            },
            {
                path: 'pexels-photo-52608.jpeg',
                source: 'https://www.pexels.com/photo/man-in-white-shirt-using-macbook-pro-52608/'
            },
            {
                path: 'medic-hospital-laboratory-medical-40559.jpeg',
                source: 'https://www.pexels.com/photo/clinic-doctor-health-hospital-40559/'
            },
            {
                path: 'startup-photos_2.jpg',
                source: 'https://www.pexels.com/photo/laptop-computer-macbook-apple-7361/'
            },
            {
                path: 'desk-office-workspace-coworking.jpg',
                source: 'https://www.pexels.com/photo/desk-office-workspace-coworking-7110/'
            },
            {
                path: 'pexels-photo-89724.jpeg',
                source: 'https://www.pexels.com/photo/people-apple-desk-technology-89724/'
            }
        ],

        holliday: [
            {
                path: 'pexels-photo.jpeg',
                source: 'https://www.pexels.com/photo/man-person-view-nature-9692/'
            },
            {
                path: 'pexels-photo-65977.jpeg',
                source: 'https://www.pexels.com/photo/nature-beach-water-blue-65977/'
            },
            {
                path: 'pexels-photo-61129.jpeg',
                source: 'https://www.pexels.com/photo/sunglasses-girl-swimming-pool-swimming-61129/'
            },
            {
                path: 'landscape-mountains-nature-man.jpg',
                source: 'https://www.pexels.com/photo/landscape-mountains-nature-man-1005/'
            },
            {
                path: 'pexels-photo-46082.jpeg',
                source: 'https://www.pexels.com/photo/man-in-black-shirt-and-gray-shorts-standing-on-cliff-under-white-and-blue-cloudy-sky-46082/'
            },
            {
                path: 'pexels-photo.jpg',
                source: 'https://www.pexels.com/photo/bridge-runners-morning-cloudy-29578/'
            },
            {
                path: 'nature-person-red-woman.jpg',
                source: 'https://www.pexels.com/photo/nature-person-red-woman-6552/'
            },
            {
                path: 'person-beach-holiday-vacation.jpg',
                source: 'https://www.pexels.com/photo/person-beach-holiday-vacation-5314/'
            },
            {
                path: 'pexels-photo-60219.jpeg',
                source: 'https://www.pexels.com/photo/nature-beach-vacation-ocean-60219/'
            },
            {
                path: 'pexels-photo-102734.jpeg',
                source: 'https://www.pexels.com/photo/woman-in-white-crop-top-besides-man-in-white-and-black-stripes-shirt-beside-body-otf-water-102734/'
            },
            {
                path: 'pexels-photo-26525.jpg',
                source: 'https://www.pexels.com/photo/mountains-hill-man-person-26525/'
            }
        ]
    },

    localization: {
        days: ['duminică', 'luni', 'marți', 'miercuri', 'joi', 'vineri', 'sâmbătă']
    },

    messages: {
        working_day: 'Nu azi, astăzi se lucrează :( ',
        days_until_weekend: 'Mai sunt ##days zile până la weekend',
        day_until_weekend: 'Mai este o zi până la weekend',
        weekend_tomorrow: 'Dar nu dispera, mâine e weekend : D',
        weekend_day: 'Nu e sărbătoare dar azi nu se lucrează, e weekend! Woohoo'
    }
};

if (typeof exports !== 'undefined') {
    exports.Data = Data;
}