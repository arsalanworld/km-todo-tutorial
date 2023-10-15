define([
    'mage/storage',
    'Know_TodoList/js/model/screen-loader',
    'Know_TodoList/js/model/error-processor'
], function (
    storageApi,
    screenLoader,
    errorProcessor
) {
    'use strict';

    return function (serviceUrl, deferred) {
        screenLoader.startLoader();
        return storageApi.get(serviceUrl, false)
            .done(function (response) {
                if (deferred !== undefined) {
                    deferred.resolve(response);
                }

                screenLoader.stopLoader();
            })
            .fail(function (response) {
                errorProcessor.process(response);
                if (deferred !== undefined) {
                    deferred.reject(response);
                }

                screenLoader.stopLoader(1);
            });
    }
});
