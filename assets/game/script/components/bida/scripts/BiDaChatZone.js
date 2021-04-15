var NewAudioManager = require('NewAudioManager');
var Linker = require('Linker');
var BiDaSend = require('BiDaSend');
var Global = require("Global2");
var i18n = require('i18n');
cc.Class({
    extends: cc.Component,

    properties: {
        itemChatPrefab: cc.Prefab,
        contentNode: cc.Node,
        chatBox: cc.EditBox,
        itemEmoji: cc.Prefab,
        contentEmojiPage: cc.Node,
        emojiPage: cc.Node,
        itemChatEmoji: cc.Prefab
    },

    ctor: function () {
        this.countNewChat = 0;
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        Linker.Event.addEventListener(1303, this.onChatZoneResponse, this);
    },

    start() {
        this.initializeEmojiPage();
    },

    onEnable: function () {
        this.contentNode.removeAllChildren(true);
        this.chatBox.string = "";
        //this.chatBox.focus();
        this.currentPage = 1;
        this.count = 0;
        var data = BiDaSend.getChatZonePage(this.currentPage);
        Linker.Socket.send(data);
        Global.Announcement._showLoading();
        this.node.on('content-emoji', this.onReceiveEmojiChat, this);
    },

    onDisable: function () {
        this.node.off('content-emoji', this.onReceiveEmojiChat, this);
    },

    onDestroy: function () {
        Linker.Event.removeEventListener(1303, this.onChatZoneResponse, this);
    },

    /* ------------------------------ BUTTON EVENT CALL BACKS -------------------------- */

    clickSendChat() {
        NewAudioManager.playClick();
        var chatString = this.chatBox.string;
        this.chatBox.string = "";
        var data = BiDaSend.sendChatZone(chatString);
        Linker.Socket.send(data);
    },

    clickOpenChatTable() {

    },

    /* ----------------------- SERVER EVENT CALLBACKS ----------------------- */
    onChatZoneResponse(message) {
        Global.Announcement._hideLoading();
        if (message.status == 1) {
            this.handleChatResponse(message);
        } else {
            if (message.error) {
                cc.Global.showMessage(i18n.t(message.error));
            }
        }
    },

    onClickClose: function (event) {
        NewAudioManager.playClick();
        this.currentPage = 1;
        this.node.parent.active = false;
    },

    handleChatResponse(message) {
        var self = this;
        var listChat = message.listChat;
        if (message.type == 0 && message.listChat.length > 0) {
            for (var i = 0; i < message.listChat.length; ++i)
            {
                var itemChat = cc.instantiate(self.itemChatPrefab);
                if (listChat[i].username != Linker.userData.displayName) {
                    var chatSplit = listChat[i].chat.split(" ");
                    if (chatSplit.length == 2 && chatSplit[0].includes("Clip")) {
                        self.createChatEmoji(listChat[i], itemChat, chatSplit, 0);
                    } else {
                        itemChat.getComponent(cc.RichText).string = "<color=#fff500><b>" + listChat[i].username + ": " + "</b></c><color=#ffffff>" + listChat[i].chat + "</color>";
                        self.contentNode.addChild(itemChat, 0);
                    }
                } else {
                    var chatSplit = listChat[i].chat.split(" ");
                    if (chatSplit.length == 2 && chatSplit[0].includes("Clip")) {
                        self.createChatEmoji(listChat[i], itemChat, chatSplit, 0);
                    } else {
                        itemChat.getComponent(cc.RichText).string = "<color=#00ff1f><b>" + listChat[i].username + ": " + "</b></c><color=#ffffff>" + listChat[i].chat + "</color>";
                        self.contentNode.addChild(itemChat, 0);
                    }
                }
            }
        } else if (message.type == 1) {
            ++self.count;
            var itemChat = cc.instantiate(self.itemChatPrefab);
            if (listChat[0].username == Linker.userData.displayName) {
                var chatSplit = listChat[0].chat.split(" ");
                if (chatSplit.length == 1 && chatSplit[0].includes("Clip")) {
                    self.createChatEmoji(listChat[0], itemChat, chatSplit, 0 - self.count);
                } else {
                    itemChat.getComponent(cc.RichText).string = "<color=#00ff1f><b>" + listChat[0].username + ": " + "</b></c><color=#ffffff>" + listChat[0].chat + "</color>";
                    self.contentNode.addChild(itemChat, 0 - self.count);
                }
            } else {
                var chatSplit = listChat[0].chat.split(" ");
                if (chatSplit.length == 1 && chatSplit[0].includes("Clip")) {
                    self.createChatEmoji(listChat[0], itemChat, chatSplit, 0 - self.count);
                } else {
                    itemChat.getComponent(cc.RichText).string = "<color=#fff500><b>" + listChat[0].username + ": " + "</b></c><color=#ffffff>" + listChat[0].chat + "</color>";
                    self.contentNode.addChild(itemChat, 0 - self.count);
                }
            }
        }
        ++this.currentPage;
    },

    createChatEmoji(element, itemChat, chatSplit, zIndex = 0) {
        var itemChatEmoji = cc.instantiate(this.itemChatEmoji);
        itemChat.getComponent(cc.RichText).string = "<color=#00ff1f><b>" + element.username + ": " + "</b></c>";
        //#region Tạo node chứa emoji animation
        var animNode = new cc.Node("Emoji");
        animNode.addComponent(cc.Sprite);
        animNode.addComponent(cc.Animation);
        var clip = cc.Global.findClip(chatSplit[0]);
        clip.speed = 0.2;
        animNode.getComponent(cc.Animation).addClip(clip);
        animNode.getComponent(cc.Animation).play(clip.name);
        //#endregion
        itemChatEmoji.addChild(itemChat, cc.macro.MIN_ZINDEX);
        itemChatEmoji.addChild(animNode, cc.macro.MAX_ZINDEX);

        ++this.count;
        this.contentNode.addChild(itemChatEmoji, zIndex);
    },

    /* ----------------------- SCROLL VIEW CALLBACKS EVENT ------------------------- */
    onScrollListChat(scrollView, eventType) {
        switch (eventType) {
            case cc.ScrollView.EventType.BOUNCE_TOP: {
                var data = BiDaSend.getChatZonePage(this.currentPage);
                Linker.Socket.send(data);
                break;
            }
            case cc.ScrollView.EventType.BOUNCE_BOTTOM: {
                // var contentChild = this.contentNode.children;
                // for (let index = 1; index < contentChild.length; index++) {
                //     contentChild[index].destroy();
                // }
                break;
            }
            default: {
                break;
            }
        }
    },

    /* ----------------------- EDITBOX EVENT CALLBACKS ------------------------ */
    onEditReturn(editbox) {
        this._isEditReturn = true;
    },

    onEditEnd(editbox) {
        if (this._isEditReturn) {
            this.clickSendChat();
            this._isEditReturn = false;
        } else {
            cc.log("Edit chat end");
        }
    },

    initializeEmojiPage() {
        this.contentEmojiPage.destroyAllChildren();
        var length = cc.Global.EmojiClip.length;
        for (let i = 1; i <= length; ++i) {
            var itemEmoji = cc.instantiate(this.itemEmoji);
            itemEmoji.getComponent("itemEmoji").setClip(i);
            this.contentEmojiPage.addChild(itemEmoji);
        }
    },

    onReceiveEmojiChat(message) {
        var data = BiDaSend.sendChatZone(message.chat);
        Linker.Socket.send(data);
        this.emojiPage.active = false;
    },

    clickButton(event, customEventData) {
        NewAudioManager.playClick();
        this.emojiPage.active = !this.emojiPage.active;
    },
});