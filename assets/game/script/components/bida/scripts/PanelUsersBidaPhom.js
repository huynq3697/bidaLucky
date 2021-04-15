const BiDaConstant = require('BiDaConstant');
var Linker = require('Linker');
var NewAudioManager = require('NewAudioManager');
cc.Class({
    extends: cc.Component,

    properties: {
        billardPointTo: cc.Node,
        myUserInfo: cc.Node,
        rankingUserInfo: [cc.Node],
        myBallListDisplay: cc.Node,
        myBallListContainer: cc.Node,
        tableIdNode: cc.Node,
        betMoneyNode: cc.Node,
        redPointNode: cc.Node,
        wifiNode: cc.Node,
        moneyIcon: cc.Node,
        btnInvite: cc.Node,
        leftTime: cc.Node,
        maxErrorNode: cc.Node,
    },
    start() {
        this.myBallListDisplay.active = false;
        this.myBallListContainer.active = false;
    },
    showBtnInvite: function () {
        this.btnInvite.active = true;
    },

    hideBtnInvite: function () {
        this.btnInvite.active = false;
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
    getRankingUserInfo: function () {
        return this.rankingUserInfo;
    },
    getRedPointNode: function (params) {
        return this.redPointNode;
    },
    getMyUserInfo: function () {
        return this.myUserInfo;
    },
    getWifiSignal: function () {
        return this.wifiNode;
    },
    onClickStoreCue: function () {
        NewAudioManager.playClick();
        this.node.dispatchEvent(new cc.Event.EventCustom(BiDaConstant.POPUP_EVENT.LIST_CUE.OPEN, true));
    },
    onClickInvite: function () {
        NewAudioManager.playClick();
        this.node.dispatchEvent(new cc.Event.EventCustom(BiDaConstant.POPUP_EVENT.INVITE_SEND.OPEN, true));
    }
    // update (dt) {},
});
