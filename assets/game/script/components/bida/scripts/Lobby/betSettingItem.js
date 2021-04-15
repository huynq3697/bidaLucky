var Utils = require('Utils');
var BiDaConstant = require('BiDaConstant');
var i18n = require('i18n');
cc.Class({
    extends: cc.Component,

    ctor() {
        // this.value = 0;
    },

    onLoad: function () {
        this.node.on(cc.Node.EventType.TOUCH_END, this.clickBtn.bind(this), this.node);
    },
    // reuse: function () {
    //     this.node.on(cc.Node.EventType.TOUCH_END, this.clickBtn.bind(this), this.node);
    // },
    properties: {
        label: cc.Label,
        bgOn: cc.Node,
        bgOff: cc.Node,
    },

    updateCell(option) {
        if (option.label != undefined) {
            this.node.scale = 1;
            this.label.string = Utils.Malicious.moneyWithFormat(option.label, ".");
            if (typeof (option.label) == "number") {
                this.value = option.label;
            }
            if (option.label == i18n.t("Tất cả")) {
                this.value = -1;
            }
        }
    },

    clickBtn(event) {
        if (event != null) {
            const target = event.currentTarget;
            var customEvent = new cc.Event.EventCustom(BiDaConstant.BET.BET_SETTING_VALUE, true);
            customEvent.value = this.value;
            customEvent.target = target;
            this.node.dispatchEvent(customEvent);
        }
        this.activeBgBtn(this.node);
    },

    start() { },

    activeBgBtn: function (node, value) {
        const listBtnFilter = this.node.getParent().getChildren();
        for (let i = 0; i < listBtnFilter.length; i++) {
            if (node) {
                if (node == listBtnFilter[i]) {
                    listBtnFilter[i].getComponent("betSettingItem").bgOn.active = true;
                    listBtnFilter[i].getComponent("betSettingItem").bgOff.active = true;
                } else {
                    listBtnFilter[i].getComponent("betSettingItem").bgOn.active = false;
                    listBtnFilter[i].getComponent("betSettingItem").bgOff.active = true;
                }
            } else if (value != null) {
                listBtnFilter[i].getComponent("betSettingItem").bgOn.active = true;
                listBtnFilter[i].getComponent("betSettingItem").bgOff.active = true;
            } else {
                listBtnFilter[i].getComponent("betSettingItem").bgOn.active = false;
                listBtnFilter[i].getComponent("betSettingItem").bgOff.active = true;
            }
            listBtnFilter[i].scale = 1;
        }
    },

    //update (dt) {}
});