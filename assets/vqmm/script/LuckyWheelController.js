var Linker = require('Linker');
var Global = require('Global');
var Constant = require('Constant');
var vqmmSend = require('vqmmSend');
var Api = require('Api');
var Utils = require('Utils');
var i18n = require('i18n');
var SocketConstant = require('SocketConstant');
var DataAccess = require('DataAccess');
var NewAudioManager = require('NewAudioManager');
var TQUtil = require('TQUtil');
var DataManger = require('DataManger');
var i18n = require("i18n");
// var PopupDisplay = require('PopupDisplay');
cc.Class({
    extends: cc.Component,

    properties: {
        txtPrize1: cc.Label,
        txtPrize2: cc.Label,
        txtPrize3: cc.Label,
        txtPrize4: cc.Label,
        txtPrize5: cc.Label,
        txtPrize6: cc.Label,
        txtPrize7: cc.Label,
        txtPrize8: cc.Label,
        txtPrize9: cc.Label,
        txtPrize10: cc.Label,
        txtPrize11: cc.Label,
        background: cc.Sprite,
        itemWheelBonusPrefab: cc.Prefab,
        popupResult: cc.Node,
        txtTimes: cc.Label,
        targetSpin: cc.Node,
        anotherSpin: cc.Node,
        lineVe: cc.Node,
        lineVeCopy: cc.Node,
        buttonPlay: cc.Node,
        prizeLabel: cc.Label,
        winEffect: cc.Node,
    },

    ctor: function () {
        this._startAngle = 0;
        this.isFreeSpin = false;
        this.turnPrize = 1000000;
        this.resetData();
    },

    resetData() {
        this._finalAngle = null;
        this._currentRotationTime = 0;
        this._maxRotationTime = 4;
        this._tmpData = {};
    },

    onLoad() {
        Linker.VQMM = this;

        this.onSetValuePrize();
        //this.rotationLst = [90, 120, 150, 180, 210, 240, 270, 300, 330, 360, 30, 60];
        this.rotationLst = [72, 108, 144, 180, 216, 252, 287, 323, 0, 36];
        this.node.on("result", this.onResult, this);
        this.audioSource = this.node.getComponent(cc.AudioSource);
        var collisionManager = cc.director.getCollisionManager();
        collisionManager.enabled = true;
    },
    addSocketEvent() {
        Linker.Event.addEventListener(80, this.onSendPlay, this);
    },
    onEnable() {
        this.winEffect.active = false;
        this.targetSpin.getChildByName("prinzeContainer").getChildByName("0").getComponent(cc.Label).string = i18n.t("miss");
        this.checkFreeSpin();
    },
    checkFreeSpin() {
        var freeSpin = DataManger.UserData.getFreeSpin();
        if (freeSpin) {
            if (freeSpin.status == true) {
                this.isFreeSpin = true;
            } else {
                var currTimestamp = Number(Date.now());
                var lastTimestamp = new Date(currTimestamp) - 86400000;
                this.isFreeSpin = (lastTimestamp > freeSpin.timestamp) ? true : false;
            }
        }
        this.prizeLabel.string = (this.isFreeSpin) ? i18n.t("Free") : TQUtil.abbreviate(this.turnPrize);
    },
    onDisable() {
    },
    onDestroy() {
        this.node.off("result", this.onResult, this);
    },
    onSetValuePrize() {
        var lst = [0,1000000,2000000,3000000,4000000,5000000,6000000,7000000,8000000,10000000];
        this.lstMoney = lst;
        if (lst.length == 10) {
            this.txtPrize1.string = 'Free';
            this.txtPrize2.string = TQUtil.abbreviate(lst[1]); 
            this.txtPrize3.string = TQUtil.abbreviate(lst[2]);
            this.txtPrize4.string = TQUtil.abbreviate(lst[3]);
            this.txtPrize5.string = TQUtil.abbreviate(lst[4]);
            this.txtPrize6.string = TQUtil.abbreviate(lst[5]);
            this.txtPrize7.string = TQUtil.abbreviate(lst[6]);
            this.txtPrize8.string = TQUtil.abbreviate(lst[7]);
            this.txtPrize9.string = TQUtil.abbreviate(lst[8]);
            this.txtPrize10.string = TQUtil.abbreviate(lst[9]);
            this.txtPrize11.string = TQUtil.abbreviate(lst[10]);
        }
    },
    onBtnPlay(event) {
        this.resetData();
        NewAudioManager.playClick();
        //  this.txtTimes.string=5;
        if (!this.isPlaying) {
            if (!this.isFreeSpin) {
                if (!this.checkEnoughMoney()) {
                    cc.Global.showMessage(i18n.t("bạn không đủ tiền"));
                    return;
                }
            } else {
                this.isFreeSpin = false;
                var currTimestamp = Number(Date.now());
                var freeSpin = { status: this.isFreeSpin, timestamp: currTimestamp };
                DataManger.UserData.setFreeSpin(freeSpin);
            }

            this.isPlaying = true;
            setTimeout(() => {
                Linker.VQMM.isPlaying = false;
            }, 4000);

            var money = this.controlSpinResult();
            this.onResultSpin(money);
            this.winEffect.active = false;
        } else {
            cc.Global.showMessage(i18n.t('Hãy đợi quay xong nhé!'));
        }
    },
    checkEnoughMoney() {
        var myMoney = DataManger.UserData.getUserMoney();
        if (myMoney < this.turnPrize) {
            return false;
        }
        DataManger.UserData.addUserMoney(-this.turnPrize);
        return true;
    },
    controlSpinResult() {
        var valueArr = [0,1000000,2000000,3000000,4000000,5000000,6000000,7000000,8000000,10000000];
        var ratioArr = [30,25,15,10,5,5,4,3,2,1];
        var ratio100 = [];
        var number = 0;
        var index = 0;
        var valueSelected = null;
        for (var i = 0; i < ratioArr.length; i++) {
            number+= ratioArr[i];
            ratio100.push(number);
        }
        var random = Utils.Malicious.randomMinMax(0, ratio100[ratio100.length - 1]);
        for (var i = 0; i < ratio100.length; i++) {
            if (random <= ratio100[i]) {
                index = i;
                break;
            }
        }
        if (index < valueArr.length) {
            valueSelected = valueArr[index];
            return valueSelected;
        }
        return valueSelected;
    },
    onResultSpin(data) {
        if (data == undefined) {
            cc.Global.showMessage(i18n.t('Có lỗi xảy ra, vui lòng thử lại sau'));
        } else {
            if (data >= 0) {
                // var dataTemp=data.data.split('');
                var index=0;
                if (this.buttonPlay) {
                    this.buttonPlay.getChildByName("text").active = false;
                    this.buttonPlay.getComponent(cc.Button).interactable = false;
                }

                if (this.lstMoney && this.lstMoney.length > 0) {
                    this.lstMoney.forEach((item, i) => {
                        if (Number(item) == Number(data)) {
                            index = i;
                        }
                    });
                }

                if(Linker.VQMM){
                    // Linker.VQMM.txtTimes.string=Number(dataTemp[2]) - 1;
                    Linker.VQMM.isPlaying=false;
                }
                var valueRotation = this.rotationLst[index];
                this.targetSpin.angle = 0;
                this._finalAngle = 360 * 3 + valueRotation;
                this._tmpData = data;
                this.isSpin = true;
                
                //set effect quay
                // NewAudioManager.playAudioClipFX(NewAudioManager.SOUND_GAME.VQMM.COMMON.SPIN, 1, false, false, Constant.BUNDLE.VQMM.name);
            } else {
                var msg = i18n.t("Bạn đã hết lượt quay miễn phí.");
                cc.Global.showMessage(msg);
                this.isPlaying = false;
            }

            // Do something and reset.
        }
    },

    onBtnClose() {
        NewAudioManager.playClick();
        cc.Global.ZONE_GAME = 0;
        this.node.parent.active = false;
        // if(this.node.position.x==0 && Math.floor(this.node.position.y)> -308 && Math.floor(this.node.position.y)< -303){
        //     var sceneName = cc.Global.getSceneName();
        //     if(sceneName=='HallScene'){
        //         var spine=cc.find('Canvas/Hall/bottomContainer/content/btn_daily copy');
        //         if(spine){
        //             spine.active=true;
        //             cc.find('Canvas/bg').active=false;
        //             spine.runAction(cc.sequence(cc.delayTime(0.3),cc.moveTo(0.3,spine.x,spine.y+200)));
        //             this.node.runAction(cc.sequence(cc.moveTo(0.3,cc.v2(0, -1000)),cc.callFunc(function (node) {
        //                 node.active = false;
        //             })));
        //         }
        //     }
        // }else{
        //     this.node.parent.active = false;
        // }
    },

    // hide(){
    //     this._super();
    //     this.onBtnClose();
    // },
    onDestroy() {
        // Linker.Event.removeEventListener(14004, this.onSetValuePrize, this);
    },

    setDataQuay(moneyWin) {
        return data = {
            error: null,
            msg: "Chúc mừng bạn đã quay được 2000",
            moneyWin: moneyWin,
            count: 1
        };
    },

    update(dt) {
        if (this.isSpin) {
            this._currentRotationTime += dt;
            if (this._currentRotationTime > this._maxRotationTime || this.targetSpin.eulerAngles.z == this._finalAngle) {
                this._currentRotationTime = this._maxRotationTime;
                this.isSpin = false;
                this.node.emit("result", this._tmpData);
                var message;
                if (this._tmpData > 0)
                {
                    message = i18n.t("congratulations") + TQUtil.abbreviate(this._tmpData);
                    DataManger.UserData.addUserMoney(this._tmpData);
                    cc.Global.showMessage(message);

                    NewAudioManager.playSound(NewAudioManager.sound.money_fly);
                    this.winEffect.opacity = 255;
                    this.winEffect.active = true;
                    this.scheduleOnce(function() {
                        if (this.winEffect && this.winEffect.active) {
                            this.winEffect.active = false;
                        }
                    }.bind(this), 2);
                }
                else
                {
                    var msg = i18n.t("Good Luck Next Time !");
                    cc.Global.showMessage(msg);
                }
                this._startAngle = this._finalAngle % 360;
                this.prizeLabel.string = (this.isFreeSpin) ? i18n.t("Free") : TQUtil.abbreviate(this.turnPrize);
            }

            var t = this._currentRotationTime / this._maxRotationTime;

            // Công thức cho phép tăng tốc lúc bắt đầu và giảm tốc ở gần cuối vòng quay.
            t = t * t * t * (t * (6 * t - 15) + 10);
            var angle = cc.misc.lerp(this._startAngle, this._finalAngle, t);
            this.targetSpin.angle = angle;
        }
    },

    onResult(message) {
        var self = this;
        if (this.buttonPlay) {
            this.buttonPlay.getChildByName("text").active = true;
            this.buttonPlay.getComponent(cc.Button).interactable = true;
        }
        // this.lineVe.active = true;
        // this.lineVeCopy.active = true;
        // var tween = cc.tween().repeat(6, 
        //     cc.tween().to(0.1, {scale: 1.05}, {easing: "smooth"}).to(0.1, {scale: 0.9}, {easing: "smooth"}).call(() => {
        //         self.audioSource.play();
        //     })).to(0.1, {scale: 1});
        // tween.clone(this.lineVe).start();
        // DataAccess.Instance.requestUserData();
        if (Number(message) > 0) {
            // NewAudioManager.PlayUrl(Linker.gameLanguage=="vi"?NewAudioManager.SOUND_GAME.BIDA.VI.GET_REWARD:NewAudioManager.SOUND_GAME.BIDA.EN.GET_REWARD);
            // this.txtTimes.string = message.data[1];
        }
    },
});