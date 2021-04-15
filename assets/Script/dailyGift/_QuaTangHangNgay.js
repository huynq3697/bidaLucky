var functionAll = require("functionAll");
var Linker = require("Linker");
var DataManger = require("DataManger");
var NewAudioManager = require("NewAudioManager");
var i18n = require("i18n");
cc.Class({
    extends: cc.Component,

    properties: {
        func: functionAll,
        txtMoney: cc.Label,
        soundMp3: {
            default: null,
            type: cc.AudioClip
        }
    },
    ctor() {
        
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.zIndex = cc.macro.MAX_ZINDEX - 100;
        this.Money = 0;
    },
    onEnable () {
        var dailyGift = this.func.getData("dailyGift");
        this.Money = dailyGift.consecutiveLogin.money * dailyGift.consecutiveLogin.count;
        this.txtMoney.string = "+" + this.func.moneyWithFormat(this.Money, ".");

        var setting = this.func.getData("setting");
        this.sound = setting.sound;
    },
    start () {
    },

    // update (dt) {},

    onGetMoney: function(event) {
        NewAudioManager.playClick();
        DataManger.UserData.addUserMoney(this.Money) 
        this.showNotification(this.func.moneyWithFormat(this.Money, "."));
        var dailyGift = this.func.getData("dailyGift");
        ++dailyGift.consecutiveLogin.count;
        dailyGift.consecutiveLogin.date += 86400000;
        this.func.setData("dailyGift", dailyGift);
        var home = cc.find("Canvas/_Home");
        if (home)
        {
            home.getComponent("_Home").updateInfo();
        }
        cc.tween(this.node).to(0.2, {opacity: 0}).call(() => {
            this.node.destroy(true);
        }).start();
    },
    showNotification(money) {
        cc.resources.load("notification/notification", cc.Prefab, (err, prefab) => {
            if (!err)
            {
                var node = cc.instantiate(prefab);
                var setting = this.func.getData("setting");
                var content = i18n.t("You have received ") + money;
                node.getComponent("notification").setNotification(content);
                cc.find("Canvas").addChild(node);
                node.zIndex = cc.macro.MAX_ZINDEX;
            }
        })
        
    },
    showVideoAds(){
        if(Linker.MySdk){
            Linker.MySdk.showRewarded();
        }
    }
});
