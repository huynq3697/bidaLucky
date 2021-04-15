var Linker = require('Linker');
var BiDaSend = require('BiDaSend');
var i18n = require('i18n');
var Utils = require("Utils");

cc.Class({
    extends: cc.Component,
    properties: {
        cellPrefab: cc.Prefab,
        content: cc.Node,
    },
    onLoad() {
        this.addSocketEvent();
    },
    addSocketEvent() {
        Linker.Event.addEventListener(110710, this.onGetBetSetting, this);
    },

    removeSocketEvent() {
        Linker.Event.removeEventListener(110710, this.onGetBetSetting, this);
    },
    onDestroy() {
        this.removeSocketEvent();
    },
    onGetBetSetting(message) {
        if (message.status == 1) {
            var arrCovert = message.tempArray.map(item => Number(item));
            Linker.betCreateTable = arrCovert;
            var _tmparrBetSettings = cc.js.array.copy(arrCovert); //[...[i18n.t("Tất cả")], ...arrCovert];
            if (this.arrBetSettings != _tmparrBetSettings) {
                this.arrBetSettings = _tmparrBetSettings;
            }
            this.initListBtnFilter();
        }
    },
    setBillardLobby: function (BillardLobby) {
        this.BillardLobby = BillardLobby;
    },
    initListBtnFilter() {
        if (this.arrBetSettings) {

            if (this.BillardLobby && cc.isValid(this.BillardLobby)) {
                this.BillardLobby.removeSafeItemBetLobbyNodePool(this.content);
                // this.content.destroyAllChildren();
                var tableZindex = 5;

                for (var i = 0; i < this.arrBetSettings.length; i++) {
                    var node = null;
                    if (i >= 0 && i < this.content.children.length) {
                        node = this.content.children[i];
                    } else {
                        node = this.BillardLobby.getItemBet();
                        this.content.addChild(node);
                    }
                    if (node && cc.isValid(node)) {
                        node.active = true;
                        var betSettingItem = node.getComponent("betSettingItem");
                        var value = this.arrBetSettings[i];

                        betSettingItem.updateCell({ label: value });
                        if (value == this.arrBetSettings[0]/*i18n.t("Tất cả")*/) {
                            betSettingItem.bgOn.active = true;
                            betSettingItem.bgOff.active = true;
                        } else {
                            betSettingItem.bgOn.active = false;
                            betSettingItem.bgOff.active = true;
                        }
                        node.zIndex = tableZindex;
                        tableZindex += 10;
                    }
                }

                if (this.BillardLobby.firstCashBet !== "" && this.arrBetSettings.includes(Number(this.BillardLobby.firstCashBet))) {
                    this.BillardLobby.filterRooms(this.BillardLobby.firstCashBet);
                } else {
                    this.BillardLobby.filterRooms(this.arrBetSettings[0]);
                }
                //
                this.content.sortAllChildren();
                this.zoneCurrentBet();
            }
        }
    },
    activeBgBtn: function () {
        const listBtnFilter = this.content.getChildren();
        if (listBtnFilter) {
            if (listBtnFilter.length > 0) {
                listBtnFilter[0].getComponent("betSettingItem").bgOn.active = true;
                listBtnFilter[0].getComponent("betSettingItem").bgOff.active = true;
                for (let i = 1; i < listBtnFilter.length; i++) {
                    listBtnFilter[i].getComponent("betSettingItem").bgOn.active = false;
                    listBtnFilter[i].getComponent("betSettingItem").bgOff.active = true;
                }
            }
        }
    },
    zoneCurrentBet() {
        if (this.BillardLobby && cc.isValid(this.BillardLobby)) {
            this.content.sortAllChildren();
            this.BillardLobby.firstCashBet = Number(this.BillardLobby.firstCashBet)
            if (this.arrBetSettings.indexOf(this.BillardLobby.firstCashBet) == -1) {
                this.BillardLobby.firstCashBet = Number(this.arrBetSettings[0]);
            }
            for (var i = 0; i < this.content.childrenCount; ++i) {
                var textMoney = this.content.children[i].getChildByName("label").getComponent(cc.Label).string;
                textMoney = Utils.Malicious.convertMoney(textMoney);
                if (this.BillardLobby.firstCashBet == Number(textMoney)) {
                    this.content.children[i].getComponent("betSettingItem").bgOn.active = true;
                    this.content.children[i].getComponent("betSettingItem").bgOff.active = true;
                } else {
                    this.content.children[i].getComponent("betSettingItem").bgOn.active = false;
                    this.content.children[i].getComponent("betSettingItem").bgOff.active = true;
                }
            }
        }
    }
});