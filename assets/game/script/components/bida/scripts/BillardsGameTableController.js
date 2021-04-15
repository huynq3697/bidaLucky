var Linker = require('Linker');
var BiDaConstant = require('BiDaConstant');
var CommonSend = require('CommonSend');
var BiDaSend = require('BiDaSend');
var Utils = require('Utils');
var Constant = require('Constant');
var SocketConstant = require('SocketConstant');
var NewAudioManager = require('NewAudioManager');
var i18n = require('i18n');
var Otp = require("Otp");
var PanelPlayerView11 = require("PanelPlayerView11");
var PanelPlayerView14 = require("PanelPlayerView14");
var PanelPlayerViewBiDaPhom = require("PanelPlayerViewBiDaPhom");

//
var Bida11Controller = require("Bida11Controller");
var Bida14Controller = require("Bida14Controller");
var BidaPhomController = require("BidaPhomController");
var Bida11GameTable = require('Bida11GameTable');
var Bida14GameTable = require('Bida14GameTable');
var BidaPhomGameTable = require('BidaPhomGameTable');
//
// var Player = require('Player');
cc.Class({
    extends: cc.Component,
    ctor() {
        this.thongtinbanchoi = null;
        this.tableId = 0;
        this.myUserId = null;
        this.dataBallResponse = [];
        this.dataBallReconnect = [];
        this.all_ball_da_an = [];
        this.currentPlayerId = 0;
        // this.all_ball = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
        this.all_ball = Utils.Malicious.createArrayRange(1, 15);
        this.countTurn = -1;
        this._isCountered = false;
        this.timeStart = 3;
        this.labelTimeStart = 4;
        // this._isViewMatch = false;
        this.isFastPlay = 0;
        this.isTotalError = 0;
        this.isMaster = 0;
        this.playTime = 0;
        this.maxError = 0;
        this.isStopPlaying = false;
        this.isReconnectWait = false; // truong hop turn minh danh chua ket thuc thi bi reconnect dan den sai bong
        this.isReconnectRenderBall = false;
        this._tmpMessageEndTurn = null;
        this.ListPlayer = [];
    },
    properties: {},

    onLoad() {
        Linker.BillardsGameTableController = this;
        this.tableInfo = {};
        this.isFastPlay = 0;
        this.isTotalError = 0;
        this.isEndGame = false;
        this._listPlayer = null;
        // this._isViewMatch = false;
        this.addCustomEvent();
        // this.getFriendZone();
    },

    onEnable() {
        // this.myUserId = Number(Linker.userData.userId);
        this.addSocketEvent();
        this.isLeaveTable = false;
    },

    onDisable: function () {
        this.removeSocketEvent();
    },

    loadNewMatch: function () {
        if (Linker.CURRENT_TABLE) {
            cc.log(Linker.CURRENT_TABLE);
            this._isViewMatch = false;
            this.gameState = BiDaConstant.GAME_STATE.WAIT;
            this.tmpMessageLeaveWaiting = [];
            this.tmpMessageLeavePlaying = [];
            if (Linker.CURRENT_TABLE.isCreate) {
                this.onCreateTableResponse(Linker.CURRENT_TABLE);
            } else {
                if (Linker.CURRENT_TABLE.isJoin) {
                    this.onJoinTableResponse(Linker.CURRENT_TABLE);
                } else {
                    if (Linker.CURRENT_TABLE.isReconnect) {

                        this.onReconnectionResponse(Linker.CURRENT_TABLE);
                    }
                }
            }
        }
    },
    getFriendZone: function (cb) {
        //only for test friends
        var _BillardUI = cc.find("Canvas/BillardPortalHandler/BillardUICommonLayer");
        var FriendsZone = null;
        for (let i = 0; i < _BillardUI.children.length; i++) {
            var f = _BillardUI.children[i];
            if (f && f.name == "FriendsZone") {
                if (cc.isValid(f)) {
                    FriendsZone = f;
                }
            }
        }
        if (FriendsZone) {
            FriendsZone.active = false;
            if (cb) {
                cb(null, FriendsZone);
            }
        } else {
            cc.resources.load("friends/prefabs/FriendsZone", cc.Prefab, function (err, prefab) {
                if (!err) {
                    if (cc.isValid(_BillardUI)) {
                        var fzone = cc.instantiate(prefab);
                        fzone.active = false;
                        _BillardUI.addChild(fzone);
                        if (cb) {
                            cb(null, fzone);
                        }
                        // cc.log("Da them friend zone prefab ...");
                    }
                } else {
                    if (cb) {
                        cb(true, null);
                    }
                    cc.log("Khong tim thay friend zone prefab ...", err, prefab);
                }
            });
        }
    },
    addListBallAndGetBallinTable: function (player, view) {
        var listBallOnHand = this.addListBiCanAn(player);
        //hop le
        view.showBallListDisplay(listBallOnHand, BiDaConstant.PSEUDO_CONST.KIEU_BI_CUA_MINH, false, false);
        var ballInTableObj = player.ballInTable;
        var ballInTableId = [];
        for (let i = 0; i < ballInTableObj.length; i++) {
            var num = parseInt(ballInTableObj[i].num);
            if (!isNaN(num)) {
                ballInTableId.push(num);
            }
        }
        return ballInTableId;
    },
    resetListBallOnHand: function () {
        var BillardsGameTable = this.getBidaGameTable();
        if (BillardsGameTable && BillardsGameTable.isValid) {
            var message = {
                status: 1
            };
            message.BillardsGameTable = BillardsGameTable;
            message.BillardsGameTableController = this;
            message.playerInTable = BillardsGameTable.getAllPlayerInMatch().all_players_in_table;

            if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
                Bida11Controller.resetListBallOnHand(message);
            } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
                Bida14Controller.resetListBallOnHand(message);
            } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
                BidaPhomController.resetListBallOnHand(message);
            }
        }
    },
    addListBiCanAn: function (player) {
        var listBallOnHand = [];
        if (player.player_list_ball_tren_tay && Array.isArray(player.player_list_ball_tren_tay)) {
            for (let i = 0; i < player.player_list_ball_tren_tay.length; i++) {
                var idBi = parseInt(player.player_list_ball_tren_tay[i]);
                if (isNaN(idBi) == false) {
                    listBallOnHand.push(idBi);
                }
            }
        }
        return listBallOnHand;
    },
    checkIdPlaying: function (id) {
        if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
            return Bida11Controller.checkIdPlaying(id);
        } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
            return BidaPhomController.checkIdPlaying(id);
        } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
            return Bida14Controller.checkIdPlaying(id);
        }
        return false;
    },
    checkEndGame: function () {
        if (this.isEndGame || this.gameState == BiDaConstant.GAME_STATE.WAIT) {
            //fix lỗi end game vẫn đếm vòng, vẫn chạy next turn
            var controller;
            if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
                controller = Bida11Controller;
            } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
                controller = BidaPhomController;
            } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
                controller = Bida14Controller;
            }
            if (controller && cc.isValid(controller)) {
                controller.resetCounter();
            }
            return true;
        }
        return false;
    },
    runNextTurnWaitingFinish: function () {
        if (this.checkEndGame()) return;
        var BillardsGameTable = this.getBidaGameTable();
        if (BillardsGameTable && BillardsGameTable.isValid) {
            BillardsGameTable.blockTouchEvent();
            var message = this._tmpMessageEndTurn;
            if (message) {
                BillardsGameTable.resetUICue();
                BillardsGameTable._isDataEndTurnGame = false;
                if (Number(this.idplayerLuotDanh) == Number(this.myUserId)) {
                    BillardsGameTable._isSendedBeforeTurn = false;
                    message.turnHint = BiDaConstant.PSEUDO_CONST.LUOT_DANH_CUA_MINH;
                    if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4 || Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
                        if (this.countTurn > 1) {
                            BillardsGameTable.runComboPopup(0.25, {
                                num: this.countTurn - 1
                            }, function (err, data) {
                                if (!err) {
                                    this.runNextTurnEffect(message);
                                }
                            }.bind(this))
                        } else {
                            this.runNextTurnEffect(message);
                        }
                    } else {
                        this.runNextTurnEffect(message);
                    }
                } else {
                    if (!Linker.BiDaOfflineController && this.checkBotById(this.idplayerLuotDanh) && BillardsGameTable.userIdCheck == BillardsGameTable.myUserId) {
                        BillardsGameTable._isSendedBeforeTurn = false;
                    } else {
                        BillardsGameTable._isSendedBeforeTurn = true;
                    }
                    message.turnHint = BiDaConstant.PSEUDO_CONST.LUOT_DANH_CUA_DOI_THU;
                    this.runNextTurnEffect(message);
                }
                // if (Utils.Malicious.isJsonString(message.dataBall) && !this.isRepositionWball && message._isNormalNextTurn) {
                if (Utils.Malicious.isJsonString(message.dataBall) && !this.isRepositionWball) {
                    if (message._isNormalNextTurn) {
                        var serverBall = JSON.parse(message.dataBall);
                        BillardsGameTable.clearAllBallOnTable(message.ballEat);
                        BillardsGameTable.reRenderBallPosition(serverBall, null, message.ballEat);
                        BillardsGameTable.clearAllBallInHole();//BallInHole
                    } else {
                        this.resetReconnect(message);
                    }
                    // cc.error("Synchronous...");
                } else {
                    // cc.error("Không có vị trí data bi đồng bộ, sẽ lệch bi giữa 2 bàn, xảy ra khi auto next turn...", message);
                }
                this.guiDataCheckServer();
                BillardsGameTable.setNextTurn(message);
            } else {
                cc.error("Lỗi, không thể thông báo next turn...", message);
            }
        }
    },
    resetReconnect: function (message) {
        var BillardsGameTable = this.getBidaGameTable();
        if (BillardsGameTable) {
            var dataDefault = null;
            var listBiAn = null;
            if (Utils.Malicious.isJsonString(message.dataBall)) {
                var serverBall = JSON.parse(message.dataBall);
                if (serverBall && serverBall.length > 0 && !serverBall[0].hasOwnProperty("z")) {
                    listBiAn = BillardsGameTable.getListBiAnByBallPos(serverBall);
                    BillardsGameTable.resetReconnect(serverBall);
                } else if (serverBall && serverBall.length > 0 && serverBall[0].hasOwnProperty("z")) {
                    //bong mac dinh khong co vi tri so 0
                    serverBall.push({
                        num: 0,
                        x: Utils.Malicious.randomMinMax(0, 180),
                        y: Utils.Malicious.randomMinMax(0, 180),
                        z: Utils.Malicious.randomMinMax(0, 180),
                    });
                    dataDefault = serverBall;
                    listBiAn = BillardsGameTable.getListBiAnByBallPos(serverBall);
                }
            } else {
                //sẽ là bi mặc định ban đầu
                dataDefault = BillardsGameTable.dataPosGameBegin;
                listBiAn = [];
            }
            if (dataDefault) {
                BillardsGameTable.taoBideBatdauTranDau(dataDefault);
                BillardsGameTable.taoCueTrenBanChoi();
                BillardsGameTable.resetUICue();
            }
            if (listBiAn) {
                BillardsGameTable.resetHardNewBallEatData(listBiAn);
            }
        }
    },
    guiDataCheckServer: function (data) {
        var BillardsGameTable = this.getBidaGameTable();
        if (BillardsGameTable && BillardsGameTable.isValid) {
            if (BillardsGameTable.userIdCheck == BillardsGameTable.myUserId) {
                var dataCheck = BillardsGameTable.getDataToSendServer(true);
                if (dataCheck) {
                    dataCheck.cueR = BiDaConstant.TABLE_STATUS.BOT_YEU_CAU_LAY_TOA_DO_BI_TREN_BAN;
                    if (data) {
                        if (data.cueR) {
                            dataCheck.cueR = data.cueR;
                            dataCheck.ballHit = 1;
                        }
                        if (data.cardTarget) {
                            var cardTarget = parseInt(data.cardTarget);
                            if (isNaN(cardTarget) == false) {
                                var r = BillardsGameTable.predictRotation({ idBi: cardTarget });
                                dataCheck.ballTargetRotation = ((Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) && (isNaN(parseFloat(r)) == false)) ? r : 0;
                            }
                        }
                    }
                    this.onKetQuaVaChamCueCheck(dataCheck);
                }
            } else {
            }
        }
    },
    getBidaGameTable: function () {
        var BillardsGameTable = this.node.getComponent("BillardsGameTable");
        if (BillardsGameTable && BillardsGameTable.isValid) {
            return BillardsGameTable;
        }
        return null;
    },
    runNextTurnEffect: function (message) {
        var BillardsGameTable = this.getBidaGameTable();
        if (BillardsGameTable) {
            BillardsGameTable.stopAllTipAnimation();
            BillardsGameTable.runTurnAnimation(message.turnHint, function (err, data) {
                if (!err) {
                    if (message.hasOwnProperty("players")) {
                        if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1 || Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
                            for (let i = 0; i < message.players.length; i++) {
                                var player = message.players[i];
                                var listBallOnHand = this.addListBiCanAn(player);

                                if (listBallOnHand.length >= 7) {
                                    if (Number(player.id) == Number(this.myUserId)) {
                                        BillardsGameTable.myListBallOnHand = listBallOnHand;
                                        //FIXME: Chỗ này gây ra lỗi 2 bên đều hiển thị bi 8, bỏ chỗ này không có tác dụng, set điều kiện false sinh lỗi khác
                                        BillardsGameTable.showBallListDisplay(listBallOnHand, BiDaConstant.PSEUDO_CONST.KIEU_BI_CUA_MINH, true, true);
                                    } else {
                                        BillardsGameTable.showBallListDisplay(listBallOnHand, BiDaConstant.PSEUDO_CONST.KIEU_BI_CUA_DOI_THU, false, false);
                                    }
                                }
                            }

                        } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
                            var myCardTarget = BillardsGameTable.myUserInfo.getComponent("BillardUserView").player_list_ball_tren_tay;
                            var myCardHint = [];
                            var _hintFail = 7 - myCardTarget.length;
                            for (let i = 0; i < _hintFail; i++) {
                                myCardHint.push(-1);
                            }
                            var _tmpHint = Utils.Malicious.flattern([myCardHint, myCardTarget]);
                            if (_tmpHint) {
                                BillardsGameTable.showBallListDisplay(_tmpHint, BiDaConstant.PSEUDO_CONST.KIEU_BI_CUA_MINH, false, false);
                                BillardsGameTable.myListBallOnHand = myCardTarget;
                                BillardsGameTable.checkRunTipAnimation(true);
                                BillardsGameTable.runTipAnimation();
                            }
                        }
                    }
                    BillardsGameTable.startTimerCounter(Number(this.idplayerLuotDanh));
                }

            }.bind(this));
        }

    },
    conciseListBall: function (listBall) {
        var list = [];
        for (let i = 0; i < listBall.length; i++) {
            var idBi = Number(listBall[i]);
            if (!isNaN(idBi) && idBi != 0) {
                list.push(idBi);
            }
        }
        return list;
    },
    getPlayerWithId: function (id) {
        for (var i = 0; i < this.playerContainer.length; i++) {
            var player = this.playerContainer[i].children[0];
            var playerComponent = player.getComponent("ViewPlayer");
            var userId = playerComponent.getUserID();
            if (userId == id) {
                return player;
            }
        }
        return null;
    },
    setTiSo: function (message) {
        this.txtTiSo.string = "0 - 0";
    },
    addAccRule: function () {
        this.accRuleNode = cc.instantiate(this.accRuleBox);
        this.tableContainer.addChild(this.accRuleNode);
    },
    addCueBox: function () {
        this.cueBoxNode = cc.instantiate(this.cueBox);
        this.tableContainer.addChild(this.cueBoxNode);
    },
    addViewForce: function () {
        //remove before
        for (let i = 0; i < this.node.children.length; i++) {
            if (this.node.children[i].name == "ViewForceOnlyMe") {
                this.node.children[i].removeFromParent(true);
            }
        }
        this.viewForceOnlyMe = cc.instantiate(this.ViewForceOnlyMePrefab);
        this.node.addChild(this.viewForceOnlyMe);
    },
    addGocBanBiTrang: function () {
        this.popupGocBiTrang = cc.instantiate(this.AngleAdjPrefab);
        this.tableContainer.addChild(this.popupGocBiTrang);
        this.popupGocBiTrang.active = false;
    },
    addRailChuaBi: function () {
        this.RailChuaBiContainer.removeAllChildren(true);
        this.HopChuaBi = cc.instantiate(this.RailChuaBiPrefab);
        this.RailChuaBiContainer.addChild(this.HopChuaBi);
    },
    addCustomEvent: function () {
        this.node.on(BiDaConstant.GAME_TABLE_EVENT.CO_BI_ROI_XUONG_LO, this.onSetBiRoiXuongLo, this);
        this.node.on(BiDaConstant.GAME_TABLE_EVENT.BALL_IN_HOLE_FINISH_ANIMATION, this.onRunAnimationBiRoiLo, this);
        this.node.on(BiDaConstant.GAME_TABLE_EVENT.REQUEST_LEAVE_TABLE, this.leaveTableRequest, this);
        this.node.on(BiDaConstant.GAME_TABLE_EVENT.DANG_XAC_LAP_VI_TRI_VA_GOC_QUAY, this.onDangXacLapGocBanBi, this);
        this.node.on(BiDaConstant.GAME_TABLE_EVENT.DANG_XAC_LAP_LUC_BAN_BI, this.onDangXacLapLucBanBi, this);
        this.node.on(BiDaConstant.GAME_TABLE_EVENT.XAC_LAP_VI_TRI_GOC_BAN, this.onDaXacLapGocBanBi, this);
        this.node.on(BiDaConstant.GAME_TABLE_EVENT.GUI_THONG_TIN_LUC_BAN_LEN_CHO_NGUOI_DUNG_KHAC, this.onGuiThongTinLucBanBi, this);
        this.node.on(BiDaConstant.GAME_TABLE_EVENT.CHO_PHEP_GUI_DATA_LEN_SERVER, this.onKetQuaVaChamCue, this);
        this.node.on(BiDaConstant.GAME_TABLE_EVENT.CHO_PHEP_GUI_DATA_LEN_SERVER_CHECK, this.onKetQuaVaChamCueCheck, this);
        this.node.on(BiDaConstant.GAME_TABLE_EVENT.YEU_CAU_DAT_LAI_BI_CAI, this.onYeuCauDatLaiBiCai, this);
        this.node.on(BiDaConstant.GAME_TABLE_EVENT.NGUOI_CHOI_KHAC_DANG_CHON_VI_TRI_DAT_BI_CAI, this.onNguoiChoiDangDatLaiBiCai, this);
        this.node.on(BiDaConstant.POPUP_EVENT.CHAT_PRIVATE.COUNT, this.onCountChat, this);
    },
    onDestroy() {
        NewAudioManager.playAudioSource("leaveboard");
    },

    start() {
        if (this.isReconnect) {
            if (Linker.message_1126) {
                this.onAnBaiResponse(Linker.message_1126);
            }
            if (Linker.message_1125) {
                this.onBocBaiResponse(Linker.message_1125);
            }
            if (Linker.message_1128) {
                this.onGuiBaiResponse(Linker.message_1128);
            }
            if (Linker.message_1127) {
                this.onHaBaiResponse(Linker.message_1127);
            }
            if (Linker.message_1104) {
                this.onTurnCardRespone(Linker.message_1104);
            }
            if (Linker.message_1105) {
                this.onJoinTableResponse(Linker.message_1105);
            }
            if (Linker.message_1106) {
                this.onPlayerJoinedResponse(Linker.message_1106);
            }
            if (Linker.message_1114) {
                this.onGameEndResponse(Linker.message_1114);
            }
            if (Linker.message_1110) {
                this.onPlayerReadyRespone(Linker.message_1110);
            }
        } else {
            Linker.message_1126 = null;
            Linker.message_1125 = null;
            Linker.message_1128 = null;
            Linker.message_1127 = null;
            Linker.message_1104 = null;
            Linker.message_1105 = null;
            Linker.message_1106 = null;
            Linker.message_1114 = null;
            Linker.message_1114 = null;
            Linker.message_1110 = null;
        }


    },
    settingBtnClick() {
        // cc.find("Canvas/Setting").active = true;
    },
    backHandlerBtn: function (event) {
        if (event.keyCode == cc.macro.KEY.back || event.keyCode == cc.macro.KEY.backspace || event.keyCode == cc.macro.KEY.backslash) {
            this.backBtn();
        }
    },
    backBtn() {
        this.leaveTableRequest();
    },
    isValidModePlay: function () {
        if (Linker.BiDaOfflineController) {
            return false
        }
        return true;
    },
    onDangXacLapGocBanBi(e) {
        if (e) {
            var data = {
                cueStatus: BiDaConstant.TABLE_STATUS.MOVING_CUE, //trạng thái di chuyển cây cơ
                ballX: e.positionBall.x,
                ballY: e.positionBall.y,
                cueR: (e.rotation && !isNaN(e.rotation)) ? e.rotation : 0, //cueRotation góc xoay của gậy
                ballEat: (e.ballEat) ? e.ballEat : "#", //chưa có ball trúng hay rơi xuống lỗ
                ballList: (e.ballList) ? e.ballList : "#"
                // ballY: Utils.Type.isNumber(e.positionBall.y) ? e.positionBall.y : null,
                // ballX: Utils.Type.isNumber(e.positionBall.x) ? e.positionBall.x : null
            };
            if (Utils.Malicious.isValidObj(data)) {
                if (this.isValidModePlay()) {
                    if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
                        var send = BiDaSend.turnCardRequest(Linker.ZONE, this.tableId, data);
                        Linker.Socket.send(send);
                    } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1 || Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
                        if (this.idplayerLuotDanh == this.myUserId) {
                            var send = BiDaSend.turnCardRequest(Linker.ZONE, this.tableId, data);
                            Linker.Socket.send(send);
                        }
                    }
                }
            } else {
                //cc.log("Khong the gui duoc data nay, mot hoac nhieu phan tu khong hop le ...", data);
            }

        } else {
            cc.Global.showMessage("BD: Gửi tọa độ và góc quay của cây cơ không hợp lệ ...");
        }
    },
    onDangXacLapLucBanBi(e) {
        if (e) {
            var data = {
                cueStatus: BiDaConstant.TABLE_STATUS.MOVING_CUE, //trạng thái di chuyển cây cơ
                ballX: e.position.x,
                ballY: e.position.y,
                cueR: e.rotation && !isNaN(e.rotation) ? e.rotation : 0, //cueRotation góc xoay của gậy
                ballEat: "#", //chưa có ball trúng hay rơi xuống lỗ
                ballList: "#"
                // ballY: Utils.Type.isNumber(e.positionBall.y) ? e.positionBall.y : null,
                // ballX: Utils.Type.isNumber(e.positionBall.x) ? e.positionBall.x : null
            };
            if (Utils.Malicious.isValidObj(data)) {
                if (this.isValidModePlay()) {
                    if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
                        var send = BiDaSend.turnCardRequest(Linker.ZONE, this.tableId, data);
                        Linker.Socket.send(send);

                    } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1 || Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
                        if (this.idplayerLuotDanh == this.myUserId) {
                            this.hienThiCueBox(true, e, true);
                            this.hienThiAccRuleBox(true, null);
                            //cc.log("BD: gui thông số tọa độ cue khi đang move cue ...", data);
                            var send = BiDaSend.turnCardRequest(Linker.ZONE, this.tableId, data);
                            Linker.Socket.send(send);
                        } else {
                            this.hienThiCueBox(true, e, false);
                            this.hienThiAccRuleBox(false, null);
                            //cc.log("BD: chi update position rotation bida ma khong...", e.rotation, e.position);
                        }
                    }
                }
            } else {
                //cc.log("Khong the gui duoc data nay, mot hoac nhieu phan tu khong hop le ...", data);
            }
        } else {
            cc.Global.showMessage("BD: Gửi tọa độ và góc quay của cây cơ không hợp lệ ...");
        }
    },
    onDaXacLapGocBanBi: function (e) {
        if (e) {
            var data = {
                cueStatus: BiDaConstant.TABLE_STATUS.UPDATE_GOC_BAN_BI, //trạng thái di chuyển cây cơ
                ballX: e.position.x, //vị trí cây cơ
                ballY: e.position.y,
                cueR: e.rotation && !isNaN(e.rotation) ? e.rotation : 0, //cueRotation góc xoay của gậy
                ballEat: "#", //chưa có ball trúng hay rơi xuống lỗ
                ballList: "#"
                // ballY: Utils.Type.isNumber(e.positionBall.y) ? e.positionBall.y : null,
                // ballX: Utils.Type.isNumber(e.positionBall.x) ? e.positionBall.x : null
            };
            if (Utils.Malicious.isValidObj(data)) {
                if (this.isValidModePlay()) {
                    if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
                        var send = BiDaSend.turnCardRequest(Linker.ZONE, this.tableId, data);
                        Linker.Socket.send(send);
                    } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1 || Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
                        if (this.idplayerLuotDanh == this.myUserId) {
                            // this.capNhatGocBan(e);
                            // cc.log("BD: thông số tọa độ cue khi dragging ...", data);
                            var send = BiDaSend.turnCardRequest(Linker.ZONE, this.tableId, data);
                            Linker.Socket.send(send);
                        }
                    }
                }

            } else {
                //cc.log("Khong the gui duoc data nay, mot hoac nhieu phan tu khong hop le ...", data);
            }
        } else {
            cc.Global.showMessage("BD: Gửi tọa độ và góc quay của cây cơ không hợp lệ ...");
        }
    },
    onViewBiDangChiDen: function (event) {
        var frame = this.listBiDangChiDenSpriteFrame[event.idBi];
        if (this.BiDangChiDenSprite.spriteFrame != frame) {
            this.BiDangChiDenSprite.spriteFrame = frame;
        }
    },
    capNhatGocBan: function (data) {
        if (this.cueBoxNode && this.accRuleNode) {
            var cueBoxNodeJS = this.cueBoxNode.getComponent("cueBox");
            if (cueBoxNodeJS) {
                cueBoxNodeJS.capNhatGocBan(data);
            }
            var accRuleNodeJS = this.accRuleNode.getComponent("AccRuleBox");
            if (accRuleNodeJS) {
                accRuleNodeJS.capNhatGocBan(data);
            }
        }
    },
    hienThiCueBox: function (enable, data, permitshot) {
        if (this.cueBoxNode) {
            var cueBoxNodeJS = this.cueBoxNode.getComponent("cueBox");
            if (cueBoxNodeJS) {
                cueBoxNodeJS.configRuleCueBox();
                cueBoxNodeJS.choPhepKeoGayDeBan(permitshot);
                if (enable) {
                    cueBoxNodeJS.showCueBox();
                } else {
                    cueBoxNodeJS.hideCueBox();
                }
            }
        }
    },
    hienThiAccRuleBox: function (enable, data) {
        if (this.accRuleNode) {
            var accRuleBoxJS = this.accRuleNode.getComponent("AccRuleBox");
            if (accRuleBoxJS) {
                accRuleBoxJS.configAccRuleBox();
                if (enable) {
                    accRuleBoxJS.showAccRuleBox();
                } else {
                    accRuleBoxJS.hideAccRuleBox();
                }
            }
        }
    },
    onGuiThongTinLucBanBi: function (e) {
        if (e) {
            var data = {
                cueStatus: BiDaConstant.TABLE_STATUS.END_DRAGGING_CUE, //trạng thái di chuyển cây cơ
                ballX: e.force.x,
                ballY: e.force.y,
                cueR: e.cue && !isNaN(e.cue) ? e.cue : 0, //cueRotation góc xoay của gậy
                ballEat: "#", //chưa có ball trúng hay rơi xuống lỗ
                ballList: (e.ballList) ? e.ballList : "#"
            };
            if (Utils.Malicious.isValidObj(data)) {
                if (this.isValidModePlay()) {
                    if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
                        var send = BiDaSend.turnCardRequest(Linker.ZONE, this.tableId, data);
                        Linker.Socket.send(send);
                    } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1 || Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
                        if (Number(this.idplayerLuotDanh) == Number(this.myUserId)) {
                            var send = BiDaSend.turnCardRequest(Linker.ZONE, this.tableId, data);
                            Linker.Socket.send(send);
                        } else {
                            //cc.log("Khong the gui do khong phai turn cua ban, ...");
                        }
                    }
                }
            } else {
                //cc.log("Khong the gui duoc data nay, mot hoac nhieu phan tu khong hop le ...", data);
            }
        } else {
            cc.Global.showMessage("BD: Gửi tọa độ và góc quay của cây cơ không hợp lệ ...");
        }

    },
    guiDataDatLaiBiTrang: function (e) {
        if (e) {
            var data = {
                cueStatus: BiDaConstant.TABLE_STATUS.MOVING_CUE, //trạng thái di chuyển cây cơ
                ballX: e.pos.x,
                ballY: e.pos.y,
                cueR: BiDaConstant.TABLE_STATUS.REPOSITION_WHITE_BALL, //cueRotation góc xoay của gậy
                ballEat: "#", //chưa có ball trúng hay rơi xuống lỗ
                ballList: e.ballList
            };
            if (Utils.Malicious.isValidObj(data)) {
                if (this.isValidModePlay()) {
                    if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
                        var send = BiDaSend.turnCardRequest(Linker.ZONE, this.tableId, data);
                        Linker.Socket.send(send);
                    } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1 || Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
                        if (Number(this.idplayerLuotDanh) == Number(this.myUserId)) {
                            var send = BiDaSend.turnCardRequest(Linker.ZONE, this.tableId, data);
                            Linker.Socket.send(send);
                        } else {
                            //cc.log("Khong the gui do khong phai turn cua ban, ...");
                        }
                        // this.guiDataCheckServer();
                    }
                }
            } else {
                //cc.log("Khong the gui duoc data nay, mot hoac nhieu phan tu khong hop le ...", data);
            }
        } else {
            cc.Global.showMessage("BD: Gửi tọa độ và góc quay của cây cơ không hợp lệ ...");
        }
    },
    onKetQuaVaChamCueCheck: function (event) {
        if (this.checkEndGame()) return;
        if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM || Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
            if (event) {
                var data = {
                    cueStatus: 5, //trạng thái update ket qua
                    ballX: event.ballX ? event.ballX : 0,
                    ballY: event.ballY ? event.ballY : 0,
                    cueR: event.cueR, //cueRotation góc xoay của gậy
                    ballEat: event.ballEat, //ball trúng hay rơi xuống lỗ
                    ballList: event.ballList,
                    ballHit: event.ballHit,
                    ballTargetRotation: event.ballTargetRotation
                };
                if (Utils.Malicious.isValidObj(data)) {
                    if (this.isValidModePlay()) {
                        cc.log("Gui thong tin len server check, mode 1vs1, game phom...", data);
                        var send = BiDaSend.turnCardRequest(Linker.ZONE, this.tableId, data);
                        Linker.Socket.send(send);
                    }
                }
            }
        }
    },
    onKetQuaVaChamCue(event) {
        if (this.checkEndGame()) return;
        if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1 || Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
            if (event) {
                if (this.idplayerLuotDanh == this.myUserId) {
                    var data = {
                        cueStatus: event.cueStatus, //trạng thái update ket qua
                        ballX: event.ballX,
                        ballY: event.ballY,
                        cueR: event.cueR, //cueRotation góc xoay của gậy
                        ballEat: event.ballEat, //ball trúng hay rơi xuống lỗ
                        ballList: event.ballList,
                        ballHit: event.ballHit,
                        otp: Otp.genOTPCode(),
                    };
                    if (Utils.Malicious.isValidObj(data)) {
                        if (this.isValidModePlay()) {
                            cc.log("Gui thong tin len server, mode 1vs1, game phom...", data);
                            var send = BiDaSend.turnCardRequest(Linker.ZONE, this.tableId, data);
                            Linker.Socket.send(send);
                        }
                    } else {
                        //cc.log("Khong the gui duoc data nay, mot hoac nhieu phan tu khong hop le ...", data);
                    }
                }
            }
        } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
            if (event) {
                var data = {
                    cueStatus: event.cueStatus, //trạng thái update ket qua
                    ballX: event.ballX,
                    ballY: event.ballY,
                    cueR: event.cueR, //cueRotation góc xoay của gậy
                    ballEat: event.ballEat, //ball trúng hay rơi xuống lỗ
                    ballList: event.ballList,
                    ballHit: event.ballHit,
                    otp: Otp.genOTPCode()
                };
                if (Utils.Malicious.isValidObj(data)) {
                    if (this.isValidModePlay()) {
                        var send = BiDaSend.turnCardRequest(Linker.ZONE, this.tableId, data);
                        Linker.Socket.send(send);
                    }
                } else {
                    //cc.log("Khong the gui duoc data nay, mot hoac nhieu phan tu khong hop le ...", data);
                }
            }
        }
    },
    getMainGame: function () {
        var BillardsGameTable = this.getBidaGameTable();
        if (BillardsGameTable) {
            return BillardsGameTable.getMainGame();
        }
        return null;
    },
    onSetBiRoiXuongLo: function (e) {
        var BillardsGameTable = this.getBidaGameTable();
        if (BillardsGameTable) {
            if (e && e.hasOwnProperty("positionBall")) {
                var id_ball_lose = e.idBi;
                var num = parseInt(id_ball_lose);
                if (!isNaN(num)) {
                    if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1 || Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
                        if (this.idplayerLuotDanh == this.myUserId) {
                            var numSharp = "#" + num.toString();
                            var listBall = BillardsGameTable.id_ball_lose;
                            if (listBall.indexOf(numSharp) == -1) {
                                BillardsGameTable.id_ball_lose.push(numSharp);
                            }
                        } else {
                            BillardsGameTable.id_ball_lose = [];
                        }
                        //global check
                        var _numSharp = "#" + num.toString();
                        var _listBall = BillardsGameTable.id_ball_lose_global;
                        if (_listBall.indexOf(_numSharp) == -1) {
                            BillardsGameTable.id_ball_lose_global.push(_numSharp);
                        }
                    } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
                        var numSharp = "#" + num.toString();
                        var listBall = BillardsGameTable.id_ball_lose;
                        if (listBall.indexOf(numSharp) == -1) {
                            BillardsGameTable.id_ball_lose.push(numSharp);
                        }
                    }
                    var nodePosX = e.holeColider.offset.x;
                    var nodePosY = e.holeColider.offset.y;
                    var BallInHole = cc.instantiate(BillardsGameTable.BallInHolePrefab);
                    BallInHole.position = cc.v2(nodePosX, nodePosY);
                    var mainGame = this.getMainGame();
                    if (mainGame) {
                        mainGame.addChild(BallInHole);
                        var BallInHoleJS = BallInHole.getComponent("BallInHole");
                        var distance = cc.v2(0, 0).sub(cc.v2(nodePosX, nodePosY)).mag();
                        var offset = distance - BallInHole.width * 1.5;
                        var angle = Utils.Malicious.getAngleBetWeenTwoPoint(cc.v2(0, 0), cc.v2(nodePosX, nodePosY));
                        var startPoint = mainGame.convertToWorldSpaceAR(e.positionBall);
                        var holeColiderPosition = mainGame.convertToWorldSpaceAR(cc.v2(nodePosX, nodePosY));
                        var wmain = mainGame.parent.convertToWorldSpaceAR(mainGame.position);
                        var disappearPosition = cc.v2(wmain.x + mainGame.width * 0.5, wmain.y + mainGame.height * 0.5);

                        if (BallInHoleJS) {
                            if (!isNaN(angle)) {
                                var dataAnim = {
                                    startPoint: startPoint,
                                    destination: {
                                        holeColiderPosition: holeColiderPosition,
                                        disappearPosition: disappearPosition
                                    },
                                    rotation: angle + 180, //roll nguoc huong
                                    idBi: num,
                                    linearVelocity: e.linearVelocity,
                                    angularVelocity: e.angularVelocity
                                };
                                BallInHoleJS.setIdBi(dataAnim.idBi);
                                BallInHoleJS.runBallInHole(dataAnim);
                            }
                        } else {
                            //cc.log("Bi roi lo nhung khong the thuc hien duoc animation ...", e);
                        }
                    }

                } else {
                    BillardsGameTable.id_ball_lose = [];
                }

            } else {
                BillardsGameTable.id_ball_lose = [];
            }
        }


    },
    onYeuCauGuiToaDoPullForce: function (event) {
        if (event && event.hasOwnProperty("pullforce")) {
            //cc.log("Gui tu client len, ", event.pullforce);
            var data = {
                cueStatus: BiDaConstant.TABLE_STATUS.MOVING_CUE, //trạng thái di chuyển cây cơ
                ballX: event.pullforce.x,
                ballY: event.pullforce.y,
                cueR: BiDaConstant.TABLE_STATUS.WHITE_BALL_ANGLE_ADJUST, //cueRotation góc xoay của gậy
                ballEat: "#", //chưa có ball trúng hay rơi xuống lỗ
                ballList: "#"
            };
            if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1 || Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
                if (this.idplayerLuotDanh == this.myUserId) {
                    if (Utils.Malicious.isValidObj(data)) {
                        if (this.isValidModePlay()) {
                            var send = BiDaSend.turnCardRequest(Linker.ZONE, this.tableId, data);
                            Linker.Socket.send(send);
                        }
                    } else {
                        //cc.log("Khong the gui duoc data nay, mot hoac nhieu phan tu khong hop le ...", data);
                    }
                }
            }
        }
    },
    onYeuCauDatLaiBiCai: function (event) {
        var BillardsGameTable = this.getBidaGameTable();
        if (BillardsGameTable) {
            var startWBall = BillardsGameTable.vitriBiTrang;
            if (Linker.ZONE !== BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
                startWBall = event.position;
            } else {
                //
                var currentPoint = {
                    position: BillardsGameTable.bidaDeskNode.convertToWorldSpaceAR(startWBall),
                    radius: 13
                };
                var ballPositions = []; //[{p,r}]
                var tatcaViTriBiHienTai = BillardsGameTable.getTatCaViTriBiHienTai();
                if (tatcaViTriBiHienTai) {
                    for (let i = 0; i < tatcaViTriBiHienTai.length; i++) {
                        var posObj = {
                            radius: 13,
                            position: cc.v2(0, 0)
                        }
                        posObj.position = BillardsGameTable.bidaDeskNode.convertToWorldSpaceAR(tatcaViTriBiHienTai[i].pos);
                        ballPositions.push(posObj);
                    }
                }
                startWBall = BillardsGameTable.bidaDeskNode.convertToNodeSpaceAR(Utils.Malicious.findNewPositionAroundPoint(currentPoint, ballPositions));
            }
            var data = {
                pos: startWBall,
                anim_id: 0,
                bg_sprite_frame: 0,
                animation_sprite_frame: 0,
                id: 0,
                ballList: "#"
            };
            if (BillardsGameTable && BillardsGameTable.isValid) {
                var mainGame = this.getMainGame();
                if (mainGame) {
                    for (let i = 0; i < mainGame.children.length; i++) {
                        var c = mainGame.children[i];
                        var _ballInHoleJs = c.getComponent("BallInHole");
                        if (_ballInHoleJs && _ballInHoleJs.getIdBi() == data.id) {
                            c.destroy();
                        }
                    }
                }
                if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
                    BillardsGameTable.addOneBiWithData(data);
                    var railCmp = BillardsGameTable.getRailingBagComponent();
                    if (railCmp) {
                        railCmp.removeBallWithId(0);
                    }
                    BillardsGameTable.setNextTurn();
                } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1 || Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
                    BillardsGameTable.addOneBiWithData(data);
                    var railCmp = BillardsGameTable.getRailingBagComponent();
                    if (railCmp) {
                        railCmp.removeBallWithId(0);
                    }
                    var ballEatObj = BillardsGameTable.getBallsInHole();
                    var ballTableListArr = ballEatObj.listBallTableArray;
                    var ballTableListJson = ballEatObj.listBallTableJson;
                    data.ballList = (ballTableListArr.length > 0) ? ballTableListJson : "#";
                    if (event) {
                        if (event._isValidPushWhiteBall) {
                            if (this.idplayerLuotDanh == this.myUserId) {
                                this.guiDataDatLaiBiTrang(data);
                            }
                        }
                    } else {
                        if (this.idplayerLuotDanh == this.myUserId) {
                            this.guiDataDatLaiBiTrang(data);
                        }
                    }

                }
            }
        }
    },
    onNguoiChoiDangDatLaiBiCai: function (e) {
        if (e) {
            var data = {
                cueStatus: BiDaConstant.TABLE_STATUS.MOVING_CUE, //trạng thái di chuyển cây cơ, dung tam trong trang thai
                ballX: e.pos.x,
                ballY: e.pos.y,
                cueR: BiDaConstant.TABLE_STATUS.DRAG_WHITE_BALL_TO_SHOOT, //gui toa do bi ghost khi nguoi dung dang dat lai bi cai
                ballEat: "#", //chưa có ball trúng hay rơi xuống lỗ
                ballList: "#"
            };
            if (Utils.Malicious.isValidObj(data)) {
                if (this.isValidModePlay()) {
                    if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
                        var send = BiDaSend.turnCardRequest(Linker.ZONE, this.tableId, data);
                        Linker.Socket.send(send);
                    } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1 || Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
                        if (this.idplayerLuotDanh == this.myUserId) {
                            var send = BiDaSend.turnCardRequest(Linker.ZONE, this.tableId, data);
                            Linker.Socket.send(send);
                        }
                    }
                }
            } else {
                //cc.log("Khong the gui duoc data nay, mot hoac nhieu phan tu khong hop le ...", data);
            }

        } else {
            cc.Global.showMessage("BD: Gửi tọa độ đặt lại bi trắng không hợp lệ ...");
        }
    },
    removeBallWithId: function (id) {
        if (this.HopChuaBi) {
            var RailChuaBiJS = this.HopChuaBi.getComponent("RailChuaBi");
            if (RailChuaBiJS) {
                RailChuaBiJS.removeBallWithId(id);
            }
        }
    },
    readyBtnClick() {
        var send = CommonSend.readyGameRequest(this.tableInfo.tableId, 1);
        Linker.Socket.send(send);
    },
    startGameBtnClick() {
        var send = CommonSend.startGameRequest(this.tableInfo.tableId, 1);
        Linker.Socket.send(send);
    },
    leaveTableRequest(event) {
        cc.log("dung co dua nha", event)
        Linker.Socket.send(CommonSend.leaveTableRequest(this.tableId));
    },
    moiChoiBtnClick() {
        if (this.gameState == 0) {
            cc.find("Canvas/InviteSendDialog").active = true;
        } else {
            BillardsGameTable.showMessage(i18n.t("Bạn không thể mời khi đang chơi"));
        }
    },
    addSocketEvent() {
        // Linker.Event.addEventListener(Constant.CMD.CHAT, this.onChat, this);
        Linker.Event.addEventListener(1104, this.onTurnCardRespone, this);
        // Linker.Event.addEventListener(1105, this.onJoinTableResponse, this);
        Linker.Event.addEventListener(1100, this.onCreateTableResponse, this);
        Linker.Event.addEventListener(1106, this.onPlayerJoinedResponse, this);
        Linker.Event.addEventListener(1103, this.onLeaveTableRespone, this);
        Linker.Event.addEventListener(1242, this.onTableSettingChangeResponse, this);
        Linker.Event.addEventListener(1114, this.onGameEndResponse, this);
        Linker.Event.addEventListener(1108, this.onMatchStartResponse, this);
        Linker.Event.addEventListener(1110, this.onPlayerReadyRespone, this);
        // Linker.Event.addEventListener(3, this.onReconnectionResponse, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.backHandlerBtn, this);
        Linker.Event.addEventListener(SocketConstant.COMMON.UPDATE_CRASH, this.onUpdateMoney, this);


    },
    removeSocketEvent() {
        // Linker.Event.removeEventListener(Constant.CMD.CHAT, this.onChat, this);
        Linker.Event.removeEventListener(1104, this.onTurnCardRespone, this);
        // Linker.Event.removeEventListener(1105, this.onJoinTableResponse, this);
        Linker.Event.removeEventListener(1100, this.onCreateTableResponse, this);
        Linker.Event.removeEventListener(1106, this.onPlayerJoinedResponse, this);
        Linker.Event.removeEventListener(1103, this.onLeaveTableRespone, this);
        Linker.Event.removeEventListener(1242, this.onTableSettingChangeResponse, this);
        Linker.Event.removeEventListener(1114, this.onGameEndResponse, this);
        Linker.Event.removeEventListener(1108, this.onMatchStartResponse, this);
        Linker.Event.removeEventListener(1110, this.onPlayerReadyRespone, this);
        // Linker.Event.removeEventListener(3, this.onReconnectionResponse, this);
        //cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.backHandlerBtn, this);
        Linker.Event.removeEventListener(SocketConstant.COMMON.UPDATE_CRASH, this.onUpdateMoney, this);

    },
    onGameEndResponse(message) {
        if (message.status == 1) {
            this.isEndGame = true;
            var BillardsGameTable = this.getBidaGameTable();
            if (BillardsGameTable && BillardsGameTable.isValid) {
                //ẩn msg reconnect
                BillardsGameTable.bidaDeskContainer.getChildByName("waitLabel").active = false;

                if (Linker.ZONE != BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
                    BillardsGameTable.init();
                }
                BillardsGameTable.myListBallOnHand = [];
                cc.log(message);
                if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4 || Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
                    cc.log("end game 1vs4 mode", message);
                    var type = 0;
                    var money = 0;
                    this.myUserId = Number(Linker.userData.userId);
                    if (Number(this.myUserId) == Number(message.winPlayerId)) {
                        type = 1;
                        money = "+" + Utils.Malicious.moneyWithFormat(message.winMoney, ".");
                    }
                    var playerDataInGame = [];
                    var getResultMoney = function (playerId) {
                        if (message.playerList && Array.isArray(message.playerList)) {
                            for (let i = 0; i < message.playerList.length; i++) {
                                if (message.playerList[i].userId == playerId) {
                                    return message.playerList[i].resultMoney;
                                }
                            }
                        }
                        return 0;
                    };
                    for (var j = 0; j < message.playerListID.length; j++) {
                        var player = BillardsGameTable.getPlayerByUserId(message.playerListID[j]);
                        if (player && cc.isValid(player)) {
                            var playerComponent = player.getComponent('BillardUserView');
                            if (playerComponent) {
                                playerDataInGame.push({
                                    userAvatarFrame: playerComponent.getUserAvatarFrame(),
                                    userName: playerComponent.getUserName(),
                                    isWin: (message.playerListID[j] == message.winPlayerId) ? true : false,
                                    userId: message.playerListID[j],
                                    resultMoney: getResultMoney(Number(message.playerListID[j]))
                                })
                            }

                        }
                    }
                    message.playerDataInGame = playerDataInGame;
                    if (message.playerListID.indexOf(Number(this.myUserId)) != -1) {
                        message._isMyPlaying = true;
                        BillardsGameTable.runEndGamePoup1vs4(3, message, type, function (err, data) {
                            if (!err) {
                                this.endGameLogic(message);
                            }
                        }.bind(this));
                    } else {
                        message._isMyPlaying = false;
                        BillardsGameTable.runEndGamePoup1vs4(3, message, type, function (err, data) {
                            if (!err) {
                                this.endGameLogic(message);
                            }
                        }.bind(this));
                    }
                    //set money label
                    BillardsGameTable.setMoneyLabel(message.playerList);

                    // lat bai cua doi phuong trong bida phom
                    if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
                        var cards = Utils.Malicious.getCards();
                        for (var j = 0; j < message.playerList.length; j++) {
                            if (Number(this.myUserId) !== Number(message.playerList[j].userId)) {
                                var player = BillardsGameTable.getPlayerByUserId(message.playerList[j].userId);
                                if (player && cc.isValid(player)) {
                                    var playerComponent = player.getComponent('BillardUserView');
                                    if (playerComponent) {
                                        var _typeCard;
                                        var _ctg = message.playerList[j].player_list_ball_tren_tay;
                                        if (_ctg && Array.isArray(_ctg) && _ctg.length > 0) {
                                            var typeCard = cards[_ctg[0]][0];
                                            cards[_ctg[0]].splice(0, 1);
                                            _typeCard = typeCard.cardType;
                                        }
                                        playerComponent.showCardEndGame(message.playerList[j].player_list_ball_tren_tay, _typeCard);
                                    }
                                }
                            }
                            if (Number(message.playerList[j].userId) == Number(message.lastTurn) && Number(message.ballErrorId) == BiDaConstant.GAME.STATUS.BALL_ERROR.BI_ROI_XUONG_LO_KHONG_PHAI_CUA_MINH) {
                                if (Number(this.myUserId) == Number(message.playerList[j].userId) && Number(this.myUserId) !== Number(message.winPlayerId)) {
                                    cc.Global.showMessage(i18n.t("title_error_eat_wrong_ball"));
                                }
                            }
                        }
                        BidaPhomGameTable.isMaxError = false;
                    }
                } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
                    //data player
                    var playerData = {
                        players: [BillardsGameTable.myUserInfo, BillardsGameTable.otherUserInfo],
                        money: 0,
                        winMoney: message.winMoney,
                        loseMoney: message.loseMoney,
                        winPlayerId: message.winPlayerId
                    };
                    //win player
                    var type = 0;
                    var money = 0;
                    if (Number(this.myUserId) == Number(message.winPlayerId)) {
                        type = 1;
                        money = "+" + Utils.Malicious.moneyWithFormat(message.winMoney, ".");
                    } else {
                        money = "-" + Utils.Malicious.moneyWithFormat(Math.abs(message.loseMoney), ".");
                    }
                    playerData.money = money;
                    BillardsGameTable.runEndGamePoup(3, playerData, type, function (err, data) {
                        if (!err) {
                            this.endGameLogic(message);
                        } else {
                            // cc.error("runEndGamePopup 2 Error" + err);
                        }
                    }.bind(this));
                    BillardsGameTable.setTurnBlur(null);
                    //set money label
                    BillardsGameTable.setMoneyLabel(message.playerList);

                }
                //set message bong 8 roi
                for (var i = 0; i < message.playerList.length; i++) {
                    if (Number(message.ballErrorId) == BiDaConstant.GAME.STATUS.BALL_ERROR.BI_SO_8_ROI_XUONG_LO_NHUNG_KHONG_HOP_LE) {
                        if (Number(this.myUserId) == Number(message.playerList[i].userId) && Number(message.ballErrorId) == Number(message.playerList[i].ballErrorId)) {
                            cc.Global.showMessage(i18n.t("title_error_eat_8ball_2"));
                        }
                    }
                }
                // nohu
                if (this.myUserId == Number(message.userIdNohu)) {
                    BillardsGameTable.addCofferEffect(message.moneyNohu);
                }
            }
        } else {
            var customEvent = new cc.Event.EventCustom(BiDaConstant.GAME_LOBBY_EVENT.REQUEST_LOBBY_FOR_ZONE_ID_TYPE, true);
            customEvent.ZONE = Linker.ZONE;
            customEvent.currentButton = null;
            this.node.dispatchEvent(customEvent);
        }
    },

    endGameLogic: function (message) {
        cc.log("END_GAME", message);
        this.gameState = BiDaConstant.GAME_STATE.WAIT;
        this._isViewMatch = false;
        var BillardsGameTable = this.getBidaGameTable();
        if (BillardsGameTable && BillardsGameTable.isValid) {
            //reset bàn cho ván mới, xóa bi trên bàn, trên khay chứa, ẩn list bi trên tay của các player, ẩn lá bài, ...
            this.isEndGame = false;
            //init sau
            if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
                BillardsGameTable.init();
            }
            var listIdOpponentOut = [];
            var listPlayerEndGame = message.playerList;
            if (listPlayerEndGame && Array.isArray(listPlayerEndGame) && listPlayerEndGame.length > 0) {
                for (let k = 0; k < listPlayerEndGame.length; k++) {
                    var player = listPlayerEndGame[k];
                    if (player.isOut) {
                        if (Number(player.userId) == Number(Linker.userData.userId)) {
                            this.isLeaveTable = true;
                        } else {
                            var dataLeave = {
                                cancelStatus: 0,
                                messageId: 1103,
                                newOwner: 0,
                                status: 1,
                                userId: Number(player.userId)
                            }
                            listIdOpponentOut.push(dataLeave);
                        }
                    }
                }
            }

            if (this.isLeaveTable) {
                BillardsGameTable.panelUI.getChildByName("BillardChatPrivate").getComponent("BidaChatPrivate").clearContentChat();
                Linker.Socket.send(CommonSend.leaveTableRequest(this.tableId));
                //serve không cho thoát time out vẫn thoát bình thường
                var customEvent = new cc.Event.EventCustom(BiDaConstant.GAME_LOBBY_EVENT.REQUEST_LOBBY_FOR_ZONE_ID_TYPE, true);
                customEvent.ZONE = Linker.ZONE;
                customEvent.currentButton = null;
                this.node.dispatchEvent(customEvent);
                BillardsGameTable.hideTimeCountDownBallError();
                BillardsGameTable.hidePopupEndGame();
                this.ListPlayer = [];
                cc.Global.showMessage(i18n.t("Bạn vừa rời phòng"));

            } else {
                cc.log("this.handleMatchStartGame();end game", message);
                cc.log("this.tmpMessageLeaveWaiting", this.tmpMessageLeaveWaiting);
                cc.log("this.tmpMessageLeavePlaying", this.tmpMessageLeavePlaying);
                if (this.tmpMessageLeavePlaying && Array.isArray(this.tmpMessageLeavePlaying) && this.tmpMessageLeavePlaying.length > 0) {
                    this.leavePlayerBeforeEndGamePlaying(this.tmpMessageLeavePlaying);
                } else if (this.tmpMessageLeaveWaiting && Array.isArray(this.tmpMessageLeaveWaiting) && this.tmpMessageLeaveWaiting.length > 0) {
                    this.leavePlayerBeforeEndGameWait(this.tmpMessageLeaveWaiting);
                }
                this.tmpMessageLeavePlaying = [];
                this.tmpMessageLeaveWaiting = [];
                //isOut
                if (listIdOpponentOut.length > 0) {
                    this.leavePlayerBeforeEndGameWait(listIdOpponentOut);
                }

                message.BillardsGameTable = BillardsGameTable;
                message.BillardsGameTableController = this;

                if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
                    //xem truong hop minh ngoi mot minh hay ngoi voi ai nua
                    this.checkShowInviteButton();
                    var players = BillardsGameTable.getAllPlayerInMatch();
                    if (players.all_players_in_table.length >= 2) {
                        //truong hop doi thu roi di hoac nguoi choi roi phong ma list nguoi choi dang xem >=1
                        //khong xem thi moi dem nguoc
                        PanelPlayerView11.config(message);
                        PanelPlayerView11.removeFootPrint();
                        if (this._isViewMatch == false) {
                            BillardsGameTable.hideTimeCountDownBallError();
                            this.handleMatchStartGame();
                        } else {
                            PanelPlayerView11.addFootPrint();
                        }
                    } else {
                        BillardsGameTable.hideTimeCountDownBallError();
                    }
                } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
                    //xem truong hop minh ngoi mot minh hay ngoi voi ai nua
                    this.checkShowInviteButton();
                    var players = BillardsGameTable.getAllPlayerInMatch();
                    if (players.all_players_in_table.length >= 2) {
                        //truong hop doi thu roi di hoac nguoi choi roi phong ma list nguoi choi dang xem >=1
                        //khong xem thi moi dem nguoc
                        PanelPlayerView14.config(message);
                        PanelPlayerView14.removeFootPrint();
                        if (this._isViewMatch == false) {
                            BillardsGameTable.hideTimeCountDownBallError();
                            this.handleMatchStartGame(BiDaConstant.GAME.CONFIG.THOI_GIAN_CHO_BAT_DAU_TRAN_1_VS_4);
                        } else {
                            PanelPlayerView14.addFootPrint();
                        }
                    } else {
                        BillardsGameTable.hideTimeCountDownBallError();
                    }
                } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
                    //xem truong hop minh ngoi mot minh hay ngoi voi ai nua
                    this.checkShowInviteButton();
                    var players = BillardsGameTable.getAllPlayerInMatch();
                    BillardsGameTable.hideTimeCountDownBallError();
                    //BillardsGameTable.panelUI.getChildByName("BillardChatPrivate").getComponent("BidaChatPrivate").clearContentChat();
                    //xem so nguoi choi con lai trong ban neu hop le (>= 2 nguoi) thi moi bat dau, khong thi thoi
                    var panelUserPhom = this.node.getChildByName("PanelUserContainer").getChildByName("PanelUsersBidaPhom");
                    if (players.all_players_in_table.length >= 2) {
                        PanelPlayerViewBiDaPhom.config(message);
                        PanelPlayerViewBiDaPhom.removeFootPrint();
                        if (this._isViewMatch == false) {
                            BillardsGameTable.hideTimeCountDownBallError();
                            //An quan bai khi sang van moi
                            panelUserPhom.getChildByName("User1").getComponent("BillardUserView").hideListCardContainer();
                            var listPlayer = panelUserPhom.getChildByName("User2").getChildByName("listPlayingUsers");
                            var length = listPlayer.childrenCount;
                            for (var i = 0; i < length; ++i) {
                                if (listPlayer.getChildByName("player" + (i + 1)))
                                    listPlayer.getChildByName("player" + (i + 1)).getComponent("BillardUserView").hideListCardContainer();
                            }
                            this.handleMatchStartGame(BiDaConstant.GAME.CONFIG.THOI_GIAN_CHO_BAT_DAU_TRAN_1_VS_4);

                            //set opacity
                            panelUserPhom.getChildByName("User1").getComponent("BillardUserView").setOpacityPlayer(255);
                        } else {
                            PanelPlayerViewBiDaPhom.addFootPrint();
                            panelUserPhom.getChildByName("User1").getComponent("BillardUserView").setOpacityPlayer(150);
                        }
                    } else {
                        BillardsGameTable.hideTimeCountDownBallError();
                        PanelPlayerViewBiDaPhom.config(message);
                        PanelPlayerViewBiDaPhom.removeFootPrint();
                    }
                }
            }
            //reset list bi tren tay
            this.resetListBallOnHand();
            switch (this.gameState) {
                case BiDaConstant.GAME_STATE.WAIT: {
                    break;
                }
                case BiDaConstant.GAME_STATE.PLAYING: {

                    break;
                }
            }
        }
    },
    checkShowInviteButton: function () {
        //get tat ca cac nguoi dang choi, nguoi dang xem
        var BillardsGameTable = this.getBidaGameTable();
        if (BillardsGameTable && BillardsGameTable.isValid) {
            var players = BillardsGameTable.getAllPlayerInMatch();
            var tatCaNguoiChoiTrongBan = players.all_players_in_table;
            if (tatCaNguoiChoiTrongBan && Array.isArray(tatCaNguoiChoiTrongBan) && tatCaNguoiChoiTrongBan.length > 1) {
                //đầu tiên sắp xếp theo người đầu tiên bên trái là mình
                //các player khác sẽ được xếp thứ tự liền sau
                //nếu ở mode 11 thì sẽ ẩn button mời đi, còn đối với mode phỏm, 14 thì xem số lượng bao nhiêu người đang có mới hiện button mời chơi
                var _myInfoData = [];
                var _othersInfoData = [];
                var _chuBanInfoData = [];
                var _myInfoIdCheck = [];
                var _othersIdCheck = [];
                var _allPlayerIdCheck = [];
                for (var i = 0; i < tatCaNguoiChoiTrongBan.length; i++) {
                    var id = parseInt(tatCaNguoiChoiTrongBan[i].userID);
                    if (isNaN(id) == false && id != 0) {
                        if (id == Number(Linker.userData.userId)) {
                            if (_myInfoIdCheck.indexOf(id) == -1) {
                                _myInfoIdCheck.push(id);
                                tatCaNguoiChoiTrongBan[i].isMaster = this.isMaster;
                                _myInfoData.push(tatCaNguoiChoiTrongBan[i]);
                            }
                        } else {
                            _allPlayerIdCheck = Utils.Malicious.flattern([_othersIdCheck, _myInfoIdCheck]);
                            if (_allPlayerIdCheck.indexOf(id) == -1) {
                                _othersIdCheck.push(id);
                                if (tatCaNguoiChoiTrongBan[i].isMaster) {
                                    _chuBanInfoData.push(tatCaNguoiChoiTrongBan[i]);
                                } else {
                                    _othersInfoData.push(tatCaNguoiChoiTrongBan[i]);
                                }
                            }
                        }
                    }
                }
                var oponentData = Utils.Malicious.flattern([_chuBanInfoData, _othersInfoData]);
                if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
                    //ưu tiên đánh với chủ bàn trước nếu có
                    Bida11GameTable.setMyUserData(_myInfoData);
                    Bida11GameTable.setOthersUserData(oponentData);
                    // if (this.ListPlayer.length < 2 &&
                    //     (Object.values(this.ListPlayer[0]).includes(this.myUserId) || Object.values(this.ListPlayer[0]).includes(this.myUserId.toString()))) {
                    //     var otherPlayer = new Player();
                    //     otherPlayer.userId = oponentData[0].userId;
                    //     otherPlayer.userMoney = oponentData[0].userMoney;
                    //     otherPlayer.viewName = oponentData[0].userName;
                    //     this.ListPlayer.push(otherPlayer);
                    // }
                    if (this.isMaster && this.gameState == BiDaConstant.GAME_STATE.WAIT) {
                        if (Utils.Malicious.flattern([_myInfoData, oponentData]).length == 1) {
                            BillardsGameTable.panelUsers.getComponent("PanelUsers1Vs1").showBtnInvite();
                        }
                    }
                } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
                    Bida14GameTable.setMyUserData(_myInfoData);
                    Bida14GameTable.setOthersUserData(oponentData);
                    // Bida14GameTable.hideAllMyBallistDisplay(data);
                    if (this.isMaster && this.gameState == BiDaConstant.GAME_STATE.WAIT) {
                        BillardsGameTable.panelUsers.getComponent("PanelUsers1Vs4").showBtnInvite();

                    }
                } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
                    BidaPhomGameTable.setMyUserData(_myInfoData);
                    BidaPhomGameTable.setOthersUserData(oponentData);
                    if (this.isMaster && this.gameState == BiDaConstant.GAME_STATE.WAIT) {
                        BillardsGameTable.panelUsers.getComponent("PanelUsersBidaPhom").showBtnInvite();
                    }
                }

            } else {
                this.isMaster = 1;
                if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
                    BillardsGameTable.panelUsers.getComponent("PanelUsers1Vs1").showBtnInvite();
                } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
                    BillardsGameTable.panelUsers.getComponent("PanelUsers1Vs4").showBtnInvite();
                } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
                    BillardsGameTable.panelUsers.getComponent("PanelUsersBidaPhom").showBtnInvite();
                }
            }
        }
    },
    removePlayerLeave: function (message) {
        if (message && message.status == 1 && message.player) {
            var idLeave = parseInt(message.player.userId);
            if (isNaN(idLeave) == false) {
                this.removePlayerWaitLeave(idLeave);
                this.removePlayerPlayingLeave(idLeave);
            }
        }
    },
    removePlayerWaitLeave: function (id) {
        cc.log("tmp waiting leaving", this.tmpMessageLeaveWaiting);
        if (this.tmpMessageLeaveWaiting && Array.isArray(this.tmpMessageLeaveWaiting) && this.tmpMessageLeaveWaiting.length > 0) {
            for (let i = 0; i < this.tmpMessageLeaveWaiting.length; i++) {
                if (Number(this.tmpMessageLeaveWaiting[i].userId) == id) {
                    this.tmpMessageLeaveWaiting.splice(i, 1);
                }
            }
        }
    },
    removePlayerPlayingLeave: function (id) {
        cc.log("tmp playing leaving", this.tmpMessageLeaveWaiting);
        if (this.tmpMessageLeavePlaying && Array.isArray(this.tmpMessageLeavePlaying) && this.tmpMessageLeavePlaying.length > 0) {
            for (let i = 0; i < this.tmpMessageLeavePlaying.length; i++) {
                if (Number(this.tmpMessageLeavePlaying[i].userId) == id) {
                    this.tmpMessageLeavePlaying.splice(i, 1);
                }
            }
        }
    },
    onPlayerJoinedResponse(message) {
        if (message.status == 1) {
            cc.log("Co nguoi vao ban")
            var BillardsGameTable = this.getBidaGameTable();
            if (BillardsGameTable && BillardsGameTable.isValid) {
                if (this.node.active == false) {
                    this.node.dispatchEvent(new cc.Event.EventCustom(BiDaConstant.GAME_COMMONS_EVENT.SHOW_GAME_LAYER, true));
                }
                message.BillardsGameTable = BillardsGameTable;
                message.BillardsGameTableController = this;
                this.removePlayerLeave(message);
                if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
                    Bida11Controller.onPlayerJoinedResponse(message);
                } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
                    Bida14Controller.onPlayerJoinedResponse(message);
                } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
                    BidaPhomController.onPlayerJoinedResponse(message);
                }
                // NewAudioManager.playClick("joinboard");
                // switch (this.gameState) {
                //     case BiDaConstant.GAME_STATE.WAIT: {
                //         if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
                //             cc.log("join 1vs4 mode", message);
                //             BillardsGameTable.addOtherPlayerJoined(message);
                //             this.handleMatchStartGame(BiDaConstant.GAME.CONFIG.THOI_GIAN_CHO_BAT_DAU_TRAN_1_VS_4);
                //             // BillardsGameTable.initTableInfo(message);
                //         } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
                //             cc.log("join 1vs1 mode", message);
                //             BillardsGameTable.addOtherPlayerJoined(message);
                //             this.handleMatchStartGame();
                //         } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
                //             cc.log("join bida phỏm mode", message);
                //             BillardsGameTable.addOtherPlayerJoined(message);
                //             this.handleMatchStartGame(BiDaConstant.GAME.CONFIG.THOI_GIAN_CHO_BAT_DAU_TRAN_1_VS_4);
                //         }
                //         this.hidePopupInvite();
                //         // this.getBidaGameTable().btnPlayerViewList.parent.active = false;
                //         break;
                //     }
                //     case BiDaConstant.GAME_STATE.PLAYING: {
                //         // this.getBidaGameTable().btnPlayerViewList.parent.active = true;
                //         if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
                //             message.BillardsGameTable = BillardsGameTable;
                //             PanelPlayerView14.config(message);
                //         } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
                //             message.BillardsGameTable = BillardsGameTable;
                //             PanelPlayerView11.config(message);
                //         } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
                //             cc.log("Đang pending logic bida phỏm...");
                //             message.BillardsGameTable = BillardsGameTable;
                //             PanelPlayerView14.config(message);
                //         }
                //         break;
                //     }
                //     default:
                //         break;
                // }

            }
        } else {
            var customEvent = new cc.Event.EventCustom(BiDaConstant.GAME_LOBBY_EVENT.REQUEST_LOBBY_FOR_ZONE_ID_TYPE, true);
            customEvent.ZONE = Linker.ZONE;
            customEvent.currentButton = null;
            this.node.dispatchEvent(customEvent);

        }
    },
    checkPlayerInfo: function (player) {
        if (player.hasOwnProperty("userId")) {
            if (Utils.Malicious.getLengthObj(this.tableInfo) > 0) {
                var existedUser = false;
                for (let i = 0; i < this.tableInfo.listPlayer.length; i++) {
                    if (this.tableInfo.listPlayer[i].userId == player.userId) {
                        existedUser = true;
                        break;
                    }
                }
                if (!existedUser) {
                    this.tableInfo.listPlayer.push(player);
                }
            }
        }
        return this.tableInfo.listPlayer;
    },

    onReconnectionResponse: function (message) {
        cc.log("BIDA_onReconnectionResponse: ", message);

        Linker.valueBet = message.minMoney;

        if (message.status == 1) {
            this.isReconnect = true;
            this.gameState = (message.hasOwnProperty("isPlaying") && Number(message.isPlaying) == 0) ? BiDaConstant.GAME_STATE.WAIT : BiDaConstant.GAME_STATE.PLAYING;
            this.tableId = message.tableId;
            var players = message.listPlayer; //tất cả người chơi bao gồm cả người xem và người đang chơi
            //cần tách ra người xem và người chơi

            message.listPlayerIdInGame = [];
            this.listPlayerIdInGame = [];
            if (!this.myUserId) {
                this.myUserId = Number(Linker.userData.userId);
            }
            var listArrNguoiChoi = [];
            var listArrNguoiXem = [];
            for (let i = 0; i < players.length; i++) {
                if (this.myUserId == players[i].userId && players[i].isMaster == 1) {
                    this.isMaster = 1;
                }
                if (Number(players[i].isObserver) == 0) {
                    message.listPlayerIdInGame.push(Number(players[i].userId));
                    listArrNguoiChoi.push(players[i]);
                } else {
                    listArrNguoiXem.push(players[i]);
                }
            }
            this.listPlayerIdInGame = message.listPlayerIdInGame;
            message.listPlayer = listArrNguoiChoi;
            message.listPlayerView = listArrNguoiXem;
            // NewAudioManager.playAudioSource("joinboard");
            switch (this.gameState) {
                case BiDaConstant.GAME_STATE.WAIT: {
                    //gui setting lai nguoi choi list
                    this.handleMatchStartGame();
                    this.createTableGame(message);
                    break;
                }
                case BiDaConstant.GAME_STATE.PLAYING: {
                    this.createTableGame(message);
                    break;
                }
                default:
                    break;

            }
        }
    },
    setPlayersPlaying: function (players) {
        cc.log(players);
        this.resetPlayerContainer();
        this.listPlayer = players;
        for (var i = 0; i < players.length; i++) {
            var ctner = this.playerContainer[0];
            var player = cc.instantiate(this.viewPlayerLeftPrefab);
            var detailCtner = this.ContainerDetailPlayer[0];
            var detailPlayer = cc.instantiate(this.DetailPlayerPrefab1);
            if (players[i].id != this.myUserId) {
                ctner = this.playerContainer[1];
                detailCtner = this.ContainerDetailPlayer[1];
                player = cc.instantiate(this.viewPlayerRightPrefab);
                detailPlayer = cc.instantiate(this.DetailPlayerPrefab2);
                ctner.addChild(player);
            } else {
                ctner.addChild(player);
            }

            var playerJS = player.getComponent("ViewPlayer");
            if (playerJS) {
                playerJS.init(players[i]);
            }

            var detailPlayerJS = detailPlayer.getComponent("DetailPlayer");
            if (detailPlayerJS) {
                detailPlayerJS.init(players[i]);
            }
            detailCtner.addChild(detailPlayer);
        }
    },

    addOtherPlayer: function (playerinf) {
        // var player = cc.instantiate(this.playerBiDaPrefab);
        // var playerJS = player.getComponent("PlayerBiDaInfo");

        var player = cc.instantiate(this.viewPlayerRightPrefab);

        var detailPlayer = cc.instantiate(this.DetailPlayerPrefab2);

        var playerJS = player.getComponent("ViewPlayer");
        if (playerJS) {
            playerJS.init(playerinf)
        }
        this.playerContainer[this.playerContainer.length - 1].addChild(player);

        var detailPlayerJS = detailPlayer.getComponent("DetailPlayer");
        if (detailPlayerJS) {
            detailPlayerJS.init(playerinf)
        }
        this.ContainerDetailPlayer[this.ContainerDetailPlayer.length - 1].addChild(detailPlayer);
    },
    resetDetailPlayerContainer: function () {
        for (var i = 0; i < this.ContainerDetailPlayer.length; i++) {
            this.ContainerDetailPlayer[i].removeAllChildren(true);
        }
    },
    resetPlayerContainer: function () {
        for (var i = 0; i < this.playerContainer.length; i++) {
            this.playerContainer[i].removeAllChildren(true);
        }
    },
    resetUserPosition: function (message) {
        var BillardsGameTable = this.getBidaGameTable();
        if (BillardsGameTable && BillardsGameTable.isValid) {
            Bida11GameTable.hideAllOtherBallistDisplay({
                BillardsGameTable: BillardsGameTable
            });
            var userInfoComponentOther = BillardsGameTable.otherUserInfo.getComponent("BillardUserView");
            if (userInfoComponentOther) {
                userInfoComponentOther.hidePlayer();
                userInfoComponentOther.setUserName("Player" + 2);
                userInfoComponentOther.setUserMoney(0);
                userInfoComponentOther.setUserLevel(0);
                userInfoComponentOther.setAvatarAsSpriteFrame(BillardsGameTable.getFrameById(BillardsGameTable.avatarAtlas, 0));
                userInfoComponentOther.setFlagAsSpriteFrame("w");
                userInfoComponentOther.setUserID(0);
                userInfoComponentOther.setUserPos(2);
            }
        }
    },
    resetUserPosition1vs1: function (message) {
        var BillardsGameTable = this.getBidaGameTable();
        if (BillardsGameTable && BillardsGameTable.isValid) {
            //an hien thi cac bi dang co cua doi thu
            var userLeave = BillardsGameTable.getPlayerByUserId(Number(message.userId));
            if (userLeave) {
                userLeave.opacity = 0;
                userLeave.active = false;
                var userLeaveCmp = userLeave.getComponent("BillardUserView");
                if (userLeaveCmp) {
                    userLeaveCmp.setUserName("");
                    userLeaveCmp.setUserMoney(0);
                    userLeaveCmp.setUserLevel(0);
                    userLeaveCmp.setAvatarAsSpriteFrame(BillardsGameTable.getFrameById(BillardsGameTable.avatarAtlas, 0));
                    userLeaveCmp.setUserID(0);
                    userLeaveCmp.setUserPos(1);
                    userLeaveCmp.setWaitingStatus(true);
                }
            }
            //do thong tin nguoi choi da roi ban roi nhung vi tri thi van khong thay doi nen phai load lai data
            BillardsGameTable.resortPositionPlayersRanking();
        }
    },
    resetUserPosition1vs4: function (message) {
        var BillardsGameTable = this.getBidaGameTable();
        if (BillardsGameTable && BillardsGameTable.isValid) {
            //an hien thi cac bi dang co cua doi thu
            var userLeave = BillardsGameTable.getUserRankingById(Number(message.userId));
            if (userLeave) {
                userLeave.opacity = 0;
                userLeave.active = false;
                var userLeaveCmp = userLeave.getComponent("BillardUserView");
                if (userLeaveCmp) {
                    userLeaveCmp.setUserName("");
                    userLeaveCmp.setUserMoney(0);
                    userLeaveCmp.setUserLevel(0);
                    userLeaveCmp.setAvatarAsSpriteFrame(BillardsGameTable.getFrameById(BillardsGameTable.avatarAtlas, 0));
                    userLeaveCmp.setUserID(0);
                    userLeaveCmp.setUserPos(1);
                    userLeaveCmp.setWaitingStatus(true);
                }
            }
            //do thong tin nguoi choi da roi ban roi nhung vi tri thi van khong thay doi nen phai load lai data
            BillardsGameTable.resortPositionPlayersRanking();
        }

    },
    setGameState: function (message) {
        switch (this.gameState) {
            case BiDaConstant.GAME_STATE.WAIT: {
                //người chơi đang ở trạng thái chờ
                if (Linker.CURRENT_TABLE) {
                    Linker.CURRENT_TABLE.tableId = this.tableId;
                } else {
                    Linker.CURRENT_TABLE = {
                        tableId: this.tableId
                    };
                }
                break;
            }
            case BiDaConstant.GAME_STATE.PLAYING: {
                // người chơi đang ở trạng thái chơi
                if (Linker.CURRENT_TABLE) {
                    Linker.CURRENT_TABLE.tableId = this.tableId;
                } else {
                    Linker.CURRENT_TABLE = {
                        tableId: this.tableId
                    };
                }
                break;
            }
            default:
                if (Linker.CURRENT_TABLE) {
                    Linker.CURRENT_TABLE.tableId = this.tableId;
                } else {
                    Linker.CURRENT_TABLE = {
                        tableId: this.tableId
                    };
                }
                this.leaveTableRequest();
                break;
        }
    },
    onPlayerReadyRespone: function (message) {
        if (message && Number(message.status) == 1) {
            var BillardsGameTable = this.getBidaGameTable();
            if (BillardsGameTable) {
                if (message.userId) {
                    var userId = parseInt(message.userId);
                    if (isNaN(userId) == false) {
                        var isReady = Number(message.isReady);
                        isReady = (isReady == 1) ? true : false;
                        var players = BillardsGameTable.getPlayerByUserIdIncludeViewing(userId);//return []
                        if (players) {
                            for (var i = 0; i < players.length; i++) {
                                var componentUser = null;
                                componentUser = players[i].getComponent("BillardUserView");
                                if (!componentUser) {
                                    componentUser = players[i].getComponent("itemPlayerView");
                                }
                                if (componentUser) {
                                    componentUser.setReady(true);
                                }
                            }
                        }
                    }
                }
            }
        } else {
            var customEvent = new cc.Event.EventCustom(BiDaConstant.GAME_LOBBY_EVENT.REQUEST_LOBBY_FOR_ZONE_ID_TYPE, true);
            customEvent.ZONE = Linker.ZONE;
            customEvent.currentButton = null;
            this.node.dispatchEvent(customEvent);
            this.leaveTableRequest();
        }
    },
    onTurnCardRespone(message) {
        // cc.log(message);
        // if (this.isReconnectWait && message.cueStatus !== 3) {
        //     return;
        // }
        var checkReconnect = this.checkReconnectToSetUpTable(message);
        if (checkReconnect) {
            return;
        }

        var BillardsGameTable = this.getBidaGameTable();
        this.isAutoNextTurn = false;
        if (BillardsGameTable) {
            message.BillardsGameTable = BillardsGameTable;
            message.BillardsGameTableController = this;
            if (this.isEndGame == false) {
                if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
                    Bida11Controller.onTurnCardRespone(message);
                } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
                    Bida14Controller.onTurnCardRespone(message);
                } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
                    BidaPhomController.onTurnCardRespone(message);
                }
            }
        }
    },
    checkReconnectToSetUpTable: function (message) {
        if (this.isReconnectWait && message.cueStatus == 4 && this.myUserId !== Number(message.turnId)) {
            return true;
        }
        return false;
    },
    checkBotById: function (id) {
        return BidaPhomController.checkBotById(id);
    },
    getPlayerNameById: function (id) {
        var BillardsGameTable = this.getBidaGameTable();
        if (BillardsGameTable && BillardsGameTable.isValid) {
            var _playerLeaves = BillardsGameTable.getPlayerByUserIdIncludeViewing(Number(id));
            if (_playerLeaves) {
                for (let l = 0; l < _playerLeaves.length; l++) {
                    var componentUser = null;
                    componentUser = _playerLeaves[l].getComponent("BillardUserView");
                    if (!componentUser) {
                        componentUser = _playerLeaves[l].getComponent("itemPlayerView");
                    }
                    if (componentUser) {
                        return componentUser.getUserName();
                    }
                }
            }
        }
        return null;
    },
    onLeaveTableRespone(message) {
        cc.log("co nguoi ra ban", message);
        cc.error("Yeu cau roi ban nhan duoc..." + message);
        if (message.status == 1) {
            var BillardsGameTable = this.getBidaGameTable();
            if (BillardsGameTable && BillardsGameTable.isValid) {
                var ChatPrivateNode = BillardsGameTable.panelUI.getChildByName("BillardChatPrivate");
                var _playerName = this.getPlayerNameById(Number(message.userId));
                cc.log("Nguoi choi " + _playerName + " " + message.userId + " roi ban...");

                if (Linker.CURRENT_TABLE.isPlayWithFriend) {
                    Linker.CURRENT_TABLE = null;
                    this.node.dispatchEvent(new cc.Event.EventCustom(BiDaConstant.LOGIN_EVENT.CONFIG_HOME_LOGIN, true));
                } else {
                    //Set nguoi choi con lai torng ban co tro thanh chu ban khong
                    this.myUserId.toString() === message.newOwner ? this.isMaster = 1 : this.isMaster = 0;

                    if (this.myUserId == message.userId) {
                        switch (this.gameState) {
                            case BiDaConstant.GAME_STATE.WAIT: {
                                if (Number(message.cancelStatus) == 0) {
                                    this.isMaster = 0;
                                    if (ChatPrivateNode) {
                                        ChatPrivateNode.getComponent("BidaChatPrivate").clearContentChat();
                                    }
                                    var customEvent = new cc.Event.EventCustom(BiDaConstant.GAME_LOBBY_EVENT.REQUEST_LOBBY_FOR_ZONE_ID_TYPE, true);
                                    customEvent.ZONE = Linker.ZONE;
                                    customEvent.currentButton = null;
                                    this.node.dispatchEvent(customEvent);
                                    BillardsGameTable.hideTimeCountDownBallError();
                                    BillardsGameTable.hidePopupEndGame();
                                    this.ListPlayer = [];
                                    cc.Global.showMessage(i18n.t("Bạn vừa rời phòng"));
                                } else if (Number(message.cancelStatus) == 1) {
                                    this.isLeaveTable = true;
                                    this.gameState = BiDaConstant.GAME_STATE.PLAYING;
                                    BillardsGameTable.showMessage(i18n.t("Bạn vừa đăng ký rời phòng khi hết ván"));

                                } else if (Number(message.cancelStatus) == 2) {
                                    this.isLeaveTable = false;
                                    BillardsGameTable.showMessage(i18n.t("Bạn vừa hủy rời phòng khi hết ván"));
                                }
                                break;
                            }
                            case BiDaConstant.GAME_STATE.PLAYING: {
                                if (this._isViewMatch) {
                                    this._isViewMatch = false;
                                    this.leaveRoom(message);
                                } else if (Number(message.cancelStatus) == 1) {
                                    BillardsGameTable.showMessage(i18n.t("Bạn vừa đăng ký rời phòng khi hết ván"));
                                    this.isLeaveTable = true;
                                } else if (Number(message.cancelStatus) == 2) {
                                    this.isLeaveTable = false;
                                    BillardsGameTable.showMessage(i18n.t("Bạn vừa hủy rời phòng khi hết ván"));
                                } else {
                                    this.ListPlayer = [];
                                    this.leaveRoom(message);
                                }
                                break;
                            }
                            default:
                                break;
                        }
                    } else {
                        NewAudioManager.playAudioSource("leaveboard");

                        switch (this.gameState) {
                            case BiDaConstant.GAME_STATE.WAIT: {
                                // cancelStatus: "0"
                                // messageId: "1103"
                                // newOwner: "0"
                                // status: "1"
                                // userId: "95396"
                                var player = BillardsGameTable.getPlayerByUserIdIncludeViewing(message.userId);
                                this.setListPlayerReady(player, false);
                                if (this.isEndGame == true) {
                                    cc.log("BiDaConstant.GAME_STATE.WAIT leave ");
                                    this.tmpMessageLeaveWaiting.push(message);
                                } else if (this.isEndGame == false && Linker.ZONE != BiDaConstant.ZONE_ID.ZONEID_1VS1) {
                                    this.leavePlayerBeforeEndGameWait([message]);
                                } else { // Fix lỗi mất count down game 1vs1 khi có người vào bàn lúc đang count down
                                    // player = BillardsGameTable.getPlayerByUserIdIncludeViewing(this.myUserId);
                                    // this.setListPlayerReady(player, false);
                                    if (this.ListPlayer.length < 2) {
                                        BillardsGameTable.hideTimeCountDownBallError();
                                        this.leavePlayerBeforeEndGameWait([message]);
                                    } else {
                                        this.leavePlayerBeforeEndGameWait([message]);
                                        var players = BillardsGameTable.getAllPlayerInMatch();
                                        if (players.all_players_in_table.length < 2) {
                                            this.isMaster = 1;
                                            BillardsGameTable.panelUsers.getComponent("PanelUsers1Vs1").showBtnInvite();
                                            Bida11Controller.setMasterById(Number(Linker.userData.userId));
                                        } else {
                                            //chọn ngẫu nhiên một người trong bàn rồi push các player khác vào đang xem
                                            this.resetPlayerPositionKhiDangDemNguoc(message);
                                            //nếu mà trong bàn list người chơi còn lớn hơn 1 thì chọn bên trái là mình và bên phải là người chơi khác
                                        }
                                    }
                                }
                                break;
                            }
                            case BiDaConstant.GAME_STATE.PLAYING: {
                                cc.log("BiDaConstant.GAME_STATE.PLAYING: ");
                                cc.log(message);
                                //nếu bàn đang chơi mà có người ra thì tự động tìm và xóa người chơi đó.
                                if (this.isEndGame == true) {
                                    this.tmpMessageLeavePlaying.push(message);
                                } else {
                                    this.leavePlayerBeforeEndGamePlaying([message]);
                                }

                                break;
                            }
                            default:
                                break;
                        }
                        var found = null;
                        this.ListPlayer.forEach(player => {
                            if (Number(player.userId) == Number(message.userId)) {
                                found = player;
                                return;
                            }
                        });
                        if (found) cc.js.array.remove(this.ListPlayer, found);
                    }
                }
            }
        }
    },
    setListPlayerReady: function (listPlayer, ready) {
        if (listPlayer && Array.isArray(listPlayer) && listPlayer.length > 0) {
            for (let i = 0; i < listPlayer.length; i++) {
                var player = listPlayer[i];
                if (player) {
                    var componentUser = null;
                    componentUser = player.getComponent("BillardUserView");
                    if (!componentUser) {
                        componentUser = player.getComponent("itemPlayerView");
                    }
                    if (componentUser) {
                        componentUser.setReady(ready);
                    }
                }
            }
        }
    },
    resetPlayerPositionKhiDangDemNguoc: function (message) {
        var BillardsGameTable = this.getBidaGameTable();
        if (BillardsGameTable && BillardsGameTable.isValid) {
            var players = BillardsGameTable.getAllPlayerInMatch();
            var myUserHeaderInfo = null;
            var otherRandomHeaderInfo = null;
            var othersRandomViewInfo = [];

            if (players && Array.isArray(players)) {
                for (let i = 0; i < players.length; i++) {
                    if (Number(players[i].userID) == Number(Linker.userData.userId)) {
                        myUserHeaderInfo = players[i];
                    } else if (!otherRandomHeaderInfo) {
                        otherRandomHeaderInfo = players[i];
                    } else if (otherRandomHeaderInfo) {
                        othersRandomViewInfo.push(players[i]);
                    }
                }
            }
            if (myUserHeaderInfo && otherRandomHeaderInfo) {
                if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
                    //chọn player đầu tiên và các player còn lại sẽ là đang xem
                    Bida11GameTable.setMyUserData(myUserHeaderInfo);
                    Bida11GameTable.setOthersUserData(otherRandomHeaderInfo);
                } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
                    Bida14GameTable.setMyUserData(myUserHeaderInfo);
                    Bida14GameTable.setOthersUserData(otherRandomHeaderInfo);
                } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
                    BidaPhomGameTable.setMyUserData(myUserHeaderInfo);
                    BidaPhomGameTable.setOthersUserData(otherRandomHeaderInfo);
                }
            }
            if (othersRandomViewInfo && Array.isArray(othersRandomViewInfo) && othersRandomViewInfo.length > 0) {
                var _panelPlayerView = BillardsGameTable.panelUI.getComponent("PanelUIGame").getPanelPlayerView();
                var _panelPlayerViewComponent;
                if (_panelPlayerView && cc.isValid(_panelPlayerView)) {
                    _panelPlayerViewComponent = _panelPlayerView.getComponent("PanelPlayerView");
                    if (_panelPlayerViewComponent && cc.isValid(_panelPlayerViewComponent)) {
                        //sap xep lai vi tri nguoi xem
                        _panelPlayerViewComponent.resetContentNode();
                        for (var l = 0; l < othersRandomViewInfo.length; l++) {
                            _panelPlayerViewComponent.addExistPlayerToViewSit(othersRandomViewInfo[l]);
                        }
                    }
                }
            }

        }
    },
    leavePlayerBeforeEndGamePlaying: function (messageArr) {
        if (this.gameState == BiDaConstant.GAME_STATE.PLAYING) {
            var BillardsGameTable = this.getBidaGameTable();
            if (BillardsGameTable && BillardsGameTable.isValid) {
                var ChatPrivateNode = BillardsGameTable.panelUI.getChildByName("BillardChatPrivate");
                if (messageArr && Array.isArray(messageArr) && messageArr.length > 0) {
                    for (let i = 0; i < messageArr.length; i++) {
                        var message = messageArr[i];
                        if (message) {
                            cc.log(message);
                            if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
                                cc.log(message);
                                cc.log("Mode 1vs1 leave room", message);
                                this.removePlayerListView(message);
                                BillardsGameTable.setViewerNumber();
                                this.resetUserPosition1vs1(message);
                                //set up lai ban
                                var players = [BillardsGameTable.myUserInfo, BillardsGameTable.otherUserInfo];
                                var _masterId = parseInt(message.newOwner);
                                for (let i = 0; i < players.length; i++) {
                                    var BillardUserView = players[i].getComponent("BillardUserView");
                                    if (isNaN(_masterId) == false && _masterId != 0) {
                                        if (BillardUserView && BillardUserView.getUserID() == _masterId) {
                                            BillardUserView.setMaster(1);
                                        }
                                    }
                                }
                                var players = BillardsGameTable.getAllPlayerInMatch();
                                if (players.all_players_in_table.length < 2) {
                                    this.isMaster = 1;
                                    BillardsGameTable.panelUsers.getComponent("PanelUsers1Vs1").showBtnInvite();
                                    Bida11Controller.setMasterById(Number(Linker.userData.userId));
                                }
                            } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
                                cc.log("Mode 1vs4 leave room", message);
                                this.removePlayerListView(message);
                                BillardsGameTable.setViewerNumber();
                                this.resetUserPosition1vs4(message);
                            } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
                                cc.log("Mode bida phom leave room", message);
                                this.removePlayerListView(message);
                                BillardsGameTable.setViewerNumber();
                                this.resetUserPosition1vs4(message);
                            }
                        }
                    }
                }
            }
        } else {
            this.leavePlayerBeforeEndGameWait(messageArr);
        }
        this.tmpMessageLeavePlaying = [];
        this.stopCounterWithoutId(this.idplayerLuotDanh);
    },
    leavePlayerBeforeEndGameWait: function (messageArr) {
        var BillardsGameTable = this.getBidaGameTable();
        this.isMaster = 0;
        if (this.gameState == BiDaConstant.GAME_STATE.PLAYING) {
            this.leavePlayerBeforeEndGamePlaying(messageArr);
        } else {
            if (BillardsGameTable && BillardsGameTable.isValid) {
                var ChatPrivateNode = BillardsGameTable.panelUI.getChildByName("BillardChatPrivate");
                if (messageArr && Array.isArray(messageArr) && messageArr.length > 0) {
                    var _masterId = parseInt(messageArr.newOwner);
                    for (let i = 0; i < messageArr.length; i++) {
                        var message = messageArr[i];
                        if (isNaN(_masterId) == false && _masterId != 0) {
                            if (this.myUserId == _masterId) {
                                this.isMaster = 1;
                            }
                        }
                        var _panelPlayerView = BillardsGameTable.panelUI.getComponent("PanelUIGame").getPanelPlayerView();
                        var _isValidToReconfig = false;
                        var _panelPlayerViewComponent;
                        var listPlayer = BillardsGameTable.getAllPlayerInMatch();
                        var _players;
                        var _playerIds;
                        var _playerInfs;
                        var _myInfo;
                        if (_panelPlayerView && cc.isValid(_panelPlayerView)) {
                            _panelPlayerViewComponent = _panelPlayerView.getComponent("PanelPlayerView");
                            if (_panelPlayerViewComponent && cc.isValid(_panelPlayerViewComponent)) {
                                _isValidToReconfig = true;
                            }
                        }
                        if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
                            cc.log("Mode 1vs1 leave room");
                            this.removePlayerListView(message);
                            BillardsGameTable.setViewerNumber();
                            this.resetUserPosition1vs1(message);
                            BillardsGameTable.panelUsers.getComponent("PanelUsers1Vs1").hideBtnInvite();
                            //xem nguoi choi nay co roi phong hay khong chu =)
                            //set up lai ban
                            var players = [BillardsGameTable.myUserInfo, BillardsGameTable.otherUserInfo];
                            var _masterId = parseInt(message.newOwner);
                            for (let i = 0; i < players.length; i++) {
                                var BillardUserView = players[i].getComponent("BillardUserView");
                                if (isNaN(_masterId) == false && _masterId != 0) {
                                    if (BillardUserView && BillardUserView.getUserID() == _masterId) {
                                        BillardUserView.setMaster(1);
                                    }
                                }
                            }
                            this.checkShowInviteButton();
                            var players = BillardsGameTable.getAllPlayerInMatch();
                            if (players.all_players_in_table.length >= 2) {
                                //truong hop doi thu roi di hoac nguoi choi roi phong ma list nguoi choi dang xem >=1
                                //khong xem thi moi dem nguoc
                                //BillardsGameTable.hideTimeCountDownBallError();
                                var myUserInfos = BillardsGameTable.getPlayerByUserIdIncludeViewing(Number(Linker.userData.userId));
                                if (myUserInfos && Array.isArray(myUserInfos)) {
                                    var isReady = false;
                                    for (let l = 0; l < myUserInfos.length; l++) {
                                        var componentUser = null;
                                        componentUser = myUserInfos[l].getComponent("BillardUserView");
                                        if (!componentUser) {
                                            componentUser = myUserInfos[l].getComponent("itemPlayerView");
                                        }
                                        if (componentUser) {
                                            isReady = componentUser.getReady();
                                        }
                                    }
                                    if (!isReady) {
                                        this.handleMatchStartGame();
                                    }
                                }
                            } else {
                                BillardsGameTable.hideTimeCountDownBallError();
                                //và xóa bi đi chứ
                                Utils.Malicious.destroyAllChildrenWithoutName(this.bidaDeskNode, "CueObj");
                            }

                        } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
                            cc.log("Mode 1vs4 leave room");
                            this.removePlayerListView(message);
                            BillardsGameTable.setViewerNumber();
                            this.resetUserPosition1vs4(message);
                            BillardsGameTable.panelUsers.getComponent("PanelUsers1Vs4").hideBtnInvite();
                            //xem nguoi choi nay co roi phong hay khong chu =)
                            //set up lai ban
                            var players = Utils.Malicious.flattern([
                                [BillardsGameTable.myUserInfo], BillardsGameTable.rankingUserInfo
                            ]);
                            var _masterId = parseInt(message.newOwner);
                            if (isNaN(_masterId) == false && _masterId != 0) {
                                Bida14Controller.setMasterById(_masterId);
                            }
                            var players = BillardsGameTable.getAllPlayerInMatch();
                            if (players.all_players_in_table.length < 2) {
                                this.isMaster = 1;
                                BillardsGameTable.panelUsers.getComponent("PanelUsers1Vs4").showBtnInvite();
                                Bida14Controller.setMasterById(Number(Linker.userData.userId));
                            } else {
                                if (BillardsGameTable.getIdPlayerIsMasterInTable() == Number(Linker.userData.userId)) {
                                    this.isMaster = 1;
                                    BillardsGameTable.panelUsers.getComponent("PanelUsersBidaPhom").showBtnInvite();
                                    // cc.error("da goi invite");
                                } else {
                                    // cc.error("khong goi invite", players)
                                }
                            }

                        } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
                            cc.log("Mode bida phom leave room");
                            this.removePlayerListView(message);
                            BillardsGameTable.setViewerNumber();
                            this.resetUserPosition1vs4(message);
                            BillardsGameTable.panelUsers.getComponent("PanelUsersBidaPhom").hideBtnInvite();
                            //set up lai ban
                            var players = Utils.Malicious.flattern([
                                [BillardsGameTable.myUserInfo], BillardsGameTable.rankingUserInfo
                            ]);
                            var _masterId = parseInt(message.newOwner);
                            if (isNaN(_masterId) == false && _masterId != 0) {
                                BidaPhomController.setMasterById(_masterId);
                            }
                            var players = BillardsGameTable.getAllPlayerInMatch();
                            if (players.all_players_in_table.length < 2) {
                                this.isMaster = 1;
                                BillardsGameTable.panelUsers.getComponent("PanelUsersBidaPhom").showBtnInvite();
                                BidaPhomController.setMasterById(Number(Linker.userData.userId));
                                BillardsGameTable.hideTimeCountDownBallError();
                                // cc.error("da goi invite");
                            } else {
                                if (BillardsGameTable.getIdPlayerIsMasterInTable() == Number(Linker.userData.userId)) {
                                    this.isMaster = 1;
                                    BillardsGameTable.panelUsers.getComponent("PanelUsersBidaPhom").showBtnInvite();
                                    // cc.error("da goi invite");
                                } else {
                                    // cc.error("khong goi invite", players)
                                }
                            }
                        }
                        if (listPlayer.playerInfs.length - 1 < 2)
                            if (this.ListPlayer.length < 2) BillardsGameTable.hideTimeCountDownBallError();
                        if (ChatPrivateNode) {
                            //ChatPrivateNode.getComponent("BidaChatPrivate").clearContentChat();
                        }
                    }
                }
            }
        }
        this.tmpMessageLeaveWaiting = [];
        this.stopCounterWithoutId(this.idplayerLuotDanh);
    },
    stopCounterWithoutId: function (id) {
        var BillardsGameTable = this.getBidaGameTable();
        if (BillardsGameTable && cc.isValid(BillardsGameTable)) {
            var players = BillardsGameTable.getAllPlayer();//return []
            if (players) {
                for (var i = 0; i < players.length; i++) {
                    var componentUser = null;
                    componentUser = players[i].getComponent("BillardUserView");
                    if (!componentUser) {
                        componentUser = players[i].getComponent("itemPlayerView");
                    }
                    if (componentUser) {
                        if (Object.getPrototypeOf(componentUser).hasOwnProperty("stopCounter")) {
                            var currentId = Number(componentUser.getUserID());
                            if (currentId != Number(id)) {
                                componentUser.stopCounter();
                            }
                        }
                    }
                }
            }
        }
    },
    leaveRoom: function (message) {
        var BillardsGameTable = this.getBidaGameTable();
        if (BillardsGameTable && BillardsGameTable.isValid) {
            this._isViewMatch = false;
            this.gameState = BiDaConstant.GAME_STATE.WAIT;
            BillardsGameTable.panelUI.getChildByName("BillardChatPrivate").getComponent("BidaChatPrivate").clearContentChat();
            BillardsGameTable.hidePopupEndGame();
            var customEvent = new cc.Event.EventCustom(BiDaConstant.GAME_LOBBY_EVENT.REQUEST_LOBBY_FOR_ZONE_ID_TYPE, true);
            customEvent.ZONE = Linker.ZONE;
            customEvent.currentButton = null;
            this.node.dispatchEvent(customEvent);
            this.ListPlayer = [];
            cc.Global.showMessage(i18n.t("Bạn vừa rời phòng"));
        }
    },
    getPlayerListViewWithId: function (id) {
        var players = [];
        var BillardsGameTable = this.getBidaGameTable();
        if (BillardsGameTable && BillardsGameTable.isValid) {
            var panelListPlayer = BillardsGameTable.panelUI.getComponent("PanelUIGame").getPanelPlayerView();
            var panelListPlayerComp = panelListPlayer.getComponent("PanelPlayerView");
            if (panelListPlayerComp && panelListPlayerComp.isValid) {
                id = parseInt(id);
                return {
                    players: panelListPlayerComp.getPlayerById(id),
                    component: panelListPlayerComp
                };
            }
        }
        return players;
    },
    removePlayerListView: function (message) {
        if (message) {
            var listView = this.getPlayerListViewWithId(message.userId);
            var players = listView.players;
            var comp = listView.component;

            for (let i = 0; i < players.length; i++) {
                cc.log(players[i]);
                players[i].removeFromParent(true);
            }
        }
    },
    getPlayerIsPlaying1vs4: function () {
        var isPlaying = [];
        var isWaiting = [];
        var BillardsGameTable = this.getBidaGameTable();
        if (BillardsGameTable && BillardsGameTable.isValid) {
            for (let k = 0; k < BillardsGameTable.rankingUserInfo.length; k++) {
                var player = BillardsGameTable.rankingUserInfo[k];
                var rankingUserComponent = player.getComponent("BillardUserView");
                if (rankingUserComponent) {
                    var data = {
                        userAvatarFrame: rankingUserComponent.getUserAvatarFrame(),
                        userMoney: rankingUserComponent.getUserMoney(),
                        userName: rankingUserComponent.getUserName(),
                        userID: rankingUserComponent.getUserID(),
                        userNationFrame: rankingUserComponent.getNationFrame(),
                        userPercentMatch: player.player_percent_eat,
                        userWaiting: rankingUserComponent._isWaiting,
                        userOpacity: rankingUserComponent.getOpacityPlayer()
                    };
                    if (rankingUserComponent._isWaiting == true) {
                        isWaiting.push(
                            data
                        )
                    } else {
                        isPlaying.push(
                            data
                        )
                    }
                }
            }
        }
        return {
            isPlaying: isPlaying,
            isWaiting: isWaiting
        }
    },
    onCreateTableResponse(message) {
        if (message.status == 1) {
            //set auto ready lan dau vao ban bang false
            var userData = Linker.Local.readUserData();
            userData.isAutoReady = false;
            Linker.Local.saveUserData(userData);
            //end
            this.gameState = (message.hasOwnProperty("isPlaying") && Number(message.isPlaying) == 0) ? BiDaConstant.GAME_STATE.WAIT : BiDaConstant.GAME_STATE.PLAYING;
            this.tableId = message.tableId;
            this.isMaster = message.player.isMaster;
            this.createTableGame(message);
            // this.getBidaGameTable().btnPlayerViewList.parent.active = false;
        } else {
            if (Linker.ZONE) {
                var customEvent = new cc.Event.EventCustom(BiDaConstant.GAME_LOBBY_EVENT.REQUEST_LOBBY_FOR_ZONE_ID_TYPE, true);
                customEvent.ZONE = Linker.ZONE;
                this.node.dispatchEvent(customEvent);
            } else {
                cc.log("Khong the tao ban choi bida ...");
            }
        }
    },
    createTableGame: function (message) {
        var BillardsGameTable = this.getBidaGameTable();
        if (BillardsGameTable && BillardsGameTable.isValid) {
            //khoi tao controller
            var controller = null;
            if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
                controller = Bida11Controller;
            } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
                controller = Bida14Controller;
            } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
                controller = BidaPhomController;
            }
            if (controller) {
                controller.init({
                    status: 1,
                    BillardsGameTable: BillardsGameTable,
                    BillardsGameTableController: this
                })
            }
            this.setGameState(message);
            this.isEndGame = false;
            this.ListPlayer = [];
            message.player ? this.ListPlayer.push(message.player) : this.ListPlayer = cc.js.array.copy(message.listPlayer);
            BillardsGameTable.createHeaderUserInfo();
            BillardsGameTable.configPanelUsers();
            BillardsGameTable.init();
            BillardsGameTable.initTableInfo(message);
            BillardsGameTable.initListPlayerView(message);
        } else {
            cc.log("Loi thiet lap thong tin ban choi...");
        }
    },
    onJoinTableResponse(message) {
        // cc.log('*** linker',Linker);
        if (message.status == 1) {
            var BillardsGameTable = this.getBidaGameTable();
            if (BillardsGameTable) {
                //set auto ready lan dau vao ban bang false
                var userData = Linker.Local.readUserData();
                userData.isAutoReady = false;
                Linker.Local.saveUserData(userData);
                //end
                this.isMaster = 0;
                this.gameState = (message.hasOwnProperty("isPlaying") && Number(message.isPlaying) == 0) ? BiDaConstant.GAME_STATE.WAIT : BiDaConstant.GAME_STATE.PLAYING;
                this.tableId = message.tableId;
                // NewAudioManager.playAudioSource("joinboard");
                message.BillardsGameTable = BillardsGameTable;
                message.BillardsGameTableController = this;

                if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
                    Bida11Controller.onJoinTableResponse(message);
                } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
                    Bida14Controller.onJoinTableResponse(message);
                } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
                    BidaPhomController.onJoinTableResponse(message);
                }
            }
        } else {
            var customEvent = new cc.Event.EventCustom(BiDaConstant.GAME_LOBBY_EVENT.REQUEST_LOBBY_FOR_ZONE_ID_TYPE, true);
            customEvent.ZONE = Linker.ZONE;
            customEvent.currentButton = null;
            this.node.dispatchEvent(customEvent);
        }
    },
    getListPlayerInfo: function (players) {
        var playerList = [];
        for (var i = 0; i < players.length; i++) {
            var namePlayer = players[i].viewName;
            if (!namePlayer || namePlayer == "null") {
                namePlayer = Linker.userData.displayName;
            }
            var player = {
                name: namePlayer,
                money: players[i].userMoney,
                master: (Number(players[i].isMaster) == 1) ? true : false,
                id: players[i].userId,
                exp: players[i].exp,
                avatar: players[i].avatarId
            }

            playerList.push(player);
        }
        return playerList;
    },
    onTableSettingChangeResponse(message) {
        var BillardsGameTable = this.getBidaGameTable();
        if (message.status == 1) {
            this.isFastPlay = message.fastPlay;
            this.isTotalError = message.totalError;
            this.playTime = message.playTime;
            this.maxError = message.maxError;
            BillardsGameTable.setMaxError(this.maxError);
            if (message.leftTime > 0) {
                BillardsGameTable.setCountDownTimeLeft(message.leftTime);
            }
            if (this.gameState == BiDaConstant.GAME_STATE.WAIT) {
                BillardsGameTable.initCountDownTimeLeft();
            }
            if (message.players.length > 0) {
                BillardsGameTable.setErrorNumber(message.players);
            }
        } else {
            cc.Global.showMessage(i18n.t(message.error));
        }
    },
    onRunAnimationBiRoiLo: function (data) {
        var mainGame = this.getMainGame();
        var BillardsGameTable = this.getBidaGameTable();

        if (mainGame && BillardsGameTable) {
            if (BillardsGameTable) {
                BillardsGameTable.runBallInHoleFx(data);
                //can id cua bi roi xuong lo
                var RailChuaBiJS = BillardsGameTable.getRailingBagComponent();
                if (RailChuaBiJS) {
                    RailChuaBiJS.themMotBiRoiXuongLo({
                        id: data.idBi,
                        isPlayAnimation: true
                    })
                }
            } else {
                //cc.log("Không tìm thấy đối tượng bidamaingame ... ");
            }
        }
    },
    onMatchStartResponse: function (message) {
        if (message && message.status == 1) {
            this.countTurn = -1;
            this._isCountered = false;
            this._isViewMatch = false;
            this.gameState = BiDaConstant.GAME_STATE.PLAYING;
            var BillardsGameTable = this.getBidaGameTable();
            if (BillardsGameTable) {
                message.BillardsGameTable = BillardsGameTable;
                message.BillardsGameTableController = this;
                if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
                    Bida11Controller.onMatchStartResponse(message);
                    // PanelPlayerView11.config(message);
                    PanelPlayerView11.removeFootPrint(message);
                    if (this.ListPlayer.length < 2) {
                        var self = this;
                        message.listPlayerIdInGame.forEach(id => {
                            if (Object.values(self.ListPlayer[0]).includes(`${id}`) == false) {
                                self.ListPlayer.push({
                                    userId: id
                                });
                            }
                        });
                    }
                } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
                    Bida14Controller.onMatchStartResponse(message);
                    // PanelPlayerView14.config(message);
                    PanelPlayerView14.removeFootPrint(message);
                } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
                    BidaPhomController.onMatchStartResponse(message);
                    // PanelPlayerViewBiDaPhom.config(message);
                    PanelPlayerViewBiDaPhom.removeFootPrint(message);
                }
                BillardsGameTable.resetReadyStatus();
            } else {
                this.failMatchStart(message);
            }
        } else {
            this.failMatchStart(message);
            // var customEvent = new cc.Event.EventCustom(BiDaConstant.GAME_LOBBY_EVENT.REQUEST_LOBBY_FOR_ZONE_ID_TYPE, true);
            // customEvent.ZONE = Linker.ZONE;
            // customEvent.currentButton = null;
            // this.node.dispatchEvent(customEvent);
            // this.leaveTableRequest();
        }
    },
    failMatchStart: function (message) {
        this.isEndGame = true;
        this.gameState = BiDaConstant.GAME_STATE.WAIT;
        var BillardsGameTable = this.getBidaGameTable();
        if (BillardsGameTable) {
            message.error = Utils.Decoder.decode(message.error);
            BillardsGameTable.showMessage(i18n.t(message.error));
        }
        cc.log("Khong the bat dau tran dau ...", message);
    },
    handleMatchStartGame(seconds) {
        var BillardsGameTable = this.getBidaGameTable();
        BillardsGameTable.hideTimeCountDownBallError();
        if (BillardsGameTable) {
            if (!seconds) {
                seconds = BiDaConstant.GAME.CONFIG.THOI_GIAN_CHO_BAT_DAU_TRAN_1_VS_1;
            }
            var dataTimeStart = {
                time: seconds
            };
            if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
                dataTimeStart.isShowBoBai = true;
            }
            var _isRunAnimationChiaBai = false;
            this._listPlayer = BillardsGameTable.getAllPlayerInMatch();
            if (this._listPlayer.playerInfs.length < 2)
                return;
            BillardsGameTable.runBeginMatchAnimation(dataTimeStart, function (err, data) {
                if (!err) {
                    //         if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM && !_isRunAnimationChiaBai) {
                    //             _isRunAnimationChiaBai = true;
                    //             var animationFx = BillardsGameTable.getStartAnimationCard();
                    //             if (animationFx) {
                    //                 BillardsGameTable.runAnimationChiaBai(animationFx, function (err, chiaBaiNode) {
                    //                     if (!err) {
                    //                         chiaBaiNode.opacity = 0;
                    //                         chiaBaiNode.position = cc.v2(0, 0);
                    //                     }
                    //                 })
                    //             }
                    //         }
                    //         cc.log("Handle match start successfully ...");
                }
            });
        }
    },

    onCountChat(event) {
        var BillardsGameTable = this.getBidaGameTable();
        BillardsGameTable.showCountChat(event.countChat);
    },

    findCurrentPlayer(playerID) {
        for (var i = 0; i < this.listPlayer.length; i++) {
            if (this.listPlayer[i].userId == playerID) {
                // this.currentPlayer = this.listPlayer[i];
                return i;
            }
        }
        return -1;
    },


    onClickBtnChatPrivate() {

    },

    onBtnSendChatClick() {
        // var msg = this.edbChat.string;
        // if (msg.length <= 0) {
        //     return;
        // }

        // var str = Constant.CMD.CHAT +
        //     Constant.SEPERATOR.N4 + this.tableInfo.tableId +
        //     Constant.SEPERATOR.ELEMENT + msg +
        //     Constant.SEPERATOR.ELEMENT + 0;

        // var data = {
        //     message: msg,
        //     username: Linker.userData.displayName,
        //     id: Linker.userData.userId
        // };
        // this.onChat(data);

        // this.edbChat.string = '';
        // XocDiaSend.sendRequest(str);
    },
    kickPlayer() {
        // if (!this.KickID) {
        //     return;
        // }
        // var index = this.findCurrentPlayer(this.KickID);
        // if (this.listPlayerNode[index]) {
        //     var mes = CommonSend.kickPlayer(this.tableInfo.tableId, this.KickID);
        //     Linker.Socket.send(mes);
        // }
    },
    hidePopupInvite() {
        var popup = this.node.getParent().getChildByName("PopupInvite1vs1");
        if (popup) popup.active = false;
    },
    onUpdateMoney: function (response) {
        if ((response.userId) == Number(Linker.userData.userId)) {
            var BillardsGameTable = this.getBidaGameTable();
            if (BillardsGameTable) {
                var userInfo = BillardsGameTable.myUserInfo;
                if (userInfo) {
                    var userInfoComponent = userInfo.getComponent("BillardUserView");
                    if (userInfoComponent) {
                        var money = Utils.Malicious.moneyWithFormat(response.userMoney, ".");
                        if (userInfoComponent) {
                            userInfoComponent.setUserMoney(money);
                        }
                    }
                }
            }
        }
    },
    showMsgError: function (message) {
        var BillardsGameTable = this.getBidaGameTable();
        if (Number(this.idplayerLuotDanh) == Number(this.myUserId) && BillardsGameTable) {
            var players = message.players;
            for (var i = 0; i < players.length; i++) {
                if (Number(players[i].id) == Number(this.myUserId)) {
                    var string = this.checkMsgError(Number(players[i].ballErrorId));
                    if (string) {
                        string = "<color=#ffffff>" + i18n.t("title_error_header_msg") + "</c>" + "<color=#FF0000>" + string + "</color>";
                        NewAudioManager.PlayUrl(Linker.gameLanguage == "vi" ? NewAudioManager.SOUND.VI.GUILTY : NewAudioManager.SOUND.EN.GUILTY);
                        BillardsGameTable.showMessage(string);
                    }
                }
            }
        }
    },
    checkMsgError: function (idErr) {
        switch (idErr) {
            case 0:
                return i18n.t("title_error_unknown_error");

            case -1:
                return i18n.t("title_error_wball_fall");

            case -4:
                return i18n.t("title_error_eat_wrong_ball");

            case -5:
                return i18n.t("title_error_eat_8ball_1");

            case -3:
                return i18n.t("title_error_eat_8ball_2");

            case -7:
                return i18n.t("title_error_miss_ball");

            case -8:
                return i18n.t("title_error_miss_target_ball");

            default:
                return false;
        }
    },
    sendRequestAutoNextTurn: function () {
        var data = {
            cueStatus: BiDaConstant.TABLE_STATUS.AUTO_NEXT_TURN, //trạng thái di chuyển cây cơ
            ballX: 0,
            ballY: 0,
            cueR: 0, //cueRotation góc xoay của gậy
            ballEat: "#", //chưa có ball trúng hay rơi xuống lỗ
            ballList: "#"
        };
        if (Utils.Malicious.isValidObj(data)) {
            if (this.isValidModePlay()) {
                var send = BiDaSend.turnCardRequest(Linker.ZONE, this.tableId, data);
                Linker.Socket.send(send);
            }
        }
    }
});