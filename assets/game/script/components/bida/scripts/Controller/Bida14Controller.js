var Linker = require('Linker');
var BiDaConstant = require('BiDaConstant');
var i18n = require('i18n');
var Utils = require('Utils');
var PanelPlayerView14 = require("PanelPlayerView14");
var NewAudioManager = require('NewAudioManager');
module.exports = {
    init: function (message) {
        if (message && message.status == 1) {
            // cc.log(message);
            this.BillardsGameTable = message.BillardsGameTable;
            this.BillardsGameTableController = message.BillardsGameTableController;
        }
    },
    checkIdPlaying: function (id) {
        if (this.BillardsGameTable && this.BillardsGameTableController) {
            if (!this.BillardsGameTableController.listPlayerIdInGame) {
                return this.BillardsGameTableController._isViewMatch;
            } else {
                id = parseInt(id);
                if (isNaN(id) == true) {
                    id = Number(Linker.userData.userId);
                }
                if (this.BillardsGameTableController.listPlayerIdInGame.indexOf(id) != -1) {
                    return true;
                }
            }
        }
        return false;
    },
    onTurnCardRespone(message) {
        if (message && message.status == 1) {
            // cc.log(message);
            this.BillardsGameTable = message.BillardsGameTable;
            this.BillardsGameTableController = message.BillardsGameTableController;
            if (this.BillardsGameTable) {
                // cc.log(message);
                this.BillardsGameTableController.isAutoNextTurn = false;
                switch (this.BillardsGameTableController.gameState) {
                    case BiDaConstant.GAME_STATE.PLAYING:
                        //de xem ong nay dang xem hay dang choi da
                        if (this.BillardsGameTableController._isViewMatch == false) {
                            if (message.status == 1 && this.BillardsGameTableController.isEndGame == false) {

                                //cap nhat status cua gay
                                switch (message.cueStatus) {
                                    case BiDaConstant.TABLE_STATUS.MOVING_CUE:
                                        // neu mode 1vs4 khong can update thong tin them
                                        var touch_id = message.cueR;
                                        if (parseInt(touch_id) === BiDaConstant.TABLE_STATUS.DRAGGING_CUE_BOX) {
                                            cc.log("DRAGGING_CUE_BOX", message);
                                        } else if (parseInt(touch_id) === BiDaConstant.TABLE_STATUS.DRAG_WHITE_BALL_TO_SHOOT) {
                                            cc.log("DRAG_WHITE_BALL_TO_SHOOT", message);
                                        } else if (parseInt(touch_id) === BiDaConstant.TABLE_STATUS.REPOSITION_WHITE_BALL) {
                                            cc.log("REPOSITION_WHITE_BALL", message);
                                        } else if (parseInt(touch_id) === BiDaConstant.TABLE_STATUS.WHITE_BALL_ANGLE_ADJUST) {
                                            cc.log("WHITE_BALL_ANGLE_ADJUST", message);
                                        } else {
                                            cc.log("Dang di chuyen cay co", message);
                                        }
                                        break;
                                    case BiDaConstant.TABLE_STATUS.UPDATE_GOC_BAN_BI:
                                        break;
                                    case BiDaConstant.TABLE_STATUS.END_DRAGGING_CUE:
                                        break;
                                    case BiDaConstant.TABLE_STATUS.SETTING_RESULT_TURN:
                                        message._isNormalNextTurn = true;
                                        //xu ly phan logic game 1vs4 phu thuoc vao ballErrorId cua nguoi choi                                        
                                        this.onEndTurnGame(message, BiDaConstant.TABLE_STATUS.SETTING_RESULT_TURN);
                                        break;
                                    case BiDaConstant.TABLE_STATUS.AUTO_NEXT_TURN:
                                        message._isNormalNextTurn = false;
                                        this.BillardsGameTableController.isAutoNextTurn = true;
                                        break;
                                    default:
                                        break;
                                }
                            } else {
                                BillardsGameTable.showMessage(i18n.t(message.error));
                            }
                        } else {
                            cc.log("Dang xem game", message);
                            this.BillardsGameTableController._isViewMatch = true;
                            this.BillardsGameTable._isGameStarted = true;
                            PanelPlayerView14.onTurnCardRespone(message);
                        }

                        break;
                    case BiDaConstant.GAME_STATE.WAIT:

                        break;
                    default:
                        break;
                }
            }

        }
    },
    resetCounter: function (listUsers) {
        if (listUsers && Array.isArray(listUsers) && listUsers.length > 0) {
            for (var i = 0; i < listUsers.length; i++) {
                if (listUsers[i] && cc.isValid(listUsers[i])) {
                    var userInfoView = listUsers[i].getComponent("BillardUserView");
                    if (userInfoView) {
                        userInfoView.player_list_ball_tren_tay = [];
                        userInfoView.stopCounter();
                        userInfoView.resetCounter();
                    }
                }
            }
        }
    },
    resetListBallOnHand: function (message) {
        if (message && message.status == 1) {
            this.BillardsGameTable = message.BillardsGameTable;
            this.BillardsGameTableController = message.BillardsGameTableController;
            this.BillardsGameTable.myListBallOnHand = [];
            cc.log("Reseting list bi on hand 14...");
            var listUsers = Utils.Malicious.flattern([
                [this.BillardsGameTable.myUserInfo], this.BillardsGameTable.rankingUserInfo
            ]);
            this.resetCounter(listUsers);
            if (message.playerInTable.length < 2) {
                Utils.Malicious.destroyAllChildrenWithoutName(this.BillardsGameTable.bidaDeskNode, "CueObj");
            }
            this.BillardsGameTable.getRailingBagComponent().removeAllBiInBag();
            this.BillardsGameTable.blockTouchEvent();
        }
    },
    onEndTurnGame: function (message, type) {
        if (this.BillardsGameTable && this.BillardsGameTableController) {
            if (type == BiDaConstant.TABLE_STATUS.SETTING_RESULT_TURN) {
                this.BillardsGameTable.setErrorNumber(message.players);
                if (this.BillardsGameTable._isSendedBeforeTurn) {
                    this.BillardsGameTable._isSendedBeforeTurn = false;
                    //set turn hint silent
                    this.BillardsGameTable.myListBallOnHand = [];
                    this.BillardsGameTable.setColorBallTag(message);
                    if (message.leftTime > 0) {
                        this.BillardsGameTable.setCountDownTimeLeft(message.leftTime);
                    }
                    cc.log("End turn 1vs4", message)
                    if (message.hasOwnProperty("players")) {
                        for (let i = 0; i < message.players.length; i++) {
                            var player = message.players[i];
                            if (Number(player.id) == Number(Linker.userData.userId)) {
                                //check ballErrorID
                                var codeErr = Number(player.ballErrorId);
                                message.player = player;
                                switch (codeErr) {
                                    case BiDaConstant.GAME.STATUS.BALL_ERROR.BI_SO_8_ROI_XUONG_LO_NHUNG_CHUA_HET_BI_CUA_MINH:
                                        //end game
                                        cc.log("End game roi bi 8...", message);
                                        this.showListBiTrenTay(message);
                                        message.timeStart = BiDaConstant.GAME.CONFIG.THOI_GIAN_CHO_KHI_BI_8_ROI_XUONG;
                                        this.handleBallErrorId(message);
                                        break;
                                    case BiDaConstant.GAME.STATUS.BALL_ERROR.BI_SO_8_ROI_XUONG_LO_NHUNG_KHONG_HOP_LE:
                                        //end game
                                        cc.log("End game roi bi 8 khong hop le...", message);
                                        this.showListBiTrenTay(message);
                                        message.timeStart = BiDaConstant.GAME.CONFIG.THOI_GIAN_CHO_KHI_BI_8_ROI_XUONG;
                                        this.handleBallErrorId(message);
                                        break;
                                    case BiDaConstant.GAME.STATUS.BALL_ERROR.BI_ROI_XUONG_LO_KHONG_PHAI_CUA_MINH:
                                        //truong hop nay nen check ca bi cai luon vi neu co 2 bi roi, mot cua op mot la white ball
                                        cc.log("Bi roi xuong lo la bi cua doi thu...", message);
                                        this.showListBiTrenTay(message);
                                        message.timeStart = BiDaConstant.GAME.CONFIG.THOI_GIAN_CHO_KHI_BOI_DANH_BI;
                                        this.handleBallErrorId(message);
                                        //end game
                                        break;
                                    case BiDaConstant.GAME.STATUS.BALL_ERROR.BI_CAI_ROI_XONG_LO:
                                        cc.log("Bi cai roi xuong lo...", message);
                                        this.showListBiTrenTay(message);
                                        var ballInTableId = this.BillardsGameTableController.addListBallAndGetBallinTable(player, this.BillardsGameTable);
                                        var _this = this;
                                        this.handleGameAfter(BiDaConstant.GAME.CONFIG.THOI_GIAN_CHO_KHI_BOI_DANH_BI, function (err, data) {
                                            if (!err) {
                                                //check tren ban co bi trang khong
                                                var whiteBall = _this.BillardsGameTable.getWhiteBall();
                                                if (!whiteBall && ballInTableId.indexOf(0) == -1) {
                                                    _this.BillardsGameTable.datLaiViTriBiTrang();
                                                } else {
                                                    cc.log("Du lieu trung khop, khong tim thay bi cai tren ban va client gui ve...", ballInTableId);
                                                }
                                                //dat lai bi cai
                                            }
                                        });
                                        break;
                                    case BiDaConstant.GAME.STATUS.BALL_ERROR.LUOT_DANH_HOP_LE:
                                        this.showListBiTrenTay(message);
                                        cc.log("message", message);
                                        this.BillardsGameTable.setNextTurn();
                                        break;
                                    case BiDaConstant.GAME.STATUS.BALL_ERROR.KHONG_XAC_DINH:
                                        this.showListBiTrenTay(message);
                                        cc.log("message", message);
                                        this.BillardsGameTable.setNextTurn();
                                        break;
                                    default:
                                        cc.log("BallError khong the xac dinh", message);
                                        break;
                                }
                                break;
                            }
                        }
                        this.setUsersInfoTurn(message);
                    }
                } else {
                    //set phan tram neu nhu khong phai luot danh cua minh nhe
                    this.setUsersInfoTurn(message);
                }

            } else if (type == 2) {
                cc.log("Tu dong next turn khong duoc su dung o mode 1vs4 ...");
            }
        }

    },

    handleBallErrorId: function (message) {
        if (this.BillardsGameTable && this.BillardsGameTableController) {
            var ballInTableId = this.BillardsGameTableController.addListBallAndGetBallinTable(message.player, this.BillardsGameTable);
            var timeStart = (message && message.timeStart) ? message.timeStart : BiDaConstant.GAME.CONFIG.THOI_GIAN_CHO_KHI_BOI_DANH_BI;
            var _this = this;
            this.handleGameAfter(timeStart, function (err, data) {
                if (!err, data) {
                    //check tren ban co bi trang khong
                    var whiteBall = _this.BillardsGameTable.getWhiteBall();
                    if (!whiteBall && ballInTableId.indexOf(0) == -1) {
                        _this.BillardsGameTable.datLaiViTriBiTrang();
                        //bi trang roi
                    } else {
                        _this.BillardsGameTable.setNextTurn();
                    }
                }
            });
        }
    },
    handleGameAfter: function (timeRemain, cbw) {
        if (this.BillardsGameTable && this.BillardsGameTableController) {
            var timeReady = timeRemain + 1;
            var _this = this;
            var cb = function () {
                if (timeRemain < 0) {
                    _this.BillardsGameTableController.unschedule(cb);
                    _this.BillardsGameTable.hideTimeCountDownBallError();
                    if (cbw) {
                        cbw(null, true);
                    }
                } else {
                    _this.BillardsGameTable.showTimeCountDownBallError(timeRemain);
                    cc.log("Start after " + timeRemain + " seconds...");
                }
                timeRemain--;
            };
            this.BillardsGameTableController.schedule(cb, 1, timeReady, 0);
        }

    },
    showListBiTrenTay: function (message) {
        if (this.BillardsGameTable && this.BillardsGameTableController) {
            var listBallOnHand = this.BillardsGameTableController.addListBiCanAn(message.player);
            //hop le
            if (listBallOnHand.length == 7) {
                this.BillardsGameTable.stopAllTipAnimation();
                this.BillardsGameTable.showBallListDisplay(listBallOnHand, BiDaConstant.PSEUDO_CONST.KIEU_BI_CUA_MINH, true, true);
            } else if (listBallOnHand.length == 8) {
                this.BillardsGameTable.stopAllTipAnimation();
                listBallOnHand[listBallOnHand.length - 2] = listBallOnHand[listBallOnHand.length - 1];
                listBallOnHand.splice(listBallOnHand.length - 1, 1);
                this.BillardsGameTable.showBallListDisplay(listBallOnHand, BiDaConstant.PSEUDO_CONST.KIEU_BI_CUA_MINH, true, true);
            }
        }
    },
    setUsersInfoTurn: function (message) {
        if (this.BillardsGameTable && this.BillardsGameTableController) {
            //get percent data
            var _tmpRankingUser = [];
            var _tmpLeftRankingUser = null;
            for (let k = 0; k < message.players.length; k++) {
                var player = message.players[k];
                var playerId = player.id;
                var rankingUser = this.BillardsGameTable.getUserRankingById(playerId);
                if (rankingUser) {
                    var rankingUserComponent = rankingUser.getComponent("BillardUserView");
                    if (rankingUserComponent) {
                        _tmpRankingUser.push({
                            userAvatarFrame: rankingUserComponent.getUserAvatarFrame(),
                            userMoney: rankingUserComponent.getUserMoney(),
                            userName: rankingUserComponent.getUserName(),
                            userID: rankingUserComponent.getUserID(),
                            userNationFrame: rankingUserComponent.getNationFrame(),
                            userPercentMatch: player.player_percent_eat,

                        })
                    }
                }
                if (this.BillardsGameTable.myUserInfo.getComponent("BillardUserView").getUserID() == playerId) {
                    _tmpLeftRankingUser = {
                        userPercentMatch: player.player_percent_eat
                    };
                }
            }
            //set percent data
            for (let j = 0; j < _tmpRankingUser.length; j++) {
                var userInfoComponentRanking = this.BillardsGameTable.rankingUserInfo[j].getComponent("BillardUserView");
                if (userInfoComponentRanking) {
                    userInfoComponentRanking.setAvatarAsSpriteFrame(_tmpRankingUser[j].userAvatarFrame);
                    userInfoComponentRanking.setUserMoney(_tmpRankingUser[j].userMoney);
                    userInfoComponentRanking.setUserName(_tmpRankingUser[j].userName);
                    userInfoComponentRanking.setUserID(_tmpRankingUser[j].userID);
                    userInfoComponentRanking.setFlagAsFrame(_tmpRankingUser[j].userNationFrame);
                    userInfoComponentRanking.setProgressMatch(_tmpRankingUser[j].userPercentMatch);

                }
                this.BillardsGameTable.rankingUserInfo[j].stopAllActions();
                if (_tmpRankingUser[j].userID == Number(Linker.userData.userId)) {
                    this.BillardsGameTable.rankingUserInfo[j].runAction(cc.sequence(cc.repeat(cc.sequence(cc.scaleTo(0.25, 1.05), cc.scaleTo(0.25, 1.00)), 5), cc.scaleTo(0, 1)));
                }
            }
            //set left block data
            if (_tmpLeftRankingUser) {
                var userInfoComponent = this.BillardsGameTable.myUserInfo.getComponent("BillardUserView");
                if (userInfoComponent) {
                    var percentMatch = _tmpLeftRankingUser.userPercentMatch;
                    userInfoComponent.setProgressMatch(percentMatch); //0%
                    userInfoComponent.showPlayer();
                    userInfoComponent.setUserPos(1);
                }
            }
        }
    },
    onJoinTableResponse: function (message) {
        if (message && message.status == 1) {
            // cc.log(message);
            this.BillardsGameTable = message.BillardsGameTable;
            this.BillardsGameTableController = message.BillardsGameTableController;
            var players = message.listPlayer;
            this.BillardsGameTableController.listPlayerIdInGame = [];
            message.listPlayerIdInGame = [];
            var listArrNguoiChoi = [];
            var listArrNguoiXem = [];

            if (players && Array.isArray(players) && players.length) {
                for (let k = 0; k < players.length; k++) {
                    if (Number(players[k].isObserver) == 0) {
                        message.listPlayerIdInGame.push(Number(players[k].userId));
                        listArrNguoiChoi.push(players[k]);
                    } else {
                        listArrNguoiXem.push(players[k]);
                    }
                }
            }
            this.BillardsGameTableController.listPlayerIdInGame = message.listPlayerIdInGame;
            if (this.BillardsGameTable) {
                switch (this.BillardsGameTableController.gameState) {
                    case BiDaConstant.GAME_STATE.WAIT: {
                        //gui setting lai nguoi choi list
                        this.BillardsGameTableController._isViewMatch = false;
                        this.BillardsGameTableController.createTableGame(message);
                        // this.getBidaGameTable().btnPlayerViewList.parent.active = false;
                        break;
                    }
                    case BiDaConstant.GAME_STATE.PLAYING: {
                        cc.log("dang xem day")
                        //nếu isObserver = 0 -> player này đang chơi, isObserver = 1 thì player này đang xem.
                        // this.getBidaGameTable().btnPlayerViewList.parent.active = true;
                        this.BillardsGameTableController._isViewMatch = true;
                        message.BillardsGameTable = this.BillardsGameTable;
                        break;
                    }
                }
                PanelPlayerView14.config(message);
            }
        }
    },
    onCreateTableResponse: function (message) {

    },
    onPlayerJoinedResponse: function (message) {
        if (message && message.status == 1) {
            // cc.log(message);
            this.BillardsGameTable = message.BillardsGameTable;
            this.BillardsGameTableController = message.BillardsGameTableController;
            if (this.BillardsGameTable) {
                NewAudioManager.playClick("joinboard");
                switch (this.BillardsGameTableController.gameState) {
                    case BiDaConstant.GAME_STATE.WAIT: {
                        cc.log("join 1vs4 mode", message);
                        this.BillardsGameTable.addOtherPlayerJoined(message);
                        this.BillardsGameTableController.handleMatchStartGame(BiDaConstant.GAME.CONFIG.THOI_GIAN_CHO_BAT_DAU_TRAN_1_VS_4);
                        // BillardsGameTable.initTableInfo(message);
                        this.BillardsGameTableController.hidePopupInvite();
                        // this.getBidaGameTable().btnPlayerViewList.parent.active = false;
                        break;
                    }
                    case BiDaConstant.GAME_STATE.PLAYING: {
                        // this.getBidaGameTable().btnPlayerViewList.parent.active = true;
                        message.BillardsGameTable = this.BillardsGameTable;
                        PanelPlayerView14.config(message);
                        break;
                    }
                    default:
                        break;
                }
            }

        }
    },
    onLeaveTableRespone: function (message) {

    },
    onTableSettingChangeResponse: function (message) {

    },
    onGameEndResponse: function (message) {

    },
    onPlayerReadyResponse: function (message) {

    },
    setMasterById: function (id) {
        if (this.BillardsGameTable && cc.isValid(this.BillardsGameTable)) {
            id = parseInt(id);
            if (isNaN(id) == false) {
                var listUsers = Utils.Malicious.flattern([
                    [this.BillardsGameTable.myUserInfo], this.BillardsGameTable.rankingUserInfo
                ]);
                for (var i = 0; i < listUsers.length; i++) {
                    if (listUsers && cc.isValid(listUsers)) {
                        var userInfoView = listUsers[i].getComponent("BillardUserView");
                        if (userInfoView) {
                            if (Number(userInfoView.getUserID()) == id) {
                                if (id == Linker.userData.userId) {
                                    this.BillardsGameTable.isMaster = 1;
                                }
                                userInfoView.setMaster(true);
                            } else {
                                userInfoView.setMaster(false);
                                this.BillardsGameTable.isMaster = 0;
                            }
                        }
                    }
                }
            }
        }
    },
    onMatchStartResponse: function (message) {
        if (message && message.status == 1) {
            this.BillardsGameTable = message.BillardsGameTable;
            this.BillardsGameTableController = message.BillardsGameTableController;
            this.BillardsGameTableController.gameState = BiDaConstant.GAME_STATE.PLAYING;
            if (this.BillardsGameTable) {
                this.BillardsGameTable.setCountDownTimeLeft(this.BillardsGameTableController.playTime);
                this.BillardsGameTable.hideTimeCountDownBallError();
                this.BillardsGameTableController.isEndGame = false;
                this.BillardsGameTableController.isLeaveTable = false;
                this.BillardsGameTableController.listPlayerIdInGame = [];
                this.BillardsGameTable.isBotInTable = message.isBotInTable;
                if (message.listPlayerIdInGame) {
                    this.BillardsGameTableController.listPlayerIdInGame = message.listPlayerIdInGame;
                    var playerIds = message.listPlayerIdInGame;
                    this.setMasterById(message.listPlayerIdInGame[0]);
                    var _tmpPlayerIds = [];
                    for (var i = 0; i < playerIds.length; i++) {
                        _tmpPlayerIds.push(Number(playerIds[i]))
                    }
                    cc.log("Bat dau tran dau 14 ...", message);
                    //trong ban choi 14 thi so nguoi choi phai luon lon hon hoac bang 2(1vs4) va be hon hoac bang 5
                    if (_tmpPlayerIds.length >= 2) {
                        message.playerids = _tmpPlayerIds;
                        this.BillardsGameTable.reConfigPlayersInGame(message);
                        //nguoi choi luot danh dau tien
                        if (this.checkIdPlaying()) {
                            this.BillardsGameTable.gameBegin(message);
                        } else {
                            PanelPlayerView14.config(message);
                        }
                        var whiteBall = this.BillardsGameTable.getBallById(0);
                        if (whiteBall) {
                            // var biJs = whiteBall.getComponent("Ball");
                            // if (biJs) {
                            //     biJs.setColorTag(BiDaConstant.COLOR_TAG.ME);
                            // }
                            this.BillardsGameTable.setCueOpacity();
                            this.BillardsGameTable.setCuePosition(whiteBall.position);
                        }
                    } else {
                        this.BillardsGameTableController.failMatchStart(message);
                    }
                }
            }
        }
    }
}
