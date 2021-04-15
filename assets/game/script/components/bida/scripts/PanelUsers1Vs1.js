const BiDaConstant = require('BiDaConstant');
var NewAudioManager = require('NewAudioManager');
var Linker = require('Linker');
cc.Class({
    extends: cc.Component,

    properties: {
        billardPointTo: cc.Node,
        myUserInfo: cc.Node,
        otherUserInfo: cc.Node,
        myBallListDisplay: cc.Node,
        otherBallistDisplay: cc.Node,
        tableIdNode: cc.Node,
        betMoneyNode: cc.Node,
        redPointNode: cc.Node,
        inviteNode: cc.Node,
        inviteButton: cc.Node,
        wifiNode: cc.Node,
        moneyIcon: cc.Node,
        leftTime: cc.Node,
        maxErrorNode: cc.Node,
        titleVS: cc.Node,
        user: [cc.Node],
    },
    start() {
        this.inviteButton.on(cc.Node.EventType.TOUCH_END, this.onClickInvite, this);
        if (Linker.BiDaOfflineController) {
            this.maxErrorNode.parent.active = false;
            this.titleVS.active = true;
        } else {
            this.maxErrorNode.parent.active = true;
            this.titleVS.active = false;
        }
        this.myBallListDisplay.name = "User1";
        this.otherBallistDisplay.name = "User2";
    },
    getMoneyIcon: function () {
        return this.moneyIcon;
    },
    getTableIdNode: function () {
        return this.tableIdNode;
    },
    getBetMoneyNode: function () {
        return this.betMoneyNode;
    },
    getBillardPointTo: function () {
        return this.billardPointTo;
    },
    getWifiSignalNode: function () {
        return this.wifiNode;
    },
    getMyBallListDisplay: function () {
        return this.myBallListDisplay;
    },
    getOtherListDisplay: function () {
        return this.otherBallistDisplay;
    },
    getRedPointNode: function () {
        return this.redPointNode;
    },
    getMyUserInfo: function () {
        return this.myUserInfo;
    },
    getOtherUserInfo: function () {
        return this.otherUserInfo;
    },
    showBtnInvite: function () {
        this.inviteNode.active = true;
    },
    hideBtnInvite: function () {
        this.inviteNode.active = false;
    },
    onClickInvite: function (event) {
        NewAudioManager.playClick();
        this.node.dispatchEvent(new cc.Event.EventCustom(BiDaConstant.POPUP_EVENT.INVITE_SEND.OPEN, true));
    },
    onClickStoreCue: function () {
        NewAudioManager.playClick();
        this.node.dispatchEvent(new cc.Event.EventCustom(BiDaConstant.POPUP_EVENT.LIST_CUE.OPEN, true));
    },
    getWifiSignal: function () {
        return this.wifiNode;
    },

    // update (dt) {},
});
