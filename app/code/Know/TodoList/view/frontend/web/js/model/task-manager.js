define([
    'mage/url',
    '../action/send-get-request',
    'underscore',
    './tasks',
    'ko',
    './resolver/item-resolver',
    '../action/send-post-request'
], function (
    mageUrl,
    SendGetRequest,
    _,
    taskArray,
    ko,
    itemResolver,
    SendPostRequest
) {
    'use strict';

    return {
        fetchItems: function (parentId, entityId, deferred) {
            let path = 'todo/task/index/parentId/' + parentId;
            if (entityId !== undefined && entityId) {
                path += '/id/' + entityId;
            }

            let serviceUrl = mageUrl.build(path),
                self = this;
            SendGetRequest(serviceUrl).done(function (response) {
                self._processResponse(response, deferred);
            });
        },

        saveTaskItem: function (item, deferred)
        {
            let serviceUrl = mageUrl.build('todo/task/create'),
                payload = {
                    task: itemResolver.resolve(item)
                }, self = this;

            SendPostRequest(serviceUrl, payload).done(function (response) {
                self._processResponse(response, deferred);
            });
        },

        deleteTask: function (item, deferred) {
            let serviceUrl = mageUrl.build('todo/task/delete'),
                payload = {
                    taskId: item.id
                };
            SendPostRequest(serviceUrl, payload)
                .done(function (response) {
                    if (response.data !== undefined && response.data.deleted !== undefined) {
                        taskArray.remove(function (task) {
                            return parseInt(task.id) === parseInt(item.id)
                        });
                    }

                    if (deferred !== undefined) {
                        deferred.resolve();
                    }
                });
        },

        updateStatus: function (item, deferred) {
            let serviceUrl = mageUrl.build('todo/task/updateStatus'),
                payload = {
                    taskId: item.id,
                    status: item.status() ? 1 : 0
                };

            SendPostRequest(serviceUrl, payload)
                .done(function (response) {
                    if (response.data !== undefined && response.data.updated !== undefined) {
                        item.status(
                            response.data.updated ? (item.status() ? 1 : 0)
                                : (item.status() ? 0 : 1)
                        );
                    }

                    if (deferred !== undefined) {
                        deferred.resolve();
                    }
                });
        },

        _processResponse: function (response, deferred) {
            let self = this;
            _.each(response.data.items, function (responseItem) {
                self.pushItem(responseItem);
            });

            if (deferred !== undefined) {
                deferred.resolve(response);
            }
        },

        pushItem: function (item) {
            let index = _.findLastIndex(taskArray(), {
                id: parseInt(item.id)
            });
            let observableItem = this.convertToObservables(item);
            if (index < 0 || index === undefined) {
                taskArray.push(observableItem);
                return this;
            }

            taskArray.replace(taskArray()[index], observableItem);
            return this;
        },

        convertToObservables: function (task) {
            return {
                id: parseInt(task.id),
                title: ko.observable(task.title),
                status: ko.observable(parseInt(task.status)),
                parentId: ko.observable(parseInt(task.parentId)),
                created: ko.observable(task.created),
                updated: ko.observable(task.updated)
            };
        }
    };
});
