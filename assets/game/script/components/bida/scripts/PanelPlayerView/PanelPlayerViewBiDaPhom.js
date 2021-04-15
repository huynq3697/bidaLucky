var Linker = require('Linker');
var BiDaConstant = require('BiDaConstant');
var i18n = require('i18n');
var Utils = require('Utils');
module.exports = {
    config: function (message) {
        if (message) {
            var gameTableLogic = message.BillardsGameTable;
            if (gameTableLogic && gameTableLogic.isValid) {
                this.gameTableLogic = gameTableLogic;
                this.gameTableNode = gameTableLogic.node;
                this.gameTableController = this.gameTableNode.getComponent("BillardsGameTableController");
                var id = null;
                if (message && message.messageId) {
                    if (message.messageId == 1106 && message.player && message.player.userId) {
                        //join game
                        id = Number(message.player.userId);
                    }
                }
                this.getDangXemPrefab();
                if (this.gameTableController.gameState == BiDaConstant.GAME_STATE.PLAYING && !this.gameTableController.checkIdPlaying(id)) {
                    this.gameTableLogic.unscheduleAllCallbacks();
                    this.init(message);
                }
            } else {
                this.gameTableLogic = null;
                this.gameTableNode = null;
                this.gameTableController = null;
            }
        }
    },
    getFootPrints: function () {
        var _footPrints = [];
        for (let i = 0; i < this.gameTableLogic.bidaDeskNode.children.length; i++) {
            var c = this.gameTableLogic.bidaDeskNode.children[i];
            if (c.name == "DangXemPrint" && cc.isValid(c)) {
                _footPrints.push(c);
            }
        }
        return _footPrints;
    },
    removeFootPrint: function (message) {
        if (message) {
            var gameTableLogic = message.BillardsGameTable;
            if (gameTableLogic && gameTableLogic.isValid) {
                this.gameTableLogic = gameTableLogic;
                this.gameTableNode = gameTableLogic.node;
                this.gameTableController = this.gameTableNode.getComponent("BillardsGameTableController");
                this.removeFootPrintNow();
            }
        } else {
            this.removeFootPrintNow();
        }
    },
    removeFootPrintNow: function () {
        if (this.gameTableLogic) {
            var _panelUsersBidaPhom = this.gameTableLogic.panelUserContainer.getChildByName("PanelUsersBidaPhom");
            for (let i = 0; i < _panelUsersBidaPhom.children.length; i++) {
                var c = _panelUsersBidaPhom.children[i];
                if (c.name == "DangXemPrint") {
                    c.removeFromParent(true);
                }
            }
        }
    },
    addFootPrint: function () {
        var _footPrints = this.getFootPrints();
        if (_footPrints.length != 1) {
            if (_footPrints.length > 0) {
                this.removeFootPrint();
            } else {
            }
            this.getDangXemPrefab(function (err, prefab) {
                if (prefab) {
                    var _footPrint = cc.instantiate(prefab);
                    _footPrint.position = cc.v2(-350, -25);
                    var _text = _footPrint.getChildByName("text");
                    if (_text) {
                        var _textLabel = _text.getComponent(cc.Label);
                        if (_textLabel) {
                            _textLabel.string = i18n.t("watch_match");
                            var _panelUsersBidaPhom = this.gameTableLogic.panelUserContainer.getChildByName("PanelUsersBidaPhom");
                            if (_panelUsersBidaPhom) {
                                _panelUsersBidaPhom.addChild(_footPrint, 0);
                            }
                        }
                    }
                }
            }.bind(this));
        } else {
            var _footPrint = _footPrints[0];
            _footPrint.active = true;
            _footPrint.opacity = 255;
        }
    },
    getDangXemPrefab: function (cb) {
        if (this.dangXemPrefab && cc.isValid(this.dangXemPrefab)) {
            if (cb) {
                cb(null, this.dangXemPrefab);
            }
        } else {
            cc.resources.load("bida/prefabs/Panel/DangXemPrint", cc.Prefab, function (err, prefab) {
                if (!err) {
                    this.dangXemPrefab = prefab;
                    if (cb) {
                        cb(null, this.dangXemPrefab);
                    }
                    // var _footPrint = cc.instantiate(prefab);
                    // _footPrint.position = cc.v2(-350, -25);
                    // var _text = _footPrint.getChildByName("text");
                    // if (_text) {
                    //     var _textLabel = _text.getComponent(cc.Label);
                    //     if (_textLabel) {
                    //         _textLabel.string = i18n.t("watch_match");
                    //         var _panelUsersBidaPhom = this.gameTableLogic.panelUserContainer.getChildByName("PanelUsersBidaPhom");
                    //         if (cc.find("DangXemPrint", this._panelUsersBidaPhom))
                    //             _panelUsersBidaPhom.getChildByName("DangXemPrint").active = true;
                    //         else
                    //             _panelUsersBidaPhom.addChild(_footPrint, 0);
                    //     }
                    // }
                }
            }.bind(this))
        }

    },
    checkGameTableLogic: function () {
        if (this.gameTableLogic && this.gameTableLogic.isValid == true) {
            return true;
        }
        return false;
    },
    init: function (message) {
        if (this.gameTableLogic) {
            var _billardGameTableController = this.gameTableLogic.getBillardController();
            if (_billardGameTableController) {
                cc.log("messsagggggg", message);
                if (message) {
                    switch (parseInt(message.messageId)) {
                        case 1105:
                            //join game;
                            var players = this.pickPlayerIsObserverIsPlaying(message.listPlayer);
                            this.gameTableLogic.createHeaderUserInfo();
                            this.gameTableLogic.configPanelUsers();
                            this.gameTableLogic.init();
                            message.listPlayer = players.playerIsPlaying;
                            message._isWaiting = true;
                            this.gameTableLogic.initTableInfo(message);
                            this.initTableInfoView(message);
                            //be hon 4 thi co the push them doi voi minh la chu phong
                            //con be 5 thi co the push them 1 doi voi khong phai chu phong
                            if (message.listPlayer.length >= 5) {
                                var _shortenListPlayer = [];
                                for (let i = 0; i < 5; i++) {
                                    _shortenListPlayer.push(message.listPlayer[i]);
                                }
                                message.listPlayer = _shortenListPlayer;
                            }
                            if (message.listPlayer.length <= 5) {
                                var _tmpPlayerIsObserver = [];
                                for (let i = 0; i < players.playerIsObserver.length; i++) {
                                    if (Number(players.playerIsObserver[i].userId) != Number(Linker.userData.userId)) {
                                        _tmpPlayerIsObserver.push(players.playerIsObserver[i]);
                                    }
                                }
                                this.addPlayerViewInRankingList(_tmpPlayerIsObserver);
                            }
                            this.loadSilentPlayerViewData(players.playerIsObserver);
                            this.gameBegin(message);
                            //foot print
                            this.addFootPrint();
                            // set opacity player
                            this.gameTableLogic.myUserInfo.getComponent("BillardUserView").setOpacityPlayer(150);
                            this.gameTableLogic.startTimerCounter(Number(message.currentPlayerId));
                            _billardGameTableController.idplayerLuotDanh = Number(message.currentPlayerId);
                            break;
                        case 1106:
                            cc.log("so nguoi choi tren ranking ke ca dang cho", this.getNumberViewerInRankingList().length);
                            var numberPlayerInRankingList = this.getNumberViewerInRankingList().length;
                            var isMaster = this.checkIsMasterTable();
                            cc.log("isMaster", isMaster);
                            if ((numberPlayerInRankingList < 4 && isMaster) || ((numberPlayerInRankingList < 4) || (numberPlayerInRankingList >= 4 && numberPlayerInRankingList < 5 && !isMaster))) {
                                this.addPlayerViewInRankingList([message.player]);
                            }
                            this.loadSilentPlayerViewData([message.player]);
                            //joined game;
                            if (Number(Linker.userData.userId) == Number(message.player.userId)) {
                                this.addFootPrint();
                            }
                            break;
                        case 1108:
                            this.addPlayerPlayingRanking(message.listPlayer);
                            this.loadSilentPlayerViewDataExist(message.playerIsObserver);
                            this.gameBegin(message);
                            this.addFootPrint();
                            break;
                        default:
                            break;
                    }
                    this.gameTableLogic.setViewerNumber();
                }
            }
        }
    },
    addPlayerPlayingRanking: function (players) {
        if (this.checkGameTableLogic()) {
            this.gameTableLogic.hideUsersRanking(0, this.gameTableLogic.rankingUserInfo.length, 0);
            var _panelPlayerView = this.gameTableLogic.panelUI.getComponent("PanelUIGame").getPanelPlayerView();
            var _isValidToReconfig = false;
            if (_panelPlayerView && cc.isValid(_panelPlayerView)) {
                var _panelPlayerViewComponent = _panelPlayerView.getComponent("PanelPlayerView");
                if (_panelPlayerViewComponent && cc.isValid(_panelPlayerViewComponent)) {
                    _isValidToReconfig = true;
                }
            }
            if (_isValidToReconfig) {
                for (var i = 0; i < players.length; i++) {
                    var player = this.gameTableLogic.getPlayerByUserId(Number(players[i].userId));
                    if (!player) {
                        //dam bao rang user id nay chua duoc them, neu duoc them roi thi chi can thay doi tham so
                        player = this.gameTableLogic.getPlayerByUserId(0);
                        //default voi id = 0 thi nguoi day la user trong
                    }
                    if (player) {
                        var playerRankingCmp = player.getComponent("BillardUserView");
                        if (playerRankingCmp) {
                            playerRankingCmp.node.active = true;
                            var opacity = players[i].opacity;
                            var userAvatarFrame = players[i].userAvatarFrame;
                            var userMoney = players[i].userMoney;
                            var userName = players[i].userName;
                            var userID = players[i].userID;
                            var userNationFrame = players[i].userNationFrame;
                            var userCountryId = players[i].userCountryId;
                            var userLevel = players[i].userLevel;
                            var userPercentMatch = players[i].userPercentMatch;
                            var isMaster = players[i].isMaster;

                            playerRankingCmp.setUserName(userName);
                            playerRankingCmp.setUserMoney(userMoney);
                            playerRankingCmp.setUserLevel(userLevel);
                            playerRankingCmp.setAvatarAsSpriteFrame(userAvatarFrame);
                            playerRankingCmp.setFlagAsSpriteFrame(userCountryId);
                            playerRankingCmp.setUserID(userID);
                            playerRankingCmp.showPlayer();
                            playerRankingCmp.setWaitingStatus(false);
                            playerRankingCmp.setProgressMatch("");//0%
                            playerRankingCmp.setMaster(isMaster);
                            //danh cho counter do 1vs1 su dung flip(negative size width and height)
                            playerRankingCmp.setUserPos(1);
                        }
                    }
                }
            }
        } else {
            // cc.error("Loi roi. GG nào..", players);
        }

    },
    checkIsMasterTable: function () {
        if (this.gameTableController.isMaster == 1 || this.gameTableController.isMaster == true || this.gameTableController.isMaster == "1") {
            return true;
        }
        return false;
    },
    getNumberViewerInRankingList: function () {
        var listPlayers = [];
        for (let i = 0; i < this.gameTableLogic.rankingUserInfo.length; i++) {
            var player = this.gameTableLogic.rankingUserInfo[i];
            if (player && cc.isValid(player)) {
                var userInfoComponentRanking = player.getComponent("BillardUserView");
                if (userInfoComponentRanking && cc.isValid(userInfoComponentRanking)) {
                    var id = parseInt(userInfoComponentRanking.getUserID());
                    if (isNaN(id) == false && id != 0) {
                        listPlayers.push(player);
                    }
                }
            }
        }
        return listPlayers;
    },
    addPlayerViewInRankingList: function (players) {
        for (let i = 0; i < players.length; i++) {
            var player = this.gameTableLogic.getPlayerByUserId(Number(players[i].userId));
            if (!player) {
                //dam bao rang user id nay chua duoc them, neu duoc them roi thi chi can thay doi tham so
                player = this.gameTableLogic.getPlayerByUserId(0);
                //default voi id = 0 thi nguoi day la user trong
            }
            if (player) {
                var playerRankingCmp = player.getComponent("BillardUserView");
                if (playerRankingCmp) {
                    playerRankingCmp.node.active = true;
                    var money = Utils.Malicious.moneyWithFormat(players[i].userMoney, ".");
                    var frame = this.gameTableLogic.getFrameById(this.gameTableLogic.avatarAtlas, players[i].avatarId);
                    playerRankingCmp.setUserName(players[i].viewName);
                    playerRankingCmp.setUserMoney(money);
                    playerRankingCmp.setUserLevel(players[i].exp);
                    playerRankingCmp.setAvatarAsSpriteFrame(frame);
                    playerRankingCmp.setFlagAsSpriteFrame(players[i].countryId);
                    playerRankingCmp.setUserID(players[i].userId);
                    playerRankingCmp.showPlayer(150);
                    playerRankingCmp.setWaitingStatus(true);
                    playerRankingCmp.setProgressMatch("");//0%
                    playerRankingCmp.setMaster(false);
                    //danh cho counter do 1vs1 su dung flip(negative size width and height)
                    playerRankingCmp.setUserPos(1);
                }
            }

        }
    },
    gameBegin: function (message) {
        this.gameTableLogic.addTouchEventListener();
        this.gameTableLogic.addCustomEventDispatch();

        //Them dieu kien kiem tra ball co toa do chua, chua co toa do thi tao bi
        if (message.ballPos && message.ballPos[0].hasOwnProperty("x") && message.ballPos[0].hasOwnProperty("y") && !message.ballPos[0].hasOwnProperty("z")) {
            this.gameTableLogic.reRenderBallPosition(message.ballPos, this.gameTableLogic.getBallsInTable());
            //không cần tạo bi và cue khi data ball position đã có sẵn.
        } else {
            var _tmpDataBall = Utils.Malicious.createBallPosWithAngle(message.dataBall);
            this.gameTableLogic.taoBideBatdauTranDau(_tmpDataBall);
            this.gameTableLogic.taoCueTrenBanChoi();
        }
        this.gameTableLogic.setCueRotateCueListener();
        this.gameTableLogic.blockTouchEvent();
        this.gameTableLogic.panelPower.active = true;
        this.gameTableLogic.cue.active = true;
        this.gameTableLogic.cue.opacity = 100;
        this.gameTableLogic.cue.getChildByName("drawLine").opacity = 0;
        this.gameTableLogic.myUserId = Number(Linker.userData.userId);
        //an hien thi cac bi dang co cua toi
        if (message.ballEat && message.ballEat.length > 0) {
            this.gameTableLogic.clearAllBallOnTable(message.ballEat);
        }
        this.gameTableLogic.hideAllMyBallistDisplay();
        //an hien thi cac bi dang co cua doi thu
        // Bida11GameTable.hideAllOtherBallistDisplay({BillardsGameTable : this.gameTableLogic});
        //khong can chay animation next turn cac kieu lam gi chi can show timer list bi an, list bi dang co tren khay la ok roi
        this.initListBiAn(message);
        cc.log(message, "game beginnnn");
    },
    getUserPanelById: function (id) {
        var listUserPanel = [
            {
                ballList: this.gameTableLogic.myBallistDisplay,
                userView: this.gameTableLogic.myUserInfo
            },
            {
                ballList: this.gameTableLogic.otherBallistDisplay,
                userView: this.gameTableLogic.otherUserInfo
            }
        ];
        for (let i = 0; i < listUserPanel.length; i++) {
            var _billardView = listUserPanel[i].userView.getComponent("BillardUserView");
            if (_billardView) {
                if (_billardView.getUserID() == id) {
                    return listUserPanel[i].ballList;
                }
            }
        }
        return null;
    },
    initTableInfoView: function (message) {
        for (let i = 0; i < message.listPlayer.length; i++) {
            //create right
            var player = message.listPlayer[i];
            var userName = player.viewName;
            var userMoney = Utils.Malicious.moneyWithFormat(player.userMoney, ".");
            var userLevel = player.exp;
            var userFrame = this.gameTableLogic.getFrameById(this.gameTableLogic.avatarAtlas, player.avatarId);
            var userID = player.userId;
            var isBot = player.isBot;
            if (i >= 0 && i < this.gameTableLogic.rankingUserInfo.length) {
                var userInfoComponentRanking = this.gameTableLogic.rankingUserInfo[i].getComponent("BillardUserView");
                if (userInfoComponentRanking) {
                    userInfoComponentRanking.setUserName(userName);
                    userInfoComponentRanking.setUserMoney(userMoney);
                    // userInfoComponentRanking.setUserExp(player.exp);
                    userInfoComponentRanking.setFlagAsSpriteFrame(player.countryId);
                    userInfoComponentRanking.setUserLevel(userLevel);
                    userInfoComponentRanking.setAvatarAsSpriteFrame(userFrame);
                    userInfoComponentRanking.setUserID(userID);
                    userInfoComponentRanking.setProgressMatch("");//0%
                    userInfoComponentRanking.showPlayer();
                    userInfoComponentRanking.setUserPos(1);
                    userInfoComponentRanking.setMoneyIcon(this.gameTableLogic.listMoneyIcon);
                    userInfoComponentRanking.setOpacityPlayer(255);
                    userInfoComponentRanking.setBotType(isBot);

                }
            }
        }
    },
    initListBiAn: function (message) {
        if (message && this.gameTableController) {
            message.players = (message.players) ? message.players : message.listPlayer ? message.listPlayer : [];
            this.gameTableLogic.stopAllTipAnimation();

            if (message.hasOwnProperty("players")) {
                for (let i = 0; i < message.players.length; i++) {
                    var player = message.players[i];
                    var id = (player.userId) ? player.userId : player.id ? player.id : 0;
                    var playerNode = this.gameTableLogic.getPlayerByUserId(Number(id));
                    if (playerNode) {
                        var playerRankingCmp = playerNode.getComponent("BillardUserView");
                        if (playerRankingCmp) {
                            var _data = { isMyCard: false, cards: [1], _isViewIng: false };
                            _data.isMyCard = false;
                            playerRankingCmp.changeCardSprite(_data);
                        }
                    }
                }
            }
        }
    },
    getPanelPlayerViewCmp: function () {
        var _panelPlayerView = this.gameTableLogic.panelUI.getComponent("PanelUIGame").getPanelPlayerView();
        if (_panelPlayerView && _panelPlayerView.isValid) {
            var _panelPlayerViewCmp = _panelPlayerView.getComponent("PanelPlayerView");
            if (_panelPlayerViewCmp && _panelPlayerViewCmp.isValid) {
                //
                return _panelPlayerViewCmp;
            }
        }
        return null;
    },
    pickPlayerIsObserverIsPlaying: function (listPlayer) {
        var playerIsPlaying = [];
        var playerIsObserver = [];
        var _panelPlayerViewCmp = this.getPanelPlayerViewCmp();
        if (_panelPlayerViewCmp) {
            _panelPlayerViewCmp.resetContentNode();
            if (listPlayer) {
                for (let i = 0; i < listPlayer.length; i++) {
                    var playerInfo = listPlayer[i];
                    playerInfo.isReady = 0;
                    if (parseInt(playerInfo.isObserver) == 1) {
                        playerIsObserver.push(playerInfo);
                    } else if (parseInt(playerInfo.isObserver) == 0) {
                        playerIsPlaying.push(playerInfo);
                    }
                }
            }
        }
        return {
            playerIsPlaying: playerIsPlaying,
            playerIsObserver: playerIsObserver
        }
    },
    loadSilentPlayerViewData: function (players) {
        var _panelPlayerViewCmp = this.getPanelPlayerViewCmp();
        if (_panelPlayerViewCmp && this.checkGameTableLogic()) {
            for (let i = 0; i < players.length; i++) {
                var player = players[i];
                if (player) {
                    _panelPlayerViewCmp.addPlayerToViewSit(player);
                }
            }
        }
    },
    loadSilentPlayerViewDataExist: function (players) {
        var _panelPlayerViewCmp = this.getPanelPlayerViewCmp();
        if (_panelPlayerViewCmp && this.checkGameTableLogic()) {
            for (let i = 0; i < players.length; i++) {
                var player = players[i];
                if (player) {
                    _panelPlayerViewCmp.addExistPlayerToViewSit(player);
                }
            }
            //số slot player trống thì hiện nó lên
            if (this.gameTableController && this.gameTableController._isViewMatch) {
                players = Utils.Malicious.removePlayerByIdInArray(players, Number(Linker.userData.userId));
            }
            var emptySlots = this.gameTableLogic.getNumberSlotEmptyOnRanking();
            if (emptySlots.length > 0) {
                for (let j = 0; j < emptySlots.length; j++) {
                    if (j <= players.length - 1) {
                        var player = emptySlots[j];
                        if (player && cc.isValid(player)) {
                            var playerRankingCmp = player.getComponent("BillardUserView");
                            if (playerRankingCmp) {
                                playerRankingCmp.node.active = true;
                                var money = Utils.Malicious.moneyWithFormat(players[j].userMoney, ".");
                                playerRankingCmp.setUserName(players[j].userName);
                                playerRankingCmp.setUserMoney(money);
                                playerRankingCmp.setUserLevel(players[j].userLevel);
                                playerRankingCmp.setFlagAsFrame(players[j].userNationFrame);
                                playerRankingCmp.setAvatarAsSpriteFrame(players[j].userAvatarFrame);
                                playerRankingCmp.setUserID(players[j].userID);
                                playerRankingCmp.showPlayer(150);
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
        }
    },
    //Logic xử lý phần turn người chơi khi đang ở mode xem người chơi
    onTurnCardRespone: function (message) {
        this.gameTableLogic.blockTouchEvent();
        if (message.status == 1) {
            cc.log("Waiting view ...", message);
            switch (message.cueStatus) {
                case BiDaConstant.TABLE_STATUS.MOVING_CUE:
                    var touch_id = message.cueR;
                    if (parseInt(touch_id) === BiDaConstant.TABLE_STATUS.DRAGGING_CUE_BOX) {
                        var cue = this.gameTableLogic.cue;
                        if (cue && cue.isValid) {
                            if (cue && cue.isValid) {
                                cue.getComponent("CueObj").lineCheck.opacity = 0;
                                var isBot = this.gameTableController.checkBotById(this.gameTableController.idplayerLuotDanh);
                                if (!isBot) {
                                    //cap nhat vi tri goc quay cua gay
                                    cue.position = this.gameTableLogic.bidaDeskNode.convertToNodeSpaceAR(message.cueP);
                                    this.gameTableLogic.panelPower.active = true;
                                    this.gameTableLogic.panelPower.opacity = 255;
                                } else {
                                    var whiteBall = this.gameTableLogic.getBallById(0);
                                    if (whiteBall) {
                                        var dolonLuc = message.cueP.x;
                                        var gocGay = message.cueP.y;
                                        var percent = (dolonLuc) * 100;
                                        cue.angle = -gocGay;
                                        cue.getComponent("CueObj").setPercent(percent);
                                    }
                                }
                            }
                        }

                    } else if (parseInt(touch_id) === BiDaConstant.TABLE_STATUS.DRAG_WHITE_BALL_TO_SHOOT) {
                        var whiteBallDrag = this.gameTableLogic.getWhiteBallRepos();
                        var WBallPos = null;
                        if (whiteBallDrag) {
                            WBallPos = whiteBallDrag.getComponent("WBallPos");
                            if (WBallPos && WBallPos.isValid) {
                                WBallPos.onActiveBlock();
                            }
                        } else {
                            this.gameTableLogic.datLaiViTriBiTrang();
                            whiteBallDrag = this.gameTableLogic.getWhiteBallRepos();
                            if (whiteBallDrag) {
                                WBallPos = whiteBallDrag.getComponent("WBallPos");
                                if (WBallPos && WBallPos.isValid) {
                                    WBallPos.onActiveBlock();
                                }
                            } else {
                                // cc.log("Khong the khoi tao lai bi cai de dat trong ban choi...");
                            }
                        }
                        WBallPos.onActiveBlock();
                    } else if (parseInt(touch_id) === BiDaConstant.TABLE_STATUS.REPOSITION_WHITE_BALL) {
                        this.gameTableLogic.removeWhiteBallRepos();
                        var data = {
                            pos: cc.v2(message.ballX, message.ballY),
                            anim_id: 0,
                            bg_sprite_frame: 0,
                            animation_sprite_frame: 0,
                            id: 0
                        };
                        this.gameTableLogic.addOneBiWithData(data);
                        var railCmp = this.gameTableLogic.getRailingBagComponent();
                        if (railCmp) {
                            railCmp.removeBallWithId(0);
                        }

                    } else if (parseInt(touch_id) === BiDaConstant.TABLE_STATUS.WHITE_BALL_ANGLE_ADJUST) {
                        this.gameTableLogic.m_rotate = cc.v2(message.ballX, message.ballY);
                        var smallRedpoint = this.gameTableLogic.redPointNode.getChildByName("Small_RedPoint");
                        if (smallRedpoint) {
                            var x = this.gameTableLogic.m_rotate.x * 30 + this.gameTableLogic.redPointNode.width * 0.5;
                            var y = this.gameTableLogic.m_rotate.y * 30 + this.gameTableLogic.redPointNode.height * 0.5;
                            smallRedpoint.position = cc.v2(x, y);
                        }

                    } else {
                        var cue = this.gameTableLogic.cue;
                        if (cue && cue.isValid) {
                            var isBot = this.gameTableController.checkBotById(this.gameTableController.idplayerLuotDanh);
                            if (!isBot) {
                                //cap nhat vi tri goc quay cua gay
                                var deskNode = cue.parent;
                                cue.position = deskNode.convertToNodeSpaceAR(message.cueP);
                                var p = message.cueP;
                                var wlocation = Utils.Malicious.getApointWhenKnowAngleAndRadius(p, -message.cueR, deskNode.width * 2);
                                this.gameTableLogic.setCuePosByTouch(wlocation, false, true, false);
                            } else {
                                //đối với bot đánh chỉ yêu cầu góc đánh cần thiết cho gậy không cần tọa độ của gậy
                                var whiteBall = this.gameTableLogic.getBallById(0);
                                if (whiteBall) {
                                    var deskNode = cue.parent;
                                    cue.position = whiteBall.position;
                                    cue.angle = message.cueR;
                                    var p = cue.parent.convertToWorldSpaceAR(cue.position);
                                    var wlocation = Utils.Malicious.getApointWhenKnowAngleAndRadius(p, -message.cueR, deskNode.width * 2);
                                    this.gameTableLogic.setCuePosByTouch(wlocation, false, true, false);
                                }
                            }
                        }
                        cc.log("Goc quay dang duoc cap nhat tu server...", message);
                    }
                    break;
                case BiDaConstant.TABLE_STATUS.UPDATE_GOC_BAN_BI:
                    var cue = this.gameTableLogic.cue;
                    if (cue && cue.isValid) {
                        var isBot = this.gameTableController.checkBotById(this.gameTableController.idplayerLuotDanh);
                        if (!isBot) {
                            //cap nhat vi tri goc quay cua gay
                            cue.position = this.gameTableLogic.bidaDeskNode.convertToNodeSpaceAR(message.cueP);
                            this.gameTableLogic.setCuePosByTouch(cc.v2(0, 0), false, true, Utils.Malicious.toPositiveAngle(message.cueR));
                        } else {
                            var whiteBall = this.gameTableLogic.getBallById(0);
                            if (whiteBall) {
                                cue.position = whiteBall.position;
                                var deskNode = cue.parent;
                                var p = cue.parent.convertToWorldSpaceAR(cue.position);
                                var wlocation = Utils.Malicious.getApointWhenKnowAngleAndRadius(p, -message.cueR, deskNode.width * 2);
                                this.gameTableLogic.setCuePosByTouch(wlocation, false, true, false);
                            }
                        }
                    }

                    break;
                case BiDaConstant.TABLE_STATUS.END_DRAGGING_CUE:
                    //thay doi turn id luot danh
                    var cue = this.gameTableLogic.cue;
                    if (cue && cue.isValid) {
                        // cap nhat vi tri goc quay cua gay
                        var progress = 1 - message.cueAR / 100;
                        this.gameTableLogic.forcePowerSlider.getComponent(cc.Slider).progress = progress;
                        message.type = 1;
                        if (this.gameTableLogic.idplayerLuotDanh != this.gameTableLogic.myUserId) {
                            message.type = 2;
                        }
                        this.gameTableLogic.runActionShotBallWhite(message);
                    }
                    break;
                case BiDaConstant.TABLE_STATUS.SETTING_RESULT_TURN:
                    message._isNormalNextTurn = true;
                    cc.log("next turn binh thuong onTurnCardRespone", message);
                    this.onEndTurnGame(message, BiDaConstant.TABLE_STATUS.SETTING_RESULT_TURN);
                    break;
                case BiDaConstant.TABLE_STATUS.AUTO_NEXT_TURN:
                    message._isNormalNextTurn = false;
                    cc.log("auto next turn onTurnCardRespone", message);
                    this.onEndTurnGame(message, BiDaConstant.TABLE_STATUS.AUTO_NEXT_TURN);
                    break;
                default:
                    break;
            }

        } else {
            cc.Global.showMessage(i18n.t(message.error));
        }
    },
    onEndTurnGame: function (message, type) {
        if (this.gameTableLogic) {
            var _billardGameTableController = this.gameTableLogic.getBillardController();
            if (_billardGameTableController) {
                var clientBallObj = this.gameTableLogic.getBallsInTable();
                _billardGameTableController.idplayerLuotDanh = Number(message.turnId);
                // if (Utils.Malicious.isJsonString(message.dataBall) && message._isNormalNextTurn) {
                if (Utils.Malicious.isJsonString(message.dataBall)) {
                    if (message._isNormalNextTurn) {
                        var serverBall = JSON.parse(message.dataBall);
                        this.gameTableLogic.clearAllBallOnTable(message.ballEat);
                        this.gameTableLogic.reRenderBallPosition(serverBall, clientBallObj);
                    } else {

                        _billardGameTableController.resetReconnect(message);

                    }
                }
                this.gameTableLogic.blockTouchEvent();
                this.gameTableLogic.panelPower.active = true;
                this.gameTableLogic.cue.active = true;
                this.gameTableLogic.cue.getChildByName("drawLine").opacity = 0;
                this.gameTableLogic.setErrorNumber(message.players);
                this.initListBiAn(message);
                this.gameTableLogic.startTimerCounter(Number(message.turnId));
            }
        }

    }
}
