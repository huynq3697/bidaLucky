var Linker = require('Linker');
var BiDaConstant = require('BiDaConstant');
var i18n = require('i18n');
var Utils = require('Utils');
var PanelPlayerViewBiDaPhom = require("PanelPlayerViewBiDaPhom");
var NewAudioManager = require('NewAudioManager');
var BidaPhomGameTable = require('BidaPhomGameTable');
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
    checkBotById: function (idBot) {
        if (this.BillardsGameTable && this.BillardsGameTableController) {
            var listUsers = [];
            if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
                listUsers = Utils.Malicious.flattern([
                    [this.BillardsGameTable.myUserInfo], this.BillardsGameTable.rankingUserInfo
                ]);
            }
            for (var i = 0; i < listUsers.length; i++) {
                var userInfoView = listUsers[i].getComponent("BillardUserView");
                if (userInfoView) {
                    var id = parseInt(userInfoView.getUserID());
                    if (isNaN(id) == false && id != 0) {
                        if (idBot == id) {
                            return userInfoView.getBotType();
                        }
                    }
                }
            }
        }
        return false;
    },
    checkBotAvailable: function () {
        if (this.BillardsGameTable && this.BillardsGameTableController) {
            var listUsers = [];
            if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
                listUsers = Utils.Malicious.flattern([
                    [this.BillardsGameTable.myUserInfo], this.BillardsGameTable.rankingUserInfo
                ]);
            }
            for (var i = 0; i < listUsers.length; i++) {
                var userInfoView = listUsers[i].getComponent("BillardUserView");
                if (userInfoView) {
                    var id = parseInt(userInfoView.getUserID());
                    if (isNaN(id) == false && id != 0) {
                        if (userInfoView.getBotType()) {
                            return true;
                        }
                    }
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
            if (BidaPhomGameTable.isMaxError) {
                this.BillardsGameTable._isSendedBeforeTurn = true;
            }
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
                                            if (cue && cc.isValid(cue)) {
                                                this.BillardsGameTable.setCueOpacity();
                                                if (this.BillardsGameTableController.idplayerLuotDanh != this.BillardsGameTableController.myUserId) {
                                                    var isBot = this.checkBotById(this.BillardsGameTableController.idplayerLuotDanh);
                                                    cue.getComponent("CueObj").lineCheck.opacity = 0;
                                                    if (!isBot) {
                                                        // message.cueP = this.getCueBotOffset(message.cueP);
                                                        //cap nhat vi tri goc quay cua gay
                                                        cue.position = this.BillardsGameTable.bidaDeskNode.convertToNodeSpaceAR(message.cueP);
                                                        this.BillardsGameTable.panelPower.active = true;
                                                        this.BillardsGameTable.panelPower.opacity = 255;
                                                        //
                                                    } else {
                                                        var whiteBall = this.BillardsGameTable.getBallById(0);
                                                        if (whiteBall) {
                                                            var dolonLuc = message.cueP.x;
                                                            var gocGay = message.cueP.y;
                                                            var percent = (dolonLuc) * 100;
                                                            cue.angle = -gocGay;
                                                            cue.getComponent("CueObj").setPercent(percent);
                                                        }
                                                    }
                                                    // cc.log("Goc quay dang duoc cap nhat tu server...", message);
                                                }
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
                                            if (this.BillardsGameTableController.idplayerLuotDanh != this.BillardsGameTableController.myUserId) {
                                                this.BillardsGameTable.blockTouchEvent();
                                            } else {
                                                this.BillardsGameTable.unBlockTouchEvent();
                                            }
                                            this.BillardsGameTable.showDrawrouteWhiteBallAdded(true);

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
                                        } else if (parseInt(touch_id) === BiDaConstant.TABLE_STATUS.BOT_YEU_CAU_GOC_DE_THUC_HIEN_LUOT_DANH_AUTO_NORMAL_TURN) {
                                            // if (this.BillardsGameTableController.myUserId != this.BillardsGameTableController.idplayerLuotDanh) {
                                            this.BillardsGameTableController.guiDataCheckServer({ cardTarget: message.ballX, cueR: BiDaConstant.TABLE_STATUS.BOT_YEU_CAU_GOC_DE_THUC_HIEN_LUOT_DANH_AUTO_NORMAL_TURN });

                                            // } else { }
                                        } else {
                                            if (this.BillardsGameTableController.idplayerLuotDanh != this.BillardsGameTableController.myUserId) {
                                                var cue = this.BillardsGameTable.cue;
                                                if (cue && cc.isValid(cue)) {
                                                    this.BillardsGameTable.setCueOpacity();
                                                    var isBot = this.checkBotById(this.BillardsGameTableController.idplayerLuotDanh);
                                                    if (!isBot) {
                                                        // message.cueP = this.getCueBotOffset(message.cueP);
                                                        //cap nhat vi tri goc quay cua gay
                                                        var deskNode = cue.parent;
                                                        cue.position = deskNode.convertToNodeSpaceAR(message.cueP);
                                                        var p = message.cueP;
                                                        var wlocation = Utils.Malicious.getApointWhenKnowAngleAndRadius(p, -message.cueR, deskNode.width * 2);
                                                        this.BillardsGameTable.setCuePosByTouch(wlocation, false, true, false);
                                                    } else {
                                                        //đối với bot đánh chỉ yêu cầu góc đánh cần thiết cho gậy không cần tọa độ của gậy
                                                        var whiteBall = this.BillardsGameTable.getBallById(0);
                                                        if (whiteBall) {
                                                            var deskNode = cue.parent;
                                                            cue.position = whiteBall.position;
                                                            cue.angle = message.cueR;
                                                            var p = cue.parent.convertToWorldSpaceAR(cue.position);
                                                            var wlocation = Utils.Malicious.getApointWhenKnowAngleAndRadius(p, -message.cueR, deskNode.width * 2);
                                                            this.BillardsGameTable.setCuePosByTouch(wlocation, false, true, false);
                                                        }
                                                    }
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
                                        if (cue && cc.isValid(cue)) {
                                            this.BillardsGameTable.setCueOpacity();
                                            //check player neu la bot thi cap nhat lai goc offset bi trang
                                            // message.cueP = this.getCueBotOffset(message.cueP);
                                            //cap nhat vi tri goc quay cua gay
                                            var isBot = this.checkBotById(this.BillardsGameTableController.idplayerLuotDanh);
                                            if (!isBot) {
                                                cue.position = this.BillardsGameTable.bidaDeskNode.convertToNodeSpaceAR(message.cueP);
                                                var deskNode = cue.parent;
                                                var p = message.cueP;
                                                this.BillardsGameTable.setCuePosByTouch(cc.v2(0, 0), false, true, Utils.Malicious.toPositiveAngle(message.cueR));
                                            } else {
                                                //ở đây sẽ set percent cho
                                                var whiteBall = this.BillardsGameTable.getBallById(0);
                                                if (whiteBall) {
                                                    cue.position = whiteBall.position;
                                                    var deskNode = cue.parent;
                                                    var p = cue.parent.convertToWorldSpaceAR(cue.position);
                                                    var wlocation = Utils.Malicious.getApointWhenKnowAngleAndRadius(p, -message.cueR, deskNode.width * 2);
                                                    this.BillardsGameTable.setCuePosByTouch(wlocation, false, true, false);
                                                }
                                            }

                                        }
                                        break;
                                    case BiDaConstant.TABLE_STATUS.END_DRAGGING_CUE:
                                        var cue = this.BillardsGameTable.cue;
                                        if (cue && cc.isValid(cue)) {
                                            this.BillardsGameTable.setCueOpacity();
                                            // cap nhat vi tri goc quay cua gay
                                            var progress = 1 - message.cueAR / 100;
                                            this.BillardsGameTable.forcePowerSlider.getComponent(cc.Slider).progress = progress;
                                            message.type = 1;
                                            if (this.BillardsGameTableController.idplayerLuotDanh != this.BillardsGameTableController.myUserId) {
                                                message.type = 2;
                                            }
                                            var isBot = this.checkBotById(this.BillardsGameTableController.idplayerLuotDanh);
                                            if (isBot) {
                                                message
                                            }
                                            this.BillardsGameTable.runActionShotBallWhite(message);

                                        }
                                        break;
                                    case BiDaConstant.TABLE_STATUS.SETTING_RESULT_TURN:
                                        cc.log("next turn binh thuong onTurnCardRespone", message);
                                        this.BillardsGameTable.isRepositionWball = false;
                                        message._isNormalNextTurn = true;
                                        this.BillardsGameTableController.guiDataCheckServer();
                                        this.onEndTurnGame(message, BiDaConstant.TABLE_STATUS.SETTING_RESULT_TURN);

                                        break;
                                    case BiDaConstant.TABLE_STATUS.AUTO_NEXT_TURN:
                                        this.BillardsGameTableController.isAutoNextTurn = true;
                                        cc.log("auto next turn onTurnCardRespone", message);
                                        message._isNormalNextTurn = false;
                                        this.BillardsGameTableController.guiDataCheckServer();
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
                            PanelPlayerViewBiDaPhom.onTurnCardRespone(message);
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
                        userInfoView.listCardContainer.removeAllChildren(true);
                        userInfoView.listCardContainer.destroyAllChildren();
                        userInfoView.listCardContainer.opacity = 0;
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
            cc.log("Reseting list bi on hand phom...");
            var listUsers = Utils.Malicious.flattern([
                [this.BillardsGameTable.myUserInfo], this.BillardsGameTable.rankingUserInfo
            ]);
            this.resetCounter(listUsers);
            if (message.playerInTable.length < 2) {
                Utils.Malicious.destroyAllChildrenWithoutName(this.BillardsGameTable.bidaDeskNode, "CueObj");
                this.BillardsGameTable.getRailingBagComponent().removeAllBiInBag();
            }
            this.BillardsGameTable.blockTouchEvent();
        }
    },
    getCueBotOffset: function (cueP) {
        if (this.BillardsGameTable && this.BillardsGameTableController) {
            var player = this.BillardsGameTable.getPlayerByUserId(this.BillardsGameTableController.idplayerLuotDanh);
            if (player) {
                var playerComponentView = player.getComponent("BillardUserView");
                if (playerComponentView) {
                    var isBot = playerComponentView.isBot;
                    if (isBot) {
                        return this.BillardsGameTable.bidaDeskNode.convertToWorldSpaceAR(cueP);
                        //cap nhat lai goc danh cho bot
                        //tim vi tri bi cai thay cho vi tri vi tri bi mac dinh
                        // var whiteBall = this.BillardsGameTable.getBallById(0);
                        // if (whiteBall) {
                        //     var whiteBallJs = whiteBall.getComponent("Ball");
                        //     if (whiteBallJs) {
                        //         return whiteBall.parent.convertToWorldSpaceAR(cueP);
                        //     }
                        // }
                    }
                }
            }
        }
        return cueP;
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
                //end
                this.BillardsGameTableController.showMsgError(message);
                this.BillardsGameTableController._tmpMessageEndTurn = null;
                this.BillardsGameTableController.idplayerLuotDanh = Number(message.turnId);
                this.BillardsGameTable.stopAllTipAnimation();
                // message.dataBall
                var turnHint = BiDaConstant.PSEUDO_CONST.LUOT_DANH_CUA_MINH;
                //set turn hint silent
                this.BillardsGameTable.myListBallOnHand = this.BillardsGameTable.myUserInfo.getComponent("BillardUserView").player_list_ball_tren_tay;
                this.BillardsGameTable.setErrorNumber(message.players);
                if (message.leftTime > 0) {
                    this.BillardsGameTable.setCountDownTimeLeft(message.leftTime);
                }
                if (Number(this.BillardsGameTableController.idplayerLuotDanh) == Number(this.BillardsGameTableController.myUserId)) {
                    this.BillardsGameTableController.countTurn = this.BillardsGameTableController.countTurn + 1;
                    // this.BillardsGameTable.setTurnBlur(true);
                } else {
                    // this.BillardsGameTable.setTurnBlur(false);
                    this.BillardsGameTableController.countTurn = -1;
                    turnHint = BiDaConstant.PSEUDO_CONST.LUOT_DANH_CUA_DOI_THU;
                }
                this.checkCardTarget(message);
                this.BillardsGameTable.setColorBallTag(message);
                message.turnHint = turnHint;
                this.BillardsGameTable._tmpEndTurnDataServerWaiting = message;
                this.BillardsGameTableController._tmpMessageEndTurn = message;
                this.BillardsGameTable._isDataEndTurnGame = true;
            }
        }
    },
    checkCardTarget: function (message) {
        var players = message.players;
        for (let i = 0; i < players.length; i++) {
            var my_player_list_ball_tren_tay = this.BillardsGameTable.myUserInfo.getComponent("BillardUserView").player_list_ball_tren_tay;
            var isArraySameArray = Utils.Malicious.isArraySameArray(my_player_list_ball_tren_tay, players[i].player_list_ball_tren_tay)
            if (Number(this.BillardsGameTableController.myUserId) == Number(players[i].id) && !isArraySameArray) {
                this.BillardsGameTable.myUserInfo.getComponent("BillardUserView").player_list_ball_tren_tay = players[i].player_list_ball_tren_tay;
                //set new card
                var cards = Utils.Malicious.getCards();
                var _ctg = players[i].player_list_ball_tren_tay;
                if (_ctg && Array.isArray(_ctg) && _ctg.length > 0) {
                    var typeCard = cards[_ctg[0]][0];
                    cards[_ctg[0]].splice(0, 1);
                    this.BillardsGameTable.myUserInfo.getComponent("BillardUserView").setTypeCard(typeCard.cardType);
                }
                // end
                var listCards = players[i].player_list_ball_tren_tay;
                var animationFx = this.BillardsGameTable.getStartAnimationCard({ isChiaLaiBai: true, listCard: listCards });
                animationFx.isChiaLaiBai = true;
                if (animationFx) {
                    this.BillardsGameTable.runAnimationChiaBai(animationFx, function (err, chiaBaiNode) {
                        if (!err) {
                            chiaBaiNode.opacity = 0;
                            chiaBaiNode.position = cc.v2(0, 0);
                        }
                    })
                }
                var self = this;
                this.BillardsGameTable.scheduleOnce(function () {
                    self.BillardsGameTable.showMessage(i18n.t("title_error_deal_new_card"));
                }, 2)
            } else {
                //set card
                var listUsers = this.BillardsGameTable.rankingUserInfo;
                for (var j = 0; j < listUsers.length; j++) {
                    var userInfoView = listUsers[j].getComponent("BillardUserView");
                    var isArraySameArray = Utils.Malicious.isArraySameArray(userInfoView.player_list_ball_tren_tay, players[i].player_list_ball_tren_tay)
                    if (userInfoView.getUserID() == Number(players[i].id) && !isArraySameArray) {
                        var cards = Utils.Malicious.getCards();
                        var _ctg = players[i].player_list_ball_tren_tay;
                        if (_ctg && Array.isArray(_ctg) && _ctg.length > 0) {
                            var typeCard = cards[_ctg[0]][0];
                            cards[_ctg[0]].splice(0, 1);
                            userInfoView.setTypeCard(typeCard.cardType);
                        }
                        userInfoView.setCardTarget(players[i].player_list_ball_tren_tay[0]);
                    }
                }
                //end
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
                    // userInfoComponentRanking.setProgressMatch(_tmpRankingUser[j].userPercentMatch);

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
                    // userInfoComponent.setProgressMatch(percentMatch); //0%
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
                        cc.log("dang xem day");
                        this.BillardsGameTableController.listPlayerIdInGame = [];
                        if (message.listPlayer && Array.isArray(message.listPlayer) && message.listPlayer) {
                            var listPlayer = message.listPlayer;
                            for (let k = 0; k < listPlayer.length; k++) {
                                var player = listPlayer[k];
                                var isViewing = Number(player.isObserver) == 0 ? false : true;
                                if (!isViewing) {
                                    this.BillardsGameTableController.listPlayerIdInGame.push(Number(player.userId));
                                }
                            }
                        }
                        //nếu isObserver = 0 -> player này đang chơi, isObserver = 1 thì player này đang xem.
                        // this.getBidaGameTable().btnPlayerViewList.parent.active = true;
                        this.BillardsGameTableController._isViewMatch = true;
                        message.BillardsGameTable = this.BillardsGameTable;
                        break;
                    }
                }
                PanelPlayerViewBiDaPhom.config(message);

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
                        cc.log("join bida phom mode", message);
                        this.BillardsGameTable.addOtherPlayerJoined(message);
                        this.BillardsGameTableController.ListPlayer.push(message.player);
                        var players = this.BillardsGameTable.getAllPlayerInMatch();
                        if (players.all_players_in_table.length == 2) {
                            this.BillardsGameTableController.handleMatchStartGame(BiDaConstant.GAME.CONFIG.THOI_GIAN_CHO_BAT_DAU_TRAN_1_VS_4);
                            // BillardsGameTable.initTableInfo(message);
                            this.BillardsGameTableController.hidePopupInvite();
                            // this.getBidaGameTable().btnPlayerViewList.parent.active = false;
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
                PanelPlayerViewBiDaPhom.config(message);
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
                this.BillardsGameTableController.isReconnectWait = false;
                this.BillardsGameTableController.isReconnectRenderBall = false;
                this.BillardsGameTableController.isEndGame = false;
                this.BillardsGameTableController.isLeaveTable = false;
                this.BillardsGameTableController.idplayerLuotDanh = Number(message.turnId);
                this.BillardsGameTable.userIdCheck = null;
                this.BillardsGameTableController.listPlayerIdInGame = [];
                this.BillardsGameTable.isBotInTable = message.isBotInTable;
                // this.BillardsGameTable.gameBegin(message);
                if (message.listPlayerIdInGame && Array.isArray(message.listPlayerIdInGame) && message.listPlayer && Array.isArray(message.listPlayer)) {
                    this.BillardsGameTableController.listPlayerIdInGame = message.listPlayerIdInGame;
                    //userId check
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
                    cc.log("Bat dau tran dau bida phom ...", message);
                    //trong ban choi phom thi so nguoi choi phai luon lon hon hoac bang 2(giong 1vs4) va be hon hoac bang 5
                    if (_tmpPlayerIds.length >= 2) {
                        message.playerids = _tmpPlayerIds;
                        this.BillardsGameTableController.gameState = BiDaConstant.GAME_STATE.PLAYING;
                        this.BillardsGameTable.reConfigPlayersInGame(message);
                        //nguoi choi luot danh dau tien
                        if (this.checkIdPlaying()) {
                            this.BillardsGameTable.gameBegin(message);
                        } else {
                            PanelPlayerViewBiDaPhom.config(message);
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
