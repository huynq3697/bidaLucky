var Linker = require('Linker');
var BiDaConstant = require('BiDaConstant');
var i18n = require('i18n');
var Utils = require('Utils');
var PanelPlayerView11 = require("PanelPlayerView11");
var NewAudioManager = require('NewAudioManager');
module.exports = {
    init: function (message) {
        if (message) {
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
            // this.BillardsGameTable._isDataEndTurnGame = false;
            if (this.BillardsGameTable) {
                switch (this.BillardsGameTableController.gameState) {
                    case BiDaConstant.GAME_STATE.PLAYING:
                        //de xem ong nay dang xem hay dang choi da
                        if (this.checkIdPlaying()) {
                            this.BillardsGameTableController._isViewMatch = false;
                            if (message.status == 1 && this.BillardsGameTableController.isEndGame == false) {
                                this.BillardsGameTable._isServerWaiting = false;
                                if (message.dataBall) {
                                    this.BillardsGameTableController.dataBallResponse = message.dataBall.length > 0 ? JSON.parse(message.dataBall) : [];
                                }
                                //cap nhat status cua gay
                                switch (message.cueStatus) {
                                    case BiDaConstant.TABLE_STATUS.MOVING_CUE:
                                        var touch_id = message.cueR;
                                        if (parseInt(touch_id) === BiDaConstant.TABLE_STATUS.DRAGGING_CUE_BOX) {
                                            var cue = this.BillardsGameTable.cue;
                                            if (this.BillardsGameTableController.idplayerLuotDanh != this.BillardsGameTableController.myUserId) {
                                                if (cue && cue.isValid) {
                                                    cue.getComponent("CueObj").lineCheck.opacity = 0;
                                                    //cap nhat vi tri goc quay cua gay
                                                    cue.position = this.BillardsGameTable.bidaDeskNode.convertToNodeSpaceAR(message.cueP);
                                                    this.BillardsGameTable.panelPower.active = true;
                                                    this.BillardsGameTable.panelPower.opacity = 255;
                                                }
                                                // cc.log("Goc quay dang duoc cap nhat tu server...", message);
                                            } else {
                                                if (cue && cc.isValid(cue)) {
                                                    cue.getComponent("CueObj").lineCheck.opacity = 0;
                                                }
                                                // cc.log("Luot choi cua minh dang danh khong duoc cap nhat...", message);
                                            }

                                        } else if (parseInt(touch_id) === BiDaConstant.TABLE_STATUS.DRAG_WHITE_BALL_TO_SHOOT) {
                                            var whiteBallDrag = this.BillardsGameTable.getWhiteBallRepos();
                                            var WBallPos = null;
                                            if (whiteBallDrag) {
                                                WBallPos = whiteBallDrag.getComponent("WBallPos");
                                                if (WBallPos && WBallPos.isValid) {
                                                    WBallPos.onActiveBlock();
                                                }
                                            } else {
                                                this.BillardsGameTable.datLaiViTriBiTrang();
                                                whiteBallDrag = this.BillardsGameTable.getWhiteBallRepos();
                                                if (whiteBallDrag) {
                                                    WBallPos = whiteBallDrag.getComponent("WBallPos");
                                                    if (WBallPos && WBallPos.isValid) {
                                                        WBallPos.onActiveBlock();
                                                    }
                                                } else {
                                                    // cc.log("Khong the khoi tao lai bi cai de dat trong ban choi...");
                                                }
                                            }
                                            if (this.BillardsGameTableController.idplayerLuotDanh == this.BillardsGameTableController.myUserId) {
                                                WBallPos.onDeactiveBlock();
                                                //cho phep nguoi dung di chuyen bi
                                            } else {
                                                WBallPos.onTmpPosition(cc.v2(message.ballX, message.ballY));
                                                //cho phep nguoi dung di chuyen bi
                                            }
                                        } else if (parseInt(touch_id) === BiDaConstant.TABLE_STATUS.REPOSITION_WHITE_BALL) {
                                            this.BillardsGameTable.isRepositionWball = true;
                                            this.BillardsGameTable.blockTouchEvent();
                                            if (this.BillardsGameTableController.idplayerLuotDanh != this.BillardsGameTableController.myUserId) {
                                                this.BillardsGameTable.removeWhiteBallRepos();
                                                var data = {
                                                    pos: cc.v2(message.ballX, message.ballY),
                                                    anim_id: 0,
                                                    bg_sprite_frame: 0,
                                                    animation_sprite_frame: 0,
                                                    id: 0
                                                };
                                                this.BillardsGameTable.addOneBiWithData(data);
                                                var railCmp = this.BillardsGameTable.getRailingBagComponent();
                                                if (railCmp) {
                                                    railCmp.removeBallWithId(0);
                                                }
                                            } else {
                                                this.BillardsGameTable.unBlockTouchEvent();
                                            }
                                        } else if (parseInt(touch_id) === BiDaConstant.TABLE_STATUS.WHITE_BALL_ANGLE_ADJUST) {
                                            if (this.BillardsGameTableController.myUserId != this.BillardsGameTableController.idplayerLuotDanh) {
                                                this.BillardsGameTable.m_rotate = cc.v2(message.ballX, message.ballY);
                                                var smallRedpoint = this.BillardsGameTable.redPointNode.getChildByName("Small_RedPoint");
                                                if (smallRedpoint) {
                                                    var x = this.BillardsGameTable.m_rotate.x * 30 + this.BillardsGameTable.redPointNode.width * 0.5;
                                                    var y = this.BillardsGameTable.m_rotate.y * 30 + this.BillardsGameTable.redPointNode.height * 0.5;
                                                    smallRedpoint.position = cc.v2(x, y);
                                                }
                                            } else { }
                                        } else {
                                            if (this.BillardsGameTableController.idplayerLuotDanh != this.BillardsGameTableController.myUserId) {
                                                var cue = this.BillardsGameTable.cue;
                                                if (cue && cue.isValid) {
                                                    //cap nhat vi tri goc quay cua gay
                                                    var deskNode = cue.parent;
                                                    cue.position = deskNode.convertToNodeSpaceAR(message.cueP);
                                                    var p = message.cueP;
                                                    var wlocation = Utils.Malicious.getApointWhenKnowAngleAndRadius(p, -message.cueR, deskNode.width * 2);
                                                    this.BillardsGameTable.setCuePosByTouch(wlocation, false, true, false);
                                                }
                                                // cc.log("Goc quay dang duoc cap nhat tu server...", message);
                                            } else {
                                                // cc.log("Luot choi cua minh dang danh khong duoc cap nhat...", message);
                                            }
                                        }
                                        break;
                                    case BiDaConstant.TABLE_STATUS.UPDATE_GOC_BAN_BI:
                                        // cc.log("UPDATE_GOC_BAN_BI_CUOI_CUNG", message);
                                        var cue = this.BillardsGameTable.cue;
                                        if (cue && cue.isValid) {
                                            //cap nhat vi tri goc quay cua gay
                                            cue.position = this.BillardsGameTable.bidaDeskNode.convertToNodeSpaceAR(message.cueP);
                                        }
                                        this.BillardsGameTable.setCuePosByTouch(cc.v2(0, 0), false, true, Utils.Malicious.toPositiveAngle(message.cueR));
                                        break;
                                    case BiDaConstant.TABLE_STATUS.END_DRAGGING_CUE:
                                        var cue = this.BillardsGameTable.cue;
                                        if (cue && cue.isValid) {
                                            // cap nhat vi tri goc quay cua gay
                                            var progress = 1 - message.cueAR / 100;
                                            this.BillardsGameTable.forcePowerSlider.getComponent(cc.Slider).progress = progress;
                                            message.type = 1;
                                            if (this.BillardsGameTableController.idplayerLuotDanh != this.BillardsGameTableController.myUserId) {
                                                message.type = 2;
                                            }
                                            this.BillardsGameTable.runActionShotBallWhite(message);
                                        }
                                        break;
                                    case BiDaConstant.TABLE_STATUS.SETTING_RESULT_TURN:

                                        // this.BillardsGameTable._isShoted = true;
                                        this.BillardsGameTable.isRepositionWball = false;
                                        this.BillardsGameTableController.isAutoNextTurn = false;
                                        cc.log("next turn binh thuong onTurnCardRespone", message);
                                        message._isNormalNextTurn = true;
                                        this.onEndTurnGame(message, BiDaConstant.TABLE_STATUS.SETTING_RESULT_TURN);
                                        break;
                                    case BiDaConstant.TABLE_STATUS.AUTO_NEXT_TURN:
                                        this.BillardsGameTableController.isAutoNextTurn = true;
                                        cc.log("auto next turn onTurnCardRespone", message);
                                        message._isNormalNextTurn = false;
                                        this.onEndTurnGame(message, BiDaConstant.TABLE_STATUS.AUTO_NEXT_TURN);
                                        break;
                                    case BiDaConstant.TABLE_STATUS.RECOVER_BALL_POSITION_RECONNECT:
                                        this.BillardsGameTableController.resetReconnect(message);
                                        // "Lượt đánh của người chơi"+ manhuni + "bi trên bàn sẽ được reset lại;
                                        var _playerName = this.BillardsGameTableController.getPlayerNameById(Number(this.BillardsGameTableController.idplayerLuotDanh))
                                        var msg = i18n.t("player_turn") + " " + _playerName + " " + i18n.t("invalid") + ", " + i18n.t("table_reset_ball_position");
                                        cc.Global.showMessage(msg);
                                        cc.error(msg);

                                        break;
                                    default:
                                        break;
                                }
                            } else {
                                this.BillardsGameTable.showMessage(i18n.t(message.error));
                            }
                        } else {

                            cc.log("Dang xem game", message);
                            this.BillardsGameTableController._isViewMatch = true;
                            this.BillardsGameTable._isGameStarted = true;
                            PanelPlayerView11.onTurnCardRespone(message);
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

    resetListBallOnHand: function (message) {
        if (message && message.status == 1) {
            this.BillardsGameTable = message.BillardsGameTable;
            this.BillardsGameTableController = message.BillardsGameTableController;
            this.BillardsGameTable.myListBallOnHand = [];
            cc.log("Reseting list bi on hand 11...");
            var listUsers = [this.BillardsGameTable.myUserInfo, this.BillardsGameTable.otherUserInfo];
            this.resetCounter(listUsers);
            if (message.playerInTable.length < 2) {
                Utils.Malicious.destroyAllChildrenWithoutName(this.BillardsGameTable.bidaDeskNode, "CueObj");
            }
            this.BillardsGameTable.getRailingBagComponent().removeAllBiInBag();
            this.BillardsGameTable.blockTouchEvent();
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
    onEndTurnGame: function (message, type) {
        if (this.BillardsGameTable && this.BillardsGameTableController) {
            if (this.BillardsGameTableController.isEndGame == false) {
                // check reconnect
                if (Number(message.turnId) == Number(this.BillardsGameTableController.myUserId) && this.BillardsGameTableController.isReconnectWait == false) {
                    this.BillardsGameTableController.isReconnectRenderBall = true;
                }
                this.BillardsGameTable.bidaDeskContainer.getChildByName("waitLabel").active = false;
                this.BillardsGameTableController.isReconnectWait = false;
                //check array bi ăn của mình có mất đi không ? để set combo
                var checkBallOnHand = this.checkEatBallOnHand(message);
                //end
                this.BillardsGameTableController.showMsgError(message);
                this.BillardsGameTableController._tmpMessageEndTurn = null;
                this.BillardsGameTableController.idplayerLuotDanh = Number(message.turnId);
                this.BillardsGameTable.stopAllTipAnimation();
                // message.dataBall
                var turnHint = BiDaConstant.PSEUDO_CONST.LUOT_DANH_CUA_MINH;
                //set turn hint silent
                this.BillardsGameTable.myListBallOnHand = [];
                this.BillardsGameTable.setColorBallTag(message);
                this.BillardsGameTable.setErrorNumber(message.players);
                if (message.leftTime > 0) {
                    this.BillardsGameTable.setCountDownTimeLeft(message.leftTime);
                }
                if (Number(this.BillardsGameTableController.idplayerLuotDanh) == Number(this.BillardsGameTableController.myUserId)) {
                    if (checkBallOnHand == true) {
                        this.BillardsGameTableController.countTurn = this.BillardsGameTableController.countTurn + 1;
                    }
                    this.BillardsGameTable.setTurnBlur(true);
                } else {
                    this.BillardsGameTable.setTurnBlur(false);
                    this.BillardsGameTableController.countTurn = -1;
                    turnHint = BiDaConstant.PSEUDO_CONST.LUOT_DANH_CUA_DOI_THU;
                }
                message.turnHint = turnHint;
                this.BillardsGameTable._tmpEndTurnDataServerWaiting = message;
                this.BillardsGameTableController._tmpMessageEndTurn = message;

                this.BillardsGameTable._isDataEndTurnGame = true;
            }
        }
    },
    checkEatBallOnHand: function (message) {
        var players = message.players;
        for (var i = 0; i < players.length; i++) {
            var isSameArray = Utils.Malicious.isArraySameArray(this.BillardsGameTable.myListBallOnHand, players[i].player_list_ball_tren_tay);
            if (Number(players[i].id) == Number(this.BillardsGameTableController.myUserId) && !isSameArray && Number(players[i].ballErrorId) == 1 && players[i].player_list_ball_tren_tay.length > 0) {
                return true;
            }
        }
        return false;
    },
    onJoinTableResponse: function (message) {
        if (message && message.status == 1) {
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
                        this.BillardsGameTableController.isEndGame = true;
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
                        this.BillardsGameTableController.isEndGame = false;
                        this.BillardsGameTableController.ListPlayer = cc.js.array.copy(message.listPlayer);
                        this.BillardsGameTableController._isViewMatch = true;
                        message.BillardsGameTable = this.BillardsGameTable;
                        break;
                    }
                }
                PanelPlayerView11.config(message);

            }
        }
    },
    onCreateTableResponse: function (message) {

    },
    onPlayerJoinedResponse: function (message) {
        if (message && message.status == 1) {
            this.BillardsGameTable = message.BillardsGameTable;
            this.BillardsGameTableController = message.BillardsGameTableController;
            if (this.BillardsGameTable) {
                NewAudioManager.playClick("joinboard");
                switch (this.BillardsGameTableController.gameState) {
                    case BiDaConstant.GAME_STATE.WAIT: {
                        cc.log("joined bida 1vs1 mode", message);
                        this.BillardsGameTable.addOtherPlayerJoined(message);
                        this.BillardsGameTableController.ListPlayer.push(message.player);
                        var players = this.BillardsGameTable.getAllPlayerInMatch();
                        if (players.all_players_in_table.length == 2) {
                            this.BillardsGameTableController.handleMatchStartGame();
                            this.BillardsGameTableController.hidePopupInvite();
                        }
                        break;
                    }
                    case BiDaConstant.GAME_STATE.PLAYING: {
                        // this.getBidaGameTable().btnPlayerViewList.parent.active = true;
                        message.BillardsGameTable = this.BillardsGameTable;
                        break;
                    }
                    default:
                        break;
                }
                PanelPlayerView11.config(message);
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
                var listUsers = [this.BillardsGameTable.myUserInfo, this.BillardsGameTable.otherUserInfo];
                for (var i = 0; i < listUsers.length; i++) {
                    if (listUsers && cc.isValid(listUsers)) {
                        var userInfoView = listUsers[i].getComponent("BillardUserView");
                        if (userInfoView) {
                            var idPlayer = Number(userInfoView.getUserID());
                            if (idPlayer == id) {
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
                this.BillardsGameTableController.isReconnectWait = false;
                this.BillardsGameTableController.isReconnectRenderBall = false;
                this.BillardsGameTableController.isEndGame = false;
                this.BillardsGameTableController.isLeaveTable = false;
                this.BillardsGameTableController._isViewMatch = false;
                this.BillardsGameTableController.listPlayerIdInGame = [];
                this.BillardsGameTable.isBotInTable = message.isBotInTable;
                if (message.listPlayerIdInGame && message.listPlayer) {
                    this.BillardsGameTableController.listPlayerIdInGame = message.listPlayerIdInGame;
                    if (this.BillardsGameTable.isBotInGame(message.listPlayer)) {
                        for (let j = 0; j < message.listPlayer.length; j++) {
                            if (!message.listPlayer[j].isBot) {
                                this.BillardsGameTable.userIdCheck = Number(message.listPlayer[j].playerId);
                                break;
                            }
                        }
                    }
                    var playerIds = message.listPlayerIdInGame;
                    this.setMasterById(message.listPlayerIdInGame[0]);
                    var _tmpPlayerIds = [];
                    for (var i = 0; i < playerIds.length; i++) {
                        _tmpPlayerIds.push(Number(playerIds[i]))
                    }
                    //trong ban choi 11 thi so nguoi choi phai luon bang 2(1vs1)
                    if (_tmpPlayerIds.length == 2) {
                        message.playerids = _tmpPlayerIds;
                        cc.log("Bat dau tran dau 11 ...", message);
                        this.BillardsGameTableController.gameState = BiDaConstant.GAME_STATE.PLAYING;
                        this.BillardsGameTableController.idplayerLuotDanh = Number(message.turnId);
                        if (Number(message.turnId) == this.BillardsGameTableController.myUserId) {
                            this.BillardsGameTable.setTurnBlur(true);
                        } else {
                            this.BillardsGameTable.setTurnBlur(false);
                        }
                        this.BillardsGameTable.reConfigPlayersInGame(message);
                        //nguoi choi luot danh dau tien
                        if (this.checkIdPlaying()) {
                            this.BillardsGameTable.gameBegin(message);
                        } else {
                            cc.log("Bat dau tran dau 11 xem tran ...", message);
                            PanelPlayerView11.config(message);
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
            } else {
                this.BillardsGameTableController.failMatchStart(message);
            }
        }
    }
}