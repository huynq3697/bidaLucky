var BiDaConstant = require('BiDaConstant');
var Utils = require('Utils');
cc.Class({
    extends: cc.Component,

    properties: {
        settingPrefab: cc.Prefab,
        giftCodePrefab: cc.Prefab,
        guidePrefab: cc.Prefab,
        messagePrefab: cc.Prefab,
        friendPrefab: cc.Prefab,
        shopPrefab: cc.Prefab,
        eventPrefab: cc.Prefab,
        profilePrefab: cc.Prefab,
        RankRecharse: cc.Prefab,
        listCuePrefab: cc.Prefab,
        chatZonePrefab: cc.Prefab,
        miniPorkerPrefab: cc.Prefab,
        miniSlotPrefab: cc.Prefab,
        larvaPrefab: cc.Prefab,

        vqmmPrefab: cc.Prefab,
        inviteReceivePrefab: cc.Prefab,
        inviteSendPrefab: cc.Prefab,
        dailyGiftPrefab: cc.Prefab,
        leaderBoardPrefab: cc.Prefab,

        runChoosePlayerPrefab: cc.Prefab,
        popupMiniGame: cc.Prefab,
    },

    ctor() {
        this.BillardPanelUserInfo = null;
        this.BillardPanelSetting = null;
        this.BillardChatZone = null;
        this.BillardListCue = null;
        this.BillardrankRecharse = null;
        this.InviteReceive = null;
        this.InviteSend = null;
        this.DailyGift = null;
        this.LeaderBoard = null;
        this.BillardLuckyWheel = null;
        this.MiniGamePopup = null;
    },

    onLoad() {
        if (this.node.getChildByName("BillardPanelUserInfo")) {
            this.BillardPanelUserInfo = this.node.getChildByName("BillardPanelUserInfo");
        }
    },
    onEnable: function () {

    },

    onDisable: function () {
        this.node.children.forEach(item => {
            if (item.active) {
                item.active = false;
            }
        })
    },

    init: function () {
        this.node.active = false;
    },
    showSettingPopup: function () {
        this.node.active = true;
        if (this.BillardPanelSetting) {
            this.BillardPanelSetting.active = true;
        } else {
            var setting = cc.instantiate(this.settingPrefab);
            this.node.addChild(setting);
            this.BillardPanelSetting = setting;
        }
        this.showPopup(this.BillardPanelSetting);
        this.resortMaxZindex(this.BillardPanelSetting);
    },
    showListCuePopup: function () {
        this.node.active = true;

        var node = this.node.getChildByName("BillardListCue");
        if (!node) {
            node = cc.instantiate(this.listCuePrefab);
            this.node.addChild(node, cc.macro.MAX_ZINDEX);
        } else {
            node.active = true;
        }
        this.showPopup(node);
        this.resortMaxZindex(node);
    },
    showRankRecharse: function () {
        this.node.active = true;
        if (this.BillardrankRecharse) {
            this.BillardrankRecharse.active = true;
        } else {
            var RankRecharse = cc.instantiate(this.RankRecharse);
            this.node.addChild(RankRecharse);
            this.BillardrankRecharse = RankRecharse;
        }
        this.BillardrankRecharse.getComponent("BillardsRankRecharse").getDataListRank(2);
        this.showPopup(this.BillardrankRecharse);
        this.resortMaxZindex(this.BillardrankRecharse);
    },
    showUserInfoPopup: function (event) {
        if (event) {

            var dataUser = event.dataUser
            var id = event.userID;
            this.node.active = true;
            if (this.BillardPanelUserInfo && cc.isValid(this.BillardPanelUserInfo)) {
                this.BillardPanelUserInfo.active = true;
            } else {
                this.BillardPanelUserInfo = cc.instantiate(this.profilePrefab);
                this.node.addChild(this.BillardPanelUserInfo, cc.macro.MAX_ZINDEX);
            }
            this.BillardPanelUserInfo.zIndex = cc.macro.MAX_ZINDEX;
            var BillardPanelUserInfoJS = this.BillardPanelUserInfo.getComponent("BillardPanelUserInfo");
            BillardPanelUserInfoJS.requestDataUser(id);
            BillardPanelUserInfoJS.setCloseButtonHavior({
                isFriendZoneTab: event.isFriendZoneTab,
                isFindFriendTab: event.isFindFriendTab
            });
            !!dataUser && BillardPanelUserInfoJS.updateDataUserOther(dataUser);
            this.showPopup(this.BillardPanelUserInfo);
            this.resortMaxZindex(this.BillardPanelUserInfo);
        }

    },
    showChatPopup: function () {
        this.node.active = true;
        if (this.BillardChatZone) {
            this.BillardChatZone.active = true;
        } else {
            var chatZone = cc.instantiate(this.chatZonePrefab);
            chatZone.active = true;
            this.node.addChild(chatZone);
            this.BillardChatZone = chatZone;
        }
        this.showPopup(this.BillardChatZone);
        this.resortMaxZindex(this.BillardChatZone);
        this.closeFriendPopup();
    },
    resortMaxZindex: function (node) {
        this.node.sortAllChildren();
        var index = this.node.children.length - 1;
        var zIndexMax = 0;
        if (index < 0) {
            zIndexMax = 0;
        } else {
            zIndexMax = this.node.children[index].zIndex + 1;
        }
        if (zIndexMax > cc.macro.MAX_ZINDEX) {
            zIndexMax = cc.macro.MAX_ZINDEX;
            if (index >= 0) {
                this.node.children[index].zIndex = zIndexMax - 1;
            }
        }
        node.zIndex = zIndexMax;
    },
    showGiftCodePopup: function () {
        this.node.active = true;

        var node = this.node.getChildByName("GiftCode");
        if (!node) {
            node = cc.instantiate(this.giftCodePrefab);
            this.node.addChild(node, cc.macro.MAX_ZINDEX);
        } else {
            node.active = true;
        }
        this.showPopup(node);
        this.resortMaxZindex(node);
    },
    showMessagePopup: function () {
        this.node.active = true;
        var node = this.node.getChildByName("Message");
        if (!node) {
            node = cc.instantiate(this.messagePrefab);
            this.node.addChild(node, cc.macro.MAX_ZINDEX);
        } else {
            node.active = true;
        }
        this.showPopup(node);
        this.resortMaxZindex(node);
    },
    showGuidePopup: function () {
        this.node.active = true;
        var node = this.node.getChildByName("Guide");
        if (!node) {
            node = cc.instantiate(this.guidePrefab);
            this.node.addChild(node, cc.macro.MAX_ZINDEX);
        } else {
            node.active = true;
        }
        this.showPopup(node);
        this.resortMaxZindex(node);
    },
    showEventPopup: function () {
        this.node.active = true;
        var node = this.node.getChildByName("sukienDialogV2");
        if (!node) {
            node = cc.instantiate(this.eventPrefab);
            this.node.addChild(node, cc.macro.MAX_ZINDEX);
        } else {
            node.active = true;
            var sks = node.getComponent("sukienDialogV2");
            sks.init();
            sks.configPopup({
                data: {
                    currentGameId: sks.currentGameId,
                    currentTabId: 0
                }
            });
            sks.launchSukien();
        }
        this.showPopup(node);
        this.resortMaxZindex(node);
    },
    showFriendPopup: function () {
        this.node.active = true;
        var node = this.node.getChildByName("FriendsZone");
        if (!node) {
            node = cc.instantiate(this.friendPrefab);
            this.node.addChild(node, cc.macro.MAX_ZINDEX);
        } else {
            node.active = true;
            var friendContainer = node.getChildByName("FriendContainer");
            if (friendContainer) {
                friendContainer.getChildByName("FriendsList").active = true;
                node.getComponent("FriendsZone").requestListFriendByPage(1);
            }

        }
        this.showPopup(node);
        this.resortMaxZindex(node);
    },
    showFindFriendTab: function () {
        var friendZoneNode = this.node.getChildByName("FriendsZone");
        if (friendZoneNode) {
            var friendContainer = node.getChildByName("FriendContainer");
            if (friendContainer) {
                friendContainer.getChildByName("FriendsList").active = true;
                friendContainer.getChildByName("AddFriends").active = true;
            }
        }
    },
    showInviteFriendTab: function () {
        var friendZoneNode = this.node.getChildByName("FriendsZone");
        if (friendZoneNode) {
            var friendContainer = node.getChildByName("FriendContainer");
            if (friendContainer) {
                friendContainer.getChildByName("FriendsList").active = true;
                friendContainer.getChildByName("SendFriends").active = true;
            }
        }
    },
    showMiniGamePopup() {
        this.node.active = true;
        if (this.MiniGamePopup && cc.isValid(this.MiniGamePopup)) {
            this.MiniGamePopup.active = true;
        } else {
            var popup = cc.instantiate(this.popupMiniGame);
            this.node.addChild(popup);
            this.MiniGamePopup = popup;
            this.MiniGamePopup.position = cc.v2(0, 0);
        }
        // var widgetBlockEventNode = this.MiniGamePopup.getChildByName("bg")
        // if (widgetBlockEventNode && cc.isValid(widgetBlockEventNode)) {
        //     var canvas = cc.find("Canvas");
        //     if (canvas) {
        //         var _wiget = widgetBlockEventNode.getComponent(cc.Widget);
        //         if (!_wiget) {
        //             _wiget = widgetBlockEventNode.addComponent(cc.Widget);
        //         }
        //         _wiget.enabled = true;
        //         _wiget.isAlignLeft = true;
        //         _wiget.isAlignRight = true;
        //         _wiget.isAlignTop = true;
        //         _wiget.isAlignBottom = true;
        //         _wiget.target = canvas;
        //         _wiget.top = 0;
        //         _wiget.bottom = 0;
        //         _wiget.left = 0;
        //         _wiget.right = 0;
        //     }
        // }
        this.showPopup(this.MiniGamePopup);
        this.resortMaxZindex(this.MiniGamePopup);
    },
    closeFriendPopup: function () {
        var node = this.node.getChildByName("FriendsZone");
        if (node) {
            node.getComponent("FriendsZone").onCloseNode();
        }

    },
    showShopPopup: function () {
        this.node.active = true;
        var node = this.node.getChildByName("Shop");
        if (!node) {
            node = cc.instantiate(this.shopPrefab);
            node.position = cc.v2(0, 0);
            node.active = true;
            this.node.addChild(node, cc.macro.MAX_ZINDEX);
        } else {
            node.active = true;
        }
        this.showPopup(node);
        this.resortMaxZindex(node);
    },
    showVQMMPopup: function () {
        this.node.active = true;
        if (!this.BillardLuckyWheel) {
            var node = cc.instantiate(this.vqmmPrefab);
            node.position = cc.v2(0, 0);
            node.active = true;
            this.node.addChild(node);
            this.BillardLuckyWheel = node;
        } else {
            this.BillardLuckyWheel.active = true;
        }
        this.showPopup(this.BillardLuckyWheel);
        this.resortMaxZindex(this.BillardLuckyWheel);
    },

    showInvitePopup(data) {
        this.node.active = true;
        if (this.InviteReceive) {
            this.InviteReceive.active = true;
        } else {
            var inviteReceive = cc.instantiate(this.inviteReceivePrefab);
            inviteReceive.active = true;
            this.node.addChild(inviteReceive);
            this.InviteReceive = inviteReceive;
        }
        this.InviteReceive.getComponent(require("InviteReceiverDialog")).init(data);
        this.showPopup(this.InviteReceive);
        this.resortMaxZindex(this.InviteReceive);
    },
    showPopup: function (node) {
        for (let i = 0; i < this.node.children.length; i++) {
            var c = this.node.children[i];
            if (c == node) {
                c.active = true;
            } else {
                c.active = false;
            }
        }
    },
    showSendInvitePopup() {
        this.node.active = true;
        if (this.InviteSend) {
            this.InviteSend.active = true;
        } else {
            var inviteSend = cc.instantiate(this.inviteSendPrefab);
            inviteSend.active = true;
            this.node.addChild(inviteSend);
            this.InviteSend = inviteSend;
        }
        this.showPopup(this.InviteSend);
        this.resortMaxZindex(this.InviteSend);
    },

    showDailyGift() {
        this.node.active = true;
        if (this.DailyGift) {
            this.DailyGift.active = true;
        } else {
            var dailyGift = cc.instantiate(this.dailyGiftPrefab);
            this.node.addChild(dailyGift);
            this.DailyGift = dailyGift;
            this.DailyGift.active = true;
        }
        this.showPopup(this.DailyGift);
        this.resortMaxZindex(this.DailyGift);
        this.closeFriendPopup();
    },

    showLeaderboard() {
        this.node.active = true;
        if (this.LeaderBoard) {
            this.LeaderBoard.active = true;
        } else {
            var leaderBoard = cc.instantiate(this.leaderBoardPrefab);
            leaderBoard.active = true;
            this.node.addChild(leaderBoard);
            this.LeaderBoard = leaderBoard;
        }
        this.showPopup(this.LeaderBoard);
        this.resortMaxZindex(this.LeaderBoard);
    },

    showMiniPorker: function () {
        this.node.active = true;
        var node = this.node.getChildByName("MiniPoker");
        if (!node) {
            node = cc.instantiate(this.miniPorkerPrefab);
            this.node.addChild(node, cc.macro.MAX_ZINDEX);
        } else {
            node.active = true;
        }
        this.showPopup(node);
        this.resortMaxZindex(node);
    },

    showMiniSlot: function () {
        this.node.active = true;
        var node = this.node.getChildByName("MiniSlot");
        if (!node) {
            node = cc.instantiate(this.miniSlotPrefab);
            this.node.addChild(node, cc.macro.MAX_ZINDEX);
        } else {
            node.active = true;
        }
        this.showPopup(node);
        this.resortMaxZindex(node);
    },

    showLarva: function () {
        this.node.active = true;
        var node = this.node.getChildByName("Larva");
        if (!node) {
            node = cc.instantiate(this.larvaPrefab);
            this.node.addChild(node, cc.macro.MAX_ZINDEX);
        } else {
            node.active = true;
        }
        this.showPopup(node);
        this.resortMaxZindex(node);
    },

    setUserMoney: function (event) {
        if (event.hasOwnProperty("usermoney")) {
            // this.BillardPanelUserInfo.getComponent("BillardPanelUserInfo").setUserMoney(event.usermoney);
        }
    },
    setUserExp: function (event) {
        if (event.hasOwnProperty("userexp")) {
            // this.BillardPanelUserInfo.getComponent("BillardPanelUserInfo").setUserExp(event.userexp);
        }
    },
    setUserId: function (event) {
        if (event.hasOwnProperty("userid")) {
            // this.BillardPanelUserInfo.getComponent("BillardPanelUserInfo").setUserID(event.userid);
        }
    },
    setUserName: function (event) {
        if (event.hasOwnProperty("username")) {
            // this.BillardPanelUserInfo.getComponent("BillardPanelUserInfo").setUserName(event.username);
        }
    },
    setUserAvatarAsFrame: function (event) {
        if (event.hasOwnProperty("useravatarframe")) {
            // this.BillardPanelUserInfo.getComponent("BillardPanelUserInfo").setAvatarAsSpriteFrame(event.useravatarframe);
        }
    },
    setUserLevel: function (event) {
        if (event.hasOwnProperty("userlevel")) {
            // this.BillardPanelUserInfo.getComponent("BillardPanelUserInfo").setUserLevel(event.userlevel);
        }
    },

    onLogout() {
        this.BillardPanelUserInfo = null;
        this.BillardPanelSetting = null;
        this.BillardChatZone = null;
        this.BillardListCue = null;
        this.BillardrankRecharse = null;
        this.InviteReceive = null;
        this.InviteSend = null;
        this.DailyGift = null;
        this.LeaderBoard = null;
        this.BillardLuckyWheel = null;
        this.MiniGamePopup = null;
    },

    onClickPlayOffline() {
        Utils.Malicious.removeNodeByNameFromParent("TestSwitchPlayer", this.node);
        this.node.active = true;
        var test = cc.instantiate(this.runChoosePlayerPrefab);
        this.node.addChild(test);
        test.active = true;
        //run
        var linhTinhComponent = test.getComponent("LinhTinh");
        if (linhTinhComponent) {
            linhTinhComponent.runRandomPlayerAvatar();
        }
    },



    // update (dt) {},
});
