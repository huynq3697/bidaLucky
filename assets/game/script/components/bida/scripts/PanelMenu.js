var BiDaConstant = require('BiDaConstant');
var NewAudioManager = require('NewAudioManager');
var Linker = require('Linker');
cc.Class({
    extends: cc.Component,

    properties: {
        btnDongMenu: cc.Node,
        btnBanBe: cc.Node,
        btnChat: cc.Node,
        btnCaiDat: cc.Node,
        btnHotro: cc.Node,
        btnThoat: cc.Node
    },
    onLoad() {

        this.btnDongMenu.on(cc.Node.EventType.TOUCH_END, this.onPanelMenuClick, this);
        this.btnBanBe.on(cc.Node.EventType.TOUCH_END, this.onPanelMenuClick, this);
        this.btnChat.on(cc.Node.EventType.TOUCH_END, this.onPanelMenuClick, this);
        this.btnCaiDat.on(cc.Node.EventType.TOUCH_END, this.onPanelMenuClick, this);
        this.btnHotro.on(cc.Node.EventType.TOUCH_END, this.onPanelMenuClick, this);
        this.btnThoat.on(cc.Node.EventType.TOUCH_END, this.onPanelMenuClick, this);
    },
    onEnable() {
        if (Linker.BiDaOfflineController) {
            this.btnChat.active = false;
        } else {
            this.btnChat.active = true;
        }
        if (!Linker.isLogin) {
            this.btnBanBe.active = false;
        } else {
            this.btnBanBe.active = true;
        }
    },
    onPanelMenuClick: function (event) {
        var target = event.currentTarget;
        NewAudioManager.playClick();
        if (target) {
            if (target === this.btnDongMenu) {
                // ** Đóng popup menu.
                var customEvent = new cc.Event.EventCustom(BiDaConstant.POPUP_EVENT.PANEL_MENU.CLOSE, true);
                this.node.dispatchEvent(customEvent);
            } else if (target === this.btnBanBe) {
                // ** Mở poup friend, tìm bạn, kết bạn.
                var customEvent = new cc.Event.EventCustom(BiDaConstant.POPUP_EVENT.FRIEND_ZONE.OPEN, true);
                this.node.dispatchEvent(customEvent);
            } else if (target === this.btnChat) {
                // ** Đóng popup menu.
                var customEvent = new cc.Event.EventCustom(BiDaConstant.POPUP_EVENT.CHAT.OPEN, true);
                this.node.dispatchEvent(customEvent);
            } else if (target === this.btnCaiDat) {
                // ** Đóng popup menu.
                var customEvent = new cc.Event.EventCustom(BiDaConstant.POPUP_EVENT.SETTING.OPEN, true);
                this.node.dispatchEvent(customEvent);
            } else if (target === this.btnHotro) {
                // ** Đóng popup menu.
                var customEvent = new cc.Event.EventCustom(BiDaConstant.POPUP_EVENT.PANEL_MENU.CLOSE, true);
                this.node.dispatchEvent(customEvent);
            } else if (target === this.btnThoat) {
                //** Đóng popup menu.
                var customEvent = new cc.Event.EventCustom(BiDaConstant.POPUP_EVENT.PANEL_MENU.CLOSE, true);
                this.node.dispatchEvent(customEvent);
                //** Gửi yêu cầu rời bàn, ẩn game table và hiện lobby layer.
                var customEvent = new cc.Event.EventCustom(BiDaConstant.GAME_TABLE_EVENT.REQUEST_LEAVE_TABLE, true);
                this.node.dispatchEvent(customEvent);
            }
        }
        // update (dt) {},
    }
})
