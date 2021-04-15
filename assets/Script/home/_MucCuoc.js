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
        lightYellow: cc.Node,
        txtChoi: [cc.Label],
        txtChonMucCuoc:[cc.Label],
        txtTruyenThong: cc.Label,
        txtNhatAnTat: cc.Label,
        txtDemLa: cc.Label,
        buyPrefab: cc.Prefab,
        txtTable: cc.Label,
        txtPercent: cc.Label,
        txtDetail: cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
    },
    activeMoney: function(mucCuoc)
    {
        var userMoney = this.func.getData("tableGame2").computer3.Money;
        this.txtMoney.string = userMoney > 999 ? parseInt(userMoney / 1000) + "K" : userMoney;
        this.userMoney = userMoney;
        var iconLst = this.thanhCuoc.children;
        var txt = this.bgThanhCuoc.children;
        txt.forEach(element => {
            element.opacity = 255;
        });
        for (let i = 0; i < iconLst.length; i++) {
            if (i == 0 && userMoney < 50 * mucCuoc && Constant.CurrentGameMode != Constant.GameMode.DemLaMode) {
                iconLst[0].opacity = 0;
                txt[0].opacity = 100;
                this.mucCuoc = 0;
            }
            else if (i == 0 && userMoney < 50 / mucCuoc && Constant.CurrentGameMode == Constant.GameMode.DemLaMode) {
                iconLst[0].opacity = 0;
                txt[0].opacity = 100;
                this.mucCuoc = 0;
            }
            else if (i > 0) {
                iconLst[i].opacity = 0;
                if (userMoney <= parseInt(iconLst[i].name) * 5 && Constant.CurrentGameMode != Constant.GameMode.DemLaMode) {
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
        this.hidePopup();
        var userMoney = this.func.getData("tableGame2").computer3.Money;
        this.txtMoney.string = userMoney > 999 ? parseInt(userMoney / 1000) + "K" : userMoney;
        this.userMoney = userMoney;
        this.activeMoney(5);
        var setting = this.func.getData("setting");
        this.sound = setting.sound;
        if (setting.language != "vn") {
            if (this.txtTitle)
                this.txtTitle.string = "Your Money:";
            this.txtDongY.string = "Ok";
        }

        setting.language == "en" ? this.txtDetail.string = "Chance to x2, x3 WIN BET" : this.txtDetail.string = "Phần trăm cơ hội x2, x3 cược KHI THẮNG";

        if (setting.language == "en")
        {
            this.txtTable.string = "Table:";
            this.txtChoi.forEach(element => {
                element.string = "OK";
            })
            this.txtChonMucCuoc.forEach(element => {
                element.string = "CHOOSE YOUR BET";
            });
            this.txtNhatAnTat.string = "First Win";
            this.txtTruyenThong.string = "Classic";
            this.txtDemLa.string = "Count left";
        }
        else
        {
            this.txtTable.string = "Bàn:";
            this.txtChoi.forEach(element => {
                element.string = "CHƠI";
            });
            this.txtChonMucCuoc.forEach(element => {
                element.string = "CHỌN MỨC CƯỢC";
            });
            this.txtNhatAnTat.string = "Nhất ăn tất";
            this.txtTruyenThong.string = "Truyền thống";
            this.txtDemLa.string = "Đếm lá";
        }
        switch (Constant.CurrentGameMode)
        {
            case Constant.GameMode.CoinMode:
                this.modeGame.toggleItems[0].isChecked = true;
                break;
            case Constant.GameMode.DemLaMode:
                this.modeGame.toggleItems[2].isChecked = true;
                break;
            case Constant.GameMode.NhatAnTatMode:
                this.modeGame.toggleItems[1].isChecked = true;
                break;
        }
        this.activeMoney();
        if (this.node.parent.name == "_Home")
        {
            this.node.getChildByName("popup_muccuoc").active = true;
            this.node.getChildByName("popup_muccuoc2").active = false;
        }
        else if (this.node.parent.name == "_GameController")
        {
            this.node.getChildByName("popup_muccuoc").active = false;
            this.node.getChildByName("popup_muccuoc2").active = true;
        }
        this.effectShowPopup();
        this.updateTableImage();
    },
    // },
    exit() {
        if (this.sound) {
            cc.audioEngine.play(this.soundMp3, false, 1);
        }

        var popup_muccuoc = this.node.getChildByName("popup_muccuoc");
        var popup_muccuoc2 = this.node.getChildByName("popup_muccuoc2");
        if (popup_muccuoc.active)
        {
            cc.tween(popup_muccuoc).to(0.15, {scale: 0, opacity: 0, easing: "easeInQuint"}).start();
        }
        else if (popup_muccuoc2.active)
        {
            cc.tween(popup_muccuoc2).to(0.15, {scale: 0, opacity: 0, easing: "easeInQuint"}).start();
        }
        this.scheduleOnce(() => {
            var parent = this.node.parent;
            if (parent.name == "_Home") {
                parent.getComponent("_Home").isPopUp = false;
            } else {
                parent.getComponent("_GameController").updateTangCuoc(); // thiết lập lại giá trị cược
            }
            this.node.active = false;
        }, 0.15);
    },

    updateTableImage() {
        var _this = this;
        var setting = this.func.getData("setting");
        var listTable = setting.listTable;
        var _select;
        for (var i = 0; i < listTable.length; ++i)
        {
            if (listTable[i].select)
            {
                _select = listTable[i];
                cc.resources.load("store/bannho", cc.SpriteAtlas, (err, atlas) => {
                    if (!err)
                    {
                        _this.txtTable.node.getChildByName("img_table").getComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame("ban" + _select.name);
                    }
                });
                _this.txtPercent.string = _select.percent;
            }
        }
    },
    dongY(event) {
        var toggleScript = this.modeGame.getComponent("toggle");
        if (toggleScript)
        {
            Constant.CurrentGameMode = toggleScript.getModeGame();
        }
        if (this.mucCuoc > 0) {
            if (this.sound) {
                cc.audioEngine.play(this.soundMp3, false, 1);
            }
            
            // var shadow = cc.find("Canvas/_Home/shadow");
            // shadow.zIndex =cc.macro.MAX_ZINDEX;
            // cc.tween(shadow).to(0.16, {opacity: 255}).start();
            this.onBtnClick(event);
            // setTimeout(function () {
            //     var parent = this.node.parent;
            //     if (parent.name == "_Home") {
            //         if (Constant.CurrentGameMode == Constant.GameMode.CoinMode) {
            //             var tableGame2 = this.func.getData("tableGame2");
            //             tableGame2.table.betting = this.mucCuoc;
            //             this.func.setData("tableGame2", tableGame2);
            //             this.func.setData("playGame", "CoinsMode");
            //             this.func.setData("coinsMode", false); // lần đầu tiên  vào game và đặt cược  
            //             parent.getComponent("_Home").clickGameStart3();
            //         } else if (Constant.CurrentGameMode == Constant.GameMode.DemLaMode) {
            //             var tableGame2 = this.func.getData("tableGame2");
            //             tableGame2.table.betting = this.mucCuoc;
            //             this.func.setData("tableGame2", tableGame2);
            //             this.func.setData("playGame", "DemLaMode");
            //             this.func.setData("demLaMode", false); // lần đầu tiên  vào game và đặt cược  
            //             parent.getComponent("_Home").clickGameStart3();
            //         } else if (Constant.CurrentGameMode == Constant.GameMode.NhatAnTatMode) {
            //             var tableGame2 = this.func.getData("tableGame2");
            //             tableGame2.table.betting = this.mucCuoc;
            //             this.func.setData("tableGame2", tableGame2);
            //             this.func.setData("playGame", "NhatAnTatMode");
            //             this.func.setData("nhatAnTatMode", false); // lần đầu tiên  vào game và đặt cược  
            //             parent.getComponent("_Home").clickGameStart3();
            //         }

            //     } else {
            //         parent.getComponent("_GameController").updateTangCuoc(this.mucCuoc); // thiết lập lại giá trị cược
            //         this.node.destroy();
            //     }
            // }.bind(this), 150);
        } else {
            cc.log("Không đủ tiền đặt cược");
            this.func.setData("coinsMode", false); // lần đầu tiên  vào game và đặt cược  
            var parent = this.node.parent;
            this.node.destroy();
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
    onClick(event) {
        var setting = this.func.getData("setting");
        if(setting.sound){
            cc.audioEngine.play(this.soundMp3,false,1);
        }
        switch(event.target.name)
        {
            case "toggle1":
                Constant.CurrentGameMode = Constant.GameMode.CoinMode;
                this.mucCuoc = 50;
                this.activeMoney(5);
                break;
            case "toggle2":
                Constant.CurrentGameMode = Constant.GameMode.NhatAnTatMode;
                this.mucCuoc = 50;
                this.activeMoney(5);
                break;
            case "toggle3":
                Constant.CurrentGameMode = Constant.GameMode.DemLaMode;
                this.mucCuoc = 50;
                this.activeMoney(50);
                break;
        }
    },
    clickSelectTable: function (event) {
        var buy = cc.find("Canvas/_Buy");
        if (buy)
        {
            buy.active = true;
        }
        else
        {
            buy = cc.instantiate(this.buyPrefab);
            this.node.parent.parent.addChild(buy);
        }
        cc.tween(this.node).to(0.15, {opacity: 0}).start();
    },
    effectShowPopup() {
        var popup_muccuoc = this.node.getChildByName("popup_muccuoc");
        var popup_muccuoc2 = this.node.getChildByName("popup_muccuoc2");
        if (popup_muccuoc.active)
        {
            cc.tween(popup_muccuoc).to(0.18, {scale: 1, opacity: 255, easing: "easeInQuint"}).start();
        }
        else if (popup_muccuoc2.active)
        {
            cc.tween(popup_muccuoc2).to(0.18, {scale: 1, opacity: 255, easing: "easeInQuint"}).start();
        }
    },
    hidePopup() {
        var popup_muccuoc = this.node.getChildByName("popup_muccuoc");
        var popup_muccuoc2 = this.node.getChildByName("popup_muccuoc2");
        popup_muccuoc.scale = 0;
        popup_muccuoc.opacity = 0;
        popup_muccuoc2.scale = 0;
        popup_muccuoc2.opacity = 0;
    },
    // update (dt) {},
});