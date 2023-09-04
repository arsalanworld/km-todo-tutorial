define([
    'mage/url',
    'jquery',
    './send-get-request'
], function (mageUrl, $, SendGetRequestAction) {
    'use strict';

    return function (entityId, deferred) {
        let path = 'todo/index/get';
        if (entityId !== undefined && entityId) {
            path += '/id/' + entityId;
        }

        let serviceUrl = mageUrl.build(path);
        deferred = deferred || $.Deferred();

        SendGetRequestAction(serviceUrl).done(function (response) {
            deferred.resolve(response);
        }).fail(function (response) {
            deferred.reject(response);
        });
    }
});
