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
var Global = require('Global');
var SceneManager = require('SceneManager');
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
        this.tableInfo = {};
        this.restoreUserData = null;
        this.isFirstEatBall = true;
        this.winUser = null;
        this.loseUser = null;

        this.BillardPanelSetting = null;
        this.FriendsZone = null;
        this.isSendData = true;
    },
    properties: {
        message: cc.Label,
        panelUI: cc.Node,
        billardPanelSetting: cc.Prefab,
        friendZonePrefab: cc.Prefab
    },
    onLoad: function () {
        Linker.BiDaOfflineController = this;
    },
    initGameOffline: function () {
        Global.Announcement._hideLoading();
        Linker.BiDaOfflineController = this;
        Utils.Malicious.addPhysicManagement();
        this.createTable();
        this.addCustomEvent();
        this.loadNewMatch(this.tableInfo.listPlayer[0].userId);
    },
    createTable: function () {
        var player = cc.Class({
            ctor: function (viewName, id, isMaster, avatarId) {
                this.viewName = viewName;
                this.userMoney = 0;
                this.isMaster = isMaster;
                this.userId = id;
                this.id = id;
                this.exp = 0;
                this.avatarId = avatarId;
                this.player_list_ball_tren_tay = [];
                this.player_list_ball_an = [];
                this.level = 0;
            }
        });
        if (!Linker.userData) {
            var listplayer = [new player("Player1", 1111, true, 1), new player("Player2", 1112, false, Linker.otherPlayerIdAvatar)];
            Linker.userData = listplayer[0];
        } else {
            this.restoreUserData = Linker.userData;
            var listplayer = [new player("Player1", Linker.userData.userId, true, Number(Linker.userData.avatar)), new player("Player2", Linker.userData.userId + 1, false, Linker.otherPlayerIdAvatar)];
        }
        this.tableInfo = {
            status: 1,
            isCreate: true,
            tableId: 0,
            minMoney: 0,
            maxCapacity: 2,
            isPlaying: 0,
            listPlayer: listplayer
        };
        Linker.CURRENT_TABLE = this.tableInfo;
        Linker.ZONE = BiDaConstant.ZONE_ID.ZONEID_1VS1;
        //play nhạc nền
        //NewAudioManager.playBackground(NewAudioManager.sound.background);
    },
    loadNewMatch: function (turnId) {
        if (Linker.CURRENT_TABLE) {
            cc.log(Linker.CURRENT_TABLE);
            this.isEndGame = false;
            if (Linker.CURRENT_TABLE.isCreate) {
                var messageCreateTable = {
                    isCreate: Linker.CURRENT_TABLE.isCreate,
                    isPlaying: this.tableInfo.isPlaying,
                    maxCapacity: this.tableInfo.maxCapacity,
                    messageId: 1100,
                    minMoney: this.tableInfo.minMoney,
                    player: this.tableInfo.listPlayer[0],
                    selfMoney: 0,
                    status: 1,
                    tableId: this.tableInfo.tableId,
                    tableIndex: 0
                }
                this.onCreateTableResponse(messageCreateTable);

                var message = {
                    status: 1,
                    player: this.tableInfo.listPlayer[1],
                    turnId: turnId
                }
                this.onPlayerJoinedResponse(message);
            }
        }
    },
    getFriendZone: function (cb) {
        //only for test friends
        var FriendsZone = cc.find("Canvas/FriendsZone");
        if (FriendsZone) {
            FriendsZone.active = false;
            if (cb) {
                cb(null, FriendsZone);
            }
        } else {
            cc.resources.load("friends/prefabs/FriendsZone", cc.Prefab, function (err, prefab) {
                if (!err) {
                    var canvas = cc.find("Canvas");
                    if (canvas) {
                        var fzone = cc.instantiate(prefab);
                        fzone.active = false;
                        canvas.addChild(fzone);
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
    onEndTurnGame1vs4: function (message, type) {
        if (type == BiDaConstant.TABLE_STATUS.SETTING_RESULT_TURN) {
            var BillardsGameTable = this.getBidaGameTable();
            if (BillardsGameTable && BillardsGameTable.isValid) {
                if (BillardsGameTable._isSendedBeforeTurn) {
                    BillardsGameTable._isSendedBeforeTurn = false;
                    cc.log("End turn 1vs4", message)
                    if (message.hasOwnProperty("players")) {
                        for (let i = 0; i < message.players.length; i++) {
                            var player = message.players[i];
                            if (Number(player.id) == Number(Linker.userData.userId)) {
                                //check ballErrorID
                                var codeErr = Number(player.ballErrorId);
                                switch (codeErr) {
                                    case BiDaConstant.GAME.STATUS.BALL_ERROR.BI_SO_8_ROI_XUONG_LO_NHUNG_CHUA_HET_BI_CUA_MINH:
                                        //end game
                                        cc.log("End game roi bi 8...", message);
                                        break;
                                    case BiDaConstant.GAME.STATUS.BALL_ERROR.BI_SO_8_ROI_XUONG_LO_NHUNG_KHONG_HOP_LE:
                                        //end game
                                        cc.log("End game roi bi 8 khong hop le...", message);
                                        break;
                                    case BiDaConstant.GAME.STATUS.BALL_ERROR.BI_ROI_XUONG_LO_KHONG_PHAI_CUA_MINH:
                                        //truong hop nay nen check ca bi cai luon vi neu co 2 bi roi, mot cua op mot la white ball
                                        cc.log("Bi roi xuong lo la bi cua doi thu...", message);
                                        var ballInTableId = this.addListBallAndGetBallinTable(player, BillardsGameTable);
                                        this.handleGameAfter(BiDaConstant.GAME.CONFIG.THOI_GIAN_CHO_KHI_BOI_DANH_BI, function (err, data) {
                                            if (!err, data) {
                                                //check tren ban co bi trang khong
                                                var whiteBall = BillardsGameTable.getWhiteBall();
                                                if (!whiteBall && ballInTableId.indexOf(0) == -1) {
                                                    cc.log("Co bi trang moi dau chu", ballInTableId);
                                                    BillardsGameTable.datLaiViTriBiTrang();
                                                    //bi trang roi
                                                } else {
                                                    cc.log("Bi roi xuong nhung khong co bi trang dau nhe, ...", ballInTableId);
                                                    BillardsGameTable.setNextTurn1vs4();
                                                }
                                            }
                                        }.bind(this));
                                        //end game
                                        break;
                                    case BiDaConstant.GAME.STATUS.BALL_ERROR.BI_CAI_ROI_XONG_LO:
                                        cc.log("Bi cai roi xuong lo...", message);
                                        var ballInTableId = this.addListBallAndGetBallinTable(player, BillardsGameTable);

                                        this.handleGameAfter(BiDaConstant.GAME.CONFIG.THOI_GIAN_CHO_KHI_BOI_DANH_BI, function (err, data) {
                                            if (!err) {
                                                //check tren ban co bi trang khong
                                                var whiteBall = BillardsGameTable.getWhiteBall();
                                                if (!whiteBall && ballInTableId.indexOf(0) == -1) {
                                                    BillardsGameTable.datLaiViTriBiTrang();
                                                } else {
                                                    cc.log("Du lieu trung khop, khong tim thay bi cai tren ban va client gui ve...", ballInTableId);
                                                }
                                                //dat lai bi cai
                                            }
                                        }.bind(this));
                                        break;
                                    case BiDaConstant.GAME.STATUS.BALL_ERROR.LUOT_DANH_HOP_LE:
                                        var listBallOnHand = this.addListBiCanAn(player);
                                        //hop le
                                        if (listBallOnHand.length == 7) {
                                            BillardsGameTable.stopAllTipAnimation();
                                            BillardsGameTable.showBallListDisplay(listBallOnHand, BiDaConstant.PSEUDO_CONST.KIEU_BI_CUA_MINH, true, true);
                                        }
                                        //den luot turn binh thuong, khong co loi, cho danh tiep, xem xet list bi da co hay chua
                                        cc.log("message", message);
                                        // ["9", "-1", "11", "12", "13", "14", "15"]
                                        // player_list_ball_tren_tay: [""]
                                        // player_list_ball_an: [""]
                                        // player_percent_eat: 0
                                        BillardsGameTable.setNextTurn1vs4();
                                        break;
                                    default:
                                        cc.log("BallError khong the xac dinh", message);
                                        break;
                                }
                                break;
                            }
                        }
                    }
                } else {
                    //set phan tram neu nhu khong phai luot danh cua minh nhe
                }

            }

        } else if (type == 2) {
            cc.log("Tu dong next turn khong duoc su dung o mode 1vs4 ...");
        }
    },
    addListBallAndGetBallinTable: function (player, view) {
        var listBallOnHand = this.addListBiCanAn(player);
        //hop le
        if (listBallOnHand.length == 7) {
            view.showBallListDisplay(listBallOnHand, BiDaConstant.PSEUDO_CONST.KIEU_BI_CUA_MINH, true, true);
        }
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
    handleGameAfter: function (timeRemain, cbw) {
        var BillardsGameTable = this.getBidaGameTable();
        if (BillardsGameTable) {
            var timeReady = timeRemain + 1;
            var cb = function () {
                if (timeRemain < 0) {
                    this.unschedule(cb);
                    BillardsGameTable.hideTimeCountDownBallError();
                    if (cbw) {
                        cbw(null, true);
                    }
                } else {
                    BillardsGameTable.showTimeCountDownBallError(timeRemain);
                    cc.log("Start after " + timeRemain + " seconds...");
                }
                timeRemain--;
            }.bind(this);
            this.schedule(cb, 1, timeReady, 0);
        }

    },
    addListBiCanAn: function (player) {
        var listBallOnHand = [];
        for (let i = 0; i < player.player_list_ball_tren_tay.length; i++) {
            var idBi = parseInt(player.player_list_ball_tren_tay[i]);
            if (isNaN(idBi) == false) {
                listBallOnHand.push(idBi);
            }
        }
        return listBallOnHand;
    },
    onEndTurnGame1vs1: function (message, type) {
        if (this.isEndGame == false) {
            this.idplayerLuotDanh = Number(message.turnId);
            this._tmpMessageEndTurn = null;
            var BillardsGameTable = this.getBidaGameTable();
            if (BillardsGameTable && BillardsGameTable.isValid) {
                BillardsGameTable.stopAllTipAnimation();
                // message.dataBall
                BillardsGameTable._isServerWaiting = false;
                if (this.idplayerLuotDanh == this.tableInfo.listPlayer[0].userId) {
                    BillardsGameTable.setTurnBlur(true);
                } else BillardsGameTable.setTurnBlur(false);

                var turnHint = BiDaConstant.PSEUDO_CONST.LUOT_DANH_CUA_MINH;
                //set turn hint silent
                BillardsGameTable.myListBallOnHand = [];
                BillardsGameTable.setColorBallTag(message)
                if (Number(this.idplayerLuotDanh) == Number(this.myUserId)) {
                    //BillardsGameTable._isServerWaiting = true;
                    message.turnHint = turnHint;
                    BillardsGameTable._tmpEndTurnDataServerWaiting = message;
                    this.countTurn = this.countTurn + 1;
                    if (this.countTurn > 0) {
                        BillardsGameTable.runComboPopup(0.25, {
                            num: this.countTurn
                        }, function (err, data) {
                            if (!err) {
                                this.runNextTurnEffect(message);
                            }
                            //
                        }.bind(this))
                    } else {
                        this.runNextTurnEffect(message);
                    }
                    //check turn hien tai de set combo
                    if (!this.currTurn) {
                        var ballEat = JSON.parse(message.ballEat);
                        if (ballEat.length == 0 || ballEat.indexOf(0) !== -1) {
                            this.countTurn = -1;
                        }
                    }
                    if (this.currTurn && this.currTurn !== message.turnId) {
                        this.countTurn = -1;
                    }
                    this.currTurn = message.turnId;
                    //end
                } else {
                    var clientBallObj = BillardsGameTable.getBallsInTable();
                    if (Utils.Malicious.isJsonString(message.dataBall)) {
                        var serverBall = JSON.parse(message.dataBall);
                        BillardsGameTable.clearAllBallOnTable(message.ballEat);
                        BillardsGameTable.reRenderBallPosition(serverBall, clientBallObj);
                    }

                    this.countTurn = -1;
                    BillardsGameTable.blockTouchEvent();
                    turnHint = BiDaConstant.PSEUDO_CONST.LUOT_DANH_CUA_DOI_THU;
                    message.turnHint = turnHint;
                    this.runNextTurnEffect(message);
                }

                this._tmpMessageEndTurn = message;
            }
        }
    },
    getBidaGameTable: function () {
        var BillardsGameTable = this.node.getComponent("BillardsGameTable");
        if (BillardsGameTable && BillardsGameTable.isValid) {
            return BillardsGameTable
        }
        return null;
    },
    runNextTurnEffect: function (message) {
        var BillardsGameTable = this.getBidaGameTable();
        if (BillardsGameTable) {
            BillardsGameTable.runTurnAnimation(message.turnHint, function (err, data) {
                if (!err) {
                    if (message.hasOwnProperty("players")) {
                        for (let i = 0; i < message.players.length; i++) {
                            var player = message.players[i];
                            var listBallOnHand = this.addListBiCanAn(player);
                            if (Number(player.id) == message.players[0].userId) {
                                //hop le
                                if (listBallOnHand.length == 7) {
                                    BillardsGameTable.showBallListDisplay(listBallOnHand, BiDaConstant.PSEUDO_CONST.KIEU_BI_CUA_MINH, true, true);
                                }
                            } else if (Number(player.id) == message.players[1].userId) {
                                if (listBallOnHand.length == 7) {
                                    BillardsGameTable.showBallListDisplay(listBallOnHand, BiDaConstant.PSEUDO_CONST.KIEU_BI_CUA_DOI_THU, true, true);
                                }
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

    setTurnPlayer: function (count) {
        var popupTurnJs = this.popupTurn.getComponent("PopupTurn");
        if (this.popupTurn) {
            if (this.idplayerLuotDanh == this.myUserId) {
                this.popupTurn.active = true;
                if (count == 0) {
                    popupTurnJs.setDenLuotBan();
                }
                if (count >= 2) {
                    popupTurnJs.setCombo(count);
                }
            } else {
                this.popupTurn.active = false;
                this.touchEventListener.emit(BiDaConstant.GAME_TABLE_EVENT.RESET_GOC_BAN_BI_TRANG, {});
                this.touchEventListener.emit(BiDaConstant.GAME_TABLE_EVENT.YEU_CAU_AN_POPUP_GOC_BI_TRANG_DO_CHUA_DEN_TURN, {});
            }

        }
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
    setMucCuoc: function (message) {
        this.txtMucCuoc.string = Utils.Malicious.moneyWithFormat(message.minMoney, ",");
    },
    setTiSo: function (message) {
        this.txtTiSo.string = "0 - 0";
    },
    setIndexTable: function (message) {
        this.txtTable.string = "Bàn " + message.tableIndex;
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
                this.node.children[i].destroy();
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
        //this.node.on(BiDaConstant.GAME_TABLE_EVENT.DANG_XAC_LAP_VI_TRI_VA_GOC_QUAY, this.onDangXacLapGocBanBi, this);
        //this.node.on(BiDaConstant.GAME_TABLE_EVENT.DANG_XAC_LAP_LUC_BAN_BI, this.onDangXacLapLucBanBi, this);
        //this.node.on(BiDaConstant.GAME_TABLE_EVENT.XAC_LAP_VI_TRI_GOC_BAN, this.onDaXacLapGocBanBi, this);
        //this.node.on(BiDaConstant.GAME_TABLE_EVENT.GUI_THONG_TIN_LUC_BAN_LEN_CHO_NGUOI_DUNG_KHAC, this.onGuiThongTinLucBanBi, this);
        this.node.on(BiDaConstant.GAME_TABLE_EVENT.CHO_PHEP_GUI_DATA_LEN_SERVER, this.onKetQuaVaChamCue, this);
        this.node.on(BiDaConstant.GAME_TABLE_EVENT.YEU_CAU_DAT_LAI_BI_CAI, this.onYeuCauDatLaiBiCai, this);
        this.node.on(BiDaConstant.GAME_TABLE_EVENT.NGUOI_CHOI_KHAC_DANG_CHON_VI_TRI_DAT_BI_CAI, this.onNguoiChoiDangDatLaiBiCai, this);
        // this.touchEventListener.on(BiDaConstant.GAME_TABLE_EVENT.DANG_XAC_LAP_LUC_DANH_CUA_GAY, this.onDaXacLapGocVaViTriRayCast, this);
        this.node.on(BiDaConstant.POPUP_EVENT.SETTING.OPEN, this.onBtnClick, this);
        // Hết thời gian lượt đánh cho bia offline
        this.node.on(BiDaConstant.GAME_COMMONS_EVENT.OFFLINE_TIME_OUT, this.onTimeOut, this);
        this.node.on(BiDaConstant.POPUP_EVENT.FRIEND_ZONE.OPEN, this.onBtnClick, this);
        this.node.on(BiDaConstant.POPUP_EVENT.FRIEND_ZONE.CLOSE, this.onBtnClick, this);
    },
    onDestroy() {
        NewAudioManager.playAudioSource("leaveboard");
        Linker.BiDaOfflineController = null;
        Linker.otherPlayerIdAvatar = null;
        if (this.restoreUserData != null) {
            Linker.userData = this.restoreUserData;
        }
    },

    start() {

    },
    settingBtnClick() {
        // cc.find("Canvas/Setting").active = true;
    },
    backHandlerBtn: function (event) {
        if (event.keyCode == cc.macro.KEY.back || event.keyCode == cc.macro.KEY.backspace) {
            this.backBtn();
        }
    },
    backBtn() {
        this.leaveTableRequest();
    },
    onDangXacLapGocBanBi(e) {
        if (e) {
            var data = {
                cueStatus: BiDaConstant.TABLE_STATUS.MOVING_CUE, //trạng thái di chuyển cây cơ
                ballX: e.position.x,
                ballY: e.position.y,
                cueR: Utils.Type.isNumber(e.rotation) ? e.rotation : 0, //cueRotation góc xoay của gậy
                ballEat: "#", //chưa có ball trúng hay rơi xuống lỗ
                ballList: "#"
                // ballY: Utils.Type.isNumber(e.positionBall.y) ? e.positionBall.y : null,
                // ballX: Utils.Type.isNumber(e.positionBall.x) ? e.positionBall.x : null
            };
            if (Utils.Malicious.isValidObj(data)) {
                if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
                    // var send = BiDaSend.turnCardRequest(Linker.ZONE, this.tableId, data);
                    // Linker.Socket.send(send);
                } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
                    // if (this.idplayerLuotDanh == this.myUserId) {
                    //     var send = BiDaSend.turnCardRequest(Linker.ZONE, this.tableId, data);
                    //     Linker.Socket.send(send);
                    // }
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
                cueR: Utils.Type.isNumber(e.rotation) ? e.rotation : 0, //cueRotation góc xoay của gậy
                ballEat: "#", //chưa có ball trúng hay rơi xuống lỗ
                ballList: "#"
                // ballY: Utils.Type.isNumber(e.positionBall.y) ? e.positionBall.y : null,
                // ballX: Utils.Type.isNumber(e.positionBall.x) ? e.positionBall.x : null
            };
            if (Utils.Malicious.isValidObj(data)) {
                if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
                    // var send = BiDaSend.turnCardRequest(Linker.ZONE, this.tableId, data);
                    // Linker.Socket.send(send);

                } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
                    if (this.idplayerLuotDanh == this.myUserId) {
                        this.hienThiCueBox(true, e, true);
                        this.hienThiAccRuleBox(true, null);
                        //cc.log("BD: gui thông số tọa độ cue khi đang move cue ...", data);
                        // var send = BiDaSend.turnCardRequest(Linker.ZONE, this.tableId, data);
                        // Linker.Socket.send(send);
                    } else {
                        this.hienThiCueBox(true, e, false);
                        this.hienThiAccRuleBox(false, null);
                        //cc.log("BD: chi update position rotation bida ma khong...", e.rotation, e.position);
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
                ballX: e.position.x,
                ballY: e.position.y,
                cueR: Utils.Type.isNumber(e.rotation) ? e.rotation : 0, //cueRotation góc xoay của gậy
                ballEat: "#", //chưa có ball trúng hay rơi xuống lỗ
                ballList: "#"
                // ballY: Utils.Type.isNumber(e.positionBall.y) ? e.positionBall.y : null,
                // ballX: Utils.Type.isNumber(e.positionBall.x) ? e.positionBall.x : null
            };
            if (Utils.Malicious.isValidObj(data)) {
                if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
                    // var send = BiDaSend.turnCardRequest(Linker.ZONE, this.tableId, data);
                    // Linker.Socket.send(send);
                } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
                    if (this.idplayerLuotDanh == this.myUserId) {
                        // this.capNhatGocBan(e);
                        // cc.log("BD: thông số tọa độ cue khi dragging ...", data);
                        // var send = BiDaSend.turnCardRequest(Linker.ZONE, this.tableId, data);
                        // Linker.Socket.send(send);
                    }
                }

            } else {
                //cc.log("Khong the gui duoc data nay, mot hoac nhieu phan tu khong hop le ...", data);
            }
        } else {
            cc.Global.showMessage("BD: Gửi tọa độ và góc quay của cây cơ không hợp lệ ...");
        }
    },
    onDaXacLapGocVaViTriRayCast: function (data) {
        this.touchEventListener.emit("yeu_cau_hien_thi_raycast_node", false);
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
                cueR: Utils.Type.isNumber(e.cue) ? e.cue : 0, //cueRotation góc xoay của gậy
                ballEat: "#", //chưa có ball trúng hay rơi xuống lỗ
                ballList: (e.ballList) ? e.ballList : "#"
            };
            if (Utils.Malicious.isValidObj(data)) {
                if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
                    // var send = BiDaSend.turnCardRequest(Linker.ZONE, this.tableId, data);
                    // Linker.Socket.send(send);
                } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
                    if (Number(this.idplayerLuotDanh) == Number(this.myUserId)) {
                        // var send = BiDaSend.turnCardRequest(Linker.ZONE, this.tableId, data);
                        // Linker.Socket.send(send);
                    } else {
                        //cc.log("Khong the gui do khong phai turn cua ban, ...");
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
                ballList: "#"
            };
            if (Utils.Malicious.isValidObj(data)) {
                if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
                    // var send = BiDaSend.turnCardRequest(Linker.ZONE, this.tableId, data);
                    // Linker.Socket.send(send);
                } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
                    if (Number(this.idplayerLuotDanh) == Number(this.myUserId)) {
                        // var send = BiDaSend.turnCardRequest(Linker.ZONE, this.tableId, data);
                        // Linker.Socket.send(send);
                    } else {
                        //cc.log("Khong the gui do khong phai turn cua ban, ...");
                    }
                }
            } else {
                //cc.log("Khong the gui duoc data nay, mot hoac nhieu phan tu khong hop le ...", data);
            }
        } else {
            cc.Global.showMessage("BD: Gửi tọa độ và góc quay của cây cơ không hợp lệ ...");
        }
    },
    onKetQuaVaChamCue(event) {
        if (this.isEndGame == false) {
            if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
                if (event) {
                    var turnId = 0;
                    var ballEat = this.convertBallEat(event.ballEat);
                    var arrBallEat = ballEat.split(',');
                    if (this.idplayerLuotDanh == this.tableInfo.listPlayer[0].userId) {
                        if (!arrBallEat.includes("")) {
                            if (arrBallEat.includes("8") || arrBallEat.includes("0")) {
                                if (arrBallEat.includes("8")) {
                                    if (this.tableInfo.listPlayer[0].player_list_ball_an.length == 7) {
                                        this.onEndGame(this.tableInfo.listPlayer[0], this.tableInfo.listPlayer[1]);
                                    } else {
                                        this.onEndGame(this.tableInfo.listPlayer[1], this.tableInfo.listPlayer[0]);
                                    }
                                    return;
                                } else if (arrBallEat.includes("0")) {
                                    turnId = this.tableInfo.listPlayer[1].userId;
                                    this.showMessage("turn", this.tableInfo.listPlayer[1].viewName, null);
                                    Linker.userData = this.tableInfo.listPlayer[1];
                                    this.myUserId = turnId;
                                    this.countTurn = -1;
                                    event.cueStatus = 0;
                                    event.cueR = 8891;
                                }
                            } else {
                                if (this.compareBallAnVSBallTrenTay(this.tableInfo.listPlayer[0].player_list_ball_tren_tay, arrBallEat) || this.isFirstEatBall) {
                                    turnId = this.tableInfo.listPlayer[0].userId;
                                    this.showMessage("turn", this.tableInfo.listPlayer[0].viewName, null);
                                    Linker.userData = this.tableInfo.listPlayer[0];
                                    this.isFirstEatBall = false;
                                } else {
                                    turnId = this.tableInfo.listPlayer[1].userId;
                                    this.showMessage("turn", this.tableInfo.listPlayer[1].viewName, null);
                                    Linker.userData = this.tableInfo.listPlayer[1];
                                    this.myUserId = turnId;
                                    this.countTurn = -1;
                                }
                            }
                        } else if (arrBallEat[0] == "") {
                            turnId = this.tableInfo.listPlayer[1].userId;
                            this.showMessage("turn", this.tableInfo.listPlayer[1].viewName, null);
                            Linker.userData = this.tableInfo.listPlayer[1];
                            this.myUserId = turnId;
                            this.countTurn = -1;
                        }
                        this.updateListBallTrenTay(this.tableInfo.listPlayer[0], this.tableInfo.listPlayer[1], ballEat);
                    } else {
                        if (!arrBallEat.includes("")) {
                            if (arrBallEat.includes("8") || arrBallEat.includes("0")) {
                                if (arrBallEat.includes("8")) {
                                    if (this.tableInfo.listPlayer[1].player_list_ball_an.length == 7) {
                                        this.onEndGame(this.tableInfo.listPlayer[1], this.tableInfo.listPlayer[0]);
                                    } else {
                                        this.onEndGame(this.tableInfo.listPlayer[0], this.tableInfo.listPlayer[1]);
                                    }
                                    return;
                                } else if (arrBallEat.includes("0")) {
                                    turnId = this.tableInfo.listPlayer[0].userId;
                                    this.showMessage("turn", this.tableInfo.listPlayer[0].viewName, null);
                                    Linker.userData = this.tableInfo.listPlayer[0];
                                    this.myUserId = turnId;
                                    this.countTurn = -1;
                                    event.cueStatus = 0;
                                    event.cueR = 8891;
                                }
                            } else {
                                if (this.compareBallAnVSBallTrenTay(this.tableInfo.listPlayer[1].player_list_ball_tren_tay, arrBallEat) || this.isFirstEatBall) {
                                    turnId = this.tableInfo.listPlayer[1].userId;
                                    this.showMessage("turn", this.tableInfo.listPlayer[1].viewName, null);
                                    Linker.userData = this.tableInfo.listPlayer[1];
                                    this.isFirstEatBall = false;
                                } else {
                                    turnId = this.tableInfo.listPlayer[0].userId;
                                    this.showMessage("turn", this.tableInfo.listPlayer[0].viewName, null);
                                    Linker.userData = this.tableInfo.listPlayer[0];
                                    this.myUserId = turnId;
                                    this.countTurn = -1;
                                }
                            }
                        } else if (arrBallEat[0] == "") {
                            turnId = this.tableInfo.listPlayer[0].userId;
                            this.showMessage("turn", this.tableInfo.listPlayer[0].viewName, null);
                            Linker.userData = this.tableInfo.listPlayer[0];
                            this.myUserId = turnId;
                            this.countTurn = -1;
                        }
                        this.updateListBallTrenTay(this.tableInfo.listPlayer[1], this.tableInfo.listPlayer[0], ballEat);
                    }

                    var data = {
                        status: 1,
                        cueStatus: event.cueStatus, //trạng thái update ket qua
                        ballX: event.ballX,
                        ballY: event.ballY,
                        cueR: event.cueR, //cueRotation góc xoay của gậy
                        ballEat: `[${ballEat}]`, //ball trúng hay rơi xuống lỗ
                        ballList: event.ballList,
                        otp: Otp.genOTPCode(),
                        turnId: turnId,
                        players: this.tableInfo.listPlayer
                    };

                    this.onTurnCardRespone(data);
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
                        otp: Otp.genOTPCode()
                    };
                    if (Utils.Malicious.isValidObj(data)) {
                        // var send = BiDaSend.turnCardRequest(Linker.ZONE, this.tableId, data);
                        // Linker.Socket.send(send);
                    } else {
                        //cc.log("Khong the gui duoc data nay, mot hoac nhieu phan tu khong hop le ...", data);
                    }
                }
            }
        }
    },
    onTimeOut: function (event) {
        var data = {
            status: 1,
            cueStatus: BiDaConstant.TABLE_STATUS.AUTO_NEXT_TURN, //trạng thái update ket qua
            ballX: 0,
            ballY: 0,
            cueR: 0, //cueRotation góc xoay của gậy
            ballEat: "", //ball trúng hay rơi xuống lỗ
            ballList: "",
        };
        this.isSendData = false;
        this.onKetQuaVaChamCue(data);
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
                var num = Number(id_ball_lose);

                if (!isNaN(num)) {
                    if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
                        if (this.idplayerLuotDanh == this.myUserId) {
                            var numSharp = "#" + num.toString();
                            var listBall = BillardsGameTable.id_ball_lose;
                            if (listBall.indexOf(numSharp) == -1) {
                                cc.log("Push", numSharp);
                                BillardsGameTable.id_ball_lose.push(numSharp);
                            }
                        } else {
                            BillardsGameTable.id_ball_lose = [];
                        }
                    } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
                        var numSharp = "#" + num.toString();
                        var listBall = BillardsGameTable.id_ball_lose;
                        if (listBall.indexOf(numSharp) == -1) {
                            cc.log("Push", numSharp);
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
            if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
                if (this.idplayerLuotDanh == this.myUserId) {
                    if (Utils.Malicious.isValidObj(data)) {
                        // var send = BiDaSend.turnCardRequest(Linker.ZONE, this.tableId, data);
                        // Linker.Socket.send(send);
                    } else {
                        //cc.log("Khong the gui duoc data nay, mot hoac nhieu phan tu khong hop le ...", data);
                    }
                }
            }
        }
    },
    onYeuCauDatLaiBiCai: function (event) {
        var data = {
            pos: event.position,
            anim_id: 0,
            bg_sprite_frame: 0,
            animation_sprite_frame: 0,
            id: 0
        };
        var BillardsGameTable = this.getBidaGameTable();
        if (BillardsGameTable) {
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
                    BillardsGameTable.setNextTurn1vs4();
                } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
                    if (this.idplayerLuotDanh == this.myUserId) {
                        BillardsGameTable.addOneBiWithData(data);
                        var railCmp = BillardsGameTable.getRailingBagComponent();
                        if (railCmp) {
                            railCmp.removeBallWithId(0);
                        }
                        this.guiDataDatLaiBiTrang(data);
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
                if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
                    // var send = BiDaSend.turnCardRequest(Linker.ZONE, this.tableId, data);
                    // Linker.Socket.send(send);
                } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
                    if (this.idplayerLuotDanh == this.myUserId) {
                        // var send = BiDaSend.turnCardRequest(Linker.ZONE, this.tableId, data);
                        // Linker.Socket.send(send);
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
    responseDangDatLaiBiCai: function (message) {
        if (this.idplayerLuotDanh == this.myUserId) {
            // this.touchEventListener.emit(BiDaConstant.GAME_TABLE_EVENT.CHO_PHEP_NGUOI_DUNG_CLICK_CHUOT, {});
            // this.touchEventListener.emit(BiDaConstant.GAME_TABLE_EVENT.HIEN_THI_GAY_DANH_BI_DA, true, true);
            // this.showBiDichDen(true);
        } else {
            this.touchEventListener.emit(BiDaConstant.GAME_TABLE_EVENT.DANG_DAT_LAI_VI_TRI_BI_TRANG_TMP_TU_SERVER, cc.v2(message.ballX, message.ballY));
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
        var BillardsGameTable = this.getBidaGameTable();
        if (BillardsGameTable && BillardsGameTable.isValid) {
            if (Global.Announcement.AnnouncePrefab && Global.Announcement.GlobalNodePrefab) {
                var gNode = cc.instantiate(Global.Announcement.GlobalNodePrefab);
                var gNodeC = gNode.getComponent("GlobalNode");
                gNodeC.active = true;
                if (gNodeC) {
                    Global.Announcement._addChild(gNode);
                    var _this = this;
                    gNodeC.alert("message_confirm_exit_offline", G.AT.OK_CANCEL, () => {
                        Global.Announcement._removeAllChild();
                        Global.Announcement.AnnounceNode.active = false;
                        _this.loadHomeScenes();

                    }, () => {
                        Global.Announcement._removeAllChild();
                        Global.Announcement.AnnounceNode.active = false;
                    });
                } else {
                    cc.log("Không tìm thấy gNode component, thông báo rời bàn offline...");
                    this.loadHomeScenes();
                }
            } else {
                this.loadHomeScenes();
            }
        }
    },
    removeBallSafe: function () {
        var canvas = cc.find("Canvas");
        if (canvas) {
            var PhysicsManager = canvas.getComponent("PhysicsManager");
            if (PhysicsManager) {
                PhysicsManager.onDisable();
            }
        }
    },
    loadHomeScenes: function (cb) {
        var _self = this;
        Linker.CURRENT_TABLE = null;
        cc.Global.showLoading();
        if (Linker.Config) {
            cc.director.preloadScene("BiDaHomeScene", function (completedCount, totalCount, item) {
                var percent = completedCount / totalCount;
            }, function (err, data) {
                cc.Global.hideLoading();
                var userData = Linker.Local.readUserData();
                userData.autoLogin = false;
                Linker.Local.saveUserData(userData);
                if (!err) {
                    _self.removeBallSafe();
                    cc.director.loadScene('BiDaHomeScene', () => {
                        if (cb) {
                            cb(false, data);
                        }
                        cc.Global.hideLoading();
                    });
                } else {
                    cc.log("Không thể load lại home scen lỗi xảy ra...");
                    if (cb) {
                        cb(true, null);
                    }
                }
            });
        } else {
            cc.director.preloadScene("BiDaSplash", function (completedCount, totalCount, item) {
                var percent = completedCount / totalCount;
            }, function (err, data) {
                cc.Global.hideLoading();
                if (!err) {
                    _self.removeBallSafe();
                    cc.director.loadScene('BiDaSplash', () => {
                        cc.Global.hideLoading();
                        if (cb) {
                            cb(false, data);
                        }
                    });
                } else {
                    cc.log("Không thể load lại home scen lỗi xảy ra...");
                    if (cb) {
                        cb(true, null);
                    }
                }
            });
        }
    },
    moiChoiBtnClick() {
        if (this.gameState == 0) {
            cc.find("Canvas/InviteSendDialog").active = true;
        } else {
            cc.Global.showMessage(i18n.t("Bạn không thể mời khi đang chơi"));
        }
    },

    onGameEndResponse(message) {
        var BillardsGameTable = this.getBidaGameTable();
        if (BillardsGameTable && BillardsGameTable.isValid) {
            if (message.status == 1) {
                this.isEndGame = true;
                cc.log(message);
                if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
                    cc.log("end game 1vs4 mode", message)
                } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {

                    BillardsGameTable.init();
                    //data player
                    var playerData = {
                        players: [BillardsGameTable.myUserInfo, BillardsGameTable.otherUserInfo],
                        money: 0
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

                    BillardsGameTable.runEndGamePoup(7, playerData, type, function (err, data) {
                        if (!err) {
                            this.endGameLogic(message);
                        }
                    }.bind(this));
                }

                // nohu
                if (this.myUserId == Number(message.userIdNohu)) {
                    BillardsGameTable.addCofferEffect(message.moneyNohu);
                }
            } else {
                this.isEndGame = false;
            }
        }

    },

    endGameLogic: function (message) {
        cc.log("END_GAME", message);
        this.gameState = BiDaConstant.GAME_STATE.WAIT;
        if (this.isLeaveTable) {
            Linker.Socket.send(CommonSend.leaveTableRequest(this.tableId));
            cc.Global.showMessage(i18n.t("Bạn vừa rời phòng"));
        } else {
            cc.log("this.handleMatchStartGame();end game", message);
            this.handleMatchStartGame();
        }
        switch (this.gameState) {
            case BiDaConstant.GAME_STATE.WAIT: {
                break;
            }
            case BiDaConstant.GAME_STATE.PLAYING: {

                break;
            }
        }
    },
    onPlayerJoinedResponse(message) {
        var BillardsGameTable = this.getBidaGameTable();
        if (BillardsGameTable && BillardsGameTable.isValid) {
            if (message.status == 1) {
                NewAudioManager.playClick("joinboard");
                switch (this.gameState) {
                    case BiDaConstant.GAME_STATE.WAIT: {
                        if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
                            cc.log("join 1vs4 1vs4 mode", message);
                            BillardsGameTable.addOtherPlayerJoined(message);
                            // BillardsGameTable.initTableInfo(message);
                        } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
                            cc.log("this.handleMatchStartGame(); joned")
                            this.handleMatchStartGame(message.turnId);
                            BillardsGameTable.addOtherPlayerJoined(message);
                        }
                        this.hidePopupInvite();
                        break;
                    }
                    case BiDaConstant.GAME_STATE.PLAYING: {

                        break;
                    }
                    default:
                        break;
                }
            } else {

            }
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
        if (message.status == 1) {
            if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
                cc.log("reconnect 1vs4 mode", message)
            } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
                NewAudioManager.playAudioSource("joinboard");
                this.tableId = message.tableId;
                this.listPlayer = message.listPlayer;
                this.setMucCuoc(message);
                this.setPlayersPlaying(this.listPlayer);
                this.setBallList(this.listPlayer);
                cc.log("TEST11: ", this.myUserId);
                cc.log("Test2:", message.currentPlayerId);
                this.dataBallReconnect = message.allInTable.length > 0 ? JSON.parse(message.allInTable) : [];
                this.currentPlayerId = message.currentPlayerId;
                this.all_ball_da_an = message.all_ball_da_an;
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
            //an hien thi cac bi dang co cua doi thu
            BillardsGameTable.hideAllOtherBallistDisplay();
            var userInfoComponentOther = BillardsGameTable.otherUserInfo.getComponent("BillardUserView");
            if (userInfoComponentOther) {
                userInfoComponentOther.hidePlayer();
            }
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
    onTurnCardRespone(message) {
        var BillardsGameTable = this.getBidaGameTable();
        if (BillardsGameTable) {
            if (message.status == 1 && this.isEndGame == false) {
                if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
                    BillardsGameTable._isServerWaiting = false;
                    BillardsGameTable._isDataEndTurnGame = true;
                    BillardsGameTable.setUserIdOffline(message.turnId);
                    BillardsGameTable.unBlockTouchEvent();
                    if (message.dataBall) {
                        this.dataBallResponse = message.dataBall.length > 0 ? JSON.parse(message.dataBall) : [];
                    }
                }
                //cap nhat status cua gay
                switch (message.cueStatus) {
                    case BiDaConstant.TABLE_STATUS.MOVING_CUE:
                        if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
                            var touch_id = message.cueR;
                            if (parseInt(touch_id) === BiDaConstant.TABLE_STATUS.DRAGGING_CUE_BOX) {
                                if (this.idplayerLuotDanh != this.myUserId) {
                                    var cue = BillardsGameTable.cue;
                                    if (cue && cue.isValid) {
                                        //cap nhat vi tri goc quay cua gay
                                        cue.position = message.cueP;
                                        BillardsGameTable.panelPower.active = true;
                                        BillardsGameTable.panelPower.opacity = 255;
                                    }
                                    // cc.log("Goc quay dang duoc cap nhat tu server...", message);
                                } else {
                                    // cc.log("Luot choi cua minh dang danh khong duoc cap nhat...", message);
                                }

                            } else if (parseInt(touch_id) === BiDaConstant.TABLE_STATUS.DRAG_WHITE_BALL_TO_SHOOT) {
                                var whiteBallDrag = BillardsGameTable.getWhiteBallRepos();
                                var WBallPos = null;
                                if (whiteBallDrag) {
                                    WBallPos = whiteBallDrag.getComponent("WBallPos");
                                    if (WBallPos && WBallPos.isValid) {
                                        WBallPos.onActiveBlock();
                                    }
                                } else {
                                    BillardsGameTable.datLaiViTriBiTrang();
                                    whiteBallDrag = BillardsGameTable.getWhiteBallRepos();
                                    if (whiteBallDrag) {
                                        WBallPos = whiteBallDrag.getComponent("WBallPos");
                                        if (WBallPos && WBallPos.isValid) {
                                            WBallPos.onActiveBlock();
                                        }
                                    } else {
                                        // cc.log("Khong the khoi tao lai bi cai de dat trong ban choi...");
                                    }
                                }
                                if (message.turnId == this.myUserId) {
                                    WBallPos.onDeactiveBlock();
                                    this.idplayerLuotDanh = Number(message.turnId);
                                    this.onEndTurnGame1vs1(message, BiDaConstant.TABLE_STATUS.SETTING_RESULT_TURN);
                                    //cho phep nguoi dung di chuyen bi
                                } else {
                                    WBallPos.onTmpPosition(cc.v2(message.ballX, message.ballY));
                                    //cho phep nguoi dung di chuyen bi
                                }
                            } else if (parseInt(touch_id) === BiDaConstant.TABLE_STATUS.REPOSITION_WHITE_BALL) {
                                if (this.idplayerLuotDanh != this.myUserId) {
                                    BillardsGameTable.removeWhiteBallRepos();
                                    var data = {
                                        pos: cc.v2(message.ballX, message.ballY),
                                        anim_id: 0,
                                        bg_sprite_frame: 0,
                                        animation_sprite_frame: 0,
                                        id: 0
                                    };
                                    BillardsGameTable.addOneBiWithData(data);
                                    var railCmp = BillardsGameTable.getRailingBagComponent();
                                    if (railCmp) {
                                        railCmp.removeBallWithId(0);
                                    }
                                    BillardsGameTable.blockTouchEvent();
                                } else {
                                    BillardsGameTable.unBlockTouchEvent();
                                }
                            } else if (parseInt(touch_id) === BiDaConstant.TABLE_STATUS.WHITE_BALL_ANGLE_ADJUST) {
                                if (this.myUserId != this.idplayerLuotDanh) {
                                    cc.log("bi con con haha");
                                    BillardsGameTable.m_rotate = cc.v2(message.ballX, message.ballY);
                                    var smallRedpoint = BillardsGameTable.redPointNode.getChildByName("Small_RedPoint");
                                    if (smallRedpoint) {
                                        var x = BillardsGameTable.m_rotate.x * 30 + BillardsGameTable.redPointNode.width * 0.5;
                                        var y = BillardsGameTable.m_rotate.y * 30 + BillardsGameTable.redPointNode.height * 0.5;
                                        smallRedpoint.position = cc.v2(x, y);
                                    }
                                } else { }
                            } else {
                                if (this.idplayerLuotDanh != this.myUserId) {
                                    var cue = BillardsGameTable.cue;
                                    if (cue && cue.isValid) {
                                        //cap nhat vi tri goc quay cua gay
                                        cue.rotation = message.cueR;
                                        cue.position = message.cueP;
                                    }
                                    // cc.log("Goc quay dang duoc cap nhat tu server...", message);
                                } else {
                                    // cc.log("Luot choi cua minh dang danh khong duoc cap nhat...", message);
                                }

                            }
                        } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
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
                        }
                        break;
                    case BiDaConstant.TABLE_STATUS.UPDATE_GOC_BAN_BI:
                        if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
                            // cc.log("UPDATE_GOC_BAN_BI_CUOI_CUNG", message);
                            if (this.idplayerLuotDanh != this.myUserId) {
                                var cue = BillardsGameTable.cue;
                                if (cue && cue.isValid) {
                                    //cap nhat vi tri goc quay cua gay
                                    cue.rotation = message.cueR;
                                    cue.position = message.cueP;
                                }
                            } else { }
                            // this.onUpdateGocBanBiTuServer(message);
                        } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
                            // cc.log("UPDATE_GOC_BAN_BI_CUOI_CUNG", message);
                        }
                        break;
                    case BiDaConstant.TABLE_STATUS.END_DRAGGING_CUE:
                        if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
                            //thay doi turn id luot danh
                            if (Number(this.idplayerLuotDanh) != Number(this.myUserId)) {
                                BillardsGameTable.giveBallAPowerFromServer(message.cueAR, message.force);
                            } else { }
                        } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
                            // cc.log("UPDATE_LUC_BAN_BI_CUOI_CUNG", message);
                        }
                        break;
                    case BiDaConstant.TABLE_STATUS.SETTING_RESULT_TURN:
                        if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
                            cc.log("next turn binh thuong onTurnCardRespone", message);
                            message._isNormalNextTurn = true;
                            this.onEndTurnGame1vs1(message, BiDaConstant.TABLE_STATUS.SETTING_RESULT_TURN);
                        } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
                            //xu ly phan logic game 1vs4 phu thuoc vao ballErrorId cua nguoi choi
                            message._isNormalNextTurn = true;
                            this.onEndTurnGame1vs4(message, BiDaConstant.TABLE_STATUS.SETTING_RESULT_TURN);
                        }
                        break;
                    case BiDaConstant.TABLE_STATUS.AUTO_NEXT_TURN:
                        if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
                            cc.log("auto next turn onTurnCardRespone", message);
                            message._isNormalNextTurn = false;
                            this.onEndTurnGame1vs1(message, BiDaConstant.TABLE_STATUS.AUTO_NEXT_TURN);
                        } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
                            //logic 1vs4 khong co tu dong next turn
                        }
                        break;
                    default:
                        break;
                }

            } else {
                cc.Global.showMessage(i18n.t(message.error));
            }
        }

    },
    resetUIBiDaTable: function (message) {
        this.touchEventListener.emit(BiDaConstant.GAME_TABLE_EVENT.SET_USER_TURN_ID, this.idplayerLuotDanh);
        var isMyTurn = false;
        if (this.myUserId == this.idplayerLuotDanh) {
            isMyTurn = true;
            this.showBiDichDen(true);
        } else {
            isMyTurn = false;
            this.showBiDichDen(false);
            this.touchEventListener.emit(BiDaConstant.GAME_TABLE_EVENT.NGAT_KHONG_CHO_NGUOI_DUNG_CLICK_CHUOT, {});
            this.touchEventListener.emit(BiDaConstant.GAME_TABLE_EVENT.CAP_NHAT_VI_TRI_VA_GOC_QUAY_CUA_GAY_TU_SERVER_GUI_XUONG, {
                rotation: message.cueR,
                position: message.cueP
            });
        }
        if (message.cueR == BiDaConstant.TABLE_STATUS.WHITE_BALL_IN_A_HOLE) {
            //cho phep chon vi tri dat bi
            var mainGameJS = this.mainGame.getComponent("BiDaMainGame");
            if (mainGameJS) {
                mainGameJS.datLaiViTriBiTrang();
                if (isMyTurn) {
                    this.touchEventListener.emit(BiDaConstant.GAME_TABLE_EVENT.CHO_PHEP_NGUOI_DUNG_THAY_DOI_VI_TRI_BI_TRANG, {});
                } else {
                    this.touchEventListener.emit(BiDaConstant.GAME_TABLE_EVENT.KHONG_CHO_PHEP_NGUOI_DUNG_THAY_DOI_VI_TRI_BI_TRANG, {});
                }
            } else {
                //cc.log("Không tìm thấy đối tượng bidamaingame ... ");
            }
        } else {
            this.touchEventListener.emit(BiDaConstant.GAME_TABLE_EVENT.CHO_PHEP_NGUOI_DUNG_CLICK_CHUOT, {});
        }
    },
    configGayDanhBi: function (me, other) {
        if (this.myUserId == this.idplayerLuotDanh) {
            this.touchEventListener.emit(BiDaConstant.GAME_TABLE_EVENT.HIEN_THI_GAY_DANH_BI_DA, me.show, me.posdefault, me.data);

        } else {
            this.touchEventListener.emit(BiDaConstant.GAME_TABLE_EVENT.HIEN_THI_GAY_DANH_BI_DA, other.show, other.posdefault, other.data);
        }
    },
    onUpdateGocBanBiTuServer: function (message) {
        //////cc.log("BD: bida cue draging now ...", message);
        if (this.myUserId == this.idplayerLuotDanh) {
            //kich hoat cue box
            this.hienThiCueBox(true, null, true);
            this.hienThiAccRuleBox(true, null);
        } else {
            this.touchEventListener.emit("xac_lap_goc_danh_cua_nguoi_choi_khac", {
                rotation: message.cueR,
                position: message.cueP
            });
            this.hienThiCueBox(true, null, false);
            this.hienThiAccRuleBox(false, null);
        }
    },
    onShootingCueServer: function (message) {
        // //////cc.log("BD: bida cue shooting now ...", message);
        cc.log("BD: my id ", this.myUserId, "turn id message", message.turnId, "status:" + message.cueStatus);
        if (this.myUserId == this.idplayerLuotDanh) {
            //nếu đang đến lượt của bạn thì không cần update vị trí chuột làm gì cả
            // //////cc.log("BD: den luot toi thi khong shooting ...", message);
        } else {
            this.touchEventListener.emit("wball_shooting_cue_server", {
                wpos: message.wpos,
                cueAR: message.cueAR,
                force: message.force
            });
        }
    },
    onLeaveTableRespone(message) {
        cc.log("co nguoi ra ban", message)
        if (message.status == 1) {

            if (this.myUserId == message.userId) {
                switch (this.gameState) {
                    case BiDaConstant.GAME_STATE.WAIT: {
                        if (Number(message.cancelStatus) == 0) {
                            var customEvent = new cc.Event.EventCustom(BiDaConstant.GAME_LOBBY_EVENT.REQUEST_LOBBY_FOR_ZONE_ID_TYPE, true);
                            customEvent.ZONE = Linker.ZONE;
                            customEvent.currentButton = null;
                            this.node.dispatchEvent(customEvent);
                            cc.Global.showMessage(i18n.t("Bạn vừa rời phòng"));
                        } else if (Number(message.cancelStatus) == 1) {
                            this.isLeaveTable = true;
                            this.gameState = BiDaConstant.GAME_STATE.PLAYING;
                            cc.Global.showMessage(i18n.t("Bạn vừa đăng ký rời phòng khi hết ván"));

                        } else if (Number(message.cancelStatus) == 2) {
                            this.isLeaveTable = false;
                            cc.Global.showMessage(i18n.t("Bạn vừa hủy rời phòng khi hết ván"));
                        }
                        break;
                    }
                    case BiDaConstant.GAME_STATE.PLAYING: {
                        if (Number(message.cancelStatus) == 1) {
                            cc.Global.showMessage(i18n.t("Bạn vừa đăng ký rời phòng khi hết ván"));
                            this.isLeaveTable = true;
                        } else if (Number(message.cancelStatus) == 2) {
                            this.isLeaveTable = false;
                            cc.Global.showMessage(i18n.t("Bạn vừa hủy rời phòng khi hết ván"));
                        } else {
                            var customEvent = new cc.Event.EventCustom(BiDaConstant.GAME_LOBBY_EVENT.REQUEST_LOBBY_FOR_ZONE_ID_TYPE, true);
                            customEvent.ZONE = Linker.ZONE;
                            customEvent.currentButton = null;
                            this.node.dispatchEvent(customEvent);
                            cc.Global.showMessage(i18n.t("Bạn vừa rời phòng"));
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
                        cc.log("BiDaConstant.GAME_STATE.WAIT leave ");
                        if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
                            cc.log(message);
                            this.resetUserPosition(message);
                        } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
                            cc.log("Mode 1vs4 leave room")
                        }

                        switch (this.myIndex) {
                            case 0: {
                                switch (this.currentCapacity) {
                                    case 1: {

                                        break;
                                    }
                                    default:
                                        break;
                                }
                                break;
                            }

                        }
                        break;
                    }
                    case BiDaConstant.GAME_STATE.PLAYING: {
                        cc.log("BiDaConstant.GAME_STATE.PLAYING: ");
                        cc.log(message);
                        this.resetUserPosition(message);
                        break;
                    }
                    default:
                        break;
                }
            }
        }
    },
    onCreateTableResponse(message) {
        if (message.status == 1) {
            this.gameState = (message.hasOwnProperty("isPlaying") && Number(message.isPlaying) == 0) ? BiDaConstant.GAME_STATE.WAIT : BiDaConstant.GAME_STATE.PLAYING;
            this.tableId = message.tableId;
            this.createTableGame(message);
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
            this.setGameState(message);
            BillardsGameTable.createHeaderUserInfo();
            BillardsGameTable.configPanelUsers();
            BillardsGameTable.init();
            BillardsGameTable.initTableInfo(message);
        } else {
            cc.log("Loi thiet lap thong tin ban choi...");
        }
    },
    onJoinTableResponse(message) {
        // cc.log('*** linker',Linker);
        cc.log("message billard game controller", message)
        if (message.status == 1) {
            this.gameState = (message.hasOwnProperty("isPlaying") && Number(message.isPlaying) == 0) ? BiDaConstant.GAME_STATE.WAIT : BiDaConstant.GAME_STATE.PLAYING;
            this.tableId = message.tableId;
            // NewAudioManager.playAudioSource("joinboard");
            switch (this.gameState) {
                case BiDaConstant.GAME_STATE.WAIT: {
                    //gui setting lai nguoi choi list
                    cc.log("this.handleMatchStartGame();join")
                    this.handleMatchStartGame();
                    this.createTableGame(message);
                    break;
                }
                case BiDaConstant.GAME_STATE.PLAYING: {
                    break;
                }
            }
        }
    },
    onEndGame(win, lose) {
        this.myUserId = lose.userId;
        this.countTurn = -1;
        this.isEndGame = true;
        win.player_list_ball_an = [];
        win.player_list_ball_tren_tay = [];
        win.exp++;

        lose.player_list_ball_an = [];
        lose.player_list_ball_tren_tay = [];
        Linker.userData = lose;
        var BillardsGameTable = this.getBidaGameTable();
        var playerData = {
            players: [BillardsGameTable.myUserInfo, BillardsGameTable.otherUserInfo],
            money: 0,
            winMoney: 0,
            loseMoney: 0
        };

        this.node.getComponent("BillardsGameTable").setUserIdOffline(lose.userId);
        BillardsGameTable.runEndGamePoup(7, playerData, win == this.tableInfo.listPlayer[0] ? 1 : 0, function (err, data) {
            if (!err) {
                this.loadNewMatch(lose.userId);
            }
        }.bind(this))
        // this.showMessage("win", win.viewName, function () {
        //     this.loadNewMatch(lose.userId);
        // }.bind(this));
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
        if (message.status == 1) {

        } else {

        }
    },
    onPlayerReadyResponse(message) {
        if (message.status == 1) {
            switch (this.gameState) {
                case BiDaConstant.GAME_STATE.WAIT: {
                    break;
                }
                case BiDaConstant.GAME_STATE.PLAYING: {
                    break;
                }
            }
        } else {
            cc.Global.showMessage(i18n.t(message.error));
            this.leaveTableRequest();
        }
    },
    onRunAnimationBiRoiLo: function (data) {
        var mainGame = this.getMainGame();
        var BillardsGameTable = this.getBidaGameTable();

        if (mainGame && BillardsGameTable) {
            if (BillardsGameTable) {
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
        this.countTurn = -1;
        this._isCountered = false;
        var BillardsGameTable = this.getBidaGameTable();
        if (BillardsGameTable) {
            if (message.status == 1) {
                BillardsGameTable.hideTimeCountDownBallError();
                this.isFirstEatBall = true;
                this.isEndGame = false;
                this.myUserId = message.turnId;
                this.isLeaveTable = false;
                this.gameState = BiDaConstant.GAME_STATE.PLAYING;
                cc.log("Bat dau tran dau ...", message);
                //nguoi choi luot danh dau tien
                this.idplayerLuotDanh = Number(message.turnId);
                if (this.idplayerLuotDanh == this.tableInfo.listPlayer[0].userId) {
                    BillardsGameTable.setTurnBlur(true);
                } else BillardsGameTable.setTurnBlur(false);
                BillardsGameTable.gameBegin(message);
            } else {
                this.isEndGame = true;
                this.gameState = BiDaConstant.GAME_STATE.WAIT;
                cc.log("Khong the bat dau tran dau ...", message);
            }
        }

    },
    handleMatchStartGame(turnId) {
        var BillardsGameTable = this.getBidaGameTable();
        var _this = this;
        if (BillardsGameTable) {
            if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
                cc.log("Mode 1vs4 controller ...");
            } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
                BillardsGameTable.hideTimeCountDownBallError();
                var dataTimeStart = { time: 3 };
                BillardsGameTable.runBeginMatchAnimation(dataTimeStart, function (err, data) {
                    if (!err) {
                        cc.log("Handle match start successfully ...");
                        var messageStartGame = {
                            messageId: 1108,
                            status: 1,
                            turnId: turnId
                        }
                        _this.showMessage("firstTurn",
                            (turnId == _this.tableInfo.listPlayer[0].userId) ? _this.tableInfo.listPlayer[0].viewName : _this.tableInfo.listPlayer[1].viewName,
                            function () {
                                _this.onMatchStartResponse(messageStartGame);
                            })

                    }
                });

            }
        }
    },
    showProgressTimer: function (id) {
        for (var i = 0; i < this.playerContainer.length; i++) {
            var player = this.playerContainer[i].children[0];
            var playerComponent = player.getComponent("ViewPlayer");
            var userId = playerComponent.getUserID();
            if (userId == id) {
                playerComponent.onProgressTimer(60);

            } else {
                playerComponent.offProgressTimer();
            }
        }
    },
    setRoomInfo(message) {
        if (message) {
            var p = [];
            for (let i = 0; i < this.tableInfo.listPlayer.length; i++) {
                p.push({
                    name: this.tableInfo.listPlayer[i].viewName,
                    money: this.tableInfo.listPlayer[i].userMoney,
                    master: (this.tableInfo.listPlayer[i].isMaster && Number(this.tableInfo.listPlayer[i].isMaster) == 1 ? true : false),
                    id: this.tableInfo.listPlayer[i].userId,
                    exp: this.tableInfo.listPlayer[i].exp,
                    avatar: this.tableInfo.listPlayer[i].avatarId
                });
            }
            this.setPlayersPlaying(p);
        } else {
            //////cc.log("BD: Không thể cài đặt thông tin bàn bida ...", message);
        }
    },
    btnChatClick() {
        // var chatDialog = cc.instantiate(this.ChatDialog);
        // Linker.BiDaTableId = this.tableId;
        // this.node.addChild(chatDialog);
        // chatDialog.setPosition(0, 0);
        //test
        this.getFriendZone(function (error, friendZone) {
            if (!error) {
                friendZone.active = true;
                var friendZoneJS = friendZone.getComponent("FriendsZone");
                if (friendZoneJS) {
                    //yeu cau lay danh sach ban be
                    friendZoneJS.requesInitListFriend();
                    cc.log("We got a friend zone UI, config now ...");
                }
            } else {
                cc.log("Không thể get được UI friend zone ...");
            }
        });
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
    findPlayerByViewName(username) {
        if (this.viewPlayerLeftPrefab) {
            const nameUser1 = this.playerContainer[0].getChildByName("ViewPlayer1").getComponent("ViewPlayer").textName.string;
            if (nameUser1 == username) {
                return "1";
            }
        }
        if (this.viewPlayerRightPrefab) {
            const nameUser2 = this.playerContainer[1].getChildByName("ViewPlayer2").getComponent("ViewPlayer").textName.string;
            if (nameUser2 == username) {
                return "2";
            }
        }
    },
    onChat(data) {
        cc.log('messagedata:', data);
        if (data.error) {
            cc.log(data.error);
            return;
        }
        if (data.id === Linker.userData.userId) {
            // My self -- Playing is
            this.player0.onChat(data);

        } else {
            var player = this.findPlayerByViewName(data.username);
            if (this.playerContainer[0].getChildByName("ViewPlayer1")) {
                var scriptPlayer1 = this.playerContainer[0].getChildByName("ViewPlayer1").getComponent("ViewPlayer");
            }

            if (this.playerContainer[1].getChildByName("ViewPlayer2")) {
                var scriptPlayer2 = this.playerContainer[1].getChildByName("ViewPlayer2").getComponent("ViewPlayer");
            }

            switch (player) {
                case "1":
                    scriptPlayer1.onChat(data, true);
                    break;
                case "2":
                    scriptPlayer2.onChat(data, true);
                    break;
                default:
                    break;
            }
        }
    },

    runNextTurnWaitingFinish: function () {
        var BillardsGameTable = this.getBidaGameTable();
        if (BillardsGameTable && BillardsGameTable.isValid) {
            var message = this._tmpMessageEndTurn;
            if (message) {
                BillardsGameTable.resetUICue();
                BillardsGameTable._isDataEndTurnGame = false;
                if (Number(this.idplayerLuotDanh) == Number(this.myUserId)) {
                    BillardsGameTable._isSendedBeforeTurn = false;
                    message.turnHint = BiDaConstant.PSEUDO_CONST.LUOT_DANH_CUA_MINH;
                    if (this.countTurn > 1) {
                        BillardsGameTable.runComboPopup(0.25, {
                            num: this.countTurn
                        }, function (err, data) {
                            if (!err) {
                                this.runNextTurnEffect(message);
                            }
                        }.bind(this))
                    } else {
                        this.runNextTurnEffect(message);
                    }
                    BillardsGameTable.unBlockTouchEvent();
                } else {
                    message.turnHint = BiDaConstant.PSEUDO_CONST.LUOT_DANH_CUA_DOI_THU;
                    BillardsGameTable._isSendedBeforeTurn = true;
                    var clientBallObj = BillardsGameTable.getBallsInTable();
                    if (Utils.Malicious.isJsonString(message.dataBall)) {
                        var serverBall = JSON.parse(message.dataBall);
                        BillardsGameTable.clearAllBallOnTable(message.ballEat);
                        BillardsGameTable.reRenderBallPosition(serverBall, clientBallObj);
                    }
                    BillardsGameTable.blockTouchEvent();
                    this.runNextTurnEffect(message);
                }
                BillardsGameTable.setNextTurn(message);
            }
        }
    },

    handlePopupStartGame(timeReady) {
        var resultTable = this.node.getChildByName("PopupKetQua");
        if (resultTable) {
            resultTable.removeFromParent(true);
        }

        if (this.labelSecondStart) {
            if (timeReady > 0) {
                if (this.popupStartGame && this.labelSecondStart && this.popupStartGame.isValid && this.labelSecondStart.isValid) {
                    this.labelSecondStart.node.active = true;
                    this.labelBatDauSau.node.active = true;
                    this.popupStartGame.active = true;
                    this.popupStartGame.getChildByName("batdau").active = false;

                }
                var timeRemain = timeReady;
                var startGameCb = function () {
                    this.popupStartGame.getChildByName("batdau").active = false;

                }.bind(this);
                var cb = function () {
                    if (timeRemain < 0) {
                        this.unschedule(cb);
                        this.labelSecondStart.string = `${this.labelTimeStart}`;;
                        this.labelSecondStart.node.active = false;
                        this.labelBatDauSau.node.active = false;
                        this.popupStartGame.active = false;
                        this.popupStartGame.getChildByName("batdau").active = true;
                        this.scheduleOnce(startGameCb, 2);
                        this.gameState = BiDaConstant.GAME_STATE.PLAYING;
                    } else {
                        this.labelSecondStart.string = timeRemain;
                    }
                    timeRemain--;
                }.bind(this);
                this.schedule(cb, 1, timeReady, 0);
            }
        }
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

    setTouchEventListenerReconnect() {
        this.isEndGame = false;
        this.touchEventListener.emit(BiDaConstant.GAME_TABLE_EVENT.SET_USER_TURN_ID, this.idplayerLuotDanh);
        if (this.idplayerLuotDanh == this.currentPlayerId) {
            this.touchEventListener.emit(BiDaConstant.GAME_TABLE_EVENT.CHO_PHEP_NGUOI_DUNG_CLICK_CHUOT, {});
            this.touchEventListener.emit(BiDaConstant.GAME_TABLE_EVENT.HIEN_THI_GAY_DANH_BI_DA, true, true);
            this.showBiDichDen(true);
            this.hienThiCueBox(true, null, true);
        } else {
            this.touchEventListener.emit(BiDaConstant.GAME_TABLE_EVENT.NGAT_KHONG_CHO_NGUOI_DUNG_CLICK_CHUOT, {});
            this.touchEventListener.emit(BiDaConstant.GAME_TABLE_EVENT.HIEN_THI_GAY_DANH_BI_DA, false, true);
            this.showBiDichDen(false);
            this.hienThiCueBox(true, null, false);
        }
    },

    handlePopupWaitUpdateBallReconnect() {
        if (this.node.getChildByName("PopupWaitUpdateBall")) {
            this.node.getChildByName("PopupWaitUpdateBall").active = false;
        }
    },

    hidePopupInvite() {
        var popup = this.node.getParent().getChildByName("PopupInvite1vs1");
        if (popup) popup.active = false;
    },

    setBallHandReconnect() {
        for (var i = 0; i < this.dataBallResponse.length - 1; i++) {
            var idItem = this.all_ball.indexOf(this.dataBallResponse[i].num);
            if (idItem !== -1) this.all_ball.splice(idItem, 1);
            // this.all_ball.filter(item => item !== dataBall[i].num);
        }

        for (var i = 0; i < this.all_ball.length; i++) {
            var idBi = this.all_ball[i];
            var RailChuaBiJS = this.HopChuaBi.getComponent("RailChuaBi");
            if (RailChuaBiJS) {
                RailChuaBiJS.themMotBiRoiXuongLo({
                    id: idBi,
                    isPlayAnimation: false
                })
            }
        }
    },

    convertBallEat(strBallEat) {
        var tempArr = strBallEat.split("#");
        var tempString = "";
        tempArr.shift();
        tempString = tempArr.toString();
        return tempString;
    },

    updateListBallTrenTay(playerAnBall, playerConlai, ballEat) {
        var arrBallEat = ballEat.split(',');
        if ((arrBallEat[0] != "" && (!arrBallEat.includes("0") && !arrBallEat.includes("8"))) || arrBallEat.length > 1) {
            if (playerAnBall.player_list_ball_tren_tay.length == 0 && playerConlai.player_list_ball_tren_tay.length == 0) {
                if (Number(arrBallEat[0]) < 8) {
                    playerAnBall.player_list_ball_tren_tay = this.all_ball.slice(0, 7);
                    playerConlai.player_list_ball_tren_tay = this.all_ball.slice(8);
                } else {
                    playerAnBall.player_list_ball_tren_tay = this.all_ball.slice(8);
                    playerConlai.player_list_ball_tren_tay = this.all_ball.slice(0, 7);
                }
            }
        }


        for (let i = 0; i < arrBallEat.length; i++) {
            if (playerAnBall.player_list_ball_tren_tay.includes(Number(arrBallEat[i]))) {
                playerAnBall.player_list_ball_tren_tay[playerAnBall.player_list_ball_tren_tay.indexOf(Number(arrBallEat[i]))] = -1;
                playerAnBall.player_list_ball_an.push(arrBallEat[i]);
            } else if (playerConlai.player_list_ball_tren_tay.includes(Number(arrBallEat[i]))) {
                playerConlai.player_list_ball_tren_tay[playerConlai.player_list_ball_tren_tay.indexOf(Number(arrBallEat[i]))] = -1;
                playerConlai.player_list_ball_an.push(arrBallEat[i]);
            }
        }
    },

    compareBallAnVSBallTrenTay(ballTrenTay, ballEat) {
        for (let i = 0; i < ballEat.length; i++) {
            if (!ballTrenTay.includes(Number(ballEat[i]))) {
                return false;
            }
        }
        return true;
    },

    showMessage(type, target, cb) {
        switch (type) {
            case 'turn': {
                this.message.string = i18n.t("offline_title_turn", { name: target });
                break;
            }
            case 'win': {
                this.message.string = i18n.t("offline_title_win", { name: target });
                break;
            }
            case 'firstTurn': {
                this.message.string = i18n.t("offline_title_firstTurn", { name: target });
            }
        }
        var tweenOpa = cc.tween().to(0.5, { opacity: 255 }).delay(1.5).to(0.5, { opacity: 0 }).call(function () {
            if (cb) {
                cb();
            }
        })
        tweenOpa.clone(this.message.node.parent).start();
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

    onBtnClick(event) {
        switch (event.type) {
            case BiDaConstant.POPUP_EVENT.SETTING.OPEN: {
                if (this.BillardPanelSetting) {
                    this.BillardPanelSetting.active = true;
                } else {
                    var billardPanelSetting = cc.instantiate(this.billardPanelSetting);
                    this.panelUI.addChild(billardPanelSetting);
                    this.BillardPanelSetting = billardPanelSetting;
                    this.BillardPanelSetting.active = true;
                }
                break;
            }
            case BiDaConstant.POPUP_EVENT.FRIEND_ZONE.OPEN: {
                if (this.FriendsZone) {
                    this.FriendsZone.active = true;
                    var friendContainer = this.FriendsZone.getChildByName("FriendContainer");
                    if (friendContainer) {
                        friendContainer.getChildByName("FriendsList").active = true;
                    }
                } else {
                    var friendsZone = cc.instantiate(this.friendZonePrefab);
                    this.panelUI.addChild(friendsZone);
                    this.FriendsZone = friendsZone;
                    this.FriendsZone.active = true;
                    var friendContainer = this.FriendsZone.getChildByName("FriendContainer");
                    if (friendContainer) {
                        friendContainer.getChildByName("FriendsList").active = true;
                    }
                }
                break;
            }
            case BiDaConstant.POPUP_EVENT.FRIEND_ZONE.CLOSE: {
                if (this.FriendsZone) {
                    this.FriendsZone.active = false;
                }
                break;
            }
            default: {
                break;
            }
        }
    }
});