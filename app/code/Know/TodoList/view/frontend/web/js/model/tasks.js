define([
    'ko'
], function (ko) {
    'use strict';

    return ko.observableArray([
        {
            id: 1,
            title: ko.observable('A custom task'),
            status: ko.observable(1),
            parentId: ko.observable(2),
            created: ko.observable('08/05/2023'),
            updated: ko.observable('08/05/2023')
        },
        {
            id: 2,
            title: ko.observable('Complete the to-do list'),
            status: ko.observable(0),
            parentId: ko.observable(1),
            created: ko.observable('08/05/2023'),
            updated: ko.observable('08/05/2023')
        },
        {
            id: 3,
            title: ko.observable('My completed task'),
            status: ko.observable(1),
            parentId: ko.observable(1),
            created: ko.observable('08/05/2023'),
            updated: ko.observable('08/05/2023')
        },
        {
            id: 4,
            title: ko.observable('New task'),
            status: ko.observable(0),
            parentId: ko.observable(3),
            created: ko.observable('07/05/2023'),
            updated: ko.observable('07/05/2023')
        }
    ]);
});
