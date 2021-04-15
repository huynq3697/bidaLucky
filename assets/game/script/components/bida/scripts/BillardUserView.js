var Linker = require('Linker');
var NewAudioManager = require('NewAudioManager');
var Utils = require('Utils');
var TQUtil = require('TQUtil');
const BiDaConstant = require('BiDaConstant');

cc.Class({
    extends: cc.Component,

    properties: {
        avatarNode: cc.Node,
        labelMoneyNode: cc.Node,
        labelUserNameNode: cc.Node,
        // labelExpNode: cc.Node,
        // labelUserID: cc.Node,
        labelUserLevel: cc.Node,
        labelUserReady: cc.Node,
        progressTimerNode: cc.Node,
        progressTimerNodeMe: cc.Node,
        timeOutMp3: cc.AudioSource,
        flagNode: cc.Node,
        moneyIcon: cc.Node,
        errorNumber: cc.Node,
        chatNode: cc.Node,
        turnBlur: cc.Node,
        cardsSpriteAtlas: cc.SpriteAtlas,
        listCardContainer: cc.Node,
        stop: cc.Node
    },
    onLoad: function () {
        Linker.Event.addEventListener(1300, this.onChatResponse, this);
        cc.Canvas.instance.node.on(1300, this.onChatResponse, this);
        this.maxTimeWaitingTurn = 11; //60seconds
        // this._currentTimer = 0;
        this._percentMatch = 0;
        this.loadFlagResource();
        this.avatarNode.on(cc.Node.EventType.TOUCH_END, this.onClickAvatar, this);
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
    hideListCardContainer: function () {
        if (this.listCardContainer) {
            this.listCardContainer.opacity = 0;
        }
    },
    showListCardContainer: function () {
        if (this.listCardContainer) {
            this.listCardContainer.opacity = 255;
        }
    },
    setTypeCard: function (typecard) {
        this.typeCard = typecard;
    },
    getTypeCard: function () {
        return this.typeCard;
    },
    changeCardSprite: function (data) {
        //change nhung chua hien len
        if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
            this.listCardContainer.destroyAllChildren();
            this.listCardContainer.removeAllChildren(true);
            this.listCardContainer.opacity = 255;
            var cards = data.cards;
            if (cards) {
                // test
                if (!data.isMyCard) {
                    this.listCardContainer.getComponent(cc.Layout).spacingX = -100;
                }
                for (let i = 0; i < cards.length; i++) {
                    //change sprite
                    var card = new cc.Node();
                    card.active = true;
                    card.name = "card" + (i + 1);
                    var cardSprite = card.addComponent(cc.Sprite);
                    cardSprite.spriteFrame = this.cardsSpriteAtlas.getSpriteFrame(this.getTypeCard()); //chi chon chat co
                    if (cardSprite) {
                        if (data._isViewIng) {
                            card.opacity = 255;
                        } else {
                            card.opacity = 0;
                        }
                        card.isInUse = true;
                        if (data.isMyCard) {
                            this.player_list_ball_tren_tay = cards;
                            // cardSprite.spriteFrame = this.cardsSpriteAtlas.getSpriteFrame(cards[i] + cc.Global.typeCard);
                        } else {
                            this.player_list_ball_tren_tay = [];
                            cardSprite.spriteFrame = this.cardsSpriteAtlas.getSpriteFrame("card_face_down");
                        }
                        this.listCardContainer.addChild(card);
                    }
                }
            }
        }
    },
    showCardEndGame(data, _typeCard) {
        this.listCardContainer.getComponent(cc.Layout).spacingX = 0;
        var cards = this.listCardContainer.children;
        for (let i = 0; i < cards.length; i++) {
            if (cards[i] && cards[i].isInUse) {
                if (data[i]) {
                    var typeCard = this.getTypeCard();
                    if (typeCard) {
                        typeCard = data[i] + typeCard.replace(/[0-9]/g, '');
                        cards[i].getComponent(cc.Sprite).spriteFrame = this.cardsSpriteAtlas.getSpriteFrame(typeCard);
                        cards[i].setScale(3);
                        cards[i].opacity = 255;
                    } else if (_typeCard) {
                        cards[i].getComponent(cc.Sprite).spriteFrame = this.cardsSpriteAtlas.getSpriteFrame(_typeCard);
                        cards[i].setScale(3);
                        cards[i].opacity = 255;
                    }
                }
            }
        }
    },
    getCardAllCards: function () {
        var cards = [];
        for (let i = 0; i < this.listCardContainer.children.length; i++) {
            var card = this.listCardContainer.children[i];
            if (card && card.isInUse && cc.isValid(card)) {
                cards.push(card);
            }
        }
        return cards;
    },
    addCardDefault: function () {
        if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
            this.listCardContainer.destroyAllChildren();
            this.listCardContainer.removeAllChildren(true);
            this.listCardContainer.opacity = 0;
            //default se co 7 la
            var data = {
                cards: Utils.Malicious.createArrayRange(1, 7)
            }
            var cards = data.cards;
            if (cards) {
                for (let i = 0; i < cards.length; i++) {
                    var card = new cc.Node();
                    card.name = "card" + (i + 1);
                    var cardSprite = card.addComponent(cc.Sprite);
                    cardSprite.spriteFrame = this.cardsSpriteAtlas.getSpriteFrame("1r"); //chi chon chat co
                    this.listCardContainer.addChild(card);
                    card.opacity = 0;
                }
            }
        }
    },

    onChatResponse: function (message) {
        if (message.status == 1) {
            if (message.userId == this.userID) {
                if (this.chatNode) {
                    this.chatNode.active = true;
                }
                if (this.timeoutClose) {
                    clearTimeout(this.timeoutClose);
                }
                var self = this;
                if (this.chatNode) {
                    if (message.message.includes("Clip")) {
                        this.chatNode.getChildByName("content").active = false;
                        this.chatNode.getChildByName("bg").active = false;
                        this.chatNode.getChildByName("content-emoji").active = true;
                        var clip = cc.Global.findClip(message.message);
                        this.chatNode.getChildByName("content-emoji").getComponent(cc.Animation).addClip(clip);
                        this.chatNode.getChildByName("content-emoji").getComponent(cc.Animation).play(clip.name);
                    } else {
                        this.chatNode.getChildByName("content").active = true;
                        this.chatNode.getChildByName("bg").active = true;
                        this.chatNode.getChildByName("content-emoji").active = false;
                        this.chatNode.getChildByName("content").getComponent(cc.Label).string = message.message;
                    }
                }
                this.timeoutClose = setTimeout(function () {
                    if (self.chatNode && cc.isValid(self.chatNode)) {
                        self.chatNode.active = false;
                    }
                }, 2500);
            }
        }
    },
    loadFlagResource: function (cb) {
        if (Linker.NationFlag) {
            this.countryFlagAtlas = Linker.NationFlag;
            if (cb) {
                cb(null, Linker.NationFlag);
            }
        } else {
            cc.resources.load("bida/images/country_flags/country_flags", cc.SpriteAtlas, function (err, spriteAtlas) {
                if (!err) {
                    this.countryFlagAtlas = spriteAtlas;
                    Linker.NationFlag = spriteAtlas;
                    if (cb) {
                        cb(null, spriteAtlas);
                    }
                } else {
                    Linker.NationFlag = null;
                    if (cb) {
                        cb(true, null);
                    }
                    cc.log("Khong tim thay sheet flag...", err, spriteAtlas);
                }
            }.bind(this));
        }

    },
    showPlayer: function (opacity) {
        opacity = parseInt(opacity);
        if (isNaN(opacity)) {
            opacity = 255;
        }
        this.node.opacity = opacity;
        this.node.active = true;
        this.avatarNode.opacity = opacity;
        this.progressTimerNode.opacity = opacity;
        if (this.userID == Linker.userData.userId) {
            this.progressTimerNodeMe.active = true;
        } else {
            this.progressTimerNodeMe.active = false;
        }
        if (opacity == 150) {
            this.setWaitingStatus(true);
        } else {
            this.setWaitingStatus(false);
        }
    },
    getOpacityPlayer: function () {
        return this.node.opacity;
    },
    setOpacityPlayer: function (opacity) {
        this.node.opacity = opacity;
        this.node.active = true;
        this.avatarNode.opacity = opacity;
        this.progressTimerNode.opacity = opacity;
        if (opacity == 150) {
            this.setWaitingStatus(true);
        } else {
            this.setWaitingStatus(false);
        }
    },
    hidePlayer: function () {
        this.node.opacity = 0;
        this.avatarNode.opacity = 0;
        this.progressTimerNode.opacity = 0;
    },

    setProgressMatch: function (percent) {
        percent = parseInt(percent);
        var _labelPercent = this.progressTimerNode.parent.getChildByName("labelpercent");
        var sprite = this.progressTimerNode.getComponent(cc.Sprite);
        if (isNaN(percent) == false) {
            this.node.opacity == 255;
            this._percentMatch = percent;
            if (_labelPercent && cc.isValid(_labelPercent)) {
                _labelPercent.active = (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) ? true : false;
                _labelPercent.getComponent(cc.Label).string = percent + "%";
            }
            var progress = percent / 100;
            if (sprite) {
                sprite.fillCenter = cc.v2(0.5, 0.5);
                sprite.fillStart = 0;
                sprite.fillRange = -Math.abs(progress);
            }
        } else {
            if (_labelPercent && cc.isValid(_labelPercent)) {
                _labelPercent.active = (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) ? true : false;
                _labelPercent.getComponent(cc.Label).string = "";
            }
            sprite.fillCenter = cc.v2(0.5, 0.5);
            sprite.fillStart = 0;
            sprite.fillRange = -Math.abs(0);
            this._percentMatch = "";
        }

    },
    getPercentMatch: function () {
        return this._percentMatch;
    },
    skipThisTurn: function () {
        //cc.log("BD: het thoi gian danh cua ban");
    },
    waiting: function () {
        this.node.opacity = 100;
        this.avatarNode.opacity = 100;
        this.progressTimerNode.opacity = 0;
        this.progressTimerNodeMe.opacity = 0;
    },
    setAvatarAsSpriteFrame: function (frame) {
        if (frame) {
            this.avatarNode.getComponent(cc.Sprite).spriteFrame = frame;
        }
    },
    getUserName: function () {
        return this.labelUserNameNode.getComponent(cc.Label).string;
    },

    getUserAvatarFrame: function () {
        return this.avatarNode.getComponent(cc.Sprite).spriteFrame;
    },
    setUserPos: function (idpos) {
        this.idpos = idpos;
    },
    setUserName: function (name) {
        if (name) {
            Utils.Malicious.formatName(this.labelUserNameNode, name, Linker.ZONE, this);
        }

    },
    setMoneyIcon: function (listMoneyIcon) {
        if (listMoneyIcon) {
            var spriteFrame = listMoneyIcon[0];
            if (cc.Global.bidaMoneyType == 1) {
                spriteFrame = listMoneyIcon[1];
            }
            if (this.moneyIcon) {
                this.moneyIcon.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            }
        }

    },
    setErrorNumberLabel: function (number) {
        if (this.errorNumber) {
            this.errorNumber.parent.active = true;
            if (!number) {
                this.errorNumber.parent.active = false;
            }
            this.errorNumber.getComponent(cc.Label).string = number;
        }
    },
    setStopLabel: function (string) {
        if (this.stop) {
            this.stop.getChildByName("stopLabel").getComponent(cc.Label).string = string;
        }
    },
    setUserMoney: function (money) {
        if (money) {
            this.labelMoneyNode.active = true;
            var userMoney = TQUtil.parseInt(money.split('.').join(""));
            if (userMoney > 1000000) {
                this.labelMoneyNode.getComponent(cc.Label).string = TQUtil.abbreviate(userMoney);
            } else {
                this.labelMoneyNode.getComponent(cc.Label).string = money;
            }
            cc.Global.setColorMoney(this.labelMoneyNode);
        } else if (Linker.BiDaOfflineController) {
            this.labelMoneyNode.active = false;
        }
    },
    getUserMoney: function () {
        return this.labelMoneyNode.getComponent(cc.Label).string;
    },
    setWaitingStatus: function (s) {
        this._isWaiting = s;
        if (this._isWaiting) {
            if (this.listCardContainer) {
                this.listCardContainer.opacity = 0;
            }
        } else {
            if (this.listCardContainer) {
                this.listCardContainer.opacity = 255;
            }
        }
    },
    getWaitingStatus: function (s) {
        return this._isWaiting;
    },
    setUserExp: function (exp) {
        if (!isNaN(exp)) {
            this.labelExpNode.getComponent(cc.Label).string = exp.toString();
        }
    },
    setFlagAsSpriteFrame: function (key) {
        this.countryId = key;
        if (key) {
            this.loadFlagResource(function (err, data) {
                if (!err) {
                    var frame = data.getSpriteFrame(key);
                    if (!frame) {
                        frame = data.getSpriteFrame("w");
                    }
                    this.setFlagAsFrame(frame);
                }
            }.bind(this))
        }
    },
    setFlagAsFrame: function (frame) {
        if (frame) {
            this.flagNode.getComponent(cc.Sprite).spriteFrame = frame;
        }
    },
    getUserCountryId: function () {
        return this.countryId;
    },
    setMaster: function (isMaster) {
        if (isMaster == "1" || isMaster == 1 || isMaster == true) {
            isMaster = true;
        } else {
            isMaster = false;
        }
        this._isMaster = isMaster;
        if (this._isMaster == true) {
            this.node.getChildByName("percent").getChildByName("master").active = true;
        } else {
            this.node.getChildByName("percent").getChildByName("master").active = false;
        }
    },
    getMaster: function () {
        return this._isMaster;
    },
    getNationFrame: function () {
        return this.flagNode.getComponent(cc.Sprite).spriteFrame;
    },
    getUserID: function () {
        return Number(this.userID);
    },
    setUserID: function (id) {
        id = Number(id);
        if (!isNaN(id)) {
            this.userID = id;
        }
        // this.labelUserID.getComponent(cc.Label).string = id;
    },
    setUserLevel: function (exp) {
        var exp = parseInt(exp);
        this.level = 1;
        if (!isNaN(exp)) {
            this.level = Utils.Malicious.getLevelRankingByExp(exp);
        }
        if (!Linker.BiDaOfflineController) {
            if (!isNaN(exp)) {
                var keyLevelText = "userdata_level_" + this.level;
                this.labelUserLevel.getComponent(cc.Label).textKey = keyLevelText;
            } else {
                this.labelUserLevel.getComponent(cc.Label).textKey = "userdata_level_1";
            }
        } else {
            this.labelUserLevel.getComponent(cc.Label).string = exp;
        }
    },
    setUserLevelByLevel: function (level) {
        var level_1 = parseInt(level);
        if (level_1 == 0 || !level_1) {
            level_1 = 1;
        }
        this.level = level_1;
        if (!Linker.BiDaOfflineController) {
            if (!isNaN(level_1)) {
                var keyLevelText = "userdata_level_" + level_1;
                this.labelUserLevel.getComponent(cc.Label).textKey = keyLevelText;
            } else {
                this.labelUserLevel.getComponent(cc.Label).textKey = "userdata_level_1";
            }
        } else {
            this.labelUserLevel.getComponent(cc.Label).string = level;
        }
    },
    getUserLevel: function () {
        return this.level;
    },
    onClickAvatar: function () {
        NewAudioManager.playClick();
        var customEvent = new cc.Event.EventCustom(BiDaConstant.POPUP_EVENT.USER_INFO.OPEN, true);
        customEvent.userID = this.getUserID();
        if (customEvent.userID > 0) {
            this.node.dispatchEvent(customEvent);
        }
    },
    resetCounter: function () {
        this.progressTimerNode.getComponent(cc.Sprite).fillRange = -0;
        this.progressTimerNode.getComponent(cc.Sprite).fillStart = 0;
        this.fillRangeMax = -1;
    },
    startCounter: function () {
        this.idpos = this.getIdPos();
        this.progressTimerNode.stopAllActions();
        this.stopCounter();
        this.resetCounter();
        this.progressTimerNode.opacity = 255;
        var scaleX = (this.idpos == 1) ? 1 : -1;
        var scaleY = 1;
        this.progressTimerNode.setScale(cc.v2(scaleX, scaleY));
        this._isCounting = true;
        this._currentTimer = 0;
    },
    getIdPos: function () {
        if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
            if (this.node.name == "User2") {
                return 2;
            }
        }
        return 1;
    },
    stopCounter: function (isMyTurn) {
        this.progressTimerNode.stopAllActions();
        this._isCounting = false;
        this._currentTimer = 0;
        this.timeOutMp3.stop();
        if (isMyTurn) {
            this.progressTimerNode.opacity = 255;
            // this.progressTimerNode.getComponent(cc.Sprite).fillRange = 1;
            this.progressTimerNode.getComponent(cc.Sprite).fillStart = 0;
        } else {
            this.progressTimerNode.opacity = 0;
            this.resetCounter();
        }
    },
    setBotType: function (isBot) {
        this.isBot = isBot;
    },
    getBotType: function () {
        return this.isBot;
    },
    setCardTarget: function (cardTarget) {
        if (cardTarget) {
            this.cardTarget = cardTarget;
        }
    },
    getCardTarget: function () {
        return this.cardTarget;
    },
    update(dt) {
        if (this._isCounting) {
            this._currentTimer += dt;
            if (this._currentTimer <= this.maxTimeWaitingTurn) {
                var t = (this._currentTimer * 100) / this.maxTimeWaitingTurn;
                this.setProgressMatch(t);
                if (this.progressTimerNode.getComponent(cc.Sprite).fillRange <= -1) { }
            } else {
                this._isCounting = false;
                this.setProgressMatch(100);
                if (!cc.Global.isShoted) {
                    NewAudioManager.playEffectADS(this.timeOutMp3, 1, true);
                    if (this.userID === Number(Linker.userData.userId)) {
                        NewAudioManager.PlayUrl(Linker.gameLanguage == "vi" ? NewAudioManager.SOUND.VI.TIME_OUT : NewAudioManager.SOUND.EN.TIME_OUT);
                    }
                }
                var self = this;
                this.progressTimerNode.runAction(
                    cc.sequence(
                        cc.repeat(
                            cc.sequence(
                                cc.scaleTo(0.10, 1.01),
                                cc.scaleTo(0.10, 0.95)
                            ), 15
                        ),
                        cc.callFunc(function () {
                            self.progressTimerNode.scale = 1;
                            self.stopCounter(true);
                            //self.node.dispatchEvent(new cc.Event.EventCustom(BiDaConstant.GAME_TABLE_EVENT.GUI_YEU_CAU_AUTO_NEXT_TURN_LEN_SERVER, true));
                            if (Linker.BiDaOfflineController) {
                                Linker.BiDaOfflineController.node.emit(BiDaConstant.GAME_COMMONS_EVENT.OFFLINE_TIME_OUT, {});
                            }
                        }.bind(this))
                    )

                )
            }
        }
    },
});