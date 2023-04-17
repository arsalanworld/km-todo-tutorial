define([
    'Magento_Ui/js/form/element/date',
    'ko',
    'jquery',
    'mage/calendar'
], function (Component, ko, $) {
    'use strict';

    return Component.extend({
        dependantValue: ko.observable(''),
        defaults: {
            listens: {
                'dependantValue': 'onDependantUpdate'
            }
        },

        onDependantUpdate: function (value) {
            if (value && value !== "") {
                $('#' + this.uid).datepicker( "option", "minDate", new Date(value) );
            }

            return this;
        }
    });
});
