define([
    './abstract',
    'ko',
    'underscore',
    'Know_TodoList/js/model/tasks'
], function (Abstract, ko, _, tasks) {
    'use strict';

    return Abstract.extend({
        defaults: {
            template: 'Know_TodoList/task',
            taskListTemplate: 'Know_TodoList/task/list',
            imports: {
                'activeParentId': '${ $.parentName }.todo:activeTodoId'
            },
            links: {
                'isVisible': '${ $.parentName }.todo:isTaskPopUpVisible'
            },
            listens: {
                'isVisible': 'onChangeVisibility',
                'activeParentId': '_setActiveTasks'
            }
        },

        isVisible: ko.observable(false),
        activeParentId: ko.observable(0),
        tasks: tasks,
        pendingTasks: ko.observableArray([]),
        completedTasks: ko.observableArray([]),

        onChangeVisibility: function (value) {
            if (value) {
                this.getPopUp().openModal();
            }
        },

        afterBindClosePopUp: function () {
            this._super();
            this.isVisible(false);
        },

        _setActiveTasks: function (parentId) {
            let tasks = _.filter(this.tasks(), function (task) {
                return task.parentId() === parentId;
            });
            this.pendingTasks(this._filterTaskStatus(tasks, 0));
            this.completedTasks(this._filterTaskStatus(tasks, 1));
        },

        _filterTaskStatus: function (tasks, status) {
            if (!_.isObject(tasks) || status === undefined) {
                return [];
            }

            return _.filter(tasks, function (task) {
                return task.status() === status;
            });
        }
    });
});
