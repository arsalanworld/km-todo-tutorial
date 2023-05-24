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
        isFormVisible: ko.observable(false),
        taskStatuses: ko.observableArray([]),
        taskFormPath: 'km-todo-scope.task.taskForm',

        initialize: function () {
            this._super();
            this.tasks.subscribe(function (task) {
                this._setActiveTasks(this.activeParentId());
            }, this);
        },

        onChangeVisibility: function (value) {
            if (value) {
                this.getPopUp().openModal();
            }
        },

        afterBindClosePopUp: function () {
            this._super();
            this.isVisible(false);
        },

        createNewTask: function () {
            this.editTask(this._convertToObservables({
                id: 0,
                title: '',
                status: 0,
                parentId: this.activeParentId(),
                created: new Date(),
                updated: new Date()
            }), this);
        },

        editTask: function (item, $this) {
            $this.source.set('task', {
                id: item.id,
                title: item.title(),
                status: item.status(),
                parentId: item.parentId(),
                created: item.created(),
                updated: item.updated()
            });
            this.isFormVisible(true);
        },

        saveTask: function () {
            this.source.set('params.invalid', false);
            let task = this.source.get('task');
            this.validateForm(this.taskFormPath + '.title');
            if (this.source.get('params.invalid')) {
                return;
            }

            // When new item is created
            if (task.id === undefined || !task.id) {
                task.id = this.tasks().length + 1;
                this.tasks().push(this._convertToObservables(task));
                this._setActiveTasks(this.activeParentId());
                this.isFormVisible(false);
                return;
            }

            let index = _.findLastIndex(this.tasks(), {
                id: task.id
            });
            if (index < 0 || index === undefined) {
                alert('Something went wrong!');
                return;
            }

            this.tasks.replace(this.tasks()[index], this._convertToObservables(task));
            this.isFormVisible(false);
        },

        deleteTaskItem: function (item, $this) {
            $this.tasks.remove(function (task) {
                return task.id === item.id
            });
        },

        _convertToObservables: function (task) {
            return {
                id: task.id,
                title: ko.observable(task.title),
                status: ko.observable(task.status),
                parentId: ko.observable(task.parentId),
                created: ko.observable(task.created),
                updated: ko.observable(task.updated)
            };
        },

        _setActiveTasks: function (parentId) {
            this.taskStatuses([]); // Empty all items first
            let tasks = _.filter(this.tasks(), function (task) {
                return task.parentId() === parentId;
            });
            this.pendingTasks(this._filterTaskStatus(tasks, 0));
            this.completedTasks(this._filterTaskStatus(tasks, 1));
            this.taskStatuses([{
                parentId: this.activeParentId(),
                totalTasks: tasks.length,
                completedTasks: this.completedTasks().length
            }]);
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
