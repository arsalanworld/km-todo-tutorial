define([
    'uiComponent',
    'ko',
    'jquery',
    'Magento_Ui/js/modal/modal'
], function (Component, ko, $, modal) {
    'use strict';

    return Component.extend({
        defaults: {
            popUp: {
                element: "#todo-form",
                options: {
                    "type": "popup",
                    "responsive": true,
                    "innerScroll": true,
                    "title": "Create Todo",
                    "trigger": "todo-form",
                    "buttons": {
                        "cancel": {
                            "text": "Close",
                            "class": "action secondary action-hide-popup"
                        }
                    }
                }
            }
        },

        popUpObj: null,
        isPopUpVisible: ko.observable(false),

        getPopUp: function () {
            if (!this.popUpObj) {
                var buttons = this.popUp.options.buttons;

                this.popUp.options.buttons = [{
                    text: buttons.cancel.text,
                    class: buttons.cancel.class,
                    click: this.onCloseTaskPopUp.bind(this)
                }];

                this.popUp.options.closed = function () {
                    // custom logic here.
                }
            }

            return this.popUpObj;
        },

        onCloseTaskPopUp: function () {
            this.getPopUp().closeModal();
            return this;
        }
    });
});
