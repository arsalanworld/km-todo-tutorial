define([
    'mage/storage',
    'Know_TodoList/js/model/screen-loader',
    'Know_TodoList/js/model/error-processor'
], function (storage, screenLoader, errorProcessor) {
    'use strict';

    return function (serviceUrl, payload, deferred) {
        screenLoader.startLoader();
        return storage.post(
            serviceUrl,
            JSON.stringify(payload),
            true,
            'application/json'
        ).done(function (response) {
            if (deferred !== undefined) {
                deferred.resolve(response);
            }

            screenLoader.stopLoader();
        }).fail(function (response) {
            errorProcessor.process(response);
            if (deferred !== undefined) {
                deferred.reject(response);
            }

            screenLoader.stopLoader(1);
        });
    }
});
