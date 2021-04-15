var Linker = require('Linker');
const BiDaConstant = require('BiDaConstant');
var NewAudioManager = require("NewAudioManager");
cc.Class({
    extends: cc.Component,

    properties: {
        userNameEditBox: cc.EditBox,
        password1EditBox: cc.EditBox,
        password2EditBox: cc.EditBox,
        btnSignUp: cc.Node,
        btnBack: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.btnSignUp.on(cc.Node.EventType.TOUCH_END, this.onButtonClick, this);
        this.btnBack.on(cc.Node.EventType.TOUCH_END, this.onButtonClick, this);
    },

    onEnable () {
        this.userNameEditBox.string = "";
        this.password1EditBox.string = "";
        this.password2EditBox.string = "";
    },

    start () {

    },

    // update (dt) {},

    onButtonClick(event) {
        //var target = event.currentTarget;
        switch(event.target.name) {
            case "btnSignUp": {
                NewAudioManager.playClick();
                Linker.LoginController.registerBtnClick();
                break;
            }
            case "btnBackToTop": {
                NewAudioManager.playClick();
                // this.node.active = false;
                // this.node.dispatchEvent(new cc.Event.EventCustom(BiDaConstant.POPUP_EVENT.SIGN_UP.CLOSE, true));
                this.node.active = false;
                this.node.parent.getChildByName("BillardPanelSignIn").active = true;
                break;
            }
        }
    }
});
