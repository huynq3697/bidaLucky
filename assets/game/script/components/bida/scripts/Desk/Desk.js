var Utils = require('Utils');
var Linker = require("Linker");
var BiDaConstant = require('BiDaConstant');
var Constant = require('Constant');
cc.Class({
    extends: cc.Component,

    properties: {
        bidaTableBackgroundNode: cc.Node,
        bidaDeskNode: cc.Node,
        bidaDeskContainerNode: cc.Node,
        railChuaBiNode: cc.Node,
        luckyshotTargetPrefab: cc.Prefab,
        logo: {
            default: [],
            type: cc.SpriteFrame
        }
    },
    setBillardGameTable: function (blgtbl) {
        if (blgtbl && cc.isValid(blgtbl)) {
            this.billardGameTable = blgtbl;
            this.billardGameTable.blockInputEventComponent = Utils.Malicious.addNewBlockInputEventNode(this.node);
        }
    },
    getBillardGameTable: function () {
        if (this.billardGameTable && cc.isValid(this.billardGameTable)) {
            return this.billardGameTable;
        }
    },
    getListMyBallTarget: function () {
        if (this.billardGameTable && cc.isValid(this.billardGameTable)) {
            var listUsers = [];
            if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
                listUsers = [this.billardGameTable.myUserInfo, this.billardGameTable.otherUserInfo];
            } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
                listUsers = Utils.Malicious.flattern([[this.billardGameTable.myUserInfo], this.billardGameTable.billardGameTable.rankingUserInfo]);
            } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
                listUsers = Utils.Malicious.flattern([[this.billardGameTable.myUserInfo], this.billardGameTable.rankingUserInfo]);
            }
            //
            var _tmpListBiOnHand = [];
            for (var i = 0; i < listUsers.length; i++) {
                var userInfoView = listUsers[i].getComponent("BillardUserView");
                if (userInfoView && cc.isValid(userInfoView)) {
                    var id = parseInt(userInfoView.getUserID());
                    if (isNaN(id) == false && id != 0) {
                        if (id == Number(Linker.userData.userId)) {
                            _tmpListBiOnHand = userInfoView.player_list_ball_tren_tay;
                            break;
                        }
                    }
                }
            }
            if (_tmpListBiOnHand && _tmpListBiOnHand.length > 0) {
                var myBallTargets = [];
                for (let j = 0; j < _tmpListBiOnHand.length; j++) {
                    var id = parseInt(_tmpListBiOnHand[j]);
                    if (isNaN(id) == false && id != -1) {//-1 là bi đã ăn
                        myBallTargets.push(id);
                    }
                }
                return myBallTargets;
            }
        }
        return null;
    },
    getListBallBotTarget: function () {
        if (this.billardGameTable && cc.isValid(this.billardGameTable)) {
            var listUsers = [];
            if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
                listUsers = [this.billardGameTable.myUserInfo, this.billardGameTable.otherUserInfo];
            } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
                listUsers = Utils.Malicious.flattern([[this.billardGameTable.myUserInfo], this.billardGameTable.billardGameTable.rankingUserInfo]);
            } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
                listUsers = Utils.Malicious.flattern([[this.billardGameTable.myUserInfo], this.billardGameTable.rankingUserInfo]);
            }
            //
            var _tmpListBiOnHand = [];
            for (var i = 0; i < listUsers.length; i++) {
                var userInfoView = listUsers[i].getComponent("BillardUserView");
                if (userInfoView && cc.isValid(userInfoView)) {
                    var id = parseInt(userInfoView.getUserID());
                    if (isNaN(id) == false && id != 0) {
                        if (userInfoView.getBotType()) {
                            _tmpListBiOnHand.push(userInfoView.getCardTarget());
                            break;
                        }
                    }
                }
            }
            return _tmpListBiOnHand;
            // if (_tmpListBiOnHand && _tmpListBiOnHand.length > 0) {
            //     var botBallTargets = [];
            //     for (let j = 0; j < _tmpListBiOnHand.length; j++) {
            //         var id = parseInt(_tmpListBiOnHand[j]);
            //         if (isNaN(id) == false && id != -1) {//-1 là bi đã ăn
            //             botBallTargets.push(id);
            //         }
            //     }
            //     return botBallTargets;
            // }
        }
        return null;
    },
    getBidaTableBackgroundNode: function () {
        return this.bidaTableBackgroundNode;
    },
    getBidaDeskNode: function () {
        return this.bidaDeskNode;
    },
    getBidaDeskContainerNode: function () {
        return this.bidaDeskContainerNode;
    },
    getRailChuaBi: function () {
        return this.railChuaBiNode;
    },
    gendRandomLuckyTargetPosition: function (target) {
        if (target) {
            var minX = (target.width * 0.5) + (145 / 2.5);
            var maxX = (this.bidaDeskNode.width - (target.width * 0.5) - (145 / 2.5));
            var minY = (target.height * 0.5) + (145 / 2.5);
            var maxY = (this.bidaDeskNode.height - (target.height * 0.5) - (145 / 2.5));
            var pos = cc.v2(0, 0);
            pos.x = parseFloat(Utils.Malicious.randomMinMax(minX, maxX));
            pos.y = parseFloat(Utils.Malicious.randomMinMax(minY, maxY));
            if (isNaN(pos.x) == false && isNaN(pos.y) == false) {
                return pos;
            }
        }
        return cc.v2(0, 0);
    },
    addLuckShotTarget: function (cb) {
        Utils.Malicious.removeNodeByNameFromParent("LuckyshotTarget", this.node);
        if (this.luckyshotTargetPrefab && cc.isValid(this.luckyshotTargetPrefab)) {
            var _luckyShotTarget = cc.instantiate(this.luckyshotTargetPrefab);
            this.bidaDeskNode.addChild(_luckyShotTarget);
            var position = this.gendRandomLuckyTargetPosition(_luckyShotTarget);
            //check storage 
            var newPos = this.checkStorage(position);
            if (newPos) position = newPos;
            //end
            _luckyShotTarget.position = position;
            if (cb) {
                cb(false, _luckyShotTarget);
            } else {
                if (cb) {
                    cb(true, null);
                }
            }
        } else {
            if (cb) {
                cb(true, null);
            }
        }
    },
    checkStorage: function (position) {
        var billardGameTable = this.getBillardGameTable();
        var dataStorage = cc.Global.GetSetting("MATCH_LUCKY_SHOT_BIDA", null);
        if (!dataStorage) {
            dataStorage = billardGameTable.createArrayStorage();
        } else if (!dataStorage.ball_1 || !dataStorage.ball_2) {
            dataStorage = billardGameTable.createArrayStorage();
        }
        var ballData = null;
        if (cc.Global.PLAY_TYPE == Constant.PLAY_TYPE.BALL_2) {
            ballData = dataStorage.ball_2;
        } else {
            ballData = dataStorage.ball_1;
        }
        var data = ballData.bet100;
        if (!Linker.LuckyShotGame.isTypePlayMoney) {
            data = ballData.free;
        } else {
            switch (Linker.LuckyShotGame.currCuoc) {
                case Linker.LuckyShotGame.arrCuoc[0]:
                    data = ballData.bet100;
                    break;

                case Linker.LuckyShotGame.arrCuoc[1]:
                    data = ballData.bet1k;
                    break;

                case Linker.LuckyShotGame.arrCuoc[2]:
                    data = ballData.bet10k;
                    break;

                default:
                    break;
            }
        }
        if (!data.isCreatedMatch || data.LuckyTargetPos == null) {
            data.LuckyTargetPos = position;
            cc.Global.SetSetting("MATCH_LUCKY_SHOT_BIDA", dataStorage);
        } else {
            return data.LuckyTargetPos;
        }
        return null;
    },
    addPanelUserHeader: function (cb) {
        Utils.Malicious.removeNodeByNameFromParent("PanelUsersLuckyShot", this.node);
        var _this = this;
        cc.resources.load("bida/prefabs/PanelUsersLuckyShot", cc.Prefab, function (err, prefab) {
            if (!err) {
                if (cb) {
                    cb(null, prefab);
                }
            } else {
                if (cb) {
                    cb(true, null);
                }
            }
        }.bind(this))

    },

    lateUpdate(dt) {
        var widgetUI = this.bidaDeskNode.getComponent(cc.Widget);
        if (widgetUI && !widgetUI.enabled) {
            widgetUI.enabled = true;
        }
    },

    showLogo(zone) {
        this.bidaTableBackgroundNode.removeAllChildren(true);
        var logo = new cc.Node("logo");
        logo.addComponent(cc.Sprite);
        switch (zone) {
            case BiDaConstant.ZONE_ID.ZONEID_1VS1:
                logo.getComponent(cc.Sprite).spriteFrame = this.logo[0];
                break;
            case BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM:
                if (Linker.gameLanguage === "en")
                    logo.getComponent(cc.Sprite).spriteFrame = this.logo[1];
                else if (Linker.gameLanguage === "vi")
                    logo.getComponent(cc.Sprite).spriteFrame = this.logo[2];
                break;
            case BiDaConstant.ZONE_ID.ZONEID_1VS4:
                logo.getComponent(cc.Sprite).spriteFrame = this.logo[0];
                break;
            default:
                cc.log("Linker.ZONE = ", zone);
                break;
        }
        this.bidaTableBackgroundNode.addChild(logo, cc.macro.MIN_ZINDEX);
        logo.setPosition(cc.v2(0, 16));
    }
});
