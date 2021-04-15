var Linker = require('Linker');
var Utils = require('Utils');
var BiDaConstant = require('BiDaConstant');
var i18n = require('i18n');
var Global = require('Global');
cc.Class({
    extends: cc.Component,

    properties: {
        userMoney: cc.Node,
        userName: cc.Node,
        userLevel: cc.Node,
        userExp: cc.Node,
        userAvatar: cc.Node,
        flagNode: cc.Node,
        labelUserReady: cc.Node,
    },
    loadAvatarSpriteSheet: function (cb) {
        if (Utils.Malicious.getLengthObj(Global.avatarAtlas) <= 0) {
            cc.resources.load("avatar/avatar", cc.SpriteAtlas, function (err, atlas) {
                if (!err) {
                    Global.avatarAtlas = atlas;
                    if (cb) {
                        cb(null, Global.avatarAtlas);
                    }
                    cc.log("Load avatar frame resoures successfully now ...", atlas);
                } else {
                    Global.avatarAtlas = {};
                    if (cb) {
                        cb(true, null);
                    }
                    cc.log("Can not load avatar frame resoures now ...");
                }
            });
        } else {
            if (cb) {
                cb(null, Global.avatarAtlas);
            }
        }
    },
    init: function (data) {
        if (data) {
            var viewName = data.viewName;
            var userMoney = data.userMoney;
            var userExp = data.level;
            var userAvatarId = data.avatarId;
            var userId = data.userId;
            this.countryId = data.countryId;
            this.exp = userExp;
            this.setUserName(viewName);
            this.setUserMoney(userMoney);
            this.setUserExp(userExp);
            this.setUserLevelByLevel(userExp);
            this.setUserAvatarById(userAvatarId);
            this.setUserId(userId);
            this.getAndSetFlagSpriteFrameByName(this.countryId);
            this.setMaster(false);
        }
    },
    setMaster: function (isMaster) {
        if (isMaster == "1" || isMaster == 1 || isMaster == true) {
            isMaster = true;
        } else {
            isMaster = false;
        }
        this._isMaster = isMaster;
    },
    getMaster: function () {
        return this._isMaster;
    },
    getUserCountryId: function () {
        return this.countryId;
    },
    initExist: function (data) {
        if (data) {
            cc.log(data);
            this.setUserName(data.userName);
            this.userMoney.getComponent(cc.Label).string = data.userMoney;
            this.setUserExp(data.userLevel);
            this.setUserLevel(data.userLevel);
            this.setUserId(data.userID);
            this.setFlagAsFrame(data.userNationFrame);
            this.userAvatar.getComponent(cc.Sprite).spriteFrame = data.userAvatarFrame;
            this.getAndSetFlagSpriteFrameByName(data.userCountryId);
        }
    },
    getUserLevel: function () {
        return this.exp;
    },
    getAndSetFlagSpriteFrameByName: function (countryId) {
        var frame = null;
        if (Linker.NationFlag) {
            frame = Linker.NationFlag.getSpriteFrame(countryId);
            if (!frame) {
                frame = Linker.NationFlag.getSpriteFrame("w");
            }
            this.setFlagAsFrame(frame);
        } else {
            cc.resources.load("bida/images/country_flags/country_flags", cc.SpriteAtlas, function (err, spriteAtlas) {
                if (!err) {
                    Linker.NationFlag = spriteAtlas;
                    frame = Linker.NationFlag.getSpriteFrame(countryId);
                    if (!frame) {
                        frame = Linker.NationFlag.getSpriteFrame("w");
                    }
                    this.setFlagAsFrame(frame);
                } else {
                    Linker.NationFlag = null;
                    cc.log("Khong tim thay sheet flag...", err, spriteAtlas);
                }
            }.bind(this));
        }
    },

    setFlagAsFrame: function (frame) {
        if (frame) {
            this.flagNode.getComponent(cc.Sprite).spriteFrame = frame;
        }
    },
    getNationFrame: function () {
        return this.flagNode.getComponent(cc.Sprite).spriteFrame;
    },
    setUserId: function (id) {
        this.userId = parseInt(id);
    },
    getUserID: function () {
        return this.userId
    },
    setUserName: function (name) {
        this.userName.getComponent(cc.Label).string = name;
    },
    getUserName: function () {
        return this.userName.getComponent(cc.Label).string;
    },
    setUserAvatarById: function (id) {
        this.loadAvatarSpriteSheet(function (err, avatarAtlas) {
            if (!err) {
                id = parseInt(id);
                if (isNaN(id)) {
                    id = 1;
                }
                var frame = avatarAtlas.getSpriteFrame("avatar (" + id + ")");
                if (!frame) {
                    frame = avatarAtlas.getSpriteFrame("avatar (1)");
                }
                if (this && this.isValid == true) {
                    this.userAvatar.getComponent(cc.Sprite).spriteFrame = frame;
                }
            } else {
                cc.log("Khong the set avatar user...");
            }
        }.bind(this))
    },
    getUserAvatarFrame: function () {
        return this.userAvatar.getComponent(cc.Sprite).spriteFrame;
    },
    setUserMoney: function (money) {
        money = parseInt(money);

        if (isNaN(money) == false) {
            money = Utils.Malicious.moneyWithFormat(money, ".");
        } else {
            money = 0;
        }
        this.userMoney.getComponent(cc.Label).string = money;
    },
    getUserMoney: function () {
        return this.userMoney.getComponent(cc.Label).string;
    },
    setUserExp: function (exp) {
        this.userExp.getComponent(cc.Label).string = exp;
    },
    activeReadyNode: function () {
        var active = this.getReady();
        if (active) {
            active = true;
        } else {
            active = false;
        }
        this.labelUserReady.active = active;
    },
    setReady: function (isReady) {
        this.ready = isReady;
        this.activeReadyNode();
    },
    getReady: function () {
        return this.ready;
    },
    setUserLevel: function (exp) {
        var exp = parseInt(exp);
        var levelText = "";
        if (!isNaN(exp)) {
            var level = Utils.Malicious.getLevelRankingByExp(exp);
            var keyLevelText = "userdata_level_" + level;
            levelText = i18n.t(keyLevelText);
        } else {
            levelText = i18n.t("userdata_level_1");
        }
        this.userLevel.getComponent(cc.Label).string = levelText;
    },
    setUserLevelByLevel: function (level) {
        var levelText = "";
        var level_1 = parseInt(level);
        if (level_1 == 0 || !level_1) {
            level_1 = 1;
        }
        if (!isNaN(level_1)) {
            var keyLevelText = "userdata_level_" + level_1;
            levelText = i18n.t(keyLevelText);
        } else {
            levelText = i18n.t("userdata_level_1");
        }
        this.userLevel.getComponent(cc.Label).textKey = levelText;
    },
    // update (dt) {},
});
