var functionAll = require("functionAll");
var Linker = require("Linker");
var DataManger = require("DataManger");
var i18n = require('i18n')
var NewAudioManager = require('NewAudioManager');
cc.Class({
    extends: cc.Component,

    properties: {
        func: functionAll,
        txtCountDown: cc.Label,
        txtMoney: cc.Label,
        iconGet: cc.Node,
        bg: cc.Sprite,
        blockInputEvents: cc.Node,
        soundMp3: {
            default: null,
            type: cc.AudioClip
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.Money;
        Linker.dailyGift2 = this;
        this.check = false;
        this.bool = true;
    },
    onEnable() {
        var setting = this.func.getData("setting");
        this.sound = setting.sound;
        var blockInputEvents = cc.find("Canvas/_Home/UI_Button/btn_get").getChildByName("blockInputEvents");
        blockInputEvents.active = false;
    },
    onDisable() {
        clearInterval(this.time);
    },
    start() {
        var dailyGift = this.func.getData("dailyGift");
        if (dailyGift && dailyGift.get) {
            if (Date.now() - dailyGift.today >= 0){
                dailyGift.get.time = 0;
                dailyGift.get.xMoney = 1;
                dailyGift.get.money = DataManger.MoneyConfig.ADS;
            }
            dailyGift.get.money = DataManger.MoneyConfig.ADS;
            this.countDown(dailyGift.get.time, dailyGift);

            this.runAction();
        }
    },

    // update (dt) {},

    countDown: function (time, dailyGift) {
        var _this = this;
        var setting = this.func.getData("setting");
        if (Date.now() - time >= 0) {
            //Duoc nhan
            this.bg.node.active = true;
            this.iconGet.active = true;
            this.blockInputEvents.active = false;
            // cc.resources.load("home/home", cc.SpriteAtlas, (err, atlas) => {
            //     if (!err) {
            //         var spriteFrame = atlas.getSpriteFrame("buttonget");
            //         _this.bg.spriteFrame = spriteFrame;
            //         _this.bg.node.getComponent(cc.Button).normalSprite = spriteFrame;
            //         _this.bg.node.getComponent(cc.Button).hoverSprite = spriteFrame;
            //         _this.bg.node.getComponent(cc.Button).disabledSprite = spriteFrame;
            //     }
            // });
            setting = this.func.getData("setting");
            this.txtCountDown.string = "Get now";
            this.Money = dailyGift.get.money;
            console.log(" this.Money    " +  this.Money)
            this.txtMoney.string = "+" + this.func.moneyWithFormat((this.Money), ".");
        }
        else {
            if (dailyGift.get.xMoney > 5)           // Nguoi choi nhan qua 6 lan thi an di khong cho nhan nua
            {
                this.bg.node.active = false;
                clearInterval(_this.time);
                return;
            }
            //Khong duoc nhan
            this.iconGet.active = false;
            this.blockInputEvents.active = true;
            // cc.resources.load("home/home", cc.SpriteAtlas, (err, atlas) => {
            //     if (!err) {
            //         var spriteFrame = atlas.getSpriteFrame("buttonget2");
            //         _this.bg.spriteFrame = spriteFrame;
            //         _this.bg.node.getComponent(cc.Button).normalSprite = spriteFrame;
            //         _this.bg.node.getComponent(cc.Button).hoverSprite = spriteFrame;
            //         _this.bg.node.getComponent(cc.Button).disabledSprite = spriteFrame;
            //     }
            // });
            if (_this.check)
            {
                ++dailyGift.get.xMoney;
            }
            _this.Money = dailyGift.get.money;
            this.txtMoney.string = "+" + this.func.moneyWithFormat(_this.Money, ".");
            this.time = setInterval(() => {
                var x = time - Date.now();
                var hour = Math.floor(x / (1000 * 60 * 60));
                var m = x % (1000 * 60 * 60);
                var minutes = Math.floor(m / (1000 * 60));
                var s = m % (1000 * 60);
                var seconds = Math.floor(s / 1000);
                setting = _this.func.getData("setting");
                _this.txtCountDown.string = "Bonus in " + ""
                    + (hour < 10 ? "0" + hour : hour) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
                if (hour == "00" && minutes == "00" && seconds == "01") {
                    _this.runAction();
                }
                if (hour == "00" && minutes == "00" && seconds == "00") {
                    clearInterval(this.time);
                    _this.iconGet.active = true;
                    _this.blockInputEvents.active = false;
                    // cc.resources.load("home/home", cc.SpriteAtlas, (err, atlas) => {
                    //     if (!err) {
                    //         var spriteFrame = atlas.getSpriteFrame("buttonget");
                    //         _this.bg.spriteFrame = spriteFrame;
                    //         _this.bg.node.getComponent(cc.Button).normalSprite = spriteFrame;
                    //         _this.bg.node.getComponent(cc.Button).hoverSprite = spriteFrame;
                    //         _this.bg.node.getComponent(cc.Button).disabledSprite = spriteFrame;
                    //     }
                    // });
                    _this.check = false;
                    setting = _this.func.getData("setting");
                    _this.txtCountDown.string = "Get now";
                }
            }, 1000);
        }
    },
    onShowQC(event) {
        // Linker.dailyGift2.onGetClick(event); test
        var blockInputEvents = event.target.getChildByName("blockInputEvents");
        if (blockInputEvents)
        {
            blockInputEvents.active = true;
            Linker.eventGetMoney = event;
            this.bool = true;
            // var mysdk = cc.find("Canvas/_Home").getComponent("MySdk");
            // mysdk.test();
        }
    },
    onGetClick: function (event) {
        if (!this.bool)
        {
            return;
        }
        this.bool = false;
        var tableGame2 = this.func.getData("tableGame2");
        var dailyGift = this.func.getData("dailyGift");
        DataManger.UserData.addUserMoney(this.Money);
        this.showNotification(this.func.moneyWithFormat(this.Money, "."));
        NewAudioManager.playClick();
        switch (dailyGift.get.xMoney.toString()) {
            case "1":
                dailyGift.get.time = Date.now() + 1800000;
                break;
            case "2":
                dailyGift.get.time = Date.now() + 2700000;
                break;
            case "3":
                dailyGift.get.time = Date.now() + 3600000;
                break;
            case "4":
                dailyGift.get.time = Date.now() + 4500000;
                break;
            case "5":
                dailyGift.get.time = Date.now() + 5400000;
                break;
            case "6":
                dailyGift.get.time = Date.now() + 6300000;
                break;
        }
        // Cai switch nay de test
        // switch (dailyGift.get.xMoney.toString())
        // {
        //     case "1":
        //         dailyGift.get.time = Date.now() + 10000;
        //         break;
        //     case "2":
        //         dailyGift.get.time = Date.now() + 10000;
        //         break;
        //     case "3":
        //         dailyGift.get.time = Date.now() + 10000;
        //         break;
        //     case "4":
        //         dailyGift.get.time = Date.now() + 10000;
        //         break;
        //     case "5":
        //         dailyGift.get.time = Date.now() + 10000;
        //         break;
        //     case "6":
        //         dailyGift.get.time = Date.now() + 10000;
        //         break;
        //     default:
        //         this.bg.node.active = false;
        // }
        this.runAction();
        this.check = true;
        this.countDown(dailyGift.get.time, dailyGift);
        this.func.setData("dailyGift", dailyGift);
        this.func.setData("tableGame2", tableGame2);
        var home = cc.find("Canvas/_Home");
        if (home) {
            home.getComponent("_Home").updateInfo();
        }
    },

    getMoney(dailyGift) {

    },

    runAction() {
        // cc.tween(this.bg.node).to(1, { position: cc.v2(1500, 220) }).to(1, { position: cc.v2(500, 215) }).start();
    },

    isBlock(isBlock) {
        this.node.getChildByName("UI_Button").getChildByName("btn_get").getChildByName("blockInputEvents").active = isBlock;
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
        
    }
});
