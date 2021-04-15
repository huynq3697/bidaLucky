var Utils = require('Utils');
var Linker = require('Linker');
var GameConstant = require('GameConstant');
var TQUtil = require('TQUtil');
var BiDaConstant = require('BiDaConstant');
var i18n = require('i18n');
var DataAccess = require('DataAccess');
var Api = require('Api');
var Global = require('Global');
var DataManger = require('DataManger');
var PopupShowManager = require('PopupShowManager');
var Constant = require('Constant');
var NewAudioManager = require('NewAudioManager');
cc.Class({
    extends: cc.Component,

    properties: {
        moneyNode: cc.Node,
        btn100: cc.Node,
        btn1k: cc.Node,
        btn10k: cc.Node,
        betGroup: cc.Node,
        rewardHuLabel: cc.Label,
        rewardLabel1: cc.Label,
        rewardLabel2: cc.Label,
        rewardLabel3: cc.Label,
        rewardLabel4: cc.Label,
        rewardList: cc.Node,
        cofferEffect: cc.Prefab,
        historyPrefab: cc.Prefab,
        honoredPrefab: cc.Prefab,
        btnBack: cc.Node,
        betMoney: cc.Label,
        winEffect: cc.Node,
        effect: sp.Skeleton,
        moneyWin: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        //test
        DataManger.signalUpdateUserInfo.add(this.onUpdateUserInfo.bind(this));
    },

    onEnable() {
        this.winEffect.active = false;
        this.betGroup.active = false;
        // if (!Linker.BiDaOfflineController) {
            Linker.LuckyShotGame = this;
            this.ratio2Ball = 2;
            this.isApiData = false;
            this.isSentApi = false;
            this.isStopTest = false;
            this.testTurn = 0;
            this.isTypePlayMoney = true;
            this.arrCuoc = [];
            this.moneyHu = 0;
            this.rewardListArray = [];
            this.rewardList100 = [];
            this.rewardList1k = [];
            this.rewardList10k = [];
            this.getApiRewardList();
            this.interValMoneyHu = null;
            this.addSocketEvent();
            this.btnBack.active = true;
            this.deavtiveLineWin();
    },

    init: function () {
        this.isStopMoney = false;
        this.currCuoc = this.arrCuoc[0];
        this.setUserMoney();
        this.updateListBet();
        this.updateListReward();
        this.updateTestTurn();
        this.resetLineAnimation();
        this.blockBtnBet(false);
        this.setBetMoney();
    },

    showWinEffect(isShow, money = null) {
        if (isShow) {
            NewAudioManager.playSound(NewAudioManager.sound.money_fly);
            this.winEffect.active = true;
            this.winEffect.opacity = 255;
            this.moneyWin.getComponent(cc.Label).string = Utils.Malicious.moneyWithFormat(money, ".");
            var animation = this.effect._skeleton.data.animations[0];
            if (animation) {
                this.effect.animation = animation.name;
                this.scheduleOnce(function(){
                    this.showWinEffect(false);
                }.bind(this), animation.duration);
            }
            this.moneyWin.active = true;
            this.moneyWin.opacity = 0;
            this.moneyWin.runAction(cc.sequence(cc.delayTime(0.5), cc.fadeIn(1.0)));
        } else {
            this.winEffect.runAction(cc.sequence(cc.fadeOut(1.0), cc.callFunc(function(){
                this.winEffect.active = false;
            }.bind(this))));
        }
    },

    setBetMoney: function () {
        this.betMoney.string = TQUtil.abbreviate(this.currCuoc);
    },

    onUpdateUserInfo: function () {
        this.setUserMoney();
    },

    deavtiveLineWin: function () {
        var childs = this.rewardList.children;
        for (var i = 0; i < childs.length; i++) {
            childs[i].getChildByName("line").active = false;
        }
    },

    getApiRewardList: function () {
        this.isSentApi = true;
        var self = this;
        var data = {
            1000000:{
                1:20000000,
                2:10000000,
                3:6000000,
                4:4000000,
                5:2000000,
            },
            5000000:{
                1:100000000,
                2:50000000,
                3:30000000,
                4:20000000,
                5:10000000,
            },
            10000000:{
                1:1000000000,
                2:500000000,
                3:300000000,
                4:100000000,
                5:50000000,
            }
        }
        this.setDataReward(data);
        this.init();
        // cc.Global.showLoading();
        // Api.get(Linker.Config.APP_API + "ApiCommon/luckyShot", (data) => {
        //     cc.Global.hideLoading();
        //     if (data) {
        //         self.isApiData = true;
        //         self.setDataReward(data);
        //         self.init();
        //     } else {
        //         self.isApiData = false;
        //         cc.Global.showMessage(i18n.t("luckyshot_msg_get_api"));
        //         self.onBackClick();
        //     }
        // });
    },

    setDataReward: function (data) {
        var arrCuoc = Object.keys(data);
        for (var i = 0; i < arrCuoc.length; i++) {
            this.arrCuoc.push(Number(arrCuoc[i]));
            var rewardList = this.rewardList100;
            if (i == 1) {
                rewardList = this.rewardList1k;
            } else if (i == 2) {
                rewardList = this.rewardList10k;
            }
            rewardList.push(data[Number(arrCuoc[i])][1]);
            rewardList.push(data[Number(arrCuoc[i])][2]);
            rewardList.push(data[Number(arrCuoc[i])][3]);
            rewardList.push(data[Number(arrCuoc[i])][4]);
            rewardList.push(data[Number(arrCuoc[i])][5]);
        }
    },

    onBtnTypePlay: function () {
        this.isTypePlayMoney = !this.isTypePlayMoney;
        this.BillardsGameTable.taoLuckyShotVanMoi();
    },

    blockBtnBet: function (isBlocked) {
        if (isBlocked) {
            this.btn100.getComponent(cc.Button).interactable = false;
            this.btn1k.getComponent(cc.Button).interactable = false;
            this.btn10k.getComponent(cc.Button).interactable = false;
            this.btnBack.isBlocked = true;
        } else {
            this.btn100.getComponent(cc.Button).interactable = true;
            this.btn1k.getComponent(cc.Button).interactable = true;
            this.btn10k.getComponent(cc.Button).interactable = true;
            this.btnBack.isBlocked = false;
        }
    },

    addCofferEffect: function (money) {
        var nohuEffect = cc.find("Canvas/NoHuGameBaiEffectLayer");
        if (!nohuEffect) {
            nohuEffect = cc.instantiate(this.cofferEffect);
            nohuEffect.zIndex = cc.macro.MAX_ZINDEX - 1;
            cc.find("Canvas").addChild(nohuEffect);
        }
        nohuEffect.active = true;
        nohuEffect.position = cc.v2(0, 0);
        var nohueffects = nohuEffect.getComponent("NoHuGameBaiEffectLayer");
        //nohueffects.setUserName("player.viewName");
        nohueffects.setMoneyBonus(money);
        nohueffects.runAnimation();
    },

    setLineWin: function (lineWin, tableComponent) {
        if (tableComponent && tableComponent.isValid) {
            var money =  0;
            if (lineWin > 0) {
                money = this.rewardListArray[Number(lineWin) - 1];
                if (cc.Global.PLAY_TYPE == Constant.PLAY_TYPE.BALL_2) {
                    money = money * this.ratio2Ball;
                }
                this.showWinEffect(true, money);
                // tableComponent.showMessage(i18n.t("luckyshot_msg_win_prize", { prize: lineWin, money: Utils.Malicious.moneyWithFormat(money, ".") }));
                DataManger.UserData.addUserMoney(money);
            } else {
                NewAudioManager.playSound(NewAudioManager.sound.lose_2);
                money = -this.currCuoc;
                // tableComponent.showMessage(i18n.t("luckyshot_msg_lose_money", { money: Utils.Malicious.moneyWithFormat(money, ".") }));
            }
        }
        var childs = this.rewardList.children;
        for (var i = 0; i < childs.length; i++) {
            if (lineWin == (i + 1)) {
                this.runLineAnimation(childs[i]);
            }
        }
    },

    runLineAnimation: function (node) {
        if (node) {
            var animActive = cc.callFunc(function () {
                node.getChildByName("moneyLabel").color = cc.Color.RED;
                node.getChildByName("line").active = true;
            });

            var animDefault = cc.callFunc(function () {
                node.getChildByName("moneyLabel").color = cc.Color.YELLOW;
                node.getChildByName("line").active = false;
            });

            var timeDelay = 0.3;
            node.runAction(cc.repeat(cc.sequence(animActive, cc.delayTime(timeDelay), animDefault, cc.delayTime(timeDelay)), 4));
        }
    },

    resetLineAnimation: function () {
        var childs = this.rewardList.children;
        for (var i = 0; i < childs.length; i++) {
            childs[i].stopAllActions();
        }
    },

    updateTestTurn: function () {
        var data = cc.Global.GetSetting("TEST_TURN_TODAY", null);
        if (data) {
            var oldTime = data.time;
            var newTime = Utils.Malicious.toTimestamp(new Date());
            var currTime = newTime - oldTime;
            if (currTime > 86400) {
                data.time = newTime;
                data.numbers = 2;
            }
            cc.Global.SetSetting("TEST_TURN_TODAY", data)
        } else {
            var data = {
                time: Utils.Malicious.toTimestamp(new Date()),
                numbers: 2
            }
            cc.Global.SetSetting("TEST_TURN_TODAY", data)
        }
        this.setTestTurnLabel();
    },

    setTestTurnLabel: function () {
        var data = cc.Global.GetSetting("TEST_TURN_TODAY", null);
        this.testTurn = data.numbers;
        // this.testTurnNode.getComponent(cc.Label).string = this.testTurn;
    },

    onProcessTestTurn: function (event) {
        var data = cc.Global.GetSetting("TEST_TURN_TODAY", null);
        if (data.numbers > 0) {
            data.numbers--;
            cc.Global.SetSetting("TEST_TURN_TODAY", data);
            this.setTestTurnLabel();
            this.isStopTest = false;
        } else {
            this.isStopTest = true;
        }
    },

    start() {

    },

    addSocketEvent() {

    },
    removeEventSocket() {

    },

    updateListBet: function () {
        this.btn100.getChildByName("lb").getComponent(cc.Label).string = TQUtil.abbreviate(this.arrCuoc[0]);
        this.btn1k.getChildByName("lb").getComponent(cc.Label).string = TQUtil.abbreviate(this.arrCuoc[1]);
        this.btn10k.getChildByName("lb").getComponent(cc.Label).string = TQUtil.abbreviate(this.arrCuoc[2]);
        this.btn100.color = cc.color("#868686");
        this.btn1k.color = cc.color("#868686");
        this.btn10k.color = cc.color("#868686");
        if (this.currCuoc == this.arrCuoc[0]) {
            this.btn100.color = cc.Color.WHITE;
        } else if (this.currCuoc == this.arrCuoc[1]) {
            this.btn1k.color = cc.Color.WHITE;
        } else if (this.currCuoc == this.arrCuoc[2]) {
            this.btn10k.color = cc.Color.WHITE;
        }
    },

    onBtnCuoc: function (event) {
        var target = event.currentTarget;
        switch (target) {
            case this.btn100:
                this.currCuoc = this.arrCuoc[0];
                this.setBetMoney();
                break;

            case this.btn1k:
                this.currCuoc = this.arrCuoc[1];
                this.setBetMoney();
                break;

            case this.btn10k:
                this.currCuoc = this.arrCuoc[2];
                this.setBetMoney();
                break;

            default:
                break;
        }
        if (this.BillardsGameTable) {
            this.BillardsGameTable.taoLuckyShotVanMoi();
        }
        this.updateListBet();
        this.updateListReward();
        this.onBtnBet();
        this.isStopMoney = false;
    },

    updateListReward: function () {
        this.rewardListArray = this.rewardList100;
        if (this.currCuoc == this.arrCuoc[1]) {
            this.rewardListArray = this.rewardList1k;
        } else if (this.currCuoc == this.arrCuoc[2]) {
            this.rewardListArray = this.rewardList10k;
        }
        var ratio = 1;
        if (cc.Global.PLAY_TYPE == Constant.PLAY_TYPE.BALL_2) {
            ratio = this.ratio2Ball;
        }
        this.rewardHuLabel.string = TQUtil.abbreviate(this.rewardListArray[0]*ratio);;
        this.rewardLabel1.string = TQUtil.abbreviate(this.rewardListArray[1]*ratio);
        this.rewardLabel2.string = TQUtil.abbreviate(this.rewardListArray[2]*ratio);
        this.rewardLabel3.string = TQUtil.abbreviate(this.rewardListArray[3]*ratio);
        this.rewardLabel4.string = TQUtil.abbreviate(this.rewardListArray[4]*ratio);
    },

    setUserMoney() {
        this.moneyNode.getComponent(cc.Label).string = TQUtil.abbreviate(DataManger.UserData.getUserMoney());
    },

    onBackClick: function (e) {
        if (e.target.isBlocked) {
            cc.Global.showMessage(i18n.t("luckyshot_msg_leave_room"));
        } else {
            var parentNode = cc.find("Canvas").getChildByName("8PoolGame");
            if (parentNode) {
                parentNode.active = false;
            }
        }

    },

    onDestroy: function () {
        this.removeEventSocket();
    },

    onBtnHistory: function () {
        var node = this.node.getChildByName("historyDialog");
        if (!node) {
            var prefab = cc.instantiate(this.historyPrefab);
            prefab.zIndex = cc.macro.MAX_ZINDEX;
            prefab.getComponent("historyDialog").idGame = GameConstant.IDHUSLOT.idLuckyShot;
            this.node.addChild(prefab);
        } else {
            node.getComponent("historyDialog").idGame = GameConstant.IDHUSLOT.idLuckyShot;
            node.active = true;
        }
    },

    onBtnHonored: function () {
        var node = this.node.getChildByName("honoredDialog");
        if (!node) {
            var prefab = cc.instantiate(this.honoredPrefab);
            prefab.zIndex = cc.macro.MAX_ZINDEX;
            this.node.addChild(prefab);
        } else {
            node.active = true;
        }
    },

    onError: function (data) {
        if (Number(data.status) == 0) {
            cc.Global.showMessage(i18n.t(data.error));
        }
    },

    onBtnBet: function () {
        this.betGroup.active = !this.betGroup.active;
    },

    onBtnSetting: function () {
        PopupShowManager.Instance.showPopupSetting();
    },

    onBtnMoney: function () {
        if (Number(this.arrCuoc[0]) > Number(DataManger.UserData.getUserMoney())) {
            PopupShowManager.Instance.showPopupIAP(true);
        } else {
            PopupShowManager.Instance.showPopupIAP(false);
        }
    }
    // update (dt) {},
});
