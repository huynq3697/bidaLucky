
const BiDaConstant = require('BiDaConstant');
var Linker = require('Linker');
var NewAudioManager = require('NewAudioManager');
var Global = require('Global');
cc.Class({
    extends: cc.Component,

    properties: {
        btnEvent: cc.Node,
        btnGiftCode: cc.Node,
        btnMailBox: cc.Node,
        btnFreeCoins: cc.Node,
        btnCueShop: cc.Node,
        btnShop: cc.Node,
        btnFb: cc.Node,
        btnMess: cc.Node,
        btnBackHome: cc.Node,
        btnLogout: cc.Node,
        countMail: cc.Node,
        billardHomeLeft: cc.Node,
        billardHomeRight: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.touchEventListener = BiDaConstant.METHODS.createListenerNode();
        this.addEventButtonToNode();
        this.addSocketEvent();
        if (cc.Global.unSeenMail > 0) {
            this.initInfoMailNoti();
        }
        this.isCanLogout = false;
    },

    start () {
        cc.log("Linker.Config.pmE:",Linker.Config.pmE);
        if (Linker.Config.pmE) {
            this.btnShop.active = true;
        } else {
            this.btnShop.active = false;
        }
    },

    // update (dt) {},

    onDestroy() {
        this.removeSocketEvent();
    },

    addSocketEvent() {
        Linker.Event.addEventListener(14002, this.onUnSeen, this);
    },

    removeSocketEvent() {
        Linker.Event.removeEventListener(14002, this.onUnSeen, this);
    },

    onUnSeen(message) {
        if (this.isLogin()) {
            if (message && message.status) {
                cc.Global.unSeenMail = Number(message.unReadMail);
                this.initInfoMailNoti();
            }
        }
    },

    isLogin: function () {
        return (Linker.isLogin) ? true : false;
    },

    initInfoMailNoti() {
        var countmail = cc.Global.unSeenMail;
        if (countmail > 0) {
            this.countMail.active = true;
            var lblCountMail = this.countMail.getChildByName('txtCountMail').getComponent(cc.Label);
            lblCountMail.string = countmail;
        } else {
            this.countMail.active = false;
        }
    },

    addEventButtonToNode() {
        this.btnEvent.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.btnGiftCode.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.btnMailBox.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.btnFreeCoins.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.btnCueShop.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.btnShop.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.btnFb.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.btnMess.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.btnBackHome.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.btnLogout.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.touchEventListener.on("initMailInfo", this.initInfoMailNoti, this);
    },

    onTouchEnd(event) {
        NewAudioManager.playClick();
        event.stopPropagation();
        switch(event.target) {
            case this.btnEvent: {
                var customEvent = new cc.Event.EventCustom(BiDaConstant.POPUP_EVENT.EVENT.OPEN, true);
                this.node.dispatchEvent(customEvent);
                break;
            }
            case this.btnGiftCode: {
                var customEvent = new cc.Event.EventCustom(BiDaConstant.POPUP_EVENT.GIFT_CODE.OPEN, true);
                this.node.dispatchEvent(customEvent);
                break;
            }
            case this.btnMailBox: {
                var customEvent = new cc.Event.EventCustom(BiDaConstant.POPUP_EVENT.MESSAGE.OPEN, true);
                this.node.dispatchEvent(customEvent);
                break;
            }
            case this.btnFreeCoins: {
                Linker.ShopType = 0;
                var customEvent = new cc.Event.EventCustom(BiDaConstant.POPUP_EVENT.XU_FREE_STORE.OPEN, true);
                this.node.dispatchEvent(customEvent);
                break;
            }

            case this.btnCueShop: {
                var customEvent = new cc.Event.EventCustom(BiDaConstant.POPUP_EVENT.LIST_CUE.OPEN, true);
                this.node.dispatchEvent(customEvent);
                break;
            }

            case this.btnShop: {
                Linker.ShopType = 1;
                var customEvent = new cc.Event.EventCustom(BiDaConstant.POPUP_EVENT.XU_STORE.OPEN, true);
                this.node.dispatchEvent(customEvent);
                break;
            }

            case this.btnMess: {
                if (Linker.Config) {
                    var url = Linker.Config.MESSAGER;
                    cc.sys.openURL(url);
                }
                break;
            }

            case this.btnFb: {
                if (Linker.Config) {
                    var url = Linker.Config.FACEBOOK_PAGE;
                    cc.sys.openURL(url);
                }
                break;
            }

            case this.btnBackHome: {
                if (!this.isCanLogout) {
                    var customEvent = new cc.Event.EventCustom(BiDaConstant.GAME_COMMONS_EVENT.BACK_TO_HOME_GAME, true);
                    this.node.dispatchEvent(customEvent);
                } else {
                    this.logOut();
                }

                break;
            }

            case this.btnLogout: {
                var customEvent = new cc.Event.EventCustom(BiDaConstant.POPUP_EVENT.SETTING.OPEN, true);
                this.node.dispatchEvent(customEvent);
                break;
            }

            default: {
                break;
            }
        }
        //this.touchEventListener.emit("homeBottomClick", event);
    },

    showLobby() {
        // this.btnBackHome.active = true;
        // this.btnLogout.active = false;
        this.isCanLogout = false;
    },

    hideLobby() {
        // this.btnBackHome.active = false;
        // this.btnLogout.active = true;
        this.isCanLogout = true;
    },

    logOut: function () {
        if (Global.Announcement.AnnouncePrefab && Global.Announcement.GlobalNodePrefab) {
            var gNode = cc.instantiate(Global.Announcement.GlobalNodePrefab);
            var gNodeC = gNode.getComponent("GlobalNode");
            if (gNodeC) {
                Global.Announcement._addChild(gNode);
                gNodeC.alert("message_confirm_logout", G.AT.OK_CANCEL, () => {
                    Linker.Socket.close();
                    Linker.isLogin = false;
                    if (Linker.isFb) {
                        Linker.MySdk.logoutFb();
                        Linker.isFb = false;
                    }
                    Global.Announcement._removeAllChild();
                    Global.Announcement.AnnounceNode.active = false;
                    // if (!Global.LoginHandler.IS_REM_PASSWORD) {
                    //     LoginCache.remove();
                    //     cc.log("Remove password remember ...");
                    // }
                    //logout thanh cong
                    var customEvent = new cc.Event.EventCustom(BiDaConstant.LOGIN_EVENT.LOGOUTED_SUCCESS, true);
                    this.node.dispatchEvent(customEvent);
                }, () => {
                    Global.Announcement._removeAllChild();
                    Global.Announcement.AnnounceNode.active = false;
                    cc.log("Huy logout ...");
                });
            }
        }
    },

    clickButton(event, customEventData) {
        NewAudioManager.playClick();
        switch (customEventData) {
            case "support": {
                event.target.getChildByName("groupBtn").active = !event.target.getChildByName("groupBtn").active;
                event.target.parent.children[0].active = event.target.getChildByName("groupBtn").active;
                break;
            }
            case "guide": {
                var customEvent = new cc.Event.EventCustom(BiDaConstant.POPUP_EVENT.GUIDE.OPEN, true);
                this.node.dispatchEvent(customEvent);
                break;
            }
        }
    }
});
