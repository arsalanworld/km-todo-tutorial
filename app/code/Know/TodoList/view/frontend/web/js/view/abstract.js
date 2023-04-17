define([
    'uiComponent',
    'ko',
    'uiRegistry',
    'jquery',
    'Magento_Ui/js/modal/modal'
], function (Component, ko, registry, $, modal) {
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
                let buttons = this.getPopUpButtonObj();
                if (buttons) {
                    this.popUp.options.buttons = buttons;
                }
                this.popUp.options.closed = this.afterBindClosePopUp.bind(this);
                this.popUp.options.modalCloseBtnHandler = this.onClosePopUp.bind(this);
                this.popUp.options.keyEventHandlers = {
                    escapeKey: this.onClosePopUp.bind(this)
                };

                this.popUp.options.opened = this.onOpenPopUp.bind(this);
                this.popUpObj = modal(this.popUp.options, $(this.popUp.element));
            }

            return this.popUpObj;
        },

        getPopUpButtonObj: function () {
            let buttonObj = [];
            if (!this.popUpObj) {
                let buttons = this.popUp.options.buttons;
                buttonObj.push({
                    text: buttons.cancel.text,
                    class: buttons.cancel.class,
                    click: this.onClosePopUp.bind(this)
                });
            }

            return buttonObj;
        },

        onClosePopUp: function () {
            this.getPopUp().closeModal();
            return this;
        },

        afterBindClosePopUp: function () {
            this.isPopUpVisible(false);
        },

        onOpenPopUp: function () {
            // @todo: add some logic here.
        },

        validateForm: function (registryPath) {
            if (!registry.get(registryPath).validate().valid) {
                this.source.set('params.invalid', true);
            }
        }
    });
});
