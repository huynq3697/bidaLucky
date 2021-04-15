var BiDaConstant = require('BiDaConstant');
var NewAudioManager = require('NewAudioManager');
var Linker = require('Linker');
var LobbySend = require('LobbySend');
var CommonSend = require('CommonSend');
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
        btn1vs1: cc.Node,
        btn1vs4: cc.Node,
        contentNode: cc.Node,
        listBetButton: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    onEnable() {
        var closeBtn = null;
        var contentNode = this.node.parent;
        var closeParent = null;
        if (contentNode && cc.isValid(contentNode)) {
            closeParent = contentNode.parent;
        }
        if (closeParent && cc.isValid(closeParent)) {
            closeBtn = closeParent.getChildByName("close");
            if (closeBtn && cc.isValid(closeBtn)) {
                closeBtn.opacity = 0;
            }
        }
        this.showChild(["zone_button", "bg"]);
        this.btn1vs1.on(cc.Node.EventType.TOUCH_END, this.onClickBtn, this);
        this.btn1vs4.on(cc.Node.EventType.TOUCH_END, this.onClickBtn, this);
        this.contentNode.y = -1 * this.node.height * this.contentNode.anchorY - this.contentNode.height * this.contentNode.anchorY;
        var tweenOpen = cc.tween().by(0.5, { y: this.contentNode.height }, { easing: "sineIn" }).call(() => {
            if (closeBtn) {
                closeBtn.active = true;
                closeBtn.stopAllActions();
                closeBtn.runAction(cc.fadeIn(0.5));
            }
        });
        tweenOpen.clone(this.contentNode).start();
    },
    initListBtnBet: function (listArrBet) {
        var content = this.node.getChildByName("content");
        if (content && cc.isValid(content)) {
            this.listBetButton.opacity = 0;
            this.listBetButton.active = true;
            this.listBetButton.stopAllActions();
            this.listBetButton.removeAllChildren(true);
            var _listContentComponent = this.listBetButton.getComponent("PopupBetButton");
            if (_listContentComponent && cc.isValid(_listContentComponent)) {
                _listContentComponent.initListBtnBet(listArrBet);
                this.showChild(["bg", "close", "petScrollView"]);
                this.listBetButton.runAction(cc.fadeIn(0.5));
            }
        }
    },
    onClickBtn(event) {
        NewAudioManager.playClick();
        var target = event.currentTarget;
        if (target) {
            var isCheck = false;
            var customEvent = null;
            if (target === this.btn1vs1) {
                isCheck = true;
                customEvent = new cc.Event.EventCustom(BiDaConstant.GAME_COMMONS_EVENT.CREATE_TABLE_1V1_PLAYERS, true);
                Linker.ZONE = this.zoneIDbtn1;
                customEvent.ZONE = this.zoneIDbtn1;
                customEvent.currentButton = this.btn1vs1;
            } else if (target === this.btn1vs4) {
                isCheck = true;
                customEvent = new cc.Event.EventCustom(BiDaConstant.GAME_COMMONS_EVENT.CREATE_TABLE_1V4_PLAYERS, true);
                Linker.ZONE = this.zoneIDbtn2;
                customEvent.ZONE = this.zoneIDbtn2;
                customEvent.currentButton = this.btn1vs4;
            }
            if (isCheck && Linker.ZONE != BiDaConstant.ZONE_ID.ZONEID_BIDA_LUCKY_SHOT && customEvent) {
                var sendData = CommonSend.joinZone(Linker.ZONE, 0);
                Linker.Socket.send(sendData);
                this.node.dispatchEvent(customEvent);
            }
            this.showChild(["bg", "close"]);
        }

    },
    showChild: function (names) {
        var content = this.node.getChildByName("content");
        if (content && cc.isValid(content)) {
            var showAll = false;
            if (name && names.length == 0) {
                showAll = false
            }
            for (let i = 0; i < content.children.length; i++) {
                var c = content.children[i];
                var name = c.name;
                if (c && cc.isValid(c)) {
                    if (showAll) {
                        c.active = true;
                    } else {
                        if (names.indexOf(name) != -1) {
                            c.active = true;
                        } else {
                            c.active = false;
                        }
                    }
                }
            }
        }
    },
    start() {

    },

    // update (dt) {},

    buttonEventHandler(button, customEventData) {
        switch (customEventData) {
            case 'close': {
                var self = this;
                var tweenClose = cc.tween().by(0.5, { y: -this.contentNode.height }, { easing: "sineOut" }).call(() => {
                    self.node.active = false;
                });
                tweenClose.clone(this.contentNode).start();
                break;
            }
        }
    }
});
