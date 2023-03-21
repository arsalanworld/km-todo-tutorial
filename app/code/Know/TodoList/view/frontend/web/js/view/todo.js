define([
    './abstract',
    'ko',
    'Know_TodoList/js/model/todos'
], function (Component, ko, todos) {
    "use strict";

    return Component.extend({
        defaults: {
            template: "Know_TodoList/todo",
        },
        todos: todos,
        isVisible: ko.observable(0),

        initialize: function () {
            this._super();

            this.isVisible(this.todos().length);
        },

        getProgressCount: function (completedTasks, totalTasks) {
            if (isNaN(completedTasks) || isNaN(totalTasks)) {
                return 0;
            }

            let percentage = parseInt(Math.floor(Math.round(completedTasks/totalTasks * 100)));
            return !isNaN(percentage) ? percentage : 0;
        }
    });
});
