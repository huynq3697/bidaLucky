var LoginCache = require('LoginCache');
const BiDaConstant = require('BiDaConstant');
cc.Class({
    extends: cc.Component,

    properties: {
        signInPanel: cc.Node,
        signUpPanel: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    },

    onEnable() {
        this.addEventListener();
    },

    start () {

    },

    // update (dt) {},

    addEventListener() {
        this.node.on(BiDaConstant.POPUP_EVENT.SIGN_IN.OPEN, this.onEventHandler, this);
        this.node.on(BiDaConstant.POPUP_EVENT.SIGN_UP.OPEN, this.onEventHandler, this);
        this.node.on(BiDaConstant.POPUP_EVENT.SIGN_UP.CLOSE, this.onEventHandler, this);
    },

    onEventHandler (event) {
        switch(event.type) {
            case BiDaConstant.POPUP_EVENT.SIGN_IN.OPEN: {
                this.signInPanel.active = true;
                this.signUpPanel.active = false;
                break;
            }
            case BiDaConstant.POPUP_EVENT.SIGN_IN.CLOSE: {
                this.signInPanel.active = false;
                break;
            }
            case BiDaConstant.POPUP_EVENT.SIGN_UP.OPEN: {
                this.signUpPanel.active = true;
                this.signInPanel.active = false;
                break;
            }
            case BiDaConstant.POPUP_EVENT.SIGN_UP.CLOSE: {
                this.signUpPanel.active = false;
                break;
            }
        }
    },
});
