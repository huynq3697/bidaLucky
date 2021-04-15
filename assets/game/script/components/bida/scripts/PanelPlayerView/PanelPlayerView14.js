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
    checkGameTableLogic: function () {
        if (this.gameTableLogic && this.gameTableLogic.isValid == true) {
            return true;
        }
        return false;
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
            for (let i = 0; i < this.gameTableLogic.bidaDeskNode.children.length; i++) {
                var c = this.gameTableLogic.bidaDeskNode.children[i];
                if (c.name == "DangXemPrint") {
                    c.destroy(true);
                }
            }
        }
    },
    addFootPrint: function () {
        this.removeFootPrint();
        cc.resources.load("bida/prefabs/Panel/DangXemPrint", cc.Prefab, function (err, prefab) {
            if (!err) {
                var _footPrint = cc.instantiate(prefab);
                var _text = _footPrint.getChildByName("text");
                if (_text) {
                    var _textLabel = _text.getComponent(cc.Label);
                    if (_textLabel) {
                        _textLabel.string = i18n.t("watch_match");
                        this.gameTableLogic.bidaDeskNode.addChild(_footPrint, 0);
                    }
                }
            }
        }.bind(this))
    },
    checkIsMasterTable: function () {
        if (this.gameTableController.isMaster == 1 || this.gameTableController.isMaster == true || this.gameTableController.isMaster == "1") {
            return true;
        }
        return false;
    },
    init: function (message) {
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

                    //game begin;
                    // this.showListBiTrenTay1vs4MasterRoom(message);
                    //foot print
                    this.addFootPrint();
                    this.gameTableLogic.startTimerCounter(Number(message.currentPlayerId));
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
                    this.addFootPrint();
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
            if (i >= 0 && i < this.gameTableLogic.rankingUserInfo.length) {
                var userInfoComponentRanking = this.gameTableLogic.rankingUserInfo[i].getComponent("BillardUserView");
                if (userInfoComponentRanking) {
                    userInfoComponentRanking.setUserName(userName);
                    userInfoComponentRanking.setUserMoney(userMoney);
                    // userInfoComponentRanking.setUserExp(player.exp);
                    userInfoComponentRanking.setUserLevel(userLevel);
                    userInfoComponentRanking.setAvatarAsSpriteFrame(userFrame);
                    userInfoComponentRanking.setUserID(userID);
                    userInfoComponentRanking.setProgressMatch("");//0%
                    userInfoComponentRanking.showPlayer();
                    userInfoComponentRanking.setUserPos(1);
                    userInfoComponentRanking.setMoneyIcon(this.gameTableLogic.listMoneyIcon);
                    userInfoComponentRanking.setOpacityPlayer(255);
                }
            }
        }
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
    showListBiTrenTay1vs4MasterRoom: function (message) {
        var masterPlayerInfo = null;
        for (let i = 0; i < message.listPlayer.length; i++) {
            var playerInfo = message.listPlayer[i];
            if (parseInt(playerInfo.isMaster) == 1) {
                masterPlayerInfo = playerInfo;
                break;
            }
        }
        if (masterPlayerInfo) {
            message.masterPlayerInfo = masterPlayerInfo;
            this.setListBallTargetMasterRoom(message);
        }
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
                    if (parseInt(playerInfo.isObserver) == 1 || parseInt(playerInfo.userId) == parseInt(Linker.userData.userId)) {
                        if (this.checkGameTableLogic()) {
                            this.gameTableController.gameState = BiDaConstant.GAME_STATE.PLAYING;
                        }
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
            var emptySlots = this.gameTableLogic.getNumberSlotEmptyOnRanking();
            if (emptySlots.length > 0) {
                for (let j = 0; j < emptySlots.length; j++) {
                    var player = emptySlots[j];
                    if (player && cc.isValid(player)) {
                        var playerRankingCmp = player.getComponent("BillardUserView");
                        if (playerRankingCmp) {
                            playerRankingCmp.node.active = true;
                            var money = Utils.Malicious.moneyWithFormat(players[j].userMoney, ".");
                            var frame = this.gameTableLogic.getFrameById(this.gameTableLogic.avatarAtlas, players[j].avatarId);
                            playerRankingCmp.setUserName(players[j].viewName);
                            playerRankingCmp.setUserMoney(money);
                            playerRankingCmp.setUserLevel(players[j].exp);
                            playerRankingCmp.setAvatarAsSpriteFrame(frame);
                            playerRankingCmp.setUserID(players[j].userId);
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
    },
    onTurnCardRespone: function (message) {
        if (message.status == 1) {
            cc.log("Waiting view ...", message);
            switch (message.cueStatus) {
                case BiDaConstant.TABLE_STATUS.MOVING_CUE:
                    //bo qua
                    break;
                case BiDaConstant.TABLE_STATUS.UPDATE_GOC_BAN_BI:
                    //bo qua
                    break;
                case BiDaConstant.TABLE_STATUS.END_DRAGGING_CUE:
                    //bo qua
                    break;
                case BiDaConstant.TABLE_STATUS.SETTING_RESULT_TURN:
                    cc.log("next turn binh thuong onTurnCardRespone", message);
                    this.setUsersInfoTurn(message);
                    break;
                case BiDaConstant.TABLE_STATUS.AUTO_NEXT_TURN:
                    cc.log("auto next turn onTurnCardRespone", message);
                    this.setUsersInfoTurn(message);
                    break;
                default:
                    break;
            }
            this.setListBallTargetMasterRoom(message);
        } else {
            cc.Global.showMessage(i18n.t(message.error));
        }
    },
    setListBallTargetMasterRoom: function (message) {
        if (message.masterPlayerInfo) {
            var listBallOnHand = this.gameTableController.addListBiCanAn(message.masterPlayerInfo);
            this.addListBallTargetNow(listBallOnHand);
        } else {
            if (message.players) {
                var userInfoComponent = this.gameTableLogic.myUserInfo.getComponent("BillardUserView");
                for (let k = 0; k < message.players.length; k++) {
                    var player = message.players[k];
                    var playerId = player.id;
                    if (userInfoComponent.getUserID() == Number(playerId)) {
                        var listBallOnHand = this.gameTableController.addListBiCanAn(player);
                        this.addListBallTargetNow(listBallOnHand);
                        break;
                    }
                }
            }
        }
    },
    addListBallTargetNow: function (listBallOnHand) {
        if (listBallOnHand.length == 7) {
            this.gameTableLogic.showAllMyBallistDisplay(listBallOnHand, this.gameTableLogic.myBallistDisplay);
        } else if (listBallOnHand.length == 8) {
            listBallOnHand[listBallOnHand.length - 2] = listBallOnHand[listBallOnHand.length - 1];
            listBallOnHand.splice(listBallOnHand.length - 1, 1);
            this.gameTableLogic.showAllMyBallistDisplay(listBallOnHand, this.gameTableLogic.myBallistDisplay);
        } else {
            cc.log("List bi", listBallOnHand);
        }
    },
    setUsersInfoTurn: function (message) {
        //get percent data
        var _tmpRankingUser = [];
        var _tmpLeftRankingUser = null;
        if (message.players) {
            for (let k = 0; k < message.players.length; k++) {
                var player = message.players[k];
                var playerId = player.id;
                var rankingUser = this.gameTableLogic.getUserRankingById(playerId);
                if (rankingUser) {
                    var rankingUserComponent = rankingUser.getComponent("BillardUserView");
                    if (rankingUserComponent) {
                        _tmpRankingUser.push(
                            {
                                userAvatarFrame: rankingUserComponent.getUserAvatarFrame(),
                                userMoney: rankingUserComponent.getUserMoney(),
                                userName: rankingUserComponent.getUserName(),
                                userID: rankingUserComponent.getUserID(),
                                userNationFrame: rankingUserComponent.getNationFrame(),
                                userPercentMatch: player.player_percent_eat,

                            }
                        )
                    }
                }
                if (this.gameTableLogic.myUserInfo.getComponent("BillardUserView").getUserID() == playerId) {
                    _tmpLeftRankingUser = {
                        userPercentMatch: player.player_percent_eat
                    };
                }
            }
            //set percent data
            for (let j = 0; j < _tmpRankingUser.length; j++) {
                var userInfoComponentRanking = this.gameTableLogic.rankingUserInfo[j].getComponent("BillardUserView");
                if (userInfoComponentRanking) {
                    userInfoComponentRanking.setAvatarAsSpriteFrame(_tmpRankingUser[j].userAvatarFrame);
                    userInfoComponentRanking.setUserMoney(_tmpRankingUser[j].userMoney);
                    userInfoComponentRanking.setUserName(_tmpRankingUser[j].userName);
                    userInfoComponentRanking.setUserID(_tmpRankingUser[j].userID);
                    userInfoComponentRanking.setFlagAsFrame(_tmpRankingUser[j].userNationFrame);
                    userInfoComponentRanking.setProgressMatch(_tmpRankingUser[j].userPercentMatch);

                }
                this.gameTableLogic.rankingUserInfo[j].stopAllActions();
                this.gameTableLogic.rankingUserInfo[j].scale = 1;
            }
            //set left block data
            if (_tmpLeftRankingUser) {
                var userInfoComponent = this.gameTableLogic.myUserInfo.getComponent("BillardUserView");
                if (userInfoComponent) {
                    var percentMatch = _tmpLeftRankingUser.userPercentMatch;
                    userInfoComponent.setProgressMatch(percentMatch);//0%
                    userInfoComponent.showPlayer();
                    userInfoComponent.setUserPos(1);
                }
            }
        }
    }
}
