var functionAll = require("functionAll");
var Linker = require("Linker");
var NewAudioManager = require('NewAudioManager');
var PopupDisplay = require('PopupDisplay');
var i18n = require('i18n');
var BiDaConstant = require('BiDaConstant');
cc.Class({
    extends: PopupDisplay,

    properties: {
        func: functionAll,
        listGame: cc.JsonAsset,
        itemGamePrefab: cc.Prefab,
        content: cc.Node,
        iconAtlas: cc.SpriteAtlas,
        soundMp3: {
            default: null,
            type: cc.AudioClip
        }
    },

    // LIFE-CYCLE CALLBACKS:
    // onLoad () {
        
    // },

    start () {
        // if(Linker.MySdk){
        //     Linker.MySdk.bannerBottom();
        // }
        this.content.removeAllChildren();
        this.node.zIndex = cc.macro.MAX_ZINDEX;
        this.initListGame();
        var setting = this.func.getData("setting");
        this.sound = setting.sound;
    },

    // update (dt) {},

    initListGame: function() {
        var listGame = this.listGame.json.listGame;
        var length = listGame.length;
        var setting = this.func.getData("setting");
        for (var i = 0; i < length; ++i)
        {
            if (listGame[i].url == "" || !listGame[i].status)
            {
                continue;
            }
            var item = cc.instantiate(this.itemGamePrefab);
            this.content.addChild(item);

            item.name = listGame[i].node;

            var spriteFrame = this.iconAtlas.getSpriteFrame(listGame[i].avatar);
            item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = spriteFrame;

            var name = (Linker.gameLanguage == BiDaConstant.LANGUAGE.VIETNAMESE) ? listGame[i].name.vi : name = listGame[i].name.en;
            item.getChildByName("txtName").getComponent(cc.Label).string = name;
            
            var eventHandler = new cc.Component.EventHandler();
            eventHandler.target = this.node;
            eventHandler.component = "_MoreGame";
            eventHandler.handler = "clickItem";

            item.getChildByName("btn_download").getComponent(cc.Button).clickEvents.push(eventHandler);
        }
    },
    onClose(event) {
        NewAudioManager.playClick();
        cc.tween(this.node).to(0.15, {opacity: 0}).start();  
        this.scheduleOnce(() => {
            this.node.destroy();
        }, 0.15);
    },

    clickItem(event) {
        NewAudioManager.playClick();
        var listGame = this.listGame.json.listGame;

        for (var i = 0; i < listGame.length; ++i)
        {
            if (event.target.parent.name == listGame[i].node)
            {
                cc.sys.openURL(listGame[i].url);
            }
        }
        cc.error("click vao day roi nay");
    }
});
