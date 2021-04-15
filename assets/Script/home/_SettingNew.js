var functionAll = require("functionAll");


import {
    Constant
} from "../lib/Constant2";

cc.Class({
    extends: cc.Component,
    properties: {
        en: cc.Toggle,
        vn: cc.Toggle,
        effect: cc.Toggle,
        background: cc.Toggle,

        func: functionAll,
        txtTitle: cc.Label,
        txtLanguage: cc.Label,
        txtSound: cc.Label,
        txtEffect: cc.Label,
        txtBackground: cc.Label,
        musicMp3 : {
            default : null,
            type : cc.AudioClip
        },
        soundMp3 : {
            default : null,
            type : cc.AudioClip
        },
        exitGame: cc.Node,
        txtExit: cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.opacity = 0;
        cc.tween(this.node).to(0.18, {opacity: 255}).start();
    },

    onEnable () {
        var setting = this.func.getData("setting");
        switch (setting.language)
        {
            case "vn":
                this.txtTitle.string = "Cài đặt";
                this.txtSound.string = "Âm thanh";
                this.txtLanguage.string = "Ngôn ngữ";
                this.txtEffect.string = "Hiệu ứng";
                this.txtBackground.string = "Nhạc nền";
                this.txtExit.string = "Thoát game";
                this.vn.isChecked = true;
                break;
            case "en":
                this.txtTitle.string = "Setting";
                this.txtSound.string = "Sound";
                this.txtLanguage.string = "Language";
                this.txtEffect.string = "Effect";
                this.txtBackground.string = "Background";
                this.txtExit.string = "Exit game";
                this.en.isChecked = true;
                break;
        }
        this.effect.isChecked = setting.sound;
        this.background.isChecked = setting.music;
        this.en.node.on("toggle", this.clickNgonNgu, this);
        this.vn.node.on("toggle", this.clickNgonNgu, this);
        this.effect.node.on("toggle", this.clickAmThanh, this);
        this.background.node.on("toggle", this.clickNhacNen, this);

        var setting = this.func.getData("setting");
        if (setting.music)
        {
            this.music = cc.audioEngine.play(this.musicMp3, true, 0.7);
        }
        this.exitGame.active = false;
    },

    onDisable () {
        this.en.node.off("toggle", this.clickNgonNgu, this);
        this.vn.node.off("toggle", this.clickNgonNgu, this);
        this.effect.node.off("toggle", this.clickAmThanh, this);
        this.background.node.off("toggle", this.clickNhacNen, this);

        var setting = this.func.getData("setting");
        var gameControler = cc.find("Canvas/_GameController");
        if (gameControler)
        {
            
            gameControler.getComponent("_GameController").updateText(setting);
        }
        var home = cc.find("Canvas/_Home");
        if (home)
        {
            home.getComponent("_Home").updateText();
        }
    },

    start() {
    },
    // update (dt) {},

    onToggle: function(event) {
        // debugger
    },
    clickAmThanh(event){
        var setting = this.func.getData("setting");
        setting.sound = event.isChecked;
        if (event.isChecked && setting)
        {
            cc.audioEngine.play(this.soundMp3,false,0.7);
        }
        else
        {
            cc.audioEngine.stopAll();
        }
        this.updateSetting(setting);
    },
    clickNhacNen(event){
        var setting = this.func.getData("setting");
        setting.music = event.isChecked;
        if (event.isChecked && setting)
        {
            cc.audioEngine.play(this.musicMp3, false, 1);
        }
        else
        {
            cc.audioEngine.stopAll();
        }
        this.updateSetting(setting);
    },
    clickNgonNgu(event){
        var _this = this;
        var setting = this.func.getData("setting");
        if(setting.sound){
            cc.audioEngine.play(this.soundMp3,false,1);
        }
        switch (event.target.name)
        {
            case "vietnamese":
                this.txtTitle.string = "Cài đặt";
                this.txtSound.string = "Âm thanh";
                this.txtLanguage.string = "Ngôn ngữ";
                this.txtEffect.string = "Hiệu ứng";
                this.txtBackground.string = "Nhạc nền";
                this.txtExit.string = "Thoát game";
                setting.language = "vn";
                // this.en.isChecked = false;
                // // this.vn.isChecked = true;
                // this.vn.getComponent(cc.BlockInputEvents).enable = true;
                // this.en.getComponent(cc.BlockInputEvents).enable = false;
                break;
            case "english":
                this.txtTitle.string = "Setting";
                this.txtSound.string = "Sound";
                this.txtLanguage.string = "Language";
                this.txtEffect.string = "Effect";
                this.txtBackground.string = "Background";
                this.txtExit.string = "Exit game";
                setting.language = "en";
                // this.vn.isChecked = false;
                // // this.en.isChecked = true;
                // this.vn.getComponent(cc.BlockInputEvents).enable = false;
                // this.en.getComponent(cc.BlockInputEvents).enable = true;
                break;
        }
        this.updateSetting(setting);
        this.updateText();
    },
    updateSetting(setting){
        this.func.setData("setting", setting);
        var home = cc.find("Canvas/_Home");
        if (home)
        {
            home.getComponent("_Home").updateAfter();
        }
        var gameControler = cc.find("Canvas/_GameController");
        if (gameControler)
        {
            gameControler.getComponent("_GameController");
        }
    },
    onClose() {
        cc.tween(this.node).to(0.15, {opacity: 0}).start();
        this.scheduleOnce(() => {
            this.node.destroy(true);
        }, 0.15);
    },
    updateText: function() {
        var setting = this.func.getData("setting");
        var home = cc.find("Canvas/_Home");
        if (home)
        {
            var _home = home.getComponent("_Home");
            _home.updateText();
        }

        var gameControler = cc.find("Canvas/_GameController");
        if (gameControler)
        {
            var gameMode = gameControler.getComponent("_GameController").gameMode;
            switch (gameMode)
            {
                case Constant.GameMode.NhatAnTatMode:
                    gameControler.getComponent("_GameController").txtMode.string = setting.language == "en" ? "Rules: First win" : "Luật: Nhất ăn tất";
                    break;
                case Constant.GameMode.CoinMode:
                    gameControler.getComponent("_GameController").txtMode.string = setting.language == "en" ? "Rules: Classic" : "Luật: Truyền thống";
                    break;
                case Constant.GameMode.DemLaMode:
                    gameControler.getComponent("_GameController").txtMode.string = setting.language == "en" ? "Rules: Count left" : "Luật: Đếm lá";
                    break;
            }
            var betting = this.func.getData("tableGame2").table.betting;
            if (betting > 999) {
                gameControler.getComponent("_GameController").txtBetting.string = setting.language == "en" ? "Bet: $" + this.func.moneyWithFormat(betting, ".") : "Cược: $" + this.func.moneyWithFormat(betting, ".");
            } else {
                gameControler.getComponent("_GameController").txtBetting.string = setting.language == "en" ? "Bet: $" + betting : "Cược: $" + betting;
            }

            gameControler.getComponent("_GameController").computer3.txtName.string = setting.language == "en" ? "Me" : "Tôi";
            gameControler.getComponent("_GameController").playerGame.txtName.string = setting.language == "en" ? "Me" : "Tôi";

            gameControler.getComponent("_GameController").language = setting.language;
        }
    },
    onExitGame() {
        this.exitGame.active = true;
    }
});
