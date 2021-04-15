var Linker = require('Linker');
var BiDaConstant = require('BiDaConstant');
var i18n = require('i18n');
var Utils = require('Utils');
var PanelPlayerViewBiDaPhom = require('PanelPlayerViewBiDaPhom');
module.exports = {
    isMaxError: false,

    configDefault: function (data) {
        this.hideAllMyBallistDisplay(data);
    },
    hideAllMyBallistDisplay: function (data) {
        var _billardGameTable = data.BillardsGameTable;
        if (_billardGameTable && cc.isValid(_billardGameTable)) {
            this._billardGameTable = _billardGameTable;
            for (let i = 0; i < _billardGameTable.myBallistDisplay.children.length; i++) {
                _billardGameTable.myBallistDisplay.children[i].opacity = 0;
            }
        }
    },
    setMoneyLabel: function (data) {
        var _billardGameTable = data.BillardsGameTable;
        if (_billardGameTable && cc.isValid(_billardGameTable) && data.players) {
            this._billardGameTable = _billardGameTable;
            var players = data.players;
            for (var i = 0; i < players.length; i++) {
                var player = _billardGameTable.getPlayerByUserId(Number(players[i].userId));
                if (!player) {
                    player = _billardGameTable.myUserInfo;
                }
                var money = Utils.Malicious.moneyWithFormat(Number(players[i].userMoney), ".");
                player.getComponent("BillardUserView").setUserMoney(money);
            }
        }
    },
    setErrorNumber: function (data) {
        var _billardGameTable = data.BillardsGameTable;
        if (_billardGameTable && cc.isValid(_billardGameTable) && data.players) {
            this._billardGameTable = _billardGameTable;
            var _billardsGameTableController = this._billardGameTable.getBillardController();
            var players = data.players;
            // an tat ca error number
            _billardGameTable.myUserInfo.getComponent("BillardUserView").setErrorNumberLabel("");
            _billardGameTable.myUserInfo.getComponent("BillardUserView").stop.active = false;
            var otherPlayers = _billardGameTable.rankingUserInfo;
            for (var i = 0; i < otherPlayers.length; i++) {
                otherPlayers[i].getComponent("BillardUserView").setErrorNumberLabel("");
                otherPlayers[i].getComponent("BillardUserView").stop.active = false;
            }
            // end
            for (var i = 0; i < players.length; i++) {
                var player = _billardGameTable.getPlayerByUserId(Number(players[i].id));
                if (!player) {
                    player = _billardGameTable.myUserInfo;
                }
                var seo = "";
                if (players[i].totalSeo > 0) {
                    seo = players[i].totalSeo;
                }
                player.getComponent("BillardUserView").setErrorNumberLabel(seo);

                if (players[i].isStop) {
                    player.getComponent("BillardUserView").stop.active = true;
                    player.getComponent("BillardUserView").setStopLabel(i18n.t("title_error_wrong_ball_label"));
                } else if (seo == _billardsGameTableController.maxError) {
                    player.getComponent("BillardUserView").stop.active = true;
                    player.getComponent("BillardUserView").setStopLabel(i18n.t("title_error_label"));
                    this.isMaxError = true;
                }
            }
        }
    },
    createHeaderUserInfo: function (data) {
        var _billardGameTable = data.BillardsGameTable;
        if (_billardGameTable && cc.isValid(_billardGameTable)) {
            this._billardGameTable = _billardGameTable;
            _billardGameTable.panelUsers = cc.instantiate(_billardGameTable.panelUserBidaPhomPrefab);
            _billardGameTable.panelUserContainer.addChild(_billardGameTable.panelUsers);
        }
    },
    setNextTurn: function (data) {
        // cc.error("setNextTurn", data);
        var _billardGameTable = data.BillardsGameTable;
        if (_billardGameTable && cc.isValid(_billardGameTable)) {
            var ballsInTable = _billardGameTable.getBallsInTable().arrBall;
            var message = data.message;
            this._billardGameTable = _billardGameTable;
            var _isBallWhiteInHole = false;
            if (message) {
                var _isChecked = false;
                if (message && message.players.length == 2) {

                    for (let j = 0; j < message.players.length; j++) {
                        let player = message.players[j];
                        let userId = player.id;
                        if (Number(userId) != Number(_billardGameTable.myUserId)) {
                            if (Number(player.ballErrorId) == BiDaConstant.GAME.STATUS.BALL_ERROR.BI_CAI_ROI_XONG_LO) {
                                // cc.log("************* Server detected ....");
                                _isChecked = true;
                                if (ballsInTable.length > 0 && ballsInTable.indexOf(0) == -1) {
                                    // cc.log("************* Server - Client detected ....");
                                    _isBallWhiteInHole = true;
                                    _billardGameTable.datLaiViTriBiTrang();
                                }
                            }
                            break;
                        }
                    }

                }
                if (!_isChecked) {
                    //check list ball
                    // if (Utils.Malicious.isJsonString(message.dataBall) && message._isNormalNextTurn) {
                    if (Utils.Malicious.isJsonString(message.dataBall)) {
                        var listBiObj = JSON.parse(message.dataBall);
                        var listBi = [];
                        for (let i = 0; i < listBiObj.length; i++) {
                            listBi.push(listBiObj[i].num);
                        }
                        cc.log("listBi", listBi);

                        if (!message._isNormalNextTurn) {
                            var _billardGameTableController = _billardGameTable.getBillardController();
                            if (_billardGameTableController) {
                                _billardGameTableController.resetReconnect(message);
                            }
                        }
                        if (listBi.length > 0 && listBi.indexOf(0) == -1) {
                            cc.log("************* Server detected ....");
                            _isBallWhiteInHole = true;
                            _billardGameTable.datLaiViTriBiTrang();
                        }
                    } else {
                        if (ballsInTable.length > 0 && ballsInTable.indexOf(0) == -1) {
                            cc.log("************* Client detected ....");
                            _isBallWhiteInHole = true;
                            _billardGameTable.datLaiViTriBiTrang();
                        }
                    }
                }
            } else if (ballsInTable.length > 0 && ballsInTable.indexOf(0) == -1) {
                cc.log("************* Client detected ....");
                _billardGameTable.datLaiViTriBiTrang();
            }
            if (!_isBallWhiteInHole) {
                _billardGameTable._tmpEndTurnDataServerWaiting = null;
                if (_billardGameTable.getPlayerIdLuotDanh() == Number(Linker.userData.userId)) {
                    //bi trang dang o tren ban
                    _billardGameTable.unBlockTouchEvent();

                } else {
                    _billardGameTable.blockTouchEvent();
                }
                _billardGameTable.showDrawrouteWhiteBallAdded(true);
                _billardGameTable.cue.getChildByName("drawLine").opacity = 0;
                _billardGameTable.showCueUI();
                var min = 0;
                var max = 360;
                var angular = Math.floor(Math.random() * (max - min + 1)) + min;
                _billardGameTable.cue.angle = angular;
                //
                var whiteBall = _billardGameTable.getBallById(0);
                if (whiteBall) {
                    _billardGameTable.cue.position = whiteBall.position;
                    var deskNode = _billardGameTable.cue.parent;
                    var p = deskNode.convertToWorldSpaceAR(_billardGameTable.cue.position);
                    var wlocation = Utils.Malicious.getApointWhenKnowAngleAndRadius(p, _billardGameTable.cue.angle, deskNode.width * 2);
                    _billardGameTable.setCuePosByTouch(wlocation, false, false, false);

                    var customEvent = {};
                    customEvent.rotation = -_billardGameTable.cue.angle;
                    customEvent.position = _billardGameTable.cue.parent.convertToWorldSpaceAR(_billardGameTable.cue.position);
                    customEvent.positionBall = _billardGameTable.cue.parent.convertToWorldSpaceAR(whiteBall.position);
                    var _billardGameTableController = _billardGameTable.getBillardController();
                    if (_billardGameTableController) {
                        _billardGameTableController.onDaXacLapGocBanBi(customEvent);
                    }
                }
            } else {
                _billardGameTable.cue.active = true;
                _billardGameTable.cue.opacity = 0;
                _billardGameTable.cue.position = cc.v2(99999, 99999);
            }
        }
        // cc.error("end setNextTurn", data);
    },
    configPanelUsers: function (data) {
        var _billardGameTable = data.BillardsGameTable;
        if (_billardGameTable && cc.isValid(_billardGameTable)) {
            this._billardGameTable = _billardGameTable;
            _billardGameTable.panelUserScript = _billardGameTable.panelUsers.getComponent("PanelUsersBidaPhom");
            //myuserinfonode
            if (!_billardGameTable.myUserInfo || (_billardGameTable.myUserInfo && !_billardGameTable.myUserInfo.isValid)) {
                _billardGameTable.myUserInfo = _billardGameTable.panelUserScript.getMyUserInfo();
            }
            //ranking user node
            if (!_billardGameTable.rankingUserInfo || (_billardGameTable.rankingUserInfo && !_billardGameTable.rankingUserInfo.isValid)) {
                _billardGameTable.rankingUserInfo = _billardGameTable.panelUserScript.getRankingUserInfo();
            }
            //list chua bi node
            if (!_billardGameTable.myBallistDisplay || (_billardGameTable.myBallistDisplay && !_billardGameTable.myBallistDisplay.isValid)) {
                _billardGameTable.myBallistDisplay = _billardGameTable.panelUserScript.getMyBallListDisplay();
            }
            //an hien thi cac list bi dang co cua toi
            this.hideAllMyBallistDisplay({ BillardsGameTable: _billardGameTable });
        }
    },
    hideUsersRanking: function (start, end, waiting) {
        if (this._billardGameTable) {
            for (let i = start; i < end; i++) {
                //chi an opacity
                this._billardGameTable.rankingUserInfo[i].opacity = 0;
                this._billardGameTable.rankingUserInfo[i].active = false;
                var userInfoComponentRanking = this._billardGameTable.rankingUserInfo[i].getComponent("BillardUserView");
                if (userInfoComponentRanking) {
                    userInfoComponentRanking.setUserName("Player" + i);
                    userInfoComponentRanking.setUserMoney(0);
                    // userInfoComponentRanking.setUserExp(player.exp);
                    userInfoComponentRanking.setUserLevel(0);
                    userInfoComponentRanking.setAvatarAsSpriteFrame(this._billardGameTable.getFrameById(this._billardGameTable.avatarAtlas, i));
                    userInfoComponentRanking.setUserID(0);
                    userInfoComponentRanking.setUserPos(1);
                    userInfoComponentRanking.hideListCardContainer();
                    if (waiting == 0) {
                        userInfoComponentRanking.waiting();
                    } else {
                        userInfoComponentRanking.showPlayer();
                    }
                }
            }
        }

    },
    addOtherPlayerJoined: function (data) {
        var _billardGameTable = data.BillardsGameTable;
        if (_billardGameTable && cc.isValid(_billardGameTable) && data.message) {
            var message = data.message;
            this._billardGameTable = _billardGameTable;
            var idPlayer = Number(message.player.userId);
            if (idPlayer != Number(Linker.userData.userId)) {
                var player = _billardGameTable.getPlayerByUserId(idPlayer);
                if (!player) {
                    //dam bao rang user id nay chua duoc them, neu duoc them roi thi chi can thay doi tham so
                    player = _billardGameTable.getPlayerByUserId(0);
                    //default voi id = 0 thi nguoi day la user trong
                }
                if (player) {
                    var playerRankingCmp = player.getComponent("BillardUserView");
                    if (playerRankingCmp) {
                        playerRankingCmp.node.active = true;
                        playerRankingCmp.node.opacity = 255;
                        var money = Utils.Malicious.moneyWithFormat(message.player.userMoney, ".");
                        var frame = _billardGameTable.getFrameById(_billardGameTable.avatarAtlas, message.player.avatarId);
                        playerRankingCmp.setUserName(message.player.viewName);
                        playerRankingCmp.setUserMoney(money);
                        playerRankingCmp.setUserLevel(message.player.level);
                        playerRankingCmp.setAvatarAsSpriteFrame(frame);
                        playerRankingCmp.setFlagAsSpriteFrame(message.player.countryId);
                        playerRankingCmp.setUserID(message.player.userId);
                        playerRankingCmp.showPlayer();
                        playerRankingCmp.setProgressMatch("");//0%
                        playerRankingCmp.setUserPos(1);
                        playerRankingCmp.setMaster(message.player.isMaster);
                        playerRankingCmp.hideListCardContainer();
                    }
                }
            }
        }
    },
    initTableInfo: function (data) {
        var _billardGameTable = data.BillardsGameTable;
        var _billardGameTableController = data.BillardsGameTableController;
        if (_billardGameTable && cc.isValid(_billardGameTable) && data.message) {
            var message = data.message;
            this._billardGameTable = _billardGameTable;
            //mode play
            if (Linker.CURRENT_TABLE.isCreate == true) {
                //lay thong tin cua minh truoc da
                this.hideUsersRanking(0, _billardGameTable.rankingUserInfo.length, 0);
                var player = message.player;
                var userInfoComponent = _billardGameTable.myUserInfo.getComponent("BillardUserView");
                // var userInfoComponentRanking = _billardGameTable.rankingUserInfo[0].getComponent("BillardUserView");
                _billardGameTable.setMucCuoc(Utils.Malicious.moneyWithFormat(message.minMoney, "."));
                var tableName = `${i18n.t("button_title_table")}: ` + message.tableIndex;
                _billardGameTable.setTableId(tableName);
                _billardGameTable.setMoneyIconFrame();
                if ((message.player.isMaster == 1 || message.player.isMaster == true && message.playerids.length < 5)) {
                    _billardGameTable.panelUserScript.showBtnInvite();
                }
                if (userInfoComponent && player) {
                    var money = Utils.Malicious.moneyWithFormat(player.userMoney, ".");
                    var frame = _billardGameTable.getFrameById(_billardGameTable.avatarAtlas, player.avatarId);
                    //push left

                    userInfoComponent.setUserName(player.viewName);
                    userInfoComponent.setUserMoney(money);
                    // userInfoComponent.setUserExp(player.exp);
                    userInfoComponent.setUserLevel(player.exp);
                    userInfoComponent.setAvatarAsSpriteFrame(frame);
                    userInfoComponent.setFlagAsSpriteFrame(player.countryId);
                    userInfoComponent.setUserID(player.userId);
                    userInfoComponent.setProgressMatch("");//0%
                    userInfoComponent.setUserPos(1);
                    userInfoComponent.showPlayer();
                    userInfoComponent.setMaster(true);
                    userInfoComponent.setWaitingStatus(data._isWaiting);
                    userInfoComponent.hideListCardContainer();
                    userInfoComponent.setReady((Number(player.isReady) == 1) ? true : false);
                    //push right push thong tin cua minh vao doi hinh ranking
                    // userInfoComponentRanking.setUserName(player.viewName);
                    // userInfoComponentRanking.setUserMoney(money);
                    // // userInfoComponentRanking.setUserExp(player.exp);
                    // userInfoComponentRanking.setUserLevel(player.exp);
                    // userInfoComponentRanking.setAvatarAsSpriteFrame(frame);
                    // userInfoComponentRanking.setUserID(player.userId);
                    // userInfoComponentRanking.setProgressMatch("");//0%
                    // userInfoComponentRanking.showPlayer();
                    // userInfoComponentRanking.setUserPos(1);
                    // userInfoComponentRanking.setMoneyIcon(this.listMoneyIcon);
                    //an 4 player ranking con lai vi minh vua moi tao ban
                    this.hideUsersRanking(0, _billardGameTable.rankingUserInfo.length, 0);

                } else {
                    this.hideUsersRanking(0, _billardGameTable.rankingUserInfo.length, 0);
                }
                Utils.Malicious.destroyAllChildrenWithoutName(_billardGameTable.bidaDeskNode, "CueObj");
                var _panelPlayerView = _billardGameTable.panelUI.getComponent("PanelUIGame").getPanelPlayerView();
                if (_panelPlayerView && cc.isValid(_panelPlayerView)) {
                    var _panelPlayerViewComponent = _panelPlayerView.getComponent("PanelPlayerView");
                    if (_panelPlayerViewComponent && cc.isValid(_panelPlayerViewComponent)) {
                        _panelPlayerViewComponent.resetContentNode();
                    }
                }
            } else if (Linker.CURRENT_TABLE.isJoin == true) {
                //setting left and right
                this.hideUsersRanking(0, _billardGameTable.rankingUserInfo.length, 0);
                _billardGameTable.setMucCuoc(Utils.Malicious.moneyWithFormat(message.minMoney, "."));
                var tableName = `${i18n.t("button_title_table")}: ` + message.tableIndex;
                _billardGameTable.setTableId(tableName);
                _billardGameTable.setMoneyIconFrame();
                if (message.listPlayer) {
                    //push me in use list
                    _billardGameTable.panelUserScript.hideBtnInvite();
                    var myInfo = null;
                    for (let j = 0; j < message.listPlayer.length; j++) {
                        if (Linker.userData.userId == message.listPlayer[j].userId) {
                            if (message.listPlayer[j].isMaster == 1 || message.listPlayer[j].isMaster == true) {
                                _billardGameTable.panelUserScript.showBtnInvite();
                            }
                            //create left lay thong tin nay thiet lap avatar cua minh luon
                            myInfo = message.listPlayer[j];
                            myInfo.percentMatch = "";
                            message.listPlayer.splice(j, 1);
                        }
                    }
                    if (!myInfo) {
                        var money = Linker.userData.userMoney;
                        if (cc.Global.bidaMoneyType == 1) {
                            money = Linker.userData.userRealMoney;
                        }
                        myInfo = {
                            viewName: Linker.userData.displayName,
                            userMoney: Utils.Malicious.moneyWithFormat(Number(money), "."),
                            exp: Number(Linker.userData.userExp),
                            avatarId: Number(Linker.userData.avatar),
                            userId: Number(Linker.userData.userId),
                            countryId: Linker.userData.countryId,
                            isMaster: false,
                            percentMatch: ""
                        }
                    }
                    message.myInfo = myInfo;
                    this.pushLeftInfoPhom({ myInfo: myInfo, data: message });
                    //push user not me in ranking list
                    if (Number(message.isPlaying) == BiDaConstant.GAME_STATE.WAIT) {
                        for (let i = 0; i < message.listPlayer.length; i++) {
                            //create right
                            var player = message.listPlayer[i];
                            var userName = player.viewName;
                            var userMoney = Utils.Malicious.moneyWithFormat(player.userMoney, ".");
                            var userLevel = player.level;
                            var userFrame = _billardGameTable.getFrameById(_billardGameTable.avatarAtlas, player.avatarId);
                            var userID = player.userId;
                            if (i >= 0 && i < _billardGameTable.rankingUserInfo.length) {
                                var userInfoComponentRanking = _billardGameTable.rankingUserInfo[i].getComponent("BillardUserView");
                                if (userInfoComponentRanking) {
                                    userInfoComponentRanking.setUserName(userName);
                                    userInfoComponentRanking.setUserMoney(userMoney);
                                    // userInfoComponentRanking.setUserExp(player.exp);
                                    userInfoComponentRanking.setUserLevelByLevel(userLevel);
                                    userInfoComponentRanking.setAvatarAsSpriteFrame(userFrame);
                                    userInfoComponentRanking.setFlagAsSpriteFrame(player.countryId);
                                    userInfoComponentRanking.setUserID(userID);
                                    userInfoComponentRanking.setProgressMatch("");//0%
                                    userInfoComponentRanking.showPlayer();
                                    userInfoComponentRanking.setUserPos(1);
                                    userInfoComponentRanking.setMoneyIcon(_billardGameTable.listMoneyIcon);
                                    userInfoComponentRanking.setMaster(player.isMaster);
                                    userInfoComponentRanking.hideListCardContainer();
                                    userInfoComponentRanking.setReady((Number(player.isReady) == 1) ? true : false);
                                }
                            }
                        }
                        if (message.listPlayer.length >= 1) {
                            _billardGameTable.hideTimeCountDownBallError();
                            var _this = this;

                            var _isRunAnimationChiaBai = false;
                            _billardGameTable.runBeginMatchAnimation({ time: BiDaConstant.GAME.CONFIG.THOI_GIAN_CHO_BAT_DAU_TRAN_1_VS_4, isShowBoBai: true }, function (err, data) {
                                if (!err) {
                                    // Utils.Malicious.destroyAllChildrenWithoutName(_billardGameTable.bidaDeskNode, "CueObj");
                                    // if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM && !_isRunAnimationChiaBai) {
                                    //     _isRunAnimationChiaBai = true;
                                    //     var animationFx = _this.getStartAnimationCard();
                                    //     if (animationFx) {
                                    //         _billardGameTable.runAnimationChiaBai(animationFx, function (err, chiaBaiNode) {
                                    //             if (!err) {
                                    //                 chiaBaiNode.opacity = 0;
                                    //                 chiaBaiNode.position = cc.v2(0, 0);
                                    //             }
                                    //         })
                                    //     }
                                    // }
                                    cc.log("Handle match start successfully ...");
                                }
                            });
                        }
                    }

                }

            } else if (Linker.CURRENT_TABLE.isReconnect) {
                _billardGameTableController.idplayerLuotDanh = Number(message.currentPlayerId);
                _billardGameTable.myUserId = Number(Linker.userData.userId);
                _billardGameTable.taoCueTrenBanChoi();
                cc.log(message);
                this.hideUsersRanking(0, _billardGameTable.rankingUserInfo.length, 0);
                _billardGameTable.setMucCuoc(Utils.Malicious.moneyWithFormat(message.minMoney, "."));
                var tableName = `${i18n.t("button_title_table")}: ` + message.tableIndex;
                _billardGameTable.setTableId(tableName);
                _billardGameTable.setMoneyIconFrame();
                _billardGameTable.panelUserScript.hideBtnInvite();
                _billardGameTable.isBotInTable = message.isBotInTable;
                message.myInfo = null;
                // var _tmpLuotDanh = 0;
                var listPlayer = [];
                message.listPlayer.forEach((item) => {
                    listPlayer.push(item);
                })
                if (message.listPlayer) {
                    //set user check
                    if (_billardGameTable.isBotInGame()) {
                        for (let o = 0; o < message.listPlayer.length; o++) {
                            if (message.listPlayer[o].isBot == false) {
                                _billardGameTable.userIdCheck = message.listPlayer[o].userId;
                                break;
                            }
                        }
                    }
                    //push me in use list
                    var myInfo = null;
                    for (var j = 0; j < message.listPlayer.length; j++) {
                        if (Linker.userData.userId == message.listPlayer[j].userId) {
                            if ((message.listPlayer[j].isMaster == 1 || message.listPlayer[j].isMaster == true) && _billardGameTableController.gameState == BiDaConstant.GAME_STATE.WAIT) {
                                _billardGameTable.panelUserScript.showBtnInvite();
                            }
                            //create left lay thong tin nay thiet lap avatar cua minh luon
                            myInfo = message.listPlayer[j];
                            message.listPlayer.splice(j, 1);
                        }
                    }
                    message.myInfo = myInfo;
                    this.pushLeftInfoPhom({ myInfo: myInfo, data: message });
                    for (let i = 0; i < message.listPlayer.length; i++) {
                        //create right
                        var player = message.listPlayer[i];
                        var userName = player.viewName;
                        var userMoney = Utils.Malicious.moneyWithFormat(player.userMoney, ".");
                        var userLevel = player.exp;
                        var userFrame = _billardGameTable.getFrameById(_billardGameTable.avatarAtlas, player.avatarId);
                        var userID = player.userId;
                        var userInfoComponentRanking = _billardGameTable.rankingUserInfo[i].getComponent("BillardUserView");
                        if (userInfoComponentRanking) {
                            userInfoComponentRanking.setUserName(userName);
                            userInfoComponentRanking.setUserMoney(userMoney);
                            // userInfoComponentRanking.setUserExp(player.exp);
                            userInfoComponentRanking.setUserLevel(userLevel);
                            userInfoComponentRanking.setAvatarAsSpriteFrame(userFrame);
                            userInfoComponentRanking.setFlagAsSpriteFrame(player.countryId);
                            userInfoComponentRanking.setUserID(userID);
                            userInfoComponentRanking.setProgressMatch("");//0%
                            userInfoComponentRanking.showPlayer();
                            userInfoComponentRanking.setUserPos(1);
                            userInfoComponentRanking.setMoneyIcon(_billardGameTable.listMoneyIcon);
                            userInfoComponentRanking.setMaster(player.isMaster);
                            userInfoComponentRanking.showListCardContainer();
                        }
                    }
                    //set card
                    for (var j = 0; j < listPlayer.length; j++) {
                        var listUsers = Utils.Malicious.flattern([
                            _billardGameTable.myUserInfo,
                            _billardGameTable.rankingUserInfo
                        ]);
                        for (var i = 0; i < listUsers.length; i++) {
                            var userInfoView = listUsers[i].getComponent("BillardUserView");
                            if (userInfoView.getUserID() == Number(listPlayer[j].userId)) {
                                var cards = Utils.Malicious.getCards();
                                var _ctg = listPlayer[j].player_list_ball_tren_tay;
                                if (_ctg && Array.isArray(_ctg) && _ctg.length > 0) {
                                    var typeCard = cards[_ctg[0]][0];
                                    cards[_ctg[0]].splice(0, 1);
                                    userInfoView.setTypeCard(typeCard.cardType);
                                    userInfoView.setBotType(listPlayer[j].isBot);
                                    userInfoView.setCardTarget(listPlayer[j].player_list_ball_tren_tay[0]);
                                }
                            }
                        }
                    }
                    //end

                    // //them bi vao khay neu co cac bi da an
                    _billardGameTable._isShowPopupYourBallList = true;
                    _billardGameTable._isGameStarted = true;

                    if (Utils.Malicious.isJsonString(message.ballEat)) {
                        _billardGameTable.clearAllBallOnTable(message.ballEat);
                        _billardGameTable.clearAllBallInHole();//BallInHole
                    }

                    _billardGameTable.addTouchEventListener();
                    _billardGameTable.addCustomEventDispatch();
                    _billardGameTable.setCueRotateCueListener();
                    if (Number(Linker.userData.userId) !== Number(message.currentPlayerId)) {
                        _billardGameTable.bidaDeskContainer.getChildByName("waitLabel").active = true;
                        _billardGameTableController.isReconnectWait = true;
                    }
                    if (message.dataBall) {
                        cc.log("Co data ball reconnect dang check dieu dieu data ball...", message);
                        if (Utils.Malicious.isJsonString(message.dataBall) && !JSON.parse(message.dataBall)[0].hasOwnProperty("z")) {
                            var clientBallObj = _billardGameTable.getBallsInTable();
                            var serverBall = JSON.parse(message.dataBall);
                            _billardGameTable.reRenderBallPosition(serverBall, clientBallObj);
                        } else {
                            cc.log("Co data ball reconnect nhung khong hop le...", message);
                            var dataBall = [9, 15, 5, 8, 1, 3, 14, 11, 2, 13, 12, 7, 4, 6, 10];
                            var _tmpDataBall = Utils.Malicious.createBallPosWithAngle(dataBall);
                            _billardGameTable.taoBideBatdauTranDau(_tmpDataBall);
                        }
                        _billardGameTable.initListBiAn(message);
                    } else if (message.dataPos && Utils.Malicious.isJsonString(message.dataPos)) {
                        var _tmpDataPos = JSON.parse(message.dataPos);
                        for (let i = 0; i < _tmpDataPos.length; i++) {
                            if (_tmpDataPos[i] == 0) {
                                _tmpDataPos.splice(i, 1);
                            }
                        }
                        _billardGameTable.taoBideBatdauTranDau(JSON.stringify(_tmpDataPos));
                        //khong xoa bi trang di vi la 1vs4 khong quan tam bi roi xuong ho hay chua
                        var dataPos = JSON.parse(message.dataPos);
                        _billardGameTable.panelPower.active = true;
                        if (dataPos.indexOf(0) == -1) {
                            if (message._isShoted == true) {
                                _billardGameTable.datLaiViTriBiTrang({ _isValidPushWhiteBall: true });
                            } else {
                                _billardGameTable.datLaiViTriBiTrang();
                            }
                        } else {
                            _billardGameTable.cue.active = true;
                            _billardGameTable.showCueUI();
                            _billardGameTable.cue.getChildByName("drawLine").opacity = 0;
                        }

                        _billardGameTable.myUserId = Number(Linker.userData.userId);
                        _billardGameTable._isShoted = false;
                        // _billardGameTable._isDataEndTurnGame = true;
                        _billardGameTable.initListBiAn(message);
                    } else {
                        var dataBall = [9, 15, 5, 8, 1, 3, 14, 11, 2, 13, 12, 7, 4, 6, 10];
                        var _tmpDataBall = Utils.Malicious.createBallPosWithAngle(dataBall);
                        _billardGameTable.taoBideBatdauTranDau(_tmpDataBall);
                        _billardGameTable.initListBiAn(message);
                    }
                    var timeLeftTurn = Number(message.timeLeft) / 1000;
                    _billardGameTable.startTimerCounter(Number(message.currentPlayerId), timeLeftTurn);
                    if (Number(Linker.userData.userId) == Number(message.currentPlayerId)) {
                        _billardGameTable._isDataEndTurnGame = false;
                        _billardGameTable.unBlockTouchEvent();
                    } else {
                        // _billardGameTable._isDataEndTurnGame = true;
                        _billardGameTable.blockTouchEvent();
                    }
                    _billardGameTable.showDrawrouteWhiteBallAdded(true);
                    //gui data check
                    // _billardGameTableController.guiDataCheckServer();
                    _billardGameTableController.guiDataCheckServer({ cueR: BiDaConstant.TABLE_STATUS.CLIENT_RECONNECT_LAI_BAN_CHOI });

                }

            }
        }
    },
    pushLeftInfoPhom: function (leftInfoData) {
        if (leftInfoData) {
            var leftInfo = leftInfoData.myInfo;
            if (leftInfo) {
                if (this._billardGameTable) {
                    if (Utils.Malicious.isNotUndefinedObj(leftInfo) == false) {
                        var userInfoComponent = this._billardGameTable.myUserInfo.getComponent("BillardUserView");
                        if (userInfoComponent) {
                            var userName = leftInfo.viewName;
                            var userMoney = Utils.Malicious.moneyWithFormat(leftInfo.userMoney, ".");
                            var userLevel = leftInfo.exp;
                            var userFrame = this._billardGameTable.getFrameById(this._billardGameTable.avatarAtlas, leftInfo.avatarId);
                            var userID = leftInfo.userId;
                            var percentMatch = leftInfo.percentMatch;
                            var isMaster = leftInfo.isMaster;
                            userInfoComponent.setUserName(userName);
                            userInfoComponent.setUserMoney(userMoney);
                            // userInfoComponent.setUserExp(player.exp);
                            userInfoComponent.setUserLevel(Linker.userData.userExp);
                            userInfoComponent.setAvatarAsSpriteFrame(userFrame);
                            userInfoComponent.setFlagAsSpriteFrame(leftInfo.countryId);
                            userInfoComponent.setUserID(userID);
                            userInfoComponent.setProgressMatch(percentMatch);//0%
                            userInfoComponent.showPlayer();
                            userInfoComponent.setUserPos(1);
                            userInfoComponent.setMoneyIcon(this._billardGameTable.listMoneyIcon);
                            userInfoComponent.setMaster(isMaster);
                            userInfoComponent.hideListCardContainer();
                            if (leftInfoData.data) {
                                userInfoComponent.setWaitingStatus(leftInfoData.data._isWaiting);
                            }
                            userInfoComponent.player_list_ball_tren_tay = (leftInfo.player_list_ball_tren_tay) ? (leftInfo.player_list_ball_tren_tay) : [];
                            this._billardGameTable.myListBallOnHand = userInfoComponent.player_list_ball_tren_tay;
                        }
                    } else {
                        cc.log("Thong tin push left info dang bi thieu... ", leftInfo);
                    }
                }
            }
        }
    },
    reConfigPlayersInGame: function (data) {
        var _billardGameTable = data.BillardsGameTable;
        if (_billardGameTable && cc.isValid(_billardGameTable) && data.message) {
            var BillardsGameTableController = _billardGameTable.getBillardController();
            var _panelPlayerViewComponent = _billardGameTable.getPanelPlayerView();
            if (BillardsGameTableController) {
                var message = data.message;
                var playerids = message.playerids;
                this._billardGameTable = _billardGameTable;

                var listUsers = [];
                var playerInView = [];
                var playerInMatch = [];
                var _isMePlaying = false;
                var playersInfo = [];
                listUsers = Utils.Malicious.flattern([[_billardGameTable.myUserInfo], _billardGameTable.rankingUserInfo]);
                //list dang co tren ban choi
                var dataPlaying = _billardGameTable.getListPlayerInfos({ playerids: playerids });
                _isMePlaying = dataPlaying._isMePlaying;
                playerInView = dataPlaying.playerInView;
                playerInMatch = dataPlaying.playerInMatch;
                playersInfo = dataPlaying.playersInfo;

                if (_isMePlaying) {
                    var _tmpPlayerInMatch = [];
                    for (var n = 0; n < playerInMatch.length; n++) {
                        if (playerInMatch[n].userID == Number(_billardGameTable.myUserId)) {
                            _tmpPlayerInMatch.push(playerInMatch[n]);
                            playerInMatch.splice(n, 1);
                            for (var m = 0; m < playerInMatch.length; m++) {
                                _tmpPlayerInMatch.push(playerInMatch[m]);
                            }
                            break;
                        }
                    }
                    playerInMatch = _tmpPlayerInMatch;
                    BillardsGameTableController._isViewMatch = false;
                    //reset thong tin nguoi dung
                    this.hideUsersRanking(0, _billardGameTable.rankingUserInfo.length, 0);
                    //sap xep lai vi tri nguoi choi
                    //resort
                    var _playerInMatchSort = [];
                    for (var i = 0; i < playerInMatch.length; i++) {
                        if (playerInMatch[i].userID == _billardGameTable.myUserId) {
                            _playerInMatchSort.push(playerInMatch[i]);
                            playerInMatch.splice(i, 1);
                            break;
                        }
                    }
                    _playerInMatchSort = Utils.Malicious.flattern([_playerInMatchSort, playerInMatch]);
                    playerInMatch = _playerInMatchSort;
                    for (var k = 0; k < playerInMatch.length; k++) {
                        //create right
                        var userName = playerInMatch[k].userName;
                        var userMoney = playerInMatch[k].userMoney;
                        var userLevel = playerInMatch[k].userLevel;
                        var userFrame = playerInMatch[k].userAvatarFrame;
                        var userID = playerInMatch[k].userID;
                        var userCountryId = playerInMatch[k].userCountryId;
                        var userIsMaster = (userID == playerids[0]) ? true : false;
                        var userInfoComponent = listUsers[k].getComponent("BillardUserView");
                        if (userInfoComponent) {
                            _panelPlayerViewComponent.removePlayerById(userID);
                            userInfoComponent.setUserPos(1);
                            userInfoComponent.setUserName(userName);
                            userInfoComponent.setUserMoney(userMoney);
                            userInfoComponent.setUserLevelByLevel(userLevel);
                            userInfoComponent.setAvatarAsSpriteFrame(userFrame);
                            userInfoComponent.setFlagAsSpriteFrame(userCountryId);
                            userInfoComponent.setUserID(userID);
                            userInfoComponent.setProgressMatch("");//0%
                            userInfoComponent.showPlayer();
                            userInfoComponent.setWaitingStatus(false);
                            userInfoComponent.setMaster(userIsMaster);
                        }
                    }
                    //sap xep lai vi tri nguoi xem
                    _panelPlayerViewComponent.resetContentNode();
                    for (var k = 0; k < playerInView.length; k++) {
                        _panelPlayerViewComponent.addExistPlayerToViewSit(playerInView[k]);
                    }
                    _billardGameTable.setViewerNumber();

                } else {
                    //Neu nguoi xem la minh thi khong them vao panel ben phai
                    message.BillardsGameTable = this._billardGameTable;
                    message.listPlayer = playerInMatch;
                    message.playerIsObserver = playerInView;
                    BillardsGameTableController._isViewMatch = true;
                    var myInfo = {
                        viewName: Linker.userData.displayName,
                        userMoney: Utils.Malicious.moneyWithFormat(Number(Linker.userData.userMoney), "."),
                        exp: Number(Linker.userData.userExp),
                        avatarId: Number(Linker.userData.avatar),
                        userId: Number(Linker.userData.userId),
                        countryId: Linker.userData.countryId,
                        isMaster: false,
                        percentMatch: ""
                    };
                    message.myInfo = myInfo;
                    this.pushLeftInfoPhom({ myInfo: myInfo, data: message });
                    PanelPlayerViewBiDaPhom.config(message);
                }
                //de xem con co ai dang xem nhung slot lai thieu nua khong de cho vao dang cho
                var emptySlots = _billardGameTable.getNumberSlotEmptyOnRanking();
                if (BillardsGameTableController._isViewMatch) {
                    playerInView = Utils.Malicious.removePlayerByIdInArray(playerInView, Number(Linker.userData.userId));
                }
                if (emptySlots.length > 0) {
                    for (var q = 0; q < emptySlots.length; q++) {
                        if (q <= playerInView.length - 1) {
                            var player = emptySlots[q];
                            if (player && cc.isValid(player)) {
                                var playerRankingCmp = player.getComponent("BillardUserView");
                                if (playerRankingCmp) {
                                    playerRankingCmp.node.active = true;
                                    var money = Utils.Malicious.moneyWithFormat(playerInView[q].userMoney, ".");
                                    playerRankingCmp.setUserName(playerInView[q].userName);
                                    playerRankingCmp.setUserMoney(money);
                                    playerRankingCmp.setUserLevel(playerInView[q].userLevel);
                                    playerRankingCmp.setFlagAsFrame(playerInView[q].userNationFrame);
                                    playerRankingCmp.setAvatarAsSpriteFrame(playerInView[q].userAvatarFrame);
                                    playerRankingCmp.setUserID(playerInView[q].userID);
                                    playerRankingCmp.showPlayer(150);
                                    playerRankingCmp.setOpacityPlayer(150);
                                    playerRankingCmp.setWaitingStatus(true);
                                    playerRankingCmp.setProgressMatch("");//0%
                                    playerRankingCmp.setMaster(false);
                                    //danh cho counter do 1vs1 su dung flip(negative size width and height)
                                    playerRankingCmp.setUserPos(1);
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    startTimerCounter: function (data) {
        var _billardGameTable = data.BillardsGameTable;
        if (_billardGameTable && cc.isValid(_billardGameTable) && data.idturnhientai) {
            this._billardGameTable = _billardGameTable;
            var idturnhientai = data.idturnhientai;
            var listUsers = Utils.Malicious.flattern([
                [_billardGameTable.myUserInfo], _billardGameTable.rankingUserInfo
            ]);
            for (let i = 0; i < listUsers.length; i++) {
                var userInfoView = listUsers[i].getComponent("BillardUserView");
                if (userInfoView) {
                    if (userInfoView.getUserID() == idturnhientai) {
                        userInfoView.startCounter();
                        if (data.timeLeftTurn > 0) {
                            userInfoView._currentTimer = data.timeLeftTurn;
                        }
                    } else {
                        userInfoView.stopCounter();
                    }
                }
            }
        }
    },
    stopTimerCounter: function (data) {
        var _billardGameTable = data.BillardsGameTable;
        if (_billardGameTable && cc.isValid(_billardGameTable)) {
            this._billardGameTable = _billardGameTable;
            var listUsers = Utils.Malicious.flattern([
                _billardGameTable.myUserInfo,
                _billardGameTable.rankingUserInfo
            ]);
            for (let i = 0; i < listUsers.length; i++) {
                var userInfoView = listUsers[i].getComponent("BillardUserView");
                if (userInfoView) {
                    userInfoView.stopCounter(true);
                }
            }
        }
    },
    initListPlayerView: function (message) {
        if (this._billardGameTable && cc.isValid(this._billardGameTable)) {
            var _billardGameTableController = this._billardGameTable.getBillardController();
            if (message && message.hasOwnProperty("listPlayerView")) {
                if (message.listPlayerView && Array.isArray(message.listPlayerView) && message.listPlayerView.length > 0) {
                    //bên trái
                    var listPlayerView = message.listPlayerView;
                    var _panelPlayerView = this._billardGameTable.panelUI.getComponent("PanelUIGame").getPanelPlayerView();
                    if (_panelPlayerView && cc.isValid(_panelPlayerView)) {
                        var _panelPlayerViewComponent = _panelPlayerView.getComponent("PanelPlayerView");
                        if (_panelPlayerViewComponent && cc.isValid(_panelPlayerViewComponent)) {
                            _panelPlayerViewComponent.resetContentNode();
                            for (let i = 0; i < listPlayerView.length; i++) {
                                var player = listPlayerView[i];
                                if (player) {
                                    _panelPlayerViewComponent.addPlayerToViewSit(player);
                                }
                            }
                        }
                    }
                    this._billardGameTable.setViewerNumber();
                    //bên phải(dành cho 14, phỏm)
                    var emptySlots = this._billardGameTable.getNumberSlotEmptyOnRanking();
                    if (_billardGameTableController && _billardGameTableController._isViewMatch) {
                        listPlayerView = Utils.Malicious.removePlayerByIdInArray(listPlayerView, Number(Linker.userData.userId));
                    }
                    if (emptySlots.length > 0) {
                        for (var q = 0; q < emptySlots.length; q++) {
                            if (q <= listPlayerView.length - 1) {
                                var userName = listPlayerView[q].viewName;
                                var userLevel = listPlayerView[q].level;
                                var userFrame = this._billardGameTable.getFrameById(this._billardGameTable.avatarAtlas, listPlayerView[q].avatarId);
                                var userID = listPlayerView[q].userId;
                                var userCountryId = listPlayerView[q].countryId;
                                var userMoney = Utils.Malicious.moneyWithFormat(listPlayerView[q].userMoney, ".");
                                var player = emptySlots[q];
                                if (player && cc.isValid(player)) {
                                    var playerRankingCmp = player.getComponent("BillardUserView");
                                    if (playerRankingCmp) {
                                        playerRankingCmp.node.active = true;
                                        playerRankingCmp.setUserPos(1);
                                        playerRankingCmp.setUserName(userName);
                                        playerRankingCmp.setUserMoney(userMoney);
                                        playerRankingCmp.setUserLevel(userLevel);
                                        playerRankingCmp.setAvatarAsSpriteFrame(userFrame);
                                        playerRankingCmp.setFlagAsSpriteFrame(userCountryId);
                                        playerRankingCmp.setUserID(userID);
                                        playerRankingCmp.setProgressMatch("");//0%
                                        playerRankingCmp.showPlayer(150);
                                        playerRankingCmp.setOpacityPlayer(150);
                                        playerRankingCmp.setMaster(false);
                                        playerRankingCmp.setWaitingStatus(true);
                                        playerRankingCmp.stopCounter(true);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    gameBegin: function (data) {
        var _billardGameTable = data.BillardsGameTable;
        if (_billardGameTable && cc.isValid(_billardGameTable) && data.message) {
            var message = data.message;
            this._billardGameTable = _billardGameTable;
            var _billardGameTableController = this._billardGameTable.getBillardController();
            if (_billardGameTableController) {
                var turnHint = BiDaConstant.PSEUDO_CONST.LUOT_DANH_CUA_MINH;
                _billardGameTable.panelUserScript.hideBtnInvite();
                //mode 1vs4 moi nguoi mot ban, choi khong anh huong lan nhau, khong can block chuot
                this.hideAllMyBallistDisplay({ BillardsGameTable: _billardGameTable });
                for (let i = 0; i < _billardGameTable.rankingUserInfo.length; i++) {
                    var userInfoComponentRanking = _billardGameTable.rankingUserInfo[i].getComponent("BillardUserView");
                    if (userInfoComponentRanking) {
                        userInfoComponentRanking.setProgressMatch("");//0%
                        var id = Number(userInfoComponentRanking.getUserID());
                        if (id != 0) {
                            if (_billardGameTableController.checkIdPlaying(id)) {
                                userInfoComponentRanking.showPlayer();
                                userInfoComponentRanking.setWaitingStatus(false);
                            } else {
                                userInfoComponentRanking.showPlayer(150);
                                userInfoComponentRanking.setWaitingStatus(true);
                            }
                        }
                    }
                }
                //reset my info
                var userInfoComponent = _billardGameTable.myUserInfo.getComponent("BillardUserView");
                if (userInfoComponent) {
                    userInfoComponent.setProgressMatch("");//0%
                }
                //
                var _mData = data;
                this.setIngameStatus(message, function (err, data) {
                    if (Number(message.turnId) == Number(Linker.userData.userId)) {
                        _billardGameTable.unBlockTouchEvent();
                    } else {
                        _billardGameTable.blockTouchEvent();
                        turnHint = BiDaConstant.PSEUDO_CONST.LUOT_DANH_CUA_DOI_THU;
                    }
                    _mData.turnHint = turnHint;
                    _billardGameTable.stopAllTipAnimation();
                    this.setCardInGame(_mData);
                }.bind(this));
            }

        }
    },
    setMyUserData: function (myInfoData) {
        if (this._billardGameTable && cc.isValid(this._billardGameTable)) {
            var listUsers = [this._billardGameTable.myUserInfo];
            var listRemain = [];
            var _panelPlayerViewComponent = this._billardGameTable.getPanelPlayerView();
            var pos = 1;
            for (var k = 0; k < myInfoData.length; k++) {
                var userName = myInfoData[k].userName;
                var userLevel = myInfoData[k].userLevel;
                var userFrame = myInfoData[k].userAvatarFrame;
                var userID = myInfoData[k].userID;
                var userCountryId = myInfoData[k].userCountryId;
                var userIsMaster = myInfoData[k].isMaster;
                var userMoney = myInfoData[k].userMoney;
                if (k >= 0 && k < listUsers.length) {
                    var userInfoComponent = listUsers[k].getComponent("BillardUserView");
                    if (userInfoComponent) {
                        _panelPlayerViewComponent.removePlayerById(userID);
                        userInfoComponent.setUserPos(pos);
                        userInfoComponent.setUserName(userName);
                        userInfoComponent.setUserMoney(userMoney);
                        userInfoComponent.setUserLevelByLevel(userLevel);
                        userInfoComponent.setAvatarAsSpriteFrame(userFrame);
                        userInfoComponent.setFlagAsSpriteFrame(userCountryId);
                        userInfoComponent.setUserID(userID);
                        userInfoComponent.setProgressMatch("");//0%
                        userInfoComponent.showPlayer();
                        userInfoComponent.setMaster(userIsMaster);
                        userInfoComponent.setWaitingStatus(false);
                        userInfoComponent.stopCounter(true);
                    }
                } else {
                    //con thua nen phai bo playing dang xem.
                    listRemain.push(myInfoData[k]);
                }
            }
            //sap xep lai vi tri nguoi xem
            _panelPlayerViewComponent.resetContentNode();
            for (var l = 0; l < listRemain.length; l++) {
                _panelPlayerViewComponent.addExistPlayerToViewSit(listRemain[l]);
            }
            this._billardGameTable.setViewerNumber();
        }
    },
    setOthersUserData(oponentData) {
        if (this._billardGameTable && cc.isValid(this._billardGameTable)) {
            var listUsers = this._billardGameTable.rankingUserInfo;
            var listRemain = [];
            var _panelPlayerViewComponent = this._billardGameTable.getPanelPlayerView();
            this.hideUsersRanking(0, this._billardGameTable.rankingUserInfo.length, 0);
            var pos = 2;
            for (var k = 0; k < oponentData.length; k++) {
                //create right
                var userName = oponentData[k].userName;
                var userLevel = oponentData[k].userLevel;
                var userFrame = oponentData[k].userAvatarFrame;
                var userID = oponentData[k].userID;
                var userCountryId = oponentData[k].userCountryId;
                var userIsMaster = oponentData[k].isMaster;
                var userMoney = oponentData[k].userMoney;
                if (k >= 0 && k < listUsers.length) {
                    var userInfoComponent = listUsers[k].getComponent("BillardUserView");
                    if (userInfoComponent) {
                        _panelPlayerViewComponent.removePlayerById(userID);
                        userInfoComponent.setUserPos(pos);
                        userInfoComponent.setUserName(userName);
                        userInfoComponent.setUserMoney(userMoney);
                        userInfoComponent.setUserLevelByLevel(userLevel);
                        userInfoComponent.setAvatarAsSpriteFrame(userFrame);
                        userInfoComponent.setFlagAsSpriteFrame(userCountryId);
                        userInfoComponent.setUserID(userID);
                        userInfoComponent.setProgressMatch("");//0%
                        userInfoComponent.showPlayer();
                        userInfoComponent.setMaster(userIsMaster);
                        userInfoComponent.setWaitingStatus(false);
                        userInfoComponent.stopCounter(true);
                    }
                } else {
                    //con thua nen phai bo playing dang xem.
                    listRemain.push(oponentData[k]);
                }
            }
            for (var l = 0; l < listRemain.length; l++) {
                _panelPlayerViewComponent.addExistPlayerToViewSit(listRemain[l]);
            }
            this._billardGameTable.setViewerNumber();
        }
    },
    resortPositionPlayersRanking: function (data) {
        var _billardGameTable = data.BillardsGameTable;
        if (_billardGameTable && cc.isValid(_billardGameTable)) {
            this._billardGameTable = _billardGameTable;
            //list user on ranking tab
            var _tmpPlayerInfo = [];
            var _tmpPlayerId = [];
            if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
                for (let i = 0; i < _billardGameTable.rankingUserInfo.length; i++) {
                    var userInfoComponentRanking = _billardGameTable.rankingUserInfo[i].getComponent("BillardUserView");
                    if (userInfoComponentRanking) {
                        var id = parseInt(userInfoComponentRanking.getUserID());
                        if (isNaN(id) == false && id != 0) {
                            if (_tmpPlayerId.indexOf(id) == -1) {
                                _tmpPlayerInfo.push({
                                    userAvatarFrame: userInfoComponentRanking.getUserAvatarFrame(),
                                    userMoney: userInfoComponentRanking.getUserMoney(),
                                    userName: userInfoComponentRanking.getUserName(),
                                    userID: id,
                                    userNationFrame: userInfoComponentRanking.getNationFrame(),
                                    userCountryId: userInfoComponentRanking.getUserCountryId(),
                                    userLevel: userInfoComponentRanking.getUserLevel(),
                                    userPercentMatch: userInfoComponentRanking.getPercentMatch(),
                                    isMaster: userInfoComponentRanking.getMaster(),
                                    opacity: userInfoComponentRanking.getOpacityPlayer(),
                                    userPercentMatch: userInfoComponentRanking.getPercentMatch()
                                })
                                _tmpPlayerId.push(id);
                            }
                        }
                    }
                }
                //
                this.hideUsersRanking(0, _billardGameTable.rankingUserInfo.length, 0);
                for (let j = 0; j < _tmpPlayerInfo.length; j++) {
                    var userInfoComponentRanking = _billardGameTable.rankingUserInfo[j].getComponent("BillardUserView");
                    if (userInfoComponentRanking) {
                        var opacity = _tmpPlayerInfo[j].opacity;
                        userInfoComponentRanking.setUserName(_tmpPlayerInfo[j].userName);
                        userInfoComponentRanking.setUserMoney(_tmpPlayerInfo[j].userMoney);
                        userInfoComponentRanking.setUserLevel(_tmpPlayerInfo[j].userLevel);
                        userInfoComponentRanking.setAvatarAsSpriteFrame(_tmpPlayerInfo[j].userAvatarFrame);
                        userInfoComponentRanking.setFlagAsSpriteFrame(_tmpPlayerInfo[j].userCountryId);
                        userInfoComponentRanking.setUserID(_tmpPlayerInfo[j].userID);
                        userInfoComponentRanking.setProgressMatch(_tmpPlayerInfo[j].userPercentMatch); //0%
                        userInfoComponentRanking.showPlayer(opacity);
                        userInfoComponentRanking.setUserPos(1);
                        userInfoComponentRanking.setMaster(_tmpPlayerInfo[j].isMaster);
                        if (opacity < 255) {
                            userInfoComponentRanking.setProgressMatch("");
                        }
                    }
                }
            }
        }
    },
    getStartAnimationCard: function (data) {
        if (this._billardGameTable) {
            var listUsers = (data && data.isChiaLaiBai) ? [this._billardGameTable.myUserInfo] : Utils.Malicious.flattern([[this._billardGameTable.myUserInfo], this._billardGameTable.rankingUserInfo]);
            var otherCards = [];
            var myCards = [];
            var _billardsGameTableController = this._billardGameTable.getBillardController();
            if (_billardsGameTableController) {
                for (let i = 0; i < listUsers.length; i++) {
                    var userInfoView = listUsers[i].getComponent("BillardUserView");
                    if (userInfoView) {
                        var _data = { isMyCard: false, _isViewIng: false, cards: (data && data.isChiaLaiBai) ? data.listCard : [1] };//card úp bất cứ lá nào cũng được
                        var _userId = Number(userInfoView.getUserID());
                        if (_userId != 0 && _billardsGameTableController.checkIdPlaying(_userId)) {
                            if (_userId == Linker.userData.userId && listUsers[i] == this._billardGameTable.myUserInfo) {
                                if (data && data.isChiaLaiBai) {
                                    _data.isMyCard = true;
                                    _data._isViewIng = true;
                                }
                                userInfoView.changeCardSprite(_data);
                                myCards = userInfoView.getCardAllCards();
                            } else {
                                userInfoView.changeCardSprite(_data);
                                otherCards.push(userInfoView.getCardAllCards());
                            }
                        }
                    }
                }
                var animationFx = {
                    cards: {
                        myCards: myCards,
                        otherCards: otherCards
                    }
                }
                return animationFx;
            }

        }
        return null;
    },
    setCardInGame: function (data) {
        var message = data.message;
        var _this = this;
        if (this._billardGameTable && message) {
            var _billardsGameTableController = this._billardGameTable.getBillardController();
            if (_billardsGameTableController) {
                var listUsers = Utils.Malicious.flattern([[this._billardGameTable.myUserInfo], this._billardGameTable.rankingUserInfo]);
                for (let i = 0; i < listUsers.length; i++) {
                    var userInfoView = listUsers[i].getComponent("BillardUserView");
                    if (userInfoView) {
                        var _data = { isMyCard: false, _isViewIng: true, cards: message.myCardTarget };
                        var id = Number(userInfoView.getUserID());
                        if (id && id == Linker.userData.userId && listUsers[i] == this._billardGameTable.myUserInfo) {
                            _data.isMyCard = true;
                        }
                        if (_billardsGameTableController.checkIdPlaying(id)) {
                            userInfoView.setWaitingStatus(false);
                            userInfoView.changeCardSprite(_data);
                        } else {
                            userInfoView.setWaitingStatus(true);
                        }
                    }
                }
            }
            _this._billardGameTable.stopAllTipAnimation();
            _this._billardGameTable.startTimerCounter(Number(message.turnId));
            _this._billardGameTable.resetUICue();
            _this._billardGameTable.showCueUI();
            //mode 1 la thi phai la 6 la -1
            var myCardHint = [];
            var _hintFail = 7 - message.myCardTarget.length;
            for (let i = 0; i < _hintFail; i++) {
                myCardHint.push(-1);
            }
            var _tmpHint = Utils.Malicious.flattern([myCardHint, message.myCardTarget]);
            if (_tmpHint) {
                _this._billardGameTable.myListBallOnHand = message.myCardTarget;
                _this._billardGameTable.myUserInfo.getComponent("BillardUserView").player_list_ball_tren_tay = message.myCardTarget;
                _this._billardGameTable.checkRunTipAnimation(true);
                _this._billardGameTable.showBallListDisplay(_tmpHint, BiDaConstant.PSEUDO_CONST.KIEU_BI_CUA_MINH, false, false);
                if (Number(message.turnId) == Number(Linker.userData.userId)) {
                    _billardsGameTableController.guiDataCheckServer();
                }
                _this._billardGameTable.runTurnAnimation(data.turnHint, function (err, response) {
                    var myId = Number(Linker.userData.userId);
                    if (_billardsGameTableController.checkIdPlaying(myId)) {
                        var cardData = _this._billardGameTable.getBiMucTieuById(myId);
                        if (cardData) {
                            var cardNumber = parseInt(cardData.cardNumber);
                            if (isNaN(cardNumber) == false) {
                                if (cardNumber > 0 && cardNumber < 14) {
                                    var cardContainer = cardData.cardContainer;
                                    var userInfoView = cardData.userInfoView;
                                    if (userInfoView && cardContainer) {
                                        cardContainer.active = true;
                                        cardContainer.opacity = 255;
                                        var cards = Utils.Malicious.getCards();
                                        for (let i = 0; i < cardContainer.children.length; i++) {
                                            var card = cardContainer.children[i];
                                            var cardSprite = card.getComponent(cc.Sprite);
                                            if (cardSprite) {
                                                var cardFrameSprite = cardSprite.spriteFrame;
                                                if (!cardFrameSprite.name || cardFrameSprite.name == '' || cardFrameSprite.name == 'card_face_down') {
                                                    var nFrameName = cards[cardNumber][0].cardType;
                                                    if (nFrameName && nFrameName != '') {
                                                        cards[cardNumber].splice(0, 1);
                                                        userInfoView.setTypeCard(nFrameName);
                                                        card.opacity = 255;
                                                        card.active = true;
                                                    } else {
                                                        cc.error("Không tìm thấy name frame...", nFrameName);
                                                    }
                                                } else {
                                                    cc.log("Không cần set lại card target, ...", cardFrameSprite.name);
                                                }
                                            }
                                        }
                                    }
                                } else {
                                    cc.error("Card number target không thể là 0 hoặc lớn hơn 16...", cardNumber);
                                }
                            } else {
                                cc.error("Lỗi card number không thể khác kiểu số...", cardNumber);
                            }
                        }
                    }
                });
            }
        }
    },
    setIngameStatus: function (message, cb) {
        if (message && message.listPlayer && Array.isArray(message.listPlayer) && message.listPlayer.length > 0) {
            var userObj = {};
            var cards = Utils.Malicious.getCards();
            for (var j = 0; j < message.listPlayer.length; j++) {
                var player = message.listPlayer[j];
                if (player && player.playerId && player.cardTarget && Utils.Malicious.isJsonString(player.cardTarget)) {
                    var _ctg = JSON.parse(player.cardTarget);
                    if (_ctg && Array.isArray(_ctg) && _ctg.length > 0) {
                        var typeCard = cards[_ctg[0]][0];
                        cards[_ctg[0]].splice(0, 1);
                        userObj[player.playerId.toString()] = {
                            cardTarget: _ctg[0],
                            isBot: player.isBot,
                            typeCard: typeCard.cardType
                        }
                    }
                }
            };
            if (this._billardGameTable) {
                var listUsers = Utils.Malicious.flattern([[this._billardGameTable.myUserInfo], this._billardGameTable.rankingUserInfo]);
                var _billardsGameTableController = this._billardGameTable.getBillardController();
                if (_billardsGameTableController) {

                    var _isPlaying = _billardsGameTableController.checkIdPlaying();
                    if (_isPlaying) {
                        //dang choi moi chia bai
                        var animationFx = this.getStartAnimationCard();
                        if (animationFx) {
                            var _this = this;
                            var _listUsers = listUsers;
                            var _userObj = userObj;
                            this._billardGameTable.runAnimationChiaBai(animationFx, function (err, chiaBaiNode) {
                                if (!err) {
                                    chiaBaiNode.opacity = 0;
                                    chiaBaiNode.position = cc.v2(0, 0);
                                    _this.setDataBatDauChoi({ listUsers: _listUsers, userObj: _userObj }, function (err, data) {
                                        if (!err) {
                                            if (cb) {
                                                cb(false, true);
                                            }
                                        } else {
                                            if (cb) {
                                                cb(true, false);
                                            }
                                        }
                                    });
                                }
                            })
                        }
                    } else {
                        this.setDataBatDauChoi({ listUsers: listUsers, userObj: userObj }, function (err, data) {
                            if (!err) {
                                if (cb) {
                                    cb(false, true);
                                }
                            } else {
                                if (cb) {
                                    cb(true, false);
                                }
                            }
                        });
                    }
                }

            }
        }
    },
    setDataBatDauChoi: function (data, cb) {
        if (this._billardGameTable) {
            var _billardsGameTableController = this._billardGameTable.getBillardController();
            if (_billardsGameTableController) {
                if (data) {
                    var listUsers = data.listUsers;
                    var userObj = data.userObj;
                    if (listUsers && userObj) {
                        for (let i = 0; i < listUsers.length; i++) {
                            var userInfoView = listUsers[i].getComponent("BillardUserView");
                            if (userInfoView) {
                                var id = parseInt(userInfoView.getUserID());
                                if (id != 0) {
                                    if (userObj.hasOwnProperty(id.toString())) {
                                        userInfoView.setCardTarget(userObj[id.toString()].cardTarget);
                                        userInfoView.setBotType(userObj[id.toString()].isBot);
                                        userInfoView.setTypeCard(userObj[id.toString()].typeCard);
                                    }
                                    if (_billardsGameTableController.checkIdPlaying(id)) {
                                        userInfoView._isPlaying = true;
                                        userInfoView.setWaitingStatus(false);
                                    } else {
                                        userInfoView._isPlaying = false;
                                        userInfoView.setWaitingStatus(true);
                                    }

                                } else {
                                    userInfoView._isPlaying = false;
                                }
                            }
                        }
                        if (cb) {
                            cb(false, true);
                        }
                    }
                }
            }
        } else {
            if (cb) {
                cb(true, false);
            }
        }
    }
}
