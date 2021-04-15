var BiDaConstant = require('BiDaConstant');
var Linker = require('Linker');
var NewAudioManager = require('NewAudioManager');
cc.Class({
    extends: cc.Component,

    properties: {
        miniPorkerBtn: cc.Node,
        miniSlotBtn: cc.Node,
        larvaBtn: cc.Node,
        luckyShotBtn: cc.Node,
        xoSoBtn: cc.Node,
        contentNode: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.initXoSoNodePool();
    },

    onEnable() {
        this.contentNode.y = -1 * this.node.height * this.contentNode.anchorY - this.contentNode.height * this.contentNode.anchorY;
        var tweenOpen = cc.tween().by(0.5, {
            y: this.contentNode.height
        }, {
            easing: "sineIn"
        });
        tweenOpen.clone(this.contentNode).start();
        this.addEventCustomListener();
        this.showMiniGame();
    },

    onDestroy() {
        cc.log("Destroy");
    },

    addEventCustomListener: function () {
        this.miniPorkerBtn.on(cc.Node.EventType.TOUCH_END, this.onMiniGameClick, this);
        this.miniSlotBtn.on(cc.Node.EventType.TOUCH_END, this.onMiniGameClick, this);
        this.larvaBtn.on(cc.Node.EventType.TOUCH_END, this.onMiniGameClick, this);
        this.luckyShotBtn.on(cc.Node.EventType.TOUCH_END, this.onMiniGameClick, this);
        this.xoSoBtn.on(cc.Node.EventType.TOUCH_END, this.onMiniGameClick, this);
    },

    onMiniGameClick: function (event) {
        NewAudioManager.playClick();
        var target = event.currentTarget;
        if (target) {
            if (target === this.miniPorkerBtn) {
                var customEvent = new cc.Event.EventCustom(BiDaConstant.POPUP_EVENT.MINI_PORKER.OPEN, true);
                this.node.dispatchEvent(customEvent);
            } else if (target === this.miniSlotBtn) {
                var customEvent = new cc.Event.EventCustom(BiDaConstant.POPUP_EVENT.MINI_SLOT.OPEN, true);
                this.node.dispatchEvent(customEvent);
            } else if (target === this.larvaBtn) {
                var customEvent = new cc.Event.EventCustom(BiDaConstant.POPUP_EVENT.LARVA.OPEN, true);
                this.node.dispatchEvent(customEvent);
            } else if (target === this.luckyShotBtn) {
                Linker.ZONE = BiDaConstant.ZONE_ID.ZONEID_BIDA_LUCKY_SHOT;
                cc.log("Mode play lucky shot activated ...");
                var customEvent = new cc.Event.EventCustom(BiDaConstant.GAME_LOBBY_EVENT.CREATE_TABLE_UI_WITH_MODE_LUCKYSHOT_PLAYERS, true);
                customEvent.isLuckyShot = true;
                this.node.dispatchEvent(customEvent);
                // cc.director.loadScene("LuckyShot", function() {
                //     cc.Global.hideLoading();
                // })
            } else if (target === this.xoSoBtn) {
                this.onClickXoSo();
                this.node.active = false;
            }
        }
    },

    // update (dt) {},
    onClickClose() {
        cc.Global.ZONE_GAME = 0;
        var self = this;
        var tweenClose = cc.tween().by(0.5, {
            y: -this.contentNode.height
        }, {
            easing: "sineOut"
        }).call(() => {
            self.node.active = false;
        });
        tweenClose.clone(this.contentNode).start();
    },

    showMiniGame() {
        var configMiniGame = JSON.parse(cc.sys.localStorage.getItem("rubvip_configHost"));
        // 1 la show, 0 la hide
        // configMiniGame.isSlot777 = 1;
        var content = this.node.getChildByName("content");
        content.getChildByName("MiniPokerEntry").active = configMiniGame.isMiniPoker === 1 ? true : false;
        content.getChildByName("Slot777Entry").active = configMiniGame.isSlot777 === 1 ? true : false;
        content.getChildByName("Slot8BallEntry").active = configMiniGame.isSlot8Ball === 1 ? true : false;
        content.getChildByName("LuckyShotEntry").active = configMiniGame.isLuckyShot === 1 ? true : false;
        Linker.gameLanguage=="vi"? content.getChildByName("XoSoEntry").active = true : content.getChildByName("XoSoEntry").active = false;
        content.getChildByName("XoSoEntry").active = configMiniGame.isxoso === 1 ? true : false;

        var activeTrue = 0;
        for (var i = 0; i < content.childrenCount; ++i) {
            if (content.children[i].active === true)
                ++activeTrue;
        }

        switch (activeTrue) {
            case 1:
                content.getComponent(cc.Layout).paddingLeft = 540;
                content.getComponent(cc.Layout).spacingX = 0;
                break;
            case 2:
                content.getComponent(cc.Layout).paddingLeft = 300;
                content.getComponent(cc.Layout).spacingX = 300;
                break;
            case 3:
                content.getComponent(cc.Layout).paddingLeft = 140;
                content.getComponent(cc.Layout).spacingX = 200;
                break;
            case 4:
                content.getComponent(cc.Layout).paddingLeft = 80;
                content.getComponent(cc.Layout).spacingX = 100;
                break;

            case 4:
                content.getComponent(cc.Layout).paddingLeft = 50;
                content.getComponent(cc.Layout).spacingX = 35;
                break;
            default:
                break;
        }
    },

    initXoSoNodePool: function () {
        this.xosoGameNodePool = new cc.NodePool();
    },

    onClickXoSo: function () {
        //load prefab
        var xosoNode = this.node.parent.getChildByName("Xo_So");
        if (!Linker.XoSoObj || (Linker.XoSoObj && !Linker.XoSoObj.isValid) || !xosoNode) {
            cc.Global.showLoading();
            cc.resources.load("xoso/Xo_So", cc.Prefab, function (completedCount, totalCount, item) {
                Linker.XoSoObj = null;
            }.bind(this), function (error, prefab) {
                cc.Global.hideLoading();
                if (!error) {
                    Linker.XoSoObj = cc.instantiate(prefab);
                    this.xosoGameNodePool.put(Linker.XoSoObj);
                    this.resetTimerXoSo();
                    cc.find("Canvas/BillardPortalHandler/BillardUICommonLayer").addChild(Linker.XoSoObj);
                    Linker.XoSoObj.zIndex = cc.macro.MAX_ZINDEX - 1;
                    Linker.XoSoView.initNodePoolTab(function (err, data) {
                        if (!err) {
                            Linker.XoSoView.init();
                            cc.Global.hideLoading();
                        } else {
                            // //cc.error("Khong load duoc cac componet trong game xo so number choose, xo so result, xo so vinh danh, xo so huong dan ...");
                        }
                    });
                } else {
                    // //cc.error("Khong load duoc game xo so ...");
                }
            }.bind(this));
        } else {
            Linker.XoSoObj.active = true;
        }
    },

    resetTimerXoSo: function () {
        Linker.timeLeftXoSo = 0;
        var timeNode = this.xoSoBtn.getChildByName("timer");
        var hn = timeNode.getChildByName("hlabel");
        var mn = timeNode.getChildByName("mlabel");
        var sn = timeNode.getChildByName("slabel");

        var h = hn.getComponent(cc.Label);
        var m = mn.getComponent(cc.Label);
        var s = sn.getComponent(cc.Label);

        h.string = "..";
        m.string = "..";
        s.string = "..";
    },
});