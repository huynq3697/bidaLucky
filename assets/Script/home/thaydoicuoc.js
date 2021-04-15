// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
var functionAll = require('functionAll');
var Constant = require('Constant2').Constant;
cc.Class({
    extends: cc.Component,
    ctor() {
        this.userMoney = 0;
        this.mucCuoc = 50;
        this.sound = true;
    },
    properties: {
        func: functionAll,
        txtMoney: cc.Label,
        txtTitle: cc.Label,
        txtDongY: cc.Label,
        thanhCuoc: cc.Node,
        bgThanhCuoc: cc.Node,
        soundMp3: {
            default: null,
            type: cc.AudioClip
        },
        modeGame: cc.ToggleContainer,
        listBg: cc.Node,
        bgThanhCuoc: cc.Node,
        lightYellow: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
    },
    clickCuoc(node) {
        var mucCuoc = parseInt(node.target.name);
        var iconLst = this.thanhCuoc.children;

        if (Constant.CurrentGameMode != Constant.GameMode.DemLaMode)
        {
            if (mucCuoc * 5 < this.userMoney) {
                if (this.sound) {
                    cc.audioEngine.play(this.soundMp3, false, 1);
                }
                iconLst.forEach(icon => {
                    icon.opacity = 0;
                });
                this.mucCuoc = mucCuoc;
                node.target.opacity = 255;

                var index = this.thanhCuoc.children.indexOf(node.target);
                for (var i = 0; i < this.thanhCuoc.childrenCount; ++i)
                {
                    if (i == index)
                    {
                        this.listBg.children[i].active = true;
                        this.bgThanhCuoc.children[i].color = new cc.Color(0, 0, 0);
                        this.lightYellow.children[i].active = true;

                    }
                    else
                    {
                        this.listBg.children[i].active = false;
                        this.bgThanhCuoc.children[i].color = new cc.Color(255, 255, 255);
                        this.lightYellow.children[i].active = false;
                    }
                }
            }
        }
        else
        {
            if (mucCuoc * 50 < this.userMoney) {
                if (this.sound) {
                    cc.audioEngine.play(this.soundMp3, false, 1);
                }
                iconLst.forEach(icon => {
                    icon.opacity = 0;
                });
                this.mucCuoc = mucCuoc;
                node.target.opacity = 255;

                var index = this.thanhCuoc.children.indexOf(node.target);
                for (var i = 0; i < this.thanhCuoc.childrenCount; ++i)
                {
                    if (i == index)
                    {
                        this.listBg.children[i].active = true;
                        this.bgThanhCuoc.children[i].color = new cc.Color(0, 0, 0);
                        this.lightYellow.children[i].active = true;

                    }
                    else
                    {
                        this.listBg.children[i].active = false;
                        this.bgThanhCuoc.children[i].color = new cc.Color(255, 255, 255);
                        this.lightYellow.children[i].active = false;
                    }
                }
            }
        }
    },
    // start () {
    onEnable () {
        var userMoney = this.func.getData("tableGame2").computer3.Money;
        this.txtMoney.string = userMoney > 999 ? parseInt(userMoney / 1000) + "K" : userMoney;
        this.userMoney = userMoney;
        var iconLst = this.thanhCuoc.children;
        var txt = this.bgThanhCuoc.children;
        txt.forEach(element => {
            element.opacity = 255;
        });
        for (let i = 0; i < iconLst.length; i++) {
            if (i == 0 && userMoney < 50 * 5 && Constant.CurrentGameMode != Constant.GameMode.DemLaMode) {
                iconLst[0].opacity = 0;
                txt[0].opacity = 100;
                this.mucCuoc = 0;
            }
            else if (i == 0 && userMoney < 50 / 50 && Constant.CurrentGameMode == Constant.GameMode.DemLaMode) {
                iconLst[0].opacity = 0;
                txt[0].opacity = 100;
                this.mucCuoc = 0;
            }
            else if (i > 0) {
                iconLst[i].opacity = 0;
                if (userMoney < parseInt(iconLst[i].name) * 5 && Constant.CurrentGameMode != Constant.GameMode.DemLaMode) {
                    txt[i].opacity = 100;
                }
                else if (userMoney <= parseInt(iconLst[i].name) * 50 && Constant.CurrentGameMode == Constant.GameMode.DemLaMode) {
                    txt[i].opacity = 100;
                }
            }
        }
        this.bgThanhCuoc.children.forEach(element => {
            if (this.bgThanhCuoc.children.indexOf(element) == 0)
            {
                element.color = new cc.Color(0, 0, 0);
            }
            else
            {
                element.color = new cc.Color(255, 255, 255);
            }
        });

        this.listBg.children.forEach(element => {
            if (this.listBg.children.indexOf(element) == 0)
            {
                element.active = true;
            }
            else
            {
                element.active = false;
            }
        });
        this.lightYellow.children.forEach(element => {
            element.active = false;
        });
    },
    thayDoiCuoc() {
        if (this.mucCuoc > 0) {
            if (this.sound) {
                cc.audioEngine.play(this.soundMp3, false, 1);
            }
            setTimeout(function () {
                var parent = this.node.parent.parent;
                if (parent.name == "_Home") {
                    if (Constant.CurrentGameMode == Constant.GameMode.CoinMode) {
                        var tableGame2 = this.func.getData("tableGame2");
                        tableGame2.table.betting = this.mucCuoc;
                        this.func.setData("tableGame2", tableGame2);
                        this.func.setData("playGame", "CoinsMode");
                        this.func.setData("coinsMode", false); // lần đầu tiên  vào game và đặt cược  
                        parent.getComponent("_Home").clickGameStart3();
                    } else if (Constant.CurrentGameMode == Constant.GameMode.DemLaMode) {
                        var tableGame = this.func.getData("tableGame3");
                        tableGame.table.betting = this.mucCuoc;
                        this.func.setData("tableGame3", tableGame);
                        this.func.setData("playGame", "DemLaMode");
                        this.func.setData("demLaMode", false); // lần đầu tiên  vào game và đặt cược  
                        parent.getComponent("_Home").clickGameStart3();
                    } else if (Constant.CurrentGameMode == Constant.GameMode.NhatAnTatMode) {
                        var tableGame2 = this.func.getData("tableGame2");
                        tableGame2.table.betting = this.mucCuoc;
                        this.func.setData("tableGame2", tableGame2);
                        this.func.setData("playGame", "NhatAnTatMode");
                        this.func.setData("nhatAnTatMode", false); // lần đầu tiên  vào game và đặt cược  
                        parent.getComponent("_Home").clickGameStart3();
                    }

                } else {
                    parent.getComponent("_GameController").updateTangCuoc(this.mucCuoc); // thiết lập lại giá trị cược
                    this.node.parent.destroy();
                    var gameController = cc.find("Canvas/_GameController");
                    if (gameController)
                    {
                        gameController.getComponent("_GameController").start();
                    }
                }
            }.bind(this), 100);
        } else {
            cc.log("Không đủ tiền đặt cược");
            this.func.setData("coinsMode", false); // lần đầu tiên  vào game và đặt cược  
            var parent = this.node.parent;
            this.node.parent.destroy();
            if (parent.name == "_Home") {
                parent.getComponent("_Home").clickStore();
            } else {
                if (this.sound) {
                    cc.audioEngine.play(this.soundMp3, false, 1);
                }
                cc.director.loadScene('home');
            }
        }
    },
    // update (dt) {},
});