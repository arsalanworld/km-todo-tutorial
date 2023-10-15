/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/**
 * @api
 */
define([
    'mage/url',
    'Magento_Ui/js/model/messageList',
    'mage/translate',
    'underscore'
], function (url, globalMessageList, $t, _) {
    'use strict';

    return {
        /**
         * @param {Object} response
         * @param {Object} messageContainer
         */
        process: function (response) {
            var error;

            if (response.status == 401 || !_.isObject(response)) { //eslint-disable-line eqeqeq
                window.location.replace(url.build('customer/account/login/'));
            } else {
                try {
                    error = JSON.parse(response.responseText);
                } catch (exception) {
                    error = {
                        message: $t('Something went wrong with your request. Please try again later.')
                    };
                }
                globalMessageList.addErrorMessage(error);
            }
        }
    };
});
