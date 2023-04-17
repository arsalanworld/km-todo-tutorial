define([
    'ko'
], function (ko) {
    'use strict';

    return ko.observableArray([
        {
            "id": 1,
            "title": "Meetings",
            "description": "Attend daily meetings and discuss the agenda.",
            "start_date": "Apr 14 2023",
            "end_date": "Apr 18 2023",
            "completed_tasks": 5,
            "total_tasks": 10
        },
        {
            "id": 2,
            "title": "Prototype design",
            "description": "Split the prototype design in small tasks.",
            "start_date": "15 Mar 2023",
            "end_date": "19 Mar 2023",
            "completed_tasks": 3,
            "total_tasks": 15
        },
        {
            "id": 3,
            "title": "Plan and execution",
            "description": "Create strategy and execute a development plan on it.",
            "start_date": "18 Mar 2023",
            "end_date": "26 Mar 2023",
            "completed_tasks": 1,
            "total_tasks": 10
        },
        {
            "id": 4,
            "title": "Deployments",
            "description": "Perform scheduled deployments on production.",
            "start_date": "30 Mar 2023",
            "end_date": "30 Mar 2023",
            "completed_tasks": 2,
            "total_tasks": 3
        }
    ]);
});
