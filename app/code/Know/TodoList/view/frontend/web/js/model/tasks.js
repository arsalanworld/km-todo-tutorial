define([
    'ko'
], function (ko) {
    'use strict';

    return ko.observableArray([
        {
            id: 1,
            title: 'A Test task',
            status: 0,
            parentId: 2,
            created: '16 Apr 2023',
            updated: '16 Apr 2023',
        },
        {
            id: 2,
            title: 'Complete youtube tutorial',
            status: 0,
            parentId: 1,
            created: '16 Apr 2023',
            updated: '16 Apr 2023',
        }
    ]);
});
