var functionAll = require("functionAll");
var Linker = require("Linker");
var DataManger = require('DataManger');
var i18n = require('i18n');
var NewAudioManager = require('NewAudioManager');
cc.Class({
    extends: cc.Component,

    properties: {
        func: functionAll,
        txtMoney: cc.Label,
        txtTitle: cc.Label,
        namePackage: [cc.Label],
        betMoney: [cc.Label],
        txtGetNow: [cc.Label],
        txtget: [cc.Label],
        txtNote: [cc.Label],
        txtText: [cc.Label],
        listGift: cc.Node,
        txtClock: cc.Label,
        soundMp3: {
            default: null,
            type: cc.AudioClip
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.time;
        Linker._DailyGift = this;

        this.node.opacity = 0;
        cc.tween(this.node).to(0.18, {opacity: 255}).start();

    },

    onEnable () {
        var tableGame2 = this.func.getData("tableGame2");
        var setting = this.func.getData("setting");
        this.sound = setting.sound;
        for (var i = 0; i < this.txtGetNow.length; ++i)
        {
            var blockInputEvents = this.txtGetNow[i].node.parent.getChildByName("blockInputEvents");
            if (blockInputEvents)
            {
                blockInputEvents.active = false;
            }
        }
        this.resetDailyGift();
        this.updateLanguageText();
        this.resetMoney();
        var home = cc.find("Canvas/_Home");
        if (home)
        {
            home.opacity = 0;
        }
        var time = this.func.getData("dailyGift").today;
        this.countDown(time, this.txtClock.node, null);
    },
    onDisable () {
        clearInterval(this.time);
        var home = cc.find("Canvas/_Home");
        if (home)
        {
            home.opacity = 255;
            home.getComponent("_Home").updateInfo();
        }
    },

    start () {

    },

    // update (dt) {},

    updateLanguageText: function() {
        var setting = this.func.getData("setting");
        var money = DataManger.MoneyConfig.DAILY_GIFT;
        var count = 1;

        this.txtTitle.string = "TIME BONUS";
        this.namePackage.forEach(element => {
            element.string = i18n.t("Step ") + count;
            ++count;
        });
        // this.betMoney
        this.txtget.forEach(element => {
            element.string = i18n.t("Claim now");
        });
        this.txtGetNow.forEach(element => {
            element.string = i18n.t("Claim now");
        });
        this.txtText.forEach(element => {
            element.string = i18n.t("Video ads");
        });
        this.txtNote[0].string = i18n.t("*From step 2, you can claim reward immediately by watching video ads*");
        this.txtNote[1].string = i18n.t("*The higher level you achieve, the more reward you can get*");
        this.txtNote[2].string = i18n.t("*Rewards will be reset Nextday*");
            
    },
    onClose() {
        cc.tween(this.node).to(0.15, {opacity: 0}).start();
        this.scheduleOnce(() => {
            this.node.destroy(true);
        }, 0.15);
    },
    onShowQC(event) {
        var blockInputEvents = event.target.getChildByName("blockInputEvents");
        if (blockInputEvents)
        {
            blockInputEvents.active = true;
            Linker.eventGetMoney = event;
            // var mysdk = cc.find("Canvas/_Home").getComponent("MySdk");
            // mysdk.test();
        }
    },
    btnClickVideoAds() {
        if(Linker.MySdk){
            Linker.MySdk.showRewarded();
        }
        
    },
    onGetClick: function(event) {
        var dailyGift = this.func.getData("dailyGift");
        var tableGame2 = this.func.getData("tableGame2");
        var setting = this.func.getData("setting");
        var node = event.target.parent.parent;
        NewAudioManager.playClick();
        if (dailyGift)
        {
            switch(node.name){
                case "1":
                    var time = Date.now();
                    dailyGift.gift[0].time = time;
                    dailyGift.gift[0].status = 2;
                    dailyGift.gift[1].status = 0;
                    dailyGift.gift[0].nextTime = time + dailyGift.gift[0].deltaTime;
                    DataManger.UserData.addUserMoney(DataManger.MoneyConfig.DAILY_GIFT[0]);
                    this.showNotification(this.func.moneyWithFormat(DataManger.MoneyConfig.DAILY_GIFT[0], "."));
                    node.getChildByName("shadow").active = true;
                    node.getChildByName("btn").active = false;
                    node.getChildByName("txtMoney").getComponent(cc.Label).string = i18n.t("Finished");

                    break;
                case "2":
                    var time = Date.now();
                    dailyGift.gift[1].time = time;
                    dailyGift.gift[1].status = 2;
                    dailyGift.gift[2].status = 0;
                    dailyGift.gift[1].nextTime = time + dailyGift.gift[1].deltaTime;
                    DataManger.UserData.addUserMoney(DataManger.MoneyConfig.DAILY_GIFT[1]);
                    this.showNotification(this.func.moneyWithFormat(DataManger.MoneyConfig.DAILY_GIFT[1], "."));
                    node.getChildByName("shadow").active = true;
                    node.getChildByName("btn").active = false;
                    node.getChildByName("txtMoney").getComponent(cc.Label).string = i18n.t("Finished");
                    break;
                case "3":
                    var time = Date.now();
                    dailyGift.gift[2].time = time;
                    dailyGift.gift[2].status = 2;
                    dailyGift.gift[3].status = 0;
                    dailyGift.gift[2].nextTime = time + dailyGift.gift[2].deltaTime;
                    DataManger.UserData.addUserMoney(DataManger.MoneyConfig.DAILY_GIFT[2]);
                    this.showNotification(this.func.moneyWithFormat(DataManger.MoneyConfig.DAILY_GIFT[2], "."));
                    node.getChildByName("shadow").active = true;
                    node.getChildByName("btn").active = false;
                    node.getChildByName("txtMoney").getComponent(cc.Label).string = i18n.t("Finished");
                    break;
                case "4":
                    var time = Date.now();
                    dailyGift.gift[3].time = time;
                    dailyGift.gift[3].status = 2;
                    dailyGift.gift[4].status = 0;
                    dailyGift.gift[3].nextTime = time + dailyGift.gift[3].deltaTime;
                    DataManger.UserData.addUserMoney(DataManger.MoneyConfig.DAILY_GIFT[3]);
                    this.showNotification(this.func.moneyWithFormat(DataManger.MoneyConfig.DAILY_GIFT[3], "."));
                    node.getChildByName("shadow").active = true;
                    node.getChildByName("btn").active = false;
                    node.getChildByName("txtMoney").getComponent(cc.Label).string = i18n.t("Finished");
                    break;
                case "5":
                    var time = Date.now();
                    dailyGift.gift[4].time = time;
                    dailyGift.gift[4].status = 2;
                    // dailyGift.gift[1].status = 1;
                    dailyGift.gift[4].nextTime = time + dailyGift.gift[4].deltaTime;
                    DataManger.UserData.addUserMoney(DataManger.MoneyConfig.DAILY_GIFT[4]);
                    this.showNotification(this.func.moneyWithFormat(DataManger.MoneyConfig.DAILY_GIFT[4], "."));
                    node.getChildByName("shadow").active = true;
                    node.getChildByName("btn").active = false;
                    node.getChildByName("txtMoney").getComponent(cc.Label).string = i18n.t("Finished");
                    break;
                default:
                    switch (event.target.parent.parent.parent.name)
                    {
                        case "2":
                            var time1 = Date.now();
                            dailyGift.gift[1].time = time1;
                            dailyGift.gift[1].status = 2;
                            dailyGift.gift[2].status = 0;
                            dailyGift.gift[1].nextTime = time1 + dailyGift.gift[1].deltaTime;
                            DataManger.UserData.addUserMoney(DataManger.MoneyConfig.DAILY_GIFT[1]);
                            this.showNotification(this.func.moneyWithFormat(DataManger.MoneyConfig.DAILY_GIFT[1], "."));
                            node.parent.getChildByName("shadow").active = true;
                            node.parent.getChildByName("btn").active = false;
                            node.parent.getChildByName("txtMoney").getComponent(cc.Label).string = i18n.t("Finished");
                            break;
                        case "3":
                            var time1 = Date.now();
                            dailyGift.gift[2].time = time1;
                            dailyGift.gift[2].status = 2;
                            dailyGift.gift[3].status = 0;
                            dailyGift.gift[2].nextTime = time1 + dailyGift.gift[2].deltaTime;
                            DataManger.UserData.addUserMoney(DataManger.MoneyConfig.DAILY_GIFT[2]);
                            this.showNotification(this.func.moneyWithFormat(DataManger.MoneyConfig.DAILY_GIFT[2], "."));
                            node.parent.getChildByName("shadow").active = true;
                            node.parent.getChildByName("btn").active = false;
                            node.parent.getChildByName("txtMoney").getComponent(cc.Label).string = i18n.t("Finished");
                            break;
                        case "4":
                            var time1 = Date.now();
                            dailyGift.gift[3].time = time1;
                            dailyGift.gift[3].status = 2;
                            dailyGift.gift[4].status = 0;
                            dailyGift.gift[3].nextTime = time1 + dailyGift.gift[3].deltaTime;
                            DataManger.UserData.addUserMoney(DataManger.MoneyConfig.DAILY_GIFT[3]);
                            this.showNotification(this.func.moneyWithFormat(DataManger.MoneyConfig.DAILY_GIFT[3], "."));
                            node.parent.getChildByName("shadow").active = true;
                            node.parent.getChildByName("btn").active = false;
                            node.parent.getChildByName("txtMoney").getComponent(cc.Label).string = i18n.t("Finished");
                            break;
                        case "5":
                            var time1 = Date.now();
                            dailyGift.gift[4].time = time1;
                            dailyGift.gift[4].status = 2;
                            // dailyGift.gift[1].status = 1;
                            dailyGift.gift[4].nextTime = time1 + dailyGift.gift[4].deltaTime;
                            DataManger.UserData.addUserMoney(DataManger.MoneyConfig.DAILY_GIFT[4]);
                            this.showNotification(this.func.moneyWithFormat(DataManger.MoneyConfig.DAILY_GIFT[4], "."));
                            node.parent.getChildByName("shadow").active = true;
                            node.parent.getChildByName("btn").active = false;
                            node.parent.getChildByName("txtMoney").getComponent(cc.Label).string = i18n.t("Finished");
                            break;
                    } 
                    break;
            }
        }
        this.func.setData("setting", setting);
        this.func.setData("tableGame2", tableGame2);
        this.func.setData("dailyGift", dailyGift);
        this.resetDailyGift();
        this.resetMoney();
    },

    resetDailyGift:function() {
        var dailyGift = this.func.getData("dailyGift");
        var tableGame2 = this.func.getData("tableGame2");
        var setting = this.func.getData("setting");
        this.checkNewDay(dailyGift);
        dailyGift = this.func.getData("dailyGift");
        var index;
        //1 la co the nhan, 2 la da nhan, 0 la khong duoc nhan
        for (var i = 0; i < this.listGift.childrenCount; ++i)
        {
            if (dailyGift.gift[i].status == 2)
            {
                this.listGift.children[i].getChildByName("shadow").active = true;
                this.listGift.children[i].getChildByName("btn").active = false;
                this.listGift.children[i].getChildByName("txtMoney").getComponent(cc.Label).string = i18n.t("Finished");

            }
            else if (dailyGift.gift[i].status == 1)
            {
                this.listGift.children[i].getChildByName("shadow").active = false;
                this.listGift.children[i].getChildByName("btn").active = true;
                this.listGift.children[i].getChildByName("btn").getChildByName("btn_get").active = true;
                this.listGift.children[i].getChildByName("btn").getChildByName("txt_countdown").active = false;
                this.listGift.children[i].getChildByName("txtMoney").getComponent(cc.Label).string = "+" + this.func.moneyWithFormat(DataManger.MoneyConfig.DAILY_GIFT[i], ".");
            }
            else if (dailyGift.gift[i].status == 0)
            {
                this.listGift.children[i].getChildByName("shadow").active = false;
                this.listGift.children[i].getChildByName("btn").active = true;
                this.listGift.children[i].getChildByName("btn").getChildByName("btn_get").active = false;
                var txtCountDown = this.listGift.children[i].getChildByName("btn").getChildByName("txt_countdown");
                this.listGift.children[i].getChildByName("txtMoney").getComponent(cc.Label).string = "+" + this.func.moneyWithFormat(DataManger.MoneyConfig.DAILY_GIFT[i], ".");
                txtCountDown.active = true;
                this.countDown(dailyGift.gift[i - 1].nextTime, this.listGift.children[i].getChildByName("btn").getChildByName("txt_countdown"), i);
            }
            else if (dailyGift.gift[i].status == -1)
            {
                this.listGift.children[i].getChildByName("shadow").active = false;
                this.listGift.children[i].getChildByName("btn").active = false;
            }

        }
    },

    countDown: function(time, label, index) {
        var x = time - Date.now();
        if (x <= 0)
        {
            if (index)
            {
                this.showBtnGetMoney(true, index);
            }
            else
            {
                var dailyGift = this.func.getData("dailyGift");
                dailyGift.today += 86400000;
                this.func.setData("dailyGift", dailyGift);
                this.countDown(dailyGift.today, label, null);
            }
        }
        var hour = Math.floor(x / (1000 * 60 * 60));
        var m = x % (1000 * 60 * 60);
        var minutes = Math.floor(m / (1000 * 60));
        var s = m % (1000 * 60);
        var seconds = Math.floor(s / 1000);
        if (!label.parent)
        {
            return;
        }
        label.getComponent(cc.Label).string = (hour < 10 ? "0" + hour : hour) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
        if (hour == "00" && minutes == "00" && seconds == "00")
        {
            return;
        }
        this.time = setInterval(() => {
            var x = time - Date.now();
            var hour = Math.floor(x / (1000 * 60 * 60));
            var m = x % (1000 * 60 * 60);
            var minutes = Math.floor(m / (1000 * 60));
            var s = m % (1000 * 60);
            var seconds = Math.floor(s / 1000);
            if (!label.parent)
            {
                return;
            }
            label.getComponent(cc.Label).string = (hour < 10 ? "0" + hour : hour) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
            if (hour == "00" && minutes == "00" && seconds == "00")
            {
                clearInterval(this.time);
                if (index)
                {
                    this.showBtnGetMoney(true, index);
                }
                else
                {
                    var dailyGift = this.func.getData("dailyGift");
                    dailyGift.today += 86400000;
                    this.func.setData("dailyGift", dailyGift);
                    this.countDown(dailyGift.today, label, null);
                }
            }
        }, 1000);
    },
    resetMoney: function () {
        this.txtMoney.string = this.func.moneyWithFormat(DataManger.UserData.getUserMoney(), ".");
    },
    showBtnGetMoney: function (isShow, index) {
        this.txtget[index].node.parent.active = isShow;
        this.txtGetNow[index].node.parent.parent.active = !isShow;
    },
    checkNewDay: function (dailyGift) {
        var delta = Date.now() - dailyGift.today;
        if (delta >= 0)
        {
            dailyGift = {
                gift: [
                    {
                        status: 1,
                        time: null,
                        deltaTime: 1800000, //don vi: miliseconds
                        nextTime: null,
                        money: 50000
                    },
                    {
                        status: -1,
                        time: null,
                        deltaTime: 1800000, //don vi: miliseconds
                        nextTime: null,
                        money: 100000
                    },
                    {
                        status: -1,
                        time: null,
                        deltaTime: 1800000, //don vi: miliseconds
                        nextTime: null,
                        money: 150000
                    },
                    {
                        status: -1,
                        time: null,
                        deltaTime: 1800000, //don vi: miliseconds
                        nextTime: null,
                        money: 200000
                    },
                    {
                        status: -1,
                        time: null,
                        deltaTime: 1800000, //don vi: miliseconds
                        nextTime: null,
                        money: 1000000
                    },
                ],
                today: dailyGift.today + 86400000,
                consecutiveLogin: {
                    count: 1,
                    date: null,
                    money: 50000
                },
                get: {
                    time: 0,
                    xMoney: 1,
                    money: 50000,
                }
            }
            this.func.setData("dailyGift", dailyGift);
        }
    },
    showNotification(money) {
        cc.resources.load("notification/notification", cc.Prefab, (err, prefab) => {
            if (!err)
            {
                var setting = this.func.getData("setting");
                var content = i18n.t("You have received ") + money;
                var node = cc.instantiate(prefab);
                node.getComponent("notification").setNotification(content);
                cc.find("Canvas").addChild(node);
                node.zIndex = cc.macro.MAX_ZINDEX;
            }
        })
        
    }
});
