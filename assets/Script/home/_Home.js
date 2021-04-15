var functionAll = require('functionAll');
var Linker = require("Linker");
import { Constant } from "../lib/Constant2";
var BiDaConstant = require('BiDaConstant');
var NewAudioManager = require('NewAudioManager');
var PopupShowManager = require('PopupShowManager');
var DataManger = require('DataManger');
var TQUtil = require('TQUtil');
var i18n = require('i18n');
cc.Class({
    extends: cc.Component,
    ctor() {
        this.isPopUp = false;
        this.sound = true;
        var splash = cc.find("Canvas/_Splash");
    },
    properties: {
        func: functionAll,
        setting: cc.Prefab,
        muaCuoc: cc.Prefab,
        musicMp3: {
            default: null,
            type: cc.AudioClip
        },
        soundMp3: {
            default: null,
            type: cc.AudioClip
        },
        gameController: cc.Prefab,
        avatar: cc.Node,
        money: cc.Node,
        level: cc.Label,
        percent: cc.ProgressBar,
        namePlayer: cc.Label,
        avatarPlayer: cc.Sprite,
        txtLevel: cc.Label,
        txtVideo: cc.Label,
        txtMoreGame: cc.Label,
        txtGame1: cc.Label,
        txtGame2: cc.Label,
        buyPrefab: cc.Prefab,
        messagePrefab: cc.Prefab,
        labelMoney: cc.Label,
        dailyGiftPrefab: cc.Prefab,
        quaTangHangNgayPrefab: cc.Prefab,
        moreGamePrefab: cc.Prefab,
        loading: cc.Node,
        vqmmPrefab: cc.Prefab,
        avatarAtlas:cc.SpriteAtlas,

        API_URL: cc.String = "http://api.vipgame.com:3200/",
        API_URL_IMAGE: cc.String = "http://api.vipgame.com:3200/images_8pool/",
        FILE_NAME: cc.String = "8poolconfig.json",
        btnHead: cc.Sprite,
        btnSoccer: cc.Sprite,
    },
    onLoad() {
        Linker._Home = this;
        var shadow = cc.find("Canvas/_Home/shadow");
        cc.tween(shadow).to(0.1, {opacity: 0}).start();
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, () => {
            if (event.keyCode === cc.macro.KEY.back || event.keyCode === cc.macro.KEY.backspace || event.keyCode === cc.macro.KEY.escape) {
                cc.audioEngine.stopAll();
                cc.game.end();
            }
        }, this.node);
        // this.func.removeData("setting"); // reset all data, choi lai tu dau
        var setting = this.func.getData("setting");
        this.func.createDailyGift();
        //////////////////////////////////////////////

        if (!setting) {
            setting = this.func.createSettingData();
            this.func.createTable();
            this.func.createTable2();
            this.func.createTable3();
            this.func.createReport();
        }
        if (!setting.date) {
            setting.date = new Date().getTime();
            this.func.updateSetting(setting);
        } else {
            var dayCount = Math.floor((new Date() - new Date(setting.date)) / 1000 / 60 / 60 / 24);
            if (dayCount > 0) {
                setting.date = new Date().getTime();
                this.func.updateSetting(setting);
                // tặng quà hằng ngày
                cc.audioEngine.stopAll();
                setTimeout(() => {
                    DataManger.UserData.addUserMoney(DataManger.MoneyConfig.ADS);
                    // setTimeout(() => {
                    //     this.updateAfter();
                    // }, 2000);
                }, 500);

            }
        }
        NewAudioManager.LoadSoundGame(function(err){
            if (!err) {
                NewAudioManager.playBackground();
            }
        }.bind(this));
        //Update setting game
        Linker.ZONE = BiDaConstant.ZONE_ID.ZONEID_BIDA_LUCKY_SHOT;
        this.initLanguage();
        this.loading.active = false;
        DataManger.signalUpdateUserInfo.add(this.onUpdateUserInfo.bind(this));
        this.checkShowVQMM();
        this.loadResouceTable();
        this.onUpdateUserInfo();
        this.initLanguage();
        this.getDataFromAPI();
    },

    getDataFromAPI() {
        console.log("getDataFromAPI:",this.API_URL + this.FILE_NAME);
        cc.assetManager.loadRemote(this.API_URL + this.FILE_NAME, function (_err, data) {
            console.log("_err:",_err);
            if (data != null) {
                this.initFirtGame(data.json.listGame);
            }
        }.bind(this));
    },

    initFirtGame: function (listGame) {
        this.dataSoccer = listGame[0];
        cc.assetManager.loadRemote(this.API_URL_IMAGE + this.dataSoccer.avatar, cc.Texture2D, function (err, texture) {
            if (!err) {
                var spriteFrame = new cc.SpriteFrame(texture);
                if (spriteFrame) {
                    this.btnSoccer.spriteFrame = spriteFrame;
                }
            }
        }.bind(this));

        this.dataHead = listGame[1];
        cc.assetManager.loadRemote(this.API_URL_IMAGE + this.dataHead.avatar, cc.Texture2D, function (err, texture) {
            if (!err) {
                var spriteFrame = new cc.SpriteFrame(texture);
                if (spriteFrame) {
                    this.btnHead.spriteFrame = spriteFrame;
                }
            }
        }.bind(this));
    },

    initLanguage() {
        var isCheck = false;
        var languageArr = Object.entries(BiDaConstant.LANGUAGE);
        for (var i = 0; i < languageArr.length; i++) {
            if (languageArr[i][1] == cc.sys.language) {
                isCheck = true;
                break;
            }
        }
        var myLanguage = DataManger.UserData.getLanguage();
        if (!myLanguage) {
            myLanguage = (isCheck) ? cc.sys.language : BiDaConstant.LANGUAGE.ENGLISH;
            DataManger.UserData.setLanguage(cc.sys.language);
        }
        Linker.gameLanguage = myLanguage;
        i18n.init(Linker.gameLanguage);
    },

    checkShowVQMM() {
        var freeSpin = DataManger.UserData.getFreeSpin();
        if (freeSpin) {
            if (freeSpin.status == true) {
                this.onBtnVQMM();
            } else {
                var currTimestamp = Number(Date.now());
                var lastTimestamp = new Date(currTimestamp) - 86400000;
                var isFreeSpin = (lastTimestamp > freeSpin.timestamp) ? true : false;
                if (isFreeSpin) {
                    var freeSpin = { status: isFreeSpin, timestamp: currTimestamp };
                    DataManger.UserData.setFreeSpin(freeSpin);
                    this.onBtnVQMM();
                }
            }
        }
    },

    loadResouceTable() {
        cc.resources.loadDir("table", cc.SpriteFrame, function (error, data) {
            if (!error) {
                cc.Global.tableArray = data;
            }
        }.bind(this));
    },

    onUpdateUserInfo(){
        var money = this.money.getChildByName("label_money");
        money.getComponent(cc.Label).string = TQUtil.abbreviate(DataManger.UserData.getUserMoney());

        var name = this.avatar.getChildByName("label_name");
        name.getComponent(cc.Label).string = DataManger.UserData.getUserName();

        var spriteFrame = this.avatarAtlas.getSpriteFrame("avatar_" + (DataManger.UserData.getUserAvatar() + 1));
        if (spriteFrame) {
            this.avatarPlayer.spriteFrame = spriteFrame;
        }
    },
    
    onEnable() {
        this.updateInfo();
        this.updateText();

        var setting = this.func.getData("setting");
        if (setting) {
            cc.resources.load("banchoi/" + setting.backGround, cc.SpriteFrame, (err, spriteFrame) => {
                if (!err) {
                    this.node.getChildByName("bg").getComponent(cc.Sprite).spriteFrame = spriteFrame;
                }
            })
        }
    },
    onDisable() {

    },
    updateInfo: function () {
        var tableGame2 = this.func.getData("tableGame2");
        // var percent = this.percent.progress;
        // percent = wallet.percent;
        this.level.string = "Level: " + tableGame2.computer3.level;
        var _this = this;
        cc.resources.load("caidat/" + tableGame2.computer3.urlAvatar, cc.SpriteFrame, (err, spriteFrame) => {
            if (!err) {
                _this.avatar.getChildByName("btn_avatar").getComponent(cc.Sprite).spriteFrame = spriteFrame;
                _this.avatar.getChildByName("btn_avatar").width = 62;
                _this.avatar.getChildByName("btn_avatar").height = 62;
            }
            else {
                cc.resources.load("banchoi/" + tableGame2.computer3.urlAvatar, cc.SpriteFrame, (err, spriteFrame) => {
                    if (!err) {
                        _this.avatar.getChildByName("btn_avatar").getComponent(cc.Sprite).spriteFrame = spriteFrame;
                        _this.avatar.getChildByName("btn_avatar").width = 62;
                        _this.avatar.getChildByName("btn_avatar").height = 62;
                    }
                });
            }
        });
    },

    exitGame() {
        cc.audioEngine.stopAll();
        cc.delayTime(2);
        cc.game.end();
    },
    start() {
        this.active = false;
        this.nhanQua();
    },
    nhanQua() {
        var dailyGift = this.func.getData("dailyGift");
        var delta = Date.now() - dailyGift.consecutiveLogin.date;
        if (Math.floor(86400000 / delta) >= 1) {
            var qthn = cc.instantiate(this.quaTangHangNgayPrefab);
            this.node.parent.addChild(qthn);
            qthn.zIndex = cc.macro.MAX_ZINDEX - 100;
        }
        else if (Math.floor(86400000 / delta) < 1 && delta < -84600000) {
            dailyGift.consecutiveLogin.count = 1;
            var cur = new Date().toString().split(" ");
            cur[4] = "00:00:00";
            cur = cur.join(" ");
            dailyGift.consecutiveLogin.date = new Date(cur).getTime();

            var qthn = cc.instantiate(this.quaTangHangNgayPrefab);
            this.node.parent.addChild(qthn);
            qthn.zIndex = cc.macro.MAX_ZINDEX - 100;
        }
        this.func.setData("dailyGift", dailyGift);
    },
    clickGameStart() {
        NewAudioManager.playClick();
        Constant.CurrentGameMode = Constant.GameMode.ScoreMode;
        setTimeout(() => {
            if (!this.isPopUp) {
                var scoreMode = this.func.getData("scoreMode");
                if (scoreMode == null) {
                    this.func.setData("scoreMode", false); // lần đầu tiên tải ứng dụng về chơi
                }
                this.func.setData("playGame", "ScoreMode");
                cc.audioEngine.stopAll();
                var game = cc.instantiate(this.gameController);
                this.node.parent.addChild(game);
                this.node.destroy();
            }
        }, 100);
    },
    clickGameStart2() {
        NewAudioManager.playClick();
        Constant.CurrentGameMode = Constant.GameMode.CoinMode;
        setTimeout(() => {
            var coinsMode = this.func.getData("coinsMode");    // đang chơi dở hay ko
            if (coinsMode == null) {
                coinsMode = false;
                this.func.setData("coinsMode", false);
            }
            if (coinsMode) {
                this.func.setData("playGame", "CoinsMode");
                cc.audioEngine.stopAll();
                var game = cc.instantiate(this.gameController);
                this.node.parent.addChild(game);
                this.node.destroy();
            } else {
                this.active = false;
                this.isPopUp = true;
                var muaCuoc = cc.find("Canvas/_Home/_MucCuoc");
                if (muaCuoc)
                {
                    muaCuoc.active = true;
                }
                else
                {
                    muaCuoc = cc.instantiate(this.muaCuoc);
                    this.node.addChild(muaCuoc);
                }
            }
        }, 100);
    },
    clickGameStart3() {
        cc.audioEngine.stopAll();
        var game = cc.instantiate(this.gameController);
        this.node.parent.addChild(game);
        this.node.destroy();
    },
    clickGameNhatAnTat() {
        NewAudioManager.playClick();
        Constant.CurrentGameMode = Constant.GameMode.NhatAnTatMode;
        setTimeout(() => {
            var coinsMode = this.func.getData("nhatAnTatMode");    // đang chơi dở hay ko
            if (coinsMode == null) {
                coinsMode = false;
                this.func.setData("nhatAnTatMode", false);
            }
            if (coinsMode) {
                this.func.setData("playGame", "NhatAnTatMode");
                cc.audioEngine.stopAll();
                var game = cc.instantiate(this.gameController);
                this.node.parent.addChild(game);
                this.node.destroy();
            } else {
                this.active = false;
                this.isPopUp = true;
                var muaCuoc = cc.instantiate(this.muaCuoc);
                this.node.addChild(muaCuoc);
            }
        }, 100);
    },
    clickSetting() {
        NewAudioManager.playClick();
        setTimeout(() => {
            cc.audioEngine.stopAll();
            this.active = false;
            // this.node.active = false;
            var setting = cc.find("Canvas/_Setting");
            if (setting)
                setting.active = true;
            else {
                setting = cc.instantiate(this.setting);
                this.node.parent.addChild(setting);
            }
        }, 100);
    },
    clickTable: function () {
        NewAudioManager.playClick();
        var table = this.node.parent.getChildByName("_Buy");
        if (table) {
            table.active = true;
        }
        else {
            table = cc.instantiate(this.buyPrefab);
            this.node.parent.addChild(table);
        }
        table.zIndex = 10;
    },
    clickAvatar: function () {
        NewAudioManager.playClick();
        PopupShowManager.Instance.showPopupUserInfor();
    },
    clickFacebook() {
        NewAudioManager.playClick();
        this.active = false;
        //cc.sys.openURL("http://fb.com/");
    },
    clickChplay() {
        NewAudioManager.playClick();
        this.active = false;
        cc.sys.openURL("https://play.google.com/store/apps/details?id=zepplay.eightpool.ballslot");
    },
    clickSime() {
        NewAudioManager.playClick();
        this.active = false;
        cc.sys.openURL("https://play.google.com/store/apps/details?id=zepplay.headsupper.soccer");
    },
    clickFaco() {
        NewAudioManager.playClick();
        this.active = false;
        cc.sys.openURL("https://play.google.com/store/apps/details?id=zepplay.soccer.hand");
    },
    clickPolicy() {
        cc.sys.openURL("https://www.freeprivacypolicy.com/privacy/view/6b0f562d1bd93edd98a1b8830d8e6156");
    },
    
    // update (dt) {},
    updateMoney2() {
        this.labelMoney.string = TQUtil.abbreviate(DataManger.UserData.getUserMoney());        
    },
    updateText: function () {

    },
    onClickAdsVideo: function () {
        NewAudioManager.playClick();
        Linker.MySdk.showRewarded();
    },
    onMessage: function (event) {
        NewAudioManager.playClick();
        var message = this.node.parent.getChildByName("_Message");
        if (message) {
            message.active = true;
        }
        else {
            message = cc.instantiate(this.messagePrefab);
            this.node.parent.addChild(message);
        }
    },
    onDailyGift: function () {
        NewAudioManager.playClick();
        var dailyGift = cc.find("Canvas/_DailyGift");
        if (dailyGift) {
            dailyGift.active = true;
        }
        else {
            dailyGift = cc.instantiate(this.dailyGiftPrefab);
            cc.find("Canvas").addChild(dailyGift);
            dailyGift.zIndex = 10;
        }
    },

    onClick() {
        NewAudioManager.playClick();
    },
    onClickMoreGame: function (event) {
        NewAudioManager.playClick();
        PopupShowManager.Instance.showPopupMoreGame();
    },
    
    onBtnStore(event, data){
        NewAudioManager.playClick();
        if(parseInt(data) === 1){
            PopupShowManager.Instance.showPopupStick();
        }else{
            PopupShowManager.Instance.showPopupTable();
        }
    },

    onBtnPlay(event, type) {
        NewAudioManager.playClick();
        // cc.Global.showLoading();
        cc.Global.PLAY_TYPE = Number(type);
        var billardGame = cc.find("Canvas").getChildByName("8PoolGame");
        if (billardGame) {
            billardGame.active = true;
            billardGame.position = cc.v2(0, 0);
            this.initBan(billardGame, event);
        } else {
            this.loading.active = true;
            cc.resources.load("bida/prefabs/8PoolGame", cc.Prefab, function (completedCount, totalCount, item) {
                var percent = Math.round(100 * completedCount / totalCount);
                var str = percent + '%';
                // cc.log(str);
                if (this.loading && this.loading.getComponent("LoadingGame")) {
                    var loadingJs = this.loading.getComponent("LoadingGame");
                    loadingJs.setPrecent(str);          
                }
            }.bind(this), function (err, prefab) {
                this.loading.active = false;
                if (!err) {
                    // cc.Global.hideLoading();
                    var child = cc.instantiate(prefab);
                    cc.find("Canvas").addChild(child);
                    child.position = cc.v2(0, 0);
                    event.isLuckyShot = true;
                    this.initBan(child, event);
                }
            }.bind(this));
        }
    },

    initBan: function (billardGame, event) {
        var data = null;
        var _billardGameTable = billardGame.getComponent("BillardsGameTable");
        if (_billardGameTable) {
            _billardGameTable.init();
        }
    },

    onBtnVQMM: function () {
        NewAudioManager.playClick();
        PopupShowManager.Instance.showPopupVQMM();
    },

    onBtnIAP: function () {
        NewAudioManager.playClick();
        PopupShowManager.Instance.showPopupIAP();
    },

    onBtnSetting: function () {
        NewAudioManager.playClick();
        PopupShowManager.Instance.showPopupSetting(false);
    },

    onAddMoney(){
        NewAudioManager.playClick();
        DataManger.UserData.addUserMoney(10000000);        
    }
});
