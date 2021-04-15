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
            for (let i = 0; i < this.gameTableLogic.bidaDeskNode.children.length; i++) {
                var c = this.gameTableLogic.bidaDeskNode.children[i];
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
                cc.log("Init panel player view 11", message);
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
                            this.loadSilentPlayerViewData(players.playerIsObserver);
                            //game begin;
                            this.gameBegin(message);
                            //foot print
                            this.addFootPrint();
                            this.gameTableLogic.startTimerCounter(Number(message.currentPlayerId));
                            _billardGameTableController.idplayerLuotDanh = Number(message.currentPlayerId);
                            break;
                        case 1106:
                            this.loadSilentPlayerViewData([message.player]);
                            //joined game;
                            if (Number(Linker.userData.userId) == Number(message.player.userId)) {
                                this.addFootPrint();
                            }
                            break;
                        case 1108:
                            this.gameTableLogic.init();
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
        if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
            //an hien thi cac bi dang co cua toi
            if (message.ballEat && message.ballEat.length > 0) {
                this.gameTableLogic.clearAllBallOnTable(message.ballEat);
                this.gameTableLogic.clearAllBallInHole();
            }
            this.gameTableLogic.hideAllMyBallistDisplay();
            //an hien thi cac bi dang co cua doi thu
            this.gameTableLogic.hideAllOtherBallistDisplay();
            //khong can chay animation next turn cac kieu lam gi chi can show timer list bi an, list bi dang co tren khay la ok roi
            this.initListBiAn(message);
            cc.log(message, "game beginnnn");
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
    initListBiAn: function (message) {
        if (message && this.gameTableController) {
            message.players = (message.players) ? message.players : message.listPlayer ? message.listPlayer : [];
            this.gameTableLogic.stopAllTipAnimation();
            if (message.hasOwnProperty("players")) {
                for (let i = 0; i < message.players.length; i++) {
                    var player = message.players[i];
                    var listBallOnHand = this.gameTableController.addListBiCanAn(player);
                    var id = (player.userId) ? player.userId : player.id ? player.id : player.playerId ? player.playerId : 0;
                    var target = this.getUserPanelById(Number(id));
                    if (listBallOnHand.length == 7) {
                        if (target) {
                            this.gameTableLogic.showAllMyBallistDisplay(listBallOnHand, target);
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
                            cue.getComponent("CueObj").lineCheck.opacity = 0;
                            //cap nhat vi tri goc quay cua gay
                            cue.position = this.gameTableLogic.bidaDeskNode.convertToNodeSpaceAR(message.cueP);
                            this.gameTableLogic.panelPower.active = true;
                            this.gameTableLogic.panelPower.opacity = 255;
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
                        //cap nhat vi tri goc quay cua gay
                        var cue = this.gameTableLogic.cue;
                        if (cue && cue.isValid) {
                            //cap nhat vi tri goc quay cua gay
                            var deskNode = cue.parent;
                            cue.position = deskNode.convertToNodeSpaceAR(message.cueP);
                            var p = message.cueP;
                            var wlocation = Utils.Malicious.getApointWhenKnowAngleAndRadius(p, -message.cueR, deskNode.width * 2);
                            this.gameTableLogic.setCuePosByTouch(wlocation, false, true, false);
                        }
                        cc.log("Goc quay dang duoc cap nhat tu server...", message);
                    }
                    break;
                case BiDaConstant.TABLE_STATUS.UPDATE_GOC_BAN_BI:
                    var cue = this.gameTableLogic.cue;
                    if (cue && cue.isValid) {
                        //cap nhat vi tri goc quay cua gay
                        cue.position = this.gameTableLogic.bidaDeskNode.convertToNodeSpaceAR(message.cueP);
                    }
                    this.gameTableLogic.setCuePosByTouch(cc.v2(0, 0), false, true, Utils.Malicious.toPositiveAngle(message.cueR));

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
        this.addFootPrint();
    },
    onEndTurnGame: function (message, type) {
        if (this.gameTableLogic) {
            var _billardGameTableController = this.gameTableLogic.getBillardController();
            if (_billardGameTableController) {
                _billardGameTableController.idplayerLuotDanh = Number(message.turnId);
                var clientBallObj = this.gameTableLogic.getBallsInTable();
                // if (Utils.Malicious.isJsonString(message.dataBall) && message._isNormalNextTurn) {
                if (Utils.Malicious.isJsonString(message.dataBall)) {
                    if (message._isNormalNextTurn) {
                        var serverBall = JSON.parse(message.dataBall);
                        this.gameTableLogic.clearAllBallOnTable(message.ballEat);
                        this.gameTableLogic.reRenderBallPosition(serverBall, clientBallObj);
                        this.gameTableLogic.clearAllBallInHole();
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
