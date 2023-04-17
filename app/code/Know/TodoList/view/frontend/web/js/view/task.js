define([
    './abstract',
    'ko',
    'underscore',
    'uiRegistry',
    'Know_TodoList/js/model/tasks',
    'Know_TodoList/js/model/todos'
], function (Abstract, ko, _, registry, tasks, todos) {
    'use strict';

    var taskObj;
    return Abstract.extend({
        defaults: {
            template: 'Know_TodoList/task',
            taskListTemplate: 'Know_TodoList/task/list',
            taskFormTemplate: 'Know_TodoList/task/form',
            imports: {
                'activeParentId': '${ $.parentName }.todo:activeTodoId'
            },
            links: {
                'isVisible': '${ $.parentName }.todo:isTaskPopupVisible',
            },
            listens: {
                'isVisible': 'onChangeVisibility'
            }
        },

        activeParentId: ko.observable(0),
        isVisible: ko.observable(false),
        isTaskFormVisible: ko.observable(false),
        allTasks: tasks,
        tasks: ko.observableArray([]),
        completedTasks: ko.observableArray([]),
        todos: todos,
        taskForm: 'km-todo-scope.task.taskForm',

        initialize: function () {
            this._super();
            taskObj = this;
            this.activeParentId.subscribe(function (value) {
                this._setActiveTasks(value);
            }, this);
            this.activeParentId.extend({ rateLimit: 100 });
            return this;
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

        showTaskForm: function () {
            taskObj.isTaskFormVisible(true);
            taskObj.source.set('task', {});
        },

        edit: function (item) {
            console.log('edit');
            console.log(item);
        },

        delete: function (item) {
            taskObj.allTasks.remove(function (tasks) {
                return tasks.id === item.id;
            });
            taskObj._setActiveTasks(taskObj.activeParentId());
        },

        updateStatus: function (item) {
            item.status = item.status ? 1 : 0;
            return taskObj._updateTaskItem(item);
        },

        createTask: function () {
            taskObj.source.set('task', {
                id: Math.random(),
                title: registry.get(taskObj.taskForm + '.title').value(),
                status: 0,
                parentId: taskObj.activeParentId(),
                created: '17 Apr 2023',
                updated: '17 Apr 2023'
            });
            taskObj.source.set('params.invalid', false);
            taskObj.validateForm(taskObj.taskForm + '.title');
            if (!taskObj.source.get('params.invalid')) {
                taskObj.allTasks.push(taskObj.source.get('task'));
                taskObj.cancelCreate();
                taskObj._setActiveTasks(taskObj.activeParentId());
            }
        },

        cancelCreate: function () {
            taskObj.isTaskFormVisible(false);
        },

        _setActiveTasks: function (parentId) {
            let allTasks = _.filter(taskObj.allTasks(), function (task) {
                return task.parentId === parentId;
            });
            if (allTasks === undefined) {
                return;
            }

            let pendingTasks = _.filter(allTasks, function (task) {
                return task.parentId === parentId && task.status === 0;
            });
            let completedTasks = _.filter(allTasks, function (task) {
                return task.parentId === parentId && task.status === 1;
            });
            this.tasks(pendingTasks === undefined ? [] : pendingTasks);
            this.completedTasks(completedTasks === undefined ? [] : completedTasks);

            // extra
            let index = taskObj.findItemIndex(taskObj.todos(), parentId);
            if (index > -1) {
                let todoItem = taskObj.todos()[index];
                todoItem.completed_tasks = taskObj.completedTasks().length;
                todoItem.total_tasks = allTasks.length;
                taskObj.todos.replace(taskObj.todos()[index], ko.observable(todoItem));
                taskObj.todos()[index] = todoItem;
            }
        },

        _updateTaskItem: function (item) {
            let index = taskObj.findItemIndex(tasks(), item.id);
            if (index < 0) {
                alert("couldn't find item.");
                return false;
            }

            taskObj.allTasks.replace(taskObj.allTasks()[index], ko.observable(item));
            taskObj.allTasks()[index] = item;
            taskObj._setActiveTasks(taskObj.activeParentId());
            return true;
        },

        /**
         *
         * @param {null|Object} obj
         * @param {null|number} itemId
         * @returns {number}
         */
        findItemIndex: function (obj, itemId) {
            let index = _.findLastIndex(obj, { id: itemId });
            if (index === undefined || index < 0) {
                return -1;
            }

            return index;
        }
    });
});
