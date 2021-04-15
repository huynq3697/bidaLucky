var Linker = require('Linker');
var Global = require('Global');
var LoginCache = require('LoginCache');
var BiDaConstant = require('BiDaConstant');
var CommonSend = require('CommonSend');
var Utils = require('Utils');
var i18n = require('i18n');
var Api = require('Api');
var Md5 = require('Md5');
var DataAccess = require('DataAccess');
var NewAudioManager = require("NewAudioManager");
cc.Class({
    extends: cc.Component,

    ctor() {
        this.dataUser = {},
            this.dataUserOther = null,
            this.valueEdit = "";
        this.keyEdit = "";
    },

    properties: {
        avatarAtlas: cc.SpriteAtlas,
        countryAtlas: cc.SpriteAtlas,
        avatarNode: cc.Node,
        userAvatarLevel: cc.Node,
        btnCloseNode: cc.Node,
        btnChangeAvatar: cc.Node,
        btnChangePass: cc.Node,
        btnHistory: cc.Node,
        btnTele: cc.Node,
        dialogChangeAvatar: cc.Node,
        labelMoneyNode: cc.Node,
        labelRealMoneyNode: cc.Node,
        labelUserNameNode: cc.Node,
        labelLoginNameNode: cc.Node,
        labelExpNode: cc.Node,
        labelUserID: cc.Node,
        labelUserIDLeft: cc.Node,
        labelUserLevel: cc.Node,
        labelPhoneNumber: cc.Node,
        labelEmail: cc.Node,
        labelCity: cc.Node,
        labelAddress: cc.Node,
        labelSex: cc.Node,
        countryNode: cc.Node,
        win8: cc.Label,
        lose8: cc.Label,
        totalplay8: cc.Label,
        exp8: cc.Label,
        win84: cc.Label,
        lose84: cc.Label,
        totalplay84: cc.Label,
        exp84: cc.Label,
        win86: cc.Label,
        lose86: cc.Label,
        totalplay86: cc.Label,
        exp86: cc.Label,
        labelPercent8: cc.Label,
        labelPercent84: cc.Label,
        labelPercent86: cc.Label,
        editBoxNode: cc.Node,
        checkBoxSex: cc.Node,
        btnEditEmail: cc.Node,
        btnEditAddress: cc.Node,
        btnEditCity: cc.Node,
        btnEditSex: cc.Node,
        changeInfoNode: cc.Node,
        toggleGirlNode: cc.Node,
        toggleBoyNode: cc.Node,
        changePasswordNode: cc.Node,
        titleChange: cc.Label,
        idBlockNode: cc.Node,
        btnCopy1: cc.Label,
        btnCopy2: cc.Label,

        matchHistoryNode: cc.Node,
        contentSkillInfo: cc.Node,
        title: cc.Node,
    },
    onLoad() {
        this.loadFlagResource();
        this.addCustomEventListener();
        this.checkConfig(Linker.Config);
    },
    checkConfig: function (config) {
        this.contentSkillInfo.getChildByName("1vs4Skill").active = config.isBida14;
    },
    loadFlagResource: function (cb) {
        if (Linker.NationFlag) {
            this.countryAtlas = Linker.NationFlag;
            if (cb) {
                cb(null, Linker.NationFlag);
            }
        } else {
            var that = this;
            cc.resources.load("bida/images/country_flags/country_flags", cc.SpriteAtlas, function (err, spriteAtlas) {
                if (!err) {
                    that.countryAtlas = spriteAtlas;
                    Linker.NationFlag = spriteAtlas;
                    if (cb) {
                        cb(null, that.countryAtlas);
                    }
                } else {
                    Linker.NationFlag = null;
                    if (cb) {
                        cb(true, null);
                    }
                    cc.log("Khong tim thay sheet flag...", err, spriteAtlas);
                }
            });
        }
    },
    onEnable: function () {
        // this.requestDataUser();
        // this.initUserUI();
        this.onChangeAvatar();
        this.dataUserOther = null;
        this.toggleGirlNode.on("toggle", this.handleToggleGirl, this);
        this.toggleBoyNode.on("toggle", this.handleToggleBoy, this);
        this.initChangeInfo();
        DataAccess.Instance.node.on("update-user-data", this.onGetUserData, this);
        if (Linker.gameLanguage === "en")
        {
            this.title.getComponent("LabelLocalized").fontSize = 25;
        }
        else
        {
            this.title.getComponent("LabelLocalized").fontSize = 20;
        }
        

    },
    requestDataUser: function (id) {
        // var test = CommonSend.getUserInfo(id);
        // Linker.Socket.send(test);
        DataAccess.Instance.requestUserData(id);
    },

    onDisable: function() {
        this.changePasswordNode.active = false;
        this.changeInfoNode.active = false;
        this.matchHistoryNode.active = false;
        this.dialogChangeAvatar.active = false;
    },
    setCloseButtonHavior: function (data) {
        if (data) {
            this.isFriendZoneTab = data.isFriendZoneTab;
            this.isFindFriendTab = data.isFindFriendTab;
        }
    },
    onGetUserData: function (message) {
        this.dataUser = message;
        cc.log(message);
        if (!this.dataUserOther) {
            this.updateWinlose(message);
            this.initUserInfo(message);
            this.btnChangeAvatar.active = true;
        }
        this.checkUserId(message.userId);
    },
    checkUserId: function (id) {
        var check = true;
        if (Linker.userData.userId !== id) {
            check = false;
        }
        this.btnChangeAvatar.active = check;
        this.btnChangePass.active = check;
        this.btnTele.active = check;
        this.btnHistory.active = check;
        this.btnTele.getChildByName("lb").getComponent(cc.Label).string = i18n.t("active_account");
        this.btnCopy1.string = i18n.t("copy");
        this.btnCopy2.string = i18n.t("copy");
        this.idBlockNode.active = check;
        this.labelLoginNameNode.parent.active = check;
        this.labelEmail.parent.active = check;
        this.labelPhoneNumber.parent.active = check;
        this.labelAddress.parent.active = check;
        this.labelCity.parent.active = check;
        this.labelSex.parent.active = check;
        //this.labelMoneyNode.parent.active = check;
        //this.labelRealMoneyNode.parent.active = check;
    },
    updateDataUserOther(dataUserOther) {
        this.dataUserOther = dataUserOther;
        if (this.dataUserOther) {
            this.btnChangeAvatar.active = false;
            this.btnChangePass.active = false;
            this.btnEditEmail.active = false;
            this.btnEditCity.active = false;
            this.btnEditSex.active = false;
            this.btnEditAddress.active = false;
            this.labelMoneyNode.parent.active = false;
            this.labelRealMoneyNode.parent.active = false;
            this.updateWinlose(dataUserOther);
            this.initUserInfo(dataUserOther);
        }
    },
    changeAvatarBtnClick() {
        NewAudioManager.playClick();
        this.dialogChangeAvatar.active = true;
    },
    updateWinlose(data) {
        const history = data.history;
        if (history) {
            for (let i = 0; i < history.length; i++) {
                if (history[i].zoneId == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
                    this.win8.string = history[i].win;
                    this.lose8.string = history[i].lose;
                    this.totalplay8.string = history[i].totalplay;
                    this.exp8.string = history[i].exp;
                    const nWin = Number(history[i].win);
                    const nTotal = Number(history[i].totalplay);
                    var percent = nWin / (nTotal);
                    this.labelPercent8.string = !!percent ? `${Math.round(percent * 100)}%` : 0;
                }
                if (history[i].zoneId == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
                    this.win84.string = history[i].win;
                    this.lose84.string = history[i].lose;
                    this.totalplay84.string = history[i].totalplay;
                    this.exp84.string = history[i].exp;
                    const nWin = Number(history[i].win);
                    const nTotal = Number(history[i].totalplay);
                    var percent = nWin / nTotal;
                    this.labelPercent84.string = !!percent ? `${Math.round(percent * 100)}%` : 0;
                }
                if (history[i].zoneId == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
                    this.win86.string = history[i].win;
                    this.lose86.string = history[i].lose;
                    this.totalplay86.string = history[i].totalplay;
                    this.exp86.string = history[i].exp;
                    const nWin = Number(history[i].win);
                    const nTotal = Number(history[i].totalplay);
                    var percent = nWin / nTotal;
                    this.labelPercent86.string = !!percent ? `${Math.round(percent * 100)}%` : 0;
                }
            }
        }
    },
    initUserInfo: function (message) {
        this.setUserName(message.displayName);
        this.setUserID(message.userId);
        this.setUserMoney(message.userMoney);
        this.setUserRealMoney(message.userRealMoney);
        this.setLoginName(message.viewname);
        this.setUserExp(message.userExp);
        this.setUserLevel(message.userExp);
        this.setAddress(message.address);
        this.setPhoneNumber(message.phoneNumber);
        this.setEmail(message.email);
        this.setCity(message.cityId);
        this.setSex(message.sex);
        this.setAvatarAsId(message.avatar);
        this.setCountryId(message.countryId);
    },
    initChangeInfo: function () {
        this.editBoxNode.getComponent(cc.EditBox).string = "";
        this.changeInfoNode.active = false;
        this.editBoxNode.active = false;
        this.checkBoxSex.active = false;
        this.changePasswordNode.active = false;
    },
    setLoginName: function (name) {
        this.labelLoginNameNode.getComponent(cc.Label).string = !!name ? name : i18n.t("title_not_yet_update");
    },

    addCustomEventListener: function () {
        this.btnCloseNode.on(cc.Node.EventType.TOUCH_END, this.onPanelUserClick, this);
        this.node.on(BiDaConstant.GAME_COMMONS_EVENT.CHANGE_AVATAR, this.onChangeAvatar, this);
    },

    handleToggleGirl(toggle) {
        NewAudioManager.playClick();
        var checkBoy = this.toggleBoyNode.getComponent(cc.Toggle);
        if (toggle) {
            checkBoy.isChecked = false;
            this.valueEdit = "sex=Nu";
            cc.log(this.valueEdit);
        }
    },

    handleToggleBoy(toggle) {
        NewAudioManager.playClick();
        var checkGirl = this.toggleGirlNode.getComponent(cc.Toggle);
        if (toggle) {
            checkGirl.isChecked = false;
            this.valueEdit = "sex=Nam";
            cc.log(this.valueEdit);
        }
    },

    closeChangeInfoNode() {
        NewAudioManager.playClick();
        this.initChangeInfo();
    },

    clickBtnChangePass() {
        NewAudioManager.playClick();
        this.changePasswordNode.active = true;
    },

    clickBtnEdit: function (event) {
        NewAudioManager.playClick();
        const target = event.currentTarget;
        this.changeInfoNode.active = true;
        if (target == this.btnEditAddress) {
            this.titleChange.string = i18n.t("title_change_address");
            this.editBoxNode.getComponent(cc.EditBox).string = this.dataUser.address != "null" ? this.dataUser.address : "";
            this.keyEdit = "address=";
            this.editBoxNode.active = true;
            this.checkBoxSex.active = false;
        } else if (target == this.btnEditCity) {
            this.titleChange.string = i18n.t("title_change_city");
            this.editBoxNode.getComponent(cc.EditBox).string = this.dataUser.cityId != "null" ? this.dataUser.cityId : "";
            this.keyEdit = "city=";
            this.editBoxNode.active = true;
            this.checkBoxSex.active = false;
        } else if (target == this.btnEditEmail) {
            this.titleChange.string = i18n.t("title_change_email");
            this.editBoxNode.getComponent(cc.EditBox).string = this.dataUser.email != "null" ? this.dataUser.email : "";
            this.keyEdit = "email=";
            this.editBoxNode.active = true;
            this.checkBoxSex.active = false;
        } else if (target == this.btnEditSex) {
            this.titleChange.string = i18n.t("title_change_sex");
            // this.editBoxNode.getComponent(cc.EditBox).string = this.dataUser.sex;
            this.checkBoxSex.active = true;
            this.editBoxNode.active = false;

            var ischeckGirl = this.toggleGirlNode.getComponent(cc.Toggle);
            var ischeckBoy = this.toggleBoyNode.getComponent(cc.Toggle);
            if (this.dataUser.sex == 0) {
                ischeckGirl.isChecked = true;
                ischeckBoy.isChecked = false;
            } else if (this.dataUser.sex == 1) {
                ischeckGirl.isChecked = false;
                ischeckBoy.isChecked = true;
            }
            if (ischeckGirl.isChecked) {
                this.valueEdit = "sex=Nu";
            }
            if (ischeckBoy.isChecked) {
                this.valueEdit = "sex=Nam";
            }
        }
    },

    onEditBoxTextChanged: function (editbox) {
        this.valueEdit = this.keyEdit + editbox;
    },

    clickBtnUpdate() {
        NewAudioManager.playClick();
        var cache = LoginCache.get();
        var password = Md5(cache.password);
        var username = cache.username;
        var data = `pass=${password}&username=${username}&${this.valueEdit}`;
        var url = Linker.Config.APP_API + "/ApiUserInfo/updateUserInfo";
        cc.log(data);
        Api.postNoJson(url, data, (result) => {
            cc.log(result);
            if (result.error == 1) {
                this.changeInfoNode.active = false;
                cc.Global.showMessage(result.msg);
                this.requestDataUser();
            } else {
                cc.Global.showMessage(result.msg);
            }
        });

    },

    getSex(id) {
        if (id == 0) return i18n.t("title_girl");
        else if (id == 1) return i18n.t("title_boy");
        else return null;
    },


    setUserName: function (name) {
        //right
        this.labelUserNameNode.getComponent(cc.Label).string = !!name ? name : i18n.t("title_not_yet_update");
    },
    setAddress: function (add) {
        //right
        this.labelAddress.getComponent(cc.Label).string = !!add ? add : i18n.t("title_not_yet_update");
    },
    setSex: function (sex) {
        //right
        var checkGirl = this.toggleGirlNode.getComponent(cc.Toggle);
        var checkBoy = this.toggleBoyNode.getComponent(cc.Toggle);
        sex == 0 ? checkGirl.isChecked = true : checkGirl.isChecked = false;
        sex == 1 ? checkBoy.isChecked = true : checkBoy.isChecked = false;
        this.labelSex.getComponent(cc.Label).string = !!this.getSex(sex) ? this.getSex(sex) : i18n.t("title_not_yet_update");
    },
    setPhoneNumber: function (number) {
        //right
        this.labelPhoneNumber.getComponent(cc.Label).string = !!number ? number : i18n.t("title_not_yet_update");
    },
    setEmail: function (email) {
        //right
        this.labelEmail.getComponent(cc.Label).string = !!email ? email : i18n.t("title_not_yet_update");
    },
    setCity: function (city) {
        //right
        this.labelCity.getComponent(cc.Label).string = !!city && city != "null" ? city : i18n.t("title_not_yet_update");
    },
    setUserMoney: function (money) {
        money = parseInt(money);
        if (isNaN(money) == false) {
            money = Utils.Malicious.moneyWithFormat(money, ".")
            this.labelMoneyNode.getComponent(cc.Label).string = !!money ? money : i18n.t("title_not_yet_update");
        }

    },
    setUserRealMoney: function (money) {
        money = parseInt(money);
        if (isNaN(money) == false) {
            money = Utils.Malicious.moneyWithFormat(money, ".")
            this.labelRealMoneyNode.getComponent(cc.Label).string = !!money ? money : i18n.t("title_not_yet_update");
        }

    },
    setUserExp: function (exp) {
        this.labelExpNode.getComponent(cc.Label).string = !!exp ? exp : i18n.t("title_not_yet_update");
    },
    setUserID: function (id) {
        this.labelUserID.getComponent(cc.Label).string = !!id ? id : i18n.t("title_not_yet_update");
        this.labelUserIDLeft.getComponent(cc.Label).string = !!id ? "ID: " + id : i18n.t("title_not_yet_update");
    },
    setUserLevel: function (exp) {
        var exp = parseInt(exp);
        if (!isNaN(exp)) {
            this.userAvatarLevel.active = true;
            var spriteLevel = this.userAvatarLevel.getComponent(cc.Sprite);
            spriteLevel.fillCenter = 0;
            spriteLevel.fillCenter = cc.v2(0.5, 0.5)
            var level = Utils.Malicious.getLevelRankingByExp(exp);
            var percentLevel = level * 100 / 30;
            var fillRange = percentLevel / 100;
            spriteLevel.fillRange = fillRange;//0 -1
            var keyLevelText = "userdata_level_" + level;
            this.labelUserLevel.getComponent(cc.Label).string = i18n.t(keyLevelText);
        } else {
            this.labelUserLevel.getComponent(cc.Label).string = i18n.t("userdata_level_1");
        }
    },
    onPanelUserClick: function (event) {
        var target = event.currentTarget;
        NewAudioManager.playClick();
        if (target) {
            if (target === this.btnCloseNode) {

                this.node.active = false;
                if (this.isFriendZoneTab) {
                    var customEvent = new cc.Event.EventCustom(BiDaConstant.POPUP_EVENT.FRIEND_ZONE.OPEN, true);
                    this.node.dispatchEvent(customEvent);
                    //mo tab friend zone
                    if (this.isFindFriendTab) {
                        //mo friend zone va mo tab find friend
                        var customEvent = new cc.Event.EventCustom(BiDaConstant.POPUP_EVENT.FRIEND_ZONE.FIND_FRIEND_TAB.OPEN, true);
                        this.node.dispatchEvent(customEvent);
                    }
                }
                this.isFriendZoneTab = false;
                this.isFindFriendTab = false;
            }
            cc.log("Whoa", event);
        }
    },
    onChangeAvatar: function () {
        this.setAvatarAsId(Linker.userData.avatar);
    },
    setAvatarAsId: function (id) {
        if (isNaN(id)) {
            id = 1;
        }
        id = Number(id);
        var frame = this.avatarAtlas.getSpriteFrame("avatar (" + id + ")");
        if (!frame) {
            frame = this.avatarAtlas.getSpriteFrame("avatar (1)");
        }
        if (Linker.avatarFbFrame) {
            frame = Linker.avatarFbFrame;
        }
        this.avatarNode.getComponent(cc.Sprite).spriteFrame = frame;
    },
    setCountryId: function (id) {
        if (!id) {
            id = "w";
        }
        var frame = this.countryAtlas.getSpriteFrame(id);
        if (!frame) {
            frame = this.countryAtlas.getSpriteFrame("w");
        }
        this.countryNode.getComponent(cc.Sprite).spriteFrame = frame;
    },
    clickMatchHistory() {
        NewAudioManager.playClick();
        this.matchHistoryNode.active = true;
        this.node.getChildByName("infoPanel").active = false;
    }
    // update (dt) {},
});
