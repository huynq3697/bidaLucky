var BiDaConstant = require('BiDaConstant');
var NewAudioManager = require('NewAudioManager');
var Utils = require('Utils');
var Linker = require('Linker');
var i18n = require('i18n');
var FacebookSDK = require("FacebookSDK");
var CommonSend = require('CommonSend');
cc.Class({
    extends: cc.Component,

    properties: {
        commonAtlas: cc.SpriteAtlas,
        popupBiBanCanAn: cc.Node,
        popupCombo: cc.Node,
        ballError: cc.Node,
        myTurn: cc.Node,
        otherTurn: cc.Node,
        startGame: cc.Node,
        readyGame: cc.Node,
        percentForce: cc.Node,
        chiaBaiNode: cc.Node,
        endGame: cc.Node,
        startTickTimeMp3: cc.AudioSource,
        winMp3: cc.AudioSource,
        loseMp3: cc.AudioSource,
        playerViewWinLose: cc.Prefab,
        listPopup: [cc.Node],
        iconMoneySpriteFrame: [cc.SpriteFrame],
        iconMoneyTypeSP: [cc.SpriteFrame],
        titleSpriteAtlas: cc.SpriteAtlas
    },
    ctor: function () {
        this._allNodesRunningActions = [];
    },
    onLoad() {

    },
    onEnable() {
        //Ẩn chữ Bắt đầu trong TH reconnect lai
    },
    runAnimationChiaBai: function (data, cb) {
        // this.showPopup(this.chiaBaiNode);
        this.chiaBaiNode.active = true;
        this.chiaBaiNode.stopAllActions();
        this.node.active = true;
        this.chiaBaiNode.scale = 1;
        this.chiaBaiNode.opacity = 255;
        var x = cc.winSize.width * 0.5;
        var y = cc.winSize.height * 0.5;
        //set content popup
        var des = this.chiaBaiNode.parent.convertToNodeSpaceAR(cc.v2(x, y));
        this.chiaBaiNode.position = des;
        var ChiaBaiContainerJs = this.chiaBaiNode.getComponent("ChiaBaiContainer");
        if (ChiaBaiContainerJs) {
            var _this = this;
            this._allNodesRunningActions.push(this.chiaBaiNode);
            var _data = data;
            this.chiaBaiNode.runAction(
                cc.sequence(
                    cc.callFunc(function () {
                        ChiaBaiContainerJs.createQuanBaiDeChia(_data, function (err, response) {
                            _this._allNodesRunningActions.push(_this.chiaBaiNode);
                            if (!err) {
                                cb(null, _this.chiaBaiNode);
                            } else {
                                if (cb) {
                                    cb(true, null);
                                }
                            }
                        })
                    })
                )
            )
        }
    },
    runComboPopup: function (time, data, cb) {
        // this.showPopup(this.popupCombo);
        this.node.active = true;
        this.popupCombo.active = true;
        this.popupCombo.stopAllActions();
        this.node.active = true;
        this.popupCombo.scale = 1;
        this.popupCombo.opacity = 255;
        var x = cc.winSize.width * 0.5;
        var y = cc.winSize.height * 0.5;
        //set content popup
        var des = this.popupCombo.parent.convertToNodeSpaceAR(cc.v2(x, y));
        this.popupCombo.position = cc.v2(0, 0);
        var comBoContainer = this.popupCombo.getChildByName("Combo");
        if (comBoContainer) {
            var comBoText = comBoContainer.getChildByName("comBoText");
            if (comBoText) {
                var num = comBoText.getChildByName("num");
                if (num && num.getComponent(cc.Sprite)) {
                    if (data.num && data.num > 0 && data.num < 10) {
                        num.getComponent(cc.Sprite).spriteFrame = this.commonAtlas.getSpriteFrame("img_num_" + data.num);
                        this._allNodesRunningActions.push(this.popupCombo);
                        this.popupCombo.runAction(
                            cc.sequence(
                                cc.moveTo(0.15, des),
                                cc.delayTime(0.05),
                                cc.scaleTo(0.1, 2),
                                cc.scaleTo(0.1, 1),
                                cc.delayTime(time),
                                cc.spawn(
                                    cc.moveTo(0.25, cc.v2(des.x * 2, des.y * 2)).easing(cc.easeBackIn(3.0)),
                                    cc.fadeOut(0.25)
                                ),
                                cc.callFunc(function () {
                                    this.popupCombo.position = cc.v2(0, 0);
                                    this.popupCombo.scale = 0;
                                    if (cb) {
                                        cb(null, true);
                                    }
                                }.bind(this))
                            )
                        )
                    }
                }
            }
        }
    },
    runEndGameCommonPopup1vs4: function (time, data, type, cb) {
        //Ẩn chữ Bắt đầu
        this.node.parent.getChildByName("title").active = false;
        NewAudioManager.PlayUrl(NewAudioManager.sound.win_effect);
        //type win, lose, view
        this.showPopup(this.endGame);
        this.node.active = true;
        this.endGame.scale = 0;
        this.endGame.opacity = 0;
        var x = cc.winSize.width * 0.5;
        var y = cc.winSize.height * 0.5;
        this.endGame.position = this.endGame.parent.convertToNodeSpaceAR(cc.v2(x, y));
        this.endGame.active = true;
        if (type == 1) {
            NewAudioManager.playEffectADS(this.winMp3, 1, false);
        } else {
            NewAudioManager.playEffectADS(this.loseMp3, 1, false);
        }
        this.endGame.stopAllActions();
        var ketquaGame11 = this.endGame.getChildByName("KetquaContainer");
        var ketquaGame14 = this.endGame.getChildByName("KetquaContainer14");
        if (ketquaGame14 && ketquaGame11) {
            ketquaGame14.active = true;
            ketquaGame11.active = false;
            var containerLayoutKq = ketquaGame14.getChildByName("playerContainer");
            if (containerLayoutKq) {
                containerLayoutKq.active = true;
                containerLayoutKq.opacity = 0;
                containerLayoutKq.removeAllChildren(true);
                containerLayoutKq.destroyAllChildren();
                if (data && data.playerDataInGame) {
                    var _isMyPlaying = data._isMyPlaying;
                    var _myResultData = [];
                    var _otherResultData = [];
                    var _vsSpriteData = [];
                    var _combineResult = [];

                    var listPlayers = data.playerDataInGame;
                    //ben trai se la icon cua toi
                    for (let i = 0; i < listPlayers.length; i++) {
                        var player = cc.instantiate(this.playerViewWinLose);
                        var mainContent = player.getChildByName("mainContent");
                        if (mainContent) {
                            var profile = mainContent.getChildByName("profile");
                            var shareContainer = mainContent.getChildByName("shareContainer");
                            if (profile && shareContainer) {
                                var name = profile.getChildByName("name");
                                var avatar = profile.getChildByName("avatar");
                                var win = profile.getChildByName("win");
                                var lose = profile.getChildByName("lose");
                                var draw = profile.getChildByName("draw");
                                var moneyWin = profile.getChildByName("moneyWin");
                                var moneyLose = profile.getChildByName("moneyLose");

                                if (name && avatar && win && lose && moneyWin && moneyLose) {
                                    var _nameLabel = name.getComponent(cc.Label);
                                    var _avatarSprite = avatar.getComponent(cc.Sprite);
                                    var _moneyLoseLabel = moneyLose.getComponent(cc.Label);
                                    var _moneyWinLabel = moneyWin.getComponent(cc.Label);
                                    if (_nameLabel && _avatarSprite && _moneyWinLabel && _moneyLoseLabel) {
                                        win.active = false;
                                        lose.active = false;
                                        moneyLose.active = false;
                                        moneyWin.active = false;
                                        shareContainer.active = false;
                                        var moneyWinLose = Utils.Malicious.formatMoney2(listPlayers[i].resultMoney.toString());
                                        if (listPlayers[i].isWin) {
                                            win.active = true;
                                            moneyWin.active = true;
                                            _moneyWinLabel.string = moneyWinLose;
                                        } else {
                                            lose.active = true;
                                            moneyLose.active = true;
                                            _moneyLoseLabel.string = moneyWinLose;
                                        }
                                        if (Number(data.winPlayerId) == 0) {
                                            //hoa
                                            win.active = false;
                                            lose.active = false;
                                            draw.active = true;
                                            moneyLose.active = false;
                                            moneyWin.active = false;
                                            _moneyWinLabel.string = Utils.Malicious.formatMoney2(listPlayers[i].resultMoney.toString());
                                        }
                                        if (listPlayers[i].userId == Number(Linker.userData.userId)) {
                                            shareContainer.active = true;
                                            var shareButton = shareContainer.getChildByName("btnChiase");
                                            if (shareButton) {
                                                var message_share = "";
                                                if (type == 1) {
                                                    message_share = i18n.t("message_share_win_on_facebook") + " " + moneyWinLose + " " + 'Gcoin' + ":)";
                                                } else {
                                                    message_share = i18n.t("message_share_lose_on_facebook") + " " + moneyWinLose + " " + 'Gcoin' + ":(";
                                                }
                                                shareButton.data = {
                                                    message_share: message_share,
                                                }
                                                this.shareContent = null;
                                                shareButton.on(cc.Node.EventType.TOUCH_START, this.shareResultOnFacebook, this);
                                            }
                                        }
                                        _nameLabel.string = listPlayers[i].userName;
                                        _avatarSprite.spriteFrame = listPlayers[i].userAvatarFrame;
                                    }
                                }
                            }
                        }
                        if (listPlayers[i].userId == Number(Linker.userData.userId)) {
                            _myResultData.push(player);
                        } else {
                            _otherResultData.push(player);
                        }
                    }
                    if (_isMyPlaying) {
                        //tao cotainer node vs
                        var _vsContainer = new cc.Node();
                        _vsContainer.setContentSize(cc.size(300, 300));
                        //o giua la logo vs
                        var _vsSpriteNode = new cc.Node();
                        var _vsSprite = _vsSpriteNode.addComponent(cc.Sprite);
                        _vsSprite.spriteFrame = this.titleSpriteAtlas.getSpriteFrame("line_vs");
                        _vsContainer.addChild(_vsSpriteNode);
                        _vsSpriteData.push(_vsContainer);
                    }
                    //ben phai la icon cua cac doi thu da lay o tren
                    _combineResult = Utils.Malicious.flattern([_myResultData, _vsSpriteData, _otherResultData]);
                    //them ket qua vao container chua list ket qua
                    if (_combineResult && Array.isArray(_combineResult)) {
                        for (let j = 0; j < _combineResult.length; j++) {
                            containerLayoutKq.addChild(_combineResult[j]);
                        }
                    }
                    containerLayoutKq.active = true;
                    containerLayoutKq.stopAllActions();
                    containerLayoutKq.runAction(cc.fadeIn(0.2));
                    this._allNodesRunningActions.push(containerLayoutKq);
                    //
                    //player2 info
                    this._allNodesRunningActions.push(this.endGame);
                    this.endGame.runAction(
                        cc.sequence(
                            cc.spawn(
                                cc.fadeIn(0.15),
                                cc.scaleTo(0.15, 1.05)
                            ),
                            cc.delayTime(time),
                            cc.fadeOut(0.25),
                            cc.callFunc(function () {
                                this.endGame.position = cc.v2(0, 0);
                                if (cb) {
                                    cb(null, true);
                                }
                            }.bind(this))
                        )
                    )
                }
            }

        }
    },
    runEndGamePoup: function (time, data, type, cb) {
        cc.log("run end game poup");
        NewAudioManager.PlayUrl(NewAudioManager.sound.win_effect);
        //Ẩn chữ Bắt đầu
        this.node.parent.getChildByName("title").active = false;

        this.showPopup(this.endGame);
        this.node.active = true;
        this.endGame.scale = 0;
        this.endGame.opacity = 0;
        var x = cc.winSize.width * 0.5;
        var y = cc.winSize.height * 0.5;
        this.endGame.position = this.endGame.parent.convertToNodeSpaceAR(cc.v2(x, y));
        this.endGame.active = true;
        if (type == 1) {
            NewAudioManager.playEffectADS(this.winMp3, 1, false);
        } else {
            NewAudioManager.playEffectADS(this.loseMp3, 1, false);
        }
        var ketqua = this.endGame.getChildByName("KetquaContainer");
        var ketquaGame14 = this.endGame.getChildByName("KetquaContainer14");
        if (ketquaGame14) {
            ketquaGame14.active = false;
        }
        if (ketqua) {
            var player1UserInfo = ketqua.getChildByName("player1");
            var player2UserInfo = ketqua.getChildByName("player2");
            var layout = ketqua.getChildByName("layout");
            var iconMoneyType = layout.getChildByName("money").getChildByName("icon").getComponent(cc.Sprite);
            iconMoneyType.spriteFrame = this.iconMoneyTypeSP[cc.Global.bidaMoneyType];
            player1UserInfo.active = false;
            player2UserInfo.active = false;
            layout.active = true;
            ketqua.active = true;
            //player1 info
            if (player1UserInfo && player2UserInfo && player1UserInfo.isValid && player2UserInfo.isValid) {
                var players = [player1UserInfo, player2UserInfo];

                if (data.players && data.players.length == players.length) {
                    for (let i = 0; i < players.length; i++) {
                        var userView = data.players[i].getComponent("BillardUserView");
                        if (userView) {
                            var name = players[i].getChildByName("name");
                            var avatar = players[i].getChildByName("avatar");
                            if (name) {
                                name.active = true;
                                var _nameLabel = name.getComponent(cc.Label);
                                if (_nameLabel) {
                                    _nameLabel.fontSize = 18;
                                    _nameLabel.string = userView.getUserName();
                                }
                            }
                            if (avatar) {
                                avatar.active = true;
                                avatar.getComponent(cc.Sprite).spriteFrame = userView.getUserAvatarFrame();
                            }

                            var shareButtonContainer = players[i].getChildByName("shareContainer");
                            var moneyLoseLabel = players[i].getChildByName("moneyLose").getComponent(cc.Label);
                            var moneyWinWin = players[i].getChildByName("moneyWin").getComponent(cc.Label);
                            var _fontSizeMoney = 25;
                            moneyLoseLabel.fontSize = _fontSizeMoney;
                            moneyWinWin.fontSize = _fontSizeMoney;
                            moneyLoseLabel.string = data.loseMoney ? Utils.Malicious.formatMoney2(data.loseMoney.toString()) : "";
                            moneyWinWin.string = data.winMoney ? Utils.Malicious.formatMoney2(data.winMoney.toString()) : "";
                            if (shareButtonContainer) {
                                shareButtonContainer.active = false;
                                if (!Linker.BiDaOfflineController) {
                                    if (Number(userView.getUserID()) == Number(Linker.userData.userId)) {
                                        shareButtonContainer.active = true;
                                        var message_share = "";
                                        if (type == 1) {
                                            message_share = i18n.t("message_share_win_on_facebook") + " " + data.winMoney + " " + 'Gcoin' + ":)";
                                        } else {
                                            message_share = i18n.t("message_share_lose_on_facebook") + " " + data.loseMoney + " " + 'Gcoin' + ":(";
                                        }
                                        var shareButton = shareButtonContainer.getChildByName("btnChiase");
                                        if (shareButton) {
                                            shareButton.data = {
                                                message_share: message_share,
                                            }
                                            this.shareContent = null;
                                            shareButton.on(cc.Node.EventType.TOUCH_START, this.shareResultOnFacebook, this);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                //NEW
                var animationNode = this.node.getChildByName('EndGame').getChildByName('KetquaContainer').getChildByName('Animation');
                var Animation = animationNode.getComponent(cc.Animation);
                var self = this;
                animationNode.children.forEach(child => {
                    child.getComponent(cc.Sprite).spriteFrame = self.iconMoneySpriteFrame[cc.Global.bidaMoneyType];
                })
                var clips = Animation.getClips();
                NewAudioManager.PlayUrl(NewAudioManager.sound.money_fly);
                if (Number(data.winPlayerId) === 0) {
                    player1UserInfo.getChildByName('win').active = false;
                    player1UserInfo.getChildByName('lose').active = false;
                    player1UserInfo.getChildByName('draw').active = true;
                    player1UserInfo.getChildByName('moneyLose').active = false;
                    player1UserInfo.getChildByName('moneyWin').active = false;

                    player2UserInfo.getChildByName('win').active = false;
                    player2UserInfo.getChildByName('lose').active = false;
                    player2UserInfo.getChildByName('draw').active = true;
                    player2UserInfo.getChildByName('moneyLose').active = false;
                    player2UserInfo.getChildByName('moneyWin').active = false;
                }
                else {
                    if (type == 1) {
                        player1UserInfo.getChildByName('win').active = true;
                        player1UserInfo.getChildByName('lose').active = false;
                        player1UserInfo.getChildByName('draw').active = false;
                        player1UserInfo.getChildByName('moneyLose').active = false;
                        player1UserInfo.getChildByName('moneyWin').active = true;

                        player2UserInfo.getChildByName('win').active = false;
                        player2UserInfo.getChildByName('lose').active = true;
                        player2UserInfo.getChildByName('draw').active = false;
                        player2UserInfo.getChildByName('moneyLose').active = true;
                        player2UserInfo.getChildByName('moneyWin').active = false;

                        Animation.play(clips[0].name);
                    } else {
                        player1UserInfo.getChildByName('win').active = false;
                        player1UserInfo.getChildByName('lose').active = true;
                        player1UserInfo.getChildByName('draw').active = false;
                        player1UserInfo.getChildByName('moneyLose').active = true;
                        player1UserInfo.getChildByName('moneyWin').active = false;

                        player2UserInfo.getChildByName('win').active = true;
                        player2UserInfo.getChildByName('lose').active = false;
                        player2UserInfo.getChildByName('draw').active = false;
                        player2UserInfo.getChildByName('moneyLose').active = false;
                        player2UserInfo.getChildByName('moneyWin').active = true;
                        Animation.play(clips[1].name);
                    }
                }
            }
            player1UserInfo.active = true;
            player2UserInfo.active = true;
            //player2 info
            this._allNodesRunningActions.push(this.endGame);
            this.endGame.stopAllActions();
            this.endGame.active = true;
            //test
            cc.warn("runEndGamePopup Run");
            this.endGame.runAction(
                cc.sequence(
                    cc.spawn(
                        cc.fadeIn(0.15),
                        cc.scaleTo(0.15, 1.05)
                    ),
                    cc.delayTime(time),
                    cc.fadeOut(0.25),
                    cc.callFunc(function () {
                        this.endGame.position = cc.v2(0, 0);
                        if (cb) {
                            cb(null, true);
                        }
                    }.bind(this))
                )
            )
        }

    },
    readyGameRequest: function () {
        if (this.readyGame) {
            if (Linker && Linker.CURRENT_TABLE && Linker.CURRENT_TABLE.hasOwnProperty("tableId")) {
                var tableId = Number(Linker.CURRENT_TABLE.tableId);
                if (isNaN(tableId) == false) {
                    this.readyGame.position = cc.v2(0, 0);
                    this.readyGame.active = false;
                    var send = CommonSend.readyGameRequest(tableId, 1);
                    Linker.Socket.send(send);
                }
            }
        }

    },
    shareResultOnFacebook: function (event) {
        console.log("shareResultOnFacebook");
        if (event) {
            var _buttonShare = event.currentTarget;
            if (_buttonShare && _buttonShare.data) {
                this.shareContent = _buttonShare.data;
                if (cc.sys.isMobile && typeof sdkbox != "undefined") {
                    //native
                    this.pushShareContentOnMyWall(true);
                } else {
                    this.pushShareContentOnMyWall(false);
                }
            } else {
                this.shareContent = null;
            }
        }
    },
    pushShareContentOnMyWall: function (isSdk) {
        console.log("pushShareContentOnMyWall:" + Linker.Config.shareLink);
        if (Linker.Config.shareLink != undefined && Linker.Config.shareLink) {
            cc.sys.openURL(Linker.Config.shareLink);
        } else {
            var info = new Object();
            info.type = "link";
            info.link = "http://kingbida.com";
            info.title = "King bida";
            info.text = "Kinh Bida - Nơi Cơ Thủ Tranh Tài";
            info.image = "http://kingbida.com/logo.png";
            sdkbox.PluginFacebook.share(info);
        }

    },
    clearForcePercent: function () {
        var forceNode = this.percentForce.getChildByName("PercentForce");
        var percentNode;
        var percentLayout;
        if (forceNode) {
            forceNode.active = true;
            forceNode.opacity = 255;
            percentNode = forceNode.getChildByName("PercentBlock");
            if (percentNode) {
                percentNode.active = false;
                percentLayout = percentNode.getChildByName("percents");
                if (percentLayout) {
                    percentLayout.removeAllChildren(true);
                }
            }
        }
    },
    runForcePercent: function (data, cb) {
        if (data && data.percent) {
            var percent = data.percent;
            percent = Math.round(percent);
            if (isNaN(percent) == false) {
                var forceNode = this.percentForce.getChildByName("PercentForce");
                var percentNode;
                var percentLayout;
                if (forceNode) {
                    forceNode.active = true;
                    forceNode.opacity = 255;
                    percentNode = forceNode.getChildByName("PercentBlock");
                    if (percentNode) {
                        percentNode.active = true;

                        percentLayout = percentNode.getChildByName("percents");
                        if (percentLayout) {
                            percentLayout.removeAllChildren(true);
                            this.showPopup(this.percentForce);
                            var x = cc.winSize.width * 0.5;
                            var y = cc.winSize.height * 0.5;
                            //set content popup
                            this.percentForce.position = this.percentForce.parent.convertToNodeSpaceAR(cc.v2(x, y));
                            this.node.opacity = 255;
                            this.node.active = true;
                            this.percentForce.opacity = 255;
                            //convert number to odd num
                            var _tmpblock = Utils.Malicious.convertNumberToIndividual(percent);
                            if (_tmpblock.length == 0) {
                                _tmpblock = [0]
                            }
                            if (_tmpblock.length == 1) {
                                _tmpblock.unshift(0);
                            }
                            //them tat cac con so vao layout
                            var spriteNumArr = [];
                            for (let j = 0; j < _tmpblock.length; j++) {
                                let n = new cc.Node();
                                n.name = "img_num_" + _tmpblock[j];
                                let sp = n.addComponent(cc.Sprite);
                                sp.spriteFrame = this.commonAtlas.getSpriteFrame("img_num_" + _tmpblock[j]);
                                spriteNumArr.push(n);
                            }
                            for (let l = 0; l < spriteNumArr.length; l++) {
                                percentLayout.addChild(spriteNumArr[l]);
                            }
                        }
                    }

                }
            }
        }
    },
    runPoupStartGame: function (data, cb) {
        cc.log("run Poup Start Game");
        //Ẩn chữ Bắt đầu
        this.node.parent.getChildByName("title").active = false;
        this.node.getChildByName("ChiaBaiContainer").getChildByName("title").active = false;
        if (data) {
            var time = data.time;
            this.startTickTimeMp3.stop();
            this.showPopup(this.startGame);
            this.node.active = true;
            this.startGame.active = true;
            this.startGame.stopAllActions();
            this.startGame.scale = 0;
            this.startGame.opacity = 0;
            var x = cc.winSize.width * 0.5;
            var y = cc.winSize.height * 0.5;
            this.startGame.position = this.startGame.parent.convertToNodeSpaceAR(cc.v2(x, y));
            var StartNode = this.startGame.getChildByName("Start");
            var ScondNode;
            var ScondLayout;
            if (StartNode) {
                StartNode.active = true;
                ScondNode = StartNode.getChildByName("scondsBlock");
                ScondLayout = ScondNode.getChildByName("sconds");
                ScondLayout.removeAllChildren(true);
                ScondLayout.scale = 1;
                ScondLayout.position = cc.v2(0, -40);
                if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
                    ScondLayout.scale = 1.15;
                    ScondLayout.position = cc.v2(0, 5);
                }
                ScondNode.active = true;
                var timeSFA = [];
                //chi dem den hang tram s
                //100 = 1|0|0
                var block = [];
                for (var i = 0; i <= time; i++) {
                    var _tmpblock = Utils.Malicious.convertNumberToIndividual(i);
                    if (_tmpblock.length == 0) {
                        _tmpblock = [0]
                    }
                    block.push(_tmpblock);
                }
                for (let j = 0; j < block.length; j++) {
                    timeSFA[j] = [];
                    for (let k = 0; k < block[j].length; k++) {
                        let n = new cc.Node();
                        n.name = "img_num_" + block[j][k];
                        let sp = n.addComponent(cc.Sprite);
                        sp.spriteFrame = this.commonAtlas.getSpriteFrame("img_num_" + block[j][k]);
                        timeSFA[j].push(n);
                    }
                }
                if (ScondNode) {
                    for (let l = 0; l < timeSFA[timeSFA.length - 1].length; l++) {
                        ScondLayout.addChild(timeSFA[timeSFA.length - 1][l]);
                    }
                    timeSFA.splice(timeSFA.length - 1, 1);
                    this.startGame.active = true;
                    this.startGame.stopAllActions();
                    ScondNode.stopAllActions();
                    this._allNodesRunningActions.push(this.startGame);
                    if (data.isShowBoBai) {
                        this.chiaBaiNode.active = true;
                        this.chiaBaiNode.stopAllActions();
                        this.node.active = true;
                        this.chiaBaiNode.scale = 1;
                        this.chiaBaiNode.opacity = 255;
                        var x = cc.winSize.width * 0.5;
                        var y = cc.winSize.height * 0.5;
                        //set content popup
                        var des = this.chiaBaiNode.parent.convertToNodeSpaceAR(cc.v2(x, y));
                        this.chiaBaiNode.position = cc.v2(0, 0);
                        var ChiaBaiContainerJs = this.chiaBaiNode.getComponent("ChiaBaiContainer");
                        if (ChiaBaiContainerJs && cc.isValid(ChiaBaiContainerJs)) {
                            //hien nut chia bai
                            ChiaBaiContainerJs.spawnCardsBegin.destroyAllChildren();
                            ChiaBaiContainerJs.spawnCardsBegin.removeAllChildren(true);
                            this._allNodesRunningActions.push(this.chiaBaiNode);
                            this.chiaBaiNode.runAction(
                                cc.sequence(
                                    cc.moveTo(0.15, des)
                                )
                            )

                        }
                    }
                    if (this.readyGame) {
                        if (data._billardsGameTable && cc.isValid(data._billardsGameTable)) {
                            if(!data._billardsGameTable.getUserReadyById(Linker.userData.userId)){
                                var userData = Linker.Local.readUserData();
                                if (userData && userData.isAutoReady == true) {
                                    this.readyGame.active = false;
                                    if (Linker && Linker.CURRENT_TABLE && Linker.CURRENT_TABLE.hasOwnProperty("tableId")) {
                                        var tableId = Number(Linker.CURRENT_TABLE.tableId);
                                        if (isNaN(tableId) == false) {
                                            var send = CommonSend.readyGameRequest(tableId, 1);
                                            Linker.Socket.send(send);
                                        }
                                    }
                                } else {
                                    //
                                    this.readyGame.position = this.readyGame.parent.convertToNodeSpaceAR(cc.v2(x, y));
                                    this.readyGame.active = true;
                                    this.readyGame.opacity = 255;
                                    var buttonReadyContainer = this.readyGame.getChildByName("Ready");
                                    if (buttonReadyContainer) {
                                        var buttonReady = buttonReadyContainer.getChildByName("btSanSang");
                                        if (buttonReady) {
                                            buttonReady.position = cc.v2(0, -150);
                                            if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
                                                buttonReady.position = cc.v2(0, -200);
                                            }
                                            buttonReady.on(cc.Node.EventType.TOUCH_START, this.readyGameRequest, this);
                                        }
                                    }
                                }
                            }
                        }
                    }

                    this.startGame.runAction(
                        cc.sequence(
                            cc.spawn(
                                cc.fadeIn(0.15),
                                cc.scaleTo(0.15, 1).easing(cc.easeBackInOut(0.35))
                            ),
                            cc.callFunc(function () {
                                this._allNodesRunningActions.push(ScondNode);
                                ScondNode.runAction(
                                    cc.repeat(
                                        cc.sequence(
                                            cc.spawn(
                                                cc.scaleTo(0.05, 1).easing(cc.easeBackInOut(0.15)),
                                                cc.fadeIn(0.03)
                                            ),
                                            cc.spawn(
                                                cc.delayTime(0.5),
                                                cc.callFunc(function () {
                                                    NewAudioManager.playEffectADS(this.startTickTimeMp3, 1, false);
                                                }.bind(this))
                                            ),
                                            cc.spawn(
                                                cc.scaleTo(0.05, 0),
                                                cc.fadeOut(0.05)
                                            ),
                                            cc.callFunc(function () {
                                                if (timeSFA.length > 0) {
                                                    ScondLayout.removeAllChildren(true);
                                                    if (timeSFA.length > 0) {
                                                        for (let l = 0; l < timeSFA[timeSFA.length - 1].length; l++) {
                                                            ScondLayout.addChild(timeSFA[timeSFA.length - 1][l]);
                                                        }
                                                        timeSFA.splice(timeSFA.length - 1, 1);
                                                    }
                                                } else {
                                                    ScondNode.stopAllActions();
                                                    this.startGame.active = true;
                                                    this.node.parent.getChildByName("title").active = true;
                                                    this.scheduleOnce(() => {
                                                        this.node.parent.getChildByName("title").active = false;
                                                    }, 0.5);
                                                    this._allNodesRunningActions.push(this.startGame);
                                                    this.startGame.runAction(
                                                        cc.sequence(
                                                            cc.fadeOut(0.05),
                                                            cc.callFunc(function () {
                                                                this.startGame.position = cc.v2(0, 0);
                                                                this.startTickTimeMp3.stop();
                                                                // if (cb) {
                                                                //     cb(null, {});
                                                                // }
                                                                if (cb) {
                                                                    cb(null, { isShowBoBai: true });
                                                                }
                                                            }.bind(this))
                                                        )
                                                    )
                                                }
                                            }.bind(this)),
                                        ), time + 1
                                    )
                                )
                            }.bind(this))
                        )
                    )
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
        }
    },
    runPopupTurn: function (type, cb) {
        var target = this.myTurn;
        if (type == BiDaConstant.PSEUDO_CONST.LUOT_DANH_CUA_DOI_THU) {
            target = this.otherTurn;
        }
        // this.showPopup(target);
        this.node.active = true;
        target.active = true;
        target.stopAllActions();
        target.scale = 1;
        target.opacity = 0;
        var x = cc.winSize.width * 0.5;
        var y = cc.winSize.height * 0.5;
        var pos = target.parent.convertToNodeSpaceAR(cc.v2(x, y));
        target.position = cc.v2(0, 0);
        this._allNodesRunningActions.push(target);
        target.runAction(
            cc.sequence(
                cc.spawn(
                    cc.fadeIn(0.5),
                    cc.moveTo(0.5, pos)
                ),
                cc.scaleTo(0.2, 1.1),
                cc.scaleTo(0.2, 1.0),
                cc.delayTime(0.25),
                cc.spawn(
                    cc.fadeOut(0.5),
                    cc.moveTo(0.5, pos.mul(2))
                ),
                cc.callFunc(function () {
                    target.position = cc.v2(0, 0);
                    if (cb) {
                        cb(null, true);
                    }
                }.bind(this))
            )
        )
    },
    runPopupBiCanAn: function (listMyBall, cb) {
        this.showPopup(this.popupBiBanCanAn);
        this.node.active = true;
        this.popupBiBanCanAn.active = true;
        this.popupBiBanCanAn.stopAllActions();
        this.popupBiBanCanAn.scale = 0;
        this.popupBiBanCanAn.opacity = 0;
        var x = cc.winSize.width * 0.5;
        var y = cc.winSize.height * 0.5;
        //set content popup
        this.addListBallToPopup(listMyBall);
        this.popupBiBanCanAn.position = this.popupBiBanCanAn.parent.convertToNodeSpaceAR(cc.v2(x, y));
        this.popupBiBanCanAn.active = true;
        this._allNodesRunningActions.push(this.popupBiBanCanAn);
        this.popupBiBanCanAn.runAction(
            cc.sequence(
                cc.spawn(
                    cc.fadeIn(0.15),
                    cc.scaleTo(0.15, 1).easing(cc.easeBackInOut(0.35))
                ),
                cc.delayTime(1.5),
                cc.spawn(
                    cc.scaleTo(0.25, 0),
                    cc.fadeOut(0.25)
                ),
                cc.callFunc(function () {
                    this.popupBiBanCanAn.position = cc.v2(0, 0);
                    if (cb) {
                        cb(null, true);
                    }
                }.bind(this))
            )
        )
    },
    hideAllPopup: function () {
        cc.log("hide all poup");
        for (let i = 0; i < this.listPopup.length; i++) {
            this.listPopup[i].stopAllActions();
            this.listPopup[i].opacity = 0;
            this.listPopup[i].active = false;
            this.listPopup[i].position = cc.v2(0, 0);
        }
        for (let j = 0; j < this._allNodesRunningActions.length; j++) {
            var n = this._allNodesRunningActions[j];
            if (cc.isValid(n)) {
                n.stopAllActions();
                n.active = false;
            }
        }
        this._allNodesRunningActions = [];
    },
    showErrorBallIdWithTime: function (time) {
        this.showPopup(this.ballError);
        this.node.active = true;
        var x = cc.winSize.width * 0.5;
        var y = cc.winSize.height * 0.5;
        this.ballError.position = this.popupBiBanCanAn.parent.convertToNodeSpaceAR(cc.v2(x, y));
        var BallErrorPanel = this.ballError.getComponent("BallErrorPanel");
        if (BallErrorPanel) {
            BallErrorPanel.setCounter(time);
        }
    },
    addListBallToPopup: function (listMyBall) {
        var PopupListBallEatNode = this.popupBiBanCanAn.getChildByName("PopupListBallEat");
        if (PopupListBallEatNode) {
            var PopupListBallEat = PopupListBallEatNode.getComponent("PopupListBallEat");
            if (PopupListBallEat) {
                PopupListBallEat.setMyBallList(listMyBall);
                cc.log("Finish set list my ball...", listMyBall);
            }
        }
    },
    showPopup: function (target) {
        var c;
        for (let i = 0; i < this.listPopup.length; i++) {
            c = this.listPopup[i];
            // c.stopAllActions();
            if (c == target) {
                c.active = true;
                c.opacity = 255;

            } else {
                c.active = false;
                c.position = cc.v2(0, 0);
            }
        }
    }

    // update (dt) {},
});
