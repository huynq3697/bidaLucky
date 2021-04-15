var BiDaConstant = require('BiDaConstant');
var Linker = require('Linker');
var Global = require("Global2");
var NewAudioManager = require('NewAudioManager');
var CommonSend = require('CommonSend');
cc.Class({
    extends: cc.Component,

    ctor() {
        this.userInfo = {};
        this.BidaHomeBottom = null;
        this.BidaHomeTop = null;
    },

    properties: {
        //BidaHomeTop: cc.Node,
        BidaHomeTopPrefab: cc.Prefab,
        BidaHomeMid: cc.Node,
        BidaHomeBottomPrefab: cc.Prefab,
        BidaLoginTop: cc.Node,
        changeNamePrefab: cc.Prefab
    },

    onLoad: function () {
       
        if (this.node.getChildByName("BillardHomeTop") == null) {
            var homeTop = cc.instantiate(this.BidaHomeTopPrefab);
            this.node.addChild(homeTop);
            this.BidaHomeTop = homeTop;
        } else {
            this.BidaHomeTop = this.node.getChildByName("BillardHomeTop");
        }

        if (this.node.getChildByName("BillardHomeBottom") == null) {
            var homeBottom = cc.instantiate(this.BidaHomeBottomPrefab);
            this.node.addChild(homeBottom);
            this.BidaHomeBottom = homeBottom;
        } else {
            this.BidaHomeBottom = this.node.getChildByName("BillardHomeBottom");
        }
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.backHandlerBtn, this);
    },

    init: function () {
        this.addEventButtonToNode();
        this.addEventCustomNode();
        this.configLogin();
    },
    configLogin: function () {
        if (!Linker.isLogin) {
            this.showPortalLoginGate();
        } else if (Linker.isLogin) {
            this.showHome();
            this.initEventData();
        }
    },
    sendRequests: function () {
        this.requestSendFriendByPage(1);
    },
    requestSendFriendByPage: function (page) {
        var send = CommonSend.getFriendSend(page);
        if (send) {
            Linker.Socket.send(send);
        }
    },

    showHome: function () {
        Linker._sceneTag = BiDaConstant.TAG.scenes.HOME;
        this.showHomeLayer();
        var _bidaHomeTopScript = this.BidaHomeTop.getComponent("BillardHomeTop");
        if (_bidaHomeTopScript && cc.isValid(_bidaHomeTopScript)) {
            _bidaHomeTopScript.hideLobby();
            _bidaHomeTopScript.initNohu();
        }
    },
    showHomeLayer: function(){
        this.BidaLoginTop.active = false;
        this.BidaHomeTop.active = true;
        this.BidaHomeMid.active = true;
        this.BidaHomeBottom.active = true;
    },
    initEventData: function () {
        if (Linker.isLogin && Linker.DataSuKien) {
            Linker.DataSuKien.taixiu_event.isOpenData = null;
            Linker.DataSuKien.taixiu_event.vinhdanh.today_data = null;
            Linker.DataSuKien.taixiu_event.vinhdanh.date_data = null
            Linker.DataSuKien.taixiu_event.homqua.today_data = null;
            Linker.DataSuKien.taixiu_event.homqua.date_data = null;
            Linker.DataSuKien.nohubai_event.mylisthu = null;
            Linker.DataSuKien.nohubai_event.commonlisthu = null;
            Linker.DataSuKien.common.all_event = [];
        }
    },
    showPortalLoginGate: function () {
        this.showLogin();
        var BillardLogin = this.BidaLoginTop.getComponent("BillardLoginTop");
        if (BillardLogin) {
            BillardLogin.showPortalLoginGate();
        }
    },
    getLoginTop: function () {
        return this.BidaLoginTop;
    },
    getHomeTop: function () {
        return this.BidaHomeTop;
    },
    showLogin: function () {
        this.BidaLoginTop.active = true;
        this.BidaHomeTop.active = false;
        this.BidaHomeMid.active = false;
        this.BidaHomeBottom.active = false;
        Linker._sceneTag = BiDaConstant.TAG.scenes.LOGIN;
    },
    addEventButtonToNode: function () {
    },
    addEventCustomNode: function () {
        this.node.on(BiDaConstant.LOGIN_EVENT.LOGINED_SUCCESS, this.onLogin, this);
    },
    onLogin: function (event) {
        if (event && event.hasOwnProperty("message")) {
            this.userInfo = event.message;
            this.BidaHomeTop.getComponent("BillardHomeTop").setHomeTopInfos(this.userInfo);
            if (this.userInfo.displayName.trim() === "") {
                var changeNamePrefab = cc.instantiate(this.changeNamePrefab);
                this.node.addChild(changeNamePrefab, cc.macro.MAX_ZINDEX);
            }
            //play nhạc nền
            //NewAudioManager.playBackground(NewAudioManager.sound.background);
            //xu ly popup o day.
            // this.playSoundBg(this.userInfo);
            // messageId: "1000"
            // status: "1"
            // userId: "95395"
            // userMoney: "9900050000"
            // userExp: "1"
            // checkMail: ""
            // userLevel: "1"
            // alertEmailContent: ""
            // alertEmailTitle: ""
            // isPhoneUpdate: "0"
            // displayName: "manhuni1s"
            // avatar: "no_image.gif"
            // isPayment: "1"
            // isActive: "0"
            // isNewLoginDay: "0"
            // zoneId: undefined
            // lastRoom: undefined
            this.showHome();
            this.sendRequests();
            this.hideLobby();
        } else {
            this.showLogin();
        }
    },
    // playSoundBg: function (data) {
    //     this.musicData = Linker.Local.readUserData();
    //     var self = this;
    //     cc.loader.load(cc.url.raw(NewAudioManager.sound.background), function () {
    //         if (self.musicData) {
    //             if (self.musicData.isMusic) {
    //                 NewAudioManager.audioIDBG = null;
    //                 cc.audioEngine.stopAll();
    //                 NewAudioManager.playBackground(NewAudioManager.sound.background);
    //             }
    //         }
    //     });
    // },
    onEnable: function () {
        
    },
    onDestroy: function () {
        //cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.backHandlerBtn, this);
    },
    backHandlerBtn: function (event) {
        if (event.keyCode == cc.macro.KEY.back || event.keyCode == cc.macro.KEY.backspace || event.keyCode == cc.macro.KEY.backslash) {
            if (Linker.isLogin) {
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
            } else {
                if (Global.Announcement.AnnouncePrefab && Global.Announcement.GlobalNodePrefab) {
                    var gNode = cc.instantiate(Global.Announcement.GlobalNodePrefab);
                    var gNodeC = gNode.getComponent("GlobalNode");
                    if (gNodeC) {
                        Global.Announcement._addChild(gNode);
                        gNodeC.alert("message_confirm_close_application", G.AT.OK_CANCEL, () => {
                            cc.game.end();
                            Global.Announcement._removeAllChild();
                            Global.Announcement.AnnounceNode.active = false;
                        }, () => {
                            Global.Announcement._removeAllChild();
                            Global.Announcement.AnnounceNode.active = false;
                            cc.log("Huy logout ...");
                        });
                    }
                }
            }
        }
    },

    isLogin: function () {
        return (Linker.isLogin) ? true : false;
    },

    showLobby() {
        this.BidaHomeMid.active = false;
        this.BidaHomeTop.getComponent("BillardHomeTop").showLobby();
        this.BidaHomeBottom.getComponent("BillardHomeBottom").showLobby();
        this.node.active = true;
    },

    hideLobby() {
        this.BidaHomeMid.active = true;
        this.BidaHomeTop.getComponent("BillardHomeTop").hideLobby();
        this.BidaHomeBottom.getComponent("BillardHomeBottom").hideLobby();
    },

    onChangeAvatar(event) {
        this.BidaHomeTop.getComponent("BillardHomeTop").setAvatarAsId(Linker.userData.avatar);
    },

    onChangeName(event) {
        this.BidaHomeTop.getComponent("BillardHomeTop").setUserName(Linker.userData.displayName);
    }
});
