define([
    'underscore'
], function (_) {
    'use strict';

    return {
        resolve: function (item) {
            let resolvedItem = {};
            _.each(item, function (value, key) {
                resolvedItem[key] = (typeof value === "function") ? value() : value;
            });

            return resolvedItem;
        }
    }
});
