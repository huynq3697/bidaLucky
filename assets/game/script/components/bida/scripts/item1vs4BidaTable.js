var Utils = require('Utils');
var Linker = require('Linker');
var BiDaConstant = require('BiDaConstant');
var i18n = require('i18n');

cc.Class({
    extends: cc.Component,

    properties: {
        playerBlocks: [cc.Node],//left and right
        sitButtonNode: cc.Node,
        bettingLevelTable: cc.Node,
        minCashNode: cc.Node,
        sttTable: cc.Node,
        btnSitOnTable: [cc.Node],
        btnCreate: cc.Node,
        btnWatch: cc.Node,
        iconMoney: cc.Node,
        listMoneyIcon: [cc.SpriteFrame],
        itemTableSpriteAtlas: cc.SpriteAtlas,
        backgroundNode: cc.Node,
        playerTotal: cc.Node,
        cuocNode: cc.Node,
        minCashContainer: cc.Node,
        sttContainer: cc.Node,
        leftContainer: cc.Node,
        rightContainer: cc.Node
    },
    onLoad() {
        // if (this.btnCreate.active) {
        //     this.btnCreate.on(cc.Node.EventType.TOUCH_END, this.onCreateRoom, this);
        // }
    },
    onEnable: function () {
        this.btnCreate.on(cc.Node.EventType.TOUCH_END, this.onCreateRoom, this);
        this.setBackGround();
    },
    setBackGround: function () {
        if (this.itemTableSpriteAtlas) {
            var _bgSprite = this.backgroundNode.getComponent(cc.Sprite);
            if (_bgSprite) {
                var frame;
                if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS4) {
                    frame = this.itemTableSpriteAtlas.getSpriteFrame("lobbyban14");
                } else if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_BIDA_PHOM) {
                    frame = this.itemTableSpriteAtlas.getSpriteFrame("lobbybanphom");
                }
                if (frame) {
                    _bgSprite.spriteFrame = frame;
                }
            }
        }
    },
    setPlayerWaiting: function (nplayer) {
        if (nplayer >= 0) {
            var n = 0;
            for (let i = 0; i < this.playerBlocks.length; i++) {
                let _player = this.playerBlocks[i];
                if (n >= nplayer) {
                    _player.getChildByName("avatar").active = false;
                    // _player.getChildByName("avatar").color = new cc.Color(63, 63, 63);
                } else {
                    _player.getChildByName("avatar").active = true;
                    // _player.getChildByName("avatar").color = new cc.Color(255, 255, 255);
                }
                n++;
            }
        }
    },
    showCreateTable: function () {
        //chỉ hiện bg và button create
        this.backgroundNode.active = true;
        this.btnCreate.active = true;
        //hide avatar
        for (let i = 0; i < this.playerBlocks.length; i++) {
            this.playerBlocks[i].active = false;
        }
        this.iconMoney.active = false;
        this.cuocNode.active = false;
        this.minCashContainer.active = false;
        this.sttContainer.active = false;
        this.leftContainer.active = false;
        this.rightContainer.active = false;
        this.btnWatch.active = false;
        this.playerTotal.active = false;
        this.sitButtonNode.active = false;
    },
    showMainItem: function () {
        this.backgroundNode.active = true;
        this.iconMoney.active = true;
        this.cuocNode.active = true;
        this.minCashContainer.active = false;
        this.sttContainer.active = false;
        this.leftContainer.active = true;
        this.rightContainer.active = true;
        //hide avatar
        for (let i = 0; i < this.playerBlocks.length; i++) {
            this.playerBlocks[i].active = true;
        }
    },
    hideCreateTable: function () {
        this.btnCreate.active = false;
        this.leftContainer.active = true;
        this.rightContainer.active = true;
    },
    addCustomEventListener: function () {
        for (let i = 0; i < this.btnSitOnTable.length; i++) {
            this.btnSitOnTable[i].on(cc.Node.EventType.TOUCH_END, this.join, this);
        }
    },
    // reuse: function () {
    //     for (let i = 0; i < this.btnSitOnTable.length; i++) {
    //         this.btnSitOnTable[i].on(cc.Node.EventType.TOUCH_END, this.join.bind(this), this.node);
    //     }
    //     this.btnCreate.on(cc.Node.EventType.TOUCH_END, this.onCreateRoom.bind(this), this.node);
    // },
    init: function (data) {
        this.data = data;
        if (this.data) {
            if (this.data.isCreate) {
                this.showCreateTable();
            } else {
                this.hideCreateTable();
                this.showMainItem();
                this.addCustomEventListener();
                cc.Global.setColorMoney(this.bettingLevelTable);
                this.minBet = this.bettingLevelTable.getComponent(cc.Label);
                this.minBet.active = true;

                this.stt = this.sttTable.getComponent(cc.Label);
                this.minCash = this.minCashNode.getComponent(cc.Label);
                this.stt.string = i18n.t("button_title_table") + ":" + this.data.pos;
                this.playerTotal.active = false;
                if (Number(this.data.tableSize) >= 5) {
                    this.playerTotal.active = true;
                    this.playerTotal.getComponent(cc.Label).string = "(" + this.data.tableSize + ")";
                }
                if (this.data.tableIndex > 0) {
                    this.node.getChildByName('Stt').active = true;
                    this.sttTable.getComponent(cc.Label).string = i18n.t("button_title_table") + ":" + this.data.tableIndex;
                    // this.minBet.string = Utils.Number.format(this.data.firstCashBet) + " (Bàn " + this.data.tableIndex + ")";
                }
                this.minBet.string = Utils.Number.format(this.data.firstCashBet);
                this.minCash.string = "Min: " + Utils.Number.format(this.data.firstCashBet * 10);
                if (this.data.tableSize != null) {
                    // this.currentSize.string = this.data.tableSize + "/" + this.data.maxNumberPlayer;
                    // this.currentProgress.progress = Number(this.data.tableSize) / Number(this.data.maxNumberPlayer);
                    if (this.data.tableSize == 0) {
                        // this.nameTable.string = "Trống";
                        this.data.status = 0;// trong
                        this.setPlayerWaiting(0);
                        this.btnWatch.active = false;
                        this.sitButtonNode.active = true;
                    } else {
                        if (this.data.isPlaying == 1) {
                            if (Number(this.data.tableSize) < Number(this.data.maxNumberPlayer)) {
                                this.data.status = 1; // dang choi
                                this.setPlayerWaiting(Number(this.data.tableSize));
                                this.btnWatch.active = true;
                                this.btnSitOnTable[0].active = false;
                            } else {
                                this.data.status = 3; // day
                                this.setPlayerWaiting(Number(this.data.maxNumberPlayer));
                                this.btnWatch.active = true;
                                this.btnSitOnTable[0].active = false;
                            }
                        } else {
                            if (Number(this.data.tableSize) < Number(this.data.maxNumberPlayer)) {
                                this.data.status = 2; // cho
                                this.setPlayerWaiting(Number(this.data.tableSize));
                                this.btnWatch.active = false;
                                this.btnSitOnTable[0].active = true;
                            } else {
                                this.data.status = 3; // day
                                this.setPlayerWaiting(Number(this.data.maxNumberPlayer));
                                this.btnWatch.active = false;
                                this.btnSitOnTable[0].active = true;
                            }
                        }
                    }
                }
                var spriteFrame = this.listMoneyIcon[0];
                if (cc.Global.bidaMoneyType == 1) {
                    spriteFrame = this.listMoneyIcon[1];
                }
                this.iconMoney.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            }
        }
    },
    join: function () {
        var customEvent = new cc.Event.EventCustom(BiDaConstant.GAME_LOBBY_EVENT.REQUEST_JOIN_TABLE_WITH_TABLE_DATA, true);
        customEvent.tableData = this.data;
        this.node.dispatchEvent(customEvent);
    },
    onCreateRoom: function () {
        var customEvent = new cc.Event.EventCustom(BiDaConstant.GAME_LOBBY_EVENT.CREATE_TABLE_ADD_ROOM, true);
        this.node.dispatchEvent(customEvent);
    }
    // update (dt) {},
});
