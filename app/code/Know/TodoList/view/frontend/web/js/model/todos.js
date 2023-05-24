define([
    'ko'
], function (ko) {
    'use strict';

    return ko.observableArray([
        {
            "id": 1,
            "title": ko.observable("Meetings"),
            "description": ko.observable("Attend daily meetings and discuss the agenda."),
            "start_date": ko.observable("10 Mar 2023"),
            "end_date": ko.observable("15 Mar 2023"),
            "completed_tasks": ko.observable(5),
            "total_tasks": ko.observable(10)
        },
        {
            "id": 2,
            "title": ko.observable("Prototype design"),
            "description": ko.observable("Split the prototype design in small tasks."),
            "start_date": ko.observable("15 Mar 2023"),
            "end_date": ko.observable("19 Mar 2023"),
            "completed_tasks": ko.observable(3),
            "total_tasks": ko.observable(15)
        },
        {
            "id": 3,
            "title": ko.observable("Plan and execution"),
            "description": ko.observable("Create strategy and execute a development plan on it."),
            "start_date": ko.observable("18 Mar 2023"),
            "end_date": ko.observable("26 Mar 2023"),
            "completed_tasks": ko.observable(1),
            "total_tasks": ko.observable(10)
        },
        {
            "id": 4,
            "title": ko.observable("Deployments"),
            "description": ko.observable("Perform scheduled deployments on production."),
            "start_date": ko.observable("30 Mar 2023"),
            "end_date": ko.observable("30 Mar 2023"),
            "completed_tasks": ko.observable(2),
            "total_tasks": ko.observable(3)
        }
    ]);
});
