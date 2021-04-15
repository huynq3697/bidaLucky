var Linker = require('Linker');
var BiDaConstant = require('BiDaConstant');
var i18n = require('i18n');
var Utils = require('Utils');
var PanelPlayerView11 = require('PanelPlayerView11');
module.exports = {
    configDefault: function (data) {
        this.hideAllMyBallistDisplay(data);
        this.hideAllOtherBallistDisplay(data);
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
    hideAllOtherBallistDisplay: function (data) {
        var _billardGameTable = data.BillardsGameTable;
        if (_billardGameTable && cc.isValid(_billardGameTable)) {
            this._billardGameTable = _billardGameTable;
            for (let i = 0; i < _billardGameTable.otherBallistDisplay.children.length; i++) {
                _billardGameTable.otherBallistDisplay.children[i].opacity = 0;
            }
        }
    },
    setMoneyLabel: function (data) {
        var _billardGameTable = data.BillardsGameTable;
        if (_billardGameTable && cc.isValid(_billardGameTable) && data.players) {
            this._billardGameTable = _billardGameTable;
            var players = data.players;
            var userInfoComponent = _billardGameTable.myUserInfo.getComponent("BillardUserView");
            var userInfoComponentOther = _billardGameTable.otherUserInfo.getComponent("BillardUserView");
            if (userInfoComponent && userInfoComponentOther && players) {
                for (let i = 0; i < players.length; i++) {
                    var money = Utils.Malicious.moneyWithFormat(Number(players[i].userMoney), ".");
                    if (_billardGameTable.myUserId == players[i].userId) {
                        userInfoComponent.setUserMoney(money);
                    } else {
                        userInfoComponentOther.setUserMoney(money);
                    }
                }
            }
        }
    },
    setErrorNumber: function (data) {
        var _billardGameTable = data.BillardsGameTable;
        if (_billardGameTable && cc.isValid(_billardGameTable) && data.players) {
            this._billardGameTable = _billardGameTable;
            var _billardsGameTableController = this._billardGameTable.getBillardController();
            var players = data.players;
            var myUserInfo = _billardGameTable.myUserInfo.getComponent("BillardUserView");
            var otherUserInfo = _billardGameTable.otherUserInfo.getComponent("BillardUserView");
            myUserInfo.setErrorNumberLabel("");
            otherUserInfo.setErrorNumberLabel("");
            myUserInfo.stop.active = false;
            otherUserInfo.stop.active = false;
            for (var i = 0; i < players.length; i++) {
                var seo = "";
                if (players[i].totalSeo > 0) {
                    seo = players[i].totalSeo;
                }
                if (_billardGameTable.myUserId == Number(players[i].id)) {
                    myUserInfo.setErrorNumberLabel(seo);
                    if (seo == _billardsGameTableController.maxError) {
                        myUserInfo.stop.active = true;
                        myUserInfo.setStopLabel(i18n.t("title_error_label"));
                    }
                } else if (_billardGameTable.myUserId !== Number(players[i].id)) {
                    if (_billardsGameTableController._isViewMatch) {
                        if (i == 0) {
                            myUserInfo.setErrorNumberLabel(seo);
                            if (seo == _billardsGameTableController.maxError) {
                                myUserInfo.stop.active = true;
                                myUserInfo.setStopLabel(i18n.t("title_error_label"));
                            }
                        } else {
                            otherUserInfo.setErrorNumberLabel(seo);
                            if (seo == _billardsGameTableController.maxError) {
                                otherUserInfo.stop.active = true;
                                otherUserInfo.setStopLabel(i18n.t("title_error_label"));
                            }
                        }
                    } else {
                        otherUserInfo.setErrorNumberLabel(seo);
                        if (seo == _billardsGameTableController.maxError) {
                            otherUserInfo.stop.active = true;
                            otherUserInfo.setStopLabel(i18n.t("title_error_label"));
                        }
                    }
                }
            }
        }
    },

    createHeaderUserInfo: function (data) {
        var _billardGameTable = data.BillardsGameTable;
        if (_billardGameTable && cc.isValid(_billardGameTable)) {
            this._billardGameTable = _billardGameTable;
            if (!_billardGameTable.panelUserContainer.children.includes(_billardGameTable.panelUsers)) {
                _billardGameTable.panelUsers = cc.instantiate(_billardGameTable.panelUser1vs1Prefab);
                _billardGameTable.panelUserContainer.addChild(_billardGameTable.panelUsers);
            } else {
                _billardGameTable.panelUserContainer.removeAllChildren(true);
                _billardGameTable.panelUsers = cc.instantiate(_billardGameTable.panelUser1vs1Prefab);
                _billardGameTable.panelUserContainer.addChild(_billardGameTable.panelUsers);
            }
        }
    },
    configPanelUsers: function (data) {
        var _billardGameTable = data.BillardsGameTable;
        if (_billardGameTable && cc.isValid(_billardGameTable)) {
            this._billardGameTable = _billardGameTable;
            _billardGameTable.panelUserScript = _billardGameTable.panelUsers.getComponent("PanelUsers1Vs1");
            //list chua bi cua toi user node
            if (!_billardGameTable.myBallistDisplay || (_billardGameTable.myBallistDisplay && !_billardGameTable.myBallistDisplay.isValid)) {
                _billardGameTable.myBallistDisplay = _billardGameTable.panelUserScript.getMyBallListDisplay();
            }
            //list chua bi cua doi thu
            if (!_billardGameTable.otherBallistDisplay || (_billardGameTable.otherBallistDisplay && !_billardGameTable.otherBallistDisplay.isValid)) {
                _billardGameTable.otherBallistDisplay = _billardGameTable.panelUserScript.getOtherListDisplay();
            }
            //my user info node
            if (!_billardGameTable.myUserInfo || (_billardGameTable.myUserInfo && !_billardGameTable.myUserInfo.isValid)) {
                _billardGameTable.myUserInfo = _billardGameTable.panelUserScript.getMyUserInfo();
            }
            //other user info node
            if (!_billardGameTable.otherUserInfo || (_billardGameTable.otherUserInfo && !_billardGameTable.otherUserInfo.isValid)) {
                _billardGameTable.otherUserInfo = _billardGameTable.panelUserScript.getOtherUserInfo();
            }
            var cf = {
                BillardsGameTable: _billardGameTable
            };
            //an hien thi cac bi dang co cua toi
            this.hideAllMyBallistDisplay(cf);
            //an hien thi cac bi dang co cua doi thu
            this.hideAllOtherBallistDisplay(cf);
        }
    },
    hideOtherPlayer: function (data) {
        if (this._billardGameTable) {
            this._billardGameTable.otherUserInfo.opacity = 0;
            var _panelUser1vs1 = this.getPanelUser1vs1Component();
            if (_panelUser1vs1) {
                if (data.isMaster == true || data.isMaster == 1) {
                    _panelUser1vs1.showBtnInvite();
                } else {
                    _panelUser1vs1.hideBtnInvite();
                }
            }
            //reset info
            var userInfoComponentOther = this._billardGameTable.otherUserInfo.getComponent("BillardUserView");
            if (userInfoComponentOther) {
                userInfoComponentOther.setUserName("Player" + 2);
                userInfoComponentOther.setUserMoney(0);
                // userInfoComponentRanking.setUserExp(player.exp);
                userInfoComponentOther.setUserLevel(0);
                userInfoComponentOther.setAvatarAsSpriteFrame(this._billardGameTable.getFrameById(this._billardGameTable.avatarAtlas, 0));
                userInfoComponentOther.setFlagAsSpriteFrame("w");
                userInfoComponentOther.setUserID(0);
                userInfoComponentOther.setUserPos(2);
            }
        }

    },
    showOtherPlayer: function () {
        if (this._billardGameTable) {
            this._billardGameTable.otherUserInfo.opacity = 255;
            var _panelUser1vs1 = this.getPanelUser1vs1Component();
            if (_panelUser1vs1) {
                _panelUser1vs1.hideBtnInvite();
            }
        }
    },
    getPanelUser1vs1Component: function () {
        if (this._billardGameTable) {
            var PanelUsers1Vs1 = this._billardGameTable.otherUserInfo.parent;
            if (PanelUsers1Vs1 && cc.isValid(PanelUsers1Vs1)) {
                var PanelUsers1Vs1Script = PanelUsers1Vs1.getComponent("PanelUsers1Vs1");
                if (PanelUsers1Vs1Script && cc.isValid(PanelUsers1Vs1Script)) {
                    return PanelUsers1Vs1Script;
                }
            }
        }
        return null;
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
                this.hideOtherPlayer({
                    isMaster: true
                });
                var player = message.player;
                var userInfoComponent = _billardGameTable.myUserInfo.getComponent("BillardUserView");
                var userInfoComponentOther = _billardGameTable.otherUserInfo.getComponent("BillardUserView");
                _billardGameTable.setMucCuoc(Utils.Malicious.moneyWithFormat(message.minMoney, "."));
                var tableName = `${i18n.t("button_title_table")}: ` + message.tableIndex;
                _billardGameTable.setTableId(tableName);
                _billardGameTable.setMoneyIconFrame();

                if (userInfoComponent && userInfoComponentOther && player) {

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
                    userInfoComponent.setProgressMatch(""); //0%
                    userInfoComponent.setUserPos(1);
                    userInfoComponent.setMaster(true);
                    userInfoComponent.showPlayer();
                    userInfoComponent.setWaitingStatus(message._isWaiting);
                    //push right push thong tin cua minh vao doi hinh ranking
                    userInfoComponentOther.setUserName("Player" + 2);
                    userInfoComponentOther.setUserMoney(0);
                    // userInfoComponentRanking.setUserExp(player.exp);
                    userInfoComponentOther.setUserLevel(0);
                    userInfoComponentOther.setAvatarAsSpriteFrame(_billardGameTable.getFrameById(_billardGameTable.avatarAtlas, 0));
                    userInfoComponentOther.setFlagAsSpriteFrame("w");
                    userInfoComponentOther.setUserID(0);
                    userInfoComponentOther.setUserPos(2);
                    userInfoComponentOther.setReady((Number(player.isReady) == 1) ? true : false);
                }
                var _panelPlayerView = _billardGameTable.panelUI.getComponent("PanelUIGame").getPanelPlayerView();
                if (_panelPlayerView && cc.isValid(_panelPlayerView)) {
                    var _panelPlayerViewComponent = _panelPlayerView.getComponent("PanelPlayerView");
                    if (_panelPlayerViewComponent && cc.isValid(_panelPlayerViewComponent)) {
                        _panelPlayerViewComponent.resetContentNode();
                    }
                }
            } else if (Linker.CURRENT_TABLE.isJoin == true) {
                //setting left and right
                this.showOtherPlayer();
                _billardGameTable.setMucCuoc(Utils.Malicious.moneyWithFormat(message.minMoney, "."));
                var tableName = `${i18n.t("button_title_table")}: ` + message.tableIndex;
                _billardGameTable.setTableId(tableName);
                _billardGameTable.setMoneyIconFrame();

                if (message.listPlayer) {
                    //
                    if (Number(message.isPlaying) == BiDaConstant.GAME_STATE.WAIT) {
                        cc.log("message.listPlayer", message.listPlayer);
                        var _myInfoData = [];//chi lay 2 nguoi choi, 1 la minh 2 la random 1 nguoi, nguoi con lai se la nam trong list dang xem
                        var _otherUserInfo = [];
                        var _myId = null;
                        var _otherId = null;
                        for (let o = 0; o < message.listPlayer.length; o++) {
                            var player = message.listPlayer[o];
                            var userID = Number(player.userId);
                            var isMaster = Number(player.isMaster) == 1 ? true : false;
                            if (Number(Linker.userData.userId) == userID && _myInfoData.length == 0) {
                                _myInfoData.push(player);
                                _myId = userID;
                            } else if (_otherUserInfo.length == 0 || isMaster) {
                                _otherUserInfo = [];
                                _otherUserInfo.push(player);
                                _otherId = userID;
                            }
                        }
                        var _couplePlayerId = Utils.Malicious.removeNotNumberElementInArray([_myId, _otherId]);
                        var listPlayerView = [];
                        var _tmpListPlayer = Utils.Malicious.flattern([_myInfoData, _otherUserInfo]);
                        for (let q = 0; q < message.listPlayer.length; q++) {
                            var player = message.listPlayer[q];
                            var userID = Number(player.userId);
                            if (_couplePlayerId.indexOf(userID) == -1) {
                                //khong duplicate
                                listPlayerView.push(player);
                            }
                        }
                        var emptySlots = _billardGameTable.getNumberSlotEmptyOnRanking();
                        if (emptySlots.length > 0) {
                            for (let p = 0; p < _tmpListPlayer.length; p++) {
                                var playerInfo = _tmpListPlayer[p];
                                var userName = playerInfo.viewName;
                                var userMoney = Utils.Malicious.moneyWithFormat(playerInfo.userMoney, ".");
                                var userLevel = playerInfo.level;
                                var userFrame = _billardGameTable.getFrameById(_billardGameTable.avatarAtlas, playerInfo.avatarId);
                                var userID = playerInfo.userId;
                                var playerNode = null;
                                cc.log("p = " + p);
                                if (p >= 0 && p < emptySlots.length) {
                                    playerNode = emptySlots[p];
                                }
                                if (playerNode && cc.isValid(playerNode)) {
                                    var playerRankingCmp = playerNode.getComponent("BillardUserView");
                                    if (playerRankingCmp) {
                                        if (Linker.userData.userId == userID) {
                                            //create left lay thong tin nay thiet lap avatar cua minh luon
                                            playerRankingCmp.setUserPos(1);
                                            playerRankingCmp.setWaitingStatus(message._isWaiting);
                                        } else {
                                            playerRankingCmp.setUserPos(2);
                                        }
                                        playerRankingCmp.setUserName(userName);
                                        playerRankingCmp.setUserMoney(userMoney);
                                        // playerRankingCmp.setUserExp(playerInfo.exp);
                                        playerRankingCmp.setUserLevelByLevel(userLevel);
                                        playerRankingCmp.setAvatarAsSpriteFrame(userFrame);
                                        playerRankingCmp.setFlagAsSpriteFrame(playerInfo.countryId);
                                        playerRankingCmp.setUserID(userID);
                                        playerRankingCmp.setProgressMatch(""); //0%
                                        playerRankingCmp.showPlayer();
                                        playerRankingCmp.setMaster(Number(playerInfo.isMaster) == 1 ? true : false);
                                        playerRankingCmp.setReady((Number(playerInfo.isReady) == 1) ? true : false);
                                    }

                                }
                            }
                        }
                        var _panelPlayerView = _billardGameTable.panelUI.getComponent("PanelUIGame").getPanelPlayerView();
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
                        if (message.listPlayer.length >= 2) {
                            _billardGameTable.hideTimeCountDownBallError();
                            _billardGameTable.runBeginMatchAnimation({
                                time: BiDaConstant.GAME.CONFIG.THOI_GIAN_CHO_BAT_DAU_TRAN_1_VS_1
                            }, function (err, data) {
                                if (!err) {
                                    cc.log("Handle match start successfully ...");
                                }
                            });
                        }
                    } else if (Number(message.isPlaying) == BiDaConstant.GAME_STATE.PLAYING) {
                        for (let i = 0; i < message.listPlayer.length; i++) {
                            //create right
                            var player = message.listPlayer[i];
                            var userName = player.viewName;
                            var userMoney = Utils.Malicious.moneyWithFormat(player.userMoney, ".");
                            var userLevel = player.exp;
                            var userFrame = _billardGameTable.getFrameById(_billardGameTable.avatarAtlas, player.avatarId);
                            var userID = player.userId;
                            var userInfoComponent = _billardGameTable.otherUserInfo.getComponent("BillardUserView");
                            if (userInfoComponent) {
                                if (i == 0) {
                                    //create left lay thong tin nay thiet lap avatar cua minh luon
                                    userInfoComponent = _billardGameTable.myUserInfo.getComponent("BillardUserView");
                                    userInfoComponent.setUserPos(1);
                                    userInfoComponent.setWaitingStatus(message._isWaiting);
                                } else {
                                    userInfoComponent.setUserPos(2);
                                }
                                userInfoComponent.setUserName(userName);
                                userInfoComponent.setUserMoney(userMoney);
                                // userInfoComponent.setUserExp(player.exp);
                                userInfoComponent.setUserLevelByLevel(player.level);
                                userInfoComponent.setAvatarAsSpriteFrame(userFrame);
                                userInfoComponent.setFlagAsSpriteFrame(player.countryId);
                                userInfoComponent.setUserID(userID);
                                userInfoComponent.setProgressMatch(""); //0%
                                userInfoComponent.showPlayer();
                                userInfoComponent.setMaster(player.isMaster);
                                userInfoComponent.setReady((Number(player.isReady) == 1) ? true : false);
                            }
                        }
                    }
                }


            } else if (Linker.CURRENT_TABLE.isReconnect) {
                _billardGameTable.getBillardController()._isViewMatch = false;
                _billardGameTable.myUserId = Number(Linker.userData.userId);
                //setting left and right
                this.showOtherPlayer();
                _billardGameTable.setMucCuoc(Utils.Malicious.moneyWithFormat(message.minMoney, "."));
                var tableName = `${i18n.t("button_title_table")}: ` + message.tableIndex;
                _billardGameTable.setTableId(tableName);
                _billardGameTable.setMoneyIconFrame();
                var _tmpLuotDanh = 0;
                for (let i = 0; i < message.listPlayer.length; i++) {
                    //create right
                    var player = message.listPlayer[i];
                    var userName = player.viewName;
                    var userMoney = Utils.Malicious.moneyWithFormat(player.userMoney, ".");
                    var userLevel = player.exp;
                    var userFrame = _billardGameTable.getFrameById(_billardGameTable.avatarAtlas, player.avatarId);
                    var userID = player.userId;
                    var userInfoComponent = _billardGameTable.otherUserInfo.getComponent("BillardUserView");
                    if (Linker.userData.userId == userID) {
                        //create left lay thong tin nay thiet lap avatar cua minh luon
                        userInfoComponent = _billardGameTable.myUserInfo.getComponent("BillardUserView");
                        userInfoComponent.setUserPos(1);
                        userInfoComponent.player_list_ball_tren_tay = (player.player_list_ball_tren_tay) ? (player.player_list_ball_tren_tay) : [];
                        _billardGameTable.myListBallOnHand = userInfoComponent.player_list_ball_tren_tay;
                    } else {
                        _tmpLuotDanh = userID;
                        userInfoComponent.setUserPos(2);
                    }
                    if (userInfoComponent) {
                        userInfoComponent.setUserName(userName);
                        userInfoComponent.setUserMoney(userMoney);
                        // userInfoComponent.setUserExp(player.exp);
                        userInfoComponent.setUserLevel(userLevel);
                        userInfoComponent.setAvatarAsSpriteFrame(userFrame);
                        userInfoComponent.setFlagAsSpriteFrame(player.countryId);
                        userInfoComponent.setUserID(userID);
                        userInfoComponent.setProgressMatch(""); //0%
                        userInfoComponent.showPlayer();
                        userInfoComponent.setMaster(player.isMaster);
                    }
                }
                //them bi vao khay neu co cac bi da an
                _billardGameTable._isShowPopupYourBallList = true;
                if (message.ballEat) {
                    _billardGameTable.clearAllBallOnTable(message.ballEat);
                    _billardGameTable.clearAllBallInHole();//BallInHole
                }
                //init
                _billardGameTable.addTouchEventListener();
                _billardGameTable.addCustomEventDispatch();
                _billardGameTable.setCueRotateCueListener();
                _billardGameTableController.idplayerLuotDanh = Number(message.currentPlayerId);
                if (Number(Linker.userData.userId) !== Number(message.currentPlayerId)) {
                    _billardGameTable.bidaDeskContainer.getChildByName("waitLabel").active = true;
                    _billardGameTableController.isReconnectWait = true;
                }
                if (message.dataBall) {
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
                } else {
                    var _tmpDataPos = JSON.parse(message.dataPos);
                    for (let i = 0; i < _tmpDataPos.length; i++) {
                        if (_tmpDataPos[i] == 0) {
                            _tmpDataPos.splice(i, 1);
                        }
                    }
                    _billardGameTable.taoBideBatdauTranDau(JSON.stringify(_tmpDataPos));
                }
                _billardGameTable.taoCueTrenBanChoi();
                _billardGameTable.panelPower.active = true;
                _billardGameTable.cue.active = true;
                _billardGameTable.showCueUI();
                _billardGameTable.cue.getChildByName("drawLine").opacity = 0;
                _billardGameTable.cue.position = cc.v2(99999, 99999);
                _billardGameTable.resetUICue();
                _billardGameTable._isGameStarted = true;
                _billardGameTable.myUserId = Number(Linker.userData.userId);
                _billardGameTable._isShoted = false;
                // _billardGameTable._isDataEndTurnGame = true;
                //cue phai dat o cho khac
                var timeLeftTurn = Number(message.timeLeft) / 1000;
                _billardGameTable.startTimerCounter(Number(message.currentPlayerId), timeLeftTurn);
                if (Number(Linker.userData.userId) == Number(message.currentPlayerId)) {
                    _billardGameTable._isDataEndTurnGame = false;
                    _billardGameTable.unBlockTouchEvent();
                    if (_billardGameTable.myUserInfo.getComponent("BillardUserView").player_list_ball_tren_tay.length == 0) {
                        _billardGameTable.myUserInfo.getComponent("BillardUserView").player_list_ball_tren_tay = Utils.Malicious.createDefaultMyBallArr();
                    }
                } else {
                    // _billardGameTable._isDataEndTurnGame = true;
                    _billardGameTable.blockTouchEvent();
                }
                _billardGameTable.showDrawrouteWhiteBallAdded(true);
                _billardGameTable.initListBiAn(message);
            }
        }

    },
    resortPositionPlayersRanking: function (data) {
        var _billardGameTable = data.BillardsGameTable;
        if (_billardGameTable && cc.isValid(_billardGameTable)) {
            //list user on ranking tab
            var _tmpPlayerInfo = [];
            var _tmpPlayerId = [];
            if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
                var listPlayer = [_billardGameTable.myUserInfo, _billardGameTable.otherUserInfo];
                for (let i = 0; i < listPlayer.length; i++) {
                    var userInfoComponentRanking = listPlayer[i].getComponent("BillardUserView");
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
                for (let j = 0; j < _tmpPlayerInfo.length; j++) {
                    var userInfoComponentRanking = listPlayer[j].getComponent("BillardUserView");
                    if (userInfoComponentRanking) {
                        var opacity = _tmpPlayerInfo[j].opacity;
                        userInfoComponentRanking.setUserName(_tmpPlayerInfo[j].userName);
                        userInfoComponentRanking.setUserMoney(_tmpPlayerInfo[j].userMoney);
                        userInfoComponentRanking.setUserLevelByLevel(_tmpPlayerInfo[j].userLevel);
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
    addOtherPlayerJoined: function (data) {
        var _billardGameTable = data.BillardsGameTable;
        if (_billardGameTable && cc.isValid(_billardGameTable) && data.message) {
            var message = data.message;
            this._billardGameTable = _billardGameTable;
            this._billardGameTableController = this._billardGameTable.getBillardController();
            var otherUserInfo = _billardGameTable.otherUserInfo.getComponent("BillardUserView");
            otherUserInfo.node.active = true;
            otherUserInfo.node.opacity = 255;
            var _panelUser1vs1 = this.getPanelUser1vs1Component();
            var _panelPlayerViewComponent = this._billardGameTable.getPanelPlayerView();

            if (_panelUser1vs1 && _panelPlayerViewComponent) {
                //them truoc khi xoa
                //sap xep lai vi tri nguoi xem
                if (_panelPlayerViewComponent) {
                    _panelPlayerViewComponent.addPlayerToViewSit(message.player);
                }
                var playersData = _billardGameTable.getAllPlayerInMatch();
                var players = playersData.all_players_in_table;
                var numberPlayer = players.length;
                //chi co moi minh
                var _myInfoData = [];
                var _othersInfoData = [];
                var _chuBanInfoData = [];
                var _myInfoIdCheck = [];
                var _othersIdCheck = [];
                var _allPlayerIdCheck = [];
                for (var i = 0; i < numberPlayer; i++) {
                    var id = parseInt(players[i].userID);
                    if (isNaN(id) == false && id != 0) {
                        if (id == Number(Linker.userData.userId)) {
                            if (_myInfoIdCheck.indexOf(id) == -1) {
                                _myInfoIdCheck.push(id);
                                this.isMaster = players[i].isMaster;
                                _myInfoData.push(players[i]);
                            }
                        } else {
                            _allPlayerIdCheck = Utils.Malicious.flattern([_othersIdCheck, _myInfoIdCheck]);
                            if (_allPlayerIdCheck.indexOf(id) == -1) {
                                _othersIdCheck.push(id);
                                if (players[i].isMaster) {
                                    _chuBanInfoData.push(players[i]);
                                } else {
                                    _othersInfoData.push(players[i]);
                                }
                            }
                        }
                    }
                }
                var oponentData = Utils.Malicious.flattern([_chuBanInfoData, _othersInfoData]);
                if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
                    //ưu tiên đánh với chủ bàn trước nếu có
                    cc.log("_myInfoData", _myInfoData);

                    this.setMyUserData(_myInfoData);
                    this.setOthersUserData(oponentData);
                    var currentPlayerNumber = Utils.Malicious.flattern([_myInfoData, oponentData]).length;
                    if (this.isMaster && this.gameState == BiDaConstant.GAME_STATE.WAIT) {
                        if (currentPlayerNumber == 1) {
                            _panelUser1vs1.showBtnInvite();
                        } else {
                            _panelUser1vs1.hideBtnInvite();
                        }
                    } else {
                        _panelUser1vs1.hideBtnInvite();
                    }
                }
            }
        }
    },
    setNextTurn: function (data) {
        var _billardGameTable = data.BillardsGameTable;
        if (_billardGameTable && cc.isValid(_billardGameTable)) {
            var ballsInTable = _billardGameTable.getBallsInTable().arrBall;
            var message = data.message;
            this._billardGameTable = _billardGameTable;
            var _isBallWhiteInHole = false;
            //
            if (Utils.Malicious.isJsonString(message.dataBall)) {
                var serverBall = JSON.parse(message.dataBall);
                if (serverBall && serverBall.length > 0 && serverBall[0].hasOwnProperty("z")) {
                    //bong mac dinh khong co vi tri so 0
                    serverBall.push({
                        num: 0,
                        x: Utils.Malicious.randomMinMax(0, 180),
                        y: Utils.Malicious.randomMinMax(0, 180),
                        z: Utils.Malicious.randomMinMax(0, 180),
                    });
                    message.dataBall = JSON.stringify(serverBall);
                }
            }
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
                _billardGameTable.blockTouchEvent();
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
                var isReady = myInfoData[k].isReady;
                cc.log("isReady: " + isReady);
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
                        userInfoComponent.setProgressMatch(""); //0%
                        userInfoComponent.showPlayer();
                        userInfoComponent.setMaster(userIsMaster);
                        userInfoComponent.setWaitingStatus(false);
                        userInfoComponent.stopCounter(true);
                        userInfoComponent.setReady(isReady);
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
            }
        }
    },
    setOthersUserData(oponentData) {
        if (this._billardGameTable && cc.isValid(this._billardGameTable)) {
            var listUsers = [this._billardGameTable.otherUserInfo];
            var listRemain = [];
            var _panelPlayerViewComponent = this._billardGameTable.getPanelPlayerView();
            var pos = 2;
            for (var k = 0; k < oponentData.length; k++) {
                //create right
                var userName = oponentData[k].userName;
                var userLevel = oponentData[k].userLevel;
                var userFrame = oponentData[k].userAvatarFrame;
                var userId = oponentData[k].userID;
                var userCountryId = oponentData[k].userCountryId;
                var userIsMaster = oponentData[k].isMaster;
                var userMoney = oponentData[k].userMoney;
                if (k >= 0 && k < listUsers.length) {
                    var userInfoComponent = listUsers[k].getComponent("BillardUserView");
                    if (userInfoComponent) {
                        _panelPlayerViewComponent.removePlayerById(userId);
                        userInfoComponent.setUserPos(pos);
                        userInfoComponent.setUserName(userName);
                        userInfoComponent.setUserMoney(userMoney);
                        userInfoComponent.setUserLevelByLevel(userLevel);
                        userInfoComponent.setAvatarAsSpriteFrame(userFrame);
                        userInfoComponent.setFlagAsSpriteFrame(userCountryId);
                        userInfoComponent.setUserID(userId);
                        userInfoComponent.setProgressMatch(""); //0%
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
                this.showOtherPlayer();
                listUsers = [_billardGameTable.myUserInfo, _billardGameTable.otherUserInfo];
                //list dang co tren ban choi
                var dataPlaying = _billardGameTable.getListPlayerInfos({
                    playerids: playerids
                });
                _isMePlaying = dataPlaying._isMePlaying;
                playerInView = dataPlaying.playerInView;
                playerInMatch = dataPlaying.playerInMatch;
                playersInfo = dataPlaying.playersInfo;

                BillardsGameTableController._isViewMatch = true;
                if (_isMePlaying) {
                    BillardsGameTableController._isViewMatch = false;
                }
                //sap xep lai vi tri nguoi choi
                for (var k = 0; k < playerInMatch.length; k++) {
                    //create right
                    var userName = playerInMatch[k].userName;
                    var userMoney = playerInMatch[k].userMoney;
                    var userLevel = playerInMatch[k].userLevel;
                    var userFrame = playerInMatch[k].userAvatarFrame;
                    var userID = playerInMatch[k].userID;
                    var userCountryId = playerInMatch[k].userCountryId;
                    var userWaiting = playerInMatch[k].waitingStatus;
                    var userIsMaster = (userID == playerids[0]) ? true : false;
                    var userInfoComponent = listUsers[k].getComponent("BillardUserView");
                    if (userInfoComponent) {
                        listUsers[k].active = true;
                        _panelPlayerViewComponent.removePlayerById(userID);
                        var pos = (k == 0) ? 1 : 2;
                        userInfoComponent.setUserPos(pos);
                        userInfoComponent.setUserName(userName);
                        userInfoComponent.setUserMoney(userMoney);
                        userInfoComponent.setUserLevelByLevel(userLevel);
                        userInfoComponent.setAvatarAsSpriteFrame(userFrame);
                        userInfoComponent.setFlagAsSpriteFrame(userCountryId);
                        userInfoComponent.setUserID(userID);
                        userInfoComponent.setProgressMatch(""); //0%
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
            }

        }
    },
    startTimerCounter: function (data) {
        var _billardGameTable = data.BillardsGameTable;
        if (_billardGameTable && cc.isValid(_billardGameTable) && data.idturnhientai) {
            this._billardGameTable = _billardGameTable;
            var idturnhientai = data.idturnhientai;
            var listUsers = [_billardGameTable.myUserInfo, _billardGameTable.otherUserInfo];
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
    setWaitingStatusPlayers: function (listPlayerIds) {
        if (listPlayerIds && Array.isArray(listPlayerIds) && listPlayerIds.length >= 2 && this._billardGameTable) {
            var listUsers = [this._billardGameTable.myUserInfo, this._billardGameTable.otherUserInfo];
            for (let i = 0; i < listUsers.length; i++) {
                var userInfoView = listUsers[i].getComponent("BillardUserView");
                if (userInfoView && listPlayerIds.indexOf(Number(userInfoView.getUserID())) != -1) {
                    userInfoView.setWaitingStatus(false);
                } else {
                    userInfoView.setWaitingStatus(true);
                }
            }
        }
    },
    gameBegin: function (data) {
        var _billardGameTable = data.BillardsGameTable;
        if (_billardGameTable && cc.isValid(_billardGameTable) && data.message) {
            var message = data.message;
            this.setWaitingStatusPlayers(message.playerids);
            this._billardGameTable = _billardGameTable;
            //
            var turnHint = BiDaConstant.PSEUDO_CONST.LUOT_DANH_CUA_MINH;
            //an hien thi cac bi dang co cua toi
            this.hideAllMyBallistDisplay({
                BillardsGameTable: _billardGameTable
            });
            //an hien thi cac bi dang co cua doi thu
            this.hideAllOtherBallistDisplay({
                BillardsGameTable: _billardGameTable
            });
            if (Number(message.turnId) == _billardGameTable.myUserId) {
                _billardGameTable.unBlockTouchEvent();
            } else {
                if (!Linker.BiDaOfflineController) {
                    _billardGameTable.blockTouchEvent();
                }
                turnHint = BiDaConstant.PSEUDO_CONST.LUOT_DANH_CUA_DOI_THU;
            }
            _billardGameTable.showDrawrouteWhiteBallAdded(true);
            _billardGameTable.runTurnAnimation(turnHint, function (err, data) {
                if (!err) {
                    _billardGameTable.startTimerCounter(Number(message.turnId));
                }
            }.bind(_billardGameTable))

            //* deactive put ballwhite

            //add container white ball head
            // this.removeBallWithIdInTable(0);
            // this.cue.position = cc.v2(9999, 9999);
            // cc.loader.loadRes("bida/images/df/billards_default_common", cc.SpriteAtlas, function (err, spriteAtlas) {
            //     if (!err) {

            //         var frame = spriteAtlas.getSpriteFrame("eightBall_WhiteBack");
            //         if (frame) {
            //             var whiteBackNode = new cc.Node();
            //             whiteBackNode.name = "WhiteBack";
            //             whiteBackNode.opacity = 0;
            //             var whiteBackSprite = whiteBackNode.addComponent(cc.Sprite);
            //             var whiteBackWidget = whiteBackNode.addComponent(cc.Widget);
            //             var whiteBackCollider = whiteBackNode.addComponent(cc.BoxCollider);

            //             //
            //             whiteBackWidget.isAlignLeft = true;
            //             whiteBackWidget.isAlignRight = true;
            //             whiteBackWidget.isAlignBottom = true;
            //             whiteBackWidget.isAlignTop = true;
            //             //
            //             whiteBackWidget.isAbsoluteBottom = false;
            //             whiteBackWidget.isAbsoluteLeft = false;
            //             whiteBackWidget.isAbsoluteRight = false;
            //             whiteBackWidget.isAbsoluteTop = false;
            //             whiteBackWidget.isStretchHeight = true;
            //             whiteBackWidget.isStretchWidth = true;
            //             //
            //             whiteBackWidget.top = 9.66 / 100;
            //             whiteBackWidget.bottom = 9.64 / 100;
            //             whiteBackWidget.left = 5.46 / 100;
            //             whiteBackWidget.right = 72.34 / 100;
            //             // whiteBackWidget.alignMode = cc.Widget.AlignMode.ALWAYS;
            //             //
            //             whiteBackSprite.type = cc.Sprite.Type.SLICED;
            //             whiteBackSprite.spriteFrame = frame;
            //             this.bidaDeskNode.addChild(whiteBackNode, 0);
            //             var turnHint = BiDaConstant.PSEUDO_CONST.LUOT_DANH_CUA_MINH;
            //             //an hien thi cac bi dang co cua toi
            //             this.hideAllMyBallistDisplay();
            //             //an hien thi cac bi dang co cua doi thu
            //             this.hideAllOtherBallistDisplay();
            //             if (Number(message.turnId) == this.myUserId) {
            //                 whiteBackNode.runAction(
            //                     cc.repeatForever(cc.sequence(
            //                         cc.fadeTo(2.5, 200),
            //                         cc.delayTime(0.2),
            //                         cc.fadeOut(1.5)))
            //                 );
            //                 //limit vung chon bi trang
            //                 var _isRan = false;
            //                 var _this = this;
            //                 var whiteBackHandler = function () {
            //                     if (_isRan == false) {
            //                         _isRan = true;
            //                         //chi chay mot lan
            //                         var minX = (whiteBackNode.position.x - (whiteBackNode.width * 0.5) + (27.5 * 0.5));
            //                         var maxX = (whiteBackNode.position.x + (whiteBackNode.width * 0.5) - (27.5 * 0.5));
            //                         var minY = (whiteBackNode.position.y - (whiteBackNode.height * 0.5) + (27.5 * 0.5));
            //                         var maxY = (whiteBackNode.position.y + (whiteBackNode.height * 0.5) - (27.5 * 0.5));
            //                         whiteBackCollider.offset = cc.v2(0, 0);
            //                         whiteBackCollider.size = cc.size(whiteBackNode.width, whiteBackNode.height);
            //                         _this.datLaiViTriBiTrang({
            //                             isBegin: true,
            //                             _xBegin: {
            //                                 minX: minX,
            //                                 maxX: maxX
            //                             },
            //                             _yBegin: {
            //                                 minY: minY,
            //                                 maxY: maxY
            //                             },
            //                             boxCollider: whiteBackCollider,
            //                             bidaTableComponent: _this
            //                         })
            //                     }

            //                 };
            //                 whiteBackNode.on(cc.Node.EventType.POSITION_CHANGED, whiteBackHandler, whiteBackNode)

            //             } else {
            //                 turnHint = BiDaConstant.PSEUDO_CONST.LUOT_DANH_CUA_DOI_THU;
            //             }
            //             this.runTurnAnimation(turnHint, function (err, data) {
            //                 if (!err) {
            //                     this.startTimerCounter(Number(message.turnId));
            //                 }
            //             }.bind(this))
            //         }
            //     }
            // }.bind(this))
        }
    }
}