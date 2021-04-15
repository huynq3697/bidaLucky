var Linker = require('Linker');
var BiDaConstant = require('BiDaConstant');
var i18n = require('i18n');
var Utils = require('Utils');
var PanelPlayerView14 = require('PanelPlayerView14');
module.exports = {
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
            var players = data.players;
            // an tat ca error number
            _billardGameTable.myUserInfo.getComponent("BillardUserView").setErrorNumberLabel("");
            var otherPlayers = _billardGameTable.rankingUserInfo;
            for (var i = 0; i < otherPlayers.length; i++) {
                otherPlayers[i].getComponent("BillardUserView").setErrorNumberLabel("");
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
                if (_billardGameTable.myUserId == Number(players[i].id)) {
                    this.setErrorLabel(seo);
                }
            }
            //set lai text error khi end game
            if (players.length == 0) {
                this.setErrorLabel("");
            }
        }
    },
    setErrorLabel: function (totalSeo) {
        var BillardsGameTableController = this._billardGameTable.getBillardController();
        var errorLabel = this._billardGameTable.bidaDeskContainer.getChildByName("errorLabel");
        var ballsInTable = this._billardGameTable.getBallsInTable().arrBall;
        if (totalSeo && totalSeo == BillardsGameTableController.maxError) {
            BillardsGameTableController.isStopPlaying = true;
            errorLabel.active = true;
            errorLabel.getComponent(cc.Label).string = i18n.t("title_error_label");
        } else if (totalSeo && ballsInTable.length > 0 && ballsInTable.indexOf(8) == -1 && BillardsGameTableController.gameState == BiDaConstant.GAME_STATE.PLAYING) {
            BillardsGameTableController.isStopPlaying = true;
            errorLabel.active = true;
            errorLabel.getComponent(cc.Label).string = i18n.t("title_error_8_label");
        } else {
            BillardsGameTableController.isStopPlaying = false;
            errorLabel.active = false;
        }
    },
    createHeaderUserInfo: function (data) {
        var _billardGameTable = data.BillardsGameTable;
        if (_billardGameTable && cc.isValid(_billardGameTable)) {
            this._billardGameTable = _billardGameTable;
            _billardGameTable.panelUsers = cc.instantiate(_billardGameTable.panelUser1vs4Prefab);
            _billardGameTable.panelUserContainer.addChild(_billardGameTable.panelUsers);
        }
    },
    configPanelUsers: function (data) {
        var _billardGameTable = data.BillardsGameTable;
        if (_billardGameTable && cc.isValid(_billardGameTable)) {
            this._billardGameTable = _billardGameTable;
            _billardGameTable.panelUserScript = _billardGameTable.panelUsers.getComponent("PanelUsers1Vs4");
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
    setNextTurn: function (data) {
        var _billardGameTable = data.BillardsGameTable;
        if (_billardGameTable && cc.isValid(_billardGameTable)) {
            this._billardGameTable = _billardGameTable;
            _billardGameTable.resetUICue();
            _billardGameTable.unBlockTouchEvent();
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
            var player = _billardGameTable.getPlayerByUserId(Number(message.player.userId));
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
                    playerRankingCmp.setUserLevel(message.player.exp);
                    playerRankingCmp.setAvatarAsSpriteFrame(frame);
                    playerRankingCmp.setFlagAsSpriteFrame(message.player.countryId);
                    playerRankingCmp.setUserID(message.player.userId);
                    playerRankingCmp.showPlayer();
                    playerRankingCmp.setProgressMatch("");//0%
                    playerRankingCmp.setUserPos(1);
                    playerRankingCmp.setMaster(message.player.isMaster)
                }
            } else {
                cc.log("Lỗi không tìm thấy người chơi, missing rời bàn...", data);
            }
        }
    },
    initListPlayerView: function (message) {
        if (this._billardGameTable && cc.isValid(this._billardGameTable)) {
            if (message && message.hasOwnProperty("listPlayerView")) {
                if (message.listPlayerView && Array.isArray(message.listPlayerView) && message.listPlayerView.length > 0) {
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
                }
                //bên phải(dành cho 14, phỏm)
                var emptySlots = this._billardGameTable.getNumberSlotEmptyOnRanking();
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
    },
    initTableInfo: function (data) {
        var _billardGameTable = data.BillardsGameTable;
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
                    var frame = _billardGameTable.getFrameById(this.avatarAtlas, player.avatarId);
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
                        myInfo = {
                            viewName: Linker.userData.displayName,
                            userMoney: Utils.Malicious.moneyWithFormat(Number(Linker.userData.userMoney), "."),
                            exp: Number(Linker.userData.userExp),
                            avatarId: Number(Linker.userData.avatar),
                            userId: Number(Linker.userData.userId),
                            countryId: Linker.userData.countryId,
                            isMaster: false,
                            percentMatch: ""
                        }
                    }
                    message.myInfo = myInfo;
                    this.pushLeftInfo1vs4({ myInfo: myInfo, data: message });
                    //push user not me in ranking list
                    if (Number(message.isPlaying) == BiDaConstant.GAME_STATE.WAIT) {
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
                            }
                        }
                        if (message.listPlayer.length >= 1) {
                            _billardGameTable.hideTimeCountDownBallError();
                            _billardGameTable.runBeginMatchAnimation({ time: BiDaConstant.GAME.CONFIG.THOI_GIAN_CHO_BAT_DAU_TRAN_1_VS_4 }, function (err, data) {
                                if (!err) {
                                    cc.log("Handle match start successfully ...");
                                }
                            });
                        }
                    }

                }

            } else if (Linker.CURRENT_TABLE.isReconnect) {
                cc.log(message);
                this.hideUsersRanking(0, _billardGameTable.rankingUserInfo.length, 0);
                _billardGameTable.myUserId = Number(Linker.userData.userId);
                _billardGameTable.setMucCuoc(Utils.Malicious.moneyWithFormat(message.minMoney, "."));
                var tableName = `${i18n.t("button_title_table")}: ` + message.tableIndex;
                _billardGameTable.setTableId(tableName);
                _billardGameTable.setMoneyIconFrame();
                _billardGameTable.panelUserScript.hideBtnInvite();
                message.myInfo = null;
                // var _tmpLuotDanh = 0;
                if (message.listPlayer) {
                    //push me in use list
                    var myInfo = null;
                    for (let j = 0; j < message.listPlayer.length; j++) {
                        if (Linker.userData.userId == message.listPlayer[j].userId) {
                            if (message.listPlayer[j].isMaster == 1 || message.listPlayer[j].isMaster == true) {
                                _billardGameTable.panelUserScript.showBtnInvite();
                            }
                            //create left lay thong tin nay thiet lap avatar cua minh luon
                            myInfo = message.listPlayer[j];
                            message.listPlayer.splice(j, 1);
                        }
                    }
                    message.myInfo = myInfo;
                    this.pushLeftInfo1vs4({ myInfo: myInfo, data: message });
                    for (let i = 0; i < message.listPlayer.length; i++) {
                        //create right
                        var player = message.listPlayer[i];
                        var userName = player.viewName;
                        var userMoney = Utils.Malicious.moneyWithFormat(player.userMoney, ".");
                        var userLevel = player.exp;
                        var userFrame = _billardGameTable.getFrameById(_billardGameTable.avatarAtlas, player.avatarId);
                        var userID = player.userId;
                        if (i >= 0 && i < _billardGameTable.rankingUserInfo.length) {
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
                            }
                        }

                    }
                    // //them bi vao khay neu co cac bi da an
                    _billardGameTable._isShowPopupYourBallList = true;
                    if (message.ballEat) {
                        _billardGameTable.clearAllBallOnTable(message.ballEat);
                        _billardGameTable.clearAllBallInHole();//BallInHole
                    }

                    _billardGameTable.addTouchEventListener();
                    _billardGameTable.addCustomEventDispatch();
                    _billardGameTable.setCueRotateCueListener();
                    if (message.dataBall) {
                        cc.log("Co data ball reconnect dang check dieu dieu data ball...", message);
                        if (Utils.Malicious.isJsonString(message.dataBall)) {
                            var clientBallObj = _billardGameTable.getBallsInTable();
                            var serverBall = JSON.parse(message.dataBall);
                            _billardGameTable.reRenderBallPosition(serverBall, clientBallObj);
                        } else {
                            cc.log("Co data ball reconnect nhung khong hop le...", message);
                        }
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
                            _billardGameTable.taoCueTrenBanChoi();
                            _billardGameTable.cue.active = true;
                            _billardGameTable.showCueUI();
                            _billardGameTable.cue.getChildByName("drawLine").opacity = 0;
                        }
                        _billardGameTable._isGameStarted = true;
                        _billardGameTable.myUserId = Number(Linker.userData.userId);
                        _billardGameTable._isShoted = false;
                        _billardGameTable._isDataEndTurnGame = false;
                        _billardGameTable.initListBiAn(message);
                    } else {
                        cc.log("Lỗi không thể tạo data reconnect, do không có list bóng và vị trí...", message);
                    }
                }
            }
        }
    },
    pushLeftInfo1vs4: function (leftInfoData) {
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
                            userInfoComponent.setUserLevel(userLevel);
                            userInfoComponent.setAvatarAsSpriteFrame(userFrame);
                            userInfoComponent.setFlagAsSpriteFrame(leftInfo.countryId);
                            userInfoComponent.setUserID(userID);
                            userInfoComponent.setProgressMatch(percentMatch);//0%
                            userInfoComponent.showPlayer();
                            userInfoComponent.setUserPos(1);
                            userInfoComponent.setMoneyIcon(this._billardGameTable.listMoneyIcon);
                            userInfoComponent.setMaster(isMaster);
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
                        userInfoComponent.setUserLevel(userLevel);
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
                        userInfoComponent.setUserLevel(userLevel);
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
                            userInfoComponent.setUserLevel(userLevel);
                            userInfoComponent.setAvatarAsSpriteFrame(userFrame);
                            userInfoComponent.setFlagAsSpriteFrame(userCountryId);
                            userInfoComponent.setUserID(userID);
                            userInfoComponent.setProgressMatch("");//0%
                            userInfoComponent.showPlayer();
                            userInfoComponent.setMaster(userIsMaster);
                            userInfoComponent.setWaitingStatus(false);
                        }
                    }
                    //sap xep lai vi tri nguoi xem
                    _panelPlayerViewComponent.resetContentNode();
                    for (var k = 0; k < playerInView.length; k++) {
                        _panelPlayerViewComponent.addExistPlayerToViewSit(playerInView[k]);
                    }
                    _billardGameTable.setViewerNumber();
                    //de xem con co ai dang xem nhung slot lai thieu nua khong de cho vao dang cho
                    var emptySlots = _billardGameTable.getNumberSlotEmptyOnRanking();
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
                } else {
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
                    this.pushLeftInfo1vs4({ myInfo: myInfo, data: message });
                    PanelPlayerView14.config(message);
                }
            }
        }
    },
    gameBegin: function (data) {
        var _billardGameTable = data.BillardsGameTable;
        if (_billardGameTable && cc.isValid(_billardGameTable) && data.message) {
            var message = data.message;
            this._billardGameTable = _billardGameTable;
            _billardGameTable.panelUserScript.hideBtnInvite();
            //mode 1vs4 moi nguoi mot ban, choi khong anh huong lan nhau, khong can block chuot
            this.hideAllMyBallistDisplay({ BillardsGameTable: _billardGameTable });
            for (let i = 0; i < _billardGameTable.rankingUserInfo.length; i++) {
                var userInfoComponentRanking = _billardGameTable.rankingUserInfo[i].getComponent("BillardUserView");
                if (userInfoComponentRanking) {
                    userInfoComponentRanking.setProgressMatch("");//0%
                    if (userInfoComponentRanking.getUserID() != 0) {
                        if (userInfoComponentRanking.getWaitingStatus()) {
                            userInfoComponentRanking.showPlayer(150);
                        } else {
                            userInfoComponentRanking.showPlayer();
                        }
                    }
                }
            }
            //reset my info
            var userInfoComponent = _billardGameTable.myUserInfo.getComponent("BillardUserView");
            if (userInfoComponent) {
                userInfoComponent.setProgressMatch("");//0%
            }
            _billardGameTable.unBlockTouchEvent();
        }
    }
}
