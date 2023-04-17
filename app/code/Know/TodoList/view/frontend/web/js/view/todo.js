define([
    './abstract',
    'ko',
    'underscore',
    'Know_TodoList/js/model/todos',
    'jquery',
    'mage/calendar'
], function (Component, ko, _, todos, $) {
    "use strict";

    var todoObj;

    return Component.extend({
        defaults: {
            template: "Know_TodoList/todo",
            listens: {
                'todos': 'todoIsHidden'
            }
        },
        todos: todos,
        isVisible: ko.observable(0),
        isTodoVisible: ko.observable(false),
        isTaskPopupVisible: ko.observable(false),
        activeTodoId: ko.observable(0),
        todoFieldset: 'km-todo-scope.todo.todo-fieldset',
        fields: ['title', 'description', 'start_date', 'end_date'],

        initialize: function () {
            this._super();
            todoObj = this;
            this.isVisible(this.todos().length);
            this.isTodoVisible.subscribe(function (value) {
                if (value) {
                    this.getPopUp().openModal();
                }
            }, this);
        },
        todoIsHidden: function () {
            this.isVisible(this.todos().length);
            return this;
        },

        getProgressCount: function (completedTasks, totalTasks) {
            if (isNaN(completedTasks) || isNaN(totalTasks)) {
                return 0;
            }

            let percentage = parseInt(Math.floor(Math.round(completedTasks/totalTasks * 100)));
            return !isNaN(percentage) ? percentage : 0;
        },

        getPopUpButtonObj: function () {
            if (this.popUpObj) {
                return [];
            }

            let parentBtn = this._super();
            parentBtn.push({
                text: 'Save',
                class: 'action primary',
                click: this.saveTodoForm.bind(this)
            });
            return parentBtn;
        },
        createNewTodo: function () {
            todoObj.editTodo({
                id: 0,
                description: '',
                total_tasks: 0,
                completed_tasks: 0,
                start_date: new Date(),
                end_date: new Date(),
            });
        },

        editTodo: function (item) {
            todoObj.isTodoVisible(true);
            todoObj.source.set('todo', item);
            $('input[name="start_date"]').val( new Date(item.start_date)
                .toLocaleDateString('en-US'), { day: 'short' } ).trigger('change');
            $('input[name="end_date"]').val( new Date(item.end_date)
                .toLocaleDateString('en-US'), { day: 'short' } ).trigger('change');
        },

        saveTodoForm: function () {
            todoObj.source.set('params.invalid', false);
            let todoItem = todoObj.source.get('todo');
            todoObj.triggerValidations();
            if (todoObj.source.get('params.invalid')) {
                return;
            }

            if (todoItem.id === undefined || !todoItem.id) {
                todoItem.id = todoObj.todos().length + 1;
                todoObj.todos.push(todoItem);
                todoObj.getPopUp().closeModal();
                return;
            }

            let matchedIndex = todoObj._searchTodo(todoItem.id);
            if (matchedIndex < 0) {
                alert('Something went wrong!');
                return;
            }

            todoObj.todos.replace(todoObj.todos()[matchedIndex], ko.observable(todoItem));
            todoObj.todos()[matchedIndex] = todoItem;
            todoObj.getPopUp().closeModal();
        },

        deleteTodo: function (item) {
            if (!confirm("Are you sure, you want to remove the item?")) {
                return;
            }
            todoObj.todos.remove(function (todo) {
                return todo.id === item.id;
            });
        },

        _searchTodo: function (id) {
            let index = _.findLastIndex(todoObj.todos(), {id: id});
            return (index < 0 || index === undefined) ? -1 : index;
        },

        afterBindClosePopUp: function () {
            this._super();
            this.isTodoVisible(false);
        },

        triggerValidations: function () {
            _.each(this.fields, function (field, key) {
                this.validateForm(this.todoFieldset + '.' + field);
            }, this);
        },

        viewTasks: function (item) {
            todoObj.activeTodoId(item.id);
            todoObj.isTaskPopupVisible(true);
        }
    });
});
