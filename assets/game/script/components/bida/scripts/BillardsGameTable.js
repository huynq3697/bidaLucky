var BiDaConstant = require('BiDaConstant');
var Linker = require('Linker');
var Global = require("Global2");
var Utils = require('Utils');
var NewAudioManager = require('NewAudioManager');
var PanelPlayerView11 = require("PanelPlayerView11");
var PanelPlayerView14 = require("PanelPlayerView14");
var CommonSend = require('CommonSend');
var i18n = require('i18n');
var Bida11GameTable = require('Bida11GameTable');
var Bida14GameTable = require('Bida14GameTable');
var BidaPhomGameTable = require('BidaPhomGameTable');
var DataAccess = require('DataAccess');
var DataManger = require('DataManger');
var PopupShowManager = require('PopupShowManager');
var Constant = require('Constant');
cc.Class({
    extends: cc.Component,
    properties: {
        DeskLuckyShotPlayPrefab: cc.Prefab,
        DeskNormalPlayPrefab: cc.Prefab,
        bidaTableTextures: {
            type: cc.Texture2D,
            default: []
        },
        bidaBgTexture2D: {
            type: cc.Texture2D,
            default: []
        },
        bidaCommonBackground: cc.Node,
        bidaFineTurningBlock: cc.Node,
        bidaFineTurningLayout: cc.Node,
        forcePowerDragNode: cc.Node,
        forcePowerSlider: cc.Node,
        bidaBallPrefab: cc.Prefab,
        cueObjPrefab: cc.Prefab,
        bidaBtnSlide: cc.Node,
        billardCommonAtlas: cc.SpriteAtlas,
        panelFineturning: cc.Node,
        panelPower: cc.Node,
        panelSlideView: cc.Node,
        panelTip: cc.Node,
        panelWhiteBall: cc.Node,
        panelSetting: cc.Node,
        panelUI: cc.Node,
        whiteBallViewPrefab: cc.Prefab,
        colorPower: cc.Sprite,
        //table infos
        avatarAtlas: cc.SpriteAtlas,
        //
        btnMenu: cc.Node,
        btnBack: cc.Node,
        btnPlayerViewList: cc.Node,
        billardListMyBallAtlas: cc.SpriteAtlas,
        WBallPosPrefab: cc.Prefab,
        panelUserContainer: cc.Node,
        BallInHolePrefab: cc.Prefab,
        panelUser1vs4Prefab: cc.Prefab,
        panelUser1vs1Prefab: cc.Prefab,
        panelUserBidaPhomPrefab: cc.Prefab,
        cofferEffect: cc.Prefab,
        nohuPrefab: cc.Prefab,
        nohuNode: cc.Node,
        listMoneyIcon: [cc.SpriteFrame],
        countNode: cc.Node,
        labelCountChat: cc.Label,
        btnChatPrivate: cc.Node,
        BallInHoleFXPrefab: cc.Prefab,
        itemThanhNgang: cc.Prefab,
    },
    ctor: function () {
        this.isMove = false;
        this.isFireTuringStart;
    },
    hideUsersRanking: function (start, end, waiting) {
        if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
            Bida14GameTable.hideUsersRanking(start, end, waiting);
        } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
            // Bida11GameTable.configPanelUsers(configPanelUser);
        } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
            BidaPhomGameTable.hideUsersRanking(start, end, waiting);
        }
    },
    onLoad: function () {
        if(Linker.MySdk){
            Linker.MySdk.bannerBottom();
        }
        CC_DEBUG = true;
        this.maxDiffForce = 100;
        this.myUserId = Linker.userData ? Number(Linker.userData.userId) : null;
        this._isTipped = false;
        this._isCheckPredict = false;
        this.loadAudioSource();
        // this.addIconInvitesInsideMenu();
        var parent = cc.find("Canvas");
        // this.addWidgetTo(false, true, false, false, this.panelFineturning, parent, {
        //     left: -5.00,
        //     right: 1217.22,
        //     bottom: 142.50,
        //     top: 112.50
        // }, true);
        // this.panelPower.position = cc.v3(598, 0, 0);
        // this.addWidgetTo(true, false, false, false, this.panelPower, parent, {
        //     left: 1209.50,
        //     right: -13.50,
        //     bottom: 152.50,
        //     top: 152.50
        // }, true);
        this.addWidgetTo(true, true, true, false, this.panelSetting, parent, {
            left: 0,
            right: 0,
            bottom: 0,
            top: 0
        }, false);
        Utils.Malicious.addIconInvites({
            btnParent: this.btnMenu
        }, function (err, containerIcon) {
            if (!err) {
                if (!Linker.BiDaOfflineController) {
                    Linker.Event.addEventListener(7051, this.onGetSendFriend, this);
                    this.sendRequests();
                }
            }
        }.bind(this));
        this.loadAtlasAvatar();
    },
    loadAtlasAvatar: function (cb) {
        cc.resources.load("avatar/avatar", cc.SpriteAtlas, function (err, atlas) {
            if (!err) {
                Global.avatarAtlas = atlas;
                if (cb) {
                    cb(null, Global.avatarAtlas);
                }
                cc.log("Load avatar frame resoures successfully now ...", atlas);
            } else {
                Global.avatarAtlas = {};
                if (cb) {
                    cb(true, null);
                }
                cc.log("Can not load avatar frame resoures now ...");
            }
        });
    },
    showLogoGame: function () {
        if (!cc.find("logo")) {
            if (this.bidaTableBackground) {
                this.bidaTableBackground.parent.getComponent("Desk").showLogo(Linker.ZONE);
            }
        }
    },
    addWidgetTo: function (left, right, top, bottom, node, target, data, isBlockInputEvent) {
        var _wiget = node.getComponent(cc.Widget);
        if (!_wiget || (_wiget && !cc.isValid(_wiget))) {
            _wiget = node.addComponent(cc.Widget);
        }
        _wiget.enabled = true;
        _wiget.isAlignLeft = left;
        _wiget.isAlignRight = right;
        _wiget.isAlignTop = top;
        _wiget.isAlignBottom = bottom;
        _wiget.target = target;

        _wiget.top = data.top;
        _wiget.bottom = data.bottom;
        _wiget.left = data.left;
        _wiget.right = data.right;
        if (isBlockInputEvent) {
            //add block input event listener
            var _block = node.getComponent(cc.BlockInputEvents);
            if (!_block || (_block && !cc.isValid(_block))) {
                _block = node.addComponent(cc.BlockInputEvents);
            }
            _block.enabled = true;
        }

    },
    addIconInvitesInsideMenu: function () {
        this.panelUI.getComponent("PanelUIGame").addIconInvites();
    },
    onGetSendFriend: function (message) {
        if (message.status == 1) {
            if (message.listSendFriends) {
                if (this.btnMenu && cc.isValid(this.btnMenu) && this.btnMenu.labelFriendSended && cc.isValid(this.btnMenu.labelFriendSended)) {
                    var num = message.listSendFriends.length;
                    var containerIcon = this.btnMenu.getChildByName("containerIcon");
                    Utils.Malicious.runAnimationNumberFriendReq(this.btnMenu, containerIcon, num, {});
                    //inside menu
                    var insideMenuBtn = this.panelUI.getComponent("PanelUIGame").getFriendMenuButton();
                    if (insideMenuBtn && insideMenuBtn.iconInvite && cc.isValid(insideMenuBtn.iconInvite)) {
                        Utils.Malicious.runAnimationNumberFriendReq(insideMenuBtn, insideMenuBtn.iconInvite, num, {});
                    }
                }
            }
        }
    },
    initViewer: function () {
        this.setViewerNumber();
    },
    resetReadyStatus: function () {
        var players = this.getAllPlayer();
        if (players && Array.isArray(players)) {
            cc.log("players", players);
            for (var j = 0; j < players.length; j++) {
                var Component = null;
                Component = players[j].getComponent("BillardUserView");
                if (!Component) {
                    Component = players[j].getComponent("itemPlayerView");
                }
                if (Component) {
                    Component.setReady(false);
                }
            }
        }
    },
    setViewerNumber: function () {
        var viewer = this.btnPlayerViewList.parent;
        var ic_cham = viewer.getChildByName("ic_cham");
        var soNguoiXemLabel = ic_cham.getChildByName("textSoNguoi");
        if (soNguoiXemLabel) {
            var num = 0;
            var players = this.getAllPlayerInMatch();
            cc.log(players);
            if (players && players.players_viewing) {
                if (players.players_viewing) {
                    num = players.players_viewing.length;
                }
            }

            num = parseInt(num);
            //check dieu kien
            if (isNaN(num) == false && num > 0) {
                ic_cham.active = true;
                // viewer.active = true;
            } else {
                num = 0;
                ic_cham.active = false;
                // viewer.active = false;
            }
            if (num == 0) {
                num = "";
            }
            if (!Linker.BiDaOfflineController) {
                viewer.active = true;
            }
            soNguoiXemLabel.getComponent(cc.Label).string = num;
        }
    },
    initNohu: function () {
        var node = this.nohuNode.getChildByName('NoHuIcon');
        if (!node) {
            var nohuPrefab = cc.instantiate(this.nohuPrefab);
            // nohuPrefab.setScale(0.9, 0.9);
            this.nohuNode.addChild(nohuPrefab, cc.macro.MAX_ZINDEX - 100);
        } else {
            node.active = true;
        }
    },
    setWifiSignalAsFrame: function (frame) {
        if (this.wifiSignalNode && this.wifiSignalNode.isValid) {
            this.wifiSignalNode.getComponent(cc.Sprite).spriteFrame = frame;
        }
    },
    loadAudioSource: function () {
        var audioS = this.node.getComponents(cc.AudioSource);
        if (audioS) {
            for (let i = 0; i < audioS.length; i++) {
                var nClip = audioS[i].clip.name;
                this[nClip] = audioS[i];
            }
        }
    },
    getPlayerIdLuotDanh: function () {
        var BillardsGameTableController = this.getBillardController();
        if (BillardsGameTableController && !BillardsGameTableController._isViewMatch) {
            if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1 || Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
                return Number(BillardsGameTableController.idplayerLuotDanh);
            } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
                return Number(Linker.userData.userId);
            }
        }
        return 0;
    },
    setPlayerIdLuotDanh: function (id) {
        var BillardsGameTableController = this.getBillardController();
        if (BillardsGameTableController) {
            if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_LUCKY_SHOT) {
                BillardsGameTableController.idplayerLuotDanh = id;
            }
        }

    },
    showCountChat(count) {
        if (this.countNode && this.countNode.isValid) {
            this.countNode.active = true;
            this.labelCountChat.string = count;
        }
    },

    hideCountChat() {
        this.nodeCount.active = false;
    },

    configPanelUsers: function () {
        //chứa list bi nhắc trên bàn.
        this.myListBallOnHand = [];
        this.panelUserScript = null;
        this.myUserInfo = null;
        this.rankingUserInfo = null;
        this.myBallistDisplay = null;
        this.otherBallistDisplay = null;
        this.otherUserInfo = null;
        this.redPointNode = null;
        this.tableIDNode = null;
        this.betMoneyNode = null;
        this.billardPointTo = null;
        this.wifiSignalNode = null;
        this.moneyIcon = null;
        var configPanelUser = {
            BillardsGameTable: this
        }
        if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
            Bida14GameTable.configPanelUsers(configPanelUser);

        } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
            Bida11GameTable.configPanelUsers(configPanelUser);

        } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
            BidaPhomGameTable.configPanelUsers(configPanelUser);

        }
        if (this.panelUserScript) {
            //khoi tao logic chung
            //redpointnode
            if (!this.redPointNode || (this.redPointNode && this.redPointNode.isValid == false)) {
                this.redPointNode = this.panelUserScript.getRedPointNode();
            }
            //tableidnode
            if (!this.tableIDNode || (this.tableIDNode && !this.tableIDNode.isValid)) {
                this.tableIDNode = this.panelUserScript.getTableIdNode();
            }
            //betnodemoney
            if (!this.betMoneyNode || (this.betMoneyNode && !this.betMoneyNode.isValid)) {
                this.betMoneyNode = this.panelUserScript.getBetMoneyNode();
            }
            //billardpointtonode
            if (!this.billardPointTo || (this.billardPointTo && !this.billardPointTo.isValid)) {
                this.billardPointTo = this.panelUserScript.getBillardPointTo();
                this.billardPointTo.parent.opacity = 0;
            }
            //wifi signal
            if (!this.wifiSignalNode || (this.wifiSignalNode && !this.wifiSignalNode.isValid)) {
                this.wifiSignalNode = this.panelUserScript.getWifiSignalNode();
            }
            //money icon node
            if (!this.moneyIcon || (this.moneyIcon && !this.moneyIcon.isValid)) {
                this.moneyIcon = this.panelUserScript.getMoneyIcon();
            }
        }
    },
    getRailingBagComponent: function () {
        if (this.railChuaBi && this.railChuaBi.isValid) {
            return this.railChuaBi.getComponent("RailChuaBi");
        }
        return null;
    },

    getFrameById: function (atlas, id) {
        if (!atlas) {
            return null;
        }
        var idframe = Number(id);
        if (isNaN(idframe)) {
            idframe = 1;
        }
        var frame = atlas.getSpriteFrame("avatar (" + idframe + ")");
        if (!frame) {
            frame = atlas.getSpriteFrame("avatar (1)");
        }
        if (frame) {
            return frame;
        }
    },
    getPlayerByUserId: function (id) {
        var players = [];
        if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4 || Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
            players = Utils.Malicious.flattern([
                [this.myUserInfo], this.rankingUserInfo
            ]);

        } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
            players = [this.myUserInfo, this.otherUserInfo];
        }
        for (let i = 0; i < players.length; i++) {
            var BillardUserView = players[i].getComponent("BillardUserView");
            if (BillardUserView && BillardUserView.getUserID() == id) {
                return players[i];
            }
        }
        return null;
    },
    getPlayerByUserIdIncludeViewing: function (id) {
        var players = [];
        if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4 || Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
            players = Utils.Malicious.flattern([
                [this.myUserInfo], this.rankingUserInfo
            ]);

        } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
            players = [this.myUserInfo, this.otherUserInfo];
        }
        cc.log("lay nguoi choi bao gom ca player dang xem nha");
        var _panelPlayerView = this.panelUI.getComponent("PanelUIGame").getPanelPlayerView();
        var _playersView = [];
        if (_panelPlayerView && cc.isValid(_panelPlayerView)) {
            var _panelPlayerViewComponent = _panelPlayerView.getComponent("PanelPlayerView");
            if (_panelPlayerViewComponent && cc.isValid(_panelPlayerViewComponent)) {
                _playersView = _panelPlayerViewComponent.getAllUserViewing().listPlayers;
            }
        }
        players = Utils.Malicious.flattern([players, _playersView]);
        var playerList = [];
        for (let i = 0; i < players.length; i++) {
            var Component = null;
            Component = players[i].getComponent("BillardUserView");
            if (!Component) {
                Component = players[i].getComponent("itemPlayerView");
            }
            if (Component && Component.getUserID() == id) {
                playerList.push(players[i]);
            }
        }
        return playerList;
    },
    getAllPlayer: function () {
        var players = [];
        if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4 || Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
            players = Utils.Malicious.flattern([
                [this.myUserInfo], this.rankingUserInfo
            ]);

        } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
            players = [this.myUserInfo, this.otherUserInfo];
        }
        var _panelPlayerView = this.panelUI.getComponent("PanelUIGame").getPanelPlayerView();
        var _playersView = [];
        if (_panelPlayerView && cc.isValid(_panelPlayerView)) {
            var _panelPlayerViewComponent = _panelPlayerView.getComponent("PanelPlayerView");
            if (_panelPlayerViewComponent && cc.isValid(_panelPlayerViewComponent)) {
                _playersView = _panelPlayerViewComponent.getAllUserViewing().listPlayers;
            }
        }
        return Utils.Malicious.flattern([players, _playersView]);;
    },
    getIdPlayerIsMasterInTable: function () {
        var players = [];
        if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4 || Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
            players = Utils.Malicious.flattern([
                [this.myUserInfo], this.rankingUserInfo
            ]);

        } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
            players = [this.myUserInfo, this.otherUserInfo];
        }
        for (let i = 0; i < players.length; i++) {
            var BillardUserView = players[i].getComponent("BillardUserView");
            var idPlayer = BillardUserView.getUserID();
            if (BillardUserView && idPlayer != 0 && BillardUserView.getMaster()) {
                return idPlayer;
            }
        }
        return null;
    },
    getNumberSlotEmptyOnRanking: function () {
        var slots = [];
        var players = [];
        if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4 || Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
            players = Utils.Malicious.flattern([
                [this.myUserInfo], this.rankingUserInfo
            ]);
        } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
            players = [this.myUserInfo, this.otherUserInfo];
        }
        for (let i = 0; i < players.length; i++) {
            var BillardUserView = players[i].getComponent("BillardUserView");
            if (BillardUserView) {
                var id = BillardUserView.getUserID();
                id = parseInt(id)
                if (isNaN(id) == true || !id || id == 0 || id == null || id == undefined) {
                    slots.push(players[i]);
                }
            }
        }
        return slots;
    },
    addOtherPlayerJoined: function (message) {
        if (this && this.isValid) {
            var otherPlayer = {
                message: message,
                BillardsGameTable: this
            }
            if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
                Bida11GameTable.addOtherPlayerJoined(otherPlayer);
            } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
                Bida14GameTable.addOtherPlayerJoined(otherPlayer);
            } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
                BidaPhomGameTable.addOtherPlayerJoined(otherPlayer);
            }
        }
    },
    getPlayerPlaying: function () {
        var playersInfoIds = [];
        var playersInfo = [];
        var listUsers = [];
        if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
            listUsers = [this.myUserInfo, this.otherUserInfo];
        } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
            listUsers = Utils.Malicious.flattern([
                [this.myUserInfo], this.rankingUserInfo
            ]);
        } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
            listUsers = Utils.Malicious.flattern([
                [this.myUserInfo], this.rankingUserInfo
            ]);
        }
        //list dang co tren ban choi
        for (var i = 0; i < listUsers.length; i++) {
            var userInfoView = listUsers[i].getComponent("BillardUserView");
            if (userInfoView) {
                var id = parseInt(userInfoView.getUserID());
                if (isNaN(id) == false && id != 0) {
                    if (playersInfoIds.indexOf(id) == -1) {
                        playersInfo.push({
                            userAvatarFrame: userInfoView.getUserAvatarFrame(),
                            userMoney: userInfoView.getUserMoney(),
                            userName: userInfoView.getUserName(),
                            userID: id,
                            userNationFrame: userInfoView.getNationFrame(),
                            userCountryId: userInfoView.getUserCountryId(),
                            userLevel: userInfoView.getUserLevel(),
                            userPercentMatch: userInfoView.getPercentMatch(),
                            isMaster: userInfoView.getMaster(),
                            opacity: userInfoView.getOpacityPlayer(),
                            waitingStatus: userInfoView.getWaitingStatus(),
                            isReady: userInfoView.getReady()
                        })
                        playersInfoIds.push(id);
                    }
                }
            }
        }
        return {
            listPlayersWithData: playersInfo,
            listPlayersWithId: playersInfoIds
        };
    },

    getPanelPlayerView: function () {
        var _panelPlayerView = this.panelUI.getComponent("PanelUIGame").getPanelPlayerView();
        if (_panelPlayerView && cc.isValid(_panelPlayerView)) {
            var _panelPlayerViewComponent = _panelPlayerView.getComponent("PanelPlayerView");
            if (_panelPlayerViewComponent && cc.isValid(_panelPlayerViewComponent)) {
                return _panelPlayerViewComponent;
            }
        }
        return null;
    },
    getAllPlayerInMatch: function () {
        var dataPlaying = {};
        var listPlayerTrongTran = [];
        var listPlayerIdTrongTran = [];
        var listPlayerDangXem = [];
        var listPlayerIdDangXem = [];
        var _allPlayersViewing = {};
        var tatCatNguoiChoiCoTrongBan = [];

        var _panelPlayerView = this.panelUI.getComponent("PanelUIGame").getPanelPlayerView();
        var _isValidToReconfig = false;
        if (_panelPlayerView && cc.isValid(_panelPlayerView)) {
            var _panelPlayerViewComponent = _panelPlayerView.getComponent("PanelPlayerView");
            if (_panelPlayerViewComponent && cc.isValid(_panelPlayerViewComponent)) {
                _isValidToReconfig = true;
            }
        }
        dataPlaying = this.getPlayerPlaying();
        listPlayerTrongTran = dataPlaying.listPlayersWithData;
        listPlayerIdTrongTran = dataPlaying.listPlayersWithId;

        //list dang co tren ban cho
        if (_isValidToReconfig) {
            _allPlayersViewing = _panelPlayerViewComponent.getAllUserViewing();
            listPlayerDangXem = _allPlayersViewing.listPlayersWithData;
            listPlayerIdDangXem = _allPlayersViewing.listPlayersWithIds;
            tatCatNguoiChoiCoTrongBan = Utils.Malicious.flattern([listPlayerTrongTran, listPlayerDangXem]);
        }
        var data = {
            playerInfs: listPlayerTrongTran,
            playerIds: listPlayerIdTrongTran,
            players_viewing: listPlayerDangXem,
            players_id_viewing: listPlayerIdDangXem,
            all_players_in_table: tatCatNguoiChoiCoTrongBan
        };
        cc.log("data in match", data);
        return data;
    },
    getListPlayerInfos: function (data) {
        var playerids = data.playerids;
        var _allPlayerInMatch;
        var playersInfo = [];
        var _isMePlaying = false;
        var playerInMatch = [];
        var playerInView = [];

        _allPlayerInMatch = this.getAllPlayerInMatch();
        // var playersInfoIds = _allPlayerInMatch.playerIds;
        playersInfo = _allPlayerInMatch.all_players_in_table;
        // playersInfo = _allPlayerInMatch.all_players_in_table;
        //resort
        //de xem minh co duoc choi nua khong
        for (var m = 0; m < playersInfo.length; m++) {
            var id = parseInt(playersInfo[m].userID);
            var playerIndex = playerids.indexOf(id);
            playersInfo[m].isMaster = false;
            if (playerIndex != -1) {
                //neu nguoi choi la chu ban cho phep moi choi
                if (playerIndex == 0) {
                    playersInfo[m].isMaster = true;
                }
                playerInMatch.push(playersInfo[m]);
            } else {
                playerInView.push(playersInfo[m]);
            }
        }
        //resort phan tu dau tien phai la toi
        var _tmpPlayerInMatch = [];
        for (let i = 0; i < playerInMatch.length; i++) {
            var id = parseInt(playerInMatch[i].userID);
            if (Number(Linker.userData.userId) == id) {
                _tmpPlayerInMatch.push(playerInMatch[i]);
                playerInMatch.splice(i, 1);
                break;
            }
        }
        playerInMatch = Utils.Malicious.flattern([_tmpPlayerInMatch, playerInMatch]);
        //
        this.myUserId = this.myUserId ? this.myUserId : Number(Linker.userData.userId);
        if (playerids.indexOf(Number(this.myUserId)) != -1) {
            _isMePlaying = true;
        }
        var data = {
            _isMePlaying: _isMePlaying,
            playerInView: playerInView,
            playerInMatch: playerInMatch,
            playersInfo: playersInfo
        };
        cc.log('data infos', data);
        return data;
    },
    hideAllMyBallistDisplay: function () {
        var data = {
            BillardsGameTable: this,
        }
        if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
            Bida11GameTable.hideAllMyBallistDisplay(data);
        } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
            Bida14GameTable.hideAllMyBallistDisplay(data);
        } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
            BidaPhomGameTable.hideAllMyBallistDisplay(data);
        }
    },
    hideAllOtherBallistDisplay: function () {
        var data = {
            BillardsGameTable: this,
        }
        if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
            Bida11GameTable.hideAllOtherBallistDisplay(data);
        } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
            // Bida14GameTable.hideAllOtherBallistDisplay(data);
        } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
            // BidaPhomGameTable.hideAllOtherBallistDisplay(data);
        }
    },
    reConfigPlayersInGame: function (message) {
        var playerids = message.playerids;
        var BillardsGameTableController = this.getBillardController();
        var _panelPlayerView = this.panelUI.getComponent("PanelUIGame").getPanelPlayerView();
        var _isValidToReconfig = false;
        if (_panelPlayerView && cc.isValid(_panelPlayerView)) {
            var _panelPlayerViewComponent = _panelPlayerView.getComponent("PanelPlayerView");
            if (_panelPlayerViewComponent && cc.isValid(_panelPlayerViewComponent)) {
                _isValidToReconfig = true;
            }
        }
        if (BillardsGameTableController && _isValidToReconfig) {
            var reconfigPlayer = {
                BillardsGameTable: this,
                message: message
            }
            if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
                Bida11GameTable.reConfigPlayersInGame(reconfigPlayer);
            } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
                Bida14GameTable.reConfigPlayersInGame(reconfigPlayer);
            } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
                BidaPhomGameTable.reConfigPlayersInGame(reconfigPlayer);
            }
        }

    },
    init: function () {
        this.timer = 0;
        this._isShoted = false;
        this._isSetNextTurn = false;
        this._isShowPopupYourBallList = false;
        this._isSendedBeforeTurn = false;
        this._isGameStarted = false;
        this.id_ball_lose = [];
        this.id_ball_lose_global = [];
        this._isBallHit_global = BiDaConstant.GAME.STATUS.BALL_ERROR.BI_MUC_TIEU_KHONG_CHAM_BAT_CU_BI_NAO_CA;
        this._isDataEndTurnGame = false; //neu tin hieu ket thuc turn server gui truoc khi tat ca bi dung han thi phai hien thi sau
        this._tmpEndTurnDataServerWaiting = null;
        this._isBallHit = BiDaConstant.GAME.STATUS.BALL_ERROR.BI_MUC_TIEU_KHONG_CHAM_BAT_CU_BI_NAO_CA;
        this.is2BallHitLuckyShot = false;
        this.initView();
        this.configDefault();
        this.initDesk();
        if (Linker.ZONE != BiDaConstant.ZONE_ID.ZONEID_BIDA_LUCKY_SHOT) {
            // this.initCountDownTimeLeft();
            this.setErrorNumber([]);
        }
        this.showLogoGame();
    },
    getStartAnimationCard: function (data) {
        var _data = data;
        if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
            return BidaPhomGameTable.getStartAnimationCard(_data);
        }
        return null;
    },
    initListPlayerView: function (message) {
        if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
            Bida11GameTable.initListPlayerView(message);
        } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
            Bida14GameTable.initListPlayerView(message);
        } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
            BidaPhomGameTable.initListPlayerView(message);
        }
    },
    initTableInfo: function (message) {
        if (this && cc.isValid(this)) {
            Global.Announcement._hideLoading();
            cc.log("_________initTableInfo", message);

            var billardLobby = cc.find("BillardMainLobby/BillardLobby", this.node.parent.parent);
            if (billardLobby) {
                billardLobby.getComponent("BillardLobby").firstCashBet = message.minMoney;
            }

            if (!Linker.BiDaOfflineController) {
                message = Linker.CURRENT_TABLE;
            }
            this.hideTimeCountDownBallError();
            var billardsGameTableController = this.getBillardController();
            var initTableData = {
                BillardsGameTableController: billardsGameTableController,
                BillardsGameTable: this,
                message: message
            }
            if (this && this.isValid) {
                var popopInviteLayer = null;
                if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {

                    popopInviteLayer = this.node.parent.getChildByName("PopupInvite1vs1");
                    // this.initTableInfo1vs1(message);
                    Bida11GameTable.initTableInfo(initTableData);
                } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
                    popopInviteLayer = this.node.parent.getChildByName("PopupInvite1vs4");
                    // this.initTableInfo1vs4(message);
                    Bida14GameTable.initTableInfo(initTableData);
                } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
                    popopInviteLayer = this.node.parent.getChildByName("PopupInvite1vs4");
                    // this.initTableInfo1vs4(message);
                    BidaPhomGameTable.initTableInfo(initTableData);
                }
                if (Linker.CURRENT_TABLE && Linker.CURRENT_TABLE.isPlayWithFriend) {
                    if (popopInviteLayer) {
                        var customEvent = new cc.Event.EventCustom(BiDaConstant.GAME_COMMONS_EVENT.SHOW_GAME_LAYER, true);
                        customEvent.child = popopInviteLayer;
                        this.node.dispatchEvent(customEvent);
                    }
                }
            }
            if (!Linker.BiDaOfflineController) {
                this.sendRequests();
            }
        }
    },
    sendRequests: function () {
        this.requestSendFriendByPage(1);
    },
    requestSendFriendByPage: function (page) {
        var send = CommonSend.getFriendSend(page);
        if (send) {
            Linker.Socket.send(send);
        }
    },

    getUserRankingById: function (id) {
        for (let i = 0; i < this.rankingUserInfo.length; i++) {
            var userInfoComponentRanking = this.rankingUserInfo[i].getComponent("BillardUserView");
            if (userInfoComponentRanking) {
                if (userInfoComponentRanking.getUserID() == Number(id)) {
                    return this.rankingUserInfo[i];
                }
            }
        }
        return null;
    },
    getUserReadyById: function (id) {
        if (id) {
            id = parseInt(id);
            if (isNaN(id) == false) {
                var players = this.getPlayerByUserIdIncludeViewing(id); //return []
                if (players) {
                    for (var i = 0; i < players.length; i++) {
                        var componentUser = null;
                        componentUser = players[i].getComponent("BillardUserView");
                        if (!componentUser) {
                            componentUser = players[i].getComponent("itemPlayerView");
                        }
                        if (componentUser) {
                            var currentId = Number(componentUser.getUserID());
                            if (currentId == id) {
                                return componentUser.getReady();
                            }
                        }
                    }
                }
            }
        }
        return false;
    },
    gameBegin: function (message) {
        if (this && cc.isValid(this)) {
            Linker._sceneTag = BiDaConstant.TAG.scenes.GAME;
            this.initViewer();
            this.addTouchEventListener();
            this.addCustomEventDispatch();
            this.setCueRotateCueListener();
            var dataPos = message.ballPos ? message.ballPos : message.dataBall;
            this.taoBideBatdauTranDau(dataPos);
            this.dataPosGameBegin = dataPos;
            this.taoCueTrenBanChoi();
            this.panelPower.active = true;
            this.cue.active = true;
            this.showCueUI();
            this.cue.getChildByName("drawLine").opacity = 0;
            this._isGameStarted = true;
            this.myUserId = Number(Linker.userData.userId);
            this._isShoted = false;
            this._isDataEndTurnGame = false;
            // this.myListBallOnHand = [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15];
            this.myListBallOnHand = (Linker.ZONE != BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) ? Utils.Malicious.createDefaultMyBallArr() : [];
            this.myUserInfo.getComponent("BillardUserView").player_list_ball_tren_tay = this.myListBallOnHand;
            this.getRailingBagComponent().removeAllBiInBag();
            // 
            var gameBeginData = {
                BillardsGameTable: this,
                message: message
            }
            if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
                Bida14GameTable.gameBegin(gameBeginData);
            } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
                Bida11GameTable.gameBegin(gameBeginData);
            } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
                BidaPhomGameTable.gameBegin(gameBeginData);
            }
            //Dành cho debugger bật lên một lần
            if (CC_DEBUG) {
                Utils.Malicious.setMouseJointTest(this.bidaDeskNode);
            }
        }
    },
    blockCueRotation: function () {
        if (this.blockInputEventComponent && cc.isValid(this.blockInputEventComponent)) {
            //block cue rotation
            this.blockInputEventComponent.enabled = true;
        }
    },
    blockCueRuler: function () {
        //block cue ruler
        this.blockInputEventCueRulerComponent = Utils.Malicious.addNewBlockInputEventNode(this.panelFineturning);
        if (this.blockInputEventCueRulerComponent && cc.isValid(this.blockInputEventCueRulerComponent)) {
            this.blockInputEventCueRulerComponent.enabled = true;
        }
    },
    blockCuePower: function () {
        //block cue power
        this.blockInputEventCuePowerComponent = Utils.Malicious.addNewBlockInputEventNode(this.panelPower);
        if (this.blockInputEventCuePowerComponent && cc.isValid(this.blockInputEventCuePowerComponent)) {
            this.blockInputEventCuePowerComponent.enabled = true;
        }
    },
    unBlockCueRotation: function () {
        if (this.blockInputEventComponent && cc.isValid(this.blockInputEventComponent)) {
            //un block cue rotation
            this.blockInputEventComponent.enabled = false;
            // cc.error("unblock cue ok")
        } else {
            // cc.error("khong tim thay block event cue ok")
        }
    },
    unBlockCueRuler: function () {
        //un block cue ruler
        this.blockInputEventCueRulerComponent = Utils.Malicious.addNewBlockInputEventNode(this.panelFineturning);
        if (this.blockInputEventCueRulerComponent && cc.isValid(this.blockInputEventCueRulerComponent)) {
            this.blockInputEventCueRulerComponent.enabled = false;

        }
    },
    unBlockCuePower: function () {
        //un block cue power
        this.blockInputEventCuePowerComponent = Utils.Malicious.addNewBlockInputEventNode(this.panelPower);
        if (this.blockInputEventCuePowerComponent && cc.isValid(this.blockInputEventCuePowerComponent)) {
            this.blockInputEventCuePowerComponent.enabled = false;
        }
    },
    blockTouchEvent: function () {
        this.showCueUI();
        this.blockCueRotation();
        this.cue.getComponent("CueObj").blockTouchEvent();
        this.blockCueRuler();
        this.blockCuePower();
        this.panelPower.active = true;
        this.panelWhiteBall.active = false;
        this.panelWhiteBall.removeAllChildren(true);
    },
    unBlockTouchEvent: function () {
        this.showCueUI();
        this.unBlockCueRotation();
        this.cue.getComponent("CueObj").unBlockTouchEvent();
        this.unBlockCueRuler();
        this.unBlockCuePower();
        this.panelPower.active = true;
        this.panelWhiteBall.active = false;
        this.panelWhiteBall.removeAllChildren(true);
    },
    configDefault: function () {
        //m_rotate dung cho luc keo bi pull num
        this.m_rotate = cc.v2(0, 0);
        this.tickTime = 0;
        var config = {
            BillardsGameTable: this
        };
        if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
            Bida14GameTable.configDefault(config);
        } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
            Bida11GameTable.configDefault(config);
        } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
            BidaPhomGameTable.configDefault(config);
        }
    },
    addCustomEventDispatch: function () {
        this.node.on(BiDaConstant.GAME_TABLE_EVENT.HIEN_THI_BI_DANG_CHI_DEN, this.showTargetBillard, this);
        this.node.on(BiDaConstant.GAME_TABLE_EVENT.SET_LUC_PULL_BI_TU_WHITE_BALL_VIEW, this.onRedPointSetPullNum, this);
        this.node.on(BiDaConstant.GAME_TABLE_EVENT.BI_MUC_TIEU_VA_CHAM_VOI_MOT_BI_BAT_KY, this.setTargetBallHitOther, this);
        this.node.on(BiDaConstant.GAME_TABLE_EVENT.BI_MUC_TIEU_VA_CHAM_VOI_MOT_BI_BAT_KY_BOT, this.setTargetBallBotHitOther, this);
        this.node.on(BiDaConstant.GAME_TABLE_EVENT.HIEN_CUE_KHI_BI_TRANG_BI_ROI_XUONG_LO, this.showDrawrouteWhiteBallAdded, this);
        this.node.on(BiDaConstant.GAME_TABLE_EVENT.BI_MUC_TIEU_VA_CHAM_VOI_BI_8_LUCKY_SHOT, this.set2BallTargetVaChamLuckyShot, this);
    },
    setTargetBallHitOther: function () {
        this._isBallHit = BiDaConstant.GAME.STATUS.BALL_ERROR.BI_MUC_TIEU_DA_CHAM_VAO_MOT_BI_NAO_DO;
    },
    setTargetBallBotHitOther: function () {
        this._isBallHit_global = BiDaConstant.GAME.STATUS.BALL_ERROR.BI_MUC_TIEU_DA_CHAM_VAO_MOT_BI_NAO_DO;
    },
    onBillardClickEvent: function (event) {
        NewAudioManager.playClick();
        var target = event.currentTarget;
        if (target) {
            if (target === this.btnMenu) {
                this.panelUI.getComponent("PanelUIGame").showMenuPopUP();
            } else if (target === this.btnPlayerViewList) {
                this.panelUI.getComponent("PanelUIGame").showPanelPlayerView();
            } else if (target === this.btnChatPrivate) {
                this.countNode.active = false;
                this.labelCountChat.string = 0;
                this.panelUI.getComponent("PanelUIGame").showPopupChatPrivate();
            } else if (target === this.btnBack) {
                var customEvent = new cc.Event.EventCustom(BiDaConstant.GAME_TABLE_EVENT.REQUEST_LEAVE_TABLE, true);
                this.node.dispatchEvent(customEvent);
            }
        }
    },
    showTargetBillard: function (event) {
        if (event) {
            this.billardPointTo.parent.opacity = 255;
            var num = event.idBi;
            var frame = this.billardCommonAtlas.getSpriteFrame("icon_bi");
            if (Number(num) != 0) {
                frame = this.billardCommonAtlas.getSpriteFrame(Number(num).toString());
                if (!this.isMove) {
                    // NewAudioManager.PlaySoundPointToBall(num);
                }
            } else {
                this.billardPointTo.parent.opacity = 0;
            }
            this.billardPointTo.getComponent(cc.Sprite).spriteFrame = frame;
        }
    },


    initDesk: function () {
        this.vitriBiTrang = cc.v2(318.784, 306);
        this.vitriBiSo1 = cc.v2(768.837, 306);
        this.kichThuocVienBi = 13 * 2;
        this.addCommonEventDispatcher();
    },
    addCommonEventDispatcher: function () {
        this.btnMenu.on(cc.Node.EventType.TOUCH_END, this.onBillardClickEvent, this);
        this.btnBack.on(cc.Node.EventType.TOUCH_END, this.onBillardClickEvent, this);
    },
    runEndGamePoup: function (time, data, type, cb) {
        cc.log("EndGamePopup");
        var sliderViewController = this.panelSlideView.getComponent("SliderView");
        this.panelSlideView.active = true;
        if (type == 0) {
            NewAudioManager.PlayUrl(Linker.gameLanguage == "vi" ? NewAudioManager.SOUND.VI.LOSE : NewAudioManager.SOUND.EN.LOSE);
        } else NewAudioManager.PlayUrl(Linker.gameLanguage == "vi" ? NewAudioManager.SOUND.VI.WIN : NewAudioManager.SOUND.EN.WIN);
        if (sliderViewController) {
            sliderViewController.runEndGamePoup(time, data, type, function (err, data) {
                if (!err) {
                    if (cb) {
                        cb(null, true);
                    }
                } else {
                    if (cb) {
                        // cc.error("runEndGamePopup Error" + err);
                        cb(true, null);
                    }
                }
            }.bind(this))
        }
    },
    runEndGamePoup1vs4: function (time, data, type, cb) {
        var sliderViewController = this.panelSlideView.getComponent("SliderView");
        this.panelSlideView.active = true;
        if (type == 0) {
            NewAudioManager.PlayUrl(Linker.gameLanguage == "vi" ? NewAudioManager.SOUND.VI.LOSE : NewAudioManager.SOUND.EN.LOSE);
        } else NewAudioManager.PlayUrl(Linker.gameLanguage == "vi" ? NewAudioManager.SOUND.VI.WIN : NewAudioManager.SOUND.EN.WIN);

        if (sliderViewController) {
            sliderViewController.runEndGameCommonPopup1vs4(time, data, type, function (err, data) {
                if (!err) {
                    if (cb) {
                        cb(null, true);
                    }
                } else {
                    if (cb) {
                        cb(true, null);
                    }
                }
            }.bind(this))
        }
    },
    runEndViewGamePoup1vs4: function (time, data, type, cb) {
        var sliderViewController = this.panelSlideView.getComponent("SliderView");
        this.panelSlideView.active = true;
        if (sliderViewController) {
            sliderViewController.runEndGameCommonPopup1vs4(time, data, type, function (err, data) {
                if (!err) {
                    if (cb) {
                        cb(null, true);
                    }
                } else {
                    if (cb) {
                        cb(true, null);
                    }
                }
            }.bind(this))
        }
    },
    runComboPopup: function (time, data, cb) {
        var sliderViewController = this.panelSlideView.getComponent("SliderView");
        this.panelSlideView.active = true;
        if (sliderViewController) {
            sliderViewController.runComboPopup(time, data, function (err, data) {
                if (!err) {
                    if (cb) {
                        cb(null, true);
                    }
                } else {
                    if (cb) {
                        cb(true, null);
                    }
                }
            }.bind(this))
        }
    },

    runBeginMatchAnimation: function (data, cb) {
        var dataBall = Utils.Malicious.shuffle([9, 15, 5, 8, 1, 3, 14, 11, 2, 13, 12, 7, 4, 6, 10]);
        this.taoBiMacDinhKhiVaoBan(dataBall);
        NewAudioManager.PlayUrl(Linker.gameLanguage == "vi" ? NewAudioManager.SOUND.VI.START_GAME : NewAudioManager.SOUND.EN.START_GAME);
        var sliderViewController = this.panelSlideView.getComponent("SliderView");
        this.panelSlideView.active = true;
        if (sliderViewController) {
            data._billardsGameTable = this;
            sliderViewController.runPoupStartGame(data, function (err, data) {
                if (!err) {
                    if (cb) {
                        cb(null, true);
                    }
                } else {
                    if (cb) {
                        cb(true, null);
                    }
                }
            }.bind(this))
        }
    },
    clearForcePercent: function () {
        var sliderViewController = this.panelSlideView.getComponent("SliderView");
        this.panelSlideView.active = true;
        if (sliderViewController) {
            sliderViewController.clearForcePercent();
        }
    },
    runForcePercent: function (data, cb) {
        var sliderViewController = this.panelSlideView.getComponent("SliderView");
        this.panelSlideView.active = true;
        if (sliderViewController) {
            sliderViewController.runForcePercent(data, function (err, data) {
                if (!err) {
                    if (cb) {
                        cb(null, true);
                    }
                } else {
                    if (cb) {
                        cb(true, null);
                    }
                }
            }.bind(this))
        }

    },
    runTurnAnimation: function (type, cb) {
        var sliderViewController = this.panelSlideView.getComponent("SliderView");
        if (sliderViewController) {
            sliderViewController.runPopupTurn(type, function (err, data) {
                if (!err) {
                    if (cb) {
                        cb(null, true);
                    }
                } else {
                    cb(true, null);
                }

            }.bind(this))
        }
    },
    runAnimationChiaBai: function (data, cb) {
        var sliderViewController = this.panelSlideView.getComponent("SliderView");
        if (sliderViewController) {
            sliderViewController.runAnimationChiaBai(data, function (err, chiaBaiNode) {
                if (!err) {
                    if (cb) {
                        cb(null, chiaBaiNode);
                    }
                } else {
                    cb(true, null);
                }
            }.bind(this))
        }
    },
    showBallListDisplay: function (listBall, type, ispoup, isfinal) {
        var target;
        if (type == BiDaConstant.PSEUDO_CONST.KIEU_BI_CUA_MINH) {
            target = this.myBallistDisplay;
        } else if (type == BiDaConstant.PSEUDO_CONST.KIEU_BI_CUA_DOI_THU) {
            target = this.otherBallistDisplay;
        }
        if (type && target && target.isValid) {
            if (listBall) {
                if (this._isShowPopupYourBallList == false) {
                    if (isfinal) {
                        this._isShowPopupYourBallList = true;
                    }
                    var sliderViewController = this.panelSlideView.getComponent("SliderView");
                    if (sliderViewController) {
                        //Fix color tag ở offline
                        if (Linker.BiDaOfflineController) {
                            if (JSON.stringify(Linker.BiDaOfflineController.tableInfo.listPlayer[0].player_list_ball_tren_tay) === JSON.stringify(listBall)) {
                                this.setColorTagByIdID(BiDaConstant.COLOR_TAG.ME, listBall);
                            } else if (JSON.stringify(Linker.BiDaOfflineController.tableInfo.listPlayer[1].player_list_ball_tren_tay) === JSON.stringify(listBall)) {
                                if (this.myUserId === Linker.BiDaOfflineController.tableInfo.listPlayer[0].userId) {
                                    this.setColorTagByIdID(BiDaConstant.COLOR_TAG.ME, Linker.BiDaOfflineController.tableInfo.listPlayer[0].player_list_ball_tren_tay);
                                } else {
                                    this.setColorTagByIdID(BiDaConstant.COLOR_TAG.ME, Linker.BiDaOfflineController.tableInfo.listPlayer[1].player_list_ball_tren_tay);
                                }
                            }
                        } else {
                            this.setColorTagByIdID(BiDaConstant.COLOR_TAG.ME, listBall);
                        }
                        if (ispoup) {
                            if (listBall.some(item => {
                                    return item < 8 ? true : false
                                })) {
                                NewAudioManager.PlayUrl(Linker.gameLanguage == "vi" ? NewAudioManager.SOUND.VI.SOLID_BALL : NewAudioManager.SOUND.EN.SOLID_BALL);
                            } else if (listBall.some(item => {
                                    return item > 8 ? true : false
                                })) {
                                NewAudioManager.PlayUrl(Linker.gameLanguage == "vi" ? NewAudioManager.SOUND.VI.STRIPE_BALL : NewAudioManager.SOUND.EN.STRIPE_BALL);
                            }
                            sliderViewController.runPopupBiCanAn(listBall, function (err, data) {
                                this.panelSlideView.active = false;
                                if (!err) {
                                    this.showAllMyBallistDisplay(listBall, target);
                                } else {
                                    this.showAllMyBallistDisplay(listBall, target);
                                }
                            }.bind(this))
                        } else {
                            this.showAllMyBallistDisplay(listBall, target);
                        }
                    } else {
                        this.showAllMyBallistDisplay(listBall, target);
                    }
                } else {
                    this.showAllMyBallistDisplay(listBall, target);
                }
            }
        }
        if (listBall.length == 7) {
            if (type == BiDaConstant.PSEUDO_CONST.KIEU_BI_CUA_MINH) {
                if (Utils.Malicious.isAllElementArrSame(-1, listBall)) {
                    //chi con 1 vien bi so 8
                    var ball = this.getBallById(8);
                    if (ball) {
                        var biJs = ball.getComponent("Ball");
                        if (biJs) {
                            biJs.setColorTag(BiDaConstant.COLOR_TAG.ME);
                        }
                    }
                    listBall[0] = 8;
                }
            } else {
                if (Utils.Malicious.isAllElementArrSame(-1, listBall)) {
                    listBall[0] = 8;
                }
            }
            if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
                this.showAllMyBallistDisplay(listBall, target);
            }

        } else if (listBall.length == 8 && listBall[listBall.length - 1] == 8) {
            listBall[0] = 8;
            listBall.splice(listBall.length - 1, 1);
            if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
                this.showAllMyBallistDisplay(listBall, target);
            }
        }
    },
    getFinalBall: function () {
        if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_LUCKY_SHOT) {
            return true;
        } else {
            var _is8BallInList = false;
            for (let i = 0; i < this.myBallistDisplay.children.length; i++) {
                var child = this.myBallistDisplay.children[i]
                var sprite = child.getComponent(cc.Sprite);
                if (sprite) {
                    if (sprite.name == "ball_8") {
                        _is8BallInList = true;
                        break;
                    }
                }
            }
            if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
                return _is8BallInList;
            } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1 || Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
                if (Number(this.getPlayerIdLuotDanh()) == Number(Linker.userData.userId)) {
                    return _is8BallInList;
                }
            }
            return false;
        }
    },
    getBallById: function (id) {
        for (let i = 0; i < this.bidaDeskNode.children.length; i++) {
            var ball = this.bidaDeskNode.children[i];
            var ballcpn = ball.getComponent("Ball");
            if (ballcpn) {
                var idBi = Number(ballcpn.getIdBi());
                if (Number(idBi) == Number(id)) {
                    return ball;
                }
            }
        }
        return null;
    },
    setColorBallTag: function (message) {
        if (message) {
            if (message._isNormalNextTurn) {
                var players = message.players;
                if (players) {
                    for (var i = 0; i < players.length; i++) {
                        var id = (players[i].id) ? Number(players[i].id) : (players[i].userId) ? Number(players[i].userId) : 0;
                        if (id == this.myUserId) {
                            this.myUserInfo.getComponent("BillardUserView").player_list_ball_tren_tay = players[i].player_list_ball_tren_tay;
                            this.myListBallOnHand = this.myUserInfo.getComponent("BillardUserView").player_list_ball_tren_tay;
                            if (this.myListBallOnHand && Array.isArray(this.myListBallOnHand) && this.myListBallOnHand.length == 0) {
                                // this.myListBallOnHand = [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15];
                                var listBallDefault = Utils.Malicious.createDefaultMyBallArr();
                                this.myUserInfo.getComponent("BillardUserView").player_list_ball_tren_tay = listBallDefault;
                                this.myListBallOnHand = listBallDefault;
                            }
                            this.setColorBallTagInDesk();
                            break;
                        }
                    }
                }
            } else {
                this.myListBallOnHand = (Linker.BiDaOfflineController) ? this.getMyListBallOnHandOffline() : this.myUserInfo.getComponent("BillardUserView").player_list_ball_tren_tay;
                this.setColorBallTagInDesk();
            }
        }
    },
    getMyListBallOnHandOffline: function () {
        if (Linker.BiDaOfflineController.tableInfo && Linker.BiDaOfflineController.tableInfo.listPlayer) {
            var players = Linker.BiDaOfflineController.tableInfo.listPlayer;
            for (let i = 0; i < players.length; i++) {
                if (Number(this.getPlayerIdLuotDanh()) == Number(players[i].userId)) {
                    var listBallOnHand = players[i].player_list_ball_tren_tay;
                    if (listBallOnHand.length == 0) {
                        // listBallOnHand = [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15];
                        listBallOnHand = Utils.Malicious.createDefaultMyBallArr();
                    }
                    return listBallOnHand;
                }
            }
        }
        return [];
    },
    setColorBallTagInDesk: function () {
        for (var j = 0; j < this.bidaDeskNode.children.length; j++) {
            var ball = this.bidaDeskNode.children[j];
            var ballcpn = ball.getComponent("Ball");
            if (ballcpn) {
                var idBi = Number(ballcpn.getIdBi());
                idBi = parseInt(idBi);
                if (!isNaN(idBi) && this.myListBallOnHand && Array.isArray(this.myListBallOnHand) && this.myListBallOnHand.includes(idBi)) {
                    ballcpn.setColorTag(BiDaConstant.COLOR_TAG.ME);
                } else {
                    ballcpn.setColorTag(BiDaConstant.COLOR_TAG.OPPONENT);
                }
            }
        }
    },
    setColorTagByIdID: function (colorTag, listMyBall) {
        for (let i = 0; i < this.bidaDeskNode.children.length; i++) {
            var ball = this.bidaDeskNode.children[i];
            var ballcpn = ball.getComponent("Ball");
            if (ballcpn) {
                ballcpn.setColorTag(BiDaConstant.COLOR_TAG.OPPONENT);
            }
        }
        if (listMyBall.length == 7) {
            if (Utils.Malicious.isAllElementArrSame(-1, listMyBall) && !Linker.BiDaOfflineController) {
                var ball = this.getBallById(8);
                if (ball) {
                    var biJs = ball.getComponent("Ball");
                    if (biJs) {
                        biJs.setColorTag(colorTag);
                    }
                }
                listMyBall[0] = 8;
                this.showAllMyBallistDisplay(listMyBall, this.myBallistDisplay);
            } else {
                for (let j = 0; j < listMyBall.length; j++) {
                    if (listMyBall[j] > 0) {
                        var ball = this.getBallById(listMyBall[j]);
                        if (ball) {
                            var biJs = ball.getComponent("Ball");
                            if (biJs) {
                                biJs.setColorTag(colorTag);
                            }
                        }
                    }
                }
            }
        } else if (listMyBall.length == 8 && listMyBall[listMyBall.length - 1] == 8) {
            listMyBall[0] = 8;
            listMyBall.splice(listMyBall.length - 1, 1);
            this.showAllMyBallistDisplay(listMyBall, this.myBallistDisplay);
        } else if (listMyBall.length > 8 || listMyBall.length < 7) {
            for (let i = 0; i < this.bidaDeskNode.children.length; i++) {
                var ball = this.bidaDeskNode.children[i];
                var ballcpn = ball.getComponent("Ball");
                if (ballcpn) {
                    ballcpn.setColorTag(BiDaConstant.COLOR_TAG.ME);
                }
            }
        }
    },

    hideTimeCountDownBallError: function () {
        var SliderView = this.panelSlideView.getComponent("SliderView");
        if (SliderView) {
            SliderView.showErrorBallIdWithTime("");
            SliderView.hideAllPopup();
        }
    },
    hidePopupEndGame: function () {
        var SliderView = this.panelSlideView.getComponent("SliderView");
        if (SliderView) {
            SliderView.endGame.active = false;
        }
    },
    showAllMyBallistDisplay: function (listBall, target) {
        var sprite;
        var spriteFrame;
        var child;
        if (target == this.otherBallistDisplay) {
            listBall = listBall.reverse();
        }
        if (target) {
            for (let i = 0; i < target.children.length; i++) {
                child = target.children[i];
                sprite = child.getComponent(cc.Sprite);
                if (sprite && listBall[i] >= 0) {
                    sprite.name = "ball_" + listBall[i];
                    spriteFrame = this.billardListMyBallAtlas.getSpriteFrame("ball_" + listBall[i]);
                    if (spriteFrame) {
                        sprite.spriteFrame = spriteFrame;
                        child.opacity = 255;
                    } else {
                        child.opacity = 0;
                    }
                } else {
                    child.opacity = 0;
                }
            }
        }
    },
    getWhiteBall: function () {
        if (this && this.isValid && this.whiteBall && this.whiteBall.isValid) {
            return this.whiteBall;
        }
        return null;
    },
    changeSpriteCue(cueId) {
        if (this.cue && cc.isValid(this.cue)) {
            this.cueJs = this.cue.getComponent("CueObj");
            if (this.cueJs) {
                this.cueJs.setSpriteCue(cueId);
            }
        }
    },
    getChildOnTableWithName: function (name) {
        var childs = [];
        for (let i = 0; i < this.bidaDeskNode.children.length; i++) {
            var c = this.bidaDeskNode.children[i];
            if (c.name == name) {
                childs.push(c);
            }
        }
        return childs;
    },
    taoCueTrenBanChoi: function () {
        var BillardsGameTableController = this.getBillardController();
        if (BillardsGameTableController.gameState == BiDaConstant.GAME_STATE.PLAYING || Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_LUCKY_SHOT) {
            var childs = this.getChildOnTableWithName("CueObj");
            if (childs.length > 1) {
                Utils.Malicious.destroyAllChildrenWithoutName(this.bidaDeskNode, "CueObj");
                this.cue = cc.instantiate(this.cueObjPrefab);
                this.bidaDeskNode.addChild(this.cue);
            } else if (childs.length == 1) {
                var cue = childs[0];
                if (cue && cc.isValid(cue)) {
                    this.cue = cue;
                } else {
                    cue.removeFromParent(true);
                    cue.destroy();
                    this.cue = cc.instantiate(this.cueObjPrefab);
                    this.bidaDeskNode.addChild(this.cue);
                }
            } else if (childs.length == 0) {
                this.cue = cc.instantiate(this.cueObjPrefab);
                this.bidaDeskNode.addChild(this.cue);
            }
            this.cue.zIndex = Utils.Malicious.getMaxZindex(this.bidaDeskNode) - 1;
            this.cueJs = this.cue.getComponent("CueObj");
            if (this.cueJs) {
                this.cueJs.setSpriteCue();
                this.cueJs.setControllerBillardGame1vs4(this.node);
                this.cue.zIndex = BiDaConstant.ZINDEX.cueZOrder;
                var whiteBall = this.getWhiteBall();
                if (whiteBall) {

                    this.cue.position = whiteBall.position;
                } else {
                    this.cue.position = cc.v2(99999, 99999);
                }
            } else {
                this.cue = null;
            }
        }
    },
    taoBideBatdauTranDau: function (ballPos) {
        var dataTatCaBiTrenBan = this.createBallData(ballPos);
        var dataBiDatXuLyXong = this.sortAllBiInDesk(dataTatCaBiTrenBan);
        Utils.Malicious.destroyAllChildrenWithoutName(this.bidaDeskNode, "CueObj");
        if (dataBiDatXuLyXong && dataBiDatXuLyXong.length == 16) {
            this.addAllBiIntoDesk(dataBiDatXuLyXong);
        } else {
            //cc.log("Khong the khoi tao ban choi, loi client sap xep bi ...");
        }
    },
    taoBiMacDinhKhiVaoBan: function (ballPos) {
        var dataTatCaBiTrenBan = this.createBallData(ballPos);
        var dataBiDatXuLyXong = this.sortAllBiInDesk(dataTatCaBiTrenBan);
        Utils.Malicious.destroyAllChildrenWithoutName(this.bidaDeskNode, "CueObj");
        if (dataBiDatXuLyXong && dataBiDatXuLyXong.length == 16) {
            this.thanhNgang = null;
            //table rigidbody
            //dau tien khoi tao cac bi ngoai bi trang;
            for (var i = 0; i < dataBiDatXuLyXong.length; i++) {
                var biObj = cc.instantiate(this.BallInHolePrefab);
                this.bidaDeskNode.addChild(biObj);
                var biScript = biObj.getComponent("BallInHole");
                if (biScript) {
                    biScript.init(dataBiDatXuLyXong[i]);
                } else {
                    biObj.removeFromParent(true);
                    //cc.log("BD: can't add balls object javascript ... ");
                }
            }

        } else {
            //cc.log("Khong the khoi tao ban choi, loi client sap xep bi ...");
        }
    },
    createShuffleArray: function (from, to) {
        let _arr = [];
        for (let i = from; i <= to; i++) {
            _arr.push(i);
        }
        return _arr;
    },
    shuffleArray: function (arr) {
        var j;
        var x;
        var i;
        for (i = arr.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = arr[i];
            arr[i] = arr[j];
            arr[j] = x;
        }
        return arr;
    },
    sortAllBiInDesk: function (billards) {
        //sap xep bi trang
        billards[0].pos = this.vitriBiTrang;
        //sap xep cac bi con lai theo hinh tam giac va theo quy tac sap xep chung
        var tatCaBiAn = this.sortOtherBall(0, this.vitriBiSo1, billards);
        if (tatCaBiAn.length == 15) {
            tatCaBiAn.push(billards[0]);
            return tatCaBiAn;
        } else {
            return false;
        }
    },
    sortOtherBall: function (ruleid, vitribiso1, data) {
        var tmpData = data.slice(1, data.length);
        var splicedTmpData = [];
        var tatCaBiAn = [];
        var offsetH = 1.01;
        var offsetV = 0.5;

        switch (ruleid) {
            case 0:
                for (var i = 0; i < 5; i++) {
                    splicedTmpData.push(tmpData.splice(0, i + 1));
                };
                for (var k = 0; k < splicedTmpData.length; k++) {
                    for (var l = 0; l < splicedTmpData[k].length; l++) {
                        var x = (vitribiso1.x) + (k * this.kichThuocVienBi * offsetH);
                        var y = (vitribiso1.y - (k * this.kichThuocVienBi * offsetV)) + (l * this.kichThuocVienBi * 1.01);
                        splicedTmpData[k][l].pos = cc.v2(x, y);
                        tatCaBiAn.push(splicedTmpData[k][l]);
                    }
                }
                break;

            default:
                break;
        }

        return tatCaBiAn;
    },
    addAllBiIntoDesk: function (billards) {
        Utils.Malicious.destroyAllChildrenWithoutName(this.bidaDeskNode, "CueObj");
        this.thanhNgang = null;
        //table rigidbody
        //dau tien khoi tao cac bi ngoai bi trang;
        for (var i = 0; i < billards.length - 1; i++) {
            var biObj = cc.instantiate(this.bidaBallPrefab);
            this.bidaDeskNode.addChild(biObj);
            var biScript = biObj.getComponent("Ball");
            if (biScript) {
                biScript.initBall(billards[i]);
            } else {
                // biObj.removeFromParent(true);
                //cc.log("BD: can't add balls object javascript ... ");
            }
        }
        //tiep theo khoi tao bi trang
        this.createWhiteBallWithData(billards[billards.length - 1]);
    },
    addOneBiWithData: function (data) {
        var biObj = cc.instantiate(this.bidaBallPrefab);
        var biScript = biObj.getComponent("Ball");

        if (biScript && data) {
            this.bidaDeskNode.addChild(biObj);
            var mdata = {
                pos: data.pos,
                id: data.id,
                isReposition: (data.id == 0 || data.id == "0") ? true : false
            }
            if (data.ball3dAngle) {
                mdata.ball3dAngle = data.ball3dAngle;
            }
            var ball = biScript.initBall(mdata);
            if (data.id == 0 || data.id == "0") {
                if (this.whiteBall && this.whiteBall.isValid) {
                    this.whiteBall.removeFromParent(true);
                    this.whiteBall = null;
                }
                this.whiteBall = ball;
                //this.addThanhNgang();
                this.removeChildByNameInTable("WhiteBack");
            }
            this.resetUICue();

        } else {
            biObj.removeFromParent(true);
            //cc.log("BD: can't add balls object javascript ... ");
        }
    },
    showDrawrouteWhiteBallAdded: function (isNotRandom) {
        var whiteBall = this.getBallById(0);
        if (whiteBall && cc.isValid(whiteBall)) {
            var _tmpRotation = isNotRandom ? 0 : Utils.Malicious.randomMinMax(0, 360, false);
            this.cue.angle = -_tmpRotation;
            this.cue.position = whiteBall.position;
            var deskNode = this.cue.parent;
            var p = deskNode.convertToWorldSpaceAR(this.cue.position);
            var wlocation = Utils.Malicious.getApointWhenKnowAngleAndRadius(p, this.cue.angle, deskNode.width * 2);
            this.setCuePosByTouch(wlocation, false, true, false);
        }
    },
    addThanhNgang: function () {
        if (!this.thanhNgang || !this.thanhNgang.isValid) {
            if (!this.itemThanhNgang) {
                var self = this;
                cc.resources.load("bida/prefabs/items/itemThanhNgang", cc.Prefab, function (err, prefab) {
                    if (err) {
                        cc.Global.showMessage(err);
                    } else {
                        self.thanhNgang = cc.instantiate(prefab);
                        self.bidaDeskNode.addChild(self.thanhNgang);
                        self.thanhNgang.active = true;
                        self.thanhNgang.x = self.whiteBall.x;
                        self.thanhNgang.y = 0;
                        self.thanhNgang.z = 0;
                    }
                })
            } else {
                this.thanhNgang = cc.instantiate(this.itemThanhNgang);
                this.bidaDeskNode.addChild(this.thanhNgang);
                this.thanhNgang.active = true;
                this.thanhNgang.x = this.whiteBall.x;
                this.thanhNgang.y = 0;
                this.thanhNgang.z = 0;
            }
        } else {
            this.thanhNgang.active = true;
        }
    },
    createWhiteBallWithData: function (data) {
        if (data) {
            this.whiteBall = cc.instantiate(this.bidaBallPrefab);
            var biScript = this.whiteBall.getComponent("Ball");
            if (biScript) {
                this.bidaDeskNode.addChild(this.whiteBall);
                biScript.initBall(data);
                this.addThanhNgang();
            } else {
                this.whiteBall = null;
                //cc.log("BD: can't add white balls object javascript ... ");
            }
        } else {
            //cc.log("Loi khong the khoi tao bi trang, game loi ...");
        }
    },
    activePhysicWorld: function (isActive) {
        var customEvent = new cc.Event.EventCustom(BiDaConstant.GAME_COMMONS_EVENT.YEU_CAU_KHOI_TAO_WORLD_VAT_LY, true);
        customEvent.isActive = isActive;
        this.node.dispatchEvent(customEvent);
    },
    initDeskTable: function () {
        this.activePhysicWorld(true);
        var Desk;
        var DeskComponentScript;
        var isNewDesk = false;

        // if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4 || Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1 || Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
        //     Utils.Malicious.removeNodeByNameFromParent("DeskLuckyShot", this.node);
        //     Desk = this.node.getChildByName("DeskNormalPlay");
        //     if (!Desk || Desk && !cc.isValid(Desk)) {
        //         Utils.Malicious.removeNodeByNameFromParent("DeskNormalPlay", this.node);
        //         Desk = cc.instantiate(this.DeskNormalPlayPrefab);
        //         isNewDesk = true;
        //     } else {
        //         // cc.error("Skipped...");
        //     }
        // } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_LUCKY_SHOT) {
        Utils.Malicious.removeNodeByNameFromParent("DeskNormalPlay", this.node);
        Desk = this.node.getChildByName("DeskLuckyShot");
        if (!Desk || Desk && !cc.isValid(Desk)) {
            Utils.Malicious.removeNodeByNameFromParent("DeskLuckyShot", this.node);
            Desk = cc.instantiate(this.DeskLuckyShotPlayPrefab);
            isNewDesk = true;
        } else {
            // cc.error("Skipped...");
        }
        // }
        DeskComponentScript = Desk.getComponent("Desk");
        if (Desk && DeskComponentScript) {
            if (isNewDesk) {
                this.node.addChild(Desk);
            }
            this.bidaTableBackground = DeskComponentScript.getBidaTableBackgroundNode();
            this.bidaDeskNode = DeskComponentScript.getBidaDeskNode();
            this.bidaDeskContainer = DeskComponentScript.getBidaDeskContainerNode();
            this.railChuaBi = DeskComponentScript.getRailChuaBi();
            this.taoCueTrenBanChoi();
            DeskComponentScript.setBillardGameTable(this);
            this.node.sortAllChildren();
            this.initZindex();
            var bgCommon = this.node.getChildByName('Bg');
            if (bgCommon) {
                Desk.zIndex = (bgCommon.zIndex + 5);
                this.node.sortAllChildren();
            }

        }
    },
    initZindex: function () {
        var gap = 20;
        var start = 0;
        for (let i = 0; i < this.node.children.length; i++) {
            var node = this.node.children[i];
            node.zIndex = start;
            start += gap;
        }
    },
    setTableSprite: function () {
        var index = DataManger.UserData.getCurrentTable();
        var spriteFrame = cc.Global.tableArray[index];
        if (spriteFrame) {
            this.bidaTableBackground.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        }
    },
    initView: function () {
        this.initDeskTable();
        this.setTableSprite();
        this.panelFineturning.active = false;
        this.panelPower.active = false;
        this.panelSlideView.active = true;
        this.panelSlideView.position = cc.v2(-3000, 0);
        this.panelWhiteBall.active = false;
        this.panelSetting.active = true;
        this.getRailingBagComponent().removeAllBiInBag();
        Utils.Malicious.destroyAllChildrenWithoutName(this.bidaDeskNode, "CueObj");

        var luckyShotGame = this.panelSetting.getChildByName("luckyShotGame");
        var normalGame = this.panelSetting.getChildByName("normalGame");

        if (this.panelUsers) {
            this.panelUsers.active = false;
        }
        if (luckyShotGame) {
            luckyShotGame.active = true;
        }
        if (normalGame) {
            normalGame.active = false;
        }
        //them lucky shot target
        var _desk = this.getDeskAsLinker();
        if (_desk) {
            var _deskScript = _desk.getComponent("Desk");
            if (_deskScript) {
                var _this = this;
                _deskScript.addPanelUserHeader(function (err, panelUserLucky) {
                    if (!err) {
                        _this.panelUserContainer.removeAllChildren(true);
                        _this.panelUserContainer.destroyAllChildren();
                        _this.panelUsers = cc.instantiate(panelUserLucky);
                        _this.panelUserContainer.addChild(_this.panelUsers);
                        //
                        var _panelUsersCript = _this.panelUsers.getComponent("PanelUsersLuckyShot");
                        if (_panelUsersCript) {
                            _this.redPointNode = _panelUsersCript.getRedPointNode();
                            _this.billardPointTo = _panelUsersCript.getBillardPointTo();
                        }

                        //
                        _this.taoLuckyShotVanMoi();
                    }
                })

            }
        }
    },
    set2BallTargetVaChamLuckyShot: function() {
        this.is2BallHitLuckyShot = true;
    },
    createArrayStorage: function () {
        var data = {
            ball_1: {
                bet100: {
                    WBallPos: null,
                    TargetBallPos: null,
                    LuckyTargetPos: null,
                    isCreatedMatch: false
                },
                bet1k: {
                    WBallPos: null,
                    TargetBallPos: null,
                    LuckyTargetPos: null,
                    isCreatedMatch: false
                },
                bet10k: {
                    WBallPos: null,
                    TargetBallPos: null,
                    LuckyTargetPos: null,
                    isCreatedMatch: false
                },
                free: {
                    WBallPos: null,
                    TargetBallPos: null,
                    LuckyTargetPos: null,
                    isCreatedMatch: false
                }
            },
            ball_2: {
                bet100: {
                    WBallPos: null,
                    OtherBallPos: null,
                    TargetBallPos: null,
                    LuckyTargetPos: null,
                    isCreatedMatch: false
                },
                bet1k: {
                    WBallPos: null,
                    OtherBallPos: null,
                    TargetBallPos: null,
                    LuckyTargetPos: null,
                    isCreatedMatch: false
                },
                bet10k: {
                    WBallPos: null,
                    OtherBallPos: null,
                    TargetBallPos: null,
                    LuckyTargetPos: null,
                    isCreatedMatch: false
                },
                free: {
                    WBallPos: null,
                    OtherBallPos: null,
                    TargetBallPos: null,
                    LuckyTargetPos: null,
                    isCreatedMatch: false
                }
            },
        }
        return data;
    },
    taoLuckyShotVanMoi: function () {
        this.is2BallHitLuckyShot = false;
        this.setColorPower(1);
        var _desk = this.getDeskAsLinker();
        if (_desk) {
            var _deskScript = _desk.getComponent("Desk");
            if (_deskScript) {
                // set storage van choi
                var data = cc.Global.GetSetting("MATCH_LUCKY_SHOT_BIDA", null);
                if (!data) {
                    data = this.createArrayStorage();
                    cc.Global.SetSetting("MATCH_LUCKY_SHOT_BIDA", data);
                } else if (!data.ball_1 || !data.ball_2) {
                    data = this.createArrayStorage();
                    cc.Global.SetSetting("MATCH_LUCKY_SHOT_BIDA", data);
                }
                //end
                if (Linker.LuckyShotGame && Linker.LuckyShotGame.isValid) {
                    Linker.LuckyShotGame.showWinEffect(false);
                    Linker.LuckyShotGame.blockBtnBet(false);
                    Linker.LuckyShotGame.BillardsGameTable = this;
                }
                var that = this;
                Utils.Malicious.destroyAllChildrenWithoutName(_deskScript.bidaDeskNode, "CueObj");
                _deskScript.addLuckShotTarget(function (err, luckytarget) {
                    if (!err) {
                        // cc.log("Da tao xong lucky shot target", luckytarget);
                        // cc.log("Tiep tuc tao them 2 bi data 0, va random 1 - 15");
                        var targetBall = Utils.Malicious.randomMinMax(1, 15, true);
                        targetBall = (targetBall == 8) ? 1 : targetBall; // chánh trường hợp trùng bi 8;
                        var _listBallOnHand = [];
                        if (cc.Global.PLAY_TYPE == Constant.PLAY_TYPE.BALL_2) {
                            _listBallOnHand.push(targetBall, 8);
                        } else {
                            _listBallOnHand.push(targetBall);
                        }
                        
                        var luckytargetComponent = luckytarget.getComponent("LuckyshotTarget");
                        if (luckytargetComponent && _listBallOnHand && Array.isArray(_listBallOnHand) && _listBallOnHand.length > 0) {
                            luckytargetComponent.setIDBallTarget(_listBallOnHand[0]);
                            luckytargetComponent.isCheckedNoHu = false;
                        }
                        var _dataPos = [];
                        for (var k = 0; k < _listBallOnHand.length; k++) {
                            // [{num: 4, x: "43", y: "159", z: "81"}]
                            _dataPos.push({
                                num: _listBallOnHand[k],
                                x: Utils.Number.random(0, 180),
                                y: Utils.Number.random(0, 180),
                                z: Utils.Number.random(0, 180)
                            })
                        }
                        var _dataBiMucTieu = that.createBallData(JSON.stringify(_dataPos));
                        that.taoDataVitriBiMucTieu(_dataBiMucTieu, luckytarget); //bao gom ca bi trang
                        that.whiteBall = that.getBallById(0);
                        that.taoCueTrenBanChoi();
                        Linker._sceneTag = BiDaConstant.TAG.scenes.GAME;
                        that.addTouchEventListener();
                        that.addCustomEventDispatch();
                        that.setCueRotateCueListener();

                        that.panelPower.active = true;
                        that.cue.active = true;
                        that.showCueUI();
                        that.cue.getChildByName("drawLine").opacity = 0;
                        that._isGameStarted = true;
                        // that.myUserId = Number(Linker.userData.userId);
                        that._isShoted = false;
                        that._isDataEndTurnGame = false;
                        that.myListBallOnHand = _listBallOnHand;
                        that.getRailingBagComponent().removeAllBiInBag();
                        //phai check dieu kien xem co duoc ban hay khong
                        that.setPlayerIdLuotDanh(Number(that.myUserInfo));
                        that.unBlockTouchEvent();

                        //set storage created match
                        that.setStorageCreated(true);
                    }
                })
            }
        }

    },
    genRandomPositionLuckyShot: function (ball, luckytarget, isWhiteBall) {
        if (ball && luckytarget) {
            var ballCircleCollider = ball.getComponent(cc.CircleCollider);
            var luckTargetCircleCollider = luckytarget.getComponent(cc.CircleCollider);
            if (ballCircleCollider && luckTargetCircleCollider) {
                var pos = cc.v2(0, 0);
                //dieu kien thu 3, vi tri bi phai nam trong ban choi
                //dieu kien thu 2, vi tri bi phai nam ngoai lucky target
                //dieu kien thu 1, vi tri bi se phai cach xa vi tri cua lucky target mot khoang co dinh
                var ballCircle = {
                    radius: ballCircleCollider.radius,
                    position: ballCircleCollider.node.position
                };
                var luckTargetCircle = {
                    radius: luckTargetCircleCollider.radius,
                    position: luckTargetCircleCollider.node.position
                };
                var _this = this;
                var limit_X = this.bidaDeskNode.width * 0.5 - luckTargetCircle.radius;
                var limit_Y = this.bidaDeskNode.height * 0.5 - luckTargetCircle.radius;

                var countCheck = 0;
                var checkColision = function (_ballCircle, _luckTargetCircle, _isWhiteBall) {
                    if (cc.Intersection.circleCircle(_ballCircle, _luckTargetCircle)) { //dieu kien 1 khong nam trong target shot
                        //dieu kien 2 khoang cach la ok
                        return false;
                    }
                    if (!_isWhiteBall) {
                        if (_this.isKCMucTieuValid(limit_X, limit_Y, _ballCircle, _luckTargetCircle) == false) {
                            return false;
                        }
                        countCheck++;
                        if (countCheck > 20) {
                            return true;
                        }
                        if (!_this.checkDistanceBallHole(_ballCircle.position)) {
                            return false;
                        }
                    }

                    return true;

                };

                while (!checkColision(ballCircle, luckTargetCircle, isWhiteBall)) {
                    var pos = this.getPositionRandomBall(luckytarget);
                    if (pos) {
                        ballCircle.position = pos;
                    }
                }
                return ballCircle.position;
            }

        }
        return null;
    },
    isKCMucTieuValid: function (limit_X, limit_Y, biMucTieu, vongTronTinhDiem) {
        //khoang cach x phai lon hon hoac bang chieu dai ban / 2 - ban kinh vong tron tinh diem
        //khoang cach y phai lon hon hoac bang chieu rong ban /2 - ban kinh vong tron tinh diem
        var kc_X = Math.abs(biMucTieu.position.x - vongTronTinhDiem.position.x);
        var kc_Y = Math.abs(biMucTieu.position.y - vongTronTinhDiem.position.y);
        if (kc_X > limit_X && kc_Y > limit_Y) {
            return true;
        }
        return false
    },
    getPositionRandomBall: function (luckytarget) {
        var tatCaViTriBiHienTai = this.getTatCaViTriBiHienTai();
        if (tatCaViTriBiHienTai) {
            var minX = (this.kichThuocVienBi * 0.5) + (145 / 2.5);
            var maxX = (this.bidaDeskNode.width - (this.kichThuocVienBi * 0.5) - (145 / 2.5));
            var minY = (this.kichThuocVienBi * 0.5) + (145 / 2.5);
            var maxY = (this.bidaDeskNode.height - (this.kichThuocVienBi * 0.5) - (145 / 2.5));
            var position = this.findRandomPositionForWBall({
                xmin: minX,
                xmax: maxX,
                ymin: minY,
                ymax: maxY,
                positions: tatCaViTriBiHienTai
            });
            return position;
        }
        return null;
    },
    checkDistanceBallHole: function (position) {
        var sixHoleInTable = this.bidaDeskNode.getComponents(cc.PhysicsCircleCollider);
        for (var i = 0; i < sixHoleInTable.length; i++) {
            var posHole = sixHoleInTable[i].offset;
            var distance = Utils.Malicious.distance2Vector(posHole.x, posHole.y, position.x, position.y);
            if (Number(distance) < 120) {
                return false;
            }
        }
        return true;
    },
    taoDataVitriBiMucTieu: function (biMucTieu, luckytarget) { //chi bao gom id[0, 1, ..., 15];
        if (Array.isArray(biMucTieu) && luckytarget && cc.isValid(luckytarget)) {
            for (let i = 0; i < biMucTieu.length; i++) {
                var biObj = cc.instantiate(this.bidaBallPrefab);
                var _circleBoxComponent = biObj.getComponent(cc.CircleCollider);
                if (!_circleBoxComponent) {
                    _circleBoxComponent = biObj.addComponent(cc.CircleCollider);
                }
                _circleBoxComponent.radius = 8; //ban kinh collider box
                this.bidaDeskNode.addChild(biObj);
                biObj.opacity = 0;
                var mdata = {
                    pos: luckytarget.position,
                    id: biMucTieu[i].id,
                }
                var biScript = biObj.getComponent("Ball");
                if (biScript) {
                    biScript.initBall(mdata);
                    var idBi = biScript.getIdBi();
                    idBi = parseInt(idBi);
                    if (isNaN(idBi) == false) {
                        var isWhiteBall = (idBi == 0) ? true : false;
                        var isOtherBall = (idBi == 8) ? true : false;
                        var pos = this.genRandomPositionLuckyShot(biObj, luckytarget, isWhiteBall);
                        //check storage
                        var newPos = this.checkStorage(pos, isWhiteBall, isOtherBall);
                        if (newPos) pos = newPos;

                        if (pos) {
                            //xoa bi cu di vi physic khong the set position tuy y duoc
                            biObj.removeFromParent(true);
                            biObj.destroy();
                            //khoi tao lai bi moi voi vi tri da cho
                            biObj = cc.instantiate(this.bidaBallPrefab);
                            _circleBoxComponent = biObj.getComponent(cc.CircleCollider);
                            if (!_circleBoxComponent) {
                                _circleBoxComponent = biObj.addComponent(cc.CircleCollider);
                            }
                            _circleBoxComponent.radius = 8; //ban kinh collider box
                            biScript = biObj.getComponent("Ball");
                            mdata.pos = pos;
                            biScript.initBall(mdata);
                            this.bidaDeskNode.addChild(biObj);
                            if (!isWhiteBall && !isOtherBall) {
                                biScript.runTipFx();
                            }
                        }
                    }
                } else {
                    // biObj.removeFromParent(true);
                    // biObj.destroy();
                }
            }
        }
    },
    checkStorage: function (position, isWhiteBall, isOtherBall) {
        var dataStorage = cc.Global.GetSetting("MATCH_LUCKY_SHOT_BIDA", null);
        var ballData = null;
        if (cc.Global.PLAY_TYPE == Constant.PLAY_TYPE.BALL_2) {
            ballData = dataStorage.ball_2;
        } else {
            ballData = dataStorage.ball_1;
        }
        var data = ballData.free;
        if (!Linker.LuckyShotGame.isTypePlayMoney) {
            data = ballData.free;
        } else {
            switch (Linker.LuckyShotGame.currCuoc) {
                case Linker.LuckyShotGame.arrCuoc[0]:
                    data = ballData.bet100;
                    break;

                case Linker.LuckyShotGame.arrCuoc[1]:
                    data = ballData.bet1k;
                    break;

                case Linker.LuckyShotGame.arrCuoc[2]:
                    data = ballData.bet10k;
                    break;

                default:
                    break;
            }
        }
        if (isWhiteBall) {
            if (!data.isCreatedMatch || data.WBallPos == null) {
                data.WBallPos = position;
                cc.Global.SetSetting("MATCH_LUCKY_SHOT_BIDA", dataStorage);
            } else {
                return data.WBallPos;
            }
        } else if (isOtherBall) {
            if (!data.isCreatedMatch || data.OtherBallPos == null) {
                data.OtherBallPos = position;
                cc.Global.SetSetting("MATCH_LUCKY_SHOT_BIDA", dataStorage);
            } else {
                return data.OtherBallPos;
            }
        } else {
            if (!data.isCreatedMatch || data.TargetBallPos == null) {
                data.TargetBallPos = position;
                cc.Global.SetSetting("MATCH_LUCKY_SHOT_BIDA", dataStorage);
            } else {
                return data.TargetBallPos;
            }
        }
        return null;
    },
    setStorageCreated: function (boolean) {
        //set storage da tao ban
        var dataStorage = cc.Global.GetSetting("MATCH_LUCKY_SHOT_BIDA", null);
        var ballData = null;
        if (cc.Global.PLAY_TYPE == Constant.PLAY_TYPE.BALL_2) {
            ballData = dataStorage.ball_2;
        } else {
            ballData = dataStorage.ball_1;
        }
        var data = ballData.free;
        if (!Linker.LuckyShotGame.isTypePlayMoney) {
            data = ballData.free;
        } else {
            switch (Linker.LuckyShotGame.currCuoc) {
                case Linker.LuckyShotGame.arrCuoc[0]:
                    data = ballData.bet100;
                    break;

                case Linker.LuckyShotGame.arrCuoc[1]:
                    data = ballData.bet1k;
                    break;

                case Linker.LuckyShotGame.arrCuoc[2]:
                    data = ballData.bet10k;
                    break;

                default:
                    break;
            }
        }
        if (boolean) {
            data.isCreatedMatch = true;
        } else {
            data.isCreatedMatch = false;
        }
        cc.Global.SetSetting("MATCH_LUCKY_SHOT_BIDA", dataStorage);
    },
    getDeskAsLinker: function () {
        var _desk = null;
        if (Linker.ZONE != BiDaConstant.ZONE_ID.ZONEID_BIDA_LUCKY_SHOT) {
            _desk = this.node.getChildByName("DeskNormalPlay");
            if (_desk && cc.isValid(_desk)) {
                return _desk;
            }
        } else {
            _desk = this.node.getChildByName("DeskLuckyShot");
            if (_desk && cc.isValid(_desk)) {
                return _desk;
            }

        }
        return null;
    },
    createHeaderUserInfo: function () {
        this.panelUserContainer.removeAllChildren(true);
        var headerUsInfo = {
            BillardsGameTable: this
        }
        if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
            Bida14GameTable.createHeaderUserInfo(headerUsInfo);
        } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
            Bida11GameTable.createHeaderUserInfo(headerUsInfo);
        } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
            BidaPhomGameTable.createHeaderUserInfo(headerUsInfo);
        }
    },
    setCueRotateCueListener: function () {
        this.bidaDeskNode.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.bidaDeskNode.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.bidaDeskNode.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.bidaDeskNode.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancle, this);
        this.panelPower.active = true;
    },
    setCuePosByTouch: function (pos, isBegan, isEnd, angular) {
        var whiteball = this.getWhiteBall();
        if (!whiteball || (whiteball && !cc.isValid(whiteball))) {
            this.cue.position = cc.v2(99999, 99999);
            // cc.log("White ball disappeared ...");
            return;
        }
        if (!isNaN(angular) && (typeof angular !== "boolean")) {
            if (Math.abs(angular) > 360) {
                return;
            }
            this.cue.getComponent("CueObj").setCuePosByTouch(pos, isBegan, isEnd, angular);
            return;
        }
        if (!pos) {
            return;
        }
        if (!this || !this.isValid) {
            return;
        }
        var worldCoWhiteBallPosition = this.bidaDeskNode.convertToWorldSpaceAR(whiteball.position);
        var ballX = worldCoWhiteBallPosition.x;
        var ballY = worldCoWhiteBallPosition.y;
        var rotateX = -(pos.x - ballX);
        var rotateY = -(pos.y - ballY);
        var rotate = Math.atan(rotateY / rotateX) * 180 / Math.PI;
        if (rotateX >= 0 && rotateY >= 0) {
            rotate = 180 - rotate
        } else if (rotateX <= 0 && rotateY <= 0) {
            rotate = 360 - rotate
        } else if (rotateX <= 0 && rotateY >= 0) {
            rotate = Math.abs(rotate)
        } else if (rotateX >= 0 && rotateY <= 0) {
            rotate = 180 + Math.abs(rotate);
        }
        this.cue.getComponent("CueObj").setCuePosByTouch(pos, isBegan, isEnd, angular, true, rotate);
    },
    setCueOpacity: function () {
        if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1 || Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
            var _billardController = this.getBillardController();
            if (Linker.BiDaOfflineController && cc.isValid(Linker.BiDaOfflineController)) {
                _billardController = Linker.BiDaOfflineController;
            }
            var opacity = 0;
            if (_billardController) {
                if (Number(this.getPlayerIdLuotDanh()) == Number(Linker.userData.userId)) {
                    opacity = 255;
                } else {
                    opacity = 100;
                }
                if (this.cue && cc.isValid(this.cue)) {
                    this.cue.active = true;
                    this.cue.opacity = opacity;
                }
            }
        }
    },
    setCuePosition: function (pos) {
        if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1 || Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
            var _billardController = this.getBillardController();
            if (Linker.BiDaOfflineController && cc.isValid(Linker.BiDaOfflineController)) {
                _billardController = Linker.BiDaOfflineController;
            }
            if (_billardController) {
                if (_billardController._isViewMatch == false) {
                    if (this.cue && cc.isValid(this.cue)) {
                        this.cue.active = true;
                        this.cue.position = pos;
                    }
                }
            }
        }
    },
    showCueUI: function () {
        var _billardController = this.getBillardController();
        if (Linker.BiDaOfflineController && cc.isValid(Linker.BiDaOfflineController)) {
            _billardController = Linker.BiDaOfflineController;
        }
        if (_billardController) {
            if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1 || Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
                if (this.checkTurnValid() == true || _billardController == Linker.BiDaOfflineController) {
                    this.cue.opacity = 255;
                } else {
                    this.cue.opacity = 100;
                }
            } else {
                this.cue.opacity = 255;
            }
        }
    },
    onTouchStart: function (event) {
        if (event) {
            if (this.blockInputEventComponent.enabled) {
                return;
            }
            this.isMove = false;
            this.activeFineTurning();
            this.setCuePosByTouch(event.getLocation(), true, false, false);
        }
    },
    activeFineTurning: function () {
        this.panelFineturning.active = true;
        this.panelFineturning.opacity = 255;
    },
    onTouchMove: function (event) {
        if (event) {
            if (this.blockInputEventComponent.enabled) {
                return;
            }
            this.isMove = true;
            this.setCuePosByTouch(event.getLocation(), false, false, false);
        }
    },
    onTouchEnd: function (event) {
        if (event) {
            if (this.blockInputEventComponent.enabled) {
                return;
            }
            this.setCuePosByTouch(event.getLocation(), false, true, false);
        }
    },
    checkTurnValid: function () {
        if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1 || Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
            if (Number(this.getPlayerIdLuotDanh()) == Number(Linker.userData.userId)) {
                return true;
            }
            return false;
        }
        return true;
    },
    onTouchCancle: function (event) {
        if (this.blockInputEventComponent.enabled) {
            return;
        }
    },
    addTouchEventListener: function () {
        this.addTouchEventListenerFineTurning();
        this.addTouchEventListenerRedPoint();
        this.addTouchEventListenerSlider();
    },
    onEnable: function () {
        cc.Global.hideLoading();
        var canvas = cc.find("Canvas");
        var Widget = this.node.getComponent(cc.Widget);
        if (Widget) {
            // Widget.target = canvas;
            Widget.top = 0;
            Widget.bottom = 0;
            Widget.left = 0;
            Widget.right = 0;
            Widget.alignMode = cc.Widget.AlignMode.ONCE;
        } else {
            this.node.width = cc.Canvas.instance.designResolution.width;
            this.node.height = cc.Canvas.instance.designResolution.height;
            this.node.position = cc.v2(0, 0);
        }
        Linker._sceneTag = BiDaConstant.TAG.scenes.GAME;
        if (Linker.ZONE != BiDaConstant.ZONE_ID.ZONEID_BIDA_LUCKY_SHOT && !Linker.BiDaOfflineController) {
            //active viewer
            this.initViewer();
            this.initNohu();
            this.btnPlayerViewList.parent.active = Linker.BiDaOfflineController ? false : true;
        }
        BiDaConstant.METHODS.createListenerNode().emit("resetCountChat");
    },
    addTouchEventListenerFineTurning: function () {
        this.curBatPosY = 0;
        this.bidaFineTurningBlock.on(cc.Node.EventType.TOUCH_START, this.onFineTurningStarted, this);
        this.bidaFineTurningBlock.on(cc.Node.EventType.TOUCH_MOVE, this.onFineTurningMoving, this);
        this.bidaFineTurningBlock.on(cc.Node.EventType.TOUCH_END, this.onFineTurningEnded, this);
        this.bidaFineTurningBlock.on(cc.Node.EventType.TOUCH_CANCEL, this.onFineTurningCancled, this);
        this.panelFineturning.active = true;
        this.panelFineturning.opacity = 255;
    },
    addTouchEventListenerRedPoint: function () {
        this.redPointNode.on(cc.Node.EventType.TOUCH_END, this.onRedPointTouch, this);
    },
    addTouchEventListenerSlider: function () {
        this.forcePowerSlider.on("slide", this.onForcePowerSliding, this);
        this.bidaBtnSlide.on(cc.Node.EventType.TOUCH_START, this.onForceSliderStart, this);
        this.bidaBtnSlide.on(cc.Node.EventType.TOUCH_END, this.onForceSliderEnded, this);
        this.bidaBtnSlide.on(cc.Node.EventType.TOUCH_CANCEL, this.onForceSliderCancled, this);

    },
    runActionShotBallWhite: function (message) {
        if (this.cue && cc.isValid(this.cue)) {
            var slider = this.forcePowerSlider.getComponent(cc.Slider);
            if (slider) {
                if (this.whiteBall && this.whiteBall.isValid) {
                    this.cue.stopAllActions();
                    this.cue.active = true;
                    this.cue.getComponent("CueObj").lineCheck.opacity = 0;
                    var _this = this;
                    this.cue.runAction(
                        cc.sequence(
                            cc.spawn(
                                cc.moveTo(0.15, _this.whiteBall.position),
                                cc.fadeOut(0.15)
                            ),
                            cc.callFunc(function () {
                                _this.giveBallAPowerFromServer(message.cueAR, message.force, message.type, message.isLuckyShot);
                            })
                        )
                    );
                    slider.handle.node.stopAllActions();
                    slider.handle.node.active = true;
                    slider.handle.node.runAction(
                        cc.sequence(
                            cc.moveTo(0.15, cc.v2(0, 0)),
                            cc.callFunc(function () {
                                slider.progress = 1;
                            })
                        )
                    );
                }
            }
        }
    },
    sliderPowerEndedFinish: function (event) {
        var slider = this.forcePowerSlider.getComponent(cc.Slider);
        if (this.whiteBall && this.whiteBall.isValid) {
            var progress = slider.progress;
            if (progress == 1) {
                slider.progress = 1;
                //bang mot thi khong ban dau he
            } else {
                //dispatch event
                // this.node.runAction
                // var customEvent = {
                //     rotation: 0,
                //     cue: cc.v2(0, 0)
                // };
                // customEvent.rotation = -this.cue.angle;
                // customEvent.position = this.cue.parent.convertToWorldSpaceAR(this.cue.position);
                // //
                // this.setCuePosByTouch(cc.v2(0, 0), false, true, Utils.Malicious.toPositiveAngle(customEvent.rotation));

                // this.node.emit(BiDaConstant.GAME_TABLE_EVENT.XAC_LAP_VI_TRI_GOC_BAN, customEvent);
                this.cue.stopAllActions();
                this.sendDataTruocKhiBanBi();
            }
        } else {
            slider.progress = 1;
            this.cue.position = cc.v2(99999, 99999);
            // cc.log("Khong tim thay bi trang ...");
        }
    },
    onForceSliderStart: function (event) {
        if (event) {
            var isPlaySound = Math.floor01(Math.random());
            if (isPlaySound) {
                NewAudioManager.PlayUrl(Linker.gameLanguage == "vi" ? NewAudioManager.SOUND.VI.SLIDE_POWER : NewAudioManager.SOUND.EN.SLIDE_POWER);
            }
            if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1 || Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
                if (this.getPlayerIdLuotDanh() == Number(Linker.userData.userId)) {
                    if (this.cue && cc.isValid(this.cue)) {
                        var whiteBall = this.getBallById(0);
                        if (whiteBall && this.cue && cc.isValid(whiteBall) && cc.isValid(this.cue)) {
                            var deskNode = this.cue.parent;
                            this.cue.position = whiteBall.position;
                            var p = this.cue.parent.convertToWorldSpaceAR(this.cue.position);
                            var wlocation = Utils.Malicious.getApointWhenKnowAngleAndRadius(p, this.cue.angle, deskNode.width * 2);
                            this.setCuePosByTouch(wlocation, false, true, false);
                        }
                    }
                }
            }
        }
    },
    onForceSliderEnded: function (event) {
        if (event) {
            this.clearForcePercent();
            if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4 || Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_LUCKY_SHOT) {
                this.sliderPowerEndedFinish(event);
            } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1 || Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
                if (this.getPlayerIdLuotDanh() == Number(Linker.userData.userId)) {
                    this.onForcePowerSliding(this.forcePowerSlider, true);
                    this.sliderPowerEndedFinish(event);
                } else {
                    this.forcePowerSlider.getComponent(cc.Slider).progress = 1;
                }
            }
        }
    },
    giveBallAPowerFromServer: function (_forcePercent, _mrotate, type, isLuckyShot) {
        if (this.cue && cc.isValid(this.cue)) {
            this.m_rotate = _mrotate;
            this.cue.getComponent("CueObj").setPercent(_forcePercent * 100);
            var cuePos = this.cue.parent.convertToWorldSpaceAR(this.cue.position);
            if (this.whiteBall && this.whiteBall.isValid) {
                var whitePos = this.whiteBall.position;
                this.cue.runAction(
                    cc.sequence(
                        cc.spawn(
                            cc.moveTo(0.15, whitePos),
                            cc.fadeOut(0.15)
                        ),
                        cc.callFunc(function () {
                            this.giveBallAPower(_forcePercent, cuePos, type, isLuckyShot);
                            // if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
                            //     if (this.otherUserInfo && this.myUserInfo) {
                            //         this.myUserInfo.getComponent("BillardUserView").stopCounter(true);
                            //         this.otherUserInfo.getComponent("BillardUserView").stopCounter(true);
                            //     }
                            // } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
                            //     var data = {
                            //         BillardsGameTable: this
                            //     }
                            //     BidaPhomGameTable.stopTimerCounter(data);
                            // } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
                            //     this.myUserInfo.getComponent("BillardUserView").stopCounter(true);
                            // }
                        }.bind(this))
                    )
                );
            }
        }
    },
    sendDataTruocKhiBanBi: function () {
        this.blockTouchEvent();
        var _forcePercent = 100;
        var slider = this.forcePowerSlider.getComponent(cc.Slider);
        if (slider) {
            var progress = slider.progress;
            _forcePercent = Number(Number(1 - progress).toFixed(2));
        }
        //gui thong tin luc danh len server
        var customEvent = {
            force: this.m_rotate,
            cue: _forcePercent,
            ballList: this.getBallsInHole().listBallTableJson
        };
        var message = {
            cueAR: _forcePercent,
            force: this.m_rotate,
            type: 1
        }
        if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1 || Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
            if (!Linker.BiDaOfflineController) {
                if (this.getPlayerIdLuotDanh() == Number(Linker.userData.userId)) {
                    this.node.emit(BiDaConstant.GAME_TABLE_EVENT.GUI_THONG_TIN_LUC_BAN_LEN_CHO_NGUOI_DUNG_KHAC, customEvent);
                } else {
                    this.node.emit(BiDaConstant.GAME_TABLE_EVENT.GUI_THONG_TIN_LUC_BAN_LEN_CHO_NGUOI_DUNG_KHAC, customEvent);
                }
            } else if (Linker.BiDaOfflineController) {
                this.runActionShotBallWhite(message);
            }
        } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_LUCKY_SHOT || Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
            //phải cho lucky target biết là người dùng đã bắn bi rồi và bắt đầu update tọa độ
            // this.giveBallAPower(_forcePercent, null, 1);

            if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_LUCKY_SHOT) {
                message.isLuckyShot = true;
            }
            this.runActionShotBallWhite(message);
        }
    },
    giveBallAPower: function (_forcePercent, cuePos, type, isLuckyShot) {
        if (this.cue && cc.isValid(this.cue)) {
            if (this.thanhNgang && cc.isValid(this.thanhNgang)) {
                this.thanhNgang.active = false;
            }
            if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_LUCKY_SHOT) {
                var isTypePlayMoney = Linker.LuckyShotGame.isTypePlayMoney;
                if (!isTypePlayMoney) { // check quay thu quay that
                    Linker.LuckyShotGame.onProcessTestTurn();
                }
                if (Linker.LuckyShotGame.isStopTest && !Linker.LuckyShotGame.isTypePlayMoney) {
                    cc.Global.showMessage(i18n.t("luckyshot_msg_turn_out"));
                    this.unBlockTouchEvent();
                    return;
                } else if (Linker.LuckyShotGame.isStopMoney && Linker.LuckyShotGame.isTypePlayMoney) {
                    this.blockTouchEvent();
                    return;
                } else if (!Linker.LuckyShotGame.isStopMoney && Linker.LuckyShotGame.isTypePlayMoney) {
                    //tru tien offline
                    DataManger.UserData.addUserMoney(-Number(Linker.LuckyShotGame.currCuoc))
                    //gui xem so diem toi da co the an duoc
                    var vongTrontinhDiemComponent = this.getVongTrontinhDiemComponent();
                    if (vongTrontinhDiemComponent) {
                        //xem minh co the dat toi da duoc bao nhieu tien
                        // vongTrontinhDiemComponent.requestMaxRound(this);
                    }
                }
                this.setStorageCreated(false);
            }
            // this.hideTimeCountDownBallError();
            // this.m_rotate = cc.v2(0, 0);
            var BillardsGameTableController = this.getBillardController();
            if (this.whiteBall && this.whiteBall.isValid == true && !BillardsGameTableController.isStopPlaying) {
                var whiteBalRigidBody = this.whiteBall.getComponent(cc.RigidBody);
                if (whiteBalRigidBody) {
                    if (!cuePos) {
                        cuePos = this.cue.parent.convertToWorldSpaceAR(this.cue.position);
                    }
                    this.id_ball_lose = [];
                    this.id_ball_lose_global = [];
                    var ballWhitePos = this.whiteBall.position;
                    //world location
                    ballWhitePos = this.whiteBall.parent.convertToWorldSpaceAR(this.whiteBall.position);
                    // apply luc giat lui bi
                    var _center = whiteBalRigidBody.getWorldCenter();
                    var lengthForce = _forcePercent * 100;
                    var newCuePos = Utils.Malicious.getApointWhenKnowAngleAndRadius(ballWhitePos, Utils.Malicious.toPositiveAngle(this.cue.angle + 180), lengthForce);
                    //vi du 100% luc length = 100
                    var diffX = (ballWhitePos.x - newCuePos.x);
                    var diffY = (ballWhitePos.y - newCuePos.y);

                    var rotateX = this.m_rotate.x;
                    var rotateY = this.m_rotate.y;

                    var velocityX = diffX * BiDaConstant.PHYSICS.BALLS.RIGID.lineSpeedRatio * _forcePercent;
                    var velocityY = diffY * BiDaConstant.PHYSICS.BALLS.RIGID.lineSpeedRatio * _forcePercent;
                    var fAngularVelocity = BiDaConstant.PHYSICS.BALLS.RIGID.leftRightForceRatio * rotateX;

                    var unevenX = diffX * BiDaConstant.PHYSICS.BALLS.RIGID.rotateForceRatio * _forcePercent * rotateY;
                    var unevenY = diffY * BiDaConstant.PHYSICS.BALLS.RIGID.rotateForceRatio * _forcePercent * rotateY;
                    // hit params 
                    var fVelocity = cc.v2(velocityX, velocityY);
                    this.playSoundBallFx(Math.abs(fVelocity.x) + Math.abs(fVelocity.y), this.CueHit, 1, false);
                    var fUnevenBars = cc.v2(unevenX, unevenY);
                    //add by zep
                    whiteBalRigidBody.fixedRotation = true;
                    whiteBalRigidBody.linearDamping = true;

                    //end add by zep
                    // whiteBalRigidBody.angularVelocity = 0;
                    whiteBalRigidBody.angularVelocity = 300 * rotateY;
                    //whiteBalRigidBody.linearVelocity = cc.v2(0, 0);
                    whiteBalRigidBody.applyLinearImpulse(fVelocity, cc.v2(0, 0), true);
                    whiteBalRigidBody.angularVelocity = fAngularVelocity;
                    whiteBalRigidBody.applyForce(fUnevenBars, cc.v2(0, 0), true);
                    // phai de o day
                    this._isShoted = true;
                    if (type == 1) {
                        //bắn từ client
                        this._isSendedBeforeTurn = false;
                        this._isSendedBeforeTurnBot = true;
                    } else {
                        //bắn từ server
                        if (!Linker.BiDaOfflineController && BillardsGameTableController.checkBotById(BillardsGameTableController.idplayerLuotDanh) && this.userIdCheck == this.myUserId) {
                            this._isSendedBeforeTurnBot = false;
                        } else {
                            this._isSendedBeforeTurn = true;
                            this._isSendedBeforeTurnBot = true;
                        }
                    }
                    //khong duoc di chuyen
                    //pull force
                    if (Linker.BiDaOfflineController) {
                        Linker.BiDaOfflineController.isSendData = true;
                        // var listUsers = [this.myUserInfo, this.otherUserInfo];
                        // for (let i = 0; i < listUsers.length; i++) {
                        //     var userInfoView = listUsers[i].getComponent("BillardUserView");
                        //     if (userInfoView) {
                        //         if (userInfoView.getUserID() == this.myUserId) {
                        //             userInfoView.stopCounter(true);
                        //         }
                        //     }
                        // }
                    }
                    this._isBallHit = BiDaConstant.GAME.STATUS.BALL_ERROR.BI_MUC_TIEU_KHONG_CHAM_BAT_CU_BI_NAO_CA;
                    this._isBallHit_global = BiDaConstant.GAME.STATUS.BALL_ERROR.BI_MUC_TIEU_KHONG_CHAM_BAT_CU_BI_NAO_CA;
                    //fix lỗi nháy bi nhé
                    this.blockTouchEvent();

                    this.m_rotate = cc.v2(0, 0);
                    var smallRedpoint = this.redPointNode.getChildByName("Small_RedPoint");
                    if (smallRedpoint) {
                        smallRedpoint.position = cc.v2(0, 0);
                    }
                    if (isLuckyShot) {
                        Linker.LuckyShotGame.blockBtnBet(true);
                        this.batDauCheckLuckyShot();
                    }
                }
            }
        }
    },
    batDauCheckLuckyShot: function () {
        var vongTrontinhDiemComponent = this.getVongTrontinhDiemComponent();
        if (vongTrontinhDiemComponent) {
            vongTrontinhDiemComponent.setBeginCheckBallTarget(true);
            var idBallTarget = vongTrontinhDiemComponent.getIDBallTarget();
            if (idBallTarget && isNaN(parseInt(idBallTarget)) == false) {
                var ballTarget = this.getBallById(idBallTarget);
                var ballWhite = this.getBallById(0);
                if (ballTarget && cc.isValid(ballTarget) && ballWhite && cc.isValid(ballWhite)) {
                    vongTrontinhDiemComponent.setBallTarget(ballTarget);
                    vongTrontinhDiemComponent.setBallWhite(ballWhite);
                }
            }
        }
    },
    playSoundBallFx: function (force, audiosource, volume, loop) {
        if (force) {
            if (force > 1000) {
                volume = 1.0;
            } else {
                volume = force / 1000;
            }
            if (isNaN(force)) {
                volume = 1;
            }
        }
        if (!volume) {
            volume = 1;
        }
        NewAudioManager.playEffectADS(audiosource, volume, loop);
    },
    setIsShoted: function (_isShoted) {
        this._isShoted = _isShoted;
    },
    onForceSliderCancled: function (event) {
        this.onForceSliderEnded(event);
    },
    onForcePowerSliding: function (slider, _forcedSend) {
        if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4 || Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_LUCKY_SHOT) {
            this.slidePowerAction(slider, _forcedSend);
        } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1 || Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
            if (this.getPlayerIdLuotDanh() == Number(Linker.userData.userId)) {
                this.slidePowerAction(slider, _forcedSend);
            } else {
                slider.progress = 1;
            }
        }
    },
    slidePowerAction: function (slider, _forcedSend) {
        this.cue.getChildByName("drawLine").opacity = 0;
        this.showCueUI();
        var progress = slider.progress;
        if (progress) {
            var percent = (1 - progress) * 100;
            this.setColorPower(progress);
            this.cue.getComponent("CueObj").setPercent(percent, _forcedSend);
            if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_LUCKY_SHOT && Number(Linker.LuckyShotGame.currCuoc) > Number(DataManger.UserData.getUserMoney())) {
                cc.Global.showMessage(i18n.t("Bạn không đủ tiền để chơi. vui lòng nạp tiền."));
                Linker.LuckyShotGame.isStopMoney = true;
                if (Number(Linker.LuckyShotGame.arrCuoc[0]) > Number(DataManger.UserData.getUserMoney())) {
                    PopupShowManager.Instance.showPopupIAP(true);
                }
            }
            // if (this.getPlayerIdLuotDanh() == Number(Linker.userData.userId)) {
                this.runForcePercent({
                    percent: percent
                }, function (err, data) {

                })
            // }
        }
    },
    setColorPower: function (progress) {
        if (this.colorPower) {
            this.colorPower.fillStart = progress;
        }
    },
    onRedPointTouch: function (touch) {
        // cc.log("Mo angle adjust red point ...");
        NewAudioManager.playClick();
        if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4 || Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_LUCKY_SHOT) {
            this.initWhiteBallViewPanel();
        } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1 || Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
            if (this.getPlayerIdLuotDanh() == Number(Linker.userData.userId)) {
                if (this._isShoted == false) {
                    this.initWhiteBallViewPanel();
                }
            } else {
                // cc.log("Chua phai den luot cua ban, khong duoc mo popup...");
            }
        }
    },
    onRedPointSetPullNum: function (event) {
        this.m_rotate = cc.v2(0, 0);
        if (event.hasOwnProperty("_pos")) {
            var smallRedpoint = this.redPointNode.getChildByName("Small_RedPoint");
            if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
                this.m_rotate = event._pos;
                if (smallRedpoint) {
                    var x = this.m_rotate.x * (this.redPointNode.height * 0.5 + smallRedpoint.width * 0.5);
                    var y = this.m_rotate.y * (this.redPointNode.height * 0.5 + smallRedpoint.height * 0.5);
                    smallRedpoint.position = cc.v2(x, y);
                }
            } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1 || Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
                if (this.checkTurnValid()) {
                    this.m_rotate = event._pos;
                    var BillardsGameTableController = this.getBillardController();
                    if (BillardsGameTableController) {
                        BillardsGameTableController.onYeuCauGuiToaDoPullForce({
                            pullforce: this.m_rotate
                        });
                    }
                    //mode 1vs1
                    if (smallRedpoint) {
                        var x = this.m_rotate.x * (this.redPointNode.height * 0.5 + smallRedpoint.width * 0.5);
                        var y = this.m_rotate.y * (this.redPointNode.height * 0.5 + smallRedpoint.height * 0.5);
                        smallRedpoint.position = cc.v2(x, y);
                    }

                } else {
                    this.m_rotate = cc.v2(0, 0);
                    smallRedpoint.position = cc.v2(0, 0);
                }
            }
        }
    },
    getBillardController: function () {
        var BillardsGameTableController = this.node.getComponent("BillardsGameTableController");
        if (BillardsGameTableController && BillardsGameTableController.isValid) {
            return BillardsGameTableController;
        } else {
            BillardsGameTableController = this.node.getComponent("BiDaOfflineController");
            if (BillardsGameTableController && BillardsGameTableController.isValid) {
                return BillardsGameTableController;
            }
        }
        return null;
    },
    initWhiteBallViewPanel: function () {
        this.panelWhiteBall.active = true;
        this.panelWhiteBall.removeAllChildren(true);
        var whiteBallNode = cc.instantiate(this.whiteBallViewPrefab);
        this.panelWhiteBall.addChild(whiteBallNode);

    },

    onFineTurningStarted: function (touch) {
        if (touch) {
            this.activeFineTurning();
            var loc = touch.getLocation();
            this.curBatPosY = this.bidaFineTurningLayout.convertToNodeSpaceAR(loc).y;
            this.isFireTuringStart = true;
        }
    },
    checkLocationFineTurning: function (loc) {
        var _currentPos = this.bidaFineTurningBlock.parent.convertToWorldSpaceAR(this.bidaFineTurningBlock.position);
        var _originPos = cc.v2(_currentPos.x - this.bidaFineTurningBlock.width * 0.5, _currentPos.y - this.bidaFineTurningBlock.height * 0.5)
        var rect = new cc.Rect(_originPos.x, _originPos.y, this.bidaFineTurningBlock.width, this.bidaFineTurningBlock.height);
        if (rect.contains(loc)) {
            return true;
        }
        return false;
    },
    onFineTurningMoving: function (touch) {
        //check colider
        if (touch) {
            var loc = touch.getLocation();
            if (this.isFireTuringStart == true && this.checkLocationFineTurning(loc)) {
                this.activeFineTurning();
                this.showCueUI();
                this.cue.position = this.whiteBall.position;

                var _pos = this.bidaFineTurningLayout.convertToNodeSpaceAR(loc);
                var _y = this.bidaFineTurningLayout.position.y - this.curBatPosY + _pos.y;
                if (_y >= this.bidaFineTurningLayout.height * 0.5 - this.bidaFineTurningLayout.parent.height * 0.5) {
                    _y = -(this.bidaFineTurningLayout.height * 0.5 - this.bidaFineTurningLayout.parent.height * 0.5);
                } else if (_y <= -(this.bidaFineTurningLayout.height * 0.5 - this.bidaFineTurningLayout.parent.height * 0.5)) {
                    _y = this.bidaFineTurningLayout.height * 0.5 - this.bidaFineTurningLayout.parent.height * 0.5;
                }
                this.bidaFineTurningLayout.position = cc.v2(this.bidaFineTurningLayout.position.x, _y);
                NewAudioManager.playEffectADS(this.Fine_Tuning, 1, false);
                var _offset = (this.curBatPosY - _pos.y) / 200;
                var _currentAngle = -this.cue.angle;
                var _nextAngle = Utils.Malicious.toPositiveAngle(_currentAngle + _offset);
                this.setCuePosByTouch(null, false, false, _nextAngle);

            }
        } else {
            this.onFineTurningEnded(touch);
        }
    },
    onFineTurningEnded: function (touch) {
        this.curBatPosY = 0;
        this.isFireTuringStart = false;
    },
    onFineTurningCancled: function (touch) {
        this.onFineTurningEnded(touch);
    },
    initBackground: function (data) {
        this.setBidaTableBackground(data.type_table);
    },
    setBidaTableBackground: function (zoneid) {
        var type = 0;
        var typeCommon = 0;
        switch (zoneid) {
            case BiDaConstant.ZONE_ID.ZONEID_1VS1:
                type = 0;
                break;
            case BiDaConstant.ZONE_ID.ZONEID_1VS4:
                type = 1;
                break;
            case BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM:
                type = 2;
                break;
            case BiDaConstant.ZONE_ID.ZONEID_BIDA_LUCKY_SHOT:
                type = 0;
                typeCommon = BiDaConstant.UI.TYPE_BACK_GROUND.LUCKY_SHOT;
                break;
            default:
                type = 0;
                break;
        }
        // this.setBidaCommonBackground(0);

        let texture = this.bidaTableTextures[0];
        if (type >= 0 && type <= this.bidaTableTextures.length - 1) {
            texture = this.bidaTableTextures[type];
        }
        let spframe = new cc.SpriteFrame();
        spframe.setTexture(texture);
        this.bidaTableBackground.getComponent(cc.Sprite).spriteFrame = spframe;
    },
    getMainGame: function () {
        if (this.bidaDeskNode && this.bidaDeskNode.isValid) {
            return this.bidaDeskNode;
        }
        return null;
    },
    runBallInHoleFx: function (data) {
        if (data) {
            var idBi = parseInt(data.idBi);
            if (isNaN(idBi) == false && data.fx_position) {
                if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
                    if (Number(this.getPlayerIdLuotDanh()) == Number(Linker.userData.userId)) {
                        if (this.myListBallOnHand && Array.isArray(this.myListBallOnHand) && this.myListBallOnHand.indexOf(idBi) != -1) {
                            var _ballFx = cc.instantiate(this.BallInHoleFXPrefab);
                            var _ballFxJs = _ballFx.getComponent("BallInHoleFx");
                            if (_ballFxJs) {
                                _ballFx.position = data.fx_position;
                                this.bidaDeskNode.addChild(_ballFx);
                            }

                        }
                    }
                } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {

                }
            }
        }

    },
    refreshBallAni: function (dt) {
        var ball;
        for (let i = 0; i < this.bidaDeskNode.children.length; i++) {
            ball = this.bidaDeskNode.children[i];
            var ballcpn = ball.getComponent("Ball");
            if (ballcpn) {
                var angle = -(360 + ball.angle);
                ballcpn.blurNode.angle = angle;
                ballcpn.shadow.angle = angle;
                ballcpn.tip.angle = angle;
                ballcpn.bong.angle = angle;
                ballcpn.setShadowBall();
                var velocity = ballcpn.rigidBody.linearVelocity;
                var angularVelocity = ballcpn.rigidBody.angularVelocity;
                var v = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);

                if (v <= BiDaConstant.PHYSICS.BALLS.RIGID.ballDampingValue) {
                    ballcpn.rigidBody.linearDamping = BiDaConstant.PHYSICS.BALLS.RIGID.ballLinearIncreaseMultiple;
                    if (v <= BiDaConstant.PHYSICS.BALLS.RIGID.ballDoubleDampingValue) {
                        ballcpn.rigidBody.linearDamping = BiDaConstant.PHYSICS.BALLS.RIGID.ballLinearIncreaseDoubleMultiple;
                    }
                }
                if (v != 0) {
                    var rotation3D = cc.v3(
                        -velocity.y / BiDaConstant.PHYSICS.BALLS.RIGID.ballRollingRate,
                        velocity.x / BiDaConstant.PHYSICS.BALLS.RIGID.ballRollingRate,
                        angularVelocity / BiDaConstant.PHYSICS.BALLS.RIGID.ballRollingRate / 3
                    );
                    var rigid3D = ballcpn.ball3DNode.getComponent(cc.RigidBody3D);
                    rigid3D.setAngularVelocity(rotation3D);
                }
            }
        }
    },
    checkNoHuLuckyShot: function () {
        var allBiInTables = this.getBallsInTable();
        var vongTronTinhDiem = this.getVongTrontinhDiemComponent();
        if (!vongTronTinhDiem) {
            return;
        } else if (!vongTronTinhDiem.maxRoundArr) {
            return;
        }
        var result = vongTronTinhDiem.getResult(allBiInTables);
        var roundWin = 0;
        if (Array.isArray(result)) {
            if (result[0]) {
                roundWin = parseInt(result[0].roundWin);
            }
        }
        if (allBiInTables && allBiInTables.arrBall && allBiInTables.arrBall.indexOf(0) != -1 && allBiInTables.arrBall.length >= 2 && vongTronTinhDiem.maxRoundArr[0] != 1 && !vongTronTinhDiem.isCheckedNoHu && roundWin == 1 && Linker.LuckyShotGame.isTypePlayMoney) {
            var p = allBiInTables.ballObj;
            for (var key in p) {
                if (p.hasOwnProperty(key)) {
                    var ball = p[key];
                    var ballComponent = ball.getComponent("Ball");
                    if (ballComponent) {
                        var idBi = ballComponent.getIdBi();
                        idBi = parseInt(idBi);
                        if (isNaN(idBi) == false) {
                            if (idBi != 0) {
                                var _ballLinearVelocity = ballComponent.rigidBody.linearVelocity;
                                var speed = Utils.Malicious.length(_ballLinearVelocity);
                                if (0 < speed && speed < 7) {
                                    vongTronTinhDiem.isCheckedNoHu = true;
                                    var _center = ballComponent.rigidBody.getWorldCenter();
                                    var _impulse = 8;
                                    var _reflect = _ballLinearVelocity.normalizeSelf().mul(_impulse);
                                    //tác động một lực tới bi
                                    ballComponent.rigidBody.applyLinearImpulse(_reflect, _center, true);
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    update: function (dt) {
        this.timer += dt;
        var isAllBallStop = this.getStatusOfBalls();
        this.refreshBallAni(dt); //animation ball
        if (this._isGameStarted == true) {
            if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_LUCKY_SHOT) {
                this.checkNoHuLuckyShot();
            }
            var controller = this.getBillardController();
            var _isGamePlaying = false;
            if (controller) {
                _isGamePlaying = (controller.gameState && controller.gameState == BiDaConstant.GAME_STATE.PLAYING) ? true : false;
            }
            this.checkRunTipAnimation(isAllBallStop);
            this.checkCueVisible(isAllBallStop);
            if (Linker.BiDaOfflineController || controller.checkIdPlaying() || Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_LUCKY_SHOT) {
                this.checkSendServer(isAllBallStop);
                this.checkNextTurn(isAllBallStop);
            }
        }
    },
    getVongTrontinhDiemComponent: function () {
        for (let i = 0; i < this.bidaDeskNode.children.length; i++) {
            var c = this.bidaDeskNode.children[i];
            if (c && cc.isValid(c)) {
                var vttdComponent = c.getComponent("LuckyshotTarget");
                if (vttdComponent && cc.isValid(vttdComponent)) {
                    return vttdComponent;
                }
            }
        }
        return null;
    },
    checkSendServer: function (isAllBallStop) {
        cc.Global.isShoted = this._isShoted;
        if (this._isShoted) {
            if (isAllBallStop) {
                var data = null;
                //gui ket thuc mot turn danh
                if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
                    this._isShoted = false;
                    //phan nay dung de gui ket qua len server
                    this._isSendedBeforeTurn = true;
                    data = this.getDataToSendServer();
                    this.node.emit(BiDaConstant.GAME_TABLE_EVENT.CHO_PHEP_GUI_DATA_LEN_SERVER, data);
                    this.id_ball_lose = [];
                    this.id_ball_lose_global = [];
                    this._isBallHit_global = BiDaConstant.GAME.STATUS.BALL_ERROR.BI_MUC_TIEU_KHONG_CHAM_BAT_CU_BI_NAO_CA;
                    cc.log('ball in hole 1vs4', data);
                } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1 || Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
                    if (Number(this.getPlayerIdLuotDanh()) == Number(Linker.userData.userId)) {
                        var offlineCondt = (Linker.BiDaOfflineController && cc.isValid(Linker.BiDaOfflineController) && Linker.BiDaOfflineController.isSendData ? Linker.BiDaOfflineController.isSendData : false);
                        if (this._isDataEndTurnGame == false &&
                            this._isSendedBeforeTurn == false ||
                            offlineCondt) {
                            this._isSendedBeforeTurn = true;
                            //đến turn mình cũng phải gửi lên
                            if (this.userIdCheck == this.myUserId) {
                                // cc.error("Đến lượt mình nhưng vẫn phải gửi cho bot...");
                                var dataBot = this.getDataToSendServer(true);
                                // cc.error("Data lay duoc tu serve...", data);
                                this.node.emit(BiDaConstant.GAME_TABLE_EVENT.CHO_PHEP_GUI_DATA_LEN_SERVER_CHECK, dataBot);
                                this.id_ball_lose_global = [];
                                this._isBallHit_global = BiDaConstant.GAME.STATUS.BALL_ERROR.BI_MUC_TIEU_KHONG_CHAM_BAT_CU_BI_NAO_CA;
                            }
                            data = this.getDataToSendServer();
                            this.node.emit(BiDaConstant.GAME_TABLE_EVENT.CHO_PHEP_GUI_DATA_LEN_SERVER, data);
                            this.id_ball_lose = [];
                        }
                    } else {
                        //check nha, nếu là lượt đánh của player thì sẽ gửi
                        var BillardsGameTableController = this.getBillardController();
                        if (BillardsGameTableController && !Linker.BiDaOfflineController) {
                            if (BillardsGameTableController.checkBotById(BillardsGameTableController.idplayerLuotDanh)) {
                                if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
                                    if (BidaPhomGameTable.isMaxError) {
                                        this._isSendedBeforeTurnBot = false;
                                        this._isSendedBeforeTurn = false;
                                    }
                                }

                                if (this.userIdCheck == this.myUserId &&
                                    this._isSendedBeforeTurnBot == false &&
                                    this._isSendedBeforeTurn == false &&
                                    this._isDataEndTurnGame == false) {
                                    this._isSendedBeforeTurnBot = true;
                                    // cc.error("Không phải đến lượt mình nhưng phải gửi cho bot...");
                                    var dataBot = this.getDataToSendServer(true);
                                    // cc.error("Data lay duoc tu serve...", data);
                                    this.node.emit(BiDaConstant.GAME_TABLE_EVENT.CHO_PHEP_GUI_DATA_LEN_SERVER_CHECK, dataBot);
                                    this.id_ball_lose_global = [];
                                    this._isBallHit_global = BiDaConstant.GAME.STATUS.BALL_ERROR.BI_MUC_TIEU_KHONG_CHAM_BAT_CU_BI_NAO_CA;
                                }
                            }
                        }

                    }
                } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_LUCKY_SHOT) {
                    this._isShoted = false;
                    //phan nay dung de gui ket qua len server
                    this._isSendedBeforeTurn = true;
                    var allBiInTables = this.getBallsInTable();
                    var vongTronTinhDiem = this.getVongTrontinhDiemComponent();
                    if (allBiInTables && allBiInTables.arrBall && allBiInTables.arrBall.indexOf(0) != -1 && allBiInTables.arrBall.length >= 2) { //dam bao la bi cai khong duoc roi lo
                        if (vongTronTinhDiem) {
                            var result = vongTronTinhDiem.getResult(allBiInTables);
                            if (Array.isArray(result)) {
                                cc.log("gui ket qua lucky shot", result);
                                //choi thu thi khong send
                                var roundWin = 0;
                                if (result && result[0]) {
                                    roundWin = result[0].roundWin;
                                }
                                var isTypePlayMoney = Linker.LuckyShotGame.isTypePlayMoney;
                                if (isTypePlayMoney) {
                                    if (cc.Global.PLAY_TYPE == Constant.PLAY_TYPE.BALL_2 && !this.is2BallHitLuckyShot) {
                                        roundWin = 0;
                                    }
                                    vongTronTinhDiem.sendResult(roundWin, this);
                                    if (cc.Global.PLAY_TYPE == Constant.PLAY_TYPE.BALL_1 || (cc.Global.PLAY_TYPE == Constant.PLAY_TYPE.BALL_2 && this.is2BallHitLuckyShot)) {    
                                    } else if (cc.Global.PLAY_TYPE == Constant.PLAY_TYPE.BALL_2 && roundWin > 0) {
                                        cc.Global.showMessage(i18n.t("invalid"));
                                    }
                                }
                                this.setEndGameLuckyShot(roundWin, vongTronTinhDiem);
                            } else {
                                cc.log("Không tìm thấy kết quả lượt đánh...");
                            }
                        } else {
                            // vongTronTinhDiem.sendResult(0, this);
                            cc.log("Không thấy vòng tròn tính điểm thì thôi không gửi lose round...");
                        }
                    } else {
                        var isTypePlayMoney = Linker.LuckyShotGame.isTypePlayMoney;
                        if (isTypePlayMoney) {
                            //do mot bi bi roi xuong lo
                            vongTronTinhDiem.sendResult(0, this);
                            this.setEndGameLuckyShot(0, vongTronTinhDiem);
                            cc.Global.showMessage(i18n.t("luckyshot_msg_result_error"));
                            cc.log("Bi cai, hoac bi muc tieu roi lo...", allBiInTables);
                        }
                    }
                }
            }
        }
    },
    setEndGameLuckyShot: function (result, component = null) {
        if (result > 0 && component) {
            component.setEffect(result, function(){
                this.taoLuckyShotVanMoi();
            }.bind(this));
        } else {
            this.scheduleOnce(function(){
                this.taoLuckyShotVanMoi();
            }.bind(this), 3);
        }
    },
    isBotInGame: function (listPlayer) {
        return this.isBotInTable;
        // if(listPlayer && Array.isArray(listPlayer) && listPlayer.length > 0){
        //     for(let i = 0; i< listPlayer.length; i++){
        //         var isBot = listPlayer[i].isBot;
        //         if(isBot){
        //             return false;
        //         }
        //     }
        // }
        // return false;
    },
    checkCueVisible: function (isAllBallStop) {
        if (this.cue && cc.isValid(this.cue)) {
            if (!isAllBallStop) {
                this.cue.opacity = 0;
                this.cue.position = cc.v2(99999, 99999);
            }
        }
    },
    getStatusOfBalls: function () {
        var ball;
        var balls = [];
        for (let i = 0; i < this.bidaDeskNode.children.length; i++) {
            ball = this.bidaDeskNode.children[i];
            var ballcpn = ball.getComponent("Ball");
            if (ballcpn) {
                if (ballcpn.checkIsStop() == true) {
                    // ballcpn.shadow.opacity = 255;
                    ballcpn.rigidBody.linearVelocity = cc.v2(0, 0);
                    ballcpn.rigidBody.angularVelocity = 0;
                    var rigid3D = ballcpn.ball3DNode.getComponent(cc.RigidBody3D);
                    rigid3D.setAngularVelocity(cc.v3(0.0, 0.0, 0.0));
                    rigid3D.setLinearVelocity(cc.v3(0, 0, 0));
                } else {
                    // ballcpn.shadow.opacity = 0;
                    return false;
                }
                balls.push(ball);
            }
        }
        return true;
    },
    checkRunTipAnimation: function (isAllBallStop) {
        if (isAllBallStop) {
            if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
                this.runTipAnimation();
            } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1 || Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
                if (Number(this.getPlayerIdLuotDanh()) == Number(Linker.userData.userId)) {
                    this.runTipAnimation();
                } else {
                    this.stopAllTipAnimation();
                }
            }
        } else {
            this.stopAllTipAnimation();
        }
    },
    getBallsInHole: function (isCheck) {
        var ballsInHole = [];
        var ballsObj = this.getBallsInTable(isCheck);
        var balls = ballsObj.arrBall;
        for (let i = 0; i < 16; i++) {
            if (balls.indexOf(i) == -1) {
                ballsInHole.push(i);
            }
        }
        var tmp = "";
        for (let j = 0; j < ballsInHole.length; j++) {
            tmp += "#" + ballsInHole[j];
        }

        return {
            listEat: tmp,
            arrEat: ballsInHole,
            listBallTableJson: ballsObj.jsonArr,
            listBallTableArray: ballsObj.arrBall,
        };
    },
    getBallsInTable: function (isCheck) {
        var balls = [];
        var jsonArr = [];
        var ballObj = {};
        for (let i = 0; i < this.bidaDeskNode.children.length; i++) {
            var ball = this.bidaDeskNode.children[i];
            var ballcpn = ball.getComponent("Ball");
            if (ballcpn) {
                var idBi = Number(ballcpn.getIdBi());
                idBi = parseInt(idBi);
                if (isNaN(idBi) == false) {
                    var wpos = isCheck ? ball.position : ball.parent.convertToWorldSpaceAR(ball.position);
                    var posObj = {
                        x: wpos.x, //convert world space
                        y: wpos.y,
                        num: idBi
                    };
                    balls.push(posObj.num);
                    jsonArr.push(posObj);
                    ballObj[idBi] = ball;
                }
            }
        }
        var tmp = "";
        for (let j = 0; j < balls.length; j++) {
            tmp += "#" + balls[j];
        }

        return {
            arrBall: balls,
            listBall: tmp,
            jsonArr: JSON.stringify(jsonArr),
            ballObj: ballObj
        };
    },
    runTipAnimation: function () {
        var myColorBall = [];
        for (let i = 0; i < this.bidaDeskNode.children.length; i++) {
            var ball = this.bidaDeskNode.children[i];
            var ballcpn = ball.getComponent("Ball");
            if (ballcpn) {
                var idBi = ballcpn.getIdBi();
                idBi = parseInt(idBi);
                if (isNaN(idBi) == false && this.myListBallOnHand && Array.isArray(this.myListBallOnHand) && this.myListBallOnHand.indexOf(idBi) != -1) {
                    myColorBall.push(ball);
                }
                // if (ballcpn.getColorTag() == BiDaConstant.COLOR_TAG.ME) {
                //     myColorBall.push(ball);
                // }
            }
        }
        if (this._isTipped == false) {
            var myColorBallId = [];
            this._isTipped = true;
            for (let j = 0; j < myColorBall.length; j++) {
                var b = myColorBall[j].getComponent("Ball");
                if (b && b.isValid) {
                    if (myColorBall.length >= 1) {
                        var idBi = b.getIdBi();
                        if (isNaN(parseInt(idBi)) == false) {
                            if (idBi == 8) {
                                if (!this.getFinalBall()) {
                                    b.stopTipFx();
                                } else {
                                    myColorBallId.push(idBi);
                                    b.runTipFx();
                                }
                            } else {
                                myColorBallId.push(idBi);
                                b.runTipFx();
                            }
                        }
                    }
                }
            }
            cc.log("my ball tip", myColorBallId);
        }
    },
    stopTipAnimation: function (myColorBall) {
        this._isTipped = false;
        for (let j = 0; j < myColorBall.length; j++) {
            var b = myColorBall[j].getComponent("Ball");
            if (b && b.isValid) {
                b.stopTipFx();
            }
        }
    },
    stopAllTipAnimation: function () {
        this._isTipped = false;
        for (let i = 0; i < this.bidaDeskNode.children.length; i++) {
            var ball = this.bidaDeskNode.children[i];
            var ballcpn = ball.getComponent("Ball");
            if (ballcpn && ballcpn.isValid) {
                ballcpn.stopTipFx();
            }
        }
    },
    checkNextTurn: function (isAllBallStop) {
        if (isAllBallStop) {
            var _billardController = this.getBillardController();
            if (_billardController && cc.isValid(_billardController)) {
                if (this._isShoted && this._isDataEndTurnGame) {
                    this._isShoted = false;
                    _billardController.runNextTurnWaitingFinish();
                } else if (_billardController.isAutoNextTurn) {
                    _billardController.isAutoNextTurn = false;
                    this._isShoted = false;
                    _billardController.runNextTurnWaitingFinish();
                } else if (_billardController.isReconnectWait == true && this._isDataEndTurnGame) {
                    _billardController.isReconnectWait = false;
                    this._isShoted = false;
                    _billardController.runNextTurnWaitingFinish();
                } else if (!_billardController.isAutoNextTurn && this._isDataEndTurnGame) {
                    this._isShoted = false;
                    _billardController.runNextTurnWaitingFinish();
                }
            }
            //vấn đề ở đây reset quá sớm =))
            this.resetForces();
        }
    },
    clearAllBallOnTable: function (ballEat) {
        //clear all tray ball add add new ball eat
        if (Utils.Malicious.isJsonString(ballEat)) {
            ballEat = JSON.parse(ballEat);
            this.addHardNewBallEatData(ballEat);
            for (var i = 0; i < this.bidaDeskNode.children.length; i++) {
                var biObj = this.bidaDeskNode.children[i];
                var biScript = biObj.getComponent("Ball");
                if (biScript) {
                    var idBi = biScript.getIdBi();
                    if (isNaN(parseInt(idBi)) == false) {
                        if (ballEat && Array.isArray(ballEat) && ballEat.length) {
                            if (ballEat.indexOf(idBi) != -1) {
                                if (idBi == 0) {
                                    this.cue.position = cc.v2(99999, 99999);
                                }
                                biObj.removeFromParent(true);
                            }
                        }
                    }
                }
            }
        }
    },
    clearAllBallInHole: function () {
        for (var i = 0; i < this.bidaDeskNode.children.length; i++) {
            var biObj = this.bidaDeskNode.children[i];
            var biScript = biObj.getComponent("BallInHole");
            if (biScript) {
                biObj.removeFromParent(true);
            }
        }
    },
    getListBiAnByBallPos: function (dataBallPos) {
        var listBallEat = [];
        var listBallInTable = [];
        if (dataBallPos && Array.isArray(dataBallPos) && dataBallPos.length > 0) {
            for (let i = 0; i < dataBallPos.length; i++) {
                listBallInTable.push(dataBallPos[i].num);
            }
        }
        if (listBallInTable.length > 0) {
            for (let j = 0; j < 16; j++) {
                if (listBallInTable.indexOf(j) == -1) {
                    listBallEat.push(j);
                }
            }
        }
        return listBallEat;
    },
    addHardNewBallEatData: function (ballEat) {
        var railChuaBiComponent = this.getRailingBagComponent();
        if (railChuaBiComponent) {
            railChuaBiComponent.checkListRailBi(ballEat);
            // railChuaBiComponent.removeAllBiInBag();
            // railChuaBiComponent.addHardListBiInRail(ballEat);
        }
    },
    resetHardNewBallEatData: function (ballEat) {
        var railChuaBiComponent = this.getRailingBagComponent();
        if (railChuaBiComponent) {
            railChuaBiComponent.removeAllBiInBag();
            railChuaBiComponent.addHardListBiInRail(ballEat);
            this.removeListBiIntable(ballEat);
        }
    },
    removeListBiIntable: function (arrBiBallEat) {
        for (var i = 0; i < this.bidaDeskNode.children.length; i++) {
            var biObj = this.bidaDeskNode.children[i];
            var biScript = biObj.getComponent("Ball");
            if (biScript) {
                var idBi = biScript.getIdBi();
                if (isNaN(parseInt(idBi)) == false) {
                    if (arrBiBallEat && Array.isArray(arrBiBallEat) && arrBiBallEat.length) {
                        if (arrBiBallEat.indexOf(idBi) != -1) {
                            if (idBi == 0) {
                                this.cue.position = cc.v2(99999, 99999);
                            }
                            biObj.removeFromParent(true);
                        }
                    }
                }
            }
        }
    },
    removeBallWithIdInTable: function (id) {
        id = parseInt(id);
        if (isNaN(id) == false) {
            for (let i = 0; i < this.bidaDeskNode.children.length; i++) {
                var biObj = this.bidaDeskNode.children[i];
                var biScript = biObj.getComponent("Ball");
                if (biScript) {
                    var idBi = biScript.getIdBi();
                    if (isNaN(parseInt(idBi)) == false) {
                        if (idBi == id) {
                            biObj.removeFromParent(true);
                            cc.log("Destroyed...");
                        }
                    }
                }
            }
        }
    },
    removeChildByNameInTable: function (name) {
        if (name) {
            for (let i = 0; i < this.bidaDeskNode.children.length; i++) {
                var biObj = this.bidaDeskNode.children[i];
                if (biObj && cc.isValid(biObj) && biObj.name == name) {
                    biObj.runAction(cc.sequence(cc.fadeOut(0.3), cc.callFunc(function () {
                        if (this && cc.isValid(this)) {
                            this.destroy();
                        }
                    }.bind(biObj))))
                }
            }
        }
    },
    taoBideBatdauTranDauData: function (data) {
        Utils.Malicious.destroyAllChildrenWithoutName(this.bidaDeskNode, "CueObj");
        for (let i = 0; i < data.length; i++) {
            // cc.log("bi nay khong ton tai tren ban choi, tao lai bi moi", dataBallsServerJson[i]);
            //bi nay hien khong thay tren ban choi => tao moi thoi
            var _data = {
                pos: cc.v2(data[i].x, data[i].y),
                id: data[i].num,
                anim_id: data[i].num,
                bg_sprite_frame: data[i].num,
                animation_sprite_frame: data[i].num,
                color_tag: BiDaConstant.COLOR_TAG.OPPONENT
            };
            this.addOneBiWithData(_data);
            var railCmp = this.getRailingBagComponent();
            if (railCmp) {
                railCmp.removeBallWithId(data[i].num);
            } else {
                // cc.log("Xu ly xoa bi trong khay loi, khong tim thay rail chua bi...");
            }
        }
    },
    resetReconnect: function (dataBallsServerJson, dataBallsClient) {
        var dataBallsClient = this.getBallsInTable();
        //1. Sắp xếp lại theo thứ tự tăng dần của viên bi [0,1,2,3,4...];
        dataBallsClient = this.getBallsInTable();
        var _tmpArrayIdBiClient = Array.isArray(dataBallsClient.arrBall) ? dataBallsClient.arrBall.sort(function (a, b) {
            return a - b
        }) : [];

        //Lọc obj đổi thành mảng chỉ số và id vị trí của server
        var _tmpArrayIdBiServer = [];
        var _tmpObjPosition = {};
        var p = dataBallsServerJson;
        for (var key = 0; key < p.length; key++) {
            _tmpArrayIdBiServer.push(p[key].num);
            var x = Number(p[key].x);
            var y = Number(p[key].y);
            if (isNaN(x) == true) x = 0;
            if (isNaN(y) == true) y = 0;
            _tmpObjPosition[p[key].num] = cc.v2(x, y);
        }
        _tmpArrayIdBiServer = Array.isArray(_tmpArrayIdBiServer) ? _tmpArrayIdBiServer.sort(function (a, b) {
            return a - b
        }) : [];
        //2. Xóa bỏ các bi không tồn tại
        if (_tmpObjPosition && Utils.Malicious.getLengthObj(_tmpObjPosition) > 0) {
            for (let m = 0; m < _tmpArrayIdBiServer.length; m++) {
                var idBi = _tmpArrayIdBiClient[m];
                var ball = this.getBallById(idBi);
                if (ball && cc.isValid(ball) && _tmpObjPosition.hasOwnProperty(idBi)) {
                    var vitriBiHienTai = ball.parent.convertToWorldSpaceAR(ball.position);
                    var vitriBiServerGui = _tmpObjPosition[idBi];
                    if (vitriBiHienTai.x == vitriBiServerGui.x && vitriBiHienTai.y == vitriBiServerGui.y) {
                        // cc.error("Greate... server gui id " + idBi + "x: " + vitriBiServerGui.x + "y: ", vitriBiServerGui.y);
                        // cc.error("Greate... vi tri client " + idBi + "x: " + vitriBiHienTai.x + "y: ", vitriBiHienTai.y);
                    } else {
                        //vị trí khác nhau mới thay đổi lại
                        ball.removeFromParent(true);
                        ball.destroy();
                        //tao data roi them vao ban choi
                        vitriBiServerGui = this.bidaDeskNode.convertToNodeSpaceAR(vitriBiServerGui);
                        var data = {
                            pos: vitriBiServerGui,
                            id: idBi,
                            anim_id: idBi,
                            bg_sprite_frame: idBi,
                            animation_sprite_frame: idBi,
                            color_tag: BiDaConstant.COLOR_TAG.OPPONENT
                        }
                        this.addOneBiWithData(data);
                        var railCmp = this.getRailingBagComponent();
                        if (railCmp) {
                            railCmp.removeBallWithId(idBi);
                        } else {
                            cc.error("Xu ly xoa bi trong khay loi, khong tim thay rail chua bi...");
                        }
                        // check trường hợp reconnect lại mà render lại bóng thì show message thông báo cho nó biết
                        var billardsGameTableController = this.getBillardController();
                        if (billardsGameTableController && billardsGameTableController.isReconnectRenderBall == true) {
                            cc.Global.showMessage(i18n.t("message_reconnect_render_ball"));
                            billardsGameTableController.isReconnectRenderBall = false;
                        }
                    }
                }
            }
            for (let i = 0; i < this.bidaDeskNode.children.length; i++) {
                var ball = this.bidaDeskNode.children[i];
                if (ball && cc.isValid(ball)) {
                    var ballcpn = ball.getComponent("Ball");
                    if (ballcpn) {
                        var idBi = Number(ballcpn.getIdBi());
                        if (_tmpArrayIdBiServer.indexOf(Number(idBi)) == -1) {
                            ball.removeFromParent(true);
                            ball.destroy();
                        }
                    }
                }
            }
            //phải xem xét xem bi trên bàn nếu không có con nào như server gửi thì phải tạo một con cho nó
            for (let j = 0; j < _tmpArrayIdBiServer.length; j++) {
                if (_tmpArrayIdBiClient.indexOf(_tmpArrayIdBiServer[j]) == -1) {
                    var idBi = _tmpArrayIdBiServer[j];
                    //tạo một bi mới
                    var data = {
                        pos: this.bidaDeskNode.convertToNodeSpaceAR(_tmpObjPosition[idBi]),
                        id: idBi,
                        anim_id: idBi,
                        bg_sprite_frame: idBi,
                        animation_sprite_frame: idBi,
                        color_tag: BiDaConstant.COLOR_TAG.OPPONENT
                    };
                    this.addOneBiWithData(data);
                    var railCmp = this.getRailingBagComponent();
                    if (railCmp) {
                        railCmp.removeBallWithId(idBi);
                    } else {
                        cc.error("Xu ly xoa bi trong khay loi, khong tim thay rail chua bi...");
                    }
                } else {

                }
            }
            //tao cue tren ban choi thoi nao hehe
            // cc.log("Loi nghiem trong, phai reset lai ban choi, ...");
            if (_tmpArrayIdBiServer.indexOf(0) != -1) {
                //phaỉ có bi trắng mới tạo cue chứ
                this.taoCueTrenBanChoi();
            }
            this.blockTouchEvent();
            this.resetUICue();
        }
    },
    reRenderBallPosition: function (dataBallsServerJson, dataBallsClient, listBiAn) {
        //1. Sắp xếp lại theo thứ tự tăng dần của viên bi [0,1,2,3,4...];
        dataBallsClient = this.getBallsInTable();
        var _tmpArrayIdBiClient = Array.isArray(dataBallsClient.arrBall) ? dataBallsClient.arrBall.sort(function (a, b) {
            return a - b
        }) : [];

        //Lọc obj đổi thành mảng chỉ số và id vị trí của server
        var _tmpArrayIdBiServer = [];
        var _tmpObjPosition = {};
        var p = dataBallsServerJson;
        for (var key = 0; key < p.length; key++) {
            _tmpArrayIdBiServer.push(p[key].num);
            var x = Number(p[key].x);
            var y = Number(p[key].y);
            if (isNaN(x) == true) x = 0;
            if (isNaN(y) == true) y = 0;
            _tmpObjPosition[p[key].num] = cc.v2(x, y);
        }
        _tmpArrayIdBiServer = Array.isArray(_tmpArrayIdBiServer) ? _tmpArrayIdBiServer.sort(function (a, b) {
            return a - b
        }) : [];
        //2. Xóa bỏ các bi không tồn tại
        if (_tmpObjPosition && Utils.Malicious.getLengthObj(_tmpObjPosition) > 0) {
            for (let m = 0; m < _tmpArrayIdBiServer.length; m++) {
                var idBi = _tmpArrayIdBiClient[m];
                var ball = this.getBallById(idBi);
                if (ball && cc.isValid(ball) && _tmpObjPosition.hasOwnProperty(idBi)) {
                    var vitriBiHienTai = ball.parent.convertToWorldSpaceAR(ball.position);
                    var vitriBiServerGui = _tmpObjPosition[idBi];
                    if (vitriBiHienTai.x == vitriBiServerGui.x && vitriBiHienTai.y == vitriBiServerGui.y) {
                        // cc.error("Greate... server gui id " + idBi + "x: " + vitriBiServerGui.x + "y: ", vitriBiServerGui.y);
                        // cc.error("Greate... vi tri client " + idBi + "x: " + vitriBiHienTai.x + "y: ", vitriBiHienTai.y);
                    } else {
                        //vị trí khác nhau mới thay đổi lại
                        ball.removeFromParent(true);
                        ball.destroy();
                        //tao data roi them vao ban choi
                        vitriBiServerGui = this.bidaDeskNode.convertToNodeSpaceAR(vitriBiServerGui);
                        var data = {
                            pos: vitriBiServerGui,
                            id: idBi,
                            anim_id: idBi,
                            bg_sprite_frame: idBi,
                            animation_sprite_frame: idBi,
                            color_tag: BiDaConstant.COLOR_TAG.OPPONENT
                        }
                        this.addOneBiWithData(data);
                        var railCmp = this.getRailingBagComponent();
                        if (railCmp) {
                            railCmp.removeBallWithId(idBi);
                        } else {
                            cc.error("Xu ly xoa bi trong khay loi, khong tim thay rail chua bi...");
                        }
                        // check trường hợp reconnect lại mà render lại bóng thì show message thông báo cho nó biết
                        var billardsGameTableController = this.getBillardController();
                        if (billardsGameTableController && billardsGameTableController.isReconnectRenderBall == true) {
                            cc.Global.showMessage(i18n.t("message_reconnect_render_ball"));
                            billardsGameTableController.isReconnectRenderBall = false;
                        }
                    }
                }
            }
            for (let i = 0; i < this.bidaDeskNode.children.length; i++) {
                var ball = this.bidaDeskNode.children[i];
                if (ball && cc.isValid(ball)) {
                    var ballcpn = ball.getComponent("Ball");
                    if (ballcpn) {
                        var idBi = Number(ballcpn.getIdBi());
                        if (_tmpArrayIdBiServer.indexOf(Number(idBi)) == -1) {
                            ball.removeFromParent(true);
                            ball.destroy();
                        }
                    }
                }
            }
            //phải xem xét xem bi trên bàn nếu không có con nào như server gửi thì phải tạo một con cho nó
            for (let j = 0; j < _tmpArrayIdBiServer.length; j++) {
                if (_tmpArrayIdBiClient.indexOf(_tmpArrayIdBiServer[j]) == -1) {
                    var idBi = _tmpArrayIdBiServer[j];
                    //tạo một bi mới
                    var data = {
                        pos: this.bidaDeskNode.convertToNodeSpaceAR(_tmpObjPosition[idBi]),
                        id: idBi,
                        anim_id: idBi,
                        bg_sprite_frame: idBi,
                        animation_sprite_frame: idBi,
                        color_tag: BiDaConstant.COLOR_TAG.OPPONENT
                    };
                    this.addOneBiWithData(data);
                    var railCmp = this.getRailingBagComponent();
                    if (railCmp) {
                        railCmp.removeBallWithId(idBi);
                    } else {
                        cc.error("Xu ly xoa bi trong khay loi, khong tim thay rail chua bi...");
                    }
                } else {

                }
            }
            //tao cue tren ban choi thoi nao hehe
            // cc.log("Loi nghiem trong, phai reset lai ban choi, ...");
            if (_tmpArrayIdBiServer.indexOf(0) != -1) {
                //phaỉ có bi trắng mới tạo cue chứ
                this.taoCueTrenBanChoi();
            }
            //thêm bi vào lỗ cả bàn có 15 con nếu con nào không có trong bàn chơi nghĩa là con đấy rơi lỗ rồi
            var tatCaBiTrenBanChoiObj = this.getBallsInTable();
            var _cacBiTrongLo = [];
            if (listBiAn && listBiAn != "" && Utils.Malicious.isJsonString(listBiAn)) {
                _cacBiTrongLo = JSON.parse(listBiAn);
            } else {
                _tmpArrayIdBiClient = Array.isArray(tatCaBiTrenBanChoiObj.arrBall) ? tatCaBiTrenBanChoiObj.arrBall.sort(function (a, b) {
                    return a - b
                }) : [];
                for (let k = 0; k < 15; k++) {
                    if (_tmpArrayIdBiClient.indexOf(k) == -1) {
                        _cacBiTrongLo.push(k);
                    }
                }
            }

            this.addHardNewBallEatData(_cacBiTrongLo);
            if (this.getPlayerIdLuotDanh() == Number(Linker.userData.userId)) {
                this.myListBallOnHand = this.myUserInfo.getComponent("BillardUserView").player_list_ball_tren_tay;
                if (this.myListBallOnHand && Array.isArray(this.myListBallOnHand)) {
                    if (this.myListBallOnHand.length < 7 && Linker.ZONE != BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
                        // this.myListBallOnHand = [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15];
                        this.myListBallOnHand = Utils.Malicious.createDefaultMyBallArr();
                        for (let i = 0; i < this.bidaDeskNode.children.length; i++) {
                            var ball = this.bidaDeskNode.children[i];
                            var ballcpn = ball.getComponent("Ball");
                            if (ballcpn) {
                                var idBi = ballcpn.getIdBi();
                                idBi = parseInt(idBi);
                                if (isNaN(idBi) == false) {
                                    if (idBi == 8 || idBi == 0) {
                                        ballcpn.setColorTag(BiDaConstant.COLOR_TAG.OPPONENT);
                                    } else {
                                        ballcpn.setColorTag(BiDaConstant.COLOR_TAG.ME);
                                    }
                                }
                            }
                        }
                    } else if (this.myListBallOnHand.length >= 7) {
                        this.setColorTagByIdID(BiDaConstant.COLOR_TAG.ME, this.myListBallOnHand);
                    }
                }
                this.stopAllTipAnimation();
                this.runTipAnimation();
                this.unBlockTouchEvent();
            } else {
                this.blockTouchEvent();
            }
            this.resetUICue();
        }
    },
    initListBiAn: function (message) {
        //set ball tip
        var BillardsGameTableController = this.getBillardController();
        if (message && BillardsGameTableController) {
            message.players = (message.players) ? message.players : message.listPlayer;
            if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
                if (message.hasOwnProperty("players")) {
                    for (let i = 0; i < message.players.length; i++) {
                        var player = message.players[i];
                        var listBallOnHand = BillardsGameTableController.addListBiCanAn(player);

                        player.id = (player.id) ? player.id : player.userId;
                        if (Number(player.id) == Number(BillardsGameTableController.myUserId)) {
                            this.showBallListDisplay(listBallOnHand, BiDaConstant.PSEUDO_CONST.KIEU_BI_CUA_MINH, false, false);
                            this.stopAllTipAnimation();
                            this.showAllMyBallistDisplay(listBallOnHand, this.myBallistDisplay);
                            this.setColorTagByIdID(BiDaConstant.COLOR_TAG.ME, listBallOnHand);
                            this.runTipAnimation();

                        } else {
                            this.stopAllTipAnimation();
                            this.showBallListDisplay(listBallOnHand, BiDaConstant.PSEUDO_CONST.KIEU_BI_CUA_DOI_THU, false, false);
                            this.showAllMyBallistDisplay(listBallOnHand, this.otherBallistDisplay);
                        }
                    }
                }
            } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
                if (message.myInfo) {
                    var listBallOnHand = BillardsGameTableController.addListBiCanAn(message.myInfo);
                    this.setColorBallTag({
                        players: [message.myInfo]
                    });
                    this.showBallListDisplay(listBallOnHand, BiDaConstant.PSEUDO_CONST.KIEU_BI_CUA_MINH, false, false);
                    this.setColorTagByIdID(BiDaConstant.COLOR_TAG.ME, listBallOnHand);
                    this.stopAllTipAnimation();
                    this.showAllMyBallistDisplay(listBallOnHand, this.myBallistDisplay);
                    this.runTipAnimation();
                }

            } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
                var listUsers = Utils.Malicious.flattern([
                    [this.myUserInfo], this.rankingUserInfo
                ]);
                if (message.myInfo) {
                    for (let i = 0; i < listUsers.length; i++) {
                        var userInfoView = listUsers[i].getComponent("BillardUserView");
                        if (userInfoView) {
                            var _data = {
                                isMyCard: false,
                                _isViewIng: true,
                                cards: message.myInfo.player_list_ball_tren_tay
                            };
                            if (userInfoView.getUserID() != 0) {
                                if (userInfoView.getUserID() == Linker.userData.userId && listUsers[i] == this.myUserInfo) {
                                    _data.isMyCard = true;
                                    userInfoView.changeCardSprite(_data);
                                    var myCardHint = [];
                                    var _hintFail = 7 - message.myInfo.player_list_ball_tren_tay.length;
                                    for (let j = 0; j < _hintFail; j++) {
                                        myCardHint.push(-1);
                                    }
                                    var _tmpHint = Utils.Malicious.flattern([myCardHint, message.myInfo.player_list_ball_tren_tay]);
                                    if (_tmpHint) {
                                        this.showBallListDisplay(_tmpHint, BiDaConstant.PSEUDO_CONST.KIEU_BI_CUA_MINH, false, false);
                                        this.myListBallOnHand = message.myInfo.player_list_ball_tren_tay;
                                        this.checkRunTipAnimation(true);
                                        this.runTipAnimation();
                                    }
                                } else {
                                    userInfoView.changeCardSprite(_data);
                                }
                            }
                        }
                    }
                }
                this.stopAllTipAnimation();
                this.runTipAnimation();
            }
        }
    },
    getArrayBiBatDau: function (data) {
        if (data) {
            var _tmpPos = [];
            for (var i = 0; i < data.length; i++) {
                _tmpPos.push(data[i].num);
            }
            return _tmpPos;
        }
        var _positionArray = this.createShuffleArray(1, 15);
        _positionArray = this.shuffleArray(_positionArray);
        return _positionArray;
    },
    getArrayAngleBiBatDau: function (data) {
        if (data) {
            var _tmpAngle = [];
            for (var i = 0; i < data.length; i++) {
                var x = parseFloat(data[i].x);
                var y = parseFloat(data[i].y);
                var z = parseFloat(data[i].z);
                // cc.error("goc nhan duoc x: " + x + ", y: " + y + ", z: " + z);
                if (isNaN(x) == true) x = 0;
                if (isNaN(y) == true) y = 0;
                if (isNaN(z) == true) z = 0;
                _tmpAngle.push(cc.v3(x, y, z));
            }
            return _tmpAngle;
        }
        var _tmpRandomAngle = [];
        for (var j = 0; j < 16; j++) {
            _tmpRandomAngle.push(cc.v3(Utils.Number.random(0, 180), Utils.Number.random(0, 180), Utils.Number.random(0, 180)));
        }
        return _tmpRandomAngle;
    },
    createBallData: function (positions) {
        //tao tat ca 16 bi
        this.tongSoBiTrenBan = 16;
        //random vi tri bi
        var _positionArray = [];
        var _positionArrayAngle = [];
        if (positions && Utils.Malicious.isJsonString(positions)) {
            // [{num: 4, x: "43", y: "159", z: "81"}]
            var _data = JSON.parse(positions);
            _positionArray = this.getArrayBiBatDau(_data);
            _positionArrayAngle = this.getArrayAngleBiBatDau(_data);

        } else {
            _positionArray = this.createShuffleArray(1, 15);
            _positionArray = this.shuffleArray(_positionArray);
            _positionArrayAngle = this.getArrayAngleBiBatDau();
        }
        _positionArray.unshift(0);
        var biData = [];
        for (var i = 0; i < _positionArray.length; i++) {
            var data = {
                pos: cc.v2(0, 0),
                id: _positionArray[i],
                ball3dAngle: ((_positionArrayAngle.length > 0) && _positionArray[i] != 0) ? _positionArrayAngle.splice(0, 1)[0] : cc.v3(36, 18, 45)
            }
            biData.push(data);
        }
        return biData;
    },
    resetForces: function () {
        var ball;
        for (let i = 0; i < this.bidaDeskNode.children.length; i++) {
            ball = this.bidaDeskNode.children[i];
            var ballRigidBody = ball.getComponent(cc.RigidBody);
            if (ballRigidBody) {
                ballRigidBody.linearVelocity = cc.v2(0, 0);
                ballRigidBody.angularVelocity = 0;
                ball.angle = ball.angle;
            }
        }
    },
    setNextTurn: function (message) {
        var nextTurnData = {
            BillardsGameTable: this,
            message: message
        }
        if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
            Bida11GameTable.setNextTurn(nextTurnData);
        } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
            Bida14GameTable.setNextTurn(nextTurnData);
        } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
            BidaPhomGameTable.setNextTurn(nextTurnData);
        }
    },
    showTimeCountDownBallError: function (time) {
        var SliderView = this.panelSlideView.getComponent("SliderView");
        if (SliderView) {
            SliderView.showErrorBallIdWithTime(time);
        }
    },
    taoLaiBiTrenBanDataChuan: function (dataVitriBan) {
        if (dataVitriBan && Utils.Malicious.isJsonString(dataVitriBan)) {
            var _positions = JSON.parse(dataVitriBan);
            if (_positions && Array.isArray(_positions) && _positions.length > 0) {
                for (let i = 0; i < _positions.length; i++) {
                    var idBi = _positions[i].num;
                    var ball = this.getBallById(idBi);
                    if (ball) {
                        var ballcpn = ball.getComponent("Ball");
                        if (ballcpn) {
                            var ball3dAngle = ballcpn.ball3DNode.eulerAngles;
                            ball.removeFromParent(true);
                            ball.destroy();
                            var data = {
                                pos: this.bidaDeskNode.convertToNodeSpaceAR(cc.v2(_positions[i].x, _positions[i].y)),
                                id: idBi,
                                anim_id: idBi,
                                bg_sprite_frame: idBi,
                                animation_sprite_frame: idBi,
                                ball3dAngle: ball3dAngle,
                                color_tag: BiDaConstant.COLOR_TAG.OPPONENT
                            }
                            this.addOneBiWithData(data);
                        }

                    }
                }
            }
        }
    },
    getDataToSendServer: function (isCheck) {
        var ballEatObj = this.getBallsInHole();

        // ballEatObj = Utils.Malicious.roundPositionFloat(ballEatObj, 2);//return position cc.v2(.xx, .xx)
        var ballEatArr = (isCheck) ? this.id_ball_lose_global : this.id_ball_lose;
        var ballEatList = this.getBallsLose(isCheck);
        var ballTableListArr = ballEatObj.listBallTableArray;
        var ballTableListJson = ballEatObj.listBallTableJson;
        //tao lai toa do chinh xac
        // this.taoLaiBiTrenBanDataChuan(ballTableListJson);
        if (Array.isArray(ballEatArr) && ballEatArr.length > 0 && ballEatArr.indexOf("#0") !== -1) {
            // nếu bi cái nằm trong list bi ăn thì cũng bị lỗi
            if (isCheck) {
                this._isBallHit_global = BiDaConstant.GAME.STATUS.BALL_ERROR.BI_MUC_TIEU_KHONG_CHAM_BAT_CU_BI_NAO_CA;
            } else {
                this._isBallHit = BiDaConstant.GAME.STATUS.BALL_ERROR.BI_MUC_TIEU_KHONG_CHAM_BAT_CU_BI_NAO_CA;
            }
        }
        var data = {
            cueStatus: BiDaConstant.TABLE_STATUS.SETTING_RESULT_TURN, //trạng thái update ket qua
            ballX: (ballEatArr.indexOf("#0") != -1 || ballEatArr.indexOf(0) != -1) ? 99999 : (this.whiteBall && this.whiteBall.isValid) ? this.whiteBall.position.x : 99999,
            ballY: (ballEatArr.indexOf("#0") != -1 || ballEatArr.indexOf(0) != -1) ? 99999 : (this.whiteBall && this.whiteBall.isValid) ? this.whiteBall.position.y : 99999,
            cueR: Utils.Type.isNumber(-this.cue.angle) ? -this.cue.angle : 0,
            // ballEat: (ballEatArr.length > 0) ? ballEatList : "#",
            ballEat: (ballEatArr.length > 0) ? ballEatList : "#",
            ballList: (ballTableListArr.length > 0) ? ballTableListJson : "#",
            ballHit: (isCheck) ? this._isBallHit_global : this._isBallHit,
        };

        if (isCheck) {
            data.cueR = BiDaConstant.TABLE_STATUS.SETTING_RESULT_TURN_BOT;
            var r = this.predictRotation();
            data.ballTargetRotation = ((Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) && (isNaN(parseFloat(r)) == false)) ? r : 0;
            this._isCheckPredict = false;
        }
        return data;
    },
    getAnglepointToTarget: function (p1, p2) {
        if (p1 && p2) {
            var rotateX = -(p2.x - p1.x);
            var rotateY = -(p2.y - p1.y);
            var rotate = Math.atan(rotateY / rotateX) * 180 / Math.PI;
            if (rotateX >= 0 && rotateY >= 0) {
                rotate = 180 - rotate
            } else if (rotateX <= 0 && rotateY <= 0) {
                rotate = 360 - rotate
            } else if (rotateX <= 0 && rotateY >= 0) {
                rotate = Math.abs(rotate)
            } else if (rotateX >= 0 && rotateY <= 0) {
                rotate = 180 + Math.abs(rotate);
            }
            return -rotate; //return angle
        }
        return null;
    },
    getBiMucTieuCuaDoiThu: function () {
        if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
            var listUsers = Utils.Malicious.flattern([
                [this.myUserInfo], this.rankingUserInfo
            ]);
            if (listUsers && Array.isArray(listUsers) && listUsers.length > 0) {
                for (let i = 0; i < listUsers.length; i++) {
                    var userInfoView = listUsers[i].getComponent("BillardUserView");
                    if (userInfoView) {
                        var id = parseInt(userInfoView.getUserID());
                        if (id != 0 && userInfoView.getBotType()) {
                            return userInfoView.getCardTarget();
                        }
                    }
                }
            }
        }
        return null;
    },
    getBiMucTieuById: function (id) {
        if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
            var listUsers = Utils.Malicious.flattern([
                [this.myUserInfo], this.rankingUserInfo
            ]);
            if (listUsers && Array.isArray(listUsers) && listUsers.length > 0) {
                for (let i = 0; i < listUsers.length; i++) {
                    var userInfoView = listUsers[i].getComponent("BillardUserView");
                    if (userInfoView) {
                        var curentId = parseInt(userInfoView.getUserID());
                        if (curentId != 0 && curentId == id) {
                            return {
                                cardNumber: userInfoView.getCardTarget(),
                                cardContainer: userInfoView.listCardContainer,
                                userInfoView: userInfoView
                            };
                        }
                    }
                }
            }
        }
        return null;
    },
    predictRotation: function (data) {
        if (!Linker.BiDaOfflineController) {
            //1.Chức năng dành cho bot bida phỏm
            var biMucTieu;
            var biTrang;
            this._isCheckPredict = true;
            //2. Bida 1 lá nên lấy phần tử 0
            var id = this.getBiMucTieuCuaDoiThu();
            if (data && data.idBi) {
                id = data.idBi;
            }
            if (id) {
                biMucTieu = this.getBallById(id);
                biTrang = this.getBallById(0);
                if (biMucTieu && cc.isValid(biMucTieu) && biTrang && cc.isValid(biTrang)) {
                    // Lấy tọa độ 6 lỗ trên bàn chơi
                    // 6 colider raychua bi
                    var p1 = this.bidaDeskNode.convertToWorldSpaceAR(biTrang.position);
                    var p2 = this.bidaDeskNode.convertToWorldSpaceAR(biMucTieu.position);
                    var initAngle = this.getAnglepointToTarget(p1, p2);
                    cc.log("ID bi muc tieu cua bot " + id);
                    cc.log("Angle tinh toan " + initAngle);
                    // Đang check phần này, tạm thời off test check.

                    // if ( initAngle) {
                    //     this.cue.opacity = 255;
                    //     this.cue.position = biTrang.position;
                    //     //goc chi den lo gan nhat
                    //     var _sixHoleInTable = this.bidaDeskNode.getComponents(cc.PhysicsCircleCollider);
                    //     //set box collider in table
                    //     var cueObjComponent = this.cue.getComponent("CueObj");
                    //     if (cueObjComponent && cc.isValid(cueObjComponent)) {
                    //         if (_sixHoleInTable && Array.isArray(_sixHoleInTable) && _sixHoleInTable.length > 0) {
                    //             var stepRotation = 0.015;
                    //             this.cue.angle = initAngle;
                    //             var limitAngleBelow = Utils.Malicious.toPositiveAngle(-this.getAnglepointToTarget(p1, cc.v2(p2.x, p2.y - this.kichThuocVienBi * 1.5)));
                    //             var limitAngleTop = Utils.Malicious.toPositiveAngle(-this.getAnglepointToTarget(p1, cc.v2(p2.x, p2.y + this.kichThuocVienBi * 1.5)));
                    //             for (let i = limitAngleBelow; i <= limitAngleTop; i += stepRotation) {
                    //                 //pending
                    //             }
                    //         }
                    //     }
                    // }
                    return Utils.Malicious.toPositiveAngle(-initAngle);
                }
            }
        }
        return 0;
    },
    getAngleToHitBallInHole: function () {

        return null;
    },
    startTimerCounter: function (idturnhientai, timeLeftTurn) {
        var timerData = {
            BillardsGameTable: this,
            idturnhientai: idturnhientai
        }
        if (isNaN(timeLeftTurn) == false && timeLeftTurn > 0) {
            timerData.timeLeftTurn = timeLeftTurn;
        }
        if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
            Bida11GameTable.startTimerCounter(timerData);
        } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
            Bida14GameTable.startTimerCounter(timerData);
        } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
            BidaPhomGameTable.startTimerCounter(timerData);
        }
    },
    getBallsLose: function (isCheck) {
        var tmp = "";
        var ballEatArr = isCheck ? this.id_ball_lose_global : this.id_ball_lose;
        for (let i = 0; i < ballEatArr.length; i++) {
            tmp += ballEatArr[i];
        }
        return tmp;
    },
    resetUICue: function () {
        this.cue.active = true;
        this.showCueUI();
        this.cue.position = (this.whiteBall && this.whiteBall.isValid) ? this.whiteBall.position : cc.v2(99999, 99999);
        // this.cue.rotation = Utils.Malicious.changeAngleTo0to360(this.node.rotation);
        this.panelPower.active = true;
        if (this.whiteball && cc.isValid(this.whiteball)) {
            this.cue.position = this.whiteball.position;
            var deskNode = this.bidaDeskNode;
            var p = deskNode.convertToWorldSpaceAR(this.cue.position);
            var wlocation = Utils.Malicious.getApointWhenKnowAngleAndRadius(p, this.cue.angle, deskNode.width * 2);
            this.setCuePosByTouch(wlocation, false, false, false);
        }

    },
    setMucCuoc: function (betMoney) {
        this.betMoneyNode.getComponent(cc.Label).string = betMoney;
        cc.Global.setColorMoney(this.betMoneyNode);
    },
    setMoneyIconFrame: function () {
        var spriteFrame = this.listMoneyIcon[0];
        if (cc.Global.bidaMoneyType == 1) {
            spriteFrame = this.listMoneyIcon[1];
        }
        this.moneyIcon.getComponent(cc.Sprite).spriteFrame = spriteFrame;
    },
    setTableId: function (tableid) {
        this.tableIDNode.getComponent(cc.Label).string = tableid;
    },
    setBidaCommonBackground: function (type) {
        type = parseInt(type);
        if ((isNaN(type) == false && type == 0) || !type) {
            this.bidaCommonBackground.active = false;
        } else if (isNaN(type) == false && type != 0) {
            this.bidaCommonBackground.active = true;
        }
        let texture = this.bidaBgTexture2D[0];
        if (type >= 0 && type <= this.bidaBgTexture2D.length - 1) {
            texture = this.bidaBgTexture2D[type];
        }
        let spframe = new cc.SpriteFrame();
        spframe.setTexture(texture);
        this.bidaCommonBackground.getComponent(cc.Sprite).spriteFrame = spframe;

    },
    getWhiteBallRepos: function () {
        for (let i = 0; i < this.bidaDeskNode.children.length; i++) {
            var c = this.bidaDeskNode.children[i];
            var ccomp = c.getComponent("WBallPos");
            if (ccomp && ccomp.isValid) {
                return c;
            } else if (ccomp && ccomp.isValid == false) {
                c.removeFromParent(true);
            }
        }
        return null;
    },
    removeWhiteBallRepos: function () {
        for (let i = 0; i < this.bidaDeskNode.children.length; i++) {
            var c = this.bidaDeskNode.children[i];
            if (c.getComponent("WBallPos")) {
                c.removeFromParent(true);
            }
        }
    },
    checkCueValid: function () {
        var ballsInTable = this.getBallsInTable().arrBall;
        if (ballsInTable.length > 0 && ballsInTable.indexOf(0) == -1) {
            return false;
        }
        return true;
    },
    datLaiViTriBiTrang: function (data) {
        var BillardsGameTableController = this.getBillardController();
        if (BillardsGameTableController) {
            this.cue.position = cc.v2(99999, 99999);
            this.cue.opacity = 0;
            this.removeBallWithIdInTable(0);
            //test them bi trang vi tri =)
            this.removeWhiteBallRepos();
            if (Linker.ZONE !== BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
                var biTrangPosObj = cc.instantiate(this.WBallPosPrefab);
                this.bidaDeskNode.addChild(biTrangPosObj);
                biTrangPosObj.active = true;
                var tatCaViTriBiHienTai = this.getTatCaViTriBiHienTai();
                if (tatCaViTriBiHienTai) {
                    var minX = (this.kichThuocVienBi * 0.5) + (145 / 2.5) + this.kichThuocVienBi * 0.6;
                    var maxX = (this.bidaDeskNode.width - (this.kichThuocVienBi * 0.5) - (145 / 2.5)) - this.kichThuocVienBi * 0.6;
                    var minY = (this.kichThuocVienBi * 0.5) + (145 / 2.5) + this.kichThuocVienBi * 0.6;
                    var maxY = (this.bidaDeskNode.height - (this.kichThuocVienBi * 0.5) - (145 / 2.5)) - this.kichThuocVienBi * 0.6;

                    var position = this.findRandomPositionForWBall({
                        xmin: minX,
                        xmax: maxX,
                        ymin: minY,
                        ymax: maxY,
                        positions: tatCaViTriBiHienTai
                    });

                    var dataPickWBall = {
                        position: position,
                        allposcurrentinvalid: tatCaViTriBiHienTai,
                        bounder: {
                            x: {
                                start: minX,
                                end: maxX
                            },
                            y: {
                                start: minY,
                                end: maxY
                            }
                        },
                        name: "tmpWhiteBall"
                    };
                    if (data && data.isBegin) {
                        dataPickWBall.isBegin = data.isBegin;
                        dataPickWBall.bounder._xBegin = {
                            start: data._xBegin.minX,
                            end: data._xBegin.maxX,
                        }
                        dataPickWBall.bounder._yBegin = {
                            start: data._yBegin.minY,
                            end: data._yBegin.maxY,
                        }

                        dataPickWBall.position = position;
                        dataPickWBall.boxCollider = data.boxCollider;
                        dataPickWBall.bidaTableComponent = data.bidaTableComponent;

                    }
                    var WBallPos = biTrangPosObj.getComponent("WBallPos");
                    if (WBallPos) {
                        var blocked = false;
                        if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
                            if (this.checkTurnValid() == true) {
                                blocked = false;
                            } else {
                                blocked = true;
                            }

                        }
                        dataPickWBall.blocked = blocked;
                        dataPickWBall.bidaTableComponent = this;
                        //find position
                        var currentPoint = {
                            position: this.bidaDeskNode.convertToWorldSpaceAR(this.vitriBiTrang),
                            radius: 13
                        };
                        var ballPositions = []; //[{p,r}]
                        if (tatCaViTriBiHienTai) {
                            for (let i = 0; i < tatCaViTriBiHienTai.length; i++) {
                                var posObj = {
                                    radius: 13,
                                    position: cc.v2(0, 0)
                                }
                                posObj.position = this.bidaDeskNode.convertToWorldSpaceAR(tatCaViTriBiHienTai[i].pos);
                                ballPositions.push(posObj);
                            }
                        }
                        dataPickWBall.position = this.bidaDeskNode.convertToNodeSpaceAR(Utils.Malicious.findNewPositionAroundPoint(currentPoint, ballPositions));
                        WBallPos.initWBall(dataPickWBall);
                    } else {
                        //cc.log("Co loi xay ra, script khong hop le ...");
                    }
                } else {
                    //khong tim thay bi nao thi luot choi nay khong hop le roi
                    //cc.log("Co loi xay ra, luot choi nay khong hop le ...");
                }
            } else {
                var BillardsGameTableController = this.getBillardController();
                BillardsGameTableController.onYeuCauDatLaiBiCai();
            }
        }
    },
    getTatCaViTriBiHienTai: function () {
        var pos = [];
        for (let i = 0; i < this.bidaDeskNode.children.length; i++) {
            var biObj = this.bidaDeskNode.children[i];
            var biScript = biObj.getComponent("Ball");
            if (biScript) {
                var idBi = biScript.getIdBi();
                if (isNaN(parseInt(idBi)) == false) {
                    var position = biObj.position;
                    pos.push({
                        pos: position,
                        width: biObj.width,
                        height: biObj.height,
                        id: idBi,
                        rotation: -biObj.angle
                    });
                }

            }
        }
        return pos;
    },
    findRandomPositionForWBall: function (data) {
        var posX = 0;
        var posY = 0;
        do {
            posX = this.findPosition(data.xmin, data.xmax);
            posY = this.findPosition(data.ymin, data.ymax);
        }
        while (this.checkValidPosWhiteBall(data.positions, cc.v2(posX, posY)) == false);
        return cc.v2(posX, posY);
    },
    checkValidPosWhiteBall: function (positions, pos) {
        var valid = true;
        for (var i = 0; i < positions.length; i++) {
            var width = positions[i].width;
            var height = positions[i].height;
            var rectA = new cc.Rect(positions[i].pos.x - (width * 0.5), positions[i].pos.y - (height * 0.5), width, height);
            var rectB = new cc.Rect(pos.x - (width * 0.5), pos.y - (height * 0.5), width, height);
            if (rectA.intersects(rectB)) {
                valid = false;
            }
        }
        return valid;
    },
    findPosition: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    addCofferEffect: function (money) {
        var nohuEffect = cc.find("Canvas/NoHuGameBaiEffectLayer");
        if (!nohuEffect) {
            nohuEffect = cc.instantiate(this.cofferEffect);
            nohuEffect.zIndex = cc.macro.MAX_ZINDEX - 1;
            cc.find("Canvas").addChild(nohuEffect);
        }
        nohuEffect.active = true;
        nohuEffect.position = cc.v2(0, 0);
        var nohueffects = nohuEffect.getComponent("NoHuGameBaiEffectLayer");
        //nohueffects.setUserName("player.viewName");
        nohueffects.setMoneyBonus(money);
        nohueffects.runAnimation();
    },

    setUserIdOffline(id) {
        this.myUserId = id;
    },
    setMoneyLabel: function (message) {
        var playerData = {
            players: message,
            BillardsGameTable: this
        }
        if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
            Bida11GameTable.setMoneyLabel(playerData);
        } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
            Bida14GameTable.setMoneyLabel(playerData);
        } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
            BidaPhomGameTable.setMoneyLabel(playerData);
        }
    },
    setCountDownTimeLeft: function (time) {
        var timeNode = this.panelUserScript.leftTime;
        if (time > 0 && timeNode) {
            timeNode.stopAllActions();
            var _this = this;
            timeNode.runAction(cc.sequence(cc.callFunc(function () {
                var actionCount = cc.repeatForever(cc.sequence(cc.callFunc(function () {
                    if (time > 0) {
                        time -= 1000; //1second
                        var timeStr = cc.Global.getCountTimeStringByMillis(time);
                        timeNode.getComponent(cc.Label).string = i18n.t("title_time") + timeStr;
                    } else {
                        this.stopActionByTag(1);
                        timeNode.getComponent(cc.Label).string = i18n.t("title_left_time");
                    }
                }.bind(this)), cc.delayTime(1)));
                actionCount.setTag(1);
                this.runAction(actionCount);
            }.bind(timeNode))));
        }
    },
    resortPositionPlayersRanking: function () {
        var resetPositionPlayer = {
            BillardsGameTable: this
        }
        if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
            Bida14GameTable.resortPositionPlayersRanking(resetPositionPlayer);
        } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
            BidaPhomGameTable.resortPositionPlayersRanking(resetPositionPlayer);
        } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
            Bida11GameTable.resortPositionPlayersRanking(resetPositionPlayer);
        }
    },
    initCountDownTimeLeft: function () {
        var BillardsGameTableController = this.getBillardController();
        var leftTime = this.panelUserScript.leftTime;
        !!leftTime && leftTime.stopAllActions();
        if (BillardsGameTableController.playTime > 0) {
            var timeStr = cc.Global.getCountTimeStringByMillis(BillardsGameTableController.playTime);
            leftTime.getComponent(cc.Label).string = i18n.t("title_time") + timeStr;
        }
    },
    setErrorNumber: function (players) {
        var errorNumber = {
            players: players,
            BillardsGameTable: this
        }
        if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
            Bida11GameTable.setErrorNumber(errorNumber);
        } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
            Bida14GameTable.setErrorNumber(errorNumber);
        } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
            BidaPhomGameTable.setErrorNumber(errorNumber);
        }
    },

    /** set total errors acceptable in this match
     * @param {Integer} number number of errors are accepted in this match
     */
    setMaxError: function (number) {
        var maxErrorNode = this.panelUserScript.maxErrorNode;
        if (maxErrorNode) {
            //fix loi NaN max error.
            number = parseInt(number);
            if (isNaN(number) == true) {
                number = 0;
            }
            maxErrorNode.getComponent(cc.Label).string = i18n.t("title_error_label") + ": " + number;
        }
    },
    /** set blur on user view tab
     * @param {Boolean} isMyTurn if true, blur on my user view is disabled and blur on other user view is enabled.
     * if false, blur on my user view is enabled and blur on other user view is enabled.
     * if null, blur on both user view is disabled
     */
    setTurnBlur(isMyTurn) {
        if (isMyTurn == null) {
            this.myUserInfo.getComponent("BillardUserView").turnBlur.active = false;
            this.otherUserInfo.getComponent("BillardUserView").turnBlur.active = false;
            return;
        }
        if (isMyTurn) {
            NewAudioManager.PlayUrl(Linker.gameLanguage == "vi" ? NewAudioManager.SOUND.VI.MY_TURN : NewAudioManager.SOUND.EN.MY_TURN);
        }
        this.myUserInfo.getComponent("BillardUserView").turnBlur.active = !isMyTurn;
        this.otherUserInfo.getComponent("BillardUserView").turnBlur.active = isMyTurn;
    },

    showMessage(message) {
        this.panelUI.getComponent("PanelUIGame").showMessage(message);
    },
});

Math.floor01 = function (number) {
    if (number <= 0.5) {
        return 0;
    } else if (number > 0.5) {
        return 1;
    }
}