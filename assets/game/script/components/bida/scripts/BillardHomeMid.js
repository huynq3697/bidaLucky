var Linker = require('Linker');
var BiDaConstant = require('BiDaConstant');
var Global = require("Global2");
var NewAudioManager = require('NewAudioManager');
cc.Class({
    extends: cc.Component,

    properties: {
        zoneIDbtn1: {
            default: BiDaConstant.ZONE_ID.ZONEID_1VS1,
            readonly: true,
        },
        zoneIDbtn2: {
            default: BiDaConstant.ZONE_ID.ZONEID_1VS4,
            readonly: true
        },
        zoneIDbtn3: {
            default: BiDaConstant.ZONE_ID.ZONEID_THACH_DAU,
            readonly: true
        },
        zoneIDbtn4: {
            default: BiDaConstant.ZONE_ID.ZONEID_1VS1,
            readonly: true
        },
        zoneIDbtn5: {
            default: BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM,
            readonly: true
        },
        btnTypeZone1: {
            type: cc.Node,
            default: null,
        },
        btnTypeZone2: {
            type: cc.Node,
            default: null,
        },
        btnTypeZone3: {
            type: cc.Node,
            default: null,
        },
        btnTypeZone4: {
            type: cc.Node,
            default: null,
        },
        btnTypeZone5: {
            type: cc.Node,
            default: null,
        },
        btnPlayWithFriend: {
            type: cc.Node,
            default: null,
        },
        btnMiniGame: {
            type: cc.Node,
            default: null,
        },
        btnTopBestNap: cc.Node,
        btnLeaderBoard: cc.Node,
        scrollView: cc.ScrollView
    },
    ctor: function () {
        this.listPageActive = [];
    },

    start () {
        this.checkConfig(Linker.Config);
        this.listPageActive = this.scrollView.content.children.filter(item => {
            return item.active == true;
        })
    }, 
    onEnable() {
        this.btnTypeZone1.on(cc.Node.EventType.TOUCH_END, this.onHomeMidClick, this);
        this.btnTypeZone2.on(cc.Node.EventType.TOUCH_END, this.onHomeMidClick, this);
        this.btnTypeZone3.on(cc.Node.EventType.TOUCH_END, this.onHomeMidClick, this);
        this.btnTypeZone4.on(cc.Node.EventType.TOUCH_END, this.onHomeMidClick, this);
        this.btnTypeZone5.on(cc.Node.EventType.TOUCH_END, this.onHomeMidClick, this);

        this.btnPlayWithFriend.on(cc.Node.EventType.TOUCH_END, this.onHomeMidClick, this);
        this.btnMiniGame.on(cc.Node.EventType.TOUCH_END, this.onHomeMidClick, this);
        this.btnTopBestNap.on(cc.Node.EventType.TOUCH_END, this.onHomeMidClick, this);
        this.btnLeaderBoard.on(cc.Node.EventType.TOUCH_END, this.onHomeMidClick, this)
        this.scrollView.node.on('scrolling', this.onScrollView, this);
        this.scrollView.node.on('touch-up', this.onTouchUpScrollView, this);
        this.scrollView.node.on("page-turning", this.onPageTurning, this);
        //
        this.left = 0;
        this.right = cc.Canvas.instance.node.width;
        this.minScale = 0.7;
        this.maxScale = 1;
        this.scrollView.content.getComponent(cc.Layout).paddingLeft = 50;
        this.scrollView.content.getComponent(cc.Layout).paddingRight = 50;

        // this.showMenu();
    },
    onHomeMidClick: function (event) {
        NewAudioManager.playClick();
        var target = event.currentTarget;
        if (target) {
            if (target === this.btnTypeZone1) {
                var customEvent = new cc.Event.EventCustom(BiDaConstant.GAME_LOBBY_EVENT.REQUEST_LOBBY_FOR_ZONE_ID_TYPE, true);
                customEvent.ZONE = this.zoneIDbtn1;
                customEvent.currentButton = this.btnTypeZone1;
                this.node.dispatchEvent(customEvent);

            } else if (target === this.btnTypeZone2) {
                var customEvent = new cc.Event.EventCustom(BiDaConstant.GAME_LOBBY_EVENT.REQUEST_LOBBY_FOR_ZONE_ID_TYPE, true);
                customEvent.ZONE = this.zoneIDbtn2;
                customEvent.currentButton = this.btnTypeZone2;
                this.node.dispatchEvent(customEvent);

            } else if (target === this.btnTypeZone3) {
                var customEvent = new cc.Event.EventCustom(BiDaConstant.GAME_LOBBY_EVENT.REQUEST_LOBBY_FOR_ZONE_ID_TYPE, true);
                customEvent.ZONE = this.zoneIDbtn3;
                customEvent.currentButton = this.btnTypeZone3;
                this.node.dispatchEvent(customEvent);

            } else if (target === this.btnTypeZone4) {
                var customEvent = new cc.Event.EventCustom(BiDaConstant.BUTTON_EVENT.PLAY_OFFLINE_CLICK, true);
                this.node.dispatchEvent(customEvent);
            } else if (target === this.btnTypeZone5) {
                var customEvent = new cc.Event.EventCustom(BiDaConstant.GAME_LOBBY_EVENT.REQUEST_LOBBY_FOR_ZONE_ID_TYPE, true);
                customEvent.ZONE = this.zoneIDbtn5;
                customEvent.currentButton = this.btnTypeZone5;
                this.node.dispatchEvent(customEvent);

            } else if (target === this.btnPlayWithFriend) {
                var customEvent = new cc.Event.EventCustom(BiDaConstant.GAME_LOBBY_EVENT.CREATE_TABLE_UI_PLAY_WITH_FRIEND, true);
                customEvent.currentButton = this.btnPlayWithFriend;
                this.node.dispatchEvent(customEvent);
            } else if (target === this.btnTopBestNap) {
                var customEvent = new cc.Event.EventCustom(BiDaConstant.POPUP_EVENT.RANK_RECHARSE.OPEN, true);
                this.node.dispatchEvent(customEvent);
            } else if (target === this.btnLeaderBoard) {
                var customEvent = new cc.Event.EventCustom(BiDaConstant.POPUP_EVENT.LEADERBOARD.OPEN, true);
                this.node.dispatchEvent(customEvent);
            } else if (target == this.btnMiniGame) {
                var customEvent = new cc.Event.EventCustom(BiDaConstant.POPUP_EVENT.MINIGAME.OPEN, true);
                this.node.dispatchEvent(customEvent);
            }
            cc.log("Whoa", event);
        }
    },
    checkConfig(config) {
        this.btnTypeZone2.parent.active = config.isBida14;
    },

    onScrollView(event) {
        var left = this.left;
        var right = this.right;
        var minScale = this.minScale;
        var maxScale = this.maxScale;
        var rangeScale = maxScale - minScale;
        // var pos = event.content.children[0].parent.convertToWorldSpaceAR(event.content.children[0].position);
        var childs = event.content.children;
        for (let i = 0; i < childs.length; i++) {
            var pos = childs[i].parent.convertToWorldSpaceAR(childs[i].position);
            var width = childs[i].width;
            var minX = pos.x - width / 2;
            var maxX = pos.x + width / 2;
            if (left < minX && maxX < right) {
                childs[i].setScale(maxScale);
            } else if ((minX < left && maxX < left) || (right < minX && right < maxX)) {
                childs[i].setScale(minScale);
            } else if (minX < left && left < maxX) {
                var ratio = (maxX - left) / (maxX - minX);
                var scale = rangeScale * ratio + minScale;
                childs[i].setScale(scale);
            } else if (minX < right && right < maxX) {
                var ratio = (right - minX) / (maxX - minX);
                var scale = rangeScale * ratio + minScale;
                childs[i].setScale(scale);
            }
            // if (childs[i].scale == 1) {
            //     childs[i].getChildByName('block').active = false;
            // } else {
            //     childs[i].getChildByName('block').active = true;
            // }
        }
    },

    onPageTurning: function(event) {
        if (event.getCurrentPageIndex() > this.listPageActive.length - 4) {
            event.scrollToPage(this.listPageActive.length - 4);
        }
    },

    showMenu: function () {
        if (Linker.Config) {
            this.btnTypeZone2.parent.active = Linker.Config.isBida14 === 1 ? true : false;
        }
    },

    onTouchUpScrollView(event) {
        // this.scheduleOnce(function () {
        //     var childs = event.content.children;
        //     for (let i = 0; i < childs.length; i++) {
        //         childs[i].setScale(1);
        //     }
        // }, 1.5);
    }
    // update (dt) {},
});
