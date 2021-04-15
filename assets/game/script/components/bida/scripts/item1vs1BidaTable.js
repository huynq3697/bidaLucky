var Utils = require('Utils');
var Linker = require('Linker');
var BiDaConstant = require('BiDaConstant');
var i18n = require('i18n');
var NewAudioManager = require('NewAudioManager');
cc.Class({
    extends: cc.Component,

    properties: {
        avatarBlocks: [cc.Node],//left and right
        bettingLevelTable: cc.Node,
        minCashNode: cc.Node,
        sttTable: cc.Node,
        btnSitOnTable: [cc.Node],
        btnCreate: cc.Node,
        iconMoney: cc.Node,
        listMoneyIcon: [cc.SpriteFrame],
        watchNode: cc.Node,
        itemTableSpriteAtlas: cc.SpriteAtlas,
        backgroundNode: cc.Node,
        playerTotal: cc.Node,
        cuocNode: cc.Node,
        minCashContainer: cc.Node,
        sttContainer: cc.Node
    },
    onLoad() {
        // if (this.btnCreate.active) {
        //     this.btnCreate.on(cc.Node.EventType.TOUCH_END, this.onCreateRoom, this);
        // }
    },
    onEnable: function () {
        this.setBackGround();
        this.hideWatchTable();
        this.btnCreate.on(cc.Node.EventType.TOUCH_END, this.onCreateRoom, this);
    },
    setBackGround: function () {
        if (this.itemTableSpriteAtlas) {
            var _bgSprite = this.backgroundNode.getComponent(cc.Sprite);
            if (_bgSprite) {
                var frame = this.itemTableSpriteAtlas.getSpriteFrame("lobbyban11");
                if (frame) {
                    _bgSprite.spriteFrame = frame;
                }
            }
        }
    },
    setPlayerWaiting: function (nplayer) {
        var numplayer = Number(nplayer);
        // if(numplayer >= 0){
        // var n = 0;

        for (let i = 0; i < this.avatarBlocks.length; i++) {
            let _sitted = this.avatarBlocks[i].getChildByName("sitted");
            let _sit = this.avatarBlocks[i].getChildByName("btnSit");
            this.avatarBlocks[i].active = true;
            if (numplayer >= 2) {
                _sitted.active = true;
                _sit.active = false;
            } else if (numplayer == 1) {
                _sitted.active = true;
                _sit.active = false;
                numplayer--;
            } else {
                _sitted.active = false;
                _sit.active = true;
                numplayer--;
            }
        }
    },
    showCreateTable: function () {
        //chỉ hiện bg và button create
        this.backgroundNode.active = true;
        this.btnCreate.active = true;
        //hide avatar
        for (let i = 0; i < this.avatarBlocks.length; i++) {
            this.avatarBlocks[i].active = false;
        }
        this.iconMoney.active = false;
        this.cuocNode.active = false;
        this.minCashContainer.active = false;
        this.sttContainer.active = false;
        this.watchNode.active = false;
        this.playerTotal.active = false;
    },
    showMainItem: function () {
        this.backgroundNode.active = true;
        this.iconMoney.active = true;
        this.cuocNode.active = true;
        this.minCashContainer.active = false;
        this.sttContainer.active = false;
        //hide avatar
        for (let i = 0; i < this.avatarBlocks.length; i++) {
            this.avatarBlocks[i].active = true;
        }
    },
    hideCreateTable: function () {
        this.btnCreate.active = false;
        this.cuocNode.active = true;
    },
    hideWatchTable: function () {
        this.watchNode.active = false;
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
                this.data = data;
                this.minBet = this.bettingLevelTable.getComponent(cc.Label);
                this.stt = this.sttTable.getComponent(cc.Label);
                this.minCash = this.minCashNode.getComponent(cc.Label);
                this.stt.string = i18n.t("button_title_table") + ":" + this.data.pos;
                this.playerTotal.active = false;
                if (Number(this.data.tableSize) >= 3) {
                    this.playerTotal.active = true;
                    this.playerTotal.getComponent(cc.Label).string = "(" + this.data.tableSize + ")";
                }
                if (Number(this.data.tableIndex) > 0) {
                    this.node.getChildByName('Stt').active = true;
                    this.sttTable.getComponent(cc.Label).string = i18n.t("button_title_table") + ":" + this.data.tableIndex;
                    this.minBet.string = Utils.Number.format(this.data.firstCashBet);
                    if (Linker.ZONE == BiDaConstant.ZONE_ID.ZONEID_1VS1) {
                        //&& Number(this.data.isPlaying) == 1
                        if (Number(this.data.tableSize) >= 2) {
                            this.watchNode.active = true;

                        } else {
                            this.watchNode.active = false;
                        }
                    }
                } else {
                    this.minBet.string = Utils.Number.format(this.data.firstCashBet);
                }
                this.minCash.string = "Min: " + Utils.Number.format(this.data.firstCashBet * 10);
                if (this.data.tableSize != null) {
                    cc.log("this.data.tableSize", this.data.tableSize);
                    // this.currentSize.string = this.data.tableSize + "/" + this.data.maxNumberPlayer;
                    // this.currentProgress.progress = Number(this.data.tableSize) / Number(this.data.maxNumberPlayer);
                    this.setPlayerWaiting(this.data.tableSize);
                    // if (this.data.tableSize == 0) {
                    //     // this.nameTable.string = "Trống";
                    //     this.data.status = 0;// trong
                    //     this.setPlayerWaiting(this.data.tableSize);
                    // } else {
                    //     if (this.data.isPlaying == 1) {
                    //         if (this.data.tableSize < this.data.maxNumberPlayer) {
                    //             this.data.status = 1; // dang choi
                    //             this.setPlayerWaiting(this.data.tableSize);

                    //         } else {
                    //             this.data.status = 3; // day
                    //             this.setPlayerWaiting(0);
                    //         }
                    //     } else {
                    //         if (this.data.tableSize < this.data.maxNumberPlayer) {
                    //             this.data.status = 2; // cho
                    //             this.setPlayerWaiting(this.data.tableSize);
                    //         } else {
                    //             this.data.status = 3; // day
                    //             this.setPlayerWaiting(0);
                    //         }
                    //     }
                    // }
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
        NewAudioManager.playClick();
        var customEvent = new cc.Event.EventCustom(BiDaConstant.GAME_LOBBY_EVENT.REQUEST_JOIN_TABLE_WITH_TABLE_DATA, true);
        customEvent.tableData = this.data;
        this.node.dispatchEvent(customEvent);
    },
    onCreateRoom: function () {
        NewAudioManager.playClick();
        var customEvent = new cc.Event.EventCustom(BiDaConstant.GAME_LOBBY_EVENT.CREATE_TABLE_ADD_ROOM, true);
        this.node.dispatchEvent(customEvent);
    }
    // update (dt) {},
});
