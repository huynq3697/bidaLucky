var Utils = require('Utils');
var BiDaConstant = require('BiDaConstant');
var i18n = require('i18n');
var Linker= require('Linker');
cc.Class({
    extends: cc.Component,

    ctor() {
        this.value = 0;
    },

    properties: {
        label : cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    updateCell (option) {
        if (option.label != undefined ) {
           this.label.string = Utils.Malicious.moneyWithFormat(option.label, ".");
           if (typeof(option.label) == "number") {
            this.value = option.label;
           } 
        }
    },

    clickBtn (event) {
        const target = event.currentTarget;
        var customEvent = new cc.Event.EventCustom(BiDaConstant.BET.BET_SETTING_VALUE, true);
        customEvent.value = this.value;
        customEvent.target = target;
        Linker.valueBetSprite = this.value;
        this.node.dispatchEvent(customEvent);
    },
    // update (dt) {},
});
