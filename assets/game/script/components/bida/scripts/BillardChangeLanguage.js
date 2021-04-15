
var i18n = require('i18n');
var BiDaConstant = require('BiDaConstant');
var Linker = require('Linker');
var NewAudioManager = require('NewAudioManager');
cc.Class({
    extends: cc.Component,

    properties: {
        vietnameseNode: cc.Node,
        englishNode: cc.Node,
        btnClose: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.addEventButtonToNode();
    },

    onEnable() {
        switch(Linker.gameLanguage) {
            case BiDaConstant.LANGUAGE.VIETNAMESE: {
                this.englishNode.opacity = 150;
                break;
            }
            case BiDaConstant.LANGUAGE.ENGLISH: {
                this.vietnameseNode.opacity = 150;
                break;
            }
            default: {
                break;
            }
        }
    },

    start () {

    },

    // update (dt) {},

    /* ----------------------- OHTER FUNCTION ----------------------- */
    addEventButtonToNode() {
        this.vietnameseNode.on(cc.Node.EventType.TOUCH_END, this.onEventHandler, this);
        this.englishNode.on(cc.Node.EventType.TOUCH_END, this.onEventHandler, this);
        this.btnClose.on(cc.Node.EventType.TOUCH_END, this.onEventHandler, this);
    },

    onEventHandler(event) {
        var target = event.currentTarget;
        NewAudioManager.playClick();
        switch(target) {
            case this.vietnameseNode: {
                i18n.init(BiDaConstant.LANGUAGE.VIETNAMESE);
                Linker.gameLanguage = BiDaConstant.LANGUAGE.VIETNAMESE;
                BiDaConstant.METHODS.createListenerNode().emit("changeLanguage");
                this.englishNode.opacity = 150;
                this.vietnameseNode.opacity = 255;
                cc.sys.localStorage.setItem("languageCode", BiDaConstant.LANGUAGE.VIETNAMESE);
                NewAudioManager.LoadSound(BiDaConstant.LANGUAGE.VIETNAMESE);
                break;
            }
            case this.englishNode: {
                i18n.init(BiDaConstant.LANGUAGE.ENGLISH);
                Linker.gameLanguage = BiDaConstant.LANGUAGE.ENGLISH;
                BiDaConstant.METHODS.createListenerNode().emit("changeLanguage");
                this.vietnameseNode.opacity = 150;
                this.englishNode.opacity = 255;
                cc.sys.localStorage.setItem("languageCode", BiDaConstant.LANGUAGE.ENGLISH);
                NewAudioManager.LoadSound(BiDaConstant.LANGUAGE.ENGLISH);
                break;
            }
            case this.btnClose: {
                this.node.active = false;
                break;
            }
            default: break;
        }
    },
});
