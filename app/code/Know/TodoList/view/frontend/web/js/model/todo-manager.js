define([
    'jquery',
    'Know_TodoList/js/action/get-todos',
    'underscore',
    'ko',
    './todos',
    'mage/url',
    './resolver/item-resolver',
    'Know_TodoList/js/action/send-post-request'
], function (
    $,
    GetTodosAction,
    _,
    ko,
    todoArray,
    mageUrl,
    itemResolver,
    sendPostRequestAction
) {
    'use strict';

    return {
        fetchItems: function (entityId) {
            if (entityId === undefined) {
                entityId = 0;
            }

            let deferred = $.Deferred(),
                self = this;
            GetTodosAction(entityId, deferred);

            $.when(deferred).done(function (response) {
                _.each(response.items, function (responseItem) {
                    self.pushItem(responseItem);
                });
            });
        },

        saveItem: function (item) {
           let self = this,
               serviceUrl = mageUrl.build('todo/index/create'),
               payload = {
                    todo: itemResolver.resolve(item)
               };
           sendPostRequestAction(serviceUrl, payload)
               .done(function (response) {
                   _.each(response.data.items, function (responseItem) {
                       self.pushItem(responseItem);
                   });
               })
        },

        pushItem: function (item) {
            let index = _.findLastIndex(todoArray(),  {
                id: parseInt(item.id)
            });
            let observableItem = this.convertToObservables(item);
            if (index < 0 || index === undefined) {
                todoArray.push(observableItem);
                return this;
            }

            todoArray.replace(todoArray()[index], observableItem);
            return this;
        },

        deleteItem: function (item) {
            let serviceUrl = mageUrl.build('todo/index/delete'),
                payload = {
                    todoId: item.id
                };

            sendPostRequestAction(serviceUrl, payload)
                .done(function (response) {
                    if (!response.success) {
                        alert('Something went wrong. Please try again later.');
                        return;
                    }

                    todoArray.remove(function (todo) {
                        return todo.id === item.id;
                    });
                });
        },

        convertToObservables: function (item) {
            return {
                id: parseInt(item.id),
                title: ko.observable(item.title),
                description: ko.observable(item.description),
                start_date: ko.observable(item.start_date),
                end_date: ko.observable(item.end_date),
                completed_tasks: ko.observable(item.completed_tasks),
                total_tasks: ko.observable(item.total_tasks)
            }
        }
    };
});
