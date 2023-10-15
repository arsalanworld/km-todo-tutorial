define([
    './abstract',
    'ko',
    'underscore',
    'Know_TodoList/js/model/tasks',
    'Know_TodoList/js/model/task-manager',
    'jquery'
], function (Abstract, ko, _, tasks, taskManager, $) {
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
                if (this._filterByParent(this.activeParentId()).length) {
                    return;
                }

                let deferred = $.Deferred(),
                    self = this;

                taskManager.fetchItems(self.activeParentId(), null, deferred);
                $.when(deferred).done(function () {
                    self._setActiveTasks(self.activeParentId());
                });
            }
        },

        afterBindClosePopUp: function () {
            this._super();
            this.isVisible(false);
        },

        createNewTask: function () {
            this.editTask(taskManager.convertToObservables({
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

            let self = this,
                deferred = $.Deferred();
            taskManager.saveTaskItem(task, deferred);
            $.when(deferred).done(function () {
                self.isFormVisible(false);
            });
        },

        deleteTaskItem: function (item) {
            taskManager.deleteTask(item);
        },

        updateStatus: function (task, self) {
            let deferred = $.Deferred();
            taskManager.updateStatus(task, deferred);
            $.when(deferred).done(function () {
                self._setActiveTasks(self.activeParentId());
                self.isFormVisible(false);
            });
        },

        _setActiveTasks: function (parentId) {
            this.taskStatuses([]); // Empty all items first
            let tasks = _.filter(this.tasks(), function (task) {
                return parseInt(task.parentId()) === parseInt(parentId);
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
        },

        _filterByParent: function (parentId) {
            return _.filter(this.tasks(), function (task) {
                return parseInt(task.parentId()) === parseInt(parentId);
            });
        }
    });
});
