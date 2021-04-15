var BiDaConstant = require('BiDaConstant');
var Linker = require('Linker');
var Global = require("Global2");
var LobbySend = require('LobbySend');
var LoginCache = require('LoginCache');
var CommonSend = require('CommonSend');
var Utils = require('Utils');
var SocketConstant = require('SocketConstant');
cc.Class({
    extends: cc.Component,
    ctor() {
    },
    properties: {
        BillardMainGameLayer: cc.Node,
        BillardHomeLayer: cc.Node,
        BillardUILayer: cc.Node,
        BillardLobbyLayer: cc.Node,
        BillardMainPopup: cc.Node,
        BillardHomeMid: cc.Node,
        popupInvite1vs1Prefab: cc.Prefab,
        popupInvite1vs4Prefab: cc.Prefab,
        wifiBadSpriteFrame: cc.SpriteFrame,
        wifiBestSpriteFrame: cc.SpriteFrame,
        wifiNormalSpriteFrame: cc.SpriteFrame,
        wifiGoodSpriteFrame: cc.SpriteFrame,
        cueObjPrefab: cc.Prefab
    },
    onLoad: function () {
        // cc.Global.instanceLoading();
        // cc.Global.initSystemMessage();
        // Linker.Event.addEventListener(1101, this.onInvite, this);
        // this.addSocketEventIap();
    },
    getBillardsGameTable: function () {
        for (let i = 0; i < this.BillardMainGameLayer.children.length; i++) {
            var c = this.BillardMainGameLayer.children[i];
            var ccomponent = c.getComponent("BillardsGameTable");
            if (ccomponent && ccomponent.isValid) {
                return c;
            }
        }
        return null;
    },
    getBillardsGameTableController: function () {
        for (let i = 0; i < this.BillardMainGameLayer.children.length; i++) {
            var c = this.BillardMainGameLayer.children[i];
            var ccomponent = c.getComponent("BillardsGameTableController");
            if (ccomponent && ccomponent.isValid) {
                return c;
            }
        }
        return null;
    },
    setWifiStatus: function () {
        var now = new Date().getTime();
        var level = now - cc.Global.PINGTIME;
        var frame = null;
        if (level > 3000 && level <= 4000) {
            frame = this.wifiNormalSpriteFrame;
        } else if (level > 4000 && level <= 5000) {
            frame = this.wifiGoodSpriteFrame;
        } else if (level > 5000) {
            frame = this.wifiBadSpriteFrame;
        } else {
            frame = this.wifiBestSpriteFrame;
        }
        var BillardGameTable = this.getBillardsGameTable();
        if (BillardGameTable) {
            BillardGameTable.getComponent("BillardsGameTable").setWifiSignalAsFrame(frame);
        }
    },
    onGetBetSetting(message) {
        if (message.status == 1) {
            var arrCovert = message.tempArray.map(item => Number(item));
            if (!this.listArrBet) {
                this.listArrBet = arrCovert;
            }
            if (!this.currentMoneyType) {
                this.currentMoneyType = cc.Global.moneyType;
            }


            if (Linker._sceneTag == BiDaConstant.TAG.scenes.LOBBY) {

                if (this.listArrBet && this.currentMoneyType) {
                    var jsonCurrentListBet = JSON.stringify(this.listArrBet);
                    var jsonServerListBet = JSON.stringify(arrCovert);
                    if (jsonCurrentListBet == jsonServerListBet && Number(this.currentMoneyType) == Number(cc.Global.moneyType)) {
                        // cc.error("Not update, duplicated...");
                    } else {
                        this.listArrBet = arrCovert;
                        this.currentMoneyType = cc.Global.moneyType;
                        // cc.error("Update list betting update...");
                        this.onOpenPopupBetButon();
                    }
                }
            } else {
                this.listArrBet = arrCovert;
                this.currentMoneyType = Linker.ZONE;
                // cc.error("Not, only update...");
            }
        }
    },

    onDestroy: function () {
        Linker.Event.removeEventListener(1101, this.onInvite, this);
    },

    onEnable: function () {
        // this.unschedule(this.setWifiStatus);
        // this._billardHomeLayerController = this.BillardHomeLayer.getComponent("BillardsHomeLayer");
        // this._billardMainLayerController = this.BillardMainGameLayer.getComponent("BillardsMainLayer");
        // this._billardUIGameController = this.BillardUILayer.getComponent("BillardUICommonLayer");
        // this.configGame();

    },
    addEventListener() {
        Linker.Event.addEventListener(1100, this.onCreateBidaGameWithPlay, this);
        Linker.Event.addEventListener(110710, this.onGetBetSetting, this);
    },
    removeEventListener() {
        Linker.Event.removeEventListener(110710, this.onGetBetSetting, this);
        Linker.Event.removeEventListener(1100, this.onCreateBidaGameWithPlay, this);
    },
    onDisable: function () {
        this.removeEventListener();
        this.unschedule(this.setWifiStatus);
    },

    getLoginTop: function () {
        if (this._billardHomeLayerController && this._billardHomeLayerController.isValid) {
            var loginTop = this._billardHomeLayerController.getLoginTop();
            if (loginTop && loginTop.isValid) {
                return loginTop;
            } else {
                return null;
            }
        }
        return null;
    },
    getHomeTop: function () {
        if (this._billardHomeLayerController && this._billardHomeLayerController.isValid) {
            var loginTop = this._billardHomeLayerController.getHomeTop();
            if (loginTop && loginTop.isValid) {
                return loginTop;
            } else {
                return null;
            }
        }
        return null;
    },
    configGame: function () {
        this.showHomeLayer();
        this.init(this._billardHomeLayerController);
        this.init(this._billardMainLayerController);
        this.init(this._billardUIGameController);        
        this.addEventListener();
        this.addEventCustomListener();
    },
    showHomeLayer: function(){
        //cho phep main home active
        this.BillardHomeLayer.active = true;
        this.BillardMainGameLayer.active = false;
        this.BillardLobbyLayer.active = false;
        this.BillardUILayer.active = false;
        this.BillardMainPopup.active = false;
        this._billardHomeLayerController.showHomeLayer();
        this.hideLobbyLayer();
    },
    showLoginLayer: function(){
        this.showHomeLayer();
        this.hideLobbyLayer();
        this._billardHomeLayerController.showPortalLoginGate();
    },
    hideHomeLayer: function(){
        //cho phep main home active
        this.BillardHomeLayer.active = false;
        this.BillardMainGameLayer.active = false;
        this.BillardLobbyLayer.active = true;
        this.BillardUILayer.active = false;
        this.BillardMainPopup.active = false;
    },
    addEventCustomListener: function () {
        this.node.on(BiDaConstant.LOGIN_EVENT.LOGINED_SUCCESS, this.onLogin, this);
        this.node.on(BiDaConstant.LOGIN_EVENT.LOGOUTED_SUCCESS, this.onLogout, this);
        this.node.on(BiDaConstant.LOGIN_EVENT.CONFIG_HOME_LOGIN, this.configGame, this);

        this.node.on(BiDaConstant.POPUP_EVENT.SETTING.OPEN, this.onOpenSettingPopup, this);
        this.node.on(BiDaConstant.POPUP_EVENT.RANK_RECHARSE.OPEN, this.onOpenRankRecharse, this);
        this.node.on(BiDaConstant.POPUP_EVENT.LIST_CUE.OPEN, this.onOpenListCue, this);
        this.node.on(BiDaConstant.POPUP_EVENT.USER_INFO.OPEN, this.onOpenUserInfoPopup, this);
        this.node.on(BiDaConstant.POPUP_EVENT.GIFT_CODE.OPEN, this.onOpenGiftCodePopup, this);
        this.node.on(BiDaConstant.POPUP_EVENT.FRIEND_ZONE.OPEN, this.onOpenFriendPopup, this);
        this.node.on(BiDaConstant.POPUP_EVENT.FRIEND_ZONE.FIND_FRIEND_TAB.OPEN, this.onOpenFindFriendTab, this);
        this.node.on(BiDaConstant.POPUP_EVENT.FRIEND_ZONE.INVITE_FRIEND_TAB.OPEN, this.onOpenInviteFriendTab, this);
        this.node.on(BiDaConstant.POPUP_EVENT.FRIEND_ZONE.CLOSE, this.onCloseFriendPopup, this);
        this.node.on(BiDaConstant.POPUP_EVENT.FRIEND_ZONE.CLOSED, this.onClosedFriendPopup, this);
        this.node.on(BiDaConstant.POPUP_EVENT.GUIDE.OPEN, this.onOpenGuidePopup, this);
        this.node.on(BiDaConstant.POPUP_EVENT.MESSAGE.OPEN, this.onOpenMessagePopup, this);
        this.node.on(BiDaConstant.POPUP_EVENT.XU_FREE_STORE.OPEN, this.onOpenShopPopup, this);
        this.node.on(BiDaConstant.POPUP_EVENT.XU_STORE.OPEN, this.onOpenShopPopup, this);
        this.node.on(BiDaConstant.POPUP_EVENT.EVENT.OPEN, this.onOpenEventPopup, this);
        this.node.on(BiDaConstant.POPUP_EVENT.CHAT.OPEN, this.onOpenChatPopup, this);
        this.node.on(BiDaConstant.POPUP_EVENT.VQMM.OPEN, this.onOpenVQMMPopup, this);
        this.node.on(BiDaConstant.POPUP_EVENT.INVITE_SEND.OPEN, this.onOpenSendInvite, this);
        this.node.on(BiDaConstant.POPUP_EVENT.DAILY_GIFT.OPEN, this.onOpenDailyGift, this);
        this.node.on(BiDaConstant.POPUP_EVENT.LEADERBOARD.OPEN, this.onOpenLeaderboard, this);
        this.node.on(BiDaConstant.POPUP_EVENT.CUE_STORE.SEND_CUEID, this.onChangeMyCue, this);
        this.node.on(BiDaConstant.POPUP_EVENT.MINI_PORKER.OPEN, this.onOpenMiniPorker, this);
        this.node.on(BiDaConstant.POPUP_EVENT.MINI_SLOT.OPEN, this.onOpenMiniSlot, this);
        this.node.on(BiDaConstant.POPUP_EVENT.LARVA.OPEN, this.onOpenLarva, this);
        this.node.on(BiDaConstant.POPUP_EVENT.INVITE_SEND_PLAY_WITH_FRIEND.OPEN, this.onCreateInviteFriend, this);
        //
        this.node.on(BiDaConstant.GAME_COMMONS_EVENT.SET_USER_MONEY, this.onSetUserMoney, this);
        this.node.on(BiDaConstant.GAME_COMMONS_EVENT.SET_USER_EXP, this.onSetUserExp, this);
        this.node.on(BiDaConstant.GAME_COMMONS_EVENT.SET_USER_ID, this.onSetUserID, this);
        this.node.on(BiDaConstant.GAME_COMMONS_EVENT.SET_USER_NAME, this.onSetUserName, this);
        this.node.on(BiDaConstant.GAME_COMMONS_EVENT.SET_USER_AVATAR_AS_FRAME, this.onSetUserAvatarAsFrame, this);
        this.node.on(BiDaConstant.GAME_COMMONS_EVENT.SET_USER_LEVEL, this.onSetUserLevel, this);
        this.node.on(BiDaConstant.GAME_COMMONS_EVENT.CHANGE_AVATAR, this.onChangeAvatar, this);
        this.node.on(BiDaConstant.GAME_COMMONS_EVENT.CHANGE_DISPLAY_NAME, this.onChangeName, this);

        //
        this.node.on(BiDaConstant.GAME_LOBBY_EVENT.REQUEST_LOBBY_FOR_ZONE_ID_TYPE, this.onCreateBillardLobby, this);
        this.node.on(BiDaConstant.GAME_COMMONS_EVENT.BACK_TO_HOME_GAME, this.hideLobbyLayer, this);
        //create table 1vs4
        this.node.on(BiDaConstant.GAME_LOBBY_EVENT.CREATE_TABLE_UI_WITH_MODE_1V4_PLAYERS, this.onCreateBidaGame, this);
        this.node.on(BiDaConstant.GAME_LOBBY_EVENT.CREATE_TABLE_UI_WITH_MODE_BIDA_PHOM_PLAYERS, this.onCreateBidaGame, this);
        this.node.on(BiDaConstant.GAME_LOBBY_EVENT.CREATE_TABLE_UI_WITH_MODE_1V1_PLAYERS, this.onCreateBidaGame, this);
        this.node.on(BiDaConstant.GAME_LOBBY_EVENT.CREATE_TABLE_UI_WITH_MODE_LUCKYSHOT_PLAYERS, this.onCreateBidaGame, this);
        // create table play with friend
        this.node.on(BiDaConstant.GAME_COMMONS_EVENT.CREATE_TABLE_1V1_PLAYERS, this.onCreateBidaGameWithFriend, this);
        this.node.on(BiDaConstant.GAME_COMMONS_EVENT.CREATE_TABLE_1V4_PLAYERS, this.onCreateBidaGameWithFriend, this);
        // play with friend
        this.node.on(BiDaConstant.GAME_LOBBY_EVENT.CREATE_TABLE_UI_PLAY_WITH_FRIEND, this.onOpenPopupChooseTypeGame, this);
        // open home mid
        this.node.on(BiDaConstant.GAME_COMMONS_EVENT.OPEN_HOME_MID, this.onOpenHomeMid, this);
        // open popup minigame
        this.node.on(BiDaConstant.POPUP_EVENT.MINIGAME.OPEN, this.onOpenPopupMiniGame, this);

        this.node.on(BiDaConstant.BET.BET_SETTING_VALUE, this.onGetValueBtnBet, this);
        this.node.on(BiDaConstant.BUTTON_EVENT.PLAY_OFFLINE_CLICK, this.onClickPlayOffline, this);
        // show main game layer
        this.node.on(BiDaConstant.GAME_COMMONS_EVENT.SHOW_GAME_LAYER, this.showMainGameLayerWithChild, this);
        this.node.on(BiDaConstant.GAME_COMMONS_EVENT.HIDE_GAME_LAYER, this.hideMainGameLayerWithChild, this);
        this.node.on(BiDaConstant.GAME_COMMONS_EVENT.SHOW_LOBBY_LAYER, this.showLobbyLayer, this);
        this.node.on(BiDaConstant.GAME_COMMONS_EVENT.SHOW_HOME_LAYER, this.showHomeLayer, this);
        this.node.on(BiDaConstant.GAME_COMMONS_EVENT.SHOW_LOGIN_LAYER, this.showLoginLayer, this);
        //send request auto next turn
        this.node.on(BiDaConstant.GAME_TABLE_EVENT.GUI_YEU_CAU_AUTO_NEXT_TURN_LEN_SERVER, this.sendRequestAutoNextTurn, this);
    },

    onCreateBidaGame: function (event) {
        if(Linker.Socket.isOpen()){
            if (this.BillardMainGameLayer && this.BillardMainGameLayer.isValid) {
                var billardGame = this.BillardMainGameLayer.getChildByName("BillardsGameTable");
                if (billardGame) {
                    billardGame.position = cc.v2(0, 0);
                    this.initBan(billardGame, event);
                } else {
                    cc.Global.showLoading();
                    cc.resources.load("bida/prefabs/BillardsGameTable", cc.Prefab, function (completedCount, totalCount, item) {
                        var percent = Math.round(100 * completedCount / totalCount);
                        var str = percent + '%';
                        // cc.log(str);
                    }, function (err, prefab) {
                        if (!err) {
                            if (event.isLuckyShot) {
                                cc.Global.hideLoading();
                            }
                            var child = cc.instantiate(prefab);
                            this.BillardMainGameLayer.addChild(child);
                            child.position = cc.v2(0, 0);
                            this.initBan(child, event);
                        } else {
                            this.showLobbyLayer();
                        }
                    }.bind(this));
                }
            }
        }
    },
    onCreateInviteFriend() {
        if (this.BillardMainGameLayer && this.BillardMainGameLayer.isValid) {
            if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
                var popupInvite1vs1 = this.BillardMainGameLayer.getChildByName("PopupInvite1vs1");
                if (popupInvite1vs1) {
                    popupInvite1vs1.position = cc.v2(0, 0);
                    var popupInvite1vs1JS = popupInvite1vs1.getComponent("PopupInvite1vs1");
                    popupInvite1vs1JS.updateInfo();
                    popupInvite1vs1.active = true;
                } else {
                    popupInvite1vs1 = cc.instantiate(this.popupInvite1vs1Prefab);
                    popupInvite1vs1.position = cc.v2(0, 0);
                    popupInvite1vs1.active = true;
                    var popupInvite1vs1JS = popupInvite1vs1.getComponent("PopupInvite1vs1");
                    popupInvite1vs1JS.updateInfo();
                    this.BillardMainGameLayer.addChild(popupInvite1vs1);
                }
                this.showMainGameLayerWithChild({ child: popupInvite1vs1 });
            }
            if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
                var popupInvite1vs4 = this.BillardMainGameLayer.getChildByName("PopupInvite1vs4");
                if (popupInvite1vs4) {
                    popupInvite1vs4.position = cc.v2(0, 0);
                    var popupInvite1vs4JS = popupInvite1vs4.getComponent("PopupInvite1vs4");
                    popupInvite1vs4JS.updateInfo();
                    popupInvite1vs4.active = true;
                } else {
                    popupInvite1vs4 = cc.instantiate(this.popupInvite1vs4Prefab);
                    popupInvite1vs4.position = cc.v2(0, 0);
                    popupInvite1vs4.active = true;
                    var popupInvite1vs4JS = popupInvite1vs4.getComponent("PopupInvite1vs4");
                    popupInvite1vs4JS.updateInfo();
                    this.BillardMainGameLayer.addChild(popupInvite1vs4);
                }
                this.showMainGameLayerWithChild({ child: popupInvite1vs4 });
            }
            if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
                var popupInvite1vs4 = this.BillardMainGameLayer.getChildByName("PopupInvite1vs4");
                if (popupInvite1vs4) {
                    popupInvite1vs4.position = cc.v2(0, 0);
                    var popupInvite1vs4JS = popupInvite1vs4.getComponent("PopupInvite1vs4");
                    popupInvite1vs4JS.updateInfo();
                    popupInvite1vs4.active = true;
                } else {
                    popupInvite1vs4 = cc.instantiate(this.popupInvite1vs4Prefab);
                    popupInvite1vs4.position = cc.v2(0, 0);
                    popupInvite1vs4.active = true;
                    var popupInvite1vs4JS = popupInvite1vs4.getComponent("PopupInvite1vs4");
                    popupInvite1vs4JS.updateInfo();
                    this.BillardMainGameLayer.addChild(popupInvite1vs4);
                }
                this.showMainGameLayerWithChild({ child: popupInvite1vs4 });
            }
        }
    },

    onCreateBidaGameWithPlay(message) {
        if (this.invitePlayWithFriend) {
            if (message.status == 1) {
                if (message.status == 1 && message.tableId) {
                    Linker.CURRENT_TABLE = message;
                    Linker.CURRENT_TABLE.isJoin = false;
                    Linker.CURRENT_TABLE.isCreate = true;
                    Linker.CURRENT_TABLE.isReconnect = false;
                    Linker.CURRENT_TABLE.isPlayWithFriend = true;
                    this.showMainGameLayerWithChild({});
                } else if (message.error) {
                    cc.Global.showMessage(i18n.t(message.error));
                }

            } else if (message.error) {
                cc.Global.showMessage(message.error);
            }
            this.invitePlayWithFriend = false;
            this.onCreateInviteFriend();
        }
    },

    onCreateBidaGameWithFriend: function (event) {
        if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1 || Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4 || Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
            this.invitePlayWithFriend = true;
        }
    },

    onOpenPopupBetButon() {
        this.BillardMainPopup.getComponent("BillardMainPopup").hidePopupChooseTypeGame();
        this.BillardMainPopup.getComponent("BillardMainPopup").showPopupBetButon(this.listArrBet);
    },

    onOpenHomeMid: function (event) {
        this.invitePlayWithFriend = false;
        this.BillardHomeMid.active = true;
    },

    initBan: function (billardGame, event) {
        var data = null;
        if (this.invitePlayWithFriend) {
            data = {
                opacity: 0
            };
        }
        this.showLobbyLayer(data);
        var _billardGameTable = billardGame.getComponent("BillardsGameTable");
        if (_billardGameTable) {
            _billardGameTable.createHeaderUserInfo();
            _billardGameTable.configPanelUsers();
            _billardGameTable.init();
            _billardGameTable.nohuNode.active = true;
        }
        if (event.userInviteId) {
            var data = CommonSend.sendAcceptInviteRequest(event.tableId, event.userInviteId, 1);
            Linker.Socket.send(data);
        } else if (event && event.bet) {
            var data = LobbySend.createTableRequest(0, 0, event.bet, 0);
            Linker.Socket.send(data);
        } else if (event && event.isLuckyShot) {
            this.showMainGameLayerWithChild({});
            if (_billardGameTable) {
                _billardGameTable.nohuNode.active = false;
            }
        } else {
            var _billardLobby = this.BillardLobbyLayer.getChildByName("BillardLobby").getComponent("BillardLobby");
            //gui request join room hoac create room
            if (event && cc.isValid(_billardLobby)) {
                if (event.isCreate == true) {
                    _billardLobby.sendCreateTable(event.tableData);
                    cc.log("Gui yeu cau create game...", event);
                } else if (event.isJoin == true) {
                    _billardLobby.sendJoinTable(event.tableData);
                    cc.log("Gui yeu cau join game...", event);
                } else if (event.isReconnect && event.tableId) {
                    var data = LobbySend.joinTableRequest(Number(event.tableId));
                    Linker.Socket.send(data);
                    cc.log("Gui yeu cau reconnect join...", data);
                } else if (event.isQuickPlayLobby) {
                    var data = LobbySend.fastPlayRequest(Linker.ZONE);
                    Linker.Socket.send(data);
                    cc.log("Gui yeu cau quick play game...", data);
                }
            }
        }
    },
    onGetValueBtnBet(event) {
        if (this.invitePlayWithFriend) {
            var bet = event.value;
            event.bet = bet;
            this.onCreateBidaGame(event);
        }
    },
    showLobbyLayer: function (data) {
        this.hideHomeLayer();
        this.BillardHomeLayer.getComponent("BillardsHomeLayer").showLobby();
        this.BillardMainGameLayer.active = false;
        this.BillardLobbyLayer.active = true;
        if (data && data.opacity) {
            this.BillardLobbyLayer.opacity = data.opacity;
        } else {
            this.BillardLobbyLayer.opacity = 255;
        }
        this.BillardUILayer.active = false;
        this.BillardMainPopup.active = false;
        Linker._sceneTag = BiDaConstant.TAG.scenes.LOBBY;
        //remove game table
        this.removeDeskNode();
    },
    removeDeskNode: function () {
        var child = null;
        if (!child) {
            var BillardGameTable = this.getBillardsGameTable();
            if (BillardGameTable) {
                child = BillardGameTable;
            }
        };
        if (!child) {
            return;
        }
        var billardGame = child.getComponent("BillardsGameTable");
        if (billardGame) {
            Utils.Malicious.removeNodeByNameFromParent("DeskNormalPlay", billardGame.node);
        }
    },
    showMainGameLayerWithChild: function (event) {
        var child = event.child;
        if (!child) {
            var BillardGameTable = this.getBillardsGameTable();
            if (BillardGameTable) {
                child = BillardGameTable;
            }
        };
        if (!child) {
            return;
        }
        var billardGame = child.getComponent("BillardsGameTable");
        if (billardGame) {
            var billardGameController = billardGame.getComponent("BillardsGameTableController");
            if (billardGameController) {
                billardGameController.loadNewMatch();
            }
        }
        this.BillardHomeLayer.active = false;
        this.BillardMainGameLayer.active = true;
        this.BillardLobbyLayer.active = false;
        this.BillardUILayer.active = false;
        this.BillardMainPopup.active = false;
        for (let i = 0; i < this.BillardMainGameLayer.children.length; i++) {
            if (this.BillardMainGameLayer.children[i] == child) {
                this.BillardMainGameLayer.children[i].active = true;
            } else {
                this.BillardMainGameLayer.children[i].active = false;
            }
        }
        this.schedule(this.setWifiStatus, 1);

    },
    hideMainGameLayerWithChild: function () {
        this.BillardHomeLayer.active = false;
        this.BillardMainGameLayer.active = false;
        this.BillardLobbyLayer.active = false;
        this.BillardUILayer.active = false;
        this.BillardMainPopup.active = false;
    },
    hideLobbyLayer: function () {
        var _homeLayerComponent = this.BillardHomeLayer.getComponent("BillardsHomeLayer")
        if (_homeLayerComponent) {
            _homeLayerComponent.hideLobby();
        }
        this.BillardMainGameLayer.active = false;
        this.BillardLobbyLayer.active = false;
        this.BillardUILayer.active = false;
        this.BillardMainPopup.active = false;
        var BillardLobby = this.BillardLobbyLayer.getChildByName("BillardLobby");        
        if (BillardLobby && cc.isValid(BillardLobby)) {
            var betSetingComponent = BillardLobby.getComponent("BillardLobby");
            if (betSetingComponent && cc.isValid(betSetingComponent)) {
                var buttonBettSetting = betSetingComponent.betSetting;
                if (buttonBettSetting && cc.isValid(buttonBettSetting)) {
                    var buttonBettSettingComponent = buttonBettSetting.getComponent("betSetting");
                    if (buttonBettSettingComponent && cc.isValid(buttonBettSettingComponent)) {
                        buttonBettSettingComponent.check = false;
                    }
                }
            }
            var _lobbyComponent = BillardLobby.getComponent("BillardLobby");
            if (_lobbyComponent) {
                _lobbyComponent.removeEventListener();
            }
        }
    },
    onCreateBillardLobby: function (event) {
        cc.Global.ZONE_GAME = 0;
        if (event) {
            if (event && event.hasOwnProperty("ZONE") && event.ZONE != BiDaConstant.ZONE_ID.ZONEID_BIDA_LUCKY_SHOT) {
                cc.log(event.ZONE);
                Linker.ZONE = event.ZONE;
                this.showLobbyLayer({ opacity: 0 });
                this.unschedule(this.setWifiStatus);
                if (this.BillardLobbyLayer && this.BillardLobbyLayer.isValid) {
                    var bLobby = this.BillardLobbyLayer.getChildByName("BillardLobby");
                    var loading = null;
                    var btn = event.currentButton;
                    if (btn) {
                        loading = btn.getChildByName("loading");
                    }
                    if (bLobby) {
                        if (loading) {
                            loading.active = false;
                        }
                        bLobby.active = true;
                        //bLobby.getComponent("BillardLobby").initLobby();

                    } else {
                        if (loading) {
                            loading.active = true;
                            var loadingText = loading.getChildByName("loadingpercent").getComponent(cc.Label);
                            if (loadingText) {
                                loadingText.string = "0%";
                            }
                        }
                        cc.resources.load("bida/prefabs/BillardLobby", cc.Prefab, function (completedCount, totalCount, item) {
                            var percent = Math.round(100 * completedCount / totalCount);
                            if (loadingText) {
                                loadingText.string = percent + '%';
                                // cc.log(loadingText.string);
                            }
                        }, function (err, prefab) {
                            if (loading) {
                                loading.active = false;
                            }
                            if (!err) {
                                var Lobby = cc.instantiate(prefab);
                                this.BillardLobbyLayer.addChild(Lobby);
                            } else {
                                this.hideLobbyLayer();
                            }
                        }.bind(this));
                    }
                }
            } else {
                this.hideLobbyLayer();
            }
        }

    },


    onChangeMyCue: function (event) {
        var BillardsGameTable = this.BillardMainGameLayer.getChildByName("BillardsGameTable");
        var BillardsGameTableJS = BillardsGameTable.getComponent("BillardsGameTable");
        var cueId = event.cueId;
        BillardsGameTableJS.changeSpriteCue(cueId);
    },
    onChangeAvatar: function (event) {
        event.stopPropagation();
        this.BillardHomeLayer.getComponent("BillardsHomeLayer").onChangeAvatar(event);
    },
    onChangeName: function (event) {
        event.stopPropagation();
        this.BillardHomeLayer.getComponent("BillardsHomeLayer").onChangeName(event);
    },
    onSetUserMoney: function (event) {
        event.stopPropagation();
        this.BillardUILayer.getComponent("BillardUICommonLayer").setUserMoney(event);
    },
    onSetUserExp: function (event) {
        event.stopPropagation();
        this.BillardUILayer.getComponent("BillardUICommonLayer").setUserExp(event);
    },
    onSetUserID: function (event) {
        event.stopPropagation();
        this.BillardUILayer.getComponent("BillardUICommonLayer").setUserId(event);
    },
    onSetUserName: function (event) {
        event.stopPropagation();
        this.BillardUILayer.getComponent("BillardUICommonLayer").setUserName(event);
    },
    onSetUserAvatarAsFrame: function (event) {
        event.stopPropagation();
        this.BillardUILayer.getComponent("BillardUICommonLayer").setUserAvatarAsFrame(event);
    },
    onSetUserLevel: function (event) {
        event.stopPropagation();
        this.BillardUILayer.getComponent("BillardUICommonLayer").setUserLevel(event);
    },
    onOpenSettingPopup: function (event) {
        event.stopPropagation();
        this.BillardUILayer.getComponent("BillardUICommonLayer").showSettingPopup();
    },
    onOpenListCue: function (event) {
        event.stopPropagation();
        this.BillardUILayer.getComponent("BillardUICommonLayer").showListCuePopup();
    },
    onOpenRankRecharse: function (event) {
        event.stopPropagation();
        this.BillardUILayer.getComponent("BillardUICommonLayer").showRankRecharse(2);
    },
    onOpenUserInfoPopup: function (event) {
        event.stopPropagation();
        this.BillardUILayer.getComponent("BillardUICommonLayer").showUserInfoPopup(event);
    },
    onOpenGiftCodePopup: function (event) {
        event.stopPropagation();
        this.BillardUILayer.getComponent("BillardUICommonLayer").showGiftCodePopup();
    },
    onOpenMessagePopup: function (event) {
        event.stopPropagation();
        this.BillardUILayer.getComponent("BillardUICommonLayer").showMessagePopup();
    },
    onOpenGuidePopup: function (event) {
        event.stopPropagation();
        this.BillardUILayer.getComponent("BillardUICommonLayer").showGuidePopup();
    },
    onOpenFriendPopup: function (event) {
        event.stopPropagation();
        this.BillardUILayer.getComponent("BillardUICommonLayer").showFriendPopup();
    },
    onOpenFindFriendTab: function (event) {
        event.stopPropagation();
        this.BillardUILayer.getComponent("BillardUICommonLayer").showFindFriendTab();
    },
    onOpenInviteFriendTab: function (event) {
        event.stopPropagation();
        this.BillardUILayer.getComponent("BillardUICommonLayer").showInviteFriendTab();
    },
    onCloseFriendPopup: function (event) {
        event.stopPropagation();
        this.BillardUILayer.getComponent("BillardUICommonLayer").closeFriendPopup();
    },
    onClosedFriendPopup: function (event) {
        event.stopPropagation();
        var homeTop = this.getHomeTop();
        var homeTopScript = homeTop.getComponent("BillardHomeTop");
        if (homeTopScript) {
            homeTopScript.onClosedFriendNode(event);
        }
    },
    onOpenShopPopup: function (event) {
        event.stopPropagation();
        this.BillardUILayer.getComponent("BillardUICommonLayer").showShopPopup();
    },
    onOpenEventPopup: function (event) {
        event.stopPropagation();
        this.BillardUILayer.getComponent("BillardUICommonLayer").showEventPopup();
    },
    onOpenChatPopup: function (event) {
        this.BillardUILayer.getComponent("BillardUICommonLayer").showChatPopup();
    },
    onOpenVQMMPopup: function (event) {
        this.BillardUILayer.getComponent("BillardUICommonLayer").showVQMMPopup();
    },

    onOpenSendInvite(event) {
        this.BillardUILayer.getComponent("BillardUICommonLayer").showSendInvitePopup();
    },

    onOpenDailyGift(event) {
        event.stopPropagation();
        this.BillardUILayer.getComponent("BillardUICommonLayer").showDailyGift();
    },

    onOpenLeaderboard(event) {
        event.stopPropagation();
        this.BillardUILayer.getComponent("BillardUICommonLayer").showLeaderboard();
    },

    onClickPlayOffline(event) {
        event.stopPropagation();
        this.BillardUILayer.getComponent("BillardUICommonLayer").onClickPlayOffline();
    },

    onOpenMiniPorker(event) {
        event.stopPropagation();
        this.BillardUILayer.getComponent("BillardUICommonLayer").showMiniPorker();
    },

    onOpenMiniSlot(event) {
        event.stopPropagation();
        this.BillardUILayer.getComponent("BillardUICommonLayer").showMiniSlot();
    },

    onOpenLarva(event) {
        event.stopPropagation();
        this.BillardUILayer.getComponent("BillardUICommonLayer").showLarva();
    },

    onLogin: function (message) {
        this.configGame();
        //o day phai xem xet dang choi hay sao neu dang choi thi reconnect den ban choi game
    },
    configLogin: function (target) {
        if (target) {
            target.configLogin();
        } else {
            cc.log("Can not configLogin rightly this game ...");
        }
    },
    onLogout: function (message) {
        cc.log("log ma")
        this.BillardHomeLayer.active = true;
        this.BillardMainGameLayer.active = false;
        this.BillardLobbyLayer.active = false;
        this.BillardUILayer.active = false;
        this.BillardUILayer.removeAllChildren(true);
        this.BillardUILayer.getComponent("BillardUICommonLayer").onLogout();
        this.BillardMainPopup.active = false;
        this.configLogin(this._billardHomeLayerController);
        this.configLogin(this._billardMainLayerController);
        //o day phai xem xet dang choi hay sao neu dang choi thi reconnect den ban choi game
    },

    onOpenPopupChooseTypeGame(event) {
        cc.Global.ZONE_GAME = 0;
        this.BillardMainPopup.active = true;
        this.BillardMainPopup.getComponent("BillardMainPopup").showPopupChooseTypeGame();
    },

    onOpenPopupMiniGame(event) {
        cc.Global.ZONE_GAME = 1;
        this.BillardUILayer.active = true;
        this.BillardUILayer.getComponent("BillardUICommonLayer").showMiniGamePopup();
    },

    init: function (target) {
        if (target) {
            target.init();
        } else {
            cc.log("Can not initial rightly this game ...");
        }
    },

    onInvite: function (message) {
        if (message.status == 1 && !this.BillardMainGameLayer.active) {
            this.BillardUILayer.getComponent("BillardUICommonLayer").showInvitePopup(message.invite);
        }
    },

    sendRequestAutoNextTurn: function (e) {
        // var BillardGameTableController = this.getBillardsGameTableController();
        // if (BillardGameTableController) {
        //     BillardGameTableController.getComponent("BillardsGameTableController").sendRequestAutoNextTurn();
        // }
    },
    addSocketEventIap() {
        console.log("addSocketEventIap");
        Linker.Event.addEventListener("cashIap", this.onSendCashIap, this);

        Linker.Event.addEventListener(SocketConstant.COMMON.IAP, this.onCashIap, this);

    },
    onSendCashIap(receipt) {
        console.log("onSendCashIap:" + receipt);
        if (receipt) {
            var login = CommonSend.CashIap(receipt.receipt);
            Linker.Socket.send(login);
        }
    },
    onCashIap(message) {
        console.log("onCashIap:");
        cc.log(message);
        if (message) {
            if (message.data) {
                cc.Global.showMessage(message.data);
            }
        }
    }
    // update (dt) {},
});
