var PopupDisplay = require('PopupDisplay');
var DataManger = require('DataManger');
var i18n = require('i18n');
cc.Class({
    extends: PopupDisplay,

    properties: {
        nameEditbox: cc.EditBox
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    onEnable() {
        this.setName();
    },

    setName() {
        this.nameEditbox.string = DataManger.UserData.getUserName();
    },

    onBtnAccept() {
        if (!this.nameEditbox.string) {
            cc.Global.showMessage(i18n.t("Please input username !"));
        } else {
            DataManger.UserData.setUserName(this.nameEditbox.string);
            this.onClickExit();
        }
    }

    // update (dt) {},
});
