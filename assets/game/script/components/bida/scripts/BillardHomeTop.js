var BiDaConstant = require('BiDaConstant');
var BiDaSend = require('BiDaSend');
var Utils = require('Utils');
var Linker = require('Linker');
var Global = require('Global');
var NewAudioManager = require('NewAudioManager');
var CommonSend = require('CommonSend');
var i18n = require('i18n');
var DataAccess = require('DataAccess');
var FacebookSDK = require('FacebookSDK');
var Api = require('Api');


cc.Class({
    extends: cc.Component,

    properties: {
        avatarAtlas: cc.SpriteAtlas,
        avatarNode: cc.Node,
        userNameNode: cc.Node,
        userIDNode: cc.Node,
        userLevelNode: cc.Node,
        userAvatarLevel: cc.Node,
        userMoneyXuNode: cc.Node,
        userMoneyQuanNode: cc.Node,
        btnChatNode: cc.Node,
        btnFriendNode: cc.Node,
        btnNapNode: cc.Node,
        btnNapNode1: cc.Node,
        btnAvatar: cc.Node,
        notifyPrefab: cc.Prefab,
        copyBtnPrefab: cc.Prefab,
        notifyContainer: cc.Node,
        avatarBlocks: cc.Node,
        btnVqmm: cc.Node,
        btnMenu: cc.Node,
        btnDailyGift: cc.Node,
        groupBtn: cc.Node,
        userOnline: cc.Node,
        countryNode: cc.Node,
        countryFlagAtlas: cc.SpriteAtlas,
        list_spriteFrame: [cc.SpriteFrame],
        nohuPrefab: cc.Prefab,
        nohuNode: cc.Node,
        btnQuan: cc.Node,
        btnXu: cc.Node,

        logoSprite: cc.Sprite,
        listSpriteLogo: [cc.SpriteFrame],
        nodeQuan: cc.Node
    },
    onLoad() {
        this.addSocketEvent();
        Utils.Malicious.addIconInvites({
            btnParent: this.btnFriendNode
        }, function (err, containerIcon) {
            if (!err) {
                Linker.Event.addEventListener(7051, this.onGetSendFriend, this);
            }
        }.bind(this));
        cc.director.getCollisionManager().enabled = true;
        if(!Linker.Config.pmE){
            this.nodeQuan.active = false;
        }
    },
    onClosedFriendNode: function () {
        if (this.btnFriendNode && cc.isValid(this.btnFriendNode) && this.btnFriendNode.labelFriendSended && cc.isValid(this.btnFriendNode.labelFriendSended)) {
            //add custom event
            Linker.Event.addEventListener(7051, this.onGetSendFriend, this);
            var num = parseInt(this.btnFriendNode.labelFriendSended.string);
            var containerIcon = this.btnFriendNode.getChildByName("containerIcon");
            Utils.Malicious.runAnimationNumberFriendReq(this.btnFriendNode, containerIcon, num);
        }
    },

    onGetSendFriend: function (message) {
        if (message.status == 1) {
            if (message.listSendFriends) {
                if (this.btnFriendNode && cc.isValid(this.btnFriendNode) && this.btnFriendNode.labelFriendSended && cc.isValid(this.btnFriendNode.labelFriendSended)) {
                    var num = message.listSendFriends.length;
                    var containerIcon = this.btnFriendNode.getChildByName("containerIcon");
                    Utils.Malicious.runAnimationNumberFriendReq(this.btnFriendNode, containerIcon, num);
                }
            }
        }
    },
    initNohu: function () {
        var node = this.nohuNode.getChildByName('NoHuIcon');
        if (!node) {
            var nohuPrefab = cc.instantiate(this.nohuPrefab);
            this.nohuNode.addChild(nohuPrefab, cc.macro.MAX_ZINDEX);
        } else {
            node.active = true;
        }
    },
    onEnable: function () {
        this.addCustomEventListener();
        this.checkNotitication();
        this.activeMoney();
        if (Linker.userData) {
            DataAccess.Instance.updateData();
        }
        this.onChangeLanguage();
    },
    addSocketEvent: function () {
        Linker.Event.addEventListener(1243, this.onChangeMoneyType, this);
        Linker.Event.addEventListener(12017, this.onUserOnline, this);
        Linker.Event.addEventListener(121001, this.onGetUserData, this);
    },
    removeSocketEvent() {
        Linker.Event.removeEventListener(1243, this.onChangeMoneyType, this);
        Linker.Event.removeEventListener(12017, this.onUserOnline, this);
        Linker.Event.addEventListener(121001, this.onGetUserData, this);
    },
    checkNotitication: function () {
        var notifyNode = cc.instantiate(this.notifyPrefab);
        notifyNode.position = cc.v2(0, 0);
        var textNotify = notifyNode.getChildByName('text_thongbao');
        textNotify.x = 1745;
        if (!Linker.notifyText) {
            var path = Linker.Config.APP_API + 'api-events/notification';
            var _this = this;
            Utils.Malicious.get(path, (data) => {
                _this.notifyContainer.removeAllChildren(true);
                var temp = '';
                data.forEach(item => {
                    temp = temp + '                           ' + item;
                });
                if (textNotify && textNotify.isValid) {
                    var s = textNotify.getComponent(cc.Label);
                    if (s) {
                        s.string = temp;
                        Linker.notifyText = temp;
                        _this.notifyContainer.addChild(notifyNode);
                    } else {
                        Linker.notifyText = null;
                        notifyNode.destroy();
                    }
                }
            });
        } else if (Linker.notifyText && Linker.notifyText.length > 0) {
            this.notifyContainer.removeAllChildren(true);
            if (textNotify && textNotify.isValid) {
                var s = textNotify.getComponent(cc.Label);
                if (s) {
                    s.string = Linker.notifyText;
                    this.notifyContainer.addChild(notifyNode);
                } else {
                    notifyNode.destroy();
                }
            }
        }
        cc.log("Linker.showDialogActive:", Linker.showDialogActive);
        if (Linker.Config.isOpenActive != 1 && Linker.showDialogActive) {
            this.waitActivePopup = true;
            this.sendRequestUserInfo();
        } else if (Linker.Config.isOpenActive) {
            if (cc.find('Canvas/ActiveDialog')) {
                cc.find("Canvas/ActiveDialog").active = false;
            }
        }
    },
    showActivePopup: function () {
        if (Global.Announcement.AnnouncePrefab && Global.Announcement.GlobalNodePrefab) {
            var gNode = cc.instantiate(Global.Announcement.GlobalNodePrefab);
            var gNodeC = gNode.getComponent("GlobalNode");
            if (gNodeC) {
                Global.Announcement._addChild(gNode);
                var msgText = i18n.t("message_validate_telegram");
                //update 23/7/20 cong ten tai khoan va button copy
                var btn = cc.instantiate(this.copyBtnPrefab);
                var btnComponent = btn.getComponent("copyBtn");
                if (btnComponent) {
                    btnComponent.setCopyText(Linker.userData.viewname);
                }
                gNodeC.alert({ msg: msgText, btn: btn, msgCopy: i18n.t("shop_transfer_username") + ": " + Linker.userData.viewname }, G.AT.OK_CANCEL_BUTTON, () => {
                    Global.Announcement._removeAllChild();
                    Global.Announcement.AnnounceNode.active = false;
                    if (Linker.Config.APP_API) {
                        //this.btnTeleActive.active = false;
                        var url = Linker.Config.KHTELE;
                        if (url.length > 0) {
                            cc.sys.openURL(url);
                        } else {
                            cc.log("Địa chỉ API kích hoạt trống, hoặc không hợp lệ ...");
                        }
                    } else {
                        //this.btnTeleActive.active = true;
                        cc.log("Lỗi không thể load API kích hoạt tài khoản ...");
                    }
                }, () => {
                    Global.Announcement._removeAllChild();
                    Global.Announcement.AnnounceNode.active = false;
                });
            }
        }
        Linker.showDialogActive = false;
    },
    onGetUserData: function (message) {
        if (message && message.status == 1) {
            if (this.waitActivePopup) {
                this.waitActivePopup = false;
                Linker.userData.viewname = message.viewname;
                this.showActivePopup();
            }
        }
    },
    sendRequestUserInfo: function () {
        var data = CommonSend.getUserInfo(Linker.userData.userId);
        Linker.Socket.send(data);
    },
    addCustomEventListener: function () {
        this.btnChatNode.on(cc.Node.EventType.TOUCH_END, this.onHomeTopClick, this);
        this.btnFriendNode.on(cc.Node.EventType.TOUCH_END, this.onHomeTopClick, this);
        this.btnNapNode.on(cc.Node.EventType.TOUCH_END, this.onHomeTopClick, this);
        this.btnNapNode1.on(cc.Node.EventType.TOUCH_END, this.onHomeTopClick, this);
        this.btnAvatar.on(cc.Node.EventType.TOUCH_END, this.onHomeTopClick, this);
        this.btnVqmm.on(cc.Node.EventType.TOUCH_END, this.onHomeTopClick, this);
        this.btnQuan.on(cc.Node.EventType.TOUCH_END, this.onHomeTopClick, this);
        this.btnXu.on(cc.Node.EventType.TOUCH_END, this.onHomeTopClick, this);
        this.btnMenu.on(cc.Node.EventType.TOUCH_END, this.onHomeTopClick, this);
        this.btnDailyGift.on(cc.Node.EventType.TOUCH_END, this.onHomeTopClick, this);
        // this.groupBtn.on(cc.Node.EventType.MOUSE_MOVE, this.onCheckHideGroup, this);
        // this.groupBtn.on(cc.Node.EventType.MOUSE_LEAVE, this.hideMenuPopUp, this);
        DataAccess.Instance.node.on("update-user-data", this.onUpdateUserData, this);
        BiDaConstant.METHODS.createListenerNode().on("changeLanguage", this.onChangeLanguage, this);
    },
    onChangeLanguage: function () {
        if (Linker.gameLanguage == "vi") {
            this.logoSprite.spriteFrame = this.listSpriteLogo[0];
        } else {
            this.logoSprite.spriteFrame = this.listSpriteLogo[1];
        }
    },
    onCheckHideGroup: function (event) {
        var target = event.currentTarget; //group button
        var content = target.getChildByName("content");
        if (content) {
            var contentBoxCollider = content.getComponent(cc.BoxCollider);
            if (contentBoxCollider) {
                var size = cc.size(content.width, content.height);
                contentBoxCollider.size = size;
                var offset = cc.v2(0, -(contentBoxCollider.size.height * 0.5));
                contentBoxCollider.offset = offset;
                var loc = event.getLocation();
                if (cc.Intersection.pointInPolygon(loc, contentBoxCollider.world.points)) {
                    // if (this.groupBtn.active == true) {
                    //     this.groupBtn.stopAllActions();
                    //     this.groupBtn.opacity = 255;
                    // }
                    // this.unschedule(this.hideMenuPopUp, this);
                } else {
                    this.hideMenuPopUp(event);
                }
            }
        }

    },
    onHomeTopClick: function (event) {
        NewAudioManager.playClick();
        var target = event.currentTarget;
        if (target) {
            if (target === this.btnChatNode) {
                var customEvent = new cc.Event.EventCustom(BiDaConstant.POPUP_EVENT.CHAT.OPEN, true);
                this.node.dispatchEvent(customEvent);
            } else if (target === this.btnAvatar) {
                var customEvent = new cc.Event.EventCustom(BiDaConstant.POPUP_EVENT.USER_INFO.OPEN, true);
                customEvent.userID = Linker.userData.userId;
                this.node.dispatchEvent(customEvent);
            } else if (target === this.btnFriendNode) {
                //off icon
                var containerIcon = this.btnFriendNode.getChildByName("containerIcon");
                if (containerIcon && cc.isValid(containerIcon)) {
                    containerIcon.stopAllActions();
                    var num = this.btnFriendNode.labelFriendSended.string;
                    num = parseInt(num);
                    if (isNaN(num) == false && num > 0) {
                        containerIcon.opacity = 255;
                    } else {
                        containerIcon.opacity = 0;
                    }
                }
                var customEvent = new cc.Event.EventCustom(BiDaConstant.POPUP_EVENT.FRIEND_ZONE.OPEN, true);
                this.node.dispatchEvent(customEvent);
            } else if (target === this.btnNapNode || target === this.btnNapNode1) {
                Linker.ShopType = 0;
                var customEvent = new cc.Event.EventCustom(BiDaConstant.POPUP_EVENT.XU_FREE_STORE.OPEN, true);
                this.node.dispatchEvent(customEvent);
                NewAudioManager.PlayUrl(Linker.gameLanguage == "vi" ? NewAudioManager.SOUND.VI.TOPUP : NewAudioManager.SOUND.EN.TOPUP);
            } else if (target === this.btnVqmm) {
                cc.Global.ZONE_GAME = 2;
                var customEvent = new cc.Event.EventCustom(BiDaConstant.POPUP_EVENT.VQMM.OPEN, true);
                this.node.dispatchEvent(customEvent);
            } else if (target === this.btnXu && cc.Global.bidaMoneyType !== 0) {

                var billardPortalHandler = this.node.parent.parent;
                var billardLobby = billardPortalHandler.getChildByName("BillardMainLobby").getChildByName("BillardLobby");
                if (billardLobby != null) billardLobby.firstCashBet = -1;

                cc.Global.bidaMoneyType = 0;
                var data = BiDaSend.sendChangeMoneyType(cc.Global.bidaMoneyType);
                Linker.Socket.send(data);
                cc.Global.showLoading();
            } else if (target === this.btnQuan && cc.Global.bidaMoneyType !== 1) {
                var billardPortalHandler = this.node.parent.parent;
                var billardLobby = billardPortalHandler.getChildByName("BillardMainLobby").getChildByName("BillardLobby");
                if (billardLobby != null) billardLobby.firstCashBet = -1;

                cc.Global.bidaMoneyType = 1;
                var data = BiDaSend.sendChangeMoneyType(cc.Global.bidaMoneyType);
                Linker.Socket.send(data);
                cc.Global.showLoading();
            } else if (target === this.btnSetting) {
                var customEvent = new cc.Event.EventCustom(BiDaConstant.POPUP_EVENT.SETTING.OPEN, true);
                this.node.dispatchEvent(customEvent);
            } else if (target === this.btnGuide) {
                var customEvent = new cc.Event.EventCustom(BiDaConstant.POPUP_EVENT.GUIDE.OPEN, true);
                this.node.dispatchEvent(customEvent);

                // } else if (target === this.btnMenu) {
                //     this.groupBtn.active = !this.groupBtn.active;
                //     if (this.groupBtn.active == true) {
                //         this.groupBtn.stopAllActions();
                //         this.groupBtn.opacity = 255;
                //     }
                //     this.unschedule(this.hideMenuPopUp, this);
                //     this.scheduleOnce(this.hideMenuPopUp, 5);
            } else if (target === this.btnDailyGift) {
                var customEvent = new cc.Event.EventCustom(BiDaConstant.POPUP_EVENT.DAILY_GIFT.OPEN, true);
                this.node.dispatchEvent(customEvent);
            }
            cc.log("Whoa", event);
        }
    },
    hideMenuPopUp: function (event) {
        if (this.groupBtn.active == true) {
            if (event) {
                this.groupBtn.active = false;
            } else {
                this.groupBtn.runAction(
                    cc.sequence(
                        cc.fadeOut(0.5),
                        cc.callFunc(function () {
                            this.groupBtn.active = false;
                        }.bind(this))
                    )
                )
            }
        }
    },
    onUpdateUserData(message) {
        if (message.userId == Linker.userData.userId) {
            this.setHomeTopInfos(message);
        }
    },
    setHomeTopInfos: function (data) {
        // messageId: "1000"
        // status: "1"
        // userId: "95395"
        // userMoney: "9900050000"
        // userExp: "1"
        // checkMail: ""
        // userLevel: "1"
        // alertEmailContent: ""
        // alertEmailTitle: ""
        // isPhoneUpdate: "0"
        // displayName: "manhuni1s"
        // avatar: "no_image.gif"
        // isPayment: "1"
        // isActive: "0"
        // isNewLoginDay: "0"
        // zoneId: undefined
        // lastRoom: undefined
        // this.setAvatarAsId(data.avatar, data.countryId);
        data.displayName = data.displayName.toString();
        if (data.displayName.length == 0 || data.displayName == "" || data.displayName == null || data.displayName == undefined) {
            data.displayName = Linker.userData.displayName;
        }
        this.setUserName(data.displayName);
        this.setUserID(data.userId);
        this.setUserExp(data.userExp);
        this.setUserMoneyXu(data.userMoney);
        this.setUserMoneyQuan(data.userRealMoney);
        this.setUserLevel(data.userLevel);
        this.setUserOnline(cc.Global.userOnline);
        // this.setUserEmail(data.checkMail);
        // this.setUserPhone(data.isPhoneUpdate);
        cc.log("data user:", data);
        var isCheckFbPlayer = this.checkFbPlayer(data.avatar);
        //isCheckFbPlayer = true; //test //TODO: Comment this
        cc.log("isCheckFbPlayer:", isCheckFbPlayer);
        if (isCheckFbPlayer) {
            this.loadAvatarFb(data.avatar); //TODO: change this
        } else {
            this.setAvatarAsId(data.avatar, data.countryId);
        }
    },
    loadAvatarFb(userId) {
        var that = this;
        if (cc.sys.isNative) {

        } else {
            userId = userId.replace("fb", "");
            cc.log("userId:", userId);
            // let url = "https://graph.facebook.com/"+userId+"/picture?type=large&width=100&height=100&redirect=0";
            var url = "http://graph.facebook.com/" + userId + "/picture?type=square&redirect=0";

            cc.log("url:", url);
            Api.get(url, (response) => {
                if (response.data) {
                    that.setAvatarFb(response.data.url);
                }
            });




        }
    },
    checkFbPlayer: function (name) {
        if (Linker.isFb && name.slice(0, 2) == "fb" && Linker.Config.avafb) {
            return true;
        }
        return false;
    },
    setAvatarFb: function (url, idcountry) {
        // var id = name.substring(2);
        var frame = this.avatarAtlas.getSpriteFrame("avatar (1)");
        // var url = "http://api.vipgame.com:3200/img/box1.png"
        var _this = this;
        cc.loader.load(url, function (err, tex) {
            cc.log('Should load a texture from external url: ' + (tex instanceof cc.Texture2D));
            if (!err) {
                frame = new cc.SpriteFrame(tex);
                _this.avatarNode.getComponent(cc.Sprite).spriteFrame = frame;
                Linker.avatarFbFrame = frame;
            }
            var usercountryframe = _this.setCountryFrameAsId(idcountry);

            var customEvent = new cc.Event.EventCustom(BiDaConstant.GAME_COMMONS_EVENT.SET_USER_AVATAR_AS_FRAME, true);
            customEvent.useravatarframe = frame;
            customEvent.usercountryframe = usercountryframe;
            Linker.userData.avatarFrame = frame;
            Linker.userData.countryFrame = usercountryframe;
            _this.node.dispatchEvent(customEvent);
        });
    },
    setAvatarAsId: function (idavatar, idcountry) {
        Linker.userData.avatarFrame = null;
        Linker.userData.countryFrame = null;
        if (isNaN(idavatar)) {
            idavatar = 1;
        }
        idavatar = Number(idavatar);
        var frame = this.avatarAtlas.getSpriteFrame("avatar (" + idavatar + ")");
        if (!frame) {
            frame = this.avatarAtlas.getSpriteFrame("avatar (1)");
        }
        this.avatarNode.getComponent(cc.Sprite).spriteFrame = frame;
        //
        var usercountryframe = this.setCountryFrameAsId(idcountry);

        var customEvent = new cc.Event.EventCustom(BiDaConstant.GAME_COMMONS_EVENT.SET_USER_AVATAR_AS_FRAME, true);
        customEvent.useravatarframe = frame;
        customEvent.usercountryframe = usercountryframe;
        Linker.userData.avatarFrame = frame;
        Linker.userData.countryFrame = usercountryframe;
        this.node.dispatchEvent(customEvent);
    },
    setUserName: function (name) {
        this.userNameNode.getComponent(cc.Label).string = name;
        var customEvent = new cc.Event.EventCustom(BiDaConstant.GAME_COMMONS_EVENT.SET_USER_NAME, true);
        customEvent.username = name;
        this.node.dispatchEvent(customEvent);
    },
    setUserID: function (id) {
        id = "ID: " + id;
        this.userIDNode.getComponent(cc.Label).string = id;
        var customEvent = new cc.Event.EventCustom(BiDaConstant.GAME_COMMONS_EVENT.SET_USER_ID, true);
        customEvent.userid = id;
        this.node.dispatchEvent(customEvent);
    },
    setUserExp: function (exp) {
        this.userAvatarLevel.active = true;
        var spriteLevel = this.userAvatarLevel.getComponent(cc.Sprite);
        spriteLevel.fillCenter = 0;
        spriteLevel.fillCenter = cc.v2(0.5, 0.5)
        var level = Utils.Malicious.getLevelRankingByExp(exp);
        var percentLevel = level * 100 / 30;
        var fillRange = percentLevel / 100;
        spriteLevel.fillRange = fillRange; //0 -1
        var customEvent = new cc.Event.EventCustom(BiDaConstant.GAME_COMMONS_EVENT.SET_USER_EXP, true);
        customEvent.userexp = exp;
        this.node.dispatchEvent(customEvent);
    },
    setUserMoneyXu: function (money) {
        money = Utils.Malicious.moneyWithFormat(money, ".");
        this.userMoneyXuNode.getComponent(cc.Label).string = money;
        // var currentMoney = isNaN(Number(this.userMoneyXuNode.getComponent(cc.Label).string)) ? 0 : Number(this.userMoneyXuNode.getComponent(cc.Label).string);
        // this.runMoneyTextAnimation(currentMoney, Number(money), 1, this.userMoneyXuNode.getComponent(cc.Label));
        //this.userMoneyXuNode.color = cc.Global.silverColor;
        // var customEvent = new cc.Event.EventCustom(BiDaConstant.GAME_COMMONS_EVENT.SET_USER_MONEY, true);
        // customEvent.usermoney = money;
        // this.node.dispatchEvent(customEvent);
    },
    setUserMoneyQuan: function (money) {
        money = Utils.Malicious.moneyWithFormat(money, ".");
        this.userMoneyQuanNode.getComponent(cc.Label).string = money;
        // var currentMoney = isNaN(Number(this.userMoneyQuanNode.getComponent(cc.Label).string)) ? 0 : Number(this.userMoneyQuanNode.getComponent(cc.Label).string);
        // this.runMoneyTextAnimation(currentMoney, Number(money), 1, this.userMoneyQuanNode.getComponent(cc.Label));
        this.userMoneyQuanNode.color = cc.Global.goldColor;
        // var customEvent = new cc.Event.EventCustom(BiDaConstant.GAME_COMMONS_EVENT.SET_USER_MONEY, true);
        // customEvent.usermoney = money;
        // this.node.dispatchEvent(customEvent);
    },
    setUserLevel: function (level) {
        this.userLevelNode.getComponent(cc.Label).string = level;
        var customEvent = new cc.Event.EventCustom(BiDaConstant.GAME_COMMONS_EVENT.SET_USER_LEVEL, true);
        customEvent.userlevel = level;
        this.node.dispatchEvent(customEvent);
    },
    setCountryFrameAsId: function (id) {
        if (!id) {
            id = "w";
        }
        var flag = this.countryFlagAtlas.getSpriteFrame(id);
        if (flag) {
            this.countryNode.getComponent(cc.Sprite).spriteFrame = flag;
        } else {
            this.countryNode.getComponent(cc.Sprite).spriteFrame = this.countryFlagAtlas.getSpriteFrame("w");
        }
        return this.countryNode.getComponent(cc.Sprite).spriteFrame;
    },
    setUserOnline: function (number) {
        if (number) {
            this.userOnline.getComponent(cc.Label).string = number;
        }
    },

    showLobby() {
        //this.groupBtn.active = false;
    },

    hideLobby() {
        //this.groupBtn.active = true;
    },

    activeMoney() {
        if (cc.Global.bidaMoneyType == 0) {
            this.userMoneyXuNode.parent.getChildByName('bg').getComponent(cc.Sprite).spriteFrame = this.list_spriteFrame[1];
            this.userMoneyQuanNode.parent.getChildByName('bg').getComponent(cc.Sprite).spriteFrame = this.list_spriteFrame[0];
        } else {
            this.userMoneyXuNode.parent.getChildByName('bg').getComponent(cc.Sprite).spriteFrame = this.list_spriteFrame[0];
            this.userMoneyQuanNode.parent.getChildByName('bg').getComponent(cc.Sprite).spriteFrame = this.list_spriteFrame[1];
        }
    },

    onChangeMoneyType(data) {
        cc.Global.hideLoading();
        cc.Global.bidaMoneyType = data.moneyType;
        this.activeMoney();
        if (Linker.ZONE && Linker.ZONE != BiDaConstant.ZONE_ID.ZONEID_BIDA_LUCKY_SHOT) {
            if (Linker._sceneTag == BiDaConstant.TAG.scenes.LOBBY) {
                var sendData = CommonSend.joinZone(Linker.ZONE, 0);
                Linker.Socket.send(sendData);
            }
        }
    },

    onUserOnline(data) {
        if (data.status == 1) {
            cc.Global.userOnline = data.userOnline;
            this.setUserOnline(cc.Global.userOnline);
        }
    },

    onDestroy() {
        this.removeSocketEvent();
    },

    runMoneyTextAnimation: function (currentMoney, nextMoney, timeRunAction, moneyText) {
        if (currentMoney >= nextMoney) {
            return;
        }
        moneyText.value = nextMoney;
        var duration = timeRunAction * 1000;
        var range = nextMoney - currentMoney;
        // no timer shorter than 50ms (not really visible any way)
        var minTimer = 50;
        // calc step time to show all interediate values
        var stepTime = Math.abs(Math.floor(duration / range));

        // never go below minTimer
        stepTime = Math.max(stepTime, minTimer);

        // get current time and calculate desired end time
        var startTime = new Date().getTime();
        var endTime = startTime + duration;
        var timer;

        function run() {
            var now = new Date().getTime();
            var remaining = Math.max((endTime - now) / duration, 0);

            var value = Math.round(nextMoney - (remaining * range));

            if (moneyText && moneyText.isValid) {
                moneyText.string = Utils.Malicious.moneyWithFormat(value, ".");
            } else {
                clearInterval(timer);
            }
            if (Number(value) === Number(nextMoney)) {
                clearInterval(timer);
            }
        }
        timer = setInterval(run, stepTime);
        run();
    },
    // update (dt) {},
});