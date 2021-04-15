var BiDaConstant = require('BiDaConstant');
var Linker = require('Linker');
var CommonSend = require('CommonSend');
var LobbySend = require('LobbySend');
var i18n = require('i18n');
var NewAudioManager = require('NewAudioManager');
var Global = require("Global2");
var DataAccess = require('DataAccess');
var Utils = require('Utils');
cc.Class({
    extends: cc.Component,
    properties: {
        btnGiftCode: cc.Node,
        btnBanBe: cc.Node,
        btnHopThu: cc.Node,
        btnHuongDan: cc.Node,
        btnXuFee: cc.Node,
        btnBuyCue: cc.Node,
        btnXu: cc.Node,
        btnSetting: cc.Node,
        btnEvent: cc.Node,
        BillardTopLobby: cc.Node,
        BillardZoneLobby: cc.Node,
        BillardBottomLobby: cc.Node,
        ListTableLobby: cc.Node,
        itemTable1vs1Prefab: cc.Prefab,
        itemTable1vs4Prefab: cc.Prefab,
        taoBanBida: cc.Prefab,
        betSetting: cc.Node,
        filterMoneyNode: cc.Node,
        logoLobby: cc.Sprite,
        logoBiDaPhom: cc.Node,
        list_logoFrame: [cc.SpriteFrame]
    },
    addCustomEventListenr: function () {
        this.node.on(BiDaConstant.GAME_LOBBY_EVENT.REQUEST_JOIN_TABLE_WITH_TABLE_DATA, this.join, this);
        this.node.on(BiDaConstant.GAME_LOBBY_EVENT.CREATE_TABLE_ADD_ROOM, this.onCreateRoom, this);
        this.node.on(BiDaConstant.BET.BET_SETTING_VALUE, this.clickBtnFilter, this);
    },
    join: function (event) {
        Global.Announcement._showLoading();
        if (this && this.isValid && event && event.hasOwnProperty("tableData")) {
            cc.log(event.tableData);
            var isCreate = false;
            var isJoin = false;
            var isReconnect = false;
            var isTableFull = false;
            if (Number(event.tableData.tableSize) > 0 && Number(event.tableData.tableSize) < Number(event.tableData.maxNumberPlayer)) {
                cc.log("BiDa: send join table", event.tableData);
                isJoin = true;
                // this.sendJoinTable(event.tableData);
            } else {
                if (event.tableData.tableSize == 0) {
                    isCreate = true;
                    // this.sendCreateTable(event.tableData);
                } else {
                    isTableFull = true;
                    cc.Global.showMessage(i18n.t("Bàn đã đầy. Vui lòng chọn bàn khác"));
                    Global.Announcement._hideLoading();
                }
            }
            //Fix: lỗi báo bàn đầy nhưng trong bàn vẫn thấy người vào phòng
            if (!isTableFull) {
                //tao ban choi truoc khi join phong...
                var customEvent;
                if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1 && event.tableData) {
                    cc.log("Mode play 1vs1 activated ...");
                    customEvent = new cc.Event.EventCustom(BiDaConstant.GAME_LOBBY_EVENT.CREATE_TABLE_UI_WITH_MODE_1V1_PLAYERS, true);
                    customEvent.tableData = event.tableData;
                } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4 && event.tableData) {
                    cc.log("Mode play 1vs4 activated ...");
                    customEvent = new cc.Event.EventCustom(BiDaConstant.GAME_LOBBY_EVENT.CREATE_TABLE_UI_WITH_MODE_1V4_PLAYERS, true);
                    customEvent.tableData = event.tableData;
                } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM && event.tableData) {
                    cc.log("Mode play phom activated ...");
                    customEvent = new cc.Event.EventCustom(BiDaConstant.GAME_LOBBY_EVENT.CREATE_TABLE_UI_WITH_MODE_BIDA_PHOM_PLAYERS, true);
                    customEvent.tableData = event.tableData;
                }
                if (customEvent) {
                    customEvent.isCreate = isCreate;
                    customEvent.isJoin = isJoin;
                    customEvent.isReconnect = isReconnect;
                    this.node.dispatchEvent(customEvent);
                }
            }

        } else {
            Linker.shoWMessage(i18n.t("Vui lòng thử lại sau"));
            cc.log("Không tìm thấy data bàn chơi, không thể join bàn ...");
        }
    },
    sendJoinTable(tableData) {
        if (!Linker.Socket.isOpen()) {
            this.processConnect();
            return false;
        }
        if (Number(tableData.firstCashBet) * 6 <= Number(DataAccess.Instance.getCurrentBalance(cc.Global.bidaMoneyType))) {
            if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
                //Linker.Socket.send(LobbySend.getTableRequest(tableData.matchId));
                var data = LobbySend.joinTableRequest(tableData.matchId);
                Linker.Socket.send(data);
            } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
                var data = LobbySend.joinTableRequest(tableData.matchId);
                Linker.Socket.send(data);
            } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
                var data = LobbySend.joinTableRequest(tableData.matchId);
                Linker.Socket.send(data);
            }
        } else {
            if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM && Number(tableData.firstCashBet) * 2 <= Number(DataAccess.Instance.getCurrentBalance(cc.Global.bidaMoneyType))) {
                var data = LobbySend.joinTableRequest(tableData.matchId);
                Linker.Socket.send(data);
            } else {
                cc.Global.showMessage(i18n.t("Bạn không đủ tiền để vào phòng"));
                Global.Announcement._hideLoading();
            }
        }
    },
    sendCreateTable: function (tableData) {
        cc.log(tableData);
        if (!Linker.Socket.isOpen()) {
            this.processConnect();
            return false;
        }

        this.firstCashBet = tableData.firstCashBet;

        if (Number(tableData.firstCashBet) * 6 <= Number(DataAccess.Instance.getCurrentBalance(cc.Global.bidaMoneyType))) {
            if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
                //bida 11
                var data = LobbySend.createTableRequest(0, 0, tableData.firstCashBet, 0);
                Linker.Socket.send(data);
            } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
                //bida 1vs4
                var data = LobbySend.createTableRequest(0, 0, tableData.firstCashBet, 0);
                Linker.Socket.send(data);
            } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
                var data = LobbySend.createTableRequest(0, 0, tableData.firstCashBet, 0);
                Linker.Socket.send(data);
            }
        } else {
            cc.Global.showMessage(i18n.t("Bạn không đủ tiền để tạo phòng"));
            Global.Announcement._hideLoading();
        }
    },
    addEventListener: function () {
        Linker.Event.addEventListener(110701, this.onGetListTable, this);
        Linker.Event.addEventListener(1100, this.onCreateTable, this);
        Linker.Event.addEventListener(1105, this.onJoinTable, this);
        Linker.Event.addEventListener(1246, this.onFastJoinTable, this);
        Linker.Event.addEventListener(1101, this.onInvite, this);
        Linker.Event.addEventListener(1241, this.onGetTableData, this);
        Linker.Event.addEventListener(1104, this.onTurnCardRespone, this);
        Linker.Event.addEventListener(1110, this.onPlayerReadyRespone, this);
        Linker.Event.addEventListener(1106, this.onPlayerJoinedResponse, this);
        Linker.Event.addEventListener(1114, this.onGameEndResponse, this);
        Linker.Event.addEventListener(3, this.onReconnect, this);
    },
    removeEventListener() {
        Linker.Event.removeEventListener(110701, this.onGetListTable, this);
        Linker.Event.removeEventListener(1100, this.onCreateTable, this);
        Linker.Event.removeEventListener(1105, this.onJoinTable, this);
        Linker.Event.removeEventListener(1246, this.onFastJoinTable, this);
        Linker.Event.removeEventListener(1101, this.onInvite, this);
        Linker.Event.removeEventListener(3, this.onReconnect, this);
        Linker.Event.removeEventListener(1241, this.onGetTableData, this);
        Linker.Event.removeEventListener(1104, this.onTurnCardRespone, this);
        Linker.Event.removeEventListener(1110, this.onPlayerReadyRespone, this);
    },
    onTurnCardRespone(message) {
        if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4 || Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1 || Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM && message.status == 1) {
            Linker.message_1104 = message;
        }
    },
    onPlayerReadyRespone(message) {
        if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4 || Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1 || Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM && message.status == 1) {
            Linker.message_1110 = message;
        }
    },
    onPlayerJoinedResponse(message) {
        if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4 || Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1 || Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM && message.status == 1) {
            Linker.message_1106 = message;
        }
    },
    onGameEndResponse(message) {
        if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4 || Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1 || Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM && message.status == 1) {
            Linker.message_1114 = message;
        }
    },

    initLobby: function () {
        Global.Announcement._showLoading();
        this.removeSafeItemBanLobbyNodePool(this.ListTableLobby);
        // this.ListTableLobby.destroyAllChildren();
        var canvas = cc.find("Canvas");
        this.BillardTopLobby.getComponent(cc.Widget).target = canvas;
        this.BillardZoneLobby.getComponent(cc.Widget).target = canvas;
        this.BillardBottomLobby.getComponent(cc.Widget).target = canvas;
        this.refeshListTable();
        this.refeshListFilter();
        if (Linker.userData.lastRoom) {
            Linker.reconnectLostNetwork = Linker.userData.lastRoom;
            if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
                cc.log("Mode play 1vs1 activated ...");
                var customEvent = new cc.Event.EventCustom(BiDaConstant.GAME_LOBBY_EVENT.CREATE_TABLE_UI_WITH_MODE_1V1_PLAYERS, true);
            } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
                cc.log("Mode play 1vs4 activated ...");
                var customEvent = new cc.Event.EventCustom(BiDaConstant.GAME_LOBBY_EVENT.CREATE_TABLE_UI_WITH_MODE_1V4_PLAYERS, true);
            } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
                cc.log("Mode play bida phom activated ...");
                var customEvent = new cc.Event.EventCustom(BiDaConstant.GAME_LOBBY_EVENT.CREATE_TABLE_UI_WITH_MODE_BIDA_PHOM_PLAYERS, true);
            }
            customEvent.isCreate = false;
            customEvent.isJoin = false;
            customEvent.isReconnect = true;
            customEvent.tableId = Number(Linker.reconnectLostNetwork);
            this.node.dispatchEvent(customEvent);
            Linker.userData.lastRoom = 0;
            Linker.redirectOnReconnect = null;
        }
        if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
            this.logoLobby.node.active = true;
            this.logoLobby.spriteFrame = this.list_logoFrame[0];
            this.logoBiDaPhom.active = false;
        } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
            this.logoLobby.spriteFrame = this.list_logoFrame[1];
        } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
            switch (Linker.gameLanguage) {
                case "en":
                    this.logoLobby.node.active = false;
                    this.logoBiDaPhom.getComponent(cc.Sprite).spriteFrame = this.list_logoFrame[3];
                    this.logoBiDaPhom.active = true;
                    break;
                case "vi":
                    this.logoLobby.node.active = false;
                    this.logoBiDaPhom.getComponent(cc.Sprite).spriteFrame = this.list_logoFrame[2];
                    this.logoBiDaPhom.active = true;
                    break;
                default:
                    break;
            }
        }
    },
    refeshListTable: function () {
        if (!Linker.Socket.isOpen()) {
            this.processConnect();
            return false;
        }
        // cc.Global.showLoading();
        if (Linker.ZONE && Linker.ZONE != BiDaConstant.ZONE_ID.ZONEID_BIDA_LUCKY_SHOT) {
            var sendData = CommonSend.joinZone(Linker.ZONE, 0);
            Linker.Socket.send(sendData);
        }
    },
    refeshListFilter: function () {
        this.betSetting.getComponent("betSetting").activeBgBtn();
    },
    processConnect() {
        if (Linker.GameManager) {
            cc.Global.showMessage(i18n.t("Kết nói bị lỗi, Đang kết nối lại"));
            var customEvent = new cc.Event.EventCustom(BiDaConstant.GAME_COMMONS_EVENT.BACK_TO_HOME_GAME, true);
            this.node.dispatchEvent(customEvent);
            Utils.Malicious.setActiveLayer();
            Linker.GameManager.autoLoginByWhenPlayGameChan();
        } else { //cho ra man hinh dang nhap
            Linker.Socket.close();
            Linker.isLogin = false;
            if (Linker.isFb) {
                Linker.MySdk.logoutFb();
                Linker.isFb = false;
            }
            var userData = Linker.Local.readUserData();
            userData.autoLogin = false;
            Linker.Local.saveUserData(userData);
            cc.director.preloadScene("BiDaHomeScene", function (completedCount, totalCount, item) {
                var percent = completedCount / totalCount;
            }, function (err, data) {
                cc.Global.hideLoading();
                if (!err) {
                    var userData = Linker.Local.readUserData();
                    userData.autoLogin = false;
                    Linker.Local.saveUserData(userData);
                    cc.director.loadScene('BiDaHomeScene', () => {
                        cc.Global.hideLoading();
                    });
                } else {
                    cc.log("Không thể load lại homescene lỗi xảy ra...");
                }
            });
        }
    },
    pickFirstBetRooms: function (dataRooms) {
        if (dataRooms && Array.isArray(dataRooms) && dataRooms.length > 0) {
            for (let i = 0; i < dataRooms.length; i++) {
                var value = Number(dataRooms[i].firstCashBet);
                if (value == Number(Linker.valueBet)) {
                    return value;
                }
            }
            return Number(dataRooms[0].firstCashBet);
        }
    },
    onGetListTable: function (message) {
        if (message.status == 1) {
            var customEvent = new cc.Event.EventCustom(BiDaConstant.GAME_COMMONS_EVENT.SHOW_LOBBY_LAYER, true);
            customEvent.opacity = 255;
            this.node.dispatchEvent(customEvent);
            Global.Announcement._hideLoading();
            var dataRooms = this.createListTable(message.rooms);
            if (dataRooms && Array.isArray(dataRooms) && dataRooms.length > 0) {
                var value = Number(dataRooms[0].firstCashBet);
                this.filterMoneyNode.active = true;
                if (Linker.valueBet && isNaN(parseInt(Linker.valueBet)) == false) {
                    value = this.pickFirstBetRooms(dataRooms);
                }
                Linker.valueBet = Number(value);
                this.firstCashBet = Number(value);
                this.filterRooms(value);
            }
        } else {
            cc.Global.showMessage(i18n.t("Vui lòng thử lại sau"));
        }
    },
    createListTable: function (rooms) {
        var tempData = [];
        for (var i = 0; i < rooms.length; i++) {
            for (var j = 0; j < rooms[i].tables.length; j++) {
                if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1 && rooms[i].tables[j].tableIndex == -1) {
                    rooms[i].tables[j].maxNumberPlayer = 2;
                }
                tempData.push(rooms[i].tables[j]);
            }
        }

        tempData.sort(function (a, b) {
            var keyA = Number(a.firstCashBet),
                keyB = Number(b.firstCashBet);
            if (keyA < keyB) return -1;
            if (keyA > keyB) {
                return 1;
            } else if (keyA == keyB) {
                if (Number(a.tableIndex) > 0) {
                    return -1;
                } else {
                    return 1;
                }
            }
            return 0;
        });

        for (var j = 0; j < tempData.length; j++) {
            tempData[j].pos = j + 1;
        }
        cc.log(tempData);
        Linker.tableData = tempData;
        return tempData;
        // this.addRooms(tempData);
    },
    addRooms: function (rooms) {
        this.removeSafeItemBanLobbyNodePool(this.ListTableLobby);
        // this.ListTableLobby.destroyAllChildren();
        var tableZindex = 5;
        Global.Announcement._hideLoading();
        var customEvent = new cc.Event.EventCustom(BiDaConstant.GAME_COMMONS_EVENT.SHOW_LOBBY_LAYER, true);
        customEvent.opacity = 255;
        this.node.dispatchEvent(customEvent);
        if (Linker && Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
            if (rooms && Array.isArray(rooms)) {
                rooms = Utils.Malicious.flattern([[this.getDataRoomCreate()], rooms]);
                for (let i = 0; i < rooms.length; i++) {
                    var itemTable = this.getItemBan();
                    this.ListTableLobby.addChild(itemTable);
                    if (itemTable) {
                        itemTable.active = true;
                        var itemTableJS = itemTable.getComponent("item1vs1BidaTable");
                        if (itemTableJS) {
                            itemTable.zIndex = tableZindex;
                            tableZindex += 10;
                            itemTableJS.init(rooms[i]);
                        }
                    }

                }
            }
        } else if (Linker && Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
            if (rooms && Array.isArray(rooms)) {
                rooms = Utils.Malicious.flattern([[this.getDataRoomCreate()], rooms]);
                for (let i = 0; i < rooms.length; i++) {
                    var itemTable = this.getItemBan();
                    this.ListTableLobby.addChild(itemTable);
                    if (itemTable) {
                        itemTable.active = true;
                        var itemTableJS = itemTable.getComponent("item1vs4BidaTable");
                        if (itemTableJS) {
                            itemTable.zIndex = tableZindex;
                            tableZindex += 10;
                            itemTableJS.init(rooms[i]);
                        }
                    }

                }
            }
        } else if (Linker && Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
            if (rooms && Array.isArray(rooms)) {
                rooms = Utils.Malicious.flattern([[this.getDataRoomCreate()], rooms]);
                for (let i = 0; i < rooms.length; i++) {
                    var itemTable = this.getItemBan();
                    this.ListTableLobby.addChild(itemTable);
                    if (itemTable) {
                        var itemTableJS = itemTable.getComponent("item1vs4BidaTable");
                        if (itemTableJS) {
                            itemTable.zIndex = tableZindex;
                            tableZindex += 10;
                            itemTableJS.init(rooms[i]);
                        }
                    }

                }
            }
        }
        this.ListTableLobby.sortAllChildren();
    },
    clickBtnFilter: function (event) {
        Linker.valueBet = event.value;
        this.firstCashBet = event.value;
        this.filterRooms(event.value);
    },
    getDataRoomCreate: function () {
        return {
            firstCashBet: 500,
            isPlaying: 1,
            matchId: 0,
            maxNumberPlayer: "5",
            name: "",
            phongId: "78550",
            pos: 1,
            tableIndex: "1",
            tableSize: "2",
            isCreate: true
        }
    },
    filterRooms: function (firstCashBet) {
        this.removeSafeItemBanLobbyNodePool(this.ListTableLobby);
        // this.ListTableLobby.destroyAllChildren();
        var tableZindex = 5;
        if (Linker && Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
            var data = firstCashBet != -1 ? !!Linker.tableData && Linker.tableData.filter(item => item.firstCashBet == firstCashBet) : Linker.tableData;
            if (data && Array.isArray(data)) {
                data = Utils.Malicious.flattern([[this.getDataRoomCreate()], data]);
                for (let i = 0; i < data.length; i++) {
                    var itemTable = this.getItemBan();
                    this.ListTableLobby.addChild(itemTable);
                    if (itemTable) {
                        itemTable.active = true;
                        var itemTableJS = itemTable.getComponent("item1vs1BidaTable");

                        if (itemTableJS) {
                            itemTable.zIndex = tableZindex;
                            itemTableJS.init(data[i]);
                            tableZindex += 10;
                        }
                    }
                }
            }
        } else if (Linker && Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
            var data = firstCashBet != -1 ? !!Linker.tableData && Linker.tableData.filter(item => item.firstCashBet == firstCashBet) : Linker.tableData;
            if (data && Array.isArray(data)) {
                data = Utils.Malicious.flattern([[this.getDataRoomCreate()], data]);
                for (let i = 0; i < data.length; i++) {
                    // var itemTable = cc.instantiate(this.itemTable1vs4Prefab);
                    var itemTable = this.getItemBan();
                    this.ListTableLobby.addChild(itemTable);
                    if (itemTable) {
                        itemTable.active = true;
                        var itemTableJS = itemTable.getComponent("item1vs4BidaTable");

                        if (itemTableJS) {
                            itemTable.zIndex = tableZindex;
                            itemTableJS.init(data[i]);
                            tableZindex += 10;
                        }
                    }
                }
            }
        } else if (Linker && Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
            var data = firstCashBet != -1 ? !!Linker.tableData && Linker.tableData.filter(item => item.firstCashBet == firstCashBet) : Linker.tableData;
            if (data && Array.isArray(data)) {
                data = Utils.Malicious.flattern([[this.getDataRoomCreate()], data]);
                for (let i = 0; i < data.length; i++) {
                    var itemTable = this.getItemBan();
                    this.ListTableLobby.addChild(itemTable);
                    if (itemTable) {
                        itemTable.active = true;
                        var itemTableJS = itemTable.getComponent("item1vs4BidaTable");

                        if (itemTableJS) {
                            itemTable.zIndex = tableZindex;
                            itemTableJS.init(data[i]);
                            tableZindex += 10;
                        }
                    }
                }
            }
        }
        this.ListTableLobby.sortAllChildren();
    },
    showGameLayer: function () {
        var customEvent = new cc.Event.EventCustom(BiDaConstant.GAME_COMMONS_EVENT.SHOW_GAME_LAYER, true);
        this.node.dispatchEvent(customEvent);
    },
    onCreateTable: function (message) {
        if (message.status == 1) {
            Linker.CURRENT_TABLE = cc.js.mixin(message);
            Linker.CURRENT_TABLE.isCreate = true;
            Linker.CURRENT_TABLE.isReconnect = false;
            Linker.CURRENT_TABLE.isJoin = false;
            if (Linker.CURRENT_TABLE.isPlayWithFriend) {
                this.node.dispatchEvent(new cc.Event.EventCustom(BiDaConstant.POPUP_EVENT.INVITE_SEND_PLAY_WITH_FRIEND.OPEN, true));
            } else {
                this.showGameLayer();
            }
        } else if (message.error) {
            cc.Global.showMessage(i18n.t(message.error));
            cc.Global.hideLoading();
        }
    },
    onJoinTable: function (message) {
        cc.log('onJoinTable: dua nhau roi =)', message);
        if (message.status == 1 && message.tableId) {
            this.firstCashBet = message.minMoney;
            if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
                if (message.listPlayer.length > 0) {
                    Linker.CURRENT_TABLE = message;
                    Linker.CURRENT_TABLE.isJoin = true;
                    Linker.CURRENT_TABLE.isCreate = false;
                    Linker.CURRENT_TABLE.isReconnect = false;
                    this.showGameLayer();
                } else {
                    cc.Global.showMessage(i18n.t("Bàn chơi đang sẵn sàng, vui lòng quay lại khi bàn đã bắt đầu chơi để xem"));
                    Linker.Socket.send(CommonSend.leaveTableRequest(message.tableId));
                    this.refeshListTable();
                    Global.Announcement._hideLoading();
                }
            } else {
                Linker.CURRENT_TABLE = message;
                Linker.CURRENT_TABLE.isJoin = true;
                Linker.CURRENT_TABLE.isCreate = false;
                Linker.CURRENT_TABLE.isReconnect = false;
                this.showGameLayer();
            }
        } else if (message.error) {
            cc.Global.showMessage(i18n.t(message.error));
            Global.Announcement._hideLoading();
            Utils.Malicious.setActiveLayer(Linker._sceneTag);
        }
    },
    onFastJoinTable: function (message) {
        cc.log("onFastJoinTable", message);
        Global.Announcement._hideLoading();
        cc.Global.hideLoading();
        if (message.status == 1) {
            cc.log("Fast join finished ...");
        } else if (message.error) {
            cc.Global.showMessage(i18n.t(message.error));

        } else {
            cc.Global.showMessage(i18n.t("Vui lòng thử lại sau"));
        }
    },
    onReconnect: function (message) {
        if (message.status == 1) {
            Linker.CURRENT_TABLE = message;
            Linker.CURRENT_TABLE.isReconnect = true;
            Linker.CURRENT_TABLE.isJoin = false;
            Linker.CURRENT_TABLE.isCreate = false;
            this.showGameLayer();
        }
    },
    onGetTableData: function (message) {
        if (message.status == 1) {

        } else {
            cc.Global.showMessage(i18n.t(message.error))
        }

    },
    onInvite: function (message) {

    },
    onDisable: function () {
        this.removeEventListener();
    },
    onEnable: function () {
        this.addEventListener();
        this.initLobby();
        NewAudioManager.PlayUrl(Linker.gameLanguage == "vi" ? NewAudioManager.SOUND.VI.ENTER_LOBBY : NewAudioManager.SOUND.EN.ENTER_LOBBY);
        // this.checkNotitication();
    },
    start: function () {
    },
    checkNotitication: function () {
        var notifyNode = cc.instantiate(this.notifyPrefab);
        notifyNode.position = cc.v2(0, 0);
        var textNotify = notifyNode.getChildByName('text_thongbao');
        textNotify.x = 1745;
        if (!Linker.notifyText) {
            var path = Linker.Config.APP_API + 'api-events/notification';
            var _this = this;
            Utils.Malicious.get(path, (data) => {
                _this.notifyContainer.removeAllChildren(true);
                var temp = '';
                data.forEach(item => {
                    temp = temp + '                           ' + item;
                });
                if (textNotify && textNotify.isValid) {
                    var s = textNotify.getComponent(cc.Label);
                    if (s) {
                        s.string = temp;
                        Linker.notifyText = temp;
                        _this.notifyContainer.addChild(notifyNode);
                    } else {
                        Linker.notifyText = null;
                        notifyNode.destroy();
                    }
                }
            });
        } else if (Linker.notifyText && Linker.notifyText.length > 0) {
            this.notifyContainer.removeAllChildren(true);
            if (textNotify && textNotify.isValid) {
                var s = textNotify.getComponent(cc.Label);
                if (s) {
                    s.string = Linker.notifyText;
                    this.notifyContainer.addChild(notifyNode);
                } else {
                    notifyNode.destroy();
                }
            }
        }
    },
    onLoad: function () {
        this.addCustomEventListenr();
        this.createPoolNodeManager();
        this.firstCashBet = "";
    },
    onBtnFb() {
        if (Linker.Config) {
            var url = Linker.Config.FACEBOOK_PAGE;
            cc.sys.openURL(url);
        }
    },

    onBtnMessenger() {
        if (Linker.Config) {
            var url = Linker.Config.MESSAGER;
            cc.sys.openURL(url);
        }
    },

    onCreateRoom(event) {
        NewAudioManager.playClick();
        //this.taoBan.active = true;
        var dialogTaoban = cc.find("Canvas/taoban");
        if (!dialogTaoban) {
            var taoban = cc.instantiate(this.taoBanBida);
            taoban.position = cc.v2(0, 0);
            taoban.active = true;
            taoban.zIndex = cc.macro.MAX_ZINDEX - 1;
            cc.find("Canvas").addChild(taoban);
        } else if (dialogTaoban && dialogTaoban.active == false) {
            dialogTaoban.active = true;
        } else if (dialogTaoban && dialogTaoban.active == true) {
            dialogTaoban.active = false;
        }
    },
    createPoolNodeManager: function () {
        if (!this._lobbyNodePool) {
            this._lobbyNodePool = {};

            if (Linker) {
                // khởi tạo số lượng itemBet tùy chọn
                var initItemBetCount = 10;
                var initItemBanCount = 10;
                var prefabItemBet = null;
                var _betSettingPanelComponent = this.betSetting.getComponent("betSetting");
                if (_betSettingPanelComponent && cc.isValid(_betSettingPanelComponent)) {
                    _betSettingPanelComponent.setBillardLobby(this);
                    prefabItemBet = _betSettingPanelComponent.cellPrefab;
                }
                if (prefabItemBet) {
                    // lobby sẽ có 2 prefab được khởi tạo nhiều lần: 1. item bet(500, 1000, 1000,...) 2. item bàn.
                    this._lobbyNodePool._itemBet = new cc.NodePool();
                    this.initNodeWithNodePool(this._lobbyNodePool._itemBet, initItemBetCount, prefabItemBet);
                }
                this._lobbyNodePool._itemBan = {};
                this._lobbyNodePool._itemBan._ban11 = new cc.NodePool();
                this._lobbyNodePool._itemBan._ban14 = new cc.NodePool();
                if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
                    this.initNodeWithNodePool(this._lobbyNodePool._itemBan._ban11, initItemBanCount, this.itemTable1vs1Prefab);
                } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4 || Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
                    this.initNodeWithNodePool(this._lobbyNodePool._itemBan._ban14, initItemBanCount, this.itemTable1vs4Prefab);
                }
            }
        }
    },
    initNodeWithNodePool: function (pool, num, prefab) {
        for (let i = 0; i < num; i++) {
            let item = cc.instantiate(prefab);
            pool.put(item);
        }
    },
    getItemBan: function () {
        if (this._lobbyNodePool && this._lobbyNodePool.hasOwnProperty("_itemBan")) {
            if (this._lobbyNodePool && this._lobbyNodePool.hasOwnProperty("_itemBan")) {
                var item = null;
                var nodePool = null;
                if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
                    nodePool = this._lobbyNodePool._itemBan._ban11;
                    if (nodePool && nodePool.size() > 0) {
                        item = nodePool.get();
                    } else {
                        nodePool.put(cc.instantiate(this.itemTable1vs1Prefab));
                        return nodePool.get();
                    }
                } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4 || Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
                    nodePool = this._lobbyNodePool._itemBan._ban14;
                    if (nodePool && nodePool.size() > 0) {
                        item = nodePool.get();
                    } else {
                        nodePool.put(cc.instantiate(this.itemTable1vs4Prefab));
                        return nodePool.get();
                    }
                }
                return item;
            }
            return null;
        }
    },
    getItemBet: function () {
        if (this._lobbyNodePool && this._lobbyNodePool.hasOwnProperty("_itemBet")) {
            var item = null;
            if (this._lobbyNodePool._itemBet.size() > 0) {
                item = this._lobbyNodePool._itemBet.get();
            } else {
                var _betSettingPanelComponent = this.betSetting.getComponent("betSetting");
                var _prefabItemBet = null;
                if (_betSettingPanelComponent && cc.isValid(_betSettingPanelComponent)) {
                    _prefabItemBet = _betSettingPanelComponent.cellPrefab;
                    this._lobbyNodePool._itemBet.put(cc.instantiate(_prefabItemBet));
                    return this._lobbyNodePool._itemBet.get();
                }
            }
            return item;
        }
        return null;
    },
    removeSafeItemBanLobbyNodePool: function (node) {
        if (node && cc.isValid(node)) {
            if (this._lobbyNodePool && this._lobbyNodePool.hasOwnProperty("_itemBan")) {
                for (var i = 0; i < node.children.length; i++) {
                    var child = node.children[i];
                    if (child && cc.isValid(child)) {
                        var componentItem11 = child.getComponent("item1vs1BidaTable");
                        var componentItem14 = child.getComponent("item1vs4BidaTable");
                        if (componentItem11) {
                            this._lobbyNodePool._itemBan._ban11.put(child);
                        } else if (componentItem14) {
                            this._lobbyNodePool._itemBan._ban14.put(child);
                        } else {
                            child.destroy();
                        }
                    }
                }
            } else {
                node.removeAllChildren(true);
            }
            Utils.Malicious.hideAllChildren(node);
        }
    },
    removeSafeItemBetLobbyNodePool: function (node) {
        if (node && cc.isValid(node)) {
            if (this._lobbyNodePool && this._lobbyNodePool.hasOwnProperty("_itemBet")) {
                for (var i = 0; i < node.children.length; i++) {
                    var child = node.children[i];
                    if (child && cc.isValid(child)) {
                        var componentItem = child.getComponent("betSettingItem");
                        child.active = false;
                        if (componentItem) {
                            componentItem.updateCell({ label: 0 });
                            this._lobbyNodePool._itemBet.put(child);
                        } else {
                            child.destroy();
                        }
                    }
                }
            } else {
                node.removeAllChildren(true);
            }
            Utils.Malicious.hideAllChildren(node);
        }
    }
    // update (dt) {},
});