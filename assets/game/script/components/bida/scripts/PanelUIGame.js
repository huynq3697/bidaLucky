var BiDaConstant = require('BiDaConstant');
var NewAudioManager = require('NewAudioManager');
var Linker = require('Linker');
var Utils = require('Utils');
var Global = require('Global');
var PanelUIGame = cc.Class({
    extends: cc.Component,

    properties: {
        PanelMenuPrefab: cc.Prefab,
        PanelPlayerViewPrefab: cc.Prefab,
        ChatPrivatePrefab: cc.Prefab,
        inGameMessagePrefab: cc.Prefab
    },
    onLoad: function () {
        // this.addCustomEventListener();
    },
    onEnable: function () {
        // this.initPanelMenu();
        // this.initPopupChat();
        // this.initPanelPlayerView();
        this.initInGameMessage();
    },
    onDisable: function () {
    },
    addCustomEventListener: function () {
        this.node.on(BiDaConstant.POPUP_EVENT.PANEL_MENU.OPEN, this.showMenuPopUP, this);
        this.node.on(BiDaConstant.POPUP_EVENT.PANEL_MENU.CLOSE, this.hideMenuPopup, this);
        //
        this.node.on(BiDaConstant.POPUP_EVENT.PANEL_PLAYER_VIEW.OPEN, this.showPanelPlayerView, this);
        this.node.on(BiDaConstant.POPUP_EVENT.PANEL_PLAYER_VIEW.CLOSE, this.hidePanelPlayerView, this);
    },
    initPanelMenu: function () {
        if (!this.PanelMenu || (this.PanelMenu && !this.PanelMenu.isValid)) {
            this.PanelMenu = cc.instantiate(this.PanelMenuPrefab);
            this.node.addChild(this.PanelMenu);
        }
        this.PanelMenu.active = false;
    },
    initPopupChat: function () {
        if (!this.ChatPrivate || (this.ChatPrivate && !this.ChatPrivate.isValid)) {
            this.ChatPrivate = cc.instantiate(this.ChatPrivatePrefab);
            // this.ChatPrivate.setPosition(this.node.width,0);
            this.node.addChild(this.ChatPrivate);
        }
        this.ChatPrivate.active = false;
    },
    initPanelPlayerView: function () {
        if (!this.PanelPlayerView || (this.PanelPlayerView && !this.PanelPlayerView.isValid)) {
            this.PanelPlayerView = cc.instantiate(this.PanelPlayerViewPrefab);
            this.PanelPlayerView.getComponent("PanelPlayerView").resetContentNode();
            this.node.addChild(this.PanelPlayerView);
        }
        this.PanelPlayerView.active = false;
    },
    initInGameMessage: function () {
        if (!this.inGameMessage || (this.inGameMessage && !this.inGameMessage.isValid)) {
            this.inGameMessage = cc.instantiate(this.inGameMessagePrefab);
            this.inGameMessage.active = false;
            this.node.addChild(this.inGameMessage);
        } else {
            cc.log("Lỗi không hiển thị được message trong bàn chơi...", this.inGameMessage);
        }
    },
    getPanelMenu: function () {
        this.initPanelMenu();
        return this.PanelMenu;
    },
    getIconInvites: function () {
        var btnFriendNode = this.getFriendMenuButton();
        if (btnFriendNode) {
            var iconInvite = btnFriendNode.iconInvite;
            if (iconInvite && cc.isValid(iconInvite)) {
                return iconInvite;
            }
        }
    },
    addIconInvites: function () {
        var btnFriendNode = this.getFriendMenuButton();
        if (btnFriendNode) {
            var x = btnFriendNode.width * 0.45;
            var y = btnFriendNode.height * 0.25;
            Utils.Malicious.addIconInvites({ btnParent: btnFriendNode, position: cc.v2(x, y) }, function (err, containerIcon) {
                if (!err) {
                    // containerIcon.opacity = 255;
                } else {
                    cc.log("khong the them menu icon red friend noti", err, containerIcon);
                }
            }.bind(this));
        }
    },
    getFriendMenuButton: function () {
        this.getPanelMenu();
        if (this.PanelMenu && cc.isValid(this.PanelMenu)) {
            var _panelMenuScript = this.PanelMenu.getComponent("PanelMenu");
            if (_panelMenuScript && cc.isValid(_panelMenuScript)) {
                var btnFriendNode = _panelMenuScript.btnBanBe;
                if (btnFriendNode && cc.isValid(btnFriendNode)) {
                    return btnFriendNode;
                }
            }
        }
    },
    getPopupChat: function () {
        this.initPopupChat();
        return this.ChatPrivate;
    },

    showMessage(message) {
        try {
            this.node.active = true;
            this.showChild(this.inGameMessage, true);
            this.inGameMessage.getComponent("In-gameMessage").setMessage(message);
        } catch (error) {
            // this.initInGameMessage();
            // this.showMessage(message);
        }
    },

    showMenuPopUP: function () {
        this.node.active = true;
        this.showChild(this.getPanelMenu(), true);
    },
    showPopupChatPrivate: function () {
        this.node.active = true;
        this.showChild(this.getPopupChat(), true);
    },
    hideMenuPopup: function () {
        this.node.active = true;
        this.hideChild(this.getPanelMenu(), true);
    },
    getPanelPlayerView: function () {
        this.initPanelPlayerView();
        return this.PanelPlayerView;
    },
    showPanelPlayerView: function () {
        this.node.active = true;
        this.showChild(this.getPanelPlayerView(), true);
    },
    hidePanelPlayerView: function () {
        this.node.active = true;
        this.hideChild(this.getPanelPlayerView(), true);
    },
    showChild: function (child, fx) {
        for (let i = 0; i < this.node.children.length; i++) {
            var c = this.node.children[i];
            if (c && cc.isValid(c)) {
                c.stopAllActions();
                if (c == child) {
                    c.opacity = 0;
                    //c.zIndex = cc.macro.MAX_ZINDEX;
                    c.active = true;
                    if (fx) {
                        c.stopAllActions();
                        c.runAction(cc.fadeIn(0.2));
                    } else {
                        c.opacity = 255;
                    }
                } else {
                    c.active = false;
                    c.opacity = 0;
                }
            }
        }
    },
    hideChild: function (child, fx) {
        for (let i = 0; i < this.node.children.length; i++) {
            var c = this.node.children[i];
            if (c && cc.isValid(c)) {
                c.stopAllActions();
                if (c == child) {
                    c.opacity = 255;
                    c.active = true;
                    if (fx) {
                        c.runAction(cc.sequence(cc.fadeOut(0.2), cc.callFunc(function () {
                            this.node.active = false;
                        }.bind(this))));
                    } else {
                        c.opacity = 0;
                        this.node.active = false;
                    }
                } else {
                    c.active = true;
                    c.opacity = 0;
                }
            }
        }
    },
});